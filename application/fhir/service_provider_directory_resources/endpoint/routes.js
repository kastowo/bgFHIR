var routesEndpoint = function(app, Endpoint){
	app.get('/:apikey/Endpoint', Endpoint.get.endpoint);
	app.get('/:apikey/Endpoint/:endpoint_id?/Identifier/:identifier_id?', Endpoint.get.identifier);
	app.get('/:apikey/Endpoint/:endpoint_id?/Telecom/:contact_point_id?', Endpoint.get.telecom);
	
	app.post('/:apikey/Endpoint', Endpoint.post.endpoint);
	app.post('/:apikey/Endpoint/:endpoint_id?/Identifier', Endpoint.post.identifier);
	app.post('/:apikey/Endpoint/:endpoint_id?/Telecom', Endpoint.post.telecom);
	
	app.put('/:apikey/Endpoint/:endpoint_id?', Endpoint.put.endpoint);
	app.put('/:apikey/Endpoint/:endpoint_id?/Identifier/:identifier_id?', Endpoint.put.identifier);
	app.put('/:apikey/Endpoint/:endpoint_id?/Telecom/:contact_point_id?', Endpoint.put.telecom);
}
module.exports = routesEndpoint