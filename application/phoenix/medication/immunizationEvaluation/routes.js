var routesImmunizationEvaluation = function(app, ImmunizationEvaluation){
	app.get('/:apikey/ImmunizationEvaluation', ImmunizationEvaluation.get.immunizationEvaluation);
	
	app.post('/:apikey/ImmunizationEvaluation', ImmunizationEvaluation.post.immunizationEvaluation);
	
	app.put('/:apikey/ImmunizationEvaluation/:_id?', ImmunizationEvaluation.put.immunizationEvaluation);
	
}
module.exports = routesImmunizationEvaluation;