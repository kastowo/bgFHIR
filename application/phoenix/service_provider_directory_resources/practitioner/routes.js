var routesPractitioner = function(app, Practitioner){
	app.get('/:apikey/Practitioner', Practitioner.get.practitioner);
	app.get('/:apikey/PractitionerCommunication', Practitioner.get.practitionerCommunication);
	app.get('/:apikey/Qualification', Practitioner.get.qualification);
	
	app.post('/:apikey/Practitioner', Practitioner.post.practitioner);
	app.post('/:apikey/Qualification', Practitioner.post.qualification);
	app.post('/:apikey/PractitionerCommunication', Practitioner.post.practitionerCommunication);
	
}
module.exports = routesPractitioner;