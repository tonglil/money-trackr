/*
 *Defines the model for a user
 */

var guid = require('node-uuid');

module.exports = function(DB, Type) {
  var User = DB.define('User', {
    uuid: {
      type: Type.UUID,
      primaryKey: true,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    fbid: {
      type: Type.STRING,
      unique: true,
      allowNull: true,
      validate: {
        notEmpty: true
      }
    },
    token: {
      type: Type.STRING,
      allowNull: true,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: Type.STRING,
      unique: true,
      allowNull: true,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    registered: {
      //TODO: can infer this field from email or another field
      type: Type.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    firstName: {
      type: Type.STRING,
      //allowNull: false,
      //validate: {
        //notNull: true,
        //notEmpty: true
      //}
    },
    lastName: {
      type: Type.STRING,
      //allowNull: false,
      //validate: {
        //notNull: true,
        //notEmpty: true
      //}
    },
    friends: {
      type: Type.TEXT,
    },
  }, {
    associate: function(models) {
      User.hasMany(models.Tab, {
        as: 'Tabs',
        foreignKey: 'userId'
      });
      User.hasMany(models.Tab, {
        as: 'Dues',
        foreignKey: 'friendId'
      });
    },
    classMethods: {
      register: function(accessToken, profile, done) {
        this.create({
          uuid: guid.v4(),
          fbid: profile.id,
          token: accessToken,
          email: profile.emails[0].value,
          registered: true,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          friends: null
        }).success(function(user) {
          return done(null, user);
        }).error(function(err) {
          return done(err);
        });
      },
      fill: function(id, name, done) {
        this.create({
          uuid: guid.v4(),
          fbid: id,
          token: null,
          email: null,
          registered: false,
          firstName: name,
          lastName: null,
          friends: null
        }).success(function(user) {
          return done(null, user);
        }).error(function(err) {
          return done(err);
        });
      }
    },
    instanceMethods: {
    }
  });

  return User;
};
