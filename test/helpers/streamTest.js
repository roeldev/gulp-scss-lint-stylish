/**
 * gulp-scss-lint-stylish | test/helpers/streamTest.js
 */
'use strict';

var Assert              = require('assert');
var GulpScssLint        = require('gulp-scss-lint');
var GulpScssLintStylish = require('../../lib/index.js');
var LogInterceptor      = require('log-interceptor');

var getFixtureFile = require('./getFixtureFile');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Test if gulp-scss-lint stream's stylished output is correct.
 *
 * @param {string} $file - The file to test
 * @param {function} $done - Mocha callback function
 * @param {array} $expected - The expected lines from the scss-lint output
 * @return {null}
 */
module.exports = function streamTest($file, $done, $expected)
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
};
