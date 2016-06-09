'use strict';

const UglifyJS = require('uglify-js');
const through = require('through2');
const gutil = require('gulp-util');

module.exports = (options) => {
	const cache = [];

	return through.obj(function (file, encoding, next) {
		if (file.isNull()) {
			next(null, file);
			return;
		}

		if (file.isStream()) {
			next(new gutil.PluginError('gulp-restructure', 'Streaming not supported'));
			return;
		}

		cache.push(file);
		next(null, file);
	}, function (done) {
		const stream = this;
		cache.forEach((file) => {
			const result = UglifyJS.minify(file.contents.toString(), Object.assign({}, options, { fromString: true }));
			file.contents = new Buffer(result.code);
			stream.push(file);
		});
		done();
	})
};
