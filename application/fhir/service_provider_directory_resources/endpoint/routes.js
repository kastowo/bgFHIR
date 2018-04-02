var routesEndpoint = function(app, Endpoint){
	app.get('/:apikey/Endpoint', Endpoint.get);
	app.post('/:apikey/Endpoint', Endpoint.post);
}
module.exports = routesEndpoint