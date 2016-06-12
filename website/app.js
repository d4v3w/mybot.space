
var express = require('express'),
    routes = require('./routes/index'),
    users = require('./routes/users'),
    http = require('http'),
    path = require('path'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('port', process.env.PORT || 3000);
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Url routing
/*
app.use('/', routes);
app.use('/users', users);

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

// IO Setup
var robots = io
    .of('/robots')
    .sockets.on('connection', function (socket) {
    // Only responding to sockets on robots
    console.log('a user connected');

    // Control events
    socket.on('forward', function () {
        socket.emit('requestRecieved', {event: 'forward'});
        socket.emit('forward', {});
        console.log("Move forwards");
    });
    
    socket.on('back', function () {
        socket.emit('requestRecieved', {event: 'back'});
        socket.emit('back', {});
        console.log("Move backwards");
    });
    
    socket.on('left', function () {
        socket.emit('requestRecieved', {event: 'left'});
        socket.emit('left', {});
        console.log("Turn left");
    });
    
    socket.on('right', function () {
        socket.emit('requestRecieved', {event: 'right'});
        socket.emit('right', {});
        console.log("Turn right");
    });
    
    socket.on('start', function () {
        socket.emit('requestRecieved', {event: 'start'});
        socket.emit('start', {});
        console.log("Start your engines");
    });
    
    socket.on('stop', function () {
        socket.emit('requestRecieved', {event: 'stop'});
        socket.emit('stop', {});
        console.log("Stop");
    });
});
*/