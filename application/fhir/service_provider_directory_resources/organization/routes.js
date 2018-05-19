var routesOrganization = function(app, Organization){
	app.get('/:apikey/Organization', Organization.get.organization);
	app.get('/:apikey/Organization/:organization_id?/OrganizationContact/:organization_contact_id?', Organization.get.organizationContact);
	app.get('/:apikey/Organization/:organization_id?/Identifier/:identifier_id?', Organization.get.identifier);
	app.get('/:apikey/Organization/:organization_id?/Telecom/:contact_point_id?', Organization.get.telecom);
	app.get('/:apikey/Organization/:organization_id?/Address/:address_id?', Organization.get.address);
	
	app.post('/:apikey/Organization', Organization.post.organization);
	app.post('/:apikey/Organization/:organization_id?/organizationContact', Organization.post.organizationContact);
	app.post('/:apikey/Organization/:organization_id?/Identifier', Organization.post.identifier);
	app.post('/:apikey/Organization/:organization_id?/Telecom', Organization.post.telecom);
	app.post('/:apikey/Organization/:organization_id?/Address', Organization.post.address);
	app.post('/:apikey/Organization/:organization_id?/Endpoint', Organization.post.endpointRef);
	
	app.put('/:apikey/Organization/:organization_id?', Organization.put.organization);
	app.put('/:apikey/Organization/:organization_id?/OrganizationContact/:organization_contact_id?', Organization.put.organizationContact);
	app.put('/:apikey/Organization/:organization_id?/OrganizationContact/:organization_contact_id?/Address/:address_id?', Organization.put.organizationContactaddress);
	app.put('/:apikey/Organization/:organization_id?/OrganizationContact/:organization_contact_id?/Telecom/:contact_point_id?', Organization.put.organizationContactTelecom);
	app.put('/:apikey/Organization/:organization_id?/OrganizationContact/:organization_contact_id?/HumanName/:human_name_id?', Organization.put.organizationContactHumanName);
	app.put('/:apikey/Organization/:organization_id?/Identifier/:identifier_id?', Organization.put.identifier);
	app.put('/:apikey/Organization/:organization_id?/Telecom/:contact_point_id?', Organization.put.telecom);
	app.put('/:apikey/Organization/:organization_id?/Address/:address_id?', Organization.put.address);

}
module.exports = routesOrganization