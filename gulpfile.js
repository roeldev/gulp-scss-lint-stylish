/**
 * confirge | gulpfile.js
 * file version: 0.00.002
 */
'use strict';

var Gulp            = require('gulp');
var GulpJsHint      = require('gulp-jshint');
var GulpJsCs        = require('gulp-jscs');
var GulpJsCsStylish = require('gulp-jscs-stylish');
var GulpMocha       = require('gulp-mocha');
var RunSequence     = require('run-sequence');

var Noop = function()
{
};

//------------------------------------------------------------------------------

var JS_SRC = ['gulpfile.js', 'lib/**/*.js', 'test/*.js'];

////////////////////////////////////////////////////////////////////////////////

Gulp.task('lint', function()
{
    return Gulp.src(JS_SRC)
        .pipe( GulpJsHint() )
        .pipe( GulpJsCs() ).on('error', Noop)
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
