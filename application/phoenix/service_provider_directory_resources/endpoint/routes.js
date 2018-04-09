var routesEndpoint = function(app, Endpoint){
	app.get('/:apikey/Endpoint', Endpoint.get.endpoint);
	
	app.post('/:apikey/Endpoint', Endpoint.post.endpoint);
	
	app.put('/:apikey/Endpoint/:endpoint_id', Endpoint.put.endpoint);
	
}
module.exports = routesEndpoint;