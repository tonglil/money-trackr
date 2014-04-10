/*
 *Current tab endpoint
 */

var Auth = require('../config/middlewares').Auth;

var User = require('../models').User;
var Tab = require('../models').Tab;
var _ = require('../models').Sequelize.Utils._;
var moment = require('moment');

module.exports = function(app) {
  app.get('/user', Auth.auth, function(req, res, next) {
    User.find({
      where: {
        uuid: req.user.uuid
      },
      include: [{
        model: Tab,
        as: 'Tabs',
        where: {
          paid: false
        },
        include: [{
          model: User,
          as: 'Friend'
        }]
      }]
    }).success(function(user) {
      if (!user) {
        return res.render('user', {
          friends: []
        });
      }

      var friends = _(user.tabs)
      .groupBy(function(tab) {
        return tab.friendId;
      })
      .map(function(tabs) {
        var collection = {};
        collection.tabs = _(tabs)
        .map(function(tab) {
          var val = tab.values;
          val.date = moment(val.date).format('M/D/YYYY');
          if (val.deadline) val.deadline = moment(val.deadline).format('M/D/YYYY');
          val.owe = val.owe.toFixed(2);
          val.friend = (tab.friend ? tab.friend.values : null);
          return val;
        })
        .value();
        return collection;
      })
      //TODO: extract the friend into a collection.friend field
      .map(function(friend) {
        friend.total = _(friend.tabs)
        .reduce(function(sum, tab) {
          return sum + parseFloat(tab.owe);
        }, 0).toFixed(2);
        return friend;
      })
      .value();

      return res.render('user', {
        friends: friends
      });
    }).error(function(err) {
      return next(err);
    });
  });
};
