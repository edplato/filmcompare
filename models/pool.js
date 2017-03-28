module.exports = function Pool(oldPool) {
	this.items = oldPool.items || {};

	this.add = function(parsedBody) {
		var storedItem = this.items[parsedBody];
		if(!storedItem) {
			storedItem = this.items[parsedBody] = {movieId: parsedBody};
			
		}
		//add more accessible items????
		console.log(storedItem);
	};

	this.generateArray = function() {
		var arr = [];
		for(var parsedBody in this.items) {
			arr.push(this.items[parsedBody]);
		}
		return arr;
	};
};