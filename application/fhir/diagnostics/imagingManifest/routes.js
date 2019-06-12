var routesImagingManifest = function(app, ImagingManifest){
	app.get('/:apikey/ImagingManifest/:imaging_manifest_id?', ImagingManifest.get.imagingManifest);
	app.get('/:apikey/ImagingManifest/:imaging_manifest_id?/ImagingManifestStudy/:imaging_manifes_study_id?', ImagingManifest.get.imagingManifestStudy);
	app.get('/:apikey/ImagingManifestStudy/:imaging_manifes_study_id?/ImagingManifestSeries/:imaging_manifest_series_id?', ImagingManifest.get.imagingManifestSeries);
	app.get('/:apikey/ImagingManifestSeries/:imaging_manifest_series_id?/ImagingManifestInstance/:imaging_manifest_instance_id?', ImagingManifest.get.imagingManifestInstance);
	
	app.post('/:apikey/ImagingManifest', ImagingManifest.post.imagingManifest);
	app.post('/:apikey/ImagingManifest/:imaging_manifest_id?/ImagingManifestStudy', ImagingManifest.post.imagingManifestStudy);
	app.post('/:apikey/ImagingManifestStudy/:imaging_manifes_study_id?/ImagingManifestSeries', ImagingManifest.post.imagingManifestSeries);
	app.post('/:apikey/ImagingManifestSeries/:imaging_manifest_series_id?/ImagingManifestInstance', ImagingManifest.post.imagingManifestInstance);
	
	app.put('/:apikey/ImagingManifest/:imaging_manifest_id?', ImagingManifest.put.imagingManifest);
	app.put('/:apikey/ImagingManifest/:imaging_manifest_id?/identifier/:identifier_id?', ImagingManifest.put.identifier);
	app.put('/:apikey/ImagingManifest/:imaging_manifest_id?/ImagingManifestStudy/:imaging_manifest_study_id?', ImagingManifest.put.imagingManifestStudy);
	app.put('/:apikey/ImagingManifestStudy/:imaging_manifes_study_id?/ImagingManifestSeries/:imaging_manifest_series_id?', ImagingManifest.put.imagingManifestSeries);
	app.put('/:apikey/ImagingManifestSeries/:imaging_manifest_series_id?/ImagingManifestInstance/:imaging_manifest_instance_id?', ImagingManifest.put.imagingManifestInstance);
}
module.exports = routesImagingManifest;