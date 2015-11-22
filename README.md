# gulp-scss-lint-stylish

[![NPM Version][npm-img]][npm-url]
[![Linux Build][travis-img]][travis-url]
[![Windows Build][appveyor-img]][appveyor-url]
[![Test Coverage][coveralls-img]][coveralls-url]
[![Dependency Status][david-img]][david-url]

  [npm-img]: https://badge.fury.io/js/gulp-scss-lint-stylish.svg
  [npm-url]: https://www.npmjs.com/package/gulp-scss-lint-stylish
  [travis-img]: https://img.shields.io/travis/roeldev/gulp-scss-lint-stylish/master.svg?label=linux
  [travis-url]: https://travis-ci.org/roeldev/gulp-scss-lint-stylish
  [appveyor-img]: https://img.shields.io/appveyor/ci/roeldev/gulp-scss-lint-stylish/master.svg?label=windows
  [appveyor-url]: https://ci.appveyor.com/project/roeldev/gulp-scss-lint-stylish
  [coveralls-img]: https://img.shields.io/coveralls/roeldev/gulp-scss-lint-stylish/master.svg
  [coveralls-url]: https://coveralls.io/r/roeldev/gulp-scss-lint-stylish?branch=master
  [david-img]: https://david-dm.org/roeldev/gulp-scss-lint-stylish.svg
  [david-url]: https://david-dm.org/roeldev/gulp-scss-lint-stylish

**Stylish reporter for [gulp-scss-lint][gulp-scss-lint-url], following the visual style of [jshint-stylish][jshint-stylish-url].**

## Installation
```sh
npm install --save gulp-scss-lint-stylish
```

## How to use
```js
var gulp            = require('gulp');
var scssLint        = require('gulp-scss-lint');
var scssLintStylish = require('gulp-scss-lint-stylish');

gulp.task('scss-lint', function()
{
    gulp.src('/scss/*.scss')
        .pipe( scssLint({ customReport: scssLintStylish }) );
});
```

## License
[GPL-2.0+](LICENSE) © 2015 [Roel Schut](http://roelschut.nl)


[gulp-scss-lint-url]: https://github.com/juanfran/gulp-scss-lint
[jshint-stylish-url]: https://github.com/sindresorhus/jshint-stylish
