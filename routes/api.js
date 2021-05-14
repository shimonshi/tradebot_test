const router = require('express').Router();
const { isAdmin } = require('./validator.js');

router.route('/').get(isAdmin, (req, res, next) => {
    // if (["127.0.0.1", "localhost"].includes(req.connection.remoteAddress)/*['127.0.0.1', 'localhost'] ['8.8.8.8']*/) {
    //     next()
    // }
    // else {
    //     res.status(404).send()
    // }

    next()
});

router.route('/').post(isAdmin, (req, res, next) => {
    // if (["127.0.0.1", "localhost"].includes(req.connection.remoteAddress)/*['127.0.0.1', 'localhost'] ['8.8.8.8']*/) {
    //     if (req.is("application/json")) {
    //         next()
    //     }
    //     else {
    //         res.status(400).send()
    //     }
    // }
    // else {
    //     res.status(404).send()
    // }

    next()
});

module.exports = router;