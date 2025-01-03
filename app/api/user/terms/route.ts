import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ethers } from 'ethers';

export async function POST(req: Request) {
    try {
        const { address, signature } = await req.json()

        const userAddress = ethers.getAddress(address) as string;

        const user = await prisma.user.update({
            where: { address: userAddress },
            data: {
                termsSignature: signature,
                termsSignedAt: new Date()
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update terms signature' }, { status: 500 })
    }
}