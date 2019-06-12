var routesEnrollmentResponse = function(app, EnrollmentResponse){
	
	//get method
	app.get('/:apikey/EnrollmentResponse', EnrollmentResponse.get.enrollmentResponse);
	//post method
	app.post('/:apikey/EnrollmentResponse', EnrollmentResponse.post.enrollmentResponse);
	//put method
	app.put('/:apikey/EnrollmentResponse/:enrollment_response_id?', EnrollmentResponse.put.enrollmentResponse);
	
	app.get('/:apikey/EnrollmentResponse/:enrollment_response_id?/identifier/:identifier_id?', EnrollmentResponse.get.identifier);
	app.post('/:apikey/EnrollmentResponse/:enrollment_response_id?/identifier', EnrollmentResponse.post.identifier);
	app.put('/:apikey/EnrollmentResponse/:enrollment_response_id?/identifier/:identifier_id?', EnrollmentResponse.put.identifier);
}
module.exports = routesEnrollmentResponse;
