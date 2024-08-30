// return res.status(200).json({ data:  });
// await body('first_name').notEmpty().withMessage('First name is required').isString().withMessage('First name must be a string').isLength({ min: 3, max: 255 }).withMessage('First name must be between 3 and 255 characters').run(req);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { uploadBase64Image } = require('../../utils/custom-filter');
const { body, validationResult } = require('express-validator');

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

            // Hash the password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);

            // Handle Base64 Image Upload
            const image_file_name = uploadBase64Image(req.body.profile_image, 'profile');

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
            if (image_file_name) {
                create_user.profile_image = image_file_name;
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
                message: 'User Created Successfully',
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
            
            // Hash the password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);
            // Handle Base64 Image Upload
            const image_file_name = uploadBase64Image(req.body.profile_image, 'profile');

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
            if (image_file_name) {
                update_data.profile_image = image_file_name;
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
                message: 'User Updated Successfully',
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
                message: 'User Deleted Successfully',
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