var routesOrganization = function(app, Organization){
	app.get('/:apikey/Organization', Organization.get.organization);
	app.get('/:apikey/OrganizationContact', Organization.get.organizationContact);
	
	app.post('/:apikey/Organization', Organization.post.organization);
	app.post('/:apikey/OrganizationContact', Organization.post.organizationContact);
	
}
module.exports = routesOrganization;