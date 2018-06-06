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
				deviceMetric: function getDeviceMetric(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					//params from query string
					var deviceMetricId = req.query._id;
					var deviceMetricCategory = req.query.category;
					var deviceMetricParent = req.query.parent; //device component 
					var deviceMetricSource = req.query.source; //device
					var deviceMetricType = req.query.type;
					
					var qString = {};
					if(typeof deviceMetricId !== 'undefined'){
						if(!validator.isEmpty(deviceMetricId)){
							qString._id = deviceMetricId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Device Metric ID is required."})
						}
					}

					if(typeof deviceMetricCategory !== 'undefined'){
						if(!validator.isEmpty(deviceMetricCategory)){
							qString.category = deviceMetricCategory; 
						}else{
							res.json({"err_code": 1, "err_msg": "Category is empty."});
						}
					}

					if(typeof deviceMetricParent !== 'undefined'){
						if(!validator.isEmpty(deviceMetricParent)){
							qString.parent = deviceMetricParent; 
						}else{
							res.json({"err_code": 1, "err_msg": "Parent is empty."});
						}
					}

					if(typeof deviceMetricSource !== 'undefined'){
						if(!validator.isEmpty(deviceMetricSource)){
							qString.source = deviceMetricSource; 
						}else{
							res.json({"err_code": 1, "err_msg": "Source is empty."});
						}
					}

					seedPhoenixFHIR.path.GET = {
						"DeviceMetric" : {
							"location": "%(apikey)s/device-metric",
							"query": qString
						}
					}
					var ApiFHIR = new Apiclient(seedPhoenixFHIR);
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							ApiFHIR.get('DeviceMetric', {"apikey": apikey}, {}, function (error, response, body) {
							  if(error){
							  	res.json(error);
							  }else{
							  	var deviceMetric = JSON.parse(body); //object
							  	//cek apakah ada error atau tidak
							  	if(deviceMetric.err_code == 0){
								  	//cek jumdata dulu
								  	if(deviceMetric.data.length > 0){
								  		newDeviceMetric = [];
								  		for(i=0; i < deviceMetric.data.length; i++){
								  			myEmitter.prependOnceListener("getCalibration", function(deviceMetric, index, newDeviceMetric, countDeviceMetric){
								  				qString = {};
									  			qString.device_metric_id = deviceMetric.id;
										  		seedPhoenixFHIR.path.GET = {
														"DeviceMetricCalibration" : {
															"location": "%(apikey)s/device-metric-calibration",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

													ApiFHIR.get("DeviceMetricCalibration", {"apikey": apikey}, {}, function(error, response, body){
														deviceMetricCalibration = JSON.parse(body);
														if(deviceMetricCalibration.err_code == 0){
															var objectDeviceMetric = {};
															objectDeviceMetric.resourceType = deviceMetric.resourceType;
															objectDeviceMetric.id = deviceMetric.id;
															objectDeviceMetric.type = deviceMetric.type;
															objectDeviceMetric.unit = deviceMetric.unit;
															objectDeviceMetric.source = deviceMetric.source;
															objectDeviceMetric.parent = deviceMetric.parent;
															objectDeviceMetric.operationalStatus = deviceMetric.operationalStatus;
															objectDeviceMetric.color = deviceMetric.color;
															objectDeviceMetric.category = deviceMetric.category;
															objectDeviceMetric.measurementPeriod = deviceMetric.measurementPeriod;
															objectDeviceMetric.calibration = deviceMetricCalibration.data;

															newDeviceMetric[index] = objectDeviceMetric;

															if(index == countDeviceMetric -1 ){
																res.json({"err_code": 0, "data":newDeviceMetric});				
															}	
														}else{
															res.json(deviceMetricCalibration);
														}
													})
								  			})
								  			myEmitter.emit("getCalibration", deviceMetric.data[i], i, newDeviceMetric, deviceMetric.data.length);
								  		}
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Device Metric is empty."});	
								  	}
							  	}else{
							  		res.json(deviceMetric);
							  	}
							  }
							});
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				},
				deviceMetricCalibration: function getDeviceMetricCalibration(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					//params from query string
					var deviceMetricId = req.params.device_metric_id;
					var calibrationId = req.params.calibration_id;
					
					var qString = {};
					if(typeof calibrationId !== 'undefined'){
						if(!validator.isEmpty(calibrationId)){
							qString._id = calibrationId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Calibration ID is required."})
						}
					}

					if(typeof deviceMetricId !== 'undefined'){
						if(!validator.isEmpty(deviceMetricId)){
							qString.device_metric_id = deviceMetricId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Device Metric ID is required."})
						}
					}

					seedPhoenixFHIR.path.GET = {
						"DeviceMetricCalibration" : {
							"location": "%(apikey)s/device-metric-calibration",
							"query": qString
						}
					}
					var ApiFHIR = new Apiclient(seedPhoenixFHIR);
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							ApiFHIR.get('DeviceMetricCalibration', {"apikey": apikey}, {}, function (error, response, body) {
							  if(error){
							  	res.json(error);
							  }else{
							  	var deviceMetricCalibration = JSON.parse(body); //object
							  	//cek apakah ada error atau tidak
							  	if(deviceMetricCalibration.err_code == 0){
								  	//cek jumdata dulu
								  	if(deviceMetricCalibration.data.length > 0){
								  		res.json({"err_code": 0, "data":deviceMetricCalibration.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Calibration is empty."});	
								  	}
							  	}else{
							  		res.json(deviceMetricCalibration);
							  	}
							  }
							});
						}else{
							result.err_code = 500;
							res.json(result);
						}
					});	
				}
			},
			post: {
				deviceMetric: function addDeviceMetric(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					var err_code = 0;
					var err_msg = "";

					//input check
					if(typeof req.body.type !== 'undefined'){
						var deviceMetricType = req.body.type;
						if(validator.isEmpty(req.body.type)){
							err_code = 2;
							err_msg = "Type is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'type' in json request."
					}

					if(typeof req.body.unit !== 'undefined'){
						var deviceMetricUnit = req.body.unit;
						if(validator.isEmpty(req.body.unit)){
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

					if(typeof req.body.device_component_id !== 'undefined'){
						var deviceComponentId = req.body.device_component_id;
						if(validator.isEmpty(req.body.device_component_id)){
							err_code = 2;
							err_msg = "Device Component ID is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'device_component_id' in json request."
					}

					if(typeof req.body.operational_status !== 'undefined'){
						var deviceMetricOperationalStatus = req.body.operational_status;
						if(validator.isEmpty(req.body.operational_status)){
							err_code = 2;
							err_msg = "Operational status is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'operational_status' in json request."
					}

					if(typeof req.body.color !== 'undefined'){
						var deviceMetricColor = req.body.color;
						if(validator.isEmpty(req.body.color)){
							err_code = 2;
							err_msg = "Color is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'color' in json request."
					}

					if(typeof req.body.category !== 'undefined'){
						var deviceMetricCategory = req.body.category;
						if(validator.isEmpty(req.body.category)){
							err_code = 2;
							err_msg = "Category is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'category' in json request."
					}

					if(typeof req.body.measurement_period !== 'undefined'){
						var deviceMetricMeasurementPeriod = req.body.measurement_period;
						if(validator.isEmpty(req.body.measurement_period)){
							err_code = 2;
							err_msg = "Measurement period is required."
						}else{
							var matches = deviceMetricMeasurementPeriod.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
							if (matches === null) {
								err_code = 2;
								err_msg = "Measurement period invalid format.";
							}
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'measurement_period' in json request."
					}


					if(typeof req.body.calibration !== 'undefined'){
						var calibration = req.body.calibration;
						if(typeof calibration.type !== 'undefined'){
							var calibrationType = calibration.type;
							if(validator.isEmpty(calibration.type)){
								err_code = 2;
								err_msg = "Calibration Type is required."
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'type' in calibration json request."
						}

						if(typeof calibration.state !== 'undefined'){
							var calibrationState = calibration.state;
							if(validator.isEmpty(calibration.state)){
								err_code = 2;
								err_msg = "Calibration state is required."
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'state' in calibration json request."
						}

						if(typeof calibration.time !== 'undefined'){
							var calibrationTime = calibration.time;
							if(validator.isEmpty(calibration.time)){
								err_code = 2;
								err_msg = "Calibration state is required."
							}else{
								if(!regex.test(calibrationTime)){
									err_code = 2;
									err_msg = "Calibration date time invalid format.";
								}
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'time' in calibration json request."
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'calibration' in json request."
					}
					
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								checkCode(apikey, deviceMetricType, 'DEVICE_METRIC_TYPE', function(resDeviceMetricTypeCode){
									if(resDeviceMetricTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, deviceMetricUnit, 'DEVICE_METRIC_TYPE', function(resDeviceMetricUnitCode){
											if(resDeviceMetricUnitCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, deviceMetricOperationalStatus, 'METRIC_OPERATIONAL_STATUS', function(resOperationalStatusCode){
													if(resOperationalStatusCode.err_code > 0){
														checkUniqeValue(apikey, "DEVICE_ID|" + deviceId, 'DEVICE', function(resDeviceID){
															if(resDeviceID.err_code > 0){
																checkUniqeValue(apikey, "DEVICE_COMPONENT_ID|" + deviceComponentId, 'DEVICE_COMPONENT', function(resDeviceComponentID){
																	if(resDeviceComponentID.err_code > 0){
																		checkCode(apikey, deviceMetricColor, 'METRIC_COLOR', function(resMetricColorCode){
																			if(resMetricColorCode.err_code > 0){
																				checkCode(apikey, deviceMetricCategory, 'METRIC_CATEGORY', function(resMetricCategoryCode){
																					if(resMetricCategoryCode.err_code > 0){
																						checkCode(apikey, calibrationType, 'METRIC_CALIBRATION_TYPE', function(resCalibrationTypeCode){
																							if(resCalibrationTypeCode.err_code > 0){
																								checkCode(apikey, calibrationState, 'METRIC_CALIBRATION_STATE', function(resCalibrationStateCode){
																									if(resCalibrationStateCode.err_code > 0){
																										//add DeviceMetric
																										var deviceMetricId = 'dm' + uniqid.time();
																										var calibrationId = 'cal' + uniqid.time();

																										var dataDeviceMetric = {
																																			"id": deviceMetricId,
																																			"type": deviceMetricType,
																																			"unit": deviceMetricUnit,
																																			"source" : deviceId,
																																			"parent" : deviceComponentId,
																																			"operational_status": deviceMetricOperationalStatus,
																																			"color": deviceMetricColor, 
																																			"category": deviceMetricCategory, 
																																			"measurement_period" : deviceMetricMeasurementPeriod
																																		}
																										
																										//method, endpoint, params, options, callback
																										ApiFHIR.post('deviceMetric', {"apikey": apikey}, {body: dataDeviceMetric, json:true}, function(error, response, body){	
																									  	var deviceMetric = body; //object
																									  	//cek apakah ada error atau tidak
																									  	if(deviceMetric.err_code > 0){
																									  		res.json(deviceMetric);	
																									  	}
																										})

																										var dataCalibration = {
																																					"id": calibrationId,
																																					"type": calibrationType,
																																					"state": calibrationState,
																																					"time": calibrationTime,
																																					"device_metric_id": deviceMetricId
																																				}

																										ApiFHIR.post('deviceMetricCalibration', {"apikey": apikey}, {body: dataCalibration, json:true}, function(error, response, body){	
																									  	var deviceComponentCalibration = body; //object
																									  	//cek apakah ada error atau tidak
																									  	if(deviceComponentCalibration.err_code > 0){
																									  		res.json(deviceComponentCalibration);	
																									  	}
																										})				

																										res.json({"err_code": 0, "err_msg": "Device Metric has been add.", "data": [{"_id": deviceMetricId}]});
																									
																									}else{
																										res.json({"err_code": 508, "err_msg": "Calibration state code not found"});								
																									}
																								})
																							}else{
																								res.json({"err_code": 507, "err_msg": "Calibration type code not found"});								
																							}
																						})
																					}else{
																						res.json({"err_code": 506, "err_msg": "Category code not found"});						
																					}
																				})		
																			}else{
																				res.json({"err_code": 505, "err_msg": "Color code not found"});						
																			}
																		})
																	}else{
																		res.json({"err_code": 504, "err_msg": "Device Component Id not found"});			
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
												res.json({"err_code": 501, "err_msg": "Unit code not found"});		
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
				deviceMetricCalibration: function addDeviceMetricCalibration(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var deviceMetricId = req.params.device_metric_id;

					var err_code = 0;
					var err_msg = "";


					if(typeof deviceMetricId !== 'undefined'){
						if(validator.isEmpty(deviceMetricId)){
							err_code = 2;
							err_msg = "Device Metric ID is required."
						}
					}else{
						err_code = 1;
						err_msg = "Device Metric ID is required."
					}

					if(typeof req.body.type !== 'undefined'){
						var calibrationType = req.body.type;
						if(validator.isEmpty(req.body.type)){
							err_code = 2;
							err_msg = "Calibration Type is required."
						}
					}else{
						err_code = 2;
						err_msg = "Please add key 'type' in json request."
					}

					if(typeof req.body.state !== 'undefined'){
						var calibrationState = req.body.state;
						if(validator.isEmpty(req.body.state)){
							err_code = 2;
							err_msg = "Calibration state is required."
						}
					}else{
						err_code = 2;
						err_msg = "Please add key 'state' in json request."
					}

					if(typeof req.body.time !== 'undefined'){
						var calibrationTime = req.body.time;
						if(validator.isEmpty(req.body.time)){
							err_code = 2;
							err_msg = "Calibration state is required."
						}else{
							if(!regex.test(calibrationTime)){
								err_code = 2;
								err_msg = "Calibration date time invalid format.";
							}
						}
					}else{
						err_code = 2;
						err_msg = "Please add key 'time' in json request."
					}
				
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								checkCode(apikey, calibrationType, 'METRIC_CALIBRATION_TYPE', function(resCalibrationTypeCode){
									if(resCalibrationTypeCode.err_code > 0){
										checkCode(apikey, calibrationState, 'METRIC_CALIBRATION_STATE', function(resCalibrationStateCode){
											if(resCalibrationStateCode.err_code > 0){
												//add DeviceMetricCalibration
												var calibrationId = 'cal' + uniqid.time();
												var dataCalibration = {
																							"id": calibrationId,
																							"type": calibrationType,
																							"state": calibrationState,
																							"time": calibrationTime,
																							"device_metric_id": deviceMetricId
																						}

												ApiFHIR.post('deviceMetricCalibration', {"apikey": apikey}, {body: dataCalibration, json:true}, function(error, response, body){	
											  	var deviceComponentCalibration = body; //object
											  	//cek apakah ada error atau tidak
											  	if(deviceComponentCalibration.err_code > 0){
											  		res.json(deviceComponentCalibration);	
											  	}
												})				

												res.json({"err_code": 0, "err_msg": "Calibration has been add.", "data": [{"_id": calibrationId}]});
											
											}else{
												res.json({"err_code": 508, "err_msg": "Calibration state code not found"});								
											}
										})
									}else{
										res.json({"err_code": 507, "err_msg": "Calibration type code not found"});								
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
				deviceMetric: function updateDeviceMetric(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var deviceMetricId = req.params.device_metric_id;

					var err_code = 0;
					var err_msg = "";

					var dataDeviceMetric = {};

					if(typeof deviceMetricId !== 'undefined'){
						if(validator.isEmpty(deviceMetricId)){
							err_code = 2;
							err_msg = "Device Metric id is required."
						}
					}else{
						err_code = 1;
						err_msg = "Device Metric id is required."
					}

					//input check
					if(typeof req.body.type !== 'undefined'){
						var deviceMetricType = req.body.type;
						if(validator.isEmpty(req.body.type)){
							err_code = 2;
							err_msg = "Type is required."
						}else{
							dataDeviceMetric.type = deviceMetricType;
						}
					}else{
						deviceMetricType = "";
					}

					if(typeof req.body.unit !== 'undefined'){
						var deviceMetricUnit = req.body.unit;
						if(validator.isEmpty(req.body.unit)){
							err_code = 2;
							err_msg = "Type is required."
						}else{
							dataDeviceMetric.unit = deviceMetricUnit;
						}
					}else{
						deviceMetricUnit = "";
					}

					if(typeof req.body.device_id !== 'undefined'){
						var deviceId = req.body.device_id;
						if(validator.isEmpty(req.body.device_id)){
							err_code = 2;
							err_msg = "Device ID is required."
						}else{
							dataDeviceMetric.source = deviceId;
						}
					}else{
						deviceId = "";
					}

					if(typeof req.body.device_component_id !== 'undefined'){
						var deviceComponentId = req.body.device_component_id;
						if(validator.isEmpty(req.body.device_component_id)){
							err_code = 2;
							err_msg = "Device Component ID is required."
						}else{
							dataDeviceMetric.parent = deviceComponentId;
						}
					}else{
						deviceComponentId = "";
					}

					if(typeof req.body.operational_status !== 'undefined'){
						var deviceMetricOperationalStatus = req.body.operational_status;
						if(validator.isEmpty(req.body.operational_status)){
							err_code = 2;
							err_msg = "Operational status is required."
						}else{
							dataDeviceMetric.operational_status = deviceMetricOperationalStatus;
						}
					}else{
						deviceMetricOperationalStatus = "";
					}

					if(typeof req.body.color !== 'undefined'){
						var deviceMetricColor = req.body.color;
						if(validator.isEmpty(req.body.color)){
							err_code = 2;
							err_msg = "Color is required."
						}else{
							dataDeviceMetric.color = deviceMetricColor;
						}
					}else{
						deviceMetricColor = "";
					}

					if(typeof req.body.category !== 'undefined'){
						var deviceMetricCategory = req.body.category;
						if(validator.isEmpty(req.body.category)){
							err_code = 2;
							err_msg = "Category is required."
						}else{
							dataDeviceMetric.category = deviceMetricCategory;
						}
					}else{
						deviceMetricCategory = "";
					}

					if(typeof req.body.measurement_period !== 'undefined'){
						var deviceMetricMeasurementPeriod = req.body.measurement_period;
						if(validator.isEmpty(req.body.measurement_period)){
							err_code = 2;
							err_msg = "Measurement period is required."
						}else{
							var matches = deviceMetricMeasurementPeriod.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
							if (matches === null) {
								err_code = 2;
								err_msg = "Measurement period invalid format.";
							}else{
								dataDeviceMetric.measurement_period = deviceMetricMeasurementPeriod;
							}
						}
					}
					
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	

								myEmitter.prependOnceListener('updateDeviceMetric', function(){
									//method, endpoint, params, options, callback
									ApiFHIR.put('deviceMetric', {"apikey": apikey, "_id": deviceMetricId}, {body: dataDeviceMetric, json:true}, function(error, response, body){	
								  	var deviceMetric = body; //object
								  	//cek apakah ada error atau tidak
								  	if(deviceMetric.err_code == 0){
								  		res.json({"err_code": 0, "err_msg": "Device Metric has been update.", "data": [{"_id": deviceMetricId}]});
								  	}else{
								  		res.json(deviceMetric);	
								  	}
									})
								})

								myEmitter.prependOnceListener('checkDeviceMetricID', function(){
									if(!validator.isEmpty(deviceMetricId)){
										checkUniqeValue(apikey, "DEVICE_METRIC_ID|" + deviceMetricId, 'DEVICE_METRIC', function(resDeviceMetricID){
											if(resDeviceMetricID.err_code > 0){
												myEmitter.emit('updateDeviceMetric');
											}else{
												res.json({"err_code": 508, "err_msg": "Device Metric Id not found"});				
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkCategoryCode', function(){
									if(validator.isEmpty(deviceMetricCategory)){
										myEmitter.emit('checkDeviceMetricID');
									}else{
										checkCode(apikey, deviceMetricCategory, 'METRIC_CATEGORY', function(resMetricCategoryCode){
											if(resMetricCategoryCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkDeviceMetricID');
											}else{
												res.json({"err_code": 507, "err_msg": "Category code not found"});
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkColorCode', function(){
									if(validator.isEmpty(deviceMetricColor)){
										myEmitter.emit('checkCategoryCode');
									}else{
										checkCode(apikey, deviceMetricColor, 'METRIC_COLOR', function(resMetricColorCode){
											if(resMetricColorCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkCategoryCode');
											}else{
												res.json({"err_code": 506, "err_msg": "Color code not found"});
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkOperationalStatusCode', function(){
									if(validator.isEmpty(deviceMetricOperationalStatus)){
										myEmitter.emit('checkColorCode');
									}else{
										checkCode(apikey, deviceMetricOperationalStatus, 'METRIC_OPERATIONAL_STATUS', function(resOperationalStatusCode){
											if(resOperationalStatusCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkColorCode');
											}else{
												res.json({"err_code": 505, "err_msg": "Operational status code not found"});
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkParentID', function(){
									if(validator.isEmpty(deviceComponentId)){
										myEmitter.emit('checkOperationalStatusCode');
									}else{
										checkUniqeValue(apikey, "DEVICE_COMPONENT_ID|" + deviceComponentId, 'DEVICE_COMPONENT', function(resDeviceComponentID){
											if(resDeviceComponentID.err_code > 0){
												myEmitter.emit('checkOperationalStatusCode');
											}else{
												res.json({"err_code": 504, "err_msg": "Parent not found"});		
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
												res.json({"err_code": 503, "err_msg": "Source not found"});		
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkDeviceMetricUnitCode', function(){
									if(validator.isEmpty(deviceMetricUnit)){
										myEmitter.emit('checkSourceID');
									}else{
										checkCode(apikey, deviceMetricUnit, 'DEVICE_METRIC_TYPE', function(resDeviceMetricTypeCode){
											if(resDeviceMetricTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkSourceID');
											}else{
												res.json({"err_code": 502, "err_msg": "Unit code not found"});
											}
										})
									}									
								})

								if(validator.isEmpty(deviceMetricType)){
									myEmitter.emit('checkDeviceMetricUnitCode');
								}else{
									checkCode(apikey, deviceMetricType, 'DEVICE_METRIC_TYPE', function(resDeviceMetricTypeCode){
										if(resDeviceMetricTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											myEmitter.emit('checkDeviceMetricUnitCode');
										}else{
											res.json({"err_code": 501, "err_msg": "Type code not found"});
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
				deviceMetricCalibration: function updateDeviceMetricCalibration(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var deviceMetricId = req.params.device_metric_id;
					var calibrationId = req.params.calibration_id;

					var err_code = 0;
					var err_msg = "";

					var dataCalibration = {};

					//input check 
					if(typeof deviceMetricId !== 'undefined'){
						if(validator.isEmpty(deviceMetricId)){
							err_code = 2;
							err_msg = "Device Metric id is required";
						}
					}else{
						err_code = 1;
						err_msg = "Device Metric id is required";
					}

					if(typeof calibrationId !== 'undefined'){
						if(validator.isEmpty(calibrationId)){
							err_code = 2;
							err_msg = "Calibration id is required";
						}
					}else{
						err_code = 1;
						err_msg = "Calibration id is required";
					}
	
					if(typeof req.body.type !== 'undefined'){
						var calibrationType = req.body.type;
						if(validator.isEmpty(req.body.type)){
							err_code = 2;
							err_msg = "Calibration type is required."
						}else{
							dataCalibration.type = calibrationType;
						}
					}else{
						calibrationType = "";
					}

					if(typeof req.body.state !== 'undefined'){
						var calibrationState = req.body.state;
						if(validator.isEmpty(req.body.state)){
							err_code = 2;
							err_msg = "Calibration state is required."
						}else{
							dataCalibration.state = calibrationState;
						}
					}else{
						calibrationState = "";
					}

					if(typeof req.body.time !== 'undefined'){
						var calibrationTime = req.body.time;
						if(validator.isEmpty(req.body.time)){
							err_code = 2;
							err_msg = "Calibration time is required."
						}else{
							dataCalibration.time = calibrationTime;
						}
					}
				
					
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	

								myEmitter.prependOnceListener('updateDeviceMetricCalibration', function(){
									//method, endpoint, params, options, callback
									ApiFHIR.put('deviceMetricCalibration', {"apikey": apikey, "_id": calibrationId, "dr": "DEVICE_METRIC_ID|"+deviceMetricId}, {body: dataCalibration, json:true}, function(error, response, body){	
								  	var deviceMetricCalibration = body; //object
								  	//cek apakah ada error atau tidak
								  	if(deviceMetricCalibration.err_code == 0){
								  		res.json({"err_code": 0, "err_msg": "Calibration has been update.", "data": [{"_id": calibrationId}]});
								  	}else{
								  		res.json(deviceMetricCalibration);	
								  	}
									})
								})

								myEmitter.prependOnceListener('checkCalibrationID', function(){
									if(!validator.isEmpty(calibrationId)){
										checkUniqeValue(apikey, "DEVICE_METRIC_CALIBRATION_ID|" + calibrationId, 'DEVICE_METRIC_CALIBRATION', function(resCalibrationID){
											if(resCalibrationID.err_code > 0){
												myEmitter.emit('updateDeviceMetricCalibration');
											}else{
												res.json({"err_code": 502, "err_msg": "Calibration ID not found"});				
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkDeviceMetricID', function(){
									if(!validator.isEmpty(deviceMetricId)){
										checkUniqeValue(apikey, "DEVICE_METRIC_ID|" + deviceMetricId, 'DEVICE_METRIC', function(resDeviceMetricID){
											if(resDeviceMetricID.err_code > 0){
												myEmitter.emit('checkCalibrationID');
											}else{
												res.json({"err_code": 502, "err_msg": "Device Metric ID not found"});				
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkCalibrationState', function(){
									if(validator.isEmpty(calibrationState)){
										myEmitter.emit('checkDeviceMetricID');
									}else{
										checkCode(apikey, calibrationState, 'METRIC_CALIBRATION_STATE', function(resCalibrationStateCode){
											if(resCalibrationStateCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkDeviceMetricID');
											}else{
												res.json({"err_code": 502, "err_msg": "Calibration State code not found"});			
											}
										})
									}									
								})

								if(validator.isEmpty(calibrationType)){
									myEmitter.emit('checkCalibrationState');
								}else{
									checkCode(apikey, calibrationType, 'METRIC_CALIBRATION_TYPE', function(resCalibrationTypeCode){
										if(resCalibrationTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											myEmitter.emit('checkCalibrationState');
										}else{
											res.json({"err_code": 501, "err_msg": "Calibration Type code not found"});			
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