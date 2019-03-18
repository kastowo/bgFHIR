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
		carePlan : function getCarePlan(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			/*var carePlanId = req.query._id;
			var category = req.query.category;
			var date=req.query.date;
			var location=req.query.location;
			var reaction=req.query.reaction;
			var recorder=req.query.recorder;
			var seriousness=req.query.seriousness;			
			var study=req.query.study;
			var subject=req.query.subject;
			var substance=req.query.substance;
			var type=req.query.type;

			if(typeof carePlanId !== 'undefined'){
				if(!validator.isEmpty(carePlanId)){
					qString.carePlanId = carePlanId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Adverse Event Id is required."});
				}
			}

			if(typeof category !== 'undefined'){
				if(!validator.isEmpty(category)){
					qString.category = category; 
				}else{
					res.json({"err_code": 1, "err_msg": "Category is required."});
				}
			}

			if(typeof date !== 'undefined'){
				if(!validator.isEmpty(date)){
					qString.date = date; 
				}else{
					res.json({"err_code": 1, "err_msg": "Date is empty."});
				}
			}

			if(typeof location !== 'undefined'){
				if(!validator.isEmpty(location)){
					qString.location = location;
				}else{
					res.json({"err_code": 1, "err_msg": "Location is empty."});
				}
			}

			if(typeof reaction !== 'undefined'){
				if(!validator.isEmpty(reaction)){
					qString.reaction = reaction;
				}else{
					res.json({"err_code": 1, "err_msg": "Reaction is empty."});
				}
			}

			if(typeof seriousness !== 'undefined'){
				if(!validator.isEmpty(seriousness)){
					qString.seriousness = seriousness;
				}else{
					res.json({"err_code": 1, "err_msg": "Seriousness of is empty."});
				}
			}	

			if(typeof study !== 'undefined'){
				if(!validator.isEmpty(study)){
					qString.study = study;
				}else{
					res.json({"err_code": 1, "err_msg": "Study of is empty."});
				}
			}

			if(typeof subject !== 'undefined'){
				if(!validator.isEmpty(subject)){
					qString.subject = subject;
				}else{
					res.json({"err_code": 1, "err_msg": "Subject of is empty."});
				}
			}

			if(typeof substance !== 'undefined'){
				if(!validator.isEmpty(substance)){
					qString.substance = substance;
				}else{
					res.json({"err_code": 1, "err_msg": "Substance of is empty."});
				}
			}

			if(typeof type !== 'undefined'){
				if(!validator.isEmpty(type)){
					qString.type = type;
				}else{
					res.json({"err_code": 1, "err_msg": "Type of is empty."});
				}
			}*/

			seedPhoenixFHIR.path.GET = {
				"CarePlan" : {
					"location": "%(apikey)s/CarePlan",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('CarePlan', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var carePlan = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(carePlan.err_code == 0){
								//cek jumdata dulu
								if(carePlan.data.length > 0){
									newCarePlan = [];
									for(i=0; i < carePlan.data.length; i++){
										myEmitter.once("getIdentifier", function(carePlan, index, newCarePlan, countCarePlan){
											console.log(carePlan);
														//get identifier
														qString = {};
														qString.care_plan_id = carePlan.id;
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
																var objectCarePlan = {};
																objectCarePlan.resourceType = carePlan.resourceType;
																objectCarePlan.id = carePlan.id;
																objectCarePlan.identifier = identifier.data;
																objectCarePlan.based_on = carePlan.based_on;
																objectCarePlan.replaces = carePlan.replaces;
																objectCarePlan.part_of = carePlan.part_of;
																objectCarePlan.status = carePlan.status;
																objectCarePlan.intent = carePlan.intent;
																objectCarePlan.category = carePlan.category;
																objectCarePlan.title = carePlan.title;
																objectCarePlan.subject = carePlan.subject;
																objectCarePlan.context = carePlan.context;
																objectCarePlan.period = carePlan.period;
																objectCarePlan.supportingInfo = carePlan.supportingInfo;
																
																newCarePlan[index] = objectCarePlan;
																
																/*if(index == countCarePlan -1 ){
																	res.json({"err_code": 0, "data":newCarePlan});				
																}*/

																myEmitter.once('getCarePlanActivity', function(carePlan, index, newCarePlan, countCarePlan){
																				qString = {};
																				qString.careplan_id = carePlan.id;
																				seedPhoenixFHIR.path.GET = {
																					"CarePlanActivity" : {
																						"location": "%(apikey)s/CarePlanActivity",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('CarePlanActivity', {"apikey": apikey}, {}, function(error, response, body){
																					carePlanActivity = JSON.parse(body);
																					if(carePlanActivity.err_code == 0){
																						var objectCarePlan = {};
																						objectCarePlan.resourceType = carePlan.resourceType;
																						objectCarePlan.id = carePlan.id;
																						objectCarePlan.identifier = carePlan.identifier;
																						objectCarePlan.based_on = carePlan.based_on;
																						objectCarePlan.replaces = carePlan.replaces;
																						objectCarePlan.part_of = carePlan.part_of;
																						objectCarePlan.status = carePlan.status;
																						objectCarePlan.intent = carePlan.intent;
																						objectCarePlan.category = carePlan.category;
																						objectCarePlan.title = carePlan.title;
																						objectCarePlan.subject = carePlan.subject;
																						objectCarePlan.context = carePlan.context;
																						objectCarePlan.period = carePlan.period;
																						objectCarePlan.supportingInfo = carePlan.supportingInfo;
																						objectCarePlan.activity = carePlanActivity.data;

																						newCarePlan[index] = objectCarePlan;

																						if(index == countCarePlan -1 ){
																							res.json({"err_code": 0, "data":newCarePlan});				
																						}
																						/*myEmitter.once('getReaction', function(carePlan, index, newCarePlan, countCarePlan){
																							qString = {};
																							qString.adverse_event_reaction_id = carePlan.id;
																							seedPhoenixFHIR.path.GET = {
																								"CarePlanReaction" : {
																									"location": "%(apikey)s/CarePlanReaction",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('CarePlanReaction', {"apikey": apikey}, {}, function(error, response, body){
																								carePlanReaction = JSON.parse(body);
																								if(carePlanReaction.err_code == 0){
																									var objectCarePlan = {};
																									objectCarePlan.resourceType = carePlan.resourceType;
																									objectCarePlan.id = carePlan.id;
																									objectCarePlan.identifier = carePlan.identifier;
																									objectCarePlan.category = carePlan.category;
																									objectCarePlan.type = carePlan.type;
																									objectCarePlan.subject = carePlan.subject;
																									objectCarePlan.date = carePlan.date;
																									objectCarePlan.reaction = carePlanReaction.data;
																									objectCarePlan.location = carePlan.location;
																									objectCarePlan.seriousness = carePlan.seriousness;
																									objectCarePlan.outcome = carePlan.outcome;
																									objectCarePlan.eventParticipant = carePlan.eventParticipant;
																									objectCarePlan.description = carePlan.description;
																									objectCarePlan.suspectEntity = carePlan.suspectEntity;

																									newCarePlan[index] = objectCarePlan;

																									myEmitter.once('getSubjectMedicalHistoryCondition', function(carePlan, index, newCarePlan, countCarePlan){
																										qString = {};
																										qString.adverse_event_subject_medical_history_id = carePlan.id;
																										seedPhoenixFHIR.path.GET = {
																											"SubjectMedicalHistoryCondition" : {
																												"location": "%(apikey)s/SubjectMedicalHistoryCondition",
																												"query": qString
																											}
																										}

																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																										ApiFHIR.get('SubjectMedicalHistoryCondition', {"apikey": apikey}, {}, function(error, response, body){
																											subjectMedicalHistoryCondition = JSON.parse(body);
																											console.log(subjectMedicalHistoryCondition.data.id);
																											if(subjectMedicalHistoryCondition.err_code == 0){
																												var objectCarePlan = {};
																												var objectSubjectMedicalHistoryCondition = {};
																												objectCarePlan.resourceType = carePlan.resourceType;
																												objectCarePlan.id = carePlan.id;
																												objectCarePlan.identifier = carePlan.identifier;
																												objectCarePlan.category = carePlan.category;
																												objectCarePlan.type = carePlan.type;
																												objectCarePlan.subject = carePlan.subject;
																												objectCarePlan.date = carePlan.date;
																												objectCarePlan.reaction = carePlan.reaction;
																												objectCarePlan.location = carePlan.location;
																												objectCarePlan.seriousness = carePlan.seriousness;
																												objectCarePlan.outcome = carePlan.outcome;
																												objectCarePlan.eventParticipant = carePlan.eventParticipant;
																												objectCarePlan.description = carePlan.description;
																												objectCarePlan.suspectEntity = carePlan.suspectEntity;
																												var condition;
																												condition = subjectMedicalHistoryCondition.data;
																												objectSubjectMedicalHistoryCondition.condition = condition;
																												objectCarePlan.subjectMedicalHistory = objectSubjectMedicalHistoryCondition;

																												newCarePlan[index] = objectCarePlan;

																												myEmitter.once('getSubjectMedicalHistoryObservation', function(carePlan, index, newCarePlan, countCarePlan){
																													qString = {};
																													qString.adverse_event_subject_medical_history_id = carePlan.id;
																													seedPhoenixFHIR.path.GET = {
																														"SubjectMedicalHistoryObservation" : {
																															"location": "%(apikey)s/SubjectMedicalHistoryObservation",
																															"query": qString
																														}
																													}

																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																													ApiFHIR.get('SubjectMedicalHistoryObservation', {"apikey": apikey}, {}, function(error, response, body){
																														subjectMedicalHistoryObservation = JSON.parse(body);
																														console.log(subjectMedicalHistoryObservation.data.id);
																														if(subjectMedicalHistoryObservation.err_code == 0){
																															var objectCarePlan = {};
																															var objectSubjectMedicalHistory = {};
																															objectCarePlan.resourceType = carePlan.resourceType;
																															objectCarePlan.id = carePlan.id;
																															objectCarePlan.identifier = carePlan.identifier;
																															objectCarePlan.category = carePlan.category;
																															objectCarePlan.type = carePlan.type;
																															objectCarePlan.subject = carePlan.subject;
																															objectCarePlan.date = carePlan.date;
																															objectCarePlan.reaction = carePlan.reaction;
																															objectCarePlan.location = carePlan.location;
																															objectCarePlan.seriousness = carePlan.seriousness;
																															objectCarePlan.outcome = carePlan.outcome;
																															objectCarePlan.eventParticipant = carePlan.eventParticipant;
																															objectCarePlan.description = carePlan.description;
																															objectCarePlan.suspectEntity = carePlan.suspectEntity;
																															var observation;
																															observation = subjectMedicalHistoryObservation.data;
																															objectSubjectMedicalHistory.condition = carePlan.subjectMedicalHistory.condition;
																															objectSubjectMedicalHistory.observation = observation;
																															objectCarePlan.subjectMedicalHistory = objectSubjectMedicalHistory;

																															newCarePlan[index] = objectCarePlan;

																															myEmitter.once('getSubjectMedicalHistoryAllergyIntolerance', function(carePlan, index, newCarePlan, countCarePlan){
																																qString = {};
																																qString.adverse_event_subject_medical_history_id = carePlan.id;
																																seedPhoenixFHIR.path.GET = {
																																	"SubjectMedicalHistoryAllergyIntolerance" : {
																																		"location": "%(apikey)s/SubjectMedicalHistoryAllergyIntolerance",
																																		"query": qString
																																	}
																																}

																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																ApiFHIR.get('SubjectMedicalHistoryAllergyIntolerance', {"apikey": apikey}, {}, function(error, response, body){
																																	subjectMedicalHistoryAllergyIntolerance = JSON.parse(body);
																																	if(subjectMedicalHistoryAllergyIntolerance.err_code == 0){
																																		var objectCarePlan = {};
																																		var objectSubjectMedicalHistory = {};
																																		objectCarePlan.resourceType = carePlan.resourceType;
																																		objectCarePlan.id = carePlan.id;
																																		objectCarePlan.identifier = carePlan.identifier;
																																		objectCarePlan.category = carePlan.category;
																																		objectCarePlan.type = carePlan.type;
																																		objectCarePlan.subject = carePlan.subject;
																																		objectCarePlan.date = carePlan.date;
																																		objectCarePlan.reaction = carePlan.reaction;
																																		objectCarePlan.location = carePlan.location;
																																		objectCarePlan.seriousness = carePlan.seriousness;
																																		objectCarePlan.outcome = carePlan.outcome;
																																		objectCarePlan.eventParticipant = carePlan.eventParticipant;
																																		objectCarePlan.description = carePlan.description;
																																		objectCarePlan.suspectEntity = carePlan.suspectEntity;
																																		var allergyIntolerance;
																																		allergyIntolerance = subjectMedicalHistoryAllergyIntolerance.data;
																																		objectSubjectMedicalHistory.condition = carePlan.subjectMedicalHistory.condition;
																																		objectSubjectMedicalHistory.observation = carePlan.subjectMedicalHistory.observation;
																																		objectSubjectMedicalHistory.allergyIntolerance = allergyIntolerance;
																																		objectCarePlan.subjectMedicalHistory = objectSubjectMedicalHistory;

																																		newCarePlan[index] = objectCarePlan;

																																		myEmitter.once('getSubjectMedicalHistoryFamilyMemberHistory', function(carePlan, index, newCarePlan, countCarePlan){
																																			qString = {};
																																			qString.adverse_event_subject_medical_history_id = carePlan.id;
																																			seedPhoenixFHIR.path.GET = {
																																				"SubjectMedicalHistoryFamilyMemberHistory" : {
																																					"location": "%(apikey)s/SubjectMedicalHistoryFamilyMemberHistory",
																																					"query": qString
																																				}
																																			}

																																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																			ApiFHIR.get('SubjectMedicalHistoryFamilyMemberHistory', {"apikey": apikey}, {}, function(error, response, body){
																																				subjectMedicalHistoryFamilyMemberHistory = JSON.parse(body);
																																				if(subjectMedicalHistoryFamilyMemberHistory.err_code == 0){
																																					var objectCarePlan = {};
																																					var objectSubjectMedicalHistory = {};
																																					objectCarePlan.resourceType = carePlan.resourceType;
																																					objectCarePlan.id = carePlan.id;
																																					objectCarePlan.identifier = carePlan.identifier;
																																					objectCarePlan.category = carePlan.category;
																																					objectCarePlan.type = carePlan.type;
																																					objectCarePlan.subject = carePlan.subject;
																																					objectCarePlan.date = carePlan.date;
																																					objectCarePlan.reaction = carePlan.reaction;
																																					objectCarePlan.location = carePlan.location;
																																					objectCarePlan.seriousness = carePlan.seriousness;
																																					objectCarePlan.outcome = carePlan.outcome;
																																					objectCarePlan.eventParticipant = carePlan.eventParticipant;
																																					objectCarePlan.description = carePlan.description;
																																					objectCarePlan.suspectEntity = carePlan.suspectEntity;
																																					var familyMemberHistory;
																																					familyMemberHistory = subjectMedicalHistoryFamilyMemberHistory.data;
																																					objectSubjectMedicalHistory.condition = carePlan.subjectMedicalHistory.condition;
																																					objectSubjectMedicalHistory.observation = carePlan.subjectMedicalHistory.observation;
																																					objectSubjectMedicalHistory.allergyIntolerance = carePlan.subjectMedicalHistory.allergyIntolerance;
																																					objectSubjectMedicalHistory.familyMemberHistory = familyMemberHistory;
																																					objectCarePlan.subjectMedicalHistory = objectSubjectMedicalHistory;

																																					newCarePlan[index] = objectCarePlan;

																																					myEmitter.once('getSubjectMedicalHistoryImmunization', function(carePlan, index, newCarePlan, countCarePlan){
																																						qString = {};
																																						qString.adverse_event_subject_medical_history_id = carePlan.id;
																																						seedPhoenixFHIR.path.GET = {
																																							"SubjectMedicalHistoryImmunization" : {
																																								"location": "%(apikey)s/SubjectMedicalHistoryImmunization",
																																								"query": qString
																																							}
																																						}

																																						var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																						ApiFHIR.get('SubjectMedicalHistoryImmunization', {"apikey": apikey}, {}, function(error, response, body){
																																							subjectMedicalHistoryImmunization = JSON.parse(body);
																																							if(subjectMedicalHistoryImmunization.err_code == 0){
																																								var objectCarePlan = {};
																																								var objectSubjectMedicalHistory = {};
																																								objectCarePlan.resourceType = carePlan.resourceType;
																																								objectCarePlan.id = carePlan.id;
																																								objectCarePlan.identifier = carePlan.identifier;
																																								objectCarePlan.category = carePlan.category;
																																								objectCarePlan.type = carePlan.type;
																																								objectCarePlan.subject = carePlan.subject;
																																								objectCarePlan.date = carePlan.date;
																																								objectCarePlan.reaction = carePlan.reaction;
																																								objectCarePlan.location = carePlan.location;
																																								objectCarePlan.seriousness = carePlan.seriousness;
																																								objectCarePlan.outcome = carePlan.outcome;
																																								objectCarePlan.eventParticipant = carePlan.eventParticipant;
																																								objectCarePlan.description = carePlan.description;
																																								objectCarePlan.suspectEntity = carePlan.suspectEntity;
																																								var immunization;
																																								immunization = subjectMedicalHistoryImmunization.data;
																																								objectSubjectMedicalHistory.condition = carePlan.subjectMedicalHistory.condition;
																																								objectSubjectMedicalHistory.observation = carePlan.subjectMedicalHistory.observation;
																																								objectSubjectMedicalHistory.allergyIntolerance = carePlan.subjectMedicalHistory.allergyIntolerance;
																																								objectSubjectMedicalHistory.familyMemberHistory = carePlan.subjectMedicalHistory.familyMemberHistory;
																																								objectSubjectMedicalHistory.immunization = immunization;
																																								objectCarePlan.subjectMedicalHistory = objectSubjectMedicalHistory;

																																								newCarePlan[index] = objectCarePlan;

																																								myEmitter.once('getSubjectMedicalHistoryProcedure', function(carePlan, index, newCarePlan, countCarePlan){
																																									qString = {};
																																									qString.adverse_event_subject_medical_history_id = carePlan.id;
																																									seedPhoenixFHIR.path.GET = {
																																										"SubjectMedicalHistoryProcedure" : {
																																											"location": "%(apikey)s/SubjectMedicalHistoryProcedure",
																																											"query": qString
																																										}
																																									}

																																									var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																									ApiFHIR.get('SubjectMedicalHistoryProcedure', {"apikey": apikey}, {}, function(error, response, body){
																																										subjectMedicalHistoryProcedure = JSON.parse(body);
																																										if(subjectMedicalHistoryProcedure.err_code == 0){
																																											var objectCarePlan = {};
																																											var objectSubjectMedicalHistory = {};
																																											objectCarePlan.resourceType = carePlan.resourceType;
																																											objectCarePlan.id = carePlan.id;
																																											objectCarePlan.identifier = carePlan.identifier;
																																											objectCarePlan.category = carePlan.category;
																																											objectCarePlan.type = carePlan.type;
																																											objectCarePlan.subject = carePlan.subject;
																																											objectCarePlan.date = carePlan.date;
																																											objectCarePlan.reaction = carePlan.reaction;
																																											objectCarePlan.location = carePlan.location;
																																											objectCarePlan.seriousness = carePlan.seriousness;
																																											objectCarePlan.outcome = carePlan.outcome;
																																											objectCarePlan.eventParticipant = carePlan.eventParticipant;
																																											objectCarePlan.description = carePlan.description;
																																											objectCarePlan.suspectEntity = carePlan.suspectEntity;
																																											var procedure;
																																											procedure = subjectMedicalHistoryProcedure.data;
																																											objectSubjectMedicalHistory.condition = carePlan.subjectMedicalHistory.condition;
																																											objectSubjectMedicalHistory.observation = carePlan.subjectMedicalHistory.observation;
																																											objectSubjectMedicalHistory.allergyIntolerance = carePlan.subjectMedicalHistory.allergyIntolerance;
																																											objectSubjectMedicalHistory.familyMemberHistory = carePlan.subjectMedicalHistory.familyMemberHistory;
																																											objectSubjectMedicalHistory.immunization = carePlan.subjectMedicalHistory.immunization;
																																											objectSubjectMedicalHistory.procedure = procedure;
																																											objectCarePlan.subjectMedicalHistory = objectSubjectMedicalHistory;

																																											newCarePlan[index] = objectCarePlan;

																																											if(index == countCarePlan -1 ){
																																												res.json({"err_code": 0, "data":newCarePlan});				
																																											}			
																																										}else{
																																											res.json(subjectMedicalHistoryProcedure);			
																																										}
																																									})
																																								})
																																								myEmitter.emit('getSubjectMedicalHistoryProcedure', objectCarePlan, index, newCarePlan, countCarePlan);			
																																							}else{
																																								res.json(subjectMedicalHistoryImmunization);			
																																							}
																																						})
																																					})
																																					myEmitter.emit('getSubjectMedicalHistoryImmunization', objectCarePlan, index, newCarePlan, countCarePlan);				
																																				}else{
																																					res.json(subjectMedicalHistoryFamilyMemberHistory);			
																																				}
																																			})
																																		})
																																		myEmitter.emit('getSubjectMedicalHistoryFamilyMemberHistory', objectCarePlan, index, newCarePlan, countCarePlan);			
																																	}else{
																																		res.json(subjectMedicalHistoryAllergyIntolerance);			
																																	}
																																})
																															})
																															myEmitter.emit('getSubjectMedicalHistoryAllergyIntolerance', objectCarePlan, index, newCarePlan, countCarePlan);

																														}else{
																															res.json(subjectMedicalHistoryObservation);			
																														}
																													})
																												})
																												myEmitter.emit('getSubjectMedicalHistoryObservation', objectCarePlan, index, newCarePlan, countCarePlan);			
																											}else{
																												res.json(subjectMedicalHistoryCondition);			
																											}
																										})
																									})
																									myEmitter.emit('getSubjectMedicalHistoryCondition', objectCarePlan, index, newCarePlan, countCarePlan);			
																								}else{
																									res.json(carePlanReaction);			
																								}
																							})
																						})
																						myEmitter.emit('getReaction', objectCarePlan, index, newCarePlan, countCarePlan);*/
																					}else{
																						res.json(carePlanActivity);			
																					}
																				})
																			})
																myEmitter.emit('getCarePlanActivity', objectCarePlan, index, newCarePlan, countCarePlan);
															}else{
																res.json(identifier);
															}
														})
													})
										myEmitter.emit("getIdentifier", carePlan.data[i], i, newCarePlan, carePlan.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Adverse Event is empty."});	
								}
							}else{
								res.json(carePlan);
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
		carePlan : function addCarePlan(req, res){
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

/**/
			if(typeof req.body.definition.planDefinition !== 'undefined'){
				var definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					definitionPlanDefinition = "";
				}
			}else{ 
				err_code = 1;
				err_msg = "Please add sub-key 'definition plan definition' in json Care Plan request.";
			}

			if(typeof req.body.definition.questionnaire !== 'undefined'){
				var definitionQuestionnaire =  req.body.definition.questionnaire.trim().toLowerCase();
				if(validator.isEmpty(definitionQuestionnaire)){
					definitionQuestionnaire = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'definition questionnaire' in json Care Plan request.";
			}

			if(typeof req.body.partOf !== 'undefined'){
				var partOf =  req.body.partOf.trim().toLowerCase();
				if(validator.isEmpty(partOf)){
					partOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'part of' in json Care Plan request.";
			}

			if(typeof req.body.basedOn !== 'undefined'){
				var basedOn =  req.body.basedOn.trim().toLowerCase();
				if(validator.isEmpty(basedOn)){
					basedOn = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on' in json Care Plan request.";
			}

			if(typeof req.body.replaces !== 'undefined'){
				var replaces =  req.body.replaces.trim().toLowerCase();
				if(validator.isEmpty(replaces)){
					replaces = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'replaces' in json Care Plan request.";
			}

			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Care Plan status is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Care Plan request.";
			}

			if(typeof req.body.intent !== 'undefined'){
				var intent =  req.body.intent.trim().toLowerCase();
				if(validator.isEmpty(intent)){
					err_code = 2;
					err_msg = "Care Plan intent is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'intent' in json Care Plan request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Care Plan request.";
			}

			if(typeof req.body.title !== 'undefined'){
				var title =  req.body.title.trim().toLowerCase();
				if(validator.isEmpty(title)){
					title = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'title' in json Care Plan request.";
			}

			if(typeof req.body.description !== 'undefined'){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					description = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json Care Plan request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Care Plan request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Care Plan request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Care Plan request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Care Plan request.";
			}

			if (typeof req.body.period !== 'undefined') {
			  var period = req.body.period;
				if (period != ""){
					if (period.indexOf("to") > 0) {
						arrPeriod = period.split("to");
						var periodStart = arrPeriod[0];
						var periodEnd = arrPeriod[1];
						if (!regex.test(periodStart) && !regex.test(periodEnd)) {
							err_code = 2;
							err_msg = "Care Plan period invalid date format.";
						}
					} else {
						err_code = 2;
						err_msg = "Care Plan period invalid date format.";
					}
				} else {
					var periodStart = "";
					var periodEnd = "";
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'period' in json Care Plan request.";
			}

			if(typeof req.body.author.patient !== 'undefined'){
				var authorPatient =  req.body.author.patient.trim().toLowerCase();
				if(validator.isEmpty(authorPatient)){
					authorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author patient' in json Care Plan request.";
			}

			if(typeof req.body.author.practitioner !== 'undefined'){
				var authorPractitioner =  req.body.author.practitioner.trim().toLowerCase();
				if(validator.isEmpty(authorPractitioner)){
					authorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author practitioner' in json Care Plan request.";
			}

			if(typeof req.body.author.relatedPerson !== 'undefined'){
				var authorRelatedPerson =  req.body.author.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(authorRelatedPerson)){
					authorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author related person' in json Care Plan request.";
			}

			if(typeof req.body.author.organization !== 'undefined'){
				var authorOrganization =  req.body.author.organization.trim().toLowerCase();
				if(validator.isEmpty(authorOrganization)){
					authorOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author organization' in json Care Plan request.";
			}

			if(typeof req.body.author.careTeam !== 'undefined'){
				var authorCareTeam =  req.body.author.careTeam.trim().toLowerCase();
				if(validator.isEmpty(authorCareTeam)){
					authorCareTeam = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author care team' in json Care Plan request.";
			}

			if(typeof req.body.addresses !== 'undefined'){
				var addresses =  req.body.addresses.trim().toLowerCase();
				if(validator.isEmpty(addresses)){
					addresses = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'addresses' in json Care Plan request.";
			}

			if(typeof req.body.supportingInfo !== 'undefined'){
				var supportingInfo =  req.body.supportingInfo.trim().toLowerCase();
				if(validator.isEmpty(supportingInfo)){
					supportingInfo = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'supporting info' in json Care Plan request.";
			}

			if(typeof req.body.goal !== 'undefined'){
				var goal =  req.body.goal.trim().toLowerCase();
				if(validator.isEmpty(goal)){
					goal = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'goal' in json Care Plan request.";
			}

			if(typeof req.body.activity.outcomeCodeableConcept !== 'undefined'){
				var activityOutcomeCodeableConcept =  req.body.activity.outcomeCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(activityOutcomeCodeableConcept)){
					activityOutcomeCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity outcome codeable concept' in json Care Plan request.";
			}

			if(typeof req.body.activity.outcomeReference !== 'undefined'){
				var activityOutcomeReference =  req.body.activity.outcomeReference.trim().toLowerCase();
				if(validator.isEmpty(activityOutcomeReference)){
					activityOutcomeReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity outcome reference' in json Care Plan request.";
			}

			if(typeof req.body.activity.progress !== 'undefined'){
				var activityProgress =  req.body.activity.progress.trim().toLowerCase();
				if(validator.isEmpty(activityProgress)){
					activityProgress = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity progress' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.appointment !== 'undefined'){
				var activityReferenceAppointment =  req.body.activity.reference.appointment.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceAppointment)){
					activityReferenceAppointment = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference appointment' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.communicationRequest !== 'undefined'){
				var activityReferenceCommunicationRequest =  req.body.activity.reference.communicationRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceCommunicationRequest)){
					activityReferenceCommunicationRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference communication request' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.deviceRequest !== 'undefined'){
				var activityReferenceDeviceRequest =  req.body.activity.reference.deviceRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceDeviceRequest)){
					activityReferenceDeviceRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference device request' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.medicationRequest !== 'undefined'){
				var activityReferenceMedicationRequest =  req.body.activity.reference.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceMedicationRequest)){
					activityReferenceMedicationRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference medication request' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.nutritionOrder !== 'undefined'){
				var activityReferenceNutritionOrder =  req.body.activity.reference.nutritionOrder.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceNutritionOrder)){
					activityReferenceNutritionOrder = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference nutrition order' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.task !== 'undefined'){
				var activityReferenceTask =  req.body.activity.reference.task.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceTask)){
					activityReferenceTask = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference task' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.procedureRequest !== 'undefined'){
				var activityReferenceProcedureRequest =  req.body.activity.reference.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceProcedureRequest)){
					activityReferenceProcedureRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference procedure request' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.referralRequest !== 'undefined'){
				var activityReferenceReferralRequest =  req.body.activity.reference.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceReferralRequest)){
					activityReferenceReferralRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference referral request' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.visionPrescription !== 'undefined'){
				var activityReferenceVisionPrescription =  req.body.activity.reference.visionPrescription.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceVisionPrescription)){
					activityReferenceVisionPrescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference vision prescription' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.requestGroup !== 'undefined'){
				var activityReferenceRequestGroup =  req.body.activity.reference.requestGroup.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceRequestGroup)){
					activityReferenceRequestGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference request group' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.category !== 'undefined'){
				var activityDetailCategory =  req.body.activity.detail.category.trim().toLowerCase();
				if(validator.isEmpty(activityDetailCategory)){
					activityDetailCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail category' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.definition.planDefinition !== 'undefined'){
				var activityDetailDefinitionPlanDefinition =  req.body.activity.detail.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDefinitionPlanDefinition)){
					activityDetailDefinitionPlanDefinition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail definition plan definition' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.definition.activityDefinition !== 'undefined'){
				var activityDetailDefinitionActivityDefinition =  req.body.activity.detail.definition.activityDefinition.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDefinitionActivityDefinition)){
					activityDetailDefinitionActivityDefinition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail definition activity definition' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.definition.questionnaire !== 'undefined'){
				var activityDetailDefinitionQuestionnaire =  req.body.activity.detail.definition.questionnaire.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDefinitionQuestionnaire)){
					activityDetailDefinitionQuestionnaire = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail definition questionnaire' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.code !== 'undefined'){
				var activityDetailCode =  req.body.activity.detail.code.trim().toLowerCase();
				if(validator.isEmpty(activityDetailCode)){
					activityDetailCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail code' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.reasonCode !== 'undefined'){
				var activityDetailReasonCode =  req.body.activity.detail.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(activityDetailReasonCode)){
					activityDetailReasonCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail reason code' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.reasonReference !== 'undefined'){
				var activityDetailReasonReference =  req.body.activity.detail.reasonReference.trim().toLowerCase();
				if(validator.isEmpty(activityDetailReasonReference)){
					activityDetailReasonReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail reason reference' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.goal !== 'undefined'){
				var activityDetailGoal =  req.body.activity.detail.goal.trim().toLowerCase();
				if(validator.isEmpty(activityDetailGoal)){
					activityDetailGoal = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail goal' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.status !== 'undefined'){
				var activityDetailStatus =  req.body.activity.detail.status.trim().toLowerCase();
				if(validator.isEmpty(activityDetailStatus)){
					err_code = 2;
					err_msg = "Care Plan activity detail status is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail status' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.statusReason !== 'undefined'){
				var activityDetailStatusReason =  req.body.activity.detail.statusReason.trim().toLowerCase();
				if(validator.isEmpty(activityDetailStatusReason)){
					activityDetailStatusReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail status reason' in json Care Plan request.";
			}

			if (typeof req.body.activity.detail.prohibited !== 'undefined') {
				var activityDetailProhibited = req.body.activity.detail.prohibited.trim().toLowerCase();
				if(validator.isEmpty(activityDetailProhibited)){
					activityDetailProhibited = "false";
				}
				if(activityDetailProhibited === "true" || activityDetailProhibited === "false"){
					activityDetailProhibited = activityDetailProhibited
				} else {
					err_code = 2;
					err_msg = "Care Plan activity detail prohibited is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail prohibited' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming !== 'undefined'){
				var activityDetailScheduledScheduledTiming =  req.body.activity.detail.scheduled.scheduledTiming.trim().toLowerCase();
				if(validator.isEmpty(activityDetailScheduledScheduledTiming)){
					activityDetailScheduledScheduledTiming = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing' in json Care Plan request.";
			}

			if (typeof req.body.activity.detail.scheduled.scheduledPeriod !== 'undefined') {
			  var activityDetailScheduledScheduledPeriod = req.body.activity.detail.scheduled.scheduledPeriod;
				if(validator.isEmpty(activityDetailScheduledScheduledPeriod)){
					var activityDetailScheduledScheduledPeriodStart = "";
					var activityDetailScheduledScheduledPeriodEnd = "";
				} else {
					if (activityDetailScheduledScheduledPeriod.indexOf("to") > 0) {
						arrActivityDetailScheduledScheduledPeriod = activityDetailScheduledScheduledPeriod.split("to");
						var activityDetailScheduledScheduledPeriodStart = arrActivityDetailScheduledScheduledPeriod[0];
						var activityDetailScheduledScheduledPeriodEnd = arrActivityDetailScheduledScheduledPeriod[1];
						if (!regex.test(activityDetailScheduledScheduledPeriodStart) && !regex.test(activityDetailScheduledScheduledPeriodEnd)) {
							err_code = 2;
							err_msg = "Care Plan activity detail scheduled scheduled period invalid date format.";
						}
					} else {
						err_code = 2;
						err_msg = "Care Plan activity detail scheduled scheduled period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'activity detail scheduled scheduled period' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledString !== 'undefined'){
				var activityDetailScheduledScheduledString =  req.body.activity.detail.scheduled.scheduledString.trim().toLowerCase();
				if(validator.isEmpty(activityDetailScheduledScheduledString)){
					activityDetailScheduledScheduledString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled string' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.location !== 'undefined'){
				var activityDetailLocation =  req.body.activity.detail.location.trim().toLowerCase();
				if(validator.isEmpty(activityDetailLocation)){
					activityDetailLocation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail location' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.performer.practitioner !== 'undefined'){
				var activityDetailPerformerPractitioner =  req.body.activity.detail.performer.practitioner.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerPractitioner)){
					activityDetailPerformerPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail performer practitioner' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.performer.organization !== 'undefined'){
				var activityDetailPerformerOrganization =  req.body.activity.detail.performer.organization.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerOrganization)){
					activityDetailPerformerOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail performer organization' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.performer.relatedPerson !== 'undefined'){
				var activityDetailPerformerRelatedPerson =  req.body.activity.detail.performer.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerRelatedPerson)){
					activityDetailPerformerRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail performer related person' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.performer.patient !== 'undefined'){
				var activityDetailPerformerPatient =  req.body.activity.detail.performer.patient.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerPatient)){
					activityDetailPerformerPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail performer patient' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.performer.careTeam !== 'undefined'){
				var activityDetailPerformerCareTeam =  req.body.activity.detail.performer.careTeam.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerCareTeam)){
					activityDetailPerformerCareTeam = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail performer care team' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.product.productCodeableConcept !== 'undefined'){
				var activityDetailProductProductCodeableConcept =  req.body.activity.detail.product.productCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(activityDetailProductProductCodeableConcept)){
					activityDetailProductProductCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail product product codeable concept' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.product.productReference.medication !== 'undefined'){
				var activityDetailProductProductReferenceMedication =  req.body.activity.detail.product.productReference.medication.trim().toLowerCase();
				if(validator.isEmpty(activityDetailProductProductReferenceMedication)){
					activityDetailProductProductReferenceMedication = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail product product reference medication' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.product.productReference.substance !== 'undefined'){
				var activityDetailProductProductReferenceSubstance =  req.body.activity.detail.product.productReference.substance.trim().toLowerCase();
				if(validator.isEmpty(activityDetailProductProductReferenceSubstance)){
					activityDetailProductProductReferenceSubstance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail product product reference substance' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.dailyAmount !== 'undefined'){
				var activityDetailDailyAmount =  req.body.activity.detail.dailyAmount.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDailyAmount)){
					activityDetailDailyAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail daily amount' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.quantity !== 'undefined'){
				var activityDetailQuantity =  req.body.activity.detail.quantity.trim().toLowerCase();
				if(validator.isEmpty(activityDetailQuantity)){
					activityDetailQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail quantity' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.description !== 'undefined'){
				var activityDetailDescription =  req.body.activity.detail.description.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDescription)){
					activityDetailDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail description' in json Care Plan request.";
			}

			if(typeof req.body.note !== 'undefined'){
				var note =  req.body.note.trim().toLowerCase();
				if(validator.isEmpty(note)){
					note = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note' in json Care Plan request.";
			}
			

			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
						if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
							checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
								if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid	
/* kurang refrence
definition.planDefinition|definitionPlanDefinition|
definition.questionnaire|definitionQuestionnaire|
partOf|partOf|
basedOn|basedOn|
replaces|replaces|
status|status|
intent|intent|
category|category|
title|title|
description|description|
subject.patient|subjectPatient|
subject.group|subjectGroup|
context.encounter|contextEncounter|
context.episodeOfCare|contextEpisodeOfCare|
period|period|period
author.patient|authorPatient|
author.practitioner|authorPractitioner|
author.relatedPerson|authorRelatedPerson|
author.organization|authorOrganization|
author.careTeam|authorCareTeam|
addresses|addresses|
supportingInfo|supportingInfo|
goal|goal|
activity.outcomeCodeableConcept|activityOutcomeCodeableConcept|
activity.outcomeReference|activityOutcomeReference|
activity.progress|activityProgress|
activity.reference.appointment|activityReferenceAppointment|
activity.reference.communicationRequest|activityReferenceCommunicationRequest|
activity.reference.deviceRequest|activityReferenceDeviceRequest|
activity.reference.medicationRequest|activityReferenceMedicationRequest|
activity.reference.nutritionOrder|activityReferenceNutritionOrder|
activity.reference.task|activityReferenceTask|
activity.reference.procedureRequest|activityReferenceProcedureRequest|
activity.reference.referralRequest|activityReferenceReferralRequest|
activity.reference.visionPrescription|activityReferenceVisionPrescription|
activity.reference.requestGroup|activityReferenceRequestGroup|
activity.detail.category|activityDetailCategory|
activity.detail.definition.planDefinition|activityDetailDefinitionPlanDefinition|
activity.detail.definition.activityDefinition|activityDetailDefinitionActivityDefinition|
activity.detail.definition.questionnaire|activityDetailDefinitionQuestionnaire|
activity.detail.code|activityDetailCode|
activity.detail.reasonCode|activityDetailReasonCode|
activity.detail.reasonReference|activityDetailReasonReference|
activity.detail.goal|activityDetailGoal|
activity.detail.status|activityDetailStatus|
activity.detail.statusReason|activityDetailStatusReason|
activity.detail.prohibited|activityDetailProhibited|boolean
activity.detail.scheduled.scheduledTiming|activityDetailScheduledScheduledTiming|
activity.detail.scheduled.scheduledPeriod|activityDetailScheduledScheduledPeriod|period
activity.detail.scheduled.scheduledString|activityDetailScheduledScheduledString|
activity.detail.location|activityDetailLocation|
activity.detail.performer.practitioner|activityDetailPerformerPractitioner|
activity.detail.performer.organization|activityDetailPerformerOrganization|
activity.detail.performer.relatedPerson|activityDetailPerformerRelatedPerson|
activity.detail.performer.patient|activityDetailPerformerPatient|
activity.detail.performer.careTeam|activityDetailPerformerCareTeam|
activity.detail.product.productCodeableConcept|activityDetailProductProductCodeableConcept|
activity.detail.product.productReference.medication|activityDetailProductProductReferenceMedication|
activity.detail.product.productReference.substance|activityDetailProductProductReferenceSubstance|
activity.detail.dailyAmount|activityDetailDailyAmount|
activity.detail.quantity|activityDetailQuantity|
activity.detail.description|activityDetailDescription|
note|note|					
*/
									
									//event emiter
									myEmitter.prependOnceListener('checkIdentifierValue', function() {
										
											checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
												if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada
													
													//proses insert

													//set uniqe id
													var unicId = uniqid.time();
													var identifierId = 'ide' + unicId;
													var carePlanId = 'cap' + unicId;
													var carePlanActivityId = 'cpa' + unicId;
													var carePlanActivityDetailId = 'cad' + unicId;
													
													dataCarePlan = {
														"careplan_id" : carePlanId,
														"based_on" : basedOn,
														"replaces" : replaces,
														"part_of" : partOf,
														"status" : status,
														"intent" : intent,
														"category" : category,
														"title" : title,
														"description" : description,
														"subject_patient" : subjectPatient,
														"subject_group" : subjectGroup,
														"context_encounter" : contextEncounter,
														"context_episode_of_care" : contextEpisodeOfCare,
														"period_start" : periodStart,
														"period_end" : periodEnd,
														"supporting_info" : supportingInfo
													}
													console.log(dataCarePlan);
													ApiFHIR.post('carePlan', {"apikey": apikey}, {body: dataCarePlan, json: true}, function(error, response, body){
														carePlan = body;
														if(carePlan.err_code > 0){
															res.json(carePlan);	
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
																						"care_plan_id": carePlanId
																					}

													ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
														identifier = body;
														if(identifier.err_code > 0){
															res.json(identifier);	
														}
													})

													//CarePlanActivity
													dataCarePlanActivity = {
														"careplan_activity_id" : carePlanActivityId,
														"outcome_codeable_concept" : activityOutcomeCodeableConcept,
														"outcome_reference" : activityOutcomeReference,
														"progress" : activityProgress,
														"reference_appointment" : activityReferenceAppointment,
														"reference_communication_request" : activityReferenceCommunicationRequest,
														"reference_device_request" : activityReferenceDeviceRequest,
														"reference_medication_request" : activityReferenceMedicationRequest,
														"reference_nutrition_order" : activityReferenceNutritionOrder,
														"reference_task" : activityReferenceTask,
														"reference_procedure_request" : activityReferenceProcedureRequest,
														"reference_referral_request" : activityReferenceReferralRequest,
														"reference_vision_prescription" : activityReferenceVisionPrescription,
														"reference_request_group" : activityReferenceRequestGroup,
														"careplan_id" : carePlanId
													}
													ApiFHIR.post('carePlanActivity', {"apikey": apikey}, {body: dataCarePlanActivity, json: true}, function(error, response, body){
														carePlanActivity = body;
														if(carePlanActivity.err_code > 0){
															res.json(carePlanActivity);	
															console.log("ok");
														}
													});
													
													//CarePlanActivity
													dataCarePlanActivityDetail = {
														"activity_detail_id" : carePlanActivityDetailId,
														"category" : activityDetailCategory,
														"definition_plan_definition" : activityDetailDefinitionPlanDefinition,
														"definition_activity_definition" : activityDetailDefinitionActivityDefinition,
														"definition_questionnaire" : activityDetailDefinitionQuestionnaire,
														"code" : activityDetailCode,
														"reason_code" : activityDetailReasonCode,
														"status" : activityDetailStatus,
														"status_reason" : activityDetailStatusReason,
														"prohibited" : activityDetailProhibited,
														"scheduled_timing" : activityDetailScheduledScheduledTiming,
														"scheduled_period_start" : activityDetailScheduledScheduledPeriodStart,
														"scheduled_period_end" : activityDetailScheduledScheduledPeriodEnd,
														"scheduled_string" : activityDetailScheduledScheduledString,
														"location" : activityDetailLocation,
														"product_codeable_concept" : activityDetailProductProductCodeableConcept,
														"product_reference_medication" : activityDetailProductProductReferenceMedication,
														"product_reference_substance" : activityDetailProductProductReferenceSubstance,
														"daily_amount" : activityDetailDailyAmount,
														"quantity" : activityDetailDailyAmount,
														"description" : activityDetailDescription,
														"activity_id" : carePlanActivityId
													}
													ApiFHIR.post('carePlanActivityDetail', {"apikey": apikey}, {body: dataCarePlanActivityDetail, json: true}, function(error, response, body){
														carePlanActivityDetail = body;
														if(carePlanActivityDetail.err_code > 0){
															res.json(carePlanActivityDetail);	
															console.log("ok");
														}
													});
													
													res.json({"err_code": 0, "err_msg": "Adverse Event has been add.", "data": [{"_id": carePlanId}]});
												}else{
													res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
												}
											})
									});
									
									//cek code
									
									myEmitter.prependOnceListener('checkStatus', function () {
										if (!validator.isEmpty(status)) {
											checkCode(apikey, status, 'CARE_PLAN_STATUS', function (resStatusCode) {
												if (resStatusCode.err_code > 0) {
													myEmitter.emit('checkIdentifierValue');
												} else {
													res.json({
														"err_code": "527",
														"err_msg": "Status code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkIdentifierValue');
										}
									})
									
									myEmitter.prependOnceListener('checkIntent', function () {
										if (!validator.isEmpty(intent)) {
											checkCode(apikey, intent, 'CARE_PLAN_INTENT', function (resIntentCode) {
												if (resIntentCode.err_code > 0) {
													myEmitter.emit('checkStatus');
												} else {
													res.json({
														"err_code": "526",
														"err_msg": "Intent code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkStatus');
										}
									})
									
									myEmitter.prependOnceListener('checkCategory', function () {
										if (!validator.isEmpty(category)) {
											checkCode(apikey, category, 'CARE_PLAN_CATEGORY', function (resCategoryCode) {
												if (resCategoryCode.err_code > 0) {
													myEmitter.emit('checkIntent');
												} else {
													res.json({
														"err_code": "525",
														"err_msg": "Category code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkIntent');
										}
									})
									
									myEmitter.prependOnceListener('checkActivityOutcomeCodeableConcept', function () {
										if (!validator.isEmpty(activityOutcomeCodeableConcept)) {
											checkCode(apikey, activityOutcomeCodeableConcept, 'CARE_PLAN_ACTIVITY_OUTCOME', function (resActivityOutcomeCodeableConceptCode) {
												if (resActivityOutcomeCodeableConceptCode.err_code > 0) {
													myEmitter.emit('checkCategory');
												} else {
													res.json({
														"err_code": "524",
														"err_msg": "Activity Outcome Codeable Concept code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkCategory');
										}
									})
									
									myEmitter.prependOnceListener('checkActivityDetailCategory', function () {
										if (!validator.isEmpty(activityDetailCategory)) {
											checkCode(apikey, activityDetailCategory, 'CARE_PLAN_ACTIVITY_CATEGORY', function (resActivityDetailCategoryCode) {
												if (resActivityDetailCategoryCode.err_code > 0) {
													myEmitter.emit('checkActivityOutcomeCodeableConcept');
												} else {
													res.json({
														"err_code": "523",
														"err_msg": "ActivityDetailCategory code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityOutcomeCodeableConcept');
										}
									})
									
									myEmitter.prependOnceListener('checkActivityDetailCode', function () {
										if (!validator.isEmpty(activityDetailCode)) {
											checkCode(apikey, activityDetailCode, 'CARE_PLAN_ACTIVITY', function (resActivityDetailCodeCode) {
												if (resActivityDetailCodeCode.err_code > 0) {
													myEmitter.emit('checkActivityDetailCategory');
												} else {
													res.json({
														"err_code": "522",
														"err_msg": "ActivityDetailCode code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailCategory');
										}
									})
									
									myEmitter.prependOnceListener('checkActivityDetailReasonCode', function () {
										if (!validator.isEmpty(activityDetailReasonCode)) {
											checkCode(apikey, activityDetailReasonCode, 'ACTIVITY_REASON', function (resActivityDetailReasonCodeCode) {
												if (resActivityDetailReasonCodeCode.err_code > 0) {
													myEmitter.emit('checkActivityDetailCode');
												} else {
													res.json({
														"err_code": "521",
														"err_msg": "ActivityDetailReasonCode code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailCode');
										}
									})
									
									myEmitter.prependOnceListener('checkActivityDetailStatus', function () {
										if (!validator.isEmpty(activityDetailStatus)) {
											checkCode(apikey, activityDetailStatus, 'CARE_PLAN_ACTIVITY_STATUS', function (resActivityDetailStatusCode) {
												if (resActivityDetailStatusCode.err_code > 0) {
													myEmitter.emit('checkActivityDetailReasonCode');
												} else {
													res.json({
														"err_code": "521",
														"err_msg": "ActivityDetailStatus code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailReasonCode');
										}
									})
									
									myEmitter.prependOnceListener('checkActivityDetailProductProductCodeableConcept', function () {
										if (!validator.isEmpty(activityDetailProductProductCodeableConcept)) {
											checkCode(apikey, activityDetailProductProductCodeableConcept, 'MEDICATION_CODES', function (resActivityDetailProductCodeableConceptCode) {
												if (resActivityDetailProductCodeableConceptCode.err_code > 0) {
													myEmitter.emit('checkActivityDetailStatus');
												} else {
													res.json({
														"err_code": "521",
														"err_msg": "ActivityDetailProductCodeableConcept code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailStatus');
										}
									})
									
									//cek value
/*
definitionPlanDefinition|PLAN_DEFINITION
definitionQuestionnaire|QUESTIONNAIRE
partOf|CAREPLAN
basedOn|CAREPLAN
replaces|CAREPLAN
subjectPatient|Patient
subjectGroup|Group
contextEncounter|Encounter
contextEpisodeOfCare|EPISODE_OF_CARE
authorPatient|Patient
authorPractitioner|Practitioner
authorRelatedPerson|Related_Person
authorOrganization|Organization
authorCareTeam|Care_Team
addresses|Condition
goal|goal
activityReferenceAppointment|Appointment
activityReferenceCommunicationRequest|Communication_Request|
activityReferenceDeviceRequest|DEVICE_REQUEST
activityReferenceMedicationRequest|MEDICATION_REQUEST|
activityReferenceNutritionOrder|NUTRITION_ORDER
activityReferenceTask|Task
activityReferenceProcedureRequest|Procedure_Request
activityReferenceReferralRequest|Referral_Request
activityReferenceVisionPrescription|VISION_PRESCRIPTION
activityReferenceRequestGroup|Request_Group
activityDetailDefinitionPlanDefinition|Plan_Definition
activityDetailDefinitionActivityDefinition|Activity_Definition|
activityDetailDefinitionQuestionnaire|Questionnaire
activityDetailReasonReference|Reason_Reference
activityDetailGoal|Goal
activityDetailScheduledScheduledTiming|Timing
activityDetailLocation|location
activityDetailPerformerPractitioner|Practitioner
activityDetailPerformerOrganization|Organization
activityDetailPerformerRelatedPerson|Related_Person
activityDetailPerformerPatient|Patient
activityDetailPerformerCareTeam|Care_Team
activityDetailProductProductReferenceMedication|Medication
activityDetailProductProductReferenceSubstance|Substance*/

									myEmitter.prependOnceListener('checkDefinitionPlanDefinition', function () {
										if (!validator.isEmpty(definitionPlanDefinition)) {
											checkUniqeValue(apikey, "PLAN_DEFINITION_ID|" + definitionPlanDefinition, 'PLAN_DEFINITION', function (resDefinitionPlanDefinition) {
												if (resDefinitionPlanDefinition.err_code > 0) {
													myEmitter.emit('checkActivityDetailProductProductCodeableConcept');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Definition plan definition id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailProductProductCodeableConcept');
										}
									})

									myEmitter.prependOnceListener('checkDefinitionQuestionnaire', function () {
										if (!validator.isEmpty(definitionQuestionnaire)) {
											checkUniqeValue(apikey, "QUESTIONNAIRE_ID|" + definitionQuestionnaire, 'QUESTIONNAIRE', function (resDefinitionQuestionnaire) {
												if (resDefinitionQuestionnaire.err_code > 0) {
													myEmitter.emit('checkDefinitionPlanDefinition');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Definition questionnaire id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkDefinitionPlanDefinition');
										}
									})

									myEmitter.prependOnceListener('checkPartOf', function () {
										if (!validator.isEmpty(partOf)) {
											checkUniqeValue(apikey, "CAREPLAN_ID|" + partOf, 'CAREPLAN', function (resPartOf) {
												if (resPartOf.err_code > 0) {
													myEmitter.emit('checkDefinitionQuestionnaire');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Part of id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkDefinitionQuestionnaire');
										}
									})

									myEmitter.prependOnceListener('checkBasedOn', function () {
										if (!validator.isEmpty(basedOn)) {
											checkUniqeValue(apikey, "CAREPLAN_ID|" + basedOn, 'CAREPLAN', function (resBasedOn) {
												if (resBasedOn.err_code > 0) {
													myEmitter.emit('checkPartOf');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Based on id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkPartOf');
										}
									})

									myEmitter.prependOnceListener('checkReplaces', function () {
										if (!validator.isEmpty(replaces)) {
											checkUniqeValue(apikey, "CAREPLAN_ID|" + replaces, 'CAREPLAN', function (resReplaces) {
												if (resReplaces.err_code > 0) {
													myEmitter.emit('checkBasedOn');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Replaces id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkBasedOn');
										}
									})

									myEmitter.prependOnceListener('checkSubjectPatient', function () {
										if (!validator.isEmpty(subjectPatient)) {
											checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
												if (resSubjectPatient.err_code > 0) {
													myEmitter.emit('checkReplaces');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Subject patient id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkReplaces');
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

									myEmitter.prependOnceListener('checkAuthorPatient', function () {
										if (!validator.isEmpty(authorPatient)) {
											checkUniqeValue(apikey, "PATIENT_ID|" + authorPatient, 'PATIENT', function (resAuthorPatient) {
												if (resAuthorPatient.err_code > 0) {
													myEmitter.emit('checkContextEpisodeOfCare');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Author patient id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkContextEpisodeOfCare');
										}
									})

									myEmitter.prependOnceListener('checkAuthorPractitioner', function () {
										if (!validator.isEmpty(authorPractitioner)) {
											checkUniqeValue(apikey, "PRACTITIONER_ID|" + authorPractitioner, 'PRACTITIONER', function (resAuthorPractitioner) {
												if (resAuthorPractitioner.err_code > 0) {
													myEmitter.emit('checkAuthorPatient');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Author practitioner id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkAuthorPatient');
										}
									})

									myEmitter.prependOnceListener('checkAuthorRelatedPerson', function () {
										if (!validator.isEmpty(authorRelatedPerson)) {
											checkUniqeValue(apikey, "RELATED_PERSON_ID|" + authorRelatedPerson, 'RELATED_PERSON', function (resAuthorRelatedPerson) {
												if (resAuthorRelatedPerson.err_code > 0) {
													myEmitter.emit('checkAuthorPractitioner');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Author related person id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkAuthorPractitioner');
										}
									})

									myEmitter.prependOnceListener('checkAuthorOrganization', function () {
										if (!validator.isEmpty(authorOrganization)) {
											checkUniqeValue(apikey, "ORGANIZATION_ID|" + authorOrganization, 'ORGANIZATION', function (resAuthorOrganization) {
												if (resAuthorOrganization.err_code > 0) {
													myEmitter.emit('checkAuthorRelatedPerson');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Author organization id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkAuthorRelatedPerson');
										}
									})

									myEmitter.prependOnceListener('checkAuthorCareTeam', function () {
										if (!validator.isEmpty(authorCareTeam)) {
											checkUniqeValue(apikey, "CARE_TEAM_ID|" + authorCareTeam, 'CARE_TEAM', function (resAuthorCareTeam) {
												if (resAuthorCareTeam.err_code > 0) {
													myEmitter.emit('checkAuthorOrganization');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Author care team id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkAuthorOrganization');
										}
									})

									myEmitter.prependOnceListener('checkAddresses', function () {
										if (!validator.isEmpty(addresses)) {
											checkUniqeValue(apikey, "CONDITION_ID|" + addresses, 'CONDITION', function (resAddresses) {
												if (resAddresses.err_code > 0) {
													myEmitter.emit('checkAuthorCareTeam');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Addresses id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkAuthorCareTeam');
										}
									})

									myEmitter.prependOnceListener('checkGoal', function () {
										if (!validator.isEmpty(goal)) {
											checkUniqeValue(apikey, "GOAL_ID|" + goal, 'GOAL', function (resGoal) {
												if (resGoal.err_code > 0) {
													myEmitter.emit('checkAddresses');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Goal id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkAddresses');
										}
									})

									myEmitter.prependOnceListener('checkActivityReferenceAppointment', function () {
										if (!validator.isEmpty(activityReferenceAppointment)) {
											checkUniqeValue(apikey, "APPOINTMENT_ID|" + activityReferenceAppointment, 'APPOINTMENT', function (resActivityReferenceAppointment) {
												if (resActivityReferenceAppointment.err_code > 0) {
													myEmitter.emit('checkGoal');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity reference appointment id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkGoal');
										}
									})

									myEmitter.prependOnceListener('checkActivityReferenceCommunicationRequest', function () {
										if (!validator.isEmpty(activityReferenceCommunicationRequest)) {
											checkUniqeValue(apikey, "COMMUNICATION_REQUEST_ID|" + activityReferenceCommunicationRequest, 'COMMUNICATION_REQUEST', function (resActivityReferenceCommunicationRequest) {
												if (resActivityReferenceCommunicationRequest.err_code > 0) {
													myEmitter.emit('checkActivityReferenceAppointment');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity reference communication request id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityReferenceAppointment');
										}
									})

									myEmitter.prependOnceListener('checkActivityReferenceDeviceRequest', function () {
										if (!validator.isEmpty(activityReferenceDeviceRequest)) {
											checkUniqeValue(apikey, "DEVICE_REQUEST_ID|" + activityReferenceDeviceRequest, 'DEVICE_REQUEST', function (resActivityReferenceDeviceRequest) {
												if (resActivityReferenceDeviceRequest.err_code > 0) {
													myEmitter.emit('checkActivityReferenceCommunicationRequest');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity reference device request id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityReferenceCommunicationRequest');
										}
									})

									myEmitter.prependOnceListener('checkActivityReferenceMedicationRequest', function () {
										if (!validator.isEmpty(activityReferenceMedicationRequest)) {
											checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + activityReferenceMedicationRequest, 'MEDICATION_REQUEST', function (resActivityReferenceMedicationRequest) {
												if (resActivityReferenceMedicationRequest.err_code > 0) {
													myEmitter.emit('checkActivityReferenceDeviceRequest');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity reference medication request id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityReferenceDeviceRequest');
										}
									})


									myEmitter.prependOnceListener('checkActivityReferenceNutritionOrder', function () {
										if (!validator.isEmpty(activityReferenceNutritionOrder)) {
											checkUniqeValue(apikey, "NUTRITION_ORDER_ID|" + activityReferenceNutritionOrder, 'NUTRITION_ORDER', function (resActivityReferenceNutritionOrder) {
												if (resActivityReferenceNutritionOrder.err_code > 0) {
													myEmitter.emit('checkActivityReferenceMedicationRequest');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity reference nutrition order id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityReferenceMedicationRequest');
										}
									})

									myEmitter.prependOnceListener('checkActivityReferenceTask', function () {
										if (!validator.isEmpty(activityReferenceTask)) {
											checkUniqeValue(apikey, "TASK_ID|" + activityReferenceTask, 'TASK', function (resActivityReferenceTask) {
												if (resActivityReferenceTask.err_code > 0) {
													myEmitter.emit('checkActivityReferenceNutritionOrder');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity reference task id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityReferenceNutritionOrder');
										}
									})

									myEmitter.prependOnceListener('checkActivityReferenceProcedureRequest', function () {
										if (!validator.isEmpty(activityReferenceProcedureRequest)) {
											checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + activityReferenceProcedureRequest, 'PROCEDURE_REQUEST', function (resActivityReferenceProcedureRequest) {
												if (resActivityReferenceProcedureRequest.err_code > 0) {
													myEmitter.emit('checkActivityReferenceTask');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity reference procedure request id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityReferenceTask');
										}
									})

									myEmitter.prependOnceListener('checkActivityReferenceReferralRequest', function () {
										if (!validator.isEmpty(activityReferenceReferralRequest)) {
											checkUniqeValue(apikey, "REFERRAL_REQUEST_ID|" + activityReferenceReferralRequest, 'REFERRAL_REQUEST', function (resActivityReferenceReferralRequest) {
												if (resActivityReferenceReferralRequest.err_code > 0) {
													myEmitter.emit('checkActivityReferenceProcedureRequest');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity reference referral request id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityReferenceProcedureRequest');
										}
									})

									myEmitter.prependOnceListener('checkActivityReferenceVisionPrescription', function () {
										if (!validator.isEmpty(activityReferenceVisionPrescription)) {
											checkUniqeValue(apikey, "VISION_PRESCRIPTION_ID|" + activityReferenceVisionPrescription, 'VISION_PRESCRIPTION', function (resActivityReferenceVisionPrescription) {
												if (resActivityReferenceVisionPrescription.err_code > 0) {
													myEmitter.emit('checkActivityReferenceReferralRequest');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity reference vision prescription id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityReferenceReferralRequest');
										}
									})

									myEmitter.prependOnceListener('checkActivityReferenceRequestGroup', function () {
										if (!validator.isEmpty(activityReferenceRequestGroup)) {
											checkUniqeValue(apikey, "REQUEST_GROUP_ID|" + activityReferenceRequestGroup, 'REQUEST_GROUP', function (resActivityReferenceRequestGroup) {
												if (resActivityReferenceRequestGroup.err_code > 0) {
													myEmitter.emit('checkActivityReferenceVisionPrescription');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity reference request group id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityReferenceVisionPrescription');
										}
									})

									myEmitter.prependOnceListener('checkActivityDetailDefinitionPlanDefinition', function () {
										if (!validator.isEmpty(activityDetailDefinitionPlanDefinition)) {
											checkUniqeValue(apikey, "PLAN_DEFINITION_ID|" + activityDetailDefinitionPlanDefinition, 'PLAN_DEFINITION', function (resActivityDetailDefinitionPlanDefinition) {
												if (resActivityDetailDefinitionPlanDefinition.err_code > 0) {
													myEmitter.emit('checkActivityReferenceRequestGroup');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity detail definition plan definition id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityReferenceRequestGroup');
										}
									})

									myEmitter.prependOnceListener('checkActivityDetailDefinitionActivityDefinition', function () {
										if (!validator.isEmpty(activityDetailDefinitionActivityDefinition)) {
											checkUniqeValue(apikey, "ACTIVITY_DEFINITION_ID|" + activityDetailDefinitionActivityDefinition, 'ACTIVITY_DEFINITION', function (resActivityDetailDefinitionActivityDefinition) {
												if (resActivityDetailDefinitionActivityDefinition.err_code > 0) {
													myEmitter.emit('checkActivityDetailDefinitionPlanDefinition');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity detail definition activity definition id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailDefinitionPlanDefinition');
										}
									})

									myEmitter.prependOnceListener('checkActivityDetailDefinitionQuestionnaire', function () {
										if (!validator.isEmpty(activityDetailDefinitionQuestionnaire)) {
											checkUniqeValue(apikey, "QUESTIONNAIRE_ID|" + activityDetailDefinitionQuestionnaire, 'QUESTIONNAIRE', function (resActivityDetailDefinitionQuestionnaire) {
												if (resActivityDetailDefinitionQuestionnaire.err_code > 0) {
													myEmitter.emit('checkActivityDetailDefinitionActivityDefinition');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity detail definition questionnaire id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailDefinitionActivityDefinition');
										}
									})

									myEmitter.prependOnceListener('checkActivityDetailReasonReference', function () {
										if (!validator.isEmpty(activityDetailReasonReference)) {
											checkUniqeValue(apikey, "REASON_REFERENCE_ID|" + activityDetailReasonReference, 'REASON_REFERENCE', function (resActivityDetailReasonReference) {
												if (resActivityDetailReasonReference.err_code > 0) {
													myEmitter.emit('checkActivityDetailDefinitionQuestionnaire');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity detail reason reference id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailDefinitionQuestionnaire');
										}
									})

									myEmitter.prependOnceListener('checkActivityDetailGoal', function () {
										if (!validator.isEmpty(activityDetailGoal)) {
											checkUniqeValue(apikey, "GOAL_ID|" + activityDetailGoal, 'GOAL', function (resActivityDetailGoal) {
												if (resActivityDetailGoal.err_code > 0) {
													myEmitter.emit('checkActivityDetailReasonReference');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity detail goal id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailReasonReference');
										}
									})

									myEmitter.prependOnceListener('checkActivityDetailScheduledScheduledTiming', function () {
										if (!validator.isEmpty(activityDetailScheduledScheduledTiming)) {
											checkUniqeValue(apikey, "TIMING_ID|" + activityDetailScheduledScheduledTiming, 'TIMING', function (resActivityDetailScheduledScheduledTiming) {
												if (resActivityDetailScheduledScheduledTiming.err_code > 0) {
													myEmitter.emit('checkActivityDetailGoal');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity detail scheduled scheduled timing id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailGoal');
										}
									})

									myEmitter.prependOnceListener('checkActivityDetailLocation', function () {
										if (!validator.isEmpty(activityDetailLocation)) {
											checkUniqeValue(apikey, "LOCATION_ID|" + activityDetailLocation, 'LOCATION', function (resActivityDetailLocation) {
												if (resActivityDetailLocation.err_code > 0) {
													myEmitter.emit('checkActivityDetailScheduledScheduledTiming');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity detail location id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailScheduledScheduledTiming');
										}
									})

									myEmitter.prependOnceListener('checkActivityDetailPerformerPractitioner', function () {
										if (!validator.isEmpty(activityDetailPerformerPractitioner)) {
											checkUniqeValue(apikey, "PRACTITIONER_ID|" + activityDetailPerformerPractitioner, 'PRACTITIONER', function (resActivityDetailPerformerPractitioner) {
												if (resActivityDetailPerformerPractitioner.err_code > 0) {
													myEmitter.emit('checkActivityDetailLocation');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity detail performer practitioner id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailLocation');
										}
									})

									myEmitter.prependOnceListener('checkActivityDetailPerformerOrganization', function () {
										if (!validator.isEmpty(activityDetailPerformerOrganization)) {
											checkUniqeValue(apikey, "ORGANIZATION_ID|" + activityDetailPerformerOrganization, 'ORGANIZATION', function (resActivityDetailPerformerOrganization) {
												if (resActivityDetailPerformerOrganization.err_code > 0) {
													myEmitter.emit('checkActivityDetailPerformerPractitioner');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity detail performer organization id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailPerformerPractitioner');
										}
									})

									myEmitter.prependOnceListener('checkActivityDetailPerformerRelatedPerson', function () {
										if (!validator.isEmpty(activityDetailPerformerRelatedPerson)) {
											checkUniqeValue(apikey, "RELATED_PERSON_ID|" + activityDetailPerformerRelatedPerson, 'RELATED_PERSON', function (resActivityDetailPerformerRelatedPerson) {
												if (resActivityDetailPerformerRelatedPerson.err_code > 0) {
													myEmitter.emit('checkActivityDetailPerformerOrganization');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity detail performer related person id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailPerformerOrganization');
										}
									})

									myEmitter.prependOnceListener('checkActivityDetailPerformerPatient', function () {
										if (!validator.isEmpty(activityDetailPerformerPatient)) {
											checkUniqeValue(apikey, "PATIENT_ID|" + activityDetailPerformerPatient, 'PATIENT', function (resActivityDetailPerformerPatient) {
												if (resActivityDetailPerformerPatient.err_code > 0) {
													myEmitter.emit('checkActivityDetailPerformerRelatedPerson');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity detail performer patient id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailPerformerRelatedPerson');
										}
									})

									myEmitter.prependOnceListener('checkActivityDetailPerformerCareTeam', function () {
										if (!validator.isEmpty(activityDetailPerformerCareTeam)) {
											checkUniqeValue(apikey, "CARE_TEAM_ID|" + activityDetailPerformerCareTeam, 'CARE_TEAM', function (resActivityDetailPerformerCareTeam) {
												if (resActivityDetailPerformerCareTeam.err_code > 0) {
													myEmitter.emit('checkActivityDetailPerformerPatient');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity detail performer care team id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailPerformerPatient');
										}
									})

									myEmitter.prependOnceListener('checkActivityDetailProductProductReferenceMedication', function () {
										if (!validator.isEmpty(activityDetailProductProductReferenceMedication)) {
											checkUniqeValue(apikey, "MEDICATION_ID|" + activityDetailProductProductReferenceMedication, 'MEDICATION', function (resActivityDetailProductProductReferenceMedication) {
												if (resActivityDetailProductProductReferenceMedication.err_code > 0) {
													myEmitter.emit('checkActivityDetailPerformerCareTeam');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity detail product product reference medication id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkActivityDetailPerformerCareTeam');
										}
									})

									if (!validator.isEmpty(activityDetailProductProductReferenceSubstance)) {
										checkUniqeValue(apikey, "SUBSTANCE_ID|" + activityDetailProductProductReferenceSubstance, 'SUBSTANCE', function (resActivityDetailProductProductReferenceSubstance) {
											if (resActivityDetailProductProductReferenceSubstance.err_code > 0) {
												myEmitter.emit('checkActivityDetailProductProductReferenceMedication');
											} else {
												res.json({
													"err_code": "500",
													"err_msg": "Activity detail product product reference substance id not found"
												});
											}
										})
									} else {
										myEmitter.emit('checkActivityDetailProductProductReferenceMedication');
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
			
		}
	},
	put: {
		carePlan : function putCarePlan(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var carePlanId = req.params.adverse_event_id;

      var err_code = 0;
      var err_msg = "";
      var dataCarePlan = {};

			if(typeof carePlanId !== 'undefined'){
				if(validator.isEmpty(carePlanId)){
					err_code = 2;
					err_msg = "Adverse Event id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Adverse Event id is required";
			}

			if(typeof req.body.definition.planDefinition !== 'undefined' && req.body.definition.planDefinition !== ""){
				dataCarePlan.definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					err_code = 2;
					err_msg = "Care plan definition plan definition is required.";
				}else{
					dataCarePlan.definitionPlanDefinition = definitionPlanDefinition;
				}
			}else{
				definitionPlanDefinition = "";
			}

			if(typeof req.body.definition.questionnaire !== 'undefined' && req.body.definition.questionnaire !== ""){
				dataCarePlan.definitionQuestionnaire =  req.body.definition.questionnaire.trim().toLowerCase();
				if(validator.isEmpty(definitionQuestionnaire)){
					err_code = 2;
					err_msg = "Care plan definition questionnaire is required.";
				}else{
					dataCarePlan.definitionQuestionnaire = definitionQuestionnaire;
				}
			}else{
				definitionQuestionnaire = "";
			}

			if(typeof req.body.partOf !== 'undefined' && req.body.partOf !== ""){
				dataCarePlan.partOf =  req.body.partOf.trim().toLowerCase();
				if(validator.isEmpty(partOf)){
					err_code = 2;
					err_msg = "Care plan part of is required.";
				}else{
					dataCarePlan.partOf = partOf;
				}
			}else{
				partOf = "";
			}

			if(typeof req.body.basedOn !== 'undefined' && req.body.basedOn !== ""){
				dataCarePlan.basedOn =  req.body.basedOn.trim().toLowerCase();
				if(validator.isEmpty(basedOn)){
					err_code = 2;
					err_msg = "Care plan based on is required.";
				}else{
					dataCarePlan.basedOn = basedOn;
				}
			}else{
				basedOn = "";
			}

			if(typeof req.body.replaces !== 'undefined' && req.body.replaces !== ""){
				dataCarePlan.replaces =  req.body.replaces.trim().toLowerCase();
				if(validator.isEmpty(replaces)){
					err_code = 2;
					err_msg = "Care plan replaces is required.";
				}else{
					dataCarePlan.replaces = replaces;
				}
			}else{
				replaces = "";
			}

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				dataCarePlan.status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Care plan status is required.";
				}else{
					dataCarePlan.status = status;
				}
			}else{
				status = "";
			}

			if(typeof req.body.intent !== 'undefined' && req.body.intent !== ""){
				dataCarePlan.intent =  req.body.intent.trim().toLowerCase();
				if(validator.isEmpty(intent)){
					err_code = 2;
					err_msg = "Care plan intent is required.";
				}else{
					dataCarePlan.intent = intent;
				}
			}else{
				intent = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				dataCarePlan.category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					err_code = 2;
					err_msg = "Care plan category is required.";
				}else{
					dataCarePlan.category = category;
				}
			}else{
				category = "";
			}

			if(typeof req.body.title !== 'undefined' && req.body.title !== ""){
				dataCarePlan.title =  req.body.title.trim().toLowerCase();
				if(validator.isEmpty(title)){
					err_code = 2;
					err_msg = "Care plan title is required.";
				}else{
					dataCarePlan.title = title;
				}
			}else{
				title = "";
			}

			if(typeof req.body.description !== 'undefined' && req.body.description !== ""){
				dataCarePlan.description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					err_code = 2;
					err_msg = "Care plan description is required.";
				}else{
					dataCarePlan.description = description;
				}
			}else{
				description = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				dataCarePlan.subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					err_code = 2;
					err_msg = "Care plan subject patient is required.";
				}else{
					dataCarePlan.subjectPatient = subjectPatient;
				}
			}else{
				subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				dataCarePlan.subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					err_code = 2;
					err_msg = "Care plan subject group is required.";
				}else{
					dataCarePlan.subjectGroup = subjectGroup;
				}
			}else{
				subjectGroup = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				dataCarePlan.contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					err_code = 2;
					err_msg = "Care plan context encounter is required.";
				}else{
					dataCarePlan.contextEncounter = contextEncounter;
				}
			}else{
				contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				dataCarePlan.contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					err_code = 2;
					err_msg = "Care plan context episode of care is required.";
				}else{
					dataCarePlan.contextEpisodeOfCare = contextEpisodeOfCare;
				}
			}else{
				contextEpisodeOfCare = "";
			}

			if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
			  var period = req.body.period;
			  if (period.indexOf("to") > 0) {
			    arrPeriod = period.split("to");
			    dataCarePlan.periodStart = arrPeriod[0];
			    dataCarePlan.periodEnd = arrPeriod[1];
			    if (!regex.test(periodStart) && !regex.test(periodEnd)) {
			      err_code = 2;
			      err_msg = "care plan period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "care plan period invalid date format.";
				}
			} else {
				period = "";
			}

			if(typeof req.body.author.patient !== 'undefined' && req.body.author.patient !== ""){
				dataCarePlan.authorPatient =  req.body.author.patient.trim().toLowerCase();
				if(validator.isEmpty(authorPatient)){
					err_code = 2;
					err_msg = "Care plan author patient is required.";
				}else{
					dataCarePlan.authorPatient = authorPatient;
				}
			}else{
				authorPatient = "";
			}

			if(typeof req.body.author.practitioner !== 'undefined' && req.body.author.practitioner !== ""){
				dataCarePlan.authorPractitioner =  req.body.author.practitioner.trim().toLowerCase();
				if(validator.isEmpty(authorPractitioner)){
					err_code = 2;
					err_msg = "Care plan author practitioner is required.";
				}else{
					dataCarePlan.authorPractitioner = authorPractitioner;
				}
			}else{
				authorPractitioner = "";
			}

			if(typeof req.body.author.relatedPerson !== 'undefined' && req.body.author.relatedPerson !== ""){
				dataCarePlan.authorRelatedPerson =  req.body.author.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(authorRelatedPerson)){
					err_code = 2;
					err_msg = "Care plan author related person is required.";
				}else{
					dataCarePlan.authorRelatedPerson = authorRelatedPerson;
				}
			}else{
				authorRelatedPerson = "";
			}

			if(typeof req.body.author.organization !== 'undefined' && req.body.author.organization !== ""){
				dataCarePlan.authorOrganization =  req.body.author.organization.trim().toLowerCase();
				if(validator.isEmpty(authorOrganization)){
					err_code = 2;
					err_msg = "Care plan author organization is required.";
				}else{
					dataCarePlan.authorOrganization = authorOrganization;
				}
			}else{
				authorOrganization = "";
			}

			if(typeof req.body.author.careTeam !== 'undefined' && req.body.author.careTeam !== ""){
				dataCarePlan.authorCareTeam =  req.body.author.careTeam.trim().toLowerCase();
				if(validator.isEmpty(authorCareTeam)){
					err_code = 2;
					err_msg = "Care plan author care team is required.";
				}else{
					dataCarePlan.authorCareTeam = authorCareTeam;
				}
			}else{
				authorCareTeam = "";
			}

			if(typeof req.body.addresses !== 'undefined' && req.body.addresses !== ""){
				dataCarePlan.addresses =  req.body.addresses.trim().toLowerCase();
				if(validator.isEmpty(addresses)){
					err_code = 2;
					err_msg = "Care plan addresses is required.";
				}else{
					dataCarePlan.addresses = addresses;
				}
			}else{
				addresses = "";
			}

			if(typeof req.body.supportingInfo !== 'undefined' && req.body.supportingInfo !== ""){
				dataCarePlan.supportingInfo =  req.body.supportingInfo.trim().toLowerCase();
				if(validator.isEmpty(supportingInfo)){
					err_code = 2;
					err_msg = "Care plan supporting info is required.";
				}else{
					dataCarePlan.supportingInfo = supportingInfo;
				}
			}else{
				supportingInfo = "";
			}

			if(typeof req.body.goal !== 'undefined' && req.body.goal !== ""){
				dataCarePlan.goal =  req.body.goal.trim().toLowerCase();
				if(validator.isEmpty(goal)){
					err_code = 2;
					err_msg = "Care plan goal is required.";
				}else{
					dataCarePlan.goal = goal;
				}
			}else{
				goal = "";
			}

			if(typeof req.body.activity.outcomeCodeableConcept !== 'undefined' && req.body.activity.outcomeCodeableConcept !== ""){
				dataCarePlan.activityOutcomeCodeableConcept =  req.body.activity.outcomeCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(activityOutcomeCodeableConcept)){
					err_code = 2;
					err_msg = "Care plan activity outcome codeable concept is required.";
				}else{
					dataCarePlan.activityOutcomeCodeableConcept = activityOutcomeCodeableConcept;
				}
			}else{
				activityOutcomeCodeableConcept = "";
			}

			if(typeof req.body.activity.outcomeReference !== 'undefined' && req.body.activity.outcomeReference !== ""){
				dataCarePlan.activityOutcomeReference =  req.body.activity.outcomeReference.trim().toLowerCase();
				if(validator.isEmpty(activityOutcomeReference)){
					err_code = 2;
					err_msg = "Care plan activity outcome reference is required.";
				}else{
					dataCarePlan.activityOutcomeReference = activityOutcomeReference;
				}
			}else{
				activityOutcomeReference = "";
			}

			if(typeof req.body.activity.progress !== 'undefined' && req.body.activity.progress !== ""){
				dataCarePlan.activityProgress =  req.body.activity.progress.trim().toLowerCase();
				if(validator.isEmpty(activityProgress)){
					err_code = 2;
					err_msg = "Care plan activity progress is required.";
				}else{
					dataCarePlan.activityProgress = activityProgress;
				}
			}else{
				activityProgress = "";
			}

			if(typeof req.body.activity.reference.appointment !== 'undefined' && req.body.activity.reference.appointment !== ""){
				dataCarePlan.activityReferenceAppointment =  req.body.activity.reference.appointment.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceAppointment)){
					err_code = 2;
					err_msg = "Care plan activity reference appointment is required.";
				}else{
					dataCarePlan.activityReferenceAppointment = activityReferenceAppointment;
				}
			}else{
				activityReferenceAppointment = "";
			}

			if(typeof req.body.activity.reference.communicationRequest !== 'undefined' && req.body.activity.reference.communicationRequest !== ""){
				dataCarePlan.activityReferenceCommunicationRequest =  req.body.activity.reference.communicationRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceCommunicationRequest)){
					err_code = 2;
					err_msg = "Care plan activity reference communication request is required.";
				}else{
					dataCarePlan.activityReferenceCommunicationRequest = activityReferenceCommunicationRequest;
				}
			}else{
				activityReferenceCommunicationRequest = "";
			}

			if(typeof req.body.activity.reference.deviceRequest !== 'undefined' && req.body.activity.reference.deviceRequest !== ""){
				dataCarePlan.activityReferenceDeviceRequest =  req.body.activity.reference.deviceRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceDeviceRequest)){
					err_code = 2;
					err_msg = "Care plan activity reference device request is required.";
				}else{
					dataCarePlan.activityReferenceDeviceRequest = activityReferenceDeviceRequest;
				}
			}else{
				activityReferenceDeviceRequest = "";
			}

			if(typeof req.body.activity.reference.medicationRequest !== 'undefined' && req.body.activity.reference.medicationRequest !== ""){
				dataCarePlan.activityReferenceMedicationRequest =  req.body.activity.reference.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceMedicationRequest)){
					err_code = 2;
					err_msg = "Care plan activity reference medication request is required.";
				}else{
					dataCarePlan.activityReferenceMedicationRequest = activityReferenceMedicationRequest;
				}
			}else{
				activityReferenceMedicationRequest = "";
			}

			if(typeof req.body.activity.reference.nutritionOrder !== 'undefined' && req.body.activity.reference.nutritionOrder !== ""){
				dataCarePlan.activityReferenceNutritionOrder =  req.body.activity.reference.nutritionOrder.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceNutritionOrder)){
					err_code = 2;
					err_msg = "Care plan activity reference nutrition order is required.";
				}else{
					dataCarePlan.activityReferenceNutritionOrder = activityReferenceNutritionOrder;
				}
			}else{
				activityReferenceNutritionOrder = "";
			}

			if(typeof req.body.activity.reference.task !== 'undefined' && req.body.activity.reference.task !== ""){
				dataCarePlan.activityReferenceTask =  req.body.activity.reference.task.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceTask)){
					err_code = 2;
					err_msg = "Care plan activity reference task is required.";
				}else{
					dataCarePlan.activityReferenceTask = activityReferenceTask;
				}
			}else{
				activityReferenceTask = "";
			}

			if(typeof req.body.activity.reference.procedureRequest !== 'undefined' && req.body.activity.reference.procedureRequest !== ""){
				dataCarePlan.activityReferenceProcedureRequest =  req.body.activity.reference.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceProcedureRequest)){
					err_code = 2;
					err_msg = "Care plan activity reference procedure request is required.";
				}else{
					dataCarePlan.activityReferenceProcedureRequest = activityReferenceProcedureRequest;
				}
			}else{
				activityReferenceProcedureRequest = "";
			}

			if(typeof req.body.activity.reference.referralRequest !== 'undefined' && req.body.activity.reference.referralRequest !== ""){
				dataCarePlan.activityReferenceReferralRequest =  req.body.activity.reference.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceReferralRequest)){
					err_code = 2;
					err_msg = "Care plan activity reference referral request is required.";
				}else{
					dataCarePlan.activityReferenceReferralRequest = activityReferenceReferralRequest;
				}
			}else{
				activityReferenceReferralRequest = "";
			}

			if(typeof req.body.activity.reference.visionPrescription !== 'undefined' && req.body.activity.reference.visionPrescription !== ""){
				dataCarePlan.activityReferenceVisionPrescription =  req.body.activity.reference.visionPrescription.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceVisionPrescription)){
					err_code = 2;
					err_msg = "Care plan activity reference vision prescription is required.";
				}else{
					dataCarePlan.activityReferenceVisionPrescription = activityReferenceVisionPrescription;
				}
			}else{
				activityReferenceVisionPrescription = "";
			}

			if(typeof req.body.activity.reference.requestGroup !== 'undefined' && req.body.activity.reference.requestGroup !== ""){
				dataCarePlan.activityReferenceRequestGroup =  req.body.activity.reference.requestGroup.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceRequestGroup)){
					err_code = 2;
					err_msg = "Care plan activity reference request group is required.";
				}else{
					dataCarePlan.activityReferenceRequestGroup = activityReferenceRequestGroup;
				}
			}else{
				activityReferenceRequestGroup = "";
			}

			if(typeof req.body.activity.detail.category !== 'undefined' && req.body.activity.detail.category !== ""){
				dataCarePlan.activityDetailCategory =  req.body.activity.detail.category.trim().toLowerCase();
				if(validator.isEmpty(activityDetailCategory)){
					err_code = 2;
					err_msg = "Care plan activity detail category is required.";
				}else{
					dataCarePlan.activityDetailCategory = activityDetailCategory;
				}
			}else{
				activityDetailCategory = "";
			}

			if(typeof req.body.activity.detail.definition.planDefinition !== 'undefined' && req.body.activity.detail.definition.planDefinition !== ""){
				dataCarePlan.activityDetailDefinitionPlanDefinition =  req.body.activity.detail.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDefinitionPlanDefinition)){
					err_code = 2;
					err_msg = "Care plan activity detail definition plan definition is required.";
				}else{
					dataCarePlan.activityDetailDefinitionPlanDefinition = activityDetailDefinitionPlanDefinition;
				}
			}else{
				activityDetailDefinitionPlanDefinition = "";
			}

			if(typeof req.body.activity.detail.definition.activityDefinition !== 'undefined' && req.body.activity.detail.definition.activityDefinition !== ""){
				dataCarePlan.activityDetailDefinitionActivityDefinition =  req.body.activity.detail.definition.activityDefinition.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDefinitionActivityDefinition)){
					err_code = 2;
					err_msg = "Care plan activity detail definition activity definition is required.";
				}else{
					dataCarePlan.activityDetailDefinitionActivityDefinition = activityDetailDefinitionActivityDefinition;
				}
			}else{
				activityDetailDefinitionActivityDefinition = "";
			}

			if(typeof req.body.activity.detail.definition.questionnaire !== 'undefined' && req.body.activity.detail.definition.questionnaire !== ""){
				dataCarePlan.activityDetailDefinitionQuestionnaire =  req.body.activity.detail.definition.questionnaire.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDefinitionQuestionnaire)){
					err_code = 2;
					err_msg = "Care plan activity detail definition questionnaire is required.";
				}else{
					dataCarePlan.activityDetailDefinitionQuestionnaire = activityDetailDefinitionQuestionnaire;
				}
			}else{
				activityDetailDefinitionQuestionnaire = "";
			}

			if(typeof req.body.activity.detail.code !== 'undefined' && req.body.activity.detail.code !== ""){
				dataCarePlan.activityDetailCode =  req.body.activity.detail.code.trim().toLowerCase();
				if(validator.isEmpty(activityDetailCode)){
					err_code = 2;
					err_msg = "Care plan activity detail code is required.";
				}else{
					dataCarePlan.activityDetailCode = activityDetailCode;
				}
			}else{
				activityDetailCode = "";
			}

			if(typeof req.body.activity.detail.reasonCode !== 'undefined' && req.body.activity.detail.reasonCode !== ""){
				dataCarePlan.activityDetailReasonCode =  req.body.activity.detail.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(activityDetailReasonCode)){
					err_code = 2;
					err_msg = "Care plan activity detail reason code is required.";
				}else{
					dataCarePlan.activityDetailReasonCode = activityDetailReasonCode;
				}
			}else{
				activityDetailReasonCode = "";
			}

			if(typeof req.body.activity.detail.reasonReference !== 'undefined' && req.body.activity.detail.reasonReference !== ""){
				dataCarePlan.activityDetailReasonReference =  req.body.activity.detail.reasonReference.trim().toLowerCase();
				if(validator.isEmpty(activityDetailReasonReference)){
					err_code = 2;
					err_msg = "Care plan activity detail reason reference is required.";
				}else{
					dataCarePlan.activityDetailReasonReference = activityDetailReasonReference;
				}
			}else{
				activityDetailReasonReference = "";
			}

			if(typeof req.body.activity.detail.goal !== 'undefined' && req.body.activity.detail.goal !== ""){
				dataCarePlan.activityDetailGoal =  req.body.activity.detail.goal.trim().toLowerCase();
				if(validator.isEmpty(activityDetailGoal)){
					err_code = 2;
					err_msg = "Care plan activity detail goal is required.";
				}else{
					dataCarePlan.activityDetailGoal = activityDetailGoal;
				}
			}else{
				activityDetailGoal = "";
			}

			if(typeof req.body.activity.detail.status !== 'undefined' && req.body.activity.detail.status !== ""){
				dataCarePlan.activityDetailStatus =  req.body.activity.detail.status.trim().toLowerCase();
				if(validator.isEmpty(activityDetailStatus)){
					err_code = 2;
					err_msg = "Care plan activity detail status is required.";
				}else{
					dataCarePlan.activityDetailStatus = activityDetailStatus;
				}
			}else{
				activityDetailStatus = "";
			}

			if(typeof req.body.activity.detail.statusReason !== 'undefined' && req.body.activity.detail.statusReason !== ""){
				dataCarePlan.activityDetailStatusReason =  req.body.activity.detail.statusReason.trim().toLowerCase();
				if(validator.isEmpty(activityDetailStatusReason)){
					err_code = 2;
					err_msg = "Care plan activity detail status reason is required.";
				}else{
					dataCarePlan.activityDetailStatusReason = activityDetailStatusReason;
				}
			}else{
				activityDetailStatusReason = "";
			}

			if (typeof req.body.activity.detail.prohibited !== 'undefined' && req.body.activity.detail.prohibited !== "") {
			        dataCarePlan.activityDetailProhibited = req.body.activity.detail.prohibited.trim().toLowerCase();
			        if(activityDetailProhibited === "true" || activityDetailProhibited === "false"){
								dataCarePlan.activityDetailProhibited = activityDetailProhibited;
			        } else {
			          err_code = 2;
			          err_msg = "Care plan activity detail prohibited is must be boolean.";
			        }
			      } else {
			        activityDetailProhibited = "";
			      }

			if(typeof req.body.activity.detail.scheduled.scheduledTiming !== 'undefined' && req.body.activity.detail.scheduled.scheduledTiming !== ""){
				dataCarePlan.activityDetailScheduledScheduledTiming =  req.body.activity.detail.scheduled.scheduledTiming.trim().toLowerCase();
				if(validator.isEmpty(activityDetailScheduledScheduledTiming)){
					err_code = 2;
					err_msg = "Care plan activity detail scheduled scheduled timing is required.";
				}else{
					dataCarePlan.activityDetailScheduledScheduledTiming = activityDetailScheduledScheduledTiming;
				}
			}else{
				activityDetailScheduledScheduledTiming = "";
			}

			if (typeof req.body.activity.detail.scheduled.scheduledPeriod !== 'undefined' && req.body.activity.detail.scheduled.scheduledPeriod !== "") {
			  var activityDetailScheduledScheduledPeriod = req.body.activity.detail.scheduled.scheduledPeriod;
			  if (activityDetailScheduledScheduledPeriod.indexOf("to") > 0) {
			    arrActivityDetailScheduledScheduledPeriod = activityDetailScheduledScheduledPeriod.split("to");
			    dataCarePlan.activityDetailScheduledScheduledPeriodStart = arrActivityDetailScheduledScheduledPeriod[0];
			    dataCarePlan.activityDetailScheduledScheduledPeriodEnd = arrActivityDetailScheduledScheduledPeriod[1];
			    if (!regex.test(activityDetailScheduledScheduledPeriodStart) && !regex.test(activityDetailScheduledScheduledPeriodEnd)) {
			      err_code = 2;
			      err_msg = "care plan activity detail scheduled scheduled period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "care plan activity detail scheduled scheduled period invalid date format.";
				}
			} else {
				activityDetailScheduledScheduledPeriod = "";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledString !== 'undefined' && req.body.activity.detail.scheduled.scheduledString !== ""){
				dataCarePlan.activityDetailScheduledScheduledString =  req.body.activity.detail.scheduled.scheduledString.trim().toLowerCase();
				if(validator.isEmpty(activityDetailScheduledScheduledString)){
					err_code = 2;
					err_msg = "Care plan activity detail scheduled scheduled string is required.";
				}else{
					dataCarePlan.activityDetailScheduledScheduledString = activityDetailScheduledScheduledString;
				}
			}else{
				activityDetailScheduledScheduledString = "";
			}

			if(typeof req.body.activity.detail.location !== 'undefined' && req.body.activity.detail.location !== ""){
				dataCarePlan.activityDetailLocation =  req.body.activity.detail.location.trim().toLowerCase();
				if(validator.isEmpty(activityDetailLocation)){
					err_code = 2;
					err_msg = "Care plan activity detail location is required.";
				}else{
					dataCarePlan.activityDetailLocation = activityDetailLocation;
				}
			}else{
				activityDetailLocation = "";
			}

			if(typeof req.body.activity.detail.performer.practitioner !== 'undefined' && req.body.activity.detail.performer.practitioner !== ""){
				dataCarePlan.activityDetailPerformerPractitioner =  req.body.activity.detail.performer.practitioner.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerPractitioner)){
					err_code = 2;
					err_msg = "Care plan activity detail performer practitioner is required.";
				}else{
					dataCarePlan.activityDetailPerformerPractitioner = activityDetailPerformerPractitioner;
				}
			}else{
				activityDetailPerformerPractitioner = "";
			}

			if(typeof req.body.activity.detail.performer.organization !== 'undefined' && req.body.activity.detail.performer.organization !== ""){
				dataCarePlan.activityDetailPerformerOrganization =  req.body.activity.detail.performer.organization.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerOrganization)){
					err_code = 2;
					err_msg = "Care plan activity detail performer organization is required.";
				}else{
					dataCarePlan.activityDetailPerformerOrganization = activityDetailPerformerOrganization;
				}
			}else{
				activityDetailPerformerOrganization = "";
			}

			if(typeof req.body.activity.detail.performer.relatedPerson !== 'undefined' && req.body.activity.detail.performer.relatedPerson !== ""){
				dataCarePlan.activityDetailPerformerRelatedPerson =  req.body.activity.detail.performer.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerRelatedPerson)){
					err_code = 2;
					err_msg = "Care plan activity detail performer related person is required.";
				}else{
					dataCarePlan.activityDetailPerformerRelatedPerson = activityDetailPerformerRelatedPerson;
				}
			}else{
				activityDetailPerformerRelatedPerson = "";
			}

			if(typeof req.body.activity.detail.performer.patient !== 'undefined' && req.body.activity.detail.performer.patient !== ""){
				dataCarePlan.activityDetailPerformerPatient =  req.body.activity.detail.performer.patient.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerPatient)){
					err_code = 2;
					err_msg = "Care plan activity detail performer patient is required.";
				}else{
					dataCarePlan.activityDetailPerformerPatient = activityDetailPerformerPatient;
				}
			}else{
				activityDetailPerformerPatient = "";
			}

			if(typeof req.body.activity.detail.performer.careTeam !== 'undefined' && req.body.activity.detail.performer.careTeam !== ""){
				dataCarePlan.activityDetailPerformerCareTeam =  req.body.activity.detail.performer.careTeam.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerCareTeam)){
					err_code = 2;
					err_msg = "Care plan activity detail performer care team is required.";
				}else{
					dataCarePlan.activityDetailPerformerCareTeam = activityDetailPerformerCareTeam;
				}
			}else{
				activityDetailPerformerCareTeam = "";
			}

			if(typeof req.body.activity.detail.product.productCodeableConcept !== 'undefined' && req.body.activity.detail.product.productCodeableConcept !== ""){
				dataCarePlan.activityDetailProductProductCodeableConcept =  req.body.activity.detail.product.productCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(activityDetailProductProductCodeableConcept)){
					err_code = 2;
					err_msg = "Care plan activity detail product product codeable concept is required.";
				}else{
					dataCarePlan.activityDetailProductProductCodeableConcept = activityDetailProductProductCodeableConcept;
				}
			}else{
				activityDetailProductProductCodeableConcept = "";
			}

			if(typeof req.body.activity.detail.product.productReference.medication !== 'undefined' && req.body.activity.detail.product.productReference.medication !== ""){
				dataCarePlan.activityDetailProductProductReferenceMedication =  req.body.activity.detail.product.productReference.medication.trim().toLowerCase();
				if(validator.isEmpty(activityDetailProductProductReferenceMedication)){
					err_code = 2;
					err_msg = "Care plan activity detail product product reference medication is required.";
				}else{
					dataCarePlan.activityDetailProductProductReferenceMedication = activityDetailProductProductReferenceMedication;
				}
			}else{
				activityDetailProductProductReferenceMedication = "";
			}

			if(typeof req.body.activity.detail.product.productReference.substance !== 'undefined' && req.body.activity.detail.product.productReference.substance !== ""){
				dataCarePlan.activityDetailProductProductReferenceSubstance =  req.body.activity.detail.product.productReference.substance.trim().toLowerCase();
				if(validator.isEmpty(activityDetailProductProductReferenceSubstance)){
					err_code = 2;
					err_msg = "Care plan activity detail product product reference substance is required.";
				}else{
					dataCarePlan.activityDetailProductProductReferenceSubstance = activityDetailProductProductReferenceSubstance;
				}
			}else{
				activityDetailProductProductReferenceSubstance = "";
			}

			if(typeof req.body.activity.detail.dailyAmount !== 'undefined' && req.body.activity.detail.dailyAmount !== ""){
				dataCarePlan.activityDetailDailyAmount =  req.body.activity.detail.dailyAmount.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDailyAmount)){
					err_code = 2;
					err_msg = "Care plan activity detail daily amount is required.";
				}else{
					dataCarePlan.activityDetailDailyAmount = activityDetailDailyAmount;
				}
			}else{
				activityDetailDailyAmount = "";
			}

			if(typeof req.body.activity.detail.quantity !== 'undefined' && req.body.activity.detail.quantity !== ""){
				dataCarePlan.activityDetailQuantity =  req.body.activity.detail.quantity.trim().toLowerCase();
				if(validator.isEmpty(activityDetailQuantity)){
					err_code = 2;
					err_msg = "Care plan activity detail quantity is required.";
				}else{
					dataCarePlan.activityDetailQuantity = activityDetailQuantity;
				}
			}else{
				activityDetailQuantity = "";
			}

			if(typeof req.body.activity.detail.description !== 'undefined' && req.body.activity.detail.description !== ""){
				dataCarePlan.activityDetailDescription =  req.body.activity.detail.description.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDescription)){
					err_code = 2;
					err_msg = "Care plan activity detail description is required.";
				}else{
					dataCarePlan.activityDetailDescription = activityDetailDescription;
				}
			}else{
				activityDetailDescription = "";
			}

			if(typeof req.body.note !== 'undefined' && req.body.note !== ""){
				dataCarePlan.note =  req.body.note.trim().toLowerCase();
				if(validator.isEmpty(note)){
					err_code = 2;
					err_msg = "Care plan note is required.";
				}else{
					dataCarePlan.note = note;
				}
			}else{
				note = "";
			}
			


			
			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					
									//event emiter
									myEmitter.prependOnceListener('checkEndpointId', function() {
													//proses insert
													//set uniqe id
													var unicId = uniqid.time();
													var identifierId = 'ide' + unicId;
													var carePlanId = 'ade' + unicId;
													
													dataCarePlan = {
														"adverse_event_id" : carePlanId,
														"identifier_id" : identifierId,
														"category" : category,
														"type" : type,
														"subject_patient" : subjectPatient,
														"subject_research_subject" : subjectResearchSubject,
														"subject_research_subject" : subjectResearchSubject,
														"subject_device" : subjectDevice,
														"date" : date,
														"location" : location,
														"seriousness" : seriousness,
														"outcome" : outcome,
														"recorder_patient" : recorderPatient,
														"recorder_practitioner" : recorderPractitioner,
														"recorder_related_person" : recorderRelatedPerson,
														"event_participant_practitioner" : eventParticipantPractitioner,
														"event_participant_device" :eventParticipantDevice,
														"description" : description,
													}
													console.log(dataCarePlan);
													ApiFHIR.post('carePlan', {"apikey": apikey}, {body: dataCarePlan, json: true}, function(error, response, body){
														carePlan = body;
														if(carePlan.err_code > 0){
															res.json(carePlan);	
															console.log("ok");
														}
													});

													//identifier
													/*var identifierSystem = identifierId;
													dataIdentifier = {
																						"id": identifierId,
																						"use": identifierUseCode,
																						"type": identifierTypeCode,
																						"system": identifierSystem,
																						"value": identifierValue,
																						"period_start": identifierPeriodStart,
																						"period_end": identifierPeriodEnd,
																						"adverse_event_id": carePlanId
																					}

													ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
														identifier = body;
														if(identifier.err_code > 0){
															res.json(identifier);	
														}
													})*/

													res.json({"err_code": 0, "err_msg": "Adverse Event has been update.", "data": [{"_id": carePlanId}]});
												
									});
									myEmitter.emit('checkEndpointId');
								
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