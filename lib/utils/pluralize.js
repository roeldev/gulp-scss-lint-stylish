/**
 * gulp-scss-lint-stylish | lib/pluralize.js
 */
'use strict';

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function pluralize($str, $count)
{
    if ($count > 1)
    {
        $str += 's';
    }

    return $str;
};
