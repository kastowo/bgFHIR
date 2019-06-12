var routesExplanationOfBenefit = function(app, ExplanationOfBenefit){
	
	//get method
	app.get('/:apikey/ExplanationOfBenefit/:explanation_of_benefit_id?', ExplanationOfBenefit.get.explanationOfBenefit);
	app.get('/:apikey/ExplanationOfBenefit/:explanation_of_benefit_id?/ExplanationOfBenefitItem/:item_id?', ExplanationOfBenefit.get.explanationOfBenefitItem);
	app.get('/:apikey/ExplanationOfBenefitItem/:item_id?/ExplanationOfBenefitItemDetail/:detail_id?', ExplanationOfBenefit.get.explanationOfBenefitItemDetail);
	app.get('/:apikey/ExplanationOfBenefitItemDetail/:detail_id?/ExplanationOfBenefitItemSubDetail/:sub_detail_id?', ExplanationOfBenefit.get.explanationOfBenefitItemSubDetail);
	app.get('/:apikey/ExplanationOfBenefit/:explanation_of_benefit_id?/ExplanationOfBenefitAddItem/:add_item_id?', ExplanationOfBenefit.get.explanationOfBenefitAddItem);
	app.get('/:apikey/ExplanationOfBenefitAddItem/:add_item_id?/ExplanationOfBenefitAddItemDetail/:add_item_detail_id?', ExplanationOfBenefit.get.explanationOfBenefitAddItemDetail);
	app.get('/:apikey/ExplanationOfBenefit/:explanation_of_benefit_id?/ExplanationOfBenefitBalance/:balance_id?', ExplanationOfBenefit.get.explanationOfBenefitBalance);

	//post method
	app.post('/:apikey/ExplanationOfBenefit', ExplanationOfBenefit.post.explanationOfBenefit);
	//put method
	app.put('/:apikey/ExplanationOfBenefit/:explanation_of_benefit_id?', ExplanationOfBenefit.put.explanationOfBenefit);
	
	/*app.put('/:apikey/ExplanationOfBenefit/:explanation_of_benefit_id?/explanationOfBenefitItem/:explanation_of_benefit_item_id?', ExplanationOfBenefit.put.explanationOfBenefitItem);
	app.put('/:apikey/ExplanationOfBenefitItem/:explanation_of_benefit_item_id?/explanationOfBenefitAdjudicationItem/:explanation_of_benefit_adjudication_id?', ExplanationOfBenefit.put.explanationOfBenefitAdjudicationItem);
	app.put('/:apikey/ExplanationOfBenefitItem/:explanation_of_benefit_item_id?/explanationOfBenefitItemDetail/:explanation_of_benefit_item_detail_id?', ExplanationOfBenefit.put.explanationOfBenefitItemDetail);
	app.put('/:apikey/ExplanationOfBenefitItemDetail/:explanation_of_benefit_item_detail_id?/explanationOfBenefitAdjudicationItem/:explanation_of_benefit_adjudication_id?', ExplanationOfBenefit.put.explanationOfBenefitAdjudicationDetal);
	app.put('/:apikey/ExplanationOfBenefitItemDetail/:explanation_of_benefit_item_detail_id?/explanationOfBenefitItemSubDetail/:explanation_of_benefit_item_sub_detail_id?', ExplanationOfBenefit.put.explanationOfBenefitItemSubDetail);
	app.put('/:apikey/ExplanationOfBenefitItemSubDetail/:explanation_of_benefit_item_sub_detail_id?/explanationOfBenefitAdjudicationItem/:explanation_of_benefit_adjudication_id?', ExplanationOfBenefit.put.explanationOfBenefitAdjudicationSubDetail);
	app.put('/:apikey/ExplanationOfBenefit/:explanation_of_benefit_id?/explanationOfBenefitAddItem/:explanation_of_benefit_add_item_id?', ExplanationOfBenefit.put.explanationOfBenefitAddItem);
	app.put('/:apikey/ExplanationOfBenefitAddItem/:explanation_of_benefit_add_item_id?/explanationOfBenefitAdjudicationItem/:explanation_of_benefit_adjudication_id?', ExplanationOfBenefit.put.explanationOfBenefitAdjudicationAddItem);
	app.put('/:apikey/ExplanationOfBenefitAddItem/:explanation_of_benefit_add_item_id?/explanationOfBenefitAddItemDetail/:explanation_of_benefit_add_item_detail_id?', ExplanationOfBenefit.put.explanationOfBenefitAddItemDetail);
	app.put('/:apikey/ExplanationOfBenefitAddItemDetail/:explanation_of_benefit_add_item_detail_id?/explanationOfBenefitAdjudicationItem/:explanation_of_benefit_adjudication_id?', ExplanationOfBenefit.put.explanationOfBenefitAdjudicationAddItemDetail);*/
	
	
	app.put('/:apikey/ExplanationOfBenefit/:explanation_of_benefit_id?/explanationOfBenefitProcessNote/:explanation_of_benefit_process_note_id?', ExplanationOfBenefit.put.explanationOfBenefitProcessNote);
	

	app.get('/:apikey/ExplanationOfBenefit/:explanation_of_benefit_id?/identifier/:identifier_id?', ExplanationOfBenefit.get.identifier);
	app.post('/:apikey/ExplanationOfBenefit/:explanation_of_benefit_id?/identifier', ExplanationOfBenefit.post.identifier);
	app.put('/:apikey/ExplanationOfBenefit/:explanation_of_benefit_id?/identifier/:identifier_id?', ExplanationOfBenefit.put.identifier);
}
module.exports = routesExplanationOfBenefit;
