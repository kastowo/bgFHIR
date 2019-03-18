var routesSupplyDelivery = function(app, SupplyDelivery){
	app.get('/:apikey/SupplyDelivery', SupplyDelivery.get.supplyDelivery);
	
	app.post('/:apikey/SupplyDelivery', SupplyDelivery.post.supplyDelivery);
	
	app.put('/:apikey/SupplyDelivery/:supply_delivery_id', SupplyDelivery.put.supplyDelivery);
	
}
module.exports = routesSupplyDelivery;