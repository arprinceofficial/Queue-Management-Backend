const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    async WTnewsList(req, res) {
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
                const wt_news = await prisma.wt_news.findMany({
                    where: where_clause,
                });
                return res.status(200).json({
                    code: 200,
                    status: true,
                    total: wt_news.length,
                    data: wt_news,
                });
            }
            const wt_news = await prisma.wt_news.findMany({
                where: where_clause,
                take: parseInt(limit) || 10,
                skip: parseInt((page || 1) - 1) * parseInt(limit || 10),
            });

            const totalRecords = await prisma.wt_news.count({
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
                data: wt_news,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async WTnewsCreate(req, res) {
        const { title, description, status } = req.body;
        try {
            const wt_news = await prisma.wt_news.create({
                data: {
                    title,
                    description,
                    status: parseInt(status || 0),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'WT News created successfully',
                data: wt_news,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async WTnewsUpdate(req, res) {
        const { id, title, description, status } = req.body;
        try {
            // check wt_news found
            const found_wt_news = await prisma.wt_news.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_wt_news) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'wt_news not found',
                });
            }
            // update wt_news
            const wt_news = await prisma.wt_news.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    title,
                    description,
                    status: parseInt(status),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'WT news updated successfully',
                data: wt_news,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async WTnewsDelete(req, res) {
        const { id } = req.body;
        try {
            // check wt_news found
            const found_wt_news = await prisma.wt_news.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_wt_news) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'wt_news not found',
                });
            }
            // delete wt_news
            await prisma.wt_news.delete({
                where: {
                    id: parseInt(id),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'WT news deleted successfully',
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