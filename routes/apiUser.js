var express = require('express');
var router = express.Router();
const UserController = require('../controllers/UserController');
const PaymentController = require('../controllers/PaymentController');
var corsConfig = require('../config/corsConf');
var cors = require('cors')
var Validate = require('../config/validation');
//============================ Request API For User ===============================
/* Register user */
router.post('/create_user', Validate.validate('user_register'), UserController.RegisterNewUser);
/* End Register user */
/* Login User */
/* End Login User */
router.post('/login_auth', cors(corsConfig), Validate.validate('user_login'), UserController.Login);
/* get Current User Data */
router.get('/current_user', cors(corsConfig), UserController.GetCurrentUser);
/* End get Current User Data */
/* Logout User */
router.get('/logout_auth', cors(corsConfig), UserController.Logout);
/* End Logout User */
/* Logout User */
router.post('/update_rekening', cors(corsConfig), UserController.UpdateRekening);
/* End Logout User */
/* Logout User */
router.post('/update_password', cors(corsConfig), Validate.validate('edit_password'), UserController.EditPassword);
/* End Logout User */
/* update sandi bank */
router.post('/update_sandi_bank', cors(corsConfig), UserController.EditPasswordBank);
/* End sandi bank */
//============================ Request API payment For User ===============================
/* get All list of bank */
router.get('/getListBank', cors(corsConfig), PaymentController.getBankList);
/* End get All list of bank */

//============================ User Data ===============================
/* Get Current Data Payment  */
router.get('/currentUserPay', cors(corsConfig), UserController.GetDataTopup)
/* End Get Current Data Payment  */
/* Kurangi Pendapatan */
router.post('/kurangiPendapatan', cors(corsConfig), UserController.KurangiPendapatan);
/* End Kurangi Pendapatan */
//============================ Task API ===============================
/* Added New Task For Current User */
router.post('/addNewTask', cors(corsConfig), UserController.AddedTask);
/* End Added New Task For Current User */
/* insert task to database */
router.post('/insertTask', cors(corsConfig), UserController.InsertTask);
/* End insert task to database */
/* Get My Task */
router.get('/get_my_task', cors(corsConfig), UserController.GetMyCurrentTask)
/* End Get My Task */


module.exports = router;
