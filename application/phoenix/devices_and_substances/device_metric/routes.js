var routesDeviceMetric = function(app, DeviceMetric){
	app.get('/:apikey/device-metric', DeviceMetric.get.deviceMetric);
	app.get('/:apikey/device-metric-calibration', DeviceMetric.get.deviceMetricCalibration);

	app.post('/:apikey/device-metric', DeviceMetric.post.deviceMetric);
	app.post('/:apikey/device-metric-calibration', DeviceMetric.post.deviceMetricCalibration);

	app.put('/:apikey/device-metric/:device_metric_id', DeviceMetric.put.deviceMetric);
	app.put('/:apikey/device-metric-calibration/:id?/:dr?', DeviceMetric.put.deviceMetricCalibration);
}
module.exports = routesDeviceMetric;