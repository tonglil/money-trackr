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
        logging: console.log,
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
  }
};
