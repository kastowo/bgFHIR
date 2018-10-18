var routesCarePlan = function(app, CarePlan){
	app.get('/:apikey/CarePlan', CarePlan.get.carePlan);
	
	
	app.post('/:apikey/CarePlan', CarePlan.post.carePlan);
	
	
	app.put('/:apikey/CarePlan/:care_plan_id?', CarePlan.put.carePlan);
	
}
module.exports = routesCarePlan;