var Apiclient = require('apiclient');
var sha1 = require('sha1');
var validator = require('validator');
var bytes = require('bytes');
var uniqid = require('uniqid');
var yamlconfig = require('yaml-config');
var path = require('path');

var configYaml = yamlconfig.readConfig(path.resolve('../../application/config/config.yml'));

var host = configYaml.fhir.host;
var port = configYaml.fhir.port;

//event emitter
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

//phoenix
//query data melalui rest phoenix
var seedPhoenix = require(path.resolve('../../application/config/seed_phoenix.json'));
	seedPhoenix.base.hostname = configYaml.phoenix.host;
	seedPhoenix.base.port 		= configYaml.phoenix.port;
	
var Api = new Apiclient(seedPhoenix);

seedPhoenixFHIR = require(path.resolve('../../application/config/seed_phoenix_fhir.json'));
seedPhoenixFHIR.base.hostname = configYaml.phoenix.host;
seedPhoenixFHIR.base.port 	  = configYaml.phoenix.port;

var ApiFHIR  = new Apiclient(seedPhoenixFHIR);


var controller = {
			get: {
				deviceComponent: function getDeviceComponent(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					//params from query string
					var deviceComponentId = req.query._id;
					var deviceComponentParentId = req.query.parent;
					var deviceId = req.query.source;
					var deviceComponentType = req.query.type;
					
					
					var qString = {};
					if(typeof deviceComponentId !== 'undefined'){
						if(!validator.isEmpty(deviceComponentId)){
							qString._id = deviceComponentId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Device Component ID is required."})
						}
					}

					if(typeof deviceComponentParentId !== 'undefined'){
						if(!validator.isEmpty(deviceComponentParentId)){
							qString.parent = deviceComponentParentId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Parent is empty."});
						}
					}

					if(typeof deviceId !== 'undefined'){
						if(!validator.isEmpty(deviceId)){
							qString.device_id = deviceId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Source is empty."});
						}
					}

					seedPhoenixFHIR.path.GET = {
						"DeviceComponent" : {
							"location": "%(apikey)s/device-component",
							"query": qString
						}
					}
					var ApiFHIR = new Apiclient(seedPhoenixFHIR);
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							ApiFHIR.get('DeviceComponent', {"apikey": apikey}, {}, function (error, response, body) {
							  if(error){
							  	res.json(error);
							  }else{
							  	var deviceComponent = JSON.parse(body); //object
							  	//cek apakah ada error atau tidak
							  	if(deviceComponent.err_code == 0){
								  	//cek jumdata dulu
								  	if(deviceComponent.data.length > 0){
								  		newDeviceComponent = [];
								  		for(i=0; i < deviceComponent.data.length; i++){
								  			myEmitter.prependOnceListener("getProductionSpecification", function(deviceComponent, index, newDeviceComponent, countDeviceComponent){
								  				qString = {};
									  			qString.device_component_id = deviceComponent.id;
										  		seedPhoenixFHIR.path.GET = {
														"DeviceComponentProductionSpecification" : {
															"location": "%(apikey)s/device-component-production-specification",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

													ApiFHIR.get("DeviceComponentProductionSpecification", {"apikey": apikey}, {}, function(error, response, body){
														deviceComponentProductionSpecification = JSON.parse(body);
														if(deviceComponentProductionSpecification.err_code == 0){
															var objectDeviceComponent = {};
															objectDeviceComponent.resourceType = deviceComponent.resourceType;
															objectDeviceComponent.id = deviceComponent.id;
															objectDeviceComponent.type = deviceComponent.type;
															objectDeviceComponent.lastSystemChange = deviceComponent.lastSystemChange;
															objectDeviceComponent.source = deviceComponent.source;
															objectDeviceComponent.parent = deviceComponent.parent;
															objectDeviceComponent.operationalStatus = deviceComponent.operationalStatus;
															objectDeviceComponent.parameterGroup = deviceComponent.parameterGroup;
															objectDeviceComponent.measurementPrinciple = deviceComponent.measurementPrinciple;
															objectDeviceComponent.productionSpecification = deviceComponentProductionSpecification.data;
															objectDeviceComponent.languageCode = deviceComponent.languageCode;

															newDeviceComponent[index] = objectDeviceComponent;

															if(index == countDeviceComponent -1 ){
																res.json({"err_code": 0, "data":newDeviceComponent});				
															}	
														}else{
															res.json(deviceComponentProductionSpecification);
														}
													})
								  			})
								  			myEmitter.emit("getProductionSpecification", deviceComponent.data[i], i, newDeviceComponent, deviceComponent.data.length);
								  		}
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Device Component is empty."});	
								  	}
							  	}else{
							  		res.json(deviceComponent);
							  	}
							  }
							});
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				},
				deviceComponentProductionSpecification: function getDeviceComponentProductionSpecification(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					//params from query string
					var deviceComponentId = req.params.device_component_id;
					var productionSpecificationId = req.params.production_specification_id;
					
					
					var qString = {};
					if(typeof deviceComponentId !== 'undefined'){
						if(!validator.isEmpty(deviceComponentId)){
							qString.device_component_id = deviceComponentId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Device Component ID is required."})
						}
					}

					if(typeof productionSpecificationId !== 'undefined'){
						if(!validator.isEmpty(productionSpecificationId)){
							qString._id = productionSpecificationId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Production Specification ID is required."})
						}
					}

					seedPhoenixFHIR.path.GET = {
						"DeviceComponentProductionSpecification" : {
							"location": "%(apikey)s/device-component-production-specification",
							"query": qString
						}
					}
					var ApiFHIR = new Apiclient(seedPhoenixFHIR);
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							ApiFHIR.get("DeviceComponentProductionSpecification", {"apikey": apikey}, {}, function(error, response, body){
								deviceComponentProductionSpecification = JSON.parse(body);
								if(deviceComponentProductionSpecification.err_code == 0){	
									res.json({"err_code": 0, "data":deviceComponentProductionSpecification.data});
								}else{
									res.json(deviceComponentProductionSpecification);
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				}
			},
			post: {
				deviceComponent: function addDevice(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					var err_code = 0;
					var err_msg = "";

					//input check
					if(typeof req.body.type !== 'undefined'){
						var deviceComponentType = req.body.type;
						if(validator.isEmpty(req.body.type)){
							err_code = 2;
							err_msg = "Type is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'type' in json request."
					}

					if(typeof req.body.device_id !== 'undefined'){
						var deviceId = req.body.device_id;
						if(validator.isEmpty(req.body.device_id)){
							err_code = 2;
							err_msg = "Device ID is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'device_id' in json request."
					}

					if(typeof req.body.parent_id !== 'undefined'){
						var parentId = req.body.parent_id;
						if(validator.isEmpty(req.body.parent_id)){
							parentId = "";
						}
					}else{
						parentId = "";
					}

					if(typeof req.body.operational_status !== 'undefined'){
						var deviceComponentOperationalStatus = req.body.operational_status;
						if(validator.isEmpty(req.body.operational_status)){
							err_code = 2;
							err_msg = "Operational status is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'operational_status' in json request."
					}

					if(typeof req.body.parameter_group !== 'undefined'){
						var deviceComponentParameterGroup = req.body.parameter_group;
						if(validator.isEmpty(req.body.parameter_group)){
							err_code = 2;
							err_msg = "Parameter group is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'parameter_group' in json request."
					}

					if(typeof req.body.measurement_principle !== 'undefined'){
						var deviceComponentMeasurementPrinciple = req.body.measurement_principle;
						if(validator.isEmpty(req.body.measurement_principle)){
							err_code = 2;
							err_msg = "Measurement principle is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'measurement_principle' in json request."
					}


					if(typeof req.body.production_specification !== 'undefined'){
						var productionSpecification = req.body.production_specification;
						if(typeof productionSpecification.spec_type !== 'undefined'){
							var specType = productionSpecification.spec_type;
							if(validator.isEmpty(productionSpecification.spec_type)){
								err_code = 2;
								err_msg = "Spec type is required."
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'spec_type' in production_specification json request."
						}

						if(typeof productionSpecification.production_spec !== 'undefined'){
							var productionSpec = productionSpecification.production_spec;
							if(validator.isEmpty(productionSpecification.production_spec)){
								err_code = 2;
								err_msg = "Production spec is required."
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'production_spec' in production_specification json request."
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'production_specification' in json request."
					}

					if(typeof req.body.language_code !== 'undefined'){
						var languageCode = req.body.language_code;
						if(validator.isEmpty(req.body.language_code)){
							err_code = 2;
							err_msg = "Language code is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'language_code' in json request."
					}
					
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								checkCode(apikey, deviceComponentType, 'DEVICE_KIND', function(resDeviceKindCode){
									if(resDeviceKindCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, deviceComponentOperationalStatus, 'OPERATIONAL_STATUS', function(resOperationalStatusCode){
											if(resOperationalStatusCode.err_code > 0){
												checkUniqeValue(apikey, "DEVICE_ID|" + deviceId, 'DEVICE', function(resDeviceID){
													if(resDeviceID.err_code > 0){
														checkCode(apikey, deviceComponentParameterGroup, 'PARAMETER_GROUP', function(resParameterGroupCode){
															if(resParameterGroupCode.err_code > 0){
																checkCode(apikey, deviceComponentMeasurementPrinciple, 'MEASUREMENT_PRINCIPLE', function(resMeasurementPrincipleCode){
																	if(resMeasurementPrincipleCode.err_code > 0){
																		checkCode(apikey, specType, 'SPECIFICATION_TYPE', function(resSpecificationTypeCode){
																			if(resSpecificationTypeCode.err_code > 0){
																				checkCode(apikey, languageCode, 'LANGUAGES', function(resLanguageCode){
																					if(resLanguageCode.err_code > 0){
																						myEmitter.prependOnceListener('addDeviceComponent', function(){
																							//add DeviceComponent
																							var deviceComponentId = 'dc' + uniqid.time();
																							var productionSpecificationId = 'ps' + uniqid.time();
																							var componentId = 'com' + uniqid.time();

																							var dataDeviceComponent = {
																																"id": deviceComponentId,
																																"type": deviceComponentType,
																																"last_system_change": getFormattedDate(),
																																"operational_status": deviceComponentOperationalStatus,
																																"parameter_group": deviceComponentParameterGroup, 
																																"measurement_principle": deviceComponentMeasurementPrinciple, 
																																"language_code" : languageCode,
																																"device_id" : deviceId,
																																"parent_id" : parentId
																															}
																							
																							//method, endpoint, params, options, callback
																							ApiFHIR.post('deviceComponent', {"apikey": apikey}, {body: dataDeviceComponent, json:true}, function(error, response, body){	
																						  	var deviceComponent = body; //object
																						  	//cek apakah ada error atau tidak
																						  	if(deviceComponent.err_code > 0){
																						  		res.json(deviceComponent);	
																						  	}
																							})

																							var dataProductionSpecification = {
																																		"id": productionSpecificationId,
																																		"spec_type": specType,
																																		"component_id": componentId,
																																		"production_spec": productionSpec,
																																		"device_component_id": deviceComponentId
																																	}

																							ApiFHIR.post('deviceComponentProductionSpecification', {"apikey": apikey}, {body: dataProductionSpecification, json:true}, function(error, response, body){	
																						  	var deviceComponentProductionSpecification = body; //object
																						  	//cek apakah ada error atau tidak
																						  	if(deviceComponentProductionSpecification.err_code > 0){
																						  		res.json(deviceComponentProductionSpecification);	
																						  	}
																							})				

																							res.json({"err_code": 0, "err_msg": "Device Component has been add.", "data": [{"_id": deviceComponentId}]});
																						})

																						if(validator.isEmpty(parentId)){
																							myEmitter.emit('addDeviceComponent');
																						}else{
																							checkUniqeValue(apikey, "DEVICE_COMPONENT_ID|" + parentId, 'DEVICE_COMPONENT', function(resDeviceComponentID){
																								if(resDeviceComponentID.err_code > 0){
																									myEmitter.emit('addDeviceComponent');
																								}else{
																									res.json({"err_code": 504, "err_msg": "Parent Id not found"});				
																								}
																							})
																						}
																					}else{
																						res.json({"err_code": 508, "err_msg": "Language code not found"});								
																					}
																				})
																			}else{
																				res.json({"err_code": 507, "err_msg": "Specification type code not found"});								
																			}
																		})
																	}else{
																		res.json({"err_code": 506, "err_msg": "Measurement principle code not found"});						
																	}
																})		
															}else{
																res.json({"err_code": 505, "err_msg": "Parameter group code not found"});						
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Device Id not found"});		
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Operational status code not found"});		
											}
										})
									}else{
										res.json({"err_code": 501, "err_msg": "Type code not found"});		
									}
								})
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": err_code, "err_msg": err_msg});
					}	
				},
				deviceComponentProductionSpecification: function addDeviceComponentProductionSpecification(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var deviceComponentId = req.params.device_component_id;

					var err_code = 0;
					var err_msg = "";

					

					//input check 
					if(typeof deviceComponentId !== 'undefined'){
						if(validator.isEmpty(deviceComponentId)){
							err_code = 2;
							err_msg = "Device component id is required";
						}
					}else{
						err_code = 1;
						err_msg = "Device component id is required";
					}

					if(typeof req.body.spec_type !== 'undefined'){
						var specType = req.body.spec_type;
						if(validator.isEmpty(req.body.spec_type)){
							err_code = 2;
							err_msg = "Spec type is required."
						}
					}else{
						err_code = 2;
						err_msg = "Please add key 'spec_type' in json request."
					}

					if(typeof req.body.production_spec !== 'undefined'){
						var productionSpec = req.body.production_spec;
						if(validator.isEmpty(req.body.production_spec)){
							err_code = 2;
							err_msg = "Production spec is required."
						}
					}else{
						err_code = 2;
						err_msg = "Please add key 'production_spec' in json request."
					}
				
				
					
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								checkCode(apikey, specType, 'SPECIFICATION_TYPE', function(resSpecificationTypeCode){
									if(resSpecificationTypeCode.err_code > 0){		
										//add DeviceComponentProductionSpecification
										var productionSpecificationId = 'ps' + uniqid.time();
										var componentId = 'com' + uniqid.time();

										var dataProductionSpecification = {
																					"id": productionSpecificationId,
																					"spec_type": specType,
																					"component_id": componentId,
																					"production_spec": productionSpec,
																					"device_component_id": deviceComponentId
																				}

										ApiFHIR.post('deviceComponentProductionSpecification', {"apikey": apikey}, {body: dataProductionSpecification, json:true}, function(error, response, body){	
									  	var deviceComponentProductionSpecification = body; //object
									  	//cek apakah ada error atau tidak
									  	if(deviceComponentProductionSpecification.err_code == 0){
									  		res.json({"err_code": 0, "err_msg": "Production Specification has been add.", "data": [{"_id": productionSpecificationId}]});
									  	}else{
									  		res.json(deviceComponentProductionSpecification);	
									  	}
										})
									}else{
										res.json({"err_code": 507, "err_msg": "Specification type code not found"});								
									}
								})
								
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": err_code, "err_msg": err_msg});
					}	
				}
			},
			put: {
				deviceComponent: function updateDeviceComponent(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var deviceComponentId = req.params.device_component_id;

					var err_code = 0;
					var err_msg = "";

					var dataDeviceComponent = {};

					if(typeof deviceComponentId !== 'undefined'){
						if(validator.isEmpty(deviceComponentId)){
							err_code = 2;
							err_msg = "Device component id is required."
						}
					}else{
						err_code = 1;
						err_msg = "Device component id is required."
					}

					if(typeof req.body.type !== 'undefined'){
						var deviceComponentType = req.body.type;
						if(validator.isEmpty(req.body.type)){
							err_code = 2;
							err_msg = "Type is required."
						}else{
							dataDeviceComponent.type = deviceComponentType;
						}
					}else{
						deviceComponentType = "";
					}

					if(typeof req.body.device_id !== 'undefined'){
						var deviceId = req.body.device_id;
						if(validator.isEmpty(req.body.device_id)){
							err_code = 2;
							err_msg = "Device ID is required."
						}else{
							dataDeviceComponent.device_id = deviceId;
						}
					}else{
						deviceId = "";
					}

					if(typeof req.body.parent_id !== 'undefined'){
						var parentId = req.body.parent_id;
						if(validator.isEmpty(req.body.parent_id)){
							parentId = "";
						}else{
							dataDeviceComponent.parent_id = parentId;
						}
					}else{
						parentId = "";
					}

					if(typeof req.body.operational_status !== 'undefined'){
						var deviceComponentOperationalStatus = req.body.operational_status;
						if(validator.isEmpty(req.body.operational_status)){
							err_code = 2;
							err_msg = "Operational status is required."
						}else{
							dataDeviceComponent.operational_status = deviceComponentOperationalStatus;
						}
					}else{
						deviceComponentOperationalStatus = "";
					}

					if(typeof req.body.parameter_group !== 'undefined'){
						var deviceComponentParameterGroup = req.body.parameter_group;
						if(validator.isEmpty(req.body.parameter_group)){
							err_code = 2;
							err_msg = "Parameter group is required."
						}else{
							dataDeviceComponent.parameter_group = deviceComponentParameterGroup;
						}
					}else{
						deviceComponentParameterGroup = "";
					}

					if(typeof req.body.measurement_principle !== 'undefined'){
						var deviceComponentMeasurementPrinciple = req.body.measurement_principle;
						if(validator.isEmpty(req.body.measurement_principle)){
							err_code = 2;
							err_msg = "Measurement principle is required."
						}else{
							dataDeviceComponent.measurement_principle = deviceComponentMeasurementPrinciple;
						}
					}else{
						deviceComponentMeasurementPrinciple = "";
					}

					if(typeof req.body.language_code !== 'undefined'){
						var languageCode = req.body.language_code;
						if(validator.isEmpty(req.body.language_code)){
							err_code = 2;
							err_msg = "Language code is required."
						}else{
							dataDeviceComponent.language_code = languageCode;
						}
					}else{
						languageCode = "";
					}
					
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	

								myEmitter.prependOnceListener('updateDeviceComponent', function(){

									//set last change
									dataDeviceComponent.last_system_change = getFormattedDate();
									//method, endpoint, params, options, callback
									ApiFHIR.put('deviceComponent', {"apikey": apikey, "_id": deviceComponentId}, {body: dataDeviceComponent, json:true}, function(error, response, body){	
								  	var deviceComponent = body; //object
								  	//cek apakah ada error atau tidak
								  	if(deviceComponent.err_code == 0){
								  		res.json({"err_code": 0, "err_msg": "Device Component has been update.", "data": [{"_id": deviceComponentId}]});
								  	}else{
								  		res.json(deviceComponent);	
								  	}
									})
								})

								myEmitter.prependOnceListener('checkDeviceComponentID', function(){
									if(!validator.isEmpty(deviceComponentId)){
										checkUniqeValue(apikey, "DEVICE_COMPONENT_ID|" + deviceComponentId, 'DEVICE_COMPONENT', function(resDeviceComponentID){
											if(resDeviceComponentID.err_code > 0){
												myEmitter.emit('updateDeviceComponent');
											}else{
												res.json({"err_code": 508, "err_msg": "Device Component Id not found"});				
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkLanguageCode', function(){
									if(validator.isEmpty(languageCode)){
										myEmitter.emit('checkDeviceComponentID');
									}else{
										checkCode(apikey, languageCode, 'LANGUAGES', function(resLanguageCode){
											if(resLanguageCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkDeviceComponentID');
											}else{
												res.json({"err_code": 503, "err_msg": "Language code not found"});
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkMeasurementPrinciple', function(){
									if(validator.isEmpty(deviceComponentMeasurementPrinciple)){
										myEmitter.emit('checkLanguageCode');
									}else{
										checkCode(apikey, deviceComponentMeasurementPrinciple, 'MEASUREMENT_PRINCIPLE', function(resMeasurementPrincipleCode){
											if(resMeasurementPrincipleCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkLanguageCode');
											}else{
												res.json({"err_code": 503, "err_msg": "Measurement principle code not found"});
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkParameterGroupCode', function(){
									if(validator.isEmpty(deviceComponentParameterGroup)){
										myEmitter.emit('checkMeasurementPrinciple');
									}else{
										checkCode(apikey, deviceComponentParameterGroup, 'PARAMETER_GROUP', function(resParameterGroupCode){
											if(resParameterGroupCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkMeasurementPrinciple');
											}else{
												res.json({"err_code": 503, "err_msg": "Parameter group code not found"});
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkOperationalStatusCode', function(){
									if(validator.isEmpty(deviceComponentOperationalStatus)){
										myEmitter.emit('checkParameterGroupCode');
									}else{
										checkCode(apikey, deviceComponentOperationalStatus, 'OPERATIONAL_STATUS', function(resOperationalStatusCode){
											if(resOperationalStatusCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkParameterGroupCode');
											}else{
												res.json({"err_code": 503, "err_msg": "Operational status code not found"});
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkParentID', function(){
									if(validator.isEmpty(parentId)){
										myEmitter.emit('checkOperationalStatusCode');
									}else{
										checkUniqeValue(apikey, "DEVICE_COMPONENT_ID|" + deviceOwner, 'DEVICE_COMPONENT', function(resDeviceComponentID){
											if(resDeviceComponentID.err_code > 0){
												myEmitter.emit('checkOperationalStatusCode');
											}else{
												res.json({"err_code": 506, "err_msg": "Parent not found"});		
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkSourceID', function(){
									if(validator.isEmpty(deviceId)){
										myEmitter.emit('checkParentID');
									}else{
										checkUniqeValue(apikey, "DEVICE_ID|" + deviceId, 'DEVICE', function(resDeviceID){
											if(resDeviceID.err_code > 0){
												myEmitter.emit('checkParentID');
											}else{
												res.json({"err_code": 505, "err_msg": "Source not found"});
											}
										})
									}									
								})

								if(validator.isEmpty(deviceComponentType)){
									myEmitter.emit('checkSourceID');
								}else{
									checkCode(apikey, deviceComponentType, 'DEVICE_KIND', function(resDeviceKindCode){
										if(resDeviceKindCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											myEmitter.emit('checkSourceID');
										}else{
											res.json({"err_code": 503, "err_msg": "Type code not found"});
										}
									})
								}
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": err_code, "err_msg": err_msg});
					}	
				},
				deviceComponentProductionSpecification: function updateDeviceComponentProductionSpecification(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var deviceComponentId = req.params.device_component_id;
					var productionSpecificationId = req.params.production_specification_id;

					var err_code = 0;
					var err_msg = "";

					var dataProductionSpecification = {};

					//input check 
					if(typeof deviceComponentId !== 'undefined'){
						if(validator.isEmpty(deviceComponentId)){
							err_code = 2;
							err_msg = "Device component id is required";
						}
					}else{
						err_code = 1;
						err_msg = "Device component id is required";
					}

					if(typeof productionSpecificationId !== 'undefined'){
						if(validator.isEmpty(productionSpecificationId)){
							err_code = 2;
							err_msg = "Production specification id is required";
						}
					}else{
						err_code = 1;
						err_msg = "Production specification id is required";
					}
	
					if(typeof req.body.spec_type !== 'undefined'){
						var specType = req.body.spec_type;
						if(validator.isEmpty(req.body.spec_type)){
							err_code = 2;
							err_msg = "Spec type is required."
						}else{
							dataProductionSpecification.spec_type = specType;
						}
					}else{
						specType = "";
					}

					if(typeof req.body.production_spec !== 'undefined'){
						var productionSpec = req.body.production_spec;
						if(validator.isEmpty(req.body.production_spec)){
							err_code = 2;
							err_msg = "Production spec is required."
						}else{
							dataProductionSpecification.production_spec = productionSpec;
						}
					}else{
						productionSpec = "";
					}
				
					
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	

								myEmitter.prependOnceListener('updateDeviceComponentProductionSpecification', function(){
									//method, endpoint, params, options, callback
									ApiFHIR.put('deviceComponentProductionSpecification', {"apikey": apikey, "_id": productionSpecificationId, "dr": "DEVICE_COMPONENT_ID|"+deviceComponentId}, {body: dataProductionSpecification, json:true}, function(error, response, body){	
								  	var deviceComponentProductionSpecification = body; //object
								  	//cek apakah ada error atau tidak
								  	if(deviceComponentProductionSpecification.err_code == 0){
								  		res.json({"err_code": 0, "err_msg": "Production Specification has been update.", "data": [{"_id": productionSpecificationId}]});
								  	}else{
								  		res.json(deviceComponentProductionSpecification);	
								  	}
									})
								})

								myEmitter.prependOnceListener('checkProductionSpecificationID', function(){
									if(validator.isEmpty(productionSpecificationId)){
										myEmitter.emit('updateDeviceComponentProductionSpecification');
									}else{
										checkUniqeValue(apikey, "DEVICE_COMPONENT_PRODUCTION_SPECIFICATION_ID|" + productionSpecificationId, 'DEVICE_COMPONENT_PRODUCTION_SPECIFICATION', function(resProductionSpecificationID){
											if(resProductionSpecificationID.err_code > 0){
												myEmitter.emit('updateDeviceComponentProductionSpecification');
											}else{
												res.json({"err_code": 502, "err_msg": "Production Specification ID not found"});				
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkDeviceComponentID', function(){
									if(validator.isEmpty(deviceComponentId)){
										myEmitter.emit('checkProductionSpecificationID');
									}else{
										checkUniqeValue(apikey, "DEVICE_COMPONENT_ID|" + deviceComponentId, 'DEVICE_COMPONENT', function(resDeviceComponentID){
											if(resDeviceComponentID.err_code > 0){
												myEmitter.emit('checkProductionSpecificationID');
											}else{
												res.json({"err_code": 502, "err_msg": "Udi Id not found"});				
											}
										})
									}									
								})

								if(validator.isEmpty(specType)){
									myEmitter.emit('checkDeviceComponentID');
								}else{
									checkCode(apikey, specType, 'SPECIFICATION_TYPE', function(resSpecificationTypeCode){
										if(resSpecificationTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											myEmitter.emit('checkDeviceComponentID');
										}else{
											res.json({"err_code": 501, "err_msg": "Specification Type code not found"});			
										}
									})
								}
							}else{
								result.err_code = 500;
								res.json(result);
							}	
						});
					}else{
						res.json({"err_code": err_code, "err_msg": err_msg});
					}	
				}
			}
}

function checkApikey(apikey, ipAddress, callback){
	//method, endpoint, params, options, callback
	Api.get('check_apikey', {"apikey": apikey}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	user = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(user.err_code == 0){
		  	//cek jumdata dulu
		  	if(user.data.length > 0){
		  		//check user_role_id == 1 <-- admin/root
		  		if(user.data[0].user_role_id == 1){
		  			x({"err_code": 0, "status": "root", "user_role_id": user.data[0].user_role_id, "user_id": user.data[0].user_id});	
		  		}else{
			  		//cek apikey
				  	if(apikey == user.data[0].user_apikey){
				  		//ipaddress
					  	dataIpAddress = user.data[0].user_ip_address;
					  	if(dataIpAddress.indexOf(ipAddress) >= 0){
					  		//user is active
					  		if(user.data[0].user_is_active){
					  			//cek data user terpenuhi
					  			x({"err_code": 0, "status": "active", "user_role_id": user.data[0].user_role_id, "user_id": user.data[0].user_id});	
					  		}else{
					  			x({"err_code": 5, "err_msg": "User is not active"});	
					  		}
					  	}else{
					  		x({"err_code": 4, "err_msg": "Ip Address not registered"});
					  	}
				  	}else{
				  		x({"err_code": 3, "err_msg": "Wrong apikey"});
				  	}
		  		}
		  		
		  	}else{
		  			x({"err_code": 2, "err_msg": "Wrong apikey"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": user.error, "application": "Api User Management", "function": "checkApikey"});
	  	}
	  }
	});
	
	function x(result){
		callback(result)
	}
}

function checkId(apikey, tableId, tableName, callback){
	ApiFHIR.get('checkId', {"apikey": apikey, "id": tableId, "name": tableName}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	dataId = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(dataId.err_code == 0){
		  	//cek jumdata dulu
		  	if(dataId.data.length > 0){
		  			x({"err_code": 0, "err_msg": "Id is valid."})
		  	}else{
		  			x({"err_code": 2, "err_msg": "Id is not found."});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": dataId.error, "application": "API FHIR", "function": "checkId"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function checkCode(apikey, code, tableName, callback){
	ApiFHIR.get('checkCode', {"apikey": apikey, "code": code, "name": tableName}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	dataId = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(dataId.err_code == 0){
		  	//cek jumdata dulu
		  	if(dataId.data.length > 0){
		  			x({"err_code": 2, "err_msg": "Code is already exist."})
		  	}else{
		  			x({"err_code": 0, "err_msg": "Code is available to used."});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": dataId.error, "application": "API FHIR", "function": "checkCode"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function checkUniqeValue(apikey, fdValue, tableName, callback){
	ApiFHIR.get('checkUniqeValue', {"apikey": apikey, "fdvalue": fdValue, "tbname": tableName}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	dataId = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(dataId.err_code == 0){
		  	//cek jumdata dulu
		  	if(dataId.data.length > 0){
		  			x({"err_code": 2, "err_msg": "The value is already exist."})
		  	}else{
		  			x({"err_code": 0, "err_msg": "The value is available to insert."});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": dataId.error, "application": "API FHIR", "function": "checkCode"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function getFormattedDate() {
  var date = new Date();
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  return str;
}

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

module.exports = controller;