var routesBodySite = function(app, BodySite){
	
	//get method
	app.get('/:apikey/BodySite', BodySite.get.bodySite);
	app.get('/:apikey/BodySite/:body_site_id?/identifier/:identifier_id?', BodySite.get.identifier);
	app.get('/:apikey/BodySite/:body_site_id?/Photo/:attachment_id?', BodySite.get.attachment);
	//post method
	app.post('/:apikey/BodySite', BodySite.post.bodySite);
	app.post('/:apikey/BodySite/:body_site_id?/identifier', BodySite.post.identifier);
	app.post('/:apikey/BodySite/:body_site_id?/attachment', BodySite.post.attachment);
	//put method
	app.put('/:apikey/BodySite/:body_site_id?', BodySite.put.bodySite);
	app.put('/:apikey/BodySite/:body_site_id?/identifier/:identifier_id?', BodySite.put.identifier);
	app.put('/:apikey/BodySite/:body_site_id?/attachment/:attachment_id?', BodySite.put.attachment);
}
module.exports = routesBodySite;