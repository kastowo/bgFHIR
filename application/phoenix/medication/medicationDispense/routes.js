var routesMedicationDispense = function(app, MedicationDispense){
	app.get('/:apikey/MedicationDispense', MedicationDispense.get.medicationDispense);
	app.get('/:apikey/MedicationDispensePerformer', MedicationDispense.get.medicationDispensePerformer);
	app.get('/:apikey/MedicationDispenseSubstitution', MedicationDispense.get.medicationDispenseSubstitution);
	app.get('/:apikey/MedicationDispensePartOf', MedicationDispense.get.medicationDispensePartOf);
	app.get('/:apikey/MedicationDispenseAuthorizingPrescription', MedicationDispense.get.medicationDispenseAuthorizingPrescription);
	app.get('/:apikey/MedicationDispenseReceiverPatient', MedicationDispense.get.medicationDispenseReceiverPatient);
	app.get('/:apikey/MedicationDispenseReceiverPratitioner', MedicationDispense.get.medicationDispenseReceiverPratitioner);
	app.get('/:apikey/MedicationDispenseResponsibleParty', MedicationDispense.get.medicationDispenseResponsibleParty);
	app.get('/:apikey/MedicationDispenseDetectedIssue', MedicationDispense.get.medicationDispenseDetectedIssue);
	app.get('/:apikey/MedicationDispenseProvenance', MedicationDispense.get.medicationDispenseProvenance);
	app.get('/:apikey/MedicationDispenseDosage', MedicationDispense.get.medicationDispenseDosage);
	
	app.post('/:apikey/MedicationDispense', MedicationDispense.post.medicationDispense);
	app.post('/:apikey/MedicationDispensePerformer', MedicationDispense.post.medicationDispensePerformer);
	app.post('/:apikey/MedicationDispenseSubstitution', MedicationDispense.post.medicationDispenseSubstitution);
	
	app.put('/:apikey/MedicationDispense/:_id?', MedicationDispense.put.medicationDispense);
	app.put('/:apikey/MedicationDispensePerformer/:_id?/:dr?', MedicationDispense.put.medicationDispensePerformer);
	app.put('/:apikey/MedicationDispenseSubstitution/:_id?/:dr?', MedicationDispense.put.medicationDispenseSubstitution);
	
}
module.exports = routesMedicationDispense;