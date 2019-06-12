var routesMedicationAdministration = function(app, MedicationAdministration){
	app.get('/:apikey/MedicationAdministration', MedicationAdministration.get.medicationAdministration);
	app.get('/:apikey/MedicationAdministration/:medication_administration_id?/identifier/:identifier_id?', MedicationAdministration.get.identifier);
	app.get('/:apikey/MedicationAdministration/:medication_administration_id?/medicationAdministrationPerformer/:medication_administration_performer_id?', MedicationAdministration.get.medicationAdministrationPerformer);
	/*app.get('/:apikey/MedicationAdministration/:medication_administration_id?/medicationAdministrationDosage/:medication_administration_dosage_id?', MedicationAdministration.get.medicationAdministrationDosage);*/

	app.post('/:apikey/MedicationAdministration', MedicationAdministration.post.medicationAdministration);
	app.post('/:apikey/MedicationAdministration/:medication_administration_id?/identifier', MedicationAdministration.post.identifier);
	app.post('/:apikey/MedicationAdministration/:medication_administration_id?/medicationAdministrationPerformer', MedicationAdministration.post.medicationAdministrationPerformer);
	/*app.post('/:apikey/MedicationAdministration/:medication_administration_id?/medicationAdministrationDosage', MedicationAdministration.post.medicationAdministrationDosage);*/

	app.put('/:apikey/MedicationAdministration/:medication_administration_id?', MedicationAdministration.put.medicationAdministration);
	app.put('/:apikey/MedicationAdministration/:medication_administration_id?/identifier/:identifier_id?', MedicationAdministration.put.identifier);
	app.put('/:apikey/MedicationAdministration/:medication_administration_id?/medicationAdministrationPerformer/:medication_administration_performer_id?', MedicationAdministration.put.medicationAdministrationPerformer);
	app.put('/:apikey/MedicationAdministration/:medication_administration_id?/medicationAdministrationDosage/:medication_administration_dosage_id?', MedicationAdministration.put.medicationAdministrationDosage);
}
module.exports = routesMedicationAdministration