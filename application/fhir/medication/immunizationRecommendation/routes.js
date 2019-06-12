var routesImmunizationRecommendation = function(app, ImmunizationRecommendation){
	app.get('/:apikey/ImmunizationRecommendation', ImmunizationRecommendation.get.immunizationRecommendation);
	app.get('/:apikey/ImmunizationRecommendation/:immunization_recommendation_id?/Identifier/:identifier_id?', ImmunizationRecommendation.get.identifier);
	app.get('/:apikey/ImmunizationRecommendation/:immunization_recommendation_id?/ImmunizationRecommendationRecommendation/:immunization_recommendation_recommendation_id?', ImmunizationRecommendation.get.immunizationRecommendationRecommendation);
		
	app.post('/:apikey/ImmunizationRecommendation', ImmunizationRecommendation.post.immunizationRecommendation);
	app.post('/:apikey/ImmunizationRecommendation/:immunization_recommendation_id?/Identifier', ImmunizationRecommendation.post.identifier);
	app.post('/:apikey/ImmunizationRecommendation/:immunization_recommendation_id?/ImmunizationRecommendationRecommendation', ImmunizationRecommendation.post.immunizationRecommendationRecommendation);
	
	app.post('/:apikey/ImmunizationRecommendation/:immunization_recommendation_id?/ImmunizationRecommendationRecommendation/:immunization_recommendation_recommendation_id?/ImmunizationRecommendationDateCriterion', ImmunizationRecommendation.post.immunizationRecommendationDateCriterion);
	//app.post('/:apikey/ImmunizationRecommendationRecommendation/:immunization_recommendation_recommendation_id?/ImmunizationRecommendationDateCriterion', ImmunizationRecommendation.post.immunizationRecommendationDateCriterion);
	
	
	
	app.put('/:apikey/ImmunizationRecommendation/:immunization_recommendation_id?', ImmunizationRecommendation.put.immunizationRecommendation);
	app.put('/:apikey/ImmunizationRecommendation/:immunization_recommendation_id?/Identifier/:identifier_id?', ImmunizationRecommendation.put.identifier);
	app.put('/:apikey/ImmunizationRecommendation/:immunization_recommendation_id?/ImmunizationRecommendationRecommendation/:immunization_recommendation_recommendation_id?/', ImmunizationRecommendation.put.immunizationRecommendationRecommendation);
	app.put('/:apikey/ImmunizationRecommendation/:immunization_recommendation_id?/ImmunizationRecommendationRecommendation/:immunization_recommendation_recommendation_id?/ImmunizationRecommendationDateCriterion/:immunization_recommendation_date_criterion_id?', ImmunizationRecommendation.put.immunizationRecommendationDateCriterion);
}
module.exports = routesImmunizationRecommendation