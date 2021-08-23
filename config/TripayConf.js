var PaymentConfig = require('./PaymentGetwayConf');
const crypto = require('crypto')

exports.Signature = (amount, merchant_ref) => {
  /* Generatate signature */
  var signature = crypto.createHmac('sha256', `${PaymentConfig.tripay.signature.private_key}`).update(`${PaymentConfig.tripay.signature.kode_merchant}${merchant_ref}${amount}`).digest('hex');
  /* End Generatate signature */
  return signature;

}
exports.SignatureCallback = (data) => {
  var SignatureAdmin = crypto.createHmac('sha256', `${PaymentConfig.tripay.signature.private_key}`).update(`${data}`).digest("hex");
  return SignatureAdmin
}