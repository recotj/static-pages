module.exports = (
	process.env.NODE_ENV === 'production' ?
		createFakeAssert() :
		require('assert')
);

function createFakeAssert() {
	var assert = function () {};
	var keys = ['AssertionError', 'fail', 'ok', 'equal', 'notEqual', 'deepEqual',
		'deepStrictEqual', 'notDeepEqual', 'notDeepStrictEqual', 'strictEqual',
		'notStrictEqual', 'throws', 'doesNotThrow', 'ifError'];
	var i = keys.length;

	while (i--) {
		assert[keys[i]] = noop;
	}

	return assert;
}

function noop() {
}

