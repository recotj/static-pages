function Path(pathname, subpaths) {
	if (Array.isArray(pathname)) {
		const makePath = require('../gulp-tasks/makepath');
		pathname = makePath.apply(makePath, pathname);
	}
	
	if (subpaths && typeof subpaths === 'object') {
		Object.keys(subpaths).forEach((key) => {
			let subpath = subpaths[key];
			if (!(subpath instanceof Path)) subpath = new Path(subpath);
			subpath.parentDir = () => this.toString();
			this[key] = subpath;
		});
	}
	
	let realPathname;
	this.toString = () => {
		if (realPathname) return realPathname;
		
		const path = require('path');
		
		if (path.isAbsolute(pathname)) {
			realPathname = pathname
		} else if (this.parentDir) {
			realPathname = path.resolve(this.parentDir(), pathname);
		} else {
			realPathname = path.resolve(__dirname, pathname);
		}
		
		return realPathname;
	}
}

const paths = {
	pageDirs: global.options.pages.map((page) => new Path(page, {
		basedir: new Path('.'),
		src: new Path('src'),
		assets: new Path('assets'),
		dist: new Path('dist', {
			assets: new Path('assets')
		}),
		temp: new Path('temp', {
			assets: new Path('assets')
		})
	})),
	lib: new Path('lib'),
	sharedAssets: new Path('shared-assets', {
		fonts: new Path('fonts'),
		icons: new Path('icons')
	})
};
