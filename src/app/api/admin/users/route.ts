// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Escape user input before using it inside a RegExp so queries like "j." or
// "a+" are treated literally instead of crashing or matching everything.
function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function GET(req: NextRequest) {
  try {
    // Customer PII is admin-only.
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', users: [], total: 0 },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const rawLimit = parseInt(searchParams.get('limit') || '50', 10) || 50;
    const limit = Math.min(200, Math.max(1, rawLimit)); // cap 200, default 50
    const skip = (page - 1) * limit;

    // Build the search filter: case-insensitive match across name, email and
    // accountNumber. Empty query returns everyone (paginated).
    let filter: Record<string, any> = {};
    if (q) {
      const rx = new RegExp(escapeRegex(q), 'i');
      filter = { $or: [{ name: rx }, { email: rx }, { accountNumber: rx }] };
    }

    const projection =
      'name email accountNumber routingNumber role verified accountStatus statusReason ' +
      'checkingBalance savingsBalance investmentBalance createdAt updatedAt';

    const [docs, total] = await Promise.all([
      User.find(filter)
        .select(projection)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    const users = docs.map((u: any) => ({
      _id: u._id.toString(),
      name: u.name || 'Unknown User',
      email: u.email || '',
      accountNumber: u.accountNumber || '',
      routingNumber: u.routingNumber || '',
      role: u.role || 'user',
      verified: Boolean(u.verified),
      accountStatus: u.accountStatus || 'active',
      statusReason: u.statusReason || '',
      checkingBalance: Number(u.checkingBalance) || 0,
      savingsBalance: Number(u.savingsBalance) || 0,
      investmentBalance: Number(u.investmentBalance) || 0,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    return NextResponse.json(
      {
        success: true,
        users,
        total,
        page,
        limit,
        hasMore: skip + users.length < total,
      },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in users API route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch users',
        users: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}
