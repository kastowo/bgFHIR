var routesNutritionOrder = function(app, NutritionOrder){
	app.get('/:apikey/NutritionOrder', NutritionOrder.get.nutritionOrder);
	app.get('/:apikey/NutritionOrderNutrient', NutritionOrder.get.nutritionOrderNutrient);
	app.get('/:apikey/NutritionOrderTexture', NutritionOrder.get.nutritionOrderTexture);
	app.get('/:apikey/NutritionOrderSupplement', NutritionOrder.get.nutritionOrderSupplement);
	app.get('/:apikey/NutritionOrderEnternalFormulaAdmin', NutritionOrder.get.nutritionOrderEnternalFormulaAdmin);
	
	app.post('/:apikey/NutritionOrder', NutritionOrder.post.nutritionOrder);
	app.post('/:apikey/NutritionOrderNutrient', NutritionOrder.post.nutritionOrderNutrient);
	app.post('/:apikey/NutritionOrderTexture', NutritionOrder.post.nutritionOrderTexture);
	app.post('/:apikey/NutritionOrderSupplement', NutritionOrder.post.nutritionOrderSupplement);
	app.post('/:apikey/NutritionOrderEnternalFormulaAdmin', NutritionOrder.post.nutritionOrderEnternalFormulaAdmin);
	
	app.put('/:apikey/NutritionOrder/:nutrition_order_id', NutritionOrder.put.nutritionOrder);
	app.put('/:apikey/NutritionOrderNutrient/:nutrient_id', NutritionOrder.put.nutritionOrderNutrient);
	app.put('/:apikey/NutritionOrderTexture/:texture_id', NutritionOrder.put.nutritionOrderTexture);
	app.put('/:apikey/NutritionOrderSupplement/:supplement_id', NutritionOrder.put.nutritionOrderSupplement);
	app.put('/:apikey/NutritionOrderEnternalFormulaAdmin/:administration_id', NutritionOrder.put.nutritionOrderEnternalFormulaAdmin);
	
}
module.exports = routesNutritionOrder;