var routesEndpoint = function(app, Endpoint){
	app.get('/:apikey/Endpoint', Endpoint.get.endpoint);
	
	app.post('/:apikey/Endpoint', Endpoint.post.endpoint);
	
}
module.exports = routesEndpoint;