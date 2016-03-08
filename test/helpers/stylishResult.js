/**
 * gulp-scss-lint-stylish | test/helpers/stylishResult.js
 */
'use strict';

var GulpScssLintStylish = require('../../lib/index.js');
var GulpUtil            = require('gulp-util');
var LogInterceptor      = require('log-interceptor');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

/**
 * Strip colors from a simulated report from gulp-scss-lint.
 *
 * @param {string} $file - Path of the file
 * @param {string} $severity - Either error or warning
 * @param {[type]} $amount - The amount of errors/warnings
 * @return {string} Returns the color stripped output.
 */
module.exports = function stylishResult($file, $severity, $amount)
{
    var $result;
    var $data =
    {
        'path': $file,
        'scsslint':
        {
            'success': false,
            'issues':  []
        }
    };

    // prepare test data
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

    LogInterceptor();

    $result = GulpScssLintStylish($data);
    $result = GulpUtil.colors.stripColor($result);

    LogInterceptor.end();
    return $result;
};
