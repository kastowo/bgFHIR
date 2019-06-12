var routesExplanationOfBenefit = function(app, ExplanationOfBenefit){
	app.get('/:apikey/ExplanationOfBenefit', ExplanationOfBenefit.get.explanationOfBenefit);
	app.get('/:apikey/ExplanationOfBenefitRelated', ExplanationOfBenefit.get.explanationOfBenefitRelated);
	app.get('/:apikey/ExplanationOfBenefitInformation', ExplanationOfBenefit.get.explanationOfBenefitInformation);
	app.get('/:apikey/ExplanationOfBenefitCareTeam', ExplanationOfBenefit.get.explanationOfBenefitCareTeam);
	app.get('/:apikey/ExplanationOfBenefitDiagnosis', ExplanationOfBenefit.get.explanationOfBenefitDiagnosis);
	app.get('/:apikey/ExplanationOfBenefitProcedure', ExplanationOfBenefit.get.explanationOfBenefitProcedure);
	app.get('/:apikey/ExplanationOfBenefitItem', ExplanationOfBenefit.get.explanationOfBenefitItem);
	app.get('/:apikey/ExplanationOfBenefitItemDetail', ExplanationOfBenefit.get.explanationOfBenefitItemDetail);
	app.get('/:apikey/ExplanationOfBenefitItemSubDetail', ExplanationOfBenefit.get.explanationOfBenefitItemSubDetail);
	app.get('/:apikey/ExplanationOfBenefitAddItem', ExplanationOfBenefit.get.explanationOfBenefitAddItem);
	app.get('/:apikey/ExplanationOfBenefitAddItemDetail', ExplanationOfBenefit.get.explanationOfBenefitAddItemDetail);
	app.get('/:apikey/ExplanationOfBenefitProcessNote', ExplanationOfBenefit.get.explanationOfBenefitProcessNote);
	app.get('/:apikey/ExplanationOfBenefitAdjudication', ExplanationOfBenefit.get.explanationOfBenefitAdjudication);
	app.get('/:apikey/ExplanationOfBenefitBalance', ExplanationOfBenefit.get.explanationOfBenefitBalance);
	app.get('/:apikey/ExplanationOfBenefitBalanceFinancial', ExplanationOfBenefit.get.explanationOfBenefitBalanceFinancial);
	app.get('/:apikey/ExplanationOfBenefitItemUdi', ExplanationOfBenefit.get.explanationOfBenefitItemUdi);
	app.get('/:apikey/ExplanationOfBenefitItemEncounter', ExplanationOfBenefit.get.explanationOfBenefitItemEncounter);
	app.get('/:apikey/ExplanationOfBenefitItemDetailUdi', ExplanationOfBenefit.get.explanationOfBenefitItemDetailUdi);
	app.get('/:apikey/ExplanationOfBenefitItemSubDetailUdi', ExplanationOfBenefit.get.explanationOfBenefitItemSubDetailUdi);

	app.post('/:apikey/ExplanationOfBenefit', ExplanationOfBenefit.post.explanationOfBenefit);
	app.post('/:apikey/ExplanationOfBenefitRelated', ExplanationOfBenefit.post.explanationOfBenefitRelated);
	app.post('/:apikey/ExplanationOfBenefitInformation', ExplanationOfBenefit.post.explanationOfBenefitInformation);
	app.post('/:apikey/ExplanationOfBenefitCareTeam', ExplanationOfBenefit.post.explanationOfBenefitCareTeam);
	app.post('/:apikey/ExplanationOfBenefitDiagnosis', ExplanationOfBenefit.post.explanationOfBenefitDiagnosis);
	app.post('/:apikey/ExplanationOfBenefitProcedure', ExplanationOfBenefit.post.explanationOfBenefitProcedure);
	app.post('/:apikey/ExplanationOfBenefitItem', ExplanationOfBenefit.post.explanationOfBenefitItem);
	app.post('/:apikey/ExplanationOfBenefitItemDetail', ExplanationOfBenefit.post.explanationOfBenefitItemDetail);
	app.post('/:apikey/ExplanationOfBenefitItemSubDetail', ExplanationOfBenefit.post.explanationOfBenefitItemSubDetail);
	app.post('/:apikey/ExplanationOfBenefitAddItem', ExplanationOfBenefit.post.explanationOfBenefitAddItem);
	app.post('/:apikey/ExplanationOfBenefitAddItemDetail', ExplanationOfBenefit.post.explanationOfBenefitAddItemDetail);
	app.post('/:apikey/ExplanationOfBenefitProcessNote', ExplanationOfBenefit.post.explanationOfBenefitProcessNote);
	app.post('/:apikey/ExplanationOfBenefitAdjudication', ExplanationOfBenefit.post.explanationOfBenefitAdjudication);
	app.post('/:apikey/ExplanationOfBenefitBalance', ExplanationOfBenefit.post.explanationOfBenefitBalance);
	app.post('/:apikey/ExplanationOfBenefitBalanceFinancial', ExplanationOfBenefit.post.explanationOfBenefitBalanceFinancial);
	
	app.put('/:apikey/ExplanationOfBenefit/:_id?', ExplanationOfBenefit.put.explanationOfBenefit);
	app.put('/:apikey/ExplanationOfBenefitRelated/:_id?', ExplanationOfBenefit.put.explanationOfBenefitRelated);
	app.put('/:apikey/ExplanationOfBenefitInformation/:_id?', ExplanationOfBenefit.put.explanationOfBenefitInformation);
	app.put('/:apikey/ExplanationOfBenefitCareTeam/:_id?', ExplanationOfBenefit.put.explanationOfBenefitCareTeam);
	app.put('/:apikey/ExplanationOfBenefitDiagnosis/:_id?', ExplanationOfBenefit.put.explanationOfBenefitDiagnosis);
	app.put('/:apikey/ExplanationOfBenefitProcedure/:_id?', ExplanationOfBenefit.put.explanationOfBenefitProcedure);
	app.put('/:apikey/ExplanationOfBenefitItem/:_id?', ExplanationOfBenefit.put.explanationOfBenefitItem);
	app.put('/:apikey/ExplanationOfBenefitItemDetail/:_id?', ExplanationOfBenefit.put.explanationOfBenefitItemDetail);
	app.put('/:apikey/ExplanationOfBenefitItemSubDetail/:_id?', ExplanationOfBenefit.put.explanationOfBenefitItemSubDetail);
	app.put('/:apikey/ExplanationOfBenefitAddItem/:_id?', ExplanationOfBenefit.put.explanationOfBenefitAddItem);
	app.put('/:apikey/ExplanationOfBenefitAddItemDetail/:_id?', ExplanationOfBenefit.put.explanationOfBenefitAddItemDetail);
	app.put('/:apikey/ExplanationOfBenefitProcessNote/:_id?', ExplanationOfBenefit.put.explanationOfBenefitProcessNote);
	app.put('/:apikey/ExplanationOfBenefitAdjudication/:_id?', ExplanationOfBenefit.put.explanationOfBenefitAdjudication);
	app.put('/:apikey/ExplanationOfBenefitBalance/:_id?', ExplanationOfBenefit.put.explanationOfBenefitBalance);
	app.put('/:apikey/ExplanationOfBenefitBalanceFinancial/:_id?', ExplanationOfBenefit.put.explanationOfBenefitBalanceFinancial);
	
	
}
module.exports = routesExplanationOfBenefit;
