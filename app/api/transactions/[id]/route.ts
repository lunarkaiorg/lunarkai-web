import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/authMiddleware';

export async function POST(
   req: Request,
   { params }: { params: { id: string } }
) {
    const clonedReq = req.clone();
    const body = await clonedReq.json();
    const { hash, userId } = body;

    const auth = await verifyToken(req, userId);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

   try {
       const { id } = params;

       const transaction = await prisma.transaction.update({
           where: { id },
           data: { hash }
       });

       return NextResponse.json(transaction);
   } catch (error) {
       console.error('Error updating transaction:', error);
       return NextResponse.json(
           { error: 'Failed to update transaction' },
           { status: 500 }
       );
   }
}