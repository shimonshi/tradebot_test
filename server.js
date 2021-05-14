require('dotenv').config();

const express = require('express');
const cors = require('cors');
// routes
const apiRouter = require('./routes/api');
const apiFaQuestionsRouter = require('./routes/faq_questions');
const apiFaqCategoriesRouter = require('./routes/faq_categories');
const apiPlanRouter = require('./routes/plan');
const featuresRouter = require('./routes/features');
const authRouter = require('./routes/auth');
// api requests -- require authentication
const apiUsersRouter = require('./routes/api/users');
const apiKeysRouter = require('./routes/api/keys');
const mainDataRouter = require('./routes/main');
// const sdb = require('./models').sequelize;
const fileUpload = require('express-fileupload');

const session = require('express-session');
const passport = require('./config/passport');

const pgSession = require('connect-pg-simple')(session);
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const winston = require('./config/winston');

const { newError } = require('./routes/validator');

const app = express();

app.use(helmet());
app.use(compression());
// enable moargan combined logging
app.use(morgan('combined', { stream: winston.stream }));

app.use(cors());
app.use(express.json());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    abortOnLimit: true,
    limitHandler: (req, res, next) => { next(new Error("File size limit reached")) },
    limits: { fileSize: 1 * 1024 * 1024 },
}));

// We need to use sessions to keep track of our user's login status
app.use(session({
    name: "session",
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
        conString: process.env.DATABASE_URI,
        tableName: "user_sessions"
    }),
    cookie: { sameSite: true, httpOnly: true, maxAge: 5 * 365 * 24 * 60 * 60 * 1000 },
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use('/api/*', apiRouter);
app.use('/api/faq_questions', apiFaQuestionsRouter);
app.use('/api/faq_categories', apiFaqCategoriesRouter);
app.use('/api/plan', apiPlanRouter);
app.use('/api/features', featuresRouter);

app.use('/api/users', apiUsersRouter);
app.use('/api/keys', apiKeysRouter);

app.use('/api/auth', authRouter);

app.use('/api/main', mainDataRouter);

app.use(function (req, res, next) {
    res.status(404).send({ error: 'Url not found' })
})

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send(newError(err.message));
});

app.use(express.static('public'));

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
    debug(`Server is running on port: ${port}`);
});