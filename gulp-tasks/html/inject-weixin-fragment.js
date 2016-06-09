'use strict';

module.exports = (options) => {
	const gulp = global.gulp || require('gulp');
	options = Object.assign({}, global.options, options);
	
	const makePath = require('../makepath');
	const isProduct = require('../../gulp-configs/nodeenv').isProduct();
	
	return () => {
		return gulp.src(makePath(isProduct ? options.temp : options.src, 'index.html'))
			.pipe(require('gulp-cheerio')({
				run: ($, file) => {
					$('body .container.main').prepend(
						String(require('fs').readFileSync(makePath(options.basedir, 'for-weixin.html')))
					);
				},
				parserOptions: {
					decodeEntities: false
				}
			}))
			.pipe(gulp.dest(options.dist));
	}
};
