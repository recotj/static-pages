'use strict';

module.exports = () => {
	if (!require('./gulp-configs/nodeenv').isProduct()) return;
	
	const makePath = require('./gulp-tasks/makepath');
	
	gulp = global.gulp || require('gulp');
	
	Object.assign(
		global.options,
		{
			pages: global.options.pages.map((page) => ({
				basedir: page,
				src: makePath(page, 'src'),
				assets: makePath(page, 'assets'),
				dist: makePath(page, 'dist'),
				distAssets: makePath(page, 'dist', 'assets'),
				temp: makePath(page, 'temp'),
				tempAssets: makePath(page, 'temp', 'assets')
			})),
			lib: makePath(__dirname, 'lib'),
			sharedAssets: makePath(__dirname, 'shared-assets'),
			sharedFonts: makePath(__dirname, 'shared-assets', 'fonts'),
			sharedIcons: makePath(__dirname, 'shared-assets', 'icons'),
			dist: makePath(__dirname, 'dist'),
			projectDir: __dirname
		}
	);
	
	gulp.task('clean', resolveAll(require('./gulp-tasks/clean')));
	
	// preparation
	gulp.task('prepare:css', resolveAll(require('./gulp-tasks/css/normalize')));
	gulp.task('prepare:html', resolveAll(require('./gulp-tasks/html/relocate')));
	gulp.task('prepare:assets', resolveAll(require('./gulp-tasks/assets/relocate')));
	
	// build tasks
	gulp.task('build:js', resolveAll(require('./gulp-tasks/js/build')));
	gulp.task('build:sass:css', resolveAll(require('./gulp-tasks/css/sassify')));
	
	// crawl fonts
	gulp.task('optimize:fonts', resolveAll(require('./gulp-tasks/assets/fonts/spider')));

	gulp.task('restructure:assets', resolveAll(require('./gulp-tasks/assets/restructure')));
	gulp.task('restructure:css', resolveAll(require('./gulp-tasks/css/restructure')));
	gulp.task('restructure:js', resolveAll(require('./gulp-tasks/js/restructure')));
	gulp.task('restructure:html', resolveAll(require('./gulp-tasks/html/restructure')));
	
	// revision tasks
	gulp.task('rev:assets', resolveAll(require('./gulp-tasks/assets/rev')));
	gulp.task('rev:css', resolveAll(require('./gulp-tasks/css/rev')));
	gulp.task('rev:js', resolveAll(require('./gulp-tasks/js/rev')));
	// final revision replacement in html
	gulp.task('rev:replace:html', resolveAll(require('./gulp-tasks/html/rev-replace')));
	
	// other modification tasks
	gulp.task('embed:js:html', resolveAll(require('./gulp-tasks/html/embed-js')));
	gulp.task('embed:weixin-fragment:html', resolveAll(require('./gulp-tasks/html/inject-weixin-fragment')));
	
	gulp.task('relocate:dist:all', resolveAll(require('./gulp-tasks/pack')));
	
	gulp.task('favicon', resolveAll(require('./gulp-tasks/favicon')));
	
	gulp.task('local-server', require('./gulp-tasks/local-server/deploy')());

	gulp.task('publish', (done) => {
		require('run-sequence')(
			'clean',
			['prepare:css', 'prepare:html', 'prepare:assets'],
			['build:js', 'build:sass:css'],
			'optimize:fonts',
			'restructure:assets',
			'restructure:css',
			'restructure:js',
			'restructure:html',
			'rev:assets',
			['rev:css', 'rev:js'],
			'rev:replace:html',
			'relocate:dist:all',
			'favicon',
			done
		);
	});
	
	gulp.task('pack:all', resolveAll((options) => {
		options = Object.assign({}, global.options, options);
		return () => {
			return gulp.src(makePath(options.dist, '**'))
				.pipe(require('gulp-rename')((path) => {
					if (path.basename === 'index' && path.extname === '.html') {
						path.basename = getPageName(options.basedir);
					}
				}))
				.pipe(gulp.dest(global.options.dist));
		}
	}));
};

function resolveAll(task, options) {
	const Stream = require('stream');
	const merge = require('merge-stream');
	const log = require('gulp-util').log;
	const colors = require('gulp-util').colors;
	
	return () => {
		const batches = global.options.pages.map((page, i) => {
			logOnStart(i);
			return task(Object.assign({}, global.options, options, page))();
		});
		if (batches.every((task) => (task instanceof Stream)))
			return merge(batches.map((task, i) => task.on('end', () => logOnEnd(i))));
		if (batches.every((task) => (task instanceof Promise)))
			return Promise.all(batches.map((task, i) => task.then(() => logOnEnd(i))));
		
		throw new Error('batches should either be all promises or be all streams');
		
		function logOnStart(index) {
			log('\tstarted in', colors.red(getPageName(index)));
		}
		
		function logOnEnd(index) {
			log('\tfinished in', colors.green(getPageName(index)));
		}
	};
}

function getPageName(basedir) {
	const path = require('path');
	if (typeof basedir === 'number') basedir = global.options.pages[basedir].basedir;
	return path.basename(basedir);
}
