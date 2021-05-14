const router = require('express').Router();

const { keyAddRules, keyUpdateByIdRules, getKeyByIdRules, isAdmin, validate } = require('../validator.js');

let Key = require('../../models').Key;
let User = require('../../models').User;

router.route('/').get(isAdmin, (req, res, next) => {
    Key.findAll(
        {
            include: [{ model: User }]
        })
        .then(keys => res.json({ result: 'success', keys: keys }))
        .catch(err => next(err));
});

router.route('/add').post(isAdmin, keyAddRules(), validate, (req, res, next) => {
    const sub_length = req.body.sub_length;
    var key = new Key();

    key.generate(sub_length);

    key.save()
        .then(key => res.json({ result: 'success', key: key.key }))
        .catch(err => next(err));
});

router.route('/:id').get(isAdmin, getKeyByIdRules(), validate, (req, res, next) => {
    Key.findByPk(req.params.id, { include: [{ model: User }] })
        .then(key => {
            res.json({ result: 'success', key: key })
        })
        .catch(err => next(err));
});

router.route('/:id/delete').post(isAdmin, getKeyByIdRules(), validate, (req, res, next) => {
    const keyId = req.params.id;

    Key.findByPk(keyId)
        .then(key => {
            key.destroy()
                .then(res.json({ result: 'success' }))
                .catch(err => next(err))
        })
        .catch(err => next(err))
});

router.route('/:id/update').post(isAdmin, keyUpdateByIdRules(), validate, (req, res, next) => {
    const keyId = req.params.id;
    const userId = req.body.user;
    const sub_length = req.body.sub_length;

    let user;
    if (typeof userId != 'undefined') {
        User.findByPk(userId).then(user_found => {
            user = user_found
        });
    }

    Key.findByPk(keyId)
        .then(newKey => {
            let isUpdated = false;
            if (user) {
                newKey.setUser(user);
                isUpdated = true;
            }
            if (typeof sub_length != 'undefined') {
                newKey.sub_length = sub_length;
                isUpdated = true;
            }
            if (isUpdated) {
                newKey.save()
                    .then(() => res.json({ result: 'success' }))
                    .catch(err => next(err));
            }
            else {
                res.json({ result: 'error', error: 'Not updated' })
            }

        })
        .catch(err => next(err))
});

module.exports = router;