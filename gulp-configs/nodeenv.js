'use strict';

let env = String(process.env.NODE_ENV);
if (env !== 'production' && env !== 'testing') {
	env = 'development';
}

const nodeEnv = module.exports = function () {
	return env;
};

nodeEnv.switch = function (envArg) {
	envArg = String(envArg);
	if (envArg === 'development' || envArg === 'testing' || envArg === 'production') {
		env = envArg;
	}
};

nodeEnv.isDevelop = function () {
	return env !== 'production' && env !== 'testing';
};

nodeEnv.isProduct = function () {
	return env === 'production';
};

nodeEnv.isTesting = function () {
	return env === 'testing';
};
