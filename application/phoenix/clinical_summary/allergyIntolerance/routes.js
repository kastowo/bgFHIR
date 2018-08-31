var routesAllergyIntolerance = function(app, AllergyIntolerance){
	app.get('/:apikey/AllergyIntolerance', AllergyIntolerance.get.allergyIntolerance);
	app.get('/:apikey/AllergyIntoleranceReaction', AllergyIntolerance.get.allergyIntoleranceReaction);
	
	app.post('/:apikey/AllergyIntolerance', AllergyIntolerance.post.allergyIntolerance);
	app.post('/:apikey/AllergyIntoleranceReaction', AllergyIntolerance.post.allergyIntoleranceReaction);
	
	app.put('/:apikey/AllergyIntolerance/:adverse_event_id', AllergyIntolerance.put.allergyIntolerance);
	app.put('/:apikey/AllergyIntoleranceReaction', AllergyIntolerance.put.allergyIntoleranceReaction);
}
module.exports = routesAllergyIntolerance;