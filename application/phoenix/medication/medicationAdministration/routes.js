var routesMedicationAdministration = function(app, MedicationAdministration){
	app.get('/:apikey/MedicationAdministration', MedicationAdministration.get.medicationAdministration);
	app.get('/:apikey/MedicationAdministrationPerformer', MedicationAdministration.get.medicationAdministrationPerformer);
	app.get('/:apikey/MedicationAdministrationDosage', MedicationAdministration.get.medicationAdministrationDosage);
	
	app.get('/:apikey/MedicationAdministrationDefinitionPlanDefinition', MedicationAdministration.get.medicationAdministrationDefinitionPlanDefinition);
	app.get('/:apikey/MedicationAdministrationDefinitionActivityDefinition', MedicationAdministration.get.medicationAdministrationDefinitionActivityDefinition);
	app.get('/:apikey/MedicationAdministrationPartOfMedicationAdministration', MedicationAdministration.get.medicationAdministrationPartOfMedicationAdministration);
	app.get('/:apikey/MedicationAdministrationPartOfProcedure', MedicationAdministration.get.medicationAdministrationPartOfProcedure);
	app.get('/:apikey/MedicationAdministrationReasonReferenceCondition', MedicationAdministration.get.medicationAdministrationReasonReferenceCondition);
	app.get('/:apikey/MedicationAdministrationReasonReferenceObservation', MedicationAdministration.get.medicationAdministrationReasonReferenceObservation);
	app.get('/:apikey/MedicationAdministrationDevice', MedicationAdministration.get.medicationAdministrationDevice);
	app.get('/:apikey/MedicationAdministrationProvenance', MedicationAdministration.get.medicationAdministrationProvenance);
	
	app.post('/:apikey/MedicationAdministration', MedicationAdministration.post.medicationAdministration);
	app.post('/:apikey/MedicationAdministrationPerformer', MedicationAdministration.post.medicationAdministrationPerformer);
	app.post('/:apikey/MedicationAdministrationDosage', MedicationAdministration.post.medicationAdministrationDosage);
	
	app.put('/:apikey/MedicationAdministration/:_id?', MedicationAdministration.put.medicationAdministration);
	app.put('/:apikey/MedicationAdministrationPerformer/:_id?/:dr?', MedicationAdministration.put.medicationAdministrationPerformer);
	app.put('/:apikey/MedicationAdministrationDosage/:_id?/:dr?', MedicationAdministration.put.medicationAdministrationDosage);
}
module.exports = routesMedicationAdministration;