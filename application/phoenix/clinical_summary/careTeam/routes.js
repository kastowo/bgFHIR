var routesCareTeam = function(app, CareTeam){
	app.get('/:apikey/CareTeam', CareTeam.get.careTeam);
	app.get('/:apikey/CareTeamParticipant', CareTeam.get.careTeamParticipant);
	app.get('/:apikey/CareTeamCondition', CareTeam.get.careTeamCondition);
	app.get('/:apikey/CareTeamOrganization', CareTeam.get.careTeamOrganization);
	
	app.post('/:apikey/CareTeam', CareTeam.post.careTeam);
	app.post('/:apikey/CareTeamParticipant', CareTeam.post.careTeamParticipant);
	
	app.put('/:apikey/CareTeam/:_id?', CareTeam.put.careTeam);
	app.put('/:apikey/CareTeamParticipant/:_id?/:dr?', CareTeam.put.careTeamParticipant);
	
}
module.exports = routesCareTeam;