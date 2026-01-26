import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Log the attempt
        console.log('Contact form submission:', { name, email, subject, message });

        let savedRequestId = '';

        // Save to Database (Best Effort) and Send Email
        try {
            await prisma.$transaction(async (tx: any) => {
                // 1. Get next ID
                const counter = await tx.counter.upsert({
                    where: { name: 'contact' },
                    update: { value: { increment: 1 } },
                    create: { name: 'contact', value: 5100 },
                });
                const publicId = counter.value;
                const requestId = `REQ-${publicId}`;
                savedRequestId = requestId;

                // 2. Save Request
                await tx.contactRequest.create({
                    data: {
                        publicId: publicId,
                        name,
                        email,
                        subject,
                        message
                    }
                });
                console.log('Saved contact request to database');

                // 3. Send email INSIDE transaction
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: Number(process.env.SMTP_PORT || '465'),
                    secure: true,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });

                await transporter.sendMail({
                    from: `"${name}" <${process.env.SMTP_FROM || 'no-reply@example.com'}>`,
                    to: process.env.ADMIN_EMAIL || 'info@russiaonlinevisa.com',
                    replyTo: email,
                    subject: `Contact #${requestId}: ${subject}`,
                    text: `Request ID: ${requestId}\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                    html: `
                        <h3>New Contact Form Submission</h3>
                        <div style="background-color: #e5e7eb; padding: 5px 10px; display: inline-block; border-radius: 4px; font-weight: bold; margin-bottom: 10px;">
                            ID: ${requestId}
                        </div>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <br/>
                        <p><strong>Message:</strong></p>
                        <p>${message.replace(/\n/g, '<br>')}</p>
                    `,
                });

                console.log(`Email sent successfully for ${requestId}`);
            });

        } catch (dbError: any) {
            console.error('Failed to process contact request:', dbError);
            return NextResponse.json(
                { success: false, message: 'Failed to send message' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            requestId: savedRequestId
        });

    } catch (error) {
        console.error('Error processing contact form:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send message' },
            { status: 500 }
        );
    }
}
