var routesClaimResponse = function(app, ClaimResponse){
	app.get('/:apikey/ClaimResponse', ClaimResponse.get.claimResponse);
	app.get('/:apikey/ClaimResponseItem', ClaimResponse.get.claimResponseItem);
	app.get('/:apikey/ClaimResponseItemDetail', ClaimResponse.get.claimResponseItemDetail);
	app.get('/:apikey/ClaimResponseItemSubDetail', ClaimResponse.get.claimResponseItemSubDetail);
	app.get('/:apikey/ClaimResponseAddItem', ClaimResponse.get.claimResponseAddItem);
	app.get('/:apikey/ClaimResponseAddItemDetail', ClaimResponse.get.claimResponseAddItemDetail);
	app.get('/:apikey/ClaimResponseError', ClaimResponse.get.claimResponseError);
	app.get('/:apikey/ClaimResponseProcessNote', ClaimResponse.get.claimResponseProcessNote);
	app.get('/:apikey/ClaimResponseInsurance', ClaimResponse.get.claimResponseInsurance);
	app.get('/:apikey/ClaimResponseAdjudication', ClaimResponse.get.claimResponseAdjudication);
	app.get('/:apikey/ClaimResponseCommunicationRequest', ClaimResponse.get.claimCommunicationRequest);

	app.post('/:apikey/ClaimResponse', ClaimResponse.post.claimResponse);
	app.post('/:apikey/ClaimResponseItem', ClaimResponse.post.claimResponseItem);
	app.post('/:apikey/ClaimResponseItemDetail', ClaimResponse.post.claimResponseItemDetail);
	app.post('/:apikey/ClaimResponseItemSubDetail', ClaimResponse.post.claimResponseItemSubDetail);
	app.post('/:apikey/ClaimResponseAddItem', ClaimResponse.post.claimResponseAddItem);
	app.post('/:apikey/ClaimResponseAddItemDetail', ClaimResponse.post.claimResponseAddItemDetail);
	app.post('/:apikey/ClaimResponseError', ClaimResponse.post.claimResponseError);
	app.post('/:apikey/ClaimResponseProcessNote', ClaimResponse.post.claimResponseProcessNote);
	app.post('/:apikey/ClaimResponseInsurance', ClaimResponse.post.claimResponseInsurance);
	app.post('/:apikey/claimResponseAdjudication', ClaimResponse.post.claimResponseAdjudication);
	
	app.put('/:apikey/ClaimResponse/:_id?', ClaimResponse.put.claimResponse);
	app.put('/:apikey/ClaimResponseItem/:_id?', ClaimResponse.put.claimResponseItem);
	app.put('/:apikey/ClaimResponseItemDetail/:_id?', ClaimResponse.put.claimResponseItemDetail);
	app.put('/:apikey/ClaimResponseItemSubDetail/:_id?', ClaimResponse.put.claimResponseItemSubDetail);
	app.put('/:apikey/ClaimResponseAddItem/:_id?', ClaimResponse.put.claimResponseAddItem);
	app.put('/:apikey/ClaimResponseAddItemDetail/:_id?', ClaimResponse.put.claimResponseAddItemDetail);
	app.put('/:apikey/ClaimResponseError/:_id?', ClaimResponse.put.claimResponseError);
	app.put('/:apikey/ClaimResponseProcessNote/:_id?', ClaimResponse.put.claimResponseProcessNote);
	app.put('/:apikey/ClaimResponseInsurance/:_id?', ClaimResponse.put.claimResponseInsurance);
	app.put('/:apikey/claimResponseAdjudication/:_id?', ClaimResponse.put.claimResponseAdjudication);
	
	
}
module.exports = routesClaimResponse;
