'use strict';

module.exports = (options) => {
	const gulp = global.gulp || require('gulp');
	options = Object.assign({}, global.options, options);
	
	const makePath = require('../makepath');
	const nodeEnv = require('../../gulp-configs/nodeenv');
	const isProduct = nodeEnv.isProduct();
	
	const browserifyOptions = {
		entries: [makePath(options.basedir, 'main.js')],
		transform: [
			[require('envify'), {
				_: 'purge',
				NODE_ENV: nodeEnv()
			}],
			[require('unreachable-branch-transform')]
		],
		debug: !isProduct,
		cache: {},
		packageCache: {},
		plugin: [],
		fullPaths: false
	};
	
	if (isProduct) {
		browserifyOptions.transform.push(require('stripify'));
		browserifyOptions.plugin.push(require('browserify-derequire'));
		browserifyOptions.plugin.push(require('bundle-collapser/plugin'));
	}
	
	return () => {
		return require('browserify')(browserifyOptions).bundle()
			.pipe(require('vinyl-source-stream')('main.js'))
			.pipe(require('vinyl-buffer')())
			.pipe(require('gulp-if')(
				isProduct,
				require('../../gulp-utils/simple-uglify')({})
			))
			.pipe(gulp.dest(options.temp));
	};
};

