const Mongoose = require('mongoose');
const joi = require('@hapi/joi');
const joigoose = require('joigoose')(Mongoose);

const joiUserSchema = joi.object({

    name: joi.object({
        first: joi.string()
            .required(),
        last: joi.string()
            .required(),
    }),

    email: joi.string()
        .email()
        .required(),
    verified: joi.boolean()
        .meta({
            _mongoose: { default: false },
        }),
    // bestFriend: joi.string().meta({
    //     _mongoose: {type: "ObjectId", ref: "User"}
    // }),

    // metaInfo: joi.any(),
    // addresses: joi.array()
    //     .items({
    //         line1: joi.string().required(),
    //         line2: joi.string()
    //     })
    //     .meta({_mongoose: {_id: false, timestamps: true}})
});

const mongooseUserSchema = new Mongoose.Schema(joigoose.convert(joiUserSchema));
module.exports = Mongoose.model('User', mongooseUserSchema);
