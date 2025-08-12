import { PrismaClient } from '@/lib/generated/prisma';
import { NextResponse, NextRequest } from 'next/server';

//for returning the authorization of user with rfid_code
export async function POST(request: NextRequest) {
    const prisma = new PrismaClient();
    const { rfid_code } = await request.json();

    try {
        const authorization = await prisma.authorization.findUnique({
            where: { rfid_code },
        });

        if (!authorization) {
            return NextResponse.json({ error: 'Authorization not found' }, { status: 404 });
        }

        return NextResponse.json(authorization);
    } catch (error) {
        console.error('Error fetching authorization:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}