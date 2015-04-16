/**
 * gulp-scss-lint-stylish | lib/index.js
 * file version: 0.00.003
 */
'use strict';

var _          = require('underscore'),
    Chalk      = require('gulp-util').colors,
    LogSymbols = require('log-symbols'),
    TextTable  = require('text-table');

var IS_WIN = (process.platform === 'win32');

////////////////////////////////////////////////////////////////////////////////

function colorize($str, $color1, $color2)
{
    var $matches = $str.split(/(`[^`]+`)/g),
        $match;

    if ($matches)
    {
        $str = [];

        for(var $i = 0, $iL = $matches.length; $i < $iL; $i++)
        {
            $match = $matches[$i];
            $match = (($match.substr(0, 1) === '`') ?
                      $color2($match) :
                      $color1($match));

            $str.push($match);
        }

        $str = $str.join('');
    }
    return $str;
}

function pluralize($str, $count)
{
    if ($count > 1)
    {
        $str += 's';
    }
    return $str;
}

//------------------------------------------------------------------------------

/**
 * @param {object} $file - Vinyl object with scsslint key in it.
 * @return {boolean|string} Returns the displayed output, or false on empty.
 */
var GulpScssLintStylish = function($file)
{
    var $result       = false,
        $report       = $file.scsslint,
        $errorCount   = 0,
        $warningCount = 0,
        $log          = [],
        $issue,
        $reason;

    // no output needed on success or empty report
    if (_.isUndefined($report) || _.isEmpty($report) ||
        $report.success === true)
    {
        return $result;
    }

    // loop through all issues in the report
    for(var $i = 0, $iL = $report.issues.length; $i < $iL; $i++)
    {
        $issue  = $report.issues[$i];
        $reason = $issue.reason;

        if ($issue.severity === 'error')
        {
            $errorCount++;
            $reason = Chalk.red($reason);
        }
        else
        {
            $warningCount++;
            $reason = (IS_WIN ?
                colorize($reason, Chalk.cyan, Chalk.blue) :
                colorize($reason, Chalk.blue, Chalk.cyan));
        }

        // this is actually a with columns wich are passed to TextTable
        $log.push(
        [
            '',
            Chalk.gray('line '+ $issue.line),
            Chalk.gray('col '+ $issue.column),
            $reason
        ]);
    }

    // at the end of the output log, display the amount of warnings/errors
    if ($log.length >= 1)
    {
        $result =
        [
            Chalk.underline($file.path),
            TextTable($log) +'\n'
        ];

        if ($errorCount > 0)
        {
            $errorCount += pluralize(' error', $errorCount);
            $result.push('  '+ LogSymbols.error +'  '+ $errorCount);
        }
        if ($warningCount > 0)
        {
            $warningCount += pluralize(' warning', $warningCount);
            $result.push('  '+ LogSymbols.warning +'  '+ $warningCount);
        }

        $result = '\n'+ $result.join('\n') +'\n';
        console.log($result);
    }

    return $result;
};

/*
    gulp-scss-lint-stylish
    Copyright (c) 2015 Roel Schut (roelschut.nl)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
module.exports = GulpScssLintStylish;
