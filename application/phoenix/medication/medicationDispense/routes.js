var routesMedicationDispense = function(app, MedicationDispense){
	app.get('/:apikey/MedicationDispense', MedicationDispense.get.medicationDispense);
	app.get('/:apikey/MedicationDispensePerformer', MedicationDispense.get.medicationDispensePerformer);
	app.get('/:apikey/MedicationDispenseSubstitution', MedicationDispense.get.medicationDispenseSubstitution);
	
	app.post('/:apikey/MedicationDispense', MedicationDispense.post.medicationDispense);
	app.post('/:apikey/MedicationDispensePerformer', MedicationDispense.post.medicationDispensePerformer);
	app.post('/:apikey/MedicationDispenseSubstitution', MedicationDispense.post.medicationDispenseSubstitution);
	
	app.put('/:apikey/MedicationDispense/:medication_dispense_id', MedicationDispense.put.medicationDispense);
	app.put('/:apikey/MedicationDispensePerformer/:performer_id', MedicationDispense.put.medicationDispensePerformer);
	app.put('/:apikey/MedicationDispenseSubstitution/:substitution_id', MedicationDispense.put.medicationDispenseSubstitution);
	
}
module.exports = routesMedicationDispense;