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
		riskAssessment : function getRiskAssessment(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var riskAssessmentId = req.query._id;
			var condition = req.query.condition;
			var date = req.query.date;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var method = req.query.method;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var probability = req.query.probability;
			var risk = req.query.risk;
			var subject = req.query.subject;
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
			
			if(typeof riskAssessmentId !== 'undefined'){
				if(!validator.isEmpty(riskAssessmentId)){
					qString._id = riskAssessmentId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Risk Assessment Id is required."});
				}
			}
			
			if(typeof condition !== 'undefined'){
				if(!validator.isEmpty(condition)){
					qString.condition = condition; 
				}else{
					res.json({"err_code": 1, "err_msg": "Condition is empty."});
				}
			}

			if(typeof date !== 'undefined'){
				if(!validator.isEmpty(date)){
					if(!regex.test(date)){
						res.json({"err_code": 1, "err_msg": "Date invalid format."});
					}else{
						qString.date = date; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Date is empty."});
				}
			}

			if(typeof encounter !== 'undefined'){
				if(!validator.isEmpty(encounter)){
					qString.encounter = encounter; 
				}else{
					res.json({"err_code": 1, "err_msg": "Encounter is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "Identifier is empty."});
				}
			}

			if(typeof method !== 'undefined'){
				if(!validator.isEmpty(method)){
					qString.method = method; 
				}else{
					res.json({"err_code": 1, "err_msg": "Method is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "Patient is empty."});
				}
			}

			if(typeof performer !== 'undefined'){
				if(!validator.isEmpty(performer)){
					qString.performer = performer; 
				}else{
					res.json({"err_code": 1, "err_msg": "Performer is empty."});
				}
			}

			if(typeof probability !== 'undefined'){
				if(!validator.isEmpty(probability)){
					qString.probability = probability; 
				}else{
					res.json({"err_code": 1, "err_msg": "Probability is empty."});
				}
			}

			if(typeof risk !== 'undefined'){
				if(!validator.isEmpty(risk)){
					qString.risk = risk; 
				}else{
					res.json({"err_code": 1, "err_msg": "Risk is empty."});
				}
			}

			if(typeof subject !== 'undefined'){
				if(!validator.isEmpty(subject)){
					qString.subject = subject; 
				}else{
					res.json({"err_code": 1, "err_msg": "Subject is empty."});
				}
			}

			seedPhoenixFHIR.path.GET = {
				"RiskAssessment" : {
					"location": "%(apikey)s/RiskAssessment",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('RiskAssessment', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var riskAssessment = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(riskAssessment.err_code == 0){
								//cek jumdata dulu
								if(riskAssessment.data.length > 0){
									newRiskAssessment = [];
									for(i=0; i < riskAssessment.data.length; i++){
										myEmitter.once("getIdentifier", function(riskAssessment, index, newRiskAssessment, countRiskAssessment){
											/*console.log(riskAssessment);*/
											//get identifier
											qString = {};
											qString.risk_assessment_id = riskAssessment.id;
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
													var objectRiskAssessment = {};
													objectRiskAssessment.resourceType = riskAssessment.resourceType;
													objectRiskAssessment.id = riskAssessment.id;
													objectRiskAssessment.identifier = identifier.data;
													objectRiskAssessment.basedOn = riskAssessment.basedOn;
													objectRiskAssessment.parent = riskAssessment.parent;
													objectRiskAssessment.status = riskAssessment.status;
													objectRiskAssessment.method = riskAssessment.method;
													objectRiskAssessment.code = riskAssessment.code;
													objectRiskAssessment.subject = riskAssessment.subject;
													objectRiskAssessment.context = riskAssessment.context;
													objectRiskAssessment.occurrence = riskAssessment.occurrence;
													objectRiskAssessment.condition = riskAssessment.condition;
													objectRiskAssessment.performer = riskAssessment.performer;
													objectRiskAssessment.reason = riskAssessment.reason;
													objectRiskAssessment.basis = riskAssessment.basis;
													objectRiskAssessment.mitigation = riskAssessment.mitigation;
													objectRiskAssessment.comment = riskAssessment.comment;
												
													newRiskAssessment[index] = objectRiskAssessment;

													myEmitter.once('getRiskAssessmentPrediction', function(riskAssessment, index, newRiskAssessment, countRiskAssessment){
														qString = {};
														qString.risk_assessment_id = riskAssessment.id;
														seedPhoenixFHIR.path.GET = {
															"RiskAssessmentPrediction" : {
																"location": "%(apikey)s/RiskAssessmentPrediction",
																"query": qString
															}
														}

														var ApiFHIR = new Apiclient(seedPhoenixFHIR);

														ApiFHIR.get('RiskAssessmentPrediction', {"apikey": apikey}, {}, function(error, response, body){
															riskAssessmentPrediction = JSON.parse(body);
															if(riskAssessmentPrediction.err_code == 0){
																var objectRiskAssessment = {};
																objectRiskAssessment.resourceType = riskAssessment.resourceType;
																objectRiskAssessment.id = riskAssessment.id;
																objectRiskAssessment.identifier = riskAssessment.identifier;
																objectRiskAssessment.basedOn = riskAssessment.basedOn;
																objectRiskAssessment.parent = riskAssessment.parent;
																objectRiskAssessment.status = riskAssessment.status;
																objectRiskAssessment.method = riskAssessment.method;
																objectRiskAssessment.code = riskAssessment.code;
																objectRiskAssessment.subject = riskAssessment.subject;
																objectRiskAssessment.context = riskAssessment.context;
																objectRiskAssessment.occurrence = riskAssessment.occurrence;
																objectRiskAssessment.condition = riskAssessment.condition;
																objectRiskAssessment.performer = riskAssessment.performer;
																objectRiskAssessment.reason = riskAssessment.reason;
																objectRiskAssessment.basis = riskAssessment.basis;
																objectRiskAssessment.prediction = riskAssessmentPrediction.data;
																objectRiskAssessment.mitigation = riskAssessment.mitigation;
																objectRiskAssessment.comment = riskAssessment.comment;
																newRiskAssessment[index] = objectRiskAssessment;
																if(index == countRiskAssessment -1 ){
																	res.json({"err_code": 0, "data":newRiskAssessment});
																}
															}else{
																res.json(riskAssessmentPrediction);			
															}
														})
													})
													myEmitter.emit('getRiskAssessmentPrediction', objectRiskAssessment, index, newRiskAssessment, countRiskAssessment);
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", riskAssessment.data[i], i, newRiskAssessment, riskAssessment.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Risk Assessment is empty."});	
								}
							}else{
								res.json(riskAssessment);
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
					var riskAssessmentId = req.params.risk_assessment_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "RISK_ASSESSMENT_ID|" + riskAssessmentId, 'RISK_ASSESSMENT', function(resRiskAssessmentID){
								if(resRiskAssessmentID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.risk_assessment_id = riskAssessmentId;
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
						  			qString.risk_assessment_id = riskAssessmentId;
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
									res.json({"err_code": 501, "err_msg": "Risk Assessment Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		riskAssessmentPrediction: function getRiskAssessmentPrediction(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var riskAssessmentId = req.params.risk_assessment_id;
			var riskAssessmentPredictionId = req.params.risk_assessment_prediction_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "RISK_ASSESSMENT_ID|" + riskAssessmentId, 'RISK_ASSESSMENT', function(resRiskAssessment){
						if(resRiskAssessment.err_code > 0){
							if(typeof riskAssessmentPredictionId !== 'undefined' && !validator.isEmpty(riskAssessmentPredictionId)){
								checkUniqeValue(apikey, "PREDICTION_ID|" + riskAssessmentPredictionId, 'RISK_ASSESSMENT_PREDICTION', function(resRiskAssessmentPredictionID){
									if(resRiskAssessmentPredictionID.err_code > 0){
										//get riskAssessmentPrediction
										qString = {};
										qString.risk_assessment_id = riskAssessmentId;
										qString._id = riskAssessmentPredictionId;
										seedPhoenixFHIR.path.GET = {
											"RiskAssessmentPrediction" : {
												"location": "%(apikey)s/RiskAssessmentPrediction",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('RiskAssessmentPrediction', {"apikey": apikey}, {}, function(error, response, body){
											riskAssessmentPrediction = JSON.parse(body);
											if(riskAssessmentPrediction.err_code == 0){
												res.json({"err_code": 0, "data":riskAssessmentPrediction.data});	
											}else{
												res.json(riskAssessmentPrediction);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Risk Assessment Prediction Id not found"});		
									}
								})
							}else{
								//get riskAssessmentPrediction
								qString = {};
								qString.risk_assessment_id = riskAssessmentId;
								seedPhoenixFHIR.path.GET = {
									"RiskAssessmentPrediction" : {
										"location": "%(apikey)s/RiskAssessmentPrediction",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('RiskAssessmentPrediction', {"apikey": apikey}, {}, function(error, response, body){
									riskAssessmentPrediction = JSON.parse(body);
									if(riskAssessmentPrediction.err_code == 0){
										res.json({"err_code": 0, "data":riskAssessmentPrediction.data});	
									}else{
										res.json(riskAssessmentPrediction);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Risk Assessment Id not found"});		
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
		riskAssessment : function addRiskAssessment(req, res){
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
basedOn|basedOn||
parent|parent||
status|status||nn
method|method||
code|code||
subject.patient|subjectPatient||
subject.group|subjectGroup||
context.encounter|contextEncounter||
context.episodeOfCare|contextEpisodeOfCare||
occurrence.occurrenceDateTime|occurrenceOccurrenceDateTime|date|
occurrence.occurrencePeriod|occurrenceOccurrencePeriod|period|
condition|condition||
performer.practitioner|performerPractitioner||
performer.device|performerDevice||
reason.reasonCodeableConcept|reasonReasonCodeableConcept||
reason.reasonReference|reasonReasonReference||
basis|basis||
prediction.outcome|predictionOutcome||nn
prediction.probability.probabilityDecimal|predictionProbabilityProbabilityDecimal|integer|
prediction.probability.probabilityRange|predictionProbabilityProbabilityRange|range|
prediction.qualitativeRisk|predictionQualitativeRisk||
prediction.relativeRisk|predictionRelativeRisk|integer|
prediction.when.whenPeriod|predictionWhenWhenPeriod|period|
prediction.when.whenRange|predictionWhenWhenRange|range|
prediction.rationale|predictionRationale||
mitigation|mitigation||
comment|comment||
*/
			if(typeof req.body.basedOn !== 'undefined'){
				var basedOn =  req.body.basedOn.trim().toLowerCase();
				if(validator.isEmpty(basedOn)){
					basedOn = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on' in json Risk Assessment request.";
			}

			if(typeof req.body.parent !== 'undefined'){
				var parent =  req.body.parent.trim().toLowerCase();
				if(validator.isEmpty(parent)){
					parent = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'parent' in json Risk Assessment request.";
			}

			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Risk Assessment status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Risk Assessment request.";
			}

			if(typeof req.body.method !== 'undefined'){
				var method =  req.body.method.trim().toLowerCase();
				if(validator.isEmpty(method)){
					method = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'method' in json Risk Assessment request.";
			}

			if(typeof req.body.code !== 'undefined'){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					code = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Risk Assessment request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Risk Assessment request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Risk Assessment request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Risk Assessment request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Risk Assessment request.";
			}

			if(typeof req.body.occurrence.occurrenceDateTime !== 'undefined'){
				var occurrenceOccurrenceDateTime =  req.body.occurrence.occurrenceDateTime;
				if(validator.isEmpty(occurrenceOccurrenceDateTime)){
					occurrenceOccurrenceDateTime = "";
				}else{
					if(!regex.test(occurrenceOccurrenceDateTime)){
						err_code = 2;
						err_msg = "Risk Assessment occurrence occurrence date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence date time' in json Risk Assessment request.";
			}

			if (typeof req.body.occurrence.occurrencePeriod !== 'undefined') {
			  var occurrenceOccurrencePeriod = req.body.occurrence.occurrencePeriod;
 				if(validator.isEmpty(occurrenceOccurrencePeriod)) {
				  var occurrenceOccurrencePeriodStart = "";
				  var occurrenceOccurrencePeriodEnd = "";
				} else {
				  if (occurrenceOccurrencePeriod.indexOf("to") > 0) {
				    arrOccurrenceOccurrencePeriod = occurrenceOccurrencePeriod.split("to");
				    var occurrenceOccurrencePeriodStart = arrOccurrenceOccurrencePeriod[0];
				    var occurrenceOccurrencePeriodEnd = arrOccurrenceOccurrencePeriod[1];
				    if (!regex.test(occurrenceOccurrencePeriodStart) && !regex.test(occurrenceOccurrencePeriodEnd)) {
				      err_code = 2;
				      err_msg = "Risk Assessment occurrence occurrence period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Risk Assessment occurrence occurrence period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'occurrence occurrence period' in json Risk Assessment request.";
			}

			if(typeof req.body.condition !== 'undefined'){
				var condition =  req.body.condition.trim().toLowerCase();
				if(validator.isEmpty(condition)){
					condition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition' in json Risk Assessment request.";
			}

			if(typeof req.body.performer.practitioner !== 'undefined'){
				var performerPractitioner =  req.body.performer.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerPractitioner)){
					performerPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer practitioner' in json Risk Assessment request.";
			}

			if(typeof req.body.performer.device !== 'undefined'){
				var performerDevice =  req.body.performer.device.trim().toLowerCase();
				if(validator.isEmpty(performerDevice)){
					performerDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer device' in json Risk Assessment request.";
			}

			if(typeof req.body.reason.reasonCodeableConcept !== 'undefined'){
				var reasonReasonCodeableConcept =  req.body.reason.reasonCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(reasonReasonCodeableConcept)){
					reasonReasonCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reason codeable concept' in json Risk Assessment request.";
			}

			if(typeof req.body.reason.reasonReference !== 'undefined'){
				var reasonReasonReference =  req.body.reason.reasonReference.trim().toLowerCase();
				if(validator.isEmpty(reasonReasonReference)){
					reasonReasonReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reason reference' in json Risk Assessment request.";
			}

			if(typeof req.body.basis !== 'undefined'){
				var basis =  req.body.basis.trim().toLowerCase();
				if(validator.isEmpty(basis)){
					basis = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'basis' in json Risk Assessment request.";
			}

			if(typeof req.body.prediction.outcome !== 'undefined'){
				var predictionOutcome =  req.body.prediction.outcome.trim().toLowerCase();
				if(validator.isEmpty(predictionOutcome)){
					err_code = 2;
					err_msg = "Risk Assessment prediction outcome is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prediction outcome' in json Risk Assessment request.";
			}

			if(typeof req.body.prediction.probability.probabilityDecimal !== 'undefined'){
				var predictionProbabilityProbabilityDecimal =  req.body.prediction.probability.probabilityDecimal;
				if(validator.isEmpty(predictionProbabilityProbabilityDecimal)){
					predictionProbabilityProbabilityDecimal = "";
				}else{
					if(!validator.isInt(predictionProbabilityProbabilityDecimal)){
						err_code = 2;
						err_msg = "Risk Assessment prediction probability probability decimal is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prediction probability probability decimal' in json Risk Assessment request.";
			}

			if (typeof req.body.prediction.probability.probabilityRange !== 'undefined') {
			  var predictionProbabilityProbabilityRange = req.body.prediction.probability.probabilityRange;
 				if(validator.isEmpty(predictionProbabilityProbabilityRange)){
				  var predictionProbabilityProbabilityRangeLow = "";
				  var predictionProbabilityProbabilityRangeHigh = "";
				} else {
				  if (predictionProbabilityProbabilityRange.indexOf("to") > 0) {
				    arrPredictionProbabilityProbabilityRange = predictionProbabilityProbabilityRange.split("to");
				    var predictionProbabilityProbabilityRangeLow = arrPredictionProbabilityProbabilityRange[0];
				    var predictionProbabilityProbabilityRangeHigh = arrPredictionProbabilityProbabilityRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Risk Assessment prediction probability probability range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'prediction probability probability range' in json Risk Assessment request.";
			}

			if(typeof req.body.prediction.qualitativeRisk !== 'undefined'){
				var predictionQualitativeRisk =  req.body.prediction.qualitativeRisk.trim().toLowerCase();
				if(validator.isEmpty(predictionQualitativeRisk)){
					predictionQualitativeRisk = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prediction qualitative risk' in json Risk Assessment request.";
			}

			if(typeof req.body.prediction.relativeRisk !== 'undefined'){
				var predictionRelativeRisk =  req.body.prediction.relativeRisk;
				if(validator.isEmpty(predictionRelativeRisk)){
					predictionRelativeRisk = "";
				}else{
					if(!validator.isInt(predictionRelativeRisk)){
						err_code = 2;
						err_msg = "Risk Assessment prediction relative risk is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prediction relative risk' in json Risk Assessment request.";
			}

			if (typeof req.body.prediction.when.whenPeriod !== 'undefined') {
			  var predictionWhenWhenPeriod = req.body.prediction.when.whenPeriod;
 				if(validator.isEmpty(predictionWhenWhenPeriod)) {
				  var predictionWhenWhenPeriodStart = "";
				  var predictionWhenWhenPeriodEnd = "";
				} else {
				  if (predictionWhenWhenPeriod.indexOf("to") > 0) {
				    arrPredictionWhenWhenPeriod = predictionWhenWhenPeriod.split("to");
				    var predictionWhenWhenPeriodStart = arrPredictionWhenWhenPeriod[0];
				    var predictionWhenWhenPeriodEnd = arrPredictionWhenWhenPeriod[1];
				    if (!regex.test(predictionWhenWhenPeriodStart) && !regex.test(predictionWhenWhenPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Risk Assessment prediction when when period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Risk Assessment prediction when when period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'prediction when when period' in json Risk Assessment request.";
			}

			if (typeof req.body.prediction.when.whenRange !== 'undefined') {
			  var predictionWhenWhenRange = req.body.prediction.when.whenRange;
 				if(validator.isEmpty(predictionWhenWhenRange)){
				  var predictionWhenWhenRangeLow = "";
				  var predictionWhenWhenRangeHigh = "";
				} else {
				  if (predictionWhenWhenRange.indexOf("to") > 0) {
				    arrPredictionWhenWhenRange = predictionWhenWhenRange.split("to");
				    var predictionWhenWhenRangeLow = arrPredictionWhenWhenRange[0];
				    var predictionWhenWhenRangeHigh = arrPredictionWhenWhenRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Risk Assessment prediction when when range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'prediction when when range' in json Risk Assessment request.";
			}

			if(typeof req.body.prediction.rationale !== 'undefined'){
				var predictionRationale =  req.body.prediction.rationale.trim().toLowerCase();
				if(validator.isEmpty(predictionRationale)){
					predictionRationale = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prediction rationale' in json Risk Assessment request.";
			}

			if(typeof req.body.mitigation !== 'undefined'){
				var mitigation =  req.body.mitigation.trim().toLowerCase();
				if(validator.isEmpty(mitigation)){
					mitigation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'mitigation' in json Risk Assessment request.";
			}

			if(typeof req.body.comment !== 'undefined'){
				var comment =  req.body.comment.trim().toLowerCase();
				if(validator.isEmpty(comment)){
					comment = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'comment' in json Risk Assessment request.";
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
														var riskAssessmentId = 'ras' + unicId;
														var riskAssessmentPredictionId = 'rap' + unicId;
												
														dataRiskAssessment = {
															"risk_assessment_id" : riskAssessmentId,
															"based_on" : basedOn,
															"parent" : parent,
															"status" : status,
															"method" : method,
															"code" : code,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"context_encounter" : contextEncounter,
															"context_episode_of_care" : contextEpisodeOfCare,
															"occurrence_date_time" : occurrenceOccurrenceDateTime,
															"occurrence_period_start" : occurrenceOccurrencePeriodStart,
															"occurrence_period_end" : occurrenceOccurrencePeriodEnd,
															"condition" : condition,
															"performer_practitioner" : performerPractitioner,
															"performer_device" : performerDevice,
															"reason_codeable_concept" : reasonReasonCodeableConcept,
															"reason_reference" : reasonReasonReference,
															"basis" : basis,
															"mitigation" : mitigation,
															"comment" : comment											
														}
														console.log(dataRiskAssessment);
														ApiFHIR.post('riskAssessment', {"apikey": apikey}, {body: dataRiskAssessment, json: true}, function(error, response, body){
															riskAssessment = body;
															if(riskAssessment.err_code > 0){
																res.json(riskAssessment);	
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
																							"risk_assessment_id": riskAssessmentId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
										
														//RiskAssessmentPrediction
														dataRiskAssessmentPrediction = {
															"prediction_id" : riskAssessmentPredictionId,
															"outcome" : predictionOutcome,
															"probability_decimal" : predictionProbabilityProbabilityDecimal,
															"probability_range_low" : predictionProbabilityProbabilityRangeLow,
															"probability_range_high" : predictionProbabilityProbabilityRangeHigh,
															"qualitative_risk" : predictionQualitativeRisk,
															"relative_risk" : predictionRelativeRisk,
															"when_period_start" : predictionWhenWhenPeriodStart,
															"when_period_end" : predictionWhenWhenPeriodEnd,
															"when_range_low" : predictionWhenWhenRangeLow,
															"when_range_high" : predictionWhenWhenRangeHigh,
															"rationale" : predictionRationale,
															"risk_assessment_id" : riskAssessmentId
														};
														ApiFHIR.post('riskAssessmentPrediction', {"apikey": apikey}, {body: dataRiskAssessmentPrediction, json: true}, function(error, response, body){
															riskAssessmentPrediction = body;
															if(riskAssessmentPrediction.err_code > 0){
																res.json(riskAssessmentPrediction);	
																console.log("ok");
															}
														});
														
														res.json({"err_code": 0, "err_msg": "Risk Assessment has been add.", "data": [{"_id": riskAssessmentId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
status|observation-status
predictionQualitativeRisk|risk-probability
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'OBSERVATION_STATUS', function (resStatusCode) {
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

										myEmitter.prependOnceListener('checkPredictionQualitativeRisk', function () {
											if (!validator.isEmpty(predictionQualitativeRisk)) {
												checkCode(apikey, predictionQualitativeRisk, 'RISK_PROBABILITY', function (resPredictionQualitativeRiskCode) {
													if (resPredictionQualitativeRiskCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Prediction qualitative risk code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})
								
										//cek value
										/*
subjectPatient|Patient
subjectGroup|Group
contextEncounter|Encounter
contextEpisodeOfCare|Episode_Of_Care
condition|condition
performerPractitioner|Practitioner
performerDevice|Device

										*/
										myEmitter.prependOnceListener('checkSubjectPatient', function () {
											if (!validator.isEmpty(subjectPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
													if (resSubjectPatient.err_code > 0) {
														myEmitter.emit('checkPredictionQualitativeRisk');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPredictionQualitativeRisk');
											}
										})

										myEmitter.prependOnceListener('checkSubjectGroup', function () {
											if (!validator.isEmpty(subjectGroup)) {
												checkUniqeValue(apikey, "GROUP_ID|" + subjectGroup, 'GROUP', function (resSubjectGroup) {
													if (resSubjectGroup.err_code > 0) {
														myEmitter.emit('checkSubjectPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject group id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubjectPatient');
											}
										})

										myEmitter.prependOnceListener('checkContextEncounter', function () {
											if (!validator.isEmpty(contextEncounter)) {
												checkUniqeValue(apikey, "ENCOUNTER_ID|" + contextEncounter, 'ENCOUNTER', function (resContextEncounter) {
													if (resContextEncounter.err_code > 0) {
														myEmitter.emit('checkSubjectGroup');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Context encounter id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubjectGroup');
											}
										})

										myEmitter.prependOnceListener('checkContextEpisodeOfCare', function () {
											if (!validator.isEmpty(contextEpisodeOfCare)) {
												checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + contextEpisodeOfCare, 'EPISODE_OF_CARE', function (resContextEpisodeOfCare) {
													if (resContextEpisodeOfCare.err_code > 0) {
														myEmitter.emit('checkContextEncounter');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Context episode of care id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEncounter');
											}
										})

										myEmitter.prependOnceListener('checkCondition', function () {
											if (!validator.isEmpty(condition)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + condition, 'CONDITION', function (resCondition) {
													if (resCondition.err_code > 0) {
														myEmitter.emit('checkContextEpisodeOfCare');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Condition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEpisodeOfCare');
											}
										})

										myEmitter.prependOnceListener('checkPerformerPractitioner', function () {
											if (!validator.isEmpty(performerPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + performerPractitioner, 'PRACTITIONER', function (resPerformerPractitioner) {
													if (resPerformerPractitioner.err_code > 0) {
														myEmitter.emit('checkCondition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCondition');
											}
										})

										if (!validator.isEmpty(performerDevice)) {
											checkUniqeValue(apikey, "DEVICE_ID|" + performerDevice, 'DEVICE', function (resPerformerDevice) {
												if (resPerformerDevice.err_code > 0) {
													myEmitter.emit('checkPerformerPractitioner');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Performer device id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkPerformerPractitioner');
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
			var riskAssessmentId = req.params.risk_assessment_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof riskAssessmentId !== 'undefined'){
				if(validator.isEmpty(riskAssessmentId)){
					err_code = 2;
					err_msg = "Risk Assessment id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Risk Assessment id is required";
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
												checkUniqeValue(apikey, "RISK_ASSESSMENT_ID|" + riskAssessmentId, 'RISK_ASSESSMENT', function(resRiskAssessmentID){
													if(resRiskAssessmentID.err_code > 0){
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
																							"risk_assessment_id": riskAssessmentId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Risk Assessment.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Risk Assessment Id not found"});		
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
		riskAssessmentPrediction: function addRiskAssessmentPrediction(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var riskAssessmentId = req.params.risk_assessment_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof riskAssessmentId !== 'undefined'){
				if(validator.isEmpty(riskAssessmentId)){
					err_code = 2;
					err_msg = "Risk Assessment id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Risk Assessment id is required";
			}
			
			if(typeof req.body.outcome !== 'undefined'){
				var predictionOutcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(predictionOutcome)){
					err_code = 2;
					err_msg = "Risk Assessment prediction outcome is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prediction outcome' in json Risk Assessment request.";
			}

			if(typeof req.body.probability.probabilityDecimal !== 'undefined'){
				var predictionProbabilityProbabilityDecimal =  req.body.probability.probabilityDecimal;
				if(validator.isEmpty(predictionProbabilityProbabilityDecimal)){
					predictionProbabilityProbabilityDecimal = "";
				}else{
					if(!validator.isInt(predictionProbabilityProbabilityDecimal)){
						err_code = 2;
						err_msg = "Risk Assessment prediction probability probability decimal is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prediction probability probability decimal' in json Risk Assessment request.";
			}

			if (typeof req.body.probability.probabilityRange !== 'undefined') {
			  var predictionProbabilityProbabilityRange = req.body.probability.probabilityRange;
 				if(validator.isEmpty(predictionProbabilityProbabilityRange)){
				  var predictionProbabilityProbabilityRangeLow = "";
				  var predictionProbabilityProbabilityRangeHigh = "";
				} else {
				  if (predictionProbabilityProbabilityRange.indexOf("to") > 0) {
				    arrPredictionProbabilityProbabilityRange = predictionProbabilityProbabilityRange.split("to");
				    var predictionProbabilityProbabilityRangeLow = arrPredictionProbabilityProbabilityRange[0];
				    var predictionProbabilityProbabilityRangeHigh = arrPredictionProbabilityProbabilityRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Risk Assessment prediction probability probability range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'prediction probability probability range' in json Risk Assessment request.";
			}

			if(typeof req.body.qualitativeRisk !== 'undefined'){
				var predictionQualitativeRisk =  req.body.qualitativeRisk.trim().toLowerCase();
				if(validator.isEmpty(predictionQualitativeRisk)){
					predictionQualitativeRisk = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prediction qualitative risk' in json Risk Assessment request.";
			}

			if(typeof req.body.relativeRisk !== 'undefined'){
				var predictionRelativeRisk =  req.body.relativeRisk;
				if(validator.isEmpty(predictionRelativeRisk)){
					predictionRelativeRisk = "";
				}else{
					if(!validator.isInt(predictionRelativeRisk)){
						err_code = 2;
						err_msg = "Risk Assessment prediction relative risk is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prediction relative risk' in json Risk Assessment request.";
			}

			if (typeof req.body.when.whenPeriod !== 'undefined') {
			  var predictionWhenWhenPeriod = req.body.when.whenPeriod;
 				if(validator.isEmpty(predictionWhenWhenPeriod)) {
				  var predictionWhenWhenPeriodStart = "";
				  var predictionWhenWhenPeriodEnd = "";
				} else {
				  if (predictionWhenWhenPeriod.indexOf("to") > 0) {
				    arrPredictionWhenWhenPeriod = predictionWhenWhenPeriod.split("to");
				    var predictionWhenWhenPeriodStart = arrPredictionWhenWhenPeriod[0];
				    var predictionWhenWhenPeriodEnd = arrPredictionWhenWhenPeriod[1];
				    if (!regex.test(predictionWhenWhenPeriodStart) && !regex.test(predictionWhenWhenPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Risk Assessment prediction when when period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Risk Assessment prediction when when period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'prediction when when period' in json Risk Assessment request.";
			}

			if (typeof req.body.when.whenRange !== 'undefined') {
			  var predictionWhenWhenRange = req.body.when.whenRange;
 				if(validator.isEmpty(predictionWhenWhenRange)){
				  var predictionWhenWhenRangeLow = "";
				  var predictionWhenWhenRangeHigh = "";
				} else {
				  if (predictionWhenWhenRange.indexOf("to") > 0) {
				    arrPredictionWhenWhenRange = predictionWhenWhenRange.split("to");
				    var predictionWhenWhenRangeLow = arrPredictionWhenWhenRange[0];
				    var predictionWhenWhenRangeHigh = arrPredictionWhenWhenRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Risk Assessment prediction when when range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'prediction when when range' in json Risk Assessment request.";
			}

			if(typeof req.body.rationale !== 'undefined'){
				var predictionRationale =  req.body.rationale.trim().toLowerCase();
				if(validator.isEmpty(predictionRationale)){
					predictionRationale = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prediction rationale' in json Risk Assessment request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkRiskAssessmentID', function(){
							checkUniqeValue(apikey, "RISK_ASSESSMENT_ID|" + riskAssessmentId, 'RISK_ASSESSMENT', function(resRiskAssessmentID){
								if(resRiskAssessmentID.err_code > 0){
									var unicId = uniqid.time();
									var riskAssessmentPredictionId = 'rap' + unicId;
									//RiskAssessmentPrediction
									dataRiskAssessmentPrediction = {
										"prediction_id" : riskAssessmentPredictionId,
										"outcome" : predictionOutcome,
										"probability_decimal" : predictionProbabilityProbabilityDecimal,
										"probability_range_low" : predictionProbabilityProbabilityRangeLow,
										"probability_range_high" : predictionProbabilityProbabilityRangeHigh,
										"qualitative_risk" : predictionQualitativeRisk,
										"relative_risk" : predictionRelativeRisk,
										"when_period_start" : predictionWhenWhenPeriodStart,
										"when_period_end" : predictionWhenWhenPeriodEnd,
										"when_range_low" : predictionWhenWhenRangeLow,
										"when_range_high" : predictionWhenWhenRangeHigh,
										"rationale" : predictionRationale,
										"risk_assessment_id" : riskAssessmentId
									}
									ApiFHIR.post('riskAssessmentPrediction', {"apikey": apikey}, {body: dataRiskAssessmentPrediction, json: true}, function(error, response, body){
										riskAssessmentPrediction = body;
										if(riskAssessmentPrediction.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Risk Assessment Prediction has been add in this Risk Assessment.", "data": riskAssessmentPrediction.data});
										}else{
											res.json(riskAssessmentPrediction);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Risk Assessment Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(predictionQualitativeRisk)) {
							checkCode(apikey, predictionQualitativeRisk, 'RISK_PROBABILITY', function (resPredictionQualitativeRiskCode) {
								if (resPredictionQualitativeRiskCode.err_code > 0) {
									myEmitter.emit('checkRiskAssessmentID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Prediction qualitative risk code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRiskAssessmentID');
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
		riskAssessment : function putRiskAssessment(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var riskAssessmentId = req.params.risk_assessment_id;

      var err_code = 0;
      var err_msg = "";
      var dataRiskAssessment = {};

			if(typeof riskAssessmentId !== 'undefined'){
				if(validator.isEmpty(riskAssessmentId)){
					err_code = 2;
					err_msg = "Risk Assessment id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Risk Assessment id is required";
			}

			/*
			var based_on = req.body.based_on;
			var parent = req.body.parent;
			var status = req.body.status;
			var method = req.body.method;
			var code = req.body.code;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var occurrence_date_time = req.body.occurrence_date_time;
			var occurrence_period_start = req.body.occurrence_period_start;
			var occurrence_period_end = req.body.occurrence_period_end;
			var condition = req.body.condition;
			var performer_practitioner = req.body.performer_practitioner;
			var performer_device = req.body.performer_device;
			var reason_codeable_concept = req.body.reason_codeable_concept;
			var reason_reference = req.body.reason_reference;
			var basis = req.body.basis;
			var mitigation = req.body.mitigation;
			var comment = req.body.comment;
			*/
			if(typeof req.body.basedOn !== 'undefined' && req.body.basedOn !== ""){
				var basedOn =  req.body.basedOn.trim().toLowerCase();
				if(validator.isEmpty(basedOn)){
					dataRiskAssessment.based_on = "";
				}else{
					dataRiskAssessment.based_on = basedOn;
				}
			}else{
			  basedOn = "";
			}

			if(typeof req.body.parent !== 'undefined' && req.body.parent !== ""){
				var parent =  req.body.parent.trim().toLowerCase();
				if(validator.isEmpty(parent)){
					dataRiskAssessment.parent = "";
				}else{
					dataRiskAssessment.parent = parent;
				}
			}else{
			  parent = "";
			}

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "risk assessment status is required.";
				}else{
					dataRiskAssessment.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.method !== 'undefined' && req.body.method !== ""){
				var method =  req.body.method.trim().toLowerCase();
				if(validator.isEmpty(method)){
					dataRiskAssessment.method = "";
				}else{
					dataRiskAssessment.method = method;
				}
			}else{
			  method = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					dataRiskAssessment.code = "";
				}else{
					dataRiskAssessment.code = code;
				}
			}else{
			  code = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataRiskAssessment.subject_patient = "";
				}else{
					dataRiskAssessment.subject_patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataRiskAssessment.subject_group = "";
				}else{
					dataRiskAssessment.subject_group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					dataRiskAssessment.context_encounter = "";
				}else{
					dataRiskAssessment.context_encounter = contextEncounter;
				}
			}else{
			  contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					dataRiskAssessment.context_episode_of_care = "";
				}else{
					dataRiskAssessment.context_episode_of_care = contextEpisodeOfCare;
				}
			}else{
			  contextEpisodeOfCare = "";
			}

			if(typeof req.body.occurrence.occurrenceDateTime !== 'undefined' && req.body.occurrence.occurrenceDateTime !== ""){
				var occurrenceOccurrenceDateTime =  req.body.occurrence.occurrenceDateTime;
				if(validator.isEmpty(occurrenceOccurrenceDateTime)){
					err_code = 2;
					err_msg = "risk assessment occurrence occurrence date time is required.";
				}else{
					if(!regex.test(occurrenceOccurrenceDateTime)){
						err_code = 2;
						err_msg = "risk assessment occurrence occurrence date time invalid date format.";	
					}else{
						dataRiskAssessment.occurrence_date_time = occurrenceOccurrenceDateTime;
					}
				}
			}else{
			  occurrenceOccurrenceDateTime = "";
			}

			if (typeof req.body.occurrence.occurrencePeriod !== 'undefined' && req.body.occurrence.occurrencePeriod !== "") {
			  var occurrenceOccurrencePeriod = req.body.occurrence.occurrencePeriod;
			  if (occurrenceOccurrencePeriod.indexOf("to") > 0) {
			    arrOccurrenceOccurrencePeriod = occurrenceOccurrencePeriod.split("to");
			    dataRiskAssessment.occurrence_period_start = arrOccurrenceOccurrencePeriod[0];
			    dataRiskAssessment.occurrence_period_end = arrOccurrenceOccurrencePeriod[1];
			    if (!regex.test(occurrenceOccurrencePeriodStart) && !regex.test(occurrenceOccurrencePeriodEnd)) {
			      err_code = 2;
			      err_msg = "risk assessment occurrence occurrence period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "risk assessment occurrence occurrence period invalid date format.";
				}
			} else {
			  occurrenceOccurrencePeriod = "";
			}

			if(typeof req.body.condition !== 'undefined' && req.body.condition !== ""){
				var condition =  req.body.condition.trim().toLowerCase();
				if(validator.isEmpty(condition)){
					dataRiskAssessment.condition = "";
				}else{
					dataRiskAssessment.condition = condition;
				}
			}else{
			  condition = "";
			}

			if(typeof req.body.performer.practitioner !== 'undefined' && req.body.performer.practitioner !== ""){
				var performerPractitioner =  req.body.performer.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerPractitioner)){
					dataRiskAssessment.performer_practitioner = "";
				}else{
					dataRiskAssessment.performer_practitioner = performerPractitioner;
				}
			}else{
			  performerPractitioner = "";
			}

			if(typeof req.body.performer.device !== 'undefined' && req.body.performer.device !== ""){
				var performerDevice =  req.body.performer.device.trim().toLowerCase();
				if(validator.isEmpty(performerDevice)){
					dataRiskAssessment.performer_device = "";
				}else{
					dataRiskAssessment.performer_device = performerDevice;
				}
			}else{
			  performerDevice = "";
			}

			if(typeof req.body.reason.reasonCodeableConcept !== 'undefined' && req.body.reason.reasonCodeableConcept !== ""){
				var reasonReasonCodeableConcept =  req.body.reason.reasonCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(reasonReasonCodeableConcept)){
					dataRiskAssessment.reason_codeable_concept = "";
				}else{
					dataRiskAssessment.reason_codeable_concept = reasonReasonCodeableConcept;
				}
			}else{
			  reasonReasonCodeableConcept = "";
			}

			if(typeof req.body.reason.reasonReference !== 'undefined' && req.body.reason.reasonReference !== ""){
				var reasonReasonReference =  req.body.reason.reasonReference.trim().toLowerCase();
				if(validator.isEmpty(reasonReasonReference)){
					dataRiskAssessment.reason_reference = "";
				}else{
					dataRiskAssessment.reason_reference = reasonReasonReference;
				}
			}else{
			  reasonReasonReference = "";
			}

			if(typeof req.body.basis !== 'undefined' && req.body.basis !== ""){
				var basis =  req.body.basis.trim().toLowerCase();
				if(validator.isEmpty(basis)){
					dataRiskAssessment.basis = "";
				}else{
					dataRiskAssessment.basis = basis;
				}
			}else{
			  basis = "";
			}

			if(typeof req.body.mitigation !== 'undefined' && req.body.mitigation !== ""){
				var mitigation =  req.body.mitigation.trim().toLowerCase();
				if(validator.isEmpty(mitigation)){
					dataRiskAssessment.mitigation = "";
				}else{
					dataRiskAssessment.mitigation = mitigation;
				}
			}else{
			  mitigation = "";
			}

			if(typeof req.body.comment !== 'undefined' && req.body.comment !== ""){
				var comment =  req.body.comment.trim().toLowerCase();
				if(validator.isEmpty(comment)){
					dataRiskAssessment.comment = "";
				}else{
					dataRiskAssessment.comment = comment;
				}
			}else{
			  comment = "";
			}

			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkRiskAssessmentId', function(){
						checkUniqeValue(apikey, "RISK_ASSESSMENT_ID|" + riskAssessmentId, 'RISK_ASSESSMENT', function(resRiskAssessmentId){
							if(resRiskAssessmentId.err_code > 0){
								ApiFHIR.put('riskAssessment', {"apikey": apikey, "_id": riskAssessmentId}, {body: dataRiskAssessment, json: true}, function(error, response, body){
									riskAssessment = body;
									if(riskAssessment.err_code > 0){
										res.json(riskAssessment);	
									}else{
										res.json({"err_code": 0, "err_msg": "Risk Assessment has been update.", "data": [{"_id": riskAssessmentId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Risk Assessment Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkStatus', function () {
						if (!validator.isEmpty(status)) {
							checkCode(apikey, status, 'OBSERVATION_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) {
									myEmitter.emit('checkRiskAssessmentId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRiskAssessmentId');
						}
					})

					myEmitter.prependOnceListener('checkSubjectPatient', function () {
						if (!validator.isEmpty(subjectPatient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
								if (resSubjectPatient.err_code > 0) {
									myEmitter.emit('checkStatus');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkStatus');
						}
					})

					myEmitter.prependOnceListener('checkSubjectGroup', function () {
						if (!validator.isEmpty(subjectGroup)) {
							checkUniqeValue(apikey, "GROUP_ID|" + subjectGroup, 'GROUP', function (resSubjectGroup) {
								if (resSubjectGroup.err_code > 0) {
									myEmitter.emit('checkSubjectPatient');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject group id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSubjectPatient');
						}
					})

					myEmitter.prependOnceListener('checkContextEncounter', function () {
						if (!validator.isEmpty(contextEncounter)) {
							checkUniqeValue(apikey, "ENCOUNTER_ID|" + contextEncounter, 'ENCOUNTER', function (resContextEncounter) {
								if (resContextEncounter.err_code > 0) {
									myEmitter.emit('checkSubjectGroup');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Context encounter id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSubjectGroup');
						}
					})

					myEmitter.prependOnceListener('checkContextEpisodeOfCare', function () {
						if (!validator.isEmpty(contextEpisodeOfCare)) {
							checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + contextEpisodeOfCare, 'EPISODE_OF_CARE', function (resContextEpisodeOfCare) {
								if (resContextEpisodeOfCare.err_code > 0) {
									myEmitter.emit('checkContextEncounter');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Context episode of care id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkContextEncounter');
						}
					})

					myEmitter.prependOnceListener('checkCondition', function () {
						if (!validator.isEmpty(condition)) {
							checkUniqeValue(apikey, "CONDITION_ID|" + condition, 'CONDITION', function (resCondition) {
								if (resCondition.err_code > 0) {
									myEmitter.emit('checkContextEpisodeOfCare');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Condition id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkContextEpisodeOfCare');
						}
					})

					myEmitter.prependOnceListener('checkPerformerPractitioner', function () {
						if (!validator.isEmpty(performerPractitioner)) {
							checkUniqeValue(apikey, "PRACTITIONER_ID|" + performerPractitioner, 'PRACTITIONER', function (resPerformerPractitioner) {
								if (resPerformerPractitioner.err_code > 0) {
									myEmitter.emit('checkCondition');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Performer practitioner id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCondition');
						}
					})

					if (!validator.isEmpty(performerDevice)) {
						checkUniqeValue(apikey, "DEVICE_ID|" + performerDevice, 'DEVICE', function (resPerformerDevice) {
							if (resPerformerDevice.err_code > 0) {
								myEmitter.emit('checkPerformerPractitioner');
							} else {
								res.json({
									"err_code": "500",
									"err_msg": "Performer device id not found"
								});
							}
						})
					} else {
						myEmitter.emit('checkPerformerPractitioner');
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
			var riskAssessmentId = req.params.risk_assessment_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof riskAssessmentId !== 'undefined'){
				if(validator.isEmpty(riskAssessmentId)){
					err_code = 2;
					err_msg = "Risk Assessment id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Risk Assessment id is required";
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
						myEmitter.prependOnceListener('checkRiskAssessmentID', function(){
							checkUniqeValue(apikey, "RISK_ASSESSMENT_ID|" + riskAssessmentId, 'RISK_ASSESSMENT', function(resRiskAssessmentID){
								if(resRiskAssessmentID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "RISK_ASSESSMENT_ID|"+riskAssessmentId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Risk Assessment.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Risk Assessment Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkRiskAssessmentID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkRiskAssessmentID');				
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
		riskAssessmentPrediction: function updateRiskAssessmentPrediction(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var riskAssessmentId = req.params.risk_assessment_id;
			var riskAssessmentPredictionId = req.params.risk_assessment_prediction_id;

			var err_code = 0;
			var err_msg = "";
			var dataRiskAssessment = {};
			//input check 
			if(typeof riskAssessmentId !== 'undefined'){
				if(validator.isEmpty(riskAssessmentId)){
					err_code = 2;
					err_msg = "Risk Assessment id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Risk Assessment id is required";
			}

			if(typeof riskAssessmentPredictionId !== 'undefined'){
				if(validator.isEmpty(riskAssessmentPredictionId)){
					err_code = 2;
					err_msg = "Risk Assessment Prediction id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Risk Assessment Prediction id is required";
			}
			
			/*
			var outcome = req.body.outcome;
			var probability_decimal = req.body.probability_decimal;
			var probability_range_low = req.body.probability_range_low;
			var probability_range_high = req.body.probability_range_high;
			var qualitative_risk = req.body.qualitative_risk;
			var relative_risk = req.body.relative_risk;
			var when_period_start = req.body.when_period_start;
			var when_period_end = req.body.when_period_end;
			var when_range_low = req.body.when_range_low;
			var when_range_high = req.body.when_range_high;
			var rationale = req.body.rationale;
			var risk_assessment_id = req.body.risk_assessment_id;
			*/
			if(typeof req.body.outcome !== 'undefined' && req.body.outcome !== ""){
				var predictionOutcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(predictionOutcome)){
					err_code = 2;
					err_msg = "risk assessment prediction outcome is required.";
				}else{
					dataRiskAssessment.outcome = predictionOutcome;
				}
			}else{
			  predictionOutcome = "";
			}

			if(typeof req.body.probability.probabilityDecimal !== 'undefined' && req.body.probability.probabilityDecimal !== ""){
				var predictionProbabilityProbabilityDecimal =  req.body.probability.probabilityDecimal;
				if(validator.isEmpty(predictionProbabilityProbabilityDecimal)){
					dataRiskAssessment.probability_decimal = "";
				}else{
					if(!validator.isInt(predictionProbabilityProbabilityDecimal)){
						err_code = 2;
						err_msg = "risk assessment prediction probability probability decimal is must be number.";
					}else{
						dataRiskAssessment.probability_decimal = predictionProbabilityProbabilityDecimal;
					}
				}
			}else{
			  predictionProbabilityProbabilityDecimal = "";
			}

			if (typeof req.body.probability.probabilityRange !== 'undefined' && req.body.probability.probabilityRange !== "") {
			  var predictionProbabilityProbabilityRange = req.body.probability.probabilityRange;
			  if (predictionProbabilityProbabilityRange.indexOf("to") > 0) {
			    arrPredictionProbabilityProbabilityRange = predictionProbabilityProbabilityRange.split("to");
			    dataRiskAssessment.probability_range_low = arrPredictionProbabilityProbabilityRange[0];
			    dataRiskAssessment.probability_range_high = arrPredictionProbabilityProbabilityRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "risk assessment prediction probability probability range invalid range format.";
				}
			} else {
			  predictionProbabilityProbabilityRange = "";
			}

			if(typeof req.body.qualitativeRisk !== 'undefined' && req.body.qualitativeRisk !== ""){
				var predictionQualitativeRisk =  req.body.qualitativeRisk.trim().toLowerCase();
				if(validator.isEmpty(predictionQualitativeRisk)){
					dataRiskAssessment.qualitative_risk = "";
				}else{
					dataRiskAssessment.qualitative_risk = predictionQualitativeRisk;
				}
			}else{
			  predictionQualitativeRisk = "";
			}

			if(typeof req.body.relativeRisk !== 'undefined' && req.body.relativeRisk !== ""){
				var predictionRelativeRisk =  req.body.relativeRisk;
				if(validator.isEmpty(predictionRelativeRisk)){
					dataRiskAssessment.relative_risk = "";
				}else{
					if(!validator.isInt(predictionRelativeRisk)){
						err_code = 2;
						err_msg = "risk assessment prediction relative risk is must be number.";
					}else{
						dataRiskAssessment.relative_risk = predictionRelativeRisk;
					}
				}
			}else{
			  predictionRelativeRisk = "";
			}

			if (typeof req.body.when.whenPeriod !== 'undefined' && req.body.when.whenPeriod !== "") {
			  var predictionWhenWhenPeriod = req.body.when.whenPeriod;
			  if (predictionWhenWhenPeriod.indexOf("to") > 0) {
			    arrPredictionWhenWhenPeriod = predictionWhenWhenPeriod.split("to");
			    dataRiskAssessment.when_period_start = arrPredictionWhenWhenPeriod[0];
			    dataRiskAssessment.when_period_end = arrPredictionWhenWhenPeriod[1];
			    if (!regex.test(predictionWhenWhenPeriodStart) && !regex.test(predictionWhenWhenPeriodEnd)) {
			      err_code = 2;
			      err_msg = "risk assessment prediction when when period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "risk assessment prediction when when period invalid date format.";
				}
			} else {
			  predictionWhenWhenPeriod = "";
			}

			if (typeof req.body.when.whenRange !== 'undefined' && req.body.when.whenRange !== "") {
			  var predictionWhenWhenRange = req.body.when.whenRange;
			  if (predictionWhenWhenRange.indexOf("to") > 0) {
			    arrPredictionWhenWhenRange = predictionWhenWhenRange.split("to");
			    dataRiskAssessment.when_range_low = arrPredictionWhenWhenRange[0];
			    dataRiskAssessment.when_range_high = arrPredictionWhenWhenRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "risk assessment prediction when when range invalid range format.";
				}
			} else {
			  predictionWhenWhenRange = "";
			}

			if(typeof req.body.rationale !== 'undefined' && req.body.rationale !== ""){
				var predictionRationale =  req.body.rationale.trim().toLowerCase();
				if(validator.isEmpty(predictionRationale)){
					dataRiskAssessment.rationale = "";
				}else{
					dataRiskAssessment.rationale = predictionRationale;
				}
			}else{
			  predictionRationale = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkRiskAssessmentID', function(){
							checkUniqeValue(apikey, "RISK_ASSESSMENT_ID|" + riskAssessmentId, 'RISK_ASSESSMENT', function(resRiskAssessmentId){
								if(resRiskAssessmentId.err_code > 0){
									checkUniqeValue(apikey, "PREDICTION_ID|" + riskAssessmentPredictionId, 'RISK_ASSESSMENT_PREDICTION', function(resRiskAssessmentPredictionID){
										if(resRiskAssessmentPredictionID.err_code > 0){
											ApiFHIR.put('riskAssessmentPrediction', {"apikey": apikey, "_id": riskAssessmentPredictionId, "dr": "RISK_ASSESSMENT_ID|"+riskAssessmentId}, {body: dataRiskAssessment, json: true}, function(error, response, body){
												riskAssessmentPrediction = body;
												if(riskAssessmentPrediction.err_code > 0){
													res.json(riskAssessmentPrediction);	
												}else{
													res.json({"err_code": 0, "err_msg": "Risk Assessment prediction has been update in this Risk Assessment.", "data": riskAssessmentPrediction.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "RiskAssessment prediction Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Risk Assessment Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(predictionQualitativeRisk)) {
							checkCode(apikey, predictionQualitativeRisk, 'RISK_PROBABILITY', function (resPredictionQualitativeRiskCode) {
								if (resPredictionQualitativeRiskCode.err_code > 0) {
									myEmitter.emit('checkRiskAssessmentID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Prediction qualitative risk code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRiskAssessmentID');
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