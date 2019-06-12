var routesCarePlan = function(app, CarePlan){
	app.get('/:apikey/CarePlan', CarePlan.get.carePlan);
	app.get('/:apikey/CarePlanActivity', CarePlan.get.carePlanActivity);
	
	app.get('/:apikey/CarePlanDefinitionPlanDefinition', CarePlan.get.carePlanDefinitionPlanDefinition);
	app.get('/:apikey/CarePlanDefinitionQuestionnaire', CarePlan.get.carePlanDefinitionQuestionnaire);
	app.get('/:apikey/CarePlanBasedOn', CarePlan.get.carePlanBasedOn);
	app.get('/:apikey/CarePlanReplaces', CarePlan.get.carePlanReplaces);
	app.get('/:apikey/CarePlanPartOf', CarePlan.get.carePlanPartOf);
	app.get('/:apikey/CarePlanAuthorPatient', CarePlan.get.carePlanAuthorPatient);
	app.get('/:apikey/CarePlanAuthorPractitioner', CarePlan.get.carePlanAuthorPractitioner);
	app.get('/:apikey/CarePlanAuthorRelatedPerson', CarePlan.get.carePlanAuthorRelatedPerson);
	app.get('/:apikey/CarePlanAuthorOrganization', CarePlan.get.carePlanAuthorOrganization);
	app.get('/:apikey/CarePlanAuthorCareTeam', CarePlan.get.carePlanAuthorCareTeam);
	app.get('/:apikey/CarePlanCareTeam', CarePlan.get.carePlanCareTeam);
	app.get('/:apikey/CarePlanAddresses', CarePlan.get.carePlanAddresses);
	app.get('/:apikey/CarePlanGoal', CarePlan.get.carePlanGoal);
	app.get('/:apikey/CarePlanActivityProgress', CarePlan.get.carePlanActivityProgress);
	app.get('/:apikey/CarePlanActivityDetailReasonReference', CarePlan.get.carePlanActivityDetailReasonReference);
	app.get('/:apikey/CarePlanActivityDetailGoal', CarePlan.get.carePlanActivityDetailGoal);
	app.get('/:apikey/CarePlanActivityDetailPerformerPractitioner', CarePlan.get.carePlanActivityDetailPerformerPractitioner);
	app.get('/:apikey/CarePlanActivityDetailPerformerOrganization', CarePlan.get.carePlanActivityDetailPerformerOrganization);
	app.get('/:apikey/CarePlanActivityDetailPerformerRelatedPerson', CarePlan.get.carePlanActivityDetailPerformerRelatedPerson);
	app.get('/:apikey/CarePlanActivityDetailPerformerPatient', CarePlan.get.carePlanActivityDetailPerformerPatient);
	app.get('/:apikey/CarePlanActivityDetailPerformerCareTeam', CarePlan.get.carePlanActivityDetailPerformerCareTeam);
	app.get('/:apikey/CarePlanNote', CarePlan.get.carePlanNote);
	
	app.post('/:apikey/CarePlan', CarePlan.post.carePlan);
	app.post('/:apikey/CarePlanActivity', CarePlan.post.carePlanActivity);
	app.post('/:apikey/CarePlanActivityDetail', CarePlan.post.carePlanActivityDetail);
	
	app.put('/:apikey/CarePlan/:_id?', CarePlan.put.carePlan);
	app.put('/:apikey/CarePlanActivity/:_id?/:dr?', CarePlan.put.carePlanActivity);
	app.put('/:apikey/CarePlanActivityDetail/:_id?/:dr?', CarePlan.put.carePlanActivityDetail);
}
module.exports = routesCarePlan;