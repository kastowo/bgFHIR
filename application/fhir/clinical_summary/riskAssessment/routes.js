var routesRiskAssessment = function(app, RiskAssessment){
	app.get('/:apikey/RiskAssessment/:risk_assessment_id?', RiskAssessment.get.riskAssessment);
	app.get('/:apikey/RiskAssessment/:risk_assessment_id?/identifier/:identifier_id?', RiskAssessment.get.identifier);
	app.get('/:apikey/RiskAssessment/:risk_assessment_id?/RiskAssessmentPrediction/:risk_assessment_prediction_id?', RiskAssessment.get.riskAssessmentPrediction);
	
	app.post('/:apikey/RiskAssessment', RiskAssessment.post.riskAssessment);
	app.post('/:apikey/RiskAssessment/:risk_assessment_id?/identifier', RiskAssessment.post.identifier);
	app.post('/:apikey/RiskAssessment/:risk_assessment_id?/RiskAssessmentPrediction', RiskAssessment.post.riskAssessmentPrediction);
	
	
	app.put('/:apikey/RiskAssessment/:risk_assessment_id?', RiskAssessment.put.riskAssessment);
	app.put('/:apikey/RiskAssessment/:risk_assessment_id?/identifier/:identifier_id?', RiskAssessment.put.identifier);
	app.put('/:apikey/RiskAssessment/:risk_assessment_id?/RiskAssessmentPrediction/:risk_assessment_prediction_id?', RiskAssessment.put.riskAssessmentPrediction);

	
}
module.exports = routesRiskAssessment;