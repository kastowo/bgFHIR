var routesProcedure = function(app, Procedure){
	app.get('/:apikey/Procedure', Procedure.get.procedure);
	app.get('/:apikey/ProcedurePerformer', Procedure.get.procedurePerformer);
	
	app.post('/:apikey/Procedure', Procedure.post.procedure);
	app.post('/:apikey/ProcedurePerformer', Procedure.post.procedurePerformer);
	
	app.put('/:apikey/Procedure/:procedure_id', Procedure.put.procedure);
	app.put('/:apikey/ProcedurePerformer/:performer_id', Procedure.put.procedurePerformer);
	
}
module.exports = routesProcedure;