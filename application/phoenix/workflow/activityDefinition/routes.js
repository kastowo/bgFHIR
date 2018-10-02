var routesActivityDefinition = function(app, ActivityDefinition){
	app.get('/:apikey/ActivityDefinition', ActivityDefinition.get.activityDefinition);
	app.get('/:apikey/ActivityDefinitionParticipant', ActivityDefinition.get.activityDefinitionParticipant);
	app.get('/:apikey/ActivityDefinitionDynamicValue', ActivityDefinition.get.activityDefinitionDynamicValue);
	
	app.post('/:apikey/ActivityDefinition', ActivityDefinition.post.activityDefinition);
	app.post('/:apikey/ActivityDefinitionParticipant', ActivityDefinition.post.activityDefinitionParticipant);
	app.post('/:apikey/ActivityDefinitionDynamicValue', ActivityDefinition.post.activityDefinitionDynamicValue);
	
	app.put('/:apikey/ActivityDefinition/:activity_definition_id', ActivityDefinition.put.activityDefinition);
	app.put('/:apikey/ActivityDefinitionParticipant/:participant_id', ActivityDefinition.put.activityDefinitionParticipant);
	app.put('/:apikey/ActivityDefinitionDynamicValue/:dynamic_value_id', ActivityDefinition.put.activityDefinitionDynamicValue);
	
}
module.exports = routesActivityDefinition;