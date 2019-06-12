var routesMedicationStatement = function(app, MedicationStatement){
	app.get('/:apikey/MedicationStatement', MedicationStatement.get.medicationStatement);
	app.get('/:apikey/MedicationStatementBasedOnCarePlan', MedicationStatement.get.medicationStatementBasedOnCarePlan);
	app.get('/:apikey/MedicationStatementBasedOnProcedureRequest', MedicationStatement.get.medicationStatementBasedOnProcedureRequest);
	app.get('/:apikey/MedicationStatementBasedOnReferralRequest', MedicationStatement.get.medicationStatementBasedOnReferralRequest);
	app.get('/:apikey/MedicationStatementBasedOnMedicationRequest', MedicationStatement.get.medicationStatementBasedOnMedicationRequest);
	app.get('/:apikey/MedicationStatementPartOfMedicationAdministration', MedicationStatement.get.medicationStatementPartOfMedicationAdministration);
	app.get('/:apikey/MedicationStatementPartOfMedicationDispense', MedicationStatement.get.medicationStatementPartOfMedicationDispense);
	app.get('/:apikey/MedicationStatementPartOfMedicationStatement', MedicationStatement.get.medicationStatementPartOfMedicationStatement);
	app.get('/:apikey/MedicationStatementPartOfProcedure', MedicationStatement.get.medicationStatementPartOfProcedure);
	app.get('/:apikey/MedicationStatementPartOfObservation', MedicationStatement.get.medicationStatementPartOfObservation);
	app.get('/:apikey/MedicationStatementReasonReferenceCondition', MedicationStatement.get.medicationStatementReasonReferenceCondition);
	app.get('/:apikey/MedicationStatementReasonReferenceObservation', MedicationStatement.get.medicationStatementReasonReferenceObservation);
	
	app.post('/:apikey/MedicationStatement', MedicationStatement.post.medicationStatement);
	
	app.put('/:apikey/MedicationStatement/:_id?', MedicationStatement.put.medicationStatement);
	
	
}
module.exports = routesMedicationStatement;