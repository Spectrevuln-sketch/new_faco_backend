/* Setup Redis */
var configDB = require('../config/db');
const redis = require("redis");
const redisClient = redis.createClient(configDB.redis.option);
/* End Setup Redis */

exports.redisGet = async (key) => {
  redisClient.get(key, (getError, result) => {
    var data = result
    return data;
  })
}

exports.redisSet = async (key, val) => {
  return redisClient.set(key, val)
}