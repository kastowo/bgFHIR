var routesDiagnosticReport = function(app, DiagnosticReport){
	app.get('/:apikey/DiagnosticReport', DiagnosticReport.get.diagnosticReport);
	app.get('/:apikey/diagnosticReportPerformer', DiagnosticReport.get.diagnosticReportPerformer);
	app.get('/:apikey/diagnosticReportReportImage', DiagnosticReport.get.diagnosticReportReportImage);
	
	app.get('/:apikey/diagnosticReportBasedOnCarePlan', DiagnosticReport.get.diagnosticReportBasedOnCarePlan);
	app.get('/:apikey/diagnosticReportBasedOnImmunizationRecommendation', DiagnosticReport.get.diagnosticReportBasedOnImmunizationRecommendation);
	app.get('/:apikey/diagnosticReportBasedOnMedicationRequest', DiagnosticReport.get.diagnosticReportBasedOnMedicationRequest);
	app.get('/:apikey/diagnosticReportBasedOnNutritionOrder', DiagnosticReport.get.diagnosticReportBasedOnNutritionOrder);
	app.get('/:apikey/diagnosticReportBasedOnProcedureRequest', DiagnosticReport.get.diagnosticReportBasedOnProcedureRequest);
	app.get('/:apikey/diagnosticReportBasedOnReferralRequest', DiagnosticReport.get.diagnosticReportBasedOnReferralRequest);
	app.get('/:apikey/diagnosticReportSpecimen', DiagnosticReport.get.diagnosticReportSpecimen);
	app.get('/:apikey/diagnosticReportDiagnosticReportResult', DiagnosticReport.get.diagnosticReportDiagnosticReportResult);
	app.get('/:apikey/diagnosticReportImagingStudy', DiagnosticReport.get.diagnosticReportImagingStudy);
	app.get('/:apikey/diagnosticReportImagingManifest', DiagnosticReport.get.diagnosticReportImagingManifest);

	app.post('/:apikey/DiagnosticReport', DiagnosticReport.post.diagnosticReport);
	app.post('/:apikey/DiagnosticReportPerformer', DiagnosticReport.post.diagnosticReportPerformer);
	app.post('/:apikey/DiagnosticReportReportImage', DiagnosticReport.post.diagnosticReportReportImage);
	
	app.put('/:apikey/DiagnosticReport/:_id?', DiagnosticReport.put.diagnosticReport);
	app.put('/:apikey/DiagnosticReportPerformer/:_id?/:dr?', DiagnosticReport.put.diagnosticReportPerformer);
	app.put('/:apikey/DiagnosticReportReportImage/:_id?/:dr?', DiagnosticReport.put.diagnosticReportReportImage);
	
}
module.exports = routesDiagnosticReport;