const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { body, validationResult } = require('express-validator');

module.exports = {
    async officeList(req, res) {
        const { limit, page, search, status } = req.body;
        try {
            const where_clause = {
                OR: [
                    {
                        office_name: {
                            contains: search || '',
                            mode: 'insensitive',
                        },
                    },
                ],
            };
            // If status is provided then filter by status
            if (status) {
                where_clause.status = parseInt(status || 1);
            }
            // If limit and page is not provided then fetch all records
            if (!limit && !page) {
                const office = await prisma.office.findMany({
                    where: where_clause,
                });
                return res.status(200).json({
                    code: 200,
                    status: true,
                    total: office.length,
                    data: office,
                });
            }
            const office = await prisma.office.findMany({
                where: where_clause,
                take: parseInt(limit) || 10,
                skip: parseInt((page || 1) - 1) * parseInt(limit || 10),
            });

            const totalRecords = await prisma.office.count({
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
        await body('office_name').notEmpty().withMessage('First name is required').run(req);
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

        const { office_name, status } = req.body;
        try {
            const office = await prisma.office.create({
                data: {
                    office_name,
                    status: parseInt(status || 0),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Office Created Successfully',
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
        await body('office_name').notEmpty().withMessage('First name is required').run(req);
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

        const { id, office_name, status } = req.body;
        try {
            // check office found
            const found_office = await prisma.office.findFirst({
                where: {
                    id: id.toString(),
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
                    id: id.toString(),
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
                message: 'Office Updated Successfully',
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
                    id: id.toString(),
                },
            });
            if (!found_office) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Office not found',
                });
            }
            // check office used
            const check_office = await prisma.counter.findFirst({
                where: {
                    office_id: id.toString(),
                },
            });
            if (check_office) {
                return res.status(409).json({
                    code: 409,
                    status: false,
                    message: 'Office is being used, cannot delete office',
                    error: {
                        id: check_office.id,
                        title: check_office.title,
                        counter_number: check_office.counter_number,
                        office_id: check_office.office_id,
                        status: check_office.status,
                    }
                });
            }
            // delete office
            await prisma.office.delete({
                where: {
                    id: id.toString(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Office Deleted Successfully',
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