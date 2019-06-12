var routesMedicationRequest = function(app, MedicationRequest){
	app.get('/:apikey/MedicationRequest', MedicationRequest.get.medicationRequest);
	app.get('/:apikey/MedicationRequest/:medication_request_id?/identifier/:identifier_id?', MedicationRequest.get.identifier);
	app.get('/:apikey/MedicationRequest/:medication_request_id?/dosage/:dosage_id?', MedicationRequest.get.medicationRequestDosage);

	app.post('/:apikey/MedicationRequest', MedicationRequest.post.medicationRequest);
	app.post('/:apikey/MedicationRequest/:medication_request_id?/identifier', MedicationRequest.post.identifier);
	app.post('/:apikey/MedicationRequest/:medication_request_id?/Dosage', MedicationRequest.post.dosage);

	app.put('/:apikey/MedicationRequest/:medication_request_id?', MedicationRequest.put.medicationRequest);
	app.put('/:apikey/MedicationRequest/:medication_request_id?/identifier/:identifier_id?', MedicationRequest.put.identifier);
	app.put('/:apikey/MedicationRequest/:medication_request_id?/Dosage/:dosage_id?', MedicationRequest.put.dosage);
	app.put('/:apikey/MedicationRequest/:medication_request_id?/Dosage/:dosage_id?/timing/:timing_id?', MedicationRequest.put.timing);
}
module.exports = routesMedicationRequest