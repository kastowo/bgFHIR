var routesPerson = function(app, Person){
	app.get('/:apikey/Person', Person.get.person);
	app.get('/:apikey/PersonLink', Person.get.personLink);

	app.post('/:apikey/person', Person.post.person);
	app.post('/:apikey/person-link', Person.post.personLink);

	app.put('/:apikey/person/:person_id', Person.put.person);
	app.put('/:apikey/person-link/:person_link_id?/:dr?', Person.put.personLink);
}
module.exports = routesPerson;