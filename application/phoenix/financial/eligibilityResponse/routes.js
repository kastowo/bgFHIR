var routesEligibilityResponse = function(app, EligibilityResponse){
	app.get('/:apikey/EligibilityResponse', EligibilityResponse.get.eligibilityResponse);
	app.get('/:apikey/EligibilityResponseInsurance', EligibilityResponse.get.eligibilityResponseInsurance);
	app.get('/:apikey/EligibilityResponseBenefitBalance', EligibilityResponse.get.eligibilityResponseBenefitBalance);
	app.get('/:apikey/EligibilityResponseFinancial', EligibilityResponse.get.eligibilityResponseFinancial);
	app.get('/:apikey/EligibilityResponseError', EligibilityResponse.get.eligibilityResponseError);
	
	app.post('/:apikey/EligibilityResponse', EligibilityResponse.post.eligibilityResponse);
	app.post('/:apikey/EligibilityResponseInsurance', EligibilityResponse.post.eligibilityResponseInsurance);
	app.post('/:apikey/EligibilityResponseBenefitBalance', EligibilityResponse.post.eligibilityResponseBenefitBalance);
	app.post('/:apikey/EligibilityResponseFinancial', EligibilityResponse.post.eligibilityResponseFinancial);
	app.post('/:apikey/EligibilityResponseError', EligibilityResponse.post.eligibilityResponseError);
	
	app.put('/:apikey/EligibilityResponse/:_id?', EligibilityResponse.put.eligibilityResponse);
	app.put('/:apikey/EligibilityResponseInsurance/:_id?/:dr?', EligibilityResponse.put.eligibilityResponseInsurance);
	app.put('/:apikey/EligibilityResponseBenefitBalance/:_id?/:dr?', EligibilityResponse.put.eligibilityResponseBenefitBalance);
	app.put('/:apikey/EligibilityResponseFinancial/:_id?/:dr?', EligibilityResponse.put.eligibilityResponseFinancial);
	app.put('/:apikey/EligibilityResponseError/:_id?/:dr?', EligibilityResponse.put.eligibilityResponseError);
}
module.exports = routesEligibilityResponse;
