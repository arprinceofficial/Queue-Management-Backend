const { verify } = require('jsonwebtoken');
const { secretKeyOffice, secretKeyAgent, secretKeyAdmin } = require('../config/config');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    authOfficeMiddleware: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            verify(token, secretKeyOffice, async (err, auth_user) => {
                if (err || !auth_user || !auth_user.id) {
                    // console.log('auth_user', auth_user);
                    return res.status(403).json({
                        code: 403,
                        status: false,
                        message: 'Invalid token'
                    });
                }
                const user = await prisma.user.findUnique({
                    where: {
                        id: auth_user.id,
                        role_id: 1,
                    },
                    include: {
                        role: true,
                        office: true,
                        gender: true,
                        country: true,
                    },
                });
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
                // console.log('user', user.is_login);
                if (!user || user.is_login != 1) {
                    return res.status(403).json({
                        code: 403,
                        status: false,
                        message: 'Invalid token'
                    });
                }
                // Formating the data
                req.auth_user = {
                    access_token: token,
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
                    country_code: user.country.country_code,
                }
                next();
            });
        } else {
            return res.status(401).json({
                code: 401,
                status: false,
                message: 'Access denied! unauthorized user'
            });
        }

    },
    authAgentMiddleware: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            verify(token, secretKeyAgent, async (err, auth_user) => {
                if (err || !auth_user || !auth_user.id) {
                    // console.log('auth_user', auth_user);
                    return res.status(403).json({
                        code: 403,
                        status: false,
                        message: 'Invalid token'
                    });
                }
                const user = await prisma.user.findUnique({
                    where: {
                        id: auth_user.id,
                        role_id: 2,
                    },
                    include: {
                        role: true,
                        office: true,
                        gender: true,
                    },
                });
                // get user queue counter
                const queueCounter = await prisma.counter.findFirst({
                    where: {
                        user_id: user.id,
                    },
                });
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
                // console.log('user', user.is_login);
                if (!user || user.is_login != 1) {
                    return res.status(403).json({
                        code: 403,
                        status: false,
                        message: 'Invalid token'
                    });
                }
                // Formating the data
                req.auth_user = {
                    access_token: token,
                    user: {
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        mobile_number: user.mobile_number,
                        gender: user.gender.name,
                        profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/agent/profile_images/${user.profile_image}` : null,
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
                    queue_counter: queueCounter,
                }
                next();
            });
        } else {
            return res.status(401).json({
                code: 401,
                status: false,
                message: 'Access denied! unauthorized user'
            });
        }

    },
    authAdminMiddleware: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            verify(token, secretKeyAdmin, async (err, auth_user) => {
                if (err || !auth_user || !auth_user.id) {
                    return res.status(403).json({
                        code: 403,
                        status: false,
                        message: 'Invalid token'
                    });
                }
                const user = await prisma.user.findUnique({
                    where: {
                        id: auth_user.id,
                        role_id: 3,
                    },
                    include: {
                        role: true,
                        gender: true,
                    },
                });
                // console.log('user', user.is_login);
                if (!user || user.is_login != 1) {
                    return res.status(403).json({
                        code: 403,
                        status: false,
                        message: 'Invalid token'
                    });
                }
                // Formating the data
                req.auth_user = {
                    access_token: token,
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
                }
                next();
            });
        } else {
            return res.status(401).json({
                code: 401,
                status: false,
                message: 'Access denied! unauthorized user'
            });
        }

    },
}