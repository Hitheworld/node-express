var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require("mongoose");

//var client = require("./config/redis.config");

var routes = require('./routes/index');
var users = require('./routes/users');
var users = require('./routes/data.routes.js');

var app = express();

//db
mongoose.connect("mongodb://127.0.0.1:27017/thihibook");

//测试mongodb连接
mongoose.connection.on('connected', function(){
	console.log('连接成功！');
});
mongoose.connection.on('error', function(err){
	console.log('连接错误: ' + err);
});
mongoose.connection.on('disconnected', function(){
	console.log('连接断开!');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//可以参考https://github.com/vczero/toilet/tree/master/service
app.use(session({
	secret: '#sddjswjdhww22ygfw2233@@@%#$!@%Q!%*12',
	resave: false,
	saveUninitialized: true
}));

app.use('/', routes);
app.use('/users', users);
app.use('/api', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
