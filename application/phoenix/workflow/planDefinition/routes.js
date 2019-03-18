var routesPlanDefinition = function(app, PlanDefinition){
	app.get('/:apikey/PlanDefinition', PlanDefinition.get.planDefinition);
	app.get('/:apikey/PlanDefinitionAction', PlanDefinition.get.planDefinitionAction);
	app.get('/:apikey/PlanDefinitionGoal', PlanDefinition.get.planDefinitionGoal);
	app.get('/:apikey/PlanDefinitionGoalTarget', PlanDefinition.get.planDefinitionGoalTarget);
	app.get('/:apikey/PlanDefinitionActionCondition', PlanDefinition.get.planDefinitionActionCondition);
	app.get('/:apikey/PlanDefinitionActionRelatedAction', PlanDefinition.get.planDefinitionActionRelatedAction);
	app.get('/:apikey/PlanDefinitionActionParticipant', PlanDefinition.get.planDefinitionActionParticipant);
	app.get('/:apikey/PlanDefinitionActionDynamicValue', PlanDefinition.get.planDefinitionActionDynamicValue);
	
	app.post('/:apikey/PlanDefinition', PlanDefinition.post.planDefinition);
	app.post('/:apikey/PlanDefinitionAction', PlanDefinition.post.planDefinitionAction);
	app.post('/:apikey/PlanDefinitionGoal', PlanDefinition.post.planDefinitionGoal);
	app.post('/:apikey/PlanDefinitionGoalTarget', PlanDefinition.post.planDefinitionGoalTarget);
	app.post('/:apikey/PlanDefinitionActionCondition', PlanDefinition.post.planDefinitionActionCondition);
	app.post('/:apikey/PlanDefinitionActionRelatedAction', PlanDefinition.post.planDefinitionActionRelatedAction);
	app.post('/:apikey/PlanDefinitionActionParticipant', PlanDefinition.post.planDefinitionActionParticipant);
	app.post('/:apikey/PlanDefinitionActionDynamicValue', PlanDefinition.post.planDefinitionActionDynamicValue);
	
	app.put('/:apikey/PlanDefinition/:plan_definition_id', PlanDefinition.put.planDefinition);
	app.put('/:apikey/PlanDefinitionAction/:action_id', PlanDefinition.put.planDefinitionAction);
	app.put('/:apikey/PlanDefinitionGoal/:goal_id', PlanDefinition.put.planDefinitionGoal);
	app.put('/:apikey/PlanDefinitionGoalTarget/:target_id', PlanDefinition.put.planDefinitionGoalTarget);
	app.put('/:apikey/PlanDefinitionActionCondition/:condition_id', PlanDefinition.put.planDefinitionActionCondition);
	app.put('/:apikey/PlanDefinitionActionRelatedAction/:related_action_id', PlanDefinition.put.planDefinitionActionRelatedAction);
	app.put('/:apikey/PlanDefinitionActionParticipant/:participant_id', PlanDefinition.put.planDefinitionActionParticipant);
	app.put('/:apikey/PlanDefinitionActionDynamicValue/:dynamic_value_id', PlanDefinition.put.planDefinitionActionDynamicValue);
	
}
module.exports = routesPlanDefinition;