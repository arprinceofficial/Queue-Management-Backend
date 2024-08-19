const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
// return res.status(200).json({ data:  });
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

module.exports = {
    // Counter
    async counterList(req, res) {
        try {
            const counter = await prisma.counter.findMany({
                where: {
                    office: {
                        status: 1, // Filter counter list where office status is 1
                    },
                },
                include: {
                    office: true,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
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
                    status: parseInt(status),
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
                return res.status(400).json({
                    code: 400,
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
    async officeListAll(req, res) {
        try {
            const office = await prisma.office.findMany();
            res.status(200).json({
                code: 200,
                status: true,
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
    async officeList(req, res) {
        try {
            const office = await prisma.office.findMany({
                where: {
                    status: 1,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
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
                    status: parseInt(status),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
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
                return res.status(400).json({
                    code: 400,
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
                    status: parseInt(status),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
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
                    status: parseInt(status),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
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
                message: 'gender deleted successfully',
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
        try {
            const office_user = await prisma.user.findMany({
                where: {
                    role_id: 1,
                },
                include: {
                    office: true,
                    gender: true,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
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
        catch (error) {
            res.status(500).json({
                code: 500,
                status: false,
                message: error.message
            });
        }
    },
    async officeUserCreate(req, res) {
        const { first_name, last_name, mobile_number, email, password, gender_id, office_id, status } = req.body;
        try {
            // Check if user email exists
            const userExists = await prisma.user.findFirst({ where: { email } });
            if (userExists) {
                return res.status(400).json({
                    code: 400,
                    status: "error",
                    message: 'This email already exists'
                });
            }
            // Check if user phone number exists
            const phoneNumberExists = await prisma.user.findFirst({ where: { mobile_number } });
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
                status: parseInt(status),
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
                },
                data: create_user,
            });
            res.status(200).json({
                code: 200,
                status: true,
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
    async officeUserUpdate(req, res) {
        const { id, first_name, last_name, mobile_number, email, password, gender_id, office_id, status } = req.body;
        try {
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
                return res.status(400).json({
                    code: 400,
                    status: "error",
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
                },
                data: update_data,
            });
            res.status(200).json({
                code: 200,
                status: true,
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
                    role_id: 1,
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
        try {
            const office_user = await prisma.user.findMany({
                where: {
                    role_id: 2,
                },
                include: {
                    office: true,
                    gender: true,
                },
            });
            res.status(200).json({
                code: 200,
                status: true,
                data: office_user.map((user) => ({
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    mobile_number: user.mobile_number,
                    email: user.email,
                    gender_id: user.gender_id,
                    gender_name: user.gender.name,
                    office_id: user.office_id,
                    status: user.status
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
        const { first_name, last_name, mobile_number, email, password, gender_id, office_id, status } = req.body;
        try {
            // Check if user email exists
            const userExists = await prisma.user.findFirst({ where: { email } });
            if (userExists) {
                return res.status(400).json({
                    code: 400,
                    status: "error",
                    message: 'This email already exists'
                });
            }
            // Check if user phone number exists
            const phoneNumberExists = await prisma.user.findFirst({ where: { mobile_number } });
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

            const user = await prisma.user.create({
                data: {
                    first_name,
                    last_name,
                    mobile_number,
                    email,
                    password: hashedPassword,
                    gender_id: parseInt(gender_id),
                    role_id: 2,
                    office_id: parseInt(office_id),
                    status: parseInt(status),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            const gender = await prisma.gender.findFirst({
                where: {
                    id: parseInt(gender_id),
                },
            })
            res.status(200).json({
                code: 200,
                status: true,
                data: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    mobile_number: user.mobile_number,
                    email: user.email,
                    gender_id: user.gender_id,
                    gender_name: gender.name,
                    office_id: user.office_id,
                    status: user.status
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
        const { id, first_name, last_name, mobile_number, email, password, gender_id, office_id, status } = req.body;
        try {
            // Check if user email exists
            const userExists = await prisma.user.findFirst({
                where: {
                    email,
                    id: {
                        not: parseInt(id)
                    }
                }
            });
            if (userExists) {
                return res.status(400).json({
                    code: 400,
                    status: "error",
                    message: 'This email already exists'
                });
            }
            // Check if user phone number exists
            const phoneNumberExists = await prisma.user.findFirst({
                where: {
                    mobile_number,
                    id: {
                        not: parseInt(id)
                    }
                }
            });
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

            const user = await prisma.user.update({
                where: {
                    id: parseInt(id),
                    role_id: 2,
                },
                data: {
                    first_name,
                    last_name,
                    mobile_number,
                    email,
                    password: hashedPassword,
                    gender_id: parseInt(gender_id),
                    role_id: 2,
                    office_id: parseInt(office_id),
                    status: parseInt(status),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            // get gender
            const gender = await prisma.gender.findFirst({
                where: {
                    id: parseInt(gender_id),
                },
            })
            res.status(200).json({
                code: 200,
                status: true,
                data: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    mobile_number: user.mobile_number,
                    email: user.email,
                    gender_id: user.gender_id,
                    gender_name: gender.name,
                    office_id: user.office_id,
                    status: user.status
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
                    role_id: 2,
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
};