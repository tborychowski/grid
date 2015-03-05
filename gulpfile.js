'use strict';

var gulp = require('gulp'),
	webpack = require('gulp-webpack'),
	live = require('gulp-livereload'),
	copy = require('gulp-copy'),
	stylus = require('gulp-stylus'),
	jshint = require('gulp-jshint'),
	notify = require('gulp-notify'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	del = require('del');

var wpConfig = {
		debug: false,
		devtool: '#source-map',
		output: {
			publicPath: './assets/',
			filename: 'app.js',
			sourceMapFilename: 'app.js.map'
		},
		resolve: {
			root: __dirname,
			extensions: ['', '.js', '.json']
		},
		module: {
			loaders: [
				{ test: /\.html$/, loader: 'mustache' },
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader?experimental&comments=false'
				}
			]
		}
	},
	wpErr = function (err, stats) {
		if (err) notify.onError('Error: ' + err);
		err = stats.compilation.errors;
		if (err.length) notify.onError('Error: ' + err[0].message);
	};

gulp.task('clean', function (cb) {
	del(['assets/**/*.{css,js,map}', 'fonts/*.*'], cb);
});

gulp.task('js', function () {
	return gulp.src(['app.js'])
		.pipe(webpack(wpConfig, null, wpErr))
		.pipe(gulp.dest('assets'))
		.pipe(live());
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


gulp.task('fonts', function () {
	return gulp.src([ 'node_modules/font-awesome/fonts/*.*' ])
		.pipe(copy('./fonts', { prefix: 3 }));
});

gulp.task('watch', function () {
	live.listen();
	gulp.watch('src/**/*.styl', ['styl']);
	gulp.watch(['./*.js', 'src/**/*.js'], ['js', 'jshint']);
});

gulp.task('default', ['clean', 'js', 'styl', 'fonts', 'watch']);
