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
		medicationStatement : function getMedicationStatement(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			//params from query string
			var medicationStatementId = req.query._id;
			var category = req.query.category;
			var code = req.query.code;
			var context = req.query.context;
			var effective = req.query.effective;
			var identifier = req.query.identifier;
			var medication = req.query.medication;
			var partOf = req.query.partOf;
			var patient = req.query.patient;
			source
			var status = req.query.status;
			var subject = req.query.subject;

			
			
			var qString = {};
			if(typeof medicationStatementId !== 'undefined'){
				if(!validator.isEmpty(medicationStatementId)){
					qString._id = medicationStatementId; 
				}else{
					res.json({"err_code": 1, "err_msg": "medication statement id is required."});
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
			
			if(typeof effective !== 'undefined') {
        if (!validator.isEmpty(effective)) {
          if (!regex.test(effective)) {
            res.json({
              "err_code": 1,
              "err_msg": "Effective invalid format."
            });
          } else {
            qString.effective = effective;
          }
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Effective is empty."
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
			
			if(typeof partOf !== 'undefined'){
				if(!validator.isEmpty(partOf)){
					qString.partOf = partOf; 
				}else{
					res.json({"err_code": 1, "err_msg": "Part of is empty."});
				}
			}
			
			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "Patient is empty."});
				}
			}
			
			if(typeof source !== 'undefined'){
				if(!validator.isEmpty(source)){
					qString.source = source; 
				}else{
					res.json({"err_code": 1, "err_msg": "Source is empty."});
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
				"MedicationStatement" : {
					"location": "%(apikey)s/MedicationStatement",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('MedicationStatement', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var medicationStatement = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(medicationStatement.err_code == 0){
								//cek jumdata dulu
								if(medicationStatement.data.length > 0){
									newMedicationStatement = [];
									for(i=0; i < medicationStatement.data.length; i++){
										myEmitter.once('getIdentifier', function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
												qString = {};
												qString.medication_statement_id = medicationStatement.id;
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
														var objectMedicationStatement = {};
														objectMedicationStatement.resourceType = medicationStatement.resourceType;
														objectMedicationStatement.id = medicationStatement.id;
														objectMedicationStatement.identifier = identifier.data;
														objectMedicationStatement.partOf = medicationStatement.partOf;
														objectMedicationStatement.context = medicationStatement.context;
														objectMedicationStatement.status = medicationStatement.status;
														objectMedicationStatement.category = medicationStatement.category;
														objectMedicationStatement.medication = medicationStatement.medication;
														objectMedicationStatement.effective = medicationStatement.effective;
														objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
														objectMedicationStatement.informationSource = medicationStatement.informationSource;
														objectMedicationStatement.subject = medicationStatement.subject;
														objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
														objectMedicationStatement.taken = medicationStatement.taken;
														objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
														objectMedicationStatement.reasonCode = medicationStatement.reasonCode;
														
														newMedicationStatement[index] = objectMedicationStatement;

														myEmitter.once('getMedicationStatementDosage', function(medicationStatement, index, newMedicationStatement, countMedicationStatement){
															qString = {};
															qString.medicationStatement_id = medicationStatement.id;
															seedPhoenixFHIR.path.GET = {
																"MedicationStatementDosage" : {
																	"location": "%(apikey)s/MedicationStatementDosage",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('MedicationStatementDosage', {"apikey": apikey}, {}, function(error, response, body){
																medicationStatementDosage = JSON.parse(body);

																if(medicationStatementDosage.err_code == 0){
																	var objectMedicationStatement = {};
																	objectMedicationStatement.resourceType = medicationStatement.resourceType;
																	objectMedicationStatement.id = medicationStatement.id;
																	objectMedicationStatement.identifier = medicationStatement.identifier;
																	objectMedicationStatement.partOf = medicationStatement.partOf;
																	objectMedicationStatement.context = medicationStatement.context;
																	objectMedicationStatement.status = medicationStatement.status;
																	objectMedicationStatement.category = medicationStatement.category;
																	objectMedicationStatement.medication = medicationStatement.medication;
																	objectMedicationStatement.effective = medicationStatement.effective;
																	objectMedicationStatement.dateAsserted = medicationStatement.dateAsserted;
																	objectMedicationStatement.informationSource = medicationStatement.informationSource;
																	objectMedicationStatement.subject = medicationStatement.subject;
																	objectMedicationStatement.derivedFrom = medicationStatement.derivedFrom;
																	objectMedicationStatement.taken = medicationStatement.taken;
																	objectMedicationStatement.reasonNotTaken = medicationStatement.reasonNotTaken;
																	objectMedicationStatement.reasonCode = medicationStatement.reasonCode;
																	objectMedicationStatement.dosage = medicationStatementDosage.data;

																	newMedicationStatement[index] = objectMedicationStatement;

																	if(index == countMedicationStatement -1 ){
																		res.json({"err_code": 0, "data":newMedicationStatement});	
																	}
																}else{
																	res.json(medicationStatementDosage);			
																}
															})
														})
														myEmitter.emit('getMedicationStatementDosage', objectMedicationStatement, index, newMedicationStatement, countMedicationStatement);			
													}else{
														res.json(identifier);			
													}
												})
											})				
										myEmitter.emit("getIdentifier", medicationStatement.data[i], i, newMedicationStatement, medicationStatement.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Medication Statement is empty."});	
								}
							}else{
								res.json(medicationStatement);
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
		medicationStatement: function postMedicationStatement(req, res){
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
			
			//kurang baseOn
			//kurang partOf
			
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
				err_msg = "Please add sub-key 'context' in json Medication statement request.";
			}
			
			//medicationStatement status
			if(typeof req.body.status !== 'undefined'){
				var medicationStatementStatus =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementStatus)){
					err_code = 2;
					err_msg = "Medication statement status is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Medication statement request.";
			}
			
			if(typeof req.body.category !== 'undefined'){
				var medicationStatementCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementCategory)){
					err_code = 2;
					err_msg = "Medication statement category is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Medication statement request.";
			}
			
			if(typeof req.body.medication.medicationCodeableConcept !== 'undefined'){
				var medicationStatementMedicationCodeableConcept =  req.body.medication.medicationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementMedicationCodeableConcept)){
					err_code = 2;
					err_msg = "Medication statement medication codeable concept is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'medication codeable concept' in json Medication statement request.";
			}
			
			if(typeof req.body.medication.medicationReference !== 'undefined'){
				var medicationStatementMedicationReference =  req.body.medication.medicationReference.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementMedicationReference)){
					medicationStatementMedicationReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'medication reference' in json Medication statement request.";
			}
			
			//date
			if(typeof req.body.effective.effectiveDateTime !== 'undefined'){
				var medicationEffectiveExpirationDate = req.body.effective.effectiveDateTime;
				if(!regex.test(medicationEffectiveExpirationDate)){
						err_code = 2;
						err_msg = "Medication effective expiration date invalid date format.";
					}	
			}else{
				medicationEffectiveExpirationDate = "";
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
			
			if(typeof req.body.dateAsserted !== 'undefined'){
				var medicationDateAsserted = req.body.dateAsserted;
				if(!regex.test(medicationDateAsserted)){
						err_code = 2;
						err_msg = "Medication date asserted invalid date format.";
					}	
			}else{
				medicationDateAsserted = "";
			}
			
			if(typeof req.body.informationSource !== 'undefined'){
				informationSource =  req.body.informationSource.trim().toLowerCase();
				if(validator.isEmpty(informationSource)){
					informationSourcePatient = '';
					informationSourcePractitioner = '';
					informationSourceRelatedPerson = '';
					informationSourceOrganization = '';
				} else {
					var res = informationSource.substring(0, 3);
					if(res == 'pat'){
						informationSourcePatient = informationSource;
						informationSourcePractitioner = '';
						informationSourceRelatedPerson = '';
						informationSourceOrganization = '';
					} else if(res == 'pra'){
						informationSourcePatient = '';
						informationSourcePractitioner = informationSource;
						informationSourceRelatedPerson = '';
						informationSourceOrganization = '';
					} else if(res == 'org'){
						informationSourcePatient = '';
						informationSourcePractitioner = '';
						informationSourceRelatedPerson = '';
						informationSourceOrganization = informationSource;
					} else {
						informationSourcePatient = '';
						informationSourcePractitioner = '';
						informationSourceRelatedPerson = informationSource;
						informationSourceOrganization = '';
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject' in json Medication statement request.";
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
				err_msg = "Please add sub-key 'subject' in json Medication statement request.";
			}
			
			if(typeof req.body.derivedFrom !== 'undefined'){
				var medicationDerivedFrom
				=  req.body.derivedFrom.trim().toLowerCase();
				if(validator.isEmpty(medicationDerivedFrom)){
					medicationDerivedFrom = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'derived from' in json Medication statement request.";
			}
			
			if(typeof req.body.taken !== 'undefined'){
				var medicationStatementTaken =  req.body.taken.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementTaken)){
					err_code = 2;
					err_msg = "Medication administration taken is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'taken' in json Medication statement request.";
			}
			
			if(typeof req.body.reasonNotTaken !== 'undefined'){
				var medicationStatementReasonNotTaken =  req.body.reasonNotTaken.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementReasonNotTaken)){
					err_code = 2;
					err_msg = "Medication administration reason not taken is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason not taken' in json Medication statement request.";
			}
			
			if(typeof req.body.reasonCode !== 'undefined'){
				var medicationStatementReasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementReasonCode)){
					err_code = 2;
					err_msg = "Medication administration reason code is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason code' in json Medication statement request.";
			}

			if (typeof req.body.dosage.sequence !== 'undefined') {
        var medicationStatementDosageSequence = req.body.dosage.sequence.trim().toLowerCase();
        if (!validator.isInt(medicationStatementDosageSequence)) {
          err_code = 2;
          err_msg = "Dosage sequence is must be number.";
        }
      } else {
        err_code = 1;
				err_msg = "Please add sub-key 'dosage sequence' in json Medication statement request.";
      }
			
			if(typeof req.body.dosage.text !== 'undefined'){
				var medicationStatementDosageText =  req.body.dosage.text.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementDosageText)){
					err_code = 2;
          err_msg = "Dosage text is must be number.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage text' in json Medication statement request.";
			}
			
			if(typeof req.body.dosage.additionalInstruction !== 'undefined'){
				var medicationStatementDosageAdditionalInstruction =  req.body.dosage.additionalInstruction.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementDosageAdditionalInstruction)){
					err_code = 2;
          err_msg = "Dosage additional instruction is must be number.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage additional instruction' in json Medication statement request.";
			}
			
			if(typeof req.body.dosage.patientInstruction !== 'undefined'){
				var medicationStatementDosagePatientInstruction =  req.body.dosage.patientInstruction.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementDosagePatientInstruction)){
					err_code = 2;
          err_msg = "Dosage patient instruction is must be number.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage patient instruction' in json Medication statement request.";
			}
			
			if(typeof req.body.dosage.timing !== 'undefined'){
				var medicationStatementDosageTiming =  req.body.dosage.timing.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementDosageTiming)){
					err_code = 2;
          err_msg = "Dosage timing is must be number.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage timing' in json Medication statement request.";
			}
			
			if(typeof req.body.dosage.asNeeded.asNeededBoolean !== 'undefined'){
				var medicationStatementDosageAsNeededBoolean =  req.body.dosage.asNeeded.asNeededBoolean.trim().toLowerCase();
				if(medicationStatementDosageAsNeededBoolean !== 'true' || medicationStatementDosageAsNeededBoolean !== 'flase'){
					err_code = 3;
					err_msg = "Medication statement as needed boolean is't boolean";
				}
				if(validator.isEmpty(medicationStatementDosageAsNeededBoolean)){
					err_code = 2;
					err_msg = "Medication statement as needed boolean is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage as needed boolean' in json Medication statement request.";
			}
			
			if(typeof req.body.dosage.asNeeded.asNeededCodeableConcept !== 'undefined'){
				var medicationStatementDosageAsNeededCodeableConcept =  req.body.dosage.asNeeded.asNeededCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementDosageText)){
					err_code = 2;
					err_msg = "Medication statement as needed codeable concept is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'as needed codeable concept' in json Medication statement request.";
			}

			if(typeof req.body.dosage.site !== 'undefined'){
				var medicationStatementDosageSite =  req.body.dosage.site.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementDosageSite)){
					err_code = 2;
					err_msg = "Medication statement site is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'site' in json Medication statement dosage request.";
			}
			
			if(typeof req.body.dosage.route !== 'undefined'){
				var medicationStatementDosageRoute =  req.body.dosage.route.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementDosageRoute)){
					err_code = 2;
					err_msg = "Medication statement route is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'route' in json Medication statement dosage request.";
			}
			
			if(typeof req.body.dosage.method !== 'undefined'){
				var medicationStatementDosageMethod =  req.body.dosage.method.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementDosageMethod)){
					err_code = 2;
					err_msg = "Medication statement method is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'method' in json Medication statement dosage request.";
			}
			
			if(typeof req.body.dosage.dose.doseRange !== 'undefined'){
				var medicationStatementDosageDoseRatio =  req.body.dosage.dose.doseRange.trim().toLowerCase();
				if(medicationStatementDosageDoseRatio.indexOf("to") > 0){
					arrRange = medicationStatementDosageDoseRatio.split("to");
					medicationStatementDosageDoseRatioLow = arrRange[0];
					medicationStatementDosageDoseRatioHigh	 = arrRange[1];

					if(!regex.test(medicationStatementDosageDoseRatioLow) && !regex.test(medicationStatementDosageDoseRatioHigh)){
						err_code = 2;
						err_msg = "Dose ratio invalid date format.";
					}	
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'Dose ratio' in json Medication statement dosage rate request.";
			}
			
			if(typeof req.body.dosage.dose.doseQuantity !== 'undefined'){
				var medicationStatementDosageDoseQuantity =  req.body.dosage.dose.doseQuantity.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementDosageRateRateQuantity)){
					err_code = 2;
					err_msg = "Medication statement dose quantity is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose quantity' in json Medication statement dosage rate request.";
			}
			
			if(typeof req.body.dosage.maxDosePerPeriod !== 'undefined'){
				var medicationStatementDosageMaxDosePerPeriod =  req.body.dosage.maxDosePerPeriod.trim().toLowerCase();
				if(medicationStatementDosageMaxDosePerPeriod.indexOf("to") > 0){
					arrPeriod = medicationStatementDosageMaxDosePerPeriod.split("to");
					medicationStatementDosageMaxDosePerPeriodStart = arrPeriod[0];
					medicationStatementDosageMaxDosePerPeriodEnd	 = arrPeriod[1];

					if(!regex.test(medicationStatementDosageMaxDosePerPeriodStart) && !regex.test(medicationStatementDosageMaxDosePerPeriodEnd)){
						err_code = 2;
						err_msg = "Dose ratio invalid date format.";
					}	
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'Dose ratio' in json Medication statement dosage rate request.";
			}
			
			if(typeof req.body.dosage.maxDosePerAdministration !== 'undefined'){
				var medicationStatementDosageMaxDosePerAdministration =  req.body.dosage.maxDosePerAdministration.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementDosageMaxDosePerAdministration)){
					err_code = 2;
					err_msg = "Medication statement max dose per administration is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'max dose per administration' in json Medication statement dosage rate request.";
			}
			
			if(typeof req.body.dosage.maxDosePerLifetime !== 'undefined'){
				var medicationStatementDosageMaxDosePerLifetime =  req.body.dosage.maxDosePerLifetime.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementDosageMaxDosePerLifetime)){
					err_code = 2;
					err_msg = "Medication statement max dose per lifetime is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'max dose per lifetime' in json Medication statement dosage rate request.";
			}
			
			if(typeof req.body.dosage.rate.rateRatio !== 'undefined'){
				var medicationStatementDosageRateRateRatio =  req.body.dosage.rate.rateRatio.trim().toLowerCase();
				if(medicationStatementDosageRateRateRatio.indexOf("to") > 0){
					arrPeriod = medicationStatementDosageRateRateRatio.split("to");
					medicationStatementDosageRateRateRatioNumerator = arrPeriod[0];
					medicationStatementDosageRateRateRatioDenominator	 = arrPeriod[1];

					if(!regex.test(medicationStatementDosageRateRateRatioNumerator) && !regex.test(medicationStatementDosageRateRateRatioDenominator)){
						err_code = 2;
						err_msg = "Rate ratio invalid date format.";
					}	
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'rate ratio' in json Medication statement dosage rate request.";
			}
			
			if(typeof req.body.dosage.rate.rateRange !== 'undefined'){
				var medicationStatementDosageRateRatio =  req.body.dosage.rate.rateRange.trim().toLowerCase();
				if(medicationStatementDosageRateRatio.indexOf("to") > 0){
					arrRange = medicationStatementDosageRateRatio.split("to");
					medicationStatementDosageRateRatioLow = arrRange[0];
					medicationStatementDosageRateRatioHigh	 = arrRange[1];

					if(!regex.test(medicationStatementDosageRateRatioLow) && !regex.test(medicationStatementDosageRateRatioHigh)){
						err_code = 2;
						err_msg = "Rate ratio invalid date format.";
					}	
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'rate ratio' in json Medication statement dosage rate request.";
			}
			
			if(typeof req.body.dosage.rate.rateQuantity !== 'undefined'){
				var medicationStatementDosageRateRateQuantity =  req.body.dosage.rate.rateQuantity.trim().toLowerCase();
				if(validator.isEmpty(medicationStatementDosageRateRateQuantity)){
					err_code = 2;
					err_msg = "Medication statement rate rate quantity is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'rate quantity' in json Medication statement dosage rate request.";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkCode(apikey, medicationStatementStatus, 'MEDICATION_ADMIN_STATUS', function(resMedicationStatementStatus){
							if(resMedicationStatementStatus.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								checkCode(apikey, medicationStatementCategory, 'MEDICATION_ADMIN_CATEGORY', function(resMedicationStatementCategory){
									if(resMedicationStatementCategory.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, medicationStatementMedicationCodeableConcept, 'MEDICATION_CODES', function(resMedicationStatementMedicationCodeableConcept){
											if(resMedicationStatementMedicationCodeableConcept.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, medicationStatementReasonNotGiven, 'REASON_MEDICATION_NOT_GIVEN_CODES', function(resMedicationStatementReasonNotGiven){
													if(resMedicationStatementReasonNotGiven.err_code > 0){
														checkCode(apikey, medicationStatementReasonCode, 'REASON_MEDICATION_GIVEN_CODES', function(resMedicationStatementReasonCode){
															if(resMedicationStatementReasonCode.err_code > 0){
																checkCode(apikey, medicationStatementDosageSite, 'APPROACH_SITE_CODES', function(resMedicationStatementDosageSite){
																	if(resMedicationStatementDosageSite.err_code > 0){
																		checkCode(apikey, medicationStatementDosageRoute, 'ROUTE_CODES', function(resMedicationStatementDosageRoute){
																			if(resMedicationStatementDosageRoute.err_code > 0){
																				checkCode(apikey, medicationStatementDosageMethod, 'ADMINISTRATION_METHOD_CODES', function(resMedicationStatementDosageMethod){
																					if(resMedicationStatementDosageMethod.err_code > 0){
																						checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
																							if(resUniqeValue.err_code == 0){
																		
				myEmitter.prependOnceListener('checkMedicationStatementId', function() {
					//proses insert
					MedicationStatementPerformer
					//set uniqe id
					var unicId = uniqid.time();
					var medicationStatementId = 'mad' + unicId;
					var medicationStatementDosageId = 'mad' + unicId;
					var identifierId = 'ide' + unicId;

					dataMedicationStatement = {
						"medication_statement_id" : medicationStatementId,
						"context_encounter" : contextEncounter,
						"context_episode_of_care" : contextEpisodeOfCare,
						"status" : medicationStatementStatus,
						"category" : medicationStatementCategory,
						"medication_codeable_concept" : medicationStatementMedicationCodeableConcept,
						"medication_reference" : medicationStatementMedicationReference,
						"effective_date_time" : medicationEffectiveExpirationDate,
						"effective_period_start" : effectivePeriodStart,
						"effective_period_end" : effectivePeriodEnd,
						"date_asserted" : medicationDateAsserted,
						"information_source_patient" : informationSourcePatient,
						"information_source_practitioner" : informationSourcePractitioner,
						"information_source_related_person" : informationSourceRelatedPerson,
						"information_source_organization" : informationSourceOrganization,
						"subject_patient" : subjectPatient,
						"subject_group" : subjectGroup,
						"derived_from" : medicationDerivedFrom,
						"taken" : medicationStatementTaken,
						"reason_not_taken" : medicationStatementReasonNotTaken,
						"reason_code" : medicationStatementReasonCode
					}
					ApiFHIR.post('MedicationStatement', {"apikey": apikey}, {body: dataMedicationStatement, json: true}, function(error, response, body){
						medicationStatement = body;
						if(medicationStatement.err_code > 0){
							res.json(medicationStatement);	
						}
					})
					
					dataMedicationStatementPerformer = {
						"dosage_id" : medicationStatementDosageId,
						"sequence" : medicationStatementDosageSequence,
						"text" : medicationStatementDosageText,
						"additional_instruction" : medicationStatementDosageAdditionalInstruction,
						"patient_instruction" : medicationStatementDosagePatientInstruction,
						"timing_id" : medicationStatementDosageTiming,
						"as_needed_boolean" : medicationStatementDosageAsNeededBoolean,
						"as_needed_codeable_concept" : medicationStatementDosageAsNeededCodeableConcept,
						"site" : medicationStatementDosageSite,
						"route" : medicationStatementDosageRoute,
						"method" : medicationStatementDosageMethod,
						"dose_range_low" : medicationStatementDosageDoseRatioLow,
						"dose_range_high" : medicationStatementDosageDoseRatioHigh,
						"dose_quantity" : medicationStatementDosageDoseQuantity,
						"max_dose_per_period_numerator" : medicationStatementDosageMaxDosePerPeriodStart,
						"max_dose_per_period_denominator" : medicationStatementDosageMaxDosePerPeriodEnd,
						"max_dose_per_administration" : medicationStatementDosageMaxDosePerAdministration,
						"max_dose_per_lifetime" : medicationStatementDosageMaxDosePerLifetime,
						"rate_ratio_numerator" : medicationStatementDosageRateRateRatioNumerator,
						"rate_ratio_denominator" : medicationStatementDosageRateRateRatioDenominator,
						"rate_range_low" : medicationStatementDosageRateRatioLow,
						"rate_range_high" : medicationStatementDosageRateRatioHigh,
						"rate_quantity" : medicationStatementDosageRateRateQuantity,
						"medication_statement_id" : medicationStatementId
					}
					ApiFHIR.post('MedicationStatementDosage', {"apikey": apikey}, {body: dataMedicationStatementPerformer, json: true}, function(error, response, body){
						medicationStatementPerformer = body;
						if(medicationStatementPerformer.err_code > 0){
							//console.log(medicationStatementPractitioner);
							res.json(medicationStatementPerformer);	
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
						"medication_administration_id" : medicationStatementId
					}

					ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
						identifier = body;
						if(identifier.err_code > 0){
							res.json(identifier);	
						}
					})

					res.json({"err_code": 0, "err_msg": "MedicationStatement has been add.", "data": [{"_id": medicationStatementId}]})
				});

				myEmitter.prependOnceListener('checkMedicationStatementManufacturerId', function(){
					if(validator.isEmpty(medicationStatementManufacturer)){
						myEmitter.emit('checkMedicationStatementId');
					}else{
						checkUniqeValue(apikey, "ORGANIZATION_ID|" + medicationStatementManufacturer, 'ORGANIZATION', function(resManufacturerID){
							if(resManufacturerID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkMedicationStatementId');
							}else{
								res.json({"err_code": 503, "err_msg": "Manufaturer id not found."});	
							}
						})
					}
				})
																		
				myEmitter.prependOnceListener('checkItemReferenceSubstanceId', function(){
					if(validator.isEmpty(medicationStatementIngredientItemItemReferenceSubstance)){
						myEmitter.emit('checkMedicationStatementManufacturerId');
					}else{
						checkUniqeValue(apikey, "SUBSTANCE_ID|" + medicationStatementIngredientItemItemReferenceSubstance, 'SUBSTANCE', function(resItemReferenceSubstanceId){
							if(resItemReferenceSubstanceId.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkMedicationStatementManufacturerId');
							}else{
								res.json({"err_code": 503, "err_msg": "Substance id not found."});	
							}
						})
					}
				})

				myEmitter.prependOnceListener('checkItemReferenceMedicationStatement', function(){
					if(validator.isEmpty(medicationStatementIngredientItemItemReferenceMedicationStatement)){
						myEmitter.emit('checkItemReferenceSubstanceId');
					}else{
						checkUniqeValue(apikey, "MEDICATION_ID|" + medicationStatementIngredientItemItemReferenceMedicationStatement, 'MEDICATION', function(resItemReferenceMedicationStatementId){
							if(resItemReferenceMedicationStatementId.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								myEmitter.emit('checkItemReferenceSubstanceId');
							}else{
								res.json({"err_code": 503, "err_msg": "Item Reference Substance id not found."});	
							}
						})
					}
				})

				if(validator.isEmpty(medicationStatementPackageItemItemReference)){
					myEmitter.emit('checkItemReferenceMedicationStatement');
				}else{
					checkUniqeValue(apikey, "MEDICATION_ID|" + medicationStatementPackageItemItemReference, 'MEDICATION', function(resPackageItemItemReference){
						if(resPackageItemItemReference.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
							myEmitter.emit('checkItemReferenceMedicationStatement');
						}else{
							res.json({"err_code": 501, "err_msg": "Item Reference MedicationStatement id is not exist."});
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
		medicationStatement: function putMedicationStatement(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			
			var medicationStatementId = req.params.medicationStatement_id;
			var err_code = 0;
			var err_msg = "";

			var dataMedicationStatement = {};
			
			//input check 
			if(typeof medicationStatementId !== 'undefined'){
				if(validator.isEmpty(medicationStatementId)){
					err_code = 2;
					err_msg = "MedicationStatement id is required";
				}
			}else{
				err_code = 2;
				err_msg = "MedicationStatement id is required";
			}
			
			if(typeof req.body.active !== 'undefined'){
				active =  req.body.active.trim().toLowerCase();
				if(validator.isEmpty(active)){
					err_code = 2;
					err_msg = "Active is required.";
				}else{
					dataMedicationStatement.active = active;
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
					dataMedicationStatement.type = type;
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
					dataMedicationStatement.name = name;
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
					dataMedicationStatement.alias = alias;
				}
			}else{
				alias = "";
			}			
			
			//Endpoint managingMedicationStatement
			if(typeof req.body.partOf !== 'undefined'){
				parentId =  req.body.partOf.trim().toLowerCase();
				if(validator.isEmpty(parentId)){
					err_code = 2;
					err_msg = "Managing MedicationStatement is required.";
				}else{
					dataMedicationStatement.parentId = parentId;
				}
			}else{
				parentId = "";
			}
			
			//Endpoint managingMedicationStatement
			if(typeof req.body.endpoint !== 'undefined'){
				endpointId =  req.body.endpoint.trim().toLowerCase();
				if(validator.isEmpty(endpointId)){
					err_code = 2;
					err_msg = "Endpoint is required.";
				}else{
					dataMedicationStatement.endpointId = endpointId;
				}
			}else{
				endpointId = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkMedicationStatementID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + medicationStatementId, 'IMMUNIZATION', function(resMedicationStatementID){
								if(resMedicationStatementID.err_code > 0){
									//console.log(dataEndpoint);
										ApiFHIR.put('medicationStatement', {"apikey": apikey, "_id": medicationStatementId}, {body: dataMedicationStatement, json: true}, function(error, response, body){
											medicationStatement = body;
											if(medicationStatement.err_code > 0){
												res.json(medicationStatement);	
											}else{
												res.json({"err_code": 0, "err_msg": "MedicationStatement has been update.", "data": [{"_id": medicationStatementId}]});
											}
										})
								}else{
									res.json({"err_code": 504, "err_msg": "MedicationStatement Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkType', function(){
							if(validator.isEmpty(type)){
								myEmitter.emit('checkMedicationStatementID');
							}else{
								checkCode(apikey, type, 'IMMUNIZATION_TYPE', function(resStatusCode){
									if(resStatusCode.err_code > 0){
										myEmitter.emit('checkMedicationStatementID');				
									}else{
										res.json({"err_code": 503, "err_msg": "Type Code not found."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkManagingMedicationStatement', function(){
							if(validator.isEmpty(parentId)){
								myEmitter.emit('checkType');
							}else{
								checkUniqeValue(apikey, "IMMUNIZATION_ID|" + parentId, 'IMMUNIZATION', function(resMedicationStatementID){
									if(resMedicationStatementID.err_code > 0){
										myEmitter.emit('checkType');				
									}else{
										res.json({"err_code": 503, "err_msg": "Parent Id MedicationStatement, medicationStatement id not found."});	
									}
								})
							}
						})

						if(validator.isEmpty(endpointId)){
							myEmitter.emit('checkManagingMedicationStatement');	
						}else{
							checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointID){
								if(resEndpointID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkManagingMedicationStatement');
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