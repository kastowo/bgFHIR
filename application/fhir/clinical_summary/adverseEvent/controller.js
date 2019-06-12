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
		adverseEvent : function getAdverseEvent(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};
			//params from query string
			var adverseEventId = req.query._id;
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

			if(typeof adverseEventId !== 'undefined'){
				if(!validator.isEmpty(adverseEventId)){
					qString.adverseEventId = adverseEventId; 
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
					if(!regex.test(date)){
						res.json({"err_code": 1, "err_msg": "Date invalid format."});
					}else{
						qString.date = date; 
					}	
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
			}

			seedPhoenixFHIR.path.GET = {
				"AdverseEvent" : {
					"location": "%(apikey)s/AdverseEvent",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('AdverseEvent', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var adverseEvent = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(adverseEvent.err_code == 0){
								//cek jumdata dulu
								if(adverseEvent.data.length > 0){
									newAdverseEvent = [];
									for(i=0; i < adverseEvent.data.length; i++){
										myEmitter.once("getIdentifier", function(adverseEvent, index, newAdverseEvent, countAdverseEvent){
											//console.log(adverseEvent);
												//get identifier
												qString = {};
												qString._id = adverseEvent.identifierId;
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
														var objectAdverseEvent = {};
														objectAdverseEvent.resourceType = adverseEvent.resourceType;
														objectAdverseEvent.id = adverseEvent.id;
														objectAdverseEvent.identifier = identifier.data;
														objectAdverseEvent.category = adverseEvent.category;
														objectAdverseEvent.type = adverseEvent.type;
														objectAdverseEvent.subject = adverseEvent.subject;
														objectAdverseEvent.date = adverseEvent.date;
														objectAdverseEvent.location = adverseEvent.location;
														objectAdverseEvent.seriousness = adverseEvent.seriousness;
														objectAdverseEvent.outcome = adverseEvent.outcome;
														objectAdverseEvent.eventParticipant = adverseEvent.eventParticipant;
														objectAdverseEvent.description = adverseEvent.description;

														newAdverseEvent[index] = objectAdverseEvent;

														/*if(index == countAdverseEvent -1 ){
															res.json({"err_code": 0, "data":newAdverseEvent});				
														}*/

														myEmitter.once('getSuspectEntity', function(adverseEvent, index, newAdverseEvent, countAdverseEvent){
																qString = {};
																qString.adverse_event_id = adverseEvent.id;
																seedPhoenixFHIR.path.GET = {
																	"SuspectEntity" : {
																		"location": "%(apikey)s/AdverseEventSuspectEntity",
																		"query": qString
																	}
																}

																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																ApiFHIR.get('SuspectEntity', {"apikey": apikey}, {}, function(error, response, body){
																	suspectEntity = JSON.parse(body);
																	if(suspectEntity.err_code == 0){
																		var objectAdverseEvent = {};
																		objectAdverseEvent.resourceType = adverseEvent.resourceType;
																		objectAdverseEvent.id = adverseEvent.id;
																		objectAdverseEvent.identifier = adverseEvent.identifier;
																		objectAdverseEvent.category = adverseEvent.category;
																		objectAdverseEvent.type = adverseEvent.type;
																		objectAdverseEvent.subject = adverseEvent.subject;
																		objectAdverseEvent.date = adverseEvent.date;
																		objectAdverseEvent.location = adverseEvent.location;
																		objectAdverseEvent.seriousness = adverseEvent.seriousness;
																		objectAdverseEvent.outcome = adverseEvent.outcome;
																		objectAdverseEvent.eventParticipant = adverseEvent.eventParticipant;
																		objectAdverseEvent.description = adverseEvent.description;
																		objectAdverseEvent.suspectEntity = suspectEntity.data;

																		newAdverseEvent[index] = objectAdverseEvent;

																		/*if(index == countAdverseEvent -1 ){
																			res.json({"err_code": 0, "data":newAdverseEvent});				
																		}*/
																		myEmitter.once('getReaction', function(adverseEvent, index, newAdverseEvent, countAdverseEvent){
																			qString = {};
																			qString.adverse_event_reaction_id = adverseEvent.id;
																			seedPhoenixFHIR.path.GET = {
																				"AdverseEventReaction" : {
																					"location": "%(apikey)s/AdverseEventReaction",
																					"query": qString
																				}
																			}

																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																			ApiFHIR.get('AdverseEventReaction', {"apikey": apikey}, {}, function(error, response, body){
																				adverseEventReaction = JSON.parse(body);
																				if(adverseEventReaction.err_code == 0){
																					var objectAdverseEvent = {};
																					objectAdverseEvent.resourceType = adverseEvent.resourceType;
																					objectAdverseEvent.id = adverseEvent.id;
																					objectAdverseEvent.identifier = adverseEvent.identifier;
																					objectAdverseEvent.category = adverseEvent.category;
																					objectAdverseEvent.type = adverseEvent.type;
																					objectAdverseEvent.subject = adverseEvent.subject;
																					objectAdverseEvent.date = adverseEvent.date;
																					objectAdverseEvent.reaction = adverseEventReaction.data;
																					objectAdverseEvent.location = adverseEvent.location;
																					objectAdverseEvent.seriousness = adverseEvent.seriousness;
																					objectAdverseEvent.outcome = adverseEvent.outcome;
																					objectAdverseEvent.eventParticipant = adverseEvent.eventParticipant;
																					objectAdverseEvent.description = adverseEvent.description;
																					objectAdverseEvent.suspectEntity = adverseEvent.suspectEntity;

																					newAdverseEvent[index] = objectAdverseEvent;

																					myEmitter.once('getSubjectMedicalHistoryCondition', function(adverseEvent, index, newAdverseEvent, countAdverseEvent){
																						qString = {};
																						qString.adverse_event_subject_medical_history_id = adverseEvent.id;
																						seedPhoenixFHIR.path.GET = {
																							"SubjectMedicalHistoryCondition" : {
																								"location": "%(apikey)s/AdverseEventSubjectMedicalHistoryCondition",
																								"query": qString
																							}
																						}

																						var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																						ApiFHIR.get('SubjectMedicalHistoryCondition', {"apikey": apikey}, {}, function(error, response, body){
																							subjectMedicalHistoryCondition = JSON.parse(body);
																							//console.log(subjectMedicalHistoryCondition.data.id);
																							if(subjectMedicalHistoryCondition.err_code == 0){
																								var objectAdverseEvent = {};
																								var objectSubjectMedicalHistoryCondition = {};
																								objectAdverseEvent.resourceType = adverseEvent.resourceType;
																								objectAdverseEvent.id = adverseEvent.id;
																								objectAdverseEvent.identifier = adverseEvent.identifier;
																								objectAdverseEvent.category = adverseEvent.category;
																								objectAdverseEvent.type = adverseEvent.type;
																								objectAdverseEvent.subject = adverseEvent.subject;
																								objectAdverseEvent.date = adverseEvent.date;
																								objectAdverseEvent.reaction = adverseEvent.reaction;
																								objectAdverseEvent.location = adverseEvent.location;
																								objectAdverseEvent.seriousness = adverseEvent.seriousness;
																								objectAdverseEvent.outcome = adverseEvent.outcome;
																								objectAdverseEvent.eventParticipant = adverseEvent.eventParticipant;
																								objectAdverseEvent.description = adverseEvent.description;
																								objectAdverseEvent.suspectEntity = adverseEvent.suspectEntity;
																								var condition = subjectMedicalHistoryCondition.data;
																								objectSubjectMedicalHistoryCondition.condition = condition;
																								objectAdverseEvent.subjectMedicalHistory = objectSubjectMedicalHistoryCondition;

																								newAdverseEvent[index] = objectAdverseEvent;

																								myEmitter.once('getSubjectMedicalHistoryObservation', function(adverseEvent, index, newAdverseEvent, countAdverseEvent){
																									qString = {};
																									qString.adverse_event_subject_medical_history_id = adverseEvent.id;
																									seedPhoenixFHIR.path.GET = {
																										"SubjectMedicalHistoryObservation" : {
																											"location": "%(apikey)s/AdverseEventSubjectMedicalHistoryObservation",
																											"query": qString
																										}
																									}

																									var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																									ApiFHIR.get('SubjectMedicalHistoryObservation', {"apikey": apikey}, {}, function(error, response, body){
																										subjectMedicalHistoryObservation = JSON.parse(body);
																										//console.log(subjectMedicalHistoryObservation.data.id);
																										if(subjectMedicalHistoryObservation.err_code == 0){
																											var objectAdverseEvent = {};
																											var objectSubjectMedicalHistory = {};
																											objectAdverseEvent.resourceType = adverseEvent.resourceType;
																											objectAdverseEvent.id = adverseEvent.id;
																											objectAdverseEvent.identifier = adverseEvent.identifier;
																											objectAdverseEvent.category = adverseEvent.category;
																											objectAdverseEvent.type = adverseEvent.type;
																											objectAdverseEvent.subject = adverseEvent.subject;
																											objectAdverseEvent.date = adverseEvent.date;
																											objectAdverseEvent.reaction = adverseEvent.reaction;
																											objectAdverseEvent.location = adverseEvent.location;
																											objectAdverseEvent.seriousness = adverseEvent.seriousness;
																											objectAdverseEvent.outcome = adverseEvent.outcome;
																											objectAdverseEvent.eventParticipant = adverseEvent.eventParticipant;
																											objectAdverseEvent.description = adverseEvent.description;
																											objectAdverseEvent.suspectEntity = adverseEvent.suspectEntity;
																											var observation = subjectMedicalHistoryObservation.data;
																											objectSubjectMedicalHistory.condition = adverseEvent.subjectMedicalHistory.condition;
																											objectSubjectMedicalHistory.observation = observation;
																											objectAdverseEvent.subjectMedicalHistory = objectSubjectMedicalHistory;

																											newAdverseEvent[index] = objectAdverseEvent;

																											myEmitter.once('getSubjectMedicalHistoryAllergyIntolerance', function(adverseEvent, index, newAdverseEvent, countAdverseEvent){
																												qString = {};
																												qString.adverse_event_subject_medical_history_id = adverseEvent.id;
																												seedPhoenixFHIR.path.GET = {
																													"SubjectMedicalHistoryAllergyIntolerance" : {
																														"location": "%(apikey)s/AdverseEventSubjectMedicalHistoryAllergyIntolerance",
																														"query": qString
																													}
																												}

																												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																												ApiFHIR.get('SubjectMedicalHistoryAllergyIntolerance', {"apikey": apikey}, {}, function(error, response, body){
																													subjectMedicalHistoryAllergyIntolerance = JSON.parse(body);
																													if(subjectMedicalHistoryAllergyIntolerance.err_code == 0){
																														var objectAdverseEvent = {};
																														var objectSubjectMedicalHistory = {};
																														objectAdverseEvent.resourceType = adverseEvent.resourceType;
																														objectAdverseEvent.id = adverseEvent.id;
																														objectAdverseEvent.identifier = adverseEvent.identifier;
																														objectAdverseEvent.category = adverseEvent.category;
																														objectAdverseEvent.type = adverseEvent.type;
																														objectAdverseEvent.subject = adverseEvent.subject;
																														objectAdverseEvent.date = adverseEvent.date;
																														objectAdverseEvent.reaction = adverseEvent.reaction;
																														objectAdverseEvent.location = adverseEvent.location;
																														objectAdverseEvent.seriousness = adverseEvent.seriousness;
																														objectAdverseEvent.outcome = adverseEvent.outcome;
																														objectAdverseEvent.eventParticipant = adverseEvent.eventParticipant;
																														objectAdverseEvent.description = adverseEvent.description;
																														objectAdverseEvent.suspectEntity = adverseEvent.suspectEntity;
																														var allergyIntolerance = subjectMedicalHistoryAllergyIntolerance.data;
																														objectSubjectMedicalHistory.condition = adverseEvent.subjectMedicalHistory.condition;
																														objectSubjectMedicalHistory.observation = adverseEvent.subjectMedicalHistory.observation;
																														objectSubjectMedicalHistory.allergyIntolerance = allergyIntolerance;
																														objectAdverseEvent.subjectMedicalHistory = objectSubjectMedicalHistory;

																														newAdverseEvent[index] = objectAdverseEvent;

																														myEmitter.once('getSubjectMedicalHistoryFamilyMemberHistory', function(adverseEvent, index, newAdverseEvent, countAdverseEvent){
																															qString = {};
																															qString.adverse_event_subject_medical_history_id = adverseEvent.id;
																															seedPhoenixFHIR.path.GET = {
																																"SubjectMedicalHistoryFamilyMemberHistory" : {
																																	"location": "%(apikey)s/AdverseEventSubjectMedicalHistoryFamilyMemberHistory",
																																	"query": qString
																																}
																															}

																															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																															ApiFHIR.get('SubjectMedicalHistoryFamilyMemberHistory', {"apikey": apikey}, {}, function(error, response, body){
																																subjectMedicalHistoryFamilyMemberHistory = JSON.parse(body);
																																if(subjectMedicalHistoryFamilyMemberHistory.err_code == 0){
																																	var objectAdverseEvent = {};
																																	var objectSubjectMedicalHistory = {};
																																	objectAdverseEvent.resourceType = adverseEvent.resourceType;
																																	objectAdverseEvent.id = adverseEvent.id;
																																	objectAdverseEvent.identifier = adverseEvent.identifier;
																																	objectAdverseEvent.category = adverseEvent.category;
																																	objectAdverseEvent.type = adverseEvent.type;
																																	objectAdverseEvent.subject = adverseEvent.subject;
																																	objectAdverseEvent.date = adverseEvent.date;
																																	objectAdverseEvent.reaction = adverseEvent.reaction;
																																	objectAdverseEvent.location = adverseEvent.location;
																																	objectAdverseEvent.seriousness = adverseEvent.seriousness;
																																	objectAdverseEvent.outcome = adverseEvent.outcome;
																																	objectAdverseEvent.eventParticipant = adverseEvent.eventParticipant;
																																	objectAdverseEvent.description = adverseEvent.description;
																																	objectAdverseEvent.suspectEntity = adverseEvent.suspectEntity;
																																	var familyMemberHistory = subjectMedicalHistoryFamilyMemberHistory.data;
																																	objectSubjectMedicalHistory.condition = adverseEvent.subjectMedicalHistory.condition;
																																	objectSubjectMedicalHistory.observation = adverseEvent.subjectMedicalHistory.observation;
																																	objectSubjectMedicalHistory.allergyIntolerance = adverseEvent.subjectMedicalHistory.allergyIntolerance;
																																	objectSubjectMedicalHistory.familyMemberHistory = familyMemberHistory;
																																	objectAdverseEvent.subjectMedicalHistory = objectSubjectMedicalHistory;

																																	newAdverseEvent[index] = objectAdverseEvent;

																																	myEmitter.once('getSubjectMedicalHistoryImmunization', function(adverseEvent, index, newAdverseEvent, countAdverseEvent){
																																		qString = {};
																																		qString.adverse_event_subject_medical_history_id = adverseEvent.id;
																																		seedPhoenixFHIR.path.GET = {
																																			"SubjectMedicalHistoryImmunization" : {
																																				"location": "%(apikey)s/AdverseEventSubjectMedicalHistoryImmunization",
																																				"query": qString
																																			}
																																		}

																																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																		ApiFHIR.get('SubjectMedicalHistoryImmunization', {"apikey": apikey}, {}, function(error, response, body){
																																			subjectMedicalHistoryImmunization = JSON.parse(body);
																																			if(subjectMedicalHistoryImmunization.err_code == 0){
																																				var objectAdverseEvent = {};
																																				var objectSubjectMedicalHistory = {};
																																				objectAdverseEvent.resourceType = adverseEvent.resourceType;
																																				objectAdverseEvent.id = adverseEvent.id;
																																				objectAdverseEvent.identifier = adverseEvent.identifier;
																																				objectAdverseEvent.category = adverseEvent.category;
																																				objectAdverseEvent.type = adverseEvent.type;
																																				objectAdverseEvent.subject = adverseEvent.subject;
																																				objectAdverseEvent.date = adverseEvent.date;
																																				objectAdverseEvent.reaction = adverseEvent.reaction;
																																				objectAdverseEvent.location = adverseEvent.location;
																																				objectAdverseEvent.seriousness = adverseEvent.seriousness;
																																				objectAdverseEvent.outcome = adverseEvent.outcome;
																																				objectAdverseEvent.eventParticipant = adverseEvent.eventParticipant;
																																				objectAdverseEvent.description = adverseEvent.description;
																																				objectAdverseEvent.suspectEntity = adverseEvent.suspectEntity;
																																				var immunization = subjectMedicalHistoryImmunization.data;
																																				objectSubjectMedicalHistory.condition = adverseEvent.subjectMedicalHistory.condition;
																																				objectSubjectMedicalHistory.observation = adverseEvent.subjectMedicalHistory.observation;
																																				objectSubjectMedicalHistory.allergyIntolerance = adverseEvent.subjectMedicalHistory.allergyIntolerance;
																																				objectSubjectMedicalHistory.familyMemberHistory = adverseEvent.subjectMedicalHistory.familyMemberHistory;
																																				objectSubjectMedicalHistory.immunization = immunization;
																																				objectAdverseEvent.subjectMedicalHistory = objectSubjectMedicalHistory;

																																				newAdverseEvent[index] = objectAdverseEvent;

																																				myEmitter.once('getSubjectMedicalHistoryProcedure', function(adverseEvent, index, newAdverseEvent, countAdverseEvent){
																																					qString = {};
																																					qString.adverse_event_subject_medical_history_id = adverseEvent.id;
																																					seedPhoenixFHIR.path.GET = {
																																						"SubjectMedicalHistoryProcedure" : {
																																							"location": "%(apikey)s/AdverseEventSubjectMedicalHistoryProcedure",
																																							"query": qString
																																						}
																																					}

																																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																					ApiFHIR.get('SubjectMedicalHistoryProcedure', {"apikey": apikey}, {}, function(error, response, body){
																																						subjectMedicalHistoryProcedure = JSON.parse(body);
																																						if(subjectMedicalHistoryProcedure.err_code == 0){
																																							var objectAdverseEvent = {};
																																							var objectSubjectMedicalHistory = {};
																																							objectAdverseEvent.resourceType = adverseEvent.resourceType;
																																							objectAdverseEvent.id = adverseEvent.id;
																																							objectAdverseEvent.identifier = adverseEvent.identifier;
																																							objectAdverseEvent.category = adverseEvent.category;
																																							objectAdverseEvent.type = adverseEvent.type;
																																							objectAdverseEvent.subject = adverseEvent.subject;
																																							objectAdverseEvent.date = adverseEvent.date;
																																							objectAdverseEvent.reaction = adverseEvent.reaction;
																																							objectAdverseEvent.location = adverseEvent.location;
																																							objectAdverseEvent.seriousness = adverseEvent.seriousness;
																																							objectAdverseEvent.outcome = adverseEvent.outcome;
																																							objectAdverseEvent.eventParticipant = adverseEvent.eventParticipant;
																																							objectAdverseEvent.description = adverseEvent.description;
																																							objectAdverseEvent.suspectEntity = adverseEvent.suspectEntity;
																																							var procedure = subjectMedicalHistoryProcedure.data;
																																							objectSubjectMedicalHistory.condition = adverseEvent.subjectMedicalHistory.condition;
																																							objectSubjectMedicalHistory.observation = adverseEvent.subjectMedicalHistory.observation;
																																							objectSubjectMedicalHistory.allergyIntolerance = adverseEvent.subjectMedicalHistory.allergyIntolerance;
																																							objectSubjectMedicalHistory.familyMemberHistory = adverseEvent.subjectMedicalHistory.familyMemberHistory;
																																							objectSubjectMedicalHistory.immunization = adverseEvent.subjectMedicalHistory.immunization;
																																							objectSubjectMedicalHistory.procedure = procedure;
																																							objectAdverseEvent.subjectMedicalHistory = objectSubjectMedicalHistory;

																																							newAdverseEvent[index] = objectAdverseEvent;

																																							/*if(index == countAdverseEvent -1 ){
																																								res.json({"err_code": 0, "data":newAdverseEvent});				
																																							}	*/
																																							myEmitter.once('getAdverseEventReferenceDocument', function(adverseEvent, index, newAdverseEvent, countAdverseEvent){
																																								qString = {};
																																								qString.adverse_event_subject_medical_history_id = adverseEvent.id;
																																								seedPhoenixFHIR.path.GET = {
																																									"AdverseEventReferenceDocument" : {
																																										"location": "%(apikey)s/AdverseEventReferenceDocument",
																																										"query": qString
																																									}
																																								}

																																								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																								ApiFHIR.get('AdverseEventReferenceDocument', {"apikey": apikey}, {}, function(error, response, body){
																																									adverseEventReferenceDocument = JSON.parse(body);
																																									if(adverseEventReferenceDocument.err_code == 0){
																																										var objectAdverseEvent = {};
																																										var objectSubjectMedicalHistory = {};
																																										objectAdverseEvent.resourceType = adverseEvent.resourceType;
																																										objectAdverseEvent.id = adverseEvent.id;
																																										objectAdverseEvent.identifier = adverseEvent.identifier;
																																										objectAdverseEvent.category = adverseEvent.category;
																																										objectAdverseEvent.type = adverseEvent.type;
																																										objectAdverseEvent.subject = adverseEvent.subject;
																																										objectAdverseEvent.date = adverseEvent.date;
																																										objectAdverseEvent.reaction = adverseEvent.reaction;
																																										objectAdverseEvent.location = adverseEvent.location;
																																										objectAdverseEvent.seriousness = adverseEvent.seriousness;
																																										objectAdverseEvent.outcome = adverseEvent.outcome;
																																										objectAdverseEvent.eventParticipant = adverseEvent.eventParticipant;
																																										objectAdverseEvent.description = adverseEvent.description;
																																										objectAdverseEvent.suspectEntity = adverseEvent.suspectEntity;
																																										objectAdverseEvent.subjectMedicalHistory = adverseEvent.subjectMedicalHistory;
																																										objectAdverseEvent.referenceDocument = adverseEventReferenceDocument.data;

																																										newAdverseEvent[index] = objectAdverseEvent;

																																										myEmitter.once('getAdverseEventResearchStudy', function(adverseEvent, index, newAdverseEvent, countAdverseEvent){
																																											qString = {};
																																											qString.adverse_event_subject_medical_history_id = adverseEvent.id;
																																											seedPhoenixFHIR.path.GET = {
																																												"AdverseEventResearchStudy" : {
																																													"location": "%(apikey)s/AdverseEventResearchStudy",
																																													"query": qString
																																												}
																																											}

																																											var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																											ApiFHIR.get('AdverseEventResearchStudy', {"apikey": apikey}, {}, function(error, response, body){
																																												adverseEventResearchStudy = JSON.parse(body);
																																												if(adverseEventResearchStudy.err_code == 0){
																																													var objectAdverseEvent = {};
																																													var objectSubjectMedicalHistory = {};
																																													objectAdverseEvent.resourceType = adverseEvent.resourceType;
																																													objectAdverseEvent.id = adverseEvent.id;
																																													objectAdverseEvent.identifier = adverseEvent.identifier;
																																													objectAdverseEvent.category = adverseEvent.category;
																																													objectAdverseEvent.type = adverseEvent.type;
																																													objectAdverseEvent.subject = adverseEvent.subject;
																																													objectAdverseEvent.date = adverseEvent.date;
																																													objectAdverseEvent.reaction = adverseEvent.reaction;
																																													objectAdverseEvent.location = adverseEvent.location;
																																													objectAdverseEvent.seriousness = adverseEvent.seriousness;
																																													objectAdverseEvent.outcome = adverseEvent.outcome;
																																													objectAdverseEvent.eventParticipant = adverseEvent.eventParticipant;
																																													objectAdverseEvent.description = adverseEvent.description;
																																													objectAdverseEvent.suspectEntity = adverseEvent.suspectEntity;
																																													objectAdverseEvent.subjectMedicalHistory = adverseEvent.subjectMedicalHistory;
																																													objectAdverseEvent.referenceDocument = adverseEvent.referenceDocument;
																																													objectAdverseEvent.study = adverseEventResearchStudy.data;

																																													newAdverseEvent[index] = objectAdverseEvent;

																																													if(index == countAdverseEvent -1 ){
																																														res.json({"err_code": 0, "data":newAdverseEvent});				
																																													}			
																																												}else{
																																													res.json(adverseEventResearchStudy);			
																																												}
																																											})
																																										})
																																										myEmitter.emit('getAdverseEventResearchStudy', objectAdverseEvent, index, newAdverseEvent, countAdverseEvent);	
																																									}else{
																																										res.json(adverseEventReferenceDocument);			
																																									}
																																								})
																																							})
																																							myEmitter.emit('getAdverseEventReferenceDocument', objectAdverseEvent, index, newAdverseEvent, countAdverseEvent);
																																						}else{
																																							res.json(subjectMedicalHistoryProcedure);			
																																						}
																																					})
																																				})
																																				myEmitter.emit('getSubjectMedicalHistoryProcedure', objectAdverseEvent, index, newAdverseEvent, countAdverseEvent);			
																																			}else{
																																				res.json(subjectMedicalHistoryImmunization);			
																																			}
																																		})
																																	})
																																	myEmitter.emit('getSubjectMedicalHistoryImmunization', objectAdverseEvent, index, newAdverseEvent, countAdverseEvent);				
																																}else{
																																	res.json(subjectMedicalHistoryFamilyMemberHistory);			
																																}
																															})
																														})
																														myEmitter.emit('getSubjectMedicalHistoryFamilyMemberHistory', objectAdverseEvent, index, newAdverseEvent, countAdverseEvent);			
																													}else{
																														res.json(subjectMedicalHistoryAllergyIntolerance);			
																													}
																												})
																											})
																											myEmitter.emit('getSubjectMedicalHistoryAllergyIntolerance', objectAdverseEvent, index, newAdverseEvent, countAdverseEvent);

																										}else{
																											res.json(subjectMedicalHistoryObservation);			
																										}
																									})
																								})
																								myEmitter.emit('getSubjectMedicalHistoryObservation', objectAdverseEvent, index, newAdverseEvent, countAdverseEvent);			
																							}else{
																								res.json(subjectMedicalHistoryCondition);			
																							}
																						})
																					})
																					myEmitter.emit('getSubjectMedicalHistoryCondition', objectAdverseEvent, index, newAdverseEvent, countAdverseEvent);			
																				}else{
																					res.json(adverseEventReaction);			
																				}
																			})
																		})
																		myEmitter.emit('getReaction', objectAdverseEvent, index, newAdverseEvent, countAdverseEvent);
																	}else{
																		res.json(suspectEntity);			
																	}
																})
															})
														myEmitter.emit('getSuspectEntity', objectAdverseEvent, index, newAdverseEvent, countAdverseEvent);
													}else{
														res.json(identifier);
													}
												})
											})
										myEmitter.emit("getIdentifier", adverseEvent.data[i], i, newAdverseEvent, adverseEvent.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Adverse Event is empty."});	
								}
							}else{
								res.json(adverseEvent);
							}
						}
					});
				}else{
					result.err_code = 500;
					res.json(result);
				}
			});	
		},
		adverseEventSuspectEntity: function getAdverseEventSuspectEntity(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var adverseEventId = req.params.adverse_event_id;
			var adverseEventSuspectEntityId = req.params.adverse_event_suspect_entity_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "ADVERSE_EVENT_ID|" + adverseEventId, 'ADVERSE_EVENT', function(resAdverseEvent){
						if(resAdverseEvent.err_code > 0){
							if(typeof adverseEventSuspectEntityId !== 'undefined' && !validator.isEmpty(adverseEventSuspectEntityId)){
								checkUniqeValue(apikey, "SUSPECT_ENTITY_ID|" + adverseEventSuspectEntityId, 'ADVERSE_EVENT_SUSPECT_ENTITY', function(resAdverseEventSuspectEntityID){
									if(resAdverseEventSuspectEntityID.err_code > 0){
										//get adverseEventSuspectEntity
										qString = {};
										qString.adverse_event_id = adverseEventId;
										qString._id = adverseEventSuspectEntityId;
										seedPhoenixFHIR.path.GET = {
											"AdverseEventSuspectEntity" : {
												"location": "%(apikey)s/AdverseEventSuspectEntity",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('AdverseEventSuspectEntity', {"apikey": apikey}, {}, function(error, response, body){
											adverseEventSuspectEntity = JSON.parse(body);
											if(adverseEventSuspectEntity.err_code == 0){
												res.json({"err_code": 0, "data":adverseEventSuspectEntity.data});	
											}else{
												res.json(adverseEventSuspectEntity);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Adverse Event Suspect Entity Id not found"});		
									}
								})
							}else{
								//get adverseEventSuspectEntity
								qString = {};
								qString.adverse_event_id = adverseEventId;
								seedPhoenixFHIR.path.GET = {
									"AdverseEventSuspectEntity" : {
										"location": "%(apikey)s/AdverseEventSuspectEntity",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('AdverseEventSuspectEntity', {"apikey": apikey}, {}, function(error, response, body){
									adverseEventSuspectEntity = JSON.parse(body);
									if(adverseEventSuspectEntity.err_code == 0){
										res.json({"err_code": 0, "data":adverseEventSuspectEntity.data});	
									}else{
										res.json(adverseEventSuspectEntity);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Adverse Event Id not found"});		
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
		adverseEvent : function addAdverseEvent(req, res){
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

/*category|category||
type|type||
subject.patient|subjectPatient||
subject.researchSubject|subjectResearchSubject||
subject.medication|subjectMedication||
subject.device|subjectDevice||
date|date|date|
reaction|reaction||
location|location||
seriousness|seriousness||
outcome|outcome||
recorder.patient|recorderPatient||
recorder.practitioner|recorderPractitioner||
recorder.relatedPerson|recorderRelatedPerson||
eventParticipant.practitioner|eventParticipantPractitioner||
eventParticipant.device|eventParticipantDevice||
description|description||
suspectEntity.instance.substance|suspectEntityInstanceSubstance||
suspectEntity.instance.medication|suspectEntityInstanceMedication||
suspectEntity.instance.medicationAdministration|suspectEntityInstanceMedicationAdministration||
suspectEntity.instance.medicationStatement|suspectEntityInstanceMedicationStatement||
suspectEntity.instance.device|suspectEntityInstanceDevice||
suspectEntity.causality|suspectEntityCausality||
suspectEntity.causalityAssessment|suspectEntityCausalityAssessment||
suspectEntity.causalityProductRelatedness|suspectEntityCausalityProductRelatedness||
suspectEntity.causalityMethod|suspectEntityCausalityMethod||
suspectEntity.causalityAuthor.practitioner|suspectEntityCausalityAuthorPractitioner||
suspectEntity.causalityAuthor.practitionerRole|suspectEntityCausalityAuthorPractitionerRole||
suspectEntity.causalityResult|suspectEntityCausalityResult||
subjectMedicalHistory.condition|subjectMedicalHistoryCondition||
subjectMedicalHistory.observation|subjectMedicalHistoryObservation||
subjectMedicalHistory.allergyIntolerance|subjectMedicalHistoryAllergyIntolerance||
subjectMedicalHistory.familyMemberHistory|subjectMedicalHistoryFamilyMemberHistory||
subjectMedicalHistory.immunization|subjectMedicalHistoryImmunization||
subjectMedicalHistory.procedure|subjectMedicalHistoryProcedure||
referenceDocument|referenceDocument||
study|study|*/
			
			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toUpperCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Adverse Event request.";
			}

			if(typeof req.body.type !== 'undefined'){
				var type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					type = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json Adverse Event request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Adverse Event request.";
			}

			if(typeof req.body.subject.researchSubject !== 'undefined'){
				var subjectResearchSubject =  req.body.subject.researchSubject.trim().toLowerCase();
				if(validator.isEmpty(subjectResearchSubject)){
					subjectResearchSubject = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject research subject' in json Adverse Event request.";
			}

			if(typeof req.body.subject.medication !== 'undefined'){
				var subjectMedication =  req.body.subject.medication.trim().toLowerCase();
				if(validator.isEmpty(subjectMedication)){
					subjectMedication = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject medication' in json Adverse Event request.";
			}

			if(typeof req.body.subject.device !== 'undefined'){
				var subjectDevice =  req.body.subject.device.trim().toLowerCase();
				if(validator.isEmpty(subjectDevice)){
					subjectDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject device' in json Adverse Event request.";
			}

			if(typeof req.body.date !== 'undefined'){
				var date =  req.body.date;
				if(validator.isEmpty(date)){
					date = "";
				}else{
					if(!regex.test(date)){
						err_code = 2;
						err_msg = "Allergy Intolerance date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'date' in json Adverse Event request.";
			}

			if(typeof req.body.reaction !== 'undefined'){
				var reaction =  req.body.reaction.trim().toLowerCase();
				if(validator.isEmpty(reaction)){
					reaction = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction' in json Adverse Event request.";
			}

			if(typeof req.body.location !== 'undefined'){
				var location =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(location)){
					location = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'location' in json Adverse Event request.";
			}

			if(typeof req.body.seriousness !== 'undefined'){
				var seriousness =  req.body.seriousness.trim();
				if(validator.isEmpty(seriousness)){
					seriousness = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'seriousness' in json Adverse Event request.";
			}

			if(typeof req.body.outcome !== 'undefined'){
				var outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					outcome = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'outcome' in json Adverse Event request.";
			}

			if(typeof req.body.recorder.patient !== 'undefined'){
				var recorderPatient =  req.body.recorder.patient.trim().toLowerCase();
				if(validator.isEmpty(recorderPatient)){
					recorderPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recorder patient' in json Adverse Event request.";
			}

			if(typeof req.body.recorder.practitioner !== 'undefined'){
				var recorderPractitioner =  req.body.recorder.practitioner.trim().toLowerCase();
				if(validator.isEmpty(recorderPractitioner)){
					recorderPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recorder practitioner' in json Adverse Event request.";
			}

			if(typeof req.body.recorder.relatedPerson !== 'undefined'){
				var recorderRelatedPerson =  req.body.recorder.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(recorderRelatedPerson)){
					recorderRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recorder related person' in json Adverse Event request.";
			}

			if(typeof req.body.eventParticipant.practitioner !== 'undefined'){
				var eventParticipantPractitioner =  req.body.eventParticipant.practitioner.trim().toLowerCase();
				if(validator.isEmpty(eventParticipantPractitioner)){
					eventParticipantPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'event participant practitioner' in json Adverse Event request.";
			}

			if(typeof req.body.eventParticipant.device !== 'undefined'){
				var eventParticipantDevice =  req.body.eventParticipant.device.trim().toLowerCase();
				if(validator.isEmpty(eventParticipantDevice)){
					eventParticipantDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'event participant device' in json Adverse Event request.";
			}

			if(typeof req.body.description !== 'undefined'){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					description = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json Adverse Event request.";
			}

			if(typeof req.body.suspectEntity.instance.substance !== 'undefined'){
				var suspectEntityInstanceSubstance =  req.body.suspectEntity.instance.substance.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceSubstance)){
					suspectEntityInstanceSubstance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity instance substance' in json Adverse Event request.";
			}

			if(typeof req.body.suspectEntity.instance.medication !== 'undefined'){
				var suspectEntityInstanceMedication =  req.body.suspectEntity.instance.medication.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceMedication)){
					suspectEntityInstanceMedication = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity instance medication' in json Adverse Event request.";
			}

			if(typeof req.body.suspectEntity.instance.medicationAdministration !== 'undefined'){
				var suspectEntityInstanceMedicationAdministration =  req.body.suspectEntity.instance.medicationAdministration.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceMedicationAdministration)){
					suspectEntityInstanceMedicationAdministration = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity instance medication administration' in json Adverse Event request.";
			}

			if(typeof req.body.suspectEntity.instance.medicationStatement !== 'undefined'){
				var suspectEntityInstanceMedicationStatement =  req.body.suspectEntity.instance.medicationStatement.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceMedicationStatement)){
					suspectEntityInstanceMedicationStatement = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity instance medication statement' in json Adverse Event request.";
			}

			if(typeof req.body.suspectEntity.instance.device !== 'undefined'){
				var suspectEntityInstanceDevice =  req.body.suspectEntity.instance.device.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceDevice)){
					suspectEntityInstanceDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity instance device' in json Adverse Event request.";
			}

			if(typeof req.body.suspectEntity.causality !== 'undefined'){
				var suspectEntityCausality =  req.body.suspectEntity.causality.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausality)){
					suspectEntityCausality = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality' in json Adverse Event request.";
			}

			if(typeof req.body.suspectEntity.causalityAssessment !== 'undefined'){
				var suspectEntityCausalityAssessment =  req.body.suspectEntity.causalityAssessment.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityAssessment)){
					suspectEntityCausalityAssessment = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality assessment' in json Adverse Event request.";
			}

			if(typeof req.body.suspectEntity.causalityProductRelatedness !== 'undefined'){
				var suspectEntityCausalityProductRelatedness =  req.body.suspectEntity.causalityProductRelatedness.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityProductRelatedness)){
					suspectEntityCausalityProductRelatedness = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality product relatedness' in json Adverse Event request.";
			}

			if(typeof req.body.suspectEntity.causalityMethod !== 'undefined'){
				var suspectEntityCausalityMethod =  req.body.suspectEntity.causalityMethod.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityMethod)){
					suspectEntityCausalityMethod = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality method' in json Adverse Event request.";
			}

			if(typeof req.body.suspectEntity.causalityAuthor.practitioner !== 'undefined'){
				var suspectEntityCausalityAuthorPractitioner =  req.body.suspectEntity.causalityAuthor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityAuthorPractitioner)){
					suspectEntityCausalityAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality author practitioner' in json Adverse Event request.";
			}

			if(typeof req.body.suspectEntity.causalityAuthor.practitionerRole !== 'undefined'){
				var suspectEntityCausalityAuthorPractitionerRole =  req.body.suspectEntity.causalityAuthor.practitionerRole.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityAuthorPractitionerRole)){
					suspectEntityCausalityAuthorPractitionerRole = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality author practitioner role' in json Adverse Event request.";
			}

			if(typeof req.body.suspectEntity.causalityResult !== 'undefined'){
				var suspectEntityCausalityResult =  req.body.suspectEntity.causalityResult.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityResult)){
					suspectEntityCausalityResult = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality result' in json Adverse Event request.";
			}

			if(typeof req.body.subjectMedicalHistory.condition !== 'undefined'){
				var subjectMedicalHistoryCondition =  req.body.subjectMedicalHistory.condition.trim().toLowerCase();
				if(validator.isEmpty(subjectMedicalHistoryCondition)){
					subjectMedicalHistoryCondition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject medical history condition' in json Adverse Event request.";
			}

			if(typeof req.body.subjectMedicalHistory.observation !== 'undefined'){
				var subjectMedicalHistoryObservation =  req.body.subjectMedicalHistory.observation.trim().toLowerCase();
				if(validator.isEmpty(subjectMedicalHistoryObservation)){
					subjectMedicalHistoryObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject medical history observation' in json Adverse Event request.";
			}

			if(typeof req.body.subjectMedicalHistory.allergyIntolerance !== 'undefined'){
				var subjectMedicalHistoryAllergyIntolerance =  req.body.subjectMedicalHistory.allergyIntolerance.trim().toLowerCase();
				if(validator.isEmpty(subjectMedicalHistoryAllergyIntolerance)){
					subjectMedicalHistoryAllergyIntolerance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject medical history allergy intolerance' in json Adverse Event request.";
			}

			if(typeof req.body.subjectMedicalHistory.familyMemberHistory !== 'undefined'){
				var subjectMedicalHistoryFamilyMemberHistory =  req.body.subjectMedicalHistory.familyMemberHistory.trim().toLowerCase();
				if(validator.isEmpty(subjectMedicalHistoryFamilyMemberHistory)){
					subjectMedicalHistoryFamilyMemberHistory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject medical history family member history' in json Adverse Event request.";
			}

			if(typeof req.body.subjectMedicalHistory.immunization !== 'undefined'){
				var subjectMedicalHistoryImmunization =  req.body.subjectMedicalHistory.immunization.trim().toLowerCase();
				if(validator.isEmpty(subjectMedicalHistoryImmunization)){
					subjectMedicalHistoryImmunization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject medical history immunization' in json Adverse Event request.";
			}

			if(typeof req.body.subjectMedicalHistory.procedure !== 'undefined'){
				var subjectMedicalHistoryProcedure =  req.body.subjectMedicalHistory.procedure.trim().toLowerCase();
				if(validator.isEmpty(subjectMedicalHistoryProcedure)){
					subjectMedicalHistoryProcedure = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject medical history procedure' in json Adverse Event request.";
			}

			if(typeof req.body.referenceDocument !== 'undefined'){
				var referenceDocument =  req.body.referenceDocument.trim().toLowerCase();
				if(validator.isEmpty(referenceDocument)){
					referenceDocument = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference document' in json Adverse Event request.";
			}

			if(typeof req.body.study !== 'undefined'){
				var study =  req.body.study.trim().toLowerCase();
				if(validator.isEmpty(study)){
					study = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'study' in json Adverse Event request.";
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
subjectMedicalHistory.Condition|subjectMedicalHistoryCondition
subjectMedicalHistory.Observation|subjectMedicalHistoryObservation
subjectMedicalHistory.AllergyIntolerance|subjectMedicalHistoryAllergyIntolerance
subjectMedicalHistory.FamilyMemberHistory|subjectMedicalHistoryFamilyMemberHistory
subjectMedicalHistory.Immunization|subjectMedicalHistoryImmunization
subjectMedicalHistory.Procedure|subjectMedicalHistoryProcedure
referenceDocument|referenceDocument
study|study									
*/
									//event emiter
									myEmitter.prependOnceListener('checkIdentifierValue', function() {
										
											checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
												if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada
													
													//proses insert

													//set uniqe id
													var unicId = uniqid.time();
													var identifierId = 'ide' + unicId;
													var adverseEventId = 'ade' + unicId;
													var suspectEntityId = 'sue' + unicId;

													dataAdverseEvent = {
														"adverse_event_id" : adverseEventId,
														"identifier_id" : identifierId,
														"category" : category,
														"type" : type,
														"subject_patient" : subjectPatient,
														"subject_research_subject" : subjectResearchSubject,
														"subject_medication" : subjectMedication,
														"subject_device" : subjectDevice,
														"date" : date,
														"location" : location,
														"seriousness" : seriousness,
														"outcome" : outcome,
														"recorder_patient" : recorderPatient,
														"recorder_practitioner" : recorderPractitioner,
														"recorder_related_person" : recorderRelatedPerson,
														"event_participant_practitioner" : eventParticipantPractitioner,
														"event_participant_device" : eventParticipantDevice,
														"description" : description
													}
													console.log(dataAdverseEvent);
													ApiFHIR.post('adverseEvent', {"apikey": apikey}, {body: dataAdverseEvent, json: true}, function(error, response, body){
														adverseEvent = body;
														if(adverseEvent.err_code > 0){
															res.json(adverseEvent);	
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
																						"adverse_event_id": adverseEventId
																					}

													ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
														identifier = body;
														if(identifier.err_code > 0){
															res.json(identifier);	
														}
													})

													
													//suspectEntity
													 dataSuspectEntity = {
														"suspect_entity_id" : suspectEntityId, 
														"instance_substance" : suspectEntityInstanceSubstance, 
														"instance_medication" : suspectEntityInstanceMedication, 
														"instance_medication_administration" : suspectEntityInstanceMedicationAdministration,  
														"instance_medication_statement" : suspectEntityInstanceMedicationStatement, 
														"instance_device" : suspectEntityInstanceDevice, 
														"causality" : suspectEntityCausality, 
														"causality_assessment" : suspectEntityCausalityAssessment, 
														"causality_product_relatedness" : suspectEntityCausalityProductRelatedness, 
														"causality_method" : suspectEntityCausalityMethod, 
														"causality_author_practitioner" : suspectEntityCausalityAuthorPractitioner, 
														"causality_author_practitioner_role" : suspectEntityCausalityAuthorPractitionerRole, 
														"causality_result" : suspectEntityCausalityResult, 
														"adverse_event_id" : adverseEventId
													}
													ApiFHIR.post('adverseEventSuspectEntity', {"apikey": apikey}, {body: dataSuspectEntity, json: true}, function(error, response, body){
														adverseEventSuspectEntity = body;
														if(adverseEventSuspectEntity.err_code > 0){
															res.json(adverseEventSuspectEntity);	
															console.log("ok");
														}
													});
													
													
													/*
reaction|reaction
subjectMedicalHistory.Condition|subjectMedicalHistoryCondition
subjectMedicalHistory.Observation|subjectMedicalHistoryObservation
subjectMedicalHistory.AllergyIntolerance|subjectMedicalHistoryAllergyIntolerance
subjectMedicalHistory.FamilyMemberHistory|subjectMedicalHistoryFamilyMemberHistory
subjectMedicalHistory.Immunization|subjectMedicalHistoryImmunization
subjectMedicalHistory.Procedure|subjectMedicalHistoryProcedure
referenceDocument|referenceDocument
study|study													*/
													if(reaction !== ""){
														dataReaction = {
															"_id" : reaction,
															"adverse_event_reaction_id" : adverseEventId
														}
														ApiFHIR.put('condition', {"apikey": apikey, "_id": reaction}, {body: dataReaction, json: true}, function(error, response, body){
															returnReaction = body;
															if(returnReaction.err_code > 0){
																res.json(returnReaction);	
																console.log("add reference reaction : " + reaction);
															}
														});
													}
													
													if(subjectMedicalHistoryCondition !== ""){
														dataSubjectMedicalHistoryCondition = {
															"_id" : subjectMedicalHistoryCondition,
															"adverse_event_subject_medical_history_id" : adverseEventId
														}
														ApiFHIR.put('condition', {"apikey": apikey, "_id": subjectMedicalHistoryCondition}, {body: dataSubjectMedicalHistoryCondition, json: true}, function(error, response, body){
															returnSubjectMedicalHistoryCondition = body;
															if(returnSubjectMedicalHistoryCondition.err_code > 0){
																res.json(returnSubjectMedicalHistoryCondition);	
																console.log("add reference subject medical history condition : " + subjectMedicalHistoryCondition);
															}
														});
													}
													
													if(subjectMedicalHistoryObservation !== ""){
														dataSubjectMedicalHistoryObservation = {
															"_id" : subjectMedicalHistoryObservation,
															"adverse_event_id" : adverseEventId
														}
														ApiFHIR.put('observation', {"apikey": apikey, "_id": subjectMedicalHistoryObservation}, {body: dataSubjectMedicalHistoryObservation, json: true}, function(error, response, body){
															returnSubjectMedicalHistoryObservation = body;
															if(returnSubjectMedicalHistoryObservation.err_code > 0){
																res.json(returnSubjectMedicalHistoryObservation);	
																console.log("add reference subject medical history observation : " + subjectMedicalHistoryObservation);
															}
														});
													}
													
													if(subjectMedicalHistoryAllergyIntolerance !== ""){
														dataSubjectMedicalHistoryAllergyIntolerance = {
															"_id" : subjectMedicalHistoryAllergyIntolerance,
															"adverse_event_id" : adverseEventId
														}
														ApiFHIR.put('allergyIntolerance', {"apikey": apikey, "_id": subjectMedicalHistoryAllergyIntolerance}, {body: dataSubjectMedicalHistoryAllergyIntolerance, json: true}, function(error, response, body){
															returnSubjectMedicalHistoryAllergyIntolerance = body;
															if(returnSubjectMedicalHistoryAllergyIntolerance.err_code > 0){
																res.json(returnSubjectMedicalHistoryAllergyIntolerance);	
																console.log("add reference subject medical history allergy intolerance : " + subjectMedicalHistoryAllergyIntolerance);
															}
														});
													}
													
													if(subjectMedicalHistoryFamilyMemberHistory !== ""){
														dataSubjectMedicalHistoryFamilyMemberHistory = {
															"_id" : subjectMedicalHistoryFamilyMemberHistory,
															"adverse_event_id" : adverseEventId
														}
														ApiFHIR.put('familyMemberHistory', {"apikey": apikey, "_id": subjectMedicalHistoryFamilyMemberHistory}, {body: dataSubjectMedicalHistoryFamilyMemberHistory, json: true}, function(error, response, body){
															returnSubjectMedicalHistoryFamilyMemberHistory = body;
															if(returnSubjectMedicalHistoryFamilyMemberHistory.err_code > 0){
																res.json(returnSubjectMedicalHistoryFamilyMemberHistory);	
																console.log("add reference subject medical history family member history : " + subjectMedicalHistoryFamilyMemberHistory);
															}
														});
													}
													
													if(subjectMedicalHistoryImmunization !== ""){
														dataSubjectMedicalHistoryImmunization = {
															"_id" : subjectMedicalHistoryImmunization,
															"adverse_event_id" : adverseEventId
														}
														ApiFHIR.put('immunization', {"apikey": apikey, "_id": subjectMedicalHistoryImmunization}, {body: dataSubjectMedicalHistoryImmunization, json: true}, function(error, response, body){
															returnSubjectMedicalHistoryImmunization = body;
															if(returnSubjectMedicalHistoryImmunization.err_code > 0){
																res.json(returnSubjectMedicalHistoryImmunization);	
																console.log("add reference subject medical history immunization : " + subjectMedicalHistoryImmunization);
															}
														});
													}
													
													if(subjectMedicalHistoryProcedure !== ""){
														dataSubjectMedicalHistoryProcedure = {
															"_id" : subjectMedicalHistoryProcedure,
															"adverse_event_id" : adverseEventId
														}
														ApiFHIR.put('procedure', {"apikey": apikey, "_id": subjectMedicalHistoryProcedure}, {body: dataSubjectMedicalHistoryProcedure, json: true}, function(error, response, body){
															returnSubjectMedicalHistoryProcedure = body;
															if(returnSubjectMedicalHistoryProcedure.err_code > 0){
																res.json(returnSubjectMedicalHistoryProcedure);	
																console.log("add reference subject medical history procedure : " + subjectMedicalHistoryProcedure);
															}
														});
													}
													
													if(referenceDocument !== ""){
														dataReferenceDocument = {
															"_id" : referenceDocument,
															"adverse_event_id" : adverseEventId
														}
														ApiFHIR.put('documentReference', {"apikey": apikey, "_id": referenceDocument}, {body: dataReferenceDocument, json: true}, function(error, response, body){
															returnReferenceDocument = body;
															if(returnReferenceDocument.err_code > 0){
																res.json(returnReferenceDocument);	
																console.log("add reference document : " + referenceDocument);
															}
														});
													}
													
													if(study !== ""){
														dataStudy = {
															"_id" : study,
															"adverse_event_id" : adverseEventId
														}
														ApiFHIR.put('researchStudy', {"apikey": apikey, "_id": study}, {body: dataStudy, json: true}, function(error, response, body){
															returnStudy = body;
															if(returnStudy.err_code > 0){
																res.json(returnStudy);	
																console.log("add reference study : " + study);
															}
														});
													}

													res.json({"err_code": 0, "err_msg": "Adverse Event has been add.", "data": [{"_id": adverseEventId}]});
												}else{
													res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
												}
											})
									});
									
									myEmitter.prependOnceListener('checkSuspectEntityCausalityResult', function () {
										if (!validator.isEmpty(suspectEntityCausalityResult)) {
											checkCode(apikey, suspectEntityCausalityResult, 'adverse_event_causality_result', function (resSuspectEntityCausalityResultCode) {
												if (resSuspectEntityCausalityResultCode.err_code > 0) {
													myEmitter.emit('checkIdentifierValue');
												} else {
													res.json({
														"err_code": "527",
														"err_msg": "Suspect Entity Causality Result code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkIdentifierValue');
										}
									})
									
									myEmitter.prependOnceListener('checkSuspectEntityCausalityMethod', function () {
										if (!validator.isEmpty(suspectEntityCausalityMethod)) {
											checkCode(apikey, suspectEntityCausalityMethod, 'ADVERSE_EVENT_Causality_Method', function (resSuspectEntityCausalityMethodCode) {
												if (resSuspectEntityCausalityMethodCode.err_code > 0) {
													myEmitter.emit('checkSuspectEntityCausalityResult');
												} else {
													res.json({
														"err_code": "526",
														"err_msg": "Suspect Entity Causality Method code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkSuspectEntityCausalityResult');
										}
									})
									
									myEmitter.prependOnceListener('checkSuspectEntityCausalityAssessment', function () {
										if (!validator.isEmpty(suspectEntityCausalityAssessment)) {
											checkCode(apikey, suspectEntityCausalityAssessment, 'ADVERSE_EVENT_Causality_Assess', function (resSuspectEntityCausalityAssessmentCode) {
												if (resSuspectEntityCausalityAssessmentCode.err_code > 0) {
													myEmitter.emit('checkSuspectEntityCausalityMethod');
												} else {
													res.json({
														"err_code": "525",
														"err_msg": "Suspect Entity Causality Assessment code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkSuspectEntityCausalityMethod');
										}
									})
									
									myEmitter.prependOnceListener('checkSuspectEntityCausality', function () {
										if (!validator.isEmpty(suspectEntityCausality)) {
											checkCode(apikey, suspectEntityCausality, 'ADVERSE_EVENT_Causality', function (resSuspectEntityCausalityCode) {
												if (resSuspectEntityCausalityCode.err_code > 0) {
													myEmitter.emit('checkSuspectEntityCausalityAssessment');
												} else {
													res.json({
														"err_code": "524",
														"err_msg": "Suspect Entity Causality code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkSuspectEntityCausalityAssessment');
										}
									})
									
									myEmitter.prependOnceListener('checkSeriousness', function () {
										if (!validator.isEmpty(seriousness)) {
											checkCode(apikey, seriousness, 'ADVERSE_EVENT_SERIOUSNESS', function (resSeriousnessCode) {
												if (resSeriousnessCode.err_code > 0) {
													myEmitter.emit('checkSuspectEntityCausality');
												} else {
													res.json({
														"err_code": "523",
														"err_msg": "Seriousness code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkSuspectEntityCausality');
										}
									})
									
									myEmitter.prependOnceListener('checkType', function () {
										if (!validator.isEmpty(type)) {
											checkCode(apikey, type, 'ADVERSE_EVENT_TYPE', function (resTypeCode) {
												if (resTypeCode.err_code > 0) {
													myEmitter.emit('checkSeriousness');
												} else {
													res.json({
														"err_code": "522",
														"err_msg": "Type code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkSeriousness');
										}
									})
									
									myEmitter.prependOnceListener('checkCategory', function () {
										if (!validator.isEmpty(category)) {
											checkCode(apikey, category, 'ADVERSE_EVENT_CATEGORY', function (resCategoryCode) {
												if (resCategoryCode.err_code > 0) {
													myEmitter.emit('checkType');
												} else {
													res.json({
														"err_code": "521",
														"err_msg": "Category code not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkType');
										}
									})
									
									myEmitter.prependOnceListener('checkSubjectPatient', function () {
										if (!validator.isEmpty(subjectPatient)) {
											checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
												if (resSubjectPatient.err_code > 0) {
													myEmitter.emit('checkCategory');
												} else {
													res.json({
														"err_code": "520",
														"err_msg": "Subject patient id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkCategory');
										}
									})
									
									myEmitter.prependOnceListener('checkSubjectResearchSubject', function () {
										if (!validator.isEmpty(subjectResearchSubject)) {
											checkUniqeValue(apikey, "Research_Subject_ID|" + subjectResearchSubject	, 'Research_Subject', function (resSubjectResearchSubject) {
												if (resSubjectResearchSubject.err_code > 0) {
													myEmitter.emit('checkSubjectPatient');
												} else {
													res.json({
														"err_code": "519",
														"err_msg": "Subject research subject id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkSubjectPatient');
										}
									})
									
									myEmitter.prependOnceListener('checkSubjectMedication', function () {
										if (!validator.isEmpty(subjectMedication)) {
											checkUniqeValue(apikey, "MedicationT_ID|" + subjectMedication, 'Medication', function (resSubjectMedication) {
												if (resSubjectMedication.err_code > 0) {
													myEmitter.emit('checkSubjectResearchSubject');
												} else {
													res.json({
														"err_code": "518",
														"err_msg": "Subject medication id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkSubjectResearchSubject');
										}
									})
									
									myEmitter.prependOnceListener('checkSubjectDevice', function () {
										if (!validator.isEmpty(subjectDevice)) {
											checkUniqeValue(apikey, "Device_ID|" + subjectDevice, 'Device', function (resSubjectDevice) {
												if (resSubjectDevice.err_code > 0) {
													myEmitter.emit('checkSubjectMedication');
												} else {
													res.json({
														"err_code": "517",
														"err_msg": "Subject device id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkSubjectMedication');
										}
									})
									
									myEmitter.prependOnceListener('checkReaction', function () {
										if (!validator.isEmpty(reaction)) {
											checkUniqeValue(apikey, "Reaction_ID|" + reaction, 'Reaction', function (resReaction) {
												if (resReaction.err_code > 0) {
													myEmitter.emit('checkSubjectDevice');
												} else {
													res.json({
														"err_code": "516",
														"err_msg": "Reaction id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkSubjectDevice');
										}
									})
									
									myEmitter.prependOnceListener('checkLocation', function () {
										if (!validator.isEmpty(location)) {
											checkUniqeValue(apikey, "Location_ID|" + location, 'Location', function (resLocation) {
												if (resLocation.err_code > 0) {
													myEmitter.emit('checkReaction');
												} else {
													res.json({
														"err_code": "515",
														"err_msg": "Location id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkReaction');
										}
									})
									
									myEmitter.prependOnceListener('checkRecorderPatient', function () {
										if (!validator.isEmpty(recorderPatient)) {
											checkUniqeValue(apikey, "PATIENT_ID|" + recorderPatient, 'PATIENT', function (resRecorderPatient) {
												if (resRecorderPatient.err_code > 0) {
													myEmitter.emit('checkLocation');
												} else {
													res.json({
														"err_code": "514",
														"err_msg": "Recorder patient id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkLocation');
										}
									})
									
									myEmitter.prependOnceListener('checkRecorderPractitioner', function () {
										if (!validator.isEmpty(recorderPractitioner)) {
											checkUniqeValue(apikey, "Location_ID|" + recorderPractitioner, 'Location', function (resRecorderPractitioner) {
												if (resRecorderPractitioner.err_code > 0) {
													myEmitter.emit('checkRecorderPatient');
												} else {
													res.json({
														"err_code": "513",
														"err_msg": "Recorder practitioner id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkRecorderPatient');
										}
									})
									
									myEmitter.prependOnceListener('checkRecorderRelatedPerson', function () {
										if (!validator.isEmpty(recorderRelatedPerson)) {
											checkUniqeValue(apikey, "Location_ID|" + recorderRelatedPerson, 'Location', function (resRecorderRelatedPerson) {
												if (resRecorderRelatedPerson.err_code > 0) {
													myEmitter.emit('checkRecorderPractitioner');
												} else {
													res.json({
														"err_code": "512",
														"err_msg": "Recorder related person id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkRecorderPractitioner');
										}
									})
									
									myEmitter.prependOnceListener('checkEventParticipantPractitioner', function () {
										if (!validator.isEmpty(eventParticipantPractitioner)) {
											checkUniqeValue(apikey, "Practitioner_ID|" + eventParticipantPractitioner, 'Practitioner', function (resEventParticipantPractitioner) {
												if (resEventParticipantPractitioner.err_code > 0) {
													myEmitter.emit('checkRecorderRelatedPerson');
												} else {
													res.json({
														"err_code": "511",
														"err_msg": "Event participant practitioner id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkRecorderRelatedPerson');
										}
									})
									
									myEmitter.prependOnceListener('checkEventParticipantDevice', function () {
										if (!validator.isEmpty(eventParticipantDevice)) {
											checkUniqeValue(apikey, "Device_ID|" + eventParticipantDevice, 'Device', function (resEventParticipantDevice) {
												if (resEventParticipantDevice.err_code > 0) {
													myEmitter.emit('checkEventParticipantPractitioner');
												} else {
													res.json({
														"err_code": "510",
														"err_msg": "Event participant device id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkEventParticipantPractitioner');
										}
									})
									
									myEmitter.prependOnceListener('checkInstanceDevice', function () {
										if (!validator.isEmpty(suspectEntityInstanceDevice)) {
											checkUniqeValue(apikey, "Device_ID|" + suspectEntityInstanceDevice, 'Device', function (resInstanceDevice) {
												if (resInstanceDevice.err_code > 0) {
													myEmitter.emit('checkEventParticipantDevice');
												} else {
													res.json({
														"err_code": "509",
														"err_msg": "Instance device id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkEventParticipantDevice');
										}
									})
									
									myEmitter.prependOnceListener('checkInstanceMedication', function () {
										if (!validator.isEmpty(suspectEntityInstanceMedication)) {
											checkUniqeValue(apikey, "Medication_ID|" + suspectEntityInstanceMedication, 'Medication', function (resInstanceMedication) {
												if (resInstanceMedication.err_code > 0) {
													myEmitter.emit('checkInstanceDevice');
												} else {
													res.json({
														"err_code": "508",
														"err_msg": "Instance medication id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkInstanceDevice');
										}
									})
									
									myEmitter.prependOnceListener('checkInstanceSubstance', function () {
										if (!validator.isEmpty(suspectEntityInstanceSubstance)) {
											checkUniqeValue(apikey, "Substance_ID|" + suspectEntityInstanceSubstance, 'Substance', function (resInstanceSubstance) {
												if (resInstanceSubstance.err_code > 0) {
													myEmitter.emit('checkInstanceMedication');
												} else {
													res.json({
														"err_code": "507",
														"err_msg": "Instance substance id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkInstanceMedication');
										}
									})
									
									myEmitter.prependOnceListener('checkInstanceMedicationAdministration', function () {
										if (!validator.isEmpty(suspectEntityInstanceMedicationAdministration)) {
											checkUniqeValue(apikey, "Medication_Administration_ID|" + suspectEntityInstanceMedicationAdministration, 'Medication_Administration', function (resInstanceMedicationAdministration) {
												if (resInstanceMedicationAdministration.err_code > 0) {
													myEmitter.emit('checkInstanceSubstance');
												} else {
													res.json({
														"err_code": "506",
														"err_msg": "Instance medication administration id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkInstanceSubstance');
										}
									})
									
									myEmitter.prependOnceListener('checkInstanceMedicationStatement', function () {
										if (!validator.isEmpty(suspectEntityInstanceMedicationStatement)) {
											checkUniqeValue(apikey, "Medication_Statement_ID|" + suspectEntityInstanceMedicationStatement, 'Medication_Statement', function (resInstanceMedicationStatement) {
												if (resInstanceMedicationStatement.err_code > 0) {
													myEmitter.emit('checkInstanceMedicationAdministration');
												} else {
													res.json({
														"err_code": "505",
														"err_msg": "Instance medication statement id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkInstanceMedicationAdministration');
										}
									})
									
									myEmitter.prependOnceListener('checkCausalityAuthorPractitioner', function () {
										if (!validator.isEmpty(suspectEntityCausalityAuthorPractitioner)) {
											checkUniqeValue(apikey, "Practitioner_ID|" + suspectEntityCausalityAuthorPractitioner, 'Practitioner', function (resCausalityAuthorPractitioner) {
												if (resCausalityAuthorPractitioner.err_code > 0) {
													myEmitter.emit('checkInstanceMedicationStatement');
												} else {
													res.json({
														"err_code": "504",
														"err_msg": "Causality author practitioner id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkInstanceMedicationStatement');
										}
									})
									
									if (!validator.isEmpty(suspectEntityCausalityAuthorPractitionerRole)) {
										checkUniqeValue(apikey, "Practitioner_ROLE_ID|" + suspectEntityCausalityAuthorPractitionerRole, 'Practitioner_ROLE', function (resCausalityAuthorPractitionerRole) {
											if (resCausalityAuthorPractitionerRole.err_code > 0) {
												myEmitter.emit('checkCausalityAuthorPractitioner');
											} else {
												res.json({
													"err_code": "503",
													"err_msg": "Causality author practitioner role id not found"
												});
											}
										})
									} else {
										myEmitter.emit('checkCausalityAuthorPractitioner');
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
		adverseEventSuspectEntity: function addAdverseEventSuspectEntity(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var adverseEventId = req.params.adverse_event_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof adverseEventId !== 'undefined'){
				if(validator.isEmpty(adverseEventId)){
					err_code = 2;
					err_msg = "Adverse Event id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Adverse Event id is required";
			}

			if(typeof req.body.instance.substance !== 'undefined'){
				var suspectEntityInstanceSubstance =  req.body.instance.substance.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceSubstance)){
					suspectEntityInstanceSubstance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity instance substance' in json Adverse Event request.";
			}

			if(typeof req.body.instance.medication !== 'undefined'){
				var suspectEntityInstanceMedication =  req.body.instance.medication.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceMedication)){
					suspectEntityInstanceMedication = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity instance medication' in json Adverse Event request.";
			}

			if(typeof req.body.instance.medicationAdministration !== 'undefined'){
				var suspectEntityInstanceMedicationAdministration =  req.body.instance.medicationAdministration.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceMedicationAdministration)){
					suspectEntityInstanceMedicationAdministration = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity instance medication administration' in json Adverse Event request.";
			}

			if(typeof req.body.instance.medicationStatement !== 'undefined'){
				var suspectEntityInstanceMedicationStatement =  req.body.instance.medicationStatement.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceMedicationStatement)){
					suspectEntityInstanceMedicationStatement = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity instance medication statement' in json Adverse Event request.";
			}

			if(typeof req.body.instance.device !== 'undefined'){
				var suspectEntityInstanceDevice =  req.body.instance.device.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceDevice)){
					suspectEntityInstanceDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity instance device' in json Adverse Event request.";
			}

			if(typeof req.body.causality !== 'undefined'){
				var suspectEntityCausality =  req.body.causality.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausality)){
					suspectEntityCausality = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality' in json Adverse Event request.";
			}

			if(typeof req.body.causalityAssessment !== 'undefined'){
				var suspectEntityCausalityAssessment =  req.body.causalityAssessment.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityAssessment)){
					suspectEntityCausalityAssessment = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality assessment' in json Adverse Event request.";
			}

			if(typeof req.body.causalityProductRelatedness !== 'undefined'){
				var suspectEntityCausalityProductRelatedness =  req.body.causalityProductRelatedness.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityProductRelatedness)){
					suspectEntityCausalityProductRelatedness = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality product relatedness' in json Adverse Event request.";
			}

			if(typeof req.body.causalityMethod !== 'undefined'){
				var suspectEntityCausalityMethod =  req.body.causalityMethod.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityMethod)){
					suspectEntityCausalityMethod = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality method' in json Adverse Event request.";
			}

			if(typeof req.body.causalityAuthor.practitioner !== 'undefined'){
				var suspectEntityCausalityAuthorPractitioner =  req.body.causalityAuthor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityAuthorPractitioner)){
					suspectEntityCausalityAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality author practitioner' in json Adverse Event request.";
			}

			if(typeof req.body.causalityAuthor.practitionerRole !== 'undefined'){
				var suspectEntityCausalityAuthorPractitionerRole =  req.body.causalityAuthor.practitionerRole.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityAuthorPractitionerRole)){
					suspectEntityCausalityAuthorPractitionerRole = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality author practitioner role' in json Adverse Event request.";
			}

			if(typeof req.body.causalityResult !== 'undefined'){
				var suspectEntityCausalityResult =  req.body.causalityResult.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityResult)){
					suspectEntityCausalityResult = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality result' in json Adverse Event request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkAdverseEventID', function(){
							checkUniqeValue(apikey, "ADVERSE_EVENT_ID|" + adverseEventId, 'ADVERSE_EVENT', function(resAdverseEventID){
								if(resAdverseEventID.err_code > 0){
									var unicId = uniqid.time();
									var suspectEntityId = 'sue' + unicId;
									//AdverseEventSuspectEntity
									dataSuspectEntity = {
														"suspect_entity_id" : suspectEntityId, 
														"instance_substance" : suspectEntityInstanceSubstance, 
														"instance_medication" : suspectEntityInstanceMedication, 
														"instance_medication_administration" : suspectEntityInstanceMedicationAdministration,  
														"instance_medication_statement" : suspectEntityInstanceMedicationStatement, 
														"instance_device" : suspectEntityInstanceDevice, 
														"causality" : suspectEntityCausality, 
														"causality_assessment" : suspectEntityCausalityAssessment, 
														"causality_product_relatedness" : suspectEntityCausalityProductRelatedness, 
														"causality_method" : suspectEntityCausalityMethod, 
														"causality_author_practitioner" : suspectEntityCausalityAuthorPractitioner, 
														"causality_author_practitioner_role" : suspectEntityCausalityAuthorPractitionerRole, 
														"causality_result" : suspectEntityCausalityResult, 
														"adverse_event_id" : adverseEventId
													}
									ApiFHIR.post('adverseEventSuspectEntity', {"apikey": apikey}, {body: dataSuspectEntity, json: true}, function(error, response, body){
										adverseEventSuspectEntity = body;
										if(adverseEventSuspectEntity.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Adverse Event Suspect Entity has been add in this Adverse Event.", "data": adverseEventSuspectEntity.data});
										}else{
											res.json(adverseEventSuspectEntity);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Adverse Event Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkSuspectEntityCausalityResult', function () {
							if (!validator.isEmpty(suspectEntityCausalityResult)) {
								checkCode(apikey, suspectEntityCausalityResult, 'adverse_event_causality_result', function (resSuspectEntityCausalityResultCode) {
									if (resSuspectEntityCausalityResultCode.err_code > 0) {
										myEmitter.emit('checkAdverseEventID');
									} else {
										res.json({
											"err_code": "527",
											"err_msg": "Suspect Entity Causality Result code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAdverseEventID');
							}
						})

						myEmitter.prependOnceListener('checkSuspectEntityCausalityMethod', function () {
							if (!validator.isEmpty(suspectEntityCausalityMethod)) {
								checkCode(apikey, suspectEntityCausalityMethod, 'ADVERSE_EVENT_Causality_Method', function (resSuspectEntityCausalityMethodCode) {
									if (resSuspectEntityCausalityMethodCode.err_code > 0) {
										myEmitter.emit('checkSuspectEntityCausalityResult');
									} else {
										res.json({
											"err_code": "526",
											"err_msg": "Suspect Entity Causality Method code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSuspectEntityCausalityResult');
							}
						})

						myEmitter.prependOnceListener('checkSuspectEntityCausalityAssessment', function () {
							if (!validator.isEmpty(suspectEntityCausalityAssessment)) {
								checkCode(apikey, suspectEntityCausalityAssessment, 'ADVERSE_EVENT_Causality_Assess', function (resSuspectEntityCausalityAssessmentCode) {
									if (resSuspectEntityCausalityAssessmentCode.err_code > 0) {
										myEmitter.emit('checkSuspectEntityCausalityMethod');
									} else {
										res.json({
											"err_code": "525",
											"err_msg": "Suspect Entity Causality Assessment code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSuspectEntityCausalityMethod');
							}
						})

						myEmitter.prependOnceListener('checkSuspectEntityCausality', function () {
							if (!validator.isEmpty(suspectEntityCausality)) {
								checkCode(apikey, suspectEntityCausality, 'ADVERSE_EVENT_Causality', function (resSuspectEntityCausalityCode) {
									if (resSuspectEntityCausalityCode.err_code > 0) {
										myEmitter.emit('checkSuspectEntityCausalityAssessment');
									} else {
										res.json({
											"err_code": "524",
											"err_msg": "Suspect Entity Causality code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSuspectEntityCausalityAssessment');
							}
						})
						
						myEmitter.prependOnceListener('checkInstanceDevice', function () {
							if (!validator.isEmpty(suspectEntityInstanceDevice)) {
								checkUniqeValue(apikey, "Device_ID|" + suspectEntityInstanceDevice, 'Device', function (resInstanceDevice) {
									if (resInstanceDevice.err_code > 0) {
										myEmitter.emit('checkSuspectEntityCausality');
									} else {
										res.json({
											"err_code": "509",
											"err_msg": "Instance device id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSuspectEntityCausality');
							}
						})

						myEmitter.prependOnceListener('checkInstanceMedication', function () {
							if (!validator.isEmpty(suspectEntityInstanceMedication)) {
								checkUniqeValue(apikey, "Medication_ID|" + suspectEntityInstanceMedication, 'Medication', function (resInstanceMedication) {
									if (resInstanceMedication.err_code > 0) {
										myEmitter.emit('checkInstanceDevice');
									} else {
										res.json({
											"err_code": "508",
											"err_msg": "Instance medication id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInstanceDevice');
							}
						})

						myEmitter.prependOnceListener('checkInstanceSubstance', function () {
							if (!validator.isEmpty(suspectEntityInstanceSubstance)) {
								checkUniqeValue(apikey, "Substance_ID|" + suspectEntityInstanceSubstance, 'Substance', function (resInstanceSubstance) {
									if (resInstanceSubstance.err_code > 0) {
										myEmitter.emit('checkInstanceMedication');
									} else {
										res.json({
											"err_code": "507",
											"err_msg": "Instance substance id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInstanceMedication');
							}
						})

						myEmitter.prependOnceListener('checkInstanceMedicationAdministration', function () {
							if (!validator.isEmpty(suspectEntityInstanceMedicationAdministration)) {
								checkUniqeValue(apikey, "Medication_Administration_ID|" + suspectEntityInstanceMedicationAdministration, 'Medication_Administration', function (resInstanceMedicationAdministration) {
									if (resInstanceMedicationAdministration.err_code > 0) {
										myEmitter.emit('checkInstanceSubstance');
									} else {
										res.json({
											"err_code": "506",
											"err_msg": "Instance medication administration id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInstanceSubstance');
							}
						})

						myEmitter.prependOnceListener('checkInstanceMedicationStatement', function () {
							if (!validator.isEmpty(suspectEntityInstanceMedicationStatement)) {
								checkUniqeValue(apikey, "Medication_Statement_ID|" + suspectEntityInstanceMedicationStatement, 'Medication_Statement', function (resInstanceMedicationStatement) {
									if (resInstanceMedicationStatement.err_code > 0) {
										myEmitter.emit('checkInstanceMedicationAdministration');
									} else {
										res.json({
											"err_code": "505",
											"err_msg": "Instance medication statement id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInstanceMedicationAdministration');
							}
						})

						myEmitter.prependOnceListener('checkCausalityAuthorPractitioner', function () {
							if (!validator.isEmpty(suspectEntityCausalityAuthorPractitioner)) {
								checkUniqeValue(apikey, "Practitioner_ID|" + suspectEntityCausalityAuthorPractitioner, 'Practitioner', function (resCausalityAuthorPractitioner) {
									if (resCausalityAuthorPractitioner.err_code > 0) {
										myEmitter.emit('checkInstanceMedicationStatement');
									} else {
										res.json({
											"err_code": "504",
											"err_msg": "Causality author practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInstanceMedicationStatement');
							}
						})

						if (!validator.isEmpty(suspectEntityCausalityAuthorPractitionerRole)) {
							checkUniqeValue(apikey, "Practitioner_ROLE_ID|" + suspectEntityCausalityAuthorPractitionerRole, 'Practitioner_ROLE', function (resCausalityAuthorPractitionerRole) {
								if (resCausalityAuthorPractitionerRole.err_code > 0) {
									myEmitter.emit('checkCausalityAuthorPractitioner');
								} else {
									res.json({
										"err_code": "503",
										"err_msg": "Causality author practitioner role id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCausalityAuthorPractitioner');
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
		adverseEvent : function putAdverseEvent(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var adverseEventId = req.params.adverse_event_id;

      var err_code = 0;
      var err_msg = "";
      var dataAdverseEvent = {};

			if(typeof adverseEventId !== 'undefined'){
				if(validator.isEmpty(adverseEventId)){
					err_code = 2;
					err_msg = "Adverse Event id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Adverse Event id is required";
			}
			
			/*var identifier_id = req.body.identifier_id;
			var category = req.body.category;
			var type = req.body.type;
			var subject_patient = req.body.subject_patient;
			var subject_research_subject = req.body.subject_research_subject;
			var subject_medication = req.body.subject_medication;
			var subject_device = req.body.subject_device;
			var date = req.body.date;
			var location = req.body.location;
			var seriousness = req.body.seriousness;
			var outcome = req.body.outcome;
			var recorder_patient = req.body.recorder_patient;
			var recorder_practitioner = req.body.recorder_practitioner;
			var recorder_related_person = req.body.recorder_related_person;
			var event_participant_practitioner = req.body.event_participant_practitioner;
			var event_participant_device = req.body.event_participant_device;
			var description = req.body.description;*/

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toUpperCase();
				if(validator.isEmpty(category)){
					dataAdverseEvent.category = "";
				}else{
					dataAdverseEvent.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					dataAdverseEvent.type = "";
				}else{
					dataAdverseEvent.type = type;
				}
			}else{
			  type = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataAdverseEvent.subject_patient = "";
				}else{
					dataAdverseEvent.subject_patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.researchSubject !== 'undefined' && req.body.subject.researchSubject !== ""){
				var subjectResearchSubject =  req.body.subject.researchSubject.trim().toLowerCase();
				if(validator.isEmpty(subjectResearchSubject)){
					dataAdverseEvent.subject_research_subject = "";
				}else{
					dataAdverseEvent.subject_research_subject = subjectResearchSubject;
				}
			}else{
			  subjectResearchSubject = "";
			}

			if(typeof req.body.subject.medication !== 'undefined' && req.body.subject.medication !== ""){
				var subjectMedication =  req.body.subject.medication.trim().toLowerCase();
				if(validator.isEmpty(subjectMedication)){
					dataAdverseEvent.subject_medication = "";
				}else{
					dataAdverseEvent.subject_medication = subjectMedication;
				}
			}else{
			  subjectMedication = "";
			}

			if(typeof req.body.subject.device !== 'undefined' && req.body.subject.device !== ""){
				var subjectDevice =  req.body.subject.device.trim().toLowerCase();
				if(validator.isEmpty(subjectDevice)){
					dataAdverseEvent.subject_device = "";
				}else{
					dataAdverseEvent.subject_device = subjectDevice;
				}
			}else{
			  subjectDevice = "";
			}

			if(typeof req.body.date !== 'undefined' && req.body.date !== ""){
				var date =  req.body.date;
				if(validator.isEmpty(date)){
					err_code = 2;
					err_msg = "adverse event date is required.";
				}else{
					if(!regex.test(date)){
						err_code = 2;
						err_msg = "adverse event date invalid date format.";	
					}else{
						dataAdverseEvent.date = date;
					}
				}
			}else{
			  date = "";
			}

			if(typeof req.body.reaction !== 'undefined' && req.body.reaction !== ""){
				var reaction =  req.body.reaction.trim().toLowerCase();
				if(validator.isEmpty(reaction)){
					dataAdverseEvent.reaction = "";
				}else{
					dataAdverseEvent.reaction = reaction;
				}
			}else{
			  reaction = "";
			}

			if(typeof req.body.location !== 'undefined' && req.body.location !== ""){
				var location =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(location)){
					dataAdverseEvent.location = "";
				}else{
					dataAdverseEvent.location = location;
				}
			}else{
			  location = "";
			}

			if(typeof req.body.seriousness !== 'undefined' && req.body.seriousness !== ""){
				var seriousness =  req.body.seriousness.trim();
				if(validator.isEmpty(seriousness)){
					dataAdverseEvent.seriousness = "";
				}else{
					dataAdverseEvent.seriousness = seriousness;
				}
			}else{
			  seriousness = "";
			}

			if(typeof req.body.outcome !== 'undefined' && req.body.outcome !== ""){
				var outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					dataAdverseEvent.outcome = "";
				}else{
					dataAdverseEvent.outcome = outcome;
				}
			}else{
			  outcome = "";
			}

			if(typeof req.body.recorder.patient !== 'undefined' && req.body.recorder.patient !== ""){
				var recorderPatient =  req.body.recorder.patient.trim().toLowerCase();
				if(validator.isEmpty(recorderPatient)){
					dataAdverseEvent.recorder_patient = "";
				}else{
					dataAdverseEvent.recorder_patient = recorderPatient;
				}
			}else{
			  recorderPatient = "";
			}

			if(typeof req.body.recorder.practitioner !== 'undefined' && req.body.recorder.practitioner !== ""){
				var recorderPractitioner =  req.body.recorder.practitioner.trim().toLowerCase();
				if(validator.isEmpty(recorderPractitioner)){
					dataAdverseEvent.recorder_practitioner = "";
				}else{
					dataAdverseEvent.recorder_practitioner = recorderPractitioner;
				}
			}else{
			  recorderPractitioner = "";
			}

			if(typeof req.body.recorder.relatedPerson !== 'undefined' && req.body.recorder.relatedPerson !== ""){
				var recorderRelatedPerson =  req.body.recorder.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(recorderRelatedPerson)){
					dataAdverseEvent.recorder_related_person = "";
				}else{
					dataAdverseEvent.recorder_related_person = recorderRelatedPerson;
				}
			}else{
			  recorderRelatedPerson = "";
			}

			if(typeof req.body.eventParticipant.practitioner !== 'undefined' && req.body.eventParticipant.practitioner !== ""){
				var eventParticipantPractitioner =  req.body.eventParticipant.practitioner.trim().toLowerCase();
				if(validator.isEmpty(eventParticipantPractitioner)){
					dataAdverseEvent.event_participant_practitioner = "";
				}else{
					dataAdverseEvent.event_participant_practitioner = eventParticipantPractitioner;
				}
			}else{
			  eventParticipantPractitioner = "";
			}

			if(typeof req.body.eventParticipant.device !== 'undefined' && req.body.eventParticipant.device !== ""){
				var eventParticipantDevice =  req.body.eventParticipant.device.trim().toLowerCase();
				if(validator.isEmpty(eventParticipantDevice)){
					dataAdverseEvent.event_participant_device = "";
				}else{
					dataAdverseEvent.event_participant_device = eventParticipantDevice;
				}
			}else{
			  eventParticipantDevice = "";
			}

			if(typeof req.body.description !== 'undefined' && req.body.description !== ""){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					dataAdverseEvent.description = "";
				}else{
					dataAdverseEvent.description = description;
				}
			}else{
			  description = "";
			}

			/*if(typeof req.body.subjectMedicalHistory.condition !== 'undefined' && req.body.subjectMedicalHistory.condition !== ""){
				var subjectMedicalHistoryCondition =  req.body.subjectMedicalHistory.condition.trim().toLowerCase();
				if(validator.isEmpty(subjectMedicalHistoryCondition)){
					dataAdverseEvent.condition = "";
				}else{
					dataAdverseEvent.condition = subjectMedicalHistoryCondition;
				}
			}else{
			  subjectMedicalHistoryCondition = "";
			}

			if(typeof req.body.subjectMedicalHistory.observation !== 'undefined' && req.body.subjectMedicalHistory.observation !== ""){
				var subjectMedicalHistoryObservation =  req.body.subjectMedicalHistory.observation.trim().toLowerCase();
				if(validator.isEmpty(subjectMedicalHistoryObservation)){
					dataAdverseEvent.observation = "";
				}else{
					dataAdverseEvent.observation = subjectMedicalHistoryObservation;
				}
			}else{
			  subjectMedicalHistoryObservation = "";
			}

			if(typeof req.body.subjectMedicalHistory.allergyIntolerance !== 'undefined' && req.body.subjectMedicalHistory.allergyIntolerance !== ""){
				var subjectMedicalHistoryAllergyIntolerance =  req.body.subjectMedicalHistory.allergyIntolerance.trim().toLowerCase();
				if(validator.isEmpty(subjectMedicalHistoryAllergyIntolerance)){
					dataAdverseEvent.allergy_intolerance = "";
				}else{
					dataAdverseEvent.allergy_intolerance = subjectMedicalHistoryAllergyIntolerance;
				}
			}else{
			  subjectMedicalHistoryAllergyIntolerance = "";
			}

			if(typeof req.body.subjectMedicalHistory.familyMemberHistory !== 'undefined' && req.body.subjectMedicalHistory.familyMemberHistory !== ""){
				var subjectMedicalHistoryFamilyMemberHistory =  req.body.subjectMedicalHistory.familyMemberHistory.trim().toLowerCase();
				if(validator.isEmpty(subjectMedicalHistoryFamilyMemberHistory)){
					dataAdverseEvent.family_member_history = "";
				}else{
					dataAdverseEvent.family_member_history = subjectMedicalHistoryFamilyMemberHistory;
				}
			}else{
			  subjectMedicalHistoryFamilyMemberHistory = "";
			}

			if(typeof req.body.subjectMedicalHistory.immunization !== 'undefined' && req.body.subjectMedicalHistory.immunization !== ""){
				var subjectMedicalHistoryImmunization =  req.body.subjectMedicalHistory.immunization.trim().toLowerCase();
				if(validator.isEmpty(subjectMedicalHistoryImmunization)){
					dataAdverseEvent.immunization = "";
				}else{
					dataAdverseEvent.immunization = subjectMedicalHistoryImmunization;
				}
			}else{
			  subjectMedicalHistoryImmunization = "";
			}

			if(typeof req.body.subjectMedicalHistory.procedure !== 'undefined' && req.body.subjectMedicalHistory.procedure !== ""){
				var subjectMedicalHistoryProcedure =  req.body.subjectMedicalHistory.procedure.trim().toLowerCase();
				if(validator.isEmpty(subjectMedicalHistoryProcedure)){
					dataAdverseEvent.procedure = "";
				}else{
					dataAdverseEvent.procedure = subjectMedicalHistoryProcedure;
				}
			}else{
			  subjectMedicalHistoryProcedure = "";
			}

			if(typeof req.body.referenceDocument !== 'undefined' && req.body.referenceDocument !== ""){
				var referenceDocument =  req.body.referenceDocument.trim().toLowerCase();
				if(validator.isEmpty(referenceDocument)){
					dataAdverseEvent.reference_document = "";
				}else{
					dataAdverseEvent.reference_document = referenceDocument;
				}
			}else{
			  referenceDocument = "";
			}

			if(typeof req.body.study !== 'undefined' && req.body.study !== ""){
				var study =  req.body.study.trim().toLowerCase();
				if(validator.isEmpty(study)){
					dataAdverseEvent.study = "";
				}else{
					dataAdverseEvent.study = study;
				}
			}else{
			  study = "";
			}*/

			
			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					
						//event emiter
						myEmitter.prependOnceListener('checkAdverseEventId', function(){
							checkUniqeValue(apikey, "ADVERSE_EVENT_ID|" + adverseEventId, 'ADVERSE_EVENT', function(resAdverseEventId){
								if(resAdverseEventId.err_code > 0){
									//console.log(dataImmunization);
									ApiFHIR.put('adverseEvent', {"apikey": apikey, "_id": adverseEventId}, {body: dataAdverseEvent, json: true}, function(error, response, body){
										adverseEvent = body;
										if(adverseEvent.err_code > 0){
											res.json(adverseEvent);	
										}else{
											res.json({"err_code": 0, "err_msg": "Adverse Event has been update.", "data": [{"_id": adverseEventId}]});
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Adverse Event Id not found"});		
								}
							})
						})
					
						myEmitter.prependOnceListener('checkSeriousness', function () {
							if (!validator.isEmpty(seriousness)) {
								checkCode(apikey, seriousness, 'ADVERSE_EVENT_SERIOUSNESS', function (resSeriousnessCode) {
									if (resSeriousnessCode.err_code > 0) {
										myEmitter.emit('checkAdverseEventId');
									} else {
										res.json({
											"err_code": "523",
											"err_msg": "Seriousness code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAdverseEventId');
							}
						})

						myEmitter.prependOnceListener('checkType', function () {
							if (!validator.isEmpty(type)) {
								checkCode(apikey, type, 'ADVERSE_EVENT_TYPE', function (resTypeCode) {
									if (resTypeCode.err_code > 0) {
										myEmitter.emit('checkSeriousness');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "Type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSeriousness');
							}
						})

						myEmitter.prependOnceListener('checkCategory', function () {
							if (!validator.isEmpty(category)) {
								checkCode(apikey, category, 'ADVERSE_EVENT_CATEGORY', function (resCategoryCode) {
									if (resCategoryCode.err_code > 0) {
										myEmitter.emit('checkType');
									} else {
										res.json({
											"err_code": "521",
											"err_msg": "Category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkType');
							}
						})

						myEmitter.prependOnceListener('checkSubjectPatient', function () {
							if (!validator.isEmpty(subjectPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
									if (resSubjectPatient.err_code > 0) {
										myEmitter.emit('checkCategory');
									} else {
										res.json({
											"err_code": "520",
											"err_msg": "Subject patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCategory');
							}
						})

						myEmitter.prependOnceListener('checkSubjectResearchSubject', function () {
							if (!validator.isEmpty(subjectResearchSubject)) {
								checkUniqeValue(apikey, "Research_Subject_ID|" + subjectResearchSubject	, 'Research_Subject', function (resSubjectResearchSubject) {
									if (resSubjectResearchSubject.err_code > 0) {
										myEmitter.emit('checkSubjectPatient');
									} else {
										res.json({
											"err_code": "519",
											"err_msg": "Subject research subject id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjectPatient');
							}
						})

						myEmitter.prependOnceListener('checkSubjectMedication', function () {
							if (!validator.isEmpty(subjectMedication)) {
								checkUniqeValue(apikey, "MedicationT_ID|" + subjectMedication, 'Medication', function (resSubjectMedication) {
									if (resSubjectMedication.err_code > 0) {
										myEmitter.emit('checkSubjectResearchSubject');
									} else {
										res.json({
											"err_code": "518",
											"err_msg": "Subject medication id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjectResearchSubject');
							}
						})

						myEmitter.prependOnceListener('checkSubjectDevice', function () {
							if (!validator.isEmpty(subjectDevice)) {
								checkUniqeValue(apikey, "Device_ID|" + subjectDevice, 'Device', function (resSubjectDevice) {
									if (resSubjectDevice.err_code > 0) {
										myEmitter.emit('checkSubjectMedication');
									} else {
										res.json({
											"err_code": "517",
											"err_msg": "Subject device id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjectMedication');
							}
						})

						myEmitter.prependOnceListener('checkReaction', function () {
							if (!validator.isEmpty(reaction)) {
								checkUniqeValue(apikey, "Reaction_ID|" + reaction, 'Reaction', function (resReaction) {
									if (resReaction.err_code > 0) {
										myEmitter.emit('checkSubjectDevice');
									} else {
										res.json({
											"err_code": "516",
											"err_msg": "Reaction id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjectDevice');
							}
						})

						myEmitter.prependOnceListener('checkLocation', function () {
							if (!validator.isEmpty(location)) {
								checkUniqeValue(apikey, "Location_ID|" + location, 'Location', function (resLocation) {
									if (resLocation.err_code > 0) {
										myEmitter.emit('checkReaction');
									} else {
										res.json({
											"err_code": "515",
											"err_msg": "Location id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReaction');
							}
						})

						myEmitter.prependOnceListener('checkRecorderPatient', function () {
							if (!validator.isEmpty(recorderPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + recorderPatient, 'PATIENT', function (resRecorderPatient) {
									if (resRecorderPatient.err_code > 0) {
										myEmitter.emit('checkLocation');
									} else {
										res.json({
											"err_code": "514",
											"err_msg": "Recorder patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkLocation');
							}
						})

						myEmitter.prependOnceListener('checkRecorderPractitioner', function () {
							if (!validator.isEmpty(recorderPractitioner)) {
								checkUniqeValue(apikey, "Location_ID|" + recorderPractitioner, 'Location', function (resRecorderPractitioner) {
									if (resRecorderPractitioner.err_code > 0) {
										myEmitter.emit('checkRecorderPatient');
									} else {
										res.json({
											"err_code": "513",
											"err_msg": "Recorder practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRecorderPatient');
							}
						})

						myEmitter.prependOnceListener('checkRecorderRelatedPerson', function () {
							if (!validator.isEmpty(recorderRelatedPerson)) {
								checkUniqeValue(apikey, "Location_ID|" + recorderRelatedPerson, 'Location', function (resRecorderRelatedPerson) {
									if (resRecorderRelatedPerson.err_code > 0) {
										myEmitter.emit('checkRecorderPractitioner');
									} else {
										res.json({
											"err_code": "512",
											"err_msg": "Recorder related person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRecorderPractitioner');
							}
						})

						myEmitter.prependOnceListener('checkEventParticipantPractitioner', function () {
							if (!validator.isEmpty(eventParticipantPractitioner)) {
								checkUniqeValue(apikey, "Practitioner_ID|" + eventParticipantPractitioner, 'Practitioner', function (resEventParticipantPractitioner) {
									if (resEventParticipantPractitioner.err_code > 0) {
										myEmitter.emit('checkRecorderRelatedPerson');
									} else {
										res.json({
											"err_code": "511",
											"err_msg": "Event participant practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRecorderRelatedPerson');
							}
						})

						if (!validator.isEmpty(eventParticipantDevice)) {
							checkUniqeValue(apikey, "Device_ID|" + eventParticipantDevice, 'Device', function (resEventParticipantDevice) {
								if (resEventParticipantDevice.err_code > 0) {
									myEmitter.emit('checkEventParticipantPractitioner');
								} else {
									res.json({
										"err_code": "510",
										"err_msg": "Event participant device id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkEventParticipantPractitioner');
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
			var adverseEventId = req.params.adverse_event_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof adverseEventId !== 'undefined'){
				if(validator.isEmpty(adverseEventId)){
					err_code = 2;
					err_msg = "Adverse Event id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Adverse Event id is required";
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
						myEmitter.prependOnceListener('checkAdverseEventID', function(){
							checkUniqeValue(apikey, "ADVERSE_EVENT_ID|" + adverseEventId, 'ADVERSE_EVENT', function(resSpecimenID){
								if(resSpecimenID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "ADVERSE_EVENT_ID|"+adverseEventId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Adverse Event.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Specimen Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkAdverseEventID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkAdverseEventID');				
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
		adverseEventSuspectEntity: function updateAdverseEventSuspectEntity(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var adverseEventId = req.params.adverse_event_id;
			var adverseEventSuspectEntityId = req.params.adverse_event_suspect_entity_id;

			var err_code = 0;
			var err_msg = "";
			var dataAdverseEvent = {};
			//input check 
			if(typeof adverseEventId !== 'undefined'){
				if(validator.isEmpty(adverseEventId)){
					err_code = 2;
					err_msg = "Adverse Event id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Adverse Event id is required";
			}

			if(typeof adverseEventSuspectEntityId !== 'undefined'){
				if(validator.isEmpty(adverseEventSuspectEntityId)){
					err_code = 2;
					err_msg = "Adverse Event Suspect Entity id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Adverse Event Suspect Entity id is required";
			}
			
			/*var instance_substance = req.body.instance_substance; 
			var instance_medication = req.body.instance_medication; 
			var instance_medication_administration = req.body.instance_medication_administration;  
			var instance_medication_statement = req.body.instance_medication_statement; 
			var instance_device = req.body.instance_device; 
			var causality = req.body.causality; 
			var causality_assessment = req.body.causality_assessment; 
			var causality_product_relatedness = req.body.causality_product_relatedness; 
			var causality_method = req.body.causality_method; 
			var causality_author_practitioner = req.body.causality_author_practitioner; 
			var causality_author_practitioner_role = req.body.causality_author_practitioner_role; 
			var causality_result = req.body.causality_result;*/
			if(typeof req.body.instance.substance !== 'undefined' && req.body.instance.substance !== ""){
				var suspectEntityInstanceSubstance =  req.body.instance.substance.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceSubstance)){
					dataAdverseEvent.instance_substance = "";
				}else{
					dataAdverseEvent.instance_substance = suspectEntityInstanceSubstance;
				}
			}else{
			  suspectEntityInstanceSubstance = "";
			}

			if(typeof req.body.instance.medication !== 'undefined' && req.body.instance.medication !== ""){
				var suspectEntityInstanceMedication =  req.body.instance.medication.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceMedication)){
					dataAdverseEvent.instance_medication = "";
				}else{
					dataAdverseEvent.instance_medication = suspectEntityInstanceMedication;
				}
			}else{
			  suspectEntityInstanceMedication = "";
			}

			if(typeof req.body.instance.medicationAdministration !== 'undefined' && req.body.instance.medicationAdministration !== ""){
				var suspectEntityInstanceMedicationAdministration =  req.body.instance.medicationAdministration.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceMedicationAdministration)){
					dataAdverseEvent.instance_medication_administration = "";
				}else{
					dataAdverseEvent.instance_medication_administration = suspectEntityInstanceMedicationAdministration;
				}
			}else{
			  suspectEntityInstanceMedicationAdministration = "";
			}

			if(typeof req.body.instance.medicationStatement !== 'undefined' && req.body.instance.medicationStatement !== ""){
				var suspectEntityInstanceMedicationStatement =  req.body.instance.medicationStatement.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceMedicationStatement)){
					dataAdverseEvent.instance_medication_statement = "";
				}else{
					dataAdverseEvent.instance_medication_statement = suspectEntityInstanceMedicationStatement;
				}
			}else{
			  suspectEntityInstanceMedicationStatement = "";
			}

			if(typeof req.body.instance.device !== 'undefined' && req.body.instance.device !== ""){
				var suspectEntityInstanceDevice =  req.body.instance.device.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityInstanceDevice)){
					dataAdverseEvent.instance_device = "";
				}else{
					dataAdverseEvent.instance_device = suspectEntityInstanceDevice;
				}
			}else{
			  suspectEntityInstanceDevice = "";
			}

			if(typeof req.body.causality !== 'undefined' && req.body.causality !== ""){
				var suspectEntityCausality =  req.body.causality.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausality)){
					dataAdverseEvent.causality = "";
				}else{
					dataAdverseEvent.causality = suspectEntityCausality;
				}
			}else{
			  suspectEntityCausality = "";
			}

			if(typeof req.body.causalityAssessment !== 'undefined' && req.body.causalityAssessment !== ""){
				var suspectEntityCausalityAssessment =  req.body.causalityAssessment.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityAssessment)){
					dataAdverseEvent.causality_assessment = "";
				}else{
					dataAdverseEvent.causality_assessment = suspectEntityCausalityAssessment;
				}
			}else{
			  suspectEntityCausalityAssessment = "";
			}

			if(typeof req.body.causalityProductRelatedness !== 'undefined' && req.body.causalityProductRelatedness !== ""){
				var suspectEntityCausalityProductRelatedness =  req.body.causalityProductRelatedness.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityProductRelatedness)){
					dataAdverseEvent.causality_product_relatedness = "";
				}else{
					dataAdverseEvent.causality_product_relatedness = suspectEntityCausalityProductRelatedness;
				}
			}else{
			  suspectEntityCausalityProductRelatedness = "";
			}

			if(typeof req.body.causalityMethod !== 'undefined' && req.body.causalityMethod !== ""){
				var suspectEntityCausalityMethod =  req.body.causalityMethod.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityMethod)){
					dataAdverseEvent.causality_method = "";
				}else{
					dataAdverseEvent.causality_method = suspectEntityCausalityMethod;
				}
			}else{
			  suspectEntityCausalityMethod = "";
			}

			if(typeof req.body.causalityAuthor.practitioner !== 'undefined' && req.body.causalityAuthor.practitioner !== ""){
				var suspectEntityCausalityAuthorPractitioner =  req.body.causalityAuthor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityAuthorPractitioner)){
					dataAdverseEvent.causality_author_practitioner = "";
				}else{
					dataAdverseEvent.causality_author_practitioner = suspectEntityCausalityAuthorPractitioner;
				}
			}else{
			  suspectEntityCausalityAuthorPractitioner = "";
			}

			if(typeof req.body.causalityAuthor.practitionerRole !== 'undefined' && req.body.causalityAuthor.practitionerRole !== ""){
				var suspectEntityCausalityAuthorPractitionerRole =  req.body.causalityAuthor.practitionerRole.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityAuthorPractitionerRole)){
					dataAdverseEvent.causality_author_practitioner_role = "";
				}else{
					dataAdverseEvent.causality_author_practitioner_role = suspectEntityCausalityAuthorPractitionerRole;
				}
			}else{
			  suspectEntityCausalityAuthorPractitionerRole = "";
			}

			if(typeof req.body.causalityResult !== 'undefined' && req.body.causalityResult !== ""){
				var suspectEntityCausalityResult =  req.body.causalityResult.trim().toLowerCase();
				if(validator.isEmpty(suspectEntityCausalityResult)){
					dataAdverseEvent.causality_result = "";
				}else{
					dataAdverseEvent.causality_result = suspectEntityCausalityResult;
				}
			}else{
			  suspectEntityCausalityResult = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkAdverseEventID', function(){
							checkUniqeValue(apikey, "ADVERSE_EVENT_ID|" + adverseEventId, 'ADVERSE_EVENT', function(resAdverseEventId){
								if(resAdverseEventId.err_code > 0){
									checkUniqeValue(apikey, "SUSPECT_ENTITY_ID|" + adverseEventSuspectEntityId, 'ADVERSE_EVENT_SUSPECT_ENTITY', function(resAdverseEventSuspectEntityID){
										if(resAdverseEventSuspectEntityID.err_code > 0){
											ApiFHIR.put('adverseEventSuspectEntity', {"apikey": apikey, "_id": adverseEventSuspectEntityId, "dr": "ADVERSE_EVENT_ID|"+adverseEventId}, {body: dataAdverseEvent, json: true}, function(error, response, body){
												adverseEventSuspectEntity = body;
												if(adverseEventSuspectEntity.err_code > 0){
													res.json(adverseEventSuspectEntity);	
												}else{
													res.json({"err_code": 0, "err_msg": "Adverse Event Suspect Entity has been update in this Adverse Event.", "data": adverseEventSuspectEntity.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Adverse Event Suspect Entity Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Adverse Event Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkSuspectEntityCausalityResult', function () {
							if (!validator.isEmpty(suspectEntityCausalityResult)) {
								checkCode(apikey, suspectEntityCausalityResult, 'adverse_event_causality_result', function (resSuspectEntityCausalityResultCode) {
									if (resSuspectEntityCausalityResultCode.err_code > 0) {
										myEmitter.emit('checkAdverseEventID');
									} else {
										res.json({
											"err_code": "527",
											"err_msg": "Suspect Entity Causality Result code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAdverseEventID');
							}
						})

						myEmitter.prependOnceListener('checkSuspectEntityCausalityMethod', function () {
							if (!validator.isEmpty(suspectEntityCausalityMethod)) {
								checkCode(apikey, suspectEntityCausalityMethod, 'ADVERSE_EVENT_Causality_Method', function (resSuspectEntityCausalityMethodCode) {
									if (resSuspectEntityCausalityMethodCode.err_code > 0) {
										myEmitter.emit('checkSuspectEntityCausalityResult');
									} else {
										res.json({
											"err_code": "526",
											"err_msg": "Suspect Entity Causality Method code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSuspectEntityCausalityResult');
							}
						})

						myEmitter.prependOnceListener('checkSuspectEntityCausalityAssessment', function () {
							if (!validator.isEmpty(suspectEntityCausalityAssessment)) {
								checkCode(apikey, suspectEntityCausalityAssessment, 'ADVERSE_EVENT_Causality_Assess', function (resSuspectEntityCausalityAssessmentCode) {
									if (resSuspectEntityCausalityAssessmentCode.err_code > 0) {
										myEmitter.emit('checkSuspectEntityCausalityMethod');
									} else {
										res.json({
											"err_code": "525",
											"err_msg": "Suspect Entity Causality Assessment code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSuspectEntityCausalityMethod');
							}
						})

						myEmitter.prependOnceListener('checkSuspectEntityCausality', function () {
							if (!validator.isEmpty(suspectEntityCausality)) {
								checkCode(apikey, suspectEntityCausality, 'ADVERSE_EVENT_Causality', function (resSuspectEntityCausalityCode) {
									if (resSuspectEntityCausalityCode.err_code > 0) {
										myEmitter.emit('checkSuspectEntityCausalityAssessment');
									} else {
										res.json({
											"err_code": "524",
											"err_msg": "Suspect Entity Causality code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSuspectEntityCausalityAssessment');
							}
						})
						
						myEmitter.prependOnceListener('checkInstanceDevice', function () {
							if (!validator.isEmpty(suspectEntityInstanceDevice)) {
								checkUniqeValue(apikey, "Device_ID|" + suspectEntityInstanceDevice, 'Device', function (resInstanceDevice) {
									if (resInstanceDevice.err_code > 0) {
										myEmitter.emit('checkSuspectEntityCausality');
									} else {
										res.json({
											"err_code": "509",
											"err_msg": "Instance device id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSuspectEntityCausality');
							}
						})

						myEmitter.prependOnceListener('checkInstanceMedication', function () {
							if (!validator.isEmpty(suspectEntityInstanceMedication)) {
								checkUniqeValue(apikey, "Medication_ID|" + suspectEntityInstanceMedication, 'Medication', function (resInstanceMedication) {
									if (resInstanceMedication.err_code > 0) {
										myEmitter.emit('checkInstanceDevice');
									} else {
										res.json({
											"err_code": "508",
											"err_msg": "Instance medication id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInstanceDevice');
							}
						})

						myEmitter.prependOnceListener('checkInstanceSubstance', function () {
							if (!validator.isEmpty(suspectEntityInstanceSubstance)) {
								checkUniqeValue(apikey, "Substance_ID|" + suspectEntityInstanceSubstance, 'Substance', function (resInstanceSubstance) {
									if (resInstanceSubstance.err_code > 0) {
										myEmitter.emit('checkInstanceMedication');
									} else {
										res.json({
											"err_code": "507",
											"err_msg": "Instance substance id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInstanceMedication');
							}
						})

						myEmitter.prependOnceListener('checkInstanceMedicationAdministration', function () {
							if (!validator.isEmpty(suspectEntityInstanceMedicationAdministration)) {
								checkUniqeValue(apikey, "Medication_Administration_ID|" + suspectEntityInstanceMedicationAdministration, 'Medication_Administration', function (resInstanceMedicationAdministration) {
									if (resInstanceMedicationAdministration.err_code > 0) {
										myEmitter.emit('checkInstanceSubstance');
									} else {
										res.json({
											"err_code": "506",
											"err_msg": "Instance medication administration id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInstanceSubstance');
							}
						})

						myEmitter.prependOnceListener('checkInstanceMedicationStatement', function () {
							if (!validator.isEmpty(suspectEntityInstanceMedicationStatement)) {
								checkUniqeValue(apikey, "Medication_Statement_ID|" + suspectEntityInstanceMedicationStatement, 'Medication_Statement', function (resInstanceMedicationStatement) {
									if (resInstanceMedicationStatement.err_code > 0) {
										myEmitter.emit('checkInstanceMedicationAdministration');
									} else {
										res.json({
											"err_code": "505",
											"err_msg": "Instance medication statement id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInstanceMedicationAdministration');
							}
						})

						myEmitter.prependOnceListener('checkCausalityAuthorPractitioner', function () {
							if (!validator.isEmpty(suspectEntityCausalityAuthorPractitioner)) {
								checkUniqeValue(apikey, "Practitioner_ID|" + suspectEntityCausalityAuthorPractitioner, 'Practitioner', function (resCausalityAuthorPractitioner) {
									if (resCausalityAuthorPractitioner.err_code > 0) {
										myEmitter.emit('checkInstanceMedicationStatement');
									} else {
										res.json({
											"err_code": "504",
											"err_msg": "Causality author practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInstanceMedicationStatement');
							}
						})

						if (!validator.isEmpty(suspectEntityCausalityAuthorPractitionerRole)) {
							checkUniqeValue(apikey, "Practitioner_ROLE_ID|" + suspectEntityCausalityAuthorPractitionerRole, 'Practitioner_ROLE', function (resCausalityAuthorPractitionerRole) {
								if (resCausalityAuthorPractitionerRole.err_code > 0) {
									myEmitter.emit('checkCausalityAuthorPractitioner');
								} else {
									res.json({
										"err_code": "503",
										"err_msg": "Causality author practitioner role id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCausalityAuthorPractitioner');
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