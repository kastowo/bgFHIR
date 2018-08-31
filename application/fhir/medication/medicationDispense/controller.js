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
		medicationDispense : function getMedicationDispense(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			//params from query string
			var medicationDispenseId = req.query._id;
			var code = req.query.code;
			var context = req.query.context;
			var destination = req.query.destination;
			var identifier = req.query.identifier;
			var medication = req.query.medication;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var prescription = req.query.prescription;
			var receiver = req.query.receiver;
			var responsibleparty = req.query.responsibleparty;
			var status = req.query.status;
			var subject = req.query.subject;
			var type = req.query.type;
			var whenhandedover = req.query.whenhandedover;
			var whenprepared = req.query.whenprepared;
			
			var qString = {};
			if(typeof medicationDispenseId !== 'undefined'){
				if(!validator.isEmpty(medicationDispenseId)){
					qString._id = medicationDispenseId; 
				}else{
					res.json({"err_code": 1, "err_msg": "medication dispense id is required."});
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
			
			if(typeof destination !== 'undefined'){
				if(!validator.isEmpty(destination)){
					qString.destination = destination; 
				}else{
					res.json({"err_code": 1, "err_msg": "Destination is empty."});
				}
			}
			
			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "Identifier is empty."});
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
			
			if(typeof performer !== 'undefined'){
				if(!validator.isEmpty(performer)){
					qString.performer = performer; 
				}else{
					res.json({"err_code": 1, "err_msg": "Performer is empty."});
				}
			}
			
			if(typeof prescription !== 'undefined'){
				if(!validator.isEmpty(prescription)){
					qString.prescription = prescription; 
				}else{
					res.json({"err_code": 1, "err_msg": "Prescription is empty."});
				}
			}
			
			if(typeof receiver !== 'undefined'){
				if(!validator.isEmpty(receiver)){
					qString.receiver = receiver; 
				}else{
					res.json({"err_code": 1, "err_msg": "Receiver is empty."});
				}
			}
			
			if(typeof responsibleparty !== 'undefined'){
				if(!validator.isEmpty(responsibleparty)){
					qString.responsibleparty = responsibleparty; 
				}else{
					res.json({"err_code": 1, "err_msg": "Responsible party is empty."});
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
			
			if(typeof type !== 'undefined'){
				if(!validator.isEmpty(type)){
					qString.type = type; 
				}else{
					res.json({"err_code": 1, "err_msg": "Type is empty."});
				}
			}
			
			if(typeof whenhandedover !== 'undefined') {
        if (!validator.isEmpty(whenhandedover)) {
          if (!regex.test(whenhandedover)) {
            res.json({
              "err_code": 1,
              "err_msg": "When handed over invalid format."
            });
          } else {
            qString.whenhandedover = whenhandedover;
          }
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "When handed over is empty."
          });
        }
      }
			
			if(typeof whenprepared !== 'undefined') {
        if (!validator.isEmpty(whenprepared)) {
          if (!regex.test(whenprepared)) {
            res.json({
              "err_code": 1,
              "err_msg": "When prepared invalid format."
            });
          } else {
            qString.whenprepared = whenprepared;
          }
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "When prepared is empty."
          });
        }
      }
			
			seedPhoenixFHIR.path.GET = {
				"MedicationDispense" : {
					"location": "%(apikey)s/MedicationDispense",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('MedicationDispense', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var medicationDispense = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(medicationDispense.err_code == 0){
								//cek jumdata dulu
								if(medicationDispense.data.length > 0){
									newMedicationDispense = [];
									for(i=0; i < medicationDispense.data.length; i++){
										myEmitter.once('getIdentifier', function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
												qString = {};
												qString.medication_dispense_id = medicationDispense.id;
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
														var objectMedicationDispense = {};
														objectMedicationDispense.resourceType = medicationDispense.resourceType;
														objectMedicationDispense.id = medicationDispense.id;
														objectMedicationDispense.identifier = identifier.data;
														objectMedicationDispense.status = medicationDispense.status;
														objectMedicationDispense.category = medicationDispense.category;
														objectMedicationDispense.medication = medicationDispense.medication;
														objectMedicationDispense.subject = medicationDispense.subject;
														objectMedicationDispense.context = medicationDispense.context;
														objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
														objectMedicationDispense.type = medicationDispense.type;
														objectMedicationDispense.quantity = medicationDispense.quantity;
														objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
														objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
														objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
														objectMedicationDispense.destination = medicationDispense.destination;
														objectMedicationDispense.notDone = medicationDispense.notDone;
														objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;
														
														newMedicationDispense[index] = objectMedicationDispense;

														myEmitter.once('getMedicationDispensePerformer', function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
															qString = {};
															qString.medication_dispense_id = medicationDispense.id;
															seedPhoenixFHIR.path.GET = {
																"MedicationDispensePerformer" : {
																	"location": "%(apikey)s/MedicationDispensePerformer",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('MedicationDispensePerformer', {"apikey": apikey}, {}, function(error, response, body){
																medicationDispensePerformer = JSON.parse(body);

																if(medicationDispensePerformer.err_code == 0){
																	var objectMedicationDispense = {};
																	objectMedicationDispense.resourceType = medicationDispense.resourceType;
																	objectMedicationDispense.id = medicationDispense.id;
																	objectMedicationDispense.identifier = medicationDispense.identifier;
																	objectMedicationDispense.status = medicationDispense.status;
																	objectMedicationDispense.category = medicationDispense.category;
																	objectMedicationDispense.medication = medicationDispense.medication;
																	objectMedicationDispense.subject = medicationDispense.subject;
																	objectMedicationDispense.context = medicationDispense.context;
																	objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
																	objectMedicationDispense.performer = medicationDispensePerformer.data;
																	objectMedicationDispense.type = medicationDispense.type;
																	objectMedicationDispense.quantity = medicationDispense.quantity;
																	objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
																	objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
																	objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
																	objectMedicationDispense.destination = medicationDispense.destination;
																	objectMedicationDispense.notDone = medicationDispense.notDone;
																	objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;
																	
																	newMedicationDispense[index] = objectMedicationDispense;

																	myEmitter.once('getMedicationDispenseSubstitution', function(medicationDispense, index, newMedicationDispense, countMedicationDispense){
																		qString = {};
																		qString.medication_dispense_id = medicationDispense.id;
																		seedPhoenixFHIR.path.GET = {
																			"MedicationDispenseSubstitution" : {
																				"location": "%(apikey)s/MedicationDispenseSubstitution",
																				"query": qString
																			}
																		}

																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																		ApiFHIR.get('MedicationDispenseSubstitution', {"apikey": apikey}, {}, function(error, response, body){
																			medicationDispenseSubstitution = JSON.parse(body);

																			if(medicationDispenseSubstitution.err_code == 0){
																				var objectMedicationDispense = {};
																				objectMedicationDispense.resourceType = medicationDispense.resourceType;
																				objectMedicationDispense.id = medicationDispense.id;
																				objectMedicationDispense.identifier = medicationDispense.identifier;
																				objectMedicationDispense.status = medicationDispense.status;
																				objectMedicationDispense.category = medicationDispense.category;
																				objectMedicationDispense.medication = medicationDispense.medication;
																				objectMedicationDispense.subject = medicationDispense.subject;
																				objectMedicationDispense.context = medicationDispense.context;
																				objectMedicationDispense.supportingInformation = medicationDispense.supportingInformation;
																				objectMedicationDispense.performer = medicationDispense.performer;
																				objectMedicationDispense.type = medicationDispense.type;
																				objectMedicationDispense.quantity = medicationDispense.quantity;
																				objectMedicationDispense.daysSupply = medicationDispense.daysSupply;
																				objectMedicationDispense.whenPrepared = medicationDispense.whenPrepared;
																				objectMedicationDispense.whenHandedOver = medicationDispense.whenHandedOver;
																				objectMedicationDispense.destination = medicationDispense.destination;
																				objectMedicationDispense.notDone = medicationDispense.notDone;
																				objectMedicationDispense.notDoneReason = medicationDispense.notDoneReason;
																				objectMedicationDispense.substitution = medicationDispenseSubstitution.data;

																				newMedicationDispense[index] = objectMedicationDispense;

																				if(index == countMedicationDispense -1 ){
																					res.json({"err_code": 0, "data":newMedicationDispense});	
																				}
																			}else{
																				res.json(medicationDispenseSubstitution);			
																			}
																		})
																	})
																	myEmitter.emit('getMedicationDispenseSubstitution', objectMedicationDispense, index, newMedicationDispense, countMedicationDispense);
																}else{
																	res.json(medicationDispensePerformer);			
																}
															})
														})
														myEmitter.emit('getMedicationDispensePerformer', objectMedicationDispense, index, newMedicationDispense, countMedicationDispense);			
													}else{
														res.json(identifier);			
													}
												})
											})				
										myEmitter.emit("getIdentifier", medicationDispense.data[i], i, newMedicationDispense, medicationDispense.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Medication Dispense is empty."});	
								}
							}else{
								res.json(medicationDispense);
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
		medicationDispense: function postMedicationDispense(req, res){
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
			
			//medicationDispense status
			if(typeof req.body.status !== 'undefined'){
				var medicationDispenseStatus =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(medicationDispenseStatus)){
					err_code = 2;
					err_msg = "Medication administration status is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Medication administration request.";
			}
			
			if(typeof req.body.category !== 'undefined'){
				var medicationDispenseCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(medicationDispenseCategory)){
					err_code = 2;
					err_msg = "Medication administration category is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Medication administration request.";
			}
			
			if(typeof req.body.medication.medicationCodeableConcept !== 'undefined'){
				var medicationDispenseMedicationCodeableConcept =  req.body.medication.medicationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationDispenseMedicationCodeableConcept)){
					err_code = 2;
					err_msg = "Medication administration medication codeable concept is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'medication codeable concept' in json Medication administration request.";
			}
			
			if(typeof req.body.medication.medicationReference !== 'undefined'){
				var medicationDispenseMedicationReference =  req.body.medication.medicationReference.trim().toLowerCase();
				if(validator.isEmpty(medicationDispenseMedicationReference)){
					medicationDispenseMedicationReference = "";
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
				var medicationDispenseSupportingInformation
				=  req.body.supportingInformation.trim().toLowerCase();
				if(validator.isEmpty(medicationDispenseSupportingInformation)){
					medicationDispenseSupportingInformation = "";
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
				var medicationDispenseNotGiven =  req.body.notGiven.trim().toLowerCase();
				if(medicationDispenseNotGiven !== 'true' || medicationDispenseNotGiven !== 'flase'){
					err_code = 3;
					err_msg = "Medication administration not given is't boolean";
				}
				if(validator.isEmpty(medicationDispenseNotGiven)){
					err_code = 2;
					err_msg = "Medication administration not given is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'not given' in json Medication administration request.";
			}
			
			//medicationDispense form
			if(typeof req.body.reasonNotGiven !== 'undefined'){
				var medicationDispenseReasonNotGiven =  req.body.reasonNotGiven.trim().toLowerCase();
				if(validator.isEmpty(medicationDispenseReasonNotGiven)){
					err_code = 2;
					err_msg = "Medication administration reason not given is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason not given' in json Medication administration request.";
			}
			
			if(typeof req.body.reasonCode !== 'undefined'){
				var medicationDispenseReasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(medicationDispenseReasonCode)){
					err_code = 2;
					err_msg = "Medication administration reason code is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason code' in json Medication administration request.";
			}
			
			if(typeof req.body.prescription !== 'undefined'){
				var medicationDispensePrescription =  req.body.prescription.trim().toLowerCase();
				if(validator.isEmpty(medicationDispensePrescription)){
					medicationDispensePrescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prescription' in json Medication administration request.";
			}
			
			if(typeof req.body.performer.onBehalfOf !== 'undefined'){
				var medicationDispensePerformerOnBehalfOf =  req.body.performer.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(medicationDispensePerformerOnBehalfOf)){
					medicationDispensePerformerOnBehalfOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'on be half of' in json Medication administration performer request.";
			}
			
			if(typeof req.body.performer.actor !== 'undefined'){
				var medicationDispensePerformerActor =  req.body.performer.actor.trim().toLowerCase();
				if(validator.isEmpty(medicationDispensePerformerActor)){
					medicationDispensePerformerActorPractitioner = '';
					medicationDispensePerformerActorPatient  = '';
					medicationDispensePerformerActorRelatedPerson  = '';
					medicationDispensePerformerActorDevice  = '';
				} else {
					var res = medicationDispensePerformerActor.substring(0, 3);
					if(res == 'pra'){
						medicationDispensePerformerActorPractitioner = medicationDispensePerformerActor;
						medicationDispensePerformerActorPatient  = '';
						medicationDispensePerformerActorRelatedPerson  = '';
						medicationDispensePerformerActorDevice  = '';
					} else if(res == 'pat'){
						medicationDispensePerformerActorPractitioner = '';
						medicationDispensePerformerActorPatient  = medicationDispensePerformerActor;
						medicationDispensePerformerActorRelatedPerson  = '';
						medicationDispensePerformerActorDevice  = '';
					} else if(res == 'dev'){
						medicationDispensePerformerActorPractitioner = '';
						medicationDispensePerformerActorPatient  = '';
						medicationDispensePerformerActorRelatedPerson  = '';
						medicationDispensePerformerActorDevice  = medicationDispensePerformerActor;
					} else {
						medicationDispensePerformerActorPractitioner = '';
						medicationDispensePerformerActorPatient  = '';
						medicationDispensePerformerActorRelatedPerson  = medicationDispensePerformerActor;
						medicationDispensePerformerActorDevice  = '';
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor' in json Medication administration performer request.";
			}
			
			if(typeof req.body.dosage.text !== 'undefined'){
				var medicationDispenseDosageText =  req.body.dosage.text.trim().toLowerCase();
				if(validator.isEmpty(medicationDispenseDosageText)){
					err_code = 2;
					err_msg = "Medication administration text is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'text' in json Medication administration request.";
			}
			
			if(typeof req.body.dosage.site !== 'undefined'){
				var medicationDispenseDosageSite =  req.body.dosage.site.trim().toLowerCase();
				if(validator.isEmpty(medicationDispenseDosageSite)){
					err_code = 2;
					err_msg = "Medication administration site is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'site' in json Medication administration dosage request.";
			}
			
			if(typeof req.body.dosage.route !== 'undefined'){
				var medicationDispenseDosageRoute =  req.body.dosage.route.trim().toLowerCase();
				if(validator.isEmpty(medicationDispenseDosageRoute)){
					err_code = 2;
					err_msg = "Medication administration route is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'route' in json Medication administration dosage request.";
			}
			
			if(typeof req.body.dosage.method !== 'undefined'){
				var medicationDispenseDosageMethod =  req.body.dosage.method.trim().toLowerCase();
				if(validator.isEmpty(medicationDispenseDosageMethod)){
					err_code = 2;
					err_msg = "Medication administration method is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'method' in json Medication administration dosage request.";
			}
			
			if(typeof req.body.dosage.dose !== 'undefined'){
				var medicationDispenseDosageDose =  req.body.dosage.dose.trim().toLowerCase();
				if(validator.isEmpty(medicationDispenseDosageDose)){
					err_code = 2;
					err_msg = "Medication administration dose is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose' in json Medication administration dosage request.";
			}
			
			if(typeof req.body.dosage.rate.rateRatio !== 'undefined'){
				var medicationDispenseDosageRateRateRatio =  req.body.dosage.rate.rateRatio.trim().toLowerCase();
				if(validator.isEmpty(medicationDispenseDosageRateRateRatio)){
					err_code = 2;
					err_msg = "Medication administration rate rate ratio is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'rate ratio' in json Medication administration dosage rate request.";
			}
			
			if(typeof req.body.dosage.rate.rateQuantity !== 'undefined'){
				var medicationDispenseDosageRateRateQuantity =  req.body.dosage.rate.rateQuantity.trim().toLowerCase();
				if(validator.isEmpty(medicationDispenseDosageRateRateQuantity)){
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
						checkCode(apikey, medicationDispenseStatus, 'MEDICATION_ADMIN_STATUS', function(resMedicationDispenseStatus){
							if(resMedicationDispenseStatus.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								checkCode(apikey, medicationDispenseCategory, 'MEDICATION_ADMIN_CATEGORY', function(resMedicationDispenseCategory){
									if(resMedicationDispenseCategory.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, medicationDispenseMedicationCodeableConcept, 'MEDICATION_CODES', function(resMedicationDispenseMedicationCodeableConcept){
											if(resMedicationDispenseMedicationCodeableConcept.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, medicationDispenseReasonNotGiven, 'REASON_MEDICATION_NOT_GIVEN_CODES', function(resMedicationDispenseReasonNotGiven){
													if(resMedicationDispenseReasonNotGiven.err_code > 0){
														checkCode(apikey, medicationDispenseReasonCode, 'REASON_MEDICATION_GIVEN_CODES', function(resMedicationDispenseReasonCode){
															if(resMedicationDispenseReasonCode.err_code > 0){
																checkCode(apikey, medicationDispenseDosageSite, 'APPROACH_SITE_CODES', function(resMedicationDispenseDosageSite){
																	if(resMedicationDispenseDosageSite.err_code > 0){
																		checkCode(apikey, medicationDispenseDosageRoute, 'ROUTE_CODES', function(resMedicationDispenseDosageRoute){
																			if(resMedicationDispenseDosageRoute.err_code > 0){
																				checkCode(apikey, medicationDispenseDosageMethod, 'ADMINISTRATION_METHOD_CODES', function(resMedicationDispenseDosageMethod){
																					if(resMedicationDispenseDosageMethod.err_code > 0){
																						checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
																							if(resUniqeValue.err_code == 0){
																		
				myEmitter.prependOnceListener('checkMedicationDispenseId', function() {
					//proses insert
					MedicationDispensePerformer
					//set uniqe id
					var unicId = uniqid.time();
					var medicationDispenseId = 'mad' + unicId;
					var medicationDispensePerformerId = 'map' + unicId;
					var medicationDispenseDosageId = 'mad' + unicId;
					var identifierId = 'ide' + unicId;

					dataMedicationDispense = {
						"medication_administration_id" : medicationDispenseId,
						"status" : medicationDispenseStatus,
						"category" : medicationDispenseCategory, 
						"medication_codeable_concept" : medicationDispenseMedicationCodeableConcept,
						"medication_reference" : medicationDispenseMedicationReference,
						"subject_patient" : subjectPatient,
						"subject_group" : subjectGroup,
						"context_encounter" : contextEncounter,
						"context_episode_of_care" : contextEpisodeOfCare,
						"supporting_information" : medicationDispenseSupportingInformation,
						"effective_date_time" : medicationEffectiveExpirationDate,
						"effective_period_start" : effectivePeriodStart,
						"effective_period_end" : effectivePeriodEnd,
						"not_given" : medicationDispenseNotGiven,
						"reason_not_given" : medicationDispenseReasonNotGiven,
						"reason_code" : medicationDispenseReasonCode,
						"prescription" : medicationDispensePrescription
					}
					ApiFHIR.post('MedicationDispense', {"apikey": apikey}, {body: dataMedicationDispense, json: true}, function(error, response, body){
						medicationDispense = body;
						if(medicationDispense.err_code > 0){
							res.json(medicationDispense);	
						}
					})
					
					dataMedicationDispensePerformer = {
						"performer_id" : medicationDispensePerformerId,
						"actor_practitioner" : medicationDispensePerformerActorPractitioner,
						"actor_patient" : medicationDispensePerformerActorPatient,
						"actor_related_person" : medicationDispensePerformerActorRelatedPerson,
						"actor_device" : medicationDispensePerformerActorDevice,
						"on_behalf_of" : medicationDispensePerformerOnBehalfOf,
						"medication_administration_id" : medicationDispenseId
					}
					ApiFHIR.post('MedicationDispensePerformer', {"apikey": apikey}, {body: dataMedicationDispensePerformer, json: true}, function(error, response, body){
						medicationDispensePerformer = body;
						if(medicationDispensePerformer.err_code > 0){
							//console.log(medicationDispensePractitioner);
							res.json(medicationDispensePerformer);	
						}
					})

					dataMedicationDispenseDosage = {
						"dosage_id" : medicationDispenseDosageId,
						"text" : medicationDispenseDosageText,
						"site" : medicationDispenseDosageSite,
						"route" : medicationDispenseDosageRoute,
						"method" : medicationDispenseDosageMethod,
						"dose" : medicationDispenseDosageDose,
						"rate_ratio" : medicationDispenseDosageRateRateRatio,
						"rate_quality" : medicationDispenseDosageRateRateQuantity,
						"medication_administration_id" : medicationDispenseId
					}
					ApiFHIR.post('MedicationDispenseDosage', {"apikey": apikey}, {body: dataMedicationDispenseDosage, json: true}, function(error, response, body){
						medicationDispenseDosage = body;
						if(medicationDispenseDosage.err_code > 0){
							res.json(medicationDispenseDosage);	
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
						"medication_administration_id" : medicationDispenseId
					}

					ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
						identifier = body;
						if(identifier.err_code > 0){
							res.json(identifier);	
						}
					})

					res.json({"err_code": 0, "err_msg": "MedicationDispense has been add.", "data": [{"_id": medicationDispenseId}]})
				});

				myEmitter.prependOnceListener('checkMedicationDispenseManufacturerId', function(){
					if(validator.isEmpty(medicationDispenseManufacturer)){
						myEmitter.emit('checkMedicationDispenseId');
					}else{
						checkUniqeValue(apikey, "ORGANIZATION_ID|" + medicationDispenseManufacturer, 'ORGANIZATION', function(resManufacturerID){
							if(resManufacturerID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkMedicationDispenseId');
							}else{
								res.json({"err_code": 503, "err_msg": "Manufaturer id not found."});	
							}
						})
					}
				})
																		
				myEmitter.prependOnceListener('checkItemReferenceSubstanceId', function(){
					if(validator.isEmpty(medicationDispenseIngredientItemItemReferenceSubstance)){
						myEmitter.emit('checkMedicationDispenseManufacturerId');
					}else{
						checkUniqeValue(apikey, "SUBSTANCE_ID|" + medicationDispenseIngredientItemItemReferenceSubstance, 'SUBSTANCE', function(resItemReferenceSubstanceId){
							if(resItemReferenceSubstanceId.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkMedicationDispenseManufacturerId');
							}else{
								res.json({"err_code": 503, "err_msg": "Substance id not found."});	
							}
						})
					}
				})

				myEmitter.prependOnceListener('checkItemReferenceMedicationDispense', function(){
					if(validator.isEmpty(medicationDispenseIngredientItemItemReferenceMedicationDispense)){
						myEmitter.emit('checkItemReferenceSubstanceId');
					}else{
						checkUniqeValue(apikey, "MEDICATION_ID|" + medicationDispenseIngredientItemItemReferenceMedicationDispense, 'MEDICATION', function(resItemReferenceMedicationDispenseId){
							if(resItemReferenceMedicationDispenseId.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkItemReferenceSubstanceId');
							}else{
								res.json({"err_code": 503, "err_msg": "Item Reference Substance id not found."});	
							}
						})
					}
				})

				if(validator.isEmpty(medicationDispensePackageItemItemReference)){
					myEmitter.emit('checkItemReferenceMedicationDispense');
				}else{
					checkUniqeValue(apikey, "MEDICATION_ID|" + medicationDispensePackageItemItemReference, 'MEDICATION', function(resPackageItemItemReference){
						if(resPackageItemItemReference.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
							myEmitter.emit('checkItemReferenceMedicationDispense');
						}else{
							res.json({"err_code": 501, "err_msg": "Item Reference MedicationDispense id is not exist."});
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
		medicationDispense: function putMedicationDispense(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			
			var medicationDispenseId = req.params.medicationDispense_id;
			var err_code = 0;
			var err_msg = "";

			var dataMedicationDispense = {};
			
			//input check 
			if(typeof medicationDispenseId !== 'undefined'){
				if(validator.isEmpty(medicationDispenseId)){
					err_code = 2;
					err_msg = "MedicationDispense id is required";
				}
			}else{
				err_code = 2;
				err_msg = "MedicationDispense id is required";
			}
			
			if(typeof req.body.active !== 'undefined'){
				active =  req.body.active.trim().toLowerCase();
				if(validator.isEmpty(active)){
					err_code = 2;
					err_msg = "Active is required.";
				}else{
					dataMedicationDispense.active = active;
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
					dataMedicationDispense.type = type;
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
					dataMedicationDispense.name = name;
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
					dataMedicationDispense.alias = alias;
				}
			}else{
				alias = "";
			}			
			
			//Endpoint managingMedicationDispense
			if(typeof req.body.partOf !== 'undefined'){
				parentId =  req.body.partOf.trim().toLowerCase();
				if(validator.isEmpty(parentId)){
					err_code = 2;
					err_msg = "Managing MedicationDispense is required.";
				}else{
					dataMedicationDispense.parentId = parentId;
				}
			}else{
				parentId = "";
			}
			
			//Endpoint managingMedicationDispense
			if(typeof req.body.endpoint !== 'undefined'){
				endpointId =  req.body.endpoint.trim().toLowerCase();
				if(validator.isEmpty(endpointId)){
					err_code = 2;
					err_msg = "Endpoint is required.";
				}else{
					dataMedicationDispense.endpointId = endpointId;
				}
			}else{
				endpointId = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkMedicationDispenseID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + medicationDispenseId, 'IMMUNIZATION', function(resMedicationDispenseID){
								if(resMedicationDispenseID.err_code > 0){
									//console.log(dataEndpoint);
										ApiFHIR.put('medicationDispense', {"apikey": apikey, "_id": medicationDispenseId}, {body: dataMedicationDispense, json: true}, function(error, response, body){
											medicationDispense = body;
											if(medicationDispense.err_code > 0){
												res.json(medicationDispense);	
											}else{
												res.json({"err_code": 0, "err_msg": "MedicationDispense has been update.", "data": [{"_id": medicationDispenseId}]});
											}
										})
								}else{
									res.json({"err_code": 504, "err_msg": "MedicationDispense Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkType', function(){
							if(validator.isEmpty(type)){
								myEmitter.emit('checkMedicationDispenseID');
							}else{
								checkCode(apikey, type, 'IMMUNIZATION_TYPE', function(resStatusCode){
									if(resStatusCode.err_code > 0){
										myEmitter.emit('checkMedicationDispenseID');				
									}else{
										res.json({"err_code": 503, "err_msg": "Type Code not found."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkManagingMedicationDispense', function(){
							if(validator.isEmpty(parentId)){
								myEmitter.emit('checkType');
							}else{
								checkUniqeValue(apikey, "IMMUNIZATION_ID|" + parentId, 'IMMUNIZATION', function(resMedicationDispenseID){
									if(resMedicationDispenseID.err_code > 0){
										myEmitter.emit('checkType');				
									}else{
										res.json({"err_code": 503, "err_msg": "Parent Id MedicationDispense, medicationDispense id not found."});	
									}
								})
							}
						})

						if(validator.isEmpty(endpointId)){
							myEmitter.emit('checkManagingMedicationDispense');	
						}else{
							checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointID){
								if(resEndpointID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkManagingMedicationDispense');
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