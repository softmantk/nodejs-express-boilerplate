const Mongoose = require('mongoose');
const joi = require('@hapi/joi');
const joigoose = require('joigoose')(Mongoose);

const joiUserSchema = joi.object({

    name: joi.string(),
    verified: joi.boolean()
        .meta({
            _mongoose: { default: false },
        }),
    views: joi.number(),
    userId: joi.string()
        .meta({
            _mongoose: {
                type: 'ObjectId',
                ref: 'User',
            },
        }),
    metaInfo: joi.any(),
    tags: joi.array()
        .items(
            //     {
            //     line1: joi.string().required(),
            //     line2: joi.string()
            // }
            joi.string(),
        )
        .meta({
            _mongoose: {
                type: 'ObjectId',
                ref: 'User',
            },
        }),
});

const StreamSchema = new Mongoose.Schema(joigoose.convert(joiUserSchema));
module.exports = Mongoose.model('Stream', StreamSchema);
