const { validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var PaymentConfig = require('../config/PaymentGetwayConf');
const axios = require('axios');
/* Setup Redis */
var configDB = require('../config/db');
const redis = require("redis");
const client = redis.createClient(configDB.redis.option);
/* End Setup Redis */
const convertRupiah = require('rupiah-format')
const Tripay = require('../config/TripayConf');
/* Call Model */
const PaymentModel = require('../models/paymentUserModel');
const userModels = require('../models/userModel');


/* Get List Of Bank  */
exports.getBankList = async (req, res) => {
  axios.get(PaymentConfig.tripay.url_endpoint.get_list_pay, {
    headers: {
      'Authorization': 'Bearer ' + PaymentConfig.tripay.api_key
    }
  }).then(results => {
    client.get('userTlp', (err, result) => {
      client.get('AuthToken', (err, token) => {
        const ListOfBank = results.data.data
        var date = new Date();
        var getTime = parseInt(date.getSeconds())
        /* Siapkan Data Untuk generate Signature */
        const generateRef = `FACO-INV0${token.length}${getTime}_${result}`
        const cost = req.query.cost
        /* End Siapkan Data Untuk generate Signature */
        /* Generatate signature */
        const SignatureUser = Tripay.Signature(cost, generateRef)
        /* End Generatate signature */
        res.render('user/checkout.ejs',
          {
            title: "Top Up",
            ListBank: ListOfBank,
            cost: convertRupiah.convert(cost),
            amount: cost,
            user: result,
            token,
            refrensi: generateRef,
            signature: SignatureUser
          })
      })
    })
  }).catch(err => {
    console.error(err);
  })
}
/* End Get List Of Bank  */

exports.instruksiPembayaran = async (req, res) => {
  const { code_bank } = req.body;
  const pay_code = PaymentConfig.tripay.pay_code;

  axios.get(PaymentConfig.tripay.url_endpoint.get_payment_insturction + `?code=${code_bank}&pay_code=${pay_code}`, {
    headers: {
      'Authorization': 'Bearer ' + PaymentConfig.tripay.api_key
    }
  }).then((result) => {
    res.json({ data: result.data.data, bankCode: code_bank, status: 200 })
  }).catch(err => {
    res.status(400).send({ message: `${err}`, status: 400 })
  })
}

/**Send TopUp Customer */
exports.sendDataCustomer = async (req, res) => {
  var { merchant_ref, customer_phone, customer_email, customer_name, code_bank } = req.body
  var amount = parseInt(req.body.amount)
  var expiry = parseInt(Math.floor(new Date() / 1000) + (24 * 60 * 60));
  const SignatureUser = Tripay.Signature(amount, merchant_ref)
  var payload = {
    'method': code_bank,
    'merchant_ref': merchant_ref,
    'amount': amount,
    'customer_name': customer_name,
    'customer_email': customer_email,
    'customer_phone': customer_phone,
    'order_items': [
      {
        'sku': 'REGULER_TOPUP_FACO',
        'name': 'Top Up Reguler',
        'price': amount,
        'quantity': 1
      }
    ],
    'return_url': PaymentConfig.tripay.require_url_payment.return_url,
    'expired_time': expiry,
    'signature': SignatureUser
  }

  axios.post(PaymentConfig.tripay.url_endpoint.post_payment_send, payload, {
    headers: {
      'Authorization': 'Bearer ' + PaymentConfig.tripay.api_key
    }
  }).then(results => {
    var result_payment = results.data.data;
    client.get('userID', (err, id) => {

      /** Update To Data Base */
      const Payment = new PaymentModel({
        user_id: parseInt(id),
        topup_cost: result_payment.amount,
        merchant_ref: result_payment.merchant_ref,
        payment_method: result_payment.payment_method,
        pay_code: result_payment.pay_code,
        amount_received: result_payment.amount_received,
        total_fee: result_payment.total_fee,
        customer_name: result_payment.customer_name,
        customer_email: result_payment.customer_email,
        customer_phone: result_payment.customer_phone,
        customer_signature: SignatureUser,
        status_payment: result_payment.status
      })
      Payment.save()
        .then(results => {
          res.writeHead(301,
            { Location: result_payment.return_url }
          );
          res.end();
        }).catch(err => {
          res.status(400).sand({ message: err.message, status: 400 })
        })

    })
  }).catch(err => {
    console.log(err)
  })
}
/**End Send TopUp Customer */


/* url Callback */
exports.PaymentCallBack = async (req, res) => {
  var dataTopup = req.body;
  console.log(dataTopup)
  // const AdminSign = Tripay.SignatureCallback(dataTopup);
  if (dataTopup.status === "PAID") {
    await PaymentModel.update({
      status_payment: dataTopup.status,
      topup_cost: dataTopup.total_amount,
      amount_received: dataTopup.amount_received,
      total_fee: dataTopup.total_fee,
    }, {
      where: {
        merchant_ref: dataTopup.merchant_ref
      }
    })

    const pay_data = await PaymentModel.findOne({ where: { merchant_ref: dataTopup.merchant_ref } })
    const User = await userModels.findOne({ where: { id: pay_data.user_id } })
    var pendapatan_user = User.pendapatan === null ? 0 : User.pendapatan
    const sumAmount = Math.floor(parseInt(dataTopup.amount_received) + parseInt(pendapatan_user))
    console.log(sumAmount)

    await userModels.update({
      pendapatan: sumAmount,
    }, {
      where: {
        id: pay_data.user_id
      }
    }).then(results => {
      console.log('ok')
      res.status(200).send({ message: 'Aggrement Send', callbackData: dataTopup, status: 200 })
    }).catch(err => {
      console.log(err)
      res.status(403).send({ message: err })
    })

  } else if (dataTopup.status === 'EXPIRED') {
    await PaymentModel.update({
      status_payment: dataTopup.status,
      topup_cost: dataTopup.total_amount,
      amount_received: dataTopup.amount_received,
      total_fee: dataTopup.total_fee,
    }, {
      where: {
        merchant_ref: dataTopup.merchant_ref
      }
    }).then(result => {
      res.status(200).send({ message: 'Top up Telah Expired', callbackData: dataTopup })
    }).catch(err => {
      res.status(500).send({ message: `Top up Telah Expired${err}`, callbackData: dataTopup })
    })
  } else if (dataTopup.status === 'FAILED') {
    await PaymentModel.update({
      status_payment: dataTopup.status,
      topup_cost: dataTopup.total_amount,
      amount_received: dataTopup.amount_received,
      total_fee: dataTopup.total_fee,
    }, {
      where: {
        merchant_ref: dataTopup.merchant_ref
      }
    }).then(result => {
      res.status(200).send({ message: 'Gagal Topup', callbackData: dataTopup })
    }).catch(err => {
      res.status(500).send({ message: `Gagal Topup Dengan Error${err}`, callbackData: dataTopup })
    })
  }
}
/* End url Callback */