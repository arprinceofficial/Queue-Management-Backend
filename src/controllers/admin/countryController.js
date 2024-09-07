const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { body, validationResult } = require('express-validator');

module.exports = {
    async countryList(req, res) {
        const { limit, page, search, status } = req.body;
        try {
            const where_clause = {
                OR: [
                    {
                        country_name: {
                            contains: search || '',
                            mode: 'insensitive',
                        },
                    },
                    {
                        country_code: {
                            contains: search || '',
                        },
                    },
                    {
                        iso: {
                            contains: search || '',
                            mode: 'insensitive',
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
                const country = await prisma.country.findMany({
                    where: where_clause,
                });
                return res.status(200).json({
                    code: 200,
                    status: true,
                    total: country.length,
                    data: country,
                });
            }
            const country = await prisma.country.findMany({
                where: where_clause,
                take: parseInt(limit) || 10,
                skip: parseInt((page || 1) - 1) * parseInt(limit || 10),
            });

            const totalRecords = await prisma.country.count({
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
                data: country,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message,
            });
        }
    },
    async countryCreate(req, res) {
        await body('country_name').notEmpty().withMessage('Country Name is required').run(req);
        await body('country_code').notEmpty().withMessage('Country Code is required').run(req);
        await body('iso').notEmpty().withMessage('iso is required').run(req);
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

        const { country_name, country_code, iso, status } = req.body;
        try {
            const country = await prisma.country.create({
                data: {
                    country_name,
                    country_code,
                    iso,
                    status: parseInt(status || 0),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Country Created Successfully',
                data: country,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async countryUpdate(req, res) {
        await body('country_name').notEmpty().withMessage('Country Name is required').run(req);
        await body('country_code').notEmpty().withMessage('Country Code is required').run(req);
        await body('iso').notEmpty().withMessage('iso is required').run(req);
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

        const { id, country_name, country_code, iso, status } = req.body;
        try {
            // check country found
            const found_country = await prisma.country.findFirst({
                where: {
                    id: id.toString(),
                },
            });
            if (!found_country) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'country not found',
                });
            }
            // update country
            const country = await prisma.country.update({
                where: {
                    id: id.toString(),
                },
                data: {
                    country_name,
                    country_code,
                    iso,
                    status: parseInt(status),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Country Updated Successfully',
                data: country,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async countryDelete(req, res) {
        const { id } = req.body;
        try {
            // check country found
            const found_country = await prisma.country.findFirst({
                where: {
                    id: id.toString(),
                },
            });
            if (!found_country) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'country not found',
                });
            }
            // delete country
            await prisma.country.delete({
                where: {
                    id: id.toString(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Country Deleted Successfully',
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