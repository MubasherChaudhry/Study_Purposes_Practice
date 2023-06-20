const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Global Middleware
// set Security HTTP headers
app.use(helmet());

//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limit request from same API
const limiter = rateLimit({
  max: 100,
  WindowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP please try in an hour',
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data Sanitization against NoSQL query Injection
app.use(mongoSanitize());
//Data Sanitization against XSS
app.use(xss());

//Prevent parameter Pollution
app.use(
  hpp({
    whitelist: ['duration', 'ratingsQuantity', 'maxGroupSize', 'difficulty'],
  })
);

//Serving static Files
app.use(express.static(`${__dirname}/public`));

//test Middleware
app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this Server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
