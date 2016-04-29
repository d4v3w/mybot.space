
var express = require('express')
  , routes = require('./routes/index')
  , users = require('./routes/users')
  , http = require('http')
  , path = require('path')
  , app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)  
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser');

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

var connectedUsers = {},
    admin_socket_id = '',
    admin_password = 'admin_password',
    current_user;

io.sockets.on('connection', function (socket) {

    // When new users join
  socket.on('join', function (data, fn) {

    if (data.nickname === 'admin') {
        
        if (data.pass == sudar_password) {
            admin_socket_id = socket;
            console.log("admin has logged in");
        } else {
            // It is not admin
            fn(false);    
            return;
        }
    } else {
        
        if (connectedUsers[data.nickname]) {
            // make sure nickname doesn't exist before adding
            fn(false);
            return;
        }
        console.log(data.nickname + " joined");
    }

    socket.set('nickname', data.nickname, function () {
        connectedUsers[data.nickname] = socket;
        socket.emit('list', {list: Object.keys(connectedUsers)})  ;  // for the current socket
        socket.broadcast.emit('list', {list: Object.keys(connectedUsers)})  ; // for all others
        fn(true);
    });
  });

    // ------------- admin events

    // choose a user
    socket.on('choose', function (data) {
        var user_socket = connectedUsers[data.nickname];

        if (user_socket) {
            if (connectedUsers[current_user]) {
                connectedUsers[current_user].emit('unchosen', {});
                console.log(current_user + " unchosen");
            }

            current_user = data.nickname;
            user_socket.emit('chosen', {});
            console.log(current_user + " chosen");
        }
    });
    
    // --------------- client events

    socket.on('clientjoin', function (data) {
        client_socket = socket;
        console.log("BT Client joined");
    });

    // --------------- control events

    socket.on('up', function () {
        socket.get('nickname', function (err, nickname) {
            if (nickname && nickname == current_user) {
                if (client_socket) {
                    client_socket.emit('up', {});     
                    console.log("Up control");
                }
            }  
        });        
    });

    socket.on('left', function () {
        socket.get('nickname', function (err, nickname) {
            if (nickname && nickname == current_user) {
                if (client_socket) {
                    client_socket.emit('left', {});     
                    console.log("Left control");
                }
            }  
        });        
    });

    socket.on('right', function () {
        socket.get('nickname', function (err, nickname) {
            if (nickname && nickname == current_user) {
                if (client_socket) {
                    client_socket.emit('right', {});     
                    console.log("Right control");
                }
            }  
        });        
    });

    socket.on('down', function () {
        socket.get('nickname', function (err, nickname) {
            if (nickname && nickname == current_user) {
                if (client_socket) {
                    client_socket.emit('down', {});     
                    console.log("Down control");
                }
            }  
        });        
    });

    socket.on('start', function () {
        socket.get('nickname', function (err, nickname) {
            if (nickname && nickname == current_user) {
                if (client_socket) {
                    client_socket.emit('start', {});
                    console.log("start control");
                }
            }
        });
    });

    // When a client disconnects
    socket.on('disconnect', function () {
        socket.get('nickname', function (err, nickname) {
            if (nickname) {
                // TODO: Handle admin logging out

                delete connectedUsers[nickname]    ;
                socket.broadcast.emit('list', {list: Object.keys(connectedUsers)})  ; // for all others
                console.log(nickname + " logged out")
            } else {
                // Un named client has quit
            }
        });
    });

});
