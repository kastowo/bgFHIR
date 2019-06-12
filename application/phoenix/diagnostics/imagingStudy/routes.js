var routesImagingStudy = function(app, ImagingStudy){
	app.get('/:apikey/ImagingStudy', ImagingStudy.get.imagingStudy);
	app.get('/:apikey/ImagingStudySeries', ImagingStudy.get.imagingStudySeries);
	app.get('/:apikey/ImagingStudySeriesInstance', ImagingStudy.get.imagingStudySeriesInstance);
	app.get('/:apikey/ImagingStudyBasedOnReferralRequest', ImagingStudy.get.imagingStudyBasedOnReferralRequest);
	app.get('/:apikey/ImagingStudyBasedOnCarePlan', ImagingStudy.get.imagingStudyBasedOnCarePlan);
	app.get('/:apikey/ImagingStudyBasedOnProcedureRequest', ImagingStudy.get.imagingStudyBasedOnProcedureRequest);
	app.get('/:apikey/ImagingStudyInterpreter', ImagingStudy.get.imagingStudyInterpreter);
	app.get('/:apikey/ImagingStudyEndpoint', ImagingStudy.get.imagingStudyEndpoint);
	app.get('/:apikey/ImagingStudyProcedureReference', ImagingStudy.get.imagingStudyProcedureReference);
	app.get('/:apikey/ImagingStudySeriesEndpoint', ImagingStudy.get.imagingStudySeriesEndpoint);
	app.get('/:apikey/ImagingStudySeriesPerformer', ImagingStudy.get.imagingStudySeriesPerformer);
	
	app.post('/:apikey/ImagingStudy', ImagingStudy.post.imagingStudy);
	app.post('/:apikey/ImagingStudySeries', ImagingStudy.post.imagingStudySeries);
	app.post('/:apikey/ImagingStudySeriesInstance', ImagingStudy.post.imagingStudySeriesInstance);
	
	app.put('/:apikey/ImagingStudy/:_id?', ImagingStudy.put.imagingStudy);
	app.put('/:apikey/ImagingStudySeries/:_id?/:dr?', ImagingStudy.put.imagingStudySeries);
	app.put('/:apikey/ImagingStudySeriesInstance/:_id?/:dr?', ImagingStudy.put.imagingStudySeriesInstance);
	
}
module.exports = routesImagingStudy;