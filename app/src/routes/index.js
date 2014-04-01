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

  require('./user-auth')(app, passport);
  require('./tabs-current')(app);
  require('./tabs-new')(app);
  require('./base')(app);
};
