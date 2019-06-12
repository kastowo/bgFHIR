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
		careTeam : function getCareTeam(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var careTeamId = req.query._id;
			var category = req.query.category;
			var context = req.query.context;
			var date = req.query.date;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var participant = req.query.participant;
			var patient = req.query.patient;
			var status = req.query.status;
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

			if(typeof careTeamId !== 'undefined'){
				if(!validator.isEmpty(careTeamId)){
					qString._id = careTeamId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Care Team Id is required."});
				}
			}

			if(typeof category !== 'undefined'){
				if(!validator.isEmpty(category)){
					qString.category = category; 
				}else{
					res.json({"err_code": 1, "err_msg": "category is empty."});
				}
			}

			if(typeof context !== 'undefined'){
				if(!validator.isEmpty(context)){
					qString.context = context; 
				}else{
					res.json({"err_code": 1, "err_msg": "context is empty."});
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

			if(typeof encounter !== 'undefined'){
				if(!validator.isEmpty(encounter)){
					qString.encounter = encounter; 
				}else{
					res.json({"err_code": 1, "err_msg": "encounter is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "identifier is empty."});
				}
			}

			if(typeof participant !== 'undefined'){
				if(!validator.isEmpty(participant)){
					qString.participant = participant; 
				}else{
					res.json({"err_code": 1, "err_msg": "participant is empty."});
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

			if(typeof subject !== 'undefined'){
				if(!validator.isEmpty(subject)){
					qString.subject = subject; 
				}else{
					res.json({"err_code": 1, "err_msg": "subject is empty."});
				}
			}
			

			seedPhoenixFHIR.path.GET = {
				"CareTeam" : {
					"location": "%(apikey)s/CareTeam",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('CareTeam', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var careTeam = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(careTeam.err_code == 0){
								//cek jumdata dulu
								if(careTeam.data.length > 0){
									newCareTeam = [];
									for(i=0; i < careTeam.data.length; i++){
										myEmitter.once("getIdentifier", function(careTeam, index, newCareTeam, countCareTeam){
											/*console.log(careTeam);*/
														//get identifier
														qString = {};
														qString.care_team_id = careTeam.id;
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
																var objectCareTeam = {};
																objectCareTeam.resourceType = careTeam.resourceType;
																objectCareTeam.id = careTeam.id;
																objectCareTeam.identifier = identifier.data;
																objectCareTeam.status = careTeam.status;
																objectCareTeam.category = careTeam.category;
																objectCareTeam.name = careTeam.name;
																objectCareTeam.subject = careTeam.subject;
																objectCareTeam.context = careTeam.context;
																objectCareTeam.period = careTeam.period;
																objectCareTeam.reasonCode = careTeam.reasonCode;
																
																newCareTeam[index] = objectCareTeam;
																
																/*if(index == countCareTeam -1 ){
																	res.json({"err_code": 0, "data":newCareTeam});				
																}
*/
																myEmitter.once('getCareTeamParticipant', function(careTeam, index, newCareTeam, countCareTeam){
																				qString = {};
																				qString.care_team_id = careTeam.id;
																				seedPhoenixFHIR.path.GET = {
																					"CareTeamParticipant" : {
																						"location": "%(apikey)s/CareTeamParticipant",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('CareTeamParticipant', {"apikey": apikey}, {}, function(error, response, body){
																					careTeamParticipant = JSON.parse(body);
																					if(careTeamParticipant.err_code == 0){
																						var objectCareTeam = {};
																						objectCareTeam.resourceType = careTeam.resourceType;
																						objectCareTeam.id = careTeam.id;
																						objectCareTeam.identifier = careTeam.identifier;
																						objectCareTeam.status = careTeam.status;
																						objectCareTeam.category = careTeam.category;
																						objectCareTeam.name = careTeam.name;
																						objectCareTeam.subject = careTeam.subject;
																						objectCareTeam.context = careTeam.context;
																						objectCareTeam.period = careTeam.period;
																						objectCareTeam.participant = careTeamParticipant.data;
																						objectCareTeam.reasonCode = careTeam.reasonCode;

																						newCareTeam[index] = objectCareTeam;

																						/*if(index == countCareTeam -1 ){
																							res.json({"err_code": 0, "data":newCareTeam});				
																						}*/
																						myEmitter.once('getReasonReference', function(careTeam, index, newCareTeam, countCareTeam){
																							qString = {};
																							qString.care_team_id = careTeam.id;
																							seedPhoenixFHIR.path.GET = {
																								"ReasonReference" : {
																									"location": "%(apikey)s/CareTeamCondition",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('ReasonReference', {"apikey": apikey}, {}, function(error, response, body){
																								reasonReference = JSON.parse(body);
																								console.log(reasonReference);
																								if(reasonReference.err_code == 0){
																									var objectCareTeam = {};
																									objectCareTeam.resourceType = careTeam.resourceType;
																									objectCareTeam.id = careTeam.id;
																									objectCareTeam.identifier = careTeam.identifier;
																									objectCareTeam.status = careTeam.status;
																									objectCareTeam.category = careTeam.category;
																									objectCareTeam.name = careTeam.name;
																									objectCareTeam.subject = careTeam.subject;
																									objectCareTeam.context = careTeam.context;
																									objectCareTeam.period = careTeam.period;
																									objectCareTeam.participant = careTeam.participant;
																									objectCareTeam.reasonCode = careTeam.reasonCode;								
																									objectCareTeam.reasonReference = reasonReference.data;

																									newCareTeam[index] = objectCareTeam;

																									myEmitter.once('getManagingOrganization', function(careTeam, index, newCareTeam, countCareTeam){
																										qString = {};
																										qString.care_team_id = careTeam.id;
																										seedPhoenixFHIR.path.GET = {
																											"ManagingOrganization" : {
																												"location": "%(apikey)s/CareTeamOrganization",
																												"query": qString
																											}
																										}

																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																										ApiFHIR.get('ManagingOrganization', {"apikey": apikey}, {}, function(error, response, body){
																											managingOrganization = JSON.parse(body);
																											if(managingOrganization.err_code == 0){
																												var objectCareTeam = {};
																												objectCareTeam.resourceType = careTeam.resourceType;
																												objectCareTeam.id = careTeam.id;
																												objectCareTeam.identifier = careTeam.identifier;
																												objectCareTeam.status = careTeam.status;
																												objectCareTeam.category = careTeam.category;
																												objectCareTeam.name = careTeam.name;
																												objectCareTeam.subject = careTeam.subject;
																												objectCareTeam.context = careTeam.context;
																												objectCareTeam.period = careTeam.period;
																												objectCareTeam.participant = careTeam.participant;
																												objectCareTeam.reasonCode = careTeam.reasonCode;
																												objectCareTeam.reasonReference = careTeam.reasonReference;
																												objectCareTeam.managingOrganization = managingOrganization.data;

																												newCareTeam[index] = objectCareTeam;

																												myEmitter.once('getAnnotation', function(careTeam, index, newCareTeam, countCareTeam){
																													qString = {};
																													qString.care_team_id = careTeam.id;
																													seedPhoenixFHIR.path.GET = {
																														"Annotation" : {
																															"location": "%(apikey)s/Annotation",
																															"query": qString
																														}
																													}

																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																													ApiFHIR.get('Annotation', {"apikey": apikey}, {}, function(error, response, body){
																														note = JSON.parse(body);
																														if(note.err_code == 0){
																															var objectCareTeam = {};
																															objectCareTeam.resourceType = careTeam.resourceType;
																															objectCareTeam.id = careTeam.id;
																															objectCareTeam.identifier = careTeam.identifier;
																															objectCareTeam.status = careTeam.status;
																															objectCareTeam.category = careTeam.category;
																															objectCareTeam.name = careTeam.name;
																															objectCareTeam.subject = careTeam.subject;
																															objectCareTeam.context = careTeam.context;
																															objectCareTeam.period = careTeam.period;
																															objectCareTeam.participant = careTeam.participant;
																															objectCareTeam.reasonCode = careTeam.reasonCode;
																															objectCareTeam.reasonReference = careTeam.reasonReference;
																															objectCareTeam.managingOrganization = careTeam.managingOrganization;
																															objectCareTeam.note = note.data;

																															newCareTeam[index] = objectCareTeam;

																															if(index == countCareTeam -1 ){
																																res.json({"err_code": 0, "data":newCareTeam});				
																															}

																														}else{
																															res.json(note);			
																														}
																													})
																												})
																												myEmitter.emit('getAnnotation', objectCareTeam, index, newCareTeam, countCareTeam);			
																											}else{
																												res.json(managingOrganization);			
																											}
																										})
																									})
																									myEmitter.emit('getManagingOrganization', objectCareTeam, index, newCareTeam, countCareTeam);			
																								}else{
																									res.json(reasonReference);			
																								}
																							})
																						})
																						myEmitter.emit('getReasonReference', objectCareTeam, index, newCareTeam, countCareTeam);
																					}else{
																						res.json(careTeamParticipant);			
																					}
																				})
																			})
																myEmitter.emit('getCareTeamParticipant', objectCareTeam, index, newCareTeam, countCareTeam);
															}else{
																res.json(identifier);
															}
														})
													})
										myEmitter.emit("getIdentifier", careTeam.data[i], i, newCareTeam, careTeam.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Care Team is empty."});	
								}
							}else{
								res.json(careTeam);
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
					var careTeamId = req.params.care_team_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "CARE_TEAM_ID|" + careTeamId, 'CARE_TEAM', function(resCareTeamID){
								if(resCareTeamID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.care_team_id = careTeamId;
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
						  			qString.care_team_id = careTeamId;
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
									res.json({"err_code": 501, "err_msg": "Care Team Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		careTeamParticipant: function getCareTeamParticipant(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var careTeamId = req.params.care_team_id;
			var careTeamParticipantId = req.params.care_team_participant_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "CARE_TEAM_ID|" + careTeamId, 'CARE_TEAM', function(resCareTeam){
						if(resCareTeam.err_code > 0){
							if(typeof careTeamParticipantId !== 'undefined' && !validator.isEmpty(careTeamParticipantId)){
								checkUniqeValue(apikey, "PARTICIPANT_ID|" + careTeamParticipantId, 'CARE_TEAM_PARTICIPANT', function(resCareTeamParticipantID){
									if(resCareTeamParticipantID.err_code > 0){
										//get careTeamParticipant
										qString = {};
										qString.care_team_id = careTeamId;
										qString._id = careTeamParticipantId;
										seedPhoenixFHIR.path.GET = {
											"CareTeamParticipant" : {
												"location": "%(apikey)s/CareTeamParticipant",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('CareTeamParticipant', {"apikey": apikey}, {}, function(error, response, body){
											careTeamParticipant = JSON.parse(body);
											if(careTeamParticipant.err_code == 0){
												res.json({"err_code": 0, "data":careTeamParticipant.data});	
											}else{
												res.json(careTeamParticipant);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Care Team Participant Id not found"});		
									}
								})
							}else{
								//get careTeamParticipant
								qString = {};
								qString.care_team_id = careTeamId;
								seedPhoenixFHIR.path.GET = {
									"CareTeamParticipant" : {
										"location": "%(apikey)s/CareTeamParticipant",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('CareTeamParticipant', {"apikey": apikey}, {}, function(error, response, body){
									careTeamParticipant = JSON.parse(body);
									if(careTeamParticipant.err_code == 0){
										res.json({"err_code": 0, "data":careTeamParticipant.data});	
									}else{
										res.json(careTeamParticipant);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Care Team  Id not found"});		
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
		careTeam : function addCareTeam(req, res){
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

/*status|status||
category|category||
name|name||
subject.patient|subjectPatient||
subject.group|subjectGroup||
context.encounter|contextEncounter||
context.episodeOfCare|contextEpisodeOfCare||
period|period|period|
participant.role|participantRole||
participant.member.practitioner|participantMemberPractitioner||
participant.member.relatedPerson|participantMemberRelatedPerson||
participant.member.patient|participantMemberPatient||
participant.member.organization|participantMemberOrganization||
participant.member.careTeam|participantMemberCareTeam||
participant.onBehalfOf|participantOnBehalfOf||
participant.period|participantPeriod|period|
reasonCode|reasonCode||
reasonReference|reasonReference||
managingOrganization|managingOrganization||
note.author.authorReference.practitioner|noteAuthorPractitioner||
note.author.authorReference.patient|noteAuthorPatient||
note.author.authorReference.relatedPerson|noteAuthorRelatedPerson||
note.author.authorString|noteAuthorAuthorString||
note.time|noteTime|date|
note.text|noteText||*/
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Care Team request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Care Team request.";
			}

			if(typeof req.body.name !== 'undefined'){
				var name =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(name)){
					name = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'name' in json Care Team request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Care Team request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Care Team request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Care Team request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Care Team request.";
			}

			if (typeof req.body.period !== 'undefined') {
			  var period = req.body.period;
 				if(validator.isEmpty(period)) {
				  var periodStart = "";
				  var periodEnd = "";
				} else {
				  if (period.indexOf("to") > 0) {
				    arrPeriod = period.split("to");
				    var periodStart = arrPeriod[0];
				    var periodEnd = arrPeriod[1];
				    if (!regex.test(periodStart) && !regex.test(periodEnd)) {
				      err_code = 2;
				      err_msg = "Care Team period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Care Team period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'period' in json Care Team request.";
			}

			if(typeof req.body.participant.role !== 'undefined'){
				var participantRole =  req.body.participant.role.trim().toLowerCase();
				if(validator.isEmpty(participantRole)){
					participantRole = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant role' in json Care Team request.";
			}

			if(typeof req.body.participant.member.practitioner !== 'undefined'){
				var participantMemberPractitioner =  req.body.participant.member.practitioner.trim().toLowerCase();
				if(validator.isEmpty(participantMemberPractitioner)){
					participantMemberPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member practitioner' in json Care Team request.";
			}

			if(typeof req.body.participant.member.relatedPerson !== 'undefined'){
				var participantMemberRelatedPerson =  req.body.participant.member.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(participantMemberRelatedPerson)){
					participantMemberRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member related person' in json Care Team request.";
			}

			if(typeof req.body.participant.member.patient !== 'undefined'){
				var participantMemberPatient =  req.body.participant.member.patient.trim().toLowerCase();
				if(validator.isEmpty(participantMemberPatient)){
					participantMemberPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member patient' in json Care Team request.";
			}

			if(typeof req.body.participant.member.organization !== 'undefined'){
				var participantMemberOrganization =  req.body.participant.member.organization.trim().toLowerCase();
				if(validator.isEmpty(participantMemberOrganization)){
					participantMemberOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member organization' in json Care Team request.";
			}

			if(typeof req.body.participant.member.careTeam !== 'undefined'){
				var participantMemberCareTeam =  req.body.participant.member.careTeam.trim().toLowerCase();
				if(validator.isEmpty(participantMemberCareTeam)){
					participantMemberCareTeam = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member care team' in json Care Team request.";
			}

			if(typeof req.body.participant.onBehalfOf !== 'undefined'){
				var participantOnBehalfOf =  req.body.participant.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(participantOnBehalfOf)){
					participantOnBehalfOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant on behalf of' in json Care Team request.";
			}

			if (typeof req.body.participant.period !== 'undefined') {
			  var participantPeriod = req.body.participant.period;
 				if(validator.isEmpty(participantPeriod)) {
				  var participantPeriodStart = "";
				  var participantPeriodEnd = "";
				} else {
				  if (participantPeriod.indexOf("to") > 0) {
				    arrParticipantPeriod = participantPeriod.split("to");
				    var participantPeriodStart = arrParticipantPeriod[0];
				    var participantPeriodEnd = arrParticipantPeriod[1];
				    if (!regex.test(participantPeriodStart) && !regex.test(participantPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Care Team participant period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Care Team participant period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'participant period' in json Care Team request.";
			}

			if(typeof req.body.reasonCode !== 'undefined'){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					reasonCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason code' in json Care Team request.";
			}

			if(typeof req.body.reasonReference !== 'undefined'){
				var reasonReference =  req.body.reasonReference.trim().toLowerCase();
				if(validator.isEmpty(reasonReference)){
					reasonReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference' in json Care Team request.";
			}

			if(typeof req.body.managingOrganization !== 'undefined'){
				var managingOrganization =  req.body.managingOrganization.trim().toLowerCase();
				if(validator.isEmpty(managingOrganization)){
					managingOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'managing organization' in json Care Team request.";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					noteAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Care Team request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					noteAuthorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Care Team request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					noteAuthorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Care Team request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Care Team request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Care Team note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Care Team request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note text' in json Care Team request.";
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
														var careTeamId = 'cte' + unicId;
														var careTeamParticipantId = 'ctp' + unicId;
														var noteId = 'act' + unicId;

														dataCareTeam = {
															"care_team_id" : careTeamId,
															"status" : status,
															"category" : category,
															"name" : name,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"context_encounter" : contextEncounter,
															"context_episode_of_care" : contextEpisodeOfCare,
															"period_start" : periodStart,
															"period_end" : periodEnd,
															"reason_code" : reasonCode
														}
														console.log(dataCareTeam);
														ApiFHIR.post('careTeam', {"apikey": apikey}, {body: dataCareTeam, json: true}, function(error, response, body){
															careTeam = body;
															if(careTeam.err_code > 0){
																res.json(careTeam);	
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
																							"care_team_id": careTeamId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})

														//CareTeamParticipant
														dataCareTeamParticipant = {
															"participant_id" : careTeamParticipantId,
															"role" : participantRole,
															"member_practitioner" : participantMemberPractitioner,
															"member_related_person" : participantMemberRelatedPerson,
															"member_patient" : participantMemberPatient,
															"member_organization" : participantMemberOrganization,
															"member_care_team" : participantMemberCareTeam,
															"on_behalf_of" : participantOnBehalfOf,
															"period_start" : participantPeriodStart,
															"period_end" : participantPeriodEnd,
															"care_team_id" : careTeamId

														}
														ApiFHIR.post('careTeamParticipant', {"apikey": apikey}, {body: dataCareTeamParticipant, json: true}, function(error, response, body){
															careTeamParticipant = body;
															if(careTeamParticipant.err_code > 0){
																res.json(careTeamParticipant);	
																console.log("ok");
															}
														});

														var dataNoteActivity = {
															"id": noteId,
															"author_ref_practitioner": noteAuthorPractitioner,
															"author_ref_patient": noteAuthorPatient,
															"author_ref_relatedPerson": noteAuthorRelatedPerson,
															"author_string": noteAuthorAuthorString,
															"time": noteTime,
															"text": noteText,
															"care_team_id" : careTeamId
														};
														
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataNoteActivity, json:true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
															} 
														});
														
														if(reasonReference !== ""){
															dataReasonReference = {
																"_id" : reasonReference,
																"care_team_id" : careTeamId
															}
															ApiFHIR.put('organization', {"apikey": apikey, "_id": reasonReference}, {body: dataReasonReference, json: true}, function(error, response, body){
																returnReasonReference = body;
																if(returnReasonReference.err_code > 0){
																	res.json(returnReasonReference);	
																	console.log("add reference reason reference : " + reasonReference);
																}
															});
														}
														
														if(managingOrganization !== ""){
															dataManagingOrganization = {
																"_id" : managingOrganization,
																"care_team_id" : careTeamId
															}
															ApiFHIR.put('organization', {"apikey": apikey, "_id": managingOrganization}, {body: dataManagingOrganization, json: true}, function(error, response, body){
																returnManagingOrganization = body;
																if(returnManagingOrganization.err_code > 0){
																	res.json(returnManagingOrganization);	
																	console.log("add reference managing organization : " + managingOrganization);
																}
															});
														}
														
														res.json({"err_code": 0, "err_msg": "Care Team has been add.", "data": [{"_id": careTeamId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
										status|CARE_TEAM_status
										category|CARE_TEAM_CATEGORY
										participantRole|PARTICIPANT_ROLE
										reasonCode|CLINICAL_FINDINGS
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'CARE_TEAM_STATUS', function (resStatusCode) {
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

										myEmitter.prependOnceListener('checkCategory', function () {
											if (!validator.isEmpty(category)) {
												checkCode(apikey, category, 'CARE_TEAM_CATEGORY', function (resCategoryCode) {
													if (resCategoryCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})

										myEmitter.prependOnceListener('checkParticipantRole', function () {
											if (!validator.isEmpty(participantRole)) {
												checkCode(apikey, participantRole, 'PARTICIPANT_ROLE', function (resParticipantRoleCode) {
													if (resParticipantRoleCode.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Participant role code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkReasonCode', function () {
											if (!validator.isEmpty(reasonCode)) {
												checkCode(apikey, reasonCode, 'CLINICAL_FINDINGS', function (resReasonCodeCode) {
													if (resReasonCodeCode.err_code > 0) {
														myEmitter.emit('checkParticipantRole');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkParticipantRole');
											}
										})


										//cek value
										/*
										subjectPatient|Patient
										subjectGroup|Group
										contextEncounter|Encounter
										contextEpisodeOfCare|Episode_Of_Care
										participantMemberPractitioner|Practitioner
										participantMemberRelatedPerson|Related_Person
										participantMemberPatient|Patient
										participantMemberOrganization|Organization
										participantMemberCareTeam|Care_Team
										reasonReference|Condition
										managingOrganization|Organization
										noteAuthorPractitioner|Practitioner
										noteAuthorPatient|Patient
										noteAuthorRelatedPerson|Related_Person
										*/

										myEmitter.prependOnceListener('checkSubjectPatient', function () {
											if (!validator.isEmpty(subjectPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
													if (resSubjectPatient.err_code > 0) {
														myEmitter.emit('checkReasonCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonCode');
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

										myEmitter.prependOnceListener('checkParticipantMemberPractitioner', function () {
											if (!validator.isEmpty(participantMemberPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + participantMemberPractitioner, 'PRACTITIONER', function (resParticipantMemberPractitioner) {
													if (resParticipantMemberPractitioner.err_code > 0) {
														myEmitter.emit('checkContextEpisodeOfCare');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Participant member practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEpisodeOfCare');
											}
										})

										myEmitter.prependOnceListener('checkParticipantMemberRelatedPerson', function () {
											if (!validator.isEmpty(participantMemberRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + participantMemberRelatedPerson, 'RELATED_PERSON', function (resParticipantMemberRelatedPerson) {
													if (resParticipantMemberRelatedPerson.err_code > 0) {
														myEmitter.emit('checkParticipantMemberPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Participant member related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkParticipantMemberPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkParticipantMemberPatient', function () {
											if (!validator.isEmpty(participantMemberPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + participantMemberPatient, 'PATIENT', function (resParticipantMemberPatient) {
													if (resParticipantMemberPatient.err_code > 0) {
														myEmitter.emit('checkParticipantMemberRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Participant member patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkParticipantMemberRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkParticipantMemberOrganization', function () {
											if (!validator.isEmpty(participantMemberOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + participantMemberOrganization, 'ORGANIZATION', function (resParticipantMemberOrganization) {
													if (resParticipantMemberOrganization.err_code > 0) {
														myEmitter.emit('checkParticipantMemberPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Participant member organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkParticipantMemberPatient');
											}
										})

										myEmitter.prependOnceListener('checkParticipantMemberCareTeam', function () {
											if (!validator.isEmpty(participantMemberCareTeam)) {
												checkUniqeValue(apikey, "CARE_TEAM_ID|" + participantMemberCareTeam, 'CARE_TEAM', function (resParticipantMemberCareTeam) {
													if (resParticipantMemberCareTeam.err_code > 0) {
														myEmitter.emit('checkParticipantMemberOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Participant member care team id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkParticipantMemberOrganization');
											}
										})
										
										myEmitter.prependOnceListener('checkParticipantOnBehalfOf', function () {
											if (!validator.isEmpty(participantOnBehalfOf)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + participantOnBehalfOf, 'ORGANIZATION', function (resParticipantOnBehalfOf) {
													if (resParticipantOnBehalfOf.err_code > 0) {
														myEmitter.emit('checkParticipantMemberCareTeam');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Participant On Behalf of organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkParticipantMemberCareTeam');
											}
										})

										myEmitter.prependOnceListener('checkReasonReference', function () {
											if (!validator.isEmpty(reasonReference)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + reasonReference, 'CONDITION', function (resReasonReference) {
													if (resReasonReference.err_code > 0) {
														myEmitter.emit('checkParticipantOnBehalfOf');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkParticipantOnBehalfOf');
											}
										})

										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
											if (!validator.isEmpty(noteAuthorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorPractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
													if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
														myEmitter.emit('checkReasonReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author author reference practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonReference');
											}
										})

										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePatient', function () {
											if (!validator.isEmpty(noteAuthorPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + noteAuthorPatient, 'PATIENT', function (resNoteAuthorAuthorReferencePatient) {
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
											if (!validator.isEmpty(noteAuthorRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + noteAuthorRelatedPerson, 'RELATED_PERSON', function (resNoteAuthorAuthorReferenceRelatedPerson) {
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
										
										if (!validator.isEmpty(managingOrganization)) {
											checkUniqeValue(apikey, "ORGANIZATION_ID|" + managingOrganization, 'ORGANIZATION', function (resManagingOrganization) {
												if (resManagingOrganization.err_code > 0) {
													myEmitter.emit('checkNoteAuthorAuthorReferenceRelatedPerson');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Managing organization id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkNoteAuthorAuthorReferenceRelatedPerson');
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
			var careTeamId = req.params.care_team_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof careTeamId !== 'undefined'){
				if(validator.isEmpty(careTeamId)){
					err_code = 2;
					err_msg = "Care Team id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Team id is required";
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
												checkUniqeValue(apikey, "CARE_TEAM_ID|" + careTeamId, 'CARE_TEAM', function(resCareTeamID){
													if(resCareTeamID.err_code > 0){
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
																							"care_team_id": careTeamId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Care Team.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Care Team Id not found"});		
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
		careTeamParticipant: function addCareTeamParticipant(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var careTeamId = req.params.care_plan_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof careTeamId !== 'undefined'){
				if(validator.isEmpty(careTeamId)){
					err_code = 2;
					err_msg = "Care Team id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Team id is required";
			}
			
			if(typeof req.body.participant.role !== 'undefined'){
				var participantRole =  req.body.participant.role.trim().toLowerCase();
				if(validator.isEmpty(participantRole)){
					participantRole = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant role' in json Care Team request.";
			}

			if(typeof req.body.participant.member.practitioner !== 'undefined'){
				var participantMemberPractitioner =  req.body.participant.member.practitioner.trim().toLowerCase();
				if(validator.isEmpty(participantMemberPractitioner)){
					participantMemberPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member practitioner' in json Care Team request.";
			}

			if(typeof req.body.participant.member.relatedPerson !== 'undefined'){
				var participantMemberRelatedPerson =  req.body.participant.member.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(participantMemberRelatedPerson)){
					participantMemberRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member related person' in json Care Team request.";
			}

			if(typeof req.body.participant.member.patient !== 'undefined'){
				var participantMemberPatient =  req.body.participant.member.patient.trim().toLowerCase();
				if(validator.isEmpty(participantMemberPatient)){
					participantMemberPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member patient' in json Care Team request.";
			}

			if(typeof req.body.participant.member.organization !== 'undefined'){
				var participantMemberOrganization =  req.body.participant.member.organization.trim().toLowerCase();
				if(validator.isEmpty(participantMemberOrganization)){
					participantMemberOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member organization' in json Care Team request.";
			}

			if(typeof req.body.participant.member.careTeam !== 'undefined'){
				var participantMemberCareTeam =  req.body.participant.member.careTeam.trim().toLowerCase();
				if(validator.isEmpty(participantMemberCareTeam)){
					participantMemberCareTeam = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant member care team' in json Care Team request.";
			}

			if(typeof req.body.participant.onBehalfOf !== 'undefined'){
				var participantOnBehalfOf =  req.body.participant.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(participantOnBehalfOf)){
					participantOnBehalfOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'participant on behalf of' in json Care Team request.";
			}

			if (typeof req.body.participant.period !== 'undefined') {
			  var participantPeriod = req.body.participant.period;
 				if(validator.isEmpty(participantPeriod)) {
				  var participantPeriodStart = "";
				  var participantPeriodEnd = "";
				} else {
				  if (participantPeriod.indexOf("to") > 0) {
				    arrParticipantPeriod = participantPeriod.split("to");
				    var participantPeriodStart = arrParticipantPeriod[0];
				    var participantPeriodEnd = arrParticipantPeriod[1];
				    if (!regex.test(participantPeriodStart) && !regex.test(participantPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Care Team participant period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Care Team participant period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'participant period' in json Care Team request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkCareTeamID', function(){
							checkUniqeValue(apikey, "CARE_TEAM_ID|" + careTeamId, 'CARE_TEAM', function(resCareTeamID){
								if(resCareTeamID.err_code > 0){
									var unicId = uniqid.time();
									var careTeamParticipantId = 'ctp' + unicId;
									//CareTeamParticipant
									dataCareTeamParticipant = {
										"participant_id" : careTeamParticipantId,
											"role" : participantRole,
											"member_practitioner" : participantMemberPractitioner,
											"member_related_person" : participantMemberRelatedPerson,
											"member_patient" : participantMemberPatient,
											"member_organization" : participantMemberOrganization,
											"member_care_team" : participantMemberCareTeam,
											"on_behalf_of" : participantOnBehalfOf,
											"period_start" : participantPeriodStart,
											"period_end" : participantPeriodEnd,
											"care_team_id" : careTeamId
									}
									ApiFHIR.post('careTeamParticipant', {"apikey": apikey}, {body: dataCareTeamParticipant, json: true}, function(error, response, body){
										careTeamParticipant = body;
										if(careTeamParticipant.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Care Team Participant has been add in this Care Team.", "data": careTeamParticipant.data});
										}else{
											res.json(careTeamParticipant);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Care Team Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkParticipantRole', function () {
							if (!validator.isEmpty(participantRole)) {
								checkCode(apikey, participantRole, 'PARTICIPANT_ROLE', function (resParticipantRoleCode) {
									if (resParticipantRoleCode.err_code > 0) {
										myEmitter.emit('checkCareTeamID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Participant role code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCareTeamID');
							}
						})
						
						myEmitter.prependOnceListener('checkParticipantMemberPractitioner', function () {
							if (!validator.isEmpty(participantMemberPractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + participantMemberPractitioner, 'PRACTITIONER', function (resParticipantMemberPractitioner) {
									if (resParticipantMemberPractitioner.err_code > 0) {
										myEmitter.emit('checkParticipantRole');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Participant member practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkParticipantRole');
							}
						})

						myEmitter.prependOnceListener('checkParticipantMemberRelatedPerson', function () {
							if (!validator.isEmpty(participantMemberRelatedPerson)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + participantMemberRelatedPerson, 'RELATED_PERSON', function (resParticipantMemberRelatedPerson) {
									if (resParticipantMemberRelatedPerson.err_code > 0) {
										myEmitter.emit('checkParticipantMemberPractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Participant member related person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkParticipantMemberPractitioner');
							}
						})

						myEmitter.prependOnceListener('checkParticipantMemberPatient', function () {
							if (!validator.isEmpty(participantMemberPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + participantMemberPatient, 'PATIENT', function (resParticipantMemberPatient) {
									if (resParticipantMemberPatient.err_code > 0) {
										myEmitter.emit('checkParticipantMemberRelatedPerson');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Participant member patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkParticipantMemberRelatedPerson');
							}
						})

						myEmitter.prependOnceListener('checkParticipantMemberOrganization', function () {
							if (!validator.isEmpty(participantMemberOrganization)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + participantMemberOrganization, 'ORGANIZATION', function (resParticipantMemberOrganization) {
									if (resParticipantMemberOrganization.err_code > 0) {
										myEmitter.emit('checkParticipantMemberPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Participant member organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkParticipantMemberPatient');
							}
						})

						myEmitter.prependOnceListener('checkParticipantMemberCareTeam', function () {
							if (!validator.isEmpty(participantMemberCareTeam)) {
								checkUniqeValue(apikey, "CARE_TEAM_ID|" + participantMemberCareTeam, 'CARE_TEAM', function (resParticipantMemberCareTeam) {
									if (resParticipantMemberCareTeam.err_code > 0) {
										myEmitter.emit('checkParticipantMemberOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Participant member care team id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkParticipantMemberOrganization');
							}
						})

						if (!validator.isEmpty(participantOnBehalfOf)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + participantOnBehalfOf, 'ORGANIZATION', function (resParticipantOnBehalfOf) {
								if (resParticipantOnBehalfOf.err_code > 0) {
									myEmitter.emit('checkParticipantMemberCareTeam');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Participant On Behalf of organization id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkParticipantMemberCareTeam');
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
		careTeamNote: function addCareTeamNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var careTeamId = req.params.care_team_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof careTeamId !== 'undefined'){
				if(validator.isEmpty(careTeamId)){
					err_code = 2;
					err_msg = "CareTeam id is required";
				}
			}else{
				err_code = 2;
				err_msg = "CareTeam id is required";
			}
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Care Team request.";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Care Team request.";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Care Team request.";
			}

			if(typeof req.body.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Care Team request.";
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
				err_msg = "Please add sub-key 'note time' in json Care Team request.";
			}

			if(typeof req.body.string !== 'undefined'){
				var noteString =  req.body.string.trim().toLowerCase();
				if(validator.isEmpty(noteString)){
					noteString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note string' in json Care Team request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkCareTeamID', function(){
							checkUniqeValue(apikey, "care_team_id|" + careTeamId, 'care_team', function(resCareTeamID){
								if(resCareTeamID.err_code > 0){
									var unicId = uniqid.time();
									var careTeamNoteId = 'ann' + unicId;
									//CareTeamNote
									dataCareTeamNote = {
										"id": careTeamNoteId,
										"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
										"author_ref_patient": noteAuthorAuthorReferencePatient,
										"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
										"author_string": noteAuthorAuthorString,
										"time": noteTime,
										"text": noteString,
										"care_team_id" : careTeamId
									}
									ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataCareTeamNote, json: true}, function(error, response, body){
										careTeamNote = body;
										if(careTeamNote.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Care Team Note has been add in this Care Team.", "data": careTeamNote.data});
										}else{
											res.json(careTeamNote);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "CareTeam Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkCareTeamID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCareTeamID');
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
	},
	put: {
		careTeam : function putCareTeam(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var careTeamId = req.params.adverse_event_id;

      var err_code = 0;
      var err_msg = "";
      var dataCareTeam = {};

			if(typeof careTeamId !== 'undefined'){
				if(validator.isEmpty(careTeamId)){
					err_code = 2;
					err_msg = "Care Team id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Team id is required";
			}
			
			/*
			var status  = req.body.status;
			var category  = req.body.category;
			var name  = req.body.name;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var period_start  = req.body.period_start;
			var period_end  = req.body.period_end;
			var reason_code  = req.body.reason_code;
			*/

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					dataCareTeam.status = "";
				}else{
					dataCareTeam.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					dataCareTeam.category = "";
				}else{
					dataCareTeam.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.name !== 'undefined' && req.body.name !== ""){
				var name =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(name)){
					dataCareTeam.name = "";
				}else{
					dataCareTeam.name = name;
				}
			}else{
			  name = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataCareTeam.subject_patient = "";
				}else{
					dataCareTeam.subject_patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataCareTeam.subject_group = "";
				}else{
					dataCareTeam.subject_group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					dataCareTeam.context_encounter = "";
				}else{
					dataCareTeam.context_encounter = contextEncounter;
				}
			}else{
			  contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					dataCareTeam.context_episode_of_care = "";
				}else{
					dataCareTeam.context_episode_of_care = contextEpisodeOfCare;
				}
			}else{
			  contextEpisodeOfCare = "";
			}

			if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
			  var period = req.body.period;
			  if (period.indexOf("to") > 0) {
			    arrPeriod = period.split("to");
			    dataCareTeam.period_start = arrPeriod[0];
			    dataCareTeam.period_end = arrPeriod[1];
			    if (!regex.test(periodStart) && !regex.test(periodEnd)) {
			      err_code = 2;
			      err_msg = "care team period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "care team period invalid date format.";
				}
			} else {
			  period = "";
			}

			if(typeof req.body.reasonCode !== 'undefined' && req.body.reasonCode !== ""){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					dataCareTeam.reason_code = "";
				}else{
					dataCareTeam.reason_code = reasonCode;
				}
			}else{
			  reasonCode = "";
			}

			/*if(typeof req.body.reasonReference !== 'undefined' && req.body.reasonReference !== ""){
				var reasonReference =  req.body.reasonReference.trim().toLowerCase();
				if(validator.isEmpty(reasonReference)){
					dataCareTeam.reason_reference = "";
				}else{
					dataCareTeam.reason_reference = reasonReference;
				}
			}else{
			  reasonReference = "";
			}

			if(typeof req.body.managingOrganization !== 'undefined' && req.body.managingOrganization !== ""){
				var managingOrganization =  req.body.managingOrganization.trim().toLowerCase();
				if(validator.isEmpty(managingOrganization)){
					dataCareTeam.managing_organization = "";
				}else{
					dataCareTeam.managing_organization = managingOrganization;
				}
			}else{
			  managingOrganization = "";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined' && req.body.note.author.authorReference.practitioner !== ""){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					dataCareTeam.practitioner = "";
				}else{
					dataCareTeam.practitioner = noteAuthorPractitioner;
				}
			}else{
			  noteAuthorPractitioner = "";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined' && req.body.note.author.authorReference.patient !== ""){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					dataCareTeam.patient = "";
				}else{
					dataCareTeam.patient = noteAuthorPatient;
				}
			}else{
			  noteAuthorPatient = "";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined' && req.body.note.author.authorReference.relatedPerson !== ""){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					dataCareTeam.related_person = "";
				}else{
					dataCareTeam.related_person = noteAuthorRelatedPerson;
				}
			}else{
			  noteAuthorRelatedPerson = "";
			}

			if(typeof req.body.note.author.authorString !== 'undefined' && req.body.note.author.authorString !== ""){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					dataCareTeam.author_string = "";
				}else{
					dataCareTeam.author_string = noteAuthorAuthorString;
				}
			}else{
			  noteAuthorAuthorString = "";
			}

			if(typeof req.body.note.time !== 'undefined' && req.body.note.time !== ""){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					err_code = 2;
					err_msg = "care team note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "care team note time invalid date format.";	
					}else{
						dataCareTeam.time = noteTime;
					}
				}
			}else{
			  noteTime = "";
			}

			if(typeof req.body.note.text !== 'undefined' && req.body.note.text !== ""){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					dataCareTeam.text = "";
				}else{
					dataCareTeam.text = noteText;
				}
			}else{
			  noteText = "";
			}*/

			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkCareTeamId', function(){
						checkUniqeValue(apikey, "CARE_TEAM_ID|" + careTeamId, 'CARE_TEAM', function(resCarePlanId){
							if(resCarePlanId.err_code > 0){
								ApiFHIR.put('careTeam', {"apikey": apikey, "_id": careTeamId}, {body: dataCareTeam, json: true}, function(error, response, body){
									careTeam = body;
									if(careTeam.err_code > 0){
										res.json(careTeam);	
									}else{
										res.json({"err_code": 0, "err_msg": "Care Team has been update.", "data": [{"_id": careTeamId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Care Team Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkStatus', function () {
						if (!validator.isEmpty(status)) {
							checkCode(apikey, status, 'CARE_TEAM_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) {
									myEmitter.emit('checkCareTeamId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCareTeamId');
						}
					})

					myEmitter.prependOnceListener('checkCategory', function () {
						if (!validator.isEmpty(category)) {
							checkCode(apikey, category, 'CARE_TEAM_CATEGORY', function (resCategoryCode) {
								if (resCategoryCode.err_code > 0) {
									myEmitter.emit('checkStatus');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Category code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkStatus');
						}
					})

					myEmitter.prependOnceListener('checkReasonCode', function () {
						if (!validator.isEmpty(reasonCode)) {
							checkCode(apikey, reasonCode, 'CLINICAL_FINDINGS', function (resReasonCodeCode) {
								if (resReasonCodeCode.err_code > 0) {
									myEmitter.emit('checkCategory');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Reason code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCategory');
						}
					})
					
					myEmitter.prependOnceListener('checkSubjectPatient', function () {
						if (!validator.isEmpty(subjectPatient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
								if (resSubjectPatient.err_code > 0) {
									myEmitter.emit('checkReasonCode');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkReasonCode');
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
			var careTeamId = req.params.care_team_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof careTeamId !== 'undefined'){
				if(validator.isEmpty(careTeamId)){
					err_code = 2;
					err_msg = "Care Team id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Team id is required";
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
						myEmitter.prependOnceListener('checkCareTeamID', function(){
							checkUniqeValue(apikey, "CARE_TEAM_ID|" + careTeamId, 'CARE_TEAM', function(resCareTeamID){
								if(resCareTeamID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "CARE_TEAM_ID|"+careTeamId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Care Team.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Care Team Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkCareTeamID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkCareTeamID');				
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
		careTeamParticipant: function updateCareTeamParticipant(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var careTeamId = req.params.care_team_id;
			var careTeamParticipantId = req.params.care_team_participant_id;

			var err_code = 0;
			var err_msg = "";
			var dataCarePlan = {};
			//input check 
			if(typeof careTeamId !== 'undefined'){
				if(validator.isEmpty(careTeamId)){
					err_code = 2;
					err_msg = "Care Team id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Team id is required";
			}

			if(typeof careTeamParticipantId !== 'undefined'){
				if(validator.isEmpty(careTeamParticipantId)){
					err_code = 2;
					err_msg = "Care Team Participant id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Team Participant id is required";
			}
			
			/*
			var role  = req.body.role;
			var member_practitioner  = req.body.member_practitioner;
			var member_related_person  = req.body.member_related_person;
			var member_patient  = req.body.member_patient;
			var member_organization  = req.body.member_organization;
			var member_care_team  = req.body.member_care_team;
			var on_behalf_of  = req.body.on_behalf_of;
			var period_start  = req.body.period_start;
			var period_end  = req.body.period_end;
			*/
			
			if(typeof req.body.role !== 'undefined' && req.body.role !== ""){
				var participantRole =  req.body.role.trim().toLowerCase();
				if(validator.isEmpty(participantRole)){
					dataCareTeam.role = "";
				}else{
					dataCareTeam.role = participantRole;
				}
			}else{
			  participantRole = "";
			}

			if(typeof req.body.member.practitioner !== 'undefined' && req.body.member.practitioner !== ""){
				var participantMemberPractitioner =  req.body.member.practitioner.trim().toLowerCase();
				if(validator.isEmpty(participantMemberPractitioner)){
					dataCareTeam.member_practitioner = "";
				}else{
					dataCareTeam.member_practitioner = participantMemberPractitioner;
				}
			}else{
			  participantMemberPractitioner = "";
			}

			if(typeof req.body.member.relatedPerson !== 'undefined' && req.body.member.relatedPerson !== ""){
				var participantMemberRelatedPerson =  req.body.member.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(participantMemberRelatedPerson)){
					dataCareTeam.member_related_person = "";
				}else{
					dataCareTeam.member_related_person = participantMemberRelatedPerson;
				}
			}else{
			  participantMemberRelatedPerson = "";
			}

			if(typeof req.body.member.patient !== 'undefined' && req.body.member.patient !== ""){
				var participantMemberPatient =  req.body.member.patient.trim().toLowerCase();
				if(validator.isEmpty(participantMemberPatient)){
					dataCareTeam.member_patient = "";
				}else{
					dataCareTeam.member_patient = participantMemberPatient;
				}
			}else{
			  participantMemberPatient = "";
			}

			if(typeof req.body.member.organization !== 'undefined' && req.body.member.organization !== ""){
				var participantMemberOrganization =  req.body.member.organization.trim().toLowerCase();
				if(validator.isEmpty(participantMemberOrganization)){
					dataCareTeam.member_organization = "";
				}else{
					dataCareTeam.member_organization = participantMemberOrganization;
				}
			}else{
			  participantMemberOrganization = "";
			}

			if(typeof req.body.member.careTeam !== 'undefined' && req.body.member.careTeam !== ""){
				var participantMemberCareTeam =  req.body.member.careTeam.trim().toLowerCase();
				if(validator.isEmpty(participantMemberCareTeam)){
					dataCareTeam.member_care_team = "";
				}else{
					dataCareTeam.member_care_team = participantMemberCareTeam;
				}
			}else{
			  participantMemberCareTeam = "";
			}

			if(typeof req.body.onBehalfOf !== 'undefined' && req.body.onBehalfOf !== ""){
				var participantOnBehalfOf =  req.body.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(participantOnBehalfOf)){
					dataCareTeam.on_behalf_of = "";
				}else{
					dataCareTeam.on_behalf_of = participantOnBehalfOf;
				}
			}else{
			  participantOnBehalfOf = "";
			}

			if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
			  var participantPeriod = req.body.period;
			  if (participantPeriod.indexOf("to") > 0) {
			    arrParticipantPeriod = participantPeriod.split("to");
			    dataCareTeam.period_start = arrParticipantPeriod[0];
			    dataCareTeam.period_end = arrParticipantPeriod[1];
			    if (!regex.test(participantPeriodStart) && !regex.test(participantPeriodEnd)) {
			      err_code = 2;
			      err_msg = "care team participant period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "care team participant period invalid date format.";
				}
			} else {
			  participantPeriod = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkCareTeamID', function(){
							checkUniqeValue(apikey, "CARE_TEAM_ID|" + careTeamId, 'CARE_TEAM', function(resCarePlanId){
								if(resCarePlanId.err_code > 0){
									checkUniqeValue(apikey, "PARTICIPANT_ID|" + careTeamParticipantId, 'CARE_TEAM_PARTICIPANT', function(resCareTeamParticipantID){
										if(resCareTeamParticipantID.err_code > 0){
											ApiFHIR.put('careTeamParticipant', {"apikey": apikey, "_id": careTeamParticipantId, "dr": "CARE_TEAM_ID|"+careTeamId}, {body: dataCareTeam, json: true}, function(error, response, body){
												careTeamParticipant = body;
												if(careTeamParticipant.err_code > 0){
													res.json(careTeamParticipant);	
												}else{
													res.json({"err_code": 0, "err_msg": "Care Team Participant has been update in this Care Team.", "data": careTeamParticipant.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Care Team Participant Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Care Team Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkParticipantRole', function () {
							if (!validator.isEmpty(participantRole)) {
								checkCode(apikey, participantRole, 'PARTICIPANT_ROLE', function (resParticipantRoleCode) {
									if (resParticipantRoleCode.err_code > 0) {
										myEmitter.emit('checkCareTeamID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Participant role code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCareTeamID');
							}
						})
						
						myEmitter.prependOnceListener('checkParticipantMemberPractitioner', function () {
							if (!validator.isEmpty(participantMemberPractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + participantMemberPractitioner, 'PRACTITIONER', function (resParticipantMemberPractitioner) {
									if (resParticipantMemberPractitioner.err_code > 0) {
										myEmitter.emit('checkParticipantRole');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Participant member practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkParticipantRole');
							}
						})

						myEmitter.prependOnceListener('checkParticipantMemberRelatedPerson', function () {
							if (!validator.isEmpty(participantMemberRelatedPerson)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + participantMemberRelatedPerson, 'RELATED_PERSON', function (resParticipantMemberRelatedPerson) {
									if (resParticipantMemberRelatedPerson.err_code > 0) {
										myEmitter.emit('checkParticipantMemberPractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Participant member related person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkParticipantMemberPractitioner');
							}
						})

						myEmitter.prependOnceListener('checkParticipantMemberPatient', function () {
							if (!validator.isEmpty(participantMemberPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + participantMemberPatient, 'PATIENT', function (resParticipantMemberPatient) {
									if (resParticipantMemberPatient.err_code > 0) {
										myEmitter.emit('checkParticipantMemberRelatedPerson');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Participant member patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkParticipantMemberRelatedPerson');
							}
						})

						myEmitter.prependOnceListener('checkParticipantMemberOrganization', function () {
							if (!validator.isEmpty(participantMemberOrganization)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + participantMemberOrganization, 'ORGANIZATION', function (resParticipantMemberOrganization) {
									if (resParticipantMemberOrganization.err_code > 0) {
										myEmitter.emit('checkParticipantMemberPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Participant member organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkParticipantMemberPatient');
							}
						})

						myEmitter.prependOnceListener('checkParticipantMemberCareTeam', function () {
							if (!validator.isEmpty(participantMemberCareTeam)) {
								checkUniqeValue(apikey, "CARE_TEAM_ID|" + participantMemberCareTeam, 'CARE_TEAM', function (resParticipantMemberCareTeam) {
									if (resParticipantMemberCareTeam.err_code > 0) {
										myEmitter.emit('checkParticipantMemberOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Participant member care team id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkParticipantMemberOrganization');
							}
						})

						if (!validator.isEmpty(participantOnBehalfOf)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + participantOnBehalfOf, 'ORGANIZATION', function (resParticipantOnBehalfOf) {
								if (resParticipantOnBehalfOf.err_code > 0) {
									myEmitter.emit('checkParticipantMemberCareTeam');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Participant On Behalf of organization id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkParticipantMemberCareTeam');
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
		careTeamNote: function updateCareTeamNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var careTeamId = req.params.care_team_id;
			var careTeamNoteId = req.params.care_team_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataCareTeam = {};
			//input check 
			if(typeof careTeamId !== 'undefined'){
				if(validator.isEmpty(careTeamId)){
					err_code = 2;
					err_msg = "Care Team id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Team id is required";
			}

			if(typeof careTeamNoteId !== 'undefined'){
				if(validator.isEmpty(careTeamNoteId)){
					err_code = 2;
					err_msg = "Care Team Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Team Note id is required";
			}
			
			/*
			"id": careTeamNoteId,
			"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
			"author_ref_patient": noteAuthorAuthorReferencePatient,
			"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
			"author_string": noteAuthorAuthorString,
			"time": noteTime,
			"text": noteString,
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
					err_msg = "care team note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "care team note time invalid date format.";	
					}else{
						dataSequence.time = noteTime;
					}
				}
			}else{
			  noteTime = "";
			}

			if(typeof req.body.string !== 'undefined' && req.body.string !== ""){
				var noteString =  req.body.string.trim().toLowerCase();
				if(validator.isEmpty(noteString)){
					dataSequence.text = "";
				}else{
					dataSequence.text = noteString;
				}
			}else{
			  noteString = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkCareTeamID', function(){
							checkUniqeValue(apikey, "care_team_id|" + careTeamId, 'care_team', function(resCareTeamId){
								if(resCareTeamId.err_code > 0){
									checkUniqeValue(apikey, "NOTE_ID|" + careTeamNoteId, 'NOTE', function(resCareTeamNoteID){
										if(resCareTeamNoteID.err_code > 0){
											ApiFHIR.put('annotation', {"apikey": apikey, "_id": careTeamNoteId, "dr": "care_team_id|"+careTeamId}, {body: dataCareTeam, json: true}, function(error, response, body){
												careTeamNote = body;
												if(careTeamNote.err_code > 0){
													res.json(careTeamNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Care Team Note has been update in this Care Team.", "data": careTeamNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Care Team Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Care Team Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkCareTeamID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCareTeamID');
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