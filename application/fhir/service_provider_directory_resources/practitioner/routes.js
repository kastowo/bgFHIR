var routesPractitioner= function(app, Practitioner){
	app.get('/:apikey/Practitioner/:practitioner_id?', Practitioner.get.practitioner);
	app.get('/:apikey/Practitioner/:practitioner_id?/Qualification/:qualification_id?', Practitioner.get.qualification);
	app.get('/:apikey/Practitioner/:practitioner_id?/Communication/:communication_id?', Practitioner.get.communication);
	app.get('/:apikey/Practitioner/:practitioner_id?/Identifier/:identifier_id?', Practitioner.get.identifier);
	app.get('/:apikey/Practitioner/:practitioner_id?/HumanName/:human_name_id?', Practitioner.get.humanName);
	app.get('/:apikey/Practitioner/:practitioner_id?/Telecom/:contact_point_id?', Practitioner.get.telecom);
	app.get('/:apikey/Practitioner/:practitioner_id?/Address/:address_id?', Practitioner.get.address);
	app.get('/:apikey/Practitioner/:practitioner_id?/Photo/:attachment_id?', Practitioner.get.attachment);
	
	app.post('/:apikey/Practitioner', Practitioner.post);
}
module.exports = routesPractitioner