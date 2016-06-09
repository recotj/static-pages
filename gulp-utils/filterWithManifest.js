'use strict';

const through = require('through2');

module.exports = (options) => {
	options = options || {};
	
	if (!options.manifest) return through.obj();

	const cached = [];
	
	return through.obj(function (file, encoding, next) {
		cached.push(file);
		next();
	}, function (done) {
		const stream = this;
		const manifest = gulp.src(options.manifest);
		const paths = [];

		manifest.on('data', (file) => {
			const pathMap = JSON.parse(file.contents.toString());
			Object.keys(pathMap).forEach((key) => {
				paths.push(pathMap[key]);
			});
		});

		manifest.on('end', () => {
			let exclude;
			if (typeof options.exclude === 'string') exclude = (path) => path === options.exclude;
			if (typeof options.exclude === 'function') exclude = options.exclude;
			if (options.exclude instanceof RegExp) exclude = (path) => options.exclude.test(path);
			cached.forEach((file) => {
				if (exclude && exclude(file.path)) return;
				if (paths.some((path) => path === file.path)) {
					stream.push(file);
				}
			});
			done();
		});
	})
};
