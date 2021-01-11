const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
    {
        _id: 'u1',
        name: 'Leo',
        email: 'leo@test.com',
        password: 'password'
    }
];

const getUsers = async (req, res, next) => {
    let users;

    try {
        users = await User.find({}, '-password');
    } catch (err) {
        return next(new HttpError('Fetching users failed, please try again later.', 500));
    }
    res.json({ users: users.map(u => u.toObject({ getters: true })) });
}

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed.', 422));
    }

    const { name, email, password, places } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return next(new HttpError('Signing up failed, please try again later.', 500));
    }

    if (existingUser) {
        return next(new HttpError('User exists already, please login instead.', 422))
    }
    const createdUser = new User({
        name,
        email,
        image: 'hereshouldbeimagelink',
        password,
        places
    });

    try {
        await createdUser.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Signing up failed, please try again.', 500));
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return next(new HttpError('Logging in failed, please try again later.', 500));
    }

    if (!existingUser || existingUser.password !== password) {
        return next(new HttpError('Could not log you in.', 401));
    }

    res.json({ message: 'Logged in' });
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;