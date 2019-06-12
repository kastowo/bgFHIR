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
		familyMemberHistory : function getFamilyMemberHistory(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var familyMemberHistoryId = req.query._id;
			var code = req.query.code;
			var date = req.query.date;
			var definition = req.query.definition;
			var gender = req.query.gender;
			var identifier = req.query.identifier;
			var patient = req.query.patient;
			var relationship = req.query.relationship;
			var status = req.query.status;
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
			
			if(typeof familyMemberHistoryId !== 'undefined'){
				if(!validator.isEmpty(familyMemberHistoryId)){
					qString._id = familyMemberHistoryId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Family Member History Id is required."});
				}
			}
			
			if(typeof code !== 'undefined'){
				if(!validator.isEmpty(code)){
					qString.code = code; 
				}else{
					res.json({"err_code": 1, "err_msg": "Code is empty."});
				}
			}

			if(typeof date !== 'undefined'){
				if(!validator.isEmpty(date)){
					qString.date = date; 
				}else{
					res.json({"err_code": 1, "err_msg": "Date is empty."});
				}
			}

			if(typeof definition !== 'undefined'){
				if(!validator.isEmpty(definition)){
					qString.definition = definition; 
				}else{
					res.json({"err_code": 1, "err_msg": "Definition is empty."});
				}
			}

			if(typeof gender !== 'undefined'){
				if(!validator.isEmpty(gender)){
					qString.gender = gender; 
				}else{
					res.json({"err_code": 1, "err_msg": "Gender is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "Identifier is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "Patient is empty."});
				}
			}

			if(typeof relationship !== 'undefined'){
				if(!validator.isEmpty(relationship)){
					qString.relationship = relationship; 
				}else{
					res.json({"err_code": 1, "err_msg": "Relationship is empty."});
				}
			}

			if(typeof status !== 'undefined'){
				if(!validator.isEmpty(status)){
					qString.status = status; 
				}else{
					res.json({"err_code": 1, "err_msg": "Status is empty."});
				}
			}

			seedPhoenixFHIR.path.GET = {
				"FamilyMemberHistory" : {
					"location": "%(apikey)s/FamilyMemberHistory",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('FamilyMemberHistory', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var familyMemberHistory = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(familyMemberHistory.err_code == 0){
								//cek jumdata dulu
								if(familyMemberHistory.data.length > 0){
									newFamilyMemberHistory = [];
									for(i=0; i < familyMemberHistory.data.length; i++){
										myEmitter.once("getIdentifier", function(familyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory){
											/*console.log(familyMemberHistory);*/
											//get identifier
											qString = {};
											qString.family_member_history_id = familyMemberHistory.id;
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
													var objectFamilyMemberHistory = {};
													objectFamilyMemberHistory.resourceType = familyMemberHistory.resourceType;
													objectFamilyMemberHistory.id = familyMemberHistory.id;
													objectFamilyMemberHistory.identifier = identifier.data;
													objectFamilyMemberHistory.notDone = familyMemberHistory.notDone;
													objectFamilyMemberHistory.notDoneReason = familyMemberHistory.notDoneReason;
													objectFamilyMemberHistory.patient = familyMemberHistory.patient;
													objectFamilyMemberHistory.date = familyMemberHistory.date;
													objectFamilyMemberHistory.name = familyMemberHistory.name;
													objectFamilyMemberHistory.relationship = familyMemberHistory.relationship;
													objectFamilyMemberHistory.gender = familyMemberHistory.gender;
													objectFamilyMemberHistory.born = familyMemberHistory.born;
													objectFamilyMemberHistory.age = familyMemberHistory.age;
													objectFamilyMemberHistory.estimatedAge = familyMemberHistory.estimatedAge;
													objectFamilyMemberHistory.deceasedBoolean = familyMemberHistory.deceasedBoolean;
													objectFamilyMemberHistory.deceasedAge = familyMemberHistory.deceasedAge;
													objectFamilyMemberHistory.deceasedRange = familyMemberHistory.deceasedRange;
													objectFamilyMemberHistory.deceasedDate = familyMemberHistory.deceasedDate;
													objectFamilyMemberHistory.deceasedString = familyMemberHistory.deceasedString;
													objectFamilyMemberHistory.reasonCode = familyMemberHistory.reasonCode;
													
													newFamilyMemberHistory[index] = objectFamilyMemberHistory;

													myEmitter.once('getAnnotation', function(familyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory){
														qString = {};
														qString.family_member_history_id = familyMemberHistory.id;
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
																var objectFamilyMemberHistory = {};
																objectFamilyMemberHistory.resourceType = familyMemberHistory.resourceType;
																objectFamilyMemberHistory.id = familyMemberHistory.id;
																objectFamilyMemberHistory.identifier = familyMemberHistory.identifier;
																objectFamilyMemberHistory.notDone = familyMemberHistory.notDone;
																objectFamilyMemberHistory.notDoneReason = familyMemberHistory.notDoneReason;
																objectFamilyMemberHistory.patient = familyMemberHistory.patient;
																objectFamilyMemberHistory.date = familyMemberHistory.date;
																objectFamilyMemberHistory.name = familyMemberHistory.name;
																objectFamilyMemberHistory.relationship = familyMemberHistory.relationship;
																objectFamilyMemberHistory.gender = familyMemberHistory.gender;
																objectFamilyMemberHistory.born = familyMemberHistory.born;
																objectFamilyMemberHistory.age = familyMemberHistory.age;
																objectFamilyMemberHistory.estimatedAge = familyMemberHistory.estimatedAge;
																objectFamilyMemberHistory.deceasedBoolean = familyMemberHistory.deceasedBoolean;
																objectFamilyMemberHistory.deceasedAge = familyMemberHistory.deceasedAge;
																objectFamilyMemberHistory.deceasedRange = familyMemberHistory.deceasedRange;
																objectFamilyMemberHistory.deceasedDate = familyMemberHistory.deceasedDate;
																objectFamilyMemberHistory.deceasedString = familyMemberHistory.deceasedString;
																objectFamilyMemberHistory.reasonCode = familyMemberHistory.reasonCode;
																objectFamilyMemberHistory.note = annotation.data;
																
																newFamilyMemberHistory[index] = objectFamilyMemberHistory;
																myEmitter.once('getFamilyMemberHistoryDefinitionPlanDefinition', function(familyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory){
																	qString = {};
																	qString.family_member_history_id = familyMemberHistory.id;
																	seedPhoenixFHIR.path.GET = {
																		"FamilyMemberHistoryDefinitionPlanDefinition" : {
																			"location": "%(apikey)s/FamilyMemberHistoryDefinitionPlanDefinition",
																			"query": qString
																		}
																	}

																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																	ApiFHIR.get('FamilyMemberHistoryDefinitionPlanDefinition', {"apikey": apikey}, {}, function(error, response, body){
																		familyMemberHistoryDefinitionPlanDefinition = JSON.parse(body);
																		if(familyMemberHistoryDefinitionPlanDefinition.err_code == 0){
																			var objectFamilyMemberHistory = {};
																			objectFamilyMemberHistory.resourceType = familyMemberHistory.resourceType;
																			objectFamilyMemberHistory.id = familyMemberHistory.id;
																			objectFamilyMemberHistory.identifier = familyMemberHistory.identifier;
																			var Definition = {};
																			Definition.planDefinition = familyMemberHistoryDefinitionPlanDefinition.data;
																			objectFamilyMemberHistory.definition = Definition;
																			objectFamilyMemberHistory.notDone = familyMemberHistory.notDone;
																			objectFamilyMemberHistory.notDoneReason = familyMemberHistory.notDoneReason;
																			objectFamilyMemberHistory.patient = familyMemberHistory.patient;
																			objectFamilyMemberHistory.date = familyMemberHistory.date;
																			objectFamilyMemberHistory.name = familyMemberHistory.name;
																			objectFamilyMemberHistory.relationship = familyMemberHistory.relationship;
																			objectFamilyMemberHistory.gender = familyMemberHistory.gender;
																			objectFamilyMemberHistory.born = familyMemberHistory.born;
																			objectFamilyMemberHistory.age = familyMemberHistory.age;
																			objectFamilyMemberHistory.estimatedAge = familyMemberHistory.estimatedAge;
																			objectFamilyMemberHistory.deceasedBoolean = familyMemberHistory.deceasedBoolean;
																			objectFamilyMemberHistory.deceasedAge = familyMemberHistory.deceasedAge;
																			objectFamilyMemberHistory.deceasedRange = familyMemberHistory.deceasedRange;
																			objectFamilyMemberHistory.deceasedDate = familyMemberHistory.deceasedDate;
																			objectFamilyMemberHistory.deceasedString = familyMemberHistory.deceasedString;
																			objectFamilyMemberHistory.reasonCode = familyMemberHistory.reasonCode;
																			objectFamilyMemberHistory.note = annotation.data;

																			newFamilyMemberHistory[index] = objectFamilyMemberHistory;
																			myEmitter.once('getFamilyMemberHistoryDefinitionQuestionnaire', function(familyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory){
																				qString = {};
																				qString.family_member_history_id = familyMemberHistory.id;
																				seedPhoenixFHIR.path.GET = {
																					"FamilyMemberHistoryDefinitionQuestionnaire" : {
																						"location": "%(apikey)s/FamilyMemberHistoryDefinitionQuestionnaire",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('FamilyMemberHistoryDefinitionQuestionnaire', {"apikey": apikey}, {}, function(error, response, body){
																					familyMemberHistoryDefinitionQuestionnaire = JSON.parse(body);
																					if(familyMemberHistoryDefinitionQuestionnaire.err_code == 0){
																						var objectFamilyMemberHistory = {};
																						objectFamilyMemberHistory.resourceType = familyMemberHistory.resourceType;
																						objectFamilyMemberHistory.id = familyMemberHistory.id;
																						objectFamilyMemberHistory.identifier = familyMemberHistory.identifier;
																						var Definition = {};
																						Definition.planDefinition = familyMemberHistory.definition.planDefinition;
																						Definition.questionnaire = familyMemberHistoryDefinitionQuestionnaire.data;
																						objectFamilyMemberHistory.definition = Definition;
																						objectFamilyMemberHistory.notDone = familyMemberHistory.notDone;
																						objectFamilyMemberHistory.notDoneReason = familyMemberHistory.notDoneReason;
																						objectFamilyMemberHistory.patient = familyMemberHistory.patient;
																						objectFamilyMemberHistory.date = familyMemberHistory.date;
																						objectFamilyMemberHistory.name = familyMemberHistory.name;
																						objectFamilyMemberHistory.relationship = familyMemberHistory.relationship;
																						objectFamilyMemberHistory.gender = familyMemberHistory.gender;
																						objectFamilyMemberHistory.born = familyMemberHistory.born;
																						objectFamilyMemberHistory.age = familyMemberHistory.age;
																						objectFamilyMemberHistory.estimatedAge = familyMemberHistory.estimatedAge;
																						objectFamilyMemberHistory.deceasedBoolean = familyMemberHistory.deceasedBoolean;
																						objectFamilyMemberHistory.deceasedAge = familyMemberHistory.deceasedAge;
																						objectFamilyMemberHistory.deceasedRange = familyMemberHistory.deceasedRange;
																						objectFamilyMemberHistory.deceasedDate = familyMemberHistory.deceasedDate;
																						objectFamilyMemberHistory.deceasedString = familyMemberHistory.deceasedString;
																						objectFamilyMemberHistory.reasonCode = familyMemberHistory.reasonCode;
																						objectFamilyMemberHistory.note = annotation.data;

																						newFamilyMemberHistory[index] = objectFamilyMemberHistory;
																						myEmitter.once('getFamilyMemberHistoryReasonReferenceCondition', function(familyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory){
																							qString = {};
																							qString.family_member_history_id = familyMemberHistory.id;
																							seedPhoenixFHIR.path.GET = {
																								"FamilyMemberHistoryReasonReferenceCondition" : {
																									"location": "%(apikey)s/FamilyMemberHistoryReasonReferenceCondition",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('FamilyMemberHistoryReasonReferenceCondition', {"apikey": apikey}, {}, function(error, response, body){
																								familyMemberHistoryReasonReferenceCondition = JSON.parse(body);
																								if(familyMemberHistoryReasonReferenceCondition.err_code == 0){
																									var objectFamilyMemberHistory = {};
																									objectFamilyMemberHistory.resourceType = familyMemberHistory.resourceType;
																									objectFamilyMemberHistory.id = familyMemberHistory.id;
																									objectFamilyMemberHistory.identifier = familyMemberHistory.identifier;
																									objectFamilyMemberHistory.definition = familyMemberHistory.definition;
																									objectFamilyMemberHistory.notDone = familyMemberHistory.notDone;
																									objectFamilyMemberHistory.notDoneReason = familyMemberHistory.notDoneReason;
																									objectFamilyMemberHistory.patient = familyMemberHistory.patient;
																									objectFamilyMemberHistory.date = familyMemberHistory.date;
																									objectFamilyMemberHistory.name = familyMemberHistory.name;
																									objectFamilyMemberHistory.relationship = familyMemberHistory.relationship;
																									objectFamilyMemberHistory.gender = familyMemberHistory.gender;
																									objectFamilyMemberHistory.born = familyMemberHistory.born;
																									objectFamilyMemberHistory.age = familyMemberHistory.age;
																									objectFamilyMemberHistory.estimatedAge = familyMemberHistory.estimatedAge;
																									objectFamilyMemberHistory.deceasedBoolean = familyMemberHistory.deceasedBoolean;
																									objectFamilyMemberHistory.deceasedAge = familyMemberHistory.deceasedAge;
																									objectFamilyMemberHistory.deceasedRange = familyMemberHistory.deceasedRange;
																									objectFamilyMemberHistory.deceasedDate = familyMemberHistory.deceasedDate;
																									objectFamilyMemberHistory.deceasedString = familyMemberHistory.deceasedString;
																									objectFamilyMemberHistory.reasonCode = familyMemberHistory.reasonCode;
																									var ReasonReference = {};
																									ReasonReference.condition = familyMemberHistoryReasonReferenceCondition.data;
																									objectFamilyMemberHistory.reasonReference = ReasonReference;
																									objectFamilyMemberHistory.note = annotation.data;

																									newFamilyMemberHistory[index] = objectFamilyMemberHistory;
																									myEmitter.once('getFamilyMemberHistoryReasonReferenceObservation', function(familyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory){
																										qString = {};
																										qString.family_member_history_id = familyMemberHistory.id;
																										seedPhoenixFHIR.path.GET = {
																											"FamilyMemberHistoryReasonReferenceObservation" : {
																												"location": "%(apikey)s/FamilyMemberHistoryReasonReferenceObservation",
																												"query": qString
																											}
																										}

																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																										ApiFHIR.get('FamilyMemberHistoryReasonReferenceObservation', {"apikey": apikey}, {}, function(error, response, body){
																											familyMemberHistoryReasonReferenceObservation = JSON.parse(body);
																											if(familyMemberHistoryReasonReferenceObservation.err_code == 0){
																												var objectFamilyMemberHistory = {};
																												objectFamilyMemberHistory.resourceType = familyMemberHistory.resourceType;
																												objectFamilyMemberHistory.id = familyMemberHistory.id;
																												objectFamilyMemberHistory.identifier = familyMemberHistory.identifier;
																												objectFamilyMemberHistory.definition = familyMemberHistory.definition;
																												objectFamilyMemberHistory.notDone = familyMemberHistory.notDone;
																												objectFamilyMemberHistory.notDoneReason = familyMemberHistory.notDoneReason;
																												objectFamilyMemberHistory.patient = familyMemberHistory.patient;
																												objectFamilyMemberHistory.date = familyMemberHistory.date;
																												objectFamilyMemberHistory.name = familyMemberHistory.name;
																												objectFamilyMemberHistory.relationship = familyMemberHistory.relationship;
																												objectFamilyMemberHistory.gender = familyMemberHistory.gender;
																												objectFamilyMemberHistory.born = familyMemberHistory.born;
																												objectFamilyMemberHistory.age = familyMemberHistory.age;
																												objectFamilyMemberHistory.estimatedAge = familyMemberHistory.estimatedAge;
																												objectFamilyMemberHistory.deceasedBoolean = familyMemberHistory.deceasedBoolean;
																												objectFamilyMemberHistory.deceasedAge = familyMemberHistory.deceasedAge;
																												objectFamilyMemberHistory.deceasedRange = familyMemberHistory.deceasedRange;
																												objectFamilyMemberHistory.deceasedDate = familyMemberHistory.deceasedDate;
																												objectFamilyMemberHistory.deceasedString = familyMemberHistory.deceasedString;
																												objectFamilyMemberHistory.reasonCode = familyMemberHistory.reasonCode;
																												var ReasonReference = {};
																												ReasonReference.condition = familyMemberHistory.reasonReference.condition;
																												ReasonReference.observation = familyMemberHistoryReasonReferenceObservation.data;
																												objectFamilyMemberHistory.reasonReference = ReasonReference;
																												objectFamilyMemberHistory.note = annotation.data;
																								
																												newFamilyMemberHistory[index] = objectFamilyMemberHistory;
																												myEmitter.once('getFamilyMemberHistoryReasonReferenceAllergyIntolerance', function(familyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory){
																													qString = {};
																													qString.family_member_history_id = familyMemberHistory.id;
																													seedPhoenixFHIR.path.GET = {
																														"FamilyMemberHistoryReasonReferenceAllergyIntolerance" : {
																															"location": "%(apikey)s/FamilyMemberHistoryReasonReferenceAllergyIntolerance",
																															"query": qString
																														}
																													}

																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																													ApiFHIR.get('FamilyMemberHistoryReasonReferenceAllergyIntolerance', {"apikey": apikey}, {}, function(error, response, body){
																														familyMemberHistoryReasonReferenceAllergyIntolerance = JSON.parse(body);
																														if(familyMemberHistoryReasonReferenceAllergyIntolerance.err_code == 0){
																															var objectFamilyMemberHistory = {};
																															objectFamilyMemberHistory.resourceType = familyMemberHistory.resourceType;
																															objectFamilyMemberHistory.id = familyMemberHistory.id;
																															objectFamilyMemberHistory.identifier = familyMemberHistory.identifier;
																															objectFamilyMemberHistory.definition = familyMemberHistory.definition;
																															objectFamilyMemberHistory.notDone = familyMemberHistory.notDone;
																															objectFamilyMemberHistory.notDoneReason = familyMemberHistory.notDoneReason;
																															objectFamilyMemberHistory.patient = familyMemberHistory.patient;
																															objectFamilyMemberHistory.date = familyMemberHistory.date;
																															objectFamilyMemberHistory.name = familyMemberHistory.name;
																															objectFamilyMemberHistory.relationship = familyMemberHistory.relationship;
																															objectFamilyMemberHistory.gender = familyMemberHistory.gender;
																															objectFamilyMemberHistory.born = familyMemberHistory.born;
																															objectFamilyMemberHistory.age = familyMemberHistory.age;
																															objectFamilyMemberHistory.estimatedAge = familyMemberHistory.estimatedAge;
																															objectFamilyMemberHistory.deceasedBoolean = familyMemberHistory.deceasedBoolean;
																															objectFamilyMemberHistory.deceasedAge = familyMemberHistory.deceasedAge;
																															objectFamilyMemberHistory.deceasedRange = familyMemberHistory.deceasedRange;
																															objectFamilyMemberHistory.deceasedDate = familyMemberHistory.deceasedDate;
																															objectFamilyMemberHistory.deceasedString = familyMemberHistory.deceasedString;
																															objectFamilyMemberHistory.reasonCode = familyMemberHistory.reasonCode;
																															var ReasonReference = {};
																															ReasonReference.condition = familyMemberHistory.reasonReference.condition;
																															ReasonReference.observation = familyMemberHistory.reasonReference.observation;
																															ReasonReference.allergyIntolerance = familyMemberHistoryReasonReferenceAllergyIntolerance.data;
																															objectFamilyMemberHistory.reasonReference = ReasonReference;
																															objectFamilyMemberHistory.note = annotation.data;
																														
																															newFamilyMemberHistory[index] = objectFamilyMemberHistory;
																															myEmitter.once('getFamilyMemberHistoryReasonReferenceQuestionnaireResponse', function(familyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory){
																																qString = {};
																																qString.family_member_history_id = familyMemberHistory.id;
																																seedPhoenixFHIR.path.GET = {
																																	"FamilyMemberHistoryReasonReferenceQuestionnaireResponse" : {
																																		"location": "%(apikey)s/FamilyMemberHistoryReasonReferenceQuestionnaireResponse",
																																		"query": qString
																																	}
																																}

																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																ApiFHIR.get('FamilyMemberHistoryReasonReferenceQuestionnaireResponse', {"apikey": apikey}, {}, function(error, response, body){
																																	familyMemberHistoryReasonReferenceQuestionnaireResponse = JSON.parse(body);
																																	if(familyMemberHistoryReasonReferenceQuestionnaireResponse.err_code == 0){
																																		var objectFamilyMemberHistory = {};
																																		objectFamilyMemberHistory.resourceType = familyMemberHistory.resourceType;
																																		objectFamilyMemberHistory.id = familyMemberHistory.id;
																																		objectFamilyMemberHistory.identifier = familyMemberHistory.identifier;
																																		objectFamilyMemberHistory.definition = familyMemberHistory.definition;
																																		objectFamilyMemberHistory.notDone = familyMemberHistory.notDone;
																																		objectFamilyMemberHistory.notDoneReason = familyMemberHistory.notDoneReason;
																																		objectFamilyMemberHistory.patient = familyMemberHistory.patient;
																																		objectFamilyMemberHistory.date = familyMemberHistory.date;
																																		objectFamilyMemberHistory.name = familyMemberHistory.name;
																																		objectFamilyMemberHistory.relationship = familyMemberHistory.relationship;
																																		objectFamilyMemberHistory.gender = familyMemberHistory.gender;
																																		objectFamilyMemberHistory.born = familyMemberHistory.born;
																																		objectFamilyMemberHistory.age = familyMemberHistory.age;
																																		objectFamilyMemberHistory.estimatedAge = familyMemberHistory.estimatedAge;
																																		objectFamilyMemberHistory.deceasedBoolean = familyMemberHistory.deceasedBoolean;
																																		objectFamilyMemberHistory.deceasedAge = familyMemberHistory.deceasedAge;
																																		objectFamilyMemberHistory.deceasedRange = familyMemberHistory.deceasedRange;
																																		objectFamilyMemberHistory.deceasedDate = familyMemberHistory.deceasedDate;
																																		objectFamilyMemberHistory.deceasedString = familyMemberHistory.deceasedString;
																																		objectFamilyMemberHistory.reasonCode = familyMemberHistory.reasonCode;
																																		var ReasonReference = {};
																																		ReasonReference.condition = familyMemberHistory.reasonReference.condition;
																																		ReasonReference.observation = familyMemberHistory.reasonReference.observation;
																																		ReasonReference.allergyIntolerance = familyMemberHistory.reasonReference.allergyIntolerance;
																																		ReasonReference.questionnaireResponse = familyMemberHistoryReasonReferenceQuestionnaireResponse.data;
																																		objectFamilyMemberHistory.reasonReference = ReasonReference;
																																		objectFamilyMemberHistory.note = annotation.data;
																																		objectFamilyMemberHistory.condition = host + ':' + port + '/' + apikey + '/FamilyMemberHistory/' +  familyMemberHistory.id + '/FamilyMemberHistoryCondition';

																																		newFamilyMemberHistory[index] = objectFamilyMemberHistory;
																																		if(index == countFamilyMemberHistory -1 ){
																																			res.json({"err_code": 0, "data":newFamilyMemberHistory});
																																		}	
																																	}else{
																																		res.json(familyMemberHistoryReasonReferenceQuestionnaireResponse);			
																																	}
																																})
																															})
																															myEmitter.emit('getFamilyMemberHistoryReasonReferenceQuestionnaireResponse', objectFamilyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory);																																	
																														}else{
																															res.json(familyMemberHistoryReasonReferenceAllergyIntolerance);			
																														}
																													})
																												})
																												myEmitter.emit('getFamilyMemberHistoryReasonReferenceAllergyIntolerance', objectFamilyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory);																																								
																											}else{
																												res.json(familyMemberHistoryReasonReferenceObservation);			
																											}
																										})
																									})
																									myEmitter.emit('getFamilyMemberHistoryReasonReferenceObservation', objectFamilyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory);																																									
																								}else{
																									res.json(familyMemberHistoryReasonReferenceCondition);			
																								}
																							})
																						})
																						myEmitter.emit('getFamilyMemberHistoryReasonReferenceCondition', objectFamilyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory);																																								
																					}else{
																						res.json(familyMemberHistoryDefinitionQuestionnaire);			
																					}
																				})
																			})
																			myEmitter.emit('getFamilyMemberHistoryDefinitionQuestionnaire', objectFamilyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory);																		
																		}else{
																			res.json(familyMemberHistoryDefinitionPlanDefinition);			
																		}
																	})
																})
																myEmitter.emit('getFamilyMemberHistoryDefinitionPlanDefinition', objectFamilyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory);																	
															}else{
																res.json(annotation);			
															}
														})
													})
													myEmitter.emit('getAnnotation', objectFamilyMemberHistory, index, newFamilyMemberHistory, countFamilyMemberHistory);
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", familyMemberHistory.data[i], i, newFamilyMemberHistory, familyMemberHistory.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Family Member History is empty."});	
								}
							}else{
								res.json(familyMemberHistory);
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
					var familyMemberHistoryId = req.params.family_member_history_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "FAMILY_MEMBER_HISTORY_ID|" + familyMemberHistoryId, 'FAMILY_MEMBER_HISTORY', function(resFamilyMemberHistoryID){
								if(resFamilyMemberHistoryID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.family_member_history_id = familyMemberHistoryId;
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
						  			qString.family_member_history_id = familyMemberHistoryId;
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
									res.json({"err_code": 501, "err_msg": "Family Member History Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		familyMemberHistoryCondition: function getFamilyMemberHistoryCondition(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var familyMemberHistoryId = req.params.family_member_history_id;
			var familyMemberHistoryConditionId = req.params.family_member_history_condition_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "FAMILY_MEMBER_HISTORY_ID|" + familyMemberHistoryId, 'FAMILY_MEMBER_HISTORY', function(resFamilyMemberHistory){
						if(resFamilyMemberHistory.err_code > 0){
							if(typeof familyMemberHistoryConditionId !== 'undefined' && !validator.isEmpty(familyMemberHistoryConditionId)){
								checkUniqeValue(apikey, "CONDITION_ID|" + familyMemberHistoryConditionId, 'FAMILY_MEMBER_HISTORY_CONDITION', function(resFamilyMemberHistoryConditionID){
									if(resFamilyMemberHistoryConditionID.err_code > 0){
										//get familyMemberHistoryCondition
										qString = {};
										qString.family_member_history_id = familyMemberHistoryId;
										qString._id = familyMemberHistoryConditionId;
										seedPhoenixFHIR.path.GET = {
											"FamilyMemberHistoryCondition" : {
												"location": "%(apikey)s/FamilyMemberHistoryCondition",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('FamilyMemberHistoryCondition', {"apikey": apikey}, {}, function(error, response, body){
											familyMemberHistoryCondition = JSON.parse(body);
											if(familyMemberHistoryCondition.err_code == 0){
												//res.json({"err_code": 0, "data":familyMemberHistoryCondition.data});	
												if(familyMemberHistoryCondition.data.length > 0){
													newFamilyMemberHistoryCondition = [];
													for(i=0; i < familyMemberHistoryCondition.data.length; i++){
														myEmitter.once('getAnnotation', function(familyMemberHistoryCondition, index, newFamilyMemberHistoryCondition, countFamilyMemberHistoryCondition){
															qString = {};
															qString.family_member_history_condition_id = familyMemberHistoryCondition.id;
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
																	var objectFamilyMemberHistoryCondition = {};
																	objectFamilyMemberHistoryCondition.id = familyMemberHistoryCondition.id;
																	objectFamilyMemberHistoryCondition.code = familyMemberHistoryCondition.code;
																	objectFamilyMemberHistoryCondition.outcome = familyMemberHistoryCondition.outcome;
																	objectFamilyMemberHistoryCondition.onset = familyMemberHistoryCondition.onset;
																	objectFamilyMemberHistoryCondition.note = annotation.data;
																	
																	newFamilyMemberHistoryCondition[index] = objectFamilyMemberHistoryCondition;

																	if(index == countFamilyMemberHistoryCondition -1 ){
																		res.json({"err_code": 0, "data":newFamilyMemberHistoryCondition});	
																	}
																}else{
																	res.json(annotation);			
																}
															})
														})
														myEmitter.emit('getAnnotation', familyMemberHistoryCondition.data[i], i, newFamilyMemberHistoryCondition, familyMemberHistoryCondition.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Family Member History Condition is empty."});	
												}
											}else{
												res.json(familyMemberHistoryCondition);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Family Member History Condition Id not found"});		
									}
								})
							}else{
								//get familyMemberHistoryCondition
								qString = {};
								qString.family_member_history_id = familyMemberHistoryId;
								seedPhoenixFHIR.path.GET = {
									"FamilyMemberHistoryCondition" : {
										"location": "%(apikey)s/FamilyMemberHistoryCondition",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('FamilyMemberHistoryCondition', {"apikey": apikey}, {}, function(error, response, body){
									familyMemberHistoryCondition = JSON.parse(body);
									if(familyMemberHistoryCondition.err_code == 0){
										//res.json({"err_code": 0, "data":familyMemberHistoryCondition.data});	
										if(familyMemberHistoryCondition.data.length > 0){
											newFamilyMemberHistoryCondition = [];
											for(i=0; i < familyMemberHistoryCondition.data.length; i++){
												myEmitter.once('getAnnotation', function(familyMemberHistoryCondition, index, newFamilyMemberHistoryCondition, countFamilyMemberHistoryCondition){
													qString = {};
													qString.family_member_history_condition_id = familyMemberHistoryCondition.id;
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
															var objectFamilyMemberHistoryCondition = {};
															objectFamilyMemberHistoryCondition.id = familyMemberHistoryCondition.id;
															objectFamilyMemberHistoryCondition.code = familyMemberHistoryCondition.code;
															objectFamilyMemberHistoryCondition.outcome = familyMemberHistoryCondition.outcome;
															objectFamilyMemberHistoryCondition.onset = familyMemberHistoryCondition.onset;
															objectFamilyMemberHistoryCondition.note = annotation.data;

															newFamilyMemberHistoryCondition[index] = objectFamilyMemberHistoryCondition;

															if(index == countFamilyMemberHistoryCondition -1 ){
																res.json({"err_code": 0, "data":newFamilyMemberHistoryCondition});	
															}
														}else{
															res.json(annotation);			
														}
													})
												})
												myEmitter.emit('getAnnotation', familyMemberHistoryCondition.data[i], i, newFamilyMemberHistoryCondition, familyMemberHistoryCondition.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Family Member History Condition is empty."});	
										}
									}else{
										res.json(familyMemberHistoryCondition);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Family Member History  Id not found"});		
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
		familyMemberHistory : function addFamilyMemberHistory(req, res){
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
definition.questionnaire|definitionQuestionnaire||
status|status||nn
notDone|notDone|boolean|
notDoneReason|notDoneReason||
patient|patient||nn
date|date|date|
name|name||
relationship|relationship||nn|u
gender|gender||
born.bornPeriod|bornBornPeriod|period|
born.bornDate|bornBornDate|date|
born.bornString|bornBornString||
age.ageAge|ageAgeAge|integer|
age.ageRange|ageAgeRange|range|
age.ageString|ageAgeString||
estimatedAge|estimatedAge||
deceased.deceasedBoolean|deceasedDeceasedBoolean|boolean|
deceased.deceasedAge|deceasedDeceasedAge|integer|
deceased.deceasedRange|deceasedDeceasedRange|range|
deceased.deceasedDate|deceasedDeceasedDate|date|
deceased.deceasedString|deceasedDeceasedString||
reasonCode|reasonCode||
reasonReference.condition|reasonReferenceCondition||
reasonReference.observation|reasonReferenceObservation|
reasonReference.allergyIntolerance|reasonReferenceAllergyIntolerance||
reasonReference.questionnaireResponse|reasonReferenceQuestionnaireResponse||
note.author.authorReference.practitioner|noteAuthorPractitioner||
note.author.authorReference.patient|noteAuthorPatient||
note.author.authorReference.relatedPerson|noteAuthorRelatedPerson||
note.author.authorString|noteAuthorAuthorString||
note.time|noteTime|date|
note.text|noteText||
condition.code|conditionCode||
condition.outcome|conditionOutcome||
condition.onset.onsetAge|conditionOnsetOnsetAge|integer|
condition.onset.onsetRange|conditionOnsetOnsetRange|range|
condition.onset.onsetPeriod|conditionOnsetOnsetPeriod|period|
condition.onset.onsetString|conditionOnsetOnsetString||
condition.note.author.authorReference.practitioner|conditionNoteAuthorPractitioner||
condition.note.author.authorReference.patient|conditionNoteAuthorPatient||
condition.note.author.authorReference.relatedPerson|conditionNoteAuthorRelatedPerson||
condition.note.author.authorString|conditionNoteAuthorAuthorString||
condition.note.time|conditionNoteTime|date|
condition.note.text|conditionNoteText||
*/
			if(typeof req.body.definition.planDefinition !== 'undefined'){
				var definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					definitionPlanDefinition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'definition plan definition' in json Family Member History request.";
			}

			if(typeof req.body.definition.questionnaire !== 'undefined'){
				var definitionQuestionnaire =  req.body.definition.questionnaire.trim().toLowerCase();
				if(validator.isEmpty(definitionQuestionnaire)){
					definitionQuestionnaire = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'definition questionnaire' in json Family Member History request.";
			}

			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Family Member History status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Family Member History request.";
			}

			if (typeof req.body.notDone !== 'undefined') {
				var notDone = req.body.notDone.trim().toLowerCase();
					if(validator.isEmpty(notDone)){
						notDone = "false";
					}
				if(notDone === "true" || notDone === "false"){
					notDone = notDone;
				} else {
					err_code = 2;
					err_msg = "Family Member History not done is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'not done' in json Family Member History request.";
			}

			if(typeof req.body.notDoneReason !== 'undefined'){
				var notDoneReason =  req.body.notDoneReason.trim().toLowerCase();
				if(validator.isEmpty(notDoneReason)){
					notDoneReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'not done reason' in json Family Member History request.";
			}

			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					err_code = 2;
					err_msg = "Family Member History patient is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Family Member History request.";
			}

			if(typeof req.body.date !== 'undefined'){
				var date =  req.body.date;
				if(validator.isEmpty(date)){
					date = "";
				}else{
					if(!regex.test(date)){
						err_code = 2;
						err_msg = "Family Member History date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'date' in json Family Member History request.";
			}

			if(typeof req.body.name !== 'undefined'){
				var name =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(name)){
					name = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'name' in json Family Member History request.";
			}

			if(typeof req.body.relationship !== 'undefined'){
				var relationship =  req.body.relationship.trim().toUpperCase();
				if(validator.isEmpty(relationship)){
					err_code = 2;
					err_msg = "Family Member History relationship is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'relationship' in json Family Member History request.";
			}

			if(typeof req.body.gender !== 'undefined'){
				var gender =  req.body.gender.trim().toLowerCase();
				if(validator.isEmpty(gender)){
					gender = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'gender' in json Family Member History request.";
			}

			if (typeof req.body.born.bornPeriod !== 'undefined') {
			  var bornBornPeriod = req.body.born.bornPeriod;
 				if(validator.isEmpty(bornBornPeriod)) {
				  var bornBornPeriodStart = "";
				  var bornBornPeriodEnd = "";
				} else {
				  if (bornBornPeriod.indexOf("to") > 0) {
				    arrBornBornPeriod = bornBornPeriod.split("to");
				    var bornBornPeriodStart = arrBornBornPeriod[0];
				    var bornBornPeriodEnd = arrBornBornPeriod[1];
				    if (!regex.test(bornBornPeriodStart) && !regex.test(bornBornPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Family Member History born born period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Family Member History born born period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'born born period' in json Family Member History request.";
			}

			if(typeof req.body.born.bornDate !== 'undefined'){
				var bornBornDate =  req.body.born.bornDate;
				if(validator.isEmpty(bornBornDate)){
					bornBornDate = "";
				}else{
					if(!regex.test(bornBornDate)){
						err_code = 2;
						err_msg = "Family Member History born born date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'born born date' in json Family Member History request.";
			}

			if(typeof req.body.born.bornString !== 'undefined'){
				var bornBornString =  req.body.born.bornString.trim().toLowerCase();
				if(validator.isEmpty(bornBornString)){
					bornBornString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'born born string' in json Family Member History request.";
			}

			if(typeof req.body.age.ageAge !== 'undefined'){
				var ageAgeAge =  req.body.age.ageAge.trim();
				if(validator.isEmpty(ageAgeAge)){
					ageAgeAge = "";
				}else{
					if(!validator.isInt(ageAgeAge)){
						err_code = 2;
						err_msg = "Family Member History age age age is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'age age age' in json Family Member History request.";
			}

			if (typeof req.body.age.ageRange !== 'undefined') {
			  var ageAgeRange = req.body.age.ageRange;
 				if(validator.isEmpty(ageAgeRange)){
				  var ageAgeRangeLow = "";
				  var ageAgeRangeHigh = "";
				} else {
				  if (ageAgeRange.indexOf("to") > 0) {
				    arrAgeAgeRange = ageAgeRange.split("to");
				    var ageAgeRangeLow = arrAgeAgeRange[0];
				    var ageAgeRangeHigh = arrAgeAgeRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Family Member History age age range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'age age range' in json Family Member History request.";
			}

			if(typeof req.body.age.ageString !== 'undefined'){
				var ageAgeString =  req.body.age.ageString.trim().toLowerCase();
				if(validator.isEmpty(ageAgeString)){
					ageAgeString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'age age string' in json Family Member History request.";
			}

			if(typeof req.body.estimatedAge !== 'undefined'){
				var estimatedAge =  req.body.estimatedAge.trim().toLowerCase();
				if(validator.isEmpty(estimatedAge)){
					estimatedAge = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'estimated age' in json Family Member History request.";
			}

			if (typeof req.body.deceased.deceasedBoolean !== 'undefined') {
				var deceasedDeceasedBoolean = req.body.deceased.deceasedBoolean.trim().toLowerCase();
					if(validator.isEmpty(deceasedDeceasedBoolean)){
						deceasedDeceasedBoolean = "false";
					}
				if(deceasedDeceasedBoolean === "true" || deceasedDeceasedBoolean === "false"){
					deceasedDeceasedBoolean = deceasedDeceasedBoolean;
				} else {
					err_code = 2;
					err_msg = "Family Member History deceased deceased boolean is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'deceased deceased boolean' in json Family Member History request.";
			}

			if(typeof req.body.deceased.deceasedAge !== 'undefined'){
				var deceasedDeceasedAge =  req.body.deceased.deceasedAge.trim();
				if(validator.isEmpty(deceasedDeceasedAge)){
					deceasedDeceasedAge = "";
				}else{
					if(!validator.isInt(deceasedDeceasedAge)){
						err_code = 2;
						err_msg = "Family Member History deceased deceased age is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'deceased deceased age' in json Family Member History request.";
			}

			if (typeof req.body.deceased.deceasedRange !== 'undefined') {
			  var deceasedDeceasedRange = req.body.deceased.deceasedRange;
 				if(validator.isEmpty(deceasedDeceasedRange)){
				  var deceasedDeceasedRangeLow = "";
				  var deceasedDeceasedRangeHigh = "";
				} else {
				  if (deceasedDeceasedRange.indexOf("to") > 0) {
				    arrDeceasedDeceasedRange = deceasedDeceasedRange.split("to");
				    var deceasedDeceasedRangeLow = arrDeceasedDeceasedRange[0];
				    var deceasedDeceasedRangeHigh = arrDeceasedDeceasedRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Family Member History deceased deceased range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'deceased deceased range' in json Family Member History request.";
			}

			if(typeof req.body.deceased.deceasedDate !== 'undefined'){
				var deceasedDeceasedDate =  req.body.deceased.deceasedDate;
				if(validator.isEmpty(deceasedDeceasedDate)){
					deceasedDeceasedDate = "";
				}else{
					if(!regex.test(deceasedDeceasedDate)){
						err_code = 2;
						err_msg = "Family Member History deceased deceased date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'deceased deceased date' in json Family Member History request.";
			}

			if(typeof req.body.deceased.deceasedString !== 'undefined'){
				var deceasedDeceasedString =  req.body.deceased.deceasedString.trim().toLowerCase();
				if(validator.isEmpty(deceasedDeceasedString)){
					deceasedDeceasedString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'deceased deceased string' in json Family Member History request.";
			}

			if(typeof req.body.reasonCode !== 'undefined'){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					reasonCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason code' in json Family Member History request.";
			}

			if(typeof req.body.reasonReference.condition !== 'undefined'){
				var reasonReferenceCondition =  req.body.reasonReference.condition.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceCondition)){
					reasonReferenceCondition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference condition' in json Family Member History request.";
			}

			if(typeof req.body.reasonReference.observation !== 'undefined'){
				var reasonReferenceObservation =  req.body.reasonReference.observation.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceObservation)){
					reasonReferenceObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference observation' in json Family Member History request.";
			}

			if(typeof req.body.reasonReference.allergyIntolerance !== 'undefined'){
				var reasonReferenceAllergyIntolerance =  req.body.reasonReference.allergyIntolerance.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceAllergyIntolerance)){
					reasonReferenceAllergyIntolerance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference allergy intolerance' in json Family Member History request.";
			}

			if(typeof req.body.reasonReference.questionnaireResponse !== 'undefined'){
				var reasonReferenceQuestionnaireResponse =  req.body.reasonReference.questionnaireResponse.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceQuestionnaireResponse)){
					reasonReferenceQuestionnaireResponse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reason reference questionnaire response' in json Family Member History request.";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorPractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPractitioner)){
					noteAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Family Member History request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorPatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorPatient)){
					noteAuthorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Family Member History request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorRelatedPerson)){
					noteAuthorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Family Member History request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Family Member History request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Family Member History note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Family Member History request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note text' in json Family Member History request.";
			}

			if(typeof req.body.condition.code !== 'undefined'){
				var conditionCode =  req.body.condition.code.trim().toLowerCase();
				if(validator.isEmpty(conditionCode)){
					conditionCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition code' in json Family Member History request.";
			}

			if(typeof req.body.condition.outcome !== 'undefined'){
				var conditionOutcome =  req.body.condition.outcome.trim().toLowerCase();
				if(validator.isEmpty(conditionOutcome)){
					conditionOutcome = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition outcome' in json Family Member History request.";
			}

			if(typeof req.body.condition.onset.onsetAge !== 'undefined'){
				var conditionOnsetOnsetAge =  req.body.condition.onset.onsetAge.trim();
				if(validator.isEmpty(conditionOnsetOnsetAge)){
					conditionOnsetOnsetAge = "";
				}else{
					if(!validator.isInt(conditionOnsetOnsetAge)){
						err_code = 2;
						err_msg = "Family Member History condition onset onset age is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition onset onset age' in json Family Member History request.";
			}

			if (typeof req.body.condition.onset.onsetRange !== 'undefined') {
			  var conditionOnsetOnsetRange = req.body.condition.onset.onsetRange;
 				if(validator.isEmpty(conditionOnsetOnsetRange)){
				  var conditionOnsetOnsetRangeLow = "";
				  var conditionOnsetOnsetRangeHigh = "";
				} else {
				  if (conditionOnsetOnsetRange.indexOf("to") > 0) {
				    arrConditionOnsetOnsetRange = conditionOnsetOnsetRange.split("to");
				    var conditionOnsetOnsetRangeLow = arrConditionOnsetOnsetRange[0];
				    var conditionOnsetOnsetRangeHigh = arrConditionOnsetOnsetRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Family Member History condition onset onset range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'condition onset onset range' in json Family Member History request.";
			}

			if (typeof req.body.condition.onset.onsetPeriod !== 'undefined') {
			  var conditionOnsetOnsetPeriod = req.body.condition.onset.onsetPeriod;
 				if(validator.isEmpty(conditionOnsetOnsetPeriod)) {
				  var conditionOnsetOnsetPeriodStart = "";
				  var conditionOnsetOnsetPeriodEnd = "";
				} else {
				  if (conditionOnsetOnsetPeriod.indexOf("to") > 0) {
				    arrConditionOnsetOnsetPeriod = conditionOnsetOnsetPeriod.split("to");
				    var conditionOnsetOnsetPeriodStart = arrConditionOnsetOnsetPeriod[0];
				    var conditionOnsetOnsetPeriodEnd = arrConditionOnsetOnsetPeriod[1];
				    if (!regex.test(conditionOnsetOnsetPeriodStart) && !regex.test(conditionOnsetOnsetPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Family Member History condition onset onset period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Family Member History condition onset onset period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'condition onset onset period' in json Family Member History request.";
			}

			if(typeof req.body.condition.onset.onsetString !== 'undefined'){
				var conditionOnsetOnsetString =  req.body.condition.onset.onsetString.trim().toLowerCase();
				if(validator.isEmpty(conditionOnsetOnsetString)){
					conditionOnsetOnsetString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition onset onset string' in json Family Member History request.";
			}

			if(typeof req.body.condition.note.author.authorReference.practitioner !== 'undefined'){
				var conditionNoteAuthorPractitioner =  req.body.condition.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(conditionNoteAuthorPractitioner)){
					conditionNoteAuthorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition note author author reference practitioner' in json Family Member History request.";
			}

			if(typeof req.body.condition.note.author.authorReference.patient !== 'undefined'){
				var conditionNoteAuthorPatient =  req.body.condition.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(conditionNoteAuthorPatient)){
					conditionNoteAuthorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition note author author reference patient' in json Family Member History request.";
			}

			if(typeof req.body.condition.note.author.authorReference.relatedPerson !== 'undefined'){
				var conditionNoteAuthorRelatedPerson =  req.body.condition.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(conditionNoteAuthorRelatedPerson)){
					conditionNoteAuthorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition note author author reference related person' in json Family Member History request.";
			}

			if(typeof req.body.condition.note.author.authorString !== 'undefined'){
				var conditionNoteAuthorAuthorString =  req.body.condition.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(conditionNoteAuthorAuthorString)){
					conditionNoteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition note author author string' in json Family Member History request.";
			}

			if(typeof req.body.condition.note.time !== 'undefined'){
				var conditionNoteTime =  req.body.condition.note.time;
				if(validator.isEmpty(conditionNoteTime)){
					conditionNoteTime = "";
				}else{
					if(!regex.test(conditionNoteTime)){
						err_code = 2;
						err_msg = "Family Member History condition note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition note time' in json Family Member History request.";
			}

			if(typeof req.body.condition.note.text !== 'undefined'){
				var conditionNoteText =  req.body.condition.note.text.trim().toLowerCase();
				if(validator.isEmpty(conditionNoteText)){
					conditionNoteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition note text' in json Family Member History request.";
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
														var familyMemberHistoryId = 'fmh' + unicId;
														var familyMemberHistoryConditionId = 'fmc' + unicId;
														var noteId = 'afm' + unicId;
														var noteConditionId = 'afc' + unicId;
														
														dataFamilyMemberHistory = {
															"family_member_history_id" : familyMemberHistoryId,
															"status" : status,
															"not_done" : notDone,
															"not_done_reason" : notDoneReason,
															"patient" : patient,
															"date" : date,
															"name" : name,
															"relationship" : relationship,
															"gender" : gender,
															"born_period_start" : bornBornPeriodStart,
															"born_period_end" : bornBornPeriodEnd,
															"born_date" : bornBornDate,
															"born_string" : bornBornString,
															"age_age" : ageAgeAge,
															"age_range_low" : ageAgeRangeLow,
															"age_range_high" : ageAgeRangeHigh,
															"age_string" : ageAgeString,
															"estimated_age" : estimatedAge,
															"deceased_boolean" : deceasedDeceasedBoolean,
															"deceased_age" : deceasedDeceasedAge,
															"deceased_range_low" : deceasedDeceasedRangeLow,
															"deceased_range_high" : deceasedDeceasedRangeHigh,
															"deceased_date" : deceasedDeceasedDate,
															"deceased_string" : deceasedDeceasedString,
															"reason_code" : reasonCode
														}
														console.log(dataFamilyMemberHistory);
														ApiFHIR.post('familyMemberHistory', {"apikey": apikey}, {body: dataFamilyMemberHistory, json: true}, function(error, response, body){
															familyMemberHistory = body;
															if(familyMemberHistory.err_code > 0){
																res.json(familyMemberHistory);	
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
																							"family_member_history_id": familyMemberHistoryId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})														
														//FamilyMemberHistoryCondition
														dataFamilyMemberHistoryCondition = {
															"condition_id" : familyMemberHistoryConditionId,
															"code" : conditionCode,
															"outcome" : conditionOutcome,
															"onset_age" : conditionOnsetOnsetAge,
															"onset_range_low" : conditionOnsetOnsetRangeLow,
															"onset_range_high" : conditionOnsetOnsetRangehigh,
															"onset_period_start" : conditionOnsetOnsetPeriodStart,
															"onset_period_end" : conditionOnsetOnsetPeriodEnd,
															"onset_string" : conditionOnsetOnsetString,
															"family_member_history_id" : familyMemberHistoryId
														}
														ApiFHIR.post('familyMemberHistoryCondition', {"apikey": apikey}, {body: dataFamilyMemberHistoryCondition, json: true}, function(error, response, body){
															familyMemberHistoryCondition = body;
															if(familyMemberHistoryCondition.err_code > 0){
																res.json(familyMemberHistoryCondition);	
																console.log("ok");
															}
														});
														
														var dataNote = {
															"id": noteId,
															"author_ref_practitioner": noteAuthorPractitioner,
															"author_ref_patient": noteAuthorPatient,
															"author_ref_relatedPerson": noteAuthorRelatedPerson,
															"author_string": noteAuthorAuthorString,
															"time": noteTime,
															"text": noteText,
															"family_member_history_id" : familyMemberHistoryId
														};
														
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataNote, json:true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
															} 
														});
														
														var dataNoteCondition = {
															"id": noteConditionId,
															"author_ref_practitioner": conditionNoteAuthorPractitioner,
															"author_ref_patient": conditionNoteAuthorPatient,
															"author_ref_relatedPerson": conditionNoteAuthorRelatedPerson,
															"author_string": conditionNoteAuthorAuthorString,
															"time": conditionNoteTime,
															"text": conditionNoteText,
															"family_member_history_condition_id" : familyMemberHistoryConditionId,
														};
														
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataNoteCondition, json:true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
															} 
														});
														
														if(definitionPlanDefinition !== ""){
															dataDefinitionPlanDefinition = {
																"_id" : definitionPlanDefinition,
																"family_member_history_id" : familyMemberHistoryId
															}
															ApiFHIR.put('planDefinition', {"apikey": apikey, "_id": definitionPlanDefinition}, {body: dataDefinitionPlanDefinition, json: true}, function(error, response, body){
																returnDefinitionPlanDefinition = body;
																if(returnDefinitionPlanDefinition.err_code > 0){
																	res.json(returnDefinitionPlanDefinition);	
																	console.log("add reference Definition plan definition : " + definitionPlanDefinition);
																}
															});
														}

														if(definitionQuestionnaire !== ""){
															dataDefinitionQuestionnaire = {
																"_id" : definitionQuestionnaire,
																"family_member_history_id" : familyMemberHistoryId
															}
															ApiFHIR.put('questionnaire', {"apikey": apikey, "_id": definitionQuestionnaire}, {body: dataDefinitionQuestionnaire, json: true}, function(error, response, body){
																returnDefinitionQuestionnaire = body;
																if(returnDefinitionQuestionnaire.err_code > 0){
																	res.json(returnDefinitionQuestionnaire);	
																	console.log("add reference Definition questionnaire : " + definitionQuestionnaire);
																}
															});
														}

														if(reasonReferenceCondition !== ""){
															dataReasonReferenceCondition = {
																"_id" : reasonReferenceCondition,
																"family_member_history_id" : familyMemberHistoryId
															}
															ApiFHIR.put('condition', {"apikey": apikey, "_id": reasonReferenceCondition}, {body: dataReasonReferenceCondition, json: true}, function(error, response, body){
																returnReasonReferenceCondition = body;
																if(returnReasonReferenceCondition.err_code > 0){
																	res.json(returnReasonReferenceCondition);	
																	console.log("add reference Reason reference condition : " + reasonReferenceCondition);
																}
															});
														}

														if(reasonReferenceObservation !== ""){
															dataReasonReferenceObservation = {
																"_id" : reasonReferenceObservation,
																"family_member_history_id" : familyMemberHistoryId
															}
															ApiFHIR.put('observation', {"apikey": apikey, "_id": reasonReferenceObservation}, {body: dataReasonReferenceObservation, json: true}, function(error, response, body){
																returnReasonReferenceObservation = body;
																if(returnReasonReferenceObservation.err_code > 0){
																	res.json(returnReasonReferenceObservation);	
																	console.log("add reference Reason reference observation : " + reasonReferenceObservation);
																}
															});
														}

														if(reasonReferenceAllergyIntolerance !== ""){
															dataReasonReferenceAllergyIntolerance = {
																"_id" : reasonReferenceAllergyIntolerance,
																"family_member_history_id" : familyMemberHistoryId
															}
															ApiFHIR.put('allergyIntolerance', {"apikey": apikey, "_id": reasonReferenceAllergyIntolerance}, {body: dataReasonReferenceAllergyIntolerance, json: true}, function(error, response, body){
																returnReasonReferenceAllergyIntolerance = body;
																if(returnReasonReferenceAllergyIntolerance.err_code > 0){
																	res.json(returnReasonReferenceAllergyIntolerance);	
																	console.log("add reference Reason reference allergy intolerance : " + reasonReferenceAllergyIntolerance);
																}
															});
														}

														if(reasonReferenceQuestionnaireResponse !== ""){
															dataReasonReferenceQuestionnaireResponse = {
																"_id" : reasonReferenceQuestionnaireResponse,
																"family_member_history_id" : familyMemberHistoryId
															}
															ApiFHIR.put('questionnaireResponse', {"apikey": apikey, "_id": reasonReferenceQuestionnaireResponse}, {body: dataReasonReferenceQuestionnaireResponse, json: true}, function(error, response, body){
																returnReasonReferenceQuestionnaireResponse = body;
																if(returnReasonReferenceQuestionnaireResponse.err_code > 0){
																	res.json(returnReasonReferenceQuestionnaireResponse);	
																	console.log("add reference Reason reference questionnaire response : " + reasonReferenceQuestionnaireResponse);
																}
															});
														}

														
														res.json({"err_code": 0, "err_msg": "Family Member History has been add.", "data": [{"_id": familyMemberHistoryId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});
									
										//cek code
										/*
status|history-status
notDoneReason|history-not-done-reason
relationship|family_member
gender|administrative-gender
reasonCode|clinical-findings
conditionCode|condition-code
conditionOutcome|condition-outcome
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'HISTORY_STATUS', function (resStatusCode) {
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

										myEmitter.prependOnceListener('checkNotDoneReason', function () {
											if (!validator.isEmpty(notDoneReason)) {
												checkCode(apikey, notDoneReason, 'HISTORY_NOT_DONE_REASON', function (resNotDoneReasonCode) {
													if (resNotDoneReasonCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Not done reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})

										myEmitter.prependOnceListener('checkRelationship', function () {
											if (!validator.isEmpty(relationship)) {
												checkCode(apikey, relationship, 'FAMILY_MEMBER', function (resRelationshipCode) {
													if (resRelationshipCode.err_code > 0) {
														myEmitter.emit('checkNotDoneReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Relationship code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkNotDoneReason');
											}
										})

										myEmitter.prependOnceListener('checkGender', function () {
											if (!validator.isEmpty(gender)) {
												checkCode(apikey, gender, 'ADMINISTRATIVE_GENDER', function (resGenderCode) {
													if (resGenderCode.err_code > 0) {
														myEmitter.emit('checkRelationship');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Gender code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRelationship');
											}
										})

										myEmitter.prependOnceListener('checkReasonCode', function () {
											if (!validator.isEmpty(reasonCode)) {
												checkCode(apikey, reasonCode, 'CLINICAL_FINDINGS', function (resReasonCodeCode) {
													if (resReasonCodeCode.err_code > 0) {
														myEmitter.emit('checkGender');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkGender');
											}
										})

										myEmitter.prependOnceListener('checkConditionCode', function () {
											if (!validator.isEmpty(conditionCode)) {
												checkCode(apikey, conditionCode, 'CONDITION_CODE', function (resConditionCodeCode) {
													if (resConditionCodeCode.err_code > 0) {
														myEmitter.emit('checkReasonCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Condition code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonCode');
											}
										})

										myEmitter.prependOnceListener('checkConditionOutcome', function () {
											if (!validator.isEmpty(conditionOutcome)) {
												checkCode(apikey, conditionOutcome, 'CONDITION_OUTCOME', function (resConditionOutcomeCode) {
													if (resConditionOutcomeCode.err_code > 0) {
														myEmitter.emit('checkConditionCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Condition outcome code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkConditionCode');
											}
										})

										//cek value
										/*
definitionPlanDefinition|Plan_Definition
definitionQuestionnaire|Questionnaire
patient|patient
reasonReferenceCondition|Condition
reasonReferenceObservation|Observation
reasonReferenceAllergyIntolerance|Allergy_Intolerance
reasonReferenceQuestionnaireResponse|Questionnaire_Response
										*/
										
										myEmitter.prependOnceListener('checkDefinitionPlanDefinition', function () {
											if (!validator.isEmpty(definitionPlanDefinition)) {
												checkUniqeValue(apikey, "PLAN_DEFINITION_ID|" + definitionPlanDefinition, 'PLAN_DEFINITION', function (resDefinitionPlanDefinition) {
													if (resDefinitionPlanDefinition.err_code > 0) {
														myEmitter.emit('checkConditionOutcome');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Definition plan definition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkConditionOutcome');
											}
										})

										myEmitter.prependOnceListener('checkDefinitionQuestionnaire', function () {
											if (!validator.isEmpty(definitionQuestionnaire)) {
												checkUniqeValue(apikey, "QUESTIONNAIRE_ID|" + definitionQuestionnaire, 'QUESTIONNAIRE', function (resDefinitionQuestionnaire) {
													if (resDefinitionQuestionnaire.err_code > 0) {
														myEmitter.emit('checkDefinitionPlanDefinition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Definition questionnaire id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDefinitionPlanDefinition');
											}
										})

										myEmitter.prependOnceListener('checkPatient', function () {
											if (!validator.isEmpty(patient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
													if (resPatient.err_code > 0) {
														myEmitter.emit('checkDefinitionQuestionnaire');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDefinitionQuestionnaire');
											}
										})

										myEmitter.prependOnceListener('checkReasonReferenceCondition', function () {
											if (!validator.isEmpty(reasonReferenceCondition)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + reasonReferenceCondition, 'CONDITION', function (resReasonReferenceCondition) {
													if (resReasonReferenceCondition.err_code > 0) {
														myEmitter.emit('checkPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason reference condition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPatient');
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

										myEmitter.prependOnceListener('checkReasonReferenceAllergyIntolerance', function () {
											if (!validator.isEmpty(reasonReferenceAllergyIntolerance)) {
												checkUniqeValue(apikey, "ALLERGY_INTOLERANCE_ID|" + reasonReferenceAllergyIntolerance, 'ALLERGY_INTOLERANCE', function (resReasonReferenceAllergyIntolerance) {
													if (resReasonReferenceAllergyIntolerance.err_code > 0) {
														myEmitter.emit('checkReasonReferenceObservation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reason reference allergy intolerance id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonReferenceObservation');
											}
										})
										
										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
											if (!validator.isEmpty(noteAuthorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorPractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
													if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
														myEmitter.emit('checkReasonReferenceAllergyIntolerance');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author author reference practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReasonReferenceAllergyIntolerance');
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
										
										myEmitter.prependOnceListener('checkConditionNoteAuthorAuthorReferencePractitioner', function () {
											if (!validator.isEmpty(conditionNoteAuthorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + conditionNoteAuthorPractitioner, 'PRACTITIONER', function (resConditionNoteAuthorAuthorReferencePractitioner) {
													if (resConditionNoteAuthorAuthorReferencePractitioner.err_code > 0) {
														myEmitter.emit('checkNoteAuthorAuthorReferenceRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Condition Note author author reference practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkNoteAuthorAuthorReferenceRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkConditionNoteAuthorAuthorReferencePatient', function () {
											if (!validator.isEmpty(conditionNoteAuthorPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + conditionNoteAuthorPatient, 'PATIENT', function (resConditionNoteAuthorAuthorReferencePatient) {
													if (resConditionNoteAuthorAuthorReferencePatient.err_code > 0) {
														myEmitter.emit('checkConditionNoteAuthorAuthorReferencePractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Condition Note author author reference patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkConditionNoteAuthorAuthorReferencePractitioner');
											}
										})

										myEmitter.prependOnceListener('checkConditionNoteAuthorAuthorReferenceRelatedPerson', function () {
											if (!validator.isEmpty(conditionNoteAuthorRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + conditionNoteAuthorRelatedPerson, 'RELATED_PERSON', function (resConditionNoteAuthorAuthorReferenceRelatedPerson) {
													if (resConditionNoteAuthorAuthorReferenceRelatedPerson.err_code > 0) {
														myEmitter.emit('checkConditionNoteAuthorAuthorReferencePatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Condition Note author author reference related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkConditionNoteAuthorAuthorReferencePatient');
											}
										})

										if (!validator.isEmpty(reasonReferenceQuestionnaireResponse)) {
											checkUniqeValue(apikey, "QUESTIONNAIRE_RESPONSE_ID|" + reasonReferenceQuestionnaireResponse, 'QUESTIONNAIRE_RESPONSE', function (resReasonReferenceQuestionnaireResponse) {
												if (resReasonReferenceQuestionnaireResponse.err_code > 0) {
													myEmitter.emit('checkConditionNoteAuthorAuthorReferenceRelatedPerson');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Reason reference questionnaire response id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkConditionNoteAuthorAuthorReferenceRelatedPerson');
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
			var familyMemberHistoryId = req.params.family_member_history_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof familyMemberHistoryId !== 'undefined'){
				if(validator.isEmpty(familyMemberHistoryId)){
					err_code = 2;
					err_msg = "Family Member History id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Family Member History id is required";
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
												checkUniqeValue(apikey, "FAMILY_MEMBER_HISTORY_ID|" + familyMemberHistoryId, 'FAMILY_MEMBER_HISTORY', function(resFamilyMemberHistoryID){
													if(resFamilyMemberHistoryID.err_code > 0){
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
																							"family_member_history_id": familyMemberHistoryId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Family Member History.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Family Member History Id not found"});		
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
		familyMemberHistoryCondition: function addFamilyMemberHistoryCondition(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var familyMemberHistoryId = req.params.family_member_history_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof familyMemberHistoryId !== 'undefined'){
				if(validator.isEmpty(familyMemberHistoryId)){
					err_code = 2;
					err_msg = "Family Member History id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Family Member History id is required";
			}
			
			if(typeof req.body.code !== 'undefined'){
				var conditionCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(conditionCode)){
					conditionCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition code' in json Family Member History request.";
			}

			if(typeof req.body.outcome !== 'undefined'){
				var conditionOutcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(conditionOutcome)){
					conditionOutcome = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition outcome' in json Family Member History request.";
			}

			if(typeof req.body.onset.onsetAge !== 'undefined'){
				var conditionOnsetOnsetAge =  req.body.onset.onsetAge;
				if(validator.isEmpty(conditionOnsetOnsetAge)){
					conditionOnsetOnsetAge = "";
				}else{
					if(validator.isInt(conditionOnsetOnsetAge)){
						err_code = 2;
						err_msg = "Family Member History condition onset onset age is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition onset onset age' in json Family Member History request.";
			}

			if (typeof req.body.onset.onsetRange !== 'undefined') {
			  var conditionOnsetOnsetRange = req.body.onset.onsetRange;
 				if(validator.isEmpty(conditionOnsetOnsetRange)){
				  var conditionOnsetOnsetRangeLow = "";
				  var conditionOnsetOnsetRangeHigh = "";
				} else {
				  if (conditionOnsetOnsetRange.indexOf("to") > 0) {
				    arrConditionOnsetOnsetRange = conditionOnsetOnsetRange.split("to");
				    var conditionOnsetOnsetRangeLow = arrConditionOnsetOnsetRange[0];
				    var conditionOnsetOnsetRangeHigh = arrConditionOnsetOnsetRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Family Member History condition onset onset range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'condition onset onset range' in json Family Member History request.";
			}

			if (typeof req.body.onset.onsetPeriod !== 'undefined') {
			  var conditionOnsetOnsetPeriod = req.body.onset.onsetPeriod;
 				if(validator.isEmpty(conditionOnsetOnsetPeriod)) {
				  var conditionOnsetOnsetPeriodStart = "";
				  var conditionOnsetOnsetPeriodEnd = "";
				} else {
				  if (conditionOnsetOnsetPeriod.indexOf("to") > 0) {
				    arrConditionOnsetOnsetPeriod = conditionOnsetOnsetPeriod.split("to");
				    var conditionOnsetOnsetPeriodStart = arrConditionOnsetOnsetPeriod[0];
				    var conditionOnsetOnsetPeriodEnd = arrConditionOnsetOnsetPeriod[1];
				    if (!regex.test(conditionOnsetOnsetPeriodStart) && !regex.test(conditionOnsetOnsetPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Family Member History condition onset onset period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Family Member History condition onset onset period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'condition onset onset period' in json Family Member History request.";
			}

			if(typeof req.body.onset.onsetString !== 'undefined'){
				var conditionOnsetOnsetString =  req.body.onset.onsetString.trim().toLowerCase();
				if(validator.isEmpty(conditionOnsetOnsetString)){
					conditionOnsetOnsetString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'condition onset onset string' in json Family Member History request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkFamilyMemberHistoryID', function(){
							checkUniqeValue(apikey, "CONDITION_ID|" + familyMemberHistoryId, 'CONDITION', function(resFamilyMemberHistoryID){
								if(resFamilyMemberHistoryID.err_code > 0){
									var unicId = uniqid.time();
									var familyMemberHistoryConditionId = 'cos' + unicId;
									//FamilyMemberHistoryCondition
									dataFamilyMemberHistoryCondition = {
										"investigation_id" : familyMemberHistoryConditionId,
										"summary" : stageSummary,
										"clinical_impression_id" : familyMemberHistoryId
									}
									ApiFHIR.post('familyMemberHistoryCondition', {"apikey": apikey}, {body: dataFamilyMemberHistoryCondition, json: true}, function(error, response, body){
										familyMemberHistoryCondition = body;
										if(familyMemberHistoryCondition.err_code == 0){
											res.json({"err_code": 0, "err_msg": "FamilyMemberHistory Stages has been add in this Care Team.", "data": familyMemberHistoryCondition.data});
										}else{
											res.json(familyMemberHistoryCondition);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "FamilyMemberHistory Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkConditionCode', function () {
							if (!validator.isEmpty(conditionCode)) {
								checkCode(apikey, conditionCode, 'CONDITION_CODE', function (resConditionCodeCode) {
									if (resConditionCodeCode.err_code > 0) {
										myEmitter.emit('checkFamilyMemberHistoryID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Condition code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkFamilyMemberHistoryID');
							}
						})

						if (!validator.isEmpty(conditionOutcome)) {
							checkCode(apikey, conditionOutcome, 'CONDITION_OUTCOME', function (resConditionOutcomeCode) {
								if (resConditionOutcomeCode.err_code > 0) {
									myEmitter.emit('checkConditionCode');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Condition outcome code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkConditionCode');
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
		familyMemberHistoryNote: function addFamilyMemberHistoryNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var familyMemberHistoryId = req.params.family_member_history_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof familyMemberHistoryId !== 'undefined'){
				if(validator.isEmpty(familyMemberHistoryId)){
					err_code = 2;
					err_msg = "Family Member History id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Family Member History id is required";
			}
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Family Member History request.";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Family Member History request.";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Family Member History request.";
			}

			if(typeof req.body.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Family Member History request.";
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
				err_msg = "Please add sub-key 'note time' in json Family Member History request.";
			}

			if(typeof req.body.string !== 'undefined'){
				var noteString =  req.body.string.trim().toLowerCase();
				if(validator.isEmpty(noteString)){
					noteString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note string' in json Family Member History request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkFamilyMemberHistoryID', function(){
							checkUniqeValue(apikey, "family_member_history_id|" + familyMemberHistoryId, 'family_member_history', function(resFamilyMemberHistoryID){
								if(resFamilyMemberHistoryID.err_code > 0){
									var unicId = uniqid.time();
									var familyMemberHistoryNoteId = 'afm' + unicId;
									//FamilyMemberHistoryNote
									dataFamilyMemberHistoryNote = {
										"id": familyMemberHistoryNoteId,
										"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
										"author_ref_patient": noteAuthorAuthorReferencePatient,
										"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
										"author_string": noteAuthorAuthorString,
										"time": noteTime,
										"text": noteString,
										"family_member_history_id" : familyMemberHistoryId
									}
									ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataFamilyMemberHistoryNote, json: true}, function(error, response, body){
										familyMemberHistoryNote = body;
										if(familyMemberHistoryNote.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Family Member History Note has been add in this Family Member History.", "data": familyMemberHistoryNote.data});
										}else{
											res.json(familyMemberHistoryNote);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Family Member History Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkFamilyMemberHistoryID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkFamilyMemberHistoryID');
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
		familyMemberHistoryConditionNote: function addFamilyMemberHistoryConditionNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var familyMemberHistoryConditionId = req.params.family_member_history_condition_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof familyMemberHistoryConditionId !== 'undefined'){
				if(validator.isEmpty(familyMemberHistoryConditionId)){
					err_code = 2;
					err_msg = "Family Member History Condition id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Family Member History Condition id is required";
			}
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Family Member History request.";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Family Member History request.";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Family Member History request.";
			}

			if(typeof req.body.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Family Member History request.";
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
				err_msg = "Please add sub-key 'note time' in json Family Member History request.";
			}

			if(typeof req.body.string !== 'undefined'){
				var noteString =  req.body.string.trim().toLowerCase();
				if(validator.isEmpty(noteString)){
					noteString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note string' in json Family Member History request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkFamilyMemberHistoryConditionID', function(){
							checkUniqeValue(apikey, "condition_id|" + familyMemberHistoryConditionId, 'family_member_history_condition', function(resFamilyMemberHistoryConditionID){
								if(resFamilyMemberHistoryConditionID.err_code > 0){
									var unicId = uniqid.time();
									var familyMemberHistoryConditionNoteId = 'afc' + unicId;
									//FamilyMemberHistoryConditionNote
									dataFamilyMemberHistoryConditionNote = {
										"id": familyMemberHistoryConditionNoteId,
										"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
										"author_ref_patient": noteAuthorAuthorReferencePatient,
										"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
										"author_string": noteAuthorAuthorString,
										"time": noteTime,
										"text": noteString,
										"family_member_history_condition_id" : familyMemberHistoryConditionId
									}
									ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataFamilyMemberHistoryConditionNote, json: true}, function(error, response, body){
										familyMemberHistoryConditionNote = body;
										if(familyMemberHistoryConditionNote.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Family Member History Condition Note has been add in this Family Member History Condition.", "data": familyMemberHistoryConditionNote.data});
										}else{
											res.json(familyMemberHistoryConditionNote);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Family Member History Condition Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkFamilyMemberHistoryConditionID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkFamilyMemberHistoryConditionID');
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
		familyMemberHistory : function putFamilyMemberHistory(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var familyMemberHistoryId = req.params.family_member_history_id;

      var err_code = 0;
      var err_msg = "";
      var dataFamilyMemberHistory = {};

			if(typeof familyMemberHistoryId !== 'undefined'){
				if(validator.isEmpty(familyMemberHistoryId)){
					err_code = 2;
					err_msg = "FamilyMemberHistory id is required";
				}
			}else{
				err_code = 2;
				err_msg = "FamilyMemberHistory id is required";
			}
			
			/*
			var status = req.body.status;
			var not_done = req.body.not_done;
			var not_done_reason = req.body.not_done_reason;
			var patient = req.body.patient;
			var date = req.body.date;
			var name = req.body.name;
			var relationship = req.body.relationship;
			var gender = req.body.gender;
			var born_period_start = req.body.born_period_start;
			var born_period_end = req.body.born_period_end;
			var born_date = req.body.born_date;
			var born_string = req.body.born_string;
			var age_age = req.body.age_age;
			var age_range_low = req.body.age_range_low;
			var age_range_high = req.body.age_range_high;
			var age_string = req.body.age_string;
			var estimated_age = req.body.estimated_age;
			var deceased_boolean = req.body.deceased_boolean;
			var deceased_age = req.body.deceased_age;
			var deceased_range_low = req.body.deceased_range_low;
			var deceased_range_high = req.body.deceased_range_high;
			var deceased_date = req.body.deceased_date;
			var deceased_string = req.body.deceased_string;
			var reason_code = req.body.reason_code;
			*/

			/*if(typeof req.body.definition.planDefinition !== 'undefined' && req.body.definition.planDefinition !== ""){
				var definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					dataFamilyMemberHistory.plan_definition = "";
				}else{
					dataFamilyMemberHistory.plan_definition = definitionPlanDefinition;
				}
			}else{
			  definitionPlanDefinition = "";
			}

			if(typeof req.body.definition.questionnaire !== 'undefined' && req.body.definition.questionnaire !== ""){
				var definitionQuestionnaire =  req.body.definition.questionnaire.trim().toLowerCase();
				if(validator.isEmpty(definitionQuestionnaire)){
					dataFamilyMemberHistory.questionnaire = "";
				}else{
					dataFamilyMemberHistory.questionnaire = definitionQuestionnaire;
				}
			}else{
			  definitionQuestionnaire = "";
			}*/

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "family member history status is required.";
				}else{
					dataFamilyMemberHistory.status = status;
				}
			}else{
			  status = "";
			}

			if (typeof req.body.notDone !== 'undefined' && req.body.notDone !== "") {
			  var notDone = req.body.notDone.trim().toLowerCase();
					if(validator.isEmpty(notDone)){
						notDone = "false";
					}
			  if(notDone === "true" || notDone === "false"){
					dataFamilyMemberHistory.not_done = notDone;
			  } else {
			    err_code = 2;
			    err_msg = "Family member history not done is must be boolean.";
			  }
			} else {
			  notDone = "";
			}

			if(typeof req.body.notDoneReason !== 'undefined' && req.body.notDoneReason !== ""){
				var notDoneReason =  req.body.notDoneReason.trim().toLowerCase();
				if(validator.isEmpty(notDoneReason)){
					dataFamilyMemberHistory.not_done_reason = "";
				}else{
					dataFamilyMemberHistory.not_done_reason = notDoneReason;
				}
			}else{
			  notDoneReason = "";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					err_code = 2;
					err_msg = "family member history patient is required.";
				}else{
					dataFamilyMemberHistory.patient = patient;
				}
			}else{
			  patient = "";
			}

			if(typeof req.body.date !== 'undefined' && req.body.date !== ""){
				var date =  req.body.date;
				if(validator.isEmpty(date)){
					err_code = 2;
					err_msg = "family member history date is required.";
				}else{
					if(!regex.test(date)){
						err_code = 2;
						err_msg = "family member history date invalid date format.";	
					}else{
						dataFamilyMemberHistory.date = date;
					}
				}
			}else{
			  date = "";
			}

			if(typeof req.body.name !== 'undefined' && req.body.name !== ""){
				var name =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(name)){
					dataFamilyMemberHistory.name = "";
				}else{
					dataFamilyMemberHistory.name = name;
				}
			}else{
			  name = "";
			}

			if(typeof req.body.relationship !== 'undefined' && req.body.relationship !== ""){
				var relationship =  req.body.relationship.trim().toUpperCase();
				if(validator.isEmpty(relationship)){
					err_code = 2;
					err_msg = "family member history relationship is required.";
				}else{
					dataFamilyMemberHistory.relationship = relationship;
				}
			}else{
			  relationship = "";
			}

			if(typeof req.body.gender !== 'undefined' && req.body.gender !== ""){
				var gender =  req.body.gender.trim().toLowerCase();
				if(validator.isEmpty(gender)){
					dataFamilyMemberHistory.gender = "";
				}else{
					dataFamilyMemberHistory.gender = gender;
				}
			}else{
			  gender = "";
			}

			if (typeof req.body.born.bornPeriod !== 'undefined' && req.body.born.bornPeriod !== "") {
			  var bornBornPeriod = req.body.born.bornPeriod;
			  if (bornBornPeriod.indexOf("to") > 0) {
			    arrBornBornPeriod = bornBornPeriod.split("to");
			    dataFamilyMemberHistory.born_period_start = arrBornBornPeriod[0];
			    dataFamilyMemberHistory.born_period_end = arrBornBornPeriod[1];
			    if (!regex.test(bornBornPeriodStart) && !regex.test(bornBornPeriodEnd)) {
			      err_code = 2;
			      err_msg = "family member history born born period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "family member history born born period invalid date format.";
				}
			} else {
			  bornBornPeriod = "";
			}

			if(typeof req.body.born.bornDate !== 'undefined' && req.body.born.bornDate !== ""){
				var bornBornDate =  req.body.born.bornDate;
				if(validator.isEmpty(bornBornDate)){
					err_code = 2;
					err_msg = "family member history born born date is required.";
				}else{
					if(!regex.test(bornBornDate)){
						err_code = 2;
						err_msg = "family member history born born date invalid date format.";	
					}else{
						dataFamilyMemberHistory.born_date = bornBornDate;
					}
				}
			}else{
			  bornBornDate = "";
			}

			if(typeof req.body.born.bornString !== 'undefined' && req.body.born.bornString !== ""){
				var bornBornString =  req.body.born.bornString.trim().toLowerCase();
				if(validator.isEmpty(bornBornString)){
					dataFamilyMemberHistory.born_string = "";
				}else{
					dataFamilyMemberHistory.born_string = bornBornString;
				}
			}else{
			  bornBornString = "";
			}

			if(typeof req.body.age.ageAge !== 'undefined' && req.body.age.ageAge !== ""){
				var ageAgeAge =  req.body.age.ageAge;
				if(validator.isEmpty(ageAgeAge)){
					dataFamilyMemberHistory.age_age = "";
				}else{
					if(validator.isInt(ageAgeAge)){
						err_code = 2;
						err_msg = "family member history age age age is must be number.";
					}else{
						dataFamilyMemberHistory.age_age = ageAgeAge;
					}
				}
			}else{
			  ageAgeAge = "";
			}

			if (typeof req.body.age.ageRange !== 'undefined' && req.body.age.ageRange !== "") {
			  var ageAgeRange = req.body.age.ageRange;
			  if (ageAgeRange.indexOf("to") > 0) {
			    arrAgeAgeRange = ageAgeRange.split("to");
			    dataFamilyMemberHistory.age_range_low = arrAgeAgeRange[0];
			    dataFamilyMemberHistory.age_range_high = arrAgeAgeRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "family member history age age range invalid range format.";
				}
			} else {
			  ageAgeRange = "";
			}

			if(typeof req.body.age.ageString !== 'undefined' && req.body.age.ageString !== ""){
				var ageAgeString =  req.body.age.ageString.trim().toLowerCase();
				if(validator.isEmpty(ageAgeString)){
					dataFamilyMemberHistory.age_string = "";
				}else{
					dataFamilyMemberHistory.age_string = ageAgeString;
				}
			}else{
			  ageAgeString = "";
			}

			if(typeof req.body.estimatedAge !== 'undefined' && req.body.estimatedAge !== ""){
				var estimatedAge =  req.body.estimatedAge.trim().toLowerCase();
				if(validator.isEmpty(estimatedAge)){
					dataFamilyMemberHistory.estimated_age = "";
				}else{
					dataFamilyMemberHistory.estimated_age = estimatedAge;
				}
			}else{
			  estimatedAge = "";
			}

			if (typeof req.body.deceased.deceasedBoolean !== 'undefined' && req.body.deceased.deceasedBoolean !== "") {
			  var deceasedDeceasedBoolean = req.body.deceased.deceasedBoolean.trim().toLowerCase();
					if(validator.isEmpty(deceasedDeceasedBoolean)){
						deceasedDeceasedBoolean = "false";
					}
			  if(deceasedDeceasedBoolean === "true" || deceasedDeceasedBoolean === "false"){
					dataFamilyMemberHistory.deceased_boolean = deceasedDeceasedBoolean;
			  } else {
			    err_code = 2;
			    err_msg = "Family member history deceased deceased boolean is must be boolean.";
			  }
			} else {
			  deceasedDeceasedBoolean = "";
			}

			if(typeof req.body.deceased.deceasedAge !== 'undefined' && req.body.deceased.deceasedAge !== ""){
				var deceasedDeceasedAge =  req.body.deceased.deceasedAge;
				if(validator.isEmpty(deceasedDeceasedAge)){
					dataFamilyMemberHistory.deceased_age = "";
				}else{
					if(validator.isInt(deceasedDeceasedAge)){
						err_code = 2;
						err_msg = "family member history deceased deceased age is must be number.";
					}else{
						dataFamilyMemberHistory.deceased_age = deceasedDeceasedAge;
					}
				}
			}else{
			  deceasedDeceasedAge = "";
			}

			if (typeof req.body.deceased.deceasedRange !== 'undefined' && req.body.deceased.deceasedRange !== "") {
			  var deceasedDeceasedRange = req.body.deceased.deceasedRange;
			  if (deceasedDeceasedRange.indexOf("to") > 0) {
			    arrDeceasedDeceasedRange = deceasedDeceasedRange.split("to");
			    dataFamilyMemberHistory.deceased_range_low = arrDeceasedDeceasedRange[0];
			    dataFamilyMemberHistory.deceased_range_high = arrDeceasedDeceasedRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "family member history deceased deceased range invalid range format.";
				}
			} else {
			  deceasedDeceasedRange = "";
			}

			if(typeof req.body.deceased.deceasedDate !== 'undefined' && req.body.deceased.deceasedDate !== ""){
				var deceasedDeceasedDate =  req.body.deceased.deceasedDate;
				if(validator.isEmpty(deceasedDeceasedDate)){
					err_code = 2;
					err_msg = "family member history deceased deceased date is required.";
				}else{
					if(!regex.test(deceasedDeceasedDate)){
						err_code = 2;
						err_msg = "family member history deceased deceased date invalid date format.";	
					}else{
						dataFamilyMemberHistory.deceased_date = deceasedDeceasedDate;
					}
				}
			}else{
			  deceasedDeceasedDate = "";
			}

			if(typeof req.body.deceased.deceasedString !== 'undefined' && req.body.deceased.deceasedString !== ""){
				var deceasedDeceasedString =  req.body.deceased.deceasedString.trim().toLowerCase();
				if(validator.isEmpty(deceasedDeceasedString)){
					dataFamilyMemberHistory.deceased_string = "";
				}else{
					dataFamilyMemberHistory.deceased_string = deceasedDeceasedString;
				}
			}else{
			  deceasedDeceasedString = "";
			}

			if(typeof req.body.reasonCode !== 'undefined' && req.body.reasonCode !== ""){
				var reasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(reasonCode)){
					dataFamilyMemberHistory.reason_code = "";
				}else{
					dataFamilyMemberHistory.reason_code = reasonCode;
				}
			}else{
			  reasonCode = "";
			}

			/*if(typeof req.body.reasonReference.condition !== 'undefined' && req.body.reasonReference.condition !== ""){
				var reasonReferenceCondition =  req.body.reasonReference.condition.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceCondition)){
					dataFamilyMemberHistory.condition = "";
				}else{
					dataFamilyMemberHistory.condition = reasonReferenceCondition;
				}
			}else{
			  reasonReferenceCondition = "";
			}

			if(typeof req.body.reasonReference.observation !== 'undefined' && req.body.reasonReference.observation !== ""){
				var reasonReferenceObservation =  req.body.reasonReference.observation.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceObservation)){
					dataFamilyMemberHistory.observation = "";
				}else{
					dataFamilyMemberHistory.observation = reasonReferenceObservation;
				}
			}else{
			  reasonReferenceObservation = "";
			}

			if(typeof req.body.reasonReference.allergyIntolerance !== 'undefined' && req.body.reasonReference.allergyIntolerance !== ""){
				var reasonReferenceAllergyIntolerance =  req.body.reasonReference.allergyIntolerance.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceAllergyIntolerance)){
					dataFamilyMemberHistory.allergy_intolerance = "";
				}else{
					dataFamilyMemberHistory.allergy_intolerance = reasonReferenceAllergyIntolerance;
				}
			}else{
			  reasonReferenceAllergyIntolerance = "";
			}

			if(typeof req.body.reasonReference.questionnaireResponse !== 'undefined' && req.body.reasonReference.questionnaireResponse !== ""){
				var reasonReferenceQuestionnaireResponse =  req.body.reasonReference.questionnaireResponse.trim().toLowerCase();
				if(validator.isEmpty(reasonReferenceQuestionnaireResponse)){
					dataFamilyMemberHistory.questionnaire_response = "";
				}else{
					dataFamilyMemberHistory.questionnaire_response = reasonReferenceQuestionnaireResponse;
				}
			}else{
			  reasonReferenceQuestionnaireResponse = "";
			}*/

			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkFamilyMemberHistoryId', function(){
						checkUniqeValue(apikey, "FAMILY_MEMBER_HISTORY_ID|" + familyMemberHistoryId, 'FAMILY_MEMBER_HISTORY', function(resFamilyMemberHistoryId){
							if(resFamilyMemberHistoryId.err_code > 0){
								ApiFHIR.put('familyMemberHistory', {"apikey": apikey, "_id": familyMemberHistoryId}, {body: dataFamilyMemberHistory, json: true}, function(error, response, body){
									familyMemberHistory = body;
									if(familyMemberHistory.err_code > 0){
										res.json(familyMemberHistory);	
									}else{
										res.json({"err_code": 0, "err_msg": "Family Member History has been update.", "data": [{"_id": familyMemberHistoryId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Family Member History Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkStatus', function () {
						if (!validator.isEmpty(status)) {
							checkCode(apikey, status, 'HISTORY_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) {
									myEmitter.emit('checkFamilyMemberHistoryId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkFamilyMemberHistoryId');
						}
					})

					myEmitter.prependOnceListener('checkNotDoneReason', function () {
						if (!validator.isEmpty(notDoneReason)) {
							checkCode(apikey, notDoneReason, 'HISTORY_NOT_DONE_REASON', function (resNotDoneReasonCode) {
								if (resNotDoneReasonCode.err_code > 0) {
									myEmitter.emit('checkStatus');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Not done reason code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkStatus');
						}
					})

					myEmitter.prependOnceListener('checkRelationship', function () {
						if (!validator.isEmpty(relationship)) {
							checkCode(apikey, relationship, 'FAMILY_MEMBER', function (resRelationshipCode) {
								if (resRelationshipCode.err_code > 0) {
									myEmitter.emit('checkNotDoneReason');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Relationship code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkNotDoneReason');
						}
					})

					myEmitter.prependOnceListener('checkGender', function () {
						if (!validator.isEmpty(gender)) {
							checkCode(apikey, gender, 'ADMINISTRATIVE_GENDER', function (resGenderCode) {
								if (resGenderCode.err_code > 0) {
									myEmitter.emit('checkRelationship');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Gender code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRelationship');
						}
					})

					myEmitter.prependOnceListener('checkReasonCode', function () {
						if (!validator.isEmpty(reasonCode)) {
							checkCode(apikey, reasonCode, 'CLINICAL_FINDINGS', function (resReasonCodeCode) {
								if (resReasonCodeCode.err_code > 0) {
									myEmitter.emit('checkGender');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Reason code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkGender');
						}
					})
					
					if (!validator.isEmpty(patient)) {
						checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
							if (resPatient.err_code > 0) {
								myEmitter.emit('checkReasonCode');
							} else {
								res.json({
									"err_code": "500",
									"err_msg": "Patient id not found"
								});
							}
						})
					} else {
						myEmitter.emit('checkReasonCode');
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
			var familyMemberHistoryId = req.params.family_member_history_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof familyMemberHistoryId !== 'undefined'){
				if(validator.isEmpty(familyMemberHistoryId)){
					err_code = 2;
					err_msg = "Family Member History id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Family Member History id is required";
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
						myEmitter.prependOnceListener('checkFamilyMemberHistoryID', function(){
							checkUniqeValue(apikey, "FAMILY_MEMBER_HISTORY_ID|" + familyMemberHistoryId, 'FAMILY_MEMBER_HISTORY', function(resFamilyMemberHistoryID){
								if(resFamilyMemberHistoryID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "FAMILY_MEMBER_HISTORY_ID|"+familyMemberHistoryId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Family Member History.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Family Member History Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkFamilyMemberHistoryID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkFamilyMemberHistoryID');				
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
		familyMemberHistoryCondition: function updateFamilyMemberHistoryCondition(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var familyMemberHistoryId = req.params.family_member_history_id;
			var familyMemberHistoryConditionId = req.params.family_member_history_condition_id;

			var err_code = 0;
			var err_msg = "";
			var dataFamilyMemberHistory = {};
			//input check 
			if(typeof familyMemberHistoryId !== 'undefined'){
				if(validator.isEmpty(familyMemberHistoryId)){
					err_code = 2;
					err_msg = "FamilyMemberHistory id is required";
				}
			}else{
				err_code = 2;
				err_msg = "FamilyMemberHistory id is required";
			}

			if(typeof familyMemberHistoryConditionId !== 'undefined'){
				if(validator.isEmpty(familyMemberHistoryConditionId)){
					err_code = 2;
					err_msg = "FamilyMemberHistory Stages id is required";
				}
			}else{
				err_code = 2;
				err_msg = "FamilyMemberHistory Stages id is required";
			}
			
			/*
			var code = req.body.code;
			var outcome = req.body.outcome;
			var onset_age = req.body.onset_age;
			var onset_range_low = req.body.onset_range_low;
			var onset_range_high = req.body.onset_range_high;
			var onset_period_start = req.body.onset_period_start;
			var onset_period_end = req.body.onset_period_end;
			var onset_string = req.body.onset_string;
			*/
			
			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var conditionCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(conditionCode)){
					dataFamilyMemberHistory.code = "";
				}else{
					dataFamilyMemberHistory.code = conditionCode;
				}
			}else{
			  conditionCode = "";
			}

			if(typeof req.body.outcome !== 'undefined' && req.body.outcome !== ""){
				var conditionOutcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(conditionOutcome)){
					dataFamilyMemberHistory.outcome = "";
				}else{
					dataFamilyMemberHistory.outcome = conditionOutcome;
				}
			}else{
			  conditionOutcome = "";
			}

			if(typeof req.body.onset.onsetAge !== 'undefined' && req.body.onset.onsetAge !== ""){
				var conditionOnsetOnsetAge =  req.body.onset.onsetAge;
				if(validator.isEmpty(conditionOnsetOnsetAge)){
					dataFamilyMemberHistory.onset_age = "";
				}else{
					if(validator.isInt(conditionOnsetOnsetAge)){
						err_code = 2;
						err_msg = "family member history condition onset onset age is must be number.";
					}else{
						dataFamilyMemberHistory.onset_age = conditionOnsetOnsetAge;
					}
				}
			}else{
			  conditionOnsetOnsetAge = "";
			}

			if (typeof req.body.onset.onsetRange !== 'undefined' && req.body.onset.onsetRange !== "") {
			  var conditionOnsetOnsetRange = req.body.onset.onsetRange;
			  if (conditionOnsetOnsetRange.indexOf("to") > 0) {
			    arrConditionOnsetOnsetRange = conditionOnsetOnsetRange.split("to");
			    dataFamilyMemberHistory.onset_range_low = arrConditionOnsetOnsetRange[0];
			    dataFamilyMemberHistory.onset_range_high = arrConditionOnsetOnsetRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "family member history condition onset onset range invalid range format.";
				}
			} else {
			  conditionOnsetOnsetRange = "";
			}

			if (typeof req.body.onset.onsetPeriod !== 'undefined' && req.body.onset.onsetPeriod !== "") {
			  var conditionOnsetOnsetPeriod = req.body.onset.onsetPeriod;
			  if (conditionOnsetOnsetPeriod.indexOf("to") > 0) {
			    arrConditionOnsetOnsetPeriod = conditionOnsetOnsetPeriod.split("to");
			    dataFamilyMemberHistory.onset_period_start = arrConditionOnsetOnsetPeriod[0];
			    dataFamilyMemberHistory.onset_period_end = arrConditionOnsetOnsetPeriod[1];
			    if (!regex.test(conditionOnsetOnsetPeriodStart) && !regex.test(conditionOnsetOnsetPeriodEnd)) {
			      err_code = 2;
			      err_msg = "family member history condition onset onset period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "family member history condition onset onset period invalid date format.";
				}
			} else {
			  conditionOnsetOnsetPeriod = "";
			}

			if(typeof req.body.onset.onsetString !== 'undefined' && req.body.onset.onsetString !== ""){
				var conditionOnsetOnsetString =  req.body.onset.onsetString.trim().toLowerCase();
				if(validator.isEmpty(conditionOnsetOnsetString)){
					dataFamilyMemberHistory.onset_string = "";
				}else{
					dataFamilyMemberHistory.onset_string = conditionOnsetOnsetString;
				}
			}else{
			  conditionOnsetOnsetString = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkFamilyMemberHistoryID', function(){
							checkUniqeValue(apikey, "FAMILY_MEMBER_HISTORY_ID|" + familyMemberHistoryId, 'FAMILY_MEMBER_HISTORY', function(resFamilyMemberHistoryId){
								if(resFamilyMemberHistoryId.err_code > 0){
									checkUniqeValue(apikey, "CONDITION_ID|" + familyMemberHistoryConditionId, 'FAMILY_MEMBER_HISTORY_CONDITION', function(resFamilyMemberHistoryConditionID){
										if(resFamilyMemberHistoryConditionID.err_code > 0){
											ApiFHIR.put('familyMemberHistoryCondition', {"apikey": apikey, "_id": familyMemberHistoryConditionId, "dr": "FAMILY_MEMBER_HISTORY_ID|"+familyMemberHistoryId}, {body: dataFamilyMemberHistory, json: true}, function(error, response, body){
												familyMemberHistoryCondition = body;
												if(familyMemberHistoryCondition.err_code > 0){
													res.json(familyMemberHistoryCondition);	
												}else{
													res.json({"err_code": 0, "err_msg": "Family Member History Condition has been update in this Family Member History.", "data": familyMemberHistoryCondition.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Family Member History Stages Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Family Member History Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkConditionCode', function () {
							if (!validator.isEmpty(conditionCode)) {
								checkCode(apikey, conditionCode, 'CONDITION_CODE', function (resConditionCodeCode) {
									if (resConditionCodeCode.err_code > 0) {
										myEmitter.emit('checkFamilyMemberHistoryID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Condition code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkFamilyMemberHistoryID');
							}
						})

						if (!validator.isEmpty(conditionOutcome)) {
							checkCode(apikey, conditionOutcome, 'CONDITION_OUTCOME', function (resConditionOutcomeCode) {
								if (resConditionOutcomeCode.err_code > 0) {
									myEmitter.emit('checkConditionCode');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Condition outcome code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkConditionCode');
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
		familyMemberHistoryNote: function updateFamilyMemberHistoryNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var familyMemberHistoryId = req.params.family_member_history_id;
			var familyMemberHistoryNoteId = req.params.family_member_history_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataFamilyMemberHistory = {};
			//input check 
			if(typeof familyMemberHistoryId !== 'undefined'){
				if(validator.isEmpty(familyMemberHistoryId)){
					err_code = 2;
					err_msg = "Family Member History id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Family Member History id is required";
			}

			if(typeof familyMemberHistoryNoteId !== 'undefined'){
				if(validator.isEmpty(familyMemberHistoryNoteId)){
					err_code = 2;
					err_msg = "Family Member History Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Family Member History Note id is required";
			}
			
			/*
			"id": familyMemberHistoryNoteId,
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
					err_msg = "Family Member History note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Family Member History note time invalid date format.";	
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
						myEmitter.once('checkFamilyMemberHistoryID', function(){
							checkUniqeValue(apikey, "family_member_history_id|" + familyMemberHistoryId, 'family_member_history', function(resFamilyMemberHistoryId){
								if(resFamilyMemberHistoryId.err_code > 0){
									checkUniqeValue(apikey, "NOTE_ID|" + familyMemberHistoryNoteId, 'NOTE', function(resFamilyMemberHistoryNoteID){
										if(resFamilyMemberHistoryNoteID.err_code > 0){
											ApiFHIR.put('annotation', {"apikey": apikey, "_id": familyMemberHistoryNoteId, "dr": "family_member_history_id|"+familyMemberHistoryId}, {body: dataFamilyMemberHistory, json: true}, function(error, response, body){
												familyMemberHistoryNote = body;
												if(familyMemberHistoryNote.err_code > 0){
													res.json(familyMemberHistoryNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Family Member History Note has been update in this Family Member History.", "data": familyMemberHistoryNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Family Member History Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Family Member History Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkFamilyMemberHistoryID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkFamilyMemberHistoryID');
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
		familyMemberHistoryConditionNote: function updateFamilyMemberHistoryConditionNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var familyMemberHistoryConditionId = req.params.family_member_history_condition_id;
			var familyMemberHistoryConditionNoteId = req.params.family_member_history_condition_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataFamilyMemberHistoryCondition = {};
			//input check 
			if(typeof familyMemberHistoryConditionId !== 'undefined'){
				if(validator.isEmpty(familyMemberHistoryConditionId)){
					err_code = 2;
					err_msg = "Family Member History Condition id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Family Member History Condition id is required";
			}

			if(typeof familyMemberHistoryConditionNoteId !== 'undefined'){
				if(validator.isEmpty(familyMemberHistoryConditionNoteId)){
					err_code = 2;
					err_msg = "Family Member History Condition Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Family Member History Condition Note id is required";
			}
			
			/*
			"id": familyMemberHistoryConditionNoteId,
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
					err_msg = "family member history note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "family member history note time invalid date format.";	
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
						myEmitter.once('checkFamilyMemberHistoryConditionID', function(){
							checkUniqeValue(apikey, "condition_id|" + familyMemberHistoryConditionId, 'family_member_history_condition', function(resFamilyMemberHistoryConditionId){
								if(resFamilyMemberHistoryConditionId.err_code > 0){
									checkUniqeValue(apikey, "NOTE_ID|" + familyMemberHistoryConditionNoteId, 'NOTE', function(resFamilyMemberHistoryConditionNoteID){
										if(resFamilyMemberHistoryConditionNoteID.err_code > 0){
											ApiFHIR.put('annotation', {"apikey": apikey, "_id": familyMemberHistoryConditionNoteId, "dr": "family_member_history_condition_id|"+familyMemberHistoryConditionId}, {body: dataFamilyMemberHistoryCondition, json: true}, function(error, response, body){
												familyMemberHistoryConditionNote = body;
												if(familyMemberHistoryConditionNote.err_code > 0){
													res.json(familyMemberHistoryConditionNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Family Member History Condition Note has been update in this Family Member History Condition.", "data": familyMemberHistoryConditionNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Family Member History Condition Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Family Member History Condition Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkFamilyMemberHistoryConditionID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkFamilyMemberHistoryConditionID');
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