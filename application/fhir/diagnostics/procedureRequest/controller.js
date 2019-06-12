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
		procedureRequest : function getProcedureRequest(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var procedureRequestId = req.query._id;
			var authored = req.query.authored;
			var based_on = req.query.basedOn;
			var body_site = req.query.bodySite;
			var code = req.query.code;
			var context = req.query.context;
			var definition = req.query.definition;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var intent = req.query.intent;
			var occurrence = req.query.occurrence;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var performer_type = req.query.performerType;
			var priority = req.query.priority;
			var replaces = req.query.replaces;
			var requester = req.query.requester;
			var requisition = req.query.requisition;
			var specimen = req.query.specimen;
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
			
			if(typeof procedureRequestId !== 'undefined'){
				if(!validator.isEmpty(procedureRequestId)){
					qString._id = procedureRequestId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Procedure Request Id is required."});
				}
			}
			
			if(typeof authored !== 'undefined'){
				if(!validator.isEmpty(authored)){
					if(!regex.test(authored)){
						res.json({"err_code": 1, "err_msg": "Authored invalid format."});
					}else{
						qString.authored = authored; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Authored is empty."});
				}
			}

			if(typeof based_on !== 'undefined'){
				if(!validator.isEmpty(based_on)){
					qString.based_on = based_on; 
				}else{
					res.json({"err_code": 1, "err_msg": "Based on is empty."});
				}
			}

			if(typeof body_site !== 'undefined'){
				if(!validator.isEmpty(body_site)){
					qString.body_site = body_site; 
				}else{
					res.json({"err_code": 1, "err_msg": "Body site is empty."});
				}
			}

			if(typeof code !== 'undefined'){
				if(!validator.isEmpty(code)){
					qString.code = code; 
				}else{
					res.json({"err_code": 1, "err_msg": "Code is empty."});
				}
			}

			if(typeof context !== 'undefined'){
				if(!validator.isEmpty(context)){
					qString.context = context; 
				}else{
					res.json({"err_code": 1, "err_msg": "Context is empty."});
				}
			}

			if(typeof definition !== 'undefined'){
				if(!validator.isEmpty(definition)){
					qString.definition = definition; 
				}else{
					res.json({"err_code": 1, "err_msg": "Definition is empty."});
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

			if(typeof intent !== 'undefined'){
				if(!validator.isEmpty(intent)){
					qString.intent = intent; 
				}else{
					res.json({"err_code": 1, "err_msg": "Intent is empty."});
				}
			}

			if(typeof occurrence !== 'undefined'){
				if(!validator.isEmpty(occurrence)){
					if(!regex.test(occurrence)){
						res.json({"err_code": 1, "err_msg": "Occurrence invalid format."});
					}else{
						qString.occurrence = occurrence; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Occurrence is empty."});
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

			if(typeof performer_type !== 'undefined'){
				if(!validator.isEmpty(performer_type)){
					qString.performer_type = performer_type; 
				}else{
					res.json({"err_code": 1, "err_msg": "Performer type is empty."});
				}
			}

			if(typeof priority !== 'undefined'){
				if(!validator.isEmpty(priority)){
					qString.priority = priority; 
				}else{
					res.json({"err_code": 1, "err_msg": "Priority is empty."});
				}
			}

			if(typeof replaces !== 'undefined'){
				if(!validator.isEmpty(replaces)){
					qString.replaces = replaces; 
				}else{
					res.json({"err_code": 1, "err_msg": "Replaces is empty."});
				}
			}

			if(typeof requester !== 'undefined'){
				if(!validator.isEmpty(requester)){
					qString.requester = requester; 
				}else{
					res.json({"err_code": 1, "err_msg": "Requester is empty."});
				}
			}

			if(typeof requisition !== 'undefined'){
				if(!validator.isEmpty(requisition)){
					qString.requisition = requisition; 
				}else{
					res.json({"err_code": 1, "err_msg": "Requisition is empty."});
				}
			}

			if(typeof specimen !== 'undefined'){
				if(!validator.isEmpty(specimen)){
					qString.specimen = specimen; 
				}else{
					res.json({"err_code": 1, "err_msg": "Specimen is empty."});
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

			seedPhoenixFHIR.path.GET = {
				"ProcedureRequest" : {
					"location": "%(apikey)s/ProcedureRequest",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('ProcedureRequest', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var procedureRequest = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(procedureRequest.err_code == 0){
								//cek jumdata dulu
								if(procedureRequest.data.length > 0){
									newProcedureRequest = [];
									for(i=0; i < procedureRequest.data.length; i++){
										myEmitter.once("getIdentifier", function(procedureRequest, index, newProcedureRequest, countProcedureRequest){
											/*console.log(procedureRequest);*/
											//get identifier
											qString = {};
											qString.procedure_request_id = procedureRequest.id;
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
													var objectProcedureRequest = {};
													objectProcedureRequest.resourceType = procedureRequest.resourceType;
													objectProcedureRequest.id = procedureRequest.id;
													objectProcedureRequest.identifier = identifier.data;
													objectProcedureRequest.basedOn = procedureRequest.basedOn;
													objectProcedureRequest.replaces = procedureRequest.replaces;
													objectProcedureRequest.requisition = procedureRequest.requisition;
													objectProcedureRequest.status = procedureRequest.status;
													objectProcedureRequest.intent = procedureRequest.intent;
													objectProcedureRequest.priority = procedureRequest.priority;
													objectProcedureRequest.doNotPerform = procedureRequest.doNotPerform;
													objectProcedureRequest.category = procedureRequest.category;
													objectProcedureRequest.code = procedureRequest.code;
													objectProcedureRequest.subject = procedureRequest.subject;
													objectProcedureRequest.context = procedureRequest.context;
													objectProcedureRequest.occurrence = procedureRequest.occurrence;
													objectProcedureRequest.asNeeded = procedureRequest.asNeeded;
													objectProcedureRequest.authoredOn = procedureRequest.authoredOn;
													objectProcedureRequest.requester = procedureRequest.requester;
													objectProcedureRequest.performerType = procedureRequest.performerType;
													objectProcedureRequest.performer = procedureRequest.performer;
													objectProcedureRequest.reasonCode = procedureRequest.reasonCode;
													objectProcedureRequest.supportingInfo = procedureRequest.supportingInfo;
													objectProcedureRequest.bodySite = procedureRequest.bodySite;
												
													newProcedureRequest[index] = objectProcedureRequest;

													myEmitter.once("getNote", function(procedureRequest, index, newProcedureRequest, countProcedureRequest){
														/*console.log(procedureRequest);*/
														//get identifier
														qString = {};
														qString.procedure_request_id = procedureRequest.id;
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
																var objectProcedureRequest = {};
																objectProcedureRequest.resourceType = procedureRequest.resourceType;
																objectProcedureRequest.id = procedureRequest.id;
																objectProcedureRequest.identifier = procedureRequest.identifier;
																objectProcedureRequest.basedOn = procedureRequest.basedOn;
																objectProcedureRequest.replaces = procedureRequest.replaces;
																objectProcedureRequest.requisition = procedureRequest.requisition;
																objectProcedureRequest.status = procedureRequest.status;
																objectProcedureRequest.intent = procedureRequest.intent;
																objectProcedureRequest.priority = procedureRequest.priority;
																objectProcedureRequest.doNotPerform = procedureRequest.doNotPerform;
																objectProcedureRequest.category = procedureRequest.category;
																objectProcedureRequest.code = procedureRequest.code;
																objectProcedureRequest.subject = procedureRequest.subject;
																objectProcedureRequest.context = procedureRequest.context;
																objectProcedureRequest.occurrence = procedureRequest.occurrence;
																objectProcedureRequest.asNeeded = procedureRequest.asNeeded;
																objectProcedureRequest.authoredOn = procedureRequest.authoredOn;
																objectProcedureRequest.requester = procedureRequest.requester;
																objectProcedureRequest.performerType = procedureRequest.performerType;
																objectProcedureRequest.performer = procedureRequest.performer;
																objectProcedureRequest.reasonCode = procedureRequest.reasonCode;
																objectProcedureRequest.supportingInfo = procedureRequest.supportingInfo;
																objectProcedureRequest.bodySite = procedureRequest.bodySite;
																objectProcedureRequest.note = annotation.data;

																newProcedureRequest[index] = objectProcedureRequest;

																myEmitter.once("getTiming", function(procedureRequest, index, newProcedureRequest, countProcedureRequest){
																	/*console.log(procedureRequest);*/
																	//get identifier
																	qString = {};
																	qString.procedure_request_id = procedureRequest.id;
																	seedPhoenixFHIR.path.GET = {
																		"Timing" : {
																			"location": "%(apikey)s/Timing",
																			"query": qString
																		}
																	}
																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																	ApiFHIR.get('Timing', {"apikey": apikey}, {}, function(error, response, body){
																		timing = JSON.parse(body);
																		if(timing.err_code == 0){
																			var objectProcedureRequest = {};
																			objectProcedureRequest.resourceType = procedureRequest.resourceType;
																			objectProcedureRequest.id = procedureRequest.id;
																			objectProcedureRequest.identifier = procedureRequest.identifier;
																			objectProcedureRequest.basedOn = procedureRequest.basedOn;
																			objectProcedureRequest.replaces = procedureRequest.replaces;
																			objectProcedureRequest.requisition = procedureRequest.requisition;
																			objectProcedureRequest.status = procedureRequest.status;
																			objectProcedureRequest.intent = procedureRequest.intent;
																			objectProcedureRequest.priority = procedureRequest.priority;
																			objectProcedureRequest.doNotPerform = procedureRequest.doNotPerform;
																			objectProcedureRequest.category = procedureRequest.category;
																			objectProcedureRequest.code = procedureRequest.code;
																			objectProcedureRequest.subject = procedureRequest.subject;
																			objectProcedureRequest.context = procedureRequest.context;
																			var Occurrence = {};
																			Occurrence.occurrenceDateTime = procedureRequest.occurrence.occurrenceDateTime;
																			Occurrence.occurrencePeriod = procedureRequest.occurrence.occurrencePeriod;
																			Occurrence.occurrenceTiming = timing.data;
																			objectProcedureRequest.occurrence = Occurrence;
																			objectProcedureRequest.asNeeded = procedureRequest.asNeeded;
																			objectProcedureRequest.authoredOn = procedureRequest.authoredOn;
																			objectProcedureRequest.requester = procedureRequest.requester;
																			objectProcedureRequest.performerType = procedureRequest.performerType;
																			objectProcedureRequest.performer = procedureRequest.performer;
																			objectProcedureRequest.reasonCode = procedureRequest.reasonCode;
																			objectProcedureRequest.supportingInfo = procedureRequest.supportingInfo;
																			objectProcedureRequest.bodySite = procedureRequest.bodySite;
																			objectProcedureRequest.note = procedureRequest.note;

																			newProcedureRequest[index] = objectProcedureRequest;

																			myEmitter.once("getProcedureRequestDefinitionPlanDefinition", function(procedureRequest, index, newProcedureRequest, countProcedureRequest){
																				/*console.log(procedureRequest);*/
																				//get identifier
																				qString = {};
																				qString.procedure_request_id = procedureRequest.id;
																				seedPhoenixFHIR.path.GET = {
																					"ProcedureRequestDefinitionPlanDefinition" : {
																						"location": "%(apikey)s/ProcedureRequestDefinitionPlanDefinition",
																						"query": qString
																					}
																				}
																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																				ApiFHIR.get('ProcedureRequestDefinitionPlanDefinition', {"apikey": apikey}, {}, function(error, response, body){
																					procedureRequestDefinitionPlanDefinition = JSON.parse(body);
																					if(procedureRequestDefinitionPlanDefinition.err_code == 0){
																						var objectProcedureRequest = {};
																						objectProcedureRequest.resourceType = procedureRequest.resourceType;
																						objectProcedureRequest.id = procedureRequest.id;
																						objectProcedureRequest.identifier = procedureRequest.identifier;
																						var Definition = {};
																						Definition.planDefinition = procedureRequestDefinitionPlanDefinition.data;
																						objectProcedureRequest.definition = Definition;
																						objectProcedureRequest.basedOn = procedureRequest.basedOn;
																						objectProcedureRequest.replaces = procedureRequest.replaces;
																						objectProcedureRequest.requisition = procedureRequest.requisition;
																						objectProcedureRequest.status = procedureRequest.status;
																						objectProcedureRequest.intent = procedureRequest.intent;
																						objectProcedureRequest.priority = procedureRequest.priority;
																						objectProcedureRequest.doNotPerform = procedureRequest.doNotPerform;
																						objectProcedureRequest.category = procedureRequest.category;
																						objectProcedureRequest.code = procedureRequest.code;
																						objectProcedureRequest.subject = procedureRequest.subject;
																						objectProcedureRequest.context = procedureRequest.context;
																						objectProcedureRequest.occurrence = procedureRequest.occurrence;
																						objectProcedureRequest.asNeeded = procedureRequest.asNeeded;
																						objectProcedureRequest.authoredOn = procedureRequest.authoredOn;
																						objectProcedureRequest.requester = procedureRequest.requester;
																						objectProcedureRequest.performerType = procedureRequest.performerType;
																						objectProcedureRequest.performer = procedureRequest.performer;
																						objectProcedureRequest.reasonCode = procedureRequest.reasonCode;
																						objectProcedureRequest.supportingInfo = procedureRequest.supportingInfo;
																						objectProcedureRequest.bodySite = procedureRequest.bodySite;
																						objectProcedureRequest.note = procedureRequest.note;

																						newProcedureRequest[index] = objectProcedureRequest;

																						myEmitter.once("getProcedureRequestDefinitionActivityDefinition", function(procedureRequest, index, newProcedureRequest, countProcedureRequest){
																							/*console.log(procedureRequest);*/
																							//get identifier
																							qString = {};
																							qString.procedure_request_id = procedureRequest.id;
																							seedPhoenixFHIR.path.GET = {
																								"ProcedureRequestDefinitionActivityDefinition" : {
																									"location": "%(apikey)s/ProcedureRequestDefinitionActivityDefinition",
																									"query": qString
																								}
																							}
																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																							ApiFHIR.get('ProcedureRequestDefinitionActivityDefinition', {"apikey": apikey}, {}, function(error, response, body){
																								procedureRequestDefinitionActivityDefinition = JSON.parse(body);
																								if(procedureRequestDefinitionActivityDefinition.err_code == 0){
																									var objectProcedureRequest = {};
																									objectProcedureRequest.resourceType = procedureRequest.resourceType;
																									objectProcedureRequest.id = procedureRequest.id;
																									objectProcedureRequest.identifier = procedureRequest.identifier;
																									var Definition = {};
																									Definition.planDefinition = procedureRequest.definition.planDefinition;
																									Definition.activityDefinition = procedureRequestDefinitionActivityDefinition.data;
																									objectProcedureRequest.definition = Definition;
																									objectProcedureRequest.basedOn = procedureRequest.basedOn;
																									objectProcedureRequest.replaces = procedureRequest.replaces;
																									objectProcedureRequest.requisition = procedureRequest.requisition;
																									objectProcedureRequest.status = procedureRequest.status;
																									objectProcedureRequest.intent = procedureRequest.intent;
																									objectProcedureRequest.priority = procedureRequest.priority;
																									objectProcedureRequest.doNotPerform = procedureRequest.doNotPerform;
																									objectProcedureRequest.category = procedureRequest.category;
																									objectProcedureRequest.code = procedureRequest.code;
																									objectProcedureRequest.subject = procedureRequest.subject;
																									objectProcedureRequest.context = procedureRequest.context;
																									objectProcedureRequest.occurrence = procedureRequest.occurrence;
																									objectProcedureRequest.asNeeded = procedureRequest.asNeeded;
																									objectProcedureRequest.authoredOn = procedureRequest.authoredOn;
																									objectProcedureRequest.requester = procedureRequest.requester;
																									objectProcedureRequest.performerType = procedureRequest.performerType;
																									objectProcedureRequest.performer = procedureRequest.performer;
																									objectProcedureRequest.reasonCode = procedureRequest.reasonCode;
																									objectProcedureRequest.supportingInfo = procedureRequest.supportingInfo;
																									objectProcedureRequest.bodySite = procedureRequest.bodySite;
																									objectProcedureRequest.note = procedureRequest.note;

																									newProcedureRequest[index] = objectProcedureRequest;

																									myEmitter.once("getProcedureRequestReasonReferenceCondition", function(procedureRequest, index, newProcedureRequest, countProcedureRequest){
																										/*console.log(procedureRequest);*/
																										//get identifier
																										qString = {};
																										qString.procedure_request_id = procedureRequest.id;
																										seedPhoenixFHIR.path.GET = {
																											"ProcedureRequestReasonReferenceCondition" : {
																												"location": "%(apikey)s/ProcedureRequestReasonReferenceCondition",
																												"query": qString
																											}
																										}
																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																										ApiFHIR.get('ProcedureRequestReasonReferenceCondition', {"apikey": apikey}, {}, function(error, response, body){
																											procedureRequestReasonReferenceCondition = JSON.parse(body);
																											if(procedureRequestReasonReferenceCondition.err_code == 0){
																												var objectProcedureRequest = {};
																												objectProcedureRequest.resourceType = procedureRequest.resourceType;
																												objectProcedureRequest.id = procedureRequest.id;
																												objectProcedureRequest.identifier = procedureRequest.identifier;
																												objectProcedureRequest.definition = procedureRequest.definition;
																												objectProcedureRequest.basedOn = procedureRequest.basedOn;
																												objectProcedureRequest.replaces = procedureRequest.replaces;
																												objectProcedureRequest.requisition = procedureRequest.requisition;
																												objectProcedureRequest.status = procedureRequest.status;
																												objectProcedureRequest.intent = procedureRequest.intent;
																												objectProcedureRequest.priority = procedureRequest.priority;
																												objectProcedureRequest.doNotPerform = procedureRequest.doNotPerform;
																												objectProcedureRequest.category = procedureRequest.category;
																												objectProcedureRequest.code = procedureRequest.code;
																												objectProcedureRequest.subject = procedureRequest.subject;
																												objectProcedureRequest.context = procedureRequest.context;
																												objectProcedureRequest.occurrence = procedureRequest.occurrence;
																												objectProcedureRequest.asNeeded = procedureRequest.asNeeded;
																												objectProcedureRequest.authoredOn = procedureRequest.authoredOn;
																												objectProcedureRequest.requester = procedureRequest.requester;
																												objectProcedureRequest.performerType = procedureRequest.performerType;
																												objectProcedureRequest.performer = procedureRequest.performer;
																												objectProcedureRequest.reasonCode = procedureRequest.reasonCode;
																												var ReasonReference = {};
																												ReasonReference.condition = procedureRequestReasonReferenceCondition.data;
																												objectProcedureRequest.reasonReference = ReasonReference;
																												objectProcedureRequest.supportingInfo = procedureRequest.supportingInfo;
																												objectProcedureRequest.bodySite = procedureRequest.bodySite;
																												objectProcedureRequest.note = procedureRequest.note;

																												newProcedureRequest[index] = objectProcedureRequest;

																												myEmitter.once("getProcedureRequestReasonReferenceObservation", function(procedureRequest, index, newProcedureRequest, countProcedureRequest){
																													/*console.log(procedureRequest);*/
																													//get identifier
																													qString = {};
																													qString.procedure_request_id = procedureRequest.id;
																													seedPhoenixFHIR.path.GET = {
																														"ProcedureRequestReasonReferenceObservation" : {
																															"location": "%(apikey)s/ProcedureRequestReasonReferenceObservation",
																															"query": qString
																														}
																													}
																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																													ApiFHIR.get('ProcedureRequestReasonReferenceObservation', {"apikey": apikey}, {}, function(error, response, body){
																														procedureRequestReasonReferenceObservation = JSON.parse(body);
																														if(procedureRequestReasonReferenceObservation.err_code == 0){
																															var objectProcedureRequest = {};
																															objectProcedureRequest.resourceType = procedureRequest.resourceType;
																															objectProcedureRequest.id = procedureRequest.id;
																															objectProcedureRequest.identifier = procedureRequest.identifier;
																															objectProcedureRequest.definition = procedureRequest.definition;
																															objectProcedureRequest.basedOn = procedureRequest.basedOn;
																															objectProcedureRequest.replaces = procedureRequest.replaces;
																															objectProcedureRequest.requisition = procedureRequest.requisition;
																															objectProcedureRequest.status = procedureRequest.status;
																															objectProcedureRequest.intent = procedureRequest.intent;
																															objectProcedureRequest.priority = procedureRequest.priority;
																															objectProcedureRequest.doNotPerform = procedureRequest.doNotPerform;
																															objectProcedureRequest.category = procedureRequest.category;
																															objectProcedureRequest.code = procedureRequest.code;
																															objectProcedureRequest.subject = procedureRequest.subject;
																															objectProcedureRequest.context = procedureRequest.context;
																															objectProcedureRequest.occurrence = procedureRequest.occurrence;
																															objectProcedureRequest.asNeeded = procedureRequest.asNeeded;
																															objectProcedureRequest.authoredOn = procedureRequest.authoredOn;
																															objectProcedureRequest.requester = procedureRequest.requester;
																															objectProcedureRequest.performerType = procedureRequest.performerType;
																															objectProcedureRequest.performer = procedureRequest.performer;
																															objectProcedureRequest.reasonCode = procedureRequest.reasonCode;
																															var ReasonReference = {};
																															ReasonReference.condition = procedureRequest.reasonReference.condition;
																															ReasonReference.observation = procedureRequestReasonReferenceObservation.data
																															objectProcedureRequest.reasonReference = ReasonReference;
																															objectProcedureRequest.supportingInfo = procedureRequest.supportingInfo;
																															objectProcedureRequest.bodySite = procedureRequest.bodySite;
																															objectProcedureRequest.note = procedureRequest.note;

																															newProcedureRequest[index] = objectProcedureRequest;

																															myEmitter.once("getProcedureRequestSpecimen", function(procedureRequest, index, newProcedureRequest, countProcedureRequest){
																																/*console.log(procedureRequest);*/
																																//get identifier
																																qString = {};
																																qString.procedure_request_id = procedureRequest.id;
																																seedPhoenixFHIR.path.GET = {
																																	"ProcedureRequestSpecimen" : {
																																		"location": "%(apikey)s/ProcedureRequestSpecimen",
																																		"query": qString
																																	}
																																}
																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																																ApiFHIR.get('ProcedureRequestSpecimen', {"apikey": apikey}, {}, function(error, response, body){
																																	procedureRequestSpecimen = JSON.parse(body);
																																	if(procedureRequestSpecimen.err_code == 0){
																																		var objectProcedureRequest = {};
																																		objectProcedureRequest.resourceType = procedureRequest.resourceType;
																																		objectProcedureRequest.id = procedureRequest.id;
																																		objectProcedureRequest.identifier = procedureRequest.identifier;
																																		objectProcedureRequest.definition = procedureRequest.definition;
																																		objectProcedureRequest.basedOn = procedureRequest.basedOn;
																																		objectProcedureRequest.replaces = procedureRequest.replaces;
																																		objectProcedureRequest.requisition = procedureRequest.requisition;
																																		objectProcedureRequest.status = procedureRequest.status;
																																		objectProcedureRequest.intent = procedureRequest.intent;
																																		objectProcedureRequest.priority = procedureRequest.priority;
																																		objectProcedureRequest.doNotPerform = procedureRequest.doNotPerform;
																																		objectProcedureRequest.category = procedureRequest.category;
																																		objectProcedureRequest.code = procedureRequest.code;
																																		objectProcedureRequest.subject = procedureRequest.subject;
																																		objectProcedureRequest.context = procedureRequest.context;
																																		objectProcedureRequest.occurrence = procedureRequest.occurrence;
																																		objectProcedureRequest.asNeeded = procedureRequest.asNeeded;
																																		objectProcedureRequest.authoredOn = procedureRequest.authoredOn;
																																		objectProcedureRequest.requester = procedureRequest.requester;
																																		objectProcedureRequest.performerType = procedureRequest.performerType;
																																		objectProcedureRequest.performer = procedureRequest.performer;
																																		objectProcedureRequest.reasonCode = procedureRequest.reasonCode;
																																		objectProcedureRequest.reasonReference = procedureRequest.reasonReference;
																																		objectProcedureRequest.supportingInfo = procedureRequest.supportingInfo;
																																		objectProcedureRequest.specimen = procedureRequestSpecimen.data;
																																		objectProcedureRequest.bodySite = procedureRequest.bodySite;
																																		objectProcedureRequest.note = procedureRequest.note;

																																		newProcedureRequest[index] = objectProcedureRequest;

																																		myEmitter.once("getProcedureRequestProvenance", function(procedureRequest, index, newProcedureRequest, countProcedureRequest){
																																			/*console.log(procedureRequest);*/
																																			//get identifier
																																			qString = {};
																																			qString.procedure_request_id = procedureRequest.id;
																																			seedPhoenixFHIR.path.GET = {
																																				"ProcedureRequestProvenance" : {
																																					"location": "%(apikey)s/ProcedureRequestProvenance",
																																					"query": qString
																																				}
																																			}
																																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																																			ApiFHIR.get('ProcedureRequestProvenance', {"apikey": apikey}, {}, function(error, response, body){
																																				procedureRequestProvenance = JSON.parse(body);
																																				if(procedureRequestProvenance.err_code == 0){
																																					var objectProcedureRequest = {};
																																					objectProcedureRequest.resourceType = procedureRequest.resourceType;
																																					objectProcedureRequest.id = procedureRequest.id;
																																					objectProcedureRequest.identifier = procedureRequest.identifier;
																																					objectProcedureRequest.definition = procedureRequest.definition;
																																					objectProcedureRequest.basedOn = procedureRequest.basedOn;
																																					objectProcedureRequest.replaces = procedureRequest.replaces;
																																					objectProcedureRequest.requisition = procedureRequest.requisition;
																																					objectProcedureRequest.status = procedureRequest.status;
																																					objectProcedureRequest.intent = procedureRequest.intent;
																																					objectProcedureRequest.priority = procedureRequest.priority;
																																					objectProcedureRequest.doNotPerform = procedureRequest.doNotPerform;
																																					objectProcedureRequest.category = procedureRequest.category;
																																					objectProcedureRequest.code = procedureRequest.code;
																																					objectProcedureRequest.subject = procedureRequest.subject;
																																					objectProcedureRequest.context = procedureRequest.context;
																																					objectProcedureRequest.occurrence = procedureRequest.occurrence;
																																					objectProcedureRequest.asNeeded = procedureRequest.asNeeded;
																																					objectProcedureRequest.authoredOn = procedureRequest.authoredOn;
																																					objectProcedureRequest.requester = procedureRequest.requester;
																																					objectProcedureRequest.performerType = procedureRequest.performerType;
																																					objectProcedureRequest.performer = procedureRequest.performer;
																																					objectProcedureRequest.reasonCode = procedureRequest.reasonCode;
																																					objectProcedureRequest.reasonReference = procedureRequest.reasonReference;
																																					objectProcedureRequest.supportingInfo = procedureRequest.supportingInfo;
																																					objectProcedureRequest.specimen = procedureRequest.specimen;
																																					objectProcedureRequest.bodySite = procedureRequest.bodySite;
																																					objectProcedureRequest.note = procedureRequest.note;
																																					objectProcedureRequest.relevantHistory = procedureRequestProvenance.data;

																																					newProcedureRequest[index] = objectProcedureRequest;

																																					if(index == countProcedureRequest -1 ){
																																						res.json({"err_code": 0, "data":newProcedureRequest});
																																					}
																																				}else{
																																					res.json(procedureRequestProvenance);
																																				}
																																			})
																																		})
																																		myEmitter.emit("getProcedureRequestProvenance", objectProcedureRequest, index, newProcedureRequest, countProcedureRequest);
																																	}else{
																																		res.json(procedureRequestSpecimen);
																																	}
																																})
																															})
																															myEmitter.emit("getProcedureRequestSpecimen", objectProcedureRequest, index, newProcedureRequest, countProcedureRequest);
																														}else{
																															res.json(procedureRequestReasonReferenceObservation);
																														}
																													})
																												})
																												myEmitter.emit("getProcedureRequestReasonReferenceObservation", objectProcedureRequest, index, newProcedureRequest, countProcedureRequest);
																											}else{
																												res.json(procedureRequestReasonReferenceCondition);
																											}
																										})
																									})
																									myEmitter.emit("getProcedureRequestReasonReferenceCondition", objectProcedureRequest, index, newProcedureRequest, countProcedureRequest);
																								}else{
																									res.json(procedureRequestDefinitionActivityDefinition);
																								}
																							})
																						})
																						myEmitter.emit("getProcedureRequestDefinitionActivityDefinition", objectProcedureRequest, index, newProcedureRequest, countProcedureRequest);
																					}else{
																						res.json(procedureRequestDefinitionPlanDefinition);
																					}
																				})
																			})
																			myEmitter.emit("getProcedureRequestDefinitionPlanDefinition", objectProcedureRequest, index, newProcedureRequest, countProcedureRequest);

																		}else{
																			res.json(timing);
																		}
																	})
																})
																myEmitter.emit("getTiming", objectProcedureRequest, index, newProcedureRequest, countProcedureRequest);
															}else{
																res.json(annotation);
															}
														})
													})
													myEmitter.emit("getNote", objectProcedureRequest, index, newProcedureRequest, countProcedureRequest);
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", procedureRequest.data[i], i, newProcedureRequest, procedureRequest.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Procedure Request is empty."});	
								}
							}else{
								res.json(procedureRequest);
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
					var procedureRequestId = req.params.procedure_request_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + procedureRequestId, 'PROCEDURE_REQUEST', function(resProcedureRequestID){
								if(resProcedureRequestID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.procedure_request_id = procedureRequestId;
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
						  			qString.procedure_request_id = procedureRequestId;
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
									res.json({"err_code": 501, "err_msg": "Procedure Request Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				}
	},
	post: {
		procedureRequest : function addProcedureRequest(req, res){
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
definition.activityDefinition|definitionActivityDefinition||
definition.planDefinition|definitionPlanDefinition||
basedOn|basedOn||
replaces|replaces||
requisition|requisition||
status|status||nn
intent|intent||nn
priority|priority||
doNotPerform|doNotPerform|boolean|
category|category||
code|code||nn
subject.patient|subjectPatient||
subject.group|subjectGroup||
subject.device|subjectDevice||
subject.location|subjectLocation||
context.encounter|contextEncounter||
context.episodeOfCare|contextEpisodeOfCare||
occurrence.occurrenceDateTime|occurrenceOccurrenceDateTime|date|
occurrence.occurrencePeriod|occurrenceOccurrencePeriod|period|
occurrence.occurrenceTiming.event|occurrenceOccurrenceTimingEvent|date|
occurrence.occurrenceTiming.repeat.bounds.boundsDuration|occurrenceOccurrenceTimingRepeatBoundsBoundsDuration||
occurrence.occurrenceTiming.repeat.bounds.boundsRange|occurrenceOccurrenceTimingRepeatBoundsBoundsRange|range|
occurrence.occurrenceTiming.repeat.bounds.boundsPeriod|occurrenceOccurrenceTimingRepeatBoundsBoundsPeriod|period|
occurrence.occurrenceTiming.repeat.count|occurrenceOccurrenceTimingRepeatCount|integer|
occurrence.occurrenceTiming.repeat.countMax|occurrenceOccurrenceTimingRepeatCountMax|integer|
occurrence.occurrenceTiming.repeat.duration|occurrenceOccurrenceTimingRepeatDuration|integer|
occurrence.occurrenceTiming.repeat.durationMax|occurrenceOccurrenceTimingRepeatDurationMax|integer|
occurrence.occurrenceTiming.repeat.durationUnit|occurrenceOccurrenceTimingRepeatDurationUnit||
occurrence.occurrenceTiming.repeat.frequency|occurrenceOccurrenceTimingRepeatFrequency|integer|
occurrence.occurrenceTiming.repeat.frequencyMax|occurrenceOccurrenceTimingRepeatFrequencyMax|integer|
occurrence.occurrenceTiming.repeat.period|occurrenceOccurrenceTimingRepeatPeriod|integer|
occurrence.occurrenceTiming.repeat.periodMax|occurrenceOccurrenceTimingRepeatPeriodMax|integer|
occurrence.occurrenceTiming.repeat.periodUnit|occurrenceOccurrenceTimingRepeatPeriodUnit||
occurrence.occurrenceTiming.repeat.dayOfWeek|occurrenceOccurrenceTimingRepeatDayOfWeek||
occurrence.occurrenceTiming.repeat.timeOfDay|occurrenceOccurrenceTimingRepeatTimeOfDay|date|
occurrence.occurrenceTiming.repeat.when|occurrenceOccurrenceTimingRepeatWhen||
occurrence.occurrenceTiming.repeat.offset|occurrenceOccurrenceTimingRepeatOffset|integer|
occurrence.occurrenceTiming.code|occurrenceOccurrenceTimingCode||
asNeeded.asNeededBoolean|asNeededAsNeededBoolean|boolean|
asNeeded.asNeededCodeableConcept|asNeededAsNeededCodeableConcept||
authoredOn|authoredOn|date|
requester.agent.device|requesterAgentDevice||
requester.agent.practitioner|requesterAgentPractitioner||
requester.agent.organization|requesterAgentOrganization||
requester.onBehalfOf|requesterOnBehalfOf||
performerType|performerType||
performer.practitioner|performerPractitioner||
performer.organization|performerOrganization||
performer.patient|performerPatient||
performer.device|performerDevice||
performer.relatedPerson|performerRelatedPerson||
performer.healthcareService|performerHealthcareService||
reasonCode|reasonCode||
reasonReference.condition|reasonReferenceCondition||
reasonReference.observation|reasonReferenceObservation||
supportingInfo|supportingInfo||
specimen|specimen||
bodySite|bodySite||
note.author.authorReference.practitioner|noteAuthorAuthorReferencePractitioner||
note.author.authorReference.patient|noteAuthorAuthorReferencePatient||
note.author.authorReference.relatedPerson|noteAuthorAuthorReferenceRelatedPerson||
note.author.authorString|noteAuthorAuthorString||
note.time|noteTime|date|
note.string|noteString||
relevantHistory|relevantHistory||
*/
			if(typeof req.body.definition.activityDefinition !== 'undefined'){
				var definitionActivityDefinition =  req.body.definition.activityDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionActivityDefinition)){
					definitionActivityDefinition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'definition activity definition' in json Procedure Request request.";
			}

			if(typeof req.body.definition.planDefinition !== 'undefined'){
				var definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					definitionPlanDefinition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'definition plan definition' in json Procedure Request request.";
			}

			if(typeof req.body.basedOn !== 'undefined'){
				var basedOn =  req.body.basedOn.trim().toLowerCase();
				if(validator.isEmpty(basedOn)){
					basedOn = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on' in json Procedure Request request.";
			}

			if(typeof req.body.replaces !== 'undefined'){
				var replaces =  req.body.replaces.trim().toLowerCase();
				if(validator.isEmpty(replaces)){
					replaces = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'replaces' in json Procedure Request request.";
			}

			if(typeof req.body.requisition !== 'undefined'){
				var requisition =  req.body.requisition.trim().toLowerCase();
				if(validator.isEmpty(requisition)){
					requisition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'requisition' in json Procedure Request request.";
			}

			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Procedure Request status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Procedure Request request.";
			}

			if(typeof req.body.intent !== 'undefined'){
				var intent =  req.body.intent.trim().toLowerCase();
				if(validator.isEmpty(intent)){
					err_code = 2;
					err_msg = "Procedure Request intent is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'intent' in json Procedure Request request.";
			}

			if(typeof req.body.priority !== 'undefined'){
				var priority =  req.body.priority.trim().toLowerCase();
				if(validator.isEmpty(priority)){
					priority = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'priority' in json Procedure Request request.";
			}

			if (typeof req.body.doNotPerform !== 'undefined') {
				var doNotPerform = req.body.doNotPerform.trim().toLowerCase();
					if(validator.isEmpty(doNotPerform)){
						doNotPerform = "false";
					}
				if(doNotPerform === "true" || doNotPerform === "false"){
					doNotPerform = doNotPerform;
				} else {
					err_code = 2;
					err_msg = "Procedure Request do not perform is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'do not perform' in json Procedure Request request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Procedure Request request.";
			}

			if(typeof req.body.code !== 'undefined'){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					err_code = 2;
					err_msg = "Procedure Request code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Procedure Request request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Procedure Request request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Procedure Request request.";
			}

			if(typeof req.body.subject.device !== 'undefined'){
				var subjectDevice =  req.body.subject.device.trim().toLowerCase();
				if(validator.isEmpty(subjectDevice)){
					subjectDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject device' in json Procedure Request request.";
			}

			if(typeof req.body.subject.location !== 'undefined'){
				var subjectLocation =  req.body.subject.location.trim().toLowerCase();
				if(validator.isEmpty(subjectLocation)){
					subjectLocation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject location' in json Procedure Request request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Procedure Request request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceDateTime !== 'undefined'){
				var occurrenceOccurrenceDateTime =  req.body.occurrence.occurrenceDateTime;
				if(validator.isEmpty(occurrenceOccurrenceDateTime)){
					occurrenceOccurrenceDateTime = "";
				}else{
					if(!regex.test(occurrenceOccurrenceDateTime)){
						err_code = 2;
						err_msg = "Procedure Request occurrence occurrence date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence date time' in json Procedure Request request.";
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
				      err_msg = "Procedure Request occurrence occurrence period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Procedure Request occurrence occurrence period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'occurrence occurrence period' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.event !== 'undefined'){
				var occurrenceOccurrenceTimingEvent =  req.body.occurrence.occurrenceTiming.event;
				if(validator.isEmpty(occurrenceOccurrenceTimingEvent)){
					occurrenceOccurrenceTimingEvent = "";
				}else{
					if(!regex.test(occurrenceOccurrenceTimingEvent)){
						err_code = 2;
						err_msg = "Procedure Request occurrence occurrence timing event invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing event' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.bounds.boundsDuration !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatBoundsBoundsDuration =  req.body.occurrence.occurrenceTiming.repeat.bounds.boundsDuration.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatBoundsBoundsDuration)){
					occurrenceOccurrenceTimingRepeatBoundsBoundsDuration = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat bounds bounds duration' in json Procedure Request request.";
			}

			if (typeof req.body.occurrence.occurrenceTiming.repeat.bounds.boundsRange !== 'undefined') {
			  var occurrenceOccurrenceTimingRepeatBoundsBoundsRange = req.body.occurrence.occurrenceTiming.repeat.bounds.boundsRange;
 				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatBoundsBoundsRange)){
				  var occurrenceOccurrenceTimingRepeatBoundsBoundsRangeLow = "";
				  var occurrenceOccurrenceTimingRepeatBoundsBoundsRangeHigh = "";
				} else {
				  if (occurrenceOccurrenceTimingRepeatBoundsBoundsRange.indexOf("to") > 0) {
				    arrOccurrenceOccurrenceTimingRepeatBoundsBoundsRange = occurrenceOccurrenceTimingRepeatBoundsBoundsRange.split("to");
				    var occurrenceOccurrenceTimingRepeatBoundsBoundsRangeLow = arrOccurrenceOccurrenceTimingRepeatBoundsBoundsRange[0];
				    var occurrenceOccurrenceTimingRepeatBoundsBoundsRangeHigh = arrOccurrenceOccurrenceTimingRepeatBoundsBoundsRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Procedure Request occurrence occurrence timing repeat bounds bounds range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'occurrence occurrence timing repeat bounds bounds range' in json Procedure Request request.";
			}

			if (typeof req.body.occurrence.occurrenceTiming.repeat.bounds.boundsPeriod !== 'undefined') {
			  var occurrenceOccurrenceTimingRepeatBoundsBoundsPeriod = req.body.occurrence.occurrenceTiming.repeat.bounds.boundsPeriod;
 				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatBoundsBoundsPeriod)) {
				  var occurrenceOccurrenceTimingRepeatBoundsBoundsPeriodStart = "";
				  var occurrenceOccurrenceTimingRepeatBoundsBoundsPeriodEnd = "";
				} else {
				  if (occurrenceOccurrenceTimingRepeatBoundsBoundsPeriod.indexOf("to") > 0) {
				    arrOccurrenceOccurrenceTimingRepeatBoundsBoundsPeriod = occurrenceOccurrenceTimingRepeatBoundsBoundsPeriod.split("to");
				    var occurrenceOccurrenceTimingRepeatBoundsBoundsPeriodStart = arrOccurrenceOccurrenceTimingRepeatBoundsBoundsPeriod[0];
				    var occurrenceOccurrenceTimingRepeatBoundsBoundsPeriodEnd = arrOccurrenceOccurrenceTimingRepeatBoundsBoundsPeriod[1];
				    if (!regex.test(occurrenceOccurrenceTimingRepeatBoundsBoundsPeriodStart) && !regex.test(occurrenceOccurrenceTimingRepeatBoundsBoundsPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Procedure Request occurrence occurrence timing repeat bounds bounds period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Procedure Request occurrence occurrence timing repeat bounds bounds period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'occurrence occurrence timing repeat bounds bounds period' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.count !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatCount =  req.body.occurrence.occurrenceTiming.repeat.count;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatCount)){
					occurrenceOccurrenceTimingRepeatCount = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatCount)){
						err_code = 2;
						err_msg = "Procedure Request occurrence occurrence timing repeat count is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat count' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.countMax !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatCountMax =  req.body.occurrence.occurrenceTiming.repeat.countMax;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatCountMax)){
					occurrenceOccurrenceTimingRepeatCountMax = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatCountMax)){
						err_code = 2;
						err_msg = "Procedure Request occurrence occurrence timing repeat count max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat count max' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.duration !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatDuration =  req.body.occurrence.occurrenceTiming.repeat.duration;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatDuration)){
					occurrenceOccurrenceTimingRepeatDuration = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatDuration)){
						err_code = 2;
						err_msg = "Procedure Request occurrence occurrence timing repeat duration is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat duration' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.durationMax !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatDurationMax =  req.body.occurrence.occurrenceTiming.repeat.durationMax;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatDurationMax)){
					occurrenceOccurrenceTimingRepeatDurationMax = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatDurationMax)){
						err_code = 2;
						err_msg = "Procedure Request occurrence occurrence timing repeat duration max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat duration max' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.durationUnit !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatDurationUnit =  req.body.occurrence.occurrenceTiming.repeat.durationUnit.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatDurationUnit)){
					occurrenceOccurrenceTimingRepeatDurationUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat duration unit' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.frequency !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatFrequency =  req.body.occurrence.occurrenceTiming.repeat.frequency;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatFrequency)){
					occurrenceOccurrenceTimingRepeatFrequency = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatFrequency)){
						err_code = 2;
						err_msg = "Procedure Request occurrence occurrence timing repeat frequency is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat frequency' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.frequencyMax !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatFrequencyMax =  req.body.occurrence.occurrenceTiming.repeat.frequencyMax;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatFrequencyMax)){
					occurrenceOccurrenceTimingRepeatFrequencyMax = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatFrequencyMax)){
						err_code = 2;
						err_msg = "Procedure Request occurrence occurrence timing repeat frequency max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat frequency max' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.period !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatPeriod =  req.body.occurrence.occurrenceTiming.repeat.period;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatPeriod)){
					occurrenceOccurrenceTimingRepeatPeriod = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatPeriod)){
						err_code = 2;
						err_msg = "Procedure Request occurrence occurrence timing repeat period is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat period' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.periodMax !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatPeriodMax =  req.body.occurrence.occurrenceTiming.repeat.periodMax;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatPeriodMax)){
					occurrenceOccurrenceTimingRepeatPeriodMax = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatPeriodMax)){
						err_code = 2;
						err_msg = "Procedure Request occurrence occurrence timing repeat period max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat period max' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.periodUnit !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatPeriodUnit =  req.body.occurrence.occurrenceTiming.repeat.periodUnit.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatPeriodUnit)){
					occurrenceOccurrenceTimingRepeatPeriodUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat period unit' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.dayOfWeek !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatDayOfWeek =  req.body.occurrence.occurrenceTiming.repeat.dayOfWeek.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatDayOfWeek)){
					occurrenceOccurrenceTimingRepeatDayOfWeek = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat day of week' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.timeOfDay !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatTimeOfDay =  req.body.occurrence.occurrenceTiming.repeat.timeOfDay;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatTimeOfDay)){
					occurrenceOccurrenceTimingRepeatTimeOfDay = "";
				}else{
					if(!regex.test(occurrenceOccurrenceTimingRepeatTimeOfDay)){
						err_code = 2;
						err_msg = "Procedure Request occurrence occurrence timing repeat time of day invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat time of day' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.when !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatWhen =  req.body.occurrence.occurrenceTiming.repeat.when.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatWhen)){
					occurrenceOccurrenceTimingRepeatWhen = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat when' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.repeat.offset !== 'undefined'){
				var occurrenceOccurrenceTimingRepeatOffset =  req.body.occurrence.occurrenceTiming.repeat.offset;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatOffset)){
					occurrenceOccurrenceTimingRepeatOffset = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatOffset)){
						err_code = 2;
						err_msg = "Procedure Request occurrence occurrence timing repeat offset is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing repeat offset' in json Procedure Request request.";
			}

			if(typeof req.body.occurrence.occurrenceTiming.code !== 'undefined'){
				var occurrenceOccurrenceTimingCode =  req.body.occurrence.occurrenceTiming.code.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingCode)){
					occurrenceOccurrenceTimingCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'occurrence occurrence timing code' in json Procedure Request request.";
			}

			if (typeof req.body.asNeeded.asNeededBoolean !== 'undefined') {
				var asNeededAsNeededBoolean = req.body.asNeeded.asNeededBoolean.trim().toLowerCase();
					if(validator.isEmpty(asNeededAsNeededBoolean)){
						asNeededAsNeededBoolean = "false";
					}
				if(asNeededAsNeededBoolean === "true" || asNeededAsNeededBoolean === "false"){
					asNeededAsNeededBoolean = asNeededAsNeededBoolean;
				} else {
					err_code = 2;
					err_msg = "Procedure Request as needed as needed boolean is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'as needed as needed boolean' in json Procedure Request request.";
			}

			if(typeof req.body.asNeeded.asNeededCodeableConcept !== 'undefined'){
				var asNeededAsNeededCodeableConcept =  req.body.asNeeded.asNeededCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(asNeededAsNeededCodeableConcept)){
					asNeededAsNeededCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'as needed as needed codeable concept' in json Procedure Request request.";
			}

			if(typeof req.body.authoredOn !== 'undefined'){
				var authoredOn =  req.body.authoredOn;
				if(validator.isEmpty(authoredOn)){
					authoredOn = "";
				}else{
					if(!regex.test(authoredOn)){
						err_code = 2;
						err_msg = "Procedure Request authored on invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'authored on' in json Procedure Request request.";
			}

			if(typeof req.body.requester.agent.device !== 'undefined'){
				var requesterAgentDevice =  req.body.requester.agent.device.trim().toLowerCase();
				if(validator.isEmpty(requesterAgentDevice)){
					requesterAgentDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'requester agent device' in json Procedure Request request.";
			}

			if(typeof req.body.requester.agent.practitioner !== 'undefined'){
				var requesterAgentPractitioner =  req.body.requester.agent.practitioner.trim().toLowerCase();
				if(validator.isEmpty(requesterAgentPractitioner)){
					requesterAgentPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'requester agent practitioner' in json Procedure Request request.";
			}

			if(typeof req.body.requester.agent.organization !== 'undefined'){
				var requesterAgentOrganization =  req.body.requester.agent.organization.trim().toLowerCase();
				if(validator.isEmpty(requesterAgentOrganization)){
					requesterAgentOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'requester agent organization' in json Procedure Request request.";
			}

			if(typeof req.body.requester.onBehalfOf !== 'undefined'){
				var requesterOnBehalfOf =  req.body.requester.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(requesterOnBehalfOf)){
					requesterOnBehalfOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'requester on behalf of' in json Procedure Request request.";
			}

			if(typeof req.body.performerType !== 'undefined'){
				var performerType =  req.body.performerType.trim().toLowerCase();
				if(validator.isEmpty(performerType)){
					performerType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer type' in json Procedure Request request.";
			}

			if(typeof req.body.performer.practitioner !== 'undefined'){
				var performerPractitioner =  req.body.performer.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerPractitioner)){
					performerPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer practitioner' in json Procedure Request request.";
			}

			if(typeof req.body.performer.organization !== 'undefined'){
				var performerOrganization =  req.body.performer.organization.trim().toLowerCase();
				if(validator.isEmpty(performerOrganization)){
					performerOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer organization' in json Procedure Request request.";
			}

			if(typeof req.body.performer.patient !== 'undefined'){
				var performerPatient =  req.body.performer.patient.trim().toLowerCase();
				if(validator.isEmpty(performerPatient)){
					performerPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer patient' in json Procedure Request request.";
			}

			if(typeof req.body.performer.device !== 'undefined'){
				var performerDevice =  req.body.performer.device.trim().toLowerCase();
				if(validator.isEmpty(performerDevice)){
					performerDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer device' in json Procedure Request request.";
			}

			if(typeof req.body.performer.relatedPerson !== 'undefined'){
				var performerRelatedPerson =  req.body.performer.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(performerRelatedPerson)){
					performerRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer related person' in json Procedure Request request.";
			}

			if(typeof req.body.performer.healthcareService !== 'undefined'){
				var performerHealthcareService =  req.body.performer.healthcareService.trim().toLowerCase();
				if(validator.isEmpty(performerHealthcareService)){
					performerHealthcareService = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer healthcare service' in json Procedure Request request.";
			}

			if(typeof req.body.reasonCode !== 'undefined'){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					reasonCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason code' in json Procedure Request request.";
			}

			if(typeof req.body.reasonReference.condition !== 'undefined'){
				var reasonReferenceCondition =  req.body.reasonReference.condition.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceCondition)){
					reasonReferenceCondition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference condition' in json Procedure Request request.";
			}

			if(typeof req.body.reasonReference.observation !== 'undefined'){
				var reasonReferenceObservation =  req.body.reasonReference.observation.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceObservation)){
					reasonReferenceObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference observation' in json Procedure Request request.";
			}

			if(typeof req.body.supportingInfo !== 'undefined'){
				var supportingInfo =  req.body.supportingInfo.trim().toLowerCase();
				if(validator.isEmpty(supportingInfo)){
					supportingInfo = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'supporting info' in json Procedure Request request.";
			}

			if(typeof req.body.specimen !== 'undefined'){
				var specimen =  req.body.specimen.trim().toLowerCase();
				if(validator.isEmpty(specimen)){
					specimen = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'specimen' in json Procedure Request request.";
			}

			if(typeof req.body.bodySite !== 'undefined'){
				var bodySite =  req.body.bodySite.trim().toLowerCase();
				if(validator.isEmpty(bodySite)){
					bodySite = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'body site' in json Procedure Request request.";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Procedure Request request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Procedure Request request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Procedure Request request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Procedure Request request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Procedure Request note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Procedure Request request.";
			}

			if(typeof req.body.note.string !== 'undefined'){
				var noteString =  req.body.note.string.trim().toLowerCase();
				if(validator.isEmpty(noteString)){
					noteString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note string' in json Procedure Request request.";
			}

			if(typeof req.body.relevantHistory !== 'undefined'){
				var relevantHistory =  req.body.relevantHistory.trim().toLowerCase();
				if(validator.isEmpty(relevantHistory)){
					relevantHistory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'relevant history' in json Procedure Request request.";
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
														var procedureRequestId = 'pre' + unicId;
														var timingId = 'tim' + unicId;
														var noteId = 'ant' + unicId;

														dataProcedureRequest = {
															"procedure_request_id" : procedureRequestId,						
															"based_on" : basedOn,
															"replaces" : replaces,
															"requisition" : requisition,
															"status" : status,
															"intent" : intent,
															"priority" : priority,
															"do_not_perform" : doNotPerform,
															"category" : category,
															"code" : code,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"subject_location" : subjectLocation,
															"subject_device" : subjectDevice,
															"context_encounter" : contextEncounter,
															"context_episode_of_care" : contextEpisodeOfCare,
															"occurrence_date_time" : occurrenceOccurrenceDateTime,
															"occurrence_period_start" : occurrenceOccurrencePeriodStart,
															"occurrence_period_end" : occurrenceOccurrencePeriodEnd,
															"occurrence_timing" : timingId,
															"as_needed_boolean" : asNeededAsNeededBoolean,
															"as_needed_codeable_concept" : asNeededAsNeededCodeableConcept,
															"authored_on" : authoredOn,
															"requester_agent_device" : requesterAgentDevice,
															"requester_agent_practitioner" : requesterAgentPractitioner,
															"requester_agent_organization" : requesterAgentOrganization,
															"requester_on_behalf_of" : requesterOnBehalfOf,
															"performer_type" : performerType,
															"performer_practitioner" : performerPractitioner,
															"performer_organization" : performerOrganization,
															"performer_patient" : performerPatient,
															"performer_device" : performerDevice,
															"performer_related_person" : performerRelatedPerson,
															"performer_healthcare_service" : performerHealthcareService,
															"reason_code" : reasonCode,
															"supporting_info" : supportingInfo,
															"body_site" : bodySite
														}
														console.log(dataProcedureRequest);
														ApiFHIR.post('procedureRequest', {"apikey": apikey}, {body: dataProcedureRequest, json: true}, function(error, response, body){
															procedureRequest = body;
															if(procedureRequest.err_code > 0){
																res.json(procedureRequest);	
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
																							"procedure_request_id": procedureRequestId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														dataTiming = {
															"timing_id" : timingId,
															"event" : occurrenceOccurrenceTimingEvent,
															"repeat_bounds_duration" : occurrenceOccurrenceTimingRepeatBoundsBoundsDuration,
															"repeat_bounds_range_low" : occurrenceOccurrenceTimingRepeatBoundsBoundsRangeLow,
															"repeat_bounds_range_high" : occurrenceOccurrenceTimingRepeatBoundsBoundsRangeHigh,
															"repeat_bounds_period_start" : occurrenceOccurrenceTimingRepeatBoundsBoundsPeriodStart,
															"repeat_bounds_period_end" : occurrenceOccurrenceTimingRepeatBoundsBoundsPeriodEnd,
															"count" : occurrenceOccurrenceTimingRepeatCount,
															"count_max" : occurrenceOccurrenceTimingRepeatCountMax,
															"duration" : occurrenceOccurrenceTimingRepeatDuration,
															"duration_max" : occurrenceOccurrenceTimingRepeatDurationMax,
															"duration_unit" : occurrenceOccurrenceTimingRepeatDurationUnit,
															"frequency" : occurrenceOccurrenceTimingRepeatFrequency,
															"frequency_max" : occurrenceOccurrenceTimingRepeatFrequencyMax,
															"period" : occurrenceOccurrenceTimingRepeatPeriod,
															"period_max" : occurrenceOccurrenceTimingRepeatPeriodMax,
															"period_unit" : occurrenceOccurrenceTimingRepeatPeriodUnit,
															"day_of_week" : occurrenceOccurrenceTimingRepeatDayOfWeek,
															"time_of_day" : occurrenceOccurrenceTimingRepeatTimeOfDay,
															"when" : occurrenceOccurrenceTimingRepeatWhen,
															"offset" : occurrenceOccurrenceTimingRepeatOffset,
															"code" : occurrenceOccurrenceTimingCode,
															"procedure_request_id" : procedureRequestId,						
														};
														ApiFHIR.post('timing', {"apikey": apikey}, {body: dataTiming, json: true}, function(error, response, body){
															timing = body;
															if(timing.err_code > 0){
																res.json(timing);	
																console.log("ok");
															}
														});
														//ProcedureRequestImage
														dataAnnotation = {
															"id" : noteId,
															"author_ref_practitioner" : noteAuthorAuthorReferencePractitioner,
															"author_ref_patient" : noteAuthorAuthorReferencePatient,
															"author_ref_relatedPerson" : noteAuthorAuthorReferenceRelatedPerson,
															"author_string" : noteAuthorAuthorString,
															"time" : noteTime,
															"text" : noteString,
															"procedure_request_id" : procedureRequestId
														};
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataAnnotation, json: true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
																console.log("ok");
															}
														});
														
														if(definitionActivityDefinition !== ""){
															dataDefinitionActivityDefinition = {
																"_id" : definitionActivityDefinition,
																"procedure_request_id" : procedureRequestId
															}
															ApiFHIR.put('activityDefinition', {"apikey": apikey, "_id": definitionActivityDefinition}, {body: dataDefinitionActivityDefinition, json: true}, function(error, response, body){
																returnDefinitionActivityDefinition = body;
																if(returnDefinitionActivityDefinition.err_code > 0){
																	res.json(returnDefinitionActivityDefinition);	
																	console.log("add reference definition activity definition : " + definitionActivityDefinition);
																}
															});
														}
														
														if(definitionPlanDefinition !== ""){
															dataDefinitionPlanDefinition = {
																"_id" : definitionPlanDefinition,
																"procedure_request_id" : procedureRequestId
															}
															ApiFHIR.put('planDefinition', {"apikey": apikey, "_id": definitionPlanDefinition}, {body: dataDefinitionPlanDefinition, json: true}, function(error, response, body){
																returnDefinitionPlanDefinition = body;
																if(returnDefinitionPlanDefinition.err_code > 0){
																	res.json(returnDefinitionPlanDefinition);	
																	console.log("add reference definition plan definition : " + definitionPlanDefinition);
																}
															});
														}
														
														if(reasonReferenceCondition !== ""){
															dataReasonReferenceCondition = {
																"_id" : reasonReferenceCondition,
																"procedure_request_id" : procedureRequestId
															}
															ApiFHIR.put('condition', {"apikey": apikey, "_id": reasonReferenceCondition}, {body: dataReasonReferenceCondition, json: true}, function(error, response, body){
																returnReasonReferenceCondition = body;
																if(returnReasonReferenceCondition.err_code > 0){
																	res.json(returnReasonReferenceCondition);	
																	console.log("add reference reason reference condition : " + reasonReferenceCondition);
																}
															});
														}
														
														if(reasonReferenceObservation !== ""){
															dataReasonReferenceObservation = {
																"_id" : reasonReferenceObservation,
																"procedure_request_id" : procedureRequestId
															}
															ApiFHIR.put('observation', {"apikey": apikey, "_id": reasonReferenceObservation}, {body: dataReasonReferenceObservation, json: true}, function(error, response, body){
																returnReasonReferenceObservation = body;
																if(returnReasonReferenceObservation.err_code > 0){
																	res.json(returnReasonReferenceObservation);	
																	console.log("add reference reason reference observation : " + reasonReferenceObservation);
																}
															});
														}
														
														if(specimen !== ""){
															dataSpecimen = {
																"_id" : specimen,
																"procedure_request_id" : procedureRequestId
															}
															ApiFHIR.put('specimen', {"apikey": apikey, "_id": specimen}, {body: dataSpecimen, json: true}, function(error, response, body){
																returnSpecimen = body;
																if(returnSpecimen.err_code > 0){
																	res.json(returnSpecimen);	
																	console.log("add reference specimen : " + specimen);
																}
															});
														}
														
														if(relevantHistory !== ""){
															dataRelevantHistory = {
																"_id" : relevantHistory,
																"procedure_request_id" : procedureRequestId
															}
															ApiFHIR.put('provenance', {"apikey": apikey, "_id": relevantHistory}, {body: dataRelevantHistory, json: true}, function(error, response, body){
																returnRelevantHistory = body;
																if(returnRelevantHistory.err_code > 0){
																	res.json(returnRelevantHistory);	
																	console.log("add reference relevant history : " + relevantHistory);
																}
															});
														}	
														
														res.json({"err_code": 0, "err_msg": "Procedure Request has been add.", "data": [{"_id": procedureRequestId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
status|request-status
intent|request-intent
priority|request-priority
category|procedure-category
code|procedure-code
asNeededAsNeededCodeableConcept|medication-as-needed-reason
performerType|participant-role
reasonCode|procedure-reason
bodySite|body-site
occurrenceOccurrenceTimingRepeatDurationUnit|units-of-time
occurrenceOccurrenceTimingRepeatPeriodUnit|units-of-time
occurrenceOccurrenceTimingRepeatDayOfWeek|days-of-week
occurrenceOccurrenceTimingRepeatWhen|event-timing
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'REQUEST_STATUS', function (resStatusCode) {
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

										myEmitter.prependOnceListener('checkIntent', function () {
											if (!validator.isEmpty(intent)) {
												checkCode(apikey, intent, 'REQUEST_INTENT', function (resIntentCode) {
													if (resIntentCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Intent code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})

										myEmitter.prependOnceListener('checkPriority', function () {
											if (!validator.isEmpty(priority)) {
												checkCode(apikey, priority, 'REQUEST_PRIORITY', function (resPriorityCode) {
													if (resPriorityCode.err_code > 0) {
														myEmitter.emit('checkIntent');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Priority code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIntent');
											}
										})

										myEmitter.prependOnceListener('checkCategory', function () {
											if (!validator.isEmpty(category)) {
												checkCode(apikey, category, 'PROCEDURE_CATEGORY', function (resCategoryCode) {
													if (resCategoryCode.err_code > 0) {
														myEmitter.emit('checkPriority');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPriority');
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

										myEmitter.prependOnceListener('checkAsNeededAsNeededCodeableConcept', function () {
											if (!validator.isEmpty(asNeededAsNeededCodeableConcept)) {
												checkCode(apikey, asNeededAsNeededCodeableConcept, 'MEDICATION_AS_NEEDED_REASON', function (resAsNeededAsNeededCodeableConceptCode) {
													if (resAsNeededAsNeededCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "As needed as needed codeable concept code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCode');
											}
										})

										myEmitter.prependOnceListener('checkPerformerType', function () {
											if (!validator.isEmpty(performerType)) {
												checkCode(apikey, performerType, 'PARTICIPANT_ROLE', function (resPerformerTypeCode) {
													if (resPerformerTypeCode.err_code > 0) {
														myEmitter.emit('checkAsNeededAsNeededCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAsNeededAsNeededCodeableConcept');
											}
										})

										myEmitter.prependOnceListener('checkReasonCode', function () {
											if (!validator.isEmpty(reasonCode)) {
												checkCode(apikey, reasonCode, 'PROCEDURE_REASON', function (resReasonCodeCode) {
													if (resReasonCodeCode.err_code > 0) {
														myEmitter.emit('checkPerformerType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerType');
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

										myEmitter.prependOnceListener('checkOccurrenceOccurrenceTimingRepeatDurationUnit', function () {
											if (!validator.isEmpty(occurrenceOccurrenceTimingRepeatDurationUnit)) {
												checkCode(apikey, occurrenceOccurrenceTimingRepeatDurationUnit, 'UNITS_OF_TIME', function (resOccurrenceOccurrenceTimingRepeatDurationUnitCode) {
													if (resOccurrenceOccurrenceTimingRepeatDurationUnitCode.err_code > 0) {
														myEmitter.emit('checkBodySite');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Occurrence occurrence timing repeat duration unit code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBodySite');
											}
										})

										myEmitter.prependOnceListener('checkOccurrenceOccurrenceTimingRepeatPeriodUnit', function () {
											if (!validator.isEmpty(occurrenceOccurrenceTimingRepeatPeriodUnit)) {
												checkCode(apikey, occurrenceOccurrenceTimingRepeatPeriodUnit, 'UNITS_OF_TIME', function (resOccurrenceOccurrenceTimingRepeatPeriodUnitCode) {
													if (resOccurrenceOccurrenceTimingRepeatPeriodUnitCode.err_code > 0) {
														myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatDurationUnit');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Occurrence occurrence timing repeat period unit code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatDurationUnit');
											}
										})

										myEmitter.prependOnceListener('checkOccurrenceOccurrenceTimingRepeatDayOfWeek', function () {
											if (!validator.isEmpty(occurrenceOccurrenceTimingRepeatDayOfWeek)) {
												checkCode(apikey, occurrenceOccurrenceTimingRepeatDayOfWeek, 'DAYS_OF_WEEK', function (resOccurrenceOccurrenceTimingRepeatDayOfWeekCode) {
													if (resOccurrenceOccurrenceTimingRepeatDayOfWeekCode.err_code > 0) {
														myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatPeriodUnit');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Occurrence occurrence timing repeat day of week code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatPeriodUnit');
											}
										})

										myEmitter.prependOnceListener('checkOccurrenceOccurrenceTimingRepeatWhen', function () {
											if (!validator.isEmpty(occurrenceOccurrenceTimingRepeatWhen)) {
												checkCode(apikey, occurrenceOccurrenceTimingRepeatWhen, 'EVENT_TIMING', function (resOccurrenceOccurrenceTimingRepeatWhenCode) {
													if (resOccurrenceOccurrenceTimingRepeatWhenCode.err_code > 0) {
														myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatDayOfWeek');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Occurrence occurrence timing repeat when code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatDayOfWeek');
											}
										})
										
										//cek value
										/*
										definitionActivityDefinition|Activity_Definition
definitionPlanDefinition|Plan_Definition
requisition|identifier
subjectPatient|Patient
subjectGroup|Group
subjectDevice|Device
subjectLocation|Location
contextEncounter|Encounter
contextEpisodeOfCare|Episode_Of_Care
requesterAgentDevice|Device
requesterAgentPractitioner|Practitioner
requesterAgentOrganization|Organization
requesterOnBehalfOf|Organization
performerPractitioner|Practitioner
performerOrganization|Organization
performerPatient|Patient
performerDevice|Device
performerRelatedPerson|Related_Person
performerHealthcareService|Healthcare_Service
reasonReferenceCondition|Condition
reasonReferenceObservation|Observation
specimen|specimen
relevantHistory|Provenance
noteAuthorAuthorReferencePractitioner|Practitioner
noteAuthorAuthorReferencePatient|Patient
noteAuthorAuthorReferenceRelatedPerson|Related_Person
*/
										myEmitter.prependOnceListener('checkDefinitionActivityDefinition', function () {
											if (!validator.isEmpty(definitionActivityDefinition)) {
												checkUniqeValue(apikey, "ACTIVITY_DEFINITION_ID|" + definitionActivityDefinition, 'ACTIVITY_DEFINITION', function (resDefinitionActivityDefinition) {
													if (resDefinitionActivityDefinition.err_code > 0) {
														myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatWhen');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Definition activity definition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatWhen');
											}
										})

										myEmitter.prependOnceListener('checkDefinitionPlanDefinition', function () {
											if (!validator.isEmpty(definitionPlanDefinition)) {
												checkUniqeValue(apikey, "PLAN_DEFINITION_ID|" + definitionPlanDefinition, 'PLAN_DEFINITION', function (resDefinitionPlanDefinition) {
													if (resDefinitionPlanDefinition.err_code > 0) {
														myEmitter.emit('checkDefinitionActivityDefinition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Definition plan definition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDefinitionActivityDefinition');
											}
										})
										
										myEmitter.prependOnceListener('checkRequisition', function () {
											if (!validator.isEmpty(requisition)) {
												checkUniqeValue(apikey, "IDENTIFIER_ID|" + requisition, 'IDENTIFIER', function (resRequisition) {
													if (resRequisition.err_code > 0) {
														myEmitter.emit('checkDefinitionPlanDefinition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Requisition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDefinitionPlanDefinition');
											}
										})

										myEmitter.prependOnceListener('checkSubjectPatient', function () {
											if (!validator.isEmpty(subjectPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
													if (resSubjectPatient.err_code > 0) {
														myEmitter.emit('checkRequisition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequisition');
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

										myEmitter.prependOnceListener('checkSubjectDevice', function () {
											if (!validator.isEmpty(subjectDevice)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + subjectDevice, 'DEVICE', function (resSubjectDevice) {
													if (resSubjectDevice.err_code > 0) {
														myEmitter.emit('checkSubjectGroup');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject device id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubjectGroup');
											}
										})

										myEmitter.prependOnceListener('checkSubjectLocation', function () {
											if (!validator.isEmpty(subjectLocation)) {
												checkUniqeValue(apikey, "LOCATION_ID|" + subjectLocation, 'LOCATION', function (resSubjectLocation) {
													if (resSubjectLocation.err_code > 0) {
														myEmitter.emit('checkSubjectDevice');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject location id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubjectDevice');
											}
										})

										myEmitter.prependOnceListener('checkContextEncounter', function () {
											if (!validator.isEmpty(contextEncounter)) {
												checkUniqeValue(apikey, "ENCOUNTER_ID|" + contextEncounter, 'ENCOUNTER', function (resContextEncounter) {
													if (resContextEncounter.err_code > 0) {
														myEmitter.emit('checkSubjectLocation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Context encounter id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubjectLocation');
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

										myEmitter.prependOnceListener('checkRequesterAgentDevice', function () {
											if (!validator.isEmpty(requesterAgentDevice)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + requesterAgentDevice, 'DEVICE', function (resRequesterAgentDevice) {
													if (resRequesterAgentDevice.err_code > 0) {
														myEmitter.emit('checkContextEpisodeOfCare');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Requester agent device id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEpisodeOfCare');
											}
										})

										myEmitter.prependOnceListener('checkRequesterAgentPractitioner', function () {
											if (!validator.isEmpty(requesterAgentPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + requesterAgentPractitioner, 'PRACTITIONER', function (resRequesterAgentPractitioner) {
													if (resRequesterAgentPractitioner.err_code > 0) {
														myEmitter.emit('checkRequesterAgentDevice');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Requester agent practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequesterAgentDevice');
											}
										})

										myEmitter.prependOnceListener('checkRequesterAgentOrganization', function () {
											if (!validator.isEmpty(requesterAgentOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + requesterAgentOrganization, 'ORGANIZATION', function (resRequesterAgentOrganization) {
													if (resRequesterAgentOrganization.err_code > 0) {
														myEmitter.emit('checkRequesterAgentPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Requester agent organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequesterAgentPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkRequesterOnBehalfOf', function () {
											if (!validator.isEmpty(requesterOnBehalfOf)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + requesterOnBehalfOf, 'ORGANIZATION', function (resRequesterOnBehalfOf) {
													if (resRequesterOnBehalfOf.err_code > 0) {
														myEmitter.emit('checkRequesterAgentOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Requester on behalf of id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequesterAgentOrganization');
											}
										})

										myEmitter.prependOnceListener('checkPerformerPractitioner', function () {
											if (!validator.isEmpty(performerPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + performerPractitioner, 'PRACTITIONER', function (resPerformerPractitioner) {
													if (resPerformerPractitioner.err_code > 0) {
														myEmitter.emit('checkRequesterOnBehalfOf');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequesterOnBehalfOf');
											}
										})

										myEmitter.prependOnceListener('checkPerformerOrganization', function () {
											if (!validator.isEmpty(performerOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerOrganization, 'ORGANIZATION', function (resPerformerOrganization) {
													if (resPerformerOrganization.err_code > 0) {
														myEmitter.emit('checkPerformerPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkPerformerPatient', function () {
											if (!validator.isEmpty(performerPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + performerPatient, 'PATIENT', function (resPerformerPatient) {
													if (resPerformerPatient.err_code > 0) {
														myEmitter.emit('checkPerformerOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerOrganization');
											}
										})

										myEmitter.prependOnceListener('checkPerformerDevice', function () {
											if (!validator.isEmpty(performerDevice)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + performerDevice, 'DEVICE', function (resPerformerDevice) {
													if (resPerformerDevice.err_code > 0) {
														myEmitter.emit('checkPerformerPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer device id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerPatient');
											}
										})

										myEmitter.prependOnceListener('checkPerformerRelatedPerson', function () {
											if (!validator.isEmpty(performerRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + performerRelatedPerson, 'RELATED_PERSON', function (resPerformerRelatedPerson) {
													if (resPerformerRelatedPerson.err_code > 0) {
														myEmitter.emit('checkPerformerDevice');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerDevice');
											}
										})

										myEmitter.prependOnceListener('checkPerformerHealthcareService', function () {
											if (!validator.isEmpty(performerHealthcareService)) {
												checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + performerHealthcareService, 'HEALTHCARE_SERVICE', function (resPerformerHealthcareService) {
													if (resPerformerHealthcareService.err_code > 0) {
														myEmitter.emit('checkPerformerRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer healthcare service id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkReasonReferenceCondition', function () {
											if (!validator.isEmpty(reasonReferenceCondition)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + reasonReferenceCondition, 'CONDITION', function (resReasonReferenceCondition) {
													if (resReasonReferenceCondition.err_code > 0) {
														myEmitter.emit('checkPerformerHealthcareService');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason reference condition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerHealthcareService');
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

										myEmitter.prependOnceListener('checkSpecimen', function () {
											if (!validator.isEmpty(specimen)) {
												checkUniqeValue(apikey, "SPECIMEN_ID|" + specimen, 'SPECIMEN', function (resSpecimen) {
													if (resSpecimen.err_code > 0) {
														myEmitter.emit('checkReasonReferenceObservation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Specimen id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonReferenceObservation');
											}
										})

										myEmitter.prependOnceListener('checkRelevantHistory', function () {
											if (!validator.isEmpty(relevantHistory)) {
												checkUniqeValue(apikey, "PROVENANCE_ID|" + relevantHistory, 'PROVENANCE', function (resRelevantHistory) {
													if (resRelevantHistory.err_code > 0) {
														myEmitter.emit('checkSpecimen');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Relevant history id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSpecimen');
											}
										})

										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
											if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
													if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
														myEmitter.emit('checkRelevantHistory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author author reference practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRelevantHistory');
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
			var procedureRequestId = req.params.procedure_request_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof procedureRequestId !== 'undefined'){
				if(validator.isEmpty(procedureRequestId)){
					err_code = 2;
					err_msg = "Procedure Request id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure Request id is required";
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
												checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + procedureRequestId, 'PROCEDURE_REQUEST', function(resProcedureRequestID){
													if(resProcedureRequestID.err_code > 0){
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
																							"procedure_request_id": procedureRequestId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Procedure Request.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Procedure Request Id not found"});		
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
		procedureRequestNote: function addProcedureRequestNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var procedureRequestId = req.params.procedureRequest_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof procedureRequestId !== 'undefined'){
				if(validator.isEmpty(procedureRequestId)){
					err_code = 2;
					err_msg = "ProcedureRequest id is required";
				}
			}else{
				err_code = 2;
				err_msg = "ProcedureRequest id is required";
			}
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Procedure Request request.";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Procedure Request request.";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Procedure Request request.";
			}

			if(typeof req.body.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Procedure Request request.";
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
				err_msg = "Please add sub-key 'note time' in json Procedure Request request.";
			}

			if(typeof req.body.string !== 'undefined'){
				var noteString =  req.body.string.trim().toLowerCase();
				if(validator.isEmpty(noteString)){
					noteString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note string' in json Procedure Request request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkProcedureRequestID', function(){
							checkUniqeValue(apikey, "procedureRequest_id|" + procedureRequestId, 'procedure_Request', function(resProcedureRequestID){
								if(resProcedureRequestID.err_code > 0){
									var unicId = uniqid.time();
									var procedureRequestNoteId = 'afm' + unicId;
									//ProcedureRequestNote
									dataProcedureRequestNote = {
										"id": procedureRequestNoteId,
										"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
										"author_ref_patient": noteAuthorAuthorReferencePatient,
										"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
										"author_string": noteAuthorAuthorString,
										"time": noteTime,
										"text": noteString,
										"procedureRequest_id" : procedureRequestId
									}
									ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataProcedureRequestNote, json: true}, function(error, response, body){
										procedureRequestNote = body;
										if(procedureRequestNote.err_code == 0){
											res.json({"err_code": 0, "err_msg": "ProcedureRequest Note has been add in this ProcedureRequest.", "data": procedureRequestNote.data});
										}else{
											res.json(procedureRequestNote);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "ProcedureRequest Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkProcedureRequestID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkProcedureRequestID');
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
		procedureRequest : function putProcedureRequest(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var procedureRequestId = req.params.procedure_request_id;

      var err_code = 0;
      var err_msg = "";
      var dataProcedureRequest = {};

			if(typeof procedureRequestId !== 'undefined'){
				if(validator.isEmpty(procedureRequestId)){
					err_code = 2;
					err_msg = "Procedure Request id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure Request id is required";
			}

			/*
			var based_on  = req.body.based_on;
			var replaces  = req.body.replaces;
			var requisition  = req.body.requisition;
			var status  = req.body.status;
			var intent  = req.body.intent;
			var priority  = req.body.priority;
			var do_not_perform  = req.body.do_not_perform;
			var category  = req.body.category;
			var code  = req.body.code;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var subject_location  = req.body.subject_location;
			var subject_device  = req.body.subject_device;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var occurrence_date_time  = req.body.occurrence_date_time;
			var occurrence_period_start  = req.body.occurrence_period_start;
			var occurrence_period_end  = req.body.occurrence_period_end;
			var occurrence_timing  = req.body.occurrence_timing;
			var as_needed_boolean  = req.body.as_needed_boolean;
			var as_needed_codeable_concept  = req.body.as_needed_codeable_concept;
			var authored_on  = req.body.authored_on;
			var requester_agent_device  = req.body.requester_agent_device;
			var requester_agent_practitioner  = req.body.requester_agent_practitioner;
			var requester_agent_organization  = req.body.requester_agent_organization;
			var requester_on_behalf_of  = req.body.requester_on_behalf_of;
			var performer_type  = req.body.performer_type;
			var performer_practitioner  = req.body.performer_practitioner;
			var performer_organization  = req.body.performer_organization;
			var performer_patient  = req.body.performer_patient;
			var performer_device  = req.body.performer_device;
			var performer_related_person  = req.body.performer_related_person;
			var performer_healthcare_service  = req.body.performer_healthcare_service;
			var reason_code  = req.body.reason_code;
			var supporting_info  = req.body.supporting_info;
			var body_site  = req.body.body_site;
			*/
			
			/*if(typeof req.body.definition.activityDefinition !== 'undefined' && req.body.definition.activityDefinition !== ""){
				var definitionActivityDefinition =  req.body.definition.activityDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionActivityDefinition)){
					dataProcedureRequest.activity_definition = "";
				}else{
					dataProcedureRequest.activity_definition = definitionActivityDefinition;
				}
			}else{
			  definitionActivityDefinition = "";
			}

			if(typeof req.body.definition.planDefinition !== 'undefined' && req.body.definition.planDefinition !== ""){
				var definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					dataProcedureRequest.plan_definition = "";
				}else{
					dataProcedureRequest.plan_definition = definitionPlanDefinition;
				}
			}else{
			  definitionPlanDefinition = "";
			}*/

			if(typeof req.body.basedOn !== 'undefined' && req.body.basedOn !== ""){
				var basedOn =  req.body.basedOn.trim().toLowerCase();
				if(validator.isEmpty(basedOn)){
					dataProcedureRequest.based_on = "";
				}else{
					dataProcedureRequest.based_on = basedOn;
				}
			}else{
			  basedOn = "";
			}

			if(typeof req.body.replaces !== 'undefined' && req.body.replaces !== ""){
				var replaces =  req.body.replaces.trim().toLowerCase();
				if(validator.isEmpty(replaces)){
					dataProcedureRequest.replaces = "";
				}else{
					dataProcedureRequest.replaces = replaces;
				}
			}else{
			  replaces = "";
			}

			if(typeof req.body.requisition !== 'undefined' && req.body.requisition !== ""){
				var requisition =  req.body.requisition.trim().toLowerCase();
				if(validator.isEmpty(requisition)){
					dataProcedureRequest.requisition = "";
				}else{
					dataProcedureRequest.requisition = requisition;
				}
			}else{
			  requisition = "";
			}

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "procedure request status is required.";
				}else{
					dataProcedureRequest.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.intent !== 'undefined' && req.body.intent !== ""){
				var intent =  req.body.intent.trim().toLowerCase();
				if(validator.isEmpty(intent)){
					err_code = 2;
					err_msg = "procedure request intent is required.";
				}else{
					dataProcedureRequest.intent = intent;
				}
			}else{
			  intent = "";
			}

			if(typeof req.body.priority !== 'undefined' && req.body.priority !== ""){
				var priority =  req.body.priority.trim().toLowerCase();
				if(validator.isEmpty(priority)){
					dataProcedureRequest.priority = "";
				}else{
					dataProcedureRequest.priority = priority;
				}
			}else{
			  priority = "";
			}

			if (typeof req.body.doNotPerform !== 'undefined' && req.body.doNotPerform !== "") {
			  var doNotPerform = req.body.doNotPerform.trim().toLowerCase();
					if(validator.isEmpty(doNotPerform)){
						doNotPerform = "false";
					}
			  if(doNotPerform === "true" || doNotPerform === "false"){
					dataProcedureRequest.do_not_perform = doNotPerform;
			  } else {
			    err_code = 2;
			    err_msg = "Procedure request do not perform is must be boolean.";
			  }
			} else {
			  doNotPerform = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					dataProcedureRequest.category = "";
				}else{
					dataProcedureRequest.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					err_code = 2;
					err_msg = "procedure request code is required.";
				}else{
					dataProcedureRequest.code = code;
				}
			}else{
			  code = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataProcedureRequest.subject_patient = "";
				}else{
					dataProcedureRequest.subject_patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataProcedureRequest.subject_group = "";
				}else{
					dataProcedureRequest.subject_group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.subject.device !== 'undefined' && req.body.subject.device !== ""){
				var subjectDevice =  req.body.subject.device.trim().toLowerCase();
				if(validator.isEmpty(subjectDevice)){
					dataProcedureRequest.subject_device = "";
				}else{
					dataProcedureRequest.subject_device = subjectDevice;
				}
			}else{
			  subjectDevice = "";
			}

			if(typeof req.body.subject.location !== 'undefined' && req.body.subject.location !== ""){
				var subjectLocation =  req.body.subject.location.trim().toLowerCase();
				if(validator.isEmpty(subjectLocation)){
					dataProcedureRequest.subject_location = "";
				}else{
					dataProcedureRequest.subject_location = subjectLocation;
				}
			}else{
			  subjectLocation = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					dataProcedureRequest.context_encounter = "";
				}else{
					dataProcedureRequest.context_encounter = contextEncounter;
				}
			}else{
			  contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					dataProcedureRequest.context_episode_of_care = "";
				}else{
					dataProcedureRequest.context_episode_of_care = contextEpisodeOfCare;
				}
			}else{
			  contextEpisodeOfCare = "";
			}

			if(typeof req.body.occurrence.occurrenceDateTime !== 'undefined' && req.body.occurrence.occurrenceDateTime !== ""){
				var occurrenceOccurrenceDateTime =  req.body.occurrence.occurrenceDateTime;
				if(validator.isEmpty(occurrenceOccurrenceDateTime)){
					err_code = 2;
					err_msg = "procedure request occurrence occurrence date time is required.";
				}else{
					if(!regex.test(occurrenceOccurrenceDateTime)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence date time invalid date format.";	
					}else{
						dataProcedureRequest.occurrence_date_time = occurrenceOccurrenceDateTime;
					}
				}
			}else{
			  occurrenceOccurrenceDateTime = "";
			}

			if (typeof req.body.occurrence.occurrencePeriod !== 'undefined' && req.body.occurrence.occurrencePeriod !== "") {
			  var occurrenceOccurrencePeriod = req.body.occurrence.occurrencePeriod;
			  if (occurrenceOccurrencePeriod.indexOf("to") > 0) {
			    arrOccurrenceOccurrencePeriod = occurrenceOccurrencePeriod.split("to");
			    dataProcedureRequest.occurrence_period_start = arrOccurrenceOccurrencePeriod[0];
			    dataProcedureRequest.occurrence_period_end = arrOccurrenceOccurrencePeriod[1];
			    if (!regex.test(occurrenceOccurrencePeriodStart) && !regex.test(occurrenceOccurrencePeriodEnd)) {
			      err_code = 2;
			      err_msg = "procedure request occurrence occurrence period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "procedure request occurrence occurrence period invalid date format.";
				}
			} else {
			  occurrenceOccurrencePeriod = "";
			}

			if (typeof req.body.asNeeded.asNeededBoolean !== 'undefined' && req.body.asNeeded.asNeededBoolean !== "") {
			  var asNeededAsNeededBoolean = req.body.asNeeded.asNeededBoolean.trim().toLowerCase();
					if(validator.isEmpty(asNeededAsNeededBoolean)){
						asNeededAsNeededBoolean = "false";
					}
			  if(asNeededAsNeededBoolean === "true" || asNeededAsNeededBoolean === "false"){
					dataProcedureRequest.as_needed_boolean = asNeededAsNeededBoolean;
			  } else {
			    err_code = 2;
			    err_msg = "Procedure request as needed as needed boolean is must be boolean.";
			  }
			} else {
			  asNeededAsNeededBoolean = "";
			}

			if(typeof req.body.asNeeded.asNeededCodeableConcept !== 'undefined' && req.body.asNeeded.asNeededCodeableConcept !== ""){
				var asNeededAsNeededCodeableConcept =  req.body.asNeeded.asNeededCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(asNeededAsNeededCodeableConcept)){
					dataProcedureRequest.as_needed_codeable_concept = "";
				}else{
					dataProcedureRequest.as_needed_codeable_concept = asNeededAsNeededCodeableConcept;
				}
			}else{
			  asNeededAsNeededCodeableConcept = "";
			}

			if(typeof req.body.authoredOn !== 'undefined' && req.body.authoredOn !== ""){
				var authoredOn =  req.body.authoredOn;
				if(validator.isEmpty(authoredOn)){
					err_code = 2;
					err_msg = "procedure request authored on is required.";
				}else{
					if(!regex.test(authoredOn)){
						err_code = 2;
						err_msg = "procedure request authored on invalid date format.";	
					}else{
						dataProcedureRequest.authored_on = authoredOn;
					}
				}
			}else{
			  authoredOn = "";
			}

			if(typeof req.body.requester.agent.device !== 'undefined' && req.body.requester.agent.device !== ""){
				var requesterAgentDevice =  req.body.requester.agent.device.trim().toLowerCase();
				if(validator.isEmpty(requesterAgentDevice)){
					dataProcedureRequest.agent_device = "";
				}else{
					dataProcedureRequest.agent_device = requesterAgentDevice;
				}
			}else{
			  requesterAgentDevice = "";
			}

			if(typeof req.body.requester.agent.practitioner !== 'undefined' && req.body.requester.agent.practitioner !== ""){
				var requesterAgentPractitioner =  req.body.requester.agent.practitioner.trim().toLowerCase();
				if(validator.isEmpty(requesterAgentPractitioner)){
					dataProcedureRequest.agent_practitioner = "";
				}else{
					dataProcedureRequest.agent_practitioner = requesterAgentPractitioner;
				}
			}else{
			  requesterAgentPractitioner = "";
			}

			if(typeof req.body.requester.agent.organization !== 'undefined' && req.body.requester.agent.organization !== ""){
				var requesterAgentOrganization =  req.body.requester.agent.organization.trim().toLowerCase();
				if(validator.isEmpty(requesterAgentOrganization)){
					dataProcedureRequest.agent_organization = "";
				}else{
					dataProcedureRequest.agent_organization = requesterAgentOrganization;
				}
			}else{
			  requesterAgentOrganization = "";
			}

			if(typeof req.body.requester.onBehalfOf !== 'undefined' && req.body.requester.onBehalfOf !== ""){
				var requesterOnBehalfOf =  req.body.requester.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(requesterOnBehalfOf)){
					dataProcedureRequest.on_behalf_of = "";
				}else{
					dataProcedureRequest.on_behalf_of = requesterOnBehalfOf;
				}
			}else{
			  requesterOnBehalfOf = "";
			}

			if(typeof req.body.performerType !== 'undefined' && req.body.performerType !== ""){
				var performerType =  req.body.performerType.trim().toLowerCase();
				if(validator.isEmpty(performerType)){
					dataProcedureRequest.performer_type = "";
				}else{
					dataProcedureRequest.performer_type = performerType;
				}
			}else{
			  performerType = "";
			}

			if(typeof req.body.performer.practitioner !== 'undefined' && req.body.performer.practitioner !== ""){
				var performerPractitioner =  req.body.performer.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerPractitioner)){
					dataProcedureRequest.performer_practitioner = "";
				}else{
					dataProcedureRequest.performer_practitioner = performerPractitioner;
				}
			}else{
			  performerPractitioner = "";
			}

			if(typeof req.body.performer.organization !== 'undefined' && req.body.performer.organization !== ""){
				var performerOrganization =  req.body.performer.organization.trim().toLowerCase();
				if(validator.isEmpty(performerOrganization)){
					dataProcedureRequest.performer_organization = "";
				}else{
					dataProcedureRequest.performer_organization = performerOrganization;
				}
			}else{
			  performerOrganization = "";
			}

			if(typeof req.body.performer.patient !== 'undefined' && req.body.performer.patient !== ""){
				var performerPatient =  req.body.performer.patient.trim().toLowerCase();
				if(validator.isEmpty(performerPatient)){
					dataProcedureRequest.performer_patient = "";
				}else{
					dataProcedureRequest.performer_patient = performerPatient;
				}
			}else{
			  performerPatient = "";
			}

			if(typeof req.body.performer.device !== 'undefined' && req.body.performer.device !== ""){
				var performerDevice =  req.body.performer.device.trim().toLowerCase();
				if(validator.isEmpty(performerDevice)){
					dataProcedureRequest.performer_device = "";
				}else{
					dataProcedureRequest.performer_device = performerDevice;
				}
			}else{
			  performerDevice = "";
			}

			if(typeof req.body.performer.relatedPerson !== 'undefined' && req.body.performer.relatedPerson !== ""){
				var performerRelatedPerson =  req.body.performer.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(performerRelatedPerson)){
					dataProcedureRequest.performer_related_person = "";
				}else{
					dataProcedureRequest.performer_related_person = performerRelatedPerson;
				}
			}else{
			  performerRelatedPerson = "";
			}

			if(typeof req.body.performer.healthcareService !== 'undefined' && req.body.performer.healthcareService !== ""){
				var performerHealthcareService =  req.body.performer.healthcareService.trim().toLowerCase();
				if(validator.isEmpty(performerHealthcareService)){
					dataProcedureRequest.performer_healthcare_service = "";
				}else{
					dataProcedureRequest.performer_healthcare_service = performerHealthcareService;
				}
			}else{
			  performerHealthcareService = "";
			}

			if(typeof req.body.reasonCode !== 'undefined' && req.body.reasonCode !== ""){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					dataProcedureRequest.reason_code = "";
				}else{
					dataProcedureRequest.reason_code = reasonCode;
				}
			}else{
			  reasonCode = "";
			}
/*
			if(typeof req.body.reasonReference.condition !== 'undefined' && req.body.reasonReference.condition !== ""){
				var reasonReferenceCondition =  req.body.reasonReference.condition.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceCondition)){
					dataProcedureRequest.condition = "";
				}else{
					dataProcedureRequest.condition = reasonReferenceCondition;
				}
			}else{
			  reasonReferenceCondition = "";
			}

			if(typeof req.body.reasonReference.observation !== 'undefined' && req.body.reasonReference.observation !== ""){
				var reasonReferenceObservation =  req.body.reasonReference.observation.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceObservation)){
					dataProcedureRequest.observation = "";
				}else{
					dataProcedureRequest.observation = reasonReferenceObservation;
				}
			}else{
			  reasonReferenceObservation = "";
			}*/

			if(typeof req.body.supportingInfo !== 'undefined' && req.body.supportingInfo !== ""){
				var supportingInfo =  req.body.supportingInfo.trim().toLowerCase();
				if(validator.isEmpty(supportingInfo)){
					dataProcedureRequest.supporting_info = "";
				}else{
					dataProcedureRequest.supporting_info = supportingInfo;
				}
			}else{
			  supportingInfo = "";
			}

			if(typeof req.body.specimen !== 'undefined' && req.body.specimen !== ""){
				var specimen =  req.body.specimen.trim().toLowerCase();
				if(validator.isEmpty(specimen)){
					dataProcedureRequest.specimen = "";
				}else{
					dataProcedureRequest.specimen = specimen;
				}
			}else{
			  specimen = "";
			}

			if(typeof req.body.bodySite !== 'undefined' && req.body.bodySite !== ""){
				var bodySite =  req.body.bodySite.trim().toLowerCase();
				if(validator.isEmpty(bodySite)){
					dataProcedureRequest.body_site = "";
				}else{
					dataProcedureRequest.body_site = bodySite;
				}
			}else{
			  bodySite = "";
			}

			/*if(typeof req.body.relevantHistory !== 'undefined' && req.body.relevantHistory !== ""){
				var relevantHistory =  req.body.relevantHistory.trim().toLowerCase();
				if(validator.isEmpty(relevantHistory)){
					dataProcedureRequest.relevant_history = "";
				}else{
					dataProcedureRequest.relevant_history = relevantHistory;
				}
			}else{
			  relevantHistory = "";
			}*/

			
			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkProcedureRequestId', function(){
						checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + procedureRequestId, 'PROCEDURE_REQUEST', function(resProcedureRequestId){
							if(resProcedureRequestId.err_code > 0){
								ApiFHIR.put('procedureRequest', {"apikey": apikey, "_id": procedureRequestId}, {body: dataProcedureRequest, json: true}, function(error, response, body){
									procedureRequest = body;
									if(procedureRequest.err_code > 0){
										res.json(procedureRequest);	
									}else{
										res.json({"err_code": 0, "err_msg": "Procedure Request has been update.", "data": [{"_id": procedureRequestId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Procedure Request Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkStatus', function () {
						if (!validator.isEmpty(status)) {
							checkCode(apikey, status, 'REQUEST_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) {
									myEmitter.emit('checkProcedureRequestId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkProcedureRequestId');
						}
					})

					myEmitter.prependOnceListener('checkIntent', function () {
						if (!validator.isEmpty(intent)) {
							checkCode(apikey, intent, 'REQUEST_INTENT', function (resIntentCode) {
								if (resIntentCode.err_code > 0) {
									myEmitter.emit('checkStatus');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Intent code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkStatus');
						}
					})

					myEmitter.prependOnceListener('checkPriority', function () {
						if (!validator.isEmpty(priority)) {
							checkCode(apikey, priority, 'REQUEST_PRIORITY', function (resPriorityCode) {
								if (resPriorityCode.err_code > 0) {
									myEmitter.emit('checkIntent');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Priority code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkIntent');
						}
					})

					myEmitter.prependOnceListener('checkCategory', function () {
						if (!validator.isEmpty(category)) {
							checkCode(apikey, category, 'PROCEDURE_CATEGORY', function (resCategoryCode) {
								if (resCategoryCode.err_code > 0) {
									myEmitter.emit('checkPriority');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Category code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPriority');
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

					myEmitter.prependOnceListener('checkAsNeededAsNeededCodeableConcept', function () {
						if (!validator.isEmpty(asNeededAsNeededCodeableConcept)) {
							checkCode(apikey, asNeededAsNeededCodeableConcept, 'MEDICATION_AS_NEEDED_REASON', function (resAsNeededAsNeededCodeableConceptCode) {
								if (resAsNeededAsNeededCodeableConceptCode.err_code > 0) {
									myEmitter.emit('checkCode');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "As needed as needed codeable concept code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCode');
						}
					})

					myEmitter.prependOnceListener('checkPerformerType', function () {
						if (!validator.isEmpty(performerType)) {
							checkCode(apikey, performerType, 'PARTICIPANT_ROLE', function (resPerformerTypeCode) {
								if (resPerformerTypeCode.err_code > 0) {
									myEmitter.emit('checkAsNeededAsNeededCodeableConcept');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Performer type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkAsNeededAsNeededCodeableConcept');
						}
					})

					myEmitter.prependOnceListener('checkReasonCode', function () {
						if (!validator.isEmpty(reasonCode)) {
							checkCode(apikey, reasonCode, 'PROCEDURE_REASON', function (resReasonCodeCode) {
								if (resReasonCodeCode.err_code > 0) {
									myEmitter.emit('checkPerformerType');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Reason code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPerformerType');
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

					myEmitter.prependOnceListener('checkSubjectPatient', function () {
						if (!validator.isEmpty(subjectPatient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
								if (resSubjectPatient.err_code > 0) {
									myEmitter.emit('checkBodySite');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkBodySite');
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

					myEmitter.prependOnceListener('checkSubjectDevice', function () {
						if (!validator.isEmpty(subjectDevice)) {
							checkUniqeValue(apikey, "DEVICE_ID|" + subjectDevice, 'DEVICE', function (resSubjectDevice) {
								if (resSubjectDevice.err_code > 0) {
									myEmitter.emit('checkSubjectGroup');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject device id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSubjectGroup');
						}
					})

					myEmitter.prependOnceListener('checkSubjectLocation', function () {
						if (!validator.isEmpty(subjectLocation)) {
							checkUniqeValue(apikey, "LOCATION_ID|" + subjectLocation, 'LOCATION', function (resSubjectLocation) {
								if (resSubjectLocation.err_code > 0) {
									myEmitter.emit('checkSubjectDevice');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject location id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSubjectDevice');
						}
					})

					myEmitter.prependOnceListener('checkContextEncounter', function () {
						if (!validator.isEmpty(contextEncounter)) {
							checkUniqeValue(apikey, "ENCOUNTER_ID|" + contextEncounter, 'ENCOUNTER', function (resContextEncounter) {
								if (resContextEncounter.err_code > 0) {
									myEmitter.emit('checkSubjectLocation');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Context encounter id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSubjectLocation');
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

					myEmitter.prependOnceListener('checkRequesterAgentDevice', function () {
						if (!validator.isEmpty(requesterAgentDevice)) {
							checkUniqeValue(apikey, "DEVICE_ID|" + requesterAgentDevice, 'DEVICE', function (resRequesterAgentDevice) {
								if (resRequesterAgentDevice.err_code > 0) {
									myEmitter.emit('checkContextEpisodeOfCare');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Requester agent device id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkContextEpisodeOfCare');
						}
					})

					myEmitter.prependOnceListener('checkRequesterAgentPractitioner', function () {
						if (!validator.isEmpty(requesterAgentPractitioner)) {
							checkUniqeValue(apikey, "PRACTITIONER_ID|" + requesterAgentPractitioner, 'PRACTITIONER', function (resRequesterAgentPractitioner) {
								if (resRequesterAgentPractitioner.err_code > 0) {
									myEmitter.emit('checkRequesterAgentDevice');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Requester agent practitioner id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRequesterAgentDevice');
						}
					})

					myEmitter.prependOnceListener('checkRequesterAgentOrganization', function () {
						if (!validator.isEmpty(requesterAgentOrganization)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + requesterAgentOrganization, 'ORGANIZATION', function (resRequesterAgentOrganization) {
								if (resRequesterAgentOrganization.err_code > 0) {
									myEmitter.emit('checkRequesterAgentPractitioner');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Requester agent organization id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRequesterAgentPractitioner');
						}
					})

					myEmitter.prependOnceListener('checkRequesterOnBehalfOf', function () {
						if (!validator.isEmpty(requesterOnBehalfOf)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + requesterOnBehalfOf, 'ORGANIZATION', function (resRequesterOnBehalfOf) {
								if (resRequesterOnBehalfOf.err_code > 0) {
									myEmitter.emit('checkRequesterAgentOrganization');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Requester on behalf of id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRequesterAgentOrganization');
						}
					})

					myEmitter.prependOnceListener('checkPerformerPractitioner', function () {
						if (!validator.isEmpty(performerPractitioner)) {
							checkUniqeValue(apikey, "PRACTITIONER_ID|" + performerPractitioner, 'PRACTITIONER', function (resPerformerPractitioner) {
								if (resPerformerPractitioner.err_code > 0) {
									myEmitter.emit('checkRequesterOnBehalfOf');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Performer practitioner id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRequesterOnBehalfOf');
						}
					})

					myEmitter.prependOnceListener('checkPerformerOrganization', function () {
						if (!validator.isEmpty(performerOrganization)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerOrganization, 'ORGANIZATION', function (resPerformerOrganization) {
								if (resPerformerOrganization.err_code > 0) {
									myEmitter.emit('checkPerformerPractitioner');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Performer organization id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPerformerPractitioner');
						}
					})

					myEmitter.prependOnceListener('checkPerformerPatient', function () {
						if (!validator.isEmpty(performerPatient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + performerPatient, 'PATIENT', function (resPerformerPatient) {
								if (resPerformerPatient.err_code > 0) {
									myEmitter.emit('checkPerformerOrganization');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Performer patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPerformerOrganization');
						}
					})

					myEmitter.prependOnceListener('checkPerformerDevice', function () {
						if (!validator.isEmpty(performerDevice)) {
							checkUniqeValue(apikey, "DEVICE_ID|" + performerDevice, 'DEVICE', function (resPerformerDevice) {
								if (resPerformerDevice.err_code > 0) {
									myEmitter.emit('checkPerformerPatient');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Performer device id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPerformerPatient');
						}
					})

					myEmitter.prependOnceListener('checkPerformerRelatedPerson', function () {
						if (!validator.isEmpty(performerRelatedPerson)) {
							checkUniqeValue(apikey, "RELATED_PERSON_ID|" + performerRelatedPerson, 'RELATED_PERSON', function (resPerformerRelatedPerson) {
								if (resPerformerRelatedPerson.err_code > 0) {
									myEmitter.emit('checkPerformerDevice');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Performer related person id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPerformerDevice');
						}
					})

					myEmitter.prependOnceListener('checkPerformerHealthcareService', function () {
						if (!validator.isEmpty(performerHealthcareService)) {
							checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + performerHealthcareService, 'HEALTHCARE_SERVICE', function (resPerformerHealthcareService) {
								if (resPerformerHealthcareService.err_code > 0) {
									myEmitter.emit('checkPerformerRelatedPerson');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Performer healthcare service id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPerformerRelatedPerson');
						}
					})

					if (!validator.isEmpty(specimen)) {
						checkUniqeValue(apikey, "SPECIMEN_ID|" + specimen, 'SPECIMEN', function (resSpecimen) {
							if (resSpecimen.err_code > 0) {
								myEmitter.emit('checkPerformerHealthcareService');
							} else {
								res.json({
									"err_code": "500",
									"err_msg": "Specimen id not found"
								});
							}
						})
					} else {
						myEmitter.emit('checkPerformerHealthcareService');
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
			var procedureRequestId = req.params.procedure_request_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof procedureRequestId !== 'undefined'){
				if(validator.isEmpty(procedureRequestId)){
					err_code = 2;
					err_msg = "Procedure Request id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure Request id is required";
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
						myEmitter.prependOnceListener('checkProcedureRequestID', function(){
							checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + procedureRequestId, 'PROCEDURE_REQUEST', function(resProcedureRequestID){
								if(resProcedureRequestID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "PROCEDURE_REQUEST_ID|"+procedureRequestId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Procedure Request.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Procedure Request Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkProcedureRequestID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkProcedureRequestID');				
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
		procedureRequestTiming: function updateProcedureRequestTiming(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var procedureRequestId = req.params.procedure_request_id;
			var procedureRequestTimingId = req.params.procedure_request_timing_id;

			var err_code = 0;
			var err_msg = "";
			var dataProcedureRequest = {};
			//input check 
			if(typeof procedureRequestId !== 'undefined'){
				if(validator.isEmpty(procedureRequestId)){
					err_code = 2;
					err_msg = "Procedure Request id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure Request id is required";
			}

			if(typeof procedureRequestTimingId !== 'undefined'){
				if(validator.isEmpty(procedureRequestTimingId)){
					err_code = 2;
					err_msg = "Procedure Request Timing id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure Request Timing id is required";
			}
			
			if(typeof req.body.event !== 'undefined' && req.body.event !== ""){
				var occurrenceOccurrenceTimingEvent =  req.body.event;
				if(validator.isEmpty(occurrenceOccurrenceTimingEvent)){
					err_code = 2;
					err_msg = "procedure request occurrence occurrence timing event is required.";
				}else{
					if(!regex.test(occurrenceOccurrenceTimingEvent)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing event invalid date format.";	
					}else{
						dataProcedureRequest.event = occurrenceOccurrenceTimingEvent;
					}
				}
			}else{
			  occurrenceOccurrenceTimingEvent = "";
			}

			if(typeof req.body.repeat.bounds.boundsDuration !== 'undefined' && req.body.repeat.bounds.boundsDuration !== ""){
				var occurrenceOccurrenceTimingRepeatBoundsBoundsDuration =  req.body.repeat.bounds.boundsDuration.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatBoundsBoundsDuration)){
					dataProcedureRequest.bounds_duration = "";
				}else{
					dataProcedureRequest.bounds_duration = occurrenceOccurrenceTimingRepeatBoundsBoundsDuration;
				}
			}else{
			  occurrenceOccurrenceTimingRepeatBoundsBoundsDuration = "";
			}

			if (typeof req.body.repeat.bounds.boundsRange !== 'undefined' && req.body.repeat.bounds.boundsRange !== "") {
			  var occurrenceOccurrenceTimingRepeatBoundsBoundsRange = req.body.repeat.bounds.boundsRange;
			  if (occurrenceOccurrenceTimingRepeatBoundsBoundsRange.indexOf("to") > 0) {
			    arrOccurrenceOccurrenceTimingRepeatBoundsBoundsRange = occurrenceOccurrenceTimingRepeatBoundsBoundsRange.split("to");
			    dataProcedureRequest.bounds_range_low = arrOccurrenceOccurrenceTimingRepeatBoundsBoundsRange[0];
			    dataProcedureRequest.bounds_range_high = arrOccurrenceOccurrenceTimingRepeatBoundsBoundsRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "procedure request occurrence occurrence timing repeat bounds bounds range invalid range format.";
				}
			} else {
			  occurrenceOccurrenceTimingRepeatBoundsBoundsRange = "";
			}

			if (typeof req.body.repeat.bounds.boundsPeriod !== 'undefined' && req.body.repeat.bounds.boundsPeriod !== "") {
			  var occurrenceOccurrenceTimingRepeatBoundsBoundsPeriod = req.body.repeat.bounds.boundsPeriod;
			  if (occurrenceOccurrenceTimingRepeatBoundsBoundsPeriod.indexOf("to") > 0) {
			    arrOccurrenceOccurrenceTimingRepeatBoundsBoundsPeriod = occurrenceOccurrenceTimingRepeatBoundsBoundsPeriod.split("to");
			    dataProcedureRequest.bounds_period_start = arrOccurrenceOccurrenceTimingRepeatBoundsBoundsPeriod[0];
			    dataProcedureRequest.bounds_period_end = arrOccurrenceOccurrenceTimingRepeatBoundsBoundsPeriod[1];
			    if (!regex.test(occurrenceOccurrenceTimingRepeatBoundsBoundsPeriodStart) && !regex.test(occurrenceOccurrenceTimingRepeatBoundsBoundsPeriodEnd)) {
			      err_code = 2;
			      err_msg = "procedure request occurrence occurrence timing repeat bounds bounds period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "procedure request occurrence occurrence timing repeat bounds bounds period invalid date format.";
				}
			} else {
			  occurrenceOccurrenceTimingRepeatBoundsBoundsPeriod = "";
			}

			if(typeof req.body.repeat.count !== 'undefined' && req.body.repeat.count !== ""){
				var occurrenceOccurrenceTimingRepeatCount =  req.body.repeat.count;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatCount)){
					dataProcedureRequest.count = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatCount)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat count is must be number.";
					}else{
						dataProcedureRequest.count = occurrenceOccurrenceTimingRepeatCount;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatCount = "";
			}

			if(typeof req.body.repeat.countMax !== 'undefined' && req.body.repeat.countMax !== ""){
				var occurrenceOccurrenceTimingRepeatCountMax =  req.body.repeat.countMax;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatCountMax)){
					dataProcedureRequest.count_max = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatCountMax)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat count max is must be number.";
					}else{
						dataProcedureRequest.count_max = occurrenceOccurrenceTimingRepeatCountMax;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatCountMax = "";
			}

			if(typeof req.body.repeat.duration !== 'undefined' && req.body.repeat.duration !== ""){
				var occurrenceOccurrenceTimingRepeatDuration =  req.body.repeat.duration;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatDuration)){
					dataProcedureRequest.duration = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatDuration)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat duration is must be number.";
					}else{
						dataProcedureRequest.duration = occurrenceOccurrenceTimingRepeatDuration;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatDuration = "";
			}

			if(typeof req.body.repeat.durationMax !== 'undefined' && req.body.repeat.durationMax !== ""){
				var occurrenceOccurrenceTimingRepeatDurationMax =  req.body.repeat.durationMax;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatDurationMax)){
					dataProcedureRequest.duration_max = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatDurationMax)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat duration max is must be number.";
					}else{
						dataProcedureRequest.duration_max = occurrenceOccurrenceTimingRepeatDurationMax;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatDurationMax = "";
			}

			if(typeof req.body.repeat.durationUnit !== 'undefined' && req.body.repeat.durationUnit !== ""){
				var occurrenceOccurrenceTimingRepeatDurationUnit =  req.body.repeat.durationUnit.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatDurationUnit)){
					dataProcedureRequest.duration_unit = "";
				}else{
					dataProcedureRequest.duration_unit = occurrenceOccurrenceTimingRepeatDurationUnit;
				}
			}else{
			  occurrenceOccurrenceTimingRepeatDurationUnit = "";
			}

			if(typeof req.body.repeat.frequency !== 'undefined' && req.body.repeat.frequency !== ""){
				var occurrenceOccurrenceTimingRepeatFrequency =  req.body.repeat.frequency;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatFrequency)){
					dataProcedureRequest.frequency = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatFrequency)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat frequency is must be number.";
					}else{
						dataProcedureRequest.frequency = occurrenceOccurrenceTimingRepeatFrequency;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatFrequency = "";
			}

			if(typeof req.body.repeat.frequencyMax !== 'undefined' && req.body.repeat.frequencyMax !== ""){
				var occurrenceOccurrenceTimingRepeatFrequencyMax =  req.body.repeat.frequencyMax;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatFrequencyMax)){
					dataProcedureRequest.frequency_max = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatFrequencyMax)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat frequency max is must be number.";
					}else{
						dataProcedureRequest.frequency_max = occurrenceOccurrenceTimingRepeatFrequencyMax;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatFrequencyMax = "";
			}

			if(typeof req.body.repeat.period !== 'undefined' && req.body.repeat.period !== ""){
				var occurrenceOccurrenceTimingRepeatPeriod =  req.body.repeat.period;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatPeriod)){
					dataProcedureRequest.period = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatPeriod)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat period is must be number.";
					}else{
						dataProcedureRequest.period = occurrenceOccurrenceTimingRepeatPeriod;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatPeriod = "";
			}

			if(typeof req.body.repeat.periodMax !== 'undefined' && req.body.repeat.periodMax !== ""){
				var occurrenceOccurrenceTimingRepeatPeriodMax =  req.body.repeat.periodMax;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatPeriodMax)){
					dataProcedureRequest.period_max = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatPeriodMax)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat period max is must be number.";
					}else{
						dataProcedureRequest.period_max = occurrenceOccurrenceTimingRepeatPeriodMax;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatPeriodMax = "";
			}

			if(typeof req.body.repeat.periodUnit !== 'undefined' && req.body.repeat.periodUnit !== ""){
				var occurrenceOccurrenceTimingRepeatPeriodUnit =  req.body.repeat.periodUnit.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatPeriodUnit)){
					dataProcedureRequest.period_unit = "";
				}else{
					dataProcedureRequest.period_unit = occurrenceOccurrenceTimingRepeatPeriodUnit;
				}
			}else{
			  occurrenceOccurrenceTimingRepeatPeriodUnit = "";
			}

			if(typeof req.body.repeat.dayOfWeek !== 'undefined' && req.body.repeat.dayOfWeek !== ""){
				var occurrenceOccurrenceTimingRepeatDayOfWeek =  req.body.repeat.dayOfWeek.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatDayOfWeek)){
					dataProcedureRequest.day_of_week = "";
				}else{
					dataProcedureRequest.day_of_week = occurrenceOccurrenceTimingRepeatDayOfWeek;
				}
			}else{
			  occurrenceOccurrenceTimingRepeatDayOfWeek = "";
			}

			if(typeof req.body.repeat.timeOfDay !== 'undefined' && req.body.repeat.timeOfDay !== ""){
				var occurrenceOccurrenceTimingRepeatTimeOfDay =  req.body.repeat.timeOfDay;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatTimeOfDay)){
					err_code = 2;
					err_msg = "procedure request occurrence occurrence timing repeat time of day is required.";
				}else{
					if(!regex.test(occurrenceOccurrenceTimingRepeatTimeOfDay)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat time of day invalid date format.";	
					}else{
						dataProcedureRequest.time_of_day = occurrenceOccurrenceTimingRepeatTimeOfDay;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatTimeOfDay = "";
			}

			if(typeof req.body.repeat.when !== 'undefined' && req.body.repeat.when !== ""){
				var occurrenceOccurrenceTimingRepeatWhen =  req.body.repeat.when.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatWhen)){
					dataProcedureRequest.when = "";
				}else{
					dataProcedureRequest.when = occurrenceOccurrenceTimingRepeatWhen;
				}
			}else{
			  occurrenceOccurrenceTimingRepeatWhen = "";
			}

			if(typeof req.body.repeat.offset !== 'undefined' && req.body.repeat.offset !== ""){
				var occurrenceOccurrenceTimingRepeatOffset =  req.body.repeat.offset;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatOffset)){
					dataProcedureRequest.offset = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatOffset)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat offset is must be number.";
					}else{
						dataProcedureRequest.offset = occurrenceOccurrenceTimingRepeatOffset;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatOffset = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var occurrenceOccurrenceTimingCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingCode)){
					dataProcedureRequest.code = "";
				}else{
					dataProcedureRequest.code = occurrenceOccurrenceTimingCode;
				}
			}else{
			  occurrenceOccurrenceTimingCode = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkProcedureRequestID', function(){
							checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + procedureRequestId, 'PROCEDURE_REQUEST', function(resObservationId){
								if(resObservationId.err_code > 0){
									checkUniqeValue(apikey, "TIMING_ID|" + procedureRequestTimingId, 'TIMING', function(resProcedureRequestTimingID){
										if(resProcedureRequestTimingID.err_code > 0){
											ApiFHIR.put('timing', {"apikey": apikey, "_id": procedureRequestTimingId, "dr": "PROCEDURE_REQUEST_ID|"+procedureRequestId}, {body: dataProcedureRequest, json: true}, function(error, response, body){
												procedureRequestTiming = body;
												if(procedureRequestTiming.err_code > 0){
													res.json(procedureRequestTiming);	
												}else{
													res.json({"err_code": 0, "err_msg": "Procedure Request Timing has been update in this Procedure Request.", "data": procedureRequestTiming.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Procedure Request Timing Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Procedure Request Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkOccurrenceOccurrenceTimingRepeatDurationUnit', function () {
							if (!validator.isEmpty(occurrenceOccurrenceTimingRepeatDurationUnit)) {
								checkCode(apikey, occurrenceOccurrenceTimingRepeatDurationUnit, 'UNITS_OF_TIME', function (resOccurrenceOccurrenceTimingRepeatDurationUnitCode) {
									if (resOccurrenceOccurrenceTimingRepeatDurationUnitCode.err_code > 0) {
										myEmitter.emit('checkProcedureRequestID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Occurrence occurrence timing repeat duration unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkProcedureRequestID');
							}
						})

						myEmitter.prependOnceListener('checkOccurrenceOccurrenceTimingRepeatPeriodUnit', function () {
							if (!validator.isEmpty(occurrenceOccurrenceTimingRepeatPeriodUnit)) {
								checkCode(apikey, occurrenceOccurrenceTimingRepeatPeriodUnit, 'UNITS_OF_TIME', function (resOccurrenceOccurrenceTimingRepeatPeriodUnitCode) {
									if (resOccurrenceOccurrenceTimingRepeatPeriodUnitCode.err_code > 0) {
										myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatDurationUnit');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Occurrence occurrence timing repeat period unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatDurationUnit');
							}
						})

						myEmitter.prependOnceListener('checkOccurrenceOccurrenceTimingRepeatDayOfWeek', function () {
							if (!validator.isEmpty(occurrenceOccurrenceTimingRepeatDayOfWeek)) {
								checkCode(apikey, occurrenceOccurrenceTimingRepeatDayOfWeek, 'DAYS_OF_WEEK', function (resOccurrenceOccurrenceTimingRepeatDayOfWeekCode) {
									if (resOccurrenceOccurrenceTimingRepeatDayOfWeekCode.err_code > 0) {
										myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatPeriodUnit');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Occurrence occurrence timing repeat day of week code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatPeriodUnit');
							}
						})

						if (!validator.isEmpty(occurrenceOccurrenceTimingRepeatWhen)) {
							checkCode(apikey, occurrenceOccurrenceTimingRepeatWhen, 'EVENT_TIMING', function (resOccurrenceOccurrenceTimingRepeatWhenCode) {
								if (resOccurrenceOccurrenceTimingRepeatWhenCode.err_code > 0) {
									myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatDayOfWeek');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Occurrence occurrence timing repeat when code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatDayOfWeek');
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
		procedureRequestAnnotation: function updateProcedureRequestAnnotation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var procedureRequestId = req.params.procedure_request_id;
			var procedureRequestAnnotationId = req.params.procedure_request_annotation_id;

			var err_code = 0;
			var err_msg = "";
			var dataProcedureRequest = {};
			//input check 
			if(typeof procedureRequestId !== 'undefined'){
				if(validator.isEmpty(procedureRequestId)){
					err_code = 2;
					err_msg = "Procedure Request id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure Request id is required";
			}

			if(typeof procedureRequestAnnotationId !== 'undefined'){
				if(validator.isEmpty(procedureRequestAnnotationId)){
					err_code = 2;
					err_msg = "Procedure Request Annotation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Procedure Request Annotation id is required";
			}
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined' && req.body.author.authorReference.practitioner !== ""){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					dataProcedureRequest.author_ref_practitioner = "";
				}else{
					dataProcedureRequest.author_ref_practitioner = noteAuthorAuthorReferencePractitioner;
				}
			}else{
			  noteAuthorAuthorReferencePractitioner = "";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined' && req.body.author.authorReference.patient !== ""){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					dataProcedureRequest.author_ref_patient = "";
				}else{
					dataProcedureRequest.author_ref_patient = noteAuthorAuthorReferencePatient;
				}
			}else{
			  noteAuthorAuthorReferencePatient = "";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined' && req.body.author.authorReference.relatedPerson !== ""){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					dataProcedureRequest.author_ref_relatedPerson = "";
				}else{
					dataProcedureRequest.author_ref_relatedPerson = noteAuthorAuthorReferenceRelatedPerson;
				}
			}else{
			  noteAuthorAuthorReferenceRelatedPerson = "";
			}

			if(typeof req.body.author.authorString !== 'undefined' && req.body.author.authorString !== ""){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					dataProcedureRequest.author_string = "";
				}else{
					dataProcedureRequest.author_string = noteAuthorAuthorString;
				}
			}else{
			  noteAuthorAuthorString = "";
			}

			if(typeof req.body.time !== 'undefined' && req.body.time !== ""){
				var noteTime =  req.body.time;
				if(validator.isEmpty(noteTime)){
					err_code = 2;
					err_msg = "procedure request note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "procedure request note time invalid date format.";	
					}else{
						dataProcedureRequest.time = noteTime;
					}
				}
			}else{
			  noteTime = "";
			}

			if(typeof req.body.string !== 'undefined' && req.body.string !== ""){
				var noteString =  req.body.string.trim().toLowerCase();
				if(validator.isEmpty(noteString)){
					dataProcedureRequest.string = "";
				}else{
					dataProcedureRequest.string = noteString;
				}
			}else{
			  noteString = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkProcedureRequestID', function(){
							checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + procedureRequestId, 'PROCEDURE_REQUEST', function(resObservationId){
								if(resObservationId.err_code > 0){
									checkUniqeValue(apikey, "NOTE_ID|" + procedureRequestAnnotationId, 'NOTE', function(resProcedureRequestAnnotationID){
										if(resProcedureRequestAnnotationID.err_code > 0){
											ApiFHIR.put('annotation', {"apikey": apikey, "_id": procedureRequestAnnotationId, "dr": "PROCEDURE_REQUEST_ID|"+procedureRequestId}, {body: dataProcedureRequest, json: true}, function(error, response, body){
												procedureRequestAnnotation = body;
												if(procedureRequestAnnotation.err_code > 0){
													res.json(procedureRequestAnnotation);	
												}else{
													res.json({"err_code": 0, "err_msg": "Procedure Request Annotation has been update in this Procedure Request.", "data": procedureRequestAnnotation.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Procedure Request Annotation Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Procedure Request Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkProcedureRequestID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkProcedureRequestID');
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