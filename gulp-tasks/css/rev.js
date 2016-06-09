'use strict';

module.exports = (options) => {
	return require('../common/rev')(Object.assign({
		exclude: (path) => require('path').basename(path) === 'normalize.css',
		manifest: {
			filter: 'css-manifest-unreved.json',
			revReplace: 'assets-manifest.json',
			rev: 'css-manifest.json'
		}
	}, options));
};

