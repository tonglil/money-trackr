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

  app.get('/user/:id', Auth.auth, function(req, res, next) {
    req.user.getAuthProvider().success(function(provider) {
      res.render('user', {
        auth: provider.values
      });
    });
  });

  app.get('/sync/:resource', Auth.authApi, function(req, res, next) {
    var resource = req.params.resource;
    //var key = req.query.key;
    req.user.getAuthProvider().success(function(provider) {
      //res.json(provider[key]);
      res.json(provider[resource]);
    });
  });

  app.post('/tab/new', Auth.auth, function(req, res, next) {
    var body = req.body;
    console.log(body);
    res.redirect('/user/' + req.user.uuid);
  });

  require('./user-auth')(app, passport);
  require('./base')(app);
};
