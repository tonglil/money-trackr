/*
 *Application settings
 */

//TODO: put passwords in another file

var pw = require('./passwords');

module.exports = {
  env: (process.env.NODE_ENV ? process.env.NODE_ENV : 'development'),
  app: {
    port: 3000
  },
  database: {
    name: 'money_trackr',
    username: pw.db_user,
    password: pw.db_password,
    development: {
        dialect: 'mysql',
        //host: localhost,
        //port: 3306,
        //protocol: 'tcp',
        logging: false,
        maxConcurrentQueries: 100,
        //storage: ':memory:',
        //omitNull: false,
        //native: false,
        //defined: {},
        //syncOnAssociation: true,
        pool: {
          maxConnections: 10,
          maxIdleTime: 30
        },
        define: {
          //freezeTableName: true,
        }
    },
    production: {
        dialect: 'mysql',
        //host: localhost,
        //port: 3306,
        //protocol: 'tcp',
        logging: false,
        maxConcurrentQueries: 100,
        //storage: ':memory:',
        //omitNull: false,
        //native: false,
        //defined: {},
        //syncOnAssociation: true,
        pool: {
          maxConnections: 10,
          maxIdleTime: 30
        },
        define: {
          //freezeTableName: true,
        }
    },
  },
  passport: {
    facebook: {
      development: {
        clientID     : '227765214081308', // App ID
        clientSecret : 'd32105c064d22868c498cd25e34e0fad', // App Secret
        callbackURL  : 'http://localhost:3000/auth/facebook/callback'
      },
      production: {
        clientID     : '227765214081308', // App ID
        clientSecret : 'd32105c064d22868c498cd25e34e0fad', // App Secret
        callbackURL  : 'http://3000.tonyli.ca/auth/facebook/callback'
      }
    }
  }
};
