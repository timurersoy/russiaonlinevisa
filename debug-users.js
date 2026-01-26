const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log('Users found:', users.length);
    users.forEach(u => {
        console.log(`- Email: ${u.email}, Has Secret: ${!!u.totpSecret}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
