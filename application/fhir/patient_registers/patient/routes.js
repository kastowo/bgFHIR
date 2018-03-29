var routesPatient = function(app, Patient){
	app.get('/:apikey/Patient', Patient.get.patient);
	app.get('/:apikey/Patient/:patient_id?/Identifier/:identifier_id?', Patient.get.identifier);
	app.get('/:apikey/Patient/:patient_id?/HumanName/:human_name_id?', Patient.get.humanName);
	app.get('/:apikey/Patient/:patient_id?/Telecom/:contact_point_id?', Patient.get.telecom);
	app.get('/:apikey/Patient/:patient_id?/Address/:address_id?', Patient.get.address);
	app.get('/:apikey/Patient/:patient_id?/Photo/:attachment_id?', Patient.get.attachment);

	app.post('/:apikey/Patient', Patient.post.patient);
	app.post('/:apikey/Patient/:patient_id?/Identifier', Patient.post.identifier);
	app.post('/:apikey/Patient/:patient_id?/HumanName', Patient.post.humanName);
	app.post('/:apikey/Patient/:patient_id?/Telecom', Patient.post.telecom);
	app.post('/:apikey/Patient/:patient_id?/Address', Patient.post.address);
	app.post('/:apikey/Patient/:patient_id?/Photo', Patient.post.attachment);
	app.post('/:apikey/Patient/:patient_id?/Contact', Patient.post.contact);

	app.put('/:apikey/Patient/:patient_id?', Patient.put.patient);
	app.put('/:apikey/Patient/:patient_id?/Identifier/:identifier_id?', Patient.put.identifier);
	app.put('/:apikey/Patient/:patient_id?/HumanName/:human_name_id?', Patient.put.humanName);
	app.put('/:apikey/Patient/:patient_id?/Telecom/:contact_point_id?', Patient.put.telecom);
	app.put('/:apikey/Patient/:patient_id?/Address/:address_id?', Patient.put.address);
	app.put('/:apikey/Patient/:patient_id?/Photo/:attachment_id?', Patient.put.attachment);
	app.put('/:apikey/Patient/:patient_id?/Contact/:contact_id?', Patient.put.contact);

}
module.exports = routesPatient