// return res.status(200).json({ data:  });
// await body('first_name').notEmpty().withMessage('First name is required').isString().withMessage('First name must be a string').isLength({ min: 3, max: 255 }).withMessage('First name must be between 3 and 255 characters').run(req);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const image_path = '../../../assets/images/profile_images';

module.exports = {
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
                const filePath = path.join(__dirname, image_path, newFilename);
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
                const filePath = path.join(__dirname, image_path, newFilename);
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
}