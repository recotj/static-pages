'use strict';

module.exports = (options) => {
	const makePath = require('../makepath');
	
	return require('../common/restructure')(Object.assign({
		restructure: {
			src: '*.html',
			configures: makePath([options.basedir, options.projectDir], ['', 'gulp-configs'], 'restructure.config.json'),
			replaceManifest: ['assets-manifest-unreved.json', 'css-manifest-unreved.json', 'js-manifest-unreved.json'],
			manifest: 'html-manifest-unreved.json'
		}
	}, options));
};
