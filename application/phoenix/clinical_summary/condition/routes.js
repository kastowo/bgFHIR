var routesCondition = function(app, Condition){
	app.get('/:apikey/Condition', Condition.get.condition);
	//app.get('/:apikey/ConditionStages', Condition.get.conditionStages);
	app.get('/:apikey/ConditionEvidence', Condition.get.conditionEvidence);
	app.get('/:apikey/ConditionStageAssessmentClinicalImpression', Condition.get.conditionStageAssessmentClinicalImpression);
	app.get('/:apikey/ConditionStageAssessmentDiagnosticReport', Condition.get.conditionStageAssessmentDiagnosticReport);
	app.get('/:apikey/ConditionStageAssessmentObservation', Condition.get.conditionStageAssessmentObservation);
	
	app.post('/:apikey/Condition', Condition.post.condition);
	//app.post('/:apikey/ConditionStages', Condition.post.conditionStages);
	app.post('/:apikey/ConditionEvidence', Condition.post.conditionEvidence);
	
	app.put('/:apikey/Condition/:_id?', Condition.put.condition);
	//app.put('/:apikey/ConditionStages/:_id?/:dr?', Condition.put.conditionStages);
	app.put('/:apikey/ConditionEvidence/:_id?/:dr?', Condition.put.conditionEvidence);
	
}
module.exports = routesCondition;