var routesEnrollmentRequest = function(app, EnrollmentRequest){
	
	//get method
	app.get('/:apikey/EnrollmentRequest', EnrollmentRequest.get.enrollmentRequest);
	//post method
	app.post('/:apikey/EnrollmentRequest', EnrollmentRequest.post.enrollmentRequest);
	//put method
	app.put('/:apikey/EnrollmentRequest/:enrollment_request_id?', EnrollmentRequest.put.enrollmentRequest);
	
	app.get('/:apikey/EnrollmentRequest/:enrollment_request_id?/identifier/:identifier_id?', EnrollmentRequest.get.identifier);
	app.post('/:apikey/EnrollmentRequest/:enrollment_request_id?/identifier', EnrollmentRequest.post.identifier);
	app.put('/:apikey/EnrollmentRequest/:enrollment_request_id?/identifier/:identifier_id?', EnrollmentRequest.put.identifier);
}
module.exports = routesEnrollmentRequest;
