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
		observation : function getObservation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var observationId = req.query._id;
			var based_on = req.query.basedOn;
			var category = req.query.category;
			var code = req.query.code;
			var code_value_concept = req.query.codeValueConcept;
			var code_value_date = req.query.codeValueDate;
			var code_value_quantity = req.query.codeValueQuantity;
			var code_value_string = req.query.codeValueString;
			var combo_code = req.query.comboCode;
			var combo_code_value_concept = req.query.comboCodeValueConcept;
			var combo_code_value_quantity = req.query.comboCodeValueQuantity;
			var combo_data_absent_reason = req.query.comboDataAbsentReason;
			var combo_value_concept = req.query.comboValueConcept;
			var combo_value_quantity = req.query.comboValueQuantity;
			var component_code = req.query.componentCode;
			var component_code_value_concept = req.query.componentCodeValueConcept;
			var component_code_value_quantity = req.query.componentCodeValueQuantity;
			var component_data_absent_reason = req.query.componentDataAbsentReason;
			var component_value_concept = req.query.componentValueConcept;
			var component_value_quantity = req.query.componentValueQuantity;
			var context = req.query.context;
			var data_absent_reason = req.query.dataAbsentReason;
			var date = req.query.date;
			var device = req.query.device;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var method = req.query.method;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var related = req.query.related;
			var related_target = req.query.relatedTarget;
			var related_type = req.query.relatedType;
			var specimen = req.query.specimen;
			var status = req.query.status;
			var subject = req.query.subject;
			var value_concept = req.query.valueConcept;
			var value_date = req.query.valueDate;
			var value_quantity = req.query.valueQuantity;
			var value_string = req.query.valueString;
			
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
			
			if(typeof observationId !== 'undefined'){
				if(!validator.isEmpty(observationId)){
					qString._id = observationId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Observation Id is required."});
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

			if(typeof code_value_concept !== 'undefined'){
				if(!validator.isEmpty(code_value_concept)){
					qString.code_value_concept = code_value_concept; 
				}else{
					res.json({"err_code": 1, "err_msg": "Code value concept is empty."});
				}
			}

			if(typeof code_value_date !== 'undefined'){
				if(!validator.isEmpty(code_value_date)){
					if(!regex.test(code_value_date)){
						res.json({"err_code": 1, "err_msg": "Code value date invalid format."});
					}else{
						qString.code_value_date = code_value_date; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Code value date is empty."});
				}
			}

			if(typeof code_value_quantity !== 'undefined'){
				if(!validator.isEmpty(code_value_quantity)){
					qString.code_value_quantity = code_value_quantity; 
				}else{
					res.json({"err_code": 1, "err_msg": "Code value quantity is empty."});
				}
			}

			if(typeof code_value_string !== 'undefined'){
				if(!validator.isEmpty(code_value_string)){
					qString.code_value_string = code_value_string; 
				}else{
					res.json({"err_code": 1, "err_msg": "Code value string is empty."});
				}
			}

			if(typeof combo_code !== 'undefined'){
				if(!validator.isEmpty(combo_code)){
					qString.combo_code = combo_code; 
				}else{
					res.json({"err_code": 1, "err_msg": "Combo code is empty."});
				}
			}

			if(typeof combo_code_value_concept !== 'undefined'){
				if(!validator.isEmpty(combo_code_value_concept)){
					qString.combo_code_value_concept = combo_code_value_concept; 
				}else{
					res.json({"err_code": 1, "err_msg": "Combo code value concept is empty."});
				}
			}

			if(typeof combo_code_value_quantity !== 'undefined'){
				if(!validator.isEmpty(combo_code_value_quantity)){
					qString.combo_code_value_quantity = combo_code_value_quantity; 
				}else{
					res.json({"err_code": 1, "err_msg": "Combo code value quantity is empty."});
				}
			}

			if(typeof combo_data_absent_reason !== 'undefined'){
				if(!validator.isEmpty(combo_data_absent_reason)){
					qString.combo_data_absent_reason = combo_data_absent_reason; 
				}else{
					res.json({"err_code": 1, "err_msg": "Combo data absent reason is empty."});
				}
			}

			if(typeof combo_value_concept !== 'undefined'){
				if(!validator.isEmpty(combo_value_concept)){
					qString.combo_value_concept = combo_value_concept; 
				}else{
					res.json({"err_code": 1, "err_msg": "Combo value concept is empty."});
				}
			}

			if(typeof combo_value_quantity !== 'undefined'){
				if(!validator.isEmpty(combo_value_quantity)){
					qString.combo_value_quantity = combo_value_quantity; 
				}else{
					res.json({"err_code": 1, "err_msg": "Combo value quantity is empty."});
				}
			}

			if(typeof component_code !== 'undefined'){
				if(!validator.isEmpty(component_code)){
					qString.component_code = component_code; 
				}else{
					res.json({"err_code": 1, "err_msg": "Component code is empty."});
				}
			}

			if(typeof component_code_value_concept !== 'undefined'){
				if(!validator.isEmpty(component_code_value_concept)){
					qString.component_code_value_concept = component_code_value_concept; 
				}else{
					res.json({"err_code": 1, "err_msg": "Component code value concept is empty."});
				}
			}

			if(typeof component_code_value_quantity !== 'undefined'){
				if(!validator.isEmpty(component_code_value_quantity)){
					qString.component_code_value_quantity = component_code_value_quantity; 
				}else{
					res.json({"err_code": 1, "err_msg": "Component code value quantity is empty."});
				}
			}

			if(typeof component_data_absent_reason !== 'undefined'){
				if(!validator.isEmpty(component_data_absent_reason)){
					qString.component_data_absent_reason = component_data_absent_reason; 
				}else{
					res.json({"err_code": 1, "err_msg": "Component data absent reason is empty."});
				}
			}

			if(typeof component_value_concept !== 'undefined'){
				if(!validator.isEmpty(component_value_concept)){
					qString.component_value_concept = component_value_concept; 
				}else{
					res.json({"err_code": 1, "err_msg": "Component value concept is empty."});
				}
			}

			if(typeof component_value_quantity !== 'undefined'){
				if(!validator.isEmpty(component_value_quantity)){
					qString.component_value_quantity = component_value_quantity; 
				}else{
					res.json({"err_code": 1, "err_msg": "Component value quantity is empty."});
				}
			}

			if(typeof context !== 'undefined'){
				if(!validator.isEmpty(context)){
					qString.context = context; 
				}else{
					res.json({"err_code": 1, "err_msg": "Context is empty."});
				}
			}

			if(typeof data_absent_reason !== 'undefined'){
				if(!validator.isEmpty(data_absent_reason)){
					qString.data_absent_reason = data_absent_reason; 
				}else{
					res.json({"err_code": 1, "err_msg": "Data absent reason is empty."});
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

			if(typeof device !== 'undefined'){
				if(!validator.isEmpty(device)){
					qString.device = device; 
				}else{
					res.json({"err_code": 1, "err_msg": "Device is empty."});
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

			if(typeof method !== 'undefined'){
				if(!validator.isEmpty(method)){
					qString.method = method; 
				}else{
					res.json({"err_code": 1, "err_msg": "Method is empty."});
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

			if(typeof related !== 'undefined'){
				if(!validator.isEmpty(related)){
					qString.related = related; 
				}else{
					res.json({"err_code": 1, "err_msg": "Related is empty."});
				}
			}

			if(typeof related_target !== 'undefined'){
				if(!validator.isEmpty(related_target)){
					qString.related_target = related_target; 
				}else{
					res.json({"err_code": 1, "err_msg": "Related target is empty."});
				}
			}

			if(typeof related_type !== 'undefined'){
				if(!validator.isEmpty(related_type)){
					qString.related_type = related_type; 
				}else{
					res.json({"err_code": 1, "err_msg": "Related type is empty."});
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

			if(typeof value_concept !== 'undefined'){
				if(!validator.isEmpty(value_concept)){
					qString.value_concept = value_concept; 
				}else{
					res.json({"err_code": 1, "err_msg": "Value concept is empty."});
				}
			}

			if(typeof value_date !== 'undefined'){
				if(!validator.isEmpty(value_date)){
					if(!regex.test(value_date)){
						res.json({"err_code": 1, "err_msg": "Value date invalid format."});
					}else{
						qString.value_date = value_date; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Value date is empty."});
				}
			}

			if(typeof value_quantity !== 'undefined'){
				if(!validator.isEmpty(value_quantity)){
					qString.value_quantity = value_quantity; 
				}else{
					res.json({"err_code": 1, "err_msg": "Value quantity is empty."});
				}
			}

			if(typeof value_string !== 'undefined'){
				if(!validator.isEmpty(value_string)){
					qString.value_string = value_string; 
				}else{
					res.json({"err_code": 1, "err_msg": "Value string is empty."});
				}
			}

			seedPhoenixFHIR.path.GET = {
				"Observation" : {
					"location": "%(apikey)s/Observation",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('Observation', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var observation = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(observation.err_code == 0){
								//cek jumdata dulu
								if(observation.data.length > 0){
									newObservation = [];
									for(i=0; i < observation.data.length; i++){
										myEmitter.once("getIdentifier", function(observation, index, newObservation, countObservation){
											/*console.log(observation);*/
											//get identifier
											qString = {};
											qString.observation_id = observation.id;
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
													var objectObservation = {};
													objectObservation.resourceType = observation.resourceType;
													objectObservation.id = observation.id;
													objectObservation.identifier = identifier.data;
													objectObservation.status = observation.status;
													objectObservation.category = observation.category;
													objectObservation.code = observation.code;
													objectObservation.subject = observation.subject;
													objectObservation.context = observation.context;
													objectObservation.effective = observation.effective;
													objectObservation.issued = observation.issued;
													objectObservation.value = observation.value;
													objectObservation.dataAbsentReason = observation.dataAbsentReason;
													objectObservation.interpretation = observation.interpretation;
													objectObservation.comment = observation.comment;
													objectObservation.bodySite = observation.bodySite;
													objectObservation.method = observation.method;
													objectObservation.specimen = observation.specimen;
													objectObservation.device = observation.device;
												
													newObservation[index] = objectObservation;

													myEmitter.once('getObservationRelated', function(observation, index, newObservation, countObservation){
														qString = {};
														qString.observation_id = observation.id;
														seedPhoenixFHIR.path.GET = {
															"ObservationRelated" : {
																"location": "%(apikey)s/ObservationRelated",
																"query": qString
															}
														}

														var ApiFHIR = new Apiclient(seedPhoenixFHIR);

														ApiFHIR.get('ObservationRelated', {"apikey": apikey}, {}, function(error, response, body){
															observationRelated = JSON.parse(body);
															if(observationRelated.err_code == 0){
																var objectObservation = {};
																objectObservation.resourceType = observation.resourceType;
																objectObservation.id = observation.id;
																objectObservation.identifier = observation.identifier;
																objectObservation.status = observation.status;
																objectObservation.category = observation.category;
																objectObservation.code = observation.code;
																objectObservation.subject = observation.subject;
																objectObservation.context = observation.context;
																objectObservation.effective = observation.effective;
																objectObservation.issued = observation.issued;
																objectObservation.value = observation.value;
																objectObservation.dataAbsentReason = observation.dataAbsentReason;
																objectObservation.interpretation = observation.interpretation;
																objectObservation.comment = observation.comment;
																objectObservation.bodySite = observation.bodySite;
																objectObservation.method = observation.method;
																objectObservation.specimen = observation.specimen;
																objectObservation.device = observation.device;
																objectObservation.related = observationRelated.data;
																
																newObservation[index] = objectObservation;
																myEmitter.once('getObservationReferenceRange', function(observation, index, newObservation, countObservation){
																	qString = {};
																	qString.observation_id = observation.id;
																	seedPhoenixFHIR.path.GET = {
																		"ObservationReferenceRange" : {
																			"location": "%(apikey)s/ObservationReferenceRange",
																			"query": qString
																		}
																	}

																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																	ApiFHIR.get('ObservationReferenceRange', {"apikey": apikey}, {}, function(error, response, body){
																		observationReferenceRange = JSON.parse(body);
																		if(observationReferenceRange.err_code == 0){
																			var objectObservation = {};
																			objectObservation.resourceType = observation.resourceType;
																			objectObservation.id = observation.id;
																			objectObservation.identifier = observation.identifier;
																			objectObservation.status = observation.status;
																			objectObservation.category = observation.category;
																			objectObservation.code = observation.code;
																			objectObservation.subject = observation.subject;
																			objectObservation.context = observation.context;
																			objectObservation.effective = observation.effective;
																			objectObservation.issued = observation.issued;
																			objectObservation.value = observation.value;
																			objectObservation.dataAbsentReason = observation.dataAbsentReason;
																			objectObservation.interpretation = observation.interpretation;
																			objectObservation.comment = observation.comment;
																			objectObservation.bodySite = observation.bodySite;
																			objectObservation.method = observation.method;
																			objectObservation.specimen = observation.specimen;
																			objectObservation.device = observation.device;
																			objectObservation.referenceRange = observationReferenceRange.data;
																			objectObservation.related = observation.related;

																			newObservation[index] = objectObservation;
																			myEmitter.once('getObservationBasedOnCarePlan', function(observation, index, newObservation, countObservation){
																				qString = {};
																				qString.observation_id = observation.id;
																				seedPhoenixFHIR.path.GET = {
																					"ObservationBasedOnCarePlan" : {
																						"location": "%(apikey)s/ObservationBasedOnCarePlan",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('ObservationBasedOnCarePlan', {"apikey": apikey}, {}, function(error, response, body){
																					observationBasedOnCarePlan = JSON.parse(body);
																					if(observationBasedOnCarePlan.err_code == 0){
																						var objectObservation = {};
																						objectObservation.resourceType = observation.resourceType;
																						objectObservation.id = observation.id;
																						objectObservation.identifier = observation.identifier;
																						var BasedOn = {};
																						BasedOn.carePlan = observationBasedOnCarePlan.data;
																						objectObservation.basedOn = BasedOn;
																						objectObservation.status = observation.status;
																						objectObservation.category = observation.category;
																						objectObservation.code = observation.code;
																						objectObservation.subject = observation.subject;
																						objectObservation.context = observation.context;
																						objectObservation.effective = observation.effective;
																						objectObservation.issued = observation.issued;
																						objectObservation.value = observation.value;
																						objectObservation.dataAbsentReason = observation.dataAbsentReason;
																						objectObservation.interpretation = observation.interpretation;
																						objectObservation.comment = observation.comment;
																						objectObservation.bodySite = observation.bodySite;
																						objectObservation.method = observation.method;
																						objectObservation.specimen = observation.specimen;
																						objectObservation.device = observation.device;
																						objectObservation.referenceRange = observation.referenceRange;
																						objectObservation.related = observation.related;

																						newObservation[index] = objectObservation;
																						myEmitter.once('getObservationBasedOnDeviceRequest', function(observation, index, newObservation, countObservation){
																							qString = {};
																							qString.observation_id = observation.id;
																							seedPhoenixFHIR.path.GET = {
																								"ObservationBasedOnDeviceRequest" : {
																									"location": "%(apikey)s/ObservationBasedOnDeviceRequest",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('ObservationBasedOnDeviceRequest', {"apikey": apikey}, {}, function(error, response, body){
																								observationBasedOnDeviceRequest = JSON.parse(body);
																								if(observationBasedOnDeviceRequest.err_code == 0){
																									var objectObservation = {};
																									objectObservation.resourceType = observation.resourceType;
																									objectObservation.id = observation.id;
																									objectObservation.identifier = observation.identifier;
																									var BasedOn = {};
																									BasedOn.carePlan = observation.basedOn.carePlan;
																									BasedOn.deviceRequest = observationBasedOnDeviceRequest.data;
																									objectObservation.basedOn = BasedOn;
																									objectObservation.status = observation.status;
																									objectObservation.category = observation.category;
																									objectObservation.code = observation.code;
																									objectObservation.subject = observation.subject;
																									objectObservation.context = observation.context;
																									objectObservation.effective = observation.effective;
																									objectObservation.issued = observation.issued;
																									objectObservation.value = observation.value;
																									objectObservation.dataAbsentReason = observation.dataAbsentReason;
																									objectObservation.interpretation = observation.interpretation;
																									objectObservation.comment = observation.comment;
																									objectObservation.bodySite = observation.bodySite;
																									objectObservation.method = observation.method;
																									objectObservation.specimen = observation.specimen;
																									objectObservation.device = observation.device;
																									objectObservation.referenceRange = observation.referenceRange;
																									objectObservation.related = observation.related;

																									newObservation[index] = objectObservation;
																									myEmitter.once('getObservationBasedOnImmunizationRecommendation', function(observation, index, newObservation, countObservation){
																										qString = {};
																										qString.observation_id = observation.id;
																										seedPhoenixFHIR.path.GET = {
																											"ObservationBasedOnImmunizationRecommendation" : {
																												"location": "%(apikey)s/ObservationBasedOnImmunizationRecommendation",
																												"query": qString
																											}
																										}

																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																										ApiFHIR.get('ObservationBasedOnImmunizationRecommendation', {"apikey": apikey}, {}, function(error, response, body){
																											observationBasedOnImmunizationRecommendation = JSON.parse(body);
																											if(observationBasedOnImmunizationRecommendation.err_code == 0){
																												var objectObservation = {};
																												objectObservation.resourceType = observation.resourceType;
																												objectObservation.id = observation.id;
																												objectObservation.identifier = observation.identifier;
																												var BasedOn = {};
																												BasedOn.carePlan = observation.basedOn.carePlan;
																												BasedOn.deviceRequest = observation.basedOn.deviceRequest;
																												BasedOn.immunizationRecommendation = observationBasedOnImmunizationRecommendation.data;
																												objectObservation.basedOn = BasedOn;
																												objectObservation.status = observation.status;
																												objectObservation.category = observation.category;
																												objectObservation.code = observation.code;
																												objectObservation.subject = observation.subject;
																												objectObservation.context = observation.context;
																												objectObservation.effective = observation.effective;
																												objectObservation.issued = observation.issued;
																												objectObservation.value = observation.value;
																												objectObservation.dataAbsentReason = observation.dataAbsentReason;
																												objectObservation.interpretation = observation.interpretation;
																												objectObservation.comment = observation.comment;
																												objectObservation.bodySite = observation.bodySite;
																												objectObservation.method = observation.method;
																												objectObservation.specimen = observation.specimen;
																												objectObservation.device = observation.device;
																												objectObservation.referenceRange = observation.referenceRange;
																												objectObservation.related = observation.related;

																												newObservation[index] = objectObservation;
																												myEmitter.once('getObservationBasedOnMedicationRequest', function(observation, index, newObservation, countObservation){
																													qString = {};
																													qString.observation_id = observation.id;
																													seedPhoenixFHIR.path.GET = {
																														"ObservationBasedOnMedicationRequest" : {
																															"location": "%(apikey)s/ObservationBasedOnMedicationRequest",
																															"query": qString
																														}
																													}

																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																													ApiFHIR.get('ObservationBasedOnMedicationRequest', {"apikey": apikey}, {}, function(error, response, body){
																														observationBasedOnMedicationRequest = JSON.parse(body);
																														if(observationBasedOnMedicationRequest.err_code == 0){
																															var objectObservation = {};
																															objectObservation.resourceType = observation.resourceType;
																															objectObservation.id = observation.id;
																															objectObservation.identifier = observation.identifier;
																															var BasedOn = {};
																															BasedOn.carePlan = observation.basedOn.carePlan;
																															BasedOn.deviceRequest = observation.basedOn.deviceRequest;
																															BasedOn.immunizationRecommendation = observation.basedOn.immunizationRecommendation;
																															BasedOn.medicationRequest = observationBasedOnMedicationRequest.data;
																															objectObservation.basedOn = BasedOn;
																															objectObservation.status = observation.status;
																															objectObservation.category = observation.category;
																															objectObservation.code = observation.code;
																															objectObservation.subject = observation.subject;
																															objectObservation.context = observation.context;
																															objectObservation.effective = observation.effective;
																															objectObservation.issued = observation.issued;
																															objectObservation.value = observation.value;
																															objectObservation.dataAbsentReason = observation.dataAbsentReason;
																															objectObservation.interpretation = observation.interpretation;
																															objectObservation.comment = observation.comment;
																															objectObservation.bodySite = observation.bodySite;
																															objectObservation.method = observation.method;
																															objectObservation.specimen = observation.specimen;
																															objectObservation.device = observation.device;
																															objectObservation.referenceRange = observation.referenceRange;
																															objectObservation.related = observation.related;

																															newObservation[index] = objectObservation;
																															myEmitter.once('getObservationBasedOnNutritionOrder', function(observation, index, newObservation, countObservation){
																																qString = {};
																																qString.observation_id = observation.id;
																																seedPhoenixFHIR.path.GET = {
																																	"ObservationBasedOnNutritionOrder" : {
																																		"location": "%(apikey)s/ObservationBasedOnNutritionOrder",
																																		"query": qString
																																	}
																																}

																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																ApiFHIR.get('ObservationBasedOnNutritionOrder', {"apikey": apikey}, {}, function(error, response, body){
																																	observationBasedOnNutritionOrder = JSON.parse(body);
																																	if(observationBasedOnNutritionOrder.err_code == 0){
																																		var objectObservation = {};
																																		objectObservation.resourceType = observation.resourceType;
																																		objectObservation.id = observation.id;
																																		objectObservation.identifier = observation.identifier;
																																		var BasedOn = {};
																																		BasedOn.carePlan = observation.basedOn.carePlan;
																																		BasedOn.deviceRequest = observation.basedOn.deviceRequest;
																																		BasedOn.immunizationRecommendation = observation.basedOn.immunizationRecommendation;
																																		BasedOn.medicationRequest = observation.basedOn.medicationRequest;
																																		BasedOn.nutritionOrder = observationBasedOnNutritionOrder.data;
																																		objectObservation.basedOn = BasedOn;
																																		objectObservation.status = observation.status;
																																		objectObservation.category = observation.category;
																																		objectObservation.code = observation.code;
																																		objectObservation.subject = observation.subject;
																																		objectObservation.context = observation.context;
																																		objectObservation.effective = observation.effective;
																																		objectObservation.issued = observation.issued;
																																		objectObservation.value = observation.value;
																																		objectObservation.dataAbsentReason = observation.dataAbsentReason;
																																		objectObservation.interpretation = observation.interpretation;
																																		objectObservation.comment = observation.comment;
																																		objectObservation.bodySite = observation.bodySite;
																																		objectObservation.method = observation.method;
																																		objectObservation.specimen = observation.specimen;
																																		objectObservation.device = observation.device;
																																		objectObservation.referenceRange = observation.referenceRange;
																																		objectObservation.related = observation.related;

																																		newObservation[index] = objectObservation;
																																		myEmitter.once('getObservationBasedOnProcedureRequest', function(observation, index, newObservation, countObservation){
																																			qString = {};
																																			qString.observation_id = observation.id;
																																			seedPhoenixFHIR.path.GET = {
																																				"ObservationBasedOnProcedureRequest" : {
																																					"location": "%(apikey)s/ObservationBasedOnProcedureRequest",
																																					"query": qString
																																				}
																																			}

																																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																			ApiFHIR.get('ObservationBasedOnProcedureRequest', {"apikey": apikey}, {}, function(error, response, body){
																																				observationBasedOnProcedureRequest = JSON.parse(body);
																																				if(observationBasedOnProcedureRequest.err_code == 0){
																																					var objectObservation = {};
																																					objectObservation.resourceType = observation.resourceType;
																																					objectObservation.id = observation.id;
																																					objectObservation.identifier = observation.identifier;
																																					var BasedOn = {};
																																					BasedOn.carePlan = observation.basedOn.carePlan;
																																					BasedOn.deviceRequest = observation.basedOn.deviceRequest;
																																					BasedOn.immunizationRecommendation = observation.basedOn.immunizationRecommendation;
																																					BasedOn.medicationRequest = observation.basedOn.medicationRequest;
																																					BasedOn.nutritionOrder = observation.basedOn.nutritionOrder;
																																					BasedOn.procedureRequest = observationBasedOnProcedureRequest.data;
																																					objectObservation.basedOn = BasedOn;
																																					objectObservation.status = observation.status;
																																					objectObservation.category = observation.category;
																																					objectObservation.code = observation.code;
																																					objectObservation.subject = observation.subject;
																																					objectObservation.context = observation.context;
																																					objectObservation.effective = observation.effective;
																																					objectObservation.issued = observation.issued;
																																					objectObservation.value = observation.value;
																																					objectObservation.dataAbsentReason = observation.dataAbsentReason;
																																					objectObservation.interpretation = observation.interpretation;
																																					objectObservation.comment = observation.comment;
																																					objectObservation.bodySite = observation.bodySite;
																																					objectObservation.method = observation.method;
																																					objectObservation.specimen = observation.specimen;
																																					objectObservation.device = observation.device;
																																					objectObservation.referenceRange = observation.referenceRange;
																																					objectObservation.related = observation.related;

																																					newObservation[index] = objectObservation;
																																					myEmitter.once('getObservationBasedOnReferralRequest', function(observation, index, newObservation, countObservation){
																																						qString = {};
																																						qString.observation_id = observation.id;
																																						seedPhoenixFHIR.path.GET = {
																																							"ObservationBasedOnReferralRequest" : {
																																								"location": "%(apikey)s/ObservationBasedOnReferralRequest",
																																								"query": qString
																																							}
																																						}

																																						var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																						ApiFHIR.get('ObservationBasedOnReferralRequest', {"apikey": apikey}, {}, function(error, response, body){
																																							observationBasedOnReferralRequest = JSON.parse(body);
																																							if(observationBasedOnReferralRequest.err_code == 0){
																																								var objectObservation = {};
																																								objectObservation.resourceType = observation.resourceType;
																																								objectObservation.id = observation.id;
																																								objectObservation.identifier = observation.identifier;
																																								var BasedOn = {};
																																								BasedOn.carePlan = observation.basedOn.carePlan;
																																								BasedOn.deviceRequest = observation.basedOn.deviceRequest;
																																								BasedOn.immunizationRecommendation = observation.basedOn.immunizationRecommendation;
																																								BasedOn.medicationRequest = observation.basedOn.medicationRequest;
																																								BasedOn.nutritionOrder = observation.basedOn.nutritionOrder;
																																								BasedOn.procedureRequest = observation.basedOn.procedureRequest;
																																								BasedOn.referralRequest = observationBasedOnReferralRequest.data;
																																								objectObservation.basedOn = BasedOn;
																																								objectObservation.status = observation.status;
																																								objectObservation.category = observation.category;
																																								objectObservation.code = observation.code;
																																								objectObservation.subject = observation.subject;
																																								objectObservation.context = observation.context;
																																								objectObservation.effective = observation.effective;
																																								objectObservation.issued = observation.issued;
																																								objectObservation.value = observation.value;
																																								objectObservation.dataAbsentReason = observation.dataAbsentReason;
																																								objectObservation.interpretation = observation.interpretation;
																																								objectObservation.comment = observation.comment;
																																								objectObservation.bodySite = observation.bodySite;
																																								objectObservation.method = observation.method;
																																								objectObservation.specimen = observation.specimen;
																																								objectObservation.device = observation.device;
																																								objectObservation.referenceRange = observation.referenceRange;
																																								objectObservation.related = observation.related;

																																								newObservation[index] = objectObservation;
																																								myEmitter.once('getObservationPerformerPractitioner', function(observation, index, newObservation, countObservation){
																																									qString = {};
																																									qString.observation_id = observation.id;
																																									seedPhoenixFHIR.path.GET = {
																																										"ObservationPerformerPractitioner" : {
																																											"location": "%(apikey)s/ObservationPerformerPractitioner",
																																											"query": qString
																																										}
																																									}

																																									var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																									ApiFHIR.get('ObservationPerformerPractitioner', {"apikey": apikey}, {}, function(error, response, body){
																																										observationPerformerPractitioner = JSON.parse(body);
																																										if(observationPerformerPractitioner.err_code == 0){
																																											var objectObservation = {};
																																											objectObservation.resourceType = observation.resourceType;
																																											objectObservation.id = observation.id;
																																											objectObservation.identifier = observation.identifier;
																																											objectObservation.basedOn = observation.basedOn;
																																											objectObservation.status = observation.status;
																																											objectObservation.category = observation.category;
																																											objectObservation.code = observation.code;
																																											objectObservation.subject = observation.subject;
																																											objectObservation.context = observation.context;
																																											objectObservation.effective = observation.effective;
																																											objectObservation.issued = observation.issued;
																																											var Performed = {};
																																											Performed.practitioner = observationPerformerPractitioner.data;
																																											objectObservation.performed = Performed;
																																											objectObservation.value = observation.value;
																																											objectObservation.dataAbsentReason = observation.dataAbsentReason;
																																											objectObservation.interpretation = observation.interpretation;
																																											objectObservation.comment = observation.comment;
																																											objectObservation.bodySite = observation.bodySite;
																																											objectObservation.method = observation.method;
																																											objectObservation.specimen = observation.specimen;
																																											objectObservation.device = observation.device;
																																											objectObservation.referenceRange = observation.referenceRange;
																																											objectObservation.related = observation.related;

																																											newObservation[index] = objectObservation;
																																											myEmitter.once('getObservationPerformerOrganization', function(observation, index, newObservation, countObservation){
																																												qString = {};
																																												qString.observation_id = observation.id;
																																												seedPhoenixFHIR.path.GET = {
																																													"ObservationPerformerOrganization" : {
																																														"location": "%(apikey)s/ObservationPerformerOrganization",
																																														"query": qString
																																													}
																																												}

																																												var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																												ApiFHIR.get('ObservationPerformerOrganization', {"apikey": apikey}, {}, function(error, response, body){
																																													observationPerformerOrganization = JSON.parse(body);
																																													if(observationPerformerOrganization.err_code == 0){
																																														var objectObservation = {};
																																														objectObservation.resourceType = observation.resourceType;
																																														objectObservation.id = observation.id;
																																														objectObservation.identifier = observation.identifier;
																																														objectObservation.basedOn = observation.basedOn;
																																														objectObservation.status = observation.status;
																																														objectObservation.category = observation.category;
																																														objectObservation.code = observation.code;
																																														objectObservation.subject = observation.subject;
																																														objectObservation.context = observation.context;
																																														objectObservation.effective = observation.effective;
																																														objectObservation.issued = observation.issued;
																																														var Performed = {};
																																														Performed.practitioner = observation.performed.practitioner;
																																														Performed.organization = observationPerformerOrganization.data;
																																														objectObservation.performed = Performed;
																																														objectObservation.value = observation.value;
																																														objectObservation.dataAbsentReason = observation.dataAbsentReason;
																																														objectObservation.interpretation = observation.interpretation;
																																														objectObservation.comment = observation.comment;
																																														objectObservation.bodySite = observation.bodySite;
																																														objectObservation.method = observation.method;
																																														objectObservation.specimen = observation.specimen;
																																														objectObservation.device = observation.device;
																																														objectObservation.referenceRange = observation.referenceRange;
																																														objectObservation.related = observation.related;

																																														newObservation[index] = objectObservation;
																																														myEmitter.once('getObservationPerformerPatient', function(observation, index, newObservation, countObservation){
																																															qString = {};
																																															qString.observation_id = observation.id;
																																															seedPhoenixFHIR.path.GET = {
																																																"ObservationPerformerPatient" : {
																																																	"location": "%(apikey)s/ObservationPerformerPatient",
																																																	"query": qString
																																																}
																																															}

																																															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																															ApiFHIR.get('ObservationPerformerPatient', {"apikey": apikey}, {}, function(error, response, body){
																																																observationPerformerPatient = JSON.parse(body);
																																																if(observationPerformerPatient.err_code == 0){
																																																	var objectObservation = {};
																																																	objectObservation.resourceType = observation.resourceType;
																																																	objectObservation.id = observation.id;
																																																	objectObservation.identifier = observation.identifier;
																																																	objectObservation.basedOn = observation.basedOn;
																																																	objectObservation.status = observation.status;
																																																	objectObservation.category = observation.category;
																																																	objectObservation.code = observation.code;
																																																	objectObservation.subject = observation.subject;
																																																	objectObservation.context = observation.context;
																																																	objectObservation.effective = observation.effective;
																																																	objectObservation.issued = observation.issued;
																																																	var Performed = {};
																																																	Performed.practitioner = observation.performed.practitioner;
																																																	Performed.organization = observation.performed.organization;
																																																	Performed.patient = observationPerformerPatient.data;
																																																	objectObservation.performed = Performed;
																																																	objectObservation.value = observation.value;
																																																	objectObservation.dataAbsentReason = observation.dataAbsentReason;
																																																	objectObservation.interpretation = observation.interpretation;
																																																	objectObservation.comment = observation.comment;
																																																	objectObservation.bodySite = observation.bodySite;
																																																	objectObservation.method = observation.method;
																																																	objectObservation.specimen = observation.specimen;
																																																	objectObservation.device = observation.device;
																																																	objectObservation.referenceRange = observation.referenceRange;
																																																	objectObservation.related = observation.related;

																																																	newObservation[index] = objectObservation;
																																																	myEmitter.once('getObservationPerformerRelatedPerson', function(observation, index, newObservation, countObservation){
																																																		qString = {};
																																																		qString.observation_id = observation.id;
																																																		seedPhoenixFHIR.path.GET = {
																																																			"ObservationPerformerRelatedPerson" : {
																																																				"location": "%(apikey)s/ObservationPerformerRelatedPerson",
																																																				"query": qString
																																																			}
																																																		}

																																																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																																																		ApiFHIR.get('ObservationPerformerRelatedPerson', {"apikey": apikey}, {}, function(error, response, body){
																																																			observationPerformerRelatedPerson = JSON.parse(body);
																																																			if(observationPerformerRelatedPerson.err_code == 0){
																																																				var objectObservation = {};
																																																				objectObservation.resourceType = observation.resourceType;
																																																				objectObservation.id = observation.id;
																																																				objectObservation.identifier = observation.identifier;
																																																				objectObservation.basedOn = observation.basedOn;
																																																				objectObservation.status = observation.status;
																																																				objectObservation.category = observation.category;
																																																				objectObservation.code = observation.code;
																																																				objectObservation.subject = observation.subject;
																																																				objectObservation.context = observation.context;
																																																				objectObservation.effective = observation.effective;
																																																				objectObservation.issued = observation.issued;
																																																				var Performed = {};
																																																				Performed.practitioner = observation.performed.practitioner;
																																																				Performed.organization = observation.performed.organization;
																																																				Performed.patient = observation.performed.patient;
																																																				Performed.relatedPerson = observationPerformerRelatedPerson.data;
																																																				objectObservation.performed = Performed;
																																																				objectObservation.value = observation.value;
																																																				objectObservation.dataAbsentReason = observation.dataAbsentReason;
																																																				objectObservation.interpretation = observation.interpretation;
																																																				objectObservation.comment = observation.comment;
																																																				objectObservation.bodySite = observation.bodySite;
																																																				objectObservation.method = observation.method;
																																																				objectObservation.specimen = observation.specimen;
																																																				objectObservation.device = observation.device;
																																																				objectObservation.referenceRange = observation.referenceRange;
																																																				objectObservation.related = observation.related;
																																																				objectObservation.component = host + ':' + port + '/' + apikey + '/observation/' +  observation.id + '/observationComponent';

																																																				newObservation[index] = objectObservation;
																																																				if(index == countObservation -1 ){
																																																					res.json({"err_code": 0, "data":newObservation});
																																																				}
																																																			}else{
																																																				res.json(observationPerformerRelatedPerson);			
																																																			}
																																																		})
																																																	});
																																																	myEmitter.emit('getObservationPerformerRelatedPerson', objectObservation, index, newObservation, countObservation);																																				
																																																}else{
																																																	res.json(observationPerformerPatient);			
																																																}
																																															})
																																														});
																																														myEmitter.emit('getObservationPerformerPatient', objectObservation, index, newObservation, countObservation);																																				
																																													}else{
																																														res.json(observationPerformerOrganization);			
																																													}
																																												})
																																											});
																																											myEmitter.emit('getObservationPerformerOrganization', objectObservation, index, newObservation, countObservation);																																								
																																										}else{
																																											res.json(observationPerformerPractitioner);			
																																										}
																																									})
																																								});
																																								myEmitter.emit('getObservationPerformerPractitioner', objectObservation, index, newObservation, countObservation);																																								
																																							}else{
																																								res.json(observationBasedOnReferralRequest);			
																																							}
																																						})
																																					});
																																					myEmitter.emit('getObservationBasedOnReferralRequest', objectObservation, index, newObservation, countObservation);
																																				}else{
																																					res.json(observationBasedOnProcedureRequest);			
																																				}
																																			})
																																		});
																																		myEmitter.emit('getObservationBasedOnProcedureRequest', objectObservation, index, newObservation, countObservation);
																																	}else{
																																		res.json(observationBasedOnNutritionOrder);			
																																	}
																																})
																															});
																															myEmitter.emit('getObservationBasedOnNutritionOrder', objectObservation, index, newObservation, countObservation);
																														}else{
																															res.json(observationBasedOnMedicationRequest);			
																														}
																													})
																												});
																												myEmitter.emit('getObservationBasedOnMedicationRequest', objectObservation, index, newObservation, countObservation);
																											}else{
																												res.json(observationBasedOnImmunizationRecommendation);			
																											}
																										})
																									});
																									myEmitter.emit('getObservationBasedOnImmunizationRecommendation', objectObservation, index, newObservation, countObservation);
																								}else{
																									res.json(observationBasedOnDeviceRequest);			
																								}
																							})
																						});
																						myEmitter.emit('getObservationBasedOnDeviceRequest', objectObservation, index, newObservation, countObservation);
																					}else{
																						res.json(observationBasedOnCarePlan);			
																					}
																				})
																			});
																			myEmitter.emit('getObservationBasedOnCarePlan', objectObservation, index, newObservation, countObservation);
																		}else{
																			res.json(observationReferenceRange);			
																		}
																	})
																});
																myEmitter.emit('getObservationReferenceRange', objectObservation, index, newObservation, countObservation);
															}else{
																res.json(observationRelated);			
															}
														})
													})
													myEmitter.emit('getObservationRelated', objectObservation, index, newObservation, countObservation);
												}else{
													res.json(identifier);
												}
											})
										})
										myEmitter.emit("getIdentifier", observation.data[i], i, newObservation, observation.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Observation is empty."});	
								}
							}else{
								res.json(observation);
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
					var observationId = req.params.observation_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservationID){
								if(resObservationID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.observation_id = observationId;
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
						  			qString.observation_id = observationId;
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
									res.json({"err_code": 501, "err_msg": "Observation Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		observationRelated: function getObservationRelated(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var observationId = req.params.observation_id;
			var observationRelatedId = req.params.observation_related_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservation){
						if(resObservation.err_code > 0){
							if(typeof observationRelatedId !== 'undefined' && !validator.isEmpty(observationRelatedId)){
								checkUniqeValue(apikey, "RELATED_ID|" + observationRelatedId, 'OBSERVATION_RELATED', function(resObservationRelatedID){
									if(resObservationRelatedID.err_code > 0){
										//get observationRelated
										qString = {};
										qString.observation_id = observationId;
										qString._id = observationRelatedId;
										seedPhoenixFHIR.path.GET = {
											"ObservationRelated" : {
												"location": "%(apikey)s/ObservationRelated",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ObservationRelated', {"apikey": apikey}, {}, function(error, response, body){
											observationRelated = JSON.parse(body);
											if(observationRelated.err_code == 0){
												res.json({"err_code": 0, "data":observationRelated.data});	
											}else{
												res.json(observationRelated);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Observation Related Id not found"});		
									}
								})
							}else{
								//get observationRelated
								qString = {};
								qString.observation_id = observationId;
								seedPhoenixFHIR.path.GET = {
									"ObservationRelated" : {
										"location": "%(apikey)s/ObservationRelated",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ObservationRelated', {"apikey": apikey}, {}, function(error, response, body){
									observationRelated = JSON.parse(body);
									if(observationRelated.err_code == 0){
										res.json({"err_code": 0, "data":observationRelated.data});	
									}else{
										res.json(observationRelated);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Observation Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		observationComponent: function getObservationComponent(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var observationId = req.params.observation_id;
			var observationComponentId = req.params.observation_component_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservation){
						if(resObservation.err_code > 0){
							if(typeof observationComponentId !== 'undefined' && !validator.isEmpty(observationComponentId)){
								checkUniqeValue(apikey, "COMPONENT_ID|" + observationComponentId, 'OBSERVATION_COMPONENT', function(resObservationComponentID){
									if(resObservationComponentID.err_code > 0){
										//get observationComponent
										qString = {};
										qString.observation_id = observationId;
										qString._id = observationComponentId;
										seedPhoenixFHIR.path.GET = {
											"ObservationComponent" : {
												"location": "%(apikey)s/ObservationComponent",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ObservationComponent', {"apikey": apikey}, {}, function(error, response, body){
											observationComponent = JSON.parse(body);
											if(observationComponent.err_code == 0){
												//res.json({"err_code": 0, "data":observationComponent.data});	
												if(observationComponent.data.length > 0){
													newObservationComponent = [];
													for(i=0; i < observationComponent.data.length; i++){
														myEmitter.once('getObservationReferenceRange', function(observationComponent, index, newObservationComponent, countObservationComponent){
															qString = {};
															qString.component_id = observationComponent.id;
															seedPhoenixFHIR.path.GET = {
																"ObservationReferenceRange" : {
																	"location": "%(apikey)s/ObservationReferenceRange",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('ObservationReferenceRange', {"apikey": apikey}, {}, function(error, response, body){
																observationReferenceRange = JSON.parse(body);
																if(observationReferenceRange.err_code == 0){
																	var objectObservationComponent = {};
																	objectObservationComponent.id = observationComponent.id;
																	objectObservationComponent.code = observationComponent.code;
																	objectObservationComponent.value = observationComponent.value;
																	objectObservationComponent.dataAbsentReason = observationComponent.dataAbsentReason;
																	objectObservationComponent.interpretation = observationComponent.interpretation;
																						
																	newObservationComponent[index] = objectObservationComponent;

																	if(index == countObservationComponent -1 ){
																		res.json({"err_code": 0, "data":newObservationComponent});	
																	}
																}else{
																	res.json(observationReferenceRange);			
																}
															})
														})
														myEmitter.emit('getObservationReferenceRange', observationComponent.data[i], i, newObservationComponent, observationComponent.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Observation Component is empty."});	
												}
											}else{
												res.json(observationComponent);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Observation Component Id not found"});		
									}
								})
							}else{
								//get observationComponent
								qString = {};
								qString.observation_id = observationId;
								seedPhoenixFHIR.path.GET = {
									"ObservationComponent" : {
										"location": "%(apikey)s/ObservationComponent",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ObservationComponent', {"apikey": apikey}, {}, function(error, response, body){
									observationComponent = JSON.parse(body);
									if(observationComponent.err_code == 0){
										//res.json({"err_code": 0, "data":observationComponent.data});	
										if(observationComponent.data.length > 0){
											newObservationComponent = [];
											for(i=0; i < observationComponent.data.length; i++){
												myEmitter.once('getObservationReferenceRange', function(observationComponent, index, newObservationComponent, countObservationComponent){
													qString = {};
													qString.component_id = observationComponent.id;
													seedPhoenixFHIR.path.GET = {
														"ObservationReferenceRange" : {
															"location": "%(apikey)s/ObservationReferenceRange",
															"query": qString
														}
													}

													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

													ApiFHIR.get('ObservationReferenceRange', {"apikey": apikey}, {}, function(error, response, body){
														observationReferenceRange = JSON.parse(body);
														if(observationReferenceRange.err_code == 0){
															var objectObservationComponent = {};
															objectObservationComponent.id = observationComponent.id;
															objectObservationComponent.code = observationComponent.code;
															objectObservationComponent.value = observationComponent.value;
															objectObservationComponent.dataAbsentReason = observationComponent.dataAbsentReason;
															objectObservationComponent.interpretation = observationComponent.interpretation;

															newObservationComponent[index] = objectObservationComponent;

															if(index == countObservationComponent -1 ){
																res.json({"err_code": 0, "data":newObservationComponent});	
															}
														}else{
															res.json(observationReferenceRange);			
														}
													})
												})
												myEmitter.emit('getObservationReferenceRange', observationComponent.data[i], i, newObservationComponent, observationComponent.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Observation Component is empty."});	
										}
									}else{
										res.json(observationComponent);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Observation Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		observationReferenceRange: function getObservationReferenceRange(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var observationId = req.params.observation_id;
			var observationReferenceRangeId = req.params.observation_reference_range_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservation){
						if(resObservation.err_code > 0){
							if(typeof observationReferenceRangeId !== 'undefined' && !validator.isEmpty(observationReferenceRangeId)){
								checkUniqeValue(apikey, "REFERENCE_RANGE_ID|" + observationReferenceRangeId, 'OBSERVATION_REFERENCE_RANGE', function(resObservationReferenceRangeID){
									if(resObservationReferenceRangeID.err_code > 0){
										//get observationReferenceRange
										qString = {};
										qString.observation_id = observationId;
										qString._id = observationReferenceRangeId;
										seedPhoenixFHIR.path.GET = {
											"ObservationReferenceRange" : {
												"location": "%(apikey)s/ObservationReferenceRange",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ObservationReferenceRange', {"apikey": apikey}, {}, function(error, response, body){
											observationReferenceRange = JSON.parse(body);
											if(observationReferenceRange.err_code == 0){
												res.json({"err_code": 0, "data":observationReferenceRange.data});	
											}else{
												res.json(observationReferenceRange);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Observation Reference Range Id not found"});		
									}
								})
							}else{
								//get observationReferenceRange
								qString = {};
								qString.observation_id = observationId;
								seedPhoenixFHIR.path.GET = {
									"ObservationReferenceRange" : {
										"location": "%(apikey)s/ObservationReferenceRange",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ObservationReferenceRange', {"apikey": apikey}, {}, function(error, response, body){
									observationReferenceRange = JSON.parse(body);
									if(observationReferenceRange.err_code == 0){
										res.json({"err_code": 0, "data":observationReferenceRange.data});	
									}else{
										res.json(observationReferenceRange);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Observation Id not found"});		
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
		observation : function addObservation(req, res){
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
basedOn.carePlan|basedOnCarePlan|||
basedOn.deviceRequest|basedOnDeviceRequest|||
basedOn.immunizationRecommendation|basedOnImmunizationRecommendation|||
basedOn.medicationRequest|basedOnMedicationRequest|||
basedOn.nutritionOrder|basedOnNutritionOrder|||
basedOn.procedureRequest|basedOnProcedureRequest|||
basedOn.referralRequest|basedOnReferralRequest|||
status|status||nn|
category|category|||
code|code||nn|
subject.patient|subjectPatient|||
subject.group|subjectGroup|||
subject.device|subjectDevice|||
subject.location|subjectLocation|||
context.encounter|contextEncounter|||
context.episodeOfCare|contextEpisodeOfCare|||
effective.effectiveDateTime|effectiveEffectiveDateTime|date||
effective.effectivePeriod|effectiveEffectivePeriod|period||
issued|issued|date||
performer.practitioner|performerPractitioner|||
performer.organization|performerOrganization|||
performer.patient|performerPatient|||
performer.relatedPerson|performerRelatedPerson|||
value.valueQuantity|valueValueQuantity|integer||
value.valueCodeableConcept|valueValueCodeableConcept|||
value.valueString|valueValueString|||
value.valueBoolean|valueValueBoolean|boolean||
value.valueRange|valueValueRange|range||
value.valueRatio|valueValueRatio|ratio||
value.valueSampledData.origin|valueValueSampledDataOrigin|integer||
value.valueSampledData.period|valueValueSampledDataPeriod|integer||
value.valueSampledData.factor|valueValueSampledDataFactor|integer||
value.valueSampledData.lowerLimit|valueValueSampledDataLowerLimit|integer||
value.valueSampledData.upperLimit|valueValueSampledDataUpperLimit|integer||
value.valueSampledData.dimensions|valueValueSampledDataDimensions|integer||
value.valueSampledData.data|valueValueSampledDataData|||
value.valueAttachment.contentType|valueValueAttachmentContentType|||
value.valueAttachment.language|valueValueAttachmentLanguage|||
value.valueAttachment.data|valueValueAttachmentData|||
value.valueAttachment.size|valueValueAttachmentSize|integer||
value.valueAttachment.title|valueValueAttachmentTitle|||
value.valueTime|valueValueTime|date||
value.valueDateTime|valueValueDateTime|date||
value.valuePeriod|valueValuePeriod|period||
dataAbsentReason|dataAbsentReason|||
interpretation|interpretation|||u
comment|comment|||
bodySite|bodySite|||
method|method|||
specimen|specimen|||
device.device|deviceDevice|||
device.deviceMetric|deviceDeviceMetric|||
referenceRange.low|referenceRangeLow|integer||
referenceRange.high|referenceRangeHigh|integer||
referenceRange.type|referenceRangeType|||
referenceRange.appliesTo|referenceRangeAppliesTo|||
referenceRange.age|referenceRangeAge|range||
referenceRange.text|referenceRangeText|||
related.type|relatedType|||
related.target.observation|relatedTargetObservation|||
related.target.questionnaireResponse|relatedTargetQuestionnaireResponse|||
related.target.sequence|relatedTargetSequence|||
component.code|componentCode||nn|
component.value.valueQuantity|componentValueValueQuantity|integer||
component.value.valueCodeableConcept|componentValueValueCodeableConcept|||
component.value.valueString|componentValueValueString|||
component.value.valueRange|componentValueValueRange|range||
component.value.valueRatio|componentValueValueRatio|ratio||
component.value.valueSampledData.origin|componentValueValueSampledDataOrigin|integer||
component.value.valueSampledData.period|componentValueValueSampledDataPeriod|integer||
component.value.valueSampledData.factor|componentValueValueSampledDataFactor|integer||
component.value.valueSampledData.lowerLimit|componentValueValueSampledDataLowerLimit|integer||
component.value.valueSampledData.upperLimit|componentValueValueSampledDataUpperLimit|integer||
component.value.valueSampledData.dimensions|componentValueValueSampledDataDimensions|integer||
component.value.valueSampledData.data|componentValueValueSampledDataData|||
component.value.valueAttachment.contentType|componentValueValueAttachmentContentType|||
component.value.valueAttachment.language|componentValueValueAttachmentLanguage|||
component.value.valueAttachment.data|componentValueValueAttachmentData|||
component.value.valueAttachment.size|componentValueValueAttachmentSize|integer||
component.value.valueAttachment.title|componentValueValueAttachmentTitle|||
component.value.valueTime|componentValueValueTime|date||
component.value.valueDateTime|componentValueValueDateTime|date||
component.value.valuePeriod|componentValueValuePeriod|period||
component.dataAbsentReason|componentDataAbsentReason|||
component.interpretation|componentInterpretation|||u
component.referenceRange.low|componentReferenceRangeLow|integer||
component.referenceRange.high|componentReferenceRangeHigh|integer||
component.referenceRange.type|componentReferenceRangeType|||
component.referenceRange.appliesTo|componentReferenceRangeAppliesTo|||
component.referenceRange.age|componentReferenceRangeAge|range||
component.referenceRange.text|componentReferenceRangeText||
*/
			if(typeof req.body.basedOn.carePlan !== 'undefined'){
				var basedOnCarePlan =  req.body.basedOn.carePlan.trim().toLowerCase();
				if(validator.isEmpty(basedOnCarePlan)){
					basedOnCarePlan = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on care plan' in json Observation request.";
			}

			if(typeof req.body.basedOn.deviceRequest !== 'undefined'){
				var basedOnDeviceRequest =  req.body.basedOn.deviceRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnDeviceRequest)){
					basedOnDeviceRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on device request' in json Observation request.";
			}

			if(typeof req.body.basedOn.immunizationRecommendation !== 'undefined'){
				var basedOnImmunizationRecommendation =  req.body.basedOn.immunizationRecommendation.trim().toLowerCase();
				if(validator.isEmpty(basedOnImmunizationRecommendation)){
					basedOnImmunizationRecommendation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on immunization recommendation' in json Observation request.";
			}

			if(typeof req.body.basedOn.medicationRequest !== 'undefined'){
				var basedOnMedicationRequest =  req.body.basedOn.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnMedicationRequest)){
					basedOnMedicationRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on medication request' in json Observation request.";
			}

			if(typeof req.body.basedOn.nutritionOrder !== 'undefined'){
				var basedOnNutritionOrder =  req.body.basedOn.nutritionOrder.trim().toLowerCase();
				if(validator.isEmpty(basedOnNutritionOrder)){
					basedOnNutritionOrder = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on nutrition order' in json Observation request.";
			}

			if(typeof req.body.basedOn.procedureRequest !== 'undefined'){
				var basedOnProcedureRequest =  req.body.basedOn.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnProcedureRequest)){
					basedOnProcedureRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on procedure request' in json Observation request.";
			}

			if(typeof req.body.basedOn.referralRequest !== 'undefined'){
				var basedOnReferralRequest =  req.body.basedOn.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnReferralRequest)){
					basedOnReferralRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'based on referral request' in json Observation request.";
			}

			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Observation status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Observation request.";
			}

			if(typeof req.body.category !== 'undefined'){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					category = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'category' in json Observation request.";
			}

			if(typeof req.body.code !== 'undefined'){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					err_code = 2;
					err_msg = "Observation code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Observation request.";
			}

			if(typeof req.body.subject.patient !== 'undefined'){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					subjectPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject patient' in json Observation request.";
			}

			if(typeof req.body.subject.group !== 'undefined'){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					subjectGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject group' in json Observation request.";
			}

			if(typeof req.body.subject.device !== 'undefined'){
				var subjectDevice =  req.body.subject.device.trim().toLowerCase();
				if(validator.isEmpty(subjectDevice)){
					subjectDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject device' in json Observation request.";
			}

			if(typeof req.body.subject.location !== 'undefined'){
				var subjectLocation =  req.body.subject.location.trim().toLowerCase();
				if(validator.isEmpty(subjectLocation)){
					subjectLocation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subject location' in json Observation request.";
			}

			if(typeof req.body.context.encounter !== 'undefined'){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					contextEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context encounter' in json Observation request.";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined'){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					contextEpisodeOfCare = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'context episode of care' in json Observation request.";
			}

			if(typeof req.body.effective.effectiveDateTime !== 'undefined'){
				var effectiveEffectiveDateTime =  req.body.effective.effectiveDateTime;
				if(validator.isEmpty(effectiveEffectiveDateTime)){
					effectiveEffectiveDateTime = "";
				}else{
					if(!regex.test(effectiveEffectiveDateTime)){
						err_code = 2;
						err_msg = "Observation effective effective date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'effective effective date time' in json Observation request.";
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
				      err_msg = "Observation effective effective period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Observation effective effective period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'effective effective period' in json Observation request.";
			}

			if(typeof req.body.issued !== 'undefined'){
				var issued =  req.body.issued;
				if(validator.isEmpty(issued)){
					issued = "";
				}else{
					if(!regex.test(issued)){
						err_code = 2;
						err_msg = "Observation issued invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'issued' in json Observation request.";
			}

			if(typeof req.body.performer.practitioner !== 'undefined'){
				var performerPractitioner =  req.body.performer.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerPractitioner)){
					performerPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer practitioner' in json Observation request.";
			}

			if(typeof req.body.performer.organization !== 'undefined'){
				var performerOrganization =  req.body.performer.organization.trim().toLowerCase();
				if(validator.isEmpty(performerOrganization)){
					performerOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer organization' in json Observation request.";
			}

			if(typeof req.body.performer.patient !== 'undefined'){
				var performerPatient =  req.body.performer.patient.trim().toLowerCase();
				if(validator.isEmpty(performerPatient)){
					performerPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer patient' in json Observation request.";
			}

			if(typeof req.body.performer.relatedPerson !== 'undefined'){
				var performerRelatedPerson =  req.body.performer.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(performerRelatedPerson)){
					performerRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'performer related person' in json Observation request.";
			}

			if(typeof req.body.value.valueQuantity !== 'undefined'){
				var valueValueQuantity =  req.body.value.valueQuantity.trim();
				if(validator.isEmpty(valueValueQuantity)){
					valueValueQuantity = "";
				}else{
					if(!validator.isInt(valueValueQuantity)){
						err_code = 2;
						err_msg = "Observation value value quantity is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value quantity' in json Observation request.";
			}

			if(typeof req.body.value.valueCodeableConcept !== 'undefined'){
				var valueValueCodeableConcept =  req.body.value.valueCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(valueValueCodeableConcept)){
					valueValueCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value codeable concept' in json Observation request.";
			}

			if(typeof req.body.value.valueString !== 'undefined'){
				var valueValueString =  req.body.value.valueString.trim().toLowerCase();
				if(validator.isEmpty(valueValueString)){
					valueValueString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value string' in json Observation request.";
			}

			if (typeof req.body.value.valueBoolean !== 'undefined') {
				var valueValueBoolean = req.body.value.valueBoolean.trim().toLowerCase();
					if(validator.isEmpty(valueValueBoolean)){
						valueValueBoolean = "false";
					}
				if(valueValueBoolean === "true" || valueValueBoolean === "false"){
					valueValueBoolean = valueValueBoolean;
				} else {
					err_code = 2;
					err_msg = "Observation value value boolean is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'value value boolean' in json Observation request.";
			}

			if (typeof req.body.value.valueRange !== 'undefined') {
			  var valueValueRange = req.body.value.valueRange;
 				if(validator.isEmpty(valueValueRange)){
				  var valueValueRangeLow = "";
				  var valueValueRangeHigh = "";
				} else {
				  if (valueValueRange.indexOf("to") > 0) {
				    arrValueValueRange = valueValueRange.split("to");
				    var valueValueRangeLow = arrValueValueRange[0];
				    var valueValueRangeHigh = arrValueValueRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Observation value value range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'value value range' in json Observation request.";
			}

			if (typeof req.body.value.valueRatio !== 'undefined') {
			  var valueValueRatio = req.body.value.valueRatio;
 				if(validator.isEmpty(valueValueRatio)){
				  var valueValueRatioNumerator = "";
				  var valueValueRatioDenominator = "";
				} else {
				  if (valueValueRatio.indexOf("to") > 0) {
				    arrValueValueRatio = valueValueRatio.split("to");
				    var valueValueRatioNumerator = arrValueValueRatio[0];
				    var valueValueRatioDenominator = arrValueValueRatio[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Observation value value ratio invalid ratio format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'value value ratio' in json Observation request.";
			}

			if(typeof req.body.value.valueSampledData.origin !== 'undefined'){
				var valueValueSampledDataOrigin =  req.body.value.valueSampledData.origin.trim();
				if(validator.isEmpty(valueValueSampledDataOrigin)){
					valueValueSampledDataOrigin = "";
				}else{
					if(!validator.isInt(valueValueSampledDataOrigin)){
						err_code = 2;
						err_msg = "Observation value value sampled data origin is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value sampled data origin' in json Observation request.";
			}

			if(typeof req.body.value.valueSampledData.period !== 'undefined'){
				var valueValueSampledDataPeriod =  req.body.value.valueSampledData.period.trim();
				if(validator.isEmpty(valueValueSampledDataPeriod)){
					valueValueSampledDataPeriod = "";
				}else{
					if(!validator.isInt(valueValueSampledDataPeriod)){
						err_code = 2;
						err_msg = "Observation value value sampled data period is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value sampled data period' in json Observation request.";
			}

			if(typeof req.body.value.valueSampledData.factor !== 'undefined'){
				var valueValueSampledDataFactor =  req.body.value.valueSampledData.factor.trim();
				if(validator.isEmpty(valueValueSampledDataFactor)){
					valueValueSampledDataFactor = "";
				}else{
					if(!validator.isInt(valueValueSampledDataFactor)){
						err_code = 2;
						err_msg = "Observation value value sampled data factor is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value sampled data factor' in json Observation request.";
			}

			if(typeof req.body.value.valueSampledData.lowerLimit !== 'undefined'){
				var valueValueSampledDataLowerLimit =  req.body.value.valueSampledData.lowerLimit.trim();
				if(validator.isEmpty(valueValueSampledDataLowerLimit)){
					valueValueSampledDataLowerLimit = "";
				}else{
					if(!validator.isInt(valueValueSampledDataLowerLimit)){
						err_code = 2;
						err_msg = "Observation value value sampled data lower limit is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value sampled data lower limit' in json Observation request.";
			}

			if(typeof req.body.value.valueSampledData.upperLimit !== 'undefined'){
				var valueValueSampledDataUpperLimit =  req.body.value.valueSampledData.upperLimit.trim();
				if(validator.isEmpty(valueValueSampledDataUpperLimit)){
					valueValueSampledDataUpperLimit = "";
				}else{
					if(!validator.isInt(valueValueSampledDataUpperLimit)){
						err_code = 2;
						err_msg = "Observation value value sampled data upper limit is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value sampled data upper limit' in json Observation request.";
			}

			if(typeof req.body.value.valueSampledData.dimensions !== 'undefined'){
				var valueValueSampledDataDimensions =  req.body.value.valueSampledData.dimensions.trim();
				if(validator.isEmpty(valueValueSampledDataDimensions)){
					valueValueSampledDataDimensions = "";
				}else{
					if(!validator.isInt(valueValueSampledDataDimensions)){
						err_code = 2;
						err_msg = "Observation value value sampled data dimensions is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value sampled data dimensions' in json Observation request.";
			}

			if(typeof req.body.value.valueSampledData.data !== 'undefined'){
				var valueValueSampledDataData =  req.body.value.valueSampledData.data.trim().toLowerCase();
				if(validator.isEmpty(valueValueSampledDataData)){
					valueValueSampledDataData = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value sampled data data' in json Observation request.";
			}

			if(typeof req.body.value.valueAttachment.contentType !== 'undefined'){
				var valueValueAttachmentContentType =  req.body.value.valueAttachment.contentType.trim().toLowerCase();
				if(validator.isEmpty(valueValueAttachmentContentType)){
					valueValueAttachmentContentType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value attachment content type' in json Observation request.";
			}

			if(typeof req.body.value.valueAttachment.language !== 'undefined'){
				var valueValueAttachmentLanguage =  req.body.value.valueAttachment.language.trim().toLowerCase();
				if(validator.isEmpty(valueValueAttachmentLanguage)){
					valueValueAttachmentLanguage = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value attachment language' in json Observation request.";
			}

			if(typeof req.body.value.valueAttachment.data !== 'undefined'){
				var valueValueAttachmentData =  req.body.value.valueAttachment.data.trim().toLowerCase();
				if(validator.isEmpty(valueValueAttachmentData)){
					valueValueAttachmentData = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value attachment data' in json Observation request.";
			}

			if(typeof req.body.value.valueAttachment.size !== 'undefined'){
				var valueValueAttachmentSize =  req.body.value.valueAttachment.size.trim();
				if(validator.isEmpty(valueValueAttachmentSize)){
					valueValueAttachmentSize = "";
				}else{
					if(!validator.isInt(valueValueAttachmentSize)){
						err_code = 2;
						err_msg = "Observation value value attachment size is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value attachment size' in json Observation request.";
			}

			if(typeof req.body.value.valueAttachment.title !== 'undefined'){
				var valueValueAttachmentTitle =  req.body.value.valueAttachment.title.trim().toLowerCase();
				if(validator.isEmpty(valueValueAttachmentTitle)){
					valueValueAttachmentTitle = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value attachment title' in json Observation request.";
			}

			if(typeof req.body.value.valueTime !== 'undefined'){
				var valueValueTime =  req.body.value.valueTime;
				if(validator.isEmpty(valueValueTime)){
					valueValueTime = "";
				}else{
					if(!regex.test(valueValueTime)){
						err_code = 2;
						err_msg = "Observation value value time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value time' in json Observation request.";
			}

			if(typeof req.body.value.valueDateTime !== 'undefined'){
				var valueValueDateTime =  req.body.value.valueDateTime;
				if(validator.isEmpty(valueValueDateTime)){
					valueValueDateTime = "";
				}else{
					if(!regex.test(valueValueDateTime)){
						err_code = 2;
						err_msg = "Observation value value date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'value value date time' in json Observation request.";
			}

			if (typeof req.body.value.valuePeriod !== 'undefined') {
			  var valueValuePeriod = req.body.value.valuePeriod;
 				if(validator.isEmpty(valueValuePeriod)) {
				  var valueValuePeriodStart = "";
				  var valueValuePeriodEnd = "";
				} else {
				  if (valueValuePeriod.indexOf("to") > 0) {
				    arrValueValuePeriod = valueValuePeriod.split("to");
				    var valueValuePeriodStart = arrValueValuePeriod[0];
				    var valueValuePeriodEnd = arrValueValuePeriod[1];
				    if (!regex.test(valueValuePeriodStart) && !regex.test(valueValuePeriodEnd)) {
				      err_code = 2;
				      err_msg = "Observation value value period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Observation value value period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'value value period' in json Observation request.";
			}

			if(typeof req.body.dataAbsentReason !== 'undefined'){
				var dataAbsentReason =  req.body.dataAbsentReason.trim().toLowerCase();
				if(validator.isEmpty(dataAbsentReason)){
					dataAbsentReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'data absent reason' in json Observation request.";
			}

			if(typeof req.body.interpretation !== 'undefined'){
				var interpretation =  req.body.interpretation.trim().toUpperCase();
				if(validator.isEmpty(interpretation)){
					interpretation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'interpretation' in json Observation request.";
			}

			if(typeof req.body.comment !== 'undefined'){
				var comment =  req.body.comment.trim().toLowerCase();
				if(validator.isEmpty(comment)){
					comment = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'comment' in json Observation request.";
			}

			if(typeof req.body.bodySite !== 'undefined'){
				var bodySite =  req.body.bodySite.trim().toLowerCase();
				if(validator.isEmpty(bodySite)){
					bodySite = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'body site' in json Observation request.";
			}

			if(typeof req.body.method !== 'undefined'){
				var method =  req.body.method.trim().toLowerCase();
				if(validator.isEmpty(method)){
					method = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'method' in json Observation request.";
			}

			if(typeof req.body.specimen !== 'undefined'){
				var specimen =  req.body.specimen.trim().toLowerCase();
				if(validator.isEmpty(specimen)){
					specimen = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'specimen' in json Observation request.";
			}

			if(typeof req.body.device.device !== 'undefined'){
				var deviceDevice =  req.body.device.device.trim().toLowerCase();
				if(validator.isEmpty(deviceDevice)){
					deviceDevice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'device device' in json Observation request.";
			}

			if(typeof req.body.device.deviceMetric !== 'undefined'){
				var deviceDeviceMetric =  req.body.device.deviceMetric.trim().toLowerCase();
				if(validator.isEmpty(deviceDeviceMetric)){
					deviceDeviceMetric = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'device device metric' in json Observation request.";
			}

			if(typeof req.body.referenceRange.low !== 'undefined'){
				var referenceRangeLow =  req.body.referenceRange.low.trim();
				if(validator.isEmpty(referenceRangeLow)){
					referenceRangeLow = "";
				}else{
					if(!validator.isInt(referenceRangeLow)){
						err_code = 2;
						err_msg = "Observation reference range low is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range low' in json Observation request.";
			}

			if(typeof req.body.referenceRange.high !== 'undefined'){
				var referenceRangeHigh =  req.body.referenceRange.high.trim();
				if(validator.isEmpty(referenceRangeHigh)){
					referenceRangeHigh = "";
				}else{
					if(!validator.isInt(referenceRangeHigh)){
						err_code = 2;
						err_msg = "Observation reference range high is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range high' in json Observation request.";
			}

			if(typeof req.body.referenceRange.type !== 'undefined'){
				var referenceRangeType =  req.body.referenceRange.type.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeType)){
					referenceRangeType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range type' in json Observation request.";
			}

			if(typeof req.body.referenceRange.appliesTo !== 'undefined'){
				var referenceRangeAppliesTo =  req.body.referenceRange.appliesTo.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeAppliesTo)){
					referenceRangeAppliesTo = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range applies to' in json Observation request.";
			}

			if (typeof req.body.referenceRange.age !== 'undefined') {
			  var referenceRangeAge = req.body.referenceRange.age;
 				if(validator.isEmpty(referenceRangeAge)){
				  var referenceRangeAgeLow = "";
				  var referenceRangeAgeHigh = "";
				} else {
				  if (referenceRangeAge.indexOf("to") > 0) {
				    arrReferenceRangeAge = referenceRangeAge.split("to");
				    var referenceRangeAgeLow = arrReferenceRangeAge[0];
				    var referenceRangeAgeHigh = arrReferenceRangeAge[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Observation reference range age invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'reference range age' in json Observation request.";
			}

			if(typeof req.body.referenceRange.text !== 'undefined'){
				var referenceRangeText =  req.body.referenceRange.text.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeText)){
					referenceRangeText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range text' in json Observation request.";
			}

			if(typeof req.body.related.type !== 'undefined'){
				var relatedType =  req.body.related.type.trim().toLowerCase();
				if(validator.isEmpty(relatedType)){
					relatedType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'related type' in json Observation request.";
			}

			if(typeof req.body.related.target.observation !== 'undefined'){
				var relatedTargetObservation =  req.body.related.target.observation.trim().toLowerCase();
				if(validator.isEmpty(relatedTargetObservation)){
					relatedTargetObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'related target observation' in json Observation request.";
			}

			if(typeof req.body.related.target.questionnaireResponse !== 'undefined'){
				var relatedTargetQuestionnaireResponse =  req.body.related.target.questionnaireResponse.trim().toLowerCase();
				if(validator.isEmpty(relatedTargetQuestionnaireResponse)){
					relatedTargetQuestionnaireResponse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'related target questionnaire response' in json Observation request.";
			}

			if(typeof req.body.related.target.sequence !== 'undefined'){
				var relatedTargetSequence =  req.body.related.target.sequence.trim().toLowerCase();
				if(validator.isEmpty(relatedTargetSequence)){
					relatedTargetSequence = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'related target sequence' in json Observation request.";
			}

			if(typeof req.body.component.code !== 'undefined'){
				var componentCode =  req.body.component.code.trim().toLowerCase();
				if(validator.isEmpty(componentCode)){
					err_code = 2;
					err_msg = "Observation component code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component code' in json Observation request.";
			}

			if(typeof req.body.component.value.valueQuantity !== 'undefined'){
				var componentValueValueQuantity =  req.body.component.value.valueQuantity.trim();
				if(validator.isEmpty(componentValueValueQuantity)){
					componentValueValueQuantity = "";
				}else{
					if(!validator.isInt(componentValueValueQuantity)){
						err_code = 2;
						err_msg = "Observation component value value quantity is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value quantity' in json Observation request.";
			}

			if(typeof req.body.component.value.valueCodeableConcept !== 'undefined'){
				var componentValueValueCodeableConcept =  req.body.component.value.valueCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueCodeableConcept)){
					componentValueValueCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value codeable concept' in json Observation request.";
			}

			if(typeof req.body.component.value.valueString !== 'undefined'){
				var componentValueValueString =  req.body.component.value.valueString.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueString)){
					componentValueValueString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value string' in json Observation request.";
			}

			if (typeof req.body.component.value.valueRange !== 'undefined') {
			  var componentValueValueRange = req.body.component.value.valueRange;
 				if(validator.isEmpty(componentValueValueRange)){
				  var componentValueValueRangeLow = "";
				  var componentValueValueRangeHigh = "";
				} else {
				  if (componentValueValueRange.indexOf("to") > 0) {
				    arrComponentValueValueRange = componentValueValueRange.split("to");
				    var componentValueValueRangeLow = arrComponentValueValueRange[0];
				    var componentValueValueRangeHigh = arrComponentValueValueRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Observation component value value range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'component value value range' in json Observation request.";
			}

			if (typeof req.body.component.value.valueRatio !== 'undefined') {
			  var componentValueValueRatio = req.body.component.value.valueRatio;
 				if(validator.isEmpty(componentValueValueRatio)){
				  var componentValueValueRatioNumerator = "";
				  var componentValueValueRatioDenominator = "";
				} else {
				  if (componentValueValueRatio.indexOf("to") > 0) {
				    arrComponentValueValueRatio = componentValueValueRatio.split("to");
				    var componentValueValueRatioNumerator = arrComponentValueValueRatio[0];
				    var componentValueValueRatioDenominator = arrComponentValueValueRatio[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Observation component value value ratio invalid ratio format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'component value value ratio' in json Observation request.";
			}

			if(typeof req.body.component.value.valueSampledData.origin !== 'undefined'){
				var componentValueValueSampledDataOrigin =  req.body.component.value.valueSampledData.origin.trim();
				if(validator.isEmpty(componentValueValueSampledDataOrigin)){
					componentValueValueSampledDataOrigin = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataOrigin)){
						err_code = 2;
						err_msg = "Observation component value value sampled data origin is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value sampled data origin' in json Observation request.";
			}

			if(typeof req.body.component.value.valueSampledData.period !== 'undefined'){
				var componentValueValueSampledDataPeriod =  req.body.component.value.valueSampledData.period.trim();
				if(validator.isEmpty(componentValueValueSampledDataPeriod)){
					componentValueValueSampledDataPeriod = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataPeriod)){
						err_code = 2;
						err_msg = "Observation component value value sampled data period is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value sampled data period' in json Observation request.";
			}

			if(typeof req.body.component.value.valueSampledData.factor !== 'undefined'){
				var componentValueValueSampledDataFactor =  req.body.component.value.valueSampledData.factor.trim();
				if(validator.isEmpty(componentValueValueSampledDataFactor)){
					componentValueValueSampledDataFactor = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataFactor)){
						err_code = 2;
						err_msg = "Observation component value value sampled data factor is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value sampled data factor' in json Observation request.";
			}

			if(typeof req.body.component.value.valueSampledData.lowerLimit !== 'undefined'){
				var componentValueValueSampledDataLowerLimit =  req.body.component.value.valueSampledData.lowerLimit.trim();
				if(validator.isEmpty(componentValueValueSampledDataLowerLimit)){
					componentValueValueSampledDataLowerLimit = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataLowerLimit)){
						err_code = 2;
						err_msg = "Observation component value value sampled data lower limit is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value sampled data lower limit' in json Observation request.";
			}

			if(typeof req.body.component.value.valueSampledData.upperLimit !== 'undefined'){
				var componentValueValueSampledDataUpperLimit =  req.body.component.value.valueSampledData.upperLimit.trim();
				if(validator.isEmpty(componentValueValueSampledDataUpperLimit)){
					componentValueValueSampledDataUpperLimit = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataUpperLimit)){
						err_code = 2;
						err_msg = "Observation component value value sampled data upper limit is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value sampled data upper limit' in json Observation request.";
			}

			if(typeof req.body.component.value.valueSampledData.dimensions !== 'undefined'){
				var componentValueValueSampledDataDimensions =  req.body.component.value.valueSampledData.dimensions.trim();
				if(validator.isEmpty(componentValueValueSampledDataDimensions)){
					componentValueValueSampledDataDimensions = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataDimensions)){
						err_code = 2;
						err_msg = "Observation component value value sampled data dimensions is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value sampled data dimensions' in json Observation request.";
			}

			if(typeof req.body.component.value.valueSampledData.data !== 'undefined'){
				var componentValueValueSampledDataData =  req.body.component.value.valueSampledData.data.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueSampledDataData)){
					componentValueValueSampledDataData = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value sampled data data' in json Observation request.";
			}

			if(typeof req.body.component.value.valueAttachment.contentType !== 'undefined'){
				var componentValueValueAttachmentContentType =  req.body.component.value.valueAttachment.contentType.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueAttachmentContentType)){
					componentValueValueAttachmentContentType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value attachment content type' in json Observation request.";
			}

			if(typeof req.body.component.value.valueAttachment.language !== 'undefined'){
				var componentValueValueAttachmentLanguage =  req.body.component.value.valueAttachment.language.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueAttachmentLanguage)){
					componentValueValueAttachmentLanguage = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value attachment language' in json Observation request.";
			}

			if(typeof req.body.component.value.valueAttachment.data !== 'undefined'){
				var componentValueValueAttachmentData =  req.body.component.value.valueAttachment.data.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueAttachmentData)){
					componentValueValueAttachmentData = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value attachment data' in json Observation request.";
			}

			if(typeof req.body.component.value.valueAttachment.size !== 'undefined'){
				var componentValueValueAttachmentSize =  req.body.component.value.valueAttachment.size.trim();
				if(validator.isEmpty(componentValueValueAttachmentSize)){
					componentValueValueAttachmentSize = "";
				}else{
					if(!validator.isInt(componentValueValueAttachmentSize)){
						err_code = 2;
						err_msg = "Observation component value value attachment size is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value attachment size' in json Observation request.";
			}

			if(typeof req.body.component.value.valueAttachment.title !== 'undefined'){
				var componentValueValueAttachmentTitle =  req.body.component.value.valueAttachment.title.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueAttachmentTitle)){
					componentValueValueAttachmentTitle = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value attachment title' in json Observation request.";
			}

			if(typeof req.body.component.value.valueTime !== 'undefined'){
				var componentValueValueTime =  req.body.component.value.valueTime;
				if(validator.isEmpty(componentValueValueTime)){
					componentValueValueTime = "";
				}else{
					if(!regex.test(componentValueValueTime)){
						err_code = 2;
						err_msg = "Observation component value value time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value time' in json Observation request.";
			}

			if(typeof req.body.component.value.valueDateTime !== 'undefined'){
				var componentValueValueDateTime =  req.body.component.value.valueDateTime;
				if(validator.isEmpty(componentValueValueDateTime)){
					componentValueValueDateTime = "";
				}else{
					if(!regex.test(componentValueValueDateTime)){
						err_code = 2;
						err_msg = "Observation component value value date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value date time' in json Observation request.";
			}

			if (typeof req.body.component.value.valuePeriod !== 'undefined') {
			  var componentValueValuePeriod = req.body.component.value.valuePeriod;
 				if(validator.isEmpty(componentValueValuePeriod)) {
				  var componentValueValuePeriodStart = "";
				  var componentValueValuePeriodEnd = "";
				} else {
				  if (componentValueValuePeriod.indexOf("to") > 0) {
				    arrComponentValueValuePeriod = componentValueValuePeriod.split("to");
				    var componentValueValuePeriodStart = arrComponentValueValuePeriod[0];
				    var componentValueValuePeriodEnd = arrComponentValueValuePeriod[1];
				    if (!regex.test(componentValueValuePeriodStart) && !regex.test(componentValueValuePeriodEnd)) {
				      err_code = 2;
				      err_msg = "Observation component value value period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Observation component value value period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'component value value period' in json Observation request.";
			}

			if(typeof req.body.component.dataAbsentReason !== 'undefined'){
				var componentDataAbsentReason =  req.body.component.dataAbsentReason.trim().toLowerCase();
				if(validator.isEmpty(componentDataAbsentReason)){
					componentDataAbsentReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component data absent reason' in json Observation request.";
			}

			if(typeof req.body.component.interpretation !== 'undefined'){
				var componentInterpretation =  req.body.component.interpretation.trim().toUpperCase();
				if(validator.isEmpty(componentInterpretation)){
					componentInterpretation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component interpretation' in json Observation request.";
			}

			if(typeof req.body.component.referenceRange.low !== 'undefined'){
				var componentReferenceRangeLow =  req.body.component.referenceRange.low.trim();
				if(validator.isEmpty(componentReferenceRangeLow)){
					componentReferenceRangeLow = "";
				}else{
					if(!validator.isInt(componentReferenceRangeLow)){
						err_code = 2;
						err_msg = "Observation component reference range low is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component reference range low' in json Observation request.";
			}

			if(typeof req.body.component.referenceRange.high !== 'undefined'){
				var componentReferenceRangeHigh =  req.body.component.referenceRange.high.trim();
				if(validator.isEmpty(componentReferenceRangeHigh)){
					componentReferenceRangeHigh = "";
				}else{
					if(!validator.isInt(componentReferenceRangeHigh)){
						err_code = 2;
						err_msg = "Observation component reference range high is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component reference range high' in json Observation request.";
			}

			if(typeof req.body.component.referenceRange.type !== 'undefined'){
				var componentReferenceRangeType =  req.body.component.referenceRange.type.trim().toLowerCase();
				if(validator.isEmpty(componentReferenceRangeType)){
					componentReferenceRangeType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component reference range type' in json Observation request.";
			}

			if(typeof req.body.component.referenceRange.appliesTo !== 'undefined'){
				var componentReferenceRangeAppliesTo =  req.body.component.referenceRange.appliesTo.trim().toLowerCase();
				if(validator.isEmpty(componentReferenceRangeAppliesTo)){
					componentReferenceRangeAppliesTo = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component reference range applies to' in json Observation request.";
			}

			if (typeof req.body.component.referenceRange.age !== 'undefined') {
			  var componentReferenceRangeAge = req.body.component.referenceRange.age;
 				if(validator.isEmpty(componentReferenceRangeAge)){
				  var componentReferenceRangeAgeLow = "";
				  var componentReferenceRangeAgeHigh = "";
				} else {
				  if (componentReferenceRangeAge.indexOf("to") > 0) {
				    arrComponentReferenceRangeAge = componentReferenceRangeAge.split("to");
				    var componentReferenceRangeAgeLow = arrComponentReferenceRangeAge[0];
				    var componentReferenceRangeAgeHigh = arrComponentReferenceRangeAge[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Observation component reference range age invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'component reference range age' in json Observation request.";
			}

			if(typeof req.body.component.referenceRange.text !== 'undefined'){
				var componentReferenceRangeText =  req.body.component.referenceRange.text.trim().toLowerCase();
				if(validator.isEmpty(componentReferenceRangeText)){
					componentReferenceRangeText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component reference range text' in json Observation request.";
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
														var observationId = 'obs' + unicId;
														var observationRelatedId = 'obr' + unicId;
														var observationComponentId = 'obc' + unicId;
														var observationReferenceRangeId = 'orr' + unicId;
														var observationReferenceRangeComponentId = 'orc' + unicId;
														var attachment1Id = 'at1' + unicId;
														var attachment2Id = 'at2' + unicId;
														var observationSampleData1Id = 'sd1' + unicId;
														var observationSampleData2Id = 'sd2' + unicId;
									
														dataObservation = {
															"observation_id" : observationId,						
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
															"value_quantity" : valueValueQuantity,
															"value_codeable_concept" : valueValueCodeableConcept,
															"value_string" : valueValueString,
															"value_boolean" : valueValueBoolean,
															"value_range_low" : valueValueRangeLow,
															"value_range_high" : valueValueRangeHigh,
															"value_ratio_numerator" : valueValueRatioNumerator,
															"value_ratio_denominator" : valueValueRatioDenominator,
															"value_sampled_data" : observationId,
															"value_attachment" : observationId,
															"value_time" : valueValueTime,
															"value_date_time" : valueValueDateTime,
															"value_period_start" : valueValuePeriodStart,
															"value_period_end" : valueValuePeriodEnd,
															"data_absent_reason" : dataAbsentReason,
															"interpretation" : interpretation,
															"comment" : comment,
															"body_site" : bodySite,
															"method" : method,
															"specimen" : specimen,
															"device_device" : deviceDevice,
															"device_device_metric" : deviceDeviceMetric
														}
														console.log(dataObservation);
														ApiFHIR.post('observation', {"apikey": apikey}, {body: dataObservation, json: true}, function(error, response, body){
															observation = body;
															if(observation.err_code > 0){
																res.json(observation);	
																console.log("ok");
															}
														});
														
														var dataValueAttachment = {
															"id": attachment1Id,
															"content_type": presentedFormContentType,
															"language": valueValueAttachmentLanguage,
															"data": valueValueAttachmentData,
															"size": valueValueAttachmentSize,
															"hash": sha1(valueValueAttachmentData),
															"title": valueValueAttachmentTitle,
															"creation": getFormattedDate(),
															"url": attachment1Id,
															"observation_id" : observationId
														}

														//method, endpoint, params, options, callback
														ApiFHIR.post('attachment', {"apikey": apikey}, {body: dataValueAttachment, json:true}, function(error, response, body){
															ValueAttachment = body;
															if(ValueAttachment.err_code > 0){
																res.json(ValueAttachment);	
																console.log("ok");
															}
														});	
														
														var dataObservationSampledData = {
															"sampled_data_id": observationSampleData1Id,
															"origin": valueValueSampledDataOrigin,
															"period": valueValueSampledDataPeriod,
															"factor": valueValueSampledDataFactor,
															"lower_limit": valueValueSampledDataLowerLimit,
															"upper_limit": valueValueSampledDataUpperLimit,
															"dimensions": valueValueSampledDataDimensions,
															"data": valueValueSampledDataData,
															"observation_id" : observationId
														}

														//method, endpoint, params, options, callback
														ApiFHIR.post('observationSampledData', {"apikey": apikey}, {body: dataObservationSampledData, json:true}, function(error, response, body){
															observationSampledData = body;
															if(observationSampledData.err_code > 0){
																res.json(observationSampledData);	
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
																							"observation_id": observationId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														//ObservationRelated
														dataObservationRelated = {
															"related_id" : observationRelatedId,
															"type" : relatedType,
															"target_observation" : relatedTargetObservation,
															"target_questionnaire_response" : relatedTargetQuestionnaireResponse,
															"target_sequence" : relatedTargetSequence,
															"observation_id" : observationId
														};
														ApiFHIR.post('observationRelated', {"apikey": apikey}, {body: dataObservationRelated, json: true}, function(error, response, body){
															observationRelated = body;
															if(observationRelated.err_code > 0){
																res.json(observationRelated);	
																console.log("ok");
															}
														});
														
														//observationReferenceRange
														dataObservationReferenceRange = {
															"reference_range_id" : observationReferenceRangeId,
															"low" : referenceRangeLow,
															"high" : referenceRangeHigh,
															"type" : referenceRangeType,
															"applies_to" : referenceRangeAppliesTo,
															"age_low" : referenceRangeAgeLow,
															"age_high" : referenceRangeAgeHigh,
															"text" : referenceRangeText,
															"observation_id" : observationId

														};
														ApiFHIR.post('observationReferenceRange', {"apikey": apikey}, {body: dataObservationReferenceRange, json: true}, function(error, response, body){
															observationReferenceRange = body;
															if(observationReferenceRange.err_code > 0){
																res.json(observationReferenceRange);	
																console.log("ok");
															}
														});
														
														dataObservationComponent = {
															"component_id" : observationComponentId,
															"code" : componentCode,
															"value_quantity" : componentValueValueQuantity,
															"value_codeable_concept" : componentValueValueCodeableConcept,
															"value_string" : componentValueValueString,
															"value_range_low" : componentValueValueRangeLow,
															"value_range_high" : componentValueValueRangeHigh,
															"value_ratio_numerator" : componentValueValueRatioNumerator,
															"value_ratio_denominator" : componentValueValueRatioDenominator,
															"value_sampled_data" : observationComponentId,
															"value_attachment" : observationComponentId,
															"value_time" : componentValueValueTime,
															"value_date_time" : componentValueValueDateTime,
															"value_period_start" : componentValueValuePeriodStart,
															"value_period_end" : componentValueValuePeriodEnd,
															"data_absent_reason" : componentDataAbsentReason,
															"interpretation" : componentInterpretation,
															"observation_id" : observationId
														};
														ApiFHIR.post('observationComponent', {"apikey": apikey}, {body: dataObservationComponent, json: true}, function(error, response, body){
															observationComponent = body;
															if(observationComponent.err_code > 0){
																res.json(observationComponent);	
																console.log("ok");
															}
														});
	
														var dataValueAttachmentComponent = {
															"id": attachment2Id,
															"content_type": componentValueValueAttachmentContentType,
															"language": componentValueValueAttachmentLanguage,
															"data": componentValueValueAttachmentData,
															"size": componentValueValueAttachmentSize,
															"hash": sha1(componentValueValueAttachmentData),
															"title": componentValueValueAttachmentTitle,
															"creation": getFormattedDate(),
															"url": attachment2Id,
															"component_id" : observationComponentId
														}

														//method, endpoint, params, options, callback
														ApiFHIR.post('attachment', {"apikey": apikey}, {body: dataValueAttachmentComponent, json:true}, function(error, response, body){
															ValueAttachment = body;
															if(ValueAttachment.err_code > 0){
																res.json(ValueAttachment);	
																console.log("ok");
															}
														});	
														
														var dataObservationSampledDataComponent = {
															"sampled_data_id": observationSampleData2Id,
															"origin": componentValueValueSampledDataOrigin,
															"period": componentValueValueSampledDataPeriod,
															"factor": componentValueValueSampledDataFactor,
															"lower_limit": componentValueValueSampledDataLowerLimit,
															"upper_limit": componentValueValueSampledDataUpperLimit,
															"dimensions": componentValueValueSampledDataDimensions,
															"data": componentValueValueSampledDataData,
															"component_id": observationComponentId
														}

														//method, endpoint, params, options, callback
														ApiFHIR.post('observationSampledData', {"apikey": apikey}, {body: dataObservationSampledDataComponent, json:true}, function(error, response, body){
															observationSampledData = body;
															if(observationSampledData.err_code > 0){
																res.json(observationSampledData);	
																console.log("ok");
															}
														});

														dataObservationComponentReferenceRange = {
															"reference_range_id" : observationReferenceRangeComponentId,
															"low" : componentReferenceRangeLow,
															"high" : componentReferenceRangeHigh,
															"type" : componentReferenceRangeType,
															"applies_to" : componentReferenceRangeAppliesTo,
															"age_low" : componentReferenceRangeAgeLow,
															"age_high" : componentReferenceRangeAgeHigh,
															"text" : componentReferenceRangeText,
															"component_id" : observationComponentId

														};
														ApiFHIR.post('observationReferenceRange', {"apikey": apikey}, {body: dataObservationComponentReferenceRange, json: true}, function(error, response, body){
															observationReferenceRange = body;
															if(observationReferenceRange.err_code > 0){
																res.json(observationReferenceRange);	
																console.log("ok");
															}
														});	
														
														if(basedOnCarePlan !== ""){
															dataBasedOnCarePlan = {
																"_id" : basedOnCarePlan,
																"observation_id" : observationId
															}
															ApiFHIR.put('careplan', {"apikey": apikey, "_id": basedOnCarePlan}, {body: dataBasedOnCarePlan, json: true}, function(error, response, body){
																returnBasedOnCarePlan = body;
																if(returnBasedOnCarePlan.err_code > 0){
																	res.json(returnBasedOnCarePlan);	
																	console.log("add reference Based on care plan : " + basedOnCarePlan);
																}
															});
														}

														if(basedOnDeviceRequest !== ""){
															dataBasedOnDeviceRequest = {
																"_id" : basedOnDeviceRequest,
																"observation_id" : observationId
															}
															ApiFHIR.put('deviceRequest', {"apikey": apikey, "_id": basedOnDeviceRequest}, {body: dataBasedOnDeviceRequest, json: true}, function(error, response, body){
																returnBasedOnDeviceRequest = body;
																if(returnBasedOnDeviceRequest.err_code > 0){
																	res.json(returnBasedOnDeviceRequest);	
																	console.log("add reference Based on device request : " + basedOnDeviceRequest);
																}
															});
														}

														if(basedOnImmunizationRecommendation !== ""){
															dataBasedOnImmunizationRecommendation = {
																"_id" : basedOnImmunizationRecommendation,
																"observation_id" : observationId
															}
															ApiFHIR.put('immunizationRecommendation', {"apikey": apikey, "_id": basedOnImmunizationRecommendation}, {body: dataBasedOnImmunizationRecommendation, json: true}, function(error, response, body){
																returnBasedOnImmunizationRecommendation = body;
																if(returnBasedOnImmunizationRecommendation.err_code > 0){
																	res.json(returnBasedOnImmunizationRecommendation);	
																	console.log("add reference Based on immunization recommendation : " + basedOnImmunizationRecommendation);
																}
															});
														}

														if(basedOnMedicationRequest !== ""){
															dataBasedOnMedicationRequest = {
																"_id" : basedOnMedicationRequest,
																"observation_id" : observationId
															}
															ApiFHIR.put('medicationRequest', {"apikey": apikey, "_id": basedOnMedicationRequest}, {body: dataBasedOnMedicationRequest, json: true}, function(error, response, body){
																returnBasedOnMedicationRequest = body;
																if(returnBasedOnMedicationRequest.err_code > 0){
																	res.json(returnBasedOnMedicationRequest);	
																	console.log("add reference Based on medication request : " + basedOnMedicationRequest);
																}
															});
														}

														if(basedOnNutritionOrder !== ""){
															dataBasedOnNutritionOrder = {
																"_id" : basedOnNutritionOrder,
																"observation_id" : observationId
															}
															ApiFHIR.put('nutritionOrder', {"apikey": apikey, "_id": basedOnNutritionOrder}, {body: dataBasedOnNutritionOrder, json: true}, function(error, response, body){
																returnBasedOnNutritionOrder = body;
																if(returnBasedOnNutritionOrder.err_code > 0){
																	res.json(returnBasedOnNutritionOrder);	
																	console.log("add reference Based on nutrition order : " + basedOnNutritionOrder);
																}
															});
														}

														if(basedOnProcedureRequest !== ""){
															dataBasedOnProcedureRequest = {
																"_id" : basedOnProcedureRequest,
																"observation_id" : observationId
															}
															ApiFHIR.put('procedureRequest', {"apikey": apikey, "_id": basedOnProcedureRequest}, {body: dataBasedOnProcedureRequest, json: true}, function(error, response, body){
																returnBasedOnProcedureRequest = body;
																if(returnBasedOnProcedureRequest.err_code > 0){
																	res.json(returnBasedOnProcedureRequest);	
																	console.log("add reference Based on procedure request : " + basedOnProcedureRequest);
																}
															});
														}

														if(basedOnReferralRequest !== ""){
															dataBasedOnReferralRequest = {
																"_id" : basedOnReferralRequest,
																"observation_id" : observationId
															}
															ApiFHIR.put('referralRequest', {"apikey": apikey, "_id": basedOnReferralRequest}, {body: dataBasedOnReferralRequest, json: true}, function(error, response, body){
																returnBasedOnReferralRequest = body;
																if(returnBasedOnReferralRequest.err_code > 0){
																	res.json(returnBasedOnReferralRequest);	
																	console.log("add reference Based on referral request : " + basedOnReferralRequest);
																}
															});
														}

														if(performerPractitioner !== ""){
															dataPerformerPractitioner = {
																"_id" : performerPractitioner,
																"observation_id" : observationId
															}
															ApiFHIR.put('practitioner', {"apikey": apikey, "_id": performerPractitioner}, {body: dataPerformerPractitioner, json: true}, function(error, response, body){
																returnPerformerPractitioner = body;
																if(returnPerformerPractitioner.err_code > 0){
																	res.json(returnPerformerPractitioner);	
																	console.log("add reference Performer practitioner : " + performerPractitioner);
																}
															});
														}

														if(performerOrganization !== ""){
															dataPerformerOrganization = {
																"_id" : performerOrganization,
																"observation_id" : observationId
															}
															ApiFHIR.put('organization', {"apikey": apikey, "_id": performerOrganization}, {body: dataPerformerOrganization, json: true}, function(error, response, body){
																returnPerformerOrganization = body;
																if(returnPerformerOrganization.err_code > 0){
																	res.json(returnPerformerOrganization);	
																	console.log("add reference Performer organization : " + performerOrganization);
																}
															});
														}

														if(performerPatient !== ""){
															dataPerformerPatient = {
																"_id" : performerPatient,
																"observation_id" : observationId
															}
															ApiFHIR.put('patient', {"apikey": apikey, "_id": performerPatient}, {body: dataPerformerPatient, json: true}, function(error, response, body){
																returnPerformerPatient = body;
																if(returnPerformerPatient.err_code > 0){
																	res.json(returnPerformerPatient);	
																	console.log("add reference Performer patient : " + performerPatient);
																}
															});
														}

														if(performerRelatedPerson !== ""){
															dataPerformerRelatedPerson = {
																"_id" : performerRelatedPerson,
																"observation_id" : observationId
															}
															ApiFHIR.put('relatedPerson', {"apikey": apikey, "_id": performerRelatedPerson}, {body: dataPerformerRelatedPerson, json: true}, function(error, response, body){
																returnPerformerRelatedPerson = body;
																if(returnPerformerRelatedPerson.err_code > 0){
																	res.json(returnPerformerRelatedPerson);	
																	console.log("add reference Performer related person : " + performerRelatedPerson);
																}
															});
														}
														
														res.json({"err_code": 0, "err_msg": "Observation has been add.", "data": [{"_id": observationId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
status|observation-status
category|observation-category
code|observation-codes
componentCode|observation-codes
dataAbsentReason|observation-valueabsentreason
componentDataAbsentReason|observation-valueabsentreason
interpretation|observation-interpretation
componentInterpretation|observation-interpretation
bodySite|body-site
method|observation-methods
referenceRangeAppliesTo|referencerange-meaning
referenceRangeType|referencerange-appliesto
relatedType|observation-relationshiptypes

										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'OBSERVATION_STATUS', function (resStatusCode) {
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
												checkCode(apikey, category, 'OBSERVATION_CATEGORY', function (resCategoryCode) {
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
												checkCode(apikey, code, 'OBSERVATION_CODES', function (resCodeCode) {
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

										myEmitter.prependOnceListener('checkComponentCode', function () {
											if (!validator.isEmpty(componentCode)) {
												checkCode(apikey, componentCode, 'OBSERVATION_CODES', function (resComponentCodeCode) {
													if (resComponentCodeCode.err_code > 0) {
														myEmitter.emit('checkCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Component code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCode');
											}
										})

										myEmitter.prependOnceListener('checkDataAbsentReason', function () {
											if (!validator.isEmpty(dataAbsentReason)) {
												checkCode(apikey, dataAbsentReason, 'OBSERVATION_VALUEABSENTREASON', function (resDataAbsentReasonCode) {
													if (resDataAbsentReasonCode.err_code > 0) {
														myEmitter.emit('checkComponentCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Data absent reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkComponentCode');
											}
										})

										myEmitter.prependOnceListener('checkComponentDataAbsentReason', function () {
											if (!validator.isEmpty(componentDataAbsentReason)) {
												checkCode(apikey, componentDataAbsentReason, 'OBSERVATION_VALUEABSENTREASON', function (resComponentDataAbsentReasonCode) {
													if (resComponentDataAbsentReasonCode.err_code > 0) {
														myEmitter.emit('checkDataAbsentReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Component data absent reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDataAbsentReason');
											}
										})

										myEmitter.prependOnceListener('checkInterpretation', function () {
											if (!validator.isEmpty(interpretation)) {
												checkCode(apikey, interpretation, 'OBSERVATION_INTERPRETATION', function (resInterpretationCode) {
													if (resInterpretationCode.err_code > 0) {
														myEmitter.emit('checkComponentDataAbsentReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Interpretation code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkComponentDataAbsentReason');
											}
										})

										myEmitter.prependOnceListener('checkComponentInterpretation', function () {
											if (!validator.isEmpty(componentInterpretation)) {
												checkCode(apikey, componentInterpretation, 'OBSERVATION_INTERPRETATION', function (resComponentInterpretationCode) {
													if (resComponentInterpretationCode.err_code > 0) {
														myEmitter.emit('checkInterpretation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Component interpretation code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInterpretation');
											}
										})

										myEmitter.prependOnceListener('checkBodySite', function () {
											if (!validator.isEmpty(bodySite)) {
												checkCode(apikey, bodySite, 'BODY_SITE', function (resBodySiteCode) {
													if (resBodySiteCode.err_code > 0) {
														myEmitter.emit('checkComponentInterpretation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Body site code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkComponentInterpretation');
											}
										})

										myEmitter.prependOnceListener('checkMethod', function () {
											if (!validator.isEmpty(method)) {
												checkCode(apikey, method, 'OBSERVATION_METHODS', function (resMethodCode) {
													if (resMethodCode.err_code > 0) {
														myEmitter.emit('checkBodySite');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Method code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBodySite');
											}
										})

										myEmitter.prependOnceListener('checkReferenceRangeAppliesTo', function () {
											if (!validator.isEmpty(referenceRangeAppliesTo)) {
												checkCode(apikey, referenceRangeAppliesTo, 'REFERENCERANGE_MEANING', function (resReferenceRangeAppliesToCode) {
													if (resReferenceRangeAppliesToCode.err_code > 0) {
														myEmitter.emit('checkMethod');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reference range applies to code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkMethod');
											}
										})

										myEmitter.prependOnceListener('checkReferenceRangeType', function () {
											if (!validator.isEmpty(referenceRangeType)) {
												checkCode(apikey, referenceRangeType, 'REFERENCERANGE_APPLIESTO', function (resReferenceRangeTypeCode) {
													if (resReferenceRangeTypeCode.err_code > 0) {
														myEmitter.emit('checkReferenceRangeAppliesTo');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reference range type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReferenceRangeAppliesTo');
											}
										})

										myEmitter.prependOnceListener('checkRelatedType', function () {
											if (!validator.isEmpty(relatedType)) {
												checkCode(apikey, relatedType, 'OBSERVATION_RELATIONSHIPTYPES', function (resRelatedTypeCode) {
													if (resRelatedTypeCode.err_code > 0) {
														myEmitter.emit('checkReferenceRangeType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Related type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReferenceRangeType');
											}
										})			
										
										//cek value
										/*
basedOnCarePlan|CarePlan
basedOnDeviceRequest|Device_Request
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
performerPractitioner|Practitioner
performerOrganization|Organization
performerPatient|Patient
performerRelatedPerson|Related_Person
specimen|Specimen
deviceDevice|Device
deviceDeviceMetric|Device_Metric
relatedTargetObservation|Observation
relatedTargetQuestionnaireResponse|Questionnaire_Response
relatedTargetSequence|Sequence
*/
										myEmitter.prependOnceListener('checkBasedOnCarePlan', function () {
											if (!validator.isEmpty(basedOnCarePlan)) {
												checkUniqeValue(apikey, "CAREPLAN_ID|" + basedOnCarePlan, 'CAREPLAN', function (resBasedOnCarePlan) {
													if (resBasedOnCarePlan.err_code > 0) {
														myEmitter.emit('checkRelatedType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on care plan id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRelatedType');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnDeviceRequest', function () {
											if (!validator.isEmpty(basedOnDeviceRequest)) {
												checkUniqeValue(apikey, "DEVICE_REQUEST_ID|" + basedOnDeviceRequest, 'DEVICE_REQUEST', function (resBasedOnDeviceRequest) {
													if (resBasedOnDeviceRequest.err_code > 0) {
														myEmitter.emit('checkBasedOnCarePlan');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on device request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnCarePlan');
											}
										})

										myEmitter.prependOnceListener('checkBasedOnImmunizationRecommendation', function () {
											if (!validator.isEmpty(basedOnImmunizationRecommendation)) {
												checkUniqeValue(apikey, "IMMUNIZATION_RECOMMENDATION_ID|" + basedOnImmunizationRecommendation, 'IMMUNIZATION_RECOMMENDATION', function (resBasedOnImmunizationRecommendation) {
													if (resBasedOnImmunizationRecommendation.err_code > 0) {
														myEmitter.emit('checkBasedOnDeviceRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Based on immunization recommendation id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBasedOnDeviceRequest');
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

										myEmitter.prependOnceListener('checkPerformerPractitioner', function () {
											if (!validator.isEmpty(performerPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + performerPractitioner, 'PRACTITIONER', function (resPerformerPractitioner) {
													if (resPerformerPractitioner.err_code > 0) {
														myEmitter.emit('checkContextEpisodeOfCare');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkContextEpisodeOfCare');
											}
										})

										myEmitter.prependOnceListener('checkPerformerOrganization', function () {
											if (!validator.isEmpty(performerOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + performerOrganization, 'ORGANIZATION', function (resPerformerOrganization) {
													if (resPerformerOrganization.err_code > 0) {
														myEmitter.emit('checkPerformerPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkPerformerPatient', function () {
											if (!validator.isEmpty(performerPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + performerPatient, 'PATIENT', function (resPerformerPatient) {
													if (resPerformerPatient.err_code > 0) {
														myEmitter.emit('checkPerformerOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerOrganization');
											}
										})

										myEmitter.prependOnceListener('checkPerformerRelatedPerson', function () {
											if (!validator.isEmpty(performerRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + performerRelatedPerson, 'RELATED_PERSON', function (resPerformerRelatedPerson) {
													if (resPerformerRelatedPerson.err_code > 0) {
														myEmitter.emit('checkPerformerPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Performer related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerPatient');
											}
										})

										myEmitter.prependOnceListener('checkSpecimen', function () {
											if (!validator.isEmpty(specimen)) {
												checkUniqeValue(apikey, "SPECIMEN_ID|" + specimen, 'SPECIMEN', function (resSpecimen) {
													if (resSpecimen.err_code > 0) {
														myEmitter.emit('checkPerformerRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Specimen id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPerformerRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkDeviceDevice', function () {
											if (!validator.isEmpty(deviceDevice)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + deviceDevice, 'DEVICE', function (resDeviceDevice) {
													if (resDeviceDevice.err_code > 0) {
														myEmitter.emit('checkSpecimen');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Device device id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSpecimen');
											}
										})

										myEmitter.prependOnceListener('checkDeviceDeviceMetric', function () {
											if (!validator.isEmpty(deviceDeviceMetric)) {
												checkUniqeValue(apikey, "DEVICE_METRIC_ID|" + deviceDeviceMetric, 'DEVICE_METRIC', function (resDeviceDeviceMetric) {
													if (resDeviceDeviceMetric.err_code > 0) {
														myEmitter.emit('checkDeviceDevice');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Device device metric id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDeviceDevice');
											}
										})

										myEmitter.prependOnceListener('checkRelatedTargetObservation', function () {
											if (!validator.isEmpty(relatedTargetObservation)) {
												checkUniqeValue(apikey, "OBSERVATION_ID|" + relatedTargetObservation, 'OBSERVATION', function (resRelatedTargetObservation) {
													if (resRelatedTargetObservation.err_code > 0) {
														myEmitter.emit('checkDeviceDeviceMetric');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Related target observation id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDeviceDeviceMetric');
											}
										})

										myEmitter.prependOnceListener('checkRelatedTargetQuestionnaireResponse', function () {
											if (!validator.isEmpty(relatedTargetQuestionnaireResponse)) {
												checkUniqeValue(apikey, "QUESTIONNAIRE_RESPONSE_ID|" + relatedTargetQuestionnaireResponse, 'QUESTIONNAIRE_RESPONSE', function (resRelatedTargetQuestionnaireResponse) {
													if (resRelatedTargetQuestionnaireResponse.err_code > 0) {
														myEmitter.emit('checkRelatedTargetObservation');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Related target questionnaire response id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRelatedTargetObservation');
											}
										})

										if (!validator.isEmpty(relatedTargetSequence)) {
											checkUniqeValue(apikey, "SEQUENCE_ID|" + relatedTargetSequence, 'SEQUENCE', function (resRelatedTargetSequence) {
												if (resRelatedTargetSequence.err_code > 0) {
													myEmitter.emit('checkRelatedTargetQuestionnaireResponse');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Related target sequence id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkRelatedTargetQuestionnaireResponse');
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
			var observationId = req.params.observation_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof observationId !== 'undefined'){
				if(validator.isEmpty(observationId)){
					err_code = 2;
					err_msg = "Observation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation id is required";
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
												checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservationID){
													if(resObservationID.err_code > 0){
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
																							"observation_id": observationId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this Observation.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Observation Id not found"});		
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
		observationRelated: function addObservationRelated(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var observationId = req.params.observation_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof observationId !== 'undefined'){
				if(validator.isEmpty(observationId)){
					err_code = 2;
					err_msg = "Observation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation id is required";
			}
			
			if(typeof req.body.type !== 'undefined'){
				var relatedType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(relatedType)){
					relatedType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'related type' in json Observation request.";
			}

			if(typeof req.body.target.observation !== 'undefined'){
				var relatedTargetObservation =  req.body.target.observation.trim().toLowerCase();
				if(validator.isEmpty(relatedTargetObservation)){
					relatedTargetObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'related target observation' in json Observation request.";
			}

			if(typeof req.body.target.questionnaireResponse !== 'undefined'){
				var relatedTargetQuestionnaireResponse =  req.body.target.questionnaireResponse.trim().toLowerCase();
				if(validator.isEmpty(relatedTargetQuestionnaireResponse)){
					relatedTargetQuestionnaireResponse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'related target questionnaire response' in json Observation request.";
			}

			if(typeof req.body.target.sequence !== 'undefined'){
				var relatedTargetSequence =  req.body.target.sequence.trim().toLowerCase();
				if(validator.isEmpty(relatedTargetSequence)){
					relatedTargetSequence = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'related target sequence' in json Observation request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkObservationID', function(){
							checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservationID){
								if(resObservationID.err_code > 0){
									var unicId = uniqid.time();
									var observationRelatedId = 'obr' + unicId;
									//ObservationRelated
									dataObservationRelated = {
										"related_id" : observationRelatedId,
										"type" : relatedType,
										"target_observation" : relatedTargetObservation,
										"target_questionnaire_response" : relatedTargetQuestionnaireResponse,
										"target_sequence" : relatedTargetSequence,
										"observation_id" : observationId
									}
									ApiFHIR.post('observationRelated', {"apikey": apikey}, {body: dataObservationRelated, json: true}, function(error, response, body){
										observationRelated = body;
										if(observationRelated.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Observation Related has been add in this Observation.", "data": observationRelated.data});
										}else{
											res.json(observationRelated);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Observation Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkRelatedType', function () {
							if (!validator.isEmpty(relatedType)) {
								checkCode(apikey, relatedType, 'OBSERVATION_RELATIONSHIPTYPES', function (resRelatedTypeCode) {
									if (resRelatedTypeCode.err_code > 0) {
										myEmitter.emit('checkObservationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Related type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkObservationID');
							}
						})
						
						myEmitter.prependOnceListener('checkRelatedTargetObservation', function () {
							if (!validator.isEmpty(relatedTargetObservation)) {
								checkUniqeValue(apikey, "OBSERVATION_ID|" + relatedTargetObservation, 'OBSERVATION', function (resRelatedTargetObservation) {
									if (resRelatedTargetObservation.err_code > 0) {
										myEmitter.emit('checkRelatedType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Related target observation id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRelatedType');
							}
						})

						myEmitter.prependOnceListener('checkRelatedTargetQuestionnaireResponse', function () {
							if (!validator.isEmpty(relatedTargetQuestionnaireResponse)) {
								checkUniqeValue(apikey, "QUESTIONNAIRE_RESPONSE_ID|" + relatedTargetQuestionnaireResponse, 'QUESTIONNAIRE_RESPONSE', function (resRelatedTargetQuestionnaireResponse) {
									if (resRelatedTargetQuestionnaireResponse.err_code > 0) {
										myEmitter.emit('checkRelatedTargetObservation');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Related target questionnaire response id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRelatedTargetObservation');
							}
						})

						if (!validator.isEmpty(relatedTargetSequence)) {
							checkUniqeValue(apikey, "SEQUENCE_ID|" + relatedTargetSequence, 'SEQUENCE', function (resRelatedTargetSequence) {
								if (resRelatedTargetSequence.err_code > 0) {
									myEmitter.emit('checkRelatedTargetQuestionnaireResponse');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Related target sequence id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRelatedTargetQuestionnaireResponse');
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
		observationComponent: function addObservationComponent(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var observationId = req.params.observation_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof observationId !== 'undefined'){
				if(validator.isEmpty(observationId)){
					err_code = 2;
					err_msg = "Observation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation id is required";
			}
			
			if(typeof req.body.code !== 'undefined'){
				var componentCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(componentCode)){
					err_code = 2;
					err_msg = "Observation component code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component code' in json Observation request.";
			}

			if(typeof req.body.dataAbsentReason !== 'undefined'){
				var componentDataAbsentReason =  req.body.dataAbsentReason.trim().toLowerCase();
				if(validator.isEmpty(componentDataAbsentReason)){
					componentDataAbsentReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component data absent reason' in json Observation request.";
			}

			if(typeof req.body.interpretation !== 'undefined'){
				var componentInterpretation =  req.body.interpretation.trim().toUpperCase();
				if(validator.isEmpty(componentInterpretation)){
					componentInterpretation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component interpretation' in json Observation request.";
			}

			if(typeof req.body.value.valueQuantity !== 'undefined'){
				var componentValueValueQuantity =  req.body.value.valueQuantity;
				if(validator.isEmpty(componentValueValueQuantity)){
					componentValueValueQuantity = "";
				}else{
					if(!validator.isInt(componentValueValueQuantity)){
						err_code = 2;
						err_msg = "Observation component value value quantity is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value quantity' in json Observation request.";
			}

			if(typeof req.body.value.valueCodeableConcept !== 'undefined'){
				var componentValueValueCodeableConcept =  req.body.value.valueCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueCodeableConcept)){
					componentValueValueCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value codeable concept' in json Observation request.";
			}

			if(typeof req.body.value.valueString !== 'undefined'){
				var componentValueValueString =  req.body.value.valueString.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueString)){
					componentValueValueString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value string' in json Observation request.";
			}

			if (typeof req.body.value.valueRange !== 'undefined') {
			  var componentValueValueRange = req.body.value.valueRange;
 				if(validator.isEmpty(componentValueValueRange)){
				  var componentValueValueRangeLow = "";
				  var componentValueValueRangeHigh = "";
				} else {
				  if (componentValueValueRange.indexOf("to") > 0) {
				    arrComponentValueValueRange = componentValueValueRange.split("to");
				    var componentValueValueRangeLow = arrComponentValueValueRange[0];
				    var componentValueValueRangeHigh = arrComponentValueValueRange[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Observation component value value range invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'component value value range' in json Observation request.";
			}

			if (typeof req.body.value.valueRatio !== 'undefined') {
			  var componentValueValueRatio = req.body.value.valueRatio;
 				if(validator.isEmpty(componentValueValueRatio)){
				  var componentValueValueRatioNumerator = "";
				  var componentValueValueRatioDenominator = "";
				} else {
				  if (componentValueValueRatio.indexOf("to") > 0) {
				    arrComponentValueValueRatio = componentValueValueRatio.split("to");
				    var componentValueValueRatioNumerator = arrComponentValueValueRatio[0];
				    var componentValueValueRatioDenominator = arrComponentValueValueRatio[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Observation component value value ratio invalid ratio format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'component value value ratio' in json Observation request.";
			}

			if(typeof req.body.value.valueSampledData.origin !== 'undefined'){
				var componentValueValueSampledDataOrigin =  req.body.value.valueSampledData.origin;
				if(validator.isEmpty(componentValueValueSampledDataOrigin)){
					componentValueValueSampledDataOrigin = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataOrigin)){
						err_code = 2;
						err_msg = "Observation component value value sampled data origin is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value sampled data origin' in json Observation request.";
			}

			if(typeof req.body.value.valueSampledData.period !== 'undefined'){
				var componentValueValueSampledDataPeriod =  req.body.value.valueSampledData.period;
				if(validator.isEmpty(componentValueValueSampledDataPeriod)){
					componentValueValueSampledDataPeriod = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataPeriod)){
						err_code = 2;
						err_msg = "Observation component value value sampled data period is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value sampled data period' in json Observation request.";
			}

			if(typeof req.body.value.valueSampledData.factor !== 'undefined'){
				var componentValueValueSampledDataFactor =  req.body.value.valueSampledData.factor;
				if(validator.isEmpty(componentValueValueSampledDataFactor)){
					componentValueValueSampledDataFactor = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataFactor)){
						err_code = 2;
						err_msg = "Observation component value value sampled data factor is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value sampled data factor' in json Observation request.";
			}

			if(typeof req.body.value.valueSampledData.lowerLimit !== 'undefined'){
				var componentValueValueSampledDataLowerLimit =  req.body.value.valueSampledData.lowerLimit;
				if(validator.isEmpty(componentValueValueSampledDataLowerLimit)){
					componentValueValueSampledDataLowerLimit = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataLowerLimit)){
						err_code = 2;
						err_msg = "Observation component value value sampled data lower limit is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value sampled data lower limit' in json Observation request.";
			}

			if(typeof req.body.value.valueSampledData.upperLimit !== 'undefined'){
				var componentValueValueSampledDataUpperLimit =  req.body.value.valueSampledData.upperLimit;
				if(validator.isEmpty(componentValueValueSampledDataUpperLimit)){
					componentValueValueSampledDataUpperLimit = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataUpperLimit)){
						err_code = 2;
						err_msg = "Observation component value value sampled data upper limit is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value sampled data upper limit' in json Observation request.";
			}

			if(typeof req.body.value.valueSampledData.dimensions !== 'undefined'){
				var componentValueValueSampledDataDimensions =  req.body.value.valueSampledData.dimensions;
				if(validator.isEmpty(componentValueValueSampledDataDimensions)){
					componentValueValueSampledDataDimensions = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataDimensions)){
						err_code = 2;
						err_msg = "Observation component value value sampled data dimensions is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value sampled data dimensions' in json Observation request.";
			}

			if(typeof req.body.value.valueSampledData.data !== 'undefined'){
				var componentValueValueSampledDataData =  req.body.value.valueSampledData.data.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueSampledDataData)){
					componentValueValueSampledDataData = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value sampled data data' in json Observation request.";
			}

			if(typeof req.body.value.valueAttachment.contentType !== 'undefined'){
				var componentValueValueAttachmentContentType =  req.body.value.valueAttachment.contentType.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueAttachmentContentType)){
					componentValueValueAttachmentContentType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value attachment content type' in json Observation request.";
			}

			if(typeof req.body.value.valueAttachment.language !== 'undefined'){
				var componentValueValueAttachmentLanguage =  req.body.value.valueAttachment.language.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueAttachmentLanguage)){
					componentValueValueAttachmentLanguage = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value attachment language' in json Observation request.";
			}

			if(typeof req.body.value.valueAttachment.data !== 'undefined'){
				var componentValueValueAttachmentData =  req.body.value.valueAttachment.data.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueAttachmentData)){
					componentValueValueAttachmentData = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value attachment data' in json Observation request.";
			}

			if(typeof req.body.value.valueAttachment.size !== 'undefined'){
				var componentValueValueAttachmentSize =  req.body.value.valueAttachment.size;
				if(validator.isEmpty(componentValueValueAttachmentSize)){
					componentValueValueAttachmentSize = "";
				}else{
					if(!validator.isInt(componentValueValueAttachmentSize)){
						err_code = 2;
						err_msg = "Observation component value value attachment size is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value attachment size' in json Observation request.";
			}

			if(typeof req.body.value.valueAttachment.title !== 'undefined'){
				var componentValueValueAttachmentTitle =  req.body.value.valueAttachment.title.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueAttachmentTitle)){
					componentValueValueAttachmentTitle = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value attachment title' in json Observation request.";
			}

			if(typeof req.body.value.valueTime !== 'undefined'){
				var componentValueValueTime =  req.body.value.valueTime;
				if(validator.isEmpty(componentValueValueTime)){
					componentValueValueTime = "";
				}else{
					if(!regex.test(componentValueValueTime)){
						err_code = 2;
						err_msg = "Observation component value value time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value time' in json Observation request.";
			}

			if(typeof req.body.value.valueDateTime !== 'undefined'){
				var componentValueValueDateTime =  req.body.value.valueDateTime;
				if(validator.isEmpty(componentValueValueDateTime)){
					componentValueValueDateTime = "";
				}else{
					if(!regex.test(componentValueValueDateTime)){
						err_code = 2;
						err_msg = "Observation component value value date time invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'component value value date time' in json Observation request.";
			}

			if (typeof req.body.value.valuePeriod !== 'undefined') {
			  var componentValueValuePeriod = req.body.value.valuePeriod;
 				if(validator.isEmpty(componentValueValuePeriod)) {
				  var componentValueValuePeriodStart = "";
				  var componentValueValuePeriodEnd = "";
				} else {
				  if (componentValueValuePeriod.indexOf("to") > 0) {
				    arrComponentValueValuePeriod = componentValueValuePeriod.split("to");
				    var componentValueValuePeriodStart = arrComponentValueValuePeriod[0];
				    var componentValueValuePeriodEnd = arrComponentValueValuePeriod[1];
				    if (!regex.test(componentValueValuePeriodStart) && !regex.test(componentValueValuePeriodEnd)) {
				      err_code = 2;
				      err_msg = "Observation component value value period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Observation component value value period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'component value value period' in json Observation request.";
			}
			
			if(typeof req.body.referenceRange.low !== 'undefined'){
				var referenceRangeLow =  req.body.referenceRange.low;
				if(validator.isEmpty(referenceRangeLow)){
					referenceRangeLow = "";
				}else{
					if(!validator.isInt(referenceRangeLow)){
						err_code = 2;
						err_msg = "Observation Component reference range low is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range low' in json Observation Component request.";
			}

			if(typeof req.body.referenceRange.high !== 'undefined'){
				var referenceRangeHigh =  req.body.referenceRange.high;
				if(validator.isEmpty(referenceRangeHigh)){
					referenceRangeHigh = "";
				}else{
					if(!validator.isInt(referenceRangeHigh)){
						err_code = 2;
						err_msg = "Observation Component reference range high is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range high' in json Observation Component request.";
			}

			if(typeof req.body.referenceRange.type !== 'undefined'){
				var referenceRangeType =  req.body.referenceRange.type.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeType)){
					referenceRangeType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range type' in json Observation Component request.";
			}

			if(typeof req.body.referenceRange.appliesTo !== 'undefined'){
				var referenceRangeAppliesTo =  req.body.referenceRange.appliesTo.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeAppliesTo)){
					referenceRangeAppliesTo = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range applies to' in json Observation Component request.";
			}

			if (typeof req.body.referenceRange.age !== 'undefined') {
			  var referenceRangeAge = req.body.referenceRange.age;
 				if(validator.isEmpty(referenceRangeAge)){
				  var referenceRangeAgeLow = "";
				  var referenceRangeAgeHigh = "";
				} else {
				  if (referenceRangeAge.indexOf("to") > 0) {
				    arrReferenceRangeAge = referenceRangeAge.split("to");
				    var referenceRangeAgeLow = arrReferenceRangeAge[0];
				    var referenceRangeAgeHigh = arrReferenceRangeAge[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Observation Component reference range age invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'reference range age' in json Observation Component request.";
			}

			if(typeof req.body.referenceRange.text !== 'undefined'){
				var referenceRangeText =  req.body.referenceRange.text.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeText)){
					referenceRangeText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range text' in json Observation Component request.";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkObservationID', function(){
							checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservationID){
								if(resObservationID.err_code > 0){
									var unicId = uniqid.time();
									var observationComponentId = 'obc' + unicId;
									var attachment2Id = 'at2' + uniqid.time();
									var observationSampleData2Id = 'sd2' + uniqid.time();
									var observationReferenceRangeId = 'orr' + unicId;
									
									//ObservationComponent
									var dataValueAttachmentComponent = {
										"id": attachment2Id,
										"content_type": componentValueValueAttachmentContentType,
										"language": componentValueValueAttachmentLanguage,
										"data": componentValueValueAttachmentData,
										"size": componentValueValueAttachmentSize,
										"hash": sha1(componentValueValueAttachmentData),
										"title": componentValueValueAttachmentTitle,
										"creation": getFormattedDate(),
										"url": attachment2Id,
										"component_id" : observationComponentId
									}
									//method, endpoint, params, options, callback
									ApiFHIR.post('attachment', {"apikey": apikey}, {body: dataValueAttachmentComponent, json:true}, function(error, response, body){
										ValueAttachment = body;
										if(ValueAttachment.err_code > 0){
											res.json(ValueAttachment);	
											console.log("ok");
										}
									});	

									var dataObservationSampledDataComponent = {
										"sampled_data_id": observationSampleData2Id,
										"origin": componentValueValueSampledDataOrigin,
										"period": componentValueValueSampledDataPeriod,
										"factor": componentValueValueSampledDataFactor,
										"lower_limit": componentValueValueSampledDataLowerLimit,
										"upper_limit": componentValueValueSampledDataUpperLimit,
										"dimensions": componentValueValueSampledDataDimensions,
										"data": componentValueValueSampledDataData,
										"component_id" : observationComponentId
									}

									//method, endpoint, params, options, callback
									ApiFHIR.post('observationSampledData', {"apikey": apikey}, {body: dataObservationSampledDataComponent, json:true}, function(error, response, body){
										observationSampledData = body;
										if(observationSampledData.err_code > 0){
											res.json(observationSampledData);	
											console.log("ok");
										}
									});
									
									//ObservationReferenceRange
									dataObservationReferenceRange = {
										"reference_range_id" : observationReferenceRangeId,
										"low" : referenceRangeLow,
										"high" : referenceRangeHigh,
										"type" : referenceRangeType,
										"applies_to" : referenceRangeAppliesTo,
										"age_low" : referenceRangeAgeLow,
										"age_high" : referenceRangeAgeHigh,
										"text" : referenceRangeText,
										"component_id" : observationComponentId
									}
									ApiFHIR.post('observationReferenceRange', {"apikey": apikey}, {body: dataObservationReferenceRange, json: true}, function(error, response, body){
										observationReferenceRange = body;
										if(observationReferenceRange.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Observation Reference Range has been add in this Observation.", "data": observationReferenceRange.data});
										}else{
											res.json(observationReferenceRange);	
										}
									});
									
									dataObservationComponent = {
										"component_id" : observationComponentId,
										"code" : componentCode,
										"value_quantity" : componentValueValueQuantity,
										"value_codeable_concept" : componentValueValueCodeableConcept,
										"value_string" : componentValueValueString,
										"value_range_low" : componentValueValueRangeLow,
										"value_range_high" : componentValueValueRangeHigh,
										"value_ratio_numerator" : componentValueValueRatioNumerator,
										"value_ratio_denominator" : componentValueValueRatioDenominator,
										"value_sampled_data" : observationComponentId,
										"value_attachment" : observationComponentId,
										"value_time" : componentValueValueTime,
										"value_date_time" : componentValueValueDateTime,
										"value_period_start" : componentValueValuePeriodStart,
										"value_period_end" : componentValueValuePeriodEnd,
										"data_absent_reason" : componentDataAbsentReason,
										"interpretation" : componentInterpretation,
										"observation_id" : observationId
									}
									ApiFHIR.post('observationComponent', {"apikey": apikey}, {body: dataObservationComponent, json: true}, function(error, response, body){
										observationComponent = body;
										if(observationComponent.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Observation Component has been add in this Observation.", "data": observationComponent.data});
										}else{
											res.json(observationComponent);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Observation Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkComponentCode', function () {
							if (!validator.isEmpty(componentCode)) {
								checkCode(apikey, componentCode, 'OBSERVATION_CODES', function (resComponentCodeCode) {
									if (resComponentCodeCode.err_code > 0) {
										myEmitter.emit('checkObservationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Component code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkObservationID');
							}
						})

						myEmitter.prependOnceListener('checkComponentDataAbsentReason', function () {
							if (!validator.isEmpty(componentDataAbsentReason)) {
								checkCode(apikey, componentDataAbsentReason, 'OBSERVATION_VALUEABSENTREASON', function (resComponentDataAbsentReasonCode) {
									if (resComponentDataAbsentReasonCode.err_code > 0) {
										myEmitter.emit('checkComponentCode');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Component data absent reason code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkComponentCode');
							}
						})

						myEmitter.prependOnceListener('checkComponentInterpretation', function () {
							if (!validator.isEmpty(componentInterpretation)) {
								checkCode(apikey, componentInterpretation, 'OBSERVATION_INTERPRETATION', function (resComponentInterpretationCode) {
									if (resComponentInterpretationCode.err_code > 0) {
										myEmitter.emit('checkComponentDataAbsentReason');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Component interpretation code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkComponentDataAbsentReason');
							}
						})
						
						myEmitter.prependOnceListener('checkReferenceRangeAppliesTo', function () {
							if (!validator.isEmpty(referenceRangeAppliesTo)) {
								checkCode(apikey, referenceRangeAppliesTo, 'REFERENCERANGE_MEANING', function (resReferenceRangeAppliesToCode) {
									if (resReferenceRangeAppliesToCode.err_code > 0) {
										myEmitter.emit('checkComponentInterpretation');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Reference range applies to code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkComponentInterpretation');
							}
						})

						if (!validator.isEmpty(referenceRangeType)) {
							checkCode(apikey, referenceRangeType, 'REFERENCERANGE_APPLIESTO', function (resReferenceRangeTypeCode) {
								if (resReferenceRangeTypeCode.err_code > 0) {
									myEmitter.emit('checkReferenceRangeAppliesTo');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Reference range type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkReferenceRangeAppliesTo');
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
		observationReferenceRange: function addObservationReferenceRange(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var observationId = req.params.observation_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof observationId !== 'undefined'){
				if(validator.isEmpty(observationId)){
					err_code = 2;
					err_msg = "Observation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation id is required";
			}
			
			if(typeof req.body.low !== 'undefined'){
				var referenceRangeLow =  req.body.low;
				if(validator.isEmpty(referenceRangeLow)){
					referenceRangeLow = "";
				}else{
					if(!validator.isInt(referenceRangeLow)){
						err_code = 2;
						err_msg = "Observation reference range low is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range low' in json Observation request.";
			}

			if(typeof req.body.high !== 'undefined'){
				var referenceRangeHigh =  req.body.high;
				if(validator.isEmpty(referenceRangeHigh)){
					referenceRangeHigh = "";
				}else{
					if(!validator.isInt(referenceRangeHigh)){
						err_code = 2;
						err_msg = "Observation reference range high is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range high' in json Observation request.";
			}

			if(typeof req.body.type !== 'undefined'){
				var referenceRangeType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeType)){
					referenceRangeType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range type' in json Observation request.";
			}

			if(typeof req.body.appliesTo !== 'undefined'){
				var referenceRangeAppliesTo =  req.body.appliesTo.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeAppliesTo)){
					referenceRangeAppliesTo = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range applies to' in json Observation request.";
			}

			if (typeof req.body.age !== 'undefined') {
			  var referenceRangeAge = req.body.age;
 				if(validator.isEmpty(referenceRangeAge)){
				  var referenceRangeAgeLow = "";
				  var referenceRangeAgeHigh = "";
				} else {
				  if (referenceRangeAge.indexOf("to") > 0) {
				    arrReferenceRangeAge = referenceRangeAge.split("to");
				    var referenceRangeAgeLow = arrReferenceRangeAge[0];
				    var referenceRangeAgeHigh = arrReferenceRangeAge[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Observation reference range age invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'reference range age' in json Observation request.";
			}

			if(typeof req.body.text !== 'undefined'){
				var referenceRangeText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeText)){
					referenceRangeText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range text' in json Observation request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkObservationID', function(){
							checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservationID){
								if(resObservationID.err_code > 0){
									var unicId = uniqid.time();
									var observationReferenceRangeId = 'orr' + unicId;
									//ObservationReferenceRange
									dataObservationReferenceRange = {
										"reference_range_id" : observationReferenceRangeId,
										"low" : referenceRangeLow,
										"high" : referenceRangeHigh,
										"type" : referenceRangeType,
										"applies_to" : referenceRangeAppliesTo,
										"age_low" : referenceRangeAgeLow,
										"age_high" : referenceRangeAgeHigh,
										"text" : referenceRangeText,
										"observation_id" : observationId
									}
									ApiFHIR.post('observationReferenceRange', {"apikey": apikey}, {body: dataObservationReferenceRange, json: true}, function(error, response, body){
										observationReferenceRange = body;
										if(observationReferenceRange.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Observation Reference Range has been add in this Observation.", "data": observationReferenceRange.data});
										}else{
											res.json(observationReferenceRange);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Observation Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkReferenceRangeAppliesTo', function () {
							if (!validator.isEmpty(referenceRangeAppliesTo)) {
								checkCode(apikey, referenceRangeAppliesTo, 'REFERENCERANGE_MEANING', function (resReferenceRangeAppliesToCode) {
									if (resReferenceRangeAppliesToCode.err_code > 0) {
										myEmitter.emit('checkObservationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Reference range applies to code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkObservationID');
							}
						})

						if (!validator.isEmpty(referenceRangeType)) {
							checkCode(apikey, referenceRangeType, 'REFERENCERANGE_APPLIESTO', function (resReferenceRangeTypeCode) {
								if (resReferenceRangeTypeCode.err_code > 0) {
									myEmitter.emit('checkReferenceRangeAppliesTo');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Reference range type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkReferenceRangeAppliesTo');
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
		observationComponentReferenceRange: function addObservationComponentReferenceRange(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var observationComponentId = req.params.observation_component_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof observationComponentId !== 'undefined'){
				if(validator.isEmpty(observationComponentId)){
					err_code = 2;
					err_msg = "Observation Component id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation Component id is required";
			}
			
			if(typeof req.body.low !== 'undefined'){
				var referenceRangeLow =  req.body.low;
				if(validator.isEmpty(referenceRangeLow)){
					referenceRangeLow = "";
				}else{
					if(!validator.isInt(referenceRangeLow)){
						err_code = 2;
						err_msg = "Observation Component reference range low is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range low' in json Observation Component request.";
			}

			if(typeof req.body.high !== 'undefined'){
				var referenceRangeHigh =  req.body.high;
				if(validator.isEmpty(referenceRangeHigh)){
					referenceRangeHigh = "";
				}else{
					if(!validator.isInt(referenceRangeHigh)){
						err_code = 2;
						err_msg = "Observation Component reference range high is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range high' in json Observation Component request.";
			}

			if(typeof req.body.type !== 'undefined'){
				var referenceRangeType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeType)){
					referenceRangeType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range type' in json Observation Component request.";
			}

			if(typeof req.body.appliesTo !== 'undefined'){
				var referenceRangeAppliesTo =  req.body.appliesTo.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeAppliesTo)){
					referenceRangeAppliesTo = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range applies to' in json Observation Component request.";
			}

			if (typeof req.body.age !== 'undefined') {
			  var referenceRangeAge = req.body.age;
 				if(validator.isEmpty(referenceRangeAge)){
				  var referenceRangeAgeLow = "";
				  var referenceRangeAgeHigh = "";
				} else {
				  if (referenceRangeAge.indexOf("to") > 0) {
				    arrReferenceRangeAge = referenceRangeAge.split("to");
				    var referenceRangeAgeLow = arrReferenceRangeAge[0];
				    var referenceRangeAgeHigh = arrReferenceRangeAge[1];
					} else {
				  	err_code = 2;
				  	err_msg = "Observation Component reference range age invalid range format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'reference range age' in json Observation Component request.";
			}

			if(typeof req.body.text !== 'undefined'){
				var referenceRangeText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeText)){
					referenceRangeText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reference range text' in json Observation Component request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkObservationID', function(){
							checkUniqeValue(apikey, "component_id|" + observationComponentId, 'observation_component', function(resObservationID){
								if(resObservationID.err_code > 0){
									var unicId = uniqid.time();
									var observationComponentReferenceRangeId = 'ocr' + unicId;
									//ObservationComponentReferenceRange
									dataObservationComponentReferenceRange = {
										"reference_range_id" : observationComponentReferenceRangeId,
										"low" : referenceRangeLow,
										"high" : referenceRangeHigh,
										"type" : referenceRangeType,
										"applies_to" : referenceRangeAppliesTo,
										"age_low" : referenceRangeAgeLow,
										"age_high" : referenceRangeAgeHigh,
										"text" : referenceRangeText,
										"component_id" : observationComponentId
									}
									ApiFHIR.post('observationReferenceRange', {"apikey": apikey}, {body: dataObservationComponentReferenceRange, json: true}, function(error, response, body){
										observationComponentReferenceRange = body;
										if(observationComponentReferenceRange.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Observation Reference Range has been add in this Observation Component.", "data": observationComponentReferenceRange.data});
										}else{
											res.json(observationComponentReferenceRange);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Observation Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkReferenceRangeAppliesTo', function () {
							if (!validator.isEmpty(referenceRangeAppliesTo)) {
								checkCode(apikey, referenceRangeAppliesTo, 'REFERENCERANGE_MEANING', function (resReferenceRangeAppliesToCode) {
									if (resReferenceRangeAppliesToCode.err_code > 0) {
										myEmitter.emit('checkObservationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Reference range applies to code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkObservationID');
							}
						})

						if (!validator.isEmpty(referenceRangeType)) {
							checkCode(apikey, referenceRangeType, 'REFERENCERANGE_APPLIESTO', function (resReferenceRangeTypeCode) {
								if (resReferenceRangeTypeCode.err_code > 0) {
									myEmitter.emit('checkReferenceRangeAppliesTo');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Reference range type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkReferenceRangeAppliesTo');
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
		observation : function putObservation(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var observationId = req.params.observation_id;

      var err_code = 0;
      var err_msg = "";
      var dataObservation = {};

			if(typeof observationId !== 'undefined'){
				if(validator.isEmpty(observationId)){
					err_code = 2;
					err_msg = "Observation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation id is required";
			}

			/*
			var observation_id  = req.params._id;
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
			var value_quantity  = req.body.value_quantity;
			var value_codeable_concept  = req.body.value_codeable_concept;
			var value_string  = req.body.value_string;
			var value_boolean  = req.body.value_boolean;
			var value_range_low  = req.body.value_range_low;
			var value_range_high  = req.body.value_range_high;
			var value_ratio_numerator  = req.body.value_ratio_numerator;
			var value_ratio_denominator  = req.body.value_ratio_denominator;
			var value_sampled_data  = req.body.value_sampled_data;
			var value_attachment  = req.body.value_attachment;
			var value_time  = req.body.value_time;
			var value_date_time  = req.body.value_date_time;
			var value_period_start  = req.body.value_period_start;
			var value_period_end  = req.body.value_period_end;
			var data_absent_reason  = req.body.data_absent_reason;
			var interpretation  = req.body.interpretation;
			var comment  = req.body.comment;
			var body_site  = req.body.body_site;
			var method  = req.body.method;
			var specimen  = req.body.specimen;
			var device_device  = req.body.device_device;
			var device_device_metric  = req.body.device_device_metric;
			*/
			/*
			if(typeof req.body.basedOn.carePlan !== 'undefined' && req.body.basedOn.carePlan !== ""){
				var basedOnCarePlan =  req.body.basedOn.carePlan.trim().toLowerCase();
				if(validator.isEmpty(basedOnCarePlan)){
					dataObservation.care_plan = "";
				}else{
					dataObservation.care_plan = basedOnCarePlan;
				}
			}else{
			  basedOnCarePlan = "";
			}

			if(typeof req.body.basedOn.deviceRequest !== 'undefined' && req.body.basedOn.deviceRequest !== ""){
				var basedOnDeviceRequest =  req.body.basedOn.deviceRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnDeviceRequest)){
					dataObservation.device_request = "";
				}else{
					dataObservation.device_request = basedOnDeviceRequest;
				}
			}else{
			  basedOnDeviceRequest = "";
			}

			if(typeof req.body.basedOn.immunizationRecommendation !== 'undefined' && req.body.basedOn.immunizationRecommendation !== ""){
				var basedOnImmunizationRecommendation =  req.body.basedOn.immunizationRecommendation.trim().toLowerCase();
				if(validator.isEmpty(basedOnImmunizationRecommendation)){
					dataObservation.immunization_recommendation = "";
				}else{
					dataObservation.immunization_recommendation = basedOnImmunizationRecommendation;
				}
			}else{
			  basedOnImmunizationRecommendation = "";
			}

			if(typeof req.body.basedOn.medicationRequest !== 'undefined' && req.body.basedOn.medicationRequest !== ""){
				var basedOnMedicationRequest =  req.body.basedOn.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnMedicationRequest)){
					dataObservation.medication_request = "";
				}else{
					dataObservation.medication_request = basedOnMedicationRequest;
				}
			}else{
			  basedOnMedicationRequest = "";
			}

			if(typeof req.body.basedOn.nutritionOrder !== 'undefined' && req.body.basedOn.nutritionOrder !== ""){
				var basedOnNutritionOrder =  req.body.basedOn.nutritionOrder.trim().toLowerCase();
				if(validator.isEmpty(basedOnNutritionOrder)){
					dataObservation.nutrition_order = "";
				}else{
					dataObservation.nutrition_order = basedOnNutritionOrder;
				}
			}else{
			  basedOnNutritionOrder = "";
			}

			if(typeof req.body.basedOn.procedureRequest !== 'undefined' && req.body.basedOn.procedureRequest !== ""){
				var basedOnProcedureRequest =  req.body.basedOn.procedureRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnProcedureRequest)){
					dataObservation.procedure_request = "";
				}else{
					dataObservation.procedure_request = basedOnProcedureRequest;
				}
			}else{
			  basedOnProcedureRequest = "";
			}

			if(typeof req.body.basedOn.referralRequest !== 'undefined' && req.body.basedOn.referralRequest !== ""){
				var basedOnReferralRequest =  req.body.basedOn.referralRequest.trim().toLowerCase();
				if(validator.isEmpty(basedOnReferralRequest)){
					dataObservation.referral_request = "";
				}else{
					dataObservation.referral_request = basedOnReferralRequest;
				}
			}else{
			  basedOnReferralRequest = "";
			}*/

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "observation status is required.";
				}else{
					dataObservation.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var category =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(category)){
					dataObservation.category = "";
				}else{
					dataObservation.category = category;
				}
			}else{
			  category = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var code =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(code)){
					err_code = 2;
					err_msg = "observation code is required.";
				}else{
					dataObservation.code = code;
				}
			}else{
			  code = "";
			}

			if(typeof req.body.subject.patient !== 'undefined' && req.body.subject.patient !== ""){
				var subjectPatient =  req.body.subject.patient.trim().toLowerCase();
				if(validator.isEmpty(subjectPatient)){
					dataObservation.subject_patient = "";
				}else{
					dataObservation.subject_patient = subjectPatient;
				}
			}else{
			  subjectPatient = "";
			}

			if(typeof req.body.subject.group !== 'undefined' && req.body.subject.group !== ""){
				var subjectGroup =  req.body.subject.group.trim().toLowerCase();
				if(validator.isEmpty(subjectGroup)){
					dataObservation.subject_group = "";
				}else{
					dataObservation.subject_group = subjectGroup;
				}
			}else{
			  subjectGroup = "";
			}

			if(typeof req.body.subject.device !== 'undefined' && req.body.subject.device !== ""){
				var subjectDevice =  req.body.subject.device.trim().toLowerCase();
				if(validator.isEmpty(subjectDevice)){
					dataObservation.subject_device = "";
				}else{
					dataObservation.subject_device = subjectDevice;
				}
			}else{
			  subjectDevice = "";
			}

			if(typeof req.body.subject.location !== 'undefined' && req.body.subject.location !== ""){
				var subjectLocation =  req.body.subject.location.trim().toLowerCase();
				if(validator.isEmpty(subjectLocation)){
					dataObservation.subject_location = "";
				}else{
					dataObservation.subject_location = subjectLocation;
				}
			}else{
			  subjectLocation = "";
			}

			if(typeof req.body.context.encounter !== 'undefined' && req.body.context.encounter !== ""){
				var contextEncounter =  req.body.context.encounter.trim().toLowerCase();
				if(validator.isEmpty(contextEncounter)){
					dataObservation.context_encounter = "";
				}else{
					dataObservation.context_encounter = contextEncounter;
				}
			}else{
			  contextEncounter = "";
			}

			if(typeof req.body.context.episodeOfCare !== 'undefined' && req.body.context.episodeOfCare !== ""){
				var contextEpisodeOfCare =  req.body.context.episodeOfCare.trim().toLowerCase();
				if(validator.isEmpty(contextEpisodeOfCare)){
					dataObservation.context_episode_of_care = "";
				}else{
					dataObservation.context_episode_of_care = contextEpisodeOfCare;
				}
			}else{
			  contextEpisodeOfCare = "";
			}

			if(typeof req.body.effective.effectiveDateTime !== 'undefined' && req.body.effective.effectiveDateTime !== ""){
				var effectiveEffectiveDateTime =  req.body.effective.effectiveDateTime;
				if(validator.isEmpty(effectiveEffectiveDateTime)){
					err_code = 2;
					err_msg = "observation effective effective date time is required.";
				}else{
					if(!regex.test(effectiveEffectiveDateTime)){
						err_code = 2;
						err_msg = "observation effective effective date time invalid date format.";	
					}else{
						dataObservation.effective_date_time = effectiveEffectiveDateTime;
					}
				}
			}else{
			  effectiveEffectiveDateTime = "";
			}

			if (typeof req.body.effective.effectivePeriod !== 'undefined' && req.body.effective.effectivePeriod !== "") {
			  var effectiveEffectivePeriod = req.body.effective.effectivePeriod;
			  if (effectiveEffectivePeriod.indexOf("to") > 0) {
			    arrEffectiveEffectivePeriod = effectiveEffectivePeriod.split("to");
			    dataObservation.effective_period_start = arrEffectiveEffectivePeriod[0];
			    dataObservation.effective_period_end = arrEffectiveEffectivePeriod[1];
			    if (!regex.test(effectiveEffectivePeriodStart) && !regex.test(effectiveEffectivePeriodEnd)) {
			      err_code = 2;
			      err_msg = "observation effective effective period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "observation effective effective period invalid date format.";
				}
			} else {
			  effectiveEffectivePeriod = "";
			}

			if(typeof req.body.issued !== 'undefined' && req.body.issued !== ""){
				var issued =  req.body.issued;
				if(validator.isEmpty(issued)){
					err_code = 2;
					err_msg = "observation issued is required.";
				}else{
					if(!regex.test(issued)){
						err_code = 2;
						err_msg = "observation issued invalid date format.";	
					}else{
						dataObservation.issued = issued;
					}
				}
			}else{
			  issued = "";
			}
/*
			if(typeof req.body.performer.practitioner !== 'undefined' && req.body.performer.practitioner !== ""){
				var performerPractitioner =  req.body.performer.practitioner.trim().toLowerCase();
				if(validator.isEmpty(performerPractitioner)){
					dataObservation.practitioner = "";
				}else{
					dataObservation.practitioner = performerPractitioner;
				}
			}else{
			  performerPractitioner = "";
			}

			if(typeof req.body.performer.organization !== 'undefined' && req.body.performer.organization !== ""){
				var performerOrganization =  req.body.performer.organization.trim().toLowerCase();
				if(validator.isEmpty(performerOrganization)){
					dataObservation.organization = "";
				}else{
					dataObservation.organization = performerOrganization;
				}
			}else{
			  performerOrganization = "";
			}

			if(typeof req.body.performer.patient !== 'undefined' && req.body.performer.patient !== ""){
				var performerPatient =  req.body.performer.patient.trim().toLowerCase();
				if(validator.isEmpty(performerPatient)){
					dataObservation.patient = "";
				}else{
					dataObservation.patient = performerPatient;
				}
			}else{
			  performerPatient = "";
			}

			if(typeof req.body.performer.relatedPerson !== 'undefined' && req.body.performer.relatedPerson !== ""){
				var performerRelatedPerson =  req.body.performer.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(performerRelatedPerson)){
					dataObservation.related_person = "";
				}else{
					dataObservation.related_person = performerRelatedPerson;
				}
			}else{
			  performerRelatedPerson = "";
			}*/

			if(typeof req.body.value.valueQuantity !== 'undefined' && req.body.value.valueQuantity !== ""){
				var valueValueQuantity =  req.body.value.valueQuantity;
				if(validator.isEmpty(valueValueQuantity)){
					dataObservation.value_quantity = "";
				}else{
					if(!validator.isInt(valueValueQuantity)){
						err_code = 2;
						err_msg = "observation value value quantity is must be number.";
					}else{
						dataObservation.value_quantity = valueValueQuantity;
					}
				}
			}else{
			  valueValueQuantity = "";
			}

			if(typeof req.body.value.valueCodeableConcept !== 'undefined' && req.body.value.valueCodeableConcept !== ""){
				var valueValueCodeableConcept =  req.body.value.valueCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(valueValueCodeableConcept)){
					dataObservation.value_codeable_concept = "";
				}else{
					dataObservation.value_codeable_concept = valueValueCodeableConcept;
				}
			}else{
			  valueValueCodeableConcept = "";
			}

			if(typeof req.body.value.valueString !== 'undefined' && req.body.value.valueString !== ""){
				var valueValueString =  req.body.value.valueString.trim().toLowerCase();
				if(validator.isEmpty(valueValueString)){
					dataObservation.value_string = "";
				}else{
					dataObservation.value_string = valueValueString;
				}
			}else{
			  valueValueString = "";
			}

			if (typeof req.body.value.valueBoolean !== 'undefined' && req.body.value.valueBoolean !== "") {
			  var valueValueBoolean = req.body.value.valueBoolean.trim().toLowerCase();
					if(validator.isEmpty(valueValueBoolean)){
						valueValueBoolean = "false";
					}
			  if(valueValueBoolean === "true" || valueValueBoolean === "false"){
					dataObservation.value_boolean = valueValueBoolean;
			  } else {
			    err_code = 2;
			    err_msg = "Observation value value boolean is must be boolean.";
			  }
			} else {
			  valueValueBoolean = "";
			}

			if (typeof req.body.value.valueRange !== 'undefined' && req.body.value.valueRange !== "") {
			  var valueValueRange = req.body.value.valueRange;
			  if (valueValueRange.indexOf("to") > 0) {
			    arrValueValueRange = valueValueRange.split("to");
			    dataObservation.value_range_low = arrValueValueRange[0];
			    dataObservation.value_range_high = arrValueValueRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "observation value value range invalid range format.";
				}
			} else {
			  valueValueRange = "";
			}

			if (typeof req.body.value.valueRatio !== 'undefined' && req.body.value.valueRatio !== "") {
			  var valueValueRatio = req.body.value.valueRatio;
			  if (valueValueRatio.indexOf("to") > 0) {
			    arrValueValueRatio = valueValueRatio.split("to");
			    dataObservation.value_ratio_numerator = arrValueValueRatio[0];
			    dataObservation.value_ratio_denominator = arrValueValueRatio[1];
				} else {
			  	err_code = 2;
			  	err_msg = "observation value value ratio invalid ratio format.";
				}
			} else {
			  valueValueRatio = "";
			}

			/*if(typeof req.body.value.valueAttachment.contentType !== 'undefined' && req.body.value.valueAttachment.contentType !== ""){
				var valueValueAttachmentContentType =  req.body.value.valueAttachment.contentType.trim().toLowerCase();
				if(validator.isEmpty(valueValueAttachmentContentType)){
					dataObservation.content_type = "";
				}else{
					dataObservation.content_type = valueValueAttachmentContentType;
				}
			}else{
			  valueValueAttachmentContentType = "";
			}

			if(typeof req.body.value.valueAttachment.language !== 'undefined' && req.body.value.valueAttachment.language !== ""){
				var valueValueAttachmentLanguage =  req.body.value.valueAttachment.language.trim().toLowerCase();
				if(validator.isEmpty(valueValueAttachmentLanguage)){
					dataObservation.language = "";
				}else{
					dataObservation.language = valueValueAttachmentLanguage;
				}
			}else{
			  valueValueAttachmentLanguage = "";
			}

			if(typeof req.body.value.valueAttachment.data !== 'undefined' && req.body.value.valueAttachment.data !== ""){
				var valueValueAttachmentData =  req.body.value.valueAttachment.data.trim().toLowerCase();
				if(validator.isEmpty(valueValueAttachmentData)){
					dataObservation.data = "";
				}else{
					dataObservation.data = valueValueAttachmentData;
				}
			}else{
			  valueValueAttachmentData = "";
			}

			if(typeof req.body.value.valueAttachment.size !== 'undefined' && req.body.value.valueAttachment.size !== ""){
				var valueValueAttachmentSize =  req.body.value.valueAttachment.size;
				if(validator.isEmpty(valueValueAttachmentSize)){
					dataObservation.size = "";
				}else{
					if(!validator.isInt(valueValueAttachmentSize)){
						err_code = 2;
						err_msg = "observation value value attachment size is must be number.";
					}else{
						dataObservation.size = valueValueAttachmentSize;
					}
				}
			}else{
			  valueValueAttachmentSize = "";
			}

			if(typeof req.body.value.valueAttachment.title !== 'undefined' && req.body.value.valueAttachment.title !== ""){
				var valueValueAttachmentTitle =  req.body.value.valueAttachment.title.trim().toLowerCase();
				if(validator.isEmpty(valueValueAttachmentTitle)){
					dataObservation.title = "";
				}else{
					dataObservation.title = valueValueAttachmentTitle;
				}
			}else{
			  valueValueAttachmentTitle = "";
			}*/

			if(typeof req.body.value.valueTime !== 'undefined' && req.body.value.valueTime !== ""){
				var valueValueTime =  req.body.value.valueTime;
				if(validator.isEmpty(valueValueTime)){
					err_code = 2;
					err_msg = "observation value value time is required.";
				}else{
					if(!regex.test(valueValueTime)){
						err_code = 2;
						err_msg = "observation value value time invalid date format.";	
					}else{
						dataObservation.value_time = valueValueTime;
					}
				}
			}else{
			  valueValueTime = "";
			}

			if(typeof req.body.value.valueDateTime !== 'undefined' && req.body.value.valueDateTime !== ""){
				var valueValueDateTime =  req.body.value.valueDateTime;
				if(validator.isEmpty(valueValueDateTime)){
					err_code = 2;
					err_msg = "observation value value date time is required.";
				}else{
					if(!regex.test(valueValueDateTime)){
						err_code = 2;
						err_msg = "observation value value date time invalid date format.";	
					}else{
						dataObservation.value_date_time = valueValueDateTime;
					}
				}
			}else{
			  valueValueDateTime = "";
			}

			if (typeof req.body.value.valuePeriod !== 'undefined' && req.body.value.valuePeriod !== "") {
			  var valueValuePeriod = req.body.value.valuePeriod;
			  if (valueValuePeriod.indexOf("to") > 0) {
			    arrValueValuePeriod = valueValuePeriod.split("to");
			    dataObservation.value_period_start = arrValueValuePeriod[0];
			    dataObservation.value_period_end = arrValueValuePeriod[1];
			    if (!regex.test(valueValuePeriodStart) && !regex.test(valueValuePeriodEnd)) {
			      err_code = 2;
			      err_msg = "observation value value period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "observation value value period invalid date format.";
				}
			} else {
			  valueValuePeriod = "";
			}

			if(typeof req.body.dataAbsentReason !== 'undefined' && req.body.dataAbsentReason !== ""){
				var dataAbsentReason =  req.body.dataAbsentReason.trim().toLowerCase();
				if(validator.isEmpty(dataAbsentReason)){
					dataObservation.data_absent_reason = "";
				}else{
					dataObservation.data_absent_reason = dataAbsentReason;
				}
			}else{
			  dataAbsentReason = "";
			}

			if(typeof req.body.interpretation !== 'undefined' && req.body.interpretation !== ""){
				var interpretation =  req.body.interpretation.trim().toLowerCase();
				if(validator.isEmpty(interpretation)){
					dataObservation.interpretation = "";
				}else{
					dataObservation.interpretation = interpretation;
				}
			}else{
			  interpretation = "";
			}

			if(typeof req.body.comment !== 'undefined' && req.body.comment !== ""){
				var comment =  req.body.comment.trim().toLowerCase();
				if(validator.isEmpty(comment)){
					dataObservation.comment = "";
				}else{
					dataObservation.comment = comment;
				}
			}else{
			  comment = "";
			}

			if(typeof req.body.bodySite !== 'undefined' && req.body.bodySite !== ""){
				var bodySite =  req.body.bodySite.trim().toLowerCase();
				if(validator.isEmpty(bodySite)){
					dataObservation.body_site = "";
				}else{
					dataObservation.body_site = bodySite;
				}
			}else{
			  bodySite = "";
			}

			if(typeof req.body.method !== 'undefined' && req.body.method !== ""){
				var method =  req.body.method.trim().toLowerCase();
				if(validator.isEmpty(method)){
					dataObservation.method = "";
				}else{
					dataObservation.method = method;
				}
			}else{
			  method = "";
			}

			if(typeof req.body.specimen !== 'undefined' && req.body.specimen !== ""){
				var specimen =  req.body.specimen.trim().toLowerCase();
				if(validator.isEmpty(specimen)){
					dataObservation.specimen = "";
				}else{
					dataObservation.specimen = specimen;
				}
			}else{
			  specimen = "";
			}

			if(typeof req.body.device.device !== 'undefined' && req.body.device.device !== ""){
				var deviceDevice =  req.body.device.device.trim().toLowerCase();
				if(validator.isEmpty(deviceDevice)){
					dataObservation.device_device = "";
				}else{
					dataObservation.device_device = deviceDevice;
				}
			}else{
			  deviceDevice = "";
			}

			if(typeof req.body.device.deviceMetric !== 'undefined' && req.body.device.deviceMetric !== ""){
				var deviceDeviceMetric =  req.body.device.deviceMetric.trim().toLowerCase();
				if(validator.isEmpty(deviceDeviceMetric)){
					dataObservation.device_device_metric = "";
				}else{
					dataObservation.device_device_metric = deviceDeviceMetric;
				}
			}else{
			  deviceDeviceMetric = "";
			}

			if(err_code == 0){
			//check apikey
			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					//event emiter
					myEmitter.prependOnceListener('checkObservationId', function(){
						checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservationId){
							if(resObservationId.err_code > 0){
								ApiFHIR.put('observation', {"apikey": apikey, "_id": observationId}, {body: dataObservation, json: true}, function(error, response, body){
									observation = body;
									if(observation.err_code > 0){
										res.json(observation);	
									}else{
										res.json({"err_code": 0, "err_msg": "Observation has been update.", "data": [{"_id": observationId}]});
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Observation Id not found"});		
							}
						})
					})
					
					myEmitter.prependOnceListener('checkStatus', function () {
						if (!validator.isEmpty(status)) {
							checkCode(apikey, status, 'OBSERVATION_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) {
									myEmitter.emit('checkObservationId');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkObservationId');
						}
					})

					myEmitter.prependOnceListener('checkCategory', function () {
						if (!validator.isEmpty(category)) {
							checkCode(apikey, category, 'OBSERVATION_CATEGORY', function (resCategoryCode) {
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
							checkCode(apikey, code, 'OBSERVATION_CODES', function (resCodeCode) {
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

					myEmitter.prependOnceListener('checkDataAbsentReason', function () {
						if (!validator.isEmpty(dataAbsentReason)) {
							checkCode(apikey, dataAbsentReason, 'OBSERVATION_VALUEABSENTREASON', function (resDataAbsentReasonCode) {
								if (resDataAbsentReasonCode.err_code > 0) {
									myEmitter.emit('checkCode');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Data absent reason code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCode');
						}
					})

					myEmitter.prependOnceListener('checkInterpretation', function () {
						if (!validator.isEmpty(interpretation)) {
							checkCode(apikey, interpretation, 'OBSERVATION_INTERPRETATION', function (resInterpretationCode) {
								if (resInterpretationCode.err_code > 0) {
									myEmitter.emit('checkDataAbsentReason');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Interpretation code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkDataAbsentReason');
						}
					})

					myEmitter.prependOnceListener('checkBodySite', function () {
						if (!validator.isEmpty(bodySite)) {
							checkCode(apikey, bodySite, 'BODY_SITE', function (resBodySiteCode) {
								if (resBodySiteCode.err_code > 0) {
									myEmitter.emit('checkInterpretation');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Body site code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkInterpretation');
						}
					})

					myEmitter.prependOnceListener('checkMethod', function () {
						if (!validator.isEmpty(method)) {
							checkCode(apikey, method, 'OBSERVATION_METHODS', function (resMethodCode) {
								if (resMethodCode.err_code > 0) {
									myEmitter.emit('checkBodySite');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Method code not found"
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
									myEmitter.emit('checkMethod');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Subject patient id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkMethod');
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
					
					myEmitter.prependOnceListener('checkSpecimen', function () {
						if (!validator.isEmpty(specimen)) {
							checkUniqeValue(apikey, "SPECIMEN_ID|" + specimen, 'SPECIMEN', function (resSpecimen) {
								if (resSpecimen.err_code > 0) {
									myEmitter.emit('checkContextEpisodeOfCare');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Specimen id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkContextEpisodeOfCare');
						}
					})

					myEmitter.prependOnceListener('checkDeviceDevice', function () {
						if (!validator.isEmpty(deviceDevice)) {
							checkUniqeValue(apikey, "DEVICE_ID|" + deviceDevice, 'DEVICE', function (resDeviceDevice) {
								if (resDeviceDevice.err_code > 0) {
									myEmitter.emit('checkSpecimen');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Device device id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSpecimen');
						}
					})

					if (!validator.isEmpty(deviceDeviceMetric)) {
						checkUniqeValue(apikey, "DEVICE_METRIC_ID|" + deviceDeviceMetric, 'DEVICE_METRIC', function (resDeviceDeviceMetric) {
							if (resDeviceDeviceMetric.err_code > 0) {
								myEmitter.emit('checkDeviceDevice');
							} else {
								res.json({
									"err_code": "500",
									"err_msg": "Device device metric id not found"
								});
							}
						})
					} else {
						myEmitter.emit('checkDeviceDevice');
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
			var observationId = req.params.observation_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof observationId !== 'undefined'){
				if(validator.isEmpty(observationId)){
					err_code = 2;
					err_msg = "Observation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation id is required";
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
						myEmitter.prependOnceListener('checkObservationID', function(){
							checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservationID){
								if(resObservationID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "OBSERVATION_ID|"+observationId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this Observation.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Observation Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkObservationID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkObservationID');				
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
		observationRelated: function updateObservationRelated(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var observationId = req.params.observation_id;
			var observationRelatedId = req.params.observation_related_id;

			var err_code = 0;
			var err_msg = "";
			var dataObservation = {};
			//input check 
			if(typeof observationId !== 'undefined'){
				if(validator.isEmpty(observationId)){
					err_code = 2;
					err_msg = "Observation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation id is required";
			}

			if(typeof observationRelatedId !== 'undefined'){
				if(validator.isEmpty(observationRelatedId)){
					err_code = 2;
					err_msg = "Observation Related id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation Related id is required";
			}
			
			/*
			var type  = req.body.type;
			var target_observation  = req.body.target_observation;
			var target_questionnaire_response  = req.body.target_questionnaire_response;
			var target_sequence  = req.body.target_sequence;
			*/
			
			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var relatedType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(relatedType)){
					dataObservation.text = "";
				}else{
					dataObservation.text = relatedType;
				}
			}else{
			  relatedType = "";
			}

			if(typeof req.body.target.observation !== 'undefined' && req.body.target.observation !== ""){
				var relatedTargetObservation =  req.body.target.observation.trim().toLowerCase();
				if(validator.isEmpty(relatedTargetObservation)){
					dataObservation.target_observation = "";
				}else{
					dataObservation.target_observation = relatedTargetObservation;
				}
			}else{
			  relatedTargetObservation = "";
			}

			if(typeof req.body.target.questionnaireResponse !== 'undefined' && req.body.target.questionnaireResponse !== ""){
				var relatedTargetQuestionnaireResponse =  req.body.target.questionnaireResponse.trim().toLowerCase();
				if(validator.isEmpty(relatedTargetQuestionnaireResponse)){
					dataObservation.target_questionnaire_response = "";
				}else{
					dataObservation.target_questionnaire_response = relatedTargetQuestionnaireResponse;
				}
			}else{
			  relatedTargetQuestionnaireResponse = "";
			}

			if(typeof req.body.target.sequence !== 'undefined' && req.body.target.sequence !== ""){
				var relatedTargetSequence =  req.body.target.sequence.trim().toLowerCase();
				if(validator.isEmpty(relatedTargetSequence)){
					dataObservation.target_sequence = "";
				}else{
					dataObservation.target_sequence = relatedTargetSequence;
				}
			}else{
			  relatedTargetSequence = "";
			}
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkObservationID', function(){
							checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservationId){
								if(resObservationId.err_code > 0){
									checkUniqeValue(apikey, "RELATED_ID|" + observationRelatedId, 'OBSERVATION_RELATED', function(resObservationRelatedID){
										if(resObservationRelatedID.err_code > 0){
											ApiFHIR.put('observationRelated', {"apikey": apikey, "_id": observationRelatedId, "dr": "OBSERVATION_ID|"+observationId}, {body: dataObservation, json: true}, function(error, response, body){
												observationRelated = body;
												if(observationRelated.err_code > 0){
													res.json(observationRelated);	
												}else{
													res.json({"err_code": 0, "err_msg": "Observation related has been update in this Observation.", "data": observationRelated.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Observation related Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Observation Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkRelatedType', function () {
							if (!validator.isEmpty(relatedType)) {
								checkCode(apikey, relatedType, 'OBSERVATION_RELATIONSHIPTYPES', function (resRelatedTypeCode) {
									if (resRelatedTypeCode.err_code > 0) {
										myEmitter.emit('checkObservationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Related type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkObservationID');
							}
						})
						
						myEmitter.prependOnceListener('checkRelatedTargetObservation', function () {
							if (!validator.isEmpty(relatedTargetObservation)) {
								checkUniqeValue(apikey, "OBSERVATION_ID|" + relatedTargetObservation, 'OBSERVATION', function (resRelatedTargetObservation) {
									if (resRelatedTargetObservation.err_code > 0) {
										myEmitter.emit('checkRelatedType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Related target observation id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRelatedType');
							}
						})

						myEmitter.prependOnceListener('checkRelatedTargetQuestionnaireResponse', function () {
							if (!validator.isEmpty(relatedTargetQuestionnaireResponse)) {
								checkUniqeValue(apikey, "QUESTIONNAIRE_RESPONSE_ID|" + relatedTargetQuestionnaireResponse, 'QUESTIONNAIRE_RESPONSE', function (resRelatedTargetQuestionnaireResponse) {
									if (resRelatedTargetQuestionnaireResponse.err_code > 0) {
										myEmitter.emit('checkRelatedTargetObservation');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Related target questionnaire response id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRelatedTargetObservation');
							}
						})

						if (!validator.isEmpty(relatedTargetSequence)) {
							checkUniqeValue(apikey, "SEQUENCE_ID|" + relatedTargetSequence, 'SEQUENCE', function (resRelatedTargetSequence) {
								if (resRelatedTargetSequence.err_code > 0) {
									myEmitter.emit('checkRelatedTargetQuestionnaireResponse');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Related target sequence id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRelatedTargetQuestionnaireResponse');
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
		observationComponent: function updateObservationComponent(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var observationId = req.params.observation_id;
			var observationComponentId = req.params.observation_component_id;

			var err_code = 0;
			var err_msg = "";
			var dataObservation = {};
			//input check 
			if(typeof observationId !== 'undefined'){
				if(validator.isEmpty(observationId)){
					err_code = 2;
					err_msg = "Observation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation id is required";
			}

			if(typeof observationComponentId !== 'undefined'){
				if(validator.isEmpty(observationComponentId)){
					err_code = 2;
					err_msg = "Observation Component id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation Prediction id is required";
			}
			
			/*
			var component_id  = req.params._id;
			var code  = req.body.code;
			var value_quantity  = req.body.value_quantity;
			var value_codeable_concept  = req.body.value_codeable_concept;
			var value_string  = req.body.value_string;
			var value_range_low  = req.body.value_range_low;
			var value_range_high  = req.body.value_range_high;
			var value_ratio_numerator  = req.body.value_ratio_numerator;
			var value_ratio_denominator  = req.body.value_ratio_denominator;
			var value_sampled_data  = req.body.value_sampled_data;
			var value_attachment  = req.body.value_attachment;
			var value_time  = req.body.value_time;
			var value_date_time  = req.body.value_date_time;
			var value_period_start  = req.body.value_period_start;
			var value_period_end  = req.body.value_period_end;
			var data_absent_reason  = req.body.data_absent_reason;
			var interpretation  = req.body.interpretation;
			var observation_id  = req.body.observation_id;
			*/
			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var componentCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(componentCode)){
					err_code = 2;
					err_msg = "observation component code is required.";
				}else{
					dataObservation.code = componentCode;
				}
			}else{
			  componentCode = "";
			}

			if(typeof req.body.dataAbsentReason !== 'undefined' && req.body.dataAbsentReason !== ""){
				var componentDataAbsentReason =  req.body.dataAbsentReason.trim().toLowerCase();
				if(validator.isEmpty(componentDataAbsentReason)){
					dataObservation.data_absent_reason = "";
				}else{
					dataObservation.data_absent_reason = componentDataAbsentReason;
				}
			}else{
			  componentDataAbsentReason = "";
			}

			if(typeof req.body.interpretation !== 'undefined' && req.body.interpretation !== ""){
				var componentInterpretation =  req.body.interpretation.trim().toLowerCase();
				if(validator.isEmpty(componentInterpretation)){
					dataObservation.interpretation = "";
				}else{
					dataObservation.interpretation = componentInterpretation;
				}
			}else{
			  componentInterpretation = "";
			}

			if(typeof req.body.value.valueQuantity !== 'undefined' && req.body.value.valueQuantity !== ""){
				var componentValueValueQuantity =  req.body.value.valueQuantity;
				if(validator.isEmpty(componentValueValueQuantity)){
					dataObservation.value_quantity = "";
				}else{
					if(!validator.isInt(componentValueValueQuantity)){
						err_code = 2;
						err_msg = "observation component value value quantity is must be number.";
					}else{
						dataObservation.value_quantity = componentValueValueQuantity;
					}
				}
			}else{
			  componentValueValueQuantity = "";
			}

			if(typeof req.body.value.valueCodeableConcept !== 'undefined' && req.body.value.valueCodeableConcept !== ""){
				var componentValueValueCodeableConcept =  req.body.value.valueCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueCodeableConcept)){
					dataObservation.value_codeable_concept = "";
				}else{
					dataObservation.value_codeable_concept = componentValueValueCodeableConcept;
				}
			}else{
			  componentValueValueCodeableConcept = "";
			}

			if(typeof req.body.value.valueString !== 'undefined' && req.body.value.valueString !== ""){
				var componentValueValueString =  req.body.value.valueString.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueString)){
					dataObservation.value_string = "";
				}else{
					dataObservation.value_string = componentValueValueString;
				}
			}else{
			  componentValueValueString = "";
			}

			if (typeof req.body.value.valueRange !== 'undefined' && req.body.value.valueRange !== "") {
			  var componentValueValueRange = req.body.value.valueRange;
			  if (componentValueValueRange.indexOf("to") > 0) {
			    arrComponentValueValueRange = componentValueValueRange.split("to");
			    dataObservation.value_range_low = arrComponentValueValueRange[0];
			    dataObservation.value_range_high = arrComponentValueValueRange[1];
				} else {
			  	err_code = 2;
			  	err_msg = "observation component value value range invalid range format.";
				}
			} else {
			  componentValueValueRange = "";
			}

			if (typeof req.body.value.valueRatio !== 'undefined' && req.body.value.valueRatio !== "") {
			  var componentValueValueRatio = req.body.value.valueRatio;
			  if (componentValueValueRatio.indexOf("to") > 0) {
			    arrComponentValueValueRatio = componentValueValueRatio.split("to");
			    dataObservation.value_ratio_numerator = arrComponentValueValueRatio[0];
			    dataObservation.value_ratio_denominator = arrComponentValueValueRatio[1];
				} else {
			  	err_code = 2;
			  	err_msg = "observation component value value ratio invalid ratio format.";
				}
			} else {
			  componentValueValueRatio = "";
			}

			if(typeof req.body.value.valueSampledData.origin !== 'undefined' && req.body.value.valueSampledData.origin !== ""){
				var componentValueValueSampledDataOrigin =  req.body.value.valueSampledData.origin;
				if(validator.isEmpty(componentValueValueSampledDataOrigin)){
					dataObservation.origin = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataOrigin)){
						err_code = 2;
						err_msg = "observation component value value sampled data origin is must be number.";
					}else{
						dataObservation.origin = componentValueValueSampledDataOrigin;
					}
				}
			}else{
			  componentValueValueSampledDataOrigin = "";
			}

			if(typeof req.body.value.valueSampledData.period !== 'undefined' && req.body.value.valueSampledData.period !== ""){
				var componentValueValueSampledDataPeriod =  req.body.value.valueSampledData.period;
				if(validator.isEmpty(componentValueValueSampledDataPeriod)){
					dataObservation.period = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataPeriod)){
						err_code = 2;
						err_msg = "observation component value value sampled data period is must be number.";
					}else{
						dataObservation.period = componentValueValueSampledDataPeriod;
					}
				}
			}else{
			  componentValueValueSampledDataPeriod = "";
			}

			if(typeof req.body.value.valueSampledData.factor !== 'undefined' && req.body.value.valueSampledData.factor !== ""){
				var componentValueValueSampledDataFactor =  req.body.value.valueSampledData.factor;
				if(validator.isEmpty(componentValueValueSampledDataFactor)){
					dataObservation.factor = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataFactor)){
						err_code = 2;
						err_msg = "observation component value value sampled data factor is must be number.";
					}else{
						dataObservation.factor = componentValueValueSampledDataFactor;
					}
				}
			}else{
			  componentValueValueSampledDataFactor = "";
			}

			if(typeof req.body.value.valueSampledData.lowerLimit !== 'undefined' && req.body.value.valueSampledData.lowerLimit !== ""){
				var componentValueValueSampledDataLowerLimit =  req.body.value.valueSampledData.lowerLimit;
				if(validator.isEmpty(componentValueValueSampledDataLowerLimit)){
					dataObservation.lower_limit = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataLowerLimit)){
						err_code = 2;
						err_msg = "observation component value value sampled data lower limit is must be number.";
					}else{
						dataObservation.lower_limit = componentValueValueSampledDataLowerLimit;
					}
				}
			}else{
			  componentValueValueSampledDataLowerLimit = "";
			}

			if(typeof req.body.value.valueSampledData.upperLimit !== 'undefined' && req.body.value.valueSampledData.upperLimit !== ""){
				var componentValueValueSampledDataUpperLimit =  req.body.value.valueSampledData.upperLimit;
				if(validator.isEmpty(componentValueValueSampledDataUpperLimit)){
					dataObservation.upper_limit = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataUpperLimit)){
						err_code = 2;
						err_msg = "observation component value value sampled data upper limit is must be number.";
					}else{
						dataObservation.upper_limit = componentValueValueSampledDataUpperLimit;
					}
				}
			}else{
			  componentValueValueSampledDataUpperLimit = "";
			}

			if(typeof req.body.value.valueSampledData.dimensions !== 'undefined' && req.body.value.valueSampledData.dimensions !== ""){
				var componentValueValueSampledDataDimensions =  req.body.value.valueSampledData.dimensions;
				if(validator.isEmpty(componentValueValueSampledDataDimensions)){
					dataObservation.dimensions = "";
				}else{
					if(!validator.isInt(componentValueValueSampledDataDimensions)){
						err_code = 2;
						err_msg = "observation component value value sampled data dimensions is must be number.";
					}else{
						dataObservation.dimensions = componentValueValueSampledDataDimensions;
					}
				}
			}else{
			  componentValueValueSampledDataDimensions = "";
			}

			if(typeof req.body.value.valueSampledData.data !== 'undefined' && req.body.value.valueSampledData.data !== ""){
				var componentValueValueSampledDataData =  req.body.value.valueSampledData.data.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueSampledDataData)){
					dataObservation.data = "";
				}else{
					dataObservation.data = componentValueValueSampledDataData;
				}
			}else{
			  componentValueValueSampledDataData = "";
			}

			if(typeof req.body.value.valueAttachment.contentType !== 'undefined' && req.body.value.valueAttachment.contentType !== ""){
				var componentValueValueAttachmentContentType =  req.body.value.valueAttachment.contentType.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueAttachmentContentType)){
					dataObservation.content_type = "";
				}else{
					dataObservation.content_type = componentValueValueAttachmentContentType;
				}
			}else{
			  componentValueValueAttachmentContentType = "";
			}

			if(typeof req.body.value.valueAttachment.language !== 'undefined' && req.body.value.valueAttachment.language !== ""){
				var componentValueValueAttachmentLanguage =  req.body.value.valueAttachment.language.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueAttachmentLanguage)){
					dataObservation.language = "";
				}else{
					dataObservation.language = componentValueValueAttachmentLanguage;
				}
			}else{
			  componentValueValueAttachmentLanguage = "";
			}

			if(typeof req.body.value.valueAttachment.data !== 'undefined' && req.body.value.valueAttachment.data !== ""){
				var componentValueValueAttachmentData =  req.body.value.valueAttachment.data.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueAttachmentData)){
					dataObservation.data = "";
				}else{
					dataObservation.data = componentValueValueAttachmentData;
				}
			}else{
			  componentValueValueAttachmentData = "";
			}

			if(typeof req.body.value.valueAttachment.size !== 'undefined' && req.body.value.valueAttachment.size !== ""){
				var componentValueValueAttachmentSize =  req.body.value.valueAttachment.size;
				if(validator.isEmpty(componentValueValueAttachmentSize)){
					dataObservation.size = "";
				}else{
					if(!validator.isInt(componentValueValueAttachmentSize)){
						err_code = 2;
						err_msg = "observation component value value attachment size is must be number.";
					}else{
						dataObservation.size = componentValueValueAttachmentSize;
					}
				}
			}else{
			  componentValueValueAttachmentSize = "";
			}

			if(typeof req.body.value.valueAttachment.title !== 'undefined' && req.body.value.valueAttachment.title !== ""){
				var componentValueValueAttachmentTitle =  req.body.value.valueAttachment.title.trim().toLowerCase();
				if(validator.isEmpty(componentValueValueAttachmentTitle)){
					dataObservation.title = "";
				}else{
					dataObservation.title = componentValueValueAttachmentTitle;
				}
			}else{
			  componentValueValueAttachmentTitle = "";
			}

			if(typeof req.body.value.valueTime !== 'undefined' && req.body.value.valueTime !== ""){
				var componentValueValueTime =  req.body.value.valueTime;
				if(validator.isEmpty(componentValueValueTime)){
					err_code = 2;
					err_msg = "observation component value value time is required.";
				}else{
					if(!regex.test(componentValueValueTime)){
						err_code = 2;
						err_msg = "observation component value value time invalid date format.";	
					}else{
						dataObservation.value_time = componentValueValueTime;
					}
				}
			}else{
			  componentValueValueTime = "";
			}

			if(typeof req.body.value.valueDateTime !== 'undefined' && req.body.value.valueDateTime !== ""){
				var componentValueValueDateTime =  req.body.value.valueDateTime;
				if(validator.isEmpty(componentValueValueDateTime)){
					err_code = 2;
					err_msg = "observation component value value date time is required.";
				}else{
					if(!regex.test(componentValueValueDateTime)){
						err_code = 2;
						err_msg = "observation component value value date time invalid date format.";	
					}else{
						dataObservation.value_date_time = componentValueValueDateTime;
					}
				}
			}else{
			  componentValueValueDateTime = "";
			}

			if (typeof req.body.value.valuePeriod !== 'undefined' && req.body.value.valuePeriod !== "") {
			  var componentValueValuePeriod = req.body.value.valuePeriod;
			  if (componentValueValuePeriod.indexOf("to") > 0) {
			    arrComponentValueValuePeriod = componentValueValuePeriod.split("to");
			    dataObservation.value_period_start = arrComponentValueValuePeriod[0];
			    dataObservation.value_period_end = arrComponentValueValuePeriod[1];
			    if (!regex.test(componentValueValuePeriodStart) && !regex.test(componentValueValuePeriodEnd)) {
			      err_code = 2;
			      err_msg = "observation component value value period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "observation component value value period invalid date format.";
				}
			} else {
			  componentValueValuePeriod = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkObservationID', function(){
							checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservationId){
								if(resObservationId.err_code > 0){
									checkUniqeValue(apikey, "COMPONENT_ID|" + observationComponentId, 'OBSERVATION_COMPONENT', function(resObservationComponentID){
										if(resObservationComponentID.err_code > 0){
											ApiFHIR.put('observationComponent', {"apikey": apikey, "_id": observationComponentId, "dr": "OBSERVATION_ID|"+observationId}, {body: dataObservation, json: true}, function(error, response, body){
												observationComponent = body;
												if(observationComponent.err_code > 0){
													res.json(observationComponent);	
												}else{
													res.json({"err_code": 0, "err_msg": "Observation Component has been update in this Observation.", "data": observationComponent.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Observation Component Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Observation Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkComponentCode', function () {
							if (!validator.isEmpty(componentCode)) {
								checkCode(apikey, componentCode, 'OBSERVATION_CODES', function (resComponentCodeCode) {
									if (resComponentCodeCode.err_code > 0) {
										myEmitter.emit('checkObservationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Component code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkObservationID');
							}
						})

						myEmitter.prependOnceListener('checkComponentDataAbsentReason', function () {
							if (!validator.isEmpty(componentDataAbsentReason)) {
								checkCode(apikey, componentDataAbsentReason, 'OBSERVATION_VALUEABSENTREASON', function (resComponentDataAbsentReasonCode) {
									if (resComponentDataAbsentReasonCode.err_code > 0) {
										myEmitter.emit('checkComponentCode');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Component data absent reason code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkComponentCode');
							}
						})

						if (!validator.isEmpty(componentInterpretation)) {
							checkCode(apikey, componentInterpretation, 'OBSERVATION_INTERPRETATION', function (resComponentInterpretationCode) {
								if (resComponentInterpretationCode.err_code > 0) {
									myEmitter.emit('checkComponentDataAbsentReason');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Component interpretation code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkComponentDataAbsentReason');
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
		observationReferenceRange: function updateObservationReferenceRange(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var observationId = req.params.observation_id;
			var observationReferenceRangeId = req.params.observation_reference_range_id;

			var err_code = 0;
			var err_msg = "";
			var dataObservation = {};
			//input check 
			if(typeof observationId !== 'undefined'){
				if(validator.isEmpty(observationId)){
					err_code = 2;
					err_msg = "Observation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation id is required";
			}

			if(typeof observationReferenceRangeId !== 'undefined'){
				if(validator.isEmpty(observationReferenceRangeId)){
					err_code = 2;
					err_msg = "Observation Reference Range id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation Reference Range id is required";
			}
			
			/*
			var reference_range_id  = req.params._id;
			var low  = req.body.low; 
			var high  = req.body.high;
			var type  = req.body.type;
			var applies_to  = req.body.applies_to;
			var age_low  = req.body.age_low;
			var age_high  = req.body.age_high;
			var text  = req.body.text;
			var observation_id  = req.body.observation_id;
			*/
			if(typeof req.body.low !== 'undefined' && req.body.low !== ""){
				var referenceRangeLow =  req.body.low;
				if(validator.isEmpty(referenceRangeLow)){
					dataObservation.low = "";
				}else{
					if(!validator.isInt(referenceRangeLow)){
						err_code = 2;
						err_msg = "observation reference range low is must be number.";
					}else{
						dataObservation.low = referenceRangeLow;
					}
				}
			}else{
			  referenceRangeLow = "";
			}

			if(typeof req.body.high !== 'undefined' && req.body.high !== ""){
				var referenceRangeHigh =  req.body.high;
				if(validator.isEmpty(referenceRangeHigh)){
					dataObservation.high = "";
				}else{
					if(!validator.isInt(referenceRangeHigh)){
						err_code = 2;
						err_msg = "observation reference range high is must be number.";
					}else{
						dataObservation.high = referenceRangeHigh;
					}
				}
			}else{
			  referenceRangeHigh = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var referenceRangeType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeType)){
					dataObservation.type = "";
				}else{
					dataObservation.type = referenceRangeType;
				}
			}else{
			  referenceRangeType = "";
			}

			if(typeof req.body.appliesTo !== 'undefined' && req.body.appliesTo !== ""){
				var referenceRangeAppliesTo =  req.body.appliesTo.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeAppliesTo)){
					dataObservation.applies_to = "";
				}else{
					dataObservation.applies_to = referenceRangeAppliesTo;
				}
			}else{
			  referenceRangeAppliesTo = "";
			}

			if (typeof req.body.age !== 'undefined' && req.body.age !== "") {
			  var referenceRangeAge = req.body.age;
			  if (referenceRangeAge.indexOf("to") > 0) {
			    arrReferenceRangeAge = referenceRangeAge.split("to");
			    dataObservation.age_low = arrReferenceRangeAge[0];
			    dataObservation.age_high = arrReferenceRangeAge[1];
				} else {
			  	err_code = 2;
			  	err_msg = "observation reference range age invalid range format.";
				}
			} else {
			  referenceRangeAge = "";
			}

			if(typeof req.body.text !== 'undefined' && req.body.text !== ""){
				var referenceRangeText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeText)){
					dataObservation.text = "";
				}else{
					dataObservation.text = referenceRangeText;
				}
			}else{
			  referenceRangeText = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkObservationID', function(){
							checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservationId){
								if(resObservationId.err_code > 0){
									checkUniqeValue(apikey, "REFERENCE_RANGE_ID|" + observationReferenceRangeId, 'OBSERVATION_REFERENCE_RANGE', function(resObservationReferenceRangeID){
										if(resObservationReferenceRangeID.err_code > 0){
											ApiFHIR.put('observationReferenceRange', {"apikey": apikey, "_id": observationReferenceRangeId, "dr": "OBSERVATION_ID|"+observationId}, {body: dataObservation, json: true}, function(error, response, body){
												observationReferenceRange = body;
												if(observationReferenceRange.err_code > 0){
													res.json(observationReferenceRange);	
												}else{
													res.json({"err_code": 0, "err_msg": "Observation Reference Range has been update in this Observation.", "data": observationReferenceRange.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Observation Reference Range Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Observation Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkReferenceRangeAppliesTo', function () {
							if (!validator.isEmpty(referenceRangeAppliesTo)) {
								checkCode(apikey, referenceRangeAppliesTo, 'REFERENCERANGE_MEANING', function (resReferenceRangeAppliesToCode) {
									if (resReferenceRangeAppliesToCode.err_code > 0) {
										myEmitter.emit('checkObservationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Reference range applies to code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkObservationID');
							}
						})

						if (!validator.isEmpty(referenceRangeType)) {
							checkCode(apikey, referenceRangeType, 'REFERENCERANGE_APPLIESTO', function (resReferenceRangeTypeCode) {
								if (resReferenceRangeTypeCode.err_code > 0) {
									myEmitter.emit('checkReferenceRangeAppliesTo');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Reference range type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkReferenceRangeAppliesTo');
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
		observationSampledData: function updateObservationSampledData(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var observationId = req.params.observation_id;
			var observationSampledDataId = req.params.observation_sampled_data_id;

			var err_code = 0;
			var err_msg = "";
			var dataObservation = {};
			//input check 
			if(typeof observationId !== 'undefined'){
				if(validator.isEmpty(observationId)){
					err_code = 2;
					err_msg = "Observation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation id is required";
			}

			if(typeof observationSampledDataId !== 'undefined'){
				if(validator.isEmpty(observationSampledDataId)){
					err_code = 2;
					err_msg = "Observation Sampled Data id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation Sampled Data id is required";
			}
			
			/*
			var sampled_data_id  = req.params._id;
			var origin  = req.body.origin;
			var period  = req.body.period;
			var factor  = req.body.factor;
			var lower_limit   = req.body.lower_limit;
			var upper_limit  = req.body.upper_limit;
			var dimensions  = req.body.dimensions;
			var data  = req.body.data;
			*/
			
			if(typeof req.body.origin !== 'undefined' && req.body.origin !== ""){
				var valueValueSampledDataOrigin =  req.body.origin;
				if(validator.isEmpty(valueValueSampledDataOrigin)){
					dataObservation.origin = "";
				}else{
					if(!validator.isInt(valueValueSampledDataOrigin)){
						err_code = 2;
						err_msg = "observation value value sampled data origin is must be number.";
					}else{
						dataObservation.origin = valueValueSampledDataOrigin;
					}
				}
			}else{
			  valueValueSampledDataOrigin = "";
			}

			if(typeof req.body.period !== 'undefined' && req.body.period !== ""){
				var valueValueSampledDataPeriod =  req.body.period;
				if(validator.isEmpty(valueValueSampledDataPeriod)){
					dataObservation.period = "";
				}else{
					if(!validator.isInt(valueValueSampledDataPeriod)){
						err_code = 2;
						err_msg = "observation value value sampled data period is must be number.";
					}else{
						dataObservation.period = valueValueSampledDataPeriod;
					}
				}
			}else{
			  valueValueSampledDataPeriod = "";
			}

			if(typeof req.body.factor !== 'undefined' && req.body.factor !== ""){
				var valueValueSampledDataFactor =  req.body.factor;
				if(validator.isEmpty(valueValueSampledDataFactor)){
					dataObservation.factor = "";
				}else{
					if(!validator.isInt(valueValueSampledDataFactor)){
						err_code = 2;
						err_msg = "observation value value sampled data factor is must be number.";
					}else{
						dataObservation.factor = valueValueSampledDataFactor;
					}
				}
			}else{
			  valueValueSampledDataFactor = "";
			}

			if(typeof req.body.lowerLimit !== 'undefined' && req.body.lowerLimit !== ""){
				var valueValueSampledDataLowerLimit =  req.body.lowerLimit;
				if(validator.isEmpty(valueValueSampledDataLowerLimit)){
					dataObservation.lower_limit = "";
				}else{
					if(!validator.isInt(valueValueSampledDataLowerLimit)){
						err_code = 2;
						err_msg = "observation value value sampled data lower limit is must be number.";
					}else{
						dataObservation.lower_limit = valueValueSampledDataLowerLimit;
					}
				}
			}else{
			  valueValueSampledDataLowerLimit = "";
			}

			if(typeof req.body.upperLimit !== 'undefined' && req.body.upperLimit !== ""){
				var valueValueSampledDataUpperLimit =  req.body.upperLimit;
				if(validator.isEmpty(valueValueSampledDataUpperLimit)){
					dataObservation.upper_limit = "";
				}else{
					if(!validator.isInt(valueValueSampledDataUpperLimit)){
						err_code = 2;
						err_msg = "observation value value sampled data upper limit is must be number.";
					}else{
						dataObservation.upper_limit = valueValueSampledDataUpperLimit;
					}
				}
			}else{
			  valueValueSampledDataUpperLimit = "";
			}

			if(typeof req.body.dimensions !== 'undefined' && req.body.dimensions !== ""){
				var valueValueSampledDataDimensions =  req.body.dimensions;
				if(validator.isEmpty(valueValueSampledDataDimensions)){
					dataObservation.dimensions = "";
				}else{
					if(!validator.isInt(valueValueSampledDataDimensions)){
						err_code = 2;
						err_msg = "observation value value sampled data dimensions is must be number.";
					}else{
						dataObservation.dimensions = valueValueSampledDataDimensions;
					}
				}
			}else{
			  valueValueSampledDataDimensions = "";
			}

			if(typeof req.body.data !== 'undefined' && req.body.data !== ""){
				var valueValueSampledDataData =  req.body.data.trim().toLowerCase();
				if(validator.isEmpty(valueValueSampledDataData)){
					dataObservation.data = "";
				}else{
					dataObservation.data = valueValueSampledDataData;
				}
			}else{
			  valueValueSampledDataData = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservationId){
							if(resObservationId.err_code > 0){
								checkUniqeValue(apikey, "SAMPLED_DATA_ID|" + observationSampledDataId, 'SAMPLED_DATA', function(resObservationSampledDataID){
									if(resObservationSampledDataID.err_code > 0){
										ApiFHIR.put('observationSampledData', {"apikey": apikey, "_id": observationSampledDataId, "dr": "OBSERVATION_ID|"+observationId}, {body: dataObservation, json: true}, function(error, response, body){
											observationSampledData = body;
											if(observationSampledData.err_code > 0){
												res.json(observationSampledData);	
											}else{
												res.json({"err_code": 0, "err_msg": "Observation Sampled Data has been update in this Observation.", "data": observationSampledData.data});
											}
										})
									}else{
										res.json({"err_code": 505, "err_msg": "Observation Sampled Data Id not found"});		
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Observation Id not found"});		
							}
						});
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
			var observationId = req.params.observation_id;
			var attachmentId = req.params.attachment_id;

			var err_code = 0;
			var err_msg = "";
			var dataAttachment = {};

			//input check 
			if(typeof observationId !== 'undefined'){
				if(validator.isEmpty(observationId)){
					err_code = 2;
					err_msg = "Observation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation id is required";
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
						myEmitter.prependOnceListener('checkObservationID', function(){
							checkUniqeValue(apikey, "OBSERVATION_ID|" + observationId, 'OBSERVATION', function(resObservationId){
								if(resObservationId.err_code > 0){
									checkUniqeValue(apikey, "ATTACHMENT_ID|" + attachmentId, 'ATTACHMENT', function(resAttachmentID){
										if(resAttachmentID.err_code > 0){
											ApiFHIR.put('attachment', {"apikey": apikey, "_id": attachmentId, "dr": "OBSERVATION_ID|"+observationId}, {body: dataAttachment, json: true}, function(error, response, body){
												attachment = body;
												if(attachment.err_code > 0){
													res.json(attachment);	
												}else{
													res.json({"err_code": 0, "err_msg": "Photo has been update in this observation.", "data": attachment.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Photo Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Observation Id not found"});		
								}
							})
						})

						if(validator.isEmpty(attachmentLanguageCode)){
							myEmitter.emit('checkObservationID');	
						}else{
							checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resLanguageCode){
								if(resLanguageCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkObservationID');
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
		observationComponentReferenceRange: function updateObservationComponentReferenceRange(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var observationComponentId = req.params.observation_component_id;
			var observationComponentReferenceRangeId = req.params.observation_component_reference_range_id;

			var err_code = 0;
			var err_msg = "";
			var dataObservation = {};
			//input check 
			if(typeof observationComponentId !== 'undefined'){
				if(validator.isEmpty(observationComponentId)){
					err_code = 2;
					err_msg = "Observation component id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation component id is required";
			}

			if(typeof observationComponentReferenceRangeId !== 'undefined'){
				if(validator.isEmpty(observationComponentReferenceRangeId)){
					err_code = 2;
					err_msg = "Observation component Reference Range id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation component Reference Range id is required";
			}
			
			/*
			var reference_range_id  = req.params._id;
			var low  = req.body.low; 
			var high  = req.body.high;
			var type  = req.body.type;
			var applies_to  = req.body.applies_to;
			var age_low  = req.body.age_low;
			var age_high  = req.body.age_high;
			var text  = req.body.text;
			var observation_component_id  = req.body.observation_component_id;
			*/
			if(typeof req.body.low !== 'undefined' && req.body.low !== ""){
				var referenceRangeLow =  req.body.low;
				if(validator.isEmpty(referenceRangeLow)){
					dataObservation.low = "";
				}else{
					if(!validator.isInt(referenceRangeLow)){
						err_code = 2;
						err_msg = "observation component reference range low is must be number.";
					}else{
						dataObservation.low = referenceRangeLow;
					}
				}
			}else{
			  referenceRangeLow = "";
			}

			if(typeof req.body.high !== 'undefined' && req.body.high !== ""){
				var referenceRangeHigh =  req.body.high;
				if(validator.isEmpty(referenceRangeHigh)){
					dataObservation.high = "";
				}else{
					if(!validator.isInt(referenceRangeHigh)){
						err_code = 2;
						err_msg = "observation component reference range high is must be number.";
					}else{
						dataObservation.high = referenceRangeHigh;
					}
				}
			}else{
			  referenceRangeHigh = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var referenceRangeType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeType)){
					dataObservation.type = "";
				}else{
					dataObservation.type = referenceRangeType;
				}
			}else{
			  referenceRangeType = "";
			}

			if(typeof req.body.appliesTo !== 'undefined' && req.body.appliesTo !== ""){
				var referenceRangeAppliesTo =  req.body.appliesTo.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeAppliesTo)){
					dataObservation.applies_to = "";
				}else{
					dataObservation.applies_to = referenceRangeAppliesTo;
				}
			}else{
			  referenceRangeAppliesTo = "";
			}

			if (typeof req.body.age !== 'undefined' && req.body.age !== "") {
			  var referenceRangeAge = req.body.age;
			  if (referenceRangeAge.indexOf("to") > 0) {
			    arrReferenceRangeAge = referenceRangeAge.split("to");
			    dataObservation.age_low = arrReferenceRangeAge[0];
			    dataObservation.age_high = arrReferenceRangeAge[1];
				} else {
			  	err_code = 2;
			  	err_msg = "observation component reference range age invalid range format.";
				}
			} else {
			  referenceRangeAge = "";
			}

			if(typeof req.body.text !== 'undefined' && req.body.text !== ""){
				var referenceRangeText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(referenceRangeText)){
					dataObservation.text = "";
				}else{
					dataObservation.text = referenceRangeText;
				}
			}else{
			  referenceRangeText = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkObservationID', function(){
							checkUniqeValue(apikey, "component_id|" + observationComponentId, 'observation_component', function(resObservationId){
								if(resObservationId.err_code > 0){
									checkUniqeValue(apikey, "REFERENCE_RANGE_ID|" + observationComponentReferenceRangeId, 'OBSERVATION_REFERENCE_RANGE', function(resObservationComponentReferenceRangeID){
										if(resObservationComponentReferenceRangeID.err_code > 0){
											ApiFHIR.put('observationReferenceRange', {"apikey": apikey, "_id": observationComponentReferenceRangeId, "dr": "component_id|"+observationComponentId}, {body: dataObservation, json: true}, function(error, response, body){
												observationComponentReferenceRange = body;
												if(observationComponentReferenceRange.err_code > 0){
													res.json(observationComponentReferenceRange);	
												}else{
													res.json({"err_code": 0, "err_msg": "Observation component Reference Range has been update in this Observation component.", "data": observationComponentReferenceRange.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Observation component Reference Range Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Observation component Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkReferenceRangeAppliesTo', function () {
							if (!validator.isEmpty(referenceRangeAppliesTo)) {
								checkCode(apikey, referenceRangeAppliesTo, 'REFERENCERANGE_MEANING', function (resReferenceRangeAppliesToCode) {
									if (resReferenceRangeAppliesToCode.err_code > 0) {
										myEmitter.emit('checkObservationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Reference range applies to code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkObservationID');
							}
						})

						if (!validator.isEmpty(referenceRangeType)) {
							checkCode(apikey, referenceRangeType, 'REFERENCERANGE_APPLIESTO', function (resReferenceRangeTypeCode) {
								if (resReferenceRangeTypeCode.err_code > 0) {
									myEmitter.emit('checkReferenceRangeAppliesTo');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Reference range type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkReferenceRangeAppliesTo');
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
		observationComponentSampledData: function updateObservationComponentSampledData(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var observationComponentId = req.params.observation_component_id;
			var observationComponentSampledDataId = req.params.observation_component_sampled_data_id;

			var err_code = 0;
			var err_msg = "";
			var dataObservation = {};
			//input check 
			if(typeof observationComponentId !== 'undefined'){
				if(validator.isEmpty(observationComponentId)){
					err_code = 2;
					err_msg = "Observation component id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation component id is required";
			}

			if(typeof observationComponentSampledDataId !== 'undefined'){
				if(validator.isEmpty(observationComponentSampledDataId)){
					err_code = 2;
					err_msg = "Observation component Sampled Data id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation component Sampled Data id is required";
			}
			
			/*
			var sampled_data_id  = req.params._id;
			var origin  = req.body.origin;
			var period  = req.body.period;
			var factor  = req.body.factor;
			var lower_limit   = req.body.lower_limit;
			var upper_limit  = req.body.upper_limit;
			var dimensions  = req.body.dimensions;
			var data  = req.body.data;
			*/
			
			if(typeof req.body.origin !== 'undefined' && req.body.origin !== ""){
				var valueValueSampledDataOrigin =  req.body.origin;
				if(validator.isEmpty(valueValueSampledDataOrigin)){
					dataObservation.origin = "";
				}else{
					if(!validator.isInt(valueValueSampledDataOrigin)){
						err_code = 2;
						err_msg = "observation component value value sampled data origin is must be number.";
					}else{
						dataObservation.origin = valueValueSampledDataOrigin;
					}
				}
			}else{
			  valueValueSampledDataOrigin = "";
			}

			if(typeof req.body.period !== 'undefined' && req.body.period !== ""){
				var valueValueSampledDataPeriod =  req.body.period;
				if(validator.isEmpty(valueValueSampledDataPeriod)){
					dataObservation.period = "";
				}else{
					if(!validator.isInt(valueValueSampledDataPeriod)){
						err_code = 2;
						err_msg = "observation component value value sampled data period is must be number.";
					}else{
						dataObservation.period = valueValueSampledDataPeriod;
					}
				}
			}else{
			  valueValueSampledDataPeriod = "";
			}

			if(typeof req.body.factor !== 'undefined' && req.body.factor !== ""){
				var valueValueSampledDataFactor =  req.body.factor;
				if(validator.isEmpty(valueValueSampledDataFactor)){
					dataObservation.factor = "";
				}else{
					if(!validator.isInt(valueValueSampledDataFactor)){
						err_code = 2;
						err_msg = "observation component value value sampled data factor is must be number.";
					}else{
						dataObservation.factor = valueValueSampledDataFactor;
					}
				}
			}else{
			  valueValueSampledDataFactor = "";
			}

			if(typeof req.body.lowerLimit !== 'undefined' && req.body.lowerLimit !== ""){
				var valueValueSampledDataLowerLimit =  req.body.lowerLimit;
				if(validator.isEmpty(valueValueSampledDataLowerLimit)){
					dataObservation.lower_limit = "";
				}else{
					if(!validator.isInt(valueValueSampledDataLowerLimit)){
						err_code = 2;
						err_msg = "observation component value value sampled data lower limit is must be number.";
					}else{
						dataObservation.lower_limit = valueValueSampledDataLowerLimit;
					}
				}
			}else{
			  valueValueSampledDataLowerLimit = "";
			}

			if(typeof req.body.upperLimit !== 'undefined' && req.body.upperLimit !== ""){
				var valueValueSampledDataUpperLimit =  req.body.upperLimit;
				if(validator.isEmpty(valueValueSampledDataUpperLimit)){
					dataObservation.upper_limit = "";
				}else{
					if(!validator.isInt(valueValueSampledDataUpperLimit)){
						err_code = 2;
						err_msg = "observation component value value sampled data upper limit is must be number.";
					}else{
						dataObservation.upper_limit = valueValueSampledDataUpperLimit;
					}
				}
			}else{
			  valueValueSampledDataUpperLimit = "";
			}

			if(typeof req.body.dimensions !== 'undefined' && req.body.dimensions !== ""){
				var valueValueSampledDataDimensions =  req.body.dimensions;
				if(validator.isEmpty(valueValueSampledDataDimensions)){
					dataObservation.dimensions = "";
				}else{
					if(!validator.isInt(valueValueSampledDataDimensions)){
						err_code = 2;
						err_msg = "observation component value value sampled data dimensions is must be number.";
					}else{
						dataObservation.dimensions = valueValueSampledDataDimensions;
					}
				}
			}else{
			  valueValueSampledDataDimensions = "";
			}

			if(typeof req.body.data !== 'undefined' && req.body.data !== ""){
				var valueValueSampledDataData =  req.body.data.trim().toLowerCase();
				if(validator.isEmpty(valueValueSampledDataData)){
					dataObservation.data = "";
				}else{
					dataObservation.data = valueValueSampledDataData;
				}
			}else{
			  valueValueSampledDataData = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						checkUniqeValue(apikey, "component_id|" + observationComponentId, 'observation_component', function(resObservationId){
							if(resObservationId.err_code > 0){
								checkUniqeValue(apikey, "SAMPLED_DATA_ID|" + observationComponentSampledDataId, 'SAMPLED_DATA', function(resObservationComponentSampledDataID){
									if(resObservationComponentSampledDataID.err_code > 0){
										ApiFHIR.put('observationSampledData', {"apikey": apikey, "_id": observationComponentSampledDataId, "dr": "component_id|"+observationComponentId}, {body: dataObservation, json: true}, function(error, response, body){
											observationComponentSampledData = body;
											if(observationComponentSampledData.err_code > 0){
												res.json(observationComponentSampledData);	
											}else{
												res.json({"err_code": 0, "err_msg": "Observation component Sampled Data has been update in this Observation component.", "data": observationComponentSampledData.data});
											}
										})
									}else{
										res.json({"err_code": 505, "err_msg": "Observation component Sampled Data Id not found"});		
									}
								})
							}else{
								res.json({"err_code": 504, "err_msg": "Observation component Id not found"});		
							}
						});
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
		attachmentComponent: function updateAttachmentComponent(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var componentId = req.params.component_id;
			var attachmentId = req.params.attachment_id;

			var err_code = 0;
			var err_msg = "";
			var dataAttachment = {};

			//input check 
			if(typeof componentId !== 'undefined'){
				if(validator.isEmpty(componentId)){
					err_code = 2;
					err_msg = "Observation Component id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Observation Component id is required";
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
						myEmitter.prependOnceListener('checkObservationID', function(){
							checkUniqeValue(apikey, "COMPONENT_ID|" + componentId, 'OBSERVATION_COMPONENT', function(resObservationId){
								if(resObservationId.err_code > 0){
									checkUniqeValue(apikey, "ATTACHMENT_ID|" + attachmentId, 'ATTACHMENT', function(resAttachmentID){
										if(resAttachmentID.err_code > 0){
											ApiFHIR.put('attachment', {"apikey": apikey, "_id": attachmentId, "dr": "COMPONENT_ID|"+componentId}, {body: dataAttachment, json: true}, function(error, response, body){
												attachment = body;
												if(attachment.err_code > 0){
													res.json(attachment);	
												}else{
													res.json({"err_code": 0, "err_msg": "Photo has been update in this observation component.", "data": attachment.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Photo Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Observation Id not found"});		
								}
							})
						})

						if(validator.isEmpty(attachmentLanguageCode)){
							myEmitter.emit('checkObservationID');	
						}else{
							checkCode(apikey, attachmentLanguageCode, 'LANGUAGES', function(resLanguageCode){
								if(resLanguageCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkObservationID');
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