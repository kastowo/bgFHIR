var routesPractitioner= function(app, Practitioner){
	app.get('/:apikey/Practitioner', Practitioner.get);
	app.post('/:apikey/Practitioner', Practitioner.post);
}
module.exports = routesPractitioner