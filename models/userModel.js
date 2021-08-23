const MysqlDB = require('../config/mysql');
const Sequelize = require('sequelize');

var userModels = MysqlDB.define('users', {
  no_tlp: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  pendapatan: {
    type: Sequelize.INTEGER,
  },
  member: {
    type: Sequelize.STRING
  },
  kode_akun: {
    type: Sequelize.STRING
  },
  rekening: {
    type: Sequelize.STRING
  },
  namabank: {
    type: Sequelize.STRING
  },
  password_bank: {
    type: Sequelize.STRING
  },
  updatedAt: {
    type: Sequelize.DATE
  },
  createdAt: {
    type: Sequelize.DATE
  }
},
  {
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    allowNull: true
  }
)


module.exports = userModels;