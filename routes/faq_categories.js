const router = require('express').Router();

const { faqCategoriesAddRules, isAdmin, validate } = require('./validator.js');

let Faq_category = require('../models').Faq_category;
let Faq_question = require('../models').Faq_question;

router.route('/').get((req, res) => {
    Faq_category.findAll(
        {
            include: [{ model: Faq_question }]
        })
        .then(res.send.bind(res))
        .catch(err => next(err))
});

router.route('/add').post(isAdmin, faqCategoriesAddRules(), validate, (req, res) => {
    const name = req.body.name;
    const newFaq_category = new Faq_category({ name });

    newFaq_category.save()
        .then(() => res.json({ result: 'success' }))
        .catch(err => next(err));
});

// TODO:
// /:id/delete
// /:id
// /:id/update

module.exports = router;