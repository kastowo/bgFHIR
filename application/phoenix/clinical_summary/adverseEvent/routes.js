var routesAdverseEvent = function(app, AdverseEvent){
	app.get('/:apikey/AdverseEvent', AdverseEvent.get.adverseEvent);
	app.get('/:apikey/AdverseEventSuspectEntity', AdverseEvent.get.suspectEntity);
	app.get('/:apikey/AdverseEventReaction', AdverseEvent.get.condition);
	app.get('/:apikey/SubjectMedicalHistoryCondition', AdverseEvent.get.conditionSubjectMedicalHistory);
	app.get('/:apikey/SubjectMedicalHistoryObservation', AdverseEvent.get.observationSubjectMedicalHistory);
	app.get('/:apikey/SubjectMedicalHistoryAllergyIntolerance', AdverseEvent.get.allergyIntoleranceSubjectMedicalHistory);
	app.get('/:apikey/SubjectMedicalHistoryFamilyMemberHistory', AdverseEvent.get.familyMemberHistorySubjectMedicalHistory);
	app.get('/:apikey/SubjectMedicalHistoryImmunization', AdverseEvent.get.immunizationSubjectMedicalHistory);
	app.get('/:apikey/SubjectMedicalHistoryProcedure', AdverseEvent.get.procedureSubjectMedicalHistory);
	
	app.post('/:apikey/AdverseEvent', AdverseEvent.post.adverseEvent);
	app.post('/:apikey/AdverseEventSuspectEntity', AdverseEvent.post.suspectEntity);
	
	app.put('/:apikey/AdverseEvent/:adverse_event_id', AdverseEvent.put.adverseEvent);
	app.put('/:apikey/AdverseEventSuspectEntity/:suspect_entity_id', AdverseEvent.put.suspectEntity);
	
}
module.exports = routesAdverseEvent;