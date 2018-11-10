const crypto = require('crypto')
, fs = require('fs')
, path = require('path');



class FileOrDir {
  constructor(fullPath, isDir) {
    this.fullPath = fullPath;
    this.isDir = isDir;
  };
};


class PlaylistMaker {
  /**
   * @param {string} directory
   * @param {RegExp} regexFiles
   * @param {boolean} randomizeDirs
   * @param {boolean} randomizeFiles
   * @param {number} [shiftBy]
   * @param {boolean} [noRecurse]
   */
  constructor(directory, regexFiles, randomizeDirs, randomizeFiles, shiftBy = 0, noRecurse = false) {
    this.directory = directory;
    this.regexFiles = regexFiles;
    this.randomizeDirs = randomizeDirs;
    this.randomizeFiles = randomizeFiles;
    this.shiftBy = shiftBy;
    this.noRecurse = noRecurse;
  };

  /**
   * @returns {Promise.<Array.<string>>} An array where each item is a full path
   * to an item on the playlist.
   */
  async makeList() {

  };

  static async walkDirectory(directory) {
    fs.readdir(directory, (err, files) => {

    })
  };
};

module.exports = Object.freeze({
  PlaylistMaker
});
