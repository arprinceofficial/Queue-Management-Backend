const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { secretKeyAdmin } = require('../config/config');
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const transporter = require('./emailController');

module.exports = {
    async login(req, res) {
        const { loginInput, password } = req.body;
        try {
            let user;
            const queryRelations = {
                include: {
                    role: true,
                    gender: true,
                },
            };
            // check if login input is email loginInput
            if (loginInput.includes('@')) {
                user = await prisma.user.findFirst({
                    ...queryRelations,
                    where: {
                        OR: [
                            { email: loginInput, role_id: 3 },
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
                            { mobile_number: loginInput, role_id: 3 },
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
                            { id: parseInt(loginInput), role_id: 3 },
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
                    profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/admin/profile_images/${user.profile_image}` : null,
                    is_validated: user.is_validated,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
                role: {
                    id: user.role.id,
                    name: user.role.name,
                },
            };
            // Create payload for JWT token with user data
            const payload = {
                user: userData.user,
                role: userData.role,
                is_login: 1,
            };
            // Create token
            const token = sign(payload, secretKeyAdmin, { expiresIn: '24h' });
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
    async logout(req, res) {
        try {
            if (req.auth_user) {
                await prisma.user.update({
                    where: { id: req.auth_user.user.id },
                    data: { is_login: 0, },
                });
                res.status(200).json({
                    code: 200,
                    status: "success",
                    message: 'Logout successfully'
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
    async uploadUserImage(req, res) {
        const id = req.auth_user.user.id;
        const { imagepath } = req.params;
        try {
            const user = await prisma.user.findFirst({ where: { id: parseInt(id), role_id: 3 } });
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
    async otpRequestEmail(req, res) {
        const { email } = req.body;
        try {
            // Check if user email exists
            const user = await prisma.user.findFirst({
                where: {
                    email,
                    role_id: 3,
                },
            });
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
    async verifyOtp(req, res) {
        const { userid, otp } = req.body;
        try {
            // Check if user id exists
            const user = await prisma.user.findFirst({ where: { id: parseInt(userid), role_id: 3 } });
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
                    otp_verification_code: null,
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