'use strict';

const through = require('through2');
const Path = require('path');
const gulp = require('gulp');

module.exports = (options) => {
	options = options || {};

	const cache = [];
	const restructured = [];
	let base = options.base;

	return through.obj(function (file, encoding, next) {
		if (!base) base = file.base;
		cache.push(file);
		next();
	}, function (done) {
		const stream = this;

		let manifest = options.manifest;
		if (!(manifest instanceof require('stream'))) {
			manifest = gulp.src(manifest);
		}

		manifest.on('data', function (file) {
			const manifest = JSON.parse(file.contents.toString());
			Object.keys(manifest).forEach((key) => {
				restructured.push({
					original: key,
					restructured: manifest[key]
				});
			});

		});

		manifest.on('end', function () {
			cache.forEach((file) => {
				restructured.forEach((info) => {
					let contents = file.contents.toString();
					const regexp = new RegExp(escapeRegExp(info.original), 'g');
					contents = contents.replace(regexp, Path.relative(Path.dirname(file.path), info.restructured));
					file.contents = new Buffer(contents);
				});
				stream.push(file);
			});
			done();
		});
	});
};

function escapeRegExp(string){
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
