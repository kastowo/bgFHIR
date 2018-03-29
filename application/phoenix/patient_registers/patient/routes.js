var routesPatient = function(app, Patient){
	app.get('/:apikey/Patient', Patient.get.patient);
	app.get('/:apikey/PatientAnimal', Patient.get.patientAnimal);
	app.get('/:apikey/PatientContact', Patient.get.patientContact);
	app.get('/:apikey/PatientLink', Patient.get.patientLink);
	app.get('/:apikey/GeneralPractitioner', Patient.get.generalPractitioner);
	app.get('/:apikey/PatientCommunication', Patient.get.patientCommunication);

	app.post('/:apikey/patient', Patient.post.patient);
	app.post('/:apikey/patient-animal', Patient.post.patientAnimal);
	app.post('/:apikey/patient-contact', Patient.post.patientContact);
	app.post('/:apikey/patient-link', Patient.post.patientLink);
	app.post('/:apikey/patient-communication', Patient.post.patientCommunication);
	app.post('/:apikey/general-practitioner', Patient.post.generalPractitioner);

	app.put('/:apikey/patient/:patient_id?', Patient.put.patient);
	app.put('/:apikey/patient-contact/:patient_contact_id?/:dr?', Patient.put.patientContact);
	
}
module.exports = routesPatient;