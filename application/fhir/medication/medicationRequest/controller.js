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

			//params from query string
			var medicationRequestId = req.query._id;
			var authoredon = req.query.authoredon;
			var category = req.query.category;
			var code = req.query.code;
			var context = req.query.context;
			var date = req.query.date;
			var identifier = req.query.identifier;
			var intended_dispenser = req.query.intendedDispenser;
			var intent = req.query.intent;
			var medication = req.query.medication;
			var patient = req.query.patient;
			var priority = req.query.priority;
			var requester = req.query.requester;
			var status = req.query.status;
			var subject = req.query.subject;
			
			var qString = {};
			if(typeof medicationRequestId !== 'undefined'){
				if(!validator.isEmpty(medicationRequestId)){
					qString._id = medicationRequestId; 
				}else{
					res.json({"err_code": 1, "err_msg": "medication request id is required."});
				}
			}
			
			if(typeof authoredon !== 'undefined') {
        if (!validator.isEmpty(authoredon)) {
          if (!regex.test(authoredon)) {
            res.json({
              "err_code": 1,
              "err_msg": "Authoredon invalid format."
            });
          } else {
            qString.authoredon = authoredon;
          }
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Authoredon is empty."
          });
        }
      }
			
			if(typeof category !== 'undefined'){
				if(!validator.isEmpty(category)){
					qString.category = category;
				}else{
					res.json({"err_code": 1, "err_msg": "Category is empty."});
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
			
			if(typeof date !== 'undefined') {
        if (!validator.isEmpty(date)) {
          if (!regex.test(date)) {
            res.json({
              "err_code": 1,
              "err_msg": "Date invalid format."
            });
          } else {
            qString.date = date;
          }
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Date is empty."
          });
        }
      }
			
			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "Identifier is empty."});
				}
			}
			
			if(typeof intended_dispenser !== 'undefined'){
				if(!validator.isEmpty(intended_dispenser)){
					qString.intended_dispenser = intended_dispenser; 
				}else{
					res.json({"err_code": 1, "err_msg": "Intended dispenser is empty."});
				}
			}
			
			if(typeof intent !== 'undefined'){
				if(!validator.isEmpty(intent)){
					qString.intent = intent; 
				}else{
					res.json({"err_code": 1, "err_msg": "Intent is empty."});
				}
			}			
			
			if(typeof medication !== 'undefined'){
				if(!validator.isEmpty(medication)){
					qString.medication = medication; 
				}else{
					res.json({"err_code": 1, "err_msg": "Medication is empty."});
				}
			}
			
			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "Patient is empty."});
				}
			}
			
			if(typeof priority !== 'undefined'){
				if(!validator.isEmpty(priority)){
					qString.priority = priority; 
				}else{
					res.json({"err_code": 1, "err_msg": "Priority is empty."});
				}
			}
			
			if(typeof requester !== 'undefined'){
				if(!validator.isEmpty(requester)){
					qString.requester = requester; 
				}else{
					res.json({"err_code": 1, "err_msg": "Requester is empty."});
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
										myEmitter.once('getIdentifier', function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
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
														
														newMedicationRequest[index] = objectMedicationRequest;

														myEmitter.once('getMedicationRequestRequester', function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
															qString = {};
															qString.medicationRequest_id = medicationRequest.id;
															seedPhoenixFHIR.path.GET = {
																"MedicationRequestRequester" : {
																	"location": "%(apikey)s/MedicationRequestRequester",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('MedicationRequestRequester', {"apikey": apikey}, {}, function(error, response, body){
																medicationRequestRequester = JSON.parse(body);

																if(medicationRequestRequester.err_code == 0){
																	var objectMedicationRequest = {};
																	objectMedicationRequest.resourceType = medicationRequest.resourceType;
																	objectMedicationRequest.id = medicationRequest.id;
																	objectMedicationRequest.identifier = medicationRequest.identifier;
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
																	objectMedicationRequest.requester = medicationRequestRequester.data;
																	objectMedicationRequest.recorder = medicationRequest.recorder;
																	objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
																	objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
																	
																	newMedicationRequest[index] = objectMedicationRequest;

																	myEmitter.once('getMedicationRequestSubtitution', function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
																		qString = {};
																		qString.medicationRequest_id = medicationRequest.id;
																		seedPhoenixFHIR.path.GET = {
																			"MedicationRequestSubtitution" : {
																				"location": "%(apikey)s/MedicationRequestSubtitution",
																				"query": qString
																			}
																		}

																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																		ApiFHIR.get('MedicationRequestSubtitution', {"apikey": apikey}, {}, function(error, response, body){
																			medicationRequestSubtitution = JSON.parse(body);

																			if(medicationRequestSubtitution.err_code == 0){
																				var objectMedicationRequest = {};
																				objectMedicationRequest.resourceType = medicationRequest.resourceType;
																				objectMedicationRequest.id = medicationRequest.id;
																				objectMedicationRequest.identifier = medicationRequest.identifier;
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
																				objectMedicationRequest.requester = medicationRequest.requester;
																				objectMedicationRequest.recorder = medicationRequest.recorder;
																				objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
																				objectMedicationRequest.substitution = medicationRequestSubtitution.data;
																				objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;
																				newMedicationRequest[index] = objectMedicationRequest;

																				myEmitter.once('getMedicationRequestDispenseRequest', function(medicationRequest, index, newMedicationRequest, countMedicationRequest){
																					qString = {};
																					qString.medicationRequest_id = medicationRequest.id;
																					seedPhoenixFHIR.path.GET = {
																						"MedicationRequestDispenseRequest" : {
																							"location": "%(apikey)s/MedicationRequestDispenseRequest",
																							"query": qString
																						}
																					}

																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																					ApiFHIR.get('MedicationRequestDispenseRequest', {"apikey": apikey}, {}, function(error, response, body){
																						medicationRequestDispenseRequest = JSON.parse(body);

																						if(medicationRequestDispenseRequest.err_code == 0){
																							var objectMedicationRequest = {};
																							objectMedicationRequest.resourceType = medicationRequest.resourceType;
																							objectMedicationRequest.id = medicationRequest.id;
																							objectMedicationRequest.identifier = medicationRequest.identifier;
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
																							objectMedicationRequest.requester = medicationRequest.requester;
																							objectMedicationRequest.recorder = medicationRequest.recorder;
																							objectMedicationRequest.reasonCode = medicationRequest.reasonCode;
																							objectMedicationRequest.dispenseRequest = medicationRequestDispenseRequest.data;
																							objectMedicationRequest.substitution = medicationRequest.substitution;
																							objectMedicationRequest.priorPrescription = medicationRequest.priorPrescription;

																							newMedicationRequest[index] = objectMedicationRequest;

																							if(index == countMedicationRequest -1 ){
																								res.json({"err_code": 0, "data":newMedicationRequest});	
																							}
																						}else{
																							res.json(medicationRequestDispenseRequest);			
																						}
																					})
																				})
																				myEmitter.emit('getMedicationRequestDispenseRequest', objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);
																			}else{
																				res.json(medicationRequestSubtitution);			
																			}
																		})
																	})
																	myEmitter.emit('getMedicationRequestSubtitution', objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);
																}else{
																	res.json(medicationRequestRequester);			
																}
															})
														})
														myEmitter.emit('getMedicationRequestRequester', objectMedicationRequest, index, newMedicationRequest, countMedicationRequest);			
													}else{
														res.json(identifier);			
													}
												})
											})				
										myEmitter.emit("getIdentifier", medicationRequest.data[i], i, newMedicationRequest, medicationRequest.data.length);
									}
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
		}
	},
	post: {
		medicationRequest: function postMedicationRequest(req, res){
			//belum
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			var err_code = 0;
			var err_msg = "";
	//console.log(req.body);
			//identifier
			if(typeof req.body.identifier.use !== 'undefined'){
				var identifierUseCode =  req.body.identifier.use.trim().toLowerCase();
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
				var identifierTypeCode =  req.body.identifier.type.trim().toUpperCase();
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
				var identifierValue =  req.body.identifier.value.trim();
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
				var period = req.body.identifier.period;
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
			
			//medicationRequest status
			if(typeof req.body.status !== 'undefined'){
				var medicationRequestStatus =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestStatus)){
					err_code = 2;
					err_msg = "Medication administration status is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Medication administration request.";
			}
			
			if(typeof req.body.category !== 'undefined'){
				var medicationRequestCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestCategory)){
					err_code = 2;
					err_msg = "Medication administration category is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Medication administration request.";
			}
			
			if(typeof req.body.medication.medicationCodeableConcept !== 'undefined'){
				var medicationRequestMedicationCodeableConcept =  req.body.medication.medicationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestMedicationCodeableConcept)){
					err_code = 2;
					err_msg = "Medication administration medication codeable concept is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'medication codeable concept' in json Medication administration request.";
			}
			
			if(typeof req.body.medication.medicationReference !== 'undefined'){
				var medicationRequestMedicationReference =  req.body.medication.medicationReference.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestMedicationReference)){
					medicationRequestMedicationReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'medication reference' in json Medication administration request.";
			}
			
			//subject
			if(typeof req.body.subject !== 'undefined'){
				subject =  req.body.subject.trim().toLowerCase();
				if(validator.isEmpty(subject)){
					subjectPatient = '';
					subjectGroup = '';
				} else {
					var res = subject.substring(0, 3);
					if(res == 'pat'){
						subjectPatient = subject;
						subjectGroup = '';
					} else {
						subjectPatient = '';
						subjectGroup = subject;
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject' in json Medication administration request.";
			}
			
			//context
			if(typeof req.body.context !== 'undefined'){
				context =  req.body.context.trim().toLowerCase();
				if(validator.isEmpty(context)){
					contextEncounter = '';
					contextEpisodeOfCare = '';
				} else {
					var res = context.substring(0, 3);
					if(res == 'enc'){
						contextEncounter = context;
						contextEpisodeOfCare = '';
					} else {
						contextEncounter = '';
						contextEpisodeOfCare = context;
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context' in json Medication administration request.";
			}
			
			if(typeof req.body.supportingInformation !== 'undefined'){
				var medicationRequestSupportingInformation
				=  req.body.supportingInformation.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestSupportingInformation)){
					medicationRequestSupportingInformation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'supporting information' in json Medication administration request.";
			}
			
			//date
			if(typeof req.body.effective.effectiveDateTime !== 'undefined'){
				var medicationEffectiveExpirationDate = req.body.effective.effectiveDateTime;
				if(!regex.test(medicationEffectiveExpirationDate)){
						err_code = 2;
						err_msg = "Medication effective expiration date invalid date format.";
					}	
			}else{
				medicationPackageBatchExpirationDate = "";
			}
			
			if(typeof req.body.effective.effectivePeriod !== 'undefined'){
				var period = req.body.effective.effectivePeriod;
				if(period.indexOf("to") > 0){
					arrPeriod = period.split("to");
					effectivePeriodStart = arrPeriod[0];
					effectivePeriodEnd = arrPeriod[1];

					if(!regex.test(effectivePeriodStart) && !regex.test(effectivePeriodEnd)){
						err_code = 2;
						err_msg = "Effective Period invalid date format.";
					}	
				}

			}else{
				err_code = 1;
				err_msg = "Please add key 'period' in json effective request.";
			}
			
			if(typeof req.body.notGiven !== 'undefined'){
				var medicationRequestNotGiven =  req.body.notGiven.trim().toLowerCase();
				if(medicationRequestNotGiven !== 'true' || medicationRequestNotGiven !== 'flase'){
					err_code = 3;
					err_msg = "Medication administration not given is't boolean";
				}
				if(validator.isEmpty(medicationRequestNotGiven)){
					err_code = 2;
					err_msg = "Medication administration not given is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'not given' in json Medication administration request.";
			}
			
			//medicationRequest form
			if(typeof req.body.reasonNotGiven !== 'undefined'){
				var medicationRequestReasonNotGiven =  req.body.reasonNotGiven.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestReasonNotGiven)){
					err_code = 2;
					err_msg = "Medication administration reason not given is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason not given' in json Medication administration request.";
			}
			
			if(typeof req.body.reasonCode !== 'undefined'){
				var medicationRequestReasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestReasonCode)){
					err_code = 2;
					err_msg = "Medication administration reason code is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason code' in json Medication administration request.";
			}
			
			if(typeof req.body.prescription !== 'undefined'){
				var medicationRequestPrescription =  req.body.prescription.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestPrescription)){
					medicationRequestPrescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prescription' in json Medication administration request.";
			}
			
			if(typeof req.body.performer.onBehalfOf !== 'undefined'){
				var medicationRequestPerformerOnBehalfOf =  req.body.performer.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestPerformerOnBehalfOf)){
					medicationRequestPerformerOnBehalfOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'on be half of' in json Medication administration performer request.";
			}
			
			if(typeof req.body.performer.actor !== 'undefined'){
				var medicationRequestPerformerActor =  req.body.performer.actor.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestPerformerActor)){
					medicationRequestPerformerActorPractitioner = '';
					medicationRequestPerformerActorPatient  = '';
					medicationRequestPerformerActorRelatedPerson  = '';
					medicationRequestPerformerActorDevice  = '';
				} else {
					var res = medicationRequestPerformerActor.substring(0, 3);
					if(res == 'pra'){
						medicationRequestPerformerActorPractitioner = medicationRequestPerformerActor;
						medicationRequestPerformerActorPatient  = '';
						medicationRequestPerformerActorRelatedPerson  = '';
						medicationRequestPerformerActorDevice  = '';
					} else if(res == 'pat'){
						medicationRequestPerformerActorPractitioner = '';
						medicationRequestPerformerActorPatient  = medicationRequestPerformerActor;
						medicationRequestPerformerActorRelatedPerson  = '';
						medicationRequestPerformerActorDevice  = '';
					} else if(res == 'dev'){
						medicationRequestPerformerActorPractitioner = '';
						medicationRequestPerformerActorPatient  = '';
						medicationRequestPerformerActorRelatedPerson  = '';
						medicationRequestPerformerActorDevice  = medicationRequestPerformerActor;
					} else {
						medicationRequestPerformerActorPractitioner = '';
						medicationRequestPerformerActorPatient  = '';
						medicationRequestPerformerActorRelatedPerson  = medicationRequestPerformerActor;
						medicationRequestPerformerActorDevice  = '';
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor' in json Medication administration performer request.";
			}
			
			if(typeof req.body.dosage.text !== 'undefined'){
				var medicationRequestDosageText =  req.body.dosage.text.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestDosageText)){
					err_code = 2;
					err_msg = "Medication administration text is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'text' in json Medication administration request.";
			}
			
			if(typeof req.body.dosage.site !== 'undefined'){
				var medicationRequestDosageSite =  req.body.dosage.site.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestDosageSite)){
					err_code = 2;
					err_msg = "Medication administration site is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'site' in json Medication administration dosage request.";
			}
			
			if(typeof req.body.dosage.route !== 'undefined'){
				var medicationRequestDosageRoute =  req.body.dosage.route.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestDosageRoute)){
					err_code = 2;
					err_msg = "Medication administration route is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'route' in json Medication administration dosage request.";
			}
			
			if(typeof req.body.dosage.method !== 'undefined'){
				var medicationRequestDosageMethod =  req.body.dosage.method.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestDosageMethod)){
					err_code = 2;
					err_msg = "Medication administration method is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'method' in json Medication administration dosage request.";
			}
			
			if(typeof req.body.dosage.dose !== 'undefined'){
				var medicationRequestDosageDose =  req.body.dosage.dose.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestDosageDose)){
					err_code = 2;
					err_msg = "Medication administration dose is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose' in json Medication administration dosage request.";
			}
			
			if(typeof req.body.dosage.rate.rateRatio !== 'undefined'){
				var medicationRequestDosageRateRateRatio =  req.body.dosage.rate.rateRatio.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestDosageRateRateRatio)){
					err_code = 2;
					err_msg = "Medication administration rate rate ratio is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'rate ratio' in json Medication administration dosage rate request.";
			}
			
			if(typeof req.body.dosage.rate.rateQuantity !== 'undefined'){
				var medicationRequestDosageRateRateQuantity =  req.body.dosage.rate.rateQuantity.trim().toLowerCase();
				if(validator.isEmpty(medicationRequestDosageRateRateQuantity)){
					err_code = 2;
					err_msg = "Medication administration rate rate quantity is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'rate quantity' in json Medication administration dosage rate request.";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkCode(apikey, medicationRequestStatus, 'MEDICATION_ADMIN_STATUS', function(resMedicationRequestStatus){
							if(resMedicationRequestStatus.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								checkCode(apikey, medicationRequestCategory, 'MEDICATION_ADMIN_CATEGORY', function(resMedicationRequestCategory){
									if(resMedicationRequestCategory.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, medicationRequestMedicationCodeableConcept, 'MEDICATION_CODES', function(resMedicationRequestMedicationCodeableConcept){
											if(resMedicationRequestMedicationCodeableConcept.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, medicationRequestReasonNotGiven, 'REASON_MEDICATION_NOT_GIVEN_CODES', function(resMedicationRequestReasonNotGiven){
													if(resMedicationRequestReasonNotGiven.err_code > 0){
														checkCode(apikey, medicationRequestReasonCode, 'REASON_MEDICATION_GIVEN_CODES', function(resMedicationRequestReasonCode){
															if(resMedicationRequestReasonCode.err_code > 0){
																checkCode(apikey, medicationRequestDosageSite, 'APPROACH_SITE_CODES', function(resMedicationRequestDosageSite){
																	if(resMedicationRequestDosageSite.err_code > 0){
																		checkCode(apikey, medicationRequestDosageRoute, 'ROUTE_CODES', function(resMedicationRequestDosageRoute){
																			if(resMedicationRequestDosageRoute.err_code > 0){
																				checkCode(apikey, medicationRequestDosageMethod, 'ADMINISTRATION_METHOD_CODES', function(resMedicationRequestDosageMethod){
																					if(resMedicationRequestDosageMethod.err_code > 0){
																						checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
																							if(resUniqeValue.err_code == 0){
																		
				myEmitter.prependOnceListener('checkMedicationRequestId', function() {
					//proses insert
					MedicationRequestPerformer
					//set uniqe id
					var unicId = uniqid.time();
					var medicationRequestId = 'mad' + unicId;
					var medicationRequestPerformerId = 'map' + unicId;
					var medicationRequestDosageId = 'mad' + unicId;
					var identifierId = 'ide' + unicId;

					dataMedicationRequest = {
						"medication_administration_id" : medicationRequestId,
						"status" : medicationRequestStatus,
						"category" : medicationRequestCategory, 
						"medication_codeable_concept" : medicationRequestMedicationCodeableConcept,
						"medication_reference" : medicationRequestMedicationReference,
						"subject_patient" : subjectPatient,
						"subject_group" : subjectGroup,
						"context_encounter" : contextEncounter,
						"context_episode_of_care" : contextEpisodeOfCare,
						"supporting_information" : medicationRequestSupportingInformation,
						"effective_date_time" : medicationEffectiveExpirationDate,
						"effective_period_start" : effectivePeriodStart,
						"effective_period_end" : effectivePeriodEnd,
						"not_given" : medicationRequestNotGiven,
						"reason_not_given" : medicationRequestReasonNotGiven,
						"reason_code" : medicationRequestReasonCode,
						"prescription" : medicationRequestPrescription
					}
					ApiFHIR.post('MedicationRequest', {"apikey": apikey}, {body: dataMedicationRequest, json: true}, function(error, response, body){
						medicationRequest = body;
						if(medicationRequest.err_code > 0){
							res.json(medicationRequest);	
						}
					})
					
					dataMedicationRequestPerformer = {
						"performer_id" : medicationRequestPerformerId,
						"actor_practitioner" : medicationRequestPerformerActorPractitioner,
						"actor_patient" : medicationRequestPerformerActorPatient,
						"actor_related_person" : medicationRequestPerformerActorRelatedPerson,
						"actor_device" : medicationRequestPerformerActorDevice,
						"on_behalf_of" : medicationRequestPerformerOnBehalfOf,
						"medication_administration_id" : medicationRequestId
					}
					ApiFHIR.post('MedicationRequestPerformer', {"apikey": apikey}, {body: dataMedicationRequestPerformer, json: true}, function(error, response, body){
						medicationRequestPerformer = body;
						if(medicationRequestPerformer.err_code > 0){
							//console.log(medicationRequestPractitioner);
							res.json(medicationRequestPerformer);	
						}
					})

					dataMedicationRequestDosage = {
						"dosage_id" : medicationRequestDosageId,
						"text" : medicationRequestDosageText,
						"site" : medicationRequestDosageSite,
						"route" : medicationRequestDosageRoute,
						"method" : medicationRequestDosageMethod,
						"dose" : medicationRequestDosageDose,
						"rate_ratio" : medicationRequestDosageRateRateRatio,
						"rate_quality" : medicationRequestDosageRateRateQuantity,
						"medication_administration_id" : medicationRequestId
					}
					ApiFHIR.post('MedicationRequestDosage', {"apikey": apikey}, {body: dataMedicationRequestDosage, json: true}, function(error, response, body){
						medicationRequestDosage = body;
						if(medicationRequestDosage.err_code > 0){
							res.json(medicationRequestDosage);	
						}
					})
					
					var identifierSystem = identifierId;
					dataIdentifier = {
						"id": identifierId,
						"use": identifierUseCode,
						"type": identifierTypeCode,
						//"system": identifierSystem,
						"value": identifierValue,
						"system": identifierSystem,
						"period_start": identifierPeriodStart,
						"period_end": identifierPeriodEnd,
						"medication_administration_id" : medicationRequestId
					}

					ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
						identifier = body;
						if(identifier.err_code > 0){
							res.json(identifier);	
						}
					})

					res.json({"err_code": 0, "err_msg": "MedicationRequest has been add.", "data": [{"_id": medicationRequestId}]})
				});

				myEmitter.prependOnceListener('checkMedicationRequestManufacturerId', function(){
					if(validator.isEmpty(medicationRequestManufacturer)){
						myEmitter.emit('checkMedicationRequestId');
					}else{
						checkUniqeValue(apikey, "ORGANIZATION_ID|" + medicationRequestManufacturer, 'ORGANIZATION', function(resManufacturerID){
							if(resManufacturerID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkMedicationRequestId');
							}else{
								res.json({"err_code": 503, "err_msg": "Manufaturer id not found."});	
							}
						})
					}
				})
																		
				myEmitter.prependOnceListener('checkItemReferenceSubstanceId', function(){
					if(validator.isEmpty(medicationRequestIngredientItemItemReferenceSubstance)){
						myEmitter.emit('checkMedicationRequestManufacturerId');
					}else{
						checkUniqeValue(apikey, "SUBSTANCE_ID|" + medicationRequestIngredientItemItemReferenceSubstance, 'SUBSTANCE', function(resItemReferenceSubstanceId){
							if(resItemReferenceSubstanceId.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkMedicationRequestManufacturerId');
							}else{
								res.json({"err_code": 503, "err_msg": "Substance id not found."});	
							}
						})
					}
				})

				myEmitter.prependOnceListener('checkItemReferenceMedicationRequest', function(){
					if(validator.isEmpty(medicationRequestIngredientItemItemReferenceMedicationRequest)){
						myEmitter.emit('checkItemReferenceSubstanceId');
					}else{
						checkUniqeValue(apikey, "MEDICATION_ID|" + medicationRequestIngredientItemItemReferenceMedicationRequest, 'MEDICATION', function(resItemReferenceMedicationRequestId){
							if(resItemReferenceMedicationRequestId.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkItemReferenceSubstanceId');
							}else{
								res.json({"err_code": 503, "err_msg": "Item Reference Substance id not found."});	
							}
						})
					}
				})

				if(validator.isEmpty(medicationRequestPackageItemItemReference)){
					myEmitter.emit('checkItemReferenceMedicationRequest');
				}else{
					checkUniqeValue(apikey, "MEDICATION_ID|" + medicationRequestPackageItemItemReference, 'MEDICATION', function(resPackageItemItemReference){
						if(resPackageItemItemReference.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
							myEmitter.emit('checkItemReferenceMedicationRequest');
						}else{
							res.json({"err_code": 501, "err_msg": "Item Reference MedicationRequest id is not exist."});
						}
					})
				}	
																							}else{
																								res.json({"err_code": 509, "err_msg": "Identifier value already exist."});
																							}
																						})
																					}else{
																						res.json({"err_code": 509, "err_msg": "Medication administration dosage method Code not found"});
																					}
																				})
																			}else{
																				res.json({"err_code": 509, "err_msg": "Medication administration dosage route Code not found"});
																			}
																		})
																	}else{
																		res.json({"err_code": 509, "err_msg": "Medication administration dosage site Code not found"});
																	}
																})
															}else{
																res.json({"err_code": 509, "err_msg": "Medication administration reason code not found"});
															}
														})
													}else{
														res.json({"err_code": 509, "err_msg": "Medication administration reason not given Code not found"});
													}
												})
											}else{
												res.json({"err_code": 508, "err_msg": "Medication administration medication codeable concept code not found"});
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Medication administration category code not found"});		
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Medication administration status code not found"});
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
	put:{
		medicationRequest: function putMedicationRequest(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			
			var medicationRequestId = req.params.medicationRequest_id;
			var err_code = 0;
			var err_msg = "";

			var dataMedicationRequest = {};
			
			//input check 
			if(typeof medicationRequestId !== 'undefined'){
				if(validator.isEmpty(medicationRequestId)){
					err_code = 2;
					err_msg = "MedicationRequest id is required";
				}
			}else{
				err_code = 2;
				err_msg = "MedicationRequest id is required";
			}
			
			if(typeof req.body.active !== 'undefined'){
				active =  req.body.active.trim().toLowerCase();
				if(validator.isEmpty(active)){
					err_code = 2;
					err_msg = "Active is required.";
				}else{
					dataMedicationRequest.active = active;
				}
			}else{
				active = "";
			}
			
			if(typeof req.body.type !== 'undefined'){
				type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					err_code = 2;
					err_msg = "Type is required.";
				}else{
					dataMedicationRequest.type = type;
				}
			}else{
				type = "";
			}
			
			if(typeof req.body.name !== 'undefined'){
				name =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(name)){
					err_code = 2;
					err_msg = "Name is required.";
				}else{
					dataMedicationRequest.name = name;
				}
			}else{
				name = "";
			}
			
			if(typeof req.body.alias !== 'undefined'){
				alias =  req.body.alias.trim().toLowerCase();
				if(validator.isEmpty(alias)){
					err_code = 2;
					err_msg = "Alias is required.";
				}else{
					dataMedicationRequest.alias = alias;
				}
			}else{
				alias = "";
			}			
			
			//Endpoint managingMedicationRequest
			if(typeof req.body.partOf !== 'undefined'){
				parentId =  req.body.partOf.trim().toLowerCase();
				if(validator.isEmpty(parentId)){
					err_code = 2;
					err_msg = "Managing MedicationRequest is required.";
				}else{
					dataMedicationRequest.parentId = parentId;
				}
			}else{
				parentId = "";
			}
			
			//Endpoint managingMedicationRequest
			if(typeof req.body.endpoint !== 'undefined'){
				endpointId =  req.body.endpoint.trim().toLowerCase();
				if(validator.isEmpty(endpointId)){
					err_code = 2;
					err_msg = "Endpoint is required.";
				}else{
					dataMedicationRequest.endpointId = endpointId;
				}
			}else{
				endpointId = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkMedicationRequestID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + medicationRequestId, 'IMMUNIZATION', function(resMedicationRequestID){
								if(resMedicationRequestID.err_code > 0){
									//console.log(dataEndpoint);
										ApiFHIR.put('medicationRequest', {"apikey": apikey, "_id": medicationRequestId}, {body: dataMedicationRequest, json: true}, function(error, response, body){
											medicationRequest = body;
											if(medicationRequest.err_code > 0){
												res.json(medicationRequest);	
											}else{
												res.json({"err_code": 0, "err_msg": "MedicationRequest has been update.", "data": [{"_id": medicationRequestId}]});
											}
										})
								}else{
									res.json({"err_code": 504, "err_msg": "MedicationRequest Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkType', function(){
							if(validator.isEmpty(type)){
								myEmitter.emit('checkMedicationRequestID');
							}else{
								checkCode(apikey, type, 'IMMUNIZATION_TYPE', function(resStatusCode){
									if(resStatusCode.err_code > 0){
										myEmitter.emit('checkMedicationRequestID');				
									}else{
										res.json({"err_code": 503, "err_msg": "Type Code not found."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkManagingMedicationRequest', function(){
							if(validator.isEmpty(parentId)){
								myEmitter.emit('checkType');
							}else{
								checkUniqeValue(apikey, "IMMUNIZATION_ID|" + parentId, 'IMMUNIZATION', function(resMedicationRequestID){
									if(resMedicationRequestID.err_code > 0){
										myEmitter.emit('checkType');				
									}else{
										res.json({"err_code": 503, "err_msg": "Parent Id MedicationRequest, medicationRequest id not found."});	
									}
								})
							}
						})

						if(validator.isEmpty(endpointId)){
							myEmitter.emit('checkManagingMedicationRequest');	
						}else{
							checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointID){
								if(resEndpointID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkManagingMedicationRequest');
								}else{
									res.json({"err_code": 501, "err_msg": "Endpoint id not found"});
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