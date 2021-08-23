/* .ENV Settings */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = {
  redis: {
    option: {
      port: 6379
    }
  },
  sequelize: {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    options: {
      host: process.env.DB_HOST,
      dialect: process.env.DB_VENDOR,
      socketPath: process.env.MYSQL_SOCK || '/var/run/mysqld/mysqld.sock'
    }
  }
}
module.exports = db;
