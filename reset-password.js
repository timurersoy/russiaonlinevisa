const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const EMAIL = 'timtur.travel@gmail.com';
const NEW_PASSWORD = 'admin'; // Simple password for recovery

async function main() {
    console.log(`Resetting password for ${EMAIL}...`);

    const user = await prisma.user.findUnique({ where: { email: EMAIL } });

    if (!user) {
        console.error('User not found!');
        process.exit(1);
    }

    const passwordHash = await bcrypt.hash(NEW_PASSWORD, 10);

    await prisma.user.update({
        where: { email: EMAIL },
        data: { passwordHash }
    });

    console.log('---------------------------------------------------');
    console.log('✅ Password reset successful!');
    console.log(`Email: ${EMAIL}`);
    console.log(`Password: ${NEW_PASSWORD}`);
    console.log('---------------------------------------------------');
    console.log('Please try logging in with these credentials now.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
