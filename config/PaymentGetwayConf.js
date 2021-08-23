/* .ENV Settings */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const PaymentGetway = {
  tripay: {
    api_key: process.env.TRIPAY_KEY || 'DEV-IBGCFlEReuYRUBOkUK7RV52F9MUy6iv9aqO6Bs52',
    pay_code: process.env.CODE_VA,
    signature: {
      private_key: process.env.TRIPAY_PRIVATE_KEY || 'LydAD-QVeVH-umObE-oWCF1-YGJGI',
      kode_merchant: process.env.TRIPAY_KODE_MERCHANT || 'T5382',

    },
    url_endpoint: {
      get_list_pay: 'https://tripay.co.id/api-sandbox/merchant/payment-channel',
      get_payment_insturction: 'https://tripay.co.id/api-sandbox/payment/instruction',
      post_payment_send: 'https://tripay.co.id/api-sandbox/transaction/create',

    },
    require_url_payment: {
      callback_url: '',
      return_url: process.env.TRIPAY_REDIRECTED || 'http://localhost:5123/dompetKu'
    }

  }
}

module.exports = PaymentGetway;
