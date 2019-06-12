var routesEnrollmentRequest = function(app, EnrollmentRequest){
	app.get('/:apikey/EnrollmentRequest', EnrollmentRequest.get.enrollmentRequest);
	
	app.post('/:apikey/EnrollmentRequest', EnrollmentRequest.post.enrollmentRequest);
	
	app.put('/:apikey/EnrollmentRequest/:_id?', EnrollmentRequest.put.enrollmentRequest);
	
}
module.exports = routesEnrollmentRequest;
