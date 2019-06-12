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
		condition : function getCondition(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var conditionId = req.query._id;
			var abatement_age = req.query.abatementAge;
			var abatement_boolean = req.query.abatementBoolean;
			var abatement_date = req.query.abatementDate;
			var abatement_string = req.query.abatementString;
			var asserted_date = req.query.assertedDate;
			var asserter = req.query.asserter;
			var body_site = req.query.bodySite;
			var category = req.query.category;
			var clinical_status = req.query.clinicalStatus;
			var code = req.query.code;
			var context = req.query.context;
			var encounter = req.query.encounter;
			var evidence = req.query.evidence;
			var evidence_detail = req.query.evidenceDetail;
			var identifier = req.query.identifier;
			var onset_age = req.query.onsetAge;
			var onset_date = req.query.onsetDate;
			var onset_info = req.query.onsetInfo;
			var patient = req.query.patient;
			var severity = req.query.severity;
			var stage = req.query.stage;
			var subject = req.query.subject;
			var verification_status = req.query.verificationStatus;
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
			
			if(typeof conditionId !== 'undefined'){
				if(!validator.isEmpty(conditionId)){
					qString._id = conditionId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Condition Id is required."});
				}
			}
			
			if(typeof abatement_age !== 'undefined'){
				if(!validator.isEmpty(abatement_age)){
					if(isInt(abatement_age)){
						qString.abatement_age = abatement_age;
					}else{
						res.json({"err_code": 1, "err_msg": "abatement age is not number."});
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "abatement age is empty."});
				}
			}

			if(typeof abatement_boolean !== 'undefined'){
				if(!validator.isEmpty(abatement_boolean)){
					qString.abatement_boolean = abatement_boolean; 
				}else{
					res.json({"err_code": 1, "err_msg": "abatement boolean is empty."});
				}
			}

			if(typeof abatement_date !== 'undefined'){
				if(!validator.isEmpty(abatement_date)){
					if(!regex.test(abatement_date)){
						res.json({"err_code": 1, "err_msg": "abatement date invalid format."});
					}else{
						qString.abatement_date = abatement_date; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "abatement date is empty."});
				}
			}

			if(typeof abatement_string !== 'undefined'){
				if(!validator.isEmpty(abatement_string)){
					qString.abatement_string = abatement_string; 
				}else{
					res.json({"err_code": 1, "err_msg": "abatement string is empty."});
				}
			}

			if(typeof asserted_date !== 'undefined'){
				if(!validator.isEmpty(asserted_date)){
					if(!regex.test(asserted_date)){
						res.json({"err_code": 1, "err_msg": "asserted date invalid format."});
					}else{
						qString.asserted_date = asserted_date; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "asserted date is empty."});
				}
			}

			if(typeof asserter !== 'undefined'){
				if(!validator.isEmpty(asserter)){
					qString.asserter = asserter; 
				}else{
					res.json({"err_code": 1, "err_msg": "asserter is empty."});
				}
			}

			if(typeof body_site !== 'undefined'){
				if(!validator.isEmpty(body_site)){
					qString.body_site = body_site; 
				}else{
					res.json({"err_code": 1, "err_msg": "body site is empty."});
				}
			}

			if(typeof category !== 'undefined'){
				if(!validator.isEmpty(category)){
					qString.category = category; 
				}else{
					res.json({"err_code": 1, "err_msg": "category is empty."});
				}
			}

			if(typeof clinical_status !== 'undefined'){
				if(!validator.isEmpty(clinical_status)){
					qString.clinical_status = clinical_status; 
				}else{
					res.json({"err_code": 1, "err_msg": "clinical status is empty."});
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

			if(typeof encounter !== 'undefined'){
				if(!validator.isEmpty(encounter)){
					qString.encounter = encounter; 
				}else{
					res.json({"err_code": 1, "err_msg": "encounter is empty."});
				}
			}

			if(typeof evidence !== 'undefined'){
				if(!validator.isEmpty(evidence)){
					qString.evidence = evidence; 
				}else{
					res.json({"err_code": 1, "err_msg": "evidence is empty."});
				}
			}

			if(typeof evidence_detail !== 'undefined'){
				if(!validator.isEmpty(evidence_detail)){
					qString.evidence_detail = evidence_detail; 
				}else{
					res.json({"err_code": 1, "err_msg": "evidence detail is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "identifier is empty."});
				}
			}

			if(typeof onset_age !== 'undefined'){
				if(!validator.isEmpty(onset_age)){
					qString.onset_age = onset_age; 
				}else{
					res.json({"err_code": 1, "err_msg": "onset age is empty."});
				}
			}

			if(typeof onset_date !== 'undefined'){
				if(!validator.isEmpty(onset_date)){
					if(!regex.test(onset_date)){
						res.json({"err_code": 1, "err_msg": "onset date invalid format."});
					}else{
						qString.onset_date = onset_date; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "onset date is empty."});
				}
			}

			if(typeof onset_info !== 'undefined'){
				if(!validator.isEmpty(onset_info)){
					qString.onset_info = onset_info; 
				}else{
					res.json({"err_code": 1, "err_msg": "onset info is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "patient is empty."});
				}
			}

			if(typeof severity !== 'undefined'){
				if(!validator.isEmpty(severity)){
					qString.severity = severity; 
				}else{
					res.json({"err_code": 1, "err_msg": "severity is empty."});
				}
			}

			if(typeof stage !== 'undefined'){
				if(!validator.isEmpty(stage)){
					qString.stage = stage; 
				}else{
					res.json({"err_code": 1, "err_msg": "stage is empty."});
				}
			}

			if(typeof subject !== 'undefined'){
				if(!validator.isEmpty(subject)){
					qString.subject = subject; 
				}else{
					res.json({"err_code": 1, "err_msg": "subject is empty."});
				}
			}

			if(typeof verification_status !== 'undefined'){
				if(!validator.isEmpty(verification_status)){
					qString.verification_status = verification_status; 
				}else{
					res.json({"err_code": 1, "err_msg": "verification status is empty."});
				}
			}

			seedPhoenixFHIR.path.GET = {
				"Condition" : {
					"location": "%(apikey)s/Condition",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('Condition', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var condition = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(condition.err_code == 0){
								//cek jumdata dulu
								if(condition.data.length > 0){
									newCondition = [];
									for(i=0; i < condition.data.length; i++){
										myEmitter.once("getIdentifier", function(condition, index, newCondition, countCondition){
											/*console.log(condition);*/
											//get identifier
											qString = {};
											qString.condition_id = condition.id;
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
													var objectCondition = {};
													objectCondition.resourceType = condition.resourceType;
													objectCondition.id = condition.id;
													objectCondition.identifier = identifier.data;
													objectCondition.clinicalStatus = condition.clinicalStatus;
													objectCondition.verificationStatus = condition.verificationStatus;
													objectCondition.category = condition.category;
													objectCondition.severity = condition.severity;
													objectCondition.code = condition.code;
													objectCondition.bodySite = condition.bodySite;
													objectCondition.subject = condition.subject;
													objectCondition.context = condition.context;
													objectCondition.onset = condition.onset;
													objectCondition.abatement = condition.abatement;
													objectCondition.assertedDate = condition.assertedDate;
													objectCondition.asserter = condition.asserter;
													objectCondition.stage = condition.stage;
													newCondition[index] = objectCondition;

													myEmitter.once('getNote', function(condition, index, newCondition, countCondition){
														qString = {};
														qString.condition_id = condition.id;
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
																var objectCondition = {};
																objectCondition.resourceType = condition.resourceType;
																objectCondition.id = condition.id;
																objectCondition.identifier = condition.identifier;
																objectCondition.clinicalStatus = condition.clinicalStatus;
																objectCondition.verificationStatus = condition.verificationStatus;
																objectCondition.category = condition.category;
																objectCondition.severity = condition.severity;
																objectCondition.code = condition.code;
																objectCondition.bodySite = condition.bodySite;
																objectCondition.subject = condition.subject;
																objectCondition.context = condition.context;
																objectCondition.onset = condition.onset;
																objectCondition.abatement = condition.abatement;
																objectCondition.assertedDate = condition.assertedDate;
																objectCondition.asserter = condition.asserter;
																objectCondition.stage = condition.stage;
																objectCondition.note = annotation.data;

																newCondition[index] = objectCondition;
																myEmitter.once('getConditionEvidence', function(condition, index, newCondition, countCondition){
																	qString = {};
																	qString.condition_id = condition.id;
																	seedPhoenixFHIR.path.GET = {
																		"ConditionEvidence" : {
																			"location": "%(apikey)s/ConditionEvidence",
																			"query": qString
																		}
																	}

																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																	ApiFHIR.get('ConditionEvidence', {"apikey": apikey}, {}, function(error, response, body){
																		conditionEvidence = JSON.parse(body);
																		if(conditionEvidence.err_code == 0){
																			var objectCondition = {};
																			objectCondition.resourceType = condition.resourceType;
																			objectCondition.id = condition.id;
																			objectCondition.identifier = condition.identifier;
																			objectCondition.clinicalStatus = condition.clinicalStatus;
																			objectCondition.verificationStatus = condition.verificationStatus;
																			objectCondition.category = condition.category;
																			objectCondition.severity = condition.severity;
																			objectCondition.code = condition.code;
																			objectCondition.bodySite = condition.bodySite;
																			objectCondition.subject = condition.subject;
																			objectCondition.context = condition.context;
																			objectCondition.onset = condition.onset;
																			objectCondition.abatement = condition.abatement;
																			objectCondition.assertedDate = condition.assertedDate;
																			objectCondition.asserter = condition.asserter;
																			objectCondition.stage = condition.stage;
																			objectCondition.evidence = conditionEvidence.data;
																			objectCondition.note = condition.note;

																			newCondition[index] = objectCondition;

myEmitter.once('getConditionStageAssessmentClinicalImpression', function(condition, index, newCondition, countCondition){
	qString = {};
	qString.condition_id = condition.id;
	seedPhoenixFHIR.path.GET = {
		"ConditionStageAssessmentClinicalImpression" : {
			"location": "%(apikey)s/ConditionStageAssessmentClinicalImpression",
			"query": qString
		}
	}

	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

	ApiFHIR.get('ConditionStageAssessmentClinicalImpression', {"apikey": apikey}, {}, function(error, response, body){
		conditionStageAssessmentClinicalImpression = JSON.parse(body);
		if(conditionStageAssessmentClinicalImpression.err_code == 0){
			var objectCondition = {};
			objectCondition.resourceType = condition.resourceType;
			objectCondition.id = condition.id;
			objectCondition.identifier = condition.identifier;
			objectCondition.clinicalStatus = condition.clinicalStatus;
			objectCondition.verificationStatus = condition.verificationStatus;
			objectCondition.category = condition.category;
			objectCondition.severity = condition.severity;
			objectCondition.code = condition.code;
			objectCondition.bodySite = condition.bodySite;
			objectCondition.subject = condition.subject;
			objectCondition.context = condition.context;
			objectCondition.onset = condition.onset;
			objectCondition.abatement = condition.abatement;
			objectCondition.assertedDate = condition.assertedDate;
			objectCondition.asserter = condition.asserter;
			var Stage = {};
			Stage.summary = condition.stage.summary;
			var Assessment = {};
			Assessment.clinicalImpression = conditionStageAssessmentClinicalImpression.data;
			Stage.assessment = Assessment;
			objectCondition.stage = Stage;
			objectCondition.evidence = condition.evidence;
			objectCondition.note = condition.note;

			newCondition[index] = objectCondition;

			myEmitter.once('getConditionStageAssessmentDiagnosticReport', function(condition, index, newCondition, countCondition){
				qString = {};
				qString.condition_id = condition.id;
				seedPhoenixFHIR.path.GET = {
					"ConditionStageAssessmentDiagnosticReport" : {
						"location": "%(apikey)s/ConditionStageAssessmentDiagnosticReport",
						"query": qString
					}
				}

				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

				ApiFHIR.get('ConditionStageAssessmentDiagnosticReport', {"apikey": apikey}, {}, function(error, response, body){
					conditionStageAssessmentDiagnosticReport = JSON.parse(body);
					if(conditionStageAssessmentDiagnosticReport.err_code == 0){
						var objectCondition = {};
						objectCondition.resourceType = condition.resourceType;
						objectCondition.id = condition.id;
						objectCondition.identifier = condition.identifier;
						objectCondition.clinicalStatus = condition.clinicalStatus;
						objectCondition.verificationStatus = condition.verificationStatus;
						objectCondition.category = condition.category;
						objectCondition.severity = condition.severity;
						objectCondition.code = condition.code;
						objectCondition.bodySite = condition.bodySite;
						objectCondition.subject = condition.subject;
						objectCondition.context = condition.context;
						objectCondition.onset = condition.onset;
						objectCondition.abatement = condition.abatement;
						objectCondition.assertedDate = condition.assertedDate;
						objectCondition.asserter = condition.asserter;
						var Stage = {};
						Stage.summary = condition.stage.summary;
						var Assessment = {};
						Assessment.clinicalImpression = condition.stage.assessment.clinicalImpression;
						Assessment.diagnosticReport = conditionStageAssessmentDiagnosticReport.data;
						Stage.assessment = Assessment;
						objectCondition.stage = Stage;
						objectCondition.evidence = condition.evidence;
						objectCondition.note = condition.note;

						newCondition[index] = objectCondition;

						myEmitter.once('getConditionStageAssessmentObservation', function(condition, index, newCondition, countCondition){
							qString = {};
							qString.condition_id = condition.id;
							seedPhoenixFHIR.path.GET = {
								"ConditionStageAssessmentObservation" : {
									"location": "%(apikey)s/ConditionStageAssessmentObservation",
									"query": qString
								}
							}

							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

							ApiFHIR.get('ConditionStageAssessmentObservation', {"apikey": apikey}, {}, function(error, response, body){
								conditionStageAssessmentObservation = JSON.parse(body);
								if(conditionStageAssessmentObservation.err_code == 0){
									var objectCondition = {};
									objectCondition.resourceType = condition.resourceType;
									objectCondition.id = condition.id;
									objectCondition.identifier = condition.identifier;
									objectCondition.clinicalStatus = condition.clinicalStatus;
									objectCondition.verificationStatus = condition.verificationStatus;
									objectCondition.category = condition.category;
									objectCondition.severity = condition.severity;
									objectCondition.code = condition.code;
									objectCondition.bodySite = condition.bodySite;
									objectCondition.subject = condition.subject;
									objectCondition.context = condition.context;
									objectCondition.onset = condition.onset;
									objectCondition.abatement = condition.abatement;
									objectCondition.assertedDate = condition.assertedDate;
									objectCondition.asserter = condition.asserter;
									var Stage = {};
									Stage.summary = condition.stage.summary;
									var Assessment = {};
									Assessment.clinicalImpression = condition.stage.assessment.clinicalImpression;
									Assessment.diagnosticReport = condition.stage.assessment.diagnosticReport;
									Assessment.observation = conditionStageAssessmentObservation.data;
									Stage.assessment = Assessment;
									objectCondition.stage = Stage;
									objectCondition.evidence = condition.evidence;
									objectCondition.note = condition.note;

									newCondition[index] = objectCondition;

									if(index == countCondition -1 ){
										res.json({"err_code": 0, "data":newCondition});
									}	
								}else{
									res.json(conditionStageAssessmentObservation);			
								}
							})
						})
						myEmitter.emit('getConditionStageAssessmentObservation', objectCondition, index, newCondition, countCondition);																			
					}else{
						res.json(conditionStageAssessmentDiagnosticReport);			
					}
				})
			})
			myEmitter.emit('getConditionStageAssessmentDiagnosticReport', objectCondition, index, newCondition, countCondition);																			
		}else{
			res.json(conditionStageAssessmentClinicalImpression);			
		}
	})
})
myEmitter.emit('getConditionStageAssessmentClinicalImpression', objectCondition, index, newCondition, countCondition);																			
																		}else{
																			res.json(conditionEvidence);			
																		}
																	})
																})
																myEmitter.emit('getConditionEvidence', objectCondition, index, newCondition, countCondition);
															}else{
																res.json(annotation);			
															}
														})
													})
													myEmitter.emit('getNote', objectCondition, index, newCondition, countCondition);
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", condition.data[i], i, newCondition, condition.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Condition is empty."});	
								}
							}else{
								res.json(condition);
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
			var conditionId = req.params.condition_id;
			var identifierId = req.params.identifier_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "CONDITION_ID|" + conditionId, 'CONDITION', function(resPatientID){
						if(resPatientID.err_code > 0){
							if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
								checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
									if(resIdentifierID.err_code > 0){
										//get identifier
										qString = {};
										qString.condition_id = conditionId;
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
								qString.condition_id = conditionId;
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
							res.json({"err_code": 501, "err_msg": "Condition Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		/*conditionStages: function getConditionStages(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var conditionId = req.params.condition_id;
			var conditionStagesId = req.params.condition_stages_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "CONDITION_ID|" + conditionId, 'CONDITION', function(resCondition){
						if(resCondition.err_code > 0){
							if(typeof conditionStagesId !== 'undefined' && !validator.isEmpty(conditionStagesId)){
								checkUniqeValue(apikey, "STAGE_ID|" + conditionStagesId, 'CONDITION_STAGES', function(resConditionStagesID){
									if(resConditionStagesID.err_code > 0){
										//get conditionStages
										qString = {};
										qString.condition_id = conditionId;
										qString._id = conditionStagesId;
										seedPhoenixFHIR.path.GET = {
											"ConditionStages" : {
												"location": "%(apikey)s/ConditionStages",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ConditionStages', {"apikey": apikey}, {}, function(error, response, body){
											conditionStages = JSON.parse(body);
											if(conditionStages.err_code == 0){
												res.json({"err_code": 0, "data":conditionStages.data});	
											}else{
												res.json(conditionStages);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Condition Stages Id not found"});		
									}
								})
							}else{
								//get conditionStages
								qString = {};
								qString.condition_id = conditionId;
								seedPhoenixFHIR.path.GET = {
									"ConditionStages" : {
										"location": "%(apikey)s/ConditionStages",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ConditionStages', {"apikey": apikey}, {}, function(error, response, body){
									conditionStages = JSON.parse(body);
									if(conditionStages.err_code == 0){
										res.json({"err_code": 0, "data":conditionStages.data});	
									}else{
										res.json(conditionStages);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Condition  Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},*/
		conditionEvidence: function getConditionEvidence(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var conditionId = req.params.condition_id;
			var conditionEvidenceId = req.params.condition_evidence_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "CONDITION_ID|" + conditionId, 'CONDITION', function(resCondition){
						if(resCondition.err_code > 0){
							if(typeof conditionEvidenceId !== 'undefined' && !validator.isEmpty(conditionEvidenceId)){
								checkUniqeValue(apikey, "EVIDENCE_ID|" + conditionEvidenceId, 'CONDITION_EVIDENCE', function(resConditionEvidenceID){
									if(resConditionEvidenceID.err_code > 0){
										//get conditionEvidence
										qString = {};
										qString.condition_id = conditionId;
										qString._id = conditionEvidenceId;
										seedPhoenixFHIR.path.GET = {
											"ConditionEvidence" : {
												"location": "%(apikey)s/ConditionEvidence",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ConditionEvidence', {"apikey": apikey}, {}, function(error, response, body){
											conditionEvidence = JSON.parse(body);
											if(conditionEvidence.err_code == 0){
												res.json({"err_code": 0, "data":conditionEvidence.data});	
											}else{
												res.json(conditionEvidence);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Condition Evidence Id not found"});		
									}
								})
							}else{
								//get conditionEvidence
								qString = {};
								qString.condition_id = conditionId;
								seedPhoenixFHIR.path.GET = {
									"ConditionEvidence" : {
										"location": "%(apikey)s/ConditionEvidence",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ConditionEvidence', {"apikey": apikey}, {}, function(error, response, body){
									conditionEvidence = JSON.parse(body);
									if(conditionEvidence.err_code == 0){
										res.json({"err_code": 0, "data":conditionEvidence.data});	
									}else{
										res.json(conditionEvidence);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Condition  Id not found"});		
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
		condition : function addCondition(req, res){
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

/*clinicalStatus|clinicalStatus||
verificationStatus|verificationStatus||
category|category||
severity|severity||
code|code||
bodySite|bodySite||
subject.patient|subjectPatient||
subject.group|subjectGroup||
context.encounter|contextEncounter||
context.episodeOfCare|contextEpisodeOfCare||
onset.onsetDateTime|onsetOnsetDateTime|date|
onset.onsetAge|onsetOnsetAge|integer|
onset.onsetPeriod|onsetOnsetPeriod|period|
onset.onsetRange|onsetOnsetRange|range|
onset.onsetString|onsetOnsetString||
abatement.abatementDateTime|abatementAbatementDateTime|date|
abatement.abatementAge|abatementAbatementAge|integer|
abatement.abatementBoolean|abatementAbatementBoolean|boolean|
abatement.abatementPeriod|abatementAbatementPeriod|period|
abatement.abatementRange|abatementAbatementRange|range|
abatement.abatementString|abatementAbatementString||
assertedDate|assertedDate|date|
asserter.practitioner|asserterPractitioner||
asserter.patient|asserterPatient||
asserter.relatedPerson|asserterRelatedPerson||
stage.summary|stageSummary||
stage.assessment.clinicalImpression|stageAssessmentClinicalImpression||
stage.assessment.diagnosticReport|stageAssessmentDiagnosticReport||
stage.assessment.observation|stageAssessmentObservation||
evidence.code|evidenceCode||
evidence.detail|evidenceDetail||
note.author.authorReference.practitioner|noteAuthorPractitioner||
note.author.authorReference.patient|noteAuthorPatient||
note.author.authorReference.relatedPerson|noteAuthorRelatedPerson||
note.author.authorString|noteAuthorAuthorString||
note.time|noteTime|date|
note.text|noteText||
*/
			if(typeof req.body.clinicalStatus !== 'undefined'){
				var clinicalStatus =  req.body.clinicalStatus.trim().toLowerCase();
				if(validator.isEmpty(clinicalStatus)){
					clinicalStatus = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'clinical status' in json Condition request.";
			}

			if(typeof req.body.verificationStatus !== 'undefined'){
				var verificationStatus =  req.body.verificationStatus.trim().toLowerCase();
				if(validator.isEmpty(verificationStatus)){
					verificationStatus = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'verification status' in json Condition request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Condition request.";
			}

			if(typeof req.body.severity !== 'undefined'){
				var severity =  req.body.severity.trim().toLowerCase();
				if(validator.isEmpty(severity)){
					severity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'severity' in json Condition request.";
			}

			if(typeof req.body.code !== 'undefined'){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					code = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Condition request.";
			}

			if(typeof req.body.bodySite !== 'undefined'){
				var bodySite =  req.body.bodySite.trim().toLowerCase();
				if(validator.isEmpty(bodySite)){
					bodySite = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'body site' in json Condition request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Condition request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Condition request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Condition request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Condition request.";
			}

			if(typeof req.body.onset.onsetDateTime !== 'undefined'){
				var onsetOnsetDateTime =  req.body.onset.onsetDateTime;
				if(validator.isEmpty(onsetOnsetDateTime)){
					onsetOnsetDateTime = "";
				}else{
					if(!regex.test(onsetOnsetDateTime)){
						err_code = 2;
						err_msg = "Condition onset onset date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'onset onset date time' in json Condition request.";
			}

			if(typeof req.body.onset.onsetAge !== 'undefined'){
				var onsetOnsetAge =  req.body.onset.onsetAge;
				if(validator.isEmpty(onsetOnsetAge)){
					onsetOnsetAge = "";
				}else{
					if(validator.isInt(onsetOnsetAge)){
						err_code = 2;
						err_msg = "Condition onset onset age is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'onset onset age' in json Condition request.";
			}

			if (typeof req.body.onset.onsetPeriod !== 'undefined') {
			  var onsetOnsetPeriod = req.body.onset.onsetPeriod;
 				if(validator.isEmpty(onsetOnsetPeriod)) {
				  var onsetOnsetPeriodStart = "";
				  var onsetOnsetPeriodEnd = "";
				} else {
				  if (onsetOnsetPeriod.indexOf("to") > 0) {
				    arrOnsetOnsetPeriod = onsetOnsetPeriod.split("to");
				    var onsetOnsetPeriodStart = arrOnsetOnsetPeriod[0];
				    var onsetOnsetPeriodEnd = arrOnsetOnsetPeriod[1];
				    if (!regex.test(onsetOnsetPeriodStart) && !regex.test(onsetOnsetPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Condition onset onset period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Condition onset onset period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'onset onset period' in json Condition request.";
			}

			if (typeof req.body.onset.onsetRange !== 'undefined') {
			  var onsetOnsetRange = req.body.onset.onsetRange;
 				if(validator.isEmpty(onsetOnsetRange)){
				  var onsetOnsetRangeLow = "";
				  var onsetOnsetRangeHigh = "";
				} else {
				  if (onsetOnsetRange.indexOf("to") > 0) {
				    arrOnsetOnsetRange = onsetOnsetRange.split("to");
				    var onsetOnsetRangeLow = arrOnsetOnsetRange[0];
				    var onsetOnsetRangeHigh = arrOnsetOnsetRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Condition onset onset range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'onset onset range' in json Condition request.";
			}

			if(typeof req.body.onset.onsetString !== 'undefined'){
				var onsetOnsetString =  req.body.onset.onsetString.trim().toLowerCase();
				if(validator.isEmpty(onsetOnsetString)){
					onsetOnsetString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'onset onset string' in json Condition request.";
			}

			if(typeof req.body.abatement.abatementDateTime !== 'undefined'){
				var abatementAbatementDateTime =  req.body.abatement.abatementDateTime;
				if(validator.isEmpty(abatementAbatementDateTime)){
					abatementAbatementDateTime = "";
				}else{
					if(!regex.test(abatementAbatementDateTime)){
						err_code = 2;
						err_msg = "Condition abatement abatement date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'abatement abatement date time' in json Condition request.";
			}

			if(typeof req.body.abatement.abatementAge !== 'undefined'){
				var abatementAbatementAge =  req.body.abatement.abatementAge;
				if(validator.isEmpty(abatementAbatementAge)){
					abatementAbatementAge = "";
				}else{
					if(validator.isInt(abatementAbatementAge)){
						err_code = 2;
						err_msg = "Condition abatement abatement age is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'abatement abatement age' in json Condition request.";
			}

			if (typeof req.body.abatement.abatementBoolean !== 'undefined') {
				var abatementAbatementBoolean = req.body.abatement.abatementBoolean.trim().toLowerCase();
					if(validator.isEmpty(abatementAbatementBoolean)){
						abatementAbatementBoolean = "false";
					}
				if(abatementAbatementBoolean === "true" || abatementAbatementBoolean === "false"){
					abatementAbatementBoolean = abatementAbatementBoolean;
				} else {
					err_code = 2;
					err_msg = "Condition abatement abatement boolean is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'abatement abatement boolean' in json Condition request.";
			}

			if (typeof req.body.abatement.abatementPeriod !== 'undefined') {
			  var abatementAbatementPeriod = req.body.abatement.abatementPeriod;
 				if(validator.isEmpty(abatementAbatementPeriod)) {
				  var abatementAbatementPeriodStart = "";
				  var abatementAbatementPeriodEnd = "";
				} else {
				  if (abatementAbatementPeriod.indexOf("to") > 0) {
				    arrAbatementAbatementPeriod = abatementAbatementPeriod.split("to");
				    var abatementAbatementPeriodStart = arrAbatementAbatementPeriod[0];
				    var abatementAbatementPeriodEnd = arrAbatementAbatementPeriod[1];
				    if (!regex.test(abatementAbatementPeriodStart) && !regex.test(abatementAbatementPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Condition abatement abatement period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Condition abatement abatement period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'abatement abatement period' in json Condition request.";
			}

			if (typeof req.body.abatement.abatementRange !== 'undefined') {
			  var abatementAbatementRange = req.body.abatement.abatementRange;
 				if(validator.isEmpty(abatementAbatementRange)){
				  var abatementAbatementRangeLow = "";
				  var abatementAbatementRangeHigh = "";
				} else {
				  if (abatementAbatementRange.indexOf("to") > 0) {
				    arrAbatementAbatementRange = abatementAbatementRange.split("to");
				    var abatementAbatementRangeLow = arrAbatementAbatementRange[0];
				    var abatementAbatementRangeHigh = arrAbatementAbatementRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Condition abatement abatement range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'abatement abatement range' in json Condition request.";
			}

			if(typeof req.body.abatement.abatementString !== 'undefined'){
				var abatementAbatementString =  req.body.abatement.abatementString.trim().toLowerCase();
				if(validator.isEmpty(abatementAbatementString)){
					abatementAbatementString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'abatement abatement string' in json Condition request.";
			}

			if(typeof req.body.assertedDate !== 'undefined'){
				var assertedDate =  req.body.assertedDate;
				if(validator.isEmpty(assertedDate)){
					assertedDate = "";
				}else{
					if(!regex.test(assertedDate)){
						err_code = 2;
						err_msg = "Condition asserted date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'asserted date' in json Condition request.";
			}

			if(typeof req.body.asserter.practitioner !== 'undefined'){
				var asserterPractitioner =  req.body.asserter.practitioner.trim().toLowerCase();
				if(validator.isEmpty(asserterPractitioner)){
					asserterPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'asserter practitioner' in json Condition request.";
			}

			if(typeof req.body.asserter.patient !== 'undefined'){
				var asserterPatient =  req.body.asserter.patient.trim().toLowerCase();
				if(validator.isEmpty(asserterPatient)){
					asserterPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'asserter patient' in json Condition request.";
			}

			if(typeof req.body.asserter.relatedPerson !== 'undefined'){
				var asserterRelatedPerson =  req.body.asserter.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(asserterRelatedPerson)){
					asserterRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'asserter related person' in json Condition request.";
			}

			if(typeof req.body.stage.summary !== 'undefined'){
				var stageSummary =  req.body.stage.summary.trim().toLowerCase();
				if(validator.isEmpty(stageSummary)){
					stageSummary = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'stage summary' in json Condition request.";
			}

			if(typeof req.body.stage.assessment.clinicalImpression !== 'undefined'){
				var stageAssessmentClinicalImpression =  req.body.stage.assessment.clinicalImpression.trim().toLowerCase();
				if(validator.isEmpty(stageAssessmentClinicalImpression)){
					stageAssessmentClinicalImpression = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'stage assessment clinical impression' in json Condition request.";
			}

			if(typeof req.body.stage.assessment.diagnosticReport !== 'undefined'){
				var stageAssessmentDiagnosticReport =  req.body.stage.assessment.diagnosticReport.trim().toLowerCase();
				if(validator.isEmpty(stageAssessmentDiagnosticReport)){
					stageAssessmentDiagnosticReport = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'stage assessment diagnostic report' in json Condition request.";
			}

			if(typeof req.body.stage.assessment.observation !== 'undefined'){
				var stageAssessmentObservation =  req.body.stage.assessment.observation.trim().toLowerCase();
				if(validator.isEmpty(stageAssessmentObservation)){
					stageAssessmentObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'stage assessment observation' in json Condition request.";
			}

			if(typeof req.body.evidence.code !== 'undefined'){
				var evidenceCode =  req.body.evidence.code.trim().toLowerCase();
				if(validator.isEmpty(evidenceCode)){
					evidenceCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'evidence code' in json Condition request.";
			}

			if(typeof req.body.evidence.detail !== 'undefined'){
				var evidenceDetail =  req.body.evidence.detail.trim().toLowerCase();
				if(validator.isEmpty(evidenceDetail)){
					evidenceDetail = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'evidence detail' in json Condition request.";
			}
			
			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					noteAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Condition request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					noteAuthorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Condition request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					noteAuthorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Condition request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Condition request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Condition note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Condition request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note text' in json Condition request.";
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
														var conditionId = 'con' + unicId;
														var conditionStagesId = 'cos' + unicId;
														var conditionEvidenceId = 'coe' + unicId;
														var noteId = 'aco' + unicId;
														dataCondition = {
															"condition_id" : conditionId,
															"clinical_status" : clinicalStatus,
															"verification_status" : verificationStatus,
															"category" : category,
															"severity" : severity,
															"code" : code,
															"body_site" : bodySite,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"context_encounter" : contextEncounter,
															"context_episode_of_care" : contextEpisodeOfCare,
															"onset_date_time" : onsetOnsetDateTime,
															"onset_age" : onsetOnsetAge,
															"onset_period_start" : onsetOnsetPeriodStart,
															"onset_period_end" : onsetOnsetPeriodEnd,
															"onset_range_low" : onsetOnsetRangeLow,
															"onset_range_high" : onsetOnsetRangeHigh,
															"onset_string" : onsetOnsetString,
															"abatement_date_time" : abatementAbatementDateTime,
															"abatement_age" : abatementAbatementAge,
															"abatement_boolean" : abatementAbatementBoolean,
															"abatement_period_start" : abatementAbatementPeriodStart,
															"abatement_period_end" : abatementAbatementPeriodEnd,
															"abatement_range_low" : abatementAbatementRangeLow,
															"abatement_range_high" : abatementAbatementRangeHigh,
															"abatement_string" : abatementAbatementString,
															"asserted_date" : assertedDate,
															"asserter_practitioner" : asserterPractitioner,
															"asserter_patient" : asserterPatient,
															"asserter_related_person" : asserterRelatedPerson,
															"summary" : stageSummary
														}
														console.log(dataCondition);
														ApiFHIR.post('condition', {"apikey": apikey}, {body: dataCondition, json: true}, function(error, response, body){
															condition = body;
															if(condition.err_code > 0){
																res.json(condition);	
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
																							"condition_id": conditionId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														//ConditionStages
														/*dataConditionStages = {
															"stage_id" : conditionStagesId,
															"summary" : stageSummary,
															"condition_id" : conditionId
														}
														ApiFHIR.post('conditionStages', {"apikey": apikey}, {body: dataConditionStages, json: true}, function(error, response, body){
															conditionStages = body;
															if(conditionStages.err_code > 0){
																res.json(conditionStages);	
																console.log("ok");
															}
														});*/
														
														//ConditionEvidence
														dataConditionEvidence = {
															"evidence_id" : conditionEvidenceId,
															"code" : evidenceCode,
															"detail" : evidenceDetail,
															"condition_id" : conditionId
														}
														ApiFHIR.post('conditionEvidence', {"apikey": apikey}, {body: dataConditionEvidence, json: true}, function(error, response, body){
															conditionEvidence = body;
															if(conditionEvidence.err_code > 0){
																res.json(conditionEvidence);	
																console.log("ok");
															}
														});
														
														var dataNoteActivity = {
															"id": noteId,
															"author_ref_practitioner": noteAuthorPractitioner,
															"author_ref_patient": noteAuthorPatient,
															"author_ref_relatedPerson": noteAuthorRelatedPerson,
															"author_string": noteAuthorAuthorString,
															"time": noteTime,
															"text": noteText,
															"condition_id" : conditionId
														};
														
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataNoteActivity, json:true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
															} 
														});
														
														if(stageAssessmentClinicalImpression !== ""){
															dataStageAssessmentClinicalImpression = {
																"_id" : stageAssessmentClinicalImpression,
																"condition_id" : conditionId
															}
															ApiFHIR.put('clinicalImpression', {"apikey": apikey, "_id": stageAssessmentClinicalImpression}, {body: dataStageAssessmentClinicalImpression, json: true}, function(error, response, body){
																returnStageAssessmentClinicalImpression = body;
																if(returnStageAssessmentClinicalImpression.err_code > 0){
																	res.json(returnStageAssessmentClinicalImpression);	
																	console.log("add reference Stage assessment clinical impression : " + stageAssessmentClinicalImpression);
																}
															});
														}

														if(stageAssessmentDiagnosticReport !== ""){
															dataStageAssessmentDiagnosticReport = {
																"_id" : stageAssessmentDiagnosticReport,
																"condition_stage_id" : conditionId
															}
															ApiFHIR.put('diagnosticReport', {"apikey": apikey, "_id": stageAssessmentDiagnosticReport}, {body: dataStageAssessmentDiagnosticReport, json: true}, function(error, response, body){
																returnStageAssessmentDiagnosticReport = body;
																if(returnStageAssessmentDiagnosticReport.err_code > 0){
																	res.json(returnStageAssessmentDiagnosticReport);	
																	console.log("add reference Stage assessment diagnostic report : " + stageAssessmentDiagnosticReport);
																}
															});
														}

														if(stageAssessmentObservation !== ""){
															dataStageAssessmentObservation = {
																"_id" : stageAssessmentObservation,
																"condition_stage_id" : conditionId
															}
															ApiFHIR.put('observation', {"apikey": apikey, "_id": stageAssessmentObservation}, {body: dataStageAssessmentObservation, json: true}, function(error, response, body){
																returnStageAssessmentObservation = body;
																if(returnStageAssessmentObservation.err_code > 0){
																	res.json(returnStageAssessmentObservation);	
																	console.log("add reference Stage assessment observation : " + stageAssessmentObservation);
																}
															});
														}

														res.json({"err_code": 0, "err_msg": "Condition has been add.", "data": [{"_id": conditionId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});
									
										//cek code
										/*
clinicalStatus|condition_clinical
verificationStatus|condition_ver_status
category|condition_category
severity|condition_severity
code|condition_code
bodySite|body_site
stageSummary|condition_stage
evidenceCode|condition_ver_status
										*/
										myEmitter.prependOnceListener('checkClinicalStatus', function () {
											if (!validator.isEmpty(clinicalStatus)) {
												checkCode(apikey, clinicalStatus, 'CONDITION_CLINICAL', function (resClinicalStatusCode) {
													if (resClinicalStatusCode.err_code > 0) {
														myEmitter.emit('checkIdentifierValue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Clinical status code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIdentifierValue');
											}
										})

										myEmitter.prependOnceListener('checkVerificationStatus', function () {
											if (!validator.isEmpty(verificationStatus)) {
												checkCode(apikey, verificationStatus, 'CONDITION_VER_STATUS', function (resVerificationStatusCode) {
													if (resVerificationStatusCode.err_code > 0) {
														myEmitter.emit('checkClinicalStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Verification status code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkClinicalStatus');
											}
										})

										myEmitter.prependOnceListener('checkCategory', function () {
											if (!validator.isEmpty(category)) {
												checkCode(apikey, category, 'CONDITION_CATEGORY', function (resCategoryCode) {
													if (resCategoryCode.err_code > 0) {
														myEmitter.emit('checkVerificationStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkVerificationStatus');
											}
										})

										myEmitter.prependOnceListener('checkSeverity', function () {
											if (!validator.isEmpty(severity)) {
												checkCode(apikey, severity, 'CONDITION_SEVERITY', function (resSeverityCode) {
													if (resSeverityCode.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Severity code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkCode', function () {
											if (!validator.isEmpty(code)) {
												checkCode(apikey, code, 'CONDITION_CODE', function (resCodeCode) {
													if (resCodeCode.err_code > 0) {
														myEmitter.emit('checkSeverity');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSeverity');
											}
										})

										myEmitter.prependOnceListener('checkBodySite', function () {
											if (!validator.isEmpty(bodySite)) {
												checkCode(apikey, bodySite, 'BODY_SITE', function (resBodySiteCode) {
													if (resBodySiteCode.err_code > 0) {
														myEmitter.emit('checkCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Body site code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCode');
											}
										})

										myEmitter.prependOnceListener('checkStageSummary', function () {
											if (!validator.isEmpty(stageSummary)) {
												checkCode(apikey, stageSummary, 'CONDITION_STAGE', function (resStageSummaryCode) {
													if (resStageSummaryCode.err_code > 0) {
														myEmitter.emit('checkBodySite');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Stage summary code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBodySite');
											}
										})

										myEmitter.prependOnceListener('checkEvidenceCode', function () {
											if (!validator.isEmpty(evidenceCode)) {
												checkCode(apikey, evidenceCode, 'CONDITION_VER_STATUS', function (resEvidenceCodeCode) {
													if (resEvidenceCodeCode.err_code > 0) {
														myEmitter.emit('checkStageSummary');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Evidence code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStageSummary');
											}
										})

										//cek value
										/*
										subjectPatient|Patient
										subjectGroup|Group
										contextEncounter|Encounter
										contextEpisodeOfCare|Episode_Of_Care
										asserterPractitioner|Practitioner
										asserterPatient|Patient
										asserterRelatedPerson|Related_Person
										stageAssessmentClinicalImpression|Clinical_Impression
										stageAssessmentDiagnosticReport|Diagnostic_Report
										stageAssessmentObservation|Observation
										noteAuthorPractitioner|Practitioner
										noteAuthorPatient|Patient
										noteAuthorRelatedPerson|Related_Person
										*/
										
										myEmitter.prependOnceListener('checkSubjectPatient', function () {
											if (!validator.isEmpty(subjectPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
													if (resSubjectPatient.err_code > 0) {
														myEmitter.emit('checkEvidenceCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkEvidenceCode');
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

										myEmitter.prependOnceListener('checkAsserterPractitioner', function () {
											if (!validator.isEmpty(asserterPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + asserterPractitioner, 'PRACTITIONER', function (resAsserterPractitioner) {
													if (resAsserterPractitioner.err_code > 0) {
														myEmitter.emit('checkContextEpisodeOfCare');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Asserter practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEpisodeOfCare');
											}
										})

										myEmitter.prependOnceListener('checkAsserterPatient', function () {
											if (!validator.isEmpty(asserterPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + asserterPatient, 'PATIENT', function (resAsserterPatient) {
													if (resAsserterPatient.err_code > 0) {
														myEmitter.emit('checkAsserterPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Asserter patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAsserterPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkAsserterRelatedPerson', function () {
											if (!validator.isEmpty(asserterRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + asserterRelatedPerson, 'RELATED_PERSON', function (resAsserterRelatedPerson) {
													if (resAsserterRelatedPerson.err_code > 0) {
														myEmitter.emit('checkAsserterPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Asserter related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAsserterPatient');
											}
										})

										myEmitter.prependOnceListener('checkStageAssessmentClinicalImpression', function () {
											if (!validator.isEmpty(stageAssessmentClinicalImpression)) {
												checkUniqeValue(apikey, "CLINICAL_IMPRESSION_ID|" + stageAssessmentClinicalImpression, 'CLINICAL_IMPRESSION', function (resStageAssessmentClinicalImpression) {
													if (resStageAssessmentClinicalImpression.err_code > 0) {
														myEmitter.emit('checkAsserterRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Stage assessment clinical impression id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAsserterRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkStageAssessmentDiagnosticReport', function () {
											if (!validator.isEmpty(stageAssessmentDiagnosticReport)) {
												checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + stageAssessmentDiagnosticReport, 'DIAGNOSTIC_REPORT', function (resStageAssessmentDiagnosticReport) {
													if (resStageAssessmentDiagnosticReport.err_code > 0) {
														myEmitter.emit('checkStageAssessmentClinicalImpression');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Stage assessment diagnostic report id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStageAssessmentClinicalImpression');
											}
										})
										
										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
											if (!validator.isEmpty(noteAuthorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorPractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
													if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
														myEmitter.emit('checkStageAssessmentDiagnosticReport');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author author reference practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStageAssessmentDiagnosticReport');
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

										if (!validator.isEmpty(stageAssessmentObservation)) {
											checkUniqeValue(apikey, "OBSERVATION_ID|" + stageAssessmentObservation, 'OBSERVATION', function (resStageAssessmentObservation) {
												if (resStageAssessmentObservation.err_code > 0) {
													myEmitter.emit('checkNoteAuthorAuthorReferenceRelatedPerson');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Stage assessment observation id not found"
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
			var conditionId = req.params.condition_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof conditionId !== 'undefined'){
				if(validator.isEmpty(conditionId)){
					err_code = 2;
					err_msg = "Condition id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Condition id is required";
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
												checkUniqeValue(apikey, "CONDITION_ID|" + conditionId, 'CONDITION', function(resConditionID){
													if(resConditionID.err_code > 0){
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
																							"condition_id": conditionId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Condition.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Condition Id not found"});		
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
		/*conditionStages: function addConditionStages(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var conditionId = req.params.condition_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof conditionId !== 'undefined'){
				if(validator.isEmpty(conditionId)){
					err_code = 2;
					err_msg = "Condition id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Condition id is required";
			}
			
			if(typeof req.body.summary !== 'undefined'){
				var stageSummary =  req.body.summary.trim().toLowerCase();
				if(validator.isEmpty(stageSummary)){
					stageSummary = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'stage summary' in json Condition request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkConditionID', function(){
							checkUniqeValue(apikey, "CONDITION_ID|" + conditionId, 'CONDITION', function(resConditionID){
								if(resConditionID.err_code > 0){
									var unicId = uniqid.time();
									var conditionStagesId = 'cos' + unicId;
									//ConditionStages
									dataConditionStages = {
										"investigation_id" : conditionStagesId,
										"summary" : stageSummary,
										"clinical_impression_id" : conditionId
									}
									ApiFHIR.post('conditionStages', {"apikey": apikey}, {body: dataConditionStages, json: true}, function(error, response, body){
										conditionStages = body;
										if(conditionStages.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Condition Stages has been add in this Condition.", "data": conditionStages.data});
										}else{
											res.json(conditionStages);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Condition Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(stageSummary)) {
							checkCode(apikey, stageSummary, 'CONDITION_STAGE', function (resStageSummaryCode) {
								if (resStageSummaryCode.err_code > 0) {
									myEmitter.emit('checkConditionID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Stage summary code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkConditionID');
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
		conditionEvidence: function addConditionEvidence(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var conditionId = req.params.condition_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof conditionId !== 'undefined'){
				if(validator.isEmpty(conditionId)){
					err_code = 2;
					err_msg = "Condition id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Condition id is required";
			}
			
			if(typeof req.body.code !== 'undefined'){
				var evidenceCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(evidenceCode)){
					evidenceCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'evidence code' in json Condition request.";
			}

			if(typeof req.body.detail !== 'undefined'){
				var evidenceDetail =  req.body.detail.trim().toLowerCase();
				if(validator.isEmpty(evidenceDetail)){
					evidenceDetail = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'evidence detail' in json Condition request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkConditionID', function(){
							checkUniqeValue(apikey, "CARE_TEAM_ID|" + conditionId, 'CARE_TEAM', function(resConditionID){
								if(resConditionID.err_code > 0){
									var unicId = uniqid.time();
									var conditionEvidenceId = 'coe' + unicId;
									//ConditionEvidence
									dataConditionEvidence = {
										"evidence_id" : conditionEvidenceId,
										"code" : evidenceCode,
										"detail" : evidenceDetail,
										"condition_id" : conditionId
									}
									ApiFHIR.post('conditionEvidence', {"apikey": apikey}, {body: dataConditionEvidence, json: true}, function(error, response, body){
										conditionEvidence = body;
										if(conditionEvidence.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Condition Evidence has been add in this Condition.", "data": conditionEvidence.data});
										}else{
											res.json(conditionEvidence);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Condition Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(evidenceCode)) {
							checkCode(apikey, evidenceCode, 'CONDITION_VER_STATUS', function (resEvidenceCodeCode) {
								if (resEvidenceCodeCode.err_code > 0) {
									myEmitter.emit('checkConditionID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Evidence code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkConditionID');
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
		conditionNote: function addConditionNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var conditionId = req.params.condition_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof conditionId !== 'undefined'){
				if(validator.isEmpty(conditionId)){
					err_code = 2;
					err_msg = "Condition id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Condition id is required";
			}
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Condition request.";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Condition request.";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Condition request.";
			}

			if(typeof req.body.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Condition request.";
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
				err_msg = "Please add sub-key 'note time' in json Condition request.";
			}

			if(typeof req.body.string !== 'undefined'){
				var noteString =  req.body.string.trim().toLowerCase();
				if(validator.isEmpty(noteString)){
					noteString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note string' in json Condition request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkConditionID', function(){
							checkUniqeValue(apikey, "condition_id|" + conditionId, 'condition', function(resConditionID){
								if(resConditionID.err_code > 0){
									var unicId = uniqid.time();
									var conditionNoteId = 'aci' + unicId;
									//ConditionNote
									dataConditionNote = {
										"id": conditionNoteId,
										"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
										"author_ref_patient": noteAuthorAuthorReferencePatient,
										"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
										"author_string": noteAuthorAuthorString,
										"time": noteTime,
										"text": noteString,
										"condition_id" : conditionId
									}
									ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataConditionNote, json: true}, function(error, response, body){
										conditionNote = body;
										if(conditionNote.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Condition Note has been add in this Condition.", "data": conditionNote.data});
										}else{
											res.json(conditionNote);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Condition Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkConditionID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkConditionID');
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
		condition : function putCondition(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var conditionId = req.params.condition_id;

      var err_code = 0;
      var err_msg = "";
      var dataCondition = {};

			if(typeof conditionId !== 'undefined'){
				if(validator.isEmpty(conditionId)){
					err_code = 2;
					err_msg = "Condition id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Condition id is required";
			}
			
			/*
			var clinical_status = req.body.clinical_status;
			var verification_status = req.body.verification_status;
			var category = req.body.category;
			var severity = req.body.severity;
			var code = req.body.code;
			var body_site = req.body.body_site;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var onset_date_time = req.body.onset_date_time;
			var onset_age = req.body.onset_age;
			var onset_period_start = req.body.onset_period_start;
			var onset_period_end = req.body.onset_period_end;
			var onset_range_low = req.body.onset_range_low;
			var onset_range_high = req.body.onset_range_high;
			var onset_string = req.body.onset_string;
			var abatement_date_time = req.body.abatement_date_time;
			var abatement_age = req.body.abatement_age;
			var abatement_boolean = req.body.abatement_boolean;
			var abatement_period_start = req.body.abatement_period_start;
			var abatement_period_end = req.body.abatement_period_end;
			var abatement_range_low = req.body.abatement_range_low;
			var abatement_range_high = req.body.abatement_range_high;
			var abatement_string = req.body.abatement_string;
			var asserted_date = req.body.asserted_date;
			var asserter_practitioner = req.body.asserter_practitioner;
			var asserter_patient = req.body.asserter_patient;
			var asserter_related_person = req.body.asserter_related_person;
			var summay = req.body.summary;
			*/

			if(typeof req.body.clinicalStatus !== 'undefined' && req.body.clinicalStatus !== ""){
				var clinicalStatus =  req.body.clinicalStatus.trim().toLowerCase();
				if(validator.isEmpty(clinicalStatus)){
					dataCondition.clinical_status = "";
				}else{
					dataCondition.clinical_status = clinicalStatus;
				}
			}else{
			  clinicalStatus = "";
			}

			if(typeof req.body.verificationStatus !== 'undefined' && req.body.verificationStatus !== ""){
				var verificationStatus =  req.body.verificationStatus.trim().toLowerCase();
				if(validator.isEmpty(verificationStatus)){
					dataCondition.verification_status = "";
				}else{
					dataCondition.verification_status = verificationStatus;
				}
			}else{
			  verificationStatus = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					dataCondition.category = "";
				}else{
					dataCondition.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.severity !== 'undefined' && req.body.severity !== ""){
				var severity =  req.body.severity.trim().toLowerCase();
				if(validator.isEmpty(severity)){
					dataCondition.severity = "";
				}else{
					dataCondition.severity = severity;
				}
			}else{
			  severity = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					dataCondition.code = "";
				}else{
					dataCondition.code = code;
				}
			}else{
			  code = "";
			}

			if(typeof req.body.bodySite !== 'undefined' && req.body.bodySite !== ""){
				var bodySite =  req.body.bodySite.trim().toLowerCase();
				if(validator.isEmpty(bodySite)){
					dataCondition.body_site = "";
				}else{
					dataCondition.body_site = bodySite;
				}
			}else{
			  bodySite = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataCondition.subject_patient = "";
				}else{
					dataCondition.subject_patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataCondition.subject_group = "";
				}else{
					dataCondition.subject_group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					dataCondition.context_encounter = "";
				}else{
					dataCondition.context_encounter = contextEncounter;
				}
			}else{
			  contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					dataCondition.context_episode_of_care = "";
				}else{
					dataCondition.context_episode_of_care = contextEpisodeOfCare;
				}
			}else{
			  contextEpisodeOfCare = "";
			}

			if(typeof req.body.onset.onsetDateTime !== 'undefined' && req.body.onset.onsetDateTime !== ""){
				var onsetOnsetDateTime =  req.body.onset.onsetDateTime;
				if(validator.isEmpty(onsetOnsetDateTime)){
					err_code = 2;
					err_msg = "condition onset onset date time is required.";
				}else{
					if(!regex.test(onsetOnsetDateTime)){
						err_code = 2;
						err_msg = "condition onset onset date time invalid date format.";	
					}else{
						dataCondition.onset_date_time = onsetOnsetDateTime;
					}
				}
			}else{
			  onsetOnsetDateTime = "";
			}

			if(typeof req.body.onset.onsetAge !== 'undefined' && req.body.onset.onsetAge !== ""){
				var onsetOnsetAge =  req.body.onset.onsetAge;
				if(validator.isEmpty(onsetOnsetAge)){
					dataCondition.onset_age = "";
				}else{
					if(validator.isInt(onsetOnsetAge)){
						err_code = 2;
						err_msg = "condition onset onset age is must be number.";
					}else{
						dataCondition.onset_age = onsetOnsetAge;
					}
				}
			}else{
			  onsetOnsetAge = "";
			}

			if (typeof req.body.onset.onsetPeriod !== 'undefined' && req.body.onset.onsetPeriod !== "") {
			  var onsetOnsetPeriod = req.body.onset.onsetPeriod;
			  if (onsetOnsetPeriod.indexOf("to") > 0) {
			    arrOnsetOnsetPeriod = onsetOnsetPeriod.split("to");
			    dataCondition.onset_period_start = arrOnsetOnsetPeriod[0];
			    dataCondition.onset_period_end = arrOnsetOnsetPeriod[1];
			    if (!regex.test(onsetOnsetPeriodStart) && !regex.test(onsetOnsetPeriodEnd)) {
			      err_code = 2;
			      err_msg = "condition onset onset period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "condition onset onset period invalid date format.";
				}
			} else {
			  onsetOnsetPeriod = "";
			}

			if (typeof req.body.onset.onsetRange !== 'undefined' && req.body.onset.onsetRange !== "") {
			  var onsetOnsetRange = req.body.onset.onsetRange;
			  if (onsetOnsetRange.indexOf("to") > 0) {
			    arrOnsetOnsetRange = onsetOnsetRange.split("to");
			    dataCondition.onset_range_low = arrOnsetOnsetRange[0];
			    dataCondition.onset_range_high = arrOnsetOnsetRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "condition onset onset range invalid range format.";
				}
			} else {
			  onsetOnsetRange = "";
			}

			if(typeof req.body.onset.onsetString !== 'undefined' && req.body.onset.onsetString !== ""){
				var onsetOnsetString =  req.body.onset.onsetString.trim().toLowerCase();
				if(validator.isEmpty(onsetOnsetString)){
					dataCondition.onset_string = "";
				}else{
					dataCondition.onset_string = onsetOnsetString;
				}
			}else{
			  onsetOnsetString = "";
			}

			if(typeof req.body.abatement.abatementDateTime !== 'undefined' && req.body.abatement.abatementDateTime !== ""){
				var abatementAbatementDateTime =  req.body.abatement.abatementDateTime;
				if(validator.isEmpty(abatementAbatementDateTime)){
					err_code = 2;
					err_msg = "condition abatement abatement date time is required.";
				}else{
					if(!regex.test(abatementAbatementDateTime)){
						err_code = 2;
						err_msg = "condition abatement abatement date time invalid date format.";	
					}else{
						dataCondition.abatement_date_time = abatementAbatementDateTime;
					}
				}
			}else{
			  abatementAbatementDateTime = "";
			}

			if(typeof req.body.abatement.abatementAge !== 'undefined' && req.body.abatement.abatementAge !== ""){
				var abatementAbatementAge =  req.body.abatement.abatementAge;
				if(validator.isEmpty(abatementAbatementAge)){
					dataCondition.abatement_age = "";
				}else{
					if(validator.isInt(abatementAbatementAge)){
						err_code = 2;
						err_msg = "condition abatement abatement age is must be number.";
					}else{
						dataCondition.abatement_age = abatementAbatementAge;
					}
				}
			}else{
			  abatementAbatementAge = "";
			}

			if (typeof req.body.abatement.abatementBoolean !== 'undefined' && req.body.abatement.abatementBoolean !== "") {
			  var abatementAbatementBoolean = req.body.abatement.abatementBoolean.trim().toLowerCase();
					if(validator.isEmpty(abatementAbatementBoolean)){
						abatementAbatementBoolean = "false";
					}
			  if(abatementAbatementBoolean === "true" || abatementAbatementBoolean === "false"){
					dataCondition.abatement_boolean = abatementAbatementBoolean;
			  } else {
			    err_code = 2;
			    err_msg = "Condition abatement abatement boolean is must be boolean.";
			  }
			} else {
			  abatementAbatementBoolean = "";
			}

			if (typeof req.body.abatement.abatementPeriod !== 'undefined' && req.body.abatement.abatementPeriod !== "") {
			  var abatementAbatementPeriod = req.body.abatement.abatementPeriod;
			  if (abatementAbatementPeriod.indexOf("to") > 0) {
			    arrAbatementAbatementPeriod = abatementAbatementPeriod.split("to");
			    dataCondition.abatement_period_start = arrAbatementAbatementPeriod[0];
			    dataCondition.abatement_period_end = arrAbatementAbatementPeriod[1];
			    if (!regex.test(abatementAbatementPeriodStart) && !regex.test(abatementAbatementPeriodEnd)) {
			      err_code = 2;
			      err_msg = "condition abatement abatement period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "condition abatement abatement period invalid date format.";
				}
			} else {
			  abatementAbatementPeriod = "";
			}

			if (typeof req.body.abatement.abatementRange !== 'undefined' && req.body.abatement.abatementRange !== "") {
			  var abatementAbatementRange = req.body.abatement.abatementRange;
			  if (abatementAbatementRange.indexOf("to") > 0) {
			    arrAbatementAbatementRange = abatementAbatementRange.split("to");
			    dataCondition.abatement_range_low = arrAbatementAbatementRange[0];
			    dataCondition.abatement_range_high = arrAbatementAbatementRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "condition abatement abatement range invalid range format.";
				}
			} else {
			  abatementAbatementRange = "";
			}

			if(typeof req.body.abatement.abatementString !== 'undefined' && req.body.abatement.abatementString !== ""){
				var abatementAbatementString =  req.body.abatement.abatementString.trim().toLowerCase();
				if(validator.isEmpty(abatementAbatementString)){
					dataCondition.abatement_string = "";
				}else{
					dataCondition.abatement_string = abatementAbatementString;
				}
			}else{
			  abatementAbatementString = "";
			}

			if(typeof req.body.assertedDate !== 'undefined' && req.body.assertedDate !== ""){
				var assertedDate =  req.body.assertedDate;
				if(validator.isEmpty(assertedDate)){
					err_code = 2;
					err_msg = "condition asserted date is required.";
				}else{
					if(!regex.test(assertedDate)){
						err_code = 2;
						err_msg = "condition asserted date invalid date format.";	
					}else{
						dataCondition.asserted_date = assertedDate;
					}
				}
			}else{
			  assertedDate = "";
			}

			if(typeof req.body.asserter.practitioner !== 'undefined' && req.body.asserter.practitioner !== ""){
				var asserterPractitioner =  req.body.asserter.practitioner.trim().toLowerCase();
				if(validator.isEmpty(asserterPractitioner)){
					dataCondition.asserter_practitioner = "";
				}else{
					dataCondition.asserter_practitioner = asserterPractitioner;
				}
			}else{
			  asserterPractitioner = "";
			}

			if(typeof req.body.asserter.patient !== 'undefined' && req.body.asserter.patient !== ""){
				var asserterPatient =  req.body.asserter.patient.trim().toLowerCase();
				if(validator.isEmpty(asserterPatient)){
					dataCondition.asserter_patient = "";
				}else{
					dataCondition.asserter_patient = asserterPatient;
				}
			}else{
			  asserterPatient = "";
			}

			if(typeof req.body.asserter.relatedPerson !== 'undefined' && req.body.asserter.relatedPerson !== ""){
				var asserterRelatedPerson =  req.body.asserter.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(asserterRelatedPerson)){
					dataCondition.asserter_related_person = "";
				}else{
					dataCondition.asserter_related_person = asserterRelatedPerson;
				}
			}else{
			  asserterRelatedPerson = "";
			}
			
			if(typeof req.body.summary !== 'undefined' && req.body.summary !== ""){
				var stageSummary =  req.body.summary.trim().toLowerCase();
				if(validator.isEmpty(stageSummary)){
					dataCondition.summary = "";
				}else{
					dataCondition.summary = stageSummary;
				}
			}else{
			  stageSummary = "";
			}

			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkConditionId', function(){
						checkUniqeValue(apikey, "CONDITION_ID|" + conditionId, 'CONDITION', function(resConditionId){
							if(resConditionId.err_code > 0){
								ApiFHIR.put('condition', {"apikey": apikey, "_id": conditionId}, {body: dataCondition, json: true}, function(error, response, body){
									condition = body;
									if(condition.err_code > 0){
										res.json(condition);	
									}else{
										res.json({"err_code": 0, "err_msg": "Condition has been update.", "data": [{"_id": conditionId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Condition Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkClinicalStatus', function () {
						if (!validator.isEmpty(clinicalStatus)) {
							checkCode(apikey, clinicalStatus, 'CONDITION_CLINICAL', function (resClinicalStatusCode) {
								if (resClinicalStatusCode.err_code > 0) {
									myEmitter.emit('checkConditionId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Clinical status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkConditionId');
						}
					})

					myEmitter.prependOnceListener('checkVerificationStatus', function () {
						if (!validator.isEmpty(verificationStatus)) {
							checkCode(apikey, verificationStatus, 'CONDITION_VER_STATUS', function (resVerificationStatusCode) {
								if (resVerificationStatusCode.err_code > 0) {
									myEmitter.emit('checkClinicalStatus');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Verification status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkClinicalStatus');
						}
					})

					myEmitter.prependOnceListener('checkCategory', function () {
						if (!validator.isEmpty(category)) {
							checkCode(apikey, category, 'CONDITION_CATEGORY', function (resCategoryCode) {
								if (resCategoryCode.err_code > 0) {
									myEmitter.emit('checkVerificationStatus');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Category code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkVerificationStatus');
						}
					})

					myEmitter.prependOnceListener('checkSeverity', function () {
						if (!validator.isEmpty(severity)) {
							checkCode(apikey, severity, 'CONDITION_SEVERITY', function (resSeverityCode) {
								if (resSeverityCode.err_code > 0) {
									myEmitter.emit('checkCategory');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Severity code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCategory');
						}
					})

					myEmitter.prependOnceListener('checkCode', function () {
						if (!validator.isEmpty(code)) {
							checkCode(apikey, code, 'CONDITION_CODE', function (resCodeCode) {
								if (resCodeCode.err_code > 0) {
									myEmitter.emit('checkSeverity');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSeverity');
						}
					})

					myEmitter.prependOnceListener('checkBodySite', function () {
						if (!validator.isEmpty(bodySite)) {
							checkCode(apikey, bodySite, 'BODY_SITE', function (resBodySiteCode) {
								if (resBodySiteCode.err_code > 0) {
									myEmitter.emit('checkCode');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Body site code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCode');
						}
					})

					myEmitter.prependOnceListener('checkStageSummary', function () {
						if (!validator.isEmpty(stageSummary)) {
							checkCode(apikey, stageSummary, 'CONDITION_STAGE', function (resStageSummaryCode) {
								if (resStageSummaryCode.err_code > 0) {
									myEmitter.emit('checkBodySite');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Stage summary code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkBodySite');
						}
					})

					myEmitter.prependOnceListener('checkSubjectPatient', function () {
						if (!validator.isEmpty(subjectPatient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
								if (resSubjectPatient.err_code > 0) {
									myEmitter.emit('checkStageSummary');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkStageSummary');
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

					myEmitter.prependOnceListener('checkAsserterPractitioner', function () {
						if (!validator.isEmpty(asserterPractitioner)) {
							checkUniqeValue(apikey, "PRACTITIONER_ID|" + asserterPractitioner, 'PRACTITIONER', function (resAsserterPractitioner) {
								if (resAsserterPractitioner.err_code > 0) {
									myEmitter.emit('checkContextEpisodeOfCare');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Asserter practitioner id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkContextEpisodeOfCare');
						}
					})

					myEmitter.prependOnceListener('checkAsserterPatient', function () {
						if (!validator.isEmpty(asserterPatient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + asserterPatient, 'PATIENT', function (resAsserterPatient) {
								if (resAsserterPatient.err_code > 0) {
									myEmitter.emit('checkAsserterPractitioner');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Asserter patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkAsserterPractitioner');
						}
					})

					if (!validator.isEmpty(asserterRelatedPerson)) {
						checkUniqeValue(apikey, "RELATED_PERSON_ID|" + asserterRelatedPerson, 'RELATED_PERSON', function (resAsserterRelatedPerson) {
							if (resAsserterRelatedPerson.err_code > 0) {
								myEmitter.emit('checkAsserterPatient');
							} else {
								res.json({
									"err_code": "500",
									"err_msg": "Asserter related person id not found"
								});
							}
						})
					} else {
						myEmitter.emit('checkAsserterPatient');
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
			var conditionId = req.params.condition_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof conditionId !== 'undefined'){
				if(validator.isEmpty(conditionId)){
					err_code = 2;
					err_msg = "Condition id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Condition id is required";
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
						myEmitter.prependOnceListener('checkConditionID', function(){
							checkUniqeValue(apikey, "CONDITION_ID|" + conditionId, 'CONDITION', function(resConditionID){
								if(resConditionID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "CONDITION_ID|"+conditionId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Condition.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Condition Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkConditionID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkConditionID');				
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
		/*conditionStages: function updateConditionStages(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var conditionId = req.params.condition_id;
			var conditionStagesId = req.params.condition_stages_id;

			var err_code = 0;
			var err_msg = "";
			var dataCondition = {};
			//input check 
			if(typeof conditionId !== 'undefined'){
				if(validator.isEmpty(conditionId)){
					err_code = 2;
					err_msg = "Condition id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Condition id is required";
			}

			if(typeof conditionStagesId !== 'undefined'){
				if(validator.isEmpty(conditionStagesId)){
					err_code = 2;
					err_msg = "Condition Stages id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Condition Stages id is required";
			}
			
			if(typeof req.body.summary !== 'undefined' && req.body.summary !== ""){
				var stageSummary =  req.body.summary.trim().toLowerCase();
				if(validator.isEmpty(stageSummary)){
					dataCondition.summary = "";
				}else{
					dataCondition.summary = stageSummary;
				}
			}else{
			  stageSummary = "";
			}

			if(typeof req.body.assessment.clinicalImpression !== 'undefined' && req.body.assessment.clinicalImpression !== ""){
				var stageAssessmentClinicalImpression =  req.body.assessment.clinicalImpression.trim().toLowerCase();
				if(validator.isEmpty(stageAssessmentClinicalImpression)){
					dataCondition.clinical_impression = "";
				}else{
					dataCondition.clinical_impression = stageAssessmentClinicalImpression;
				}
			}else{
			  stageAssessmentClinicalImpression = "";
			}

			if(typeof req.body.assessment.diagnosticReport !== 'undefined' && req.body.assessment.diagnosticReport !== ""){
				var stageAssessmentDiagnosticReport =  req.body.assessment.diagnosticReport.trim().toLowerCase();
				if(validator.isEmpty(stageAssessmentDiagnosticReport)){
					dataCondition.diagnostic_report = "";
				}else{
					dataCondition.diagnostic_report = stageAssessmentDiagnosticReport;
				}
			}else{
			  stageAssessmentDiagnosticReport = "";
			}

			if(typeof req.body.assessment.observation !== 'undefined' && req.body.assessment.observation !== ""){
				var stageAssessmentObservation =  req.body.assessment.observation.trim().toLowerCase();
				if(validator.isEmpty(stageAssessmentObservation)){
					dataCondition.observation = "";
				}else{
					dataCondition.observation = stageAssessmentObservation;
				}
			}else{
			  stageAssessmentObservation = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkConditionID', function(){
							checkUniqeValue(apikey, "CONDITION_ID|" + conditionId, 'CONDITION', function(resConditionId){
								if(resConditionId.err_code > 0){
									checkUniqeValue(apikey, "STAGE_ID|" + conditionStagesId, 'CONDITION_STAGES', function(resConditionStagesID){
										if(resConditionStagesID.err_code > 0){
											ApiFHIR.put('conditionStages', {"apikey": apikey, "_id": conditionStagesId, "dr": "CONDITION_ID|"+conditionId}, {body: dataCondition, json: true}, function(error, response, body){
												conditionStages = body;
												if(conditionStages.err_code > 0){
													res.json(conditionStages);	
												}else{
													res.json({"err_code": 0, "err_msg": "Condition Stages has been update in this Condition.", "data": conditionStages.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Condition Stages Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Condition Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(stageSummary)) {
							checkCode(apikey, stageSummary, 'CONDITION_STAGE', function (resStageSummaryCode) {
								if (resStageSummaryCode.err_code > 0) {
									myEmitter.emit('checkConditionID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Stage summary code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkConditionID');
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
		conditionEvidence: function updateConditionEvidence(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var conditionId = req.params.condition_id;
			var conditionEvidenceId = req.params.condition_evidence_id;

			var err_code = 0;
			var err_msg = "";
			var dataCondition = {};
			//input check 
			if(typeof conditionId !== 'undefined'){
				if(validator.isEmpty(conditionId)){
					err_code = 2;
					err_msg = "Condition id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Condition id is required";
			}

			if(typeof conditionEvidenceId !== 'undefined'){
				if(validator.isEmpty(conditionEvidenceId)){
					err_code = 2;
					err_msg = "Condition Evidence id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Condition Evidence id is required";
			}
			
			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var evidenceCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(evidenceCode)){
					dataCondition.code = "";
				}else{
					dataCondition.code = evidenceCode;
				}
			}else{
			  evidenceCode = "";
			}

			if(typeof req.body.detail !== 'undefined' && req.body.detail !== ""){
				var evidenceDetail =  req.body.detail.trim().toLowerCase();
				if(validator.isEmpty(evidenceDetail)){
					dataCondition.detail = "";
				}else{
					dataCondition.detail = evidenceDetail;
				}
			}else{
			  evidenceDetail = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkConditionID', function(){
							checkUniqeValue(apikey, "CONDITION_ID|" + conditionId, 'CONDITION', function(resConditionId){
								if(resConditionId.err_code > 0){
									checkUniqeValue(apikey, "EVIDENCE_ID|" + conditionEvidenceId, 'CONDITION_EVIDENCE', function(resConditionEvidenceID){
										if(resConditionEvidenceID.err_code > 0){
											ApiFHIR.put('conditionEvidence', {"apikey": apikey, "_id": conditionEvidenceId, "dr": "CONDITION_ID|"+conditionId}, {body: dataCondition, json: true}, function(error, response, body){
												conditionEvidence = body;
												if(conditionEvidence.err_code > 0){
													res.json(conditionEvidence);	
												}else{
													res.json({"err_code": 0, "err_msg": "Condition Evidence has been update in this Condition.", "data": conditionEvidence.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Condition Evidence Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Condition Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(evidenceCode)) {
							checkCode(apikey, evidenceCode, 'CONDITION_VER_STATUS', function (resEvidenceCodeCode) {
								if (resEvidenceCodeCode.err_code > 0) {
									myEmitter.emit('checkConditionID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Evidence code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkConditionID');
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
		conditionNote: function updateConditionNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var conditionId = req.params.condition_id;
			var conditionNoteId = req.params.condition_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataCondition = {};
			//input check 
			if(typeof conditionId !== 'undefined'){
				if(validator.isEmpty(conditionId)){
					err_code = 2;
					err_msg = "Condition id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Condition id is required";
			}

			if(typeof conditionNoteId !== 'undefined'){
				if(validator.isEmpty(conditionNoteId)){
					err_code = 2;
					err_msg = "Condition Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Condition Note id is required";
			}
			
			/*
			"id": conditionNoteId,
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
					err_msg = "condition note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "condition note time invalid date format.";	
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
						myEmitter.once('checkConditionID', function(){
							checkUniqeValue(apikey, "condition_id|" + conditionId, 'condition', function(resConditionId){
								if(resConditionId.err_code > 0){
									checkUniqeValue(apikey, "NOTE_ID|" + conditionNoteId, 'NOTE', function(resConditionNoteID){
										if(resConditionNoteID.err_code > 0){
											ApiFHIR.put('annotation', {"apikey": apikey, "_id": conditionNoteId, "dr": "condition_id|"+conditionId}, {body: dataCondition, json: true}, function(error, response, body){
												conditionNote = body;
												if(conditionNote.err_code > 0){
													res.json(conditionNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Condition Note has been update in this Condition.", "data": conditionNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Condition Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Condition Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkConditionID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkConditionID');
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