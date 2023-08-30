const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const compression = require('compression');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const refreshRouter = require('./routes/refesh');
const postRouter = require('./routes/posts');
const fileRouter = require('./routes/file');
const clientRouter = require('./routes/clients');

const corsOptions = require('../bin/cors');

const app = express();

app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use('/', indexRouter);
app.use('/auth', userRouter);
app.use('/refresh', refreshRouter);
app.use('/posts', postRouter);
app.use('/files', fileRouter);
app.use('/clients', clientRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500).json(createError(err.status || 500, { message: res.locals.message, error: res.locals.error }));
});

module.exports = app;
