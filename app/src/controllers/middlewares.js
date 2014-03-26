var middlewares = {};

middlewares.Auth = {
  auth: function(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      req.flash('error', 'You need to be logged in to do that!');
      res.redirect('/login');
    }
  },

  authApi: function(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.json(401, {
        error: 'You need to be logged in to do that!'
      });
    }
  },

  //TODO: what is this used for?
  userExist: function(req, res, next) {
    var User = require('../models').User;

    User.count({
      where: {
        email: req.body.email
      }
    }).success(function(count) {
      if (count === 0) {
        next();
      } else {
        //req.flash('error', 'That user already exists.');
        res.redirect("/login");
      }
    });
  },
};

middlewares.Render = {
  user: function(req, res, next) {
    res.locals.user = req.user;
    next();
  },

  flash: function(req, res, next) {
    res.locals.request = req;
    next();
  }
};

middlewares.Prototypes = {
  string: String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }
};

middlewares.Errors = {
  log: function(err, req, res, next) {
    console.error(err);
    //TODO: stack?
    console.error('stack', err.stack);
    next(err);
  },

  clientHandler: function(err, req, res, next) {
    if (req.xhr) {
      res.send(500, {
        error: 'Something went wrong'
      });
    } else {
      next(err);
    }
  },

  errorHandler: function(err, req, res, next) {
    res.status(500);
    res.send(err.stack);
  }
};

module.exports = middlewares;
