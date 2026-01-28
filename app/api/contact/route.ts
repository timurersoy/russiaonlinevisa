import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

// Dinamik olmaya zorla (Statik hatasını önlemek için)
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // 1. Veritabanına Kaydet
    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    // 2. E-posta Gönderimi
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // DÜZELTME: Genellikle 587 portu için false olmalıdır
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false // Sertifika hatalarını önlemek için garanti ayar
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `Yeni İletişim Formu: ${subject}`,
      text: `Gönderen: ${name} (${email})\n\nMesaj:\n${message}`,
      html: `<p><strong>Gönderen:</strong> ${name} (${email})</p><p><strong>Konu:</strong> ${subject}</p><p><strong>Mesaj:</strong><br/>${message}</p>`,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}