var routesAllergyIntolerance = function(app, AllergyIntolerance){
	app.get('/:apikey/AllergyIntolerance/:allergy_intolerance_id?', AllergyIntolerance.get.allergyIntolerance);
	app.get('/:apikey/AllergyIntolerance/:allergy_intolerance_id?/identifier/:identifier_id?', AllergyIntolerance.get.identifier);
	app.get('/:apikey/AllergyIntolerance/:allergy_intolerance_id?/AllergyIntoleranceReaction/:allergy_intolerance_reaction_id?', AllergyIntolerance.get.allergyIntoleranceReaction);
	
	
	app.post('/:apikey/AllergyIntolerance', AllergyIntolerance.post.allergyIntolerance);
	app.post('/:apikey/AllergyIntolerance/:allergy_intolerance_id?/identifier', AllergyIntolerance.post.identifier);
	app.post('/:apikey/AllergyIntolerance/:allergy_intolerance_id?/AllergyIntoleranceNote', AllergyIntolerance.post.allergyIntoleranceNote);
	app.post('/:apikey/AllergyIntolerance/:allergy_intolerance_id?/AllergyIntoleranceReaction', AllergyIntolerance.post.allergyIntoleranceReaction);
	app.post('/:apikey/AllergyIntoleranceReaction/:allergy_intolerance_reaction_id?/AllergyIntoleranceReactionNote', AllergyIntolerance.post.allergyIntoleranceReactionNote);
	
	
	app.put('/:apikey/AllergyIntolerance/:allergy_intolerance_id?', AllergyIntolerance.put.allergyIntolerance);
	app.put('/:apikey/AllergyIntolerance/:allergy_intolerance_id?/identifier/:identifier_id?', AllergyIntolerance.put.identifier);
	app.put('/:apikey/AllergyIntolerance/:allergy_intolerance_id?/AllergyIntoleranceReaction/:allergy_intolerance_reaction_id?', AllergyIntolerance.put.allergyIntoleranceReaction);
}
module.exports = routesAllergyIntolerance;