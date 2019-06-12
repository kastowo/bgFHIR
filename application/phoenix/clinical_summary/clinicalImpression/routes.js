var routesClinicalImpression = function(app, ClinicalImpression){
	app.get('/:apikey/ClinicalImpression', ClinicalImpression.get.clinicalImpression);
	app.get('/:apikey/ClinicalImpressionInvestigation', ClinicalImpression.get.clinicalImpressionInvestigation);
	app.get('/:apikey/ClinicalImpressionFinding', ClinicalImpression.get.clinicalImpressionFinding);
	
	app.get('/:apikey/ClinicalImpressionProblemCondition', ClinicalImpression.get.clinicalImpressionProblemCondition);
	app.get('/:apikey/ClinicalImpressionProblemAllergyIntolerance', ClinicalImpression.get.clinicalImpressionProblemAllergyIntolerance);
	app.get('/:apikey/ClinicalImpressionInvestigationItemObservation', ClinicalImpression.get.clinicalImpressionInvestigationItemObservation);
	app.get('/:apikey/ClinicalImpressionInvestigationItemQuestionnaireResponse', ClinicalImpression.get.clinicalImpressionInvestigationItemQuestionnaireResponse);
	app.get('/:apikey/ClinicalImpressionInvestigationItemFamilyMemberHistory', ClinicalImpression.get.clinicalImpressionInvestigationItemFamilyMemberHistory);
	app.get('/:apikey/ClinicalImpressionInvestigationItemDiagnosticReport', ClinicalImpression.get.clinicalImpressionInvestigationItemDiagnosticReport);
	app.get('/:apikey/ClinicalImpressionInvestigationItemRiskAssessment', ClinicalImpression.get.clinicalImpressionInvestigationItemRiskAssessment);
	app.get('/:apikey/ClinicalImpressionInvestigationItemImagingStudy', ClinicalImpression.get.clinicalImpressionInvestigationItemImagingStudy);
	app.get('/:apikey/ClinicalImpressionPrognosisReference', ClinicalImpression.get.clinicalImpressionPrognosisReference);
	app.get('/:apikey/ClinicalImpressionActionReferralRequest', ClinicalImpression.get.clinicalImpressionActionReferralRequest);
	app.get('/:apikey/ClinicalImpressionActionProcedureRequest', ClinicalImpression.get.clinicalImpressionActionProcedureRequest);
	app.get('/:apikey/ClinicalImpressionActionProcedure', ClinicalImpression.get.clinicalImpressionActionProcedure);
	app.get('/:apikey/ClinicalImpressionActionMedicationRequest', ClinicalImpression.get.clinicalImpressionActionMedicationRequest);
	app.get('/:apikey/ClinicalImpressionActionAppointment', ClinicalImpression.get.clinicalImpressionActionAppointment);
	
	app.post('/:apikey/ClinicalImpression', ClinicalImpression.post.clinicalImpression);
	app.post('/:apikey/ClinicalImpressionInvestigation', ClinicalImpression.post.clinicalImpressionInvestigation);
	app.post('/:apikey/ClinicalImpressionFinding', ClinicalImpression.post.clinicalImpressionFinding);
	
	app.put('/:apikey/ClinicalImpression/:_id?', ClinicalImpression.put.clinicalImpression);
	app.put('/:apikey/ClinicalImpressionInvestigation/:_id?/:dr?', ClinicalImpression.put.clinicalImpressionInvestigation);
	app.put('/:apikey/ClinicalImpressionFinding/:_id?/:dr?', ClinicalImpression.put.clinicalImpressionFinding);
	
}
module.exports = routesClinicalImpression;