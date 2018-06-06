var routesEncounter = function(app, Encounter){
	app.get('/:apikey/Encounter', Encounter.get.encounter);
	app.get('/:apikey/encounterStatusHistory', Encounter.get.statusHistory);
	app.get('/:apikey/encounterClassHistory', Encounter.get.classHistory);
	app.get('/:apikey/encounterParticipant', Encounter.get.participant);
	app.get('/:apikey/encounterDiagnosis', Encounter.get.diagnosis);
	app.get('/:apikey/encounterHospitalization', Encounter.get.hospitalization);
	app.get('/:apikey/encounterLocation', Encounter.get.location);
	app.get('/:apikey/encounterEpisodeOfCare', Encounter.get.episodeOfCare);
	
	app.post('/:apikey/encounter', Encounter.post.encounter);
	app.post('/:apikey/encounter-class-history', Encounter.post.encounterClassHistory);
	app.post('/:apikey/encounter-status-history', Encounter.post.encounterStatusHistory);
	app.post('/:apikey/encounter-diagnosis', Encounter.post.encounterDiagnosis);
	app.post('/:apikey/encounter-hospitalization', Encounter.post.encounterHospitalization);
	app.post('/:apikey/encounter-location', Encounter.post.encounterLocation);
	app.post('/:apikey/encounter-participant', Encounter.post.encounterParticipant);
	
	app.put('/:apikey/encounter/:_id?', Encounter.put.encounter);
	app.put('/:apikey/encounter-class-history/:_id?/:dr?', Encounter.put.classHistory);
	app.put('/:apikey/encounter-status-history/:_id?/:dr?', Encounter.put.statusHistory);
	app.put('/:apikey/encounter-diagnosis/:_id?/:dr?', Encounter.put.diagnosis);
	app.put('/:apikey/encounter-hospitalization/:_id?/:dr?', Encounter.put.hospitalization);
	app.put('/:apikey/encounter-location/:_id?/:dr?', Encounter.put.location);
	app.put('/:apikey/encounter-participant/:_id?/:dr?', Encounter.put.participant);
	
}
module.exports = routesEncounter;