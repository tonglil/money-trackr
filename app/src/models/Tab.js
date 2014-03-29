/*
 *Defines the model for a tab
 */

module.exports = function(DB, Type) {
  var Tab = DB.define('Tab', {
    amount: {
      type: Type.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    description: {
      type: Type.STRING,
      allowNull: true,
      validate: {
        notEmpty: true
      }
    },
    date: {
      type: Type.DATE,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        isDate: true
      }
    },
    deadline: {
      type: Type.DATE,
      allowNull: true,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    tip: {
      type: Type.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: true
      }
    },
    payment: {
      type: Type.STRING,
      allowNull: true,
      validate: {
        notEmpty: true
      }
    },
    total: {
      type: Type.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    paid: {
      type: Type.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    classMethods: {
    },
    instanceMethods: {
    }
  });

  return Tab;
};
