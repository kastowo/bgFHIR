var routesObservation = function(app, Observation){
	app.get('/:apikey/Observation/:observation_id?', Observation.get.observation);
	app.get('/:apikey/Observation/:observation_id?/identifier/:identifier_id?', Observation.get.identifier);
	app.get('/:apikey/Observation/:observation_id?/ObservationRelated/:observation_related_id?', Observation.get.observationRelated);
	app.get('/:apikey/Observation/:observation_id?/observationComponent/:observation_component_id?', Observation.get.observationComponent);
	app.get('/:apikey/Observation/:observation_id?/observationReferenceRange/:observation_reference_range_id?', Observation.get.observationReferenceRange);
	
	app.post('/:apikey/Observation', Observation.post.observation);
	app.post('/:apikey/Observation/:observation_id?/identifier', Observation.post.identifier);
	app.post('/:apikey/Observation/:observation_id?/observationRelated', Observation.post.observationRelated);
	app.post('/:apikey/Observation/:observation_id?/observationComponent', Observation.post.observationComponent);
	app.post('/:apikey/Observation/:observation_id?/observationReferenceRange', Observation.post.identifier);
	app.post('/:apikey/observationReferenceRange/:component_id?/observationComponentReferenceRange', Observation.post.observationComponentReferenceRange);
	
	app.put('/:apikey/Observation/:observation_id?', Observation.put.observation);
	app.put('/:apikey/Observation/:observation_id?/identifier/:identifier_id?', Observation.put.identifier);
	app.put('/:apikey/Observation/:observation_id?/observationRelated/:observation_related_id?', Observation.put.observationRelated);
	app.put('/:apikey/Observation/:observation_id?/observationComponent/:observation_component_id?', Observation.put.observationComponent);
	app.put('/:apikey/Observation/:observation_id?/observationReferenceRange/:observation_reference_range_id?', Observation.put.observationReferenceRange);
	app.put('/:apikey/Observation/:observation_id?/observationSampledData/:observation_sampled_data_id?', Observation.put.observationSampledData);
	app.put('/:apikey/Observation/:observation_id?/attachment/:attachment_id?', Observation.put.attachment);
	app.put('/:apikey/observationComponent/:observation_component_id?/observationComponentReferenceRange/:observation_component_reference_range_id?', Observation.put.observationComponentReferenceRange);
	app.put('/:apikey/observationComponent/:observation_component_id?/observationComponentReferenceRange/:observation_component_sampled_data_id?', Observation.put.observationComponentSampledData);
	app.put('/:apikey/observationComponent/:observation_component_id?/attachment/:attachment_id?', Observation.put.attachmentComponent);
	
}
module.exports = routesObservation;