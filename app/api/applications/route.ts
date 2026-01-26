export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { encrypt, decrypt } from '@/lib/crypto'; // Import encryption utils
import { emailTemplates } from '@/lib/email-templates';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || '465'),
    secure: true, // Matching contact form config which works
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Capture Metadata
        const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'; // Next.js usually provides this
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // Extract known fields, put rest in additionalData
        const {
            personalDetails,
            passportDetails,
            travelDetails,
            contactDetails,
            privacyPolicy,    // New field from form
            serviceAgreement, // New field from form
            ...otherData
        } = body;

        // Basic validation
        if (!personalDetails || !passportDetails || !contactDetails) {
            return NextResponse.json({ success: false, message: 'Missing required data' }, { status: 400 });
        }

        // ENCRYPTION STEP
        // ... (encryption logic remains same)
        const encryptedFirstName = encrypt(personalDetails.givenNames || '');
        const encryptedLastName = encrypt(personalDetails.surname || '');
        const encryptedEmail = encrypt(contactDetails.email || '');
        const encryptedPhone = encrypt(contactDetails.phone || '');
        const encryptedPassportNumber = encrypt(passportDetails.passportNumber || '');
        const encryptedAdditionalData = encrypt(JSON.stringify(otherData));

        let application: any;

        await prisma.$transaction(async (tx: any) => {
            // 1. Get next ID
            const counter = await tx.counter.upsert({
                where: { name: 'application' },
                update: { value: { increment: 1 } },
                create: { name: 'application', value: 5100 },
            });
            const publicId = counter.value;

            // 2. Create Application with Metadata
            application = await tx.application.create({
                data: {
                    publicId: publicId,
                    firstName: encryptedFirstName,
                    lastName: encryptedLastName,
                    email: encryptedEmail,
                    phone: encryptedPhone,
                    nationality: personalDetails.nationality || '',
                    gender: personalDetails.gender || null,
                    passportNumber: encryptedPassportNumber,
                    passportExpiry: passportDetails.expiryDate ? new Date(passportDetails.expiryDate) : null,
                    travelDate: travelDetails.entryDate ? new Date(travelDetails.entryDate) : new Date(),
                    additionalData: encryptedAdditionalData,

                    // Legal Logging
                    ipAddress: ipAddress,
                    userAgent: userAgent,
                    privacyConsent: !!privacyPolicy,
                    serviceConsent: !!serviceAgreement,
                }
            });
        });

        // ---------------------------------------------------------
        // SEND EMAIL NOTIFICATION (with Attachments)
        // ---------------------------------------------------------
        try {
            const attachments = [];

            // Helper to get extension and mime from base64
            const getFileInfo = (base64String: string) => {
                const match = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
                const mime = match ? match[1] : 'image/png';
                let ext = 'png';
                if (mime.includes('pdf')) ext = 'pdf';
                else if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
                return { mime, ext };
            }

            // Extract images from otherData if present
            if (otherData.images) {
                const images = otherData.images as Record<string, string>;

                if (images.photo) {
                    const { ext } = getFileInfo(images.photo);
                    const photoBuffer = Buffer.from(images.photo.split(',')[1], 'base64');
                    attachments.push({
                        filename: `personal-photo.${ext}`,
                        content: photoBuffer
                    });
                }

                if (images.passport) {
                    const { ext } = getFileInfo(images.passport);
                    const passportBuffer = Buffer.from(images.passport.split(',')[1], 'base64');
                    attachments.push({
                        filename: `passport-cover.${ext}`,
                        content: passportBuffer
                    });
                }
            }

            // Prepare Dynamic Fields HTML
            let dynamicFieldsHtml = `<div style="background-color: #f9fafb; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
                <h3 style="margin-top: 0; color: #4b5563;">Additional Information</h3>`;

            const excludedKeys = ['images', 'passportCover', 'photo', 'passportCoverImage', 'privacyPolicy', 'serviceAgreement'];

            let hasDynamicFields = false;
            for (const [key, value] of Object.entries(otherData)) {
                if (excludedKeys.includes(key) || typeof value === 'object') continue;
                if (!value) continue;

                // Format key: camelCase to Title Case
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                dynamicFieldsHtml += `<p style="margin: 5px 0;"><strong>${label}:</strong> ${value}</p>`;
                hasDynamicFields = true;
            }
            dynamicFieldsHtml += `</div>`;

            // If no extra fields, clear the section
            if (!hasDynamicFields) dynamicFieldsHtml = '';

            await transporter.sendMail({
                from: `"Visa Application" <${process.env.SMTP_FROM || 'no-reply@example.com'}>`,
                to: process.env.ADMIN_EMAIL || 'info@russiaonlinevisa.com',
                replyTo: contactDetails.email,
                subject: `New Application (APP-${application.publicId}): ${personalDetails.givenNames || 'Applicant'} ${personalDetails.surname || ''} - ${personalDetails.nationality}`,
                html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                            <h2 style="color: #0039A6; border-bottom: 2px solid #0039A6; padding-bottom: 10px;">New Visa Application Received</h2>
                            
                            <p><strong>System ID:</strong> APP-${application.publicId}</p>
                            
                            <div style="background-color: #f9fafb; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
                                <h3 style="margin-top: 0; color: #4b5563;">Personal Details</h3>
                                <p style="margin: 5px 0;"><strong>Name:</strong> ${personalDetails.givenNames} ${personalDetails.surname}</p>
                                <p style="margin: 5px 0;"><strong>Nationality:</strong> ${personalDetails.nationality}</p>
                                <p style="margin: 5px 0;"><strong>Gender:</strong> ${personalDetails.gender}</p>
                                <p style="margin: 5px 0;"><strong>Marital Status:</strong> ${personalDetails.maritalStatus}</p>
                            </div>

                            <div style="background-color: #f9fafb; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
                                <h3 style="margin-top: 0; color: #4b5563;">Passport & Travel</h3>
                                <p style="margin: 5px 0;"><strong>Passport Number:</strong> ${passportDetails.passportNumber}</p>
                                <p style="margin: 5px 0;"><strong>Passport Expiry:</strong> ${passportDetails.expiryDate}</p>
                                <p style="margin: 5px 0;"><strong>Travel Date:</strong> ${travelDetails.entryDate}</p>
                                <p style="margin: 5px 0;"><strong>First City:</strong> ${travelDetails.firstCity}</p>
                                <p style="margin: 5px 0;"><strong>Visit Type:</strong> ${travelDetails.visitType}</p>
                                <p style="margin: 5px 0;"><strong>Accommodation:</strong> ${travelDetails.accommodationType}</p>
                            </div>

                            <div style="background-color: #f9fafb; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
                                <h3 style="margin-top: 0; color: #4b5563;">Contact Information</h3>
                                <p style="margin: 5px 0;"><strong>Email:</strong> ${contactDetails.email}</p>
                                <p style="margin: 5px 0;"><strong>Phone:</strong> ${contactDetails.phone}</p>
                                <p style="margin: 5px 0;"><strong>Address:</strong> ${contactDetails.address}</p>
                                <p style="margin: 5px 0;"><strong>Occupancy:</strong> ${contactDetails.occupancy}</p>
                            </div>

                            ${dynamicFieldsHtml}

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/en/admin" style="background-color: #0039A6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Full Application in Dashboard</a>
                            </div>
                        </div>
                    `,
                attachments: attachments
            });
        } catch (emailError) {
            console.error('Failed to send admin email:', emailError);
        }

        // ---------------------------------------------------------
        // SEND APPLICANT CONFIRMATION EMAIL
        // ---------------------------------------------------------
        try {
            const userLocale = body.locale || 'en';
            const template = emailTemplates[userLocale] || emailTemplates['en'];

            await transporter.sendMail({
                from: `"Russia Online Visa" <${process.env.SMTP_FROM || 'no-reply@russiaonlinevisa.com'}>`, // Use a nicer name
                to: contactDetails.email,
                subject: template.subject,
                html: template.body(application.publicId.toString()), // Pass ID as string
            });

        } catch (applicantEmailError) {
            console.error('Failed to send applicant email:', applicantEmailError);
            // Non-blocking error
        }

        return NextResponse.json({
            success: true,
            applicationId: application.id,
            friendlyId: `APP-${application.publicId}`
        });

    } catch (error) {
        console.error('Error submitting application:', error);
        return NextResponse.json({ success: false, message: 'Submission failed' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    // PROTECT THIS ROUTE
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (!token) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
    }

    try {
        const applications = await prisma.application.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // DECRYPTION STEP
        // ------------------------------------------------------------------
        // We must decrypt sensitive fields before sending them to the frontend.
        // ------------------------------------------------------------------
        const decryptedApplications = applications.map((app: any) => {
            // Note: If decryption fails (e.g. data wasn't encrypted), the util returns the original property.
            return {
                ...app,
                firstName: decrypt(app.firstName),
                lastName: decrypt(app.lastName),
                email: decrypt(app.email),
                phone: decrypt(app.phone),
                passportNumber: decrypt(app.passportNumber),
                additionalData: decrypt(app.additionalData || ''),
            };
        });

        return NextResponse.json({ success: true, applications: decryptedApplications });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
