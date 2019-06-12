var routesObservation = function(app, Observation){
	app.get('/:apikey/Observation', Observation.get.observation);
	app.get('/:apikey/ObservationRelated', Observation.get.observationRelated);
	app.get('/:apikey/ObservationComponent', Observation.get.observationComponent);
	app.get('/:apikey/ObservationReferenceRange', Observation.get.observationReferenceRange);
	app.get('/:apikey/ObservationSampledData', Observation.get.observationSampledData);
	
	app.get('/:apikey/ObservationBasedOnCarePlan', Observation.get.observationBasedOnCarePlan);
	app.get('/:apikey/ObservationBasedOnDeviceRequest', Observation.get.observationBasedOnDeviceRequest);
	app.get('/:apikey/ObservationBasedOnImmunizationRecommendation', Observation.get.observationBasedOnImmunizationRecommendation);
	app.get('/:apikey/ObservationBasedOnMedicationRequest', Observation.get.observationBasedOnMedicationRequest);
	app.get('/:apikey/ObservationBasedOnNutritionOrder', Observation.get.observationBasedOnNutritionOrder);
	app.get('/:apikey/ObservationBasedOnProcedureRequest', Observation.get.observationBasedOnProcedureRequest);
	app.get('/:apikey/ObservationBasedOnReferralRequest', Observation.get.observationBasedOnReferralRequest);
	app.get('/:apikey/ObservationPerformerPractitioner', Observation.get.observationPerformerPractitioner);
	app.get('/:apikey/ObservationPerformerOrganization', Observation.get.observationPerformerOrganization);
	app.get('/:apikey/ObservationPerformerPatient', Observation.get.observationPerformerPatient);
	app.get('/:apikey/ObservationPerformerRelatedPerson', Observation.get.observationPerformerRelatedPerson);	
	
	app.post('/:apikey/Observation', Observation.post.observation);
	app.post('/:apikey/ObservationRelated', Observation.post.observationRelated);
	app.post('/:apikey/ObservationComponent', Observation.post.observationComponent);
	app.post('/:apikey/ObservationReferenceRange', Observation.post.observationReferenceRange);
	app.post('/:apikey/ObservationSampledData', Observation.post.observationSampledData);
	
	app.put('/:apikey/Observation/:_id?', Observation.put.observation);
	app.put('/:apikey/ObservationRelated/:_id?/:dr?', Observation.put.observationRelated);
	app.put('/:apikey/ObservationComponent/:_id?/:dr?', Observation.put.observationComponent);
	app.put('/:apikey/ObservationReferenceRange/:_id?/:dr?', Observation.put.observationReferenceRange);
	app.put('/:apikey/ObservationSampledData/:_id?/:dr?', Observation.put.observationSampledData);
	
}
module.exports = routesObservation;