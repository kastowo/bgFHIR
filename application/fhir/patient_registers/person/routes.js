var routesPerson = function(app, Person){
	app.get('/:apikey/Person', Person.get.person);
	app.get('/:apikey/Person/:person_id?/Identifier/:identifier_id?', Person.get.identifier);
	app.get('/:apikey/Person/:person_id?/HumanName/:human_name_id?', Person.get.humanName);
	app.get('/:apikey/Person/:person_id?/Telecom/:contact_point_id?', Person.get.telecom);
	app.get('/:apikey/Person/:person_id?/Address/:address_id?', Person.get.address);
	app.get('/:apikey/Person/:person_id?/Photo/:attachment_id?', Person.get.attachment);
	app.get('/:apikey/Person/:person_id?/Link/:person_link_id?', Person.get.link);

	app.post('/:apikey/Person', Person.post.person);
	app.post('/:apikey/Person/:person_id?/Identifier', Person.post.identifier);
	app.post('/:apikey/Person/:person_id?/HumanName', Person.post.humanName);
	app.post('/:apikey/Person/:person_id?/Telecom', Person.post.telecom);
	app.post('/:apikey/Person/:person_id?/Address', Person.post.address);
	app.post('/:apikey/Person/:person_id?/Link', Person.post.link);

	app.put('/:apikey/Person/:person_id?', Person.put.person);
	app.put('/:apikey/Person/:person_id?/Identifier/:identifier_id?', Person.put.identifier);
	app.put('/:apikey/Person/:person_id?/HumanName/:human_name_id?', Person.put.humanName);
	app.put('/:apikey/Person/:person_id?/Telecom/:contact_point_id?', Person.put.telecom);
	app.put('/:apikey/Person/:person_id?/Address/:address_id?', Person.put.address);
	app.put('/:apikey/Person/:person_id?/Photo/:attachment_id?', Person.put.attachment);
	app.put('/:apikey/Person/:person_id?/Link/:person_link_id?', Person.put.link);
}
module.exports = routesPerson