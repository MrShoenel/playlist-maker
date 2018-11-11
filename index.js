const { PlaylistMaker, DirectoryWithFiles } = require('./lib/PlaylistMaker')
, { CryptRNG } = require('./lib/CryptoRNG');


console.log(CryptRNG.nextProbability);

module.exports = Object.freeze({
  PlaylistMaker, DirectoryWithFiles,
  CryptRNG
});
