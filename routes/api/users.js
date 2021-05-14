const router = require('express').Router();

const { userAddRules, getUserByIdRules, isAdmin, isAuthenticated, userUpdateRules, validate } = require('../validator.js');

let User = require('../../models').User;
let Key = require('../../models').Key;

router.route('/').get(isAdmin, (req, res, next) => {
    User.findAll(
        {
            include: [{ model: Key }]
        })
        .then(res.send.bind(res))
        .catch(err => next(err))
});

router.route('/add').post(isAdmin, userAddRules(), validate, (req, res, next) => {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const registration_date = Date();

    const newUser = new User({ name, password, email, registration_date });

    newUser.save()
        .then(() => res.json({ result: 'success' }))
        .catch(err => next(err));
});

router.route('/profile/update').post(isAuthenticated, userUpdateRules(), validate, (req, res, next) => {
    const newPassword = req.body.new_password;
    const newPasswordConfirm = req.body.confirm_password;
    const currentPassword = req.body.current_password;

    if (req.files && req.files.avatar) {
        let avatarFile = req.files.avatar;
        avatarFile.mv('./public/avatar/' + req.user.name + '.' + avatarFile.name.split('.').pop(), function (err) {
            if (err) {
                next(err);
            } else {
                if (newPassword && newPasswordConfirm && currentPassword) {
                    req.user.password = newPassword;
                    req.user.save()
                        .then(() => res.json({ result: 'success' }))
                        .catch(err => next(err));
                } else {
                    res.json({ result: 'success' });
                }
            }
        });
    } else {
        if (newPassword && newPasswordConfirm && currentPassword) {
            req.user.password = newPassword;
            req.user.save()
                .then(() => res.json({ result: 'success' }))
                .catch(err => next(err));
        } else {
            next(new Error("Empty request"));
        }
    }
});

router.route('/profile').get(isAuthenticated, (req, res, next) => {
    User.findByPk(req.user.id, { include: [{ model: Key }] })
        .then(user => { // проверить user на существование
            const dateNow = Math.trunc(Date.now() / 1000);

            res.json({
                result: 'success', user: {
                    name: user.name,
                    registration_date: user.registration_date,
                    keys: user.Keys.map(element =>
                        element = {
                            key: element.key,
                            timeLeft: Math.max(0, element.sub_start + element.sub_length - dateNow)
                        })
                }
            });
        })
        .catch(err => next(err));
});

router.route('/:id').get(getUserByIdRules(), validate, (req, res, next) => {
    if (req.user.id == req.params.id || req.user.isAdmin) {
        User.findByPk(req.params.id, { include: [{ model: Key }] })
            .then(user => { // проверить user на существование
                res.json({ result: 'success', user: user });
            })
            .catch(err => next(err));
    } else {
        next();
    }
});

// TODO:
// /:id/update

module.exports = router;