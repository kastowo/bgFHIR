var routesSequence = function(app, Sequence){
	app.get('/:apikey/Sequence/:sequence_id?', Sequence.get.sequence);
	app.get('/:apikey/Sequence/:sequence_id?/identifier/:identifier_id?', Sequence.get.identifier);
	app.get('/:apikey/Sequence/:sequence_id?/sequenceRepository/:sequence_repository_id?', Sequence.get.sequenceRepository);
	app.get('/:apikey/Sequence/:sequence_id?/sequenceVariant/:sequence_variant_id?', Sequence.get.sequenceVariant);
	app.get('/:apikey/Sequence/:sequence_id?/sequenceQuality/:sequence_quality_id?', Sequence.get.sequenceQuality);
	
	app.post('/:apikey/Sequence', Sequence.post.sequence);
	app.post('/:apikey/Sequence/:sequence_id?/identifier', Sequence.post.identifier);
	app.post('/:apikey/Sequence/:sequence_id?/sequenceRepository', Sequence.post.sequenceRepository);
	app.post('/:apikey/Sequence/:sequence_id?/sequenceVariant', Sequence.post.sequenceVariant);
	app.post('/:apikey/Sequence/:sequence_id?/sequenceQuality', Sequence.post.sequenceQuality);
	
	app.put('/:apikey/Sequence/:sequence_id?', Sequence.put.sequence);
	app.put('/:apikey/Sequence/:sequence_id?/identifier/:identifier_id?', Sequence.put.identifier);
	app.put('/:apikey/Sequence/:sequence_id?/sequenceRepository/:sequence_repository_id?', Sequence.put.sequenceRepository);
	app.put('/:apikey/Sequence/:sequence_id?/sequenceVariant/:sequence_variant_id?', Sequence.put.sequenceVariant);
	app.put('/:apikey/Sequence/:sequence_id?/sequenceQuality/:sequence_quality_id?', Sequence.put.sequenceQuality);
}
module.exports = routesSequence;