const router = require('express').Router();

const { faqQuestionsAddRules, faqQuestionsAssignRules, isAdmin, validate } = require('./validator.js');

let Faq_category = require('../models').Faq_category;
let Faq_question = require('../models').Faq_question;

router.route('/').get((req, res) => {
    Faq_question.findAll(
        {
            include: [{ model: Faq_category }]
        })
        .then(res.send.bind(res))
        .catch(err => next(err))
});

router.route('/add').post(isAdmin, faqQuestionsAddRules(), validate, (req, res) => {
    const question = req.body.question;
    const answer = req.body.answer;
    const categoryId = req.body.faq_category;
    const newFaq_question = Faq_question.build({ question, answer });

    if (typeof categoryId != 'undefined') {
        Faq_category.findByPk(categoryId)
            .then(category => {
                if (category) {
                    newFaq_question.FaqCategoryId = categoryId;
                }
                newFaq_question.save()
                    .then(() => res.json({ result: 'success' }))
                    .catch(err => next(err));
            })
            .catch(err => next(err));
    }
    else {
        newFaq_question.save()
            .then(() => res.json({ result: 'success' }))
            .catch(err => next(err));
    }
});

router.route('/:id/assign').post(isAdmin, faqQuestionsAssignRules(), validate, (req, res) => {
    const faq_question = req.params.id;
    const faq_category = req.body.faq_category;

    Faq_category.findByPk(faq_category)
        .then(newFaq_category => {
            Faq_question.findByPk(faq_question)
                .then(newFaq_question => {
                    if (newFaq_category && newFaq_question) {
                        newFaq_question.setFaq_category(newFaq_category);
                        newFaq_question.save()
                            .then(() => res.json({ result: 'success' }))
                            .catch(err => next(err));
                    }
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
});

// TODO:
// /:id/delete
// /:id
// /:id/update

module.exports = router;