var routesSequence = function(app, Sequence){
	app.get('/:apikey/Sequence', Sequence.get.sequence);
	app.get('/:apikey/SequenceRepository', Sequence.get.sequenceRepository);
	app.get('/:apikey/SequenceVariant', Sequence.get.sequenceVariant);
	app.get('/:apikey/SequenceQuality', Sequence.get.sequenceQuality);
	app.get('/:apikey/SequencePointer', Sequence.get.sequencePointer);
	
	app.post('/:apikey/Sequence', Sequence.post.sequence);
	app.post('/:apikey/SequenceRepository', Sequence.post.sequenceRepository);
	app.post('/:apikey/SequenceVariant', Sequence.post.sequenceVariant);
	app.post('/:apikey/SequenceQuality', Sequence.post.sequenceQuality);
	
	app.put('/:apikey/Sequence/:_id?', Sequence.put.sequence);
	app.put('/:apikey/SequenceRepository/:_id?/:dr?', Sequence.put.sequenceRepository);
	app.put('/:apikey/SequenceVariant/:_id?/:dr?', Sequence.put.sequenceVariant);
	app.put('/:apikey/SequenceQuality/:_id?/:dr?', Sequence.put.sequenceQuality);
}
module.exports = routesSequence;