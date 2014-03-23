/*
 *User authorization endpoints
 */

module.exports = function(app, passport) {
  app.get('/login', function(req, res) {
    if (req.user) {
      req.flash('info', 'You are already logged in.');
      return res.redirect('/');
    } else {
      return res.render('login');
    }
  });

  app.get('/auth/facebook', passport.authenticate('facebook', {
    display: 'touch',
    scope: [
      'email'
    ]
  }));

  var graph = require('fbgraph');
  var async = require('async');

  app.get('/auth/facebook/callback', function(req, res, next) {
    passport.authenticate('facebook', function(err, user, info) {
      if (err) return next(err);
      req.logIn(user, function(err) {
        if (err) return next(err);
        if (info == 'new') {
          req.flash('success', 'Welcome to Money Trackr, ' + req.user.firstName + '!');
        } else {
          req.flash('info', 'Welcome back, ' + req.user.firstName + '.');
        }
        //return res.redirect('/');
        res.redirect('/');

        req.user.getAuthProvider().success(function(provider) {
          var days = (provider.updatedAt - Date.now()) / (1000*60*60*24);
          if (days > 1) {
            graph.setAccessToken(provider.token);
            graph.get('me/friends', function(err, friends) {
              var serialized = JSON.stringify(friends);
              provider.friends = serialized;
              provider.save().success(function() {
                return;
              });
            });
          }
        });
      });
    })(req, res, next);
  });

  app.get('/logout', function(req, res){
    req.logout();
    req.flash('info', 'You have successfully logged out.');
    res.redirect('/');
  });
};
