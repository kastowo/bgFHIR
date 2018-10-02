var routesImagingManifest = function(app, ImagingManifest){
	app.get('/:apikey/ImagingManifest', ImagingManifest.get.imagingManifest);
	app.get('/:apikey/ImagingManifestStudy', ImagingManifest.get.imagingManifestStudy);
	app.get('/:apikey/ImagingManifestSeries', ImagingManifest.get.imagingManifestSeries);
	app.get('/:apikey/ImagingManifestInstance', ImagingManifest.get.imagingManifestInstance);
	
	app.post('/:apikey/ImagingManifest', ImagingManifest.post.imagingManifest);
	app.post('/:apikey/ImagingManifestStudy', ImagingManifest.post.imagingManifestStudy);
	app.post('/:apikey/ImagingManifestSeries', ImagingManifest.post.imagingManifestSeries);
	app.post('/:apikey/ImagingManifestInstance', ImagingManifest.post.imagingManifestInstance);
	
	app.put('/:apikey/ImagingManifest/:imaging_manifest_id', ImagingManifest.put.imagingManifest);
	app.put('/:apikey/ImagingManifestStudy/:study_id', ImagingManifest.put.imagingManifestStudy);
	app.put('/:apikey/ImagingManifestSeries/:series_id', ImagingManifest.put.imagingManifestSeries);
	app.put('/:apikey/ImagingManifestInstance/:instance_id', ImagingManifest.put.imagingManifestInstance);
	
}
module.exports = routesImagingManifest;