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

  var Tab = require('../models').Tab;
  var User = require('../models').User;
  var async = require('async');
  var _ = require('../models').Sequelize.Utils._;

  app.get('/user/:id', Auth.auth, function(req, res, next) {
    res.render('user', {
      //pass back all of their tabs...
    });
  });

  app.get('/sync/:resource', Auth.authApi, function(req, res, next) {
    res.json(req.user[req.params.resource]);
  });

  var User = require('../models').User;
  var Tab = require('../models').Tab;
  var validator = require('validator');

  app.post('/tab/new', Auth.auth, function(req, res, next) {
    var body = req.body;
    console.log(body);

    var amount = makeCurrency(parseFloat(body.amount)) || null;
    var tip = parseInt(body.tip, 10) || 0;
    var total = makeCurrency(parseFloat(body.total)) || null;

    var names = body.names.map(function(name) {
      var n = validator.escape(validator.trim(name));
      if (n) return n;
    });
    var ids = body.ids.map(function(id) {
      var n = parseInt(id, 10);
      if (!isNaN(n)) return n;
    });
    var partySize = ids.length;

    var description = validator.escape(validator.trim(body.description)) || null;
    var payment = validator.escape(validator.trim(body.payment)) || null;

    var date = validator.toDate(body.date) || new Date();
    var deadline = validator.toDate(body.deadline) || null;

    if (isNaN(amount) || isNaN(tip) || isNaN(total)) {
      return next('form values are malformed (not a number)');
    }

    if (null === (amount || total) || partySize === 0 || names.length != ids.length) {
      return next('form values are missing');
    }

    //TODO: more name and id validations:
    //- name must match id based on friend list
    //- name must exist in friend list if id != 0
    //- if id === 0 user can exist in custom list, then new user

    /*
     *{ amount: '50',
     *  names: [ 'Josh Compagnyolo', 'Aneel Mawji' ],
     *  ids: [ '514588664', '515969532' ],
     *  description: 'Did some stuff together...',
     *  date: 'TODAY',
     *  deadline: 'TOMORROW',
     *  tip: '15',
     *  payment: 'other',
     *  total: '57.50' }
     */

    ids.forEach(function(id, i) {
      var name = names[i];
      if (id === 0) {
        //LOOK BY UUID FIRST after it being passed through form?!
        User.fill(null, name, function(err, friend) {
          if (err) return next(err);
          createTab(friend);
        });
      } else {
        User.find({
          where: {
            fbid: id
          }
        }).success(function(friend) {
          if (!friend) {
            User.fill(id, name, function(err, friend) {
              if (err) return next(err);
              createTab(friend);
            });
          } else {
            createTab(friend);
          }
        }).error(function(err) {
          next(err);
        });
      }
    });

    function createTab(friend) {
      Tab.create({
        amount: amount,
        split: partySize,
        description: description,
        date: date,
        deadline: deadline,
        tip: tip,
        payment: payment,
        total: total,
        owe: makeCurrency(total / partySize),
        paid: false
      }).success(function(tab) {
        req.user.addTab(tab);
        friend.addDue(tab);
      });
    }

    function makeCurrency(num) {
      return (Math.round(num * 100) / 100).toFixed(2);
    }

    var verb = ' added to ';
    var last = '';
    if (partySize > 1) {
      verb = ' split between ';
      if (partySize > 2) last = ',';
      last += ' and ' + names.splice(-1);
    }
    req.flash('success', 'Tab for $' + total + verb + names.join(', ') + last + '!');
    return res.redirect('/user/' + req.user.uuid);
  });

  require('./user-auth')(app, passport);
  require('./base')(app);
};
