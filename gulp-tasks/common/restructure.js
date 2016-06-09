'use strict';

module.exports = (options) => {
	const gulp = global.gulp || require('gulp');

	const makePath = require('../makepath');
	const restructure = require('../../gulp-utils/gulp-restructure');
	const restructureReplace = require('../../gulp-utils/gulp-restructure-replace');

	const configs = options.restructure;
	if (!configs || typeof configs !== 'object') {
		console.error('configs filed missing.');
		return (done) => done();
	}

	return () => {
		return gulp.src(makePath(options.temp, configs.src), { base: options.temp })
			.pipe(require('gulp-if')(
				Boolean(configs.configures),
				restructure({ configure: configs.configures })
			))
			.pipe(require('gulp-if')(
				Boolean(configs.replaceManifest),
				restructureReplace({ manifest: makePath(options.temp, configs.replaceManifest) })
			))
			.pipe(gulp.dest(options.temp))
			.pipe(require('gulp-if')(
				Boolean(configs.manifest),
				restructure.manifest(configs.manifest)
			))
			.pipe(gulp.dest(options.temp));
	};
};
