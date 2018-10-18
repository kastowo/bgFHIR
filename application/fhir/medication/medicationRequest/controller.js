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
		immunizationRecommendation : function getImmunizationRecommendation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			/*var immunizationRecommendationId = req.query._id;
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

			if(typeof immunizationRecommendationId !== 'undefined'){
				if(!validator.isEmpty(immunizationRecommendationId)){
					qString.immunizationRecommendationId = immunizationRecommendationId; 
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
				"ImmunizationRecommendation" : {
					"location": "%(apikey)s/ImmunizationRecommendation",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('ImmunizationRecommendation', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var immunizationRecommendation = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(immunizationRecommendation.err_code == 0){
								//cek jumdata dulu
								if(immunizationRecommendation.data.length > 0){
									newImmunizationRecommendation = [];
									for(i=0; i < immunizationRecommendation.data.length; i++){
										myEmitter.once("getIdentifier", function(immunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation){
											/*console.log(immunizationRecommendation);*/
														//get identifier
														qString = {};
														qString.immunization_recommendation_id = immunizationRecommendation.id;
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
																var objectImmunizationRecommendation = {};
																objectImmunizationRecommendation.resourceType = immunizationRecommendation.resourceType;
																objectImmunizationRecommendation.id = immunizationRecommendation.id;
																objectImmunizationRecommendation.identifier = identifier.data;
																objectImmunizationRecommendation.patient = immunizationRecommendation.patient;
																
																newImmunizationRecommendation[index] = objectImmunizationRecommendation;
																
																/*if(index == countImmunizationRecommendation -1 ){
																	res.json({"err_code": 0, "data":newImmunizationRecommendation});				
																}
*/
																myEmitter.once('getImmunizationRecommendationRecommendation', function(immunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation){
																				qString = {};
																				qString.immunization_recommendation_id = immunizationRecommendation.id;
																				seedPhoenixFHIR.path.GET = {
																					"ImmunizationRecommendationRecommendation" : {
																						"location": "%(apikey)s/ImmunizationRecommendationRecommendation",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('ImmunizationRecommendationRecommendation', {"apikey": apikey}, {}, function(error, response, body){
																					immunizationRecommendationRecommendation = JSON.parse(body);
																					if(immunizationRecommendationRecommendation.err_code == 0){
																						var objectImmunizationRecommendation = {};
																						objectImmunizationRecommendation.resourceType = immunizationRecommendation.resourceType;
																						objectImmunizationRecommendation.id = immunizationRecommendation.id;
																						objectImmunizationRecommendation.identifier = immunizationRecommendation.identifier;
																						objectImmunizationRecommendation.patient = immunizationRecommendation.patient;
																						objectImmunizationRecommendation.recommendation = immunizationRecommendationRecommendation.data;
																						

																						newImmunizationRecommendation[index] = objectImmunizationRecommendation;

																						/*if(index == countImmunizationRecommendation -1 ){
																							res.json({"err_code": 0, "data":newImmunizationRecommendation});				
																						}*/
																						myEmitter.once('getImmunizationRecommendationDateCriterion', function(immunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation){
																							qString = {};
																							qString.recommendation_id = immunizationRecommendation.recommendation.id;
																							seedPhoenixFHIR.path.GET = {
																								"ImmunizationRecommendationDateCriterion" : {
																									"location": "%(apikey)s/ImmunizationRecommendationDateCriterion",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('ImmunizationRecommendationDateCriterion', {"apikey": apikey}, {}, function(error, response, body){
																								immunizationRecommendationDateCriterion = JSON.parse(body);
																								console.log(immunizationRecommendationDateCriterion);
																								if(immunizationRecommendationDateCriterion.err_code == 0){
																									var objectImmunizationRecommendation = {};
																									objectImmunizationRecommendation.resourceType = immunizationRecommendation.resourceType;
																									objectImmunizationRecommendation.id = immunizationRecommendation.id;
																									objectImmunizationRecommendation.identifier = immunizationRecommendation.identifier;
																									objectImmunizationRecommendation.patient = immunizationRecommendation.patient;
																									var Recommendation = {};
																									Recommendation.id = immunizationRecommendation.recommendation.id;
																									Recommendation.date = immunizationRecommendation.recommendation.date;
																									Recommendation.vaccineCode = immunizationRecommendation.recommendation.vaccine_code;
																									Recommendation.targetDisease = immunizationRecommendation.recommendation.target_disease;
																									Recommendation.doseNumber = immunizationRecommendation.recommendation.dose_number;
																									Recommendation.forecastStatus = immunizationRecommendation.recommendation.forecast_status;
																									Recommendation.dateCriterion = immunizationRecommendationDateCriterion.data;
																									Recommendation.protocol = immunizationRecommendation.recommendation.protocol;										
																									objectImmunizationRecommendation.recommendation = Recommendation;
															
																									newImmunizationRecommendation[index] = objectImmunizationRecommendation;
																									
																									/*if(index == countImmunizationRecommendation -1 ){
																										res.json({"err_code": 0, "data":newImmunizationRecommendation});				
																									}*/

																									myEmitter.once('getSupportingImmunization', function(immunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation){
																										qString = {};
																										qString.recommendation_id = immunizationRecommendation.recommendation.id;
																										seedPhoenixFHIR.path.GET = {
																											"SupportingImmunization" : {
																												"location": "%(apikey)s/ImmunizationRecommendationSupportingImmunization",
																												"query": qString
																											}
																										}	
																										ApiFHIR.get('SupportingImmunization', {"apikey": apikey}, {}, function(error, response, body){
																											supportingImmunization = JSON.parse(body);
																											if(supportingImmunization.err_code == 0){
																												var objectImmunizationRecommendation = {};
objectImmunizationRecommendation.resourceType = immunizationRecommendation.resourceType;
objectImmunizationRecommendation.id = immunizationRecommendation.id;
objectImmunizationRecommendation.identifier = immunizationRecommendation.identifier;
objectImmunizationRecommendation.patient = immunizationRecommendation.patient;
var Recommendation = {};
Recommendation.id = immunizationRecommendation.recommendation.id;
Recommendation.date = immunizationRecommendation.recommendation.date;
Recommendation.vaccineCode = immunizationRecommendation.recommendation.vaccine_code;
Recommendation.targetDisease = immunizationRecommendation.recommendation.target_disease;
Recommendation.doseNumber = immunizationRecommendation.recommendation.dose_number;
Recommendation.forecastStatus = immunizationRecommendation.recommendation.forecast_status;
Recommendation.dateCriterion = immunizationRecommendation.recommendation.dateCriterion;
Recommendation.protocol = immunizationRecommendation.recommendation.protocol;	
Recommendation.supportingImmunization = immunizationRecommendation.recommendation.supportingImmunization.data;
objectImmunizationRecommendation.recommendation = Recommendation;
																												

																												newImmunizationRecommendation[index] = objectImmunizationRecommendation;

																												myEmitter.once('getSupportingPatientInformationObservation', function(immunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation){
																													qString = {};
																													qString.recommendation_id = immunizationRecommendation.recommendation.id;
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
																															var objectImmunizationRecommendation = {};
objectImmunizationRecommendation.resourceType = immunizationRecommendation.resourceType;
objectImmunizationRecommendation.id = immunizationRecommendation.id;
objectImmunizationRecommendation.identifier = immunizationRecommendation.identifier;
objectImmunizationRecommendation.patient = immunizationRecommendation.patient;
var Recommendation = {};
Recommendation.id = immunizationRecommendation.recommendation.id;
Recommendation.date = immunizationRecommendation.recommendation.date;
Recommendation.vaccineCode = immunizationRecommendation.recommendation.vaccine_code;
Recommendation.targetDisease = immunizationRecommendation.recommendation.target_disease;
Recommendation.doseNumber = immunizationRecommendation.recommendation.dose_number;
Recommendation.forecastStatus = immunizationRecommendation.recommendation.forecast_status;
Recommendation.dateCriterion = immunizationRecommendation.recommendation.dateCriterion;
Recommendation.protocol = immunizationRecommendation.recommendation.protocol;
Recommendation.supportingImmunization = immunizationRecommendation.recommendation.supportingImmunization;	
var SupportingPatientInformation = {};
SupportingPatientInformation.observation = informationObservation.data;																
Recommendation.supportingPatientInformation = SupportingPatientInformation;
																															
objectImmunizationRecommendation.recommendation = Recommendation;

																															newImmunizationRecommendation[index] = objectImmunizationRecommendation;

																															myEmitter.once('getSupportingPatientInformationAllergyIntolerance', function(immunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation){
																																qString = {};
																																qString.recommendation_id = immunizationRecommendation.recommendation.id;
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
																																		var objectImmunizationRecommendation = {};
objectImmunizationRecommendation.resourceType = immunizationRecommendation.resourceType;
objectImmunizationRecommendation.id = immunizationRecommendation.id;
objectImmunizationRecommendation.identifier = immunizationRecommendation.identifier;
objectImmunizationRecommendation.patient = immunizationRecommendation.patient;
var Recommendation = {};
Recommendation.id = immunizationRecommendation.recommendation.id;
Recommendation.date = immunizationRecommendation.recommendation.date;
Recommendation.vaccineCode = immunizationRecommendation.recommendation.vaccine_code;
Recommendation.targetDisease = immunizationRecommendation.recommendation.target_disease;
Recommendation.doseNumber = immunizationRecommendation.recommendation.dose_number;
Recommendation.forecastStatus = immunizationRecommendation.recommendation.forecast_status;
Recommendation.dateCriterion = immunizationRecommendation.recommendation.dateCriterion;
Recommendation.protocol = immunizationRecommendation.recommendation.protocol;
Recommendation.supportingImmunization = immunizationRecommendation.recommendation.supportingImmunization;	
var SupportingPatientInformation = {};
SupportingPatientInformation.observation = immunizationRecommendation.recommendation.supportingPatientInformation.observation;
																																		
SupportingPatientInformation.allergyIntolerance = informationAllergyIntolerance.data;
Recommendation.supportingPatientInformation = SupportingPatientInformation;
																																		
objectImmunizationRecommendation.recommendation = Recommendation;

																																		newImmunizationRecommendation[index] = objectImmunizationRecommendation;

																																		if(index == countImmunizationRecommendation -1 ){
																																			res.json({"err_code": 0, "data":newImmunizationRecommendation});				
																																		}

																																	}else{
																																		res.json(informationAllergyIntolerance);			
																																	}
																																})
																															})
																															myEmitter.emit('getSupportingPatientInformationAllergyIntolerance', objectImmunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation);

																														}else{
																															res.json(informationObservation);			
																														}
																													})
																												})
																												myEmitter.emit('getSupportingPatientInformationObservation', objectImmunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation);			
																											}else{
																												res.json(supportingImmunization);			
																											}
																										})
																									})
																									myEmitter.emit('getSupportingImmunization', objectImmunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation);			
																								}else{
																									res.json(immunizationRecommendationDateCriterion);			
																								}
																							})
																						})
																						myEmitter.emit('getImmunizationRecommendationDateCriterion', objectImmunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation);
																					}else{
																						res.json(immunizationRecommendationRecommendation);			
																					}
																				})
																			})
																myEmitter.emit('getImmunizationRecommendationRecommendation', objectImmunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation);
															}else{
																res.json(identifier);
															}
														})
													})
										myEmitter.emit("getIdentifier", immunizationRecommendation.data[i], i, newImmunizationRecommendation, immunizationRecommendation.data.length);
										//res.json({"err_code": 0, "err_msg": "endpoint is not empty."});		
									}
									 //res.json({"err_code": 0, "data":organization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Immunization Recommendation is empty."});	
								}
							}else{
								res.json(immunizationRecommendation);
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
		immunizationRecommendation : function addImmunizationRecommendation(req, res){
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
patient|patient||
recommendation.date|recommendationDate|date|nn
recommendation.vaccineCode|recommendationVaccineCode||
recommendation.targetDisease|recommendationTargetDisease||
recommendation.doseNumber|recommendationDoseNumber|integer|
recommendation.forecastStatus|recommendationForecastStatus||nn
recommendation.dateCriterion.code|recommendationDateCriterionCode||nn
recommendation.dateCriterion.value|recommendationDateCriterionValue|date|
recommendation.protocol.doseSequence|recommendationProtocolDoseSequence|integer|
recommendation.protocol.description|recommendationProtocolDescription||
recommendation.protocol.authority|recommendationProtocolAuthority||
recommendation.protocol.series|recommendationProtocolSeries||
recommendation.supportingImmunization|recommendationSupportingImmunization||
recommendation.supportingPatientInformation.observation|recommendationSupportingPatientInformationObservation||
recommendation.supportingPatientInformation.allergyIntolerance|recommendationSupportingPatientInformationAllergyIntolerance||
*/
			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					patient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Immunization request.";
			}

			if(typeof req.body.recommendation.date !== 'undefined'){
				var recommendationDate =  req.body.recommendation.date;
				if(validator.isEmpty(recommendationDate)){
					err_code = 2;
					err_msg = "Immunization recommendation date is required.";
				}else{
					if(!regex.test(recommendationDate)){
						err_code = 2;
						err_msg = "Immunization recommendation date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation date' in json Immunization request.";
			}

			if(typeof req.body.recommendation.vaccineCode !== 'undefined'){
				var recommendationVaccineCode =  req.body.recommendation.vaccineCode.trim().toLowerCase();
				if(validator.isEmpty(recommendationVaccineCode)){
					recommendationVaccineCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation vaccine code' in json Immunization request.";
			}

			if(typeof req.body.recommendation.targetDisease !== 'undefined'){
				var recommendationTargetDisease =  req.body.recommendation.targetDisease.trim().toLowerCase();
				if(validator.isEmpty(recommendationTargetDisease)){
					recommendationTargetDisease = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation target disease' in json Immunization request.";
			}

			if(typeof req.body.recommendation.doseNumber !== 'undefined'){
				var recommendationDoseNumber =  req.body.recommendation.doseNumber;
				if(validator.isEmpty(recommendationDoseNumber)){
					recommendationDoseNumber = "";
				}else{
					if(validator.isInt(recommendationDoseNumber)){
						err_code = 2;
						err_msg = "Immunization recommendation dose number is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation dose number' in json Immunization request.";
			}

			if(typeof req.body.recommendation.forecastStatus !== 'undefined'){
				var recommendationForecastStatus =  req.body.recommendation.forecastStatus.trim().toLowerCase();
				if(validator.isEmpty(recommendationForecastStatus)){
					err_code = 2;
					err_msg = "Immunization recommendation forecast status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation forecast status' in json Immunization request.";
			}

			if(typeof req.body.recommendation.dateCriterion.code !== 'undefined'){
				var recommendationDateCriterionCode =  req.body.recommendation.dateCriterion.code.trim().toLowerCase();
				if(validator.isEmpty(recommendationDateCriterionCode)){
					err_code = 2;
					err_msg = "Immunization recommendation date criterion code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation date criterion code' in json Immunization request.";
			}

			if(typeof req.body.recommendation.dateCriterion.value !== 'undefined'){
				var recommendationDateCriterionValue =  req.body.recommendation.dateCriterion.value;
				if(validator.isEmpty(recommendationDateCriterionValue)){
					err_code = 2;
					err_msg = "Immunization recommendation date criterion value is required.";
				}else{
					if(!regex.test(recommendationDateCriterionValue)){
						err_code = 2;
						err_msg = "Immunization recommendation date criterion value invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation date criterion value' in json Immunization request.";
			}

			if(typeof req.body.recommendation.protocol.doseSequence !== 'undefined'){
				var recommendationProtocolDoseSequence =  req.body.recommendation.protocol.doseSequence;
				if(validator.isEmpty(recommendationProtocolDoseSequence)){
					recommendationProtocolDoseSequence = "";
				}else{
					if(validator.isInt(recommendationProtocolDoseSequence)){
						err_code = 2;
						err_msg = "Immunization recommendation protocol dose sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation protocol dose sequence' in json Immunization request.";
			}

			if(typeof req.body.recommendation.protocol.description !== 'undefined'){
				var recommendationProtocolDescription =  req.body.recommendation.protocol.description.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolDescription)){
					recommendationProtocolDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation protocol description' in json Immunization request.";
			}

			if(typeof req.body.recommendation.protocol.authority !== 'undefined'){
				var recommendationProtocolAuthority =  req.body.recommendation.protocol.authority.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolAuthority)){
					recommendationProtocolAuthority = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation protocol authority' in json Immunization request.";
			}

			if(typeof req.body.recommendation.protocol.series !== 'undefined'){
				var recommendationProtocolSeries =  req.body.recommendation.protocol.series.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolSeries)){
					recommendationProtocolSeries = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation protocol series' in json Immunization request.";
			}

			if(typeof req.body.recommendation.supportingImmunization !== 'undefined'){
				var recommendationSupportingImmunization =  req.body.recommendation.supportingImmunization.trim().toLowerCase();
				if(validator.isEmpty(recommendationSupportingImmunization)){
					recommendationSupportingImmunization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation supporting immunization' in json Immunization request.";
			}

			if(typeof req.body.recommendation.supportingPatientInformation.observation !== 'undefined'){
				var recommendationSupportingPatientInformationObservation =  req.body.recommendation.supportingPatientInformation.observation.trim().toLowerCase();
				if(validator.isEmpty(recommendationSupportingPatientInformationObservation)){
					recommendationSupportingPatientInformationObservation = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation supporting patient information observation' in json Immunization request.";
			}

			if(typeof req.body.recommendation.supportingPatientInformation.allergyIntolerance !== 'undefined'){
				var recommendationSupportingPatientInformationAllergyIntolerance =  req.body.recommendation.supportingPatientInformation.allergyIntolerance.trim().toLowerCase();
				if(validator.isEmpty(recommendationSupportingPatientInformationAllergyIntolerance)){
					recommendationSupportingPatientInformationAllergyIntolerance = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'recommendation supporting patient information allergy intolerance' in json Immunization request.";
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
														var immunizationRecommendationId = 'ire' + unicId;
														var immunizationRecommendationRecommendationId = 'irr' + unicId;
														var immunizationRecommendationDateCriterionId = 'ird' + unicId;

														dataImmunizationRecommendation = {
															"immunization_recommendation_id" : immunizationRecommendationId,
															"patient" : patient
														}
														console.log(dataImmunizationRecommendation);
														ApiFHIR.post('immunizationRecommendation', {"apikey": apikey}, {body: dataImmunizationRecommendation, json: true}, function(error, response, body){
															immunizationRecommendation = body;
															if(immunizationRecommendation.err_code > 0){
																res.json(immunizationRecommendation);	
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
																							"care_team_id": immunizationRecommendationId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														//ImmunizationRecommendationRecommendation
														dataImmunizationRecommendationRecommendation = {
															"recommendation_id" : immunizationRecommendationRecommendationId,
															"date" : recommendationDate,
															"vaccine_code" : recommendationVaccineCode,
															"target_disease" : recommendationTargetDisease,
															"dose_number" : recommendationDoseNumber,
															"forecast_status" : recommendationForecastStatus,
															"protocol_dose_sequence" : recommendationProtocolDoseSequence,
															"protocol_description" : recommendationProtocolDescription,
															"protocol_authority" : recommendationProtocolAuthority,
															"protocol_series" : recommendationProtocolSeries,
															"immunization_recommendation_id" : immunizationRecommendationId
														}
														ApiFHIR.post('immunizationRecommendationRecommendation', {"apikey": apikey}, {body: dataImmunizationRecommendationRecommendation, json: true}, function(error, response, body){
															immunizationRecommendationRecommendation = body;
															if(immunizationRecommendationRecommendation.err_code > 0){
																res.json(immunizationRecommendationRecommendation);	
																console.log("ok");
															}
														});
														
														//ImmunizationRecommendationDateCriterion
														dataImmunizationRecommendationDateCriterion = {
															"date_creation_id" : immunizationRecommendationDateCriterionId,
															"code" : recommendationDateCriterionCode,
															"value" : recommendationDateCriterionValue,
															"recommendation_id" : immunizationRecommendationRecommendationId
														}
														ApiFHIR.post('immunizationRecommendationDateCriterion', {"apikey": apikey}, {body: dataImmunizationRecommendationDateCriterion, json: true}, function(error, response, body){
															immunizationRecommendationDateCriterion = body;
															if(immunizationRecommendationDateCriterion.err_code > 0){
																res.json(immunizationRecommendationDateCriterion);	
																console.log("ok");
															}
														});
														
														res.json({"err_code": 0, "err_msg": "Immunization Recommendation has been add.", "data": [{"_id": immunizationRecommendationId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										//cek code
										/*
										recommendationVaccineCode|vaccine_code
										recommendationTargetDisease|immunization_recommendation_target_disease
										recommendationForecastStatus|immunization_recommendation_status
										recommendationDateCriterionCode|immunization_recommendation_date_criterion
										*/
										myEmitter.prependOnceListener('checkRecommendationVaccineCode', function () {
											if (!validator.isEmpty(recommendationVaccineCode)) {
												checkCode(apikey, recommendationVaccineCode, 'VACCINE_CODE', function (resRecommendationVaccineCodeCode) {
													if (resRecommendationVaccineCodeCode.err_code > 0) {
														myEmitter.emit('checkIdentifierValue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recommendation vaccine code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkIdentifierValue');
											}
										})

										myEmitter.prependOnceListener('checkRecommendationTargetDisease', function () {
											if (!validator.isEmpty(recommendationTargetDisease)) {
												checkCode(apikey, recommendationTargetDisease, 'IMMUNIZATION_RECOMMENDATION_TARGET_DISEASE', function (resRecommendationTargetDiseaseCode) {
													if (resRecommendationTargetDiseaseCode.err_code > 0) {
														myEmitter.emit('checkRecommendationVaccineCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recommendation target disease code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecommendationVaccineCode');
											}
										})

										myEmitter.prependOnceListener('checkRecommendationForecastStatus', function () {
											if (!validator.isEmpty(recommendationForecastStatus)) {
												checkCode(apikey, recommendationForecastStatus, 'IMMUNIZATION_RECOMMENDATION_STATUS', function (resRecommendationForecastStatusCode) {
													if (resRecommendationForecastStatusCode.err_code > 0) {
														myEmitter.emit('checkRecommendationTargetDisease');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recommendation forecast status code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecommendationTargetDisease');
											}
										})

										myEmitter.prependOnceListener('checkRecommendationDateCriterionCode', function () {
											if (!validator.isEmpty(recommendationDateCriterionCode)) {
												checkCode(apikey, recommendationDateCriterionCode, 'IMMUNIZATION_RECOMMENDATION_DATE_CRITERION', function (resRecommendationDateCriterionCodeCode) {
													if (resRecommendationDateCriterionCodeCode.err_code > 0) {
														myEmitter.emit('checkRecommendationForecastStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recommendation date criterion code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecommendationForecastStatus');
											}
										})

										//cek value
										/*
										patient|Patient
										recommendationProtocolAuthority|Organization
										recommendationSupportingImmunization|Immunization
										recommendationSupportingPatientInformationObservation|Observation
										recommendationSupportingPatientInformationAllergyIntolerance|AllergyIntolerance

										*/

										myEmitter.prependOnceListener('checkPatient', function () {
											if (!validator.isEmpty(patient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
													if (resPatient.err_code > 0) {
														myEmitter.emit('checkRecommendationDateCriterionCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecommendationDateCriterionCode');
											}
										})

										myEmitter.prependOnceListener('checkRecommendationProtocolAuthority', function () {
											if (!validator.isEmpty(recommendationProtocolAuthority)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + recommendationProtocolAuthority, 'ORGANIZATION', function (resRecommendationProtocolAuthority) {
													if (resRecommendationProtocolAuthority.err_code > 0) {
														myEmitter.emit('checkPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recommendation protocol authority id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPatient');
											}
										})

										myEmitter.prependOnceListener('checkRecommendationSupportingImmunization', function () {
											if (!validator.isEmpty(recommendationSupportingImmunization)) {
												checkUniqeValue(apikey, "IMMUNIZATION_ID|" + recommendationSupportingImmunization, 'IMMUNIZATION', function (resRecommendationSupportingImmunization) {
													if (resRecommendationSupportingImmunization.err_code > 0) {
														myEmitter.emit('checkRecommendationProtocolAuthority');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recommendation supporting immunization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecommendationProtocolAuthority');
											}
										})

										myEmitter.prependOnceListener('checkRecommendationSupportingPatientInformationObservation', function () {
											if (!validator.isEmpty(recommendationSupportingPatientInformationObservation)) {
												checkUniqeValue(apikey, "OBSERVATION_ID|" + recommendationSupportingPatientInformationObservation, 'OBSERVATION', function (resRecommendationSupportingPatientInformationObservation) {
													if (resRecommendationSupportingPatientInformationObservation.err_code > 0) {
														myEmitter.emit('checkRecommendationSupportingImmunization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Recommendation supporting patient information observation id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRecommendationSupportingImmunization');
											}
										})

										if (!validator.isEmpty(recommendationSupportingPatientInformationAllergyIntolerance)) {
											checkUniqeValue(apikey, "ALLERGYINTOLERANCE_ID|" + recommendationSupportingPatientInformationAllergyIntolerance, 'ALLERGYINTOLERANCE', function (resRecommendationSupportingPatientInformationAllergyIntolerance) {
												if (resRecommendationSupportingPatientInformationAllergyIntolerance.err_code > 0) {
													myEmitter.emit('checkRecommendationSupportingPatientInformationObservation');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Recommendation supporting patient information allergy intolerance id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkRecommendationSupportingPatientInformationObservation');
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
		immunizationRecommendation : function putImmunizationRecommendation(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var immunizationRecommendationId = req.params.adverse_event_id;

      var err_code = 0;
      var err_msg = "";
      var dataImmunizationRecommendation = {};

			if(typeof immunizationRecommendationId !== 'undefined'){
				if(validator.isEmpty(immunizationRecommendationId)){
					err_code = 2;
					err_msg = "Care Team id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Care Team id is required";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				dataImmunization.patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					err_code = 2;
					err_msg = "Immunization patient is required.";
				}else{
					dataImmunization.patient = patient;
				}
			}else{
				patient = "";
			}

			if(typeof req.body.recommendation.date !== 'undefined' && req.body.recommendation.date !== ""){
				dataImmunization.recommendationDate =  req.body.recommendation.date;
				if(validator.isEmpty(recommendationDate)){
					err_code = 2;
					err_msg = "immunization recommendation date is required.";
				}else{
					if(!regex.test(recommendationDate)){
						err_code = 2;
						err_msg = "immunization recommendation date invalid date format.";	
					}
				}
			}else{
				recommendationDate = "";
			}

			if(typeof req.body.recommendation.vaccineCode !== 'undefined' && req.body.recommendation.vaccineCode !== ""){
				dataImmunization.recommendationVaccineCode =  req.body.recommendation.vaccineCode.trim().toLowerCase();
				if(validator.isEmpty(recommendationVaccineCode)){
					err_code = 2;
					err_msg = "Immunization recommendation vaccine code is required.";
				}else{
					dataImmunization.recommendationVaccineCode = recommendationVaccineCode;
				}
			}else{
				recommendationVaccineCode = "";
			}

			if(typeof req.body.recommendation.targetDisease !== 'undefined' && req.body.recommendation.targetDisease !== ""){
				dataImmunization.recommendationTargetDisease =  req.body.recommendation.targetDisease.trim().toLowerCase();
				if(validator.isEmpty(recommendationTargetDisease)){
					err_code = 2;
					err_msg = "Immunization recommendation target disease is required.";
				}else{
					dataImmunization.recommendationTargetDisease = recommendationTargetDisease;
				}
			}else{
				recommendationTargetDisease = "";
			}

			if(typeof req.body.recommendation.doseNumber !== 'undefined' && req.body.recommendation.doseNumber !== ""){
				dataImmunization.recommendationDoseNumber =  req.body.recommendation.doseNumber;
				if(validator.isInt(recommendationDoseNumber)){
					err_code = 2;
					err_msg = "immunization recommendation dose number is must be number.";
				}
			}else{
				recommendationDoseNumber = "";
			}

			if(typeof req.body.recommendation.forecastStatus !== 'undefined' && req.body.recommendation.forecastStatus !== ""){
				dataImmunization.recommendationForecastStatus =  req.body.recommendation.forecastStatus.trim().toLowerCase();
				if(validator.isEmpty(recommendationForecastStatus)){
					err_code = 2;
					err_msg = "Immunization recommendation forecast status is required.";
				}else{
					dataImmunization.recommendationForecastStatus = recommendationForecastStatus;
				}
			}else{
				recommendationForecastStatus = "";
			}

			if(typeof req.body.recommendation.dateCriterion.code !== 'undefined' && req.body.recommendation.dateCriterion.code !== ""){
				dataImmunization.recommendationDateCriterionCode =  req.body.recommendation.dateCriterion.code.trim().toLowerCase();
				if(validator.isEmpty(recommendationDateCriterionCode)){
					err_code = 2;
					err_msg = "Immunization recommendation date criterion code is required.";
				}else{
					dataImmunization.recommendationDateCriterionCode = recommendationDateCriterionCode;
				}
			}else{
				recommendationDateCriterionCode = "";
			}

			if(typeof req.body.recommendation.dateCriterion.value !== 'undefined' && req.body.recommendation.dateCriterion.value !== ""){
				dataImmunization.recommendationDateCriterionValue =  req.body.recommendation.dateCriterion.value;
				if(validator.isEmpty(recommendationDateCriterionValue)){
					err_code = 2;
					err_msg = "immunization recommendation date criterion value is required.";
				}else{
					if(!regex.test(recommendationDateCriterionValue)){
						err_code = 2;
						err_msg = "immunization recommendation date criterion value invalid date format.";	
					}
				}
			}else{
				recommendationDateCriterionValue = "";
			}

			if(typeof req.body.recommendation.protocol.doseSequence !== 'undefined' && req.body.recommendation.protocol.doseSequence !== ""){
				dataImmunization.recommendationProtocolDoseSequence =  req.body.recommendation.protocol.doseSequence;
				if(validator.isInt(recommendationProtocolDoseSequence)){
					err_code = 2;
					err_msg = "immunization recommendation protocol dose sequence is must be number.";
				}
			}else{
				recommendationProtocolDoseSequence = "";
			}

			if(typeof req.body.recommendation.protocol.description !== 'undefined' && req.body.recommendation.protocol.description !== ""){
				dataImmunization.recommendationProtocolDescription =  req.body.recommendation.protocol.description.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolDescription)){
					err_code = 2;
					err_msg = "Immunization recommendation protocol description is required.";
				}else{
					dataImmunization.recommendationProtocolDescription = recommendationProtocolDescription;
				}
			}else{
				recommendationProtocolDescription = "";
			}

			if(typeof req.body.recommendation.protocol.authority !== 'undefined' && req.body.recommendation.protocol.authority !== ""){
				dataImmunization.recommendationProtocolAuthority =  req.body.recommendation.protocol.authority.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolAuthority)){
					err_code = 2;
					err_msg = "Immunization recommendation protocol authority is required.";
				}else{
					dataImmunization.recommendationProtocolAuthority = recommendationProtocolAuthority;
				}
			}else{
				recommendationProtocolAuthority = "";
			}

			if(typeof req.body.recommendation.protocol.series !== 'undefined' && req.body.recommendation.protocol.series !== ""){
				dataImmunization.recommendationProtocolSeries =  req.body.recommendation.protocol.series.trim().toLowerCase();
				if(validator.isEmpty(recommendationProtocolSeries)){
					err_code = 2;
					err_msg = "Immunization recommendation protocol series is required.";
				}else{
					dataImmunization.recommendationProtocolSeries = recommendationProtocolSeries;
				}
			}else{
				recommendationProtocolSeries = "";
			}

			if(typeof req.body.recommendation.supportingImmunization !== 'undefined' && req.body.recommendation.supportingImmunization !== ""){
				dataImmunization.recommendationSupportingImmunization =  req.body.recommendation.supportingImmunization.trim().toLowerCase();
				if(validator.isEmpty(recommendationSupportingImmunization)){
					err_code = 2;
					err_msg = "Immunization recommendation supporting immunization is required.";
				}else{
					dataImmunization.recommendationSupportingImmunization = recommendationSupportingImmunization;
				}
			}else{
				recommendationSupportingImmunization = "";
			}

			if(typeof req.body.recommendation.supportingPatientInformation.observation !== 'undefined' && req.body.recommendation.supportingPatientInformation.observation !== ""){
				dataImmunization.recommendationSupportingPatientInformationObservation =  req.body.recommendation.supportingPatientInformation.observation.trim().toLowerCase();
				if(validator.isEmpty(recommendationSupportingPatientInformationObservation)){
					err_code = 2;
					err_msg = "Immunization recommendation supporting patient information observation is required.";
				}else{
					dataImmunization.recommendationSupportingPatientInformationObservation = recommendationSupportingPatientInformationObservation;
				}
			}else{
				recommendationSupportingPatientInformationObservation = "";
			}

			if(typeof req.body.recommendation.supportingPatientInformation.allergyIntolerance !== 'undefined' && req.body.recommendation.supportingPatientInformation.allergyIntolerance !== ""){
				dataImmunization.recommendationSupportingPatientInformationAllergyIntolerance =  req.body.recommendation.supportingPatientInformation.allergyIntolerance.trim().toLowerCase();
				if(validator.isEmpty(recommendationSupportingPatientInformationAllergyIntolerance)){
					err_code = 2;
					err_msg = "Immunization recommendation supporting patient information allergy intolerance is required.";
				}else{
					dataImmunization.recommendationSupportingPatientInformationAllergyIntolerance = recommendationSupportingPatientInformationAllergyIntolerance;
				}
			}else{
				recommendationSupportingPatientInformationAllergyIntolerance = "";
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
														var immunizationRecommendationId = 'ade' + unicId;

														dataImmunizationRecommendation = {
															"adverse_event_id" : immunizationRecommendationId,
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
														console.log(dataImmunizationRecommendation);
														ApiFHIR.post('immunizationRecommendation', {"apikey": apikey}, {body: dataImmunizationRecommendation, json: true}, function(error, response, body){
															immunizationRecommendation = body;
															if(immunizationRecommendation.err_code > 0){
																res.json(immunizationRecommendation);	
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
																							"adverse_event_id": immunizationRecommendationId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})*/

														res.json({"err_code": 0, "err_msg": "Care Team has been update.", "data": [{"_id": immunizationRecommendationId}]});

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