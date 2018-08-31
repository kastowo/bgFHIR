var routesMedicationRequest = function(app, MedicationRequest){
	app.get('/:apikey/MedicationRequest', MedicationRequest.get.medicationRequest);
	
	app.post('/:apikey/MedicationRequest', MedicationRequest.post.medicationRequest);
	
	app.put('/:apikey/MedicationRequest/:medicationRequest_id?', MedicationRequest.put.medicationRequest);
	
}
module.exports = routesMedicationRequest