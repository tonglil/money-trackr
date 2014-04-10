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
    Tab.findAll({
      where: {
        ownerId: req.user.uuid
      },
      include: [{
        model: User,
        as: 'Friend'
      }]
    }).success(function(tabs) {
      var all = _(tabs)
        .map(function(tab) {
          var val = tab.values;
          val.date = moment(val.date).format('M/D/YYYY');
          if (val.deadline) val.deadline = moment(val.deadline).format('M/D/YYYY');
          if (val.paidOn) val.paidOn = moment(val.paidOn).format('M/D/YYYY');
          val.friend = (tab.friend ? tab.friend.values : null);
          return val;
        })
        .groupBy(function(tab) {
          return tab.friendId;
        })
        .map(function(friend) {
          var total = 0;
          var unpaid = 0;
          var person = friend[0].friend;
          mappedTabs = _(friend)
            .map(function(tab) {
              total += tab.owe;
              if (!tab.paid) unpaid += tab.owe;
              delete tab.friend;
              return tab;
            })
            .value();
          person.total = total;
          person.unpaid = unpaid;
          person.tabs = mappedTabs;
          return person;
        })
        .value();

      return res.render('user', {
        all: all,
      });
    }).error(function(err) {
      return next(err);
    });
  });
};
