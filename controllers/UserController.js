var UserData = require('../models/userModel');
var PaymentModel = require('../models/paymentUserModel');
var TaskModel = require('../models/taskModel');
var Mytask = require('../models/myTaskModel');
var Affiliasi = require('../models/AfiliateModel');
const { validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var client = require('../config/redisConf');
var jwt = require('jsonwebtoken');
var fs = require('fs');
const Str = require('@supercharge/strings');
/* Setup Redis */
var configDB = require('../config/db');
const redis = require("redis");
const { Sequelize, DATE } = require('sequelize');
const clientGet = redis.createClient(configDB.redis.option);
/* End Setup Redis */
var moment = require('moment');
const passport = require('passport');



/* Register New User  */
exports.RegisterNewUser = async (req, res, next) => {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    const alert = errors.array();
    res.send({ errMsg: alert, status: 404 }).status(404);
  } else {
    const date = new DATE();
    const no_tlp = req.body.no_tlp;
    const kode_akun = req.body.kode_akun;
    const password = req.body.password1;
    const hashPassword = bcrypt.hashSync(password, 10);
    const generateKodeUser = Str.random(10)
    const CreateUser = new UserData({
      no_tlp,
      kode_akun: generateKodeUser,
      password: hashPassword,
      member: 0

    })
    await CreateUser.save()
      .then(results => {
        const AffiliateUser = new Affiliasi({
          kode_akun: results.kode_akun,
          guest_kode: generateKodeUser,
          reward_ajak: 0
        })
        AffiliateUser.save().then(result => {
          res.status(200).send({ message: 'Akun Anda Telah Berhasil Dibuat', status: 200 })
        }).catch(err => {
          console.log(err)
          res.status(401).send({ message: `Error Internal ${err.message}`, status: 500 })
        })
      }).catch(err => {
        res.status(500).send({ message: `Error Internal ${err.message}`, status: 500 })
      })

  }
}
/* End Register New User  */

/* user Login */
exports.Login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err
    if (info) res.send({ message: info.message, status: 400 })
    if (!user) res.send({ message: "User Tidak Ditemukan !", status: 403 })
    else {
      req.logIn(user, (err) => {
        if (err) throw err
        if (user) {
          req.session.user = user
          client.redisSet('userID', user.dataValues.id)
          var privateKey = fs.readFileSync('private.key');
          const tokenUser = jwt.sign(user.dataValues, privateKey, { algorithm: 'HS384' });
          res.status(200).send({ status: 200, message: "User Authenticated !", tokenUser })
        } else {
          res.status(500).send({ status: 500, message: "tidak ada session" })
        }
      });
    }
  })(req, res, next);
}



exports.EditPasswordBank = async (req, res) => {
  try {
    console.log(req.body)
    clientGet.get('userID', (err, id) => {

      UserData.update({
        password_bank: req.body.sandi_bank
      }, {
        where: {
          id: id
        }
      }).then(result => {
        res.status(200).send({ message: 'Data Berhasil Di tambah', status: 200 });
      }).catch(err => {
        res.status(500).send({ message: 'Data Berhasil Di tambah', status: 500 });
      })
    })
  } catch (err) {
    console.error(err)
  }
}



/* Logout User */
exports.Logout = async (req, res) => {
  try {
    if (req.user !== '') {
      req.logout();
      res.status(200).send({ message: 'Anda Telah Berhasil Logout Akun', status: 200 })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: `Error With ${err}`, status: 500 })
  }
}
/* End Logout User */


//===================================== Miliku Page User Controllers ============================================

/* Get Data Current User Topup */
exports.GetDataTopup = async (req, res) => {
  clientGet.get('userID', (err, id) => {
    PaymentModel.findAll({
      where: {
        user_id: id
      },

    }).then(result => {
      if (result === null) {
        res.json({ status: false })
      } else {
        res.status(200).send({ result, status: 200 })
      }
    }).catch(err => {
      res.status(500).send({ message: `Internal Server Error ${err.message}` })
    })


  })
}
/* End Get Data Current User Topup */

/* Get Current User */
exports.GetCurrentUser = async (req, res) => {
  clientGet.get('userID', (err, id) => {
    UserData.findOne({
      where: {
        id: id
      }
    }).then(data_user => {
      res.status(200).json({ data_user, status: 200 })
    }).catch(err => {
      console.error(err)
    })
  })
}
/*End Get Current User */

