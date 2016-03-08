/**
 * gulp-scss-lint-stylish | lib/index.js
 *
 * Copyright (c) 2015-2016 Roel Schut (roelschut.nl)

 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
'use strict';

var _          = require('underscore');
var Chalk      = require('gulp-util').colors;
var LogSymbols = require('log-symbols');
var Path       = require('path');
var TextTable  = require('text-table');

var colorize  = require('./utils/colorize');
var pluralize = require('./utils/pluralize');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

var IS_WIN32 = (process.platform === 'win32');

// -----------------------------------------------------------------------------

/**
 * @param {object} $file - Vinyl object with scsslint key in it.
 * @return {boolean|string} Returns the displayed output, or false on empty.
 */
module.exports = function GulpScssLintStylish($file)
{
    var $result       = false;
    var $report       = $file.scsslint;
    var $errorCount   = 0;
    var $warningCount = 0;
    var $log          = [];

    // no output needed on success or empty report
    if (_.isUndefined($report) || _.isEmpty($report) ||
        $report.success === true)
    {
        return $result;
    }

    // loop through all issues in the report
    for (var $i = 0, $iL = $report.issues.length; $i < $iL; $i++)
    {
        var $issue  = $report.issues[$i];
        var $reason = $issue.reason;

        if ($issue.severity === 'error')
        {
            $errorCount++;
            $reason = Chalk.red($reason);
        }
        else
        {
            $warningCount++;
            $reason = (IS_WIN32 ?
                colorize($reason, Chalk.cyan, Chalk.blue) :
                colorize($reason, Chalk.blue, Chalk.cyan));
        }

        if (!_.isEmpty($issue.linter))
        {
            $reason = $issue.linter + ': ' + $reason;
        }

        // this is actually a with columns wich are passed to TextTable
        $log.push([
            '',
            Chalk.gray('line ' + $issue.line),
            Chalk.gray('col ' + $issue.column),
            $reason
        ]);
    }

    // at the end of the output log, display the amount of warnings/errors
    if ($log.length >= 1)
    {
        var $filePath = '.' + Path.sep +
                        Path.relative(process.cwd(), $file.path);

        $result = [
            Chalk.underline($filePath),
            TextTable($log) + '\n'
        ];

        if ($errorCount > 0)
        {
            $errorCount += pluralize(' error', $errorCount);
            $result.push('  ' + LogSymbols.error + '  ' + $errorCount);
        }

        if ($warningCount > 0)
        {
            $warningCount += pluralize(' warning', $warningCount);
            $result.push('  ' + LogSymbols.warning + '  ' + $warningCount);
        }

        $result = '\n' + $result.join('\n') + '\n';
        console.log($result);
    }

    return $result;
};
