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
            const services = await prisma.queue_services.findMany({
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
}