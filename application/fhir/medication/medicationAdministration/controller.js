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
		medicationAdministration : function getMedicationAdministration(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			//params from query string
			var medicationAdministrationId = req.query._id;
			
			var code = req.query.code;
			var context = req.query.context;
			var device = req.query.device;
			var effective_time = req.query.effective_time;
			var identifier = req.query.identifier;
			var medication = req.query.medication;
			var not_given = req.query.not_given;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var prescription = req.query.prescription;
			var reason_given = req.query.reason_given;
			var reason_not_given = req.query.reason_not_given;
			var status = req.query.status;
			var subject = req.query.subject;
			
			var qString = {};
			if(typeof medicationAdministrationId !== 'undefined'){
				if(!validator.isEmpty(medicationAdministrationId)){
					qString._id = medicationAdministrationId; 
				}else{
					res.json({"err_code": 1, "err_msg": "medication administration id is required."});
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
			
			if(typeof device !== 'undefined'){
				if(!validator.isEmpty(device)){
					qString.device = device; 
				}else{
					res.json({"err_code": 1, "err_msg": "Device is empty."});
				}
			}
			
			if(typeof effective_time !== 'undefined') {
        if (!validator.isEmpty(effective_time)) {
          if (!regex.test(effective_time)) {
            res.json({
              "err_code": 1,
              "err_msg": "Effective time invalid format."
            });
          } else {
            qString.effective_time = effective_time;
          }
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Effective time is empty."
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
			
			if(typeof medication !== 'undefined'){
				if(!validator.isEmpty(medication)){
					qString.medication = medication; 
				}else{
					res.json({"err_code": 1, "err_msg": "Medication is empty."});
				}
			}
			
			if(typeof not_given !== 'undefined'){
				if(!validator.isEmpty(not_given)){
					qString.not_given = not_given; 
				}else{
					res.json({"err_code": 1, "err_msg": "Not given is empty."});
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
			
			if(typeof reason_given !== 'undefined'){
				if(!validator.isEmpty(reason_given)){
					qString.reason_given = reason_given; 
				}else{
					res.json({"err_code": 1, "err_msg": "Reason given is empty."});
				}
			}
			
			if(typeof reason_not_given !== 'undefined'){
				if(!validator.isEmpty(reason_not_given)){
					qString.reason_not_given = reason_not_given; 
				}else{
					res.json({"err_code": 1, "err_msg": "Reason not given is empty."});
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
				"MedicationAdministration" : {
					"location": "%(apikey)s/MedicationAdministration",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('MedicationAdministration', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var medicationAdministration = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(medicationAdministration.err_code == 0){
								//cek jumdata dulu
								if(medicationAdministration.data.length > 0){
									newMedicationAdministration = [];
									for(i=0; i < medicationAdministration.data.length; i++){
										myEmitter.once('getIdentifier', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
												qString = {};
												qString.medication_administration_id = medicationAdministration.id;
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
														var objectMedicationAdministration = {};
														objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
														objectMedicationAdministration.id = medicationAdministration.id;
														objectMedicationAdministration.identifier = identifier.data;
														objectMedicationAdministration.status = medicationAdministration.status;
														objectMedicationAdministration.category = medicationAdministration.category;
														objectMedicationAdministration.medication = medicationAdministration.medication;
														objectMedicationAdministration.subject = medicationAdministration.subject;
														objectMedicationAdministration.context = medicationAdministration.context;
														objectMedicationAdministration.supportingInformation = medicationAdministration.supportingInformation;
														objectMedicationAdministration.effective = medicationAdministration.effective;
														objectMedicationAdministration.notGiven = medicationAdministration.notGiven;
														objectMedicationAdministration.reasonNotGiven = medicationAdministration.reasonNotGiven;
														objectMedicationAdministration.reasonCode = medicationAdministration.reasonCode;
														objectMedicationAdministration.prescription = medicationAdministration.prescription;
														
														newMedicationAdministration[index] = objectMedicationAdministration;

														myEmitter.once('getMedicationAdministrationPerformer', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
															qString = {};
															qString.medication_administration_id = medicationAdministration.id;
															seedPhoenixFHIR.path.GET = {
																"MedicationAdministrationPerformer" : {
																	"location": "%(apikey)s/MedicationAdministrationPerformer",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('MedicationAdministrationPerformer', {"apikey": apikey}, {}, function(error, response, body){
																medicationAdministrationPerformer = JSON.parse(body);

																if(medicationAdministrationPerformer.err_code == 0){
																	var objectMedicationAdministration = {};
																	objectMedicationAdministration.id = medicationAdministration.id;
																	objectMedicationAdministration.identifier = medicationAdministration.identifier;
																	objectMedicationAdministration.status = medicationAdministration.status;
																	objectMedicationAdministration.category = medicationAdministration.category;
																	objectMedicationAdministration.medication = medicationAdministration.medication;
																	objectMedicationAdministration.subject = medicationAdministration.subject;
																	objectMedicationAdministration.context = medicationAdministration.context;
																	objectMedicationAdministration.supportingInformation = medicationAdministration.supportingInformation;
																	objectMedicationAdministration.effective = medicationAdministration.effective;
																	objectMedicationAdministration.performer = medicationAdministrationPerformer.data;
																	objectMedicationAdministration.notGiven = medicationAdministration.notGiven;
																	objectMedicationAdministration.reasonNotGiven = medicationAdministration.reasonNotGiven;
																	objectMedicationAdministration.reasonCode = medicationAdministration.reasonCode;
																	objectMedicationAdministration.prescription = medicationAdministration.prescription;
																	objectMedicationAdministration.prescription = medicationAdministration.prescription;

																	newMedicationAdministration[index] = objectMedicationAdministration;

																	myEmitter.once('getMedicationAdministrationDosage', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
																		qString = {};
																		qString.medication_administration_id = medicationAdministration.id;
																		seedPhoenixFHIR.path.GET = {
																			"MedicationAdministrationDosage" : {
																				"location": "%(apikey)s/MedicationAdministrationDosage",
																				"query": qString
																			}
																		}

																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																		ApiFHIR.get('MedicationAdministrationDosage', {"apikey": apikey}, {}, function(error, response, body){
																			medicationAdministrationDosage = JSON.parse(body);

																			if(medicationAdministrationDosage.err_code == 0){
																				var objectMedicationAdministration = {};
																				objectMedicationAdministration.id = medicationAdministration.id;
																				objectMedicationAdministration.identifier = medicationAdministration.identifier;
																				objectMedicationAdministration.status = medicationAdministration.status;
																				objectMedicationAdministration.category = medicationAdministration.category;
																				objectMedicationAdministration.medication = medicationAdministration.medication;
																				objectMedicationAdministration.subject = medicationAdministration.subject;
																				objectMedicationAdministration.context = medicationAdministration.context;
																				objectMedicationAdministration.supportingInformation = medicationAdministration.supportingInformation;
																				objectMedicationAdministration.effective = medicationAdministration.effective;
																				objectMedicationAdministration.performer = medicationAdministration.performer;
																				objectMedicationAdministration.notGiven = medicationAdministration.notGiven;
																				objectMedicationAdministration.reasonNotGiven = medicationAdministration.reasonNotGiven;
																				objectMedicationAdministration.reasonCode = medicationAdministration.reasonCode;
																				objectMedicationAdministration.prescription = medicationAdministration.prescription;
																				objectMedicationAdministration.prescription = medicationAdministration.prescription;
																				objectMedicationAdministration.dosage = medicationAdministrationDosage.data;

																				newMedicationAdministration[index] = objectMedicationAdministration;

																				if(index == countMedicationAdministration -1 ){
																					res.json({"err_code": 0, "data":newMedicationAdministration});	
																				}
																			}else{
																				res.json(medicationAdministrationDosage);			
																			}
																		})
																	})
																	myEmitter.emit('getMedicationAdministrationDosage', objectMedicationAdministration, index, newMedicationAdministration, countMedicationAdministration);
																}else{
																	res.json(medicationAdministrationPerformer);			
																}
															})
														})
														myEmitter.emit('getMedicationAdministrationPerformer', objectMedicationAdministration, index, newMedicationAdministration, countMedicationAdministration);			
													}else{
														res.json(identifier);			
													}
												})
											})				
										myEmitter.emit("getIdentifier", medicationAdministration.data[i], i, newMedicationAdministration, medicationAdministration.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Medication Administration is empty."});	
								}
							}else{
								res.json(medicationAdministration);
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
		medicationAdministration: function postMedicationAdministration(req, res){
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
			
			//medicationAdministration status
			if(typeof req.body.status !== 'undefined'){
				var medicationAdministrationStatus =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationStatus)){
					err_code = 2;
					err_msg = "Medication administration status is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Medication administration request.";
			}
			
			if(typeof req.body.category !== 'undefined'){
				var medicationAdministrationCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationCategory)){
					err_code = 2;
					err_msg = "Medication administration category is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Medication administration request.";
			}
			
			if(typeof req.body.medication.medicationCodeableConcept !== 'undefined'){
				var medicationAdministrationMedicationCodeableConcept =  req.body.medication.medicationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationMedicationCodeableConcept)){
					err_code = 2;
					err_msg = "Medication administration medication codeable concept is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'medication codeable concept' in json Medication administration request.";
			}
			
			if(typeof req.body.medication.medicationReference !== 'undefined'){
				var medicationAdministrationMedicationReference =  req.body.medication.medicationReference.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationMedicationReference)){
					medicationAdministrationMedicationReference = "";
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
				var medicationAdministrationSupportingInformation
				=  req.body.supportingInformation.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationSupportingInformation)){
					medicationAdministrationSupportingInformation = "";
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
				var medicationAdministrationNotGiven =  req.body.notGiven.trim().toLowerCase();
				if(medicationAdministrationNotGiven !== 'true' || medicationAdministrationNotGiven !== 'flase'){
					err_code = 3;
					err_msg = "Medication administration not given is't boolean";
				}
				if(validator.isEmpty(medicationAdministrationNotGiven)){
					err_code = 2;
					err_msg = "Medication administration not given is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'not given' in json Medication administration request.";
			}
			
			//medicationAdministration form
			if(typeof req.body.reasonNotGiven !== 'undefined'){
				var medicationAdministrationReasonNotGiven =  req.body.reasonNotGiven.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationReasonNotGiven)){
					err_code = 2;
					err_msg = "Medication administration reason not given is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason not given' in json Medication administration request.";
			}
			
			if(typeof req.body.reasonCode !== 'undefined'){
				var medicationAdministrationReasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationReasonCode)){
					err_code = 2;
					err_msg = "Medication administration reason code is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason code' in json Medication administration request.";
			}
			
			if(typeof req.body.prescription !== 'undefined'){
				var medicationAdministrationPrescription =  req.body.prescription.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationPrescription)){
					medicationAdministrationPrescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prescription' in json Medication administration request.";
			}
			
			if(typeof req.body.performer.onBehalfOf !== 'undefined'){
				var medicationAdministrationPerformerOnBehalfOf =  req.body.performer.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationPerformerOnBehalfOf)){
					medicationAdministrationPerformerOnBehalfOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'on be half of' in json Medication administration performer request.";
			}
			
			if(typeof req.body.performer.actor !== 'undefined'){
				var medicationAdministrationPerformerActor =  req.body.performer.actor.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationPerformerActor)){
					medicationAdministrationPerformerActorPractitioner = '';
					medicationAdministrationPerformerActorPatient  = '';
					medicationAdministrationPerformerActorRelatedPerson  = '';
					medicationAdministrationPerformerActorDevice  = '';
				} else {
					var res = medicationAdministrationPerformerActor.substring(0, 3);
					if(res == 'pra'){
						medicationAdministrationPerformerActorPractitioner = medicationAdministrationPerformerActor;
						medicationAdministrationPerformerActorPatient  = '';
						medicationAdministrationPerformerActorRelatedPerson  = '';
						medicationAdministrationPerformerActorDevice  = '';
					} else if(res == 'pat'){
						medicationAdministrationPerformerActorPractitioner = '';
						medicationAdministrationPerformerActorPatient  = medicationAdministrationPerformerActor;
						medicationAdministrationPerformerActorRelatedPerson  = '';
						medicationAdministrationPerformerActorDevice  = '';
					} else if(res == 'dev'){
						medicationAdministrationPerformerActorPractitioner = '';
						medicationAdministrationPerformerActorPatient  = '';
						medicationAdministrationPerformerActorRelatedPerson  = '';
						medicationAdministrationPerformerActorDevice  = medicationAdministrationPerformerActor;
					} else {
						medicationAdministrationPerformerActorPractitioner = '';
						medicationAdministrationPerformerActorPatient  = '';
						medicationAdministrationPerformerActorRelatedPerson  = medicationAdministrationPerformerActor;
						medicationAdministrationPerformerActorDevice  = '';
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor' in json Medication administration performer request.";
			}
			
			if(typeof req.body.dosage.text !== 'undefined'){
				var medicationAdministrationDosageText =  req.body.dosage.text.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationDosageText)){
					err_code = 2;
					err_msg = "Medication administration text is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'text' in json Medication administration request.";
			}
			
			if(typeof req.body.dosage.site !== 'undefined'){
				var medicationAdministrationDosageSite =  req.body.dosage.site.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationDosageSite)){
					err_code = 2;
					err_msg = "Medication administration site is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'site' in json Medication administration dosage request.";
			}
			
			if(typeof req.body.dosage.route !== 'undefined'){
				var medicationAdministrationDosageRoute =  req.body.dosage.route.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationDosageRoute)){
					err_code = 2;
					err_msg = "Medication administration route is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'route' in json Medication administration dosage request.";
			}
			
			if(typeof req.body.dosage.method !== 'undefined'){
				var medicationAdministrationDosageMethod =  req.body.dosage.method.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationDosageMethod)){
					err_code = 2;
					err_msg = "Medication administration method is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'method' in json Medication administration dosage request.";
			}
			
			if(typeof req.body.dosage.dose !== 'undefined'){
				var medicationAdministrationDosageDose =  req.body.dosage.dose.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationDosageDose)){
					err_code = 2;
					err_msg = "Medication administration dose is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose' in json Medication administration dosage request.";
			}
			
			if(typeof req.body.dosage.rate.rateRatio !== 'undefined'){
				var medicationAdministrationDosageRateRateRatio =  req.body.dosage.rate.rateRatio.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationDosageRateRateRatio)){
					err_code = 2;
					err_msg = "Medication administration rate rate ratio is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'rate ratio' in json Medication administration dosage rate request.";
			}
			
			if(typeof req.body.dosage.rate.rateQuantity !== 'undefined'){
				var medicationAdministrationDosageRateRateQuantity =  req.body.dosage.rate.rateQuantity.trim().toLowerCase();
				if(validator.isEmpty(medicationAdministrationDosageRateRateQuantity)){
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
						checkCode(apikey, medicationAdministrationStatus, 'MEDICATION_ADMIN_STATUS', function(resMedicationAdministrationStatus){
							if(resMedicationAdministrationStatus.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								checkCode(apikey, medicationAdministrationCategory, 'MEDICATION_ADMIN_CATEGORY', function(resMedicationAdministrationCategory){
									if(resMedicationAdministrationCategory.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, medicationAdministrationMedicationCodeableConcept, 'MEDICATION_CODES', function(resMedicationAdministrationMedicationCodeableConcept){
											if(resMedicationAdministrationMedicationCodeableConcept.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, medicationAdministrationReasonNotGiven, 'REASON_MEDICATION_NOT_GIVEN_CODES', function(resMedicationAdministrationReasonNotGiven){
													if(resMedicationAdministrationReasonNotGiven.err_code > 0){
														checkCode(apikey, medicationAdministrationReasonCode, 'REASON_MEDICATION_GIVEN_CODES', function(resMedicationAdministrationReasonCode){
															if(resMedicationAdministrationReasonCode.err_code > 0){
																checkCode(apikey, medicationAdministrationDosageSite, 'APPROACH_SITE_CODES', function(resMedicationAdministrationDosageSite){
																	if(resMedicationAdministrationDosageSite.err_code > 0){
																		checkCode(apikey, medicationAdministrationDosageRoute, 'ROUTE_CODES', function(resMedicationAdministrationDosageRoute){
																			if(resMedicationAdministrationDosageRoute.err_code > 0){
																				checkCode(apikey, medicationAdministrationDosageMethod, 'ADMINISTRATION_METHOD_CODES', function(resMedicationAdministrationDosageMethod){
																					if(resMedicationAdministrationDosageMethod.err_code > 0){
																						checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
																							if(resUniqeValue.err_code == 0){
																		
				myEmitter.prependOnceListener('checkMedicationAdministrationId', function() {
					//proses insert
					MedicationAdministrationPerformer
					//set uniqe id
					var unicId = uniqid.time();
					var medicationAdministrationId = 'mad' + unicId;
					var medicationAdministrationPerformerId = 'map' + unicId;
					var medicationAdministrationDosageId = 'mad' + unicId;
					var identifierId = 'ide' + unicId;

					dataMedicationAdministration = {
						"medication_administration_id" : medicationAdministrationId,
						"status" : medicationAdministrationStatus,
						"category" : medicationAdministrationCategory, 
						"medication_codeable_concept" : medicationAdministrationMedicationCodeableConcept,
						"medication_reference" : medicationAdministrationMedicationReference,
						"subject_patient" : subjectPatient,
						"subject_group" : subjectGroup,
						"context_encounter" : contextEncounter,
						"context_episode_of_care" : contextEpisodeOfCare,
						"supporting_information" : medicationAdministrationSupportingInformation,
						"effective_date_time" : medicationEffectiveExpirationDate,
						"effective_period_start" : effectivePeriodStart,
						"effective_period_end" : effectivePeriodEnd,
						"not_given" : medicationAdministrationNotGiven,
						"reason_not_given" : medicationAdministrationReasonNotGiven,
						"reason_code" : medicationAdministrationReasonCode,
						"prescription" : medicationAdministrationPrescription
					}
					ApiFHIR.post('MedicationAdministration', {"apikey": apikey}, {body: dataMedicationAdministration, json: true}, function(error, response, body){
						medicationAdministration = body;
						if(medicationAdministration.err_code > 0){
							res.json(medicationAdministration);	
						}
					})
					
					dataMedicationAdministrationPerformer = {
						"performer_id" : medicationAdministrationPerformerId,
						"actor_practitioner" : medicationAdministrationPerformerActorPractitioner,
						"actor_patient" : medicationAdministrationPerformerActorPatient,
						"actor_related_person" : medicationAdministrationPerformerActorRelatedPerson,
						"actor_device" : medicationAdministrationPerformerActorDevice,
						"on_behalf_of" : medicationAdministrationPerformerOnBehalfOf,
						"medication_administration_id" : medicationAdministrationId
					}
					ApiFHIR.post('MedicationAdministrationPerformer', {"apikey": apikey}, {body: dataMedicationAdministrationPerformer, json: true}, function(error, response, body){
						medicationAdministrationPerformer = body;
						if(medicationAdministrationPerformer.err_code > 0){
							//console.log(medicationAdministrationPractitioner);
							res.json(medicationAdministrationPerformer);	
						}
					})

					dataMedicationAdministrationDosage = {
						"dosage_id" : medicationAdministrationDosageId,
						"text" : medicationAdministrationDosageText,
						"site" : medicationAdministrationDosageSite,
						"route" : medicationAdministrationDosageRoute,
						"method" : medicationAdministrationDosageMethod,
						"dose" : medicationAdministrationDosageDose,
						"rate_ratio" : medicationAdministrationDosageRateRateRatio,
						"rate_quality" : medicationAdministrationDosageRateRateQuantity,
						"medication_administration_id" : medicationAdministrationId
					}
					ApiFHIR.post('MedicationAdministrationDosage', {"apikey": apikey}, {body: dataMedicationAdministrationDosage, json: true}, function(error, response, body){
						medicationAdministrationDosage = body;
						if(medicationAdministrationDosage.err_code > 0){
							res.json(medicationAdministrationDosage);	
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
						"medication_administration_id" : medicationAdministrationId
					}

					ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
						identifier = body;
						if(identifier.err_code > 0){
							res.json(identifier);	
						}
					})

					res.json({"err_code": 0, "err_msg": "MedicationAdministration has been add.", "data": [{"_id": medicationAdministrationId}]})
				});

				myEmitter.prependOnceListener('checkMedicationAdministrationManufacturerId', function(){
					if(validator.isEmpty(medicationAdministrationManufacturer)){
						myEmitter.emit('checkMedicationAdministrationId');
					}else{
						checkUniqeValue(apikey, "ORGANIZATION_ID|" + medicationAdministrationManufacturer, 'ORGANIZATION', function(resManufacturerID){
							if(resManufacturerID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkMedicationAdministrationId');
							}else{
								res.json({"err_code": 503, "err_msg": "Manufaturer id not found."});	
							}
						})
					}
				})
																		
				myEmitter.prependOnceListener('checkItemReferenceSubstanceId', function(){
					if(validator.isEmpty(medicationAdministrationIngredientItemItemReferenceSubstance)){
						myEmitter.emit('checkMedicationAdministrationManufacturerId');
					}else{
						checkUniqeValue(apikey, "SUBSTANCE_ID|" + medicationAdministrationIngredientItemItemReferenceSubstance, 'SUBSTANCE', function(resItemReferenceSubstanceId){
							if(resItemReferenceSubstanceId.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkMedicationAdministrationManufacturerId');
							}else{
								res.json({"err_code": 503, "err_msg": "Substance id not found."});	
							}
						})
					}
				})

				myEmitter.prependOnceListener('checkItemReferenceMedicationAdministration', function(){
					if(validator.isEmpty(medicationAdministrationIngredientItemItemReferenceMedicationAdministration)){
						myEmitter.emit('checkItemReferenceSubstanceId');
					}else{
						checkUniqeValue(apikey, "MEDICATION_ID|" + medicationAdministrationIngredientItemItemReferenceMedicationAdministration, 'MEDICATION', function(resItemReferenceMedicationAdministrationId){
							if(resItemReferenceMedicationAdministrationId.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkItemReferenceSubstanceId');
							}else{
								res.json({"err_code": 503, "err_msg": "Item Reference Substance id not found."});	
							}
						})
					}
				})

				if(validator.isEmpty(medicationAdministrationPackageItemItemReference)){
					myEmitter.emit('checkItemReferenceMedicationAdministration');
				}else{
					checkUniqeValue(apikey, "MEDICATION_ID|" + medicationAdministrationPackageItemItemReference, 'MEDICATION', function(resPackageItemItemReference){
						if(resPackageItemItemReference.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
							myEmitter.emit('checkItemReferenceMedicationAdministration');
						}else{
							res.json({"err_code": 501, "err_msg": "Item Reference MedicationAdministration id is not exist."});
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
		medicationAdministration: function putMedicationAdministration(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			
			var medicationAdministrationId = req.params.medicationAdministration_id;
			var err_code = 0;
			var err_msg = "";

			var dataMedicationAdministration = {};
			
			//input check 
			if(typeof medicationAdministrationId !== 'undefined'){
				if(validator.isEmpty(medicationAdministrationId)){
					err_code = 2;
					err_msg = "MedicationAdministration id is required";
				}
			}else{
				err_code = 2;
				err_msg = "MedicationAdministration id is required";
			}
			
			if(typeof req.body.active !== 'undefined'){
				active =  req.body.active.trim().toLowerCase();
				if(validator.isEmpty(active)){
					err_code = 2;
					err_msg = "Active is required.";
				}else{
					dataMedicationAdministration.active = active;
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
					dataMedicationAdministration.type = type;
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
					dataMedicationAdministration.name = name;
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
					dataMedicationAdministration.alias = alias;
				}
			}else{
				alias = "";
			}			
			
			//Endpoint managingMedicationAdministration
			if(typeof req.body.partOf !== 'undefined'){
				parentId =  req.body.partOf.trim().toLowerCase();
				if(validator.isEmpty(parentId)){
					err_code = 2;
					err_msg = "Managing MedicationAdministration is required.";
				}else{
					dataMedicationAdministration.parentId = parentId;
				}
			}else{
				parentId = "";
			}
			
			//Endpoint managingMedicationAdministration
			if(typeof req.body.endpoint !== 'undefined'){
				endpointId =  req.body.endpoint.trim().toLowerCase();
				if(validator.isEmpty(endpointId)){
					err_code = 2;
					err_msg = "Endpoint is required.";
				}else{
					dataMedicationAdministration.endpointId = endpointId;
				}
			}else{
				endpointId = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkMedicationAdministrationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + medicationAdministrationId, 'IMMUNIZATION', function(resMedicationAdministrationID){
								if(resMedicationAdministrationID.err_code > 0){
									//console.log(dataEndpoint);
										ApiFHIR.put('medicationAdministration', {"apikey": apikey, "_id": medicationAdministrationId}, {body: dataMedicationAdministration, json: true}, function(error, response, body){
											medicationAdministration = body;
											if(medicationAdministration.err_code > 0){
												res.json(medicationAdministration);	
											}else{
												res.json({"err_code": 0, "err_msg": "MedicationAdministration has been update.", "data": [{"_id": medicationAdministrationId}]});
											}
										})
								}else{
									res.json({"err_code": 504, "err_msg": "MedicationAdministration Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkType', function(){
							if(validator.isEmpty(type)){
								myEmitter.emit('checkMedicationAdministrationID');
							}else{
								checkCode(apikey, type, 'IMMUNIZATION_TYPE', function(resStatusCode){
									if(resStatusCode.err_code > 0){
										myEmitter.emit('checkMedicationAdministrationID');				
									}else{
										res.json({"err_code": 503, "err_msg": "Type Code not found."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkManagingMedicationAdministration', function(){
							if(validator.isEmpty(parentId)){
								myEmitter.emit('checkType');
							}else{
								checkUniqeValue(apikey, "IMMUNIZATION_ID|" + parentId, 'IMMUNIZATION', function(resMedicationAdministrationID){
									if(resMedicationAdministrationID.err_code > 0){
										myEmitter.emit('checkType');				
									}else{
										res.json({"err_code": 503, "err_msg": "Parent Id MedicationAdministration, medicationAdministration id not found."});	
									}
								})
							}
						})

						if(validator.isEmpty(endpointId)){
							myEmitter.emit('checkManagingMedicationAdministration');	
						}else{
							checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointID){
								if(resEndpointID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkManagingMedicationAdministration');
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