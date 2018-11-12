const program = require('commander')
, path = require('path')
, fs = require('fs')
, os = require('os')
, { PlaylistMaker } = require('../lib/PlaylistMaker')
, packagePath = path.resolve(path.dirname(__filename), '../package.json')
, package = JSON.parse(fs.readFileSync(packagePath));


const defaultExtensions = 'wav|mp3|m4a|ogg|aac|mka|webm';

/**
 * @param {string} val
 * @returns {boolean}
 */
const parseBool = val => {
  val = `${val}`.trim().toLocaleLowerCase();
  return val === 'true';
};

/**
 * @param {string} val A pipe-separated list of valid extensions.
 * @returns {RegExp} A regular expression that matches all extensions.
 */
const parseExtensions = val => {
  const arr = `${val}`.split('|').map(v => v.trim().toLowerCase());
  if (arr.length === 0) {
    throw new Error(`The value did not yield any extensions: ${val}`);
  }

  return new RegExp(`\\.(${arr.join('|')})$`, 'i');
};


program
  .version(package.version, '-v, --version')
  .description('The PlaylistMaker is a small application that can create playlists of files within a directory.')
  .option('-e, --extensions [extensions]', `Optional. A pipe-separated list of extensions of files to include. Defaults to '${defaultExtensions}'.`, defaultExtensions)
  .option('-f, --files [files]', `Optional. If present, randomizes each folder's files. Defaults to false.`, parseBool, false)
  .option('-d, --dirs [dirs]', `Optional. If present, randomizes all found folders, but not their files. Defaults to false.`, parseBool, false)
  .option('-s, --shift [shift]', `Optional. If present, randomly shifts the resulting playlist by the amount of files specified.`, parseInt, 0)
  .option('-n, --non-recursive [nonRecursive]', `Optional. If present, will not work recursively. Defaults to false.`, parseBool, false)
  .parse(process.argv);

if (program.args.length === 0) {
  console.error('The only required argument is a valid path to a directory containing files or directories with files to create a playlist from.');
  program.outputHelp();
  process.exit(-1);
}


const dirAbsPath = path.isAbsolute(program.args[0]) ? program.args[0] : path.join(process.cwd(), program.args[0])
, plm = new PlaylistMaker(
  dirAbsPath, parseExtensions(program.extensions), !!program.dirs, !!program.files, program.shift, !!program.nonRecursive)
, timeout = setTimeout(()=>{}, 2**30);


(async() => {
  try {
    console.error(`Scanning folder: ${dirAbsPath}`)
    console.log((await plm.makeList()).join(os.EOL));
  } finally {
    clearTimeout(timeout);
  }
})().catch(err => {
  console.error(`An error occurred: ${err}`);
  process.exit(-2);
});
