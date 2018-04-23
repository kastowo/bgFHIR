var routesSubstance = function(app, Substance){
	app.get('/:apikey/Substance', Substance.get.substance);
	app.get('/:apikey/Substance/:substance_id?/Instance/:instance_id?', Substance.get.substanceInstance);
	app.get('/:apikey/Substance/:substance_id?/Ingredient/:ingredient_id?', Substance.get.substanceIngredient);

	app.post('/:apikey/Substance', Substance.post.substance);
	app.post('/:apikey/Substance/:substance_id?/Instance?', Substance.post.substanceInstance);
	app.post('/:apikey/Substance/:substance_id?/Ingredient?', Substance.post.substanceIngredient);

	app.put('/:apikey/Substance/:substance_id?', Substance.put.substance);
	app.put('/:apikey/Substance/:substance_id?/Instance/:instance_id?', Substance.put.substanceInstance);
	app.put('/:apikey/Substance/:substance_id?/Ingredient/:ingredient_id?', Substance.put.substanceIngredient);
	
}
module.exports = routesSubstance;