var routesProcedureRequest = function(app, ProcedureRequest){
	app.get('/:apikey/ProcedureRequest', ProcedureRequest.get.procedureRequest);
	
	app.post('/:apikey/ProcedureRequest', ProcedureRequest.post.procedureRequest);
	
	app.put('/:apikey/ProcedureRequest/:procedure_request_id', ProcedureRequest.put.procedureRequest);
	
	
}
module.exports = routesProcedureRequest;