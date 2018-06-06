var routesEncounter = function(app, Encounter){
	//get method
	app.get('/:apikey/Encounter', Encounter.get.encounter);

	//post method
	app.post('/:apikey/Encounter', Encounter.post.encounter);
	app.post('/:apikey/Encounter/:encounter_id?/identifier', Encounter.post.identifier);
	app.post('/:apikey/Encounter/:encounter_id?/encounterStatusHistory', Encounter.post.statusHistory);
	app.post('/:apikey/Encounter/:encounter_id?/encounterClassHistory', Encounter.post.classHistory);
	app.post('/:apikey/Encounter/:encounter_id?/encounterParticipant', Encounter.post.participant);
	app.post('/:apikey/Encounter/:encounter_id?/encounterDiagnosis', Encounter.post.diagnosis);
	app.post('/:apikey/Encounter/:encounter_id?/encounterLocation', Encounter.post.location);

	//put method
	app.put('/:apikey/Encounter/:encounter_id?', Encounter.put.encounter);
	app.put('/:apikey/Encounter/:encounter_id?/identifier/:identifier_id?', Encounter.put.identifier);
	app.put('/:apikey/Hospitalization/:hospitalization_id?/preAdmissionIdentifier/:identifier_id?', Encounter.put.preAdmissionIdentifier);
	app.put('/:apikey/Encounter/:encounter_id?/encounterStatusHistory/:status_history_id?', Encounter.put.statusHistory);
	app.put('/:apikey/Encounter/:encounter_id?/encounterClassHistory/:class_history_id?', Encounter.put.classHistory);
	app.put('/:apikey/Encounter/:encounter_id?/encounterDiagnosis/:diagnosis_id?', Encounter.put.diagnosis);
	app.put('/:apikey/Encounter/:encounter_id?/encounterHospitalization/:hospitalization_id?', Encounter.put.hospitalization);
	app.put('/:apikey/Encounter/:encounter_id?/encounterParticipant/:participant_id?', Encounter.put.participant);
	app.put('/:apikey/Encounter/:encounter_id?/encounterLocation/:location_id?', Encounter.put.location);

}
module.exports = routesEncounter;