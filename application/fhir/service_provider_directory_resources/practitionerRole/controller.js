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
		practitionerRole : function getPractitionerRole(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			//params from query string
			var practitionerRoleId = req.query._id;
			var practitionerRoleActive = req.query.active;
			var practitionerRoleCode = req.query.code;
			var practitionerRolePeriod = req.query.date;
			var practitionerRoleSpecialty = req.query.specialty;
			var endpointId = req.query.endpoint;
			var identifierValue = req.query.identifier;
			var locationId = req.query.location;
			var organizationId = req.query.organization;
			var contactPointPhone = req.query.phone;
			var contactPointEmail = req.query.email;
			var contactPointValue = req.query.telecom;
			var practitionerId = req.query.practitioner;
			var healthcareServiceId = req.query.service;

			var qString = {};

			if(typeof practitionerRoleId !== 'undefined'){
				if(!validator.isEmpty(practitionerRoleId)){
					qString._id = practitionerRoleId; 
				}else{
					res.json({"err_code": 1, "err_msg": "practitioner role id is required."});
				}
			}

			if(typeof practitionerRoleActive !== 'undefined'){
				if(!validator.isEmpty(practitionerRoleActive)){
					qString.active = practitionerRoleActive; 
				}else{
					res.json({"err_code": 1, "err_msg": "practitioner role active is required."});
				}
			}

			if(typeof practitionerRoleCode !== 'undefined'){
				if(!validator.isEmpty(practitionerRoleCode)){
					qString.code = practitionerRoleCode; 
				}else{
					res.json({"err_code": 1, "err_msg": "practitioner role code is required."});
				}
			}

			//practitioner role period start
			if(typeof practitionerRolePeriod !== 'undefined'){
				if(!validator.isEmpty(practitionerRoleCode)){
					period = practitionerRolePeriod;
					if(period.indexOf("to") > 0){
						arrPeriod = period.split("to");
						practitionerRolePeriodStart = arrPeriod[0];
						practitionerRolePeriodEnd = arrPeriod[1];

						if(!regex.test(practitionerRolePeriodStart) && !regex.test(practitionerRolePeriodEnd)){
							err_code = 2;
							err_msg = "Practitioner RolePeriod Period invalid date format.";
						}
						qString.periodStart = practitionerRolePeriodStart;
						qString.periodEnd = practitionerRolePeriodEnd;
					}
				}else{
					res.json({"err_code": 1, "err_msg": "practitioner role code is required."});
				}  
			}

			if(typeof practitionerRoleSpecialty !== 'undefined'){
				if(!validator.isEmpty(practitionerRoleSpecialty)){
					qString.specialty = practitionerRoleSpecialty;
				}else{
					res.json({"err_code": 1, "err_msg": "practitioner role specialty is empty."});
				}
			}

			if(typeof endpointId !== 'undefined'){
				if(!validator.isEmpty(endpointId)){
					qString.endpoint_id = endpointId;
				}else{
					res.json({"err_code": 1, "err_msg": "endpoint is empty."});
				}
			}

			if(typeof identifierValue !== 'undefined'){
				if(!validator.isEmpty(identifierValue)){
					identifierValue = decodeURI(identifierValue);
					if(identifierValue.indexOf(" ") > 0){
						qString.identifier_value = identifierValue.replace(/ /g, "nonbreaking_space"); 
					}else{
						qString.identifier_value = identifierValue; 	
					}
				}else{
					res.json({"err_code": 1, "err_msg": "identifier value is empty."});
				}
			}

			if(typeof locationId !== 'undefined'){
				if(!validator.isEmpty(locationId)){
					qString.location_id = locationId; 
				}else{
					res.json({"err_code": 1, "err_msg": "location id is required."});
				}
			}

			if(typeof organizationId !== 'undefined'){
				if(!validator.isEmpty(organizationId)){
					qString.organization_id = organizationId; 
				}else{
					res.json({"err_code": 1, "err_msg": "organization id is required."});
				}
			}

			if(typeof practitionerId !== 'undefined'){
				if(!validator.isEmpty(practitionerId)){
					qString.practitioner_id = practitionerId; 
				}else{
					res.json({"err_code": 1, "err_msg": "practitioner id is required."});
				}
			}

			if(typeof healthcareServiceId !== 'undefined'){
				if(!validator.isEmpty(healthcareServiceId)){
					qString.healthcare_service_id = healthcareServiceId; 
				}else{
					res.json({"err_code": 1, "err_msg": "healthcare service id is required."});
				}
			}

			if(typeof contactPointPhone !== 'undefined'){
				if(!validator.isEmpty(contactPointPhone)){
					qString.contact_point_phone = contactPointPhone; 
				}else{
					res.json({"err_code": 1, "err_msg": "contact point phone is required."});
				}
			}

			if(typeof contactPointEmail !== 'undefined'){
				if(!validator.isEmpty(contactPointEmail)){
					qString.contact_point_email = contactPointEmail; 
				}else{
					res.json({"err_code": 1, "err_msg": "contact point email is required."});
				}
			}

			if(typeof contactPointValue !== 'undefined'){
				if(!validator.isEmpty(contactPointValue)){
					qString.contact_point_value = contactPointValue; 
				}else{
					res.json({"err_code": 1, "err_msg": "contact point value is required."});
				}
			}



			seedPhoenixFHIR.path.GET = {
				"PractitionerRole" : {
					"location": "%(apikey)s/PractitionerRole",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('PractitionerRole', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var practitionerRole = JSON.parse(body); //object
							//console.log(practitionerRole);
							//cek apakah ada error atau tidak
							if(practitionerRole.err_code == 0){
								//cek jumdata dulu
								if(practitionerRole.data.length > 0){
									newPractitionerRole = [];
									for(i=0; i < practitionerRole.data.length; i++){
										myEmitter.once("getIdentifier", function(practitionerRole, index, newPractitionerRole, countPractitionerRole){
														//get identifier
														qString = {};
														qString.practitioner_role_id = practitionerRole.id;
														seedPhoenixFHIR.path.GET = {
															"Identifier" : {
																"location": "%(apikey)s/Identifier",
																"query": qString
															}
														}
														var ApiFHIR = new Apiclient(seedPhoenixFHIR);
														ApiFHIR.get('Identifier', {"apikey": apikey}, {}, function(error, response, body){
															identifier = JSON.parse(body);
															if(identifier.err_code == 0){
																var objectPractitionerRole = {};
																objectPractitionerRole.resourceType = practitionerRole.resourceType;
																objectPractitionerRole.id = practitionerRole.id;
																objectPractitionerRole.identifier = identifier.data;
																objectPractitionerRole.active = practitionerRole.active;
																objectPractitionerRole.period = practitionerRole.period;
																if(practitionerRole.practitioner !== 'null'){
																	practitioner = host + ":" + port + "/" + apikey + "/practitioner?_id=" + practitionerRole.practitioner;
																} else {
																	practitioner = practitionerRole.practitioner;
																}
																objectPractitionerRole.practitioner = practitioner;
																if(practitionerRole.organization !== 'null'){
																	organization = host + ":" + port + "/" + apikey + "/organization?_id=" + practitionerRole.organization;
																} else {
																	organization = practitionerRole.organization;
																}
																objectPractitionerRole.organization = organization;
																objectPractitionerRole.code = practitionerRole.code;
																objectPractitionerRole.specialty = practitionerRole.specialty;
																//objectPractitionerRole.location = practitionerRole.location;
																//objectPractitionerRole.healthcareService = practitionerRole.healthcareService;
																objectPractitionerRole.practitioner_role_availability_exceptions = practitionerRole.practitioner_role_availability_exceptions;
																//objectPractitionerRole.endpoint = practitionerRole.endpoint;

																newPractitionerRole[index] = objectPractitionerRole

																myEmitter.once('getContactPoint', function(practitionerRole, index, newPractitionerRole, countPractitionerRole){
																				qString = {};
																				qString.practitioner_role_id = practitionerRole.id;
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
																						var objectPractitionerRole = {};
																						objectPractitionerRole.resourceType = practitionerRole.resourceType;
																						objectPractitionerRole.id = practitionerRole.id;
																						objectPractitionerRole.identifier = practitionerRole.identifier;
																						objectPractitionerRole.active = practitionerRole.active;
																						objectPractitionerRole.period = practitionerRole.period;
																						objectPractitionerRole.practitioner = practitionerRole.practitioner;
																						objectPractitionerRole.organization = practitionerRole.organization;
																						objectPractitionerRole.code = practitionerRole.code;
																						objectPractitionerRole.specialty = practitionerRole.specialty;
																						objectPractitionerRole.telecom = contactPoint.data;
																						objectPractitionerRole.practitioner_role_availability_exceptions = practitionerRole.practitioner_role_availability_exceptions;
																						
																						newPractitionerRole[index] = objectPractitionerRole			

																						myEmitter.once('getAvailableTime', function(practitionerRole, index, newPractitionerRole, countPractitionerRole){
																							qString = {};
																							qString.practitioner_role_id = practitionerRole.id;
																							seedPhoenixFHIR.path.GET = {
																								"AvailableTime" : {
																									"location": "%(apikey)s/AvailableTime",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('AvailableTime', {"apikey": apikey}, {}, function(error, response, body){
																								availableTime = JSON.parse(body);
																								if(availableTime.err_code == 0){
																									var objectPractitionerRole = {};
																									objectPractitionerRole.resourceType = practitionerRole.resourceType;
																									objectPractitionerRole.id = practitionerRole.id;
																									objectPractitionerRole.identifier = practitionerRole.identifier;
																									objectPractitionerRole.active = practitionerRole.active;
																									objectPractitionerRole.period = practitionerRole.period;
																									objectPractitionerRole.practitioner = practitionerRole.practitioner;
																									objectPractitionerRole.organization = practitionerRole.organization;
																									objectPractitionerRole.code = practitionerRole.code;
																									objectPractitionerRole.specialty = practitionerRole.specialty;
																									objectPractitionerRole.telecom = practitionerRole.telecom;
																									objectPractitionerRole.availableTime = availableTime.data;
																									objectPractitionerRole.practitioner_role_availability_exceptions = practitionerRole.practitioner_role_availability_exceptions;
																									newPractitionerRole[index] = objectPractitionerRole			

																									myEmitter.once('getNotAvailable', function(practitionerRole, index, newPractitionerRole, countPractitionerRole){
																										qString = {};
																										qString.practitioner_role_id = practitionerRole.id;
																										seedPhoenixFHIR.path.GET = {
																											"NotAvailable" : {
																												"location": "%(apikey)s/NotAvailable",
																												"query": qString
																											}
																										}

																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																										ApiFHIR.get('NotAvailable', {"apikey": apikey}, {}, function(error, response, body){
																											notAvailable = JSON.parse(body);
																											if(notAvailable.err_code == 0){
																												var objectPractitionerRole = {};
																												objectPractitionerRole.resourceType = practitionerRole.resourceType;
																												objectPractitionerRole.id = practitionerRole.id;
																												objectPractitionerRole.identifier = practitionerRole.identifier;
																												objectPractitionerRole.active = practitionerRole.active;
																												objectPractitionerRole.period = practitionerRole.period;
																												objectPractitionerRole.practitioner = practitionerRole.practitioner;
																												objectPractitionerRole.organization = practitionerRole.organization;
																												objectPractitionerRole.code = practitionerRole.code;
																												objectPractitionerRole.specialty = practitionerRole.specialty;
																												objectPractitionerRole.telecom = practitionerRole.telecom;
																												objectPractitionerRole.availableTime = practitionerRole.availableTime;
																												objectPractitionerRole.notAvailable = notAvailable.data;
																												objectPractitionerRole.practitioner_role_availability_exceptions = practitionerRole.practitioner_role_availability_exceptions;
																												newPractitionerRole[index] = objectPractitionerRole			
																												/*if(index == countPractitionerRole -1 ){
																													res.json({"err_code": 0, "data":newPractitionerRole});				
																												}*/
																												
																												myEmitter.once('getLocation', function(practitionerRole, index, newPractitionerRole, countPractitionerRole){
																													qString = {};
																													qString.practitioner_role_id = practitionerRole.id;
																													seedPhoenixFHIR.path.GET = {
																														"PractitionerRoleLocation" : {
																															"location": "%(apikey)s/PractitionerRole/Location",
																															"query": qString
																														}
																													}

																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																													ApiFHIR.get('PractitionerRoleLocation', {"apikey": apikey}, {}, function(error, response, body){
																														practitionerRoleLocation = JSON.parse(body);
																														if(practitionerRoleLocation.err_code == 0){
																															var objectPractitionerRole = {};
																															objectPractitionerRole.resourceType = practitionerRole.resourceType;
																															objectPractitionerRole.id = practitionerRole.id;
																															objectPractitionerRole.identifier = practitionerRole.identifier;
																															objectPractitionerRole.active = practitionerRole.active;
																															objectPractitionerRole.period = practitionerRole.period;
																															objectPractitionerRole.practitioner = practitionerRole.practitioner;
																															objectPractitionerRole.organization = practitionerRole.organization;
																															objectPractitionerRole.code = practitionerRole.code;
																															objectPractitionerRole.specialty = practitionerRole.specialty;
																															objectPractitionerRole.location = practitionerRoleLocation.data;
																															objectPractitionerRole.telecom = practitionerRole.telecom;
																															objectPractitionerRole.availableTime = practitionerRole.availableTime;
																															objectPractitionerRole.notAvailable = practitionerRole.notAvailable;
																															objectPractitionerRole.practitioner_role_availability_exceptions = practitionerRole.practitioner_role_availability_exceptions;
																															newPractitionerRole[index] = objectPractitionerRole			
																															/*if(index == countPractitionerRole -1 ){
																																res.json({"err_code": 0, "data":newPractitionerRole});				
																															}*/
																															
																															myEmitter.once('getHealthcareService', function(practitionerRole, index, newPractitionerRole, countPractitionerRole){
																																qString = {};
																																qString.practitioner_role_id = practitionerRole.id;
																																seedPhoenixFHIR.path.GET = {
																																	"PractitionerRoleHealthcareService" : {
																																		"location": "%(apikey)s/PractitionerRole/HealthcareService",
																																		"query": qString
																																	}
																																}

																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																ApiFHIR.get('PractitionerRoleHealthcareService', {"apikey": apikey}, {}, function(error, response, body){
																																	PractitionerRoleHealthcareService = JSON.parse(body);
																																	//console.log(PractitionerRoleHealthcareService);
																																	if(PractitionerRoleHealthcareService.err_code == 0){
																																		var objectPractitionerRole = {};
																																		objectPractitionerRole.resourceType = practitionerRole.resourceType;
																																		objectPractitionerRole.id = practitionerRole.id;
																																		objectPractitionerRole.identifier = practitionerRole.identifier;
																																		objectPractitionerRole.active = practitionerRole.active;
																																		objectPractitionerRole.period = practitionerRole.period;
																																		objectPractitionerRole.practitioner = practitionerRole.practitioner;
																																		objectPractitionerRole.organization = practitionerRole.organization;
																																		objectPractitionerRole.code = practitionerRole.code;
																																		objectPractitionerRole.specialty = practitionerRole.specialty;
																																		objectPractitionerRole.location = practitionerRole.location;
																																		objectPractitionerRole.healthcareService = PractitionerRoleHealthcareService.data;
																																		objectPractitionerRole.telecom = practitionerRole.telecom;
																																		objectPractitionerRole.availableTime = practitionerRole.availableTime;
																																		objectPractitionerRole.notAvailable = practitionerRole.notAvailable;
																																		objectPractitionerRole.practitioner_role_availability_exceptions = practitionerRole.practitioner_role_availability_exceptions;
																																		newPractitionerRole[index] = objectPractitionerRole			
																																		myEmitter.once('getEndpoint', function(practitionerRole, index, newPractitionerRole, countPractitionerRole){
																																qString = {};
																																qString.practitioner_role_id = practitionerRole.id;
																																seedPhoenixFHIR.path.GET = {
																																	"PractitionerRoleEndpoint" : {
																																		"location": "%(apikey)s/PractitionerRole/Endpoint",
																																		"query": qString
																																	}
																																}

																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																ApiFHIR.get('PractitionerRoleEndpoint', {"apikey": apikey}, {}, function(error, response, body){
																																	PractitionerRoleEndpoint = JSON.parse(body);
																																	//console.log(PractitionerRoleEndpoint);
																																	if(PractitionerRoleEndpoint.err_code == 0){
																																		var objectPractitionerRole = {};
																																		objectPractitionerRole.resourceType = practitionerRole.resourceType;
																																		objectPractitionerRole.id = practitionerRole.id;
																																		objectPractitionerRole.identifier = practitionerRole.identifier;
																																		objectPractitionerRole.active = practitionerRole.active;
																																		objectPractitionerRole.period = practitionerRole.period;
																																		objectPractitionerRole.practitioner = practitionerRole.practitioner;
																																		objectPractitionerRole.organization = practitionerRole.organization;
																																		objectPractitionerRole.code = practitionerRole.code;
																																		objectPractitionerRole.specialty = practitionerRole.specialty;
																																		objectPractitionerRole.location = practitionerRole.location;
																																		objectPractitionerRole.healthcareService = practitionerRole.healthcareService;
																																		objectPractitionerRole.telecom = practitionerRole.telecom;
																																		objectPractitionerRole.availableTime = practitionerRole.availableTime;
																																		objectPractitionerRole.notAvailable = practitionerRole.notAvailable;	objectPractitionerRole.practitioner_role_availability_exceptions = practitionerRole.practitioner_role_availability_exceptions;
																																		objectPractitionerRole.endpoint = PractitionerRoleEndpoint.data;
																																		newPractitionerRole[index] = objectPractitionerRole			
																																		if(index == countPractitionerRole -1 ){
																																			res.json({"err_code": 0, "data":newPractitionerRole});				
																																		}
																																	}else{
																																		res.json(PractitionerRoleEndpoint);			
																																	}
																																})
																															})
																															myEmitter.emit('getEndpoint', objectPractitionerRole, index, newPractitionerRole, countPractitionerRole);
																																	}else{
																																		res.json(PractitionerRoleHealthcareService);			
																																	}
																																})
																															})
																															myEmitter.emit('getHealthcareService', objectPractitionerRole, index, newPractitionerRole, countPractitionerRole);
																															
																														}else{
																															res.json(practitionerRoleLocation);			
																														}
																													})
																												})
																												myEmitter.emit('getLocation', objectPractitionerRole, index, newPractitionerRole, countPractitionerRole);
																												
																											}else{
																												res.json(notAvailable);			
																											}
																										})
																									})
																									myEmitter.emit('getNotAvailable', objectPractitionerRole, index, newPractitionerRole, countPractitionerRole);
																								}else{
																									res.json(availableTime);			
																								}
																							})
																						})
																						myEmitter.emit('getAvailableTime', objectPractitionerRole, index, newPractitionerRole, countPractitionerRole);


																					}else{
																						res.json(contactPoint);			
																					}
																				})
																			})
																myEmitter.emit('getContactPoint', objectPractitionerRole, index, newPractitionerRole, countPractitionerRole);
															}else{
																res.json(identifier);
															}
														})
													})
										myEmitter.emit("getIdentifier", practitionerRole.data[i], i, newPractitionerRole, practitionerRole.data.length);
										//res.json({"err_code": 0, "err_msg": "Practitioner is not empty."});		
									}
									 //res.json({"err_code": 0, "data":practitioner.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Practitioner Role is empty."});	
								}
							}else{
								res.json(practitionerRole);
							}
						}
					});
				}else{
					result.err_code = 500;
					res.json(result);
				}
			});	
		},
		availableTime : function getAvailableTime(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			var practitionerRoleId = req.params.practitioner_role_id;
			var availableTimeId = req.params.available_time_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleID){
						if(resPractitionerRoleID.err_code > 0){
							if(typeof availableTimeId !== 'undefined' && !validator.isEmpty(availableTimeId)){
								checkUniqeValue(apikey, "AVAILABLE_TIME_ID|" + availableTimeId, 'AVAILABLE_TIME', function(resAvailableTimeId){
									if(resAvailableTimeId.err_code > 0){
										//get identifier
										qString = {};
										qString.practitioner_role_id = practitionerRoleId;
										qString._id = availableTimeId;
										seedPhoenixFHIR.path.GET = {
											"availableTime" : {
												"location": "%(apikey)s/availableTime",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('availableTime', {"apikey": apikey}, {}, function(error, response, body){
											availableTime = JSON.parse(body);
											if(availableTime.err_code == 0){
												res.json({"err_code": 0, "data":availableTime.data});	
											}else{
												res.json(availableTime);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Available Time Id not found"});		
									}
								})
							}else{
								//get identifier
								qString = {};
								qString.practitioner_role_id = practitionerRoleId;
								seedPhoenixFHIR.path.GET = {
									"availableTime" : {
										"location": "%(apikey)s/availableTime",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('availableTime', {"apikey": apikey}, {}, function(error, response, body){
									availableTime = JSON.parse(body);
									if(availableTime.err_code == 0){
										res.json({"err_code": 0, "data":availableTime.data});	
									}else{
										res.json(availableTime);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Practitioner Role Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
    notAvailable : function getNotAvailable(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			var practitionerRoleId = req.params.practitioner_role_id;
			var notAvailableId = req.params.not_available_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleID){
						if(resPractitionerRoleID.err_code > 0){
							if(typeof notAvailableId !== 'undefined' && !validator.isEmpty(notAvailableId)){
								checkUniqeValue(apikey, "NOT_AVAILABLE_ID|" + notAvailableId, 'NOT_AVAILABLE', function(resNotAvailableId){
									if(resNotAvailableId.err_code > 0){
										//get identifier
										qString = {};
										qString.practitioner_role_id = practitionerRoleId;
										qString._id = notAvailableId;
										seedPhoenixFHIR.path.GET = {
											"notAvailable" : {
												"location": "%(apikey)s/notAvailable",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('notAvailable', {"apikey": apikey}, {}, function(error, response, body){
											notAvailable = JSON.parse(body);
											if(notAvailable.err_code == 0){
												res.json({"err_code": 0, "data":notAvailable.data});	
											}else{
												res.json(notAvailable);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Not Available Id not found"});		
									}
								})
							}else{
								//get identifier
								qString = {};
								qString.practitioner_role_id = practitionerRoleId;
								seedPhoenixFHIR.path.GET = {
									"notAvailable" : {
										"location": "%(apikey)s/notAvailable",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('notAvailable', {"apikey": apikey}, {}, function(error, response, body){
									notAvailable = JSON.parse(body);
									if(notAvailable.err_code == 0){
										res.json({"err_code": 0, "data":notAvailable.data});	
									}else{
										res.json(notAvailable);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Practitioner Role Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		identifier: function getIdentifier(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var practitionerRoleId = req.params.practitioner_role_id;
			var identifierId = req.params.identifier_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleID){
						if(resPractitionerRoleID.err_code > 0){
							if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
								checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
									if(resIdentifierID.err_code > 0){
										//get identifier
										qString = {};
										qString.practitioner_role_id = practitionerRoleId;
										qString._id = identifierId;
										seedPhoenixFHIR.path.GET = {
											"Identifier" : {
												"location": "%(apikey)s/Identifier",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('Identifier', {"apikey": apikey}, {}, function(error, response, body){
											identifier = JSON.parse(body);
											if(identifier.err_code == 0){
												res.json({"err_code": 0, "data":identifier.data});	
											}else{
												res.json(identifier);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Identifier Id not found"});		
									}
								})
							}else{
								//get identifier
								qString = {};
								qString.practitioner_role_id = practitionerRoleId;
								seedPhoenixFHIR.path.GET = {
									"Identifier" : {
										"location": "%(apikey)s/Identifier",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('Identifier', {"apikey": apikey}, {}, function(error, response, body){
									identifier = JSON.parse(body);
									if(identifier.err_code == 0){
										res.json({"err_code": 0, "data":identifier.data});	
									}else{
										res.json(identifier);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Practioner Role Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		telecom: function getTelecom(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var practitionerRoleId = req.params.practitioner_role_id;
			var contactPointId = req.params.contact_point_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleID){
						if(resPractitionerRoleID.err_code > 0){
							if(typeof contactPointId !== 'undefined' && !validator.isEmpty(contactPointId)){
								checkUniqeValue(apikey, "CONTACT_POINT_ID|" + contactPointId, 'CONTACT_POINT', function(resTelecomID){
									if(resTelecomID.err_code > 0){
										qString = {};
										qString.practitioner_role_id = practitionerRoleId;
										qString._id = contactPointId;
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
												res.json({"err_code": 0, "data":contactPoint.data});	
											}else{
												res.json(contactPoint);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Telecom Id not found"});		
									}
								})
							}else{
								qString = {};
								qString.practitioner_role_id = practitionerRoleId;
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
										res.json({"err_code": 0, "data":contactPoint.data});	
									}else{
										res.json(contactPoint);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Practitioner Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		}
	},
	post:{ 
		practitionerRole : function postPractitionerRole(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			var err_code = 0;
			var err_msg = "";
	//console.log(req.body);
			//input check 
			//identifier
			if(typeof req.body.identifier.use !== 'undefined'){
				identifierUseCode =  req.body.identifier.use.trim().toLowerCase();
				if(validator.isEmpty(identifierUseCode)){
					err_code = 2;
					err_msg = "Identifier Use is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'use' in json identifier request.";
			} 

			//type code
			if(typeof req.body.identifier.type !== 'undefined'){
				identifierTypeCode =  req.body.identifier.type.trim().toUpperCase();
				if(validator.isEmpty(identifierTypeCode)){
					err_code = 2;
					err_msg = "Identifier Type is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json identifier request.";
			} 

			//identifier uniqe value
			if(typeof req.body.identifier.value !== 'undefined'){
				identifierValue =  req.body.identifier.value.trim();
				if(validator.isEmpty(identifierValue)){
					err_code = 2;
					err_msg = "Identifier Value is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value' in json identifier request.";
			}

			//identifier period start
			if(typeof req.body.identifier.period !== 'undefined'){
				period = req.body.identifier.period;
				if(period.indexOf("to") > 0){
					arrPeriod = period.split("to");
					identifierPeriodStart = arrPeriod[0];
					identifierPeriodEnd = arrPeriod[1];

					if(!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)){
						err_code = 2;
						err_msg = "Identifier Period invalid date format.";
					}	
				}

			}else{
				err_code = 1;
				err_msg = "Please add key 'period' in json identifier request.";
			}  

			//set by sistem
			//var identifierSystem = host + ':' + port + '/' + apikey + 'identifier/value/' + identifierValue 

			//practioner role active
			if(typeof req.body.active !== 'undefined'){
				practionerRoleActive =  req.body.active.trim().toLowerCase();
				if(validator.isEmpty(practionerRoleActive)){
					err_code = 2;
					err_msg = "practioner role active is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'active' in json practioner role request.";
			}
			//practitioner role period
			if(typeof req.body.period !== 'undefined'){
				var period = req.body.period;
				if(period.indexOf("to") > 0){
					arrPeriod = period.split("to");
					periodStart = arrPeriod[0];
					periodEnd = arrPeriod[1];

					if(!regex.test(periodStart) && !regex.test(periodEnd)){
						err_code = 2;
						err_msg = "Period invalid date format.";
					}	
				}else{
					periodStart = "";
					periodEnd = "";
				}
			}else{
				periodStart = "";
				periodEnd = "";
			}
			//practioner role code
			if(typeof req.body.code !== 'undefined'){
				practionerRoleCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(practionerRoleCode)){
					err_code = 2;
					err_msg = "practioner role code is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json practioner role request.";
			}
			//practioner role specialty
			if(typeof req.body.specialty !== 'undefined'){
				practionerRoleSpecialty =  req.body.specialty;
				if (isNaN(practionerRoleSpecialty)) {
					err_code = 3;
					err_msg = "practioner role specialty is not nummber";
				} else {
					if(validator.isEmpty(practionerRoleSpecialty)){
						err_code = 2;
						err_msg = "practioner role specialty is required";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'specialty' in json practioner role request.";
			}

			if(typeof req.body.availabilityExceptions !== 'undefined'){
				practionerRoleavailabilityExceptions =  req.body.availabilityExceptions.trim().toLowerCase();
				if(validator.isEmpty(practionerRoleavailabilityExceptions)){
					err_code = 2;
					err_msg = "practioner role availability exceptions is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'availability exceptions' in json practioner role request.";
			}

			//contact point system
			if(typeof req.body.telecom.system !== 'undefined'){
				contactPointSystemCode =  req.body.telecom.system.trim().toLowerCase();
				if(validator.isEmpty(contactPointSystemCode)){
					err_code = 2;
					err_msg = "Contact Point System is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'system' in json telecom request.";
			}

			//contact point value
			if(typeof req.body.telecom.value !== 'undefined'){
				contactPointValue =  req.body.telecom.value;
				if(validator.isEmpty(contactPointValue)){
					err_code = 2;
					err_msg = "Contact Point Value is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value' in json telecom request.";
			}

			//contact poin use
			if(typeof req.body.telecom.use !== 'undefined'){
				contactPointUseCode =  req.body.telecom.use.trim().toLowerCase();
				if(validator.isEmpty(contactPointUseCode)){
					err_code = 2;
					err_msg = "Telecom Use Code is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'use' in json telecom request.";
			} 

			//contact poin rank
			if(typeof req.body.telecom.rank !== 'undefined'){
				contactPointRank =  req.body.telecom.rank;
				if(!validator.isInt(contactPointRank)){
					err_code = 2;
					err_msg = "Telecom Rank must be number";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'rank' in json telecom request.";
			} 

			//contact point period
			if(typeof req.body.telecom.period !== 'undefined'){
				var period = req.body.telecom.period;
				if(period.indexOf("to") > 0){
					arrPeriod = period.split("to");
					contactPointPeriodStart = arrPeriod[0];
					contactPointPeriodEnd = arrPeriod[1];

					if(!regex.test(contactPointPeriodStart) && !regex.test(contactPointPeriodEnd)){
						err_code = 2;
						err_msg = "Telecom Period invalid date format.";
					}	
				}else{
					contactPointPeriodStart = "";
					contactPointPeriodEnd = "";
				}
			}else{
				contactPointPeriodStart = "";
				contactPointPeriodEnd = "";
			}

			// organization
			if(typeof req.body.organization !== 'undefined'){
				organizationReference =  req.body.organization.trim().toLowerCase();
				if(validator.isEmpty(organizationReference)){
					organizationReference = "";
				}
			}else{
				organizationReference = "";
			}

			// location
			if(typeof req.body.location !== 'undefined'){
				locationReference =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(locationReference)){
					locationReference = "";
				}
			}else{
				locationReference = "";
			}
			
			//practitioner
			if(typeof req.body.practitioner !== 'undefined'){
				practitionerReference =  req.body.practitioner.trim().toLowerCase();
				if(validator.isEmpty(practitionerReference)){
					practitionerReference = "";
				}
			}else{
				practitionerReference = "";
			}
			
			//healthcare service
			if(typeof req.body.healthcareService !== 'undefined'){
				healthcareServiceReference =  req.body.healthcareService.trim().toLowerCase();
				if(validator.isEmpty(healthcareServiceReference)){
					healthcareServiceReference = "";
				}
			}else{
				healthcareServiceReference = "";
			}
			
			if(typeof req.body.endpoint !== 'undefined'){
				endpointReference =  req.body.endpoint.trim().toLowerCase();
				if(validator.isEmpty(endpointReference)){
					endpointReference = "";
				}
			}else{
				endpointReference = "";
			}


			if(typeof req.body.availableTime.daysOfWeek !== 'undefined'){
				daysOfWeek =  req.body.availableTime.daysOfWeek.trim().toLowerCase();
				if(validator.isEmpty(daysOfWeek)){
					err_code = 2;
					err_msg = "Available Time Days Of Week is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'days of week' in json Available Time request.";
			}

			if(typeof req.body.availableTime.allDay !== 'undefined'){
				allDay =  req.body.availableTime.allDay.trim().toLowerCase();
				if(validator.isEmpty(allDay)){
					err_code = 2;
					err_msg = "Available Time All Day is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'all day' in json Available Time request.";
			}

			if(typeof req.body.availableTime.availableStartTime !== 'undefined'){
				availableStartTime =  req.body.availableTime.availableStartTime;
				if(!regex.test(availableStartTime) ){
					err_code = 2;
					err_msg = "Available Time Available Start Time invalid date format.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'available start time' in json Available Time request.";
			}

			if(typeof req.body.availableTime.availableEndTime !== 'undefined'){
				availableEndTime =  req.body.availableTime.availableEndTime;
				if(!regex.test(availableEndTime)){
					err_code = 2;
					err_msg = "Available Time Available End Time invalid date format.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'available end time' in json Available Time request.";
			}

			if(typeof req.body.notAvailable.description !== 'undefined'){
				description =  req.body.notAvailable.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					err_code = 2;
					err_msg = "Not Available Description is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json Not Available request.";
			}

			if(typeof req.body.notAvailable.during !== 'undefined'){
				during =  req.body.notAvailable.during;
				if(!regex.test(during)){
					err_code = 2;
					err_msg = "Not Available During invalid date format.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'during' in json Not Available request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
							if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
									if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									 //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, contactPointSystemCode, 'CONTACT_POINT_SYSTEM', function(resContactPointSystem){
											if(resContactPointSystem.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, contactPointUseCode, 'CONTACT_POINT_USE', function(resContactPointUse){
													if(resContactPointUse.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
														checkCode(apikey, practionerRoleCode, 'PRACTITIONER_ROLE_CODE', function(resPractionerRoleCode){
															if(resPractionerRoleCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																checkCode(apikey, practionerRoleSpecialty, 'PRACTICE_CODE', function(resPractionerRoleSpecialtyCode){
																	if(resPractionerRoleSpecialtyCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																		checkCode(apikey, daysOfWeek, 'DAYS_OF_WEEK', function(resDaysOfWeekCode){
																			if(resDaysOfWeekCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																				//event emiter
																				myEmitter.prependOnceListener('checkPractitionerRoleId', function() {
																						checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
																							if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada
																								checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactPointValue, 'CONTACT_POINT', function(resContactPointValue){
																									if(resContactPointValue.err_code == 0){
																										//proses insert

																										//set uniqe id
																										var unicId = uniqid.time();
																										var practitionerRoleId = 'prr' + unicId;
																										var practitionerId = 'pra' + unicId;
																										var identifierId = 'ide' + unicId;
																										var contactPointId = 'cop' + unicId;
																										var availableTimeId = 'avt' + unicId;
																										var notAvailableId = 'noa' + unicId;

																										dataPractitionerRole = {
																											"id" : practitionerRoleId,
																											"active" : practionerRoleActive,
																											"period_start" : periodStart,
																											"period_end" : periodEnd,
																											"code" : practionerRoleCode,
																											"specialty" : practionerRoleSpecialty,
																											"availabilityExceptions" : practionerRoleavailabilityExceptions,
																											"practitioner" : practitionerReference,
																											"organization" : organizationReference,
																											"location" : locationReference,
																											"healthcareService" : healthcareServiceReference,
																											"endpoint" : endpointReference
																										}
																										ApiFHIR.post('practitionerRole', {"apikey": apikey}, {body: dataPractitionerRole, json: true}, function(error, response, body){
																											practitioner = body;
																											if(practitioner.err_code > 0){
																												res.json(practitioner);	
																											}
																										})

																										dataAvailableTime = {
																											"practitionerRoleid" : practitionerRoleId,
																											"id" : availableTimeId,
																											"daysOfWeek" : daysOfWeek,
																											"allDay" : allDay,
																											"availableStartTime" : availableStartTime,
																											"availableEndTime" : availableEndTime
																										}
																										ApiFHIR.post('availableTime', {"apikey": apikey}, {body: dataAvailableTime, json: true}, function(error, response, body){
																											practitioner = body;
																											if(practitioner.err_code > 0){
																												res.json(practitioner);	
																											}
																										})

																										dataNotAvailable = {
																											"practitionerRoleid" : practitionerRoleId,
																											"id" : notAvailableId,
																											"description" : description,
																											"during" : during
																										}
																										ApiFHIR.post('notAvailable', {"apikey": apikey}, {body: dataNotAvailable, json: true}, function(error, response, body){
																											practitioner = body;
																											if(practitioner.err_code > 0){
																												res.json(practitioner);	
																											}
																										})

																										//identifier
																										dataIdentifier = {
																																			"id": identifierId,
																																			"use": identifierUseCode,
																																			"type": identifierTypeCode,
																																			"system": identifierId,
																																			"value": identifierValue,
																																			"period_start": identifierPeriodStart,
																																			"period_end": identifierPeriodEnd,
																																			"practitioner_role_id": practitionerRoleId
																																		}
																										ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
																											identifier = body;
																											if(identifier.err_code > 0){
																												res.json(identifier);	
																											}
																										})

																										//contact_point
																										dataContactPoint = {
																																				"id": contactPointId,
																																				"system": contactPointSystemCode,
																																				"value": contactPointValue,
																																				"use": contactPointUseCode,
																																				"rank": contactPointRank,
																																				"period_start": contactPointPeriodStart,
																																				"period_end": contactPointPeriodEnd,
																																				"practitioner_role_id": practitionerRoleId
																																			}
																										//post to contact point
																										ApiFHIR.post('contactPoint', {"apikey": apikey}, {body: dataContactPoint, json: true}, function(error, response, body){
																											contactPoint = body;
																											if(contactPoint.err_code > 0){
																												res.json(contactPoint);	
																											}
																										})

																										res.json({"err_code": 0, "err_msg": "Practitioner Role has been add.", "data": [{"_id": practitionerRoleId}]});	
																									}else{
																										res.json({"err_code": 514, "err_msg": "Telecom value already exist."});			
																									}
																								})
																							}else{
																								res.json({"err_code": 513, "err_msg": "Identifier value already exist."});		
																							}
																						})

																				});

																				myEmitter.prependOnceListener('checkHealthcareServiceId', function(){
																					if(validator.isEmpty(healthcareServiceReference)){
																						myEmitter.emit('checkPractitionerRoleId');
																					}else{
																						checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceReference, 'HEALTHCARE_SERVICE', function(resHealthcareServiceID){
																							if(resHealthcareServiceID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																								myEmitter.emit('checkPractitionerRoleId');
																							}else{
																								res.json({"err_code": 512, "err_msg": "Health care id not found."});	
																							}
																						})
																					}
																				})

																				myEmitter.prependOnceListener('checkPractitionerId', function(){
																					if(validator.isEmpty(practitionerReference)){
																						myEmitter.emit('checkHealthcareServiceId');
																					}else{
																						checkUniqeValue(apikey, "PRACTITIONER_ID|" + practitionerReference, 'PRACTITIONER', function(resPractitionerID){
																							if(resPractitionerID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																								myEmitter.emit('checkHealthcareServiceId');
																							}else{
																								res.json({"err_code": 511, "err_msg": "Practitioner id not found."});	
																							}
																						})
																					}
																				})

																				myEmitter.prependOnceListener('checkLocationId', function(){
																					if(validator.isEmpty(locationReference)){
																						myEmitter.emit('checkPractitionerId');
																					}else{
																						checkUniqeValue(apikey, "LOCATION_ID|" + locationReference, 'LOCATION', function(resLocationID){
																							if(resLocationID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																								myEmitter.emit('checkPractitionerId');
																							}else{
																								res.json({"err_code": 510, "err_msg": "Location id not found."});	
																							}
																						})
																					}
																				})						

																				myEmitter.prependOnceListener('checkEndpointId', function(){
																					if(validator.isEmpty(endpointReference)){
																						myEmitter.emit('checkLocationId');
																					}else{
																						checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointReference, 'ENDPOINT', function(resEndpointID){
																							if(resEndpointID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																								myEmitter.emit('checkLocationId');
																							}else{
																								res.json({"err_code": 509, "err_msg": "Endpoint id not found."});	
																							}
																						})
																					}
																				})						

																				if(validator.isEmpty(organizationReference)){
																					myEmitter.emit('checkEndpointId');
																				}else{
																					checkUniqeValue(apikey, "ORGANIZATION_ID|" + organizationReference, 'ORGANIZATION', function(resOrganizationRef){
																						if(resOrganizationRef.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																							myEmitter.emit('checkEndpointId');
																						}else{
																							res.json({"err_code": 508, "err_msg": "Organization id is not exist."});
																						}
																					})
																				}
																			}else{
																				res.json({"err_code": 507, "err_msg": "Days Of Week Code not found"});
																			}
																		})
																	}else{
																		res.json({"err_code": 506, "err_msg": "Practitioner Role Specialty Code not found"});
																	}
																})
															}else{
																res.json({"err_code": 505, "err_msg": "Practitioner Role Code not found"});
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
										res.json({"err_code": 502, "err_msg": "Identifier type code not found"});		
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Identifier use code not found"});
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
		availableTime: function addAvailableTime(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var practitionerRoleId = req.params.practitioner_role_id;

			var err_code = 0;
			var err_msg = "";

			if(typeof req.body.daysOfWeek !== 'undefined'){
				daysOfWeek =  req.body.daysOfWeek.trim().toLowerCase();
				if(validator.isEmpty(daysOfWeek)){
					err_code = 2;
					err_msg = "Available Time Days Of Week is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'days of week' in json Available Time request.";
			}

			if(typeof req.body.allDay !== 'undefined'){
				allDay =  req.body.allDay.trim().toLowerCase();
				if(validator.isEmpty(allDay)){
					err_code = 2;
					err_msg = "Available Time All Day is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'all day' in json Available Time request.";
			}

			if(typeof req.body.availableStartTime !== 'undefined'){
				availableStartTime =  req.body.availableStartTime;
				if(!regex.test(availableStartTime) ){
					err_code = 2;
					err_msg = "Available Time Available Start Time invalid date format.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'available start time' in json Available Time request.";
			}

			if(typeof req.body.availableEndTime !== 'undefined'){
				availableEndTime =  req.body.availableEndTime;
				if(!regex.test(availableEndTime)){
					err_code = 2;
					err_msg = "Available Time Available End Time invalid date format.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'available end time' in json Available Time request.";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleID){
							if(resPractitionerRoleID.err_code > 0){
								checkCode(apikey, daysOfWeek, 'DAYS_OF_WEEK', function(resDaysOfWeekCode){
									if(resDaysOfWeekCode.err_code > 0){
										var unicId = uniqid.time();
										var availableTimeId = 'avt' + unicId;
										dataAvailableTime = {
											"practitionerRoleid" : practitionerRoleId,
											"id" : availableTimeId,
											"daysOfWeek" : daysOfWeek,
											"allDay" : allDay,
											"availableStartTime" : availableStartTime,
											"availableEndTime" : availableEndTime
										}
										ApiFHIR.post('availableTime', {"apikey": apikey}, {body: dataAvailableTime, json: true}, function(error, response, body){
											//console.log(body);
											practitionerRole = body;
											if(practitionerRole.err_code == 0){
												//console.log("tes123");
												res.json({"err_code": 0, "err_msg": "Available Time has been add in this practitioner role.", "data": practitionerRole.data});
											} else {
												res.json(practitionerRole);
											}
										})													
									}else{
										res.json({"err_code": 501, "err_msg": "Days Of Week Code not found"});
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Practitioner Role Id not found"});
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
		notAvailable: function addNotAvailable(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var practitionerRoleId = req.params.practitioner_role_id;

			var err_code = 0;
			var err_msg = "";

			
			if(typeof req.body.description !== 'undefined'){
				description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					err_code = 2;
					err_msg = "Not Available Description is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json Not Available request.";
			}

			if(typeof req.body.during !== 'undefined'){
				during =  req.body.during;
				if(!regex.test(during)){
					err_code = 2;
					err_msg = "Not Available During invalid date format.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'during' in json Not Available request.";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleID){
							if(resPractitionerRoleID.err_code > 0){
								var unicId = uniqid.time();
								var notAvailableId = 'noa' + unicId;
								dataNotAvailable = {
									"practitionerRoleid" : practitionerRoleId,
									"id" : notAvailableId,
									"description" : description,
									"during" : during
								}
								ApiFHIR.post('notAvailable', {"apikey": apikey}, {body: dataNotAvailable, json: true}, function(error, response, body){
									practitionerRole = body;
									if(practitionerRole.err_code == 0){
										res.json({"err_code": 0, "err_msg": "Not Available has been add in this practitioner role.", "data": practitionerRole.data});
									} else {
										res.json(practitionerRole);
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Practitioner Role Id not found"});
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
		identifier: function addIdentifier(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var practitionerRoleId = req.params.practitioner_role_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof practitionerRoleId !== 'undefined'){
				if(validator.isEmpty(practitionerRoleId)){
					err_code = 1;
					err_msg = "Practitioner Role id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Practitioner Role id is required";
			}

			//identifier
			if(typeof req.body.use !== 'undefined'){
				identifierUseCode =  req.body.use.trim().toLowerCase();
				if(validator.isEmpty(identifierUseCode)){
					err_code = 2;
					err_msg = "Identifier Use is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'use' in json request.";
			} 

			//type code
			if(typeof req.body.type !== 'undefined'){
				identifierTypeCode =  req.body.type.trim().toUpperCase();
				if(validator.isEmpty(identifierTypeCode)){
					err_code = 2;
					err_msg = "Identifier Type is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'type' in json request.";
			} 

			//identifier uniqe value
			if(typeof req.body.value !== 'undefined'){
				identifierValue =  req.body.value.trim();
				if(validator.isEmpty(identifierValue)){
					err_code = 2;
					err_msg = "Identifier Value is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'value' in json request.";
			}

			//identifier period start
			if(typeof req.body.period !== 'undefined'){
				period = req.body.period;
				if(period.indexOf("to") > 0){
					arrPeriod = period.split("to");
					identifierPeriodStart = arrPeriod[0];
					identifierPeriodEnd = arrPeriod[1];

					if(!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)){
						err_code = 2;
						err_msg = "Identifier Period invalid date format.";
					}	
				}else{
					err_code = 1;
					err_msg = "Identifier Period format is wrong, `ex: start to end` ";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'period' in json identifier request.";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
							if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
									if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
											if(resUniqeValue.err_code == 0){
												checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleID){
													if(resPractitionerRoleID.err_code > 0){
														var identifierId = 'ide' + uniqid.time();
														//set by sistem
														var identifierSystem = identifierId;

														dataIdentifier = {
															"id": identifierId,
															"use": identifierUseCode,
															"type": identifierTypeCode,
															"system": identifierSystem,
															"value": identifierValue,
															"period_start": identifierPeriodStart,
															"period_end": identifierPeriodEnd,
															"practitioner_role_id": practitionerRoleId
														}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this practitioner role.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Practitioner Role Id not found"});		
													}
												})
											}else{
												res.json({"err_code": 504, "err_msg": "Identifier value already exist."});	
											}
										})

									}else{
										res.json({"err_code": 502, "err_msg": "Identifier type code not found"});		
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Identifier use code not found"});
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
		telecom: function addTelecom(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var practitionerRoleId = req.params.practitioner_role_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof practitionerRoleId !== 'undefined'){
				if(validator.isEmpty(practitionerRoleId)){
					err_code = 1;
					err_msg = "Practitioner Role id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Practitioner Role id is required";
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
						checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleId){
							if(resPractitionerRoleId.err_code > 0){
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
																								"practitioner_role_id": practitionerRoleId
																							}

														ApiFHIR.post('contactPoint', {"apikey": apikey}, {body: dataContactPoint, json: true}, function(error, response, body){
															contactPoint = body;
															if(contactPoint.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Telecom has been add in this practitioner role.", "data": contactPoint.data});
															}else{
																res.json(contactPoint);	
															}
														})
													}else{
														res.json({"err_code": 501, "err_msg": "Telecom value already exist."});			
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
								res.json({"err_code": 503, "err_msg": "Practitioner Role Id not found"});	
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
		endpointRef: function addEndpointRef(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var practitionerRoleId = req.params.practitioner_role_id;

			var err_code = 0;
			var err_msg = "";

			if(typeof req.body.endpoint_id !== 'undefined'){
				endpoint_id =  req.body.endpoint_id.trim().toLowerCase();
				if(validator.isEmpty(endpoint_id)){
					err_code = 2;
					err_msg = "Endpoint id of Practitioner Role is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'endpoint id' in json Practitioner Role request.";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleID){
							if(resPractitionerRoleID.err_code > 0){
								checkUniqeValue(apikey, "ENDPOINT_ID|" + endpoint_id, 'ENDPOINT', function(resEndpointID){
									if(resEndpointID.err_code > 0){
										dataEndpoint = {
											"practitionerRoleid" : practitionerRoleId,
											"id" : endpoint_id,
										}
										ApiFHIR.post('PractitionerRoleEndpoint', {"apikey": apikey}, {body: dataEndpoint, json: true}, function(error, response, body){
											//console.log(body);
											practitionerRole = body;
											if(practitionerRole.err_code == 0){
												//console.log("tes123");
												res.json({"err_code": 0, "err_msg": "Endpoint has been add in this practitioner role.", "data": practitionerRole.data});
											} else {
												res.json(practitionerRole);
											}
										})													
									}else{
										res.json({"err_code": 501, "err_msg": "Endpoint Id not found"});
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Practitioner Role Id not found"});
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
		locationRef: function addLocationRef(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var practitionerRoleId = req.params.practitioner_role_id;

			var err_code = 0;
			var err_msg = "";

			if(typeof req.body.location_id !== 'undefined'){
				location_id =  req.body.location_id.trim().toLowerCase();
				if(validator.isEmpty(location_id)){
					err_code = 2;
					err_msg = "Location id of Practitioner Role is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'location id' in json Practitioner Role request.";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleID){
							if(resPractitionerRoleID.err_code > 0){
								checkUniqeValue(apikey, "LOCATION_ID|" + location_id, 'LOCATION', function(resLocationID){
									if(resLocationID.err_code > 0){
										dataLocation = {
											"practitionerRoleid" : practitionerRoleId,
											"id" : location_id,
										}
										ApiFHIR.post('PractitionerRoleLocation', {"apikey": apikey}, {body: dataLocation, json: true}, function(error, response, body){
											//console.log(body);
											practitionerRole = body;
											if(practitionerRole.err_code == 0){
												//console.log("tes123");
												res.json({"err_code": 0, "err_msg": "Location has been add in this practitioner role.", "data": practitionerRole.data});
											} else {
												res.json(practitionerRole);
											}
										})													
									}else{
										res.json({"err_code": 501, "err_msg": "Location Id not found"});
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Practitioner Role Id not found"});
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
		healthcareServiceRef: function addHealthcareServiceRef(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var practitionerRoleId = req.params.practitioner_role_id;

			var err_code = 0;
			var err_msg = "";

			if(typeof req.body.healthcare_service_id !== 'undefined'){
				healthcare_service_id =  req.body.healthcare_service_id.trim().toLowerCase();
				if(validator.isEmpty(healthcare_service_id)){
					err_code = 2;
					err_msg = "Healthcare Service id of Practitioner Role is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'Healthcare Service id' in json Practitioner Role request.";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleID){
							if(resPractitionerRoleID.err_code > 0){
								checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcare_service_id, 'HEALTHCARE_SERVICE', function(resHealthcareServiceID){
									if(resHealthcareServiceID.err_code > 0){
										dataHS = {
											"practitionerRoleid" : practitionerRoleId,
											"id" : healthcare_service_id
										}
										ApiFHIR.post('PractitionerRoleHealthcareService', {"apikey": apikey}, {body: dataHS, json: true}, function(error, response, body){
											//console.log(body);
											practitionerRole = body;
											if(practitionerRole.err_code == 0){
												//console.log("tes123");
												res.json({"err_code": 0, "err_msg": "Healthcare Service has been add in this practitioner role.", "data": practitionerRole.data});
											} else {
												res.json(practitionerRole);
											}
										})													
									}else{
										res.json({"err_code": 501, "err_msg": "Healthcare Service Id not found"});
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Practitioner Role Id not found"});
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
	put:{
		practitionerRole : function putPractitionerRole(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			var practitionerRoleId = req.params.practitioner_role_id;
			var err_code = 0;
			var err_msg = "";

			var dataPractitionerRole = {};
	//console.log(req.body);
			//input check 
			if(typeof practitionerRoleId !== 'undefined'){
				if(validator.isEmpty(practitionerRoleId)){
					err_code = 2;
					err_msg = "Practitioner Role id is required";
				}
			}else{
				err_code = 1;
				err_msg = "Practitioner Role id is required";
			}
			
			//practioner active
			if(typeof req.body.active !== 'undefined'){
				active =  req.body.active.trim().toLowerCase();
				if(validator.isEmpty(active)){
					err_code = 2;
					err_msg = "Active is required.";
				}else{
					dataPractitionerRole.active = active;
				}
			}else{
				active = "";
			}
			
			//practitioner role period
			if(typeof req.body.period !== 'undefined'){
				period = req.body.period;
				if(period.indexOf("to") > 0){
					arrPeriod = period.split("to");
					PeriodStart = arrPeriod[0];
					PeriodEnd = arrPeriod[1];

					if(!regex.test(PeriodStart) && !regex.test(PeriodEnd)){
						err_code = 2;
						err_msg = "Period invalid date format.";
					}else{
						dataEndpoint.period_start = PeriodStart;
						dataEndpoint.period_end = PeriodEnd;
					}	
				}else{
					err_code = 1;
					err_msg = "Period request format is wrong, `ex: start to end` ";
				}
			}else{
				PeriodStart = "";
				PeriodEnd = "";
			}
		
			//practioner role code
			if(typeof req.body.code !== 'undefined'){
				code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					err_code = 2;
					err_msg = "Code is required.";
				}else{
					dataPractitionerRole.code = code;
				}
			}else{
				code = "";
			}
			
			//practioner role specialty
			if(typeof req.body.specialty !== 'undefined'){
				specialty =  req.body.specialty.trim().toLowerCase();
				if(validator.isEmpty(specialty)){
					err_code = 2;
					err_msg = "Specialty is required.";
				}else{
					if (isNaN(specialty)) {
						err_code = 3;
						err_msg = "practioner role specialty is not nummber";
					} else {
						dataPractitionerRole.specialty = specialty;
					}
				}
			}else{
				specialty = "";
			}
			
			if(typeof req.body.availabilityExceptions !== 'undefined'){
				availabilityExceptions =  req.body.availabilityExceptions.trim().toLowerCase();
				if(validator.isEmpty(availabilityExceptions)){
					err_code = 2;
					err_msg = "Availability Exceptions is required.";
				}else{
					dataPractitionerRole.availabilityExceptions = availabilityExceptions;
				}
			}else{
				availabilityExceptions = "";
			}
			
			// organization
			if(typeof req.body.organization !== 'undefined'){
				organization =  req.body.organization.trim().toLowerCase();
				if(validator.isEmpty(organization)){
					err_code = 2;
					err_msg = "organization is required.";
				}else{
					dataPractitionerRole.organization = organization;
				}
			}else{
				organization = "";
			}

			// location
			if(typeof req.body.location !== 'undefined'){
				location =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(location)){
					err_code = 2;
					err_msg = "location is required.";
				}else{
					dataPractitionerRole.location = location;
				}
			}else{
				location = "";
			}
			
			//practitioner
			if(typeof req.body.practitioner !== 'undefined'){
				practitioner =  req.body.practitioner.trim().toLowerCase();
				if(validator.isEmpty(practitioner)){
					err_code = 2;
					err_msg = "practitioner is required.";
				}else{
					dataPractitionerRole.practitioner = practitioner;
				}
			}else{
				practitioner = "";
			}
			
			//healthcare service
			if(typeof req.body.healthcareService !== 'undefined'){
				healthcareService =  req.body.healthcareService.trim().toLowerCase();
				if(validator.isEmpty(healthcareService)){
					err_code = 2;
					err_msg = "healthcare service is required.";
				}else{
					dataPractitionerRole.healthcareService = healthcareService;
				}
			}else{
				healthcareService = "";
			}
			
			if(typeof req.body.endpoint !== 'undefined'){
				endpoint =  req.body.endpoint.trim().toLowerCase();
				if(validator.isEmpty(endpoint)){
					err_code = 2;
					err_msg = "endpoint is required.";
				}else{
					dataPractitionerRole.endpoint = endpoint;
				}
			}else{
				endpoint = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkPractitionerRoleId', function(){
							checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleId){
								if(resPractitionerRoleId.err_code > 0){
									//console.log(dataEndpoint);
										ApiFHIR.put('practitionerRole', {"apikey": apikey, "_id": practitionerRoleId}, {body: dataPractitionerRole, json: true}, function(error, response, body){
											practitionerRole = body;
											if(practitionerRole.err_code > 0){
												res.json(practitionerRole);	
											}else{
												res.json({"err_code": 0, "err_msg": "Practitioner role has been update.", "data": practitionerRole.data});
											}
										})
								}else{
									res.json({"err_code": 508, "err_msg": "Practitioner Role Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkHealthcareServiceId', function(){
							if(validator.isEmpty(healthcareService)){
								myEmitter.emit('checkPractitionerRoleId');
							}else{
								checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareService, 'HEALTHCARE_SERVICE', function(resHealthcareServiceID){
									if(resHealthcareServiceID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkPractitionerRoleId');
									}else{
										res.json({"err_code": 507, "err_msg": "Health care id not found."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkPractitionerId', function(){
							if(validator.isEmpty(practitioner)){
								myEmitter.emit('checkHealthcareServiceId');
							}else{
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + practitioner, 'PRACTITIONER', function(resPractitionerID){
									if(resPractitionerID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkHealthcareServiceId');
									}else{
										res.json({"err_code": 506, "err_msg": "Practitioner id not found."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkLocationId', function(){
							if(validator.isEmpty(location)){
								myEmitter.emit('checkPractitionerId');
							}else{
								checkUniqeValue(apikey, "LOCATION_ID|" + location, 'LOCATION', function(resLocationID){
									if(resLocationID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkPractitionerId');
									}else{
										res.json({"err_code": 505, "err_msg": "Location id not found."});	
									}
								})
							}
						})						

						myEmitter.prependOnceListener('checkEndpointId', function(){
							if(validator.isEmpty(endpoint)){
								myEmitter.emit('checkLocationId');
							}else{
								checkUniqeValue(apikey, "ENDPOINT_ID|" + endpoint, 'ENDPOINT', function(resEndpointID){
									if(resEndpointID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkLocationId');
									}else{
										res.json({"err_code": 504, "err_msg": "Endpoint id not found."});	
									}
								})
							}
						})
						
						myEmitter.prependOnceListener('checkCode', function(){
							if(validator.isEmpty(code)){
								myEmitter.emit('checkEndpointId');
							}else{
								checkCode(apikey, code, 'PRACTITIONER_ROLE_CODE', function(resPractionerRoleCode){
									if(resPractionerRoleCode.err_code > 0){
										myEmitter.emit('checkEndpointId');
									}else{
										res.json({"err_code": 503, "err_msg": "Practioner Role Code not found."});	
									}
								})
							}
						})
						
						myEmitter.prependOnceListener('checkSpecialty', function(){
							if(validator.isEmpty(specialty)){
								myEmitter.emit('checkCode');
							}else{
								checkCode(apikey, specialty, 'PRACTICE_CODE', function(resPractionerRoleSpecialtyCode){
									if(resPractionerRoleSpecialtyCode.err_code > 0){
										myEmitter.emit('checkCode');
									}else{
										res.json({"err_code": 502, "err_msg": "Practioner Role Specialty not found."});	
									}
								})
							}
						})

						if(validator.isEmpty(organization)){
							myEmitter.emit('checkSpecialty');
						}else{
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + organization, 'ORGANIZATION', function(resOrganizationRef){
								if(resOrganizationRef.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkSpecialty');
								}else{
									res.json({"err_code": 501, "err_msg": "Organization id is not exist."});
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
		availableTime: function addAvailableTime(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var practitionerRoleId = req.params.practitioner_role_id;
			var availableTimeId = req.params.available_time_id;

			var err_code = 0;
			var err_msg = "";
			var dataAvailableTime = {};
			//input check 
			if(typeof practitionerRoleId !== 'undefined'){
				if(validator.isEmpty(practitionerRoleId)){
					err_code = 2;
					err_msg = "Practitioner role id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Practitioner role id is required";
			}

			if(typeof req.body.daysOfWeek !== 'undefined'){
				daysOfWeek =  req.body.daysOfWeek.trim().toLowerCase();
				if(validator.isEmpty(daysOfWeek)){
					err_code = 2;
					err_msg = "Days Of Week is empty";
				}else{
					dataAvailableTime.daysOfWeek = daysOfWeek;
				}
			}else{
				daysOfWeek = "";
			} 
			
			if(typeof req.body.allDay !== 'undefined'){
				allDay =  req.body.allDay.trim().toLowerCase();
				if(validator.isEmpty(allDay)){
					err_code = 2;
					err_msg = "All Day is empty";
				}else{
					dataAvailableTime.allDay = allDay;
				}
			}else{
				allDay = "";
			}
			
			if(typeof req.body.availableStartTime !== 'undefined'){
				availableStartTime =  req.body.availableStartTime.trim().toLowerCase();
				if(validator.isEmpty(availableStartTime)){
					err_code = 2;
					err_msg = "Available Start Time is empty";
				}else{
					dataAvailableTime.availableStartTime = availableStartTime;
				}
			}else{
				availableStartTime = "";
			}
			
			if(typeof req.body.availableEndTime !== 'undefined'){
				availableEndTime =  req.body.availableEndTime.trim().toLowerCase();
				if(validator.isEmpty(availableEndTime)){
					err_code = 2;
					err_msg = "Available End Time is empty";
				}else{
					dataAvailableTime.availableEndTime = availableEndTime;
				}
			}else{
				availableEndTime = "";
			} 

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkPractitionerRoleId', function(){
							checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleId){
								if(resPractitionerRoleId.err_code > 0){
									checkUniqeValue(apikey, "AVAILABLE_TIME_ID|" + availableTimeId, 'AVAILABLE_TIME', function(resAvailableTimeId){
										if(resAvailableTimeId.err_code > 0){
											ApiFHIR.put('availableTime', {"apikey": apikey, "_id": availableTimeId, "dr": "PRACTITIONER_ROLE_ID|"+practitionerRoleId}, {body: dataAvailableTime, json: true}, function(error, response, body){
												availableTime = body;
												//console.log(availableTime);
												if(availableTime.err_code > 0){
													res.json(availableTime);	
												}else{
													res.json({"err_code": 0, "err_msg": "available time has been update in this practitioner role.", "data": availableTime.data});
												}
											})
										}else{
											res.json({"err_code": 502, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 501, "err_msg": "Practitioner Role Id not found"});		
								}
							})
						})

						if(validator.isEmpty(daysOfWeek)){
							myEmitter.emit('checkPractitionerRoleId');	
						}else{
							checkCode(apikey, daysOfWeek, 'DAYS_OF_WEEK', function(resDaysOfWeekCode){
								if(resDaysOfWeekCode.err_code > 0){
									myEmitter.emit('checkPractitionerRoleId');
								}else{
									res.json({"err_code": 501, "err_msg": "Days Of Week code not found"});
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
		notAvailable: function addNotAvailable(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var practitionerRoleId = req.params.practitioner_role_id;
			var notAvailableId = req.params.not_available_id;

			var err_code = 0;
			var err_msg = "";
			var dataNotAvailable = {};
			//input check 
			if(typeof practitionerRoleId !== 'undefined'){
				if(validator.isEmpty(practitionerRoleId)){
					err_code = 2;
					err_msg = "Practitioner role id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Practitioner role id is required";
			}
			
			if(typeof notAvailableId !== 'undefined'){
				if(validator.isEmpty(notAvailableId)){
					err_code = 2;
					err_msg = "Not Available id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Not Available id is required";
			}

			if(typeof req.body.description !== 'undefined'){
				description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					err_code = 2;
					err_msg = "Description is empty";
				}else{
					dataNotAvailable.description = description;
				}
			}else{
				description = "";
			}
			
			if(typeof req.body.during !== 'undefined'){
				during =  req.body.during.trim().toLowerCase();
				if(validator.isEmpty(during)){
					err_code = 2;
					err_msg = "During is empty";
				}else{
					dataNotAvailable.during = during;
				}
			}else{
				during = "";
			}

			if(typeof req.body.during !== 'undefined'){
				during =  req.body.during;
				if(!regex.test(during)){
					err_code = 2;
					err_msg = "Not Available During invalid date format.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'during' in json Not Available request.";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkPractitionerRoleId', function(){
							checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleId){
								if(resPractitionerRoleId.err_code > 0){
									checkUniqeValue(apikey, "NOT_AVAILABLE_ID|" + notAvailableId, 'NOT_AVAILABLE_ID', function(resNotAvailableId){
										if(resNotAvailableId.err_code > 0){
											ApiFHIR.put('notAvailable', {"apikey": apikey, "_id": notAvailableId, "dr": "PRACTITIONER_ROLE_ID|"+practitionerRoleId}, {body: dataNotAvailable, json: true}, function(error, response, body){
												notAvailable = body;
												if(notAvailable.err_code > 0){
													res.json(notAvailable);	
												}else{
													res.json({"err_code": 0, "err_msg": "not available has been update in this practitioner role.", "data": notAvailable.data});
												}
											})
										}else{
											res.json({"err_code": 502, "err_msg": "Not Available Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 501, "err_msg": "Practitioner Role Id not found"});		
								}
							})
						})

						myEmitter.emit('checkPractitionerRoleId');	
						
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		identifier: function updateIdentifier(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var practitionerRoleId = req.params.practitioner_role_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof practitionerRoleId !== 'undefined'){
				if(validator.isEmpty(practitionerRoleId)){
					err_code = 2;
					err_msg = "Practitioner role id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Practitioner role id is required";
			}

			if(typeof identifierId !== 'undefined'){
				if(validator.isEmpty(identifierId)){
					err_code = 2;
					err_msg = "Identifier id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Identifier id is required";
			}

			//identifier
			if(typeof req.body.use !== 'undefined'){
				identifierUseCode =  req.body.use.trim().toLowerCase();
				if(validator.isEmpty(identifierUseCode)){
					err_code = 2;
					err_msg = "Identifier Use is empty";
				}else{
					dataIdentifier.use = identifierUseCode;
				}
			}else{
				identifierUseCode = "";
			} 

			//type code
			if(typeof req.body.type !== 'undefined'){
				identifierTypeCode =  req.body.type.trim().toUpperCase();
				if(validator.isEmpty(identifierTypeCode)){
					err_code = 2;
					err_msg = "Identifier Type is empty";
				}else{
					dataIdentifier.type = identifierTypeCode;
				}
			}else{
				identifierTypeCode = "";
			} 

			//identifier uniqe value
			if(typeof req.body.value !== 'undefined'){
				identifierValue =  req.body.value.trim();
				if(validator.isEmpty(identifierValue)){
					err_code = 2;
					err_msg = "Identifier Value is empty";
				}else{
					dataIdentifier.value = identifierValue;
				}
			}else{
				identifierValue = "";
			}

			//identifier period start
			if(typeof req.body.period !== 'undefined'){
				period = req.body.period;
				if(period.indexOf("to") > 0){
					arrPeriod = period.split("to");
					identifierPeriodStart = arrPeriod[0];
					identifierPeriodEnd = arrPeriod[1];

					if(!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)){
						err_code = 2;
						err_msg = "Identifier Period invalid date format.";
					}else{
						dataIdentifier.period_start = identifierPeriodStart;
						dataIdentifier.period_end = identifierPeriodEnd;
					}	
				}else{
					err_code = 1;
					err_msg = "Period request format is wrong, `ex: start to end` ";
				}
			}else{
				identifierPeriodStart = "";
				identifierPeriodEnd = "";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkPractitionerId', function(){
							checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerRoleId){
								if(resPractitionerRoleId.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "PRACTITIONER_ROLE_ID|"+practitionerRoleId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this practitioner role.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Practitioner Role Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkPractitionerId');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkPractitionerId');				
									}else{
										res.json({"err_code": 503, "err_msg": "Identifier value already exist."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkIdentifierType', function(){
							if(validator.isEmpty(identifierTypeCode)){
								myEmitter.emit('checkIdentifierValue');
							}else{
								checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
									if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkIdentifierValue');
									}else{
										res.json({"err_code": 502, "err_msg": "Identifier type code not found"});		
									}
								})
							}
						})

						if(validator.isEmpty(identifierUseCode)){
							myEmitter.emit('checkIdentifierType');	
						}else{
							checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
								if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkIdentifierType');
								}else{
									res.json({"err_code": 501, "err_msg": "Identifier use code not found"});
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
		telecom: function updateTelecom(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var practitionerRoleId = req.params.practitioner_role_id;
			var contactPointId = req.params.contact_point_id;

			var err_code = 0;
			var err_msg = "";
			var dataContactPoint = {};

			//input check 
			if(typeof practitionerRoleId !== 'undefined'){
				if(validator.isEmpty(practitionerRoleId)){
					err_code = 2;
					err_msg = "Practitioner role id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Practitioner role id is required";
			}

			if(typeof contactPointId !== 'undefined'){
				if(validator.isEmpty(contactPointId)){
					err_code = 2;
					err_msg = "Telecom id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Telecom id is required";
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
						myEmitter.prependOnceListener('checkPractitionerId', function(){
							checkUniqeValue(apikey, "PRACTITIONER_ROLE_ID|" + practitionerRoleId, 'PRACTITIONER_ROLE', function(resPractitionerId){
								if(resPractitionerId.err_code > 0){
									checkUniqeValue(apikey, "CONTACT_POINT_ID|" + contactPointId, 'CONTACT_POINT', function(resContactPointID){
										if(resContactPointID.err_code > 0){
											ApiFHIR.put('contactPoint', {"apikey": apikey, "_id": contactPointId, "dr": "PRACTITIONER_ROLE_ID|"+practitionerRoleId}, {body: dataContactPoint, json: true}, function(error, response, body){
												contactPoint = body;
												if(contactPoint.err_code > 0){
													res.json(contactPoint);	
												}else{
													res.json({"err_code": 0, "err_msg": "Telecom has been update in this practitioner role.", "data": contactPoint.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Telecom Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Practitioner Role Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkContactPointValue', function(){
							if(validator.isEmpty(contactPointValue)){
								myEmitter.emit('checkPractitionerId');
							}else{
								checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactPointValue, 'CONTACT_POINT', function(resContactPointValue){
									if(resContactPointValue.err_code == 0){
										myEmitter.emit('checkPractitionerId');				
									}else{
										res.json({"err_code": 503, "err_msg": "Identifier value already exist."});	
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

function checkGroupQouta(apikey, groupId, callback){
	ApiFHIR.get('checkGroupQouta', {"apikey": apikey, "group_id": groupId}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	quota = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(quota.err_code == 0){
		  	//cek jumdata dulu
		  	if(quota.data.length > 0){
		  		groupQuota = parseInt(quota.data[0].quantity);
		  		memberCount = parseInt(quota.data[0].total_member);

		  		if(memberCount <= groupQuota){
		  			x({"err_code": 0, "err_msg": "Group quota is ready"});	
		  		}else{
		  			x({"err_code": 1, "err_msg": "Group quota is full, total member "+ groupQuota});	
		  		}
		  	}else{
		  			x({"err_code": 0, "err_msg": "Group quota is ready"});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": quota, "application": "API FHIR", "function": "checkGroupQouta"});
	  	}
	  }
	});

	function x(result){
		callback(result)
	}
}

function checkMemberEntityGroup(apikey, entityId, groupId, callback){
	ApiFHIR.get('checkMemberEntityGroup', {"apikey": apikey, "entity_id": entityId ,"group_id": groupId}, {}, function (error, response, body) {
	  if(error){
	  	x(error);
	  }else{
	  	entity = JSON.parse(body);
	  	//cek apakah ada error atau tidak
	  	if(entity.err_code == 0){
		  	if(parseInt(entity.data.length) > 0){
		  		x({"err_code": 2, "err_msg": "Member entity already exist in this group."});	
		  	}else{
	  			x({"err_code": 0, "err_msg": "Member not found in this group."});	
		  	}
	  	}else{
	  		x({"err_code": 1, "err_msg": entity, "application": "API FHIR", "function": "checkMemberEntityGroup"});
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