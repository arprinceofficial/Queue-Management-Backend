const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
// return res.status(200).json({ data:  });
// await body('first_name').notEmpty().withMessage('First name is required').isString().withMessage('First name must be a string').isLength({ min: 3, max: 255 }).withMessage('First name must be between 3 and 255 characters').run(req);

module.exports = {
    // Counter
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
    // Office
    async officeList(req, res) {
        const { limit, page, search, status } = req.body;
        try {
            const where_clause = {
                OR: [
                    {
                        office_name: {
                            contains: search || '',
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
                message: 'Office created successfully',
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
        const { id, office_name, status } = req.body;
        try {
            // check office found
            const found_office = await prisma.office.findFirst({
                where: {
                    id: parseInt(id),
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
                    id: parseInt(id),
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
                message: 'Office updated successfully',
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
                    id: parseInt(id),
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
                    office_id: parseInt(id),
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
                    id: parseInt(id),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Office deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    // Service
    async serviceList(req, res) {
        const { limit, page, search, status } = req.body;
        try {
            const where_clause = {
                OR: [
                    {
                        title: {
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
                const services = await prisma.services.findMany({
                    where: where_clause,
                });
                return res.status(200).json({
                    code: 200,
                    status: true,
                    total: services.length,
                    data: services,
                });
            }
            const services = await prisma.services.findMany({
                where: where_clause,
                take: parseInt(limit) || 10,
                skip: parseInt((page || 1) - 1) * parseInt(limit || 10),
            });

            const totalRecords = await prisma.services.count({
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
    async serviceCreate(req, res) {
        const { title, status } = req.body;
        try {
            const services = await prisma.services.create({
                data: {
                    title,
                    status: parseInt(status || 0),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Service created successfully',
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
    async serviceUpdate(req, res) {
        const { id, title, status } = req.body;
        try {
            // check service found
            const found_service = await prisma.services.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_service) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Service not found',
                });
            }
            // update service
            const service = await prisma.services.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    title,
                    status: parseInt(status),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Service updated successfully',
                data: service,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async serviceDelete(req, res) {
        const { id } = req.body;
        try {
            // check service found
            const found_service = await prisma.services.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_service) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Service not found',
                });
            }
            // delete service
            await prisma.services.delete({
                where: {
                    id: parseInt(id),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Service deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    // Priority
    async priorityList(req, res) {
        try {
            const priority = await prisma.priority.findMany();
            res.status(200).json({
                code: 200,
                status: true,
                data: priority,
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
    async priorityCreate(req, res) {
        const { name, short_name, status } = req.body;
        try {
            const priority = await prisma.priority.create({
                data: {
                    name,
                    short_name,
                    status: parseInt(status || 0),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Priority created successfully',
                data: priority,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async priorityUpdate(req, res) {
        const { id, name, short_name, status } = req.body;
        try {
            // check priority found
            const found_priority = await prisma.priority.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_priority) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Priority not found',
                });
            }
            // update priority
            const priority = await prisma.priority.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name,
                    short_name,
                    status: parseInt(status),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Priority updated successfully',
                data: priority,
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async priorityDelete(req, res) {
        const { id } = req.body;
        try {
            // check priority found
            const found_priority = await prisma.priority.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_priority) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Priority not found',
                });
            }
            // delete priority
            await prisma.priority.delete({
                where: {
                    id: parseInt(id),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Priority deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    // Gender
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
    // Office User
    async officeUserList(req, res) {
        const { limit, page, search, status, office_id } = req.body;
        try {
            const where_clause = {
                OR: [
                    {
                        first_name: {
                            contains: search || '',
                        },
                    },
                    {
                        last_name: {
                            contains: search || '',
                        },
                    },
                    {
                        email: {
                            contains: search || '',
                        },
                    },
                    {
                        mobile_number: {
                            contains: search || '',
                        },
                    },
                ],
            };
            // If status is provided then filter by status
            if (status !== "") {
                where_clause.status = parseInt(status || 1);
            }
            // If office_id is provided then filter by office_id
            if (office_id) {
                where_clause.office_id = parseInt(office_id);
            }
            // If limit and page is not provided then fetch all records
            if (!limit && !page) {
                const office_user = await prisma.user.findMany({
                    where: {
                        role_id: 1,
                        AND: where_clause,
                    },
                    include: {
                        office: true,
                        gender: true,
                        country: true,
                    },
                });
                return res.status(200).json({
                    code: 200,
                    status: true,
                    total: office_user.length,
                    data: office_user.map((user) => ({
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        mobile_number: user.mobile_number,
                        email: user.email,
                        profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/admin/profile_images/${user.profile_image}` : null,
                        gender_id: user.gender_id,
                        office_id: user.office_id,
                        status: user.status,
                        gender: user.gender,
                        office: user.office,
                    }))
                });
            }
            const office_user = await prisma.user.findMany({
                where: {
                    role_id: 1,
                    AND: where_clause,
                },
                take: parseInt(limit) || 10,
                skip: parseInt((page || 1) - 1) * parseInt(limit || 10),
                include: {
                    office: true,
                    gender: true,
                    country: true,
                },
            });

            const totalRecords = await prisma.user.count({
                where: {
                    role_id: 1,
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
                data: office_user.map((user) => ({
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    mobile_number: user.mobile_number,
                    email: user.email,
                    profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/admin/profile_images/${user.profile_image}` : null,
                    gender_id: user.gender_id,
                    office_id: user.office_id,
                    status: user.status,
                    gender: user.gender,
                    office: user.office,
                    country: user.country,
                }))
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
    async officeUserCreate(req, res) {
        const { first_name, last_name, mobile_number, email, password, gender_id, office_id, country_id, status } = req.body;
        try {
            // Check if user email exists
            const userExists = await prisma.user.findFirst({ where: { email } });
            if (userExists) {
                return res.status(409).json({
                    code: 409,
                    status: false,
                    message: 'This email already exists'
                });
            }
            // Check if user phone number exists
            const phoneNumberExists = await prisma.user.findFirst({ where: { mobile_number } });
            if (phoneNumberExists) {
                return res.status(409).json({
                    code: 409,
                    status: false,
                    message: 'This phone number already exists'
                });
            }
            // Check mobile number length
            if (mobile_number.length !== 11) {
                return res.status(409).json({
                    code: 409,
                    status: false,
                    message: 'Mobile number must be 11 digits'
                });
            }

            // Hash the password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);

            // Base64 image upload conversion
            const base64Image = req.body.profile_image;
            let newFilename = null;
            const matches = base64Image?.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const imageBuffer = Buffer.from(matches[2], 'base64');
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const randomBytes = crypto.randomBytes(8).toString('hex');
                const extension = matches[1].split('/')[1];
                newFilename = `profile_image_${uniqueSuffix}_${randomBytes}.${extension}`;
                const filePath = path.join(__dirname, '../../assets/images/profile_images', newFilename);
                fs.writeFileSync(filePath, imageBuffer);
            }
            const create_user = {
                first_name,
                last_name,
                mobile_number,
                email,
                password: hashedPassword,
                gender_id: parseInt(gender_id),
                role_id: 1,
                office_id: parseInt(office_id),
                country_id: parseInt(country_id),
                status: parseInt(status || 0),
                created_at: new Date(),
                updated_at: new Date(),
            };
            if (newFilename) {
                create_user.profile_image = newFilename;
            }

            const user = await prisma.user.create({
                include: {
                    office: true,
                    gender: true,
                    country: true,
                },
                data: create_user,
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'User created successfully',
                data: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    mobile_number: user.mobile_number,
                    email: user.email,
                    profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/admin/profile_images/${user.profile_image}` : null,
                    gender_id: user.gender_id,
                    office_id: user.office_id,
                    status: user.status,
                    gender: user.gender,
                    office: user.office,
                    country: user.country,
                },
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
    async officeUserUpdate(req, res) {
        const { id, first_name, last_name, mobile_number, email, password, gender_id, office_id, country_id, status } = req.body;
        try {
            // Check if user found
            const found_user = await prisma.user.findFirst({
                where: {
                    id: parseInt(id),
                    role_id: 1,
                },
            });
            if (!found_user) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'User not found',
                });
            }
            // Check if user email exists
            const userExists = await prisma.user.findFirst({
                where: {
                    email,
                    id: {
                        not: parseInt(id)
                    },
                    role_id: 1,
                }
            });
            if (userExists) {
                return res.status(409).json({
                    code: 409,
                    status: false,
                    message: 'This email already exists'
                });
            }
            // Check if user phone number exists
            const phoneNumberExists = await prisma.user.findFirst({
                where: {
                    mobile_number,
                    id: {
                        not: parseInt(id)
                    },
                    role_id: 1,
                }
            });
            if (phoneNumberExists) {
                return res.status(409).json({
                    code: 409,
                    status: false,
                    message: 'This phone number already exists'
                });
            }

            // Check mobile number length
            if (mobile_number.length !== 11) {
                return res.status(409).json({
                    code: 409,
                    status: false,
                    message: 'Mobile number must be 11 digits'
                });
            }

            // Hash the password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);
            // Base64 image upload conversion
            const base64Image = req.body.profile_image;
            let newFilename = null;
            const matches = base64Image?.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const imageBuffer = Buffer.from(matches[2], 'base64');
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const randomBytes = crypto.randomBytes(8).toString('hex');
                const extension = matches[1].split('/')[1];
                newFilename = `profile_image_${uniqueSuffix}_${randomBytes}.${extension}`;
                const filePath = path.join(__dirname, '../../assets/images/profile_images', newFilename);
                fs.writeFileSync(filePath, imageBuffer);
            }

            // if password is empty or profile image is empty, do not update
            const update_data = {
                first_name,
                last_name,
                mobile_number,
                email,
                gender_id: parseInt(gender_id),
                role_id: 1,
                office_id: parseInt(office_id),
                country_id: parseInt(country_id),
                status: parseInt(status),
                created_at: new Date(),
                updated_at: new Date(),
            };
            if (password && password.trim() !== "") {
                update_data.password = hashedPassword;
            }
            if (newFilename) {
                update_data.profile_image = newFilename;
            }

            const user = await prisma.user.update({
                where: {
                    id: parseInt(id),
                },
                include: {
                    office: true,
                    gender: true,
                    country: true,
                },
                data: update_data,
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'User updated successfully',
                data: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    mobile_number: user.mobile_number,
                    email: user.email,
                    profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/admin/profile_images/${user.profile_image}` : null,
                    gender_id: user.gender_id,
                    office_id: user.office_id,
                    status: user.status,
                    gender: user.gender,
                    office: user.office,
                    country: user.country,
                }
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
    async officeUserDelete(req, res) {
        const { id } = req.body;
        try {
            // check user found
            const found_user = await prisma.user.findFirst({
                where: {
                    id: parseInt(id),
                    role_id: 1,
                },
            });
            if (!found_user) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'User not found',
                });
            }
            // delete user
            await prisma.user.delete({
                where: {
                    id: parseInt(id),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'User deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    // Agent User
    async agentUserList(req, res) {
        const { limit, page, search, status, office_id } = req.body;
        try {
            const where_clause = {
                OR: [
                    {
                        first_name: {
                            contains: search || '',
                        },
                    },
                    {
                        last_name: {
                            contains: search || '',
                        },
                    },
                    {
                        email: {
                            contains: search || '',
                        },
                    },
                    {
                        mobile_number: {
                            contains: search || '',
                        },
                    },
                ],
            };
            // If status is provided then filter by status
            if (status !== "") {
                where_clause.status = parseInt(status || 1);
            }
            // If office_id is provided then filter by office_id
            if (office_id) {
                where_clause.office_id = parseInt(office_id);
            }
            // If limit and page is not provided then fetch all records
            if (!limit && !page) {
                const agent_user = await prisma.user.findMany({
                    where: {
                        role_id: 2,
                        AND: where_clause,
                    },
                    include: {
                        office: true,
                        gender: true,
                        country: true,
                    },
                });
                return res.status(200).json({
                    code: 200,
                    status: true,
                    total: agent_user.length,
                    data: agent_user.map((user) => ({
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        mobile_number: user.mobile_number,
                        email: user.email,
                        profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/admin/profile_images/${user.profile_image}` : null,
                        gender_id: user.gender_id,
                        office_id: user.office_id,
                        country_id: user.country_id,
                        status: user.status,
                        gender: user.gender,
                        office: user.office,
                        country: user.country,
                    }))
                });
            }
            const agent_user = await prisma.user.findMany({
                where: {
                    role_id: 2,
                    AND: where_clause,
                },
                take: parseInt(limit) || 10,
                skip: parseInt((page || 1) - 1) * parseInt(limit || 10),
                include: {
                    office: true,
                    gender: true,
                    country: true,
                },
            });

            const totalRecords = await prisma.user.count({
                where: {
                    role_id: 2,
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
                data: agent_user.map((user) => ({
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    mobile_number: user.mobile_number,
                    email: user.email,
                    profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/admin/profile_images/${user.profile_image}` : null,
                    gender_id: user.gender_id,
                    office_id: user.office_id,
                    country_id: user.country_id,
                    status: user.status,
                    gender: user.gender,
                    office: user.office,
                    country: user.country,
                }))
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
    async agentUserCreate(req, res) {
        // Validation rules
        await body('first_name').notEmpty().withMessage('First name is required').run(req);
        await body('last_name').notEmpty().withMessage('Last name is required').run(req);
        await body('mobile_number').notEmpty().withMessage('Mobile number is required').isLength({ min: 11, max: 11 }).withMessage('Mobile number must be 11 digits').run(req);
        await body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format').run(req);
        await body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').run(req);
        await body('gender_id').notEmpty().withMessage('Gender is required').run(req);
        await body('office_id').notEmpty().withMessage('Office is required').run(req);
        await body('country_id').notEmpty().withMessage('Country is required').run(req);

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

        const { first_name, last_name, mobile_number, email, password, gender_id, office_id, country_id, status } = req.body;
        try {
            // Check if user email exists
            const userExists = await prisma.user.findFirst({ where: { email } });
            if (userExists) {
                return res.status(409).json({
                    code: 409,
                    status: false,
                    message: 'This email already exists',
                    error: {
                        "email": ["This email already exists"]
                    }
                });
            }
            // Check if user phone number exists
            const phoneNumberExists = await prisma.user.findFirst({ where: { mobile_number } });
            if (phoneNumberExists) {
                return res.status(409).json({
                    code: 409,
                    status: false,
                    message: 'This phone number already exists',
                    error: {
                        "mobile_number": ["This phone number already exists"]
                    }
                });
            }

            // Hash the password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);

            // Base64 image upload conversion
            const base64Image = req.body.profile_image;
            let newFilename = null;
            const matches = base64Image?.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const imageBuffer = Buffer.from(matches[2], 'base64');
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const randomBytes = crypto.randomBytes(8).toString('hex');
                const extension = matches[1].split('/')[1];
                newFilename = `profile_image_${uniqueSuffix}_${randomBytes}.${extension}`;
                const filePath = path.join(__dirname, '../../assets/images/profile_images', newFilename);
                fs.writeFileSync(filePath, imageBuffer);
            }
            const create_user = {
                first_name,
                last_name,
                mobile_number,
                email,
                password: hashedPassword,
                gender_id: parseInt(gender_id),
                role_id: 2,
                office_id: parseInt(office_id),
                country_id: parseInt(country_id),
                status: parseInt(status || 0),
                created_at: new Date(),
                updated_at: new Date(),
            };
            if (newFilename) {
                create_user.profile_image = newFilename;
            }

            const user = await prisma.user.create({
                include: {
                    office: true,
                    gender: true,
                    country: true,
                },
                data: create_user,
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'User created successfully',
                data: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    mobile_number: user.mobile_number,
                    email: user.email,
                    profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/admin/profile_images/${user.profile_image}` : null,
                    gender_id: user.gender_id,
                    office_id: user.office_id,
                    country_id: user.country_id,
                    status: user.status,
                    gender: user.gender,
                    office: user.office,
                    country: user.country,
                }
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
    async agentUserUpdate(req, res) {
        await body('first_name').notEmpty().withMessage('First name is required').run(req);
        await body('last_name').notEmpty().withMessage('Last name is required').run(req);
        await body('mobile_number').notEmpty().withMessage('Mobile number is required').isLength({ min: 11, max: 11 }).withMessage('Mobile number must be 11 digits').run(req);
        await body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format').run(req);
        // await body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').run(req);
        await body('gender_id').notEmpty().withMessage('Gender is required').run(req);
        await body('office_id').notEmpty().withMessage('Office is required').run(req);
        await body('country_id').notEmpty().withMessage('Country is required').run(req);

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

        const { id, first_name, last_name, mobile_number, email, password, gender_id, office_id, country_id, status } = req.body;
        try {
            // Check if user found
            const found_user = await prisma.user.findFirst({
                where: {
                    id: parseInt(id),
                    role_id: 2,
                },
            });
            if (!found_user) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'User not found',
                });
            }
            // Check if user email exists
            const userExists = await prisma.user.findFirst({
                where: {
                    email,
                    id: {
                        not: parseInt(id)
                    },
                    role_id: 2,
                }
            });
            if (userExists) {
                return res.status(409).json({
                    code: 409,
                    status: false,
                    message: 'This email already exists',
                    error: {
                        "email": ["This email already exists"]
                    }
                });
            }
            // Check if user phone number exists
            const phoneNumberExists = await prisma.user.findFirst({
                where: {
                    mobile_number,
                    id: {
                        not: parseInt(id)
                    },
                    role_id: 2,
                }
            });
            if (phoneNumberExists) {
                return res.status(409).json({
                    code: 409,
                    status: false,
                    message: 'This phone number already exists',
                    error: {
                        "mobile_number": ["This phone number already exists"]
                    }
                });
            }

            // Hash the password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);
            // Base64 image upload conversion
            const base64Image = req.body.profile_image;
            let newFilename = null;
            const matches = base64Image?.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const imageBuffer = Buffer.from(matches[2], 'base64');
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const randomBytes = crypto.randomBytes(8).toString('hex');
                const extension = matches[1].split('/')[1];
                newFilename = `profile_image_${uniqueSuffix}_${randomBytes}.${extension}`;
                const filePath = path.join(__dirname, '../../assets/images/profile_images', newFilename);
                fs.writeFileSync(filePath, imageBuffer);
            }

            // if password is empty or profile image is empty, do not update
            const update_data = {
                first_name,
                last_name,
                mobile_number,
                email,
                gender_id: parseInt(gender_id),
                role_id: 2,
                office_id: parseInt(office_id),
                country_id: parseInt(country_id),
                status: parseInt(status),
                created_at: new Date(),
                updated_at: new Date(),
            };
            if (password && password.trim() !== "") {
                update_data.password = hashedPassword;
            }
            if (newFilename) {
                update_data.profile_image = newFilename;
            }

            const user = await prisma.user.update({
                where: {
                    id: parseInt(id),
                },
                include: {
                    office: true,
                    gender: true,
                    country: true,
                },
                data: update_data,
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'User updated successfully',
                data: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    mobile_number: user.mobile_number,
                    email: user.email,
                    profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/admin/profile_images/${user.profile_image}` : null,
                    gender_id: user.gender_id,
                    office_id: user.office_id,
                    country_id: user.country_id,
                    status: user.status,
                    gender: user.gender,
                    office: user.office,
                    country: user.country,
                }
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
    async agentUserDelete(req, res) {
        const { id } = req.body;
        try {
            // check user found
            const found_user = await prisma.user.findFirst({
                where: {
                    id: parseInt(id),
                    role_id: 2,
                },
            });
            if (!found_user) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'User not found',
                });
            }
            // delete user
            await prisma.user.delete({
                where: {
                    id: parseInt(id),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'User deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    // Queue Service
    async queueServiceList(req, res) {
        const { limit, page, search, status } = req.body;
        try {
            const where_clause = {
                OR: [
                    {
                        name: {
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
                const queue_services = await prisma.queue_services.findMany({
                    where: where_clause,
                });
                return res.status(200).json({
                    code: 200,
                    status: true,
                    total: queue_services.length,
                    data: queue_services.map((item) => ({
                        id: item.id,
                        name: item.name,
                        color: item.color,
                        slug: item.slug,
                        route: item.route,
                        icon: item.icon,
                        status: item.status,
                        // fields: item.fields
                        fields: JSON.parse(item.fields)
                    }))
                });
            }
            const queue_services = await prisma.queue_services.findMany({
                where: where_clause,
                take: parseInt(limit) || 10,
                skip: parseInt((page || 1) - 1) * parseInt(limit || 10),
            });
            const totalRecords = await prisma.queue_services.count({
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
                data: queue_services.map((item) => ({
                    id: item.id,
                    name: item.name,
                    color: item.color,
                    slug: item.slug,
                    route: item.route,
                    icon: item.icon,
                    status: item.status,
                    // fields: item.fields
                    fields: JSON.parse(item.fields)
                }))
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
    async queueServiceCreate(req, res) {
        const { name, color, slug, route, icon, status, fields } = req.body;
        try {
            const queue_service = await prisma.queue_services.create({
                data: {
                    name,
                    color,
                    slug,
                    route,
                    icon,
                    status: parseInt(status || 0),
                    fields: JSON.stringify(fields),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Queue Service created successfully',
                data: {
                    id: queue_service.id,
                    name: queue_service.name,
                    color: queue_service.color,
                    slug: queue_service.slug,
                    route: queue_service.route,
                    icon: queue_service.icon,
                    status: queue_service.status,
                    fields: JSON.parse(queue_service.fields)
                }
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
    async queueServiceUpdate(req, res) {
        const { id, name, color, slug, route, icon, status, fields } = req.body;
        try {
            // check queue service found
            const found_queue_service = await prisma.queue_services.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_queue_service) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Queue Service not found',
                });
            }
            // update queue service
            const queue_service = await prisma.queue_services.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    name,
                    color,
                    slug,
                    route,
                    icon,
                    status: parseInt(status),
                    fields: JSON.stringify(fields),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Queue Service updated successfully',
                data: {
                    id: queue_service.id,
                    name: queue_service.name,
                    color: queue_service.color,
                    slug: queue_service.slug,
                    route: queue_service.route,
                    icon: queue_service.icon,
                    status: queue_service.status,
                    fields: JSON.parse(queue_service.fields)
                }
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
    async queueServiceDelete(req, res) {
        const { id } = req.body;
        try {
            // check queue service found
            const found_queue_service = await prisma.queue_services.findFirst({
                where: {
                    id: parseInt(id),
                },
            });
            if (!found_queue_service) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'Queue Service not found',
                });
            }
            // delete queue service
            await prisma.queue_services.delete({
                where: {
                    id: parseInt(id),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'Queue Service deleted successfully',
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
    // WT News
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
    // WT Video
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
                message: 'WT video created successfully',
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
        const { id, title, link, description, status } = req.body;
        try {
            // check wt_video found
            const found_wt_video = await prisma.wt_video.findFirst({
                where: {
                    id: parseInt(id),
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
                    id: parseInt(id),
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
                message: 'WT video updated successfully',
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
                    id: parseInt(id),
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
                    id: parseInt(id),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'WT video deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    // Country
    async countryList(req, res) {
        const { limit, page, search, status } = req.body;
        try {
            const where_clause = {
                OR: [
                    {
                        country_name: {
                            contains: search || '',
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
                message: 'Country created successfully',
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
        const { id, country_name, country_code, iso, status } = req.body;
        try {
            // check country found
            const found_country = await prisma.country.findFirst({
                where: {
                    id: parseInt(id),
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
                    id: parseInt(id),
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
                message: 'Country updated successfully',
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
                    id: parseInt(id),
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
                    id: parseInt(id),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                message: 'country deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
};