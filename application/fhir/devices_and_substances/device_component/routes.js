var routesDeviceComponent = function(app, DeviceComponent){
	app.get('/:apikey/DeviceComponent', DeviceComponent.get.deviceComponent);
	app.get('/:apikey/DeviceComponent/:device_component_id?/ProductionSpecification/:production_specification_id?', DeviceComponent.get.deviceComponentProductionSpecification);

	app.post('/:apikey/DeviceComponent', DeviceComponent.post.deviceComponent);
	app.post('/:apikey/DeviceComponent/:device_component_id?/ProductionSpecification', DeviceComponent.post.deviceComponentProductionSpecification);

	app.put('/:apikey/DeviceComponent/:device_component_id?', DeviceComponent.put.deviceComponent);
	app.put('/:apikey/DeviceComponent/:device_component_id?/ProductionSpecification/:production_specification_id?', DeviceComponent.put.deviceComponentProductionSpecification);
	// app.put('/:apikey/Device/:device_id?/Contact/:contact_id?', Device.put.deviceContact);
}
module.exports = routesDeviceComponent;