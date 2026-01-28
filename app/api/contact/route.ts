import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

// Dinamik olmaya zorla
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // 1. Veritabanına Kaydet
    try {
      await prisma.contactSubmission.create({
        data: {
          name,
          email,
          subject,
          message,
        },
      });
    } catch (dbError) {
      console.error('Database Error:', dbError);
      // Veritabanı hatası olsa bile mail göndermeyi dene
    }

    // 2. E-posta Gönderimi (Zaman aşımı ayarlarıyla)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT), // Vercel'de buranın 587 olduğundan emin ol!
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      // YENİ EKLENEN KISIM: Bağlantı kopmaması için bekleme süreleri
      connectionTimeout: 10000, // 10 saniye bekle
      greetingTimeout: 10000,   // Selamlaşma için 10 saniye bekle
      socketTimeout: 10000,     // Soket için 10 saniye bekle
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
      { error: 'Internal Server Error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}