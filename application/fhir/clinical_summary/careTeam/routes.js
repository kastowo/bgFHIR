var routesCareTeam = function(app, CareTeam){
	app.get('/:apikey/CareTeam', CareTeam.get.careTeam);
	
	
	app.post('/:apikey/CareTeam', CareTeam.post.careTeam);
	
	
	app.put('/:apikey/CareTeam/:care_team_id?', CareTeam.put.careTeam);
	
}
module.exports = routesCareTeam;