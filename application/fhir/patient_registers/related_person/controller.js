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
				relatedPerson: function getRelatedPerson(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					//params from query string
					var relatedPersonId = req.query._id;
					var relatedPersonActive = req.query.active;
					var relatedPersonAddress = req.query.address;
					var relatedPersonAddressCity = req.query.city;
					var relatedPersonAddressCountry = req.query.country;
					var relatedPersonAddressPostalCode = req.query.postal_code;
					var relatedPersonAddressState = req.query.state; //space encodeURI masih ada bug untuk sprintf
					var relatedPersonAddressUse = req.query.address_use; 
					var relatedPersonBirthdate = req.query.birthdate; 
					var relatedPersonEmail = req.query.email; 
					var relatedPersonGender = req.query.gender; 
					var relatedPersonIdentifier = req.query.identifier;
					var relatedPersonName = req.query.name; 
					var relatedPersonPatient = req.query.patient; 
					var relatedPersonPhone = req.query.phone; 
					// var relatedPersonPhonetic = req.query.phonetic; 
					var relatedPersonTelecom = req.query.telecom;

					var qString = {};
					if(typeof relatedPersonId !== 'undefined'){
						if(!validator.isEmpty(relatedPersonId)){
							qString._id = relatedPersonId; 
						}else{
							res.json({"err_code": 1, "err_msg": "Related Person id is required."})
						}
					}

					if(typeof relatedPersonActive !== 'undefined'){
						if(validator.isBoolean(relatedPersonActive)){
							qString.active = relatedPersonActive; 
						}else{
							res.json({"err_code": 1, "err_msg": "Active is boolean."});
						}
					}
					
					if(typeof relatedPersonAddress !== 'undefined'){
						if(!validator.isEmpty(relatedPersonAddress)){
							relatedPersonAddress = decodeURI(relatedPersonAddress);
							if(relatedPersonAddress.indexOf(" ") > 0){
								qString.address = relatedPersonAddress.replace(/ /g, "nonbreaking_space"); 
							}else{
								qString.address = relatedPersonAddress; 	
							}
						}else{
							res.json({"err_code": 1, "err_msg": "Address is empty."});
						}
					}
					
					if(typeof relatedPersonAddressCity !== 'undefined'){
						if(!validator.isEmpty(relatedPersonAddressCity)){
							relatedPersonAddressCity = decodeURI(relatedPersonAddressCity);
							if(relatedPersonAddressCity.indexOf(" ") > 0){
								qString.city = relatedPersonAddressCity.replace(/ /g, "nonbreaking_space"); 
							}else{
								qString.city = relatedPersonAddressCity; 
							}
						}else{
							res.json({"err_code": 1, "err_msg": "City is empty."});
						}
					}

					if(typeof relatedPersonAddressCountry !== 'undefined'){
						if(!validator.isEmpty(relatedPersonAddressCountry)){
							relatedPersonAddressCountry = decodeURI(relatedPersonAddressCountry);
							if(relatedPersonAddressCountry.indexOf(" ") > 0){
								relatedPersonAddressCountry = relatedPersonAddressCountry.replace(/ /g, "nonbreaking_space"); 
							}
								qString.country = relatedPersonAddressCountry; 
													
						}else{
							res.json({"err_code": 1, "err_msg": "Country is empty."});
						}
					}

					if(typeof relatedPersonAddressPostalCode !== 'undefined'){
						if(validator.isPostalCode(relatedPersonAddressPostalCode, 'any')){
							if(relatedPersonAddressPostalCode.indexOf(" ") > 0){
								relatedPersonAddressPostalCode = relatedPersonAddressPostalCode.replace(/ /g, ""); 
							}
							qString.postalcode = relatedPersonAddressPostalCode; 
						}else{
							res.json({"err_code": 1, "err_msg": "Postal code is invalid format."});
						}
					}

					if(typeof relatedPersonAddressState !== 'undefined'){
						if(!validator.isEmpty(relatedPersonAddressState)){
							relatedPersonAddressState = decodeURI(relatedPersonAddressState);
							if(relatedPersonAddressState.indexOf(" ") > 0){
								qString.state = relatedPersonAddressState.replace(/ /g, "nonbreaking_space"); 
							}else{
								qString.state = relatedPersonAddressState; 
							}
						}else{
							res.json({"err_code": 1, "err_msg": "State is empty."});
						}
					}

					if(typeof relatedPersonAddressUse !== 'undefined'){
						if(!validator.isEmpty(relatedPersonAddressUse)){
							qString.addressuse = relatedPersonAddressUse; 
						}else{
							res.json({"err_code": 1, "err_msg": "Address use code is empty."});
						}
					}

					
					if(typeof relatedPersonBirthdate !== 'undefined'){
						if(!validator.isEmpty(relatedPersonBirthdate)){
							if(!regex.test(relatedPersonBirthdate)){
								res.json({"err_code": 1, "err_msg": "Birthdate invalid format."});
							}else{
								qString.birthdate = relatedPersonBirthdate; 
							}	
						}else{
							res.json({"err_code": 1, "err_msg": "Birthdate is empty."});
						}
					}

					if(typeof relatedPersonEmail !== 'undefined'){
						if(validator.isEmail(relatedPersonEmail)){
							qString.email = relatedPersonEmail.replace(/@/g, "at_sign"); 
						}else{
							res.json({"err_code": 1, "err_msg": "Email is empty."});
						}
					}

					if(typeof relatedPersonGender !== 'undefined'){
						if(!validator.isEmpty(relatedPersonGender)){
							qString.gender = relatedPersonGender;
						}else{
							res.json({"err_code": 1, "err_msg": "Gender is empty."});
						}
					}

					if(typeof relatedPersonIdentifier !== 'undefined'){
						if(!validator.isEmpty(relatedPersonIdentifier)){
							qString.identifier = relatedPersonIdentifier;
						}else{
							res.json({"err_code": 1, "err_msg": "Identifier is empty."});
						}
					}

					if(typeof relatedPersonName !== 'undefined'){
						if(!validator.isEmpty(relatedPersonName)){
							if(relatedPersonName.indexOf(" ") > 0){
								qString.name = relatedPersonName.replace(/ /g, "nonbreaking_space"); 
							}else{
								qString.name = relatedPersonName;
							}
						}else{
							res.json({"err_code": 1, "err_msg": "Name is empty."});
						}
					}

					if(typeof relatedPersonPatient !== 'undefined'){
						if(!validator.isEmpty(relatedPersonPatient)){
							qString.patient = relatedPersonPatient;
						}else{
							res.json({"err_code": 1, "err_msg": "Patient is empty."});
						}
					}

					if(typeof relatedPersonPhone !== 'undefined'){
						if(validator.isMobilePhone(relatedPersonPhone, 'any')){
							qString.phone = relatedPersonPhone;
						}else{
							res.json({"err_code": 1, "err_msg": "Invalid format phone."});
						}
					}

					if(typeof relatedPersonPhonetic !== 'undefined'){
						if(!validator.isEmpty(relatedPersonPhonetic)){
							qString.phonetic = relatedPersonPhonetic;
						}else{
							res.json({"err_code": 1, "err_msg": "Phonetic is empty."});
						}
					}

					if(typeof relatedPersonTelecom !== 'undefined'){
						if(!validator.isEmpty(relatedPersonTelecom)){
							if(validator.isEmail(relatedPersonTelecom)){
								qString.telecom = relatedPersonTelecom.replace(/@/g, "at_sign"); 
							}else{
								qString.telecom = relatedPersonTelecom; 
							}
						}else{
							res.json({"err_code": 1, "err_msg": "Telecom is empty."});
						}
					}
					
					seedPhoenixFHIR.path.GET = {
						"RelatedPerson" : {
							"location": "%(apikey)s/RelatedPerson",
							"query": qString
						}
					}
					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){
							ApiFHIR.get('RelatedPerson', {"apikey": apikey}, {}, function (error, response, body) {
							  if(error){
							  	res.json(error);
							  }else{
							  	var relatedPerson = JSON.parse(body); //object
							  	//cek apakah ada error atau tidak
							  	if(relatedPerson.err_code == 0){
								  	//cek jumdata dulu
								  	if(relatedPerson.data.length > 0){
								  		newRelatedPerson = [];
								  		for(i=0; i < relatedPerson.data.length; i++){
								  			
							  				myEmitter.once("getAttachment", function(relatedPerson, index, newRelatedPerson, countRelatedPerson){
									  			qString = {};
									  			qString.related_person_id = relatedPerson.id;
										  		seedPhoenixFHIR.path.GET = {
														"Attachment" : {
															"location": "%(apikey)s/Attachment",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

													ApiFHIR.get("Attachment", {"apikey": apikey}, {}, function(error, response, body){
														attachment = JSON.parse(body);
														if(attachment.err_code == 0){
															var objectRelatedPerson = {};
															objectRelatedPerson.resourceType = relatedPerson.resourceType;
															objectRelatedPerson.id = relatedPerson.id;
															objectRelatedPerson.active = relatedPerson.active;
															objectRelatedPerson.patient = relatedPerson.patient;
															objectRelatedPerson.relationship = relatedPerson.relationship;
															objectRelatedPerson.gender = relatedPerson.gender;
															objectRelatedPerson.birthDate = relatedPerson.birthdate;
															objectRelatedPerson.photo = attachment.data;
															objectRelatedPerson.period_start = relatedPerson.period_start;
															objectRelatedPerson.period_end = relatedPerson.period_end;
															
															newRelatedPerson[index] = objectRelatedPerson;

															myEmitter.once("getIdentifier", function(relatedPerson, index, newRelatedPerson, countRelatedPerson){
																//get identifier
												  			qString = {};
												  			qString.related_person_id = relatedPerson.id;
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
																		var objectRelatedPerson = {};
																		objectRelatedPerson.resourceType = relatedPerson.resourceType;
																		objectRelatedPerson.id = relatedPerson.id;
																		objectRelatedPerson.identifier = identifier.data;
																		objectRelatedPerson.active = relatedPerson.active;
																		objectRelatedPerson.patient = relatedPerson.patient;
																		objectRelatedPerson.relationship = relatedPerson.relationship;
																		objectRelatedPerson.gender = relatedPerson.gender;
																		objectRelatedPerson.birthDate = relatedPerson.birthDate;
																		objectRelatedPerson.photo = relatedPerson.photo;
																		objectRelatedPerson.period_start = relatedPerson.period_start;
																		objectRelatedPerson.period_end = relatedPerson.period_end;
																		
																		newRelatedPerson[index] = objectRelatedPerson;

																		//human_name
																		myEmitter.once('getHumanName', function(relatedPerson, index, newRelatedPerson, countRelatedPerson){
																			qString = {};
															  			qString.related_person_id = relatedPerson.id;
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
																					var objectRelatedPerson = {};
																					objectRelatedPerson.resourceType = relatedPerson.resourceType;
																					objectRelatedPerson.id = relatedPerson.id;
																					objectRelatedPerson.identifier = relatedPerson.identifier;
																					objectRelatedPerson.active = relatedPerson.active;
																					objectRelatedPerson.patient = relatedPerson.patient;
																					objectRelatedPerson.relationship = relatedPerson.relationship;
																					objectRelatedPerson.name = humanName.data;
																					objectRelatedPerson.gender = relatedPerson.gender;
																					objectRelatedPerson.birthDate = relatedPerson.birthDate;
																					objectRelatedPerson.photo = relatedPerson.photo;
																					objectRelatedPerson.period_start = relatedPerson.period_start;
																					objectRelatedPerson.period_end = relatedPerson.period_end;

																					newRelatedPerson[index] = objectRelatedPerson;
																					
																					myEmitter.once('getContactPoint', function(relatedPerson, index, newRelatedPerson, countRelatedPerson){
																						qString = {};
																		  			qString.related_person_id = relatedPerson.id;
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
																								var objectRelatedPerson = {};
																								objectRelatedPerson.resourceType = relatedPerson.resourceType;
																								objectRelatedPerson.id = relatedPerson.id;
																								objectRelatedPerson.identifier = relatedPerson.identifier;
																								objectRelatedPerson.active = relatedPerson.active;
																								objectRelatedPerson.patient = relatedPerson.patient;
																								objectRelatedPerson.relationship = relatedPerson.relationship;
																								objectRelatedPerson.name = relatedPerson.name;
																								objectRelatedPerson.telecom = contactPoint.data;
																								objectRelatedPerson.gender = relatedPerson.gender;
																								objectRelatedPerson.birthDate = relatedPerson.birthDate;
																								objectRelatedPerson.photo = relatedPerson.photo;
																								objectRelatedPerson.period_start = relatedPerson.period_start;
																								objectRelatedPerson.period_end = relatedPerson.period_end;

																								newRelatedPerson[index] = objectRelatedPerson;
																								
																								myEmitter.once('getAddress', function(relatedPerson, index, newRelatedPerson, countRelatedPerson){
																									qString = {};
																					  			qString.related_person_id = relatedPerson.id;
																						  		seedPhoenixFHIR.path.GET = {
																										"Address" : {
																											"location": "%(apikey)s/Address",
																											"query": qString
																										}
																									}

																									var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																									ApiFHIR.get('Address', {"apikey": apikey}, {}, function(error, response, body){
																										address = JSON.parse(body);
																										
																										if(address.err_code == 0){
																											var objectRelatedPerson = {};
																											objectRelatedPerson.resourceType = relatedPerson.resourceType;
																											objectRelatedPerson.id = relatedPerson.id;
																											objectRelatedPerson.identifier = relatedPerson.identifier;
																											objectRelatedPerson.active = relatedPerson.active;
																											objectRelatedPerson.patient = relatedPerson.patient;
																											objectRelatedPerson.relationship = relatedPerson.relationship;
																											objectRelatedPerson.name = relatedPerson.name;
																											objectRelatedPerson.telecom = contactPoint.data;
																											objectRelatedPerson.gender = relatedPerson.gender;
																											objectRelatedPerson.birthDate = relatedPerson.birthDate;
																											objectRelatedPerson.address = address.data;
																											objectRelatedPerson.photo = relatedPerson.photo;
																											objectRelatedPerson.period_start = relatedPerson.period_start;
																											objectRelatedPerson.period_end = relatedPerson.period_end;

																											newRelatedPerson[index] = objectRelatedPerson;
																											
																											if(index == countRelatedPerson -1 ){
																												res.json({"err_code": 0, "data":newRelatedPerson});				
																											}
																										}else{
																											res.json(address);			
																										}
																									})
																								})
																								myEmitter.emit('getAddress', objectRelatedPerson, index, newRelatedPerson, countRelatedPerson);			
																							}else{
																								res.json(contactPoint);			
																							}
																						})
																					})
																					myEmitter.emit('getContactPoint', objectRelatedPerson, index, newRelatedPerson, countRelatedPerson);
																				}else{
																					res.json(humanName);			
																				}
																			})
																		})
																		myEmitter.emit('getHumanName', objectRelatedPerson, index, newRelatedPerson, countRelatedPerson);
																	}else{
																		res.json(identifier);
																	}
																})
															})
															myEmitter.emit("getIdentifier", objectRelatedPerson, index, newRelatedPerson, countRelatedPerson);
														}else{
															res.json(attachment);
														}
													})
							  				})
												myEmitter.emit("getAttachment", relatedPerson.data[i], i, newRelatedPerson, relatedPerson.data.length);
								  		}
								  		// res.json({"err_code": 0, "data":person.data});
								  	}else{
							  			res.json({"err_code": 2, "err_msg": "Related Person is not found."});	
								  	}
							  	}else{
							  		res.json(patient);
							  	}
							  }
							});
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
					var relatedPersonId = req.params.related_person_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
								if(resRelatedPersonID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.related_person_id = relatedPersonId;
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
						  			qString.related_person_id = relatedPersonId;
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
									res.json({"err_code": 501, "err_msg": "Related Person Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
				humanName: function getHumanName(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var relatedPersonId = req.params.related_person_id;
					var humanNameId = req.params.human_name_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
								if(resRelatedPersonID.err_code > 0){
									if(typeof humanNameId !== 'undefined' && !validator.isEmpty(humanNameId)){
										checkUniqeValue(apikey, "HUMAN_NAME_ID|" + humanNameId, 'HUMAN_NAME', function(resHumanNameID){
											if(resHumanNameID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.related_person_id = relatedPersonId;
								  			qString._id = humanNameId;
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
														res.json({"err_code": 0, "data":humanName.data});	
													}else{
														res.json(humanName);
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Human Name Id not found"});		
											}
										})
									}else{
						  			qString = {};
						  			qString.related_person_id = relatedPersonId;
						  		
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
												res.json({"err_code": 0, "data":humanName.data});	
											}else{
												res.json(humanName);
											}
										})
									}
								}else{
									res.json({"err_code": 501, "err_msg": "Related Person Id not found"});		
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
					var relatedPersonId = req.params.related_person_id;
					var contactPointId = req.params.contact_point_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resPatientID){
								if(resPatientID.err_code > 0){
									if(typeof contactPointId !== 'undefined' && !validator.isEmpty(contactPointId)){
										checkUniqeValue(apikey, "CONTACT_POINT_ID|" + contactPointId, 'CONTACT_POINT', function(resTelecomID){
											if(resTelecomID.err_code > 0){
								  			qString = {};
								  			qString.related_person_id = relatedPersonId;
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
						  			qString.related_person_id = relatedPersonId;
						  		
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
									res.json({"err_code": 501, "err_msg": "Related Person Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
				address: function getAddress(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var relatedPersonId = req.params.related_person_id;
					var addressId = req.params.address_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
								if(resRelatedPersonID.err_code > 0){
									if(typeof addressId !== 'undefined' && !validator.isEmpty(addressId)){
										checkUniqeValue(apikey, "ADDRESS_ID|" + addressId, 'ADDRESS', function(resAddressID){
											if(resAddressID.err_code > 0){
								  			qString = {};
								  			qString.related_person_id = relatedPersonId;
								  			qString._id = addressId;
									  		seedPhoenixFHIR.path.GET = {
													"Address" : {
														"location": "%(apikey)s/Address",
														"query": qString
													}
												}
												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

												ApiFHIR.get('Address', {"apikey": apikey}, {}, function(error, response, body){
													address = JSON.parse(body);
													if(address.err_code == 0){
														res.json({"err_code": 0, "data":address.data});	
													}else{
														res.json(address);
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Address Id not found"});		
											}
										})
									}else{
						  			qString = {};
						  			qString.related_person_id = relatedPersonId;
						  		
							  		seedPhoenixFHIR.path.GET = {
											"Address" : {
												"location": "%(apikey)s/Address",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('Address', {"apikey": apikey}, {}, function(error, response, body){
											address = JSON.parse(body);
											if(address.err_code == 0){
												res.json({"err_code": 0, "data":address.data});	
											}else{
												res.json(address);
											}
										})
									}
								}else{
									res.json({"err_code": 501, "err_msg": "Related Person Id not found"});		
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
					var relatedPersonId = req.params.related_person_id;
					var attachmentId = req.params.attachment_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
								if(resRelatedPersonID.err_code > 0){
									if(typeof attachmentId !== 'undefined' && !validator.isEmpty(attachmentId)){
										checkUniqeValue(apikey, "ATTACHMENT_ID|" + attachmentId, 'ATTACHMENT', function(resAttachmentID){
											if(resAttachmentID.err_code > 0){
								  			qString = {};
								  			qString.related_person_id = relatedPersonId;
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
						  			qString.related_person_id = relatedPersonId;
						  		
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
									}
								}else{
									res.json({"err_code": 501, "err_msg": "Related Person Id not found"});		
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
				relatedPerson: function addRelatedPerson(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					var err_code = 0;
					var err_msg = "";

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

					//patient_id
					if(typeof req.body.patient_id !== 'undefined'){
						patientId = req.body.patient_id;
						if(validator.isEmpty(patientId)){
							err_code = 2;
							err_msg = "Patient_id is required.";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'patient_id' in json request.";
					} 

					if(typeof req.body.relationship !== 'undefined'){
						relationshipCode = req.body.relationship.trim().toUpperCase();
						if(validator.isEmpty(relationshipCode)){
							err_code = 2;
							err_msg = "Relationship is required.";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'relationship' in json request.";
					} 

					//name
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
						if(validator.isEmpty(humanNamePrefix)){
							if(!typeof req.body.gender !== 'undefined'){
								gender = req.body.gender.trim().toLowerCase();
								if( gender == 'male'){
									humanNamePrefix =  'Mr';
								}else if(gender == 'female'){
									humanNamePrefix = 'Mrs';
								}else{
									humanNamePrefix = '';
								}		
							}			
						}
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


					//telecom
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

					//telecom value
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

					//telecom use code
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

					//gender
					if(typeof req.body.gender !== 'undefined'){
						gender =  req.body.gender.trim().toLowerCase();
						if(validator.isEmpty(gender)){
							err_code = 2;
							err_msg = "Gender is required.";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'gender' in json request.";
					}				

					//birthdate
					if(typeof req.body.birthdate !== 'undefined'){
						birthdate =  req.body.birthdate;
						if(validator.isEmpty(birthdate)){
							err_code = 2;
							err_msg = "Birthdate is required.";
						}else{
							if(!regex.test(birthdate)){
								err_code = 2;
								err_msg = "Birthdate invalid date format.";	
							}
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'birthdate' in json request.";
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
						addressDistrict = "";
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
						err_msg = "Please add sub-key 'postal_code' in json address request.";
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

					//
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

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
									if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
											if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, humanNameUseCode, 'NAME_USE', function(resNameUseCode){
													if(resNameUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
														checkCode(apikey, contactPointSystemCode, 'CONTACT_POINT_SYSTEM', function(resContactPointSystem){
															if(resContactPointSystem.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																checkCode(apikey, contactPointUseCode, 'CONTACT_POINT_USE', function(resContactPointUse){
																	if(resContactPointUse.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																		checkCode(apikey, gender, 'ADMINISTRATIVE_GENDER', function(resGender){
																			if(resGender.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																				checkCode(apikey, addressUseCode, 'ADDRESS_USE', function(resAddrUse){
																					if(resAddrUse.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																						checkCode(apikey, addressTypeCode, 'ADDRESS_TYPE', function(resAddrType){
																							if(resAddrType.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid	
																								checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resLanguage){
																									if(resLanguage.err_code > 0){
																										checkCode(apikey, relationshipCode, 'RELATEDPERSON_RELATIONSHIPTYPE', function(resRelationship){
																											if(resRelationship.err_code > 0){
																												myEmitter.once('checkIdentifierValue', function(){
																												checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
																													if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada
																														checkUniqeValue(apikey, "PATIENT_ID|" + patientId, 'PATIENT', function(resPatientId){
																															if(resPatientId.err_code > 0){ //menunjukan data patient valid
																																//proses insert
																																//set uniqe id
																																var relatedPersonId = 'rp' + uniqid.time();
																																var identifierId = 'ide' + uniqid.time();
																																var humanNameId = 'hn' + uniqid.time();
																																var contactPointId = 'cp' + uniqid.time();
																																var attachmentId = 'att' + uniqid.time();
																																var addressId = 'add' + uniqid.time();
																																//set by sistem
																																var identifierSystem = identifierId; 

																																//related_person
																																dataRelatedPerson = {
																																							"id": relatedPersonId,
																													  									"gender": gender,
																													  									"birthdate": birthdate,
																													  									"active": "true",
																													  									"relationship": relationshipCode,
																													  									"patient_id": patientId,
																													  									"period_start": periodStart,
																													  									"period_end": periodEnd
																													  								}
																													  		ApiFHIR.post('relatedPerson', {"apikey": apikey}, {body: dataRelatedPerson, json: true}, function(error, response, body){
																													  			var relatedPerson = body;
																													  			if(relatedPerson.err_code > 0){
																													  				res.json(relatedPerson);
																													  			}
																													  		})
																													  		
																													  		//identifier
																													  		dataIdentifier = {
																													  											"id": identifierId,
																											  													"use": identifierUseCode,
																											  													"type": identifierTypeCode,
																											  													"system": identifierSystem,
																											  													"value": identifierValue,
																											  													"period_start": identifierPeriodStart,
																											  													"period_end": identifierPeriodEnd,
																											  													"related_person_id": relatedPersonId
																											  												}
																															
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
																											  													"text": humanNamePrefix + ' ' + humanNameText + ' '+ humanNameSuffix,
																											  													"family": humanNameFamily,
																											  													"given": humanNameGiven,
																											  													"prefix": humanNamePrefix,
																											  													"suffix": humanNameSuffix,
																											  													"period_start": humanNamePeriodStart,
																											  													"period_end": humanNamePeriodEnd,
																											  													"related_person_id": relatedPersonId
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
																											  														"related_person_id": relatedPersonId
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
																									  														"related_person_id": relatedPersonId
																									  													}

																											  				//post to contact point
																											  				ApiFHIR.post('address', {"apikey": apikey}, {body: dataAddress, json: true}, function(error, response, body){
																											  					address = body;
																											  					if(address.err_code > 0){
																											  						res.json(address);	
																											  					}
																											  				})

																																//attachment
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
																																											"related_person_id": relatedPersonId
																																										}
																																
																																//method, endpoint, params, options, callback
																																ApiFHIR.post('attachment', {"apikey": apikey}, {body: dataAttachment, json:true}, function(error, response, body){
																																	if(error){
																																	  	res.json({"err_code": 1, "err_msg": error, "application": "Api FHIR", "function": "addPerson in attachment insert"});
																																	  }else{
																																	  	var attachment = body;
																																	  	if(attachment.err_code > 0){
																																	  		res.json(attachment);
																																	  	}
																																	  }
																																})
																										  					res.json({"err_code": 0, "err_msg": "Related Person has been add.", "data": [{"_id": relatedPersonId}]});
																															}else{
																																res.json({"err_code": 511, "err_msg": "Patient id is not found."});				
																															}
																														})
																													}else{
																														res.json({"err_code": 508, "err_msg": "Identifier value already exist."});		
																													}
																												})
																											})
																											myEmitter.emit('checkIdentifierValue');
																											}else{
																												res.json({"err_code": 510, "err_msg": "Relationship code not found"});		
																											}
																										}) 
																									}else{
																										res.json({"err_code": 509, "err_msg": "Photo language code not found"});		
																									}
																								})
																							}else{
																								res.json({"err_code": 507, "err_msg": "Address Type Code not found"});		
																							}
																						})
																					}else{
																						res.json({"err_code": 506, "err_msg": "Address Use Code not found"});		
																					}
																				})
																			}else{
																				res.json({"err_code": 505, "err_msg": "Gender Code not found"});
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
														res.json({"err_code": 503, "err_msg": "Identifier type code not found"});		
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
				identifier: function addIdentifier(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var relatedPersonId = req.params.related_person_id;

					var err_code = 0;
					var err_msg = "";

					//input check 
					if(typeof relatedPersonId !== 'undefined'){
						if(validator.isEmpty(relatedPersonId)){
							err_code = 2;
							err_msg = "Related Person id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Related Person id is required";
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
														checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
															if(resRelatedPersonID.err_code > 0){
																var identifierId = 'ide' + uniqid.time();
																//set by sistem
													  		
													  		dataIdentifier = {
													  											"id": identifierId,
											  													"use": identifierUseCode,
											  													"type": identifierTypeCode,
											  													"system": identifierId,
											  													"value": identifierValue,
											  													"period_start": identifierPeriodStart,
											  													"period_end": identifierPeriodEnd,
											  													"related_person_id": relatedPersonId
											  												}
															
											  				ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
											  					identifier = body;
											  					if(identifier.err_code == 0){
											  						res.json({"err_code": 0, "err_msg": "Identifier has been add in this related person.", "data": identifier.data});
											  					}else{
											  						res.json(identifier);	
											  					}
											  				})
															}else{
																res.json({"err_code": 503, "err_msg": "Related Person Id not found"});		
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
				humanName: function addHumanName(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var relatedPersonId = req.params.related_person_id;

					var err_code = 0;
					var err_msg = "";

					//input check 
					if(typeof relatedPersonId !== 'undefined'){
						if(validator.isEmpty(relatedPersonId)){
							err_code = 2;
							err_msg = "Related Person id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Related Person id is required";
					}

					//name
					//use code
					if(typeof req.body.use !== 'undefined'){
						humanNameUseCode =  req.body.use.trim().toLowerCase();
						if(validator.isEmpty(humanNameUseCode)){
							err_code = 2;
							err_msg = "Name Use Code is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'use' in json name request.";
					} 

					//fullname
					if(typeof req.body.text !== 'undefined'){
						humanNameText =  req.body.text;
						if(validator.isEmpty(humanNameText)){
							err_code = 2;
							err_msg = "Name text is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add sub-key 'text' in your json name request.";
					} 

					//surname
					if(typeof req.body.family !== 'undefined'){
						humanNameFamily =  req.body.family;
						if(validator.isEmpty(humanNameFamily)){
							err_code = 2;
							err_msg = "Family name is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'family' in your json name request.";
					}

					//given name
					if(typeof req.body.given !== 'undefined'){
						humanNameGiven =  req.body.given;
						if(validator.isEmpty(humanNameGiven)){
							humanNameGiven = "";
						}
					}else{
						humanNameGiven = "";
					}

					//prefix name
					if(typeof req.body.prefix !== 'undefined'){
						humanNamePrefix =  req.body.prefix;
						if(validator.isEmpty(humanNamePrefix)){
							humanNamePrefix = '';		
						}
					}else{
						humanNamePrefix = '';
					}

					//suffix name
					if(typeof req.body.suffix !== 'undefined'){
						humanNameSuffix =  req.body.suffix;
					}else{
						humanNameSuffix =  "";
					}

					//period name
					if(typeof req.body.period !== 'undefined'){
						var period = req.body.period;
						if(period.indexOf("to") > 0){
							arrPeriod = period.split("to");
							humanNamePeriodStart = arrPeriod[0];
							humanNamePeriodEnd = arrPeriod[1];
							
							if(!regex.test(humanNamePeriodStart) && !regex.test(humanNamePeriodEnd)){
								err_code = 2;
								err_msg = "HumanName Period invalid date format.";
							}	
						}else{
							err_code = 1;
							err_msg = "HumanName Period request format is wrong, `ex: start to end` ";
						}
					}else{
						humanNamePeriodStart = "";
						humanNamePeriodEnd = "";
					}

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
									if(resRelatedPersonID.err_code > 0){
										checkCode(apikey, humanNameUseCode, 'NAME_USE', function(resNameUseCode){
											if(resNameUseCode.err_code > 0){
												var humanNameId = 'hn' + uniqid.time();
												dataHumanName = {
					  													"id": humanNameId,
					  													"use": humanNameUseCode,
					  													"text": humanNamePrefix +' '+ humanNameText +' '+ humanNameSuffix,
					  													"family": humanNameFamily,
					  													"given": humanNameGiven,
					  													"prefix": humanNamePrefix,
					  													"suffix": humanNameSuffix,
					  													"period_start": humanNamePeriodStart,
					  													"period_end": humanNamePeriodEnd,
					  													"related_person_id": relatedPersonId
					  												}

							  				ApiFHIR.post('humanName', {"apikey": apikey}, {body: dataHumanName, json: true}, function(error, response, body){
							  					humanName = body;
							  					if(humanName.err_code == 0){
							  						res.json({"err_code": 0, "err_msg": "Human Name has been add in this related person.", "data": humanName.data});
							  					}else{
							  						res.json(humanName);	
							  					}
							  				})
											}else{
												res.json({"err_code": 501, "err_msg": "Name use code not found"});		
											}
										})
									}else{
										res.json({"err_code": 503, "err_msg": "Related Person Id not found"});		
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
					var relatedPersonId = req.params.related_person_id;

					var err_code = 0;
					var err_msg = "";

					//input check 
					if(typeof relatedPersonId !== 'undefined'){
						if(validator.isEmpty(relatedPersonId)){
							err_code = 2;
							err_msg = "Related Person id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Related Person id is required";
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
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
									if(resRelatedPersonID.err_code > 0){
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
											  														"related_person_id": relatedPersonId
											  													}

											  				ApiFHIR.post('contactPoint', {"apikey": apikey}, {body: dataContactPoint, json: true}, function(error, response, body){
											  					contactPoint = body;
											  					if(contactPoint.err_code == 0){
											  						res.json({"err_code": 0, "err_msg": "Telecom has been add in this related person.", "data": contactPoint.data});
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
										res.json({"err_code": 503, "err_msg": "Related Person Id not found"});	
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
				address: function addAddress(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var relatedPersonId = req.params.related_person_id;

					var err_code = 0;
					var err_msg = "";

					//input check 
					if(typeof relatedPersonId !== 'undefined'){
						if(validator.isEmpty(relatedPersonId)){
							err_code = 2;
							err_msg = "Related Person id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Related Person id is required";
					}

					//address use
					if(typeof req.body.use !== 'undefined'){
						addressUseCode =  req.body.use.trim().toLowerCase();
						if(validator.isEmpty(addressUseCode)){
							err_code = 2;
							err_msg = "Address Use is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'use' in json request.";
					} 

					//address type
					if(typeof req.body.type !== 'undefined'){
						addressTypeCode =  req.body.type.trim().toLowerCase();
						if(validator.isEmpty(addressTypeCode)){
							err_code = 2;
							err_msg = "Address Type is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'type' in json request.";
					} 

					//address text
					if(typeof req.body.text !== 'undefined'){
						addressText =  req.body.text;
						if(validator.isEmpty(addressText)){
							err_code = 2;
							err_msg = "Address Text is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'text' in json request.";
					}

					//address line
					if(typeof req.body.line !== 'undefined'){
						addressLine =  req.body.line;
						if(validator.isEmpty(addressLine)){
							err_code = 2;
							err_msg = "Address Line is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'line' in json request.";
					}

					//address city
					if(typeof req.body.city !== 'undefined'){
						addressCity =  req.body.city;
						if(validator.isEmpty(addressCity)){
							err_code = 2;
							err_msg = "Address City is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'city' in json request.";
					} 

					//address district
					if(typeof req.body.district !== 'undefined'){
						addressDistrict =  req.body.district;
					}else{
						addressDistrict = "";
					}

					//address state
					if(typeof req.body.state !== 'undefined'){
						addressState =  req.body.state;
						if(validator.isEmpty(addressState)){
							err_code = 2;
							err_msg = "State is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'state' in json request.";
					}

					//address postal code
					if(typeof req.body.postal_code !== 'undefined'){
						addressPostalCode =  req.body.postal_code;
						if(!validator.isPostalCode(addressPostalCode, 'any')){
							err_code = 2;
							err_msg = "Postal Code invalid format.";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'postal_code' in json request.";
					} 

					//address country
					if(typeof req.body.country !== 'undefined'){
						addressCountry =  req.body.country;
						if(validator.isEmpty(addressCountry)){
							err_code = 2;
							err_msg = "Country is required";
						}
					}else{
						err_code = 1;
						err_msg = "Please add key 'country' in json request.";
					} 

					//address period
					if(typeof req.body.period !== 'undefined'){
						var period = req.body.period;
						if(period.indexOf("to") > 0){
							arrPeriod = period.split("to");
							addressPeriodStart = arrPeriod[0];
							addressPeriodEnd = arrPeriod[1];
							
							if(!regex.test(addressPeriodStart) && !regex.test(addressPeriodEnd)){
								err_code = 2;
								err_msg = "Address Period invalid date format.";
							}	
						}else{
							err_code = 1;
							err_msg = "Address Period request format is wrong, `ex: start to end` ";
						}
					}else{
						addressPeriodStart = "";
						addressPeriodEnd = "";
					}

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
									if(resRelatedPersonID.err_code > 0){
										checkCode(apikey, addressUseCode, 'ADDRESS_USE', function(resAddressUseCode){
											if(resAddressUseCode.err_code > 0){
												checkCode(apikey, addressTypeCode, 'ADDRESS_TYPE', function(resAddressTypeCode){
													if(resAddressTypeCode.err_code > 0){
														var addressId = 'add' + uniqid.time();
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
							  														"related_person_id": relatedPersonId
							  													}

									  				ApiFHIR.post('address', {"apikey": apikey}, {body: dataAddress, json: true}, function(error, response, body){
									  					address = body;
									  					if(address.err_code == 0){
									  						res.json({"err_code": 0, "err_msg": "Address has been add in this related person.", "data": address.data});
									  					}else{
									  						res.json(address);	
									  					}
									  				})
													}else{
														res.json({"err_code": 504, "err_msg": "Address Type Code not found"});
													}
												})
											}else{
												res.json({"err_code": 504, "err_msg": "Address Use Code not found"});
											}
										})
									}else{
										res.json({"err_code": 503, "err_msg": "Related Person Id not found"});	
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
				attachment: function addAttachment(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var relatedPersonId = req.params.related_person_id;

					var err_code = 0;
					var err_msg = "";

					//input check 
					if(typeof relatedPersonId !== 'undefined'){
						if(validator.isEmpty(relatedPersonId)){
							err_code = 2;
							err_msg = "Related Person id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Related Person id is required";
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
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
									if(resRelatedPersonID.err_code > 0){
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
																							"url": attachmentId,
																							"related_person_id": relatedPersonId
																						}
												
												//method, endpoint, params, options, callback
												ApiFHIR.post('attachment', {"apikey": apikey}, {body: dataAttachment, json:true}, function(error, response, body){
											  	//cek apakah ada error atau tidak
											  	var attachment = body; //object
											  	//cek apakah ada error atau tidak
											  	if(attachment.err_code == 0){
											  		res.json({"err_code": 0, "err_msg": "Photo has been add in this related person.", "data": attachment.data});
											  	}else{
											  		res.json(attachment);		
											  	}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Language code not found"});			
											}
										})
									}else{
										res.json({"err_code": 501, "err_msg": "Patient Id not found"});	
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
				relatedPerson: function addRelatedPerson(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var relatedPersonId = req.params.related_person_id;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

					var err_code = 0;
					var err_msg = "";
					var dataRelatedPerson = {};
					//input check 
					if(typeof relatedPersonId !== 'undefined'){
						if(validator.isEmpty(relatedPersonId)){
							err_code = 2;
							err_msg = "Related Person id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Related Person id is required";
					}

					//patient_id
					if(typeof req.body.patient_id !== 'undefined'){
						patientId = req.body.patient_id;
						if(validator.isEmpty(patientId)){
							err_code = 2;
							err_msg = "Patient_id is required.";
						}else{
							dataRelatedPerson.patient_id = patientId;
						}
					}else{
						patientId = "";
					}

					if(typeof req.body.active !== 'undefined'){
						active = req.body.active;
						if(!validator.isBoolean(active)){
							err_code = 2;
							err_msg = "Active must be boolean.";
						}else{
							dataRelatedPerson.active = active;
						}
					} 

					if(typeof req.body.relationship !== 'undefined'){
						relationshipCode = req.body.relationship.trim().toUpperCase();
						if(validator.isEmpty(relationshipCode)){
							err_code = 2;
							err_msg = "Relationship is required.";
						}else{
							dataRelatedPerson.relationship = relationshipCode;
						}
					}else{
						relationshipCode = "";
					} 

					//gender
					if(typeof req.body.gender !== 'undefined'){
						gender =  req.body.gender.trim().toLowerCase();
						if(validator.isEmpty(gender)){
							err_code = 2;
							err_msg = "Gender is required.";
						}else{
							dataRelatedPerson.gender = gender;
						}
					}else{
						gender = "";
					}				

					//birthdate
					if(typeof req.body.birthdate !== 'undefined'){
						birthdate =  req.body.birthdate;
						if(validator.isEmpty(birthdate)){
							err_code = 2;
							err_msg = "Birthdate is required.";
						}else{
							if(!regex.test(birthdate)){
								err_code = 2;
								err_msg = "Birthdate invalid date format.";	
							}else{
								dataRelatedPerson.birthdate = birthdate;
							}
						}
					}				

					//period
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
						dataRelatedPerson.period_start = periodStart;
						dataRelatedPerson.period_end = periodEnd;
					}

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){	
								myEmitter.prependListener('updateRelatedPerson', function(){
									ApiFHIR.put('relatedPerson', {"apikey": apikey, "_id": relatedPersonId}, {body: dataRelatedPerson, json: true}, function(error, response, body){
				  					relatedPerson = body;
				  					if(relatedPerson.err_code > 0){
				  						res.json(relatedPerson);	
				  					}else{
				  						res.json({"err_code": 0, "err_msg": "Related Person has been update.", "data": [{"_id": relatedPersonId}]});
				  					}
				  				})
								})
								
								myEmitter.prependListener('checkRelatedPersonID', function(){
									checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonId){
										if(resRelatedPersonId.err_code > 0){ //menunjukan data patient valid
											if(validator.isEmpty(patientId)){
												myEmitter.emit('updateRelatedPerson');
											}else{
												checkUniqeValue(apikey, "PATIENT_ID|" + patientId, 'PATIENT', function(resPatientId){
													if(resPatientId.err_code > 0){ //menunjukan data patient valid
														myEmitter.emit('updateRelatedPerson');
													}else{
														res.json({"err_code": 504, "err_msg": "Patient id is not found."});				
													}
												})	
											}
										}else{
											res.json({"err_code": 503, "err_msg": "Related person id is not found."});				
										}
									})		
								})
							

								myEmitter.prependListener('checkGender', function(){
									if(validator.isEmpty(relationshipCode)){
										myEmitter.emit('checkRelatedPersonID');
									}else{
										checkCode(apikey, gender, 'ADMINISTRATIVE_GENDER', function(resGender){
											if(resGender.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkRelatedPersonID');
											}else{
												res.json({"err_code": 502, "err_msg": "Gender Code not found"});
											}	
										})
									}	
								})

								if(validator.isEmpty(relationshipCode)){
									myEmitter.emit('checkGender');
								}else{
									checkCode(apikey, relationshipCode, 'RELATEDPERSON_RELATIONSHIPTYPE', function(resRelationship){
										if(resRelationship.err_code > 0){
											myEmitter.emit('checkGender');
										}else{
											res.json({"err_code": 501, "err_msg": "Relationship code not found"});	
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
				identifier: function updateIdentifier(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var relatedPersonId = req.params.related_person_id;
					var identifierId = req.params.identifier_id;

					var err_code = 0;
					var err_msg = "";
					var dataIdentifier = {};
					
					//input check 
					if(typeof relatedPersonId !== 'undefined'){
						if(validator.isEmpty(relatedPersonId)){
							err_code = 2;
							err_msg = "Related Person id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Related Person id is required";
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
								myEmitter.prependListener('checkRelatedPersonID', function(){
									checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
										if(resRelatedPersonID.err_code > 0){
											checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
												if(resIdentifierID.err_code > 0){
													ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "RELATED_PERSON_ID|"+relatedPersonId}, {body: dataIdentifier, json: true}, function(error, response, body){
								  					identifier = body;
								  					if(identifier.err_code > 0){
								  						res.json(identifier);	
								  					}else{
								  						res.json({"err_code": 0, "err_msg": "Identifier has been update in this related person.", "data": identifier.data});
								  					}
								  				})
												}else{
													res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
												}
											})
										}else{
											res.json({"err_code": 504, "err_msg": "Related Person Id not found"});		
										}
									})
								})

								myEmitter.prependListener('checkIdentifierValue', function(){
									if(validator.isEmpty(identifierValue)){
										myEmitter.emit('checkRelatedPersonID');
									}else{
										checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
											if(resIdentifierValue.err_code == 0){
												myEmitter.emit('checkRelatedPersonID');				
											}else{
												res.json({"err_code": 503, "err_msg": "Identifier value already exist."});	
											}
										})
									}
								})

								myEmitter.prependListener('checkIdentifierType', function(){
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
				humanName: function updateHumanName(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var relatedPersonId = req.params.related_person_id;
					var humanNameId = req.params.human_name_id;

					var err_code = 0;
					var err_msg = "";
					var dataHumanName = {};
					//input check 
					if(typeof relatedPersonId !== 'undefined'){
						if(validator.isEmpty(relatedPersonId)){
							err_code = 2;
							err_msg = "Related Person id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Related Person id is required";
					}

					if(typeof humanNameId !== 'undefined'){
						if(validator.isEmpty(humanNameId)){
							err_code = 2;
							err_msg = "Human Name id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Human Name id is required";
					}

					//name
					//use code
					if(typeof req.body.use !== 'undefined'){
						humanNameUseCode =  req.body.use.trim().toLowerCase();
						if(validator.isEmpty(humanNameUseCode)){
							err_code = 2;
							err_msg = "Name Use Code is required";
						}else{
							dataHumanName.use = humanNameUseCode;
						}
					}else{
						humanNameUseCode = "";
					} 

					//fullname
					if(typeof req.body.text !== 'undefined'){
						humanNameText =  req.body.text;
						if(validator.isEmpty(humanNameText)){
							err_code = 2;
							err_msg = "Name text is required";
						}else{
							dataHumanName.text = humanNameText;
						}
					} 

					//surname
					if(typeof req.body.family !== 'undefined'){
						humanNameFamily =  req.body.family;
						if(validator.isEmpty(humanNameFamily)){
							err_code = 2;
							err_msg = "Family name is required";
						}else{
							dataHumanName.family = humanNameFamily;
						}
					}

					//given name
					if(typeof req.body.given !== 'undefined'){
						dataHumanName.given =  req.body.given;
					}

					//prefix name
					if(typeof req.body.prefix !== 'undefined'){
						humanNamePrefix =  req.body.prefix;
						dataHumanName.prefix = humanNamePrefix;
					}

					//suffix name
					if(typeof req.body.suffix !== 'undefined'){
						humanNameSuffix =  req.body.suffix;
						dataHumanName.prefix = humanNamePrefix;
					}

					//period name
					if(typeof req.body.period !== 'undefined'){
						var period = req.body.period;
						if(period.indexOf("to") > 0){
							arrPeriod = period.split("to");
							humanNamePeriodStart = arrPeriod[0];
							humanNamePeriodEnd = arrPeriod[1];
							
							if(!regex.test(humanNamePeriodStart) && !regex.test(humanNamePeriodEnd)){
								err_code = 2;
								err_msg = "Human Name Period invalid date format.";
							}else{
								dataHumanName.period_start = humanNamePeriodStart;
								dataHumanName.period_end = humanNamePeriodEnd;
							}	
						}else{
							err_code = 1;
							err_msg = "HumanName Period request format is wrong, `ex: start to end` ";
						}
					} 

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
									if(resRelatedPersonID.err_code > 0){
										checkUniqeValue(apikey, "HUMAN_NAME_ID|" + humanNameId, 'HUMAN_NAME', function(resHumanNameID){
											if(resHumanNameID.err_code > 0){
												myEmitter.prependOnceListener('updateHumanName', function(){	
													ApiFHIR.put('humanName', {"apikey": apikey, "_id": humanNameId, "dr": "RELATED_PERSON_ID|"+relatedPersonId}, {body: dataHumanName, json: true}, function(error, response, body){
								  					humanName = body;
								  					if(humanName.err_code > 0){
								  						res.json(humanName);	
								  					}else{
								  						res.json({"err_code": 0, "err_msg": "Human Name has been update in this related person.", "data": humanName.data});
								  					}
								  				})
												})

												if(!validator.isEmpty(humanNameUseCode)){
													checkCode(apikey, humanNameUseCode, 'NAME_USE', function(resUseCode){
														if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
															myEmitter.emit('updateHumanName');			
														}else{
															res.json({"err_code": 501, "err_msg": "Name use code not found"});
														}
													})
												}else{
													myEmitter.emit('updateHumanName');
												}
											}else{
												res.json({"err_code": 505, "err_msg": "Human Name Id not found"});		
											}
										})
									}else{
										res.json({"err_code": 504, "err_msg": "Patient Id not found"});		
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
				telecom: function updateTelecom(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var relatedPersonId = req.params.related_person_id;
					var contactPointId = req.params.contact_point_id;

					var err_code = 0;
					var err_msg = "";
					var dataContactPoint = {};

					//input check 
					if(typeof relatedPersonId !== 'undefined'){
						if(validator.isEmpty(relatedPersonId)){
							err_code = 2;
							err_msg = "Related Person id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Related Person id is required";
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
								myEmitter.prependListener('checkRelatedPersonID', function(){
									checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
										if(resRelatedPersonID.err_code > 0){
											checkUniqeValue(apikey, "CONTACT_POINT_ID|" + contactPointId, 'CONTACT_POINT', function(resContactPointID){
												if(resContactPointID.err_code > 0){
													ApiFHIR.put('contactPoint', {"apikey": apikey, "_id": contactPointId, "dr": "RELATED_PERSON_ID|"+relatedPersonId}, {body: dataContactPoint, json: true}, function(error, response, body){
								  					contactPoint = body;
								  					if(contactPoint.err_code > 0){
								  						res.json(contactPoint);	
								  					}else{
								  						res.json({"err_code": 0, "err_msg": "Telecom has been update in this related person.", "data": contactPoint.data});
								  					}
								  				})
												}else{
													res.json({"err_code": 505, "err_msg": "Telecom Id not found"});		
												}
											})
										}else{
											res.json({"err_code": 504, "err_msg": "Related Person Id not found"});		
										}
									})
								})

								myEmitter.prependListener('checkContactPointValue', function(){
									if(validator.isEmpty(contactPointValue)){
										myEmitter.emit('checkRelatedPersonID');
									}else{
										checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactPointValue, 'CONTACT_POINT', function(resContactPointValue){
											if(resContactPointValue.err_code == 0){
												myEmitter.emit('checkRelatedPersonID');				
											}else{
												res.json({"err_code": 503, "err_msg": "Identifier value already exist."});	
											}
										})
									}
								})

								myEmitter.prependListener('checkContactPointUse', function(){
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
				address: function updateAddress(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var relatedPersonId = req.params.related_person_id;
					var addressId = req.params.address_id;

					var err_code = 0;
					var err_msg = "";
					var dataAddress = {};

					//input check 
					if(typeof relatedPersonId !== 'undefined'){
						if(validator.isEmpty(relatedPersonId)){
							err_code = 2;
							err_msg = "Related Person id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Related Person id is required";
					}

					if(typeof addressId !== 'undefined'){
						if(validator.isEmpty(addressId)){
							err_code = 2;
							err_msg = "Address id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Address id is required";
					}

					//address use
					if(typeof req.body.use !== 'undefined'){
						addressUseCode =  req.body.use.trim().toLowerCase();
						if(validator.isEmpty(addressUseCode)){
							err_code = 2;
							err_msg = "Address Use is required";
						}else{
							dataAddress.use = addressUseCode;
						}
					}else{
						addressUseCode = "";
					} 

					//address type
					if(typeof req.body.type !== 'undefined'){
						addressTypeCode =  req.body.type.trim().toLowerCase();
						if(validator.isEmpty(addressTypeCode)){
							err_code = 2;
							err_msg = "Address Type is required";
						}else{
							dataAddress.type = addressTypeCode;
						}
					}else{
						addressTypeCode = "";
					} 

					//address text
					if(typeof req.body.text !== 'undefined'){
						addressText =  req.body.text;
						if(validator.isEmpty(addressText)){
							err_code = 2;
							err_msg = "Address Text is required";
						}else{
							dataAddress.text = addressText;
						}
					}

					//address line
					if(typeof req.body.line !== 'undefined'){
						addressLine =  req.body.line;
						if(validator.isEmpty(addressLine)){
							err_code = 2;
							err_msg = "Address Line is required";
						}else{
							dataAddress.line = addressLine;
						}
					}

					//address city
					if(typeof req.body.city !== 'undefined'){
						addressCity =  req.body.city;
						if(validator.isEmpty(addressCity)){
							err_code = 2;
							err_msg = "Address City is required";
						}else{
							dataAddress.city = addressCity;
						}
					} 

					//address district
					if(typeof req.body.district !== 'undefined'){
						addressDistrict =  req.body.district;
						dataAddress.district = addressDistrict;
					}

					//address state
					if(typeof req.body.state !== 'undefined'){
						addressState =  req.body.state;
						if(validator.isEmpty(addressState)){
							err_code = 2;
							err_msg = "State is required";
						}else{
							dataAddress.state = addressState;
						}
					}

					//address postal code
					if(typeof req.body.postal_code !== 'undefined'){
						addressPostalCode =  req.body.postal_code;
						if(!validator.isPostalCode(addressPostalCode, 'any')){
							err_code = 2;
							err_msg = "Postal Code invalid format.";
						}else{
							dataAddress.postal_code = addressPostalCode;
						}
					} 

					//address country
					if(typeof req.body.country !== 'undefined'){
						addressCountry =  req.body.country;
						if(validator.isEmpty(addressCountry)){
							err_code = 2;
							err_msg = "Country is required";
						}else{
							dataAddress.country = addressCountry;
						}
					} 

					//address period
					if(typeof req.body.period !== 'undefined'){
						var period = req.body.period;
						if(period.indexOf("to") > 0){
							arrPeriod = period.split("to");
							addressPeriodStart = arrPeriod[0];
							addressPeriodEnd = arrPeriod[1];
							
							if(!regex.test(addressPeriodStart) && !regex.test(addressPeriodEnd)){
								err_code = 2;
								err_msg = "Address Period invalid date format.";
							}else{
								dataAddress.period_start = addressPeriodStart;
								dataAddress.period_end = addressPeriodEnd;
							}	
						}else{
							dataAddress.period_start = "";
							dataAddress.period_end = "";
						}
					}

					if(err_code == 0){
						//check apikey
						checkApikey(apikey, ipAddres, function(result){
							if(result.err_code == 0){
								myEmitter.prependListener('checkRelatedPersonID', function(){
									checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
										if(resRelatedPersonID.err_code > 0){
											checkUniqeValue(apikey, "ADDRESS_ID|" + addressId, 'ADDRESS', function(resAddressID){
												if(resAddressID.err_code > 0){
													ApiFHIR.put('address', {"apikey": apikey, "_id": addressId, "dr": "RELATED_PERSON_ID|"+relatedPersonId}, {body: dataAddress, json: true}, function(error, response, body){
								  					address = body;
								  					if(address.err_code > 0){
								  						res.json(address);	
								  					}else{
								  						res.json({"err_code": 0, "err_msg": "Address has been update in this related person.", "data": address.data});
								  					}
								  				})
												}else{
													res.json({"err_code": 505, "err_msg": "Address Id not found"});		
												}
											})
										}else{
											res.json({"err_code": 504, "err_msg": "Related Person Id not found"});		
										}
									})
								})

								myEmitter.prependListener('checkAddressType', function(){
									if(validator.isEmpty(addressTypeCode)){
										myEmitter.emit('checkRelatedPersonID');
									}else{
										checkCode(apikey, addressTypeCode, 'ADDRESS_TYPE', function(resAddressTypeCode){
											if(resAddressTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												myEmitter.emit('checkRelatedPersonID');
											}else{
												res.json({"err_code": 502, "err_msg": "Address Type Code not found"});		
											}
										})
									}
								})

								if(validator.isEmpty(addressUseCode)){
									myEmitter.emit('checkAddressType');	
								}else{
									checkCode(apikey, addressUseCode, 'ADDRESS_USE', function(resAddressUseCode){
										if(resAddressUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											myEmitter.emit('checkAddressType');
										}else{
											res.json({"err_code": 501, "err_msg": "Address Use Code not found"});
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
					var relatedPersonId = req.params.related_person_id;
					var attachmentId = req.params.attachment_id;

					var err_code = 0;
					var err_msg = "";
					var dataAttachment = {};

					//input check 
					if(typeof relatedPersonId !== 'undefined'){
						if(validator.isEmpty(relatedPersonId)){
							err_code = 2;
							err_msg = "Related Person id is required";
						}
					}else{
						err_code = 2;
						err_msg = "Related Person id is required";
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
								myEmitter.prependListener('checkRelatedPersonID', function(){
									checkUniqeValue(apikey, "RELATED_PERSON_ID|" + relatedPersonId, 'RELATED_PERSON', function(resRelatedPersonID){
										if(resRelatedPersonID.err_code > 0){
											checkUniqeValue(apikey, "ATTACHMENT_ID|" + attachmentId, 'ATTACHMENT', function(resAttachmentID){
												if(resAttachmentID.err_code > 0){
													ApiFHIR.put('attachment', {"apikey": apikey, "_id": attachmentId, "dr": "RELATED_PERSON_ID|"+relatedPersonId}, {body: dataAttachment, json: true}, function(error, response, body){
								  					attachment = body;
								  					if(attachment.err_code > 0){
								  						res.json(attachment);	
								  					}else{
								  						res.json({"err_code": 0, "err_msg": "Photo has been update in this related person.", "data": attachment.data});
								  					}
								  				})
												}else{
													res.json({"err_code": 505, "err_msg": "Photo Id not found"});		
												}
											})
										}else{
											res.json({"err_code": 504, "err_msg": "Related Person Id not found"});		
										}
									})
								})

								if(validator.isEmpty(attachmentLanguageCode)){
									myEmitter.emit('checkRelatedPersonID');	
								}else{
									checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resLanguageCode){
										if(resLanguageCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
											myEmitter.emit('checkRelatedPersonID');
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