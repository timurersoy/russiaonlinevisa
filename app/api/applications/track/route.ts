import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const applicationNumber = searchParams.get('applicationNumber');

        if (!applicationNumber) {
            return NextResponse.json(
                { error: 'Application number is required' },
                { status: 400 }
            );
        }

        // Extract the numeric part from APP-XXXX format
        const publicIdStr = applicationNumber.replace(/^APP-/, '');
        const publicId = parseInt(publicIdStr, 10);

        if (isNaN(publicId)) {
            return NextResponse.json(
                { error: 'Invalid application number format' },
                { status: 400 }
            );
        }

        // Find the application by publicId
        const application = await prisma.application.findFirst({
            where: {
                publicId: publicId
            },
            select: {
                id: true,
                publicId: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                nationality: true,
                travelDate: true
            }
        });

        if (!application) {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            application: {
                applicationNumber: `APP-${application.publicId}`,
                status: application.status,
                submittedDate: application.createdAt,
                lastUpdated: application.updatedAt,
                nationality: application.nationality,
                travelDate: application.travelDate
            }
        });

    } catch (error) {
        console.error('Error tracking application:', error);
        return NextResponse.json(
            { error: 'Failed to track application' },
            { status: 500 }
        );
    }
}
