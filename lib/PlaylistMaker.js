const fs = require('fs')
, path = require('path')
, { CryptRNG } = require('./CryptoRNG');



class DirectoryWithFiles {
  /**
   * @param {string} dirAbsPath the absolute path to the directory.
   * @param {Array.<string>} files files that are directly in this directory
   * (i.e. not nested and without path).
   */
  constructor(dirAbsPath, files = []) {
    this.dirAbsPath = dirAbsPath;
    this.files = files;
  };
};


class PlaylistMaker {
  /**
   * @param {string} directory Absolute path to a directory.
   * @param {RegExp} regexFiles A regular expression to match candidate files.
   * @param {boolean} [randomizeDirs] Optional. Defaults to false. If true, will randomize
   * the list of found directories.
   * @param {boolean} [randomizeFiles] Optional. Defaults to false. If true, will randomize
   * the files in each directory.
   * @param {number} [shiftBy] Optional. Defaults to 0. An offset to shift the entire resulting
   * playlist by. Items shifted from the end are prepended to the begin.
   * @param {boolean} [noRecurse] Optional. Defaults to false. If true, will (recursively) ignore
   * any directories within the given directory.
   */
  constructor(directory, regexFiles, randomizeDirs = false, randomizeFiles = false, shiftBy = 0, noRecurse = false) {
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
    const dirs = await this.directoriesWithPlayableTracks(this.directory);

    if (this.randomizeDirs) {
      dirs.sort(() => CryptRNG.nextInt32 - CryptRNG.nextInt32);
    }
    if (this.randomizeFiles) {
      dirs.forEach(dir => {
        dir.files.sort(() => CryptRNG.nextInt32 - CryptRNG.nextInt32);
      });
    }

    /** @type {Array.<string>} */
    const listWithAbsPaths = [];
    dirs.forEach(dir => {
      dir.files.forEach(file => {
        listWithAbsPaths.push(path.join(dir.dirAbsPath, file));
      });
    });

    if (this.shiftBy > 0) {
      listWithAbsPaths.push(...listWithAbsPaths.splice(0, this.shiftBy));
    }

    return listWithAbsPaths;
  };

  /**
   * 
   * @param {string} startDir
   * @returns {Promise.<Array.<DirectoryWithFiles>>}
   */
  async directoriesWithPlayableTracks(startDir) {
    /** @type {Promise.<Array.<DirectoryWithFiles>>} */
    const prom = new Promise((resolve, reject) => {
      fs.readdir(startDir, async(err, files) => {
        if (err) {
          reject(err);
          return;
        }

        const dwf = [new DirectoryWithFiles(startDir)];

        for (const file of files) {
          const absPath = path.join(startDir, file)
          , stat = fs.lstatSync(absPath);

          if (stat.isDirectory()) {
            dwf.push(...await this.directoriesWithPlayableTracks(path.join(absPath)));

          } else if (stat.isFile()) {
            if (this.regexFiles.test(file)) {
              dwf[0].files.push(file);
            }
          }
        }

        resolve(dwf);
      });
    });

    return (await prom).filter(dwf => dwf.files.length > 0);
  };
};

module.exports = Object.freeze({
  DirectoryWithFiles,
  PlaylistMaker
});
