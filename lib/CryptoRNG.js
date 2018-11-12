const crypto = require('crypto');


class CryptRNG {
  /**
   * @returns {number} a signed 32-bit integer.
   */
  static get nextInt32() {
    return crypto.randomBytes(4).readInt32BE(0);
  };

  /**
   * @returns {number} a 32-bit float between [0,1]
   */
  static get nextProbability() {
    return crypto.randomBytes(4).readUInt32BE(0) / (2**32 - 1);
  };
};


module.exports = Object.freeze({
  CryptRNG
});
