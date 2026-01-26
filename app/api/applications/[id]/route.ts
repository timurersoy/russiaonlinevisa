import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 1. Auth Check
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_session')?.value;

        if (!token) {
            const receivedCookies = cookieStore.getAll().map(c => c.name).join(', ');
            console.error('PATCH /api/applications/[id]: Invalid session. Cookies received:', receivedCookies);
            return NextResponse.json({
                success: false,
                message: `Invalid session. Cookies received: ${receivedCookies || 'none'}`
            }, { status: 401 });
        }

        try {
            jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
        }

        // 2. Get Data
        const body = await request.json();
        const { status, paymentStatus } = body;
        const { id } = await params;

        // 3. Update DB
        const updatedApp = await prisma.application.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(paymentStatus && { paymentStatus }),
            },
        });

        return NextResponse.json({ success: true, application: updatedApp });

    } catch (error: any) {
        console.error('PATCH /api/applications/[id] Error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Update failed',
            details: JSON.stringify(error)
        }, { status: 500 });
    }
}
