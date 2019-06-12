var routesImagingManifest = function(app, ImagingManifest){
	app.get('/:apikey/ImagingManifest', ImagingManifest.get.imagingManifest);
	app.get('/:apikey/ImagingManifestStudy', ImagingManifest.get.imagingManifestStudy);
	app.get('/:apikey/ImagingManifestSeries', ImagingManifest.get.imagingManifestSeries);
	app.get('/:apikey/ImagingManifestInstance', ImagingManifest.get.imagingManifestInstance);
	app.get('/:apikey/ImagingManifestStudyEndpoint', ImagingManifest.get.imagingManifestStudyEndpoint);
	app.get('/:apikey/ImagingManifestSeriesEndpoint', ImagingManifest.get.imagingManifestSeriesEndpoint);
	
	app.post('/:apikey/ImagingManifest', ImagingManifest.post.imagingManifest);
	app.post('/:apikey/ImagingManifestStudy', ImagingManifest.post.imagingManifestStudy);
	app.post('/:apikey/ImagingManifestSeries', ImagingManifest.post.imagingManifestSeries);
	app.post('/:apikey/ImagingManifestInstance', ImagingManifest.post.imagingManifestInstance);
	
	app.put('/:apikey/ImagingManifest/:_id?', ImagingManifest.put.imagingManifest);
	app.put('/:apikey/ImagingManifestStudy/:_id?/:dr?', ImagingManifest.put.imagingManifestStudy);
	app.put('/:apikey/ImagingManifestSeries/:_id?/:dr?', ImagingManifest.put.imagingManifestSeries);
	app.put('/:apikey/ImagingManifestInstance/:_id?/:dr?', ImagingManifest.put.imagingManifestInstance);
	
}
module.exports = routesImagingManifest;