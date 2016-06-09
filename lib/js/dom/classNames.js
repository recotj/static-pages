var assert = require('../utils/assert');
var forEach = require('../polyfill/Array/forEach');
var isArray = require('../polyfill/Array/isArray');
var format = require('../utils/Strings/format');
var supports = {
	classList: 'classList' in document.documentElement,
	forEach: typeof Array.prototype.forEach === 'function'
};

var classNamesUtil = module.exports = {
	add: function (element, classNames) {
		if (supports.classList)
			classNamesUtil.add = function (element, classNames) {
				checkArguments(element, classNames);
				if (isArray(classNames))
					forEach(classNames, function (className) {
						element.classList.add(className);
					});
				else
					element.classList.add(classNames);
			};
		else
			classNamesUtil.add = function (element, classNames) {
				checkArguments(element, classNames);

				var attrClass = element.getAttribute('class');
				var classList = attrClass ? attrClass.split(' ') : [];
				var length = classList.length;
				var cache = {};

				forEach(classList, function (className) {
					cache[className] = className;
				});

				if (isArray(classNames)) {
					forEach(classNames, function (className) {
						if (!className || cache[className])
							return;
						cache[className] = className;
						classList.push(className);
					});
					if (classList.length > length)
						return classList.join(' ');
				} else {
					if (classNames && !cache[classNames])
						return [attrClass, classNames].join(' ');
				}
			};

		classNamesUtil.add(element, classNames);
	},
	remove: function (element, classNames) {
		if (supports.classList)
			classNamesUtil.remove = function (element, classNames) {
				checkArguments(element, classNames);
				forEach(classNames, function (className) {
					element.classList.remove(className);
				});
			};
		else
			classNamesUtil.remove = function (element, className) {
				checkArguments(element, classNames);

				var attrClass = element.getAttribute('class');
				var classList = attrClass ? attrClass.split(' ') : [];
				var length = classList.length;
				var cache = {};
				var newAttrClass = attrClass;

				if (length === 0)
					return;

				forEach(classList, function (className, index) {
					cache[className] = index;
				});

				forEach(classNames, function (className) {
					if (!className || typeof cache[className] === 'undefined')
						return;
					delete cache[className];
				});

				if (classList.length < length)
					return classList.join(' ');
			};

		classNamesUtil.remove(element, classNames);
	}
};

function checkArguments(element, classNames) {
	assert(element instanceof HTMLElement, 'expected HTMLElement');
	assert(classNames, 'invalid classNames');
}
