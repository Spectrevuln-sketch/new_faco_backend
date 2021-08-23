var express = require('express');
var router = express.Router();
const PaymentController = require('../controllers/PaymentController');
var corsConfig = require('../config/corsConf');
var cors = require('cors')
var Validate = require('../config/validation');
//============================ Request API For User ===============================
/* get All list of bank */
router.post('/TopUp', cors(corsConfig), PaymentController.sendDataCustomer);
/* End get All list of bank */
/* view Checkout */
router.get('/paymentCheckOut', cors(corsConfig), PaymentController.getBankList);
/* End view Checkout */
/* instruksi Pembayaran */
router.post('/instruksiPembayaran', cors(corsConfig), PaymentController.instruksiPembayaran);
/* instruksi Pembayaran */
/* Callback Tripay Endpoint */
router.post(process.env.TRIPAY_CALLBACK_URL, cors(corsConfig), PaymentController.PaymentCallBack)
/* End Callback Tripay Endpoint */



module.exports = router;