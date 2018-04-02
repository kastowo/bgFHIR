var routesSchedule = function(app, Schedule){
	app.get('/:apikey/Schedule', Schedule.get.schedule);
	app.post('/:apikey/schedule', Schedule.post.schedule);
	app.put('/:apikey/schedule/:schedule_id', Schedule.put.schedule);
}
module.exports = routesSchedule;