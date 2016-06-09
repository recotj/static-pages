'use strict';

module.exports = function (gulp, plugins, options) {
	if (!require('./gulp-configs/nodeenv').isDevelop()) return;
	
	const makePath = require('./gulp-tasks/makepath');
	
	gulp = gulp || global.gulp;
	
	options = Object.assign(
		global.options,
		{
			src: makePath(global.options.basedir, 'src'),
			assets: makePath(global.options.basedir, 'assets'),
			dist: makePath(global.options.basedir, 'temp'),
			temp: makePath(global.options.basedir, 'temp'),
			lib: makePath(__dirname, 'lib'),
			sharedAssets: makePath(__dirname, 'shared-assets'),
			sharedFonts: makePath(__dirname, 'shared-assets', 'fonts'),
			sharedIcons: makePath(__dirname, 'shared-assets', 'icons'),
			projectDir: __dirname
		},
		options
	);
	
	gulp.task('clean', require('./gulp-tasks/clean')(options));
	
	gulp.task('prepare:css', require('./gulp-tasks/css/normalize')(options));
	gulp.task('prepare:html', require('./gulp-tasks/html/relocate')(options));
	gulp.task('prepare:assets', require('./gulp-tasks/assets/relocate')(options));
	
	gulp.task('build:sass:css', require('./gulp-tasks/css/sassify')(options));
	gulp.task('build:js', require('./gulp-tasks/js/build')(options));

	// crawl fonts
	gulp.task('optimize:fonts', require('./gulp-tasks/assets/fonts/spider')(options));

	gulp.task('restructure:assets', require('./gulp-tasks/assets/restructure')(options));
	gulp.task('restructure:css', require('./gulp-tasks/css/restructure')(options));
	gulp.task('restructure:js', require('./gulp-tasks/js/restructure')(options));
	gulp.task('restructure:html', require('./gulp-tasks/html/restructure')(options));
	
	gulp.task('embed:js:html', require('./gulp-tasks/html/embed-js')(options));
	
	gulp.task('favicon', require('./gulp-tasks/favicon')(options));
	
	gulp.task('watch:css', require('./gulp-tasks/css/watch')(options));
	
	gulp.task('local-server', require('./gulp-tasks/deploy')(options));
	
	gulp.task('develop', (done) => {
		require('run-sequence')(
			'clean',
			['prepare:css', 'prepare:html', 'prepare:assets'],
			['build:sass:css', 'build:js'],
			'optimize:fonts',
			'restructure:assets',
			'restructure:css',
			'restructure:js',
			'restructure:html',
			// 'embed:js:html',
			'favicon',
			'watch:css',
			'local-server',
			done
		)
	})
};
