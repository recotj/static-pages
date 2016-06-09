'use strict';

module.exports = (options) => {
	const gulp = global.gulp || require('gulp');
	options = Object.assign({}, global.options, options);
	
	const makePath = require('../makepath');
	
	return () => {
		return gulp.src(makePath(options.temp, 'index.html'))
			.pipe(require('gulp-minify-html')({
				empty: true,
				conditionals: true,
				quotes: true
			}))
			.pipe(gulp.dest(options.temp));
	}
};
