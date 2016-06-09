'use strict';

module.exports = (options) => {
	const gulp = global.gulp || require('gulp');

	const makePath = require('../makepath');
	const filter = require('../../gulp-utils/filter-with-manifest');
	const isProduct = require('../../gulp-configs/nodeenv').isProduct();

	if (!isProduct) return (done) => done();

	const manifest = options.manifest;
	if (!manifest || typeof manifest !== 'object') {
		console.error('manifest filed missing.');
		return (done) => done();
	}

	return () => {
		return gulp.src(makePath(options.temp, '**'), { base: options.temp })
			.pipe(require('gulp-if')(
				Boolean(manifest.filter),
				filter({ manifest: makePath(options.temp, manifest.filter), exclude: options.exclude })
			))
			.pipe(require('gulp-if')(
				Boolean(manifest.revReplace),
				require('gulp-rev-replace')({ manifest: gulp.src(makePath(options.temp, manifest.revReplace)) })
			))
			.pipe(require('gulp-if')(
				Boolean(manifest.rev),
				require('gulp-rev')()
			))
			.pipe(gulp.dest(options.temp))
			.pipe(require('gulp-if')(
				Boolean(manifest.rev),
				require('gulp-rev-delete-original')({
					exclude: (file) => !file.revOrigPath
				})
			))
			.pipe(require('gulp-if')(
				Boolean(manifest.rev),
				require('gulp-rev').manifest(manifest.rev, { merge: true })
			))
			.pipe(gulp.dest(options.temp));
	}
};
