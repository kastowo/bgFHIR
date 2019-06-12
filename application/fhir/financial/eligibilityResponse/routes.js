var routesEligibilityResponse = function(app, EligibilityResponse){
	
	//get method
	app.get('/:apikey/EligibilityResponse', EligibilityResponse.get.eligibilityResponse);
	app.get('/:apikey/EligibilityResponse/:eligibility_response_id?/EligibilityResponseInsurance', EligibilityResponse.get.eligibilityResponseInsurance);
	app.get('/:apikey/EligibilityResponseInsurance/:insurance_id?/EligibilityResponseBenefitBalance', EligibilityResponse.get.eligibilityResponseBenefitBalance);
	//post method
	app.post('/:apikey/EligibilityResponse', EligibilityResponse.post.eligibilityResponse);
	app.post('/:apikey/EligibilityResponse/:eligibility_response_id?/EligibilityResponseInsurance', EligibilityResponse.post.eligibilityResponseInsurance);
	app.post('/:apikey/EligibilityResponseInsurance/:insurance_id?/EligibilityResponseBenefitBalance', EligibilityResponse.post.eligibilityResponseBenefitBalance);
	app.post('/:apikey/EligibilityResponseBenefitBalance/:benefit_balance_id?/EligibilityResponseFinancial', EligibilityResponse.post.eligibilityResponseFinancial);
	app.post('/:apikey/EligibilityResponse/:eligibility_response_id?/EligibilityResponseError', EligibilityResponse.post.eligibilityResponseError);
	//put method
	app.put('/:apikey/EligibilityResponse/:eligibility_response_id?', EligibilityResponse.put.eligibilityResponse);
	app.put('/:apikey/EligibilityResponse/:eligibility_response_id?/EligibilityResponseInsurance/:insurance_id?', EligibilityResponse.put.eligibilityResponseInsurance);
	app.put('/:apikey/EligibilityResponseInsurance/:insurance_id?/EligibilityResponseBenefitBalance/:benefit_balance_id?', EligibilityResponse.put.eligibilityResponseBenefitBalance);
	app.put('/:apikey/EligibilityResponseBenefitBalance/:benefit_balance_id?/EligibilityResponseFinancial/:financial_id', EligibilityResponse.put.eligibilityResponseFinancial);
	app.put('/:apikey/EligibilityResponse/:eligibility_response_id?/EligibilityResponseError/:error_id?', EligibilityResponse.put.eligibilityResponseError);
	
	app.get('/:apikey/EligibilityResponse/:eligibility_response_id?/identifier/:identifier_id?', EligibilityResponse.get.identifier);
	app.post('/:apikey/EligibilityResponse/:eligibility_response_id?/identifier', EligibilityResponse.post.identifier);
	app.put('/:apikey/EligibilityResponse/:eligibility_response_id?/identifier/:identifier_id?', EligibilityResponse.put.identifier);
}
module.exports = routesEligibilityResponse;
