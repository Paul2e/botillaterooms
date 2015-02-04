var request = require('supertest');
var express = require('express');
var app = require('../app.js').app;
var assert = require('assert');


describe('start botilaterooms poker game', function() {
	
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

describe('playing botillaterooms poker game', function() {

	beforeEach('set up a new game of botillaterooms', function (done)
	{
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


	it('should bet all in on K', function(done) {
		var botillaterooms = request(app);
			
			botillaterooms.post('/update')
			.type('application/x-www-form-urlencoded')
			.send({
				'COMMAND':'CARD',
				'DATA':'K'
			})
			.end(function() {
				botillaterooms.get('/move')
				.expect(200)
				.expect('BET:100')
				.end(function(err, res) {
					done();
				});
			})
	});

	it('should bet all in on A', function(done) {
		var botillaterooms = request(app);
			
			botillaterooms.post('/update')
			.type('application/x-www-form-urlencoded')
			.send({
				'COMMAND':'CARD',
				'DATA':'A'
			})
			.end(function() {
				botillaterooms.get('/move')
				.expect(200)
				.expect('BET:100')
				.end(function(err, res) {
					done();
				});
			})
	});

	it('should bet on 9', function(done) {
		var botillaterooms = request(app);
			
			botillaterooms.post('/update')
			.type('application/x-www-form-urlencoded')
			.send({
				'COMMAND':'CARD',
				'DATA':'9'
			})
			.end(function() {
				botillaterooms.get('/move')
				.expect(200)
				.expect('BET')
				.end(function(err, res) {
					done();
				});
			})
	});

	it('should bet on T', function(done) {
		var botillaterooms = request(app);
			
			botillaterooms.post('/update')
			.type('application/x-www-form-urlencoded')
			.send({
				'COMMAND':'CARD',
				'DATA':'T'
			})
			.end(function() {
				botillaterooms.get('/move')
				.expect(200)
				.expect('BET')
				.end(function(err, res) {
					done();
				});
			})
	});
	
	it('should bet on J', function(done) {
		var botillaterooms = request(app);
			
			botillaterooms.post('/update')
			.type('application/x-www-form-urlencoded')
			.send({
				'COMMAND':'CARD',
				'DATA':'J'
			})
			.end(function() {
				botillaterooms.get('/move')
				.expect(200)
				.expect('BET')
				.end(function(err, res) {
					done();
				});
			})
	});

	it('should bet on Q', function(done) {
		var botillaterooms = request(app);
			
			botillaterooms.post('/update')
			.type('application/x-www-form-urlencoded')
			.send({
				'COMMAND':'CARD',
				'DATA':'Q'
			})
			.end(function() {
				botillaterooms.get('/move')
				.expect(200)
				.expect('BET')
				.end(function(err, res) {
					done();
				});
			})
	});

	it('should fold on 2', function(done) {
		var botillaterooms = request(app);
			
			botillaterooms.post('/update')
			.type('application/x-www-form-urlencoded')
			.send({
				'COMMAND':'CARD',
				'DATA':'2'
			})
			.end(function() {
				botillaterooms.get('/move')
				.expect(200)
				.expect('FOLD')
				.end(function(err, res) {
					done();
				});
			})
	});

	it('should fold on 3', function(done) {
		var botillaterooms = request(app);
			
			botillaterooms.post('/update')
			.type('application/x-www-form-urlencoded')
			.send({
				'COMMAND':'CARD',
				'DATA':'3'
			})
			.end(function() {
				botillaterooms.get('/move')
				.expect(200)
				.expect('FOLD')
				.end(function(err, res) {
					done();
				});
			})
	});

	it('should fold on 4', function(done) {
		var botillaterooms = request(app);
			
			botillaterooms.post('/update')
			.type('application/x-www-form-urlencoded')
			.send({
				'COMMAND':'CARD',
				'DATA':'4'
			})
			.end(function() {
				botillaterooms.get('/move')
				.expect(200)
				.expect('FOLD')
				.end(function(err, res) {
					done();
				});
			})
	});

	it('should call on 5', function(done) {
		var botillaterooms = request(app);
			
			botillaterooms.post('/update')
			.type('application/x-www-form-urlencoded')
			.send({
				'COMMAND':'CARD',
				'DATA':'5'
			})
			.end(function() {
				botillaterooms.get('/move')
				.expect(200)
				.expect('CALL')
				.end(function(err, res) {
					done();
				});
			})
	});

	it('should call on 6', function(done) {
		var botillaterooms = request(app);
			
			botillaterooms.post('/update')
			.type('application/x-www-form-urlencoded')
			.send({
				'COMMAND':'CARD',
				'DATA':'6'
			})
			.end(function() {
				botillaterooms.get('/move')
				.expect(200)
				.expect('CALL')
				.end(function(err, res) {
					done();
				});
			})
	});

	it('should call on 7', function(done) {
		var botillaterooms = request(app);
			
			botillaterooms.post('/update')
			.type('application/x-www-form-urlencoded')
			.send({
				'COMMAND':'CARD',
				'DATA':'7'
			})
			.end(function() {
				botillaterooms.get('/move')
				.expect(200)
				.expect('CALL')
				.end(function(err, res) {
					done();
				});
			})
	});

	it('should call on 8', function(done) {
		var botillaterooms = request(app);
			
			botillaterooms.post('/update')
			.type('application/x-www-form-urlencoded')
			.send({
				'COMMAND':'CARD',
				'DATA':'8'
			})
			.end(function() {
				botillaterooms.get('/move')
				.expect(200)
				.expect('CALL')
				.end(function(err, res) {
					done();
				});
			})
	});

});
