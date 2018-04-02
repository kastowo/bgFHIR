var routesSchedule = function(app, Schedule){
	app.get('/:apikey/Schedule', Schedule.get.schedule);
	app.post('/:apikey/Schedule', Schedule.post.schedule);
	app.put('/:apikey/Schedule/:schedule_id?', Schedule.put.schedule);
}
module.exports = routesSchedule;