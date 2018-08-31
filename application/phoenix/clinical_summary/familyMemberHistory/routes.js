var routesFamilyMemberHistory = function(app, FamilyMemberHistory){
	app.get('/:apikey/FamilyMemberHistory', FamilyMemberHistory.get.familyMemberHistory);
	app.get('/:apikey/FamilyMemberHistoryCondition', FamilyMemberHistory.get.familyMemberHistoryCondition);
	
	app.post('/:apikey/FamilyMemberHistory', FamilyMemberHistory.post.familyMemberHistory);
	app.post('/:apikey/FamilyMemberHistoryCondition', FamilyMemberHistory.post.familyMemberHistoryCondition);
	
	app.put('/:apikey/FamilyMemberHistory/:family_member_history_id', FamilyMemberHistory.put.familyMemberHistory);
	app.put('/:apikey/FamilyMemberHistoryCondition/:condition_id', FamilyMemberHistory.put.familyMemberHistoryCondition);
	
}
module.exports = routesFamilyMemberHistory;