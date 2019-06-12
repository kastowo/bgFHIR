var routesDiagnosticReport = function(app, DiagnosticReport){
	app.get('/:apikey/DiagnosticReport/:diagnostic_report_id?', DiagnosticReport.get.diagnosticReport);
	app.get('/:apikey/DiagnosticReport/:diagnostic_report_id?/identifier/:identifier_id?', DiagnosticReport.get.identifier);
	app.get('/:apikey/DiagnosticReport/:diagnostic_report_id?/DiagnosticReportPerformer/:diagnostic_report_performer_id?', DiagnosticReport.get.diagnosticReportPerformer);
	app.get('/:apikey/DiagnosticReport/:diagnostic_report_id?/DiagnosticReportReportImage/:diagnostic_report_report_image_id?', DiagnosticReport.get.diagnosticReportReportImage);
	app.get('/:apikey/DiagnosticReport/:diagnostic_report_id?/Photo/:attachment_id?', DiagnosticReport.get.attachment);
	
	app.post('/:apikey/DiagnosticReport', DiagnosticReport.post.diagnosticReport);
	app.post('/:apikey/DiagnosticReport/:diagnostic_report_id?/identifier', DiagnosticReport.post.identifier);
	app.post('/:apikey/DiagnosticReport/:diagnostic_report_id?/DiagnosticReportPerformer', DiagnosticReport.post.diagnosticReportPerformer);
	app.post('/:apikey/DiagnosticReport/:diagnostic_report_id?/DiagnosticReportReportImage', DiagnosticReport.post.diagnosticReportReportImage);
	app.post('/:apikey/DiagnosticReport/:diagnostic_report_id?/attachment', DiagnosticReport.post.attachment);
	
	app.put('/:apikey/DiagnosticReport/:diagnostic_report_id?', DiagnosticReport.put.diagnosticReport);
	app.put('/:apikey/DiagnosticReport/:diagnostic_report_id?/identifier/:identifier_id?', DiagnosticReport.put.identifier);
	app.put('/:apikey/DiagnosticReport/:diagnostic_report_id?/DiagnosticReportPerformer/:diagnostic_report_performer_id?', DiagnosticReport.put.diagnosticReportPerformer);
	app.put('/:apikey/DiagnosticReport/:diagnostic_report_id?/DiagnosticReportReportImage/:diagnostic_report_report_image_id?', DiagnosticReport.put.diagnosticReportReportImage);
	app.put('/:apikey/DiagnosticReport/:diagnostic_report_id?/attachment/:attachment_id?', DiagnosticReport.put.attachment);

	
}
module.exports = routesDiagnosticReport;