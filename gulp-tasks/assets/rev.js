'use strict';

module.exports = (options) => {
	return require('../common/rev')(Object.assign({
		manifest: {
			filter: 'assets-manifest-unreved.json',
			rev: 'assets-manifest.json'
		}
	}, options));
};
