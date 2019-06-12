var routesCareTeam = function(app, CareTeam){
	app.get('/:apikey/CareTeam/:care_team_id?', CareTeam.get.careTeam);
	app.get('/:apikey/CareTeam/:care_team_id?/identifier/:identifier_id?', CareTeam.get.identifier);
	app.get('/:apikey/CareTeam/:care_team_id?/CareTeamParticipant/:care_team_participant_id?', CareTeam.get.careTeamParticipant);
	
	app.post('/:apikey/CareTeam', CareTeam.post.careTeam);
	app.post('/:apikey/CareTeam/:care_team_id?/identifier', CareTeam.post.identifier);
	app.post('/:apikey/CareTeam/:care_team_id?/CareTeamParticipant', CareTeam.post.careTeamParticipant);
	
	app.put('/:apikey/CareTeam/:care_team_id?', CareTeam.put.careTeam);
	app.put('/:apikey/CareTeam/:care_team_id?/identifier/:identifier_id?', CareTeam.put.identifier);
	app.put('/:apikey/CareTeam/:care_team_id?/CareTeamParticipant/:care_team_participant_id?', CareTeam.put.careTeamParticipant);
	
}
module.exports = routesCareTeam;