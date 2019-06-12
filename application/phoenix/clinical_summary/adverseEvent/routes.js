var routesAdverseEvent = function(app, AdverseEvent){
	app.get('/:apikey/AdverseEvent', AdverseEvent.get.adverseEvent);
	app.get('/:apikey/AdverseEventSuspectEntity', AdverseEvent.get.suspectEntity);
	app.get('/:apikey/AdverseEventReaction', AdverseEvent.get.condition);
	app.get('/:apikey/AdverseEventSubjectMedicalHistoryCondition', AdverseEvent.get.conditionSubjectMedicalHistory);
	app.get('/:apikey/AdverseEventSubjectMedicalHistoryObservation', AdverseEvent.get.observationSubjectMedicalHistory);
	app.get('/:apikey/AdverseEventSubjectMedicalHistoryAllergyIntolerance', AdverseEvent.get.allergyIntoleranceSubjectMedicalHistory);
	app.get('/:apikey/AdverseEventSubjectMedicalHistoryFamilyMemberHistory', AdverseEvent.get.familyMemberHistorySubjectMedicalHistory);
	app.get('/:apikey/AdverseEventSubjectMedicalHistoryImmunization', AdverseEvent.get.immunizationSubjectMedicalHistory);
	app.get('/:apikey/AdverseEventSubjectMedicalHistoryProcedure', AdverseEvent.get.procedureSubjectMedicalHistory);
	app.get('/:apikey/AdverseEventReferenceDocument', AdverseEvent.get.referenceDocument);
	app.get('/:apikey/AdverseEventResearchStudy', AdverseEvent.get.researchStudy);
	
	app.post('/:apikey/AdverseEvent', AdverseEvent.post.adverseEvent);
	app.post('/:apikey/AdverseEventSuspectEntity', AdverseEvent.post.suspectEntity);
	
	app.put('/:apikey/AdverseEvent/:_id?', AdverseEvent.put.adverseEvent);
	app.put('/:apikey/AdverseEventSuspectEntity/:_id?/:dr?', AdverseEvent.put.suspectEntity);
	
}
module.exports = routesAdverseEvent;