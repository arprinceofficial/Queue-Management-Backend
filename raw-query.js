const user = await prisma.$queryRaw`
                SELECT
                    -- user.*, 
                    user.id AS id,
                    user.first_name AS first_name,
                    user.last_name AS last_name,
                    user.mobile_number AS mobile_number,
                    user.email AS email,
                    user.profile_image AS profile_image,
                    office.id AS office_id,
                    office_name AS office_name,
                    gender.id as gender_id,
                    gender.name AS gender_name, 
                    country.id AS country_id,
                    country_name AS country_name 
                FROM 
                    user 
                LEFT JOIN office ON user.office_id = office.id 
                LEFT JOIN gender ON user.gender_id = gender.id 
                LEFT JOIN country ON user.country_id = country.id 
                WHERE 
                    user.role_id = 1
            `;
            return res.status(200).json(
                {
                    code: 200,
                    status: true,
                    data: user.map((user) => ({
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        mobile_number: user.mobile_number,
                        email: user.email,
                        profile_image: user.profile_image ? `${req.protocol + '://' + req.get('host')}/admin/profile_images/${user.profile_image}` : null,
                        gender_id: user.gender_id,
                        office_id: user.office_id,
                        country_id: user.country_id,
                        gender: {
                            id: user.gender_id,
                            name: user.gender_name
                        },
                        office: {
                            id: user.office_id,
                            name: user.office_name
                        },
                        country: {
                            id: user.country_id,
                            name: user.country_name
                        },
                    }))
                }
            );