var routesImagingStudy = function(app, ImagingStudy){
	
	//get method
	app.get('/:apikey/ImagingStudy', ImagingStudy.get.imagingStudy);
	app.get('/:apikey/ImagingStudy/:imaging_study_id?/imagingStudySeries/:series_id?', ImagingStudy.get.imagingStudySeries);

	//post method
	app.post('/:apikey/ImagingStudy', ImagingStudy.post.imagingStudy);
	app.post('/:apikey/ImagingStudy/:imaging_study_id?/identifier', ImagingStudy.post.identifier);
	app.post('/:apikey/ImagingStudy/:imaging_study_id?/imagingStudySeries', ImagingStudy.post.imagingStudySeries);
	app.post('/:apikey/ImagingStudySeries/:series_id?/imagingStudySeriesInstance', ImagingStudy.post.imagingStudySeriesInstance);

	//put method
	app.put('/:apikey/ImagingStudy/:imaging_study_id?', ImagingStudy.put.imagingStudy);
	app.put('/:apikey/ImagingStudy/:imaging_study_id?/identifier/:identifier_id?', ImagingStudy.put.identifier);
	app.put('/:apikey/ImagingStudy/:imaging_study_id?/imagingStudySeries/:series_id?', ImagingStudy.put.imagingStudySeries);
	//app.put('/:apikey/ImagingStudySeries/:series_id?/imagingStudySeriesInstance/:instance_id?', ImagingStudy.put.seriesInstance);
}
module.exports = routesImagingStudy;