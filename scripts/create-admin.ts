import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import qrcode from 'qrcode';
import readline from 'readline';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const otplib = require('otplib');

const crypto = require('crypto');

// Manual Base32 Secret Generator (Robust & Dependency-Free)
function generateBase32Secret(length = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const randomBytes = crypto.randomBytes(length);
    let secret = '';
    for (let i = 0; i < length; i++) {
        secret += chars[randomBytes[i] % 32];
    }
    return secret;
}

function base32ToBuffer(str: string): Buffer {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    let index = 0;
    const output = Buffer.alloc(Math.ceil(str.length * 5 / 8));

    for (let i = 0; i < str.length; i++) {
        const char = str[i].toUpperCase();
        const val = alphabet.indexOf(char);
        if (val === -1) continue;

        value = (value << 5) | val;
        bits += 5;

        if (bits >= 8) {
            output[index++] = (value >>> (bits - 8)) & 255;
            bits -= 8;
        }
    }
    return output.slice(0, index);
}

// Native TOTP Verification (RFC 6238) - No external dependencies causing errors
function verifyTOTP(token: string, secret: string, window = 1): boolean {
    try {
        const secretBuf = base32ToBuffer(secret);
        const step = 30;
        const now = Math.floor(Date.now() / 1000);
        const counter = Math.floor(now / step);

        for (let i = -window; i <= window; i++) {
            const currentCounter = counter + i;
            // Create 8-byte buffer for counter (big-endian 64-bit)
            const counterBuf = Buffer.alloc(8);
            counterBuf.writeBigInt64BE(BigInt(currentCounter), 0);

            const hmac = crypto.createHmac('sha1', secretBuf);
            hmac.update(counterBuf);
            const digest = hmac.digest();

            // Dynamic Truncation
            const offset = digest[digest.length - 1] & 0xf;
            const code = (
                ((digest[offset] & 0x7f) << 24) |
                ((digest[offset + 1] & 0xff) << 16) |
                ((digest[offset + 2] & 0xff) << 8) |
                (digest[offset + 3] & 0xff)
            ) % 1000000;

            const codeStr = code.toString().padStart(6, '0');
            if (codeStr === token) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('TOTP Verification Error:', error);
        return false;
    }
}

// Robust Authenticator Logic
const authenticator = {
    generateSecret: generateBase32Secret,
    check: verifyTOTP,
    keyuri: (account: string, issuer: string, secret: string) => {
        return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
    }
};

const prisma = new PrismaClient();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

async function main() {
    console.log('--- Create Admin User ---');

    const email = await question('Admin Email: ');
    const password = await question('Admin Password: ');

    if (!email || !password) {
        console.error('Email and password are required.');
        process.exit(1);
    }

    // 1. Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        console.log(`User ${email} already exists. Updating credentials...`);
    }

    // 2. Hash Password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Generate TOTP Secret
    const totpSecret = authenticator.generateSecret();

    // 4. Generate QR Code
    // otpauth://totp/Label?secret=Secret&issuer=Issuer
    const otpAuthUrl = authenticator.keyuri(email, 'RussiaOnlineVisa', totpSecret);

    console.log('\nScan this QR Code with your Authenticator App (Google Auth / Authy):');

    // Print QR to terminal
    qrcode.toString(otpAuthUrl, { type: 'terminal', small: true }, (err, url) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(url);
    });

    console.log(`\nTOTP Secret (Manual Entry): ${totpSecret}\n`);

    // 5. Ask for verification
    const token = await question('Enter the 6-digit code from your app to verify: ');

    const isValid = authenticator.check(token, totpSecret);

    if (!isValid) {
        console.error('Invalid code! User NOT created/updated. Please try again.');
        process.exit(1);
    }

    // 6. Save to DB
    if (existingUser) {
        await prisma.user.update({
            where: { email },
            data: { passwordHash, totpSecret }
        });
        console.log(`Admin user ${email} updated successfully!`);
    } else {
        await prisma.user.create({
            data: { email, passwordHash, totpSecret }
        });
        console.log(`Admin user ${email} created successfully!`);
    }

    await prisma.$disconnect();
    rl.close();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
