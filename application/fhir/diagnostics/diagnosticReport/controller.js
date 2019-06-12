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
		diagnosticReport : function getDiagnosticReport(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var diagnosticReportId = req.query._id;
			var based_on = req.query.basedOn;
			var category = req.query.category;
			var code = req.query.code;
			var context = req.query.context;
			var date = req.query.date;
			var diagnosis = req.query.diagnosis;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var image = req.query.image;
			var issued = req.query.issued;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var result = req.query.result;
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
			
			if(typeof diagnosticReportId !== 'undefined'){
				if(!validator.isEmpty(diagnosticReportId)){
					qString._id = diagnosticReportId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Diagnostic Report Id is required."});
				}
			}
			
			if(typeof based_on !== 'undefined'){
				if(!validator.isEmpty(based_on)){
					qString.based_on = based_on; 
				}else{
					res.json({"err_code": 1, "err_msg": "Based on is empty."});
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

			if(typeof diagnosis !== 'undefined'){
				if(!validator.isEmpty(diagnosis)){
					qString.diagnosis = diagnosis; 
				}else{
					res.json({"err_code": 1, "err_msg": "Diagnosis is empty."});
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

			if(typeof image !== 'undefined'){
				if(!validator.isEmpty(image)){
					qString.image = image; 
				}else{
					res.json({"err_code": 1, "err_msg": "Image is empty."});
				}
			}

			if(typeof issued !== 'undefined'){
				if(!validator.isEmpty(issued)){
					if(!regex.test(issued)){
						res.json({"err_code": 1, "err_msg": "Issued invalid format."});
					}else{
						qString.issued = issued; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Issued is empty."});
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

			if(typeof result !== 'undefined'){
				if(!validator.isEmpty(result)){
					qString.result = result; 
				}else{
					res.json({"err_code": 1, "err_msg": "Result is empty."});
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
				"DiagnosticReport" : {
					"location": "%(apikey)s/DiagnosticReport",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('DiagnosticReport', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var diagnosticReport = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(diagnosticReport.err_code == 0){
								//cek jumdata dulu
								if(diagnosticReport.data.length > 0){
									newDiagnosticReport = [];
									for(i=0; i < diagnosticReport.data.length; i++){
										myEmitter.once("getIdentifier", function(diagnosticReport, index, newDiagnosticReport, countDiagnosticReport){
											/*console.log(diagnosticReport);*/
											//get identifier
											qString = {};
											qString.diagnostic_report_id = diagnosticReport.id;
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
													var objectDiagnosticReport = {};
													objectDiagnosticReport.resourceType = diagnosticReport.resourceType;
													objectDiagnosticReport.id = diagnosticReport.id;
													objectDiagnosticReport.identifier = identifier.data;
													objectDiagnosticReport.status = diagnosticReport.status;
													objectDiagnosticReport.category = diagnosticReport.category;
													objectDiagnosticReport.code = diagnosticReport.code;
													objectDiagnosticReport.subject = diagnosticReport.subject;
													objectDiagnosticReport.content = diagnosticReport.content;
													objectDiagnosticReport.effective = diagnosticReport.effective;
													objectDiagnosticReport.issued = diagnosticReport.issued;
													objectDiagnosticReport.conclusion = diagnosticReport.conclusion;
													objectDiagnosticReport.codedDiagnosis = diagnosticReport.codedDiagnosis;
												
													newDiagnosticReport[index] = objectDiagnosticReport;

													myEmitter.once('getDiagnosticReportPerformer', function(diagnosticReport, index, newDiagnosticReport, countDiagnosticReport){
														qString = {};
														qString.diagnostic_report_id = diagnosticReport.id;
														seedPhoenixFHIR.path.GET = {
															"DiagnosticReportPerformer" : {
																"location": "%(apikey)s/DiagnosticReportPerformer",
																"query": qString
															}
														}

														var ApiFHIR = new Apiclient(seedPhoenixFHIR);

														ApiFHIR.get('DiagnosticReportPerformer', {"apikey": apikey}, {}, function(error, response, body){
															diagnosticReportPerformer = JSON.parse(body);
															if(diagnosticReportPerformer.err_code == 0){
																var objectDiagnosticReport = {};
																objectDiagnosticReport.resourceType = diagnosticReport.resourceType;
																objectDiagnosticReport.id = diagnosticReport.id;
																objectDiagnosticReport.identifier = diagnosticReport.identifier;
																objectDiagnosticReport.status = diagnosticReport.status;
																objectDiagnosticReport.category = diagnosticReport.category;
																objectDiagnosticReport.code = diagnosticReport.code;
																objectDiagnosticReport.subject = diagnosticReport.subject;
																objectDiagnosticReport.content = diagnosticReport.content;
																objectDiagnosticReport.effective = diagnosticReport.effective;
																objectDiagnosticReport.issued = diagnosticReport.issued;
																objectDiagnosticReport.performed = diagnosticReportPerformer.data;
																objectDiagnosticReport.conclusion = diagnosticReport.conclusion;
																objectDiagnosticReport.codedDiagnosis = diagnosticReport.codedDiagnosis;
																
																newDiagnosticReport[index] = objectDiagnosticReport;
																
																myEmitter.once('getDiagnosticReportReportImage', function(diagnosticReport, index, newDiagnosticReport, countDiagnosticReport){
																	qString = {};
																	qString.diagnostic_report_id = diagnosticReport.id;
																	seedPhoenixFHIR.path.GET = {
																		"DiagnosticReportReportImage" : {
																			"location": "%(apikey)s/DiagnosticReportReportImage",
																			"query": qString
																		}
																	}

																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																	ApiFHIR.get('DiagnosticReportReportImage', {"apikey": apikey}, {}, function(error, response, body){
																		diagnosticReportReportImage = JSON.parse(body);
																		if(diagnosticReportReportImage.err_code == 0){
																			var objectDiagnosticReport = {};
																			objectDiagnosticReport.resourceType = diagnosticReport.resourceType;
																			objectDiagnosticReport.id = diagnosticReport.id;
																			objectDiagnosticReport.identifier = diagnosticReport.identifier;
																			objectDiagnosticReport.status = diagnosticReport.status;
																			objectDiagnosticReport.category = diagnosticReport.category;
																			objectDiagnosticReport.code = diagnosticReport.code;
																			objectDiagnosticReport.subject = diagnosticReport.subject;
																			objectDiagnosticReport.content = diagnosticReport.content;
																			objectDiagnosticReport.effective = diagnosticReport.effective;
																			objectDiagnosticReport.issued = diagnosticReport.issued;
																			objectDiagnosticReport.performed = diagnosticReport.performed;
																			objectDiagnosticReport.image = diagnosticReportReportImage.data;
																			objectDiagnosticReport.conclusion = diagnosticReport.conclusion;
																			objectDiagnosticReport.codedDiagnosis = diagnosticReport.codedDiagnosis;

																			newDiagnosticReport[index] = objectDiagnosticReport;
																			
																			myEmitter.once('getDiagnosticReportPresentedForm', function(diagnosticReport, index, newDiagnosticReport, countDiagnosticReport){
																				qString = {};
																				qString.diagnostic_report_id = diagnosticReport.id;
																				seedPhoenixFHIR.path.GET = {
																					"Attachment" : {
																						"location": "%(apikey)s/Attachment",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('Attachment', {"apikey": apikey}, {}, function(error, response, body){
																					attachment = JSON.parse(body);
																					if(attachment.err_code == 0){
																						var objectDiagnosticReport = {};
																						objectDiagnosticReport.resourceType = diagnosticReport.resourceType;
																						objectDiagnosticReport.id = diagnosticReport.id;
																						objectDiagnosticReport.identifier = diagnosticReport.identifier;
																						objectDiagnosticReport.status = diagnosticReport.status;
																						objectDiagnosticReport.category = diagnosticReport.category;
																						objectDiagnosticReport.code = diagnosticReport.code;
																						objectDiagnosticReport.subject = diagnosticReport.subject;
																						objectDiagnosticReport.content = diagnosticReport.content;
																						objectDiagnosticReport.effective = diagnosticReport.effective;
																						objectDiagnosticReport.issued = diagnosticReport.issued;
																						objectDiagnosticReport.performed = diagnosticReport.performed;
																						objectDiagnosticReport.image = diagnosticReport.image;
																						objectDiagnosticReport.conclusion = diagnosticReport.conclusion;
																						objectDiagnosticReport.codedDiagnosis = diagnosticReport.codedDiagnosis;
																						objectDiagnosticReport.presentedForm = attachment.data;

																						newDiagnosticReport[index] = objectDiagnosticReport;
																						/*if(index == countDiagnosticReport -1 ){
																							res.json({"err_code": 0, "data":newDiagnosticReport});
																						}*/
																		
myEmitter.once('getBasedOnCarePlan', function(diagnosticReport, index, newDiagnosticReport, countDiagnosticReport){
	qString = {};
	qString.diagnostic_report_id = diagnosticReport.id;
	seedPhoenixFHIR.path.GET = {
		"CarePlan" : {
			"location": "%(apikey)s/CarePlan",
			"query": qString
		}
	}

	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

	ApiFHIR.get('CarePlan', {"apikey": apikey}, {}, function(error, response, body){
		carePlan = JSON.parse(body);
		if(carePlan.err_code == 0){
			var objectDiagnosticReport = {};
			objectDiagnosticReport.resourceType = diagnosticReport.resourceType;
			objectDiagnosticReport.id = diagnosticReport.id;
			objectDiagnosticReport.identifier = diagnosticReport.identifier;
			var BaseOn = {};
			BaseOn.carePlan = carePlan.data;
			objectDiagnosticReport.baseOn = BaseOn;
			objectDiagnosticReport.status = diagnosticReport.status;
			objectDiagnosticReport.category = diagnosticReport.category;
			objectDiagnosticReport.code = diagnosticReport.code;
			objectDiagnosticReport.subject = diagnosticReport.subject;
			objectDiagnosticReport.content = diagnosticReport.content;
			objectDiagnosticReport.effective = diagnosticReport.effective;
			objectDiagnosticReport.issued = diagnosticReport.issued;
			objectDiagnosticReport.performed = diagnosticReport.performed;
			objectDiagnosticReport.image = diagnosticReport.image;
			objectDiagnosticReport.conclusion = diagnosticReport.conclusion;
			objectDiagnosticReport.codedDiagnosis = diagnosticReport.codedDiagnosis;
			objectDiagnosticReport.presentedForm = diagnosticReport.presentedForm;

			newDiagnosticReport[index] = objectDiagnosticReport;
			
			myEmitter.once('getBasedOnImmunizationRecommendation', function(diagnosticReport, index, newDiagnosticReport, countDiagnosticReport){
				qString = {};
				qString.diagnostic_report_id = diagnosticReport.id;
				seedPhoenixFHIR.path.GET = {
					"ImmunizationRecommendation" : {
						"location": "%(apikey)s/ImmunizationRecommendation",
						"query": qString
					}
				}

				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

				ApiFHIR.get('ImmunizationRecommendation', {"apikey": apikey}, {}, function(error, response, body){
					immunizationRecommendation = JSON.parse(body);
					if(immunizationRecommendation.err_code == 0){
						var objectDiagnosticReport = {};
						objectDiagnosticReport.resourceType = diagnosticReport.resourceType;
						objectDiagnosticReport.id = diagnosticReport.id;
						objectDiagnosticReport.identifier = diagnosticReport.identifier;
						var BaseOn = {};
						BaseOn.carePlan = diagnosticReport.baseOn.carePlan;
						BaseOn.immunizationRecommendation = immunizationRecommendation.data;
						objectDiagnosticReport.baseOn = BaseOn;
						objectDiagnosticReport.status = diagnosticReport.status;
						objectDiagnosticReport.category = diagnosticReport.category;
						objectDiagnosticReport.code = diagnosticReport.code;
						objectDiagnosticReport.subject = diagnosticReport.subject;
						objectDiagnosticReport.content = diagnosticReport.content;
						objectDiagnosticReport.effective = diagnosticReport.effective;
						objectDiagnosticReport.issued = diagnosticReport.issued;
						objectDiagnosticReport.performed = diagnosticReport.performed;
						objectDiagnosticReport.image = diagnosticReport.image;
						objectDiagnosticReport.conclusion = diagnosticReport.conclusion;
						objectDiagnosticReport.codedDiagnosis = diagnosticReport.codedDiagnosis;
						objectDiagnosticReport.presentedForm = diagnosticReport.presentedForm;

						newDiagnosticReport[index] = objectDiagnosticReport;
						
						myEmitter.once('getBasedOnMedicationRequest', function(diagnosticReport, index, newDiagnosticReport, countDiagnosticReport){
							qString = {};
							qString.diagnostic_report_id = diagnosticReport.id;
							seedPhoenixFHIR.path.GET = {
								"MedicationRequest" : {
									"location": "%(apikey)s/MedicationRequest",
									"query": qString
								}
							}

							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

							ApiFHIR.get('MedicationRequest', {"apikey": apikey}, {}, function(error, response, body){
								medicationRequest = JSON.parse(body);
								if(medicationRequest.err_code == 0){
									var objectDiagnosticReport = {};
									objectDiagnosticReport.resourceType = diagnosticReport.resourceType;
									objectDiagnosticReport.id = diagnosticReport.id;
									objectDiagnosticReport.identifier = diagnosticReport.identifier;
									var BaseOn = {};
									BaseOn.carePlan = diagnosticReport.baseOn.carePlan;
									BaseOn.immunizationRecommendation = diagnosticReport.baseOn.immunizationRecommendation;
									BaseOn.medicationRequest = medicationRequest.data;
									objectDiagnosticReport.baseOn = BaseOn;
									objectDiagnosticReport.status = diagnosticReport.status;
									objectDiagnosticReport.category = diagnosticReport.category;
									objectDiagnosticReport.code = diagnosticReport.code;
									objectDiagnosticReport.subject = diagnosticReport.subject;
									objectDiagnosticReport.content = diagnosticReport.content;
									objectDiagnosticReport.effective = diagnosticReport.effective;
									objectDiagnosticReport.issued = diagnosticReport.issued;
									objectDiagnosticReport.performed = diagnosticReport.performed;
									objectDiagnosticReport.image = diagnosticReport.image;
									objectDiagnosticReport.conclusion = diagnosticReport.conclusion;
									objectDiagnosticReport.codedDiagnosis = diagnosticReport.codedDiagnosis;
									objectDiagnosticReport.presentedForm = diagnosticReport.presentedForm;

									newDiagnosticReport[index] = objectDiagnosticReport;

									myEmitter.once('getBasedOnNutritionOrder', function(diagnosticReport, index, newDiagnosticReport, countDiagnosticReport){
										qString = {};
										qString.diagnostic_report_id = diagnosticReport.id;
										seedPhoenixFHIR.path.GET = {
											"NutritionOrder" : {
												"location": "%(apikey)s/NutritionOrder",
												"query": qString
											}
										}

										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('NutritionOrder', {"apikey": apikey}, {}, function(error, response, body){
											nutritionOrder = JSON.parse(body);
											if(nutritionOrder.err_code == 0){
												var objectDiagnosticReport = {};
												objectDiagnosticReport.resourceType = diagnosticReport.resourceType;
												objectDiagnosticReport.id = diagnosticReport.id;
												objectDiagnosticReport.identifier = diagnosticReport.identifier;
												var BaseOn = {};
												BaseOn.carePlan = diagnosticReport.baseOn.carePlan;
												BaseOn.immunizationRecommendation = diagnosticReport.baseOn.immunizationRecommendation;
												BaseOn.medicationRequest = diagnosticReport.baseOn.medicationRequest;
												BaseOn.nutritionOrder = nutritionOrder.data;
												objectDiagnosticReport.baseOn = BaseOn;
												objectDiagnosticReport.status = diagnosticReport.status;
												objectDiagnosticReport.category = diagnosticReport.category;
												objectDiagnosticReport.code = diagnosticReport.code;
												objectDiagnosticReport.subject = diagnosticReport.subject;
												objectDiagnosticReport.content = diagnosticReport.content;
												objectDiagnosticReport.effective = diagnosticReport.effective;
												objectDiagnosticReport.issued = diagnosticReport.issued;
												objectDiagnosticReport.performed = diagnosticReport.performed;
												objectDiagnosticReport.image = diagnosticReport.image;
												objectDiagnosticReport.conclusion = diagnosticReport.conclusion;
												objectDiagnosticReport.codedDiagnosis = diagnosticReport.codedDiagnosis;
												objectDiagnosticReport.presentedForm = diagnosticReport.presentedForm;

												newDiagnosticReport[index] = objectDiagnosticReport;
												
												myEmitter.once('getBasedOnProcedureRequest', function(diagnosticReport, index, newDiagnosticReport, countDiagnosticReport){
													qString = {};
													qString.diagnostic_report_id = diagnosticReport.id;
													seedPhoenixFHIR.path.GET = {
														"ProcedureRequest" : {
															"location": "%(apikey)s/ProcedureRequest",
															"query": qString
														}
													}

													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

													ApiFHIR.get('ProcedureRequest', {"apikey": apikey}, {}, function(error, response, body){
														procedureRequest = JSON.parse(body);
														if(procedureRequest.err_code == 0){
															var objectDiagnosticReport = {};
															objectDiagnosticReport.resourceType = diagnosticReport.resourceType;
															objectDiagnosticReport.id = diagnosticReport.id;
															objectDiagnosticReport.identifier = diagnosticReport.identifier;
															var BaseOn = {};
															BaseOn.carePlan = diagnosticReport.baseOn.carePlan;
															BaseOn.immunizationRecommendation = diagnosticReport.baseOn.immunizationRecommendation;
															BaseOn.medicationRequest = diagnosticReport.baseOn.medicationRequest;
															BaseOn.nutritionOrder = diagnosticReport.baseOn.nutritionOrder;
															BaseOn.procedureRequest = procedureRequest.data;
															objectDiagnosticReport.baseOn = BaseOn;
															objectDiagnosticReport.status = diagnosticReport.status;
															objectDiagnosticReport.category = diagnosticReport.category;
															objectDiagnosticReport.code = diagnosticReport.code;
															objectDiagnosticReport.subject = diagnosticReport.subject;
															objectDiagnosticReport.content = diagnosticReport.content;
															objectDiagnosticReport.effective = diagnosticReport.effective;
															objectDiagnosticReport.issued = diagnosticReport.issued;
															objectDiagnosticReport.performed = diagnosticReport.performed;
															objectDiagnosticReport.image = diagnosticReport.image;
															objectDiagnosticReport.conclusion = diagnosticReport.conclusion;
															objectDiagnosticReport.codedDiagnosis = diagnosticReport.codedDiagnosis;
															objectDiagnosticReport.presentedForm = diagnosticReport.presentedForm;

															newDiagnosticReport[index] = objectDiagnosticReport;
															
															myEmitter.once('getBasedOnReferralRequest', function(diagnosticReport, index, newDiagnosticReport, countDiagnosticReport){
																qString = {};
																qString.diagnostic_report_id = diagnosticReport.id;
																seedPhoenixFHIR.path.GET = {
																	"ReferralRequest" : {
																		"location": "%(apikey)s/ReferralRequest",
																		"query": qString
																	}
																}

																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																ApiFHIR.get('ReferralRequest', {"apikey": apikey}, {}, function(error, response, body){
																	referralRequest = JSON.parse(body);
																	if(referralRequest.err_code == 0){
																		var objectDiagnosticReport = {};
																		objectDiagnosticReport.resourceType = diagnosticReport.resourceType;
																		objectDiagnosticReport.id = diagnosticReport.id;
																		objectDiagnosticReport.identifier = diagnosticReport.identifier;
																		var BaseOn = {};
																		BaseOn.carePlan = diagnosticReport.baseOn.carePlan;
																		BaseOn.immunizationRecommendation = diagnosticReport.baseOn.immunizationRecommendation;
																		BaseOn.medicationRequest = diagnosticReport.baseOn.medicationRequest;
																		BaseOn.nutritionOrder = diagnosticReport.baseOn.nutritionOrder;
																		BaseOn.procedureRequest = diagnosticReport.baseOn.procedureRequest;
																		BaseOn.referralRequest = referralRequest.data;
																		objectDiagnosticReport.baseOn = BaseOn;
																		objectDiagnosticReport.status = diagnosticReport.status;
																		objectDiagnosticReport.category = diagnosticReport.category;
																		objectDiagnosticReport.code = diagnosticReport.code;
																		objectDiagnosticReport.subject = diagnosticReport.subject;
																		objectDiagnosticReport.content = diagnosticReport.content;
																		objectDiagnosticReport.effective = diagnosticReport.effective;
																		objectDiagnosticReport.issued = diagnosticReport.issued;
																		objectDiagnosticReport.performed = diagnosticReport.performed;
																		objectDiagnosticReport.image = diagnosticReport.image;
																		objectDiagnosticReport.conclusion = diagnosticReport.conclusion;
																		objectDiagnosticReport.codedDiagnosis = diagnosticReport.codedDiagnosis;
																		objectDiagnosticReport.presentedForm = diagnosticReport.presentedForm;

																		newDiagnosticReport[index] = objectDiagnosticReport;

																		myEmitter.once('getSpecimen', function(diagnosticReport, index, newDiagnosticReport, countDiagnosticReport){
																			qString = {};
																			qString.diagnostic_report_id = diagnosticReport.id;
																			seedPhoenixFHIR.path.GET = {
																				"Specimen" : {
																					"location": "%(apikey)s/Specimen",
																					"query": qString
																				}
																			}

																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																			ApiFHIR.get('Specimen', {"apikey": apikey}, {}, function(error, response, body){
																				specimen = JSON.parse(body);
																				if(specimen.err_code == 0){
																					var objectDiagnosticReport = {};
																					objectDiagnosticReport.resourceType = diagnosticReport.resourceType;
																					objectDiagnosticReport.id = diagnosticReport.id;
																					objectDiagnosticReport.identifier = diagnosticReport.identifier;
																					objectDiagnosticReport.baseOn = diagnosticReport.baseOn;
																					objectDiagnosticReport.status = diagnosticReport.status;
																					objectDiagnosticReport.category = diagnosticReport.category;
																					objectDiagnosticReport.code = diagnosticReport.code;
																					objectDiagnosticReport.subject = diagnosticReport.subject;
																					objectDiagnosticReport.content = diagnosticReport.content;
																					objectDiagnosticReport.effective = diagnosticReport.effective;
																					objectDiagnosticReport.issued = diagnosticReport.issued;
																					objectDiagnosticReport.performed = diagnosticReport.performed;
																					objectDiagnosticReport.specimen = specimen.data;
																					objectDiagnosticReport.image = diagnosticReport.image;
																					objectDiagnosticReport.conclusion = diagnosticReport.conclusion;
																					objectDiagnosticReport.codedDiagnosis = diagnosticReport.codedDiagnosis;
																					objectDiagnosticReport.presentedForm = diagnosticReport.presentedForm;

																					newDiagnosticReport[index] = objectDiagnosticReport;
/*
specimen|specimen||
result|diagnosticReportResult||
imagingStudy.imagingStudy|imagingStudyImagingStudy||
imagingStudy.imagingManifest|imagingStudyImagingManifest||
*/																					
																					myEmitter.once('getDiagnosticReportResult', function(diagnosticReport, index, newDiagnosticReport, countDiagnosticReport){
																						qString = {};
																						qString.diagnostic_report_id = diagnosticReport.id;
																						seedPhoenixFHIR.path.GET = {
																							"Observation" : {
																								"location": "%(apikey)s/Observation",
																								"query": qString
																							}
																						}

																						var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																						ApiFHIR.get('Observation', {"apikey": apikey}, {}, function(error, response, body){
																							observation = JSON.parse(body);
																							if(observation.err_code == 0){
																								var objectDiagnosticReport = {};
																								objectDiagnosticReport.resourceType = diagnosticReport.resourceType;
																								objectDiagnosticReport.id = diagnosticReport.id;
																								objectDiagnosticReport.identifier = diagnosticReport.identifier;
																								objectDiagnosticReport.baseOn = diagnosticReport.baseOn;
																								objectDiagnosticReport.status = diagnosticReport.status;
																								objectDiagnosticReport.category = diagnosticReport.category;
																								objectDiagnosticReport.code = diagnosticReport.code;
																								objectDiagnosticReport.subject = diagnosticReport.subject;
																								objectDiagnosticReport.content = diagnosticReport.content;
																								objectDiagnosticReport.effective = diagnosticReport.effective;
																								objectDiagnosticReport.issued = diagnosticReport.issued;
																								objectDiagnosticReport.performed = diagnosticReport.performed;
																								objectDiagnosticReport.specimen = diagnosticReport.specimen;
																								objectDiagnosticReport.result = observation.data;
																								objectDiagnosticReport.image = diagnosticReport.image;
																								objectDiagnosticReport.conclusion = diagnosticReport.conclusion;
																								objectDiagnosticReport.codedDiagnosis = diagnosticReport.codedDiagnosis;
																								objectDiagnosticReport.presentedForm = diagnosticReport.presentedForm;

																								newDiagnosticReport[index] = objectDiagnosticReport;
																								
																								myEmitter.once('getImagingStudy', function(diagnosticReport, index, newDiagnosticReport, countDiagnosticReport){
																									qString = {};
																									qString.diagnostic_report_id = diagnosticReport.id;
																									seedPhoenixFHIR.path.GET = {
																										"ImagingStudy" : {
																											"location": "%(apikey)s/ImagingStudy",
																											"query": qString
																										}
																									}

																									var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																									ApiFHIR.get('ImagingStudy', {"apikey": apikey}, {}, function(error, response, body){
																										imagingStudy = JSON.parse(body);
																										if(imagingStudy.err_code == 0){
																											var objectDiagnosticReport = {};
																											objectDiagnosticReport.resourceType = diagnosticReport.resourceType;
																											objectDiagnosticReport.id = diagnosticReport.id;
																											objectDiagnosticReport.identifier = diagnosticReport.identifier;
																											objectDiagnosticReport.baseOn = diagnosticReport.baseOn;
																											objectDiagnosticReport.status = diagnosticReport.status;
																											objectDiagnosticReport.category = diagnosticReport.category;
																											objectDiagnosticReport.code = diagnosticReport.code;
																											objectDiagnosticReport.subject = diagnosticReport.subject;
																											objectDiagnosticReport.content = diagnosticReport.content;
																											objectDiagnosticReport.effective = diagnosticReport.effective;
																											objectDiagnosticReport.issued = diagnosticReport.issued;
																											objectDiagnosticReport.performed = diagnosticReport.performed;
																											objectDiagnosticReport.specimen = diagnosticReport.specimen;
																											objectDiagnosticReport.result = diagnosticReport.result;
																											var ImagingStudy = {};
																											ImagingStudy.imagingStudy = imagingStudy.data;
																											objectDiagnosticReport.imagingStudy = ImagingStudy;
																											objectDiagnosticReport.image = diagnosticReport.image;
																											objectDiagnosticReport.conclusion = diagnosticReport.conclusion;
																											objectDiagnosticReport.codedDiagnosis = diagnosticReport.codedDiagnosis;
																											objectDiagnosticReport.presentedForm = diagnosticReport.presentedForm;

																											newDiagnosticReport[index] = objectDiagnosticReport;
																											
																											myEmitter.once('getImagingManifest', function(diagnosticReport, index, newDiagnosticReport, countDiagnosticReport){
																												qString = {};
																												qString.diagnostic_report_id = diagnosticReport.id;
																												seedPhoenixFHIR.path.GET = {
																													"ImagingManifest" : {
																														"location": "%(apikey)s/ImagingManifest",
																														"query": qString
																													}
																												}

																												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																												ApiFHIR.get('ImagingManifest', {"apikey": apikey}, {}, function(error, response, body){
																													imagingManifest = JSON.parse(body);
																													if(imagingManifest.err_code == 0){
																														var objectDiagnosticReport = {};
																														objectDiagnosticReport.resourceType = diagnosticReport.resourceType;
																														objectDiagnosticReport.id = diagnosticReport.id;
																														objectDiagnosticReport.identifier = diagnosticReport.identifier;
																														objectDiagnosticReport.baseOn = diagnosticReport.baseOn;
																														objectDiagnosticReport.status = diagnosticReport.status;
																														objectDiagnosticReport.category = diagnosticReport.category;
																														objectDiagnosticReport.code = diagnosticReport.code;
																														objectDiagnosticReport.subject = diagnosticReport.subject;
																														objectDiagnosticReport.content = diagnosticReport.content;
																														objectDiagnosticReport.effective = diagnosticReport.effective;
																														objectDiagnosticReport.issued = diagnosticReport.issued;
																														objectDiagnosticReport.performed = diagnosticReport.performed;
																														objectDiagnosticReport.specimen = diagnosticReport.specimen;
																														objectDiagnosticReport.result = diagnosticReport.result;
																														var ImagingStudy = {};
																														ImagingStudy.imagingStudy = diagnosticReport.imagingStudy.imagingStudy;
																														ImagingStudy.imagingManifest = imagingManifest.data;
																														objectDiagnosticReport.imagingStudy = ImagingStudy;
																														objectDiagnosticReport.image = diagnosticReport.image;
																														objectDiagnosticReport.conclusion = diagnosticReport.conclusion;
																														objectDiagnosticReport.codedDiagnosis = diagnosticReport.codedDiagnosis;
																														objectDiagnosticReport.presentedForm = diagnosticReport.presentedForm;

																														newDiagnosticReport[index] = objectDiagnosticReport;
																														if(index == countDiagnosticReport -1 ){
																															res.json({"err_code": 0, "data":newDiagnosticReport});
																														}
																													}else{
																														res.json(imagingManifest);			
																													}
																												})
																											});
																											myEmitter.emit('getImagingManifest', objectDiagnosticReport, index, newDiagnosticReport, countDiagnosticReport);
																										}else{
																											res.json(imagingStudy);			
																										}
																									})
																								});
																								myEmitter.emit('getImagingStudy', objectDiagnosticReport, index, newDiagnosticReport, countDiagnosticReport);
																							}else{
																								res.json(observation);			
																							}
																						})
																					});
																					myEmitter.emit('getDiagnosticReportResult', objectDiagnosticReport, index, newDiagnosticReport, countDiagnosticReport);
																				}else{
																					res.json(referralRequest);			
																				}
																			})
																		});
																		myEmitter.emit('getSpecimen', objectDiagnosticReport, index, newDiagnosticReport, countDiagnosticReport);
																	}else{
																		res.json(referralRequest);			
																	}
																})
															});
															myEmitter.emit('getBasedOnReferralRequest', objectDiagnosticReport, index, newDiagnosticReport, countDiagnosticReport);
														}else{
															res.json(procedureRequest);			
														}
													})
												});
												myEmitter.emit('getBasedOnProcedureRequest', objectDiagnosticReport, index, newDiagnosticReport, countDiagnosticReport);
											}else{
												res.json(nutritionOrder);			
											}
										})
									});
									myEmitter.emit('getBasedOnNutritionOrder', objectDiagnosticReport, index, newDiagnosticReport, countDiagnosticReport);
								}else{
									res.json(medicationRequest);			
								}
							})
						});
						myEmitter.emit('getBasedOnMedicationRequest', objectDiagnosticReport, index, newDiagnosticReport, countDiagnosticReport);
					}else{
						res.json(immunizationRecommendation);			
					}
				})
			});
			myEmitter.emit('getBasedOnImmunizationRecommendation', objectDiagnosticReport, index, newDiagnosticReport, countDiagnosticReport);
		}else{
			res.json(carePlan);			
		}
	})
});
myEmitter.emit('getBasedOnCarePlan', objectDiagnosticReport, index, newDiagnosticReport, countDiagnosticReport);
																					}else{
																						res.json(attachment);			
																					}
																				})
																			});
																			myEmitter.emit('getDiagnosticReportPresentedForm', objectDiagnosticReport, index, newDiagnosticReport, countDiagnosticReport);
																		}else{
																			res.json(diagnosticReportReportImage);			
																		}
																	})
																});
																myEmitter.emit('getDiagnosticReportReportImage', objectDiagnosticReport, index, newDiagnosticReport, countDiagnosticReport);
															}else{
																res.json(diagnosticReportPerformer);			
															}
														})
													})
													myEmitter.emit('getDiagnosticReportPerformer', objectDiagnosticReport, index, newDiagnosticReport, countDiagnosticReport);
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", diagnosticReport.data[i], i, newDiagnosticReport, diagnosticReport.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Diagnostic Report is empty."});	
								}
							}else{
								res.json(diagnosticReport);
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
					var diagnosticReportId = req.params.diagnostic_report_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + diagnosticReportId, 'DIAGNOSTIC_REPORT', function(resDiagnosticReportID){
								if(resDiagnosticReportID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.diagnostic_report_id = diagnosticReportId;
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
						  			qString.diagnostic_report_id = diagnosticReportId;
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
									res.json({"err_code": 501, "err_msg": "Diagnostic Report Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		diagnosticReportPerformer: function getDiagnosticReportPerformer(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var diagnosticReportId = req.params.diagnostic_report_id;
			var diagnosticReportPerformerId = req.params.diagnostic_report_performer_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + diagnosticReportId, 'DIAGNOSTIC_REPORT', function(resDiagnosticReport){
						if(resDiagnosticReport.err_code > 0){
							if(typeof diagnosticReportPerformerId !== 'undefined' && !validator.isEmpty(diagnosticReportPerformerId)){
								checkUniqeValue(apikey, "PERFORMER_ID|" + diagnosticReportPerformerId, 'DIAGNOSTIC_REPORT_PERFORMER', function(resDiagnosticReportPerformerID){
									if(resDiagnosticReportPerformerID.err_code > 0){
										//get diagnosticReportPerformer
										qString = {};
										qString.diagnostic_report_id = diagnosticReportId;
										qString._id = diagnosticReportPerformerId;
										seedPhoenixFHIR.path.GET = {
											"DiagnosticReportPerformer" : {
												"location": "%(apikey)s/DiagnosticReportPerformer",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('DiagnosticReportPerformer', {"apikey": apikey}, {}, function(error, response, body){
											diagnosticReportPerformer = JSON.parse(body);
											if(diagnosticReportPerformer.err_code == 0){
												res.json({"err_code": 0, "data":diagnosticReportPerformer.data});	
											}else{
												res.json(diagnosticReportPerformer);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Diagnostic Report Performer Id not found"});		
									}
								})
							}else{
								//get diagnosticReportPerformer
								qString = {};
								qString.diagnostic_report_id = diagnosticReportId;
								seedPhoenixFHIR.path.GET = {
									"DiagnosticReportPerformer" : {
										"location": "%(apikey)s/DiagnosticReportPerformer",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('DiagnosticReportPerformer', {"apikey": apikey}, {}, function(error, response, body){
									diagnosticReportPerformer = JSON.parse(body);
									if(diagnosticReportPerformer.err_code == 0){
										res.json({"err_code": 0, "data":diagnosticReportPerformer.data});	
									}else{
										res.json(diagnosticReportPerformer);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Diagnostic Report Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		diagnosticReportReportImage: function getDiagnosticReportReportImage(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var diagnosticReportId = req.params.diagnostic_report_id;
			var diagnosticReportReportImageId = req.params.diagnostic_report_report_image_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + diagnosticReportId, 'DIAGNOSTIC_REPORT', function(resDiagnosticReport){
						if(resDiagnosticReport.err_code > 0){
							if(typeof diagnosticReportReportImageId !== 'undefined' && !validator.isEmpty(diagnosticReportReportImageId)){
								checkUniqeValue(apikey, "IMAGE_ID|" + diagnosticReportReportImageId, 'DIAGNOSTIC_REPORT_IMAGE', function(resDiagnosticReportReportImageID){
									if(resDiagnosticReportReportImageID.err_code > 0){
										//get diagnosticReportReportImage
										qString = {};
										qString.diagnostic_report_id = diagnosticReportId;
										qString._id = diagnosticReportReportImageId;
										seedPhoenixFHIR.path.GET = {
											"DiagnosticReportReportImage" : {
												"location": "%(apikey)s/DiagnosticReportReportImage",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('DiagnosticReportReportImage', {"apikey": apikey}, {}, function(error, response, body){
											diagnosticReportReportImage = JSON.parse(body);
											if(diagnosticReportReportImage.err_code == 0){
												res.json({"err_code": 0, "data":diagnosticReportReportImage.data});	
											}else{
												res.json(diagnosticReportReportImage);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Diagnostic Report Report Image Id not found"});		
									}
								})
							}else{
								//get diagnosticReportReportImage
								qString = {};
								qString.diagnostic_report_id = diagnosticReportId;
								seedPhoenixFHIR.path.GET = {
									"DiagnosticReportReportImage" : {
										"location": "%(apikey)s/DiagnosticReportReportImage",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('DiagnosticReportReportImage', {"apikey": apikey}, {}, function(error, response, body){
									diagnosticReportReportImage = JSON.parse(body);
									if(diagnosticReportReportImage.err_code == 0){
										res.json({"err_code": 0, "data":diagnosticReportReportImage.data});	
									}else{
										res.json(diagnosticReportReportImage);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Diagnostic Report Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		attachment: function getAttachment(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var diagnosticReportId = req.params.diagnostic_report_id;
			var attachmentId = req.params.attachment_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + diagnosticReportId, 'DIAGNOSTIC_REPORT', function(resDiagnosticReportId){
						if(resDiagnosticReportId.err_code > 0){
							if(typeof attachmentId !== 'undefined' && !validator.isEmpty(attachmentId)){
								checkUniqeValue(apikey, "ATTACHMENT_ID|" + attachmentId, 'ATTACHMENT', function(resAttachmentID){
									if(resAttachmentID.err_code > 0){
										qString = {};
										qString.diagnostic_report_id = diagnosticReportId;
										qString._id = attachmentId;
										seedPhoenixFHIR.path.GET = {
											"Attachment" : {
												"location": "%(apikey)s/Attachment",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('Attachment', {"apikey": apikey}, {}, function(error, response, body){
											attachment = JSON.parse(body);
											if(attachment.err_code == 0){
												res.json({"err_code": 0, "data":attachment.data});	
											}else{
												res.json(address);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Attachment Id not found"});		
									}
								})
							}else{
								qString = {};
								qString.diagnostic_report_id = diagnosticReportId;

								seedPhoenixFHIR.path.GET = {
									"Attachment" : {
										"location": "%(apikey)s/Attachment",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('Attachment', {"apikey": apikey}, {}, function(error, response, body){
									attachment = JSON.parse(body);
									if(attachment.err_code == 0){
										res.json({"err_code": 0, "data":attachment.data});	
									}else{
										res.json(attachment);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Diagnostic report id not found"});		
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
		diagnosticReport : function addDiagnosticReport(req, res){
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
basedOn.carePlan|basedOnCarePlan||
basedOn.immunizationRecommendation|basedOnImmunizationRecommendation||
basedOn.medicationRequest|basedOnMedicationRequest||
basedOn.nutritionOrder|basedOnNutritionOrder||
basedOn.procedureRequest|basedOnProcedureRequest||
basedOn.referralRequest|basedOnReferralRequest||
status|status||nn
category|category||
code|code||nn
subject.patient|subjectPatient||
subject.group|subjectGroup||
subject.device|subjectDevice||
subject.location|subjectLocation||
context.encounter|contextEncounter||
context.episodeOfCare|contextEpisodeOfCare||
effective.effectiveDateTime|effectiveEffectiveDateTime|date|
effective.effectivePeriod|effectiveEffectivePeriod|period|
issued|issued|date|
performer.role|performerRole||
performer.actor.practitioner|performerActorPractitioner||
performer.actor.organization|performerActorOrganization||
specimen|specimen||
result|diagnosticReportResult||
imagingStudy.imagingStudy|imagingStudyImagingStudy||
imagingStudy.imagingManifest|imagingStudyImagingManifest||
image.comment|imageComment||
image.link|imageLink||
conclusion|conclusion||
codedDiagnosis|codedDiagnosis||
presentedForm.contentType|presentedFormContentType||
presentedForm.language|presentedFormLanguage||
presentedForm.data|presentedFormData||
presentedForm.size|presentedFormSize|integer|
presentedForm.title|presentedFormTitle||
*/
			
			if(typeof req.body.basedOn.carePlan !== 'undefined'){
				var basedOnCarePlan =  req.body.basedOn.carePlan.trim().toLowerCase();
				if(validator.isEmpty(basedOnCarePlan)){
					basedOnCarePlan = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on care plan' in json Diagnostic Report request.";
			}

			if(typeof req.body.basedOn.immunizationRecommendation !== 'undefined'){
				var basedOnImmunizationRecommendation =  req.body.basedOn.immunizationRecommendation.trim().toLowerCase();
				if(validator.isEmpty(basedOnImmunizationRecommendation)){
					basedOnImmunizationRecommendation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on immunization recommendation' in json Diagnostic Report request.";
			}

			if(typeof req.body.basedOn.medicationRequest !== 'undefined'){
				var basedOnMedicationRequest =  req.body.basedOn.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnMedicationRequest)){
					basedOnMedicationRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on medication request' in json Diagnostic Report request.";
			}

			if(typeof req.body.basedOn.nutritionOrder !== 'undefined'){
				var basedOnNutritionOrder =  req.body.basedOn.nutritionOrder.trim().toLowerCase();
				if(validator.isEmpty(basedOnNutritionOrder)){
					basedOnNutritionOrder = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on nutrition order' in json Diagnostic Report request.";
			}

			if(typeof req.body.basedOn.procedureRequest !== 'undefined'){
				var basedOnProcedureRequest =  req.body.basedOn.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnProcedureRequest)){
					basedOnProcedureRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on procedure request' in json Diagnostic Report request.";
			}

			if(typeof req.body.basedOn.referralRequest !== 'undefined'){
				var basedOnReferralRequest =  req.body.basedOn.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnReferralRequest)){
					basedOnReferralRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on referral request' in json Diagnostic Report request.";
			}

			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Diagnostic Report status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Diagnostic Report request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toUpperCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Diagnostic Report request.";
			}

			if(typeof req.body.code !== 'undefined'){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					err_code = 2;
					err_msg = "Diagnostic Report code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Diagnostic Report request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Diagnostic Report request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Diagnostic Report request.";
			}

			if(typeof req.body.subject.device !== 'undefined'){
				var subjectDevice =  req.body.subject.device.trim().toLowerCase();
				if(validator.isEmpty(subjectDevice)){
					subjectDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject device' in json Diagnostic Report request.";
			}

			if(typeof req.body.subject.location !== 'undefined'){
				var subjectLocation =  req.body.subject.location.trim().toLowerCase();
				if(validator.isEmpty(subjectLocation)){
					subjectLocation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject location' in json Diagnostic Report request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Diagnostic Report request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Diagnostic Report request.";
			}

			if(typeof req.body.effective.effectiveDateTime !== 'undefined'){
				var effectiveEffectiveDateTime =  req.body.effective.effectiveDateTime;
				if(validator.isEmpty(effectiveEffectiveDateTime)){
					effectiveEffectiveDateTime = "";
				}else{
					if(!regex.test(effectiveEffectiveDateTime)){
						err_code = 2;
						err_msg = "Diagnostic Report effective effective date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'effective effective date time' in json Diagnostic Report request.";
			}

			if (typeof req.body.effective.effectivePeriod !== 'undefined') {
			  var effectiveEffectivePeriod = req.body.effective.effectivePeriod;
 				if(validator.isEmpty(effectiveEffectivePeriod)) {
				  var effectiveEffectivePeriodStart = "";
				  var effectiveEffectivePeriodEnd = "";
				} else {
				  if (effectiveEffectivePeriod.indexOf("to") > 0) {
				    arrEffectiveEffectivePeriod = effectiveEffectivePeriod.split("to");
				    var effectiveEffectivePeriodStart = arrEffectiveEffectivePeriod[0];
				    var effectiveEffectivePeriodEnd = arrEffectiveEffectivePeriod[1];
				    if (!regex.test(effectiveEffectivePeriodStart) && !regex.test(effectiveEffectivePeriodEnd)) {
				      err_code = 2;
				      err_msg = "Diagnostic Report effective effective period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Diagnostic Report effective effective period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'effective effective period' in json Diagnostic Report request.";
			}

			if(typeof req.body.issued !== 'undefined'){
				var issued =  req.body.issued;
				if(validator.isEmpty(issued)){
					issued = "";
				}else{
					if(!regex.test(issued)){
						err_code = 2;
						err_msg = "Diagnostic Report issued invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'issued' in json Diagnostic Report request.";
			}

			if(typeof req.body.performer.role !== 'undefined'){
				var performerRole =  req.body.performer.role.trim().toLowerCase();
				if(validator.isEmpty(performerRole)){
					performerRole = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer role' in json Diagnostic Report request.";
			}

			if(typeof req.body.performer.actor.practitioner !== 'undefined'){
				var performerActorPractitioner =  req.body.performer.actor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerActorPractitioner)){
					performerActorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor practitioner' in json Diagnostic Report request.";
			}

			if(typeof req.body.performer.actor.organization !== 'undefined'){
				var performerActorOrganization =  req.body.performer.actor.organization.trim().toLowerCase();
				if(validator.isEmpty(performerActorOrganization)){
					performerActorOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor organization' in json Diagnostic Report request.";
			}

			if(typeof req.body.specimen !== 'undefined'){
				var specimen =  req.body.specimen.trim().toLowerCase();
				if(validator.isEmpty(specimen)){
					specimen = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'specimen' in json Diagnostic Report request.";
			}

			if(typeof req.body.result !== 'undefined'){
				var diagnosticReportResult =  req.body.result.trim().toLowerCase();
				if(validator.isEmpty(diagnosticReportResult)){
					result = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'result' in json Diagnostic Report request.";
			}

			if(typeof req.body.imagingStudy.imagingStudy !== 'undefined'){
				var imagingStudyImagingStudy =  req.body.imagingStudy.imagingStudy.trim().toLowerCase();
				if(validator.isEmpty(imagingStudyImagingStudy)){
					imagingStudyImagingStudy = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'imaging study imaging study' in json Diagnostic Report request.";
			}

			if(typeof req.body.imagingStudy.imagingManifest !== 'undefined'){
				var imagingStudyImagingManifest =  req.body.imagingStudy.imagingManifest.trim().toLowerCase();
				if(validator.isEmpty(imagingStudyImagingManifest)){
					imagingStudyImagingManifest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'imaging study imaging manifest' in json Diagnostic Report request.";
			}

			if(typeof req.body.image.comment !== 'undefined'){
				var imageComment =  req.body.image.comment.trim().toLowerCase();
				if(validator.isEmpty(imageComment)){
					imageComment = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'image comment' in json Diagnostic Report request.";
			}

			if(typeof req.body.image.link !== 'undefined'){
				var imageLink =  req.body.image.link.trim().toLowerCase();
				if(validator.isEmpty(imageLink)){
					imageLink = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'image link' in json Diagnostic Report request.";
			}

			if(typeof req.body.conclusion !== 'undefined'){
				var conclusion =  req.body.conclusion.trim().toLowerCase();
				if(validator.isEmpty(conclusion)){
					conclusion = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'conclusion' in json Diagnostic Report request.";
			}

			if(typeof req.body.codedDiagnosis !== 'undefined'){
				var codedDiagnosis =  req.body.codedDiagnosis.trim().toLowerCase();
				if(validator.isEmpty(codedDiagnosis)){
					codedDiagnosis = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'coded diagnosis' in json Diagnostic Report request.";
			}

			if(typeof req.body.presentedForm.contentType !== 'undefined'){
				var presentedFormContentType =  req.body.presentedForm.contentType.trim().toLowerCase();
				if(validator.isEmpty(presentedFormContentType)){
					presentedFormContentType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'presented form content type' in json Diagnostic Report request.";
			}

			if(typeof req.body.presentedForm.language !== 'undefined'){
				var presentedFormLanguage =  req.body.presentedForm.language.trim().toLowerCase();
				if(validator.isEmpty(presentedFormLanguage)){
					presentedFormLanguage = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'presented form language' in json Diagnostic Report request.";
			}

			if(typeof req.body.presentedForm.data !== 'undefined'){
				var presentedFormData =  req.body.presentedForm.data.trim().toLowerCase();
				if(validator.isEmpty(presentedFormData)){
					presentedFormData = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'presented form data' in json Diagnostic Report request.";
			}
			
			if(typeof req.body.presentedForm.size !== 'undefined'){
				var presentedFormSize =  req.body.presentedForm.size;
				if(validator.isEmpty(presentedFormSize)){
					presentedFormSize = "";
				}else{
					if(!validator.isInt(presentedFormSize)){
						err_code = 2;
						err_msg = "Diagnostic Report presented form size is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'presented form size' in json Diagnostic Report request.";
			}

			if(typeof req.body.presentedForm.title !== 'undefined'){
				var presentedFormTitle =  req.body.presentedForm.title.trim().toLowerCase();
				if(validator.isEmpty(presentedFormTitle)){
					presentedFormTitle = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'presented form title' in json Diagnostic Report request.";
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
														var diagnosticReportId = 'dre' + unicId;
														var diagnosticReportPerformerId = 'drp' + unicId;
														var diagnosticReportReportImageId = 'dri' + unicId;
														var attachmentId = 'att' + uniqid.time();
											
														dataDiagnosticReport = {
															"diagnostic_report_id" : diagnosticReportId,
															"status" : status,
															"category" : category,
															"code" : code,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"subject_device" : subjectDevice,
															"subject_location" : subjectLocation,
															"context_encounter" : contextEncounter,
															"context_episode_of_care" : contextEpisodeOfCare,
															"effective_date_time" : effectiveEffectiveDateTime,
															"effective_period_start" : effectiveEffectivePeriodStart,
															"effective_period_end" : effectiveEffectivePeriodEnd,
															"issued" : issued,
															"conclusion" : conclusion,
															"coded_diagnosis" : codedDiagnosis
														}
														console.log(dataDiagnosticReport);
														ApiFHIR.post('diagnosticReport', {"apikey": apikey}, {body: dataDiagnosticReport, json: true}, function(error, response, body){
															diagnosticReport = body;
															if(diagnosticReport.err_code > 0){
																res.json(diagnosticReport);	
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
																							"diagnostic_report_id": diagnosticReportId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
										
														//DiagnosticReportPerformer
														dataDiagnosticReportPerformer = {
															"performer_id" : diagnosticReportPerformerId,
															"role" : performerRole,
															"actor_practitioner" : performerActorPractitioner,
															"actor_organization" : performerActorOrganization,
															"diagnostic_report_id" : diagnosticReportId
														};
														ApiFHIR.post('diagnosticReportPerformer', {"apikey": apikey}, {body: dataDiagnosticReportPerformer, json: true}, function(error, response, body){
															diagnosticReportPerformer = body;
															if(diagnosticReportPerformer.err_code > 0){
																res.json(diagnosticReportPerformer);	
																console.log("ok");
															}
														});
														
														//DiagnosticReportImage
														dataDiagnosticReportImage = {
															"image_id" : diagnosticReportReportImageId,
															"comment" : imageComment,
															"link" : imageLink,
															"diagnostic_report_id" : diagnosticReportId
														};
														ApiFHIR.post('diagnosticReportReportImage', {"apikey": apikey}, {body: dataDiagnosticReportImage, json: true}, function(error, response, body){
															diagnosticReportImage = body;
															if(diagnosticReportImage.err_code > 0){
																res.json(diagnosticReportImage);	
																console.log("ok");
															}
														});
														
														var dataAttachment = {
															"id": attachmentId,
															"content_type": presentedFormContentType,
															"language": presentedFormLanguage,
															"data": presentedFormData,
															"size": presentedFormSize,
															"hash": sha1(presentedFormData),
															"title": presentedFormTitle,
															"creation": getFormattedDate(),
															"url": host + ':' + port + '/' + apikey + '/diagnosticReport/'+diagnosticReportId+'/Photo/' + attachmentId,
															"diagnostic_report_id" : diagnosticReportId
														}

														//method, endpoint, params, options, callback
														ApiFHIR.post('attachment', {"apikey": apikey}, {body: dataAttachment, json:true}, function(error, response, body){
															//cek apakah ada error atau tidak
															var attachment = body; //object
															//cek apakah ada error atau tidak
															if(attachment.err_code > 0){
																res.json(attachment);
															}
														});											

														if(basedOnCarePlan !== ""){
															dataBasedOnCarePlan = {
																"_id" : basedOnCarePlan,
																"diagnostic_report_id" : diagnosticReportId
															}
															ApiFHIR.put('carePlan', {"apikey": apikey, "_id": basedOnCarePlan}, {body: dataBasedOnCarePlan, json: true}, function(error, response, body){
																returnBasedOnCarePlan = body;
																if(returnBasedOnCarePlan.err_code > 0){
																	res.json(returnBasedOnCarePlan);	
																	console.log("add reference based on care plan : " + basedOnCarePlan);
																}
															});
														}
														
														if(basedOnImmunizationRecommendation !== ""){
															dataBasedOnImmunizationRecommendation = {
																"_id" : basedOnImmunizationRecommendation,
																"diagnostic_report_id" : diagnosticReportId
															}
															ApiFHIR.put('immunizationRecommendation', {"apikey": apikey, "_id": basedOnImmunizationRecommendation}, {body: dataBasedOnImmunizationRecommendation, json: true}, function(error, response, body){
																returnBasedOnImmunizationRecommendation = body;
																if(returnBasedOnImmunizationRecommendation.err_code > 0){
																	res.json(returnBasedOnImmunizationRecommendation);	
																	console.log("add reference based on immunization recommendation : " + basedOnImmunizationRecommendation);
																}
															});
														}
														
														if(basedOnMedicationRequest !== ""){
															dataBasedOnMedicationRequest = {
																"_id" : basedOnMedicationRequest,
																"diagnostic_report_id" : diagnosticReportId
															}
															ApiFHIR.put('medicationRequest', {"apikey": apikey, "_id": basedOnMedicationRequest}, {body: dataBasedOnMedicationRequest, json: true}, function(error, response, body){
																returnBasedOnMedicationRequest = body;
																if(returnBasedOnMedicationRequest.err_code > 0){
																	res.json(returnBasedOnMedicationRequest);	
																	console.log("add reference based on medication request : " + basedOnMedicationRequest);
																}
															});
														}
														
														if(basedOnNutritionOrder !== ""){
															dataBasedOnNutritionOrder = {
																"_id" : basedOnNutritionOrder,
																"diagnostic_report_id" : diagnosticReportId
															}
															ApiFHIR.put('nutritionOrder', {"apikey": apikey, "_id": basedOnNutritionOrder}, {body: dataBasedOnNutritionOrder, json: true}, function(error, response, body){
																returnBasedOnNutritionOrder = body;
																if(returnBasedOnNutritionOrder.err_code > 0){
																	res.json(returnBasedOnNutritionOrder);	
																	console.log("add reference based on nutrition order : " + basedOnNutritionOrder);
																}
															});
														}
														
														if(basedOnProcedureRequest !== ""){
															dataBasedOnProcedureRequest = {
																"_id" : basedOnProcedureRequest,
																"diagnostic_report_id" : diagnosticReportId
															}
															ApiFHIR.put('procedureRequest', {"apikey": apikey, "_id": basedOnProcedureRequest}, {body: dataBasedOnProcedureRequest, json: true}, function(error, response, body){
																returnBasedOnProcedureRequest = body;
																if(returnBasedOnProcedureRequest.err_code > 0){
																	res.json(returnBasedOnProcedureRequest);	
																	console.log("add reference based on procedure request : " + basedOnProcedureRequest);
																}
															});
														}
														
														if(basedOnReferralRequest !== ""){
															dataBasedOnReferralRequest = {
																"_id" : basedOnReferralRequest,
																"diagnostic_report_id" : diagnosticReportId
															}
															ApiFHIR.put('referralRequest', {"apikey": apikey, "_id": basedOnReferralRequest}, {body: dataBasedOnReferralRequest, json: true}, function(error, response, body){
																returnBasedOnReferralRequest = body;
																if(returnBasedOnReferralRequest.err_code > 0){
																	res.json(returnBasedOnReferralRequest);	
																	console.log("add reference based on referral request : " + basedOnReferralRequest);
																}
															});
														}
														
														if(specimen !== ""){
															dataSpecimen = {
																"_id" : specimen,
																"diagnostic_report_id" : diagnosticReportId
															}
															ApiFHIR.put('specimen', {"apikey": apikey, "_id": specimen}, {body: dataSpecimen, json: true}, function(error, response, body){
																returnSpecimen = body;
																if(returnSpecimen.err_code > 0){
																	res.json(returnSpecimen);	
																	console.log("add reference specimen : " + specimen);
																}
															});
														}
														
														if(diagnosticReportResult !== ""){
															dataResult = {
																"_id" : diagnosticReportResult,
																"diagnostic_report_id" : diagnosticReportId
															}
															ApiFHIR.put('observation', {"apikey": apikey, "_id": diagnosticReportResult}, {body: dataResult, json: true}, function(error, response, body){
																returnResult = body;
																if(returnResult.err_code > 0){
																	res.json(returnResult);	
																	console.log("add reference result observation : " + diagnosticReportResult);
																}
															});
														}
														
														if(imagingStudyImagingStudy !== ""){
															dataImagingStudyImagingStudy = {
																"_id" : imagingStudyImagingStudy,
																"diagnostic_report_id" : diagnosticReportId
															}
															ApiFHIR.put('imagingStudy', {"apikey": apikey, "_id": imagingStudyImagingStudy}, {body: dataImagingStudyImagingStudy, json: true}, function(error, response, body){
																returnImagingStudyImagingStudy = body;
																if(returnImagingStudyImagingStudy.err_code > 0){
																	res.json(returnImagingStudyImagingStudy);	
																	console.log("add reference imaging study imaging study : " + imagingStudyImagingStudy);
																}
															});
														}
														
														if(imagingStudyImagingManifest !== ""){
															dataImagingStudyImagingManifest = {
																"_id" : imagingStudyImagingManifest,
																"diagnostic_report_id" : diagnosticReportId
															}
															ApiFHIR.put('imagingManifest', {"apikey": apikey, "_id": imagingStudyImagingManifest}, {body: dataImagingStudyImagingManifest, json: true}, function(error, response, body){
																returnImagingStudyImagingManifest = body;
																if(returnImagingStudyImagingManifest.err_code > 0){
																	res.json(returnImagingStudyImagingManifest);	
																	console.log("add reference imaging study imaging manifest : " + imagingStudyImagingManifest);
																}
															});
														}
														
														res.json({"err_code": 0, "err_msg": "Diagnostic Report has been add.", "data": [{"_id": diagnosticReportId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
status|diagnostic-report-status
category|diagnostic-service-sections
code|report-codes
performerRole|performer-role
codedDiagnosis|clinical-findings
presentedFormLanguage/languages
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'DIAGNOSTIC_REPORT_STATUS', function (resStatusCode) {
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
												checkCode(apikey, category, 'DIAGNOSTIC_SERVICE_SECTIONS', function (resCategoryCode) {
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

										myEmitter.prependOnceListener('checkCode', function () {
											if (!validator.isEmpty(code)) {
												checkCode(apikey, code, 'REPORT_CODES', function (resCodeCode) {
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

										myEmitter.prependOnceListener('checkCodedDiagnosis', function () {
											if (!validator.isEmpty(codedDiagnosis)) {
												checkCode(apikey, codedDiagnosis, 'CLINICAL_FINDINGS', function (resCodedDiagnosisCode) {
													if (resCodedDiagnosisCode.err_code > 0) {
														myEmitter.emit('checkPerformerRole');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Coded diagnosis code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerRole');
											}
										})
										
										myEmitter.prependOnceListener('checkPresentedFormLanguage', function () {
											if (!validator.isEmpty(presentedFormLanguage)) {
												checkCode(apikey, presentedFormLanguage, 'LANGUAGES', function (resPresentedFormLanguage) {
													if (resPresentedFormLanguage.err_code > 0) {
														myEmitter.emit('checkCodedDiagnosis');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Presented form language code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCodedDiagnosis');
											}
										})
								
										
										//cek value
										/*
basedOnCarePlan|CarePlan
basedOnImmunizationRecommendation|Immunization_Recommendation
basedOnMedicationRequest|Medication_Request
basedOnNutritionOrder|Nutrition_Order
basedOnProcedureRequest|Procedure_Request
basedOnReferralRequest|Referral_Request
subjectPatient|Patient
subjectGroup|Group
subjectDevice|Device
subjectLocation|Location
contextEncounter|Encounter
contextEpisodeOfCare|Episode_Of_Care
performerActorPractitioner|Practitioner
performerActorOrganization|Organization
specimen|Specimen
diagnosticReportResult|Observation
imagingStudyImagingStudy|Imaging_Study
imagingStudyImagingManifest|Imaging_Manifest
imageLink|Media
*/
										myEmitter.prependOnceListener('checkBasedOnCarePlan', function () {
											if (!validator.isEmpty(basedOnCarePlan)) {
												checkUniqeValue(apikey, "CAREPLAN_ID|" + basedOnCarePlan, 'CAREPLAN', function (resBasedOnCarePlan) {
													if (resBasedOnCarePlan.err_code > 0) {
														myEmitter.emit('checkPresentedFormLanguage');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on care plan id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPresentedFormLanguage');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnImmunizationRecommendation', function () {
											if (!validator.isEmpty(basedOnImmunizationRecommendation)) {
												checkUniqeValue(apikey, "IMMUNIZATION_RECOMMENDATION_ID|" + basedOnImmunizationRecommendation, 'IMMUNIZATION_RECOMMENDATION', function (resBasedOnImmunizationRecommendation) {
													if (resBasedOnImmunizationRecommendation.err_code > 0) {
														myEmitter.emit('checkBasedOnCarePlan');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on immunization recommendation id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnCarePlan');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnMedicationRequest', function () {
											if (!validator.isEmpty(basedOnMedicationRequest)) {
												checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + basedOnMedicationRequest, 'MEDICATION_REQUEST', function (resBasedOnMedicationRequest) {
													if (resBasedOnMedicationRequest.err_code > 0) {
														myEmitter.emit('checkBasedOnImmunizationRecommendation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on medication request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnImmunizationRecommendation');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnNutritionOrder', function () {
											if (!validator.isEmpty(basedOnNutritionOrder)) {
												checkUniqeValue(apikey, "NUTRITION_ORDER_ID|" + basedOnNutritionOrder, 'NUTRITION_ORDER', function (resBasedOnNutritionOrder) {
													if (resBasedOnNutritionOrder.err_code > 0) {
														myEmitter.emit('checkBasedOnMedicationRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on nutrition order id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnMedicationRequest');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnProcedureRequest', function () {
											if (!validator.isEmpty(basedOnProcedureRequest)) {
												checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + basedOnProcedureRequest, 'PROCEDURE_REQUEST', function (resBasedOnProcedureRequest) {
													if (resBasedOnProcedureRequest.err_code > 0) {
														myEmitter.emit('checkBasedOnNutritionOrder');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on procedure request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnNutritionOrder');
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

										myEmitter.prependOnceListener('checkSubjectPatient', function () {
											if (!validator.isEmpty(subjectPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
													if (resSubjectPatient.err_code > 0) {
														myEmitter.emit('checkBasedOnReferralRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnReferralRequest');
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

										myEmitter.prependOnceListener('checkSpecimen', function () {
											if (!validator.isEmpty(specimen)) {
												checkUniqeValue(apikey, "SPECIMEN_ID|" + specimen, 'SPECIMEN', function (resSpecimen) {
													if (resSpecimen.err_code > 0) {
														myEmitter.emit('checkPerformerActorOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Specimen id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerActorOrganization');
											}
										})

										myEmitter.prependOnceListener('checkResult', function () {
											if (!validator.isEmpty(diagnosticReportResult)) {
												checkUniqeValue(apikey, "OBSERVATION_ID|" + diagnosticReportResult, 'OBSERVATION', function (resResult) {
													if (resResult.err_code > 0) {
														myEmitter.emit('checkSpecimen');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Result id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSpecimen');
											}
										})

										myEmitter.prependOnceListener('checkImagingStudyImagingStudy', function () {
											if (!validator.isEmpty(imagingStudyImagingStudy)) {
												checkUniqeValue(apikey, "IMAGING_STUDY_ID|" + imagingStudyImagingStudy, 'IMAGING_STUDY', function (resImagingStudyImagingStudy) {
													if (resImagingStudyImagingStudy.err_code > 0) {
														myEmitter.emit('checkResult');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Imaging study imaging study id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkResult');
											}
										})

										myEmitter.prependOnceListener('checkImagingStudyImagingManifest', function () {
											if (!validator.isEmpty(imagingStudyImagingManifest)) {
												checkUniqeValue(apikey, "IMAGING_MANIFEST_ID|" + imagingStudyImagingManifest, 'IMAGING_MANIFEST', function (resImagingStudyImagingManifest) {
													if (resImagingStudyImagingManifest.err_code > 0) {
														myEmitter.emit('checkImagingStudyImagingStudy');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Imaging study imaging manifest id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkImagingStudyImagingStudy');
											}
										})

										if (!validator.isEmpty(imageLink)) {
											checkUniqeValue(apikey, "MEDIA_ID|" + imageLink, 'MEDIA', function (resImageLink) {
												if (resImageLink.err_code > 0) {
													myEmitter.emit('checkImagingStudyImagingManifest');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Image link id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkImagingStudyImagingManifest');
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
			var diagnosticReportId = req.params.diagnostic_report_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof diagnosticReportId !== 'undefined'){
				if(validator.isEmpty(diagnosticReportId)){
					err_code = 2;
					err_msg = "Diagnostic Report id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Diagnostic Report id is required";
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
												checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + diagnosticReportId, 'DIAGNOSTIC_REPORT', function(resDiagnosticReportID){
													if(resDiagnosticReportID.err_code > 0){
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
																							"diagnostic_report_id": diagnosticReportId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Diagnostic Report.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Diagnostic Report Id not found"});		
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
		diagnosticReportPerformer: function addDiagnosticReportPerformer(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var diagnosticReportId = req.params.diagnostic_report_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof diagnosticReportId !== 'undefined'){
				if(validator.isEmpty(diagnosticReportId)){
					err_code = 2;
					err_msg = "Diagnostic Report id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Diagnostic Report id is required";
			}

			if(typeof req.body.role !== 'undefined'){
				var performerRole =  req.body.role.trim().toLowerCase();
				if(validator.isEmpty(performerRole)){
					performerRole = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer role' in json Diagnostic Report request.";
			}

			if(typeof req.body.actor.practitioner !== 'undefined'){
				var performerActorPractitioner =  req.body.actor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerActorPractitioner)){
					performerActorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor practitioner' in json Diagnostic Report request.";
			}

			if(typeof req.body.actor.organization !== 'undefined'){
				var performerActorOrganization =  req.body.actor.organization.trim().toLowerCase();
				if(validator.isEmpty(performerActorOrganization)){
					performerActorOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer actor organization' in json Diagnostic Report request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkDiagnosticReportID', function(){
							checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + diagnosticReportId, 'DIAGNOSTIC_REPORT', function(resDiagnosticReportID){
								if(resDiagnosticReportID.err_code > 0){
									var unicId = uniqid.time();
									var diagnosticReportPerformerId = 'drp' + unicId;
									//DiagnosticReportPerformer
									dataDiagnosticReportPerformer = {
										"performer_id" : diagnosticReportPerformerId,
										"role" : performerRole,
										"actor_practitioner" : performerActorPractitioner,
										"actor_organization" : performerActorOrganization,
										"diagnostic_report_id" : diagnosticReportId
									}
									ApiFHIR.post('diagnosticReportPerformer', {"apikey": apikey}, {body: dataDiagnosticReportPerformer, json: true}, function(error, response, body){
										diagnosticReportPerformer = body;
										if(diagnosticReportPerformer.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Diagnostic Report Performer has been add in this Diagnostic Report.", "data": diagnosticReportPerformer.data});
										}else{
											res.json(diagnosticReportPerformer);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Diagnostic Report Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkPerformerRole', function () {
							if (!validator.isEmpty(performerRole)) {
								checkCode(apikey, performerRole, 'PERFORMER_ROLE', function (resPerformerRoleCode) {
									if (resPerformerRoleCode.err_code > 0) {
										myEmitter.emit('checkDiagnosticReportID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer role code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkDiagnosticReportID');
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
					}else{
						result.err_code = 500;
						res.json(result);
					}	
				});
			}else{
				res.json({"err_code": err_code, "err_msg": err_msg});
			}
		},
		diagnosticReportReportImage: function addDiagnosticReportReportImage(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var diagnosticReportId = req.params.diagnostic_report_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof diagnosticReportId !== 'undefined'){
				if(validator.isEmpty(diagnosticReportId)){
					err_code = 2;
					err_msg = "Diagnostic Report id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Diagnostic Report id is required";
			}
			
			if(typeof req.body.comment !== 'undefined'){
				var imageComment =  req.body.comment.trim().toLowerCase();
				if(validator.isEmpty(imageComment)){
					imageComment = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'image comment' in json Diagnostic Report request.";
			}

			if(typeof req.body.link !== 'undefined'){
				var imageLink =  req.body.link.trim().toLowerCase();
				if(validator.isEmpty(imageLink)){
					imageLink = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'image link' in json Diagnostic Report request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkDiagnosticReportID', function(){
							checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + diagnosticReportId, 'DIAGNOSTIC_REPORT', function(resDiagnosticReportID){
								if(resDiagnosticReportID.err_code > 0){
									var unicId = uniqid.time();
									var diagnosticReportReportImageId = 'dri' + unicId;
									//DiagnosticReportReportImage
									dataDiagnosticReportReportImage = {
										"image_id" : diagnosticReportReportImageId,
										"comment" : imageComment,
										"link" : imageLink,
										"diagnostic_report_id" : diagnosticReportId
									}
									ApiFHIR.post('diagnosticReportReportImage', {"apikey": apikey}, {body: dataDiagnosticReportReportImage, json: true}, function(error, response, body){
										diagnosticReportReportImage = body;
										if(diagnosticReportReportImage.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Diagnostic Report Report Image has been add in this Diagnostic Report.", "data": diagnosticReportReportImage.data});
										}else{
											res.json(diagnosticReportReportImage);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Diagnostic Report Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(imageLink)) {
							checkUniqeValue(apikey, "MEDIA_ID|" + imageLink, 'MEDIA', function (resImageLink) {
								if (resImageLink.err_code > 0) {
									myEmitter.emit('checkDiagnosticReportID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Image link id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkDiagnosticReportID');
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
		attachment: function addAttachment(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var diagnosticReportId = req.params.diagnostic_report_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof diagnosticReportId !== 'undefined'){
				if(validator.isEmpty(diagnosticReportId)){
					err_code = 2;
					err_msg = "Diagnostic report id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Diagnostic report id is required";
			}

			if(typeof req.body.language !== 'undefined'){
				attachmentLanguageCode =  req.body.language;
				if(validator.isEmpty(attachmentLanguageCode)){
					err_code = 2;
					err_msg = "Language is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'language' in json request.";
			}

			//photo data
			if(typeof req.body.data !== 'undefined'){
				attachmentData =  req.body.data;
				if(validator.isEmpty(attachmentData)){
					err_code = 2;
					err_msg = "Attachment Data is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'data' in json request.";
			}

			//photo size
			if(typeof req.body.size !== 'undefined'){
				attachmentSize =  req.body.size;
				if(validator.isEmpty(attachmentSize)){
					err_code = 2;
					err_msg = "Attachment Size is required";
				}else{
					attachmentSize = bytes(attachmentSize); //convert to bytes because data type is integer	
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'size' in json request.";
			}

			//photo title
			if(typeof req.body.title !== 'undefined'){
				attachmentTitle =  req.body.title;
				if(validator.isEmpty(attachmentTitle)){
					err_code = 2;
					err_msg = "Title photo is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'title' in json request.";
			}

			//photo content_type
			if(typeof req.body.content_type !== 'undefined'){
				attachmentContentType =  req.body.content_type;
				if(validator.isEmpty(attachmentContentType)){
					err_code = 2;
					err_msg = "Attachment Content-Type is required";
				}else{
					attachmentContentType = attachmentContentType.trim().toLowerCase();
				}
			}else{
				err_code = 1;
				err_msg = "Please add key 'content_type' in json request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + diagnosticReportId, 'DIAGNOSTIC_REPORT', function(resDiagnosticReportId){
							if(resDiagnosticReportId.err_code > 0){
								checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resLanguage){
									if(resLanguage.err_code > 0){
										// attachment
										var attachmentId = 'att' + uniqid.time();
										var dataAttachment = {
											"id": attachmentId,
											"content_type": attachmentContentType,
											"language": attachmentLanguageCode,
											"data": attachmentData,
											"size": attachmentSize,
											"hash": sha1(attachmentData),
											"title": attachmentTitle,
											"creation": getFormattedDate(),
											"url": host + ':' + port + '/' + apikey + '/diagnosticReport/'+diagnosticReportId+'/Photo/' + attachmentId,
											"diagnostic_report_id": diagnosticReportId
										}

										//method, endpoint, params, options, callback
										ApiFHIR.post('attachment', {"apikey": apikey}, {body: dataAttachment, json:true}, function(error, response, body){
											//cek apakah ada error atau tidak
											var attachment = body; //object
											//cek apakah ada error atau tidak
											if(attachment.err_code == 0){
												res.json({"err_code": 0, "err_msg": "Photo has been add in this Diagnostic report.", "data": attachment.data});
											}else{
												res.json(attachment);		
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Language code not found"});			
									}
								})
							}else{
								res.json({"err_code": 501, "err_msg": "Diagnostic report id not found"});	
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
	},
	put: {
		diagnosticReport : function putDiagnosticReport(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var diagnosticReportId = req.params.diagnostic_report_id;

      var err_code = 0;
      var err_msg = "";
      var dataDiagnosticReport = {};

			if(typeof diagnosticReportId !== 'undefined'){
				if(validator.isEmpty(diagnosticReportId)){
					err_code = 2;
					err_msg = "Diagnostic Report id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Diagnostic Report id is required";
			}

			/*
			var diagnostic_report_id  = req.params._id;
			var status  = req.body.status;
			var category  = req.body.category;
			var code  = req.body.code;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var subject_device  = req.body.subject_device;
			var subject_location  = req.body.subject_location;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var effective_date_time  = req.body.effective_date_time;
			var effective_period_start  = req.body.effective_period_start;
			var effective_period_end  = req.body.effective_period_end;
			var issued  = req.body.issued;
			var conclusion  = req.body.conclusion;
			var coded_diagnosis  = req.body.coded_diagnosis;
			*/
			
			/*
			if(typeof req.body.basedOn.carePlan !== 'undefined' && req.body.basedOn.carePlan !== ""){
				var basedOnCarePlan =  req.body.basedOn.carePlan.trim().toLowerCase();
				if(validator.isEmpty(basedOnCarePlan)){
					dataDiagnosticReport.care_plan = "";
				}else{
					dataDiagnosticReport.care_plan = basedOnCarePlan;
				}
			}else{
			  basedOnCarePlan = "";
			}

			if(typeof req.body.basedOn.immunizationRecommendation !== 'undefined' && req.body.basedOn.immunizationRecommendation !== ""){
				var basedOnImmunizationRecommendation =  req.body.basedOn.immunizationRecommendation.trim().toLowerCase();
				if(validator.isEmpty(basedOnImmunizationRecommendation)){
					dataDiagnosticReport.immunization_recommendation = "";
				}else{
					dataDiagnosticReport.immunization_recommendation = basedOnImmunizationRecommendation;
				}
			}else{
			  basedOnImmunizationRecommendation = "";
			}

			if(typeof req.body.basedOn.medicationRequest !== 'undefined' && req.body.basedOn.medicationRequest !== ""){
				var basedOnMedicationRequest =  req.body.basedOn.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnMedicationRequest)){
					dataDiagnosticReport.medication_request = "";
				}else{
					dataDiagnosticReport.medication_request = basedOnMedicationRequest;
				}
			}else{
			  basedOnMedicationRequest = "";
			}

			if(typeof req.body.basedOn.nutritionOrder !== 'undefined' && req.body.basedOn.nutritionOrder !== ""){
				var basedOnNutritionOrder =  req.body.basedOn.nutritionOrder.trim().toLowerCase();
				if(validator.isEmpty(basedOnNutritionOrder)){
					dataDiagnosticReport.nutrition_order = "";
				}else{
					dataDiagnosticReport.nutrition_order = basedOnNutritionOrder;
				}
			}else{
			  basedOnNutritionOrder = "";
			}

			if(typeof req.body.basedOn.procedureRequest !== 'undefined' && req.body.basedOn.procedureRequest !== ""){
				var basedOnProcedureRequest =  req.body.basedOn.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnProcedureRequest)){
					dataDiagnosticReport.procedure_request = "";
				}else{
					dataDiagnosticReport.procedure_request = basedOnProcedureRequest;
				}
			}else{
			  basedOnProcedureRequest = "";
			}

			if(typeof req.body.basedOn.referralRequest !== 'undefined' && req.body.basedOn.referralRequest !== ""){
				var basedOnReferralRequest =  req.body.basedOn.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnReferralRequest)){
					dataDiagnosticReport.referral_request = "";
				}else{
					dataDiagnosticReport.referral_request = basedOnReferralRequest;
				}
			}else{
			  basedOnReferralRequest = "";
			}*/

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "diagnostic report status is required.";
				}else{
					dataDiagnosticReport.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toUpperCase();
				if(validator.isEmpty(category)){
					dataDiagnosticReport.category = "";
				}else{
					dataDiagnosticReport.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					err_code = 2;
					err_msg = "diagnostic report code is required.";
				}else{
					dataDiagnosticReport.code = code;
				}
			}else{
			  code = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataDiagnosticReport.subject_patient = "";
				}else{
					dataDiagnosticReport.subject_patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataDiagnosticReport.subject_group = "";
				}else{
					dataDiagnosticReport.subject_group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.subject.device !== 'undefined' && req.body.subject.device !== ""){
				var subjectDevice =  req.body.subject.device.trim().toLowerCase();
				if(validator.isEmpty(subjectDevice)){
					dataDiagnosticReport.subject_device = "";
				}else{
					dataDiagnosticReport.subject_device = subjectDevice;
				}
			}else{
			  subjectDevice = "";
			}

			if(typeof req.body.subject.location !== 'undefined' && req.body.subject.location !== ""){
				var subjectLocation =  req.body.subject.location.trim().toLowerCase();
				if(validator.isEmpty(subjectLocation)){
					dataDiagnosticReport.subject_location = "";
				}else{
					dataDiagnosticReport.subject_location = subjectLocation;
				}
			}else{
			  subjectLocation = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					dataDiagnosticReport.context_encounter = "";
				}else{
					dataDiagnosticReport.context_encounter = contextEncounter;
				}
			}else{
			  contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					dataDiagnosticReport.context_episode_of_care = "";
				}else{
					dataDiagnosticReport.context_episode_of_care = contextEpisodeOfCare;
				}
			}else{
			  contextEpisodeOfCare = "";
			}

			if(typeof req.body.effective.effectiveDateTime !== 'undefined' && req.body.effective.effectiveDateTime !== ""){
				var effectiveEffectiveDateTime =  req.body.effective.effectiveDateTime;
				if(validator.isEmpty(effectiveEffectiveDateTime)){
					err_code = 2;
					err_msg = "diagnostic report effective effective date time is required.";
				}else{
					if(!regex.test(effectiveEffectiveDateTime)){
						err_code = 2;
						err_msg = "diagnostic report effective effective date time invalid date format.";	
					}else{
						dataDiagnosticReport.effective_date_time = effectiveEffectiveDateTime;
					}
				}
			}else{
			  effectiveEffectiveDateTime = "";
			}

			if (typeof req.body.effective.effectivePeriod !== 'undefined' && req.body.effective.effectivePeriod !== "") {
			  var effectiveEffectivePeriod = req.body.effective.effectivePeriod;
			  if (effectiveEffectivePeriod.indexOf("to") > 0) {
			    arrEffectiveEffectivePeriod = effectiveEffectivePeriod.split("to");
			    dataDiagnosticReport.effective_period_start = arrEffectiveEffectivePeriod[0];
			    dataDiagnosticReport.effective_period_end = arrEffectiveEffectivePeriod[1];
			    if (!regex.test(effectiveEffectivePeriodStart) && !regex.test(effectiveEffectivePeriodEnd)) {
			      err_code = 2;
			      err_msg = "diagnostic report effective effective period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "diagnostic report effective effective period invalid date format.";
				}
			} else {
			  effectiveEffectivePeriod = "";
			}

			if(typeof req.body.issued !== 'undefined' && req.body.issued !== ""){
				var issued =  req.body.issued;
				if(validator.isEmpty(issued)){
					err_code = 2;
					err_msg = "diagnostic report issued is required.";
				}else{
					if(!regex.test(issued)){
						err_code = 2;
						err_msg = "diagnostic report issued invalid date format.";	
					}else{
						dataDiagnosticReport.issued = issued;
					}
				}
			}else{
			  issued = "";
			}

			/*

			if(typeof req.body.specimen !== 'undefined' && req.body.specimen !== ""){
				var specimen =  req.body.specimen.trim().toLowerCase();
				if(validator.isEmpty(specimen)){
					dataDiagnosticReport.specimen = "";
				}else{
					dataDiagnosticReport.specimen = specimen;
				}
			}else{
			  specimen = "";
			}

			if(typeof req.body.result !== 'undefined' && req.body.result !== ""){
				var diagnosticReportResult =  req.body.result.trim().toLowerCase();
				if(validator.isEmpty(diagnosticReportResult)){
					dataDiagnosticReport.result = "";
				}else{
					dataDiagnosticReport.result = diagnosticReportResult;
				}
			}else{
			  diagnosticReportResult = "";
			}

			if(typeof req.body.imagingStudy.imagingStudy !== 'undefined' && req.body.imagingStudy.imagingStudy !== ""){
				var imagingStudyImagingStudy =  req.body.imagingStudy.imagingStudy.trim().toLowerCase();
				if(validator.isEmpty(imagingStudyImagingStudy)){
					dataDiagnosticReport.imaging_study = "";
				}else{
					dataDiagnosticReport.imaging_study = imagingStudyImagingStudy;
				}
			}else{
			  imagingStudyImagingStudy = "";
			}

			if(typeof req.body.imagingStudy.imagingManifest !== 'undefined' && req.body.imagingStudy.imagingManifest !== ""){
				var imagingStudyImagingManifest =  req.body.imagingStudy.imagingManifest.trim().toLowerCase();
				if(validator.isEmpty(imagingStudyImagingManifest)){
					dataDiagnosticReport.imaging_manifest = "";
				}else{
					dataDiagnosticReport.imaging_manifest = imagingStudyImagingManifest;
				}
			}else{
			  imagingStudyImagingManifest = "";
			}

			*/

			if(typeof req.body.conclusion !== 'undefined' && req.body.conclusion !== ""){
				var conclusion =  req.body.conclusion.trim().toLowerCase();
				if(validator.isEmpty(conclusion)){
					dataDiagnosticReport.conclusion = "";
				}else{
					dataDiagnosticReport.conclusion = conclusion;
				}
			}else{
			  conclusion = "";
			}

			if(typeof req.body.codedDiagnosis !== 'undefined' && req.body.codedDiagnosis !== ""){
				var codedDiagnosis =  req.body.codedDiagnosis.trim().toLowerCase();
				if(validator.isEmpty(codedDiagnosis)){
					dataDiagnosticReport.coded_diagnosis = "";
				}else{
					dataDiagnosticReport.coded_diagnosis = codedDiagnosis;
				}
			}else{
			  codedDiagnosis = "";
			}
			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkDiagnosticReportId', function(){
						checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + diagnosticReportId, 'DIAGNOSTIC_REPORT', function(resDiagnosticReportId){
							if(resDiagnosticReportId.err_code > 0){
								ApiFHIR.put('diagnosticReport', {"apikey": apikey, "_id": diagnosticReportId}, {body: dataDiagnosticReport, json: true}, function(error, response, body){
									diagnosticReport = body;
									if(diagnosticReport.err_code > 0){
										res.json(diagnosticReport);	
									}else{
										res.json({"err_code": 0, "err_msg": "Diagnostic Report has been update.", "data": [{"_id": diagnosticReportId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Diagnostic Report Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkStatus', function () {
						if (!validator.isEmpty(status)) {
							checkCode(apikey, status, 'DIAGNOSTIC_REPORT_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) {
									myEmitter.emit('checkDiagnosticReportId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkDiagnosticReportId');
						}
					})

					myEmitter.prependOnceListener('checkCategory', function () {
						if (!validator.isEmpty(category)) {
							checkCode(apikey, category, 'DIAGNOSTIC_SERVICE_SECTIONS', function (resCategoryCode) {
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

					myEmitter.prependOnceListener('checkCode', function () {
						if (!validator.isEmpty(code)) {
							checkCode(apikey, code, 'REPORT_CODES', function (resCodeCode) {
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

					myEmitter.prependOnceListener('checkCodedDiagnosis', function () {
						if (!validator.isEmpty(codedDiagnosis)) {
							checkCode(apikey, codedDiagnosis, 'CLINICAL_FINDINGS', function (resCodedDiagnosisCode) {
								if (resCodedDiagnosisCode.err_code > 0) {
									myEmitter.emit('checkCode');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Coded diagnosis code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCode');
						}
					})
					
					myEmitter.prependOnceListener('checkSubjectPatient', function () {
						if (!validator.isEmpty(subjectPatient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
								if (resSubjectPatient.err_code > 0) {
									myEmitter.emit('checkCodedDiagnosis');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCodedDiagnosis');
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
			var diagnosticReportId = req.params.diagnostic_report_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof diagnosticReportId !== 'undefined'){
				if(validator.isEmpty(diagnosticReportId)){
					err_code = 2;
					err_msg = "Diagnostic Report id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Diagnostic Report id is required";
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
						myEmitter.prependOnceListener('checkDiagnosticReportID', function(){
							checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + diagnosticReportId, 'DIAGNOSTIC_REPORT', function(resDiagnosticReportID){
								if(resDiagnosticReportID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "DIAGNOSTIC_REPORT_ID|"+diagnosticReportId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Diagnostic Report.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Diagnostic Report Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkDiagnosticReportID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkDiagnosticReportID');				
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
		diagnosticReportPerformer: function updateDiagnosticReportPerformer(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var diagnosticReportId = req.params.diagnostic_report_id;
			var diagnosticReportPerformerId = req.params.diagnostic_report_performer_id;

			var err_code = 0;
			var err_msg = "";
			var dataDiagnosticReport = {};
			//input check 
			if(typeof diagnosticReportId !== 'undefined'){
				if(validator.isEmpty(diagnosticReportId)){
					err_code = 2;
					err_msg = "Diagnostic Report id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Diagnostic Report id is required";
			}

			if(typeof diagnosticReportPerformerId !== 'undefined'){
				if(validator.isEmpty(diagnosticReportPerformerId)){
					err_code = 2;
					err_msg = "Diagnostic Report Performer id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Diagnostic Report Performer id is required";
			}
			
			/*
			var role  = req.body.role;
			var actor_practitioner  = req.body.actor_practitioner;
			var actor_organization  = req.body.actor_organization;
			*/
			if(typeof req.body.role !== 'undefined' && req.body.role !== ""){
				var performerRole =  req.body.role.trim().toLowerCase();
				if(validator.isEmpty(performerRole)){
					dataDiagnosticReport.role = "";
				}else{
					dataDiagnosticReport.role = performerRole;
				}
			}else{
			  performerRole = "";
			}

			if(typeof req.body.actor.practitioner !== 'undefined' && req.body.actor.practitioner !== ""){
				var performerActorPractitioner =  req.body.actor.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerActorPractitioner)){
					dataDiagnosticReport.actor_practitioner = "";
				}else{
					dataDiagnosticReport.actor_practitioner = performerActorPractitioner;
				}
			}else{
			  performerActorPractitioner = "";
			}

			if(typeof req.body.actor.organization !== 'undefined' && req.body.actor.organization !== ""){
				var performerActorOrganization =  req.body.actor.organization.trim().toLowerCase();
				if(validator.isEmpty(performerActorOrganization)){
					dataDiagnosticReport.actor_organization = "";
				}else{
					dataDiagnosticReport.actor_organization = performerActorOrganization;
				}
			}else{
			  performerActorOrganization = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkDiagnosticReportID', function(){
							checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + diagnosticReportId, 'DIAGNOSTIC_REPORT', function(resDiagnosticReportId){
								if(resDiagnosticReportId.err_code > 0){
									checkUniqeValue(apikey, "PERFORMER_ID|" + diagnosticReportPerformerId, 'DIAGNOSTIC_REPORT_PERFORMER', function(resDiagnosticReportPerformerID){
										if(resDiagnosticReportPerformerID.err_code > 0){
											ApiFHIR.put('diagnosticReportPerformer', {"apikey": apikey, "_id": diagnosticReportPerformerId, "dr": "DIAGNOSTIC_REPORT_ID|"+diagnosticReportId}, {body: dataDiagnosticReport, json: true}, function(error, response, body){
												diagnosticReportPerformer = body;
												if(diagnosticReportPerformer.err_code > 0){
													res.json(diagnosticReportPerformer);	
												}else{
													res.json({"err_code": 0, "err_msg": "Diagnostic Report Performer has been update in this Diagnostic Report.", "data": diagnosticReportPerformer.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Diagnostic Report Performer Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Diagnostic Report Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkPerformerRole', function () {
							if (!validator.isEmpty(performerRole)) {
								checkCode(apikey, performerRole, 'PERFORMER_ROLE', function (resPerformerRoleCode) {
									if (resPerformerRoleCode.err_code > 0) {
										myEmitter.emit('checkDiagnosticReportID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Performer role code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkDiagnosticReportID');
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
		diagnosticReportReportImage: function updateDiagnosticReportReportImage(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var diagnosticReportId = req.params.diagnostic_report_id;
			var diagnosticReportReportImageId = req.params.diagnostic_report_report_image_id;

			var err_code = 0;
			var err_msg = "";
			var dataDiagnosticReport = {};
			//input check 
			if(typeof diagnosticReportId !== 'undefined'){
				if(validator.isEmpty(diagnosticReportId)){
					err_code = 2;
					err_msg = "Diagnostic Report id is required";
				}
			}else{
				err_code = 2;
				err_msg = "DiagnosticReport id is required";
			}

			if(typeof diagnosticReportReportImageId !== 'undefined'){
				if(validator.isEmpty(diagnosticReportReportImageId)){
					err_code = 2;
					err_msg = "Diagnostic Report Report Image id is required";
				}
			}else{
				err_code = 2;
				err_msg = "DiagnosticReport Prediction id is required";
			}
			
			/*
			var comment  = req.body.comment;
			var link  = req.body.link;
			*/
			if(typeof req.body.comment !== 'undefined' && req.body.comment !== ""){
				var imageComment =  req.body.comment.trim().toLowerCase();
				if(validator.isEmpty(imageComment)){
					dataDiagnosticReport.comment = "";
				}else{
					dataDiagnosticReport.comment = imageComment;
				}
			}else{
			  imageComment = "";
			}

			if(typeof req.body.link !== 'undefined' && req.body.link !== ""){
				var imageLink =  req.body.link.trim().toLowerCase();
				if(validator.isEmpty(imageLink)){
					dataDiagnosticReport.link = "";
				}else{
					dataDiagnosticReport.link = imageLink;
				}
			}else{
			  imageLink = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkDiagnosticReportID', function(){
							checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + diagnosticReportId, 'DIAGNOSTIC_REPORT', function(resDiagnosticReportId){
								if(resDiagnosticReportId.err_code > 0){
									checkUniqeValue(apikey, "IMAGE_ID|" + diagnosticReportReportImageId, 'DIAGNOSTIC_REPORT_IMAGE', function(resDiagnosticReportReportImageID){
										if(resDiagnosticReportReportImageID.err_code > 0){
											ApiFHIR.put('diagnosticReportReportImage', {"apikey": apikey, "_id": diagnosticReportReportImageId, "dr": "DIAGNOSTIC_REPORT_ID|"+diagnosticReportId}, {body: dataDiagnosticReport, json: true}, function(error, response, body){
												diagnosticReportReportImage = body;
												if(diagnosticReportReportImage.err_code > 0){
													res.json(diagnosticReportReportImage);	
												}else{
													res.json({"err_code": 0, "err_msg": "Diagnostic Report Report Image has been update in this Diagnostic Report.", "data": diagnosticReportReportImage.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Diagnostic Report Report Image Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Diagnostic Report Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(imageLink)) {
							checkUniqeValue(apikey, "MEDIA_ID|" + imageLink, 'MEDIA', function (resImageLink) {
								if (resImageLink.err_code > 0) {
									myEmitter.emit('checkDiagnosticReportID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Image link id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkDiagnosticReportID');
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
		attachment: function updateAttachment(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var diagnosticReportId = req.params.diagnostic_report_id;
			var attachmentId = req.params.attachment_id;

			var err_code = 0;
			var err_msg = "";
			var dataAttachment = {};

			//input check 
			if(typeof diagnosticReportId !== 'undefined'){
				if(validator.isEmpty(diagnosticReportId)){
					err_code = 2;
					err_msg = "Diagnostic report id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Diagnostic report id is required";
			}

			if(typeof attachmentId !== 'undefined'){
				if(validator.isEmpty(attachmentId)){
					err_code = 2;
					err_msg = "Photo id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Photo id is required";
			}

			if(typeof req.body.language !== 'undefined'){
				attachmentLanguageCode =  req.body.language;
				if(validator.isEmpty(attachmentLanguageCode)){
					err_code = 2;
					err_msg = "Language is required";
				}else{
					dataAttachment.language = attachmentLanguageCode;
				}
			}else{
				attachmentLanguageCode = "";
			}

			//photo data
			if(typeof req.body.data !== 'undefined'){
				attachmentData =  req.body.data;
				if(validator.isEmpty(attachmentData)){
					err_code = 2;
					err_msg = "Attachment Data is required";
				}else{
					dataAttachment.data = attachmentData;
				}
			}else{
				attachmentData = "";
			}

			//photo size
			if(typeof req.body.size !== 'undefined'){
				attachmentSize =  req.body.size;
				if(validator.isEmpty(attachmentSize)){
					err_code = 2;
					err_msg = "Attachment Size is required";
				}else{
					attachmentSize = bytes(attachmentSize); //convert to bytes because data type is integer	
					dataAttachment.size = attachmentSize;
				}
			}

			//photo title
			if(typeof req.body.title !== 'undefined'){
				attachmentTitle =  req.body.title;
				if(validator.isEmpty(attachmentTitle)){
					err_code = 2;
					err_msg = "Title photo is required";
				}else{
					dataAttachment.title = attachmentTitle;
				}
			}

			//photo content_type
			if(typeof req.body.contentType !== 'undefined'){
				attachmentContentType =  req.body.contentType;
				if(validator.isEmpty(attachmentContentType)){
					err_code = 2;
					err_msg = "Attachment Content-Type is required";
				}else{
					attachmentContentType = attachmentContentType.trim().toLowerCase();
					dataAttachment.content_type = attachmentContentType;
				}
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkDiagnosticReportID', function(){
							checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + diagnosticReportId, 'DIAGNOSTIC_REPORT', function(resDiagnosticReportId){
								if(resDiagnosticReportId.err_code > 0){
									checkUniqeValue(apikey, "ATTACHMENT_ID|" + attachmentId, 'ATTACHMENT', function(resAttachmentID){
										if(resAttachmentID.err_code > 0){
											ApiFHIR.put('attachment', {"apikey": apikey, "_id": attachmentId, "dr": "DIAGNOSTIC_REPORT_ID|"+diagnosticReportId}, {body: dataAttachment, json: true}, function(error, response, body){
												attachment = body;
												if(attachment.err_code > 0){
													res.json(attachment);	
												}else{
													res.json({"err_code": 0, "err_msg": "Photo has been update in this diagnostic report.", "data": attachment.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Photo Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Diagnostic Report Id not found"});		
								}
							})
						})

						if(validator.isEmpty(attachmentLanguageCode)){
							myEmitter.emit('checkDiagnosticReportID');	
						}else{
							checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resLanguageCode){
								if(resLanguageCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkDiagnosticReportID');
								}else{
									res.json({"err_code": 501, "err_msg": "Language Code not found"});
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