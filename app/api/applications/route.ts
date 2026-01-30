import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { headers } from 'next/headers';
import { encrypt } from '@/lib/crypto';

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

const EMAIL_TEMPLATES: Record<string, { subject: (id: any) => string, body: (fn: string, ln: string, id: any, pass: string, date: string) => string }> = {
  en: {
    subject: (id) => `Application Received: APP-${id} - Russia Online Visa`,
    body: (fn, ln, id, pass, date) => `Dear ${fn} ${ln},<br>We have successfully received your visa application via russiaonlinevisa.com.<br>Your Application Reference: <strong>APP-${id}</strong><br>Our team at Timtur Travel Agency has started reviewing your documents.<br><br><strong>Summary:</strong><br>- Passport: ${pass}<br>- Travel Date: ${date}<br>- Status: Processing<br><br>Contact: info@russiaonlinevisa.com | +90 530 202 85 30`
  },
  tr: {
    subject: (id) => `Başvurunuz Alındı: APP-${id}`,
    body: (fn, ln, id, pass, date) => `Sayın ${fn} ${ln},<br>russiaonlinevisa.com üzerinden başvurunuz alınmıştır.<br>Referans No: <strong>APP-${id}</strong><br>Timtur Travel Agency ekibi belgelerinizi inceliyor.<br><br><strong>Özet:</strong><br>- Pasaport: ${pass}<br>- Seyahat Tarihi: ${date}<br>- Durum: İşleniyor<br><br>İletişim: info@russiaonlinevisa.com | +90 530 202 85 30`
  },
  ru: {
    subject: (id) => `Заявка получена: APP-${id}`,
    body: (fn, ln, id, pass, date) => `Уважаемый(ая) ${fn} ${ln},<br>Мы получили вашу заявку через russiaonlinevisa.com.<br>Номер заявки: <strong>APP-${id}</strong><br>Команда Timtur Travel Agency начала проверку.<br><br><strong>Сводка:</strong><br>- Паспорт: ${pass}<br>- Дата поездки: ${date}<br>- Статус: В обработке<br><br>Контакты: info@russiaonlinevisa.com | +90 530 202 85 30`
  },
  ar: {
    subject: (id) => `تم استلام الطلب: APP-${id}`,
    body: (fn, ln, id, pass, date) => `عزيزي ${fn} ${ln}،<br>تم استلام طلبك عبر russiaonlinevisa.com.<br>رقم المرجع: <strong>APP-${id}</strong><br>فريق Timtur Travel Agency يراجع مستنداتك.<br><br><strong>ملخص:</strong><br>- جواز السفر: ${pass}<br>- تاريخ السفر: ${date}<br>- الحالة: قيد المعالجة<br><br>اتصل بنا: info@russiaonlinevisa.com | +90 530 202 85 30`
  },
  zh: {
    subject: (id) => `申请已收到: APP-${id}`,
    body: (fn, ln, id, pass, date) => `尊敬的 ${fn} ${ln},<br>我们已收到您的申请 (russiaonlinevisa.com).<br>参考号: <strong>APP-${id}</strong><br>Timtur Travel Agency 正在审核您的文件.<br><br><strong>摘要:</strong><br>- 护照: ${pass}<br>- 旅行日期: ${date}<br>- 状态: 处理中<br><br>联系方式: info@russiaonlinevisa.com | +90 530 202 85 30`
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || 'Unknown IP';
    const userAgent = headersList.get('user-agent') || 'Unknown Browser';

    console.log("APPLICATION SUBMISSION:", { firstName: body.firstName, email: body.email });

    // Extract Locale (default 'en')
    const locale = body.locale || 'en';

    // --- 1. VERİ ÇEKİMİ (Artık direkt body'den çekebiliriz) ---
    const firstName = body.firstName || findValue(body, ['firstName', 'name']) || "İsimsiz";
    const lastName = body.lastName || findValue(body, ['lastName', 'surname']) || "";
    const email = body.email || findValue(body, ['email']) || "";
    const phone = body.phone || findValue(body, ['phone']) || "";
    const passportNumber = body.passportNumber || findValue(body, ['passportNumber']) || "Belge Bekleniyor";
    const nationality = body.nationality || findValue(body, ['nationality']) || "Turkey";
    const gender = body.gender || findValue(body, ['gender']) || "male";

    // Tarihler
    const travelDate = parseDateString(body.travelDate || findValue(body, ['travelDate']));
    const passportExpiry = parseDateString(body.passportExpiryDate || findValue(body, ['passportExpiry']));

    // --- 2. ŞİFRELEME (ENCRYPTION) - KRİTİK! ---
    const encryptedFirstName = encrypt(firstName);
    const encryptedLastName = encrypt(lastName);
    const encryptedEmail = encrypt(email);
    const encryptedPhone = encrypt(phone);
    const encryptedPassportNumber = encrypt(passportNumber);

    // --- 3. TÜM FORM VERİSİNİ SAKLA (Admin Panel için) ---
    const additionalDataObj = {
      ...body, // Tüm form verisi
      // Images'ı üstte tut
      images: body.images || {
        passport: findValue(body, ['passportCover', 'passport'], true),
        photo: findValue(body, ['photo'], true)
      }
    };

    const privacyConsent = Boolean(body.privacyPolicy || findValue(body, ['privacyConsent']));
    const serviceConsent = Boolean(body.serviceAgreement || findValue(body, ['serviceConsent']));

    // --- 4. SAYAÇ ---
    const counter = await prisma.counter.upsert({
      where: { name: 'application_id' },
      update: { value: { increment: 1 } },
      create: { name: 'application_id', value: 1000 },
    });
    const publicId = counter.value;

    // --- 5. KAYIT (ŞİFRELENMİŞ VERİLERLE) ---
    const newApplication = await prisma.application.create({
      data: {
        publicId,
        firstName: encryptedFirstName,
        lastName: encryptedLastName,
        email: encryptedEmail,
        phone: encryptedPhone,
        passportNumber: encryptedPassportNumber,
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

      // --- 4.1 KULLANICIYA OTOMATİK YANIT (USER CONFIRMATION EMAIL) ---
      if (email) {
        // Select Template based on locale (fallback to 'en')
        const template = EMAIL_TEMPLATES[locale] || EMAIL_TEMPLATES['en'];
        const formattedDate = travelDate ? new Date(travelDate).toLocaleDateString(locale) : 'N/A';

        await transporter.sendMail({
          from: `"Russia Online Visa" <${process.env.SMTP_USER}>`,
          to: email,
          subject: template.subject(publicId),
          html: template.body(firstName, lastName, publicId, passportNumber, formattedDate),
        });
        console.log(`User confirmation email sent to ${email} [${locale}]`);
      }

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