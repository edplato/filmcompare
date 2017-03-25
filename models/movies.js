var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	title: {type: String, required: true},
	year: {type: String, required: true},
	imdbID: {type: String, required: true},
	posterPath: {type: String, required: true}
});

module.exports = mongoose.model('Movies', schema);