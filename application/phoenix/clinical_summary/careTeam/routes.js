var routesCareTeam = function(app, CareTeam){
	app.get('/:apikey/CareTeam', CareTeam.get.careTeam);
	app.get('/:apikey/CareTeamParticipant', CareTeam.get.careTeamParticipant);
	
	app.post('/:apikey/CareTeam', CareTeam.post.careTeam);
	app.post('/:apikey/CareTeamParticipant', CareTeam.post.careTeamParticipant);
	
	app.put('/:apikey/CareTeam/:care_team_id', CareTeam.put.careTeam);
	app.put('/:apikey/CareTeamParticipant/:participant_id', CareTeam.put.careTeamParticipant);
	
}
module.exports = routesCareTeam;