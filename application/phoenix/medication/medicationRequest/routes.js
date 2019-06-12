var routesMedicationRequest = function(app, MedicationRequest){
	app.get('/:apikey/MedicationRequest', MedicationRequest.get.medicationRequest);
	app.get('/:apikey/MedicationRequestDefinitionPlanDefinition', MedicationRequest.get.medicationRequestDefinitionPlanDefinition);
	app.get('/:apikey/MedicationRequestDefinitionActivityDefinition', MedicationRequest.get.medicationRequestDefinitionActivityDefinition);
	app.get('/:apikey/MedicationRequestBasedOnCarePlan', MedicationRequest.get.medicationRequestBasedOnCarePlan);
	app.get('/:apikey/MedicationRequestBasedOnProcedureRequest', MedicationRequest.get.medicationRequestBasedOnProcedureRequest);
	app.get('/:apikey/MedicationRequestBasedOnReferralRequest', MedicationRequest.get.medicationRequestBasedOnReferralRequest);
	app.get('/:apikey/MedicationRequestBasedOnMedicationRequest', MedicationRequest.get.medicationRequestBasedOnMedicationRequest);
	app.get('/:apikey/MedicationRequestReasonReferenceCondition', MedicationRequest.get.medicationRequestReasonReferenceCondition);
	app.get('/:apikey/MedicationRequestReasonReferenceObservation', MedicationRequest.get.medicationRequestReasonReferenceObservation);
	app.get('/:apikey/MedicationRequestDosage', MedicationRequest.get.medicationRequestDosage);
	app.get('/:apikey/MedicationRequestDetectedIssue', MedicationRequest.get.medicationRequestDetectedIssue);
	app.get('/:apikey/MedicationRequestProvenance', MedicationRequest.get.medicationRequestProvenance);
	
	app.post('/:apikey/MedicationRequest', MedicationRequest.post.medicationRequest);
	
	app.put('/:apikey/MedicationRequest/:_id?', MedicationRequest.put.medicationRequest);
	
}
module.exports = routesMedicationRequest;