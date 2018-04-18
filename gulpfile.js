/*
所有命令
	压缩图片：gulp mini-img
		测试：gulp test-img
*/

const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()

gulp.task('mini-img', function() {
	gulp.src('gulp-img/**')
		.pipe(plugins.imagemin())
		.pipe(gulp.dest('dist/gulp-img'))
})
gulp.task('test-img', function() {
	gulp.src('test-img/**')
		.pipe(plugins.imagemin())
		.pipe(gulp.dest('dist/test-img'))
})