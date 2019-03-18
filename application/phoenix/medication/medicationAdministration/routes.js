var routesMedicationAdministration = function(app, MedicationAdministration){
	app.get('/:apikey/MedicationAdministration', MedicationAdministration.get.medicationAdministration);
	app.get('/:apikey/MedicationAdministrationPerformer', MedicationAdministration.get.medicationAdministrationPerformer);
	app.get('/:apikey/MedicationAdministrationDosage', MedicationAdministration.get.medicationAdministrationDosage);
	
	app.post('/:apikey/MedicationAdministration', MedicationAdministration.post.medicationAdministration);
	app.post('/:apikey/MedicationAdministrationPerformer', MedicationAdministration.post.medicationAdministrationPerformer);
	app.post('/:apikey/MedicationAdministrationDosage', MedicationAdministration.post.medicationAdministrationDosage);
	
	app.put('/:apikey/MedicationAdministration/:medication_administration_id', MedicationAdministration.put.medicationAdministration);
	app.put('/:apikey/MedicationAdministrationPerformer/:performer_id', MedicationAdministration.put.medicationAdministrationPerformer);
	app.put('/:apikey/MedicationAdministrationDosage/:dosage_id', MedicationAdministration.put.medicationAdministrationDosage);
}
module.exports = routesMedicationAdministration;