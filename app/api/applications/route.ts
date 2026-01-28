import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

// YARDIMCI: Tarih formatı düzeltici (DD.MM.YYYY veya bozuk tarihleri düzeltir)
function parseDateString(dateStr: any): Date | null {
  if (!dateStr) return null;
  try {
    if (typeof dateStr === 'string' && dateStr.includes('.')) {
      const parts = dateStr.split('.');
      if (parts.length === 3) {
        // Gün.Ay.Yıl -> Yıl-Ay-Gün
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    }
    return new Date(dateStr);
  } catch (e) {
    console.error("Tarih hatası:", dateStr);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("GELEN BAŞVURU:", JSON.stringify(body, null, 2));

    // 1. Veri Eşleştirme (Frontend'den ne gelirse gelsin yakala)
    const firstName = body.firstName || body.name || body.applicantName || "İsimsiz";
    const lastName = body.lastName || body.surname || "";
    const email = body.email;
    const phone = body.phone || body.phoneNumber;
    
    // Tarihleri güvenli çevir
    let travelDate = parseDateString(body.travelDate);
    // Eğer tarih hala bozuksa veya yoksa, hatayı önlemek için bugünü veya ileri bir tarihi ata
    if (!travelDate || isNaN(travelDate.getTime())) {
        console.log("Travel Date geçersiz, varsayılan atanıyor.");
        travelDate = new Date(); 
    }

    const passportExpiry = parseDateString(body.passportExpiry);

    // 2. Sayaç (APP-ID)
    const counter = await prisma.counter.upsert({
      where: { name: 'application_id' },
      update: { value: { increment: 1 } },
      create: { name: 'application_id', value: 1000 },
    });
    const publicId = counter.value;

    // 3. Kayıt
    const newApplication = await prisma.application.create({
      data: {
        publicId,
        firstName,
        lastName,
        email,
        phone,
        passportNumber: body.passportNumber || "Yok",
        nationality: body.nationality || "Yok",
        gender: body.gender,
        travelDate: travelDate,
        passportExpiry: passportExpiry,
        additionalData: body.additionalData ? JSON.stringify(body.additionalData) : null,
        privacyConsent: Boolean(body.privacyConsent),
        serviceConsent: Boolean(body.serviceConsent)
      },
    });

    // 4. E-posta (Mail gitmezse bile sistem çökmesin diye try-catch)
    try {
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
          subject: `YENİ BAŞVURU: APP-${publicId} (${firstName} ${lastName})`,
          html: `<h3>Başvuru Alındı: APP-${publicId}</h3><p>${firstName} ${lastName}</p>`,
        });
    } catch (mailErr) {
        console.error("Mail gönderilemedi ama başvuru kaydedildi:", mailErr);
    }

    return NextResponse.json({ success: true, applicationId: newApplication.id, publicId }, { status: 200 });

  } catch (error: any) {
    console.error('Application Critical Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}