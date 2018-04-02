var routesPractitionerRole= function(app, PractitionerRole){
	app.get('/:apikey/PractitionerRole', PractitionerRole.get);
	app.post('/:apikey/PractitionerRole', PractitionerRole.post);
}
module.exports = routesPractitionerRole