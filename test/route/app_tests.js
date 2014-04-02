var request = require('../../app/node_modules/supertest');
var express = require('../../app/node_modules/express');
var app = express();

describe('index route', function () {

  it('should respond with a 200 with no query parameters', function (done) {

    request(app)
      .get('/user')
      .expect('Content-Type', /html/)
      .expect(200, done);

  });

});
