var request = require('supertest');
var express = require('express');
var app = require('../../src/money-trackr.js');

describe('GET /', function() {
  it('respond with 200', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });
});

describe('GET /user unauthenticated', function () {
  it('respond with 302', function (done) {
    request(app)
      .get('/user')
      .expect(302)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });
});
