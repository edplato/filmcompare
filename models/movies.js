var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	imdbID: {type: String, required: true},
	detailBody: {type: Object, required: true},
	id : {type: String, required: true}
});

module.exports = mongoose.model('Movie', schema);