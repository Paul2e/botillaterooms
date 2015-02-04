var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var opponentName;
var myCard;
var startingChipCount;
var handLimit;

var cardDictionary = {
  "2": "FOLD",
  "3": "FOLD",
  "4": "FOLD",
  "5": "CALL",
  "6": "CALL",
  "7": "CALL",
  "8": "CALL",
  "9": "BET",
  "T": "BET",
  "J": "BET",
  "Q": "BET"
};

app.use(bodyParser.urlencoded({
  extended: false
}));
app.post('/start', function(req, res) {

  opponentName = req.body.OPPONENT_NAME;
  startingChipCount = parseInt(req.body.STARTING_CHIP_COUNT);
  handLimit = req.body.HAND_LIMIT;

  console.log('New Opponent ' + opponentName + ' starting with ' + startingChipCount + ' chips for ' + handLimit + ' hands');

  res.sendStatus(200);
});

app.post('/update', function(req, res) {
  var opponentMove;
  var opponentCard;

  if (req.body.COMMAND === "CARD") {
    myCard = req.body.DATA;
  	console.log("Our card: " + myCard);
  }

  if (req.body.COMMAND === "OPPONENT_MOVE") {
    opponentMove = req.body.DATA;
	console.log("OpponentMove: " + opponentMove);
  }


  if (req.body.COMMAND === "OPPONENT_CARD") {
  	opponentCard = req.body.DATA;
    console.log("Opponent card: " + opponentCard);
  }

  if (req.body.COMMAND === "RECEIVE_BUTTON") {

    console.log("We have button");
  }

  if (req.body.COMMAND === "POST_BLIND") {
    startingChipCount -= 1;
    console.log("POST BLIND Chip count: " + startingChipCount);
  }

  if (req.body.COMMAND === "RECEIVE_CHIPS") {
    startingChipCount += parseInt(req.body.DATA);
    console.log("Received chips: " + req.body.DATA + " New count:" + startingChipCount);
  }

  res.sendStatus(200);
});

app.get('/move', function(req, res) {

  if (startingChipCount <= 5) {

    console.log("Running Low. Calling");
    return res.send("CALL");
  }

  var move = cardDictionary[myCard];

  if (move) {
    res.send(move);
  } else {
    res.send("BET:" + startingChipCount);
  }

});

var server = app.listen(3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

exports.app = app;
