var routesProcedureRequest = function(app, ProcedureRequest){
	app.get('/:apikey/ProcedureRequest/:procedure_request_id?', ProcedureRequest.get.procedureRequest);
	app.get('/:apikey/ProcedureRequest/:procedure_request_id?/identifier/:identifier_id?', ProcedureRequest.get.identifier);
	
	app.post('/:apikey/ProcedureRequest', ProcedureRequest.post.procedureRequest);
	app.post('/:apikey/ProcedureRequest/:procedure_request_id?/identifier', ProcedureRequest.post.identifier);
	
	
	app.put('/:apikey/ProcedureRequest/:procedure_request_id?', ProcedureRequest.put.procedureRequest);
	app.put('/:apikey/ProcedureRequest/:procedure_request_id?/identifier/:identifier_id?', ProcedureRequest.put.identifier);
	app.put('/:apikey/ProcedureRequest/:procedure_request_id?/Timing/:procedure_request_timing_id?', ProcedureRequest.put.procedureRequestTiming);
	app.put('/:apikey/ProcedureRequest/:procedure_request_id?/Note/:procedure_request_annotation_id?', ProcedureRequest.put.procedureRequestAnnotation);

	
}
module.exports = routesProcedureRequest;