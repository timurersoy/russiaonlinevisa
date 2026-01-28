import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { headers } from 'next/headers'; // IP Adresi için gerekli

export const dynamic = 'force-dynamic';

// YARDIMCI: Tarih düzeltici
function parseDateString(dateStr: any): Date | null {
  if (!dateStr) return null;
  try {
    if (typeof dateStr === 'string' && dateStr.includes('.')) {
      const parts = dateStr.split('.');
      if (parts.length === 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return new Date(dateStr);
  } catch (e) { return null; }
}

// YARDIMCI: Akıllı Veri Bulucu (İsimsiz sorununu çözer)
// Veri bazen direkt body'de, bazen "formData" veya "data" objesinin içinde gelir.
function getValue(body: any, keys: string[]): any {
  // 1. Direkt body içinde ara
  for (const key of keys) {
    if (body[key]) return body[key];
  }
  // 2. body.formData içinde ara
  if (body.formData) {
    for (const key of keys) {
      if (body.formData[key]) return body.formData[key];
    }
  }
  // 3. body.data içinde ara
  if (body.data) {
    for (const key of keys) {
      if (body.data[key]) return body.data[key];
    }
  }
  return undefined;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headersList = await headers();

    // 1. IP ve Tarayıcı Bilgilerini Yakala
    const ipAddress = headersList.get('x-forwarded-for') || 'Unknown IP';
    const userAgent = headersList.get('user-agent') || 'Unknown Browser';

    console.log("GELEN VERİ (DEBUG):", JSON.stringify(body, null, 2));

    // 2. Verileri "Akıllı" Şekilde Çek
    // Frontend farklı isimler kullanıyor olabilir, hepsini deniyoruz.
    const firstName = getValue(body, ['firstName', 'name', 'applicantName', 'givenName']) || "İsimsiz";
    const lastName = getValue(body, ['lastName', 'surname', 'familyName']) || "";
    const email = getValue(body, ['email', 'contactEmail']);
    const phone = getValue(body, ['phone', 'phoneNumber', 'mobile']);
    const passportNumber = getValue(body, ['passportNumber', 'passportNo']) || "Yok";
    const nationality = getValue(body, ['nationality', 'citizenship']) || "Turkey";
    const gender = getValue(body, ['gender', 'sex']);
    
    // Tarihler
    const travelDateRaw = getValue(body, ['travelDate', 'arrivalDate', 'dateOfArrival']);
    let travelDate = parseDateString(travelDateRaw);
    if (!travelDate || isNaN(travelDate.getTime())) travelDate = new Date();

    const passportExpiryRaw = getValue(body, ['passportExpiry', 'passportExpirationDate']);
    const passportExpiry = parseDateString(passportExpiryRaw);

    // Ek Veriler (Dosyalar ve Onaylar)
    const additionalDataObj = {
        passportCover: getValue(body, ['passportCover', 'passportCoverUrl', 'files.passportCover']),
        photo: getValue(body, ['photo', 'photoUrl', 'files.photo']),
        hotel: getValue(body, ['hotel', 'accommodation']),
        city: getValue(body, ['city', 'entryCity'])
    };

    const privacyConsent = Boolean(getValue(body, ['privacyConsent', 'privacyPolicy']));
    const serviceConsent = Boolean(getValue(body, ['serviceConsent', 'serviceAgreement']));

    // 3. Sayaç (APP-ID)
    const counter = await prisma.counter.upsert({
      where: { name: 'application_id' },
      update: { value: { increment: 1 } },
      create: { name: 'application_id', value: 1000 },
    });
    const publicId = counter.value;

    // 4. Veritabanına Kayıt
    // Not: Admin paneli decrypt yapıyorsa şimdilik plain text kaydediyoruz. 
    // Eğer şifreli görünmesi gerekiyorsa lib/crypto'yu dahil etmemiz gerekir.
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
        travelDate,
        passportExpiry,
        additionalData: JSON.stringify(additionalDataObj),
        // Loglar artık Unknown gelmeyecek:
        ipAddress, 
        userAgent,
        privacyConsent,
        serviceConsent
      },
    });

    // 5. E-posta Gönderimi
    try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: false,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          tls: { rejectUnauthorized: false },
        });

        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.ADMIN_EMAIL,
          replyTo: email,
          subject: `YENİ BAŞVURU: APP-${publicId} - ${firstName} ${lastName}`,
          html: `
            <h3>Yeni Başvuru: APP-${publicId}</h3>
            <p><strong>Başvuran:</strong> ${firstName} ${lastName}</p>
            <p><strong>Pasaport:</strong> ${passportNumber}</p>
            <p><strong>IP Adresi:</strong> ${ipAddress}</p>
            <p>Detaylar için Admin Paneline gidiniz.</p>
          `,
        });
    } catch (e) { console.error("Mail hatası:", e); }

    // 6. DÜZELTME: Frontend'in anlayacağı tüm anahtarları dönüyoruz
    // "Pending" sorununu bu çözecek.
    return NextResponse.json({ 
        success: true, 
        id: newApplication.id, 
        applicationId: newApplication.id, 
        publicId: publicId,
        referenceNo: publicId, // Bazı frontendler bunu arar
        message: "Application submitted successfully" 
    }, { status: 200 });

  } catch (error: any) {
    console.error('API Critical Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}