import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

async function getUserId(request) {
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const decoded = verifyToken(authHeader.slice(7));
    if (decoded?.userId) return decoded.userId;
  }
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get('token')?.value;
  if (cookieToken) {
    const decoded = verifyToken(cookieToken);
    if (decoded?.userId) return decoded.userId;
  }
  return null;
}

export async function POST(request) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { pushToken } = await request.json();
  if (!pushToken) return NextResponse.json({ error: 'pushToken required' }, { status: 400 });
  await prisma.user.update({ where: { id: userId }, data: { pushToken } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await prisma.user.update({ where: { id: userId }, data: { pushToken: null } });
  return NextResponse.json({ ok: true });
}
