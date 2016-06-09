'use strict';

module.exports = (options) => {
	options = Object.assign({}, global.options, options);
	
	return () => require('del')([options.dist, options.temp, global.options.dist])
		.then((paths) => {
			paths.forEach(path => console.log('delete: %s', path.replace(__dirname, '')));
			return paths;
		});
};
