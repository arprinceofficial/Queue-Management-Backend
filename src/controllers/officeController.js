const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// return res.status(200).json({ data: req.auth_user });

module.exports = {
    async services(req, res) {
        try {
            const services = await prisma.services.findMany();
            res.status(200).json({
                code: 200,
                status: true,
                data: services,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async queueServices(req, res) {
        try {
            const services = await prisma.queue_services.findMany();
            res.status(200).json({
                code: 200,
                status: true,
                data: services,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async queueServicesByslug(req, res) {
        const { slug } = req.params;
        try {
            const services = await prisma.queue_services.findFirst({
                where: {
                    slug: slug,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: services,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async createQueueToken(req, res) {
        // return res.status(200).json({ data: req.auth_user.office.id });
        const { body } = req;
        try {
            const priority = await prisma.priority.findUnique({
                where: {
                    id: parseInt(body.priority_lane),
                },
            });
    
            if (!priority) {
                throw new Error("Priority not found");
            }
    
            const currentDate = new Date().toISOString().split('T')[0];
    
            const lastToken = await prisma.token.findFirst({
                where: {
                    priority_id: parseInt(body.priority_lane),
                    created_at: {
                        gte: new Date(currentDate + 'T00:00:00.000Z'),
                        lt: new Date(currentDate + 'T23:59:59.999Z'),
                    },
                },
                orderBy: {
                    id: 'desc',
                },
            });
    
            let newToken = '';
            if (lastToken) {
                const lastTokenParts = lastToken.token.split('-');
                if (lastTokenParts.length > 1) {
                    const lastTokenNumber = parseInt(lastTokenParts[1], 10);
                    if (!isNaN(lastTokenNumber)) {
                        newToken = `${priority.short_name}-${(lastTokenNumber + 1).toString().padStart(3, '0')}`;
                    } else {
                        newToken = `${priority.short_name}-001`;
                    }
                } else {
                    newToken = `${priority.short_name}-001`;
                }
            } else {
                newToken = `${priority.short_name}-001`;
            }
    
            // Find all counters for the office
            const counters = await prisma.counter.findMany({
                where: {
                    office_id: req.auth_user.office.id,
                },
            });
    
            let counterNumber = null;
            let minTokenCount = Infinity;
    
            // Randomly shuffle counters
            const shuffledCounters = counters.sort(() => 0.5 - Math.random());
    
            // Iterate through shuffled counters and find the first one with the fewest tokens
            for (const counter of shuffledCounters) {
                const tokenCount = await prisma.token.count({
                    where: {
                        counter_id: counter.id,
                        office_id: req.auth_user.office.id,
                    },
                });
    
                if (tokenCount < minTokenCount) {
                    minTokenCount = tokenCount;
                    counterNumber = counter.id;
                }
    
                // If a counter with the fewest tokens is found, break the loop
                if (tokenCount === minTokenCount) {
                    break;
                }
            }
    
            if (counterNumber === null) {
                throw new Error("No counters found for the given office");
            }
    
            const create_token = await prisma.token.create({
                data: {
                    name: body.name,
                    email: body.email,
                    mobile: body.mobile,
                    gender_id: parseInt(body.gender),
                    service_id: parseInt(body.service),
                    priority_id: parseInt(body.priority_lane),
                    office_id: req.auth_user.office.id,
                    counter_id: counterNumber,
                    token: newToken,
                    remarks: body.remarks,
                    duration: body.duration,
                    status_id: 1,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
    
            res.status(200).json({
                code: 200,
                status: true,
                data: create_token,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message,
            });
        }
    },
    // Waiting Screen
    async getWaitingScreen(req, res) {
        // return res.status(200).json({ office_id: req.auth_user });
        try {
            const waitingList = await prisma.token.findMany({
                where: {
                    office_id: req.auth_user.office.id,
                    // user_id: null,
                    status_id: 1,
                },
                include: {
                    service: true,
                    priority: true,
                    counter: true,
                },
            });
            const servingList = await prisma.token.findMany({
                where: {
                    office_id: req.auth_user.office.id,
                    // user_id: {
                    //     not: null,
                    // },
                    status_id: 2,
                },
                include: {
                    service: true,
                    priority: true,
                    counter: true,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                servingData: servingList,
                waitingData: waitingList,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },  
}