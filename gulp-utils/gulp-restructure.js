'use strict';

const Path = require('path');
const through = require('through2');
const File = require('vinyl');
const sortKeys = require('sort-keys');
const gutil = require('gulp-util');
const del = require('del');

module.exports = (options) => {
	options = options || {};

	const configure = normalizeConfigure(collectConfigures(options.configure, options.base));

	if (!configure) return through.obj();

	const removes = [];

	return through.obj(function (file, encoding, next) {
		if (file.isNull()) {
			next(null, file);
			return;
		}

		if (file.isStream()) {
			next(new gutil.PluginError('gulp-restructure', 'Streaming not supported'));
			return;
		}

		const base = options.base || file.base;
		const originalPath = file.path;
		const originalRelative = Path.relative(base, originalPath);
		file.originalRelative = originalRelative;
		const newRelative = getRestructuredFile(originalRelative, configure);
		if (newRelative) {
			file.path = Path.join(base, newRelative);
			if (file.path !== originalPath) removes.push(originalPath);
		}
		next(null, file);
	}, function (done) {
		del(removes).then((paths) => {
			done();
		});
	});
};

module.exports.manifest = (manifest) => {
	const record = {};

	return through.obj(function (file, encoding, next) {
		if (file.originalRelative) record[file.originalRelative] = file.path;
		next();
	}, function (done) {
		if (Object.keys(record).length > 0) {
			this.push(new File({
				path: manifest,
				contents: new Buffer(JSON.stringify(sortKeys(record), null, '  '))
			}));
		}
		done();
	})
};

module.exports.utils = {
	collectConfigures: collectConfigures,
	getRestructuredFile: getRestructuredFile
};

function getRestructuredFile(filename, configure) {
	if (typeof filename !== 'string') return null;
	if (!Array.isArray(configure)) return null;
	const matched = configure.find((testcase) => new RegExp(testcase.test).test(filename));
	if (!matched) return null;
	return filename.replace(new RegExp(matched.test), matched.dist);
}

function collectConfigures(configures, base) {
	base = base || process.cwd();

	if (Array.isArray(configures)) {
		return configures.reduce((result, configure) => {
			configure = handleSingleConfigure(configure);
			if (!configure) return result;
			return result.concat(configure);
		}, []);
	}

	return handleSingleConfigure(configures);


	function handleSingleConfigure(config) {
		if (!config) return null;

		let path = config;
		let result;
		if (!Path.isAbsolute(config)) {
			path = Path.resolve(base, path);
		}
		if (!path) return null;

		try {
			result = require(path);
		} catch (e) {
		}

		if (!Array.isArray(result)) return null;

		return result;
	}
}

function normalizeConfigure(configure) {
	if (!Array.isArray(configure)) return null;
	const filtered = configure.filter((item) => item && item.test && item.dist);
	if (filtered.length === 0) return null;
	return filtered;
}
