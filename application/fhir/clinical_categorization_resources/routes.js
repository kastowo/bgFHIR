var routesClinicalCategorizationResources = function(app, ClinicalCategorizationResources){
	//get method
	app.get('/:apikey/EpisodeOfCare', ClinicalCategorizationResources.get);

	//post method
	app.post('/:apikey/EpisodeOfCare', ClinicalCategorizationResources.post);

	//put method
	app.put('/:apikey/EpisodeOfCare', ClinicalCategorizationResources.put);

}
module.exports = routesClinicalCategorizationResources;