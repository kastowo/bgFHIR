var routesFamilyMemberHistory = function(app, FamilyMemberHistory){
	app.get('/:apikey/FamilyMemberHistory/:family_member_history_id?', FamilyMemberHistory.get.familyMemberHistory);
	app.get('/:apikey/FamilyMemberHistory/:family_member_history_id?/identifier/:identifier_id?', FamilyMemberHistory.get.identifier);
	app.get('/:apikey/FamilyMemberHistory/:family_member_history_id?/FamilyMemberHistoryCondition/:family_member_history_condition_id?', FamilyMemberHistory.get.familyMemberHistoryCondition);
	
	
	app.post('/:apikey/FamilyMemberHistory', FamilyMemberHistory.post.familyMemberHistory);
	app.post('/:apikey/FamilyMemberHistory/:family_member_history_id?/identifier', FamilyMemberHistory.post.identifier);
	app.post('/:apikey/FamilyMemberHistory/:family_member_history_id?/FamilyMemberHistoryCondition', FamilyMemberHistory.post.familyMemberHistoryCondition);
	
	
	
	app.put('/:apikey/FamilyMemberHistory/:family_member_history_id?', FamilyMemberHistory.put.familyMemberHistory);
	app.put('/:apikey/FamilyMemberHistory/:family_member_history_id?/identifier/:identifier_id?', FamilyMemberHistory.put.identifier);
	app.put('/:apikey/FamilyMemberHistory/:family_member_history_id?/FamilyMemberHistoryCondition/:family_member_history_condition_id?', FamilyMemberHistory.put.familyMemberHistoryCondition);	
}
module.exports = routesFamilyMemberHistory;