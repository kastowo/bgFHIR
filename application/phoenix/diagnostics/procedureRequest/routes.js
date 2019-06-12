var routesProcedureRequest = function(app, ProcedureRequest){
	app.get('/:apikey/ProcedureRequest', ProcedureRequest.get.procedureRequest);
	app.get('/:apikey/ProcedureRequestDefinitionPlanDefinition', ProcedureRequest.get.procedureRequestDefinitionPlanDefinition);
	app.get('/:apikey/ProcedureRequestDefinitionActivityDefinition', ProcedureRequest.get.procedureRequestDefinitionActivityDefinition);
	app.get('/:apikey/ProcedureRequestReasonReferenceCondition', ProcedureRequest.get.procedureRequestReasonReferenceCondition);
	app.get('/:apikey/ProcedureRequestReasonReferenceObservation', ProcedureRequest.get.procedureRequestReasonReferenceObservation);
	app.get('/:apikey/ProcedureRequestSpecimen', ProcedureRequest.get.procedureRequestSpecimen);
	app.get('/:apikey/ProcedureRequestProvenance', ProcedureRequest.get.procedureRequestProvenance);
	
	app.post('/:apikey/ProcedureRequest', ProcedureRequest.post.procedureRequest);
	
	app.put('/:apikey/ProcedureRequest/:_id?', ProcedureRequest.put.procedureRequest);
	
	
}
module.exports = routesProcedureRequest;