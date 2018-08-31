var routesMedication = function(app, Medication){
	app.get('/:apikey/Medication', Medication.get.medication);
	
	app.post('/:apikey/Medication', Medication.post.medication);
	
	app.put('/:apikey/Medication/:medication_id?', Medication.put.medication);
	
}
module.exports = routesMedication