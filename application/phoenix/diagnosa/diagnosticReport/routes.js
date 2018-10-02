var routesDiagnosticReport = function(app, DiagnosticReport){
	app.get('/:apikey/DiagnosticReport', DiagnosticReport.get.diagnosticReport);
	app.get('/:apikey/diagnosticReportPerformer', DiagnosticReport.get.diagnosticReportPerformer);
	app.get('/:apikey/diagnosticReportReportImage', DiagnosticReport.get.diagnosticReportReportImage);
	
	app.post('/:apikey/DiagnosticReport', DiagnosticReport.post.diagnosticReport);
	app.post('/:apikey/DiagnosticReportPerformer', DiagnosticReport.post.diagnosticReportPerformer);
	app.post('/:apikey/DiagnosticReportReportImage', DiagnosticReport.post.diagnosticReportReportImage);
	
	app.put('/:apikey/DiagnosticReport/:diagnostic_report_id', DiagnosticReport.put.diagnosticReport);
	app.put('/:apikey/DiagnosticReportPerformer/:performer_id', DiagnosticReport.put.diagnosticReportPerformer);
	app.put('/:apikey/DiagnosticReportReportImage/:image_id', DiagnosticReport.put.diagnosticReportReportImage);
	
}
module.exports = routesDiagnosticReport;