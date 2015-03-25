'use strict';

var gulp = require('gulp'),
	webpack = require('gulp-webpack'),
	live = require('gulp-livereload'),
	stylus = require('gulp-stylus'),
	jshint = require('gulp-jshint'),
	notify = require('gulp-notify'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	del = require('del');
var wpErr = function (err, stats) {
		if (err) notify.onError('Error: ' + err);
		err = stats.compilation.errors;
		if (err.length) notify.onError('Error: ' + err[0].message);
	};

gulp.task('clean', function (cb) { del(['assets/*.{css,js,map}'], cb); });

gulp.task('js', function () {
	return gulp.src('./app.js')
		.pipe(webpack(require('./webpack.js'), null, wpErr))
		.pipe(gulp.dest('assets/'))
		.pipe(live());
});

gulp.task('grid', function () {
	return gulp.src('./src/index.js')
		.pipe(webpack(require('./webpack-grid.js'), null, wpErr))
		.pipe(gulp.dest('dist/'));
});


gulp.task('jshint', function () {
	return gulp.src([ 'app.js', 'src/**/*.js' ])
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('styl', function () {
	return gulp.src(['app.styl', 'src/**/*.styl'])
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(stylus({ paths: ['./'], 'include css': true }))
		.pipe(concat('app.css'))
		.pipe(gulp.dest('assets'))
		.pipe(live());
});

gulp.task('watch', function () {
	live.listen();
	gulp.watch('**/*.styl', ['styl']);
	gulp.watch(['app.js', 'src/**/*.js'], ['js', 'grid', 'jshint']);
});


gulp.task('default', ['clean', 'js', 'grid', 'styl', 'watch']);
