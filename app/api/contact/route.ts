import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // 1. Veritabanına Kaydet (Hata olsa bile devam et)
    try {
      await prisma.contactSubmission.create({
        data: { name, email, subject, message },
      });
    } catch (dbError) {
      console.error('Database Error:', dbError);
    }

    // 2. E-posta Gönderimi
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT), // 587 (veya 465)
      secure: false, // 587 için false, 465 için true (Sunucuna göre değişebilir ama genelde false/587 çalışır)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    await transporter.sendMail({
      // KRİTİK DÜZELTME BURADA:
      // Gönderen (From) mutlaka senin giriş yaptığın mail olmalı.
      // SMTP_FROM yerine direkt SMTP_USER kullanıyoruz ki hata şansı kalmasın.
      from: process.env.SMTP_USER, 
      
      to: process.env.ADMIN_EMAIL, // Mail kime gidecek? (Sana)
      
      // Ziyaretçinin mailini buraya koyuyoruz.
      // "Yanıtla" dediğinde bu adrese gidecek.
      replyTo: email, 
      
      subject: `Yeni İletişim Formu: ${subject}`,
      text: `Gönderen: ${name} (${email})\n\nMesaj:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h3>Yeni İletişim Formu Mesajı</h3>
          <p><strong>Gönderen:</strong> ${name}</p>
          <p><strong>E-posta:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Konu:</strong> ${subject}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Mesaj:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('API Error:', error);
    // Hata detayını logda görmek için mesajı döndürüyoruz
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}