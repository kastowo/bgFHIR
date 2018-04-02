var routesLocation = function(app, Location){
	app.get('/:apikey/Location', Location.get.Location);
	app.get('/:apikey/LocationPosition', Location.get.LocationPosition);
	
	app.post('/:apikey/Location', Location.post.location);
	app.post('/:apikey/LocationPosition', Location.post.locationPosition);
	
}
module.exports = routesLocation;