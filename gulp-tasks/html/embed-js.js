'use strict';

module.exports = (options) => {
	const gulp = global.gulp || require('gulp');
	options = Object.assign({}, global.options, options);
	
	const makePath = require('../makepath');
	const isProduct = require('../../gulp-configs/nodeenv').isProduct();
	
	return () => {
		return gulp.src(makePath(options.temp, 'index.html'))
			.pipe(require('gulp-cheerio')({
				run: ($, file) => {
					if (isProduct) {
						$('head').append(
							`<script>${require('fs').readFileSync(makePath(options.lib, 'js', 'analyse.js'))}</script>`
						);
						$('body').append(
							`<script>${require('fs').readFileSync(makePath(options.temp, 'main.js'))}</script>`
						);
						// $('body').append(
						// 	`<script>${require('fs').readFileSync(makePath(isProduct ? 'temp/plugin-tiper-360.js' : 'plugin-tiper-360.js', options))}</script>`
						// );
					} else {
						$('body').append(
							`<script src="main.js"></script>`
						);
					}
				},
				parserOptions: {
					decodeEntities: false
				}
			}))
			.pipe(gulp.dest(options.temp));
	};
};
