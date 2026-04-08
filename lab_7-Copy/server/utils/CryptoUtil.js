const crypto = require('crypto');
const CryptoUtil = {
  md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
  }
};
module.exports = CryptoUtil;