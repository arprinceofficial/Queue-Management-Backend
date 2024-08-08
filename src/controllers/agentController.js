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
}