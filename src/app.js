const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const basicAuth = require('express-basic-auth');
const publicRouter = require('./routes');
const errorParser = require('./middlewares/error');
const app = express();
const API = require('./routes/api');
const arena = require('./services/jobs/arena');
const { queue: { arena: arenaConfig } } = require('./config');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/arena', basicAuth({
    users: { [arenaConfig.username]: arenaConfig.password },
    challenge: true,
}), arena);
app.use(logger('dev'));
app.use('/watch', express.static(path.join(__dirname, '../', 'stream_files', 'uploads')));
app.use('/', publicRouter);
API.init(app);

app.use((req, res) => res.status(404)
    .json({
        success: false,
        data: {
            url: req.url,
            body: req.body,
            query: req.query,
        },
        message: 'Not Found.',
    }));
app.use(errorParser, (err, req, res, next) => res.status(500)
    .json({
        status: false,
        message: {
            body: req.body,
            query: req.query,
            url: req.url,
            method: req.method,
            err: err.message,
            errObj: JSON.stringify(err, Object.getOwnPropertyNames(err)),
        },
    }));
module.exports = app;
