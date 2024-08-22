const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const e = require('cors');
const prisma = new PrismaClient();

async function main() {
    // create wt_news multiple seed
    await prisma.wt_news.createMany({
        data: [
            {
                title: 'Test wt_news 1',
                description: 'description 1',
                status: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                title: 'Test wt_news 2',
                description: 'description 2',
                status: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                title: 'Test wt_news 3',
                description: 'description 3',
                status: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
    });
    // create wt_news multiple seed
    await prisma.wt_video.createMany({
        data: [
            {
                title: 'Test wt_news 1',
                link: 'https://www.youtube.com/watch?v=2g811Eo7K8U',
                description: 'description 1',
                status: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });