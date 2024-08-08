const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { secretKey } = require('../config/config');
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const transporter = require('./emailController');

module.exports = {
    // Create a new user
    async createUser(req, res) {
        const {
            first_name,
            last_name,
            gender,
            email,
            password,
            mobile_number,
            role_id,
        } = req.body;

        try {
            // Check if user email exists
            const userExists = await prisma.user.findFirst({ where: { email, role_id: 1 } });
            if (userExists) {
                return res.status(400).json({
                    code: 400,
                    status: "error",
                    message: 'This email already exists'
                });
            }
            // Check if user phone number exists
            const phoneNumberExists = await prisma.user.findFirst({ where: { mobile_number, role_id: 1 } });
            if (phoneNumberExists) {
                return res.status(400).json({
                    code: 400,
                    status: "error",
                    message: 'This phone number already exists'
                });
            }
            // Check mobile number length
            if (mobile_number.length !== 11) {
                return res.status(400).json({
                    code: 400,
                    status: "error",
                    message: 'Mobile number must be 11 digits'
                });
            }

            // Hash the password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);

            // Create the user
            const newUser = await prisma.user.create({
                data: {
                    first_name,
                    last_name,
                    gender,
                    email,
                    mobile_number,
                    is_validated: 0,
                    password: hashedPassword,
                    created_at: new Date(),
                    updated_at: new Date(),
                    role: {
                        connect: {
                            id: parseInt(role_id),
                        },
                    },
                },
            });
            res.status(201).json({
                code: 201,
                status: "success",
                data: {
                    // access_token: token,
                    user: {
                        id: newUser.id,
                        first_name: newUser.first_name,
                        last_name: newUser.last_name,
                        gender: newUser.gender,
                        email: newUser.email,
                        mobile_number: newUser.mobile_number,
                        role_id: newUser.role_id,
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    // Profile image upload
    async uploadUserImage(req, res) {
        const { id } = req.params;
        const { imagepath } = req.params;
        try {
            const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
            if (!user) {
                return res.status(404).json({
                    code: 404,
                    status: "error",
                    message: 'User not found'
                });
            }
            if (req.file) {
                const updatedUser = await prisma.user.update({
                    where: { id: parseInt(id) },
                    data: {
                        [imagepath + '_image']: req.file.filename,
                        updated_at: new Date(),
                    },
                });
                res.status(200).json({
                    code: 200,
                    status: "success",
                    message: `${imagepath} image uploaded successfully`,
                    data: {
                        id: updatedUser.id,
                        first_name: updatedUser.first_name,
                        last_name: updatedUser.last_name,
                    }
                });
            } else {
                res.status(400).json({
                    code: 400,
                    status: "error",
                    message: `${imagepath} image is required`
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
    // login 
    async login(req, res) {
        const { loginInput, password } = req.body;
        try {
            let user;
            const queryRelations = {
                include: {
                    role: true,
                    office: true,
                    gender: true,
                },
            };
            // check if login input is loginInput
            if (loginInput.includes('@')) {
                user = await prisma.user.findFirst({
                    ...queryRelations,
                    where: {
                        OR: [
                            { email: loginInput, role_id: 1 },
                        ],
                    },
                });
            }
            // check by reguler expression for mobile number where length is 11 and start with 01
            else if (loginInput.match(/^01\d{9}$/)) {
                user = await prisma.user.findFirst({
                    ...queryRelations,
                    where: {
                        OR: [
                            { mobile_number: loginInput, role_id: 1 },
                        ],
                    },
                });
            }
            // check if login input is id
            else {
                user = await prisma.user.findFirst({
                    ...queryRelations,
                    where: {
                        OR: [
                            { id: parseInt(loginInput) },
                        ],
                    },
                });
            }
            // Check if user not exists
            if (!user) {
                return res.status(404).json({
                    code: 404,
                    status: "error",
                    message: 'User not found'
                });
            }
            // Check if password is Incorrect
            const isPasswordCorrect = compareSync(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    code: 401,
                    status: "error",
                    message: 'Incorrect password'
                });
            }
            // Prepare user data for the payload and response, including role as a nested object
            const userData = {
                user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    mobile_number: user.mobile_number,
                    gender: user.gender.name,
                    profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/profile_images/${user.profile_image}` : null,
                    passport_image: user.passport_image ? `${req.protocol + '://' + req.get('host')}/passport_images/${user.passport_image}` : null,
                    is_validated: user.is_validated,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
                role: {
                    id: user.role.id,
                    name: user.role.name,
                },
                office: {
                    id: user.office.id,
                    office_name: user.office.office_name,
                },
            };
            // Create payload for JWT token with user data
            const payload = {
                user: userData.user,
                role: userData.role,
                office: userData.office,
                is_login: 1,
            };
            // Create token
            const token = sign(payload, secretKey, { expiresIn: '24h' });
            // Update is_login to 1
            await prisma.user.update({
                where: { id: user.id },
                data: { is_login: 1 },
            });
            await res.status(200).json({
                code: 200,
                status: "success",
                data: {
                    access_token: token,
                    user: userData.user,
                    role: userData.role,
                    office: userData.office,
                }
            });

        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    // logout
    async logout(req, res) {
        const id = req.auth_user.user.id;
        try {
            const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
            if (user) {
                await prisma.user.update({
                    where: { id: parseInt(id) },
                    data: { is_login: 0 },
                });
                res.status(200).json({
                    code: 200,
                    status: "success",
                    message: 'User logged out successfully'
                });
            } else {
                res.status(404).json({
                    code: 404,
                    status: "error",
                    message: 'User not found'
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
    // Current Login user
    async currentUser(req, res) {
        try {
            if (req.auth_user) {
                res.status(200).json({
                    code: 200,
                    status: "success",
                    data: req.auth_user
                });
            } else {
                res.status(401).json({
                    code: 401,
                    status: "error",
                    message: 'Access denied! unauthorized user'
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
    // Get all users
    async getAllUsers(req, res) {
        try {
            const users = await prisma.user.findMany();
            res.status(200).json({
                data: {
                    code: 200,
                    status: "success",
                    data: users.map((user) => ({
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        mobile_number: user.mobile_number,
                        gender: user.gender,
                        profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/profile_images/${user.profile_image}` : null,
                        passport_image: user.passport_image ? `${req.protocol + '://' + req.get('host')}/passport_images/${user.passport_image}` : null,
                        is_validated: user.is_validated,
                        email: user.email,
                        created_at: user.created_at,
                        updated_at: user.updated_at,
                    })),
                }
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    // Get a single user by ID
    async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
            if (user) {
                res.status(200).json({
                    data: {
                        code: 200,
                        status: "success",
                        data: {
                            id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            mobile_number: user.mobile_number,
                            gender: user.gender,
                            profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/profile_images/${user.profile_image}` : null,
                            passport_image: user.passport_image ? `${req.protocol + '://' + req.get('host')}/passport_images/${user.passport_image}` : null,
                            is_validated: user.is_validated,
                            email: user.email,
                            created_at: user.created_at,
                            updated_at: user.updated_at,
                        }
                    }
                });
            } else {
                res.status(404).json({
                    code: 404,
                    status: "error",
                    message: 'User not found'
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
    // Update a user
    async updateUser(req, res) {
        const { id } = req.params;
        const { first_name, last_name, gender, email, password, mobile_number } = req.body;
        try {
            // If user not exists
            const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });

            if (!user) {
                return res.status(404).json({
                    code: 404,
                    status: "error",
                    message: 'User not found'
                });
            }

            //  Check if user email exists
            // const userExists = await prisma.user.findUnique({ where: { email } });
            // if (userExists) {
            //     return res.status(400).json({ error: 'This email already exists' });
            // }

            // Hash the password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);

            // Update the user
            const updatedUser = await prisma.user.update({
                where: { id: parseInt(id) },
                data: {
                    first_name,
                    last_name,
                    gender,
                    email,
                    password: hashedPassword,
                    mobile_number,
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                data: {
                    code: 200,
                    status: "success",
                    message: 'User updated successfully',
                    data: {
                        id: updatedUser.id,
                        first_name: updatedUser.first_name,
                        last_name: updatedUser.last_name,
                        gender: updatedUser.gender,
                        email: updatedUser.email,
                        mobile_number: updatedUser.mobile_number,
                        created_at: updatedUser.created_at,
                        updated_at: updatedUser.updated_at,
                    }
                }
            });

        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    // Delete a user
    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            // If user not exists
            const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
            if (!user) {
                return res.status(404).json({
                    code: 404,
                    status: "error",
                    message: 'User not found'
                });
            }

            // Delete the user
            await prisma.user.delete({ where: { id: parseInt(id) } });
            res.status(200).json({
                code: 200,
                status: "success",
                message: 'User deleted successfully'
            });

        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    // Otp request sent to email
    async otpRequestEmail(req, res) {
        const { email } = req.body;
        try {
            // Check if user email exists
            const user = await prisma.user.findFirst({ where: { email } });
            if (!user) {
                return res.status(404).json({
                    code: 404,
                    status: "error",
                    message: 'User not found'
                });
            }
            // Generate otp
            const otp = Math.floor(100000 + Math.random() * 900000);
            // Send otp to database user.otp_verification_code
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    otp_verification_code: otp,
                },
            });
            // Send otp to email
            const mailOptions = {
                from: process.env.MAIL_FROM_ADDRESS,
                to: email,
                subject: 'OTP Verification',
                html: `<h3>Your OTP is: ${otp}</h3>`
            };
            // Send otp to email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({
                        code: 500,
                        status: "error",
                        message: error.message
                    });
                } else {
                    res.status(200).json({
                        code: 200,
                        userid: user.id,
                        status: "success",
                        message: `OTP sent successfully to ${email}`
                    });
                }
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
    // Verify otp
    async verifyOtp(req, res) {
        const { userid, otp } = req.body;
        try {
            // Check if user id exists
            const user = await prisma.user.findFirst({ where: { id: parseInt(userid) } });
            if (!user) {
                return res.status(404).json({
                    code: 404,
                    status: "error",
                    message: 'User not found'
                });
            }
            // Check if otp is correct
            if (user.otp_verification_code !== Number(otp)) {
                return res.status(400).json({
                    code: 400,
                    status: "error",
                    message: 'Invalid OTP'
                });
            }
            // Update is_validated to Y and otp_verification_code to null
            await prisma.user.update({
                where: { id: parseInt(userid) },
                data: {
                    is_validated: 1,
                    // otp_verification_code: null,
                },
            });
            res.status(200).json({
                code: 200,
                status: "success",
                message: 'OTP verified successfully'
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    },
};