const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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