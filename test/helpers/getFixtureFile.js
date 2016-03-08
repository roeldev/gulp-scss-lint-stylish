/**
 * gulp-scss-lint-stylish | test/helpers/resetGulpTasks.js
 */
'use strict';

var FileSystem = require('fs');
var GulpUtil   = require('gulp-util');
var Path       = require('path');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Returns a fixture file wich can be piped to gulp-scss-lint.
 *
 * @param {string} $file - The file to test
 * @return {object} - Vinyl object
 */
module.exports = function getFixtureFile($file)
{
    $file = Path.resolve(Path.dirname(__dirname), './fixtures/' + $file);
    $file = new GulpUtil.File(
    {
        'cwd':      Path.dirname(Path.dirname($file)),
        'base':     Path.dirname($file),
        'path':     $file,
        'contents': FileSystem.readFileSync($file)
    });

    return $file;
};
