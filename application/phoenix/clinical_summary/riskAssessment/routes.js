var routesRiskAssessment = function(app, RiskAssessment){
	app.get('/:apikey/RiskAssessment', RiskAssessment.get.riskAssessment);
	app.get('/:apikey/RiskAssessmentPrediction', RiskAssessment.get.riskAssessmentPrediction);
	
	app.post('/:apikey/RiskAssessment', RiskAssessment.post.riskAssessment);
	app.post('/:apikey/RiskAssessmentPrediction', RiskAssessment.post.riskAssessmentPrediction);
	
	app.put('/:apikey/RiskAssessment/:_id?', RiskAssessment.put.riskAssessment);
	app.put('/:apikey/RiskAssessmentPrediction/:_id?/:dr?', RiskAssessment.put.riskAssessmentPrediction);
	
}
module.exports = routesRiskAssessment;