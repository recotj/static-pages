'use strict';

module.exports = (options) => {
	const makePath = require('../makepath');

	return require('../common/restructure')(Object.assign({
		restructure: {
			src: 'assets/**',
			configures: makePath([options.basedir, options.projectDir], ['', 'gulp-configs'], 'restructure.config.json'),
			manifest: 'assets-manifest-unreved.json'
		}
	}, options));
};
