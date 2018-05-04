var routesHealthcareService= function(app, HealthcareService){
	app.get('/:apikey/HealthcareService', HealthcareService.get.healthcaerService);
	app.get('/:apikey/HealthcareService/:healthcare_service_id?/Identifier/:identifier_id?', HealthcareService.get.identifier);
	app.get('/:apikey/HealthcareService/:healthcare_service_id?/Telecom/:contact_point_id?', HealthcareService.get.telecom);
	app.get('/:apikey/HealthcareService/:healthcare_service_id?/Photo/:attachment_id?', HealthcareService.get.attachment);
	app.get('/:apikey/HealthcareService/:healthcare_service_id?/AvailableTime/:available_time_id?', HealthcareService.get.availableTime);
	app.get('/:apikey/HealthcareService/:healthcare_service_id?/NotAvailable/:not_available_id?', HealthcareService.get.notAvailable);
	
	app.post('/:apikey/HealthcareService', HealthcareService.post.healthcaerService);
	app.post('/:apikey/HealthcareService/:healthcare_service_id?/AvailableTime', HealthcareService.post.availableTime);
	app.post('/:apikey/HealthcareService/:healthcare_service_id?/NotAvailable', HealthcareService.post.notAvailable);
	app.post('/:apikey/HealthcareService/:healthcare_service_id?/Identifier', HealthcareService.post.identifier);
	app.post('/:apikey/HealthcareService/:healthcare_service_id?/Telecom', HealthcareService.post.telecom);
	app.post('/:apikey/HealthcareService/:healthcare_service_id?/Endpoint', HealthcareService.post.endpointRef);
	app.post('/:apikey/HealthcareService/:healthcare_service_id?/Location', HealthcareService.post.locationRef);
	app.post('/:apikey/HealthcareService/:healthcare_service_id?/CoverageArea', HealthcareService.post.coverageAreaRef);
	
	app.put('/:apikey/HealthcareService/:healthcare_service_id?', HealthcareService.put.healthcaerService);
	app.put('/:apikey/HealthcareService/:healthcare_service_id?/AvailableTime/:available_time_id?', HealthcareService.put.availableTime);
	app.put('/:apikey/HealthcareService/:healthcare_service_id?/NotAvailable/:not_available_id?', HealthcareService.put.notAvailable);
	app.put('/:apikey/HealthcareService/:healthcare_service_id?/Identifier/:identifier_id?', HealthcareService.put.identifier);
	app.put('/:apikey/HealthcareService/:healthcare_service_id?/Telecom/:contact_point_id?', HealthcareService.put.telecom);
	app.put('/:apikey/HealthcareService/:healthcare_service_id?/Photo/:attachment_id?', HealthcareService.put.attachment);
}
module.exports = routesHealthcareService