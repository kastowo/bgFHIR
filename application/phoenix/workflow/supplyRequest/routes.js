var routesSupplyRequest = function(app, SupplyRequest){
	app.get('/:apikey/SupplyRequest', SupplyRequest.get.supplyRequest);
	
	app.post('/:apikey/SupplyRequest', SupplyRequest.post.supplyRequest);
	
	app.put('/:apikey/SupplyRequest/:supply_request_id', SupplyRequest.put.supplyRequest);
	
}
module.exports = routesSupplyRequest;