# Playlist Maker
Create playlists from files within directories, even recursively.

|Version|Coverage|Master|
|:-|:-|:-|
|[![Current Version](https://img.shields.io/npm/v/sh.playlist-maker.svg)](https://www.npmjs.com/package/sh.playlist-maker)|[![Coverage Status](https://coveralls.io/repos/github/MrShoenel/playlist-maker/badge.svg?branch=master)](https://coveralls.io/github/MrShoenel/playlist-maker?branch=master)|[![Build Status](https://api.travis-ci.org/MrShoenel/orchestration-tools.svg?branch=master)](https://travis-ci.org/MrShoenel/orchestration-tools)|


## Install from npm 
This package can be installed using the following command: `npm install sh.playlist-maker`.

## Usage (CLI)
There is a commandline-tool that uses all the features of the playlist maker. Also, the package itself exports all classes and types to use in your own application.

<pre>node ./cli/cli.js --help
  Usage: cli [options]

  The PlaylistMaker is a small application that can create playlists of files within a directory.

  Options:
    -v, --version                       output the version number
    -e, --extensions [extensions]       Optional. A pipe-separated list of extensions of
                                        files to include.
                                        (default: "wav|mp3|m4a|ogg|aac|mka|webm")
    -f, --files [files]                 Optional. If present, randomizes each folder's files.
                                        (default: false)
    -d, --dirs [dirs]                   Optional. If present, randomizes all found folders,
                                        but not their files. (default: false)
    -s, --shift [shift]                 Optional. If present, randomly shifts the resulting
                                        playlist by the amount of files specified. (default: 0)
    -n, --non-recursive [nonRecursive]  Optional. If present, will not work recursively.
                                        (default: false)
    -h, --help                          output usage information
</pre>
