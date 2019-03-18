var routesTask = function(app, Task){
	app.get('/:apikey/Task', Task.get.task);
	app.get('/:apikey/TaskPerformer', Task.get.taskPerformer);
	
	app.post('/:apikey/Task', Task.post.task);
	app.post('/:apikey/TaskPerformer', Task.post.taskPerformer);
	
	app.put('/:apikey/Task/:task_id', Task.put.task);
	app.put('/:apikey/TaskPerformer/:performer_id', Task.put.taskPerformer);
	
}
module.exports = routesTask;