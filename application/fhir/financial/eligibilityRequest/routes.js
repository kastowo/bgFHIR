var routesEligibilityRequest = function(app, EligibilityRequest){
	
	//get method
	app.get('/:apikey/EligibilityRequest', EligibilityRequest.get.eligibilityRequest);
	//post method
	app.post('/:apikey/EligibilityRequest', EligibilityRequest.post.eligibilityRequest);
	//put method
	app.put('/:apikey/EligibilityRequest/:eligibility_request_id?', EligibilityRequest.put.eligibilityRequest);
	
	app.get('/:apikey/EligibilityRequest/:eligibility_request_id?/identifier/:identifier_id?', EligibilityRequest.get.identifier);
	app.post('/:apikey/EligibilityRequest/:eligibility_request_id?/identifier', EligibilityRequest.post.identifier);
	app.put('/:apikey/EligibilityRequest/:eligibility_request_id?/identifier/:identifier_id?', EligibilityRequest.put.identifier);
}
module.exports = routesEligibilityRequest;
