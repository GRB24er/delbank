// src/app/api/admin/transactions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import User from '@/models/User';

// GET - Get single transaction
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // Await params first
    const { id } = await params;
    
    const transaction = await Transaction.findById(id)
      .populate('userId', 'name email checkingBalance savingsBalance investmentBalance');
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      transaction
    });
    
  } catch (error: any) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch transaction',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Whitelisted fields the admin edit form is allowed to update
function buildUpdateData(body: any) {
  const updateData: any = {};

  if (body.amount !== undefined) updateData.amount = Number(body.amount);
  if (body.description !== undefined) updateData.description = body.description;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.accountType !== undefined) updateData.accountType = body.accountType;
  if (body.type !== undefined) updateData.type = body.type;
  if (body.reference !== undefined) updateData.reference = body.reference;

  // Preserve the admin's chosen date exactly. Only update when provided
  // and parseable; never silently fall back to "now".
  if (body.date !== undefined && body.date !== null && body.date !== '') {
    const parsed = new Date(body.date);
    if (!isNaN(parsed.getTime())) {
      updateData.date = parsed;
      updateData.editedDateByAdmin = true;
    }
  }

  return updateData;
}

// PATCH - Update transaction
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    await connectDB();

    const updateData = buildUpdateData(body);

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction updated successfully',
      transaction
    });

  } catch (error: any) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      {
        error: 'Failed to update transaction',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// PUT - Update transaction (alias for PATCH for compatibility)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    await connectDB();

    console.log('Updating transaction:', id, body);

    const updateData = buildUpdateData(body);

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction updated successfully',
      transaction
    });

  } catch (error: any) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      {
        error: 'Failed to update transaction',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete transaction
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await connectDB();
    
    const transaction = await Transaction.findByIdAndDelete(id);
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
    
  } catch (error: any) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete transaction',
        details: error.message
      },
      { status: 500 }
    );
  }
}
