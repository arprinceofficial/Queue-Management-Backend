const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { body, validationResult } = require('express-validator');

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
        await body('name').notEmpty().withMessage('name is required').run(req);
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

        const { name, status } = req.body;
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
        await body('name').notEmpty().withMessage('name is required').run(req);
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
                message: 'Gender Update Successfully',
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