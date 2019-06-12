var routesImmunization = function(app, Immunization){
	app.get('/:apikey/Immunization/:immunization_id?', Immunization.get.immunization);
	app.get('/:apikey/Immunization/:immunization_id?/identifier/:identifier_id?', Immunization.get.identifier);
	app.get('/:apikey/Immunization/:immunization_id?/immunizationPractitioner/:immunization_practitioner_id?', Immunization.get.immunizationPractitioner);
	app.get('/:apikey/Immunization/:immunization_id?/immunizationReaction/:immunization_reaction_id?', Immunization.get.immunizationReaction);
	app.get('/:apikey/Immunization/:immunization_id?/immunizationVaccinationProtocol/:immunization_vaccination_protocol_id?', Immunization.get.immunizationVaccinationProtocol);

	app.post('/:apikey/Immunization', Immunization.post.immunization);
	app.post('/:apikey/Immunization/:immunization_id?/identifier', Immunization.post.identifier);
	app.post('/:apikey/Immunization/:immunization_id?/immunizationPractitioner', Immunization.post.immunizationPractitioner);
	app.post('/:apikey/Immunization/:immunization_id?/immunizationReaction', Immunization.post.immunizationReaction);
	app.post('/:apikey/Immunization/:immunization_id?/immunizationVaccinationProtocol', Immunization.post.immunizationVaccinationProtocol);
	
	app.put('/:apikey/Immunization/:immunization_id?', Immunization.put.immunization);
	app.put('/:apikey/Immunization/:immunization_id?/identifier/:identifier_id?', Immunization.put.identifier);
	app.put('/:apikey/Immunization/:immunization_id?/immunizationPractitioner/:immunization_practitioner_id?', Immunization.put.immunizationPractitioner);
	app.put('/:apikey/Immunization/:immunization_id?/immunizationReaction/:immunization_reaction_id?', Immunization.put.immunizationReaction);
	app.put('/:apikey/Immunization/:immunization_id?/immunizationVaccinationProtocol/:immunization_vaccination_protocol_id?', Immunization.put.immunizationVaccinationProtocol);
}
module.exports = routesImmunization