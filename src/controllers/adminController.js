const { PrismaClient } = require('@prisma/client');
const { error } = require('console');
const prisma = new PrismaClient();

module.exports = {
    // Counter
    async counterList(req, res) {
        try {
            const counter = await prisma.counter.findMany({
                include: {
                    office: true,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: counter,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async counterCreate(req, res) {
        const { title, counter_number, office_id, status } = req.body;
        try {
            const counter = await prisma.counter.create({
                data: {
                    title,
                    counter_number,
                    office_id: parseInt(office_id),
                    status: parseInt(status),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: counter,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async counterUpdate(req, res) {
        const { id, title, counter_number, office_id, status } = req.body;
        try {
            // check counter found
            const found_counter = await prisma.counter.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_counter) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Counter not found',
                });
            }
            // update counter
            const counter = await prisma.counter.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    title,
                    counter_number,
                    office_id: parseInt(office_id),
                    status: parseInt(status),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: counter,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async counterDelete(req, res) {
        const { id } = req.body;
        try {
            // check counter found
            const found_counter = await prisma.counter.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_counter) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Counter not found',
                });
            }
            // check counter used
            const check_counter = await prisma.counter.findFirst({
                where: {
                    user_id: {
                        not: null,
                        not: 0,
                    }
                },
            });
            if (check_counter) {
                let user = await prisma.user.findFirst({
                    where: {
                        id: check_counter.user_id,
                    },
                });
                return res.status(400).json({
                    code: 400,
                    status: false,
                    message: 'Counter is being used, cannot delete counter',
                    error: {
                        // id: user.id,
                        name: user.first_name + ' ' + user.last_name,
                        mobile: user.mobile_number,
                        email: user.email,
                    }
                });
            }
            // delete counter
            await prisma.counter.delete({
                where: {
                    id: parseInt(id),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Counter deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    // Office
    async officeList(req, res) {
        try {
            const office = await prisma.office.findMany();
            res.status(200).json({
                code: 200,
                status: true,
                data: office,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async officeCreate(req, res) {
        const { office_name, status } = req.body;
        try {
            const office = await prisma.office.create({
                data: {
                    office_name,
                    status: parseInt(status),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: office,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async officeUpdate(req, res) {
        const { id, office_name, status } = req.body;
        try {
            // check office found
            const found_office = await prisma.office.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_office) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Office not found',
                });
            }
            // update office
            const office = await prisma.office.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    office_name,
                    status: parseInt(status),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: office,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async officeDelete(req, res) {
        const { id } = req.body;
        try {
            // check office found
            const found_office = await prisma.office.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_office) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Office not found',
                });
            }
            // delete office
            await prisma.office.delete({
                where: {
                    id: parseInt(id),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Office deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    // Priority
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
                    status: parseInt(status),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
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
    }
};