/* UpdateRekening */
exports.UpdateRekening = async (req, res) => {
  console.log(req.body)
  const { rekening, namabank } = req.body
  clientGet.get('userID', (err, id) => {
    const user = req.user
    UserData.update({
      rekening,
      namabank
    }, {
      where: {
        id: id
      }
    }).then(result => {
      res.status(200).send({ message: `Berhasil Menambahkan Akun Bank`, user: user, status: 200 });
    }).catch(err => {
      res.status(400).send({ message: `Error : ${err}`, status: 400 });
    })
  })
}
/* End UpdateRekening */
/* Update Password */
exports.EditPassword = async (req, res) => {
  const { sandi_lama, sandi_baru, konfrim_sandi } = req.body
  console.log(req.body)
  const hashPassword = bcrypt.hashSync(sandi_baru, 10);
  clientGet.get('userID', (err, id) => {
    const User = UserData.findOne({
      where: {
        id: id
      }
    }).then(resutls => {

      if (sandi_baru != konfrim_sandi) {
        res.send(400).send({ message: 'Password Tidak Sama ', status: 400 })
      }
      bcrypt.compare(sandi_lama, resutls.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          console.log('ok')
          UserData.update({
            password: hashPassword
          }, {
            where: {
              id: id
            }
          }).then(result => {
            res.send({ message: 'Password Berhasil Diubah', status: 200 })
          }).catch(err => {

            res.send({ message: `Error${err.message}`, status: 500 })
          })
        } else {
          res.send({ message: 'Password Lama Salah', status: 400 })
        }
      })
    })
  })
}
/* End Update Password */


//===================================== End Miliku Page User Controllers ============================================
//===================================== VIP Page ============================================
/* Kurangi Amount */
exports.KurangiPendapatan = async (req, res) => {
  const { vip_card_price, pendapatan_user } = req.body
  clientGet.get('userID', (err, id) => {
    if (err) throw err
    if (id) {
      if (pendapatan_user !== null || pendapatan_user !== undefined) {
        const AmountRetrive = Math.floor(pendapatan_user - vip_card_price)
        UserData.update({
          pendapatan: parseInt(AmountRetrive)
        }, {
          where: {
            id: id
          }
        }).then(results => {
          res.status(200).send({ message: `Anda Telah Menjadi Member VIP`, status: 200 });
        }).catch(err => {
          console.error(err)
        })
      } else {
        res.status(400).send({ message: 'Anda Tidak Mempunyai Cukup Saldo', status: 400 });
      }
    }
  })
}
/* End Kurangi Amount */


//===================================== End VIP Page ============================================
//===================================== Task Page ============================================
/* AddNew Task Current User */
exports.AddedTask = async (req, res) => {

  const BeforeAction = await TaskModel.findAll({
    attributes: [
      'user_id',
      [Sequelize.fn('sum', Sequelize.col('pengambilan_task')), 'total_amount'],
    ],
    group: ['user_id']
  })
  clientGet.get('userID', (err, id) => {
    TaskModel.findAll({
      where: {
        'user_id': id,
        createdAt: {
          $gt: moment().subtract(1, 'days').toDate()
        }
      }
    }).then(result => {
      var dataResult = parseInt(result)
      if (isNaN(dataResult) === false) {
        // delete Data Here
        TaskModel.destroy({
          where: { user_id: id }
        }).then(removed => {
          if (removed.id === undefined)
            res.status(404).send({ message: `ID Is Not Defind` })
          else
            res.status(200).send({ message: `Success Delete Data !`, data: removed })
        })
      } else if (isNaN(dataResult) === true) {
        res.json(BeforeAction)
      }
    })
  })


}
/* End AddNew Task Current User */
/* insert task to database */
exports.InsertTask = async (req, res) => {
  const { task_count, code_task } = req.body
  clientGet.get('userID', (err, id) => {
    console.log(id)
    if (id) {
      const User = UserData.findOne({ where: { id: id } })
      const Task = new TaskModel({
        user_id: id,
        pengambilan_task: task_count,
        member: User.member === null ? 0 : User.member,
        unique_code: code_task
      })
      Task.save()
        .then(result => {
          res.status(200).send({ result, message: `Telah Mengambil Task`, status: 200 });
          const createNewTask = new Mytask({
            user_id: id,
            unique_code: code_task,
            member: User.member === null ? 0 : User.member,
          })
          createNewTask.save()
            .then(result => {
              res.status(200).send({ result, message: `Telah Mengambil Task`, status: 200 });
            }).catch(err => {
              console.error(err)
              res.status(400).send({ message: 'Silahkan Memulai Task', status: 400 });
            })
        }).catch(err => {
          console.error(err)
          res.status(400).send({ message: 'Silahkan Memulai Task', status: 400 });
        })
    }
  })
}
/* End insert task to database */

/* Get My current task */
exports.GetMyCurrentTask = async (req, res) => {
  clientGet.get('userID', (err, id) => {
    Mytask.findAll({
      where: {
        user_id: id
      }
    }).then(results => {
      console.log(results)
      res.status(200).send({ data: results, message: 'Success', status: 200 });
    }).catch(err => {
      console.log(err)
      res.status(400).send({ message: `Error: ${err.message}`, status: 400 });
    })
  })
}
/* End Get My current task */

//===================================== End Task Page ============================================











//===================================== End Dashboard User Controllers ============================================

