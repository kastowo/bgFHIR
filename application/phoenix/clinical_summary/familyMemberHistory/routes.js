var routesFamilyMemberHistory = function(app, FamilyMemberHistory){
	app.get('/:apikey/FamilyMemberHistory', FamilyMemberHistory.get.familyMemberHistory);
	app.get('/:apikey/FamilyMemberHistoryCondition', FamilyMemberHistory.get.familyMemberHistoryCondition);
	app.get('/:apikey/FamilyMemberHistoryDefinitionPlanDefinition', FamilyMemberHistory.get.familyMemberHistoryDefinitionPlanDefinition);
	app.get('/:apikey/FamilyMemberHistoryDefinitionQuestionnaire', FamilyMemberHistory.get.familyMemberHistoryDefinitionQuestionnaire);
	app.get('/:apikey/FamilyMemberHistoryReasonReferenceCondition', FamilyMemberHistory.get.familyMemberHistoryReasonReferenceCondition);
	app.get('/:apikey/FamilyMemberHistoryReasonReferenceObservation', FamilyMemberHistory.get.familyMemberHistoryReasonReferenceObservation);
	app.get('/:apikey/FamilyMemberHistoryReasonReferenceAllergyIntolerance', FamilyMemberHistory.get.familyMemberHistoryReasonReferenceAllergyIntolerance);
	app.get('/:apikey/FamilyMemberHistoryReasonReferenceQuestionnaireResponse', FamilyMemberHistory.get.familyMemberHistoryReasonReferenceQuestionnaireResponse);
	
	app.post('/:apikey/FamilyMemberHistory', FamilyMemberHistory.post.familyMemberHistory);
	app.post('/:apikey/FamilyMemberHistoryCondition', FamilyMemberHistory.post.familyMemberHistoryCondition);
	
	app.put('/:apikey/FamilyMemberHistory/:_id?', FamilyMemberHistory.put.familyMemberHistory);
	app.put('/:apikey/FamilyMemberHistoryCondition/:_id?/:dr?', FamilyMemberHistory.put.familyMemberHistoryCondition);
	
}
module.exports = routesFamilyMemberHistory;