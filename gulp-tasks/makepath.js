'use strict';

const path = require('path');

module.exports = function (/*vector<path-fragment>*/) {
	const args = Array.prototype.slice.apply(arguments);
	const paths = transposeMatrix(toMatrix(args)).map((vector) => path.resolve.apply(path, vector.map(String)));
	
	if (paths.length === 1) return paths[0];
	
	return paths;
};

module.exports.join = path.join;
module.exports.basename = path.basename;
module.exports.dirname = path.dirname;
module.exports.extname = path.extname;


function toMatrix(vectors) {
	const dimension = vectors.reduce((dimension, vector) => {
		if (!Array.isArray(vector)) return dimension;
		if (vector.length > dimension) dimension = vector.length;
		return dimension;
	}, 1);
	
	return vectors.map((vector) => {
		if (!Array.isArray(vector)) vector = (new Array(dimension)).fill(vector);
		const length = vector.length;
		vector.length = dimension;
		vector.fill('', length);
		return vector.map((item) => item || '');
	});
}

function transposeMatrix(matrix) {
	return matrix[0].map((_, i) => matrix.map((vector) => vector[i]));
}
