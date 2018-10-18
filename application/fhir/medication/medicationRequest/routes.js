var routesImmunizationRecommendation = function(app, ImmunizationRecommendation){
	app.get('/:apikey/ImmunizationRecommendation', ImmunizationRecommendation.get.immunizationRecommendation);
		
	app.post('/:apikey/ImmunizationRecommendation', ImmunizationRecommendation.post.immunizationRecommendation);
	
	/*app.put('/:apikey/ImmunizationRecommendation/:immunizationRecommendation_id?', ImmunizationRecommendation.put.immunizationRecommendation);*/
	
}
module.exports = routesImmunizationRecommendation