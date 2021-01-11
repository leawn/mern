const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const validate = (r, n) => {
    const errors = validationResult(r);
    if (errors.isEmpty()) {
        return n(new HttpError('Invalid inputs passed.', 422));
    }
}

exports.validate = validate;