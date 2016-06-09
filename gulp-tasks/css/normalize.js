'use strict';

module.exports = (options) => {
	const gulp = global.gulp || require('gulp');
	options = Object.assign({}, global.options, options);
	
	const isProduct = require('../../gulp-configs/nodeenv').isProduct();
	
	return () => {
		return gulp.src('./node_modules/normalize.css/normalize.css')
			.pipe(require('gulp-if')(isProduct, require('gulp-csso')()))
			.pipe(gulp.dest(options.temp));
	}
};
