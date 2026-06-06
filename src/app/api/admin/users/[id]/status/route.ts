// src/app/api/admin/users/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendSimpleEmail } from '@/lib/mail';

const VALID_STATUSES = ['active', 'frozen', 'blocked', 'closed'] as const;
type AccountStatus = (typeof VALID_STATUSES)[number];

const STATUS_COPY: Record<Exclude<AccountStatus, 'active'>, { title: string; verb: string }> = {
  frozen: { title: 'Account Frozen', verb: 'frozen' },
  blocked: { title: 'Account Blocked', verb: 'blocked' },
  closed: { title: 'Account Closed', verb: 'closed' },
};

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));
    const status = String(body?.status || '').toLowerCase() as AccountStatus;
    const reason = typeof body?.reason === 'string' ? body.reason.trim() : '';

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }
    if (status !== 'active' && !reason) {
      return NextResponse.json(
        { error: 'A reason is required when restricting an account.' },
        { status: 400 }
      );
    }

    await connectDB();

    const user: any = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const previousStatus = user.accountStatus || 'active';

    user.accountStatus = status;
    user.statusReason = status === 'active' ? '' : reason;
    user.statusUpdatedAt = new Date();
    user.statusUpdatedBy = session.user.email || 'admin';
    await user.save();

    // Notify the customer by email (non-blocking — never fail the request on email).
    try {
      if (status === 'active') {
        const subject = 'Account Access Restored';
        const text =
          `Hello ${user.name || 'Customer'},\n\n` +
          `Access to your account has been restored. You can now sign in as usual.\n\n` +
          `If you did not expect this change, please contact support immediately.`;
        const html =
          `<p>Hello ${user.name || 'Customer'},</p>` +
          `<p>Access to your account has been <strong>restored</strong>. You can now sign in as usual.</p>` +
          `<p>If you did not expect this change, please contact support immediately.</p>`;
        await sendSimpleEmail(user.email, subject, text, html);
      } else {
        const copy = STATUS_COPY[status];
        const subject = copy.title;
        const text =
          `Hello ${user.name || 'Customer'},\n\n` +
          `Your account has been ${copy.verb}.\n\n` +
          `Reason: ${reason}\n\n` +
          `While your account is ${copy.verb}, you will not be able to sign in. ` +
          `If you believe this is a mistake, please contact support.`;
        const html =
          `<p>Hello ${user.name || 'Customer'},</p>` +
          `<p>Your account has been <strong>${copy.verb}</strong>.</p>` +
          `<div style="background:#fef2f2;border-left:4px solid #dc2626;padding:12px 16px;border-radius:6px;margin:16px 0;">` +
          `<strong>Reason:</strong> ${reason}</div>` +
          `<p>While your account is ${copy.verb}, you will not be able to sign in. ` +
          `If you believe this is a mistake, please contact support.</p>`;
        await sendSimpleEmail(user.email, subject, text, html);
      }
    } catch (emailError) {
      console.error('[status] notification email failed:', emailError);
    }

    return NextResponse.json({
      success: true,
      message:
        status === 'active'
          ? 'Account access restored.'
          : `Account ${status}.`,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        accountStatus: user.accountStatus,
        statusReason: user.statusReason,
        statusUpdatedAt: user.statusUpdatedAt,
        statusUpdatedBy: user.statusUpdatedBy,
      },
      previousStatus,
    });
  } catch (err: any) {
    console.error('Account status update error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to update account status' },
      { status: 500 }
    );
  }
}
