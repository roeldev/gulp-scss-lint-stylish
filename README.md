#starter-project [![Build Status][travis-img]][travis-url]
**Stylish reporter for gulp-scss-lint, following the visual style of jshint-stylish**


## Install
```sh
npm install --save gulp-scss-lint-stylish
```

## Usage
```js
var gulp            = require('gulp'),
    scssLint        = require('gulp-scss-lint),
    scssLintStylish = require('gulp-scss-lint-stylish);

gulp.task('scss-lint', function()
{
    gulp.src('/scss/*.scss')
        .pipe( scssLint({ customReport: scssLintStylish }) );
});
```

[travis-img]: https://travis-ci.org/roeldev/gulp-scss-lint-stylish.svg?branch=master
[travis-url]: https://travis-ci.org/roeldev/gulp-scss-lint-stylish
