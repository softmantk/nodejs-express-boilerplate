const multer = require('multer');
const Joi = require('@hapi/joi');

module.exports = (e, req, res, next) => {
    console.log('E: ', e.toString());
    // if (e instanceof Sequelize.ValidationError) {
    //     return res.status(422)
    //         .json({
    //             success: false,
    //             message: 'validation error',
    //             errors: e.errors,
    //             body: req.body,
    //         });
    // }
    console.log('15:exports:e.isJoi:', e.isJoi);
    console.log('16:exports:e.statusCode:', e);

    if (e.name === 'ValidationError') {
        return res.status(422)
            .json(e.errors);
    }
    if (e instanceof multer.MulterError) {
        if (e.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.json({
                success: false,
                errors: [{}],
            });
        }
        throw e;
    }
    return next(e);
};
