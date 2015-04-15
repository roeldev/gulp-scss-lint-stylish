# gulp-scss-lint-stylish
[![NPM version][npm-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Dependency Status][david-img]][david-url]

**Stylish reporter for [gulp-scss-lint][gulp-scss-lint-url], following the visual style of [jshint-stylish][jshint-stylish-url]**

## Installation
```sh
npm install --save gulp-scss-lint-stylish
```

## Usage
```js
var gulp            = require('gulp'),
    scssLint        = require('gulp-scss-lint'),
    scssLintStylish = require('gulp-scss-lint-stylish');

gulp.task('scss-lint', function()
{
    gulp.src('/scss/*.scss')
        .pipe( scssLint({ customReport: scssLintStylish }) );
});
```

[npm-img]: https://badge.fury.io/js/gulp-scss-lint-stylish.svg
[npm-url]: https://www.npmjs.com/package/gulp-scss-lint-stylish
[travis-img]: https://travis-ci.org/roeldev/gulp-scss-lint-stylish.svg?branch=master
[travis-url]: https://travis-ci.org/roeldev/gulp-scss-lint-stylish
[david-img]: https://david-dm.org/roeldev/gulp-scss-lint-stylish.svg
[david-url]: https://david-dm.org/roeldev/gulp-scss-lint-stylish

[gulp-scss-lint-url]: https://github.com/juanfran/gulp-scss-lint
[jshint-stylish-url]: https://github.com/sindresorhus/jshint-stylish
