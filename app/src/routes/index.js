/*
 * Routing index
 */

module.exports = function(app, passport) {
  app.get('/', function(req, res, next) {
    // Redirect to user page if they are logged in
    if (req.user) {
      console.log('user', req.user.values);
      res.redirect('/user/' + req.user.uuid);
    } else {
      res.render('index');
    }
  });

  var Auth = require('../controllers/middlewares').Auth;
  var graph = require('fbgraph');

  app.get('/user/:id', Auth.authenticate, function(req, res, next) {
    req.user.getAuthProvider().success(function(provider) {
      res.render('user', {
        auth: provider.values
      });
    });
  });

  app.post('/tab/new', Auth.authenticate, function(req, res, next) {
    var body = req.body;
    console.log(body);
    res.redirect('/user/' + req.user.uuid);
  });

  require('./user-auth')(app, passport);
  require('./base')(app);
};
