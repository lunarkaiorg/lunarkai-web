import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { data } = await axios.get(
            `${process.env.API_URL}/status`,
            {
                headers: {
                    'X-API-Key': `${process.env.API_KEY}`
                }
            }
        );

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Could not fetch status' },
            { status: 500 }
        );
    }
}