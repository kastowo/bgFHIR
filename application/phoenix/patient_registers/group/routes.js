var routesGroup = function(app, Group){
	app.get('/:apikey/Group_', Group.get.group);
	app.get('/:apikey/GroupCharacteristic', Group.get.groupCharacteristic);
	app.get('/:apikey/GroupMember', Group.get.groupMember);

	app.post('/:apikey/group_', Group.post.group);
	app.post('/:apikey/group-characteristic', Group.post.groupCharacteristic);
	app.post('/:apikey/group/:group_id/member', Group.post.groupMember);

	app.put('/:apikey/group-update/:group_id?', Group.put.group);
	app.put('/:apikey/group-member/:group_member_id?/:dr?', Group.put.groupMember);
	app.put('/:apikey/group-characteristic/:group_characteristic_id?/:dr?', Group.put.groupCharacteristic);

}
module.exports = routesGroup;