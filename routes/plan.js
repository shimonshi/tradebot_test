const router = require('express').Router();
const Plan = require('../models').Plan;

const { planAddRules, planDelRules, getPlanByIdRules, isAdmin, validate } = require('./validator.js');

router.route('/').get((req, res) => {
    Plan.findAll()
        .then(res.send.bind(res))
        .catch(err => next(err))
});

router.route('/:id').get(getPlanByIdRules(), validate, (req, res, next) => {
    // Plan.findByPk(req.params.id)
    //     .then(plan => { // проверить plan на существование в валидаторе
    //         res.json({ result: 'success', plan: plan })
    //     })
    //     .catch(err => next(err))
    // Plan.findByPk(req.params.id)
        // .then(plan => { // проверить plan на существование в валидаторе
            res.json({ result: 'success', plan: plan });
        // })
        // .catch(err => next(err))
});

// Admin-only requests

router.route('/add').post(isAdmin, planAddRules(), validate, (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const first_info = req.body.first_info;
    const second_info = req.body.second_info;
    const third_info = req.body.third_info;

    const newPlan = new Plan({ title, price, first_info, second_info, third_info });

    newPlan.save()
        .then(plan => res.json({ result: 'success' }))
        .catch(err => next(err));
});

router.route('/:id/delete').post(isAdmin, planDelRules(), validate, (req, res, next) => {
    Plan.findByPk(req.params.id)
        .then(plan => { // проверить plan на существование в валидаторе
            plan.destroy()
                .then(res.json({ result: 'success' }))
                .catch(err => next(err))
        })
        .catch(err => next(err))
});

module.exports = router;