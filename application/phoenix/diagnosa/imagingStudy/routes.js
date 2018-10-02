var routesImagingStudy = function(app, ImagingStudy){
	app.get('/:apikey/ImagingStudy', ImagingStudy.get.imagingStudy);
	app.get('/:apikey/ImagingStudySeries', ImagingStudy.get.imagingStudySeries);
	app.get('/:apikey/ImagingStudySeriesInstance', ImagingStudy.get.imagingStudySeriesInstance);
	
	app.post('/:apikey/ImagingStudy', ImagingStudy.post.imagingStudy);
	app.post('/:apikey/ImagingStudySeries', ImagingStudy.post.imagingStudySeries);
	app.post('/:apikey/ImagingStudySeriesInstance', ImagingStudy.post.imagingStudySeriesInstance);
	
	app.put('/:apikey/ImagingStudy/:imaging_study_id', ImagingStudy.put.imagingStudy);
	app.put('/:apikey/ImagingStudySeries/:series_id', ImagingStudy.put.imagingStudySeries);
	app.put('/:apikey/ImagingStudySeriesInstance/:instance_id', ImagingStudy.put.imagingStudySeriesInstance);
	
}
module.exports = routesImagingStudy;