var routesClinicalImpression = function(app, ClinicalImpression){
	app.get('/:apikey/ClinicalImpression/:clinical_impression_id?', ClinicalImpression.get.clinicalImpression);
	app.get('/:apikey/ClinicalImpression/:clinical_impression_id?/identifier/:identifier_id?', ClinicalImpression.get.identifier);
	app.get('/:apikey/ClinicalImpression/:clinical_impression_id?/ClinicalImpressionInvestigation/:clinical_impression_investigation_id?', ClinicalImpression.get.clinicalImpressionInvestigation);
	app.get('/:apikey/ClinicalImpression/:clinical_impression_id?/ClinicalImpressionFinding/:clinical_impression_finding_id?', ClinicalImpression.get.clinicalImpressionFinding);
	
	app.post('/:apikey/ClinicalImpression', ClinicalImpression.post.clinicalImpression);
	app.post('/:apikey/ClinicalImpression/:clinical_impression_id?/identifier', ClinicalImpression.post.identifier);
	app.post('/:apikey/ClinicalImpression/:clinical_impression_id?/ClinicalImpressionInvestigation', ClinicalImpression.post.clinicalImpressionInvestigation);
	app.post('/:apikey/ClinicalImpression/:clinical_impression_id?/ClinicalImpressionFinding', ClinicalImpression.post.clinicalImpressionFinding);
	
	
	app.put('/:apikey/ClinicalImpression/:clinical_impression_id?', ClinicalImpression.put.clinicalImpression);
	app.put('/:apikey/ClinicalImpression/:clinical_impression_id?/identifier/:identifier_id?', ClinicalImpression.put.identifier);

	app.put('/:apikey/ClinicalImpression/:clinical_impression_id?/ClinicalImpressionInvestigation/:clinical_impression_investigation_id?', ClinicalImpression.put.clinicalImpressionInvestigation);
	app.put('/:apikey/ClinicalImpression/:clinical_impression_id?/ClinicalImpressionFinding/:clinical_impression_finding_id?', ClinicalImpression.put.clinicalImpressionFinding);
	
}
module.exports = routesClinicalImpression;