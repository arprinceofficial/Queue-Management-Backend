const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { secretKeyOffice } = require('../config/config');
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const admin = require('../firebase/firebase-admin');
const transporter = require('./emailController');

module.exports = {
    async login(req, res) {
        const { loginInput, password } = req.body;
        try {
            let user;
            const queryRelations = {
                include: {
                    role: true,
                    office: true,
                    gender: true,
                    country: true,
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
                            { id: parseInt(loginInput), role_id: 1 },
                        ],
                    },
                });
            }
            // Check if user not exists
            if (!user) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'User not found'
                });
            }
            // Check if password is Incorrect
            const isPasswordCorrect = compareSync(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    code: 401,
                    status: false,
                    message: 'Incorrect password'
                });
            }
            // check user status
            if (user.status !== 1) {
                return res.status(401).json({
                    code: 401,
                    status: false,
                    message: 'User is inactive'
                });
            }
            // check office status
            if (user.office.status !== 1) {
                return res.status(401).json({
                    code: 401,
                    status: false,
                    message: 'Office is inactive'
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
                    profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/office/profile_images/${user.profile_image}` : null,
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
                country: {
                    id: user.country.id,
                    country_name: user.country.country_name,
                    country_code: user.country.country_code,
                    iso: user.country.iso,
                },
            };
            // Create payload for JWT token with user data
            const payload = {
                id: userData.user.id,
            };
            console.log('payload', payload);
            // Create token
            const token = sign(payload, secretKeyOffice, { expiresIn: '24h' });
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
                    country: userData.country,
                    country_code: userData.country.country_code,
                },
            });

        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
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
                    status: false,
                    message: 'Access denied! unauthorized user'
                });
            }
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
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
                    status: false,
                    message: 'User not found'
                });
            }
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }

    },
    async uploadUserImage(req, res) {
        const id = req.auth_user.user.id;
        const { imagepath } = req.params;
        try {
            const user = await prisma.user.findFirst({ where: { id: parseInt(id), role_id: 1 } });
            if (!user) {
                return res.status(404).json({
                    code: 404,
                    status: false,
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
                    status: false,
                    message: `${imagepath} image is required`
                });
            }
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
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
                    role_id: 1,
                },
            });
            if (!user) {
                return res.status(404).json({
                    code: 404,
                    status: false,
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
                        status: false,
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
                status: false,
                message: error.message
            });
        }
    },
    async verifyOtp(req, res) {
        const { userid, otp } = req.body;
        try {
            // Check if user id exists
            const user = await prisma.user.findFirst({ where: { id: parseInt(userid), role_id: 1 } });
            if (!user) {
                return res.status(404).json({
                    code: 404,
                    status: false,
                    message: 'User not found'
                });
            }
            // Check if otp is correct
            if (user.otp_verification_code !== Number(otp)) {
                return res.status(400).json({
                    code: 400,
                    status: false,
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
                status: false,
                message: error.message
            });
        }
    },
    // SSO LOGIN
    async googleLogin(req, res) {
        const { idToken } = req.body;
        try {
            // Verify the Firebase ID token
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const email = decodedToken.email;
            // console.log('decodedToken', decodedToken);

            // Check if user exists in your database
            let user = await prisma.user.findFirst({
                where: { email, role_id: 1 },
            });

            // Set Hash password
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(decodedToken.uid, salt);

            // If the user doesn't exist, create a new user
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        first_name: decodedToken.name || '',
                        last_name: '',
                        email: email,
                        password: hashedPassword,
                        profile_image: decodedToken.picture || '',
                        gender_id: parseInt(1),
                        role_id: parseInt(1),
                        office_id: parseInt(1),
                        country_id: parseInt(18),
                        status: parseInt(1),
                        is_validated: 1,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
            }

            // Create a JWT for the user
            const token = sign({ id: user.id }, secretKeyOffice, { expiresIn: '24h' });

            // Update is_login to 1
            const get_user = await prisma.user.update({
                where: { id: user.id },
                include: {
                    role: true,
                    office: true,
                    gender: true,
                    country: true,
                },
                data: { is_login: 1 },
            });

            res.status(200).json({
                code: 200,
                status: 'success',
                data: {
                    access_token: token,
                    user: {
                        id: get_user.id,
                        first_name: get_user.first_name,
                        last_name: get_user.last_name,
                        email: get_user.email,
                        mobile_number: get_user.mobile_number,
                        profile_image: get_user.profile_image,
                        is_validated: user.is_validated,
                        created_at: user.created_at,
                        updated_at: user.updated_at,
                    },
                    role: {
                        id: get_user.role.id,
                        name: get_user.role.name,
                    },
                    office: {
                        id: get_user.office.id,
                        office_name: get_user.office.office_name,
                    },
                    country: {
                        id: get_user.country.id,
                        country_name: get_user.country.country_name,
                        country_code: get_user.country.country_code,
                        iso: get_user.country.iso,
                    },
                    country_code: get_user.country.country_code,
                },
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message,
            });
        }
    }
};