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
			var medicationAdministrationId = req.query._id;
			var code = req.query.code;
			var context = req.query.context;
			var device = req.query.device;
			var effectiveTime = req.query.effectiveTime;
			var identifier = req.query.identifier;
			var medication = req.query.medication;
			var notGiven = req.query.notGiven;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var prescription = req.query.prescription;
			var reasonGiven = req.query.reasonGiven;
			var reasonNotGiven = req.query.reasonNotGiven;
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

			if(typeof medicationAdministrationId !== 'undefined'){
				if(!validator.isEmpty(medicationAdministrationId)){
					qString.medicationAdministrationId = medicationAdministrationId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Medication Administration Id is required."});
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

			if(typeof device !== 'undefined'){
				if(!validator.isEmpty(device)){
					qString.device = device; 
				}else{
					res.json({"err_code": 1, "err_msg": "device is empty."});
				}
			}

			if(typeof effectiveTime !== 'undefined'){
				if(!validator.isEmpty(effectiveTime)){
					if(!regex.test(effectiveTime)){
						res.json({"err_code": 1, "err_msg": "effective time invalid format."});
					}else{
						qString.effectiveTime = effectiveTime; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "effective time is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "identifier is empty."});
				}
			}

			if(typeof medication !== 'undefined'){
				if(!validator.isEmpty(medication)){
					qString.medication = medication; 
				}else{
					res.json({"err_code": 1, "err_msg": "medication is empty."});
				}
			}

			if(typeof notGiven !== 'undefined'){
				if(!validator.isEmpty(notGiven)){
					qString.notGiven = notGiven; 
				}else{
					res.json({"err_code": 1, "err_msg": "not given is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "patient is empty."});
				}
			}

			if(typeof performer !== 'undefined'){
				if(!validator.isEmpty(performer)){
					qString.performer = performer; 
				}else{
					res.json({"err_code": 1, "err_msg": "performer is empty."});
				}
			}

			if(typeof prescription !== 'undefined'){
				if(!validator.isEmpty(prescription)){
					qString.prescription = prescription; 
				}else{
					res.json({"err_code": 1, "err_msg": "prescription is empty."});
				}
			}

			if(typeof reasonGiven !== 'undefined'){
				if(!validator.isEmpty(reasonGiven)){
					qString.reasonGiven = reasonGiven; 
				}else{
					res.json({"err_code": 1, "err_msg": "reason given is empty."});
				}
			}

			if(typeof reasonNotGiven !== 'undefined'){
				if(!validator.isEmpty(reasonNotGiven)){
					qString.reasonNotGiven = reasonNotGiven; 
				}else{
					res.json({"err_code": 1, "err_msg": "reason not given is empty."});
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
											//get identifier
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

													objectMedicationAdministration.patient = medicationAdministration.patient;

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

																			/*if(index == countMedicationAdministration -1 ){
																				res.json({"err_code": 0, "data":newMedicationAdministration});				
																			}*/
																			
																			myEmitter.once('getMedicationAdministrationDefinitionPlanDefinition', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
																				qString = {};
																				qString.medication_administration_id = medicationAdministration.id;
																				seedPhoenixFHIR.path.GET = {
																					"MedicationAdministrationDefinitionPlanDefinition" : {
																						"location": "%(apikey)s/MedicationAdministrationDefinitionPlanDefinition",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('MedicationAdministrationDefinitionPlanDefinition', {"apikey": apikey}, {}, function(error, response, body){
																					medicationAdministrationDefinitionPlanDefinition = JSON.parse(body);
																					if(medicationAdministrationDefinitionPlanDefinition.err_code == 0){
																						var objectMedicationAdministration = {};
																						objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
																						objectMedicationAdministration.id = medicationAdministration.id;
																						objectMedicationAdministration.identifier = medicationAdministration.identifier;
																						var Definition = {};
																						Definition.planDefinition = medicationAdministrationDefinitionPlanDefinition.data;
																						objectMedicationAdministration.definition = Definition;
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
																						objectMedicationAdministration.dosage = medicationAdministration.dosage;

																						newMedicationAdministration[index] = objectMedicationAdministration;
																						myEmitter.once('getMedicationAdministrationDefinitionActivityDefinition', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
																							qString = {};
																							qString.medication_administration_id = medicationAdministration.id;
																							seedPhoenixFHIR.path.GET = {
																								"MedicationAdministrationDefinitionActivityDefinition" : {
																									"location": "%(apikey)s/MedicationAdministrationDefinitionActivityDefinition",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('MedicationAdministrationDefinitionActivityDefinition', {"apikey": apikey}, {}, function(error, response, body){
																								medicationAdministrationDefinitionActivityDefinition = JSON.parse(body);
																								if(medicationAdministrationDefinitionActivityDefinition.err_code == 0){
																									var objectMedicationAdministration = {};
																									objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
																									objectMedicationAdministration.id = medicationAdministration.id;
																									objectMedicationAdministration.identifier = medicationAdministration.identifier;
																									var Definition = {};
																									Definition.planDefinition = medicationAdministration.definition.planDefinition;
																									Definition.activityDefinition = medicationAdministrationDefinitionActivityDefinition.data;
																									objectMedicationAdministration.definition = Definition;
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
																									objectMedicationAdministration.dosage = medicationAdministration.dosage;

																									newMedicationAdministration[index] = objectMedicationAdministration;

																									myEmitter.once('getMedicationAdministrationPartOfMedicationAdministration', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
																										qString = {};
																										qString.medication_administration_id = medicationAdministration.id;
																										seedPhoenixFHIR.path.GET = {
																											"MedicationAdministrationPartOfMedicationAdministration" : {
																												"location": "%(apikey)s/MedicationAdministrationPartOfMedicationAdministration",
																												"query": qString
																											}
																										}

																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																										ApiFHIR.get('MedicationAdministrationPartOfMedicationAdministration', {"apikey": apikey}, {}, function(error, response, body){
																											medicationAdministrationPartOfMedicationAdministration = JSON.parse(body);
																											if(medicationAdministrationPartOfMedicationAdministration.err_code == 0){
																												var objectMedicationAdministration = {};
																												objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
																												objectMedicationAdministration.id = medicationAdministration.id;
																												objectMedicationAdministration.identifier = medicationAdministration.identifier;
																												objectMedicationAdministration.definition = medicationAdministration.definition;
																												var PartOf = {};
																												PartOf.medicationAdministration = medicationAdministrationPartOfMedicationAdministration.data;
																												objectMedicationAdministration.partOf = PartOf;
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
																												objectMedicationAdministration.dosage = medicationAdministration.dosage;

																												newMedicationAdministration[index] = objectMedicationAdministration;

																												myEmitter.once('getMedicationAdministrationPartOfProcedure', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
																													qString = {};
																													qString.medication_administration_id = medicationAdministration.id;
																													seedPhoenixFHIR.path.GET = {
																														"MedicationAdministrationPartOfProcedure" : {
																															"location": "%(apikey)s/MedicationAdministrationPartOfProcedure",
																															"query": qString
																														}
																													}

																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																													ApiFHIR.get('MedicationAdministrationPartOfProcedure', {"apikey": apikey}, {}, function(error, response, body){
																														medicationAdministrationPartOfProcedure = JSON.parse(body);
																														if(medicationAdministrationPartOfProcedure.err_code == 0){
																															var objectMedicationAdministration = {};
																															objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
																															objectMedicationAdministration.id = medicationAdministration.id;
																															objectMedicationAdministration.identifier = medicationAdministration.identifier;
																															objectMedicationAdministration.definition = medicationAdministration.definition;
																															var PartOf = {};
																															PartOf.medicationAdministration = medicationAdministration.partOf.medicationAdministration
																															PartOf.procedure = medicationAdministrationPartOfProcedure.data;
																															objectMedicationAdministration.partOf = PartOf;
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
																															objectMedicationAdministration.dosage = medicationAdministration.dosage;

																															newMedicationAdministration[index] = objectMedicationAdministration;

																															myEmitter.once('getMedicationAdministrationReasonReferenceCondition', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
																																qString = {};
																																qString.medication_administration_id = medicationAdministration.id;
																																seedPhoenixFHIR.path.GET = {
																																	"MedicationAdministrationReasonReferenceCondition" : {
																																		"location": "%(apikey)s/MedicationAdministrationReasonReferenceCondition",
																																		"query": qString
																																	}
																																}

																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																ApiFHIR.get('MedicationAdministrationReasonReferenceCondition', {"apikey": apikey}, {}, function(error, response, body){
																																	medicationAdministrationReasonReferenceCondition = JSON.parse(body);
																																	if(medicationAdministrationReasonReferenceCondition.err_code == 0){
																																		var objectMedicationAdministration = {};
																																		objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
																																		objectMedicationAdministration.id = medicationAdministration.id;
																																		objectMedicationAdministration.identifier = medicationAdministration.identifier;
																																		objectMedicationAdministration.definition = medicationAdministration.definition;
																																		objectMedicationAdministration.partOf = medicationAdministration.partOf;
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
																																		var ReasonReference = {};
																																		ReasonReference.condition = medicationAdministrationReasonReferenceCondition.data;
																																		objectMedicationAdministration.reasonReference = ReasonReference;
																																		objectMedicationAdministration.prescription = medicationAdministration.prescription;
																																		objectMedicationAdministration.dosage = medicationAdministration.dosage;

																																		newMedicationAdministration[index] = objectMedicationAdministration;

																																		myEmitter.once('getMedicationAdministrationReasonReferenceObservation', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
																																			qString = {};
																																			qString.medication_administration_id = medicationAdministration.id;
																																			seedPhoenixFHIR.path.GET = {
																																				"MedicationAdministrationReasonReferenceObservation" : {
																																					"location": "%(apikey)s/MedicationAdministrationReasonReferenceObservation",
																																					"query": qString
																																				}
																																			}

																																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																			ApiFHIR.get('MedicationAdministrationReasonReferenceObservation', {"apikey": apikey}, {}, function(error, response, body){
																																				medicationAdministrationReasonReferenceObservation = JSON.parse(body);
																																				if(medicationAdministrationReasonReferenceObservation.err_code == 0){
																																					var objectMedicationAdministration = {};
																																					objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
																																					objectMedicationAdministration.id = medicationAdministration.id;
																																					objectMedicationAdministration.identifier = medicationAdministration.identifier;
																																					objectMedicationAdministration.definition = medicationAdministration.definition;
																																					objectMedicationAdministration.partOf = medicationAdministration.partOf;
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
																																					var ReasonReference = {};
																																					ReasonReference.condition = medicationAdministration.reasonReference.condition;
																																					ReasonReference.observation = medicationAdministrationReasonReferenceObservation.data;
																																					objectMedicationAdministration.reasonReference = ReasonReference;
																																					objectMedicationAdministration.prescription = medicationAdministration.prescription;
																																					objectMedicationAdministration.dosage = medicationAdministration.dosage;

																																					newMedicationAdministration[index] = objectMedicationAdministration;

myEmitter.once('getMedicationAdministrationDevice', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
	qString = {};
	qString.medication_administration_id = medicationAdministration.id;
	seedPhoenixFHIR.path.GET = {
		"MedicationAdministrationDevice" : {
			"location": "%(apikey)s/MedicationAdministrationDevice",
			"query": qString
		}
	}

	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

	ApiFHIR.get('MedicationAdministrationDevice', {"apikey": apikey}, {}, function(error, response, body){
		medicationAdministrationDevice = JSON.parse(body);
		if(medicationAdministrationDevice.err_code == 0){
			var objectMedicationAdministration = {};
			objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
			objectMedicationAdministration.id = medicationAdministration.id;
			objectMedicationAdministration.identifier = medicationAdministration.identifier;
			objectMedicationAdministration.definition = medicationAdministration.definition;
			objectMedicationAdministration.partOf = medicationAdministration.partOf;
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
			objectMedicationAdministration.reasonReference = medicationAdministration.reasonReference;
			objectMedicationAdministration.prescription = medicationAdministration.prescription;
			objectMedicationAdministration.device = medicationAdministrationDevice.data;
			objectMedicationAdministration.dosage = medicationAdministration.dosage;

			newMedicationAdministration[index] = objectMedicationAdministration;

			myEmitter.once('getMedicationAdministrationProvenance', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
				qString = {};
				qString.medication_administration_id = medicationAdministration.id;
				seedPhoenixFHIR.path.GET = {
					"MedicationAdministrationProvenance" : {
						"location": "%(apikey)s/MedicationAdministrationProvenance",
						"query": qString
					}
				}

				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

				ApiFHIR.get('MedicationAdministrationProvenance', {"apikey": apikey}, {}, function(error, response, body){
					medicationAdministrationProvenance = JSON.parse(body);
					if(medicationAdministrationProvenance.err_code == 0){
						var objectMedicationAdministration = {};
						objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
						objectMedicationAdministration.id = medicationAdministration.id;
						objectMedicationAdministration.identifier = medicationAdministration.identifier;
						objectMedicationAdministration.definition = medicationAdministration.definition;
						objectMedicationAdministration.partOf = medicationAdministration.partOf;
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
						objectMedicationAdministration.reasonReference = medicationAdministration.reasonReference;
						objectMedicationAdministration.prescription = medicationAdministration.prescription;
						objectMedicationAdministration.device = medicationAdministration.device;
						objectMedicationAdministration.dosage = medicationAdministration.dosage;
						objectMedicationAdministration.eventHistory = medicationAdministrationProvenance.data;

						newMedicationAdministration[index] = objectMedicationAdministration;

						myEmitter.once('getAnnotation', function(medicationAdministration, index, newMedicationAdministration, countMedicationAdministration){
							qString = {};
							qString.medication_administration_id = medicationAdministration.id;
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
									var objectMedicationAdministration = {};
									objectMedicationAdministration.resourceType = medicationAdministration.resourceType;
									objectMedicationAdministration.id = medicationAdministration.id;
									objectMedicationAdministration.identifier = medicationAdministration.identifier;
									objectMedicationAdministration.definition = medicationAdministration.definition;
									objectMedicationAdministration.partOf = medicationAdministration.partOf;
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
									objectMedicationAdministration.reasonReference = medicationAdministration.reasonReference;
									objectMedicationAdministration.prescription = medicationAdministration.prescription;
									objectMedicationAdministration.device = medicationAdministration.device;
									objectMedicationAdministration.node = annotation.data;
									objectMedicationAdministration.dosage = medicationAdministration.dosage;
									objectMedicationAdministration.eventHistory = medicationAdministration.eventHistory;

									newMedicationAdministration[index] = objectMedicationAdministration;

									if(index == countMedicationAdministration -1 ){
										res.json({"err_code": 0, "data":newMedicationAdministration});				
									}
								}else{
									res.json(annotation);			
								}
							})
						})
						myEmitter.emit('getAnnotation', objectMedicationAdministration, index, newMedicationAdministration, countMedicationAdministration);
					}else{
						res.json(medicationAdministrationProvenance);			
					}
				})
			})
			myEmitter.emit('getMedicationAdministrationProvenance', objectMedicationAdministration, index, newMedicationAdministration, countMedicationAdministration);
		}else{
			res.json(medicationAdministrationDevice);			
		}
	})
})
myEmitter.emit('getMedicationAdministrationDevice', objectMedicationAdministration, index, newMedicationAdministration, countMedicationAdministration);																																					
																																				}else{
																																					res.json(medicationAdministrationReasonReferenceObservation);			
																																				}
																																			})
																																		})
																																		myEmitter.emit('getMedicationAdministrationReasonReferenceObservation', objectMedicationAdministration, index, newMedicationAdministration, countMedicationAdministration);																												
																																	}else{
																																		res.json(medicationAdministrationReasonReferenceCondition);			
																																	}
																																})
																															})
																															myEmitter.emit('getMedicationAdministrationReasonReferenceCondition', objectMedicationAdministration, index, newMedicationAdministration, countMedicationAdministration);																															
																														}else{
																															res.json(medicationAdministrationPartOfProcedure);			
																														}
																													})
																												})
																												myEmitter.emit('getMedicationAdministrationPartOfProcedure', objectMedicationAdministration, index, newMedicationAdministration, countMedicationAdministration);																									


																											}else{
																												res.json(medicationAdministrationPartOfMedicationAdministration);			
																											}
																										})
																									})
																									myEmitter.emit('getMedicationAdministrationPartOfMedicationAdministration', objectMedicationAdministration, index, newMedicationAdministration, countMedicationAdministration);

																								}else{
																									res.json(medicationAdministrationDefinitionActivityDefinition);			
																								}
																							})
																						})
																						myEmitter.emit('getMedicationAdministrationDefinitionActivityDefinition', objectMedicationAdministration, index, newMedicationAdministration, countMedicationAdministration);
																					}else{
																						res.json(medicationAdministrationDefinitionPlanDefinition);			
																					}
																				})
																			})
																			myEmitter.emit('getMedicationAdministrationDefinitionPlanDefinition', objectMedicationAdministration, index, newMedicationAdministration, countMedicationAdministration);															

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
		},
		identifier: function getIdentifier(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationAdministrationId = req.params.medication_administration_id;
			var identifierId = req.params.identifier_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "MEDICATION_ADMINISTRATION_ID|" + medicationAdministrationId, 'MEDICATION_ADMINISTRATION', function(resPatientID){
						if(resPatientID.err_code > 0){
							if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
								checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
									if(resIdentifierID.err_code > 0){
										//get identifier
										qString = {};
										qString.medication_administration_id = medicationAdministrationId;
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
								qString.medication_administration_id = medicationAdministrationId;
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
							res.json({"err_code": 501, "err_msg": "Medication Administration Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		medicationAdministrationPerformer: function getMedicationAdministrationPerformer(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var medicationAdministrationId = req.params.medication_administration_id;
					var medicationAdministrationPerformerId = req.params.medication_administration_performer_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "MEDICATION_ADMINISTRATION_ID|" + medicationAdministrationId, 'MEDICATION_ADMINISTRATION', function(resMedicationAdministrationID){
								if(resMedicationAdministrationID.err_code > 0){
									if(typeof medicationAdministrationPerformerId !== 'undefined' && !validator.isEmpty(medicationAdministrationPerformerId)){
										checkUniqeValue(apikey, "PERFORMER_ID|" + medicationAdministrationPerformerId, 'MEDICATION_ADMINISTRATION_PERFORMER', function(resMedicationAdministrationPerformerID){
											if(resMedicationAdministrationPerformerID.err_code > 0){
												//get medicationAdministrationPerformer
								  			qString = {};
								  			qString.medication_administration_id = medicationAdministrationId;
								  			qString._id = medicationAdministrationPerformerId;
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
														res.json({"err_code": 0, "data":medicationAdministrationPerformer.data});	
													}else{
														res.json(medicationAdministrationPerformer);
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Medication Administration Performer Id not found"});		
											}
										})
									}else{
										//get medicationAdministrationPerformer
						  			qString = {};
						  			qString.medication_administration_id = medicationAdministrationId;
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
												res.json({"err_code": 0, "data":medicationAdministrationPerformer.data});	
											}else{
												res.json(medicationAdministrationPerformer);
											}
										})
									}
								}else{
									res.json({"err_code": 501, "err_msg": "Medication Administration Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		medicationAdministrationDosage: function getMedicationAdministrationDosage(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var medicationAdministrationId = req.params.medication_administration_id;
					var medicationAdministrationDosageId = req.params.medication_administration_dosage_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "MEDICATION_ADMINISTRATION_ID|" + medicationAdministrationId, 'MEDICATION_ADMINISTRATION', function(resMedicationAdministrationID){
								if(resMedicationAdministrationID.err_code > 0){
									if(typeof medicationAdministrationDosageId !== 'undefined' && !validator.isEmpty(medicationAdministrationDosageId)){
										checkUniqeValue(apikey, "DOSAGE_ID|" + medicationAdministrationDosageId, 'MEDICATION_ADMINISTRATION_DOSAGE', function(resMedicationAdministrationDosageID){
											if(resMedicationAdministrationDosageID.err_code > 0){
												//get medicationAdministrationDosage
								  			qString = {};
								  			qString.medication_administration_id = medicationAdministrationId;
								  			qString._id = medicationAdministrationDosageId;
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
														res.json({"err_code": 0, "data":medicationAdministrationDosage.data});	
													}else{
														res.json(medicationAdministrationDosage);
													}
												})
											}else{
												res.json({"err_code": 502, "err_msg": "Medication Administration Dosage Id not found"});		
											}
										})
									}else{
										//get medicationAdministrationDosage
						  			qString = {};
						  			qString.medication_administration_id = medicationAdministrationId;
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
												res.json({"err_code": 0, "data":medicationAdministrationDosage.data});	
											}else{
												res.json(medicationAdministrationDosage);
											}
										})
									}
								}else{
									res.json({"err_code": 501, "err_msg": "Medication Administration Id not found"});		
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
														var AnnotationId = 'ann' + unicId;

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
																							"medication_administration_id": medicationAdministrationId
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
															"rate_quality" : dosageRateRateQuantity,
															"medication_administration_id" : medicationAdministrationId
														}
														ApiFHIR.post('medicationAdministrationDosage', {"apikey": apikey}, {body: dataMedicationAdministrationDosage, json: true}, function(error, response, body){
															medicationAdministrationDosage = body;
															if(medicationAdministrationDosage.err_code > 0){
																res.json(medicationAdministrationDosage);	
																console.log("ok");
															}
														});
														
														dataAnnotation = {
															"id" : AnnotationId,
															"author_ref_practitioner" : noteAuthorPractitioner,
															"author_ref_patient" : noteAuthorPatient,
															"author_ref_relatedPerson" : noteAuthorRelatedPerson,
															"author_string" : noteAuthorAuthorString,
															"time" : noteTime,
															"text" : noteText,
															"medication_administration_id" : medicationAdministrationId
														}
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataAnnotation, json: true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
																console.log("ok");
															}
														});														
														
														//all reference
