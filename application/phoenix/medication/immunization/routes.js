var routesImmunization = function(app, Immunization){
	app.get('/:apikey/Immunization', Immunization.get.immunization);
	app.get('/:apikey/ImmunizationPractitioner', Immunization.get.immunizationPractitioner);
	app.get('/:apikey/ImmunizationReaction', Immunization.get.immunizationReaction);
	app.get('/:apikey/ImmunizationVaccinationProtocol', Immunization.get.immunizationVaccinationProtocol);
	
	app.post('/:apikey/Immunization', Immunization.post.immunization);
	app.post('/:apikey/ImmunizationPractitioner', Immunization.post.immunizationPractitioner);
	app.post('/:apikey/ImmunizationReaction', Immunization.post.immunizationReaction);
	app.post('/:apikey/ImmunizationVaccinationProtocol', Immunization.post.immunizationVaccinationProtocol);
	
	app.put('/:apikey/Immunization/:_id?', Immunization.put.immunization);
	app.put('/:apikey/ImmunizationPractitioner/:_id?/:dr?', Immunization.put.immunizationPractitioner);
	app.put('/:apikey/ImmunizationReaction/:_id?/:dr?', Immunization.put.immunizationReaction);
	app.put('/:apikey/ImmunizationVaccinationProtocol/:_id?/:dr?', Immunization.put.immunizationVaccinationProtocol);
}
module.exports = routesImmunization;