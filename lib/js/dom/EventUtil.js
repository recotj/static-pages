var assert = require('../utils/assert');

var supports = {
	addEventListener: typeof window.addEventListener === 'function'
};

var EventUtils = module.exports = {
	addEventListener: createListenerUtil('addEventListener'),
	removeEventListener: createListenerUtil('removeEventListener')
};

function createListenerUtil(key) {
	if (!createListenerUtil.IEKeys)
		createListenerUtil.IEKeys = {addEventListener: 'attachEvent', removeEventListener: 'detachEvent'};

	return function (target, event, callback, useCapture) {
		if (supports.addEventListener)
			EventUtils[key] = function (target, event, callback, useCapture) {
				checkArguments(target, event, callback);
				target[key](event, callback, useCapture || false);
			};
		else
			EventUtils[key] = function (target, event, callback) {
				checkArguments(target, event, callback);
				target[createListenerUtil.IEKeys[key]]('on' + event, callback);
			};

		EventUtils[key](target, event, callback, useCapture);
	};
}

function checkArguments(target, event, callback) {
	assert(isEventTarget(target), 'invalid event target');
	assert(!!event, 'invalid event');
	assert(typeof callback === 'function', 'expected #callback# as function');
}

function isEventTarget(target) {
	return target &&
		typeof target.addEventListener === 'function' &&
		typeof target.removeEventListener === 'function' &&
		typeof target.dispatchEvent === 'function';
}


