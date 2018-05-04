var routesPractitionerRole= function(app, PractitionerRole){
	app.get('/:apikey/PractitionerRole', PractitionerRole.get.practitionerRole);
	app.get('/:apikey/PractitionerRole/:practitioner_role_id?/AvailableTime/:available_time_id?', PractitionerRole.get.availableTime);
	app.get('/:apikey/PractitionerRole/:practitioner_role_id?/NotAvailable/:not_available_id?', PractitionerRole.get.notAvailable);
	app.get('/:apikey/PractitionerRole/:practitioner_role_id?/Identifier/:identifier_id?', PractitionerRole.get.identifier);
	app.get('/:apikey/PractitionerRole/:practitioner_role_id?/Telecom/:contact_point_id?', PractitionerRole.get.telecom);
	
	app.post('/:apikey/PractitionerRole', PractitionerRole.post.practitionerRole);
	app.post('/:apikey/PractitionerRole/:practitioner_role_id?/AvailableTime', PractitionerRole.post.availableTime);
	app.post('/:apikey/PractitionerRole/:practitioner_role_id?/NotAvailable', PractitionerRole.post.notAvailable);
	app.post('/:apikey/PractitionerRole/:practitioner_role_id?/Identifier', PractitionerRole.post.identifier);
	app.post('/:apikey/PractitionerRole/:practitioner_role_id?/Telecom', PractitionerRole.post.telecom);
	app.post('/:apikey/PractitionerRole/:practitioner_role_id?/Endpoint', PractitionerRole.post.endpointRef);
	app.post('/:apikey/PractitionerRole/:practitioner_role_id?/Location', PractitionerRole.post.locationRef);
	app.post('/:apikey/PractitionerRole/:practitioner_role_id?/HealthcareService', PractitionerRole.post.healthcareServiceRef);
	
	app.put('/:apikey/PractitionerRole/:practitioner_role_id?', PractitionerRole.put.practitionerRole);
	app.put('/:apikey/PractitionerRole/:practitioner_role_id?/AvailableTime/:available_time_id?', PractitionerRole.put.availableTime);
	app.put('/:apikey/PractitionerRole/:practitioner_role_id?/NotAvailable/:not_available_id?', PractitionerRole.put.notAvailable);
	app.put('/:apikey/PractitionerRole/:practitioner_role_id?/Identifier/:identifier_id?', PractitionerRole.put.identifier);
	app.put('/:apikey/PractitionerRole/:practitioner_role_id?/Telecom/:contact_point_id?', PractitionerRole.put.telecom);
	
	
}
module.exports = routesPractitionerRole