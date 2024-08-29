const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    async serviceList(req, res) {
        const { limit, page, search, status } = req.body;
        try {
            const where_clause = {
                OR: [
                    {
                        title: {
                            contains: search || '',
                        },
                    },
                ],
            };
            // If status is provided then filter by status
            if (status !== "") {
                where_clause.status = parseInt(status || 1);
            }
            // If limit and page is not provided then fetch all records
            if (!limit && !page) {
                const services = await prisma.services.findMany({
                    where: where_clause,
                });
                return res.status(200).json({
                    code: 200,
                    status: true,
                    total: services.length,
                    data: services,
                });
            }
            const services = await prisma.services.findMany({
                where: where_clause,
                take: parseInt(limit) || 10,
                skip: parseInt((page || 1) - 1) * parseInt(limit || 10),
            });

            const totalRecords = await prisma.services.count({
                where: where_clause,
            });

            res.status(200).json({
                code: 200,
                status: true,
                pagination: {
                    from: parseInt(page) || 1,
                    to: parseInt(page) + 1 || 1,
                    current_page: parseInt(page) || 1,
                    last_page: Math.ceil(totalRecords / (parseInt(limit) || 10)),
                    per_page: parseInt(limit) || 10,
                    total: totalRecords,
                },
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
    async serviceCreate(req, res) {
        const { title, status } = req.body;
        try {
            const services = await prisma.services.create({
                data: {
                    title,
                    status: parseInt(status || 0),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Service created successfully',
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
    async serviceUpdate(req, res) {
        const { id, title, status } = req.body;
        try {
            // check service found
            const found_service = await prisma.services.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_service) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Service not found',
                });
            }
            // update service
            const service = await prisma.services.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    title,
                    status: parseInt(status),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Service updated successfully',
                data: service,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async serviceDelete(req, res) {
        const { id } = req.body;
        try {
            // check service found
            const found_service = await prisma.services.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_service) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Service not found',
                });
            }
            // delete service
            await prisma.services.delete({
                where: {
                    id: parseInt(id),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Service deleted successfully',
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