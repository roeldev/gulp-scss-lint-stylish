/**
 * confirge | gulpfile.js
 * file version: 0.00.002
 */
'use strict';

var Gulp                = require('gulp');
var GulpJsHint          = require('gulp-jshint');
var GulpJsCs            = require('gulp-jscs');
var GulpJsCsStylish     = require('gulp-jscs-stylish');
var GulpScssLint        = require('gulp-scss-lint');
var GulpScssLintStylish = require('./lib/index.js');
var GulpMocha           = require('gulp-mocha');
var RunSequence         = require('run-sequence');

// -----------------------------------------------------------------------------

var JS_SRC = ['gulpfile.js', 'lib/**/*.js', 'test/**/*.js'];

function noop()
{
}

// // // // // // // // // // // // // // // // // // // // // // // // // // //

Gulp.task('lint', function()
{
    return Gulp.src(JS_SRC)
        .pipe( GulpJsHint() )
        .pipe( GulpJsCs() ).on('error', noop)
        .pipe( GulpJsCsStylish.combineWithHintResults() )
        .pipe( GulpJsHint.reporter('jshint-stylish') );
});

Gulp.task('test', function()
{
    return Gulp.src('test/*.js', { 'read': false })
        .pipe( GulpMocha({ 'reporter': 'spec' }) );
});

Gulp.task('dev', function()
{
    process.stdout.write('\u001b[2J');
    RunSequence('test', 'lint');
});

Gulp.task('watch', function()
{
    Gulp.watch(JS_SRC, ['dev']);
});

Gulp.task('watch:lint', function()
{
    Gulp.watch(JS_SRC, ['lint']);
});

Gulp.task('demo', function()
{
    Gulp.src('./test/fixtures/demo.scss')
        .pipe( GulpScssLint() );

    Gulp.src('./test/fixtures/demo.scss')
        .pipe( GulpScssLint({ customReport: GulpScssLintStylish }) );
});
