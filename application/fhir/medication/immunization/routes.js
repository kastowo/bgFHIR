var routesImmunization = function(app, Immunization){
	app.get('/:apikey/Immunization', Immunization.get.immunization);
	/*app.get('/:apikey/Immunization/:immunization_id?/ImmunizationContact/:immunization_contact_id?', Immunization.get.immunizationContact);
	app.get('/:apikey/Immunization/:immunization_id?/Identifier/:identifier_id?', Immunization.get.identifier);
	app.get('/:apikey/Immunization/:immunization_id?/Telecom/:contact_point_id?', Immunization.get.telecom);
	app.get('/:apikey/Immunization/:immunization_id?/Address/:address_id?', Immunization.get.address);*/
	
	app.post('/:apikey/Immunization', Immunization.post.immunization);
	/*app.post('/:apikey/Immunization/:immunization_id?/immunizationContact', Immunization.post.immunizationContact);
	app.post('/:apikey/Immunization/:immunization_id?/Identifier', Immunization.post.identifier);
	app.post('/:apikey/Immunization/:immunization_id?/Telecom', Immunization.post.telecom);
	app.post('/:apikey/Immunization/:immunization_id?/Address', Immunization.post.address);
	app.post('/:apikey/Immunization/:immunization_id?/Endpoint', Immunization.post.endpointRef);
	*/
	app.put('/:apikey/Immunization/:immunization_id?', Immunization.put.immunization);
	/*app.put('/:apikey/Immunization/:immunization_id?/ImmunizationContact/:immunization_contact_id?', Immunization.put.immunizationContact);
	app.put('/:apikey/Immunization/:immunization_id?/ImmunizationContact/:immunization_contact_id?/Address/:address_id?', Immunization.put.immunizationContactaddress);
	app.put('/:apikey/Immunization/:immunization_id?/ImmunizationContact/:immunization_contact_id?/Telecom/:contact_point_id?', Immunization.put.immunizationContactTelecom);
	app.put('/:apikey/Immunization/:immunization_id?/ImmunizationContact/:immunization_contact_id?/HumanName/:human_name_id?', Immunization.put.immunizationContactHumanName);
	app.put('/:apikey/Immunization/:immunization_id?/Identifier/:identifier_id?', Immunization.put.identifier);
	app.put('/:apikey/Immunization/:immunization_id?/Telecom/:contact_point_id?', Immunization.put.telecom);
	app.put('/:apikey/Immunization/:immunization_id?/Address/:address_id?', Immunization.put.address);
*/
}
module.exports = routesImmunization