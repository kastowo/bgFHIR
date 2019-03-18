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
			var qString = {};

			//params from query string
			/*var medicationAdministrationId = req.query._id;
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

			if(typeof medicationAdministrationId !== 'undefined'){
				if(!validator.isEmpty(medicationAdministrationId)){
					qString.medicationAdministrationId = medicationAdministrationId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Care Team Id is required."});
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
			}*/

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
										myEmitter.once("getIdentifier", function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
											/*console.log(medicationAdministration);*/
														//get identifier
														qString = {};
														qString.immunization_recommendation_id = medicationAdministration.id;
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
																
																objectMedicationAdministration.patient = medicationAdministration.patient;
																
																newMedicationAdministration[index] = objectMedicationAdministration;
																
																/*if(index == countMedicationAdministration -1 ){
																	res.json({"err_code": 0, "data":newMedicationAdministration});				
																}
*/
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
																						objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
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
																						
																						newMedicationAdministration[index] = objectMedicationAdministration;

																						/*if(index == countMedicationAdministration -1 ){
																							res.json({"err_code": 0, "data":newMedicationAdministration});				
																						}*/
																						myEmitter.once('getMedicationAdministrationDosage', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
																							qString = {};
																							qString.medication_administration_id = medicationAdministration.recommendation.id;
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
																									objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
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
																									objectMedicationAdministration.dosage = medicationAdministrationDosage.data;

																									newMedicationAdministration[index] = objectMedicationAdministration;
																									
																									if(index == countMedicationAdministration -1 ){
																										res.json({"err_code": 0, "data":newMedicationAdministration});				
																									}

																									/*myEmitter.once('getSupportingImmunization', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
																										qString = {};
																										qString.recommendation_id = medicationAdministration.recommendation.id;
																										seedPhoenixFHIR.path.GET = {
																											"SupportingImmunization" : {
																												"location": "%(apikey)s/MedicationAdministrationSupportingImmunization",
																												"query": qString
																											}
																										}	
																										ApiFHIR.get('SupportingImmunization', {"apikey": apikey}, {}, function(error, response, body){
																											supportingImmunization = JSON.parse(body);
																											if(supportingImmunization.err_code == 0){
																												var objectMedicationAdministration = {};
objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
objectMedicationAdministration.id = medicationAdministration.id;
objectMedicationAdministration.identifier = medicationAdministration.identifier;
objectMedicationAdministration.patient = medicationAdministration.patient;
var Recommendation = {};
Recommendation.id = medicationAdministration.recommendation.id;
Recommendation.date = medicationAdministration.recommendation.date;
Recommendation.vaccineCode = medicationAdministration.recommendation.vaccine_code;
Recommendation.targetDisease = medicationAdministration.recommendation.target_disease;
Recommendation.doseNumber = medicationAdministration.recommendation.dose_number;
Recommendation.forecastStatus = medicationAdministration.recommendation.forecast_status;
Recommendation.dateCriterion = medicationAdministration.recommendation.dateCriterion;
Recommendation.protocol = medicationAdministration.recommendation.protocol;	
Recommendation.supportingImmunization = medicationAdministration.recommendation.supportingImmunization.data;
objectMedicationAdministration.recommendation = Recommendation;
																												

																												newMedicationAdministration[index] = objectMedicationAdministration;

																												myEmitter.once('getSupportingPatientInformationObservation', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
																													qString = {};
																													qString.recommendation_id = medicationAdministration.recommendation.id;
																													seedPhoenixFHIR.path.GET = {
																														"InformationObservation" : {
																															"location": "%(apikey)s/SupportingPatientInformationObservation",
																															"query": qString
																														}
																													}

																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																													ApiFHIR.get('InformationObservation', {"apikey": apikey}, {}, function(error, response, body){
																														informationObservation = JSON.parse(body);
																														if(informationObservation.err_code == 0){
																															var objectMedicationAdministration = {};
objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
objectMedicationAdministration.id = medicationAdministration.id;
objectMedicationAdministration.identifier = medicationAdministration.identifier;
objectMedicationAdministration.patient = medicationAdministration.patient;
var Recommendation = {};
Recommendation.id = medicationAdministration.recommendation.id;
Recommendation.date = medicationAdministration.recommendation.date;
Recommendation.vaccineCode = medicationAdministration.recommendation.vaccine_code;
Recommendation.targetDisease = medicationAdministration.recommendation.target_disease;
Recommendation.doseNumber = medicationAdministration.recommendation.dose_number;
Recommendation.forecastStatus = medicationAdministration.recommendation.forecast_status;
Recommendation.dateCriterion = medicationAdministration.recommendation.dateCriterion;
Recommendation.protocol = medicationAdministration.recommendation.protocol;
Recommendation.supportingImmunization = medicationAdministration.recommendation.supportingImmunization;	
var SupportingPatientInformation = {};
SupportingPatientInformation.observation = informationObservation.data;																
Recommendation.supportingPatientInformation = SupportingPatientInformation;
																															
objectMedicationAdministration.recommendation = Recommendation;

																															newMedicationAdministration[index] = objectMedicationAdministration;

																															myEmitter.once('getSupportingPatientInformationAllergyIntolerance', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
																																qString = {};
																																qString.recommendation_id = medicationAdministration.recommendation.id;
																																seedPhoenixFHIR.path.GET = {
																																	"InformationAllergyIntolerance" : {
																																		"location": "%(apikey)s/SupportingPatientInformationAllergyIntolerance",
																																		"query": qString
																																	}
																																}

																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																ApiFHIR.get('InformationAllergyIntolerance', {"apikey": apikey}, {}, function(error, response, body){
																																	informationAllergyIntolerance = JSON.parse(body);
																																	if(informationAllergyIntolerance.err_code == 0){
																																		var objectMedicationAdministration = {};
objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
objectMedicationAdministration.id = medicationAdministration.id;
objectMedicationAdministration.identifier = medicationAdministration.identifier;
objectMedicationAdministration.patient = medicationAdministration.patient;
var Recommendation = {};
Recommendation.id = medicationAdministration.recommendation.id;
Recommendation.date = medicationAdministration.recommendation.date;
Recommendation.vaccineCode = medicationAdministration.recommendation.vaccine_code;
Recommendation.targetDisease = medicationAdministration.recommendation.target_disease;
Recommendation.doseNumber = medicationAdministration.recommendation.dose_number;
Recommendation.forecastStatus = medicationAdministration.recommendation.forecast_status;
Recommendation.dateCriterion = medicationAdministration.recommendation.dateCriterion;
Recommendation.protocol = medicationAdministration.recommendation.protocol;
Recommendation.supportingImmunization = medicationAdministration.recommendation.supportingImmunization;	
var SupportingPatientInformation = {};
SupportingPatientInformation.observation = medicationAdministration.recommendation.supportingPatientInformation.observation;
																																		
SupportingPatientInformation.allergyIntolerance = informationAllergyIntolerance.data;
Recommendation.supportingPatientInformation = SupportingPatientInformation;
																																		
objectMedicationAdministration.recommendation = Recommendation;

																																		newMedicationAdministration[index] = objectMedicationAdministration;

																																		if(index == countMedicationAdministration -1 ){
																																			res.json({"err_code": 0, "data":newMedicationAdministration});				
																																		}

																																	}else{
																																		res.json(informationAllergyIntolerance);			
																																	}
																																})
																															})
																															myEmitter.emit('getSupportingPatientInformationAllergyIntolerance', objectMedicationAdministration, index, newMedicationAdministration, countMedicationAdministration);

																														}else{
																															res.json(informationObservation);			
																														}
																													})
																												})
																												myEmitter.emit('getSupportingPatientInformationObservation', objectMedicationAdministration, index, newMedicationAdministration, countMedicationAdministration);			
																											}else{
																												res.json(supportingImmunization);			
																											}
																										})
																									})
																									myEmitter.emit('getSupportingImmunization', objectMedicationAdministration, index, newMedicationAdministration, countMedicationAdministration);	*/		
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
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
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
		medicationAdministration : function addMedicationAdministration(req, res){
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
partOf.medicationAdministration|partOfMedicationAdministration||
partOf.procedure|partOfProcedure||
status|status||nn
category|category||
medication.medicationCodeableConcept|medicationMedicationCodeableConcept||nn
medication.medicationReference|medicationMedicationReference||
subject.patient|subjectPatient||
subject.group|subjectGroup||
context.encounter|contextEncounter||
context.episodeOfCare|contextEpisodeOfCare||
supportingInformation|supportingInformation||
effective.effectiveDateTime|effectiveEffectiveDateTime|date|nn
effective.effectivePeriod|effectiveEffectivePeriod|period|nn
performer.actor.practitioner|performerActorPractitioner||
performer.actor.patient|performerActorPatient||
performer.actor.relatedPerson|performerActorRelatedPerson||
performer.actor.device|performerActorDevice||
performer.onBehalfOf|performerOnBehalfOf||
notGiven|notGiven|boolean|
reasonNotGiven|reasonNotGiven||
reasonCode|reasonCode||
reasonReference.condition|reasonReferenceCondition||
reasonReference.observation|reasonReferenceObservation||
prescription|prescription||
device|device||
note.author.authorReference.practitioner|noteAuthorPractitioner||
note.author.authorReference.patient|noteAuthorPatient||
note.author.authorReference.relatedPerson|noteAuthorRelatedPerson||
note.author.authorString|noteAuthorAuthorString||
note.time|noteTime|date|
note.text|noteText||
dosage.text|dosageText||
dosage.site|dosageSite||
dosage.route|dosageRoute||
dosage.method|dosageMethod||
dosage.dose|dosageDose|integer|
dosage.rate.rateRatio|dosageRateRateRatio|ratio|
dosage.rate.rateQuantity|dosageRateRateQuantity||
eventHistory|eventHistory||
*/
			if(typeof req.body.definition.planDefinition !== 'undefined'){
				var definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					definitionPlanDefinition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'definition plan definition' in json Medication Administration request.";
			}

			if(typeof req.body.definition.activityDefinition !== 'undefined'){
				var definitionActivityDefinition =  req.body.definition.activityDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionActivityDefinition)){
					definitionActivityDefinition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'definition activity definition' in json Medication Administration request.";
			}

			if(typeof req.body.partOf.medicationAdministration !== 'undefined'){
				var partOfMedicationAdministration =  req.body.partOf.medicationAdministration.trim().toLowerCase();
				if(validator.isEmpty(partOfMedicationAdministration)){
					partOfMedicationAdministration = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'part of medication administration' in json Medication Administration request.";
			}

			if(typeof req.body.partOf.procedure !== 'undefined'){
				var partOfProcedure =  req.body.partOf.procedure.trim().toLowerCase();
				if(validator.isEmpty(partOfProcedure)){
					partOfProcedure = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'part of procedure' in json Medication Administration request.";
			}

			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Medication Administration status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Medication Administration request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Medication Administration request.";
			}

			if(typeof req.body.medication.medicationCodeableConcept !== 'undefined'){
				var medicationMedicationCodeableConcept =  req.body.medication.medicationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationCodeableConcept)){
					err_code = 2;
					err_msg = "Medication Administration medication medication codeable concept is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'medication medication codeable concept' in json Medication Administration request.";
			}

			if(typeof req.body.medication.medicationReference !== 'undefined'){
				var medicationMedicationReference =  req.body.medication.medicationReference.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationReference)){
					medicationMedicationReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'medication medication reference' in json Medication Administration request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Medication Administration request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Medication Administration request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Medication Administration request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Medication Administration request.";
			}

			if(typeof req.body.supportingInformation !== 'undefined'){
				var supportingInformation =  req.body.supportingInformation.trim().toLowerCase();
				if(validator.isEmpty(supportingInformation)){
					supportingInformation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'supporting information' in json Medication Administration request.";
			}

			if(typeof req.body.effective.effectiveDateTime !== 'undefined'){
				var effectiveEffectiveDateTime =  req.body.effective.effectiveDateTime;
				if(validator.isEmpty(effectiveEffectiveDateTime)){
					err_code = 2;
					err_msg = "Medication Administration effective effective date time is required.";
				}else{
					if(!regex.test(effectiveEffectiveDateTime)){
						err_code = 2;
						err_msg = "Medication Administration effective effective date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'effective effective date time' in json Medication Administration request.";
			}

			if (typeof req.body.effective.effectivePeriod !== 'undefined') {
			  var effectiveEffectivePeriod = req.body.effective.effectivePeriod;
			  if (effectiveEffectivePeriod.indexOf("to") > 0) {
			    arrEffectiveEffectivePeriod = effectiveEffectivePeriod.split("to");
			    var effectiveEffectivePeriodStart = arrEffectiveEffectivePeriod[0];
			    var effectiveEffectivePeriodEnd = arrEffectiveEffectivePeriod[1];
			    if (!regex.test(effectiveEffectivePeriodStart) && !regex.test(effectiveEffectivePeriodEnd)) {
			      err_code = 2;
			      err_msg = "Medication Administration effective effective period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "Medication Administration effective effective period invalid date format.";
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'effective effective period' in json Medication Administration request.";
			}

			if(typeof req.body.performer.actor.practitioner !== 'undefined'){
				var performerActorPractitioner =  req.body.performer.actor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerActorPractitioner)){
					performerActorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor practitioner' in json Medication Administration request.";
			}

			if(typeof req.body.performer.actor.patient !== 'undefined'){
				var performerActorPatient =  req.body.performer.actor.patient.trim().toLowerCase();
				if(validator.isEmpty(performerActorPatient)){
					performerActorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor patient' in json Medication Administration request.";
			}

			if(typeof req.body.performer.actor.relatedPerson !== 'undefined'){
				var performerActorRelatedPerson =  req.body.performer.actor.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(performerActorRelatedPerson)){
					performerActorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor related person' in json Medication Administration request.";
			}

			if(typeof req.body.performer.actor.device !== 'undefined'){
				var performerActorDevice =  req.body.performer.actor.device.trim().toLowerCase();
				if(validator.isEmpty(performerActorDevice)){
					performerActorDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor device' in json Medication Administration request.";
			}

			if(typeof req.body.performer.onBehalfOf !== 'undefined'){
				var performerOnBehalfOf =  req.body.performer.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(performerOnBehalfOf)){
					performerOnBehalfOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer on behalf of' in json Medication Administration request.";
			}

			if (typeof req.body.notGiven !== 'undefined') {
				var notGiven = req.body.notGiven.trim().toLowerCase();
					if(validator.isEmpty(notGiven)){
						notGiven = "false";
					}
				if(notGiven === "true" || notGiven === "false"){
					notGiven = notGiven;
				} else {
					err_code = 2;
					err_msg = "Medication Administration not given is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'not given' in json Medication Administration request.";
			}

			if(typeof req.body.reasonNotGiven !== 'undefined'){
				var reasonNotGiven =  req.body.reasonNotGiven.trim().toLowerCase();
				if(validator.isEmpty(reasonNotGiven)){
					reasonNotGiven = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason not given' in json Medication Administration request.";
			}

			if(typeof req.body.reasonCode !== 'undefined'){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					reasonCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason code' in json Medication Administration request.";
			}

			if(typeof req.body.reasonReference.condition !== 'undefined'){
				var reasonReferenceCondition =  req.body.reasonReference.condition.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceCondition)){
					reasonReferenceCondition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference condition' in json Medication Administration request.";
			}

			if(typeof req.body.reasonReference.observation !== 'undefined'){
				var reasonReferenceObservation =  req.body.reasonReference.observation.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceObservation)){
					reasonReferenceObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference observation' in json Medication Administration request.";
			}

			if(typeof req.body.prescription !== 'undefined'){
				var prescription =  req.body.prescription.trim().toLowerCase();
				if(validator.isEmpty(prescription)){
					prescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prescription' in json Medication Administration request.";
			}

			if(typeof req.body.device !== 'undefined'){
				var device =  req.body.device.trim().toLowerCase();
				if(validator.isEmpty(device)){
					device = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'device' in json Medication Administration request.";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					noteAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Medication Administration request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					noteAuthorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Medication Administration request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					noteAuthorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Medication Administration request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Medication Administration request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Medication Administration note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Medication Administration request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note text' in json Medication Administration request.";
			}

			if(typeof req.body.dosage.text !== 'undefined'){
				var dosageText =  req.body.dosage.text.trim().toLowerCase();
				if(validator.isEmpty(dosageText)){
					dosageText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage text' in json Medication Administration request.";
			}

			if(typeof req.body.dosage.site !== 'undefined'){
				var dosageSite =  req.body.dosage.site.trim().toLowerCase();
				if(validator.isEmpty(dosageSite)){
					dosageSite = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage site' in json Medication Administration request.";
			}

			if(typeof req.body.dosage.route !== 'undefined'){
				var dosageRoute =  req.body.dosage.route.trim().toLowerCase();
				if(validator.isEmpty(dosageRoute)){
					dosageRoute = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage route' in json Medication Administration request.";
			}

			if(typeof req.body.dosage.method !== 'undefined'){
				var dosageMethod =  req.body.dosage.method.trim().toLowerCase();
				if(validator.isEmpty(dosageMethod)){
					dosageMethod = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage method' in json Medication Administration request.";
			}

			if(typeof req.body.dosage.dose !== 'undefined'){
				var dosageDose =  req.body.dosage.dose;
				if(validator.isEmpty(dosageDose)){
					dosageDose = "";
				}else{
					if(validator.isInt(dosageDose)){
						err_code = 2;
						err_msg = "Medication Administration dosage dose is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage dose' in json Medication Administration request.";
			}

			if (typeof req.body.dosage.rate.rateRatio !== 'undefined') {
			  var dosageRateRateRatio = req.body.dosage.rate.rateRatio;
 				if(validator.isEmpty(dosageRateRateRatio)){
				  var dosageRateRateRatioNumerator = "";
				  var dosageRateRateRatioDenominator = "";
				} else {
				  if (dosageRateRateRatio.indexOf("to") > 0) {
				    arrDosageRateRateRatio = dosageRateRateRatio.split("to");
				    var dosageRateRateRatioNumerator = arrDosageRateRateRatio[0];
				    var dosageRateRateRatioDenominator = arrDosageRateRateRatio[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Medication Administration dosage rate rate ratio invalid ratio format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'dosage rate rate ratio' in json Medication Administration request.";
			}

			if(typeof req.body.dosage.rate.rateQuantity !== 'undefined'){
				var dosageRateRateQuantity =  req.body.dosage.rate.rateQuantity.trim().toLowerCase();
				if(validator.isEmpty(dosageRateRateQuantity)){
					dosageRateRateQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage rate rate quantity' in json Medication Administration request.";
			}

			if(typeof req.body.eventHistory !== 'undefined'){
				var eventHistory =  req.body.eventHistory.trim().toLowerCase();
				if(validator.isEmpty(eventHistory)){
					eventHistory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'event history' in json Medication Administration request.";
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
														var medicationAdministrationId = 'mad' + unicId;
														var medicationAdministrationPerformeId = 'map' + unicId;
														var medicationAdministrationDosageId = 'mad' + unicId;

														dataMedicationAdministration = {
															"medication_administration_id" : medicationAdministrationId,
															"status" : status,
															"category" : category,
															"medication_codeable_concept" : medicationMedicationCodeableConcept,
															"medication_reference" : medicationMedicationReference,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"context_encounter" : contextEncounter,
															"context_episode_of_care" : contextEpisodeOfCare,
															"supporting_information" : supportingInformation,
															"effective_date_time" : effectiveEffectiveDateTime,
															"effective_period_start" : effectiveEffectivePeriodStart,
															"effective_period_end" : effectiveEffectivePeriodEnd,
															"not_given" : notGiven,
															"reason_not_given" : reasonNotGiven,
															"reason_code" : reasonCode,
															"prescription" : prescription
														}
														console.log(dataMedicationAdministration);
														ApiFHIR.post('medicationAdministration', {"apikey": apikey}, {body: dataMedicationAdministration, json: true}, function(error, response, body){
															medicationAdministration = body;
															if(medicationAdministration.err_code > 0){
																res.json(medicationAdministration);	
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
																							"care_team_id": medicationAdministrationId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
																										
														//MedicationAdministrationRecommendation
														dataMedicationAdministrationPerformer = {
															"performer_id" : medicationAdministrationPerformeId,
															"actor_practitioner" : performerActorPractitioner,
															"actor_patient" : performerActorPatient,
															"actor_related_person" : performerActorRelatedPerson,
															"actor_device" : performerActorDevice,
															"on_behalf_of" : performerOnBehalfOf,
															"medication_administration_id" : medicationAdministrationId
														}
														ApiFHIR.post('medicationAdministrationPerformer', {"apikey": apikey}, {body: dataMedicationAdministrationPerformer, json: true}, function(error, response, body){
															medicationAdministrationPerformer = body;
															if(medicationAdministrationPerformer.err_code > 0){
																res.json(medicationAdministrationPerformer);	
																console.log("ok");
															}
														});
														
														//MedicationAdministrationDosage
														dataMedicationAdministrationDosage = {
															"dosage_id" : medicationAdministrationDosageId,
															"text" : dosageText,
															"site" : dosageSite,
															"route" : dosageRoute,
															"method" : dosageMethod,
															"dose" : dosageDose,
															"rate_ratio_numerator" : dosageRateRateRatioNumerator,
															"rate_ratio_denominator" : dosageRateRateRatioDenominator,												
															"rate_quality" : rateQuantity,
															"medication_administration_id" : medicationAdministrationId
														}
														ApiFHIR.post('medicationAdministrationDosage', {"apikey": apikey}, {body: dataMedicationAdministrationDosage, json: true}, function(error, response, body){
															medicationAdministrationDosage = body;
															if(medicationAdministrationDosage.err_code > 0){
																res.json(medicationAdministrationDosage);	
																console.log("ok");
															}
														});
														
														res.json({"err_code": 0, "err_msg": "Medication Administration has been add.", "data": [{"_id": medicationAdministrationId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
										status|medication_admin_status
										category|medication_admin_category
										medicationMedicationCodeableConcept|medication_codes
										reasonNotGiven|reason_medication_not_given_codes
										reasonCode|reason_medication_given_codes
										dosageSite|approach_site_codes
										dosageRoute|route_codes
										dosageMethod|administration_method_codes
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'MEDICATION_ADMIN_STATUS', function (resStatusCode) {
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
												checkCode(apikey, category, 'MEDICATION_ADMIN_CATEGORY', function (resCategoryCode) {
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

										myEmitter.prependOnceListener('checkMedicationMedicationCodeableConcept', function () {
											if (!validator.isEmpty(medicationMedicationCodeableConcept)) {
												checkCode(apikey, medicationMedicationCodeableConcept, 'MEDICATION_CODES', function (resMedicationMedicationCodeableConceptCode) {
													if (resMedicationMedicationCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Medication medication codeable concept code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkReasonNotGiven', function () {
											if (!validator.isEmpty(reasonNotGiven)) {
												checkCode(apikey, reasonNotGiven, 'REASON_MEDICATION_NOT_GIVEN_CODES', function (resReasonNotGivenCode) {
													if (resReasonNotGivenCode.err_code > 0) {
														myEmitter.emit('checkMedicationMedicationCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason not given code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkMedicationMedicationCodeableConcept');
											}
										})

										myEmitter.prependOnceListener('checkReasonCode', function () {
											if (!validator.isEmpty(reasonCode)) {
												checkCode(apikey, reasonCode, 'REASON_MEDICATION_GIVEN_CODES', function (resReasonCodeCode) {
													if (resReasonCodeCode.err_code > 0) {
														myEmitter.emit('checkReasonNotGiven');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonNotGiven');
											}
										})

										myEmitter.prependOnceListener('checkDosageSite', function () {
											if (!validator.isEmpty(dosageSite)) {
												checkCode(apikey, dosageSite, 'APPROACH_SITE_CODES', function (resDosageSiteCode) {
													if (resDosageSiteCode.err_code > 0) {
														myEmitter.emit('checkReasonCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Dosage site code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonCode');
											}
										})

										myEmitter.prependOnceListener('checkDosageRoute', function () {
											if (!validator.isEmpty(dosageRoute)) {
												checkCode(apikey, dosageRoute, 'ROUTE_CODES', function (resDosageRouteCode) {
													if (resDosageRouteCode.err_code > 0) {
														myEmitter.emit('checkDosageSite');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Dosage route code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDosageSite');
											}
										})

										myEmitter.prependOnceListener('checkDosageMethod', function () {
											if (!validator.isEmpty(dosageMethod)) {
												checkCode(apikey, dosageMethod, 'ADMINISTRATION_METHOD_CODES', function (resDosageMethodCode) {
													if (resDosageMethodCode.err_code > 0) {
														myEmitter.emit('checkDosageRoute');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Dosage method code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDosageRoute');
											}
										})

										//cek value
										/*
										definitionPlanDefinition|Plan_Definition
										definitionActivityDefinition|Activity_Definition
										partOfMedicationAdministration|Medication|Administration
										partOfProcedure|Procedure
										medicationMedicationReference|Medication
										subjectPatient|Patient
										subjectGroup|Group
										contextEncounter|Encounter
										contextEpisodeOfCare|Episode_Of_Care
										performerActorPractitioner|Practitioner
										performerActorPatient|Patient
										performerActorRelatedPerson|Related_Person
										performerActorDevice|Device
										performerOnBehalfOf|organization
										reasonReferenceCondition|Condition
										reasonReferenceObservation|Observation
										prescription|MedicationRequest
										device|device
										noteAuthorPractitioner|Practitioner
										noteAuthorPatient|Patient
										noteAuthorRelatedPerson|Related_Person
										eventHistory|eventHistory
										*/

										myEmitter.prependOnceListener('checkDefinitionPlanDefinition', function () {
											if (!validator.isEmpty(definitionPlanDefinition)) {
												checkUniqeValue(apikey, "PLAN_DEFINITION_ID|" + definitionPlanDefinition, 'PLAN_DEFINITION', function (resDefinitionPlanDefinition) {
													if (resDefinitionPlanDefinition.err_code > 0) {
														myEmitter.emit('checkDosageMethod');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Definition plan definition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDosageMethod');
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

										myEmitter.prependOnceListener('checkPartOfMedicationAdministration', function () {
											if (!validator.isEmpty(partOfMedicationAdministration)) {
												checkUniqeValue(apikey, "MEDICATION_ID|" + partOfMedicationAdministration, 'MEDICATION', function (resPartOfMedicationAdministration) {
													if (resPartOfMedicationAdministration.err_code > 0) {
														myEmitter.emit('checkDefinitionActivityDefinition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Part of medication administration id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDefinitionActivityDefinition');
											}
										})

										myEmitter.prependOnceListener('checkPartOfProcedure', function () {
											if (!validator.isEmpty(partOfProcedure)) {
												checkUniqeValue(apikey, "PROCEDURE_ID|" + partOfProcedure, 'PROCEDURE', function (resPartOfProcedure) {
													if (resPartOfProcedure.err_code > 0) {
														myEmitter.emit('checkPartOfMedicationAdministration');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Part of procedure id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPartOfMedicationAdministration');
											}
										})

										myEmitter.prependOnceListener('checkMedicationMedicationReference', function () {
											if (!validator.isEmpty(medicationMedicationReference)) {
												checkUniqeValue(apikey, "MEDICATION_ID|" + medicationMedicationReference, 'MEDICATION', function (resMedicationMedicationReference) {
													if (resMedicationMedicationReference.err_code > 0) {
														myEmitter.emit('checkPartOfProcedure');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Medication medication reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPartOfProcedure');
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

										myEmitter.prependOnceListener('checkPerformerActorPatient', function () {
											if (!validator.isEmpty(performerActorPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + performerActorPatient, 'PATIENT', function (resPerformerActorPatient) {
													if (resPerformerActorPatient.err_code > 0) {
														myEmitter.emit('checkPerformerActorPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer actor patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerActorPractitioner');
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

										myEmitter.prependOnceListener('checkReasonReferenceCondition', function () {
											if (!validator.isEmpty(reasonReferenceCondition)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + reasonReferenceCondition, 'CONDITION', function (resReasonReferenceCondition) {
													if (resReasonReferenceCondition.err_code > 0) {
														myEmitter.emit('checkPerformerOnBehalfOf');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason reference condition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerOnBehalfOf');
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

										myEmitter.prependOnceListener('checkPrescription', function () {
											if (!validator.isEmpty(prescription)) {
												checkUniqeValue(apikey, "MEDICATIONREQUEST_ID|" + prescription, 'MEDICATIONREQUEST', function (resPrescription) {
													if (resPrescription.err_code > 0) {
														myEmitter.emit('checkReasonReferenceObservation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Prescription id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonReferenceObservation');
											}
										})

										myEmitter.prependOnceListener('checkDevice', function () {
											if (!validator.isEmpty(device)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + device, 'DEVICE', function (resDevice) {
													if (resDevice.err_code > 0) {
														myEmitter.emit('checkPrescription');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Device id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPrescription');
											}
										})

										myEmitter.prependOnceListener('checkNoteAuthorPractitioner', function () {
											if (!validator.isEmpty(noteAuthorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorPractitioner, 'PRACTITIONER', function (resNoteAuthorPractitioner) {
													if (resNoteAuthorPractitioner.err_code > 0) {
														myEmitter.emit('checkDevice');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDevice');
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

										if (!validator.isEmpty(eventHistory)) {
											checkUniqeValue(apikey, "EVENTHISTORY_ID|" + eventHistory, 'EVENTHISTORY', function (resEventHistory) {
												if (resEventHistory.err_code > 0) {
													myEmitter.emit('checkNoteAuthorRelatedPerson');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Event history id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkNoteAuthorRelatedPerson');
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
		medicationAdministration : function putMedicationAdministration(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var medicationAdministrationId = req.params.adverse_event_id;

      var err_code = 0;
      var err_msg = "";
      var dataMedicationAdministration = {};

			if(typeof medicationAdministrationId !== 'undefined'){
				if(validator.isEmpty(medicationAdministrationId)){
					err_code = 2;
					err_msg = "Medication administration id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication administration id is required";
			}

						if(typeof req.body.definition.planDefinition !== 'undefined' && req.body.definition.planDefinition !== ""){
				dataMedicationAdministration.definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					err_code = 2;
					err_msg = "Medication administration definition plan definition is required.";
				}else{
					dataMedicationAdministration.definitionPlanDefinition = definitionPlanDefinition;
				}
			}else{
				definitionPlanDefinition = "";
			}

			if(typeof req.body.definition.activityDefinition !== 'undefined' && req.body.definition.activityDefinition !== ""){
				dataMedicationAdministration.definitionActivityDefinition =  req.body.definition.activityDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionActivityDefinition)){
					err_code = 2;
					err_msg = "Medication administration definition activity definition is required.";
				}else{
					dataMedicationAdministration.definitionActivityDefinition = definitionActivityDefinition;
				}
			}else{
				definitionActivityDefinition = "";
			}

			if(typeof req.body.partOf.medicationAdministration !== 'undefined' && req.body.partOf.medicationAdministration !== ""){
				dataMedicationAdministration.partOfMedicationAdministration =  req.body.partOf.medicationAdministration.trim().toLowerCase();
				if(validator.isEmpty(partOfMedicationAdministration)){
					err_code = 2;
					err_msg = "Medication administration part of medication administration is required.";
				}else{
					dataMedicationAdministration.partOfMedicationAdministration = partOfMedicationAdministration;
				}
			}else{
				partOfMedicationAdministration = "";
			}

			if(typeof req.body.partOf.procedure !== 'undefined' && req.body.partOf.procedure !== ""){
				dataMedicationAdministration.partOfProcedure =  req.body.partOf.procedure.trim().toLowerCase();
				if(validator.isEmpty(partOfProcedure)){
					err_code = 2;
					err_msg = "Medication administration part of procedure is required.";
				}else{
					dataMedicationAdministration.partOfProcedure = partOfProcedure;
				}
			}else{
				partOfProcedure = "";
			}

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				dataMedicationAdministration.status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Medication administration status is required.";
				}else{
					dataMedicationAdministration.status = status;
				}
			}else{
				status = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				dataMedicationAdministration.category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					err_code = 2;
					err_msg = "Medication administration category is required.";
				}else{
					dataMedicationAdministration.category = category;
				}
			}else{
				category = "";
			}

			if(typeof req.body.medication.medicationCodeableConcept !== 'undefined' && req.body.medication.medicationCodeableConcept !== ""){
				dataMedicationAdministration.medicationMedicationCodeableConcept =  req.body.medication.medicationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationCodeableConcept)){
					err_code = 2;
					err_msg = "Medication administration medication medication codeable concept is required.";
				}else{
					dataMedicationAdministration.medicationMedicationCodeableConcept = medicationMedicationCodeableConcept;
				}
			}else{
				medicationMedicationCodeableConcept = "";
			}

			if(typeof req.body.medication.medicationReference !== 'undefined' && req.body.medication.medicationReference !== ""){
				dataMedicationAdministration.medicationMedicationReference =  req.body.medication.medicationReference.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationReference)){
					err_code = 2;
					err_msg = "Medication administration medication medication reference is required.";
				}else{
					dataMedicationAdministration.medicationMedicationReference = medicationMedicationReference;
				}
			}else{
				medicationMedicationReference = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				dataMedicationAdministration.subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					err_code = 2;
					err_msg = "Medication administration subject patient is required.";
				}else{
					dataMedicationAdministration.subjectPatient = subjectPatient;
				}
			}else{
				subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				dataMedicationAdministration.subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					err_code = 2;
					err_msg = "Medication administration subject group is required.";
				}else{
					dataMedicationAdministration.subjectGroup = subjectGroup;
				}
			}else{
				subjectGroup = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				dataMedicationAdministration.contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					err_code = 2;
					err_msg = "Medication administration context encounter is required.";
				}else{
					dataMedicationAdministration.contextEncounter = contextEncounter;
				}
			}else{
				contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				dataMedicationAdministration.contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					err_code = 2;
					err_msg = "Medication administration context episode of care is required.";
				}else{
					dataMedicationAdministration.contextEpisodeOfCare = contextEpisodeOfCare;
				}
			}else{
				contextEpisodeOfCare = "";
			}

			if(typeof req.body.supportingInformation !== 'undefined' && req.body.supportingInformation !== ""){
				dataMedicationAdministration.supportingInformation =  req.body.supportingInformation.trim().toLowerCase();
				if(validator.isEmpty(supportingInformation)){
					err_code = 2;
					err_msg = "Medication administration supporting information is required.";
				}else{
					dataMedicationAdministration.supportingInformation = supportingInformation;
				}
			}else{
				supportingInformation = "";
			}

			if(typeof req.body.effective.effectiveDateTime !== 'undefined' && req.body.effective.effectiveDateTime !== ""){
				dataMedicationAdministration.effectiveEffectiveDateTime =  req.body.effective.effectiveDateTime;
				if(validator.isEmpty(effectiveEffectiveDateTime)){
					err_code = 2;
					err_msg = "medication administration effective effective date time is required.";
				}else{
					if(!regex.test(effectiveEffectiveDateTime)){
						err_code = 2;
						err_msg = "medication administration effective effective date time invalid date format.";	
					}
				}
			}else{
				effectiveEffectiveDateTime = "";
			}

			if (typeof req.body.effective.effectivePeriod !== 'undefined' && req.body.effective.effectivePeriod !== "") {
			  var effectiveEffectivePeriod = req.body.effective.effectivePeriod;
			  if (effectiveEffectivePeriod.indexOf("to") > 0) {
			    arrEffectiveEffectivePeriod = effectiveEffectivePeriod.split("to");
			    dataMedicationAdministration.effectiveEffectivePeriodStart = arrEffectiveEffectivePeriod[0];
			    dataMedicationAdministration.effectiveEffectivePeriodEnd = arrEffectiveEffectivePeriod[1];
			    if (!regex.test(effectiveEffectivePeriodStart) && !regex.test(effectiveEffectivePeriodEnd)) {
			      err_code = 2;
			      err_msg = "medication administration effective effective period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "medication administration effective effective period invalid date format.";
				}
			} else {
				effectiveEffectivePeriod = "";
			}

			if(typeof req.body.performer.actor.practitioner !== 'undefined' && req.body.performer.actor.practitioner !== ""){
				dataMedicationAdministration.performerActorPractitioner =  req.body.performer.actor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerActorPractitioner)){
					err_code = 2;
					err_msg = "Medication administration performer actor practitioner is required.";
				}else{
					dataMedicationAdministration.performerActorPractitioner = performerActorPractitioner;
				}
			}else{
				performerActorPractitioner = "";
			}

			if(typeof req.body.performer.actor.patient !== 'undefined' && req.body.performer.actor.patient !== ""){
				dataMedicationAdministration.performerActorPatient =  req.body.performer.actor.patient.trim().toLowerCase();
				if(validator.isEmpty(performerActorPatient)){
					err_code = 2;
					err_msg = "Medication administration performer actor patient is required.";
				}else{
					dataMedicationAdministration.performerActorPatient = performerActorPatient;
				}
			}else{
				performerActorPatient = "";
			}

			if(typeof req.body.performer.actor.relatedPerson !== 'undefined' && req.body.performer.actor.relatedPerson !== ""){
				dataMedicationAdministration.performerActorRelatedPerson =  req.body.performer.actor.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(performerActorRelatedPerson)){
					err_code = 2;
					err_msg = "Medication administration performer actor related person is required.";
				}else{
					dataMedicationAdministration.performerActorRelatedPerson = performerActorRelatedPerson;
				}
			}else{
				performerActorRelatedPerson = "";
			}

			if(typeof req.body.performer.actor.device !== 'undefined' && req.body.performer.actor.device !== ""){
				dataMedicationAdministration.performerActorDevice =  req.body.performer.actor.device.trim().toLowerCase();
				if(validator.isEmpty(performerActorDevice)){
					err_code = 2;
					err_msg = "Medication administration performer actor device is required.";
				}else{
					dataMedicationAdministration.performerActorDevice = performerActorDevice;
				}
			}else{
				performerActorDevice = "";
			}

			if(typeof req.body.performer.onBehalfOf !== 'undefined' && req.body.performer.onBehalfOf !== ""){
				dataMedicationAdministration.performerOnBehalfOf =  req.body.performer.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(performerOnBehalfOf)){
					err_code = 2;
					err_msg = "Medication administration performer on behalf of is required.";
				}else{
					dataMedicationAdministration.performerOnBehalfOf = performerOnBehalfOf;
				}
			}else{
				performerOnBehalfOf = "";
			}

			if (typeof req.body.notGiven !== 'undefined' && req.body.notGiven !== "") {
			  dataMedicationAdministration.notGiven = req.body.notGiven.trim().toLowerCase();
			  if(notGiven === "true" || notGiven === "false"){
					dataMedicationAdministration.notGiven = notGiven;
			  } else {
			    err_code = 2;
			    err_msg = "Medication administration not given is must be boolean.";
			  }
			} else {
			  notGiven = "";
			}

			if(typeof req.body.reasonNotGiven !== 'undefined' && req.body.reasonNotGiven !== ""){
				dataMedicationAdministration.reasonNotGiven =  req.body.reasonNotGiven.trim().toLowerCase();
				if(validator.isEmpty(reasonNotGiven)){
					err_code = 2;
					err_msg = "Medication administration reason not given is required.";
				}else{
					dataMedicationAdministration.reasonNotGiven = reasonNotGiven;
				}
			}else{
				reasonNotGiven = "";
			}

			if(typeof req.body.reasonCode !== 'undefined' && req.body.reasonCode !== ""){
				dataMedicationAdministration.reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					err_code = 2;
					err_msg = "Medication administration reason code is required.";
				}else{
					dataMedicationAdministration.reasonCode = reasonCode;
				}
			}else{
				reasonCode = "";
			}

			if(typeof req.body.reasonReference.condition !== 'undefined' && req.body.reasonReference.condition !== ""){
				dataMedicationAdministration.reasonReferenceCondition =  req.body.reasonReference.condition.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceCondition)){
					err_code = 2;
					err_msg = "Medication administration reason reference condition is required.";
				}else{
					dataMedicationAdministration.reasonReferenceCondition = reasonReferenceCondition;
				}
			}else{
				reasonReferenceCondition = "";
			}

			if(typeof req.body.reasonReference.observation !== 'undefined' && req.body.reasonReference.observation !== ""){
				dataMedicationAdministration.reasonReferenceObservation =  req.body.reasonReference.observation.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceObservation)){
					err_code = 2;
					err_msg = "Medication administration reason reference observation is required.";
				}else{
					dataMedicationAdministration.reasonReferenceObservation = reasonReferenceObservation;
				}
			}else{
				reasonReferenceObservation = "";
			}

			if(typeof req.body.prescription !== 'undefined' && req.body.prescription !== ""){
				dataMedicationAdministration.prescription =  req.body.prescription.trim().toLowerCase();
				if(validator.isEmpty(prescription)){
					err_code = 2;
					err_msg = "Medication administration prescription is required.";
				}else{
					dataMedicationAdministration.prescription = prescription;
				}
			}else{
				prescription = "";
			}

			if(typeof req.body.device !== 'undefined' && req.body.device !== ""){
				dataMedicationAdministration.device =  req.body.device.trim().toLowerCase();
				if(validator.isEmpty(device)){
					err_code = 2;
					err_msg = "Medication administration device is required.";
				}else{
					dataMedicationAdministration.device = device;
				}
			}else{
				device = "";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined' && req.body.note.author.authorReference.practitioner !== ""){
				dataMedicationAdministration.noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					err_code = 2;
					err_msg = "Medication administration note author author reference practitioner is required.";
				}else{
					dataMedicationAdministration.noteAuthorPractitioner = noteAuthorPractitioner;
				}
			}else{
				noteAuthorPractitioner = "";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined' && req.body.note.author.authorReference.patient !== ""){
				dataMedicationAdministration.noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					err_code = 2;
					err_msg = "Medication administration note author author reference patient is required.";
				}else{
					dataMedicationAdministration.noteAuthorPatient = noteAuthorPatient;
				}
			}else{
				noteAuthorPatient = "";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined' && req.body.note.author.authorReference.relatedPerson !== ""){
				dataMedicationAdministration.noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					err_code = 2;
					err_msg = "Medication administration note author author reference related person is required.";
				}else{
					dataMedicationAdministration.noteAuthorRelatedPerson = noteAuthorRelatedPerson;
				}
			}else{
				noteAuthorRelatedPerson = "";
			}

			if(typeof req.body.note.author.authorString !== 'undefined' && req.body.note.author.authorString !== ""){
				dataMedicationAdministration.noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					err_code = 2;
					err_msg = "Medication administration note author author string is required.";
				}else{
					dataMedicationAdministration.noteAuthorAuthorString = noteAuthorAuthorString;
				}
			}else{
				noteAuthorAuthorString = "";
			}

			if(typeof req.body.note.time !== 'undefined' && req.body.note.time !== ""){
				dataMedicationAdministration.noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					err_code = 2;
					err_msg = "medication administration note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "medication administration note time invalid date format.";	
					}
				}
			}else{
				noteTime = "";
			}

			if(typeof req.body.note.text !== 'undefined' && req.body.note.text !== ""){
				dataMedicationAdministration.noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					err_code = 2;
					err_msg = "Medication administration note text is required.";
				}else{
					dataMedicationAdministration.noteText = noteText;
				}
			}else{
				noteText = "";
			}

			if(typeof req.body.dosage.text !== 'undefined' && req.body.dosage.text !== ""){
				dataMedicationAdministration.dosageText =  req.body.dosage.text.trim().toLowerCase();
				if(validator.isEmpty(dosageText)){
					err_code = 2;
					err_msg = "Medication administration dosage text is required.";
				}else{
					dataMedicationAdministration.dosageText = dosageText;
				}
			}else{
				dosageText = "";
			}

			if(typeof req.body.dosage.site !== 'undefined' && req.body.dosage.site !== ""){
				dataMedicationAdministration.dosageSite =  req.body.dosage.site.trim().toLowerCase();
				if(validator.isEmpty(dosageSite)){
					err_code = 2;
					err_msg = "Medication administration dosage site is required.";
				}else{
					dataMedicationAdministration.dosageSite = dosageSite;
				}
			}else{
				dosageSite = "";
			}

			if(typeof req.body.dosage.route !== 'undefined' && req.body.dosage.route !== ""){
				dataMedicationAdministration.dosageRoute =  req.body.dosage.route.trim().toLowerCase();
				if(validator.isEmpty(dosageRoute)){
					err_code = 2;
					err_msg = "Medication administration dosage route is required.";
				}else{
					dataMedicationAdministration.dosageRoute = dosageRoute;
				}
			}else{
				dosageRoute = "";
			}

			if(typeof req.body.dosage.method !== 'undefined' && req.body.dosage.method !== ""){
				dataMedicationAdministration.dosageMethod =  req.body.dosage.method.trim().toLowerCase();
				if(validator.isEmpty(dosageMethod)){
					err_code = 2;
					err_msg = "Medication administration dosage method is required.";
				}else{
					dataMedicationAdministration.dosageMethod = dosageMethod;
				}
			}else{
				dosageMethod = "";
			}

			if(typeof req.body.dosage.dose !== 'undefined' && req.body.dosage.dose !== ""){
				dataMedicationAdministration.dosageDose =  req.body.dosage.dose;
				if(validator.isInt(dosageDose)){
					err_code = 2;
					err_msg = "medication administration dosage dose is must be number.";
				}
			}else{
				dosageDose = "";
			}

			if (typeof req.body.dosage.rate.rateRatio !== 'undefined' && req.body.dosage.rate.rateRatio !== "") {
			  var dosageRateRateRatio = req.body.dosage.rate.rateRatio;
			  if (dosageRateRateRatio.indexOf("to") > 0) {
			    arrDosageRateRateRatio = dosageRateRateRatio.split("to");
			    dataMedicationAdministration.dosageRateRateRatioNumerator = arrDosageRateRateRatio[0];
			    dataMedicationAdministration.dosageRateRateRatioDenominator = arrDosageRateRateRatio[1];
				} else {
			  	err_code = 2;
			  	err_msg = "medication administration dosage rate rate ratio invalid ratio format.";
				}
			} else {
			  dosageRateRateRatio = "";
			}

			if(typeof req.body.dosage.rate.rateQuantity !== 'undefined' && req.body.dosage.rate.rateQuantity !== ""){
				dataMedicationAdministration.dosageRateRateQuantity =  req.body.dosage.rate.rateQuantity.trim().toLowerCase();
				if(validator.isEmpty(dosageRateRateQuantity)){
					err_code = 2;
					err_msg = "Medication administration dosage rate rate quantity is required.";
				}else{
					dataMedicationAdministration.dosageRateRateQuantity = dosageRateRateQuantity;
				}
			}else{
				dosageRateRateQuantity = "";
			}

			if(typeof req.body.eventHistory !== 'undefined' && req.body.eventHistory !== ""){
				dataMedicationAdministration.eventHistory =  req.body.eventHistory.trim().toLowerCase();
				if(validator.isEmpty(eventHistory)){
					err_code = 2;
					err_msg = "Medication administration event history is required.";
				}else{
					dataMedicationAdministration.eventHistory = eventHistory;
				}
			}else{
				eventHistory = "";
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
														var medicationAdministrationId = 'ade' + unicId;

														dataMedicationAdministration = {
															"adverse_event_id" : medicationAdministrationId,
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
														console.log(dataMedicationAdministration);
														ApiFHIR.post('medicationAdministration', {"apikey": apikey}, {body: dataMedicationAdministration, json: true}, function(error, response, body){
															medicationAdministration = body;
															if(medicationAdministration.err_code > 0){
																res.json(medicationAdministration);	
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
																							"adverse_event_id": medicationAdministrationId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})*/

														res.json({"err_code": 0, "err_msg": "Care Team has been update.", "data": [{"_id": medicationAdministrationId}]});

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