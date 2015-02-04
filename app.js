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

var opponents = [];
var currentOpponent;
var opponentMove;
var opponentCard;
var button;
var cardDictionary = {
  "2": "FOLD",
  "3": "FOLD",
  "4": "FOLD",
  "5": "FOLD",
  "6": "FOLD",
  "7": "CALL",
  "8": "CALL",
  "9": "CALL",
  "T": "BET",
  "J": "BET",
  "Q": "BET:{amount}",
  "K": "BET:{amount}",
  "A": "ALL-IN"
};


app.use(bodyParser.urlencoded({
  extended: false
}));
app.post('/start', function(req, res) {

  if (opponentName) {
    var opponent = {
      "name": opponentName,
      "lastCard": opponentCard,
      "lastMove": opponentMove
    };

    opponents.push(opponent);

    logger.info("Last opponent status: ", opponent);
    // console.log('Last opponent stats: ', opponent);
  }
  opponentName = req.body.OPPONENT_NAME;
  startingChipCount = parseInt(req.body.STARTING_CHIP_COUNT);
  handLimit = req.body.HAND_LIMIT;
  hand = 1;

  // console.log('\n\n\n\nNew Opponent ' + opponentName + ' starting with ' + startingChipCount + ' chips for ' + handLimit + ' hands.\n\n');

  res.sendStatus(200);
});

app.post('/update', function(req, res) {

  if (req.body.COMMAND === "CARD") {
    myCard = req.body.DATA;
    // console.log("\n\nHand: " + hand);
    // console.log("Our card: " + myCard);
  }

  if (req.body.COMMAND === "OPPONENT_MOVE") {
    opponentMove = req.body.DATA;
    // console.log("OpponentMove: " + opponentMove);
  }

  if (req.body.COMMAND === "OPPONENT_CARD") {
    opponentCard = req.body.DATA;
    // console.log("Opponent card: " + opponentCard);
    hand++;
  }

  if (req.body.COMMAND === "RECEIVE_BUTTON") {
    button = true;
    // console.log("We have button");
  }

  if (req.body.COMMAND === "POST_BLIND") {
    startingChipCount -= 1;
    // console.log("POST BLIND Chip count: " + startingChipCount);
  }

  if (req.body.COMMAND === "RECEIVE_CHIPS") {
    startingChipCount += parseInt(req.body.DATA);
    // console.log("Received chips: " + req.body.DATA + " New count:" + startingChipCount);
  }

  res.sendStatus(200);
});

app.get('/move', function(req, res) {

  if (opponentMove === "CALL") {

    return res.send("CALL");
  }

  var move = cardDictionary[myCard];

  switch (true) {
    case /{amount}/.test(move):
      res.send("BET:10");
      break;
    case /ALL-IN/.test(move):
      res.send("BET:" + startingChipCount);
      break;
    default:
      res.send(move);
      break;
  }
});

var server = app.listen(3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

exports.app = app;
