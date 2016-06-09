var UAParser = new (require('ua-parser-js'))();

module.exports = {
	isFromMobile: function () {
		return UAParser.getDevice().type === 'mobile';
	},
	isAndroid: function () {
		return UAParser.getOS().name === 'Android';
	},
	isIphone: function () {
		return UAParser.getOS().name === 'iOS';
	},
	isIE: function () {
		var browser = UAParser.getBrowser();
		if (browser.name !== 'IE') return false;
		return parseInt(browser.version, 10);
	},
	isWeiXin: function () {
		return /MicroMessenger/i.test(window.navigator.userAgent.toLowerCase());
	}
};
