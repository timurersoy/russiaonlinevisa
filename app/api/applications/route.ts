import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// --- AKILLI VE GÜVENLİ ARAMA ---
function findValue(obj: any, keys: string[], isFile = false): any {
  if (!obj || typeof obj !== 'object') return undefined;

  // 1. Bu seviyede ara
  for (const key of keys) {
    const match = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
    
    if (match && obj[match] !== undefined && obj[match] !== null && obj[match] !== "") {
      const val = obj[match];

      // FİLTRE 1: "FROM_UPLOAD" placeholder'ını yoksay
      if (typeof val === 'string' && val.includes("FROM_UPLOAD")) continue;

      // FİLTRE 2: Base64 (Resim kodlarını) yoksay! (Veri bozulmasını önler)
      if (!isFile && typeof val === 'string' && (val.startsWith("data:") || val.length > 200)) continue;

      // Dosya arıyorsak URL'i çek
      if (isFile && typeof val === 'object') {
        return val.url || val.secure_url || val.href || val.path || null;
      }
      
      // Dosya aramıyorsak değeri döndür
      if (!isFile) return val;
    }
  }

  // 2. Alt kutularda ara
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      const found = findValue(obj[key], keys, isFile);
      if (found) return found;
    }
  }
  return undefined;
}

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 'Unknown IP';
    const userAgent = headersList.get('user-agent') || 'Unknown Browser';

    console.log("TEMİZ VERİ ARAMASI BAŞLIYOR:", JSON.stringify(body, null, 2));

    // --- 1. GÜVENLİ VERİ ÇEKİMİ ---
    const firstName = findValue(body, ['firstName', 'name', 'givenName', 'applicantName']) || "İsimsiz";
    const lastName = findValue(body, ['lastName', 'surname', 'familyName']) || "";
    const email = findValue(body, ['email', 'contactEmail']) || "";
    const phone = findValue(body, ['phone', 'phoneNumber', 'mobile']) || "";
    
    // Pasaport No (Artık resim kodunu almayacak)
    const passportNumber = findValue(body, ['passportNumber', 'passportNo', 'docNumber', 'passport']) || "Belge Bekleniyor";
    const nationality = findValue(body, ['nationality', 'citizenship']) || "Turkey";
    const gender = findValue(body, ['gender', 'sex']) || "male";
    
    // Tarihler
    const travelDate = parseDateString(findValue(body, ['travelDate', 'arrivalDate']));
    const passportExpiry = parseDateString(findValue(body, ['passportExpiry', 'expirationDate']));

    // Dosyalar (Base64 veya URL)
    const additionalDataObj = {
        passportCover: findValue(body, ['passportCover', 'passportCoverUrl', 'coverPage', 'file_passport'], true),
        photo: findValue(body, ['photo', 'photoUrl', 'facePhoto', 'file_photo'], true),
        hotel: findValue(body, ['hotel', 'accommodation']),
        city: findValue(body, ['city', 'destination'])
    };

    const privacyConsent = Boolean(findValue(body, ['privacyConsent', 'privacy']));
    const serviceConsent = Boolean(findValue(body, ['serviceConsent', 'terms']));

    // --- 2. SAYAÇ ---
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
        travelDate: travelDate || new Date(),
        passportExpiry,
        additionalData: JSON.stringify(additionalDataObj),
        ipAddress,
        userAgent,
        privacyConsent,
        serviceConsent,
        status: "PROCESSING"
      },
    });

    // --- 4. MAİL ---
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
          subject: `YENİ BAŞVURU: APP-${publicId} (${firstName})`,
          html: `<h3>Başvuru: APP-${publicId}</h3><p>Pasaport: ${passportNumber}</p>`,
        });
    } catch (e) { console.error("Mail Error:", e); }

    // --- 5. GARANTİLİ YANIT (Pending Sorununu Çözer) ---
    return NextResponse.json({ 
        success: true, 
        message: "Application submitted",
        // Frontend ne bekliyorsa burada bulacak:
        id: publicId,
        publicId: publicId,
        applicationId: publicId,
        reference: String(publicId), // String bekliyorsa
        referenceNo: String(publicId),
        appNo: `APP-${publicId}`,
        data: { id: publicId, publicId: publicId } // Data içinde bekliyorsa
    }, { status: 200 });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}