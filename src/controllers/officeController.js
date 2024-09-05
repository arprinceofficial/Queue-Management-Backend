const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const limit_hours = new Date(new Date().getTime() - 8 * 60 * 60 * 1000);
// return res.status(200).json({ data: req.auth_user });

module.exports = {
    async services(req, res) {
        try {
            const services = await prisma.services.findMany();
            res.status(200).json({
                code: 200,
                status: true,
                data: services,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async queueServices(req, res) {
        try {
            // Fetch genders, priorities, and services from the database
            const genders = await prisma.gender.findMany({
                where: {
                    status: 1
                }
            });

            const priorities = await prisma.priority.findMany({
                where: {
                    status: 1
                }
            });

            const services = await prisma.services.findMany({
                where: {
                    status: 1
                }
            });

            // Fetch the queue services
            const queueServices = await prisma.queue_services.findMany({
                where: {
                    status: 1
                }
            });

            // Iterate over each queue service and add the appropriate options to its fields
            const responseData = queueServices.map(service => {
                const fields = JSON.parse(service.fields).map(field => {
                    if (field.selected_option == 1) {
                        field.options = genders.map(gender => ({
                            id: gender.id,
                            name: gender.name
                        }));
                    } else if (field.selected_option == 2) {
                        field.options = priorities.map(priority => ({
                            id: priority.id,
                            name: priority.name
                        }));
                    } else if (field.selected_option == 3) {
                        field.options = services.map(srv => ({
                            id: srv.id,
                            name: srv.name
                        }));
                    }
                    return field;
                });

                return {
                    id: service.id,
                    name: service.name,
                    color: service.color,
                    slug: service.slug,
                    route: service.route,
                    icon: service.icon,
                    fields: fields,
                    status: service.status,
                    created_at: service.created_at,
                    updated_at: service.updated_at
                };
            });

            // Return the response
            res.status(200).json({
                code: 200,
                status: true,
                data: responseData
            });
        } catch (error) {
            // Handle errors
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },

    async queueServicesByslug(req, res) {
        const { slug } = req.params;
        try {
            // Fetch genders, priorities, and services from the database
            const genders = await prisma.gender.findMany({
                where: {
                    status: 1
                }
            });
            const priorities = await prisma.priority.findMany({
                where: {
                    status: 1
                }
            });
            const services = await prisma.services.findMany({
                where: {
                    status: 1
                }
            });
            // Fetch the queue services
            const queueServices = await prisma.queue_services.findFirst({
                where: {
                    slug: slug,
                    status: 1
                }
            });

            // Iterate over each queue service and add the appropriate options to its fields
            const fields = JSON.parse(queueServices.fields).map(field => {
                if (field.selected_option == 1) {
                    field.options = genders.map(gender => ({
                        id: gender.id,
                        name: gender.name
                    }));
                } else if (field.selected_option == 2) {
                    field.options = priorities.map(priority => ({
                        id: priority.id,
                        name: priority.name
                    }));
                } else if (field.selected_option == 3) {
                    field.options = services.map(srv => ({
                        id: srv.id,
                        name: srv.title
                    }));
                }
                return field;
            });
            const responseData = {
                id: queueServices.id,
                name: queueServices.name,
                color: queueServices.color,
                slug: queueServices.slug,
                route: queueServices.route,
                icon: queueServices.icon,
                fields: fields,
                status: queueServices.status,
                created_at: queueServices.created_at,
                updated_at: queueServices.updated_at
            };

            res.status(200).json({
                code: 200,
                status: true,
                data: responseData
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async createQueueToken(req, res) {
        // return res.status(200).json({ data: req.auth_user.office.id });

        const { body } = req;
        if (!body.priority_lane) {
            body.priority_lane = 1;
        }
        try {
            const status = await prisma.status.findFirst({ where: { name: 'Waiting' } });
            const priority = await prisma.priority.findFirst({
                where: {
                    id: body.priority_lane.toString(),
                },
            });

            if (!priority) {
                throw new Error("Priority not found");
            }

            // Find the last token for that office with in last 8 hours
            const lastToken = await prisma.token.findFirst({
                where: {
                    office_id: req.auth_user.office.id,
                    created_at: {
                        gte: limit_hours,
                    },
                    status_id: status.id.toString(),
                },
                orderBy: {
                    created_at: 'desc',
                },
            });

            let newToken = '';
            if (lastToken) {
                const lastTokenParts = lastToken.token.split('-');
                if (lastTokenParts.length > 1) {
                    const lastTokenNumber = parseInt(lastTokenParts[1], 10);
                    if (!isNaN(lastTokenNumber)) {
                        newToken = `${priority.short_name}-${(lastTokenNumber + 1).toString().padStart(3, '0')}`;
                    } else {
                        newToken = `${priority.short_name}-001`;
                    }
                } else {
                    newToken = `${priority.short_name}-001`;
                }
            } else {
                newToken = `${priority.short_name}-001`;
            }

            // Find all counters for the office
            const counters = await prisma.counter.findMany({
                where: {
                    office_id: req.auth_user.office.id,
                    status: 1,
                    user_id: {
                        not: null,
                    },
                },
            });

            let set_counter_id = null;
            let minTokenCount = Infinity;

            // Randomly shuffle counters
            const shuffledCounters = counters.sort(() => 0.5 - Math.random());

            // Iterate through shuffled counters and find the first one with the fewest tokens
            for (const counter of shuffledCounters) {
                const tokenCount = await prisma.token.count({
                    where: {
                        counter_id: counter.id,
                        office_id: req.auth_user.office.id,
                        created_at: {
                            gte: limit_hours,
                        },
                    },
                });

                if (tokenCount < minTokenCount) {
                    minTokenCount = tokenCount;
                    set_counter_id = counter.id;
                }

                // If a counter with the fewest tokens is found, break the loop
                if (tokenCount === minTokenCount) {
                    break;
                }
            }

            if (set_counter_id === null) {
                throw new Error("No counters found for the given office");
            }

            // return res.status(200).json({ data: set_counter_id });

            const create_token = await prisma.token.create({
                data: {
                    name: body.name,
                    email: body.email,
                    mobile: body.mobile,
                    gender_id: body.gender ? body.gender.toString() : 1,
                    service_id: body.service ? body.service.toString() : 1,
                    priority_id: body.priority_lane ? body.priority_lane.toString() : 1,
                    office_id: req.auth_user.office.id,
                    counter_id: set_counter_id,
                    token: newToken,
                    remarks: body.remarks,
                    duration: body.duration,
                    status_id: status.id.toString(),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            res.status(200).json({
                code: 200,
                status: true,
                data: create_token,
            });
            req.io.emit('createQueueToken', create_token);
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message,
            });
        }
    },
    // Waiting Screen
    async getWaitingScreen(req, res) {
        // return res.status(200).json({ office_id: req.auth_user });

        try {
            const status_waiting = await prisma.status.findFirst({ where: { name: 'Waiting' } });
            const status_serving = await prisma.status.findFirst({ where: { name: 'Serving' } });

            const waitingList = await prisma.token.findMany({
                where: {
                    office_id: req.auth_user.office.id,
                    // user_id: null,
                    status_id: status_waiting.id.toString(),
                    created_at: {
                        gte: limit_hours,
                    },
                },
                include: {
                    service: true,
                    priority: true,
                    counter: true,
                },
            });
            const servingList = await prisma.token.findMany({
                where: {
                    office_id: req.auth_user.office.id,
                    // user_id: {
                    //     not: null,
                    // },
                    status_id: status_serving.id.toString(),
                    created_at: {
                        gte: limit_hours,
                    },
                },
                include: {
                    service: true,
                    priority: true,
                    counter: true,
                },
            });
            const announcementData = await prisma.wt_news.findMany({
                where: {
                    status: 1,
                },
            })
            const contentData = await prisma.wt_video.findMany({
                where: {
                    status: 1,
                },
            })
            res.status(200).json({
                code: 200,
                status: true,
                servingData: servingList,
                waitingData: waitingList,
                announcementData: announcementData,
                contentData: contentData,
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