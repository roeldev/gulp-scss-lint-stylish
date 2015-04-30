/**
 * gulp-scss-lint-stylish | test/main.js
 * file version: 0.00.006
 */
'use strict';

var Assert              = require('assert');
var FileSystem          = require('fs');
var Path                = require('path');
var LogSymbols          = require('log-symbols');
var GulpScssLint        = require('gulp-scss-lint');
var GulpScssLintStylish = require('../lib/index.js');
var GulpUtil            = require('gulp-util');
var Chalk               = GulpUtil.colors;

////////////////////////////////////////////////////////////////////////////////

/**
 * Returns a fixture file wich can be piped to gulp-scss-lint.
 *
 * @param {string} $file - The file to test
 * @return {object} - Vinyl object
 */
function getFixtureFile($file)
{
    $file = Path.resolve(__dirname, './fixtures/' + $file);
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
function streamTest($file, $done, $expected)
{
    var $stdoutWrite = process.stdout.write.bind(process.stdout);
    var $stream      = GulpScssLint({ 'customReport': GulpScssLintStylish });
    var $result      = [];
    var $line        = 0;

    // collect the output from the linter and parse it's result
    process.stdout.write = function($str)
    {
        $line++;
        $stdoutWrite($str);

        $str = $str.split('\n');

        for (var $i = 0, $iL = $str.length; $i < $iL; $i++)
        {
            $result.push( Chalk.stripColor($str[$i]) );
        }
    };

    // is triggerend when gulp-scss-lint is finished
    $stream.on('end', function()
    {
        process.stdout.write = $stdoutWrite;

        if ($result.length > 0)
        {
            $result = [$result[2], $result[4]];
        }

        // test the results from the scss-lint cli output
        Assert.deepEqual($result, $expected);

        // tell mocha the test is complete
        $done();
    });

    $stream.write( getFixtureFile($file) );
    $stream.end();
}

/**
 * Strip colors from a simulated report from gulp-scss-lint.
 *
 * @param {string} $severity - Either error or warning
 * @param {[type]} $amount - The amount of errors/warnings
 * @return {string} Returns the color stripped output.
 */
function stylishResult($severity, $amount)
{
    var $result;
    var $data =
    {
        'path': __filename,
        'scsslint':
        {
            'success': false,
            'issues': []
        }
    };

    for (var $i = 1; $i <= $amount; $i++)
    {
        $data.scsslint.issues.push(
        {
            'linter':   'TestCase',
            'reason':   'Forced ' + $severity + ' test',
            'severity': $severity,
            'line':     $i,
            'column':   $i
        });
    }

    $result = GulpScssLintStylish($data);
    $result = Chalk.stripColor($result);

    return $result;
}

//------------------------------------------------------------------------------

describe('gulp-scss-lint', function()
{
    // set timeout for mocha to 2500+ ms so Appveyor won't fail
    this.timeout(5000);

    // no errors or warnings, scss is valid
    it('should display nothing', function($done)
    {
        streamTest('success.scss', $done, []);
    });

    // warning in scss file
    it('should display stylish warning', function($done)
    {
        streamTest('warning.scss', $done,
        [
            '  line 1  col 1  IdSelector: Avoid using id selectors',
            '  ' + Chalk.stripColor(LogSymbols.warning) + '  1 warning'
        ]);
    });

    // error in scss file
    it('should display stylish error', function($done)
    {
        var $error = 'Invalid CSS after "}": expected "}", was ""';

        streamTest('error.scss', $done,
        [
            '  line 5  col 1  Syntax Error: ' + $error,
            '  ' + Chalk.stripColor(LogSymbols.error) + '  1 error'
        ]);
    });
});

describe('GulpScssLintStylish()', function()
{
    it('should return on non existing report', function()
    {
        Assert.equal(false, GulpScssLintStylish({ }));
    });

    it('should return on empty report', function()
    {
        Assert.equal(false, GulpScssLintStylish({ 'scsslint': {} }));
    });

    it('should return on successful report', function()
    {
        Assert.equal(false, GulpScssLintStylish(
        {
            'scsslint': { 'success': true }
        }));
    });

    it('should return a stylish error', function()
    {
        Assert.deepEqual(stylishResult('error', 1),
        [
            '',
            __filename,
            '  line 1  col 1  TestCase: Forced error test',
            '',
            '  ' + Chalk.stripColor(LogSymbols.error) + '  1 error',
            ''
        ].join('\n'));
    });

    it('should return two stylish warnings', function()
    {
        Assert.deepEqual(stylishResult('warning', 2),
        [
            '',
            __filename,
            '  line 1  col 1  TestCase: Forced warning test',
            '  line 2  col 2  TestCase: Forced warning test',
            '',
            '  ' + Chalk.stripColor(LogSymbols.warning) + '  2 warnings',
            ''
        ].join('\n'));
    });
});
