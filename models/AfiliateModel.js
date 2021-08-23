const MysqlDB = require('../config/mysql');
const Sequelize = require('sequelize');
const User = require('./userModel')
var affiliasiModels = MysqlDB.define('affiliate_user', {
  kode_akun: {
    type: Sequelize.STRING
  },
  reward_ajak: {
    type: Sequelize.STRING
  },
  guest_kode: {
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
User.hasMany(affiliasiModels, { foreignKey: "kode_akun" });
affiliasiModels.belongsTo(User, { foreignKey: "kode_akun", targetKey: "kode_akun" });

module.exports = affiliasiModels;