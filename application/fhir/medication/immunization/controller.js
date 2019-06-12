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
		immunization : function getImmunization(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var immunizationId = req.query._id;
			var date = req.query.date;
			var doseSequence = req.query.doseSequence;
			var identifier = req.query.identifier;
			var location = req.query.location;
			var lotNumber = req.query.lotNumber;
			var manufacturer = req.query.manufacturer;
			var notgiven = req.query.notgiven;
			var patient = req.query.patient;
			var practitioner = req.query.practitioner;
			var reaction = req.query.reaction;
			var reactionDate = req.query.reactionDate;
			var reason = req.query.reason;
			var reasonNotGiven = req.query.reasonNotGiven;
			var status = req.query.status;
			var vaccineCode = req.query.vaccineCode;
			var offset = req.query.offset;
			var limit = req.query.limit;

			if(typeof immunizationId !== 'undefined'){
				if(!validator.isEmpty(immunizationId)){
					qString.immunizationId = immunizationId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Immunization id is required."});
				}
			}

			if(typeof date !== 'undefined'){
				if(!validator.isEmpty(date)){
					if(!regex.test(date)){
						res.json({"err_code": 1, "err_msg": "date invalid format."});
					}else{
						qString.date = date; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "date is empty."});
				}
			}

			if(typeof doseSequence !== 'undefined'){
				if(!validator.isEmpty(doseSequence)){
					if(isInt(doseSequence)){
						qString.doseSequence = doseSequence;
					}else{
						res.json({"err_code": 1, "err_msg": "dose sequence is not number."});
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "dose sequence is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "identifier is empty."});
				}
			}

			if(typeof location !== 'undefined'){
				if(!validator.isEmpty(location)){
					qString.location = location; 
				}else{
					res.json({"err_code": 1, "err_msg": "location is empty."});
				}
			}

			if(typeof lotNumber !== 'undefined'){
				if(!validator.isEmpty(lotNumber)){
					qString.lotNumber = lotNumber; 
				}else{
					res.json({"err_code": 1, "err_msg": "lot number is empty."});
				}
			}

			if(typeof manufacturer !== 'undefined'){
				if(!validator.isEmpty(manufacturer)){
					qString.manufacturer = manufacturer; 
				}else{
					res.json({"err_code": 1, "err_msg": "manufacturer is empty."});
				}
			}

			if(typeof notgiven !== 'undefined'){
				if(!validator.isEmpty(notgiven)){
					qString.notgiven = notgiven; 
				}else{
					res.json({"err_code": 1, "err_msg": "notgiven is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "patient is empty."});
				}
			}

			if(typeof practitioner !== 'undefined'){
				if(!validator.isEmpty(practitioner)){
					qString.practitioner = practitioner; 
				}else{
					res.json({"err_code": 1, "err_msg": "practitioner is empty."});
				}
			}

			if(typeof reaction !== 'undefined'){
				if(!validator.isEmpty(reaction)){
					qString.reaction = reaction; 
				}else{
					res.json({"err_code": 1, "err_msg": "reaction is empty."});
				}
			}

			if(typeof reactionDate !== 'undefined'){
				if(!validator.isEmpty(reactionDate)){
					qString.reactionDate = reactionDate; 
				}else{
					res.json({"err_code": 1, "err_msg": "reaction date is empty."});
				}
			}

			if(typeof reason !== 'undefined'){
				if(!validator.isEmpty(reason)){
					qString.reason = reason; 
				}else{
					res.json({"err_code": 1, "err_msg": "reason is empty."});
				}
			}

			if(typeof reasonNotGiven !== 'undefined'){
				if(!validator.isEmpty(reasonNotGiven)){
					qString.reasonNotGiven = reasonNotGiven; 
				}else{
					res.json({"err_code": 1, "err_msg": "reason not given is empty."});
				}
			}

			if(typeof status !== 'undefined'){
				if(!validator.isEmpty(status)){
					qString.status = status; 
				}else{
					res.json({"err_code": 1, "err_msg": "status is empty."});
				}
			}

			if(typeof vaccineCode !== 'undefined'){
				if(!validator.isEmpty(vaccineCode)){
					qString.vaccineCode = vaccineCode; 
				}else{
					res.json({"err_code": 1, "err_msg": "vaccine code is empty."});
				}
			}
			
			if(typeof offset !== 'undefined'){
				if(!validator.isEmpty(offset)){
					qString.offset = offset; 
				}else{
					res.json({"err_code": 1, "err_msg": "offset id is empty."});
				}
			}

			if(typeof limit !== 'undefined'){
				if(!validator.isEmpty(limit)){
					if(!validator.isInt(limit)){
						err_code = 2;
						err_msg = "limit must be number";
					} else{
						qString.limit = limit; 	
					}
				}else{
					res.json({"err_code": 1, "err_msg": "limit is empty."});
				}
			}


			seedPhoenixFHIR.path.GET = {
				"Immunization" : {
					"location": "%(apikey)s/Immunization",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('Immunization', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var immunization = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(immunization.err_code == 0){
								//cek jumdata dulu
								if(immunization.data.length > 0){
									newImmunization = [];
									for(i=0; i < immunization.data.length; i++){
										myEmitter.once("getIdentifier", function(immunization, index, newImmunization, countImmunization){
											/*console.log(immunization);*/
														//get identifier
														qString = {};
														qString.immunization_id = immunization.id;
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
																var objectImmunization = {};
																objectImmunization.resourceType = immunization.resourceType;
																objectImmunization.id = immunization.id;
																objectImmunization.identifier = identifier.data;
																objectImmunization.status = immunization.status;
																objectImmunization.notGiven = immunization.notGiven;
																objectImmunization.veccineCode = immunization.veccineCode;
																objectImmunization.patient = immunization.patient;
																objectImmunization.encounter = immunization.encounter;
																objectImmunization.date = immunization.date;
																objectImmunization.primarySource = immunization.primarySource;
																objectImmunization.reportOrigin = immunization.reportOrigin;
																objectImmunization.location = immunization.location;
																objectImmunization.manufacturer = immunization.manufacturer;
																objectImmunization.iotNumber = immunization.iotNumber;
																objectImmunization.expirationDate = immunization.expirationDate;
																objectImmunization.site = immunization.site;
																objectImmunization.route = immunization.route;
																objectImmunization.doseQuantity = immunization.doseQuantity;
																objectImmunization.explanation = immunization.explanation;
																
																
																newImmunization[index] = objectImmunization;
																
																/*if(index == countImmunization -1 ){
																	res.json({"err_code": 0, "data":newImmunization});				
																}*/

																myEmitter.once('getImmunizationPractitioner', function(immunization, index, newImmunization, countImmunization){
																				qString = {};
																				qString.immunization_id = immunization.id;
																				seedPhoenixFHIR.path.GET = {
																					"ImmunizationPractitioner" : {
																						"location": "%(apikey)s/ImmunizationPractitioner",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('ImmunizationPractitioner', {"apikey": apikey}, {}, function(error, response, body){
																					immunizationPractitioner = JSON.parse(body);
																					if(immunizationPractitioner.err_code == 0){
																						var objectImmunization = {};
																						objectImmunization.resourceType = immunization.resourceType;
																						objectImmunization.id = immunization.id;
																						objectImmunization.identifier = immunization.identifier;
																						objectImmunization.status = immunization.status;
																						objectImmunization.notGiven = immunization.notGiven;
																						objectImmunization.veccineCode = immunization.veccineCode;
																						objectImmunization.patient = immunization.patient;
																						objectImmunization.encounter = immunization.encounter;
																						objectImmunization.date = immunization.date;
																						objectImmunization.primarySource = immunization.primarySource;
																						objectImmunization.reportOrigin = immunization.reportOrigin;
																						objectImmunization.location = immunization.location;
																						objectImmunization.manufacturer = immunization.manufacturer;
																						objectImmunization.iotNumber = immunization.iotNumber;
																						objectImmunization.expirationDate = immunization.expirationDate;
																						objectImmunization.site = immunization.site;
																						objectImmunization.route = immunization.route;
																						objectImmunization.doseQuantity = immunization.doseQuantity;
																						objectImmunization.practitioner = immunizationPractitioner.data;
																						objectImmunization.explanation = immunization.explanation;

																						newImmunization[index] = objectImmunization;

																						/*if(index == countImmunization -1 ){
																							res.json({"err_code": 0, "data":newImmunization});				
																						}*/
																						myEmitter.once('getImmunizationReaction', function(immunization, index, newImmunization, countImmunization){
																							qString = {};
																							qString.immunization_id = immunization.id;
																							seedPhoenixFHIR.path.GET = {
																								"ImmunizationReaction" : {
																									"location": "%(apikey)s/ImmunizationReaction",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('ImmunizationReaction', {"apikey": apikey}, {}, function(error, response, body){
																								immunizationReaction = JSON.parse(body);
																								if(immunizationReaction.err_code == 0){
																									var objectImmunization = {};
																									objectImmunization.resourceType = immunization.resourceType;
																									objectImmunization.id = immunization.id;
																									objectImmunization.identifier = immunization.identifier;
																									objectImmunization.status = immunization.status;
																									objectImmunization.notGiven = immunization.notGiven;
																									objectImmunization.veccineCode = immunization.veccineCode;
																									objectImmunization.patient = immunization.patient;
																									objectImmunization.encounter = immunization.encounter;
																									objectImmunization.date = immunization.date;
																									objectImmunization.primarySource = immunization.primarySource;
																									objectImmunization.reportOrigin = immunization.reportOrigin;
																									objectImmunization.location = immunization.location;
																									objectImmunization.manufacturer = immunization.manufacturer;
																									objectImmunization.iotNumber = immunization.iotNumber;
																									objectImmunization.expirationDate = immunization.expirationDate;
																									objectImmunization.site = immunization.site;
																									objectImmunization.route = immunization.route;
																									objectImmunization.doseQuantity = immunization.doseQuantity;
																									objectImmunization.practitioner = immunization.practitioner;
																									objectImmunization.explanation = immunization.explanation;
																									objectImmunization.reaction = immunizationReaction.data;

																									newImmunization[index] = objectImmunization;

																									myEmitter.once('getImmunizationVaccinationProtocol', function(immunization, index, newImmunization, countImmunization){
																										qString = {};
																										qString.immunization_id = immunization.id;
																										seedPhoenixFHIR.path.GET = {
																											"ImmunizationVaccinationProtocol" : {
																												"location": "%(apikey)s/ImmunizationVaccinationProtocol",
																												"query": qString
																											}
																										}

																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																										ApiFHIR.get('ImmunizationVaccinationProtocol', {"apikey": apikey}, {}, function(error, response, body){
																											immunizationVaccinationProtocol = JSON.parse(body);
																											if(immunizationVaccinationProtocol.err_code == 0){
																												var objectImmunization = {};
																												objectImmunization.resourceType = immunization.resourceType;
																												objectImmunization.id = immunization.id;
																												objectImmunization.identifier = immunization.identifier;
																												objectImmunization.status = immunization.status;
																												objectImmunization.notGiven = immunization.notGiven;
																												objectImmunization.veccineCode = immunization.veccineCode;
																												objectImmunization.patient = immunization.patient;
																												objectImmunization.encounter = immunization.encounter;
																												objectImmunization.date = immunization.date;
																												objectImmunization.primarySource = immunization.primarySource;
																												objectImmunization.reportOrigin = immunization.reportOrigin;
																												objectImmunization.location = immunization.location;
																												objectImmunization.manufacturer = immunization.manufacturer;
																												objectImmunization.iotNumber = immunization.iotNumber;
																												objectImmunization.expirationDate = immunization.expirationDate;
																												objectImmunization.site = immunization.site;
																												objectImmunization.route = immunization.route;
																												objectImmunization.doseQuantity = immunization.doseQuantity;
																												objectImmunization.practitioner = immunization.practitioner;
																												objectImmunization.explanation = immunization.explanation;
																												objectImmunization.reaction = immunization.reaction;
																												objectImmunization.vaccinationProtocol = immunizationVaccinationProtocol.data;


																												newImmunization[index] = objectImmunization;
																												/*if(index == countImmunization -1 ){
																													res.json({"err_code": 0, "data":newImmunization});
																												}*/
																												myEmitter.once('getImmunizationNote', function(immunization, index, newImmunization, countImmunization){
																													qString = {};
																													qString.immunization_id = immunization.id;
																													seedPhoenixFHIR.path.GET = {
																														"Annotation" : {
																															"location": "%(apikey)s/Annotation",
																															"query": qString
																														}
																													}

																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																													ApiFHIR.get('Annotation', {"apikey": apikey}, {}, function(error, response, body){
																														annotation = JSON.parse(body);
																														if(annotation.err_code == 0){
																															var objectImmunization = {};
																															objectImmunization.resourceType = immunization.resourceType;
																															objectImmunization.id = immunization.id;
																															objectImmunization.identifier = immunization.identifier;
																															objectImmunization.status = immunization.status;
																															objectImmunization.notGiven = immunization.notGiven;
																															objectImmunization.veccineCode = immunization.veccineCode;
																															objectImmunization.patient = immunization.patient;
																															objectImmunization.encounter = immunization.encounter;
																															objectImmunization.date = immunization.date;
																															objectImmunization.primarySource = immunization.primarySource;
																															objectImmunization.reportOrigin = immunization.reportOrigin;
																															objectImmunization.location = immunization.location;
																															objectImmunization.manufacturer = immunization.manufacturer;
																															objectImmunization.iotNumber = immunization.iotNumber;
																															objectImmunization.expirationDate = immunization.expirationDate;
																															objectImmunization.site = immunization.site;
																															objectImmunization.route = immunization.route;
																															objectImmunization.doseQuantity = immunization.doseQuantity;
																															objectImmunization.practitioner = immunization.practitioner;
																															objectImmunization.note = annotation.data;
																															objectImmunization.explanation = immunization.explanation;
																															objectImmunization.reaction = immunization.reaction;
																															objectImmunization.vaccinationProtocol = immunization.vaccinationProtocol;

																															newImmunization[index] = objectImmunization;
																															if(index == countImmunization -1 ){
																																res.json({"err_code": 0, "data":newImmunization});
																															}
																														}else{
																															res.json(annotation);			
																														}
																													})
																												})
																												myEmitter.emit('getImmunizationNote', objectImmunization, index, newImmunization, countImmunization);	
																											}else{
																												res.json(immunizationVaccinationProtocol);			
																											}
																										})
																									})
																									myEmitter.emit('getImmunizationVaccinationProtocol', objectImmunization, index, newImmunization, countImmunization);			
																								}else{
																									res.json(immunizationReaction);			
																								}
																							})
																						})
																						myEmitter.emit('getImmunizationReaction', objectImmunization, index, newImmunization, countImmunization);
																					}else{
																						res.json(immunizationPractitioner);			
																					}
																				})
																			})
																myEmitter.emit('getImmunizationPractitioner', objectImmunization, index, newImmunization, countImmunization);
															}else{
																res.json(identifier);
															}
														})
													})
										myEmitter.emit("getIdentifier", immunization.data[i], i, newImmunization, immunization.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Immunization is empty."});	
								}
							}else{
								res.json(immunization);
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
					var immunizationId = req.params.immunization_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resPatientID){
								if(resPatientID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.immunization_id = immunizationId;
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
						  			qString.immunization_id = immunizationId;
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
									res.json({"err_code": 501, "err_msg": "Immunization Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		immunizationPractitioner: function getImmunizationPractitioner(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var immunizationId = req.params.immunization_id;
					var immunizationPractitionerId = req.params.immunization_practitioner_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resPatientID){
								if(resPatientID.err_code > 0){
									if(typeof immunizationPractitionerId !== 'undefined' && !validator.isEmpty(immunizationPractitionerId)){
										checkUniqeValue(apikey, "PRACTITIONER_ID|" + immunizationPractitionerId, 'IMMUNIZATION_PRACTITIONER', function(resImmunizationPractitionerID){
											if(resImmunizationPractitionerID.err_code > 0){
												//get immunizationPractitioner
								  			qString = {};
								  			qString.immunization_id = immunizationId;
								  			qString._id = immunizationPractitionerId;
									  		seedPhoenixFHIR.path.GET = {
													"ImmunizationPractitioner" : {
														"location": "%(apikey)s/ImmunizationPractitioner",
														"query": qString
													}
												}
												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

												ApiFHIR.get('ImmunizationPractitioner', {"apikey": apikey}, {}, function(error, response, body){
													immunizationPractitioner = JSON.parse(body);
													if(immunizationPractitioner.err_code == 0){
														res.json({"err_code": 0, "data":immunizationPractitioner.data});	
													}else{
														res.json(immunizationPractitioner);
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Immunization Practitioner Id not found"});		
											}
										})
									}else{
										//get immunizationPractitioner
						  			qString = {};
						  			qString.immunization_id = immunizationId;
							  		seedPhoenixFHIR.path.GET = {
											"ImmunizationPractitioner" : {
												"location": "%(apikey)s/ImmunizationPractitioner",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ImmunizationPractitioner', {"apikey": apikey}, {}, function(error, response, body){
											immunizationPractitioner = JSON.parse(body);
											if(immunizationPractitioner.err_code == 0){
												res.json({"err_code": 0, "data":immunizationPractitioner.data});	
											}else{
												res.json(immunizationPractitioner);
											}
										})
									}
								}else{
									res.json({"err_code": 501, "err_msg": "Immunization Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		immunizationReaction: function getImmunizationReaction(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var immunizationId = req.params.immunization_id;
					var immunizationReactionId = req.params.immunization_reaction_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resPatientID){
								if(resPatientID.err_code > 0){
									if(typeof immunizationReactionId !== 'undefined' && !validator.isEmpty(immunizationReactionId)){
										checkUniqeValue(apikey, "REACTION_ID|" + immunizationReactionId, 'IMMUNIZATION_REACTION', function(resImmunizationReactionID){
											if(resImmunizationReactionID.err_code > 0){
												//get immunizationReaction
								  			qString = {};
								  			qString.immunization_id = immunizationId;
								  			qString._id = immunizationReactionId;
									  		seedPhoenixFHIR.path.GET = {
													"ImmunizationReaction" : {
														"location": "%(apikey)s/ImmunizationReaction",
														"query": qString
													}
												}
												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

												ApiFHIR.get('ImmunizationReaction', {"apikey": apikey}, {}, function(error, response, body){
													immunizationReaction = JSON.parse(body);
													if(immunizationReaction.err_code == 0){
														res.json({"err_code": 0, "data":immunizationReaction.data});	
													}else{
														res.json(immunizationReaction);
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Immunization Reaction Id not found"});		
											}
										})
									}else{
										//get immunizationReaction
						  			qString = {};
						  			qString.immunization_id = immunizationId;
							  		seedPhoenixFHIR.path.GET = {
											"ImmunizationReaction" : {
												"location": "%(apikey)s/ImmunizationReaction",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ImmunizationReaction', {"apikey": apikey}, {}, function(error, response, body){
											immunizationReaction = JSON.parse(body);
											if(immunizationReaction.err_code == 0){
												res.json({"err_code": 0, "data":immunizationReaction.data});	
											}else{
												res.json(immunizationReaction);
											}
										})
									}
								}else{
									res.json({"err_code": 501, "err_msg": "Immunization Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		immunizationVaccinationProtocol: function getImmunizationVaccinationProtocol(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var immunizationId = req.params.immunization_id;
					var immunizationVaccinationProtocolId = req.params.immunization_vaccination_protocol_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resPatientID){
								if(resPatientID.err_code > 0){
									if(typeof immunizationVaccinationProtocolId !== 'undefined' && !validator.isEmpty(immunizationVaccinationProtocolId)){
										checkUniqeValue(apikey, "vaccination_protocol_id|" + immunizationVaccinationProtocolId, 'IMMUNIZATION_VACCINATION_PROTOCOL', function(resImmunizationVaccinationProtocolID){
											if(resImmunizationVaccinationProtocolID.err_code > 0){
												//get immunizationVaccinationProtocol
								  			qString = {};
								  			qString.immunization_id = immunizationId;
								  			qString._id = immunizationVaccinationProtocolId;
									  		seedPhoenixFHIR.path.GET = {
													"ImmunizationVaccinationProtocol" : {
														"location": "%(apikey)s/ImmunizationVaccinationProtocol",
														"query": qString
													}
												}
												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

												ApiFHIR.get('ImmunizationVaccinationProtocol', {"apikey": apikey}, {}, function(error, response, body){
													immunizationVaccinationProtocol = JSON.parse(body);
													if(immunizationVaccinationProtocol.err_code == 0){
														res.json({"err_code": 0, "data":immunizationVaccinationProtocol.data});	
													}else{
														res.json(immunizationVaccinationProtocol);
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Immunization Vaccination Protocol Id not found"});		
											}
										})
									}else{
										//get immunizationVaccinationProtocol
						  			qString = {};
						  			qString.immunization_id = immunizationId;
							  		seedPhoenixFHIR.path.GET = {
											"ImmunizationVaccinationProtocol" : {
												"location": "%(apikey)s/ImmunizationVaccinationProtocol",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ImmunizationVaccinationProtocol', {"apikey": apikey}, {}, function(error, response, body){
											immunizationVaccinationProtocol = JSON.parse(body);
											if(immunizationVaccinationProtocol.err_code == 0){
												res.json({"err_code": 0, "data":immunizationVaccinationProtocol.data});	
											}else{
												res.json(immunizationVaccinationProtocol);
											}
										})
									}
								}else{
									res.json({"err_code": 501, "err_msg": "Immunization Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
	},
	post: {
		immunization : function addImmunization(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");

      var err_code = 0;
      var err_msg = "";
			
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

/*status|status||nn|
notGiven|notGiven||nn|
vaccineCode|vaccineCode||nn|
patient|patient|||
encounter|encounter|||
date|date|date||
primarySource|primarySource|boolean|nn|
reportOrigin|reportOrigin|||
location|location|||
manufacturer|manufacturer|||
lotNumber|lotNumber|||
expirationDate|expirationDate|date||
site|site|||u
route|route|||u
doseQuantity|doseQuantity|||
practitioner.role|practitionerRole|||u
practitioner.actor|practitionerActor|||
note.author.authorReference.practitioner|noteAuthorPractitioner|||
note.author.authorReference.patient|noteAuthorPatient|||
note.author.authorReference.relatedPerson|noteAuthorRelatedPerson|||
note.author.authorString|noteAuthorAuthorString|||
note.time|noteTime|date||
note.text|noteText|||
explanation.reason|explanationReason|||
explanation.reasonNotGiven|explanationReasonNotGiven|||u
reaction.date|reactionDate|date||
reaction.detail|reactionDetail||||
reaction.reported|reactionReported|boolean||
vaccinationProtocol.doseSequence|vaccinationProtocolDoseSequence|integer||
vaccinationProtocol.description|vaccinationProtocolDescription|||
vaccinationProtocol.authority|vaccinationProtocolAuthority|||
vaccinationProtocol.series|vaccinationProtocolSeries|||
vaccinationProtocol.seriesDose|vaccinationProtocolSeriesDoses|integer||
vaccinationProtocol.targetDisease|vaccinationProtocolTargetDisease|||
vaccinationProtocol.doseStatus|vaccinationProtocolDoseStatus|||
vaccinationProtocol.doseStatusReason|vaccinationProtocolDoseStatusReason||*/
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Immunization status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Immunization request.";
			}

			if(typeof req.body.notGiven !== 'undefined'){
				var notGiven =  req.body.notGiven.trim().toLowerCase();
				if(validator.isEmpty(notGiven)){
					err_code = 2;
					err_msg = "Immunization not given is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'not given' in json Immunization request.";
			}

			if(typeof req.body.vaccineCode !== 'undefined'){
				var vaccineCode =  req.body.vaccineCode.trim().toLowerCase();
				if(validator.isEmpty(vaccineCode)){
					err_code = 2;
					err_msg = "Immunization vaccine code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccine code' in json Immunization request.";
			}

			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					patient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Immunization request.";
			}

			if(typeof req.body.encounter !== 'undefined'){
				var encounter =  req.body.encounter.trim().toLowerCase();
				if(validator.isEmpty(encounter)){
					encounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'encounter' in json Immunization request.";
			}

			if(typeof req.body.date !== 'undefined'){
				var date =  req.body.date;
				if(validator.isEmpty(date)){
					date = "";
				}else{
					if(!regex.test(date)){
						err_code = 2;
						err_msg = "Immunization date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'date' in json Immunization request.";
			}

			if (typeof req.body.primarySource !== 'undefined') {
				var primarySource = req.body.primarySource.trim().toLowerCase();
				if(primarySource === "true" || primarySource === "false"){
					primarySource = primarySource;
				} else {
					err_code = 2;
					err_msg = "Immunization primary source is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'primary source' in json Immunization request.";
			}

			if(typeof req.body.reportOrigin !== 'undefined'){
				var reportOrigin =  req.body.reportOrigin.trim().toLowerCase();
				if(validator.isEmpty(reportOrigin)){
					reportOrigin = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'report origin' in json Immunization request.";
			}

			if(typeof req.body.location !== 'undefined'){
				var location =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(location)){
					location = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'location' in json Immunization request.";
			}

			if(typeof req.body.manufacturer !== 'undefined'){
				var manufacturer =  req.body.manufacturer.trim().toLowerCase();
				if(validator.isEmpty(manufacturer)){
					manufacturer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'manufacturer' in json Immunization request.";
			}

			if(typeof req.body.lotNumber !== 'undefined'){
				var lotNumber =  req.body.lotNumber.trim().toLowerCase();
				if(validator.isEmpty(lotNumber)){
					lotNumber = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'lot number' in json Immunization request.";
			}

			if(typeof req.body.expirationDate !== 'undefined'){
				var expirationDate =  req.body.expirationDate;
				if(validator.isEmpty(expirationDate)){
					expirationDate = "";
				}else{
					if(!regex.test(expirationDate)){
						err_code = 2;
						err_msg = "Immunization expiration date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'expiration date' in json Immunization request.";
			}

			if(typeof req.body.site !== 'undefined'){
				var site =  req.body.site.trim().toUpperCase();
				if(validator.isEmpty(site)){
					site = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'site' in json Immunization request.";
			}

			if(typeof req.body.route !== 'undefined'){
				var route =  req.body.route.trim().toUpperCase();
				if(validator.isEmpty(route)){
					route = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'route' in json Immunization request.";
			}

			if(typeof req.body.doseQuantity !== 'undefined'){
				var doseQuantity =  req.body.doseQuantity.trim().toLowerCase();
				if(validator.isEmpty(doseQuantity)){
					doseQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose quantity' in json Immunization request.";
			}

			if(typeof req.body.practitioner.role !== 'undefined'){
				var practitionerRole =  req.body.practitioner.role.trim().toUpperCase();
				if(validator.isEmpty(practitionerRole)){
					practitionerRole = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'practitioner role' in json Immunization request.";
			}

			if(typeof req.body.practitioner.actor !== 'undefined'){
				var practitionerActor =  req.body.practitioner.actor.trim().toLowerCase();
				if(validator.isEmpty(practitionerActor)){
					practitionerActor = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'practitioner actor' in json Immunization request.";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					noteAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Immunization request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					noteAuthorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Immunization request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					noteAuthorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Immunization request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Immunization request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Immunization note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Immunization request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note text' in json Immunization request.";
			}

			if(typeof req.body.explanation.reason !== 'undefined'){
				var explanationReason =  req.body.explanation.reason.trim().toLowerCase();
				if(validator.isEmpty(explanationReason)){
					explanationReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'explanation reason' in json Immunization request.";
			}

			if(typeof req.body.explanation.reasonNotGiven !== 'undefined'){
				var explanationReasonNotGiven =  req.body.explanation.reasonNotGiven.trim().toUpperCase();
				if(validator.isEmpty(explanationReasonNotGiven)){
					explanationReasonNotGiven = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'explanation reason not given' in json Immunization request.";
			}

			if(typeof req.body.reaction.date !== 'undefined'){
				var reactionDate =  req.body.reaction.date;
				if(validator.isEmpty(reactionDate)){
					reactionDate = "";
				}else{
					if(!regex.test(reactionDate)){
						err_code = 2;
						err_msg = "Immunization reaction date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction date' in json Immunization request.";
			}

			if(typeof req.body.reaction.detail !== 'undefined'){
				var reactionDetail =  req.body.reaction.detail.trim().toLowerCase();
				if(validator.isEmpty(reactionDetail)){
					reactionDetail = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction detail' in json Immunization request.";
			}

			if (typeof req.body.reaction.reported !== 'undefined') {
				var reactionReported = req.body.reaction.reported.trim().toLowerCase();
					if(validator.isEmpty(reactionReported)){
						reactionReported = "false";
					}
				if(reactionReported === "true" || reactionReported === "false"){
					reactionReported = reactionReported;
				} else {
					err_code = 2;
					err_msg = "Immunization reaction reported is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'reaction reported' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.doseSequence !== 'undefined'){
				var vaccinationProtocolDoseSequence =  req.body.vaccinationProtocol.doseSequence;
				if(validator.isEmpty(vaccinationProtocolDoseSequence)){
					vaccinationProtocolDoseSequence = "";
				}else{
					if(!validator.isInt(vaccinationProtocolDoseSequence)){
						err_code = 2;
						err_msg = "Immunization vaccination protocol dose sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol dose sequence' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.description !== 'undefined'){
				var vaccinationProtocolDescription =  req.body.vaccinationProtocol.description.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDescription)){
					vaccinationProtocolDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol description' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.authority !== 'undefined'){
				var vaccinationProtocolAuthority =  req.body.vaccinationProtocol.authority.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolAuthority)){
					vaccinationProtocolAuthority = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol authority' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.series !== 'undefined'){
				var vaccinationProtocolSeries =  req.body.vaccinationProtocol.series.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolSeries)){
					vaccinationProtocolSeries = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol series' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.seriesDose !== 'undefined'){
				var vaccinationProtocolSeriesDoses =  req.body.vaccinationProtocol.seriesDose.trim();
				if(validator.isEmpty(vaccinationProtocolSeriesDoses)){
					vaccinationProtocolSeriesDoses = "";
				}else{
					if(!validator.isInt(vaccinationProtocolSeriesDoses)){
						err_code = 2;
						err_msg = "Immunization vaccination protocol series dose is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol series dose' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.targetDisease !== 'undefined'){
				var vaccinationProtocolTargetDisease =  req.body.vaccinationProtocol.targetDisease.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolTargetDisease)){
					vaccinationProtocolTargetDisease = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol target disease' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.doseStatus !== 'undefined'){
				var vaccinationProtocolDoseStatus =  req.body.vaccinationProtocol.doseStatus.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDoseStatus)){
					vaccinationProtocolDoseStatus = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol dose status' in json Immunization request.";
			}

			if(typeof req.body.vaccinationProtocol.doseStatusReason !== 'undefined'){
				var vaccinationProtocolDoseStatusReason =  req.body.vaccinationProtocol.doseStatusReason.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDoseStatusReason)){
					vaccinationProtocolDoseStatusReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol dose status reason' in json Immunization request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
							if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
									if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid	

										//event emiter
										myEmitter.prependOnceListener('checkIdentifierValue', function() {

												checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
													if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada
														//proses insert
														//set uniqe id
														var unicId = uniqid.time();
														var identifierId = 'ide' + unicId;
														var immunizationId = 'imm' + unicId;
														var immunizationPractitionerId = 'imp' + unicId;
														var immunizationReactionId = 'imr' + unicId;
														var immunizationVaccinationProtocolId = 'ivp' + unicId;
														var noteId = 'ann' + unicId;

														dataImmunization = {
															"immunization_id" : immunizationId,
															"status" : status,
															"not_given" : notGiven,
															"veccine_code" : vaccineCode,
															"patient" : patient,
															"encounter" : encounter,
															"date" : date,
															"primary_source" : primarySource,
															"report_origin" : reportOrigin,
															"location" : location,
															"manufacturer" : manufacturer,
															"lot_number" : lotNumber,
															"expiration_date" : expirationDate,
															"site" : site,
															"route" : route,
															"dose_quantity" : doseQuantity,
															"explanation_reason" : explanationReason,
															"explanation_reason_not_given" : explanationReasonNotGiven
														}
														console.log(dataImmunization);
														ApiFHIR.post('immunization', {"apikey": apikey}, {body: dataImmunization, json: true}, function(error, response, body){
															immunization = body;
															if(immunization.err_code > 0){
																res.json(immunization);	
																console.log("ok");
															}
														});

														//identifier
														var identifierSystem = identifierId;
														dataIdentifier = {
																							"id": identifierId,
																							"use": identifierUseCode,
																							"type": identifierTypeCode,
																							"system": identifierSystem,
																							"value": identifierValue,
																							"period_start": identifierPeriodStart,
																							"period_end": identifierPeriodEnd,
																							"immunization_id": immunizationId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														//ImmunizationPractitioner
														dataImmunizationPractitioner = {
															"practitioner_id" : immunizationPractitionerId,
															"role" : practitionerRole,
															"actor" : practitionerActor,
															"immunization_id" : immunizationId

														}
														ApiFHIR.post('immunizationPractitioner', {"apikey": apikey}, {body: dataImmunizationPractitioner, json: true}, function(error, response, body){
														immunizationPractitioner = body;
														if(immunizationPractitioner.err_code > 0){
															res.json(immunizationPractitioner);	
															console.log("ok");
														}
													});
														
														
														//ImmunizationReaction
														dataImmunizationReaction = {
															"reaction_id" : immunizationReactionId,
															"date" : reactionDate,
															"detail" : reactionDetail,
															"reported" : reactionReported,
															"immunization_id" : immunizationId

														}
														ApiFHIR.post('immunizationReaction', {"apikey": apikey}, {body: dataImmunizationReaction, json: true}, function(error, response, body){
														immunizationReaction = body;
														if(immunizationReaction.err_code > 0){
															res.json(immunizationReaction);	
															console.log("ok");
														}
													});
													
														//ImmunizationVaccinationProtocol
														dataImmunizationVaccinationProtocol = {
															"vaccination_protocol_id" : immunizationVaccinationProtocolId,
															"dose_sequence" : vaccinationProtocolDoseSequence,
															"description" : vaccinationProtocolDescription,
															"authority" : vaccinationProtocolAuthority,
															"series" : vaccinationProtocolSeries,
															"series_doses" : vaccinationProtocolSeriesDoses,
															"target_disease" : vaccinationProtocolTargetDisease,
															"dose_status" : vaccinationProtocolDoseStatus,
															"dose_status_reason" : vaccinationProtocolDoseStatusReason,
															"immunization_id" : immunizationId

														}
														ApiFHIR.post('immunizationVaccinationProtocol', {"apikey": apikey}, {body: dataImmunizationVaccinationProtocol, json: true}, function(error, response, body){
															immunizationVaccinationProtocol = body;
															if(immunizationVaccinationProtocol.err_code > 0){
																res.json(immunizationVaccinationProtocol);	
																console.log("ok");
															}
														});
															
														dataNote = {
															"id" : noteId,
															"author_ref_practitioner" : noteAuthorPractitioner,
															"author_ref_patient" : noteAuthorPatient,
															"author_ref_relatedPerson" : noteAuthorRelatedPerson,
															"author_string" : noteAuthorAuthorString,
															"time" : noteTime,
															"text" : noteText,
															"immunization_id" : immunizationId
														}
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataNote, json: true}, function(error, response, body){
															immunizationReaction = body;
															if(immunizationReaction.err_code > 0){
																res.json(immunizationReaction);	
																console.log("ok");
															}
														});
														res.json({"err_code": 0, "err_msg": "Immunization has been add.", "data": [{"_id": immunizationId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
										status|immunization_status
										vaccineCode|vaccine_code
										reportOrigin|immunization_origin
										site|immunization_site
										route|immunization_route
										practitionerRole|immunization_role
										explanationReason|immunization_reason
										explanationReasonNotGiven|no_immunization_reason
										vaccinationProtocolTargetDisease|vaccination_protocol_dose_target
										vaccinationProtocolDoseStatus|vaccination_protocol_dose_status
										vaccinationProtocolDoseStatusReason|vaccination_protocol_dose_status_reason
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'IMMUNIZATION_STATUS', function (resStatusCode) {
													if (resStatusCode.err_code > 0) {
														myEmitter.emit('checkIdentifierValue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Status code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIdentifierValue');
											}
										})

										myEmitter.prependOnceListener('checkVaccineCode', function () {
											if (!validator.isEmpty(vaccineCode)) {
												checkCode(apikey, vaccineCode, 'VACCINE_CODE', function (resVaccineCodeCode) {
													if (resVaccineCodeCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Vaccine code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})

										myEmitter.prependOnceListener('checkReportOrigin', function () {
											if (!validator.isEmpty(reportOrigin)) {
												checkCode(apikey, reportOrigin, 'IMMUNIZATION_ORIGIN', function (resReportOriginCode) {
													if (resReportOriginCode.err_code > 0) {
														myEmitter.emit('checkVaccineCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Report origin code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkVaccineCode');
											}
										})

										myEmitter.prependOnceListener('checkSite', function () {
											if (!validator.isEmpty(site)) {
												checkCode(apikey, site, 'IMMUNIZATION_SITE', function (resSiteCode) {
													if (resSiteCode.err_code > 0) {
														myEmitter.emit('checkReportOrigin');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Site code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReportOrigin');
											}
										})

										myEmitter.prependOnceListener('checkRoute', function () {
											if (!validator.isEmpty(route)) {
												checkCode(apikey, route, 'IMMUNIZATION_ROUTE', function (resRouteCode) {
													if (resRouteCode.err_code > 0) {
														myEmitter.emit('checkSite');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Route code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSite');
											}
										})

										myEmitter.prependOnceListener('checkPractitionerRole', function () {
											if (!validator.isEmpty(practitionerRole)) {
												checkCode(apikey, practitionerRole, 'IMMUNIZATION_ROLE', function (resPractitionerRoleCode) {
													if (resPractitionerRoleCode.err_code > 0) {
														myEmitter.emit('checkRoute');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Practitioner role code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRoute');
											}
										})

										myEmitter.prependOnceListener('checkExplanationReason', function () {
											if (!validator.isEmpty(explanationReason)) {
												checkCode(apikey, explanationReason, 'IMMUNIZATION_REASON', function (resExplanationReasonCode) {
													if (resExplanationReasonCode.err_code > 0) {
														myEmitter.emit('checkPractitionerRole');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Explanation reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPractitionerRole');
											}
										})

										myEmitter.prependOnceListener('checkExplanationReasonNotGiven', function () {
											if (!validator.isEmpty(explanationReasonNotGiven)) {
												checkCode(apikey, explanationReasonNotGiven, 'NO_IMMUNIZATION_REASON', function (resExplanationReasonNotGivenCode) {
													if (resExplanationReasonNotGivenCode.err_code > 0) {
														myEmitter.emit('checkExplanationReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Explanation reason not given code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkExplanationReason');
											}
										})

										myEmitter.prependOnceListener('checkTargetDisease', function () {
											if (!validator.isEmpty(vaccinationProtocolTargetDisease)) {
												checkCode(apikey, vaccinationProtocolTargetDisease, 'VACCINATION_PROTOCOL_DOSE_TARGET', function (resTargetDiseaseCode) {
													if (resTargetDiseaseCode.err_code > 0) {
														myEmitter.emit('checkExplanationReasonNotGiven');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Target disease code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkExplanationReasonNotGiven');
											}
										})

										myEmitter.prependOnceListener('checkDoseStatus', function () {
											if (!validator.isEmpty(vaccinationProtocolDoseStatus)) {
												checkCode(apikey, vaccinationProtocolDoseStatus, 'VACCINATION_PROTOCOL_DOSE_STATUS', function (resDoseStatusCode) {
													if (resDoseStatusCode.err_code > 0) {
														myEmitter.emit('checkTargetDisease');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Dose status code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkTargetDisease');
											}
										})

										myEmitter.prependOnceListener('checkDoseStatusReason', function () {
											if (!validator.isEmpty(vaccinationProtocolDoseStatusReason)) {
												checkCode(apikey, vaccinationProtocolDoseStatusReason, 'VACCINATION_PROTOCOL_DOSE_STATUS_REASON', function (resDoseStatusReasonCode) {
													if (resDoseStatusReasonCode.err_code > 0) {
														myEmitter.emit('checkDoseStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Dose status reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDoseStatus');
											}
										})

										//cek value
										/*
										patient|Patient
										encounter|Encounter
										location|location
										manufacturer|Organization
										practitionerActor|Practtioner
										reactionDetail|Observation
										vaccinationProtocolAuthority|Organization
										*/

										myEmitter.prependOnceListener('checkPatient', function () {
											if (!validator.isEmpty(patient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
													if (resPatient.err_code > 0) {
														myEmitter.emit('checkDoseStatusReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDoseStatusReason');
											}
										})

										myEmitter.prependOnceListener('checkEncounter', function () {
											if (!validator.isEmpty(encounter)) {
												checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounter, 'ENCOUNTER', function (resEncounter) {
													if (resEncounter.err_code > 0) {
														myEmitter.emit('checkPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Encounter id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPatient');
											}
										})

										myEmitter.prependOnceListener('checkLocation', function () {
											if (!validator.isEmpty(location)) {
												checkUniqeValue(apikey, "LOCATION_ID|" + location, 'LOCATION', function (resLocation) {
													if (resLocation.err_code > 0) {
														myEmitter.emit('checkEncounter');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Location id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkEncounter');
											}
										})

										myEmitter.prependOnceListener('checkManufacturer', function () {
											if (!validator.isEmpty(manufacturer)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + manufacturer, 'ORGANIZATION', function (resManufacturer) {
													if (resManufacturer.err_code > 0) {
														myEmitter.emit('checkLocation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Manufacturer id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkLocation');
											}
										})

										myEmitter.prependOnceListener('checkActor', function () {
											if (!validator.isEmpty(practitionerActor)) {
												checkUniqeValue(apikey, "PRACTTIONER_ID|" + practitionerActor, 'PRACTTIONER', function (resActor) {
													if (resActor.err_code > 0) {
														myEmitter.emit('checkManufacturer');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Actor id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkManufacturer');
											}
										})

										myEmitter.prependOnceListener('checkDetail', function () {
											if (!validator.isEmpty(reactionDetail)) {
												checkUniqeValue(apikey, "OBSERVATION_ID|" + reactionDetail, 'OBSERVATION', function (resDetail) {
													if (resDetail.err_code > 0) {
														myEmitter.emit('checkActor');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Detail id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActor');
											}
										})

										if (!validator.isEmpty(vaccinationProtocolAuthority)) {
											checkUniqeValue(apikey, "ORGANIZATION_ID|" + vaccinationProtocolAuthority, 'ORGANIZATION', function (resAuthority) {
												if (resAuthority.err_code > 0) {
													myEmitter.emit('checkDetail');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Authority id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkDetail');
										}

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
			var immunizationId = req.params.immunization_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof immunizationId !== 'undefined'){
				if(validator.isEmpty(immunizationId)){
					err_code = 2;
					err_msg = "Immunization id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization id is required";
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
												checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationID){
													if(resImmunizationID.err_code > 0){
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
																							"immunization_id": immunizationId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this immunization.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Immunization Id not found"});		
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
		immunizationPractitioner: function addImmunizationPractitioner(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var immunizationId = req.params.immunization_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof immunizationId !== 'undefined'){
				if(validator.isEmpty(immunizationId)){
					err_code = 2;
					err_msg = "Immunization id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization id is required";
			}

			//immunizationPractitioner
			if(typeof req.body.role !== 'undefined'){
				var practitionerRole =  req.body.role.trim().toUpperCase();
				if(validator.isEmpty(practitionerRole)){
					practitionerRole = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'practitioner role' in json Immunization request.";
			}

			if(typeof req.body.actor !== 'undefined'){
				var practitionerActor =  req.body.actor.trim().toLowerCase();
				if(validator.isEmpty(practitionerActor)){
					practitionerActor = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'practitioner actor' in json Immunization request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkImmunizationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									var unicId = uniqid.time();
									var immunizationPractitionerId = 'imp' + unicId;
									//ImmunizationPractitioner
									dataImmunizationPractitioner = {
										"practitioner_id" : immunizationPractitionerId,
										"role" : practitionerRole,
										"actor" : practitionerActor,
										"immunization_id" : immunizationId

									}
									ApiFHIR.post('immunizationPractitioner', {"apikey": apikey}, {body: dataImmunizationPractitioner, json: true}, function(error, response, body){
										immunizationPractitioner = body;
										if(immunizationPractitioner.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Immunization Practitioner has been add in this Immunization.", "data": immunizationPractitioner.data});
										} else {
											res.json(immunizationPractitioner);
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkActor', function () {
							if (!validator.isEmpty(practitionerActor)) {
								checkUniqeValue(apikey, "PRACTTIONER_ID|" + practitionerActor, 'PRACTTIONER', function (resActor) {
									if (resActor.err_code > 0) {
										myEmitter.emit('checkImmunizationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Actor id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkImmunizationID');
							}
						})
						
						if (!validator.isEmpty(practitionerRole)) {
							checkCode(apikey, practitionerRole, 'IMMUNIZATION_ROLE', function (resPractitionerRoleCode) {
								if (resPractitionerRoleCode.err_code > 0) {
									myEmitter.emit('checkActor');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Practitioner role code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkActor');
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
		immunizationReaction: function addImmunizationReaction(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var immunizationId = req.params.immunization_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof immunizationId !== 'undefined'){
				if(validator.isEmpty(immunizationId)){
					err_code = 2;
					err_msg = "Immunization id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization id is required";
			}

			if(typeof req.body.date !== 'undefined'){
				var reactionDate =  req.body.date;
				if(validator.isEmpty(reactionDate)){
					reactionDate = "";
				}else{
					if(!regex.test(reactionDate)){
						err_code = 2;
						err_msg = "Immunization reaction date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction date' in json Immunization request.";
			}

			if(typeof req.body.detail !== 'undefined'){
				var reactionDetail =  req.body.detail.trim().toLowerCase();
				if(validator.isEmpty(reactionDetail)){
					reactionDetail = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction detail' in json Immunization request.";
			}

			if (typeof req.body.reported !== 'undefined') {
				var reactionReported = req.body.reported.trim().toLowerCase();
					if(validator.isEmpty(reactionReported)){
						reactionReported = "false";
					}
				if(reactionReported === "true" || reactionReported === "false"){
					reactionReported = reactionReported;
				} else {
					err_code = 2;
					err_msg = "Immunization reaction reported is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'reaction reported' in json Immunization request.";
			}  

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkImmunizationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									var unicId = uniqid.time();
									var immunizationReactionId = 'imr' + unicId;
									//ImmunizationReaction
									dataImmunizationReaction = {
										"reaction_id" : immunizationReactionId,
										"date" : reactionDate,
										"detail" : reactionDetail,
										"reported" : reactionReported,
										"immunization_id" : immunizationId

									}
									ApiFHIR.post('immunizationReaction', {"apikey": apikey}, {body: dataImmunizationReaction, json: true}, function(error, response, body){
										immunizationReaction = body;
										if(immunizationReaction.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Immunization Reaction has been add in this Immunization.", "data": immunizationReaction.data});
										} else {
											res.json(immunizationReaction);
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Id not found"});		
								}
							})
						})

						if (!validator.isEmpty(reactionDetail)) {
							checkUniqeValue(apikey, "OBSERVATION_ID|" + reactionDetail, 'OBSERVATION', function (resDetail) {
								if (resDetail.err_code > 0) {
									myEmitter.emit('checkImmunizationID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Detail id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkImmunizationID');
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
		immunizationVaccinationProtocol: function addImmunizationVaccinationProtocol(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var immunizationId = req.params.immunization_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof immunizationId !== 'undefined'){
				if(validator.isEmpty(immunizationId)){
					err_code = 2;
					err_msg = "Immunization id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization id is required";
			}

			//immunizationVaccinationProtocol
			if(typeof req.body.doseSequence !== 'undefined'){
				var vaccinationProtocolDoseSequence =  req.body.doseSequence;
				if(validator.isEmpty(vaccinationProtocolDoseSequence)){
					vaccinationProtocolDoseSequence = "";
				}else{
					if(!validator.isInt(vaccinationProtocolDoseSequence)){
						err_code = 2;
						err_msg = "Immunization vaccination protocol dose sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol dose sequence' in json Immunization request.";
			}

			if(typeof req.body.description !== 'undefined'){
				var vaccinationProtocolDescription =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDescription)){
					vaccinationProtocolDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol description' in json Immunization request.";
			}

			if(typeof req.body.authority !== 'undefined'){
				var vaccinationProtocolAuthority =  req.body.authority.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolAuthority)){
					vaccinationProtocolAuthority = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol authority' in json Immunization request.";
			}

			if(typeof req.body.series !== 'undefined'){
				var vaccinationProtocolSeries =  req.body.series.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolSeries)){
					vaccinationProtocolSeries = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol series' in json Immunization request.";
			}

			if(typeof req.body.seriesDose !== 'undefined'){
				var vaccinationProtocolSeriesDoses =  req.body.seriesDose.trim();
				if(validator.isEmpty(vaccinationProtocolSeriesDoses)){
					vaccinationProtocolSeriesDoses = "";
				}else{
					if(!validator.isInt(vaccinationProtocolSeriesDoses)){
						err_code = 2;
						err_msg = "Immunization vaccination protocol series dose is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol series dose' in json Immunization request.";
			}

			if(typeof req.body.targetDisease !== 'undefined'){
				var vaccinationProtocolTargetDisease =  req.body.targetDisease.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolTargetDisease)){
					vaccinationProtocolTargetDisease = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol target disease' in json Immunization request.";
			}

			if(typeof req.body.doseStatus !== 'undefined'){
				var vaccinationProtocolDoseStatus =  req.body.doseStatus.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDoseStatus)){
					vaccinationProtocolDoseStatus = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol dose status' in json Immunization request.";
			}

			if(typeof req.body.doseStatusReason !== 'undefined'){
				var vaccinationProtocolDoseStatusReason =  req.body.doseStatusReason.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDoseStatusReason)){
					vaccinationProtocolDoseStatusReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccination protocol dose status reason' in json Immunization request.";
			} 

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkImmunizationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									var unicId = uniqid.time();
									var immunizationVaccinationProtocolId = 'ivp' + unicId;
									dataImmunizationVaccinationProtocol = {
										"vaccination_protocol_id" : immunizationVaccinationProtocolId,
										"dose_sequence" : vaccinationProtocolDoseSequence,
										"description" : vaccinationProtocolDescription,
										"authority" : vaccinationProtocolAuthority,
										"series" : vaccinationProtocolSeries,
										"series_doses" : vaccinationProtocolSeriesDoses,
										"target_disease" : vaccinationProtocolTargetDisease,
										"dose_status" : vaccinationProtocolDoseStatus,
										"dose_status_reason" : vaccinationProtocolDoseStatusReason,
										"immunization_id" : immunizationId

									}
									ApiFHIR.post('immunizationVaccinationProtocol', {"apikey": apikey}, {body: dataImmunizationVaccinationProtocol, json: true}, function(error, response, body){
										immunizationVaccinationProtocol = body;
										if(immunizationVaccinationProtocol.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Immunization Vaccination Protocol has been add in this Immunization.", "data": immunizationVaccinationProtocol.data});
										} else {
											res.json(immunizationVaccinationProtocol);
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkTargetDisease', function () {
							if (!validator.isEmpty(vaccinationProtocolTargetDisease)) {
								checkCode(apikey, vaccinationProtocolTargetDisease, 'VACCINATION_PROTOCOL_DOSE_TARGET', function (resTargetDiseaseCode) {
									if (resTargetDiseaseCode.err_code > 0) {
										myEmitter.emit('checkImmunizationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Target disease code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkImmunizationID');
							}
						})

						myEmitter.prependOnceListener('checkDoseStatus', function () {
							if (!validator.isEmpty(vaccinationProtocolDoseStatus)) {
								checkCode(apikey, vaccinationProtocolDoseStatus, 'VACCINATION_PROTOCOL_DOSE_STATUS', function (resDoseStatusCode) {
									if (resDoseStatusCode.err_code > 0) {
										myEmitter.emit('checkTargetDisease');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Dose status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkTargetDisease');
							}
						})

						myEmitter.prependOnceListener('checkDoseStatusReason', function () {
							if (!validator.isEmpty(vaccinationProtocolDoseStatusReason)) {
								checkCode(apikey, vaccinationProtocolDoseStatusReason, 'VACCINATION_PROTOCOL_DOSE_STATUS_REASON', function (resDoseStatusReasonCode) {
									if (resDoseStatusReasonCode.err_code > 0) {
										myEmitter.emit('checkDoseStatus');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Dose status reason code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkDoseStatus');
							}
						})

						if (!validator.isEmpty(vaccinationProtocolAuthority)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + vaccinationProtocolAuthority, 'ORGANIZATION', function (resAuthority) {
								if (resAuthority.err_code > 0) {
									myEmitter.emit('checkDoseStatusReason');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Authority id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkDoseStatusReason');
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
	},
	put: {
		immunization : function putImmunization(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var immunizationId = req.params.adverse_event_id;

      var err_code = 0;
      var err_msg = "";
      var dataImmunization = {};

			if(typeof immunizationId !== 'undefined'){
				if(validator.isEmpty(immunizationId)){
					err_code = 2;
					err_msg = "immunization id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization id is required";
			}
			
			/*var status = req.body.status;
			var not_given = req.body.not_given;
			var veccine_code = req.body.veccine_code;
			var patient = req.body.patient;
			var encounter = req.body.encounter;
			var date = req.body.date;
			var primary_source = req.body.primary_source;
			var report_origin = req.body.report_origin;
			var location = req.body.location;
			var manufacturer = req.body.manufacturer;
			var iot_number = req.body.lot_number;
			var expiration_date = req.body.expiration_date;
			var site = req.body.site;
			var route = req.body.route;
			var dose_quantity = req.body.dose_quantity;
			var explanation_reason = req.body.explanation_reason;
			var explanation_reason_not_given = req.body.explanation_reason_not_given;*/

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "immunization status is required.";
				}else{
					dataImmunization.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.notGiven !== 'undefined' && req.body.notGiven !== ""){
				var notGiven =  req.body.notGiven.trim().toLowerCase();
				if(validator.isEmpty(notGiven)){
					err_code = 2;
					err_msg = "immunization not given is required.";
				}else{
					dataImmunization.not_given = notGiven;
				}
			}else{
			  notGiven = "";
			}

			if(typeof req.body.vaccineCode !== 'undefined' && req.body.vaccineCode !== ""){
				var vaccineCode =  req.body.vaccineCode.trim().toLowerCase();
				if(validator.isEmpty(vaccineCode)){
					err_code = 2;
					err_msg = "immunization vaccine code is required.";
				}else{
					dataImmunization.veccine_code = vaccineCode;
				}
			}else{
			  vaccineCode = "";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					dataImmunization.patient = "";
				}else{
					dataImmunization.patient = patient;
				}
			}else{
			  patient = "";
			}

			if(typeof req.body.encounter !== 'undefined' && req.body.encounter !== ""){
				var encounter =  req.body.encounter.trim().toLowerCase();
				if(validator.isEmpty(encounter)){
					dataImmunization.encounter = "";
				}else{
					dataImmunization.encounter = encounter;
				}
			}else{
			  encounter = "";
			}

			if(typeof req.body.date !== 'undefined' && req.body.date !== ""){
				var date =  req.body.date;
				if(validator.isEmpty(date)){
					err_code = 2;
					err_msg = "immunization date is required.";
				}else{
					if(!regex.test(date)){
						err_code = 2;
						err_msg = "immunization date invalid date format.";	
					}else{
						dataImmunization.date = date;
					}
				}
			}else{
			  date = "";
			}

			if (typeof req.body.primarySource !== 'undefined' && req.body.primarySource !== "") {
			  var primarySource = req.body.primarySource.trim().toLowerCase();
			  if(primarySource === "true" || primarySource === "false"){
					dataImmunization.primary_source = primarySource;
			  } else {
			    err_code = 2;
			    err_msg = "Immunization primary source is must be boolean.";
			  }
			} else {
			  primarySource = "";
			}

			if(typeof req.body.reportOrigin !== 'undefined' && req.body.reportOrigin !== ""){
				var reportOrigin =  req.body.reportOrigin.trim().toLowerCase();
				if(validator.isEmpty(reportOrigin)){
					dataImmunization.report_origin = "";
				}else{
					dataImmunization.report_origin = reportOrigin;
				}
			}else{
			  reportOrigin = "";
			}

			if(typeof req.body.location !== 'undefined' && req.body.location !== ""){
				var location =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(location)){
					dataImmunization.location = "";
				}else{
					dataImmunization.location = location;
				}
			}else{
			  location = "";
			}

			if(typeof req.body.manufacturer !== 'undefined' && req.body.manufacturer !== ""){
				var manufacturer =  req.body.manufacturer.trim().toLowerCase();
				if(validator.isEmpty(manufacturer)){
					dataImmunization.manufacturer = "";
				}else{
					dataImmunization.manufacturer = manufacturer;
				}
			}else{
			  manufacturer = "";
			}

			if(typeof req.body.lotNumber !== 'undefined' && req.body.lotNumber !== ""){
				var lotNumber =  req.body.lotNumber.trim().toLowerCase();
				if(validator.isEmpty(lotNumber)){
					dataImmunization.lot_number = "";
				}else{
					dataImmunization.lot_number = lotNumber;
				}
			}else{
			  lotNumber = "";
			}

			if(typeof req.body.expirationDate !== 'undefined' && req.body.expirationDate !== ""){
				var expirationDate =  req.body.expirationDate;
				if(validator.isEmpty(expirationDate)){
					err_code = 2;
					err_msg = "immunization expiration date is required.";
				}else{
					if(!regex.test(expirationDate)){
						err_code = 2;
						err_msg = "immunization expiration date invalid date format.";	
					}else{
						dataImmunization.expiration_date = expirationDate;
					}
				}
			}else{
			  expirationDate = "";
			}

			if(typeof req.body.site !== 'undefined' && req.body.site !== ""){
				var site =  req.body.site.trim().toLowerCase();
				if(validator.isEmpty(site)){
					dataImmunization.site = "";
				}else{
					dataImmunization.site = site;
				}
			}else{
			  site = "";
			}

			if(typeof req.body.route !== 'undefined' && req.body.route !== ""){
				var route =  req.body.route.trim().toLowerCase();
				if(validator.isEmpty(route)){
					dataImmunization.route = "";
				}else{
					dataImmunization.route = route;
				}
			}else{
			  route = "";
			}

			if(typeof req.body.doseQuantity !== 'undefined' && req.body.doseQuantity !== ""){
				var doseQuantity =  req.body.doseQuantity.trim().toLowerCase();
				if(validator.isEmpty(doseQuantity)){
					dataImmunization.dose_quantity = "";
				}else{
					dataImmunization.dose_quantity = doseQuantity;
				}
			}else{
			  doseQuantity = "";
			}

			/*if(typeof req.body.note.author.authorReference.practitioner !== 'undefined' && req.body.note.author.authorReference.practitioner !== ""){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					dataImmunization.practitioner = "";
				}else{
					dataImmunization.practitioner = noteAuthorPractitioner;
				}
			}else{
			  noteAuthorPractitioner = "";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined' && req.body.note.author.authorReference.patient !== ""){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					dataImmunization.patient = "";
				}else{
					dataImmunization.patient = noteAuthorPatient;
				}
			}else{
			  noteAuthorPatient = "";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined' && req.body.note.author.authorReference.relatedPerson !== ""){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					dataImmunization.related_person = "";
				}else{
					dataImmunization.related_person = noteAuthorRelatedPerson;
				}
			}else{
			  noteAuthorRelatedPerson = "";
			}

			if(typeof req.body.note.author.authorString !== 'undefined' && req.body.note.author.authorString !== ""){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					dataImmunization.author_string = "";
				}else{
					dataImmunization.author_string = noteAuthorAuthorString;
				}
			}else{
			  noteAuthorAuthorString = "";
			}

			if(typeof req.body.note.time !== 'undefined' && req.body.note.time !== ""){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					err_code = 2;
					err_msg = "immunization note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "immunization note time invalid date format.";	
					}else{
						dataImmunization.time = noteTime;
					}
				}
			}else{
			  noteTime = "";
			}

			if(typeof req.body.note.text !== 'undefined' && req.body.note.text !== ""){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					dataImmunization.text = "";
				}else{
					dataImmunization.text = noteText;
				}
			}else{
			  noteText = "";
			}*/

			if(typeof req.body.explanation.reason !== 'undefined' && req.body.explanation.reason !== ""){
				var explanationReason =  req.body.explanation.reason.trim().toLowerCase();
				if(validator.isEmpty(explanationReason)){
					dataImmunization.explanation_reason = "";
				}else{
					dataImmunization.explanation_reason = explanationReason;
				}
			}else{
			  explanationReason = "";
			}

			if(typeof req.body.explanation.reasonNotGiven !== 'undefined' && req.body.explanation.reasonNotGiven !== ""){
				var explanationReasonNotGiven =  req.body.explanation.reasonNotGiven.trim().toLowerCase();
				if(validator.isEmpty(explanationReasonNotGiven)){
					dataImmunization.explanation_reason_not_given = "";
				}else{
					dataImmunization.explanation_reason_not_given = explanationReasonNotGiven;
				}
			}else{
			  explanationReasonNotGiven = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						myEmitter.prependOnceListener('checkImmunizationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									//console.log(dataImmunization);
										ApiFHIR.put('immunization', {"apikey": apikey, "_id": immunizationId}, {body: dataImmunization, json: true}, function(error, response, body){
											immunization = body;
											if(immunization.err_code > 0){
												res.json(immunization);	
											}else{
												res.json({"err_code": 0, "err_msg": "Immunization has been update.", "data": [{"_id": immunizationId}]});
											}
										})
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkStatus', function () {
							if (!validator.isEmpty(status)) {
								checkCode(apikey, status, 'IMMUNIZATION_STATUS', function (resStatusCode) {
									if (resStatusCode.err_code > 0) {
										myEmitter.emit('checkImmunizationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkImmunizationID');
							}
						})

						myEmitter.prependOnceListener('checkVaccineCode', function () {
							if (!validator.isEmpty(vaccineCode)) {
								checkCode(apikey, vaccineCode, 'VACCINE_CODE', function (resVaccineCodeCode) {
									if (resVaccineCodeCode.err_code > 0) {
										myEmitter.emit('checkStatus');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Vaccine code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkStatus');
							}
						})

						myEmitter.prependOnceListener('checkReportOrigin', function () {
							if (!validator.isEmpty(reportOrigin)) {
								checkCode(apikey, reportOrigin, 'IMMUNIZATION_ORIGIN', function (resReportOriginCode) {
									if (resReportOriginCode.err_code > 0) {
										myEmitter.emit('checkVaccineCode');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Report origin code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkVaccineCode');
							}
						})

						myEmitter.prependOnceListener('checkSite', function () {
							if (!validator.isEmpty(site)) {
								checkCode(apikey, site, 'IMMUNIZATION_SITE', function (resSiteCode) {
									if (resSiteCode.err_code > 0) {
										myEmitter.emit('checkReportOrigin');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Site code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReportOrigin');
							}
						})

						myEmitter.prependOnceListener('checkRoute', function () {
							if (!validator.isEmpty(route)) {
								checkCode(apikey, route, 'IMMUNIZATION_ROUTE', function (resRouteCode) {
									if (resRouteCode.err_code > 0) {
										myEmitter.emit('checkSite');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Route code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSite');
							}
						})

						myEmitter.prependOnceListener('checkExplanationReason', function () {
							if (!validator.isEmpty(explanationReason)) {
								checkCode(apikey, explanationReason, 'IMMUNIZATION_REASON', function (resExplanationReasonCode) {
									if (resExplanationReasonCode.err_code > 0) {
										myEmitter.emit('checkRoute');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Explanation reason code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRoute');
							}
						})

						myEmitter.prependOnceListener('checkExplanationReasonNotGiven', function () {
							if (!validator.isEmpty(explanationReasonNotGiven)) {
								checkCode(apikey, explanationReasonNotGiven, 'NO_IMMUNIZATION_REASON', function (resExplanationReasonNotGivenCode) {
									if (resExplanationReasonNotGivenCode.err_code > 0) {
										myEmitter.emit('checkExplanationReason');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Explanation reason not given code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationReason');
							}
						})

						myEmitter.prependOnceListener('checkPatient', function () {
							if (!validator.isEmpty(patient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
									if (resPatient.err_code > 0) {
										myEmitter.emit('checkExplanationReasonNotGiven');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationReasonNotGiven');
							}
						})

						myEmitter.prependOnceListener('checkEncounter', function () {
							if (!validator.isEmpty(encounter)) {
								checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounter, 'ENCOUNTER', function (resEncounter) {
									if (resEncounter.err_code > 0) {
										myEmitter.emit('checkPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Encounter id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPatient');
							}
						})

						myEmitter.prependOnceListener('checkLocation', function () {
							if (!validator.isEmpty(location)) {
								checkUniqeValue(apikey, "LOCATION_ID|" + location, 'LOCATION', function (resLocation) {
									if (resLocation.err_code > 0) {
										myEmitter.emit('checkEncounter');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Location id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkEncounter');
							}
						})

						if (!validator.isEmpty(manufacturer)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + manufacturer, 'ORGANIZATION', function (resManufacturer) {
								if (resManufacturer.err_code > 0) {
									myEmitter.emit('checkLocation');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Manufacturer id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkLocation');
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
			var immunizationId = req.params.immunization_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof immunizationId !== 'undefined'){
				if(validator.isEmpty(immunizationId)){
					err_code = 2;
					err_msg = "Immunization id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization id is required";
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
						myEmitter.prependOnceListener('checkImmunizationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "IMMUNIZATION_ID|"+immunizationId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this immunization.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkImmunizationID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkImmunizationID');				
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
		immunizationPractitioner: function updateImmunizationPractitioner(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var immunizationId = req.params.immunization_id;
			var immunizationPractitionerId = req.params.immunization_practitioner_id;

			var err_code = 0;
			var err_msg = "";
			var dataImmunizationPractitioner = {};
			//input check 
			if(typeof immunizationId !== 'undefined'){
				if(validator.isEmpty(immunizationId)){
					err_code = 2;
					err_msg = "Immunization id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization id is required";
			}

			if(typeof immunizationPractitionerId !== 'undefined'){
				if(validator.isEmpty(immunizationPractitionerId)){
					err_code = 2;
					err_msg = "Immunization Practitioner id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Practitioner id is required";
			}
			
			/*
			"_id" : immunizationPractitionerId,
			"role" : practitionerRole,
			"actor" : practitionerActor,
			"immunization_id" 
			*/
			
			if(typeof req.body.role !== 'undefined' && req.body.role !== ""){
				var practitionerRole =  req.body.role.trim().toLowerCase();
				if(validator.isEmpty(practitionerRole)){
					dataImmunizationPractitioner.role = "";
				}else{
					dataImmunizationPractitioner.role = practitionerRole;
				}
			}else{
			  practitionerRole = "";
			}

			if(typeof req.body.actor !== 'undefined' && req.body.actor !== ""){
				var practitionerActor =  req.body.actor.trim().toLowerCase();
				if(validator.isEmpty(practitionerActor)){
					dataImmunizationPractitioner.actor = "";
				}else{
					dataImmunizationPractitioner.actor = practitionerActor;
				}
			}else{
			  practitionerActor = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkImmunizationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									checkUniqeValue(apikey, "Practitioner_ID|" + immunizationPractitionerId, 'IMMUNIZATION_PRACTITIONER', function(resImmunizationPractitionerID){
										if(resImmunizationPractitionerID.err_code > 0){
											ApiFHIR.put('immunizationPractitioner', {"apikey": apikey, "_id": immunizationPractitionerId, "dr": "IMMUNIZATION_ID|"+immunizationId}, {body: dataImmunizationPractitioner, json: true}, function(error, response, body){
												immunizationPractitioner = body;
												if(immunizationPractitioner.err_code > 0){
													res.json(immunizationPractitioner);	
												}else{
													res.json({"err_code": 0, "err_msg": "Immunization Practitioner has been update in this immunization.", "data": immunizationPractitioner.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "ImmunizationPractitioner Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkActor', function () {
							if (!validator.isEmpty(practitionerActor)) {
								checkUniqeValue(apikey, "PRACTTIONER_ID|" + practitionerActor, 'PRACTTIONER', function (resActor) {
									if (resActor.err_code > 0) {
										myEmitter.emit('checkImmunizationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Actor id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkImmunizationID');
							}
						})
						
						if (!validator.isEmpty(practitionerRole)) {
							checkCode(apikey, practitionerRole, 'IMMUNIZATION_ROLE', function (resPractitionerRoleCode) {
								if (resPractitionerRoleCode.err_code > 0) {
									myEmitter.emit('checkActor');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Practitioner role code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkActor');
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
		immunizationReaction: function updateImmunizationReaction(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var immunizationId = req.params.immunization_id;
			var immunizationReactionId = req.params.immunization_reaction_id;

			var err_code = 0;
			var err_msg = "";
			var dataImmunizationReaction = {};
			//input check 
			if(typeof immunizationId !== 'undefined'){
				if(validator.isEmpty(immunizationId)){
					err_code = 2;
					err_msg = "Immunization id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization id is required";
			}

			if(typeof immunizationReactionId !== 'undefined'){
				if(validator.isEmpty(immunizationReactionId)){
					err_code = 2;
					err_msg = "Immunization Reaction id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Reaction id is required";
			}
			
			if(typeof req.body.date !== 'undefined' && req.body.date !== ""){
				var reactionDate =  req.body.date;
				if(validator.isEmpty(reactionDate)){
					err_code = 2;
					err_msg = "immunization reaction date is required.";
				}else{
					if(!regex.test(reactionDate)){
						err_code = 2;
						err_msg = "immunization reaction date invalid date format.";	
					}else{
						dataImmunizationReaction.date = reactionDate;
					}
				}
			}else{
			  reactionDate = "";
			}

			if(typeof req.body.detail !== 'undefined' && req.body.detail !== ""){
				var reactionDetail =  req.body.detail.trim().toLowerCase();
				if(validator.isEmpty(reactionDetail)){
					dataImmunizationReaction.detail = "";
				}else{
					dataImmunizationReaction.detail = reactionDetail;
				}
			}else{
			  reactionDetail = "";
			}

			if (typeof req.body.reported !== 'undefined' && req.body.reported !== "") {
			  var reactionReported = req.body.reported.trim().toLowerCase();
			  if(reactionReported === "true" || reactionReported === "false"){
					dataImmunizationReaction.reported = reactionReported;
			  } else {
			    err_code = 2;
			    err_msg = "Immunization reaction reported is must be boolean.";
			  }
			} else {
			  reactionReported = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkImmunizationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									checkUniqeValue(apikey, "Reaction_ID|" + immunizationReactionId, 'IMMUNIZATION_REACTION', function(resImmunizationReactionID){
										if(resImmunizationReactionID.err_code > 0){
											ApiFHIR.put('immunizationReaction', {"apikey": apikey, "_id": immunizationReactionId, "dr": "IMMUNIZATION_ID|"+immunizationId}, {body: dataImmunizationReaction, json: true}, function(error, response, body){
												immunizationReaction = body;
												if(immunizationReaction.err_code > 0){
													res.json(immunizationReaction);	
												}else{
													res.json({"err_code": 0, "err_msg": "Immunization Reaction has been update in this immunization.", "data": immunizationReaction.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "ImmunizationReaction Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Id not found"});		
								}
							})
						})

						if (!validator.isEmpty(reactionDetail)) {
							checkUniqeValue(apikey, "OBSERVATION_ID|" + reactionDetail, 'OBSERVATION', function (resDetail) {
								if (resDetail.err_code > 0) {
									myEmitter.emit('checkImmunizationID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Detail id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkImmunizationID');
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
		immunizationVaccinationProtocol: function updateImmunizationVaccinationProtocol(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var immunizationId = req.params.immunization_id;
			var immunizationVaccinationProtocolId = req.params.immunization_vaccination_protocol_id;

			var err_code = 0;
			var err_msg = "";
			var dataImmunizationVaccinationProtocol = {};
			//input check 
			if(typeof immunizationId !== 'undefined'){
				if(validator.isEmpty(immunizationId)){
					err_code = 2;
					err_msg = "Immunization id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization id is required";
			}

			if(typeof immunizationVaccinationProtocolId !== 'undefined'){
				if(validator.isEmpty(immunizationVaccinationProtocolId)){
					err_code = 2;
					err_msg = "Immunization Vaccination Protocol id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Vaccination Protocol id is required";
			}
			
			/*"dose_sequence" : vaccinationProtocolDoseSequence,
										"description" : vaccinationProtocolDescription,
										"authority" : vaccinationProtocolAuthority,
										"series" : vaccinationProtocolSeries,
										"series_doses" : vaccinationProtocolSeriesDoses,
										"target_disease" : vaccinationProtocolTargetDisease,
										"dose_status" : vaccinationProtocolDoseStatus,
										"dose_status_reason"
										*/
			if(typeof req.body.doseSequence !== 'undefined' && req.body.doseSequence !== ""){
				var vaccinationProtocolDoseSequence =  req.body.doseSequence;
				if(validator.isEmpty(vaccinationProtocolDoseSequence)){
					dataImmunizationVaccinationProtocol.dose_sequence = "";
				}else{
					if(!validator.isInt(vaccinationProtocolDoseSequence)){
						err_code = 2;
						err_msg = "immunization vaccination protocol dose sequence is must be number.";
					}else{
						dataImmunizationVaccinationProtocol.dose_sequence = vaccinationProtocolDoseSequence;
					}
				}
			}else{
			  vaccinationProtocolDoseSequence = "";
			}

			if(typeof req.body.description !== 'undefined' && req.body.description !== ""){
				var vaccinationProtocolDescription =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDescription)){
					dataImmunizationVaccinationProtocol.description = "";
				}else{
					dataImmunizationVaccinationProtocol.description = vaccinationProtocolDescription;
				}
			}else{
			  vaccinationProtocolDescription = "";
			}

			if(typeof req.body.authority !== 'undefined' && req.body.authority !== ""){
				var vaccinationProtocolAuthority =  req.body.authority.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolAuthority)){
					dataImmunizationVaccinationProtocol.authority = "";
				}else{
					dataImmunizationVaccinationProtocol.authority = vaccinationProtocolAuthority;
				}
			}else{
			  vaccinationProtocolAuthority = "";
			}

			if(typeof req.body.series !== 'undefined' && req.body.series !== ""){
				var vaccinationProtocolSeries =  req.body.series.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolSeries)){
					dataImmunizationVaccinationProtocol.series = "";
				}else{
					dataImmunizationVaccinationProtocol.series = vaccinationProtocolSeries;
				}
			}else{
			  vaccinationProtocolSeries = "";
			}

			if(typeof req.body.seriesDose !== 'undefined' && req.body.seriesDose !== ""){
				var vaccinationProtocolSeriesDoses =  req.body.seriesDose;
				if(validator.isEmpty(vaccinationProtocolSeriesDoses)){
					dataImmunizationVaccinationProtocol.series_doses = "";
				}else{
					if(!validator.isInt(vaccinationProtocolSeriesDoses)){
						err_code = 2;
						err_msg = "immunization vaccination protocol series doses is must be number.";
					}else{
						dataImmunizationVaccinationProtocol.series_doses = vaccinationProtocolSeriesDoses;
					}
				}
			}else{
			  vaccinationProtocolSeriesDoses = "";
			}

			if(typeof req.body.targetDisease !== 'undefined' && req.body.targetDisease !== ""){
				var vaccinationProtocolTargetDisease =  req.body.targetDisease.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolTargetDisease)){
					dataImmunizationVaccinationProtocol.target_disease = "";
				}else{
					dataImmunizationVaccinationProtocol.target_disease = vaccinationProtocolTargetDisease;
				}
			}else{
			  vaccinationProtocolTargetDisease = "";
			}

			if(typeof req.body.doseStatus !== 'undefined' && req.body.doseStatus !== ""){
				var vaccinationProtocolDoseStatus =  req.body.doseStatus.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDoseStatus)){
					dataImmunizationVaccinationProtocol.dose_status = "";
				}else{
					dataImmunizationVaccinationProtocol.dose_status = vaccinationProtocolDoseStatus;
				}
			}else{
			  vaccinationProtocolDoseStatus = "";
			}

			if(typeof req.body.doseStatusReason !== 'undefined' && req.body.doseStatusReason !== ""){
				var vaccinationProtocolDoseStatusReason =  req.body.doseStatusReason.trim().toLowerCase();
				if(validator.isEmpty(vaccinationProtocolDoseStatusReason)){
					dataImmunizationVaccinationProtocol.dose_status_reason = "";
				}else{
					dataImmunizationVaccinationProtocol.dose_status_reason = vaccinationProtocolDoseStatusReason;
				}
			}else{
			  vaccinationProtocolDoseStatusReason = "";
			}
 

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkImmunizationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									checkUniqeValue(apikey, "VACCINATION_PROTOCOL_ID|" + immunizationVaccinationProtocolId, 'IMMUNIZATION_VACCINATION_PROTOCOL', function(resImmunizationVaccinationProtocolID){
										if(resImmunizationVaccinationProtocolID.err_code > 0){
											ApiFHIR.put('immunizationVaccinationProtocol', {"apikey": apikey, "_id": immunizationVaccinationProtocolId, "dr": "IMMUNIZATION_ID|"+immunizationId}, {body: dataImmunizationVaccinationProtocol, json: true}, function(error, response, body){
												immunizationVaccinationProtocol = body;
												if(immunizationVaccinationProtocol.err_code > 0){
													res.json(immunizationVaccinationProtocol);	
												}else{
													res.json({"err_code": 0, "err_msg": "Immunization Practitioner has been update in this immunization.", "data": immunizationVaccinationProtocol.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Immunization Vaccination Protocol Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkTargetDisease', function () {
							if (!validator.isEmpty(vaccinationProtocolTargetDisease)) {
								checkCode(apikey, vaccinationProtocolTargetDisease, 'VACCINATION_PROTOCOL_DOSE_TARGET', function (resTargetDiseaseCode) {
									if (resTargetDiseaseCode.err_code > 0) {
										myEmitter.emit('checkImmunizationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Target disease code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkImmunizationID');
							}
						})

						myEmitter.prependOnceListener('checkDoseStatus', function () {
							if (!validator.isEmpty(vaccinationProtocolDoseStatus)) {
								checkCode(apikey, vaccinationProtocolDoseStatus, 'VACCINATION_PROTOCOL_DOSE_STATUS', function (resDoseStatusCode) {
									if (resDoseStatusCode.err_code > 0) {
										myEmitter.emit('checkTargetDisease');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Dose status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkTargetDisease');
							}
						})

						myEmitter.prependOnceListener('checkDoseStatusReason', function () {
							if (!validator.isEmpty(vaccinationProtocolDoseStatusReason)) {
								checkCode(apikey, vaccinationProtocolDoseStatusReason, 'VACCINATION_PROTOCOL_DOSE_STATUS_REASON', function (resDoseStatusReasonCode) {
									if (resDoseStatusReasonCode.err_code > 0) {
										myEmitter.emit('checkDoseStatus');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Dose status reason code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkDoseStatus');
							}
						})

						if (!validator.isEmpty(vaccinationProtocolAuthority)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + vaccinationProtocolAuthority, 'ORGANIZATION', function (resAuthority) {
								if (resAuthority.err_code > 0) {
									myEmitter.emit('checkDoseStatusReason');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Authority id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkDoseStatusReason');
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