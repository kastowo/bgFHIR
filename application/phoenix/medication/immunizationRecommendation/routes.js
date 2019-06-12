var routesImmunizationRecommendation = function(app, ImmunizationRecommendation){
	app.get('/:apikey/ImmunizationRecommendation', ImmunizationRecommendation.get.immunizationRecommendation);
	app.get('/:apikey/ImmunizationRecommendationRecommendation', ImmunizationRecommendation.get.immunizationRecommendationRecommendation);
	app.get('/:apikey/ImmunizationRecommendationDateCriterion', ImmunizationRecommendation.get.immunizationRecommendationDateCriterion);
	app.get('/:apikey/ImmunizationRecommendationSupportingImmunization', ImmunizationRecommendation.get.immunizationRecommendationSupportingImmunization);
	app.get('/:apikey/ImmunizationRecommendationSupportingPatientInformationObservation', ImmunizationRecommendation.get.immunizationRecommendationSupportingPatientInformationObservation);
	app.get('/:apikey/ImmunizationRecommendationSupportingPatientInformationAllergyIntolerance', ImmunizationRecommendation.get.immunizationRecommendationSupportingPatientInformationAllergyIntolerance);
	
	app.post('/:apikey/ImmunizationRecommendation', ImmunizationRecommendation.post.immunizationRecommendation);
	app.post('/:apikey/ImmunizationRecommendationRecommendation', ImmunizationRecommendation.post.immunizationRecommendationRecommendation);
	app.post('/:apikey/ImmunizationRecommendationDateCriterion', ImmunizationRecommendation.post.immunizationRecommendationDateCriterion);
	
	app.put('/:apikey/ImmunizationRecommendation/:_id?', ImmunizationRecommendation.put.immunizationRecommendation);
	app.put('/:apikey/ImmunizationRecommendationRecommendation/:_id?/:dr?', ImmunizationRecommendation.put.immunizationRecommendationRecommendation);
	app.put('/:apikey/ImmunizationRecommendationDateCriterion/:_id?/:dr?', ImmunizationRecommendation.put.immunizationRecommendationDateCriterion);
	
}
module.exports = routesImmunizationRecommendation;