/*




device

*/													
														if(definitionPlanDefinition !== ""){
															dataDefinitionPlanDefinition = {
																"_id" : definitionPlanDefinition,
																"medication_administration_id" : medicationAdministrationId
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
																"medication_administration_id" : medicationAdministrationId
															}
															ApiFHIR.put('activityDefinition', {"apikey": apikey, "_id": definitionActivityDefinition}, {body: dataDefinitionActivityDefinition, json: true}, function(error, response, body){
																returnDefinitionActivityDefinition = body;
																if(returnDefinitionActivityDefinition.err_code > 0){
																	res.json(returnDefinitionActivityDefinition);	
																	console.log("add reference definition activity definition : " + definitionActivityDefinition);
																}
															});
														}
														
														if(partOfMedicationAdministration !== ""){
															dataPartOfMedicationAdministration = {
																"_id" : partOfMedicationAdministration,
																"part_of" : medicationAdministrationId
															}
															ApiFHIR.put('medicationAdministration', {"apikey": apikey, "_id": partOfMedicationAdministration}, {body: dataPartOfMedicationAdministration, json: true}, function(error, response, body){
																returnPartOfMedicationAdministration = body;
																if(returnPartOfMedicationAdministration.err_code > 0){
																	res.json(returnPartOfMedicationAdministration);	
																	console.log("add reference part of medication administration : " + partOfMedicationAdministration);
																}
															});
														}
														
														if(partOfProcedure !== ""){
															dataPartOfProcedure = {
																"_id" : partOfProcedure,
																"medication_administration_id" : medicationAdministrationId
															}
															ApiFHIR.put('procedure', {"apikey": apikey, "_id": imagingManifestId}, {body: partOfProcedure, json: true}, function(error, response, body){
																returnPartOfProcedure = body;
																if(returnPartOfProcedure.err_code > 0){
																	res.json(returnPartOfProcedure);	
																	console.log("add reference part of rocedure : " + partOfProcedure);
																}
															});
														}
														
														if(reasonReferenceCondition !== ""){
															dataReasonReferenceCondition = {
																"_id" : reasonReferenceCondition,
																"medication_administration_id" : medicationAdministrationId
															}
															ApiFHIR.put('condition', {"apikey": apikey, "_id": imagingManifestId}, {body: reasonReferenceCondition, json: true}, function(error, response, body){
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
																"medication_administration_id" : medicationAdministrationId
															}
															ApiFHIR.put('observation', {"apikey": apikey, "_id": imagingManifestId}, {body: reasonReferenceObservation, json: true}, function(error, response, body){
																returnReasonReferenceObservation = body;
																if(returnReasonReferenceObservation.err_code > 0){
																	res.json(returnReasonReferenceObservation);	
																	console.log("add reference reason reference observation : " + reasonReferenceObservation);
																}
															});
														}
														
														if(device !== ""){
															dataDevice = {
																"_id" : device,
																"medication_administration_id" : medicationAdministrationId
															}
															ApiFHIR.put('device', {"apikey": apikey, "_id": device}, {body: dataDevice, json: true}, function(error, response, body){
																returnDevice = body;
																if(returnDevice.err_code > 0){
																	res.json(returnDevice);	
																	console.log("add reference device : " + device);
																}
															});
														}
														
														if(eventHistory !== ""){
															dataEventHistory = {
																"_id" : eventHistory,
																"medication_administration_id" : medicationAdministrationId
															}
															ApiFHIR.put('provenance', {"apikey": apikey, "_id": eventHistory}, {body: dataEventHistory, json: true}, function(error, response, body){
																returnEventHistory = body;
																if(returnEventHistory.err_code > 0){
																	res.json(returnEventHistory);	
																	console.log("add reference event history : " + eventHistory);
																}
															});
														}
														
														
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
										prescription|Medication_Request
										device|device
										noteAuthorPractitioner|Practitioner
										noteAuthorPatient|Patient
										noteAuthorRelatedPerson|Related_Person
										eventHistory|event_History
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
												checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + prescription, 'MEDICATION_REQUEST', function (resPrescription) {
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
											checkUniqeValue(apikey, "EVENT_HISTORY_ID|" + eventHistory, 'EVENT_HISTORY', function (resEventHistory) {
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
		},
		identifier: function addIdentifier(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationAdministrationId = req.params.medication_administration_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof medicationAdministrationId !== 'undefined'){
				if(validator.isEmpty(medicationAdministrationId)){
					err_code = 2;
					err_msg = "Medication Administration id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Administration id is required";
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
												checkUniqeValue(apikey, "MEDICATION_ADMINISTRATION_ID|" + medicationAdministrationId, 'MEDICATION_ADMINISTRATION', function(resMedicationAdministrationId){
													if(resMedicationAdministrationId.err_code > 0){
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
															"medication_administration_id": medicationAdministrationId
														}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this medicationAdministration.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Medication Administration Id not found"});		
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
		medicationAdministrationPerformer: function addMedicationAdministrationPerformer(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationAdministrationId = req.params.medication_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof medicationAdministrationId !== 'undefined'){
				if(validator.isEmpty(medicationAdministrationId)){
					err_code = 2;
					err_msg = "Medication Administration id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Administration id is required";
			}
			
			if(typeof req.body.actor.practitioner !== 'undefined'){
				var performerActorPractitioner =  req.body.actor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerActorPractitioner)){
					performerActorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor practitioner' in json Medication Administration request.";
			}

			if(typeof req.body.actor.patient !== 'undefined'){
				var performerActorPatient =  req.body.actor.patient.trim().toLowerCase();
				if(validator.isEmpty(performerActorPatient)){
					performerActorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor patient' in json Medication Administration request.";
			}

			if(typeof req.body.actor.relatedPerson !== 'undefined'){
				var performerActorRelatedPerson =  req.body.actor.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(performerActorRelatedPerson)){
					performerActorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor related person' in json Medication Administration request.";
			}

			if(typeof req.body.actor.device !== 'undefined'){
				var performerActorDevice =  req.body.actor.device.trim().toLowerCase();
				if(validator.isEmpty(performerActorDevice)){
					performerActorDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor device' in json Medication Administration request.";
			}

			if(typeof req.body.onBehalfOf !== 'undefined'){
				var performerOnBehalfOf =  req.body.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(performerOnBehalfOf)){
					performerOnBehalfOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer on behalf of' in json Medication Administration request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkMedicationAdministrationID', function(){
							checkUniqeValue(apikey, "MEDICATION_ADMINISTRATION_ID|" + medicationAdministrationId, 'MEDICATION_ADMINISTRATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									var unicId = uniqid.time();
									var medicationAdministrationPerformeId = 'map' + unicId;
									//MedicationAdministrationPerformer
									dataMedicationAdministrationPerformer = {
										"performer_id" : medicationAdministrationPerformeId,
										"actor_practitioner" : performerActorPractitioner,
										"actor_patient" : performerActorPatient,
										"actor_related_person" : performerActorRelatedPerson,
										"actor_device" : performerActorDevice,
										"on_behalf_of" : performerOnBehalfOf,
										"medication_administration_id" : medicationAdministrationId
									};
							
									ApiFHIR.post('medicationAdministrationPerformer', {"apikey": apikey}, {body: dataMedicationAdministrationPerformer, json: true}, function(error, response, body){
										medicationAdministrationPerformer = body;
										
										if(medicationAdministrationPerformer.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Performer has been add in this Medication Administration.", "data": medicationAdministrationPerformer.data});
										}else{
											res.json(medicationAdministrationPerformer);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Administration Performer Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkPerformerActorPractitioner', function () {
							if (!validator.isEmpty(performerActorPractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + performerActorPractitioner, 'PRACTITIONER', function (resPerformerActorPractitioner) {
									if (resPerformerActorPractitioner.err_code > 0) {
										myEmitter.emit('checkMedicationAdministrationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationAdministrationID');
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
		/*medicationAdministrationDosage: function addMedicationAdministrationDosage(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationAdministrationId = req.params.medication_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof medicationAdministrationId !== 'undefined'){
				if(validator.isEmpty(medicationAdministrationId)){
					err_code = 2;
					err_msg = "Medication Administration id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Administration id is required";
			}
			
			if(typeof req.body.text !== 'undefined'){
				var dosageText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(dosageText)){
					dosageText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage text' in json Medication Administration request.";
			}

			if(typeof req.body.site !== 'undefined'){
				var dosageSite =  req.body.site.trim().toLowerCase();
				if(validator.isEmpty(dosageSite)){
					dosageSite = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage site' in json Medication Administration request.";
			}

			if(typeof req.body.route !== 'undefined'){
				var dosageRoute =  req.body.route.trim().toLowerCase();
				if(validator.isEmpty(dosageRoute)){
					dosageRoute = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage route' in json Medication Administration request.";
			}

			if(typeof req.body.method !== 'undefined'){
				var dosageMethod =  req.body.method.trim().toLowerCase();
				if(validator.isEmpty(dosageMethod)){
					dosageMethod = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage method' in json Medication Administration request.";
			}

			if(typeof req.body.dose !== 'undefined'){
				var dosageDose =  req.body.dose;
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

			if (typeof req.body.rate.rateRatio !== 'undefined') {
			  var dosageRateRateRatio = req.body.rate.rateRatio;
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

			if(typeof req.body.rate.rateQuantity !== 'undefined'){
				var dosageRateRateQuantity =  req.body.rate.rateQuantity.trim().toLowerCase();
				if(validator.isEmpty(dosageRateRateQuantity)){
					dosageRateRateQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dosage rate rate quantity' in json Medication Administration request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkMedicationAdministrationID', function(){
							checkUniqeValue(apikey, "MEDICATION_ADMINISTRATION_ID|" + medicationAdministrationId, 'MEDICATION_ADMINISTRATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									var unicId = uniqid.time();
									var medicationAdministrationPerformeId = 'map' + unicId;
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
										"rate_quality" : dosageRateRateQuantity,
										"medication_administration_id" : medicationAdministrationId
									};
							
									ApiFHIR.post('medicationAdministrationDosage', {"apikey": apikey}, {body: dataMedicationAdministrationDosage, json: true}, function(error, response, body){
										medicationAdministrationDosage = body;
										
										if(medicationAdministrationDosage.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Performer has been add in this Medication Administration.", "data": medicationAdministrationDosage.data});
										}else{
											res.json(medicationAdministrationDosage);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Administration Performer Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkDosageSite', function () {
							if (!validator.isEmpty(dosageSite)) {
								checkCode(apikey, dosageSite, 'APPROACH_SITE_CODES', function (resDosageSiteCode) {
									if (resDosageSiteCode.err_code > 0) {
										myEmitter.emit('checkMedicationAdministrationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Dosage site code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationAdministrationID');
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
						
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},*/
	},
	put: {
		medicationAdministration : function putMedicationAdministration(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var medicationAdministrationId = req.params.medication_administration_id;

      var err_code = 0;
      var err_msg = "";
      var dataMedicationAdministration = {};

			if(typeof medicationAdministrationId !== 'undefined'){
				if(validator.isEmpty(medicationAdministrationId)){
					err_code = 2;
					err_msg = "Medication Administration id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Administration id is required";
			}
			
			/*var status = req.body.status;
			var category = req.body.category;
			var medication_codeable_concept = req.body.medication_codeable_concept;
			var medication_reference = req.body.medication_reference;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var supporting_information = req.body.supporting_information;
			var effective_date_time = req.body.effective_date_time;
			var effective_period_start = req.body.effective_period_start;
			var effective_period_end = req.body.effective_period_end;
			var not_given = req.body.not_given;
			var reason_not_given = req.body.reason_not_given;
			var reason_code = req.body.reason_code;
			var prescription = req.body.prescription;*/

			if(typeof req.body.definition.planDefinition !== 'undefined' && req.body.definition.planDefinition !== ""){
				var definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					dataMedicationAdministration.plan_definition = "";
				}else{
					dataMedicationAdministration.plan_definition = definitionPlanDefinition;
				}
			}else{
			  definitionPlanDefinition = "";
			}

			if(typeof req.body.definition.activityDefinition !== 'undefined' && req.body.definition.activityDefinition !== ""){
				var definitionActivityDefinition =  req.body.definition.activityDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionActivityDefinition)){
					dataMedicationAdministration.activity_definition = "";
				}else{
					dataMedicationAdministration.activity_definition = definitionActivityDefinition;
				}
			}else{
			  definitionActivityDefinition = "";
			}

			if(typeof req.body.partOf.medicationAdministration !== 'undefined' && req.body.partOf.medicationAdministration !== ""){
				var partOfMedicationAdministration =  req.body.partOf.medicationAdministration.trim().toLowerCase();
				if(validator.isEmpty(partOfMedicationAdministration)){
					dataMedicationAdministration.medication_administration = "";
				}else{
					dataMedicationAdministration.medication_administration = partOfMedicationAdministration;
				}
			}else{
			  partOfMedicationAdministration = "";
			}

			if(typeof req.body.partOf.procedure !== 'undefined' && req.body.partOf.procedure !== ""){
				var partOfProcedure =  req.body.partOf.procedure.trim().toLowerCase();
				if(validator.isEmpty(partOfProcedure)){
					dataMedicationAdministration.procedure = "";
				}else{
					dataMedicationAdministration.procedure = partOfProcedure;
				}
			}else{
			  partOfProcedure = "";
			}

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "medication administration status is required.";
				}else{
					dataMedicationAdministration.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					dataMedicationAdministration.category = "";
				}else{
					dataMedicationAdministration.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.medication.medicationCodeableConcept !== 'undefined' && req.body.medication.medicationCodeableConcept !== ""){
				var medicationMedicationCodeableConcept =  req.body.medication.medicationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationCodeableConcept)){
					err_code = 2;
					err_msg = "medication administration medication medication codeable concept is required.";
				}else{
					dataMedicationAdministration.medication_codeable_concept = medicationMedicationCodeableConcept;
				}
			}else{
			  medicationMedicationCodeableConcept = "";
			}

			if(typeof req.body.medication.medicationReference !== 'undefined' && req.body.medication.medicationReference !== ""){
				var medicationMedicationReference =  req.body.medication.medicationReference.trim().toLowerCase();
				if(validator.isEmpty(medicationMedicationReference)){
					dataMedicationAdministration.medication_reference = "";
				}else{
					dataMedicationAdministration.medication_reference = medicationMedicationReference;
				}
			}else{
			  medicationMedicationReference = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataMedicationAdministration.patient = "";
				}else{
					dataMedicationAdministration.patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataMedicationAdministration.group = "";
				}else{
					dataMedicationAdministration.group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					dataMedicationAdministration.encounter = "";
				}else{
					dataMedicationAdministration.encounter = contextEncounter;
				}
			}else{
			  contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					dataMedicationAdministration.episode_of_care = "";
				}else{
					dataMedicationAdministration.episode_of_care = contextEpisodeOfCare;
				}
			}else{
			  contextEpisodeOfCare = "";
			}

			if(typeof req.body.supportingInformation !== 'undefined' && req.body.supportingInformation !== ""){
				var supportingInformation =  req.body.supportingInformation.trim().toLowerCase();
				if(validator.isEmpty(supportingInformation)){
					dataMedicationAdministration.supporting_information = "";
				}else{
					dataMedicationAdministration.supporting_information = supportingInformation;
				}
			}else{
			  supportingInformation = "";
			}

			if(typeof req.body.effective.effectiveDateTime !== 'undefined' && req.body.effective.effectiveDateTime !== ""){
				var effectiveEffectiveDateTime =  req.body.effective.effectiveDateTime;
				if(validator.isEmpty(effectiveEffectiveDateTime)){
					err_code = 2;
					err_msg = "medication administration effective effective date time is required.";
				}else{
					if(!regex.test(effectiveEffectiveDateTime)){
						err_code = 2;
						err_msg = "medication administration effective effective date time invalid date format.";	
					}else{
						dataMedicationAdministration.effective_date_time = effectiveEffectiveDateTime;
					}
				}
			}else{
			  effectiveEffectiveDateTime = "";
			}

			if (typeof req.body.effective.effectivePeriod !== 'undefined' && req.body.effective.effectivePeriod !== "") {
			  var effectiveEffectivePeriod = req.body.effective.effectivePeriod;
			  if (effectiveEffectivePeriod.indexOf("to") > 0) {
			    arrEffectiveEffectivePeriod = effectiveEffectivePeriod.split("to");
			    dataMedicationAdministration.effective_period_start = arrEffectiveEffectivePeriod[0];
			    dataMedicationAdministration.effective_period_end = arrEffectiveEffectivePeriod[1];
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

			if (typeof req.body.notGiven !== 'undefined' && req.body.notGiven !== "") {
			  var notGiven = req.body.notGiven.trim().toLowerCase();
					if(validator.isEmpty(notGiven)){
						notGiven = "false";
					}
			  if(notGiven === "true" || notGiven === "false"){
					dataMedicationAdministration.not_given = notGiven;
			  } else {
			    err_code = 2;
			    err_msg = "Medication administration not given is must be boolean.";
			  }
			} else {
			  notGiven = "";
			}

			if(typeof req.body.reasonNotGiven !== 'undefined' && req.body.reasonNotGiven !== ""){
				var reasonNotGiven =  req.body.reasonNotGiven.trim().toLowerCase();
				if(validator.isEmpty(reasonNotGiven)){
					dataMedicationAdministration.reason_not_given = "";
				}else{
					dataMedicationAdministration.reason_not_given = reasonNotGiven;
				}
			}else{
			  reasonNotGiven = "";
			}

			if(typeof req.body.reasonCode !== 'undefined' && req.body.reasonCode !== ""){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					dataMedicationAdministration.reason_code = "";
				}else{
					dataMedicationAdministration.reason_code = reasonCode;
				}
			}else{
			  reasonCode = "";
			}

			/*if(typeof req.body.reasonReference.condition !== 'undefined' && req.body.reasonReference.condition !== ""){
				var reasonReferenceCondition =  req.body.reasonReference.condition.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceCondition)){
					dataMedicationAdministration.condition = "";
				}else{
					dataMedicationAdministration.condition = reasonReferenceCondition;
				}
			}else{
			  reasonReferenceCondition = "";
			}

			if(typeof req.body.reasonReference.observation !== 'undefined' && req.body.reasonReference.observation !== ""){
				var reasonReferenceObservation =  req.body.reasonReference.observation.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceObservation)){
					dataMedicationAdministration.observation = "";
				}else{
					dataMedicationAdministration.observation = reasonReferenceObservation;
				}
			}else{
			  reasonReferenceObservation = "";
			}*/

			if(typeof req.body.prescription !== 'undefined' && req.body.prescription !== ""){
				var prescription =  req.body.prescription.trim().toLowerCase();
				if(validator.isEmpty(prescription)){
					dataMedicationAdministration.prescription = "";
				}else{
					dataMedicationAdministration.prescription = prescription;
				}
			}else{
			  prescription = "";
			}

			/*if(typeof req.body.device !== 'undefined' && req.body.device !== ""){
				var device =  req.body.device.trim().toLowerCase();
				if(validator.isEmpty(device)){
					dataMedicationAdministration.device = "";
				}else{
					dataMedicationAdministration.device = device;
				}
			}else{
			  device = "";
			}
			
			if(typeof req.body.eventHistory !== 'undefined' && req.body.eventHistory !== ""){
				var eventHistory =  req.body.eventHistory.trim().toLowerCase();
				if(validator.isEmpty(eventHistory)){
					dataMedicationAdministration.event_history = "";
				}else{
					dataMedicationAdministration.event_history = eventHistory;
				}
			}else{
			  eventHistory = "";
			}*/

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						//event emiter
						myEmitter.prependOnceListener('checkMedicationAdministrationId', function() {
							console.log(dataMedicationAdministration);
							ApiFHIR.put('medicationAdministration', {"apikey": apikey}, {body: dataMedicationAdministration, json: true}, function(error, response, body){
								medicationAdministration = body;
								if(medicationAdministration.err_code > 0){
									res.json(medicationAdministration);	
									console.log("ok");
								}
							});

							res.json({"err_code": 0, "err_msg": "Medication Administration has been update.", "data": [{"_id": medicationAdministrationId}]});
						});
						
						myEmitter.prependOnceListener('checkStatus', function () {
							if (!validator.isEmpty(status)) {
								checkCode(apikey, status, 'MEDICATION_ADMIN_STATUS', function (resStatusCode) {
									if (resStatusCode.err_code > 0) {
										myEmitter.emit('checkMedicationAdministrationId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationAdministrationId');
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
						
						if (!validator.isEmpty(prescription)) {
							checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + prescription, 'MEDICATION_REQUEST', function (resPrescription) {
								if (resPrescription.err_code > 0) {
									myEmitter.emit('checkContextEpisodeOfCare');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Prescription id not found"
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
			var medicationAdministrationId = req.params.medication_administration_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof medicationAdministrationId !== 'undefined'){
				if(validator.isEmpty(medicationAdministrationId)){
					err_code = 2;
					err_msg = "Immunization Recommendation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Recommendation id is required";
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
						myEmitter.prependOnceListener('checkMedicationAdministrationId', function(){
							checkUniqeValue(apikey, "MEDICATION_ADMINISTRATION_ID|" + medicationAdministrationId, 'MEDICATION_ADMINISTRATION', function(resImmunizationRecommendationID){
								if(resImmunizationRecommendationID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "MEDICATION_ADMINISTRATION_ID|"+medicationAdministrationId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Medication Administration.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Administration Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkMedicationAdministrationId');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkMedicationAdministrationId');				
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
		medicationAdministrationPerformer: function updateMedicationAdministrationPerformer(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationAdministrationId = req.params.medication_administration_id;
			var medicationAdministrationPerformerId = req.params.medication_administration_performer_id;

			var err_code = 0;
			var err_msg = "";
			var dataMedicationAdministrationPerformer = {};
			//input check 
			if(typeof medicationAdministrationId !== 'undefined'){
				if(validator.isEmpty(medicationAdministrationId)){
					err_code = 2;
					err_msg = "Medication Administration id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Administration id is required";
			}

			if(typeof medicationAdministrationPerformerId !== 'undefined'){
				if(validator.isEmpty(medicationAdministrationPerformerId)){
					err_code = 2;
					err_msg = "Medication Administration Performer id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Administration Performer id is required";
			}
			
			/*
			var actor_practitioner = req.body.actor_practitioner;
			var actor_patient = req.body.actor_patient;
			var actor_related_person = req.body.actor_related_person;
			var actor_device = req.body.actor_device;
			var on_behalf_of = req.body.on_behalf_of;
			*/
			if(typeof req.body.actor.practitioner !== 'undefined' && req.body.actor.practitioner !== ""){
				var performerActorPractitioner =  req.body.actor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerActorPractitioner)){
					dataMedicationAdministrationPerformer.actor_practitioner = "";
				}else{
					dataMedicationAdministrationPerformer.actor_practitioner = performerActorPractitioner;
				}
			}else{
			  performerActorPractitioner = "";
			}

			if(typeof req.body.actor.patient !== 'undefined' && req.body.actor.patient !== ""){
				var performerActorPatient =  req.body.actor.patient.trim().toLowerCase();
				if(validator.isEmpty(performerActorPatient)){
					dataMedicationAdministrationPerformer.actor_patient = "";
				}else{
					dataMedicationAdministrationPerformer.actor_patient = performerActorPatient;
				}
			}else{
			  performerActorPatient = "";
			}

			if(typeof req.body.actor.relatedPerson !== 'undefined' && req.body.actor.relatedPerson !== ""){
				var performerActorRelatedPerson =  req.body.actor.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(performerActorRelatedPerson)){
					dataMedicationAdministrationPerformer.actor_related_person = "";
				}else{
					dataMedicationAdministrationPerformer.actor_related_person = performerActorRelatedPerson;
				}
			}else{
			  performerActorRelatedPerson = "";
			}

			if(typeof req.body.actor.device !== 'undefined' && req.body.actor.device !== ""){
				var performerActorDevice =  req.body.actor.device.trim().toLowerCase();
				if(validator.isEmpty(performerActorDevice)){
					dataMedicationAdministrationPerformer.actor_device = "";
				}else{
					dataMedicationAdministrationPerformer.actor_device = performerActorDevice;
				}
			}else{
			  performerActorDevice = "";
			}

			if(typeof req.body.onBehalfOf !== 'undefined' && req.body.onBehalfOf !== ""){
				var performerOnBehalfOf =  req.body.onBehalfOf.trim().toLowerCase();
				if(validator.isEmpty(performerOnBehalfOf)){
					dataMedicationAdministrationPerformer.on_behalf_of = "";
				}else{
					dataMedicationAdministrationPerformer.on_behalf_of = performerOnBehalfOf;
				}
			}else{
			  performerOnBehalfOf = "";
			}	 

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkMedicationAdministrationID', function(){
							checkUniqeValue(apikey, "MEDICATION_ADMINISTRATION_ID|" + medicationAdministrationId, 'MEDICATION_ADMINISTRATION', function(resMedicationAdministrationID){
								if(resMedicationAdministrationID.err_code > 0){
									checkUniqeValue(apikey, "PERFORMER_ID|" + medicationAdministrationPerformerId, 'MEDICATION_ADMINISTRATION_PERFORMER', function(resMedicationAdministrationPerformerID){
										if(resMedicationAdministrationPerformerID.err_code > 0){
											ApiFHIR.put('medicationAdministrationPerformer', {"apikey": apikey, "_id": medicationAdministrationPerformerId, "dr": "MEDICATION_ADMINISTRATION_ID|"+medicationAdministrationId}, {body: dataMedicationAdministrationPerformer, json: true}, function(error, response, body){
												medicationAdministrationPerformer = body;
												if(medicationAdministrationPerformer.err_code > 0){
													res.json(medicationAdministrationPerformer);	
												}else{
													res.json({"err_code": 0, "err_msg": "Medication Administration Performer has been update in this Medication Administration.", "data": medicationAdministrationPerformer.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Medication Administration Performer Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Administration Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkPerformerActorPractitioner', function () {
							if (!validator.isEmpty(performerActorPractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + performerActorPractitioner, 'PRACTITIONER', function (resPerformerActorPractitioner) {
									if (resPerformerActorPractitioner.err_code > 0) {
										myEmitter.emit('checkMedicationAdministrationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer actor practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationAdministrationID');
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
		medicationAdministrationDosage: function updateMedicationAdministrationDosage(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var medicationAdministrationId = req.params.medication_administration_id;
			var medicationAdministrationDosageId = req.params.medication_administration_dosage_id;

			var err_code = 0;
			var err_msg = "";
			var dataMedicationAdministrationDosage = {};
			//input check 
			if(typeof medicationAdministrationId !== 'undefined'){
				if(validator.isEmpty(medicationAdministrationId)){
					err_code = 2;
					err_msg = "Medication Administration id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Administration id is required";
			}

			if(typeof medicationAdministrationDosageId !== 'undefined'){
				if(validator.isEmpty(medicationAdministrationDosageId)){
					err_code = 2;
					err_msg = "Medication Administration Performer id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Medication Administration Performer id is required";
			}
			
			/*
			var text  = req.body.text;
			var site  = req.body.site;
			var route  = req.body.route;
			var method  = req.body.method;
			var dose  = req.body.dose;
			var rate_ratio_numerator  = req.body.rate_ratio_numerator;
			var rate_ratio_denominator   = req.body.rate_ratio_denominator;
			var rate_quality  = req.body.rate_quality;
			*/
			if(typeof req.body.text !== 'undefined' && req.body.text !== ""){
				var dosageText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(dosageText)){
					dataMedicationAdministrationDosage.text = "";
				}else{
					dataMedicationAdministrationDosage.text = dosageText;
				}
			}else{
			  dosageText = "";
			}

			if(typeof req.body.site !== 'undefined' && req.body.site !== ""){
				var dosageSite =  req.body.site.trim().toLowerCase();
				if(validator.isEmpty(dosageSite)){
					dataMedicationAdministrationDosage.site = "";
				}else{
					dataMedicationAdministrationDosage.site = dosageSite;
				}
			}else{
			  dosageSite = "";
			}

			if(typeof req.body.route !== 'undefined' && req.body.route !== ""){
				var dosageRoute =  req.body.route.trim().toLowerCase();
				if(validator.isEmpty(dosageRoute)){
					dataMedicationAdministrationDosage.route = "";
				}else{
					dataMedicationAdministrationDosage.route = dosageRoute;
				}
			}else{
			  dosageRoute = "";
			}

			if(typeof req.body.method !== 'undefined' && req.body.method !== ""){
				var dosageMethod =  req.body.method.trim().toLowerCase();
				if(validator.isEmpty(dosageMethod)){
					dataMedicationAdministrationDosage.method = "";
				}else{
					dataMedicationAdministrationDosage.method = dosageMethod;
				}
			}else{
			  dosageMethod = "";
			}

			if(typeof req.body.dose !== 'undefined' && req.body.dose !== ""){
				var dosageDose =  req.body.dose;
				if(validator.isEmpty(dosageDose)){
					dataMedicationAdministrationDosage.dose = "";
				}else{
					if(validator.isInt(dosageDose)){
						err_code = 2;
						err_msg = "medication administration dosage dose is must be number.";
					}else{
						dataMedicationAdministrationDosage.dose = dosageDose;
					}
				}
			}else{
			  dosageDose = "";
			}

			if (typeof req.body.rate.rateRatio !== 'undefined' && req.body.rate.rateRatio !== "") {
			  var dosageRateRateRatio = req.body.rate.rateRatio;
			  if (dosageRateRateRatio.indexOf("to") > 0) {
			    arrDosageRateRateRatio = dosageRateRateRatio.split("to");
			    dataMedicationAdministrationDosage.rate_ratio_numerator = arrDosageRateRateRatio[0];
			    dataMedicationAdministrationDosage.rate_ratio_denominator = arrDosageRateRateRatio[1];
				} else {
			  	err_code = 2;
			  	err_msg = "medication administration dosage rate rate ratio invalid ratio format.";
				}
			} else {
			  dosageRateRateRatio = "";
			}

			if(typeof req.body.rate.rateQuantity !== 'undefined' && req.body.rate.rateQuantity !== ""){
				var dosageRateRateQuantity =  req.body.rate.rateQuantity.trim().toLowerCase();
				if(validator.isEmpty(dosageRateRateQuantity)){
					dataMedicationAdministrationDosage.rate_quality = "";
				}else{
					dataMedicationAdministrationDosage.rate_quality = dosageRateRateQuantity;
				}
			}else{
			  dosageRateRateQuantity = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkMedicationAdministrationID', function(){
							checkUniqeValue(apikey, "MEDICATION_ADMINISTRATION_ID|" + medicationAdministrationId, 'MEDICATION_ADMINISTRATION', function(resMedicationAdministrationID){
								if(resMedicationAdministrationID.err_code > 0){
									checkUniqeValue(apikey, "DOSAGE_ID|" + medicationAdministrationDosageId, 'MEDICATION_ADMINISTRATION_DOSAGE', function(resMedicationAdministrationDosageID){
										if(resMedicationAdministrationDosageID.err_code > 0){
											ApiFHIR.put('medicationAdministrationDosage', {"apikey": apikey, "_id": medicationAdministrationDosageId, "dr": "MEDICATION_ADMINISTRATION_ID|"+medicationAdministrationId}, {body: dataMedicationAdministrationDosage, json: true}, function(error, response, body){
												medicationAdministrationDosage = body;
												if(medicationAdministrationDosage.err_code > 0){
													res.json(medicationAdministrationDosage);	
												}else{
													res.json({"err_code": 0, "err_msg": "Medication Administration Dosage has been update in this Medication Administration.", "data": medicationAdministrationDosage.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Medication Administration Dosage Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Medication Administration Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkDosageSite', function () {
							if (!validator.isEmpty(dosageSite)) {
								checkCode(apikey, dosageSite, 'APPROACH_SITE_CODES', function (resDosageSiteCode) {
									if (resDosageSiteCode.err_code > 0) {
										myEmitter.emit('checkMedicationAdministrationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Dosage site code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkMedicationAdministrationID');
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