var routesMedicationRequest = function(app, MedicationRequest){
	app.get('/:apikey/MedicationRequest', MedicationRequest.get.medicationRequest);
	app.get('/:apikey/MedicationRequestRequester', MedicationRequest.get.medicationRequestRequester);
	app.get('/:apikey/MedicationRequestSubtitution', MedicationRequest.get.medicationRequestSubtitution);
	app.get('/:apikey/MedicationRequestDispenseRequest', MedicationRequest.get.medicationRequestDispenseRequest);
	
	app.post('/:apikey/MedicationRequest', MedicationRequest.post.medicationRequest);
	app.post('/:apikey/MedicationRequestRequester', MedicationRequest.post.medicationRequestRequester);
	app.post('/:apikey/MedicationRequestSubtitution', MedicationRequest.post.medicationRequestSubtitution);
	app.post('/:apikey/MedicationRequestDispenseRequest', MedicationRequest.post.medicationRequestDispenseRequest);
	
	app.put('/:apikey/MedicationRequest/:medication_request_id', MedicationRequest.put.medicationRequest);
	app.put('/:apikey/MedicationRequestRequester/:requester_id', MedicationRequest.put.medicationRequestRequester);
	app.put('/:apikey/MedicationRequestSubtitution/:subtitution_id', MedicationRequest.put.medicationRequestSubtitution);
	app.put('/:apikey/MedicationRequestDispenseRequest/:dispence_request_id', MedicationRequest.put.medicationRequestDispenseRequest);
	
}
module.exports = routesMedicationRequest;