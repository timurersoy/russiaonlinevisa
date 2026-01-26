import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const publicId = parseInt(id);

        if (isNaN(publicId)) {
            return NextResponse.json({ success: false, message: 'Invalid ID format' }, { status: 400 });
        }

        const application = await prisma.application.findFirst({
            where: { publicId: publicId },
            select: { status: true }
        });

        if (!application) {
            return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, status: application.status });

    } catch (error) {
        console.error('Track API Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
