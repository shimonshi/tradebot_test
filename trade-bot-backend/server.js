const express = require('express');
const cors = require('cors');

// const database = require('./models');

const apiRouter = require('./routes/api');
const apiFaQuestionsRouter = require('./routes/api/faq_questions');
const apiFaqCategoriesRouter = require('./routes/api/faq_categories');
const apiUsersRouter = require('./routes/api/users');
const apiKeysRouter = require('./routes/api/keys');
const apiPlanRouter = require('./routes/api/plan');
const apiInfoRouter = require('./routes/api/info');

const keysRouter = require('./routes/keys');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/*', apiRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api/faq_questions', apiFaQuestionsRouter);
app.use('/api/faq_categories', apiFaqCategoriesRouter); 
app.use('/api/keys', apiKeysRouter);
app.use('/api/plan', apiPlanRouter);
app.use('/keys', keysRouter);
app.use('/api/info', apiInfoRouter);

const port = process.env.PORT || 5000;

app.listen(port, 'localhost', () => {
    debug(`Server is running on port: ${port}`);

    // database.sync({ force: false })
    //     .then(message => {
    //         console.log('...and db is synced!');
    //     })
    //     .catch(function (err) {
    //         throw err;
    //     });
});

// module.exports = app