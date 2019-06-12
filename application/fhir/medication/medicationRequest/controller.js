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
		medicationRequest : function getMedicationRequest(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var medicationRequestId = req.query._id;
			var authoredon = req.query.authoredon;
			var category = req.query.category;
			var code = req.query.code;
			var context = req.query.context;
			var date = req.query.date;
			var identifier = req.query.identifier;
			var intendedDispenser = req.query.intendedDispenser;
			var intent = req.query.intent;
			var medication = req.query.medication;
			var patient = req.query.patient;
			var priority = req.query.priority;
			var requester = req.query.requester;
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
			

			if(typeof medicationRequestId !== 'undefined'){
				if(!validator.isEmpty(medicationRequestId)){
					qString.medicationRequestId = medicationRequestId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Care Team Id is required."});
				}
			}
			
			if(typeof authoredon !== 'undefined'){
				if(!validator.isEmpty(authoredon)){
					qString.authoredon = authoredon; 
				}else{
					res.json({"err_code": 1, "err_msg": "authoredon is empty."});
				}
			}

			if(typeof category !== 'undefined'){
				if(!validator.isEmpty(category)){
					qString.category = category; 
				}else{
					res.json({"err_code": 1, "err_msg": "category is empty."});
				}
			}

			if(typeof code !== 'undefined'){
				if(!validator.isEmpty(code)){
					qString.code = code; 
				}else{
					res.json({"err_code": 1, "err_msg": "code is empty."});
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

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "identifier is empty."});
				}
			}

			if(typeof intendedDispenser !== 'undefined'){
				if(!validator.isEmpty(intendedDispenser)){
					qString.intendedDispenser = intendedDispenser; 
				}else{
					res.json({"err_code": 1, "err_msg": "intended dispenser is empty."});
				}
			}

			if(typeof intent !== 'undefined'){
				if(!validator.isEmpty(intent)){
					qString.intent = intent; 
				}else{
					res.json({"err_code": 1, "err_msg": "intent is empty."});
				}
			}

			if(typeof medication !== 'undefined'){
				if(!validator.isEmpty(medication)){
					qString.medication = medication; 
				}else{
					res.json({"err_code": 1, "err_msg": "medication is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "patient is empty."});
				}
			}

			if(typeof priority !== 'undefined'){
				if(!validator.isEmpty(priority)){
					qString.priority = priority; 
				}else{
					res.json({"err_code": 1, "err_msg": "priority is empty."});
				}
			}

			if(typeof requester !== 'undefined'){
				if(!validator.isEmpty(requester)){
					qString.requester = requester; 
				}else{
					res.json({"err_code": 1, "err_msg": "requester is empty."});
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
				"MedicationRequest" : {
					"location": "%(apikey)s/MedicationRequest",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('MedicationRequest', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var medicationRequest = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(medicationRequest.err_code == 0){
								//cek jumdata dulu
								if(medicationRequest.data.length > 0){
									newMedicationRequest = [];
									for(i=0; i < medicationRequest.data.length; i++){
										myEmitter.once("getIdentifier", function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
											/*console.log(medicationRequest);*/
											//get identifier
											qString = {};
											qString.medication_request_id = medicationRequest.id;
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
													var objectMedicationRequest = {};
													objectMedicationRequest.resourceType = medicationRequest.resourceType;
													objectMedicationRequest.id = medicationRequest.id;
													objectMedicationRequest.identifier = identifier.data;	
													objectMedicationRequest.basedOn = medicationRequest.basedOn;
													objectMedicationRequest.groupIdentifier = medicationRequest.groupIdentifier;
													objectMedicationRequest.status = medicationRequest.status;
													objectMedicationRequest.intent = medicationRequest.intent;
													objectMedicationRequest.category = medicationRequest.category;
													objectMedicationRequest.priority = medicationRequest.priority;
													objectMedicationRequest.medication = medicationRequest.medication;
													objectMedicationRequest.subject = medicationRequest.subject;
													objectMedicationRequest.context = medicationRequest.context;
													objectMedicationRequest.supportingInformation = medicationRequest.supportingInformation;
													objectMedicationRequest.authoredOn = medicationRequest.authoredOn;
													objectMedicationRequest.recorder = medicationRequest.recorder;
													objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
													objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
													objectMedicationRequest.requester = medicationRequest.requester;
													objectMedicationRequest.substitution = medicationRequest.substitution;
													objectMedicationRequest.dispenseRequest = medicationRequest.dispenseRequest;

													newMedicationRequest[index] = objectMedicationRequest;

													/*if(index == countMedicationRequest -1 ){
														res.json({"err_code": 0, "data":newMedicationRequest});				
													}	*/
													
													myEmitter.once("getMedicationRequestDefinitionPlanDefinition", function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
														qString = {};
														qString.medication_request_id = medicationRequest.id;
														seedPhoenixFHIR.path.GET = {
															"MedicationRequestDefinitionPlanDefinition" : {
																"location": "%(apikey)s/MedicationRequestDefinitionPlanDefinition",
																"query": qString
															}
														}
														var ApiFHIR = new Apiclient(seedPhoenixFHIR);
														ApiFHIR.get('MedicationRequestDefinitionPlanDefinition', {"apikey": apikey}, {}, function(error, response, body){
															medicationRequestDefinitionPlanDefinition = JSON.parse(body);
															if(medicationRequestDefinitionPlanDefinition.err_code == 0){
																var objectMedicationRequest = {};
																objectMedicationRequest.resourceType = medicationRequest.resourceType;
																objectMedicationRequest.id = medicationRequest.id;
																objectMedicationRequest.identifier = medicationRequest.identifier;	
																var Definition = {};
																Definition.planDefinition = medicationRequestDefinitionPlanDefinition.data;
																objectMedicationRequest.definition = Definition;
																objectMedicationRequest.basedOn = medicationRequest.basedOn;
																objectMedicationRequest.groupIdentifier = medicationRequest.groupIdentifier;
																objectMedicationRequest.status = medicationRequest.status;
																objectMedicationRequest.intent = medicationRequest.intent;
																objectMedicationRequest.category = medicationRequest.category;
																objectMedicationRequest.priority = medicationRequest.priority;
																objectMedicationRequest.medication = medicationRequest.medication;
																objectMedicationRequest.subject = medicationRequest.subject;
																objectMedicationRequest.context = medicationRequest.context;
																objectMedicationRequest.supportingInformation = medicationRequest.supportingInformation;
																objectMedicationRequest.authoredOn = medicationRequest.authoredOn;
																objectMedicationRequest.recorder = medicationRequest.recorder;
																objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
																objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
																objectMedicationRequest.requester = medicationRequest.requester;
																objectMedicationRequest.substitution = medicationRequest.substitution;
																objectMedicationRequest.dispenseRequest = medicationRequest.dispenseRequest;

																newMedicationRequest[index] = objectMedicationRequest;

																myEmitter.once("getMedicationRequestDefinitionActivityDefinition", function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
																	qString = {};
																	qString.medication_request_id = medicationRequest.id;
																	seedPhoenixFHIR.path.GET = {
																		"MedicationRequestDefinitionActivityDefinition" : {
																			"location": "%(apikey)s/MedicationRequestDefinitionActivityDefinition",
																			"query": qString
																		}
																	}
																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																	ApiFHIR.get('MedicationRequestDefinitionActivityDefinition', {"apikey": apikey}, {}, function(error, response, body){
																		medicationRequestDefinitionActivityDefinition = JSON.parse(body);
																		if(medicationRequestDefinitionActivityDefinition.err_code == 0){
																			var objectMedicationRequest = {};
																			objectMedicationRequest.resourceType = medicationRequest.resourceType;
																			objectMedicationRequest.id = medicationRequest.id;
																			objectMedicationRequest.identifier = medicationRequest.identifier;	
																			var Definition = {};
																			Definition.planDefinition = medicationRequest.definition.planDefinition;
																			Definition.activityDefinition = medicationRequestDefinitionActivityDefinition.data;
																			objectMedicationRequest.definition = Definition;
																			objectMedicationRequest.basedOn = medicationRequest.basedOn;
																			objectMedicationRequest.groupIdentifier = medicationRequest.groupIdentifier;
																			objectMedicationRequest.status = medicationRequest.status;
																			objectMedicationRequest.intent = medicationRequest.intent;
																			objectMedicationRequest.category = medicationRequest.category;
																			objectMedicationRequest.priority = medicationRequest.priority;
																			objectMedicationRequest.medication = medicationRequest.medication;
																			objectMedicationRequest.subject = medicationRequest.subject;
																			objectMedicationRequest.context = medicationRequest.context;
																			objectMedicationRequest.supportingInformation = medicationRequest.supportingInformation;
																			objectMedicationRequest.authoredOn = medicationRequest.authoredOn;
																			objectMedicationRequest.recorder = medicationRequest.recorder;
																			objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
																			objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
																			objectMedicationRequest.requester = medicationRequest.requester;
																			objectMedicationRequest.substitution = medicationRequest.substitution;
																			objectMedicationRequest.dispenseRequest = medicationRequest.dispenseRequest;

																			newMedicationRequest[index] = objectMedicationRequest;

																			myEmitter.once("getMedicationRequestBasedOnCarePlan", function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
																				qString = {};
																				qString.medication_request_id = medicationRequest.id;
																				seedPhoenixFHIR.path.GET = {
																					"MedicationRequestBasedOnCarePlan" : {
																						"location": "%(apikey)s/MedicationRequestBasedOnCarePlan",
																						"query": qString
																					}
																				}
																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																				ApiFHIR.get('MedicationRequestBasedOnCarePlan', {"apikey": apikey}, {}, function(error, response, body){
																					medicationRequestBasedOnCarePlan = JSON.parse(body);
																					if(medicationRequestBasedOnCarePlan.err_code == 0){
																						var objectMedicationRequest = {};
																						objectMedicationRequest.resourceType = medicationRequest.resourceType;
																						objectMedicationRequest.id = medicationRequest.id;
																						objectMedicationRequest.identifier = medicationRequest.identifier;
																						objectMedicationRequest.definition = medicationRequest.definition;
																						var BasedOn = {};
																						BasedOn.carePlan = medicationRequestBasedOnCarePlan.data;
																						objectMedicationRequest.basedOn = BasedOn;
																						objectMedicationRequest.groupIdentifier = medicationRequest.groupIdentifier;
																						objectMedicationRequest.status = medicationRequest.status;
																						objectMedicationRequest.intent = medicationRequest.intent;
																						objectMedicationRequest.category = medicationRequest.category;
																						objectMedicationRequest.priority = medicationRequest.priority;
																						objectMedicationRequest.medication = medicationRequest.medication;
																						objectMedicationRequest.subject = medicationRequest.subject;
																						objectMedicationRequest.context = medicationRequest.context;
																						objectMedicationRequest.supportingInformation = medicationRequest.supportingInformation;
																						objectMedicationRequest.authoredOn = medicationRequest.authoredOn;
																						objectMedicationRequest.recorder = medicationRequest.recorder;
																						objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
																						objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
																						objectMedicationRequest.requester = medicationRequest.requester;
																						objectMedicationRequest.substitution = medicationRequest.substitution;
																						objectMedicationRequest.dispenseRequest = medicationRequest.dispenseRequest;

																						newMedicationRequest[index] = objectMedicationRequest;

																						myEmitter.once("getMedicationRequestBasedOnProcedureRequest", function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
																							qString = {};
																							qString.medication_request_id = medicationRequest.id;
																							seedPhoenixFHIR.path.GET = {
																								"MedicationRequestBasedOnProcedureRequest" : {
																									"location": "%(apikey)s/MedicationRequestBasedOnProcedureRequest",
																									"query": qString
																								}
																							}
																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																							ApiFHIR.get('MedicationRequestBasedOnProcedureRequest', {"apikey": apikey}, {}, function(error, response, body){
																								medicationRequestBasedOnProcedureRequest = JSON.parse(body);
																								if(medicationRequestBasedOnProcedureRequest.err_code == 0){
																									var objectMedicationRequest = {};
																									objectMedicationRequest.resourceType = medicationRequest.resourceType;
																									objectMedicationRequest.id = medicationRequest.id;
																									objectMedicationRequest.identifier = medicationRequest.identifier;
																									objectMedicationRequest.definition = medicationRequest.definition;
																									var BasedOn = {};
																									BasedOn.carePlan = medicationRequest.basedOn.carePlan;
																									BasedOn.procedureRequest = medicationRequestBasedOnProcedureRequest.data;
																									objectMedicationRequest.basedOn = BasedOn;
																									objectMedicationRequest.groupIdentifier = medicationRequest.groupIdentifier;
																									objectMedicationRequest.status = medicationRequest.status;
																									objectMedicationRequest.intent = medicationRequest.intent;
																									objectMedicationRequest.category = medicationRequest.category;
																									objectMedicationRequest.priority = medicationRequest.priority;
																									objectMedicationRequest.medication = medicationRequest.medication;
																									objectMedicationRequest.subject = medicationRequest.subject;
																									objectMedicationRequest.context = medicationRequest.context;
																									objectMedicationRequest.supportingInformation = medicationRequest.supportingInformation;
																									objectMedicationRequest.authoredOn = medicationRequest.authoredOn;
																									objectMedicationRequest.recorder = medicationRequest.recorder;
																									objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
																									objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
																									objectMedicationRequest.requester = medicationRequest.requester;
																									objectMedicationRequest.substitution = medicationRequest.substitution;
																									objectMedicationRequest.dispenseRequest = medicationRequest.dispenseRequest;

																									newMedicationRequest[index] = objectMedicationRequest;

																									myEmitter.once("getMedicationRequestBasedOnReferralRequest", function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
																										qString = {};
																										qString.medication_request_id = medicationRequest.id;
																										seedPhoenixFHIR.path.GET = {
																											"MedicationRequestBasedOnReferralRequest" : {
																												"location": "%(apikey)s/MedicationRequestBasedOnReferralRequest",
																												"query": qString
																											}
																										}
																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																										ApiFHIR.get('MedicationRequestBasedOnReferralRequest', {"apikey": apikey}, {}, function(error, response, body){
																											medicationRequestBasedOnReferralRequest = JSON.parse(body);
																											if(medicationRequestBasedOnReferralRequest.err_code == 0){
																												var objectMedicationRequest = {};
																												objectMedicationRequest.resourceType = medicationRequest.resourceType;
																												objectMedicationRequest.id = medicationRequest.id;
																												objectMedicationRequest.identifier = medicationRequest.identifier;
																												objectMedicationRequest.definition = medicationRequest.definition;
																												var BasedOn = {};
																												BasedOn.carePlan = medicationRequest.basedOn.carePlan;
																												BasedOn.procedureRequest = medicationRequest.basedOn.procedureRequest;
																												BasedOn.referralRequest = medicationRequestBasedOnReferralRequest.data;
																												objectMedicationRequest.basedOn = BasedOn;
																												objectMedicationRequest.groupIdentifier = medicationRequest.groupIdentifier;
																												objectMedicationRequest.status = medicationRequest.status;
																												objectMedicationRequest.intent = medicationRequest.intent;
																												objectMedicationRequest.category = medicationRequest.category;
																												objectMedicationRequest.priority = medicationRequest.priority;
																												objectMedicationRequest.medication = medicationRequest.medication;
																												objectMedicationRequest.subject = medicationRequest.subject;
																												objectMedicationRequest.context = medicationRequest.context;
																												objectMedicationRequest.supportingInformation = medicationRequest.supportingInformation;
																												objectMedicationRequest.authoredOn = medicationRequest.authoredOn;
																												objectMedicationRequest.recorder = medicationRequest.recorder;
																												objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
																												objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
																												objectMedicationRequest.requester = medicationRequest.requester;
																												objectMedicationRequest.substitution = medicationRequest.substitution;
																												objectMedicationRequest.dispenseRequest = medicationRequest.dispenseRequest;

																												newMedicationRequest[index] = objectMedicationRequest;

																												myEmitter.once("getMedicationRequestBasedOnMedicationRequest", function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
																													qString = {};
																													qString.medication_request_id = medicationRequest.id;
																													seedPhoenixFHIR.path.GET = {
																														"MedicationRequestBasedOnMedicationRequest" : {
																															"location": "%(apikey)s/MedicationRequestBasedOnMedicationRequest",
																															"query": qString
																														}
																													}
																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																													ApiFHIR.get('MedicationRequestBasedOnMedicationRequest', {"apikey": apikey}, {}, function(error, response, body){
																														medicationRequestBasedOnMedicationRequest = JSON.parse(body);
																														if(medicationRequestBasedOnMedicationRequest.err_code == 0){
																															var objectMedicationRequest = {};
																															objectMedicationRequest.resourceType = medicationRequest.resourceType;
																															objectMedicationRequest.id = medicationRequest.id;
																															objectMedicationRequest.identifier = medicationRequest.identifier;
																															objectMedicationRequest.definition = medicationRequest.definition;
																															var BasedOn = {};
																															BasedOn.carePlan = medicationRequest.basedOn.carePlan;
																															BasedOn.procedureRequest = medicationRequest.basedOn.procedureRequest;
																															BasedOn.referralRequest = medicationRequest.basedOn.referralRequest;
																															BasedOn.medicationRequest = medicationRequestBasedOnMedicationRequest.data;
																															objectMedicationRequest.basedOn = BasedOn;
																															objectMedicationRequest.groupIdentifier = medicationRequest.groupIdentifier;
																															objectMedicationRequest.status = medicationRequest.status;
																															objectMedicationRequest.intent = medicationRequest.intent;
																															objectMedicationRequest.category = medicationRequest.category;
																															objectMedicationRequest.priority = medicationRequest.priority;
																															objectMedicationRequest.medication = medicationRequest.medication;
																															objectMedicationRequest.subject = medicationRequest.subject;
																															objectMedicationRequest.context = medicationRequest.context;
																															objectMedicationRequest.supportingInformation = medicationRequest.supportingInformation;
																															objectMedicationRequest.authoredOn = medicationRequest.authoredOn;
																															objectMedicationRequest.recorder = medicationRequest.recorder;
																															objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
																															objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
																															objectMedicationRequest.requester = medicationRequest.requester;
																															objectMedicationRequest.substitution = medicationRequest.substitution;
																															objectMedicationRequest.dispenseRequest = medicationRequest.dispenseRequest;

																															newMedicationRequest[index] = objectMedicationRequest;
																															
																															
myEmitter.once("getMedicationRequestReasonReferenceCondition", function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
	qString = {};
	qString.medication_request_id = medicationRequest.id;
	seedPhoenixFHIR.path.GET = {
		"MedicationRequestReasonReferenceCondition" : {
			"location": "%(apikey)s/MedicationRequestReasonReferenceCondition",
			"query": qString
		}
	}
	var ApiFHIR = new Apiclient(seedPhoenixFHIR);
	ApiFHIR.get('MedicationRequestReasonReferenceCondition', {"apikey": apikey}, {}, function(error, response, body){
		medicationRequestReasonReferenceCondition = JSON.parse(body);
		if(medicationRequestReasonReferenceCondition.err_code == 0){
			var objectMedicationRequest = {};
			objectMedicationRequest.resourceType = medicationRequest.resourceType;
			objectMedicationRequest.id = medicationRequest.id;
			objectMedicationRequest.identifier = medicationRequest.identifier;
			objectMedicationRequest.definition = medicationRequest.definition;
			objectMedicationRequest.basedOn = medicationRequest.basedOn;
			objectMedicationRequest.groupIdentifier = medicationRequest.groupIdentifier;
			objectMedicationRequest.status = medicationRequest.status;
			objectMedicationRequest.intent = medicationRequest.intent;
			objectMedicationRequest.category = medicationRequest.category;
			objectMedicationRequest.priority = medicationRequest.priority;
			objectMedicationRequest.medication = medicationRequest.medication;
			objectMedicationRequest.subject = medicationRequest.subject;
			objectMedicationRequest.context = medicationRequest.context;
			objectMedicationRequest.supportingInformation = medicationRequest.supportingInformation;
			objectMedicationRequest.authoredOn = medicationRequest.authoredOn;
			objectMedicationRequest.recorder = medicationRequest.recorder;
			objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
			var ReasonReference = {};
			ReasonReference.condition = medicationRequestReasonReferenceCondition.data;
			objectMedicationRequest.reasonReference = ReasonReference;
			objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
			objectMedicationRequest.requester = medicationRequest.requester;
			objectMedicationRequest.substitution = medicationRequest.substitution;
			objectMedicationRequest.dispenseRequest = medicationRequest.dispenseRequest;

			newMedicationRequest[index] = objectMedicationRequest;

			myEmitter.once("getMedicationRequestReasonReferenceObservation", function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
				qString = {};
				qString.medication_request_id = medicationRequest.id;
				seedPhoenixFHIR.path.GET = {
					"MedicationRequestReasonReferenceObservation" : {
						"location": "%(apikey)s/MedicationRequestReasonReferenceObservation",
						"query": qString
					}
				}
				var ApiFHIR = new Apiclient(seedPhoenixFHIR);
				ApiFHIR.get('MedicationRequestReasonReferenceObservation', {"apikey": apikey}, {}, function(error, response, body){
					medicationRequestReasonReferenceObservation = JSON.parse(body);
					if(medicationRequestReasonReferenceObservation.err_code == 0){
						var objectMedicationRequest = {};
						objectMedicationRequest.resourceType = medicationRequest.resourceType;
						objectMedicationRequest.id = medicationRequest.id;
						objectMedicationRequest.identifier = medicationRequest.identifier;
						objectMedicationRequest.definition = medicationRequest.definition;
						objectMedicationRequest.basedOn = medicationRequest.basedOn;
						objectMedicationRequest.groupIdentifier = medicationRequest.groupIdentifier;
						objectMedicationRequest.status = medicationRequest.status;
						objectMedicationRequest.intent = medicationRequest.intent;
						objectMedicationRequest.category = medicationRequest.category;
						objectMedicationRequest.priority = medicationRequest.priority;
						objectMedicationRequest.medication = medicationRequest.medication;
						objectMedicationRequest.subject = medicationRequest.subject;
						objectMedicationRequest.context = medicationRequest.context;
						objectMedicationRequest.supportingInformation = medicationRequest.supportingInformation;
						objectMedicationRequest.authoredOn = medicationRequest.authoredOn;
						objectMedicationRequest.recorder = medicationRequest.recorder;
						objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
						var ReasonReference = {};
						ReasonReference.condition = medicationRequest.reasonReference.condition;
						ReasonReference.observation = medicationRequestReasonReferenceObservation.data;
						objectMedicationRequest.reasonReference = ReasonReference;
						objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
						objectMedicationRequest.requester = medicationRequest.requester;
						objectMedicationRequest.substitution = medicationRequest.substitution;
						objectMedicationRequest.dispenseRequest = medicationRequest.dispenseRequest;

						newMedicationRequest[index] = objectMedicationRequest;

						myEmitter.once("getMedicationRequestDosage", function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
							qString = {};
							qString.medication_request_id = medicationRequest.id;
							seedPhoenixFHIR.path.GET = {
								"MedicationRequestDosage" : {
									"location": "%(apikey)s/MedicationRequestDosage",
									"query": qString
								}
							}
							var ApiFHIR = new Apiclient(seedPhoenixFHIR);
							ApiFHIR.get('MedicationRequestDosage', {"apikey": apikey}, {}, function(error, response, body){
								medicationRequestDosage = JSON.parse(body);
								if(medicationRequestDosage.err_code == 0){
									var objectMedicationRequest = {};
									objectMedicationRequest.resourceType = medicationRequest.resourceType;
									objectMedicationRequest.id = medicationRequest.id;
									objectMedicationRequest.identifier = medicationRequest.identifier;
									objectMedicationRequest.definition = medicationRequest.definition;
									objectMedicationRequest.basedOn = medicationRequest.basedOn;
									objectMedicationRequest.groupIdentifier = medicationRequest.groupIdentifier;
									objectMedicationRequest.status = medicationRequest.status;
									objectMedicationRequest.intent = medicationRequest.intent;
									objectMedicationRequest.category = medicationRequest.category;
									objectMedicationRequest.priority = medicationRequest.priority;
									objectMedicationRequest.medication = medicationRequest.medication;
									objectMedicationRequest.subject = medicationRequest.subject;
									objectMedicationRequest.context = medicationRequest.context;
									objectMedicationRequest.supportingInformation = medicationRequest.supportingInformation;
									objectMedicationRequest.authoredOn = medicationRequest.authoredOn;
									objectMedicationRequest.recorder = medicationRequest.recorder;
									objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
									objectMedicationRequest.reasonReference = medicationRequest.reasonReference;
									objectMedicationRequest.dosageInstruction = medicationRequestDosage.data;
									objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
									objectMedicationRequest.requester = medicationRequest.requester;
									objectMedicationRequest.substitution = medicationRequest.substitution;
									objectMedicationRequest.dispenseRequest = medicationRequest.dispenseRequest;

									newMedicationRequest[index] = objectMedicationRequest;

									myEmitter.once("getMedicationRequestDetectedIssue", function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
										qString = {};
										qString.medication_request_id = medicationRequest.id;
										seedPhoenixFHIR.path.GET = {
											"MedicationRequestDetectedIssue" : {
												"location": "%(apikey)s/MedicationRequestDetectedIssue",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);
										ApiFHIR.get('MedicationRequestDetectedIssue', {"apikey": apikey}, {}, function(error, response, body){
											medicationRequestDetectedIssue = JSON.parse(body);
											if(medicationRequestDetectedIssue.err_code == 0){
												var objectMedicationRequest = {};
												objectMedicationRequest.resourceType = medicationRequest.resourceType;
												objectMedicationRequest.id = medicationRequest.id;
												objectMedicationRequest.identifier = medicationRequest.identifier;
												objectMedicationRequest.definition = medicationRequest.definition;
												objectMedicationRequest.basedOn = medicationRequest.basedOn;
												objectMedicationRequest.groupIdentifier = medicationRequest.groupIdentifier;
												objectMedicationRequest.status = medicationRequest.status;
												objectMedicationRequest.intent = medicationRequest.intent;
												objectMedicationRequest.category = medicationRequest.category;
												objectMedicationRequest.priority = medicationRequest.priority;
												objectMedicationRequest.medication = medicationRequest.medication;
												objectMedicationRequest.subject = medicationRequest.subject;
												objectMedicationRequest.context = medicationRequest.context;
												objectMedicationRequest.supportingInformation = medicationRequest.supportingInformation;
												objectMedicationRequest.authoredOn = medicationRequest.authoredOn;
												objectMedicationRequest.recorder = medicationRequest.recorder;
												objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
												objectMedicationRequest.reasonReference = medicationRequest.reasonReference;
												objectMedicationRequest.dosageInstruction = medicationRequest.dosageInstruction;
												objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
												objectMedicationRequest.requester = medicationRequest.requester;
												objectMedicationRequest.substitution = medicationRequest.substitution;
												objectMedicationRequest.dispenseRequest = medicationRequest.dispenseRequest;
												objectMedicationRequest.detectedIssueId = medicationRequestDetectedIssue.data;

												newMedicationRequest[index] = objectMedicationRequest;

												myEmitter.once("getMedicationRequestProvenance", function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
													qString = {};
													qString.medication_request_id = medicationRequest.id;
													seedPhoenixFHIR.path.GET = {
														"MedicationRequestProvenance" : {
															"location": "%(apikey)s/MedicationRequestProvenance",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
													ApiFHIR.get('MedicationRequestProvenance', {"apikey": apikey}, {}, function(error, response, body){
														medicationRequestProvenance = JSON.parse(body);
														if(medicationRequestProvenance.err_code == 0){
															var objectMedicationRequest = {};
															objectMedicationRequest.resourceType = medicationRequest.resourceType;
															objectMedicationRequest.id = medicationRequest.id;
															objectMedicationRequest.identifier = medicationRequest.identifier;
															objectMedicationRequest.definition = medicationRequest.definition;
															objectMedicationRequest.basedOn = medicationRequest.basedOn;
															objectMedicationRequest.groupIdentifier = medicationRequest.groupIdentifier;
															objectMedicationRequest.status = medicationRequest.status;
															objectMedicationRequest.intent = medicationRequest.intent;
															objectMedicationRequest.category = medicationRequest.category;
															objectMedicationRequest.priority = medicationRequest.priority;
															objectMedicationRequest.medication = medicationRequest.medication;
															objectMedicationRequest.subject = medicationRequest.subject;
															objectMedicationRequest.context = medicationRequest.context;
															objectMedicationRequest.supportingInformation = medicationRequest.supportingInformation;
															objectMedicationRequest.authoredOn = medicationRequest.authoredOn;
															objectMedicationRequest.recorder = medicationRequest.recorder;
															objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
															objectMedicationRequest.reasonReference = medicationRequest.reasonReference;
															objectMedicationRequest.dosageInstruction = medicationRequest.dosageInstruction;
															objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
															objectMedicationRequest.requester = medicationRequest.requester;
															objectMedicationRequest.substitution = medicationRequest.substitution;
															objectMedicationRequest.dispenseRequest = medicationRequest.dispenseRequest;
															objectMedicationRequest.medicationRequest = medicationRequestDetectedIssue.detectedIssueId;
															objectMedicationRequest.eventHistory = medicationRequestProvenance.data;

															newMedicationRequest[index] = objectMedicationRequest;

															myEmitter.once("getNote", function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
																qString = {};
																qString.medication_request_id = medicationRequest.id;
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
																		var objectMedicationRequest = {};
																		objectMedicationRequest.resourceType = medicationRequest.resourceType;
																		objectMedicationRequest.id = medicationRequest.id;
																		objectMedicationRequest.identifier = medicationRequest.identifier;
																		objectMedicationRequest.definition = medicationRequest.definition;
																		objectMedicationRequest.basedOn = medicationRequest.basedOn;
																		objectMedicationRequest.groupIdentifier = medicationRequest.groupIdentifier;
																		objectMedicationRequest.status = medicationRequest.status;
																		objectMedicationRequest.intent = medicationRequest.intent;
																		objectMedicationRequest.category = medicationRequest.category;
																		objectMedicationRequest.priority = medicationRequest.priority;
																		objectMedicationRequest.medication = medicationRequest.medication;
																		objectMedicationRequest.subject = medicationRequest.subject;
																		objectMedicationRequest.context = medicationRequest.context;
																		objectMedicationRequest.supportingInformation = medicationRequest.supportingInformation;
																		objectMedicationRequest.authoredOn = medicationRequest.authoredOn;
																		objectMedicationRequest.recorder = medicationRequest.recorder;
																		objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
																		objectMedicationRequest.reasonReference = medicationRequest.reasonReference;
																		objectMedicationRequest.note = annotation.data;
																		objectMedicationRequest.dosageInstruction = medicationRequest.dosageInstruction;
																		objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
																		objectMedicationRequest.requester = medicationRequest.requester;
																		objectMedicationRequest.dispenseRequest = medicationRequest.dispenseRequest;
																		objectMedicationRequest.substitution = medicationRequest.substitution;
																		objectMedicationRequest.medicationRequest = medicationRequestDetectedIssue.detectedIssueId;
																		objectMedicationRequest.eventHistory = medicationRequest.eventHistory;

																		newMedicationRequest[index] = objectMedicationRequest;

																		if(index == countMedicationRequest -1 ){
																			res.json({"err_code": 0, "data":newMedicationRequest});				
																		}	
																	}else{
																		res.json(annotation);
																	}
																})
															})
															myEmitter.emit("getNote", objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);	
														}else{
															res.json(medicationRequestProvenance);
														}
													})
												})
												myEmitter.emit("getMedicationRequestProvenance", objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);	
											}else{
												res.json(medicationRequestDetectedIssue);
											}
										})
									})
									myEmitter.emit("getMedicationRequestDetectedIssue", objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);	
								}else{
									res.json(medicationRequestDosage);
								}
							})
						})
						myEmitter.emit("getMedicationRequestDosage", objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);	
					}else{
						res.json(medicationRequestReasonReferenceObservation);
					}
				})
			})
			myEmitter.emit("getMedicationRequestReasonReferenceObservation", objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);
		}else{
			res.json(medicationRequestReasonReferenceCondition);
		}
	})
})
myEmitter.emit("getMedicationRequestReasonReferenceCondition", objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);
																														}else{
																															res.json(medicationRequestBasedOnMedicationRequest);
																														}
																													})
																												})
																												myEmitter.emit("getMedicationRequestBasedOnMedicationRequest", objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);		
																											}else{
																												res.json(medicationRequestBasedOnReferralRequest);
																											}
																										})
																									})
																									myEmitter.emit("getMedicationRequestBasedOnReferralRequest", objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);	
																								}else{
																									res.json(medicationRequestBasedOnProcedureRequest);
																								}
																							})
																						})
																						myEmitter.emit("getMedicationRequestBasedOnProcedureRequest", objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);	
																					}else{
																						res.json(medicationRequestBasedOnCarePlan);
																					}
																				})
																			})
																			myEmitter.emit("getMedicationRequestBasedOnCarePlan", objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);	
																		}else{
																			res.json(medicationRequestDefinitionActivityDefinition);
																		}
																	})
																})
																myEmitter.emit("getMedicationRequestDefinitionActivityDefinition", objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);
															}else{
																res.json(medicationRequestDefinitionPlanDefinition);
															}
														})
													})
													myEmitter.emit("getMedicationRequestDefinitionPlanDefinition", objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);
													
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", medicationRequest.data[i], i, newMedicationRequest, medicationRequest.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Medication Request is empty."});	
								}
							}else{
								res.json(medicationRequest);
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
					var medicationRequestId = req.params.medication_request_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + medicationRequestId, 'MEDICATION_REQUEST', function(resMedicationRequestID){
								if(resMedicationRequestID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.medication_request_id = medicationRequestId;
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
						  			qString.medication_request_id = medicationRequestId;
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
									res.json({"err_code": 501, "err_msg": "Medication Request Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		medicationRequestDosage: function getMedicationRequestDosage(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationRequestId = req.params.medication_request_id;
			var medicationRequestDosageId = req.params.dosage_id;
			console.log("12345");
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + medicationRequestId, 'MEDICATION_REQUEST', function(resPatientID){
						if(resPatientID.err_code > 0){
							if(typeof medicationRequestDosageId !== 'undefined' && !validator.isEmpty(medicationRequestDosageId)){
								console.log("1");
								checkUniqeValue(apikey, "DOSAGE_ID|" + medicationRequestDosageId, 'DOSAGE', function(resMedicationRequestDosageID){
									if(resMedicationRequestDosageID.err_code > 0){
										//get medicationRequestDosage
										qString = {};
										qString.medication_request_id = medicationRequestId;
										qString._id = medicationRequestDosageId;
										seedPhoenixFHIR.path.GET = {
											"MedicationRequestDosage" : {
												"location": "%(apikey)s/Dosage",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('MedicationRequestDosage', {"apikey": apikey}, {}, function(error, response, body){
											medicationRequestDosage = JSON.parse(body);
											console.log(medicationRequestDosage);
											if(medicationRequestDosage.err_code == 0){
														//res.json({"err_code": 0, "data":medicationRequestDosage.data});
														if(medicationRequestDosage.data.length > 0){
															newMedicationRequestDosage = [];
															for(i=0; i < medicationRequestDosage.data.length; i++){
																myEmitter.once('getTiming', function(medicationRequestDosage, index, newMedicationRequestDosage, countImmunizationRecommendation){
																	qString = {};
																	qString.recommendation_id = medicationRequestDosage.id;
																	seedPhoenixFHIR.path.GET = {
																		"Timing" : {
																			"location": "%(apikey)s/Timing",
																			"query": qString
																		}
																	}

																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																	ApiFHIR.get('Timing', {"apikey": apikey}, {}, function(error, response, body){
																		medicationRequestDosageTiming = JSON.parse(body);
																		if(medicationRequestDosageTiming.err_code == 0){
																			var objectMedicationRequestDosage = {};
																			objectMedicationRequestDosage.id = medicationRequestDosage.id;
																			objectMedicationRequestDosage.sequence = medicationRequestDosage.sequence;
																			objectMedicationRequestDosage.text = medicationRequestDosage.text;
																			objectMedicationRequestDosage.additionalInstruction = medicationRequestDosage.additionalInstruction;
																			objectMedicationRequestDosage.patientInstruction = medicationRequestDosage.patientInstruction;
																			objectMedicationRequestDosage.timing = medicationRequestDosageTiming.data;
																			objectMedicationRequestDosage.asNeeded = medicationRequestDosage.asNeeded;
																			objectMedicationRequestDosage.site = medicationRequestDosage.site;
																			objectMedicationRequestDosage.route = medicationRequestDosage.route;
																			objectMedicationRequestDosage.method = medicationRequestDosage.method;
																			objectMedicationRequestDosage.dose = medicationRequestDosage.dose;
																			objectMedicationRequestDosage.maxDosePerPeriod = medicationRequestDosage.maxDosePerPeriod;
																			objectMedicationRequestDosage.maxDosePerAdministration = medicationRequestDosage.maxDosePerAdministration;
																			objectMedicationRequestDosage.maxDoseLerLifetime = medicationRequestDosage.maxDoseLerLifetime;
																			objectMedicationRequestDosage.rate = medicationRequestDosage.rate;

																			newMedicationRequestDosage[index] = objectMedicationRequestDosage;
																			if(index == countImmunizationRecommendation -1 ){
																				res.json({"err_code": 0, "data":newMedicationRequestDosage});	
																			}
																		}else{
																			res.json(medicationRequestDosageTiming);			
																		}
																	})
																})
																myEmitter.emit('getTiming', medicationRequestDosage.data[i], i, newMedicationRequestDosage, medicationRequestDosage.data.length);
															}
															//res.json({"err_code": 0, "data":organization.data});
														}else{
															res.json({"err_code": 2, "err_msg": "Medication Request is empty."});	
														}
													/*-------------*/
													}else{
														res.json(medicationRequestDosage);
													}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Medication Request Recommendation Id not found"});		
									}
								})
							}else{
								console.log("2");
								//get medicationRequestDosage
								qString = {};
								qString.medication_request_id = medicationRequestId;
								seedPhoenixFHIR.path.GET = {
									"MedicationRequestDosage" : {
										"location": "%(apikey)s/Dosage",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('MedicationRequestDosage', {"apikey": apikey}, {}, function(error, response, body){
									medicationRequestDosage = JSON.parse(body);
									console.log(medicationRequestDosage);
									if(medicationRequestDosage.err_code == 0){
												//res.json({"err_code": 0, "data":medicationRequestDosage.data});
												if(medicationRequestDosage.data.length > 0){
													newMedicationRequestDosage = [];
													for(i=0; i < medicationRequestDosage.data.length; i++){
														myEmitter.once('getTiming', function(medicationRequestDosage, index, newMedicationRequestDosage, countImmunizationRecommendation){
															qString = {};
															qString.recommendation_id = medicationRequestDosage.id;
															seedPhoenixFHIR.path.GET = {
																"Timing" : {
																	"location": "%(apikey)s/Timing",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('Timing', {"apikey": apikey}, {}, function(error, response, body){
																medicationRequestDosageTiming = JSON.parse(body);
																if(medicationRequestDosageTiming.err_code == 0){
																	var objectMedicationRequestDosage = {};
																	objectMedicationRequestDosage.id = medicationRequestDosage.id;
																	objectMedicationRequestDosage.sequence = medicationRequestDosage.sequence;
																	objectMedicationRequestDosage.text = medicationRequestDosage.text;
																	objectMedicationRequestDosage.additionalInstruction = medicationRequestDosage.additionalInstruction;
																	objectMedicationRequestDosage.patientInstruction = medicationRequestDosage.patientInstruction;
																	objectMedicationRequestDosage.timing = medicationRequestDosageTiming.data;
																	objectMedicationRequestDosage.asNeeded = medicationRequestDosage.asNeeded;
																	objectMedicationRequestDosage.site = medicationRequestDosage.site;
																	objectMedicationRequestDosage.route = medicationRequestDosage.route;
																	objectMedicationRequestDosage.method = medicationRequestDosage.method;
																	objectMedicationRequestDosage.dose = medicationRequestDosage.dose;
																	objectMedicationRequestDosage.maxDosePerPeriod = medicationRequestDosage.maxDosePerPeriod;
																	objectMedicationRequestDosage.maxDosePerAdministration = medicationRequestDosage.maxDosePerAdministration;
																	objectMedicationRequestDosage.maxDoseLerLifetime = medicationRequestDosage.maxDoseLerLifetime;
																	objectMedicationRequestDosage.rate = medicationRequestDosage.rate;
																	
																	newMedicationRequestDosage[index] = objectMedicationRequestDosage;
																	if(index == countImmunizationRecommendation -1 ){
																		res.json({"err_code": 0, "data":newMedicationRequestDosage});	
																	}
																}else{
																	res.json(medicationRequestDosageTiming);			
																}
															})
														})
														myEmitter.emit('getTiming', medicationRequestDosage.data[i], i, newMedicationRequestDosage, medicationRequestDosage.data.length);
													}
													//res.json({"err_code": 0, "data":organization.data});
												}else{
													res.json({"err_code": 2, "err_msg": "Medication Request is empty."});	
												}
											/*-------------*/
											}else{
												res.json(medicationRequestDosage);
											}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Medication Request Id not found"});		
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
		medicationRequest : function addMedicationRequest(req, res){
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
				} else {
					err_code = 1;
					err_msg = "Identifier Period invalid period format.";	
				}

			}else{
				err_code = 1;
				err_msg = "Please add key 'period' in json identifier request.";
			}

/*
definition.activityDefinition|definitionActivityDefinition|||
definition.planDefinition|definitionPlanDefinition|||
basedOn.carePlan|basedOnCarePlan|||
basedOn.medicationRequest|basedOnMedicationRequest|||
basedOn.procedureRequest|basedOnProcedureRequest|||
basedOn.referralRequest|basedOnReferralRequest|||
status|status|||
intent|intent||nn|
category|category|||
priority|priority|||
medication.medicationCodeableConcept|medicationMedicationCodeableConcept||nn|
medication.medicationReference|medicationMedicationReference|||
subject.patient|subjectPatient|||
subject.group|subjectGroup|||
context.encounter|contextEncounter|||
context.episodeOfCare|contextEpisodeOfCare|||
supportingInformation|supportingInformation|||
authoredOn|authoredOn|date||
requester.agent.practitioner|requesterPractitioner|||
requester.agent.organization|requesterOrganization|||
requester.agent.patient|requesterPatient|||
requester.agent.relatedPerson|requesterRelatedPerson|||
requester.agent.device|requesterDevice|||
requester.onBehalfOf|requesterOnBehalfOf|||
recorder|recorder|||
reasonCode|reasonCode|||
reasonReference.condition|reasonReferenceCondition|||
reasonReference.observation|reasonReferenceObservation|||
note.author.authorReference.practitioner|noteAuthorPractitioner|||
note.author.authorReference.patient|noteAuthorPatient|||
note.author.authorReference.relatedPerson|noteAuthorRelatedPerson|||
note.author.authorString|noteAuthorAuthorString|||
note.time|noteTime|date||
note.text|noteText|||
dosageInstruction|dosageInstruction|||
dispenseRequest.validityPeriod|dispenseRequestValidityPeriod|period||
dispenseRequest.numberOfRepeatsAllowed|dispenseRequestNumberOfRepeatsAllowed|integer||
dispenseRequest.quantity|dispenseRequestQuantity|integer||
dispenseRequest.expectedSupplyDuration|dispenseRequestExpectedSupplyDuration|integer||
dispenseRequest.performer|dispenseRequestPerformer|||
substitution.allowed|substitutionAllowed|boolean||
substitution.reason|substitutionReason|||U
priorPrescription|priorPrescription|||
detectedIssue|detectedIssue|||
eventHistory|eventHistory||
*/
			if(typeof req.body.definition.activityDefinition !== 'undefined'){
				var definitionActivityDefinition =  req.body.definition.activityDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionActivityDefinition)){
					definitionActivityDefinition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'definition activity definition' in json Medication Request request.";
			}

			if(typeof req.body.definition.planDefinition !== 'undefined'){
				var definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					definitionPlanDefinition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'definition plan definition' in json Medication Request request.";
			}

			if(typeof req.body.basedOn.carePlan !== 'undefined'){
				var basedOnCarePlan =  req.body.basedOn.carePlan.trim().toLowerCase();
				if(validator.isEmpty(basedOnCarePlan)){
					basedOnCarePlan = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on care plan' in json Medication Request request.";
			}

			if(typeof req.body.basedOn.medicationRequest !== 'undefined'){
				var basedOnMedicationRequest =  req.body.basedOn.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnMedicationRequest)){
					basedOnMedicationRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on medication request' in json Medication Request request.";
			}

			if(typeof req.body.basedOn.procedureRequest !== 'undefined'){
				var basedOnProcedureRequest =  req.body.basedOn.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnProcedureRequest)){
					basedOnProcedureRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on procedure request' in json Medication Request request.";
			}

			if(typeof req.body.basedOn.referralRequest !== 'undefined'){
				var basedOnReferralRequest =  req.body.basedOn.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnReferralRequest)){
					basedOnReferralRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on referral request' in json Medication Request request.";
			}

			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Medication Request request.";
			}

			if(typeof req.body.intent !== 'undefined'){
				var intent =  req.body.intent.trim().toLowerCase();
				if(validator.isEmpty(intent)){
					err_code = 2;
					err_msg = "Medication Request intent is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'intent' in json Medication Request request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Medication Request request.";
			}

			if(typeof req.body.priority !== 'undefined'){
				var priority =  req.body.priority.trim().toLowerCase();
				if(validator.isEmpty(priority)){
					priority = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'priority' in json Medication Request request.";
			}

			if(typeof req.body.medication.medicationCodeableConcept !== 'undefined'){
				var medicationMedicationCodeableConcept =  req.body.medication.medicationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationCodeableConcept)){
					err_code = 2;
					err_msg = "Medication Request medication medication codeable concept is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'medication medication codeable concept' in json Medication Request request.";
			}

			if(typeof req.body.medication.medicationReference !== 'undefined'){
				var medicationMedicationReference =  req.body.medication.medicationReference.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationReference)){
					medicationMedicationReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'medication medication reference' in json Medication Request request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Medication Request request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Medication Request request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Medication Request request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Medication Request request.";
			}

			if(typeof req.body.supportingInformation !== 'undefined'){
				var supportingInformation =  req.body.supportingInformation.trim().toLowerCase();
				if(validator.isEmpty(supportingInformation)){
					supportingInformation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'supporting information' in json Medication Request request.";
			}

			if(typeof req.body.authoredOn !== 'undefined'){
				var authoredOn =  req.body.authoredOn;
				if(validator.isEmpty(authoredOn)){
					authoredOn = "";
				}else{
					if(!regex.test(authoredOn)){
						err_code = 2;
						err_msg = "Medication Request authored on invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'authored on' in json Medication Request request.";
			}

			if(typeof req.body.requester.agent.practitioner !== 'undefined'){
				var requesterPractitioner =  req.body.requester.agent.practitioner.trim().toLowerCase();
				if(validator.isEmpty(requesterPractitioner)){
					requesterPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'requester agent practitioner' in json Medication Request request.";
			}

			if(typeof req.body.requester.agent.organization !== 'undefined'){
				var requesterOrganization =  req.body.requester.agent.organization.trim().toLowerCase();
				if(validator.isEmpty(requesterOrganization)){
					requesterOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'requester agent organization' in json Medication Request request.";
			}

			if(typeof req.body.requester.agent.patient !== 'undefined'){
				var requesterPatient =  req.body.requester.agent.patient.trim().toLowerCase();
				if(validator.isEmpty(requesterPatient)){
					requesterPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'requester agent patient' in json Medication Request request.";
			}

			if(typeof req.body.requester.agent.relatedPerson !== 'undefined'){
				var requesterRelatedPerson =  req.body.requester.agent.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(requesterRelatedPerson)){
					requesterRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'requester agent related person' in json Medication Request request.";
			}

			if(typeof req.body.requester.agent.device !== 'undefined'){
				var requesterDevice =  req.body.requester.agent.device.trim().toLowerCase();
				if(validator.isEmpty(requesterDevice)){
					requesterDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'requester agent device' in json Medication Request request.";
			}

			if(typeof req.body.requester.onBehalfOf !== 'undefined'){
				var requesterOnBehalfOf =  req.body.requester.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(requesterOnBehalfOf)){
					requesterOnBehalfOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'requester on behalf of' in json Medication Request request.";
			}

			if(typeof req.body.recorder !== 'undefined'){
				var recorder =  req.body.recorder.trim().toLowerCase();
				if(validator.isEmpty(recorder)){
					recorder = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recorder' in json Medication Request request.";
			}

			if(typeof req.body.reasonCode !== 'undefined'){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					reasonCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason code' in json Medication Request request.";
			}

			if(typeof req.body.reasonReference.condition !== 'undefined'){
				var reasonReferenceCondition =  req.body.reasonReference.condition.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceCondition)){
					reasonReferenceCondition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference condition' in json Medication Request request.";
			}

			if(typeof req.body.reasonReference.observation !== 'undefined'){
				var reasonReferenceObservation =  req.body.reasonReference.observation.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceObservation)){
					reasonReferenceObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference observation' in json Medication Request request.";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					noteAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Medication Request request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					noteAuthorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Medication Request request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					noteAuthorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Medication Request request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Medication Request request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Medication Request note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Medication Request request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note text' in json Medication Request request.";
			}
			
			if(typeof req.body.dosageInstruction !== 'undefined'){
				var dosageInstruction =  req.body.dosageInstruction.trim().toLowerCase();
				if(validator.isEmpty(dosageInstruction)){
					dosageInstruction = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage instruction' in json Medication Request request.";
			}

			if (typeof req.body.dispenseRequest.validityPeriod !== 'undefined') {
			  var dispenseRequestValidityPeriod = req.body.dispenseRequest.validityPeriod;
 				if(validator.isEmpty(dispenseRequestValidityPeriod)) {
				  var dispenseRequestValidityPeriodStart = "";
				  var dispenseRequestValidityPeriodEnd = "";
				} else {
				  if (dispenseRequestValidityPeriod.indexOf("to") > 0) {
				    arrDispenseRequestValidityPeriod = dispenseRequestValidityPeriod.split("to");
				    var dispenseRequestValidityPeriodStart = arrDispenseRequestValidityPeriod[0];
				    var dispenseRequestValidityPeriodEnd = arrDispenseRequestValidityPeriod[1];
				    if (!regex.test(dispenseRequestValidityPeriodStart) && !regex.test(dispenseRequestValidityPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Medication Request dispense request validity period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Medication Request dispense request validity period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'dispense request validity period' in json Medication Request request.";
			}

			if(typeof req.body.dispenseRequest.numberOfRepeatsAllowed !== 'undefined'){
				var dispenseRequestNumberOfRepeatsAllowed =  req.body.dispenseRequest.numberOfRepeatsAllowed.trim();
				if(validator.isEmpty(dispenseRequestNumberOfRepeatsAllowed)){
					dispenseRequestNumberOfRepeatsAllowed = "";
				}else{
					if(!validator.isInt(dispenseRequestNumberOfRepeatsAllowed)){
						err_code = 2;
						err_msg = "Medication Request dispense request number of repeats allowed is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dispense request number of repeats allowed' in json Medication Request request.";
			}

			if(typeof req.body.dispenseRequest.quantity !== 'undefined'){
				var dispenseRequestQuantity =  req.body.dispenseRequest.quantity.trim();
				if(validator.isEmpty(dispenseRequestQuantity)){
					dispenseRequestQuantity = "";
				}else{
					if(!validator.isInt(dispenseRequestQuantity)){
						err_code = 2;
						err_msg = "Medication Request dispense request quantity is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dispense request quantity' in json Medication Request request.";
			}

			if(typeof req.body.dispenseRequest.expectedSupplyDuration !== 'undefined'){
				var dispenseRequestExpectedSupplyDuration =  req.body.dispenseRequest.expectedSupplyDuration.trim();
				if(validator.isEmpty(dispenseRequestExpectedSupplyDuration)){
					dispenseRequestExpectedSupplyDuration = "";
				}else{
					if(!validator.isInt(dispenseRequestExpectedSupplyDuration)){
						err_code = 2;
						err_msg = "Medication Request dispense request expected supply duration is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dispense request expected supply duration' in json Medication Request request.";
			}

			if(typeof req.body.dispenseRequest.performer !== 'undefined'){
				var dispenseRequestPerformer =  req.body.dispenseRequest.performer.trim().toLowerCase();
				if(validator.isEmpty(dispenseRequestPerformer)){
					dispenseRequestPerformer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dispense request performer' in json Medication Request request.";
			}

			if (typeof req.body.substitution.allowed !== 'undefined') {
				var substitutionAllowed = req.body.substitution.allowed.trim().toLowerCase();
					if(validator.isEmpty(substitutionAllowed)){
						substitutionAllowed = "false";
					}
				if(substitutionAllowed === "true" || substitutionAllowed === "false"){
					substitutionAllowed = substitutionAllowed;
				} else {
					err_code = 2;
					err_msg = "Medication Request substitution allowed is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'substitution allowed' in json Medication Request request.";
			}

			if(typeof req.body.substitution.reason !== 'undefined'){
				var substitutionReason =  req.body.substitution.reason.trim().toUpperCase();
				if(validator.isEmpty(substitutionReason)){
					substitutionReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'substitution reason' in json Medication Request request.";
			}

			if(typeof req.body.priorPrescription !== 'undefined'){
				var priorPrescription =  req.body.priorPrescription.trim().toLowerCase();
				if(validator.isEmpty(priorPrescription)){
					priorPrescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prior prescription' in json Medication Request request.";
			}

			if(typeof req.body.detectedIssue !== 'undefined'){
				var detectedIssue =  req.body.detectedIssue.trim().toLowerCase();
				if(validator.isEmpty(detectedIssue)){
					detectedIssue = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detected issue' in json Medication Request request.";
			}

			if(typeof req.body.eventHistory !== 'undefined'){
				var eventHistory =  req.body.eventHistory.trim().toLowerCase();
				if(validator.isEmpty(eventHistory)){
					eventHistory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'event history' in json Medication Request request.";
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
														var medicationRequestId = 'mre' + unicId;
														var AnnotationId = 'ann' + unicId;
														dataMedicationRequest = {
															"medication_request_id" : medicationRequestId,
															"based_on" : basedOnMedicationRequest,
															"group_identifier" : identifierId,
															"status" : status,
															"intent" : intent,
															"category" : category,
															"priority" : priority,
															"medication_codeable_concept" : medicationMedicationCodeableConcept,
															"medication_reference" : medicationMedicationReference,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"context_encounter" : contextEncounter,
															"context_episode_of_care" : contextEpisodeOfCare,
															"supporting_information" : supportingInformation,
															"authored_on" : authoredOn,
															"recorder" : recorder,
															"reason_code" : reasonCode,
															"prior_prescription" : priorPrescription,
															"agent_practitioner" : requesterPractitioner,
															"agent_organization" : requesterOrganization,
															"agent_patient" : requesterPatient,
															"agent_related_person" : requesterRelatedPerson,
															"agent_device" : requesterDevice,
															"on_behalf_of" : requesterOnBehalfOf,
															"allowed" : substitutionAllowed,
															"reason" : substitutionReason,
															"validity_period_start" : dispenseRequestValidityPeriodStart,
															"validity_period_end" : dispenseRequestValidityPeriodEnd,
															"number_of_repeats_allowed" : dispenseRequestNumberOfRepeatsAllowed,
															"quantity" : dispenseRequestQuantity,
															"expected_supply_duration" : dispenseRequestExpectedSupplyDuration,
															"performer" : dispenseRequestPerformer
														}
														console.log(dataMedicationRequest);
														ApiFHIR.post('medicationRequest', {"apikey": apikey}, {body: dataMedicationRequest, json: true}, function(error, response, body){
															medicationRequest = body;
															if(medicationRequest.err_code > 0){
																res.json(medicationRequest);	
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
																							"medication_request_id": medicationRequestId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														dataAnnotation = {
															"id" : AnnotationId,
															"author_ref_practitioner" : noteAuthorPractitioner,
															"author_ref_patient" : noteAuthorPatient,
															"author_ref_relatedPerson" : noteAuthorRelatedPerson,
															"author_string" : noteAuthorAuthorString,
															"time" : noteTime,
															"text" : noteText,
															"medication_request_id": medicationRequestId
														}
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataAnnotation, json: true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
																console.log("ok");
															}
														});	
														
														if(definitionActivityDefinition !== ""){
															dataDefinitionPlanDefinition = {
																"_id" : definitionPlanDefinition,
																"medication_request_id": medicationRequestId
															}
															ApiFHIR.put('planDefinition', {"apikey": apikey, "_id": definitionPlanDefinition}, {body: dataDefinitionPlanDefinition, json: true}, function(error, response, body){
																returnDefinitionPlanDefinition = body;
																if(returnDefinitionPlanDefinition.err_code > 0){
																	res.json(returnDefinitionPlanDefinition);	
																	console.log("add reference definition plan definition : " + definitionPlanDefinition);
																}
															});
														}
														
														if(definitionActivityDefinition !== ""){
															dataDefinitionActivityDefinition = {
																"_id" : definitionActivityDefinition,
																"medication_request_id": medicationRequestId
															}
															ApiFHIR.put('activityDefinition', {"apikey": apikey, "_id": definitionActivityDefinition}, {body: dataDefinitionActivityDefinition, json: true}, function(error, response, body){
																returnDefinitionActivityDefinition = body;
																if(returnDefinitionActivityDefinition.err_code > 0){
																	res.json(returnDefinitionActivityDefinition);	
																	console.log("add reference definition activity definition : " + definitionActivityDefinition);
																}
															});
														}
														
														if(basedOnCarePlan !== ""){
															dataBasedOnCarePlan = {
																"_id" : basedOnCarePlan,
																"medication_request_id": medicationRequestId
															}
															ApiFHIR.put('carePlan', {"apikey": apikey, "_id": basedOnCarePlan}, {body: dataBasedOnCarePlan, json: true}, function(error, response, body){
																returnBasedOnCarePlan = body;
																if(returnBasedOnCarePlan.err_code > 0){
																	res.json(returnBasedOnCarePlan);	
																	console.log("add based on care plan : " + basedOnCarePlan);
																}
															});
														}
														
														if(basedOnMedicationRequest !== ""){
															dataBasedOnMedicationRequest = {
																"_id" : basedOnMedicationRequest,
																"medication_request_id": medicationRequestId
															}
															ApiFHIR.put('medicationRequest', {"apikey": apikey, "_id": basedOnMedicationRequest}, {body: dataBasedOnMedicationRequest, json: true}, function(error, response, body){
																returnBasedOnMedicationRequest = body;
																if(returnBasedOnMedicationRequest.err_code > 0){
																	res.json(returnBasedOnMedicationRequest);	
																	console.log("add based on medication request : " + basedOnMedicationRequest);
																}
															});
														}
														
														if(basedOnProcedureRequest !== ""){
															dataBasedOnProcedureRequest = {
																"_id" : basedOnProcedureRequest,
																"medication_request_id": medicationRequestId
															}
															ApiFHIR.put('procedureRequest', {"apikey": apikey, "_id": basedOnProcedureRequest}, {body: dataBasedOnProcedureRequest, json: true}, function(error, response, body){
																returnBasedOnProcedureRequest = body;
																if(returnBasedOnProcedureRequest.err_code > 0){
																	res.json(returnBasedOnProcedureRequest);	
																	console.log("add based on procedure request : " + basedOnProcedureRequest);
																}
															});
														}
														
														if(basedOnReferralRequest !== ""){
															dataBasedOnReferralRequest = {
																"_id" : basedOnReferralRequest,
																"medication_request_id": medicationRequestId
															}
															ApiFHIR.put('referralRequest', {"apikey": apikey, "_id": basedOnReferralRequest}, {body: dataBasedOnReferralRequest, json: true}, function(error, response, body){
																returnBasedOnReferralRequest = body;
																if(returnBasedOnReferralRequest.err_code > 0){
																	res.json(returnBasedOnReferralRequest);	
																	console.log("add based on referral request : " + basedOnReferralRequest);
																}
															});
														}
														
														if(reasonReferenceCondition !== ""){
															dataReasonReferenceCondition = {
																"_id" : reasonReferenceCondition,
																"medication_request_id": medicationRequestId
															}
															ApiFHIR.put('condition', {"apikey": apikey, "_id": reasonReferenceCondition}, {body: dataReasonReferenceCondition, json: true}, function(error, response, body){
																returnReasonReferenceCondition = body;
																if(returnReasonReferenceCondition.err_code > 0){
																	res.json(returnReasonReferenceCondition);	
																	console.log("add reference detected issue : " + reasonReferenceCondition);
																}
															});
														}
														
														if(reasonReferenceObservation !== ""){
															dataReasonReferenceObservation = {
																"_id" : reasonReferenceObservation,
																"medication_request_id": medicationRequestId
															}
															ApiFHIR.put('observation', {"apikey": apikey, "_id": reasonReferenceObservation}, {body: dataReasonReferenceObservation, json: true}, function(error, response, body){
																returnReasonReferenceObservation = body;
																if(returnReasonReferenceObservation.err_code > 0){
																	res.json(returnReasonReferenceObservation);	
																	console.log("add reason reference observation : " + reasonReferenceObservation);
																}
															});
														}
														
														if(detectedIssue !== ""){
															dataDetectedIssue = {
																"_id" : detectedIssue,
																"medication_request_id": medicationRequestId
															}
															ApiFHIR.put('detectedIssue', {"apikey": apikey, "_id": detectedIssue}, {body: dataDetectedIssue, json: true}, function(error, response, body){
																returnDetectedIssue = body;
																if(returnDetectedIssue.err_code > 0){
																	res.json(returnDetectedIssue);	
																	console.log("add reference detected issue : " + detectedIssue);
																}
															});
														}

														if(eventHistory !== ""){
															dataEventHistory = {
																"_id" : eventHistory,
																"medication_request_id": medicationRequestId
															}
															ApiFHIR.put('provenance', {"apikey": apikey, "_id": eventHistory}, {body: dataEventHistory, json: true}, function(error, response, body){
																returnEventHistory = body;
																if(returnEventHistory.err_code > 0){
																	res.json(returnEventHistory);	
																	console.log("add reference event history : " + eventHistory);
																}
															});
														}

														/*if(dosageInstruction !== ""){
															dataDosageInstruction = {
																"dosage_id" : dosageInstruction,
																"medication_dispense_id" : medicationDispenseId
															}
															ApiFHIR.put('dosage', {"apikey": apikey, "_id": dosageInstruction}, {body: dataDosageInstruction, json: true}, function(error, response, body){
																returnDosageInstruction = body;
																if(returnDosageInstruction.err_code > 0){
																	res.json(returnDosageInstruction);	
																	console.log("add reference dosage instruction : " + dosageInstruction);
																}
															});
														}				*/		
														
														/*------------*/
														res.json({"err_code": 0, "err_msg": "Medication Request has been add.", "data": [{"_id": medicationRequestId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
										status|medication_request_status
										intent|medication_request_intent
										category|medication_request_category
										priority|medication_request_priority
										medicationMedicationCodeableConcept|medication_codes
										reasonCode|condition_code
										substitutionReason|Substance_Admin_Substitution_Reason
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'MEDICATION_REQUEST_STATUS', function (resStatusCode) {
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
												checkCode(apikey, intent, 'MEDICATION_REQUEST_INTENT', function (resIntentCode) {
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

										myEmitter.prependOnceListener('checkCategory', function () {
											if (!validator.isEmpty(category)) {
												checkCode(apikey, category, 'MEDICATION_REQUEST_CATEGORY', function (resCategoryCode) {
													if (resCategoryCode.err_code > 0) {
														myEmitter.emit('checkIntent');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIntent');
											}
										})

										myEmitter.prependOnceListener('checkPriority', function () {
											if (!validator.isEmpty(priority)) {
												checkCode(apikey, priority, 'MEDICATION_REQUEST_PRIORITY', function (resPriorityCode) {
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

										myEmitter.prependOnceListener('checkMedicationMedicationCodeableConcept', function () {
											if (!validator.isEmpty(medicationMedicationCodeableConcept)) {
												checkCode(apikey, medicationMedicationCodeableConcept, 'MEDICATION_CODES', function (resMedicationMedicationCodeableConceptCode) {
													if (resMedicationMedicationCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkPriority');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Medication medication codeable concept code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPriority');
											}
										})

										myEmitter.prependOnceListener('checkReasonCode', function () {
											if (!validator.isEmpty(reasonCode)) {
												checkCode(apikey, reasonCode, 'CONDITION_CODE', function (resReasonCodeCode) {
													if (resReasonCodeCode.err_code > 0) {
														myEmitter.emit('checkMedicationMedicationCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkMedicationMedicationCodeableConcept');
											}
										})

										myEmitter.prependOnceListener('checkSubstitutionReason', function () {
											if (!validator.isEmpty(substitutionReason)) {
												checkCode(apikey, substitutionReason, 'SUBSTANCE_ADMIN_SUBSTITUTION_REASON', function (resSubstitutionReasonCode) {
													if (resSubstitutionReasonCode.err_code > 0) {
														myEmitter.emit('checkReasonCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Substitution reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonCode');
											}
										})


										//cek value
/*
definitionActivityDefinition|Activity_Definition
definitionPlanDefinition|Plan_Definition
basedOnCarePlan|CAREPLAN
basedOnMedicationRequest|Medication_Request
basedOnProcedureRequest|Procedure_Request
basedOnReferralRequest|Referral_Request
medicationMedicationReference|Medication_Reference
subjectPatient|Patient
subjectGroup|Group
contextEncounter|Encounter
contextEpisodeOfCare|Episode_Of_Care
requesterPractitioner|Practitioner
requesterOrganization|Organization
requesterPatient|Patient
requesterRelatedPerson|Related_Person
requesterDevice|Device
requesterOnBehalfOf|Organization
recorder|Practitioner
reasonReferenceCondition|Condition
reasonReferenceObservation|Observation
noteAuthorPractitioner|Practitioner
noteAuthorPatient|Patient
noteAuthorRelatedPerson|Related_Person
dispenseRequestPerformer|Organization
priorPrescription|Medication_Request
detectedIssue|Detected_Issue
eventHistory|Provenance
dosageInstruction|dosage
*/
										myEmitter.prependOnceListener('checkDosageInstruction', function () {
											if (!validator.isEmpty(dosageInstruction)) {
												checkUniqeValue(apikey, "DOSAGE_ID|" + dosageInstruction, 'DOSAGE', function (resDosageInstruction) {
													if (resDosageInstruction.err_code > 0) {
														myEmitter.emit('checkSubstitutionReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "dosage instruction id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubstitutionReason');
											}
										})
										
										myEmitter.prependOnceListener('checkDefinitionActivityDefinition', function () {
											if (!validator.isEmpty(definitionActivityDefinition)) {
												checkUniqeValue(apikey, "ACTIVITY_DEFINITION_ID|" + definitionActivityDefinition, 'ACTIVITY_DEFINITION', function (resDefinitionActivityDefinition) {
													if (resDefinitionActivityDefinition.err_code > 0) {
														myEmitter.emit('checkDosageInstruction');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Definition activity definition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDosageInstruction');
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

										myEmitter.prependOnceListener('checkBasedOnCarePlan', function () {
											if (!validator.isEmpty(basedOnCarePlan)) {
												checkUniqeValue(apikey, "CAREPLAN_ID|" + basedOnCarePlan, 'CAREPLAN', function (resBasedOnCarePlan) {
													if (resBasedOnCarePlan.err_code > 0) {
														myEmitter.emit('checkDefinitionPlanDefinition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on care plan id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDefinitionPlanDefinition');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnMedicationRequest', function () {
											if (!validator.isEmpty(basedOnMedicationRequest)) {
												checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + basedOnMedicationRequest, 'MEDICATION_REQUEST', function (resBasedOnMedicationRequest) {
													if (resBasedOnMedicationRequest.err_code > 0) {
														myEmitter.emit('checkBasedOnCarePlan');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on medication request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnCarePlan');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnProcedureRequest', function () {
											if (!validator.isEmpty(basedOnProcedureRequest)) {
												checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + basedOnProcedureRequest, 'PROCEDURE_REQUEST', function (resBasedOnProcedureRequest) {
													if (resBasedOnProcedureRequest.err_code > 0) {
														myEmitter.emit('checkBasedOnMedicationRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on procedure request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnMedicationRequest');
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

										myEmitter.prependOnceListener('checkMedicationMedicationReference', function () {
											if (!validator.isEmpty(medicationMedicationReference)) {
												checkUniqeValue(apikey, "MEDICATION_REFERENCE_ID|" + medicationMedicationReference, 'MEDICATION_REFERENCE', function (resMedicationMedicationReference) {
													if (resMedicationMedicationReference.err_code > 0) {
														myEmitter.emit('checkBasedOnReferralRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Medication medication reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnReferralRequest');
											}
										})

										myEmitter.prependOnceListener('checkSubjectPatient', function () {
											if (!validator.isEmpty(subjectPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
													if (resSubjectPatient.err_code > 0) {
														myEmitter.emit('checkMedicationMedicationReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkMedicationMedicationReference');
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

										myEmitter.prependOnceListener('checkRequesterPractitioner', function () {
											if (!validator.isEmpty(requesterPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + requesterPractitioner, 'PRACTITIONER', function (resRequesterPractitioner) {
													if (resRequesterPractitioner.err_code > 0) {
														myEmitter.emit('checkContextEpisodeOfCare');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Requester practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEpisodeOfCare');
											}
										})

										myEmitter.prependOnceListener('checkRequesterOrganization', function () {
											if (!validator.isEmpty(requesterOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + requesterOrganization, 'ORGANIZATION', function (resRequesterOrganization) {
													if (resRequesterOrganization.err_code > 0) {
														myEmitter.emit('checkRequesterPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Requester organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequesterPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkRequesterPatient', function () {
											if (!validator.isEmpty(requesterPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + requesterPatient, 'PATIENT', function (resRequesterPatient) {
													if (resRequesterPatient.err_code > 0) {
														myEmitter.emit('checkRequesterOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Requester patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequesterOrganization');
											}
										})

										myEmitter.prependOnceListener('checkRequesterRelatedPerson', function () {
											if (!validator.isEmpty(requesterRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + requesterRelatedPerson, 'RELATED_PERSON', function (resRequesterRelatedPerson) {
													if (resRequesterRelatedPerson.err_code > 0) {
														myEmitter.emit('checkRequesterPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Requester related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequesterPatient');
											}
										})

										myEmitter.prependOnceListener('checkRequesterDevice', function () {
											if (!validator.isEmpty(requesterDevice)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + requesterDevice, 'DEVICE', function (resRequesterDevice) {
													if (resRequesterDevice.err_code > 0) {
														myEmitter.emit('checkRequesterRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Requester device id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequesterRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkRequesterOnBehalfOf', function () {
											if (!validator.isEmpty(requesterOnBehalfOf)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + requesterOnBehalfOf, 'ORGANIZATION', function (resRequesterOnBehalfOf) {
													if (resRequesterOnBehalfOf.err_code > 0) {
														myEmitter.emit('checkRequesterDevice');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Requester on behalf of id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequesterDevice');
											}
										})

										myEmitter.prependOnceListener('checkRecorder', function () {
											if (!validator.isEmpty(recorder)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + recorder, 'PRACTITIONER', function (resRecorder) {
													if (resRecorder.err_code > 0) {
														myEmitter.emit('checkRequesterOnBehalfOf');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recorder id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequesterOnBehalfOf');
											}
										})

										myEmitter.prependOnceListener('checkReasonReferenceCondition', function () {
											if (!validator.isEmpty(reasonReferenceCondition)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + reasonReferenceCondition, 'CONDITION', function (resReasonReferenceCondition) {
													if (resReasonReferenceCondition.err_code > 0) {
														myEmitter.emit('checkRecorder');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason reference condition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecorder');
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

										myEmitter.prependOnceListener('checkNoteAuthorPractitioner', function () {
											if (!validator.isEmpty(noteAuthorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorPractitioner, 'PRACTITIONER', function (resNoteAuthorPractitioner) {
													if (resNoteAuthorPractitioner.err_code > 0) {
														myEmitter.emit('checkReasonReferenceObservation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonReferenceObservation');
											}
										})

										myEmitter.prependOnceListener('checkNoteAuthorPatient', function () {
											if (!validator.isEmpty(noteAuthorPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + noteAuthorPatient, 'PATIENT', function (resNoteAuthorPatient) {
													if (resNoteAuthorPatient.err_code > 0) {
														myEmitter.emit('checkNoteAuthorPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkNoteAuthorPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkNoteAuthorRelatedPerson', function () {
											if (!validator.isEmpty(noteAuthorRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + noteAuthorRelatedPerson, 'RELATED_PERSON', function (resNoteAuthorRelatedPerson) {
													if (resNoteAuthorRelatedPerson.err_code > 0) {
														myEmitter.emit('checkNoteAuthorPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkNoteAuthorPatient');
											}
										})

										myEmitter.prependOnceListener('checkDispenseRequestPerformer', function () {
											if (!validator.isEmpty(dispenseRequestPerformer)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + dispenseRequestPerformer, 'ORGANIZATION', function (resDispenseRequestPerformer) {
													if (resDispenseRequestPerformer.err_code > 0) {
														myEmitter.emit('checkNoteAuthorRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Dispense request performer id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkNoteAuthorRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkPriorPrescription', function () {
											if (!validator.isEmpty(priorPrescription)) {
												checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + priorPrescription, 'MEDICATION_REQUEST', function (resPriorPrescription) {
													if (resPriorPrescription.err_code > 0) {
														myEmitter.emit('checkDispenseRequestPerformer');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Prior prescription id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDispenseRequestPerformer');
											}
										})

										myEmitter.prependOnceListener('checkDetectedIssue', function () {
											if (!validator.isEmpty(detectedIssue)) {
												checkUniqeValue(apikey, "DETECTED_ISSUE_ID|" + detectedIssue, 'DETECTED_ISSUE', function (resDetectedIssue) {
													if (resDetectedIssue.err_code > 0) {
														myEmitter.emit('checkPriorPrescription');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Detected issue id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPriorPrescription');
											}
										})

										if (!validator.isEmpty(eventHistory)) {
											checkUniqeValue(apikey, "PROVENANCE_ID|" + eventHistory, 'PROVENANCE', function (resEventHistory) {
												if (resEventHistory.err_code > 0) {
													myEmitter.emit('checkDetectedIssue');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Event history id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkDetectedIssue');
										}

										/*-----------------------*/
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
			var medicationRequestId = req.params.medication_request_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof medicationRequestId !== 'undefined'){
				if(validator.isEmpty(medicationRequestId)){
					err_code = 2;
					err_msg = "Medication Request id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Request id is required";
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
												checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + medicationRequestId, 'MEDICATION_REQUEST', function(resMedicationRequestID){
													if(resMedicationRequestID.err_code > 0){
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
																							"medication_request_id": medicationRequestId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Medication Request.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Medication Request Id not found"});		
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
		dosage : function addDosage(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var medicationRequestId = req.params.medication_request_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof medicationRequestId !== 'undefined'){
				if(validator.isEmpty(medicationRequestId)){
					err_code = 2;
					err_msg = "Medication Request id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Request id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined'){
				var sequence =  req.body.sequence.trim();
				if(validator.isEmpty(sequence)){
					sequence = "";
				}else{
					if(!validator.isInt(sequence)){
						err_code = 2;
						err_msg = "Dosage sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'sequence' in json Dosage request.";
			}

			if(typeof req.body.text !== 'undefined'){
				var text =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(text)){
					text = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'text' in json Dosage request.";
			}

			if(typeof req.body.additionalInstruction !== 'undefined'){
				var additionalInstruction =  req.body.additionalInstruction.trim().toLowerCase();
				if(validator.isEmpty(additionalInstruction)){
					additionalInstruction = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'additional instruction' in json Dosage request.";
			}

			if(typeof req.body.patientInstruction !== 'undefined'){
				var patientInstruction =  req.body.patientInstruction.trim().toLowerCase();
				if(validator.isEmpty(patientInstruction)){
					patientInstruction = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient instruction' in json Dosage request.";
			}
			
			if(typeof req.body.timing.event !== 'undefined'){
				var event =  req.body.timing.event;
				if(validator.isEmpty(event)){
					event = "";
				}else{
					if(!regex.test(event)){
						err_code = 2;
						err_msg = "Timing event invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'event' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.bounds.boundsDuration !== 'undefined'){
				var repeatBoundsBoundsDuration =  req.body.timing.repeat.bounds.boundsDuration.trim();
				if(validator.isEmpty(repeatBoundsBoundsDuration)){
					repeatBoundsBoundsDuration = "";
				}else{
					if(!validator.isInt(repeatBoundsBoundsDuration)){
						err_code = 2;
						err_msg = "Timing repeat bounds bounds duration is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat bounds bounds duration' in json Timing request.";
			}

			if (typeof req.body.timing.repeat.bounds.boundsRange !== 'undefined') {
			  var repeatBoundsBoundsRange = req.body.timing.repeat.bounds.boundsRange;
 				if(validator.isEmpty(repeatBoundsBoundsRange)){
				  var repeatBoundsBoundsRangeLow = "";
				  var repeatBoundsBoundsRangeHigh = "";
				} else {
				  if (repeatBoundsBoundsRange.indexOf("to") > 0) {
				    arrRepeatBoundsBoundsRange = repeatBoundsBoundsRange.split("to");
				    var repeatBoundsBoundsRangeLow = arrRepeatBoundsBoundsRange[0];
				    var repeatBoundsBoundsRangeHigh = arrRepeatBoundsBoundsRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Timing repeat bounds bounds range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'repeat bounds bounds range' in json Timing request.";
			}

			if (typeof req.body.timing.repeat.bounds.boundsPeriod !== 'undefined') {
			  var repeatBoundsBoundsPeriod = req.body.timing.repeat.bounds.boundsPeriod;
 				if(validator.isEmpty(repeatBoundsBoundsPeriod)) {
				  var repeatBoundsBoundsPeriodStart = "";
				  var repeatBoundsBoundsPeriodEnd = "";
				} else {
				  if (repeatBoundsBoundsPeriod.indexOf("to") > 0) {
				    arrRepeatBoundsBoundsPeriod = repeatBoundsBoundsPeriod.split("to");
				    var repeatBoundsBoundsPeriodStart = arrRepeatBoundsBoundsPeriod[0];
				    var repeatBoundsBoundsPeriodEnd = arrRepeatBoundsBoundsPeriod[1];
				    if (!regex.test(repeatBoundsBoundsPeriodStart) && !regex.test(repeatBoundsBoundsPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Timing repeat bounds bounds period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Timing repeat bounds bounds period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'repeat bounds bounds period' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.count !== 'undefined'){
				var repeatCount =  req.body.timing.repeat.count.trim();
				if(validator.isEmpty(repeatCount)){
					repeatCount = "";
				}else{
					if(!validator.isInt(repeatCount)){
						err_code = 2;
						err_msg = "Timing repeat count is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat count' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.countMax !== 'undefined'){
				var repeatCountMax =  req.body.timing.repeat.countMax.trim();
				if(validator.isEmpty(repeatCountMax)){
					repeatCountMax = "";
				}else{
					if(!validator.isInt(repeatCountMax)){
						err_code = 2;
						err_msg = "Timing repeat count max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat count max' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.duration !== 'undefined'){
				var repeatDuration =  req.body.timing.repeat.duration.trim();
				if(validator.isEmpty(repeatDuration)){
					repeatDuration = "";
				}else{
					if(!validator.isInt(repeatDuration)){
						err_code = 2;
						err_msg = "Timing repeat duration is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat duration' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.durationMax !== 'undefined'){
				var repeatDurationMax =  req.body.timing.repeat.durationMax.trim();
				if(validator.isEmpty(repeatDurationMax)){
					repeatDurationMax = "";
				}else{
					if(!validator.isInt(repeatDurationMax)){
						err_code = 2;
						err_msg = "Timing repeat duration max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat duration max' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.durationUnit !== 'undefined'){
				var repeatDurationUnit =  req.body.timing.repeat.durationUnit.trim().toLowerCase();
				if(validator.isEmpty(repeatDurationUnit)){
					repeatDurationUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat duration unit' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.frequency !== 'undefined'){
				var repeatFrequency =  req.body.timing.repeat.frequency.trim();
				if(validator.isEmpty(repeatFrequency)){
					repeatFrequency = "";
				}else{
					if(!validator.isInt(repeatFrequency)){
						err_code = 2;
						err_msg = "Timing repeat frequency is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat frequency' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.frequencyMax !== 'undefined'){
				var repeatFrequencyMax =  req.body.timing.repeat.frequencyMax.trim();
				if(validator.isEmpty(repeatFrequencyMax)){
					repeatFrequencyMax = "";
				}else{
					if(!validator.isInt(repeatFrequencyMax)){
						err_code = 2;
						err_msg = "Timing repeat frequency max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat frequency max' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.period !== 'undefined'){
				var repeatPeriod =  req.body.timing.repeat.period.trim();
				if(validator.isEmpty(repeatPeriod)){
					repeatPeriod = "";
				}else{
					if(!validator.isInt(repeatPeriod)){
						err_code = 2;
						err_msg = "Timing repeat period is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat period' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.periodMax !== 'undefined'){
				var repeatPeriodMax =  req.body.timing.repeat.periodMax.trim();
				if(validator.isEmpty(repeatPeriodMax)){
					repeatPeriodMax = "";
				}else{
					if(!validator.isInt(repeatPeriodMax)){
						err_code = 2;
						err_msg = "Timing repeat period max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat period max' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.periodUnit !== 'undefined'){
				var repeatPeriodUnit =  req.body.timing.repeat.periodUnit.trim().toLowerCase();
				if(validator.isEmpty(repeatPeriodUnit)){
					repeatPeriodUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat period unit' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.dayOfWeek !== 'undefined'){
				var repeatDayOfWeek =  req.body.timing.repeat.dayOfWeek.trim().toLowerCase();
				if(validator.isEmpty(repeatDayOfWeek)){
					repeatDayOfWeek = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat day of week' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.timeOfDay !== 'undefined'){
				var repeatTimeOfDay =  req.body.timing.repeat.timeOfDay.trim();
				if(validator.isEmpty(repeatTimeOfDay)){
					repeatTimeOfDay = "";
				}else{
					if(!validator.isInt(repeatTimeOfDay)){
						err_code = 2;
						err_msg = "Timing repeat time of day is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat time of day' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.when !== 'undefined'){
				var repeatWhen =  req.body.timing.repeat.when.trim().toUpperCase();
				if(validator.isEmpty(repeatWhen)){
					repeatWhen = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat when' in json Timing request.";
			}

			if(typeof req.body.timing.repeat.offset !== 'undefined'){
				var repeatOffset =  req.body.timing.repeat.offset.trim();
				if(validator.isEmpty(repeatOffset)){
					repeatOffset = "";
				}else{
					if(!validator.isInt(repeatOffset)){
						err_code = 2;
						err_msg = "Timing repeat offset is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'repeat offset' in json Timing request.";
			}

			if(typeof req.body.timing.code !== 'undefined'){
				var code =  req.body.timing.code.trim().toUpperCase();
				if(validator.isEmpty(code)){
					code = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Timing request.";
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
					err_msg = "Dosage as needed as needed boolean is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'as needed as needed boolean' in json Dosage request.";
			}

			if(typeof req.body.asNeeded.asNeededCodeableConcept !== 'undefined'){
				var asNeededAsNeededCodeableConcept =  req.body.asNeeded.asNeededCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(asNeededAsNeededCodeableConcept)){
					asNeededAsNeededCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'as needed as needed codeable concept' in json Dosage request.";
			}

			if(typeof req.body.site !== 'undefined'){
				var site =  req.body.site.trim().toLowerCase();
				if(validator.isEmpty(site)){
					site = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'site' in json Dosage request.";
			}

			if(typeof req.body.route !== 'undefined'){
				var route =  req.body.route.trim().toLowerCase();
				if(validator.isEmpty(route)){
					route = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'route' in json Dosage request.";
			}

			if(typeof req.body.method !== 'undefined'){
				var method =  req.body.method.trim().toLowerCase();
				if(validator.isEmpty(method)){
					method = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'method' in json Dosage request.";
			}

			if (typeof req.body.dose.doseRange !== 'undefined') {
			  var doseDoseRange = req.body.dose.doseRange;
 				if(validator.isEmpty(doseDoseRange)){
				  var doseDoseRangeLow = "";
				  var doseDoseRangeHigh = "";
				} else {
				  if (doseDoseRange.indexOf("to") > 0) {
				    arrDoseDoseRange = doseDoseRange.split("to");
				    var doseDoseRangeLow = arrDoseDoseRange[0];
				    var doseDoseRangeHigh = arrDoseDoseRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Dosage dose dose range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'dose dose range' in json Dosage request.";
			}

			if(typeof req.body.dose.doseQuantity !== 'undefined'){
				var doseDoseQuantity =  req.body.dose.doseQuantity.trim().toLowerCase();
				if(validator.isEmpty(doseDoseQuantity)){
					doseDoseQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose dose quantity' in json Dosage request.";
			}

			if (typeof req.body.maxDosePerPeriod !== 'undefined') {
			  var maxDosePerPeriod = req.body.maxDosePerPeriod;
 				if(validator.isEmpty(maxDosePerPeriod)){
				  var maxDosePerPeriodNumerator = "";
				  var maxDosePerPeriodDenominator = "";
				} else {
				  if (maxDosePerPeriod.indexOf("to") > 0) {
				    arrMaxDosePerPeriod = maxDosePerPeriod.split("to");
				    var maxDosePerPeriodNumerator = arrMaxDosePerPeriod[0];
				    var maxDosePerPeriodDenominator = arrMaxDosePerPeriod[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Dosage max dose per period invalid ratio format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'max dose per period' in json Dosage request.";
			}

			if(typeof req.body.maxDosePerAdministration !== 'undefined'){
				var maxDosePerAdministration =  req.body.maxDosePerAdministration.trim().toLowerCase();
				if(validator.isEmpty(maxDosePerAdministration)){
					maxDosePerAdministration = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'max dose per administration' in json Dosage request.";
			}

			if(typeof req.body.maxDosePerLifetime !== 'undefined'){
				var maxDosePerLifetime =  req.body.maxDosePerLifetime.trim().toLowerCase();
				if(validator.isEmpty(maxDosePerLifetime)){
					maxDosePerLifetime = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'max dose per lifetime' in json Dosage request.";
			}

			if (typeof req.body.rate.rateRatio !== 'undefined') {
			  var rateRateRatio = req.body.rate.rateRatio;
 				if(validator.isEmpty(rateRateRatio)){
				  var rateRateRatioNumerator = "";
				  var rateRateRatioDenominator = "";
				} else {
				  if (rateRateRatio.indexOf("to") > 0) {
				    arrRateRateRatio = rateRateRatio.split("to");
				    var rateRateRatioNumerator = arrRateRateRatio[0];
				    var rateRateRatioDenominator = arrRateRateRatio[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Dosage rate rate ratio invalid ratio format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'rate rate ratio' in json Dosage request.";
			}

			if (typeof req.body.rate.rateRange !== 'undefined') {
			  var rateRateRange = req.body.rate.rateRange;
 				if(validator.isEmpty(rateRateRange)){
				  var rateRateRangeLow = "";
				  var rateRateRangeHigh = "";
				} else {
				  if (rateRateRange.indexOf("to") > 0) {
				    arrRateRateRange = rateRateRange.split("to");
				    var rateRateRangeLow = arrRateRateRange[0];
				    var rateRateRangeHigh = arrRateRateRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Dosage rate rate range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'rate rate range' in json Dosage request.";
			}

			if(typeof req.body.rate.rateQuantity !== 'undefined'){
				var rateRateQuantity =  req.body.rate.rateQuantity.trim();
				if(validator.isEmpty(rateRateQuantity)){
					rateRateQuantity = "";
				}else{
					if(!validator.isInt(rateRateQuantity)){
						err_code = 2;
						err_msg = "Dosage rate rate quantity is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'rate rate quantity' in json Dosage request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						myEmitter.prependOnceListener('checkMedicationRequestId', function() {
							checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + medicationRequestId, 'MEDICATION_REQUEST', function(resMedicationRequestID){
								if(resMedicationRequestID.err_code > 0){
									//set uniqe id
									var unicId = uniqid.time();
									var dosageId = 'dos' + unicId;
									var timingId = 'tim' + unicId;

									dataDosage = {
										"dosage_id" : dosageId,
										"sequence" : sequence,
										"text" : text,
										"additional_instruction" : additionalInstruction,
										"patient_instruction" : patientInstruction,
										"timing_id" : timingId,
										"as_needed_boolean" : asNeededAsNeededBoolean,
										"as_needed_codeable_concept" : asNeededAsNeededCodeableConcept,
										"site" : site,
										"route" : route,
										"method" : method,
										"dose_range_low" : doseDoseRangeLow,
										"dose_range_high" : doseDoseRangeHigh,
										"dose_quantity" : doseDoseQuantity,
										"max_dose_per_period_numerator" : maxDosePerPeriodNumerator,
										"max_dose_per_period_denominator" : maxDosePerPeriodDenominator,
										"max_dose_per_administration" : maxDosePerAdministration,
										"max_dose_per_lifetime" : maxDosePerLifetime,
										"rate_ratio_numerator" : rateRateRatioNumerator,
										"rate_ratio_denominator" : rateRateRatioDenominator,
										"rate_range_low" : rateRateRangeLow,
										"rate_range_high" : rateRateRangeHigh,
										"rate_quantity" : rateRateQuantity,
										"medication_request_id" : medicationRequestId
									}
									console.log(dataDosage);
									ApiFHIR.post('dosage', {"apikey": apikey}, {body: dataDosage, json: true}, function(error, response, body){
										dosage = body;
										console.log(dosage);
										if(dosage.err_code > 0){
											res.json(dosage);	
											console.log("ok");
										}
									});

									dataTiming = {
										"timing_id" : timingId,
										"event" : event,
										"repeat_bounds_duration" : repeatBoundsBoundsDuration,
										"repeat_bounds_range_low" : repeatBoundsBoundsRangeLow,
										"repeat_bounds_range_high" : repeatBoundsBoundsRangeHigh,
										"repeat_bounds_period_start" : repeatBoundsBoundsPeriodStart,
										"repeat_bounds_period_end" : repeatBoundsBoundsPeriodEnd,
										"count" : repeatCount,
										"count_max" : repeatCountMax,
										"duration" : repeatDuration,
										"duration_max" : repeatDurationMax,
										"duration_unit" : repeatDurationUnit,
										"frequency" : repeatFrequency,
										"frequency_max" : repeatFrequencyMax,
										"period" : repeatPeriod,
										"period_max" : repeatPeriodMax,
										"period_unit" : repeatPeriodUnit,
										"day_of_week" : repeatDayOfWeek,
										"time_of_day" : repeatTimeOfDay,
										"when" : repeatWhen,
										"offset" : repeatOffset,
										"code" : code,
										"dosage_id": dosageId
									}
									console.log(dataTiming);
									ApiFHIR.post('timing', {"apikey": apikey}, {body: dataTiming, json: true}, function(error, response, body){
										timing = body;
										console.log(timing);
										if(timing.err_code > 0){
											res.json(timing);	
											console.log("ok");
										}
									});

									res.json({"err_code": 0, "err_msg": "Medication Request dosage has been add.", "data": [{"_id": dosageId}]});
								}else{
									res.json({"err_code": 503, "err_msg": "Medication Request Id not found"});		
								}
							})
						});
						
						myEmitter.prependOnceListener('checkAdditionalInstruction', function () {
							if (!validator.isEmpty(additionalInstruction)) {
								checkCode(apikey, additionalInstruction, 'ADDITIONAL_INSTRUCTION_CODES', function (resAdditionalInstructionCode) {
									if (resAdditionalInstructionCode.err_code > 0) {
										myEmitter.emit('checkIdentifierValue');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Additional instruction code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkIdentifierValue');
							}
						})

						myEmitter.prependOnceListener('checkAsNeededAsNeededCodeableConcept', function () {
							if (!validator.isEmpty(asNeededAsNeededCodeableConcept)) {
								checkCode(apikey, asNeededAsNeededCodeableConcept, 'MEDICATION_AS_NEEDED_REASON', function (resAsNeededAsNeededCodeableConceptCode) {
									if (resAsNeededAsNeededCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkAdditionalInstruction');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "As needed as needed codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAdditionalInstruction');
							}
						})

						myEmitter.prependOnceListener('checkSite', function () {
							if (!validator.isEmpty(site)) {
								checkCode(apikey, site, 'APPROACH_SITE_CODES', function (resSiteCode) {
									if (resSiteCode.err_code > 0) {
										myEmitter.emit('checkAsNeededAsNeededCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Site code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAsNeededAsNeededCodeableConcept');
							}
						})

						myEmitter.prependOnceListener('checkRoute', function () {
							if (!validator.isEmpty(route)) {
								checkCode(apikey, route, 'ROUTE_CODES', function (resRouteCode) {
									if (resRouteCode.err_code > 0) {
										myEmitter.emit('checkSite');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Route code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSite');
							}
						})

						myEmitter.prependOnceListener('checkMethod', function () {
							if (!validator.isEmpty(method)) {
								checkCode(apikey, method, 'ADMINISTRATION_METHOD_CODES', function (resMethodCode) {
									if (resMethodCode.err_code > 0) {
										myEmitter.emit('checkRoute');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Method code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRoute');
							}
						})
						
						myEmitter.prependOnceListener('checkRepeatDurationUnit', function () {
							if (!validator.isEmpty(repeatDurationUnit)) {
								checkCode(apikey, repeatDurationUnit, 'UNITS_OF_TIME', function (resRepeatDurationUnitCode) {
									if (resRepeatDurationUnitCode.err_code > 0) {
										myEmitter.emit('checkMedicationRequestId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat duration unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationRequestId');
							}
						})

						myEmitter.prependOnceListener('checkRepeatPeriodUnit', function () {
							if (!validator.isEmpty(repeatPeriodUnit)) {
								checkCode(apikey, repeatPeriodUnit, 'UNITS_OF_TIME', function (resRepeatPeriodUnitCode) {
									if (resRepeatPeriodUnitCode.err_code > 0) {
										myEmitter.emit('checkRepeatDurationUnit');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat period unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRepeatDurationUnit');
							}
						})

						myEmitter.prependOnceListener('checkRepeatDayOfWeek', function () {
							if (!validator.isEmpty(repeatDayOfWeek)) {
								checkCode(apikey, repeatDayOfWeek, 'DAYS_OF_WEEK', function (resRepeatDayOfWeekCode) {
									if (resRepeatDayOfWeekCode.err_code > 0) {
										myEmitter.emit('checkRepeatPeriodUnit');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat day of week code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRepeatPeriodUnit');
							}
						})

						myEmitter.prependOnceListener('checkRepeatWhen', function () {
							if (!validator.isEmpty(repeatWhen)) {
								checkCode(apikey, repeatWhen, 'EVENT_TIMING', function (resRepeatWhenCode) {
									if (resRepeatWhenCode.err_code > 0) {
										myEmitter.emit('checkRepeatDayOfWeek');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat when code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRepeatDayOfWeek');
							}
						})

						if (!validator.isEmpty(code)) {
							checkCode(apikey, code, 'TIMING_ABBREVIATION', function (resCodeCode) {
								if (resCodeCode.err_code > 0) {
									myEmitter.emit('checkRepeatWhen');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Code Timing code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRepeatWhen');
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
		medicationRequest : function putMedicationRequest(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var medicationRequestId = req.params.medication_request_id;

      var err_code = 0;
      var err_msg = "";
      var dataMedicationRequest = {};

			if(typeof medicationRequestId !== 'undefined'){
				if(validator.isEmpty(medicationRequestId)){
					err_code = 2;
					err_msg = "Medication Request id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Request id is required";
			}
			
			/*
			var based_on = req.body.based_on;
			var group_identifier = req.body.group_identifier;
			var status = req.body.status;
			var intent = req.body.intent;
			var category = req.body.category;
			var priority = req.body.priority;
			var medication_codeable_concept = req.body.medication_codeable_concept;
			var medication_reference = req.body.medication_reference;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var supporting_information = req.body.supporting_information;
			var authored_on = req.body.authored_on;
			var recorder = req.body.recorder;
			var reason_code = req.body.reason_code;
			var prior_prescription = req.body.prior_prescription;
			var agent_practitioner = req.body.agent_practitioner;
			var agent_organization = req.body.agent_organization;
			var agent_patient = req.body.agent_patient;
			var agent_related_person = req.body.agent_related_person;
			var agent_device = req.body.agent_device;
			var on_behalf_of = req.body.on_behalf_of;
			var allowed = req.body.allowed;
			var reason = req.body.reason;
			var validity_period_start = req.body.validity_period_start;
			var validity_period_end = req.body.validity_period_end;
			var number_of_repeats_allowed = req.body.number_of_repeats_allowed;
			var quantity = req.body.quantity;
			var expected_supply_duration = req.body.expected_supply_duration;
			var performer = req.body.performer;
			*/
			
			/*
			if(typeof req.body.definition.activityDefinition !== 'undefined' && req.body.definition.activityDefinition !== ""){
				var definitionActivityDefinition =  req.body.definition.activityDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionActivityDefinition)){
					dataMedicationRequest.activity_definition = "";
				}else{
					dataMedicationRequest.activity_definition = definitionActivityDefinition;
				}
			}else{
			  definitionActivityDefinition = "";
			}

			if(typeof req.body.definition.planDefinition !== 'undefined' && req.body.definition.planDefinition !== ""){
				var definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					dataMedicationRequest.plan_definition = "";
				}else{
					dataMedicationRequest.plan_definition = definitionPlanDefinition;
				}
			}else{
			  definitionPlanDefinition = "";
			}
*/
			
			/*if(typeof req.body.basedOn.carePlan !== 'undefined' && req.body.basedOn.carePlan !== ""){
				var basedOnCarePlan =  req.body.basedOn.carePlan.trim().toLowerCase();
				if(validator.isEmpty(basedOnCarePlan)){
					dataMedicationRequest.care_plan = "";
				}else{
					dataMedicationRequest.care_plan = basedOnCarePlan;
				}
			}else{
			  basedOnCarePlan = "";
			}*/

			if(typeof req.body.basedOn.medicationRequest !== 'undefined' && req.body.basedOn.medicationRequest !== ""){
				var basedOnMedicationRequest =  req.body.basedOn.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnMedicationRequest)){
					dataMedicationRequest.based_on = "";
				}else{
					dataMedicationRequest.based_on = basedOnMedicationRequest;
				}
			}else{
			  basedOnMedicationRequest = "";
			}

			/*if(typeof req.body.basedOn.procedureRequest !== 'undefined' && req.body.basedOn.procedureRequest !== ""){
				var basedOnProcedureRequest =  req.body.basedOn.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnProcedureRequest)){
					dataMedicationRequest.procedure_request = "";
				}else{
					dataMedicationRequest.procedure_request = basedOnProcedureRequest;
				}
			}else{
			  basedOnProcedureRequest = "";
			}

			if(typeof req.body.basedOn.referralRequest !== 'undefined' && req.body.basedOn.referralRequest !== ""){
				var basedOnReferralRequest =  req.body.basedOn.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnReferralRequest)){
					dataMedicationRequest.referral_request = "";
				}else{
					dataMedicationRequest.referral_request = basedOnReferralRequest;
				}
			}else{
			  basedOnReferralRequest = "";
			}
*/
			
			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					dataMedicationRequest.status = "";
				}else{
					dataMedicationRequest.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.intent !== 'undefined' && req.body.intent !== ""){
				var intent =  req.body.intent.trim().toLowerCase();
				if(validator.isEmpty(intent)){
					err_code = 2;
					err_msg = "medication request intent is required.";
				}else{
					dataMedicationRequest.intent = intent;
				}
			}else{
			  intent = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					dataMedicationRequest.category = "";
				}else{
					dataMedicationRequest.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.priority !== 'undefined' && req.body.priority !== ""){
				var priority =  req.body.priority.trim().toLowerCase();
				if(validator.isEmpty(priority)){
					dataMedicationRequest.priority = "";
				}else{
					dataMedicationRequest.priority = priority;
				}
			}else{
			  priority = "";
			}

			if(typeof req.body.medication.medicationCodeableConcept !== 'undefined' && req.body.medication.medicationCodeableConcept !== ""){
				var medicationMedicationCodeableConcept =  req.body.medication.medicationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationCodeableConcept)){
					err_code = 2;
					err_msg = "medication request medication medication codeable concept is required.";
				}else{
					dataMedicationRequest.medication_codeable_concept = medicationMedicationCodeableConcept;
				}
			}else{
			  medicationMedicationCodeableConcept = "";
			}

			if(typeof req.body.medication.medicationReference !== 'undefined' && req.body.medication.medicationReference !== ""){
				var medicationMedicationReference =  req.body.medication.medicationReference.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationReference)){
					dataMedicationRequest.medication_reference = "";
				}else{
					dataMedicationRequest.medication_reference = medicationMedicationReference;
				}
			}else{
			  medicationMedicationReference = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataMedicationRequest.subject_patient = "";
				}else{
					dataMedicationRequest.subject_patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataMedicationRequest.subject_group = "";
				}else{
					dataMedicationRequest.subject_group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					dataMedicationRequest.context_encounter = "";
				}else{
					dataMedicationRequest.context_encounter = contextEncounter;
				}
			}else{
			  contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					dataMedicationRequest.context_episode_of_care = "";
				}else{
					dataMedicationRequest.context_episode_of_care = contextEpisodeOfCare;
				}
			}else{
			  contextEpisodeOfCare = "";
			}

			if(typeof req.body.supportingInformation !== 'undefined' && req.body.supportingInformation !== ""){
				var supportingInformation =  req.body.supportingInformation.trim().toLowerCase();
				if(validator.isEmpty(supportingInformation)){
					dataMedicationRequest.supporting_information = "";
				}else{
					dataMedicationRequest.supporting_information = supportingInformation;
				}
			}else{
			  supportingInformation = "";
			}

			if(typeof req.body.authoredOn !== 'undefined' && req.body.authoredOn !== ""){
				var authoredOn =  req.body.authoredOn;
				if(validator.isEmpty(authoredOn)){
					err_code = 2;
					err_msg = "medication request authored on is required.";
				}else{
					if(!regex.test(authoredOn)){
						err_code = 2;
						err_msg = "medication request authored on invalid date format.";	
					}else{
						dataMedicationRequest.authored_on = authoredOn;
					}
				}
			}else{
			  authoredOn = "";
			}

			if(typeof req.body.requester.agent.practitioner !== 'undefined' && req.body.requester.agent.practitioner !== ""){
				var requesterPractitioner =  req.body.requester.agent.practitioner.trim().toLowerCase();
				if(validator.isEmpty(requesterPractitioner)){
					dataMedicationRequest.agent_practitioner = "";
				}else{
					dataMedicationRequest.agent_practitioner = requesterPractitioner;
				}
			}else{
			  requesterPractitioner = "";
			}

			if(typeof req.body.requester.agent.organization !== 'undefined' && req.body.requester.agent.organization !== ""){
				var requesterOrganization =  req.body.requester.agent.organization.trim().toLowerCase();
				if(validator.isEmpty(requesterOrganization)){
					dataMedicationRequest.agent_organization = "";
				}else{
					dataMedicationRequest.agent_organization = requesterOrganization;
				}
			}else{
			  requesterOrganization = "";
			}

			if(typeof req.body.requester.agent.patient !== 'undefined' && req.body.requester.agent.patient !== ""){
				var requesterPatient =  req.body.requester.agent.patient.trim().toLowerCase();
				if(validator.isEmpty(requesterPatient)){
					dataMedicationRequest.agent_patient = "";
				}else{
					dataMedicationRequest.agent_patient = requesterPatient;
				}
			}else{
			  requesterPatient = "";
			}

			if(typeof req.body.requester.agent.relatedPerson !== 'undefined' && req.body.requester.agent.relatedPerson !== ""){
				var requesterRelatedPerson =  req.body.requester.agent.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(requesterRelatedPerson)){
					dataMedicationRequest.agent_related_person = "";
				}else{
					dataMedicationRequest.agent_related_person = requesterRelatedPerson;
				}
			}else{
			  requesterRelatedPerson = "";
			}

			if(typeof req.body.requester.agent.device !== 'undefined' && req.body.requester.agent.device !== ""){
				var requesterDevice =  req.body.requester.agent.device.trim().toLowerCase();
				if(validator.isEmpty(requesterDevice)){
					dataMedicationRequest.agent_device = "";
				}else{
					dataMedicationRequest.agent_device = requesterDevice;
				}
			}else{
			  requesterDevice = "";
			}

			if(typeof req.body.requester.onBehalfOf !== 'undefined' && req.body.requester.onBehalfOf !== ""){
				var requesterOnBehalfOf =  req.body.requester.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(requesterOnBehalfOf)){
					dataMedicationRequest.on_behalf_of = "";
				}else{
					dataMedicationRequest.on_behalf_of = requesterOnBehalfOf;
				}
			}else{
			  requesterOnBehalfOf = "";
			}

			if(typeof req.body.recorder !== 'undefined' && req.body.recorder !== ""){
				var recorder =  req.body.recorder.trim().toLowerCase();
				if(validator.isEmpty(recorder)){
					dataMedicationRequest.recorder = "";
				}else{
					dataMedicationRequest.recorder = recorder;
				}
			}else{
			  recorder = "";
			}

			if(typeof req.body.reasonCode !== 'undefined' && req.body.reasonCode !== ""){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					dataMedicationRequest.reason_code = "";
				}else{
					dataMedicationRequest.reason_code = reasonCode;
				}
			}else{
			  reasonCode = "";
			}

			/*if(typeof req.body.reasonReference.condition !== 'undefined' && req.body.reasonReference.condition !== ""){
				var reasonReferenceCondition =  req.body.reasonReference.condition.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceCondition)){
					dataMedicationRequest.condition = "";
				}else{
					dataMedicationRequest.condition = reasonReferenceCondition;
				}
			}else{
			  reasonReferenceCondition = "";
			}

			if(typeof req.body.reasonReference.observation !== 'undefined' && req.body.reasonReference.observation !== ""){
				var reasonReferenceObservation =  req.body.reasonReference.observation.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceObservation)){
					dataMedicationRequest.observation = "";
				}else{
					dataMedicationRequest.observation = reasonReferenceObservation;
				}
			}else{
			  reasonReferenceObservation = "";
			}*/

			/*if(typeof req.body.note.author.authorReference.practitioner !== 'undefined' && req.body.note.author.authorReference.practitioner !== ""){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					dataMedicationRequest.practitioner = "";
				}else{
					dataMedicationRequest.practitioner = noteAuthorPractitioner;
				}
			}else{
			  noteAuthorPractitioner = "";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined' && req.body.note.author.authorReference.patient !== ""){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					dataMedicationRequest.patient = "";
				}else{
					dataMedicationRequest.patient = noteAuthorPatient;
				}
			}else{
			  noteAuthorPatient = "";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined' && req.body.note.author.authorReference.relatedPerson !== ""){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					dataMedicationRequest.related_person = "";
				}else{
					dataMedicationRequest.related_person = noteAuthorRelatedPerson;
				}
			}else{
			  noteAuthorRelatedPerson = "";
			}

			if(typeof req.body.note.author.authorString !== 'undefined' && req.body.note.author.authorString !== ""){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					dataMedicationRequest.author_string = "";
				}else{
					dataMedicationRequest.author_string = noteAuthorAuthorString;
				}
			}else{
			  noteAuthorAuthorString = "";
			}

			if(typeof req.body.note.time !== 'undefined' && req.body.note.time !== ""){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					err_code = 2;
					err_msg = "medication request note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "medication request note time invalid date format.";	
					}else{
						dataMedicationRequest.time = noteTime;
					}
				}
			}else{
			  noteTime = "";
			}

			if(typeof req.body.note.text !== 'undefined' && req.body.note.text !== ""){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					dataMedicationRequest.text = "";
				}else{
					dataMedicationRequest.text = noteText;
				}
			}else{
			  noteText = "";
			}*/

			if (typeof req.body.dispenseRequest.validityPeriod !== 'undefined' && req.body.dispenseRequest.validityPeriod !== "") {
			  var dispenseRequestValidityPeriod = req.body.dispenseRequest.validityPeriod;
			  if (dispenseRequestValidityPeriod.indexOf("to") > 0) {
			    arrDispenseRequestValidityPeriod = dispenseRequestValidityPeriod.split("to");
			    dataMedicationRequest.validity_period_start = arrDispenseRequestValidityPeriod[0];
			    dataMedicationRequest.validity_period_end = arrDispenseRequestValidityPeriod[1];
			    if (!regex.test(dispenseRequestValidityPeriodStart) && !regex.test(dispenseRequestValidityPeriodEnd)) {
			      err_code = 2;
			      err_msg = "medication request dispense request validity period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "medication request dispense request validity period invalid date format.";
				}
			} else {
			  dispenseRequestValidityPeriod = "";
			}

			if(typeof req.body.dispenseRequest.numberOfRepeatsAllowed !== 'undefined' && req.body.dispenseRequest.numberOfRepeatsAllowed !== ""){
				var dispenseRequestNumberOfRepeatsAllowed =  req.body.dispenseRequest.numberOfRepeatsAllowed.trim();
				if(validator.isEmpty(dispenseRequestNumberOfRepeatsAllowed)){
					dataMedicationRequest.number_of_repeats_allowed = "";
				}else{
					if(!validator.isInt(dispenseRequestNumberOfRepeatsAllowed)){
						err_code = 2;
						err_msg = "medication request dispense request number of repeats allowed is must be number.";
					}else{
						dataMedicationRequest.number_of_repeats_allowed = dispenseRequestNumberOfRepeatsAllowed;
					}
				}
			}else{
			  dispenseRequestNumberOfRepeatsAllowed = "";
			}

			if(typeof req.body.dispenseRequest.quantity !== 'undefined' && req.body.dispenseRequest.quantity !== ""){
				var dispenseRequestQuantity =  req.body.dispenseRequest.quantity.trim();
				if(validator.isEmpty(dispenseRequestQuantity)){
					dataMedicationRequest.quantity = "";
				}else{
					if(!validator.isInt(dispenseRequestQuantity)){
						err_code = 2;
						err_msg = "medication request dispense request quantity is must be number.";
					}else{
						dataMedicationRequest.quantity = dispenseRequestQuantity;
					}
				}
			}else{
			  dispenseRequestQuantity = "";
			}

			if(typeof req.body.dispenseRequest.expectedSupplyDuration !== 'undefined' && req.body.dispenseRequest.expectedSupplyDuration !== ""){
				var dispenseRequestExpectedSupplyDuration =  req.body.dispenseRequest.expectedSupplyDuration.trim();
				if(validator.isEmpty(dispenseRequestExpectedSupplyDuration)){
					dataMedicationRequest.expected_supply_duration = "";
				}else{
					if(!validator.isInt(dispenseRequestExpectedSupplyDuration)){
						err_code = 2;
						err_msg = "medication request dispense request expected supply duration is must be number.";
					}else{
						dataMedicationRequest.expected_supply_duration = dispenseRequestExpectedSupplyDuration;
					}
				}
			}else{
			  dispenseRequestExpectedSupplyDuration = "";
			}

			if(typeof req.body.dispenseRequest.performer !== 'undefined' && req.body.dispenseRequest.performer !== ""){
				var dispenseRequestPerformer =  req.body.dispenseRequest.performer.trim().toLowerCase();
				if(validator.isEmpty(dispenseRequestPerformer)){
					dataMedicationRequest.performer = "";
				}else{
					dataMedicationRequest.performer = dispenseRequestPerformer;
				}
			}else{
			  dispenseRequestPerformer = "";
			}

			if (typeof req.body.substitution.allowed !== 'undefined' && req.body.substitution.allowed !== "") {
			  var substitutionAllowed = req.body.substitution.allowed.trim().toLowerCase();
					if(validator.isEmpty(substitutionAllowed)){
						substitutionAllowed = "false";
					}
			  if(substitutionAllowed === "true" || substitutionAllowed === "false"){
					dataMedicationRequest.allowed = substitutionAllowed;
			  } else {
			    err_code = 2;
			    err_msg = "Medication request substitution allowed is must be boolean.";
			  }
			} else {
			  substitutionAllowed = "";
			}

			if(typeof req.body.substitution.reason !== 'undefined' && req.body.substitution.reason !== ""){
				var substitutionReason =  req.body.substitution.reason.trim().toUpperCase();
				if(validator.isEmpty(substitutionReason)){
					dataMedicationRequest.reason = "";
				}else{
					dataMedicationRequest.reason = substitutionReason;
				}
			}else{
			  substitutionReason = "";
			}

			if(typeof req.body.priorPrescription !== 'undefined' && req.body.priorPrescription !== ""){
				var priorPrescription =  req.body.priorPrescription.trim().toLowerCase();
				if(validator.isEmpty(priorPrescription)){
					dataMedicationRequest.prior_prescription = "";
				}else{
					dataMedicationRequest.prior_prescription = priorPrescription;
				}
			}else{
			  priorPrescription = "";
			}

			/*if(typeof req.body.detectedIssue !== 'undefined' && req.body.detectedIssue !== ""){
				var detectedIssue =  req.body.detectedIssue.trim().toLowerCase();
				if(validator.isEmpty(detectedIssue)){
					dataMedicationRequest.detected_issue = "";
				}else{
					dataMedicationRequest.detected_issue = detectedIssue;
				}
			}else{
			  detectedIssue = "";
			}

			if(typeof req.body.eventHistory !== 'undefined' && req.body.eventHistory !== ""){
				var eventHistory =  req.body.eventHistory.trim().toLowerCase();
				if(validator.isEmpty(eventHistory)){
					dataMedicationRequest.event_history = "";
				}else{
					dataMedicationRequest.event_history = eventHistory;
				}
			}else{
			  eventHistory = "";
			}*/


			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						//event emiter
						myEmitter.prependOnceListener('checkMedicationRequestId', function(){
							checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + medicationRequestId, 'MEDICATION_REQUEST', function(resmedicationRequestId){
								if(resmedicationRequestId.err_code > 0){
									//console.log(dataImmunization);
									ApiFHIR.put('medicationRequest', {"apikey": apikey, "_id": medicationRequestId}, {body: dataMedicationRequest, json: true}, function(error, response, body){
										medicationRequest = body;
										if(medicationRequest.err_code > 0){
											res.json(medicationRequest);	
										}else{
											res.json({"err_code": 0, "err_msg": "Medication Request has been update.", "data": [{"_id": medicationRequestId}]});
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Request Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkStatus', function () {
							if (!validator.isEmpty(status)) {
								checkCode(apikey, status, 'MEDICATION_REQUEST_STATUS', function (resStatusCode) {
									if (resStatusCode.err_code > 0) {
										myEmitter.emit('checkMedicationRequestId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationRequestId');
							}
						})

						myEmitter.prependOnceListener('checkIntent', function () {
							if (!validator.isEmpty(intent)) {
								checkCode(apikey, intent, 'MEDICATION_REQUEST_INTENT', function (resIntentCode) {
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

						myEmitter.prependOnceListener('checkCategory', function () {
							if (!validator.isEmpty(category)) {
								checkCode(apikey, category, 'MEDICATION_REQUEST_CATEGORY', function (resCategoryCode) {
									if (resCategoryCode.err_code > 0) {
										myEmitter.emit('checkIntent');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkIntent');
							}
						})

						myEmitter.prependOnceListener('checkPriority', function () {
							if (!validator.isEmpty(priority)) {
								checkCode(apikey, priority, 'MEDICATION_REQUEST_PRIORITY', function (resPriorityCode) {
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
						
						myEmitter.prependOnceListener('checkReasonCode', function () {
							if (!validator.isEmpty(reasonCode)) {
								checkCode(apikey, reasonCode, 'CONDITION_CODE', function (resReasonCodeCode) {
									if (resReasonCodeCode.err_code > 0) {
										myEmitter.emit('checkPriority');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Reason code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPriority');
							}
						})

						myEmitter.prependOnceListener('checkMedicationMedicationCodeableConcept', function () {
							if (!validator.isEmpty(medicationMedicationCodeableConcept)) {
								checkCode(apikey, medicationMedicationCodeableConcept, 'MEDICATION_CODES', function (resMedicationMedicationCodeableConceptCode) {
									if (resMedicationMedicationCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkReasonCode');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Medication medication codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReasonCode');
							}
						})
						
						myEmitter.prependOnceListener('checkBasedOnMedicationRequest', function () {
							if (!validator.isEmpty(basedOnMedicationRequest)) {
								checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + basedOnMedicationRequest, 'MEDICATION_REQUEST', function (resBasedOnMedicationRequest) {
									if (resBasedOnMedicationRequest.err_code > 0) {
										myEmitter.emit('checkMedicationMedicationCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Based on medication request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationMedicationCodeableConcept');
							}
						})
						
						myEmitter.prependOnceListener('checkMedicationMedicationReference', function () {
							if (!validator.isEmpty(medicationMedicationReference)) {
								checkUniqeValue(apikey, "MEDICATION_REFERENCE_ID|" + medicationMedicationReference, 'MEDICATION_REFERENCE', function (resMedicationMedicationReference) {
									if (resMedicationMedicationReference.err_code > 0) {
										myEmitter.emit('checkBasedOnMedicationRequest');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Medication medication reference id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkBasedOnMedicationRequest');
							}
						})

						myEmitter.prependOnceListener('checkSubjectPatient', function () {
							if (!validator.isEmpty(subjectPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
									if (resSubjectPatient.err_code > 0) {
										myEmitter.emit('checkMedicationMedicationReference');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Subject patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationMedicationReference');
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
						
						myEmitter.prependOnceListener('checkRecorder', function () {
							if (!validator.isEmpty(recorder)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + recorder, 'PRACTITIONER', function (resRecorder) {
									if (resRecorder.err_code > 0) {
										myEmitter.emit('checkContextEpisodeOfCare');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Recorder id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkContextEpisodeOfCare');
							}
						})

						if (!validator.isEmpty(priorPrescription)) {
							checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + priorPrescription, 'MEDICATION_REQUEST', function (resPriorPrescription) {
								if (resPriorPrescription.err_code > 0) {
									myEmitter.emit('checkRecorder');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Prior prescription id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRecorder');
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
			var medicationRequestId = req.params.medication_request_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof medicationRequestId !== 'undefined'){
				if(validator.isEmpty(medicationRequestId)){
					err_code = 2;
					err_msg = "Medication Request id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Request id is required";
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
						myEmitter.prependOnceListener('checkMedication RequestID', function(){
							checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + medicationRequestId, 'MEDICATION_REQUEST', function(resMedicationRequestID){
								if(resMedicationRequestID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "MEDICATION_REQUEST_ID|"+medicationRequestId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Medication Request.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Request Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkMedication RequestID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkMedication RequestID');				
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
		timing : function putTiming(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var timingId = req.params.timing_id;
			var medicationRequestId = req.params.medication_request_id;
			var dosageId = req.params.dosage_id;

			var err_code = 0;
			var err_msg = "";
			var dataTiming = {};
			//input check 
			if(typeof medicationRequestId !== 'undefined'){
				if(validator.isEmpty(medicationRequestId)){
					err_code = 2;
					err_msg = "Medication Request id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Request id is required";
			}
			
			if(typeof dosageId !== 'undefined'){
				if(validator.isEmpty(dosageId)){
					err_code = 2;
					err_msg = "Medication Request Dosage id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Request Dosage id is required";
			}
			
			if(typeof timingId !== 'undefined'){
				if(validator.isEmpty(timingId)){
					err_code = 2;
					err_msg = "Timing id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Timing id is required";
			}

			if(typeof req.body.event !== 'undefined' && req.body.event !== ""){
				var event =  req.body.event;
				if(validator.isEmpty(event)){
					err_code = 2;
					err_msg = "timing event is required.";
				}else{
					if(!regex.test(event)){
						err_code = 2;
						err_msg = "timing event invalid date format.";	
					}else{
						dataTiming.event = event;
					}
				}
			}else{
			  event = "";
			}

			if(typeof req.body.repeat.bounds.boundsDuration !== 'undefined' && req.body.repeat.bounds.boundsDuration !== ""){
				var repeatBoundsBoundsDuration =  req.body.repeat.bounds.boundsDuration.trim();
				if(validator.isEmpty(repeatBoundsBoundsDuration)){
					dataTiming.repeat_bounds_duration = "";
				}else{
					if(!validator.isInt(repeatBoundsBoundsDuration)){
						err_code = 2;
						err_msg = "timing repeat bounds bounds duration is must be number.";
					}else{
						dataTiming.repeat_bounds_duration = repeatBoundsBoundsDuration;
					}
				}
			}else{
			  repeatBoundsBoundsDuration = "";
			}

			if (typeof req.body.repeat.bounds.boundsRange !== 'undefined' && req.body.repeat.bounds.boundsRange !== "") {
			  var repeatBoundsBoundsRange = req.body.repeat.bounds.boundsRange;
			  if (repeatBoundsBoundsRange.indexOf("to") > 0) {
			    arrRepeatBoundsBoundsRange = repeatBoundsBoundsRange.split("to");
			    dataTiming.repeat_bounds_range_low = arrRepeatBoundsBoundsRange[0];
			    dataTiming.repeat_bounds_range_high = arrRepeatBoundsBoundsRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "timing repeat bounds bounds range invalid range format.";
				}
			} else {
			  repeatBoundsBoundsRange = "";
			}

			if (typeof req.body.repeat.bounds.boundsPeriod !== 'undefined' && req.body.repeat.bounds.boundsPeriod !== "") {
			  var repeatBoundsBoundsPeriod = req.body.repeat.bounds.boundsPeriod;
			  if (repeatBoundsBoundsPeriod.indexOf("to") > 0) {
			    arrRepeatBoundsBoundsPeriod = repeatBoundsBoundsPeriod.split("to");
			    dataTiming.repeat_bounds_period_start = arrRepeatBoundsBoundsPeriod[0];
			    dataTiming.repeat_bounds_period_end = arrRepeatBoundsBoundsPeriod[1];
			    if (!regex.test(repeatBoundsBoundsPeriodStart) && !regex.test(repeatBoundsBoundsPeriodEnd)) {
			      err_code = 2;
			      err_msg = "timing repeat bounds bounds period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "timing repeat bounds bounds period invalid date format.";
				}
			} else {
			  repeatBoundsBoundsPeriod = "";
			}

			if(typeof req.body.repeat.count !== 'undefined' && req.body.repeat.count !== ""){
				var repeatCount =  req.body.repeat.count.trim();
				if(validator.isEmpty(repeatCount)){
					dataTiming.count = "";
				}else{
					if(!validator.isInt(repeatCount)){
						err_code = 2;
						err_msg = "timing repeat count is must be number.";
					}else{
						dataTiming.count = repeatCount;
					}
				}
			}else{
			  repeatCount = "";
			}

			if(typeof req.body.repeat.countMax !== 'undefined' && req.body.repeat.countMax !== ""){
				var repeatCountMax =  req.body.repeat.countMax.trim();
				if(validator.isEmpty(repeatCountMax)){
					dataTiming.count_max = "";
				}else{
					if(!validator.isInt(repeatCountMax)){
						err_code = 2;
						err_msg = "timing repeat count max is must be number.";
					}else{
						dataTiming.count_max = repeatCountMax;
					}
				}
			}else{
			  repeatCountMax = "";
			}

			if(typeof req.body.repeat.duration !== 'undefined' && req.body.repeat.duration !== ""){
				var repeatDuration =  req.body.repeat.duration.trim();
				if(validator.isEmpty(repeatDuration)){
					dataTiming.duration = "";
				}else{
					if(!validator.isInt(repeatDuration)){
						err_code = 2;
						err_msg = "timing repeat duration is must be number.";
					}else{
						dataTiming.duration = repeatDuration;
					}
				}
			}else{
			  repeatDuration = "";
			}

			if(typeof req.body.repeat.durationMax !== 'undefined' && req.body.repeat.durationMax !== ""){
				var repeatDurationMax =  req.body.repeat.durationMax.trim();
				if(validator.isEmpty(repeatDurationMax)){
					dataTiming.duration_max = "";
				}else{
					if(!validator.isInt(repeatDurationMax)){
						err_code = 2;
						err_msg = "timing repeat duration max is must be number.";
					}else{
						dataTiming.duration_max = repeatDurationMax;
					}
				}
			}else{
			  repeatDurationMax = "";
			}

			if(typeof req.body.repeat.durationUnit !== 'undefined' && req.body.repeat.durationUnit !== ""){
				var repeatDurationUnit =  req.body.repeat.durationUnit.trim().toLowerCase();
				if(validator.isEmpty(repeatDurationUnit)){
					dataTiming.duration_unit = "";
				}else{
					dataTiming.duration_unit = repeatDurationUnit;
				}
			}else{
			  repeatDurationUnit = "";
			}

			if(typeof req.body.repeat.frequency !== 'undefined' && req.body.repeat.frequency !== ""){
				var repeatFrequency =  req.body.repeat.frequency.trim();
				if(validator.isEmpty(repeatFrequency)){
					dataTiming.frequency = "";
				}else{
					if(!validator.isInt(repeatFrequency)){
						err_code = 2;
						err_msg = "timing repeat frequency is must be number.";
					}else{
						dataTiming.frequency = repeatFrequency;
					}
				}
			}else{
			  repeatFrequency = "";
			}

			if(typeof req.body.repeat.frequencyMax !== 'undefined' && req.body.repeat.frequencyMax !== ""){
				var repeatFrequencyMax =  req.body.repeat.frequencyMax.trim();
				if(validator.isEmpty(repeatFrequencyMax)){
					dataTiming.frequency_max = "";
				}else{
					if(!validator.isInt(repeatFrequencyMax)){
						err_code = 2;
						err_msg = "timing repeat frequency max is must be number.";
					}else{
						dataTiming.frequency_max = repeatFrequencyMax;
					}
				}
			}else{
			  repeatFrequencyMax = "";
			}

			if(typeof req.body.repeat.period !== 'undefined' && req.body.repeat.period !== ""){
				var repeatPeriod =  req.body.repeat.period.trim();
				if(validator.isEmpty(repeatPeriod)){
					dataTiming.period = "";
				}else{
					if(!validator.isInt(repeatPeriod)){
						err_code = 2;
						err_msg = "timing repeat period is must be number.";
					}else{
						dataTiming.period = repeatPeriod;
					}
				}
			}else{
			  repeatPeriod = "";
			}

			if(typeof req.body.repeat.periodMax !== 'undefined' && req.body.repeat.periodMax !== ""){
				var repeatPeriodMax =  req.body.repeat.periodMax.trim();
				if(validator.isEmpty(repeatPeriodMax)){
					dataTiming.period_max = "";
				}else{
					if(!validator.isInt(repeatPeriodMax)){
						err_code = 2;
						err_msg = "timing repeat period max is must be number.";
					}else{
						dataTiming.period_max = repeatPeriodMax;
					}
				}
			}else{
			  repeatPeriodMax = "";
			}

			if(typeof req.body.repeat.periodUnit !== 'undefined' && req.body.repeat.periodUnit !== ""){
				var repeatPeriodUnit =  req.body.repeat.periodUnit.trim().toLowerCase();
				if(validator.isEmpty(repeatPeriodUnit)){
					dataTiming.period_unit = "";
				}else{
					dataTiming.period_unit = repeatPeriodUnit;
				}
			}else{
			  repeatPeriodUnit = "";
			}

			if(typeof req.body.repeat.dayOfWeek !== 'undefined' && req.body.repeat.dayOfWeek !== ""){
				var repeatDayOfWeek =  req.body.repeat.dayOfWeek.trim().toLowerCase();
				if(validator.isEmpty(repeatDayOfWeek)){
					dataTiming.day_of_week = "";
				}else{
					dataTiming.day_of_week = repeatDayOfWeek;
				}
			}else{
			  repeatDayOfWeek = "";
			}

			if(typeof req.body.repeat.timeOfDay !== 'undefined' && req.body.repeat.timeOfDay !== ""){
				var repeatTimeOfDay =  req.body.repeat.timeOfDay.trim();
				if(validator.isEmpty(repeatTimeOfDay)){
					dataTiming.time_of_day = "";
				}else{
					if(!validator.isInt(repeatTimeOfDay)){
						err_code = 2;
						err_msg = "timing repeat time of day is must be number.";
					}else{
						dataTiming.time_of_day = repeatTimeOfDay;
					}
				}
			}else{
			  repeatTimeOfDay = "";
			}

			if(typeof req.body.repeat.when !== 'undefined' && req.body.repeat.when !== ""){
				var repeatWhen =  req.body.repeat.when.trim().toUpperCase();
				if(validator.isEmpty(repeatWhen)){
					dataTiming.when = "";
				}else{
					dataTiming.when = repeatWhen;
				}
			}else{
			  repeatWhen = "";
			}

			if(typeof req.body.repeat.offset !== 'undefined' && req.body.repeat.offset !== ""){
				var repeatOffset =  req.body.repeat.offset.trim();
				if(validator.isEmpty(repeatOffset)){
					dataTiming.offset = "";
				}else{
					if(!validator.isInt(repeatOffset)){
						err_code = 2;
						err_msg = "timing repeat offset is must be number.";
					}else{
						dataTiming.offset = repeatOffset;
					}
				}
			}else{
			  repeatOffset = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var code =  req.body.code.trim().toUpperCase();
				if(validator.isEmpty(code)){
					dataTiming.code = "";
				}else{
					dataTiming.code = code;
				}
			}else{
			  code = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						myEmitter.prependOnceListener('checkMedicationRequestId', function () {
							checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + medicationRequestId, 'MEDICATION_REQUEST', function(resMedicationRequestID){
								if(resMedicationRequestID.err_code > 0){
									checkUniqeValue(apikey, "DOSAGE_ID|" + dosageId, 'DOSAGE', function(resMedicationRequestID){
										if(resMedicationRequestID.err_code > 0){
									
											//console.log(dataImmunization);
											ApiFHIR.put('timing', {"apikey": apikey, "_id": timingId,"dr": "DOSAGE_ID|"+dosageId}, {body: dataTiming, json: true}, function(error, response, body){
												timing = body;
												if(timing.err_code > 0){
													res.json(timing);	
												}else{
													res.json({"err_code": 0, "err_msg": "Medication Request Timing has been update.", "data": [{"_id": timingId}]});
												}
											})
										}else{
											res.json({"err_code": 501, "err_msg": "Medication Request Dosage Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 501, "err_msg": "Medication Request Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkRepeatDurationUnit', function () {
							if (!validator.isEmpty(repeatDurationUnit)) {
								checkCode(apikey, repeatDurationUnit, 'UNITS_OF_TIME', function (resRepeatDurationUnitCode) {
									if (resRepeatDurationUnitCode.err_code > 0) {
										myEmitter.emit('checkMedicationRequestId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat duration unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationRequestId');
							}
						})

						myEmitter.prependOnceListener('checkRepeatPeriodUnit', function () {
							if (!validator.isEmpty(repeatPeriodUnit)) {
								checkCode(apikey, repeatPeriodUnit, 'UNITS_OF_TIME', function (resRepeatPeriodUnitCode) {
									if (resRepeatPeriodUnitCode.err_code > 0) {
										myEmitter.emit('checkRepeatDurationUnit');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat period unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRepeatDurationUnit');
							}
						})

						myEmitter.prependOnceListener('checkRepeatDayOfWeek', function () {
							if (!validator.isEmpty(repeatDayOfWeek)) {
								checkCode(apikey, repeatDayOfWeek, 'DAYS_OF_WEEK', function (resRepeatDayOfWeekCode) {
									if (resRepeatDayOfWeekCode.err_code > 0) {
										myEmitter.emit('checkRepeatPeriodUnit');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat day of week code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRepeatPeriodUnit');
							}
						})

						myEmitter.prependOnceListener('checkRepeatWhen', function () {
							if (!validator.isEmpty(repeatWhen)) {
								checkCode(apikey, repeatWhen, 'EVENT_TIMING', function (resRepeatWhenCode) {
									if (resRepeatWhenCode.err_code > 0) {
										myEmitter.emit('checkRepeatDayOfWeek');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Repeat when code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRepeatDayOfWeek');
							}
						})

						if (!validator.isEmpty(code)) {
							checkCode(apikey, code, 'TIMING_ABBREVIATION', function (resCodeCode) {
								if (resCodeCode.err_code > 0) {
									myEmitter.emit('checkRepeatWhen');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Code Timing code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRepeatWhen');
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
		dosage : function putDosage(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var dosageId = req.params.dosage_id;
			var medicationRequestId = req.params.medication_request_id;

			var err_code = 0;
			var err_msg = "";
			var dataDosage = {};
			//input check 
			if(typeof medicationRequestId !== 'undefined'){
				if(validator.isEmpty(medicationRequestId)){
					err_code = 2;
					err_msg = "Medication Request id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Request id is required";
			}
			if(typeof dosageId !== 'undefined'){
				if(validator.isEmpty(dosageId)){
					err_code = 2;
					err_msg = "Dosage id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Dosage id is required";
			}

			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var sequence =  req.body.sequence.trim();
				if(validator.isEmpty(sequence)){
					dataDosage.sequence = "";
				}else{
					if(!validator.isInt(sequence)){
						err_code = 2;
						err_msg = "dosage sequence is must be number.";
					}else{
						dataDosage.sequence = sequence;
					}
				}
			}else{
			  sequence = "";
			}

			if(typeof req.body.text !== 'undefined' && req.body.text !== ""){
				var text =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(text)){
					dataDosage.text = "";
				}else{
					dataDosage.text = text;
				}
			}else{
			  text = "";
			}

			if(typeof req.body.additionalInstruction !== 'undefined' && req.body.additionalInstruction !== ""){
				var additionalInstruction =  req.body.additionalInstruction.trim().toLowerCase();
				if(validator.isEmpty(additionalInstruction)){
					dataDosage.additional_instruction = "";
				}else{
					dataDosage.additional_instruction = additionalInstruction;
				}
			}else{
			  additionalInstruction = "";
			}

			if(typeof req.body.patientInstruction !== 'undefined' && req.body.patientInstruction !== ""){
				var patientInstruction =  req.body.patientInstruction.trim().toLowerCase();
				if(validator.isEmpty(patientInstruction)){
					dataDosage.patient_instruction = "";
				}else{
					dataDosage.patient_instruction = patientInstruction;
				}
			}else{
			  patientInstruction = "";
			}

			/*if(typeof req.body.timing !== 'undefined' && req.body.timing !== ""){
				var timing =  req.body.timing.trim().toLowerCase();
				if(validator.isEmpty(timing)){
					dataDosage.timing_id = "";
				}else{
					dataDosage.timing_id = timing;
				}
			}else{
			  timing = "";
			}*/

			if (typeof req.body.asNeeded.asNeededBoolean !== 'undefined' && req.body.asNeeded.asNeededBoolean !== "") {
			  var asNeededAsNeededBoolean = req.body.asNeeded.asNeededBoolean.trim().toLowerCase();
					if(validator.isEmpty(asNeededAsNeededBoolean)){
						asNeededAsNeededBoolean = "false";
					}
			  if(asNeededAsNeededBoolean === "true" || asNeededAsNeededBoolean === "false"){
					dataDosage.as_needed_boolean = asNeededAsNeededBoolean;
			  } else {
			    err_code = 2;
			    err_msg = "Dosage as needed as needed boolean is must be boolean.";
			  }
			} else {
			  asNeededAsNeededBoolean = "";
			}

			if(typeof req.body.asNeeded.asNeededCodeableConcept !== 'undefined' && req.body.asNeeded.asNeededCodeableConcept !== ""){
				var asNeededAsNeededCodeableConcept =  req.body.asNeeded.asNeededCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(asNeededAsNeededCodeableConcept)){
					dataDosage.as_needed_codeable_concept = "";
				}else{
					dataDosage.as_needed_codeable_concept = asNeededAsNeededCodeableConcept;
				}
			}else{
			  asNeededAsNeededCodeableConcept = "";
			}

			if(typeof req.body.site !== 'undefined' && req.body.site !== ""){
				var site =  req.body.site.trim().toLowerCase();
				if(validator.isEmpty(site)){
					dataDosage.site = "";
				}else{
					dataDosage.site = site;
				}
			}else{
			  site = "";
			}

			if(typeof req.body.route !== 'undefined' && req.body.route !== ""){
				var route =  req.body.route.trim().toLowerCase();
				if(validator.isEmpty(route)){
					dataDosage.route = "";
				}else{
					dataDosage.route = route;
				}
			}else{
			  route = "";
			}

			if(typeof req.body.method !== 'undefined' && req.body.method !== ""){
				var method =  req.body.method.trim().toLowerCase();
				if(validator.isEmpty(method)){
					dataDosage.method = "";
				}else{
					dataDosage.method = method;
				}
			}else{
			  method = "";
			}

			if (typeof req.body.dose.doseRange !== 'undefined' && req.body.dose.doseRange !== "") {
			  var doseDoseRange = req.body.dose.doseRange;
			  if (doseDoseRange.indexOf("to") > 0) {
			    arrDoseDoseRange = doseDoseRange.split("to");
			    dataDosage.dose_range_low = arrDoseDoseRange[0];
			    dataDosage.dose_range_high = arrDoseDoseRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "dosage dose dose range invalid range format.";
				}
			} else {
			  doseDoseRange = "";
			}

			if(typeof req.body.dose.doseQuantity !== 'undefined' && req.body.dose.doseQuantity !== ""){
				var doseDoseQuantity =  req.body.dose.doseQuantity.trim().toLowerCase();
				if(validator.isEmpty(doseDoseQuantity)){
					dataDosage.dose_quantity = "";
				}else{
					dataDosage.dose_quantity = doseDoseQuantity;
				}
			}else{
			  doseDoseQuantity = "";
			}

			if (typeof req.body.maxDosePerPeriod !== 'undefined' && req.body.maxDosePerPeriod !== "") {
			  var maxDosePerPeriod = req.body.maxDosePerPeriod;
			  if (maxDosePerPeriod.indexOf("to") > 0) {
			    arrMaxDosePerPeriod = maxDosePerPeriod.split("to");
			    dataDosage.max_dose_per_period_numerator = arrMaxDosePerPeriod[0];
			    dataDosage.max_dose_per_period_denominator = arrMaxDosePerPeriod[1];
				} else {
			  	err_code = 2;
			  	err_msg = "dosage max dose per period invalid ratio format.";
				}
			} else {
			  maxDosePerPeriod = "";
			}

			if(typeof req.body.maxDosePerAdministration !== 'undefined' && req.body.maxDosePerAdministration !== ""){
				var maxDosePerAdministration =  req.body.maxDosePerAdministration.trim().toLowerCase();
				if(validator.isEmpty(maxDosePerAdministration)){
					dataDosage.max_dose_per_administration = "";
				}else{
					dataDosage.max_dose_per_administration = maxDosePerAdministration;
				}
			}else{
			  maxDosePerAdministration = "";
			}

			if(typeof req.body.maxDosePerLifetime !== 'undefined' && req.body.maxDosePerLifetime !== ""){
				var maxDosePerLifetime =  req.body.maxDosePerLifetime.trim().toLowerCase();
				if(validator.isEmpty(maxDosePerLifetime)){
					dataDosage.max_dose_per_lifetime = "";
				}else{
					dataDosage.max_dose_per_lifetime = maxDosePerLifetime;
				}
			}else{
			  maxDosePerLifetime = "";
			}

			if (typeof req.body.rate.rateRatio !== 'undefined' && req.body.rate.rateRatio !== "") {
			  var rateRateRatio = req.body.rate.rateRatio;
			  if (rateRateRatio.indexOf("to") > 0) {
			    arrRateRateRatio = rateRateRatio.split("to");
			    dataDosage.rate_ratio_numerator = arrRateRateRatio[0];
			    dataDosage.rate_ratio_denominator = arrRateRateRatio[1];
				} else {
			  	err_code = 2;
			  	err_msg = "dosage rate rate ratio invalid ratio format.";
				}
			} else {
			  rateRateRatio = "";
			}

			if (typeof req.body.rate.rateRange !== 'undefined' && req.body.rate.rateRange !== "") {
			  var rateRateRange = req.body.rate.rateRange;
			  if (rateRateRange.indexOf("to") > 0) {
			    arrRateRateRange = rateRateRange.split("to");
			    dataDosage.rate_range_low = arrRateRateRange[0];
			    dataDosage.rate_range_high = arrRateRateRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "dosage rate rate range invalid range format.";
				}
			} else {
			  rateRateRange = "";
			}

			if(typeof req.body.rate.rateQuantity !== 'undefined' && req.body.rate.rateQuantity !== ""){
				var rateRateQuantity =  req.body.rate.rateQuantity.trim();
				if(validator.isEmpty(rateRateQuantity)){
					dataDosage.rate_quantity = "";
				}else{
					if(!validator.isInt(rateRateQuantity)){
						err_code = 2;
						err_msg = "dosage rate rate quantity is must be number.";
					}else{
						dataDosage.rate_quantity = rateRateQuantity;
					}
				}
			}else{
			  rateRateQuantity = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkMedicationRequestId', function() {
							checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + medicationRequestId, 'MEDICATION_REQUEST', function(resMedicationRequestID){
								if(resMedicationRequestID.err_code > 0){
										//console.log(dataImmunization);
										ApiFHIR.put('dosage', {"apikey": apikey, "_id": dosageId,"dr": "MEDICATION_REQUEST_ID|"+medicationRequestId}, {body: dataDosage, json: true}, function(error, response, body){
											dosage = body;
											if(dosage.err_code > 0){
												res.json(dosage);	
											}else{
												res.json({"err_code": 0, "err_msg": "Medication Request Dosage has been update.", "data": [{"_id": dosageId}]});
											}
										})
									}else{
									res.json({"err_code": 501, "err_msg": "Medication Request Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkAdditionalInstruction', function () {
							if (!validator.isEmpty(additionalInstruction)) {
								checkCode(apikey, additionalInstruction, 'ADDITIONAL_INSTRUCTION_CODES', function (resAdditionalInstructionCode) {
									if (resAdditionalInstructionCode.err_code > 0) {
										myEmitter.emit('checkMedicationRequestId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Additional instruction code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationRequestId');
							}
						})

						myEmitter.prependOnceListener('checkAsNeededAsNeededCodeableConcept', function () {
							if (!validator.isEmpty(asNeededAsNeededCodeableConcept)) {
								checkCode(apikey, asNeededAsNeededCodeableConcept, 'MEDICATION_AS_NEEDED_REASON', function (resAsNeededAsNeededCodeableConceptCode) {
									if (resAsNeededAsNeededCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkAdditionalInstruction');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "As needed as needed codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAdditionalInstruction');
							}
						})

						myEmitter.prependOnceListener('checkSite', function () {
							if (!validator.isEmpty(site)) {
								checkCode(apikey, site, 'APPROACH_SITE_CODES', function (resSiteCode) {
									if (resSiteCode.err_code > 0) {
										myEmitter.emit('checkAsNeededAsNeededCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Site code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAsNeededAsNeededCodeableConcept');
							}
						})

						myEmitter.prependOnceListener('checkRoute', function () {
							if (!validator.isEmpty(route)) {
								checkCode(apikey, route, 'ROUTE_CODES', function (resRouteCode) {
									if (resRouteCode.err_code > 0) {
										myEmitter.emit('checkSite');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Route code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSite');
							}
						})

						if (!validator.isEmpty(method)) {
							checkCode(apikey, method, 'ADMINISTRATION_METHOD_CODES', function (resMethodCode) {
								if (resMethodCode.err_code > 0) {
									myEmitter.emit('checkRoute');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Method code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRoute');
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