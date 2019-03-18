var routesCarePlan = function(app, CarePlan){
	app.get('/:apikey/CarePlan', CarePlan.get.carePlan);
	app.get('/:apikey/CarePlanActivity', CarePlan.get.carePlanActivity);
	
	app.post('/:apikey/CarePlan', CarePlan.post.carePlan);
	app.post('/:apikey/CarePlanActivity', CarePlan.post.carePlanActivity);
	app.post('/:apikey/CarePlanActivityDetail', CarePlan.post.carePlanActivityDetail);
	
	app.put('/:apikey/CarePlan/:care_plan_id', CarePlan.put.carePlan);
	app.put('/:apikey/CarePlanActivity/:care_plan_id', CarePlan.put.carePlanActivity);
	app.put('/:apikey/CarePlanActivityDetail/:care_plan_id', CarePlan.put.carePlanActivityDetail);
}
module.exports = routesCarePlan;