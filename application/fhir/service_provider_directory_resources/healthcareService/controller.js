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
	get: function getHealthcareService(req, res){
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
															objectHealthcareService.location = healthcareService.location;
															objectHealthcareService.name = healthcareService.name;
															objectHealthcareService.comment = healthcareService.comment;
															objectHealthcareService.extraDetails = healthcareService.extraDetails;
															objectHealthcareService.attachment_id = healthcareService.attachment_id;
															objectHealthcareService.coverageArea = healthcareService.coverageArea;
															objectHealthcareService.serviceProvisionCode = healthcareService.serviceProvisionCode;
															objectHealthcareService.eligibility = healthcareService.eligibility;
															objectHealthcareService.eligibilityNote = healthcareService.eligibilityNote;
															objectHealthcareService.programName = healthcareService.programName;
															objectHealthcareService.characteristic = healthcareService.characteristic;
															objectHealthcareService.appointmentRequired = healthcareService.appointmentRequired;
															objectHealthcareService.endpoint = healthcareService.endpoint;
															
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
																					objectHealthcareService.location = healthcareService.location;
																					objectHealthcareService.name = healthcareService.name;
																					objectHealthcareService.comment = healthcareService.comment;
																					objectHealthcareService.extraDetails = healthcareService.extraDetails;
																					objectHealthcareService.attachment_id = healthcareService.attachment_id;
																					objectHealthcareService.telecom = contactPoint.data;
																					objectHealthcareService.coverageArea = healthcareService.coverageArea;
																					objectHealthcareService.serviceProvisionCode = healthcareService.serviceProvisionCode;
																					objectHealthcareService.eligibility = healthcareService.eligibility;
																					objectHealthcareService.eligibilityNote = healthcareService.eligibilityNote;
																					objectHealthcareService.programName = healthcareService.programName;
																					objectHealthcareService.characteristic = healthcareService.characteristic;
																					objectHealthcareService.appointmentRequired = healthcareService.appointmentRequired;
																					objectHealthcareService.endpoint = healthcareService.endpoint;

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
																								objectHealthcareService.location = healthcareService.location;
																								objectHealthcareService.name = healthcareService.name;
																								objectHealthcareService.comment = healthcareService.comment;
																								objectHealthcareService.extraDetails = healthcareService.extraDetails;
																								objectHealthcareService.attachment_id = healthcareService.attachment_id;
																								objectHealthcareService.telecom = healthcareService.telecom;
																								objectHealthcareService.coverageArea = healthcareService.coverageArea;
																								objectHealthcareService.serviceProvisionCode = healthcareService.serviceProvisionCode;
																								objectHealthcareService.eligibility = healthcareService.eligibility;
																								objectHealthcareService.eligibilityNote = healthcareService.eligibilityNote;
																								objectHealthcareService.programName = healthcareService.programName;
																								objectHealthcareService.characteristic = healthcareService.characteristic;
																								objectHealthcareService.appointmentRequired = healthcareService.appointmentRequired;
																								objectHealthcareService.availableTime = availableTime.data;
																								objectHealthcareService.endpoint = healthcareService.endpoint;

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
																											objectHealthcareService.location = healthcareService.location;
																											objectHealthcareService.name = healthcareService.name;
																											objectHealthcareService.comment = healthcareService.comment;
																											objectHealthcareService.extraDetails = healthcareService.extraDetails;
																											objectHealthcareService.attachment_id = healthcareService.attachment_id;
																											objectHealthcareService.telecom = healthcareService.telecom;
																											objectHealthcareService.coverageArea = healthcareService.coverageArea;
																											objectHealthcareService.serviceProvisionCode = healthcareService.serviceProvisionCode;
																											objectHealthcareService.eligibility = healthcareService.eligibility;
																											objectHealthcareService.eligibilityNote = healthcareService.eligibilityNote;
																											objectHealthcareService.programName = healthcareService.programName;
																											objectHealthcareService.characteristic = healthcareService.characteristic;
																											objectHealthcareService.appointmentRequired = healthcareService.appointmentRequired;
																											objectHealthcareService.availableTime = healthcareService.availableTime;
																											objectHealthcareService.notAvailable = notAvailable.data;
																											objectHealthcareService.endpoint = healthcareService.endpoint;

																											newHealthcareService[index] = objectHealthcareService		
																											
																											myEmitter.once('getAttachment', function(healthcareService, index, newHealthcareService, countHealthcareService){
																												qString = {};
																												qString.attachment_id = healthcareService.attachment_id;
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
																														objectHealthcareService.endpoint = healthcareService.endpoint;

																														newHealthcareService[index] = objectHealthcareService		
																														if(index == countHealthcareService -1 ){
																															res.json({"err_code": 0, "data":newHealthcareService});		
																														}	
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
	post: function postHealthcareService(req, res){
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
			healthcareServiceCategory =  req.body.category.trim().toLowerCase();
			if(validator.isEmpty(healthcareServiceCategory)){
				err_code = 2;
				err_msg = "healthcare service category is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'category' in json healthcare service request.";
		}
		
		//healthcare service type
		if(typeof req.body.type !== 'undefined'){
			healthcareServiceType =  req.body.type.trim().toLowerCase();
			if(validator.isEmpty(healthcareServiceType)){
				err_code = 2;
				err_msg = "healthcare service is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'type' in json Organization request.";
		}
		
		//healthcare service speciality
		if(typeof req.body.specialty !== 'undefined'){
			healthcareServiceSpecialty =  req.body.specialty.trim().toLowerCase();
			if(validator.isEmpty(healthcareServiceSpecialty)){
				err_code = 2;
				err_msg = "healthcare service specialty is required";
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
				err_code = 2;
				err_msg = "Organization Reference is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'organization' in json Reference request.";
		}
		
		// location
		if(typeof req.body.location !== 'undefined'){
			locationReference =  req.body.location.trim().toLowerCase();
			if(validator.isEmpty(locationReference)){
				err_code = 2;
				err_msg = "Location Reference is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'location' in json Reference request.";
		}
		
		if(typeof req.body.coverageArea !== 'undefined'){
			locationCoverageAreaReference =  req.body.coverageArea.trim().toLowerCase();
			if(validator.isEmpty(locationCoverageAreaReference)){
				err_code = 2;
				err_msg = "Location Coverage Area Reference is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'location coverage area' in json Reference request.";
		}
	
		if(typeof req.body.endpoint !== 'undefined'){
			endpointReference =  req.body.endpoint.trim().toLowerCase();
			if(validator.isEmpty(endpointReference)){
				err_code = 2;
				err_msg = "Endpoint Reference is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'endpoint' in json Reference request.";
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
																																		checkUniqeValue(apikey, "ORGANIZATION_ID|" + organizationReference, 'ORGANIZATION', function(resPartOfValue){
																																			if(organizationReference == 'null') {
																																				resPartOfValue.err_code = 2;
																																			}
																																			if(resPartOfValue.err_code == 2){
																																				checkUniqeValue(apikey, "LOCATION_ID|" + locationReference, 'LOCATION', function(resLocationValue){
																																					if(locationReference == 'null') {
																																						resLocationValue.err_code = 2;
																																					}
																																					if(resLocationValue.err_code == 2){
																																						checkUniqeValue(apikey, "LOCATION_ID|" + locationCoverageAreaReference, 'LOCATION', function(resLocationCoverageAreaValue){
																																							if(locationCoverageAreaReference == 'null') {
																																								resLocationCoverageAreaValue.err_code = 2;
																																							}
																																							if(resLocationCoverageAreaValue.err_code == 2){
																																								checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointReference, 'ENDPOINT', function(resEndpointValue){
																																									if(endpointReference == 'null') {
																																										resEndpointValue.err_code = 2;
																																									}
																																									if(resEndpointValue.err_code == 2){
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
																																										console.log(dataContactPoint);
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
																																																					"url": attachmentId
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
																																										res.json({"err_code": 513, "err_msg": "Endpoint value is not exist."});
																																									}
																																								})
																																							}else{
																																								res.json({"err_code": 515, "err_msg": "Location Coverage Area value is not exist."});
																																							}
																																						})
																																					}else{
																																						res.json({"err_code": 515, "err_msg": "Location value is not exist."});
																																					}
																																				})
																																			}else{
																																				res.json({"err_code": 514, "err_msg": "Organization value is not exist."});			
																																			}
																																		})
																																	}else{
																																		res.json({"err_code": 513, "err_msg": "Telecom value already exist."});			
																																	}
																																})
																															}else{
																																res.json({"err_code": 512, "err_msg": "Identifier value already exist."});		
																															}
																														})

																												});
																												myEmitter.emit('checkHealthcareServiceId');
													
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