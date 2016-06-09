'use strict';

module.exports = (options) => {
	return require('../common/rev')(Object.assign({
		manifest: {
			filter: 'js-manifest-unreved.json',
			revReplace: 'assets-manifest.json',
			rev: 'js-manifest.json'
		}
	}, options));
};
