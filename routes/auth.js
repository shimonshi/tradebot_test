// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const router = require('express').Router();
const { isAuthenticated, userAddRules, getLoginRules, validate } = require('./validator');
var debug = require('debug')('auth');

// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
router.route("/login").post(getLoginRules(), validate, (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            debug('Login error: ' + JSON.stringify(err));
            return next(err);
        }
        if (!user) {
            debug('Login error; user not found: ' + JSON.stringify(info));
            return res.status(403).json({ result: "error", error: [info] });
        }
        // if (!user.validPassword())
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.json({ result: "success", user: { name: user.name } });
        });
    })(req, res, next);
});

// Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
// how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
// otherwise send back an error
router.route("/signup").post(userAddRules(), validate, (req, res, next) => {
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const registration_date = Date();

    const newUser = new db.User({ name, password, email, registration_date });

    newUser.save()
        .then(() => {
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(403).json({ result: "error", error: [info] });
                }
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    return res.json({ result: "success", user: { name: user.name } });
                });
            })(req, res, next);
        }).catch(err => {
            next(err)
        });
});

// Route for logging user out
router.route("/logout").post(isAuthenticated, (req, res, next) => {
    req.logout();
    res.json({ result: "success" });
});

module.exports = router;