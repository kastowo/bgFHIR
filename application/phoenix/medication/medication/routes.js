var routesMedication = function(app, Medication){
	app.get('/:apikey/Medication', Medication.get.medication);
	app.get('/:apikey/MedicationIngredient', Medication.get.medicationIngredient);
	app.get('/:apikey/MedicationPackage', Medication.get.medicationPackage);
	app.get('/:apikey/MedicationPackageContent', Medication.get.medicationPackageContent);
	app.get('/:apikey/MedicationPackageBatch', Medication.get.medicationPackageBatch);
	
	app.post('/:apikey/Medication', Medication.post.medication);
	app.post('/:apikey/MedicationIngredient', Medication.post.medicationIngredient);
	app.post('/:apikey/MedicationPackage', Medication.post.medicationPackage);
	app.post('/:apikey/MedicationPackageContent', Medication.post.medicationPackageContent);
	app.post('/:apikey/MedicationPackageBatch', Medication.post.medicationPackageBatch);
	
	app.put('/:apikey/Medication/:medication_id', Medication.put.medication);
	app.put('/:apikey/MedicationIngredient/:ingredient_id', Medication.put.medicationIngredient);
	app.put('/:apikey/MedicationPackage/:package_id', Medication.put.medicationPackage);
	app.put('/:apikey/MedicationPackageContent/:content_id', Medication.put.medicationPackageContent);
	app.put('/:apikey/MedicationPackageBatch/:batch_id', Medication.put.medicationPackageBatch);
}
module.exports = routesMedication;