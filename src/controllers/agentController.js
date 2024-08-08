const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    async getCounter(req, res) {
        // return console.log(req.auth_user.office.id);
        try {
            const counters = await prisma.counter.findMany({
                where: {
                    office_id: req.auth_user.office.id,
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
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    // revoke-counter
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
    // get waiting list from token table
    async getWaitingList(req, res) {
        // return res.status(200).json({ office_id: req.auth_user });
        // return res.status(200).json({ counter_number: parseInt(req.auth_user.queue_counter.counter_number), office_id: req.auth_user.office.id });
        try {
            const waitingList = await prisma.token.findMany({
                where: {
                    office_id: req.auth_user.office.id,
                    counter_number: parseInt(req.auth_user.queue_counter.counter_number),
                    user_id: null,
                    status_id: 1,
                },
                include: {
                    service: true,
                    priority: true,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: waitingList,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    // reserve-queue
    async reserveQueue(req, res) {
        const { id } = req.body;
        try {
            const token = await prisma.token.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    user_id: req.auth_user.user.id,
                    status_id: 2,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: token,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
        
    },
    // get reserveQueue
    async getReserveQueue(req, res) {
        try {
            const token = await prisma.token.findFirst({
                where: {
                    user_id: req.auth_user.user.id,
                    status_id: 2,
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
    // complete-queue
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
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    // cancel-queue
    async cancelQueue(req, res) {
        const { id } = req.body;
        try {
            const token = await prisma.token.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    status_id: 4,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: token,
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