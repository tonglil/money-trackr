/*
 *Passport config
 */

var env = require('./index').env;
var auth = require('./index').passport;

var User = require('../models').User;
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.uuid);
  });

  passport.deserializeUser(function(uuid, done) {
    User.find(uuid).success(function(user) {
      //if (!user) done('Incorrect user');
      done(null, user);
    });
  });

  passport.use('facebook', new FacebookStrategy({
    clientID        : auth.facebook[env].clientID,
    clientSecret    : auth.facebook[env].clientSecret,
    callbackURL     : auth.facebook[env].callbackURL
  }, function(accessToken, refreshToken, profile, done) {
    User.find({
      where: {
        fbid: profile.id
      }
    }).success(function(user) {
      if (!user) {
        User.register(accessToken, profile, function(err, user) {
          return done(err, user);
        });
      } else {
        user.token = accessToken;
        if (user.registered === false) {
          user.email = profile.emails[0].value;
          user.registered = true;
          user.firstName = profile.name.givenName;
          user.lastName = profile.name.familyName;
        }
        user.save().success(function(user) {
          return done(null, user);
        }).error(function(err) {
          return done(err);
        });
      }
    }).error(function(err) {
      done(err);
    });
  }));
};
