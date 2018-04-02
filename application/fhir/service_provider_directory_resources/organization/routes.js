var routesOrganization = function(app, Organization){
	app.get('/:apikey/Organization', Organization.get);
	app.post('/:apikey/Organization', Organization.post);
}
module.exports = routesOrganization