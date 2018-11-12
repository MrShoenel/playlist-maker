const { assert } = require('chai')
, fs = require('fs')
, os = require('os')
, path = require('path')
, { DirectoryWithFiles, PlaylistMaker } = require('../lib/PlaylistMaker')
, { CryptRNG } = require('../lib/CryptoRNG')
, { assertThrowsAsync } = require('sh.orchestration-tools');



describe('PlaylistMaker', () => {
  it('should throw if given invalid arguments', async() => {
    await assertThrowsAsync(async() => {
      const plm = new PlaylistMaker(path.join(os.tmpdir(), `./random-temp-dir_${(+new Date)}`));
      await plm._directoriesWithPlayableTracks(plm.directory);
    });
  });

  it('should be able to grab files recursively', async function() {
    this.timeout(10000);

    const plm = new PlaylistMaker(path.join(__dirname, '../'), /\.js$/i);

    const list = await plm._directoriesWithPlayableTracks(plm.directory);

    for (const dwf of list) {
      const lstat = fs.lstatSync(dwf.dirAbsPath);
      assert.isTrue(lstat.isDirectory());

      for (const f of dwf.files) {
        const fLstat = fs.lstatSync(path.join(dwf.dirAbsPath, f));
        assert.isTrue(fLstat.isFile());
        assert.isTrue(f.toLocaleLowerCase().endsWith('.js'));
      }
    }

    const stringList = await plm.makeList();
    stringList.forEach(str => assert.isTrue(typeof str === 'string' && str.length > 0));
  });

  it('should randomize files within folders', async() => {
    const plm = new PlaylistMaker(path.join(__dirname, '../'), /\.js$/i, false, true);
    const list = await plm._directoriesWithPlayableTracks(plm.directory);
    const dirOrg = list[list.findIndex(d => d.files.length > 10)];

    const filesSorted = dirOrg.files.slice(0);

    // Let's employ the same randomize method
    dirOrg.files.sort(() => CryptRNG.nextInt32);

    assert.notEqual(dirOrg.files.join(','), filesSorted.join(','));
  });

  it('should properly shift the playlist', async() => {
    const shiftBy = 10;
    const plm = new PlaylistMaker(path.join(__dirname, '../'), /\.js$/i);

    const listNoShift = await plm.makeList();
    plm.shiftBy = shiftBy;
    const shiftedList = await plm.makeList();

    assert.strictEqual(listNoShift.length, shiftedList.length);

    for (let i = 0; i < listNoShift.length - shiftBy; i++) {
      assert.strictEqual(listNoShift[i + shiftBy], shiftedList[i]);
    }

    const shiftedEnd = shiftedList.slice(shiftedList.length - shiftBy);

    for (let i = 0; i < shiftedEnd.length; i++) {
      assert.strictEqual(listNoShift[i], shiftedEnd[i]);
    }
  });

  it('should output the same files, just randomized', async() => {
    const plm = new PlaylistMaker(path.join(__dirname, '../'), /\.js$/i);

    const listNoRandom = new Set(await plm.makeList());
    plm.randomizeFiles = true;
    const randomizedList = new Set(await plm.makeList());

    assert.strictEqual(listNoRandom.size, randomizedList.size);

    listNoRandom.forEach(f => {
      assert.isTrue(randomizedList.has(f));
    });
  });

  it('should out randomized directories, but not files', async() => {
    const plm = new PlaylistMaker(path.join(__dirname, '../'), /\.js$/i, true);

    const list = await plm.makeList();
    /** @type {Array.<string>} */
    const dirs = [];
    /** @type {string} */
    let currentDir = null;

    list.forEach(absFile => {
      const d = path.dirname(absFile).toLocaleLowerCase();
      if (d !== currentDir) {
        dirs.push(d);
        currentDir = d;
      }
    });

    assert.notEqual(dirs.join(','), dirs.sort((a, b) => a.localeCompare(b)).join(','));
  });
});