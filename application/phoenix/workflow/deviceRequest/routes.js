var routesDeviceRequest = function(app, DeviceRequest){
	app.get('/:apikey/DeviceRequest', DeviceRequest.get.deviceRequest);
	
	app.post('/:apikey/DeviceRequest', DeviceRequest.post.deviceRequest);
	
	app.put('/:apikey/DeviceRequest/:device_request_id', DeviceRequest.put.deviceRequest);
}
module.exports = routesDeviceRequest;