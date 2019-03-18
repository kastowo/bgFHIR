var routesClinicalImpression = function(app, ClinicalImpression){
	app.get('/:apikey/ClinicalImpression', ClinicalImpression.get.clinicalImpression);
	app.get('/:apikey/ClinicalImpressionInvestigation', ClinicalImpression.get.clinicalImpressionInvestigation);
	app.get('/:apikey/ClinicalImpressionFinding', ClinicalImpression.get.clinicalImpressionFinding);
	
	app.post('/:apikey/ClinicalImpression', ClinicalImpression.post.clinicalImpression);
	app.post('/:apikey/ClinicalImpressionInvestigation', ClinicalImpression.post.clinicalImpressionInvestigation);
	app.post('/:apikey/ClinicalImpressionFinding', ClinicalImpression.post.clinicalImpressionFinding);
	
	app.put('/:apikey/ClinicalImpression/:clinical_impression_id', ClinicalImpression.put.clinicalImpression);
	app.put('/:apikey/ClinicalImpressionInvestigation/:investigation_id', ClinicalImpression.put.clinicalImpressionInvestigation);
	app.put('/:apikey/ClinicalImpressionFinding/:finding_id', ClinicalImpression.put.clinicalImpressionFinding);
	
}
module.exports = routesClinicalImpression;