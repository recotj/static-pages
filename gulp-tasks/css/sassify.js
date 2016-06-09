'use strict';

module.exports = (options) => {
	const gulp = global.gulp || require('gulp');
	options = Object.assign({}, global.options, options);
	
	const makePath = require('../makepath');
	const isProduct = require('../../gulp-configs/nodeenv').isProduct();
	
	return (done) => {
		return gulp.src(makePath(options.src, 'main.scss'))
			.pipe(require('gulp-if')(!isProduct, require('gulp-sourcemaps').init()))
			.pipe(require('gulp-sass')({ outputStyle: isProduct ? 'compressed' : 'none' }))
			// TODO: postcss
			.pipe(require('gulp-if')(!isProduct, require('gulp-sourcemaps').write()))
			.pipe(gulp.dest(options.temp));
	}
};
