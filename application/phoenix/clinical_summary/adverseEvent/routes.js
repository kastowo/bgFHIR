var routesAdverseEvent = function(app, AdverseEvent){
	app.get('/:apikey/AdverseEvent', AdverseEvent.get.adverseEvent);
	
	app.post('/:apikey/AdverseEvent', AdverseEvent.post.adverseEvent);
	
	app.put('/:apikey/AdverseEvent/:adverse_event_id', AdverseEvent.put.adverseEvent);
	
}
module.exports = routesAdverseEvent;