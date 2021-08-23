if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
/* require another package */
var cors = require('cors');
var session = require('express-session');
/* Redis */
const RedisStore = require('connect-redis')(session);
var redis = require('redis');
/* Main Configuration */
var configDB = require('./config/db');
var corsConfig = require('./config/corsConf');
/* Passsport Configuration */
var passport = require('passport');
require('./config/passportConfig.js')(passport);
/* End Passsport Configuration */
var Mysql = require('./config/mysql');

//=============================================== Custom Configuration =========================================
//=============================================== Mysql  =========================================
Mysql.authenticate().then(() => {
  console.log("SQL Database Connect !")
});
//===============================================end  Mysql  =========================================
//============================ Redis Settings ===============================
const redisClient = redis.createClient(configDB.redis.option);
redisClient.on('ready', () => {
  console.log('Successfully connected to Redis.')
});
configDB.redis.client = redisClient;
//============================ End Redis Settings ===============================

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiUserRouter = require('./routes/apiUser');
var checkOutApi = require('./routes/checkoutApi');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//express-session config
app.use(session({
  store: new RedisStore({ client: configDB.redis.client }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // if true only transmit cookie over https
    httpOnly: false, // if true prevent client side JS from reading the cookie 
    maxAge: 1000 * 60 * 10 // session max age in miliseconds
  }
}))
/* passport Config */
app.use(passport.initialize());
app.use(passport.session());
require('./config/passportConfig.js')(passport);

/* Setup CORS */
app.use(cors(corsConfig.option))




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/apiUser', apiUserRouter);
app.use('/checkoutApi', checkOutApi);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
