var routesHealthcareService = function(app, HealthcareService){
	app.get('/:apikey/HealthcareService', HealthcareService.get.healthcareService);
	app.get('/:apikey/HealthcareService/Endpoint', HealthcareService.get.endpoint);
	app.get('/:apikey/HealthcareService/Location', HealthcareService.get.location);
	app.get('/:apikey/HealthcareService/CoverageArea', HealthcareService.get.coverageArea);
	//app.get('/:apikey/HealthcareServiceAvailableTime', HealthcareService.get.availableTime);
	//app.get('/:apikey/HealthcareServiceNotAvailable', HealthcareService.get.notAvailable);
	
	app.post('/:apikey/HealthcareService', HealthcareService.post.healthcareService);
	app.post('/:apikey/HealthcareService/Endpoint', HealthcareService.post.endpoint);
	app.post('/:apikey/HealthcareService/Location', HealthcareService.post.location);
	app.post('/:apikey/HealthcareService/CoverageArea', HealthcareService.post.coverageArea);
	//app.post('/:apikey/HealthcareServiceAvailableTime', HealthcareService.post.availableTime);
	//app.post('/:apikey/HealthcareServiceNotAvailable', HealthcareService.post.notAvailable);
	app.put('/:apikey/HealthcareService/:healthcare_service_id?', HealthcareService.put.healthcareService);
}
module.exports = routesHealthcareService;