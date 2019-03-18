var routesMedicationAdministration = function(app, MedicationAdministration){
	app.get('/:apikey/MedicationAdministration', MedicationAdministration.get.medicationAdministration);
		
	app.post('/:apikey/MedicationAdministration', MedicationAdministration.post.medicationAdministration);
	
	/*app.put('/:apikey/MedicationAdministration/:medicationAdministration_id?', MedicationAdministration.put.medicationAdministration);*/
	
}
module.exports = routesMedicationAdministration