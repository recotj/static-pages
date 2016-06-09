var assert = require('../../utils/assert');
var supports = {
	forEach: typeof [].forEach === 'function'
};

module.exports = function forEach(array, callback, thisArg) {
	if (!forEach.forEach)
		if (supports.forEach)
			forEach.forEach = function (array, callback, thisArg) {
				return Array.prototype.forEach.call(array, function (e, i, a) {
					return callback.call(thisArg, e, i, a);
				});
			};
		else
			forEach.forEach = function (array, callback, thisArg) {
				checkArguments(array, callback);
				thisArg = thisArg || window;
				var i = array.length;
				if (i <= 0)
					return;
				// fast case
				if (i === 1)
					callback.call(thisArg, array[0], 0, array);
				else
					while (i--)
						if (callback.call(thisArg, array[i], i, array) === false)
							break;
			};

	forEach.forEach(array, callback, thisArg);
};

function checkArguments(array, callback) {
	assert(array && array.length === ~~array.length, 'expected #array# as an array');
	assert(typeof callback === 'function', 'expected #callback# as a function');
}