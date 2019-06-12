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
		procedure : function getProcedure(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var procedureId = req.query._id;
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
			
			if(typeof procedureId !== 'undefined'){
				if(!validator.isEmpty(procedureId)){
					qString._id = procedureId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Procedure Id is required."});
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
				"Procedure" : {
					"location": "%(apikey)s/Procedure",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('Procedure', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var procedure = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(procedure.err_code == 0){
								//cek jumdata dulu
								if(procedure.data.length > 0){
									newProcedure = [];
									for(i=0; i < procedure.data.length; i++){
										myEmitter.once("getIdentifier", function(procedure, index, newProcedure, countProcedure){
											/*console.log(procedure);*/
											//get identifier
											qString = {};
											qString.procedure_id = procedure.id;
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
													var objectProcedure = {};
													objectProcedure.resourceType = procedure.resourceType;
													objectProcedure.id = procedure.id;
													objectProcedure.identifier = identifier.data;
													objectProcedure.status = procedure.status;
													objectProcedure.notDone = procedure.notDone;
													objectProcedure.notDoneReason = procedure.notDoneReason;
													objectProcedure.category = procedure.category;
													objectProcedure.code = procedure.code;
													objectProcedure.subject = procedure.subject;
													objectProcedure.context = procedure.context;
													objectProcedure.performed = procedure.performed;
													objectProcedure.location = procedure.location;
													objectProcedure.reasonCode = procedure.reasonCode;
													objectProcedure.bodySite = procedure.bodySite;
													objectProcedure.outcome = procedure.outcome;
													objectProcedure.complication = procedure.complication;
													objectProcedure.followUp = procedure.followUp;
													objectProcedure.usedCode = procedure.usedCode;
												
													newProcedure[index] = objectProcedure;

													myEmitter.once('getProcedurePerformer', function(procedure, index, newProcedure, countProcedure){
														qString = {};
														qString.procedure_id = procedure.id;
														seedPhoenixFHIR.path.GET = {
															"ProcedurePerformer" : {
																"location": "%(apikey)s/ProcedurePerformer",
																"query": qString
															}
														}

														var ApiFHIR = new Apiclient(seedPhoenixFHIR);

														ApiFHIR.get('ProcedurePerformer', {"apikey": apikey}, {}, function(error, response, body){
															procedurePerformer = JSON.parse(body);
															if(procedurePerformer.err_code == 0){
																var objectProcedure = {};
																objectProcedure.resourceType = procedure.resourceType;
																objectProcedure.id = procedure.id;
																objectProcedure.identifier = procedure.identifier;
																objectProcedure.status = procedure.status;
																objectProcedure.notDone = procedure.notDone;
																objectProcedure.notDoneReason = procedure.notDoneReason;
																objectProcedure.category = procedure.category;
																objectProcedure.code = procedure.code;
																objectProcedure.subject = procedure.subject;
																objectProcedure.context = procedure.context;
																objectProcedure.performed = procedure.performed;
																objectProcedure.performer = procedurePerformer.data;
																objectProcedure.location = procedure.location;
																objectProcedure.reasonCode = procedure.reasonCode;
																objectProcedure.bodySite = procedure.bodySite;
																objectProcedure.outcome = procedure.outcome;
																objectProcedure.complication = procedure.complication;
																objectProcedure.followUp = procedure.followUp;
																objectProcedure.usedCode = procedure.usedCode;
																
																newProcedure[index] = objectProcedure;
																myEmitter.once('getProcedureFocalDevice', function(procedure, index, newProcedure, countProcedure){
																	qString = {};
																	qString.procedure_id = procedure.id;
																	seedPhoenixFHIR.path.GET = {
																		"ProcedureFocalDevice" : {
																			"location": "%(apikey)s/ProcedureFocalDevice",
																			"query": qString
																		}
																	}

																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																	ApiFHIR.get('ProcedureFocalDevice', {"apikey": apikey}, {}, function(error, response, body){
																		procedureFocalDevice = JSON.parse(body);
																		if(procedureFocalDevice.err_code == 0){
																			var objectProcedure = {};
																			objectProcedure.resourceType = procedure.resourceType;
																			objectProcedure.id = procedure.id;
																			objectProcedure.identifier = procedure.identifier;
																			objectProcedure.status = procedure.status;
																			objectProcedure.notDone = procedure.notDone;
																			objectProcedure.notDoneReason = procedure.notDoneReason;
																			objectProcedure.category = procedure.category;
																			objectProcedure.code = procedure.code;
																			objectProcedure.subject = procedure.subject;
																			objectProcedure.context = procedure.context;
																			objectProcedure.performed = procedure.performed;
																			objectProcedure.performer = procedure.performer;
																			objectProcedure.location = procedure.location;
																			objectProcedure.reasonCode = procedure.reasonCode;
																			objectProcedure.bodySite = procedure.bodySite;
																			objectProcedure.outcome = procedure.outcome;
																			objectProcedure.complication = procedure.complication;
																			objectProcedure.followUp = procedure.followUp;
																			objectProcedure.focalDevice = procedureFocalDevice.data;
																			objectProcedure.usedCode = procedure.usedCode;

																			newProcedure[index] = objectProcedure;
																			myEmitter.once('getNote', function(procedure, index, newProcedure, countProcedure){
																				qString = {};
																				qString.procedure_id = procedure.id;
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
																						var objectProcedure = {};
																						objectProcedure.resourceType = procedure.resourceType;
																						objectProcedure.id = procedure.id;
																						objectProcedure.identifier = procedure.identifier;
																						objectProcedure.status = procedure.status;
																						objectProcedure.notDone = procedure.notDone;
																						objectProcedure.notDoneReason = procedure.notDoneReason;
																						objectProcedure.category = procedure.category;
																						objectProcedure.code = procedure.code;
																						objectProcedure.subject = procedure.subject;
																						objectProcedure.context = procedure.context;
																						objectProcedure.performed = procedure.performed;
																						objectProcedure.performer = procedure.performer;
																						objectProcedure.location = procedure.location;
																						objectProcedure.reasonCode = procedure.reasonCode;
																						objectProcedure.bodySite = procedure.bodySite;
																						objectProcedure.outcome = procedure.outcome;
																						objectProcedure.complication = procedure.complication;
																						objectProcedure.followUp = procedure.followUp;
																						objectProcedure.note = annotation.data;
																						objectProcedure.focalDevice = procedure.focalDevice;
																						objectProcedure.usedCode = procedure.usedCode;

																						newProcedure[index] = objectProcedure;
																						myEmitter.once('getProcedureDefinitionPlanDefinition', function(procedure, index, newProcedure, countProcedure){
																							qString = {};
																							qString.procedure_id = procedure.id;
																							seedPhoenixFHIR.path.GET = {
																								"ProcedureDefinitionPlanDefinition" : {
																									"location": "%(apikey)s/ProcedureDefinitionPlanDefinition",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('ProcedureDefinitionPlanDefinition', {"apikey": apikey}, {}, function(error, response, body){
																								procedureDefinitionPlanDefinition = JSON.parse(body);
																								if(procedureDefinitionPlanDefinition.err_code == 0){
																									var objectProcedure = {};
																									objectProcedure.resourceType = procedure.resourceType;
																									objectProcedure.id = procedure.id;
																									objectProcedure.identifier = procedure.identifier;
																									var Definition = {};
																									Definition.planDefinition = procedureDefinitionPlanDefinition.data;
																									objectProcedure.definition = Definition;
																									objectProcedure.status = procedure.status;
																									objectProcedure.notDone = procedure.notDone;
																									objectProcedure.notDoneReason = procedure.notDoneReason;
																									objectProcedure.category = procedure.category;
																									objectProcedure.code = procedure.code;
																									objectProcedure.subject = procedure.subject;
																									objectProcedure.context = procedure.context;
																									objectProcedure.performed = procedure.performed;
																									objectProcedure.performer = procedure.performer;
																									objectProcedure.location = procedure.location;
																									objectProcedure.reasonCode = procedure.reasonCode;
																									objectProcedure.bodySite = procedure.bodySite;
																									objectProcedure.outcome = procedure.outcome;
																									objectProcedure.complication = procedure.complication;
																									objectProcedure.followUp = procedure.followUp;
																									objectProcedure.note = procedure.note;
																									objectProcedure.focalDevice = procedure.focalDevice;
																									objectProcedure.usedCode = procedure.usedCode;

																									newProcedure[index] = objectProcedure;
																									myEmitter.once('getProcedureDefinitionActivityDefinition', function(procedure, index, newProcedure, countProcedure){
																										qString = {};
																										qString.procedure_id = procedure.id;
																										seedPhoenixFHIR.path.GET = {
																											"ProcedureDefinitionActivityDefinition" : {
																												"location": "%(apikey)s/ProcedureDefinitionActivityDefinition",
																												"query": qString
																											}
																										}

																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																										ApiFHIR.get('ProcedureDefinitionActivityDefinition', {"apikey": apikey}, {}, function(error, response, body){
																											procedureDefinitionActivityDefinition = JSON.parse(body);
																											if(procedureDefinitionActivityDefinition.err_code == 0){
																												var objectProcedure = {};
																												objectProcedure.resourceType = procedure.resourceType;
																												objectProcedure.id = procedure.id;
																												objectProcedure.identifier = procedure.identifier;
																												var Definition = {};
																												Definition.planDefinition = procedure.definition.planDefinition;
																												Definition.activityDefinition = procedureDefinitionActivityDefinition.data;
																												objectProcedure.definition = Definition;
																												objectProcedure.status = procedure.status;
																												objectProcedure.notDone = procedure.notDone;
																												objectProcedure.notDoneReason = procedure.notDoneReason;
																												objectProcedure.category = procedure.category;
																												objectProcedure.code = procedure.code;
																												objectProcedure.subject = procedure.subject;
																												objectProcedure.context = procedure.context;
																												objectProcedure.performed = procedure.performed;
																												objectProcedure.performer = procedure.performer;
																												objectProcedure.location = procedure.location;
																												objectProcedure.reasonCode = procedure.reasonCode;
																												objectProcedure.bodySite = procedure.bodySite;
																												objectProcedure.outcome = procedure.outcome;
																												objectProcedure.complication = procedure.complication;
																												objectProcedure.followUp = procedure.followUp;
																												objectProcedure.note = procedure.note;
																												objectProcedure.focalDevice = procedure.focalDevice;
																												objectProcedure.usedCode = procedure.usedCode;

																												newProcedure[index] = objectProcedure;
																												myEmitter.once('getProcedureDefinitionHealthcareService', function(procedure, index, newProcedure, countProcedure){
																													qString = {};
																													qString.procedure_id = procedure.id;
																													seedPhoenixFHIR.path.GET = {
																														"ProcedureDefinitionHealthcareService" : {
																															"location": "%(apikey)s/ProcedureDefinitionHealthcareService",
																															"query": qString
																														}
																													}

																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																													ApiFHIR.get('ProcedureDefinitionHealthcareService', {"apikey": apikey}, {}, function(error, response, body){
																														procedureDefinitionHealthcareService = JSON.parse(body);
																														if(procedureDefinitionHealthcareService.err_code == 0){
																															var objectProcedure = {};
																															objectProcedure.resourceType = procedure.resourceType;
																															objectProcedure.id = procedure.id;
																															objectProcedure.identifier = procedure.identifier;
																															var Definition = {};
																															Definition.planDefinition = procedure.definition.planDefinition;
																															Definition.activityDefinition = procedure.definition.activityDefinition;
																															Definition.healthcareService = procedureDefinitionHealthcareService.data;
																															objectProcedure.definition = Definition;
																															objectProcedure.status = procedure.status;
																															objectProcedure.notDone = procedure.notDone;
																															objectProcedure.notDoneReason = procedure.notDoneReason;
																															objectProcedure.category = procedure.category;
																															objectProcedure.code = procedure.code;
																															objectProcedure.subject = procedure.subject;
																															objectProcedure.context = procedure.context;
																															objectProcedure.performed = procedure.performed;
																															objectProcedure.performer = procedure.performer;
																															objectProcedure.location = procedure.location;
																															objectProcedure.reasonCode = procedure.reasonCode;
																															objectProcedure.bodySite = procedure.bodySite;
																															objectProcedure.outcome = procedure.outcome;
																															objectProcedure.complication = procedure.complication;
																															objectProcedure.followUp = procedure.followUp;
																															objectProcedure.note = procedure.note;
																															objectProcedure.focalDevice = procedure.focalDevice;
																															objectProcedure.usedCode = procedure.usedCode;

																															newProcedure[index] = objectProcedure;
																															myEmitter.once('getProcedureBasedOnCarePlan', function(procedure, index, newProcedure, countProcedure){
																																qString = {};
																																qString.procedure_id = procedure.id;
																																seedPhoenixFHIR.path.GET = {
																																	"ProcedureBasedOnCarePlan" : {
																																		"location": "%(apikey)s/ProcedureBasedOnCarePlan",
																																		"query": qString
																																	}
																																}

																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																ApiFHIR.get('ProcedureBasedOnCarePlan', {"apikey": apikey}, {}, function(error, response, body){
																																	procedureBasedOnCarePlan = JSON.parse(body);
																																	if(procedureBasedOnCarePlan.err_code == 0){
																																		var objectProcedure = {};
																																		objectProcedure.resourceType = procedure.resourceType;
																																		objectProcedure.id = procedure.id;
																																		objectProcedure.identifier = procedure.identifier;
																																		objectProcedure.definition = procedure.definition;
																																		var BasedOn = {};
																																		BasedOn.carePlan = procedureBasedOnCarePlan.data;
																																		objectProcedure.basedOn = BasedOn;
																																		objectProcedure.status = procedure.status;
																																		objectProcedure.notDone = procedure.notDone;
																																		objectProcedure.notDoneReason = procedure.notDoneReason;
																																		objectProcedure.category = procedure.category;
																																		objectProcedure.code = procedure.code;
																																		objectProcedure.subject = procedure.subject;
																																		objectProcedure.context = procedure.context;
																																		objectProcedure.performed = procedure.performed;
																																		objectProcedure.performer = procedure.performer;
																																		objectProcedure.location = procedure.location;
																																		objectProcedure.reasonCode = procedure.reasonCode;
																																		objectProcedure.bodySite = procedure.bodySite;
																																		objectProcedure.outcome = procedure.outcome;
																																		objectProcedure.complication = procedure.complication;
																																		objectProcedure.followUp = procedure.followUp;
																																		objectProcedure.note = procedure.note;
																																		objectProcedure.focalDevice = procedure.focalDevice;
																																		objectProcedure.usedCode = procedure.usedCode;

																																		newProcedure[index] = objectProcedure;
																																		myEmitter.once('getProcedureBasedOnProcedureRequest', function(procedure, index, newProcedure, countProcedure){
																																			qString = {};
																																			qString.procedure_id = procedure.id;
																																			seedPhoenixFHIR.path.GET = {
																																				"ProcedureBasedOnProcedureRequest" : {
																																					"location": "%(apikey)s/ProcedureBasedOnProcedureRequest",
																																					"query": qString
																																				}
																																			}

																																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																			ApiFHIR.get('ProcedureBasedOnProcedureRequest', {"apikey": apikey}, {}, function(error, response, body){
																																				procedureBasedOnProcedureRequest = JSON.parse(body);
																																				if(procedureBasedOnProcedureRequest.err_code == 0){
																																					var objectProcedure = {};
																																					objectProcedure.resourceType = procedure.resourceType;
																																					objectProcedure.id = procedure.id;
																																					objectProcedure.identifier = procedure.identifier;
																																					objectProcedure.definition = procedure.definition;
																																					var BasedOn = {};
																																					BasedOn.carePlan = procedure.basedOn.carePlan;
																																					BasedOn.procedureRequest = procedureBasedOnProcedureRequest.data;
																																					objectProcedure.basedOn = BasedOn;
																																					objectProcedure.status = procedure.status;
																																					objectProcedure.notDone = procedure.notDone;
																																					objectProcedure.notDoneReason = procedure.notDoneReason;
																																					objectProcedure.category = procedure.category;
																																					objectProcedure.code = procedure.code;
																																					objectProcedure.subject = procedure.subject;
																																					objectProcedure.context = procedure.context;
																																					objectProcedure.performed = procedure.performed;
																																					objectProcedure.performer = procedure.performer;
																																					objectProcedure.location = procedure.location;
																																					objectProcedure.reasonCode = procedure.reasonCode;
																																					objectProcedure.bodySite = procedure.bodySite;
																																					objectProcedure.outcome = procedure.outcome;
																																					objectProcedure.complication = procedure.complication;
																																					objectProcedure.followUp = procedure.followUp;
																																					objectProcedure.note = procedure.note;
																																					objectProcedure.focalDevice = procedure.focalDevice;
																																					objectProcedure.usedCode = procedure.usedCode;

																																					newProcedure[index] = objectProcedure;
																																					myEmitter.once('getProcedureBasedOnReferralRequest', function(procedure, index, newProcedure, countProcedure){
																																						qString = {};
																																						qString.procedure_id = procedure.id;
																																						seedPhoenixFHIR.path.GET = {
																																							"ProcedureBasedOnReferralRequest" : {
																																								"location": "%(apikey)s/ProcedureBasedOnReferralRequest",
																																								"query": qString
																																							}
																																						}

																																						var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																						ApiFHIR.get('ProcedureBasedOnReferralRequest', {"apikey": apikey}, {}, function(error, response, body){
																																							procedureBasedOnReferralRequest = JSON.parse(body);
																																							if(procedureBasedOnReferralRequest.err_code == 0){
																																								var objectProcedure = {};
																																								objectProcedure.resourceType = procedure.resourceType;
																																								objectProcedure.id = procedure.id;
																																								objectProcedure.identifier = procedure.identifier;
																																								objectProcedure.definition = procedure.definition;
																																								var BasedOn = {};
																																								BasedOn.carePlan = procedure.basedOn.carePlan;
																																								BasedOn.procedureRequest = procedure.basedOn.procedureRequest;
																																								BasedOn.referralRequest = procedureBasedOnReferralRequest.data;
																																								objectProcedure.basedOn = BasedOn;
																																								objectProcedure.status = procedure.status;
																																								objectProcedure.notDone = procedure.notDone;
																																								objectProcedure.notDoneReason = procedure.notDoneReason;
																																								objectProcedure.category = procedure.category;
																																								objectProcedure.code = procedure.code;
																																								objectProcedure.subject = procedure.subject;
																																								objectProcedure.context = procedure.context;
																																								objectProcedure.performed = procedure.performed;
																																								objectProcedure.performer = procedure.performer;
																																								objectProcedure.location = procedure.location;
																																								objectProcedure.reasonCode = procedure.reasonCode;
																																								objectProcedure.bodySite = procedure.bodySite;
																																								objectProcedure.outcome = procedure.outcome;
																																								objectProcedure.complication = procedure.complication;
																																								objectProcedure.followUp = procedure.followUp;
																																								objectProcedure.note = procedure.note;
																																								objectProcedure.focalDevice = procedure.focalDevice;
																																								objectProcedure.usedCode = procedure.usedCode;

																																								newProcedure[index] = objectProcedure;
																																								myEmitter.once('getProcedurePartOfProcedure', function(procedure, index, newProcedure, countProcedure){
																																									qString = {};
																																									qString.procedure_id = procedure.id;
																																									seedPhoenixFHIR.path.GET = {
																																										"ProcedurePartOfProcedure" : {
																																											"location": "%(apikey)s/ProcedurePartOfProcedure",
																																											"query": qString
																																										}
																																									}

																																									var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																									ApiFHIR.get('ProcedurePartOfProcedure', {"apikey": apikey}, {}, function(error, response, body){
																																										procedurePartOfProcedure = JSON.parse(body);
																																										if(procedurePartOfProcedure.err_code == 0){
																																											var objectProcedure = {};
																																											objectProcedure.resourceType = procedure.resourceType;
																																											objectProcedure.id = procedure.id;
																																											objectProcedure.identifier = procedure.identifier;
																																											objectProcedure.definition = procedure.definition;
																																											objectProcedure.basedOn = procedure.basedOn;
																																											var PartOf = {};
																																											PartOf.procedure = procedurePartOfProcedure.data;
																																											objectProcedure.partOf = PartOf;
																																											objectProcedure.status = procedure.status;
																																											objectProcedure.notDone = procedure.notDone;
																																											objectProcedure.notDoneReason = procedure.notDoneReason;
																																											objectProcedure.category = procedure.category;
																																											objectProcedure.code = procedure.code;
																																											objectProcedure.subject = procedure.subject;
																																											objectProcedure.context = procedure.context;
																																											objectProcedure.performed = procedure.performed;
																																											objectProcedure.performer = procedure.performer;
																																											objectProcedure.location = procedure.location;
																																											objectProcedure.reasonCode = procedure.reasonCode;
																																											objectProcedure.bodySite = procedure.bodySite;
																																											objectProcedure.outcome = procedure.outcome;
																																											objectProcedure.complication = procedure.complication;
																																											objectProcedure.followUp = procedure.followUp;
																																											objectProcedure.note = procedure.note;
																																											objectProcedure.focalDevice = procedure.focalDevice;
																																											objectProcedure.usedCode = procedure.usedCode;

																																											newProcedure[index] = objectProcedure;
																																											myEmitter.once('getProcedurePartOfObservation', function(procedure, index, newProcedure, countProcedure){
																																												qString = {};
																																												qString.procedure_id = procedure.id;
																																												seedPhoenixFHIR.path.GET = {
																																													"ProcedurePartOfObservation" : {
																																														"location": "%(apikey)s/ProcedurePartOfObservation",
																																														"query": qString
																																													}
																																												}

																																												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																												ApiFHIR.get('ProcedurePartOfObservation', {"apikey": apikey}, {}, function(error, response, body){
																																													procedurePartOfObservation = JSON.parse(body);
																																													if(procedurePartOfObservation.err_code == 0){
																																														var objectProcedure = {};
																																														objectProcedure.resourceType = procedure.resourceType;
																																														objectProcedure.id = procedure.id;
																																														objectProcedure.identifier = procedure.identifier;
																																														objectProcedure.definition = procedure.definition;
																																														objectProcedure.basedOn = procedure.basedOn;
																																														var PartOf = {};
																																														PartOf.procedure = procedure.partOf.procedure;
																																														PartOf.observation = procedurePartOfObservation.data;
																																														objectProcedure.partOf = PartOf;
																																														objectProcedure.status = procedure.status;
																																														objectProcedure.notDone = procedure.notDone;
																																														objectProcedure.notDoneReason = procedure.notDoneReason;
																																														objectProcedure.category = procedure.category;
																																														objectProcedure.code = procedure.code;
																																														objectProcedure.subject = procedure.subject;
																																														objectProcedure.context = procedure.context;
																																														objectProcedure.performed = procedure.performed;
																																														objectProcedure.performer = procedure.performer;
																																														objectProcedure.location = procedure.location;
																																														objectProcedure.reasonCode = procedure.reasonCode;
																																														objectProcedure.bodySite = procedure.bodySite;
																																														objectProcedure.outcome = procedure.outcome;
																																														objectProcedure.complication = procedure.complication;
																																														objectProcedure.followUp = procedure.followUp;
																																														objectProcedure.note = procedure.note;
																																														objectProcedure.focalDevice = procedure.focalDevice;
																																														objectProcedure.usedCode = procedure.usedCode;

																																														newProcedure[index] = objectProcedure;
																																														myEmitter.once('getProcedurePartOfMedicationAdministration', function(procedure, index, newProcedure, countProcedure){
																																															qString = {};
																																															qString.procedure_id = procedure.id;
																																															seedPhoenixFHIR.path.GET = {
																																																"ProcedurePartOfMedicationAdministration" : {
																																																	"location": "%(apikey)s/ProcedurePartOfMedicationAdministration",
																																																	"query": qString
																																																}
																																															}

																																															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																															ApiFHIR.get('ProcedurePartOfMedicationAdministration', {"apikey": apikey}, {}, function(error, response, body){
																																																procedurePartOfMedicationAdministration = JSON.parse(body);
																																																if(procedurePartOfMedicationAdministration.err_code == 0){
																																																	var objectProcedure = {};
																																																	objectProcedure.resourceType = procedure.resourceType;
																																																	objectProcedure.id = procedure.id;
																																																	objectProcedure.identifier = procedure.identifier;
																																																	objectProcedure.definition = procedure.definition;
																																																	objectProcedure.basedOn = procedure.basedOn;
																																																	var PartOf = {};
																																																	PartOf.procedure = procedure.partOf.procedure;
																																																	PartOf.observation = procedure.partOf.observation;
																																																	PartOf.medicationAdministration = procedurePartOfMedicationAdministration.data;
																																																	objectProcedure.partOf = PartOf;
																																																	objectProcedure.status = procedure.status;
																																																	objectProcedure.notDone = procedure.notDone;
																																																	objectProcedure.notDoneReason = procedure.notDoneReason;
																																																	objectProcedure.category = procedure.category;
																																																	objectProcedure.code = procedure.code;
																																																	objectProcedure.subject = procedure.subject;
																																																	objectProcedure.context = procedure.context;
																																																	objectProcedure.performed = procedure.performed;
																																																	objectProcedure.performer = procedure.performer;
																																																	objectProcedure.location = procedure.location;
																																																	objectProcedure.reasonCode = procedure.reasonCode;
																																																	objectProcedure.bodySite = procedure.bodySite;
																																																	objectProcedure.outcome = procedure.outcome;
																																																	objectProcedure.complication = procedure.complication;
																																																	objectProcedure.followUp = procedure.followUp;
																																																	objectProcedure.note = procedure.note;
																																																	objectProcedure.focalDevice = procedure.focalDevice;
																																																	objectProcedure.usedCode = procedure.usedCode;

																																																	newProcedure[index] = objectProcedure;
																																																	myEmitter.once('getProcedureReasonReferenceCondition', function(procedure, index, newProcedure, countProcedure){
																																																		qString = {};
																																																		qString.procedure_id = procedure.id;
																																																		seedPhoenixFHIR.path.GET = {
																																																			"ProcedureReasonReferenceCondition" : {
																																																				"location": "%(apikey)s/ProcedureReasonReferenceCondition",
																																																				"query": qString
																																																			}
																																																		}

																																																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																																		ApiFHIR.get('ProcedureReasonReferenceCondition', {"apikey": apikey}, {}, function(error, response, body){
																																																			procedureReasonReferenceCondition = JSON.parse(body);
																																																			if(procedureReasonReferenceCondition.err_code == 0){
																																																				var objectProcedure = {};
																																																				objectProcedure.resourceType = procedure.resourceType;
																																																				objectProcedure.id = procedure.id;
																																																				objectProcedure.identifier = procedure.identifier;
																																																				objectProcedure.definition = procedure.definition;
																																																				objectProcedure.basedOn = procedure.basedOn;
																																																				objectProcedure.partOf = procedure.partOf;
																																																				objectProcedure.status = procedure.status;
																																																				objectProcedure.notDone = procedure.notDone;
																																																				objectProcedure.notDoneReason = procedure.notDoneReason;
																																																				objectProcedure.category = procedure.category;
																																																				objectProcedure.code = procedure.code;
																																																				objectProcedure.subject = procedure.subject;
																																																				objectProcedure.context = procedure.context;
																																																				objectProcedure.performed = procedure.performed;
																																																				objectProcedure.performer = procedure.performer;
																																																				objectProcedure.location = procedure.location;
																																																				objectProcedure.reasonCode = procedure.reasonCode;
																																																				var ReasonReference = {};
																																																				ReasonReference.condition = procedureReasonReferenceCondition.data;
																																																				objectProcedure.reasonReference = ReasonReference;
																																																				objectProcedure.bodySite = procedure.bodySite;
																																																				objectProcedure.outcome = procedure.outcome;
																																																				objectProcedure.complication = procedure.complication;
																																																				objectProcedure.followUp = procedure.followUp;
																																																				objectProcedure.note = procedure.note;
																																																				objectProcedure.focalDevice = procedure.focalDevice;
																																																				objectProcedure.usedCode = procedure.usedCode;

																																																				newProcedure[index] = objectProcedure;
																																																				myEmitter.once('getProcedureReasonReferenceObservation', function(procedure, index, newProcedure, countProcedure){
																																																					qString = {};
																																																					qString.procedure_id = procedure.id;
																																																					seedPhoenixFHIR.path.GET = {
																																																						"ProcedureReasonReferenceObservation" : {
																																																							"location": "%(apikey)s/ProcedureReasonReferenceObservation",
																																																							"query": qString
																																																						}
																																																					}

																																																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																																					ApiFHIR.get('ProcedureReasonReferenceObservation', {"apikey": apikey}, {}, function(error, response, body){
																																																						procedureReasonReferenceObservation = JSON.parse(body);
																																																						if(procedureReasonReferenceObservation.err_code == 0){
																																																							var objectProcedure = {};
																																																							objectProcedure.resourceType = procedure.resourceType;
																																																							objectProcedure.id = procedure.id;
																																																							objectProcedure.identifier = procedure.identifier;
																																																							objectProcedure.definition = procedure.definition;
																																																							objectProcedure.basedOn = procedure.basedOn;
																																																							objectProcedure.partOf = procedure.partOf;
																																																							objectProcedure.status = procedure.status;
																																																							objectProcedure.notDone = procedure.notDone;
																																																							objectProcedure.notDoneReason = procedure.notDoneReason;
																																																							objectProcedure.category = procedure.category;
																																																							objectProcedure.code = procedure.code;
																																																							objectProcedure.subject = procedure.subject;
																																																							objectProcedure.context = procedure.context;
																																																							objectProcedure.performed = procedure.performed;
																																																							objectProcedure.performer = procedure.performer;
																																																							objectProcedure.location = procedure.location;
																																																							objectProcedure.reasonCode = procedure.reasonCode;
																																																							var ReasonReference = {};
																																																							ReasonReference.condition = procedure.reasonReference.condition;
																																																							ReasonReference.observation = procedureReasonReferenceObservation.data;
																																																							objectProcedure.reasonReference = ReasonReference;
																																																							objectProcedure.bodySite = procedure.bodySite;
																																																							objectProcedure.outcome = procedure.outcome;
																																																							objectProcedure.complication = procedure.complication;
																																																							objectProcedure.followUp = procedure.followUp;
																																																							objectProcedure.note = procedure.note;
																																																							objectProcedure.focalDevice = procedure.focalDevice;
																																																							objectProcedure.usedCode = procedure.usedCode;

																																																							newProcedure[index] = objectProcedure;
																																																							myEmitter.once('getProcedureReport', function(procedure, index, newProcedure, countProcedure){
																																																								qString = {};
																																																								qString.procedure_id = procedure.id;
																																																								seedPhoenixFHIR.path.GET = {
																																																									"ProcedureReport" : {
																																																										"location": "%(apikey)s/ProcedureReport",
																																																										"query": qString
																																																									}
																																																								}

																																																								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																																								ApiFHIR.get('ProcedureReport', {"apikey": apikey}, {}, function(error, response, body){
																																																									procedureReport = JSON.parse(body);
																																																									if(procedureReport.err_code == 0){
																																																										var objectProcedure = {};
																																																										objectProcedure.resourceType = procedure.resourceType;
																																																										objectProcedure.id = procedure.id;
																																																										objectProcedure.identifier = procedure.identifier;
																																																										objectProcedure.definition = procedure.definition;
																																																										objectProcedure.basedOn = procedure.basedOn;
																																																										objectProcedure.partOf = procedure.partOf;
																																																										objectProcedure.status = procedure.status;
																																																										objectProcedure.notDone = procedure.notDone;
																																																										objectProcedure.notDoneReason = procedure.notDoneReason;
																																																										objectProcedure.category = procedure.category;
																																																										objectProcedure.code = procedure.code;
																																																										objectProcedure.subject = procedure.subject;
																																																										objectProcedure.context = procedure.context;
																																																										objectProcedure.performed = procedure.performed;
																																																										objectProcedure.performer = procedure.performer;
																																																										objectProcedure.location = procedure.location;
																																																										objectProcedure.reasonCode = procedure.reasonCode;
																																																										objectProcedure.reasonReference = procedure.reasonReference;
																																																										objectProcedure.bodySite = procedure.bodySite;
																																																										objectProcedure.outcome = procedure.outcome;
																																																										objectProcedure.report = procedureReport.data;
																																																										objectProcedure.complication = procedure.complication;
																																																										objectProcedure.followUp = procedure.followUp;
																																																										objectProcedure.note = procedure.note;
																																																										objectProcedure.focalDevice = procedure.focalDevice;
																																																										objectProcedure.usedCode = procedure.usedCode;

																																																										newProcedure[index] = objectProcedure;
																																																										myEmitter.once('getProcedureComplicationDetail', function(procedure, index, newProcedure, countProcedure){
																																																											qString = {};
																																																											qString.procedure_id = procedure.id;
																																																											seedPhoenixFHIR.path.GET = {
																																																												"ProcedureComplicationDetail" : {
																																																													"location": "%(apikey)s/ProcedureComplicationDetail",
																																																													"query": qString
																																																												}
																																																											}

																																																											var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																																											ApiFHIR.get('ProcedureComplicationDetail', {"apikey": apikey}, {}, function(error, response, body){
																																																												procedureComplicationDetail = JSON.parse(body);
																																																												if(procedureComplicationDetail.err_code == 0){
																																																													var objectProcedure = {};
																																																													objectProcedure.resourceType = procedure.resourceType;
																																																													objectProcedure.id = procedure.id;
																																																													objectProcedure.identifier = procedure.identifier;
																																																													objectProcedure.definition = procedure.definition;
																																																													objectProcedure.basedOn = procedure.basedOn;
																																																													objectProcedure.partOf = procedure.partOf;
																																																													objectProcedure.status = procedure.status;
																																																													objectProcedure.notDone = procedure.notDone;
																																																													objectProcedure.notDoneReason = procedure.notDoneReason;
																																																													objectProcedure.category = procedure.category;
																																																													objectProcedure.code = procedure.code;
																																																													objectProcedure.subject = procedure.subject;
																																																													objectProcedure.context = procedure.context;
																																																													objectProcedure.performed = procedure.performed;
																																																													objectProcedure.performer = procedure.performer;
																																																													objectProcedure.location = procedure.location;
																																																													objectProcedure.reasonCode = procedure.reasonCode;
																																																													objectProcedure.reasonReference = procedure.reasonReference;
																																																													objectProcedure.bodySite = procedure.bodySite;
																																																													objectProcedure.outcome = procedure.outcome;
																																																													objectProcedure.report = procedure.report;
																																																													objectProcedure.complication = procedure.complication;
																																																													objectProcedure.complicationDetail = procedureComplicationDetail.data;
																																																													objectProcedure.followUp = procedure.followUp;
																																																													objectProcedure.note = procedure.note;
																																																													objectProcedure.focalDevice = procedure.focalDevice;
																																																													objectProcedure.usedCode = procedure.usedCode;

																																																													newProcedure[index] = objectProcedure;
																																																													myEmitter.once('getProcedureUsedReferenceDevice', function(procedure, index, newProcedure, countProcedure){
																																																														qString = {};
																																																														qString.procedure_id = procedure.id;
																																																														seedPhoenixFHIR.path.GET = {
																																																															"ProcedureUsedReferenceDevice" : {
																																																																"location": "%(apikey)s/ProcedureUsedReferenceDevice",
																																																																"query": qString
																																																															}
																																																														}

																																																														var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																																														ApiFHIR.get('ProcedureUsedReferenceDevice', {"apikey": apikey}, {}, function(error, response, body){
																																																															procedureUsedReferenceDevice = JSON.parse(body);
																																																															if(procedureUsedReferenceDevice.err_code == 0){
																																																																var objectProcedure = {};
																																																																objectProcedure.resourceType = procedure.resourceType;
																																																																objectProcedure.id = procedure.id;
																																																																objectProcedure.identifier = procedure.identifier;
																																																																objectProcedure.definition = procedure.definition;
																																																																objectProcedure.basedOn = procedure.basedOn;
																																																																objectProcedure.partOf = procedure.partOf;
																																																																objectProcedure.status = procedure.status;
																																																																objectProcedure.notDone = procedure.notDone;
																																																																objectProcedure.notDoneReason = procedure.notDoneReason;
																																																																objectProcedure.category = procedure.category;
																																																																objectProcedure.code = procedure.code;
																																																																objectProcedure.subject = procedure.subject;
																																																																objectProcedure.context = procedure.context;
																																																																objectProcedure.performed = procedure.performed;
																																																																objectProcedure.performer = procedure.performer;
																																																																objectProcedure.location = procedure.location;
																																																																objectProcedure.reasonCode = procedure.reasonCode;
																																																																objectProcedure.reasonReference = procedure.reasonReference;
																																																																objectProcedure.bodySite = procedure.bodySite;
																																																																objectProcedure.outcome = procedure.outcome;
																																																																objectProcedure.report = procedure.report;
																																																																objectProcedure.complication = procedure.complication;
																																																																objectProcedure.complicationDetail = procedure.complicationDetail;
																																																																objectProcedure.followUp = procedure.followUp;
																																																																objectProcedure.note = procedure.note;
																																																																objectProcedure.focalDevice = procedure.focalDevice;
																																																																var UserReference = {};
																																																																UserReference.device = procedureUsedReferenceDevice.data;
																																																																objectProcedure.userReference = UserReference;
																																																																objectProcedure.usedCode = procedure.usedCode;

																																																																newProcedure[index] = objectProcedure;
																																																																myEmitter.once('getProcedureUsedReferenceMedication', function(procedure, index, newProcedure, countProcedure){
																																																																	qString = {};
																																																																	qString.procedure_id = procedure.id;
																																																																	seedPhoenixFHIR.path.GET = {
																																																																		"ProcedureUsedReferenceMedication" : {
																																																																			"location": "%(apikey)s/ProcedureUsedReferenceMedication",
																																																																			"query": qString
																																																																		}
																																																																	}

																																																																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																																																	ApiFHIR.get('ProcedureUsedReferenceMedication', {"apikey": apikey}, {}, function(error, response, body){
																																																																		procedureUsedReferenceMedication = JSON.parse(body);
																																																																		if(procedureUsedReferenceMedication.err_code == 0){
																																																																			var objectProcedure = {};
																																																																			objectProcedure.resourceType = procedure.resourceType;
																																																																			objectProcedure.id = procedure.id;
																																																																			objectProcedure.identifier = procedure.identifier;
																																																																			objectProcedure.definition = procedure.definition;
																																																																			objectProcedure.basedOn = procedure.basedOn;
																																																																			objectProcedure.partOf = procedure.partOf;
																																																																			objectProcedure.status = procedure.status;
																																																																			objectProcedure.notDone = procedure.notDone;
																																																																			objectProcedure.notDoneReason = procedure.notDoneReason;
																																																																			objectProcedure.category = procedure.category;
																																																																			objectProcedure.code = procedure.code;
																																																																			objectProcedure.subject = procedure.subject;
																																																																			objectProcedure.context = procedure.context;
																																																																			objectProcedure.performed = procedure.performed;
																																																																			objectProcedure.performer = procedure.performer;
																																																																			objectProcedure.location = procedure.location;
																																																																			objectProcedure.reasonCode = procedure.reasonCode;
																																																																			objectProcedure.reasonReference = procedure.reasonReference;
																																																																			objectProcedure.bodySite = procedure.bodySite;
																																																																			objectProcedure.outcome = procedure.outcome;
																																																																			objectProcedure.report = procedure.report;
																																																																			objectProcedure.complication = procedure.complication;
																																																																			objectProcedure.complicationDetail = procedure.complicationDetail;
																																																																			objectProcedure.followUp = procedure.followUp;
																																																																			objectProcedure.note = procedure.note;
																																																																			objectProcedure.focalDevice = procedure.focalDevice;
																																																																			var UserReference = {};
																																																																			UserReference.device = procedure.userReference.device;
																																																																			UserReference.medication = procedureUsedReferenceMedication.data;
																																																																			objectProcedure.userReference = UserReference;
																																																																			objectProcedure.usedCode = procedure.usedCode;

																																																																			newProcedure[index] = objectProcedure;
																																																																			myEmitter.once('getProcedureUsedReferenceSubstance', function(procedure, index, newProcedure, countProcedure){
																																																																				qString = {};
																																																																				qString.procedure_id = procedure.id;
																																																																				seedPhoenixFHIR.path.GET = {
																																																																					"ProcedureUsedReferenceSubstance" : {
																																																																						"location": "%(apikey)s/ProcedureUsedReferenceSubstance",
																																																																						"query": qString
																																																																					}
																																																																				}

																																																																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																																																				ApiFHIR.get('ProcedureUsedReferenceSubstance', {"apikey": apikey}, {}, function(error, response, body){
																																																																					procedureUsedReferenceSubstance = JSON.parse(body);
																																																																					if(procedureUsedReferenceSubstance.err_code == 0){
																																																																						var objectProcedure = {};
																																																																						objectProcedure.resourceType = procedure.resourceType;
																																																																						objectProcedure.id = procedure.id;
																																																																						objectProcedure.identifier = procedure.identifier;
																																																																						objectProcedure.definition = procedure.definition;
																																																																						objectProcedure.basedOn = procedure.basedOn;
																																																																						objectProcedure.partOf = procedure.partOf;
																																																																						objectProcedure.status = procedure.status;
																																																																						objectProcedure.notDone = procedure.notDone;
																																																																						objectProcedure.notDoneReason = procedure.notDoneReason;
																																																																						objectProcedure.category = procedure.category;
																																																																						objectProcedure.code = procedure.code;
																																																																						objectProcedure.subject = procedure.subject;
																																																																						objectProcedure.context = procedure.context;
																																																																						objectProcedure.performed = procedure.performed;
																																																																						objectProcedure.performer = procedure.performer;
																																																																						objectProcedure.location = procedure.location;
																																																																						objectProcedure.reasonCode = procedure.reasonCode;
																																																																						objectProcedure.reasonReference = procedure.reasonReference;
																																																																						objectProcedure.bodySite = procedure.bodySite;
																																																																						objectProcedure.outcome = procedure.outcome;
																																																																						objectProcedure.report = procedure.report;
																																																																						objectProcedure.complication = procedure.complication;
																																																																						objectProcedure.complicationDetail = procedure.complicationDetail;
																																																																						objectProcedure.followUp = procedure.followUp;
																																																																						objectProcedure.note = procedure.note;
																																																																						objectProcedure.focalDevice = procedure.focalDevice;
																																																																						var UserReference = {};
																																																																						UserReference.device = procedure.userReference.device;
																																																																						UserReference.medication = procedure.userReference.medication;
																																																																						UserReference.procedureUsedReferenceSubstance = procedureUsedReferenceSubstance.data;
																																																																						objectProcedure.userReference = UserReference;
																																																																						objectProcedure.usedCode = procedure.usedCode;

																																																																						newProcedure[index] = objectProcedure;
																																																																						if(index == countProcedure -1 ){
																																																																							res.json({"err_code": 0, "data":newProcedure});
																																																																						}
																																																																					}else{
																																																																						res.json(procedureUsedReferenceSubstance);			
																																																																					}
																																																																				})
																																																																			})
																																																																			myEmitter.emit('getProcedureUsedReferenceSubstance', objectProcedure, index, newProcedure, countProcedure);																																																	
																																																																		}else{
																																																																			res.json(procedureUsedReferenceMedication);			
																																																																		}
																																																																	})
																																																																})
																																																																myEmitter.emit('getProcedureUsedReferenceMedication', objectProcedure, index, newProcedure, countProcedure);																																																	
																																																															}else{
																																																																res.json(procedureUsedReferenceDevice);			
																																																															}
																																																														})
																																																													})
																																																													myEmitter.emit('getProcedureUsedReferenceDevice', objectProcedure, index, newProcedure, countProcedure);																																																	
																																																												}else{
																																																													res.json(procedureComplicationDetail);			
																																																												}
																																																											})
																																																										})
																																																										myEmitter.emit('getProcedureComplicationDetail', objectProcedure, index, newProcedure, countProcedure);																																																	
																																																									}else{
																																																										res.json(procedureReport);			
																																																									}
																																																								})
																																																							})
																																																							myEmitter.emit('getProcedureReport', objectProcedure, index, newProcedure, countProcedure);																																																	
																																																						}else{
																																																							res.json(procedureReasonReferenceObservation);			
																																																						}
																																																					})
																																																				})
																																																				myEmitter.emit('getProcedureReasonReferenceObservation', objectProcedure, index, newProcedure, countProcedure);																																																	
																																																			}else{
																																																				res.json(procedureReasonReferenceCondition);			
																																																			}
																																																		})
																																																	})
																																																	myEmitter.emit('getProcedureReasonReferenceCondition', objectProcedure, index, newProcedure, countProcedure);																																																	
																																																}else{
																																																	res.json(procedurePartOfMedicationAdministration);			
																																																}
																																															})
																																														})
																																														myEmitter.emit('getProcedurePartOfMedicationAdministration', objectProcedure, index, newProcedure, countProcedure);																																																	
																																													}else{
																																														res.json(procedurePartOfObservation);			
																																													}
																																												})
																																											})
																																											myEmitter.emit('getProcedurePartOfObservation', objectProcedure, index, newProcedure, countProcedure);																																																	
																																										}else{
																																											res.json(procedurePartOfProcedure);			
																																										}
																																									})
																																								})
																																								myEmitter.emit('getProcedurePartOfProcedure', objectProcedure, index, newProcedure, countProcedure);																																																	
																																							}else{
																																								res.json(procedureBasedOnReferralRequest);			
																																							}
																																						})
																																					})
																																					myEmitter.emit('getProcedureBasedOnReferralRequest', objectProcedure, index, newProcedure, countProcedure);																																																	
																																				}else{
																																					res.json(procedureBasedOnProcedureRequest);			
																																				}
																																			})
																																		})
																																		myEmitter.emit('getProcedureBasedOnProcedureRequest', objectProcedure, index, newProcedure, countProcedure);																																																	
																																	}else{
																																		res.json(procedureBasedOnCarePlan);			
																																	}
																																})
																															})
																															myEmitter.emit('getProcedureBasedOnCarePlan', objectProcedure, index, newProcedure, countProcedure);																																																	
																														}else{
																															res.json(procedureDefinitionHealthcareService);			
																														}
																													})
																												})
																												myEmitter.emit('getProcedureDefinitionHealthcareService', objectProcedure, index, newProcedure, countProcedure);																		
																											}else{
																												res.json(procedureDefinitionActivityDefinition);			
																											}
																										})
																									})
																									myEmitter.emit('getProcedureDefinitionActivityDefinition', objectProcedure, index, newProcedure, countProcedure);																			
																								}else{
																									res.json(procedureDefinitionPlanDefinition);			
																								}
																							})
																						})
																						myEmitter.emit('getProcedureDefinitionPlanDefinition', objectProcedure, index, newProcedure, countProcedure);																			
																					}else{
																						res.json(annotation);			
																					}
																				})
																			})
																			myEmitter.emit('getNote', objectProcedure, index, newProcedure, countProcedure);																			
																		}else{
																			res.json(procedureFocalDevice);			
																		}
																	})
																})
																myEmitter.emit('getProcedureFocalDevice', objectProcedure, index, newProcedure, countProcedure);
															}else{
																res.json(procedurePerformer);			
															}
														})
													})
													myEmitter.emit('getProcedurePerformer', objectProcedure, index, newProcedure, countProcedure);
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", procedure.data[i], i, newProcedure, procedure.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Procedure is empty."});	
								}
							}else{
								res.json(procedure);
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
					var procedureId = req.params.procedure_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureId, 'PROCEDURE', function(resProcedureID){
								if(resProcedureID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.procedure_id = procedureId;
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
						  			qString.procedure_id = procedureId;
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
									res.json({"err_code": 501, "err_msg": "Procedure Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		procedurePerformer: function getProcedurePerformer(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var procedureId = req.params.procedure_id;
			var procedurePerformerId = req.params.procedure_performer_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureId, 'PROCEDURE', function(resProcedure){
						if(resProcedure.err_code > 0){
							if(typeof procedurePerformerId !== 'undefined' && !validator.isEmpty(procedurePerformerId)){
								checkUniqeValue(apikey, "PERFORMER_ID|" + procedurePerformerId, 'PROCEDURE_PERFORMER', function(resProcedurePerformerID){
									if(resProcedurePerformerID.err_code > 0){
										//get procedurePerformer
										qString = {};
										qString.procedure_id = procedureId;
										qString._id = procedurePerformerId;
										seedPhoenixFHIR.path.GET = {
											"ProcedurePerformer" : {
												"location": "%(apikey)s/ProcedurePerformer",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ProcedurePerformer', {"apikey": apikey}, {}, function(error, response, body){
											procedurePerformer = JSON.parse(body);
											if(procedurePerformer.err_code == 0){
												res.json({"err_code": 0, "data":procedurePerformer.data});	
											}else{
												res.json(procedurePerformer);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Procedure Performer Id not found"});		
									}
								})
							}else{
								//get procedurePerformer
								qString = {};
								qString.procedure_id = procedureId;
								seedPhoenixFHIR.path.GET = {
									"ProcedurePerformer" : {
										"location": "%(apikey)s/ProcedurePerformer",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ProcedurePerformer', {"apikey": apikey}, {}, function(error, response, body){
									procedurePerformer = JSON.parse(body);
									if(procedurePerformer.err_code == 0){
										res.json({"err_code": 0, "data":procedurePerformer.data});	
									}else{
										res.json(procedurePerformer);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Procedure Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		procedureFocalDevice: function getProcedureFocalDevice(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var procedureId = req.params.procedure_id;
			var procedureFocalDeviceId = req.params.procedure_focal_device_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureId, 'PROCEDURE', function(resProcedure){
						if(resProcedure.err_code > 0){
							if(typeof procedureFocalDeviceId !== 'undefined' && !validator.isEmpty(procedureFocalDeviceId)){
								checkUniqeValue(apikey, "FOCAL_DEVICE_ID|" + procedureFocalDeviceId, 'PROCEDURE_FOCAL_DEVICE', function(resProcedureFocalDeviceID){
									if(resProcedureFocalDeviceID.err_code > 0){
										//get procedureFocalDevice
										qString = {};
										qString.procedure_id = procedureId;
										qString._id = procedureFocalDeviceId;
										seedPhoenixFHIR.path.GET = {
											"ProcedureFocalDevice" : {
												"location": "%(apikey)s/ProcedureFocalDevice",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ProcedureFocalDevice', {"apikey": apikey}, {}, function(error, response, body){
											procedureFocalDevice = JSON.parse(body);
											if(procedureFocalDevice.err_code == 0){
												res.json({"err_code": 0, "data":procedureFocalDevice.data});	
											}else{
												res.json(procedureFocalDevice);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Procedure Focal Device Id not found"});		
									}
								})
							}else{
								//get procedureFocalDevice
								qString = {};
								qString.procedure_id = procedureId;
								seedPhoenixFHIR.path.GET = {
									"ProcedureFocalDevice" : {
										"location": "%(apikey)s/ProcedureFocalDevice",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ProcedureFocalDevice', {"apikey": apikey}, {}, function(error, response, body){
									procedureFocalDevice = JSON.parse(body);
									if(procedureFocalDevice.err_code == 0){
										res.json({"err_code": 0, "data":procedureFocalDevice.data});	
									}else{
										res.json(procedureFocalDevice);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Procedure Id not found"});		
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
		procedure : function addProcedure(req, res){
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
definition.planDefinition|definitionPlanDefinition||
definition.activityDefinition|definitionActivityDefinition||
definition.healthcareService|definitionHealthcareService||
basedOn.carePlan|basedOnCarePlan||
basedOn.procedureRequest|basedOnProcedureRequest||
basedOn.referralRequest|basedOnReferralRequest||
partOf.procedure|partOfProcedure||
partOf.observation|partOfObservation||
partOf.medicationAdministration|partOfMedicationAdministration||
status|status||nn
notDone|notDone|boolean|
notDoneReason|notDoneReason||
category|category||
code|code||
subject.patient|subjectPatient||
subject.group|subjectGroup||
context.encounter|contextEncounter||
context.episodeOfCare|contextEpisodeOfCare||
performed.performedDateTime|performedPerformedDateTime|date|
performed.period|performedPeriod|period|
performer.role|performerRole||
performer.actor.practitioner|performerActorPractitioner||
performer.actor.organization|performerActorOrganization||
performer.actor.patient|performerActorPatient||
performer.actor.relatedPerson|performerActorRelatedPerson||
performer.actor.device|performerActorDevice||
performer.onBehalfOf|performerOnBehalfOf||
location|location||
reasonCode|reasonCode||
reasonReference.condition|reasonReferenceCondition||
reasonReference.observation|reasonReferenceObservation||
bodySite|bodySite||
outcome|outcome||
report|report||
complication|complication||
complicationDetail|complicationDetail||
followUp|followUp||
note.author.authorReference.practitioner|noteAuthorPractitioner||
note.author.authorReference.patient|noteAuthorPatient||
note.author.authorReference.relatedPerson|noteAuthorRelatedPerson||
note.author.authorString|noteAuthorAuthorString||
note.time|noteTime|date|
note.text|noteText||
focalDevice.action|focalDeviceAction||
focalDevice.manipulated|focalDeviceManipulated||
usedReference.device|usedReferenceDevice||
usedReference.medication|usedReferenceMedication||
usedReference.substance|usedReferenceSubstance||
usedCode|usedCode||
*/
			if(typeof req.body.definition.planDefinition !== 'undefined'){
				var definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					definitionPlanDefinition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'definition plan definition' in json Procedure request.";
			}

			if(typeof req.body.definition.activityDefinition !== 'undefined'){
				var definitionActivityDefinition =  req.body.definition.activityDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionActivityDefinition)){
					definitionActivityDefinition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'definition activity definition' in json Procedure request.";
			}

			if(typeof req.body.definition.healthcareService !== 'undefined'){
				var definitionHealthcareService =  req.body.definition.healthcareService.trim().toLowerCase();
				if(validator.isEmpty(definitionHealthcareService)){
					definitionHealthcareService = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'definition healthcare service' in json Procedure request.";
			}

			if(typeof req.body.basedOn.carePlan !== 'undefined'){
				var basedOnCarePlan =  req.body.basedOn.carePlan.trim().toLowerCase();
				if(validator.isEmpty(basedOnCarePlan)){
					basedOnCarePlan = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on care plan' in json Procedure request.";
			}

			if(typeof req.body.basedOn.procedureRequest !== 'undefined'){
				var basedOnProcedureRequest =  req.body.basedOn.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnProcedureRequest)){
					basedOnProcedureRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on procedure request' in json Procedure request.";
			}

			if(typeof req.body.basedOn.referralRequest !== 'undefined'){
				var basedOnReferralRequest =  req.body.basedOn.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnReferralRequest)){
					basedOnReferralRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on referral request' in json Procedure request.";
			}

			if(typeof req.body.partOf.procedure !== 'undefined'){
				var partOfProcedure =  req.body.partOf.procedure.trim().toLowerCase();
				if(validator.isEmpty(partOfProcedure)){
					partOfProcedure = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'part of procedure' in json Procedure request.";
			}

			if(typeof req.body.partOf.observation !== 'undefined'){
				var partOfObservation =  req.body.partOf.observation.trim().toLowerCase();
				if(validator.isEmpty(partOfObservation)){
					partOfObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'part of observation' in json Procedure request.";
			}

			if(typeof req.body.partOf.medicationAdministration !== 'undefined'){
				var partOfMedicationAdministration =  req.body.partOf.medicationAdministration.trim().toLowerCase();
				if(validator.isEmpty(partOfMedicationAdministration)){
					partOfMedicationAdministration = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'part of medication administration' in json Procedure request.";
			}

			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Procedure status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Procedure request.";
			}

			if (typeof req.body.notDone !== 'undefined') {
				var notDone = req.body.notDone.trim().toLowerCase();
					if(validator.isEmpty(notDone)){
						notDone = "false";
					}
				if(notDone === "true" || notDone === "false"){
					notDone = notDone;
				} else {
					err_code = 2;
					err_msg = "Procedure not done is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'not done' in json Procedure request.";
			}

			if(typeof req.body.notDoneReason !== 'undefined'){
				var notDoneReason =  req.body.notDoneReason.trim().toLowerCase();
				if(validator.isEmpty(notDoneReason)){
					notDoneReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'not done reason' in json Procedure request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Procedure request.";
			}

			if(typeof req.body.code !== 'undefined'){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					code = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Procedure request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Procedure request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Procedure request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Procedure request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Procedure request.";
			}

			if(typeof req.body.performed.performedDateTime !== 'undefined'){
				var performedPerformedDateTime =  req.body.performed.performedDateTime;
				if(validator.isEmpty(performedPerformedDateTime)){
					performedPerformedDateTime = "";
				}else{
					if(!regex.test(performedPerformedDateTime)){
						err_code = 2;
						err_msg = "Procedure performed performed date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performed performed date time' in json Procedure request.";
			}

			if (typeof req.body.performed.period !== 'undefined') {
			  var performedPeriod = req.body.performed.period;
 				if(validator.isEmpty(performedPeriod)) {
				  var performedPeriodStart = "";
				  var performedPeriodEnd = "";
				} else {
				  if (performedPeriod.indexOf("to") > 0) {
				    arrPerformedPeriod = performedPeriod.split("to");
				    var performedPeriodStart = arrPerformedPeriod[0];
				    var performedPeriodEnd = arrPerformedPeriod[1];
				    if (!regex.test(performedPeriodStart) && !regex.test(performedPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Procedure performed period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Procedure performed period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'performed period' in json Procedure request.";
			}

			if(typeof req.body.performer.role !== 'undefined'){
				var performerRole =  req.body.performer.role.trim().toLowerCase();
				if(validator.isEmpty(performerRole)){
					performerRole = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer role' in json Procedure request.";
			}

			if(typeof req.body.performer.actor.practitioner !== 'undefined'){
				var performerActorPractitioner =  req.body.performer.actor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerActorPractitioner)){
					performerActorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor practitioner' in json Procedure request.";
			}

			if(typeof req.body.performer.actor.organization !== 'undefined'){
				var performerActorOrganization =  req.body.performer.actor.organization.trim().toLowerCase();
				if(validator.isEmpty(performerActorOrganization)){
					performerActorOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor organization' in json Procedure request.";
			}

			if(typeof req.body.performer.actor.patient !== 'undefined'){
				var performerActorPatient =  req.body.performer.actor.patient.trim().toLowerCase();
				if(validator.isEmpty(performerActorPatient)){
					performerActorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor patient' in json Procedure request.";
			}

			if(typeof req.body.performer.actor.relatedPerson !== 'undefined'){
				var performerActorRelatedPerson =  req.body.performer.actor.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(performerActorRelatedPerson)){
					performerActorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor related person' in json Procedure request.";
			}

			if(typeof req.body.performer.actor.device !== 'undefined'){
				var performerActorDevice =  req.body.performer.actor.device.trim().toLowerCase();
				if(validator.isEmpty(performerActorDevice)){
					performerActorDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor device' in json Procedure request.";
			}

			if(typeof req.body.performer.onBehalfOf !== 'undefined'){
				var performerOnBehalfOf =  req.body.performer.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(performerOnBehalfOf)){
					performerOnBehalfOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer on behalf of' in json Procedure request.";
			}

			if(typeof req.body.location !== 'undefined'){
				var location =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(location)){
					location = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'location' in json Procedure request.";
			}

			if(typeof req.body.reasonCode !== 'undefined'){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					reasonCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason code' in json Procedure request.";
			}

			if(typeof req.body.reasonReference.condition !== 'undefined'){
				var reasonReferenceCondition =  req.body.reasonReference.condition.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceCondition)){
					reasonReferenceCondition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference condition' in json Procedure request.";
			}

			if(typeof req.body.reasonReference.observation !== 'undefined'){
				var reasonReferenceObservation =  req.body.reasonReference.observation.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceObservation)){
					reasonReferenceObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference observation' in json Procedure request.";
			}

			if(typeof req.body.bodySite !== 'undefined'){
				var bodySite =  req.body.bodySite.trim().toLowerCase();
				if(validator.isEmpty(bodySite)){
					bodySite = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'body site' in json Procedure request.";
			}

			if(typeof req.body.outcome !== 'undefined'){
				var outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					outcome = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'outcome' in json Procedure request.";
			}

			if(typeof req.body.report !== 'undefined'){
				var report =  req.body.report.trim().toLowerCase();
				if(validator.isEmpty(report)){
					report = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'report' in json Procedure request.";
			}

			if(typeof req.body.complication !== 'undefined'){
				var complication =  req.body.complication.trim().toLowerCase();
				if(validator.isEmpty(complication)){
					complication = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'complication' in json Procedure request.";
			}

			if(typeof req.body.complicationDetail !== 'undefined'){
				var complicationDetail =  req.body.complicationDetail.trim().toLowerCase();
				if(validator.isEmpty(complicationDetail)){
					complicationDetail = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'complication detail' in json Procedure request.";
			}

			if(typeof req.body.followUp !== 'undefined'){
				var followUp =  req.body.followUp.trim().toLowerCase();
				if(validator.isEmpty(followUp)){
					followUp = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'follow up' in json Procedure request.";
			}
			
			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					noteAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Procedure request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					noteAuthorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Procedure request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					noteAuthorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Procedure request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Procedure request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Procedure note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Procedure request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note text' in json Procedure request.";
			}

			if(typeof req.body.focalDevice.action !== 'undefined'){
				var focalDeviceAction =  req.body.focalDevice.action.trim().toLowerCase();
				if(validator.isEmpty(focalDeviceAction)){
					focalDeviceAction = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'focal device action' in json Procedure request.";
			}

			if(typeof req.body.focalDevice.manipulated !== 'undefined'){
				var focalDeviceManipulated =  req.body.focalDevice.manipulated.trim().toLowerCase();
				if(validator.isEmpty(focalDeviceManipulated)){
					focalDeviceManipulated = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'focal device manipulated' in json Procedure request.";
			}

			if(typeof req.body.usedReference.device !== 'undefined'){
				var usedReferenceDevice =  req.body.usedReference.device.trim().toLowerCase();
				if(validator.isEmpty(usedReferenceDevice)){
					usedReferenceDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'used reference device' in json Procedure request.";
			}

			if(typeof req.body.usedReference.medication !== 'undefined'){
				var usedReferenceMedication =  req.body.usedReference.medication.trim().toLowerCase();
				if(validator.isEmpty(usedReferenceMedication)){
					usedReferenceMedication = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'used reference medication' in json Procedure request.";
			}

			if(typeof req.body.usedReference.substance !== 'undefined'){
				var usedReferenceSubstance =  req.body.usedReference.substance.trim().toLowerCase();
				if(validator.isEmpty(usedReferenceSubstance)){
					usedReferenceSubstance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'used reference substance' in json Procedure request.";
			}

			if(typeof req.body.usedCode !== 'undefined'){
				var usedCode =  req.body.usedCode.trim().toLowerCase();
				if(validator.isEmpty(usedCode)){
					usedCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'used code' in json Procedure request.";
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
														var procedureId = 'pro' + unicId;
														var procedurePerformerId = 'prp' + unicId;
														var procedureFocalDeviceId = 'prf' + unicId;
														var noteId = 'apr' + unicId;
								
													
														dataProcedure = {
															"procedure_id" : procedureId,
															"part_of_procedure" : partOfProcedure,
															"status" : status,
															"not_done" : notDone,
															"not_done_reason" : notDoneReason,
															"category" : category,
															"code" : code,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"context_encounter" : contextEncounter,
															"context_episode_of_care" : contextEpisodeOfCare,
															"performed_date_time" : performedPerformedDateTime,
															"performed_period_start" : performedPeriodStart,
															"performed_period_end" : performedPeriodEnd,
															"location" : location,
															"reason_code" : reasonCode,
															"body_site" : bodySite,
															"outcome" : outcome,
															"complication" : complication,
															"follow_up" : followUp,
															"used_code" : usedCode
														}
														console.log(dataProcedure);
														ApiFHIR.post('procedure', {"apikey": apikey}, {body: dataProcedure, json: true}, function(error, response, body){
															procedure = body;
															if(procedure.err_code > 0){
																res.json(procedure);	
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
																							"procedure_id": procedureId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
													
														//ProcedurePerformer
														dataProcedurePerformer = {
															"performer_id" : procedurePerformerId,
															"role" : performerRole,
															"actor_practitioner" : performerActorPractitioner,
															"actor_organization" : performerActorOrganization,
															"actor_patient" : performerActorPatient,
															"actor_related_person" : performerActorRelatedPerson,
															"actor_device" : performerActorDevice,
															"on_behalf_of" : performerOnBehalfOf,
															"procedure_id" : procedureId
														}
														ApiFHIR.post('procedurePerformer', {"apikey": apikey}, {body: dataProcedurePerformer, json: true}, function(error, response, body){
															procedurePerformer = body;
															if(procedurePerformer.err_code > 0){
																res.json(procedurePerformer);	
																console.log("ok");
															}
														});
														
														//ProcedureFocalDevice
														dataProcedureFocalDevice = {
															"focal_device_id" : procedureFocalDeviceId,
															"action" : focalDeviceAction,
															"manipulated" : focalDeviceManipulated,
															"procedure_id" : procedureId
														}
														ApiFHIR.post('procedureFocalDevice', {"apikey": apikey}, {body: dataProcedureFocalDevice, json: true}, function(error, response, body){
															procedureFocalDevice = body;
															if(procedureFocalDevice.err_code > 0){
																res.json(procedureFocalDevice);	
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
															"procedure_id" : procedureId
														};
														
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataNote, json:true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
															} 
														});
														
														if(definitionPlanDefinition !== ""){
															dataDefinitionPlanDefinition = {
																"_id" : definitionPlanDefinition,
																"procedure_id" : procedureId
															}
															ApiFHIR.put('planDefinition', {"apikey": apikey, "_id": definitionPlanDefinition}, {body: dataDefinitionPlanDefinition, json: true}, function(error, response, body){
																returnDefinitionPlanDefinition = body;
																if(returnDefinitionPlanDefinition.err_code > 0){
																	res.json(returnDefinitionPlanDefinition);	
																	console.log("add reference Definition plan definition : " + definitionPlanDefinition);
																}
															});
														}

														if(definitionActivityDefinition !== ""){
															dataDefinitionActivityDefinition = {
																"_id" : definitionActivityDefinition,
																"procedure_id" : procedureId
															}
															ApiFHIR.put('activityDefinition', {"apikey": apikey, "_id": definitionActivityDefinition}, {body: dataDefinitionActivityDefinition, json: true}, function(error, response, body){
																returnDefinitionActivityDefinition = body;
																if(returnDefinitionActivityDefinition.err_code > 0){
																	res.json(returnDefinitionActivityDefinition);	
																	console.log("add reference Definition activity definition : " + definitionActivityDefinition);
																}
															});
														}

														if(definitionHealthcareService !== ""){
															dataDefinitionHealthcareService = {
																"_id" : definitionHealthcareService,
																"procedure_id" : procedureId
															}
															ApiFHIR.put('healthcareService', {"apikey": apikey, "_id": definitionHealthcareService}, {body: dataDefinitionHealthcareService, json: true}, function(error, response, body){
																returnDefinitionHealthcareService = body;
																if(returnDefinitionHealthcareService.err_code > 0){
																	res.json(returnDefinitionHealthcareService);	
																	console.log("add reference Definition healthcare service : " + definitionHealthcareService);
																}
															});
														}

														if(basedOnCarePlan !== ""){
															dataBasedOnCarePlan = {
																"_id" : basedOnCarePlan,
																"procedure_id" : procedureId
															}
															ApiFHIR.put('carePlan', {"apikey": apikey, "_id": basedOnCarePlan}, {body: dataBasedOnCarePlan, json: true}, function(error, response, body){
																returnBasedOnCarePlan = body;
																if(returnBasedOnCarePlan.err_code > 0){
																	res.json(returnBasedOnCarePlan);	
																	console.log("add reference Based on care plan : " + basedOnCarePlan);
																}
															});
														}

														if(basedOnProcedureRequest !== ""){
															dataBasedOnProcedureRequest = {
																"_id" : basedOnProcedureRequest,
																"procedure_id" : procedureId
															}
															ApiFHIR.put('procedureRequest', {"apikey": apikey, "_id": basedOnProcedureRequest}, {body: dataBasedOnProcedureRequest, json: true}, function(error, response, body){
																returnBasedOnProcedureRequest = body;
																if(returnBasedOnProcedureRequest.err_code > 0){
																	res.json(returnBasedOnProcedureRequest);	
																	console.log("add reference Based on procedure request : " + basedOnProcedureRequest);
																}
															});
														}

														if(basedOnReferralRequest !== ""){
															dataBasedOnReferralRequest = {
																"_id" : basedOnReferralRequest,
																"procedure_id" : procedureId
															}
															ApiFHIR.put('referralRequest', {"apikey": apikey, "_id": basedOnReferralRequest}, {body: dataBasedOnReferralRequest, json: true}, function(error, response, body){
																returnBasedOnReferralRequest = body;
																if(returnBasedOnReferralRequest.err_code > 0){
																	res.json(returnBasedOnReferralRequest);	
																	console.log("add reference Based on referral request : " + basedOnReferralRequest);
																}
															});
														}

														if(partOfProcedure !== ""){
															dataPartOfProcedure = {
																"_id" : partOfProcedure,
																"part_of_procedure" : procedureId
															}
															ApiFHIR.put('procedure', {"apikey": apikey, "_id": partOfProcedure}, {body: dataPartOfProcedure, json: true}, function(error, response, body){
																returnPartOfProcedure = body;
																if(returnPartOfProcedure.err_code > 0){
																	res.json(returnPartOfProcedure);	
																	console.log("add reference Part of procedure : " + partOfProcedure);
																}
															});
														}

														if(partOfObservation !== ""){
															dataPartOfObservation = {
																"_id" : partOfObservation,
																"procedure_part_of_id" : procedureId
															}
															ApiFHIR.put('observation', {"apikey": apikey, "_id": partOfObservation}, {body: dataPartOfObservation, json: true}, function(error, response, body){
																returnPartOfObservation = body;
																if(returnPartOfObservation.err_code > 0){
																	res.json(returnPartOfObservation);	
																	console.log("add reference Part of observation : " + partOfObservation);
																}
															});
														}

														if(partOfMedicationAdministration !== ""){
															dataPartOfMedicationAdministration = {
																"_id" : partOfMedicationAdministration,
																"procedure_id" : procedureId
															}
															ApiFHIR.put('medicationAdministration', {"apikey": apikey, "_id": partOfMedicationAdministration}, {body: dataPartOfMedicationAdministration, json: true}, function(error, response, body){
																returnPartOfMedicationAdministration = body;
																if(returnPartOfMedicationAdministration.err_code > 0){
																	res.json(returnPartOfMedicationAdministration);	
																	console.log("add reference Part of medication administration : " + partOfMedicationAdministration);
																}
															});
														}

														if(reasonReferenceCondition !== ""){
															dataReasonReferenceCondition = {
																"_id" : reasonReferenceCondition,
																"procedure_reason_reference_id" : procedureId
															}
															ApiFHIR.put('condition', {"apikey": apikey, "_id": reasonReferenceCondition}, {body: dataReasonReferenceCondition, json: true}, function(error, response, body){
																returnReasonReferenceCondition = body;
																if(returnReasonReferenceCondition.err_code > 0){
																	res.json(returnReasonReferenceCondition);	
																	console.log("add reference Reason reference condition : " + reasonReferenceCondition);
																}
															});
														}

														if(reasonReferenceObservation !== ""){
															dataReasonReferenceObservation = {
																"_id" : reasonReferenceObservation,
																"procedure_part_reason_reference_id" : procedureId
															}
															ApiFHIR.put('observation', {"apikey": apikey, "_id": reasonReferenceObservation}, {body: dataReasonReferenceObservation, json: true}, function(error, response, body){
																returnReasonReferenceObservation = body;
																if(returnReasonReferenceObservation.err_code > 0){
																	res.json(returnReasonReferenceObservation);	
																	console.log("add reference Reason reference observation : " + reasonReferenceObservation);
																}
															});
														}

														if(report !== ""){
															dataReport = {
																"_id" : report,
																"procedure_id" : procedureId
															}
															ApiFHIR.put('diagnosticReport', {"apikey": apikey, "_id": report}, {body: dataReport, json: true}, function(error, response, body){
																returnReport = body;
																if(returnReport.err_code > 0){
																	res.json(returnReport);	
																	console.log("add reference Report : " + report);
																}
															});
														}

														if(complicationDetail !== ""){
															dataComplicationDetail = {
																"_id" : complicationDetail,
																"procedure_complication_detail_id" : procedureId
															}
															ApiFHIR.put('condition', {"apikey": apikey, "_id": complicationDetail}, {body: dataComplicationDetail, json: true}, function(error, response, body){
																returnComplicationDetail = body;
																if(returnComplicationDetail.err_code > 0){
																	res.json(returnComplicationDetail);	
																	console.log("add reference Complication detail : " + complicationDetail);
																}
															});
														}

														if(usedReferenceDevice !== ""){
															dataUsedReferenceDevice = {
																"_id" : usedReferenceDevice,
																"procedure_id" : procedureId
															}
															ApiFHIR.put('device', {"apikey": apikey, "_id": usedReferenceDevice}, {body: dataUsedReferenceDevice, json: true}, function(error, response, body){
																returnUsedReferenceDevice = body;
																if(returnUsedReferenceDevice.err_code > 0){
																	res.json(returnUsedReferenceDevice);	
																	console.log("add reference Used reference device : " + usedReferenceDevice);
																}
															});
														}

														if(usedReferenceMedication !== ""){
															dataUsedReferenceMedication = {
																"_id" : usedReferenceMedication,
																"procedure_id" : procedureId
															}
															ApiFHIR.put('medication', {"apikey": apikey, "_id": usedReferenceMedication}, {body: dataUsedReferenceMedication, json: true}, function(error, response, body){
																returnUsedReferenceMedication = body;
																if(returnUsedReferenceMedication.err_code > 0){
																	res.json(returnUsedReferenceMedication);	
																	console.log("add reference Used reference medication : " + usedReferenceMedication);
																}
															});
														}

														if(usedReferenceSubstance !== ""){
															dataUsedReferenceSubstance = {
																"_id" : usedReferenceSubstance,
																"procedure_id" : procedureId
															}
															ApiFHIR.put('substance', {"apikey": apikey, "_id": usedReferenceSubstance}, {body: dataUsedReferenceSubstance, json: true}, function(error, response, body){
																returnUsedReferenceSubstance = body;
																if(returnUsedReferenceSubstance.err_code > 0){
																	res.json(returnUsedReferenceSubstance);	
																	console.log("add reference Used reference substance : " + usedReferenceSubstance);
																}
															});
														}

														
														
														res.json({"err_code": 0, "err_msg": "Procedure has been add.", "data": [{"_id": procedureId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
status|event-status
notDoneReason|procedure-not-performed-reason
category|procedure-category
code|procedure-code
performerRole|performer-role
reasonCode|procedure-reason
bodySite|body-site
outcome|procedure-outcome
complication|condition-code
followUp|procedure-followup
focalDeviceAction|device-action
usedCode|device-kind
*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'EVENT_STATUS', function (resStatusCode) {
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

										myEmitter.prependOnceListener('checkNotDoneReason', function () {
											if (!validator.isEmpty(notDoneReason)) {
												checkCode(apikey, notDoneReason, 'PROCEDURE_NOT_PERFORMED_REASON', function (resNotDoneReasonCode) {
													if (resNotDoneReasonCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Not done reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})

										myEmitter.prependOnceListener('checkCategory', function () {
											if (!validator.isEmpty(category)) {
												checkCode(apikey, category, 'PROCEDURE_CATEGORY', function (resCategoryCode) {
													if (resCategoryCode.err_code > 0) {
														myEmitter.emit('checkNotDoneReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkNotDoneReason');
											}
										})

										myEmitter.prependOnceListener('checkCode', function () {
											if (!validator.isEmpty(code)) {
												checkCode(apikey, code, 'PROCEDURE_CODE', function (resCodeCode) {
													if (resCodeCode.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkPerformerRole', function () {
											if (!validator.isEmpty(performerRole)) {
												checkCode(apikey, performerRole, 'PERFORMER_ROLE', function (resPerformerRoleCode) {
													if (resPerformerRoleCode.err_code > 0) {
														myEmitter.emit('checkCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer role code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCode');
											}
										})

										myEmitter.prependOnceListener('checkReasonCode', function () {
											if (!validator.isEmpty(reasonCode)) {
												checkCode(apikey, reasonCode, 'PROCEDURE_REASON', function (resReasonCodeCode) {
													if (resReasonCodeCode.err_code > 0) {
														myEmitter.emit('checkPerformerRole');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerRole');
											}
										})

										myEmitter.prependOnceListener('checkBodySite', function () {
											if (!validator.isEmpty(bodySite)) {
												checkCode(apikey, bodySite, 'BODY_SITE', function (resBodySiteCode) {
													if (resBodySiteCode.err_code > 0) {
														myEmitter.emit('checkReasonCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Body site code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonCode');
											}
										})

										myEmitter.prependOnceListener('checkOutcome', function () {
											if (!validator.isEmpty(outcome)) {
												checkCode(apikey, outcome, 'PROCEDURE_OUTCOME', function (resOutcomeCode) {
													if (resOutcomeCode.err_code > 0) {
														myEmitter.emit('checkBodySite');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Outcome code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBodySite');
											}
										})

										myEmitter.prependOnceListener('checkComplication', function () {
											if (!validator.isEmpty(complication)) {
												checkCode(apikey, complication, 'CONDITION_CODE', function (resComplicationCode) {
													if (resComplicationCode.err_code > 0) {
														myEmitter.emit('checkOutcome');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Complication code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOutcome');
											}
										})

										myEmitter.prependOnceListener('checkFollowUp', function () {
											if (!validator.isEmpty(followUp)) {
												checkCode(apikey, followUp, 'PROCEDURE_FOLLOWUP', function (resFollowUpCode) {
													if (resFollowUpCode.err_code > 0) {
														myEmitter.emit('checkComplication');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Follow up code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkComplication');
											}
										})

										myEmitter.prependOnceListener('checkFocalDeviceAction', function () {
											if (!validator.isEmpty(focalDeviceAction)) {
												checkCode(apikey, focalDeviceAction, 'DEVICE_ACTION', function (resFocalDeviceActionCode) {
													if (resFocalDeviceActionCode.err_code > 0) {
														myEmitter.emit('checkFollowUp');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Focal device action code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkFollowUp');
											}
										})

										myEmitter.prependOnceListener('checkUsedCode', function () {
											if (!validator.isEmpty(usedCode)) {
												checkCode(apikey, usedCode, 'DEVICE_KIND', function (resUsedCodeCode) {
													if (resUsedCodeCode.err_code > 0) {
														myEmitter.emit('checkFocalDeviceAction');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Used code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkFocalDeviceAction');
											}
										})

										//cek value
										/*
definitionPlanDefinition|Plan_Definition
definitionActivityDefinition|Activity_Definition
definitionHealthcareService|Healthcare_Service
basedOnCarePlan|CarePlan
basedOnProcedureRequest|Procedure_Request
basedOnReferralRequest|Referral_Request
partOfProcedure|Procedure
partOfObservation|Observation
partOfMedicationAdministration|Medication_Administration
subjectPatient|Patient
subjectGroup|Group
contextEncounter|Encounter
contextEpisodeOfCare|EpisodeOfCare
performerActorPractitioner|Practitioner
performerActorOrganization|Organization
performerActorPatient|Patient
performerActorRelatedPerson|Related_Person
performerActorDevice|Device
performerOnBehalfOf|Organization
location|location
reasonReferenceCondition|Condition
reasonReferenceObservation|Observation
report|Diagnostic_Report
complicationDetail|condition
focalDeviceManipulated|Device
usedReferenceDevice|Device
usedReferenceMedication|Medication
usedReferenceSubstance|Substance
noteAuthorPractitioner|Practitioner
noteAuthorPatient|Patient
noteAuthorRelatedPerson|Related_Person

										*/
										myEmitter.prependOnceListener('checkDefinitionPlanDefinition', function () {
											if (!validator.isEmpty(definitionPlanDefinition)) {
												checkUniqeValue(apikey, "PLAN_DEFINITION_ID|" + definitionPlanDefinition, 'PLAN_DEFINITION', function (resDefinitionPlanDefinition) {
													if (resDefinitionPlanDefinition.err_code > 0) {
														myEmitter.emit('checkUsedCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Definition plan definition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkUsedCode');
											}
										})

										myEmitter.prependOnceListener('checkDefinitionActivityDefinition', function () {
											if (!validator.isEmpty(definitionActivityDefinition)) {
												checkUniqeValue(apikey, "ACTIVITY_DEFINITION_ID|" + definitionActivityDefinition, 'ACTIVITY_DEFINITION', function (resDefinitionActivityDefinition) {
													if (resDefinitionActivityDefinition.err_code > 0) {
														myEmitter.emit('checkDefinitionPlanDefinition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Definition activity definition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDefinitionPlanDefinition');
											}
										})

										myEmitter.prependOnceListener('checkDefinitionHealthcareService', function () {
											if (!validator.isEmpty(definitionHealthcareService)) {
												checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + definitionHealthcareService, 'HEALTHCARE_SERVICE', function (resDefinitionHealthcareService) {
													if (resDefinitionHealthcareService.err_code > 0) {
														myEmitter.emit('checkDefinitionActivityDefinition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Definition healthcare service id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDefinitionActivityDefinition');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnCarePlan', function () {
											if (!validator.isEmpty(basedOnCarePlan)) {
												checkUniqeValue(apikey, "CAREPLAN_ID|" + basedOnCarePlan, 'CAREPLAN', function (resBasedOnCarePlan) {
													if (resBasedOnCarePlan.err_code > 0) {
														myEmitter.emit('checkDefinitionHealthcareService');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on care plan id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDefinitionHealthcareService');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnProcedureRequest', function () {
											if (!validator.isEmpty(basedOnProcedureRequest)) {
												checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + basedOnProcedureRequest, 'PROCEDURE_REQUEST', function (resBasedOnProcedureRequest) {
													if (resBasedOnProcedureRequest.err_code > 0) {
														myEmitter.emit('checkBasedOnCarePlan');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on procedure request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnCarePlan');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnReferralRequest', function () {
											if (!validator.isEmpty(basedOnReferralRequest)) {
												checkUniqeValue(apikey, "REFERRAL_REQUEST_ID|" + basedOnReferralRequest, 'REFERRAL_REQUEST', function (resBasedOnReferralRequest) {
													if (resBasedOnReferralRequest.err_code > 0) {
														myEmitter.emit('checkBasedOnProcedureRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on referral request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnProcedureRequest');
											}
										})

										myEmitter.prependOnceListener('checkPartOfProcedure', function () {
											if (!validator.isEmpty(partOfProcedure)) {
												checkUniqeValue(apikey, "PROCEDURE_ID|" + partOfProcedure, 'PROCEDURE', function (resPartOfProcedure) {
													if (resPartOfProcedure.err_code > 0) {
														myEmitter.emit('checkBasedOnReferralRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Part of procedure id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnReferralRequest');
											}
										})

										myEmitter.prependOnceListener('checkPartOfObservation', function () {
											if (!validator.isEmpty(partOfObservation)) {
												checkUniqeValue(apikey, "OBSERVATION_ID|" + partOfObservation, 'OBSERVATION', function (resPartOfObservation) {
													if (resPartOfObservation.err_code > 0) {
														myEmitter.emit('checkPartOfProcedure');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Part of observation id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPartOfProcedure');
											}
										})

										myEmitter.prependOnceListener('checkPartOfMedicationAdministration', function () {
											if (!validator.isEmpty(partOfMedicationAdministration)) {
												checkUniqeValue(apikey, "MEDICATION_ADMINISTRATION_ID|" + partOfMedicationAdministration, 'MEDICATION_ADMINISTRATION', function (resPartOfMedicationAdministration) {
													if (resPartOfMedicationAdministration.err_code > 0) {
														myEmitter.emit('checkPartOfObservation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Part of medication administration id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPartOfObservation');
											}
										})

										myEmitter.prependOnceListener('checkSubjectPatient', function () {
											if (!validator.isEmpty(subjectPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
													if (resSubjectPatient.err_code > 0) {
														myEmitter.emit('checkPartOfMedicationAdministration');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPartOfMedicationAdministration');
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
												checkUniqeValue(apikey, "EPISODEOFCARE_ID|" + contextEpisodeOfCare, 'EPISODEOFCARE', function (resContextEpisodeOfCare) {
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

										myEmitter.prependOnceListener('checkPerformerActorPractitioner', function () {
											if (!validator.isEmpty(performerActorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + performerActorPractitioner, 'PRACTITIONER', function (resPerformerActorPractitioner) {
													if (resPerformerActorPractitioner.err_code > 0) {
														myEmitter.emit('checkContextEpisodeOfCare');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer actor practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEpisodeOfCare');
											}
										})

										myEmitter.prependOnceListener('checkPerformerActorOrganization', function () {
											if (!validator.isEmpty(performerActorOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerActorOrganization, 'ORGANIZATION', function (resPerformerActorOrganization) {
													if (resPerformerActorOrganization.err_code > 0) {
														myEmitter.emit('checkPerformerActorPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer actor organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerActorPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkPerformerActorPatient', function () {
											if (!validator.isEmpty(performerActorPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + performerActorPatient, 'PATIENT', function (resPerformerActorPatient) {
													if (resPerformerActorPatient.err_code > 0) {
														myEmitter.emit('checkPerformerActorOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer actor patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerActorOrganization');
											}
										})

										myEmitter.prependOnceListener('checkPerformerActorRelatedPerson', function () {
											if (!validator.isEmpty(performerActorRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + performerActorRelatedPerson, 'RELATED_PERSON', function (resPerformerActorRelatedPerson) {
													if (resPerformerActorRelatedPerson.err_code > 0) {
														myEmitter.emit('checkPerformerActorPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer actor related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerActorPatient');
											}
										})

										myEmitter.prependOnceListener('checkPerformerActorDevice', function () {
											if (!validator.isEmpty(performerActorDevice)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + performerActorDevice, 'DEVICE', function (resPerformerActorDevice) {
													if (resPerformerActorDevice.err_code > 0) {
														myEmitter.emit('checkPerformerActorRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer actor device id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerActorRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkPerformerOnBehalfOf', function () {
											if (!validator.isEmpty(performerOnBehalfOf)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerOnBehalfOf, 'ORGANIZATION', function (resPerformerOnBehalfOf) {
													if (resPerformerOnBehalfOf.err_code > 0) {
														myEmitter.emit('checkPerformerActorDevice');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer on behalf of id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerActorDevice');
											}
										})

										myEmitter.prependOnceListener('checkLocation', function () {
											if (!validator.isEmpty(location)) {
												checkUniqeValue(apikey, "LOCATION_ID|" + location, 'LOCATION', function (resLocation) {
													if (resLocation.err_code > 0) {
														myEmitter.emit('checkPerformerOnBehalfOf');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Location id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerOnBehalfOf');
											}
										})

										myEmitter.prependOnceListener('checkReasonReferenceCondition', function () {
											if (!validator.isEmpty(reasonReferenceCondition)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + reasonReferenceCondition, 'CONDITION', function (resReasonReferenceCondition) {
													if (resReasonReferenceCondition.err_code > 0) {
														myEmitter.emit('checkLocation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason reference condition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkLocation');
											}
										})

										myEmitter.prependOnceListener('checkReasonReferenceObservation', function () {
											if (!validator.isEmpty(reasonReferenceObservation)) {
												checkUniqeValue(apikey, "OBSERVATION_ID|" + reasonReferenceObservation, 'OBSERVATION', function (resReasonReferenceObservation) {
													if (resReasonReferenceObservation.err_code > 0) {
														myEmitter.emit('checkReasonReferenceCondition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason reference observation id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonReferenceCondition');
											}
										})

										myEmitter.prependOnceListener('checkReport', function () {
											if (!validator.isEmpty(report)) {
												checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + report, 'DIAGNOSTIC_REPORT', function (resReport) {
													if (resReport.err_code > 0) {
														myEmitter.emit('checkReasonReferenceObservation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Report id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonReferenceObservation');
											}
										})
										
										myEmitter.prependOnceListener('checkComplicationDetail', function () {
											if (!validator.isEmpty(complicationDetail)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + complicationDetail, 'CONDITION', function (resComplicationDetail) {
													if (resComplicationDetail.err_code > 0) {
														myEmitter.emit('checkReport');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Complication Detail id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReport');
											}
										})
										
										myEmitter.prependOnceListener('checkFocalDeviceManipulated', function () {
											if (!validator.isEmpty(focalDeviceManipulated)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + focalDeviceManipulated, 'DEVICE', function (resFocalDeviceManipulated) {
													if (resFocalDeviceManipulated.err_code > 0) {
														myEmitter.emit('checkComplicationDetail');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Focal device manipulated id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkComplicationDetail');
											}
										})

										myEmitter.prependOnceListener('checkUsedReferenceDevice', function () {
											if (!validator.isEmpty(usedReferenceDevice)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + usedReferenceDevice, 'DEVICE', function (resUsedReferenceDevice) {
													if (resUsedReferenceDevice.err_code > 0) {
														myEmitter.emit('checkFocalDeviceManipulated');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Used reference device id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkFocalDeviceManipulated');
											}
										})

										myEmitter.prependOnceListener('checkUsedReferenceMedication', function () {
											if (!validator.isEmpty(usedReferenceMedication)) {
												checkUniqeValue(apikey, "MEDICATION_ID|" + usedReferenceMedication, 'MEDICATION', function (resUsedReferenceMedication) {
													if (resUsedReferenceMedication.err_code > 0) {
														myEmitter.emit('checkUsedReferenceDevice');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Used reference medication id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkUsedReferenceDevice');
											}
										})
										
										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
											if (!validator.isEmpty(noteAuthorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorPractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
													if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
														myEmitter.emit('checkUsedReferenceMedication');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author author reference practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkUsedReferenceMedication');
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

										if (!validator.isEmpty(usedReferenceSubstance)) {
											checkUniqeValue(apikey, "SUBSTANCE_ID|" + usedReferenceSubstance, 'SUBSTANCE', function (resUsedReferenceSubstance) {
												if (resUsedReferenceSubstance.err_code > 0) {
													myEmitter.emit('checkNoteAuthorAuthorReferenceRelatedPerson');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Used reference substance id not found"
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
			var procedureId = req.params.procedure_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof procedureId !== 'undefined'){
				if(validator.isEmpty(procedureId)){
					err_code = 2;
					err_msg = "Procedure id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure id is required";
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
												checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureId, 'PROCEDURE', function(resProcedureID){
													if(resProcedureID.err_code > 0){
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
																							"procedure_id": procedureId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Procedure.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Procedure Id not found"});		
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
		procedurePerformer: function addProcedurePerformer(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var procedureId = req.params.procedure_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof procedureId !== 'undefined'){
				if(validator.isEmpty(procedureId)){
					err_code = 2;
					err_msg = "Procedure id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure id is required";
			}
			
			if(typeof req.body.role !== 'undefined'){
				var performerRole =  req.body.role.trim().toLowerCase();
				if(validator.isEmpty(performerRole)){
					performerRole = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer role' in json Procedure request.";
			}

			if(typeof req.body.actor.practitioner !== 'undefined'){
				var performerActorPractitioner =  req.body.actor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerActorPractitioner)){
					performerActorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor practitioner' in json Procedure request.";
			}

			if(typeof req.body.actor.organization !== 'undefined'){
				var performerActorOrganization =  req.body.actor.organization.trim().toLowerCase();
				if(validator.isEmpty(performerActorOrganization)){
					performerActorOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor organization' in json Procedure request.";
			}

			if(typeof req.body.actor.patient !== 'undefined'){
				var performerActorPatient =  req.body.actor.patient.trim().toLowerCase();
				if(validator.isEmpty(performerActorPatient)){
					performerActorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor patient' in json Procedure request.";
			}

			if(typeof req.body.actor.relatedPerson !== 'undefined'){
				var performerActorRelatedPerson =  req.body.actor.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(performerActorRelatedPerson)){
					performerActorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor related person' in json Procedure request.";
			}

			if(typeof req.body.actor.device !== 'undefined'){
				var performerActorDevice =  req.body.actor.device.trim().toLowerCase();
				if(validator.isEmpty(performerActorDevice)){
					performerActorDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor device' in json Procedure request.";
			}

			if(typeof req.body.onBehalfOf !== 'undefined'){
				var performerOnBehalfOf =  req.body.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(performerOnBehalfOf)){
					performerOnBehalfOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer on behalf of' in json Procedure request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkProcedureID', function(){
							checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureId, 'PROCEDURE', function(resProcedureID){
								if(resProcedureID.err_code > 0){
									var unicId = uniqid.time();
									var procedurePerformerId = 'prp' + unicId;
									//ProcedurePerformer
									dataProcedurePerformer = {
										"performer_id" : procedurePerformerId,
										"role" : performerRole,
										"actor_practitioner" : performerActorPractitioner,
										"actor_organization" : performerActorOrganization,
										"actor_patient" : performerActorPatient,
										"actor_related_person" : performerActorRelatedPerson,
										"actor_device" : performerActorDevice,
										"on_behalf_of" : performerOnBehalfOf,
										"procedure_id" : procedureId
									}
									ApiFHIR.post('procedurePerformer', {"apikey": apikey}, {body: dataProcedurePerformer, json: true}, function(error, response, body){
										procedurePerformer = body;
										if(procedurePerformer.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Procedure Target has been add in this Procedure.", "data": procedurePerformer.data});
										}else{
											res.json(procedurePerformer);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Procedure Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkPerformerRole', function () {
							if (!validator.isEmpty(performerRole)) {
								checkCode(apikey, performerRole, 'PERFORMER_ROLE', function (resPerformerRoleCode) {
									if (resPerformerRoleCode.err_code > 0) {
										myEmitter.emit('checkProcedureID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer role code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkProcedureID');
							}
						})
						
						myEmitter.prependOnceListener('checkPerformerActorPractitioner', function () {
							if (!validator.isEmpty(performerActorPractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + performerActorPractitioner, 'PRACTITIONER', function (resPerformerActorPractitioner) {
									if (resPerformerActorPractitioner.err_code > 0) {
										myEmitter.emit('checkPerformerRole');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerRole');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorOrganization', function () {
							if (!validator.isEmpty(performerActorOrganization)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerActorOrganization, 'ORGANIZATION', function (resPerformerActorOrganization) {
									if (resPerformerActorOrganization.err_code > 0) {
										myEmitter.emit('checkPerformerActorPractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorPractitioner');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorPatient', function () {
							if (!validator.isEmpty(performerActorPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + performerActorPatient, 'PATIENT', function (resPerformerActorPatient) {
									if (resPerformerActorPatient.err_code > 0) {
										myEmitter.emit('checkPerformerActorOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorOrganization');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorRelatedPerson', function () {
							if (!validator.isEmpty(performerActorRelatedPerson)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + performerActorRelatedPerson, 'RELATED_PERSON', function (resPerformerActorRelatedPerson) {
									if (resPerformerActorRelatedPerson.err_code > 0) {
										myEmitter.emit('checkPerformerActorPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor related person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorPatient');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorDevice', function () {
							if (!validator.isEmpty(performerActorDevice)) {
								checkUniqeValue(apikey, "DEVICE_ID|" + performerActorDevice, 'DEVICE', function (resPerformerActorDevice) {
									if (resPerformerActorDevice.err_code > 0) {
										myEmitter.emit('checkPerformerActorRelatedPerson');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor device id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorRelatedPerson');
							}
						})

						if (!validator.isEmpty(performerOnBehalfOf)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerOnBehalfOf, 'ORGANIZATION', function (resPerformerOnBehalfOf) {
								if (resPerformerOnBehalfOf.err_code > 0) {
									myEmitter.emit('checkPerformerActorDevice');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Performer on behalf of id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPerformerActorDevice');
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
		procedureFocalDevice: function addProcedureFocalDevice(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var procedureId = req.params.procedure_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof procedureId !== 'undefined'){
				if(validator.isEmpty(procedureId)){
					err_code = 2;
					err_msg = "Procedure id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure id is required";
			}
			
			if(typeof req.body.action !== 'undefined'){
				var focalDeviceAction =  req.body.action.trim().toLowerCase();
				if(validator.isEmpty(focalDeviceAction)){
					focalDeviceAction = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'focal device action' in json Procedure request.";
			}

			if(typeof req.body.manipulated !== 'undefined'){
				var focalDeviceManipulated =  req.body.manipulated.trim().toLowerCase();
				if(validator.isEmpty(focalDeviceManipulated)){
					focalDeviceManipulated = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'focal device manipulated' in json Procedure request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkProcedureID', function(){
							checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureId, 'PROCEDURE', function(resProcedureID){
								if(resProcedureID.err_code > 0){
									var unicId = uniqid.time();
									var procedureFocalDeviceId = 'prf' + unicId;
									//ProcedureFocalDevice
									dataProcedureFocalDevice = {
										"focal_device_id" : procedureFocalDeviceId,
										"action" : focalDeviceAction,
										"manipulated" : focalDeviceManipulated,
										"procedure_id" : procedureId
									}
									ApiFHIR.post('procedureFocalDevice', {"apikey": apikey}, {body: dataProcedureFocalDevice, json: true}, function(error, response, body){
										procedureFocalDevice = body;
										if(procedureFocalDevice.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Procedure Focal Device has been add in this Procedure.", "data": procedureFocalDevice.data});
										}else{
											res.json(procedureFocalDevice);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Procedure Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkFocalDeviceAction', function () {
							if (!validator.isEmpty(focalDeviceAction)) {
								checkCode(apikey, focalDeviceAction, 'DEVICE_ACTION', function (resFocalDeviceActionCode) {
									if (resFocalDeviceActionCode.err_code > 0) {
										myEmitter.emit('checkProcedureID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Focal device action code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkProcedureID');
							}
						})

						if (!validator.isEmpty(focalDeviceManipulated)) {
							checkUniqeValue(apikey, "DEVICE_ID|" + focalDeviceManipulated, 'DEVICE', function (resFocalDeviceManipulated) {
								if (resFocalDeviceManipulated.err_code > 0) {
									myEmitter.emit('checkFocalDeviceAction');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Focal device manipulated id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkFocalDeviceAction');
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
		procedureNote: function addProcedureNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var procedureId = req.params.procedure_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof procedureId !== 'undefined'){
				if(validator.isEmpty(procedureId)){
					err_code = 2;
					err_msg = "Procedure id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure id is required";
			}
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Procedure request.";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Procedure request.";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Procedure request.";
			}

			if(typeof req.body.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Procedure request.";
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
				err_msg = "Please add sub-key 'note time' in json Procedure request.";
			}

			if(typeof req.body.string !== 'undefined'){
				var noteString =  req.body.string.trim().toLowerCase();
				if(validator.isEmpty(noteString)){
					noteString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note string' in json Procedure request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkProcedureID', function(){
							checkUniqeValue(apikey, "procedure_id|" + procedureId, 'procedure', function(resProcedureID){
								if(resProcedureID.err_code > 0){
									var unicId = uniqid.time();
									var procedureNoteId = 'apr' + unicId;
									//ProcedureNote
									dataProcedureNote = {
										"id": procedureNoteId,
										"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
										"author_ref_patient": noteAuthorAuthorReferencePatient,
										"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
										"author_string": noteAuthorAuthorString,
										"time": noteTime,
										"text": noteString,
										"procedure_id" : procedureId
									}
									ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataProcedureNote, json: true}, function(error, response, body){
										procedureNote = body;
										if(procedureNote.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Procedure Note has been add in this Procedure.", "data": procedureNote.data});
										}else{
											res.json(procedureNote);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Procedure Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkProcedureID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkProcedureID');
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
		procedure : function updateProcedure(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var procedureId = req.params.procedure_id;

      var err_code = 0;
      var err_msg = "";
      var dataProcedure = {};

			if(typeof procedureId !== 'undefined'){
				if(validator.isEmpty(procedureId)){
					err_code = 2;
					err_msg = "Procedure id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure id is required";
			}
			
			/*if(typeof req.body.definition.planDefinition !== 'undefined' && req.body.definition.planDefinition !== ""){
				var definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					dataProcedure.plan_definition = "";
				}else{
					dataProcedure.plan_definition = definitionPlanDefinition;
				}
			}else{
			  definitionPlanDefinition = "";
			}

			if(typeof req.body.definition.activityDefinition !== 'undefined' && req.body.definition.activityDefinition !== ""){
				var definitionActivityDefinition =  req.body.definition.activityDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionActivityDefinition)){
					dataProcedure.activity_definition = "";
				}else{
					dataProcedure.activity_definition = definitionActivityDefinition;
				}
			}else{
			  definitionActivityDefinition = "";
			}

			if(typeof req.body.definition.healthcareService !== 'undefined' && req.body.definition.healthcareService !== ""){
				var definitionHealthcareService =  req.body.definition.healthcareService.trim().toLowerCase();
				if(validator.isEmpty(definitionHealthcareService)){
					dataProcedure.healthcare_service = "";
				}else{
					dataProcedure.healthcare_service = definitionHealthcareService;
				}
			}else{
			  definitionHealthcareService = "";
			}

			if(typeof req.body.basedOn.carePlan !== 'undefined' && req.body.basedOn.carePlan !== ""){
				var basedOnCarePlan =  req.body.basedOn.carePlan.trim().toLowerCase();
				if(validator.isEmpty(basedOnCarePlan)){
					dataProcedure.care_plan = "";
				}else{
					dataProcedure.care_plan = basedOnCarePlan;
				}
			}else{
			  basedOnCarePlan = "";
			}

			if(typeof req.body.basedOn.procedureRequest !== 'undefined' && req.body.basedOn.procedureRequest !== ""){
				var basedOnProcedureRequest =  req.body.basedOn.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnProcedureRequest)){
					dataProcedure.procedure_request = "";
				}else{
					dataProcedure.procedure_request = basedOnProcedureRequest;
				}
			}else{
			  basedOnProcedureRequest = "";
			}

			if(typeof req.body.basedOn.referralRequest !== 'undefined' && req.body.basedOn.referralRequest !== ""){
				var basedOnReferralRequest =  req.body.basedOn.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnReferralRequest)){
					dataProcedure.referral_request = "";
				}else{
					dataProcedure.referral_request = basedOnReferralRequest;
				}
			}else{
			  basedOnReferralRequest = "";
			}*/

			if(typeof req.body.partOf.procedure !== 'undefined' && req.body.partOf.procedure !== ""){
				var partOfProcedure =  req.body.partOf.procedure.trim().toLowerCase();
				if(validator.isEmpty(partOfProcedure)){
					dataProcedure.part_of_procedure = "";
				}else{
					dataProcedure.part_of_procedure = partOfProcedure;
				}
			}else{
			  partOfProcedure = "";
			}

			/*if(typeof req.body.partOf.observation !== 'undefined' && req.body.partOf.observation !== ""){
				var partOfObservation =  req.body.partOf.observation.trim().toLowerCase();
				if(validator.isEmpty(partOfObservation)){
					dataProcedure.observation = "";
				}else{
					dataProcedure.observation = partOfObservation;
				}
			}else{
			  partOfObservation = "";
			}

			if(typeof req.body.partOf.medicationAdministration !== 'undefined' && req.body.partOf.medicationAdministration !== ""){
				var partOfMedicationAdministration =  req.body.partOf.medicationAdministration.trim().toLowerCase();
				if(validator.isEmpty(partOfMedicationAdministration)){
					dataProcedure.medication_administration = "";
				}else{
					dataProcedure.medication_administration = partOfMedicationAdministration;
				}
			}else{
			  partOfMedicationAdministration = "";
			}*/
			
			/*
			var part_of_procedure = req.body.part_of_procedure;
			var status = req.body.status;
			var not_done = req.body.not_done;
			var not_done_reason = req.body.not_done_reason;
			var category = req.body.category;
			var code = req.body.code;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var performed_date_time = req.body.performed_date_time;
			var performed_period_start = req.body.performed_period_start;
			var performed_period_end = req.body.performed_period_end;
			var location = req.body.location;
			var reason_code = req.body.reason_code;
			var body_site = req.body.body_site;
			var outcome = req.body.outcome;
			var complication = req.body.complication;
			var follow_up = req.body.follow_up;
			var used_code = req.body.used_code;
			*/

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "procedure status is required.";
				}else{
					dataProcedure.status = status;
				}
			}else{
			  status = "";
			}

			if (typeof req.body.notDone !== 'undefined' && req.body.notDone !== "") {
			  var notDone = req.body.notDone.trim().toLowerCase();
					if(validator.isEmpty(notDone)){
						notDone = "false";
					}
			  if(notDone === "true" || notDone === "false"){
					dataProcedure.not_done = notDone;
			  } else {
			    err_code = 2;
			    err_msg = "Procedure not done is must be boolean.";
			  }
			} else {
			  notDone = "";
			}

			if(typeof req.body.notDoneReason !== 'undefined' && req.body.notDoneReason !== ""){
				var notDoneReason =  req.body.notDoneReason.trim().toLowerCase();
				if(validator.isEmpty(notDoneReason)){
					dataProcedure.not_done_reason = "";
				}else{
					dataProcedure.not_done_reason = notDoneReason;
				}
			}else{
			  notDoneReason = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					dataProcedure.category = "";
				}else{
					dataProcedure.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					dataProcedure.code = "";
				}else{
					dataProcedure.code = code;
				}
			}else{
			  code = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataProcedure.subject_patient = "";
				}else{
					dataProcedure.subject_patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataProcedure.subject_group = "";
				}else{
					dataProcedure.subject_group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					dataProcedure.context_encounter = "";
				}else{
					dataProcedure.context_encounter = contextEncounter;
				}
			}else{
			  contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					dataProcedure.context_episode_of_care = "";
				}else{
					dataProcedure.context_episode_of_care = contextEpisodeOfCare;
				}
			}else{
			  contextEpisodeOfCare = "";
			}

			if(typeof req.body.performed.performedDateTime !== 'undefined' && req.body.performed.performedDateTime !== ""){
				var performedPerformedDateTime =  req.body.performed.performedDateTime;
				if(validator.isEmpty(performedPerformedDateTime)){
					err_code = 2;
					err_msg = "procedure performed performed date time is required.";
				}else{
					if(!regex.test(performedPerformedDateTime)){
						err_code = 2;
						err_msg = "procedure performed performed date time invalid date format.";	
					}else{
						dataProcedure.performed_date_time = performedPerformedDateTime;
					}
				}
			}else{
			  performedPerformedDateTime = "";
			}

			if (typeof req.body.performed.period !== 'undefined' && req.body.performed.period !== "") {
			  var performedPeriod = req.body.performed.period;
			  if (performedPeriod.indexOf("to") > 0) {
			    arrPerformedPeriod = performedPeriod.split("to");
			    dataProcedure.performed_period_start = arrPerformedPeriod[0];
			    dataProcedure.performed_period_end = arrPerformedPeriod[1];
			    if (!regex.test(performedPeriodStart) && !regex.test(performedPeriodEnd)) {
			      err_code = 2;
			      err_msg = "procedure performed period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "procedure performed period invalid date format.";
				}
			} else {
			  performedPeriod = "";
			}

			if(typeof req.body.location !== 'undefined' && req.body.location !== ""){
				var location =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(location)){
					dataProcedure.location = "";
				}else{
					dataProcedure.location = location;
				}
			}else{
			  location = "";
			}

			if(typeof req.body.reasonCode !== 'undefined' && req.body.reasonCode !== ""){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					dataProcedure.reason_code = "";
				}else{
					dataProcedure.reason_code = reasonCode;
				}
			}else{
			  reasonCode = "";
			}

			/*if(typeof req.body.reasonReference.condition !== 'undefined' && req.body.reasonReference.condition !== ""){
				var reasonReferenceCondition =  req.body.reasonReference.condition.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceCondition)){
					dataProcedure.condition = "";
				}else{
					dataProcedure.condition = reasonReferenceCondition;
				}
			}else{
			  reasonReferenceCondition = "";
			}

			if(typeof req.body.reasonReference.observation !== 'undefined' && req.body.reasonReference.observation !== ""){
				var reasonReferenceObservation =  req.body.reasonReference.observation.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceObservation)){
					dataProcedure.observation = "";
				}else{
					dataProcedure.observation = reasonReferenceObservation;
				}
			}else{
			  reasonReferenceObservation = "";
			}*/

			if(typeof req.body.bodySite !== 'undefined' && req.body.bodySite !== ""){
				var bodySite =  req.body.bodySite.trim().toLowerCase();
				if(validator.isEmpty(bodySite)){
					dataProcedure.body_site = "";
				}else{
					dataProcedure.body_site = bodySite;
				}
			}else{
			  bodySite = "";
			}

			if(typeof req.body.outcome !== 'undefined' && req.body.outcome !== ""){
				var outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					dataProcedure.outcome = "";
				}else{
					dataProcedure.outcome = outcome;
				}
			}else{
			  outcome = "";
			}

			/*if(typeof req.body.report !== 'undefined' && req.body.report !== ""){
				var report =  req.body.report.trim().toLowerCase();
				if(validator.isEmpty(report)){
					dataProcedure.report = "";
				}else{
					dataProcedure.report = report;
				}
			}else{
			  report = "";
			}*/

			if(typeof req.body.complication !== 'undefined' && req.body.complication !== ""){
				var complication =  req.body.complication.trim().toLowerCase();
				if(validator.isEmpty(complication)){
					dataProcedure.complication = "";
				}else{
					dataProcedure.complication = complication;
				}
			}else{
			  complication = "";
			}

			/*if(typeof req.body.complicationDetail !== 'undefined' && req.body.complicationDetail !== ""){
				var complicationDetail =  req.body.complicationDetail.trim().toLowerCase();
				if(validator.isEmpty(complicationDetail)){
					dataProcedure.complication_detail = "";
				}else{
					dataProcedure.complication_detail = complicationDetail;
				}
			}else{
			  complicationDetail = "";
			}*/
			
			if(typeof req.body.followUp !== 'undefined' && req.body.followUp !== ""){
				var followUp =  req.body.followUp.trim().toLowerCase();
				if(validator.isEmpty(followUp)){
					dataProcedure.follow_up = "";
				}else{
					dataProcedure.follow_up = followUp;
				}
			}else{
			  followUp = "";
			}

			/*if(typeof req.body.usedReference.device !== 'undefined' && req.body.usedReference.device !== ""){
				var usedReferenceDevice =  req.body.usedReference.device.trim().toLowerCase();
				if(validator.isEmpty(usedReferenceDevice)){
					dataProcedure.device = "";
				}else{
					dataProcedure.device = usedReferenceDevice;
				}
			}else{
			  usedReferenceDevice = "";
			}

			if(typeof req.body.usedReference.medication !== 'undefined' && req.body.usedReference.medication !== ""){
				var usedReferenceMedication =  req.body.usedReference.medication.trim().toLowerCase();
				if(validator.isEmpty(usedReferenceMedication)){
					dataProcedure.medication = "";
				}else{
					dataProcedure.medication = usedReferenceMedication;
				}
			}else{
			  usedReferenceMedication = "";
			}

			if(typeof req.body.usedReference.substance !== 'undefined' && req.body.usedReference.substance !== ""){
				var usedReferenceSubstance =  req.body.usedReference.substance.trim().toLowerCase();
				if(validator.isEmpty(usedReferenceSubstance)){
					dataProcedure.substance = "";
				}else{
					dataProcedure.substance = usedReferenceSubstance;
				}
			}else{
			  usedReferenceSubstance = "";
			}*/

			if(typeof req.body.usedCode !== 'undefined' && req.body.usedCode !== ""){
				var usedCode =  req.body.usedCode.trim().toLowerCase();
				if(validator.isEmpty(usedCode)){
					dataProcedure.used_code = "";
				}else{
					dataProcedure.used_code = usedCode;
				}
			}else{
			  usedCode = "";
			}

			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkProcedureId', function(){
						checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureId, 'PROCEDURE', function(resProcedureId){
							if(resProcedureId.err_code > 0){
								ApiFHIR.put('procedure', {"apikey": apikey, "_id": procedureId}, {body: dataProcedure, json: true}, function(error, response, body){
									procedure = body;
									if(procedure.err_code > 0){
										res.json(procedure);	
									}else{
										res.json({"err_code": 0, "err_msg": "Procedure has been update.", "data": [{"_id": procedureId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Procedure Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkStatus', function () {
						if (!validator.isEmpty(status)) {
							checkCode(apikey, status, 'EVENT_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) {
									myEmitter.emit('checkProcedureId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkProcedureId');
						}
					})

					myEmitter.prependOnceListener('checkNotDoneReason', function () {
						if (!validator.isEmpty(notDoneReason)) {
							checkCode(apikey, notDoneReason, 'PROCEDURE_NOT_PERFORMED_REASON', function (resNotDoneReasonCode) {
								if (resNotDoneReasonCode.err_code > 0) {
									myEmitter.emit('checkStatus');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Not done reason code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkStatus');
						}
					})

					myEmitter.prependOnceListener('checkCategory', function () {
						if (!validator.isEmpty(category)) {
							checkCode(apikey, category, 'PROCEDURE_CATEGORY', function (resCategoryCode) {
								if (resCategoryCode.err_code > 0) {
									myEmitter.emit('checkNotDoneReason');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Category code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkNotDoneReason');
						}
					})

					myEmitter.prependOnceListener('checkCode', function () {
						if (!validator.isEmpty(code)) {
							checkCode(apikey, code, 'PROCEDURE_CODE', function (resCodeCode) {
								if (resCodeCode.err_code > 0) {
									myEmitter.emit('checkCategory');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCategory');
						}
					})

					myEmitter.prependOnceListener('checkReasonCode', function () {
						if (!validator.isEmpty(reasonCode)) {
							checkCode(apikey, reasonCode, 'PROCEDURE_REASON', function (resReasonCodeCode) {
								if (resReasonCodeCode.err_code > 0) {
									myEmitter.emit('checkCode');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Reason code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCode');
						}
					})

					myEmitter.prependOnceListener('checkBodySite', function () {
						if (!validator.isEmpty(bodySite)) {
							checkCode(apikey, bodySite, 'BODY_SITE', function (resBodySiteCode) {
								if (resBodySiteCode.err_code > 0) {
									myEmitter.emit('checkReasonCode');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Body site code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkReasonCode');
						}
					})

					myEmitter.prependOnceListener('checkOutcome', function () {
						if (!validator.isEmpty(outcome)) {
							checkCode(apikey, outcome, 'PROCEDURE_OUTCOME', function (resOutcomeCode) {
								if (resOutcomeCode.err_code > 0) {
									myEmitter.emit('checkBodySite');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Outcome code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkBodySite');
						}
					})

					myEmitter.prependOnceListener('checkComplication', function () {
						if (!validator.isEmpty(complication)) {
							checkCode(apikey, complication, 'CONDITION_CODE', function (resComplicationCode) {
								if (resComplicationCode.err_code > 0) {
									myEmitter.emit('checkOutcome');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Complication code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkOutcome');
						}
					})

					myEmitter.prependOnceListener('checkFollowUp', function () {
						if (!validator.isEmpty(followUp)) {
							checkCode(apikey, followUp, 'PROCEDURE_FOLLOWUP', function (resFollowUpCode) {
								if (resFollowUpCode.err_code > 0) {
									myEmitter.emit('checkComplication');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Follow up code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkComplication');
						}
					})

					myEmitter.prependOnceListener('checkUsedCode', function () {
						if (!validator.isEmpty(usedCode)) {
							checkCode(apikey, usedCode, 'DEVICE_KIND', function (resUsedCodeCode) {
								if (resUsedCodeCode.err_code > 0) {
									myEmitter.emit('checkFollowUp');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Used code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkFollowUp');
						}
					})
					
					myEmitter.prependOnceListener('checkPartOfProcedure', function () {
						if (!validator.isEmpty(partOfProcedure)) {
							checkUniqeValue(apikey, "PROCEDURE_ID|" + partOfProcedure, 'PROCEDURE', function (resPartOfProcedure) {
								if (resPartOfProcedure.err_code > 0) {
									myEmitter.emit('checkUsedCode');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Part of procedure id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkUsedCode');
						}
					})

					myEmitter.prependOnceListener('checkSubjectPatient', function () {
						if (!validator.isEmpty(subjectPatient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
								if (resSubjectPatient.err_code > 0) {
									myEmitter.emit('checkPartOfProcedure');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPartOfProcedure');
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
							checkUniqeValue(apikey, "EPISODEOFCARE_ID|" + contextEpisodeOfCare, 'EPISODEOFCARE', function (resContextEpisodeOfCare) {
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

					if (!validator.isEmpty(location)) {
						checkUniqeValue(apikey, "LOCATION_ID|" + location, 'LOCATION', function (resLocation) {
							if (resLocation.err_code > 0) {
								myEmitter.emit('checkContextEpisodeOfCare');
							} else {
								res.json({
									"err_code": "500",
									"err_msg": "Location id not found"
								});
							}
						})
					} else {
						myEmitter.emit('checkContextEpisodeOfCare');
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
			var procedureId = req.params.procedure_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof procedureId !== 'undefined'){
				if(validator.isEmpty(procedureId)){
					err_code = 2;
					err_msg = "Procedure id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure id is required";
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
						myEmitter.prependOnceListener('checkProcedureID', function(){
							checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureId, 'PROCEDURE', function(resProcedureID){
								if(resProcedureID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "GOAL_ID|"+procedureId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Procedure.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Procedure Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkProcedureID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkProcedureID');				
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
		procedurePerformer: function updateProcedurePerformer(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var procedureId = req.params.procedure_id;
			var procedurePerformerId = req.params.procedure_performer_id;

			var err_code = 0;
			var err_msg = "";
			var dataProcedure = {};
			//input check 
			if(typeof procedureId !== 'undefined'){
				if(validator.isEmpty(procedureId)){
					err_code = 2;
					err_msg = "Procedure id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure id is required";
			}

			if(typeof procedurePerformerId !== 'undefined'){
				if(validator.isEmpty(procedurePerformerId)){
					err_code = 2;
					err_msg = "Procedure Performer id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure Performer id is required";
			}
			
			/*
			var role = req.body.role;
			var actor_practitioner = req.body.actor_practitioner;
			var actor_organization = req.body.actor_organization;
			var actor_patient = req.body.actor_patient;
			var actor_related_person = req.body.actor_related_person;
			var actor_device = req.body.actor_device;
			var on_behalf_of = req.body.on_behalf_of;
			*/
			if(typeof req.body.role !== 'undefined' && req.body.role !== ""){
				var performerRole =  req.body.role.trim().toLowerCase();
				if(validator.isEmpty(performerRole)){
					dataProcedure.role = "";
				}else{
					dataProcedure.role = performerRole;
				}
			}else{
			  performerRole = "";
			}

			if(typeof req.body.actor.practitioner !== 'undefined' && req.body.actor.practitioner !== ""){
				var performerActorPractitioner =  req.body.actor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerActorPractitioner)){
					dataProcedure.actor_practitioner = "";
				}else{
					dataProcedure.actor_practitioner = performerActorPractitioner;
				}
			}else{
			  performerActorPractitioner = "";
			}

			if(typeof req.body.actor.organization !== 'undefined' && req.body.actor.organization !== ""){
				var performerActorOrganization =  req.body.actor.organization.trim().toLowerCase();
				if(validator.isEmpty(performerActorOrganization)){
					dataProcedure.actor_organization = "";
				}else{
					dataProcedure.actor_organization = performerActorOrganization;
				}
			}else{
			  performerActorOrganization = "";
			}

			if(typeof req.body.actor.patient !== 'undefined' && req.body.actor.patient !== ""){
				var performerActorPatient =  req.body.actor.patient.trim().toLowerCase();
				if(validator.isEmpty(performerActorPatient)){
					dataProcedure.actor_patient = "";
				}else{
					dataProcedure.actor_patient = performerActorPatient;
				}
			}else{
			  performerActorPatient = "";
			}

			if(typeof req.body.actor.relatedPerson !== 'undefined' && req.body.actor.relatedPerson !== ""){
				var performerActorRelatedPerson =  req.body.actor.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(performerActorRelatedPerson)){
					dataProcedure.actor_related_person = "";
				}else{
					dataProcedure.actor_related_person = performerActorRelatedPerson;
				}
			}else{
			  performerActorRelatedPerson = "";
			}

			if(typeof req.body.actor.device !== 'undefined' && req.body.actor.device !== ""){
				var performerActorDevice =  req.body.actor.device.trim().toLowerCase();
				if(validator.isEmpty(performerActorDevice)){
					dataProcedure.actor_device = "";
				}else{
					dataProcedure.actor_device = performerActorDevice;
				}
			}else{
			  performerActorDevice = "";
			}

			if(typeof req.body.onBehalfOf !== 'undefined' && req.body.onBehalfOf !== ""){
				var performerOnBehalfOf =  req.body.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(performerOnBehalfOf)){
					dataProcedure.on_behalf_of = "";
				}else{
					dataProcedure.on_behalf_of = performerOnBehalfOf;
				}
			}else{
			  performerOnBehalfOf = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkProcedureID', function(){
							checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureId, 'PROCEDURE', function(resProcedureId){
								if(resProcedureId.err_code > 0){
									checkUniqeValue(apikey, "PERFORMER_ID|" + procedurePerformerId, 'PROCEDURE_PERFORMER', function(resProcedurePerformerID){
										if(resProcedurePerformerID.err_code > 0){
											ApiFHIR.put('procedurePerformer', {"apikey": apikey, "_id": procedurePerformerId, "dr": "PROCEDURE_ID|"+procedureId}, {body: dataProcedure, json: true}, function(error, response, body){
												procedurePerformer = body;
												if(procedurePerformer.err_code > 0){
													res.json(procedurePerformer);	
												}else{
													res.json({"err_code": 0, "err_msg": "Procedure Performer has been update in this Procedure.", "data": procedurePerformer.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Procedure Performer Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Procedure Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkPerformerRole', function () {
							if (!validator.isEmpty(performerRole)) {
								checkCode(apikey, performerRole, 'PERFORMER_ROLE', function (resPerformerRoleCode) {
									if (resPerformerRoleCode.err_code > 0) {
										myEmitter.emit('checkProcedureID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer role code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkProcedureID');
							}
						})
						
						myEmitter.prependOnceListener('checkPerformerActorPractitioner', function () {
							if (!validator.isEmpty(performerActorPractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + performerActorPractitioner, 'PRACTITIONER', function (resPerformerActorPractitioner) {
									if (resPerformerActorPractitioner.err_code > 0) {
										myEmitter.emit('checkPerformerRole');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerRole');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorOrganization', function () {
							if (!validator.isEmpty(performerActorOrganization)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerActorOrganization, 'ORGANIZATION', function (resPerformerActorOrganization) {
									if (resPerformerActorOrganization.err_code > 0) {
										myEmitter.emit('checkPerformerActorPractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorPractitioner');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorPatient', function () {
							if (!validator.isEmpty(performerActorPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + performerActorPatient, 'PATIENT', function (resPerformerActorPatient) {
									if (resPerformerActorPatient.err_code > 0) {
										myEmitter.emit('checkPerformerActorOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorOrganization');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorRelatedPerson', function () {
							if (!validator.isEmpty(performerActorRelatedPerson)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + performerActorRelatedPerson, 'RELATED_PERSON', function (resPerformerActorRelatedPerson) {
									if (resPerformerActorRelatedPerson.err_code > 0) {
										myEmitter.emit('checkPerformerActorPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor related person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorPatient');
							}
						})

						myEmitter.prependOnceListener('checkPerformerActorDevice', function () {
							if (!validator.isEmpty(performerActorDevice)) {
								checkUniqeValue(apikey, "DEVICE_ID|" + performerActorDevice, 'DEVICE', function (resPerformerActorDevice) {
									if (resPerformerActorDevice.err_code > 0) {
										myEmitter.emit('checkPerformerActorRelatedPerson');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor device id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPerformerActorRelatedPerson');
							}
						})

						if (!validator.isEmpty(performerOnBehalfOf)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerOnBehalfOf, 'ORGANIZATION', function (resPerformerOnBehalfOf) {
								if (resPerformerOnBehalfOf.err_code > 0) {
									myEmitter.emit('checkPerformerActorDevice');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Performer on behalf of id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPerformerActorDevice');
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
		procedureFocalDevice: function updateProcedureFocalDevice(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var procedureId = req.params.procedure_id;
			var procedureFocalDeviceId = req.params.procedure_focal_device_id;

			var err_code = 0;
			var err_msg = "";
			var dataProcedure = {};
			//input check 
			if(typeof procedureId !== 'undefined'){
				if(validator.isEmpty(procedureId)){
					err_code = 2;
					err_msg = "Procedure id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure id is required";
			}

			if(typeof procedureFocalDeviceId !== 'undefined'){
				if(validator.isEmpty(procedureFocalDeviceId)){
					err_code = 2;
					err_msg = "Procedure Target id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure Target id is required";
			}
			
			/*
			var action = req.body.action;
			var manipulated = req.body.manipulated;
			*/
			if(typeof req.body.focalDevice.action !== 'undefined' && req.body.focalDevice.action !== ""){
				var focalDeviceAction =  req.body.focalDevice.action.trim().toLowerCase();
				if(validator.isEmpty(focalDeviceAction)){
					dataProcedure.action = "";
				}else{
					dataProcedure.action = focalDeviceAction;
				}
			}else{
			  focalDeviceAction = "";
			}

			if(typeof req.body.focalDevice.manipulated !== 'undefined' && req.body.focalDevice.manipulated !== ""){
				var focalDeviceManipulated =  req.body.focalDevice.manipulated.trim().toLowerCase();
				if(validator.isEmpty(focalDeviceManipulated)){
					dataProcedure.manipulated = "";
				}else{
					dataProcedure.manipulated = focalDeviceManipulated;
				}
			}else{
			  focalDeviceManipulated = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkProcedureID', function(){
							checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureId, 'PROCEDURE', function(resProcedureId){
								if(resProcedureId.err_code > 0){
									checkUniqeValue(apikey, "FOCAL_DEVICE_ID|" + procedureFocalDeviceId, 'PROCEDURE_FOCAL_DEVICE', function(resProcedureFocalDeviceID){
										if(resProcedureFocalDeviceID.err_code > 0){
											ApiFHIR.put('procedureFocalDevice', {"apikey": apikey, "_id": procedureFocalDeviceId, "dr": "PROCEDURE_ID|"+procedureId}, {body: dataProcedure, json: true}, function(error, response, body){
												procedureFocalDevice = body;
												if(procedureFocalDevice.err_code > 0){
													res.json(procedureFocalDevice);	
												}else{
													res.json({"err_code": 0, "err_msg": "Procedure Focal Device has been update in this Procedure.", "data": procedureFocalDevice.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Procedure Focal Device Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Procedure Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkFocalDeviceAction', function () {
							if (!validator.isEmpty(focalDeviceAction)) {
								checkCode(apikey, focalDeviceAction, 'DEVICE_ACTION', function (resFocalDeviceActionCode) {
									if (resFocalDeviceActionCode.err_code > 0) {
										myEmitter.emit('checkProcedureID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Focal device action code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkProcedureID');
							}
						})

						if (!validator.isEmpty(focalDeviceManipulated)) {
							checkUniqeValue(apikey, "DEVICE_ID|" + focalDeviceManipulated, 'DEVICE', function (resFocalDeviceManipulated) {
								if (resFocalDeviceManipulated.err_code > 0) {
									myEmitter.emit('checkFocalDeviceAction');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Focal device manipulated id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkFocalDeviceAction');
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
		procedureNote: function updateProcedureNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var procedureId = req.params.procedure_id;
			var procedureNoteId = req.params.procedure_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataProcedure = {};
			//input check 
			if(typeof procedureId !== 'undefined'){
				if(validator.isEmpty(procedureId)){
					err_code = 2;
					err_msg = "Procedure id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure id is required";
			}

			if(typeof procedureNoteId !== 'undefined'){
				if(validator.isEmpty(procedureNoteId)){
					err_code = 2;
					err_msg = "Procedure Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure Note id is required";
			}
			
			/*
			"id": procedureNoteId,
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
					err_msg = "Procedure note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Procedure note time invalid date format.";	
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
						myEmitter.once('checkProcedureID', function(){
							checkUniqeValue(apikey, "procedure_id|" + procedureId, 'procedure', function(resProcedureId){
								if(resProcedureId.err_code > 0){
									checkUniqeValue(apikey, "NOTE_ID|" + procedureNoteId, 'NOTE', function(resProcedureNoteID){
										if(resProcedureNoteID.err_code > 0){
											ApiFHIR.put('annotation', {"apikey": apikey, "_id": procedureNoteId, "dr": "procedure_id|"+procedureId}, {body: dataProcedure, json: true}, function(error, response, body){
												procedureNote = body;
												if(procedureNote.err_code > 0){
													res.json(procedureNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Procedure Note has been update in this Procedure.", "data": procedureNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Procedure Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Procedure Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkProcedureID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkProcedureID');
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