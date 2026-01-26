import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Fix for otplib import issues in Next.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { TOTP } = require('otplib');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only-change-in-prod';

// Configure TOTP instance directly
const authenticator = new TOTP({
    window: 2 // Allow +/- 2 steps (60 seconds) drift
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, token } = body;

        console.log('Login attempt for:', email);

        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Missing credentials' }, { status: 400 });
        }

        // 1. Find Admin
        const admin = await prisma.user.findUnique({
            where: { email }
        });

        if (!admin) {
            // Fake delay to prevent timing attacks
            await new Promise(r => setTimeout(r, 1000));
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // 2. Verify Password
        const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
        if (!isPasswordValid) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // 3. Step 1 Success (Password OK) - if no token provided, return success to prompt 2FA
        if (!token) {
            if (admin.totpSecret) {
                return NextResponse.json({ success: true, require2fa: true });
            } else {
                // If 2FA not set up (blocked by logic but handling anyway), maybe just log in?
                // For now, enforce 2FA.
                return NextResponse.json({ success: false, message: '2FA setup required' }, { status: 403 });
            }
        }

        // 4. Verify TOTP (if token provided)
        if (!admin.totpSecret) {
            return NextResponse.json({ success: false, message: '2FA not set up for this user' }, { status: 401 });
        }

        // Clean token of whitespace just in case
        const cleanToken = token.replace(/\s/g, '');

        // ... (rest of the code)

        try {
            const isValidToken = authenticator.verify({
                token: cleanToken,
                secret: admin.totpSecret
            });

            if (!isValidToken) {
                console.log('2FA Verification Failed');
                return NextResponse.json({ success: false, message: 'Invalid 2FA code' }, { status: 401 });
            }
        } catch (err) {
            console.error('OTPLib Error:', err);
            return NextResponse.json({ success: false, message: 'Error verifying 2FA code' }, { status: 500 });
        }

        // 4. Create Session (Cookie)
        const sessionToken = jwt.sign(
            { userId: admin.id, email: admin.email },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        const cookieStore = await cookies();
        cookieStore.set('admin_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 8, // 8 hours
            path: '/',
            sameSite: 'lax',
        });

        return NextResponse.json({ success: true, redirect: '/admin' });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
// Force recompile
