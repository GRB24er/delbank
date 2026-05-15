// src/app/api/transfers/internal/route.ts
// INTERNAL TRANSFERS - IMMEDIATE DEDUCTION (own accounts, no approval required)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { sendTransactionEmail } from "@/lib/mail";

interface InternalTransferRequest {
  fromAccount: 'checking' | 'savings' | 'investment';
  toAccount: 'checking' | 'savings' | 'investment';
  amount: number | string;
  description?: string;
  transferType?: 'instant' | 'scheduled';
  scheduledDate?: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Internal Transfer] 💸 Initiated');
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log('[Internal Transfer] ❌ Unauthorized');
      return NextResponse.json(
        { success: false, error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const body: InternalTransferRequest = await request.json();
    const { fromAccount, toAccount, amount, description } = body;

    // Validation
    if (!fromAccount || !toAccount) {
      return NextResponse.json(
        { success: false, error: "Both source and destination accounts are required" },
        { status: 400 }
      );
    }

    if (fromAccount === toAccount) {
      return NextResponse.json(
        { success: false, error: "Cannot transfer to the same account" },
        { status: 400 }
      );
    }

    // ALWAYS POSITIVE AMOUNT
    const transferAmount = Math.abs(
      typeof amount === 'string' 
        ? parseFloat(amount.replace(/[^0-9.-]/g, ''))
        : Number(amount)
    );

    if (isNaN(transferAmount) || transferAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount. Please enter a valid number greater than 0" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User account not found" },
        { status: 404 }
      );
    }

    console.log('[Internal Transfer] 👤 User:', user._id);

    // Resolve balance fields for both accounts
    const balanceFieldMap: { [key: string]: string } = {
      'checking': 'checkingBalance',
      'savings': 'savingsBalance',
      'investment': 'investmentBalance'
    };

    const fromBalanceField = balanceFieldMap[fromAccount];
    const toBalanceField = balanceFieldMap[toAccount];
    const currentFromBalance = Number((user as any)[fromBalanceField] || 0);
    const currentToBalance = Number((user as any)[toBalanceField] || 0);

    console.log('[Internal Transfer] 💰 Balance check:', {
      fromAccount,
      currentBalance: currentFromBalance,
      requiredAmount: transferAmount
    });

    if (transferAmount > currentFromBalance) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient funds",
          details: {
            available: currentFromBalance,
            requested: transferAmount,
            shortfall: transferAmount - currentFromBalance
          }
        },
        { status: 400 }
      );
    }

    // Generate unique reference
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const transferRef = `INT-${timestamp}-${random}`;

    console.log('[Internal Transfer] 📝 Reference:', transferRef);

    const newFromBalance = currentFromBalance - transferAmount;
    const newToBalance = currentToBalance + transferAmount;

    let transferOutTransaction: any;
    let transferInTransaction: any;

    // Atomically debit + credit + record both transactions.
    // Falls back to a non-transactional path on standalone MongoDB
    // (replica-set / sharded clusters required for sessions).
    const mongoSession = await mongoose.startSession();
    let usedTransaction = true;
    try {
      try {
        await mongoSession.withTransaction(async () => {
          const updated = await User.findOneAndUpdate(
            {
              _id: user._id,
              [fromBalanceField]: { $gte: transferAmount }
            },
            {
              $inc: {
                [fromBalanceField]: -transferAmount,
                [toBalanceField]: transferAmount
              }
            },
            { new: true, session: mongoSession }
          );

          if (!updated) {
            throw new Error('Insufficient funds');
          }

          [transferOutTransaction] = await Transaction.create([{
            userId: user._id,
            type: 'transfer-out',
            currency: 'USD',
            amount: transferAmount,
            description: description?.trim() || `Transfer to ${toAccount}`,
            status: 'completed',
            accountType: fromAccount,
            posted: true,
            postedAt: new Date(),
            reference: `${transferRef}-OUT`,
            channel: 'online',
            origin: 'internal_transfer',
            date: new Date(),
            metadata: {
              fromAccount,
              toAccount,
              isInternalTransfer: true,
              linkedReference: `${transferRef}-IN`,
              balanceAfter: newFromBalance
            }
          }], { session: mongoSession });

          [transferInTransaction] = await Transaction.create([{
            userId: user._id,
            type: 'transfer-in',
            currency: 'USD',
            amount: transferAmount,
            description: description?.trim() || `Transfer from ${fromAccount}`,
            status: 'completed',
            accountType: toAccount,
            posted: true,
            postedAt: new Date(),
            reference: `${transferRef}-IN`,
            channel: 'online',
            origin: 'internal_transfer',
            date: new Date(),
            metadata: {
              fromAccount,
              toAccount,
              isInternalTransfer: true,
              linkedReference: `${transferRef}-OUT`,
              balanceAfter: newToBalance
            }
          }], { session: mongoSession });
        });
      } catch (txnErr: any) {
        const message = String(txnErr?.message || '');
        const isUnsupported =
          message.includes('Transaction numbers are only allowed') ||
          message.includes('replica set') ||
          txnErr?.code === 20 ||
          txnErr?.codeName === 'IllegalOperation';

        if (!isUnsupported) throw txnErr;

        // Standalone MongoDB fallback — guarded conditional update
        usedTransaction = false;
        const updated = await User.findOneAndUpdate(
          {
            _id: user._id,
            [fromBalanceField]: { $gte: transferAmount }
          },
          {
            $inc: {
              [fromBalanceField]: -transferAmount,
              [toBalanceField]: transferAmount
            }
          },
          { new: true }
        );

        if (!updated) {
          throw new Error('Insufficient funds');
        }

        try {
          transferOutTransaction = await Transaction.create({
            userId: user._id,
            type: 'transfer-out',
            currency: 'USD',
            amount: transferAmount,
            description: description?.trim() || `Transfer to ${toAccount}`,
            status: 'completed',
            accountType: fromAccount,
            posted: true,
            postedAt: new Date(),
            reference: `${transferRef}-OUT`,
            channel: 'online',
            origin: 'internal_transfer',
            date: new Date(),
            metadata: {
              fromAccount,
              toAccount,
              isInternalTransfer: true,
              linkedReference: `${transferRef}-IN`,
              balanceAfter: newFromBalance
            }
          });

          transferInTransaction = await Transaction.create({
            userId: user._id,
            type: 'transfer-in',
            currency: 'USD',
            amount: transferAmount,
            description: description?.trim() || `Transfer from ${fromAccount}`,
            status: 'completed',
            accountType: toAccount,
            posted: true,
            postedAt: new Date(),
            reference: `${transferRef}-IN`,
            channel: 'online',
            origin: 'internal_transfer',
            date: new Date(),
            metadata: {
              fromAccount,
              toAccount,
              isInternalTransfer: true,
              linkedReference: `${transferRef}-OUT`,
              balanceAfter: newToBalance
            }
          });
        } catch (recordErr) {
          // Compensate the balance change if we can't persist the ledger entries
          await User.findByIdAndUpdate(user._id, {
            $inc: {
              [fromBalanceField]: transferAmount,
              [toBalanceField]: -transferAmount
            }
          });
          throw recordErr;
        }
      }
    } catch (err: any) {
      await mongoSession.endSession();
      if (String(err?.message || '').includes('Insufficient funds')) {
        return NextResponse.json(
          {
            success: false,
            error: "Insufficient funds",
            details: {
              available: currentFromBalance,
              requested: transferAmount,
              shortfall: transferAmount - currentFromBalance
            }
          },
          { status: 400 }
        );
      }
      throw err;
    }
    await mongoSession.endSession();

    console.log('[Internal Transfer] 💾 Transfer-out created:', transferOutTransaction._id);
    console.log('[Internal Transfer] 💾 Transfer-in created:', transferInTransaction._id);
    console.log('[Internal Transfer] 💰 Balances updated:', {
      [fromBalanceField]: { old: currentFromBalance, new: newFromBalance },
      [toBalanceField]: { old: currentToBalance, new: newToBalance }
    });

    // Send confirmation emails for both legs (best-effort)
    try {
      await sendTransactionEmail(user.email, {
        name: user.name || 'Customer',
        transaction: transferOutTransaction
      });

      await sendTransactionEmail(user.email, {
        name: user.name || 'Customer',
        transaction: transferInTransaction
      });

      console.log('[Internal Transfer] ✅ Emails sent');
    } catch (emailError) {
      console.error('[Internal Transfer] ❌ Email failed:', emailError);
    }

    console.log('[Internal Transfer] ✅ Transfer completed', {
      atomic: usedTransaction
    });

    return NextResponse.json({
      success: true,
      message: "Transfer completed successfully.",
      transferReference: transferRef,
      transfer: {
        type: 'internal',
        from: fromAccount,
        to: toAccount,
        amount: transferAmount,
        description: description || 'Internal Transfer',
        reference: transferRef,
        status: 'completed',
        date: new Date().toISOString()
      },
      balances: {
        checking: fromAccount === 'checking'
          ? newFromBalance
          : toAccount === 'checking'
            ? newToBalance
            : Number(user.checkingBalance || 0),
        savings: fromAccount === 'savings'
          ? newFromBalance
          : toAccount === 'savings'
            ? newToBalance
            : Number(user.savingsBalance || 0),
        investment: fromAccount === 'investment'
          ? newFromBalance
          : toAccount === 'investment'
            ? newToBalance
            : Number(user.investmentBalance || 0)
      },
      transactions: [
        {
          id: transferOutTransaction._id,
          reference: transferOutTransaction.reference,
          status: 'completed'
        },
        {
          id: transferInTransaction._id,
          reference: transferInTransaction.reference,
          status: 'completed'
        }
      ]
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Internal Transfer] ❌ Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: "An unexpected error occurred. Please try again.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// GET - Fetch internal transfer history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const accountType = searchParams.get('account');

    const query: any = {
      userId: user._id,
      origin: 'internal_transfer'
    };

    if (accountType) {
      query.accountType = accountType;
    }

    const internalTransfers = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Group transfers by reference pair
    const transfersByRef: { [key: string]: any[] } = {};
    internalTransfers.forEach((tx: any) => {
      const baseRef = tx.reference.replace(/-OUT$|-IN$/, '');
      if (!transfersByRef[baseRef]) {
        transfersByRef[baseRef] = [];
      }
      transfersByRef[baseRef].push(tx);
    });

    const formattedTransfers = Object.entries(transfersByRef).map(([ref, txs]) => {
      const outTx = txs.find(tx => tx.reference.includes('-OUT'));
      const inTx = txs.find(tx => tx.reference.includes('-IN'));
      
      return {
        reference: ref,
        date: outTx?.date || inTx?.date,
        amount: outTx?.amount || inTx?.amount,
        fromAccount: outTx?.accountType,
        toAccount: inTx?.accountType,
        description: outTx?.description || inTx?.description,
        status: outTx?.status || inTx?.status,
        posted: outTx?.posted && inTx?.posted,
        transactions: txs.map(tx => ({
          id: tx._id.toString(),
          type: tx.type,
          reference: tx.reference,
          account: tx.accountType,
          amount: tx.amount,
          status: tx.status,
          posted: tx.posted,
          postedAt: tx.postedAt
        }))
      };
    });

    return NextResponse.json({
      success: true,
      internalTransfers: formattedTransfers,
      total: formattedTransfers.length,
      currentBalances: {
        checking: user.checkingBalance || 0,
        savings: user.savingsBalance || 0,
        investment: user.investmentBalance || 0
      }
    });

  } catch (error: any) {
    console.error('[Internal Transfer] ❌ GET Error:', error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch internal transfer history" },
      { status: 500 }
    );
  }
}