const crypto = require('crypto');


class CryptRNG {
  static get nextInt32() {
    crypto.randomBytes(4).readInt32BE(0);
  };

  static get nextProbability() {
    return crypto.randomBytes(4).readUInt32BE(0) / (2**32 - 1);
  };
};


module.exports = Object.freeze({
  CryptRNG
});
