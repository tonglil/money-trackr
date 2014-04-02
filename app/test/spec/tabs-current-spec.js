var tabscurrent = require("../../src/routes/tabs-current");

describe('vision home page', function(){

  describe('when requesting resource /', function(){
    it('should respond with view', function(done){
      request(app)
        .get('/')
        .expect('Content-Type', /html/)
        .expect(200, done)
    });
  });
});
