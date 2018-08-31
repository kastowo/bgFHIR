var routesAdverseEvent = function(app, AdverseEvent){
	app.get('/:apikey/AdverseEvent', AdverseEvent.get.adverseEvent);
	app.get('/:apikey/AdverseEventSuspectEntity', AdverseEvent.get.suspectEntity);
	
	app.post('/:apikey/AdverseEvent', AdverseEvent.post.adverseEvent);
	app.post('/:apikey/AdverseEventSuspectEntity', AdverseEvent.post.suspectEntity);
	
	app.put('/:apikey/AdverseEvent/:adverse_event_id', AdverseEvent.put.adverseEvent);
	app.put('/:apikey/AdverseEventSuspectEntity/:suspect_entity_id', AdverseEvent.put.suspectEntity);
	
}
module.exports = routesAdverseEvent;