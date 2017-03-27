module.exports = function Pool(oldPool) {
	this.items = oldPool.items || {};

	this.add = function(imdbNum) {
		var storedItem = this.items[imdbNum];
		if(!storedItem) {
			storedItem = this.items[imdbNum] = {movieId: imdbNum};
			
		}
		//add more accessible items????
		console.log(storedItem);
	};

	this.generateArray = function() {
		var arr = [];
		for(var imdbNum in this.items) {
			arr.push(this.items[imdbNum]);
		}
		return arr;
	};
};