'use strict';

module.exports = (options) => {
	const gulp = global.gulp || require('gulp');
	options = Object.assign({}, global.options, options);
	
	const path = require('path');
	
	return () => {
		return gulp.watch(require('../makepath')(options.src, '**'), ['sassify']);
	}
};
