var routes = require("../../src/routes");

var request = {};
var response = {
    viewName: ""
    , data : {}
    , render: function(view, viewData) {
        this.viewName = view;
        this.data = viewData;
    }
};

describe("Routing", function(){
    describe("Default Route", function(){
        it("should provide the a title and the index view name", function(){
        routes.index(request, response);
        response.viewName.should.equal("index");
        });

    });
});
