var routesDetectedIssue = function(app, DetectedIssue){
	app.get('/:apikey/DetectedIssue/:detected_issue_id?', DetectedIssue.get.detectedIssue);
	//app.get('/:apikey/DetectedIssue/:detected_issue_id?/identifier/:identifier_id?', DetectedIssue.get.identifier);
	app.get('/:apikey/DetectedIssue/:detected_issue_id?/DetectedIssueMitigation/:detected_issue_mitigation_id?', DetectedIssue.get.detectedIssueMitigation);
	
	app.post('/:apikey/DetectedIssue', DetectedIssue.post.detectedIssue);
	//app.post('/:apikey/DetectedIssue/:detected_issue_id?/identifier', DetectedIssue.post.identifier);
	app.post('/:apikey/DetectedIssue/:detected_issue_id?/DetectedIssueMitigation', DetectedIssue.post.detectedIssueMitigation);
	
	
	app.put('/:apikey/DetectedIssue/:detected_issue_id?', DetectedIssue.put.detectedIssue);
	app.put('/:apikey/DetectedIssue/:detected_issue_id?/identifier/:identifier_id?', DetectedIssue.put.identifier);
	app.put('/:apikey/DetectedIssue/:detected_issue_id?/DetectedIssueMitigation/:detected_issue_mitigation_id?', DetectedIssue.put.detectedIssueMitigation);

	
}
module.exports = routesDetectedIssue;