var routesEndpoint = function(app, AdverseEvent){
	app.get('/:apikey/AdverseEvent', AdverseEvent.get.adverseEvent);
	/*app.get('/:apikey/AdverseEvent/:endpoint_id?/Identifier/:identifier_id?', Endpoint.get.identifier);
	app.get('/:apikey/AdverseEvent/:endpoint_id?/Telecom/:contact_point_id?', Endpoint.get.telecom);*/
	
	app.post('/:apikey/AdverseEvent', AdverseEvent.post.adverseEvent);
	/*app.post('/:apikey/Endpoint/:endpoint_id?/Identifier', Endpoint.post.identifier);
	app.post('/:apikey/Endpoint/:endpoint_id?/Telecom', Endpoint.post.telecom);*/
	
	app.put('/:apikey/AdverseEvent/:adverse_event_id?', AdverseEvent.put.adverseEvent);
	/*app.put('/:apikey/Endpoint/:endpoint_id?/Identifier/:identifier_id?', Endpoint.put.identifier);
	app.put('/:apikey/Endpoint/:endpoint_id?/Telecom/:contact_point_id?', Endpoint.put.telecom);*/
}
module.exports = routesAdverseEvent