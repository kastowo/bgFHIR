var routesSequence = function(app, Sequence){
	app.get('/:apikey/Sequence', Sequence.get.sequence);
	app.get('/:apikey/sequenceRepository', Sequence.get.sequenceRepository);
	app.get('/:apikey/sequenceVariant', Sequence.get.sequenceVariant);
	app.get('/:apikey/sequenceQuality', Sequence.get.sequenceQuality);
	
	app.post('/:apikey/Sequence', Sequence.post.sequence);
	app.post('/:apikey/sequenceRepository', Sequence.post.sequenceRepository);
	app.post('/:apikey/sequenceVariant', Sequence.post.sequenceVariant);
	app.post('/:apikey/sequenceQuality', Sequence.post.sequenceQuality);
	
	app.put('/:apikey/Sequence/:sequence_id', Sequence.put.sequence);
	app.put('/:apikey/sequenceRepository/:repository_id', Sequence.put.sequenceRepository);
	app.put('/:apikey/sequenceVariant/:variant_id', Sequence.put.sequenceVariant);
	app.put('/:apikey/sequenceQuality/:quality_id', Sequence.put.sequenceQuality);
}
module.exports = routesSequence;