/*
 * Routing index
 */

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    if (req.user) {
      console.log('user', req.user.values);
    }

    res.render('index', {
      title: null
    });
  });

  require('./user-auth')(app, passport);
  require('./base')(app);
};
