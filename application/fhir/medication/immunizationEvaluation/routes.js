var routesImmunizationEvaluation = function(app, ImmunizationEvaluation){
	app.get('/:apikey/ImmunizationEvaluation', ImmunizationEvaluation.get.immunizationEvaluation);
	app.get('/:apikey/ImmunizationEvaluation/:immunization_evaluation_id?/identifier/:identifier_id?', ImmunizationEvaluation.get.identifier);

	app.post('/:apikey/ImmunizationEvaluation', ImmunizationEvaluation.post.immunizationEvaluation);
	app.post('/:apikey/ImmunizationEvaluation/:immunization_evaluation_id?/identifier', ImmunizationEvaluation.post.identifier);

	app.put('/:apikey/ImmunizationEvaluation/:immunization_evaluation_id?', ImmunizationEvaluation.put.immunizationEvaluation);
	app.put('/:apikey/ImmunizationEvaluation/:immunization_evaluation_id?/identifier/:identifier_id?', ImmunizationEvaluation.put.identifier);
	
}
module.exports = routesImmunizationEvaluation