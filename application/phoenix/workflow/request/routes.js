var routesRequest = function(app, Request){
	app.get('/:apikey/Request', Request.get.request);
	
	app.post('/:apikey/Request', Request.post.request);
	
	app.put('/:apikey/Request/:request_id', Request.put.request);
	
}
module.exports = routesRequest;