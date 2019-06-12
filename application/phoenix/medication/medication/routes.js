var routesMedication = function(app, Medication){
	app.get('/:apikey/Medication', Medication.get.medication);
	app.get('/:apikey/MedicationIngredient', Medication.get.medicationIngredient);
	app.get('/:apikey/MedicationPackageContent', Medication.get.medicationPackageContent);
	app.get('/:apikey/MedicationPackageBatch', Medication.get.medicationPackageBatch);
	
	app.post('/:apikey/Medication', Medication.post.medication);
	app.post('/:apikey/MedicationIngredient', Medication.post.medicationIngredient);
	app.post('/:apikey/MedicationPackageContent', Medication.post.medicationPackageContent);
	app.post('/:apikey/MedicationPackageBatch', Medication.post.medicationPackageBatch);
	
	app.put('/:apikey/Medication/:_id?', Medication.put.medication);
	app.put('/:apikey/MedicationIngredient/:_id?/:dr?', Medication.put.medicationIngredient);
	app.put('/:apikey/MedicationPackageContent/:_id?/:dr?', Medication.put.medicationPackageContent);
	app.put('/:apikey/MedicationPackageBatch/:_id?/:dr?', Medication.put.medicationPackageBatch);
}
module.exports = routesMedication;