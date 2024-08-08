const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    async menu(req, res) {
        const { id } = req.params;
        try {
            const menus = await prisma.menu.findMany({
                where: {
                    parent_id: null,
                },
                include: {
                    children: true,
                },
            });
            const roleId = parseInt(id);
            const filteredMenus = menus.filter(menu =>
                menu.role_ids.includes(roleId)
            );
            res.status(200).json({
                code: 200,
                status: "success",
                data: filteredMenus,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    async createMenu(req, res) {
        const menusData = req.body;
        try {
            // Multiple menu creation
            if (Array.isArray(menusData)) {
                const createdMenus = await Promise.all(menusData.map(async (menuData) => {
                    const role_ids = typeof menuData.role_ids === 'string' ? JSON.parse(menuData.role_ids) : menuData.role_ids;
                    return prisma.menu.create({
                        data: {
                            title: menuData.title,
                            path: menuData.path,
                            parent_id: menuData.parent_id ? parseInt(menuData.parent_id) : undefined,
                            role_ids: role_ids,
                            created_at: new Date(),
                            updated_at: new Date(),
                        }
                    });
                }));
                return res.status(201).json({
                    code: 201,
                    status: "success",
                    data: createdMenus,
                });
            } else {
                // Single menu creation
                const role_ids = typeof menusData.role_ids === 'string' ? JSON.parse(menusData.role_ids) : menusData.role_ids;
                const menu = await prisma.menu.create({
                    data: {
                        title: menusData.title,
                        path: menusData.path,
                        parent_id: menusData.parent_id ? parseInt(menusData.parent_id) : undefined,
                        role_ids: role_ids,
                        created_at: new Date(),
                        updated_at: new Date(),
                    }
                });
                return res.status(201).json({
                    code: 201,
                    status: "success",
                    data: menu,
                });
            }

        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    async updateMenu(req, res) {
        const { id } = req.params;
        const menuData = req.body;
        try {
            const findMenu = await prisma.menu.findFirst({ where: { id: parseInt(id), } });
            if (!findMenu) {
                return res.status(404).json({
                    code: 404,
                    status: "error",
                    message: "Menu not found",
                });
            }
            const role_ids = typeof menuData.role_ids === 'string' ? JSON.parse(menuData.role_ids) : menuData.role_ids;
            const menu = await prisma.menu.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    title: menuData.title,
                    path: menuData.path,
                    parent_id: menuData.parent_id ? parseInt(menuData.parent_id) : undefined,
                    role_ids: role_ids,
                    updated_at: new Date(),
                }
            });
            res.status(200).json({
                code: 200,
                status: "success",
                data: menu,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    async deleteMenu(req, res) {
        const { id } = req.params;
        try {
            const findMenu = await prisma.menu.findFirst({ where: { id: parseInt(id), } });
            if (!findMenu) {
                return res.status(404).json({
                    code: 404,
                    status: "error",
                    message: "Menu not found",
                });
            }
            await prisma.menu.delete({
                where: {
                    id: parseInt(id),
                }
            });
            res.status(200).json({
                code: 200,
                status: "success",
                message: "Menu deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    // Send message to client using socket.io
    async sendMessageEmitSocketIO(req, res) {
        const { message } = req.body;

        // Option 1

        // req.io.emit('testMessage', message);
        // res.status(200).json({
        //     code: 200,
        //     status: "success",
        //     message: "Message sent successfully",
        // });

        // Option 2

        try {
            req.io.emit('testMessage', message);
            res.status(200).json({
                code: 200,
                status: "success",
                message: "Message sent successfully",
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    }
};