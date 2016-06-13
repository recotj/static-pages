'use strict';

let env = String(process.env.NODE_ENV);
if (env !== 'production' && env !== 'testing') env = 'development';

const nodeEnv = module.exports = () => env;

nodeEnv.switch = (envArg) => {
	envArg = String(envArg);
	if (envArg === 'development' || envArg === 'testing' || envArg === 'production') {
		env = envArg;
	}
};

nodeEnv.isDevelop = () => env === 'development';

nodeEnv.isProduct = () => env === 'production';

nodeEnv.isTesting = () => env === 'testing';
