const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting ID backfill...');

    // 1. Backfill Applications
    // Find current max ID to avoid collisions
    const maxApp = await prisma.application.aggregate({
        _max: { publicId: true }
    });
    let appCounter = (maxApp._max.publicId || 999) + 1;
    console.log(`Starting Application IDs from: APP-${appCounter}`);

    const apps = await prisma.application.findMany({
        where: { publicId: null },
        orderBy: { createdAt: 'asc' } // Oldest first
    });

    console.log(`Found ${apps.length} applications without publicId.`);

    for (const app of apps) {
        await prisma.application.update({
            where: { id: app.id },
            data: { publicId: appCounter }
        });
        console.log(`Updated App ${app.id} -> APP-${appCounter}`);
        appCounter++;
    }

    // 2. Backfill Contact Requests
    const maxMsg = await prisma.contactRequest.aggregate({
        _max: { publicId: true }
    });
    let msgCounter = (maxMsg._max.publicId || 999) + 1;
    console.log(`Starting Contact IDs from: REQ-${msgCounter}`);

    const msgs = await prisma.contactRequest.findMany({
        where: { publicId: null },
        orderBy: { createdAt: 'asc' }
    });

    console.log(`Found ${msgs.length} messages without publicId.`);

    for (const msg of msgs) {
        await prisma.contactRequest.update({
            where: { id: msg.id },
            data: { publicId: msgCounter }
        });
        console.log(`Updated Msg ${msg.id} -> REQ-${msgCounter}`);
        msgCounter++;
    }

    console.log('Backfill complete!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
