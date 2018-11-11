const { assert } = require('chai')
, fs = require('fs')
, path = require('path')
, { DirectoryWithFiles, PlaylistMaker } = require('../lib/PlaylistMaker');



describe('PlaylistMaker', () => {
  it('should be able to grab files recursively', async function() {
    this.timeout(10000);

    const plm = new PlaylistMaker(path.join(__dirname, '../'), /\.js$/i);

    const list = await plm.directoriesWithPlayableTracks(plm.directory);

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
});