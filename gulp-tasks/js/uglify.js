'use strict';

module.exports = function (options) {
	const gulp = global.gulp || require('gulp');
	options = Object.assign({}, global.options, options);
	
	const makePath = require('../makepath');
	
	return function () {
		return gulp.src(makePath(options.basedir, ['main.js', 'plugin-tiper-360.js']))
			.pipe(require('gulp-uglifyjs')())
			.pipe(gulp.dest(options.temp));
	};
};
