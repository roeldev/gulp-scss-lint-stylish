/**
 * gulp-scss-lint-stylish | test/index_tests.js
 */
'use strict';

var Assert              = require('assert');
var FileSystem          = require('fs');
var GulpScssLint        = require('gulp-scss-lint');
var GulpScssLintStylish = require('../lib/index.js');
var GulpUtil            = require('gulp-util');
var Path                = require('path');
var LogInterceptor      = require('log-interceptor');
var LogSymbols          = require('log-symbols');
var StripAnsi           = GulpUtil.colors.stripColor;

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Returns a fixture file wich can be piped to gulp-scss-lint.
 *
 * @param {string} $file - The file to test
 * @return {object} - Vinyl object
 */
function getFixtureFile($file)
{
    $file = Path.resolve(__dirname, './fixtures/' + $file);
    $file = new GulpUtil.File({
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
    var $stream = GulpScssLint({ 'customReport': GulpScssLintStylish });

    // collect the output from the linter and parse it's result
    LogInterceptor({ 'stripColor': true, 'splitOnLinebreak': true });

    // is triggerend when gulp-scss-lint is finished
    $stream.on('end', function()
    {
        var $result = LogInterceptor.end();
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
    var $data = {
        'path': __filename,
        'scsslint': {
            'success': false,
            'issues': []
        }
    };

    // prepare test data
    for (var $i = 1; $i <= $amount; $i++)
    {
        $data.scsslint.issues.push({
            'linter':   'TestCase',
            'reason':   'Forced ' + $severity + ' test',
            'severity': $severity,
            'line':     $i,
            'column':   $i
        });
    }

    LogInterceptor();

    $result = GulpScssLintStylish($data);
    $result = StripAnsi($result);

    LogInterceptor.end();
    return $result;
}

//------------------------------------------------------------------------------

describe('gulp-scss-lint', function()
{
    // set timeout for mocha to 2500+ ms so Appveyor won't fail
    this.timeout(5000);

    // no errors or warnings, scss is valid
    it('display nothing', function($done)
    {
        streamTest('success.scss', $done, []);
    });

    // warning in scss file
    it('display stylish warning', function($done)
    {
        streamTest('warning.scss', $done, [
            '  line 1  col 1  IdSelector: Avoid using id selectors\n',
            '  ' + StripAnsi(LogSymbols.warning) + '  1 warning\n'
        ]);
    });

    // error in scss file
    it('display stylish error', function($done)
    {
        var $error = 'Invalid CSS after "}": expected "}", was ""';

        streamTest('error.scss', $done, [
            '  line 5  col 1  Syntax Error: ' + $error + '\n',
            '  ' + StripAnsi(LogSymbols.error) + '  1 error\n'
        ]);
    });
});

describe('GulpScssLintStylish()', function()
{
    it('return on non existing report', function()
    {
        Assert.equal(false, GulpScssLintStylish({ }));
    });

    it('return on empty report', function()
    {
        Assert.equal(false, GulpScssLintStylish({ 'scsslint': {} }));
    });

    it('return on successful report', function()
    {
        Assert.equal(false, GulpScssLintStylish({
            'scsslint': { 'success': true }
        }));
    });

    it('return a stylish error', function()
    {
        Assert.deepEqual(stylishResult('error', 1), [
            '',
            __filename,
            '  line 1  col 1  TestCase: Forced error test',
            '',
            '  ' + StripAnsi(LogSymbols.error) + '  1 error',
            ''
        ].join('\n'));
    });

    it('return two stylish warnings', function()
    {
        Assert.deepEqual(stylishResult('warning', 2), [
            '',
            __filename,
            '  line 1  col 1  TestCase: Forced warning test',
            '  line 2  col 2  TestCase: Forced warning test',
            '',
            '  ' + StripAnsi(LogSymbols.warning) + '  2 warnings',
            ''
        ].join('\n'));
    });
});
