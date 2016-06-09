'use strict';

module.exports = (options) => {
	return require('../common/rev')(Object.assign({
		manifest: {
			filter: 'html-manifest-unreved.json',
			revReplace: ['css-manifest.json', 'assets-manifest.json', 'js-manifest.json']
		}
	}, options));
};
