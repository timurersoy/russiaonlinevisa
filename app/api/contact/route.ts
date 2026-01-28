import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Gelen verileri parçala (Başvuru formu alanları)
    const { 
      firstName, lastName, email, phone, 
      passportNumber, nationality, travelDate, 
      gender, passportExpiry, additionalData,
      privacyConsent, serviceConsent 
    } = body;

    // 1. Sayaç ile Benzersiz Numara (APP-ID) Oluştur
    const counter = await prisma.counter.upsert({
      where: { name: 'application_id' },
      update: { value: { increment: 1 } },
      create: { name: 'application_id', value: 1000 }, // 1000'den başlar
    });

    const publicId = counter.value;

    // 2. Veritabanına Kaydet
    const newApplication = await prisma.application.create({
      data: {
        publicId,
        firstName,
        lastName,
        email,
        phone,
        passportNumber,
        nationality,
        gender,
        travelDate: new Date(travelDate), // Tarih formatına çevir
        passportExpiry: passportExpiry ? new Date(passportExpiry) : null,
        additionalData: additionalData ? JSON.stringify(additionalData) : null,
        privacyConsent,
        serviceConsent
      },
    });

    // 3. E-posta Gönderimi (Admin'e Bildirim)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `Yeni Vize Başvurusu: APP-${publicId} (${firstName} ${lastName})`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Yeni Başvuru Alındı (APP-${publicId})</h2>
          <p><strong>Başvuran:</strong> ${firstName} ${lastName}</p>
          <p><strong>Pasaport:</strong> ${passportNumber}</p>
          <p><strong>Uyruk:</strong> ${nationality}</p>
          <p><strong>Seyahat Tarihi:</strong> ${new Date(travelDate).toLocaleDateString()}</p>
          <p><strong>Email:</strong> ${email}</p>
          <br/>
          <p>Detayları görmek için Admin Paneline gidiniz.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, applicationId: newApplication.id, publicId }, { status: 200 });

  } catch (error: any) {
    console.error('Application API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}