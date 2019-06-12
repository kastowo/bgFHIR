var Apiclient = require('apiclient');
var sha1 = require('sha1');
var validator = require('validator');
var bytes = require('bytes');
var uniqid = require('uniqid');
var yamlconfig = require('yaml-config');
var path = require('path');
var sleep = require('sleep');

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
		immunizationRecommendation : function getImmunizationRecommendation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var immunizationRecommendationId = req.query._id;
			var date = req.query.date;
			var doseNumber = req.query.doseNumber;
			var doseSequence = req.query.doseSequence;
			var identifier = req.query.identifier;
			var information = req.query.information;
			var patient = req.query.patient;
			var status = req.query.status;
			var support = req.query.support;
			var targetDisease = req.query.targetDisease;
			var vaccineType = req.query.vaccineType;
			var offset = req.query.offset;
			var limit = req.query.limit;

			if(typeof immunizationRecommendationId !== 'undefined'){
				if(!validator.isEmpty(immunizationRecommendationId)){
					qString.immunizationRecommendationId = immunizationRecommendationId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Immunization Recommendation Id is required."});
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

			if(typeof doseNumber !== 'undefined'){
				if(!validator.isEmpty(doseNumber)){
					if(isInt(doseNumber)){
						qString.doseNumber = doseNumber;
					}else{
						res.json({"err_code": 1, "err_msg": "dose number is not number."});
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "dose number is empty."});
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

			if(typeof information !== 'undefined'){
				if(!validator.isEmpty(information)){
					qString.information = information; 
				}else{
					res.json({"err_code": 1, "err_msg": "information is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "patient is empty."});
				}
			}

			if(typeof status !== 'undefined'){
				if(!validator.isEmpty(status)){
					qString.status = status; 
				}else{
					res.json({"err_code": 1, "err_msg": "status is empty."});
				}
			}

			if(typeof support !== 'undefined'){
				if(!validator.isEmpty(support)){
					qString.support = support; 
				}else{
					res.json({"err_code": 1, "err_msg": "support is empty."});
				}
			}

			if(typeof targetDisease !== 'undefined'){
				if(!validator.isEmpty(targetDisease)){
					qString.targetDisease = targetDisease; 
				}else{
					res.json({"err_code": 1, "err_msg": "target disease is empty."});
				}
			}

			if(typeof vaccineType !== 'undefined'){
				if(!validator.isEmpty(vaccineType)){
					qString.vaccineType = vaccineType; 
				}else{
					res.json({"err_code": 1, "err_msg": "vaccine type is empty."});
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
				"ImmunizationRecommendation" : {
					"location": "%(apikey)s/ImmunizationRecommendation",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);
console.log("--------------------------------------");
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('ImmunizationRecommendation', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var immunizationRecommendation = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(immunizationRecommendation.err_code == 0){
								//cek jumdata dulu
								if(immunizationRecommendation.data.length > 0){
									newImmunizationRecommendation = [];
									for(i=0; i < immunizationRecommendation.data.length; i++){
										myEmitter.once("getIdentifier", function(immunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation){
											/*console.log(immunizationRecommendation);*/
														//get identifier
														qString = {};
														qString.immunization_recommendation_id = immunizationRecommendation.id;
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
																var objectImmunizationRecommendation = {};
																objectImmunizationRecommendation.resourceType = immunizationRecommendation.resourceType;
																objectImmunizationRecommendation.id = immunizationRecommendation.id;
																objectImmunizationRecommendation.identifier = identifier.data;
																objectImmunizationRecommendation.patient = immunizationRecommendation.patient;
																objectImmunizationRecommendation.recommendation = host + ':' + port + '/' + apikey + '/ImmunizationRecommendation/' +  immunizationRecommendation.id + '/ImmunizationRecommendationRecommendation';
																
																newImmunizationRecommendation[index] = objectImmunizationRecommendation;
																
																if(index == countImmunizationRecommendation -1 ){
																	res.json({"err_code": 0, "data":newImmunizationRecommendation});
																}
															}else{
																res.json(identifier);
															}
														})
													})
										myEmitter.emit("getIdentifier", immunizationRecommendation.data[i], i, newImmunizationRecommendation, immunizationRecommendation.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Immunization Recommendation is empty."});	
								}
							}else{
								res.json(immunizationRecommendation);
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
			var immunizationRecommendationId = req.params.immunization_recommendation_id;
			var identifierId = req.params.identifier_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "IMMUNIZATION_RECOMMENDATION_ID|" + immunizationRecommendationId, 'IMMUNIZATION_RECOMMENDATION', function(resPatientID){
						if(resPatientID.err_code > 0){
							if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
								checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
									if(resIdentifierID.err_code > 0){
										//get identifier
										qString = {};
										qString.immunization_recommendation_id = immunizationRecommendationId;
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
								qString.immunization_recommendation_id = immunizationRecommendationId;
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
							res.json({"err_code": 501, "err_msg": "Immunization Recommendation Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		immunizationRecommendationRecommendation: function getImmunizationRecommendationRecommendation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var immunizationRecommendationId = req.params.immunization_recommendation_id;
			var immunizationRecommendationRecommendationId = req.params.immunization_recommendation_recommendation_id;
			console.log("12345");
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "IMMUNIZATION_RECOMMENDATION_ID|" + immunizationRecommendationId, 'IMMUNIZATION_RECOMMENDATION', function(resPatientID){
						if(resPatientID.err_code > 0){
							if(typeof immunizationRecommendationRecommendationId !== 'undefined' && !validator.isEmpty(immunizationRecommendationRecommendationId)){
								console.log("1");
								checkUniqeValue(apikey, "RECOMMENDATION__ID|" + immunizationRecommendationRecommendationId, 'IMMUNIZATION_RECOMMENDATION_RECOMMENDATION', function(resImmunizationRecommendationRecommendationID){
									if(resImmunizationRecommendationRecommendationID.err_code > 0){
										//get immunizationRecommendationRecommendation
										qString = {};
										qString.immunization_recommendation_id = immunizationRecommendationId;
										qString._id = immunizationRecommendationRecommendationId;
										seedPhoenixFHIR.path.GET = {
											"ImmunizationRecommendationRecommendation" : {
												"location": "%(apikey)s/ImmunizationRecommendationRecommendation",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ImmunizationRecommendationRecommendation', {"apikey": apikey}, {}, function(error, response, body){
											immunizationRecommendationRecommendation = JSON.parse(body);
											if(immunizationRecommendationRecommendation.err_code == 0){
												//res.json({"err_code": 0, "data":immunizationRecommendationRecommendation.data});
												if(immunizationRecommendationRecommendation.data.length > 0){
													newImmunizationRecommendationRecommendation = [];
													for(i=0; i < immunizationRecommendationRecommendation.data.length; i++){
														myEmitter.once('getDateCriterion', function(immunizationRecommendation, index, newImmunizationRecommendationRecommendation, countImmunizationRecommendation){
															qString = {};
															qString.recommendation_id = immunizationRecommendation.id;
															seedPhoenixFHIR.path.GET = {
																"ImmunizationRecommendationDateCriterion" : {
																	"location": "%(apikey)s/ImmunizationRecommendationDateCriterion",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('ImmunizationRecommendationDateCriterion', {"apikey": apikey}, {}, function(error, response, body){
																immunizationRecommendationDateCriterion = JSON.parse(body);
																console.log(immunizationRecommendationDateCriterion);
																if(immunizationRecommendationDateCriterion.err_code == 0){
																	var objectImmunizationRecommendation = {};
																	objectImmunizationRecommendation.id = immunizationRecommendation.id;
																	objectImmunizationRecommendation.date = immunizationRecommendation.date;
																	objectImmunizationRecommendation.vaccineCode = immunizationRecommendation.vaccine_code;
																	objectImmunizationRecommendation.targetDisease = immunizationRecommendation.target_disease;
																	objectImmunizationRecommendation.doseNumber = immunizationRecommendation.dose_number;
																	objectImmunizationRecommendation.forecastStatus = immunizationRecommendation.forecast_status;
																	objectImmunizationRecommendation.dateCriterion = immunizationRecommendationDateCriterion.data;
																	objectImmunizationRecommendation.protocol = immunizationRecommendation.protocol;										

																	newImmunizationRecommendationRecommendation[index] = objectImmunizationRecommendation;

																	myEmitter.once('getImmunizationRecommendationSupportingImmunization', function(immunizationRecommendation, index, newImmunizationRecommendationRecommendation, countImmunizationRecommendation){
																		qString = {};
																		qString.recommendation_id = immunizationRecommendation.id;
																		seedPhoenixFHIR.path.GET = {
																			"ImmunizationRecommendationSupportingImmunization" : {
																				"location": "%(apikey)s/ImmunizationRecommendationSupportingImmunization",
																				"query": qString
																			}
																		}

																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																		ApiFHIR.get('ImmunizationRecommendationSupportingImmunization', {"apikey": apikey}, {}, function(error, response, body){
																			immunizationRecommendationSupportingImmunization = JSON.parse(body);
																			if(immunizationRecommendationSupportingImmunization.err_code == 0){
																				var objectImmunizationRecommendation = {};
																				objectImmunizationRecommendation.id = immunizationRecommendation.id;
																				objectImmunizationRecommendation.date = immunizationRecommendation.date;
																				objectImmunizationRecommendation.vaccineCode = immunizationRecommendation.vaccineCode;
																				objectImmunizationRecommendation.targetDisease = immunizationRecommendation.targetDisease;
																				objectImmunizationRecommendation.doseNumber = immunizationRecommendation.doseNumber;
																				objectImmunizationRecommendation.forecastStatus = immunizationRecommendation.forecastStatus;
																				objectImmunizationRecommendation.dateCriterion = immunizationRecommendation.dateCriterion;
																				objectImmunizationRecommendation.protocol = immunizationRecommendation.protocol;
																				objectImmunizationRecommendation.supportingImmunization = immunizationRecommendationSupportingImmunization.data;

																				newImmunizationRecommendationRecommendation[index] = objectImmunizationRecommendation;

																				myEmitter.once('getImmunizationRecommendationSupportingPatientInformationObservation', function(immunizationRecommendation, index, newImmunizationRecommendationRecommendation, countImmunizationRecommendation){
																					qString = {};
																					qString.recommendation_id = immunizationRecommendation.id;
																					seedPhoenixFHIR.path.GET = {
																						"ImmunizationRecommendationSupportingPatientInformationObservation" : {
																							"location": "%(apikey)s/ImmunizationRecommendationSupportingPatientInformationObservation",
																							"query": qString
																						}
																					}

																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																					ApiFHIR.get('ImmunizationRecommendationSupportingPatientInformationObservation', {"apikey": apikey}, {}, function(error, response, body){
																						immunizationRecommendationSupportingPatientInformationObservation = JSON.parse(body);
																						if(immunizationRecommendationSupportingPatientInformationObservation.err_code == 0){
																							var objectImmunizationRecommendation = {};
																							objectImmunizationRecommendation.id = immunizationRecommendation.id;
																							objectImmunizationRecommendation.date = immunizationRecommendation.date;
																							objectImmunizationRecommendation.vaccineCode = immunizationRecommendation.vaccineCode;
																							objectImmunizationRecommendation.targetDisease = immunizationRecommendation.targetDisease;
																							objectImmunizationRecommendation.doseNumber = immunizationRecommendation.doseNumber;
																							objectImmunizationRecommendation.forecastStatus = immunizationRecommendation.forecastStatus;
																							objectImmunizationRecommendation.dateCriterion = immunizationRecommendation.dateCriterion;
																							objectImmunizationRecommendation.protocol = immunizationRecommendation.protocol;
																							objectImmunizationRecommendation.supportingImmunization = immunizationRecommendation.supportingImmunization;
																							var SupportingPatientInformation	= {};
																							SupportingPatientInformation.observation = immunizationRecommendationSupportingPatientInformationObservation.data;
																							objectImmunizationRecommendation.supportingPatientInformation = SupportingPatientInformation;

																							newImmunizationRecommendationRecommendation[index] = objectImmunizationRecommendation;

																							myEmitter.once('getImmunizationRecommendationSupportingPatientInformationAllergyIntolerance', function(immunizationRecommendation, index, newImmunizationRecommendationRecommendation, countImmunizationRecommendation){
																								qString = {};
																								qString.recommendation_id = immunizationRecommendation.id;
																								seedPhoenixFHIR.path.GET = {
																									"ImmunizationRecommendationSupportingPatientInformationAllergyIntolerance" : {
																										"location": "%(apikey)s/ImmunizationRecommendationSupportingPatientInformationAllergyIntolerance",
																										"query": qString
																									}
																								}

																								var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																								ApiFHIR.get('ImmunizationRecommendationSupportingPatientInformationAllergyIntolerance', {"apikey": apikey}, {}, function(error, response, body){
																									immunizationRecommendationSupportingPatientInformationAllergyIntolerance = JSON.parse(body);
																									if(immunizationRecommendationSupportingPatientInformationAllergyIntolerance.err_code == 0){
																										var objectImmunizationRecommendation = {};
																										objectImmunizationRecommendation.id = immunizationRecommendation.id;
																										objectImmunizationRecommendation.date = immunizationRecommendation.date;
																										objectImmunizationRecommendation.vaccineCode = immunizationRecommendation.vaccineCode;
																										objectImmunizationRecommendation.targetDisease = immunizationRecommendation.targetDisease;
																										objectImmunizationRecommendation.doseNumber = immunizationRecommendation.doseNumber;
																										objectImmunizationRecommendation.forecastStatus = immunizationRecommendation.forecastStatus;
																										objectImmunizationRecommendation.dateCriterion = immunizationRecommendation.dateCriterion;
																										objectImmunizationRecommendation.protocol = immunizationRecommendation.protocol;
																										objectImmunizationRecommendation.supportingImmunization = immunizationRecommendation.supportingImmunization;
																										var SupportingPatientInformation	= {};
																										SupportingPatientInformation.observation = immunizationRecommendation.supportingPatientInformation.observation;
																										SupportingPatientInformation.allergyIntolerance = immunizationRecommendationSupportingPatientInformationAllergyIntolerance.data;
																										objectImmunizationRecommendation.supportingPatientInformation = SupportingPatientInformation;

																										newImmunizationRecommendationRecommendation[index] = objectImmunizationRecommendation;

																										if(index == countImmunizationRecommendation -1 ){
																											res.json({"err_code": 0, "data":newImmunizationRecommendationRecommendation});	
																										}
																									}else{
																										res.json(immunizationRecommendationSupportingPatientInformationAllergyIntolerance);			
																									}
																								})
																							})
																							myEmitter.emit('getImmunizationRecommendationSupportingPatientInformationAllergyIntolerance', objectImmunizationRecommendation, index, newImmunizationRecommendationRecommendation, countImmunizationRecommendation);																						
																						}else{
																							res.json(immunizationRecommendationSupportingPatientInformationObservation);			
																						}
																					})
																				})
																				myEmitter.emit('getImmunizationRecommendationSupportingPatientInformationObservation', objectImmunizationRecommendation, index, newImmunizationRecommendationRecommendation, countImmunizationRecommendation);																			
																			}else{
																				res.json(immunizationRecommendationSupportingImmunization);			
																			}
																		})
																	})

																	myEmitter.emit('getImmunizationRecommendationSupportingImmunization', objectImmunizationRecommendation, index, newImmunizationRecommendationRecommendation, countImmunizationRecommendation);
																}else{
																	res.json(immunizationRecommendationDateCriterion);			
																}
															})
														})
														myEmitter.emit('getDateCriterion', immunizationRecommendationRecommendation.data[i], i, newImmunizationRecommendationRecommendation, immunizationRecommendationRecommendation.data.length);

													}
												}else{
													res.json({"err_code": 2, "err_msg": "Immunization Recommendation is empty."});	
												}
											/*-------------*/
											}else{
												res.json(immunizationRecommendationRecommendation);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Immunization Recommendation Recommendation Id not found"});		
									}
								})
							}else{
								console.log("2");
								//get immunizationRecommendationRecommendation
								qString = {};
								qString.immunization_recommendation_id = immunizationRecommendationId;
								seedPhoenixFHIR.path.GET = {
									"ImmunizationRecommendationRecommendation" : {
										"location": "%(apikey)s/ImmunizationRecommendationRecommendation",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ImmunizationRecommendationRecommendation', {"apikey": apikey}, {}, function(error, response, body){
									immunizationRecommendationRecommendation = JSON.parse(body);
									console.log(immunizationRecommendationRecommendation);
									if(immunizationRecommendationRecommendation.err_code == 0){
												//res.json({"err_code": 0, "data":immunizationRecommendationRecommendation.data});
												if(immunizationRecommendationRecommendation.data.length > 0){
													newImmunizationRecommendationRecommendation = [];
													for(i=0; i < immunizationRecommendationRecommendation.data.length; i++){
														myEmitter.once('getDateCriterion', function(immunizationRecommendation, index, newImmunizationRecommendationRecommendation, countImmunizationRecommendation){
															qString = {};
															qString.recommendation_id = immunizationRecommendation.id;
															seedPhoenixFHIR.path.GET = {
																"ImmunizationRecommendationDateCriterion" : {
																	"location": "%(apikey)s/ImmunizationRecommendationDateCriterion",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('ImmunizationRecommendationDateCriterion', {"apikey": apikey}, {}, function(error, response, body){
																immunizationRecommendationDateCriterion = JSON.parse(body);
																if(immunizationRecommendationDateCriterion.err_code == 0){
																	var objectImmunizationRecommendation = {};
																	objectImmunizationRecommendation.id = immunizationRecommendation.id;
																	objectImmunizationRecommendation.date = immunizationRecommendation.date;
																	objectImmunizationRecommendation.vaccineCode = immunizationRecommendation.vaccine_code;
																	objectImmunizationRecommendation.targetDisease = immunizationRecommendation.target_disease;
																	objectImmunizationRecommendation.doseNumber = immunizationRecommendation.dose_number;
																	objectImmunizationRecommendation.forecastStatus = immunizationRecommendation.forecast_status;
																	objectImmunizationRecommendation.dateCriterion = immunizationRecommendationDateCriterion.data;
																	objectImmunizationRecommendation.protocol = immunizationRecommendation.protocol;										

																	newImmunizationRecommendationRecommendation[index] = objectImmunizationRecommendation;

																	myEmitter.once('getImmunizationRecommendationSupportingImmunization', function(immunizationRecommendation, index, newImmunizationRecommendationRecommendation, countImmunizationRecommendation){
																		qString = {};
																		qString.recommendation_id = immunizationRecommendation.id;
																		seedPhoenixFHIR.path.GET = {
																			"ImmunizationRecommendationSupportingImmunization" : {
																				"location": "%(apikey)s/ImmunizationRecommendationSupportingImmunization",
																				"query": qString
																			}
																		}

																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																		ApiFHIR.get('ImmunizationRecommendationSupportingImmunization', {"apikey": apikey}, {}, function(error, response, body){
																			immunizationRecommendationSupportingImmunization = JSON.parse(body);
																			if(immunizationRecommendationSupportingImmunization.err_code == 0){
																				var objectImmunizationRecommendation = {};
																				objectImmunizationRecommendation.id = immunizationRecommendation.id;
																				objectImmunizationRecommendation.date = immunizationRecommendation.date;
																				objectImmunizationRecommendation.vaccineCode = immunizationRecommendation.vaccineCode;
																				objectImmunizationRecommendation.targetDisease = immunizationRecommendation.targetDisease;
																				objectImmunizationRecommendation.doseNumber = immunizationRecommendation.doseNumber;
																				objectImmunizationRecommendation.forecastStatus = immunizationRecommendation.forecastStatus;
																				objectImmunizationRecommendation.dateCriterion = immunizationRecommendation.dateCriterion;
																				objectImmunizationRecommendation.protocol = immunizationRecommendation.protocol;
																				objectImmunizationRecommendation.supportingImmunization = immunizationRecommendationSupportingImmunization.data;

																				newImmunizationRecommendationRecommendation[index] = objectImmunizationRecommendation;

																				myEmitter.once('getImmunizationRecommendationSupportingPatientInformationObservation', function(immunizationRecommendation, index, newImmunizationRecommendationRecommendation, countImmunizationRecommendation){
																					qString = {};
																					qString.recommendation_id = immunizationRecommendation.id;
																					seedPhoenixFHIR.path.GET = {
																						"ImmunizationRecommendationSupportingPatientInformationObservation" : {
																							"location": "%(apikey)s/ImmunizationRecommendationSupportingPatientInformationObservation",
																							"query": qString
																						}
																					}

																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																					ApiFHIR.get('ImmunizationRecommendationSupportingPatientInformationObservation', {"apikey": apikey}, {}, function(error, response, body){
																						immunizationRecommendationSupportingPatientInformationObservation = JSON.parse(body);
																						if(immunizationRecommendationSupportingPatientInformationObservation.err_code == 0){
																							var objectImmunizationRecommendation = {};
																							objectImmunizationRecommendation.id = immunizationRecommendation.id;
																							objectImmunizationRecommendation.date = immunizationRecommendation.date;
																							objectImmunizationRecommendation.vaccineCode = immunizationRecommendation.vaccineCode;
																							objectImmunizationRecommendation.targetDisease = immunizationRecommendation.targetDisease;
																							objectImmunizationRecommendation.doseNumber = immunizationRecommendation.doseNumber;
																							objectImmunizationRecommendation.forecastStatus = immunizationRecommendation.forecastStatus;
																							objectImmunizationRecommendation.dateCriterion = immunizationRecommendation.dateCriterion;
																							objectImmunizationRecommendation.protocol = immunizationRecommendation.protocol;
																							objectImmunizationRecommendation.supportingImmunization = immunizationRecommendation.supportingImmunization;
																							var SupportingPatientInformation	= {};
																							SupportingPatientInformation.observation = immunizationRecommendationSupportingPatientInformationObservation.data;
																							objectImmunizationRecommendation.supportingPatientInformation = SupportingPatientInformation;

																							newImmunizationRecommendationRecommendation[index] = objectImmunizationRecommendation;

																							myEmitter.once('getImmunizationRecommendationSupportingPatientInformationAllergyIntolerance', function(immunizationRecommendation, index, newImmunizationRecommendationRecommendation, countImmunizationRecommendation){
																								qString = {};
																								qString.recommendation_id = immunizationRecommendation.id;
																								seedPhoenixFHIR.path.GET = {
																									"ImmunizationRecommendationSupportingPatientInformationAllergyIntolerance" : {
																										"location": "%(apikey)s/ImmunizationRecommendationSupportingPatientInformationAllergyIntolerance",
																										"query": qString
																									}
																								}

																								var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																								ApiFHIR.get('ImmunizationRecommendationSupportingPatientInformationAllergyIntolerance', {"apikey": apikey}, {}, function(error, response, body){
																									immunizationRecommendationSupportingPatientInformationAllergyIntolerance = JSON.parse(body);
																									if(immunizationRecommendationSupportingPatientInformationAllergyIntolerance.err_code == 0){
																										var objectImmunizationRecommendation = {};
																										objectImmunizationRecommendation.id = immunizationRecommendation.id;
																										objectImmunizationRecommendation.date = immunizationRecommendation.date;
																										objectImmunizationRecommendation.vaccineCode = immunizationRecommendation.vaccineCode;
																										objectImmunizationRecommendation.targetDisease = immunizationRecommendation.targetDisease;
																										objectImmunizationRecommendation.doseNumber = immunizationRecommendation.doseNumber;
																										objectImmunizationRecommendation.forecastStatus = immunizationRecommendation.forecastStatus;
																										objectImmunizationRecommendation.dateCriterion = immunizationRecommendation.dateCriterion;
																										objectImmunizationRecommendation.protocol = immunizationRecommendation.protocol;
																										objectImmunizationRecommendation.supportingImmunization = immunizationRecommendation.supportingImmunization;
																										var SupportingPatientInformation	= {};
																										SupportingPatientInformation.observation = immunizationRecommendation.supportingPatientInformation.observation;
																										SupportingPatientInformation.allergyIntolerance = immunizationRecommendationSupportingPatientInformationAllergyIntolerance.data;
																										objectImmunizationRecommendation.supportingPatientInformation = SupportingPatientInformation;

																										newImmunizationRecommendationRecommendation[index] = objectImmunizationRecommendation;

																										if(index == countImmunizationRecommendation -1 ){
																											res.json({"err_code": 0, "data":newImmunizationRecommendationRecommendation});	
																										}
																									}else{
																										res.json(immunizationRecommendationSupportingPatientInformationAllergyIntolerance);			
																									}
																								})
																							})
																							myEmitter.emit('getImmunizationRecommendationSupportingPatientInformationAllergyIntolerance', objectImmunizationRecommendation, index, newImmunizationRecommendationRecommendation, countImmunizationRecommendation);																						
																						}else{
																							res.json(immunizationRecommendationSupportingPatientInformationObservation);			
																						}
																					})
																				})
																				myEmitter.emit('getImmunizationRecommendationSupportingPatientInformationObservation', objectImmunizationRecommendation, index, newImmunizationRecommendationRecommendation, countImmunizationRecommendation);																			
																			}else{
																				res.json(immunizationRecommendationSupportingImmunization);			
																			}
																		})
																	})

																	myEmitter.emit('getImmunizationRecommendationSupportingImmunization', objectImmunizationRecommendation, index, newImmunizationRecommendationRecommendation, countImmunizationRecommendation);																	
																}else{
																	res.json(immunizationRecommendationDateCriterion);			
																}
															})
														})
														myEmitter.emit('getDateCriterion', immunizationRecommendationRecommendation.data[i], i, newImmunizationRecommendationRecommendation, immunizationRecommendationRecommendation.data.length);
													}
													//res.json({"err_code": 0, "data":organization.data});
												}else{
													res.json({"err_code": 2, "err_msg": "Immunization Recommendation is empty."});	
												}
											/*-------------*/
											}else{
												res.json(immunizationRecommendationRecommendation);
											}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Immunization Recommendation Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		/*immunizationRecommendationDateCriterion: function getImmunizationRecommendationDateCriterion(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var immunizationRecommendationId = req.params.immunization_recommendation_id;
					var immunizationRecommendationDateCriterionId = req.params.immunization_recommendation_recommendation_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "IMMUNIZATION_RECOMMENDATION_ID|" + immunizationRecommendationId, 'IMMUNIZATION_RECOMMENDATION', function(resPatientID){
								if(resPatientID.err_code > 0){
									if(typeof immunizationRecommendationDateCriterionId !== 'undefined' && !validator.isEmpty(immunizationRecommendationDateCriterionId)){
										checkUniqeValue(apikey, "RECOMMENDATION__ID|" + immunizationRecommendationDateCriterionId, 'IMMUNIZATION_RECOMMENDATION_RECOMMENDATION', function(resImmunizationRecommendationDateCriterionID){
											if(resImmunizationRecommendationDateCriterionID.err_code > 0){
												//get immunizationRecommendationDateCriterion
								  			qString = {};
								  			qString.immunization_recommendation_id = immunizationRecommendationId;
								  			qString._id = immunizationRecommendationDateCriterionId;
									  		seedPhoenixFHIR.path.GET = {
													"ImmunizationRecommendationDateCriterion" : {
														"location": "%(apikey)s/ImmunizationRecommendationDateCriterion",
														"query": qString
													}
												}
												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

												ApiFHIR.get('ImmunizationRecommendationDateCriterion', {"apikey": apikey}, {}, function(error, response, body){
													immunizationRecommendationDateCriterion = JSON.parse(body);
													if(immunizationRecommendationDateCriterion.err_code == 0){
														res.json({"err_code": 0, "data":immunizationRecommendationDateCriterion.data});	
													}else{
														res.json(immunizationRecommendationDateCriterion);
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Immunization Recommendation Recommendation Id not found"});		
											}
										})
									}else{
										//get immunizationRecommendationDateCriterion
						  			qString = {};
						  			qString.immunization_recommendation_id = immunizationRecommendationId;
							  		seedPhoenixFHIR.path.GET = {
											"ImmunizationRecommendationDateCriterion" : {
												"location": "%(apikey)s/ImmunizationRecommendationDateCriterion",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ImmunizationRecommendationDateCriterion', {"apikey": apikey}, {}, function(error, response, body){
											immunizationRecommendationDateCriterion = JSON.parse(body);
											if(immunizationRecommendationDateCriterion.err_code == 0){
												res.json({"err_code": 0, "data":immunizationRecommendationDateCriterion.data});	
											}else{
												res.json(immunizationRecommendationDateCriterion);
											}
										})
									}
								}else{
									res.json({"err_code": 501, "err_msg": "Immunization Recommendation Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},*/
	},
	post: {
		immunizationRecommendation : function addImmunizationRecommendation(req, res){
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

/*
patient|patient||
recommendation.date|recommendationDate|date|nn
recommendation.vaccineCode|recommendationVaccineCode||
recommendation.targetDisease|recommendationTargetDisease||
recommendation.doseNumber|recommendationDoseNumber|integer|
recommendation.forecastStatus|recommendationForecastStatus||nn
recommendation.dateCriterion.code|recommendationDateCriterionCode||nn
recommendation.dateCriterion.value|recommendationDateCriterionValue|date|
recommendation.protocol.doseSequence|recommendationProtocolDoseSequence|integer|
recommendation.protocol.description|recommendationProtocolDescription||
recommendation.protocol.authority|recommendationProtocolAuthority||
recommendation.protocol.series|recommendationProtocolSeries||
recommendation.supportingImmunization|recommendationSupportingImmunization||
recommendation.supportingPatientInformation.observation|recommendationSupportingPatientInformationObservation||
recommendation.supportingPatientInformation.allergyIntolerance|recommendationSupportingPatientInformationAllergyIntolerance||
*/
			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					patient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Immunization Recommendation request.";
			}

			if(typeof req.body.recommendation.date !== 'undefined'){
				var recommendationDate =  req.body.recommendation.date;
				if(validator.isEmpty(recommendationDate)){
					err_code = 2;
					err_msg = "Immunization Recommendation recommendation date is required.";
				}else{
					if(!regex.test(recommendationDate)){
						err_code = 2;
						err_msg = "Immunization Recommendation recommendation date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation date' in json Immunization Recommendation request.";
			}

			if(typeof req.body.recommendation.vaccineCode !== 'undefined'){
				var recommendationVaccineCode =  req.body.recommendation.vaccineCode.trim().toLowerCase();
				if(validator.isEmpty(recommendationVaccineCode)){
					recommendationVaccineCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation vaccine code' in json Immunization Recommendation request.";
			}

			if(typeof req.body.recommendation.targetDisease !== 'undefined'){
				var recommendationTargetDisease =  req.body.recommendation.targetDisease.trim().toLowerCase();
				if(validator.isEmpty(recommendationTargetDisease)){
					recommendationTargetDisease = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation target disease' in json Immunization Recommendation request.";
			}

			if(typeof req.body.recommendation.doseNumber !== 'undefined'){
				var recommendationDoseNumber =  req.body.recommendation.doseNumber.trim();
				if(validator.isEmpty(recommendationDoseNumber)){
					recommendationDoseNumber = "";
				}else{
					if(!validator.isInt(recommendationDoseNumber)){
						err_code = 2;
						err_msg = "Immunization Recommendation recommendation dose number is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation dose number' in json Immunization Recommendation request.";
			}

			if(typeof req.body.recommendation.forecastStatus !== 'undefined'){
				var recommendationForecastStatus =  req.body.recommendation.forecastStatus.trim().toLowerCase();
				if(validator.isEmpty(recommendationForecastStatus)){
					err_code = 2;
					err_msg = "Immunization Recommendation recommendation forecast status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation forecast status' in json Immunization Recommendation request.";
			}

			if(typeof req.body.recommendation.dateCriterion.code !== 'undefined'){
				var recommendationDateCriterionCode =  req.body.recommendation.dateCriterion.code.trim().toLowerCase();
				if(validator.isEmpty(recommendationDateCriterionCode)){
					err_code = 2;
					err_msg = "Immunization Recommendation recommendation date criterion code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation date criterion code' in json Immunization Recommendation request.";
			}

			if(typeof req.body.recommendation.dateCriterion.value !== 'undefined'){
				var recommendationDateCriterionValue =  req.body.recommendation.dateCriterion.value;
				if(validator.isEmpty(recommendationDateCriterionValue)){
					recommendationDateCriterionValue = "";
				}else{
					if(!regex.test(recommendationDateCriterionValue)){
						err_code = 2;
						err_msg = "Immunization Recommendation recommendation date criterion value invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation date criterion value' in json Immunization Recommendation request.";
			}

			if(typeof req.body.recommendation.protocol.doseSequence !== 'undefined'){
				var recommendationProtocolDoseSequence =  req.body.recommendation.protocol.doseSequence.trim();
				if(validator.isEmpty(recommendationProtocolDoseSequence)){
					recommendationProtocolDoseSequence = "";
				}else{
					if(!validator.isInt(recommendationProtocolDoseSequence)){
						err_code = 2;
						err_msg = "Immunization Recommendation recommendation protocol dose sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation protocol dose sequence' in json Immunization Recommendation request.";
			}

			if(typeof req.body.recommendation.protocol.description !== 'undefined'){
				var recommendationProtocolDescription =  req.body.recommendation.protocol.description.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolDescription)){
					recommendationProtocolDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation protocol description' in json Immunization Recommendation request.";
			}

			if(typeof req.body.recommendation.protocol.authority !== 'undefined'){
				var recommendationProtocolAuthority =  req.body.recommendation.protocol.authority.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolAuthority)){
					recommendationProtocolAuthority = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation protocol authority' in json Immunization Recommendation request.";
			}

			if(typeof req.body.recommendation.protocol.series !== 'undefined'){
				var recommendationProtocolSeries =  req.body.recommendation.protocol.series.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolSeries)){
					recommendationProtocolSeries = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation protocol series' in json Immunization Recommendation request.";
			}

			if(typeof req.body.recommendation.supportingImmunization !== 'undefined'){
				var recommendationSupportingImmunization =  req.body.recommendation.supportingImmunization.trim().toLowerCase();
				if(validator.isEmpty(recommendationSupportingImmunization)){
					recommendationSupportingImmunization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation supporting immunization' in json Immunization Recommendation request.";
			}

			if(typeof req.body.recommendation.supportingPatientInformation.observation !== 'undefined'){
				var recommendationSupportingPatientInformationObservation =  req.body.recommendation.supportingPatientInformation.observation.trim().toLowerCase();
				if(validator.isEmpty(recommendationSupportingPatientInformationObservation)){
					recommendationSupportingPatientInformationObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation supporting patient information observation' in json Immunization Recommendation request.";
			}

			if(typeof req.body.recommendation.supportingPatientInformation.allergyIntolerance !== 'undefined'){
				var recommendationSupportingPatientInformationAllergyIntolerance =  req.body.recommendation.supportingPatientInformation.allergyIntolerance.trim().toLowerCase();
				if(validator.isEmpty(recommendationSupportingPatientInformationAllergyIntolerance)){
					recommendationSupportingPatientInformationAllergyIntolerance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation supporting patient information allergy intolerance' in json Immunization Recommendation request.";
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
										myEmitter.once('checkIdentifierValue', function() {

												checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
													if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada

														//proses insert

														//set uniqe id
														var unicId = uniqid.time();
														var identifierId = 'ide' + unicId;
														var immunizationRecommendationId = 'ire' + unicId;
														var immunizationRecommendationRecommendationId = 'irr' + unicId;
														var immunizationRecommendationDateCriterionId = 'ird' + unicId;

														dataImmunizationRecommendation = {
															"immunization_recommendation_id" : immunizationRecommendationId,
															"patient" : patient
														}
														console.log(dataImmunizationRecommendation);
														ApiFHIR.post('immunizationRecommendation', {"apikey": apikey}, {body: dataImmunizationRecommendation, json: true}, function(error, response, body){
															immunizationRecommendation = body;
															console.log(immunizationRecommendation);
															if(immunizationRecommendation.err_code > 0){
																res.json(immunizationRecommendation);	
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
																							"care_team_id": immunizationRecommendationId
																						}

														/*ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})*/
														
														//ImmunizationRecommendationRecommendation
														dataImmunizationRecommendationRecommendation = {
															"recommendation_id" : immunizationRecommendationRecommendationId,
															"date" : recommendationDate,
															"vaccine_code" : recommendationVaccineCode,
															"target_disease" : recommendationTargetDisease,
															"dose_number" : recommendationDoseNumber,
															"forecast_status" : recommendationForecastStatus,
															"protocol_dose_sequence" : recommendationProtocolDoseSequence,
															"protocol_description" : recommendationProtocolDescription,
															"protocol_authority" : recommendationProtocolAuthority,
															"protocol_series" : recommendationProtocolSeries,
															"immunization_recommendation_id" : immunizationRecommendationId
														}
														ApiFHIR.post('immunizationRecommendationRecommendation', {"apikey": apikey}, {body: dataImmunizationRecommendationRecommendation, json: true}, function(error, response, body){
															immunizationRecommendationRecommendation = body;
															if(immunizationRecommendationRecommendation.err_code > 0){
																res.json(immunizationRecommendationRecommendation);	
																console.log("ok");
															}
														});
														
														//ImmunizationRecommendationDateCriterion
														dataImmunizationRecommendationDateCriterion = {
															"date_creation_id" : immunizationRecommendationDateCriterionId,
															"code" : recommendationDateCriterionCode,
															"value" : recommendationDateCriterionValue,
															"recommendation_id" : immunizationRecommendationRecommendationId
														}
														ApiFHIR.post('immunizationRecommendationRecommendationDateCriterion', {"apikey": apikey}, {body: dataImmunizationRecommendationDateCriterion, json: true}, function(error, response, body){
															immunizationRecommendationDateCriterion = body;
															if(immunizationRecommendationDateCriterion.err_code > 0){
																//res.json(data": [{"_id":immunizationRecommendationDateCriterion);	
																console.log("ok");
															}
														});
														
														if(recommendationSupportingImmunization !== ""){
															dataRecommendationSupportingImmunization = {
																"_id" : recommendationSupportingImmunization,
																"recommendation_id" : immunizationRecommendationRecommendationId
															}
															ApiFHIR.put('immunization', {"apikey": apikey, "_id": recommendationSupportingImmunization}, {body: dataRecommendationSupportingImmunization, json: true}, function(error, response, body){
																returnRecommendationSupportingImmunization = body;
																if(returnRecommendationSupportingImmunization.err_code > 0){
																	res.json(returnRecommendationSupportingImmunization);	
																	console.log("add reference recommendation supporting immunization : " + recommendationSupportingImmunization);
																}
															});
														}
														
														if(recommendationSupportingPatientInformationObservation !== ""){
															dataRecommendationSupportingPatientInformationObservation = {
																"_id" : recommendationSupportingPatientInformationObservation,
																"recommendation_id" : immunizationRecommendationRecommendationId
															}
															ApiFHIR.put('observation', {"apikey": apikey, "_id": imagingManifestId}, {body: recommendationSupportingPatientInformationObservation, json: true}, function(error, response, body){
																returnRecommendationSupportingPatientInformationObservation = body;
																if(returnRecommendationSupportingPatientInformationObservation.err_code > 0){
																	res.json(returnRecommendationSupportingPatientInformationObservation);	
																	console.log("add reference recommendation supporting patient information observation : " + recommendationSupportingPatientInformationObservation);
																}
															});
														}
														
														if(recommendationSupportingPatientInformationAllergyIntolerance !== ""){
															dataRecommendationSupportingPatientInformationAllergyIntolerance = {
																"_id" : recommendationSupportingPatientInformationAllergyIntolerance,
																"recommendation_id" : immunizationRecommendationRecommendationId
															}
															ApiFHIR.put('allergyIntolerance', {"apikey": apikey, "_id": recommendationSupportingPatientInformationAllergyIntolerance}, {body: dataRecommendationSupportingPatientInformationAllergyIntolerance, json: true}, function(error, response, body){
																recommendationSupportingPatientInformationAllergyIntolerance = body;
																if(returnRecommendationSupportingPatientInformationAllergyIntolerance.err_code > 0){
																	res.json(returnRecommendationSupportingPatientInformationAllergyIntolerance);	
																	console.log("add reference recommendation supporting patient information allergy intolerance : " + recommendationSupportingPatientInformationAllergyIntolerance);
																}
															});
														}
														
														res.json({"err_code": 0, "err_msg": "Immunization Recommendation has been add.", "data": [{"_id": immunizationRecommendationId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
										recommendationVaccineCode|vaccine_code
										recommendationTargetDisease|immunization_recommendation_target_disease
										recommendationForecastStatus|immunization_recommendation_status
										recommendationDateCriterionCode|immunization_recommendation_date_criterion
										*/
										myEmitter.prependOnceListener('checkRecommendationVaccineCode', function () {
											if (!validator.isEmpty(recommendationVaccineCode)) {
												checkCode(apikey, recommendationVaccineCode, 'VACCINE_CODE', function (resRecommendationVaccineCodeCode) {
													if (resRecommendationVaccineCodeCode.err_code > 0) {
														myEmitter.emit('checkIdentifierValue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recommendation vaccine code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIdentifierValue');
											}
										})

										myEmitter.prependOnceListener('checkRecommendationTargetDisease', function () {
											if (!validator.isEmpty(recommendationTargetDisease)) {
												checkCode(apikey, recommendationTargetDisease, 'IMMUNIZATION_RECOMMENDATION_TARGET_DISEASE', function (resRecommendationTargetDiseaseCode) {
													if (resRecommendationTargetDiseaseCode.err_code > 0) {
														myEmitter.emit('checkRecommendationVaccineCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recommendation target disease code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecommendationVaccineCode');
											}
										})

										myEmitter.prependOnceListener('checkRecommendationForecastStatus', function () {
											if (!validator.isEmpty(recommendationForecastStatus)) {
												checkCode(apikey, recommendationForecastStatus, 'IMMUNIZATION_RECOMMENDATION_STATUS', function (resRecommendationForecastStatusCode) {
													if (resRecommendationForecastStatusCode.err_code > 0) {
														myEmitter.emit('checkRecommendationTargetDisease');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recommendation forecast status code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecommendationTargetDisease');
											}
										})

										myEmitter.prependOnceListener('checkRecommendationDateCriterionCode', function () {
											if (!validator.isEmpty(recommendationDateCriterionCode)) {
												checkCode(apikey, recommendationDateCriterionCode, 'IMMUNIZATION_RECOMMENDATION_DATE_CRITERION', function (resRecommendationDateCriterionCodeCode) {
													if (resRecommendationDateCriterionCodeCode.err_code > 0) {
														myEmitter.emit('checkRecommendationForecastStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recommendation date criterion code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecommendationForecastStatus');
											}
										})

										//cek value
										/*
										patient|Patient
										recommendationProtocolAuthority|Organization
										recommendationSupportingImmunization|Immunization
										recommendationSupportingPatientInformationObservation|Observation
										recommendationSupportingPatientInformationAllergyIntolerance|Allergy_Intolerance

										*/

										myEmitter.prependOnceListener('checkPatient', function () {
											if (!validator.isEmpty(patient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
													if (resPatient.err_code > 0) {
														myEmitter.emit('checkRecommendationDateCriterionCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecommendationDateCriterionCode');
											}
										})

										myEmitter.prependOnceListener('checkRecommendationProtocolAuthority', function () {
											if (!validator.isEmpty(recommendationProtocolAuthority)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + recommendationProtocolAuthority, 'ORGANIZATION', function (resRecommendationProtocolAuthority) {
													if (resRecommendationProtocolAuthority.err_code > 0) {
														myEmitter.emit('checkPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recommendation protocol authority id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPatient');
											}
										})

										myEmitter.prependOnceListener('checkRecommendationSupportingImmunization', function () {
											if (!validator.isEmpty(recommendationSupportingImmunization)) {
												checkUniqeValue(apikey, "IMMUNIZATION_ID|" + recommendationSupportingImmunization, 'IMMUNIZATION', function (resRecommendationSupportingImmunization) {
													if (resRecommendationSupportingImmunization.err_code > 0) {
														myEmitter.emit('checkRecommendationProtocolAuthority');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recommendation supporting immunization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecommendationProtocolAuthority');
											}
										})

										myEmitter.prependOnceListener('checkRecommendationSupportingPatientInformationObservation', function () {
											if (!validator.isEmpty(recommendationSupportingPatientInformationObservation)) {
												checkUniqeValue(apikey, "OBSERVATION_ID|" + recommendationSupportingPatientInformationObservation, 'OBSERVATION', function (resRecommendationSupportingPatientInformationObservation) {
													if (resRecommendationSupportingPatientInformationObservation.err_code > 0) {
														myEmitter.emit('checkRecommendationSupportingImmunization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recommendation supporting patient information observation id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecommendationSupportingImmunization');
											}
										})

										if (!validator.isEmpty(recommendationSupportingPatientInformationAllergyIntolerance)) {
											checkUniqeValue(apikey, "ALLERGY_INTOLERANCE_ID|" + recommendationSupportingPatientInformationAllergyIntolerance, 'ALLERGY_INTOLERANCE', function (resRecommendationSupportingPatientInformationAllergyIntolerance) {
												if (resRecommendationSupportingPatientInformationAllergyIntolerance.err_code > 0) {
													myEmitter.emit('checkRecommendationSupportingPatientInformationObservation');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Recommendation supporting patient information allergy intolerance id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkRecommendationSupportingPatientInformationObservation');
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
			var immunizationRecommendationId = req.params.immunization_recommendation_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof immunizationRecommendationId !== 'undefined'){
				if(validator.isEmpty(immunizationRecommendationId)){
					err_code = 2;
					err_msg = "Immunization Recommendation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "ImmunizationRecommendation id is required";
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
												checkUniqeValue(apikey, "IMMUNIZATION_RECOMMENDATION_ID|" + immunizationRecommendationId, 'IMMUNIZATION_RECOMMENDATION', function(resImmunizationRecommendationID){
													if(resImmunizationRecommendationID.err_code > 0){
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
															"immunization_recommendation_id": immunizationRecommendationId
														}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this immunizationRecommendation.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Immunization Recommendation Id not found"});		
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
		immunizationRecommendationRecommendation: function addImmunizationRecommendationRecommendation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var immunizationRecommendationId = req.params.immunization_recommendation_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof immunizationRecommendationId !== 'undefined'){
				if(validator.isEmpty(immunizationRecommendationId)){
					err_code = 2;
					err_msg = "Immunization Recommendation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Recommendation id is required";
			}

			//immunizationRecommendationRecommendation
			if(typeof req.body.date !== 'undefined'){
				var recommendationDate =  req.body.date;
				if(validator.isEmpty(recommendationDate)){
					err_code = 2;
					err_msg = "Immunization Recommendation recommendation date is required.";
				}else{
					if(!regex.test(recommendationDate)){
						err_code = 2;
						err_msg = "Immunization Recommendation recommendation date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation date' in json Immunization Recommendation request.";
			}

			if(typeof req.body.vaccineCode !== 'undefined'){
				var recommendationVaccineCode =  req.body.vaccineCode.trim().toLowerCase();
				if(validator.isEmpty(recommendationVaccineCode)){
					recommendationVaccineCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation vaccine code' in json Immunization Recommendation request.";
			}

			if(typeof req.body.targetDisease !== 'undefined'){
				var recommendationTargetDisease =  req.body.targetDisease.trim().toLowerCase();
				if(validator.isEmpty(recommendationTargetDisease)){
					recommendationTargetDisease = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation target disease' in json Immunization Recommendation request.";
			}

			if(typeof req.body.doseNumber !== 'undefined'){
				var recommendationDoseNumber =  req.body.doseNumber.trim();
				if(validator.isEmpty(recommendationDoseNumber)){
					recommendationDoseNumber = "";
				}else{
					if(!validator.isInt(recommendationDoseNumber)){
						err_code = 2;
						err_msg = "Immunization Recommendation recommendation dose number is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation dose number' in json Immunization Recommendation request.";
			}

			if(typeof req.body.forecastStatus !== 'undefined'){
				var recommendationForecastStatus =  req.body.forecastStatus.trim().toLowerCase();
				if(validator.isEmpty(recommendationForecastStatus)){
					err_code = 2;
					err_msg = "Immunization Recommendation recommendation forecast status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation forecast status' in json Immunization Recommendation request.";
			}

			if(typeof req.body.protocol.doseSequence !== 'undefined'){
				var recommendationProtocolDoseSequence =  req.body.protocol.doseSequence.trim();
				if(validator.isEmpty(recommendationProtocolDoseSequence)){
					recommendationProtocolDoseSequence = "";
				}else{
					if(!validator.isInt(recommendationProtocolDoseSequence)){
						err_code = 2;
						err_msg = "Immunization Recommendation recommendation protocol dose sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation protocol dose sequence' in json Immunization Recommendation request.";
			}

			if(typeof req.body.protocol.description !== 'undefined'){
				var recommendationProtocolDescription =  req.body.protocol.description.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolDescription)){
					recommendationProtocolDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation protocol description' in json Immunization Recommendation request.";
			}

			if(typeof req.body.protocol.authority !== 'undefined'){
				var recommendationProtocolAuthority =  req.body.protocol.authority.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolAuthority)){
					recommendationProtocolAuthority = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation protocol authority' in json Immunization Recommendation request.";
			}

			if(typeof req.body.protocol.series !== 'undefined'){
				var recommendationProtocolSeries =  req.body.protocol.series.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolSeries)){
					recommendationProtocolSeries = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation protocol series' in json Immunization Recommendation request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkImmunizationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_RECOMMENDATION_ID|" + immunizationRecommendationId, 'IMMUNIZATION_RECOMMENDATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									var unicId = uniqid.time();
									var immunizationRecommendationRecommendationId = 'irr' + unicId;
									//ImmunizationRecommendationRecommendation
									dataImmunizationRecommendationRecommendation = {
										"recommendation_id" : immunizationRecommendationRecommendationId,
										"date" : recommendationDate,
										"vaccine_code" : recommendationVaccineCode,
										"target_disease" : recommendationTargetDisease,
										"dose_number" : recommendationDoseNumber,
										"forecast_status" : recommendationForecastStatus,
										"protocol_dose_sequence" : recommendationProtocolDoseSequence,
										"protocol_description" : recommendationProtocolDescription,
										"protocol_authority" : recommendationProtocolAuthority,
										"protocol_series" : recommendationProtocolSeries,
										"immunization_recommendation_id" : immunizationRecommendationId
									}
									ApiFHIR.post('immunizationRecommendationRecommendation', {"apikey": apikey}, {body: dataImmunizationRecommendationRecommendation, json: true}, function(error, response, body){
										immunizationRecommendationRecommendation = body;
										
										if(immunizationRecommendationRecommendation.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Recommendation has been add in this immunizationRecommendation.", "data": immunizationRecommendationRecommendation.data});
										}else{
											res.json(immunizationRecommendationRecommendation);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Recommendation Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkRecommendationVaccineCode', function () {
							if (!validator.isEmpty(recommendationVaccineCode)) {
								checkCode(apikey, recommendationVaccineCode, 'VACCINE_CODE', function (resRecommendationVaccineCodeCode) {
									if (resRecommendationVaccineCodeCode.err_code > 0) {
										myEmitter.emit('checkImmunizationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Recommendation vaccine code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkImmunizationID');
							}
						})

						myEmitter.prependOnceListener('checkRecommendationTargetDisease', function () {
							if (!validator.isEmpty(recommendationTargetDisease)) {
								checkCode(apikey, recommendationTargetDisease, 'IMMUNIZATION_RECOMMENDATION_TARGET_DISEASE', function (resRecommendationTargetDiseaseCode) {
									if (resRecommendationTargetDiseaseCode.err_code > 0) {
										myEmitter.emit('checkRecommendationVaccineCode');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Recommendation target disease code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRecommendationVaccineCode');
							}
						})

						myEmitter.prependOnceListener('checkRecommendationForecastStatus', function () {
							if (!validator.isEmpty(recommendationForecastStatus)) {
								checkCode(apikey, recommendationForecastStatus, 'IMMUNIZATION_RECOMMENDATION_STATUS', function (resRecommendationForecastStatusCode) {
									if (resRecommendationForecastStatusCode.err_code > 0) {
										myEmitter.emit('checkRecommendationTargetDisease');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Recommendation forecast status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRecommendationTargetDisease');
							}
						})
						
						if (!validator.isEmpty(recommendationProtocolAuthority)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + recommendationProtocolAuthority, 'ORGANIZATION', function (resRecommendationProtocolAuthority) {
								if (resRecommendationProtocolAuthority.err_code > 0) {
									myEmitter.emit('checkRecommendationForecastStatus');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Recommendation protocol authority id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRecommendationForecastStatus');
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
		immunizationRecommendationDateCriterion: function addImmunizationRecommendationDateCriterion(req, res){
			console.log("1234");
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var immunizationRecommendationId = req.params.immunization_recommendation_id;
			var immunizationRecommendationRecommendationId = req.params.immunization_recommendation_recommendation_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof immunizationRecommendationId !== 'undefined'){
				if(validator.isEmpty(immunizationRecommendationId)){
					err_code = 2;
					err_msg = "Immunization Recommendation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Recommendation id is required";
			}
			
			if(typeof immunizationRecommendationRecommendationId !== 'undefined'){
				if(validator.isEmpty(immunizationRecommendationRecommendationId)){
					err_code = 2;
					err_msg = "Immunization Recommendation Recommendation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Recommendation Recommendation id is required";
			}

			//immunizationRecommendationDateCriterion
			if(typeof req.body.code !== 'undefined'){
				var recommendationDateCriterionCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(recommendationDateCriterionCode)){
					err_code = 2;
					err_msg = "Immunization Recommendation recommendation date criterion code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation date criterion code' in json Immunization Recommendation request.";
			}

			if(typeof req.body.value !== 'undefined'){
				var recommendationDateCriterionValue =  req.body.value;
				if(validator.isEmpty(recommendationDateCriterionValue)){
					recommendationDateCriterionValue = "";
				}else{
					if(!regex.test(recommendationDateCriterionValue)){
						err_code = 2;
						err_msg = "Immunization Recommendation recommendation date criterion value invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation date criterion value' in json Immunization Recommendation request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkImmunizationID', function(){
							checkUniqeValue(apikey, "RECOMMENDATION__ID|" + immunizationRecommendationRecommendationId, 'IMMUNIZATION_RECOMMENDATION_RECOMMENDATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									var unicId = uniqid.time();
									var immunizationRecommendationDateCriterionId = 'ird' + unicId;
									//ImmunizationRecommendationDateCriterion
									dataImmunizationRecommendationDateCriterion = {
										"date_creation_id" : immunizationRecommendationDateCriterionId,
										"code" : recommendationDateCriterionCode,
										"value" : recommendationDateCriterionValue,
										"recommendation_id" : immunizationRecommendationRecommendationId
									}
									ApiFHIR.post('immunizationRecommendationRecommendationDateCriterion', {"apikey": apikey}, {body: dataImmunizationRecommendationDateCriterion, json: true}, function(error, response, body){
										immunizationRecommendationDateCriterion = body;
										
										if(immunizationRecommendationDateCriterion.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Date Criterion has been add in this immunizationRecommendation.", "data": immunizationRecommendationDateCriterion.data});
										}else{
											res.json(immunizationRecommendationDateCriterion);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Recommendation Recommendation Id not found"});		
								}
							})
						})
						
						myEmitter.once('checkImmunizationRecommendationID', function(){
						if (!validator.isEmpty(recommendationDateCriterionCode)) {
							checkUniqeValue(apikey, "IMMUNIZATION_RECOMMENDATION_ID|" + immunizationRecommendationId, 'IMMUNIZATION_RECOMMENDATION', function(resImmunizationRecommendationID){
								if (resImmunizationRecommendationID.err_code > 0) {
									myEmitter.emit('checkImmunizationID');
								} else {
									res.json({"err_code": 504, "err_msg": "Immunization Recommendation Id not found"});		
								}
							})
						} else {
							myEmitter.emit('checkImmunizationID');
						}
						})
						
						if (!validator.isEmpty(recommendationDateCriterionCode)) {
							checkCode(apikey, recommendationDateCriterionCode, 'IMMUNIZATION_RECOMMENDATION_DATE_CRITERION', function (resRecommendationDateCriterionCodeCode) {
								if (resRecommendationDateCriterionCodeCode.err_code > 0) {
									myEmitter.emit('checkImmunizationRecommendationID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Recommendation date criterion code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkImmunizationRecommendationID');
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
		immunizationRecommendation : function putImmunizationRecommendation(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var immunizationRecommendationId = req.params.immunization_recommendation_id;

      var err_code = 0;
      var err_msg = "";
      var dataImmunizationRecommendation = {};

			if(typeof immunizationRecommendationId !== 'undefined'){
				if(validator.isEmpty(immunizationRecommendationId)){
					err_code = 2;
					err_msg = "Immunization Recommendation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Recommendation id is required";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					dataImmunizationRecommendation.patient = "";
				}else{
					dataImmunizationRecommendation.patient = patient;
				}
			}else{
			  patient = "";
			}

			/*if(typeof req.body.supportingImmunization !== 'undefined' && req.body.supportingImmunization !== ""){
				var recommendationSupportingImmunization =  req.body.supportingImmunization.trim().toLowerCase();
				if(validator.isEmpty(recommendationSupportingImmunization)){
					dataImmunizationRecommendationRecommendation.supporting_immunization = "";
				}else{
					dataImmunizationRecommendationRecommendation.supporting_immunization = recommendationSupportingImmunization;
				}
			}else{
			  recommendationSupportingImmunization = "";
			}

			if(typeof req.body.supportingPatientInformation.observation !== 'undefined' && req.body.supportingPatientInformation.observation !== ""){
				var recommendationSupportingPatientInformationObservation =  req.body.supportingPatientInformation.observation.trim().toLowerCase();
				if(validator.isEmpty(recommendationSupportingPatientInformationObservation)){
					dataImmunizationRecommendationRecommendation.observation = "";
				}else{
					dataImmunizationRecommendationRecommendation.observation = recommendationSupportingPatientInformationObservation;
				}
			}else{
			  recommendationSupportingPatientInformationObservation = "";
			}

			if(typeof req.body.supportingPatientInformation.allergyIntolerance !== 'undefined' && req.body.supportingPatientInformation.allergyIntolerance !== ""){
				var recommendationSupportingPatientInformationAllergyIntolerance =  req.body.supportingPatientInformation.allergyIntolerance.trim().toLowerCase();
				if(validator.isEmpty(recommendationSupportingPatientInformationAllergyIntolerance)){
					dataImmunizationRecommendationRecommendation.allergy_intolerance = "";
				}else{
					dataImmunizationRecommendationRecommendation.allergy_intolerance = recommendationSupportingPatientInformationAllergyIntolerance;
				}
			}else{
			  recommendationSupportingPatientInformationAllergyIntolerance = "";
			}*/

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	

										//event emiter
						myEmitter.prependOnceListener('checkImmunizationRecommendationId', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_RECOMMENDATION_ID|" + immunizationRecommendationId, 'IMMUNIZATION_RECOMMENDATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									//console.log(dataImmunization);
									ApiFHIR.put('immunizationRecommendation', {"apikey": apikey, "_id": immunizationRecommendationId}, {body: dataImmunizationRecommendation, json: true}, function(error, response, body){
										immunizationRecommendation = body;
										if(immunizationRecommendation.err_code > 0){
											res.json(immunizationRecommendation);	
										}else{
											res.json({"err_code": 0, "err_msg": "Immunization Recommendation has been update.", "data": [{"_id": immunizationRecommendationId}]});
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Recommendation Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(patient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
								if (resPatient.err_code > 0) {
									myEmitter.emit('checkImmunizationRecommendationId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkImmunizationRecommendationId');
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
			var immunizationRecommendationId = req.params.immunization_recommendation_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof immunizationRecommendationId !== 'undefined'){
				if(validator.isEmpty(immunizationRecommendationId)){
					err_code = 2;
					err_msg = "Immunization Recommendation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Recommendation id is required";
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
						myEmitter.prependOnceListener('checkImmunizationRecommendationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_RECOMMENDATION_ID|" + immunizationRecommendationId, 'IMMUNIZATION_RECOMMENDATION', function(resImmunizationRecommendationID){
								if(resImmunizationRecommendationID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "IMMUNIZATION_RECOMMENDATION_ID|"+immunizationRecommendationId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this immunization Recommendation.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Recommendation Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkImmunizationRecommendationID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkImmunizationRecommendationID');				
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
		immunizationRecommendationRecommendation: function updateImmunizationRecommendationRecommendation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var immunizationRecommendationId = req.params.immunization_recommendation_id;
			var immunizationRecommendationRecommendationId = req.params.immunization_recommendation_recommendation_id;

			var err_code = 0;
			var err_msg = "";
			var dataImmunizationRecommendationRecommendation = {};
			//input check 
			if(typeof immunizationRecommendationId !== 'undefined'){
				if(validator.isEmpty(immunizationRecommendationId)){
					err_code = 2;
					err_msg = "Immunization Recommendation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Recommendation id is required";
			}

			if(typeof immunizationRecommendationRecommendationId !== 'undefined'){
				if(validator.isEmpty(immunizationRecommendationRecommendationId)){
					err_code = 2;
					err_msg = "Immunization Recommendation Recommendation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Recommendation Recommendation id is required";
			}
			
			/*
			var date = req.body.date;
			var vaccine_code = req.body.vaccine_code;
			var target_disease = req.body.target_disease;
			var dose_number = req.body.dose_number;
			var forecast_status = req.body.forecast_status;
			var protocol_dose_sequence = req.body.protocol_dose_sequence;
			var protocol_description = req.body.protocol_description;
			var protocol_authority = req.body.protocol_authority;
			var protocol_series = req.body.protocol_series;
			*/
			
			if(typeof req.body.date !== 'undefined' && req.body.date !== ""){
				var recommendationDate =  req.body.date;
				if(validator.isEmpty(recommendationDate)){
					err_code = 2;
					err_msg = "immunization recommendation recommendation date is required.";
				}else{
					if(!regex.test(recommendationDate)){
						err_code = 2;
						err_msg = "immunization recommendation recommendation date invalid date format.";	
					}else{
						dataImmunizationRecommendationRecommendation.date = recommendationDate;
					}
				}
			}else{
			  recommendationDate = "";
			}

			if(typeof req.body.vaccineCode !== 'undefined' && req.body.vaccineCode !== ""){
				var recommendationVaccineCode =  req.body.vaccineCode.trim().toLowerCase();
				if(validator.isEmpty(recommendationVaccineCode)){
					dataImmunizationRecommendationRecommendation.vaccine_code = "";
				}else{
					dataImmunizationRecommendationRecommendation.vaccine_code = recommendationVaccineCode;
				}
			}else{
			  recommendationVaccineCode = "";
			}

			if(typeof req.body.targetDisease !== 'undefined' && req.body.targetDisease !== ""){
				var recommendationTargetDisease =  req.body.targetDisease.trim().toLowerCase();
				if(validator.isEmpty(recommendationTargetDisease)){
					dataImmunizationRecommendationRecommendation.target_disease = "";
				}else{
					dataImmunizationRecommendationRecommendation.target_disease = recommendationTargetDisease;
				}
			}else{
			  recommendationTargetDisease = "";
			}

			if(typeof req.body.doseNumber !== 'undefined' && req.body.doseNumber !== ""){
				var recommendationDoseNumber =  req.body.doseNumber;
				if(validator.isEmpty(recommendationDoseNumber)){
					dataImmunizationRecommendationRecommendation.dose_number = "";
				}else{
					if(!validator.isInt(recommendationDoseNumber)){
						err_code = 2;
						err_msg = "immunization recommendation recommendation dose number is must be number.";
					}else{
						dataImmunizationRecommendationRecommendation.dose_number = recommendationDoseNumber;
					}
				}
			}else{
			  recommendationDoseNumber = "";
			}

			if(typeof req.body.forecastStatus !== 'undefined' && req.body.forecastStatus !== ""){
				var recommendationForecastStatus =  req.body.forecastStatus.trim().toLowerCase();
				if(validator.isEmpty(recommendationForecastStatus)){
					err_code = 2;
					err_msg = "immunization recommendation recommendation forecast status is required.";
				}else{
					dataImmunizationRecommendationRecommendation.forecast_status = recommendationForecastStatus;
				}
			}else{
			  recommendationForecastStatus = "";
			}

			if(typeof req.body.protocol.doseSequence !== 'undefined' && req.body.protocol.doseSequence !== ""){
				var recommendationProtocolDoseSequence =  req.body.protocol.doseSequence;
				if(validator.isEmpty(recommendationProtocolDoseSequence)){
					dataImmunizationRecommendationRecommendation.protocol_dose_sequence = "";
				}else{
					if(!validator.isInt(recommendationProtocolDoseSequence)){
						err_code = 2;
						err_msg = "immunization recommendation recommendation protocol dose sequence is must be number.";
					}else{
						dataImmunizationRecommendationRecommendation.protocol_dose_sequence = recommendationProtocolDoseSequence;
					}
				}
			}else{
			  recommendationProtocolDoseSequence = "";
			}

			if(typeof req.body.protocol.description !== 'undefined' && req.body.protocol.description !== ""){
				var recommendationProtocolDescription =  req.body.protocol.description.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolDescription)){
					dataImmunizationRecommendationRecommendation.protocol_description = "";
				}else{
					dataImmunizationRecommendationRecommendation.protocol_description = recommendationProtocolDescription;
				}
			}else{
			  recommendationProtocolDescription = "";
			}

			if(typeof req.body.protocol.authority !== 'undefined' && req.body.protocol.authority !== ""){
				var recommendationProtocolAuthority =  req.body.protocol.authority.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolAuthority)){
					dataImmunizationRecommendationRecommendation.protocol_authority = "";
				}else{
					dataImmunizationRecommendationRecommendation.protocol_authority = recommendationProtocolAuthority;
				}
			}else{
			  recommendationProtocolAuthority = "";
			}

			if(typeof req.body.protocol.series !== 'undefined' && req.body.protocol.series !== ""){
				var recommendationProtocolSeries =  req.body.protocol.series.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolSeries)){
					dataImmunizationRecommendationRecommendation.protocol_series = "";
				}else{
					dataImmunizationRecommendationRecommendation.protocol_series = recommendationProtocolSeries;
				}
			}else{
			  recommendationProtocolSeries = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkImmunizationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_RECOMMENDATION_ID|" + immunizationRecommendationId, 'IMMUNIZATION_RECOMMENDATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									checkUniqeValue(apikey, "RECOMMENDATION__ID|" + immunizationRecommendationRecommendationId, 'IMMUNIZATION_RECOMMENDATION_RECOMMENDATION', function(resImmunizationRecommendationRecommendationID){
										if(resImmunizationRecommendationRecommendationID.err_code > 0){
											ApiFHIR.put('immunizationRecommendationRecommendation', {"apikey": apikey, "_id": immunizationRecommendationRecommendationId, "dr": "IMMUNIZATION_RECOMMENDATION_ID|"+immunizationRecommendationId}, {body: dataImmunizationRecommendationRecommendation, json: true}, function(error, response, body){
												immunizationRecommendationRecommendation = body;
												if(immunizationRecommendationRecommendation.err_code > 0){
													res.json(immunizationRecommendationRecommendation);	
												}else{
													res.json({"err_code": 0, "err_msg": "Immunization Recommendation Recommendation has been update in this Immunization Recommendation.", "data": immunizationRecommendationRecommendation.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Immunization Recommendation Recommendation Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Recommendation Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkRecommendationVaccineCode', function () {
							if (!validator.isEmpty(recommendationVaccineCode)) {
								checkCode(apikey, recommendationVaccineCode, 'VACCINE_CODE', function (resRecommendationVaccineCodeCode) {
									if (resRecommendationVaccineCodeCode.err_code > 0) {
										myEmitter.emit('checkImmunizationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Recommendation vaccine code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkImmunizationID');
							}
						})

						myEmitter.prependOnceListener('checkRecommendationTargetDisease', function () {
							if (!validator.isEmpty(recommendationTargetDisease)) {
								checkCode(apikey, recommendationTargetDisease, 'IMMUNIZATION_RECOMMENDATION_TARGET_DISEASE', function (resRecommendationTargetDiseaseCode) {
									if (resRecommendationTargetDiseaseCode.err_code > 0) {
										myEmitter.emit('checkRecommendationVaccineCode');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Recommendation target disease code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRecommendationVaccineCode');
							}
						})

						myEmitter.prependOnceListener('checkRecommendationForecastStatus', function () {
							if (!validator.isEmpty(recommendationForecastStatus)) {
								checkCode(apikey, recommendationForecastStatus, 'IMMUNIZATION_RECOMMENDATION_STATUS', function (resRecommendationForecastStatusCode) {
									if (resRecommendationForecastStatusCode.err_code > 0) {
										myEmitter.emit('checkRecommendationTargetDisease');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Recommendation forecast status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRecommendationTargetDisease');
							}
						})
						
						if (!validator.isEmpty(recommendationProtocolAuthority)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + recommendationProtocolAuthority, 'ORGANIZATION', function (resRecommendationProtocolAuthority) {
								if (resRecommendationProtocolAuthority.err_code > 0) {
									myEmitter.emit('checkRecommendationForecastStatus');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Recommendation protocol authority id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRecommendationForecastStatus');
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
		immunizationRecommendationDateCriterion: function updateImmunizationRecommendationDateCriterion(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var immunizationRecommendationId = req.params.immunization_recommendation_id;
			var immunizationRecommendationRecommendationId = req.params.immunization_recommendation_recommendation_id;
			var immunizationRecommendationDateCriterionId = req.params.immunization_recommendation_date_criterion_id;

			var err_code = 0;
			var err_msg = "";
			var dataImmunizationRecommendationDateCriterion = {};
			//input check 
			if(typeof immunizationRecommendationId !== 'undefined'){
				if(validator.isEmpty(immunizationRecommendationId)){
					err_code = 2;
					err_msg = "Immunization Recommendation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Recommendation id is required";
			}
			
			if(typeof immunizationRecommendationRecommendationId !== 'undefined'){
				if(validator.isEmpty(immunizationRecommendationRecommendationId)){
					err_code = 2;
					err_msg = "Immunization Recommendation Recommendation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Recommendation Recommendation id is required";
			}
			
			if(typeof immunizationRecommendationDateCriterionId !== 'undefined'){
				if(validator.isEmpty(immunizationRecommendationDateCriterionId)){
					err_code = 2;
					err_msg = "Immunization Recommendation Date Criterion id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Recommendation Date Criterion id is required";
			}
			
			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var recommendationDateCriterionCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(recommendationDateCriterionCode)){
					err_code = 2;
					err_msg = "immunization recommendation recommendation date criterion code is required.";
				}else{
					dataImmunizationRecommendationRecommendation.code = recommendationDateCriterionCode;
				}
			}else{
			  recommendationDateCriterionCode = "";
			}

			if(typeof req.body.value !== 'undefined' && req.body.value !== ""){
				var recommendationDateCriterionValue =  req.body.value;
				if(validator.isEmpty(recommendationDateCriterionValue)){
					err_code = 2;
					err_msg = "immunization recommendation recommendation date criterion value is required.";
				}else{
					if(!regex.test(recommendationDateCriterionValue)){
						err_code = 2;
						err_msg = "immunization recommendation recommendation date criterion value invalid date format.";	
					}else{
						dataImmunizationRecommendationRecommendation.value = recommendationDateCriterionValue;
					}
				}
			}else{
			  recommendationDateCriterionValue = "";
			} 

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkImmunizationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_RECOMMENDATION_ID|" + immunizationRecommendationId, 'IMMUNIZATION_RECOMMENDATION', function(resImmunizationRecommendationId){
								if(resImmunizationRecommendationId.err_code > 0){
									checkUniqeValue(apikey, "RECOMMENDATION__ID|" + immunizationRecommendationRecommendationId, 'IMMUNIZATION_RECOMMENDATION_RECOMMENDATION', function(resImmunizationRecommendationRecommendationId){
										if(resImmunizationRecommendationRecommendationId.err_code > 0){
											checkUniqeValue(apikey, "DATE_CREATION_ID|" + immunizationRecommendationDateCriterionId, 'RECOMMENDATION_DATE_CREATION', function(resImmunizationRecommendationDateCriterionID){
												if(resImmunizationRecommendationDateCriterionID.err_code > 0){
													ApiFHIR.put('immunizationRecommendationRecommendationDateCriterion', {"apikey": apikey, "_id": immunizationRecommendationDateCriterionId, "dr": "RECOMMENDATION_ID|"+immunizationRecommendationRecommendationId}, {body: dataImmunizationRecommendationDateCriterion, json: true}, function(error, response, body){
														immunizationRecommendationDateCriterion = body;
														if(immunizationRecommendationDateCriterion.err_code > 0){
															res.json(immunizationRecommendationDateCriterion);	
														}else{
															res.json({"err_code": 0, "err_msg": "Recommendation Date Criterion has been update in this Immunization Recommendation.", "data": immunizationRecommendationDateCriterion.data});
														}
													})
												}else{
													res.json({"err_code": 505, "err_msg": "Immunization Recommendation Recommendation Id not found"});		
												}
											})
										}else{
											res.json({"err_code": 504, "err_msg": "Immunization Recommendation Recommendation Id not found"});		
										}
									})	
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Recommendation Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(recommendationDateCriterionCode)) {
							checkCode(apikey, recommendationDateCriterionCode, 'IMMUNIZATION_RECOMMENDATION_DATE_CRITERION', function (resRecommendationDateCriterionCodeCode) {
								if (resRecommendationDateCriterionCodeCode.err_code > 0) {
									myEmitter.emit('checkImmunizationID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Recommendation date criterion code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkImmunizationID');
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

function getDateCriterionFunction(apikey, recommendationId){
	qString = {};
	qString.recommendation_id = recommendationId
	seedPhoenixFHIR.path.GET = {
		"ImmunizationRecommendationDateCriterion" : {
			"location": "%(apikey)s/ImmunizationRecommendationDateCriterion",
			"query": qString
		}
	}

	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

	ApiFHIR.get('ImmunizationRecommendationDateCriterion', {"apikey": apikey}, {}, function(error, response, body){
		immunizationRecommendationDateCriterion = JSON.parse(body);
		console.log(immunizationRecommendationDateCriterion);
		if(immunizationRecommendationDateCriterion.err_code == 0){
			//return immunizationRecommendationDateCriterion.data;
			x({"err_code": 0, "err_msg": "Member not found in this group."});	
		}else{
			x({"err_code": 2, "err_msg": "Member entity already exist in this group."});	
		}
	});
	//return "oke";
	
	function x(result){
		//callback(result)
		return result;
	}
}
module.exports = controller;