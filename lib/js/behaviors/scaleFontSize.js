var EventUtil = require('../../../lib/js/dom/EventUtil');
var client = require('../../../lib/js/bom/client');
var forEach = require('../../../lib/js/polyfill/Array/forEach');
var makeResponsive = require('../../../lib/js/behaviors/makeResponsive');

var initialized = false;

module.exports = function (options) {
	if (initialized) return;

	options = options || {};

	if (!scaleOverSmallFont.originalFontSize)
		scaleOverSmallFont.originalFontSize = options.originalFontSize || 12;

	if (!scaleOverSmallFont.originalLineHeight)
		scaleOverSmallFont.originalLineHeight = options.originalLineHeight || 4;

	if (!scaleOverSmallFont.nodes)
		scaleOverSmallFont.nodes = options.nodes || document.getElementsByClassName('text-to-scale');

	makeResponsive();

	scaleOverSmallFont();
	EventUtil.addEventListener(window, 'resize', scaleOverSmallFont);

	initialized = true;
};

function scaleOverSmallFont() {
	if (!scaleOverSmallFont.cssTransformKeys)
		scaleOverSmallFont.cssTransformKeys = ['-webkit-transform', '-moz-transform', '-ms-transform', '-o-transform', 'transform'];

	var ratio = makeResponsive.getFontZoomRatio();

	forEach(scaleOverSmallFont.nodes, function (node) {
		forEach(scaleOverSmallFont.cssTransformKeys, function (key) {
			node.style[key] = 'scale(' + ratio + ')';
		});
		node.style.lineHeight = scaleOverSmallFont.originalLineHeight * ratio + 'em';
	});
}


