var routesCoverage = function(app, Coverage){
	
	//get method
	app.get('/:apikey/Coverage', Coverage.get.coverage);
	//post method
	app.post('/:apikey/Coverage', Coverage.post.coverage);
	//put method
	app.put('/:apikey/Coverage/:coverage_id?', Coverage.put.coverage);
	
	app.get('/:apikey/Coverage/:coverage_id?/identifier/:identifier_id?', Coverage.get.identifier);
	app.post('/:apikey/Coverage/:coverage_id?/identifier', Coverage.post.identifier);
	app.put('/:apikey/Coverage/:coverage_id?/identifier/:identifier_id?', Coverage.put.identifier);
}
module.exports = routesCoverage;
