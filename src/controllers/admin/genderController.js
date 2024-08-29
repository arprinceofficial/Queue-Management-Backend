const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    async genderList(req, res) {
        try {
            const gender = await prisma.gender.findMany();
            res.status(200).json({
                code: 200,
                status: true,
                data: gender,
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
    async genderCreate(req, res) {
        const { name, short_name, status } = req.body;
        try {
            const gender = await prisma.gender.create({
                data: {
                    name,
                    status: parseInt(status || 0),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Gender created successfully',
                data: gender,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async genderUpdate(req, res) {
        const { id, name, status } = req.body;
        try {
            // check gender found
            const found_gender = await prisma.gender.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_gender) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'gender not found',
                });
            }
            // update gender
            const gender = await prisma.gender.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name,
                    status: parseInt(status),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Gender created successfully',
                data: gender,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async genderDelete(req, res) {
        const { id } = req.body;
        try {
            // check gender found
            const found_gender = await prisma.gender.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_gender) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'gender not found',
                });
            }
            // delete gender
            await prisma.gender.delete({
                where: {
                    id: parseInt(id),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Gender deleted successfully',
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