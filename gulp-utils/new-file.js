'use strict';

const fs = require('fs');
const Path = require('path');
const Stream = require('stream');
const through = require('through2');
const mkdirp = require('mkdirp');
const File = require('vinyl');

module.exports = (path, content, options) => {
	if (!path || typeof path !== 'string') {
		console.error('invalid options.path');
		return through.obj();
	}

	if (typeof content !== 'string' && !Buffer.isBuffer(content) && !(content instanceof Stream)) {
		options = content;
		content = '';
	}

	options = options || {};

	const paths = [];

	return through.obj(function (file, encoding, next) {
		next(null, file);
		paths.push(file.path);
	}, function (done) {
		const stream = this;
		const dirname = Path.dirname(path);

		mkdirp(dirname, (err) => {
			if (err) return done(err);
			fs.stat(path, (err, stat) => {
				if (err || options.override === true) {
					if (content instanceof Stream) {
						const buffers = [];
						content.on('data', (data) => {
							if (File.isVinyl(data) && data.isFile()) data = data.contents.toString();
							buffers.push(Buffer.from(data));
						});
						content.on('end', () => {
							writeContent(path, Buffer.concat(buffers));
						})
					} else {
						writeContent(path, content);
					}
				} else {
					insertToGulpStreamIfNecessary(path, stat);
					done();
				}
			});
		});

		function writeContent(path, content) {
			fs.writeFile(path, content, (err) => {
				if (err) return done(err);
				insertToGulpStreamIfNecessary(path, null);
				done();
			});
		}

		function insertToGulpStreamIfNecessary(path, stat) {
			if (options.insert !== false && paths.indexOf(path) !== -1) {
				stream.push(new File({
					path: path,
					stat: stat
				}));
			}
		}
	})
};
