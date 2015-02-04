var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var opponentName;
var startingChipCount;
var handLimit;
var shouldBet;
var shouldBetAllIn;
var shouldFold;

app.use(bodyParser.urlencoded({ extended: false }));
app.post('/start', function (req, res) {

	shouldBet = false;
	shouldBetAllIn = false;
	shouldFold = false;
	opponentName = req.body.OPPONENT_NAME;
	startingChipCount = parseInt(req.body.STARTING_CHIP_COUNT);
	handLimit = req.body.HAND_LIMIT;

	console.log('New Opponent ' + opponentName  +' starting with ' + startingChipCount + ' chips for ' + handLimit + ' hands');

	res.sendStatus(200);

});

app.post('/update', function(req, res) {

	var card;
	var opponentMove;

	if (req.body.COMMAND === "CARD") {
		card = req.body.DATA;
	}

	if (req.body.COMMAND === "OPPONENT_MOVE") {
		opponentMove = req.body.DATA;
	}

	if (card === "9" || card === "T" || card === "J" || card === "Q") {
		shouldBet = true
	} else if (card === "2" || card === "3" || card === "4") {
		shouldFold = true
	} else if (card === "K" || card === "A") {
		shouldBetAllIn = true
	}

	console.log("Our card: " + card);
	console.log("OpponentMove: " + opponentMove);

	if (req.body.COMMAND === "OPPONENT_CARD") {

		console.log("Opponent card: " + req.body.DATA)
	}

	if (req.body.COMMAND === "RECEIVE_BUTTON") {

		console.log("We have button")
	}

	if (req.body.COMMAND === "POST_BLIND") {
		startingChipCount -= 1
		console.log("POST BLIND Chip count: " + startingChipCount)
	}

	if (req.body.COMMAND === "RECEIVE_CHIPS") {
		startingChipCount += parseInt(req.body.DATA)
		console.log("Received chips: " + req.body.DATA + " New count:" + startingChipCount)
	}

	res.sendStatus(200);
});

app.get('/move', function(req, res) {

	 if (startingChipCount <= 5) {

	 	console.log("Running Low. Calling");
	 	res.send("CALL");

	 } else if (shouldBet) {

		console.log("Betting");
		res.send("BET");

	} else if (shouldBetAllIn) {

		console.log("Sending: BET ALL IN:" + startingChipCount);
		res.send("BET:" + startingChipCount);

	} else if (shouldFold) {

		console.log("Sending: Folding");
		res.send("FOLD");
	}
	else {

		console.log("Sending: Calling");
		res.send("CALL");

	}
	
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})

exports.app = app;