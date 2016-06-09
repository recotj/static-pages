'use strict';

module.exports = (options) => {
	options = Object.assign({}, global.options, options);

	const Path = require('path');
	const Url = require('url');
	const express = require('express');
	const app = express();

	return (done) => {
		const port = require('../../gulp-configs/connect-port')();
		const host = Url.format({
			protocol: 'http',
			hostname: 'localhost',
			port: port
		});

		if (options.pages.length === 1) {
			const page = options.pages[0];

			deployForPage(page);
		} else {
			const pages = [];

			options.pages.forEach((page) => {
				const pageName = Path.basename(page.basedir);
				const pagePath = `/pages/${pageName}`;

				deployForPage(page, pagePath);

				pages.push({ name: pageName, path: pagePath });
			});

			app.set('views', Path.resolve(__dirname, 'views'));
			app.set('view engine', 'hbs');

			app.get('/', (req, res) => {
				res.render('preview', { pages: pages });
			});
		}

		app.listen(port);

		require('open')(host);

		function deployForPage(page, path) {
			path = path || '/';

			app.get(path, (req, res) => {
				const fs = require('fs');
				fs.readFile(Path.resolve(page.dist, getIndexFile(page)), (err, data) => {
					if (err) res.send(err);
					else res.send(data.toString());
				});
			});

			app.use(express.static(page.dist));
		}

		function getIndexFile(page) {
			return getActualFilePath(page, 'index.html');
		}

		function getActualFilePath(page, filename) {
			const restructure = require('../../gulp-utils/gulp-restructure').utils;
			const configure = restructure.collectConfigures([
				Path.resolve(page.basedir, 'restructure.config.json'),
				Path.resolve(global.options.projectDir, 'gulp-configs/restructure.config.json')
			]);
			const newFilename = restructure.getRestructuredFile(filename, configure);
			return newFilename || filename;
		}
	};
};
