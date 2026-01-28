import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// --- YARDIMCI: DERİN ARAMA VE DOSYA BULUCU ---
function findValue(obj: any, keys: string[], isFile = false): any {
  if (!obj || typeof obj !== 'object') return undefined;

  // 1. Bu seviyede ara
  for (const key of keys) {
    // Büyük/Küçük harf duyarsız eşleştirme
    const match = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
    
    if (match && obj[match] !== undefined && obj[match] !== null && obj[match] !== "") {
      const val = obj[match];

      // Eğer "FROM_UPLOAD" ise bunu veri kabul etme, aramaya devam et
      if (typeof val === 'string' && val.includes("FROM_UPLOAD")) continue;

      // Eğer dosya arıyorsak ve elimizdeki bir obje ise, içindeki URL'i çek
      if (isFile && typeof val === 'object') {
        return val.url || val.secure_url || val.href || val.path || val.preview || JSON.stringify(val);
      }
      
      // Dosya aramıyorsak değeri döndür
      return val;
    }
  }

  // 2. Alt kutularda (Nested Objects) ara
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      const found = findValue(obj[key], keys, isFile);
      if (found) return found;
    }
  }
  return undefined;
}

// --- YARDIMCI: TARİH DÜZELTİCİ ---
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

// --- POST: YENİ BAŞVURU ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 'Unknown IP';
    const userAgent = headersList.get('user-agent') || 'Unknown Browser';

    console.log("GELEN BAŞVURU BODY:", JSON.stringify(body, null, 2));

    // --- 1. VERİLERİ ÇEK ---
    const firstName = findValue(body, ['firstName', 'name', 'givenName', 'applicantName']) || "İsimsiz";
    const lastName = findValue(body, ['lastName', 'surname', 'familyName']) || "";
    const email = findValue(body, ['email', 'contactEmail', 'mail']) || "";
    const phone = findValue(body, ['phone', 'phoneNumber', 'mobile']) || "";
    
    // Pasaport No: "FROM_UPLOAD" filtresi sayesinde gerçek veri aranır
    const passportNumber = findValue(body, ['passportNumber', 'passportNo', 'docNumber', 'passport']) || "Belge Bekleniyor";
    const nationality = findValue(body, ['nationality', 'citizenship', 'country']) || "Turkey";
    const gender = findValue(body, ['gender', 'sex']) || "male";
    
    const travelDateRaw = findValue(body, ['travelDate', 'arrivalDate', 'tripDate']);
    let travelDate = parseDateString(travelDateRaw);
    if (!travelDate || isNaN(travelDate.getTime())) travelDate = new Date(); // Varsayılan: Bugün

    const passportExpiryRaw = findValue(body, ['passportExpiry', 'expirationDate', 'expiryDate']);
    const passportExpiry = parseDateString(passportExpiryRaw);

    // Dosyalar (isFile = true moduyla URL araması yapıyoruz)
    const additionalDataObj = {
        passportCover: findValue(body, ['passportCover', 'passportCoverUrl', 'coverPage', 'file_passport'], true),
        photo: findValue(body, ['photo', 'photoUrl', 'facePhoto', 'file_photo', 'selfie'], true),
        hotel: findValue(body, ['hotel', 'accommodation', 'hotelName']),
        city: findValue(body, ['city', 'destination', 'entryCity'])
    };

    const privacyConsent = Boolean(findValue(body, ['privacyConsent', 'privacy']));
    const serviceConsent = Boolean(findValue(body, ['serviceConsent', 'terms']));

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
          subject: `YENİ BAŞVURU: APP-${publicId} (${firstName} ${lastName})`,
          html: `<h3>Başvuru: APP-${publicId}</h3><p><strong>Pasaport:</strong> ${passportNumber}</p><p>Dosyalar: ${additionalDataObj.passportCover ? 'Var' : 'Yok'}</p>`,
        });
    } catch (e) { console.error("Mail hatası:", e); }

    // --- 5. ZENGİN CEVAP (Pending Sorununu Çözer) ---
    // Frontend'in kullanabileceği tüm olası isimlendirmeleri ekliyoruz
    return NextResponse.json({ 
        success: true, 
        message: "Application submitted",
        // Standart
        id: publicId,
        publicId: publicId,
        applicationId: publicId,
        // Snake Case (Hasura/Python stili)
        application_id: publicId,
        public_id: publicId,
        // String formatları
        reference: String(publicId),
        referenceNo: String(publicId),
        reference_no: String(publicId),
        appNo: `APP-${publicId}`,
        // DB UUID
        uuid: newApplication.id,
        dbId: newApplication.id
    }, { status: 200 });

  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- STATUS GÜNCELLEME İÇİN ORTAK FONKSİYON ---
async function handleStatusUpdate(request: Request) {
    try {
        const body = await request.json();
        // ID body içinde yoksa belki URL parametresindedir (ama body öncelikli)
        const targetId = body.id || body.applicationId || body.uuid; 
        const newStatus = body.status;

        if (!targetId || !newStatus) {
            return NextResponse.json({ error: "ID and Status are required" }, { status: 400 });
        }

        console.log(`Updating status for ${targetId} to ${newStatus}`);

        const updatedApp = await prisma.application.update({
            where: { id: targetId },
            data: { status: newStatus },
        });

        return NextResponse.json({ success: true, data: updatedApp });
    } catch (error: any) {
        console.error('Status Update Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// --- PATCH VE PUT (İkisini de destekliyoruz) ---
export async function PATCH(request: Request) { return handleStatusUpdate(request); }
export async function PUT(request: Request) { return handleStatusUpdate(request); }