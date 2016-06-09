module.exports = function format (tpl) {
	var index = 0;
	var items = arguments;
	return (tpl || '').replace(/{([^{}]*)}/g, function (match, p1) {
		var item = items[++index];
		if (typeof item === 'undefined' || item === null) return p1 || match;
		return item;
	});
};
