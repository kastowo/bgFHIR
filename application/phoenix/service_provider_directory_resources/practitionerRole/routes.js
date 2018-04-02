var routesPractitionerRole = function(app, PractitionerRole){
	app.get('/:apikey/PractitionerRole', PractitionerRole.get.practitionerRole);
	//app.get('/:apikey/AvailableTime', PractitionerRole.get.availableTime);
	//app.get('/:apikey/NotAvailable', PractitionerRole.get.notAvailable);
	app.post('/:apikey/PractitionerRole', PractitionerRole.post.practitionerRole);
	//app.post('/:apikey/AvailableTime', PractitionerRole.post.availableTime);
	//app.post('/:apikey/NotAvailable', PractitionerRole.post.notAvailable);
}
module.exports = routesPractitionerRole;