const { verify } = require('jsonwebtoken');
const { secretKey } = require('../config/config');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    authMiddleware: (req, res, next) => {

        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            verify(token, secretKey, async(err, user) => {
                if (err || !user || !user.user || !user.user.id) {
                    return res.status(403).json({
                        code: 403,
                        status: "error",
                        message: 'Invalid token'
                    });
                }
                const currentLoginStatus = await prisma.user.findUnique({
                    where: {
                        id: user.user.id
                    },
                    select: {
                        is_login: true
                    }
                });
                // console.log('currentLoginStatus', currentLoginStatus.is_login, 'user.is_login', user.is_login);
                if (!currentLoginStatus || currentLoginStatus.is_login !== user.is_login) {
                    return res.status(403).json({
                        code: 403,
                        status: "error",
                        message: 'Invalid token'
                    });
                }
                req.auth_user = user;
                // Formating the data
                req.auth_user = {
                    access_token: token,
                    user: req.auth_user.user,
                    iat: req.auth_user.iat,
                    exp: req.auth_user.exp,
                }
                next();
            });
        } else {
            return res.status(401).json({
                code: 401,
                status: "error",
                message: 'Access denied! unauthorized user'
            });
        }

    }
}