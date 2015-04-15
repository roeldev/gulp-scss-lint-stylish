/**
 * gulp-scss-lint-stylish | test/main.js
 * file version: 0.00.002
 */
'use strict';

var Assert              = require('assert'),
    FileSystem          = require('fs'),
    Path                = require('path'),
    LogSymbols          = require('log-symbols'),
    GulpScssLint        = require('gulp-scss-lint'),
    GulpScssLintStylish = require('../lib/index.js'),
    GulpUtil            = require('gulp-util'),
    Chalk               = GulpUtil.colors;

////////////////////////////////////////////////////////////////////////////////

/**
 * Returns a fixture file wich can be piped to gulp-scss-lint.
 *
 * @param {string} $file - The file to test
 * @return {object} - Vinyl object
 */
function getFixtureFile($file)
{
    $file = Path.resolve(__dirname, './fixtures/'+ $file);
    $file = new GulpUtil.File(
    {
        'cwd':      Path.dirname(Path.dirname($file)),
        'base':     Path.dirname($file),
        'path':     $file,
        'contents': FileSystem.readFileSync($file)
    });

    return $file;
}

/**
 * Test if gulp-scss-lint stream's stylished output is correct.
 *
 * @param {string} $file - The file to test
 * @param {function} $done - Mocha callback function
 * @param {array} $expected - The expected lines from the scss-lint output
 * @return {null}
 */
function test($file, $done, $expected)
{
    var $stdoutWrite = process.stdout.write.bind(process.stdout),
        $stream      = GulpScssLint({ 'customReport': GulpScssLintStylish }),
        $result      = [],
        $line        = 0;

    // collect the output from the linter and parse it's result
    process.stdout.write = function($str)
    {
        $line++;

        // check for 3rd and 5th scss-lint output line
        if ($line === 3 || $line === 5)
        {
            $result.push( Chalk.stripColor($str) );
        }
    };

    // is triggerend when gulp-scss-lint is finished
    $stream.on('end', function()
    {
        process.stdout.write = $stdoutWrite;

        // test the results from the scss-lint cli output
        Assert.deepEqual($result, $expected);

        // tell mocha the test is complete
        $done();
    });

    $stream.write( getFixtureFile($file) );
    $stream.end();
}

//------------------------------------------------------------------------------

describe('GulpScssLintStylish()', function()
{
    // no errors or warnings, scss is valid
    it('should display nothing', function($done)
    {
        test('success.scss', $done, []);
    });

    // warning in scss file
    it('should display stylish warning', function($done)
    {
        test('warning.scss', $done,
        [
            '  line 1  col 1  Avoid using id selectors\n',
            '  '+ Chalk.stripColor(LogSymbols.warning) +'  1 warning\n'
        ]);
    });

    // error in scss file
    it('should display stylish error', function($done)
    {
        test('error.scss', $done,
        [
            '  line 5  col 1  Syntax Error: Invalid CSS after "}": expected "}", was ""\n',
            '  '+ Chalk.stripColor(LogSymbols.error) +'  1 error\n'
        ]);
    });
});
