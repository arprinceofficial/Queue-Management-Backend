const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { body, validationResult } = require('express-validator');

module.exports = {
    async WTvideoList(req, res) {
        const { limit, page, search, status } = req.body;
        try {
            const where_clause = {
                OR: [
                    {
                        title: {
                            contains: search || '',
                        },
                    },
                    {
                        description: {
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
                const wt_video = await prisma.wt_video.findMany({
                    where: where_clause,
                });
                return res.status(200).json({
                    code: 200,
                    status: true,
                    total: wt_video.length,
                    data: wt_video,
                });
            }
            const wt_video = await prisma.wt_video.findMany({
                where: where_clause,
                take: parseInt(limit) || 10,
                skip: parseInt((page || 1) - 1) * parseInt(limit || 10),
            });

            const totalRecords = await prisma.wt_video.count({
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
                data: wt_video,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async WTvideoCreate(req, res) {
        await body('title').notEmpty().withMessage('Title is required').run(req);
        await body('link').notEmpty().withMessage('Title is required').run(req);
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

        const { title, link, description, status } = req.body;
        try {
            const wt_video = await prisma.wt_video.create({
                data: {
                    title,
                    link,
                    description,
                    status: parseInt(status || 0),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'WT video Created Successfully',
                data: wt_video,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async WTvideoUpdate(req, res) {
        await body('title').notEmpty().withMessage('Title is required').run(req);
        await body('link').notEmpty().withMessage('Title is required').run(req);
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

        const { id, title, link, description, status } = req.body;
        try {
            // check wt_video found
            const found_wt_video = await prisma.wt_video.findFirst({
                where: {
                    id: id.toString(),
                },
            });
            if (!found_wt_video) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'wt_video not found',
                });
            }
            // update wt_video
            const wt_video = await prisma.wt_video.update({
                where: {
                    id: id.toString(),
                },
                data: {
                    title,
                    link,
                    description,
                    status: parseInt(status),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'WT video Updated Successfully',
                data: wt_video,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async WTvideoDelete(req, res) {
        const { id } = req.body;
        try {
            // check wt_video found
            const found_wt_video = await prisma.wt_video.findFirst({
                where: {
                    id: id.toString(),
                },
            });
            if (!found_wt_video) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'wt_video not found',
                });
            }
            // delete wt_video
            await prisma.wt_video.delete({
                where: {
                    id: id.toString(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'WT video Deleted Successfully',
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