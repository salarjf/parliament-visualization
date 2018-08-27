var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var users = require('./routes/users');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



///my adds
app.use(express.static(path.join(__dirname, 'public')));



////end of my add
// app.use('/', routes);
app.get('/namayande/:id', routes.shownemayande);
app.get('/search',routes.search);
app.get('/mosharekat/:nid',routes.mosharekatPlot);
app.get('/tazakor/:nid',routes.tazakorPlot);
app.get('/soal/:nid',routes.soalPlot);
app.get('/comision/:nid',routes.comisionTable);
app.get('/wordcloud/:nid',routes.wordcloud);

app.get('/jalase/:shomarejalase',routes.jalase);
app.get('/jdetails/:nid',routes.jdetails);







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
