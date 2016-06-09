'use strict';

module.exports = (options) => {
	const makePath = require('../makepath');
	
	return require('../common/restructure')(Object.assign({
		restructure: {
			src: '*.css',
			configures: makePath([options.basedir, options.projectDir], ['', 'gulp-configs'], 'restructure.config.json'),
			replaceManifest: 'assets-manifest-unreved.json',
			manifest: 'css-manifest-unreved.json'
		}
	}, options));
};
