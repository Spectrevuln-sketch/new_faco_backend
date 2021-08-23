const MysqlDB = require('../config/mysql');
const Sequelize = require('sequelize');
const User = require('./userModel');
const MyTask = require('./myTaskModel.js');

var TaskModel = MysqlDB.define('task_user', {
  user_id: {
    type: Sequelize.INTEGER
  },
  pengambilan_task: {
    type: Sequelize.INTEGER
  },
  unique_code: {
    type: Sequelize.INTEGER
  },
  member: {
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
User.hasMany(TaskModel);
TaskModel.belongsTo(User);

module.exports = TaskModel;