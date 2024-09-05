const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { body, validationResult } = require('express-validator');

module.exports = {
    async queueServiceList(req, res) {
        const { limit, page, search, status } = req.body;
        try {
            const where_clause = {
                OR: [
                    {
                        name: {
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
                const queue_services = await prisma.queue_services.findMany({
                    where: where_clause,
                });
                return res.status(200).json({
                    code: 200,
                    status: true,
                    total: queue_services.length,
                    data: queue_services.map((item) => ({
                        id: item.id,
                        name: item.name,
                        color: item.color,
                        slug: item.slug,
                        route: item.route,
                        icon: item.icon,
                        status: item.status,
                        // fields: item.fields
                        fields: JSON.parse(item.fields)
                    }))
                });
            }
            const queue_services = await prisma.queue_services.findMany({
                where: where_clause,
                take: parseInt(limit) || 10,
                skip: parseInt((page || 1) - 1) * parseInt(limit || 10),
            });
            const totalRecords = await prisma.queue_services.count({
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
                data: queue_services.map((item) => ({
                    id: item.id,
                    name: item.name,
                    color: item.color,
                    slug: item.slug,
                    route: item.route,
                    icon: item.icon,
                    status: item.status,
                    // fields: item.fields
                    fields: JSON.parse(item.fields)
                }))
            });
        }
        catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async queueServiceListById(req, res) {
        const { id } = req.params;
        try {
            const queue_service = await prisma.queue_services.findFirst({
                where: {
                    id: id.toString(),
                },
            });
            if (!queue_service) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Queue Service not found',
                });
            }
            res.status(200).json({
                code: 200,
                status: true,
                data: {
                    id: queue_service.id,
                    name: queue_service.name,
                    color: queue_service.color,
                    slug: queue_service.slug,
                    route: queue_service.route,
                    icon: queue_service.icon,
                    status: queue_service.status,
                    fields: JSON.parse(queue_service.fields)
                }
            });
        }
        catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async queueServiceCreate(req, res) {
        await body('name').notEmpty().withMessage('Name is required').run(req);
        await body('color').notEmpty().withMessage('Color is required').run(req);
        await body('slug').notEmpty().withMessage('Slug is required').run(req);
        await body('route').notEmpty().withMessage('Route is required').run(req);
        await body('icon').notEmpty().withMessage('icon is required').run(req);
        await body('fields').notEmpty().withMessage('Fields is required a').run(req);
        // .custom(value => {
        //     if (!Array.isArray(value) || value.length === 0) {
        //         throw new Error('Fields is required b');
        //     }
        //     return true;
        // })

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorObject = errors.array().reduce((acc, err) => {
                if (!acc[err.path]) {
                    acc[err.path] = [];
                }
                acc[err.path].push(err.msg);
                return acc;
            }, {});

            return res.status(403).json({
                code: 403,
                status: false,
                message: "Validation Error",
                error: errorObject
            });
        }

        const { name, color, slug, route, icon, status, fields } = req.body;
        try {
            const queue_service = await prisma.queue_services.create({
                data: {
                    name,
                    color,
                    slug,
                    route,
                    icon,
                    status: parseInt(status || 0),
                    fields: JSON.stringify(fields),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Queue Service Created Successfully',
                data: {
                    id: queue_service.id,
                    name: queue_service.name,
                    color: queue_service.color,
                    slug: queue_service.slug,
                    route: queue_service.route,
                    icon: queue_service.icon,
                    status: queue_service.status,
                    fields: JSON.parse(queue_service.fields)
                }
            });
        }
        catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async queueServiceUpdate(req, res) {
        await body('name').notEmpty().withMessage('Name is required').run(req);
        await body('color').notEmpty().withMessage('Color is required').run(req);
        await body('slug').notEmpty().withMessage('Slug is required').run(req);
        await body('route').notEmpty().withMessage('Route is required').run(req);
        await body('icon').notEmpty().withMessage('icon is required').run(req);
        await body('fields').notEmpty().withMessage('Fields is required').run(req);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorObject = errors.array().reduce((acc, err) => {
                if (!acc[err.path]) {
                    acc[err.path] = [];
                }
                acc[err.path].push(err.msg);
                return acc;
            }, {});

            return res.status(403).json({
                code: 403,
                status: false,
                message: "Validation Error",
                error: errorObject
            });
        }

        const { id, name, color, slug, route, icon, status, fields } = req.body;
        try {
            // check queue service found
            const found_queue_service = await prisma.queue_services.findFirst({
                where: {
                    id: id.toString(),
                },
            });
            if (!found_queue_service) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Queue Service not found',
                });
            }
            // update queue service
            const queue_service = await prisma.queue_services.update({
                where: {
                    id: id.toString(),
                },
                data: {
                    name,
                    color,
                    slug,
                    route,
                    icon,
                    status: parseInt(status),
                    fields: JSON.stringify(fields),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Queue Service Updated Successfully',
                data: {
                    id: queue_service.id,
                    name: queue_service.name,
                    color: queue_service.color,
                    slug: queue_service.slug,
                    route: queue_service.route,
                    icon: queue_service.icon,
                    status: queue_service.status,
                    fields: JSON.parse(queue_service.fields)
                }
            });
        }
        catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async queueServiceDelete(req, res) {
        const { id } = req.body;
        try {
            // check queue service found
            const found_queue_service = await prisma.queue_services.findFirst({
                where: {
                    id: id.toString(),
                },
            });
            if (!found_queue_service) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Queue Service not found',
                });
            }
            // delete queue service
            await prisma.queue_services.delete({
                where: {
                    id: id.toString(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Queue Service Deleted Successfully',
            });
        }
        catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
}