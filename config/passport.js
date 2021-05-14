//we import passport packages required for authentication
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
//
//We will need the models folder to check passport agains
var db = require("../models");
//
// Telling passport we want to use a Local Strategy. In other words,
//we want login with a username/email and password
passport.use(new LocalStrategy(
    // Our user will sign in using an name
    {
        usernameField: "name"
    },
    function (name, password, done) {
        // When a user tries to sign in this code runs
        db.User.findOne({
            where: {
                name: name
            }
        }).then(function (dbUser) {
            // If there's no user with the given name
            if (!dbUser) {
                return done(null, false, {
                    name: "Incorrect username"
                });
            }
            // If there is a user with the given email, but the password the user gives us is incorrect
            else if (!dbUser.comparePassword(password)) {
                return done(null, false, {
                    password: "Incorrect password"
                });
            }
            // If none of the above, return the user
            return done(null, dbUser);
        });
    }
));
//
// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
// passport.serializeUser(function (user, done) {
//     done(null, user);
// });
//
// passport.deserializeUser(function (userObj, done) {
//     done(null, userObj);
// });
passport.deserializeUser(function (id, done) {
    db.User.findByPk(id).then(function (user) {
        if (user) {
            done(null, user);
        } else {
            done(user.errors, null);
        }
    });
});
//
// Exporting our configured passport
module.exports = passport;