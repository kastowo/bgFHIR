var routesSubstance = function(app, Substance){
	app.get('/:apikey/substance', Substance.get.substance);
	app.get('/:apikey/substance-instance', Substance.get.substanceInstance);
	app.get('/:apikey/substance-ingredient', Substance.get.substanceIngredient);

	app.post('/:apikey/substance', Substance.post.substance);
	app.post('/:apikey/substance-instance', Substance.post.substanceInstance);
	app.post('/:apikey/substance-ingredient', Substance.post.substanceIngredient);

	app.put('/:apikey/substance/:substance_id', Substance.put.substance);
	app.put('/:apikey/substance-instance/:id?/:dr?', Substance.put.substanceInstance);
	app.put('/:apikey/substance-ingredient/:id?/:dr?', Substance.put.substanceIngredient);
}
module.exports = routesSubstance;