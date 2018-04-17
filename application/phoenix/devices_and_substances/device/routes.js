var routesDevice = function(app, Device){
	app.get('/:apikey/device', Device.get.device);
	app.get('/:apikey/device-udi', Device.get.deviceUdi);

	app.post('/:apikey/device', Device.post.device);
	app.post('/:apikey/device-udi', Device.post.deviceUdi);

	app.put('/:apikey/device/:device_id', Device.put.device);
	app.put('/:apikey/device-udi/:udi_id', Device.put.deviceUdi);
}
module.exports = routesDevice;