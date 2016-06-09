'use strict';

var client = require('../../../lib/js/bom/client');
var addClassName = require('../../../lib/js/dom/classNames').add;
var orientation = require('../../../lib/js/behaviors/orientation');
var EventUtil = require('../../../lib/js/dom/EventUtil');

var baseWidth, baseHeight, baseFontSize;
var initialized = false;

module.exports = function (options) {
	if (initialized) return;
	initWindowConfig(options);
	initFontSize();
	initialized = true;
};

module.exports.getFontZoomRatio = function () {
	return parseInt(document.documentElement.style.fontSize, 10) / baseFontSize;
};

module.exports.getClientWidthZoomRatio = function () {
	return parseInt(document.documentElement.clientWidth, 10) / baseWidth;
};

module.exports.getClientHeightZoomRatio = function () {
	return parseInt(document.documentElement.clientHeight, 10) / baseHeight;
};

function initWindowConfig(options) {
	options = options || {};

	if (client.isFromMobile()) {
		baseWidth = options.baseWidth || 640;
		baseHeight = options.baseHeight || 1136;
		baseFontSize = options.baseFontSize || 32;
		addClassName(document.documentElement, 'landscape-enable');
		orientation.addListener(initFontSize);
	} else {
		baseWidth = options.baseWidth || 1440;
		baseHeight = options.baseHeight || 850;
		baseFontSize = options.baseFontSize || 32;
		addClassName(document.documentElement, 'on-desktop');
		EventUtil.addEventListener(window, 'resize', initFontSize, false);
	}
}

function initFontSize() {
	try {
		var root = document.documentElement;
		var clientWidth = parseInt(root.clientWidth, 10);
		var clientHeight = parseInt(root.clientHeight, 10);
		var minFontSize = 12;

		if (client.isFromMobile() && clientWidth > clientHeight) {
			// swap them.
			clientWidth = clientWidth ^ clientHeight;
			clientHeight = clientHeight ^ clientWidth;
			clientWidth = clientWidth ^ clientHeight;
		}

		var fontSizeComputedByWidth = Math.min(clientWidth, baseWidth) / baseWidth * baseFontSize;
		var fontSizeComputedByHeight = Math.min(clientHeight, baseHeight) / baseHeight * baseFontSize;

		root.style.fontSize = Math.max(minFontSize, Math.min(fontSizeComputedByWidth, fontSizeComputedByHeight)) + 'px';
	} catch (e) {
	}
}
