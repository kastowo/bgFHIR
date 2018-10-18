var routesAllergyIntolerance = function(app, AllergyIntolerance){
	app.get('/:apikey/AllergyIntolerance', AllergyIntolerance.get.allergyIntolerance);
	/*app.get('/:apikey/AllergyIntolerance/:endpoint_id?/Identifier/:identifier_id?', Endpoint.get.identifier);
	app.get('/:apikey/AllergyIntolerance/:endpoint_id?/Telecom/:contact_point_id?', Endpoint.get.telecom);*/
	
	app.post('/:apikey/AllergyIntolerance', AllergyIntolerance.post.allergyIntolerance);
	/*app.post('/:apikey/Endpoint/:endpoint_id?/Identifier', Endpoint.post.identifier);
	app.post('/:apikey/Endpoint/:endpoint_id?/Telecom', Endpoint.post.telecom);*/
	
	app.put('/:apikey/AllergyIntolerance/:adverse_event_id?', AllergyIntolerance.put.allergyIntolerance);
	/*app.put('/:apikey/Endpoint/:endpoint_id?/Identifier/:identifier_id?', Endpoint.put.identifier);
	app.put('/:apikey/Endpoint/:endpoint_id?/Telecom/:contact_point_id?', Endpoint.put.telecom);*/
}
module.exports = routesAllergyIntolerance;