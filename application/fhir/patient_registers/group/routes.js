var routesGroup = function(app, Group){
	app.get('/:apikey/Group', Group.get.group);
	app.get('/:apikey/Group/:group_id?/Member/:member_id?', Group.get.member);
	app.get('/:apikey/Group/:group_id?/Characteristic/:characteristic_id?', Group.get.characteristic);

	app.post('/:apikey/Group', Group.post.group);
	app.post('/:apikey/Group/:group_id?/Member', Group.post.member);
	app.post('/:apikey/Group/:group_id?/Characteristic', Group.post.characteristic);

	app.put('/:apikey/Group/:group_id?', Group.put.group);	
	app.put('/:apikey/Group/:group_id?/Member/:member_id?', Group.put.member);	
	app.put('/:apikey/Group/:group_id?/Characteristic/:characteristic_id?', Group.put.characteristic);	
}
module.exports = routesGroup;