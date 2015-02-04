var request = require('supertest');
var express = require('express');
var app = require('../app.js').app;
var assert = require('assert');


describe('botilaterooms poker game', function() {
	
	it('should start a new game', function(done){
		request(app)
			.post('/start')
			.type('application/x-www-form-urlencoded')
			.send({
				'OPPONENT_NAME':'IAMTHETESTER',
				'STARTING_CHIP_COUNT':'100',
				'HAND_LIMIT':'300'
			})
			.expect(200)
			.end(function(err,res){
				done();
			});
	});
});
