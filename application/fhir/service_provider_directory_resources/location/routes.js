var routesLocation = function(app, Location){
	app.get('/:apikey/Location', Location.get);
	app.post('/:apikey/Location', Location.post);
}
module.exports = routesLocation