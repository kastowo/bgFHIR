var routesMedicationDispense = function(app, MedicationDispense){
	app.get('/:apikey/MedicationDispense', MedicationDispense.get.medicationDispense);
	
	app.post('/:apikey/MedicationDispense', MedicationDispense.post.medicationDispense);
	
	app.put('/:apikey/MedicationDispense/:medicationDispense_id?', MedicationDispense.put.medicationDispense);
	
}
module.exports = routesMedicationDispense