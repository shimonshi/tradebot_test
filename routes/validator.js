const { body, param, validationResult } = require('express-validator');
// const User = require('../models').User;
const bcrypt = require('bcrypt');

const comparePasswords = (password1, password2) => {
    return bcrypt.compareSync(password1, password2)
}

const keyAddRules = () => {
    return [
        // sub_length must by an int and be greater than 1
        body('sub_length').isInt({ min: 1 })
    ]
}

const keyAssignRules = () => {
    return [
        // key must be in MD5 format and user must exist
        param('key').isMD5('Wrong key format'),
        body('user').exists()
    ]
}

const keyUpdateByIdRules = () => {
    return [
        param('id').toInt().bail(),
        body('user').optional().toInt(),
        body('sub_len').optional().isInt({ min: 1 })
    ]
}

const faqQuestionsAddRules = () => {
    return [
        body('question').exists(),
        body('answer').exists(),
        body('category').optional().toInt()
    ]
}

const faqQuestionsAssignRules = () => {
    return [
        param('id').isInt({ min: 1 }),
        body('faq_category').toInt()
    ]
}

const faqCategoriesAddRules = () => {
    return [
        body('name').exists()
    ]
}

const userAddRules = () => {
    return [
        body('name').exists(),
        body('password').exists(),
        body('confirm_password')
            .exists()
            .custom((value, { req, loc, path }) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords do not match");
                } else {
                    return value;
                }
            }),
        body('email').isEmail().normalizeEmail()
    ]
}

const planAddRules = () => {
    return [
        body('title').exists(),
        body('price').exists(),
        body('first_info').exists(),
        body('second_info').exists(),
        body('third_info').exists()
    ]
}

const planDelRules = () => {
    return [
        param('id').isInt({ min: 1 })
    ]
}

const getKeyByIdRules = () => {
    return [
        param('id').toInt().bail().custom(id => checkKeyExistsById(id))
    ]
}

const getUserByIdRules = () => {
    return [
        param('id').toInt().custom(id => checkUserExistsById(id))
    ]
}

const getPlanByIdRules = () => {
    return [
        param('id').toInt().custom(id => getPlanByIdRules(id))
    ]
}

const userUpdateRules = () => {
    return [
        body('new_password').optional({ checkFalsy: true }).isLength({ min: 6, max: 30 }).custom((value, { req }) => {
            if (value !== req.body.confirm_password) {
                throw new Error('Password confirmation is incorrect');
            } else {
                if (req.user.comparePassword(value)) {
                    throw new Error('New password should not match current password');
                } else {
                    return value;
                }
            }
        }),
        body('confirm_password').optional({ checkFalsy: true }).custom((value, { req }) => {
            if (value !== req.body.new_password) {
                throw new Error('Password confirmation is incorrect');
            } else {
                return value;
            }
        }),
        body('current_password').optional({ checkFalsy: true }).custom((value, { req }) => {
            if (req.body.new_password && req.body.confirm_password) {
                if (value) {
                    if (!req.user.comparePassword(value)) {
                        throw new Error("Current password does not match");
                    } else {
                        return value;
                    }
                } else {
                    throw new Error('Enter current password');
                }
            } else {
                return value;
            }
        })
    ]
}

const newError = (errors) => {
    return {
        result: "error",
        error: errors,
    };
}

const isAuthenticated = (req, res, next) => {
    if (req.user) {
        return next();
    }
    else {
        return res.status(403).json(newError("Authorization required"));
    }
}

const isAdmin = (req, res, next) => {
    if (req.user) {
        if (req.user.isAdmin) {
            return next();
        } else {
            return res.status(403).json(newError("Access denied"));
        }
    }
    else {
        return res.status(403).json(newError("Authorization required"));
    }
}

const getLoginRules = () => {
    return [
        body('name').exists(),
        body('password').exists()
    ]
}

const checkValidation = (req) => {
    const errors = validationResult(req);
    const extractedErrors = [];
    if (!errors.isEmpty()) {
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
    }
    return extractedErrors;
}

const validate = (req, res, next) => {
    const errors = checkValidation(req);
    if (errors.length === 0) {
        return next()
    }

    return res.status(422).json(newError(errors));
}

module.exports = {
    checkValidation,
    keyAddRules,
    keyAssignRules,
    keyUpdateByIdRules,
    getKeyByIdRules,
    faqQuestionsAddRules,
    faqQuestionsAssignRules,
    faqCategoriesAddRules,
    userAddRules,
    getUserByIdRules,
    planAddRules,
    planDelRules,
    getPlanByIdRules,
    isAuthenticated,
    isAdmin,
    getLoginRules,
    userUpdateRules,
    validate,
    newError
}