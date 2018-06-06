var routesDeviceComponent = function(app, DeviceComponent){
	app.get('/:apikey/device-component', DeviceComponent.get.deviceComponent);
	app.get('/:apikey/device-component-production-specification', DeviceComponent.get.deviceComponentProductionSpecification);

	app.post('/:apikey/device-component', DeviceComponent.post.deviceComponent);
	app.post('/:apikey/device-component-production-specification', DeviceComponent.post.deviceComponentProductionSpecification);

	app.put('/:apikey/device-component/:device_component_id', DeviceComponent.put.deviceComponent);
	app.put('/:apikey/device-component-production-specification/:id?/:dr?', DeviceComponent.put.deviceComponentProductionSpecification);
}
module.exports = routesDeviceComponent;