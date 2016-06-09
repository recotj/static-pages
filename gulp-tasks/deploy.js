'use strict';

module.exports = (options) => {
	options = Object.assign({}, global.options, options);
	
	return (done) => {
		require('gulp-connect').server({
			root: options.dist,
			port: require('../gulp-configs/connect-port')()
		});
	};
};
