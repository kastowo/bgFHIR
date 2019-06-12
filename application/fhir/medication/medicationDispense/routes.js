var routesMedicationDispense = function(app, MedicationDispense){
	app.get('/:apikey/MedicationDispense', MedicationDispense.get.medicationDispense);
	app.get('/:apikey/MedicationDispense/:medication_dispense_id?/identifier/:identifier_id?', MedicationDispense.get.identifier);
	app.get('/:apikey/MedicationDispense/:medication_dispense_id?/medicationDispensePerformer/:medication_dispense_performer_id?', MedicationDispense.get.medicationDispensePerformer);
	/*app.get('/:apikey/MedicationDispense/:medication_dispense_id?/medicationDispenseSubstitution/:medication_dispense_substitution_id?', MedicationDispense.get.medicationDispenseSubstitution);*/
	app.get('/:apikey/MedicationDispense/:medication_dispense_id?/dosage/:dosage_id?', MedicationDispense.get.medicationDispenseDosage);


	app.post('/:apikey/MedicationDispense', MedicationDispense.post.medicationDispense);
	app.post('/:apikey/MedicationDispense/:medication_dispense_id?/identifier', MedicationDispense.post.identifier);
	app.post('/:apikey/MedicationDispense/:medication_dispense_id?/medicationDispensePerformer', MedicationDispense.post.medicationDispensePerformer);
	/*app.post('/:apikey/MedicationDispense/:medication_dispense_id?/medicationDispenseSubstitution', MedicationDispense.post.medicationDispenseSubstitution);*/
	app.post('/:apikey/MedicationDispense/:medication_dispense_id?/Dosage', MedicationDispense.post.dosage);

	app.put('/:apikey/MedicationDispense/:medication_dispense_id?', MedicationDispense.put.medicationDispense);
	app.put('/:apikey/MedicationDispense/:medication_dispense_id?/identifier/:identifier_id?', MedicationDispense.put.identifier);
	app.put('/:apikey/MedicationDispense/:medication_dispense_id?/medicationDispensePerformer/:medication_dispense_performer_id?', MedicationDispense.put.medicationDispensePerformer);
	app.put('/:apikey/MedicationDispense/:medication_dispense_id?/medicationDispenseSubstitution/:medication_dispense_substitution_id?', MedicationDispense.put.medicationDispenseSubstitution);
	app.put('/:apikey/MedicationDispense/:medication_dispense_id?/Dosage/:dosage_id?', MedicationDispense.put.dosage);
	app.put('/:apikey/MedicationDispense/:medication_dispense_id?/Dosage/:dosage_id?/timing/:timing_id?', MedicationDispense.put.timing);
}
module.exports = routesMedicationDispense