var routesDetectedIssue = function(app, DetectedIssue){
	app.get('/:apikey/DetectedIssue', DetectedIssue.get.detectedIssue);
	app.get('/:apikey/DetectedIssueMitigation', DetectedIssue.get.detectedIssueMitigation);
	
	app.post('/:apikey/DetectedIssue', DetectedIssue.post.detectedIssue);
	app.post('/:apikey/DetectedIssueMitigation', DetectedIssue.post.detectedIssueMitigation);
	
	app.put('/:apikey/DetectedIssue/:care_team_id', DetectedIssue.put.detectedIssue);
	app.put('/:apikey/DetectedIssueMitigation/:participant_id', DetectedIssue.put.detectedIssueMitigation);
	
}
module.exports = routesDetectedIssue;