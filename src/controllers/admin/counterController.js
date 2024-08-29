const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    async counterList(req, res) {
        const { limit, page, search, status, office_id } = req.body;
        try {
            const where_clause = {
                OR: [
                    {
                        title: {
                            contains: search || '',
                        },
                    },
                    {
                        counter_number: {
                            contains: search || '',
                        },
                    },
                ],
            };
            // If status is provided then filter by status
            if (status) {
                where_clause.status = parseInt(status);
            }
            // If office_id is provided then filter by office_id
            if (office_id) {
                where_clause.office_id = parseInt(office_id);
            }
            // If limit and page is not provided then fetch all records
            if (!limit && !page) {
                const counter = await prisma.counter.findMany({
                    where: {
                        office: {
                            status: 1, // Filter counter list where office status is 1
                        },
                        AND: where_clause,
                    },
                    include: {
                        office: true,
                    },
                });
                return res.status(200).json({
                    code: 200,
                    status: true,
                    total: counter.length,
                    data: counter,
                });
            }
            const counter = await prisma.counter.findMany({
                where: {
                    office: {
                        status: 1, // Filter counter list where office status is 1
                    },
                    AND: where_clause,
                },
                include: {
                    office: true,
                },
                take: parseInt(limit) || 10,
                skip: parseInt((page || 1) - 1) * parseInt(limit || 10),
            });

            const totalRecords = await prisma.counter.count({
                where: {
                    office: {
                        status: 1, // Filter counter list where office status is 1
                    },
                    AND: where_clause,
                },
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
                    status: parseInt(status || 0),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                include: {
                    office: true,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Counter created successfully',
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
                include: {
                    office: true,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Counter updated successfully',
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
                    id: parseInt(id),
                },
            });
            // return res.status(200).json({ data: check_counter.user_id });
            if (check_counter.user_id) {
                let user = await prisma.user.findFirst({
                    where: {
                        id: check_counter.user_id,
                    },
                });
                return res.status(409).json({
                    code: 409,
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
                data: {
                    id: found_counter.id,
                    title: found_counter.title,
                    counter_number: found_counter.counter_number,
                    office_id: found_counter.office_id,
                    status: found_counter.status,
                }
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