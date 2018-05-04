var routesLocation = function(app, Location){
	app.get('/:apikey/Location', Location.get.location);
	app.get('/:apikey/Location/:location_id?/Telecom/:contact_point_id?', Location.get.telecom);
	
	app.post('/:apikey/Location', Location.post.location);
	app.post('/:apikey/Location/:location_id?/Telecom', Location.post.telecom);
	app.post('/:apikey/Location/:location_id?/Endpoint', Location.post.endpointRef);
	
	app.put('/:apikey/Location/:location_id?', Location.put.location);
	app.put('/:apikey/Location/:location_id?/LocationPosition/:location_position_id?', Location.put.locationPosition);
	app.put('/:apikey/Location/:location_id?/Telecom/:contact_point_id?', Location.put.telecom);
	app.put('/:apikey/Location/:location_id?/Address/:address_id?', Location.put.address);
}
module.exports = routesLocation