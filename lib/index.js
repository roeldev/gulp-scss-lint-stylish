/**
 * gulp-scss-lint-stylish | lib/index.js
 * file version: 0.00.002
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

var GulpScssLintStylish = function($file)
{
    var $report       = $file.scsslint,
        $errorCount   = 0,
        $warningCount = 0,
        $log          = [],
        $issue,
        $reason;

    if (_.isUndefined($report) || $report.success)
    {
        return;
    }

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

        $log.push(
        [
            '',
            Chalk.gray('line '+ $issue.line),
            Chalk.gray('col '+ $issue.column),
            $reason
        ]);
    }

    if ($log.length >= 1)
    {
        console.log('');
        console.log(Chalk.underline($file.path));
        console.log(TextTable($log));
        console.log('');

        if ($errorCount > 0)
        {
            $errorCount += pluralize(' error', $errorCount);
            console.log('  '+ LogSymbols.error +'  '+ $errorCount);
        }
        if ($warningCount > 0)
        {
            $warningCount += pluralize(' warning', $warningCount);
            console.log('  '+ LogSymbols.warning +'  '+ $warningCount);
        }

        console.log('');
    }
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
