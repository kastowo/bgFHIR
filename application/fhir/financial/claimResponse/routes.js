var routesClaimResponse = function(app, ClaimResponse){
	
	//get method
	app.get('/:apikey/ClaimResponse/:claim_response_id?', ClaimResponse.get.claimResponse);
	app.get('/:apikey/ClaimResponse/:claim_response_id?/ClaimResponseItem/:item_id?', ClaimResponse.get.claimResponseItem);
	app.get('/:apikey/ClaimResponseItem/:item_id?/ClaimResponseItemDetail/:detail_id?', ClaimResponse.get.claimResponseItemDetail);
	app.get('/:apikey/ClaimResponseItemDetail/:detail_id?/ClaimResponseItemSubDetail/:sub_detail_id?', ClaimResponse.get.claimResponseItemSubDetail);
	app.get('/:apikey/ClaimResponse/:claim_response_id?/ClaimResponseAddItem/:add_item_id?', ClaimResponse.get.claimResponseAddItem);
	app.get('/:apikey/ClaimResponseAddItem/:add_item_id?/ClaimResponseAddItemDetail/:add_item_detail_id?', ClaimResponse.get.claimResponseAddItemDetail);

	//post method
	app.post('/:apikey/ClaimResponse', ClaimResponse.post.claimResponse);
	//put method
	app.put('/:apikey/ClaimResponse/:claim_response_id?', ClaimResponse.put.claimResponse);
	app.put('/:apikey/ClaimResponse/:claim_response_id?/claimResponseItem/:claim_response_item_id?', ClaimResponse.put.claimResponseItem);
	app.put('/:apikey/ClaimResponseItem/:claim_response_item_id?/claimResponseAdjudicationItem/:claim_response_adjudication_id?', ClaimResponse.put.claimResponseAdjudicationItem);
	app.put('/:apikey/ClaimResponseItem/:claim_response_item_id?/claimResponseItemDetail/:claim_response_item_detail_id?', ClaimResponse.put.claimResponseItemDetail);
	app.put('/:apikey/ClaimResponseItemDetail/:claim_response_item_detail_id?/claimResponseAdjudicationItem/:claim_response_adjudication_id?', ClaimResponse.put.claimResponseAdjudicationDetal);
	app.put('/:apikey/ClaimResponseItemDetail/:claim_response_item_detail_id?/claimResponseItemSubDetail/:claim_response_item_sub_detail_id?', ClaimResponse.put.claimResponseItemSubDetail);
	app.put('/:apikey/ClaimResponseItemSubDetail/:claim_response_item_sub_detail_id?/claimResponseAdjudicationItem/:claim_response_adjudication_id?', ClaimResponse.put.claimResponseAdjudicationSubDetail);
	app.put('/:apikey/ClaimResponse/:claim_response_id?/claimResponseAddItem/:claim_response_add_item_id?', ClaimResponse.put.claimResponseAddItem);
	app.put('/:apikey/ClaimResponseAddItem/:claim_response_add_item_id?/claimResponseAdjudicationItem/:claim_response_adjudication_id?', ClaimResponse.put.claimResponseAdjudicationAddItem);
	app.put('/:apikey/ClaimResponseAddItem/:claim_response_add_item_id?/claimResponseAddItemDetail/:claim_response_add_item_detail_id?', ClaimResponse.put.claimResponseAddItemDetail);
	app.put('/:apikey/ClaimResponseAddItemDetail/:claim_response_add_item_detail_id?/claimResponseAdjudicationItem/:claim_response_adjudication_id?', ClaimResponse.put.claimResponseAdjudicationAddItemDetail);
	app.put('/:apikey/ClaimResponse/:claim_response_id?/claimResponseError/:claim_response_error_id?', ClaimResponse.put.claimResponseError);
	app.put('/:apikey/ClaimResponse/:claim_response_id?/claimResponseProcessNote/:claim_response_process_note_id?', ClaimResponse.put.claimResponseProcessNote);
	app.put('/:apikey/ClaimResponse/:claim_response_id?/claimResponseInsurance/:claim_response_insurance_id?', ClaimResponse.put.claimResponseInsurance);

	app.get('/:apikey/ClaimResponse/:claim_response_id?/identifier/:identifier_id?', ClaimResponse.get.identifier);
	app.post('/:apikey/ClaimResponse/:claim_response_id?/identifier', ClaimResponse.post.identifier);
	app.put('/:apikey/ClaimResponse/:claim_response_id?/identifier/:identifier_id?', ClaimResponse.put.identifier);
}
module.exports = routesClaimResponse;
