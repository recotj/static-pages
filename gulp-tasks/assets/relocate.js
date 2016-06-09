'use strict';

module.exports = (options) => {
	const gulp = global.gulp || require('gulp');
	options = Object.assign({}, global.options, options);
	
	const makePath = require('../makepath');
	
	return () => {
		return gulp.src(makePath(
			[options.assets, options.sharedFonts, options.sharedIcons],
			'**'
		))
			.pipe(gulp.dest(options.tempAssets));
	}
};
