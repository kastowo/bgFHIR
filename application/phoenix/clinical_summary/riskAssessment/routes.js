var routesProcedure = function(app, Procedure){
	app.get('/:apikey/Procedure', Procedure.get.procedure);
	app.get('/:apikey/ProcedurePrediction', Procedure.get.procedurePrediction);
	
	app.post('/:apikey/Procedure', Procedure.post.procedure);
	app.post('/:apikey/ProcedurePrediction', Procedure.post.procedurePrediction);
	
	app.put('/:apikey/Procedure/:risk_assessment_id', Procedure.put.procedure);
	app.put('/:apikey/ProcedurePrediction/:prediction_id', Procedure.put.procedurePrediction);
	
}
module.exports = routesProcedure;