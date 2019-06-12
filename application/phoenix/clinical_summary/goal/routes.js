var routesGoal = function(app, Goal){
	app.get('/:apikey/Goal', Goal.get.goal);
	app.get('/:apikey/GoalTarget', Goal.get.goalTarget);
	app.get('/:apikey/GoalAddressesCondition', Goal.get.goalAddressesCondition);
	app.get('/:apikey/GoalAddressesObservation', Goal.get.goalAddressesObservation);
	app.get('/:apikey/GoalAddressesMedicationStatement', Goal.get.goalAddressesMedicationStatement);
	app.get('/:apikey/GoalAddressesNutritionOrder', Goal.get.goalAddressesNutritionOrder);
	app.get('/:apikey/GoalAddressesProcedureRequest', Goal.get.goalAddressesProcedureRequest);
	app.get('/:apikey/GoalAddressesRiskAssessment', Goal.get.goalAddressesRiskAssessment);
	app.get('/:apikey/GoalOutcomeReference', Goal.get.goalOutcomeReference);
	
	
	app.post('/:apikey/Goal', Goal.post.goal);
	app.post('/:apikey/GoalTarget', Goal.post.goalTarget);
	
	app.put('/:apikey/Goal/:_id?', Goal.put.goal);
	app.put('/:apikey/GoalTarget/:_id?/:dr?', Goal.put.goalTarget);
	
}
module.exports = routesGoal;