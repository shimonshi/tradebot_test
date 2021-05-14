const router = require('express').Router();
const Feature = require('../models').Feature;
const Faq_question = require('../models').Faq_question;
const Faq_category = require('../models').Faq_category;
const Plan = require('../models').Plan;

function toTree(flat) {
    let flatArr = flat.map(flatItem => ({ id: flatItem.id, content: flatItem.content, groupId: flatItem.groupId, title: flatItem.title }));
    const root = [];
    const map = {};

    flatArr.forEach(node => {
        // No parentId means top level
        if (!node.groupId) {
            return root.push(node);
        }

        // Insert node as child of parent in flat array
        let parentIndex = map[node.groupId];
        if (typeof parentIndex !== "number") {
            parentIndex = flatArr.findIndex(el => el.id === node.groupId);
            map[node.groupId] = parentIndex;
        }

        if (!flatArr[parentIndex].children) {
            return flatArr[parentIndex].children = [node];
        }

        flatArr[parentIndex].children.push(node);
    });

    return root;
}

router.route('/').get((req, res, next) => {
    let mainData = {};
    Promise.all(
        [
            Feature.findAll({}),
            Faq_category.findAll(
                {
                    include: [{ model: Faq_question }]
                }),
            Plan.findAll({})
        ])
        .then(resData => res.json({ result: 'success', featuresList: toTree(resData[0]), faqCategories: resData[1], pricePlans: resData[2] }))
        // .then(featuresList => mainData.featuresList = { result: 'success', features: toTree(featuresList) })
        .catch(err => next(err))

});


module.exports = router;