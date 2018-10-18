var routesReferralRequest = function(app, ReferralRequest){
	app.get('/:apikey/ReferralRequest', ReferralRequest.get.referralRequest);
	
	app.post('/:apikey/ReferralRequest', ReferralRequest.post.referralRequest);
	
	app.put('/:apikey/ReferralRequest/:referral_request_id', ReferralRequest.put.referralRequest);
	
}
module.exports = routesReferralRequest;