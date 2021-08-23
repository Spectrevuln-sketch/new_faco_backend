const MysqlDB = require('../config/mysql');
const Sequelize = require('sequelize');
const User = require('./userModel');

var PendapatanModel = MysqlDB.define('pendapatan_data', {
  user_id: {
    type: Sequelize.INTEGER
  },
  amount_today: {
    type: Sequelize.INTEGER
  },
  amount_lastday: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  amount_weekly: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  amount_month: {
    type: Sequelize.INTEGER,
    allowNull: false
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
User.hasOne(PendapatanModel);
PendapatanModel.belongsTo(User);

module.exports = PendapatanModel;