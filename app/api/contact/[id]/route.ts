import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    // 1. Verify Admin Session
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (!token) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        jwt.verify(token, JWT_SECRET);
    } catch {
        return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
    }

    // 2. Update Status
    try {
        const { read } = await request.json();

        const updated = await prisma.contactRequest.update({
            where: { id: params.id },
            data: { read }
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error('Error updating message status:', error);
        return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
    }
}
