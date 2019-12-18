var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const SimpleNodeLogger = require('simple-node-logger'),
    opts = {
        logFilePath:'poker.log',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    },
log = SimpleNodeLogger.createSimpleLogger( opts );

var opponentName;
var myCard;
var startingChipCount;
var handLimit;
var hand;
var button;

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

  log.info('Game Start - Opponent: ', opponentName, 
            ' Starting Chip Count: ', startingChipCount,
            ' Hand Limit: ', handLimit,
            ' Hand ', hand);

});

app.post('/update', function(req, res) {

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

    log.info('Hand: ', hand, 
    ' My Card: ', myCard,
    ' Opponent Card: ', opponentCard,
    ' My Move ', ourMove,
    ' Opponent Move ', opponentMove);

    hand++;
  }

  if (req.body.COMMAND === "RECEIVE_BUTTON") {
    button = true;

    log.info('Hand: ', hand, ' I have the Button');
  }

  if (req.body.COMMAND === "POST_BLIND") {
    startingChipCount -= 1;

    log.info('Hand: ', hand, ' Posted the Blind');
  }

  if (req.body.COMMAND === "RECEIVE_CHIPS") {
    recievedChips = parseInt(req.body.DATA);
    startingChipCount += parseInt(req.body.DATA);

    log.info('Hand: ', hand, ' I have recieved Chips: ', recievedChips, ' Total Chip Count: ', startingChipCount);
  }

  if (req.body.COMMAND === "GAME_OVER") {
    var opponent = {
      "name": opponentName,
      "hands": hands
    };
    opponents.push(opponent);

    log.info('Hand: ', hand, ' Game Over: Opponent Name: ', opponentName, 
              ' Number of Hands: ', hands,
              ' Total Chip Count: ', startingChipCount);
    opponentMove = null;
    opponentCard = null;
    button = false;
  }

  res.sendStatus(200);
});

app.get('/move', function(req, res) {

  var move = cardDictionary[myCard];
  var goodHand = /BET/.test(move) || /ALL-IN/.test(move);
  var opponentHasGoodMove = /BET/.test(opponentMove);

  if (!goodHand) {
    if (opponentMove === "CALL" || button) {
      move = "CALL";
    } else if (opponentHasGoodMove) {
      move = "FOLD";
    }
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

  log.info('Hand: ', hand, 
            ' Card: ', myCard,
            ' Move: ', move, 
            ' Did I have a Good Hand: ', goodHand,
            ' Did my Opponent have a Good Move: ', opponentHasGoodMove);

  ourMove = move;
  res.send(move);
});

function smallBet() {
  return Math.round(startingChipCount * 0.2);
}

function mediumBet() {
  return Math.round(startingChipCount * 0.3);
}

function highBet() {
  return Math.round(startingChipCount * 0.5);
}

var server = app.listen(3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

exports.app = app;
