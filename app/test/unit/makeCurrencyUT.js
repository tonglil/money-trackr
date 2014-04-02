var should = require('should');

var makeCurrency = function (num) {
  return (Math.round(num * 100) / 100).toFixed(2);
};

//tests
describe('makeCurrency(value)', function() {
  it('should return a 2 decimal point floating integer', function() {
    var input = 2;
    makeCurrency(input).should.be.equal((Math.round(2 * 100) / 100).toFixed(2));
  });

  it('should do something else', function() {
    var input = 'a';
    makeCurrency(input).should.eql('NaN');
  });
});
