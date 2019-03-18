var routesProcessRequest = function(app, ProcessRequest){
	app.get('/:apikey/ProcessRequest', ProcessRequest.get.processRequest);
	app.get('/:apikey/ProcessRequestItem', ProcessRequest.get.processRequestItem);
	
	app.post('/:apikey/ProcessRequest', ProcessRequest.post.processRequest);
	app.post('/:apikey/ProcessRequestItem', ProcessRequest.post.processRequestItem);
	
	app.put('/:apikey/ProcessRequest/:process_request_id', ProcessRequest.put.processRequest);
	app.put('/:apikey/ProcessRequestItem/:item_id', ProcessRequest.put.processRequestItem);
	
}
module.exports = routesProcessRequest;