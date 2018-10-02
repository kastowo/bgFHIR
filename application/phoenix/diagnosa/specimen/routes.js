var routesSpecimen = function(app, Specimen){
	app.get('/:apikey/Specimen', Specimen.get.specimen);
	app.get('/:apikey/SpecimenProcessing', Specimen.get.specimenProcessing);
	app.get('/:apikey/SpecimenContainer', Specimen.get.specimenContainer);
	
	app.post('/:apikey/Specimen', Specimen.post.specimen);
	app.post('/:apikey/SpecimenProcessing', Specimen.post.specimenProcessing);
	app.post('/:apikey/SpecimenContainer', Specimen.post.specimenContainer);
	
	app.put('/:apikey/Specimen/:specimen_id', Specimen.put.specimen);
	app.put('/:apikey/SpecimenProcessing/:processing_id', Specimen.put.specimenProcessing);
	app.put('/:apikey/SpecimenContainer/:container_id', Specimen.put.specimenContainer);
	
}
module.exports = routesSpecimen;