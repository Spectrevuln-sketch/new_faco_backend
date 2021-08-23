const MysqlDB = require('../config/mysql');
const Sequelize = require('sequelize');
const User = require('./userModel');

var PaymentModel = MysqlDB.define('payment_temp', {
  user_id: {
    type: Sequelize.INTEGER
  },
  topup_cost: {
    type: Sequelize.STRING
  },
  merchant_ref: {
    type: Sequelize.STRING
  },
  payment_method: {
    type: Sequelize.STRING
  },
  pay_code: {
    type: Sequelize.STRING
  },
  amount_received: {
    type: Sequelize.STRING
  },
  total_fee: {
    type: Sequelize.STRING
  },
  customer_name: {
    type: Sequelize.STRING
  },
  customer_email: {
    type: Sequelize.STRING
  },
  customer_phone: {
    type: Sequelize.STRING
  },
  customer_signature: {
    type: Sequelize.STRING
  },
  status_payment: {
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
User.hasMany(PaymentModel);
PaymentModel.belongsTo(User);

module.exports = PaymentModel;