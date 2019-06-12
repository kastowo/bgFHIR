var routesGoal = function(app, Goal){
	app.get('/:apikey/Goal/:goal_id?', Goal.get.goal);
	app.get('/:apikey/Goal/:goal_id?/identifier/:identifier_id?', Goal.get.identifier);
	//app.get('/:apikey/Goal/:goal_id?/GoalTarget/:goal_target_id?', Goal.get.goalTarget);
	
	app.post('/:apikey/Goal', Goal.post.goal);
	app.post('/:apikey/Goal/:goal_id?/identifier', Goal.post.identifier);
	//app.post('/:apikey/Goal/:goal_id?/GoalTarget', Goal.post.goalTarget);
	
	
	app.put('/:apikey/Goal/:goal_id?', Goal.put.goal);
	app.put('/:apikey/Goal/:goal_id?/identifier/:identifier_id?', Goal.put.identifier);
	app.put('/:apikey/Goal/:goal_id?/GoalTarget/:goal_target_id?', Goal.put.goalTarget);

	
}
module.exports = routesGoal;