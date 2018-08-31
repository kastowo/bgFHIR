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

			//params from query string
			var immunizationRecommendationId = req.query._id;
			
			var date = req.query.date;
			var dose_number = req.query.doseNumber;
			var dose_sequence = req.query.doseSequence;
			var identifier = req.query.identifier;
			var information = req.query.information;
			var patient = req.query.patient;
			var status = req.query.status;
			var support = req.query.support;
			var target_disease = req.query.targetDisease;
			var vaccine_type = req.query.vaccineType;
			
			var qString = {};
			if(typeof immunizationRecommendationId !== 'undefined'){
				if(!validator.isEmpty(immunizationRecommendationId)){
					qString._id = immunizationRecommendationId; 
				}else{
					res.json({"err_code": 1, "err_msg": "immunization recommendation id is required."});
				}
			}
			
			if(typeof date !== 'undefined') {
        if (!validator.isEmpty(date)) {
          if (!regex.test(date)) {
            res.json({
              "err_code": 1,
              "err_msg": "Date invalid format."
            });
          } else {
            qString.date = date;
          }
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Date is empty."
          });
        }
      }
			
			if(typeof dose_number !== 'undefined'){
				if(validator.isInt(dose_number)){
					qString.dose_number = dose_number; 
				}else{
					res.json({"err_code": 1, "err_msg": "Dose number must be number."});
				}
			}

			if(typeof dose_sequence !== 'undefined'){
				if(validator.isInt(dose_sequence)){
					qString.dose_sequence = dose_sequence; 
				}else{
					res.json({"err_code": 1, "err_msg": "Dose Sequence must be number."});
				}
			}
			
			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier;
				}else{
					res.json({"err_code": 1, "err_msg": "Identifier is empty."});
				}
			}
			
			if(typeof location !== 'undefined'){
				if(!validator.isEmpty(location)){
					qString.location = location; 
				}else{
					res.json({"err_code": 1, "err_msg": "Location is empty."});
				}
			}
			
			if(typeof information !== 'undefined'){
				if(!validator.isEmpty(information)){
					qString.information = information; 
				}else{
					res.json({"err_code": 1, "err_msg": "Information is empty."});
				}
			}
			
			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "Patient is empty."});
				}
			}
			
			if(typeof status !== 'undefined'){
				if(!validator.isEmpty(status)){
					qString.status = status; 
				}else{
					res.json({"err_code": 1, "err_msg": "Status is empty."});
				}
			}
			
			if(typeof support !== 'undefined'){
				if(!validator.isEmpty(support)){
					qString.support = support; 
				}else{
					res.json({"err_code": 1, "err_msg": "Support is empty."});
				}
			}
			
			if(typeof target_disease !== 'undefined'){
				if(!validator.isEmpty(target_disease)){
					qString.target_disease = target_disease; 
				}else{
					res.json({"err_code": 1, "err_msg": "Target disease is empty."});
				}
			}
			
			if(typeof vaccine_type !== 'undefined'){
				if(!validator.isEmpty(vaccine_type)){
					qString.vaccine_type = vaccine_type; 
				}else{
					res.json({"err_code": 1, "err_msg": "Vaccine type is empty."});
				}
			}

			
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
														//get identifier
														qString = {};
														qString.immunizationRecommendation_id = immunizationRecommendation.id;
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

																newImmunizationRecommendation[index] = objectImmunizationRecommendation

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

																					if(immunizationRecommendationDateCriterion.err_code == 0){
																						var objectImmunizationRecommendation = {};
																						objectImmunizationRecommendation.resourceType = immunizationRecommendation.resourceType;
																						objectImmunizationRecommendation.id = immunizationRecommendation.id;
																						objectImmunizationRecommendation.identifier = immunizationRecommendation.identifier;
																						objectImmunizationRecommendation.patient = immunizationRecommendation.patient;
																						objectImmunizationRecommendation.recommendation = immunizationRecommendation.recommendation;
																						objectImmunizationRecommendation.recommendation.dateCriterion = immunizationRecommendationDateCriterion.data;

																						newImmunizationRecommendation[index] = objectImmunizationRecommendation;
																						
																						if(index == countImmunizationRecommendation -1 ){
																							res.json({"err_code": 0, "data":newImmunizationRecommendation});				
																						}

																						/*myEmitter.once('getImmunizationRecommendationVaccinationProtocol', function(immunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation){
																							qString = {};
																							qString.immunizationRecommendation_id = immunizationRecommendation.id;
																							seedPhoenixFHIR.path.GET = {
																								"ImmunizationRecommendationVaccinationProtocol" : {
																									"location": "%(apikey)s/ImmunizationRecommendationVaccinationProtocol",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('ImmunizationRecommendationVaccinationProtocol', {"apikey": apikey}, {}, function(error, response, body){
																								immunizationRecommendationVaccinationProtocol = JSON.parse(body);

																								if(immunizationRecommendationVaccinationProtocol.err_code == 0){
																									var objectImmunizationRecommendation = {};
																									objectImmunizationRecommendation.resourceType = immunizationRecommendation.resourceType;
																									objectImmunizationRecommendation.id = immunizationRecommendation.id;
																									objectImmunizationRecommendation.identifier = immunizationRecommendation.identifier;
																									objectImmunizationRecommendation.status = immunizationRecommendation.status;
																									objectImmunizationRecommendation.notGiven = immunizationRecommendation.notGiven;
																									objectImmunizationRecommendation.veccineCode = immunizationRecommendation.veccineCode;
																									objectImmunizationRecommendation.patient = immunizationRecommendation.patient;
																									objectImmunizationRecommendation.encounter = immunizationRecommendation.encounter;
																									objectImmunizationRecommendation.date = immunizationRecommendation.date;
																									objectImmunizationRecommendation.primarySource = immunizationRecommendation.primarySource;
																									objectImmunizationRecommendation.reportOrigin = immunizationRecommendation.reportOrigin;
																									objectImmunizationRecommendation.location = immunizationRecommendation.location;
																									objectImmunizationRecommendation.manufacturer = immunizationRecommendation.manufacturer;
																									objectImmunizationRecommendation.iotNumber = immunizationRecommendation.iotNumber;
																									objectImmunizationRecommendation.expirationDate = immunizationRecommendation.expirationDate;
																									objectImmunizationRecommendation.site = immunizationRecommendation.site;
																									objectImmunizationRecommendation.route = immunizationRecommendation.route;
																									objectImmunizationRecommendation.doseQuantity = immunizationRecommendation.doseQuantity;
																									objectImmunizationRecommendation.practitioner = immunizationRecommendation.practitioner;
																									objectImmunizationRecommendation.explanation = immunizationRecommendation.explanation;
																									objectImmunizationRecommendation.reaction = immunizationRecommendation.reaction;
																									objectImmunizationRecommendation.vaccinationProtocol = immunizationRecommendationVaccinationProtocol.data;

																									newImmunizationRecommendation[index] = objectImmunizationRecommendation;
																									
																									if(index == countImmunizationRecommendation -1 ){
																										res.json({"err_code": 0, "data":newImmunizationRecommendation});				
																									}

																								}else{
																									res.json(immunizationRecommendationVaccinationProtocol);			
																								}
																							})
																						})
																						myEmitter.emit('getImmunizationRecommendationVaccinationProtocol', objectImmunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation);*/
																					}else{
																						res.json(immunizationRecommendationReaction);			
																					}
																				})
																			})
																			myEmitter.emit('getImmunizationRecommendationDateCriterion', objectImmunizationRecommendation, index, newImmunizationRecommendation, countImmunizationRecommendation);			
																		}else{
																			res.json(immunizationRecommendationPractitioner);			
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
										//res.json({"err_code": 0, "err_msg": "Organitazion is not empty."});		
									}
									// res.json({"err_code": 0, "data":immunizationRecommendation.data});
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
		immunizationRecommendation: function postImmunizationRecommendation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			var err_code = 0;
			var err_msg = "";
	//console.log(req.body);
			//input check 
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

			//set by sistem
			//var identifierSystem = host + ':' + port + '/' + apikey + 'identifier/value/' + identifierValue 

			//immunizationRecommendation patient
			if(typeof req.body.patient !== 'undefined'){
				var immunizationRecommendationPatient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(immunizationRecommendationPatient)){
					immunizationRecommendationPatient = "";
				}
			}else{
				immunizationRecommendationPatient = "";
			}
			
			/*------------------------------------*/
			/* Practitioner */
			/*------------------------------------*/
			
			if(typeof req.body.recommendation.date !== 'undefined'){
				var immunizationRecommendationRecommendationDate = req.body.recommendation.date;
				if(!regex.test(immunizationRecommendationRecommendationDate)){
						err_code = 2;
						err_msg = "Immunization recommendation recommendation date invalid date format.";
					}	
			}else{
				immunizationRecommendationRecommendationDate = "";
			}
			
			if(typeof req.body.recommendation.vaccineCode !== 'undefined'){
				var immunizationRecommendationRecommendationVaccineCode =  req.body.recommendation.vaccineCode.trim().toLowerCase();
				if(validator.isEmpty(immunizationRecommendationRecommendationVaccineCode)){
					err_code = 2;
					err_msg = "Immunization Recommendation Recommendation Vaccine Code is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccine code' in json Immunization Recommendation Recommendation request.";
			}
			
			if(typeof req.body.recommendation.targetDisease !== 'undefined'){
				var immunizationRecommendationRecommendationTargetDisease =  req.body.recommendation.targetDisease.trim();
				if(validator.isEmpty(immunizationRecommendationRecommendationTargetDisease)){
					err_code = 2;
					err_msg = "Immunization Recommendation Recommendation Target Disease is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'target disease' in json Immunization Recommendation Recommendation request.";
			}
			
			
			if(typeof req.body.recommendation.doseNumber !== 'undefined'){
				var immunizationRecommendationRecommendationDoseNumber =  req.body.recommendation.doseNumber.trim().toLowerCase();
				if(validator.isEmpty(immunizationRecommendationRecommendationDoseNumber)){
					err_code = 2;
					err_msg = "Immunization Recommendation Recommendation dose number is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose number' in json Immunization Recommendation Recommendation request.";
			}
			
			if(typeof req.body.recommendation.forecastStatus !== 'undefined'){
				var immunizationRecommendationRecommendationForecastStatus =  req.body.recommendation.forecastStatus.trim().toLowerCase();
				if(validator.isEmpty(immunizationRecommendationRecommendationForecastStatus)){
					err_code = 2;
					err_msg = "Immunization Recommendation Recommendation Forecast Status is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'forecast status' in json Immunization Recommendation Recommendation request.";
			}
			
			if(typeof req.body.recommendation.dateCriterion.code !== 'undefined'){
				var immunizationRecommendationRecommendationDateCriterionCode =  req.body.recommendation.dateCriterion.code.trim().toLowerCase();
				if(validator.isEmpty(immunizationRecommendationRecommendationDateCriterionCode)){
					err_code = 2;
					err_msg = "Immunization Recommendation Recommendation Date Criterion Code is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'code' in json Immunization Recommendation Recommendation Date Criterion request.";
			}
			
			if(typeof req.body.recommendation.dateCriterion.value !== 'undefined'){
				var immunizationRecommendationRecommendationDateCriterionValue = req.body.recommendation.dateCriterion.value;
				if(!regex.test(immunizationRecommendationRecommendationDateCriterionValue)){
						err_code = 2;
						err_msg = "Immunization recommendation recommendation Date Criterion value invalid date format.";
					}	
			}else{
				immunizationRecommendationRecommendationDateCriterionValue = "";
			}
			
			if(typeof req.body.recommendation.protocol.doseSequence !== 'undefined'){
				var immunizationRecommendationRecommendationProtocolDoseSequence =  req.body.recommendation.protocol.doseSequence.trim().toLowerCase();
				if(validator.isEmpty(immunizationRecommendationRecommendationProtocolDoseSequence)){
					err_code = 2;
					err_msg = "Immunization Recommendation Recommendation Protocol Dose Sequence is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose sequence' in json Immunization Recommendation Recommendation Protocol request.";
			}
			
			if(typeof req.body.recommendation.protocol.description !== 'undefined'){
				var immunizationRecommendationRecommendationProtocolDescription =  req.body.recommendation.protocol.description.trim().toLowerCase();
				if(validator.isEmpty(immunizationRecommendationRecommendationProtocolDescription)){
					err_code = 2;
					err_msg = "Immunization Recommendation Recommendation Protocol Description is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json Immunization Recommendation Recommendation Protocol request.";
			}
			
			if(typeof req.body.recommendation.authority !== 'undefined'){
				var immunizationRecommendationRecommendationAuthority =  req.body.practitiner.authority.trim().toLowerCase();
				if(validator.isEmpty(immunizationRecommendationRecommendationAuthority)){
					immunizationRecommendationRecommendationAuthority = "";
				}
			}else{
				immunizationRecommendationRecommendationAuthority = "";
			}
			
			if(typeof req.body.recommendation.protocol.series !== 'undefined'){
				var immunizationRecommendationRecommendationProtocolSeries =  req.body.recommendation.protocol.series.trim().toLowerCase();
				if(validator.isEmpty(immunizationRecommendationRecommendationProtocolSeries)){
					err_code = 2;
					err_msg = "Immunization Recommendation Recommendation Protocol Series is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series' in json Immunization Recommendation Recommendation Protocol request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
							if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
									if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, immunizationRecommendationRecommendationVaccineCode, 'VACCINE_CODE', function(resImmunizationRecommendationRecommendationVaccineCode){
											if(resImmunizationRecommendationRecommendationVaccineCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, immunizationRecommendationRecommendationTargetDisease, 'IMMUNIZATION_RECOMMENDATION_TARGET_DISEASE', function(resImmunizationRecommendationRecommendationTargetDisease){
													if(resImmunizationRecommendationRecommendationTargetDisease.err_code > 0){
														checkCode(apikey, immunizationRecommendationRecommendationForecastStatus, 'IMMUNIZATION_RECOMMENDATION_STATUS', function(resImmunizationRecommendationRecommendationForecastStatus){
															if(resImmunizationRecommendationRecommendationForecastStatus.err_code > 0){
																checkCode(apikey, immunizationRecommendationRecommendationDateCriterionCode, 'IMMUNIZATION_RECOMMENDATION_DATE_CRITERION', function(resImmunizationRecommendationRecommendationDateCriterionCode){
																	if(resImmunizationRecommendationRecommendationDateCriterionCode.err_code > 0){
																		
														
														checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
															if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada
																//event emiter
																myEmitter.prependOnceListener('checkImmunizationRecommendationId', function() {
																	//proses insert
																	//set uniqe id
																	var unicId = uniqid.time();
																	var immunizationRecommendationId = 'imr' + unicId;
																	var immunizationRecommendationRecommendationId = 'irr' + unicId;
																	var immunizationRecommendationDateCriterionId = 'ird' + unicId;
																	var identifierId = 'ide' + unicId;

																	dataImmunizationRecommendation = {
																		"immunization_recommendation_id" : immunizationRecommendationId,
																		"patient" : immunizationRecommendationPatient
																	}
																	ApiFHIR.post('ImmunizationRecommendation', {"apikey": apikey}, {body: dataImmunizationRecommendation, json: true}, function(error, response, body){
																		immunizationRecommendation = body;
																		if(immunizationRecommendation.err_code > 0){
																			res.json(immunizationRecommendation);	
																		}
																	})

																	dataImmunizationRecommendationRecommendation = {
																		"recommendation_id" : immunizationRecommendationRecommendationId,
																		"date" : immunizationRecommendationRecommendationDate,
																		"vaccine_code" : immunizationRecommendationRecommendationProtocolDoseSequence,
																		"target_disease" : immunizationRecommendationRecommendationProtocolDescription,
																		"dose_number" : immunizationRecommendationRecommendationDoseNumber,
																		"forecast_status" : immunizationRecommendationRecommendationForecastStatus,
																		"protocol_dose_sequence" : immunizationRecommendationRecommendationProtocolDoseSequence,
																		"protocol_description" : immunizationRecommendationRecommendationProtocolDescription,
																		"protocol_authority" : immunizationRecommendationRecommendationAuthority,
																		"protocol_series" : immunizationRecommendationRecommendationProtocolSeries,
																		"immunization_recommendation_id" : immunizationRecommendationId
																	}
																	ApiFHIR.post('ImmunizationRecommendationRecommendation', {"apikey": apikey}, {body: dataImmunizationRecommendationRecommendation, json: true}, function(error, response, body){
																		immunizationRecommendationRecommendation = body;
																		if(immunizationRecommendationRecommendation.err_code > 0){
																			//console.log(immunizationRecommendationPractitioner);
																			res.json(immunizationRecommendationRecommendation);	
																		}
																	})

																	//reason
																	dataRecommendationDateCriterion = {
																		"date_creation_id" : immunizationRecommendationDateCriterionId,
																		"code" : immunizationRecommendationRecommendationDateCriterionCode,
																		"value" : immunizationRecommendationRecommendationDateCriterionValue,
																		"recommendation_id" : immunizationRecommendationRecommendationId
																	}

																	ApiFHIR.post('ImmunizationRecommendationDateCriterion', {"apikey": apikey}, {body: dataRecommendationDateCriterion, json: true}, function(error, response, body){
																		immunizationRecommendationDateCriterion = body;
																		if(immunizationRecommendationDateCriterion.err_code > 0){
																			res.json(immunizationRecommendationDateCriterion);	
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
																		"immunization_recommendation_id" : immunizationRecommendationId
																	}

																	ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
																		identifier = body;
																		if(identifier.err_code > 0){
																			res.json(identifier);	
																		}
																	})

																	res.json({"err_code": 0, "err_msg": "Immunization Recommendation has been add.", "data": [{"_id": immunizationRecommendationId}]})
																});

																myEmitter.prependOnceListener('checkPatientId', function(){
																	if(validator.isEmpty(immunizationRecommendationPatient)){
																		myEmitter.emit('checkImmunizationRecommendationId');
																	}else{
																		checkUniqeValue(apikey, "PATIENT_ID|" + immunizationRecommendationPatient, 'PATIENT', function(resPatientID){
																			if(resPatientID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																				myEmitter.emit('checkImmunizationRecommendationId');
																			}else{
																				res.json({"err_code": 503, "err_msg": "Patient id not found."});	
																			}
																		})
																	}
																})
																
																if(validator.isEmpty(immunizationRecommendationRecommendationAuthority)){
																	myEmitter.emit('checkPatientId');
																}else{
																	checkUniqeValue(apikey, "ORGANIZATION_ID|" + immunizationRecommendationRecommendationAuthority, 'ORGANIZATION', function(resRecommendationAuthority){
																		if(resRecommendationAuthority.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																			myEmitter.emit('checkPatientId');
																		}else{
																			res.json({"err_code": 501, "err_msg": "Recommendation Authority id is not exist."});
																		}
																	})
																}	
																			
															}else{
																res.json({"err_code": 509, "err_msg": "Identifier value already exist."});
															}
														})																												
													
																	}else{
																		res.json({"err_code": 509, "err_msg": "Immunization Recommendation Recommendation Date Criterion Code not found"});
																	}
																})
															}else{
																res.json({"err_code": 509, "err_msg": "Immunization Recommendation Recommendation Forecast Status Code not found"});
															}
														})
													}else{
														res.json({"err_code": 509, "err_msg": "Target Disease Code not found"});
													}
												})
											}else{
												res.json({"err_code": 508, "err_msg": "Immunization Recommendation Recommendation Vaccine Code Code not found"});
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
		}
	},
	put:{
		immunizationRecommendation: function putImmunizationRecommendation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			
			var immunizationRecommendationId = req.params.immunizationRecommendation_id;
			var err_code = 0;
			var err_msg = "";

			var dataImmunizationRecommendation = {};
			
			//input check 
			if(typeof immunizationRecommendationId !== 'undefined'){
				if(validator.isEmpty(immunizationRecommendationId)){
					err_code = 2;
					err_msg = "ImmunizationRecommendation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "ImmunizationRecommendation id is required";
			}
			
			if(typeof req.body.active !== 'undefined'){
				active =  req.body.active.trim().toLowerCase();
				if(validator.isEmpty(active)){
					err_code = 2;
					err_msg = "Active is required.";
				}else{
					dataImmunizationRecommendation.active = active;
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
					dataImmunizationRecommendation.type = type;
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
					dataImmunizationRecommendation.name = name;
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
					dataImmunizationRecommendation.alias = alias;
				}
			}else{
				alias = "";
			}			
			
			//Endpoint managingImmunizationRecommendation
			if(typeof req.body.partOf !== 'undefined'){
				parentId =  req.body.partOf.trim().toLowerCase();
				if(validator.isEmpty(parentId)){
					err_code = 2;
					err_msg = "Managing ImmunizationRecommendation is required.";
				}else{
					dataImmunizationRecommendation.parentId = parentId;
				}
			}else{
				parentId = "";
			}
			
			//Endpoint managingImmunizationRecommendation
			if(typeof req.body.endpoint !== 'undefined'){
				endpointId =  req.body.endpoint.trim().toLowerCase();
				if(validator.isEmpty(endpointId)){
					err_code = 2;
					err_msg = "Endpoint is required.";
				}else{
					dataImmunizationRecommendation.endpointId = endpointId;
				}
			}else{
				endpointId = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkImmunizationRecommendationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationRecommendationId, 'IMMUNIZATION', function(resImmunizationRecommendationID){
								if(resImmunizationRecommendationID.err_code > 0){
									//console.log(dataEndpoint);
										ApiFHIR.put('immunizationRecommendation', {"apikey": apikey, "_id": immunizationRecommendationId}, {body: dataImmunizationRecommendation, json: true}, function(error, response, body){
											immunizationRecommendation = body;
											if(immunizationRecommendation.err_code > 0){
												res.json(immunizationRecommendation);	
											}else{
												res.json({"err_code": 0, "err_msg": "ImmunizationRecommendation has been update.", "data": [{"_id": immunizationRecommendationId}]});
											}
										})
								}else{
									res.json({"err_code": 504, "err_msg": "ImmunizationRecommendation Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkType', function(){
							if(validator.isEmpty(type)){
								myEmitter.emit('checkImmunizationRecommendationID');
							}else{
								checkCode(apikey, type, 'IMMUNIZATION_TYPE', function(resStatusCode){
									if(resStatusCode.err_code > 0){
										myEmitter.emit('checkImmunizationRecommendationID');				
									}else{
										res.json({"err_code": 503, "err_msg": "Type Code not found."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkManagingImmunizationRecommendation', function(){
							if(validator.isEmpty(parentId)){
								myEmitter.emit('checkType');
							}else{
								checkUniqeValue(apikey, "IMMUNIZATION_ID|" + parentId, 'IMMUNIZATION', function(resImmunizationRecommendationID){
									if(resImmunizationRecommendationID.err_code > 0){
										myEmitter.emit('checkType');				
									}else{
										res.json({"err_code": 503, "err_msg": "Parent Id ImmunizationRecommendation, immunizationRecommendation id not found."});	
									}
								})
							}
						})

						if(validator.isEmpty(endpointId)){
							myEmitter.emit('checkManagingImmunizationRecommendation');	
						}else{
							checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointID){
								if(resEndpointID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkManagingImmunizationRecommendation');
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