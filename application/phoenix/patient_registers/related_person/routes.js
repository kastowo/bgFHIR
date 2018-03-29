var routesRelatedPerson = function(app, RelatedPerson){
	app.get('/:apikey/RelatedPerson', RelatedPerson.get.relatedPerson);
	app.post('/:apikey/related-person', RelatedPerson.post.relatedPerson);
	app.put('/:apikey/related-person/:related_person_id?', RelatedPerson.put.relatedPerson);
}
module.exports = routesRelatedPerson;