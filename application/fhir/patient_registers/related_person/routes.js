var routesRelatedPerson = function(app, RelatedPerson){
	app.get('/:apikey/RelatedPerson', RelatedPerson.get.relatedPerson);
	app.get('/:apikey/RelatedPerson/:related_person_id?/Identifier/:identifier_id?', RelatedPerson.get.identifier);
	app.get('/:apikey/RelatedPerson/:related_person_id?/HumanName/:human_name_id?', RelatedPerson.get.humanName);
	app.get('/:apikey/RelatedPerson/:related_person_id?/Telecom/:contact_point_id?', RelatedPerson.get.telecom);
	app.get('/:apikey/RelatedPerson/:related_person_id?/Address/:address_id?', RelatedPerson.get.address);
	app.get('/:apikey/RelatedPerson/:related_person_id?/Photo/:attachment_id?', RelatedPerson.get.attachment);
	
	app.post('/:apikey/RelatedPerson', RelatedPerson.post.relatedPerson);
	app.post('/:apikey/RelatedPerson/:related_person_id?/Identifier', RelatedPerson.post.identifier);
	app.post('/:apikey/RelatedPerson/:related_person_id?/HumanName', RelatedPerson.post.humanName);
	app.post('/:apikey/RelatedPerson/:related_person_id?/Telecom', RelatedPerson.post.telecom);
	app.post('/:apikey/RelatedPerson/:related_person_id?/Address', RelatedPerson.post.address);
	app.post('/:apikey/RelatedPerson/:related_person_id?/Photo', RelatedPerson.post.attachment);

	app.put('/:apikey/RelatedPerson/:related_person_id?', RelatedPerson.put.relatedPerson);
	app.put('/:apikey/RelatedPerson/:related_person_id?/Identifier/:identifier_id?', RelatedPerson.put.identifier);
	app.put('/:apikey/RelatedPerson/:related_person_id?/HumanName/:human_name_id?', RelatedPerson.put.humanName);
	app.put('/:apikey/RelatedPerson/:related_person_id?/Telecom/:contact_point_id?', RelatedPerson.put.telecom);
	app.put('/:apikey/RelatedPerson/:related_person_id?/Address/:address_id?', RelatedPerson.put.address);
	app.put('/:apikey/RelatedPerson/:related_person_id?/Photo/:attachment_id?', RelatedPerson.put.attachment);
}
module.exports = routesRelatedPerson;