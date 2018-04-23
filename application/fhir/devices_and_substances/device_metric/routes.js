var routesDeviceMetric = function(app, DeviceMetric){
	app.get('/:apikey/DeviceMetric', DeviceMetric.get.deviceMetric);
	app.get('/:apikey/DeviceMetric/:device_metric_id?/Calibration/:calibration_id?', DeviceMetric.get.deviceMetricCalibration);

	app.post('/:apikey/DeviceMetric', DeviceMetric.post.deviceMetric);
	app.post('/:apikey/DeviceMetric/:device_metric_id?/Calibration', DeviceMetric.post.deviceMetricCalibration);

	app.put('/:apikey/DeviceMetric/:device_metric_id?', DeviceMetric.put.deviceMetric);
	app.put('/:apikey/DeviceMetric/:device_metric_id?/Calibration/:calibration_id?', DeviceMetric.put.deviceMetricCalibration);
	
}
module.exports = routesDeviceMetric;