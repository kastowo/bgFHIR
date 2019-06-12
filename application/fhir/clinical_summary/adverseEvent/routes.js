var routesAdverseEvent = function(app, AdverseEvent){
	app.get('/:apikey/AdverseEvent/:adverse_event_id?', AdverseEvent.get.adverseEvent);
	app.get('/:apikey/AdverseEvent/:adverse_event_id?/AdverseEventSuspectEntity/:adverse_event_suspect_entity_id?', AdverseEvent.get.adverseEventSuspectEntity);
	
	app.post('/:apikey/AdverseEvent', AdverseEvent.post.adverseEvent);
	app.post('/:apikey/AdverseEvent/:adverse_event_id?/AdverseEventSuspectEntity', AdverseEvent.post.adverseEventSuspectEntity);
	
	app.put('/:apikey/AdverseEvent/:adverse_event_id?', AdverseEvent.put.adverseEvent);
	app.put('/:apikey/AdverseEvent/:adverse_event_id?/identifier/:identifier_id?', AdverseEvent.put.identifier);
	app.put('/:apikey/AdverseEvent/:adverse_event_id?/AdverseEventSuspectEntity/:adverse_event_suspect_entity_id?', AdverseEvent.put.adverseEventSuspectEntity);
}
module.exports = routesAdverseEvent;