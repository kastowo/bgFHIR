var routesMedication = function(app, Medication){
	app.get('/:apikey/Medication', Medication.get.medication);
	app.get('/:apikey/Medication/:medication_id?/MedicationIngredient/:medication_ingredient_id?', Medication.get.medicationIngredient);
	app.get('/:apikey/Medication/:medication_id?/medicationPackageContent/:medication_package_content_id?', Medication.get.medicationIngredient);
	app.get('/:apikey/Medication/:medication_id?/medicationPackageBatch/:medication_package_batch_id?', Medication.get.medicationIngredient);
	app.get('/:apikey/Medication/:medication_id?/Photo/:attachment_id?', Medication.get.attachment);
		
	app.post('/:apikey/Medication', Medication.post.medication);
	app.post('/:apikey/Medication/:medication_id?/MedicationIngredient', Medication.post.medicationIngredient);
	app.post('/:apikey/Medication/:medication_id?/medicationPackageContent', Medication.post.medicationIngredient);
	app.post('/:apikey/Medication/:medication_id?/medicationPackageBatch', Medication.post.medicationIngredient);
	app.post('/:apikey/Medication/:medication_id?/attachment', Medication.post.attachment);
	
	app.put('/:apikey/Medication/:medication_id?', Medication.put.medication);
	app.put('/:apikey/Medication/:medication_id?/MedicationIngredient/:medication_ingredient_id?', Medication.put.medicationIngredient);
	app.put('/:apikey/Medication/:medication_id?/medicationPackageContent/:medication_package_content_id?', Medication.put.medicationIngredient);
	app.put('/:apikey/Medication/:medication_id?/medicationPackageBatch/:medication_package_batch_id?', Medication.put.medicationIngredient);
	app.put('/:apikey/Medication/:medication_id?/attachment/:attachment_id?', Medication.put.attachment);
	
}
module.exports = routesMedication