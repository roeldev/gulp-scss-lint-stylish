'use strict';

var _          = require('underscore'),
    Chalk      = require('chalk'),
    LogSymbols = require('log-symbols'),
    TextTable  = require('text-table'),
    IS_WIN     = (process.platform === 'win32');

////////////////////////////////////////////////////////////////////////////////

function reason($str, $color1, $color2)
{
    var $matches = $str.split(/(`[^`]+`)/g),
        $match,
        $str     = [];

    if ($matches)
    {
        for(var $i = 0, $iL = $matches.length; $i < $iL; $i++)
        {
            $match = $matches[$i];
            $match = (($match.substr(0, 1) === '`')
                ? $color2($match)
                : $color1($match));

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

module.exports = function($file)
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
            $reason = (IS_WIN
                ? reason($reason, Chalk.cyan, Chalk.blue)
                : reason($reason, Chalk.blue, Chalk.cyan));
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
        console.log($file.path);
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
