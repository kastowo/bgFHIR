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
		goal : function getGoal(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var goalId = req.query._id;
			var category = req.query.category;
			var identifier = req.query.identifier;
			var patient = req.query.patient;
			var start_date = req.query.startDate;
			var status = req.query.status;
			var subject = req.query.subject;
			var target_date = req.query.targetDate;
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
			
			if(typeof goalId !== 'undefined'){
				if(!validator.isEmpty(goalId)){
					qString._id = goalId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Goal Id is required."});
				}
			}
			
			if(typeof category !== 'undefined'){
				if(!validator.isEmpty(category)){
					qString.category = category; 
				}else{
					res.json({"err_code": 1, "err_msg": "Category is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "Identifier is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "Patient is empty."});
				}
			}

			if(typeof start_date !== 'undefined'){
				if(!validator.isEmpty(start_date)){
					if(!regex.test(start_date)){
						res.json({"err_code": 1, "err_msg": "Start date invalid format."});
					}else{
						qString.start_date = start_date; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Start date is empty."});
				}
			}

			if(typeof status !== 'undefined'){
				if(!validator.isEmpty(status)){
					qString.status = status; 
				}else{
					res.json({"err_code": 1, "err_msg": "Status is empty."});
				}
			}

			if(typeof subject !== 'undefined'){
				if(!validator.isEmpty(subject)){
					qString.subject = subject; 
				}else{
					res.json({"err_code": 1, "err_msg": "Subject is empty."});
				}
			}

			if(typeof target_date !== 'undefined'){
				if(!validator.isEmpty(target_date)){
					if(!regex.test(target_date)){
						res.json({"err_code": 1, "err_msg": "Target date invalid format."});
					}else{
						qString.target_date = target_date; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Target date is empty."});
				}
			}

			seedPhoenixFHIR.path.GET = {
				"Goal" : {
					"location": "%(apikey)s/Goal",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('Goal', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var goal = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(goal.err_code == 0){
								//cek jumdata dulu
								if(goal.data.length > 0){
									newGoal = [];
									for(i=0; i < goal.data.length; i++){
										myEmitter.once("getIdentifier", function(goal, index, newGoal, countGoal){
											/*console.log(goal);*/
											//get identifier
											qString = {};
											qString.goal_id = goal.id;
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
													var objectGoal = {};
													objectGoal.resourceType = goal.resourceType;
													objectGoal.id = goal.id;
													objectGoal.identifier = identifier.data;
													objectGoal.status = goal.status;
													objectGoal.category = goal.category;
													objectGoal.priority = goal.priority;
													objectGoal.description = goal.description;
													objectGoal.subject = goal.subject;
													objectGoal.start = goal.start;
													objectGoal.statusDate = goal.statusDate;
													objectGoal.statusReason = goal.statusReason;
													objectGoal.expressedBy = goal.expressedBy;
													objectGoal.outcomeCode = goal.outcomeCode;
												
													newGoal[index] = objectGoal;

													myEmitter.once('getGoalTarget', function(goal, index, newGoal, countGoal){
														qString = {};
														qString.goal_id = goal.id;
														seedPhoenixFHIR.path.GET = {
															"GoalTarget" : {
																"location": "%(apikey)s/GoalTarget",
																"query": qString
															}
														}

														var ApiFHIR = new Apiclient(seedPhoenixFHIR);

														ApiFHIR.get('GoalTarget', {"apikey": apikey}, {}, function(error, response, body){
															goalTarget = JSON.parse(body);
															if(goalTarget.err_code == 0){
																var objectGoal = {};
																objectGoal.resourceType = goal.resourceType;
																objectGoal.id = goal.id;
																objectGoal.identifier = goal.identifier;
																objectGoal.status = goal.status;
																objectGoal.category = goal.category;
																objectGoal.priority = goal.priority;
																objectGoal.description = goal.description;
																objectGoal.subject = goal.subject;
																objectGoal.start = goal.start;
																objectGoal.target = goalTarget.data;
																objectGoal.statusDate = goal.statusDate;
																objectGoal.statusReason = goal.statusReason;
																objectGoal.expressedBy = goal.expressedBy;
																objectGoal.outcomeCode = goal.outcomeCode;
																newGoal[index] = objectGoal;
																if(index == countGoal -1 ){
																	res.json({"err_code": 0, "data":newGoal});
																}
															}else{
																res.json(goalTarget);			
															}
														})
													})
													myEmitter.emit('getGoalTarget', objectGoal, index, newGoal, countGoal);
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", goal.data[i], i, newGoal, goal.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Goal is empty."});	
								}
							}else{
								res.json(goal);
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
					var goalId = req.params.goal_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "GOAL_ID|" + goalId, 'GOAL', function(resGoalID){
								if(resGoalID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.goal_id = goalId;
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
						  			qString.goal_id = goalId;
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
									res.json({"err_code": 501, "err_msg": "Goal Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		goalTarget: function getGoalTarget(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var goalId = req.params.goal_id;
			var goalTargetId = req.params.goal_target_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "GOAL_ID|" + goalId, 'GOAL', function(resGoal){
						if(resGoal.err_code > 0){
							if(typeof goalTargetId !== 'undefined' && !validator.isEmpty(goalTargetId)){
								checkUniqeValue(apikey, "TARGET_ID|" + goalTargetId, 'GOAL_TARGET', function(resGoalTargetID){
									if(resGoalTargetID.err_code > 0){
										//get goalTarget
										qString = {};
										qString.goal_id = goalId;
										qString._id = goalTargetId;
										seedPhoenixFHIR.path.GET = {
											"GoalTarget" : {
												"location": "%(apikey)s/GoalTarget",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('GoalTarget', {"apikey": apikey}, {}, function(error, response, body){
											goalTarget = JSON.parse(body);
											if(goalTarget.err_code == 0){
												res.json({"err_code": 0, "data":goalTarget.data});	
											}else{
												res.json(goalTarget);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Goal Target Id not found"});		
									}
								})
							}else{
								//get goalTarget
								qString = {};
								qString.goal_id = goalId;
								seedPhoenixFHIR.path.GET = {
									"GoalTarget" : {
										"location": "%(apikey)s/GoalTarget",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('GoalTarget', {"apikey": apikey}, {}, function(error, response, body){
									goalTarget = JSON.parse(body);
									if(goalTarget.err_code == 0){
										res.json({"err_code": 0, "data":goalTarget.data});	
									}else{
										res.json(goalTarget);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Goal Id not found"});		
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
		goal : function addGoal(req, res){
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
status|status||nn
category|category||
priority|priority||
description|description||nn
subject.patient|subjectPatient||
subject.group|subjectGroup||
subject.organization|subjectOrganization||
start.startDate|startStartDate|date|
start.startCodeableConcept|startStartCodeableConcept||
target.measure|targetMeasure||
target.detail.detailQuantity|targetDetailDetailQuantity||
target.detail.detailRange|targetDetailDetailRange|range|
target.detail.detailCodeableConcept|targetDetailDetailCodeableConcept||
target.due.dueDate|targetDueDueDate|date|
target.due.dueDuration|targetDueDueDuration|integer|
statusDate|statusDate|date|
statusReason|statusReason||
expressedBy.patient|expressedByPatient||
expressedBy.practitioner|expressedByPractitioner||
expressedBy.relatedPerson|expressedByRelatedPerson||
addresses.condition|addressesCondition||
addresses.observation|addressesObservation||
addresses.medicationStatement|addressesMedicationStatement||
addresses.nutritionOrder|addressesNutritionOrder||
addresses.procedureRequest|addressesProcedureRequest||
addresses.riskAssessment|addressesRiskAssessment||
note.author.authorReference.practitioner|noteAuthorPractitioner||
note.author.authorReference.patient|noteAuthorPatient||
note.author.authorReference.relatedPerson|noteAuthorRelatedPerson||
note.author.authorString|noteAuthorAuthorString||
note.time|noteTime|date|
note.text|noteText||
outcomeCode|outcomeCode||
outcomeReference|outcomeReference||
*/
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Goal status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Goal request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Goal request.";
			}

			if(typeof req.body.priority !== 'undefined'){
				var priority =  req.body.priority.trim().toLowerCase();
				if(validator.isEmpty(priority)){
					priority = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'priority' in json Goal request.";
			}

			if(typeof req.body.description !== 'undefined'){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					err_code = 2;
					err_msg = "Goal description is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json Goal request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Goal request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Goal request.";
			}

			if(typeof req.body.subject.organization !== 'undefined'){
				var subjectOrganization =  req.body.subject.organization.trim().toLowerCase();
				if(validator.isEmpty(subjectOrganization)){
					subjectOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject organization' in json Goal request.";
			}

			if(typeof req.body.start.startDate !== 'undefined'){
				var startStartDate =  req.body.start.startDate;
				if(validator.isEmpty(startStartDate)){
					startStartDate = "";
				}else{
					if(!regex.test(startStartDate)){
						err_code = 2;
						err_msg = "Goal start start date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'start start date' in json Goal request.";
			}

			if(typeof req.body.start.startCodeableConcept !== 'undefined'){
				var startStartCodeableConcept =  req.body.start.startCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(startStartCodeableConcept)){
					startStartCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'start start codeable concept' in json Goal request.";
			}

			if(typeof req.body.target.measure !== 'undefined'){
				var targetMeasure =  req.body.target.measure.trim().toLowerCase();
				if(validator.isEmpty(targetMeasure)){
					targetMeasure = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'target measure' in json Goal request.";
			}

			if(typeof req.body.target.detail.detailQuantity !== 'undefined'){
				var targetDetailDetailQuantity =  req.body.target.detail.detailQuantity.trim().toLowerCase();
				if(validator.isEmpty(targetDetailDetailQuantity)){
					targetDetailDetailQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'target detail detail quantity' in json Goal request.";
			}

			if (typeof req.body.target.detail.detailRange !== 'undefined') {
			  var targetDetailDetailRange = req.body.target.detail.detailRange;
 				if(validator.isEmpty(targetDetailDetailRange)){
				  var targetDetailDetailRangeLow = "";
				  var targetDetailDetailRangeHigh = "";
				} else {
				  if (targetDetailDetailRange.indexOf("to") > 0) {
				    arrTargetDetailDetailRange = targetDetailDetailRange.split("to");
				    var targetDetailDetailRangeLow = arrTargetDetailDetailRange[0];
				    var targetDetailDetailRangeHigh = arrTargetDetailDetailRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Goal target detail detail range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'target detail detail range' in json Goal request.";
			}

			if(typeof req.body.target.detail.detailCodeableConcept !== 'undefined'){
				var targetDetailDetailCodeableConcept =  req.body.target.detail.detailCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(targetDetailDetailCodeableConcept)){
					targetDetailDetailCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'target detail detail codeable concept' in json Goal request.";
			}

			if(typeof req.body.target.due.dueDate !== 'undefined'){
				var targetDueDueDate =  req.body.target.due.dueDate;
				if(validator.isEmpty(targetDueDueDate)){
					targetDueDueDate = "";
				}else{
					if(!regex.test(targetDueDueDate)){
						err_code = 2;
						err_msg = "Goal target due due date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'target due due date' in json Goal request.";
			}

			if(typeof req.body.target.due.dueDuration !== 'undefined'){
				var targetDueDueDuration =  req.body.target.due.dueDuration;
				if(validator.isEmpty(targetDueDueDuration)){
					targetDueDueDuration = "";
				}else{
					if(!validator.isInt(targetDueDueDuration)){
						err_code = 2;
						err_msg = "Goal target due due duration is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'target due due duration' in json Goal request.";
			}

			if(typeof req.body.statusDate !== 'undefined'){
				var statusDate =  req.body.statusDate;
				if(validator.isEmpty(statusDate)){
					statusDate = "";
				}else{
					if(!regex.test(statusDate)){
						err_code = 2;
						err_msg = "Goal status date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status date' in json Goal request.";
			}

			if(typeof req.body.statusReason !== 'undefined'){
				var statusReason =  req.body.statusReason.trim().toLowerCase();
				if(validator.isEmpty(statusReason)){
					statusReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status reason' in json Goal request.";
			}

			if(typeof req.body.expressedBy.patient !== 'undefined'){
				var expressedByPatient =  req.body.expressedBy.patient.trim().toLowerCase();
				if(validator.isEmpty(expressedByPatient)){
					expressedByPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'expressed by patient' in json Goal request.";
			}

			if(typeof req.body.expressedBy.practitioner !== 'undefined'){
				var expressedByPractitioner =  req.body.expressedBy.practitioner.trim().toLowerCase();
				if(validator.isEmpty(expressedByPractitioner)){
					expressedByPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'expressed by practitioner' in json Goal request.";
			}

			if(typeof req.body.expressedBy.relatedPerson !== 'undefined'){
				var expressedByRelatedPerson =  req.body.expressedBy.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(expressedByRelatedPerson)){
					expressedByRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'expressed by related person' in json Goal request.";
			}

			if(typeof req.body.addresses.condition !== 'undefined'){
				var addressesCondition =  req.body.addresses.condition.trim().toLowerCase();
				if(validator.isEmpty(addressesCondition)){
					addressesCondition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'addresses condition' in json Goal request.";
			}

			if(typeof req.body.addresses.observation !== 'undefined'){
				var addressesObservation =  req.body.addresses.observation.trim().toLowerCase();
				if(validator.isEmpty(addressesObservation)){
					addressesObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'addresses observation' in json Goal request.";
			}

			if(typeof req.body.addresses.medicationStatement !== 'undefined'){
				var addressesMedicationStatement =  req.body.addresses.medicationStatement.trim().toLowerCase();
				if(validator.isEmpty(addressesMedicationStatement)){
					addressesMedicationStatement = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'addresses medication statement' in json Goal request.";
			}

			if(typeof req.body.addresses.nutritionOrder !== 'undefined'){
				var addressesNutritionOrder =  req.body.addresses.nutritionOrder.trim().toLowerCase();
				if(validator.isEmpty(addressesNutritionOrder)){
					addressesNutritionOrder = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'addresses nutrition order' in json Goal request.";
			}

			if(typeof req.body.addresses.procedureRequest !== 'undefined'){
				var addressesProcedureRequest =  req.body.addresses.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(addressesProcedureRequest)){
					addressesProcedureRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'addresses procedure request' in json Goal request.";
			}

			if(typeof req.body.addresses.riskAssessment !== 'undefined'){
				var addressesRiskAssessment =  req.body.addresses.riskAssessment.trim().toLowerCase();
				if(validator.isEmpty(addressesRiskAssessment)){
					addressesRiskAssessment = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'addresses risk assessment' in json Goal request.";
			}
			
			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					noteAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Goal request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					noteAuthorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Goal request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					noteAuthorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Goal request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Goal request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Goal note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Goal request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note text' in json Goal request.";
			}

			if(typeof req.body.outcomeCode !== 'undefined'){
				var outcomeCode =  req.body.outcomeCode.trim().toLowerCase();
				if(validator.isEmpty(outcomeCode)){
					outcomeCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'outcome code' in json Goal request.";
			}

			if(typeof req.body.outcomeReference !== 'undefined'){
				var outcomeReference =  req.body.outcomeReference.trim().toLowerCase();
				if(validator.isEmpty(outcomeReference)){
					outcomeReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'outcome reference' in json Goal request.";
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
														var goalId = 'goa' + unicId;
														var goalTargetId = 'got' + unicId;
														var noteId = 'ago' + unicId;
												
														dataGoal = {
															"goal_id" : goalId,
															"status" : status,
															"category" : category,
															"priority" : priority,
															"description" : description,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"subject_organization" : subjectOrganization,
															"start_date" : startStartDate,
															"start_codeable_concept" : startStartCodeableConcept,
															"status_date" : statusDate,
															"status_reason" : statusReason,
															"expressed_by_patient" : expressedByPatient,
															"expressed_by_practitioner" : expressedByPractitioner,
															"expressed_by_related_person" : expressedByRelatedPerson,
															"outcome_code" : outcomeCode
														}
														console.log(dataGoal);
														ApiFHIR.post('goal', {"apikey": apikey}, {body: dataGoal, json: true}, function(error, response, body){
															goal = body;
															if(goal.err_code > 0){
																res.json(goal);	
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
																							"goal_id": goalId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
													
														//GoalTarget
														dataGoalTarget = {
															"target_id" : goalTargetId,
															"measure" : targetMeasure,
															"detail_quantity" : targetDetailDetailQuantity,
															"detail_range_low" : targetDetailDetailRangeLow,
															"detail_range_high" : targetDetailDetailRangeHigh,
															"detail_codeable_concept" : targetDetailDetailCodeableConcept,
															"due_date" : targetDueDueDate,
															"due_duration" : targetDueDueDuration,
															"goal_id" : goalId
														}
														ApiFHIR.post('goalTarget', {"apikey": apikey}, {body: dataGoalTarget, json: true}, function(error, response, body){
															goalTarget = body;
															if(goalTarget.err_code > 0){
																res.json(goalTarget);	
																console.log("ok");
															}
														});
														
														var dataNote = {
															"id": noteId,
															"author_ref_practitioner": noteAuthorPractitioner,
															"author_ref_patient": noteAuthorPatient,
															"author_ref_relatedPerson": noteAuthorRelatedPerson,
															"author_string": noteAuthorAuthorString,
															"time": noteTime,
															"text": noteText,
															"goal_id" : goalId
														};
														
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataNote, json:true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
															} 
														});
														
														if(addressesCondition !== ""){
															dataAddressesCondition = {
																"_id" : addressesCondition,
																"goal_id" : goalId
															}
															ApiFHIR.put('condition', {"apikey": apikey, "_id": addressesCondition}, {body: dataAddressesCondition, json: true}, function(error, response, body){
																returnAddressesCondition = body;
																if(returnAddressesCondition.err_code > 0){
																	res.json(returnAddressesCondition);	
																	console.log("add reference Addresses condition : " + addressesCondition);
																}
															});
														}

														if(addressesObservation !== ""){
															dataAddressesObservation = {
																"_id" : addressesObservation,
																"goal_addresses_id" : goalId
															}
															ApiFHIR.put('observation', {"apikey": apikey, "_id": addressesObservation}, {body: dataAddressesObservation, json: true}, function(error, response, body){
																returnAddressesObservation = body;
																if(returnAddressesObservation.err_code > 0){
																	res.json(returnAddressesObservation);	
																	console.log("add reference Addresses observation : " + addressesObservation);
																}
															});
														}

														if(addressesMedicationStatement !== ""){
															dataAddressesMedicationStatement = {
																"_id" : addressesMedicationStatement,
																"goal_id" : goalId
															}
															ApiFHIR.put('medicationStatement', {"apikey": apikey, "_id": addressesMedicationStatement}, {body: dataAddressesMedicationStatement, json: true}, function(error, response, body){
																returnAddressesMedicationStatement = body;
																if(returnAddressesMedicationStatement.err_code > 0){
																	res.json(returnAddressesMedicationStatement);	
																	console.log("add reference Addresses medication statement : " + addressesMedicationStatement);
																}
															});
														}

														if(addressesNutritionOrder !== ""){
															dataAddressesNutritionOrder = {
																"_id" : addressesNutritionOrder,
																"goal_id" : goalId
															}
															ApiFHIR.put('nutritionOrder', {"apikey": apikey, "_id": addressesNutritionOrder}, {body: dataAddressesNutritionOrder, json: true}, function(error, response, body){
																returnAddressesNutritionOrder = body;
																if(returnAddressesNutritionOrder.err_code > 0){
																	res.json(returnAddressesNutritionOrder);	
																	console.log("add reference Addresses nutrition order : " + addressesNutritionOrder);
																}
															});
														}

														if(addressesProcedureRequest !== ""){
															dataAddressesProcedureRequest = {
																"_id" : addressesProcedureRequest,
																"goal_id" : goalId
															}
															ApiFHIR.put('procedureRequest', {"apikey": apikey, "_id": addressesProcedureRequest}, {body: dataAddressesProcedureRequest, json: true}, function(error, response, body){
																returnAddressesProcedureRequest = body;
																if(returnAddressesProcedureRequest.err_code > 0){
																	res.json(returnAddressesProcedureRequest);	
																	console.log("add reference Addresses procedure request : " + addressesProcedureRequest);
																}
															});
														}

														if(addressesRiskAssessment !== ""){
															dataAddressesRiskAssessment = {
																"_id" : addressesRiskAssessment,
																"goal_id" : goalId
															}
															ApiFHIR.put('riskAssessment', {"apikey": apikey, "_id": addressesRiskAssessment}, {body: dataAddressesRiskAssessment, json: true}, function(error, response, body){
																returnAddressesRiskAssessment = body;
																if(returnAddressesRiskAssessment.err_code > 0){
																	res.json(returnAddressesRiskAssessment);	
																	console.log("add reference Addresses risk assessment : " + addressesRiskAssessment);
																}
															});
														}

														if(outcomeReference !== ""){
															dataOutcomeReference = {
																"_id" : outcomeReference,
																"goal_outcome_reference_id" : goalId
															}
															ApiFHIR.put('observation', {"apikey": apikey, "_id": outcomeReference}, {body: dataOutcomeReference, json: true}, function(error, response, body){
																returnOutcomeReference = body;
																if(returnOutcomeReference.err_code > 0){
																	res.json(returnOutcomeReference);	
																	console.log("add reference Outcome reference : " + outcomeReference);
																}
															});
														}

														
														res.json({"err_code": 0, "err_msg": "Goal has been add.", "data": [{"_id": goalId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
status|goal-status
category|goal-category
priority|goal-priority
description|clinical-findings
startStartCodeableConcept|goal-start-event
targetMeasure|observation-codes
outcomeCode|clinical-findings
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'GOAL_STATUS', function (resStatusCode) {
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
												checkCode(apikey, category, 'GOAL_CATEGORY', function (resCategoryCode) {
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

										myEmitter.prependOnceListener('checkPriority', function () {
											if (!validator.isEmpty(priority)) {
												checkCode(apikey, priority, 'GOAL_PRIORITY', function (resPriorityCode) {
													if (resPriorityCode.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Priority code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkDescription', function () {
											if (!validator.isEmpty(description)) {
												checkCode(apikey, description, 'CLINICAL_FINDINGS', function (resDescriptionCode) {
													if (resDescriptionCode.err_code > 0) {
														myEmitter.emit('checkPriority');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Description code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPriority');
											}
										})

										myEmitter.prependOnceListener('checkStartStartCodeableConcept', function () {
											if (!validator.isEmpty(startStartCodeableConcept)) {
												checkCode(apikey, startStartCodeableConcept, 'GOAL_START_EVENT', function (resStartStartCodeableConceptCode) {
													if (resStartStartCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkDescription');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Start start codeable concept code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDescription');
											}
										})

										myEmitter.prependOnceListener('checkTargetMeasure', function () {
											if (!validator.isEmpty(targetMeasure)) {
												checkCode(apikey, targetMeasure, 'OBSERVATION_CODES', function (resTargetMeasureCode) {
													if (resTargetMeasureCode.err_code > 0) {
														myEmitter.emit('checkStartStartCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Target measure code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStartStartCodeableConcept');
											}
										})

										myEmitter.prependOnceListener('checkOutcomeCode', function () {
											if (!validator.isEmpty(outcomeCode)) {
												checkCode(apikey, outcomeCode, 'CLINICAL_FINDINGS', function (resOutcomeCodeCode) {
													if (resOutcomeCodeCode.err_code > 0) {
														myEmitter.emit('checkTargetMeasure');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Outcome code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkTargetMeasure');
											}
										})

										//cek value
										/*
subjectPatient|Patient
subjectGroup|Group
subjectOrganization|Organization
expressedByPatient|Patient
expressedByPractitioner|Practitioner
expressedByRelatedPerson|Related_Person
addressesCondition|Condition
addressesObservation|Observation
addressesMedicationStatement|Medication_Statement
addressesNutritionOrder|Nutrition_Order
addressesProcedureRequest|Procedure_Request
addressesRiskAssessment|Risk_Assessment
										*/
										myEmitter.prependOnceListener('checkSubjectPatient', function () {
											if (!validator.isEmpty(subjectPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
													if (resSubjectPatient.err_code > 0) {
														myEmitter.emit('checkOutcomeCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOutcomeCode');
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

										myEmitter.prependOnceListener('checkSubjectOrganization', function () {
											if (!validator.isEmpty(subjectOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + subjectOrganization, 'ORGANIZATION', function (resSubjectOrganization) {
													if (resSubjectOrganization.err_code > 0) {
														myEmitter.emit('checkSubjectGroup');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubjectGroup');
											}
										})

										myEmitter.prependOnceListener('checkExpressedByPatient', function () {
											if (!validator.isEmpty(expressedByPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + expressedByPatient, 'PATIENT', function (resExpressedByPatient) {
													if (resExpressedByPatient.err_code > 0) {
														myEmitter.emit('checkSubjectOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Expressed by patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubjectOrganization');
											}
										})

										myEmitter.prependOnceListener('checkExpressedByPractitioner', function () {
											if (!validator.isEmpty(expressedByPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + expressedByPractitioner, 'PRACTITIONER', function (resExpressedByPractitioner) {
													if (resExpressedByPractitioner.err_code > 0) {
														myEmitter.emit('checkExpressedByPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Expressed by practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkExpressedByPatient');
											}
										})

										myEmitter.prependOnceListener('checkExpressedByRelatedPerson', function () {
											if (!validator.isEmpty(expressedByRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + expressedByRelatedPerson, 'RELATED_PERSON', function (resExpressedByRelatedPerson) {
													if (resExpressedByRelatedPerson.err_code > 0) {
														myEmitter.emit('checkExpressedByPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Expressed by related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkExpressedByPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkAddressesCondition', function () {
											if (!validator.isEmpty(addressesCondition)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + addressesCondition, 'CONDITION', function (resAddressesCondition) {
													if (resAddressesCondition.err_code > 0) {
														myEmitter.emit('checkExpressedByRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Addresses condition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkExpressedByRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkAddressesObservation', function () {
											if (!validator.isEmpty(addressesObservation)) {
												checkUniqeValue(apikey, "OBSERVATION_ID|" + addressesObservation, 'OBSERVATION', function (resAddressesObservation) {
													if (resAddressesObservation.err_code > 0) {
														myEmitter.emit('checkAddressesCondition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Addresses observation id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddressesCondition');
											}
										})

										myEmitter.prependOnceListener('checkAddressesMedicationStatement', function () {
											if (!validator.isEmpty(addressesMedicationStatement)) {
												checkUniqeValue(apikey, "MEDICATION_STATEMENT_ID|" + addressesMedicationStatement, 'MEDICATION_STATEMENT', function (resAddressesMedicationStatement) {
													if (resAddressesMedicationStatement.err_code > 0) {
														myEmitter.emit('checkAddressesObservation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Addresses medication statement id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddressesObservation');
											}
										})

										myEmitter.prependOnceListener('checkAddressesNutritionOrder', function () {
											if (!validator.isEmpty(addressesNutritionOrder)) {
												checkUniqeValue(apikey, "NUTRITION_ORDER_ID|" + addressesNutritionOrder, 'NUTRITION_ORDER', function (resAddressesNutritionOrder) {
													if (resAddressesNutritionOrder.err_code > 0) {
														myEmitter.emit('checkAddressesMedicationStatement');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Addresses nutrition order id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddressesMedicationStatement');
											}
										})

										myEmitter.prependOnceListener('checkAddressesProcedureRequest', function () {
											if (!validator.isEmpty(addressesProcedureRequest)) {
												checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + addressesProcedureRequest, 'PROCEDURE_REQUEST', function (resAddressesProcedureRequest) {
													if (resAddressesProcedureRequest.err_code > 0) {
														myEmitter.emit('checkAddressesNutritionOrder');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Addresses procedure request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddressesNutritionOrder');
											}
										})
										
										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
											if (!validator.isEmpty(noteAuthorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorPractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
													if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
														myEmitter.emit('checkAddressesProcedureRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author author reference practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddressesProcedureRequest');
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

										if (!validator.isEmpty(addressesRiskAssessment)) {
											checkUniqeValue(apikey, "RISK_ASSESSMENT_ID|" + addressesRiskAssessment, 'RISK_ASSESSMENT', function (resAddressesRiskAssessment) {
												if (resAddressesRiskAssessment.err_code > 0) {
													myEmitter.emit('checkNoteAuthorAuthorReferenceRelatedPerson');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Addresses risk assessment id not found"
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
			var goalId = req.params.goal_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof goalId !== 'undefined'){
				if(validator.isEmpty(goalId)){
					err_code = 2;
					err_msg = "Goal id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Goal id is required";
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
												checkUniqeValue(apikey, "GOAL_ID|" + goalId, 'GOAL', function(resGoalID){
													if(resGoalID.err_code > 0){
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
																							"goal_id": goalId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Goal.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Goal Id not found"});		
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
		/*goalTarget: function addGoalTarget(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var goalId = req.params.goal_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof goalId !== 'undefined'){
				if(validator.isEmpty(goalId)){
					err_code = 2;
					err_msg = "Detected Issue id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Detected Issue id is required";
			}
			
			if(typeof req.body.measure !== 'undefined'){
				var targetMeasure =  req.body.measure.trim().toLowerCase();
				if(validator.isEmpty(targetMeasure)){
					targetMeasure = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'target measure' in json Goal request.";
			}

			if(typeof req.body.detail.detailQuantity !== 'undefined'){
				var targetDetailDetailQuantity =  req.body.detail.detailQuantity.trim().toLowerCase();
				if(validator.isEmpty(targetDetailDetailQuantity)){
					targetDetailDetailQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'target detail detail quantity' in json Goal request.";
			}

			if (typeof req.body.detail.detailRange !== 'undefined') {
			  var targetDetailDetailRange = req.body.detail.detailRange;
 				if(validator.isEmpty(targetDetailDetailRange)){
				  var targetDetailDetailRangeLow = "";
				  var targetDetailDetailRangeHigh = "";
				} else {
				  if (targetDetailDetailRange.indexOf("to") > 0) {
				    arrTargetDetailDetailRange = targetDetailDetailRange.split("to");
				    var targetDetailDetailRangeLow = arrTargetDetailDetailRange[0];
				    var targetDetailDetailRangeHigh = arrTargetDetailDetailRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Goal target detail detail range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'target detail detail range' in json Goal request.";
			}

			if(typeof req.body.detail.detailCodeableConcept !== 'undefined'){
				var targetDetailDetailCodeableConcept =  req.body.detail.detailCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(targetDetailDetailCodeableConcept)){
					targetDetailDetailCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'target detail detail codeable concept' in json Goal request.";
			}

			if(typeof req.body.due.dueDate !== 'undefined'){
				var targetDueDueDate =  req.body.due.dueDate;
				if(validator.isEmpty(targetDueDueDate)){
					targetDueDueDate = "";
				}else{
					if(!regex.test(targetDueDueDate)){
						err_code = 2;
						err_msg = "Goal target due due date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'target due due date' in json Goal request.";
			}

			if(typeof req.body.due.dueDuration !== 'undefined'){
				var targetDueDueDuration =  req.body.due.dueDuration;
				if(validator.isEmpty(targetDueDueDuration)){
					targetDueDueDuration = "";
				}else{
					if(!validator.isInt(targetDueDueDuration)){
						err_code = 2;
						err_msg = "Goal target due due duration is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'target due due duration' in json Goal request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkGoalID', function(){
							checkUniqeValue(apikey, "GOAL_ID|" + goalId, 'GOAL', function(resGoalID){
								if(resGoalID.err_code > 0){
									var unicId = uniqid.time();
									var goalTargetId = 'got' + unicId;
									//GoalTarget
									dataGoalTarget = {
										"target_id" : goalTargetId,
										"measure" : targetMeasure,
										"detail_quantity" : targetDetailDetailQuantity,
										"detail_range_low" : targetDetailDetailRangeLow,
										"detail_range_high" : targetDetailDetailRangeHigh,
										"detail_codeable_concept" : targetDetailDetailCodeableConcept,
										"due_date" : targetDueDueDate,
										"due_duration" : targetDueDueDuration,
										"goal_id" : goalId
									}
									ApiFHIR.post('goalTarget', {"apikey": apikey}, {body: dataGoalTarget, json: true}, function(error, response, body){
										goalTarget = body;
										if(goalTarget.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Goal Target has been add in this Goal.", "data": goalTarget.data});
										}else{
											res.json(goalTarget);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Goal Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(targetMeasure)) {
							checkCode(apikey, targetMeasure, 'OBSERVATION_CODES', function (resTargetMeasureCode) {
								if (resTargetMeasureCode.err_code > 0) {
									myEmitter.emit('checkGoalID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Target measure code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkGoalID');
						}
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},*/
		goalNote: function addGoalNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var goalId = req.params.goal_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof goalId !== 'undefined'){
				if(validator.isEmpty(goalId)){
					err_code = 2;
					err_msg = "Goal id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Goal id is required";
			}
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Goal request.";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Goal request.";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Goal request.";
			}

			if(typeof req.body.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Goal request.";
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
				err_msg = "Please add sub-key 'note time' in json Goal request.";
			}

			if(typeof req.body.string !== 'undefined'){
				var noteString =  req.body.string.trim().toLowerCase();
				if(validator.isEmpty(noteString)){
					noteString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note string' in json Goal request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkGoalID', function(){
							checkUniqeValue(apikey, "goal_id|" + goalId, 'goal', function(resGoalID){
								if(resGoalID.err_code > 0){
									var unicId = uniqid.time();
									var goalNoteId = 'ago' + unicId;
									//GoalNote
									dataGoalNote = {
										"id": goalNoteId,
										"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
										"author_ref_patient": noteAuthorAuthorReferencePatient,
										"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
										"author_string": noteAuthorAuthorString,
										"time": noteTime,
										"text": noteString,
										"goal_id" : goalId
									}
									ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataGoalNote, json: true}, function(error, response, body){
										goalNote = body;
										if(goalNote.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Goal Note has been add in this Goal.", "data": goalNote.data});
										}else{
											res.json(goalNote);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Goal Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkGoalID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkGoalID');
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
		goal : function putGoal(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var goalId = req.params.goal_id;

      var err_code = 0;
      var err_msg = "";
      var dataGoal = {};

			if(typeof goalId !== 'undefined'){
				if(validator.isEmpty(goalId)){
					err_code = 2;
					err_msg = "Goal id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Goal id is required";
			}

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "goal status is required.";
				}else{
					dataGoal.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					dataGoal.category = "";
				}else{
					dataGoal.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.priority !== 'undefined' && req.body.priority !== ""){
				var priority =  req.body.priority.trim().toLowerCase();
				if(validator.isEmpty(priority)){
					dataGoal.priority = "";
				}else{
					dataGoal.priority = priority;
				}
			}else{
			  priority = "";
			}

			if(typeof req.body.description !== 'undefined' && req.body.description !== ""){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					err_code = 2;
					err_msg = "goal description is required.";
				}else{
					dataGoal.description = description;
				}
			}else{
			  description = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataGoal.subject_patient = "";
				}else{
					dataGoal.subject_patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataGoal.subject_group = "";
				}else{
					dataGoal.subject_group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.subject.organization !== 'undefined' && req.body.subject.organization !== ""){
				var subjectOrganization =  req.body.subject.organization.trim().toLowerCase();
				if(validator.isEmpty(subjectOrganization)){
					dataGoal.subject_organization = "";
				}else{
					dataGoal.subject_organization = subjectOrganization;
				}
			}else{
			  subjectOrganization = "";
			}

			if(typeof req.body.start.startDate !== 'undefined' && req.body.start.startDate !== ""){
				var startStartDate =  req.body.start.startDate;
				if(validator.isEmpty(startStartDate)){
					err_code = 2;
					err_msg = "goal start start date is required.";
				}else{
					if(!regex.test(startStartDate)){
						err_code = 2;
						err_msg = "goal start start date invalid date format.";	
					}else{
						dataGoal.start_date = startStartDate;
					}
				}
			}else{
			  startStartDate = "";
			}

			if(typeof req.body.start.startCodeableConcept !== 'undefined' && req.body.start.startCodeableConcept !== ""){
				var startStartCodeableConcept =  req.body.start.startCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(startStartCodeableConcept)){
					dataGoal.start_codeable_concept = "";
				}else{
					dataGoal.start_codeable_concept = startStartCodeableConcept;
				}
			}else{
			  startStartCodeableConcept = "";
			}

			if(typeof req.body.statusDate !== 'undefined' && req.body.statusDate !== ""){
				var statusDate =  req.body.statusDate;
				if(validator.isEmpty(statusDate)){
					err_code = 2;
					err_msg = "goal status date is required.";
				}else{
					if(!regex.test(statusDate)){
						err_code = 2;
						err_msg = "goal status date invalid date format.";	
					}else{
						dataGoal.status_date = statusDate;
					}
				}
			}else{
			  statusDate = "";
			}

			if(typeof req.body.statusReason !== 'undefined' && req.body.statusReason !== ""){
				var statusReason =  req.body.statusReason.trim().toLowerCase();
				if(validator.isEmpty(statusReason)){
					dataGoal.status_reason = "";
				}else{
					dataGoal.status_reason = statusReason;
				}
			}else{
			  statusReason = "";
			}

			if(typeof req.body.expressedBy.patient !== 'undefined' && req.body.expressedBy.patient !== ""){
				var expressedByPatient =  req.body.expressedBy.patient.trim().toLowerCase();
				if(validator.isEmpty(expressedByPatient)){
					dataGoal.expressed_by_patient = "";
				}else{
					dataGoal.expressed_by_patient = expressedByPatient;
				}
			}else{
			  expressedByPatient = "";
			}

			if(typeof req.body.expressedBy.practitioner !== 'undefined' && req.body.expressedBy.practitioner !== ""){
				var expressedByPractitioner =  req.body.expressedBy.practitioner.trim().toLowerCase();
				if(validator.isEmpty(expressedByPractitioner)){
					dataGoal.expressed_by_practitioner = "";
				}else{
					dataGoal.expressed_by_practitioner = expressedByPractitioner;
				}
			}else{
			  expressedByPractitioner = "";
			}

			if(typeof req.body.expressedBy.relatedPerson !== 'undefined' && req.body.expressedBy.relatedPerson !== ""){
				var expressedByRelatedPerson =  req.body.expressedBy.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(expressedByRelatedPerson)){
					dataGoal.expressed_by_related_person = "";
				}else{
					dataGoal.expressed_by_related_person = expressedByRelatedPerson;
				}
			}else{
			  expressedByRelatedPerson = "";
			}

			/*if(typeof req.body.addresses.condition !== 'undefined' && req.body.addresses.condition !== ""){
				var addressesCondition =  req.body.addresses.condition.trim().toLowerCase();
				if(validator.isEmpty(addressesCondition)){
					dataGoal.condition = "";
				}else{
					dataGoal.condition = addressesCondition;
				}
			}else{
			  addressesCondition = "";
			}

			if(typeof req.body.addresses.observation !== 'undefined' && req.body.addresses.observation !== ""){
				var addressesObservation =  req.body.addresses.observation.trim().toLowerCase();
				if(validator.isEmpty(addressesObservation)){
					dataGoal.observation = "";
				}else{
					dataGoal.observation = addressesObservation;
				}
			}else{
			  addressesObservation = "";
			}

			if(typeof req.body.addresses.medicationStatement !== 'undefined' && req.body.addresses.medicationStatement !== ""){
				var addressesMedicationStatement =  req.body.addresses.medicationStatement.trim().toLowerCase();
				if(validator.isEmpty(addressesMedicationStatement)){
					dataGoal.medication_statement = "";
				}else{
					dataGoal.medication_statement = addressesMedicationStatement;
				}
			}else{
			  addressesMedicationStatement = "";
			}

			if(typeof req.body.addresses.nutritionOrder !== 'undefined' && req.body.addresses.nutritionOrder !== ""){
				var addressesNutritionOrder =  req.body.addresses.nutritionOrder.trim().toLowerCase();
				if(validator.isEmpty(addressesNutritionOrder)){
					dataGoal.nutrition_order = "";
				}else{
					dataGoal.nutrition_order = addressesNutritionOrder;
				}
			}else{
			  addressesNutritionOrder = "";
			}

			if(typeof req.body.addresses.procedureRequest !== 'undefined' && req.body.addresses.procedureRequest !== ""){
				var addressesProcedureRequest =  req.body.addresses.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(addressesProcedureRequest)){
					dataGoal.procedure_request = "";
				}else{
					dataGoal.procedure_request = addressesProcedureRequest;
				}
			}else{
			  addressesProcedureRequest = "";
			}

			if(typeof req.body.addresses.riskAssessment !== 'undefined' && req.body.addresses.riskAssessment !== ""){
				var addressesRiskAssessment =  req.body.addresses.riskAssessment.trim().toLowerCase();
				if(validator.isEmpty(addressesRiskAssessment)){
					dataGoal.risk_assessment = "";
				}else{
					dataGoal.risk_assessment = addressesRiskAssessment;
				}
			}else{
			  addressesRiskAssessment = "";
			}*/

			if(typeof req.body.outcomeCode !== 'undefined' && req.body.outcomeCode !== ""){
				var outcomeCode =  req.body.outcomeCode.trim().toLowerCase();
				if(validator.isEmpty(outcomeCode)){
					dataGoal.outcome_code = "";
				}else{
					dataGoal.outcome_code = outcomeCode;
				}
			}else{
			  outcomeCode = "";
			}

			/*if(typeof req.body.outcomeReference !== 'undefined' && req.body.outcomeReference !== ""){
				var outcomeReference =  req.body.outcomeReference.trim().toLowerCase();
				if(validator.isEmpty(outcomeReference)){
					dataGoal.outcome_reference = "";
				}else{
					dataGoal.outcome_reference = outcomeReference;
				}
			}else{
			  outcomeReference = "";
			}*/


			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkGoalId', function(){
						checkUniqeValue(apikey, "GOAL_ID|" + goalId, 'GOAL', function(resGoalId){
							if(resGoalId.err_code > 0){
								ApiFHIR.put('goal', {"apikey": apikey, "_id": goalId}, {body: dataGoal, json: true}, function(error, response, body){
									goal = body;
									if(goal.err_code > 0){
										res.json(goal);	
									}else{
										res.json({"err_code": 0, "err_msg": "Goal has been update.", "data": [{"_id": goalId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Goal Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkStatus', function () {
						if (!validator.isEmpty(status)) {
							checkCode(apikey, status, 'GOAL_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) {
									myEmitter.emit('checkGoalId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkGoalId');
						}
					})

					myEmitter.prependOnceListener('checkCategory', function () {
						if (!validator.isEmpty(category)) {
							checkCode(apikey, category, 'GOAL_CATEGORY', function (resCategoryCode) {
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

					myEmitter.prependOnceListener('checkPriority', function () {
						if (!validator.isEmpty(priority)) {
							checkCode(apikey, priority, 'GOAL_PRIORITY', function (resPriorityCode) {
								if (resPriorityCode.err_code > 0) {
									myEmitter.emit('checkCategory');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Priority code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCategory');
						}
					})

					myEmitter.prependOnceListener('checkDescription', function () {
						if (!validator.isEmpty(description)) {
							checkCode(apikey, description, 'CLINICAL_FINDINGS', function (resDescriptionCode) {
								if (resDescriptionCode.err_code > 0) {
									myEmitter.emit('checkPriority');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Description code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPriority');
						}
					})

					myEmitter.prependOnceListener('checkStartStartCodeableConcept', function () {
						if (!validator.isEmpty(startStartCodeableConcept)) {
							checkCode(apikey, startStartCodeableConcept, 'GOAL_START_EVENT', function (resStartStartCodeableConceptCode) {
								if (resStartStartCodeableConceptCode.err_code > 0) {
									myEmitter.emit('checkDescription');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Start start codeable concept code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkDescription');
						}
					})

					myEmitter.prependOnceListener('checkOutcomeCode', function () {
						if (!validator.isEmpty(outcomeCode)) {
							checkCode(apikey, outcomeCode, 'CLINICAL_FINDINGS', function (resOutcomeCodeCode) {
								if (resOutcomeCodeCode.err_code > 0) {
									myEmitter.emit('checkStartStartCodeableConcept');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Outcome code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkStartStartCodeableConcept');
						}
					})
					
					myEmitter.prependOnceListener('checkSubjectPatient', function () {
						if (!validator.isEmpty(subjectPatient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
								if (resSubjectPatient.err_code > 0) {
									myEmitter.emit('checkOutcomeCode');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkOutcomeCode');
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

					myEmitter.prependOnceListener('checkSubjectOrganization', function () {
						if (!validator.isEmpty(subjectOrganization)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + subjectOrganization, 'ORGANIZATION', function (resSubjectOrganization) {
								if (resSubjectOrganization.err_code > 0) {
									myEmitter.emit('checkSubjectGroup');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject organization id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSubjectGroup');
						}
					})

					myEmitter.prependOnceListener('checkExpressedByPatient', function () {
						if (!validator.isEmpty(expressedByPatient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + expressedByPatient, 'PATIENT', function (resExpressedByPatient) {
								if (resExpressedByPatient.err_code > 0) {
									myEmitter.emit('checkSubjectOrganization');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Expressed by patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSubjectOrganization');
						}
					})

					myEmitter.prependOnceListener('checkExpressedByPractitioner', function () {
						if (!validator.isEmpty(expressedByPractitioner)) {
							checkUniqeValue(apikey, "PRACTITIONER_ID|" + expressedByPractitioner, 'PRACTITIONER', function (resExpressedByPractitioner) {
								if (resExpressedByPractitioner.err_code > 0) {
									myEmitter.emit('checkExpressedByPatient');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Expressed by practitioner id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkExpressedByPatient');
						}
					})

					if (!validator.isEmpty(expressedByRelatedPerson)) {
						checkUniqeValue(apikey, "RELATED_PERSON_ID|" + expressedByRelatedPerson, 'RELATED_PERSON', function (resExpressedByRelatedPerson) {
							if (resExpressedByRelatedPerson.err_code > 0) {
								myEmitter.emit('checkExpressedByPractitioner');
							} else {
								res.json({
									"err_code": "500",
									"err_msg": "Expressed by related person id not found"
								});
							}
						})
					} else {
						myEmitter.emit('checkExpressedByPractitioner');
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
			var goalId = req.params.goal_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof goalId !== 'undefined'){
				if(validator.isEmpty(goalId)){
					err_code = 2;
					err_msg = "Goal id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Goal id is required";
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
						myEmitter.prependOnceListener('checkGoalID', function(){
							checkUniqeValue(apikey, "GOAL_ID|" + goalId, 'GOAL', function(resGoalID){
								if(resGoalID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "GOAL_ID|"+goalId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Goal.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Goal Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkGoalID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkGoalID');				
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
		goalTarget: function updateGoalTarget(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var goalId = req.params.goal_id;
			var goalTargetId = req.params.goal_target_id;

			var err_code = 0;
			var err_msg = "";
			var dataGoal = {};
			//input check 
			if(typeof goalId !== 'undefined'){
				if(validator.isEmpty(goalId)){
					err_code = 2;
					err_msg = "Goal id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Goal id is required";
			}

			if(typeof goalTargetId !== 'undefined'){
				if(validator.isEmpty(goalTargetId)){
					err_code = 2;
					err_msg = "Goal Target id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Goal Target id is required";
			}
			
			/*
			var measure = req.body.measure;
			var detail_quantity= req.body.detail_quantity;
			var detail_range_low = req.body.detail_range_low;
			var detail_range_high = req.body.detail_range_high;
			var detail_codeable_concept = req.body.detail_codeable_concept;
			var due_date = req.body.due_date;
			var due_duration = req.body.due_duration;
			*/
			if(typeof req.body.measure !== 'undefined' && req.body.measure !== ""){
				var targetMeasure =  req.body.measure.trim().toLowerCase();
				if(validator.isEmpty(targetMeasure)){
					dataGoal.measure = "";
				}else{
					dataGoal.measure = targetMeasure;
				}
			}else{
			  targetMeasure = "";
			}

			if(typeof req.body.detail.detailQuantity !== 'undefined' && req.body.detail.detailQuantity !== ""){
				var targetDetailDetailQuantity =  req.body.detail.detailQuantity.trim().toLowerCase();
				if(validator.isEmpty(targetDetailDetailQuantity)){
					dataGoal.detail_quantity = "";
				}else{
					dataGoal.detail_quantity = targetDetailDetailQuantity;
				}
			}else{
			  targetDetailDetailQuantity = "";
			}

			if (typeof req.body.detail.detailRange !== 'undefined' && req.body.detail.detailRange !== "") {
			  var targetDetailDetailRange = req.body.detail.detailRange;
			  if (targetDetailDetailRange.indexOf("to") > 0) {
			    arrTargetDetailDetailRange = targetDetailDetailRange.split("to");
			    dataGoal.detail_range_low = arrTargetDetailDetailRange[0];
			    dataGoal.detail_range_high = arrTargetDetailDetailRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "goal target detail detail range invalid range format.";
				}
			} else {
			  targetDetailDetailRange = "";
			}

			if(typeof req.body.detail.detailCodeableConcept !== 'undefined' && req.body.detail.detailCodeableConcept !== ""){
				var targetDetailDetailCodeableConcept =  req.body.detail.detailCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(targetDetailDetailCodeableConcept)){
					dataGoal.detail_codeable_concept = "";
				}else{
					dataGoal.detail_codeable_concept = targetDetailDetailCodeableConcept;
				}
			}else{
			  targetDetailDetailCodeableConcept = "";
			}

			if(typeof req.body.due.dueDate !== 'undefined' && req.body.due.dueDate !== ""){
				var targetDueDueDate =  req.body.due.dueDate;
				if(validator.isEmpty(targetDueDueDate)){
					err_code = 2;
					err_msg = "goal target due due date is required.";
				}else{
					if(!regex.test(targetDueDueDate)){
						err_code = 2;
						err_msg = "goal target due due date invalid date format.";	
					}else{
						dataGoal.due_date = targetDueDueDate;
					}
				}
			}else{
			  targetDueDueDate = "";
			}

			if(typeof req.body.due.dueDuration !== 'undefined' && req.body.due.dueDuration !== ""){
				var targetDueDueDuration =  req.body.due.dueDuration;
				if(validator.isEmpty(targetDueDueDuration)){
					dataGoal.due_duration = "";
				}else{
					if(!validator.isInt(targetDueDueDuration)){
						err_code = 2;
						err_msg = "goal target due due duration is must be number.";
					}else{
						dataGoal.due_duration = targetDueDueDuration;
					}
				}
			}else{
			  targetDueDueDuration = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkGoalID', function(){
							checkUniqeValue(apikey, "GOAL_ID|" + goalId, 'GOAL', function(resGoalId){
								if(resGoalId.err_code > 0){
									checkUniqeValue(apikey, "TARGET_ID|" + goalTargetId, 'GOAL_TARGET', function(resGoalTargetID){
										if(resGoalTargetID.err_code > 0){
											ApiFHIR.put('goalTarget', {"apikey": apikey, "_id": goalTargetId, "dr": "GOAL_ID|"+goalId}, {body: dataGoal, json: true}, function(error, response, body){
												goalTarget = body;
												if(goalTarget.err_code > 0){
													res.json(goalTarget);	
												}else{
													res.json({"err_code": 0, "err_msg": "Goal target has been update in this Goal.", "data": goalTarget.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Goal Target Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Detected Issue Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(targetMeasure)) {
							checkCode(apikey, targetMeasure, 'OBSERVATION_CODES', function (resTargetMeasureCode) {
								if (resTargetMeasureCode.err_code > 0) {
									myEmitter.emit('checkGoalID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Target measure code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkGoalID');
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
		goalNote: function updateGoalNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var goalId = req.params.goal_id;
			var goalNoteId = req.params.goal_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataGoal = {};
			//input check 
			if(typeof goalId !== 'undefined'){
				if(validator.isEmpty(goalId)){
					err_code = 2;
					err_msg = "Goal id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Goal id is required";
			}

			if(typeof goalNoteId !== 'undefined'){
				if(validator.isEmpty(goalNoteId)){
					err_code = 2;
					err_msg = "Goal Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Goal Note id is required";
			}
			
			/*
			"id": goalNoteId,
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
					err_msg = "goal note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "goal note time invalid date format.";	
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
						myEmitter.once('checkGoalID', function(){
							checkUniqeValue(apikey, "goal_id|" + goalId, 'goal', function(resGoalId){
								if(resGoalId.err_code > 0){
									checkUniqeValue(apikey, "NOTE_ID|" + goalNoteId, 'NOTE', function(resGoalNoteID){
										if(resGoalNoteID.err_code > 0){
											ApiFHIR.put('annotation', {"apikey": apikey, "_id": goalNoteId, "dr": "goal_id|"+goalId}, {body: dataGoal, json: true}, function(error, response, body){
												goalNote = body;
												if(goalNote.err_code > 0){
													res.json(goalNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Goal Note has been update in this Goal.", "data": goalNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Goal Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Goal Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkGoalID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkGoalID');
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