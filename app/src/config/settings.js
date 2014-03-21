/*
 *Development config
 */

module.exports = {
  app: {
    port: 3000
  },
  database: {
    name: 'you_owe_me',
    username: 'root',
    password: 'root',
    options: {
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
      define: {
        //freezeTableName: true,
      },
      pool: {
        maxConnections: 10,
        maxIdleTime: 30
      },
      dialect: 'mysql'
    }
  }
};
