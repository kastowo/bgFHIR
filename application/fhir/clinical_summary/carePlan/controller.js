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
		carePlan : function getCarePlan(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var carePlanId = req.query._id;
			var activity_code = req.query.activityCode;
			var activity_date = req.query.activityDate;
			var activity_reference = req.query.activityReference;
			var based_on = req.query.basedOn;
			var care_team = req.query.careTeam;
			var category = req.query.category;
			var condition = req.query.condition;
			var context = req.query.context;
			var date = req.query.date;
			var definition = req.query.definition;
			var encounter = req.query.encounter;
			var goal = req.query.goal;
			var identifier = req.query.identifier;
			var intent = req.query.intent;
			var part_of = req.query.partOf;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var replaces = req.query.replaces;
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

			if(typeof carePlanId !== 'undefined'){
				if(!validator.isEmpty(carePlanId)){
					qString._id = carePlanId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Care PLan Id is required."});
				}
			}

			if(typeof activity_code !== 'undefined'){
				if(!validator.isEmpty(activity_code)){
					qString.activity_code = activity_code; 
				}else{
					res.json({"err_code": 1, "err_msg": "activity code is empty."});
				}
			}

			if(typeof activity_date !== 'undefined'){
				if(!validator.isEmpty(activity_date)){
					qString.activity_date = activity_date; 
				}else{
					res.json({"err_code": 1, "err_msg": "activity date is empty."});
				}
			}

			if(typeof activity_reference !== 'undefined'){
				if(!validator.isEmpty(activity_reference)){
					qString.activity_reference = activity_reference; 
				}else{
					res.json({"err_code": 1, "err_msg": "activity reference is empty."});
				}
			}

			if(typeof based_on !== 'undefined'){
				if(!validator.isEmpty(based_on)){
					qString.based_on = based_on; 
				}else{
					res.json({"err_code": 1, "err_msg": "based on is empty."});
				}
			}

			if(typeof care_team !== 'undefined'){
				if(!validator.isEmpty(care_team)){
					qString.care_team = care_team; 
				}else{
					res.json({"err_code": 1, "err_msg": "care team is empty."});
				}
			}

			if(typeof category !== 'undefined'){
				if(!validator.isEmpty(category)){
					qString.category = category; 
				}else{
					res.json({"err_code": 1, "err_msg": "category is empty."});
				}
			}

			if(typeof condition !== 'undefined'){
				if(!validator.isEmpty(condition)){
					qString.condition = condition; 
				}else{
					res.json({"err_code": 1, "err_msg": "condition is empty."});
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

			if(typeof definition !== 'undefined'){
				if(!validator.isEmpty(definition)){
					qString.definition = definition; 
				}else{
					res.json({"err_code": 1, "err_msg": "definition is empty."});
				}
			}

			if(typeof encounter !== 'undefined'){
				if(!validator.isEmpty(encounter)){
					qString.encounter = encounter; 
				}else{
					res.json({"err_code": 1, "err_msg": "encounter is empty."});
				}
			}

			if(typeof goal !== 'undefined'){
				if(!validator.isEmpty(goal)){
					qString.goal = goal; 
				}else{
					res.json({"err_code": 1, "err_msg": "goal is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "identifier is empty."});
				}
			}

			if(typeof intent !== 'undefined'){
				if(!validator.isEmpty(intent)){
					qString.intent = intent; 
				}else{
					res.json({"err_code": 1, "err_msg": "intent is empty."});
				}
			}

			if(typeof part_of !== 'undefined'){
				if(!validator.isEmpty(part_of)){
					qString.part_of = part_of; 
				}else{
					res.json({"err_code": 1, "err_msg": "part of is empty."});
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

			if(typeof replaces !== 'undefined'){
				if(!validator.isEmpty(replaces)){
					qString.replaces = replaces; 
				}else{
					res.json({"err_code": 1, "err_msg": "replaces is empty."});
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
				"CarePlan" : {
					"location": "%(apikey)s/CarePlan",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('CarePlan', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var carePlan = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(carePlan.err_code == 0){
								//cek jumdata dulu
								if(carePlan.data.length > 0){
									newCarePlan = [];
									for(i=0; i < carePlan.data.length; i++){
										myEmitter.once("getIdentifier", function(carePlan, index, newCarePlan, countCarePlan){
											console.log(carePlan);
											//get identifier
											qString = {};
											qString.care_plan_id = carePlan.id;
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
													var objectCarePlan = {};
													objectCarePlan.resourceType = carePlan.resourceType;
													objectCarePlan.id = carePlan.id;
													objectCarePlan.identifier = identifier.data;
													objectCarePlan.status = carePlan.status;
													objectCarePlan.intent = carePlan.intent;
													objectCarePlan.category = carePlan.category;
													objectCarePlan.title = carePlan.title;
													objectCarePlan.subject = carePlan.subject;
													objectCarePlan.context = carePlan.context;
													objectCarePlan.period = carePlan.period;
													objectCarePlan.supportingInfo = carePlan.supportingInfo;

													newCarePlan[index] = objectCarePlan;

													myEmitter.once('getNote', function(carePlan, index, newCarePlan, countCarePlan){
														qString = {};
														qString.care_plan_id = carePlan.id;
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
																var objectCarePlan = {};
																objectCarePlan.resourceType = carePlan.resourceType;
																objectCarePlan.id = carePlan.id;
																objectCarePlan.identifier = carePlan.identifier;
																objectCarePlan.status = carePlan.status;
																objectCarePlan.intent = carePlan.intent;
																objectCarePlan.category = carePlan.category;
																objectCarePlan.title = carePlan.title;
																objectCarePlan.subject = carePlan.subject;
																objectCarePlan.context = carePlan.context;
																objectCarePlan.period = carePlan.period;
																objectCarePlan.supportingInfo = carePlan.supportingInfo;
																objectCarePlan.activity = host + ':' + port + '/' + apikey + '/CarePlan/' +  carePlan.id + '/CarePlanActivity';
																objectCarePlan.note = annotation.data;

																newCarePlan[index] = objectCarePlan;

																myEmitter.once('getCarePlanDefinitionPlanDefinition', function(carePlan, index, newCarePlan, countCarePlan){
																	qString = {};
																	qString.care_plan_id = carePlan.id;
																	seedPhoenixFHIR.path.GET = {
																		"CarePlanDefinitionPlanDefinition" : {
																			"location": "%(apikey)s/CarePlanDefinitionPlanDefinition",
																			"query": qString
																		}
																	}

																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																	ApiFHIR.get('CarePlanDefinitionPlanDefinition', {"apikey": apikey}, {}, function(error, response, body){
																		carePlanDefinitionPlanDefinition = JSON.parse(body);
																		if(carePlanDefinitionPlanDefinition.err_code == 0){
																			var objectCarePlan = {};
																			objectCarePlan.resourceType = carePlan.resourceType;
																			objectCarePlan.id = carePlan.id;
																			objectCarePlan.identifier = carePlan.identifier;
																			var Definition = {};
																			Definition.planDefinition = carePlanDefinitionPlanDefinition.data;
																			objectCarePlan.definition = Definition;
																			objectCarePlan.status = carePlan.status;
																			objectCarePlan.intent = carePlan.intent;
																			objectCarePlan.category = carePlan.category;
																			objectCarePlan.title = carePlan.title;
																			objectCarePlan.subject = carePlan.subject;
																			objectCarePlan.context = carePlan.context;
																			objectCarePlan.period = carePlan.period;
																			objectCarePlan.supportingInfo = carePlan.supportingInfo;
																			objectCarePlan.activity = carePlan.activity;
																			objectCarePlan.note = carePlan.note;

																			newCarePlan[index] = objectCarePlan;

																			myEmitter.once('getCarePlanDefinitionQuestionnaire', function(carePlan, index, newCarePlan, countCarePlan){
																				qString = {};
																				qString.care_plan_id = carePlan.id;
																				seedPhoenixFHIR.path.GET = {
																					"CarePlanDefinitionQuestionnaire" : {
																						"location": "%(apikey)s/CarePlanDefinitionQuestionnaire",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('CarePlanDefinitionQuestionnaire', {"apikey": apikey}, {}, function(error, response, body){
																					carePlanDefinitionQuestionnaire = JSON.parse(body);
																					if(carePlanDefinitionQuestionnaire.err_code == 0){
																						var objectCarePlan = {};
																						objectCarePlan.resourceType = carePlan.resourceType;
																						objectCarePlan.id = carePlan.id;
																						objectCarePlan.identifier = carePlan.identifier;
																						var Definition = {};
																						Definition.planDefinition = carePlan.definition.planDefinition;
																						Definition.questionnaire = CarePlanDefinitionQuestionnaire.data;
																						objectCarePlan.definition = Definition;
																						objectCarePlan.status = carePlan.status;
																						objectCarePlan.intent = carePlan.intent;
																						objectCarePlan.category = carePlan.category;
																						objectCarePlan.title = carePlan.title;
																						objectCarePlan.subject = carePlan.subject;
																						objectCarePlan.context = carePlan.context;
																						objectCarePlan.period = carePlan.period;
																						objectCarePlan.supportingInfo = carePlan.supportingInfo;
																						objectCarePlan.activity = carePlan.activity;
																						objectCarePlan.note = carePlan.note;

																						newCarePlan[index] = objectCarePlan;

																						myEmitter.once('getCarePlanBasedOn', function(carePlan, index, newCarePlan, countCarePlan){
																							qString = {};
																							qString.care_plan_id = carePlan.id;
																							seedPhoenixFHIR.path.GET = {
																								"CarePlanBasedOn" : {
																									"location": "%(apikey)s/CarePlanBasedOn",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('CarePlanBasedOn', {"apikey": apikey}, {}, function(error, response, body){
																								carePlanBasedOn = JSON.parse(body);
																								if(carePlanBasedOn.err_code == 0){
																									var objectCarePlan = {};
																									objectCarePlan.resourceType = carePlan.resourceType;
																									objectCarePlan.id = carePlan.id;
																									objectCarePlan.identifier = carePlan.identifier;
																									objectCarePlan.definition = carePlan.definition;
																									objectCarePlan.basedOn = carePlanBasedOn.data;
																									objectCarePlan.status = carePlan.status;
																									objectCarePlan.intent = carePlan.intent;
																									objectCarePlan.category = carePlan.category;
																									objectCarePlan.title = carePlan.title;
																									objectCarePlan.subject = carePlan.subject;
																									objectCarePlan.context = carePlan.context;
																									objectCarePlan.period = carePlan.period;
																									objectCarePlan.supportingInfo = carePlan.supportingInfo;
																									objectCarePlan.activity = carePlan.activity;
																									objectCarePlan.note = carePlan.note;

																									newCarePlan[index] = objectCarePlan;

																									myEmitter.once('getCarePlanReplaces', function(carePlan, index, newCarePlan, countCarePlan){
																										qString = {};
																										qString.care_plan_id = carePlan.id;
																										seedPhoenixFHIR.path.GET = {
																											"CarePlanReplaces" : {
																												"location": "%(apikey)s/CarePlanReplaces",
																												"query": qString
																											}
																										}

																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																										ApiFHIR.get('CarePlanReplaces', {"apikey": apikey}, {}, function(error, response, body){
																											carePlanReplaces = JSON.parse(body);
																											if(carePlanReplaces.err_code == 0){
																												var objectCarePlan = {};
																												objectCarePlan.resourceType = carePlan.resourceType;
																												objectCarePlan.id = carePlan.id;
																												objectCarePlan.identifier = carePlan.identifier;
																												objectCarePlan.definition = carePlan.definition;
																												objectCarePlan.basedOn = carePlan.basedOn;
																												objectCarePlan.replaces = carePlanReplaces.data;
																												objectCarePlan.status = carePlan.status;
																												objectCarePlan.intent = carePlan.intent;
																												objectCarePlan.category = carePlan.category;
																												objectCarePlan.title = carePlan.title;
																												objectCarePlan.subject = carePlan.subject;
																												objectCarePlan.context = carePlan.context;
																												objectCarePlan.period = carePlan.period;
																												objectCarePlan.supportingInfo = carePlan.supportingInfo;
																												objectCarePlan.activity = carePlan.activity;
																												objectCarePlan.note = carePlan.note;

																												newCarePlan[index] = objectCarePlan;

																												myEmitter.once('getCarePlanPartOf', function(carePlan, index, newCarePlan, countCarePlan){
																													qString = {};
																													qString.care_plan_id = carePlan.id;
																													seedPhoenixFHIR.path.GET = {
																														"CarePlanPartOf" : {
																															"location": "%(apikey)s/CarePlanPartOf",
																															"query": qString
																														}
																													}

																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																													ApiFHIR.get('CarePlanPartOf', {"apikey": apikey}, {}, function(error, response, body){
																														carePlanPartOf = JSON.parse(body);
																														if(carePlanPartOf.err_code == 0){
																															var objectCarePlan = {};
																															objectCarePlan.resourceType = carePlan.resourceType;
																															objectCarePlan.id = carePlan.id;
																															objectCarePlan.identifier = carePlan.identifier;
																															objectCarePlan.definition = carePlan.definition;
																															objectCarePlan.basedOn = carePlan.basedOn;
																															objectCarePlan.replaces = carePlan.replaces;
																															objectCarePlan.partOf = carePlanPartOf.data;
																															objectCarePlan.status = carePlan.status;
																															objectCarePlan.intent = carePlan.intent;
																															objectCarePlan.category = carePlan.category;
																															objectCarePlan.title = carePlan.title;
																															objectCarePlan.subject = carePlan.subject;
																															objectCarePlan.context = carePlan.context;
																															objectCarePlan.period = carePlan.period;
																															objectCarePlan.supportingInfo = carePlan.supportingInfo;
																															objectCarePlan.activity = carePlan.activity;
																															objectCarePlan.note = carePlan.note;

																															newCarePlan[index] = objectCarePlan;

																															myEmitter.once('getCarePlanAuthorPatient', function(carePlan, index, newCarePlan, countCarePlan){
																																qString = {};
																																qString.care_plan_id = carePlan.id;
																																seedPhoenixFHIR.path.GET = {
																																	"CarePlanAuthorPatient" : {
																																		"location": "%(apikey)s/CarePlanAuthorPatient",
																																		"query": qString
																																	}
																																}

																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																ApiFHIR.get('CarePlanAuthorPatient', {"apikey": apikey}, {}, function(error, response, body){
																																	carePlanAuthorPatient = JSON.parse(body);
																																	if(carePlanAuthorPatient.err_code == 0){
																																		var objectCarePlan = {};
																																		objectCarePlan.resourceType = carePlan.resourceType;
																																		objectCarePlan.id = carePlan.id;
																																		objectCarePlan.identifier = carePlan.identifier;
																																		objectCarePlan.definition = carePlan.definition;
																																		objectCarePlan.basedOn = carePlan.basedOn;
																																		objectCarePlan.replaces = carePlan.replaces;
																																		objectCarePlan.partOf = carePlanPartOf.data;
																																		objectCarePlan.status = carePlan.status;
																																		objectCarePlan.intent = carePlan.intent;
																																		objectCarePlan.category = carePlan.category;
																																		objectCarePlan.title = carePlan.title;
																																		objectCarePlan.subject = carePlan.subject;
																																		objectCarePlan.context = carePlan.context;
																																		objectCarePlan.period = carePlan.period;
																																		var Author = {};
																																		Author.patient = carePlanAuthorPatient;
																																		objectCarePlan.author = Author.data;
																																		objectCarePlan.supportingInfo = carePlan.supportingInfo;
																																		objectCarePlan.activity = carePlan.activity;
																																		objectCarePlan.note = carePlan.note;

																																		newCarePlan[index] = objectCarePlan;

																																		myEmitter.once('getCarePlanAuthorPractitioner', function(carePlan, index, newCarePlan, countCarePlan){
																																			qString = {};
																																			qString.care_plan_id = carePlan.id;
																																			seedPhoenixFHIR.path.GET = {
																																				"CarePlanAuthorPractitioner" : {
																																					"location": "%(apikey)s/CarePlanAuthorPractitioner",
																																					"query": qString
																																				}
																																			}

																																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																			ApiFHIR.get('CarePlanAuthorPractitioner', {"apikey": apikey}, {}, function(error, response, body){
																																				carePlanAuthorPractitioner = JSON.parse(body);
																																				if(carePlanAuthorPractitioner.err_code == 0){
																																					var objectCarePlan = {};
																																					objectCarePlan.resourceType = carePlan.resourceType;
																																					objectCarePlan.id = carePlan.id;
																																					objectCarePlan.identifier = carePlan.identifier;
																																					objectCarePlan.definition = carePlan.definition;
																																					objectCarePlan.basedOn = carePlan.basedOn;
																																					objectCarePlan.replaces = carePlan.replaces;
																																					objectCarePlan.partOf = carePlanPartOf.data;
																																					objectCarePlan.status = carePlan.status;
																																					objectCarePlan.intent = carePlan.intent;
																																					objectCarePlan.category = carePlan.category;
																																					objectCarePlan.title = carePlan.title;
																																					objectCarePlan.subject = carePlan.subject;
																																					objectCarePlan.context = carePlan.context;
																																					objectCarePlan.period = carePlan.period;
																																					var Author = {};
																																					Author.patient = carePlan.author.patient;
																																					Author.practitioner = carePlanAuthorPractitioner.data;
																																					objectCarePlan.author = Author;
																																					objectCarePlan.supportingInfo = carePlan.supportingInfo;
																																					objectCarePlan.activity = carePlan.activity;
																																					objectCarePlan.note = carePlan.note;

																																					newCarePlan[index] = objectCarePlan;

																																					myEmitter.once('getCarePlanAuthorRelatedPerson', function(carePlan, index, newCarePlan, countCarePlan){
																																						qString = {};
																																						qString.care_plan_id = carePlan.id;
																																						seedPhoenixFHIR.path.GET = {
																																							"CarePlanAuthorRelatedPerson" : {
																																								"location": "%(apikey)s/CarePlanAuthorRelatedPerson",
																																								"query": qString
																																							}
																																						}

																																						var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																						ApiFHIR.get('CarePlanAuthorRelatedPerson', {"apikey": apikey}, {}, function(error, response, body){
																																							carePlanAuthorRelatedPerson = JSON.parse(body);
																																							if(carePlanAuthorRelatedPerson.err_code == 0){
																																								var objectCarePlan = {};
																																								objectCarePlan.resourceType = carePlan.resourceType;
																																								objectCarePlan.id = carePlan.id;
																																								objectCarePlan.identifier = carePlan.identifier;
																																								objectCarePlan.definition = carePlan.definition;
																																								objectCarePlan.basedOn = carePlan.basedOn;
																																								objectCarePlan.replaces = carePlan.replaces;
																																								objectCarePlan.partOf = carePlanPartOf.data;
																																								objectCarePlan.status = carePlan.status;
																																								objectCarePlan.intent = carePlan.intent;
																																								objectCarePlan.category = carePlan.category;
																																								objectCarePlan.title = carePlan.title;
																																								objectCarePlan.subject = carePlan.subject;
																																								objectCarePlan.context = carePlan.context;
																																								objectCarePlan.period = carePlan.period;
																																								var Author = {};
																																								Author.patient = carePlan.author.patient;
																																								Author.practitioner = carePlan.author.practitioner;
																																								Author.relatedPerson = carePlanAuthorRelatedPerson.data;
																																								objectCarePlan.author = Author;
																																								objectCarePlan.supportingInfo = carePlan.supportingInfo;
																																								objectCarePlan.activity = carePlan.activity;
																																								objectCarePlan.note = carePlan.note;

																																								newCarePlan[index] = objectCarePlan;

																																								myEmitter.once('getCarePlanAuthorOrganization', function(carePlan, index, newCarePlan, countCarePlan){
																																									qString = {};
																																									qString.care_plan_id = carePlan.id;
																																									seedPhoenixFHIR.path.GET = {
																																										"CarePlanAuthorOrganization" : {
																																											"location": "%(apikey)s/CarePlanAuthorOrganization",
																																											"query": qString
																																										}
																																									}

																																									var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																									ApiFHIR.get('CarePlanAuthorOrganization', {"apikey": apikey}, {}, function(error, response, body){
																																										carePlanAuthorOrganization = JSON.parse(body);
																																										if(carePlanAuthorOrganization.err_code == 0){
																																											var objectCarePlan = {};
																																											objectCarePlan.resourceType = carePlan.resourceType;
																																											objectCarePlan.id = carePlan.id;
																																											objectCarePlan.identifier = carePlan.identifier;
																																											objectCarePlan.definition = carePlan.definition;
																																											objectCarePlan.basedOn = carePlan.basedOn;
																																											objectCarePlan.replaces = carePlan.replaces;
																																											objectCarePlan.partOf = carePlanPartOf.data;
																																											objectCarePlan.status = carePlan.status;
																																											objectCarePlan.intent = carePlan.intent;
																																											objectCarePlan.category = carePlan.category;
																																											objectCarePlan.title = carePlan.title;
																																											objectCarePlan.subject = carePlan.subject;
																																											objectCarePlan.context = carePlan.context;
																																											objectCarePlan.period = carePlan.period;
																																											var Author = {};
																																											Author.patient = carePlan.author.patient;
																																											Author.practitioner = carePlan.author.practitioner;
																																											Author.relatedPerson = carePlan.author.relatedPerson;
																																											Author.organization = carePlanAuthorOrganization.data;
																																											objectCarePlan.author = Author;
																																											objectCarePlan.supportingInfo = carePlan.supportingInfo;
																																											objectCarePlan.activity = carePlan.activity;
																																											objectCarePlan.note = carePlan.note;

																																											newCarePlan[index] = objectCarePlan;

																																											myEmitter.once('getCarePlanAuthorCareTeam', function(carePlan, index, newCarePlan, countCarePlan){
																																												qString = {};
																																												qString.care_plan_id = carePlan.id;
																																												seedPhoenixFHIR.path.GET = {
																																													"CarePlanAuthorCareTeam" : {
																																														"location": "%(apikey)s/CarePlanAuthorCareTeam",
																																														"query": qString
																																													}
																																												}

																																												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																												ApiFHIR.get('CarePlanAuthorCareTeam', {"apikey": apikey}, {}, function(error, response, body){
																																													carePlanAuthorCareTeam = JSON.parse(body);
																																													if(carePlanAuthorCareTeam.err_code == 0){
																																														var objectCarePlan = {};
																																														objectCarePlan.resourceType = carePlan.resourceType;
																																														objectCarePlan.id = carePlan.id;
																																														objectCarePlan.identifier = carePlan.identifier;
																																														objectCarePlan.definition = carePlan.definition;
																																														objectCarePlan.basedOn = carePlan.basedOn;
																																														objectCarePlan.replaces = carePlan.replaces;
																																														objectCarePlan.partOf = carePlanPartOf.data;
																																														objectCarePlan.status = carePlan.status;
																																														objectCarePlan.intent = carePlan.intent;
																																														objectCarePlan.category = carePlan.category;
																																														objectCarePlan.title = carePlan.title;
																																														objectCarePlan.subject = carePlan.subject;
																																														objectCarePlan.context = carePlan.context;
																																														objectCarePlan.period = carePlan.period;
																																														var Author = {};
																																														Author.patient = carePlan.author.patient;
																																														Author.practitioner = carePlan.author.practitioner;
																																														Author.relatedPerson = carePlan.author.relatedPerson;
																																														Author.organization = carePlan.author.organization;
																																														Author.careTean = carePlanAuthorCareTeam.data;
																																														objectCarePlan.author = Author;
																																														objectCarePlan.supportingInfo = carePlan.supportingInfo;
																																														objectCarePlan.activity = carePlan.activity;
																																														objectCarePlan.note = carePlan.note;

																																														newCarePlan[index] = objectCarePlan;

																																														myEmitter.once('getCarePlanCareTeam', function(carePlan, index, newCarePlan, countCarePlan){
																																															qString = {};
																																															qString.care_plan_id = carePlan.id;
																																															seedPhoenixFHIR.path.GET = {
																																																"CarePlanCareTeam" : {
																																																	"location": "%(apikey)s/CarePlanCareTeam",
																																																	"query": qString
																																																}
																																															}

																																															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																															ApiFHIR.get('CarePlanCareTeam', {"apikey": apikey}, {}, function(error, response, body){
																																																carePlanCareTeam = JSON.parse(body);
																																																if(carePlanCareTeam.err_code == 0){
																																																	var objectCarePlan = {};
																																																	objectCarePlan.resourceType = carePlan.resourceType;
																																																	objectCarePlan.id = carePlan.id;
																																																	objectCarePlan.identifier = carePlan.identifier;
																																																	objectCarePlan.definition = carePlan.definition;
																																																	objectCarePlan.basedOn = carePlan.basedOn;
																																																	objectCarePlan.replaces = carePlan.replaces;
																																																	objectCarePlan.partOf = carePlanPartOf.data;
																																																	objectCarePlan.status = carePlan.status;
																																																	objectCarePlan.intent = carePlan.intent;
																																																	objectCarePlan.category = carePlan.category;
																																																	objectCarePlan.title = carePlan.title;
																																																	objectCarePlan.subject = carePlan.subject;
																																																	objectCarePlan.context = carePlan.context;
																																																	objectCarePlan.period = carePlan.period;
																																																	objectCarePlan.author = carePlan.author;
																																																	objectCarePlan.careTeam = carePlanCareTeam.data;
																																																	objectCarePlan.supportingInfo = carePlan.supportingInfo;
																																																	objectCarePlan.activity = carePlan.activity;
																																																	objectCarePlan.note = carePlan.note;

																																																	newCarePlan[index] = objectCarePlan;

																																																	myEmitter.once('getCarePlanAddresses', function(carePlan, index, newCarePlan, countCarePlan){
																																																		qString = {};
																																																		qString.care_plan_id = carePlan.id;
																																																		seedPhoenixFHIR.path.GET = {
																																																			"CarePlanAddresses" : {
																																																				"location": "%(apikey)s/CarePlanAddresses",
																																																				"query": qString
																																																			}
																																																		}

																																																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																																		ApiFHIR.get('CarePlanAddresses', {"apikey": apikey}, {}, function(error, response, body){
																																																			carePlanAddresses = JSON.parse(body);
																																																			if(carePlanAddresses.err_code == 0){
																																																				var objectCarePlan = {};
																																																				objectCarePlan.resourceType = carePlan.resourceType;
																																																				objectCarePlan.id = carePlan.id;
																																																				objectCarePlan.identifier = carePlan.identifier;
																																																				objectCarePlan.definition = carePlan.definition;
																																																				objectCarePlan.basedOn = carePlan.basedOn;
																																																				objectCarePlan.replaces = carePlan.replaces;
																																																				objectCarePlan.partOf = carePlanPartOf.data;
																																																				objectCarePlan.status = carePlan.status;
																																																				objectCarePlan.intent = carePlan.intent;
																																																				objectCarePlan.category = carePlan.category;
																																																				objectCarePlan.title = carePlan.title;
																																																				objectCarePlan.subject = carePlan.subject;
																																																				objectCarePlan.context = carePlan.context;
																																																				objectCarePlan.period = carePlan.period;
																																																				objectCarePlan.author = carePlan.author;
																																																				objectCarePlan.careTeam = carePlan.careTeam;
																																																				objectCarePlan.address = carePlanAddresses.data;
																																																				objectCarePlan.supportingInfo = carePlan.supportingInfo;
																																																				objectCarePlan.activity = carePlan.activity;
																																																				objectCarePlan.note = carePlan.note;

																																																				newCarePlan[index] = objectCarePlan;

																																																				myEmitter.once('getCarePlanGoal', function(carePlan, index, newCarePlan, countCarePlan){
																																																					qString = {};
																																																					qString.care_plan_id = carePlan.id;
																																																					seedPhoenixFHIR.path.GET = {
																																																						"CarePlanGoal" : {
																																																							"location": "%(apikey)s/CarePlanGoal",
																																																							"query": qString
																																																						}
																																																					}

																																																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																																					ApiFHIR.get('CarePlanGoal', {"apikey": apikey}, {}, function(error, response, body){
																																																						carePlanGoal = JSON.parse(body);
																																																						if(carePlanGoal.err_code == 0){
																																																							var objectCarePlan = {};
																																																							objectCarePlan.resourceType = carePlan.resourceType;
																																																							objectCarePlan.id = carePlan.id;
																																																							objectCarePlan.identifier = carePlan.identifier;
																																																							objectCarePlan.definition = carePlan.definition;
																																																							objectCarePlan.basedOn = carePlan.basedOn;
																																																							objectCarePlan.replaces = carePlan.replaces;
																																																							objectCarePlan.partOf = carePlanPartOf.data;
																																																							objectCarePlan.status = carePlan.status;
																																																							objectCarePlan.intent = carePlan.intent;
																																																							objectCarePlan.category = carePlan.category;
																																																							objectCarePlan.title = carePlan.title;
																																																							objectCarePlan.subject = carePlan.subject;
																																																							objectCarePlan.context = carePlan.context;
																																																							objectCarePlan.period = carePlan.period;
																																																							objectCarePlan.author = carePlan.author;
																																																							objectCarePlan.careTeam = carePlan.careTeam;
																																																							objectCarePlan.address = carePlan.addresses;
																																																							objectCarePlan.supportingInfo = carePlan.supportingInfo;
																																																							objectCarePlan.goal = carePlanGoal.data;
																																																							objectCarePlan.activity = carePlan.activity;
																																																							objectCarePlan.note = carePlan.note;

																																																							newCarePlan[index] = objectCarePlan;

																																																							if(index == countCarePlan -1 ){
																																																								res.json({"err_code": 0, "data":newCarePlan});				
																																																							}
																																																						}else{
																																																							res.json(carePlanGoal);			
																																																						}
																																																					})
																																																				})
																																																				myEmitter.emit('getCarePlanGoal', objectCarePlan, index, newCarePlan, countCarePlan);																															
																																																			}else{
																																																				res.json(carePlanAddresses);			
																																																			}
																																																		})
																																																	})
																																																	myEmitter.emit('getCarePlanAddresses', objectCarePlan, index, newCarePlan, countCarePlan);																															
																																																}else{
																																																	res.json(carePlanCareTeam);			
																																																}
																																															})
																																														})
																																														myEmitter.emit('getCarePlanCareTeam', objectCarePlan, index, newCarePlan, countCarePlan);																															
																																													}else{
																																														res.json(carePlanAuthorCareTeam);			
																																													}
																																												})
																																											})
																																											myEmitter.emit('getCarePlanAuthorCareTeam', objectCarePlan, index, newCarePlan, countCarePlan);																															
																																										}else{
																																											res.json(carePlanAuthorOrganization);			
																																										}
																																									})
																																								})
																																								myEmitter.emit('getCarePlanAuthorOrganization', objectCarePlan, index, newCarePlan, countCarePlan);																															
																																							}else{
																																								res.json(carePlanAuthorRelatedPerson);			
																																							}
																																						})
																																					})
																																					myEmitter.emit('getCarePlanAuthorRelatedPerson', objectCarePlan, index, newCarePlan, countCarePlan);																															
																																				}else{
																																					res.json(carePlanAuthorPractitioner);			
																																				}
																																			})
																																		})
																																		myEmitter.emit('getCarePlanAuthorPractitioner', objectCarePlan, index, newCarePlan, countCarePlan);																															
																																	}else{
																																		res.json(carePlanAuthorPatient);			
																																	}
																																})
																															})
																															myEmitter.emit('getCarePlanAuthorPatient', objectCarePlan, index, newCarePlan, countCarePlan);																															
																														}else{
																															res.json(carePlanPartOf);			
																														}
																													})
																												})
																												myEmitter.emit('getCarePlanPartOf', objectCarePlan, index, newCarePlan, countCarePlan);
																											}else{
																												res.json(carePlanReplaces);			
																											}
																										})
																									})
																									myEmitter.emit('getCarePlanReplaces', objectCarePlan, index, newCarePlan, countCarePlan);
																								}else{
																									res.json(carePlanBasedOn);			
																								}
																							})
																						})
																						myEmitter.emit('getCarePlanBasedOn', objectCarePlan, index, newCarePlan, countCarePlan);
																					}else{
																						res.json(carePlanDefinitionQuestionnaire);			
																					}
																				})
																			})
																			myEmitter.emit('getCarePlanDefinitionQuestionnaire', objectCarePlan, index, newCarePlan, countCarePlan);
																		}else{
																			res.json(carePlanDefinitionPlanDefinition);			
																		}
																	})
																})
																myEmitter.emit('getCarePlanDefinitionPlanDefinition', objectCarePlan, index, newCarePlan, countCarePlan);
															}else{
																res.json(annotation);			
															}
														})
													})
													myEmitter.emit('getNote', objectCarePlan, index, newCarePlan, countCarePlan);
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", carePlan.data[i], i, newCarePlan, carePlan.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Care plan is empty."});	
								}
							}else{
								res.json(carePlan);
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
			var carePlanId = req.params.care_plan_id;
			var identifierId = req.params.identifier_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "CAREPLAN_ID|" + carePlanId, 'CAREPLAN', function(resCarePlanId){
						if(resCarePlanId.err_code > 0){
							if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
								checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
									if(resIdentifierID.err_code > 0){
										//get identifier
										qString = {};
										qString.care_plan_id = carePlanId;
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
								qString.care_plan_id = carePlanId;
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
							res.json({"err_code": 501, "err_msg": "Care Plan Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		carePlanActivity: function getCarePlanActivity(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var carePlanId = req.params.care_plan_id;
			var carePlanActivityId = req.params.care_plan_activity_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "CAREPLAN_ID|" + carePlanId, 'CAREPLAN', function(resCarePlan){
						if(resCarePlan.err_code > 0){
							if(typeof carePlanActivityId !== 'undefined' && !validator.isEmpty(carePlanActivityId)){
								checkUniqeValue(apikey, "CAREPLAN_ACTIVITY_ID|" + carePlanActivityId, 'CAREPLAN_ACTIVITY', function(resCarePlanActivityID){
									if(resCarePlanActivityID.err_code > 0){
										//get carePlanActivity
										qString = {};
										qString.care_plan_id = carePlanId;
										qString._id = carePlanActivityId;
										seedPhoenixFHIR.path.GET = {
											"CarePlanActivity" : {
												"location": "%(apikey)s/CarePlanActivity",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('CarePlanActivity', {"apikey": apikey}, {}, function(error, response, body){
											carePlanActivity = JSON.parse(body);
											if(carePlanActivity.err_code == 0){
												//res.json({"err_code": 0, "data":carePlanActivity.data});	
												if(carePlanActivity.data.length > 0){
													newCarePlanActivity = [];
													for(i=0; i < carePlanActivity.data.length; i++){
														myEmitter.once('getAnnotation', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
															qString = {};
															qString.care_plan_activity_id = carePlanActivity.id;
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
																	var objectCarePlanActivity = {};
																	objectCarePlanActivity.id = carePlanActivity.id;
																	objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																	objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																	objectCarePlanActivity.progress = annotation.data;
																	objectCarePlanActivity.reference = carePlanActivity.reference;
																	var Detail = {};																	
																	Detail.category = carePlanActivity.detail.category;
																	Detail.definition = carePlanActivity.detail.definition;
																	Detail.code = carePlanActivity.detail.code;
																	Detail.reasonCode = carePlanActivity.detail.reasonCode;
																	Detail.status = carePlanActivity.detail.status;
																	Detail.statusReason = carePlanActivity.detail.statusReason;
																	Detail.prohibited = carePlanActivity.detail.prohibited;
																	Detail.scheduled = carePlanActivity.detail.scheduled;
																	Detail.location = carePlanActivity.detail.location;
																	Detail.product = carePlanActivity.detail.product;
																	Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																	Detail.quantity = carePlanActivity.detail.quantity;
																	Detail.description = carePlanActivity.detail.description;
																	objectCarePlanActivity.detail = Detail;																	

																	newCarePlanActivity[index] = objectCarePlanActivity;

																	myEmitter.once('getCarePlanActivityDetailReasonReference', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																		qString = {};
																		qString.care_plan_activity_id = carePlanActivity.id;
																		seedPhoenixFHIR.path.GET = {
																			"CarePlanActivityDetailReasonReference" : {
																				"location": "%(apikey)s/CarePlanActivityDetailReasonReference",
																				"query": qString
																			}
																		}

																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																		ApiFHIR.get('CarePlanActivityDetailReasonReference', {"apikey": apikey}, {}, function(error, response, body){
																			carePlanActivityDetailReasonReference = JSON.parse(body);
																			if(carePlanActivityDetailReasonReference.err_code == 0){
																				var objectCarePlanActivity = {};
																				objectCarePlanActivity.id = carePlanActivity.id;
																				objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																				objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																				objectCarePlanActivity.progress = carePlanActivity.progress;
																				objectCarePlanActivity.reference = carePlanActivity.reference;
																				var Detail = {};																	
																				Detail.category = carePlanActivity.detail.category;
																				Detail.definition = carePlanActivity.detail.definition;
																				Detail.code = carePlanActivity.detail.code;
																				Detail.reasonCode = carePlanActivity.detail.reasonCode;
																				Detail.status = carePlanActivity.detail.status;
																				Detail.statusReason = carePlanActivity.detail.statusReason;
																				Detail.reasonReference = carePlanActivityDetailReasonReference.data;
																				Detail.prohibited = carePlanActivity.detail.prohibited;
																				Detail.scheduled = carePlanActivity.detail.scheduled;
																				Detail.location = carePlanActivity.detail.location;
																				Detail.product = carePlanActivity.detail.product;
																				Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																				Detail.quantity = carePlanActivity.detail.quantity;
																				Detail.description = carePlanActivity.detail.description;
																				objectCarePlanActivity.detail = Detail;																	

																				newCarePlanActivity[index] = objectCarePlanActivity;

																				myEmitter.once('getCarePlanActivityDetailGoal', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																					qString = {};
																					qString.care_plan_activity_id = carePlanActivity.id;
																					seedPhoenixFHIR.path.GET = {
																						"CarePlanActivityDetailGoal" : {
																							"location": "%(apikey)s/CarePlanActivityDetailGoal",
																							"query": qString
																						}
																					}

																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																					ApiFHIR.get('CarePlanActivityDetailGoal', {"apikey": apikey}, {}, function(error, response, body){
																						carePlanActivityDetailGoal = JSON.parse(body);
																						if(carePlanActivityDetailGoal.err_code == 0){
																							var objectCarePlanActivity = {};
																							objectCarePlanActivity.id = carePlanActivity.id;
																							objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																							objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																							objectCarePlanActivity.progress = carePlanActivity.progress;
																							objectCarePlanActivity.reference = carePlanActivity.reference;
																							var Detail = {};																	
																							Detail.category = carePlanActivity.detail.category;
																							Detail.definition = carePlanActivity.detail.definition;
																							Detail.code = carePlanActivity.detail.code;
																							Detail.reasonCode = carePlanActivity.detail.reasonCode;
																							Detail.status = carePlanActivity.detail.status;
																							Detail.statusReason = carePlanActivity.detail.statusReason;
																							Detail.reasonReference = carePlanActivity.detail.reasonReference;
																							Detail.goal = carePlanActivityDetailGoal.data;
																							Detail.prohibited = carePlanActivity.detail.prohibited;
																							Detail.scheduled = carePlanActivity.detail.scheduled;
																							Detail.location = carePlanActivity.detail.location;
																							Detail.product = carePlanActivity.detail.product;
																							Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																							Detail.quantity = carePlanActivity.detail.quantity;
																							Detail.description = carePlanActivity.detail.description;
																							objectCarePlanActivity.detail = Detail;																	

																							newCarePlanActivity[index] = objectCarePlanActivity;

																							myEmitter.once('getCarePlanActivityDetailGoal', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																								qString = {};
																								qString.care_plan_activity_id = carePlanActivity.id;
																								seedPhoenixFHIR.path.GET = {
																									"CarePlanActivityDetailGoal" : {
																										"location": "%(apikey)s/CarePlanActivityDetailGoal",
																										"query": qString
																									}
																								}

																								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																								ApiFHIR.get('CarePlanActivityDetailGoal', {"apikey": apikey}, {}, function(error, response, body){
																									carePlanActivityDetailGoal = JSON.parse(body);
																									if(carePlanActivityDetailGoal.err_code == 0){
																										var objectCarePlanActivity = {};
																										objectCarePlanActivity.id = carePlanActivity.id;
																										objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																										objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																										objectCarePlanActivity.progress = carePlanActivity.progress;
																										objectCarePlanActivity.reference = carePlanActivity.reference;
																										var Detail = {};																	
																										Detail.category = carePlanActivity.detail.category;
																										Detail.definition = carePlanActivity.detail.definition;
																										Detail.code = carePlanActivity.detail.code;
																										Detail.reasonCode = carePlanActivity.detail.reasonCode;
																										Detail.status = carePlanActivity.detail.status;
																										Detail.statusReason = carePlanActivity.detail.statusReason;
																										Detail.reasonReference = carePlanActivity.detail.reasonReference;
																										Detail.goal = carePlanActivityDetailGoal.data;
																										Detail.prohibited = carePlanActivity.detail.prohibited;
																										Detail.scheduled = carePlanActivity.detail.scheduled;
																										Detail.location = carePlanActivity.detail.location;
																										Detail.product = carePlanActivity.detail.product;
																										Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																										Detail.quantity = carePlanActivity.detail.quantity;
																										Detail.description = carePlanActivity.detail.description;
																										objectCarePlanActivity.detail = Detail;																	

																										newCarePlanActivity[index] = objectCarePlanActivity;

																										myEmitter.once('getCarePlanActivityDetailPerformerPractitioner', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																											qString = {};
																											qString.care_plan_activity_id = carePlanActivity.id;
																											seedPhoenixFHIR.path.GET = {
																												"CarePlanActivityDetailPerformerPractitioner" : {
																													"location": "%(apikey)s/CarePlanActivityDetailPerformerPractitioner",
																													"query": qString
																												}
																											}

																											var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																											ApiFHIR.get('CarePlanActivityDetailPerformerPractitioner', {"apikey": apikey}, {}, function(error, response, body){
																												carePlanActivityDetailPerformerPractitioner = JSON.parse(body);
																												if(carePlanActivityDetailPerformerPractitioner.err_code == 0){
																													var objectCarePlanActivity = {};
																													objectCarePlanActivity.id = carePlanActivity.id;
																													objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																													objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																													objectCarePlanActivity.progress = carePlanActivity.progress;
																													objectCarePlanActivity.reference = carePlanActivity.reference;
																													var Detail = {};																	
																													Detail.category = carePlanActivity.detail.category;
																													Detail.definition = carePlanActivity.detail.definition;
																													Detail.code = carePlanActivity.detail.code;
																													Detail.reasonCode = carePlanActivity.detail.reasonCode;
																													Detail.status = carePlanActivity.detail.status;
																													Detail.statusReason = carePlanActivity.detail.statusReason;
																													Detail.reasonReference = carePlanActivity.detail.reasonReference;
																													Detail.goal = carePlanActivity.detail.goal;
																													Detail.prohibited = carePlanActivity.detail.prohibited;
																													Detail.scheduled = carePlanActivity.detail.scheduled;
																													Detail.location = carePlanActivity.detail.location;
																													var Performer = {};
																													Performer.practitioner = carePlanActivityDetailPerformerPractitioner.data;
																													Detail.performer = Performer;
																													Detail.product = carePlanActivity.detail.product;
																													Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																													Detail.quantity = carePlanActivity.detail.quantity;
																													Detail.description = carePlanActivity.detail.description;
																													objectCarePlanActivity.detail = Detail;																	

																													newCarePlanActivity[index] = objectCarePlanActivity;

																													myEmitter.once('getCarePlanActivityDetailPerformerOrganization', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																														qString = {};
																														qString.care_plan_activity_id = carePlanActivity.id;
																														seedPhoenixFHIR.path.GET = {
																															"CarePlanActivityDetailPerformerOrganization" : {
																																"location": "%(apikey)s/CarePlanActivityDetailPerformerOrganization",
																																"query": qString
																															}
																														}

																														var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																														ApiFHIR.get('CarePlanActivityDetailPerformerOrganization', {"apikey": apikey}, {}, function(error, response, body){
																															carePlanActivityDetailPerformerOrganization = JSON.parse(body);
																															if(carePlanActivityDetailPerformerOrganization.err_code == 0){
																																var objectCarePlanActivity = {};
																																objectCarePlanActivity.id = carePlanActivity.id;
																																objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																																objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																																objectCarePlanActivity.progress = carePlanActivity.progress;
																																objectCarePlanActivity.reference = carePlanActivity.reference;
																																var Detail = {};																	
																																Detail.category = carePlanActivity.detail.category;
																																Detail.definition = carePlanActivity.detail.definition;
																																Detail.code = carePlanActivity.detail.code;
																																Detail.reasonCode = carePlanActivity.detail.reasonCode;
																																Detail.status = carePlanActivity.detail.status;
																																Detail.statusReason = carePlanActivity.detail.statusReason;
																																Detail.reasonReference = carePlanActivity.detail.reasonReference;
																																Detail.goal = carePlanActivity.detail.goal;
																																Detail.prohibited = carePlanActivity.detail.prohibited;
																																Detail.scheduled = carePlanActivity.detail.scheduled;
																																Detail.location = carePlanActivity.detail.location;
																																var Performer = {};
																																Performer.practitioner = carePlanActivity.detail.performer.practitioner;
																																Performer.organization = carePlanActivityDetailPerformerOrganization.data;
																																Detail.performer = Performer;
																																Detail.product = carePlanActivity.detail.product;
																																Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																																Detail.quantity = carePlanActivity.detail.quantity;
																																Detail.description = carePlanActivity.detail.description;
																																objectCarePlanActivity.detail = Detail;																	

																																newCarePlanActivity[index] = objectCarePlanActivity;

																																myEmitter.once('getCarePlanActivityDetailPerformerRelatedPerson', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																																	qString = {};
																																	qString.care_plan_activity_id = carePlanActivity.id;
																																	seedPhoenixFHIR.path.GET = {
																																		"CarePlanActivityDetailPerformerRelatedPerson" : {
																																			"location": "%(apikey)s/CarePlanActivityDetailPerformerRelatedPerson",
																																			"query": qString
																																		}
																																	}

																																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																	ApiFHIR.get('CarePlanActivityDetailPerformerRelatedPerson', {"apikey": apikey}, {}, function(error, response, body){
																																		carePlanActivityDetailPerformerRelatedPerson = JSON.parse(body);
																																		if(carePlanActivityDetailPerformerRelatedPerson.err_code == 0){
																																			var objectCarePlanActivity = {};
																																			objectCarePlanActivity.id = carePlanActivity.id;
																																			objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																																			objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																																			objectCarePlanActivity.progress = carePlanActivity.progress;
																																			objectCarePlanActivity.reference = carePlanActivity.reference;
																																			var Detail = {};																	
																																			Detail.category = carePlanActivity.detail.category;
																																			Detail.definition = carePlanActivity.detail.definition;
																																			Detail.code = carePlanActivity.detail.code;
																																			Detail.reasonCode = carePlanActivity.detail.reasonCode;
																																			Detail.status = carePlanActivity.detail.status;
																																			Detail.statusReason = carePlanActivity.detail.statusReason;
																																			Detail.reasonReference = carePlanActivity.detail.reasonReference;
																																			Detail.goal = carePlanActivity.detail.goal;
																																			Detail.prohibited = carePlanActivity.detail.prohibited;
																																			Detail.scheduled = carePlanActivity.detail.scheduled;
																																			Detail.location = carePlanActivity.detail.location;
																																			var Performer = {};
																																			Performer.practitioner = carePlanActivity.detail.performer.practitioner;
																																			Performer.organization = carePlanActivity.detail.performer.organization;
																																			Performer.relatedPerson = carePlanActivityDetailPerformerRelatedPerson.data;
																																			Detail.performer = Performer;
																																			Detail.product = carePlanActivity.detail.product;
																																			Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																																			Detail.quantity = carePlanActivity.detail.quantity;
																																			Detail.description = carePlanActivity.detail.description;
																																			objectCarePlanActivity.detail = Detail;																	

																																			newCarePlanActivity[index] = objectCarePlanActivity;

																																			myEmitter.once('getCarePlanActivityDetailPerformerPatient', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																																				qString = {};
																																				qString.care_plan_activity_id = carePlanActivity.id;
																																				seedPhoenixFHIR.path.GET = {
																																					"CarePlanActivityDetailPerformerPatient" : {
																																						"location": "%(apikey)s/CarePlanActivityDetailPerformerPatient",
																																						"query": qString
																																					}
																																				}

																																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																				ApiFHIR.get('CarePlanActivityDetailPerformerPatient', {"apikey": apikey}, {}, function(error, response, body){
																																					carePlanActivityDetailPerformerPatient = JSON.parse(body);
																																					if(carePlanActivityDetailPerformerPatient.err_code == 0){
																																						var objectCarePlanActivity = {};
																																						objectCarePlanActivity.id = carePlanActivity.id;
																																						objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																																						objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																																						objectCarePlanActivity.progress = carePlanActivity.progress;
																																						objectCarePlanActivity.reference = carePlanActivity.reference;
																																						var Detail = {};																	
																																						Detail.category = carePlanActivity.detail.category;
																																						Detail.definition = carePlanActivity.detail.definition;
																																						Detail.code = carePlanActivity.detail.code;
																																						Detail.reasonCode = carePlanActivity.detail.reasonCode;
																																						Detail.status = carePlanActivity.detail.status;
																																						Detail.statusReason = carePlanActivity.detail.statusReason;
																																						Detail.reasonReference = carePlanActivity.detail.reasonReference;
																																						Detail.goal = carePlanActivity.detail.goal;
																																						Detail.prohibited = carePlanActivity.detail.prohibited;
																																						Detail.scheduled = carePlanActivity.detail.scheduled;
																																						Detail.location = carePlanActivity.detail.location;
																																						var Performer = {};
																																						Performer.practitioner = carePlanActivity.detail.performer.practitioner;
																																						Performer.organization = carePlanActivity.detail.performer.organization;
																																						Performer.relatedPerson = carePlanActivity.detail.performer.relatedPerson;
																																						Performer.patient = carePlanActivityDetailPerformerPatient.data;
																																						Detail.performer = Performer;
																																						Detail.product = carePlanActivity.detail.product;
																																						Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																																						Detail.quantity = carePlanActivity.detail.quantity;
																																						Detail.description = carePlanActivity.detail.description;
																																						objectCarePlanActivity.detail = Detail;																	

																																						newCarePlanActivity[index] = objectCarePlanActivity;

																																						myEmitter.once('getCarePlanActivityDetailPerformerCareTeam', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																																							qString = {};
																																							qString.care_plan_activity_id = carePlanActivity.id;
																																							seedPhoenixFHIR.path.GET = {
																																								"CarePlanActivityDetailPerformerCareTeam" : {
																																									"location": "%(apikey)s/CarePlanActivityDetailPerformerCareTeam",
																																									"query": qString
																																								}
																																							}

																																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																							ApiFHIR.get('CarePlanActivityDetailPerformerCareTeam', {"apikey": apikey}, {}, function(error, response, body){
																																								carePlanActivityDetailPerformerCareTeam = JSON.parse(body);
																																								if(carePlanActivityDetailPerformerCareTeam.err_code == 0){
																																									var objectCarePlanActivity = {};
																																									objectCarePlanActivity.id = carePlanActivity.id;
																																									objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																																									objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																																									objectCarePlanActivity.progress = carePlanActivity.progress;
																																									objectCarePlanActivity.reference = carePlanActivity.reference;
																																									var Detail = {};																	
																																									Detail.category = carePlanActivity.detail.category;
																																									Detail.definition = carePlanActivity.detail.definition;
																																									Detail.code = carePlanActivity.detail.code;
																																									Detail.reasonCode = carePlanActivity.detail.reasonCode;
																																									Detail.status = carePlanActivity.detail.status;
																																									Detail.statusReason = carePlanActivity.detail.statusReason;
																																									Detail.reasonReference = carePlanActivity.detail.reasonReference;
																																									Detail.goal = carePlanActivity.detail.goal;
																																									Detail.prohibited = carePlanActivity.detail.prohibited;
																																									Detail.scheduled = carePlanActivity.detail.scheduled;
																																									Detail.location = carePlanActivity.detail.location;
																																									var Performer = {};
																																									Performer.practitioner = carePlanActivity.detail.performer.practitioner;
																																									Performer.organization = carePlanActivity.detail.performer.organization;
																																									Performer.relatedPerson = carePlanActivity.detail.performer.relatedPerson;
																																									Performer.patient = carePlanActivity.detail.performer.data;
																																									Performer.careTeam = carePlanActivityDetailPerformerCareTeam.data;
																																									Detail.performer = Performer;
																																									Detail.product = carePlanActivity.detail.product;
																																									Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																																									Detail.quantity = carePlanActivity.detail.quantity;
																																									Detail.description = carePlanActivity.detail.description;
																																									objectCarePlanActivity.detail = Detail;																	

																																									newCarePlanActivity[index] = objectCarePlanActivity;

																																									if(index == countCarePlanActivity -1 ){
																																										res.json({"err_code": 0, "data":newCarePlanActivity});	
																																									}
																																								}else{
																																									res.json(carePlanActivityDetailPerformerCareTeam);			
																																								}
																																							})
																																						})
																																						myEmitter.emit('getCarePlanActivityDetailPerformerCareTeam', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																
																																					}else{
																																						res.json(carePlanActivityDetailPerformerPatient);			
																																					}
																																				})
																																			})
																																			myEmitter.emit('getCarePlanActivityDetailPerformerPatient', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																
																																		}else{
																																			res.json(carePlanActivityDetailPerformerRelatedPerson);			
																																		}
																																	})
																																})
																																myEmitter.emit('getCarePlanActivityDetailPerformerRelatedPerson', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																	
																															}else{
																																res.json(carePlanActivityDetailPerformerOrganization);			
																															}
																														})
																													})
																													myEmitter.emit('getCarePlanActivityDetailPerformerOrganization', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																	
																												}else{
																													res.json(carePlanActivityDetailPerformerPractitioner);			
																												}
																											})
																										})
																										myEmitter.emit('getCarePlanActivityDetailPerformerPractitioner', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																	
																									}else{
																										res.json(carePlanActivityDetailGoal);			
																									}
																								})
																							})
																							myEmitter.emit('getCarePlanActivityDetailGoal', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																	
																						}else{
																							res.json(carePlanActivityDetailGoal);			
																						}
																					})
																				})
																				myEmitter.emit('getCarePlanActivityDetailGoal', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																	
																			}else{
																				res.json(carePlanActivityDetailReasonReference);			
																			}
																		})
																	})
																	myEmitter.emit('getCarePlanActivityDetailReasonReference', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																	
																}else{
																	res.json(annotation);			
																}
															})
														})
														myEmitter.emit('getAnnotation', carePlanActivity.data[i], i, newCarePlanActivity, carePlanActivity.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "care plan activity is empty."});	
												}
											}else{
												res.json(carePlanActivity);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Care Plan Activity Id not found"});		
									}
								})
							}else{
								//get carePlanActivity
								qString = {};
								qString.care_plan_id = carePlanId;
								seedPhoenixFHIR.path.GET = {
									"CarePlanActivity" : {
										"location": "%(apikey)s/CarePlanActivity",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('CarePlanActivity', {"apikey": apikey}, {}, function(error, response, body){
									carePlanActivity = JSON.parse(body);
									if(carePlanActivity.err_code == 0){
										//res.json({"err_code": 0, "data":carePlanActivity.data});	
										if(carePlanActivity.data.length > 0){
											newCarePlanActivity = [];
											for(i=0; i < carePlanActivity.data.length; i++){
												myEmitter.once('getAnnotation', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
													qString = {};
													qString.care_plan_activity_id = carePlanActivity.id;
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
															var objectCarePlanActivity = {};
															objectCarePlanActivity.id = carePlanActivity.id;
															objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
															objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
															objectCarePlanActivity.progress = annotation.data;
															objectCarePlanActivity.reference = carePlanActivity.reference;
															var Detail = {};																	
															Detail.category = carePlanActivity.detail.category;
															Detail.definition = carePlanActivity.detail.definition;
															Detail.code = carePlanActivity.detail.code;
															Detail.reasonCode = carePlanActivity.detail.reasonCode;
															Detail.status = carePlanActivity.detail.status;
															Detail.statusReason = carePlanActivity.detail.statusReason;
															Detail.prohibited = carePlanActivity.detail.prohibited;
															Detail.scheduled = carePlanActivity.detail.scheduled;
															Detail.location = carePlanActivity.detail.location;
															Detail.product = carePlanActivity.detail.product;
															Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
															Detail.quantity = carePlanActivity.detail.quantity;
															Detail.description = carePlanActivity.detail.description;
															objectCarePlanActivity.detail = Detail;																	

															newCarePlanActivity[index] = objectCarePlanActivity;

															myEmitter.once('getCarePlanActivityDetailReasonReference', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																qString = {};
																qString.care_plan_activity_id = carePlanActivity.id;
																seedPhoenixFHIR.path.GET = {
																	"CarePlanActivityDetailReasonReference" : {
																		"location": "%(apikey)s/CarePlanActivityDetailReasonReference",
																		"query": qString
																	}
																}

																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																ApiFHIR.get('CarePlanActivityDetailReasonReference', {"apikey": apikey}, {}, function(error, response, body){
																	carePlanActivityDetailReasonReference = JSON.parse(body);
																	if(carePlanActivityDetailReasonReference.err_code == 0){
																		var objectCarePlanActivity = {};
																		objectCarePlanActivity.id = carePlanActivity.id;
																		objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																		objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																		objectCarePlanActivity.progress = carePlanActivity.progress;
																		objectCarePlanActivity.reference = carePlanActivity.reference;
																		var Detail = {};																	
																		Detail.category = carePlanActivity.detail.category;
																		Detail.definition = carePlanActivity.detail.definition;
																		Detail.code = carePlanActivity.detail.code;
																		Detail.reasonCode = carePlanActivity.detail.reasonCode;
																		Detail.status = carePlanActivity.detail.status;
																		Detail.statusReason = carePlanActivity.detail.statusReason;
																		Detail.reasonReference = carePlanActivityDetailReasonReference.data;
																		Detail.prohibited = carePlanActivity.detail.prohibited;
																		Detail.scheduled = carePlanActivity.detail.scheduled;
																		Detail.location = carePlanActivity.detail.location;
																		Detail.product = carePlanActivity.detail.product;
																		Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																		Detail.quantity = carePlanActivity.detail.quantity;
																		Detail.description = carePlanActivity.detail.description;
																		objectCarePlanActivity.detail = Detail;																	

																		newCarePlanActivity[index] = objectCarePlanActivity;

																		myEmitter.once('getCarePlanActivityDetailGoal', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																			qString = {};
																			qString.care_plan_activity_id = carePlanActivity.id;
																			seedPhoenixFHIR.path.GET = {
																				"CarePlanActivityDetailGoal" : {
																					"location": "%(apikey)s/CarePlanActivityDetailGoal",
																					"query": qString
																				}
																			}

																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																			ApiFHIR.get('CarePlanActivityDetailGoal', {"apikey": apikey}, {}, function(error, response, body){
																				carePlanActivityDetailGoal = JSON.parse(body);
																				if(carePlanActivityDetailGoal.err_code == 0){
																					var objectCarePlanActivity = {};
																					objectCarePlanActivity.id = carePlanActivity.id;
																					objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																					objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																					objectCarePlanActivity.progress = carePlanActivity.progress;
																					objectCarePlanActivity.reference = carePlanActivity.reference;
																					var Detail = {};																	
																					Detail.category = carePlanActivity.detail.category;
																					Detail.definition = carePlanActivity.detail.definition;
																					Detail.code = carePlanActivity.detail.code;
																					Detail.reasonCode = carePlanActivity.detail.reasonCode;
																					Detail.status = carePlanActivity.detail.status;
																					Detail.statusReason = carePlanActivity.detail.statusReason;
																					Detail.reasonReference = carePlanActivity.detail.reasonReference;
																					Detail.goal = carePlanActivityDetailGoal.data;
																					Detail.prohibited = carePlanActivity.detail.prohibited;
																					Detail.scheduled = carePlanActivity.detail.scheduled;
																					Detail.location = carePlanActivity.detail.location;
																					Detail.product = carePlanActivity.detail.product;
																					Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																					Detail.quantity = carePlanActivity.detail.quantity;
																					Detail.description = carePlanActivity.detail.description;
																					objectCarePlanActivity.detail = Detail;																	

																					newCarePlanActivity[index] = objectCarePlanActivity;

																					myEmitter.once('getCarePlanActivityDetailGoal', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																						qString = {};
																						qString.care_plan_activity_id = carePlanActivity.id;
																						seedPhoenixFHIR.path.GET = {
																							"CarePlanActivityDetailGoal" : {
																								"location": "%(apikey)s/CarePlanActivityDetailGoal",
																								"query": qString
																							}
																						}

																						var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																						ApiFHIR.get('CarePlanActivityDetailGoal', {"apikey": apikey}, {}, function(error, response, body){
																							carePlanActivityDetailGoal = JSON.parse(body);
																							if(carePlanActivityDetailGoal.err_code == 0){
																								var objectCarePlanActivity = {};
																								objectCarePlanActivity.id = carePlanActivity.id;
																								objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																								objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																								objectCarePlanActivity.progress = carePlanActivity.progress;
																								objectCarePlanActivity.reference = carePlanActivity.reference;
																								var Detail = {};																	
																								Detail.category = carePlanActivity.detail.category;
																								Detail.definition = carePlanActivity.detail.definition;
																								Detail.code = carePlanActivity.detail.code;
																								Detail.reasonCode = carePlanActivity.detail.reasonCode;
																								Detail.status = carePlanActivity.detail.status;
																								Detail.statusReason = carePlanActivity.detail.statusReason;
																								Detail.reasonReference = carePlanActivity.detail.reasonReference;
																								Detail.goal = carePlanActivityDetailGoal.data;
																								Detail.prohibited = carePlanActivity.detail.prohibited;
																								Detail.scheduled = carePlanActivity.detail.scheduled;
																								Detail.location = carePlanActivity.detail.location;
																								Detail.product = carePlanActivity.detail.product;
																								Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																								Detail.quantity = carePlanActivity.detail.quantity;
																								Detail.description = carePlanActivity.detail.description;
																								objectCarePlanActivity.detail = Detail;																	

																								newCarePlanActivity[index] = objectCarePlanActivity;

																								myEmitter.once('getCarePlanActivityDetailPerformerPractitioner', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																									qString = {};
																									qString.care_plan_activity_id = carePlanActivity.id;
																									seedPhoenixFHIR.path.GET = {
																										"CarePlanActivityDetailPerformerPractitioner" : {
																											"location": "%(apikey)s/CarePlanActivityDetailPerformerPractitioner",
																											"query": qString
																										}
																									}

																									var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																									ApiFHIR.get('CarePlanActivityDetailPerformerPractitioner', {"apikey": apikey}, {}, function(error, response, body){
																										carePlanActivityDetailPerformerPractitioner = JSON.parse(body);
																										if(carePlanActivityDetailPerformerPractitioner.err_code == 0){
																											var objectCarePlanActivity = {};
																											objectCarePlanActivity.id = carePlanActivity.id;
																											objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																											objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																											objectCarePlanActivity.progress = carePlanActivity.progress;
																											objectCarePlanActivity.reference = carePlanActivity.reference;
																											var Detail = {};																	
																											Detail.category = carePlanActivity.detail.category;
																											Detail.definition = carePlanActivity.detail.definition;
																											Detail.code = carePlanActivity.detail.code;
																											Detail.reasonCode = carePlanActivity.detail.reasonCode;
																											Detail.status = carePlanActivity.detail.status;
																											Detail.statusReason = carePlanActivity.detail.statusReason;
																											Detail.reasonReference = carePlanActivity.detail.reasonReference;
																											Detail.goal = carePlanActivity.detail.goal;
																											Detail.prohibited = carePlanActivity.detail.prohibited;
																											Detail.scheduled = carePlanActivity.detail.scheduled;
																											Detail.location = carePlanActivity.detail.location;
																											var Performer = {};
																											Performer.practitioner = carePlanActivityDetailPerformerPractitioner.data;
																											Detail.performer = Performer;
																											Detail.product = carePlanActivity.detail.product;
																											Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																											Detail.quantity = carePlanActivity.detail.quantity;
																											Detail.description = carePlanActivity.detail.description;
																											objectCarePlanActivity.detail = Detail;																	

																											newCarePlanActivity[index] = objectCarePlanActivity;

																											myEmitter.once('getCarePlanActivityDetailPerformerOrganization', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																												qString = {};
																												qString.care_plan_activity_id = carePlanActivity.id;
																												seedPhoenixFHIR.path.GET = {
																													"CarePlanActivityDetailPerformerOrganization" : {
																														"location": "%(apikey)s/CarePlanActivityDetailPerformerOrganization",
																														"query": qString
																													}
																												}

																												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																												ApiFHIR.get('CarePlanActivityDetailPerformerOrganization', {"apikey": apikey}, {}, function(error, response, body){
																													carePlanActivityDetailPerformerOrganization = JSON.parse(body);
																													if(carePlanActivityDetailPerformerOrganization.err_code == 0){
																														var objectCarePlanActivity = {};
																														objectCarePlanActivity.id = carePlanActivity.id;
																														objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																														objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																														objectCarePlanActivity.progress = carePlanActivity.progress;
																														objectCarePlanActivity.reference = carePlanActivity.reference;
																														var Detail = {};																	
																														Detail.category = carePlanActivity.detail.category;
																														Detail.definition = carePlanActivity.detail.definition;
																														Detail.code = carePlanActivity.detail.code;
																														Detail.reasonCode = carePlanActivity.detail.reasonCode;
																														Detail.status = carePlanActivity.detail.status;
																														Detail.statusReason = carePlanActivity.detail.statusReason;
																														Detail.reasonReference = carePlanActivity.detail.reasonReference;
																														Detail.goal = carePlanActivity.detail.goal;
																														Detail.prohibited = carePlanActivity.detail.prohibited;
																														Detail.scheduled = carePlanActivity.detail.scheduled;
																														Detail.location = carePlanActivity.detail.location;
																														var Performer = {};
																														Performer.practitioner = carePlanActivity.detail.performer.practitioner;
																														Performer.organization = carePlanActivityDetailPerformerOrganization.data;
																														Detail.performer = Performer;
																														Detail.product = carePlanActivity.detail.product;
																														Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																														Detail.quantity = carePlanActivity.detail.quantity;
																														Detail.description = carePlanActivity.detail.description;
																														objectCarePlanActivity.detail = Detail;																	

																														newCarePlanActivity[index] = objectCarePlanActivity;

																														myEmitter.once('getCarePlanActivityDetailPerformerRelatedPerson', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																															qString = {};
																															qString.care_plan_activity_id = carePlanActivity.id;
																															seedPhoenixFHIR.path.GET = {
																																"CarePlanActivityDetailPerformerRelatedPerson" : {
																																	"location": "%(apikey)s/CarePlanActivityDetailPerformerRelatedPerson",
																																	"query": qString
																																}
																															}

																															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																															ApiFHIR.get('CarePlanActivityDetailPerformerRelatedPerson', {"apikey": apikey}, {}, function(error, response, body){
																																carePlanActivityDetailPerformerRelatedPerson = JSON.parse(body);
																																if(carePlanActivityDetailPerformerRelatedPerson.err_code == 0){
																																	var objectCarePlanActivity = {};
																																	objectCarePlanActivity.id = carePlanActivity.id;
																																	objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																																	objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																																	objectCarePlanActivity.progress = carePlanActivity.progress;
																																	objectCarePlanActivity.reference = carePlanActivity.reference;
																																	var Detail = {};																	
																																	Detail.category = carePlanActivity.detail.category;
																																	Detail.definition = carePlanActivity.detail.definition;
																																	Detail.code = carePlanActivity.detail.code;
																																	Detail.reasonCode = carePlanActivity.detail.reasonCode;
																																	Detail.status = carePlanActivity.detail.status;
																																	Detail.statusReason = carePlanActivity.detail.statusReason;
																																	Detail.reasonReference = carePlanActivity.detail.reasonReference;
																																	Detail.goal = carePlanActivity.detail.goal;
																																	Detail.prohibited = carePlanActivity.detail.prohibited;
																																	Detail.scheduled = carePlanActivity.detail.scheduled;
																																	Detail.location = carePlanActivity.detail.location;
																																	var Performer = {};
																																	Performer.practitioner = carePlanActivity.detail.performer.practitioner;
																																	Performer.organization = carePlanActivity.detail.performer.organization;
																																	Performer.relatedPerson = carePlanActivityDetailPerformerRelatedPerson.data;
																																	Detail.performer = Performer;
																																	Detail.product = carePlanActivity.detail.product;
																																	Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																																	Detail.quantity = carePlanActivity.detail.quantity;
																																	Detail.description = carePlanActivity.detail.description;
																																	objectCarePlanActivity.detail = Detail;																	

																																	newCarePlanActivity[index] = objectCarePlanActivity;

																																	myEmitter.once('getCarePlanActivityDetailPerformerPatient', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																																		qString = {};
																																		qString.care_plan_activity_id = carePlanActivity.id;
																																		seedPhoenixFHIR.path.GET = {
																																			"CarePlanActivityDetailPerformerPatient" : {
																																				"location": "%(apikey)s/CarePlanActivityDetailPerformerPatient",
																																				"query": qString
																																			}
																																		}

																																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																		ApiFHIR.get('CarePlanActivityDetailPerformerPatient', {"apikey": apikey}, {}, function(error, response, body){
																																			carePlanActivityDetailPerformerPatient = JSON.parse(body);
																																			if(carePlanActivityDetailPerformerPatient.err_code == 0){
																																				var objectCarePlanActivity = {};
																																				objectCarePlanActivity.id = carePlanActivity.id;
																																				objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																																				objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																																				objectCarePlanActivity.progress = carePlanActivity.progress;
																																				objectCarePlanActivity.reference = carePlanActivity.reference;
																																				var Detail = {};																	
																																				Detail.category = carePlanActivity.detail.category;
																																				Detail.definition = carePlanActivity.detail.definition;
																																				Detail.code = carePlanActivity.detail.code;
																																				Detail.reasonCode = carePlanActivity.detail.reasonCode;
																																				Detail.status = carePlanActivity.detail.status;
																																				Detail.statusReason = carePlanActivity.detail.statusReason;
																																				Detail.reasonReference = carePlanActivity.detail.reasonReference;
																																				Detail.goal = carePlanActivity.detail.goal;
																																				Detail.prohibited = carePlanActivity.detail.prohibited;
																																				Detail.scheduled = carePlanActivity.detail.scheduled;
																																				Detail.location = carePlanActivity.detail.location;
																																				var Performer = {};
																																				Performer.practitioner = carePlanActivity.detail.performer.practitioner;
																																				Performer.organization = carePlanActivity.detail.performer.organization;
																																				Performer.relatedPerson = carePlanActivity.detail.performer.relatedPerson;
																																				Performer.patient = carePlanActivityDetailPerformerPatient.data;
																																				Detail.performer = Performer;
																																				Detail.product = carePlanActivity.detail.product;
																																				Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																																				Detail.quantity = carePlanActivity.detail.quantity;
																																				Detail.description = carePlanActivity.detail.description;
																																				objectCarePlanActivity.detail = Detail;																	

																																				newCarePlanActivity[index] = objectCarePlanActivity;

																																				myEmitter.once('getCarePlanActivityDetailPerformerCareTeam', function(carePlanActivity, index, newCarePlanActivity, countCarePlanActivity){
																																					qString = {};
																																					qString.care_plan_activity_id = carePlanActivity.id;
																																					seedPhoenixFHIR.path.GET = {
																																						"CarePlanActivityDetailPerformerCareTeam" : {
																																							"location": "%(apikey)s/CarePlanActivityDetailPerformerCareTeam",
																																							"query": qString
																																						}
																																					}

																																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																					ApiFHIR.get('CarePlanActivityDetailPerformerCareTeam', {"apikey": apikey}, {}, function(error, response, body){
																																						carePlanActivityDetailPerformerCareTeam = JSON.parse(body);
																																						if(carePlanActivityDetailPerformerCareTeam.err_code == 0){
																																							var objectCarePlanActivity = {};
																																							objectCarePlanActivity.id = carePlanActivity.id;
																																							objectCarePlanActivity.outcomeCodeableConcept = carePlanActivity.outcomeCodeableConcept;
																																							objectCarePlanActivity.outcomeReference = carePlanActivity.outcomeReference;
																																							objectCarePlanActivity.progress = carePlanActivity.progress;
																																							objectCarePlanActivity.reference = carePlanActivity.reference;
																																							var Detail = {};																	
																																							Detail.category = carePlanActivity.detail.category;
																																							Detail.definition = carePlanActivity.detail.definition;
																																							Detail.code = carePlanActivity.detail.code;
																																							Detail.reasonCode = carePlanActivity.detail.reasonCode;
																																							Detail.status = carePlanActivity.detail.status;
																																							Detail.statusReason = carePlanActivity.detail.statusReason;
																																							Detail.reasonReference = carePlanActivity.detail.reasonReference;
																																							Detail.goal = carePlanActivity.detail.goal;
																																							Detail.prohibited = carePlanActivity.detail.prohibited;
																																							Detail.scheduled = carePlanActivity.detail.scheduled;
																																							Detail.location = carePlanActivity.detail.location;
																																							var Performer = {};
																																							Performer.practitioner = carePlanActivity.detail.performer.practitioner;
																																							Performer.organization = carePlanActivity.detail.performer.organization;
																																							Performer.relatedPerson = carePlanActivity.detail.performer.relatedPerson;
																																							Performer.patient = carePlanActivity.detail.performer.data;
																																							Performer.careTeam = carePlanActivityDetailPerformerCareTeam.data;
																																							Detail.performer = Performer;
																																							Detail.product = carePlanActivity.detail.product;
																																							Detail.dailyAmount = carePlanActivity.detail.dailyAmount;
																																							Detail.quantity = carePlanActivity.detail.quantity;
																																							Detail.description = carePlanActivity.detail.description;
																																							objectCarePlanActivity.detail = Detail;																	

																																							newCarePlanActivity[index] = objectCarePlanActivity;

																																							if(index == countCarePlanActivity -1 ){
																																								res.json({"err_code": 0, "data":newCarePlanActivity});	
																																							}
																																						}else{
																																							res.json(carePlanActivityDetailPerformerCareTeam);			
																																						}
																																					})
																																				})
																																				myEmitter.emit('getCarePlanActivityDetailPerformerCareTeam', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																
																																			}else{
																																				res.json(carePlanActivityDetailPerformerPatient);			
																																			}
																																		})
																																	})
																																	myEmitter.emit('getCarePlanActivityDetailPerformerPatient', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																
																																}else{
																																	res.json(carePlanActivityDetailPerformerRelatedPerson);			
																																}
																															})
																														})
																														myEmitter.emit('getCarePlanActivityDetailPerformerRelatedPerson', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																	
																													}else{
																														res.json(carePlanActivityDetailPerformerOrganization);			
																													}
																												})
																											})
																											myEmitter.emit('getCarePlanActivityDetailPerformerOrganization', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																	
																										}else{
																											res.json(carePlanActivityDetailPerformerPractitioner);			
																										}
																									})
																								})
																								myEmitter.emit('getCarePlanActivityDetailPerformerPractitioner', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																	
																							}else{
																								res.json(carePlanActivityDetailGoal);			
																							}
																						})
																					})
																					myEmitter.emit('getCarePlanActivityDetailGoal', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																	
																				}else{
																					res.json(carePlanActivityDetailGoal);			
																				}
																			})
																		})
																		myEmitter.emit('getCarePlanActivityDetailGoal', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																	
																	}else{
																		res.json(carePlanActivityDetailReasonReference);			
																	}
																})
															})
															myEmitter.emit('getCarePlanActivityDetailReasonReference', objectCarePlanActivity, index, newCarePlanActivity, countCarePlanActivity);																	
														}else{
															res.json(annotation);			
														}
													})
												})
												myEmitter.emit('getAnnotation', carePlanActivity.data[i], i, newCarePlanActivity, carePlanActivity.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "care plan activity is empty."});	
										}
									}else{
										res.json(carePlanActivity);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Care Plan Id not found"});		
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
		carePlan : function addCarePlan(req, res){
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
partOf|partOf||
basedOn|basedOn||
replaces|replaces||
status|status||nn
intent|intent||nn
category|category||
title|title||
description|description||
subject.patient|subjectPatient||
subject.group|subjectGroup||
context.encounter|contextEncounter||
context.episodeOfCare|contextEpisodeOfCare||
period|period|period|
author.patient|authorPatient||
author.practitioner|authorPractitioner||
author.relatedPerson|authorRelatedPerson||
author.organization|authorOrganization||
author.careTeam|authorCareTeam||
addresses|addresses||
supportingInfo|supportingInfo||
goal|goal||
activity.outcomeCodeableConcept|activityOutcomeCodeableConcept||
activity.outcomeReference|activityOutcomeReference||
activity.progress.author.authorReference.practitioner|activityProgressAuthorAuthorReferencePractitioner|||
activity.progress.author.authorReference.patient|activityProgressAuthorAuthorReferencePatient|||
activity.progress.author.authorReference.relatedPerson|activityProgressAuthorAuthorReferenceRelatedPerson|||
activity.progress.author.authorString|activityProgressAuthorAuthorString|||
activity.progress.time|activityProgressTime|date||
activity.progress.string|activityProgressString|||
activity.reference.appointment|activityReferenceAppointment||
activity.reference.communicationRequest|activityReferenceCommunicationRequest||
activity.reference.deviceRequest|activityReferenceDeviceRequest||
activity.reference.medicationRequest|activityReferenceMedicationRequest||
activity.reference.nutritionOrder|activityReferenceNutritionOrder||
activity.reference.task|activityReferenceTask||
activity.reference.procedureRequest|activityReferenceProcedureRequest||
activity.reference.referralRequest|activityReferenceReferralRequest||
activity.reference.visionPrescription|activityReferenceVisionPrescription||
activity.reference.requestGroup|activityReferenceRequestGroup||
activity.detail.category|activityDetailCategory||
activity.detail.definition.planDefinition|activityDetailDefinitionPlanDefinition||
activity.detail.definition.activityDefinition|activityDetailDefinitionActivityDefinition||
activity.detail.definition.questionnaire|activityDetailDefinitionQuestionnaire||
activity.detail.code|activityDetailCode||
activity.detail.reasonCode|activityDetailReasonCode||
activity.detail.reasonReference|activityDetailReasonReference||
activity.detail.goal|activityDetailGoal||
activity.detail.status|activityDetailStatus||nn
activity.detail.statusReason|activityDetailStatusReason||
activity.detail.prohibited|activityDetailProhibited|boolean|
activity.detail.scheduled.scheduledTiming.event|TimingEvent|date|
activity.detail.scheduled.scheduledTiming.repeat.bounds.boundsDuration|TimingRepeatBoundsBoundsDuration||
activity.detail.scheduled.scheduledTiming.repeat.bounds.boundsRange|TimingRepeatBoundsBoundsRange|range|
activity.detail.scheduled.scheduledTiming.repeat.bounds.boundsPeriod|TimingRepeatBoundsBoundsPeriod|period|
activity.detail.scheduled.scheduledTiming.repeat.count|TimingRepeatCount|integer|
activity.detail.scheduled.scheduledTiming.repeat.countMax|TimingRepeatCountMax|integer|
activity.detail.scheduled.scheduledTiming.repeat.duration|TimingRepeatDuration|integer|
activity.detail.scheduled.scheduledTiming.repeat.durationMax|TimingRepeatDurationMax|integer|
activity.detail.scheduled.scheduledTiming.repeat.durationUnit|TimingRepeatDurationUnit||
activity.detail.scheduled.scheduledTiming.repeat.frequency|TimingRepeatFrequency|integer|
activity.detail.scheduled.scheduledTiming.repeat.frequencyMax|TimingRepeatFrequencyMax|integer|
activity.detail.scheduled.scheduledTiming.repeat.period|TimingRepeatPeriod|integer|
activity.detail.scheduled.scheduledTiming.repeat.periodMax|TimingRepeatPeriodMax|integer|
activity.detail.scheduled.scheduledTiming.repeat.periodUnit|TimingRepeatPeriodUnit||
activity.detail.scheduled.scheduledTiming.repeat.dayOfWeek|TimingRepeatDayOfWeek||
activity.detail.scheduled.scheduledTiming.repeat.timeOfDay|TimingRepeatTimeOfDay|date|
activity.detail.scheduled.scheduledTiming.repeat.when|TimingRepeatWhen||
activity.detail.scheduled.scheduledTiming.repeat.offset|TimingRepeatOffset|integer|
activity.detail.scheduled.scheduledTiming.code|TimingCode||
activity.detail.scheduled.scheduledPeriod|activityDetailScheduledScheduledPeriod|period|
activity.detail.scheduled.scheduledString|activityDetailScheduledScheduledString||
activity.detail.location|activityDetailLocation||
activity.detail.performer.practitioner|activityDetailPerformerPractitioner||
activity.detail.performer.organization|activityDetailPerformerOrganization||
activity.detail.performer.relatedPerson|activityDetailPerformerRelatedPerson||
activity.detail.performer.patient|activityDetailPerformerPatient||
activity.detail.performer.careTeam|activityDetailPerformerCareTeam||
activity.detail.product.productCodeableConcept|activityDetailProductProductCodeableConcept||
activity.detail.product.productReference.medication|activityDetailProductProductReferenceMedication||
activity.detail.product.productReference.substance|activityDetailProductProductReferenceSubstance||
activity.detail.dailyAmount|activityDetailDailyAmount||
activity.detail.quantity|activityDetailQuantity||
activity.detail.description|activityDetailDescription||
note.author.authorReference.practitioner|noteAuthorAuthorReferencePractitioner|||
note.author.authorReference.patient|noteAuthorAuthorReferencePatient|||
note.author.authorReference.relatedPerson|noteAuthorAuthorReferenceRelatedPerson|||
note.author.authorString|noteAuthorAuthorString|||
note.time|noteTime|date||
note.text|noteText|||
	*/
			
			if(typeof req.body.definition.planDefinition !== 'undefined'){
				var definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					definitionPlanDefinition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'definition plan definition' in json Care Plan request.";
			}

			if(typeof req.body.definition.questionnaire !== 'undefined'){
				var definitionQuestionnaire =  req.body.definition.questionnaire.trim().toLowerCase();
				if(validator.isEmpty(definitionQuestionnaire)){
					definitionQuestionnaire = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'definition questionnaire' in json Care Plan request.";
			}

			if(typeof req.body.partOf !== 'undefined'){
				var partOf =  req.body.partOf.trim().toLowerCase();
				if(validator.isEmpty(partOf)){
					partOf = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'part of' in json Care Plan request.";
			}

			if(typeof req.body.basedOn !== 'undefined'){
				var basedOn =  req.body.basedOn.trim().toLowerCase();
				if(validator.isEmpty(basedOn)){
					basedOn = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on' in json Care Plan request.";
			}

			if(typeof req.body.replaces !== 'undefined'){
				var replaces =  req.body.replaces.trim().toLowerCase();
				if(validator.isEmpty(replaces)){
					replaces = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'replaces' in json Care Plan request.";
			}

			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Care Plan status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Care Plan request.";
			}

			if(typeof req.body.intent !== 'undefined'){
				var intent =  req.body.intent.trim().toLowerCase();
				if(validator.isEmpty(intent)){
					err_code = 2;
					err_msg = "Care Plan intent is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'intent' in json Care Plan request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Care Plan request.";
			}

			if(typeof req.body.title !== 'undefined'){
				var title =  req.body.title.trim().toLowerCase();
				if(validator.isEmpty(title)){
					title = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'title' in json Care Plan request.";
			}

			if(typeof req.body.description !== 'undefined'){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					description = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json Care Plan request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Care Plan request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Care Plan request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Care Plan request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Care Plan request.";
			}

			if (typeof req.body.period !== 'undefined') {
			  var period = req.body.period;
 				if(validator.isEmpty(period)) {
				  var periodStart = "";
				  var periodEnd = "";
				} else {
				  if (period.indexOf("to") > 0) {
				    arrPeriod = period.split("to");
				    var periodStart = arrPeriod[0];
				    var periodEnd = arrPeriod[1];
				    if (!regex.test(periodStart) && !regex.test(periodEnd)) {
				      err_code = 2;
				      err_msg = "Care Plan period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Care Plan period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'period' in json Care Plan request.";
			}

			if(typeof req.body.author.patient !== 'undefined'){
				var authorPatient =  req.body.author.patient.trim().toLowerCase();
				if(validator.isEmpty(authorPatient)){
					authorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author patient' in json Care Plan request.";
			}

			if(typeof req.body.author.practitioner !== 'undefined'){
				var authorPractitioner =  req.body.author.practitioner.trim().toLowerCase();
				if(validator.isEmpty(authorPractitioner)){
					authorPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author practitioner' in json Care Plan request.";
			}

			if(typeof req.body.author.relatedPerson !== 'undefined'){
				var authorRelatedPerson =  req.body.author.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(authorRelatedPerson)){
					authorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author related person' in json Care Plan request.";
			}

			if(typeof req.body.author.organization !== 'undefined'){
				var authorOrganization =  req.body.author.organization.trim().toLowerCase();
				if(validator.isEmpty(authorOrganization)){
					authorOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author organization' in json Care Plan request.";
			}

			if(typeof req.body.author.careTeam !== 'undefined'){
				var authorCareTeam =  req.body.author.careTeam.trim().toLowerCase();
				if(validator.isEmpty(authorCareTeam)){
					authorCareTeam = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'author care team' in json Care Plan request.";
			}

			if(typeof req.body.addresses !== 'undefined'){
				var addresses =  req.body.addresses.trim().toLowerCase();
				if(validator.isEmpty(addresses)){
					addresses = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'addresses' in json Care Plan request.";
			}

			if(typeof req.body.supportingInfo !== 'undefined'){
				var supportingInfo =  req.body.supportingInfo.trim().toLowerCase();
				if(validator.isEmpty(supportingInfo)){
					supportingInfo = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'supporting info' in json Care Plan request.";
			}

			if(typeof req.body.goal !== 'undefined'){
				var goal =  req.body.goal.trim().toLowerCase();
				if(validator.isEmpty(goal)){
					goal = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'goal' in json Care Plan request.";
			}

			if(typeof req.body.activity.outcomeCodeableConcept !== 'undefined'){
				var activityOutcomeCodeableConcept =  req.body.activity.outcomeCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(activityOutcomeCodeableConcept)){
					activityOutcomeCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity outcome codeable concept' in json Care Plan request.";
			}

			if(typeof req.body.activity.outcomeReference !== 'undefined'){
				var activityOutcomeReference =  req.body.activity.outcomeReference.trim().toLowerCase();
				if(validator.isEmpty(activityOutcomeReference)){
					activityOutcomeReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity outcome reference' in json Care Plan request.";
			}

			if(typeof req.body.activity.progress.author.authorReference.practitioner !== 'undefined'){
				var activityProgressAuthorAuthorReferencePractitioner =  req.body.activity.progress.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(activityProgressAuthorAuthorReferencePractitioner)){
					activityProgressAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity progress author author reference practitioner' in json Care Plan request.";
			}

			if(typeof req.body.activity.progress.author.authorReference.patient !== 'undefined'){
				var activityProgressAuthorAuthorReferencePatient =  req.body.activity.progress.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(activityProgressAuthorAuthorReferencePatient)){
					activityProgressAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity progress author author reference patient' in json Care Plan request.";
			}

			if(typeof req.body.activity.progress.author.authorReference.relatedPerson !== 'undefined'){
				var activityProgressAuthorAuthorReferenceRelatedPerson =  req.body.activity.progress.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(activityProgressAuthorAuthorReferenceRelatedPerson)){
					activityProgressAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity progress author author reference related person' in json Care Plan request.";
			}

			if(typeof req.body.activity.progress.author.authorString !== 'undefined'){
				var activityProgressAuthorAuthorString =  req.body.activity.progress.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(activityProgressAuthorAuthorString)){
					activityProgressAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity progress author author string' in json Care Plan request.";
			}

			if(typeof req.body.activity.progress.time !== 'undefined'){
				var activityProgressTime =  req.body.activity.progress.time;
				if(validator.isEmpty(activityProgressTime)){
					activityProgressTime = "";
				}else{
					if(!regex.test(activityProgressTime)){
						err_code = 2;
						err_msg = "Care Plan activity progress time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity progress time' in json Care Plan request.";
			}

			if(typeof req.body.activity.progress.string !== 'undefined'){
				var activityProgressString =  req.body.activity.progress.string.trim().toLowerCase();
				if(validator.isEmpty(activityProgressString)){
					activityProgressString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity progress string' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.appointment !== 'undefined'){
				var activityReferenceAppointment =  req.body.activity.reference.appointment.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceAppointment)){
					activityReferenceAppointment = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference appointment' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.communicationRequest !== 'undefined'){
				var activityReferenceCommunicationRequest =  req.body.activity.reference.communicationRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceCommunicationRequest)){
					activityReferenceCommunicationRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference communication request' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.deviceRequest !== 'undefined'){
				var activityReferenceDeviceRequest =  req.body.activity.reference.deviceRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceDeviceRequest)){
					activityReferenceDeviceRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference device request' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.medicationRequest !== 'undefined'){
				var activityReferenceMedicationRequest =  req.body.activity.reference.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceMedicationRequest)){
					activityReferenceMedicationRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference medication request' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.nutritionOrder !== 'undefined'){
				var activityReferenceNutritionOrder =  req.body.activity.reference.nutritionOrder.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceNutritionOrder)){
					activityReferenceNutritionOrder = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference nutrition order' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.task !== 'undefined'){
				var activityReferenceTask =  req.body.activity.reference.task.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceTask)){
					activityReferenceTask = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference task' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.procedureRequest !== 'undefined'){
				var activityReferenceProcedureRequest =  req.body.activity.reference.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceProcedureRequest)){
					activityReferenceProcedureRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference procedure request' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.referralRequest !== 'undefined'){
				var activityReferenceReferralRequest =  req.body.activity.reference.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceReferralRequest)){
					activityReferenceReferralRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference referral request' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.visionPrescription !== 'undefined'){
				var activityReferenceVisionPrescription =  req.body.activity.reference.visionPrescription.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceVisionPrescription)){
					activityReferenceVisionPrescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference vision prescription' in json Care Plan request.";
			}

			if(typeof req.body.activity.reference.requestGroup !== 'undefined'){
				var activityReferenceRequestGroup =  req.body.activity.reference.requestGroup.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceRequestGroup)){
					activityReferenceRequestGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference request group' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.category !== 'undefined'){
				var activityDetailCategory =  req.body.activity.detail.category.trim().toLowerCase();
				if(validator.isEmpty(activityDetailCategory)){
					activityDetailCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail category' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.definition.planDefinition !== 'undefined'){
				var activityDetailDefinitionPlanDefinition =  req.body.activity.detail.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDefinitionPlanDefinition)){
					activityDetailDefinitionPlanDefinition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail definition plan definition' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.definition.activityDefinition !== 'undefined'){
				var activityDetailDefinitionActivityDefinition =  req.body.activity.detail.definition.activityDefinition.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDefinitionActivityDefinition)){
					activityDetailDefinitionActivityDefinition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail definition activity definition' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.definition.questionnaire !== 'undefined'){
				var activityDetailDefinitionQuestionnaire =  req.body.activity.detail.definition.questionnaire.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDefinitionQuestionnaire)){
					activityDetailDefinitionQuestionnaire = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail definition questionnaire' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.code !== 'undefined'){
				var activityDetailCode =  req.body.activity.detail.code.trim().toLowerCase();
				if(validator.isEmpty(activityDetailCode)){
					activityDetailCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail code' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.reasonCode !== 'undefined'){
				var activityDetailReasonCode =  req.body.activity.detail.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(activityDetailReasonCode)){
					activityDetailReasonCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail reason code' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.reasonReference !== 'undefined'){
				var activityDetailReasonReference =  req.body.activity.detail.reasonReference.trim().toLowerCase();
				if(validator.isEmpty(activityDetailReasonReference)){
					activityDetailReasonReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail reason reference' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.goal !== 'undefined'){
				var activityDetailGoal =  req.body.activity.detail.goal.trim().toLowerCase();
				if(validator.isEmpty(activityDetailGoal)){
					activityDetailGoal = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail goal' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.status !== 'undefined'){
				var activityDetailStatus =  req.body.activity.detail.status.trim().toLowerCase();
				if(validator.isEmpty(activityDetailStatus)){
					err_code = 2;
					err_msg = "Care Plan activity detail status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail status' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.statusReason !== 'undefined'){
				var activityDetailStatusReason =  req.body.activity.detail.statusReason.trim().toLowerCase();
				if(validator.isEmpty(activityDetailStatusReason)){
					activityDetailStatusReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail status reason' in json Care Plan request.";
			}

			if (typeof req.body.activity.detail.prohibited !== 'undefined') {
				var activityDetailProhibited = req.body.activity.detail.prohibited.trim().toLowerCase();
					if(validator.isEmpty(activityDetailProhibited)){
						activityDetailProhibited = "false";
					}
				if(activityDetailProhibited === "true" || activityDetailProhibited === "false"){
					activityDetailProhibited = activityDetailProhibited;
				} else {
					err_code = 2;
					err_msg = "Care Plan activity detail prohibited is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail prohibited' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.event !== 'undefined'){
				var TimingEvent =  req.body.activity.detail.scheduled.scheduledTiming.event;
				if(validator.isEmpty(TimingEvent)){
					TimingEvent = "";
				}else{
					if(!regex.test(TimingEvent)){
						err_code = 2;
						err_msg = "Care Plan activity detail scheduled scheduled timing event invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing event' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.bounds.boundsDuration !== 'undefined'){
				var TimingRepeatBoundsBoundsDuration =  req.body.activity.detail.scheduled.scheduledTiming.repeat.bounds.boundsDuration.trim().toLowerCase();
				if(validator.isEmpty(TimingRepeatBoundsBoundsDuration)){
					TimingRepeatBoundsBoundsDuration = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat bounds bounds duration' in json Care Plan request.";
			}

			if (typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.bounds.boundsRange !== 'undefined') {
			  var TimingRepeatBoundsBoundsRange = req.body.activity.detail.scheduled.scheduledTiming.repeat.bounds.boundsRange;
 				if(validator.isEmpty(TimingRepeatBoundsBoundsRange)){
				  var TimingRepeatBoundsBoundsRangeLow = "";
				  var TimingRepeatBoundsBoundsRangeHigh = "";
				} else {
				  if (TimingRepeatBoundsBoundsRange.indexOf("to") > 0) {
				    arrTimingRepeatBoundsBoundsRange = TimingRepeatBoundsBoundsRange.split("to");
				    var TimingRepeatBoundsBoundsRangeLow = arrTimingRepeatBoundsBoundsRange[0];
				    var TimingRepeatBoundsBoundsRangeHigh = arrTimingRepeatBoundsBoundsRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Care Plan activity detail scheduled scheduled timing repeat bounds bounds range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'activity detail scheduled scheduled timing repeat bounds bounds range' in json Care Plan request.";
			}

			if (typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.bounds.boundsPeriod !== 'undefined') {
			  var TimingRepeatBoundsBoundsPeriod = req.body.activity.detail.scheduled.scheduledTiming.repeat.bounds.boundsPeriod;
 				if(validator.isEmpty(TimingRepeatBoundsBoundsPeriod)) {
				  var TimingRepeatBoundsBoundsPeriodStart = "";
				  var TimingRepeatBoundsBoundsPeriodEnd = "";
				} else {
				  if (TimingRepeatBoundsBoundsPeriod.indexOf("to") > 0) {
				    arrTimingRepeatBoundsBoundsPeriod = TimingRepeatBoundsBoundsPeriod.split("to");
				    var TimingRepeatBoundsBoundsPeriodStart = arrTimingRepeatBoundsBoundsPeriod[0];
				    var TimingRepeatBoundsBoundsPeriodEnd = arrTimingRepeatBoundsBoundsPeriod[1];
				    if (!regex.test(TimingRepeatBoundsBoundsPeriodStart) && !regex.test(TimingRepeatBoundsBoundsPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Care Plan activity detail scheduled scheduled timing repeat bounds bounds period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Care Plan activity detail scheduled scheduled timing repeat bounds bounds period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'activity detail scheduled scheduled timing repeat bounds bounds period' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.count !== 'undefined'){
				var TimingRepeatCount =  req.body.activity.detail.scheduled.scheduledTiming.repeat.count.trim();
				if(validator.isEmpty(TimingRepeatCount)){
					TimingRepeatCount = "";
				}else{
					if(!validator.isInt(TimingRepeatCount)){
						err_code = 2;
						err_msg = "Care Plan activity detail scheduled scheduled timing repeat count is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat count' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.countMax !== 'undefined'){
				var TimingRepeatCountMax =  req.body.activity.detail.scheduled.scheduledTiming.repeat.countMax.trim();
				if(validator.isEmpty(TimingRepeatCountMax)){
					TimingRepeatCountMax = "";
				}else{
					if(!validator.isInt(TimingRepeatCountMax)){
						err_code = 2;
						err_msg = "Care Plan activity detail scheduled scheduled timing repeat count max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat count max' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.duration !== 'undefined'){
				var TimingRepeatDuration =  req.body.activity.detail.scheduled.scheduledTiming.repeat.duration.trim();
				if(validator.isEmpty(TimingRepeatDuration)){
					TimingRepeatDuration = "";
				}else{
					if(!validator.isInt(TimingRepeatDuration)){
						err_code = 2;
						err_msg = "Care Plan activity detail scheduled scheduled timing repeat duration is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat duration' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.durationMax !== 'undefined'){
				var TimingRepeatDurationMax =  req.body.activity.detail.scheduled.scheduledTiming.repeat.durationMax.trim();
				if(validator.isEmpty(TimingRepeatDurationMax)){
					TimingRepeatDurationMax = "";
				}else{
					if(!validator.isInt(TimingRepeatDurationMax)){
						err_code = 2;
						err_msg = "Care Plan activity detail scheduled scheduled timing repeat duration max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat duration max' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.durationUnit !== 'undefined'){
				var TimingRepeatDurationUnit =  req.body.activity.detail.scheduled.scheduledTiming.repeat.durationUnit.trim().toLowerCase();
				if(validator.isEmpty(TimingRepeatDurationUnit)){
					TimingRepeatDurationUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat duration unit' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.frequency !== 'undefined'){
				var TimingRepeatFrequency =  req.body.activity.detail.scheduled.scheduledTiming.repeat.frequency.trim();
				if(validator.isEmpty(TimingRepeatFrequency)){
					TimingRepeatFrequency = "";
				}else{
					if(!validator.isInt(TimingRepeatFrequency)){
						err_code = 2;
						err_msg = "Care Plan activity detail scheduled scheduled timing repeat frequency is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat frequency' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.frequencyMax !== 'undefined'){
				var TimingRepeatFrequencyMax =  req.body.activity.detail.scheduled.scheduledTiming.repeat.frequencyMax.trim();
				if(validator.isEmpty(TimingRepeatFrequencyMax)){
					TimingRepeatFrequencyMax = "";
				}else{
					if(!validator.isInt(TimingRepeatFrequencyMax)){
						err_code = 2;
						err_msg = "Care Plan activity detail scheduled scheduled timing repeat frequency max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat frequency max' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.period !== 'undefined'){
				var TimingRepeatPeriod =  req.body.activity.detail.scheduled.scheduledTiming.repeat.period.trim();
				if(validator.isEmpty(TimingRepeatPeriod)){
					TimingRepeatPeriod = "";
				}else{
					if(!validator.isInt(TimingRepeatPeriod)){
						err_code = 2;
						err_msg = "Care Plan activity detail scheduled scheduled timing repeat period is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat period' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.periodMax !== 'undefined'){
				var TimingRepeatPeriodMax =  req.body.activity.detail.scheduled.scheduledTiming.repeat.periodMax.trim();
				if(validator.isEmpty(TimingRepeatPeriodMax)){
					TimingRepeatPeriodMax = "";
				}else{
					if(!validator.isInt(TimingRepeatPeriodMax)){
						err_code = 2;
						err_msg = "Care Plan activity detail scheduled scheduled timing repeat period max is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat period max' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.periodUnit !== 'undefined'){
				var TimingRepeatPeriodUnit =  req.body.activity.detail.scheduled.scheduledTiming.repeat.periodUnit.trim().toLowerCase();
				if(validator.isEmpty(TimingRepeatPeriodUnit)){
					TimingRepeatPeriodUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat period unit' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.dayOfWeek !== 'undefined'){
				var TimingRepeatDayOfWeek =  req.body.activity.detail.scheduled.scheduledTiming.repeat.dayOfWeek.trim().toLowerCase();
				if(validator.isEmpty(TimingRepeatDayOfWeek)){
					TimingRepeatDayOfWeek = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat day of week' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.timeOfDay !== 'undefined'){
				var TimingRepeatTimeOfDay =  req.body.activity.detail.scheduled.scheduledTiming.repeat.timeOfDay;
				if(validator.isEmpty(TimingRepeatTimeOfDay)){
					TimingRepeatTimeOfDay = "";
				}else{
					if(!regex.test(TimingRepeatTimeOfDay)){
						err_code = 2;
						err_msg = "Care Plan activity detail scheduled scheduled timing repeat time of day invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat time of day' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.when !== 'undefined'){
				var TimingRepeatWhen =  req.body.activity.detail.scheduled.scheduledTiming.repeat.when.trim().toLowerCase();
				if(validator.isEmpty(TimingRepeatWhen)){
					TimingRepeatWhen = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat when' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.repeat.offset !== 'undefined'){
				var TimingRepeatOffset =  req.body.activity.detail.scheduled.scheduledTiming.repeat.offset.trim();
				if(validator.isEmpty(TimingRepeatOffset)){
					TimingRepeatOffset = "";
				}else{
					if(!validator.isInt(TimingRepeatOffset)){
						err_code = 2;
						err_msg = "Care Plan activity detail scheduled scheduled timing repeat offset is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing repeat offset' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledTiming.code !== 'undefined'){
				var TimingCode =  req.body.activity.detail.scheduled.scheduledTiming.code.trim().toLowerCase();
				if(validator.isEmpty(TimingCode)){
					TimingCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled timing code' in json Care Plan request.";
			}

			if (typeof req.body.activity.detail.scheduled.scheduledPeriod !== 'undefined') {
			  var activityDetailScheduledScheduledPeriod = req.body.activity.detail.scheduled.scheduledPeriod;
 				if(validator.isEmpty(activityDetailScheduledScheduledPeriod)) {
				  var activityDetailScheduledScheduledPeriodStart = "";
				  var activityDetailScheduledScheduledPeriodEnd = "";
				} else {
				  if (activityDetailScheduledScheduledPeriod.indexOf("to") > 0) {
				    arrActivityDetailScheduledScheduledPeriod = activityDetailScheduledScheduledPeriod.split("to");
				    var activityDetailScheduledScheduledPeriodStart = arrActivityDetailScheduledScheduledPeriod[0];
				    var activityDetailScheduledScheduledPeriodEnd = arrActivityDetailScheduledScheduledPeriod[1];
				    if (!regex.test(activityDetailScheduledScheduledPeriodStart) && !regex.test(activityDetailScheduledScheduledPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Care Plan activity detail scheduled scheduled period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Care Plan activity detail scheduled scheduled period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'activity detail scheduled scheduled period' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.scheduled.scheduledString !== 'undefined'){
				var activityDetailScheduledScheduledString =  req.body.activity.detail.scheduled.scheduledString.trim().toLowerCase();
				if(validator.isEmpty(activityDetailScheduledScheduledString)){
					activityDetailScheduledScheduledString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail scheduled scheduled string' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.location !== 'undefined'){
				var activityDetailLocation =  req.body.activity.detail.location.trim().toLowerCase();
				if(validator.isEmpty(activityDetailLocation)){
					activityDetailLocation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail location' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.performer.practitioner !== 'undefined'){
				var activityDetailPerformerPractitioner =  req.body.activity.detail.performer.practitioner.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerPractitioner)){
					activityDetailPerformerPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail performer practitioner' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.performer.organization !== 'undefined'){
				var activityDetailPerformerOrganization =  req.body.activity.detail.performer.organization.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerOrganization)){
					activityDetailPerformerOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail performer organization' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.performer.relatedPerson !== 'undefined'){
				var activityDetailPerformerRelatedPerson =  req.body.activity.detail.performer.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerRelatedPerson)){
					activityDetailPerformerRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail performer related person' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.performer.patient !== 'undefined'){
				var activityDetailPerformerPatient =  req.body.activity.detail.performer.patient.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerPatient)){
					activityDetailPerformerPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail performer patient' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.performer.careTeam !== 'undefined'){
				var activityDetailPerformerCareTeam =  req.body.activity.detail.performer.careTeam.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerCareTeam)){
					activityDetailPerformerCareTeam = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail performer care team' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.product.productCodeableConcept !== 'undefined'){
				var activityDetailProductProductCodeableConcept =  req.body.activity.detail.product.productCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(activityDetailProductProductCodeableConcept)){
					activityDetailProductProductCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail product product codeable concept' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.product.productReference.medication !== 'undefined'){
				var activityDetailProductProductReferenceMedication =  req.body.activity.detail.product.productReference.medication.trim().toLowerCase();
				if(validator.isEmpty(activityDetailProductProductReferenceMedication)){
					activityDetailProductProductReferenceMedication = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail product product reference medication' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.product.productReference.substance !== 'undefined'){
				var activityDetailProductProductReferenceSubstance =  req.body.activity.detail.product.productReference.substance.trim().toLowerCase();
				if(validator.isEmpty(activityDetailProductProductReferenceSubstance)){
					activityDetailProductProductReferenceSubstance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail product product reference substance' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.dailyAmount !== 'undefined'){
				var activityDetailDailyAmount =  req.body.activity.detail.dailyAmount.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDailyAmount)){
					activityDetailDailyAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail daily amount' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.quantity !== 'undefined'){
				var activityDetailQuantity =  req.body.activity.detail.quantity.trim().toLowerCase();
				if(validator.isEmpty(activityDetailQuantity)){
					activityDetailQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail quantity' in json Care Plan request.";
			}

			if(typeof req.body.activity.detail.description !== 'undefined'){
				var activityDetailDescription =  req.body.activity.detail.description.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDescription)){
					activityDetailDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity detail description' in json Care Plan request.";
			}

			if(typeof req.body.note.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.note.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Care Plan request.";
			}

			if(typeof req.body.note.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.note.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Care Plan request.";
			}

			if(typeof req.body.note.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.note.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Care Plan request.";
			}

			if(typeof req.body.note.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.note.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Care Plan request.";
			}

			if(typeof req.body.note.time !== 'undefined'){
				var noteTime =  req.body.note.time;
				if(validator.isEmpty(noteTime)){
					noteTime = "";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Care Plan note time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note time' in json Care Plan request.";
			}

			if(typeof req.body.note.text !== 'undefined'){
				var noteText =  req.body.note.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note.text' in json Care Plan request.";
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
														var carePlanId = 'cap' + unicId;
														var carePlanActivityId = 'cpa' + unicId;
														var carePlanActivityDetailId = 'cad' + unicId;
														var timingId = 'tim' + unicId;
														var NoteId = 'anc' + unicId;
														var noteActivityId = 'ana' + unicId;

														dataCarePlan = {
															"careplan_id" : carePlanId,
															"based_on" : basedOn,
															"replaces" : replaces,
															"part_of" : partOf,
															"status" : status,
															"intent" : intent,
															"category" : category,
															"title" : title,
															"description" : description,
															"subject_patient" : subjectPatient,
															"subject_group" : subjectGroup,
															"context_encounter" : contextEncounter,
															"context_episode_of_care" : contextEpisodeOfCare,
															"period_start" : periodStart,
															"period_end" : periodEnd,
															"supporting_info" : supportingInfo
														}
														console.log(dataCarePlan);
														

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
																							"care_plan_id": carePlanId
																						}

														
														//CarePlanActivity
														dataCarePlanActivity = {
															"careplan_activity_id" : carePlanActivityId,
															"outcome_codeable_concept" : activityOutcomeCodeableConcept,
															"outcome_reference" : activityOutcomeReference,
															"progress" : activityProgress,
															"reference_appointment" : activityReferenceAppointment,
															"reference_communication_request" : activityReferenceCommunicationRequest,
															"reference_device_request" : activityReferenceDeviceRequest,
															"reference_medication_request" : activityReferenceMedicationRequest,
															"reference_nutrition_order" : activityReferenceNutritionOrder,
															"reference_task" : activityReferenceTask,
															"reference_procedure_request" : activityReferenceProcedureRequest,
															"reference_referral_request" : activityReferenceReferralRequest,
															"reference_vision_prescription" : activityReferenceVisionPrescription,
															"reference_request_group" : activityReferenceRequestGroup,
															"careplan_id" : carePlanId
														}
														
														//CarePlanActivity
														dataCarePlanActivityDetail = {
															"activity_detail_id" : carePlanActivityDetailId,
															"category" : activityDetailCategory,
															"definition_plan_definition" : activityDetailDefinitionPlanDefinition,
															"definition_activity_definition" : activityDetailDefinitionActivityDefinition,
															"definition_questionnaire" : activityDetailDefinitionQuestionnaire,
															"code" : activityDetailCode,
															"reason_code" : activityDetailReasonCode,
															"status" : activityDetailStatus,
															"status_reason" : activityDetailStatusReason,
															"prohibited" : activityDetailProhibited,
															"scheduled_timing" : timingId,
															"scheduled_period_start" : activityDetailScheduledScheduledPeriodStart,
															"scheduled_period_end" : activityDetailScheduledScheduledPeriodEnd,
															"scheduled_string" : activityDetailScheduledScheduledString,
															"location" : activityDetailLocation,
															"product_codeable_concept" : activityDetailProductProductCodeableConcept,
															"product_reference_medication" : activityDetailProductProductReferenceMedication,
															"product_reference_substance" : activityDetailProductProductReferenceSubstance,
															"daily_amount" : activityDetailDailyAmount,
															"quantity" : activityDetailDailyAmount,
															"description" : activityDetailDescription,
															"activity_id" : carePlanActivityId
														}
														
														dataTiming = {
															"timing_id" : timingId,
															"event" : TimingEvent,
															"repeat_bounds_duration" : TimingRepeatBoundsBoundsDuration,
															"repeat_bounds_range_low" : TimingRepeatBoundsBoundsRangeLow,
															"repeat_bounds_range_high" : TimingRepeatBoundsBoundsRangeHigh,
															"repeat_bounds_period_start" : TimingRepeatBoundsBoundsPeriodStart,
															"repeat_bounds_period_end" : TimingRepeatBoundsBoundsPeriodEnd,
															"count" : TimingRepeatCount,
															"count_max" : TimingRepeatCountMax,
															"duration" : TimingRepeatDuration,
															"duration_max" : TimingRepeatDurationMax,
															"duration_unit" : TimingRepeatDurationUnit,
															"frequency" : TimingRepeatFrequency,
															"frequency_max" : TimingRepeatFrequencyMax,
															"period" : TimingRepeatPeriod,
															"period_max" : TimingRepeatPeriodMax,
															"period_unit" : TimingRepeatPeriodUnit,
															"day_of_week" : TimingRepeatDayOfWeek,
															"time_of_day" : TimingRepeatTimeOfDay,
															"when" : TimingRepeatWhen,
															"offset" : TimingRepeatOffset,
															"code" : Timingcode,
															"activity_detail_id": carePlanActivityDetailId
														}
														console.log(dataTiming);
														ApiFHIR.post('timing', {"apikey": apikey}, {body: dataTiming, json: true}, function(error, response, body){
															timing = body;
															console.log(timing);
															if(timing.err_code > 0){
																res.json(timing);	
																console.log("ok");
															}
														});
														
														var dataNoteActivity = {
															"id": noteId,
															"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
															"author_ref_patient": noteAuthorAuthorReferencePatient,
															"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
															"author_string": noteAuthorAuthorString,
															"time": noteTime,
															"text": noteText,
															"care_plan_id" : carePlanId
														};
														
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataNoteActivity, json:true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
															} 
														});
														/*----*/
															
														var dataNote = {
															"id": noteActivityId,
															"author_ref_practitioner": activityProgressAuthorAuthorReferencePractitioner,
															"author_ref_patient": activityProgressAuthorAuthorReferencePatient,
															"author_ref_relatedPerson": activityProgressAuthorAuthorReferenceRelatedPerson,
															"author_string": activityProgressAuthorAuthorString,
															"time": activityProgressTime,
															"text": activityProgressString,
															"care_plan_activity_id" : carePlanActivityId
														};
														
														ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataNote, json:true}, function(error, response, body){
															annotation = body;
															if(annotation.err_code > 0){
																res.json(annotation);	
															} 
														});
														
														ApiFHIR.post('carePlan', {"apikey": apikey}, {body: dataCarePlan, json: true}, function(error, response, body){
															carePlan = body;
															if(carePlan.err_code > 0){
																//res.json(carePlan);
																console.log(carePlan);
															}
														});
														
														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																//res.json(identifier);	
																console.log(identifier);
															}
														});

														ApiFHIR.post('carePlanActivity', {"apikey": apikey}, {body: dataCarePlanActivity, json: true}, function(error, response, body){
															carePlanActivity = body;
															if(carePlanActivity.err_code > 0){
																//res.json(carePlanActivity);	
																console.log(carePlanActivity);
															}
														});

														ApiFHIR.post('carePlanActivityDetail', {"apikey": apikey}, {body: dataCarePlanActivityDetail, json: true}, function(error, response, body){
															carePlanActivityDetail = body;
															if(carePlanActivityDetail.err_code > 0){
																res.json(carePlanActivityDetail);	
																console.log(carePlanActivityDetail);
															}
														});
														
														if(definitionPlanDefinition !== ""){
															dataDefinitionPlanDefinition = {
																"_id" : definitionPlanDefinition,
																"care_plan_id" : carePlanId
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
																"careplan_id" : carePlanId
															}
															ApiFHIR.put('questionnaire', {"apikey": apikey, "_id": definitionQuestionnaire}, {body: dataDefinitionQuestionnaire, json: true}, function(error, response, body){
																returnDefinitionQuestionnaire = body;
																if(returnDefinitionQuestionnaire.err_code > 0){
																	res.json(returnDefinitionQuestionnaire);	
																	console.log("add reference Definition questionnaire : " + definitionQuestionnaire);
																}
															});
														}

														if(authorPatient !== ""){
															dataAuthorPatient = {
																"_id" : authorPatient,
																"care_plan_id" : carePlanId
															}
															ApiFHIR.put('patient', {"apikey": apikey, "_id": authorPatient}, {body: dataAuthorPatient, json: true}, function(error, response, body){
																returnAuthorPatient = body;
																if(returnAuthorPatient.err_code > 0){
																	res.json(returnAuthorPatient);	
																	console.log("add reference author patient : " + authorPatient);
																}
															});
														}
														
														if(authorPractitioner !== ""){
															dataAuthorPractitioner = {
																"_id" : authorPractitioner,
																"care_plan_id" : carePlanId
															}
															ApiFHIR.put('cractitioner', {"apikey": apikey, "_id": authorPractitioner}, {body: dataAuthorPractitioner, json: true}, function(error, response, body){
																returnAuthorPractitioner = body;
																if(returnAuthorPractitioner.err_code > 0){
																	res.json(returnAuthorPractitioner);	
																	console.log("add reference author practitioner : " + authorPractitioner);
																}
															});
														}
														
														if(authorRelatedPerson !== ""){
															dataAuthorRelatedPerson = {
																"_id" : authorRelatedPerson,
																"care_plan_id" : carePlanId
															}
															ApiFHIR.put('relatedPerson', {"apikey": apikey, "_id": authorRelatedPerson}, {body: dataAuthorRelatedPerson, json: true}, function(error, response, body){
																returnAuthorRelatedPerson = body;
																if(returnAuthorRelatedPerson.err_code > 0){
																	res.json(returnAuthorRelatedPerson);	
																	console.log("add reference author related person : " + authorRelatedPerson);
																}
															});
														}
														
														if(authorOrganization !== ""){
															dataAuthorOrganization = {
																"_id" : authorOrganization,
																"care_plan_id" : carePlanId
															}
															ApiFHIR.put('organization', {"apikey": apikey, "_id": authorOrganization}, {body: dataAuthorOrganization, json: true}, function(error, response, body){
																returnAuthorOrganization = body;
																if(returnAuthorOrganization.err_code > 0){
																	res.json(returnAuthorOrganization);	
																	console.log("add reference author organization : " + authorOrganization);
																}
															});
														}
														
														if(authorCareTeam !== ""){
															dataAuthorCareTeam = {
																"_id" : authorCareTeam,
																"care_plan_author_id" : carePlanId
															}
															ApiFHIR.put('careTeam', {"apikey": apikey, "_id": authorCareTeam}, {body: dataAuthorCareTeam, json: true}, function(error, response, body){
																returnAuthorCareTeam = body;
																if(returnAuthorCareTeam.err_code > 0){
																	res.json(returnAuthorCareTeam);	
																	console.log("add reference author care team : " + authorCareTeam);
																}
															});
														}
														
														if(careTeam !== ""){
															dataCareTeam = {
																"_id" : careTeam,
																"care_plan_team_id" : carePlanId
															}
															ApiFHIR.put('careTeam', {"apikey": apikey, "_id": careTeam}, {body: dataCareTeam, json: true}, function(error, response, body){
																returnCareTeam = body;
																if(returnCareTeam.err_code > 0){
																	res.json(returnCareTeam);	
																	console.log("add reference care team : " + careTeam);
																}
															});
														}
														
														if(addresses !== ""){
															dataAddresses = {
																"_id" : addresses,
																"care_plan_id" : carePlanId
															}
															ApiFHIR.put('condition', {"apikey": apikey, "_id": addresses}, {body: dataAddresses, json: true}, function(error, response, body){
																returnAddresses = body;
																if(returnAddresses.err_code > 0){
																	res.json(returnAddresses);	
																	console.log("add reference addresses : " + addresses);
																}
															});
														}
														
														if(goal !== ""){
															dataGoal = {
																"_id" : goal,
																"care_plan_id" : carePlanId
															}
															ApiFHIR.put('goal', {"apikey": apikey, "_id": goal}, {body: dataGoal, json: true}, function(error, response, body){
																returnGoal = body;
																if(returnGoal.err_code > 0){
																	res.json(returnGoal);	
																	console.log("add reference goal : " + goal);
																}
															});
														}
														
														if(activityProgress !== ""){
															dataActivityProgress = {
																"_id" : activityProgress,
																"care_plan_activity_id" : carePlanId
															}
															ApiFHIR.put('note', {"apikey": apikey, "_id": activityProgress}, {body: dataActivityProgress, json: true}, function(error, response, body){
																returnActivityProgress = body;
																if(returnActivityProgress.err_code > 0){
																	res.json(returnActivityProgress);	
																	console.log("add reference activity progress : " + activityProgress);
																}
															});
														}
														
														if(activityDetailReasonReference !== ""){
															dataActivityDetailReasonReference = {
																"_id" : activityDetailReasonReference,
																"care_plan_id" : carePlanId
															}
															ApiFHIR.put('condition', {"apikey": apikey, "_id": activityDetailReasonReference}, {body: dataActivityDetailReasonReference, json: true}, function(error, response, body){
																returnActivityDetailReasonReference = body;
																if(returnActivityDetailReasonReference.err_code > 0){
																	res.json(returnActivityDetailReasonReference);	
																	console.log("add reference activity detail reason reference : " + activityDetailReasonReference);
																}
															});
														}
														
														if(activityDetailGoal !== ""){
															dataActivityDetailGoal = {
																"_id" : activityDetailGoal,
																"care_plan_activity_detail_id" : carePlanId
															}
															ApiFHIR.put('goal', {"apikey": apikey, "_id": activityDetailGoal}, {body: dataActivityDetailGoal, json: true}, function(error, response, body){
																returnActivityDetailGoal = body;
																if(returnActivityDetailGoal.err_code > 0){
																	res.json(returnActivityDetailGoal);	
																	console.log("add reference activity detail goal : " + activityDetailGoal);
																}
															});
														}
														
														if(activityDetailPerformerPractitioner !== ""){
															dataActivityDetailPerformerPractitioner = {
																"_id" : activityDetailPerformerPractitioner,
																"care_plan_activity_detail_id" : carePlanId
															}
															ApiFHIR.put('practitioner', {"apikey": apikey, "_id": activityDetailPerformerPractitioner}, {body: dataActivityDetailPerformerPractitioner, json: true}, function(error, response, body){
																returnActivityDetailPerformerPractitioner = body;
																if(returnActivityDetailPerformerPractitioner.err_code > 0){
																	res.json(returnActivityDetailPerformerPractitioner);	
																	console.log("add reference activity detail performer practitioner : " + activityDetailPerformerPractitioner);
																}
															});
														}
														
														if(activityDetailPerformerOrganization !== ""){
															dataActivityDetailPerformerOrganization = {
																"_id" : activityDetailPerformerOrganization,
																"care_plan_activity_detail_id" : carePlanId
															}
															ApiFHIR.put('organization', {"apikey": apikey, "_id": activityDetailPerformerOrganization}, {body: dataActivityDetailPerformerOrganization, json: true}, function(error, response, body){
																returnActivityDetailPerformerOrganization = body;
																if(returnActivityDetailPerformerOrganization.err_code > 0){
																	res.json(returnActivityDetailPerformerOrganization);	
																	console.log("add reference activity detail performer organization : " + activityDetailPerformerOrganization);
																}
															});
														}
														
														if(activityDetailPerformerRelatedPerson !== ""){
															dataActivityDetailPerformerRelatedPerson = {
																"_id" : activityDetailPerformerRelatedPerson,
																"care_plan_activity_detail_id" : carePlanId
															}
															ApiFHIR.put('relatedPerson', {"apikey": apikey, "_id": activityDetailPerformerRelatedPerson}, {body: dataActivityDetailPerformerRelatedPerson, json: true}, function(error, response, body){
																returnActivityDetailPerformerRelatedPerson = body;
																if(returnActivityDetailPerformerRelatedPerson.err_code > 0){
																	res.json(returnActivityDetailPerformerRelatedPerson);	
																	console.log("add reference activity detail performer related person : " + activityDetailPerformerRelatedPerson);
																}
															});
														}
														
														if(activityDetailPerformerPatient !== ""){
															dataActivityDetailPerformerPatient = {
																"_id" : activityDetailPerformerPatient,
																"care_plan_detail_id" : carePlanId
															}
															ApiFHIR.put('patient', {"apikey": apikey, "_id": activityDetailPerformerPatient}, {body: dataActivityDetailPerformerPatient, json: true}, function(error, response, body){
																returnActivityDetailPerformerPatient = body;
																if(returnActivityDetailPerformerPatient.err_code > 0){
																	res.json(returnActivityDetailPerformerPatient);	
																	console.log("add reference activity detail performer patient : " + activityDetailPerformerPatient);
																}
															});
														}
														
														if(activityDetailPerformerCareTeam !== ""){
															dataActivityDetailPerformerCareTeam = {
																"_id" : activityDetailPerformerCareTeam,
																"care_plan_activity_detail_id" : carePlanId
															}
															ApiFHIR.put('careTeam', {"apikey": apikey, "_id": activityDetailPerformerCareTeam}, {body: dataActivityDetailPerformerCareTeam, json: true}, function(error, response, body){
																returnActivityDetailPerformerCareTeam = body;
																if(returnActivityDetailPerformerCareTeam.err_code > 0){
																	res.json(returnActivityDetailPerformerCareTeam);	
																	console.log("add reference activity detail performer care team : " + activityDetailPerformerCareTeam);
																}
															});
														}
														
														if(note !== ""){
															dataNote = {
																"_id" : note,
																"care_plan_id" : carePlanId
															}
															ApiFHIR.put('note', {"apikey": apikey, "_id": note}, {body: dataNote, json: true}, function(error, response, body){
																returnNote = body;
																if(returnNote.err_code > 0){
																	res.json(returnNote);	
																	console.log("add reference note : " + note);
																}
															});
														}

														res.json({"err_code": 0, "err_msg": "Adverse Event has been add.", "data": [{"_id": carePlanId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code

										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'CARE_PLAN_STATUS', function (resStatusCode) {
													if (resStatusCode.err_code > 0) {
														myEmitter.emit('checkIdentifierValue');
													} else {
														res.json({
															"err_code": "527",
															"err_msg": "Status code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIdentifierValue');
											}
										})

										myEmitter.prependOnceListener('checkIntent', function () {
											if (!validator.isEmpty(intent)) {
												checkCode(apikey, intent, 'CARE_PLAN_INTENT', function (resIntentCode) {
													if (resIntentCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "526",
															"err_msg": "Intent code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})

										myEmitter.prependOnceListener('checkCategory', function () {
											if (!validator.isEmpty(category)) {
												checkCode(apikey, category, 'CARE_PLAN_CATEGORY', function (resCategoryCode) {
													if (resCategoryCode.err_code > 0) {
														myEmitter.emit('checkIntent');
													} else {
														res.json({
															"err_code": "525",
															"err_msg": "Category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIntent');
											}
										})

										myEmitter.prependOnceListener('checkActivityOutcomeCodeableConcept', function () {
											if (!validator.isEmpty(activityOutcomeCodeableConcept)) {
												checkCode(apikey, activityOutcomeCodeableConcept, 'CARE_PLAN_ACTIVITY_OUTCOME', function (resActivityOutcomeCodeableConceptCode) {
													if (resActivityOutcomeCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkCategory');
													} else {
														res.json({
															"err_code": "524",
															"err_msg": "Activity Outcome Codeable Concept code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCategory');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailCategory', function () {
											if (!validator.isEmpty(activityDetailCategory)) {
												checkCode(apikey, activityDetailCategory, 'CARE_PLAN_ACTIVITY_CATEGORY', function (resActivityDetailCategoryCode) {
													if (resActivityDetailCategoryCode.err_code > 0) {
														myEmitter.emit('checkActivityOutcomeCodeableConcept');
													} else {
														res.json({
															"err_code": "523",
															"err_msg": "ActivityDetailCategory code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityOutcomeCodeableConcept');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailCode', function () {
											if (!validator.isEmpty(activityDetailCode)) {
												checkCode(apikey, activityDetailCode, 'CARE_PLAN_ACTIVITY', function (resActivityDetailCodeCode) {
													if (resActivityDetailCodeCode.err_code > 0) {
														myEmitter.emit('checkActivityDetailCategory');
													} else {
														res.json({
															"err_code": "522",
															"err_msg": "ActivityDetailCode code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailCategory');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailReasonCode', function () {
											if (!validator.isEmpty(activityDetailReasonCode)) {
												checkCode(apikey, activityDetailReasonCode, 'ACTIVITY_REASON', function (resActivityDetailReasonCodeCode) {
													if (resActivityDetailReasonCodeCode.err_code > 0) {
														myEmitter.emit('checkActivityDetailCode');
													} else {
														res.json({
															"err_code": "521",
															"err_msg": "ActivityDetailReasonCode code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailCode');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailStatus', function () {
											if (!validator.isEmpty(activityDetailStatus)) {
												checkCode(apikey, activityDetailStatus, 'CARE_PLAN_ACTIVITY_STATUS', function (resActivityDetailStatusCode) {
													if (resActivityDetailStatusCode.err_code > 0) {
														myEmitter.emit('checkActivityDetailReasonCode');
													} else {
														res.json({
															"err_code": "521",
															"err_msg": "ActivityDetailStatus code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailReasonCode');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailProductProductCodeableConcept', function () {
											if (!validator.isEmpty(activityDetailProductProductCodeableConcept)) {
												checkCode(apikey, activityDetailProductProductCodeableConcept, 'MEDICATION_CODES', function (resActivityDetailProductCodeableConceptCode) {
													if (resActivityDetailProductCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkActivityDetailStatus');
													} else {
														res.json({
															"err_code": "521",
															"err_msg": "ActivityDetailProductCodeableConcept code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailStatus');
											}
										})
										
										myEmitter.prependOnceListener('checkRepeatDurationUnit', function () {
											if (!validator.isEmpty(checkActivityDetailProductProductCodeableConcept)) {
												checkCode(apikey, checkActivityDetailProductProductCodeableConcept, 'UNITS_OF_TIME', function (resRepeatDurationUnitCode) {
													if (resRepeatDurationUnitCode.err_code > 0) {
														myEmitter.emit('checkMedicationStatementId');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Repeat duration unit code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkMedicationStatementId');
											}
										})

										myEmitter.prependOnceListener('checkRepeatPeriodUnit', function () {
											if (!validator.isEmpty(TimingRepeatPeriodUnit)) {
												checkCode(apikey, TimingRepeatPeriodUnit, 'UNITS_OF_TIME', function (resRepeatPeriodUnitCode) {
													if (resRepeatPeriodUnitCode.err_code > 0) {
														myEmitter.emit('checkRepeatDurationUnit');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Repeat period unit code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRepeatDurationUnit');
											}
										})

										myEmitter.prependOnceListener('checkRepeatDayOfWeek', function () {
											if (!validator.isEmpty(TimingRepeatDayOfWeek)) {
												checkCode(apikey, TimingRepeatDayOfWeek, 'DAYS_OF_WEEK', function (resRepeatDayOfWeekCode) {
													if (resRepeatDayOfWeekCode.err_code > 0) {
														myEmitter.emit('checkRepeatPeriodUnit');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Repeat day of week code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRepeatPeriodUnit');
											}
										})

										myEmitter.prependOnceListener('checkRepeatWhen', function () {
											if (!validator.isEmpty(TimingRepeatWhen)) {
												checkCode(apikey, TimingRepeatWhen, 'EVENT_TIMING', function (resRepeatWhenCode) {
													if (resRepeatWhenCode.err_code > 0) {
														myEmitter.emit('checkRepeatDayOfWeek');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Repeat when code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRepeatDayOfWeek');
											}
										})

										myEmitter.prependOnceListener('checkTimingCode', function () {
											if (!validator.isEmpty(TimingCode)) {
												checkCode(apikey, TimingCode, 'TIMING_ABBREVIATION', function (resCodeCode) {
													if (resCodeCode.err_code > 0) {
														myEmitter.emit('checkRepeatWhen');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Code Timing code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRepeatWhen');
											}
										})

										//cek value
										/*
	definitionPlanDefinition|PLAN_DEFINITION
	definitionQuestionnaire|QUESTIONNAIRE
	partOf|CAREPLAN
	basedOn|CAREPLAN
	replaces|CAREPLAN
	subjectPatient|Patient
	subjectGroup|Group
	contextEncounter|Encounter
	contextEpisodeOfCare|EPISODE_OF_CARE
	authorPatient|Patient
	authorPractitioner|Practitioner
	authorRelatedPerson|Related_Person
	authorOrganization|Organization
	authorCareTeam|Care_Team
	addresses|Condition
	goal|goal
	activityReferenceAppointment|Appointment
	activityReferenceCommunicationRequest|Communication_Request|
	activityReferenceDeviceRequest|DEVICE_REQUEST
	activityReferenceMedicationRequest|MEDICATION_REQUEST|
	activityReferenceNutritionOrder|NUTRITION_ORDER
	activityReferenceTask|Task
	activityReferenceProcedureRequest|Procedure_Request
	activityReferenceReferralRequest|Referral_Request
	activityReferenceVisionPrescription|VISION_PRESCRIPTION
	activityReferenceRequestGroup|Request_Group
	activityDetailDefinitionPlanDefinition|Plan_Definition
	activityDetailDefinitionActivityDefinition|Activity_Definition|
	activityDetailDefinitionQuestionnaire|Questionnaire
	activityDetailReasonReference|Reason_Reference
	activityDetailGoal|Goal
	activityDetailScheduledScheduledTiming|Timing
	activityDetailLocation|location
	activityDetailPerformerPractitioner|Practitioner
	activityDetailPerformerOrganization|Organization
	activityDetailPerformerRelatedPerson|Related_Person
	activityDetailPerformerPatient|Patient
	activityDetailPerformerCareTeam|Care_Team
	activityDetailProductProductReferenceMedication|Medication
	activityDetailProductProductReferenceSubstance|Substance
	noteAuthorPractitioner|Practitioner
	noteAuthorPatient|Patient
	noteAuthorRelatedPerson|Related_Person
	activityProgressAuthorAuthorReferencePractitioner|Practitioner
	activityProgressAuthorAuthorReferencePatient|Patient
	activityProgressAuthorAuthorReferenceRelatedPerson|Related_Person*/

										myEmitter.prependOnceListener('checkDefinitionPlanDefinition', function () {
											if (!validator.isEmpty(definitionPlanDefinition)) {
												checkUniqeValue(apikey, "PLAN_DEFINITION_ID|" + definitionPlanDefinition, 'PLAN_DEFINITION', function (resDefinitionPlanDefinition) {
													if (resDefinitionPlanDefinition.err_code > 0) {
														myEmitter.emit('checkTimingCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Definition plan definition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkTimingCode');
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

										myEmitter.prependOnceListener('checkPartOf', function () {
											if (!validator.isEmpty(partOf)) {
												checkUniqeValue(apikey, "CAREPLAN_ID|" + partOf, 'CAREPLAN', function (resPartOf) {
													if (resPartOf.err_code > 0) {
														myEmitter.emit('checkDefinitionQuestionnaire');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Part of id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDefinitionQuestionnaire');
											}
										})

										myEmitter.prependOnceListener('checkBasedOn', function () {
											if (!validator.isEmpty(basedOn)) {
												checkUniqeValue(apikey, "CAREPLAN_ID|" + basedOn, 'CAREPLAN', function (resBasedOn) {
													if (resBasedOn.err_code > 0) {
														myEmitter.emit('checkPartOf');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPartOf');
											}
										})

										myEmitter.prependOnceListener('checkReplaces', function () {
											if (!validator.isEmpty(replaces)) {
												checkUniqeValue(apikey, "CAREPLAN_ID|" + replaces, 'CAREPLAN', function (resReplaces) {
													if (resReplaces.err_code > 0) {
														myEmitter.emit('checkBasedOn');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Replaces id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOn');
											}
										})

										myEmitter.prependOnceListener('checkSubjectPatient', function () {
											if (!validator.isEmpty(subjectPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
													if (resSubjectPatient.err_code > 0) {
														myEmitter.emit('checkReplaces');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subject patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReplaces');
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

										myEmitter.prependOnceListener('checkAuthorPatient', function () {
											if (!validator.isEmpty(authorPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + authorPatient, 'PATIENT', function (resAuthorPatient) {
													if (resAuthorPatient.err_code > 0) {
														myEmitter.emit('checkContextEpisodeOfCare');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Author patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEpisodeOfCare');
											}
										})

										myEmitter.prependOnceListener('checkAuthorPractitioner', function () {
											if (!validator.isEmpty(authorPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + authorPractitioner, 'PRACTITIONER', function (resAuthorPractitioner) {
													if (resAuthorPractitioner.err_code > 0) {
														myEmitter.emit('checkAuthorPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Author practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAuthorPatient');
											}
										})

										myEmitter.prependOnceListener('checkAuthorRelatedPerson', function () {
											if (!validator.isEmpty(authorRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + authorRelatedPerson, 'RELATED_PERSON', function (resAuthorRelatedPerson) {
													if (resAuthorRelatedPerson.err_code > 0) {
														myEmitter.emit('checkAuthorPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Author related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAuthorPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkAuthorOrganization', function () {
											if (!validator.isEmpty(authorOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + authorOrganization, 'ORGANIZATION', function (resAuthorOrganization) {
													if (resAuthorOrganization.err_code > 0) {
														myEmitter.emit('checkAuthorRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Author organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAuthorRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkAuthorCareTeam', function () {
											if (!validator.isEmpty(authorCareTeam)) {
												checkUniqeValue(apikey, "CARE_TEAM_ID|" + authorCareTeam, 'CARE_TEAM', function (resAuthorCareTeam) {
													if (resAuthorCareTeam.err_code > 0) {
														myEmitter.emit('checkAuthorOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Author care team id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAuthorOrganization');
											}
										})

										myEmitter.prependOnceListener('checkAddresses', function () {
											if (!validator.isEmpty(addresses)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + addresses, 'CONDITION', function (resAddresses) {
													if (resAddresses.err_code > 0) {
														myEmitter.emit('checkAuthorCareTeam');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Addresses id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAuthorCareTeam');
											}
										})

										myEmitter.prependOnceListener('checkGoal', function () {
											if (!validator.isEmpty(goal)) {
												checkUniqeValue(apikey, "GOAL_ID|" + goal, 'GOAL', function (resGoal) {
													if (resGoal.err_code > 0) {
														myEmitter.emit('checkAddresses');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Goal id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddresses');
											}
										})

										myEmitter.prependOnceListener('checkActivityReferenceAppointment', function () {
											if (!validator.isEmpty(activityReferenceAppointment)) {
												checkUniqeValue(apikey, "APPOINTMENT_ID|" + activityReferenceAppointment, 'APPOINTMENT', function (resActivityReferenceAppointment) {
													if (resActivityReferenceAppointment.err_code > 0) {
														myEmitter.emit('checkGoal');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity reference appointment id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkGoal');
											}
										})

										myEmitter.prependOnceListener('checkActivityReferenceCommunicationRequest', function () {
											if (!validator.isEmpty(activityReferenceCommunicationRequest)) {
												checkUniqeValue(apikey, "COMMUNICATION_REQUEST_ID|" + activityReferenceCommunicationRequest, 'COMMUNICATION_REQUEST', function (resActivityReferenceCommunicationRequest) {
													if (resActivityReferenceCommunicationRequest.err_code > 0) {
														myEmitter.emit('checkActivityReferenceAppointment');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity reference communication request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityReferenceAppointment');
											}
										})

										myEmitter.prependOnceListener('checkActivityReferenceDeviceRequest', function () {
											if (!validator.isEmpty(activityReferenceDeviceRequest)) {
												checkUniqeValue(apikey, "DEVICE_REQUEST_ID|" + activityReferenceDeviceRequest, 'DEVICE_REQUEST', function (resActivityReferenceDeviceRequest) {
													if (resActivityReferenceDeviceRequest.err_code > 0) {
														myEmitter.emit('checkActivityReferenceCommunicationRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity reference device request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityReferenceCommunicationRequest');
											}
										})

										myEmitter.prependOnceListener('checkActivityReferenceMedicationRequest', function () {
											if (!validator.isEmpty(activityReferenceMedicationRequest)) {
												checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + activityReferenceMedicationRequest, 'MEDICATION_REQUEST', function (resActivityReferenceMedicationRequest) {
													if (resActivityReferenceMedicationRequest.err_code > 0) {
														myEmitter.emit('checkActivityReferenceDeviceRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity reference medication request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityReferenceDeviceRequest');
											}
										})


										myEmitter.prependOnceListener('checkActivityReferenceNutritionOrder', function () {
											if (!validator.isEmpty(activityReferenceNutritionOrder)) {
												checkUniqeValue(apikey, "NUTRITION_ORDER_ID|" + activityReferenceNutritionOrder, 'NUTRITION_ORDER', function (resActivityReferenceNutritionOrder) {
													if (resActivityReferenceNutritionOrder.err_code > 0) {
														myEmitter.emit('checkActivityReferenceMedicationRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity reference nutrition order id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityReferenceMedicationRequest');
											}
										})

										myEmitter.prependOnceListener('checkActivityReferenceTask', function () {
											if (!validator.isEmpty(activityReferenceTask)) {
												checkUniqeValue(apikey, "TASK_ID|" + activityReferenceTask, 'TASK', function (resActivityReferenceTask) {
													if (resActivityReferenceTask.err_code > 0) {
														myEmitter.emit('checkActivityReferenceNutritionOrder');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity reference task id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityReferenceNutritionOrder');
											}
										})

										myEmitter.prependOnceListener('checkActivityReferenceProcedureRequest', function () {
											if (!validator.isEmpty(activityReferenceProcedureRequest)) {
												checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + activityReferenceProcedureRequest, 'PROCEDURE_REQUEST', function (resActivityReferenceProcedureRequest) {
													if (resActivityReferenceProcedureRequest.err_code > 0) {
														myEmitter.emit('checkActivityReferenceTask');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity reference procedure request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityReferenceTask');
											}
										})

										myEmitter.prependOnceListener('checkActivityReferenceReferralRequest', function () {
											if (!validator.isEmpty(activityReferenceReferralRequest)) {
												checkUniqeValue(apikey, "REFERRAL_REQUEST_ID|" + activityReferenceReferralRequest, 'REFERRAL_REQUEST', function (resActivityReferenceReferralRequest) {
													if (resActivityReferenceReferralRequest.err_code > 0) {
														myEmitter.emit('checkActivityReferenceProcedureRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity reference referral request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityReferenceProcedureRequest');
											}
										})

										myEmitter.prependOnceListener('checkActivityReferenceVisionPrescription', function () {
											if (!validator.isEmpty(activityReferenceVisionPrescription)) {
												checkUniqeValue(apikey, "VISION_PRESCRIPTION_ID|" + activityReferenceVisionPrescription, 'VISION_PRESCRIPTION', function (resActivityReferenceVisionPrescription) {
													if (resActivityReferenceVisionPrescription.err_code > 0) {
														myEmitter.emit('checkActivityReferenceReferralRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity reference vision prescription id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityReferenceReferralRequest');
											}
										})

										myEmitter.prependOnceListener('checkActivityReferenceRequestGroup', function () {
											if (!validator.isEmpty(activityReferenceRequestGroup)) {
												checkUniqeValue(apikey, "REQUEST_GROUP_ID|" + activityReferenceRequestGroup, 'REQUEST_GROUP', function (resActivityReferenceRequestGroup) {
													if (resActivityReferenceRequestGroup.err_code > 0) {
														myEmitter.emit('checkActivityReferenceVisionPrescription');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity reference request group id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityReferenceVisionPrescription');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailDefinitionPlanDefinition', function () {
											if (!validator.isEmpty(activityDetailDefinitionPlanDefinition)) {
												checkUniqeValue(apikey, "PLAN_DEFINITION_ID|" + activityDetailDefinitionPlanDefinition, 'PLAN_DEFINITION', function (resActivityDetailDefinitionPlanDefinition) {
													if (resActivityDetailDefinitionPlanDefinition.err_code > 0) {
														myEmitter.emit('checkActivityReferenceRequestGroup');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity detail definition plan definition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityReferenceRequestGroup');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailDefinitionActivityDefinition', function () {
											if (!validator.isEmpty(activityDetailDefinitionActivityDefinition)) {
												checkUniqeValue(apikey, "ACTIVITY_DEFINITION_ID|" + activityDetailDefinitionActivityDefinition, 'ACTIVITY_DEFINITION', function (resActivityDetailDefinitionActivityDefinition) {
													if (resActivityDetailDefinitionActivityDefinition.err_code > 0) {
														myEmitter.emit('checkActivityDetailDefinitionPlanDefinition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity detail definition activity definition id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailDefinitionPlanDefinition');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailDefinitionQuestionnaire', function () {
											if (!validator.isEmpty(activityDetailDefinitionQuestionnaire)) {
												checkUniqeValue(apikey, "QUESTIONNAIRE_ID|" + activityDetailDefinitionQuestionnaire, 'QUESTIONNAIRE', function (resActivityDetailDefinitionQuestionnaire) {
													if (resActivityDetailDefinitionQuestionnaire.err_code > 0) {
														myEmitter.emit('checkActivityDetailDefinitionActivityDefinition');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity detail definition questionnaire id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailDefinitionActivityDefinition');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailReasonReference', function () {
											if (!validator.isEmpty(activityDetailReasonReference)) {
												checkUniqeValue(apikey, "REASON_REFERENCE_ID|" + activityDetailReasonReference, 'REASON_REFERENCE', function (resActivityDetailReasonReference) {
													if (resActivityDetailReasonReference.err_code > 0) {
														myEmitter.emit('checkActivityDetailDefinitionQuestionnaire');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity detail reason reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailDefinitionQuestionnaire');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailGoal', function () {
											if (!validator.isEmpty(activityDetailGoal)) {
												checkUniqeValue(apikey, "GOAL_ID|" + activityDetailGoal, 'GOAL', function (resActivityDetailGoal) {
													if (resActivityDetailGoal.err_code > 0) {
														myEmitter.emit('checkActivityDetailReasonReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity detail goal id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailReasonReference');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailScheduledScheduledTiming', function () {
											if (!validator.isEmpty(activityDetailScheduledScheduledTiming)) {
												checkUniqeValue(apikey, "TIMING_ID|" + activityDetailScheduledScheduledTiming, 'TIMING', function (resActivityDetailScheduledScheduledTiming) {
													if (resActivityDetailScheduledScheduledTiming.err_code > 0) {
														myEmitter.emit('checkActivityDetailGoal');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity detail scheduled scheduled timing id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailGoal');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailLocation', function () {
											if (!validator.isEmpty(activityDetailLocation)) {
												checkUniqeValue(apikey, "LOCATION_ID|" + activityDetailLocation, 'LOCATION', function (resActivityDetailLocation) {
													if (resActivityDetailLocation.err_code > 0) {
														myEmitter.emit('checkActivityDetailScheduledScheduledTiming');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity detail location id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailScheduledScheduledTiming');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailPerformerPractitioner', function () {
											if (!validator.isEmpty(activityDetailPerformerPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + activityDetailPerformerPractitioner, 'PRACTITIONER', function (resActivityDetailPerformerPractitioner) {
													if (resActivityDetailPerformerPractitioner.err_code > 0) {
														myEmitter.emit('checkActivityDetailLocation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity detail performer practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailLocation');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailPerformerOrganization', function () {
											if (!validator.isEmpty(activityDetailPerformerOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + activityDetailPerformerOrganization, 'ORGANIZATION', function (resActivityDetailPerformerOrganization) {
													if (resActivityDetailPerformerOrganization.err_code > 0) {
														myEmitter.emit('checkActivityDetailPerformerPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity detail performer organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailPerformerPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailPerformerRelatedPerson', function () {
											if (!validator.isEmpty(activityDetailPerformerRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + activityDetailPerformerRelatedPerson, 'RELATED_PERSON', function (resActivityDetailPerformerRelatedPerson) {
													if (resActivityDetailPerformerRelatedPerson.err_code > 0) {
														myEmitter.emit('checkActivityDetailPerformerOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity detail performer related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailPerformerOrganization');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailPerformerPatient', function () {
											if (!validator.isEmpty(activityDetailPerformerPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + activityDetailPerformerPatient, 'PATIENT', function (resActivityDetailPerformerPatient) {
													if (resActivityDetailPerformerPatient.err_code > 0) {
														myEmitter.emit('checkActivityDetailPerformerRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity detail performer patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailPerformerRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailPerformerCareTeam', function () {
											if (!validator.isEmpty(activityDetailPerformerCareTeam)) {
												checkUniqeValue(apikey, "CARE_TEAM_ID|" + activityDetailPerformerCareTeam, 'CARE_TEAM', function (resActivityDetailPerformerCareTeam) {
													if (resActivityDetailPerformerCareTeam.err_code > 0) {
														myEmitter.emit('checkActivityDetailPerformerPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity detail performer care team id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailPerformerPatient');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailProductProductReferenceMedication', function () {
											if (!validator.isEmpty(activityDetailProductProductReferenceMedication)) {
												checkUniqeValue(apikey, "MEDICATION_ID|" + activityDetailProductProductReferenceMedication, 'MEDICATION', function (resActivityDetailProductProductReferenceMedication) {
													if (resActivityDetailProductProductReferenceMedication.err_code > 0) {
														myEmitter.emit('checkActivityDetailPerformerCareTeam');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity detail product product reference medication id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailPerformerCareTeam');
											}
										})

										myEmitter.prependOnceListener('checkActivityDetailProductProductReferenceSubstance', function () {
											if (!validator.isEmpty(activityDetailProductProductReferenceSubstance)) {
												checkUniqeValue(apikey, "SUBSTANCE_ID|" + activityDetailProductProductReferenceSubstance, 'SUBSTANCE', function (resActivityDetailProductProductReferenceSubstance) {
													if (resActivityDetailProductProductReferenceSubstance.err_code > 0) {
														myEmitter.emit('checkActivityDetailProductProductReferenceMedication');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity detail product product reference substance id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailProductProductReferenceMedication');
											}
										})
										
										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
											if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
													if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
														myEmitter.emit('checkActivityDetailProductProductReferenceSubstance');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Note author author reference practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkActivityDetailProductProductReferenceSubstance');
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

										myEmitter.prependOnceListener('checkNoteAuthorAuthorReferenceRelatedPerson', function () {
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
										})
										
										/*--------*/
										
										myEmitter.prependOnceListener('checkactivityProgressAuthorAuthorReferencePractitioner', function () {
											if (!validator.isEmpty(activityProgressAuthorAuthorReferencePractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + activityProgressAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
													if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
														myEmitter.emit('checkNoteAuthorAuthorReferenceRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity progress author reference practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkNoteAuthorAuthorReferenceRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkactivityProgressAuthorAuthorReferencePatient', function () {
											if (!validator.isEmpty(activityProgressAuthorAuthorReferencePatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + activityProgressAuthorAuthorReferencePatient, 'PATIENT', function (resNoteAuthorAuthorReferencePatient) {
													if (resNoteAuthorAuthorReferencePatient.err_code > 0) {
														myEmitter.emit('checkactivityProgressAuthorAuthorReferencePractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Activity progress author reference patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkactivityProgressAuthorAuthorReferencePractitioner');
											}
										})

										if (!validator.isEmpty(activityProgressAuthorAuthorReferenceRelatedPerson)) {
											checkUniqeValue(apikey, "RELATED_PERSON_ID|" + activityProgressAuthorAuthorReferenceRelatedPerson, 'RELATED_PERSON', function (resNoteAuthorAuthorReferenceRelatedPerson) {
												if (resNoteAuthorAuthorReferenceRelatedPerson.err_code > 0) {
													myEmitter.emit('checkactivityProgressAuthorAuthorReferencePatient');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Activity progress author reference related person id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkactivityProgressAuthorAuthorReferencePatient');
										}

										
										/*--------*/
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
			var carePlanId = req.params.care_plan_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof carePlanId !== 'undefined'){
				if(validator.isEmpty(carePlanId)){
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
												checkUniqeValue(apikey, "CAREPLAN_ID|" + carePlanId, 'CAREPLAN', function(resCarePlanId){
													if(resCarePlanId.err_code > 0){
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
															"care_plan_id": carePlanId
														}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Care Plan.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Care Plan Id not found"});		
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
		carePlanActivity: function addCarePlanActivity(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var carePlanId = req.params.care_plan_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof carePlanId !== 'undefined'){
				if(validator.isEmpty(carePlanId)){
					err_code = 2;
					err_msg = "Care Plan id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Plan id is required";
			}
			
			if(typeof req.body.outcomeCodeableConcept !== 'undefined'){
				var activityOutcomeCodeableConcept =  req.body.outcomeCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(activityOutcomeCodeableConcept)){
					activityOutcomeCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity outcome codeable concept' in json Care Plan request.";
			}

			if(typeof req.body.outcomeReference !== 'undefined'){
				var activityOutcomeReference =  req.body.outcomeReference.trim().toLowerCase();
				if(validator.isEmpty(activityOutcomeReference)){
					activityOutcomeReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity outcome reference' in json Care Plan request.";
			}

			if(typeof req.body.progress !== 'undefined'){
				var activityProgress =  req.body.progress.trim().toLowerCase();
				if(validator.isEmpty(activityProgress)){
					activityProgress = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity progress' in json Care Plan request.";
			}

			if(typeof req.body.reference.appointment !== 'undefined'){
				var activityReferenceAppointment =  req.body.reference.appointment.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceAppointment)){
					activityReferenceAppointment = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference appointment' in json Care Plan request.";
			}

			if(typeof req.body.reference.communicationRequest !== 'undefined'){
				var activityReferenceCommunicationRequest =  req.body.reference.communicationRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceCommunicationRequest)){
					activityReferenceCommunicationRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference communication request' in json Care Plan request.";
			}

			if(typeof req.body.reference.deviceRequest !== 'undefined'){
				var activityReferenceDeviceRequest =  req.body.reference.deviceRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceDeviceRequest)){
					activityReferenceDeviceRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference device request' in json Care Plan request.";
			}

			if(typeof req.body.reference.medicationRequest !== 'undefined'){
				var activityReferenceMedicationRequest =  req.body.reference.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceMedicationRequest)){
					activityReferenceMedicationRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference medication request' in json Care Plan request.";
			}

			if(typeof req.body.reference.nutritionOrder !== 'undefined'){
				var activityReferenceNutritionOrder =  req.body.reference.nutritionOrder.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceNutritionOrder)){
					activityReferenceNutritionOrder = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference nutrition order' in json Care Plan request.";
			}

			if(typeof req.body.reference.task !== 'undefined'){
				var activityReferenceTask =  req.body.reference.task.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceTask)){
					activityReferenceTask = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference task' in json Care Plan request.";
			}

			if(typeof req.body.reference.procedureRequest !== 'undefined'){
				var activityReferenceProcedureRequest =  req.body.reference.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceProcedureRequest)){
					activityReferenceProcedureRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference procedure request' in json Care Plan request.";
			}

			if(typeof req.body.reference.referralRequest !== 'undefined'){
				var activityReferenceReferralRequest =  req.body.reference.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceReferralRequest)){
					activityReferenceReferralRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference referral request' in json Care Plan request.";
			}

			if(typeof req.body.reference.visionPrescription !== 'undefined'){
				var activityReferenceVisionPrescription =  req.body.reference.visionPrescription.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceVisionPrescription)){
					activityReferenceVisionPrescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference vision prescription' in json Care Plan request.";
			}

			if(typeof req.body.reference.requestGroup !== 'undefined'){
				var activityReferenceRequestGroup =  req.body.reference.requestGroup.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceRequestGroup)){
					activityReferenceRequestGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'activity reference request group' in json Care Plan request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkCarePlanID', function(){
							checkUniqeValue(apikey, "CAREPLAN_ID|" + carePlanId, 'CAREPLAN', function(resCarePlanID){
								if(resCarePlanID.err_code > 0){
									var unicId = uniqid.time();
									var suspectEntityId = 'cpa' + unicId;
									//CarePlanActivity
									dataCarePlanActivity = {
														"careplan_activity_id" : carePlanActivityId,
														"outcome_codeable_concept" : activityOutcomeCodeableConcept,
														"outcome_reference" : activityOutcomeReference,
														"progress" : activityProgress,
														"reference_appointment" : activityReferenceAppointment,
														"reference_communication_request" : activityReferenceCommunicationRequest,
														"reference_device_request" : activityReferenceDeviceRequest,
														"reference_medication_request" : activityReferenceMedicationRequest,
														"reference_nutrition_order" : activityReferenceNutritionOrder,
														"reference_task" : activityReferenceTask,
														"reference_procedure_request" : activityReferenceProcedureRequest,
														"reference_referral_request" : activityReferenceReferralRequest,
														"reference_vision_prescription" : activityReferenceVisionPrescription,
														"reference_request_group" : activityReferenceRequestGroup,
														"careplan_id" : carePlanId
													}
									ApiFHIR.post('carePlanActivity', {"apikey": apikey}, {body: dataCarePlanActivity, json: true}, function(error, response, body){
										carePlanActivity = body;
										if(carePlanActivity.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Care Plan Activity has been add in this Care Plan.", "data": carePlanActivity.data});
										}else{
											res.json(carePlanActivity);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Care Plan Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkActivityOutcomeCodeableConcept', function () {
							if (!validator.isEmpty(activityOutcomeCodeableConcept)) {
								checkCode(apikey, activityOutcomeCodeableConcept, 'CARE_PLAN_ACTIVITY_OUTCOME', function (resActivityOutcomeCodeableConceptCode) {
									if (resActivityOutcomeCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkCarePlanID');
									} else {
										res.json({
											"err_code": "524",
											"err_msg": "Activity Outcome Codeable Concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCarePlanID');
							}
						})
						
						myEmitter.prependOnceListener('checkActivityReferenceAppointment', function () {
							if (!validator.isEmpty(activityReferenceAppointment)) {
								checkUniqeValue(apikey, "APPOINTMENT_ID|" + activityReferenceAppointment, 'APPOINTMENT', function (resActivityReferenceAppointment) {
									if (resActivityReferenceAppointment.err_code > 0) {
										myEmitter.emit('checkActivityOutcomeCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference appointment id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityOutcomeCodeableConcept');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceCommunicationRequest', function () {
							if (!validator.isEmpty(activityReferenceCommunicationRequest)) {
								checkUniqeValue(apikey, "COMMUNICATION_REQUEST_ID|" + activityReferenceCommunicationRequest, 'COMMUNICATION_REQUEST', function (resActivityReferenceCommunicationRequest) {
									if (resActivityReferenceCommunicationRequest.err_code > 0) {
										myEmitter.emit('checkActivityReferenceAppointment');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference communication request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceAppointment');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceDeviceRequest', function () {
							if (!validator.isEmpty(activityReferenceDeviceRequest)) {
								checkUniqeValue(apikey, "DEVICE_REQUEST_ID|" + activityReferenceDeviceRequest, 'DEVICE_REQUEST', function (resActivityReferenceDeviceRequest) {
									if (resActivityReferenceDeviceRequest.err_code > 0) {
										myEmitter.emit('checkActivityReferenceCommunicationRequest');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference device request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceCommunicationRequest');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceMedicationRequest', function () {
							if (!validator.isEmpty(activityReferenceMedicationRequest)) {
								checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + activityReferenceMedicationRequest, 'MEDICATION_REQUEST', function (resActivityReferenceMedicationRequest) {
									if (resActivityReferenceMedicationRequest.err_code > 0) {
										myEmitter.emit('checkActivityReferenceDeviceRequest');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference medication request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceDeviceRequest');
							}
						})


						myEmitter.prependOnceListener('checkActivityReferenceNutritionOrder', function () {
							if (!validator.isEmpty(activityReferenceNutritionOrder)) {
								checkUniqeValue(apikey, "NUTRITION_ORDER_ID|" + activityReferenceNutritionOrder, 'NUTRITION_ORDER', function (resActivityReferenceNutritionOrder) {
									if (resActivityReferenceNutritionOrder.err_code > 0) {
										myEmitter.emit('checkActivityReferenceMedicationRequest');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference nutrition order id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceMedicationRequest');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceTask', function () {
							if (!validator.isEmpty(activityReferenceTask)) {
								checkUniqeValue(apikey, "TASK_ID|" + activityReferenceTask, 'TASK', function (resActivityReferenceTask) {
									if (resActivityReferenceTask.err_code > 0) {
										myEmitter.emit('checkActivityReferenceNutritionOrder');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference task id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceNutritionOrder');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceProcedureRequest', function () {
							if (!validator.isEmpty(activityReferenceProcedureRequest)) {
								checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + activityReferenceProcedureRequest, 'PROCEDURE_REQUEST', function (resActivityReferenceProcedureRequest) {
									if (resActivityReferenceProcedureRequest.err_code > 0) {
										myEmitter.emit('checkActivityReferenceTask');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference procedure request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceTask');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceReferralRequest', function () {
							if (!validator.isEmpty(activityReferenceReferralRequest)) {
								checkUniqeValue(apikey, "REFERRAL_REQUEST_ID|" + activityReferenceReferralRequest, 'REFERRAL_REQUEST', function (resActivityReferenceReferralRequest) {
									if (resActivityReferenceReferralRequest.err_code > 0) {
										myEmitter.emit('checkActivityReferenceProcedureRequest');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference referral request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceProcedureRequest');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceVisionPrescription', function () {
							if (!validator.isEmpty(activityReferenceVisionPrescription)) {
								checkUniqeValue(apikey, "VISION_PRESCRIPTION_ID|" + activityReferenceVisionPrescription, 'VISION_PRESCRIPTION', function (resActivityReferenceVisionPrescription) {
									if (resActivityReferenceVisionPrescription.err_code > 0) {
										myEmitter.emit('checkActivityReferenceReferralRequest');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference vision prescription id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceReferralRequest');
							}
						})

						if (!validator.isEmpty(activityReferenceRequestGroup)) {
							checkUniqeValue(apikey, "REQUEST_GROUP_ID|" + activityReferenceRequestGroup, 'REQUEST_GROUP', function (resActivityReferenceRequestGroup) {
								if (resActivityReferenceRequestGroup.err_code > 0) {
									myEmitter.emit('checkActivityReferenceVisionPrescription');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Activity reference request group id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkActivityReferenceVisionPrescription');
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
		carePlanActivityDetail: function addCarePlanActivityDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var carePlanActivityId = req.params.care_plan_activity_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof carePlanActivityId !== 'undefined'){
				if(validator.isEmpty(carePlanActivityId)){
					err_code = 2;
					err_msg = "Care Plan Activity id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Plan Activity id is required";
			}
			
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkCarePlanActivityID', function(){
							checkUniqeValue(apikey, "CAREPLAN_ACTIVITY_ID|" + carePlanActivityId, 'CAREPLAN_ACTIVITY', function(resCarePlanID){
								if(resCarePlanID.err_code > 0){
									var unicId = uniqid.time();
									var suspectEntityId = 'cad' + unicId;
									//CarePlanActivityDetail
									dataCarePlanActivityDetail = {
										"activity_detail_id" : carePlanActivityDetailId,
										"category" : activityDetailCategory,
										"definition_plan_definition" : activityDetailDefinitionPlanDefinition,
										"definition_activity_definition" : activityDetailDefinitionActivityDefinition,
										"definition_questionnaire" : activityDetailDefinitionQuestionnaire,
										"code" : activityDetailCode,
										"reason_code" : activityDetailReasonCode,
										"status" : activityDetailStatus,
										"status_reason" : activityDetailStatusReason,
										"prohibited" : activityDetailProhibited,
										"scheduled_timing" : activityDetailScheduledScheduledTiming,
										"scheduled_period_start" : activityDetailScheduledScheduledPeriodStart,
										"scheduled_period_end" : activityDetailScheduledScheduledPeriodEnd,
										"scheduled_string" : activityDetailScheduledScheduledString,
										"location" : activityDetailLocation,
										"product_codeable_concept" : activityDetailProductProductCodeableConcept,
										"product_reference_medication" : activityDetailProductProductReferenceMedication,
										"product_reference_substance" : activityDetailProductProductReferenceSubstance,
										"daily_amount" : activityDetailDailyAmount,
										"quantity" : activityDetailDailyAmount,
										"description" : activityDetailDescription,
										"activity_id" : carePlanActivityId
									}
									ApiFHIR.post('carePlanActivityDetail', {"apikey": apikey}, {body: dataCarePlanActivityDetail, json: true}, function(error, response, body){
										carePlanActivityDetail = body;
										if(carePlanActivityDetail.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Care Plan Activity Detail has been add in this Care Plan.", "data": carePlanActivityDetail.data});
										}else{
											res.json(carePlanActivityDetail);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Care Plan Activity Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkActivityDetailCategory', function () {
							if (!validator.isEmpty(activityDetailCategory)) {
								checkCode(apikey, activityDetailCategory, 'CARE_PLAN_ACTIVITY_CATEGORY', function (resActivityDetailCategoryCode) {
									if (resActivityDetailCategoryCode.err_code > 0) {
										myEmitter.emit('checkCarePlanActivityID');
									} else {
										res.json({
											"err_code": "523",
											"err_msg": "ActivityDetailCategory code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCarePlanActivityID');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailCode', function () {
							if (!validator.isEmpty(activityDetailCode)) {
								checkCode(apikey, activityDetailCode, 'CARE_PLAN_ACTIVITY', function (resActivityDetailCodeCode) {
									if (resActivityDetailCodeCode.err_code > 0) {
										myEmitter.emit('checkActivityDetailCategory');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "ActivityDetailCode code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailCategory');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailReasonCode', function () {
							if (!validator.isEmpty(activityDetailReasonCode)) {
								checkCode(apikey, activityDetailReasonCode, 'ACTIVITY_REASON', function (resActivityDetailReasonCodeCode) {
									if (resActivityDetailReasonCodeCode.err_code > 0) {
										myEmitter.emit('checkActivityDetailCode');
									} else {
										res.json({
											"err_code": "521",
											"err_msg": "ActivityDetailReasonCode code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailCode');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailStatus', function () {
							if (!validator.isEmpty(activityDetailStatus)) {
								checkCode(apikey, activityDetailStatus, 'CARE_PLAN_ACTIVITY_STATUS', function (resActivityDetailStatusCode) {
									if (resActivityDetailStatusCode.err_code > 0) {
										myEmitter.emit('checkActivityDetailReasonCode');
									} else {
										res.json({
											"err_code": "521",
											"err_msg": "ActivityDetailStatus code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailReasonCode');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailProductProductCodeableConcept', function () {
							if (!validator.isEmpty(activityDetailProductProductCodeableConcept)) {
								checkCode(apikey, activityDetailProductProductCodeableConcept, 'MEDICATION_CODES', function (resActivityDetailProductCodeableConceptCode) {
									if (resActivityDetailProductCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkActivityDetailStatus');
									} else {
										res.json({
											"err_code": "521",
											"err_msg": "ActivityDetailProductCodeableConcept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailStatus');
							}
						})
						
						myEmitter.prependOnceListener('checkActivityDetailDefinitionPlanDefinition', function () {
							if (!validator.isEmpty(activityDetailDefinitionPlanDefinition)) {
								checkUniqeValue(apikey, "PLAN_DEFINITION_ID|" + activityDetailDefinitionPlanDefinition, 'PLAN_DEFINITION', function (resActivityDetailDefinitionPlanDefinition) {
									if (resActivityDetailDefinitionPlanDefinition.err_code > 0) {
										myEmitter.emit('checkActivityReferenceRequestGroup');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail definition plan definition id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceRequestGroup');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailDefinitionActivityDefinition', function () {
							if (!validator.isEmpty(activityDetailDefinitionActivityDefinition)) {
								checkUniqeValue(apikey, "ACTIVITY_DEFINITION_ID|" + activityDetailDefinitionActivityDefinition, 'ACTIVITY_DEFINITION', function (resActivityDetailDefinitionActivityDefinition) {
									if (resActivityDetailDefinitionActivityDefinition.err_code > 0) {
										myEmitter.emit('checkActivityDetailDefinitionPlanDefinition');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail definition activity definition id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailDefinitionPlanDefinition');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailDefinitionQuestionnaire', function () {
							if (!validator.isEmpty(activityDetailDefinitionQuestionnaire)) {
								checkUniqeValue(apikey, "QUESTIONNAIRE_ID|" + activityDetailDefinitionQuestionnaire, 'QUESTIONNAIRE', function (resActivityDetailDefinitionQuestionnaire) {
									if (resActivityDetailDefinitionQuestionnaire.err_code > 0) {
										myEmitter.emit('checkActivityDetailDefinitionActivityDefinition');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail definition questionnaire id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailDefinitionActivityDefinition');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailReasonReference', function () {
							if (!validator.isEmpty(activityDetailReasonReference)) {
								checkUniqeValue(apikey, "REASON_REFERENCE_ID|" + activityDetailReasonReference, 'REASON_REFERENCE', function (resActivityDetailReasonReference) {
									if (resActivityDetailReasonReference.err_code > 0) {
										myEmitter.emit('checkActivityDetailDefinitionQuestionnaire');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail reason reference id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailDefinitionQuestionnaire');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailGoal', function () {
							if (!validator.isEmpty(activityDetailGoal)) {
								checkUniqeValue(apikey, "GOAL_ID|" + activityDetailGoal, 'GOAL', function (resActivityDetailGoal) {
									if (resActivityDetailGoal.err_code > 0) {
										myEmitter.emit('checkActivityDetailReasonReference');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail goal id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailReasonReference');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailScheduledScheduledTiming', function () {
							if (!validator.isEmpty(activityDetailScheduledScheduledTiming)) {
								checkUniqeValue(apikey, "TIMING_ID|" + activityDetailScheduledScheduledTiming, 'TIMING', function (resActivityDetailScheduledScheduledTiming) {
									if (resActivityDetailScheduledScheduledTiming.err_code > 0) {
										myEmitter.emit('checkActivityDetailGoal');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail scheduled scheduled timing id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailGoal');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailLocation', function () {
							if (!validator.isEmpty(activityDetailLocation)) {
								checkUniqeValue(apikey, "LOCATION_ID|" + activityDetailLocation, 'LOCATION', function (resActivityDetailLocation) {
									if (resActivityDetailLocation.err_code > 0) {
										myEmitter.emit('checkActivityDetailScheduledScheduledTiming');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail location id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailScheduledScheduledTiming');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailPerformerPractitioner', function () {
							if (!validator.isEmpty(activityDetailPerformerPractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + activityDetailPerformerPractitioner, 'PRACTITIONER', function (resActivityDetailPerformerPractitioner) {
									if (resActivityDetailPerformerPractitioner.err_code > 0) {
										myEmitter.emit('checkActivityDetailLocation');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail performer practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailLocation');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailPerformerOrganization', function () {
							if (!validator.isEmpty(activityDetailPerformerOrganization)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + activityDetailPerformerOrganization, 'ORGANIZATION', function (resActivityDetailPerformerOrganization) {
									if (resActivityDetailPerformerOrganization.err_code > 0) {
										myEmitter.emit('checkActivityDetailPerformerPractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail performer organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailPerformerPractitioner');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailPerformerRelatedPerson', function () {
							if (!validator.isEmpty(activityDetailPerformerRelatedPerson)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + activityDetailPerformerRelatedPerson, 'RELATED_PERSON', function (resActivityDetailPerformerRelatedPerson) {
									if (resActivityDetailPerformerRelatedPerson.err_code > 0) {
										myEmitter.emit('checkActivityDetailPerformerOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail performer related person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailPerformerOrganization');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailPerformerPatient', function () {
							if (!validator.isEmpty(activityDetailPerformerPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + activityDetailPerformerPatient, 'PATIENT', function (resActivityDetailPerformerPatient) {
									if (resActivityDetailPerformerPatient.err_code > 0) {
										myEmitter.emit('checkActivityDetailPerformerRelatedPerson');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail performer patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailPerformerRelatedPerson');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailPerformerCareTeam', function () {
							if (!validator.isEmpty(activityDetailPerformerCareTeam)) {
								checkUniqeValue(apikey, "CARE_TEAM_ID|" + activityDetailPerformerCareTeam, 'CARE_TEAM', function (resActivityDetailPerformerCareTeam) {
									if (resActivityDetailPerformerCareTeam.err_code > 0) {
										myEmitter.emit('checkActivityDetailPerformerPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail performer care team id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailPerformerPatient');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailProductProductReferenceMedication', function () {
							if (!validator.isEmpty(activityDetailProductProductReferenceMedication)) {
								checkUniqeValue(apikey, "MEDICATION_ID|" + activityDetailProductProductReferenceMedication, 'MEDICATION', function (resActivityDetailProductProductReferenceMedication) {
									if (resActivityDetailProductProductReferenceMedication.err_code > 0) {
										myEmitter.emit('checkActivityDetailPerformerCareTeam');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail product product reference medication id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailPerformerCareTeam');
							}
						})

						if (!validator.isEmpty(activityDetailProductProductReferenceSubstance)) {
							checkUniqeValue(apikey, "SUBSTANCE_ID|" + activityDetailProductProductReferenceSubstance, 'SUBSTANCE', function (resActivityDetailProductProductReferenceSubstance) {
								if (resActivityDetailProductProductReferenceSubstance.err_code > 0) {
									myEmitter.emit('checkActivityDetailProductProductReferenceMedication');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Activity detail product product reference substance id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkActivityDetailProductProductReferenceMedication');
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
		carePlanNote: function addCarePlanNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var carePlanId = req.params.care_plan_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof carePlanId !== 'undefined'){
				if(validator.isEmpty(carePlanId)){
					err_code = 2;
					err_msg = "Care Plan id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Plan id is required";
			}
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Care Plan request.";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Care Plan request.";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Care Plan request.";
			}

			if(typeof req.body.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Care Plan request.";
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
				err_msg = "Please add sub-key 'note time' in json Care Plan request.";
			}

			if(typeof req.body.text !== 'undefined'){
				var noteText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note.text' in json Care Plan request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkCarePlanID', function(){
							checkUniqeValue(apikey, "care_plan_id|" + carePlanId, 'care_plan', function(resCarePlanID){
								if(resCarePlanID.err_code > 0){
									var unicId = uniqid.time();
									var carePlanNoteId = 'ann' + unicId;
									//CarePlanNote
									dataCarePlanNote = {
										"id": carePlanNoteId,
										"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
										"author_ref_patient": noteAuthorAuthorReferencePatient,
										"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
										"author_string": noteAuthorAuthorString,
										"time": noteTime,
										"text": noteText,
										"care_plan_id" : carePlanId
									}
									ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataCarePlanNote, json: true}, function(error, response, body){
										carePlanNote = body;
										if(carePlanNote.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Care Plan Note has been add in this Care Plan.", "data": carePlanNote.data});
										}else{
											res.json(carePlanNote);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "CarePlan Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkCarePlanID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCarePlanID');
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
		carePlanActivityNote: function addCarePlanActivityNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var carePlanActivityId = req.params.care_plan_activity_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof carePlanActivityId !== 'undefined'){
				if(validator.isEmpty(carePlanActivityId)){
					err_code = 2;
					err_msg = "Care Plan Activity id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Plan Activity id is required";
			}
			
			if(typeof req.body.author.authorReference.practitioner !== 'undefined'){
				var noteAuthorAuthorReferencePractitioner =  req.body.author.authorReference.practitioner.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePractitioner)){
					noteAuthorAuthorReferencePractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference practitioner' in json Care Plan request.";
			}

			if(typeof req.body.author.authorReference.patient !== 'undefined'){
				var noteAuthorAuthorReferencePatient =  req.body.author.authorReference.patient.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferencePatient)){
					noteAuthorAuthorReferencePatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference patient' in json Care Plan request.";
			}

			if(typeof req.body.author.authorReference.relatedPerson !== 'undefined'){
				var noteAuthorAuthorReferenceRelatedPerson =  req.body.author.authorReference.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorReferenceRelatedPerson)){
					noteAuthorAuthorReferenceRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author reference related person' in json Care Plan request.";
			}

			if(typeof req.body.author.authorString !== 'undefined'){
				var noteAuthorAuthorString =  req.body.author.authorString.trim().toLowerCase();
				if(validator.isEmpty(noteAuthorAuthorString)){
					noteAuthorAuthorString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note author author string' in json Care Plan request.";
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
				err_msg = "Please add sub-key 'note time' in json Care Plan request.";
			}

			if(typeof req.body.text !== 'undefined'){
				var noteText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					noteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'note.text' in json Care Plan request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkCarePlanActivityID', function(){
							checkUniqeValue(apikey, "care_plan_activity_id|" + carePlanActivityId, 'care_plan_activity', function(resCarePlanActivityID){
								if(resCarePlanActivityID.err_code > 0){
									var unicId = uniqid.time();
									var carePlanActivityNoteId = 'ana' + unicId;
									//CarePlanActivityNote
									dataCarePlanActivityNote = {
										"id": carePlanActivityNoteId,
										"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
										"author_ref_patient": noteAuthorAuthorReferencePatient,
										"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
										"author_string": noteAuthorAuthorString,
										"time": noteTime,
										"text": noteText,
										"care_plan_activity_id" : carePlanActivityId
									}
									ApiFHIR.post('annotation', {"apikey": apikey}, {body: dataCarePlanActivityNote, json: true}, function(error, response, body){
										carePlanActivityNote = body;
										if(carePlanActivityNote.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Care Plan Activity Note has been add in this Care Plan Activity.", "data": carePlanActivityNote.data});
										}else{
											res.json(carePlanActivityNote);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "CarePlanActivity Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkCarePlanActivityID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCarePlanActivityID');
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
		carePlan : function putCarePlan(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var carePlanId = req.params.care_plan_id;

      var err_code = 0;
      var err_msg = "";
      var dataCarePlan = {};

			if(typeof carePlanId !== 'undefined'){
				if(validator.isEmpty(carePlanId)){
					err_code = 2;
					err_msg = "Care Plan id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Plan id is required";
			}
			
			/*
			var based_on = req.body.based_on;
			var replaces = req.body.replaces;
			var part_of = req.body.part_of;
			var status = req.body.status;
			var intent = req.body.intent;
			var category = req.body.category;
			var title = req.body.title;
			var description = req.body.description;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var period_start = req.body.period_start;
			var period_end = req.body.period_end;
			var supporting_info = req.body.supporting_info;
			*/

			/*if(typeof req.body.definition.planDefinition !== 'undefined' && req.body.definition.planDefinition !== ""){
				var definitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(definitionPlanDefinition)){
					dataCarePlan.plan_definition = "";
				}else{
					dataCarePlan.plan_definition = definitionPlanDefinition;
				}
			}else{
			  definitionPlanDefinition = "";
			}

			if(typeof req.body.definition.questionnaire !== 'undefined' && req.body.definition.questionnaire !== ""){
				var definitionQuestionnaire =  req.body.definition.questionnaire.trim().toLowerCase();
				if(validator.isEmpty(definitionQuestionnaire)){
					dataCarePlan.questionnaire = "";
				}else{
					dataCarePlan.questionnaire = definitionQuestionnaire;
				}
			}else{
			  definitionQuestionnaire = "";
			}
*/
			if(typeof req.body.partOf !== 'undefined' && req.body.partOf !== ""){
				var partOf =  req.body.partOf.trim().toLowerCase();
				if(validator.isEmpty(partOf)){
					dataCarePlan.part_of = "";
				}else{
					dataCarePlan.part_of = partOf;
				}
			}else{
			  partOf = "";
			}

			if(typeof req.body.basedOn !== 'undefined' && req.body.basedOn !== ""){
				var basedOn =  req.body.basedOn.trim().toLowerCase();
				if(validator.isEmpty(basedOn)){
					dataCarePlan.based_on = "";
				}else{
					dataCarePlan.based_on = basedOn;
				}
			}else{
			  basedOn = "";
			}

			if(typeof req.body.replaces !== 'undefined' && req.body.replaces !== ""){
				var replaces =  req.body.replaces.trim().toLowerCase();
				if(validator.isEmpty(replaces)){
					dataCarePlan.replaces = "";
				}else{
					dataCarePlan.replaces = replaces;
				}
			}else{
			  replaces = "";
			}

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "care plan status is required.";
				}else{
					dataCarePlan.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.intent !== 'undefined' && req.body.intent !== ""){
				var intent =  req.body.intent.trim().toLowerCase();
				if(validator.isEmpty(intent)){
					err_code = 2;
					err_msg = "care plan intent is required.";
				}else{
					dataCarePlan.intent = intent;
				}
			}else{
			  intent = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					dataCarePlan.category = "";
				}else{
					dataCarePlan.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.title !== 'undefined' && req.body.title !== ""){
				var title =  req.body.title.trim().toLowerCase();
				if(validator.isEmpty(title)){
					dataCarePlan.title = "";
				}else{
					dataCarePlan.title = title;
				}
			}else{
			  title = "";
			}

			if(typeof req.body.description !== 'undefined' && req.body.description !== ""){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					dataCarePlan.description = "";
				}else{
					dataCarePlan.description = description;
				}
			}else{
			  description = "";
			}
			
			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataCarePlan.subject_patient = "";
				}else{
					dataCarePlan.subject_patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataCarePlan.subject_group = "";
				}else{
					dataCarePlan.subject_group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					dataCarePlan.context_encounter = "";
				}else{
					dataCarePlan.context_encounter = contextEncounter;
				}
			}else{
			  contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					dataCarePlan.context_episode_of_care = "";
				}else{
					dataCarePlan.context_episode_of_care = contextEpisodeOfCare;
				}
			}else{
			  contextEpisodeOfCare = "";
			}

			if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
			  var period = req.body.period;
			  if (period.indexOf("to") > 0) {
			    arrPeriod = period.split("to");
			    dataCarePlan.period_start = arrPeriod[0];
			    dataCarePlan.period_end = arrPeriod[1];
			    if (!regex.test(periodStart) && !regex.test(periodEnd)) {
			      err_code = 2;
			      err_msg = "care plan period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "care plan period invalid date format.";
				}
			} else {
			  period = "";
			}

			/*if(typeof req.body.author.patient !== 'undefined' && req.body.author.patient !== ""){
				var authorPatient =  req.body.author.patient.trim().toLowerCase();
				if(validator.isEmpty(authorPatient)){
					dataCarePlan.patient = "";
				}else{
					dataCarePlan.patient = authorPatient;
				}
			}else{
			  authorPatient = "";
			}

			if(typeof req.body.author.practitioner !== 'undefined' && req.body.author.practitioner !== ""){
				var authorPractitioner =  req.body.author.practitioner.trim().toLowerCase();
				if(validator.isEmpty(authorPractitioner)){
					dataCarePlan.practitioner = "";
				}else{
					dataCarePlan.practitioner = authorPractitioner;
				}
			}else{
			  authorPractitioner = "";
			}

			if(typeof req.body.author.relatedPerson !== 'undefined' && req.body.author.relatedPerson !== ""){
				var authorRelatedPerson =  req.body.author.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(authorRelatedPerson)){
					dataCarePlan.related_person = "";
				}else{
					dataCarePlan.related_person = authorRelatedPerson;
				}
			}else{
			  authorRelatedPerson = "";
			}

			if(typeof req.body.author.organization !== 'undefined' && req.body.author.organization !== ""){
				var authorOrganization =  req.body.author.organization.trim().toLowerCase();
				if(validator.isEmpty(authorOrganization)){
					dataCarePlan.organization = "";
				}else{
					dataCarePlan.organization = authorOrganization;
				}
			}else{
			  authorOrganization = "";
			}

			if(typeof req.body.author.careTeam !== 'undefined' && req.body.author.careTeam !== ""){
				var authorCareTeam =  req.body.author.careTeam.trim().toLowerCase();
				if(validator.isEmpty(authorCareTeam)){
					dataCarePlan.care_team = "";
				}else{
					dataCarePlan.care_team = authorCareTeam;
				}
			}else{
			  authorCareTeam = "";
			}

			if(typeof req.body.addresses !== 'undefined' && req.body.addresses !== ""){
				var addresses =  req.body.addresses.trim().toLowerCase();
				if(validator.isEmpty(addresses)){
					dataCarePlan.addresses = "";
				}else{
					dataCarePlan.addresses = addresses;
				}
			}else{
			  addresses = "";
			}*/

			if(typeof req.body.supportingInfo !== 'undefined' && req.body.supportingInfo !== ""){
				var supportingInfo =  req.body.supportingInfo.trim().toLowerCase();
				if(validator.isEmpty(supportingInfo)){
					dataCarePlan.supporting_info = "";
				}else{
					dataCarePlan.supporting_info = supportingInfo;
				}
			}else{
			  supportingInfo = "";
			}

			/*if(typeof req.body.goal !== 'undefined' && req.body.goal !== ""){
				var goal =  req.body.goal.trim().toLowerCase();
				if(validator.isEmpty(goal)){
					dataCarePlan.goal = "";
				}else{
					dataCarePlan.goal = goal;
				}
			}else{
			  goal = "";
			}

			if(typeof req.body.note !== 'undefined' && req.body.note !== ""){
				var note =  req.body.note.trim().toLowerCase();
				if(validator.isEmpty(note)){
					dataCarePlan.note = "";
				}else{
					dataCarePlan.note = note;
				}
			}else{
			  note = "";
			}*/

			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkCarePlanId', function(){
						checkUniqeValue(apikey, "CAREPLAN_ID|" + carePlanId, 'CAREPLAN', function(resCarePlanId){
							if(resCarePlanId.err_code > 0){
								ApiFHIR.put('carePlan', {"apikey": apikey, "_id": carePlanId}, {body: dataCarePlan, json: true}, function(error, response, body){
									carePlan = body;
									if(carePlan.err_code > 0){
										res.json(carePlan);	
									}else{
										res.json({"err_code": 0, "err_msg": "Care Plan has been update.", "data": [{"_id": carePlanId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Care Plan Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkStatus', function () {
						if (!validator.isEmpty(status)) {
							checkCode(apikey, status, 'CARE_PLAN_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) {
									myEmitter.emit('checkCarePlanId');
								} else {
									res.json({
										"err_code": "527",
										"err_msg": "Status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCarePlanId');
						}
					})

					myEmitter.prependOnceListener('checkIntent', function () {
						if (!validator.isEmpty(intent)) {
							checkCode(apikey, intent, 'CARE_PLAN_INTENT', function (resIntentCode) {
								if (resIntentCode.err_code > 0) {
									myEmitter.emit('checkStatus');
								} else {
									res.json({
										"err_code": "526",
										"err_msg": "Intent code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkStatus');
						}
					})

					myEmitter.prependOnceListener('checkCategory', function () {
						if (!validator.isEmpty(category)) {
							checkCode(apikey, category, 'CARE_PLAN_CATEGORY', function (resCategoryCode) {
								if (resCategoryCode.err_code > 0) {
									myEmitter.emit('checkIntent');
								} else {
									res.json({
										"err_code": "525",
										"err_msg": "Category code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkIntent');
						}
					})

					myEmitter.prependOnceListener('checkPartOf', function () {
						if (!validator.isEmpty(partOf)) {
							checkUniqeValue(apikey, "CAREPLAN_ID|" + partOf, 'CAREPLAN', function (resPartOf) {
								if (resPartOf.err_code > 0) {
									myEmitter.emit('checkCategory');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Part of id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCategory');
						}
					})

					myEmitter.prependOnceListener('checkBasedOn', function () {
						if (!validator.isEmpty(basedOn)) {
							checkUniqeValue(apikey, "CAREPLAN_ID|" + basedOn, 'CAREPLAN', function (resBasedOn) {
								if (resBasedOn.err_code > 0) {
									myEmitter.emit('checkPartOf');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Based on id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPartOf');
						}
					})

					myEmitter.prependOnceListener('checkReplaces', function () {
						if (!validator.isEmpty(replaces)) {
							checkUniqeValue(apikey, "CAREPLAN_ID|" + replaces, 'CAREPLAN', function (resReplaces) {
								if (resReplaces.err_code > 0) {
									myEmitter.emit('checkBasedOn');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Replaces id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkBasedOn');
						}
					})

					myEmitter.prependOnceListener('checkSubjectPatient', function () {
						if (!validator.isEmpty(subjectPatient)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + subjectPatient, 'PATIENT', function (resSubjectPatient) {
								if (resSubjectPatient.err_code > 0) {
									myEmitter.emit('checkReplaces');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkReplaces');
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
			var carePlanId = req.params.medication_administration_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof carePlanId !== 'undefined'){
				if(validator.isEmpty(carePlanId)){
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
						myEmitter.prependOnceListener('checkCarePlanId', function(){
							checkUniqeValue(apikey, "CAREPLAN_ID|" + carePlanId, 'CAREPLAN_ID', function(resCarePlanID){
								if(resCarePlanID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "CARE_PLAN_ID|"+carePlanId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Care Plan.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Care Plan Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkCarePlanId');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkCarePlanId');				
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
		carePlanActivity: function updateCarePlanActivity(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var carePlanId = req.params.care_plan_id;
			var carePlanActivityId = req.params.care_plan_activity_id;

			var err_code = 0;
			var err_msg = "";
			var dataCarePlan = {};
			//input check 
			if(typeof carePlanId !== 'undefined'){
				if(validator.isEmpty(carePlanId)){
					err_code = 2;
					err_msg = "Care Plan id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Plan id is required";
			}

			if(typeof carePlanActivityId !== 'undefined'){
				if(validator.isEmpty(carePlanActivityId)){
					err_code = 2;
					err_msg = "Care Plan Activity id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Plan Activity id is required";
			}
			
			/*
			var outcome_codeable_concept  = req.body.outcome_codeable_concept;
			var outcome_reference  = req.body.outcome_reference;
			var progress  = req.body.progress;
			var reference_appointment  = req.body.reference_appointment;
			var reference_communication_request  = req.body.reference_communication_request;
			var reference_device_request  = req.body.reference_device_request;
			var reference_medication_request  = req.body.reference_medication_request;
			var reference_nutrition_order  = req.body.reference_nutrition_order;
			var reference_task  = req.body.reference_task;
			var reference_procedure_request  = req.body.reference_procedure_request;
			var reference_referral_request  = req.body.reference_referral_request;
			var reference_vision_prescription  = req.body.reference_vision_prescription;
			var reference_request_group  = req.body.reference_request_group;
			*/
			if(typeof req.body.outcomeCodeableConcept !== 'undefined' && req.body.outcomeCodeableConcept !== ""){
				var activityOutcomeCodeableConcept =  req.body.outcomeCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(activityOutcomeCodeableConcept)){
					dataCarePlan.outcome_codeable_concept = "";
				}else{
					dataCarePlan.outcome_codeable_concept = activityOutcomeCodeableConcept;
				}
			}else{
			  activityOutcomeCodeableConcept = "";
			}

			if(typeof req.body.outcomeReference !== 'undefined' && req.body.outcomeReference !== ""){
				var activityOutcomeReference =  req.body.outcomeReference.trim().toLowerCase();
				if(validator.isEmpty(activityOutcomeReference)){
					dataCarePlan.outcome_reference = "";
				}else{
					dataCarePlan.outcome_reference = activityOutcomeReference;
				}
			}else{
			  activityOutcomeReference = "";
			}

			if(typeof req.body.progress !== 'undefined' && req.body.progress !== ""){
				var activityProgress =  req.body.progress.trim().toLowerCase();
				if(validator.isEmpty(activityProgress)){
					dataCarePlan.progress = "";
				}else{
					dataCarePlan.progress = activityProgress;
				}
			}else{
			  activityProgress = "";
			}

			if(typeof req.body.reference.appointment !== 'undefined' && req.body.reference.appointment !== ""){
				var activityReferenceAppointment =  req.body.reference.appointment.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceAppointment)){
					dataCarePlan.reference_appointment = "";
				}else{
					dataCarePlan.reference_appointment = activityReferenceAppointment;
				}
			}else{
			  activityReferenceAppointment = "";
			}

			if(typeof req.body.reference.communicationRequest !== 'undefined' && req.body.reference.communicationRequest !== ""){
				var activityReferenceCommunicationRequest =  req.body.reference.communicationRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceCommunicationRequest)){
					dataCarePlan.reference_communication_request = "";
				}else{
					dataCarePlan.reference_communication_request = activityReferenceCommunicationRequest;
				}
			}else{
			  activityReferenceCommunicationRequest = "";
			}

			if(typeof req.body.reference.deviceRequest !== 'undefined' && req.body.reference.deviceRequest !== ""){
				var activityReferenceDeviceRequest =  req.body.reference.deviceRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceDeviceRequest)){
					dataCarePlan.reference_device_request = "";
				}else{
					dataCarePlan.reference_device_request = activityReferenceDeviceRequest;
				}
			}else{
			  activityReferenceDeviceRequest = "";
			}

			if(typeof req.body.reference.medicationRequest !== 'undefined' && req.body.reference.medicationRequest !== ""){
				var activityReferenceMedicationRequest =  req.body.reference.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceMedicationRequest)){
					dataCarePlan.reference_medication_request = "";
				}else{
					dataCarePlan.reference_medication_request = activityReferenceMedicationRequest;
				}
			}else{
			  activityReferenceMedicationRequest = "";
			}

			if(typeof req.body.reference.nutritionOrder !== 'undefined' && req.body.reference.nutritionOrder !== ""){
				var activityReferenceNutritionOrder =  req.body.reference.nutritionOrder.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceNutritionOrder)){
					dataCarePlan.reference_nutrition_order = "";
				}else{
					dataCarePlan.reference_nutrition_order = activityReferenceNutritionOrder;
				}
			}else{
			  activityReferenceNutritionOrder = "";
			}

			if(typeof req.body.reference.task !== 'undefined' && req.body.reference.task !== ""){
				var activityReferenceTask =  req.body.reference.task.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceTask)){
					dataCarePlan.reference_task = "";
				}else{
					dataCarePlan.reference_task = activityReferenceTask;
				}
			}else{
			  activityReferenceTask = "";
			}

			if(typeof req.body.reference.procedureRequest !== 'undefined' && req.body.reference.procedureRequest !== ""){
				var activityReferenceProcedureRequest =  req.body.reference.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceProcedureRequest)){
					dataCarePlan.reference_procedure_request = "";
				}else{
					dataCarePlan.reference_procedure_request = activityReferenceProcedureRequest;
				}
			}else{
			  activityReferenceProcedureRequest = "";
			}

			if(typeof req.body.reference.referralRequest !== 'undefined' && req.body.reference.referralRequest !== ""){
				var activityReferenceReferralRequest =  req.body.reference.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceReferralRequest)){
					dataCarePlan.reference_referral_request = "";
				}else{
					dataCarePlan.reference_referral_request = activityReferenceReferralRequest;
				}
			}else{
			  activityReferenceReferralRequest = "";
			}

			if(typeof req.body.reference.visionPrescription !== 'undefined' && req.body.reference.visionPrescription !== ""){
				var activityReferenceVisionPrescription =  req.body.reference.visionPrescription.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceVisionPrescription)){
					dataCarePlan.reference_vision_prescription = "";
				}else{
					dataCarePlan.reference_vision_prescription = activityReferenceVisionPrescription;
				}
			}else{
			  activityReferenceVisionPrescription = "";
			}

			if(typeof req.body.reference.requestGroup !== 'undefined' && req.body.reference.requestGroup !== ""){
				var activityReferenceRequestGroup =  req.body.reference.requestGroup.trim().toLowerCase();
				if(validator.isEmpty(activityReferenceRequestGroup)){
					dataCarePlan.reference_request_group = "";
				}else{
					dataCarePlan.reference_request_group = activityReferenceRequestGroup;
				}
			}else{
			  activityReferenceRequestGroup = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkCarePlanID', function(){
							checkUniqeValue(apikey, "CAREPLAN_ID|" + carePlanId, 'CAREPLAN', function(resCarePlanId){
								if(resCarePlanId.err_code > 0){
									checkUniqeValue(apikey, "CAREPLAN_ACTIVITY_ID|" + carePlanActivityId, 'CAREPLAN_ACTIVITY', function(resCarePlanActivityID){
										if(resCarePlanActivityID.err_code > 0){
											ApiFHIR.put('carePlanActivity', {"apikey": apikey, "_id": carePlanActivityId, "dr": "CAREPLAN_ACTIVITY_ID|"+carePlanId}, {body: dataCarePlan, json: true}, function(error, response, body){
												carePlanActivity = body;
												if(carePlanActivity.err_code > 0){
													res.json(carePlanActivity);	
												}else{
													res.json({"err_code": 0, "err_msg": "Care Plan Activity has been update in this Care Plan.", "data": carePlanActivity.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Care Plan Activity Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Care Plan Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkActivityOutcomeCodeableConcept', function () {
							if (!validator.isEmpty(activityOutcomeCodeableConcept)) {
								checkCode(apikey, activityOutcomeCodeableConcept, 'CARE_PLAN_ACTIVITY_OUTCOME', function (resActivityOutcomeCodeableConceptCode) {
									if (resActivityOutcomeCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkCarePlanID');
									} else {
										res.json({
											"err_code": "524",
											"err_msg": "Activity Outcome Codeable Concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCarePlanID');
							}
						})
						
						myEmitter.prependOnceListener('checkActivityReferenceAppointment', function () {
							if (!validator.isEmpty(activityReferenceAppointment)) {
								checkUniqeValue(apikey, "APPOINTMENT_ID|" + activityReferenceAppointment, 'APPOINTMENT', function (resActivityReferenceAppointment) {
									if (resActivityReferenceAppointment.err_code > 0) {
										myEmitter.emit('checkActivityOutcomeCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference appointment id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityOutcomeCodeableConcept');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceCommunicationRequest', function () {
							if (!validator.isEmpty(activityReferenceCommunicationRequest)) {
								checkUniqeValue(apikey, "COMMUNICATION_REQUEST_ID|" + activityReferenceCommunicationRequest, 'COMMUNICATION_REQUEST', function (resActivityReferenceCommunicationRequest) {
									if (resActivityReferenceCommunicationRequest.err_code > 0) {
										myEmitter.emit('checkActivityReferenceAppointment');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference communication request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceAppointment');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceDeviceRequest', function () {
							if (!validator.isEmpty(activityReferenceDeviceRequest)) {
								checkUniqeValue(apikey, "DEVICE_REQUEST_ID|" + activityReferenceDeviceRequest, 'DEVICE_REQUEST', function (resActivityReferenceDeviceRequest) {
									if (resActivityReferenceDeviceRequest.err_code > 0) {
										myEmitter.emit('checkActivityReferenceCommunicationRequest');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference device request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceCommunicationRequest');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceMedicationRequest', function () {
							if (!validator.isEmpty(activityReferenceMedicationRequest)) {
								checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + activityReferenceMedicationRequest, 'MEDICATION_REQUEST', function (resActivityReferenceMedicationRequest) {
									if (resActivityReferenceMedicationRequest.err_code > 0) {
										myEmitter.emit('checkActivityReferenceDeviceRequest');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference medication request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceDeviceRequest');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceNutritionOrder', function () {
							if (!validator.isEmpty(activityReferenceNutritionOrder)) {
								checkUniqeValue(apikey, "NUTRITION_ORDER_ID|" + activityReferenceNutritionOrder, 'NUTRITION_ORDER', function (resActivityReferenceNutritionOrder) {
									if (resActivityReferenceNutritionOrder.err_code > 0) {
										myEmitter.emit('checkActivityReferenceMedicationRequest');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference nutrition order id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceMedicationRequest');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceTask', function () {
							if (!validator.isEmpty(activityReferenceTask)) {
								checkUniqeValue(apikey, "TASK_ID|" + activityReferenceTask, 'TASK', function (resActivityReferenceTask) {
									if (resActivityReferenceTask.err_code > 0) {
										myEmitter.emit('checkActivityReferenceNutritionOrder');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference task id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceNutritionOrder');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceProcedureRequest', function () {
							if (!validator.isEmpty(activityReferenceProcedureRequest)) {
								checkUniqeValue(apikey, "PROCEDURE_REQUEST_ID|" + activityReferenceProcedureRequest, 'PROCEDURE_REQUEST', function (resActivityReferenceProcedureRequest) {
									if (resActivityReferenceProcedureRequest.err_code > 0) {
										myEmitter.emit('checkActivityReferenceTask');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference procedure request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceTask');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceReferralRequest', function () {
							if (!validator.isEmpty(activityReferenceReferralRequest)) {
								checkUniqeValue(apikey, "REFERRAL_REQUEST_ID|" + activityReferenceReferralRequest, 'REFERRAL_REQUEST', function (resActivityReferenceReferralRequest) {
									if (resActivityReferenceReferralRequest.err_code > 0) {
										myEmitter.emit('checkActivityReferenceProcedureRequest');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference referral request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceProcedureRequest');
							}
						})

						myEmitter.prependOnceListener('checkActivityReferenceVisionPrescription', function () {
							if (!validator.isEmpty(activityReferenceVisionPrescription)) {
								checkUniqeValue(apikey, "VISION_PRESCRIPTION_ID|" + activityReferenceVisionPrescription, 'VISION_PRESCRIPTION', function (resActivityReferenceVisionPrescription) {
									if (resActivityReferenceVisionPrescription.err_code > 0) {
										myEmitter.emit('checkActivityReferenceReferralRequest');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity reference vision prescription id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceReferralRequest');
							}
						})

						if (!validator.isEmpty(activityReferenceRequestGroup)) {
							checkUniqeValue(apikey, "REQUEST_GROUP_ID|" + activityReferenceRequestGroup, 'REQUEST_GROUP', function (resActivityReferenceRequestGroup) {
								if (resActivityReferenceRequestGroup.err_code > 0) {
									myEmitter.emit('checkActivityReferenceVisionPrescription');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Activity reference request group id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkActivityReferenceVisionPrescription');
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
		carePlanActivityDetail: function updateCarePlanActivityDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var carePlanActivityId = req.params.care_plan_activity_id;
			var carePlanActivityDetailId = req.params.care_plan_activity_detail_id;

			var err_code = 0;
			var err_msg = "";
			var dataCarePlan = {};
			//input check 
			if(typeof carePlanActivityId !== 'undefined'){
				if(validator.isEmpty(carePlanActivityId)){
					err_code = 2;
					err_msg = "Care Plan Activity id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Plan Activity id is required";
			}

			if(typeof carePlanActivityDetailId !== 'undefined'){
				if(validator.isEmpty(carePlanActivityDetailId)){
					err_code = 2;
					err_msg = "Care Plan Activity Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Plan Activity Detail id is required";
			}
			
			/*
			var category  = req.body.category;
			var definition_plan_definition  = req.body.definition_plan_definition;
			var definition_activity_definition  = req.body.definition_activity_definition;
			var definition_questionnaire  = req.body.definition_questionnaire;
			var code  = req.body.code;
			var reason_code  = req.body.reason_code;
			var status  = req.body.status;
			var status_reason  = req.body.status_reason;
			var prohibited  = req.body.prohibited;
			var scheduled_timing  = req.body.scheduled_timing;
			var scheduled_period_start  = req.body.scheduled_period_start;
			var scheduled_period_end  = req.body.scheduled_period_end;
			var scheduled_string  = req.body.scheduled_string;
			var location  = req.body.location;
			var product_codeable_concept  = req.body.product_codeable_concept;
			var product_reference_medication  = req.body.product_reference_medication;
			var product_reference_substance  = req.body.product_reference_substance;
			var daily_amount  = req.body.daily_amount;
			var quantity  = req.body.quantity;
			var description  = req.body.description;
			*/
			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var activityDetailCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(activityDetailCategory)){
					dataCarePlan.category = "";
				}else{
					dataCarePlan.category = activityDetailCategory;
				}
			}else{
			  activityDetailCategory = "";
			}

			if(typeof req.body.definition.planDefinition !== 'undefined' && req.body.definition.planDefinition !== ""){
				var activityDetailDefinitionPlanDefinition =  req.body.definition.planDefinition.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDefinitionPlanDefinition)){
					dataCarePlan.definition_plan_definition = "";
				}else{
					dataCarePlan.definition_plan_definition = activityDetailDefinitionPlanDefinition;
				}
			}else{
			  activityDetailDefinitionPlanDefinition = "";
			}

			if(typeof req.body.definition.activityDefinition !== 'undefined' && req.body.definition.activityDefinition !== ""){
				var activityDetailDefinitionActivityDefinition =  req.body.definition.activityDefinition.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDefinitionActivityDefinition)){
					dataCarePlan.definition_activity_definition = "";
				}else{
					dataCarePlan.definition_activity_definition = activityDetailDefinitionActivityDefinition;
				}
			}else{
			  activityDetailDefinitionActivityDefinition = "";
			}

			if(typeof req.body.definition.questionnaire !== 'undefined' && req.body.definition.questionnaire !== ""){
				var activityDetailDefinitionQuestionnaire =  req.body.definition.questionnaire.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDefinitionQuestionnaire)){
					dataCarePlan.definition_questionnaire = "";
				}else{
					dataCarePlan.definition_questionnaire = activityDetailDefinitionQuestionnaire;
				}
			}else{
			  activityDetailDefinitionQuestionnaire = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var activityDetailCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(activityDetailCode)){
					dataCarePlan.code = "";
				}else{
					dataCarePlan.code = activityDetailCode;
				}
			}else{
			  activityDetailCode = "";
			}

			if(typeof req.body.reasonCode !== 'undefined' && req.body.reasonCode !== ""){
				var activityDetailReasonCode =  req.body.reasonCode.trim().toLowerCase();
				if(validator.isEmpty(activityDetailReasonCode)){
					dataCarePlan.reason_code = "";
				}else{
					dataCarePlan.reason_code = activityDetailReasonCode;
				}
			}else{
			  activityDetailReasonCode = "";
			}

			/*ref domain condition
			if(typeof req.body.reasonReference !== 'undefined' && req.body.reasonReference !== ""){
				var activityDetailReasonReference =  req.body.reasonReference.trim().toLowerCase();
				if(validator.isEmpty(activityDetailReasonReference)){
					dataCarePlan.reason_reference = "";
				}else{
					dataCarePlan.reason_reference = activityDetailReasonReference;
				}
			}else{
			  activityDetailReasonReference = "";
			}*/

			/* ref domain goal
			if(typeof req.body.goal !== 'undefined' && req.body.goal !== ""){
				var activityDetailGoal =  req.body.goal.trim().toLowerCase();
				if(validator.isEmpty(activityDetailGoal)){
					dataCarePlan.goal = "";
				}else{
					dataCarePlan.goal = activityDetailGoal;
				}
			}else{
			  activityDetailGoal = "";
			}*/

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var activityDetailStatus =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(activityDetailStatus)){
					err_code = 2;
					err_msg = "care plan activity detail status is required.";
				}else{
					dataCarePlan.status = activityDetailStatus;
				}
			}else{
			  activityDetailStatus = "";
			}

			if(typeof req.body.statusReason !== 'undefined' && req.body.statusReason !== ""){
				var activityDetailStatusReason =  req.body.statusReason.trim().toLowerCase();
				if(validator.isEmpty(activityDetailStatusReason)){
					dataCarePlan.status_reason = "";
				}else{
					dataCarePlan.status_reason = activityDetailStatusReason;
				}
			}else{
			  activityDetailStatusReason = "";
			}

			if (typeof req.body.prohibited !== 'undefined' && req.body.prohibited !== "") {
			  var activityDetailProhibited = req.body.prohibited.trim().toLowerCase();
					if(validator.isEmpty(activityDetailProhibited)){
						activityDetailProhibited = "false";
					}
			  if(activityDetailProhibited === "true" || activityDetailProhibited === "false"){
					dataCarePlan.prohibited = activityDetailProhibited;
			  } else {
			    err_code = 2;
			    err_msg = "Care plan activity detail prohibited is must be boolean.";
			  }
			} else {
			  activityDetailProhibited = "";
			}

			if(typeof req.body.scheduled.scheduledTiming !== 'undefined' && req.body.scheduled.scheduledTiming !== ""){
				var activityDetailScheduledScheduledTiming =  req.body.scheduled.scheduledTiming.trim().toLowerCase();
				if(validator.isEmpty(activityDetailScheduledScheduledTiming)){
					dataCarePlan.scheduled_timing = "";
				}else{
					dataCarePlan.scheduled_timing = activityDetailScheduledScheduledTiming;
				}
			}else{
			  activityDetailScheduledScheduledTiming = "";
			}

			if (typeof req.body.scheduled.scheduledPeriod !== 'undefined' && req.body.scheduled.scheduledPeriod !== "") {
			  var activityDetailScheduledScheduledPeriod = req.body.scheduled.scheduledPeriod;
			  if (activityDetailScheduledScheduledPeriod.indexOf("to") > 0) {
			    arrActivityDetailScheduledScheduledPeriod = activityDetailScheduledScheduledPeriod.split("to");
			    dataCarePlan.scheduled_period_start = arrActivityDetailScheduledScheduledPeriod[0];
			    dataCarePlan.scheduled_period_end = arrActivityDetailScheduledScheduledPeriod[1];
			    if (!regex.test(activityDetailScheduledScheduledPeriodStart) && !regex.test(activityDetailScheduledScheduledPeriodEnd)) {
			      err_code = 2;
			      err_msg = "care plan activity detail scheduled scheduled period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "care plan activity detail scheduled scheduled period invalid date format.";
				}
			} else {
			  activityDetailScheduledScheduledPeriod = "";
			}

			if(typeof req.body.scheduled.scheduledString !== 'undefined' && req.body.scheduled.scheduledString !== ""){
				var activityDetailScheduledScheduledString =  req.body.scheduled.scheduledString.trim().toLowerCase();
				if(validator.isEmpty(activityDetailScheduledScheduledString)){
					dataCarePlan.scheduled_string = "";
				}else{
					dataCarePlan.scheduled_string = activityDetailScheduledScheduledString;
				}
			}else{
			  activityDetailScheduledScheduledString = "";
			}

			if(typeof req.body.location !== 'undefined' && req.body.location !== ""){
				var activityDetailLocation =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(activityDetailLocation)){
					dataCarePlan.location = "";
				}else{
					dataCarePlan.location = activityDetailLocation;
				}
			}else{
			  activityDetailLocation = "";
			}

			/*if(typeof req.body.performer.practitioner !== 'undefined' && req.body.performer.practitioner !== ""){
				var activityDetailPerformerPractitioner =  req.body.performer.practitioner.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerPractitioner)){
					dataCarePlan.practitioner = "";
				}else{
					dataCarePlan.practitioner = activityDetailPerformerPractitioner;
				}
			}else{
			  activityDetailPerformerPractitioner = "";
			}

			if(typeof req.body.performer.organization !== 'undefined' && req.body.performer.organization !== ""){
				var activityDetailPerformerOrganization =  req.body.performer.organization.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerOrganization)){
					dataCarePlan.organization = "";
				}else{
					dataCarePlan.organization = activityDetailPerformerOrganization;
				}
			}else{
			  activityDetailPerformerOrganization = "";
			}

			if(typeof req.body.performer.relatedPerson !== 'undefined' && req.body.performer.relatedPerson !== ""){
				var activityDetailPerformerRelatedPerson =  req.body.performer.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerRelatedPerson)){
					dataCarePlan.related_person = "";
				}else{
					dataCarePlan.related_person = activityDetailPerformerRelatedPerson;
				}
			}else{
			  activityDetailPerformerRelatedPerson = "";
			}

			if(typeof req.body.performer.patient !== 'undefined' && req.body.performer.patient !== ""){
				var activityDetailPerformerPatient =  req.body.performer.patient.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerPatient)){
					dataCarePlan.patient = "";
				}else{
					dataCarePlan.patient = activityDetailPerformerPatient;
				}
			}else{
			  activityDetailPerformerPatient = "";
			}

			if(typeof req.body.performer.careTeam !== 'undefined' && req.body.performer.careTeam !== ""){
				var activityDetailPerformerCareTeam =  req.body.performer.careTeam.trim().toLowerCase();
				if(validator.isEmpty(activityDetailPerformerCareTeam)){
					dataCarePlan.care_team = "";
				}else{
					dataCarePlan.care_team = activityDetailPerformerCareTeam;
				}
			}else{
			  activityDetailPerformerCareTeam = "";
			}*/

			if(typeof req.body.product.productCodeableConcept !== 'undefined' && req.body.product.productCodeableConcept !== ""){
				var activityDetailProductProductCodeableConcept =  req.body.product.productCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(activityDetailProductProductCodeableConcept)){
					dataCarePlan.product_codeable_concept = "";
				}else{
					dataCarePlan.product_codeable_concept = activityDetailProductProductCodeableConcept;
				}
			}else{
			  activityDetailProductProductCodeableConcept = "";
			}

			if(typeof req.body.product.productReference.medication !== 'undefined' && req.body.product.productReference.medication !== ""){
				var activityDetailProductProductReferenceMedication =  req.body.product.productReference.medication.trim().toLowerCase();
				if(validator.isEmpty(activityDetailProductProductReferenceMedication)){
					dataCarePlan.product_reference_medication = "";
				}else{
					dataCarePlan.product_reference_medication = activityDetailProductProductReferenceMedication;
				}
			}else{
			  activityDetailProductProductReferenceMedication = "";
			}

			if(typeof req.body.product.productReference.substance !== 'undefined' && req.body.product.productReference.substance !== ""){
				var activityDetailProductProductReferenceSubstance =  req.body.product.productReference.substance.trim().toLowerCase();
				if(validator.isEmpty(activityDetailProductProductReferenceSubstance)){
					dataCarePlan.product_reference_substance = "";
				}else{
					dataCarePlan.product_reference_substance = activityDetailProductProductReferenceSubstance;
				}
			}else{
			  activityDetailProductProductReferenceSubstance = "";
			}

			if(typeof req.body.dailyAmount !== 'undefined' && req.body.dailyAmount !== ""){
				var activityDetailDailyAmount =  req.body.dailyAmount.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDailyAmount)){
					dataCarePlan.daily_amount = "";
				}else{
					dataCarePlan.daily_amount = activityDetailDailyAmount;
				}
			}else{
			  activityDetailDailyAmount = "";
			}

			if(typeof req.body.quantity !== 'undefined' && req.body.quantity !== ""){
				var activityDetailQuantity =  req.body.quantity.trim().toLowerCase();
				if(validator.isEmpty(activityDetailQuantity)){
					dataCarePlan.quantity = "";
				}else{
					dataCarePlan.quantity = activityDetailQuantity;
				}
			}else{
			  activityDetailQuantity = "";
			}

			if(typeof req.body.description !== 'undefined' && req.body.description !== ""){
				var activityDetailDescription =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(activityDetailDescription)){
					dataCarePlan.description = "";
				}else{
					dataCarePlan.description = activityDetailDescription;
				}
			}else{
			  activityDetailDescription = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkCarePlanActivityID', function(){
							checkUniqeValue(apikey, "CAREPLAN_ACTIVITY_ID|" + carePlanActivityId, 'CAREPLAN_ACTIVITY', function(resCarePlanId){
								if(resCarePlanId.err_code > 0){
									checkUniqeValue(apikey, "ACTIVITY_DETAIL_ID|" + carePlanActivityDetailId, 'CAREPLAN_ACTIVITY_DETAIL', function(resCarePlanActivityDetailID){
										if(resCarePlanActivityDetailID.err_code > 0){
											ApiFHIR.put('carePlanActivityDetail', {"apikey": apikey, "_id": carePlanActivityDetailId, "dr": "ACTIVITY_ID|"+carePlanActivityId}, {body: dataCarePlan, json: true}, function(error, response, body){
												carePlanActivityDetail = body;
												if(carePlanActivityDetail.err_code > 0){
													res.json(carePlanActivityDetail);	
												}else{
													res.json({"err_code": 0, "err_msg": "Care Plan Activity Detail has been update in this Care Plan.", "data": carePlanActivityDetail.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Care Plan Activity Detail Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Care Plan Activity Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkActivityDetailCategory', function () {
							if (!validator.isEmpty(activityDetailCategory)) {
								checkCode(apikey, activityDetailCategory, 'CARE_PLAN_ACTIVITY_CATEGORY', function (resActivityDetailCategoryCode) {
									if (resActivityDetailCategoryCode.err_code > 0) {
										myEmitter.emit('checkCarePlanActivityID');
									} else {
										res.json({
											"err_code": "523",
											"err_msg": "ActivityDetailCategory code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCarePlanActivityID');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailCode', function () {
							if (!validator.isEmpty(activityDetailCode)) {
								checkCode(apikey, activityDetailCode, 'CARE_PLAN_ACTIVITY', function (resActivityDetailCodeCode) {
									if (resActivityDetailCodeCode.err_code > 0) {
										myEmitter.emit('checkActivityDetailCategory');
									} else {
										res.json({
											"err_code": "522",
											"err_msg": "ActivityDetailCode code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailCategory');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailReasonCode', function () {
							if (!validator.isEmpty(activityDetailReasonCode)) {
								checkCode(apikey, activityDetailReasonCode, 'ACTIVITY_REASON', function (resActivityDetailReasonCodeCode) {
									if (resActivityDetailReasonCodeCode.err_code > 0) {
										myEmitter.emit('checkActivityDetailCode');
									} else {
										res.json({
											"err_code": "521",
											"err_msg": "ActivityDetailReasonCode code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailCode');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailStatus', function () {
							if (!validator.isEmpty(activityDetailStatus)) {
								checkCode(apikey, activityDetailStatus, 'CARE_PLAN_ACTIVITY_STATUS', function (resActivityDetailStatusCode) {
									if (resActivityDetailStatusCode.err_code > 0) {
										myEmitter.emit('checkActivityDetailReasonCode');
									} else {
										res.json({
											"err_code": "521",
											"err_msg": "ActivityDetailStatus code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailReasonCode');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailProductProductCodeableConcept', function () {
							if (!validator.isEmpty(activityDetailProductProductCodeableConcept)) {
								checkCode(apikey, activityDetailProductProductCodeableConcept, 'MEDICATION_CODES', function (resActivityDetailProductCodeableConceptCode) {
									if (resActivityDetailProductCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkActivityDetailStatus');
									} else {
										res.json({
											"err_code": "521",
											"err_msg": "ActivityDetailProductCodeableConcept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailStatus');
							}
						})
						
						myEmitter.prependOnceListener('checkActivityDetailDefinitionPlanDefinition', function () {
							if (!validator.isEmpty(activityDetailDefinitionPlanDefinition)) {
								checkUniqeValue(apikey, "PLAN_DEFINITION_ID|" + activityDetailDefinitionPlanDefinition, 'PLAN_DEFINITION', function (resActivityDetailDefinitionPlanDefinition) {
									if (resActivityDetailDefinitionPlanDefinition.err_code > 0) {
										myEmitter.emit('checkActivityReferenceRequestGroup');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail definition plan definition id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityReferenceRequestGroup');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailDefinitionActivityDefinition', function () {
							if (!validator.isEmpty(activityDetailDefinitionActivityDefinition)) {
								checkUniqeValue(apikey, "ACTIVITY_DEFINITION_ID|" + activityDetailDefinitionActivityDefinition, 'ACTIVITY_DEFINITION', function (resActivityDetailDefinitionActivityDefinition) {
									if (resActivityDetailDefinitionActivityDefinition.err_code > 0) {
										myEmitter.emit('checkActivityDetailDefinitionPlanDefinition');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail definition activity definition id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailDefinitionPlanDefinition');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailDefinitionQuestionnaire', function () {
							if (!validator.isEmpty(activityDetailDefinitionQuestionnaire)) {
								checkUniqeValue(apikey, "QUESTIONNAIRE_ID|" + activityDetailDefinitionQuestionnaire, 'QUESTIONNAIRE', function (resActivityDetailDefinitionQuestionnaire) {
									if (resActivityDetailDefinitionQuestionnaire.err_code > 0) {
										myEmitter.emit('checkActivityDetailDefinitionActivityDefinition');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail definition questionnaire id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailDefinitionActivityDefinition');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailReasonReference', function () {
							if (!validator.isEmpty(activityDetailReasonReference)) {
								checkUniqeValue(apikey, "REASON_REFERENCE_ID|" + activityDetailReasonReference, 'REASON_REFERENCE', function (resActivityDetailReasonReference) {
									if (resActivityDetailReasonReference.err_code > 0) {
										myEmitter.emit('checkActivityDetailDefinitionQuestionnaire');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail reason reference id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailDefinitionQuestionnaire');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailGoal', function () {
							if (!validator.isEmpty(activityDetailGoal)) {
								checkUniqeValue(apikey, "GOAL_ID|" + activityDetailGoal, 'GOAL', function (resActivityDetailGoal) {
									if (resActivityDetailGoal.err_code > 0) {
										myEmitter.emit('checkActivityDetailReasonReference');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail goal id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailReasonReference');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailScheduledScheduledTiming', function () {
							if (!validator.isEmpty(activityDetailScheduledScheduledTiming)) {
								checkUniqeValue(apikey, "TIMING_ID|" + activityDetailScheduledScheduledTiming, 'TIMING', function (resActivityDetailScheduledScheduledTiming) {
									if (resActivityDetailScheduledScheduledTiming.err_code > 0) {
										myEmitter.emit('checkActivityDetailGoal');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail scheduled scheduled timing id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailGoal');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailLocation', function () {
							if (!validator.isEmpty(activityDetailLocation)) {
								checkUniqeValue(apikey, "LOCATION_ID|" + activityDetailLocation, 'LOCATION', function (resActivityDetailLocation) {
									if (resActivityDetailLocation.err_code > 0) {
										myEmitter.emit('checkActivityDetailScheduledScheduledTiming');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail location id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailScheduledScheduledTiming');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailPerformerPractitioner', function () {
							if (!validator.isEmpty(activityDetailPerformerPractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + activityDetailPerformerPractitioner, 'PRACTITIONER', function (resActivityDetailPerformerPractitioner) {
									if (resActivityDetailPerformerPractitioner.err_code > 0) {
										myEmitter.emit('checkActivityDetailLocation');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail performer practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailLocation');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailPerformerOrganization', function () {
							if (!validator.isEmpty(activityDetailPerformerOrganization)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + activityDetailPerformerOrganization, 'ORGANIZATION', function (resActivityDetailPerformerOrganization) {
									if (resActivityDetailPerformerOrganization.err_code > 0) {
										myEmitter.emit('checkActivityDetailPerformerPractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail performer organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailPerformerPractitioner');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailPerformerRelatedPerson', function () {
							if (!validator.isEmpty(activityDetailPerformerRelatedPerson)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + activityDetailPerformerRelatedPerson, 'RELATED_PERSON', function (resActivityDetailPerformerRelatedPerson) {
									if (resActivityDetailPerformerRelatedPerson.err_code > 0) {
										myEmitter.emit('checkActivityDetailPerformerOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail performer related person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailPerformerOrganization');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailPerformerPatient', function () {
							if (!validator.isEmpty(activityDetailPerformerPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + activityDetailPerformerPatient, 'PATIENT', function (resActivityDetailPerformerPatient) {
									if (resActivityDetailPerformerPatient.err_code > 0) {
										myEmitter.emit('checkActivityDetailPerformerRelatedPerson');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail performer patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailPerformerRelatedPerson');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailPerformerCareTeam', function () {
							if (!validator.isEmpty(activityDetailPerformerCareTeam)) {
								checkUniqeValue(apikey, "CARE_TEAM_ID|" + activityDetailPerformerCareTeam, 'CARE_TEAM', function (resActivityDetailPerformerCareTeam) {
									if (resActivityDetailPerformerCareTeam.err_code > 0) {
										myEmitter.emit('checkActivityDetailPerformerPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail performer care team id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailPerformerPatient');
							}
						})

						myEmitter.prependOnceListener('checkActivityDetailProductProductReferenceMedication', function () {
							if (!validator.isEmpty(activityDetailProductProductReferenceMedication)) {
								checkUniqeValue(apikey, "MEDICATION_ID|" + activityDetailProductProductReferenceMedication, 'MEDICATION', function (resActivityDetailProductProductReferenceMedication) {
									if (resActivityDetailProductProductReferenceMedication.err_code > 0) {
										myEmitter.emit('checkActivityDetailPerformerCareTeam');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Activity detail product product reference medication id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkActivityDetailPerformerCareTeam');
							}
						})

						if (!validator.isEmpty(activityDetailProductProductReferenceSubstance)) {
							checkUniqeValue(apikey, "SUBSTANCE_ID|" + activityDetailProductProductReferenceSubstance, 'SUBSTANCE', function (resActivityDetailProductProductReferenceSubstance) {
								if (resActivityDetailProductProductReferenceSubstance.err_code > 0) {
									myEmitter.emit('checkActivityDetailProductProductReferenceMedication');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Activity detail product product reference substance id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkActivityDetailProductProductReferenceMedication');
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
		carePlanNote: function updateCarePlanNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var carePlanId = req.params.care_plan_id;
			var carePlanNoteId = req.params.care_plan_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataCarePlan = {};
			//input check 
			if(typeof carePlanId !== 'undefined'){
				if(validator.isEmpty(carePlanId)){
					err_code = 2;
					err_msg = "Care Plan id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Plan id is required";
			}

			if(typeof carePlanNoteId !== 'undefined'){
				if(validator.isEmpty(carePlanNoteId)){
					err_code = 2;
					err_msg = "Care Plan Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Plan Note id is required";
			}
			
			/*
			"id": carePlanNoteId,
			"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
			"author_ref_patient": noteAuthorAuthorReferencePatient,
			"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
			"author_string": noteAuthorAuthorString,
			"time": noteTime,
			"text": noteText,
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
					err_msg = "Care Plan note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Care Plan note time invalid date format.";	
					}else{
						dataSequence.time = noteTime;
					}
				}
			}else{
			  noteTime = "";
			}

			if(typeof req.body.text !== 'undefined' && req.body.text !== ""){
				var noteText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					dataSequence.text = "";
				}else{
					dataSequence.text = noteText;
				}
			}else{
			  noteText = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkCarePlanID', function(){
							checkUniqeValue(apikey, "careplan_id|" + carePlanId, 'careplan', function(resCarePlanId){
								if(resCarePlanId.err_code > 0){
									checkUniqeValue(apikey, "NOTE_ID|" + carePlanNoteId, 'NOTE', function(resCarePlanNoteID){
										if(resCarePlanNoteID.err_code > 0){
											ApiFHIR.put('annotation', {"apikey": apikey, "_id": carePlanNoteId, "dr": "care_plan_id|"+carePlanId}, {body: dataCarePlan, json: true}, function(error, response, body){
												carePlanNote = body;
												if(carePlanNote.err_code > 0){
													res.json(carePlanNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Care Plan Note has been update in this Care Plan.", "data": carePlanNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Care Plan Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Care Plan Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkCarePlanID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCarePlanID');
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
		carePlanActivityNote: function updateCarePlanActivityNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var carePlanActivityId = req.params.care_plan_activity_id;
			var carePlanActivityNoteId = req.params.care_plan_activity_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataCarePlanActivity = {};
			//input check 
			if(typeof carePlanActivityId !== 'undefined'){
				if(validator.isEmpty(carePlanActivityId)){
					err_code = 2;
					err_msg = "Care Plan Activity id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Plan Activity id is required";
			}

			if(typeof carePlanActivityNoteId !== 'undefined'){
				if(validator.isEmpty(carePlanActivityNoteId)){
					err_code = 2;
					err_msg = "Care Plan Activity Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Plan Activity Note id is required";
			}
			
			/*
			"id": carePlanActivityNoteId,
			"author_ref_practitioner": noteAuthorAuthorReferencePractitioner,
			"author_ref_patient": noteAuthorAuthorReferencePatient,
			"author_ref_relatedPerson": noteAuthorAuthorReferenceRelatedPerson,
			"author_string": noteAuthorAuthorString,
			"time": noteTime,
			"text": noteText,
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
					err_msg = "Care Plan note time is required.";
				}else{
					if(!regex.test(noteTime)){
						err_code = 2;
						err_msg = "Care Plan note time invalid date format.";	
					}else{
						dataSequence.time = noteTime;
					}
				}
			}else{
			  noteTime = "";
			}

			if(typeof req.body.text !== 'undefined' && req.body.text !== ""){
				var noteText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(noteText)){
					dataSequence.text = "";
				}else{
					dataSequence.text = noteText;
				}
			}else{
			  noteText = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkCarePlanActivityID', function(){
							checkUniqeValue(apikey, "careplan_activity_id|" + carePlanActivityId, 'CAREPLAN_ACTIVITY', function(resCarePlanActivityId){
								if(resCarePlanActivityId.err_code > 0){
									checkUniqeValue(apikey, "NOTE_ID|" + carePlanActivityNoteId, 'NOTE', function(resCarePlanActivityNoteID){
										if(resCarePlanActivityNoteID.err_code > 0){
											ApiFHIR.put('annotation', {"apikey": apikey, "_id": carePlanActivityNoteId, "dr": "care_plan_activity_id|"+carePlanActivityId}, {body: dataCarePlanActivity, json: true}, function(error, response, body){
												carePlanActivityNote = body;
												if(carePlanActivityNote.err_code > 0){
													res.json(carePlanActivityNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Care Plan Activity Note has been update in this Care Plan Activity.", "data": carePlanActivityNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Care Plan Activity Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Care Plan Activity Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkNoteAuthorAuthorReferencePractitioner', function () {
							if (!validator.isEmpty(noteAuthorAuthorReferencePractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + noteAuthorAuthorReferencePractitioner, 'PRACTITIONER', function (resNoteAuthorAuthorReferencePractitioner) {
									if (resNoteAuthorAuthorReferencePractitioner.err_code > 0) {
										myEmitter.emit('checkCarePlanActivityID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Note author author reference practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCarePlanActivityID');
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
		carePlanActivityTiming: function updateProcedureRequestTiming(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var carePlanActivityId = req.params.care_plan_activity_id;
			var carePlanActivityTimingId = req.params.care_plan_activity_timing_id;

			var err_code = 0;
			var err_msg = "";
			var dataProcedureRequest = {};
			//input check 
			if(typeof carePlanActivityId !== 'undefined'){
				if(validator.isEmpty(carePlanActivityId)){
					err_code = 2;
					err_msg = "Careplan Activity id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Careplan Activity id is required";
			}

			if(typeof carePlanActivityTimingId !== 'undefined'){
				if(validator.isEmpty(carePlanActivityTimingId)){
					err_code = 2;
					err_msg = "Careplan Activity Timing id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Careplan Activity Timing id is required";
			}
			
			if(typeof req.body.event !== 'undefined' && req.body.event !== ""){
				var occurrenceOccurrenceTimingEvent =  req.body.event;
				if(validator.isEmpty(occurrenceOccurrenceTimingEvent)){
					err_code = 2;
					err_msg = "procedure request occurrence occurrence timing event is required.";
				}else{
					if(!regex.test(occurrenceOccurrenceTimingEvent)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing event invalid date format.";	
					}else{
						dataProcedureRequest.event = occurrenceOccurrenceTimingEvent;
					}
				}
			}else{
			  occurrenceOccurrenceTimingEvent = "";
			}

			if(typeof req.body.repeat.bounds.boundsDuration !== 'undefined' && req.body.repeat.bounds.boundsDuration !== ""){
				var occurrenceOccurrenceTimingRepeatBoundsBoundsDuration =  req.body.repeat.bounds.boundsDuration.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatBoundsBoundsDuration)){
					dataProcedureRequest.bounds_duration = "";
				}else{
					dataProcedureRequest.bounds_duration = occurrenceOccurrenceTimingRepeatBoundsBoundsDuration;
				}
			}else{
			  occurrenceOccurrenceTimingRepeatBoundsBoundsDuration = "";
			}

			if (typeof req.body.repeat.bounds.boundsRange !== 'undefined' && req.body.repeat.bounds.boundsRange !== "") {
			  var occurrenceOccurrenceTimingRepeatBoundsBoundsRange = req.body.repeat.bounds.boundsRange;
			  if (occurrenceOccurrenceTimingRepeatBoundsBoundsRange.indexOf("to") > 0) {
			    arrOccurrenceOccurrenceTimingRepeatBoundsBoundsRange = occurrenceOccurrenceTimingRepeatBoundsBoundsRange.split("to");
			    dataProcedureRequest.bounds_range_low = arrOccurrenceOccurrenceTimingRepeatBoundsBoundsRange[0];
			    dataProcedureRequest.bounds_range_high = arrOccurrenceOccurrenceTimingRepeatBoundsBoundsRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "procedure request occurrence occurrence timing repeat bounds bounds range invalid range format.";
				}
			} else {
			  occurrenceOccurrenceTimingRepeatBoundsBoundsRange = "";
			}

			if (typeof req.body.repeat.bounds.boundsPeriod !== 'undefined' && req.body.repeat.bounds.boundsPeriod !== "") {
			  var occurrenceOccurrenceTimingRepeatBoundsBoundsPeriod = req.body.repeat.bounds.boundsPeriod;
			  if (occurrenceOccurrenceTimingRepeatBoundsBoundsPeriod.indexOf("to") > 0) {
			    arrOccurrenceOccurrenceTimingRepeatBoundsBoundsPeriod = occurrenceOccurrenceTimingRepeatBoundsBoundsPeriod.split("to");
			    dataProcedureRequest.bounds_period_start = arrOccurrenceOccurrenceTimingRepeatBoundsBoundsPeriod[0];
			    dataProcedureRequest.bounds_period_end = arrOccurrenceOccurrenceTimingRepeatBoundsBoundsPeriod[1];
			    if (!regex.test(occurrenceOccurrenceTimingRepeatBoundsBoundsPeriodStart) && !regex.test(occurrenceOccurrenceTimingRepeatBoundsBoundsPeriodEnd)) {
			      err_code = 2;
			      err_msg = "procedure request occurrence occurrence timing repeat bounds bounds period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "procedure request occurrence occurrence timing repeat bounds bounds period invalid date format.";
				}
			} else {
			  occurrenceOccurrenceTimingRepeatBoundsBoundsPeriod = "";
			}

			if(typeof req.body.repeat.count !== 'undefined' && req.body.repeat.count !== ""){
				var occurrenceOccurrenceTimingRepeatCount =  req.body.repeat.count;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatCount)){
					dataProcedureRequest.count = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatCount)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat count is must be number.";
					}else{
						dataProcedureRequest.count = occurrenceOccurrenceTimingRepeatCount;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatCount = "";
			}

			if(typeof req.body.repeat.countMax !== 'undefined' && req.body.repeat.countMax !== ""){
				var occurrenceOccurrenceTimingRepeatCountMax =  req.body.repeat.countMax;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatCountMax)){
					dataProcedureRequest.count_max = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatCountMax)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat count max is must be number.";
					}else{
						dataProcedureRequest.count_max = occurrenceOccurrenceTimingRepeatCountMax;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatCountMax = "";
			}

			if(typeof req.body.repeat.duration !== 'undefined' && req.body.repeat.duration !== ""){
				var occurrenceOccurrenceTimingRepeatDuration =  req.body.repeat.duration;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatDuration)){
					dataProcedureRequest.duration = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatDuration)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat duration is must be number.";
					}else{
						dataProcedureRequest.duration = occurrenceOccurrenceTimingRepeatDuration;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatDuration = "";
			}

			if(typeof req.body.repeat.durationMax !== 'undefined' && req.body.repeat.durationMax !== ""){
				var occurrenceOccurrenceTimingRepeatDurationMax =  req.body.repeat.durationMax;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatDurationMax)){
					dataProcedureRequest.duration_max = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatDurationMax)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat duration max is must be number.";
					}else{
						dataProcedureRequest.duration_max = occurrenceOccurrenceTimingRepeatDurationMax;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatDurationMax = "";
			}

			if(typeof req.body.repeat.durationUnit !== 'undefined' && req.body.repeat.durationUnit !== ""){
				var occurrenceOccurrenceTimingRepeatDurationUnit =  req.body.repeat.durationUnit.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatDurationUnit)){
					dataProcedureRequest.duration_unit = "";
				}else{
					dataProcedureRequest.duration_unit = occurrenceOccurrenceTimingRepeatDurationUnit;
				}
			}else{
			  occurrenceOccurrenceTimingRepeatDurationUnit = "";
			}

			if(typeof req.body.repeat.frequency !== 'undefined' && req.body.repeat.frequency !== ""){
				var occurrenceOccurrenceTimingRepeatFrequency =  req.body.repeat.frequency;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatFrequency)){
					dataProcedureRequest.frequency = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatFrequency)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat frequency is must be number.";
					}else{
						dataProcedureRequest.frequency = occurrenceOccurrenceTimingRepeatFrequency;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatFrequency = "";
			}

			if(typeof req.body.repeat.frequencyMax !== 'undefined' && req.body.repeat.frequencyMax !== ""){
				var occurrenceOccurrenceTimingRepeatFrequencyMax =  req.body.repeat.frequencyMax;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatFrequencyMax)){
					dataProcedureRequest.frequency_max = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatFrequencyMax)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat frequency max is must be number.";
					}else{
						dataProcedureRequest.frequency_max = occurrenceOccurrenceTimingRepeatFrequencyMax;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatFrequencyMax = "";
			}

			if(typeof req.body.repeat.period !== 'undefined' && req.body.repeat.period !== ""){
				var occurrenceOccurrenceTimingRepeatPeriod =  req.body.repeat.period;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatPeriod)){
					dataProcedureRequest.period = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatPeriod)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat period is must be number.";
					}else{
						dataProcedureRequest.period = occurrenceOccurrenceTimingRepeatPeriod;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatPeriod = "";
			}

			if(typeof req.body.repeat.periodMax !== 'undefined' && req.body.repeat.periodMax !== ""){
				var occurrenceOccurrenceTimingRepeatPeriodMax =  req.body.repeat.periodMax;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatPeriodMax)){
					dataProcedureRequest.period_max = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatPeriodMax)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat period max is must be number.";
					}else{
						dataProcedureRequest.period_max = occurrenceOccurrenceTimingRepeatPeriodMax;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatPeriodMax = "";
			}

			if(typeof req.body.repeat.periodUnit !== 'undefined' && req.body.repeat.periodUnit !== ""){
				var occurrenceOccurrenceTimingRepeatPeriodUnit =  req.body.repeat.periodUnit.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatPeriodUnit)){
					dataProcedureRequest.period_unit = "";
				}else{
					dataProcedureRequest.period_unit = occurrenceOccurrenceTimingRepeatPeriodUnit;
				}
			}else{
			  occurrenceOccurrenceTimingRepeatPeriodUnit = "";
			}

			if(typeof req.body.repeat.dayOfWeek !== 'undefined' && req.body.repeat.dayOfWeek !== ""){
				var occurrenceOccurrenceTimingRepeatDayOfWeek =  req.body.repeat.dayOfWeek.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatDayOfWeek)){
					dataProcedureRequest.day_of_week = "";
				}else{
					dataProcedureRequest.day_of_week = occurrenceOccurrenceTimingRepeatDayOfWeek;
				}
			}else{
			  occurrenceOccurrenceTimingRepeatDayOfWeek = "";
			}

			if(typeof req.body.repeat.timeOfDay !== 'undefined' && req.body.repeat.timeOfDay !== ""){
				var occurrenceOccurrenceTimingRepeatTimeOfDay =  req.body.repeat.timeOfDay;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatTimeOfDay)){
					err_code = 2;
					err_msg = "procedure request occurrence occurrence timing repeat time of day is required.";
				}else{
					if(!regex.test(occurrenceOccurrenceTimingRepeatTimeOfDay)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat time of day invalid date format.";	
					}else{
						dataProcedureRequest.time_of_day = occurrenceOccurrenceTimingRepeatTimeOfDay;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatTimeOfDay = "";
			}

			if(typeof req.body.repeat.when !== 'undefined' && req.body.repeat.when !== ""){
				var occurrenceOccurrenceTimingRepeatWhen =  req.body.repeat.when.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatWhen)){
					dataProcedureRequest.when = "";
				}else{
					dataProcedureRequest.when = occurrenceOccurrenceTimingRepeatWhen;
				}
			}else{
			  occurrenceOccurrenceTimingRepeatWhen = "";
			}

			if(typeof req.body.repeat.offset !== 'undefined' && req.body.repeat.offset !== ""){
				var occurrenceOccurrenceTimingRepeatOffset =  req.body.repeat.offset;
				if(validator.isEmpty(occurrenceOccurrenceTimingRepeatOffset)){
					dataProcedureRequest.offset = "";
				}else{
					if(!validator.isInt(occurrenceOccurrenceTimingRepeatOffset)){
						err_code = 2;
						err_msg = "procedure request occurrence occurrence timing repeat offset is must be number.";
					}else{
						dataProcedureRequest.offset = occurrenceOccurrenceTimingRepeatOffset;
					}
				}
			}else{
			  occurrenceOccurrenceTimingRepeatOffset = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var occurrenceOccurrenceTimingCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(occurrenceOccurrenceTimingCode)){
					dataProcedureRequest.code = "";
				}else{
					dataProcedureRequest.code = occurrenceOccurrenceTimingCode;
				}
			}else{
			  occurrenceOccurrenceTimingCode = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkProcedureRequestID', function(){
							checkUniqeValue(apikey, "CAREPLAN_ACTIVITY_ID|" + carePlanActivityId, 'CAREPLAN_ACTIVITY', function(resObservationId){
								if(resObservationId.err_code > 0){
									checkUniqeValue(apikey, "TIMING_ID|" + carePlanActivityTimingId, 'TIMING', function(resProcedureRequestTimingID){
										if(resProcedureRequestTimingID.err_code > 0){
											ApiFHIR.put('timing', {"apikey": apikey, "_id": carePlanActivityTimingId, "dr": "CAREPLAN_ACTIVITY_ID|"+carePlanActivityId}, {body: dataProcedureRequest, json: true}, function(error, response, body){
												carePlanActivityTiming = body;
												if(carePlanActivityTiming.err_code > 0){
													res.json(carePlanActivityTiming);	
												}else{
													res.json({"err_code": 0, "err_msg": "Careplan Activity Timing has been update in this Careplan Activity.", "data": carePlanActivityTiming.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Careplan Activity Timing Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Careplan Activity Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkOccurrenceOccurrenceTimingRepeatDurationUnit', function () {
							if (!validator.isEmpty(occurrenceOccurrenceTimingRepeatDurationUnit)) {
								checkCode(apikey, occurrenceOccurrenceTimingRepeatDurationUnit, 'UNITS_OF_TIME', function (resOccurrenceOccurrenceTimingRepeatDurationUnitCode) {
									if (resOccurrenceOccurrenceTimingRepeatDurationUnitCode.err_code > 0) {
										myEmitter.emit('checkProcedureRequestID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Occurrence occurrence timing repeat duration unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkProcedureRequestID');
							}
						})

						myEmitter.prependOnceListener('checkOccurrenceOccurrenceTimingRepeatPeriodUnit', function () {
							if (!validator.isEmpty(occurrenceOccurrenceTimingRepeatPeriodUnit)) {
								checkCode(apikey, occurrenceOccurrenceTimingRepeatPeriodUnit, 'UNITS_OF_TIME', function (resOccurrenceOccurrenceTimingRepeatPeriodUnitCode) {
									if (resOccurrenceOccurrenceTimingRepeatPeriodUnitCode.err_code > 0) {
										myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatDurationUnit');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Occurrence occurrence timing repeat period unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatDurationUnit');
							}
						})

						myEmitter.prependOnceListener('checkOccurrenceOccurrenceTimingRepeatDayOfWeek', function () {
							if (!validator.isEmpty(occurrenceOccurrenceTimingRepeatDayOfWeek)) {
								checkCode(apikey, occurrenceOccurrenceTimingRepeatDayOfWeek, 'DAYS_OF_WEEK', function (resOccurrenceOccurrenceTimingRepeatDayOfWeekCode) {
									if (resOccurrenceOccurrenceTimingRepeatDayOfWeekCode.err_code > 0) {
										myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatPeriodUnit');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Occurrence occurrence timing repeat day of week code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatPeriodUnit');
							}
						})

						if (!validator.isEmpty(occurrenceOccurrenceTimingRepeatWhen)) {
							checkCode(apikey, occurrenceOccurrenceTimingRepeatWhen, 'EVENT_TIMING', function (resOccurrenceOccurrenceTimingRepeatWhenCode) {
								if (resOccurrenceOccurrenceTimingRepeatWhenCode.err_code > 0) {
									myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatDayOfWeek');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Occurrence occurrence timing repeat when code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkOccurrenceOccurrenceTimingRepeatDayOfWeek');
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