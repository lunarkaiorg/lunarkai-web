// app/api/user/route.ts
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { generateAndSaveSessionToken } from '@/lib/jwt'
import { ethers } from 'ethers';
import axios from 'axios';
import { verifyToken } from '@/lib/authMiddleware';

export async function POST(req: Request) {
    try {
        const { address } = await req.json()
        const userAddress = ethers.getAddress(address) as string;
        const user = await prisma.user.create({
            data: { address: userAddress }
        })
        const token = await generateAndSaveSessionToken(user)
        return NextResponse.json({ user, token })
    } catch (error) {
        console.error('User creation error:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    const clonedReq = req.clone();
    const body = await clonedReq.json();
    const { sessionId, userId } = body;

    const auth = await verifyToken(req, userId);
    if ('error' in auth) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const existingPayment = await prisma.payment.findFirst({
            where: {
                OR: [
                    { sessionId: sessionId },
                ]
            }
        });

        if (existingPayment) {
            return NextResponse.json(
                { error: 'Payment already processed before' },
                { status: 400 }
            );
        }

        const options = {
            method: 'GET',
            url: `https://api.copperx.io/api/v1/checkout/sessions/${sessionId}`,
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${process.env.COPPERX_API_KEY}`
            }
        };

        const response = await axios(options);
        const session = response.data;

        if (session.status === 'complete' && session.paymentStatus === 'paid') {
            const txHash = session.paymentIntent.transactions[0].transactionHash;
            const amount = Number(ethers.formatUnits(session.amountNet, 8)); 

            if (!txHash) {
                return NextResponse.json(
                    { error: 'Transaction hash not found' },
                    { status: 400 }
                );
            }

            const existingTx = await prisma.payment.findFirst({
                where: { txHash: txHash }
            });

            if (existingTx) {
                return NextResponse.json(
                    { error: 'Transaction already processed before' },
                    { status: 400 }
                );
            }

            const result = await prisma.$transaction(async (prisma) => {
                const payment = await prisma.payment.create({
                    data: {
                        sessionId,
                        txHash,
                        amount,
                        userId
                    }
                });

                const updatedUser = await prisma.user.update({
                    where: { id: userId },
                    data: {
                        balance: {
                            increment: amount
                        }
                    }
                });

                return { payment, user: updatedUser };
            });

            return NextResponse.json({ 
                success: true, 
                user: result.user,
                payment: result.payment 
            });
        }

        return NextResponse.json(
            { error: 'Payment not completed' },
            { status: 400 }
        );

    } catch (error) {
        console.error('Balance update error:', error);
        return NextResponse.json(
            { error: 'Failed to update balance' },
            { status: 500 }
        );
    }
}