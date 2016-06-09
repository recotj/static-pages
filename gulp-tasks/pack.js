'use strict';

module.exports = (options) => {
	const gulp = global.gulp || require('gulp');
	options = Object.assign({}, global.options, options);
	
	const makePath = require('./makepath');
	
	return () => {
		const excluded = [
			'assets-manifest-unreved.json',
			'css-manifest-unreved.json',
			'js-manifest-unreved.json',
			'html-manifest-unreved.json',
			'assets-manifest.json',
			'css-manifest.json',
			'js-manifest.json'
		];

		return gulp.src([].concat(
				[makePath(options.temp, '**')],
				excluded.map((path) => `!${makePath(options.temp, path)}`)
			))
			.pipe(gulp.dest(options.dist))
			// .on('end', () => require('del')(options.temp));
	};
	
	function createFilesStream(path, dist) {
		return gulp.src(makePath(options.basedir, path))
			.pipe(gulp.dest(dist && makePath(options.basedir, dist) || options.dist));
	}
	
	function createFilesStreamFromManifest(manifest, base, dist) {
		const filesInfo = JSON.parse(require('fs').readFileSync(makePath(options.basedir, manifest)));
		const filePaths = Object.keys(filesInfo).map(
			(key) => require('path').join(base || 'temp', filesInfo[key])
		);
		
		return gulp.src(makePath(options.basedir, filePaths))
			.pipe(gulp.dest(dist && makePath(options.basedir, dist) || options.dist));
	}
};
