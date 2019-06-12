var routesProcedure = function(app, Procedure){
	app.get('/:apikey/Procedure/:procedure_id?', Procedure.get.procedure);
	app.get('/:apikey/Procedure/:procedure_id?/identifier/:identifier_id?', Procedure.get.identifier);
	app.get('/:apikey/Procedure/:procedure_id?/ProcedurePerformer/:procedure_performer_id?', Procedure.get.procedurePerformer);
	app.get('/:apikey/Procedure/:procedure_id?/ProcedureFocalDevice/:procedure_focal_device_id?', Procedure.get.procedureFocalDevice);
	
	app.post('/:apikey/Procedure', Procedure.post.procedure);
	app.post('/:apikey/Procedure/:procedure_id?/identifier', Procedure.post.identifier);
	app.post('/:apikey/Procedure/:procedure_id?/ProcedurePerformer', Procedure.post.procedurePerformer);
	app.post('/:apikey/Procedure/:procedure_id?/ProcedureFocalDevice', Procedure.post.procedureFocalDevice);
	
	app.put('/:apikey/Procedure/:procedure_id?', Procedure.put.procedure);
	app.put('/:apikey/Procedure/:procedure_id?/identifier/:identifier_id?', Procedure.put.identifier);
	app.put('/:apikey/Procedure/:procedure_id?/ProcedurePerformer/:procedure_performer_id?', Procedure.put.procedurePerformer);
	app.put('/:apikey/Procedure/:procedure_id?/ProcedureFocalDevice/:procedure_focal_device_id?', Procedure.put.procedureFocalDevice);

	
}
module.exports = routesProcedure;