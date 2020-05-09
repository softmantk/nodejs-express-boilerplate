// const mongoose = require('mongoose');
const User = require('../services/db/models/user');

exports.getUsers = async (req, res, next) => {
    try {
        console.log('user....');
        const users = await User.find();
        console.log('6:getUsers:users:', users);
        return res.json({
            users,
            message: 'connected',
        });
    } catch (e) {
        return next(e);
    }
};
exports.addUser = async (req, res, next) => {
    try {
        const { body } = req;
        const existingUser = User.find({ email: body.email });
        if (existingUser) {
            return res.status(422)
                .json({
                    message: 'User already exist',
                });
        }
        const user = await User.create(body);
        return res.json({
            user,
        });
    } catch (e) {
        return next(e);
    }
};
