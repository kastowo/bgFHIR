var routesSpecimen = function(app, Specimen){
	app.get('/:apikey/Specimen/:specimen_id?', Specimen.get.specimen);
	app.get('/:apikey/Specimen/:specimen_id?/identifier/:identifier_id?', Specimen.get.identifier);
	app.get('/:apikey/Specimen/:specimen_id?/specimenProcessing/:specimen_processing_id?', Specimen.get.specimenProcessing);
	app.get('/:apikey/Specimen/:specimen_id?/specimenContainer/:specimen_container_id?', Specimen.get.specimenContainer);

	app.post('/:apikey/Specimen', Specimen.post.specimen);
	app.post('/:apikey/Specimen/:specimen_id?/identifier', Specimen.post.identifier);
	app.post('/:apikey/Specimen/:specimen_id?/specimenProcessing', Specimen.post.specimenProcessing);
	app.post('/:apikey/Specimen/:specimen_id?/specimenContainer', Specimen.post.specimenContainer);

	app.put('/:apikey/Specimen/:specimen_id?', Specimen.put.specimen);
	app.put('/:apikey/Specimen/:specimen_id?/identifier/:identifier_id?', Specimen.put.identifier);
	app.put('/:apikey/Specimen/:specimen_id?/specimenProcessing/:specimen_processing_id?', Specimen.put.specimenProcessing);
	app.put('/:apikey/Specimen/:specimen_id?/specimenContainer/:specimen_container_id?', Specimen.put.specimenContainer);
}
module.exports = routesSpecimen;