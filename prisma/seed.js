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

    // Create Gender multiple seed
    await prisma.gender.createMany({
        data: [
            {
                name: 'Male',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Female',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Other',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
    });

    // Create Service multiple seed
    await prisma.services.createMany({
        data: [
            {
                name: 'Grievance Redress Service',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Certificate of Live Birth (COLB)',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Business Permit Registration and Renewal',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
    });

    // Create Services multiple seed
    await prisma.queue_services.createMany({
        data: [
            {
                name: 'Inquiry',
                code: 'INQ',
                slug: 'inquiry',
                icon: 'fa-solid fa-messages-question',
                fields: [
                    {
                        "label": "Name",
                        "name": "name",
                        "type": "text",
                        "place_holder": "i.e John doe",
                        "required": true
                    },
                    {
                        "label": "Email",
                        "name": "email",
                        "type": "email",
                        "place_holder": "i.e example@xyz.com",
                        "required": true
                    },
                    {
                        "label": "Mobile",
                        "name": "mobile",
                        "type": "number",
                        "place_holder": "i.e +63-2-1234-5678",
                        "required": true
                    },
                    {
                        "label": "Gender",
                        "name": "gender",
                        "type": "radio",
                        "data_type": "static",
                        "options": [
                            {
                                "id": 1,
                                "name": "Male"
                            },
                            {
                                "id": 2,
                                "name": "Female"
                            }
                        ],
                        "required": true
                    },
                    {
                        "label": "Service",
                        "name": "service",
                        "type": "radio",
                        "data_type": "static",
                        "options": [
                            {
                                "id": 21,
                                "name": "Grievance Redress Service"
                            },
                            {
                                "id": 2,
                                "name": "Certificate of Live Birth (COLB)"
                            },
                            {
                                "id": 1,
                                "name": "Business Permit Registration and Renewal"
                            }
                        ],
                        "required": true
                    },
                    {
                        "label": "Priority lane",
                        "name": "priority_lane",
                        "type": "radio",
                        "data_type": "dunamic",
                        "options": [
                            {
                                "id": 1,
                                "name": "Regular"
                            },
                            {
                                "id": 2,
                                "name": "PWD\/Pregnant\/IP"
                            }
                        ],
                        "required": true
                    }
                ],
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Avail Service',
                code: 'AVL',
                slug: 'avail-service',
                icon: 'fa-duotone fa-solid fa-gears',
                fields: [
                    {
                        "label": "Name",
                        "name": "name",
                        "type": "text",
                        "place_holder": "i.e John doe",
                        "required": true
                    },
                    {
                        "label": "Email",
                        "name": "email",
                        "type": "email",
                        "place_holder": "i.e example@xyz.com",
                        "required": true
                    },
                    {
                        "label": "Mobile",
                        "name": "mobile",
                        "type": "number",
                        "place_holder": "i.e +63-2-1234-5678",
                        "required": true
                    },
                    {
                        "label": "Gender",
                        "name": "gender",
                        "type": "radio",
                        "data_type": "static",
                        "options": [
                            {
                                "id": 1,
                                "name": "Male"
                            },
                            {
                                "id": 2,
                                "name": "Female"
                            }
                        ],
                        "required": true
                    },
                    {
                        "label": "Service",
                        "name": "service",
                        "type": "radio",
                        "data_type": "static",
                        "options": [
                            {
                                "id": 21,
                                "name": "Grievance Redress Service"
                            },
                            {
                                "id": 2,
                                "name": "Certificate of Live Birth (COLB)"
                            },
                            {
                                "id": 1,
                                "name": "Business Permit Registration and Renewal"
                            }
                        ],
                        "required": true
                    },
                    {
                        "label": "Priority lane",
                        "name": "priority_lane",
                        "type": "radio",
                        "data_type": "dunamic",
                        "options": [
                            {
                                "id": 1,
                                "name": "Regular"
                            },
                            {
                                "id": 2,
                                "name": "PWD\/Pregnant\/IP"
                            }
                        ],
                        "required": true
                    }
                ],
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Complaint',
                code: 'CMP',
                slug: 'complaint',
                icon: 'fa-regular fa-memo-circle-info',
                fields: [
                    {
                        "label": "Name",
                        "name": "name",
                        "type": "text",
                        "place_holder": "i.e John doe",
                        "required": true
                    },
                    {
                        "label": "Priority lane",
                        "name": "priority_lane",
                        "type": "radio",
                        "data_type": "dunamic",
                        "options": [
                            {
                                "id": 1,
                                "name": "Regular"
                            },
                            {
                                "id": 2,
                                "name": "PWD\/Pregnant\/IP"
                            }
                        ],
                        "required": true
                    },
                    {
                        "label": "Service",
                        "name": "service",
                        "type": "radio",
                        "data_type": "static",
                        "options": [
                            {
                                "id": 21,
                                "name": "Grievance Redress Service"
                            },
                            {
                                "id": 2,
                                "name": "Certificate of Live Birth (COLB)"
                            },
                            {
                                "id": 1,
                                "name": "Business Permit Registration and Renewal"
                            }
                        ],
                        "required": true
                    }
                ],
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
    });

    // create priority multiple seed
    await prisma.priority.createMany({
        data: [
            {
                name: 'High',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Medium',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Low',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
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
            gender_id: 1,
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
            gender_id: 1,
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
            gender_id: 1,
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
            gender_id: 1,
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
            gender_id: 1,
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
            gender_id: 1,
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
