var routesHealthcareService = function(app, HealthcareService){
	app.get('/:apikey/HealthcareService', HealthcareService.get.healthcareService);
	//app.get('/:apikey/HealthcareServiceAvailableTime', HealthcareService.get.availableTime);
	//app.get('/:apikey/HealthcareServiceNotAvailable', HealthcareService.get.notAvailable);
	app.post('/:apikey/HealthcareService', HealthcareService.post.healthcareService);
	//app.post('/:apikey/HealthcareServiceAvailableTime', HealthcareService.post.availableTime);
	//app.post('/:apikey/HealthcareServiceNotAvailable', HealthcareService.post.notAvailable);
}
module.exports = routesHealthcareService;