const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Before defining the storage, ensure directories exist or create them
const ensureDirectoriesExist = () => {
    const dirs = [
        path.resolve('./assets/images'),
        path.resolve('./assets/images/profile_images'),
        path.resolve('./assets/images/passport_images'),
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};
ensureDirectoriesExist();

// configure for profile and passport image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(req.params);
        switch (req.params.imagepath) {
            case 'image':
                cb(null, './assets/images');
                break;
            case 'profile':
                cb(null, './assets/images/profile_images');
                break;
            case 'passport':
                cb(null, './assets/images/passport_images');
                break;
            default:
                cb(
                    {
                        code: 400,
                        status: "error",
                        message: 'Invalid image path'

                    }, false);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const randomBytes = crypto.randomBytes(8).toString('hex');
        const newFilename = `${file.fieldname}_${uniqueSuffix}_${randomBytes}${path.extname(file.originalname)}`;

        return cb(null, newFilename);
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: {
        // fileSize: 1 * 1024 * 1024, // 1MB limit for image upload
        fileSize: 5 * 1024 * 1024 // 5MB limit for image upload
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        // set error for invalid file type
        cb({
            code: 400,
            status: "error",
            message: 'Only images are allowed'
        }, false);
    }
}

// Upload single image
exports.singleImageUpload = async (req, res, next) => {
    try {
        await upload.single('image')(req, res, function (error) {
            if (error) {
                return res.status(400).json({
                    code: 400,
                    status: "error",
                    message: error.message
                });
            }
            next();
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: error.message
        });
    }
}

// Upload multiple images
exports.multipleImageUpload = async (req, res, next) => {
    try {
        await upload.array('image', 10)(req, res, function (error) {
            if (error) {
                return res.status(400).json({
                    code: 400,
                    status: "error",
                    message: error.message
                });
            }
            next();
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: error.message
        });
    }
}
