'use strict';

var Assert              = require('assert'),
    Chalk               = require('chalk'),
    FileSystem          = require('fs'),
    Path                = require('path'),
    GulpScssLint        = require('gulp-scss-lint'),
    GulpScssLintStylish = require('./index.js'),
    GulpUtil            = require('gulp-util');

////////////////////////////////////////////////////////////////////////////////

function getFile($file)
{
    $file = Path.resolve(__dirname, './'+ $file);
    $file = new GulpUtil.File(
    {
        'cwd':      Path.resolve(__dirname, '../'),
        'base':     __dirname,
        'path':     $file,
        'contents': FileSystem.readFileSync($file)
    });

    return $file;
}

//------------------------------------------------------------------------------

it('should be used by gulp-scss-lint', function()
{
    Assert(true);
});
