var routesCondition = function(app, Condition){
	app.get('/:apikey/Condition', Condition.get.condition);
	app.get('/:apikey/ConditionStages', Condition.get.conditionStages);
	app.get('/:apikey/ConditionStagesAssessment', Condition.get.conditionStagesAssessment);
	app.get('/:apikey/ConditionEvidence', Condition.get.conditionEvidence);
	
	app.post('/:apikey/Condition', Condition.post.condition);
	app.post('/:apikey/ConditionStages', Condition.post.conditionStages);
	app.post('/:apikey/ConditionEvidence', Condition.post.conditionEvidence);
	
	app.put('/:apikey/Condition/:care_team_id', Condition.put.condition);
	app.put('/:apikey/ConditionStages/:stage_id', Condition.put.conditionStages);
	app.put('/:apikey/ConditionEvidence/:evidence_id', Condition.put.conditionEvidence);
	
}
module.exports = routesCondition;