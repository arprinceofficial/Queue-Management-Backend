// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    // Roles seed
    const queueOfficeRole = await prisma.role.create({
        data: {
            name: 'Queue Office',
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    const agentRole = await prisma.role.create({
        data: {
            name: 'Agent',
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    // office Name seed
    const dhakaOffice = await prisma.office.create({
        data: {
            office_name: 'Dhaka Office',
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    const chittagongOffice = await prisma.office.create({
        data: {
            office_name: 'Chittagong Office',
            created_at: new Date(),
            updated_at: new Date(),
        },
    });
    
    // Password hashing
    const hashPassword = async (password) => {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    };

    // Users seed
    await prisma.user.create({
        data: {
            email: 'queueofficedhaka@email.com',
            first_name: 'queue office',
            last_name: 'dhaka',
            mobile_number: '01677879681',
            gender: 'male',
            is_validated: 1,
            password: await hashPassword('12345678'),
            created_at: new Date(),
            updated_at: new Date(),
            role_id: queueOfficeRole.id,
            office_id: dhakaOffice.id,
        },
    });
    
    await prisma.user.create({
        data: {
            email: 'queueofficechittagong@email.com',
            first_name: 'queue office',
            last_name: 'chittagong',
            mobile_number: '01677879681',
            gender: 'male',
            is_validated: 1,
            password: await hashPassword('12345678'),
            created_at: new Date(),
            updated_at: new Date(),
            role_id: chittagongOffice.id,
            office_id: dhakaOffice.id,
        },
    });

    await prisma.user.create({
        data: {
            email: 'agent1@email.com',
            first_name: 'Agent',
            last_name: '1',
            mobile_number: '01977879681',
            gender: 'male',
            is_validated: 1,
            password: await hashPassword('12345678'),
            created_at: new Date(),
            updated_at: new Date(),
            role_id: agentRole.id,
            office_id: dhakaOffice.id,
        },
    });

    await prisma.user.create({
        data: {
            email: 'agent2@email.com',
            first_name: 'Agent',
            last_name: '2',
            mobile_number: '01877879681',
            gender: 'male',
            is_validated: 1,
            password: await hashPassword('12345678'),
            created_at: new Date(),
            updated_at: new Date(),
            role_id: agentRole.id,
            office_id: dhakaOffice.id,
        },
    });

    await prisma.user.create({
        data: {
            email: 'agent1ctg@email.com',
            first_name: 'Agent',
            last_name: '2',
            mobile_number: '01577879681',
            gender: 'male',
            is_validated: 1,
            password: await hashPassword('12345678'),
            created_at: new Date(),
            updated_at: new Date(),
            role_id: agentRole.id,
            office_id: chittagongOffice.id,
        },
    });
    await prisma.user.create({
        data: {
            email: 'agent2ctg@email.com',
            first_name: 'Agent',
            last_name: '2',
            mobile_number: '01277879681',
            gender: 'male',
            is_validated: 1,
            password: await hashPassword('12345678'),
            created_at: new Date(),
            updated_at: new Date(),
            role_id: agentRole.id,
            office_id: chittagongOffice.id,
        },
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
