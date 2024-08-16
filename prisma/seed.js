// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const e = require('cors');
const prisma = new PrismaClient();

async function main() {
    // Roles seed
    const user_role = await prisma.role.createMany({
        data: [
            {
                name: 'Office',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Agent',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Admin',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
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
                title: 'Grievance Redress Service',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                title: 'Certificate of Live Birth (COLB)',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                title: 'Business Permit Registration and Renewal',
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
                color: '0083C4',
                slug: 'inquiry',
                route: 'inquiry',
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
                                "id": 3,
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
                color: '009966',
                slug: 'avail-service',
                route: 'avail-service',
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
                                "id": 3,
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
                color: 'EC9C0E',
                slug: 'complaint',
                route: 'complaint',
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
                                "id": 3,
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
                short_name: 'A',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Medium',
                short_name: 'B',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Low',
                short_name: 'C',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
    });

    // create status multiple seed
    await prisma.status.createMany({
        data: [
            {
                name: 'Waiting',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Serving',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Completed',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Cancelled',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
    });

    // create token multiple seed
    await prisma.token.createMany({
        data: [
            {
                name: 'Md. Ashiqur Rahman',
                email: 'example@email.com',
                mobile: '01677879681',
                gender_id: 1,
                service_id: 1,
                priority_id: 1,
                office_id: 1,
                token: 'B-001',
                counter_id: 1,
                // remarks: 'Remarks',
                // duration: "10:00:11",
                status_id: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'Muin Ali',
                email: 'muin@email.com',
                mobile: '01987879681',
                gender_id: 1,
                service_id: 2,
                priority_id: 2,
                office_id: 2,
                token: 'A-002',
                counter_id: 2,
                // remarks: 'Remarks',
                // duration: "10:00:11",
                status_id: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ],
    });

    // create counter multiple seed
    await prisma.counter.createMany({
        data: [
            {
                title: 'Counter 1',
                counter_number: '1',
                office_id: 1,
                status: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                title: 'Counter 2',
                office_id: 1,
                counter_number: '2',
                status: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                title: 'Counter 3',
                office_id: 2,
                counter_number: '3',
                status: 1,
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
            role_id: 1,
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
            role_id: 2,
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
            role_id: 2,
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
            role_id: 1,
            office_id: chittagongOffice.id,
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
            role_id: 2,
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
            role_id: 2,
            office_id: chittagongOffice.id,
        },
    });
    await prisma.user.create({
        data: {
            email: 'admin@email.com',
            first_name: 'admin',
            last_name: '',
            mobile_number: '01577879681',
            gender_id: 1,
            is_validated: 1,
            password: await hashPassword('12345678'),
            created_at: new Date(),
            updated_at: new Date(),
            role_id: 3,
            office_id: 0,
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
