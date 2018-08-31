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

			var qString = {};

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
														//get identifier
														qString = {};
														qString._id = adverseEvent.identifier_id;
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
																						"location": "%(apikey)s/SuspectEntity",
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
																						objectAdverseEvent.suspectEntity = suspectEntity.data;

																						newAdverseEvent[index] = objectAdverseEvent;

																						if(index == countAdverseEvent -1 ){
																							res.json({"err_code": 0, "data":newAdverseEvent});				
																						}			
																					}else{
																						res.json(contactPoint);			
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
		}		
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
			
			
			if(typeof req.body.category !== 'undefined'){
				category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					err_code = 2;
					err_msg = "Adverse Event category is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Adverse Event request.";
			}
			
			if(typeof req.body.type !== 'undefined'){
				type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					err_code = 2;
					err_msg = "Adverse Event type is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json Adverse Event request.";
			}
			
			//subject
			if(typeof req.body.subject !== 'undefined'){
				subject =  req.body.subject.trim().toLowerCase();
				if(validator.isEmpty(subject)){
					/*err_code = 2;
					err_msg = "Adverse Event subject is required";*/
					subjectPatient = '';
					subjectResearchSubject  = '';
					subjectMedication = '';
					subjectDevice = '';
				} else {
					var res = subject.substring(0, 3);
					if(res == 'pat'){
						subjectPatient = subject;
						subjectResearchSubject  = '';
						subjectMedication = '';
						subjectDevice = '';
					} else if (res == 'dev'){
						subjectPatient = '';
						subjectResearchSubject  = '';
						subjectMedication = '';
						subjectDevice = subject;
					} else if (res == 'med'){
						subjectPatient = '';
						subjectResearchSubject  = '';
						subjectMedication = subject;
						subjectDevice = '';
					} else {
						subjectPatient = '';
						subjectResearchSubject  = subject;
						subjectMedication = '';
						subjectDevice = '';
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject' in json Adverse Event request.";
			}
			
			if(typeof req.body.date !== 'undefined'){
				date =  req.body.date.trim().toLowerCase();
				if(validator.isEmpty(date)){
					err_code = 2;
					err_msg = "Adverse Event date is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'date' in json Adverse Event request.";
			}
			
			if(typeof req.body.reaction !== 'undefined'){
				reaction =  req.body.reaction.trim().toLowerCase();
				if(validator.isEmpty(reaction)){
					err_code = 2;
					err_msg = "Adverse Event reaction is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction' in json Adverse Event request.";
			}
			
			if(typeof req.body.location !== 'undefined'){
				location =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(location)){
					err_code = 2;
					err_msg = "Adverse Event location is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'location' in json Adverse Event request.";
			}
			
			if(typeof req.body.seriousness !== 'undefined'){
				seriousness =  req.body.seriousness.trim().toLowerCase();
				if(validator.isEmpty(seriousness)){
					err_code = 2;
					err_msg = "Adverse Event seriousness is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'seriousness' in json Adverse Event request.";
			}
			
			if(typeof req.body.outcome !== 'undefined'){
				outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					err_code = 2;
					err_msg = "Adverse Event outcome is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'outcome' in json Adverse Event request.";
			}
			
			//recorder
			if(typeof req.body.recorder !== 'undefined'){
				recorder =  req.body.recorder.trim().toLowerCase();
				if(validator.isEmpty(recorder)){
					/*err_code = 2;
					err_msg = "Adverse Event recorder is required";*/
					recorderPatient = '';
					recorderPractitioner  = '';
					recorderRelatedPerson = '';
				} else {
					var res = recorder.substring(0, 3);
					if(res == 'pat'){
						recorderPatient = recorder;
						recorderPractitioner  = '';
						recorderRelatedPerson = '';
					} else if (res == 'pra'){
						recorderPatient = '';
						recorderPractitioner  = recorder;
						recorderRelatedPerson = '';
					} else {
						recorderPatient = '';
						recorderPractitioner  = '';
						recorderRelatedPerson = recorder;
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recorder' in json Adverse Event request.";
			}
			
			//eventParticipant
			if(typeof req.body.eventParticipant !== 'undefined'){
				eventParticipant =  req.body.eventParticipant.trim().toLowerCase();
				if(validator.isEmpty(eventParticipant)){
					/*err_code = 2;
					err_msg = "Adverse Event event participant is required";*/
					eventParticipantPractitioner  = '';
					eventParticipantDevice = '';
				} else {
					var res = eventParticipant.substring(0, 3);
					if (res == 'pra'){
						eventParticipantPractitioner  = eventParticipant;
						eventParticipantDevice = '';
					} else {
						eventParticipantPractitioner  = '';
						eventParticipantDevice = eventParticipant;
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'eventParticipant' in json Adverse Event request.";
			}
			
			if(typeof req.body.description !== 'undefined'){
				description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					err_code = 2;
					err_msg = "Adverse Event description is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json Adverse Event request.";
			}
			
			if(typeof req.body.suspectEntity.instance !== 'undefined'){
				instance =  req.body.suspectEntity.instance.trim().toLowerCase();
				if(validator.isEmpty(instance)){
					/*err_code = 2;
					err_msg = "Adverse Event recorder is required";*/
					instanceDevice = '';
					instanceMedication  = '';
					instanceSubstance = '';
					instanceMedicationAdministration  = '';
					instanceMedicationStatement = '';
				} else {
					var res = instance.substring(0, 3);
					if(res == 'dev'){
						instanceDevice = instance;
						instanceMedication  = '';
						instanceSubstance = '';
						instanceMedicationAdministration  = '';
						instanceMedicationStatement = '';
					} else if (res == 'med'){
						instanceDevice = '';
						instanceMedication  = instance;
						instanceSubstance = '';
						instanceMedicationAdministration  = '';
						instanceMedicationStatement = '';
					} else if (res == 'sub'){
						instanceDevice = '';
						instanceMedication  = '';
						instanceSubstance = instance;
						instanceMedicationAdministration  = '';
						instanceMedicationStatement = '';
					} else if (res == 'mea'){
						instanceDevice = '';
						instanceMedication  = '';
						instanceSubstance = '';
						instanceMedicationAdministration  = instance;
						instanceMedicationStatement = '';
					} else {
						instanceDevice = '';
						instanceMedication  = '';
						instanceSubstance = '';
						instanceMedicationAdministration  = '';
						instanceMedicationStatement = instance;
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity instance' in json Adverse Event request.";
			}
			
			if(typeof req.body.suspectEntity.causality !== 'undefined'){
				causality =  req.body.suspectEntity.causality.trim().toLowerCase();
				if(validator.isEmpty(causality)){
					err_code = 2;
					err_msg = "Adverse Event suspect entity causality is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality' in json Adverse Event request.";
			}
			
			if(typeof req.body.suspectEntity.causalityAssessment !== 'undefined'){
				causalityAssessment =  req.body.suspectEntity.causalityAssessment.trim().toLowerCase();
				if(validator.isEmpty(causalityAssessment)){
					err_code = 2;
					err_msg = "Adverse Event suspect entity causality assessment is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality assessment' in json Adverse Event request.";
			}
			
			if(typeof req.body.suspectEntity.causalityProductRelatedness !== 'undefined'){
				causalityProductRelatedness =  req.body.suspectEntity.causalityProductRelatedness.trim().toLowerCase();
				if(validator.isEmpty(causalityProductRelatedness)){
					err_code = 2;
					err_msg = "Adverse Event suspect entity causality product relatedness is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality product relatedness' in json Adverse Event request.";
			}
			
			if(typeof req.body.suspectEntity.causalityMethod !== 'undefined'){
				causalityMethod =  req.body.suspectEntity.causalityMethod.trim().toLowerCase();
				if(validator.isEmpty(causalityMethod)){
					err_code = 2;
					err_msg = "Adverse Event suspect entity causality method is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality method' in json Adverse Event request.";
			}
			
			if(typeof req.body.suspectEntity.causalityAuthor !== 'undefined'){
				causalityAuthor =  req.body.suspectEntity.causalityAuthor.trim().toLowerCase();
				if(validator.isEmpty(causalityAuthor)){
					/*err_code = 2;
					err_msg = "Adverse Event event participant is required";*/
					causalityAuthorPractitioner  = '';
					causalityAuthorPractitionerRole = '';
				} else {
					var res = eventParticipant.substring(0, 3);
					if (res == 'pra'){
						causalityAuthorPractitioner  = causalityAuthor;
						causalityAuthorPractitionerRole = '';
					} else {
						causalityAuthorPractitioner  = '';
						causalityAuthorPractitionerRole = causalityAuthor;
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality author' in json Adverse Event request.";
			}
			
			if(typeof req.body.suspectEntity.causalityResult !== 'undefined'){
				causalityResult =  req.body.suspectEntity.causalityResult.trim().toLowerCase();
				if(validator.isEmpty(causalityResult)){
					err_code = 2;
					err_msg = "Adverse Event suspect entity causality result is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'suspect entity causality result' in json Adverse Event request.";
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
													var adverseEventId = 'ade' + unicId;
													var adverseEventId = 'ade' + unicId;
													var suspectEntityId = 'sue' + unicId;
													
													dataAdverseEvent = {
														"adverse_event_id" : adverseEventId,
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
														"instance_substance" : instanceSubstance, 
														"instance_medication" : instanceMedication, 
														"instance_medication_administration" : instanceMedicationAdministration,  
														"instance_medication_statement" : instanceMedicationStatement, 
														"instance_device" : instanceDevice, 
														"causality" : causality, 
														"causality_assessment" : causalityAssessment, 
														"causality_product_relatedness" : causalityProductRelatedness, 
														"causality_method" : causalityMethod, 
														"causality_author_practitioner" : causalityAuthorPractitioner, 
														"causality_author_practitioner_role" : causalityAuthorPractitionerRole, 
														"causality_result" : causalityResult, 
														"adverse_event_id" : adverseEventId
													}
													ApiFHIR.post('adverseEventSuspectEntity', {"apikey": apikey}, {body: dataSuspectEntity, json: true}, function(error, response, body){
														adverseEventSuspectEntity = body;
														if(adverseEventSuspectEntity.err_code > 0){
															res.json(adverseEventSuspectEntity);	
															console.log("ok");
														}
													});

													res.json({"err_code": 0, "err_msg": "Adverse Event has been add.", "data": [{"_id": adverseEventId}]});
												}else{
													res.json({"err_code": 508, "err_msg": "Identifier value already exist."});		
												}
											})
									});
									
									myEmitter.prependOnceListener('checkSubjectPatient', function () {
										if (!validator.isEmpty(subjectPatient)) {
											checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
												if (resSubjectPatient.err_code > 0) {
													myEmitter.emit('checkIdentifierValue');
												} else {
													res.json({
														"err_code": "527",
														"err_msg": "Subject patient id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkIdentifierValue');
										}
									})
									
									myEmitter.prependOnceListener('checkSubjectResearchSubject', function () {
										if (!validator.isEmpty(subjectResearchSubject)) {
											checkUniqeValue(apikey, "Research_Subject_ID|" + subjectResearchSubject	, 'Research_Subject', function (resSubjectResearchSubject) {
												if (resSubjectResearchSubject.err_code > 0) {
													myEmitter.emit('checkSubjectPatient');
												} else {
													res.json({
														"err_code": "527",
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
														"err_code": "527",
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
														"err_code": "527",
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
														"err_code": "527",
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
														"err_code": "527",
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
														"err_code": "527",
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
														"err_code": "527",
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
														"err_code": "527",
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
														"err_code": "527",
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
														"err_code": "527",
														"err_msg": "Event participant device id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkEventParticipantPractitioner');
										}
									})
									
									myEmitter.prependOnceListener('checkInstanceDevice', function () {
										if (!validator.isEmpty(instanceDevice)) {
											checkUniqeValue(apikey, "Device_ID|" + instanceDevice, 'Device', function (resInstanceDevice) {
												if (resInstanceDevice.err_code > 0) {
													myEmitter.emit('checkEventParticipantDevice');
												} else {
													res.json({
														"err_code": "527",
														"err_msg": "Instance device id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkEventParticipantDevice');
										}
									})
									
									myEmitter.prependOnceListener('checkInstanceMedication', function () {
										if (!validator.isEmpty(instanceMedication)) {
											checkUniqeValue(apikey, "Medication_ID|" + instanceMedication, 'Medication', function (resInstanceMedication) {
												if (resInstanceMedication.err_code > 0) {
													myEmitter.emit('checkInstanceDevice');
												} else {
													res.json({
														"err_code": "527",
														"err_msg": "Instance medication id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkInstanceDevice');
										}
									})
									
									myEmitter.prependOnceListener('checkInstanceSubstance', function () {
										if (!validator.isEmpty(instanceSubstance)) {
											checkUniqeValue(apikey, "Substance_ID|" + instanceSubstance, 'Substance', function (resInstanceSubstance) {
												if (resInstanceSubstance.err_code > 0) {
													myEmitter.emit('checkInstanceMedication');
												} else {
													res.json({
														"err_code": "527",
														"err_msg": "Instance substance id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkInstanceMedication');
										}
									})
									
									myEmitter.prependOnceListener('checkInstanceMedicationAdministration', function () {
										if (!validator.isEmpty(instanceMedicationAdministration)) {
											checkUniqeValue(apikey, "Medication_Administration_ID|" + instanceMedicationAdministration, 'Medication_Administration', function (resInstanceMedicationAdministration) {
												if (resInstanceMedicationAdministration.err_code > 0) {
													myEmitter.emit('checkInstanceSubstance');
												} else {
													res.json({
														"err_code": "527",
														"err_msg": "Instance medication administration id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkInstanceSubstance');
										}
									})
									
									myEmitter.prependOnceListener('checkInstanceMedicationStatement', function () {
										if (!validator.isEmpty(instanceMedicationStatement)) {
											checkUniqeValue(apikey, "Medication_Statement_ID|" + instanceMedicationAdministration, 'Medication_Statement', function (resInstanceMedicationStatement) {
												if (resInstanceMedicationStatement.err_code > 0) {
													myEmitter.emit('checkInstanceMedicationAdministration');
												} else {
													res.json({
														"err_code": "527",
														"err_msg": "Instance medication statement id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkInstanceMedicationAdministration');
										}
									})
									
									myEmitter.prependOnceListener('checkCausalityAuthorPractitioner', function () {
										if (!validator.isEmpty(causalityAuthorPractitioner)) {
											checkUniqeValue(apikey, "Practitioner_ID|" + causalityAuthorPractitioner, 'Practitioner', function (resCausalityAuthorPractitioner) {
												if (resCausalityAuthorPractitioner.err_code > 0) {
													myEmitter.emit('checkInstanceMedicationStatement');
												} else {
													res.json({
														"err_code": "527",
														"err_msg": "Causality author practitioner id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkInstanceMedicationStatement');
										}
									})
									
									if (!validator.isEmpty(causalityAuthorPractitionerRole)) {
										checkUniqeValue(apikey, "Practitioner_ROLE_ID|" + causalityAuthorPractitionerRole, 'Practitioner_ROLE', function (resCausalityAuthorPractitionerRole) {
											if (resCausalityAuthorPractitionerRole.err_code > 0) {
												myEmitter.emit('checkCausalityAuthorPractitioner');
											} else {
												res.json({
													"err_code": "527",
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
			
		}
	},
	put: {
		adverseEvent : function putAdverseEvent(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");

      var err_code = 0;
      var err_msg = "";
			
			if(typeof req.body.category !== 'undefined'){
				category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					err_code = 2;
					err_msg = "Adverse Event category is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Adverse Event request.";
			}
			
			if(typeof req.body.type !== 'undefined'){
				type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					err_code = 2;
					err_msg = "Adverse Event type is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json Adverse Event request.";
			}
			
			//subject
			if(typeof req.body.subject !== 'undefined'){
				subject =  req.body.subject.trim().toLowerCase();
				if(validator.isEmpty(subject)){
					/*err_code = 2;
					err_msg = "Adverse Event subject is required";*/
					subjectPatient = '';
					subjectResearchSubject  = '';
					subjectMedication = '';
					subjectDevice = '';
				} else {
					var res = subject.substring(0, 3);
					if(res == 'pat'){
						subjectPatient = subject;
						subjectResearchSubject  = '';
						subjectMedication = '';
						subjectDevice = '';
					} else if (res == 'dev'){
						subjectPatient = '';
						subjectResearchSubject  = '';
						subjectMedication = '';
						subjectDevice = subject;
					} else if (res == 'med'){
						subjectPatient = '';
						subjectResearchSubject  = '';
						subjectMedication = subject;
						subjectDevice = '';
					} else {
						subjectPatient = '';
						subjectResearchSubject  = subject;
						subjectMedication = '';
						subjectDevice = '';
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject' in json Adverse Event request.";
			}
			
			if(typeof req.body.date !== 'undefined'){
				date =  req.body.date.trim().toLowerCase();
				if(validator.isEmpty(date)){
					err_code = 2;
					err_msg = "Adverse Event date is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'date' in json Adverse Event request.";
			}
			
			if(typeof req.body.reaction !== 'undefined'){
				reaction =  req.body.reaction.trim().toLowerCase();
				if(validator.isEmpty(reaction)){
					err_code = 2;
					err_msg = "Adverse Event reaction is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reaction' in json Adverse Event request.";
			}
			
			if(typeof req.body.location !== 'undefined'){
				location =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(location)){
					err_code = 2;
					err_msg = "Adverse Event location is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'location' in json Adverse Event request.";
			}
			
			if(typeof req.body.seriousness !== 'undefined'){
				seriousness =  req.body.seriousness.trim().toLowerCase();
				if(validator.isEmpty(seriousness)){
					err_code = 2;
					err_msg = "Adverse Event seriousness is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'seriousness' in json Adverse Event request.";
			}
			
			if(typeof req.body.outcome !== 'undefined'){
				outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					err_code = 2;
					err_msg = "Adverse Event outcome is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'outcome' in json Adverse Event request.";
			}
			
			//recorder
			if(typeof req.body.recorder !== 'undefined'){
				recorder =  req.body.recorder.trim().toLowerCase();
				if(validator.isEmpty(recorder)){
					/*err_code = 2;
					err_msg = "Adverse Event recorder is required";*/
					recorderPatient = '';
					recorderPractitioner  = '';
					recorderRelatedPerson = '';
				} else {
					var res = recorder.substring(0, 3);
					if(res == 'pat'){
						recorderPatient = recorder;
						recorderPractitioner  = '';
						recorderRelatedPerson = '';
					} else if (res == 'pra'){
						recorderPatient = '';
						recorderPractitioner  = recorder;
						recorderRelatedPerson = '';
					} else {
						recorderPatient = '';
						recorderPractitioner  = '';
						recorderRelatedPerson = recorder;
					}
				}
				
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recorder' in json Adverse Event request.";
			}
			
			//eventParticipant
			if(typeof req.body.eventParticipant !== 'undefined'){
				eventParticipant =  req.body.eventParticipant.trim().toLowerCase();
				if(validator.isEmpty(eventParticipant)){
					/*err_code = 2;
					err_msg = "Adverse Event event participant is required";*/
					eventParticipantPractitioner  = '';
					eventParticipantDevice = '';
				} else {
					var res = eventParticipant.substring(0, 3);
					if (res == 'pra'){
						eventParticipantPractitioner  = eventParticipant;
						eventParticipantDevice = '';
					} else {
						eventParticipantPractitioner  = '';
						eventParticipantDevice = eventParticipant;
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'eventParticipant' in json Adverse Event request.";
			}
			
			if(typeof req.body.description !== 'undefined'){
				description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					err_code = 2;
					err_msg = "Adverse Event description is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json Adverse Event request.";
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
													var adverseEventId = 'ade' + unicId;
													
													dataAdverseEvent = {
														"adverse_event_id" : adverseEventId,
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
													console.log(dataAdverseEvent);
													ApiFHIR.post('adverseEvent', {"apikey": apikey}, {body: dataAdverseEvent, json: true}, function(error, response, body){
														adverseEvent = body;
														if(adverseEvent.err_code > 0){
															res.json(adverseEvent);	
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
																						"adverse_event_id": adverseEventId
																					}

													ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
														identifier = body;
														if(identifier.err_code > 0){
															res.json(identifier);	
														}
													})*/

													res.json({"err_code": 0, "err_msg": "Adverse Event has been update.", "data": [{"_id": adverseEventId}]});
												
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