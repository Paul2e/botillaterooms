var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var opponentName;
var startingChipCount;
var handLimit;

app.use(bodyParser.urlencoded({ extended: false }));
app.post('/start', function (req, res) {

	opponentName = req.body.OPPONENT_NAME;
	startingChipCount = req.body.STARTING_CHIP_COUNT;
	handLimit = req.body.HAND_LIMIT;

	console.log('New Opponent ' + opponentName  +' starting with ' + startingChipCount + ' chips for ' + handLimit + ' hands');

	res.sendStatus(200);

});

app.post('/update', function(req, res) {

	console.log(req.body.COMMAND);
	//console.log(req.body.DATA);

	res.sendStatus(200);
});

app.get('/move', function(req, res) {

	res.send('BET');
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})

exports.app = app;