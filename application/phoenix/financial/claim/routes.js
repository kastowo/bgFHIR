var routesClaim = function(app, Claim){
	app.get('/:apikey/Claim', Claim.get.claim);
	app.get('/:apikey/ClaimRelated', Claim.get.claimRelated);
	app.get('/:apikey/ClaimCareTeam', Claim.get.claimCareTeam);
	app.get('/:apikey/ClaimInformation', Claim.get.claimInformation);
	app.get('/:apikey/ClaimDiagnosis', Claim.get.claimDiagnosis);
	app.get('/:apikey/ClaimProcedure', Claim.get.claimProcedure);
	app.get('/:apikey/ClaimInsurance', Claim.get.claimInsurance);
	app.get('/:apikey/ClaimAccident', Claim.get.claimAccident);
	app.get('/:apikey/ClaimItem', Claim.get.claimItem);
	app.get('/:apikey/ClaimDetail', Claim.get.claimDetail);
	app.get('/:apikey/ClaimSubDetail', Claim.get.claimSubDetail);

	app.get('/:apikey/ClaimItemUdi', Claim.get.claimItemUdi);
	app.get('/:apikey/ClaimItemEncounter', Claim.get.claimItemEncounter);	
	app.get('/:apikey/ClaimItemDetailUdi', Claim.get.claimItemDetailUdi);
	app.get('/:apikey/ClaimItemSubDetailUdi', Claim.get.claimItemSubDetailUdi);
	
	app.post('/:apikey/Claim', Claim.post.claim);
	app.post('/:apikey/ClaimRelated', Claim.post.claimRelated);
	app.post('/:apikey/ClaimCareTeam', Claim.post.claimCareTeam);
	app.post('/:apikey/ClaimInformation', Claim.post.claimInformation);
	app.post('/:apikey/ClaimDiagnosis', Claim.post.claimDiagnosis);
	app.post('/:apikey/ClaimProcedure', Claim.post.claimProcedure);
	app.post('/:apikey/ClaimInsurance', Claim.post.claimInsurance);
	app.post('/:apikey/ClaimAccident', Claim.post.claimAccident);
	app.post('/:apikey/ClaimItem', Claim.post.claimItem);
	app.post('/:apikey/ClaimDetail', Claim.post.claimDetail);
	app.post('/:apikey/ClaimSubDetail', Claim.post.claimSubDetail);


	app.put('/:apikey/Claim/:_id?', Claim.put.claim);
	app.put('/:apikey/ClaimRelated/:_id?/:dr?', Claim.put.claimRelated);	
	app.put('/:apikey/ClaimCareTeam/:_id?/:dr?', Claim.put.claimCareTeam);
	app.put('/:apikey/ClaimInformation/:_id?/:dr?', Claim.put.claimInformation);
	app.put('/:apikey/ClaimDiagnosis/:_id?/:dr?', Claim.put.claimDiagnosis);
	app.put('/:apikey/ClaimProcedure/:_id?/:dr?', Claim.put.claimProcedure);
	app.put('/:apikey/ClaimInsurance/:_id?/:dr?', Claim.put.claimInsurance);
	app.put('/:apikey/ClaimAccident/:_id?/:dr?', Claim.put.claimAccident);	
	app.put('/:apikey/ClaimItem/:_id?/:dr?', Claim.put.claimItem);
	app.put('/:apikey/ClaimDetail/:_id?/:dr?', Claim.put.claimDetail);
	app.put('/:apikey/ClaimSubDetail/:_id?/:dr?', Claim.put.claimSubDetail);
}
module.exports = routesClaim;
