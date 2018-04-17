var routesPractitioner= function(app, Practitioner){
	app.get('/:apikey/Practitioner/', Practitioner.get.practitioner);
	app.get('/:apikey/Practitioner/:practitioner_id?/Qualification/:qualification_id?', Practitioner.get.qualification);
	app.get('/:apikey/Practitioner/:practitioner_id?/Communication/:communication_id?', Practitioner.get.communication);
	app.get('/:apikey/Practitioner/:practitioner_id?/Identifier/:identifier_id?', Practitioner.get.identifier);
	app.get('/:apikey/Practitioner/:practitioner_id?/HumanName/:human_name_id?', Practitioner.get.humanName);
	app.get('/:apikey/Practitioner/:practitioner_id?/Telecom/:contact_point_id?', Practitioner.get.telecom);
	app.get('/:apikey/Practitioner/:practitioner_id?/Address/:address_id?', Practitioner.get.address);
	app.get('/:apikey/Practitioner/:practitioner_id?/Photo/:attachment_id?', Practitioner.get.attachment);
	
	app.post('/:apikey/Practitioner', Practitioner.post.practitioner);
	app.post('/:apikey/Practitioner/:practitioner_id?/Qualification', Practitioner.post.qualification);
	app.post('/:apikey/Practitioner/:practitioner_id?/Communication', Practitioner.post.communication);
	app.post('/:apikey/Practitioner/:practitioner_id?/Identifier', Practitioner.post.identifier);
	app.post('/:apikey/Practitioner/:practitioner_id?/HumanName', Practitioner.post.humanName);
	app.post('/:apikey/Practitioner/:practitioner_id?/Telecom', Practitioner.post.telecom);
	app.post('/:apikey/Practitioner/:practitioner_id?/Address', Practitioner.post.address);
	app.post('/:apikey/Practitioner/:practitioner_id?/Photo', Practitioner.post.attachment);
	
	app.put('/:apikey/Practitioner/:practitioner_id?', Practitioner.put.practitioner);
	app.put('/:apikey/Practitioner/:practitioner_id?/Qualification/:qualification_id?', Practitioner.put.qualification);
	app.put('/:apikey/Practitioner/:practitioner_id?/Qualification/:qualification_id?/Identifier/:identifier_id?', Practitioner.put.identifierQualification);
	app.put('/:apikey/Practitioner/:practitioner_id?/Communication/:communication_id?', Practitioner.put.communication);
	app.put('/:apikey/Practitioner/:practitioner_id?/Identifier/:identifier_id?', Practitioner.put.identifier);
	app.put('/:apikey/Practitioner/:practitioner_id?/HumanName/:human_name_id?', Practitioner.put.humanName);
	app.put('/:apikey/Practitioner/:practitioner_id?/Telecom/:contact_point_id?', Practitioner.put.telecom);
	app.put('/:apikey/Practitioner/:practitioner_id?/Address/:address_id?', Practitioner.put.address);
	app.put('/:apikey/Practitioner/:practitioner_id?/Photo/:attachment_id?', Practitioner.put.attachment);
}
module.exports = routesPractitioner