var routesEnrollmentResponse = function(app, EnrollmentResponse){
	app.get('/:apikey/EnrollmentResponse', EnrollmentResponse.get.enrollmentResponse);
	
	app.post('/:apikey/EnrollmentResponse', EnrollmentResponse.post.enrollmentResponse);
	
	app.put('/:apikey/EnrollmentResponse/:_id?', EnrollmentResponse.put.enrollmentResponse);
	
}
module.exports = routesEnrollmentResponse;
