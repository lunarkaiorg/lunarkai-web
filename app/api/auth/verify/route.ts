import { verifySessionToken } from '@/lib/jwt';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, sessionToken } = await req.json();
    
    if (!userId || !sessionToken) {
      return NextResponse.json(
        { valid: false },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      return NextResponse.json(
        { valid: false },
        { status: 404 }
      );
    }

    const isValid = await verifySessionToken(user, sessionToken);
    
    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { valid: false },
      { status: 401 }
    );
  }
}