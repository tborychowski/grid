const gulp = require('gulp');
const gutil = require('gulp-util');
const cssmin = require('gulp-clean-css');
const webpack = require('webpack-stream');
const concat = require('gulp-concat');
const stylus = require('gulp-stylus');
const live = require('gulp-livereload');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const del = require('del');


const wpErr = (err, stats) => {
	if (err) notify.onError('Error: ' + err);
	err = stats.compilation.errors;
	if (err.length) notify.onError('Error: ' + err[0].message);
};


gulp.task('clean', cb => del(['{assets,dist}/*.{css,js,map}'], cb));


gulp.task('js', ['eslint'], () => {
	return gulp.src('./app.js')
		.pipe(webpack(require('./webpack.js'), null, wpErr))
		.pipe(gutil.env.prod ? uglify() : gutil.noop())
		.pipe(gulp.dest('assets/'))
		.pipe(live());
});


gulp.task('grid', () => {
	return gulp.src('./src/index.js')
		.pipe(webpack(require('./webpack-grid.js'), null, wpErr))
		.pipe(gutil.env.prod ? uglify() : gutil.noop())
		.pipe(gulp.dest('dist/'));
});


gulp.task('eslint', () => {
	return gulp.src(['src/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});



gulp.task('styl', () => {
	return gulp.src(['app.styl', 'src/**/*.styl'])
		.pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
		.pipe(stylus({ paths: ['./'], 'include css': true }))
		.pipe(gutil.env.prod ? cssmin({ keepSpecialComments: 0 }) : gutil.noop())
		.pipe(concat('app.css'))
		.pipe(gulp.dest('assets'))
		.pipe(live());
});

gulp.task('watch', () => {
	if (gutil.env.prod) return;
	live.listen();
	gulp.watch('**/*.styl', ['styl']);
	gulp.watch(['app.js', 'src/**/*.js'], ['js', 'grid', 'eslint']);
});


gulp.task('dist', ['grid']);
gulp.task('default', ['clean', 'js', 'grid', 'styl', 'watch']);
