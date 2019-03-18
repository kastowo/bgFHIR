var routesDeviceUseStatement = function(app, DeviceUseStatement){
	app.get('/:apikey/DeviceUseStatement', DeviceUseStatement.get.deviceUseStatement);
	
	app.post('/:apikey/DeviceUseStatement', DeviceUseStatement.post.deviceUseStatement);
	
	app.put('/:apikey/DeviceUseStatement/:device_use_statement_id', DeviceUseStatement.put.deviceUseStatement);
}
module.exports = routesDeviceUseStatement;