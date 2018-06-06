var routesEpisodeOfCare = function(app, EpisodeOfCare){
	//get method
	app.get('/:apikey/EpisodeOfCare', EpisodeOfCare.get.episodeOfCare);
	app.get('/:apikey/EpisodeOfCare/:episode_of_care_id?/identifier/:identifier_value?', EpisodeOfCare.get.identifier);
	app.get('/:apikey/EpisodeOfCare/:episode_of_care_id?/statusHistory/:episode_of_care_status_history_id?', EpisodeOfCare.get.statusHistory);
	app.get('/:apikey/EpisodeOfCare/:episode_of_care_id?/diagnosis/:condition_id?', EpisodeOfCare.get.diagnosis);

	//post method
	app.post('/:apikey/EpisodeOfCare', EpisodeOfCare.post.episodeOfCare);
	app.post('/:apikey/EpisodeOfCare/:episode_of_care_id?/identifier', EpisodeOfCare.post.identifier);
	app.post('/:apikey/EpisodeOfCare/:episode_of_care_id?/episodeOfCareHistory', EpisodeOfCare.post.statusHistory);
	app.post('/:apikey/EpisodeOfCare/:episode_of_care_id?/episodeOfCareDiagnosis', EpisodeOfCare.post.diagnosis);

	//put method
	app.put('/:apikey/EpisodeOfCare/:episode_of_care_id?', EpisodeOfCare.put.episodeOfCare);
	app.put('/:apikey/EpisodeOfCare/:episode_of_care_id?/identifier/:identifier_id?', EpisodeOfCare.put.identifier);
	app.put('/:apikey/EpisodeOfCare/:episode_of_care_id?/episodeOfCareHistory/:status_history_id?', EpisodeOfCare.put.statusHistory);
	app.put('/:apikey/EpisodeOfCare/:episode_of_care_id?/episodeOfCareDiagnosis/:diagnosis_id?', EpisodeOfCare.put.diagnosis);

}
module.exports = routesEpisodeOfCare;