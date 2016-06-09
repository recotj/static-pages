'use strict';

const nodeEnv = require('./nodeenv');

let port = process.env.PORT;

if (!port) {
	if (nodeEnv.isProduct()) port = 8001;
	if (nodeEnv.isTesting()) port = 8002;
	if (nodeEnv.isDevelop()) port = 8003;
}

module.exports = () => {
	return port;
};

module.exports.switch = (portArg) => {
	port = parseInt(portArg, 10);
};
