const multer = require('multer');
// eslint-disable-next-line import/no-unresolved
const uuid = require('uuid').v4;
const path = require('path');

const storage = multer.diskStorage({
    destination: './stream_files/uploads/',
    filename(req, file, cb) {
        cb(null, uuid() + path.extname(file.originalname));
    },
});

module.exports.uploadHandler = ({
    filename = 'file',
    type = 'single',
    length = '2',
    fields = [],
    ext = ['.jpg', '.png'],
    fileSize = 5120 * 5120,
}) => {
    const middleware = multer({
        storage,
        fileFilter(req, file, callback) {
            const currentExt = path.extname(file.originalname);

            if (!ext.includes(currentExt)) {
                console.log('currentExt', currentExt);
                const err = new Error(`Forbidden extension ${currentExt}. 
                Supports only ${ext.join(',')}`);
                return callback(err);
            }
            return callback(null, true);
        },
        limits: {
            fileSize,
        },
    });
    if (type === 'single') {
        return middleware.single(filename);
    }
    if (type === 'array') {
        return middleware.array(filename, parseInt(length, 10));
    }
    if (type === 'multiple') {
        return middleware.fields(fields);
    }

    return true;
};
