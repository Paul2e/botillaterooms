var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var opponentName;
var startingChipCount;
var handLimit;
var shouldBet;
var shouldBetAllIn;

app.use(bodyParser.urlencoded({ extended: false }));
app.post('/start', function (req, res) {

	opponentName = req.body.OPPONENT_NAME;
	startingChipCount = req.body.STARTING_CHIP_COUNT;
	handLimit = req.body.HAND_LIMIT;

	console.log('New Opponent ' + opponentName  +' starting with ' + startingChipCount + ' chips for ' + handLimit + ' hands');

	res.sendStatus(200);

});

app.post('/update', function(req, res) {

	if (req.body.COMMAND === "CARD") {
		var card = req.body.DATA

		if (card === "9" || card === "T" || card === "J" || card === "Q") {
			shouldBet = true
		} else if (card === "K" || card === "A") {
			shouldBetAllIn = true
		}

		console.log("Our card: " + card)
	}

	if (req.body.COMMAND === "OPPONENT_CARD") {
		console.log("Oponent card: " + req.body.DATA)
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
		console.log("Reveived chips: " + req.body.DATA + " New count:" + startingChipCount)
	}

	res.sendStatus(200);
});

app.get('/move', function(req, res) {

	if (shouldBet) {
		console.log("Betting");
		res.send("BET");
	} else if (shouldBetAllIn) {
		res.send("BET:" + startingChipCount)
	} else {
		console.log("Folding");
		res.send("FOLD");
	}
	
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})

exports.app = app;