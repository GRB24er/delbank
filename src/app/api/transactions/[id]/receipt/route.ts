// src/app/api/transactions/[id]/receipt/route.ts
// GET  -> download a PDF receipt for a transaction
// POST -> email that PDF receipt to the account holder
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { buildTransactionReceiptPdf, type ReceiptInput } from '@/lib/receipt';
import { isCreditTransaction, formatSignedAmount, prettyStatus } from '@/lib/txDisplay';
import { sendTransactionReceiptEmail } from '@/lib/mail';

// Load the transaction, verify the caller may see it, and assemble the data
// the receipt PDF needs. Returns either { error, status } or the resolved bits.
async function resolveReceipt(id: string, sessionEmail: string) {
  await connectDB();

  const requester: any = await User.findOne({ email: sessionEmail });
  if (!requester) return { error: 'User not found', status: 404 as const };

  const tx: any = await Transaction.findById(id).lean();
  if (!tx) return { error: 'Transaction not found', status: 404 as const };

  const isOwner = String(tx.userId) === String(requester._id);
  const isAdmin = requester.role === 'admin';
  if (!isOwner && !isAdmin) {
    return { error: 'Forbidden', status: 403 as const };
  }

  // The receipt always reflects the account that owns the transaction.
  const owner: any = isOwner ? requester : await User.findById(tx.userId);
  if (!owner) return { error: 'Account holder not found', status: 404 as const };

  const isCredit = isCreditTransaction(tx);
  const receiptNumber = `RCPT-${new Date(tx.date || tx.createdAt || Date.now()).getFullYear()}-${String(tx._id).slice(-8).toUpperCase()}`;

  const input: ReceiptInput = {
    receiptNumber,
    accountHolder: owner.name || 'Account Holder',
    accountNumber: owner.accountNumber,
    accountType: tx.accountType || 'checking',
    reference: tx.reference || String(tx._id),
    type: tx.type,
    description: tx.description,
    amount: Math.abs(Number(tx.amount) || 0),
    isCredit,
    currency: tx.currency || 'USD',
    status: tx.status,
    date: tx.date || tx.createdAt || new Date(),
    channel: tx.channel,
    balanceAfter: typeof tx.balanceAfter === 'number' ? tx.balanceAfter : null,
  };

  return { input, owner, tx, isCredit, receiptNumber };
}

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const resolved = await resolveReceipt(id, session.user.email);
    if ('error' in resolved) {
      return NextResponse.json({ success: false, error: resolved.error }, { status: resolved.status });
    }

    const pdf = buildTransactionReceiptPdf(resolved.input);
    // Wrap in a fresh Uint8Array so the body is a valid BodyInit for NextResponse.
    const body = new Uint8Array(pdf);

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Fregetrust_${resolved.receiptNumber}.pdf"`,
        'Content-Length': body.length.toString(),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('Receipt generation error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate receipt' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const resolved = await resolveReceipt(id, session.user.email);
    if ('error' in resolved) {
      return NextResponse.json({ success: false, error: resolved.error }, { status: resolved.status });
    }

    const { input, owner, tx, isCredit, receiptNumber } = resolved;
    const pdf = buildTransactionReceiptPdf(input);

    const result: any = await sendTransactionReceiptEmail(owner.email, {
      name: owner.name,
      receiptNumber,
      reference: input.reference,
      amountLabel: formatSignedAmount(tx, input.currency),
      type: input.type,
      status: prettyStatus(input.status),
      date: new Date(input.date).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }),
      isCredit,
      pdfBuffer: pdf,
      filename: `Fregetrust_${receiptNumber}.pdf`,
    });

    if (result?.failed) {
      return NextResponse.json(
        { success: false, error: result?.error || 'Failed to send receipt email' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: `Receipt emailed to ${owner.email}.` });
  } catch (error: any) {
    console.error('Receipt email error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to email receipt' },
      { status: 500 }
    );
  }
}
