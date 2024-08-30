const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { body, validationResult } = require('express-validator');

module.exports = {
    async priorityList(req, res) {
        try {
            const priority = await prisma.priority.findMany();
            res.status(200).json({
                code: 200,
                status: true,
                data: priority,
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
    async priorityCreate(req, res) {
        await body('name').notEmpty().withMessage('Name is required').run(req);
        await body('short_name').notEmpty().withMessage('Short Name is required').run(req);
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

        const { name, short_name, status } = req.body;
        try {
            const priority = await prisma.priority.create({
                data: {
                    name,
                    short_name,
                    status: parseInt(status || 0),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Priority created successfully',
                data: priority,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async priorityUpdate(req, res) {
        await body('name').notEmpty().withMessage('Name is required').run(req);
        await body('short_name').notEmpty().withMessage('Short Name is required').run(req);
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

        const { id, name, short_name, status } = req.body;
        try {
            // check priority found
            const found_priority = await prisma.priority.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_priority) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Priority not found',
                });
            }
            // update priority
            const priority = await prisma.priority.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name,
                    short_name,
                    status: parseInt(status),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Priority updated successfully',
                data: priority,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async priorityDelete(req, res) {
        const { id } = req.body;
        try {
            // check priority found
            const found_priority = await prisma.priority.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_priority) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Priority not found',
                });
            }
            // delete priority
            await prisma.priority.delete({
                where: {
                    id: parseInt(id),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Priority deleted successfully',
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