// src/app/api/admin/email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendSimpleEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const userId = body?.userId ? String(body.userId) : '';
    const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required.' },
        { status: 400 }
      );
    }

    // Resolve the recipient either from a user id or an explicit address.
    let to = typeof body?.to === 'string' ? body.to.trim() : '';
    let name = '';
    if (userId) {
      await connectDB();
      const user: any = await User.findById(userId).select('name email');
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      to = user.email;
      name = user.name || '';
    }

    if (!to) {
      return NextResponse.json({ error: 'No recipient specified.' }, { status: 400 });
    }

    const greeting = name ? `Hello ${name},` : 'Hello,';
    const text = `${greeting}\n\n${message}`;
    const html =
      `<p>${greeting}</p>` +
      `<div style="white-space:pre-wrap;font-size:15px;color:#475569;line-height:1.7;">${message}</div>`;

    const result: any = await sendSimpleEmail(to, subject, text, html);

    if (result?.failed) {
      return NextResponse.json(
        { error: result?.error || 'Failed to send email.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: `Email sent to ${to}.` });
  } catch (err: any) {
    console.error('Admin email send error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
