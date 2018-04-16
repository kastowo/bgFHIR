var routesLocation = function(app, Location){
	app.get('/:apikey/Location', Location.get.Location);
	app.get('/:apikey/LocationPosition', Location.get.LocationPosition);
	
	app.post('/:apikey/Location', Location.post.location);
	app.post('/:apikey/LocationPosition', Location.post.locationPosition);
	
	app.put('/:apikey/Location/:location_id', Location.put.location);
	app.put('/:apikey/LocationPosition/:location_position_id/:dr?', Location.put.locationPosition);
	
}
module.exports = routesLocation;