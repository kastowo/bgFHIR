var routesSpecimen = function(app, Specimen){
	app.get('/:apikey/Specimen', Specimen.get.specimen);
	app.get('/:apikey/SpecimenProcessing', Specimen.get.specimenProcessing);
	app.get('/:apikey/SpecimenContainer', Specimen.get.specimenContainer);
	
	app.get('/:apikey/SpecimenParent', Specimen.get.specimenParent);
	app.get('/:apikey/SpecimenRequest', Specimen.get.specimenRequest);
	app.get('/:apikey/SpecimenProcessingAdditive', Specimen.get.specimenProcessingAdditive);
	
	app.post('/:apikey/Specimen', Specimen.post.specimen);
	app.post('/:apikey/SpecimenProcessing', Specimen.post.specimenProcessing);
	app.post('/:apikey/SpecimenContainer', Specimen.post.specimenContainer);
	
	app.put('/:apikey/Specimen/:_id?', Specimen.put.specimen);
	app.put('/:apikey/SpecimenProcessing/:_id?/:dr?', Specimen.put.specimenProcessing);
	app.put('/:apikey/SpecimenContainer/:_id?/:dr?', Specimen.put.specimenContainer);
	
}
module.exports = routesSpecimen;