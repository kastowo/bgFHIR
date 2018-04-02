var routesHealthcareService= function(app, HealthcareService){
	app.get('/:apikey/HealthcareService', HealthcareService.get);
	app.post('/:apikey/HealthcareService', HealthcareService.post);
}
module.exports = routesHealthcareService