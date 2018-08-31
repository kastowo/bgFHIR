var routesImmunization = function(app, Immunization){
	app.get('/:apikey/Immunization', Immunization.get.immunization);
	app.get('/:apikey/ImmunizationPractitioner', Immunization.get.immunizationPractitioner);
	app.get('/:apikey/ImmunizationReaction', Immunization.get.immunizationReaction);
	app.get('/:apikey/ImmunizationVaccinationProtocol', Immunization.get.immunizationVaccinationProtocol);
	
	app.post('/:apikey/Immunization', Immunization.post.immunization);
	app.post('/:apikey/ImmunizationPractitioner', Immunization.post.immunizationPractitioner);
	app.post('/:apikey/ImmunizationReaction', Immunization.post.immunizationReaction);
	app.post('/:apikey/ImmunizationVaccinationProtocol', Immunization.post.immunizationVaccinationProtocol);
	
	app.put('/:apikey/Immunization/:immunization_id', Immunization.put.immunization);
	app.put('/:apikey/ImmunizationPractitioner/:practitioner_id', Immunization.put.immunizationPractitioner);
	app.put('/:apikey/ImmunizationReaction/:reaction_id', Immunization.put.immunizationReaction);
	app.put('/:apikey/ImmunizationVaccinationProtocol/:vaccination_protocol_id', Immunization.put.immunizationVaccinationProtocol);
}
module.exports = routesImmunization;