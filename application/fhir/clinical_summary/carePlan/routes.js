var routesCarePlan = function(app, CarePlan){
	app.get('/:apikey/CarePlan/:care_plan_id?', CarePlan.get.carePlan);
	app.get('/:apikey/CarePlan/:care_plan_id?/identifier/:identifier_id?', CarePlan.get.identifier);
	app.get('/:apikey/CarePlan/:care_plan_id?/CarePlanActivity/:care_plan_activity_id?', CarePlan.get.carePlanActivity);
	
	app.post('/:apikey/CarePlan', CarePlan.post.carePlan);
	app.post('/:apikey/CarePlan/:care_plan_id?/identifier', CarePlan.post.identifier);
	app.post('/:apikey/CarePlan/:care_plan_id?/CarePlanActivity', CarePlan.post.carePlanActivity);
	app.post('/:apikey/CarePlan/:care_plan_id?/CarePlanNote', CarePlan.post.carePlanNote);
	app.post('/:apikey/CarePlanActivity/:care_plan_activity_id?/CarePlanActivityDetail', CarePlan.post.carePlanActivityDetail);
	app.post('/:apikey/CarePlanActivity/:care_plan_activity_id?/CarePlanActivityNote', CarePlan.post.carePlanActivityNote);
	
	app.put('/:apikey/CarePlan/:care_plan_id?', CarePlan.put.carePlan);
	app.put('/:apikey/CarePlan/:care_plan_id?/identifier/:identifier_id?', CarePlan.put.identifier);
	app.put('/:apikey/CarePlan/:care_plan_id?/CarePlanActivity/:care_plan_activity_id?', CarePlan.put.carePlanActivity);
	app.put('/:apikey/CarePlan/:care_plan_id?/CarePlanNote/:care_plan_note_id?', CarePlan.put.carePlanNote);
	app.put('/:apikey/CarePlanActivity/:care_plan_activity_id?/CarePlanActivityDetail/:care_plan_activity_detail_id?', CarePlan.put.carePlanActivityDetail);
	app.put('/:apikey/CarePlanActivity/:care_plan_activity_id?/CarePlanActivityNote/:care_plan_activity_note_id?', CarePlan.put.carePlanActivityNote);
	app.put('/:apikey/CarePlanActivity/:care_plan_activity_id?/CarePlanActivityTiming/:care_plan_activity_timing_id?', CarePlan.put.carePlanActivityTiming);
	
}
module.exports = routesCarePlan;