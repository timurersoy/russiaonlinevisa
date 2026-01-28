import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // 1. ÖNCE NUMARAYI OLUŞTUR (REQ-ID)
    const counter = await prisma.counter.upsert({
      where: { name: 'contact_id' },
      update: { value: { increment: 1 } },
      create: { name: 'contact_id', value: 100 },
    });

    const publicId = counter.value;

    // 2. VERİTABANINA BU NUMARAYLA KAYDET
    await prisma.contactSubmission.create({
      data: {
        publicId, // Artık ??? değil, 101, 102 gibi sayı olacak
        name,
        email,
        subject,
        message,
      },
    });

    // 3. MAİL GÖNDER
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `Yeni Mesaj: REQ-${publicId} - ${subject}`,
      html: `
        <h3>Yeni İletişim Mesajı (REQ-${publicId})</h3>
        <p><strong>Gönderen:</strong> ${name} (${email})</p>
        <p><strong>Konu:</strong> ${subject}</p>
        <p><strong>Mesaj:</strong><br/>${message}</p>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}