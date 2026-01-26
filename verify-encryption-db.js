const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mock encryption to compare or just check format
// We expect data to be in format "iv:encryptedContent"

async function main() {
    console.log('1. Checking latest application in DB...');
    const latestApp = await prisma.application.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    if (!latestApp) {
        console.log('No applications found. Please submit a test application first.');
        return;
    }

    console.log('   ID:', latestApp.id);
    console.log('   FirstName (Raw DB):', latestApp.firstName);
    console.log('   PassportNum (Raw DB):', latestApp.passportNumber);

    // simple heurstic check
    const isEncrypted = (text) => text && text.includes(':') && text.length > 20;

    if (isEncrypted(latestApp.firstName) && isEncrypted(latestApp.passportNumber)) {
        console.log('✅ PASS: Data appears to be encrypted in the database.');
    } else {
        console.log('❌ FAIL: Data does NOT appear to be encrypted.');
        console.log('   (If this is an old application, this is expected. Submit a new one to test.)');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
