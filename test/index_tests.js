/**
 * gulp-scss-lint-stylish | test/index_tests.js
 */
'use strict';

var Assert              = require('assert');
var GulpUtil            = require('gulp-util');
// var GulpScssLint        = require('gulp-scss-lint');
var GulpScssLintStylish = require('../lib/index.js');
// var LogInterceptor      = require('log-interceptor');
var LogSymbols          = require('log-symbols');
var Path                = require('path');
var StripAnsi           = GulpUtil.colors.stripColor;

var streamTest     = require('./helpers/streamTest');
var stylishResult  = require('./helpers/stylishResult');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

var FILE = '.' + Path.sep + Path.relative(process.cwd(), __filename);

// -----------------------------------------------------------------------------

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
        Assert.deepEqual(stylishResult(__filename, 'error', 1), [
            '',
            FILE,
            '  line 1  col 1  TestCase: Forced error test',
            '',
            '  ' + StripAnsi(LogSymbols.error) + '  1 error',
            ''
        ].join('\n'));
    });

    it('return two stylish warnings', function()
    {
        Assert.deepEqual(stylishResult(__filename, 'warning', 2), [
            '',
            FILE,
            '  line 1  col 1  TestCase: Forced warning test',
            '  line 2  col 2  TestCase: Forced warning test',
            '',
            '  ' + StripAnsi(LogSymbols.warning) + '  2 warnings',
            ''
        ].join('\n'));
    });
});
