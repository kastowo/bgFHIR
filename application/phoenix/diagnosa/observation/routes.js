var routesObservation = function(app, Observation){
	app.get('/:apikey/Observation', Observation.get.observation);
	app.get('/:apikey/ObservationRelated', Observation.get.observationRelated);
	app.get('/:apikey/ObservationComponent', Observation.get.observationComponent);
	app.get('/:apikey/ObservationReferenceRange', Observation.get.observationReferenceRange);
	app.get('/:apikey/ObservationSampledData', Observation.get.observationSampledData);
	
	app.post('/:apikey/Observation', Observation.post.observation);
	app.post('/:apikey/ObservationRelated', Observation.post.observationRelated);
	app.post('/:apikey/ObservationComponent', Observation.post.observationComponent);
	app.post('/:apikey/ObservationReferenceRange', Observation.post.observationReferenceRange);
	app.post('/:apikey/ObservationSampledData', Observation.post.observationSampledData);
	
	app.put('/:apikey/Observation/:observation_id', Observation.put.observation);
	app.put('/:apikey/ObservationRelated/:related_id', Observation.put.observationRelated);
	app.put('/:apikey/ObservationComponent/:component_id', Observation.put.observationComponent);
	app.put('/:apikey/ObservationReferenceRange/:reference_range_id', Observation.put.observationReferenceRange);
	app.put('/:apikey/ObservationSampledData/:sampled_data_id', Observation.put.observationSampledData);
	
}
module.exports = routesObservation;