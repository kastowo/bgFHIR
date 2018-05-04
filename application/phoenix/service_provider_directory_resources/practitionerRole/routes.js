var routesPractitionerRole = function(app, PractitionerRole){
	app.get('/:apikey/PractitionerRole', PractitionerRole.get.practitionerRole);
	app.get('/:apikey/PractitionerRole/Endpoint', PractitionerRole.get.endpoint);
	app.get('/:apikey/PractitionerRole/Location', PractitionerRole.get.location);
	app.get('/:apikey/PractitionerRole/HealthcareService', PractitionerRole.get.healthcareService);
	//app.get('/:apikey/AvailableTime', PractitionerRole.get.availableTime);
	//app.get('/:apikey/NotAvailable', PractitionerRole.get.notAvailable);
	app.post('/:apikey/PractitionerRole', PractitionerRole.post.practitionerRole);
	app.post('/:apikey/PractitionerRole/Endpoint', PractitionerRole.post.endpoint);
	app.post('/:apikey/PractitionerRole/Location', PractitionerRole.post.location);
	app.post('/:apikey/PractitionerRole/HealthcareService', PractitionerRole.post.healthcareService);
	//app.post('/:apikey/AvailableTime', PractitionerRole.post.availableTime);
	//app.post('/:apikey/NotAvailable', PractitionerRole.post.notAvailable);
	app.put('/:apikey/PractitionerRole/:practitioner_role_id?', PractitionerRole.put.practitionerRole);
}
module.exports = routesPractitionerRole;