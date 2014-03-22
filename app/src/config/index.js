/*
 *Application settings
 */

//TODO: put passwords in another file

module.exports = {
  env: (process.env.NODE_ENV ? process.env.NODE_ENV : 'development'),
  app: {
    port: 3000
  },
  database: {
    name: 'money_trackr',
    development: {
      username: 'root',
      password: 'root',
    },
    production: {
      username: 'root',
      password: 'root',
    },
    options: {
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
    }
  }
};
