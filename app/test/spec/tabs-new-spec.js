var tabsnew = require("../../src/routes/tabs-new");

describe("convert number to currency", function () {
  it("it should make 2 decimal points", function () {
    console.log(tabsnew);
    var result = tabsnew.makeCurrency(2);
    expect(result).toBe(2.00);
  });
});
