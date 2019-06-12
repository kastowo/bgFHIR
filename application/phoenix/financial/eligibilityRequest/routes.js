var routesEligibilityRequest = function(app, EligibilityRequest){
	app.get('/:apikey/EligibilityRequest', EligibilityRequest.get.eligibilityRequest);
	
	app.post('/:apikey/EligibilityRequest', EligibilityRequest.post.eligibilityRequest);
	
	app.put('/:apikey/EligibilityRequest/:_id?', EligibilityRequest.put.eligibilityRequest);
	
}
module.exports = routesEligibilityRequest;
