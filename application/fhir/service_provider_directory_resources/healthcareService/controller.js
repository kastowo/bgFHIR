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
		healthcaerService : function getHealthcareService(req, res){
		var ipAddres = req.connection.remoteAddress;
		var apikey = req.params.apikey;
		var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
		
		//params from query string
		var healthcareServiceId = req.query._id;
		var healthcareServiceActive = req.query.active;
		var healthcareServiceCategory = req.query.category;
		var healthcareServiceCharacteristic = req.query.characteristic;
		var healthcareServiceEndpoint = req.query.endpoint;
		var identifierValue = req.query.identifier;
		var locationId = req.query.location;
		var healthcareServiceName = req.query.name;
		var organizationId = req.query.organization;
		var healthcareServiceProgramName = req.query.program_name;
		var healthcareServiceType = req.query.type;

		var qString = {};
		
		if(typeof healthcareServiceId !== 'undefined'){
			if(!validator.isEmpty(healthcareServiceId)){
				qString._id = healthcareServiceId; 
			}else{
				res.json({"err_code": 1, "err_msg": "healthcare service id is required."});
			}
		}
		
		if(typeof healthcareServiceActive !== 'undefined'){
			if(!validator.isEmpty(healthcareServiceActive)){
				qString.active = healthcareServiceActive; 
			}else{
				res.json({"err_code": 1, "err_msg": "healthcare service active is required."});
			}
		}
		
		if(typeof healthcareServiceCategory !== 'undefined'){
			if(!validator.isEmpty(healthcareServiceCategory)){
				qString.category = healthcareServiceCategory; 
			}else{
				res.json({"err_code": 1, "err_msg": "healthcare service category is required."});
			}
		}
		
		if(typeof healthcareServiceCharacteristic !== 'undefined'){
			if(!validator.isEmpty(healthcareServiceCharacteristic)){
				qString.characteristic = healthcareServiceCharacteristic; 
			}else{
				res.json({"err_code": 1, "err_msg": "healthcare service characteristic is required."});
			}
		}
		
		if(typeof healthcareServiceEndpoint !== 'undefined'){
			if(!validator.isEmpty(healthcareServiceEndpoint)){
				qString.endpoint_id = healthcareServiceEndpoint;
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
		
		if(typeof healthcareServiceName !== 'undefined'){
			if(!validator.isEmpty(healthcareServiceName)){
				if(healthcareServiceName.indexOf(" ") > 0){
					qString.name = healthcareServiceName.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.name = healthcareServiceName;
				}
			}else{
				res.json({"err_code": 1, "err_msg": "Healthcare Service Name is empty."});
			}
		}
		
		if(typeof organizationId !== 'undefined'){
			if(!validator.isEmpty(organizationId)){
				qString.organization_id = organizationId; 
			}else{
				res.json({"err_code": 1, "err_msg": "organization id is required."});
			}
		}
		
		if(typeof healthcareServiceProgramName !== 'undefined'){
			if(!validator.isEmpty(healthcareServiceProgramName)){
				if(healthcareServiceProgramName.indexOf(" ") > 0){
					qString.program_name = healthcareServiceProgramName.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.program_name = healthcareServiceProgramName;
				}
			}else{
				res.json({"err_code": 1, "err_msg": "Healthcare Service Program Name is empty."});
			}
		}
		
		if(typeof healthcareServiceType !== 'undefined'){
			if(!validator.isEmpty(healthcareServiceType)){
				qString.type = healthcareServiceType; 
			}else{
				res.json({"err_code": 1, "err_msg": "healthcare service type is required."});
			}
		}
		
		
		seedPhoenixFHIR.path.GET = {
			"HealthcareService" : {
				"location": "%(apikey)s/HealthcareService",
				"query": qString
			}
		}
		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

		checkApikey(apikey, ipAddres, function(result){
			if(result.err_code == 0){
				ApiFHIR.get('HealthcareService', {"apikey": apikey}, {}, function (error, response, body) {
					if(error){
						res.json(error);
					}else{
						var healthcareService = JSON.parse(body); //object
						//console.log(practitionerRole);
						//cek apakah ada error atau tidak
						if(healthcareService.err_code == 0){
							//cek jumdata dulu
							if(healthcareService.data.length > 0){
								newHealthcareService = [];
								for(i=0; i < healthcareService.data.length; i++){
									myEmitter.once("getIdentifier", function(healthcareService, index, newHealthcareService, countHealthcareService){
													//get identifier
													qString = {};
													qString.healthcare_service_id = healthcareService.id;
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
															var objectHealthcareService = {};
															objectHealthcareService.resourceType = healthcareService.resourceType;
															objectHealthcareService.id = healthcareService.id;
															objectHealthcareService.identifier = identifier.data;
															objectHealthcareService.active = healthcareService.active;
															objectHealthcareService.providedBy = healthcareService.providedBy;
															objectHealthcareService.category = healthcareService.category;
															objectHealthcareService.type = healthcareService.type;
															objectHealthcareService.specialty = healthcareService.specialty;
															objectHealthcareService.name = healthcareService.name;
															objectHealthcareService.comment = healthcareService.comment;
															objectHealthcareService.extraDetails = healthcareService.extraDetails;
															objectHealthcareService.attachment_id = healthcareService.attachment_id;
															objectHealthcareService.serviceProvisionCode = healthcareService.serviceProvisionCode;
															objectHealthcareService.eligibility = healthcareService.eligibility;
															objectHealthcareService.eligibilityNote = healthcareService.eligibilityNote;
															objectHealthcareService.programName = healthcareService.programName;
															objectHealthcareService.characteristic = healthcareService.characteristic;
															objectHealthcareService.appointmentRequired = healthcareService.appointmentRequired;
															objectHealthcareService.availabilityExceptions = healthcareService.availabilityExceptions;
															
															newHealthcareService[index] = objectHealthcareService
																
															myEmitter.once('getContactPoint', function(healthcareService, index, newHealthcareService, countHealthcareService){
																			qString = {};
																			qString.healthcare_service_id = healthcareService.id;
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
																					var objectHealthcareService = {};
																					objectHealthcareService.resourceType = healthcareService.resourceType;
																					objectHealthcareService.id = healthcareService.id;
																					objectHealthcareService.identifier = healthcareService.identifier;
																					objectHealthcareService.active = healthcareService.active;
																					objectHealthcareService.providedBy = healthcareService.providedBy;
																					objectHealthcareService.category = healthcareService.category;
																					objectHealthcareService.type = healthcareService.type;
																					objectHealthcareService.specialty = healthcareService.specialty;
																					objectHealthcareService.name = healthcareService.name;
																					objectHealthcareService.comment = healthcareService.comment;
																					objectHealthcareService.extraDetails = healthcareService.extraDetails;
																					objectHealthcareService.attachment_id = healthcareService.attachment_id;
																					objectHealthcareService.telecom = contactPoint.data;
																					objectHealthcareService.serviceProvisionCode = healthcareService.serviceProvisionCode;
																					objectHealthcareService.eligibility = healthcareService.eligibility;
																					objectHealthcareService.eligibilityNote = healthcareService.eligibilityNote;
																					objectHealthcareService.programName = healthcareService.programName;
																					objectHealthcareService.characteristic = healthcareService.characteristic;
																					objectHealthcareService.appointmentRequired = healthcareService.appointmentRequired;
																					objectHealthcareService.availabilityExceptions = healthcareService.availabilityExceptions;
																					
																					newHealthcareService[index] = objectHealthcareService
																					
																					myEmitter.once('getAvailableTime', function(healthcareService, index, newHealthcareService, countHealthcareService){
																						qString = {};
																						qString.healthcare_service_id = healthcareService.id;
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
																								var objectHealthcareService = {};
																								objectHealthcareService.resourceType = healthcareService.resourceType;
																								objectHealthcareService.id = healthcareService.id;
																								objectHealthcareService.identifier = healthcareService.identifier;
																								objectHealthcareService.active = healthcareService.active;
																								objectHealthcareService.providedBy = healthcareService.providedBy;
																								objectHealthcareService.category = healthcareService.category;
																								objectHealthcareService.type = healthcareService.type;
																								objectHealthcareService.specialty = healthcareService.specialty;
																								objectHealthcareService.name = healthcareService.name;
																								objectHealthcareService.comment = healthcareService.comment;
																								objectHealthcareService.extraDetails = healthcareService.extraDetails;
																								objectHealthcareService.attachment_id = healthcareService.attachment_id;
																								objectHealthcareService.telecom = healthcareService.telecom;
																								objectHealthcareService.serviceProvisionCode = healthcareService.serviceProvisionCode;
																								objectHealthcareService.eligibility = healthcareService.eligibility;
																								objectHealthcareService.eligibilityNote = healthcareService.eligibilityNote;
																								objectHealthcareService.programName = healthcareService.programName;
																								objectHealthcareService.characteristic = healthcareService.characteristic;
																								objectHealthcareService.appointmentRequired = healthcareService.appointmentRequired;
																								objectHealthcareService.availableTime = availableTime.data;
																								objectHealthcareService.availabilityExceptions = healthcareService.availabilityExceptions;
																								
																								newHealthcareService[index] = objectHealthcareService			
																								
																								myEmitter.once('getNotAvailable', function(healthcareService, index, newHealthcareService, countHealthcareService){
																									qString = {};
																									qString.healthcare_service_id = healthcareService.id;
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
																											var objectHealthcareService = {};
																											objectHealthcareService.resourceType = healthcareService.resourceType;
																											objectHealthcareService.id = healthcareService.id;
																											objectHealthcareService.identifier = healthcareService.identifier;
																											objectHealthcareService.active = healthcareService.active;
																											objectHealthcareService.providedBy = healthcareService.providedBy;
																											objectHealthcareService.category = healthcareService.category;
																											objectHealthcareService.type = healthcareService.type;
																											objectHealthcareService.specialty = healthcareService.specialty;
																											objectHealthcareService.name = healthcareService.name;
																											objectHealthcareService.comment = healthcareService.comment;
																											objectHealthcareService.extraDetails = healthcareService.extraDetails;
																											objectHealthcareService.attachment_id = healthcareService.attachment_id;
																											objectHealthcareService.telecom = healthcareService.telecom;
																											objectHealthcareService.serviceProvisionCode = healthcareService.serviceProvisionCode;
																											objectHealthcareService.eligibility = healthcareService.eligibility;
																											objectHealthcareService.eligibilityNote = healthcareService.eligibilityNote;
																											objectHealthcareService.programName = healthcareService.programName;
																											objectHealthcareService.characteristic = healthcareService.characteristic;
																											objectHealthcareService.appointmentRequired = healthcareService.appointmentRequired;
																											objectHealthcareService.availableTime = healthcareService.availableTime;
																											objectHealthcareService.notAvailable = notAvailable.data;
																											objectHealthcareService.availabilityExceptions = healthcareService.availabilityExceptions;
																											
																											newHealthcareService[index] = objectHealthcareService		
																											
																											myEmitter.once('getAttachment', function(healthcareService, index, newHealthcareService, countHealthcareService){
																												qString = {};
																												qString._id = healthcareService.attachment_id;
																												//qString.healthcare_service_id = healthcareService.id;
																												seedPhoenixFHIR.path.GET = {
																													"Attachment" : {
																														"location": "%(apikey)s/Attachment",
																														"query": qString
																													}
																												}

																												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																												ApiFHIR.get('Attachment', {"apikey": apikey}, {}, function(error, response, body){
																													attachment = JSON.parse(body);
																													if(attachment.err_code == 0){
																														var objectHealthcareService = {};
																														objectHealthcareService.resourceType = healthcareService.resourceType;
																														objectHealthcareService.id = healthcareService.id;
																														objectHealthcareService.identifier = healthcareService.identifier;
																														objectHealthcareService.active = healthcareService.active;
																														objectHealthcareService.providedBy = healthcareService.providedBy;
																														objectHealthcareService.category = healthcareService.category;
																														objectHealthcareService.type = healthcareService.type;
																														objectHealthcareService.specialty = healthcareService.specialty;
																														objectHealthcareService.name = healthcareService.name;
																														objectHealthcareService.comment = healthcareService.comment;
																														objectHealthcareService.extraDetails = healthcareService.extraDetails;
																														objectHealthcareService.photo = attachment.data;
																														objectHealthcareService.telecom = healthcareService.telecom;
																														objectHealthcareService.serviceProvisionCode = healthcareService.serviceProvisionCode;
																														objectHealthcareService.eligibility = healthcareService.eligibility;
																														objectHealthcareService.eligibilityNote = healthcareService.eligibilityNote;
																														objectHealthcareService.programName = healthcareService.programName;
																														objectHealthcareService.characteristic = healthcareService.characteristic;
																														objectHealthcareService.appointmentRequired = healthcareService.appointmentRequired;
																														objectHealthcareService.availableTime = healthcareService.availableTime;
																														objectHealthcareService.notAvailable = healthcareService.notAvailable;
																														objectHealthcareService.availabilityExceptions = healthcareService.availabilityExceptions;
																														
																														newHealthcareService[index] = objectHealthcareService		
																														/*if(index == countHealthcareService -1 ){
																															res.json({"err_code": 0, "data":newHealthcareService});		
																														}	*/
																														
																														myEmitter.once('getLocation', function(healthcareService, index, newHealthcareService, countHealthcareService){
																															qString = {};
																															qString.healthcare_service_id = healthcareService.id;
																															//qString.healthcare_service_id = healthcareService.id;
																															seedPhoenixFHIR.path.GET = {
																																"HealthcareServiceLocation" : {
																																	"location": "%(apikey)s/HealthcareService/Location",
																																	"query": qString
																																}
																															}

																															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																															ApiFHIR.get('HealthcareServiceLocation', {"apikey": apikey}, {}, function(error, response, body){
																																healthcareServiceLocation = JSON.parse(body);
																																if(healthcareServiceLocation.err_code == 0){
																																	var objectHealthcareService = {};
																																	objectHealthcareService.resourceType = healthcareService.resourceType;
																																	objectHealthcareService.id = healthcareService.id;
																																	objectHealthcareService.identifier = healthcareService.identifier;
																																	objectHealthcareService.active = healthcareService.active;
																																	objectHealthcareService.providedBy = healthcareService.providedBy;
																																	objectHealthcareService.category = healthcareService.category;
																																	objectHealthcareService.type = healthcareService.type;
																																	objectHealthcareService.specialty = healthcareService.specialty;
																																	objectHealthcareService.location = healthcareServiceLocation.data;
																																	objectHealthcareService.name = healthcareService.name;
																																	objectHealthcareService.comment = healthcareService.comment;
																																	objectHealthcareService.extraDetails = healthcareService.extraDetails;
																																	objectHealthcareService.photo = attachment.data;
																																	objectHealthcareService.telecom = healthcareService.telecom;
																																	objectHealthcareService.serviceProvisionCode = healthcareService.serviceProvisionCode;
																																	objectHealthcareService.eligibility = healthcareService.eligibility;
																																	objectHealthcareService.eligibilityNote = healthcareService.eligibilityNote;
																																	objectHealthcareService.programName = healthcareService.programName;
																																	objectHealthcareService.characteristic = healthcareService.characteristic;
																																	objectHealthcareService.appointmentRequired = healthcareService.appointmentRequired;
																																	objectHealthcareService.availableTime = healthcareService.availableTime;
																																	objectHealthcareService.notAvailable = healthcareService.notAvailable;
																																	objectHealthcareService.availabilityExceptions = healthcareService.availabilityExceptions;

																																	newHealthcareService[index] = objectHealthcareService		
																																	myEmitter.once('getCoverageArea', function(healthcareService, index, newHealthcareService, countHealthcareService){
																																		qString = {};
																																		qString.healthcare_service_id = healthcareService.id;
																																		//qString.healthcare_service_id = healthcareService.id;
																																		seedPhoenixFHIR.path.GET = {
																																			"HealthcareServiceCoverageArea" : {
																																				"location": "%(apikey)s/HealthcareService/CoverageArea",
																																				"query": qString
																																			}
																																		}

																																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																		ApiFHIR.get('HealthcareServiceCoverageArea', {"apikey": apikey}, {}, function(error, response, body){
																																			healthcareServiceCoverageArea = JSON.parse(body);
																																			if(healthcareServiceCoverageArea.err_code == 0){
																																				var objectHealthcareService = {};
																																				objectHealthcareService.resourceType = healthcareService.resourceType;
																																				objectHealthcareService.id = healthcareService.id;
																																				objectHealthcareService.identifier = healthcareService.identifier;
																																				objectHealthcareService.active = healthcareService.active;
																																				objectHealthcareService.providedBy = healthcareService.providedBy;
																																				objectHealthcareService.category = healthcareService.category;
																																				objectHealthcareService.type = healthcareService.type;
																																				objectHealthcareService.specialty = healthcareService.specialty;
																																				objectHealthcareService.location = healthcareService.location;
																																				objectHealthcareService.name = healthcareService.name;
																																				objectHealthcareService.comment = healthcareService.comment;
																																				objectHealthcareService.extraDetails = healthcareService.extraDetails;
																																				objectHealthcareService.photo = attachment.data;
																																				objectHealthcareService.telecom = healthcareService.telecom;
																																				objectHealthcareService.coverageArea = healthcareServiceCoverageArea.data;
																																				objectHealthcareService.serviceProvisionCode = healthcareService.serviceProvisionCode;
																																				objectHealthcareService.eligibility = healthcareService.eligibility;
																																				objectHealthcareService.eligibilityNote = healthcareService.eligibilityNote;
																																				objectHealthcareService.programName = healthcareService.programName;
																																				objectHealthcareService.characteristic = healthcareService.characteristic;
																																				objectHealthcareService.appointmentRequired = healthcareService.appointmentRequired;
																																				objectHealthcareService.availableTime = healthcareService.availableTime;
																																				objectHealthcareService.notAvailable = healthcareService.notAvailable;
																																				objectHealthcareService.availabilityExceptions = healthcareService.availabilityExceptions;

																																				newHealthcareService[index] = objectHealthcareService		
																																				myEmitter.once('getEndpoint', function(healthcareService, index, newHealthcareService, countHealthcareService){
																																					qString = {};
																																					qString.healthcare_service_id = healthcareService.id;
																																					//qString.healthcare_service_id = healthcareService.id;
																																					seedPhoenixFHIR.path.GET = {
																																						"HealthcareServiceEndpoint" : {
																																							"location": "%(apikey)s/HealthcareService/Endpoint",
																																							"query": qString
																																						}
																																					}

																																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																					ApiFHIR.get('HealthcareServiceEndpoint', {"apikey": apikey}, {}, function(error, response, body){
																																						healthcareServiceEndpoint = JSON.parse(body);
																																						if(healthcareServiceEndpoint.err_code == 0){
																																							var objectHealthcareService = {};
																																							objectHealthcareService.resourceType = healthcareService.resourceType;
																																							objectHealthcareService.id = healthcareService.id;
																																							objectHealthcareService.identifier = healthcareService.identifier;
																																							objectHealthcareService.active = healthcareService.active;
																																							objectHealthcareService.providedBy = healthcareService.providedBy;
																																							objectHealthcareService.category = healthcareService.category;
																																							objectHealthcareService.type = healthcareService.type;
																																							objectHealthcareService.specialty = healthcareService.specialty;
																																							objectHealthcareService.location = healthcareService.location;
																																							objectHealthcareService.name = healthcareService.name;
																																							objectHealthcareService.comment = healthcareService.comment;
																																							objectHealthcareService.extraDetails = healthcareService.extraDetails;
																																							objectHealthcareService.photo = attachment.data;
																																							objectHealthcareService.telecom = healthcareService.telecom;
																																							objectHealthcareService.coverageArea = healthcareService.coverageArea;
																																							objectHealthcareService.serviceProvisionCode = healthcareService.serviceProvisionCode;
																																							objectHealthcareService.eligibility = healthcareService.eligibility;
																																							objectHealthcareService.eligibilityNote = healthcareService.eligibilityNote;
																																							objectHealthcareService.programName = healthcareService.programName;
																																							objectHealthcareService.characteristic = healthcareService.characteristic;
																																							objectHealthcareService.appointmentRequired = healthcareService.appointmentRequired;
																																							objectHealthcareService.availableTime = healthcareService.availableTime;
																																							objectHealthcareService.notAvailable = healthcareService.notAvailable;
																																							objectHealthcareService.availabilityExceptions = healthcareService.availabilityExceptions;
																																							objectHealthcareService.endpoint = healthcareServiceEndpoint.data;

																																							newHealthcareService[index] = objectHealthcareService		
																																							if(index == countHealthcareService -1 ){
																																								res.json({"err_code": 0, "data":newHealthcareService});		
																																							}	
																																						}else{
																																							res.json(healthcareServiceEndpoint);			
																																						}
																																					})
																																				})
																																				myEmitter.emit('getEndpoint', objectHealthcareService, index, newHealthcareService, countHealthcareService);	
																																			}else{
																																				res.json(healthcareServiceCoverageArea);			
																																			}
																																		})
																																	})
																																	myEmitter.emit('getCoverageArea', objectHealthcareService, index, newHealthcareService, countHealthcareService);	
																																}else{
																																	res.json(healthcareServiceLocation);			
																																}
																															})
																														})
																														myEmitter.emit('getLocation', objectHealthcareService, index, newHealthcareService, countHealthcareService);
																														
																													}else{
																														res.json(attachment);			
																													}
																												})
																											})
																											myEmitter.emit('getAttachment', objectHealthcareService, index, newHealthcareService, countHealthcareService);
																										}else{
																											res.json(notAvailable);			
																										}
																									})
																								})
																								myEmitter.emit('getNotAvailable', objectHealthcareService, index, newHealthcareService, countHealthcareService);
																							}else{
																								res.json(availableTime);			
																							}
																						})
																					})
																					myEmitter.emit('getAvailableTime', objectHealthcareService, index, newHealthcareService, countHealthcareService);
																					
																					
																				}else{
																					res.json(contactPoint);			
																				}
																			})
																		})
															myEmitter.emit('getContactPoint', objectHealthcareService, index, newHealthcareService, countHealthcareService);
														}else{
															res.json(identifier);
														}
													})
												})
									myEmitter.emit("getIdentifier", healthcareService.data[i], i, newHealthcareService, healthcareService.data.length);
									//res.json({"err_code": 0, "err_msg": "Practitioner is not empty."});		
								}
								 //res.json({"err_code": 0, "data":practitioner.data});
							}else{
								res.json({"err_code": 2, "err_msg": "Healthcare Service is empty."});	
							}
						}else{
							res.json(healthcareService);
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

			var healthcareServiceId = req.params.healthcare_service_id;
			var availableTimeId = req.params.available_time_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealthcareServiceId){
						if(resHealthcareServiceId.err_code > 0){
							if(typeof availableTimeId !== 'undefined' && !validator.isEmpty(availableTimeId)){
								checkUniqeValue(apikey, "AVAILABLE_TIME_ID|" + availableTimeId, 'AVAILABLE_TIME', function(resAvailableTimeId){
									if(resAvailableTimeId.err_code > 0){
										//get identifier
										qString = {};
										qString.healthcare_service_id = healthcareServiceId;
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
								qString.healthcare_service_id = healthcareServiceId;
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

			var healthcareServiceId = req.params.healthcare_service_id;
			var notAvailableId = req.params.not_available_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resPractitionerRoleID){
						if(resPractitionerRoleID.err_code > 0){
							if(typeof notAvailableId !== 'undefined' && !validator.isEmpty(notAvailableId)){
								checkUniqeValue(apikey, "NOT_AVAILABLE_ID|" + notAvailableId, 'NOT_AVAILABLE', function(resNotAvailableId){
									if(resNotAvailableId.err_code > 0){
										//get identifier
										qString = {};
										qString.healthcare_service_id = healthcareServiceId;
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
								qString.healthcare_service_id = healthcareServiceId;
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
			var healthcareServiceId = req.params.healthcare_service_id;
			var identifierId = req.params.identifier_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resPractitionerRoleID){
						if(resPractitionerRoleID.err_code > 0){
							if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
								checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
									if(resIdentifierID.err_code > 0){
										//get identifier
										qString = {};
										qString.healthcare_service_id = healthcareServiceId;
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
								qString.healthcare_service_id = healthcareServiceId;
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
			var healthcareServiceId = req.params.healthcare_service_id;
			var contactPointId = req.params.contact_point_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resPractitionerRoleID){
						if(resPractitionerRoleID.err_code > 0){
							if(typeof contactPointId !== 'undefined' && !validator.isEmpty(contactPointId)){
								checkUniqeValue(apikey, "CONTACT_POINT_ID|" + contactPointId, 'CONTACT_POINT', function(resTelecomID){
									if(resTelecomID.err_code > 0){
										qString = {};
										qString.healthcare_service_id = healthcareServiceId;
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
								qString.healthcare_service_id = healthcareServiceId;
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
		},
		attachment: function getAttachment(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var healthcareServiceId = req.params.healthcare_service_id;
					var attachmentId = req.params.attachment_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealthcareServiceID){
								if(resHealthcareServiceID.err_code > 0){
									if(typeof attachmentId !== 'undefined' && !validator.isEmpty(attachmentId)){
										checkUniqeValue(apikey, "ATTACHMENT_ID|" + attachmentId, 'ATTACHMENT', function(resAttachmentID){
											if(resAttachmentID.err_code > 0){
								  			qString = {};
								  			qString.healthcare_service_id = healthcareServiceId;
								  			qString._id = attachmentId;
									  		seedPhoenixFHIR.path.GET = {
													"Attachment" : {
														"location": "%(apikey)s/Attachment",
														"query": qString
													}
												}
												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

												ApiFHIR.get('Attachment', {"apikey": apikey}, {}, function(error, response, body){
													attachment = JSON.parse(body);
													if(attachment.err_code == 0){
														res.json({"err_code": 0, "data":attachment.data});	
													}else{
														res.json(address);
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Attachment Id not found"});		
											}
										})
									}else{
										qString = {};
										qString._id = healthcareServiceId;
										seedPhoenixFHIR.path.GET = {
											"HealthcareService" : {
												"location": "%(apikey)s/HealthcareService",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);
										ApiFHIR.get('HealthcareService', {"apikey": apikey}, {}, function(error, response, body){
											HealthcareService = JSON.parse(body);
											//console.log(HealthcareService.data[0].attachment_id);
											if(HealthcareService.err_code == 0){
												//res.json({"err_code": 0, "data":attachment.data});	
												qString = {};
												qString._id = HealthcareService.data[0].attachment_id;
												//qString.healthcare_service_id = healthcareService.id;
												seedPhoenixFHIR.path.GET = {
													"Attachment" : {
														"location": "%(apikey)s/Attachment",
														"query": qString
													}
												}
												var ApiFHIR = new Apiclient(seedPhoenixFHIR);
												ApiFHIR.get('Attachment', {"apikey": apikey}, {}, function(error, response, body){
													attachment = JSON.parse(body);
													if(attachment.err_code == 0){
															res.json({"err_code": 0, "data":attachment.data});
														}else{
														res.json(attachment);			
													}
												})											
											}else{
												res.json(healthcareService);
											}
										})
									}									
								}else{
									res.json({"err_code": 501, "err_msg": "Healthcare service Id not found"});		
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
		healthcaerService :function postHealthcareService(req, res){
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

			//photo language
			if(typeof req.body.photo.language !== 'undefined'){
				attachmentLanguageCode =  req.body.photo.language;
				if(validator.isEmpty(attachmentLanguageCode)){
					err_code = 2;
					err_msg = "Language is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'language' in json photo request.";
			}

			//photo data
			if(typeof req.body.photo.data !== 'undefined'){
				attachmentData =  req.body.photo.data;
				if(validator.isEmpty(attachmentData)){
					err_code = 2;
					err_msg = "Attachment Data is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'data' in json photo request.";
			}

			//photo size
			if(typeof req.body.photo.size !== 'undefined'){
				attachmentSize =  req.body.photo.size;
				if(validator.isEmpty(attachmentSize)){
					err_code = 2;
					err_msg = "Attachment Size is required";
				}else{
					attachmentSize = bytes(attachmentSize); //convert to bytes because data type is integer	
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'size' in json photo request.";
			}

			//photo title
			if(typeof req.body.photo.title !== 'undefined'){
				attachmentTitle =  req.body.photo.title;
				if(validator.isEmpty(attachmentTitle)){
					err_code = 2;
					err_msg = "Title photo is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'title' in json photo request.";
			}

			//photo content_type
			if(typeof req.body.photo.content_type !== 'undefined'){
				attachmentContentType =  req.body.photo.content_type;
				if(validator.isEmpty(attachmentContentType)){
					err_code = 2;
					err_msg = "Attachment Content-Type is required";
				}else{
					attachmentContentType = attachmentContentType.trim().toLowerCase();
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'content_type' in json photo request.";
			}


			//healthcare service active
			if(typeof req.body.active !== 'undefined'){
				healthcareServiceActive =  req.body.active.trim().toLowerCase();
				if(validator.isEmpty(healthcareServiceActive)){
					err_code = 2;
					err_msg = "healthcare service active is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'active' in json healthcare service request.";
			}

			//healthcare service category
			if(typeof req.body.category !== 'undefined'){
				healthcareServiceCategory =  req.body.category;
				if (isNaN(healthcareServiceCategory)) {
					err_code = 3;
					err_msg = "healthcare service category is not nummber";
				} else {
					if(validator.isEmpty(healthcareServiceCategory)){
						err_code = 2;
						err_msg = "healthcare service category is required";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json healthcare service request.";
			}

			//healthcare service type
			if(typeof req.body.type !== 'undefined'){
				healthcareServiceType =  req.body.type;
				if (isNaN(healthcareServiceType)) {
					err_code = 3;
					err_msg = "healthcare service type is not nummber";
				} else {
					if(validator.isEmpty(healthcareServiceType)){
						err_code = 2;
						err_msg = "healthcare service type is required";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json healthcare service request.";
			}

			//healthcare service speciality
			//practioner role specialty
			if(typeof req.body.specialty !== 'undefined'){
				healthcareServiceSpecialty =  req.body.specialty;
				if (isNaN(healthcareServiceSpecialty)) {
					err_code = 3;
					err_msg = "healthcare service specialty is not nummber";
				} else {
					if(validator.isEmpty(healthcareServiceSpecialty)){
						err_code = 2;
						err_msg = "healthcare service specialty is required";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'specialty' in json healthcare service request.";
			}			

			//healthcare service name
			if(typeof req.body.name !== 'undefined'){
				healthcareServiceName =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(healthcareServiceName)){
					err_code = 2;
					err_msg = "healthcare service name is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'name' in json healthcare service request.";
			}

			//healthcare service comment
			if(typeof req.body.comment !== 'undefined'){
				healthcareServiceComment =  req.body.comment.trim().toLowerCase();
				if(validator.isEmpty(healthcareServiceComment)){
					err_code = 2;
					err_msg = "healthcare service comment is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'comment' in json healthcare service request.";
			}

			//healthcare service extraDetails
			if(typeof req.body.extraDetails !== 'undefined'){
				healthcareServiceExtraDetails =  req.body.extraDetails.trim().toLowerCase();
				if(validator.isEmpty(healthcareServiceExtraDetails)){
					err_code = 2;
					err_msg = "healthcare service extra details is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'extra details' in json healthcare service request.";
			}

			//healthcare service serviceProvisionCode
			if(typeof req.body.serviceProvisionCode !== 'undefined'){
				healthcareServiceProvisionCode =  req.body.serviceProvisionCode.trim().toLowerCase();
				if(validator.isEmpty(healthcareServiceProvisionCode)){
					err_code = 2;
					err_msg = "healthcare service  provision code is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'provision code' in json healthcare service request.";
			}

			//healthcare service eligibility
			if(typeof req.body.eligibility !== 'undefined'){
				healthcareServiceEligibility =  req.body.eligibility.trim().toLowerCase();
				if(validator.isEmpty(healthcareServiceEligibility)){
					err_code = 2;
					err_msg = "healthcare service eligibility is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'eligibility' in json healthcare service request.";
			}

			//healthcare service eligibilityNote
			if(typeof req.body.eligibilityNote !== 'undefined'){
				healthcareServiceEligibilityNote =  req.body.eligibilityNote.trim().toLowerCase();
				if(validator.isEmpty(healthcareServiceEligibilityNote)){
					err_code = 2;
					err_msg = "healthcare service eligibility note is required";
				} 
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'eligibility note' in json healthcare service request.";
			}

			//healthcare service programName
			if(typeof req.body.programName !== 'undefined'){
				healthcareServiceProgramName =  req.body.programName.trim().toLowerCase();
				if(validator.isEmpty(healthcareServiceProgramName)){
					err_code = 2;
					err_msg = "healthcare service program name is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'program name' in json healthcare service request.";
			}

			//healthcare service characteristic
			if(typeof req.body.characteristic !== 'undefined'){
				healthcareServiceCharacteristic =  req.body.characteristic.trim().toLowerCase();
				if(validator.isEmpty(healthcareServiceCharacteristic)){
					err_code = 2;
					err_msg = "healthcare service characteristic is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'characteristic' in json healthcare service request.";
			}

			//healthcare service referralMethod
			if(typeof req.body.referralMethod !== 'undefined'){
				healthcareServiceReferralMethod =  req.body.referralMethod.trim().toLowerCase();
				if(validator.isEmpty(healthcareServiceReferralMethod)){
					err_code = 2;
					err_msg = "healthcare service referral method is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'referral method' in json healthcare service request.";
			}

			//healthcare service appointmentRequired
			if(typeof req.body.appointmentRequired !== 'undefined'){
				healthcareServiceAppointmentRequired =  req.body.appointmentRequired.trim().toLowerCase();
				if(validator.isEmpty(healthcareServiceAppointmentRequired)){
					err_code = 2;
					err_msg = "healthcare service appointment required is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'appointment required' in json healthcare service request.";
			}

			if(typeof req.body.availabilityExceptions !== 'undefined'){
				healthcareServiceAvailabilityExceptions =  req.body.availabilityExceptions.trim().toLowerCase();
				if(validator.isEmpty(healthcareServiceAvailabilityExceptions)){
					err_code = 2;
					err_msg = "healthcareService availability exceptions is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'availability exceptions' in json healthcareService request.";
			}

			// organization
			if(typeof req.body.providedBy !== 'undefined'){
				organizationReference =  req.body.providedBy.trim().toLowerCase();
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

			if(typeof req.body.coverageArea !== 'undefined'){
				locationCoverageAreaReference =  req.body.coverageArea.trim().toLowerCase();
				if(validator.isEmpty(locationCoverageAreaReference)){
					locationCoverageAreaReference = "";
				}
			}else{
				locationCoverageAreaReference = "";
			}

			if(typeof req.body.endpoint !== 'undefined'){
				endpointReference =  req.body.endpoint.trim().toLowerCase();
				if(validator.isEmpty(endpointReference)){
					endpointReference = "";
				}
			}else{
				endpointReference = "";
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
														checkCode(apikey, healthcareServiceCategory, 'SERVICE_CATEGORY', function(resHealthcareServiceCategory){
															if(resHealthcareServiceCategory.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																checkCode(apikey, healthcareServiceType, 'SERVICE_TYPE', function(resHealthcareServiceType){
																	if(resHealthcareServiceType.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																		checkCode(apikey, healthcareServiceSpecialty, 'PRACTICE_CODE', function(resHealthcareServiceSpecialty){
																			if(resHealthcareServiceSpecialty.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																				checkCode(apikey, healthcareServiceProvisionCode, 'SERVICE_PROVISION_CONDITIONS', function(resHealthcareServiceProvisionCode){
																					if(resHealthcareServiceProvisionCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																						checkCode(apikey, healthcareServiceReferralMethod, 'SERVICE_REFERRAL_METHOD', function(resHealthcareServiceReferralMethod){
																							if(resHealthcareServiceReferralMethod.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																								checkCode(apikey, daysOfWeek, 'DAYS_OF_WEEK', function(resHealthcareServiceDaysOfWeek){
																									if(resHealthcareServiceDaysOfWeek.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																										checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resAttachmentLanguageCode){
																											if(resAttachmentLanguageCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																												//event emiter

																												myEmitter.prependOnceListener('checkHealthcareServiceId', function() {
																													checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
																														if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada
																															checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactPointValue, 'CONTACT_POINT', function(resContactPointValue){
																																if(resContactPointValue.err_code == 0){
																																	//proses insert
																																	//set uniqe id
																																	var unicId = uniqid.time();
																																	var healthcareServiceId = 'hcs' + unicId;
																																	var identifierId = 'ide' + unicId;
																																	var contactPointId = 'cop' + unicId;
																																	var availableTime = 'avt' + unicId;
																																	var notAvailable = 'noa' + unicId;
																																	var notAvailable = 'noa' + unicId;
																																	var attachmentId = 'att' + unicId;


																																	dataHealthcareService = {
																																		"id" : healthcareServiceId,
																																		"active" : healthcareServiceActive,
																																		"providedBy" : organizationReference,
																																		"category" : healthcareServiceCategory,
																																		"type" : healthcareServiceType,
																																		"specialty" : healthcareServiceSpecialty,
																																		"location" : locationReference,
																																		"name" : healthcareServiceName,
																																		"comment" : healthcareServiceComment,
																																		"extraDetails" : healthcareServiceExtraDetails,
																																		"coverageArea" : locationCoverageAreaReference,
																																		"serviceProvisionCode" : healthcareServiceProvisionCode,
																																		"eligibility" : healthcareServiceEligibility,
																																		"eligibilityNote" : healthcareServiceEligibilityNote,
																																		"programName" : healthcareServiceProgramName,
																																		"characteristic" : healthcareServiceCharacteristic,
																																		"referralMethod" : healthcareServiceReferralMethod,
																																		"appointmentRequired" : healthcareServiceAppointmentRequired,
																																		"availabilityExceptions" : healthcareServiceAvailabilityExceptions,
																																		"endpoint" : endpointReference,
																																		"attachmentId" : attachmentId
																																	}
																																	ApiFHIR.post('healthcareService', {"apikey": apikey}, {body: dataHealthcareService, json: true}, function(error, response, body){
																																		healthcareService = body;
																																		if(healthcareService.err_code > 0){
																																			res.json(healthcareService);	
																																		}
																																	})

																																	dataAvailableTime = {
																																		"fealthcareServiceId" : healthcareServiceId,
																																		"id" : availableTime,
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
																																		"healthcareServiceId" : healthcareServiceId,
																																		"id" : notAvailable,
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
																																										//"system": identifierSystem,
																																										"value": identifierValue,
																																										"period_start": identifierPeriodStart,
																																										"period_end": identifierPeriodEnd,
																																										"healthcare_service_id" : healthcareServiceId
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
																																											"healthcare_service_id" : healthcareServiceId
																																										}
																																	//console.log(dataContactPoint);
																																	//post to contact point
																																	ApiFHIR.post('contactPoint', {"apikey": apikey}, {body: dataContactPoint, json: true}, function(error, response, body){
																																		contactPoint = body;
																																		if(contactPoint.err_code > 0){
																																			res.json(contactPoint);	
																																		}
																																	})

																																	// attachment
																																	var dataAttachment = {
																																												"id": attachmentId,
																																												"content_type": attachmentContentType,
																																												"language": attachmentLanguageCode,
																																												"data": attachmentData,
																																												"size": attachmentSize,
																																												"hash": sha1(attachmentData),
																																												"title": attachmentTitle,
																																												"creation": getFormattedDate(),
																																												"url": attachmentId,
																																												"healthcare_service_id" : healthcareServiceId
																																											}
																																	//method, endpoint, params, options, callback
																																	ApiFHIR.post('attachment', {"apikey": apikey}, {body: dataAttachment, json:true}, function(error, response, body){
																																		if(error){
																																				res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addPractitioner in attachment insert"});
																																			}else{
																																				//cek apakah ada error atau tidak
																																				var attachment = body; //object
																																				//cek apakah ada error atau tidak
																																				if(attachment.err_code > 0){
																																					res.json(attachment);
																																				}
																																			}
																																	})



																																	res.json({"err_code": 0, "err_msg": "Healthcare Service has been add.", "data": [{"_id": healthcareServiceId}]});

																																}else{
																																	res.json({"err_code": 513, "err_msg": "Telecom value already exist."});			
																																}
																															})
																														}else{
																															res.json({"err_code": 512, "err_msg": "Identifier value already exist."});		
																														}
																													})
																												});



																												myEmitter.prependOnceListener('checkCoverageAreaLocationId', function(){
																													if(validator.isEmpty(locationReference)){
																														myEmitter.emit('checkHealthcareServiceId');
																													}else{
																														checkUniqeValue(apikey, "LOCATION_ID|" + locationCoverageAreaReference, 'LOCATION', function(resLocationID){
																															if(resLocationID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																																myEmitter.emit('checkHealthcareServiceId');
																															}else{
																																res.json({"err_code": 510, "err_msg": "Coverage Area of Location id not found."});	
																															}
																														})
																													}
																												})

																												myEmitter.prependOnceListener('checkLocationId', function(){
																													if(validator.isEmpty(locationReference)){
																														myEmitter.emit('checkCoverageAreaLocationId');
																													}else{
																														checkUniqeValue(apikey, "LOCATION_ID|" + locationReference, 'LOCATION', function(resLocationID){
																															if(resLocationID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																																myEmitter.emit('checkCoverageAreaLocationId');
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
																												res.json({"err_code": 511, "err_msg": "Attachment Language Code not found"});
																											}
																										})
																									}else{
																										res.json({"err_code": 510, "err_msg": "Day Of Week Code not found"});
																									}
																								})
																							}else{
																								res.json({"err_code": 509, "err_msg": "Service Referral Method Code not found"});
																							}
																						})		
																					}else{
																						res.json({"err_code": 508, "err_msg": "Service Provision Code not found"});
																					}
																				})	
																			}else{
																				res.json({"err_code": 507, "err_msg": "Service Specialty Code not found"});
																			}
																		})
																	}else{
																		res.json({"err_code": 506, "err_msg": "Service Type Code not found"});
																	}
																})
															}else{
																res.json({"err_code": 505, "err_msg": "Service Category Code not found"});
															}
														})
													}else{
														res.json({"err_code": 504, "err_msg": "Contact Point Use Code not found"});
													}
												})
											}else{
												res.json({"err_code": 503, "err_msg": "Contact Point System Code not found"});		
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
			var healthcareServiceId = req.params.healthcare_service_id;

			var err_code = 0;
			var err_msg = "";
			
			//input check 
			if(typeof healthcareServiceId !== 'undefined'){
				if(validator.isEmpty(healthcareServiceId)){
					err_code = 1;
					err_msg = "Healthcare Service Id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Healthcare Service Id is required";
			}

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
						checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealthcareServiceId){
							if(resHealthcareServiceId.err_code > 0){
								checkCode(apikey, daysOfWeek, 'DAYS_OF_WEEK', function(resDaysOfWeekCode){
									if(resDaysOfWeekCode.err_code > 0){
										var unicId = uniqid.time();
										var availableTimeId = 'avt' + unicId;
										dataAvailableTime = {
											"healthcareServiceId" : healthcareServiceId,
											"id" : availableTimeId,
											"daysOfWeek" : daysOfWeek,
											"allDay" : allDay,
											"availableStartTime" : availableStartTime,
											"availableEndTime" : availableEndTime
										}
										ApiFHIR.post('availableTime', {"apikey": apikey}, {body: dataAvailableTime, json: true}, function(error, response, body){
											//console.log(body);
											healthcareService = body;
											if(healthcareService.err_code == 0){
												//console.log("tes123");
												res.json({"err_code": 0, "err_msg": "Available Time has been add in this Healthcare Service.", "data": healthcareService.data});
											} else {
												res.json(healthcareService);
											}
										})													
									}else{
										res.json({"err_code": 501, "err_msg": "Days Of Week Code not found"});
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Healthcare Service Id not found"});
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
			var healthcareServiceId = req.params.healthcare_service_id;

			var err_code = 0;
			var err_msg = "";
			
			//input check 
			if(typeof healthcareServiceId !== 'undefined'){
				if(validator.isEmpty(healthcareServiceId)){
					err_code = 1;
					err_msg = "Healthcare Service Id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Healthcare Service Id is required";
			}
			
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
						checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealthcareServiceId){
							if(resHealthcareServiceId.err_code > 0){
								var unicId = uniqid.time();
								var notAvailableId = 'noa' + unicId;
								dataNotAvailable = {
									"healthcareServiceId" : healthcareServiceId,
									"id" : notAvailableId,
									"description" : description,
									"during" : during
								}
								ApiFHIR.post('notAvailable', {"apikey": apikey}, {body: dataNotAvailable, json: true}, function(error, response, body){
									healthcareService = body;
									if(healthcareService.err_code == 0){
										res.json({"err_code": 0, "err_msg": "Not Available has been add in this healthcare service.", "data": healthcareService.data});
									} else {
										res.json(healthcareService);
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Healthcare Service Id not found"});
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
			var healthcareServiceId = req.params.healthcare_service_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof healthcareServiceId !== 'undefined'){
				if(validator.isEmpty(healthcareServiceId)){
					err_code = 1;
					err_msg = "Healthcare Service Id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Healthcare Service Id is required";
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
												checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealthcareServiceId){
													if(resHealthcareServiceId.err_code > 0){
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
															"healthcare_service_id": healthcareServiceId
														}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this healthcare service.", "data": identifier.data});
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
			var healthcareServiceId = req.params.healthcare_service_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof healthcareServiceId !== 'undefined'){
				if(validator.isEmpty(healthcareServiceId)){
					err_code = 1;
					err_msg = "Healthcare Service Id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Healthcare Service Id is required";
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
						checkUniqeValue(apikey, "HEALTHCARE_SERVICE|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealthcareServiceId){
							if(resHealthcareServiceId.err_code > 0){
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
																								"healthcare_service_id": healthcareServiceId
																							}

														ApiFHIR.post('contactPoint', {"apikey": apikey}, {body: dataContactPoint, json: true}, function(error, response, body){
															contactPoint = body;
															if(contactPoint.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Telecom has been add in this Healthcare Service.", "data": contactPoint.data});
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
			var healthcareServiceId = req.params.healthcare_service_id;

			var err_code = 0;
			var err_msg = "";

			if(typeof req.body.endpoint_id !== 'undefined'){
				endpoint_id =  req.body.endpoint_id.trim().toLowerCase();
				if(validator.isEmpty(endpoint_id)){
					err_code = 2;
					err_msg = "Endpoint id of Healcare Service is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'endpoint id' in json Healthcare Service request.";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resHSID){
							if(resHSID.err_code > 0){
								checkUniqeValue(apikey, "ENDPOINT_ID|" + endpoint_id, 'ENDPOINT', function(resEndpointID){
									if(resEndpointID.err_code > 0){
										dataEndpoint = {
											"healthcareServiceId" : healthcareServiceId,
											"id" : endpoint_id,
										}
										ApiFHIR.post('healthcareServiceEndpoint', {"apikey": apikey}, {body: dataEndpoint, json: true}, function(error, response, body){
											//console.log(body);
											healthcareService = body;
											if(healthcareService.err_code == 0){
												//console.log("tes123");
												res.json({"err_code": 0, "err_msg": "Endpoint has been add in this healthcare service.", "data": healthcareService.data});
											} else {
												res.json(healthcareService);
											}
										})													
									}else{
										res.json({"err_code": 501, "err_msg": "Endpoint Id not found"});
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Healthcare Service Id not found"});
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
			var healthcareServiceId = req.params.healthcare_service_id;

			var err_code = 0;
			var err_msg = "";

			if(typeof req.body.location_id !== 'undefined'){
				location_id =  req.body.location_id.trim().toLowerCase();
				if(validator.isEmpty(location_id)){
					err_code = 2;
					err_msg = "Location id of Healthcare Service is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'location id' in json Healthcare Service request.";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resHSID){
							if(resHSID.err_code > 0){
								checkUniqeValue(apikey, "LOCATION_ID|" + location_id, 'LOCATION', function(resLocationID){
									if(resLocationID.err_code > 0){
										dataLocation = {
											"healthcareServiceId" : healthcareServiceId,
											"id" : location_id,
										}
										ApiFHIR.post('healthcareServiceLocation', {"apikey": apikey}, {body: dataLocation, json: true}, function(error, response, body){
											//console.log(body);
											healthcareService = body;
											if(healthcareService.err_code == 0){
												//console.log("tes123");
												res.json({"err_code": 0, "err_msg": "Location has been add in this healthcare service.", "data": healthcareService.data});
											} else {
												res.json(healthcareService);
											}
										})													
									}else{
										res.json({"err_code": 501, "err_msg": "Location Id not found"});
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Healthcare Service Id not found"});
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
		coverageAreaRef: function addCoverageAreaRef(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var healthcareServiceId = req.params.healthcare_service_id;

			var err_code = 0;
			var err_msg = "";

			if(typeof req.body.location_id !== 'undefined'){
				location_id =  req.body.location_id.trim().toLowerCase();
				if(validator.isEmpty(location_id)){
					err_code = 2;
					err_msg = "Location id of Healthcare Service is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'location id' in json Healthcare Service request.";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resHSID){
							if(resHSID.err_code > 0){
								checkUniqeValue(apikey, "LOCATION_ID|" + location_id, 'LOCATION', function(resLocationID){
									if(resLocationID.err_code > 0){
										dataLocation = {
											"healthcareServiceId" : healthcareServiceId,
											"id" : location_id,
										}
										ApiFHIR.post('healthcareServiceCoverageArea', {"apikey": apikey}, {body: dataLocation, json: true}, function(error, response, body){
											//console.log(body);
											healthcareService = body;
											if(healthcareService.err_code == 0){
												//console.log("tes123");
												res.json({"err_code": 0, "err_msg": "Location Coverage Area has been add in this healthcare service.", "data": healthcareService.data});
											} else {
												res.json(healthcareService);
											}
										})													
									}else{
										res.json({"err_code": 501, "err_msg": "Location Id not found"});
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Healthcare Service Id not found"});
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
		/*,
		attachment: function addAttachment(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var healthcareServiceId = req.params.healthcare_service_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof healthcareServiceId !== 'undefined'){
				if(validator.isEmpty(healthcareServiceId)){
					err_code = 2;
					err_msg = "Healthcare Service Id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Healthcare Service Id is required";
			}

			if(typeof req.body.language !== 'undefined'){
				attachmentLanguageCode =  req.body.language;
				if(validator.isEmpty(attachmentLanguageCode)){
					err_code = 2;
					err_msg = "Language is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'language' in json request.";
			}

			//photo data
			if(typeof req.body.data !== 'undefined'){
				attachmentData =  req.body.data;
				if(validator.isEmpty(attachmentData)){
					err_code = 2;
					err_msg = "Attachment Data is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'data' in json request.";
			}

			//photo size
			if(typeof req.body.size !== 'undefined'){
				attachmentSize =  req.body.size;
				if(validator.isEmpty(attachmentSize)){
					err_code = 2;
					err_msg = "Attachment Size is required";
				}else{
					attachmentSize = bytes(attachmentSize); //convert to bytes because data type is integer	
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'size' in json request.";
			}

			//photo title
			if(typeof req.body.title !== 'undefined'){
				attachmentTitle =  req.body.title;
				if(validator.isEmpty(attachmentTitle)){
					err_code = 2;
					err_msg = "Title photo is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'title' in json request.";
			}

			//photo content_type
			if(typeof req.body.content_type !== 'undefined'){
				attachmentContentType =  req.body.content_type;
				if(validator.isEmpty(attachmentContentType)){
					err_code = 2;
					err_msg = "Attachment Content-Type is required";
				}else{
					attachmentContentType = attachmentContentType.trim().toLowerCase();
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'content_type' in json request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealthcareServiceId){
							if(resHealthcareServiceId.err_code > 0){
								checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resLanguage){
									if(resLanguage.err_code > 0){
										// attachment
										var attachmentId = 'att' + uniqid.time();
										var dataAttachment = {
																					"id": attachmentId,
																					"content_type": attachmentContentType,
																					"language": attachmentLanguageCode,
																					"data": attachmentData,
																					"size": attachmentSize,
																					"hash": sha1(attachmentData),
																					"title": attachmentTitle,
																					"creation": getFormattedDate(),
																					//"url": host + ':' + port + '/' + apikey + '/Patient/'+patientId+'/Photo/' + attachmentId,
																					"url": '/Patient/'+healthcareServiceId+'/Photo/' + attachmentId,
																					"healthcare_service_id": healthcareServiceId
																				}

										//method, endpoint, params, options, callback
										ApiFHIR.post('attachment', {"apikey": apikey}, {body: dataAttachment, json:true}, function(error, response, body){
											//cek apakah ada error atau tidak
											var attachment = body; //object
											//cek apakah ada error atau tidak
											if(attachment.err_code == 0){
												res.json({"err_code": 0, "err_msg": "Photo has been add in this Healthcare Service.", "data": attachment.data});
											}else{
												res.json(attachment);		
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Language code not found"});			
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Healthcare Service Id not found"});	
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
		}*/
	},
	put:{
		healthcaerService : function putHealthcaerService(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			var healthcareServiceId = req.params.healthcare_service_id;
			var err_code = 0;
			var err_msg = "";

			var dataHealthcareService = {};
	//console.log(req.body);
			//input check 
			if(typeof healthcareServiceId !== 'undefined'){
				if(validator.isEmpty(healthcareServiceId)){
					err_code = 2;
					err_msg = "healthcare service id is required";
				}
			}else{
				err_code = 1;
				err_msg = "healthcare service id is required";
			}
			
			//healthcare service active
			if(typeof req.body.active !== 'undefined'){
				active =  req.body.active.trim().toLowerCase();
				if(validator.isEmpty(active)){
					err_code = 2;
					err_msg = "Active is required.";
				}else{
					dataHealthcareService.active = active;
				}
			}else{
				active = "";
			}

			//healthcare service category
			if(typeof req.body.category !== 'undefined'){
				category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					err_code = 2;
					err_msg = "category is required.";
				}else{
					if (isNaN(category)) {
						err_code = 3;
						err_msg = "healthcare service category is not nummber";
					} else {
						dataHealthcareService.category = category;
					}
				}
			}else{
				category = "";
			}

			//healthcare service type
			if(typeof req.body.type !== 'undefined'){
				type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					err_code = 2;
					err_msg = "type is required.";
				}else{
					if (isNaN(type)) {
						err_code = 3;
						err_msg = "healthcare service type is not nummber";
					} else {
						dataHealthcareService.type = type;
					}
				}
			}else{
				type = "";
			}

			//healthcare service speciality
			if(typeof req.body.specialty !== 'undefined'){
				specialty =  req.body.specialty.trim().toLowerCase();
				if(validator.isEmpty(specialty)){
					err_code = 2;
					err_msg = "specialty is required.";
				}else{
					if (isNaN(specialty)) {
						err_code = 3;
						err_msg = "healthcare service specialty is not nummber";
					} else {
						dataHealthcareService.specialty = specialty;
					}
				}
			}else{
				specialty = "";
			}
			
			//healthcare service name
			if(typeof req.body.name !== 'undefined'){
				name =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(name)){
					err_code = 2;
					err_msg = "Name is required.";
				}else{
					dataHealthcareService.name = name;
				}
			}else{
				name = "";
			}

			//healthcare service comment
			if(typeof req.body.comment !== 'undefined'){
				comment =  req.body.comment.trim().toLowerCase();
				if(validator.isEmpty(comment)){
					err_code = 2;
					err_msg = "comment is required.";
				}else{
					dataHealthcareService.comment = comment;
				}
			}else{
				comment = "";
			}
			
			//healthcare service extraDetails
			if(typeof req.body.extraDetails !== 'undefined'){
				extraDetails =  req.body.extraDetails.trim().toLowerCase();
				if(validator.isEmpty(extraDetails)){
					err_code = 2;
					err_msg = "extra details is required.";
				}else{
					dataHealthcareService.extraDetails = extraDetails;
				}
			}else{
				extraDetails = "";
			}
			

			//healthcare service serviceProvisionCode
			if(typeof req.body.serviceProvisionCode !== 'undefined'){
				serviceProvisionCode =  req.body.serviceProvisionCode.trim().toLowerCase();
				if(validator.isEmpty(serviceProvisionCode)){
					err_code = 2;
					err_msg = "service provision code is required.";
				}else{
					dataHealthcareService.serviceProvisionCode = serviceProvisionCode;
				}
			}else{
				serviceProvisionCode = "";
			}

			//healthcare service eligibility
			if(typeof req.body.eligibility !== 'undefined'){
				eligibility =  req.body.eligibility.trim().toLowerCase();
				if(validator.isEmpty(eligibility)){
					err_code = 2;
					err_msg = "eligibility is required.";
				}else{
					dataHealthcareService.eligibility = eligibility;
				}
			}else{
				eligibility = "";
			}
			

			//healthcare service eligibilityNote
			if(typeof req.body.eligibilityNote !== 'undefined'){
				eligibilityNote =  req.body.eligibilityNote.trim().toLowerCase();
				if(validator.isEmpty(eligibilityNote)){
					err_code = 2;
					err_msg = "eligibility note is required.";
				}else{
					dataHealthcareService.eligibilityNote = eligibilityNote;
				}
			}else{
				eligibilityNote = "";
			}

			//healthcare service programName
			if(typeof req.body.programName !== 'undefined'){
				programName =  req.body.programName.trim().toLowerCase();
				if(validator.isEmpty(programName)){
					err_code = 2;
					err_msg = "program name is required.";
				}else{
					dataHealthcareService.programName = programName;
				}
			}else{
				programName = "";
			}

			//healthcare service characteristic
			if(typeof req.body.characteristic !== 'undefined'){
				characteristic =  req.body.characteristic.trim().toLowerCase();
				if(validator.isEmpty(characteristic)){
					err_code = 2;
					err_msg = "characteristic is required.";
				}else{
					dataHealthcareService.characteristic = characteristic;
				}
			}else{
				characteristic = "";
			}

			//healthcare service referralMethod
			if(typeof req.body.referralMethod !== 'undefined'){
				referralMethod =  req.body.referralMethod.trim().toLowerCase();
				if(validator.isEmpty(referralMethod)){
					err_code = 2;
					err_msg = "referral method is required.";
				}else{
					dataHealthcareService.referralMethod = referralMethod;
				}
			}else{
				referralMethod = "";
			}

			//healthcare service appointmentRequired
			if(typeof req.body.appointmentRequired !== 'undefined'){
				appointmentRequired =  req.body.appointmentRequired.trim().toLowerCase();
				if(validator.isEmpty(appointmentRequired)){
					err_code = 2;
					err_msg = "appointment required is required.";
				}else{
					dataHealthcareService.appointmentRequired = appointmentRequired;
				}
			}else{
				appointmentRequired = "";
			}

			if(typeof req.body.availabilityExceptions !== 'undefined'){
				availabilityExceptions =  req.body.availabilityExceptions.trim().toLowerCase();
				if(validator.isEmpty(availabilityExceptions)){
					err_code = 2;
					err_msg = "availability exceptions is required.";
				}else{
					dataHealthcareService.availabilityExceptions = availabilityExceptions;
				}
			}else{
				availabilityExceptions = "";
			}

			// organization
			if(typeof req.body.providedBy !== 'undefined'){
				providedBy =  req.body.providedBy.trim().toLowerCase();
				if(validator.isEmpty(providedBy)){
					err_code = 2;
					err_msg = "providedBy is required.";
				}else{
					dataHealthcareService.providedBy = providedBy;
				}
			}else{
				providedBy = "";
			}

			// location
			if(typeof req.body.location !== 'undefined'){
				location =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(location)){
					err_code = 2;
					err_msg = "location is required.";
				}else{
					dataHealthcareService.location = location;
				}
			}else{
				location = "";
			}
			
			if(typeof req.body.coverageArea !== 'undefined'){
				coverageArea =  req.body.coverageArea.trim().toLowerCase();
				if(validator.isEmpty(coverageArea)){
					err_code = 2;
					err_msg = "coverage area is required.";
				}else{
					dataHealthcareService.coverageArea = coverageArea;
				}
			}else{
				coverageArea = "";
			}
			
			if(typeof req.body.endpoint !== 'undefined'){
				endpoint =  req.body.endpoint.trim().toLowerCase();
				if(validator.isEmpty(endpoint)){
					err_code = 2;
					err_msg = "endpoint is required.";
				}else{
					dataHealthcareService.endpoint = endpoint;
				}
			}else{
				endpoint = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkHealthcareServiceId', function(){
							checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealthcareServiceId){
								if(resHealthcareServiceId.err_code > 0){
									//console.log(dataEndpoint);
										ApiFHIR.put('healthcareService', {"apikey": apikey, "_id": healthcareServiceId}, {body: dataHealthcareService, json: true}, function(error, response, body){
											healthcareService = body;
											if(healthcareService.err_code > 0){
												res.json(healthcareService);	
											}else{
												res.json({"err_code": 0, "err_msg": "Healthcare service has been update.", "data": healthcareService.data});
											}
										})
								}else{
									res.json({"err_code": 508, "err_msg": "Healthcare service Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkEndpointId', function(){
							if(validator.isEmpty(endpoint)){
								myEmitter.emit('checkHealthcareServiceId');
							}else{
								checkUniqeValue(apikey, "ENDPOINT_ID|" + endpoint, 'ENDPOINT', function(resEndpointID){
									if(resEndpointID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkHealthcareServiceId');
									}else{
										res.json({"err_code": 507, "err_msg": "Endpoint id not found."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkCoverAreaId', function(){
							if(validator.isEmpty(coverageArea)){
								myEmitter.emit('checkEndpointId');
							}else{
								checkUniqeValue(apikey, "LOCATION_ID|" + coverageArea, 'LOCATION', function(resCoverAresLocationID){
									if(resCoverAresLocationID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkEndpointId');
									}else{
										res.json({"err_code": 506, "err_msg": "Cover area of location id not found."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkLocationId', function(){
							if(validator.isEmpty(location)){
								myEmitter.emit('checkCoverAreaId');
							}else{
								checkUniqeValue(apikey, "LOCATION_ID|" + location, 'LOCATION', function(resLocationID){
									if(resLocationID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkCoverAreaId');
									}else{
										res.json({"err_code": 505, "err_msg": "Location id not found."});	
									}
								})
							}
						})						

						myEmitter.prependOnceListener('checkOrganizationId', function(){
							if(validator.isEmpty(providedBy)){
								myEmitter.emit('checkLocationId');
							}else{
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + providedBy, 'Organization', function(resProvidedBy){
									if(resProvidedBy.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkLocationId');
									}else{
										res.json({"err_code": 504, "err_msg": "Provided By Organization id not found."});	
									}
								})
							}
						})
						
						myEmitter.prependOnceListener('checkCategory', function(){
							if(validator.isEmpty(category)){
								myEmitter.emit('checkOrganizationId');
							}else{
								checkCode(apikey, category, 'SERVICE_CATEGORY', function(resCategory){
									if(resCategory.err_code > 0){
										myEmitter.emit('checkOrganizationId');
									}else{
										res.json({"err_code": 503, "err_msg": "Healthcare service category not found."});	
									}
								})
							}
						})
						
						myEmitter.prependOnceListener('checkType', function(){
							if(validator.isEmpty(type)){
								myEmitter.emit('checkCategory');
							}else{
								checkCode(apikey, type, 'SERVICE_TYPE', function(resType){
									if(resType.err_code > 0){
										myEmitter.emit('checkCategory');
									}else{
										res.json({"err_code": 503, "err_msg": "Healthcare service type not found."});	
									}
								})
							}
						})
						
						myEmitter.prependOnceListener('checkSpecialty', function(){
							if(validator.isEmpty(specialty)){
								myEmitter.emit('checkType');
							}else{
								checkCode(apikey, specialty, 'PRACTICE_CODE', function(resPractionerRoleSpecialtyCode){
									if(resPractionerRoleSpecialtyCode.err_code > 0){
										myEmitter.emit('checkType');
									}else{
										res.json({"err_code": 502, "err_msg": "Healthcare service Specialty not found."});	
									}
								})
							}
						})
						
						myEmitter.prependOnceListener('checkServiceProvisionCode', function(){
							if(validator.isEmpty(serviceProvisionCode)){
								myEmitter.emit('checkSpecialty');
							}else{
								checkCode(apikey, serviceProvisionCode, 'SERVICE_PROVISION_CONDITIONS', function(resServiceProvisionCode){
									if(resServiceProvisionCode.err_code > 0){
										myEmitter.emit('checkSpecialty');
									}else{
										res.json({"err_code": 502, "err_msg": "Healthcare service Specialty not found."});	
									}
								})
							}
						})

						if(validator.isEmpty(referralMethod)){
							myEmitter.emit('checkServiceProvisionCode');
						}else{
							checkCode(apikey, referralMethod, 'SERVICE_REFERRAL_METHOD', function(resReferralMethod){
								if(resReferralMethod.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkServiceProvisionCode');
								}else{
									res.json({"err_code": 501, "err_msg": "Healthcare service referral methodis not exist."});
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
			var healthcareServiceId = req.params.healthcare_service_id;
			var availableTimeId = req.params.available_time_id;

			var err_code = 0;
			var err_msg = "";
			var dataAvailableTime = {};
			//input check 
			if(typeof healthcareServiceId !== 'undefined'){
				if(validator.isEmpty(healthcareServiceId)){
					err_code = 2;
					err_msg = "Healthcare Service Id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Healthcare Service Id is required";
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
						myEmitter.prependOnceListener('checkHealthcareServiceId', function(){
							checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealthcareServiceId){
								if(resHealthcareServiceId.err_code > 0){
									checkUniqeValue(apikey, "AVAILABLE_TIME_ID|" + availableTimeId, 'AVAILABLE_TIME', function(resAvailableTimeId){
										if(resAvailableTimeId.err_code > 0){
											ApiFHIR.put('availableTime', {"apikey": apikey, "_id": availableTimeId, "dr": "HEALTHCARE_SERVICE_ID|"+healthcareServiceId}, {body: dataAvailableTime, json: true}, function(error, response, body){
												availableTime = body;
												//console.log(availableTime);
												if(availableTime.err_code > 0){
													res.json(availableTime);	
												}else{
													res.json({"err_code": 0, "err_msg": "available time has been update in this Healthcare Service Id.", "data": availableTime.data});
												}
											})
										}else{
											res.json({"err_code": 502, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 501, "err_msg": "Healthcare Service Id not found"});		
								}
							})
						})

						if(validator.isEmpty(daysOfWeek)){
							myEmitter.emit('checkHealthcareServiceId');	
						}else{
							checkCode(apikey, daysOfWeek, 'DAYS_OF_WEEK', function(resDaysOfWeekCode){
								if(resDaysOfWeekCode.err_code > 0){
									myEmitter.emit('checkHealthcareServiceId');
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
			var healthcareServiceId = req.params.healthcare_service_id;
			var notAvailableId = req.params.not_available_id;

			var err_code = 0;
			var err_msg = "";
			var dataNotAvailable = {};
			//input check 
			if(typeof healthcareServiceId !== 'undefined'){
				if(validator.isEmpty(healthcareServiceId)){
					err_code = 2;
					err_msg = "Healthcare Service Id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Healthcare Service Id is required";
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
						myEmitter.prependOnceListener('checkHealthcareServiceId', function(){
							checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealthcareServiceId){
								if(resHealthcareServiceId.err_code > 0){
									checkUniqeValue(apikey, "NOT_AVAILABLE_ID|" + notAvailableId, 'NOT_AVAILABLE', function(resNotAvailableId){
										if(resNotAvailableId.err_code > 0){
											ApiFHIR.put('notAvailable', {"apikey": apikey, "_id": notAvailableId, "dr": "HEALTHCARE_SERVICE_ID|"+healthcareServiceId}, {body: dataNotAvailable, json: true}, function(error, response, body){
												notAvailable = body;
												if(notAvailable.err_code > 0){
													res.json(notAvailable);	
												}else{
													res.json({"err_code": 0, "err_msg": "not available has been update in this healthcare service.", "data": notAvailable.data});
												}
											})
										}else{
											res.json({"err_code": 502, "err_msg": "Not Available Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 501, "err_msg": "Healthcare Service Id not found"});		
								}
							})
						})

						myEmitter.emit('checkHealthcareServiceId');	
						
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
			var healthcareServiceId = req.params.healthcare_service_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof healthcareServiceId !== 'undefined'){
				if(validator.isEmpty(healthcareServiceId)){
					err_code = 2;
					err_msg = "Healthcare Service Id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Healthcare Service Id is required";
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
						myEmitter.prependOnceListener('checkHealthcareServiceId', function(){
							checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(resHealthcareServiceId){
								if(resHealthcareServiceId.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "HEALTHCARE_SERVICE_ID|"+healthcareServiceId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this healthcare service.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Healthcare Service Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkHealthcareServiceId');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkHealthcareServiceId');				
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
			var healthcareServiceId = req.params.healthcare_service_id;
			var contactPointId = req.params.contact_point_id;

			var err_code = 0;
			var err_msg = "";
			var dataContactPoint = {};

			//input check 
			if(typeof healthcareServiceId !== 'undefined'){
				if(validator.isEmpty(healthcareServiceId)){
					err_code = 2;
					err_msg = "Healthcare Service Id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Healthcare Service Id is required";
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
						myEmitter.prependOnceListener('checkhealthcareServiceId', function(){
							checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(reshealthcareServiceId){
								if(reshealthcareServiceId.err_code > 0){
									checkUniqeValue(apikey, "CONTACT_POINT_ID|" + contactPointId, 'CONTACT_POINT', function(resContactPointID){
										if(resContactPointID.err_code > 0){
											ApiFHIR.put('contactPoint', {"apikey": apikey, "_id": contactPointId, "dr": "HEALTHCARE_SERVICE_ID|"+healthcareServiceId}, {body: dataContactPoint, json: true}, function(error, response, body){
												contactPoint = body;
												if(contactPoint.err_code > 0){
													res.json(contactPoint);	
												}else{
													res.json({"err_code": 0, "err_msg": "Telecom has been update in this healthcare service.", "data": contactPoint.data});
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
								myEmitter.emit('checkhealthcareServiceId');
							}else{
								checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactPointValue, 'CONTACT_POINT', function(resContactPointValue){
									if(resContactPointValue.err_code == 0){
										myEmitter.emit('checkhealthcareServiceId');				
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
		},
		attachment: function updateAttachment(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var healthcareServiceId = req.params.healthcare_service_id;
			var attachmentId = req.params.attachment_id;

			var err_code = 0;
			var err_msg = "";
			var dataAttachment = {};

			//input check 
			if(typeof healthcareServiceId !== 'undefined'){
				if(validator.isEmpty(healthcareServiceId)){
					err_code = 2;
					err_msg = "Healthcare Service Id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Healthcare Service Id is required";
			}

			if(typeof attachmentId !== 'undefined'){
				if(validator.isEmpty(attachmentId)){
					err_code = 2;
					err_msg = "Photo id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Photo id is required";
			}

			if(typeof req.body.language !== 'undefined'){
				attachmentLanguageCode =  req.body.language;
				if(validator.isEmpty(attachmentLanguageCode)){
					err_code = 2;
					err_msg = "Language is required";
				}else{
					dataAttachment.language = attachmentLanguageCode;
				}
			}else{
				attachmentLanguageCode = "";
			}

			//photo data
			if(typeof req.body.data !== 'undefined'){
				attachmentData =  req.body.data;
				if(validator.isEmpty(attachmentData)){
					err_code = 2;
					err_msg = "Attachment Data is required";
				}else{
					dataAttachment.data = attachmentData;
				}
			}else{
				attachmentData = "";
			}

			//photo size
			if(typeof req.body.size !== 'undefined'){
				attachmentSize =  req.body.size;
				if(validator.isEmpty(attachmentSize)){
					err_code = 2;
					err_msg = "Attachment Size is required";
				}else{
					attachmentSize = bytes(attachmentSize); //convert to bytes because data type is integer	
					dataAttachment.size = attachmentSize;
				}
			}

			//photo title
			if(typeof req.body.title !== 'undefined'){
				attachmentTitle =  req.body.title;
				if(validator.isEmpty(attachmentTitle)){
					err_code = 2;
					err_msg = "Title photo is required";
				}else{
					dataAttachment.title = attachmentTitle;
				}
			}

			//photo content_type
			if(typeof req.body.content_type !== 'undefined'){
				attachmentContentType =  req.body.content_type;
				if(validator.isEmpty(attachmentContentType)){
					err_code = 2;
					err_msg = "Attachment Content-Type is required";
				}else{
					attachmentContentType = attachmentContentType.trim().toLowerCase();
					dataAttachment.content_type = attachmentContentType;
				}
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependListener('checkhealthcareServiceId', function(){
							checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + healthcareServiceId, 'HEALTHCARE_SERVICE', function(reshealthcareServiceId){
								if(reshealthcareServiceId.err_code > 0){
									checkUniqeValue(apikey, "ATTACHMENT_ID|" + attachmentId, 'ATTACHMENT', function(resAttachmentID){
										if(resAttachmentID.err_code > 0){
											ApiFHIR.put('attachment', {"apikey": apikey, "_id": attachmentId, "dr": ""}, {body: dataAttachment, json: true}, function(error, response, body){
												attachment = body;
												if(attachment.err_code > 0){
													res.json(attachment);	
												}else{
													res.json({"err_code": 0, "err_msg": "Photo has been update in this healthcare service.", "data": attachment.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Photo Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Healthcare Service Id not found"});		
								}
							})
						})

						if(validator.isEmpty(attachmentLanguageCode)){
							myEmitter.emit('checkhealthcareServiceId');	
						}else{
							checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resLanguageCode){
								if(resLanguageCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkhealthcareServiceId');
								}else{
									res.json({"err_code": 501, "err_msg": "Language Code not found"});
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