'use strict';

module.exports = (options) => {
	const makePath = require('../makepath');

	return require('../common/restructure')(Object.assign({
		restructure: {
			src: '*.js',
			configures: makePath([options.basedir, options.projectDir], ['', 'gulp-configs'], 'restructure.config.json'),
			replaceManifest: 'assets-manifest-unreved.json',
			manifest: 'js-manifest-unreved.json'
		}
	}, options));
};
