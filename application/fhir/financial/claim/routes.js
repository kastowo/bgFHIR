var routesClaim = function(app, Claim){
	
	//get method
	app.get('/:apikey/Claim', Claim.get.claim);
	app.get('/:apikey/Claim/:claim_id?/ClaimItem/:item?', Claim.get.claimItem);
	app.get('/:apikey/ClaimItem/:item?/ClaimItemDetail/:detail_id?', Claim.get.claimItemDetail);
	app.get('/:apikey/ClaimItemDetail/:detail_id?/ClaimItemSubDetail/:sub_detail_id?', Claim.get.claimItemSubDetail);

	//post method
	app.post('/:apikey/Claim', Claim.post.claim);
	//put method
	app.put('/:apikey/Claim/:claim_id?', Claim.put.claim);
	app.put('/:apikey/Claim/:claim_id?/ClaimRelated/:claim_related_id?', Claim.put.claimRelated);
	app.put('/:apikey/Claim/:claim_id?/ClaimCareTeam/:claim_care_team_id?', Claim.put.claimCareTeam);
	app.put('/:apikey/Claim/:claim_id?/ClaimInformation/:claim_information_id?', Claim.put.claimInformation);
	app.put('/:apikey/Claim/:claim_id?/ClaimDiagnosis/:claim_diagnosis_id?', Claim.put.claimDiagnosis);
	app.put('/:apikey/Claim/:claim_id?/ClaimProcedure/:claim_procedure_id?', Claim.put.claimProcedure);
	app.put('/:apikey/Claim/:claim_id?/ClaimInsurance/:claim_insurance_id?', Claim.put.claimInsurance);
	app.put('/:apikey/Claim/:claim_id?/ClaimAccident/:claim_accident_id?', Claim.put.claimAccident);
	app.put('/:apikey/Claim/:claim_id?/ClaimItem/:claim_item_id?', Claim.put.claimItem);
	app.put('/:apikey/ClaimItem/:claim_item_id?/ClaimDetail/:claim_item_detail_id?', Claim.put.claimDetail);
	app.put('/:apikey/ClaimDetail/:claim_item_detail_id?/ClaimSubDetail/:claim_item_sub_detail_id?', Claim.put.claimSubDetail);
	
	
	
	app.get('/:apikey/Claim/:claim_id?/identifier/:identifier_id?', Claim.get.identifier);
	app.post('/:apikey/Claim/:claim_id?/identifier', Claim.post.identifier);
	app.put('/:apikey/Claim/:claim_id?/identifier/:identifier_id?', Claim.put.identifier);
}
module.exports = routesClaim;
