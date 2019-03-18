var routesDefinition = function(app, Definition){
	app.get('/:apikey/Definition', Definition.get.definition);
	app.get('/:apikey/DefinitionContactDetail', Definition.get.definitionContactDetail);
	app.get('/:apikey/DefinitionUsageContext', Definition.get.definitionUsageContext);
	
	app.post('/:apikey/Definition', Definition.post.definition);
	app.post('/:apikey/DefinitionContactDetail', Definition.post.definitionContactDetail);
	app.post('/:apikey/DefinitionUsageContext', Definition.post.definitionUsageContext);
	
	app.put('/:apikey/Definition/:definition_id', Definition.put.definition);
	app.put('/:apikey/DefinitionContactDetail/:contact_detail_id', Definition.put.definitionContactDetail);
	app.put('/:apikey/DefinitionUsageContext/:usage_context_id', Definition.put.definitionUsageContext);
	
}
module.exports = routesDefinition;