'use strict';

const SOURCE = process.env.SOURCE;
const sources = getPageDirectories(SOURCE);
const options = { pages: sources, basedir: sources[0] };

console.log('SOURCE: \t', sources);
console.log('NODE_ENV: \t', process.env.NODE_ENV);
console.log('PORT: \t\t', require('./gulp-configs/connect-port')());

exportVars({
	gulp: require('gulp'),
	options: options
});

require('./gulpWorkFlowProduct')();
require('./gulpWorkFlowDevelop')();

function exportVars(vars) {
	Object.keys(vars).forEach(function (key) {
		global[key] = vars[key];
	});
}

function getPageDirectories(source) {
	const fs = require('fs');
	const path = require('path');
	const pages = 'pages';
	
	source = (source || '').toLowerCase();
	
	if (!source || source === 'all') {
		return fs.readdirSync(path.resolve(pages))
			.map((file) => path.resolve(pages, file))
			.filter((path) => fs.statSync(path).isDirectory());
	}
	
	const dir = path.resolve(pages, source);
	if (!fs.statSync(dir).isDirectory()) throw new Error(`expect ${source} as a directory`);
	
	return [dir];
}

