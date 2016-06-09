var supports = {
	isArray: typeof Array.isArray === 'function'
};

module.exports = function isArray(array) {
	if (!isArray.isArray)
		if(supports.isArray)
			isArray.isArray = function (array) {
				return Array.isArray(array);
			};
		else
			isArray.isArray = function (array) {
				return array && Object.prototype.toString.call(array) === '[object Array]'
			};

	return isArray.isArray(array);
};
