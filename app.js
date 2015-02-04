var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/opponents.log'), 'opponents');
var logger = log4js.getLogger('opponents');
logger.setLevel('INFO');

var opponentName;
var myCard;
var startingChipCount;
var handLimit;
var hand;

var hands = [];
var opponents = [];
var currentOpponent;
var ourMove;
var opponentMove;
var opponentCard;
var lastMove;
var cardDictionary = {
  "2": "FOLD",
  "3": "FOLD",
  "4": "FOLD",
  "5": "FOLD",
  "6": "CALL",
  "7": "CALL",
  "8": "CALL",
  "9": "CALL",
  "T": "BET",
  "J": "BET:Small",
  "Q": "BET:Mid",
  "K": "BET:Large",
  "A": "ALL-IN"
};

app.use(bodyParser.urlencoded({
  extended: false
}));

app.post('/start', function(req, res) {

  opponentName = req.body.OPPONENT_NAME;
  startingChipCount = parseInt(req.body.STARTING_CHIP_COUNT);
  handLimit = req.body.HAND_LIMIT;
  hand = 1;

  res.sendStatus(200);
});

app.post('/update', function(req, res) {

  // logger.info(req.body.COMMAND);

  if (req.body.COMMAND === "CARD") {
    myCard = req.body.DATA;
  }

  if (req.body.COMMAND === "OPPONENT_MOVE") {
    opponentMove = req.body.DATA;
  }

  if (req.body.COMMAND === "OPPONENT_CARD") {
    opponentCard = req.body.DATA;

    if (opponentName) {
      var opponentHand = {
        "ourCard": myCard,
        "opponentCard": opponentCard,
        "ourMove": ourMove,
        "opponentMove": opponentMove
      };

      hands.push(opponentHand);
    }

    hand++;
  }

  if (req.body.COMMAND === "RECEIVE_BUTTON") {
    // button = true;
  }

  if (req.body.COMMAND === "POST_BLIND") {
    startingChipCount -= 1;
  }

  if (req.body.COMMAND === "RECEIVE_CHIPS") {
    startingChipCount += parseInt(req.body.DATA);
  }

  if (req.body.COMMAND === "GAME_OVER") {
    var opponent = {
      "name": opponentName,
      "hands": hands
    };
    opponents.push(opponent);

    logger.info("Last opponent status: ", opponent);
    opponentMove = null;
    opponentCard = null;
  }

  res.sendStatus(200);
});

app.get('/move', function(req, res) {

  var move = cardDictionary[myCard];
  var goodHand = /BET/.test(move) || /ALL-IN/.test(move);
  var opponentHasGoodMove = /BET/.test(opponentMove);

  if (opponentMove === "CALL" && !goodHand) {
    move = "CALL";
  } else if (opponentHasGoodMove && !goodHand) {
    move = "FOLD";
  } else {
    switch (true) {
      case /Small/.test(move):
        move = "BET:" + smallBet();
        break;
      case /Mid/.test(move):
        move = "BET:" + mediumBet();
        break;
      case /Large/.test(move):
        move = "BET:" + highBet();
        break;
      case /ALL-IN/.test(move):
        move = "BET:" + startingChipCount;
        break;
      default:
        break;
    }
  }

  ourMove = move;
  res.send(move);
});

function smallBet() {
  return Math.round(startingChipCount * 0.5);
}

function mediumBet() {
  return Math.round(startingChipCount * 0.6);
}

function highBet() {
  return Math.round(startingChipCount * 0.7);
}

var server = app.listen(3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

exports.app = app;
