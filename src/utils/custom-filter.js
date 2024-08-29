const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const images_path = path.resolve(__dirname, '../../assets/images');
const profile_images_path = path.resolve(__dirname, '../../assets/images/profile_images');

// uploadBase64Image function
exports.uploadBase64Image = (image, imgPath) => {
    if (!image) {
        return null;
    }

    const directory_path = imgPath === 'profile' ? profile_images_path : images_path;
    const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

    if (matches && matches.length === 3) {
        const image_buffer = Buffer.from(matches[2], 'base64');
        const unique_suffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const random_bytes = crypto.randomBytes(8).toString('hex');
        const extension = matches[1].split('/')[1];
        const image_file_name = `image_${unique_suffix}_${random_bytes}.${extension}`;
        const file_path = path.join(directory_path, image_file_name);
        fs.writeFileSync(file_path, image_buffer);
        return image_file_name;
    }
    return null;
};
