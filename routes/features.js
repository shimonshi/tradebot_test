const router = require('express').Router();
const Feature = require('../models').Feature;
const { isAdmin } = require('./validator');

function toTree(flat) {
    let flatArr = flat.map(flatItem => ({ id: flatItem.id, content: flatItem.content, groupId: flatItem.groupId, title: flatItem.title }));
    const root = [];
    const map = {};

    flatArr.forEach(node => {
        // No parentId means top level
        if (!node.groupId)
        {
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
    Feature.findAll(
        {
            // include: [{ model: Feature, as: 'child_groups' }]
        })
        .then(featuresList => res.json({ result: 'success', features: toTree(featuresList) }))
        .catch(err => next(err))
});

router.route('/:id').get((req, res, next) => {
    const contentId = req.params.id;
    Feature.findByPk(contentId)
        .then(res.send.bind(res))
        .catch(err => next(err));
});

// Admin-only 

router.route('/add').post(isAdmin, (req, res, next) => {
    const content = req.body.content;
    const group = req.body.group;

    const newFeature = new Feature({ content });
    if (typeof group != 'undefined') {
        Feature.findByPk(group).then(group => {
            if (group) {
                newFeature.setParent_group(group)
            }
        });
    }
    newFeature.save()
        .then(_ => res.json({ result: 'success' }))
        .catch(err => next(err));
});


router.route('/:id/delete').post(isAdmin, (req, res, next) => {
    const FeatureId = req.params.id;
    Feature.findByPk(FeatureId)
        .then(Feature => {
            Feature.destroy()
                .then(res.json({ result: 'success' }))
                .catch(err => next(err))
        })
        .catch(err => next(err));
});

module.exports = router;