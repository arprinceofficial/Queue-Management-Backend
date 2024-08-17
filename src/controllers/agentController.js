const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const limit_hours = new Date(new Date().getTime() - 8 * 60 * 60 * 1000);
// return res.status(200).json({ office_id: req.auth_user });

module.exports = {
    // Counter Section
    async getCounter(req, res) {
        // return console.log(req.auth_user.office.id);
        try {
            const counters = await prisma.counter.findMany({
                where: {
                    office_id: req.auth_user.office.id,
                    status: 1,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                availabeCounter: counters.filter(counter => counter.user_id === null).length,
                bookedCounter: counters.filter(counter => counter.user_id !== null).length,
                availabledata: counters.filter(counter => counter.user_id === null),
                bookeddata: counters.filter(counter => counter.user_id !== null),
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    async setCounter(req, res) {
        const { counter_id } = req.body;
        try {
            const counter = await prisma.counter.update({
                where: {
                    id: parseInt(counter_id),
                },
                data: {
                    user_id: req.auth_user.user.id,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: counter,
            });
            req.io.emit('setCounter', 'setCounter');
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    // Main Screen Section
    async revokeCounter(req, res) {
        const { counter_id } = req.body;
        try {
            const counter = await prisma.counter.update({
                where: {
                    id: parseInt(counter_id),
                },
                data: {
                    user_id: null,
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
                status: "error",
                message: error.message
            });
        }
    },
    async getWaitingList(req, res) {
        // return res.status(200).json({ data: req.auth_user });
        // return res.status(200).json({ data: parseInt(req.auth_user.queue_counter.id), office_id: req.auth_user.office.id });
        try {
            const waitingList = await prisma.token.findMany({
                where: {
                    office_id: req.auth_user.office.id,
                    counter_id: req.auth_user.queue_counter.id,
                    user_id: null,
                    status_id: 1,
                    created_at: {
                        gte: limit_hours,
                    },
                },
                include: {
                    service: true,
                    priority: true,
                },
                orderBy: {
                    priority: {
                        short_name: 'asc',
                    },
                },
            });
    
            res.status(200).json({
                code: 200,
                status: true,
                count: waitingList.length,
                data: waitingList,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message,
            });
        }
    },
    async reserveQueue(req, res) {
        // return res.status(200).json({ counter_id: req.auth_user.queue_counter.id });
        const { id } = req.body;
        try {
            const token = await prisma.token.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    user_id: req.auth_user.user.id,
                    status_id: 2,
                    counter_id: req.auth_user.queue_counter.id,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: token,
            });
            req.io.emit('reserveQueue', token);
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }

    },
    async getReserveQueue(req, res) {
        try {
            const token = await prisma.token.findFirst({
                where: {
                    user_id: req.auth_user.user.id,
                    status_id: 2,
                    created_at: {
                        gte: limit_hours,
                    },
                },
                include: {
                    service: true,
                    priority: true,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: token || [],
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    async completeQueue(req, res) {
        const { id, duration, remarks } = req.body;
        try {
            const token = await prisma.token.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    duration: duration,
                    remarks: remarks,
                    status_id: 3,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: token,
            });
            req.io.emit('completeQueue', token);
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    async cancelQueue(req, res) {
        const { id } = req.body;
        try {
            const token = await prisma.token.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    status_id: 4,
                    user_id: null,
                    counter_id: null,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: token,
            });
            req.io.emit('cancelQueue', token);
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    // Transfer Section
    async getOnlineCounter(req, res) {
        // return res.status(200).json({ counter: req.auth_user.queue_counter.id });
        try {
            const counters = await prisma.counter.findMany({
                where: {
                    office_id: req.auth_user.office.id,
                    id: {
                        not: req.auth_user.queue_counter.id,
                    },
                    status: 1,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: counters,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    async transferQueue(req, res) {
        const { id, counter_id } = req.body;
        try {
            const token = await prisma.token.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    counter_id: parseInt(counter_id),
                    user_id: null,
                    status_id: 1,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: token,
            });
            req.io.emit('transferQueue', token);
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
}