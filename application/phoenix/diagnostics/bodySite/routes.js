var routesBodysite = function(app, Bodysite){
	app.get('/:apikey/Bodysite', Bodysite.get.bodysite);
	
	app.post('/:apikey/Bodysite', Bodysite.post.bodysite);
	
	app.put('/:apikey/Bodysite/:_id?', Bodysite.put.bodysite);
	
}
module.exports = routesBodysite;