var routesCondition = function(app, Condition){
	app.get('/:apikey/Condition/:condition_id?', Condition.get.condition);
	app.get('/:apikey/Condition/:condition_id?/identifier/:identifier_id?', Condition.get.identifier);
	//app.get('/:apikey/Condition/:condition_id?/ConditionInvestigation/:condition_stage_id?', Condition.get.conditionStages);
	app.get('/:apikey/Condition/:condition_id?/ConditionFinding/:condition_evidence_id?', Condition.get.conditionEvidence);
	
	app.post('/:apikey/Condition', Condition.post.condition);
	app.post('/:apikey/Condition/:condition_id?/identifier', Condition.post.identifier);
	//app.post('/:apikey/Condition/:condition_id?/ConditionStages', Condition.post.conditionStages);
	app.post('/:apikey/Condition/:condition_id?/ConditionEvidence', Condition.post.conditionEvidence);
	
	
	app.put('/:apikey/Condition/:condition_id?', Condition.put.condition);
	app.put('/:apikey/Condition/:condition_id?/identifier/:identifier_id?', Condition.put.identifier);
	//app.put('/:apikey/Condition/:condition_id?/ConditionStages/:condition_stage_id?', Condition.put.conditionStages);
	app.put('/:apikey/Condition/:condition_id?/ConditionEvidence/:condition_evidence_id?', Condition.put.conditionEvidence);

	
}
module.exports = routesCondition;