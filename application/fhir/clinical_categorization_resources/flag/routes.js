var routesFlag = function(app, Flag){
	//get method
	app.get('/:apikey/Flag', Flag.get.flag);

	//post method
	app.post('/:apikey/Flag', Flag.post.flag);
	app.post('/:apikey/Flag/:flag_id?/identifier', Flag.post.identifier);

	//put method
	app.put('/:apikey/Flag/:flag_id?', Flag.put.flag);
	app.put('/:apikey/Flag/:flag_id?/identifier/:identifier_id?', Flag.put.identifier);

}
module.exports = routesFlag;