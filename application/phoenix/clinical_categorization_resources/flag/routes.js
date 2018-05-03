var routesFlag = function(app, Flag){
	app.get('/:apikey/Flag', Flag.get.flag);
	
	app.post('/:apikey/Flag', Flag.post.flag);
	
	app.put('/:apikey/Flag/:_id?', Flag.put.flag);
	
}
module.exports = routesFlag;