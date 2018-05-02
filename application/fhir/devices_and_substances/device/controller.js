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
				device: function getDevice(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					//params from query string
					var deviceId = req.query._id;
					var deviceName = req.query.device_name;
					var deviceLocation = req.query.location;
					var deviceManufacturer = req.query.manufacturer;
					var deviceModel = req.query.model;
					var deviceOwner = req.query.organization;
					var devicePatient = req.query.patient;
					var deviceStatus = req.query.status;
					var deviceType = req.query.type;
					var deviceUdiCarrier = req.query.udi_carrier;
					var deviceUdiIdentifier = req.query.udi_di;
					
					var qString = {};
					if(typeof deviceId !== 'undefined'){
						if(!validator.isEmpty(deviceId)){
							qString._id = deviceId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Device ID is required."})
						}
					}

					if(typeof deviceName !== 'undefined'){
						if(!validator.isEmpty(deviceName)){
							if(deviceName.indexOf(" ") > 0){
								qString.device_name = deviceName.replace(/ /g, "nonbreaking_space"); 
							}else{
								qString.device_name = deviceName; 	
							}
						}else{
							res.json({"err_code": 1, "err_msg": "Device name is empty."});
						}
					}

					if(typeof deviceLocation !== 'undefined'){
						if(!validator.isEmpty(deviceLocation)){
							qString.location = deviceLocation; 
						}else{
							res.json({"err_code": 1, "err_msg": "Location is empty."});
						}
					}

					if(typeof deviceManufacturer !== 'undefined'){
						if(!validator.isEmpty(deviceManufacturer)){
							if(deviceManufacturer.indexOf(" ") > 0){
								qString.manufacturer = deviceManufacturer.replace(/ /g, "nonbreaking_space"); 
							}else{
								qString.manufacturer = deviceManufacturer; 	
							}
						}else{
							res.json({"err_code": 1, "err_msg": "Manufacturer is empty."});
						}
					}

					if(typeof deviceModel !== 'undefined'){
						if(!validator.isEmpty(deviceModel)){
							if(deviceModel.indexOf(" ") > 0){
								qString.model = deviceModel.replace(/ /g, "nonbreaking_space"); 
							}else{
								qString.model = deviceModel; 
							}
							
						}else{
							res.json({"err_code": 1, "err_msg": "Model is empty."});
						}
					}

					if(typeof deviceOwner !== 'undefined'){
						if(!validator.isEmpty(deviceOwner)){
							qString.organization = deviceOwner; 
						}else{
							res.json({"err_code": 1, "err_msg": "Owner is empty."});
						}
					}

					if(typeof devicePatient !== 'undefined'){
						if(!validator.isEmpty(devicePatient)){
							qString.patient = devicePatient; 
						}else{
							res.json({"err_code": 1, "err_msg": "Patient is empty."});
						}
					}

					if(typeof deviceStatus !== 'undefined'){
						if(!validator.isEmpty(deviceStatus)){
							qString.status = deviceStatus; 
						}else{
							res.json({"err_code": 1, "err_msg": "Status is empty."});
						}
					}

					if(typeof deviceType !== 'undefined'){
						if(!validator.isEmpty(deviceType)){
							qString.type = deviceType; 
						}else{
							res.json({"err_code": 1, "err_msg": "Type is empty."});
						}
					}

					if(typeof deviceUdiCarrier !== 'undefined'){
						if(!validator.isEmpty(deviceUdiCarrier)){
							if(deviceUdiCarrier.indexOf(" ") > 0){
								qString.udi_carrier = deviceUdiCarrier.replace(/ /g, "nonbreaking_space"); 
							}else{
								qString.udi_carrier = deviceUdiCarrier; 
							}
						}else{
							res.json({"err_code": 1, "err_msg": "Udi Carrier is empty."});
						}
					}

					if(typeof deviceUdiIdentifier !== 'undefined'){
						if(!validator.isEmpty(deviceUdiIdentifier)){
							qString.udi_di = deviceUdiIdentifier; 
						}else{
							res.json({"err_code": 1, "err_msg": "Udi DI is empty."});
						}
					}

					seedPhoenixFHIR.path.GET = {
						"Device" : {
							"location": "%(apikey)s/device",
							"query": qString
						}
					}
					var ApiFHIR = new Apiclient(seedPhoenixFHIR);
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							ApiFHIR.get('Device', {"apikey": apikey}, {}, function (error, response, body) {
							  if(error){
							  	res.json(error);
							  }else{
							  	var device = JSON.parse(body); //object
							  	//cek apakah ada error atau tidak
							  	if(device.err_code == 0){
								  	//cek jumdata dulu
								  	if(device.data.length > 0){
								  		newDevice = [];
								  		for(i=0; i < device.data.length; i++){
								  			myEmitter.prependOnceListener("getDeviceUdi", function(device, index, newDevice, countDevice){
								  				qString = {};
									  			qString._id = device.udiId;
										  		seedPhoenixFHIR.path.GET = {
														"DeviceUdi" : {
															"location": "%(apikey)s/device-udi",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

													ApiFHIR.get("DeviceUdi", {"apikey": apikey}, {}, function(error, response, body){
														deviceUdi = JSON.parse(body);
														if(deviceUdi.err_code == 0){
															var objectDevice = {};
															objectDevice.resourceType = device.resourceType;
															objectDevice.id = device.id;
															objectDevice.udi = deviceUdi.data;
															objectDevice.status = device.status;
															objectDevice.type = device.type;
															objectDevice.lotNumber = device.lotNumber;
															objectDevice.lotNumber = device.lotNumber;
															objectDevice.manufacturer = device.manufacturer;
															objectDevice.manufacturerDate = device.manufacturerDate;
															objectDevice.expirationDate = device.expirationDate;
															objectDevice.model = device.model;
															objectDevice.version = device.version;
															objectDevice.patient = device.patient;
															objectDevice.owner = device.owner;
															objectDevice.location = device.location;
															objectDevice.url = device.url;
															objectDevice.note = device.note;
															objectDevice.safety = device.safety;

															newDevice[index] = objectDevice;

															myEmitter.prependOnceListener('getContactPoint', function(device, index, newDevice, countDevice){
																qString = {};
												  			qString.device_id = device.id;
													  		seedPhoenixFHIR.path.GET = {
																	"ContactPoint" : {
																		"location": "%(apikey)s/ContactPoint",
																		"query": qString
																	}
																}

																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																ApiFHIR.get('ContactPoint', {"apikey": apikey}, {}, function(error, response, body){
																	contactPoint = JSON.parse(body);
																	if(contactPoint.err_code == 0){
																		var objectDevice = {};
																		objectDevice.resourceType = device.resourceType;
																		objectDevice.id = device.id;
																		objectDevice.udi = deviceUdi.data;
																		objectDevice.status = device.status;
																		objectDevice.type = device.type;
																		objectDevice.lotNumber = device.lotNumber;
																		objectDevice.lotNumber = device.lotNumber;
																		objectDevice.manufacturer = device.manufacturer;
																		objectDevice.manufacturerDate = device.manufacturerDate;
																		objectDevice.expirationDate = device.expirationDate;
																		objectDevice.model = device.model;
																		objectDevice.version = device.version;
																		objectDevice.patient = device.patient;
																		objectDevice.owner = device.owner;
																		objectDevice.contact = contactPoint.data;
																		objectDevice.location = device.location;
																		objectDevice.url = device.url;
																		objectDevice.note = device.note;
																		objectDevice.safety = device.safety;
																		
																		newDevice[index] = objectDevice;

																		if(index == countDevice -1 ){
																			res.json({"err_code": 0, "data":newDevice});				
																		}		
																	}else{
																		res.json(contactPoint);			
																	}
																})
															})
															myEmitter.emit('getContactPoint', objectDevice, index, newDevice, countDevice);
														}else{
															res.json(deviceUdi);
														}
													})
								  			})
								  			myEmitter.emit("getDeviceUdi", device.data[i], i, newDevice, device.data.length);
								  		}
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Device is empty."});	
								  	}
							  	}else{
							  		res.json(device);
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
				device: function addDevice(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					var err_code = 0;
					var err_msg = "";

					//input check 
					if(typeof req.body.udi !== 'undefined'){
						var udi = req.body.udi;

						if(typeof udi.name !== 'undefined'){
							var udiName = udi.name;
							if(validator.isEmpty(udi.name)){
								err_code = 2;
								err_msg = "Udi name is required."
							}
						}else{
							err_code = 1;
							err_msg  = "Please add sub-key 'name' in udi json request."
						}

						if(typeof udi.jurisdiction !== 'undefined'){
							var udiJurisdiction = udi.jurisdiction;
							if(!validator.isURL(udi.jurisdiction)){
								err_code = 2;
								err_msg = "Jurisdiction is uri format."
							}
						}else{
							err_code = 1;
							err_msg  = "Please add sub-key 'jurisdiction' in udi json request."
						}

						if(typeof udi.carrier_hrf !== 'undefined'){
							var udiCarrierHRF = udi.carrier_hrf;
							if(validator.isEmpty(udi.carrier_hrf)){
								err_code = 2;
								err_msg = "Carrier HRF is required."
							}
						}else{
							err_code = 1;
							err_msg  = "Please add sub-key 'carrier_hrf' in udi json request."
						}

						if(typeof udi.carrier_aidc !== 'undefined'){
							var udiCarrierAIDC = udi.carrier_aidc;
							if(validator.isEmpty(udi.carrier_aidc)){
								err_code = 2;
								err_msg = "Carrier AIDC is required."
							}
						}else{
							err_code = 1;
							err_msg  = "Please add sub-key 'carrier_aidc' in udi json request."
						}

						if(typeof udi.issuer !== 'undefined'){
							var udiIssuer = udi.issuer;
							if(!validator.isURL(udi.issuer)){
								err_code = 2;
								err_msg = "Issuer is uri format."
							}
						}else{
							err_code = 1;
							err_msg  = "Please add sub-key 'issuer' in udi json request."
						}

						if(typeof udi.entry_type !== 'undefined'){
							var udiEntryType = udi.entry_type;
							if(validator.isEmpty(udi.entry_type)){
								err_code = 2;
								err_msg = "Entry type is required."
							}
						}else{
							err_code = 1;
							err_msg  = "Please add sub-key 'entry_type' in udi json request."
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'udi' in json request."
					}

					if(typeof req.body.status !== 'undefined'){
						var deviceStatus = req.body.status;
						if(validator.isEmpty(req.body.status)){
							err_code = 2;
							err_msg = "Status is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'status' in json request."
					}

					if(typeof req.body.type !== 'undefined'){
						var deviceType = req.body.type;
						if(validator.isEmpty(req.body.type)){
							err_code = 2;
							err_msg = "Type is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'type' in json request."
					}

					if(typeof req.body.lot_number !== 'undefined'){
						var deviceLotNumber = req.body.lot_number;
						if(validator.isEmpty(req.body.lot_number)){
							err_code = 2;
							err_msg = "Lot number is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'lot_number' in json request."
					}

					if(typeof req.body.manufacturer !== 'undefined'){
						var deviceManufacturer = req.body.manufacturer;
						if(validator.isEmpty(req.body.manufacturer)){
							err_code = 2;
							err_msg = "Manufacturer is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'manufacturer' in json request."
					}

					if(typeof req.body.manufacture_date !== 'undefined'){
						var deviceManufactureDate = req.body.manufacture_date;
						if(validator.isEmpty(req.body.manufacture_date)){
							err_code = 2;
							err_msg = "Manufacture date is required."
						}else{
							if(!regex.test(deviceManufactureDate)){
								err_code = 2;
								err_msg = "Manufacture date invalid date format.";
							}
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'manufacture_date' in json request."
					}

					if(typeof req.body.expiration_date !== 'undefined'){
						var deviceExpirationDate = req.body.expiration_date;
						if(validator.isEmpty(req.body.expiration_date)){
							err_code = 2;
							err_msg = "Expiration date is required."
						}else{
							if(!regex.test(deviceExpirationDate)){
								err_code = 2;
								err_msg = "Expiration date invalid date format.";
							}
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'expiration_date' in json request."
					}

					if(typeof req.body.model !== 'undefined'){
						var deviceModel = req.body.model;
						if(validator.isEmpty(req.body.model)){
							err_code = 2;
							err_msg = "Model is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'model' in json request."
					}

					if(typeof req.body.version !== 'undefined'){
						var deviceVersion = req.body.version;
						if(validator.isEmpty(req.body.version)){
							err_code = 2;
							err_msg = "Version is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'version' in json request."
					}

					if(typeof req.body.patient_id !== 'undefined'){
						var devicePatient = req.body.patient_id;
						if(validator.isEmpty(req.body.patient_id)){
							err_code = 2;
							err_msg = "Patient ID is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'patient_id' in json request."
					}

					if(typeof req.body.organization_id !== 'undefined'){
						var deviceOwner = req.body.organization_id;
						if(validator.isEmpty(req.body.organization_id)){
							err_code = 2;
							err_msg = "Organization ID is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'organization_id' in json request."
					}


					if(typeof req.body.contact !== 'undefined'){
						var contact = req.body.contact;
						if(typeof contact.system !== 'undefined'){
							var contactSystemCode = contact.system;
							if(validator.isEmpty(contact.system)){
								err_code = 2;
								err_msg = "Contact.system is required."
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'system' in contact json request."
						}

						if(typeof contact.value !== 'undefined'){
							var contactValue = contact.value;
							if(validator.isEmpty(contact.value)){
								err_code = 2;
								err_msg = "Contact.value is required."
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'value' in contact json request."
						}

						if(typeof contact.use !== 'undefined'){
							var contactUseCode = contact.use;
							if(validator.isEmpty(contact.use)){
								err_code = 2;
								err_msg = "Contact.use is required."
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'use' in contact json request."
						}

						if(typeof contact.rank !== 'undefined'){
							var contactRank = contact.rank;
							if(validator.isEmpty(contact.rank)){
								err_code = 2;
								err_msg = "Contact.rank is required."
							}
						}else{
							err_code = 2;
							err_msg = "Please add sub-key 'rank' in contact json request."
						}

						if(typeof contact.period !== 'undefined'){
							var period = contact.period;
							if(period.indexOf("to") > 0){
								arrPeriod = period.split("to");
								periodStart = arrPeriod[0];
								periodEnd = arrPeriod[1];
								
								if(!regex.test(periodStart) && !regex.test(periodEnd)){
									err_code = 2;
									err_msg = "Contact period invalid date format.";
								}	
							}else{
								periodStart = "";
								periodEnd = "";
							}
						}else{
							periodStart = "";
							periodEnd = "";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'contact' in json request."
					}

					if(typeof req.body.location_id !== 'undefined'){
						var deviceLocation = req.body.location_id;
						if(validator.isEmpty(req.body.location_id)){
							err_code = 2;
							err_msg = "Location ID is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'location_id' in json request."
					}

					if(typeof req.body.uri !== 'undefined'){
						var deviceURI = req.body.uri;
						if(!validator.isURL(req.body.uri)){
							err_code = 2;
							err_msg = "Invalid format uri."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'uri' in json request."
					}

					if(typeof req.body.note !== 'undefined'){
						var deviceNote = req.body.note;
						if(validator.isEmpty(req.body.note)){
							err_code = 2;
							err_msg = "Note is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'note' in json request."
					}

					if(typeof req.body.safety !== 'undefined'){
						var deviceSafety = req.body.safety;
						if(validator.isEmpty(req.body.safety)){
							err_code = 2;
							err_msg = "Safety is required."
						}
					}else{
						err_code = 1;
						err_msg  = "Please add key 'safety' in json request."
					}

					
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								checkCode(apikey, udiEntryType, 'UDI_ENTRY_TYPE', function(resUdiEntryTypeCode){
									if(resUdiEntryTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, deviceStatus, 'DEVICE_STATUS', function(resDeviceStatusCode){
											if(resDeviceStatusCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, deviceType, 'DEVICE_KIND', function(resDeviceKindCode){
													if(resDeviceKindCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
														checkCode(apikey, deviceSafety, 'DEVICE_SAFETY', function(resDeviceSafetyCode){
															if(resDeviceSafetyCode.err_code > 0){
																checkUniqeValue(apikey, "PATIENT_ID|" + devicePatient, 'PATIENT', function(resPatientID){
																	if(resPatientID.err_code > 0){
																		checkUniqeValue(apikey, "ORGANIZATION_ID|" + deviceOwner, 'ORGANIZATION', function(resOrganizationID){
																			if(resOrganizationID.err_code > 0){
																				checkUniqeValue(apikey, "LOCATION_ID|" + deviceLocation, 'LOCATION', function(resLocationID){
																					if(resLocationID.err_code > 0){
																						checkCode(apikey, contactSystemCode, 'CONTACT_POINT_SYSTEM', function(resContactPointSystemCode){
																							if(resContactPointSystemCode.err_code > 0){
																								checkCode(apikey, contactUseCode, 'CONTACT_POINT_USE', function(resContactPointUseCode){
																									if(resContactPointUseCode.err_code > 0){
																										checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactValue, 'CONTACT_POINT', function(resContactValue){
																											if(resContactValue.err_code == 0){ //ready to use, code == 0
																													//add Device
																													var deviceId = 'dev' + uniqid.time();
																													var deviceUdiId = 'du' + uniqid.time();
																													var contactPointId = 'cp' + uniqid.time();

																													var dataDevice = {
																																						"id": deviceId,
																																						"status": deviceStatus,
																																						"type": deviceType,
																																						"lot_number": deviceLotNumber,
																																						"manufacturer": deviceManufacturer,
																																						"manufacture_date": deviceManufactureDate, 
																																						"expiration_date": deviceExpirationDate, 
																																						"model" : deviceModel,
																																						"version" : deviceVersion,
																																						"url": deviceURI,
																																						"note" : deviceNote,
																																						"safety" : deviceSafety,
																																						"patient_id" : devicePatient,
																																						"organization_id" : deviceOwner,
																																						"location_id" : deviceLocation,
																																						"udi_id" : deviceUdiId
																																					}
																													
																													//method, endpoint, params, options, callback
																													ApiFHIR.post('device', {"apikey": apikey}, {body: dataDevice, json:true}, function(error, response, body){	
																												  	var device = body; //object
																												  	//cek apakah ada error atau tidak
																												  	if(device.err_code > 0){
																												  		res.json(device);	
																												  	}
																													})


																													var dataDeviceUdi = {
																																								"id": deviceUdiId,
																																								"name": udiName,
																																								"jurisdiction": udiJurisdiction,
																																								"carrier_hrf": udiCarrierHRF,
																																								"carrier_aidc": udiCarrierAIDC,
																																								"issuer": udiIssuer,
																																								"entry_type": udiEntryType
																																							}

																													ApiFHIR.post('deviceUdi', {"apikey": apikey}, {body: dataDeviceUdi, json:true}, function(error, response, body){	
																												  	var deviceUdi = body; //object
																												  	//cek apakah ada error atau tidak
																												  	if(deviceUdi.err_code > 0){
																												  		res.json(deviceUdi);	
																												  	}
																													})

																													//contact_point
																								  				dataContactPoint = {
																								  														"id": contactPointId,
																								  														"system": contactSystemCode,
																								  														"value": contactValue,
																								  														"use": contactUseCode,
																								  														"rank": contactRank,
																								  														"period_start": periodStart,
																								  														"period_end": periodEnd,
																								  														"device_id": deviceId
																								  													}

																								  				ApiFHIR.post('contactPoint', {"apikey": apikey}, {body: dataContactPoint, json: true}, function(error, response, body){
																								  					contactPoint = body;
																								  					if(contactPoint.err_code > 0){
																								  						res.json(contactPoint);	
																								  					}
																								  				})										

																													res.json({"err_code": 0, "err_msg": "Device has been add.", "data": [{"_id": deviceId}]});
																												
																											}else{
																												res.json({"err_code": 510, "err_msg": "Contact value already exist."});						
																											}
																										})
																									}else{
																										res.json({"err_code": 509, "err_msg": "Contact Point Use code not found"});						
																									}
																								})		
																							}else{
																								res.json({"err_code": 508, "err_msg": "Contact Point System code not found"});						
																							}
																						})
																					}else{
																						res.json({"err_code": 507, "err_msg": "Location Id not found"});				
																					}
																				})
																			}else{
																				res.json({"err_code": 506, "err_msg": "Organization Id not found"});				
																			}
																		})
																	}else{
																		res.json({"err_code": 505, "err_msg": "Patient Id not found"});		
																	}
																})
															}else{
																res.json({"err_code": 504, "err_msg": "Device Safety code not found"});		
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Device Type code not found"});		
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Device Status code not found"});		
											}
										})
									}else{
										res.json({"err_code": 501, "err_msg": "Udi entry type code not found"});
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
				deviceContact: function addDeviceContact(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var deviceId = req.params.device_id;

					var err_code = 0;
					var err_msg = "";

					//input check 
					if(typeof deviceId !== 'undefined'){
						if(validator.isEmpty(deviceId)){
							err_code = 2;
							err_msg = "Device id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Device id is required";
					}

					//telecom
					if(typeof req.body.system !== 'undefined'){
						contactPointSystemCode =  req.body.system.trim().toLowerCase();
						if(validator.isEmpty(contactPointSystemCode)){
							err_code = 2;
							err_msg = "Contact Point System is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'system' in json request.";
					}

					//telecom value
					if(typeof req.body.value !== 'undefined'){
						contactPointValue =  req.body.value;
						if(contactPointSystemCode == 'email'){
							if(!validator.isEmail(contactPointValue)){
								err_code = 2;
								err_msg = "Contact Point Value is invalid email format";
							}
						}else{
							if(validator.isEmpty(contactPointValue)){
								err_code = 2;
								err_msg = "Contact Point Value is required";
							}
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'value' in json request.";
					}

					//telecom use code
					if(typeof req.body.use !== 'undefined'){
						contactPointUseCode =  req.body.use.trim().toLowerCase();
						if(validator.isEmpty(contactPointUseCode)){
							err_code = 2;
							err_msg = "Telecom Use Code is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'use' in json request.";
					} 

					//contact poin rank
					if(typeof req.body.rank !== 'undefined'){
						contactPointRank =  req.body.rank;
						if(!validator.isInt(contactPointRank)){
							err_code = 2;
							err_msg = "Telecom Rank must be number";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'rank' in json request.";
					} 

					//contact point period
					if(typeof req.body.period !== 'undefined'){
						var period = req.body.period;
						if(period.indexOf("to") > 0){
							arrPeriod = period.split("to");
							contactPointPeriodStart = arrPeriod[0];
							contactPointPeriodEnd = arrPeriod[1];
							
							if(!regex.test(contactPointPeriodStart) && !regex.test(contactPointPeriodEnd)){
								err_code = 2;
								err_msg = "Telecom Period invalid date format.";
							}	
						}else{
							err_code = 1;
							err_msg = "Telecom Period request format is wrong, `ex: start to end` ";
						}
					}else{
						contactPointPeriodStart = "";
						contactPointPeriodEnd = "";
					}

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkUniqeValue(apikey, "DEVICE_ID|" + deviceId, 'DEVICE', function(resPersonID){
									if(resPersonID.err_code > 0){
										checkCode(apikey, contactPointSystemCode, 'CONTACT_POINT_SYSTEM', function(resContactPointSystem){
											if(resContactPointSystem.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, contactPointUseCode, 'CONTACT_POINT_USE', function(resContactPointUse){
													if(resContactPointUse.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
														checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactPointValue, 'CONTACT_POINT', function(resContactPointValue){
															if(resContactPointValue.err_code == 0){
																//contact_point
																var contactPointId = 'cp' + uniqid.time();
											  				dataContactPoint = {
											  														"id": contactPointId,
											  														"system": contactPointSystemCode,
											  														"value": contactPointValue,
											  														"use": contactPointUseCode,
											  														"rank": contactPointRank,
											  														"period_start": contactPointPeriodStart,
											  														"period_end": contactPointPeriodEnd,
											  														"device_id": deviceId
											  													}

											  				ApiFHIR.post('contactPoint', {"apikey": apikey}, {body: dataContactPoint, json: true}, function(error, response, body){
											  					contactPoint = body;
											  					if(contactPoint.err_code == 0){
											  						res.json({"err_code": 0, "err_msg": "Device Contact has been add.", "data": contactPoint.data});
											  					}else{
											  						res.json(contactPoint);	
											  					}
											  				})
															}else{
																res.json({"err_code": 501, "err_msg": "Contact value already exist."});			
															}
														})	
													}else{
														res.json({"err_code": 504, "err_msg": "Contact Point Use Code not found"});
													}
												})
											}else{
												res.json({"err_code": 504, "err_msg": "Contact Point System Code not found"});		
											}
										})
									}else{
										res.json({"err_code": 503, "err_msg": "Person Id not found"});	
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
				device: function updateDevice(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var deviceId = req.params.device_id;

					var err_code = 0;
					var err_msg = "";

					var dataDevice = {};

					if(typeof req.body.status !== 'undefined'){
						var deviceStatus = req.body.status;
						if(validator.isEmpty(req.body.status)){
							err_code = 2;
							err_msg = "Status is required."
						}else{
							dataDevice.status = deviceStatus;
						}
					}else{
						deviceStatus = "";
					}

					if(typeof req.body.type !== 'undefined'){
						var deviceType = req.body.type;
						if(validator.isEmpty(req.body.type)){
							err_code = 2;
							err_msg = "Type is required."
						}else{
							dataDevice.type = deviceType;
						}
					}else{
						deviceType = "";
					}

					if(typeof req.body.lot_number !== 'undefined'){
						var deviceLotNumber = req.body.lot_number;
						if(validator.isEmpty(req.body.lot_number)){
							err_code = 2;
							err_msg = "Lot number is required."
						}else{
							dataDevice.lot_number = deviceLotNumber;
						}
					}

					if(typeof req.body.manufacturer !== 'undefined'){
						var deviceManufacturer = req.body.manufacturer;
						if(validator.isEmpty(req.body.manufacturer)){
							err_code = 2;
							err_msg = "Manufacturer is required."
						}else{
							dataDevice.manufacturer = deviceManufacturer;
						}
					}

					if(typeof req.body.manufacture_date !== 'undefined'){
						var deviceManufactureDate = req.body.manufacture_date;
						if(validator.isEmpty(req.body.manufacture_date)){
							err_code = 2;
							err_msg = "Manufacture Date is required."
						}else{
							if(!regex.test(deviceManufactureDate)){
								err_code = 2;
								err_msg = "Manufacture date invalid date format.";
							}else{
								dataDevice.manufacture_date = deviceManufactureDate;
							}
						}
					}

					if(typeof req.body.expiration_date !== 'undefined'){
						var deviceExpirationDate = req.body.expiration_date;
						if(validator.isEmpty(req.body.expiration_date)){
							err_code = 2;
							err_msg = "Expiration Date is required."
						}else{
							if(!regex.test(deviceExpirationDate)){
								err_code = 2;
								err_msg = "Expiration date invalid date format.";
							}else{
								dataDevice.expiration_date = deviceExpirationDate;
							}
						}
					}

					if(typeof req.body.model !== 'undefined'){
						var deviceModel = req.body.model;
						if(validator.isEmpty(req.body.model)){
							err_code = 2;
							err_msg = "Model is required."
						}else{
							dataDevice.model = deviceModel;
						}
					}

					if(typeof req.body.version !== 'undefined'){
						var deviceVersion = req.body.version;
						if(validator.isEmpty(req.body.version)){
							err_code = 2;
							err_msg = "Version is required."
						}else{
							dataDevice.version = deviceVersion;
						}
					}

					if(typeof req.body.patient_id !== 'undefined'){
						var devicePatient = req.body.patient_id;
						if(validator.isEmpty(req.body.patient_id)){
							err_code = 2;
							err_msg = "Patient ID is required."
						}else{
							dataDevice.patient_id = devicePatient;
						}
					}else{
						devicePatient = "";
					}

					if(typeof req.body.organization_id !== 'undefined'){
						var deviceOwner = req.body.organization_id;
						if(validator.isEmpty(req.body.organization_id)){
							err_code = 2;
							err_msg = "Organization ID is required."
						}else{
							dataDevice.organization_id = deviceOwner;
						}
					}else{
						deviceOwner = "";
					}

					if(typeof req.body.location_id !== 'undefined'){
						var deviceLocation = req.body.location_id;
						if(validator.isEmpty(req.body.location_id)){
							err_code = 2;
							err_msg = "Location ID is required."
						}else{
							dataDevice.location_id = deviceLocation;
						}
					}else{
						deviceLocation = "";
					}

					if(typeof req.body.uri !== 'undefined'){
						var deviceURI = req.body.uri;
						if(!validator.isURL(req.body.uri)){
							err_code = 2;
							err_msg = "Invalid format uri."
						}else{
							dataDevice.url = deviceURI;
						}
					}

					if(typeof req.body.note !== 'undefined'){
						var deviceNote = req.body.note;
						if(validator.isEmpty(req.body.note)){
							err_code = 2;
							err_msg = "Note is required."
						}else{
							dataDevice.note = deviceNote;
						}
					}

					if(typeof req.body.safety !== 'undefined'){
						var deviceSafety = req.body.safety;
						if(validator.isEmpty(req.body.safety)){
							err_code = 2;
							err_msg = "Safety is required."
						}else{
							dataDevice.safety = deviceSafety;
						}
					}else{
						deviceSafety = "";
					}

					
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	

								myEmitter.prependOnceListener('updateDevice', function(){
									//method, endpoint, params, options, callback
									ApiFHIR.put('device', {"apikey": apikey, "_id": deviceId}, {body: dataDevice, json:true}, function(error, response, body){	
								  	var device = body; //object
								  	//cek apakah ada error atau tidak
								  	if(device.err_code == 0){
								  		res.json({"err_code": 0, "err_msg": "Device has been update.", "data": [{"_id": deviceId}]});
								  	}else{
								  		res.json(device);	
								  	}
									})
								})

								myEmitter.prependOnceListener('checkDeviceID', function(){
									if(!validator.isEmpty(deviceId)){
										checkUniqeValue(apikey, "DEVICE_ID|" + deviceId, 'DEVICE', function(resDeviceID){
											if(resDeviceID.err_code > 0){
												myEmitter.emit('updateDevice');
											}else{
												res.json({"err_code": 508, "err_msg": "Device Id not found"});				
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkLocationID', function(){
									if(validator.isEmpty(deviceLocation)){
										myEmitter.emit('checkDeviceID');
									}else{
										checkUniqeValue(apikey, "LOCATION_ID|" + deviceLocation, 'LOCATION', function(resLocationID){
											if(resLocationID.err_code > 0){
												myEmitter.emit('checkDeviceID');
											}else{
												res.json({"err_code": 507, "err_msg": "Location Id not found"});				
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkOrganizationID', function(){
									if(validator.isEmpty(deviceOwner)){
										myEmitter.emit('checkLocationID');
									}else{
										checkUniqeValue(apikey, "ORGANIZATION_ID|" + deviceOwner, 'ORGANIZATION', function(resOrganizationID){
											if(resOrganizationID.err_code > 0){
												myEmitter.emit('checkLocationID');
											}else{
												res.json({"err_code": 506, "err_msg": "Organization Id not found"});		
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkPatientID', function(){
									if(validator.isEmpty(devicePatient)){
										myEmitter.emit('checkOrganizationID');
									}else{
										checkUniqeValue(apikey, "PATIENT_ID|" + devicePatient, 'PATIENT', function(resPatientID){
											if(resPatientID.err_code > 0){
												myEmitter.emit('checkOrganizationID');
											}else{
												res.json({"err_code": 505, "err_msg": "Patient Id not found"});
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkDeviceSafetyCode', function(){
									if(validator.isEmpty(deviceSafety)){
										myEmitter.emit('checkPatientID');
									}else{
										checkCode(apikey, deviceSafety, 'DEVICE_SAFETY', function(resDeviceSafetyCode){
											if(resDeviceSafetyCode.err_code > 0){
												myEmitter.emit('checkPatientID');
											}else{
												res.json({"err_code": 504, "err_msg": "Device Safety code not found"});		
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkDeviceTypeCode', function(){
									if(validator.isEmpty(deviceType)){
										myEmitter.emit('checkDeviceSafetyCode');
									}else{
										checkCode(apikey, deviceType, 'DEVICE_KIND', function(resDeviceKindCode){
											if(resDeviceKindCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkDeviceSafetyCode');
											}else{
												res.json({"err_code": 503, "err_msg": "Device Type code not found"});
											}
										})
									}									
								})

								if(validator.isEmpty(deviceStatus)){
									myEmitter.emit('checkDeviceTypeCode');
								}else{
									checkCode(apikey, deviceStatus, 'DEVICE_STATUS', function(resDeviceStatusCode){
										if(resDeviceStatusCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											myEmitter.emit('checkDeviceTypeCode');
										}else{
											res.json({"err_code": 502, "err_msg": "Device Status code not found"});			
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
				deviceUdi: function updateDeviceUdi(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var deviceId = req.params.device_id;
					var deviceUdiId = req.params.udi_id;

					var err_code = 0;
					var err_msg = "";

					var dataDeviceUdi = {};

					//input check 
					if(typeof deviceId !== 'undefined'){
						if(validator.isEmpty(deviceId)){
							err_code = 2;
							err_msg = "Device id is required";
						}
					}else{
						err_code = 1;
						err_msg = "Device id is required";
					}

					if(typeof deviceUdiId !== 'undefined'){
						if(validator.isEmpty(deviceUdiId)){
							err_code = 2;
							err_msg = "Udi id is required";
						}
					}else{
						err_code = 1;
						err_msg = "Udi id is required";
					}

					if(typeof req.body.name !== 'undefined'){
						var udiName = req.body.name;
						if(validator.isEmpty(req.body.name)){
							err_code = 2;
							err_msg = "Udi name is required."
						}else{
							dataDeviceUdi.name = udiName;
						}
					}

					if(typeof req.body.jurisdiction !== 'undefined'){
						var udiJurisdiction = req.body.jurisdiction;
						if(!validator.isURL(req.body.jurisdiction)){
							err_code = 2;
							err_msg = "Jurisdiction is uri format."
						}else{
							dataDeviceUdi.jurisdiction = udiJurisdiction;
						}
					}

					if(typeof req.body.carrier_hrf !== 'undefined'){
						var udiCarrierHRF = req.body.carrier_hrf;
						if(validator.isEmpty(req.body.carrier_hrf)){
							err_code = 2;
							err_msg = "Carrier HRF is required."
						}else{
							dataDeviceUdi.carrier_hrf = udiCarrierHRF;
						}
					}else{
						udiCarrierHRF = "";
					}

					if(typeof req.body.carrier_aidc !== 'undefined'){
						var udiCarrierAIDC = req.body.carrier_aidc;
						if(validator.isEmpty(req.body.carrier_aidc)){
							err_code = 2;
							err_msg = "Carrier AIDC is required."
						}else{
							dataDeviceUdi.carrier_aidc = udiCarrierAIDC;
						}
					}else{
						udiCarrierAIDC = "";
					}

					if(typeof req.body.issuer !== 'undefined'){
						var udiIssuer = req.body.issuer;
						if(!validator.isURL(req.body.issuer)){
							err_code = 2;
							err_msg = "Issuer is uri format."
						}else{
							dataDeviceUdi.issuer = udiIssuer;
						}
					}

					if(typeof req.body.entry_type !== 'undefined'){
						var udiEntryType = req.body.entry_type;
						if(validator.isEmpty(req.body.entry_type)){
							err_code = 2;
							err_msg = "Entry type is required."
						}else{
							dataDeviceUdi.entry_type = udiEntryType;
						}
					}else{
						udiEntryType = "";
					}
					
					
					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	

								myEmitter.prependOnceListener('updateDeviceUdi', function(){
									//method, endpoint, params, options, callback
									ApiFHIR.put('deviceUdi', {"apikey": apikey, "_id": deviceUdiId}, {body: dataDeviceUdi, json:true}, function(error, response, body){	
								  	var device = body; //object
								  	//cek apakah ada error atau tidak
								  	if(device.err_code == 0){
								  		res.json({"err_code": 0, "err_msg": "Udi has been update.", "data": [{"_id": deviceUdiId}]});
								  	}else{
								  		res.json(device);	
								  	}
									})
								})

								myEmitter.prependOnceListener('checkUdiID', function(){
									if(validator.isEmpty(deviceUdiId)){
										myEmitter.emit('updateDeviceUdi');
									}else{
										checkUniqeValue(apikey, "DEVICE_UDI_ID|" + deviceUdiId, 'DEVICE_UDI', function(resDeviceUdiID){
											if(resDeviceUdiID.err_code > 0){
												myEmitter.emit('updateDeviceUdi');
											}else{
												res.json({"err_code": 502, "err_msg": "Udi Id not found"});				
											}
										})
									}									
								})

								myEmitter.prependOnceListener('checkDeviceID', function(){
									if(validator.isEmpty(deviceId)){
										myEmitter.emit('checkUdiID');
									}else{
										checkUniqeValue(apikey, "DEVICE_ID|" + deviceId, 'DEVICE', function(resDeviceID){
											if(resDeviceID.err_code > 0){
												myEmitter.emit('checkUdiID');
											}else{
												res.json({"err_code": 502, "err_msg": "Device Id not found"});				
											}
										})
									}									
								})

								if(validator.isEmpty(udiEntryType)){
									myEmitter.emit('checkDeviceID');
								}else{
									checkCode(apikey, udiEntryType, 'UDI_ENTRY_TYPE', function(resUdiEntryTypeCode){
										if(resUdiEntryTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											myEmitter.emit('checkDeviceID');
										}else{
											res.json({"err_code": 501, "err_msg": "Udi Entry Type code not found"});			
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
				deviceContact: function updateDeviceContact(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var deviceId = req.params.device_id;
					var contactPointId = req.params.contact_id;

					var err_code = 0;
					var err_msg = "";
					var dataContactPoint = {};

					//input check 
					if(typeof deviceId !== 'undefined'){
						if(validator.isEmpty(deviceId)){
							err_code = 2;
							err_msg = "Device id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Device id is required";
					}

					if(typeof contactPointId !== 'undefined'){
						if(validator.isEmpty(contactPointId)){
							err_code = 2;
							err_msg = "Contact id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Contact id is required";
					}

					//telecom
					if(typeof req.body.system !== 'undefined'){
						contactPointSystemCode =  req.body.system.trim().toLowerCase();
						if(validator.isEmpty(contactPointSystemCode)){
							err_code = 2;
							err_msg = "Contact Point System is required";
						}else{
							dataContactPoint.system = contactPointSystemCode;
						}
					}else{
						contactPointSystemCode = "";
					}

					//telecom value
					if(typeof req.body.value !== 'undefined'){
						contactPointValue =  req.body.value;
						if(contactPointSystemCode == 'email'){
							if(!validator.isEmail(contactPointValue)){
								err_code = 2;
								err_msg = "Contact Point Value is invalid email format";
							}else{
								dataContactPoint.value = contactPointValue;
							}
						}else{
							if(validator.isEmpty(contactPointValue)){
								err_code = 2;
								err_msg = "Contact Point Value is required";
							}else{
								dataContactPoint.value = contactPointValue;
							}
						}
					}else{
						contactPointValue = "";
					}

					//telecom use code
					if(typeof req.body.use !== 'undefined'){
						contactPointUseCode =  req.body.use.trim().toLowerCase();
						if(validator.isEmpty(contactPointUseCode)){
							err_code = 2;
							err_msg = "Telecom Use Code is required";
						}else{
							dataContactPoint.use = contactPointUseCode;
						}
					}else{
						contactPointUseCode = "";
					} 

					//contact poin rank
					if(typeof req.body.rank !== 'undefined'){
						contactPointRank =  req.body.rank;
						if(!validator.isInt(contactPointRank)){
							err_code = 2;
							err_msg = "Telecom Rank must be number";
						}else{
							dataContactPoint.rank = contactPointRank;
						}
					}

					//contact point period
					if(typeof req.body.period !== 'undefined'){
						var period = req.body.period;
						if(period.indexOf("to") > 0){
							arrPeriod = period.split("to");
							contactPointPeriodStart = arrPeriod[0];
							contactPointPeriodEnd = arrPeriod[1];
							
							if(!regex.test(contactPointPeriodStart) && !regex.test(contactPointPeriodEnd)){
								err_code = 2;
								err_msg = "Telecom Period invalid date format.";
							}else{
								dataContactPoint.period_start = contactPointPeriodStart;
								dataContactPoint.period_end = contactPointPeriodEnd;
							}	
						}else{
							contactPointPeriodStart = "";
							contactPointPeriodEnd = "";
						}
					} 

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								myEmitter.prependOnceListener('checkDeviceID', function(){
									checkUniqeValue(apikey, "DEVICE_ID|" + deviceId, 'DEVICE', function(resDeviceID){
										if(resDeviceID.err_code > 0){
											checkUniqeValue(apikey, "CONTACT_POINT_ID|" + contactPointId, 'CONTACT_POINT', function(resContactPointID){
												if(resContactPointID.err_code > 0){
													ApiFHIR.put('contactPoint', {"apikey": apikey, "_id": contactPointId, "dr": "DEVICE_ID|"+deviceId}, {body: dataContactPoint, json: true}, function(error, response, body){
								  					contactPoint = body;
								  					if(contactPoint.err_code > 0){
								  						res.json(contactPoint);	
								  					}else{
								  						res.json({"err_code": 0, "err_msg": "Device contact has been update.", "data": contactPoint.data});
								  					}
								  				})
												}else{
													res.json({"err_code": 505, "err_msg": "Contact Id not found"});		
												}
											})
										}else{
											res.json({"err_code": 504, "err_msg": "Device Id not found"});		
										}
									})
								})

								myEmitter.prependOnceListener('checkContactPointValue', function(){
									if(validator.isEmpty(contactPointValue)){
										myEmitter.emit('checkDeviceID');
									}else{
										checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactPointValue, 'CONTACT_POINT', function(resContactPointValue){
											if(resContactPointValue.err_code == 0){
												myEmitter.emit('checkDeviceID');				
											}else{
												res.json({"err_code": 503, "err_msg": "Contact value already exist."});	
											}
										})
									}
								})

								myEmitter.prependOnceListener('checkContactPointUse', function(){
									if(validator.isEmpty(contactPointUseCode)){
										myEmitter.emit('checkContactPointValue');
									}else{
										checkCode(apikey, contactPointUseCode, 'CONTACT_POINT_USE', function(resContactPointUse){
											if(resContactPointUse.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkContactPointValue');
											}else{
												res.json({"err_code": 502, "err_msg": "Contact Point Use Code not found"});		
											}
										})
									}
								})

								if(validator.isEmpty(contactPointSystemCode)){
									myEmitter.emit('checkContactPointUse');	
								}else{
									checkCode(apikey, contactPointSystemCode, 'CONTACT_POINT_SYSTEM', function(resContactPointSystem){
										if(resContactPointSystem.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											myEmitter.emit('checkContactPointUse');
										}else{
											res.json({"err_code": 501, "err_msg": "Contact Point System Code not found"});
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