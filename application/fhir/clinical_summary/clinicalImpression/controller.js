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
		clinicalImpression : function getClinicalImpression(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var clinicalImpressionId = req.query._id;
			var action = req.query.action;
			var assessor = req.query.assessor;
			var context = req.query.context;
			var date = req.query.date;
			var finding_code = req.query.findingCode;
			var finding_ref = req.query.findingRef;
			var identifier = req.query.identifier;
			var investigation = req.query.investigation;
			var patient = req.query.patient;
			var previous = req.query.previous;
			var problem = req.query.problem;
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

			if(typeof clinicalImpressionId !== 'undefined'){
				if(!validator.isEmpty(clinicalImpressionId)){
					qString._id = clinicalImpressionId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Clinical Impression Id is required."});
				}
			}

			if(typeof action !== 'undefined'){
				if(!validator.isEmpty(action)){
					qString.action = action; 
				}else{
					res.json({"err_code": 1, "err_msg": "action is empty."});
				}
			}

			if(typeof assessor !== 'undefined'){
				if(!validator.isEmpty(assessor)){
					qString.assessor = assessor; 
				}else{
					res.json({"err_code": 1, "err_msg": "assessor is empty."});
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

			if(typeof finding_code !== 'undefined'){
				if(!validator.isEmpty(finding_code)){
					qString.finding_code = finding_code; 
				}else{
					res.json({"err_code": 1, "err_msg": "finding code is empty."});
				}
			}

			if(typeof finding_ref !== 'undefined'){
				if(!validator.isEmpty(finding_ref)){
					qString.finding_ref = finding_ref; 
				}else{
					res.json({"err_code": 1, "err_msg": "finding ref is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "identifier is empty."});
				}
			}

			if(typeof investigation !== 'undefined'){
				if(!validator.isEmpty(investigation)){
					qString.investigation = investigation; 
				}else{
					res.json({"err_code": 1, "err_msg": "investigation is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "patient is empty."});
				}
			}

			if(typeof previous !== 'undefined'){
				if(!validator.isEmpty(previous)){
					qString.previous = previous; 
				}else{
					res.json({"err_code": 1, "err_msg": "previous is empty."});
				}
			}

			if(typeof problem !== 'undefined'){
				if(!validator.isEmpty(problem)){
					qString.problem = problem; 
				}else{
					res.json({"err_code": 1, "err_msg": "problem is empty."});
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
				"ClinicalImpression" : {
					"location": "%(apikey)s/ClinicalImpression",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('ClinicalImpression', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var clinicalImpression = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(clinicalImpression.err_code == 0){
								//cek jumdata dulu
								if(clinicalImpression.data.length > 0){
									newClinicalImpression = [];
									for(i=0; i < clinicalImpression.data.length; i++){
										myEmitter.once("getIdentifier", function(clinicalImpression, index, newClinicalImpression, countClinicalImpression){
											/*console.log(clinicalImpression);*/
											//get identifier
											qString = {};
											qString.clinical_impression_id = clinicalImpression.id;
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
													var objectClinicalImpression = {};
													objectClinicalImpression.resourceType = clinicalImpression.resourceType;
													objectClinicalImpression.id = clinicalImpression.id;
													objectClinicalImpression.identifier = identifier.data;
													objectClinicalImpression.status = clinicalImpression.status;
													objectClinicalImpression.code = clinicalImpression.code;
													objectClinicalImpression.description = clinicalImpression.description;
													objectClinicalImpression.subject = clinicalImpression.subject;
													objectClinicalImpression.context = clinicalImpression.context;
													objectClinicalImpression.effective = clinicalImpression.effective;
													objectClinicalImpression.date = clinicalImpression.date;
													objectClinicalImpression.assessor = clinicalImpression.assessor;
													objectClinicalImpression.previous = clinicalImpression.previous;
													objectClinicalImpression.protocol = clinicalImpression.protocol;
													objectClinicalImpression.summary = clinicalImpression.summary;
													objectClinicalImpression.prognosisCodeableConcept = clinicalImpression.prognosisCodeableConcept;
													newClinicalImpression[index] = objectClinicalImpression;

													myEmitter.once('getNote', function(clinicalImpression, index, newClinicalImpression, countClinicalImpression){
														qString = {};
														qString.clinical_impression_id = clinicalImpression.id;
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
																var objectClinicalImpression = {};
																objectClinicalImpression.resourceType = clinicalImpression.resourceType;
																objectClinicalImpression.id = clinicalImpression.id;
																objectClinicalImpression.identifier = clinicalImpression.identifier;
																objectClinicalImpression.status = clinicalImpression.status;
																objectClinicalImpression.code = clinicalImpression.code;
																objectClinicalImpression.description = clinicalImpression.description;
																objectClinicalImpression.subject = clinicalImpression.subject;
																objectClinicalImpression.context = clinicalImpression.context;
																objectClinicalImpression.effective = clinicalImpression.effective;
																objectClinicalImpression.date = clinicalImpression.date;
																objectClinicalImpression.assessor = clinicalImpression.assessor;
																objectClinicalImpression.previous = clinicalImpression.previous;
																objectClinicalImpression.investigation = host + ':' + port + '/' + apikey + '/ClinicalImpression/' +  clinicalImpression.id + '/ClinicalImpressionInvestigation';
																objectClinicalImpression.protocol = clinicalImpression.protocol;
																objectClinicalImpression.summary = clinicalImpression.summary;
																objectClinicalImpression.prognosisCodeableConcept = clinicalImpression.prognosisCodeableConcept;
																objectClinicalImpression.note = annotation.data;

																newClinicalImpression[index] = objectClinicalImpression;

																/*if(index == countClinicalImpression -1 ){
																	res.json({"err_code": 0, "data":newClinicalImpression});				
																}*/
																myEmitter.once('getClinicalImpressionFinding', function(clinicalImpression, index, newClinicalImpression, countClinicalImpression){
																	qString = {};
																	qString.clinical_impression_id = clinicalImpression.id;
																	seedPhoenixFHIR.path.GET = {
																		"ClinicalImpressionFinding" : {
																			"location": "%(apikey)s/ClinicalImpressionFinding",
																			"query": qString
																		}
																	}

																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																	ApiFHIR.get('ClinicalImpressionFinding', {"apikey": apikey}, {}, function(error, response, body){
																		clinicalImpressionFinding = JSON.parse(body);
																		console.log(clinicalImpressionFinding);
																		if(clinicalImpressionFinding.err_code == 0){
																			var objectClinicalImpression = {};
																			objectClinicalImpression.resourceType = clinicalImpression.resourceType;
																			objectClinicalImpression.id = clinicalImpression.id;
																			objectClinicalImpression.identifier = clinicalImpression.identifier;
																			objectClinicalImpression.status = clinicalImpression.status;
																			objectClinicalImpression.code = clinicalImpression.code;
																			objectClinicalImpression.description = clinicalImpression.description;
																			objectClinicalImpression.subject = clinicalImpression.subject;
																			objectClinicalImpression.context = clinicalImpression.context;
																			objectClinicalImpression.effective = clinicalImpression.effective;
																			objectClinicalImpression.date = clinicalImpression.date;
																			objectClinicalImpression.assessor = clinicalImpression.assessor;
																			objectClinicalImpression.previous = clinicalImpression.previous;
																			objectClinicalImpression.investigation = clinicalImpression.investigation;
																			objectClinicalImpression.protocol = clinicalImpression.protocol;
																			objectClinicalImpression.summary = clinicalImpression.summary;
																			objectClinicalImpression.finding = clinicalImpressionFinding.data;
																			objectClinicalImpression.prognosisCodeableConcept = clinicalImpression.prognosisCodeableConcept;
																			objectClinicalImpression.note = clinicalImpression.note;

																			newClinicalImpression[index] = objectClinicalImpression;

																			myEmitter.once('getClinicalImpressionProblemCondition', function(clinicalImpression, index, newClinicalImpression, countClinicalImpression){
																				qString = {};
																				qString.clinical_impression_id = clinicalImpression.id;
																				seedPhoenixFHIR.path.GET = {
																					"ClinicalImpressionProblemCondition" : {
																						"location": "%(apikey)s/ClinicalImpressionProblemCondition",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('ClinicalImpressionProblemCondition', {"apikey": apikey}, {}, function(error, response, body){
																					clinicalImpressionProblemCondition = JSON.parse(body);
																					if(clinicalImpressionProblemCondition.err_code == 0){
																						var objectClinicalImpression = {};
																						objectClinicalImpression.resourceType = clinicalImpression.resourceType;
																						objectClinicalImpression.id = clinicalImpression.id;
																						objectClinicalImpression.identifier = clinicalImpression.identifier;
																						objectClinicalImpression.status = clinicalImpression.status;
																						objectClinicalImpression.code = clinicalImpression.code;
																						objectClinicalImpression.description = clinicalImpression.description;
																						objectClinicalImpression.subject = clinicalImpression.subject;
																						objectClinicalImpression.context = clinicalImpression.context;
																						objectClinicalImpression.effective = clinicalImpression.effective;
																						objectClinicalImpression.date = clinicalImpression.date;
																						objectClinicalImpression.assessor = clinicalImpression.assessor;
																						objectClinicalImpression.previous = clinicalImpression.previous;
																						var Problem = {};
																						Problem.condition = clinicalImpressionProblemCondition.data;
																						objectClinicalImpression.problem = Problem;
																						objectClinicalImpression.investigation = clinicalImpression.investigation;
																						objectClinicalImpression.protocol = clinicalImpression.protocol;
																						objectClinicalImpression.summary = clinicalImpression.summary;
																						objectClinicalImpression.finding = clinicalImpression.finding;
																						objectClinicalImpression.prognosisCodeableConcept = clinicalImpression.prognosisCodeableConcept;
																						objectClinicalImpression.note = clinicalImpression.note;

																						newClinicalImpression[index] = objectClinicalImpression;

																						myEmitter.once('getClinicalImpressionProblemAllergyIntolerance', function(clinicalImpression, index, newClinicalImpression, countClinicalImpression){
																							qString = {};
																							qString.clinical_impression_id = clinicalImpression.id;
																							seedPhoenixFHIR.path.GET = {
																								"ClinicalImpressionProblemAllergyIntolerance" : {
																									"location": "%(apikey)s/ClinicalImpressionProblemAllergyIntolerance",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('ClinicalImpressionProblemAllergyIntolerance', {"apikey": apikey}, {}, function(error, response, body){
																								clinicalImpressionProblemAllergyIntolerance = JSON.parse(body);
																								if(clinicalImpressionProblemAllergyIntolerance.err_code == 0){
																									var objectClinicalImpression = {};
																									objectClinicalImpression.resourceType = clinicalImpression.resourceType;
																									objectClinicalImpression.id = clinicalImpression.id;
																									objectClinicalImpression.identifier = clinicalImpression.identifier;
																									objectClinicalImpression.status = clinicalImpression.status;
																									objectClinicalImpression.code = clinicalImpression.code;
																									objectClinicalImpression.description = clinicalImpression.description;
																									objectClinicalImpression.subject = clinicalImpression.subject;
																									objectClinicalImpression.context = clinicalImpression.context;
																									objectClinicalImpression.effective = clinicalImpression.effective;
																									objectClinicalImpression.date = clinicalImpression.date;
																									objectClinicalImpression.assessor = clinicalImpression.assessor;
																									objectClinicalImpression.previous = clinicalImpression.previous;
																									var Problem = {};
																									Problem.condition = clinicalImpression.problem.condition;
																									Problem.allergyIntolerance = clinicalImpressionProblemAllergyIntolerance.data;
																									objectClinicalImpression.problem = Problem;
																									objectClinicalImpression.investigation = clinicalImpression.investigation;
																									objectClinicalImpression.protocol = clinicalImpression.protocol;
																									objectClinicalImpression.summary = clinicalImpression.summary;
																									objectClinicalImpression.finding = clinicalImpression.finding;
																									objectClinicalImpression.prognosisCodeableConcept = clinicalImpression.prognosisCodeableConcept;
																									objectClinicalImpression.note = clinicalImpression.note;

																									newClinicalImpression[index] = objectClinicalImpression;

																									myEmitter.once('getClinicalImpressionPrognosisReference', function(clinicalImpression, index, newClinicalImpression, countClinicalImpression){
																										qString = {};
																										qString.clinical_impression_id = clinicalImpression.id;
																										seedPhoenixFHIR.path.GET = {
																											"ClinicalImpressionPrognosisReference" : {
																												"location": "%(apikey)s/ClinicalImpressionPrognosisReference",
																												"query": qString
																											}
																										}

																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																										ApiFHIR.get('ClinicalImpressionPrognosisReference', {"apikey": apikey}, {}, function(error, response, body){
																											clinicalImpressionPrognosisReference = JSON.parse(body);
																											if(clinicalImpressionPrognosisReference.err_code == 0){
																												var objectClinicalImpression = {};
																												objectClinicalImpression.resourceType = clinicalImpression.resourceType;
																												objectClinicalImpression.id = clinicalImpression.id;
																												objectClinicalImpression.identifier = clinicalImpression.identifier;
																												objectClinicalImpression.status = clinicalImpression.status;
																												objectClinicalImpression.code = clinicalImpression.code;
																												objectClinicalImpression.description = clinicalImpression.description;
																												objectClinicalImpression.subject = clinicalImpression.subject;
																												objectClinicalImpression.context = clinicalImpression.context;
																												objectClinicalImpression.effective = clinicalImpression.effective;
																												objectClinicalImpression.date = clinicalImpression.date;
																												objectClinicalImpression.assessor = clinicalImpression.assessor;
																												objectClinicalImpression.previous = clinicalImpression.previous;
																												objectClinicalImpression.problem = clinicalImpression.problem;
																												objectClinicalImpression.investigation = clinicalImpression.investigation;
																												objectClinicalImpression.protocol = clinicalImpression.protocol;
																												objectClinicalImpression.summary = clinicalImpression.summary;
																												objectClinicalImpression.finding = clinicalImpression.finding;
																												objectClinicalImpression.prognosisCodeableConcept = clinicalImpression.prognosisCodeableConcept;
																												objectClinicalImpression.prognosisReference	 = clinicalImpressionPrognosisReference.data;
																												objectClinicalImpression.note = clinicalImpression.note;

																												newClinicalImpression[index] = objectClinicalImpression;

																												myEmitter.once('getClinicalImpressionActionReferralRequest', function(clinicalImpression, index, newClinicalImpression, countClinicalImpression){
																													qString = {};
																													qString.clinical_impression_id = clinicalImpression.id;
																													seedPhoenixFHIR.path.GET = {
																														"ClinicalImpressionActionReferralRequest" : {
																															"location": "%(apikey)s/ClinicalImpressionActionReferralRequest",
																															"query": qString
																														}
																													}

																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																													ApiFHIR.get('ClinicalImpressionActionReferralRequest', {"apikey": apikey}, {}, function(error, response, body){
																														clinicalImpressionActionReferralRequest = JSON.parse(body);
																														if(clinicalImpressionActionReferralRequest.err_code == 0){
																															var objectClinicalImpression = {};
																															objectClinicalImpression.resourceType = clinicalImpression.resourceType;
																															objectClinicalImpression.id = clinicalImpression.id;
																															objectClinicalImpression.identifier = clinicalImpression.identifier;
																															objectClinicalImpression.status = clinicalImpression.status;
																															objectClinicalImpression.code = clinicalImpression.code;
																															objectClinicalImpression.description = clinicalImpression.description;
																															objectClinicalImpression.subject = clinicalImpression.subject;
																															objectClinicalImpression.context = clinicalImpression.context;
																															objectClinicalImpression.effective = clinicalImpression.effective;
																															objectClinicalImpression.date = clinicalImpression.date;
																															objectClinicalImpression.assessor = clinicalImpression.assessor;
																															objectClinicalImpression.previous = clinicalImpression.previous;
																															objectClinicalImpression.problem = clinicalImpression.problem;
																															objectClinicalImpression.investigation = clinicalImpression.investigation;
																															objectClinicalImpression.protocol = clinicalImpression.protocol;
																															objectClinicalImpression.summary = clinicalImpression.summary;
																															objectClinicalImpression.finding = clinicalImpression.finding;
																															objectClinicalImpression.prognosisCodeableConcept = clinicalImpression.prognosisCodeableConcept;
																															objectClinicalImpression.prognosisReference	 = clinicalImpression.prognosisReference;
																															var Action = {};
																															Action.referralRequest = clinicalImpressionActionReferralRequest.data;
																															objectClinicalImpression.action = Action;
																															objectClinicalImpression.note = clinicalImpression.note;

																															newClinicalImpression[index] = objectClinicalImpression;

																															myEmitter.once('getClinicalImpressionActionProcedureRequest', function(clinicalImpression, index, newClinicalImpression, countClinicalImpression){
																																qString = {};
																																qString.clinical_impression_id = clinicalImpression.id;
																																seedPhoenixFHIR.path.GET = {
																																	"ClinicalImpressionActionProcedureRequest" : {
																																		"location": "%(apikey)s/ClinicalImpressionActionProcedureRequest",
																																		"query": qString
																																	}
																																}

																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																ApiFHIR.get('ClinicalImpressionActionProcedureRequest', {"apikey": apikey}, {}, function(error, response, body){
																																	clinicalImpressionActionProcedureRequest = JSON.parse(body);
																																	if(clinicalImpressionActionProcedureRequest.err_code == 0){
																																		var objectClinicalImpression = {};
																																		objectClinicalImpression.resourceType = clinicalImpression.resourceType;
																																		objectClinicalImpression.id = clinicalImpression.id;
																																		objectClinicalImpression.identifier = clinicalImpression.identifier;
																																		objectClinicalImpression.status = clinicalImpression.status;
																																		objectClinicalImpression.code = clinicalImpression.code;
																																		objectClinicalImpression.description = clinicalImpression.description;
																																		objectClinicalImpression.subject = clinicalImpression.subject;
																																		objectClinicalImpression.context = clinicalImpression.context;
																																		objectClinicalImpression.effective = clinicalImpression.effective;
																																		objectClinicalImpression.date = clinicalImpression.date;
																																		objectClinicalImpression.assessor = clinicalImpression.assessor;
																																		objectClinicalImpression.previous = clinicalImpression.previous;
																																		objectClinicalImpression.problem = clinicalImpression.problem;
																																		objectClinicalImpression.investigation = clinicalImpression.investigation;
																																		objectClinicalImpression.protocol = clinicalImpression.protocol;
																																		objectClinicalImpression.summary = clinicalImpression.summary;
																																		objectClinicalImpression.finding = clinicalImpression.finding;
																																		objectClinicalImpression.prognosisCodeableConcept = clinicalImpression.prognosisCodeableConcept;
																																		objectClinicalImpression.prognosisReference	 = clinicalImpression.prognosisReference;
																																		var Action = {};
																																		Action.referralRequest = clinicalImpression.action.referralRequest;
																																		Action.procedureRequest = clinicalImpressionActionProcedureRequest.data;
																																		objectClinicalImpression.action = Action;
																																		objectClinicalImpression.note = clinicalImpression.note;

																																		newClinicalImpression[index] = objectClinicalImpression;

																																		myEmitter.once('getClinicalImpressionActionProcedure', function(clinicalImpression, index, newClinicalImpression, countClinicalImpression){
																																			qString = {};
																																			qString.clinical_impression_id = clinicalImpression.id;
																																			seedPhoenixFHIR.path.GET = {
																																				"ClinicalImpressionActionProcedure" : {
																																					"location": "%(apikey)s/ClinicalImpressionActionProcedure",
																																					"query": qString
																																				}
																																			}

																																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																			ApiFHIR.get('ClinicalImpressionActionProcedure', {"apikey": apikey}, {}, function(error, response, body){
																																				clinicalImpressionActionProcedure = JSON.parse(body);
																																				if(clinicalImpressionActionProcedure.err_code == 0){
																																					var objectClinicalImpression = {};
																																					objectClinicalImpression.resourceType = clinicalImpression.resourceType;
																																					objectClinicalImpression.id = clinicalImpression.id;
																																					objectClinicalImpression.identifier = clinicalImpression.identifier;
																																					objectClinicalImpression.status = clinicalImpression.status;
																																					objectClinicalImpression.code = clinicalImpression.code;
																																					objectClinicalImpression.description = clinicalImpression.description;
																																					objectClinicalImpression.subject = clinicalImpression.subject;
																																					objectClinicalImpression.context = clinicalImpression.context;
																																					objectClinicalImpression.effective = clinicalImpression.effective;
																																					objectClinicalImpression.date = clinicalImpression.date;
																																					objectClinicalImpression.assessor = clinicalImpression.assessor;
																																					objectClinicalImpression.previous = clinicalImpression.previous;
																																					objectClinicalImpression.problem = clinicalImpression.problem;
																																					objectClinicalImpression.investigation = clinicalImpression.investigation;
																																					objectClinicalImpression.protocol = clinicalImpression.protocol;
																																					objectClinicalImpression.summary = clinicalImpression.summary;
																																					objectClinicalImpression.finding = clinicalImpression.finding;
																																					objectClinicalImpression.prognosisCodeableConcept = clinicalImpression.prognosisCodeableConcept;
																																					objectClinicalImpression.prognosisReference	 = clinicalImpression.prognosisReference;
																																					var Action = {};
																																					Action.referralRequest = clinicalImpression.action.referralRequest;
																																					Action.procedureRequest = clinicalImpression.action.procedureRequest;
																																					Action.procedure = clinicalImpressionActionProcedure.data;
																																					objectClinicalImpression.action = Action;
																																					objectClinicalImpression.note = clinicalImpression.note;

																																					newClinicalImpression[index] = objectClinicalImpression;

																																					myEmitter.once('getClinicalImpressionActionMedicationRequest', function(clinicalImpression, index, newClinicalImpression, countClinicalImpression){
																																						qString = {};
																																						qString.clinical_impression_id = clinicalImpression.id;
																																						seedPhoenixFHIR.path.GET = {
																																							"ClinicalImpressionActionMedicationRequest" : {
																																								"location": "%(apikey)s/ClinicalImpressionActionMedicationRequest",
																																								"query": qString
																																							}
																																						}

																																						var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																						ApiFHIR.get('ClinicalImpressionActionMedicationRequest', {"apikey": apikey}, {}, function(error, response, body){
																																							clinicalImpressionActionMedicationRequest = JSON.parse(body);
																																							if(clinicalImpressionActionMedicationRequest.err_code == 0){
																																								var objectClinicalImpression = {};
																																								objectClinicalImpression.resourceType = clinicalImpression.resourceType;
																																								objectClinicalImpression.id = clinicalImpression.id;
																																								objectClinicalImpression.identifier = clinicalImpression.identifier;
																																								objectClinicalImpression.status = clinicalImpression.status;
																																								objectClinicalImpression.code = clinicalImpression.code;
																																								objectClinicalImpression.description = clinicalImpression.description;
																																								objectClinicalImpression.subject = clinicalImpression.subject;
																																								objectClinicalImpression.context = clinicalImpression.context;
																																								objectClinicalImpression.effective = clinicalImpression.effective;
																																								objectClinicalImpression.date = clinicalImpression.date;
																																								objectClinicalImpression.assessor = clinicalImpression.assessor;
																																								objectClinicalImpression.previous = clinicalImpression.previous;
																																								objectClinicalImpression.problem = clinicalImpression.problem;
																																								objectClinicalImpression.investigation = clinicalImpression.investigation;
																																								objectClinicalImpression.protocol = clinicalImpression.protocol;
																																								objectClinicalImpression.summary = clinicalImpression.summary;
																																								objectClinicalImpression.finding = clinicalImpression.finding;
																																								objectClinicalImpression.prognosisCodeableConcept = clinicalImpression.prognosisCodeableConcept;
																																								objectClinicalImpression.prognosisReference	 = clinicalImpression.prognosisReference;
																																								var Action = {};
																																								Action.referralRequest = clinicalImpression.action.referralRequest;
																																								Action.procedureRequest = clinicalImpression.action.procedureRequest;
																																								Action.procedure = clinicalImpression.action.procedure;
																																								Action.medicationRequest = clinicalImpressionActionMedicationRequest.data;
																																								objectClinicalImpression.action = Action;
																																								objectClinicalImpression.note = clinicalImpression.note;

																																								newClinicalImpression[index] = objectClinicalImpression;

																																								myEmitter.once('getClinicalImpressionActionAppointment', function(clinicalImpression, index, newClinicalImpression, countClinicalImpression){
																																									qString = {};
																																									qString.clinical_impression_id = clinicalImpression.id;
																																									seedPhoenixFHIR.path.GET = {
																																										"ClinicalImpressionActionAppointment" : {
																																											"location": "%(apikey)s/ClinicalImpressionActionAppointment",
																																											"query": qString
																																										}
																																									}

																																									var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																									ApiFHIR.get('ClinicalImpressionActionAppointment', {"apikey": apikey}, {}, function(error, response, body){
																																										clinicalImpressionActionAppointment = JSON.parse(body);
																																										if(clinicalImpressionActionAppointment.err_code == 0){
																																											var objectClinicalImpression = {};
																																											objectClinicalImpression.resourceType = clinicalImpression.resourceType;
																																											objectClinicalImpression.id = clinicalImpression.id;
																																											objectClinicalImpression.identifier = clinicalImpression.identifier;
																																											objectClinicalImpression.status = clinicalImpression.status;
																																											objectClinicalImpression.code = clinicalImpression.code;
																																											objectClinicalImpression.description = clinicalImpression.description;
																																											objectClinicalImpression.subject = clinicalImpression.subject;
																																											objectClinicalImpression.context = clinicalImpression.context;
																																											objectClinicalImpression.effective = clinicalImpression.effective;
																																											objectClinicalImpression.date = clinicalImpression.date;
																																											objectClinicalImpression.assessor = clinicalImpression.assessor;
																																											objectClinicalImpression.previous = clinicalImpression.previous;
																																											objectClinicalImpression.problem = clinicalImpression.problem;
																																											objectClinicalImpression.investigation = clinicalImpression.investigation;
																																											objectClinicalImpression.protocol = clinicalImpression.protocol;
																																											objectClinicalImpression.summary = clinicalImpression.summary;
																																											objectClinicalImpression.finding = clinicalImpression.finding;
																																											objectClinicalImpression.prognosisCodeableConcept = clinicalImpression.prognosisCodeableConcept;
																																											objectClinicalImpression.prognosisReference	 = clinicalImpression.prognosisReference;
																																											var Action = {};
																																											Action.referralRequest = clinicalImpression.action.referralRequest;
																																											Action.procedureRequest = clinicalImpression.action.procedureRequest;
																																											Action.procedure = clinicalImpression.action.procedure;
																																											Action.medicationRequest = clinicalImpression.action.medicationRequest;
																																											Action.appointment = clinicalImpressionActionAppointment.data;
																																											objectClinicalImpression.action = Action;
																																											objectClinicalImpression.note = clinicalImpression.note;

																																											newClinicalImpression[index] = objectClinicalImpression;

																																											if(index == countClinicalImpression -1 ){
																																												res.json({"err_code": 0, "data":newClinicalImpression});
																																											}	
																																										}else{
																																											res.json(clinicalImpressionActionAppointment);			
																																										}
																																									})
																																								})
																																								myEmitter.emit('getClinicalImpressionActionAppointment', objectClinicalImpression, index, newClinicalImpression, countClinicalImpression);																								
																																							}else{
																																								res.json(clinicalImpressionActionMedicationRequest);			
																																							}
																																						})
																																					})
																																					myEmitter.emit('getClinicalImpressionActionMedicationRequest', objectClinicalImpression, index, newClinicalImpression, countClinicalImpression);																								
																																				}else{
																																					res.json(clinicalImpressionActionProcedure);			
																																				}
																																			})
																																		})
																																		myEmitter.emit('getClinicalImpressionActionProcedure', objectClinicalImpression, index, newClinicalImpression, countClinicalImpression);																							
																																	}else{
																																		res.json(clinicalImpressionActionProcedureRequest);			
																																	}
																																})
																															})
																															myEmitter.emit('getClinicalImpressionActionProcedureRequest', objectClinicalImpression, index, newClinicalImpression, countClinicalImpression);																							
																														}else{
																															res.json(clinicalImpressionActionReferralRequest);			
																														}
																													})
																												})
																												myEmitter.emit('getClinicalImpressionActionReferralRequest', objectClinicalImpression, index, newClinicalImpression, countClinicalImpression);																						
																											}else{
																												res.json(clinicalImpressionPrognosisReference);			
																											}
																										})
																									})
																									myEmitter.emit('getClinicalImpressionPrognosisReference', objectClinicalImpression, index, newClinicalImpression, countClinicalImpression);																					
																								}else{
																									res.json(clinicalImpressionProblemAllergyIntolerance);			
																								}
																							})
																						})
																						myEmitter.emit('getClinicalImpressionProblemAllergyIntolerance', objectClinicalImpression, index, newClinicalImpression, countClinicalImpression);																				
																					}else{
																						res.json(clinicalImpressionProblemCondition);			
																					}
																				})
																			})
																			myEmitter.emit('getClinicalImpressionProblemCondition', objectClinicalImpression, index, newClinicalImpression, countClinicalImpression);																			
																		}else{
																			res.json(clinicalImpressionFinding);			
																		}
																	})
																})
																myEmitter.emit('getClinicalImpressionFinding', objectClinicalImpression, index, newClinicalImpression, countClinicalImpression);
															}else{
																res.json(annotation);			
															}
														})
													})
													myEmitter.emit('getNote', objectClinicalImpression, index, newClinicalImpression, countClinicalImpression);
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", clinicalImpression.data[i], i, newClinicalImpression, clinicalImpression.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Clinical Impression is empty."});	
								}
							}else{
								res.json(clinicalImpression);
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
					var clinicalImpressionId = req.params.clinical_impression_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "CLINICAL_IMPRESSION_ID|" + clinicalImpressionId, 'CLINICAL_IMPRESSION', function(resClinicalImpressionID){
								if(resClinicalImpressionID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.clinical_impression_id = clinicalImpressionId;
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
						  			qString.clinical_impression_id = clinicalImpressionId;
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
									res.json({"err_code": 501, "err_msg": "Clinical Impression Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		clinicalImpressionInvestigation: function getClinicalImpressionInvestigation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var clinicalImpressionId = req.params.clinical_impression_id;
			var clinicalImpressionInvestigationId = req.params.clinical_impression_investigation_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "CLINICAL_IMPRESSION_ID|" + clinicalImpressionId, 'CLINICAL_IMPRESSION', function(resClinicalImpression){
						if(resClinicalImpression.err_code > 0){
							if(typeof clinicalImpressionInvestigationId !== 'undefined' && !validator.isEmpty(clinicalImpressionInvestigationId)){
								checkUniqeValue(apikey, "INVESTIGATION_ID|" + clinicalImpressionInvestigationId, 'CLINICAL_IMPRESSION_INVESTIGATION', function(resClinicalImpressionInvestigationID){
									if(resClinicalImpressionInvestigationID.err_code > 0){
										//get clinicalImpressionInvestigation
										qString = {};
										qString.clinical_impression_id = clinicalImpressionId;
										qString._id = clinicalImpressionInvestigationId;
										seedPhoenixFHIR.path.GET = {
											"ClinicalImpressionInvestigation" : {
												"location": "%(apikey)s/ClinicalImpressionInvestigation",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ClinicalImpressionInvestigation', {"apikey": apikey}, {}, function(error, response, body){
											clinicalImpressionInvestigation = JSON.parse(body);
											if(clinicalImpressionInvestigation.err_code == 0){
												//res.json({"err_code": 0, "data":clinicalImpressionInvestigation.data});	
												if(clinicalImpressionInvestigation.data.length > 0){
													newClinicalImpressionInvestigation = [];
													for(i=0; i < clinicalImpressionInvestigation.data.length; i++){
														myEmitter.once('getClinicalImpressionInvestigationItemObservation', function(clinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation){
															qString = {};
															qString.clinical_impression_investigation_id = clinicalImpressionInvestigation.id;
															seedPhoenixFHIR.path.GET = {
																"ClinicalImpressionInvestigationItemObservation" : {
																	"location": "%(apikey)s/ClinicalImpressionInvestigationItemObservation",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('ClinicalImpressionInvestigationItemObservation', {"apikey": apikey}, {}, function(error, response, body){
																clinicalImpressionInvestigationItemObservation = JSON.parse(body);
																if(clinicalImpressionInvestigationItemObservation.err_code == 0){
																	var objectClinicalImpressionInvestigation = {};
																	objectClinicalImpressionInvestigation.id = clinicalImpressionInvestigation.id;
																	objectClinicalImpressionInvestigation.code = clinicalImpressionInvestigation.code;
																	var Item = {};
																	Item.observation = clinicalImpressionInvestigationItemObservation.data;
																	objectClinicalImpressionInvestigation.item = Item;
																	
																	newClinicalImpressionInvestigation[index] = objectClinicalImpressionInvestigation;

																	myEmitter.once('getClinicalImpressionInvestigationItemQuestionnaireResponse', function(clinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation){
																		qString = {};
																		qString.clinical_impression_investigation_id = clinicalImpressionInvestigation.id;
																		seedPhoenixFHIR.path.GET = {
																			"ClinicalImpressionInvestigationItemQuestionnaireResponse" : {
																				"location": "%(apikey)s/ClinicalImpressionInvestigationItemQuestionnaireResponse",
																				"query": qString
																			}
																		}

																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																		ApiFHIR.get('ClinicalImpressionInvestigationItemQuestionnaireResponse', {"apikey": apikey}, {}, function(error, response, body){
																			clinicalImpressionInvestigationItemQuestionnaireResponse = JSON.parse(body);
																			if(clinicalImpressionInvestigationItemQuestionnaireResponse.err_code == 0){
																				var objectClinicalImpressionInvestigation = {};
																				objectClinicalImpressionInvestigation.id = clinicalImpressionInvestigation.id;
																				objectClinicalImpressionInvestigation.code = clinicalImpressionInvestigation.code;
																				var Item = {};
																				Item.observation = clinicalImpressionInvestigation.item.observation;
																				Item.questionnaireResponse = clinicalImpressionInvestigationItemQuestionnaireResponse.data;
																				objectClinicalImpressionInvestigation.item = Item;
																	
																				newClinicalImpressionInvestigation[index] = objectClinicalImpressionInvestigation;

																				myEmitter.once('getClinicalImpressionInvestigationItemFamilyMemberHistory', function(clinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation){
																					qString = {};
																					qString.clinical_impression_investigation_id = clinicalImpressionInvestigation.id;
																					seedPhoenixFHIR.path.GET = {
																						"ClinicalImpressionInvestigationItemFamilyMemberHistory" : {
																							"location": "%(apikey)s/ClinicalImpressionInvestigationItemFamilyMemberHistory",
																							"query": qString
																						}
																					}

																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																					ApiFHIR.get('ClinicalImpressionInvestigationItemFamilyMemberHistory', {"apikey": apikey}, {}, function(error, response, body){
																						clinicalImpressionInvestigationItemFamilyMemberHistory = JSON.parse(body);
																						if(clinicalImpressionInvestigationItemFamilyMemberHistory.err_code == 0){
																							var objectClinicalImpressionInvestigation = {};
																							objectClinicalImpressionInvestigation.id = clinicalImpressionInvestigation.id;
																							objectClinicalImpressionInvestigation.code = clinicalImpressionInvestigation.code;
																							var Item = {};
																							Item.observation = clinicalImpressionInvestigation.item.observation;
																							Item.questionnaireResponse = clinicalImpressionInvestigation.item.questionnaireResponse;
																							Item.familyMemberHistory = clinicalImpressionInvestigationItemFamilyMemberHistory.data;
																							objectClinicalImpressionInvestigation.item = Item;

																							newClinicalImpressionInvestigation[index] = objectClinicalImpressionInvestigation;

																							myEmitter.once('getClinicalImpressionInvestigationItemDiagnosticReport', function(clinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation){
																								qString = {};
																								qString.clinical_impression_investigation_id = clinicalImpressionInvestigation.id;
																								seedPhoenixFHIR.path.GET = {
																									"ClinicalImpressionInvestigationItemDiagnosticReport" : {
																										"location": "%(apikey)s/ClinicalImpressionInvestigationItemDiagnosticReport",
																										"query": qString
																									}
																								}

																								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																								ApiFHIR.get('ClinicalImpressionInvestigationItemDiagnosticReport', {"apikey": apikey}, {}, function(error, response, body){
																									clinicalImpressionInvestigationItemDiagnosticReport = JSON.parse(body);
																									if(clinicalImpressionInvestigationItemDiagnosticReport.err_code == 0){
																										var objectClinicalImpressionInvestigation = {};
																										objectClinicalImpressionInvestigation.id = clinicalImpressionInvestigation.id;
																										objectClinicalImpressionInvestigation.code = clinicalImpressionInvestigation.code;
																										var Item = {};
																										Item.observation = clinicalImpressionInvestigation.item.observation;
																										Item.questionnaireResponse = clinicalImpressionInvestigation.item.questionnaireResponse;
																										Item.familyMemberHistory = clinicalImpressionInvestigation.item.familyMemberHistory;
																										Item.diagnosticReport = clinicalImpressionInvestigationItemDiagnosticReport.data;
																										objectClinicalImpressionInvestigation.item = Item;

																										newClinicalImpressionInvestigation[index] = objectClinicalImpressionInvestigation;

																										myEmitter.once('getClinicalImpressionInvestigationItemRiskAssessment', function(clinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation){
																											qString = {};
																											qString.clinical_impression_investigation_id = clinicalImpressionInvestigation.id;
																											seedPhoenixFHIR.path.GET = {
																												"ClinicalImpressionInvestigationItemRiskAssessment" : {
																													"location": "%(apikey)s/ClinicalImpressionInvestigationItemRiskAssessment",
																													"query": qString
																												}
																											}

																											var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																											ApiFHIR.get('ClinicalImpressionInvestigationItemRiskAssessment', {"apikey": apikey}, {}, function(error, response, body){
																												clinicalImpressionInvestigationItemRiskAssessment = JSON.parse(body);
																												if(clinicalImpressionInvestigationItemRiskAssessment.err_code == 0){
																													var objectClinicalImpressionInvestigation = {};
																													objectClinicalImpressionInvestigation.id = clinicalImpressionInvestigation.id;
																													objectClinicalImpressionInvestigation.code = clinicalImpressionInvestigation.code;
																													var Item = {};
																													Item.observation = clinicalImpressionInvestigation.item.observation;
																													Item.questionnaireResponse = clinicalImpressionInvestigation.item.questionnaireResponse;
																													Item.familyMemberHistory = clinicalImpressionInvestigation.item.familyMemberHistory;
																													Item.diagnosticReport = clinicalImpressionInvestigation.item.diagnosticReport;
																													Item.riskAssessment = clinicalImpressionInvestigationItemRiskAssessment.data;
																													objectClinicalImpressionInvestigation.item = Item;

																													newClinicalImpressionInvestigation[index] = objectClinicalImpressionInvestigation;

																													myEmitter.once('getClinicalImpressionInvestigationItemImagingStudy', function(clinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation){
																														qString = {};
																														qString.clinical_impression_investigation_id = clinicalImpressionInvestigation.id;
																														seedPhoenixFHIR.path.GET = {
																															"ClinicalImpressionInvestigationItemImagingStudy" : {
																																"location": "%(apikey)s/ClinicalImpressionInvestigationItemImagingStudy",
																																"query": qString
																															}
																														}

																														var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																														ApiFHIR.get('ClinicalImpressionInvestigationItemImagingStudy', {"apikey": apikey}, {}, function(error, response, body){
																															clinicalImpressionInvestigationItemImagingStudy = JSON.parse(body);
																															if(clinicalImpressionInvestigationItemImagingStudy.err_code == 0){
																																var objectClinicalImpressionInvestigation = {};
																																objectClinicalImpressionInvestigation.id = clinicalImpressionInvestigation.id;
																																objectClinicalImpressionInvestigation.code = clinicalImpressionInvestigation.code;
																																var Item = {};
																																Item.observation = clinicalImpressionInvestigation.item.observation;
																																Item.questionnaireResponse = clinicalImpressionInvestigation.item.questionnaireResponse;
																																Item.familyMemberHistory = clinicalImpressionInvestigation.item.familyMemberHistory;
																																Item.diagnosticReport = clinicalImpressionInvestigation.item.diagnosticReport;
																																Item.riskAssessment = clinicalImpressionInvestigation.item.riskAssessment;
																																Item.imagingStudy = clinicalImpressionInvestigationItemImagingStudy.data;
																																objectClinicalImpressionInvestigation.item = Item;

																																newClinicalImpressionInvestigation[index] = objectClinicalImpressionInvestigation;

																																if(index == countClinicalImpressionInvestigation -1 ){
																																	res.json({"err_code": 0, "data":newClinicalImpressionInvestigation});	
																																}
																															}else{
																																res.json(clinicalImpressionInvestigationItemImagingStudy);			
																															}
																														})
																													})
																													myEmitter.emit('getClinicalImpressionInvestigationItemImagingStudy', objectClinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation);																	
																												}else{
																													res.json(clinicalImpressionInvestigationItemRiskAssessment);			
																												}
																											})
																										})
																										myEmitter.emit('getClinicalImpressionInvestigationItemRiskAssessment', objectClinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation);																	
																									}else{
																										res.json(clinicalImpressionInvestigationItemDiagnosticReport);			
																									}
																								})
																							})
																							myEmitter.emit('getClinicalImpressionInvestigationItemDiagnosticReport', objectClinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation);																	
																						}else{
																							res.json(clinicalImpressionInvestigationItemFamilyMemberHistory);			
																						}
																					})
																				})
																				myEmitter.emit('getClinicalImpressionInvestigationItemFamilyMemberHistory', objectClinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation);																	
																			}else{
																				res.json(clinicalImpressionInvestigationItemQuestionnaireResponse);			
																			}
																		})
																	})
																	myEmitter.emit('getClinicalImpressionInvestigationItemQuestionnaireResponse', objectClinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation);																	
																}else{
																	res.json(clinicalImpressionInvestigationItemObservation);			
																}
															})
														})
														myEmitter.emit('getClinicalImpressionInvestigationItemObservation', clinicalImpressionInvestigation.data[i], i, newClinicalImpressionInvestigation, clinicalImpressionInvestigation.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "clinical impression investigation is empty."});	
												}
											}else{
												res.json(clinicalImpressionInvestigation);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Clinical Impression Investigation Id not found"});		
									}
								})
							}else{
								//get clinicalImpressionInvestigation
								qString = {};
								qString.clinical_impression_id = clinicalImpressionId;
								seedPhoenixFHIR.path.GET = {
									"ClinicalImpressionInvestigation" : {
										"location": "%(apikey)s/ClinicalImpressionInvestigation",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ClinicalImpressionInvestigation', {"apikey": apikey}, {}, function(error, response, body){
									clinicalImpressionInvestigation = JSON.parse(body);
									if(clinicalImpressionInvestigation.err_code == 0){
										//res.json({"err_code": 0, "data":clinicalImpressionInvestigation.data});	
										if(clinicalImpressionInvestigation.data.length > 0){
											newClinicalImpressionInvestigation = [];
											for(i=0; i < clinicalImpressionInvestigation.data.length; i++){
												myEmitter.once('getClinicalImpressionInvestigationItemObservation', function(clinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation){
													qString = {};
													qString.clinical_impression_investigation_id = clinicalImpressionInvestigation.id;
													seedPhoenixFHIR.path.GET = {
														"ClinicalImpressionInvestigationItemObservation" : {
															"location": "%(apikey)s/ClinicalImpressionInvestigationItemObservation",
															"query": qString
														}
													}

													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

													ApiFHIR.get('ClinicalImpressionInvestigationItemObservation', {"apikey": apikey}, {}, function(error, response, body){
														clinicalImpressionInvestigationItemObservation = JSON.parse(body);
														if(clinicalImpressionInvestigationItemObservation.err_code == 0){
															var objectClinicalImpressionInvestigation = {};
															objectClinicalImpressionInvestigation.id = clinicalImpressionInvestigation.id;
															objectClinicalImpressionInvestigation.code = clinicalImpressionInvestigation.code;
															var Item = {};
															Item.observation = clinicalImpressionInvestigationItemObservation.data;
															objectClinicalImpressionInvestigation.item = Item;

															newClinicalImpressionInvestigation[index] = objectClinicalImpressionInvestigation;

															myEmitter.once('getClinicalImpressionInvestigationItemQuestionnaireResponse', function(clinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation){
																qString = {};
																qString.clinical_impression_investigation_id = clinicalImpressionInvestigation.id;
																seedPhoenixFHIR.path.GET = {
																	"ClinicalImpressionInvestigationItemQuestionnaireResponse" : {
																		"location": "%(apikey)s/ClinicalImpressionInvestigationItemQuestionnaireResponse",
																		"query": qString
																	}
																}

																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																ApiFHIR.get('ClinicalImpressionInvestigationItemQuestionnaireResponse', {"apikey": apikey}, {}, function(error, response, body){
																	clinicalImpressionInvestigationItemQuestionnaireResponse = JSON.parse(body);
																	if(clinicalImpressionInvestigationItemQuestionnaireResponse.err_code == 0){
																		var objectClinicalImpressionInvestigation = {};
																		objectClinicalImpressionInvestigation.id = clinicalImpressionInvestigation.id;
																		objectClinicalImpressionInvestigation.code = clinicalImpressionInvestigation.code;
																		var Item = {};
																		Item.observation = clinicalImpressionInvestigation.item.observation;
																		Item.questionnaireResponse = clinicalImpressionInvestigationItemQuestionnaireResponse.data;
																		objectClinicalImpressionInvestigation.item = Item;

																		newClinicalImpressionInvestigation[index] = objectClinicalImpressionInvestigation;

																		myEmitter.once('getClinicalImpressionInvestigationItemFamilyMemberHistory', function(clinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation){
																			qString = {};
																			qString.clinical_impression_investigation_id = clinicalImpressionInvestigation.id;
																			seedPhoenixFHIR.path.GET = {
																				"ClinicalImpressionInvestigationItemFamilyMemberHistory" : {
																					"location": "%(apikey)s/ClinicalImpressionInvestigationItemFamilyMemberHistory",
																					"query": qString
																				}
																			}

																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																			ApiFHIR.get('ClinicalImpressionInvestigationItemFamilyMemberHistory', {"apikey": apikey}, {}, function(error, response, body){
																				clinicalImpressionInvestigationItemFamilyMemberHistory = JSON.parse(body);
																				if(clinicalImpressionInvestigationItemFamilyMemberHistory.err_code == 0){
																					var objectClinicalImpressionInvestigation = {};
																					objectClinicalImpressionInvestigation.id = clinicalImpressionInvestigation.id;
																					objectClinicalImpressionInvestigation.code = clinicalImpressionInvestigation.code;
																					var Item = {};
																					Item.observation = clinicalImpressionInvestigation.item.observation;
																					Item.questionnaireResponse = clinicalImpressionInvestigation.item.questionnaireResponse;
																					Item.familyMemberHistory = clinicalImpressionInvestigationItemFamilyMemberHistory.data;
																					objectClinicalImpressionInvestigation.item = Item;

																					newClinicalImpressionInvestigation[index] = objectClinicalImpressionInvestigation;

																					myEmitter.once('getClinicalImpressionInvestigationItemDiagnosticReport', function(clinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation){
																						qString = {};
																						qString.clinical_impression_investigation_id = clinicalImpressionInvestigation.id;
																						seedPhoenixFHIR.path.GET = {
																							"ClinicalImpressionInvestigationItemDiagnosticReport" : {
																								"location": "%(apikey)s/ClinicalImpressionInvestigationItemDiagnosticReport",
																								"query": qString
																							}
																						}

																						var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																						ApiFHIR.get('ClinicalImpressionInvestigationItemDiagnosticReport', {"apikey": apikey}, {}, function(error, response, body){
																							clinicalImpressionInvestigationItemDiagnosticReport = JSON.parse(body);
																							if(clinicalImpressionInvestigationItemDiagnosticReport.err_code == 0){
																								var objectClinicalImpressionInvestigation = {};
																								objectClinicalImpressionInvestigation.id = clinicalImpressionInvestigation.id;
																								objectClinicalImpressionInvestigation.code = clinicalImpressionInvestigation.code;
																								var Item = {};
																								Item.observation = clinicalImpressionInvestigation.item.observation;
																								Item.questionnaireResponse = clinicalImpressionInvestigation.item.questionnaireResponse;
																								Item.familyMemberHistory = clinicalImpressionInvestigation.item.familyMemberHistory;
																								Item.diagnosticReport = clinicalImpressionInvestigationItemDiagnosticReport.data;
																								objectClinicalImpressionInvestigation.item = Item;

																								newClinicalImpressionInvestigation[index] = objectClinicalImpressionInvestigation;

																								myEmitter.once('getClinicalImpressionInvestigationItemRiskAssessment', function(clinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation){
																									qString = {};
																									qString.clinical_impression_investigation_id = clinicalImpressionInvestigation.id;
																									seedPhoenixFHIR.path.GET = {
																										"ClinicalImpressionInvestigationItemRiskAssessment" : {
																											"location": "%(apikey)s/ClinicalImpressionInvestigationItemRiskAssessment",
																											"query": qString
																										}
																									}

																									var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																									ApiFHIR.get('ClinicalImpressionInvestigationItemRiskAssessment', {"apikey": apikey}, {}, function(error, response, body){
																										clinicalImpressionInvestigationItemRiskAssessment = JSON.parse(body);
																										if(clinicalImpressionInvestigationItemRiskAssessment.err_code == 0){
																											var objectClinicalImpressionInvestigation = {};
																											objectClinicalImpressionInvestigation.id = clinicalImpressionInvestigation.id;
																											objectClinicalImpressionInvestigation.code = clinicalImpressionInvestigation.code;
																											var Item = {};
																											Item.observation = clinicalImpressionInvestigation.item.observation;
																											Item.questionnaireResponse = clinicalImpressionInvestigation.item.questionnaireResponse;
																											Item.familyMemberHistory = clinicalImpressionInvestigation.item.familyMemberHistory;
																											Item.diagnosticReport = clinicalImpressionInvestigation.item.diagnosticReport;
																											Item.riskAssessment = clinicalImpressionInvestigationItemRiskAssessment.data;
																											objectClinicalImpressionInvestigation.item = Item;

																											newClinicalImpressionInvestigation[index] = objectClinicalImpressionInvestigation;

																											myEmitter.once('getClinicalImpressionInvestigationItemImagingStudy', function(clinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation){
																												qString = {};
																												qString.clinical_impression_investigation_id = clinicalImpressionInvestigation.id;
																												seedPhoenixFHIR.path.GET = {
																													"ClinicalImpressionInvestigationItemImagingStudy" : {
																														"location": "%(apikey)s/ClinicalImpressionInvestigationItemImagingStudy",
																														"query": qString
																													}
																												}

																												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																												ApiFHIR.get('ClinicalImpressionInvestigationItemImagingStudy', {"apikey": apikey}, {}, function(error, response, body){
																													clinicalImpressionInvestigationItemImagingStudy = JSON.parse(body);
																													if(clinicalImpressionInvestigationItemImagingStudy.err_code == 0){
																														var objectClinicalImpressionInvestigation = {};
																														objectClinicalImpressionInvestigation.id = clinicalImpressionInvestigation.id;
																														objectClinicalImpressionInvestigation.code = clinicalImpressionInvestigation.code;
																														var Item = {};
																														Item.observation = clinicalImpressionInvestigation.item.observation;
																														Item.questionnaireResponse = clinicalImpressionInvestigation.item.questionnaireResponse;
																														Item.familyMemberHistory = clinicalImpressionInvestigation.item.familyMemberHistory;
																														Item.diagnosticReport = clinicalImpressionInvestigation.item.diagnosticReport;
																														Item.riskAssessment = clinicalImpressionInvestigation.item.riskAssessment;
																														Item.imagingStudy = clinicalImpressionInvestigationItemImagingStudy.data;
																														objectClinicalImpressionInvestigation.item = Item;

																														newClinicalImpressionInvestigation[index] = objectClinicalImpressionInvestigation;

																														if(index == countClinicalImpressionInvestigation -1 ){
																															res.json({"err_code": 0, "data":newClinicalImpressionInvestigation});	
																														}
																													}else{
																														res.json(clinicalImpressionInvestigationItemImagingStudy);			
																													}
																												})
																											})
																											myEmitter.emit('getClinicalImpressionInvestigationItemImagingStudy', objectClinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation);																	
																										}else{
																											res.json(clinicalImpressionInvestigationItemRiskAssessment);			
																										}
																									})
																								})
																								myEmitter.emit('getClinicalImpressionInvestigationItemRiskAssessment', objectClinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation);																	
																							}else{
																								res.json(clinicalImpressionInvestigationItemDiagnosticReport);			
																							}
																						})
																					})
																					myEmitter.emit('getClinicalImpressionInvestigationItemDiagnosticReport', objectClinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation);																	
																				}else{
																					res.json(clinicalImpressionInvestigationItemFamilyMemberHistory);			
																				}
																			})
																		})
																		myEmitter.emit('getClinicalImpressionInvestigationItemFamilyMemberHistory', objectClinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation);																	
																	}else{
																		res.json(clinicalImpressionInvestigationItemQuestionnaireResponse);			
																	}
																})
															})
															myEmitter.emit('getClinicalImpressionInvestigationItemQuestionnaireResponse', objectClinicalImpressionInvestigation, index, newClinicalImpressionInvestigation, countClinicalImpressionInvestigation);																	
														}else{
															res.json(clinicalImpressionInvestigationItemObservation);			
														}
													})
												})
												myEmitter.emit('getClinicalImpressionInvestigationItemObservation', clinicalImpressionInvestigation.data[i], i, newClinicalImpressionInvestigation, clinicalImpressionInvestigation.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "clinical impression investigation is empty."});	
										}
									}else{
										res.json(clinicalImpressionInvestigation);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Clinical Impression  Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		clinicalImpressionFinding: function getClinicalImpressionFinding(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var clinicalImpressionId = req.params.clinical_impression_id;
			var clinicalImpressionFindingId = req.params.clinical_impression_finding_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "CLINICAL_IMPRESSION_ID|" + clinicalImpressionId, 'CLINICAL_IMPRESSION', function(resClinicalImpression){
						if(resClinicalImpression.err_code > 0){
							if(typeof clinicalImpressionFindingId !== 'undefined' && !validator.isEmpty(clinicalImpressionFindingId)){
								checkUniqeValue(apikey, "FINDING_ID|" + clinicalImpressionFindingId, 'CLINICAL_IMPRESSION_FINDING', function(resClinicalImpressionFindingID){
									if(resClinicalImpressionFindingID.err_code > 0){
										//get clinicalImpressionFinding
										qString = {};
										qString.clinical_impression_id = clinicalImpressionId;
										qString._id = clinicalImpressionFindingId;
										seedPhoenixFHIR.path.GET = {
											"ClinicalImpressionFinding" : {
												"location": "%(apikey)s/ClinicalImpressionFinding",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ClinicalImpressionFinding', {"apikey": apikey}, {}, function(error, response, body){
											clinicalImpressionFinding = JSON.parse(body);
											if(clinicalImpressionFinding.err_code == 0){
												res.json({"err_code": 0, "data":clinicalImpressionFinding.data});	
											}else{
												res.json(clinicalImpressionFinding);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Clinical Impression Finding Id not found"});		
									}
								})
							}else{
								//get clinicalImpressionFinding
								qString = {};
								qString.clinical_impression_id = clinicalImpressionId;
								seedPhoenixFHIR.path.GET = {
									"ClinicalImpressionFinding" : {
										"location": "%(apikey)s/ClinicalImpressionFinding",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ClinicalImpressionFinding', {"apikey": apikey}, {}, function(error, response, body){
									clinicalImpressionFinding = JSON.parse(body);
									if(clinicalImpressionFinding.err_code == 0){
										res.json({"err_code": 0, "data":clinicalImpressionFinding.data});	
									}else{
										res.json(clinicalImpressionFinding);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Clinical Impression  Id not found"});		
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
		clinicalImpression : function addClinicalImpression(req, res){
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

/*status|status||nn
code|code||
description|description||
subject.patient|subjectPatient||
subject.group|subjectGroup||
context.encounter|contextEncounter||
context.episodeOfCare|contextEpisodeOfCare||
effective.effectiveDateTime|effectiveEffectiveDateTime|date|
effective.effectivePeriod|effectiveEffectivePeriod|period|
date|date|date|
assessor|assessor||
previous|previous||
problem.condition|problemCondition||
problem.allergyIntolerance|problemAllergyIntolerance||
investigation.code|investigationCode||nn
investigation.item.observation|investigationItemObservation||
investigation.item.questionnaireResponse|investigationItemQuestionnaireResponse||
investigation.item.familyMemberHistory|investigationItemFamilyMemberHistory||
investigation.item.diagnosticReport|investigationItemDiagnosticReport||
investigation.item.riskAssessment|investigationItemRiskAssessment||
investigation.item.imagingStudy|investigationItemImagingStudy||
protocol|protocol||
summary|summary||
finding.item.itemCodeableConcept|findingItemItemCodeableConcept||nn
finding.item.itemReference.condition|findingItemItemReferenceCondition||
finding.item.itemReference.observation|findingItemItemReferenceObservation||
finding.basis|findingBasis||
prognosisCodeableConcept|prognosisCodeableConcept||
prognosisReference|prognosisReference||
action.referralRequest|actionReferralRequest||
action.procedureRequest|actionProcedureRequest||
action.procedure|actionProcedure||
action.medicationRequest|actionMedicationRequest||
action.appointment|actionAppointment||
note.author.authorReference.practitioner|noteAuthorPractitioner||
note.author.authorReference.patient|noteAuthorPatient||
note.author.authorReference.relatedPerson|noteAuthorRelatedPerson||
note.author.authorString|noteAuthorAuthorString||
note.time|noteTime|date|
note.text|noteText||
*/
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Clinical Impression status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Clinical Impression request.";
			}

			if(typeof req.body.code !== 'undefined'){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					code = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Clinical Impression request.";
			}

			if(typeof req.body.description !== 'undefined'){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					description = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json Clinical Impression request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Clinical Impression request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Clinical Impression request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Clinical Impression request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Clinical Impression request.";
			}

			if(typeof req.body.effective.effectiveDateTime !== 'undefined'){
				var effectiveEffectiveDateTime =  req.body.effective.effectiveDateTime;
				if(validator.isEmpty(effectiveEffectiveDateTime)){
					effectiveEffectiveDateTime = "";
				}else{
					if(!regex.test(effectiveEffectiveDateTime)){
						err_code = 2;
						err_msg = "Clinical Impression effective effective date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'effective effective date time' in json Clinical Impression request.";
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
				      err_msg = "Clinical Impression effective effective period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Clinical Impression effective effective period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'effective effective period' in json Clinical Impression request.";
			}

			if(typeof req.body.date !== 'undefined'){
				var date =  req.body.date;
				if(validator.isEmpty(date)){
					date = "";
				}else{
					if(!regex.test(date)){
						err_code = 2;
						err_msg = "Clinical Impression date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'date' in json Clinical Impression request.";
			}

			if(typeof req.body.assessor !== 'undefined'){
				var assessor =  req.body.assessor.trim().toLowerCase();
				if(validator.isEmpty(assessor)){
					assessor = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'assessor' in json Clinical Impression request.";
			}

			if(typeof req.body.previous !== 'undefined'){
				var previous =  req.body.previous.trim().toLowerCase();
				if(validator.isEmpty(previous)){
					previous = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'previous' in json Clinical Impression request.";
			}

			if(typeof req.body.problem.condition !== 'undefined'){
				var problemCondition =  req.body.problem.condition.trim().toLowerCase();
				if(validator.isEmpty(problemCondition)){
					problemCondition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'problem condition' in json Clinical Impression request.";
			}

			if(typeof req.body.problem.allergyIntolerance !== 'undefined'){
				var problemAllergyIntolerance =  req.body.problem.allergyIntolerance.trim().toLowerCase();
				if(validator.isEmpty(problemAllergyIntolerance)){
					problemAllergyIntolerance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'problem allergy intolerance' in json Clinical Impression request.";
			}

			if(typeof req.body.investigation.code !== 'undefined'){
				var investigationCode =  req.body.investigation.code.trim().toLowerCase();
				if(validator.isEmpty(investigationCode)){
					err_code = 2;
					err_msg = "Clinical Impression investigation code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'investigation code' in json Clinical Impression request.";
			}

			if(typeof req.body.investigation.item.observation !== 'undefined'){
				var investigationItemObservation =  req.body.investigation.item.observation.trim().toLowerCase();
				if(validator.isEmpty(investigationItemObservation)){
					investigationItemObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'investigation item observation' in json Clinical Impression request.";
			}

			if(typeof req.body.investigation.item.questionnaireResponse !== 'undefined'){
				var investigationItemQuestionnaireResponse =  req.body.investigation.item.questionnaireResponse.trim().toLowerCase();
				if(validator.isEmpty(investigationItemQuestionnaireResponse)){
					investigationItemQuestionnaireResponse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'investigation item questionnaire response' in json Clinical Impression request.";
			}

			if(typeof req.body.investigation.item.familyMemberHistory !== 'undefined'){
				var investigationItemFamilyMemberHistory =  req.body.investigation.item.familyMemberHistory.trim().toLowerCase();
				if(validator.isEmpty(investigationItemFamilyMemberHistory)){
					investigationItemFamilyMemberHistory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'investigation item family member history' in json Clinical Impression request.";
			}

			if(typeof req.body.investigation.item.diagnosticReport !== 'undefined'){
				var investigationItemDiagnosticReport =  req.body.investigation.item.diagnosticReport.trim().toLowerCase();
				if(validator.isEmpty(investigationItemDiagnosticReport)){
					investigationItemDiagnosticReport = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'investigation item diagnostic report' in json Clinical Impression request.";
			}

			if(typeof req.body.investigation.item.riskAssessment !== 'undefined'){
				var investigationItemRiskAssessment =  req.body.investigation.item.riskAssessment.trim().toLowerCase();
				if(validator.isEmpty(investigationItemRiskAssessment)){
					investigationItemRiskAssessment = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'investigation item risk assessment' in json Clinical Impression request.";
			}

			if(typeof req.body.investigation.item.imagingStudy !== 'undefined'){
				var investigationItemImagingStudy =  req.body.investigation.item.imagingStudy.trim().toLowerCase();
				if(validator.isEmpty(investigationItemImagingStudy)){
					investigationItemImagingStudy = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'investigation item imaging study' in json Clinical Impression request.";
			}

			if(typeof req.body.protocol !== 'undefined'){
				var protocol =  req.body.protocol.trim().toLowerCase();
				if(validator.isEmpty(protocol)){
					protocol = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'protocol' in json Clinical Impression request.";
			}

			if(typeof req.body.summary !== 'undefined'){
				var summary =  req.body.summary.trim().toLowerCase();
				if(validator.isEmpty(summary)){
					summary = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'summary' in json Clinical Impression request.";
			}

			if(typeof req.body.finding.item.itemCodeableConcept !== 'undefined'){
				var findingItemItemCodeableConcept =  req.body.finding.item.itemCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(findingItemItemCodeableConcept)){
					err_code = 2;
					err_msg = "Clinical Impression finding item item codeable concept is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'finding item item codeable concept' in json Clinical Impression request.";
			}

			if(typeof req.body.finding.item.itemReference.condition !== 'undefined'){
				var findingItemItemReferenceCondition =  req.body.finding.item.itemReference.condition.trim().toLowerCase();
				if(validator.isEmpty(findingItemItemReferenceCondition)){
					findingItemItemReferenceCondition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'finding item item reference condition' in json Clinical Impression request.";
			}

			if(typeof req.body.finding.item.itemReference.observation !== 'undefined'){
				var findingItemItemReferenceObservation =  req.body.finding.item.itemReference.observation.trim().toLowerCase();
				if(validator.isEmpty(findingItemItemReferenceObservation)){
					finding.itemItemReferenceObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'finding item item reference observation' in json Clinical Impression request.";
			}

			if(typeof req.body.finding.basis !== 'undefined'){
				var findingBasis =  req.body.finding.basis.trim().toLowerCase();
				if(validator.isEmpty(findingBasis)){
					findingBasis = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'finding basis' in json Clinical Impression request.";
			}

			if(typeof req.body.prognosisCodeableConcept !== 'undefined'){
				var prognosisCodeableConcept =  req.body.prognosisCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(prognosisCodeableConcept)){
					prognosisCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prognosis codeable concept' in json Clinical Impression request.";
			}

			if(typeof req.body.prognosisReference !== 'undefined'){
				var prognosisReference =  req.body.prognosisReference.trim().toLowerCase();
				if(validator.isEmpty(prognosisReference)){
					prognosisReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prognosis reference' in json Clinical Impression request.";
			}

			if(typeof req.body.action.referralRequest !== 'undefined'){
				var actionReferralRequest =  req.body.action.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(actionReferralRequest)){
					actionReferralRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'action referral request' in json Clinical Impression request.";
			}

			if(typeof req.body.action.procedureRequest !== 'undefined'){
				var actionProcedureRequest =  req.body.action.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(actionProcedureRequest)){
					actionProcedureRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'action procedure request' in json Clinical Impression request.";
			}

			if(typeof req.body.action.procedure !== 'undefined'){
				var actionProcedure =  req.body.action.procedure.trim().toLowerCase();
				if(validator.isEmpty(actionProcedure)){
					actionProcedure = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'action procedure' in json Clinical Impression request.";
			}

			if(typeof req.body.action.medicationRequest !== 'undefined'){
				var actionMedicationRequest =  req.body.action.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(actionMedicationRequest)){
					actionMedicationRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'action medication request' in json Clinical Impression request.";
			}

			if(typeof req.body.action.appointment !== 'undefined'){
				var actionAppointment =  req.body.action.appointment.trim().toLowerCase();
				if(validator.isEmpty(actionAppointment)){
					actionAppointment = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'action appointment' in json Clinical Impression request.";
			}
			
			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					noteAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Clinical Impression request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					noteAuthorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Clinical Impression request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					noteAuthorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Clinical Impression request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Clinical Impression request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Clinical Impression note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Clinical Impression request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note text' in json Clinical Impression request.";
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
														var clinicalImpressionId = 'cim' + unicId;
														var clinicalImpressionInvestigationId = 'cii' + unicId;
														var clinicalImpressionFindingId = 'cif' + unicId;
														var noteId = 'aci' + unicId;

														dataClinicalImpression = {
															"clinical_impression_id" : clinicalImpressionId,
															"status" : status,
															"code" : code,
															"description" : description,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"context_encounter" : contextEncounter,
															"context_episode_of_care" : contextEpisodeOfCare,
															"effective_date_time" : effectiveEffectiveDateTime,
															"effective_period_start" : effectiveEffectivePeriodStart,
															"effective_period_end" : effectiveEffectivePeriodEnd,
															"date" : date,
															"assessor" : assessor,
															"previous" : previous,
															"protocol" : protocol,
															"summary" : summary,
															"prognosis_codeable_concept" : prognosisCodeableConcept
														}
														console.log(dataClinicalImpression);
														ApiFHIR.post('clinicalImpression', {"apikey": apikey}, {body: dataClinicalImpression, json: true}, function(error, response, body){
															clinicalImpression = body;
															if(clinicalImpression.err_code > 0){
																res.json(clinicalImpression);	
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
																							"clinical_impression_id": clinicalImpressionId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														//ClinicalImpressionInvestigation
														dataClinicalImpressionInvestigation = {
															"investigation_id" : clinicalImpressionInvestigationId,
															"code" : investigationCode,
															"clinical_impression_id" : clinicalImpressionId
														}
														ApiFHIR.post('clinicalImpressionInvestigation', {"apikey": apikey}, {body: dataClinicalImpressionInvestigation, json: true}, function(error, response, body){
															clinicalImpressionInvestigation = body;
															if(clinicalImpressionInvestigation.err_code > 0){
																res.json(clinicalImpressionInvestigation);	
																console.log("ok");
															}
														});
														
														//ClinicalImpressionFinding
														dataClinicalImpressionFinding = {
															"finding_id" : clinicalImpressionFindingId,
															"item_codeable_concept" : findingItemItemCodeableConcept,
															"item_reference_condition" : findingItemItemReferenceCondition,
															"item_reference_observation" : findingItemItemReferenceObservation,
															"basis" : findingBasis,
															"clinical_impression_id" : clinicalImpressionId
														}
														ApiFHIR.post('clinicalImpressionFinding', {"apikey": apikey}, {body: dataClinicalImpressionFinding, json: true}, function(error, response, body){
															clinicalImpressionFinding = body;
															if(clinicalImpressionFinding.err_code > 0){
																res.json(clinicalImpressionFinding);	
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
															"clinical_impression_id": clinicalImpressionId
														};
														
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataNoteActivity, json:true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
															} 
														});
														
														
														/*----*/
/*
problem.condition|problemCondition||
problem.allergyIntolerance|problemAllergyIntolerance||
investigation.item.observation|investigationItemObservation||
investigation.item.questionnaireResponse|investigationItemQuestionnaireResponse||
investigation.item.familyMemberHistory|investigationItemFamilyMemberHistory||
investigation.item.diagnosticReport|investigationItemDiagnosticReport||
investigation.item.riskAssessment|investigationItemRiskAssessment||
investigation.item.imagingStudy|investigationItemImagingStudy||
prognosisReference|prognosisReference||
action.referralRequest|actionReferralRequest||
action.procedureRequest|actionProcedureRequest||
action.procedure|actionProcedure||
action.medicationRequest|actionMedicationRequest||
action.appointment|actionAppointment||
*/
														if(problemCondition !== ""){
															dataProblemCondition = {
																"_id" : problemCondition,
																"clinical_impression_id" : clinicalImpressionId
															}
															ApiFHIR.put('condition', {"apikey": apikey, "_id": problemCondition}, {body: dataProblemCondition, json: true}, function(error, response, body){
																returnProblemCondition = body;
																if(returnProblemCondition.err_code > 0){
																	res.json(returnProblemCondition);	
																	console.log("add reference Problem condition : " + problemCondition);
																}
															});
														}
														
														if(problemAllergyIntolerance !== ""){
															dataProblemAllergyIntolerance = {
																"_id" : problemAllergyIntolerance,
																"clinical_impression_id" : clinicalImpressionId
															}
															ApiFHIR.put('allergyIntolerance', {"apikey": apikey, "_id": problemAllergyIntolerance}, {body: dataProblemAllergyIntolerance, json: true}, function(error, response, body){
																returnProblemAllergyIntolerance = body;
																if(returnProblemAllergyIntolerance.err_code > 0){
																	res.json(returnProblemAllergyIntolerance);	
																	console.log("add reference Problem allergy intolerance : " + problemAllergyIntolerance);
																}
															});
														}
														
														if(investigationItemObservation !== ""){
															dataInvestigationItemObservation = {
																"_id" : investigationItemObservation,
																"clinical_impression_investigation_id" : clinicalImpressionId
															}
															ApiFHIR.put('observation', {"apikey": apikey, "_id": investigationItemObservation}, {body: dataInvestigationItemObservation, json: true}, function(error, response, body){
																returnInvestigationItemObservation = body;
																if(returnInvestigationItemObservation.err_code > 0){
																	res.json(returnInvestigationItemObservation);	
																	console.log("add reference Investigation item observation : " + investigationItemObservation);
																}
															});
														}
														
														if(investigationItemQuestionnaireResponse !== ""){
															dataInvestigationItemQuestionnaireResponse = {
																"_id" : investigationItemQuestionnaireResponse,
																"clinical_impression_id" : clinicalImpressionId
															}
															ApiFHIR.put('questionnaireResponse', {"apikey": apikey, "_id": investigationItemQuestionnaireResponse}, {body: dataInvestigationItemQuestionnaireResponse, json: true}, function(error, response, body){
																returnInvestigationItemQuestionnaireResponse = body;
																if(returnInvestigationItemQuestionnaireResponse.err_code > 0){
																	res.json(returnInvestigationItemQuestionnaireResponse);	
																	console.log("add reference Investigation item questionnaire response : " + investigationItemQuestionnaireResponse);
																}
															});
														}
														
														if(investigationItemFamilyMemberHistory !== ""){
															dataInvestigationItemFamilyMemberHistory = {
																"_id" : investigationItemFamilyMemberHistory,
																"clinical_impression_id" : clinicalImpressionId
															}
															ApiFHIR.put('familyMemberHistory', {"apikey": apikey, "_id": investigationItemFamilyMemberHistory}, {body: dataInvestigationItemFamilyMemberHistory, json: true}, function(error, response, body){
																returnInvestigationItemFamilyMemberHistory = body;
																if(returnInvestigationItemFamilyMemberHistory.err_code > 0){
																	res.json(returnInvestigationItemFamilyMemberHistory);	
																	console.log("add reference Investigation item family member history : " + investigationItemFamilyMemberHistory);
																}
															});
														}
														
														if(investigationItemDiagnosticReport !== ""){
															dataInvestigationItemDiagnosticReport = {
																"_id" : investigationItemDiagnosticReport,
																"clinical_impression_investigation_id" : clinicalImpressionId
															}
															ApiFHIR.put('diagnosticReport', {"apikey": apikey, "_id": investigationItemDiagnosticReport}, {body: dataInvestigationItemDiagnosticReport, json: true}, function(error, response, body){
																returnInvestigationItemDiagnosticReport = body;
																if(returnInvestigationItemDiagnosticReport.err_code > 0){
																	res.json(returnInvestigationItemDiagnosticReport);	
																	console.log("add reference Investigation item diagnostic report : " + investigationItemDiagnosticReport);
																}
															});
														}
														
														if(investigationItemRiskAssessment !== ""){
															dataInvestigationItemRiskAssessment = {
																"_id" : investigationItemRiskAssessment,
																"clinical_impression_investigation_id" : clinicalImpressionId
															}
															ApiFHIR.put('riskAssessment', {"apikey": apikey, "_id": investigationItemRiskAssessment}, {body: dataInvestigationItemRiskAssessment, json: true}, function(error, response, body){
																returnInvestigationItemRiskAssessment = body;
																if(returnInvestigationItemRiskAssessment.err_code > 0){
																	res.json(returnInvestigationItemRiskAssessment);	
																	console.log("add reference Investigation item risk assessment : " + investigationItemRiskAssessment);
																}
															});
														}
														
														if(investigationItemImagingStudy !== ""){
															dataInvestigationItemImagingStudy = {
																"_id" : investigationItemImagingStudy,
																"clinical_impression_investigation_id" : clinicalImpressionId
															}
															ApiFHIR.put('imagingStudy', {"apikey": apikey, "_id": investigationItemImagingStudy}, {body: dataInvestigationItemImagingStudy, json: true}, function(error, response, body){
																returnInvestigationItemImagingStudy = body;
																if(returnInvestigationItemImagingStudy.err_code > 0){
																	res.json(returnInvestigationItemImagingStudy);	
																	console.log("add reference Investigation item imaging study : " + investigationItemImagingStudy);
																}
															});
														}
														
														if(prognosisReference !== ""){
															dataPrognosisReference = {
																"_id" : prognosisReference,
																"clinical_impression_id" : clinicalImpressionId
															}
															ApiFHIR.put('riskAssessment', {"apikey": apikey, "_id": prognosisReference}, {body: dataPrognosisReference, json: true}, function(error, response, body){
																returnPrognosisReference = body;
																if(returnPrognosisReference.err_code > 0){
																	res.json(returnPrognosisReference);	
																	console.log("add reference Prognosis reference : " + prognosisReference);
																}
															});
														}
														
														if(actionReferralRequest !== ""){
															dataActionReferralRequest = {
																"_id" : actionReferralRequest,
																"clinical_impression_id" : clinicalImpressionId
															}
															ApiFHIR.put('referralRequest', {"apikey": apikey, "_id": actionReferralRequest}, {body: dataActionReferralRequest, json: true}, function(error, response, body){
																returnActionReferralRequest = body;
																if(returnActionReferralRequest.err_code > 0){
																	res.json(returnActionReferralRequest);	
																	console.log("add reference Action referral request : " + actionReferralRequest);
																}
															});
														}
														
														if(actionProcedureRequest !== ""){
															dataActionProcedureRequest = {
																"_id" : actionProcedureRequest,
																"clinical_impression_id" : clinicalImpressionId
															}
															ApiFHIR.put('procedureRequest', {"apikey": apikey, "_id": actionProcedureRequest}, {body: dataActionProcedureRequest, json: true}, function(error, response, body){
																returnActionProcedureRequest = body;
																if(returnActionProcedureRequest.err_code > 0){
																	res.json(returnActionProcedureRequest);	
																	console.log("add reference Action procedure request : " + actionProcedureRequest);
																}
															});
														}
														
														if(actionProcedure !== ""){
															dataActionProcedure = {
																"_id" : actionProcedure,
																"clinical_impression_id" : clinicalImpressionId
															}
															ApiFHIR.put('procedure', {"apikey": apikey, "_id": actionProcedure}, {body: dataActionProcedure, json: true}, function(error, response, body){
																returnActionProcedure = body;
																if(returnActionProcedure.err_code > 0){
																	res.json(returnActionProcedure);	
																	console.log("add reference Action procedure : " + actionProcedure);
																}
															});
														}
														
														if(actionMedicationRequest !== ""){
															dataActionMedicationRequest = {
																"_id" : actionMedicationRequest,
																"clinical_impression_id" : clinicalImpressionId
															}
															ApiFHIR.put('medicationRequest', {"apikey": apikey, "_id": actionMedicationRequest}, {body: dataActionMedicationRequest, json: true}, function(error, response, body){
																returnActionMedicationRequest = body;
																if(returnActionMedicationRequest.err_code > 0){
																	res.json(returnActionMedicationRequest);	
																	console.log("add reference Action medication request : " + actionMedicationRequest);
																}
															});
														}
														
														if(actionAppointment !== ""){
															dataActionAppointment = {
																"_id" : actionAppointment,
																"clinical_impression_id" : clinicalImpressionId
															}
															ApiFHIR.put('appointment', {"apikey": apikey, "_id": actionAppointment}, {body: dataActionAppointment, json: true}, function(error, response, body){
																returnActionAppointment = body;
																if(returnActionAppointment.err_code > 0){
																	res.json(returnActionAppointment);	
																	console.log("add reference Action appointment : " + actionAppointment);
																}
															});
														}
													
														/*-----*/
														res.json({"err_code": 0, "err_msg": "Clinical Impression has been add.", "data": [{"_id": clinicalImpressionId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});
										
										//cek code
										/*
										status|CLINICAL_IMPRESSION_STATUS
										prognosisCodeableConcept|CLINICALIMPRESSION_PROGNOSIS
										investigationCode|INVESTIGATION_SETS
										findingItemItemCodeableConcept|CONDITION_CODE
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'CLINICAL_IMPRESSION_STATUS', function (resStatusCode) {
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

										myEmitter.prependOnceListener('checkPrognosisCodeableConcept', function () {
											if (!validator.isEmpty(prognosisCodeableConcept)) {
												checkCode(apikey, prognosisCodeableConcept, 'CLINICALIMPRESSION_PROGNOSIS', function (resPrognosisCodeableConceptCode) {
													if (resPrognosisCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Prognosis codeable concept code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})

										myEmitter.prependOnceListener('checkInvestigationCode', function () {
											if (!validator.isEmpty(investigationCode)) {
												checkCode(apikey, investigationCode, 'INVESTIGATION_SETS', function (resInvestigationCodeCode) {
													if (resInvestigationCodeCode.err_code > 0) {
														myEmitter.emit('checkPrognosisCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Investigation code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPrognosisCodeableConcept');
											}
										})

										myEmitter.prependOnceListener('checkFindingItemItemCodeableConcept', function () {
											if (!validator.isEmpty(findingItemItemCodeableConcept)) {
												checkCode(apikey, findingItemItemCodeableConcept, 'CONDITION_CODE', function (resFindingItemItemCodeableConceptCode) {
													if (resFindingItemItemCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkInvestigationCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Finding item item codeable concept code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInvestigationCode');
											}
										})

										//cek value
										/*
										subjectPatient|Patient
										subjectGroup|Group
										contextEncounter|Encounter
										contextEpisodeOfCare|Episode_Of_Care
										assessor|Practitioner
										previous|CLINICAL_IMPRESSION
										problemCondition|Condition
										problemAllergyIntolerance|Allergy_Intolerance
										investigationItemObservation|Observation
										investigationItemQuestionnaireResponse|QUESTIONNAIRE_RESPONSE
										investigationItemFamilyMemberHistory|FAMILY_MEMBER_HISTORY
										investigationItemDiagnosticReport|Diagnostic_Report
										investigationItemRiskAssessment|Risk_Assessment
										investigationItemImagingStudy|Imaging_Study
										findingItemItemReferenceCondition|Condition
										findingItemItemReferenceObservation|Observation
										prognosisReference|Risk_Assessment
										actionReferralRequest|Referral_Request
										actionProcedureRequest|Procedure_Request
										actionProcedure|Procedure
										actionMedicationRequest|Medication_Request
										actionAppointment|Appointment
										noteAuthorPractitioner|Practitioner
										noteAuthorPatient|Patient
										noteAuthorRelatedPerson|Related_Person
										*/
										myEmitter.prependOnceListener('checkSubjectPatient', function () {
											if (!validator.isEmpty(subjectPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
													if (resSubjectPatient.err_code > 0) {
														myEmitter.emit('checkFindingItemItemCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkFindingItemItemCodeableConcept');
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

										myEmitter.prependOnceListener('checkAssessor', function () {
											if (!validator.isEmpty(assessor)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + assessor, 'PRACTITIONER', function (resAssessor) {
													if (resAssessor.err_code > 0) {
														myEmitter.emit('checkContextEpisodeOfCare');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Assessor id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEpisodeOfCare');
											}
										})

										myEmitter.prependOnceListener('checkPrevious', function () {
											if (!validator.isEmpty(previous)) {
												checkUniqeValue(apikey, "CLINICAL_IMPRESSION_ID|" + previous, 'CLINICAL_IMPRESSION', function (resPrevious) {
													if (resPrevious.err_code > 0) {
														myEmitter.emit('checkAssessor');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Previous id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAssessor');
											}
										})

										myEmitter.prependOnceListener('checkProblemCondition', function () {
											if (!validator.isEmpty(problemCondition)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + problemCondition, 'CONDITION', function (resProblemCondition) {
													if (resProblemCondition.err_code > 0) {
														myEmitter.emit('checkPrevious');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Problem condition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPrevious');
											}
										})

										myEmitter.prependOnceListener('checkProblemAllergyIntolerance', function () {
											if (!validator.isEmpty(problemAllergyIntolerance)) {
												checkUniqeValue(apikey, "ALLERGY_INTOLERANCE_ID|" + problemAllergyIntolerance, 'ALLERGY_INTOLERANCE', function (resProblemAllergyIntolerance) {
													if (resProblemAllergyIntolerance.err_code > 0) {
														myEmitter.emit('checkProblemCondition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Problem allergy intolerance id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkProblemCondition');
											}
										})

										myEmitter.prependOnceListener('checkInvestigationItemObservation', function () {
											if (!validator.isEmpty(investigationItemObservation)) {
												checkUniqeValue(apikey, "OBSERVATION_ID|" + investigationItemObservation, 'OBSERVATION', function (resInvestigationItemObservation) {
													if (resInvestigationItemObservation.err_code > 0) {
														myEmitter.emit('checkProblemAllergyIntolerance');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Investigation item observation id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkProblemAllergyIntolerance');
											}
										})

										myEmitter.prependOnceListener('checkInvestigationItemQuestionnaireResponse', function () {
											if (!validator.isEmpty(investigationItemQuestionnaireResponse)) {
												checkUniqeValue(apikey, "QUESTIONNAIRE_RESPONSE_ID|" + investigationItemQuestionnaireResponse, 'QUESTIONNAIRE_RESPONSE', function (resInvestigationItemQuestionnaireResponse) {
													if (resInvestigationItemQuestionnaireResponse.err_code > 0) {
														myEmitter.emit('checkInvestigationItemObservation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Investigation item questionnaire response id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInvestigationItemObservation');
											}
										})

										myEmitter.prependOnceListener('checkInvestigationItemFamilyMemberHistory', function () {
											if (!validator.isEmpty(investigationItemFamilyMemberHistory)) {
												checkUniqeValue(apikey, "FAMILY_MEMBER_HISTORY_ID|" + investigationItemFamilyMemberHistory, 'FAMILY_MEMBER_HISTORY', function (resInvestigationItemFamilyMemberHistory) {
													if (resInvestigationItemFamilyMemberHistory.err_code > 0) {
														myEmitter.emit('checkInvestigationItemQuestionnaireResponse');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Investigation item family member history id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInvestigationItemQuestionnaireResponse');
											}
										})

										myEmitter.prependOnceListener('checkInvestigationItemDiagnosticReport', function () {
											if (!validator.isEmpty(investigationItemDiagnosticReport)) {
												checkUniqeValue(apikey, "DIAGNOSTIC_REPORT_ID|" + investigationItemDiagnosticReport, 'DIAGNOSTIC_REPORT', function (resInvestigationItemDiagnosticReport) {
													if (resInvestigationItemDiagnosticReport.err_code > 0) {
														myEmitter.emit('checkInvestigationItemFamilyMemberHistory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Investigation item diagnostic report id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInvestigationItemFamilyMemberHistory');
											}
										})

										myEmitter.prependOnceListener('checkInvestigationItemRiskAssessment', function () {
											if (!validator.isEmpty(investigationItemRiskAssessment)) {
												checkUniqeValue(apikey, "RISK_ASSESSMENT_ID|" + investigationItemRiskAssessment, 'RISK_ASSESSMENT', function (resInvestigationItemRiskAssessment) {
													if (resInvestigationItemRiskAssessment.err_code > 0) {
														myEmitter.emit('checkInvestigationItemDiagnosticReport');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Investigation item risk assessment id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInvestigationItemDiagnosticReport');
											}
										})

										myEmitter.prependOnceListener('checkInvestigationItemImagingStudy', function () {
											if (!validator.isEmpty(investigationItemImagingStudy)) {
												checkUniqeValue(apikey, "IMAGING_STUDY_ID|" + investigationItemImagingStudy, 'IMAGING_STUDY', function (resInvestigationItemImagingStudy) {
													if (resInvestigationItemImagingStudy.err_code > 0) {
														myEmitter.emit('checkInvestigationItemRiskAssessment');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Investigation item imaging study id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInvestigationItemRiskAssessment');
											}
										})

										myEmitter.prependOnceListener('checkFindingItemItemReferenceCondition', function () {
											if (!validator.isEmpty(findingItemItemReferenceCondition)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + findingItemItemReferenceCondition, 'CONDITION', function (resFindingItemItemReferenceCondition) {
													if (resFindingItemItemReferenceCondition.err_code > 0) {
														myEmitter.emit('checkInvestigationItemImagingStudy');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Finding item item reference condition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInvestigationItemImagingStudy');
											}
										})

										myEmitter.prependOnceListener('checkFindingItemItemReferenceObservation', function () {
											if (!validator.isEmpty(findingItemItemReferenceObservation)) {
												checkUniqeValue(apikey, "OBSERVATION_ID|" + findingItemItemReferenceObservation, 'OBSERVATION', function (resFindingItemItemReferenceObservation) {
													if (resFindingItemItemReferenceObservation.err_code > 0) {
														myEmitter.emit('checkFindingItemItemReferenceCondition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Finding item item reference observation id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkFindingItemItemReferenceCondition');
											}
										})

										myEmitter.prependOnceListener('checkPrognosisReference', function () {
											if (!validator.isEmpty(prognosisReference)) {
												checkUniqeValue(apikey, "RISK_ASSESSMENT_ID|" + prognosisReference, 'RISK_ASSESSMENT', function (resPrognosisReference) {
													if (resPrognosisReference.err_code > 0) {
														myEmitter.emit('checkFindingItemItemReferenceObservation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Prognosis reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkFindingItemItemReferenceObservation');
											}
										})

										myEmitter.prependOnceListener('checkActionReferralRequest', function () {
											if (!validator.isEmpty(actionReferralRequest)) {
												checkUniqeValue(apikey, "REFERRAL_REQUEST_ID|" + actionReferralRequest, 'REFERRAL_REQUEST', function (resActionReferralRequest) {
													if (resActionReferralRequest.err_code > 0) {
														myEmitter.emit('checkPrognosisReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Action referral request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPrognosisReference');
											}
										})

										myEmitter.prependOnceListener('checkActionProcedureRequest', function () {
											if (!validator.isEmpty(actionProcedureRequest)) {
												checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + actionProcedureRequest, 'PROCEDURE_REQUEST', function (resActionProcedureRequest) {
													if (resActionProcedureRequest.err_code > 0) {
														myEmitter.emit('checkActionReferralRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Action procedure request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActionReferralRequest');
											}
										})

										myEmitter.prependOnceListener('checkActionProcedure', function () {
											if (!validator.isEmpty(actionProcedure)) {
												checkUniqeValue(apikey, "PROCEDURE_ID|" + actionProcedure, 'PROCEDURE', function (resActionProcedure) {
													if (resActionProcedure.err_code > 0) {
														myEmitter.emit('checkActionProcedureRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Action procedure id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActionProcedureRequest');
											}
										})

										myEmitter.prependOnceListener('checkActionMedicationRequest', function () {
											if (!validator.isEmpty(actionMedicationRequest)) {
												checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + actionMedicationRequest, 'MEDICATION_REQUEST', function (resActionMedicationRequest) {
													if (resActionMedicationRequest.err_code > 0) {
														myEmitter.emit('checkActionProcedure');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Action medication request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActionProcedure');
											}
										})
										
										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
											if (!validator.isEmpty(noteAuthorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorPractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
													if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
														myEmitter.emit('checkActionMedicationRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author author reference practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActionMedicationRequest');
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
									
										if (!validator.isEmpty(actionAppointment)) {
											checkUniqeValue(apikey, "APPOINTMENT_ID|" + actionAppointment, 'APPOINTMENT', function (resActionAppointment) {
												if (resActionAppointment.err_code > 0) {
													myEmitter.emit('checkNoteAuthorAuthorReferenceRelatedPerson');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Action appointment id not found"
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
			var clinicalImpressionId = req.params.clinical_impression_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof clinicalImpressionId !== 'undefined'){
				if(validator.isEmpty(clinicalImpressionId)){
					err_code = 2;
					err_msg = "Clinical Impression id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Clinical Impression id is required";
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
												checkUniqeValue(apikey, "CLINICAL_IMPRESSION_ID|" + clinicalImpressionId, 'CLINICAL_IMPRESSION', function(resClinicalImpressionID){
													if(resClinicalImpressionID.err_code > 0){
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
																							"clinical_impression_id": clinicalImpressionId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Clinical Impression.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Clinical Impression Id not found"});		
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
		clinicalImpressionInvestigation: function addClinicalImpressionInvestigation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var clinicalImpressionId = req.params.clinical_impression_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof clinicalImpressionId !== 'undefined'){
				if(validator.isEmpty(clinicalImpressionId)){
					err_code = 2;
					err_msg = "Clinical Impression id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Clinical Impression id is required";
			}
			
			if(typeof req.body.code !== 'undefined'){
				var investigationCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(investigationCode)){
					err_code = 2;
					err_msg = "Clinical Impression investigation code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'investigation code' in json Clinical Impression request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClinicalImpressionID', function(){
							checkUniqeValue(apikey, "CLINICAL_IMPRESSION_ID|" + clinicalImpressionId, 'CLINICAL_IMPRESSION', function(resClinicalImpressionID){
								if(resClinicalImpressionID.err_code > 0){
									var unicId = uniqid.time();
									var clinicalImpressionInvestigationId = 'cii' + unicId;
									//ClinicalImpressionInvestigation
									dataClinicalImpressionInvestigation = {
										"investigation_id" : clinicalImpressionInvestigationId,
										"code" : code,
										"clinical_impression_id" : clinicalImpressionId
									}
									ApiFHIR.post('clinicalImpressionInvestigation', {"apikey": apikey}, {body: dataClinicalImpressionInvestigation, json: true}, function(error, response, body){
										clinicalImpressionInvestigation = body;
										if(clinicalImpressionInvestigation.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Clinical Impression Investigation has been add in this Clinical Impression.", "data": clinicalImpressionInvestigation.data});
										}else{
											res.json(clinicalImpressionInvestigation);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Clinical Impression Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(investigationCode)) {
							checkCode(apikey, investigationCode, 'INVESTIGATION_SETS', function (resInvestigationCodeCode) {
								if (resInvestigationCodeCode.err_code > 0) {
									myEmitter.emit('checkClinicalImpressionID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Investigation code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkClinicalImpressionID');
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
		clinicalImpressionFinding: function addClinicalImpressionFinding(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var clinicalImpressionId = req.params.clinical_impression_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof clinicalImpressionId !== 'undefined'){
				if(validator.isEmpty(clinicalImpressionId)){
					err_code = 2;
					err_msg = "Clinical Impression id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Clinical Impression id is required";
			}
			
			if(typeof req.body.item.itemCodeableConcept !== 'undefined'){
				var findingItemItemCodeableConcept =  req.body.item.itemCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(findingItemItemCodeableConcept)){
					err_code = 2;
					err_msg = "Clinical Impression finding item item codeable concept is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'finding item item codeable concept' in json Clinical Impression request.";
			}

			if(typeof req.body.item.itemReference.condition !== 'undefined'){
				var findingItemItemReferenceCondition =  req.body.item.itemReference.condition.trim().toLowerCase();
				if(validator.isEmpty(findingItemItemReferenceCondition)){
					findingItemItemReferenceCondition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'finding item item reference condition' in json Clinical Impression request.";
			}

			if(typeof req.body.item.itemReference.observation !== 'undefined'){
				var findingItemItemReferenceObservation =  req.body.item.itemReference.observation.trim().toLowerCase();
				if(validator.isEmpty(findingItemItemReferenceObservation)){
					finding.itemItemReferenceObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'finding item item reference observation' in json Clinical Impression request.";
			}

			if(typeof req.body.basis !== 'undefined'){
				var findingBasis =  req.body.basis.trim().toLowerCase();
				if(validator.isEmpty(findingBasis)){
					findingBasis = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'finding basis' in json Clinical Impression request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClinicalImpressionID', function(){
							checkUniqeValue(apikey, "CARE_TEAM_ID|" + clinicalImpressionId, 'CARE_TEAM', function(resClinicalImpressionID){
								if(resClinicalImpressionID.err_code > 0){
									var unicId = uniqid.time();
									var clinicalImpressionFindingId = 'cif' + unicId;
									//ClinicalImpressionFinding
									dataClinicalImpressionFinding = {
										"finding_id" : clinicalImpressionFindingId,
										"item_codeable_concept" : findingItemItemCodeableConcept,
										"item_reference_condition" : findingItemItemReferenceCondition,
										"item_reference_observation" : findingItemItemReferenceObservation,
										"basis" : findingBasis,
										"clinical_impression_id" : clinicalImpressionId
									}
									ApiFHIR.post('clinicalImpressionFinding', {"apikey": apikey}, {body: dataClinicalImpressionFinding, json: true}, function(error, response, body){
										clinicalImpressionFinding = body;
										if(clinicalImpressionFinding.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Clinical Impression Finding has been add in this Clinical Impression.", "data": clinicalImpressionFinding.data});
										}else{
											res.json(clinicalImpressionFinding);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Clinical Impression Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkFindingItemItemCodeableConcept', function () {
							if (!validator.isEmpty(findingItemItemCodeableConcept)) {
								checkCode(apikey, findingItemItemCodeableConcept, 'CONDITION_CODE', function (resFindingItemItemCodeableConceptCode) {
									if (resFindingItemItemCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkClinicalImpressionID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Finding item item codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClinicalImpressionID');
							}
						})

						myEmitter.prependOnceListener('checkFindingItemItemReferenceCondition', function () {
							if (!validator.isEmpty(findingItemItemReferenceCondition)) {
								checkUniqeValue(apikey, "CONDITION_ID|" + findingItemItemReferenceCondition, 'CONDITION', function (resFindingItemItemReferenceCondition) {
									if (resFindingItemItemReferenceCondition.err_code > 0) {
										myEmitter.emit('checkFindingItemItemCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Finding item item reference condition id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkFindingItemItemCodeableConcept');
							}
						})

						if (!validator.isEmpty(findingItemItemReferenceObservation)) {
							checkUniqeValue(apikey, "OBSERVATION_ID|" + findingItemItemReferenceObservation, 'OBSERVATION', function (resFindingItemItemReferenceObservation) {
								if (resFindingItemItemReferenceObservation.err_code > 0) {
									myEmitter.emit('checkFindingItemItemReferenceCondition');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Finding item item reference observation id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkFindingItemItemReferenceCondition');
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
		clinicalImpressionNote: function addClinicalImpressionNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var clinicalImpressionId = req.params.clinical_impression_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof clinicalImpressionId !== 'undefined'){
				if(validator.isEmpty(clinicalImpressionId)){
					err_code = 2;
					err_msg = "Clinical Impression id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Clinical Impression id is required";
			}
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Clinical Impression request.";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Clinical Impression request.";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Clinical Impression request.";
			}

			if(typeof req.body.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Clinical Impression request.";
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
				err_msg = "Please add sub-key 'note time' in json Clinical Impression request.";
			}

			if(typeof req.body.string !== 'undefined'){
				var noteString =  req.body.string.trim().toLowerCase();
				if(validator.isEmpty(noteString)){
					noteString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note string' in json Clinical Impression request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClinicalImpressionID', function(){
							checkUniqeValue(apikey, "clinical_impression_id|" + clinicalImpressionId, 'clinical_impression', function(resClinicalImpressionID){
								if(resClinicalImpressionID.err_code > 0){
									var unicId = uniqid.time();
									var clinicalImpressionNoteId = 'aci' + unicId;
									//ClinicalImpressionNote
									dataClinicalImpressionNote = {
										"id": clinicalImpressionNoteId,
										"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
										"author_ref_patient": noteAuthorAuthorReferencePatient,
										"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
										"author_string": noteAuthorAuthorString,
										"time": noteTime,
										"text": noteString,
										"clinical_impression_id" : clinicalImpressionId
									}
									ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataClinicalImpressionNote, json: true}, function(error, response, body){
										clinicalImpressionNote = body;
										if(clinicalImpressionNote.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Clinical Impression Note has been add in this Clinical Impression.", "data": clinicalImpressionNote.data});
										}else{
											res.json(clinicalImpressionNote);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Clinical Impression Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkClinicalImpressionID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClinicalImpressionID');
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
		clinicalImpression : function putClinicalImpression(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var clinicalImpressionId = req.params.clinical_impression_id;

      var err_code = 0;
      var err_msg = "";
      var dataClinicalImpression = {};

			if(typeof clinicalImpressionId !== 'undefined'){
				if(validator.isEmpty(clinicalImpressionId)){
					err_code = 2;
					err_msg = "Clinical Impression id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Clinical Impression id is required";
			}
			
			/*
			var clinical_impression_id = req.params._id;
			var status = req.body.status;
			var code = req.body.code;
			var description = req.body.description;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var effective_date_time = req.body.effective_date_time;
			var effective_period_start = req.body.effective_period_start;
			var effective_period_end = req.body.effective_period_end;
			var date = req.body.date;
			var assessor = req.body.assessor;
			var previous = req.body.previous;
			var protocol = req.body.protocol;
			var summary = req.body.summary;
			var prognosis_codeable_concept = req.body.prognosis_codeable_concept;
			*/

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "clinical impression status is required.";
				}else{
					dataClinicalImpression.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					dataClinicalImpression.code = "";
				}else{
					dataClinicalImpression.code = code;
				}
			}else{
			  code = "";
			}

			if(typeof req.body.description !== 'undefined' && req.body.description !== ""){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					dataClinicalImpression.description = "";
				}else{
					dataClinicalImpression.description = description;
				}
			}else{
			  description = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataClinicalImpression.patient = "";
				}else{
					dataClinicalImpression.patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataClinicalImpression.group = "";
				}else{
					dataClinicalImpression.group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					dataClinicalImpression.encounter = "";
				}else{
					dataClinicalImpression.encounter = contextEncounter;
				}
			}else{
			  contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					dataClinicalImpression.episode_of_care = "";
				}else{
					dataClinicalImpression.episode_of_care = contextEpisodeOfCare;
				}
			}else{
			  contextEpisodeOfCare = "";
			}

			if(typeof req.body.effective.effectiveDateTime !== 'undefined' && req.body.effective.effectiveDateTime !== ""){
				var effectiveEffectiveDateTime =  req.body.effective.effectiveDateTime;
				if(validator.isEmpty(effectiveEffectiveDateTime)){
					err_code = 2;
					err_msg = "clinical impression effective effective date time is required.";
				}else{
					if(!regex.test(effectiveEffectiveDateTime)){
						err_code = 2;
						err_msg = "clinical impression effective effective date time invalid date format.";	
					}else{
						dataClinicalImpression.effective_date_time = effectiveEffectiveDateTime;
					}
				}
			}else{
			  effectiveEffectiveDateTime = "";
			}

			if (typeof req.body.effective.effectivePeriod !== 'undefined' && req.body.effective.effectivePeriod !== "") {
			  var effectiveEffectivePeriod = req.body.effective.effectivePeriod;
			  if (effectiveEffectivePeriod.indexOf("to") > 0) {
			    arrEffectiveEffectivePeriod = effectiveEffectivePeriod.split("to");
			    dataClinicalImpression.effective_period_start = arrEffectiveEffectivePeriod[0];
			    dataClinicalImpression.effective_period_end = arrEffectiveEffectivePeriod[1];
			    if (!regex.test(effectiveEffectivePeriodStart) && !regex.test(effectiveEffectivePeriodEnd)) {
			      err_code = 2;
			      err_msg = "clinical impression effective effective period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "clinical impression effective effective period invalid date format.";
				}
			} else {
			  effectiveEffectivePeriod = "";
			}

			if(typeof req.body.date !== 'undefined' && req.body.date !== ""){
				var date =  req.body.date;
				if(validator.isEmpty(date)){
					err_code = 2;
					err_msg = "clinical impression date is required.";
				}else{
					if(!regex.test(date)){
						err_code = 2;
						err_msg = "clinical impression date invalid date format.";	
					}else{
						dataClinicalImpression.date = date;
					}
				}
			}else{
			  date = "";
			}

			if(typeof req.body.assessor !== 'undefined' && req.body.assessor !== ""){
				var assessor =  req.body.assessor.trim().toLowerCase();
				if(validator.isEmpty(assessor)){
					dataClinicalImpression.assessor = "";
				}else{
					dataClinicalImpression.assessor = assessor;
				}
			}else{
			  assessor = "";
			}

			if(typeof req.body.previous !== 'undefined' && req.body.previous !== ""){
				var previous =  req.body.previous.trim().toLowerCase();
				if(validator.isEmpty(previous)){
					dataClinicalImpression.previous = "";
				}else{
					dataClinicalImpression.previous = previous;
				}
			}else{
			  previous = "";
			}

			if(typeof req.body.problem.condition !== 'undefined' && req.body.problem.condition !== ""){
				var problemCondition =  req.body.problem.condition.trim().toLowerCase();
				if(validator.isEmpty(problemCondition)){
					dataClinicalImpression.condition = "";
				}else{
					dataClinicalImpression.condition = problemCondition;
				}
			}else{
			  problemCondition = "";
			}

			if(typeof req.body.problem.allergyIntolerance !== 'undefined' && req.body.problem.allergyIntolerance !== ""){
				var problemAllergyIntolerance =  req.body.problem.allergyIntolerance.trim().toLowerCase();
				if(validator.isEmpty(problemAllergyIntolerance)){
					dataClinicalImpression.allergy_intolerance = "";
				}else{
					dataClinicalImpression.allergy_intolerance = problemAllergyIntolerance;
				}
			}else{
			  problemAllergyIntolerance = "";
			}

			if(typeof req.body.protocol !== 'undefined' && req.body.protocol !== ""){
				var protocol =  req.body.protocol.trim().toLowerCase();
				if(validator.isEmpty(protocol)){
					dataClinicalImpression.protocol = "";
				}else{
					dataClinicalImpression.protocol = protocol;
				}
			}else{
			  protocol = "";
			}

			if(typeof req.body.summary !== 'undefined' && req.body.summary !== ""){
				var summary =  req.body.summary.trim().toLowerCase();
				if(validator.isEmpty(summary)){
					dataClinicalImpression.summary = "";
				}else{
					dataClinicalImpression.summary = summary;
				}
			}else{
			  summary = "";
			}

			if(typeof req.body.prognosisCodeableConcept !== 'undefined' && req.body.prognosisCodeableConcept !== ""){
				var prognosisCodeableConcept =  req.body.prognosisCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(prognosisCodeableConcept)){
					dataClinicalImpression.prognosis_codeable_concept = "";
				}else{
					dataClinicalImpression.prognosis_codeable_concept = prognosisCodeableConcept;
				}
			}else{
			  prognosisCodeableConcept = "";
			}

			if(typeof req.body.prognosisReference !== 'undefined' && req.body.prognosisReference !== ""){
				var prognosisReference =  req.body.prognosisReference.trim().toLowerCase();
				if(validator.isEmpty(prognosisReference)){
					dataClinicalImpression.prognosis_reference = "";
				}else{
					dataClinicalImpression.prognosis_reference = prognosisReference;
				}
			}else{
			  prognosisReference = "";
			}

			if(typeof req.body.action.referralRequest !== 'undefined' && req.body.action.referralRequest !== ""){
				var actionReferralRequest =  req.body.action.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(actionReferralRequest)){
					dataClinicalImpression.referral_request = "";
				}else{
					dataClinicalImpression.referral_request = actionReferralRequest;
				}
			}else{
			  actionReferralRequest = "";
			}

			if(typeof req.body.action.procedureRequest !== 'undefined' && req.body.action.procedureRequest !== ""){
				var actionProcedureRequest =  req.body.action.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(actionProcedureRequest)){
					dataClinicalImpression.procedure_request = "";
				}else{
					dataClinicalImpression.procedure_request = actionProcedureRequest;
				}
			}else{
			  actionProcedureRequest = "";
			}

			if(typeof req.body.action.procedure !== 'undefined' && req.body.action.procedure !== ""){
				var actionProcedure =  req.body.action.procedure.trim().toLowerCase();
				if(validator.isEmpty(actionProcedure)){
					dataClinicalImpression.procedure = "";
				}else{
					dataClinicalImpression.procedure = actionProcedure;
				}
			}else{
			  actionProcedure = "";
			}

			if(typeof req.body.action.medicationRequest !== 'undefined' && req.body.action.medicationRequest !== ""){
				var actionMedicationRequest =  req.body.action.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(actionMedicationRequest)){
					dataClinicalImpression.medication_request = "";
				}else{
					dataClinicalImpression.medication_request = actionMedicationRequest;
				}
			}else{
			  actionMedicationRequest = "";
			}

			if(typeof req.body.action.appointment !== 'undefined' && req.body.action.appointment !== ""){
				var actionAppointment =  req.body.action.appointment.trim().toLowerCase();
				if(validator.isEmpty(actionAppointment)){
					dataClinicalImpression.appointment = "";
				}else{
					dataClinicalImpression.appointment = actionAppointment;
				}
			}else{
			  actionAppointment = "";
			}


			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkClinicalImpressionId', function(){
						checkUniqeValue(apikey, "CLINICAL_IMPRESSION_ID|" + clinicalImpressionId, 'CLINICAL_IMPRESSION_ID', function(resClinicalImpressionId){
							if(resClinicalImpressionId.err_code > 0){
								ApiFHIR.put('clinicalImpression', {"apikey": apikey, "_id": clinicalImpressionId}, {body: dataClinicalImpression, json: true}, function(error, response, body){
									clinicalImpression = body;
									if(clinicalImpression.err_code > 0){
										res.json(clinicalImpression);	
									}else{
										res.json({"err_code": 0, "err_msg": "Clinical Impression has been update.", "data": [{"_id": clinicalImpressionId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Clinical Impression Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkStatus', function () {
						if (!validator.isEmpty(status)) {
							checkCode(apikey, status, 'CLINICAL_IMPRESSION_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) {
									myEmitter.emit('checkClinicalImpressionId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkClinicalImpressionId');
						}
					})

					myEmitter.prependOnceListener('checkPrognosisCodeableConcept', function () {
						if (!validator.isEmpty(prognosisCodeableConcept)) {
							checkCode(apikey, prognosisCodeableConcept, 'CLINICALIMPRESSION_PROGNOSIS', function (resPrognosisCodeableConceptCode) {
								if (resPrognosisCodeableConceptCode.err_code > 0) {
									myEmitter.emit('checkStatus');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Prognosis codeable concept code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkStatus');
						}
					})
					
					myEmitter.prependOnceListener('checkSubjectPatient', function () {
						if (!validator.isEmpty(subjectPatient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
								if (resSubjectPatient.err_code > 0) {
									myEmitter.emit('checkPrognosisCodeableConcept');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPrognosisCodeableConcept');
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

					myEmitter.prependOnceListener('checkAssessor', function () {
						if (!validator.isEmpty(assessor)) {
							checkUniqeValue(apikey, "PRACTITIONER_ID|" + assessor, 'PRACTITIONER', function (resAssessor) {
								if (resAssessor.err_code > 0) {
									myEmitter.emit('checkContextEpisodeOfCare');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Assessor id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkContextEpisodeOfCare');
						}
					})

					if (!validator.isEmpty(previous)) {
						checkUniqeValue(apikey, "CLINICAL_IMPRESSION_ID|" + previous, 'CLINICAL_IMPRESSION', function (resPrevious) {
							if (resPrevious.err_code > 0) {
								myEmitter.emit('checkAssessor');
							} else {
								res.json({
									"err_code": "500",
									"err_msg": "Previous id not found"
								});
							}
						})
					} else {
						myEmitter.emit('checkAssessor');
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
			var clinicalImpressionId = req.params.clinical_impression_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof clinicalImpressionId !== 'undefined'){
				if(validator.isEmpty(clinicalImpressionId)){
					err_code = 2;
					err_msg = "Clinical Impression id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Clinical Impression id is required";
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
						myEmitter.prependOnceListener('checkClinicalImpressionID', function(){
							checkUniqeValue(apikey, "CLINICAL_IMPRESSION_ID|" + clinicalImpressionId, 'CLINICAL_IMPRESSION', function(resClinicalImpressionID){
								if(resClinicalImpressionID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "CLINICAL_IMPRESSION_ID|"+clinicalImpressionId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this clinical Impression.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Clinical Impression Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkClinicalImpressionID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkClinicalImpressionID');				
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
		clinicalImpressionInvestigation: function updateClinicalImpressionInvestigation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var clinicalImpressionId = req.params.clinical_impression_id;
			var clinicalImpressionInvestigationId = req.params.clinical_impression_investigation_id;

			var err_code = 0;
			var err_msg = "";
			var dataClinicalImpression = {};
			//input check 
			if(typeof clinicalImpressionId !== 'undefined'){
				if(validator.isEmpty(clinicalImpressionId)){
					err_code = 2;
					err_msg = "Clinical Impression id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Clinical Impression id is required";
			}

			if(typeof clinicalImpressionInvestigationId !== 'undefined'){
				if(validator.isEmpty(clinicalImpressionInvestigationId)){
					err_code = 2;
					err_msg = "Clinical Impression Investigation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Clinical Impression Investigation id is required";
			}
			
			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var investigationCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(investigationCode)){
					err_code = 2;
					err_msg = "clinical impression investigation code is required.";
				}else{
					dataClinicalImpression.code = investigationCode;
				}
			}else{
			  investigationCode = "";
			}

			if(typeof req.body.item.observation !== 'undefined' && req.body.item.observation !== ""){
				var investigationItemObservation =  req.body.item.observation.trim().toLowerCase();
				if(validator.isEmpty(investigationItemObservation)){
					dataClinicalImpression.observation = "";
				}else{
					dataClinicalImpression.observation = investigationItemObservation;
				}
			}else{
			  investigationItemObservation = "";
			}

			if(typeof req.body.item.questionnaireResponse !== 'undefined' && req.body.item.questionnaireResponse !== ""){
				var investigationItemQuestionnaireResponse =  req.body.item.questionnaireResponse.trim().toLowerCase();
				if(validator.isEmpty(investigationItemQuestionnaireResponse)){
					dataClinicalImpression.questionnaire_response = "";
				}else{
					dataClinicalImpression.questionnaire_response = investigationItemQuestionnaireResponse;
				}
			}else{
			  investigationItemQuestionnaireResponse = "";
			}

			if(typeof req.body.item.familyMemberHistory !== 'undefined' && req.body.item.familyMemberHistory !== ""){
				var investigationItemFamilyMemberHistory =  req.body.item.familyMemberHistory.trim().toLowerCase();
				if(validator.isEmpty(investigationItemFamilyMemberHistory)){
					dataClinicalImpression.family_member_history = "";
				}else{
					dataClinicalImpression.family_member_history = investigationItemFamilyMemberHistory;
				}
			}else{
			  investigationItemFamilyMemberHistory = "";
			}

			if(typeof req.body.item.diagnosticReport !== 'undefined' && req.body.item.diagnosticReport !== ""){
				var investigationItemDiagnosticReport =  req.body.item.diagnosticReport.trim().toLowerCase();
				if(validator.isEmpty(investigationItemDiagnosticReport)){
					dataClinicalImpression.diagnostic_report = "";
				}else{
					dataClinicalImpression.diagnostic_report = investigationItemDiagnosticReport;
				}
			}else{
			  investigationItemDiagnosticReport = "";
			}

			if(typeof req.body.item.riskAssessment !== 'undefined' && req.body.item.riskAssessment !== ""){
				var investigationItemRiskAssessment =  req.body.item.riskAssessment.trim().toLowerCase();
				if(validator.isEmpty(investigationItemRiskAssessment)){
					dataClinicalImpression.risk_assessment = "";
				}else{
					dataClinicalImpression.risk_assessment = investigationItemRiskAssessment;
				}
			}else{
			  investigationItemRiskAssessment = "";
			}

			if(typeof req.body.item.imagingStudy !== 'undefined' && req.body.item.imagingStudy !== ""){
				var investigationItemImagingStudy =  req.body.item.imagingStudy.trim().toLowerCase();
				if(validator.isEmpty(investigationItemImagingStudy)){
					dataClinicalImpression.imaging_study = "";
				}else{
					dataClinicalImpression.imaging_study = investigationItemImagingStudy;
				}
			}else{
			  investigationItemImagingStudy = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClinicalImpressionID', function(){
							checkUniqeValue(apikey, "CLINICAL_IMPRESSION_ID|" + clinicalImpressionId, 'CLINICAL_IMPRESSION', function(resClinicalImpressionId){
								if(resClinicalImpressionId.err_code > 0){
									checkUniqeValue(apikey, "INVESTIGATION_ID|" + clinicalImpressionInvestigationId, 'CLINICAL_IMPRESSION_INVESTIGATION', function(resClinicalImpressionInvestigationID){
										if(resClinicalImpressionInvestigationID.err_code > 0){
											ApiFHIR.put('clinicalImpressionInvestigation', {"apikey": apikey, "_id": clinicalImpressionInvestigationId, "dr": "CLINICAL_IMPRESSION_ID|"+clinicalImpressionId}, {body: dataClinicalImpression, json: true}, function(error, response, body){
												clinicalImpressionInvestigation = body;
												if(clinicalImpressionInvestigation.err_code > 0){
													res.json(clinicalImpressionInvestigation);	
												}else{
													res.json({"err_code": 0, "err_msg": "Clinical Impression Investigation has been update in this Clinical Impression.", "data": clinicalImpressionInvestigation.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Clinical Impression Investigation Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Clinical Impression Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(investigationCode)) {
							checkCode(apikey, investigationCode, 'INVESTIGATION_SETS', function (resInvestigationCodeCode) {
								if (resInvestigationCodeCode.err_code > 0) {
									myEmitter.emit('checkClinicalImpressionID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Investigation code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkClinicalImpressionID');
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
		clinicalImpressionFinding: function updateClinicalImpressionFinding(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var clinicalImpressionId = req.params.clinical_impression_id;
			var clinicalImpressionFindingId = req.params.clinical_impression_investigation_id;

			var err_code = 0;
			var err_msg = "";
			var dataClinicalImpression = {};
			//input check 
			if(typeof clinicalImpressionId !== 'undefined'){
				if(validator.isEmpty(clinicalImpressionId)){
					err_code = 2;
					err_msg = "Clinical Impression id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Clinical Impression id is required";
			}

			if(typeof clinicalImpressionFindingId !== 'undefined'){
				if(validator.isEmpty(clinicalImpressionFindingId)){
					err_code = 2;
					err_msg = "Clinical Impression Finding id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Clinical Impression Finding id is required";
			}
			
			if(typeof req.body.item.itemCodeableConcept !== 'undefined' && req.body.item.itemCodeableConcept !== ""){
				var findingItemItemCodeableConcept =  req.body.item.itemCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(findingItemItemCodeableConcept)){
					err_code = 2;
					err_msg = "clinical impression finding item item codeable concept is required.";
				}else{
					dataClinicalImpression.item_codeable_concept = findingItemItemCodeableConcept;
				}
			}else{
			  findingItemItemCodeableConcept = "";
			}

			if(typeof req.body.item.itemReference.condition !== 'undefined' && req.body.item.itemReference.condition !== ""){
				var findingItemItemReferenceCondition =  req.body.item.itemReference.condition.trim().toLowerCase();
				if(validator.isEmpty(findingItemItemReferenceCondition)){
					dataClinicalImpression.item_reference_condition = "";
				}else{
					dataClinicalImpression.item_reference_condition = findingItemItemReferenceCondition;
				}
			}else{
			  findingItemItemReferenceCondition = "";
			}

			if(typeof req.body.item.itemReference.observation !== 'undefined' && req.body.item.itemReference.observation !== ""){
				var findingItemItemReferenceObservation =  req.body.item.itemReference.observation.trim().toLowerCase();
				if(validator.isEmpty(findingItemItemReferenceObservation)){
					dataClinicalImpression.item_reference_observation = "";
				}else{
					dataClinicalImpression.item_reference_observation = findingItemItemReferenceObservation;
				}
			}else{
			  findingItemItemReferenceObservation = "";
			}

			if(typeof req.body.basis !== 'undefined' && req.body.basis !== ""){
				var findingBasis =  req.body.basis.trim().toLowerCase();
				if(validator.isEmpty(findingBasis)){
					dataClinicalImpression.basis = "";
				}else{
					dataClinicalImpression.basis = findingBasis;
				}
			}else{
			  findingBasis = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClinicalImpressionID', function(){
							checkUniqeValue(apikey, "CLINICAL_IMPRESSION_ID|" + clinicalImpressionId, 'CLINICAL_IMPRESSION', function(resClinicalImpressionId){
								if(resClinicalImpressionId.err_code > 0){
									checkUniqeValue(apikey, "FINDING_ID|" + clinicalImpressionFindingId, 'CLINICAL_IMPRESSION_FINDING', function(resClinicalImpressionFindingID){
										if(resClinicalImpressionFindingID.err_code > 0){
											ApiFHIR.put('clinicalImpressionFinding', {"apikey": apikey, "_id": clinicalImpressionFindingId, "dr": "CLINICAL_IMPRESSION_ID|"+clinicalImpressionId}, {body: dataClinicalImpression, json: true}, function(error, response, body){
												clinicalImpressionFinding = body;
												if(clinicalImpressionFinding.err_code > 0){
													res.json(clinicalImpressionFinding);	
												}else{
													res.json({"err_code": 0, "err_msg": "Clinical Impression Finding has been update in this Clinical Impression.", "data": clinicalImpressionFinding.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Clinical Impression Finding Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Clinical Impression Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkFindingItemItemCodeableConcept', function () {
							if (!validator.isEmpty(findingItemItemCodeableConcept)) {
								checkCode(apikey, findingItemItemCodeableConcept, 'CONDITION_CODE', function (resFindingItemItemCodeableConceptCode) {
									if (resFindingItemItemCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkClinicalImpressionID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Finding item item codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClinicalImpressionID');
							}
						})

						myEmitter.prependOnceListener('checkFindingItemItemReferenceCondition', function () {
							if (!validator.isEmpty(findingItemItemReferenceCondition)) {
								checkUniqeValue(apikey, "CONDITION_ID|" + findingItemItemReferenceCondition, 'CONDITION', function (resFindingItemItemReferenceCondition) {
									if (resFindingItemItemReferenceCondition.err_code > 0) {
										myEmitter.emit('checkFindingItemItemCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Finding item item reference condition id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkFindingItemItemCodeableConcept');
							}
						})

						if (!validator.isEmpty(findingItemItemReferenceObservation)) {
							checkUniqeValue(apikey, "OBSERVATION_ID|" + findingItemItemReferenceObservation, 'OBSERVATION', function (resFindingItemItemReferenceObservation) {
								if (resFindingItemItemReferenceObservation.err_code > 0) {
									myEmitter.emit('checkFindingItemItemReferenceCondition');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Finding item item reference observation id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkFindingItemItemReferenceCondition');
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
		clinicalImpressionNote: function updateClinicalImpressionNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var clinicalImpressionId = req.params.clinical_impression_id;
			var clinicalImpressionNoteId = req.params.clinical_impression_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataClinicalImpression = {};
			//input check 
			if(typeof clinicalImpressionId !== 'undefined'){
				if(validator.isEmpty(clinicalImpressionId)){
					err_code = 2;
					err_msg = "Clinical Impression id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Clinical Impression id is required";
			}

			if(typeof clinicalImpressionNoteId !== 'undefined'){
				if(validator.isEmpty(clinicalImpressionNoteId)){
					err_code = 2;
					err_msg = "Clinical Impression Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Clinical Impression Note id is required";
			}
			
			/*
			"id": clinicalImpressionNoteId,
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
					err_msg = "clinical impression note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "clinical impression note time invalid date format.";	
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
						myEmitter.once('checkClinicalImpressionID', function(){
							checkUniqeValue(apikey, "clinical_impression_id|" + clinicalImpressionId, 'clinical_impression', function(resClinicalImpressionId){
								if(resClinicalImpressionId.err_code > 0){
									checkUniqeValue(apikey, "NOTE_ID|" + clinicalImpressionNoteId, 'NOTE', function(resClinicalImpressionNoteID){
										if(resClinicalImpressionNoteID.err_code > 0){
											ApiFHIR.put('annotation', {"apikey": apikey, "_id": clinicalImpressionNoteId, "dr": "clinical_impression_id|"+clinicalImpressionId}, {body: dataClinicalImpression, json: true}, function(error, response, body){
												clinicalImpressionNote = body;
												if(clinicalImpressionNote.err_code > 0){
													res.json(clinicalImpressionNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Clinical Impression Note has been update in this Clinical Impression.", "data": clinicalImpressionNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Clinical Impression Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Clinical Impression Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkClinicalImpressionID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClinicalImpressionID');
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