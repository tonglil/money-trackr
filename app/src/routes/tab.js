/*
 *Singular tab endpoints
 */

var Auth = require('../config/middlewares').Auth;

//var User = require('../models').User;
var Tab = require('../models').Tab;
//var _ = require('../models').Sequelize.Utils._;

module.exports = function(app) {
  app.post('/tab/:id/paid', Auth.authApi, function(req, res, next) {
    var id = parseInt(req.params.id, 10);
    if (isNaN(id)) return next('not an id');

    //TODO: how to guarentee that logged in user can perform this action for his tabs only? Is this only way?
    Tab.find({
      where: {
        id: id,
        ownerId: req.user.uuid
      }
    }).success(function(tab) {
      tab.paid = true;
      tab.paidOn = new Date();
      tab.save().success(function() {
        return res.json('yes!');
      });
    }).error(function(err) {
      return next(err);
    });
  });
};
