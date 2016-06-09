'use strict';

const Path = require('path');
const gulp = require('gulp');
const through = require('through2');
const merge = require('merge-stream');
const File = require('vinyl');

module.exports = (options) => {
	const modules = [];
	
	const libStream = gulp.src(options.lib, { read: false })
		.pipe(through.obj(function (file, encoding, next) {
			modules.push(Path.basename(file.path));
			next(null, file);
		}));
	
	const pkgJSONStream = gulp.src(options.pkgJSON)
		.pipe(through.obj(function (file, encoding, next) {
			const content = JSON.parse(file.contents.toString());
			const deps = content['dependencies'];
			Object.keys(deps).forEach((dep) => modules.push(dep));
			next();
		}));

	return merge(libStream, pkgJSONStream).pipe(through.obj(function (file, encoding, next) {
		next();
	}, function (done) {
		console.log('modules: ', modules);
		this.push(new File({
			contents: Buffer.from(modules)
		}));
		done();
	}))
};
