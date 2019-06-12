var routesProcedure = function(app, Procedure){
	app.get('/:apikey/Procedure', Procedure.get.procedure);
	app.get('/:apikey/ProcedurePerformer', Procedure.get.procedurePerformer);
	app.get('/:apikey/ProcedureFocalDevice', Procedure.get.procedureFocalDevice);
	app.get('/:apikey/ProcedureDefinitionPlanDefinition', Procedure.get.procedureDefinitionPlanDefinition);
	app.get('/:apikey/ProcedureDefinitionActivityDefinition', Procedure.get.procedureDefinitionActivityDefinition);
	app.get('/:apikey/ProcedureDefinitionHealthcareService', Procedure.get.procedureDefinitionHealthcareService);
	app.get('/:apikey/ProcedureBasedOnCarePlan', Procedure.get.procedureBasedOnCarePlan);
	app.get('/:apikey/ProcedureBasedOnProcedureRequest', Procedure.get.procedureBasedOnProcedureRequest);
	app.get('/:apikey/ProcedureBasedOnReferralRequest', Procedure.get.procedureBasedOnReferralRequest);
	app.get('/:apikey/ProcedurePartOfProcedure', Procedure.get.procedurePartOfProcedure);
	app.get('/:apikey/ProcedurePartOfObservation', Procedure.get.procedurePartOfObservation);
	app.get('/:apikey/ProcedurePartOfMedicationAdministration', Procedure.get.procedurePartOfMedicationAdministration);
	app.get('/:apikey/ProcedureReasonReferenceCondition', Procedure.get.procedureReasonReferenceCondition);
	app.get('/:apikey/ProcedureReasonReferenceObservation', Procedure.get.procedureReasonReferenceObservation);
	app.get('/:apikey/ProcedureReport', Procedure.get.procedureReport);
	app.get('/:apikey/ProcedureComplicationDetail', Procedure.get.procedureComplicationDetail);
	app.get('/:apikey/ProcedureUsedReferenceDevice', Procedure.get.procedureUsedReferenceDevice);
	app.get('/:apikey/ProcedureUsedReferenceMedication', Procedure.get.procedureUsedReferenceMedication);
	app.get('/:apikey/ProcedureUsedReferenceSubstance', Procedure.get.procedureUsedReferenceSubstance);
	
	app.post('/:apikey/Procedure', Procedure.post.procedure);
	app.post('/:apikey/ProcedurePerformer', Procedure.post.procedurePerformer);
	app.post('/:apikey/ProcedureFocalDevice', Procedure.post.procedureFocalDevice);
	
	app.put('/:apikey/Procedure/:_id?', Procedure.put.procedure);
	app.put('/:apikey/ProcedurePerformer/:_id?/:dr?', Procedure.put.procedurePerformer);
	app.put('/:apikey/ProcedureFocalDevice/:_id?/:dr?', Procedure.put.procedureFocalDevice);
	
}
module.exports = routesProcedure;