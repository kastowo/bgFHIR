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
	get: function getPractitioner(req, res){
		var ipAddres = req.connection.remoteAddress;
		var apikey = req.params.apikey;
		var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
		
		//params from query string
		
		var practitionerId = req.query._id;
		var practitionerActive = req.query.active;
		var practitionerAddress = req.query.address;
		var practitionerAddressCity = req.query.city;
		var practitionerAddressCountry = req.query.country;
		var practitionerAddressPostalcode = req.query.postal_code;
		var practitionerAddressState = req.query.state;
		var practitionerAddressUse = req.query.address_use;
		var practitionerCommunication = req.query.communication;
		//var contactPointWhere = req.query.email; //tidak ditemukan field
		var humanNameFamily = req.query.family;
		var practitionerGender = req.query.gender;
		var humanNameGiven = req.query.given;
		var identifierValue = req.query.identifier;
		var humanName = req.query.name;
		//var contactPointWhere = req.query.phone;
		var contactPointValue = req.query.telecom;

		var qString = {};
		
		if(typeof practitionerId !== 'undefined'){
			if(!validator.isEmpty(practitionerId)){
				qString._id = practitionerId; 
			}else{
				res.json({"err_code": 1, "err_msg": "practitioner id is required."});
			}
		}
		
		if(typeof practitionerActive !== 'undefined'){
			if(!validator.isEmpty(practitionerActive)){
				qString.active = practitionerActive; 
			}else{
				res.json({"err_code": 1, "err_msg": "practitioner active is required."});
			}
		}
		
		if(typeof practitionerGender !== 'undefined'){
			if(!validator.isEmpty(practitionerGender)){
				qString.gender = practitionerGender;
			}else{
				res.json({"err_code": 1, "err_msg": "practitioner gender is empty."});
			}
		}
		
		if(typeof practitionerAddress !== 'undefined'){
			if(!validator.isEmpty(practitionerAddress)){
				practitionerAddress = decodeURI(practitionerAddress);
				if(practitionerAddress.indexOf(" ") > 0){
					qString.address = practitionerAddress.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.address = practitionerAddress; 	
				}
			}else{
				res.json({"err_code": 1, "err_msg": "Address is empty."});
			}
		}

		if(typeof practitionerAddressCity !== 'undefined'){
			if(!validator.isEmpty(practitionerAddressCity)){
				practitionerAddressCity = decodeURI(practitionerAddressCity);
				if(practitionerAddressCity.indexOf(" ") > 0){
					qString.city = practitionerAddressCity.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.city = practitionerAddressCity; 
				}
			}else{
				res.json({"err_code": 1, "err_msg": "City is empty."});
			}
		}

		if(typeof practitionerAddressCountry !== 'undefined'){
			if(!validator.isEmpty(practitionerAddressCountry)){
				practitionerAddressCountry = decodeURI(practitionerAddressCountry);
				if(practitionerAddressCountry.indexOf(" ") > 0){
					qString.country = practitionerAddressCountry.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.country = practitionerAddressCountry; 
				}						
			}else{
				res.json({"err_code": 1, "err_msg": "Country is empty."});
			}
		}

		if(typeof practitionerAddressPostalCode !== 'undefined'){
			if(validator.isPostalCode(practitionerAddressPostalCode, 'any')){
				qString.postalcode = practitionerAddressPostalCode; 
			}else{
				res.json({"err_code": 1, "err_msg": "Postal code is invalid format."});
			}
		}

		if(typeof practitionerAddressState !== 'undefined'){
			if(!validator.isEmpty(practitionerAddressState)){
				practitionerAddressState = decodeURI(practitionerAddressState);
				if(practitionerAddressState.indexOf(" ") > 0){
					qString.state = practitionerAddressState.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.state = practitionerAddressState; 
				}
			}else{
				res.json({"err_code": 1, "err_msg": "State is empty."});
			}
		}

		if(typeof practitionerAddressUse !== 'undefined'){
			if(!validator.isEmpty(practitionerAddressUse)){
				qString.addressUse = practitionerAddressUse; 
			}else{
				res.json({"err_code": 1, "err_msg": "Address use code is empty."});
			}
		}

		if(typeof practitionerCommunication !== 'undefined'){
			if(!validator.isEmpty(practitionerCommunication)){
				qString.practitioner_communication = practitionerCommunication;
			}else{
				res.json({"err_code": 1, "err_msg": "practitioner communication is empty."});
			}
		}

		if(typeof humanNameFamily !== 'undefined'){
			if(!validator.isEmpty(humanNameFamily)){
				humanNameFamily = decodeURI(humanNameFamily);
				if(humanNameFamily.indexOf(" ") > 0){
					qString.human_name_family = humanNameFamily.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.human_name_family = humanNameFamily; 	
				}
			}else{
				res.json({"err_code": 1, "err_msg": "human name family is empty."});
			}
		}
		
		if(typeof humanNameGiven !== 'undefined'){
			if(!validator.isEmpty(humanNameGiven)){
				humanNameGiven = decodeURI(humanNameGiven);
				if(humanNameGiven.indexOf(" ") > 0){
					qString.human_name_given = humanNameGiven.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.human_name_given = humanNameGiven; 	
				}
			}else{
				res.json({"err_code": 1, "err_msg": "human name given is empty."});
			}
		}
		
		if(typeof humanName !== 'undefined'){
			if(!validator.isEmpty(humanName)){
				humanName = decodeURI(humanName);
				if(humanName.indexOf(" ") > 0){
					qString.human_name = humanName.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.human_name = humanName; 	
				}
			}else{
				res.json({"err_code": 1, "err_msg": "human name is empty."});
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
		
		if(typeof contactPointValue !== 'undefined'){
			if(!validator.isEmpty(contactPointValue)){
				contactPointValue = decodeURI(contactPointValue);
				if(contactPointValue.indexOf(" ") > 0){
					qString.contact_point_value = contactPointValue.replace(/ /g, "nonbreaking_space"); 
				}else{
					qString.contact_point_value = contactPointValue; 	
				}
			}else{
				res.json({"err_code": 1, "err_msg": "contact point value is empty."});
			}
		}
		
		
		
		seedPhoenixFHIR.path.GET = {
			"Practitioner" : {
				"location": "%(apikey)s/Practitioner",
				"query": qString
			}
		}
		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

		checkApikey(apikey, ipAddres, function(result){
			if(result.err_code == 0){
				ApiFHIR.get('Practitioner', {"apikey": apikey}, {}, function (error, response, body) {
					if(error){
						res.json(error);
					}else{
						var practitioner = JSON.parse(body); //object
						//console.log(practitioner);
						//cek apakah ada error atau tidak
						if(practitioner.err_code == 0){
							//cek jumdata dulu
							if(practitioner.data.length > 0){
								newPractitioner = [];
								for(i=0; i < practitioner.data.length; i++){
									myEmitter.once("getIdentifier", function(practitioner, index, newPractitioner, countPractitioner){
													//get identifier
													qString = {};
													qString.practitioner_id = practitioner.id;
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
															var objectPractitioner = {};
															objectPractitioner.resourceType = practitioner.resourceType;
															objectPractitioner.id = practitioner.id;
															objectPractitioner.identifier = identifier.data;
															objectPractitioner.active = practitioner.active;
															objectPractitioner.gender = practitioner.gender;
															objectPractitioner.birthdate = practitioner.birthdate;
															
															countPractitioner[index] = objectPractitioner

															myEmitter.once('getContactPoint', function(practitioner, index, newPractitioner, countPractitioner){
																			qString = {};
																			qString.practitioner_id = practitioner.id;
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
																					var objectPractitioner = {};
																					objectPractitioner.resourceType = practitioner.resourceType;
																					objectPractitioner.id = practitioner.id;
																					objectPractitioner.identifier = practitioner.identifier;
																					objectPractitioner.active = practitioner.active;
																					objectPractitioner.telecom = contactPoint.data;
																					objectPractitioner.gender = practitioner.gender;
																					objectPractitioner.birthdate = practitioner.birthdate;
																					
																					newPractitioner[index] = objectPractitioner;				
																					/*if(index == countPractitioner -1 ){
																						res.json({"err_code": 0, "data":newPractitioner});				
																					}*/
																					myEmitter.once('getHumanName', function(practitioner, index, newPractitioner, countPractitioner){
																						qString = {};
																						qString.practitioner_id = practitioner.id;
																						seedPhoenixFHIR.path.GET = {
																							"HumanName" : {
																								"location": "%(apikey)s/HumanName",
																								"query": qString
																							}
																						}

																						var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																						ApiFHIR.get('HumanName', {"apikey": apikey}, {}, function(error, response, body){
																							humanName = JSON.parse(body);
																							if(humanName.err_code == 0){
																								var objectPractitioner = {};
																								objectPractitioner.resourceType = practitioner.resourceType;
																								objectPractitioner.id = practitioner.id;
																								objectPractitioner.identifier = practitioner.identifier;
																								objectPractitioner.active = practitioner.active;
																								objectPractitioner.name = humanName.data;
																								objectPractitioner.telecom = practitioner.telecom;
																								objectPractitioner.gender = practitioner.gender;
																								objectPractitioner.birthdate = practitioner.birthdate;

																								newPractitioner[index] = objectPractitioner;			
																								
																								myEmitter.once('getAddress', function(practitioner, index, newPractitioner, countPractitioner){
																									qString = {};
																									qString.practitioner_id = practitioner.id;
																									seedPhoenixFHIR.path.GET = {
																										"Address" : {
																											"location": "%(apikey)s/Address",
																											"query": qString
																										}
																									}
																									var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																									ApiFHIR.get('Address', {"apikey": apikey}, {}, function(error, response, body){
																										//console.log(body);
																										address = JSON.parse(body);
																										if(address.err_code == 0){
																											var objectPractitioner = {};
																											objectPractitioner.resourceType = practitioner.resourceType;
																											objectPractitioner.id = practitioner.id;
																											objectPractitioner.identifier = practitioner.identifier;
																											objectPractitioner.active = practitioner.active;
																											objectPractitioner.name = practitioner.name;
																											objectPractitioner.telecom = practitioner.telecom;
																											objectPractitioner.address = address.data;
																											objectPractitioner.gender = practitioner.gender;
																											objectPractitioner.birthdate = practitioner.birthdate;

																											newPractitioner[index] = objectPractitioner;				
																											
																											myEmitter.once('getAttachment', function(practitioner, index, newPractitioner, countPractitioner){
																												qString = {};
																												qString.practitioner_id = practitioner.id;
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
																														var objectPractitioner = {};
																														objectPractitioner.resourceType = practitioner.resourceType;
																														objectPractitioner.id = practitioner.id;
																														objectPractitioner.identifier = practitioner.identifier;
																														objectPractitioner.active = practitioner.active;
																														objectPractitioner.name = practitioner.name;
																														objectPractitioner.telecom = practitioner.telecom;
																														objectPractitioner.address = practitioner.address;
																														objectPractitioner.gender = practitioner.gender;
																														objectPractitioner.birthdate = practitioner.birthdate;
																														objectPractitioner.photo = attachment.data;

																														newPractitioner[index] = objectPractitioner;				
																														
																														myEmitter.once('getCommunication', function(practitioner, index, newPractitioner, countPractitioner){
																															qString = {};
																															qString._id = practitioner.id;
																															seedPhoenixFHIR.path.GET = {
																																"practitionerCommunication" : {
																																	"location": "%(apikey)s/practitionerCommunication",
																																	"query": qString
																																}
																															}
																															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																															ApiFHIR.get('practitionerCommunication', {"apikey": apikey}, {}, function(error, response, body){
																																//console.log(body);
																																practitionerCommunication = JSON.parse(body);
																																if(practitionerCommunication.err_code == 0){
																																	var objectPractitioner = {};
																																	objectPractitioner.resourceType = practitioner.resourceType;
																																	objectPractitioner.id = practitioner.id;
																																	objectPractitioner.identifier = practitioner.identifier;
																																	objectPractitioner.active = practitioner.active;
																																	objectPractitioner.name = practitioner.name;
																																	objectPractitioner.telecom = practitioner.telecom;
																																	objectPractitioner.address = practitioner.address;
																																	objectPractitioner.gender = practitioner.gender;
																																	objectPractitioner.birthdate = practitioner.birthdate;
																																	objectPractitioner.photo = practitioner.photo;
																																	objectPractitioner.communication = practitionerCommunication.data;

																																	newPractitioner[index] = objectPractitioner;				
																																	myEmitter.once('getQualification', function(practitioner, index, newPractitioner, countPractitioner){
																																		qString = {};
																																		qString._id = practitioner.id;
																																		seedPhoenixFHIR.path.GET = {
																																			"qualification" : {
																																				"location": "%(apikey)s/Qualification",
																																				"query": qString
																																			}
																																		}
																																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																																		ApiFHIR.get('qualification', {"apikey": apikey}, {}, function(error, response, body){
																																			//console.log(body);
																																			qualification = JSON.parse(body);
																																			if(qualification.err_code == 0){
																																				var objectPractitioner = {};
																																				objectPractitioner.resourceType = practitioner.resourceType;
																																				objectPractitioner.id = practitioner.id;
																																				objectPractitioner.identifier = practitioner.identifier;
																																				objectPractitioner.active = practitioner.active;
																																				objectPractitioner.name = practitioner.name;
																																				objectPractitioner.telecom = practitioner.telecom;
																																				objectPractitioner.address = practitioner.address;
																																				objectPractitioner.gender = practitioner.gender;
																																				objectPractitioner.birthdate = practitioner.birthdate;
																																				objectPractitioner.photo = practitioner.photo;
																																				objectPractitioner.qualification = qualification.data;
																																				objectPractitioner.communication = practitioner.communication;

																																				newPractitioner[index] = objectPractitioner;				
																																				if(index == countPractitioner -1 ){
																																					res.json({"err_code": 0, "data":newPractitioner});				
																																				}

																																			}else{
																																				res.json(qualification);			
																																			}
																																		})
																																	})
																																	myEmitter.emit('getQualification', objectPractitioner, index, newPractitioner, countPractitioner);

																																}else{
																																	res.json(practitionerCommunication);			
																																}
																															})
																														})
																														myEmitter.emit('getCommunication', objectPractitioner, index, newPractitioner, countPractitioner);

																													}else{
																														res.json(attachment);			
																													}
																												})
																											})
																											myEmitter.emit('getAttachment', objectPractitioner, index, newPractitioner, countPractitioner);

																										}else{
																											res.json(address);			
																										}
																									})
																								})
																								myEmitter.emit('getAddress', objectPractitioner, index, newPractitioner, countPractitioner);
																							}else{
																								res.json(humanName);			
																							}
																						})
																					})
																					myEmitter.emit('getHumanName', objectPractitioner, index, newPractitioner, countPractitioner);
																					
																				}else{
																					res.json(contactPoint);			
																				}
																			})
																		})
															myEmitter.emit('getContactPoint', objectPractitioner, index, newPractitioner, countPractitioner);
														}else{
															res.json(identifier);
														}
													})
												})
									myEmitter.emit("getIdentifier", practitioner.data[i], i, newPractitioner, practitioner.data.length);
									//res.json({"err_code": 0, "err_msg": "Practitioner is not empty."});		
								}
								 //res.json({"err_code": 0, "data":practitioner.data});
							}else{
								res.json({"err_code": 2, "err_msg": "Practitioner is empty."});	
							}
						}else{
							res.json(practitioner);
						}
					}
				});
			}else{
				result.err_code = 500;
				res.json(result);
			}
		});	
	},
	post: function postPractitioner(req, res){
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

		//practioner active
		if(typeof req.body.active !== 'undefined'){
			practionerActiveCode =  req.body.active.trim().toLowerCase();
			if(validator.isEmpty(practionerActiveCode)){
				err_code = 2;
				err_msg = "practioner active is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'active' in json practioner request.";
		}
		//practioner gender
		if(typeof req.body.gender !== 'undefined'){
			practionerGenderCode =  req.body.gender.trim().toLowerCase();
			if(validator.isEmpty(practionerGenderCode)){
				err_code = 2;
				err_msg = "practioner gender is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'gender' in json practioner request.";
		}
		//practioner name
		if(typeof req.body.birthDate !== 'undefined'){
			practionerBirthDateCode =  req.body.birthDate.trim().toLowerCase();
			if(validator.isEmpty(practionerBirthDateCode)){
				err_code = 2;
				err_msg = "practioner birthDate is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'birthDate' in json practioner request.";
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

		//address use
		if(typeof req.body.address.use !== 'undefined'){
			addressUseCode =  req.body.address.use.trim().toLowerCase();
			if(validator.isEmpty(addressUseCode)){
				err_code = 2;
				err_msg = "Address Use is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'use' in json address request.";
		} 

		//address type
		if(typeof req.body.address.type !== 'undefined'){
			addressTypeCode =  req.body.address.type.trim().toLowerCase();
			if(validator.isEmpty(addressTypeCode)){
				err_code = 2;
				err_msg = "Address Type is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'type' in json address request.";
		} 

		//address text
		if(typeof req.body.address.text !== 'undefined'){
			addressText =  req.body.address.text;
			if(validator.isEmpty(addressText)){
				err_code = 2;
				err_msg = "Address Text is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'text' in json address request.";
		}

		//address line
		if(typeof req.body.address.line !== 'undefined'){
			addressLine =  req.body.address.line;
			if(validator.isEmpty(addressLine)){
				err_code = 2;
				err_msg = "Address Line is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'text' in json address request.";
		}

		//address city
		if(typeof req.body.address.city !== 'undefined'){
			addressCity =  req.body.address.city;
			if(validator.isEmpty(addressCity)){
				err_code = 2;
				err_msg = "Address City is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'city' in json address request.";
		} 

		//address district
		if(typeof req.body.address.district !== 'undefined'){
			addressDistrict =  req.body.address.district;
			// if(validator.isEmpty(addressDistrict)){
			// 	err_code = 2;
			// 	err_msg = "Address District is required";
			// }
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'district' in json address request.";
		}

		//address state
		if(typeof req.body.address.state !== 'undefined'){
			addressState =  req.body.address.state;
			if(validator.isEmpty(addressState)){
				err_code = 2;
				err_msg = "State is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'state' in json address request.";
		}

		//address postal code
		if(typeof req.body.address.postal_code !== 'undefined'){
			addressPostalCode =  req.body.address.postal_code;
			if(validator.isEmpty(addressPostalCode)){
				err_code = 2;
				err_msg = "Postal Code is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'postal_code' in json address request.";
		} 

		//address country
		if(typeof req.body.address.country !== 'undefined'){
			addressCountry =  req.body.address.country;
			if(validator.isEmpty(addressCountry)){
				err_code = 2;
				err_msg = "Country is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'country' in json address request.";
		} 

		//address period
		if(typeof req.body.address.period !== 'undefined'){
			var period = req.body.address.period;
			if(period.indexOf("to") > 0){
				arrPeriod = period.split("to");
				addressPeriodStart = arrPeriod[0];
				addressPeriodEnd = arrPeriod[1];

				if(!regex.test(addressPeriodStart) && !regex.test(addressPeriodEnd)){
					err_code = 2;
					err_msg = "Address Period invalid date format.";
				}	
			}else{
				addressPeriodStart = "";
				addressPeriodEnd = "";
			}
		}else{
			addressPeriodStart = "";
			addressPeriodEnd = "";
		}
		
		//contact human_name
		//use code
		if(typeof req.body.name.use !== 'undefined'){
			humanNameUseCode =  req.body.name.use.trim().toLowerCase();
			if(validator.isEmpty(humanNameUseCode)){
				err_code = 2;
				err_msg = "Name Use Code is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'use' in json name request.";
		} 

		//fullname
		if(typeof req.body.name.text !== 'undefined'){
			humanNameText =  req.body.name.text;
			if(validator.isEmpty(humanNameText)){
				err_code = 2;
				err_msg = "Name text is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'text' in your json name request.";
		} 

		//surname
		if(typeof req.body.name.family !== 'undefined'){
			humanNameFamily =  req.body.name.family;
			if(validator.isEmpty(humanNameFamily)){
				err_code = 2;
				err_msg = "Family name is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'family' in your json name request.";
		}

		//given name
		if(typeof req.body.name.given !== 'undefined'){
			humanNameGiven =  req.body.name.given;
			if(validator.isEmpty(humanNameGiven)){
				 humanNameGiven = "";
			}
		}else{
			humanNameGiven = "";
		}

		//prefix name
		if(typeof req.body.name.prefix !== 'undefined'){
			humanNamePrefix =  req.body.name.prefix;
		}else{
			humanNamePrefix = '';
		}

		//suffix name
		if(typeof req.body.name.suffix !== 'undefined'){
			humanNameSuffix =  req.body.name.suffix;
		}else{
			humanNameSuffix =  "";
		}

		//period name
		if(typeof req.body.name.period !== 'undefined'){
			var period = req.body.name.period;
			if(period.indexOf("to") > 0){
				arrPeriod = period.split("to");
				humanNamePeriodStart = arrPeriod[0];
				humanNamePeriodEnd = arrPeriod[1];

				if(!regex.test(humanNamePeriodStart) && !regex.test(humanNamePeriodEnd)){
					err_code = 2;
					err_msg = "Identifier Period invalid date format.";
				}	
			}else{
				humanNamePeriodStart = "";
				humanNamePeriodEnd = "";
			}
		}else{
			humanNamePeriodStart = "";
			humanNamePeriodEnd = "";
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
		
		// qualification code
		if(typeof req.body.qualification.code !== 'undefined'){
			//qualificationCode =  req.body.qualification.code.trim().toLowerCase();
			qualificationCode =  req.body.qualification.code.trim();
			if(validator.isEmpty(qualificationCode)){
				err_code = 2;
				err_msg = "qualification code is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'code' in json qualification request.";
		}
		
		if(typeof req.body.qualification.issuer !== 'undefined'){
			qualificationIssuer =  req.body.qualification.issuer.trim().toLowerCase();
			if(validator.isEmpty(qualificationIssuer)){
				err_code = 2;
				err_msg = "qualification issuer is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'issuer' in json qualification request.";
		}
		
		
		// qualification period
		if(typeof req.body.qualification.period !== 'undefined'){
			period = req.body.qualification.period;
			if(period.indexOf("to") > 0){
				arrPeriod = period.split("to");
				qualificationPeriodStart = arrPeriod[0];
				qualificationPeriodEnd = arrPeriod[1];

				if(!regex.test(qualificationPeriodStart) && !regex.test(qualificationPeriodEnd)){
					err_code = 2;
					err_msg = "qualification Period invalid date format.";
				}	
			}
		}else{
			err_code = 1;
			err_msg = "Please add key 'period' in json qualification request.";
		} 
		
		//qualification identifier
		if(typeof req.body.qualification.identifier.use !== 'undefined'){
			qualificationIdentifierUseCode =  req.body.qualification.identifier.use.trim().toLowerCase();
			if(validator.isEmpty(qualificationIdentifierUseCode)){
				err_code = 2;
				err_msg = "qualification Identifier Use is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'use' in json qualification identifier request.";
		} 

		//qualification type code
		if(typeof req.body.qualification.identifier.type !== 'undefined'){
			qualificationIdentifierTypeCode =  req.body.qualification.identifier.type.trim().toUpperCase();
			if(validator.isEmpty(qualificationIdentifierTypeCode)){
				err_code = 2;
				err_msg = "qualification Identifier Type is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'type' in json qualification identifier request.";
		} 

		//qualification identifier uniqe value
		if(typeof req.body.qualification.identifier.value !== 'undefined'){
			qualificationIdentifierValue =  req.body.qualification.identifier.value.trim();
			if(validator.isEmpty(qualificationIdentifierValue)){
				err_code = 2;
				err_msg = "qualification Identifier Value is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'value' in json qualification identifier request.";
		}

		//identifier period start
		if(typeof req.body.qualification.identifier.period !== 'undefined'){
			period = req.body.qualification.identifier.period;
			if(period.indexOf("to") > 0){
				arrPeriod = period.split("to");
				qualificationIdentifierPeriodStart = arrPeriod[0];
				qualificationIdentifierPeriodEnd = arrPeriod[1];

				if(!regex.test(qualificationIdentifierPeriodStart) && !regex.test(qualificationIdentifierPeriodEnd)){
					err_code = 2;
					err_msg = "Qualification Identifier Period invalid date format.";
				}	
			}

		}else{
			err_code = 1;
			err_msg = "Please add key 'period' in json Qualification identifier request.";
		}
		
		//practitioner_communication_language
		if(typeof req.body.communication.language !== 'undefined'){
			communicationLanguage =  req.body.communication.language.trim().toLowerCase();
			if(validator.isEmpty(communicationLanguage)){
				err_code = 2;
				err_msg = "Communication Language is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'language' in json Communication request.";
		}
		
		//practitioner_communication_preferred
		if(typeof req.body.communication.preferred !== 'undefined'){
			communicationPreferred =  req.body.communication.preferred.trim().toLowerCase();
			if(validator.isEmpty(communicationPreferred)){
				err_code = 2;
				err_msg = "Communication preferred is required";
			}
		}else{
			err_code = 1;
			err_msg = "Please add sub-key 'preferred' in json Communication request.";
		}

		if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
						if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
							checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
								if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									checkCode(apikey, practionerGenderCode, 'ADMINISTRATIVE_GENDER', function(resGenderCode){
										if(resGenderCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											checkCode(apikey, qualificationCode, 'QUALIFICATION_CODE', function(resQualificationCode){
												if(resQualificationCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
													checkCode(apikey, communicationLanguage, 'LANGUAGES', function(resLanguageCode){
														if(resLanguageCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
															checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resAttachmentLanguageCode){
																if(resAttachmentLanguageCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									
											
																	checkCode(apikey, humanNameUseCode, 'NAME_USE', function(resNameUseCode){
																		if(resNameUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																			checkCode(apikey, contactPointSystemCode, 'CONTACT_POINT_SYSTEM', function(resContactPointSystem){
																				if(resContactPointSystem.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																					checkCode(apikey, contactPointUseCode, 'CONTACT_POINT_USE', function(resContactPointUse){
																						if(resContactPointUse.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																							checkCode(apikey, addressUseCode, 'ADDRESS_USE', function(resAddrUse){
																								if(resAddrUse.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																									checkCode(apikey, addressTypeCode, 'ADDRESS_TYPE', function(resAddrType){
																										if(resAddrType.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																											//event emiter
																											myEmitter.prependOnceListener('checkPractitionerId', function() {
																													checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
																														if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada
																															checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactPointValue, 'CONTACT_POINT', function(resContactPointValue){
																																if(resContactPointValue.err_code == 0){

																																	checkUniqeValue(apikey, "ORGANIZATION_ID|" + qualificationIssuer, 'ORGANIZATION', function(resQualificationIssuer){
																																		if(qualificationIssuer == 'null') {
																																			resQualificationIssuer.err_code = 2;
																																		}
																																		if(resQualificationIssuer.err_code == 2){

																																			//proses insert

																																			//set uniqe id
																																			var unicId = uniqid.time();
																																			var practitionerId = 'pra' + unicId;
																																			var identifierId = 'ide' + unicId;
																																			var humanNameId = 'hun' + unicId;
																																			var contactPointId = 'cop' + unicId;
																																			var addressId = 'add' + unicId;
																																			var contactAddressId = 'adc' + unicId;
																																			var qualificationId = 'qua' + unicId;
																																			var identifierQualificationId = 'idq' + unicId;
																																			var practitionerCommunicationId = 'prc' + unicId;
																																			var organizationId = 'org' + unicId;
																																			var attachmentId = 'att' + unicId;


																																			dataPractitioner = {
																																				"id" : practitionerId,
																																				"active" : practionerActiveCode,
																																				"gender" : practionerGenderCode,
																																				"birthDate" : practionerBirthDateCode
																																			}
																																			ApiFHIR.post('practitioner', {"apikey": apikey}, {body: dataPractitioner, json: true}, function(error, response, body){
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
																																												"practitioner_id": practitionerId
																																											}
																																			console.log(dataIdentifier);
																																			ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
																																				identifier = body;
																																				if(identifier.err_code > 0){
																																					res.json(identifier);	
																																				}
																																			})

																																			//human name
																																			dataHumanName = {
																																												"id": humanNameId,
																																												"use": humanNameUseCode,
																																												"text": humanNamePrefix + ' ' + humanNameText + ' ' + humanNameSuffix,
																																												"family": humanNameFamily,
																																												"given": humanNameGiven,
																																												"prefix": humanNamePrefix,
																																												"suffix": humanNameSuffix,
																																												"period_start": humanNamePeriodStart,
																																												"period_end": humanNamePeriodEnd,
																																												"practitioner_id": practitionerId
																																											}
																																			ApiFHIR.post('humanName', {"apikey": apikey}, {body: dataHumanName, json: true}, function(error, response, body){
																																				humanName = body;
																																				if(humanName.err_code > 0){
																																					res.json(humanName);	
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
																																													"organization_id": organizationId,
																																													"practitioner_id": practitionerId
																																												}
																																			//post to contact point
																																			ApiFHIR.post('contactPoint', {"apikey": apikey}, {body: dataContactPoint, json: true}, function(error, response, body){
																																				contactPoint = body;
																																				if(contactPoint.err_code > 0){
																																					res.json(contactPoint);	
																																				}
																																			})

																																			//address
																																			dataAddress = {
																																											"id": addressId,
																																											"use": addressUseCode,
																																											"type": addressTypeCode,
																																											"text": addressText,
																																											"line": addressLine,
																																											"city": addressCity,
																																											"district": addressDistrict,
																																											"state": addressState,
																																											"postal_code": addressPostalCode,
																																											"country": addressCountry,
																																											"period_start": addressPeriodStart,
																																											"period_end": addressPeriodEnd,
																																											"practitioner_id": practitionerId
																																										}
																																			//post to contact point
																																			ApiFHIR.post('address', {"apikey": apikey}, {body: dataAddress, json: true}, function(error, response, body){
																																				address = body;
																																				if(address.err_code > 0){
																																					res.json(address);	
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
																																														"practitioner_id": practitionerId
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

																																			dataQualification = {
																																				"id" : qualificationId,
																																				"code" : qualificationCode,
																																				"issuer" : qualificationIssuer,
																																				"period_start" : qualificationPeriodStart,
																																				"period_end" : qualificationPeriodEnd,
																																				"practitioner_id": practitionerId
																																			}
																																			ApiFHIR.post('qualification', {"apikey": apikey}, {body: dataQualification, json: true}, function(error, response, body){
																																				qualification = body;
																																				if(qualification.err_code > 0){
																																					res.json(qualification);	
																																				}
																																			})

																																			//identifier
																																			dataIdentifier = {
																																												"id": identifierId,
																																												"use": qualificationIdentifierUseCode,
																																												"type": qualificationIdentifierTypeCode,
																																												//"system": identifierSystem,
																																												"value": qualificationIdentifierValue,
																																												"period_start": qualificationIdentifierPeriodStart,
																																												"period_end": qualificationIdentifierPeriodEnd,
																																												"qualification_id": qualificationId,
																																												"organization_id": organizationId
																																											}
																																			ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
																																				identifier = body;
																																				if(identifier.err_code > 0){
																																					res.json(identifier);	
																																				}
																																			})

																																			dataPractitionerCommunication = {
																																				"id" : practitionerCommunicationId,
																																				"communication_language" : communicationLanguage,
																																				"communication_preferred" : communicationPreferred,
																																				"practitioner_id": practitionerId
																																			}
																																			ApiFHIR.post('practitionerCommunication', {"apikey": apikey}, {body: dataPractitionerCommunication, json: true}, function(error, response, body){
																																				qualification = body;
																																				if(qualification.err_code > 0){
																																					res.json(qualification);	
																																				}
																																			})
																																			res.json({"err_code": 0, "err_msg": "Practitioner has been add.", "data": [{"_id": practitionerId}]});
																																		}else{
																																			res.json({"err_code": 514, "err_msg": "Qualification issuer value is not exist."});			
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
																											myEmitter.emit('checkPractitionerId');
																										}else{
																											res.json({"err_code": 511, "err_msg": "Address Type Code not found"});		
																										}
																									})
																								}else{
																									res.json({"err_code": 510, "err_msg": "Address Use Code not found"});		
																								}
																							})
																						}else{
																							res.json({"err_code": 509, "err_msg": "Contact Point Use Code not found"});
																						}
																					})
																				}else{
																					res.json({"err_code": 508, "err_msg": "Contact Point System Code not found"});		
																				}
																			})
																		}else{
																			res.json({"err_code": 507, "err_msg": "Human name use code not found"});		
																		}
																	})
																}else{
																	res.json({"err_code": 506, "err_msg": "Attachment Language code not found"});		
																}
															})	
														}else{
															res.json({"err_code": 505, "err_msg": "Communication Language code not found"});		
														}
													})
												}else{
													res.json({"err_code": 504, "err_msg": "Qualification code not found"});		
												}
											})
										}else{
											res.json({"err_code": 503, "err_msg": "Administrative gender code not found"});		
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