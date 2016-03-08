/**
 * gulp-scss-lint-stylish | lib/utils/colorize.js
 */
'use strict';

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function colorize($str, $color1, $color2)
{
    var $matches = $str.split(/(`[^`]+`)/g);
    var $match;

    if ($matches)
    {
        $str = [];

        for (var $i = 0, $iL = $matches.length; $i < $iL; $i++)
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
};
