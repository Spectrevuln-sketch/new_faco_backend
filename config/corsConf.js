/* .ENV Settings */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const corsConf = {
  option: {
    origin: `${process.env.ALLOWED_CLIENT1}`,
    credentials: true
  }
}

module.exports = corsConf;