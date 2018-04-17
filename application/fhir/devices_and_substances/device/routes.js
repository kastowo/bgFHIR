var routesDevice = function(app, Device){
	app.get('/:apikey/Device', Device.get.device);

	app.post('/:apikey/Device', Device.post.device);
	app.post('/:apikey/Device/:device_id?/Contact', Device.post.deviceContact);

	app.put('/:apikey/Device/:device_id?', Device.put.device);
	app.put('/:apikey/Device/:device_id?/Udi/:udi_id?', Device.put.deviceUdi);
	app.put('/:apikey/Device/:device_id?/Contact/:contact_id?', Device.put.deviceContact);
}
module.exports = routesDevice;