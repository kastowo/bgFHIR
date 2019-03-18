var routesEvent = function(app, Event){
	app.get('/:apikey/Event', Event.get.event);
	app.get('/:apikey/EventPerformer', Event.get.eventPerformer);
	
	app.post('/:apikey/Event', Event.post.event);
	app.post('/:apikey/EventPerformer', Event.post.eventPerformer);
	
	app.put('/:apikey/Event/:event_id', Event.put.event);
	app.put('/:apikey/EventPerformer/:performer_id', Event.put.eventPerformer);
	
}
module.exports = routesEvent;