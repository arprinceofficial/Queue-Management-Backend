const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        const { body } = req;
        // console.log(body);
        try {
            const priority = await prisma.priority.findUnique({
                where: {
                    id: parseInt(body.priority_lane),
                },
            });
            
            if (!priority) {
                throw new Error("Priority not found");
            }
            
            // Get the current date in YYYY-MM-DD format
            const currentDate = new Date().toISOString().split('T')[0];
            
            // Find the last token for today and increment by 1
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
                        // console.error("Failed to parse last token number:", lastTokenParts[1]);
                        newToken = `${priority.short_name}-001`;
                    }
                } else {
                    // console.error("Unexpected token format:", lastToken.token);
                    newToken = `${priority.short_name}-001`;
                }
            } else {
                newToken = `${priority.short_name}-001`;
            }
            
            const create_token = await prisma.token.create({
                data: {
                    name: body.name,
                    email: body.email,
                    mobile_number: body.mobile,
                    gender_id: parseInt(body.gender),
                    service_id: parseInt(body.service),
                    priority_id: parseInt(body.priority_lane),
                    office_id: req.auth_user.office.id,
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
                message: error.message
            });
        }
    }
}