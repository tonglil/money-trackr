/*
 * Routing index
 */

module.exports = function(app, passport) {
  app.get('/', function(req, res, next) {
    // Redirect to user page if they are logged in
    if (req.user) {
      res.redirect('/user');
    } else {
      res.render('index');
    }
  });

  var Auth = require('../config/middlewares').Auth;
  app.get('/sync/:resource', Auth.authApi, function(req, res, next) {
    res.json(req.user[req.params.resource]);
  });

  var User = require('../models').User;
  var Tab = require('../models').Tab;
  app.get('/tab/:id', Auth.auth, function(req, res, next) {
    var id = parseInt(req.params.id, 10);
    console.log(id);
    if (isNaN(id)) return next('not an id');

    Tab.find({
      where: {
        id: id,
        ownerId: req.user.uuid
      },
      include: [{
        model: User,
        as: 'Friend'
      }]
    }).success(function(tab) {
      if (!tab) {
        return res.json('none');
      }

      console.log(tab.values);
      return res.render('tabs-id', {
        tab: tab
      });
    });
  });

  require('./user-auth')(app, passport);
  require('./tabs-current')(app);
  require('./tabs-new')(app);
  require('./base')(app);
};
