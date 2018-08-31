var routesGoal = function(app, Goal){
	app.get('/:apikey/Goal', Goal.get.goal);
	app.get('/:apikey/GoalTarget', Goal.get.goalTarget);
	
	app.post('/:apikey/Goal', Goal.post.goal);
	app.post('/:apikey/GoalTarget', Goal.post.goalTarget);
	
	app.put('/:apikey/Goal/:goal_id', Goal.put.goal);
	app.put('/:apikey/GoalTarget/:target_id', Goal.put.goalTarget);
	
}
module.exports = routesGoal;