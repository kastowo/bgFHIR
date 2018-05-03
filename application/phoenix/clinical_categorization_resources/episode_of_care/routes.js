var routesEpisodeOfCare = function(app, EpisodeOfCare){
	app.get('/:apikey/EpisodeOfCare', EpisodeOfCare.get.episodeOfCare);
	app.get('/:apikey/EpisodeOfCareStatusHistory', EpisodeOfCare.get.statusHistory);
	app.get('/:apikey/EpisodeOfCareDiagnosis', EpisodeOfCare.get.diagnosis);
	app.get('/:apikey/EpisodeOfCareReferralRequest', EpisodeOfCare.get.referralRequest);
	app.get('/:apikey/EpisodeOfCareTeam', EpisodeOfCare.get.team);
	app.get('/:apikey/EpisodeOfCareAccount', EpisodeOfCare.get.account);
	
	app.post('/:apikey/episode-of-care', EpisodeOfCare.post.episodeOfCare);
	app.post('/:apikey/episode-of-care-history', EpisodeOfCare.post.statusHistory);
	app.post('/:apikey/episode-of-care-diagnosis', EpisodeOfCare.post.diagnosis); 
	
	app.put('/:apikey/episode-of-care/:_id?', EpisodeOfCare.put.episodeOfCare);
	app.put('/:apikey/episode-of-care-history/:_id?/:dr?', EpisodeOfCare.put.statusHistory);
	app.put('/:apikey/episode-of-care-diagnosis/:_id?/:dr?', EpisodeOfCare.put.diagnosis);
	
}
module.exports = routesEpisodeOfCare;