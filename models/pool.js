module.exports = function Pool(oldPool) {
	this.items = oldPool.items || {};

	this.add = function(parsedBody, id) {
		var storedItem = this.items[id];
		if(!storedItem) {
			storedItem = this.items[id] = {movieId: parsedBody};
			
		}
		//add more accessible items????
		console.log(storedItem);
	};

	this.generateArray = function() {
		var arr = [];
		for(var id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	};
};