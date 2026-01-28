import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// --- YARDIMCI FONKSİYONLAR ---

// 1. Tarih Düzeltici
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

// 2. DERİN ARAMA MOTORU (Recursive Search)
// Veri "body.data.personal.firstName" gibi en dipte olsa bile bulur.
function findValue(obj: any, keys: string[]): any {
  if (!obj || typeof obj !== 'object') return undefined;

  // Önce bu seviyede ara
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") return obj[key];
    // Büyük/Küçük harf duyarsız ara
    const foundKey = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
    if (foundKey && obj[foundKey]) return obj[foundKey];
  }

  // Bulamazsan alt kutulara (nested object) dal
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      const found = findValue(obj[key], keys);
      if (found) return found;
    }
  }
  return undefined;
}

// --- POST METODU: YENİ BAŞVURU ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headersList = await headers();
    
    // IP ve Tarayıcı Bilgisi (Unknown sorununu çözer)
    const ipAddress = headersList.get('x-forwarded-for') || 'Unknown IP';
    const userAgent = headersList.get('user-agent') || 'Unknown Browser';

    console.log("GELEN BAŞVURU (DEBUG):", JSON.stringify(body, null, 2));

    // --- 1. VERİLERİ BUL (Derin Arama) ---
    const firstName = findValue(body, ['firstName', 'name', 'givenName', 'applicantName']) || "İsimsiz";
    const lastName = findValue(body, ['lastName', 'surname', 'familyName']) || "";
    const email = findValue(body, ['email', 'contactEmail', 'mail']) || "";
    const phone = findValue(body, ['phone', 'phoneNumber', 'mobile', 'tel']) || "";
    
    const passportNumber = findValue(body, ['passportNumber', 'passportNo', 'docNumber', 'passport']) || "Yok";
    const nationality = findValue(body, ['nationality', 'citizenship', 'country']) || "Turkey";
    const gender = findValue(body, ['gender', 'sex']) || "male";
    
    // Tarihler
    const travelDateRaw = findValue(body, ['travelDate', 'arrivalDate', 'tripDate']);
    let travelDate = parseDateString(travelDateRaw);
    if (!travelDate || isNaN(travelDate.getTime())) travelDate = new Date();

    const passportExpiryRaw = findValue(body, ['passportExpiry', 'expirationDate', 'expiryDate']);
    const passportExpiry = parseDateString(passportExpiryRaw);

    // Dosyalar (URL veya File objesi olarak gelebilir)
    const additionalDataObj = {
        passportCover: findValue(body, ['passportCover', 'passportCoverUrl', 'coverPage', 'file_passport']),
        photo: findValue(body, ['photo', 'photoUrl', 'facePhoto', 'file_photo']),
        hotel: findValue(body, ['hotel', 'accommodation', 'hotelName']),
        city: findValue(body, ['city', 'destination', 'entryCity'])
    };

    // Yasal Onaylar
    const privacyConsent = Boolean(findValue(body, ['privacyConsent', 'privacy', 'kvkk']));
    const serviceConsent = Boolean(findValue(body, ['serviceConsent', 'terms', 'agreement']));

    // --- 2. SAYAÇ (APP-ID) ---
    const counter = await prisma.counter.upsert({
      where: { name: 'application_id' },
      update: { value: { increment: 1 } },
      create: { name: 'application_id', value: 1000 },
    });
    const publicId = counter.value;

    // --- 3. KAYIT ---
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
        ipAddress,
        userAgent,
        privacyConsent,
        serviceConsent,
        status: "PROCESSING" // Varsayılan durum
      },
    });

    // --- 4. MAİL (Hata olsa da devam et) ---
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
          subject: `YENİ BAŞVURU: APP-${publicId} (${firstName} ${lastName})`,
          html: `
            <h3>Yeni Başvuru: APP-${publicId}</h3>
            <p><strong>Başvuran:</strong> ${firstName} ${lastName}</p>
            <p><strong>Pasaport:</strong> ${passportNumber}</p>
            <p><strong>IP:</strong> ${ipAddress}</p>
            <p><a href="https://russiaonlinevisa.vercel.app/admin">Admin Paneline Git</a></p>
          `,
        });
    } catch (e) { console.error("Mail hatası:", e); }

    // --- 5. CEVAP (Pending Sorununu Çözer) ---
    return NextResponse.json({ 
        success: true, 
        message: "Application submitted",
        // Frontend ne ararsa bulsun diye her varyasyonu dönüyoruz
        id: publicId,
        publicId: publicId,
        applicationId: publicId,
        reference: String(publicId),
        referenceNo: String(publicId),
        appNo: `APP-${publicId}`,
        dbId: newApplication.id
    }, { status: 200 });

  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- PATCH METODU: STATUS GÜNCELLEME (Bunu geri getirdik!) ---
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, applicationId } = body; 
    
    // ID hem 'id' hem 'applicationId' olarak gelebilir
    const targetId = id || applicationId;

    if (!targetId || !status) {
      return NextResponse.json({ error: "Missing ID or Status" }, { status: 400 });
    }

    // Güncelleme işlemi
    const updatedApp = await prisma.application.update({
      where: { id: targetId }, // UUID ile güncelleme
      data: { status },
    });

    return NextResponse.json({ success: true, data: updatedApp });

  } catch (error: any) {
    console.error('PATCH Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}