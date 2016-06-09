'use strict';

module.exports = (options) => {
	const gulp = global.gulp || require('gulp');
	options = Object.assign({}, global.options, options);
	
	const makePath = require('../../makepath');
	
	return () => {
		return gulp.src(makePath(options.temp, 'index.html'))
			.pipe(require('gulp-font-spider')())
			.pipe(require('through2').obj(function (file, encoding, next) {
				next(null, file);
			}, function (done) {
				const fs = require('fs');
				fs.readdir(makePath(options.tempAssets, '.font-spider'), (err, paths) => {
					if (!Array.isArray(paths) || paths.length === 0) return done();
					const kepts = paths.map((path) => `!${makePath(options.tempAssets, path + '.ttf')}`);
					require('del')([makePath(options.tempAssets, '*.ttf')].concat(kepts))
						.then(() => done(), (err) => done(err));
				});
			}));
	};
};
