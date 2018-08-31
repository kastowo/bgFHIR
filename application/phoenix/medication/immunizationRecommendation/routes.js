var routesImmunizationRecommendation = function(app, ImmunizationRecommendation){
	app.get('/:apikey/ImmunizationRecommendation', ImmunizationRecommendation.get.immunizationRecommendation);
	app.get('/:apikey/ImmunizationRecommendationRecommendation', ImmunizationRecommendation.get.immunizationRecommendationRecommendation);
	app.get('/:apikey/ImmunizationRecommendationDateCriterion', ImmunizationRecommendation.get.immunizationRecommendationDateCriterion);
	
	app.post('/:apikey/ImmunizationRecommendation', ImmunizationRecommendation.post.immunizationRecommendation);
	app.post('/:apikey/ImmunizationRecommendationRecommendation', ImmunizationRecommendation.post.immunizationRecommendationRecommendation);
	app.post('/:apikey/ImmunizationRecommendationDateCriterion', ImmunizationRecommendation.post.immunizationRecommendationDateCriterion);
	
	app.put('/:apikey/ImmunizationRecommendation/:immunization_recommendation_id', ImmunizationRecommendation.put.immunizationRecommendation);
	app.put('/:apikey/ImmunizationRecommendationRecommendation/:recommendation_id', ImmunizationRecommendation.put.immunizationRecommendationRecommendation);
	app.put('/:apikey/ImmunizationRecommendationDateCriterion/:date_creation_id', ImmunizationRecommendation.put.immunizationRecommendationDateCriterion);
	
}
module.exports = routesImmunizationRecommendation;