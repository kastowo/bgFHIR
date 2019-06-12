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
		allergyIntolerance : function getAllergyIntolerance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			//params from query string
			var allergyIntoleranceId = req.query._id;
			var asserter = req.query.asserter;
			var category = req.query.category;
			var clinical_status = req.query.clinicalStatus;
			var code = req.query.code;
			var criticality = req.query.criticality;
			var date = req.query.date;
			var identifier = req.query.identifier;
			var last_date = req.query.lastDate;
			var manifestation = req.query.manifestation;
			var onset = req.query.onset;
			var patient = req.query.patient;
			var recorder = req.query.recorder;
			var route = req.query.route;
			var severity = req.query.severity;
			var type = req.query.type;
			var verification_status = req.query.verificationStatus;
			var qString = {};
			var offset = req.query.offset;
			var limit = req.query.limit;

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
			if(typeof allergyIntoleranceId !== 'undefined'){
				if(!validator.isEmpty(allergyIntoleranceId)){
					qString._id = allergyIntoleranceId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Allergy Intolerance Id is required."});
				}
			}

			if(typeof asserter !== 'undefined'){
				if(!validator.isEmpty(asserter)){
					qString.asserter = asserter; 
				}else{
					res.json({"err_code": 1, "err_msg": "asserter is empty."});
				}
			}

			if(typeof category !== 'undefined'){
				if(!validator.isEmpty(category)){
					qString.category = category; 
				}else{
					res.json({"err_code": 1, "err_msg": "category is empty."});
				}
			}

			if(typeof clinical_status !== 'undefined'){
				if(!validator.isEmpty(clinical_status)){
					qString.clinical_status = clinical_status; 
				}else{
					res.json({"err_code": 1, "err_msg": "clinical status is empty."});
				}
			}

			if(typeof code !== 'undefined'){
				if(!validator.isEmpty(code)){
					qString.code = code; 
				}else{
					res.json({"err_code": 1, "err_msg": "code is empty."});
				}
			}

			if(typeof criticality !== 'undefined'){
				if(!validator.isEmpty(criticality)){
					qString.criticality = criticality; 
				}else{
					res.json({"err_code": 1, "err_msg": "criticality is empty."});
				}
			}

			if(typeof date !== 'undefined'){
				if(!validator.isEmpty(date)){
					qString.date = date; 
				}else{
					res.json({"err_code": 1, "err_msg": "date is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "identifier is empty."});
				}
			}

			if(typeof last_date !== 'undefined'){
				if(!validator.isEmpty(last_date)){
					qString.last_date = last_date; 
				}else{
					res.json({"err_code": 1, "err_msg": "last date is empty."});
				}
			}

			if(typeof manifestation !== 'undefined'){
				if(!validator.isEmpty(manifestation)){
					qString.manifestation = manifestation; 
				}else{
					res.json({"err_code": 1, "err_msg": "manifestation is empty."});
				}
			}

			if(typeof onset !== 'undefined'){
				if(!validator.isEmpty(onset)){
					if(!regex.test(onset)){
						res.json({"err_code": 1, "err_msg": "onset invalid format."});
					}else{
						qString.onset = onset; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "onset is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "patient is empty."});
				}
			}

			if(typeof recorder !== 'undefined'){
				if(!validator.isEmpty(recorder)){
					qString.recorder = recorder; 
				}else{
					res.json({"err_code": 1, "err_msg": "recorder is empty."});
				}
			}

			if(typeof route !== 'undefined'){
				if(!validator.isEmpty(route)){
					qString.route = route; 
				}else{
					res.json({"err_code": 1, "err_msg": "route is empty."});
				}
			}

			if(typeof severity !== 'undefined'){
				if(!validator.isEmpty(severity)){
					qString.severity = severity; 
				}else{
					res.json({"err_code": 1, "err_msg": "severity is empty."});
				}
			}

			if(typeof type !== 'undefined'){
				if(!validator.isEmpty(type)){
					qString.type = type; 
				}else{
					res.json({"err_code": 1, "err_msg": "type is empty."});
				}
			}

			if(typeof verification_status !== 'undefined'){
				if(!validator.isEmpty(verification_status)){
					qString.verification_status = verification_status; 
				}else{
					res.json({"err_code": 1, "err_msg": "verification status is empty."});
				}
			}


			seedPhoenixFHIR.path.GET = {
				"AllergyIntolerance" : {
					"location": "%(apikey)s/AllergyIntolerance",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('AllergyIntolerance', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var allergyIntolerance = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(allergyIntolerance.err_code == 0){
								//cek jumdata dulu
								if(allergyIntolerance.data.length > 0){
									newAllergyIntolerance = [];
									for(i=0; i < allergyIntolerance.data.length; i++){
										myEmitter.once("getIdentifier", function(allergyIntolerance, index, newAllergyIntolerance, countAllergyIntolerance){
														//get identifier
														qString = {};
														qString.allergy_intolerance_id = allergyIntolerance.id;
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
																var objectAllergyIntolerance = {};
																objectAllergyIntolerance.resourceType = allergyIntolerance.resourceType;
																objectAllergyIntolerance.id = allergyIntolerance.id;
																objectAllergyIntolerance.identifier = identifier.data;
																objectAllergyIntolerance.clinicalStatus = allergyIntolerance.clinicalStatus;
																objectAllergyIntolerance.verificationStatus = allergyIntolerance.verificationStatus;
																objectAllergyIntolerance.type = allergyIntolerance.type;
																objectAllergyIntolerance.category = allergyIntolerance.category;
																objectAllergyIntolerance.criticality = allergyIntolerance.criticality;
																objectAllergyIntolerance.code = allergyIntolerance.code;
																objectAllergyIntolerance.patient = allergyIntolerance.patient;
																objectAllergyIntolerance.onset = allergyIntolerance.onset;
																objectAllergyIntolerance.assertedDate = allergyIntolerance.assertedDate;
																objectAllergyIntolerance.recorder = allergyIntolerance.recorder;
																objectAllergyIntolerance.asserter = allergyIntolerance.asserter;
																objectAllergyIntolerance.lastOccurrence = allergyIntolerance.lastOccurrence;

																newAllergyIntolerance[index] = objectAllergyIntolerance;
																
																/*if(index == countAllergyIntolerance -1 ){
																	res.json({"err_code": 0, "data":newAllergyIntolerance});				
																}*/

																myEmitter.once('getAllergyIntoleranceReaction', function(allergyIntolerance, index, newAllergyIntolerance, countAllergyIntolerance){
																	qString = {};
																	qString.allergy_intolerance_id = allergyIntolerance.id;
																	
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
																						var objectAllergyIntolerance = {};
																						objectAllergyIntolerance.resourceType = allergyIntolerance.resourceType;
																						objectAllergyIntolerance.id = allergyIntolerance.id;
																						objectAllergyIntolerance.identifier = allergyIntolerance.identifier;
																						objectAllergyIntolerance.clinicalStatus = allergyIntolerance.clinicalStatus;
																						objectAllergyIntolerance.verificationStatus = allergyIntolerance.verificationStatus;
																						objectAllergyIntolerance.type = allergyIntolerance.type;
																						objectAllergyIntolerance.category = allergyIntolerance.category;
																						objectAllergyIntolerance.criticality = allergyIntolerance.criticality;
																						objectAllergyIntolerance.code = allergyIntolerance.code;
																						objectAllergyIntolerance.patient = allergyIntolerance.patient;
																						objectAllergyIntolerance.onset = allergyIntolerance.onset;
																						objectAllergyIntolerance.assertedDate = allergyIntolerance.assertedDate;
																						objectAllergyIntolerance.recorder = allergyIntolerance.recorder;
																						objectAllergyIntolerance.asserter = allergyIntolerance.asserter;
																						objectAllergyIntolerance.lastOccurrence = allergyIntolerance.lastOccurrence;
																						objectAllergyIntolerance.note = annotation.data;
																						objectAllergyIntolerance.reaction = host + ':' + port + '/' + apikey + '/AllergyIntolerance/' +  allergyIntolerance.id + '/AllergyIntoleranceReaction';

																						newAllergyIntolerance[index] = objectAllergyIntolerance;

																						if(index == countAllergyIntolerance -1 ){
																							res.json({"err_code": 0, "data":newAllergyIntolerance});				
																						}			
																					}else{
																						res.json(annotation);			
																					}
																				})
																			})
																myEmitter.emit('getAllergyIntoleranceReaction', objectAllergyIntolerance, index, newAllergyIntolerance, countAllergyIntolerance);
															}else{
																res.json(identifier);
															}
														})
													})
										myEmitter.emit("getIdentifier", allergyIntolerance.data[i], i, newAllergyIntolerance, allergyIntolerance.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Allergy Intolerance is empty."});	
								}
							}else{
								res.json(allergyIntolerance);
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
					var allergyIntoleranceId = req.params.allergy_intolerance_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "ALLERGY_INTOLERANCE_ID|" + allergyIntoleranceId, 'ALLERGY_INTOLERANCE', function(resAllergyIntoleranceID){
								if(resAllergyIntoleranceID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.allergy_intolerance_id = allergyIntoleranceId;
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
						  			qString.allergy_intolerance_id = allergyIntoleranceId;
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
									res.json({"err_code": 501, "err_msg": "AllergyIntolerance Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		allergyIntoleranceReaction: function getAllergyIntoleranceReaction(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var allergyIntoleranceId = req.params.allergy_intolerance_id;
			var allergyIntoleranceReactionId = req.params.allergy_intolerance_reaction_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "ALLERGY_INTOLERANCE_ID|" + allergyIntoleranceId, 'ALLERGY_INTOLERANCE', function(resAllergyIntolerance){
						if(resAllergyIntolerance.err_code > 0){
							if(typeof allergyIntoleranceReactionId !== 'undefined' && !validator.isEmpty(allergyIntoleranceReactionId)){
								checkUniqeValue(apikey, "REACTION_ID|" + allergyIntoleranceReactionId, 'ALLERGY_INTOLERANCE_REACTION', function(resAllergyIntoleranceReactionID){
									if(resAllergyIntoleranceReactionID.err_code > 0){
										//get allergyIntoleranceReaction
										qString = {};
										qString.allergy_intolerance_id = allergyIntoleranceId;
										qString._id = allergyIntoleranceReactionId;
										seedPhoenixFHIR.path.GET = {
											"AllergyIntoleranceReaction" : {
												"location": "%(apikey)s/AllergyIntoleranceReaction",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('AllergyIntoleranceReaction', {"apikey": apikey}, {}, function(error, response, body){
											allergyIntoleranceReaction = JSON.parse(body);
											if(allergyIntoleranceReaction.err_code == 0){
												//res.json({"err_code": 0, "data":allergyIntoleranceReaction.data});	
												if(allergyIntoleranceReaction.data.length > 0){
													newAllergyIntoleranceReaction = [];
													for(i=0; i < allergyIntoleranceReaction.data.length; i++){
														myEmitter.once('getAnnotation', function(allergyIntoleranceReaction, index, newAllergyIntoleranceReaction, countAllergyIntoleranceReaction){
															qString = {};
															qString.allergy_intolerance_reaction_id = allergyIntoleranceReaction.id;
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
																	var objectAllergyIntoleranceReaction = {};
																	objectAllergyIntoleranceReaction.id = allergyIntoleranceReaction.id;
																	objectAllergyIntoleranceReaction.substance = allergyIntoleranceReaction.substance;
																	objectAllergyIntoleranceReaction.manifestation = allergyIntoleranceReaction.manifestation;
																	objectAllergyIntoleranceReaction.description = allergyIntoleranceReaction.description;
																	objectAllergyIntoleranceReaction.onset = allergyIntoleranceReaction.onset;
																	objectAllergyIntoleranceReaction.severity = allergyIntoleranceReaction.severity;
																	objectAllergyIntoleranceReaction.exposureRoute = allergyIntoleranceReaction.exposureRoute;
																	objectAllergyIntoleranceReaction.note = annotation.data;

																	newAllergyIntoleranceReaction[index] = objectAllergyIntoleranceReaction;

																	if(index == countAllergyIntoleranceReaction -1 ){
																		res.json({"err_code": 0, "data":newAllergyIntoleranceReaction});	
																	}
																}else{
																	res.json(annotation);			
																}
															})
														})
														myEmitter.emit('getAnnotation', allergyIntoleranceReaction.data[i], i, newAllergyIntoleranceReaction, allergyIntoleranceReaction.data.length);

													}
												}else{
													res.json({"err_code": 2, "err_msg": "allergy intolerance reaction is empty."});	
												}
											}else{
												res.json(allergyIntoleranceReaction);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Allergy Intolerance Reaction Id not found"});		
									}
								})
							}else{
								//get allergyIntoleranceReaction
								qString = {};
								qString.allergy_intolerance_id = allergyIntoleranceId;
								seedPhoenixFHIR.path.GET = {
									"AllergyIntoleranceReaction" : {
										"location": "%(apikey)s/AllergyIntoleranceReaction",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('AllergyIntoleranceReaction', {"apikey": apikey}, {}, function(error, response, body){
									allergyIntoleranceReaction = JSON.parse(body);
									if(allergyIntoleranceReaction.err_code == 0){
										//res.json({"err_code": 0, "data":allergyIntoleranceReaction.data});	
										if(allergyIntoleranceReaction.data.length > 0){
											newAllergyIntoleranceReaction = [];
											for(i=0; i < allergyIntoleranceReaction.data.length; i++){
												myEmitter.once('getAnnotation', function(allergyIntoleranceReaction, index, newAllergyIntoleranceReaction, countAllergyIntoleranceReaction){
													qString = {};
													qString.allergy_intolerance_reaction_id = allergyIntoleranceReaction.id;
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
															var objectAllergyIntoleranceReaction = {};
															objectAllergyIntoleranceReaction.id = allergyIntoleranceReaction.id;
															objectAllergyIntoleranceReaction.substance = allergyIntoleranceReaction.substance;
															objectAllergyIntoleranceReaction.manifestation = allergyIntoleranceReaction.manifestation;
															objectAllergyIntoleranceReaction.description = allergyIntoleranceReaction.description;
															objectAllergyIntoleranceReaction.onset = allergyIntoleranceReaction.onset;
															objectAllergyIntoleranceReaction.severity = allergyIntoleranceReaction.severity;
															objectAllergyIntoleranceReaction.exposureRoute = allergyIntoleranceReaction.exposureRoute;
															objectAllergyIntoleranceReaction.note = annotation.data;

															newAllergyIntoleranceReaction[index] = objectAllergyIntoleranceReaction;

															if(index == countAllergyIntoleranceReaction -1 ){
																res.json({"err_code": 0, "data":newAllergyIntoleranceReaction});	
															}
														}else{
															res.json(annotation);			
														}
													})
												})
												myEmitter.emit('getAnnotation', allergyIntoleranceReaction.data[i], i, newAllergyIntoleranceReaction, allergyIntoleranceReaction.data.length);

											}
										}else{
											res.json({"err_code": 2, "err_msg": "allergy intolerance reaction is empty."});	
										}
									}else{
										res.json(allergyIntoleranceReaction);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Allergy Intolerance Id not found"});		
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
		allergyIntolerance : function addAllergyIntolerance(req, res){
			console.log("1");
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
			
			/*clinicalStatus|clinicalStatus||
verificationStatus|verificationStatus||nn
type|type||
category|category||
criticality|criticality||
code|code||
patient|patient||nn
onset.onsetDateTime|onsetOnsetDateTime|date|
onset.onsetAge|onsetOnsetAge||
onset.onsetPeriod|onsetOnsetPeriod|period|
onset.onsetRange|onsetOnsetRange|range|
onset.onsetString|onsetOnsetString||
assertedDate|assertedDate|date|
recorder.practitioner|recorderPractitioner||
recorder.patient|recorderPatient||
asserter.patient|asserterPatient|
asserter.relatedPerson|asserterRelatedPerson|
asserter.practitioner|asserterPractitioner|
lastOccurrence|lastOccurrence|date|
note.author.authorReference.practitioner|noteAuthorAuthorReferencePractitioner|||
note.author.authorReference.patient|noteAuthorAuthorReferencePatient|||
note.author.authorReference.relatedPerson|noteAuthorAuthorReferenceRelatedPerson|||
note.author.authorString|noteAuthorAuthorString|||
note.time|noteTime|date||
note.text|NoteText|||
reaction.substance|reactionSubstance||
reaction.manifestation|reactionManifestation||nn
reaction.description|reactionDescription||
reaction.onset|reactionOnset|date|
reaction.severity|reactionSeverity||
reaction.exposureRoute|reactionExposureRoute||
reaction.note.author.authorReference.practitioner|reactionNoteAuthorAuthorReferencePractitioner|||
reaction.note.author.authorReference.patient|reactionNoteAuthorAuthorReferencePatient|||
reaction.note.author.authorReference.relatedPerson|reactionNoteAuthorAuthorReferenceRelatedPerson|||
reaction.note.author.authorString|reactionNoteAuthorAuthorString|||
reaction.note.time|reactionNoteTime|date||
reaction.note.text|reactionNoteText|||
*/
			if(typeof req.body.clinicalStatus !== 'undefined'){
				var clinicalStatus =  req.body.clinicalStatus.trim().toLowerCase();
				if(validator.isEmpty(clinicalStatus)){
					clinicalStatus = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'clinical status' in json Allergy Intolerance request.";
			}

			if(typeof req.body.verificationStatus !== 'undefined'){
				var verificationStatus =  req.body.verificationStatus.trim().toLowerCase();
				if(validator.isEmpty(verificationStatus)){
					err_code = 2;
					err_msg = "Allergy Intolerance verification status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'verification status' in json Allergy Intolerance request.";
			}

			if(typeof req.body.type !== 'undefined'){
				var type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					type = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json Allergy Intolerance request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Allergy Intolerance request.";
			}

			if(typeof req.body.criticality !== 'undefined'){
				var criticality =  req.body.criticality.trim().toLowerCase();
				if(validator.isEmpty(criticality)){
					criticality = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'criticality' in json Allergy Intolerance request.";
			}

			if(typeof req.body.code !== 'undefined'){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					code = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Allergy Intolerance request.";
			}

			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					err_code = 2;
					err_msg = "Allergy Intolerance patient is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Allergy Intolerance request.";
			}

			if(typeof req.body.onset.onsetDateTime !== 'undefined'){
				var onsetOnsetDateTime =  req.body.onset.onsetDateTime;
				if(validator.isEmpty(onsetOnsetDateTime)){
					onsetOnsetDateTime = "";
				}else{
					if(!regex.test(onsetOnsetDateTime)){
						err_code = 2;
						err_msg = "Allergy Intolerance onset onset date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'onset onset date time' in json Allergy Intolerance request.";
			}

			if(typeof req.body.onset.onsetAge !== 'undefined'){
				var onsetOnsetAge =  req.body.onset.onsetAge.trim().toLowerCase();
				if(validator.isEmpty(onsetOnsetAge)){
					onsetOnsetAge = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'onset onset age' in json Allergy Intolerance request.";
			}

			if (typeof req.body.onset.onsetPeriod !== 'undefined') {
			  var onsetOnsetPeriod = req.body.onset.onsetPeriod;
 				if(validator.isEmpty(onsetOnsetPeriod)) {
				  var onsetOnsetPeriodStart = "";
				  var onsetOnsetPeriodEnd = "";
				} else {
				  if (onsetOnsetPeriod.indexOf("to") > 0) {
				    arrOnsetOnsetPeriod = onsetOnsetPeriod.split("to");
				    var onsetOnsetPeriodStart = arrOnsetOnsetPeriod[0];
				    var onsetOnsetPeriodEnd = arrOnsetOnsetPeriod[1];
				    if (!regex.test(onsetOnsetPeriodStart) && !regex.test(onsetOnsetPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Allergy Intolerance onset onset period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Allergy Intolerance onset onset period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'onset onset period' in json Allergy Intolerance request.";
			}

			if (typeof req.body.onset.onsetRange !== 'undefined') {
			  var onsetOnsetRange = req.body.onset.onsetRange;
 				if(validator.isEmpty(onsetOnsetRange)){
				  var onsetOnsetRangeLow = "";
				  var onsetOnsetRangeHigh = "";
				} else {
				  if (onsetOnsetRange.indexOf("to") > 0) {
				    arrOnsetOnsetRange = onsetOnsetRange.split("to");
				    var onsetOnsetRangeLow = arrOnsetOnsetRange[0];
				    var onsetOnsetRangeHigh = arrOnsetOnsetRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Allergy Intolerance onset onset range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'onset onset range' in json Allergy Intolerance request.";
			}

			if(typeof req.body.onset.onsetString !== 'undefined'){
				var onsetOnsetString =  req.body.onset.onsetString.trim().toLowerCase();
				if(validator.isEmpty(onsetOnsetString)){
					onsetOnsetString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'onset onset string' in json Allergy Intolerance request.";
			}

			if(typeof req.body.assertedDate !== 'undefined'){
				var assertedDate =  req.body.assertedDate;
				if(validator.isEmpty(assertedDate)){
					assertedDate = "";
				}else{
					if(!regex.test(assertedDate)){
						err_code = 2;
						err_msg = "Allergy Intolerance asserted date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'asserted date' in json Allergy Intolerance request.";
			}

			if(typeof req.body.recorder.practitioner !== 'undefined'){
				var recorderPractitioner =  req.body.recorder.practitioner.trim().toLowerCase();
				if(validator.isEmpty(recorderPractitioner)){
					recorderPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recorder practitioner' in json Allergy Intolerance request.";
			}

			if(typeof req.body.recorder.patient !== 'undefined'){
				var recorderPatient =  req.body.recorder.patient.trim().toLowerCase();
				if(validator.isEmpty(recorderPatient)){
					recorderPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recorder patient' in json Allergy Intolerance request.";
			}

			if(typeof req.body.asserter.patient !== 'undefined'){
				var asserterPatient =  req.body.asserter.patient.trim().toLowerCase();
				if(validator.isEmpty(asserterPatient)){
					asserterPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'asserter patient' in json Allergy Intolerance request.";
			}

			if(typeof req.body.asserter.relatedPerson !== 'undefined'){
				var asserterRelatedPerson =  req.body.asserter.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(asserterRelatedPerson)){
					asserterRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'asserter related person' in json Allergy Intolerance request.";
			}

			if(typeof req.body.asserter.practitioner !== 'undefined'){
				var asserterPractitioner =  req.body.asserter.practitioner.trim().toLowerCase();
				if(validator.isEmpty(asserterPractitioner)){
					asserterPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'asserter practitioner' in json Allergy Intolerance request.";
			}

			if(typeof req.body.lastOccurrence !== 'undefined'){
				var lastOccurrence =  req.body.lastOccurrence;
				if(validator.isEmpty(lastOccurrence)){
					lastOccurrence = "";
				}else{
					if(!regex.test(lastOccurrence)){
						err_code = 2;
						err_msg = "Allergy Intolerance last occurrence invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'last occurrence' in json Allergy Intolerance request.";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Allergy Intolerance request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Allergy Intolerance request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Allergy Intolerance request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Allergy Intolerance request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Allergy Intolerance note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Allergy Intolerance request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var NoteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(NoteText)){
					NoteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note.text' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.substance !== 'undefined'){
				var reactionSubstance =  req.body.reaction.substance.trim().toLowerCase();
				if(validator.isEmpty(reactionSubstance)){
					reactionSubstance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction substance' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.manifestation !== 'undefined'){
				var reactionManifestation =  req.body.reaction.manifestation.trim().toLowerCase();
				if(validator.isEmpty(reactionManifestation)){
					err_code = 2;
					err_msg = "Allergy Intolerance reaction manifestation is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction manifestation' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.description !== 'undefined'){
				var reactionDescription =  req.body.reaction.description.trim().toLowerCase();
				if(validator.isEmpty(reactionDescription)){
					reactionDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction description' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.onset !== 'undefined'){
				var reactionOnset =  req.body.reaction.onset;
				if(validator.isEmpty(reactionOnset)){
					reactionOnset = "";
				}else{
					if(!regex.test(reactionOnset)){
						err_code = 2;
						err_msg = "Allergy Intolerance reaction onset invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction onset' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.severity !== 'undefined'){
				var reactionSeverity =  req.body.reaction.severity.trim().toLowerCase();
				if(validator.isEmpty(reactionSeverity)){
					reactionSeverity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction severity' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.exposureRoute !== 'undefined'){
				var reactionExposureRoute =  req.body.reaction.exposureRoute.trim().toLowerCase();
				if(validator.isEmpty(reactionExposureRoute)){
					reactionExposureRoute = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction exposure route' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.note.author.authorReference.practitioner !== 'undefined'){
				var reactionNoteAuthorAuthorReferencePractitioner =  req.body.reaction.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(reactionNoteAuthorAuthorReferencePractitioner)){
					reactionNoteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction note author author reference practitioner' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.note.author.authorReference.patient !== 'undefined'){
				var reactionNoteAuthorAuthorReferencePatient =  req.body.reaction.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(reactionNoteAuthorAuthorReferencePatient)){
					reactionNoteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction note author author reference patient' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.note.author.authorReference.relatedPerson !== 'undefined'){
				var reactionNoteAuthorAuthorReferenceRelatedPerson =  req.body.reaction.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(reactionNoteAuthorAuthorReferenceRelatedPerson)){
					reactionNoteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction note author author reference related person' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.note.author.authorString !== 'undefined'){
				var reactionNoteAuthorAuthorString =  req.body.reaction.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(reactionNoteAuthorAuthorString)){
					reactionNoteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction note author author string' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.note.time !== 'undefined'){
				var reactionNoteTime =  req.body.reaction.note.time;
				if(validator.isEmpty(reactionNoteTime)){
					reactionNoteTime = "";
				}else{
					if(!regex.test(reactionNoteTime)){
						err_code = 2;
						err_msg = "Allergy Intolerance reaction note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction note time' in json Allergy Intolerance request.";
			}

			if(typeof req.body.reaction.note.text !== 'undefined'){
				var reactionNoteText =  req.body.reaction.note.text.trim().toLowerCase();
				if(validator.isEmpty(reactionNoteText)){
					reactionNoteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction note.text' in json Allergy Intolerance request.";
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
											console.log("3");
												checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
													if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada

														//proses insert

														//set uniqe id
														var unicId = uniqid.time();
														var identifierId = 'ide' + unicId;
														var allergyIntoleranceId = 'ain' + unicId;
														var allergyIntoleranceReactionId = 'air' + unicId;
														var noteId = 'ann' + unicId;
														var noteReactionId = 'anr' + unicId;

														var dataAllergyIntolerance = {
															"allergy_intolerance_id" : allergyIntoleranceId,
															"clinical_status" : clinicalStatus,
															"verification_status" : verificationStatus,
															"type" : type,
															"category" : category,
															"criticality" : criticality,
															"code" : code,
															"patient" : patient,
															"onset_date_time" : onsetOnsetDateTime,
															"onset_age" : onsetOnsetAge,
															"onset_period_start" : onsetOnsetPeriodStart,
															"onset_period_end" : onsetOnsetPeriodEnd,
															"onset_range_low" : onsetOnsetRangeLow,
															"onset_range_high" : onsetOnsetRangeHigh,
															"onset_string" : onsetOnsetString,
															"asserted_date" : assertedDate,
															"recorder_practitioner" : recorderPractitioner,
															"recorder_patient" : recorderPatient,
															"asserter_patient" : asserterPatient,
															"asserter_related_person" : asserterRelatedPerson,
															"asserter_practitioner" : asserterPractitioner,
															"last_occurrence" : lastOccurrence
														};
														var identifierSystem = identifierId;
														var dataIdentifier = {
																							"id": identifierId,
																							"use": identifierUseCode,
																							"type": identifierTypeCode,
																							"system": identifierSystem,
																							"value": identifierValue,
																							"period_start": identifierPeriodStart,
																							"period_end": identifierPeriodEnd,
																							"allergy_intolerance_id": allergyIntoleranceId
																						};
														var dataAllergyIntoleranceReaction = {
															"id" : allergyIntoleranceReactionId,
															"substance" : reactionSubstance,
															"manifestation" : reactionManifestation,
															"description" : reactionDescription,
															"onset" : reactionOnset,
															"severity" : reactionSeverity,
															"exposureroute" : reactionExposureRoute,
															"allergy_intolerance_id" : allergyIntoleranceId
														};
														var dataNote = {
															"id": noteId,
															"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
															"author_ref_patient": noteAuthorAuthorReferencePatient,
															"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
															"author_string": noteAuthorAuthorString,
															"time": noteTime,
															"text": NoteText,
															"allergy_intolerance_id" : allergyIntoleranceId
														};
														var dataReactionNote = {
															"id": noteReactionId,
															"author_ref_practitioner": reactionNoteAuthorAuthorReferencePractitioner,
															"author_ref_patient": reactionNoteAuthorAuthorReferencePatient,
															"author_ref_relatedPerson": reactionNoteAuthorAuthorReferenceRelatedPerson,
															"author_string": reactionNoteAuthorAuthorString,
															"time": reactionNoteTime,
															"text": reactionNoteText,
															"allergy_intolerance_reaction_id" : allergyIntoleranceReactionId
														};
														
														ApiFHIR.post('allergyIntolerance', {"apikey": apikey}, {body: dataAllergyIntolerance, json: true}, function(error, response, body){
															allergyIntolerance = body;
															if(allergyIntolerance.err_code > 0){
																res.json(allergyIntolerance);	
															} else {
																//identifier
																ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
																	identifier = body;
																	if(identifier.err_code > 0){
																		res.json(identifier);	
																	} else {
																		//AllergyIntoleranceReaction
																		ApiFHIR.post('allergyIntoleranceReaction', {"apikey": apikey}, {body: dataAllergyIntoleranceReaction, json: true}, function(error, response, body){
																			allergyIntoleranceReaction = body;
																			if(allergyIntoleranceReaction.err_code > 0){
																				res.json(allergyIntoleranceReaction);	
																			} else {
																				//method, endpoint, params, options, callback
																				ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataNote, json:true}, function(error, response, body){
																					annotation = body;
																					if(annotation.err_code > 0){
																						res.json(annotation);	
																					} else {
																						ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataReactionNote, json:true}, function(error, response, body){
																							annotation = body;
																							if(annotation.err_code > 0){
																								res.json(annotation);	
																							} else {
																								res.json({"err_code": 0, "err_msg": "Allergy Intolerance has been add.", "data": [{"_id": allergyIntoleranceId}]});
																							}
																						});
																					}
																				});
																			}
																		});
																	}
																})
															}
														});
													}else{
														res.json({"err_code": 508, "err_msg": "Identifier value already exist."});		
													}
												})
										});

/*
clinicalStatus|ALLERGY_CLINICAL_STATUS
verificationStatus|ALLERGY_VERIFICATION_STATUS
type|ALLERGY_INTOLERANCE_TYPE
category|ALLERGY_INTOLERANCE_CATEGORY
criticality|ALLERGY_INTOLERANCE_CRITICALITY
code|ALLERGY_INTOLERANCE_CODE
reactionSubstance|SUBSTANCE_CODE
reactionManifestation|CLINICAL_FINDINGS
reactionSeverity|REACTION_EVENT_SEVERITY
reactionExposureRoute|ROUTE_CODES
*/
										myEmitter.prependOnceListener('checkClinicalStatus', function () {
											if (!validator.isEmpty(clinicalStatus)) {
												checkCode(apikey, clinicalStatus, 'ALLERGY_CLINICAL_STATUS', function (resClinicalStatusCode) {
													if (resClinicalStatusCode.err_code > 0) {
														myEmitter.emit('checkIdentifierValue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Clinical status code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIdentifierValue');
											}
										})

										myEmitter.prependOnceListener('checkVerificationStatus', function () {
											if (!validator.isEmpty(verificationStatus)) {
												checkCode(apikey, verificationStatus, 'ALLERGY_VERIFICATION_STATUS', function (resVerificationStatusCode) {
													if (resVerificationStatusCode.err_code > 0) {
														myEmitter.emit('checkClinicalStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Verification status code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkClinicalStatus');
											}
										})

										myEmitter.prependOnceListener('checkType', function () {
											if (!validator.isEmpty(type)) {
												checkCode(apikey, type, 'ALLERGY_INTOLERANCE_TYPE', function (resTypeCode) {
													if (resTypeCode.err_code > 0) {
														myEmitter.emit('checkVerificationStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkVerificationStatus');
											}
										})

										myEmitter.prependOnceListener('checkCategory', function () {
											if (!validator.isEmpty(category)) {
												checkCode(apikey, category, 'ALLERGY_INTOLERANCE_CATEGORY', function (resCategoryCode) {
													if (resCategoryCode.err_code > 0) {
														myEmitter.emit('checkType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkType');
											}
										})

										myEmitter.prependOnceListener('checkCriticality', function () {
											if (!validator.isEmpty(criticality)) {
												checkCode(apikey, criticality, 'ALLERGY_INTOLERANCE_CRITICALITY', function (resCriticalityCode) {
													if (resCriticalityCode.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Criticality code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkCode', function () {
											if (!validator.isEmpty(code)) {
												checkCode(apikey, code, 'ALLERGY_INTOLERANCE_CODE', function (resCodeCode) {
													if (resCodeCode.err_code > 0) {
														myEmitter.emit('checkCriticality');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCriticality');
											}
										})

										myEmitter.prependOnceListener('checkReactionSubstance', function () {
											if (!validator.isEmpty(reactionSubstance)) {
												checkCode(apikey, reactionSubstance, 'SUBSTANCE_CODE', function (resReactionSubstanceCode) {
													if (resReactionSubstanceCode.err_code > 0) {
														myEmitter.emit('checkCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reaction substance code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCode');
											}
										})

										myEmitter.prependOnceListener('checkReactionManifestation', function () {
											if (!validator.isEmpty(reactionManifestation)) {
												checkCode(apikey, reactionManifestation, 'CLINICAL_FINDINGS', function (resReactionManifestationCode) {
													if (resReactionManifestationCode.err_code > 0) {
														myEmitter.emit('checkReactionSubstance');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reaction manifestation code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReactionSubstance');
											}
										})

										myEmitter.prependOnceListener('checkReactionSeverity', function () {
											if (!validator.isEmpty(reactionSeverity)) {
												checkCode(apikey, reactionSeverity, 'REACTION_EVENT_SEVERITY', function (resReactionSeverityCode) {
													if (resReactionSeverityCode.err_code > 0) {
														myEmitter.emit('checkReactionManifestation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reaction severity code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReactionManifestation');
											}
										})

										myEmitter.prependOnceListener('checkReactionExposureRoute', function () {
											if (!validator.isEmpty(reactionExposureRoute)) {
												checkCode(apikey, reactionExposureRoute, 'ROUTE_CODES', function (resReactionExposureRouteCode) {
													if (resReactionExposureRouteCode.err_code > 0) {
														myEmitter.emit('checkReactionSeverity');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reaction exposure route code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReactionSeverity');
											}
										})

										
//check reference										
/*
patient|patient
recorderPractitioner|Practitioner
recorderPatient|Patient
asserterPatient|Patient
asserterRelatedPerson|Related_Person
asserterPractitioner|Practitioner
noteAuthorAuthorReferencePractitioner|Practitioner
noteAuthorAuthorReferencePatient|patient
noteAuthorAuthorReferenceRelatedPerson|Related_Person
reactionNoteAuthorAuthorReferencePractitioner|Practitioner
reactionNoteAuthorAuthorReferencePatient|patient
reactionNoteAuthorAuthorReferenceRelatedPerson|Related_Person
*/										
										myEmitter.prependOnceListener('checkPatient', function () {
											if (!validator.isEmpty(patient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
													if (resPatient.err_code > 0) {
														myEmitter.emit('checkReactionExposureRoute');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReactionExposureRoute');
											}
										})

										myEmitter.prependOnceListener('checkRecorderPractitioner', function () {
											if (!validator.isEmpty(recorderPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + recorderPractitioner, 'PRACTITIONER', function (resRecorderPractitioner) {
													if (resRecorderPractitioner.err_code > 0) {
														myEmitter.emit('checkPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recorder practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPatient');
											}
										})

										myEmitter.prependOnceListener('checkRecorderPatient', function () {
											if (!validator.isEmpty(recorderPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + recorderPatient, 'PATIENT', function (resRecorderPatient) {
													if (resRecorderPatient.err_code > 0) {
														myEmitter.emit('checkRecorderPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recorder patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecorderPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkAsserterPatient', function () {
											if (!validator.isEmpty(asserterPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + asserterPatient, 'PATIENT', function (resAsserterPatient) {
													if (resAsserterPatient.err_code > 0) {
														myEmitter.emit('checkRecorderPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Asserter patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecorderPatient');
											}
										})

										myEmitter.prependOnceListener('checkAsserterRelatedPerson', function () {
											if (!validator.isEmpty(asserterRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + asserterRelatedPerson, 'RELATED_PERSON', function (resAsserterRelatedPerson) {
													if (resAsserterRelatedPerson.err_code > 0) {
														myEmitter.emit('checkAsserterPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Asserter related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAsserterPatient');
											}
										})

										myEmitter.prependOnceListener('checkAsserterPractitioner', function () {
											if (!validator.isEmpty(asserterPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + asserterPractitioner, 'PRACTITIONER', function (resAsserterPractitioner) {
													if (resAsserterPractitioner.err_code > 0) {
														myEmitter.emit('checkAsserterRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Asserter practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAsserterRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
											if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
													if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
														myEmitter.emit('checkAsserterPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author author reference practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAsserterPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePatient', function () {
											if (!validator.isEmpty(noteAuthorAuthorReferencePatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + noteAuthorAuthorReferencePatient, 'PATIENT', function (resNoteAuthorAuthorReferencePatient) {
													if (resNoteAuthorAuthorReferencePatient.err_code > 0) {
														myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author author reference patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
											}
										})

										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferenceRelatedPerson', function () {
											if (!validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + noteAuthorAuthorReferenceRelatedPerson, 'RELATED_PERSON', function (resNoteAuthorAuthorReferenceRelatedPerson) {
													if (resNoteAuthorAuthorReferenceRelatedPerson.err_code > 0) {
														myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author author reference related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
											}
										})

										myEmitter.prependOnceListener('checkReactionNoteAuthorAuthorReferencePractitioner', function () {
											if (!validator.isEmpty(reactionNoteAuthorAuthorReferencePractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + reactionNoteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resReactionNoteAuthorAuthorReferencePractitioner) {
													if (resReactionNoteAuthorAuthorReferencePractitioner.err_code > 0) {
														myEmitter.emit('checkNoteAuthorAuthorReferenceRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reaction note author author reference practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkNoteAuthorAuthorReferenceRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkReactionNoteAuthorAuthorReferencePatient', function () {
											if (!validator.isEmpty(reactionNoteAuthorAuthorReferencePatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + reactionNoteAuthorAuthorReferencePatient, 'PATIENT', function (resReactionNoteAuthorAuthorReferencePatient) {
													if (resReactionNoteAuthorAuthorReferencePatient.err_code > 0) {
														myEmitter.emit('checkReactionNoteAuthorAuthorReferencePractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reaction note author author reference patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReactionNoteAuthorAuthorReferencePractitioner');
											}
										})

										if (!validator.isEmpty(reactionNoteAuthorAuthorReferenceRelatedPerson)) {
											checkUniqeValue(apikey, "RELATED_PERSON_ID|" + reactionNoteAuthorAuthorReferenceRelatedPerson, 'RELATED_PERSON', function (resReactionNoteAuthorAuthorReferenceRelatedPerson) {
												if (resReactionNoteAuthorAuthorReferenceRelatedPerson.err_code > 0) {
													myEmitter.emit('checkReactionNoteAuthorAuthorReferencePatient');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Reaction note author author reference related person id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkReactionNoteAuthorAuthorReferencePatient');
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
			var allergyIntoleranceId = req.params.allergy_intolerance_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof allergyIntoleranceId !== 'undefined'){
				if(validator.isEmpty(allergyIntoleranceId)){
					err_code = 2;
					err_msg = "Allergy Intolerance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Allergy Intolerance id is required";
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
												checkUniqeValue(apikey, "ALLERGY_INTOLERANCE_ID|" + allergyIntoleranceId, 'ALLERGY_INTOLERANCE', function(resAllergyIntoleranceID){
													if(resAllergyIntoleranceID.err_code > 0){
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
																							"allergy_intolerance_id": allergyIntoleranceId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Allergy Intolerance.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "AllergyIntolerance Id not found"});		
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
		allergyIntoleranceReaction: function addAllergyIntoleranceReaction(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var allergyIntoleranceId = req.params.allergy_intolerance_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof allergyIntoleranceId !== 'undefined'){
				if(validator.isEmpty(allergyIntoleranceId)){
					err_code = 2;
					err_msg = "Allergy Intolerance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Allergy Intolerance id is required";
			}

			if(typeof req.body.substance !== 'undefined'){
				var reactionSubstance =  req.body.substance.trim().toLowerCase();
				if(validator.isEmpty(reactionSubstance)){
					reactionSubstance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction substance' in json Allergy Intolerance request.";
			}

			if(typeof req.body.manifestation !== 'undefined'){
				var reactionManifestation =  req.body.manifestation.trim().toLowerCase();
				if(validator.isEmpty(reactionManifestation)){
					err_code = 2;
					err_msg = "Allergy Intolerance reaction manifestation is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction manifestation' in json Allergy Intolerance request.";
			}

			if(typeof req.body.description !== 'undefined'){
				var reactionDescription =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(reactionDescription)){
					reactionDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction description' in json Allergy Intolerance request.";
			}

			if(typeof req.body.onset !== 'undefined'){
				var reactionOnset =  req.body.onset;
				if(validator.isEmpty(reactionOnset)){
					reactionOnset = "";
				}else{
					if(!regex.test(reactionOnset)){
						err_code = 2;
						err_msg = "Allergy Intolerance reaction onset invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction onset' in json Allergy Intolerance request.";
			}

			if(typeof req.body.severity !== 'undefined'){
				var reactionSeverity =  req.body.severity.trim().toLowerCase();
				if(validator.isEmpty(reactionSeverity)){
					reactionSeverity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction severity' in json Allergy Intolerance request.";
			}

			if(typeof req.body.exposureRoute !== 'undefined'){
				var reactionExposureRoute =  req.body.exposureRoute.trim().toLowerCase();
				if(validator.isEmpty(reactionExposureRoute)){
					reactionExposureRoute = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction exposure route' in json Allergy Intolerance request.";
			}
			
			/*if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var reactionNoteAuthorAuthorReferencePractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(reactionNoteAuthorAuthorReferencePractitioner)){
					reactionNoteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction note author author reference practitioner' in json Allergy Intolerance request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var reactionNoteAuthorAuthorReferencePatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(reactionNoteAuthorAuthorReferencePatient)){
					reactionNoteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction note author author reference patient' in json Allergy Intolerance request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var reactionNoteAuthorAuthorReferenceRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(reactionNoteAuthorAuthorReferenceRelatedPerson)){
					reactionNoteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction note author author reference related person' in json Allergy Intolerance request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var reactionNoteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(reactionNoteAuthorAuthorString)){
					reactionNoteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction note author author string' in json Allergy Intolerance request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var reactionNoteTime =  req.body.note.time;
				if(validator.isEmpty(reactionNoteTime)){
					reactionNoteTime = "";
				}else{
					if(!regex.test(reactionNoteTime)){
						err_code = 2;
						err_msg = "Allergy Intolerance reaction note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction note time' in json Allergy Intolerance request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var reactionNoteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(reactionNoteText)){
					reactionNoteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction note.text' in json Allergy Intolerance request.";
			}*/

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkAllergyIntoleranceID', function(){
							checkUniqeValue(apikey, "Allergy_Intolerance_ID|" + allergyIntoleranceId, 'Allergy_Intolerance', function(resAllergyIntoleranceID){
								if(resAllergyIntoleranceID.err_code > 0){
									var unicId = uniqid.time();
									var allergyIntoleranceReactionId = 'air' + unicId;
									//AllergyIntoleranceReaction
									dataAllergyIntoleranceReaction = {
														"id" : allergyIntoleranceReactionId,
														"substance" : reactionSubstance,
														"manifestation" : reactionManifestation,
														"description" : reactionDescription,
														"onset" : reactionOnset,
														"severity" : reactionSeverity,
														"exposureroute" : reactionExposureRoute,
														"allergy_intolerance_id" : allergyIntoleranceId
													}
									ApiFHIR.post('allergyIntoleranceReaction', {"apikey": apikey}, {body: dataAllergyIntoleranceReaction, json: true}, function(error, response, body){
										allergyIntoleranceReaction = body;
										if(allergyIntoleranceReaction.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Allergy Intolerance Reaction has been add in this Allergy Intolerance.", "data": allergyIntoleranceReaction.data});
										}else{
											res.json(allergyIntoleranceReaction);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Allergy Intolerance Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkReactionSubstance', function () {
							if (!validator.isEmpty(reactionSubstance)) {
								checkCode(apikey, reactionSubstance, 'SUBSTANCE_CODE', function (resReactionSubstanceCode) {
									if (resReactionSubstanceCode.err_code > 0) {
										myEmitter.emit('checkAllergyIntoleranceID');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "Reaction Substance code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAllergyIntoleranceID');
							}
						})

						myEmitter.prependOnceListener('checkReactionManifestation', function () {
							if (!validator.isEmpty(reactionManifestation)) {
								checkCode(apikey, reactionManifestation, 'CLINICAL_FINDINGS', function (resReactionManifestationCode) {
									if (resReactionManifestationCode.err_code > 0) {
										myEmitter.emit('checkReactionSubstance');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "Reaction Manifestation code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReactionSubstance');
							}
						})

						myEmitter.prependOnceListener('checkReactionSeverity', function () {
							if (!validator.isEmpty(reactionSeverity)) {
								checkCode(apikey, reactionSeverity, 'REACTION_EVENT_SEVERITY', function (resReactionSeverityCode) {
									if (resReactionSeverityCode.err_code > 0) {
										myEmitter.emit('checkReactionManifestation');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "Reaction Severity code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReactionManifestation');
							}
						})
						
						if (!validator.isEmpty(reactionExposureRoute)) {
							checkCode(apikey, reactionExposureRoute, 'ROUTE_CODES', function (resReactionExposureRouteCode) {
								if (resReactionExposureRouteCode.err_code > 0) {
									myEmitter.emit('checkReactionSeverity');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Reaction exposure route code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkReactionSeverity');
						}

						/*myEmitter.prependOnceListener('checkReactionExposureRoute', function () {
							if (!validator.isEmpty(reactionExposureRoute)) {
								checkCode(apikey, reactionExposureRoute, 'ROUTE_CODES', function (resReactionExposureRouteCode) {
									if (resReactionExposureRouteCode.err_code > 0) {
										myEmitter.emit('checkReactionSeverity');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Reaction exposure route code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReactionSeverity');
							}
						})
						
						myEmitter.prependOnceListener('checkReactionNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(reactionNoteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + reactionNoteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resReactionNoteAuthorAuthorReferencePractitioner) {
									if (resReactionNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkReactionExposureRoute');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Reaction note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReactionExposureRoute');
							}
						})

						myEmitter.prependOnceListener('checkReactionNoteAuthorAuthorReferencePatient', function () {
							if (!validator.isEmpty(reactionNoteAuthorAuthorReferencePatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + reactionNoteAuthorAuthorReferencePatient, 'PATIENT', function (resReactionNoteAuthorAuthorReferencePatient) {
									if (resReactionNoteAuthorAuthorReferencePatient.err_code > 0) {
										myEmitter.emit('checkReactionNoteAuthorAuthorReferencePractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Reaction note author author reference patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReactionNoteAuthorAuthorReferencePractitioner');
							}
						})

						if (!validator.isEmpty(reactionNoteAuthorAuthorReferenceRelatedPerson)) {
							checkUniqeValue(apikey, "RELATED_PERSON_ID|" + reactionNoteAuthorAuthorReferenceRelatedPerson, 'RELATED_PERSON', function (resReactionNoteAuthorAuthorReferenceRelatedPerson) {
								if (resReactionNoteAuthorAuthorReferenceRelatedPerson.err_code > 0) {
									myEmitter.emit('checkReactionNoteAuthorAuthorReferencePatient');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Reaction note author author reference related person id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkReactionNoteAuthorAuthorReferencePatient');
						}*/
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		allergyIntoleranceNote: function addAllergyIntoleranceNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var allergyIntoleranceId = req.params.allergy_intolerance_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof allergyIntoleranceId !== 'undefined'){
				if(validator.isEmpty(allergyIntoleranceId)){
					err_code = 2;
					err_msg = "AllergyIntolerance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "AllergyIntolerance id is required";
			}
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Allergy Intolerance request.";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Allergy Intolerance request.";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Allergy Intolerance request.";
			}

			if(typeof req.body.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Allergy Intolerance request.";
			}

			if(typeof req.body.time !== 'undefined'){
				var noteTime =  req.body.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Sequence note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Allergy Intolerance request.";
			}

			if(typeof req.body.text !== 'undefined'){
				var NoteText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(NoteText)){
					NoteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note.text' in json Allergy Intolerance request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkAllergyIntoleranceID', function(){
							checkUniqeValue(apikey, "allergy_intolerance_id|" + allergyIntoleranceId, 'allergy_intolerance', function(resAllergyIntoleranceID){
								if(resAllergyIntoleranceID.err_code > 0){
									var unicId = uniqid.time();
									var allergyIntoleranceNoteId = 'ann' + unicId;
									//AllergyIntoleranceNote
									dataAllergyIntoleranceNote = {
										"id": allergyIntoleranceNoteId,
										"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
										"author_ref_patient": noteAuthorAuthorReferencePatient,
										"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
										"author_string": noteAuthorAuthorString,
										"time": noteTime,
										"text": NoteText,
										"allergy_intolerance_id" : allergyIntoleranceId
									}
									ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataAllergyIntoleranceNote, json: true}, function(error, response, body){
										allergyIntoleranceNote = body;
										if(allergyIntoleranceNote.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Allergy intolerance Note has been add in this Allergy intolerance.", "data": allergyIntoleranceNote.data});
										}else{
											res.json(allergyIntoleranceNote);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "AllergyIntolerance Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkAllergyIntoleranceID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAllergyIntoleranceID');
							}
						})

						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePatient', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + noteAuthorAuthorReferencePatient, 'PATIENT', function (resNoteAuthorAuthorReferencePatient) {
									if (resNoteAuthorAuthorReferencePatient.err_code > 0) {
										myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
							}
						})

						if (!validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)) {
							checkUniqeValue(apikey, "RELATED_PERSON_ID|" + noteAuthorAuthorReferenceRelatedPerson, 'RELATED_PERSON', function (resNoteAuthorAuthorReferenceRelatedPerson) {
								if (resNoteAuthorAuthorReferenceRelatedPerson.err_code > 0) {
									myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Note author author reference related person id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
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
		allergyIntoleranceReactionNote: function addAllergyIntoleranceReactionNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var allergyIntoleranceReactionId = req.params.allergy_intolerance_reaction_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof allergyIntoleranceReactionId !== 'undefined'){
				if(validator.isEmpty(allergyIntoleranceReactionId)){
					err_code = 2;
					err_msg = "AllergyIntoleranceReaction id is required";
				}
			}else{
				err_code = 2;
				err_msg = "AllergyIntoleranceReaction id is required";
			}
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Allergy Intolerance request.";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Allergy Intolerance request.";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Allergy Intolerance request.";
			}

			if(typeof req.body.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Allergy Intolerance request.";
			}

			if(typeof req.body.time !== 'undefined'){
				var noteTime =  req.body.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Sequence note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Allergy Intolerance request.";
			}

			if(typeof req.body.text !== 'undefined'){
				var NoteText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(NoteText)){
					NoteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note.text' in json Allergy Intolerance request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkAllergyIntoleranceReactionID', function(){
							checkUniqeValue(apikey, "allergy_intolerance_reaction_id|" + allergyIntoleranceReactionId, 'allergy_intolerance_reaction', function(resAllergyIntoleranceReactionID){
								if(resAllergyIntoleranceReactionID.err_code > 0){
									var unicId = uniqid.time();
									var allergyIntoleranceReactionNoteId = 'anr' + unicId;
									//AllergyIntoleranceReactionNote
									dataAllergyIntoleranceReactionNote = {
										"id": allergyIntoleranceReactionNoteId,
										"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
										"author_ref_patient": noteAuthorAuthorReferencePatient,
										"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
										"author_string": noteAuthorAuthorString,
										"time": noteTime,
										"text": NoteText,
										"allergy_intolerance_reaction_id" : allergyIntoleranceReactionId
									}
									ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataAllergyIntoleranceReactionNote, json: true}, function(error, response, body){
										allergyIntoleranceReactionNote = body;
										if(allergyIntoleranceReactionNote.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Allergy intolerance reaction Note has been add in this Allergy intolerance reaction.", "data": allergyIntoleranceReactionNote.data});
										}else{
											res.json(allergyIntoleranceReactionNote);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Allergy Intolerance Reaction Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkAllergyIntoleranceReactionID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAllergyIntoleranceReactionID');
							}
						})

						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePatient', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + noteAuthorAuthorReferencePatient, 'PATIENT', function (resNoteAuthorAuthorReferencePatient) {
									if (resNoteAuthorAuthorReferencePatient.err_code > 0) {
										myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
							}
						})

						if (!validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)) {
							checkUniqeValue(apikey, "RELATED_PERSON_ID|" + noteAuthorAuthorReferenceRelatedPerson, 'RELATED_PERSON', function (resNoteAuthorAuthorReferenceRelatedPerson) {
								if (resNoteAuthorAuthorReferenceRelatedPerson.err_code > 0) {
									myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Note author author reference related person id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
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
	},
	put: {
		allergyIntolerance : function putAllergyIntolerance(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var allergyIntoleranceId = req.params.allergy_intolerance_id;

      var err_code = 0;
      var err_msg = "";
      var dataAllergyIntolerance = {};

      if (typeof allergyIntoleranceId !== 'undefined') {
        if (validator.isEmpty(allergyIntoleranceId)) {
          err_code = 2;
          err_msg = "Allergy Intolerance Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Allergy Intolerance Id is required.";
      }
			
			/*clinicalStatus|clinicalStatus||
verificationStatus|verificationStatus||nn
type|type||
category|category||
criticality|criticality||
code|code||
patient|patient||nn
onset.onsetDateTime|onsetOnsetDateTime|date|
onset.onsetAge|onsetOnsetAge||
onset.onsetPeriod|onsetOnsetPeriod|period|
onset.onsetRange|onsetOnsetRange|range|
onset.onsetString|onsetOnsetString||
assertedDate|assertedDate|date|
recorder.practitioner|recorderPractitioner||
recorder.patient|recorderPatient||
asserter.patient|asserterPatient|
asserter.relatedPerson|asserterRelatedPerson|
asserter.practitioner|asserterPractitioner|
lastOccurrence|lastOccurrence|date|*/
			
			/*
			var clinical_status = req.body.clinical_status;
			var verification_status = req.body.verification_status;
			var type = req.body.type;
			var category = req.body.category;
			var criticality = req.body.criticality;
			var code = req.body.code;
			var patient = req.body.patient;
			var onset_date_time = req.body.onset_date_time;
			var onset_age = req.body.onset_age;
			var onset_period_start = req.body.onset_period_start;
			var onset_period_end = req.body.onset_period_end;
			var onset_range_low = req.body.onset_range_low;
			var onset_range_high = req.body.onset_range_high;
			var onset_string = req.body.onset_string;
			var asserted_date = req.body.asserted_date;
			var recorder_practitioner = req.body.recorder_practitioner;
			var recorder_patient = req.body.recorder_patient;
			var asserter_patient = req.body.asserter_patient;
			var asserter_related_person = req.body.asserter_related_person;
			var asserter_practitioner = req.body.asserter_practitioner;
			var last_occurrence = req.body.last_occurrence;
			*/
			if(typeof req.body.clinicalStatus !== 'undefined' && req.body.clinicalStatus !== ""){
				var clinicalStatus =  req.body.clinicalStatus.trim().toLowerCase();
				if(validator.isEmpty(clinicalStatus)){
					dataAllergyIntolerance.clinical_status = "";
				}else{
					dataAllergyIntolerance.clinical_status = clinicalStatus;
				}
			}else{
			  clinicalStatus = "";
			}

			if(typeof req.body.verificationStatus !== 'undefined' && req.body.verificationStatus !== ""){
				var verificationStatus =  req.body.verificationStatus.trim().toLowerCase();
				if(validator.isEmpty(verificationStatus)){
					err_code = 2;
					err_msg = "allergy intolerance verification status is required.";
				}else{
					dataAllergyIntolerance.verification_status = verificationStatus;
				}
			}else{
			  verificationStatus = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					dataAllergyIntolerance.type = "";
				}else{
					dataAllergyIntolerance.type = type;
				}
			}else{
			  type = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					dataAllergyIntolerance.category = "";
				}else{
					dataAllergyIntolerance.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.criticality !== 'undefined' && req.body.criticality !== ""){
				var criticality =  req.body.criticality.trim().toLowerCase();
				if(validator.isEmpty(criticality)){
					dataAllergyIntolerance.criticality = "";
				}else{
					dataAllergyIntolerance.criticality = criticality;
				}
			}else{
			  criticality = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					dataAllergyIntolerance.code = "";
				}else{
					dataAllergyIntolerance.code = code;
				}
			}else{
			  code = "";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					err_code = 2;
					err_msg = "allergy intolerance patient is required.";
				}else{
					dataAllergyIntolerance.patient = patient;
				}
			}else{
			  patient = "";
			}

			if(typeof req.body.onset.onsetDateTime !== 'undefined' && req.body.onset.onsetDateTime !== ""){
				var onsetOnsetDateTime =  req.body.onset.onsetDateTime;
				if(validator.isEmpty(onsetOnsetDateTime)){
					err_code = 2;
					err_msg = "allergy intolerance onset onset date time is required.";
				}else{
					if(!regex.test(onsetOnsetDateTime)){
						err_code = 2;
						err_msg = "allergy intolerance onset onset date time invalid date format.";	
					}else{
						dataAllergyIntolerance.onset_date_time = onsetOnsetDateTime;
					}
				}
			}else{
			  onsetOnsetDateTime = "";
			}

			if(typeof req.body.onset.onsetAge !== 'undefined' && req.body.onset.onsetAge !== ""){
				var onsetOnsetAge =  req.body.onset.onsetAge.trim().toLowerCase();
				if(validator.isEmpty(onsetOnsetAge)){
					dataAllergyIntolerance.onset_age = "";
				}else{
					dataAllergyIntolerance.onset_age = onsetOnsetAge;
				}
			}else{
			  onsetOnsetAge = "";
			}

			if (typeof req.body.onset.onsetPeriod !== 'undefined' && req.body.onset.onsetPeriod !== "") {
			  var onsetOnsetPeriod = req.body.onset.onsetPeriod;
			  if (onsetOnsetPeriod.indexOf("to") > 0) {
			    arrOnsetOnsetPeriod = onsetOnsetPeriod.split("to");
			    dataAllergyIntolerance.onset_period_start = arrOnsetOnsetPeriod[0];
			    dataAllergyIntolerance.onset_period_end = arrOnsetOnsetPeriod[1];
			    if (!regex.test(onsetOnsetPeriodStart) && !regex.test(onsetOnsetPeriodEnd)) {
			      err_code = 2;
			      err_msg = "allergy intolerance onset onset period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "allergy intolerance onset onset period invalid date format.";
				}
			} else {
			  onsetOnsetPeriod = "";
			}

			if (typeof req.body.onset.onsetRange !== 'undefined' && req.body.onset.onsetRange !== "") {
			  var onsetOnsetRange = req.body.onset.onsetRange;
			  if (onsetOnsetRange.indexOf("to") > 0) {
			    arrOnsetOnsetRange = onsetOnsetRange.split("to");
			    dataAllergyIntolerance.onset_range_low = arrOnsetOnsetRange[0];
			    dataAllergyIntolerance.onset_range_high = arrOnsetOnsetRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "allergy intolerance onset onset range invalid range format.";
				}
			} else {
			  onsetOnsetRange = "";
			}

			if(typeof req.body.onset.onsetString !== 'undefined' && req.body.onset.onsetString !== ""){
				var onsetOnsetString =  req.body.onset.onsetString.trim().toLowerCase();
				if(validator.isEmpty(onsetOnsetString)){
					dataAllergyIntolerance.onset_string = "";
				}else{
					dataAllergyIntolerance.onset_string = onsetOnsetString;
				}
			}else{
			  onsetOnsetString = "";
			}

			if(typeof req.body.assertedDate !== 'undefined' && req.body.assertedDate !== ""){
				var assertedDate =  req.body.assertedDate;
				if(validator.isEmpty(assertedDate)){
					err_code = 2;
					err_msg = "allergy intolerance asserted date is required.";
				}else{
					if(!regex.test(assertedDate)){
						err_code = 2;
						err_msg = "allergy intolerance asserted date invalid date format.";	
					}else{
						dataAllergyIntolerance.asserted_date = assertedDate;
					}
				}
			}else{
			  assertedDate = "";
			}

			if(typeof req.body.recorder.practitioner !== 'undefined' && req.body.recorder.practitioner !== ""){
				var recorderPractitioner =  req.body.recorder.practitioner.trim().toLowerCase();
				if(validator.isEmpty(recorderPractitioner)){
					dataAllergyIntolerance.recorder_practitioner = "";
				}else{
					dataAllergyIntolerance.recorder_practitioner = recorderPractitioner;
				}
			}else{
			  recorderPractitioner = "";
			}

			if(typeof req.body.recorder.patient !== 'undefined' && req.body.recorder.patient !== ""){
				var recorderPatient =  req.body.recorder.patient.trim().toLowerCase();
				if(validator.isEmpty(recorderPatient)){
					dataAllergyIntolerance.recorder_patient = "";
				}else{
					dataAllergyIntolerance.recorder_patient = recorderPatient;
				}
			}else{
			  recorderPatient = "";
			}

			if(typeof req.body.asserter.patient !== 'undefined' && req.body.asserter.patient !== ""){
				var asserterPatient =  req.body.asserter.patient.trim().toLowerCase();
				if(validator.isEmpty(asserterPatient)){
					dataAllergyIntolerance.asserter_patient = "";
				}else{
					dataAllergyIntolerance.asserter_patient = asserterPatient;
				}
			}else{
			  asserterPatient = "";
			}

			if(typeof req.body.asserter.relatedPerson !== 'undefined' && req.body.asserter.relatedPerson !== ""){
				var asserterRelatedPerson =  req.body.asserter.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(asserterRelatedPerson)){
					dataAllergyIntolerance.asserter_related_person = "";
				}else{
					dataAllergyIntolerance.asserter_related_person = asserterRelatedPerson;
				}
			}else{
			  asserterRelatedPerson = "";
			}

			if(typeof req.body.asserter.practitioner !== 'undefined' && req.body.asserter.practitioner !== ""){
				var asserterPractitioner =  req.body.asserter.practitioner.trim().toLowerCase();
				if(validator.isEmpty(asserterPractitioner)){
					dataAllergyIntolerance.asserter_practitioner = "";
				}else{
					dataAllergyIntolerance.asserter_practitioner = asserterPractitioner;
				}
			}else{
			  asserterPractitioner = "";
			}

			if(typeof req.body.lastOccurrence !== 'undefined' && req.body.lastOccurrence !== ""){
				var lastOccurrence =  req.body.lastOccurrence;
				if(validator.isEmpty(lastOccurrence)){
					err_code = 2;
					err_msg = "allergy intolerance last occurrence is required.";
				}else{
					if(!regex.test(lastOccurrence)){
						err_code = 2;
						err_msg = "allergy intolerance last occurrence invalid date format.";	
					}else{
						dataAllergyIntolerance.last_occurrence = lastOccurrence;
					}
				}
			}else{
			  lastOccurrence = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	

										//event emiter
						myEmitter.prependOnceListener('checkAllergyIntoleranceId', function(){
							checkUniqeValue(apikey, "ALLERGY_INTOLERANCE_ID|" + allergyIntoleranceId, 'ALLERGY_INTOLERANCE', function(resAllergyIntoleranceId){
								if(resAllergyIntoleranceId.err_code > 0){
									ApiFHIR.put('allergyIntolerance', {"apikey": apikey, "_id": allergyIntoleranceId}, {body: dataAllergyIntolerance, json: true}, function(error, response, body){
										allergyIntolerance = body;
										if(allergyIntolerance.err_code > 0){
											res.json(allergyIntolerance);	
										}else{
											res.json({"err_code": 0, "err_msg": "Allergy Intolerance has been update.", "data": [{"_id": allergyIntoleranceId}]});
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Allergy Intolerance Id not found"});		
								}
							})
						})
										
						myEmitter.prependOnceListener('checkClinicalStatus', function () {
							if (!validator.isEmpty(clinicalStatus)) {
								checkCode(apikey, clinicalStatus, 'ALLERGY_CLINICAL_STATUS', function (resClinicalStatusCode) {
									if (resClinicalStatusCode.err_code > 0) {
										myEmitter.emit('checkAllergyIntoleranceId');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "Clinical Status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAllergyIntoleranceId');
							}
						})

						myEmitter.prependOnceListener('checkVerificationStatus', function () {
							if (!validator.isEmpty(verificationStatus)) {
								checkCode(apikey, verificationStatus, 'ALLERGY_VERIFICATION_STATUS', function (resVerificationStatusCode) {
									if (resVerificationStatusCode.err_code > 0) {
										myEmitter.emit('checkClinicalStatus');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "Verification Status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClinicalStatus');
							}
						})

						myEmitter.prependOnceListener('checkType', function () {
							if (!validator.isEmpty(type)) {
								checkCode(apikey, type, 'ALLERGY_INTOLERANCE_TYPE', function (resTypeCode) {
									if (resTypeCode.err_code > 0) {
										myEmitter.emit('checkVerificationStatus');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "Type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkVerificationStatus');
							}
						})

						myEmitter.prependOnceListener('checkCategory', function () {
							if (!validator.isEmpty(category)) {
								checkCode(apikey, category, 'ALLERGY_INTOLERANCE_CATEGORY', function (resCategoryCode) {
									if (resCategoryCode.err_code > 0) {
										myEmitter.emit('checkType');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "Category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkType');
							}
						})

						myEmitter.prependOnceListener('checkCriticality', function () {
							if (!validator.isEmpty(criticality)) {
								checkCode(apikey, criticality, 'ALLERGY_INTOLERANCE_CRITICALITY', function (resCriticalityCode) {
									if (resCriticalityCode.err_code > 0) {
										myEmitter.emit('checkCategory');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "Criticality code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCategory');
							}
						})

						myEmitter.prependOnceListener('checkCode', function () {
							if (!validator.isEmpty(code)) {
								checkCode(apikey, code, 'ALLERGY_INTOLERANCE_CODE', function (resCodeCode) {
									if (resCodeCode.err_code > 0) {
										myEmitter.emit('checkCriticality');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "Code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCriticality');
							}
						})

						myEmitter.prependOnceListener('checkRecorderPractitioner', function () {
							if (!validator.isEmpty(recorderPractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + recorderPractitioner, 'PRACTITIONER', function (resRecorderPractitioner) {
									if (resRecorderPractitioner.err_code > 0) {
										myEmitter.emit('checkCode');
									} else {
										res.json({
											"err_code": "527",
											"err_msg": "Recorder Practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCode');
							}
						})

						myEmitter.prependOnceListener('checkRecorderPatient', function () {
							if (!validator.isEmpty(recorderPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + recorderPatient, 'PATIENT', function (resRecorderPatient) {
									if (resRecorderPatient.err_code > 0) {
										myEmitter.emit('checkRecorderPractitioner');
									} else {
										res.json({
											"err_code": "527",
											"err_msg": "Recorder Patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRecorderPractitioner');
							}
						})

						myEmitter.prependOnceListener('checkAsserterPatient', function () {
							if (!validator.isEmpty(asserterPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + asserterPatient, 'PATIENT', function (resAsserterPatient) {
									if (resAsserterPatient.err_code > 0) {
										myEmitter.emit('checkRecorderPatient');
									} else {
										res.json({
											"err_code": "527",
											"err_msg": "Asserter Patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRecorderPatient');
							}
						})

						myEmitter.prependOnceListener('checkAsserterRelatedPerson', function () {
							if (!validator.isEmpty(asserterRelatedPerson)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + asserterRelatedPerson, 'RELATED_PERSON', function (resAsserterRelatedPerson) {
									if (resAsserterRelatedPerson.err_code > 0) {
										myEmitter.emit('checkAsserterPatient');
									} else {
										res.json({
											"err_code": "527",
											"err_msg": "Asserter Related Person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAsserterPatient');
							}
						})

						myEmitter.prependOnceListener('checkAsserterPractitioner', function () {
							if (!validator.isEmpty(asserterPractitioner)) {
								checkUniqeValue(apikey, "Practitioner_ID|" + asserterPractitioner, 'Practitioner', function (resAsserterPractitioner) {
									if (resAsserterPractitioner.err_code > 0) {
										myEmitter.emit('checkAsserterRelatedPerson');
									} else {
										res.json({
											"err_code": "527",
											"err_msg": "Asserter Practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAsserterRelatedPerson');
							}
						})

						if (!validator.isEmpty(patient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
								if (resPatient.err_code > 0) {
									myEmitter.emit('checkAsserterPractitioner');
								} else {
									res.json({
										"err_code": "503",
										"err_msg": "Patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkAsserterPractitioner');
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
			var allergyIntoleranceId = req.params.allergy_intolerance_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof allergyIntoleranceId !== 'undefined'){
				if(validator.isEmpty(allergyIntoleranceId)){
					err_code = 2;
					err_msg = "Allergy Intolerance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Allergy Intolerance id is required";
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
						myEmitter.prependOnceListener('checkAllergyIntoleranceID', function(){
							checkUniqeValue(apikey, "ALLERGY_INTOLERANCE_ID|" + allergyIntoleranceId, 'ALLERGY_INTOLERANCE', function(resAllergyIntoleranceID){
								if(resAllergyIntoleranceID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "ALLERGY_INTOLERANCE_ID|"+allergyIntoleranceId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Allergy Intolerance.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Allergy Intolerance Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkAllergyIntoleranceID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkAllergyIntoleranceID');				
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
		allergyIntoleranceReaction: function updateAllergyIntoleranceReaction(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var allergyIntoleranceId = req.params.allergy_intolerance_id;
			var allergyIntoleranceReactionId = req.params.allergy_intolerance_reaction_id;

			var err_code = 0;
			var err_msg = "";
			var dataAllergyIntolerance = {};
			//input check 
			if(typeof allergyIntoleranceId !== 'undefined'){
				if(validator.isEmpty(allergyIntoleranceId)){
					err_code = 2;
					err_msg = "Allergy Intolerance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Allergy Intolerance id is required";
			}

			if(typeof allergyIntoleranceReactionId !== 'undefined'){
				if(validator.isEmpty(allergyIntoleranceReactionId)){
					err_code = 2;
					err_msg = "Allergy Intolerance Reaction id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Allergy Intolerance Reaction id is required";
			}
			
			if(typeof req.body.substance !== 'undefined' && req.body.substance !== ""){
				var reactionSubstance =  req.body.substance.trim().toLowerCase();
				if(validator.isEmpty(reactionSubstance)){
					dataAllergyIntolerance.substance = "";
				}else{
					dataAllergyIntolerance.substance = reactionSubstance;
				}
			}else{
			  reactionSubstance = "";
			}

			if(typeof req.body.manifestation !== 'undefined' && req.body.manifestation !== ""){
				var reactionManifestation =  req.body.manifestation.trim().toLowerCase();
				if(validator.isEmpty(reactionManifestation)){
					err_code = 2;
					err_msg = "allergy intolerance reaction manifestation is required.";
				}else{
					dataAllergyIntolerance.manifestation = reactionManifestation;
				}
			}else{
			  reactionManifestation = "";
			}

			if(typeof req.body.description !== 'undefined' && req.body.description !== ""){
				var reactionDescription =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(reactionDescription)){
					dataAllergyIntolerance.description = "";
				}else{
					dataAllergyIntolerance.description = reactionDescription;
				}
			}else{
			  reactionDescription = "";
			}

			if(typeof req.body.onset !== 'undefined' && req.body.onset !== ""){
				var reactionOnset =  req.body.onset;
				if(validator.isEmpty(reactionOnset)){
					err_code = 2;
					err_msg = "allergy intolerance reaction onset is required.";
				}else{
					if(!regex.test(reactionOnset)){
						err_code = 2;
						err_msg = "allergy intolerance reaction onset invalid date format.";	
					}else{
						dataAllergyIntolerance.onset = reactionOnset;
					}
				}
			}else{
			  reactionOnset = "";
			}

			if(typeof req.body.severity !== 'undefined' && req.body.severity !== ""){
				var reactionSeverity =  req.body.severity.trim().toLowerCase();
				if(validator.isEmpty(reactionSeverity)){
					dataAllergyIntolerance.severity = "";
				}else{
					dataAllergyIntolerance.severity = reactionSeverity;
				}
			}else{
			  reactionSeverity = "";
			}

			if(typeof req.body.exposureRoute !== 'undefined' && req.body.exposureRoute !== ""){
				var reactionExposureRoute =  req.body.exposureRoute.trim().toLowerCase();
				if(validator.isEmpty(reactionExposureRoute)){
					dataAllergyIntolerance.exposure_route = "";
				}else{
					dataAllergyIntolerance.exposure_route = reactionExposureRoute;
				}
			}else{
			  reactionExposureRoute = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkAllergyIntoleranceID', function(){
							checkUniqeValue(apikey, "ALLERGY_INTOLERANCE_ID|" + allergyIntoleranceId, 'ALLERGY_INTOLERANCE', function(resAllergyIntoleranceId){
								if(resAllergyIntoleranceId.err_code > 0){
									checkUniqeValue(apikey, "REACTION_ID|" + allergyIntoleranceReactionId, 'ALLERGY_INTOLERANCE_REACTION', function(resAllergyIntoleranceReactionID){
										if(resAllergyIntoleranceReactionID.err_code > 0){
											ApiFHIR.put('allergyIntoleranceReaction', {"apikey": apikey, "_id": allergyIntoleranceReactionId, "dr": "ALLERGY_INTOLERANCE_ID|"+allergyIntoleranceId}, {body: dataAllergyIntolerance, json: true}, function(error, response, body){
												allergyIntoleranceReaction = body;
												if(allergyIntoleranceReaction.err_code > 0){
													res.json(allergyIntoleranceReaction);	
												}else{
													res.json({"err_code": 0, "err_msg": "Allergy Intolerance Reaction has been update in this Allergy Intolerance.", "data": allergyIntoleranceReaction.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Allergy Intolerance Reaction Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Allergy Intolerance Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkReactionSubstance', function () {
							if (!validator.isEmpty(reactionSubstance)) {
								checkCode(apikey, reactionSubstance, 'SUBSTANCE_CODE', function (resReactionSubstanceCode) {
									if (resReactionSubstanceCode.err_code > 0) {
										myEmitter.emit('checkAllergyIntoleranceID');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "Reaction Substance code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAllergyIntoleranceID');
							}
						})

						myEmitter.prependOnceListener('checkReactionManifestation', function () {
							if (!validator.isEmpty(reactionManifestation)) {
								checkCode(apikey, reactionManifestation, 'CLINICAL_FINDINGS', function (resReactionManifestationCode) {
									if (resReactionManifestationCode.err_code > 0) {
										myEmitter.emit('checkReactionSubstance');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "Reaction Manifestation code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReactionSubstance');
							}
						})

						myEmitter.prependOnceListener('checkReactionSeverity', function () {
							if (!validator.isEmpty(reactionSeverity)) {
								checkCode(apikey, reactionSeverity, 'REACTION_EVENT_SEVERITY', function (resReactionSeverityCode) {
									if (resReactionSeverityCode.err_code > 0) {
										myEmitter.emit('checkReactionManifestation');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "Reaction Severity code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReactionManifestation');
							}
						})

						if (!validator.isEmpty(reactionExposureRoute)) {
							checkCode(apikey, reactionExposureRoute, 'ROUTE_CODES', function (resReactionExposureRouteCode) {
								if (resReactionExposureRouteCode.err_code > 0) {
									myEmitter.emit('checkReactionSeverity');
								} else {
									res.json({
										"err_code": "522",
										"err_msg": "Reaction Exposure Route code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkReactionSeverity');
						}

						/*---------*/
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		allergyIntoleranceNote: function updateAllergyIntoleranceNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var allergyIntoleranceId = req.params.allergy_intolerance_id;
			var allergyIntoleranceNoteId = req.params.allergy_intolerance_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataAllergyIntolerance = {};
			//input check 
			if(typeof allergyIntoleranceId !== 'undefined'){
				if(validator.isEmpty(allergyIntoleranceId)){
					err_code = 2;
					err_msg = "Allergy Intolerance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Allergy Intolerance id is required";
			}

			if(typeof allergyIntoleranceNoteId !== 'undefined'){
				if(validator.isEmpty(allergyIntoleranceNoteId)){
					err_code = 2;
					err_msg = "Allergy Intolerance Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Allergy Intolerance Note id is required";
			}
			
			/*
			"id": allergyIntoleranceNoteId,
			"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
			"author_ref_patient": noteAuthorAuthorReferencePatient,
			"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
			"author_string": noteAuthorAuthorString,
			"time": noteTime,
			"text": NoteText,
			*/
			
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined' && req.body.author.authorReference.practitioner !== ""){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					dataSequence.author_ref_practitioner = "";
				}else{
					dataSequence.author_ref_practitioner = noteAuthorAuthorReferencePractitioner;
				}
			}else{
			  noteAuthorAuthorReferencePractitioner = "";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined' && req.body.author.authorReference.patient !== ""){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					dataSequence.author_ref_patient = "";
				}else{
					dataSequence.author_ref_patient = noteAuthorAuthorReferencePatient;
				}
			}else{
			  noteAuthorAuthorReferencePatient = "";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined' && req.body.author.authorReference.relatedPerson !== ""){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					dataSequence.author_ref_related_person = "";
				}else{
					dataSequence.author_ref_related_person = noteAuthorAuthorReferenceRelatedPerson;
				}
			}else{
			  noteAuthorAuthorReferenceRelatedPerson = "";
			}

			if(typeof req.body.author.authorString !== 'undefined' && req.body.author.authorString !== ""){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					dataSequence.author_string = "";
				}else{
					dataSequence.author_string = noteAuthorAuthorString;
				}
			}else{
			  noteAuthorAuthorString = "";
			}

			if(typeof req.body.time !== 'undefined' && req.body.time !== ""){
				var noteTime =  req.body.time;
				if(validator.isEmpty(noteTime)){
					err_code = 2;
					err_msg = "Allergy Intolerance note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Allergy Intolerance note time invalid date format.";	
					}else{
						dataSequence.time = noteTime;
					}
				}
			}else{
			  noteTime = "";
			}

			if(typeof req.body.text !== 'undefined' && req.body.text !== ""){
				var NoteText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(NoteText)){
					dataSequence.text = "";
				}else{
					dataSequence.text = NoteText;
				}
			}else{
			  NoteText = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkAllergyIntoleranceID', function(){
							checkUniqeValue(apikey, "allergy_intolerance_id|" + allergyIntoleranceId, 'allergy_intolerance', function(resAllergyIntoleranceId){
								if(resAllergyIntoleranceId.err_code > 0){
									checkUniqeValue(apikey, "NOTE_ID|" + allergyIntoleranceNoteId, 'NOTE', function(resAllergyIntoleranceNoteID){
										if(resAllergyIntoleranceNoteID.err_code > 0){
											ApiFHIR.put('annotation', {"apikey": apikey, "_id": allergyIntoleranceNoteId, "dr": "allergy_intolerance_id|"+allergyIntoleranceId}, {body: dataAllergyIntolerance, json: true}, function(error, response, body){
												allergyIntoleranceNote = body;
												if(allergyIntoleranceNote.err_code > 0){
													res.json(allergyIntoleranceNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Allergy Intolerance Note has been update in this Allergy Intolerance.", "data": allergyIntoleranceNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Allergy Intolerance Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Allergy Intolerance Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkAllergyIntoleranceID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAllergyIntoleranceID');
							}
						})

						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePatient', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + noteAuthorAuthorReferencePatient, 'PATIENT', function (resNoteAuthorAuthorReferencePatient) {
									if (resNoteAuthorAuthorReferencePatient.err_code > 0) {
										myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
							}
						})

						if (!validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)) {
							checkUniqeValue(apikey, "RELATED_PERSON_ID|" + noteAuthorAuthorReferenceRelatedPerson, 'RELATED_PERSON', function (resNoteAuthorAuthorReferenceRelatedPerson) {
								if (resNoteAuthorAuthorReferenceRelatedPerson.err_code > 0) {
									myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Note author author reference related person id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
						}
						/*---------*/
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		allergyIntoleranceReactionNote: function updateAllergyIntoleranceReactionNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var allergyIntoleranceReactionId = req.params.allergy_intolerance_reaction_id;
			var allergyIntoleranceReactionNoteId = req.params.allergy_intolerance_reaction_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataAllergyIntoleranceReaction = {};
			//input check 
			if(typeof allergyIntoleranceReactionId !== 'undefined'){
				if(validator.isEmpty(allergyIntoleranceReactionId)){
					err_code = 2;
					err_msg = "Allergy Intolerance Reaction id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Allergy Intolerance Reaction id is required";
			}

			if(typeof allergyIntoleranceReactionNoteId !== 'undefined'){
				if(validator.isEmpty(allergyIntoleranceReactionNoteId)){
					err_code = 2;
					err_msg = "Allergy Intolerance Reaction  Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Allergy Intolerance Reaction Note id is required";
			}
			
			/*
			"id": allergyIntoleranceReactionNoteId,
			"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
			"author_ref_patient": noteAuthorAuthorReferencePatient,
			"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
			"author_string": noteAuthorAuthorString,
			"time": noteTime,
			"text": NoteText,
			*/
			
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined' && req.body.author.authorReference.practitioner !== ""){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					dataSequence.author_ref_practitioner = "";
				}else{
					dataSequence.author_ref_practitioner = noteAuthorAuthorReferencePractitioner;
				}
			}else{
			  noteAuthorAuthorReferencePractitioner = "";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined' && req.body.author.authorReference.patient !== ""){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					dataSequence.author_ref_patient = "";
				}else{
					dataSequence.author_ref_patient = noteAuthorAuthorReferencePatient;
				}
			}else{
			  noteAuthorAuthorReferencePatient = "";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined' && req.body.author.authorReference.relatedPerson !== ""){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					dataSequence.author_ref_related_person = "";
				}else{
					dataSequence.author_ref_related_person = noteAuthorAuthorReferenceRelatedPerson;
				}
			}else{
			  noteAuthorAuthorReferenceRelatedPerson = "";
			}

			if(typeof req.body.author.authorString !== 'undefined' && req.body.author.authorString !== ""){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					dataSequence.author_string = "";
				}else{
					dataSequence.author_string = noteAuthorAuthorString;
				}
			}else{
			  noteAuthorAuthorString = "";
			}

			if(typeof req.body.time !== 'undefined' && req.body.time !== ""){
				var noteTime =  req.body.time;
				if(validator.isEmpty(noteTime)){
					err_code = 2;
					err_msg = "Allergy Intolerance note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Allergy Intolerance note time invalid date format.";	
					}else{
						dataSequence.time = noteTime;
					}
				}
			}else{
			  noteTime = "";
			}

			if(typeof req.body.text !== 'undefined' && req.body.text !== ""){
				var NoteText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(NoteText)){
					dataSequence.text = "";
				}else{
					dataSequence.text = NoteText;
				}
			}else{
			  NoteText = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkAllergyIntoleranceReactionID', function(){
							checkUniqeValue(apikey, "allergy_intolerance_reaction_id|" + allergyIntoleranceReactionId, 'allergy_intolerance_reaction', function(resAllergyIntoleranceReactionId){
								if(resAllergyIntoleranceReactionId.err_code > 0){
									checkUniqeValue(apikey, "NOTE_ID|" + allergyIntoleranceReactionNoteId, 'NOTE', function(resAllergyIntoleranceReactionNoteID){
										if(resAllergyIntoleranceReactionNoteID.err_code > 0){
											ApiFHIR.put('annotation', {"apikey": apikey, "_id": allergyIntoleranceReactionNoteId, "dr": "allergy_intolerance_reaction_id|"+allergyIntoleranceReactionId}, {body: dataAllergyIntoleranceReaction, json: true}, function(error, response, body){
												allergyIntoleranceReactionNote = body;
												if(allergyIntoleranceReactionNote.err_code > 0){
													res.json(allergyIntoleranceReactionNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Allergy Intolerance Reaction Note has been update in this Allergy Intolerance.", "data": allergyIntoleranceReactionNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Allergy Intolerance Reaction Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Allergy Intolerance Reaction Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkAllergyIntoleranceReactionID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAllergyIntoleranceReactionID');
							}
						})

						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePatient', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + noteAuthorAuthorReferencePatient, 'PATIENT', function (resNoteAuthorAuthorReferencePatient) {
									if (resNoteAuthorAuthorReferencePatient.err_code > 0) {
										myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkNoteAuthorAuthorReferencePractitioner');
							}
						})

						if (!validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)) {
							checkUniqeValue(apikey, "RELATED_PERSON_ID|" + noteAuthorAuthorReferenceRelatedPerson, 'RELATED_PERSON', function (resNoteAuthorAuthorReferenceRelatedPerson) {
								if (resNoteAuthorAuthorReferenceRelatedPerson.err_code > 0) {
									myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Note author author reference related person id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkNoteAuthorAuthorReferencePatient');
						}
						/*---------*/
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