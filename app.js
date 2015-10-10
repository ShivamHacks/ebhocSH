var express = require('express');
var path = require('path');

var app = express();

// server
var server = require('http').Server(app);
var port = '3000';
app.set('port', port);
server.listen(port, function(){
  console.log('listening on: ' + this.address().port);
});

var router = express.Router();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(router);

router.get('/:questionID', function(req, res, next) {
  var questionID = req.params.questionID;
  if (questionIDs.indexOf(questionID) > -1) {
    var question = questions[questionIDs.indexOf(questionID)];
    res.render('index', {
      title: 'Express',
      question: question
    });
  } else {
    // error
  }
});

var questionIDs = [ // all in MD5
'c31248e78aced0c36320b2f13a8a7891', // question 1
'8e9c7a86c8295244c2f50e1049023b1b', // question 2
'4f0ff2d5c508d5b43446b927516a3561' // question 3
];

var questions = [
'How many gigabytes of data does google analyze per second?',
'What is the largest number that you can store in a 64-bit integer variable?',
'When was the first Apple Macintosh created?'
];

var answers = [
'answer 1',
'answer 2',
'answer 3'
];

var locations = [
'Correct! Your next question will be at a place where teens use computers.',
'Correct! Your next question will be where library visitors go to eat and relax.',
'Correct! Your next question will be in the same isle as the computer science books'
];

var io = require('socket.io')(server);

io.on('connection', function(socket){
  socket.on('submit',function (data) { 
    if (questionIDs.indexOf(data.questionID) > -1) {
      var cAnswer = answers[questionIDs.indexOf(data.questionID)];
      var uAnswer = data.answer;
      var correct;
      var location;
      if (cAnswer == uAnswer) {
        location = locations[questionIDs.indexOf(data.questionID)];
      } else {
        location = 'Answer wrong, please try again.';
      }
      socket.emit('next', {
        location: location
      });
    }
  });
  console.log('a user connected');
});

/*

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);

*/


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
