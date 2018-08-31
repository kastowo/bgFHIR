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
		immunization : function getImmunization(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			//params from query string
			var immunizationId = req.query._id;
			var date = req.query.date;
			var dose_sequence = req.query.doseSequence;
			var identifier = req.query.identifier;
			var location = req.query.location;
			var lot_number = req.query.lotNumber;
			var manufacturer = req.query.manufacturer;
			var notgiven = req.query.notgiven;
			var patient = req.query.patient;
			var practitioner = req.query.practitioner;
			var reaction = req.query.reaction;
			var reaction_date = req.query.reactionDate;
			var reason = req.query.reason;
			var reason_not_given = req.query.reasonNotGiven;
			var status = req.query.status;
			var vaccine_code = req.query.vaccineCode;
			
			var qString = {};
			if(typeof immunizationId !== 'undefined'){
				if(!validator.isEmpty(immunizationId)){
					qString._id = immunizationId; 
				}else{
					res.json({"err_code": 1, "err_msg": "immunization id is required."});
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
			
			if(typeof lot_number !== 'undefined'){
				if(!validator.isEmpty(lot_number)){
					qString.lot_number = lot_number; 
				}else{
					res.json({"err_code": 1, "err_msg": "Lot Number is empty."});
				}
			}
			
			if(typeof manufacturer !== 'undefined'){
				if(!validator.isEmpty(manufacturer)){
					qString.manufacturer = manufacturer; 
				}else{
					res.json({"err_code": 1, "err_msg": "Manufacturer is empty."});
				}
			}
			
			if(typeof notgiven !== 'undefined'){
				if(!validator.isBoolean(notgiven)){
					qString.notgiven = notgiven; 
				}else{
					res.json({"err_code": 1, "err_msg": "Not Given is not notgiven."});
				}
			}
			
			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "Patient is empty."});
				}
			}
			
			if(typeof practitioner !== 'undefined'){
				if(!validator.isEmpty(practitioner)){
					qString.practitioner = practitioner; 
				}else{
					res.json({"err_code": 1, "err_msg": "Practitioner is empty."});
				}
			}
			
			if(typeof reason !== 'undefined'){
				if(!validator.isEmpty(reason)){
					qString.reason = reason; 
				}else{
					res.json({"err_code": 1, "err_msg": "Reason is empty."});
				}
			}
			
			if(typeof reason_not_given !== 'undefined'){
				if(!validator.isEmpty(reason_not_given)){
					qString.reason_not_given = reason_not_given; 
				}else{
					res.json({"err_code": 1, "err_msg": "Reason Not Given is empty."});
				}
			}
			
			if(typeof status !== 'undefined'){
				if(!validator.isEmpty(status)){
					qString.status = status; 
				}else{
					res.json({"err_code": 1, "err_msg": "Status is empty."});
				}
			}
			
			if(typeof vaccine_code !== 'undefined'){
				if(!validator.isEmpty(vaccine_code)){
					qString.vaccine_code = vaccine_code; 
				}else{
					res.json({"err_code": 1, "err_msg": "Vaccine Code is empty."});
				}
			}

			
			seedPhoenixFHIR.path.GET = {
				"Immunization" : {
					"location": "%(apikey)s/Immunization",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('Immunization', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var immunization = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(immunization.err_code == 0){
								//cek jumdata dulu
								if(immunization.data.length > 0){
									newImmunization = [];
									for(i=0; i < immunization.data.length; i++){
										myEmitter.once("getIdentifier", function(immunization, index, newImmunization, countImmunization){
														//get identifier
														qString = {};
														qString.immunization_id = immunization.id;
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
																var objectImmunization = {};
																objectImmunization.resourceType = immunization.resourceType;
																objectImmunization.id = immunization.id;
																objectImmunization.identifier = identifier.data;
																objectImmunization.status = immunization.status;
																objectImmunization.notGiven = immunization.notGiven;
																objectImmunization.veccineCode = immunization.veccineCode;
																objectImmunization.patient = immunization.patient;
																objectImmunization.encounter = immunization.encounter;
																objectImmunization.date = immunization.date;
																objectImmunization.primarySource = immunization.primarySource;
																objectImmunization.reportOrigin = immunization.reportOrigin;
																objectImmunization.location = immunization.location;
																objectImmunization.manufacturer = immunization.manufacturer;
																objectImmunization.iotNumber = immunization.iotNumber;
																objectImmunization.expirationDate = immunization.expirationDate;
																objectImmunization.site = immunization.site;
																objectImmunization.route = immunization.route;
																objectImmunization.doseQuantity = immunization.doseQuantity;
																objectImmunization.explanation = immunization.explanation;
																newImmunization[index] = objectImmunization

																myEmitter.once('getImmunizationPractitioner', function(immunization, index, newImmunization, countImmunization){
																	qString = {};
																	qString.immunization_id = immunization.id;
																	seedPhoenixFHIR.path.GET = {
																		"ImmunizationPractitioner" : {
																			"location": "%(apikey)s/ImmunizationPractitioner",
																			"query": qString
																		}
																	}

																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																	ApiFHIR.get('ImmunizationPractitioner', {"apikey": apikey}, {}, function(error, response, body){
																		immunizationPractitioner = JSON.parse(body);
																		if(immunizationPractitioner.err_code == 0){
																			var objectImmunization = {};
																			objectImmunization.resourceType = immunization.resourceType;
																			objectImmunization.id = immunization.id;
																			objectImmunization.identifier = immunization.identifier;
																			objectImmunization.status = immunization.status;
																			objectImmunization.notGiven = immunization.notGiven;
																			objectImmunization.veccineCode = immunization.veccineCode;
																			objectImmunization.patient = immunization.patient;
																			objectImmunization.encounter = immunization.encounter;
																			objectImmunization.date = immunization.date;
																			objectImmunization.primarySource = immunization.primarySource;
																			objectImmunization.reportOrigin = immunization.reportOrigin;
																			objectImmunization.location = immunization.location;
																			objectImmunization.manufacturer = immunization.manufacturer;
																			objectImmunization.iotNumber = immunization.iotNumber;
																			objectImmunization.expirationDate = immunization.expirationDate;
																			objectImmunization.site = immunization.site;
																			objectImmunization.route = immunization.route;
																			objectImmunization.doseQuantity = immunization.doseQuantity;
																			objectImmunization.practitioner = immunizationPractitioner.data;
																			objectImmunization.explanation = immunization.explanation;

																			newImmunization[index] = objectImmunization;

																			myEmitter.once('getImmunizationReaction', function(immunization, index, newImmunization, countImmunization){
																				qString = {};
																				qString.immunization_id = immunization.id;
																				seedPhoenixFHIR.path.GET = {
																					"ImmunizationReaction" : {
																						"location": "%(apikey)s/ImmunizationReaction",
																						"query": qString
																					}
																				}

																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																				ApiFHIR.get('ImmunizationReaction', {"apikey": apikey}, {}, function(error, response, body){
																					immunizationReaction = JSON.parse(body);

																					if(immunizationReaction.err_code == 0){
																						var objectImmunization = {};
																						objectImmunization.resourceType = immunization.resourceType;
																						objectImmunization.id = immunization.id;
																						objectImmunization.identifier = immunization.identifier;
																						objectImmunization.status = immunization.status;
																						objectImmunization.notGiven = immunization.notGiven;
																						objectImmunization.veccineCode = immunization.veccineCode;
																						objectImmunization.patient = immunization.patient;
																						objectImmunization.encounter = immunization.encounter;
																						objectImmunization.date = immunization.date;
																						objectImmunization.primarySource = immunization.primarySource;
																						objectImmunization.reportOrigin = immunization.reportOrigin;
																						objectImmunization.location = immunization.location;
																						objectImmunization.manufacturer = immunization.manufacturer;
																						objectImmunization.iotNumber = immunization.iotNumber;
																						objectImmunization.expirationDate = immunization.expirationDate;
																						objectImmunization.site = immunization.site;
																						objectImmunization.route = immunization.route;
																						objectImmunization.doseQuantity = immunization.doseQuantity;
																						objectImmunization.practitioner = immunization.practitioner;
																						objectImmunization.explanation = immunization.explanation;
																						objectImmunization.reaction = immunizationReaction.data;

																						newImmunization[index] = objectImmunization;

																						myEmitter.once('getImmunizationVaccinationProtocol', function(immunization, index, newImmunization, countImmunization){
																							qString = {};
																							qString.immunization_id = immunization.id;
																							seedPhoenixFHIR.path.GET = {
																								"ImmunizationVaccinationProtocol" : {
																									"location": "%(apikey)s/ImmunizationVaccinationProtocol",
																									"query": qString
																								}
																							}

																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);

																							ApiFHIR.get('ImmunizationVaccinationProtocol', {"apikey": apikey}, {}, function(error, response, body){
																								immunizationVaccinationProtocol = JSON.parse(body);

																								if(immunizationVaccinationProtocol.err_code == 0){
																									var objectImmunization = {};
																									objectImmunization.resourceType = immunization.resourceType;
																									objectImmunization.id = immunization.id;
																									objectImmunization.identifier = immunization.identifier;
																									objectImmunization.status = immunization.status;
																									objectImmunization.notGiven = immunization.notGiven;
																									objectImmunization.veccineCode = immunization.veccineCode;
																									objectImmunization.patient = immunization.patient;
																									objectImmunization.encounter = immunization.encounter;
																									objectImmunization.date = immunization.date;
																									objectImmunization.primarySource = immunization.primarySource;
																									objectImmunization.reportOrigin = immunization.reportOrigin;
																									objectImmunization.location = immunization.location;
																									objectImmunization.manufacturer = immunization.manufacturer;
																									objectImmunization.iotNumber = immunization.iotNumber;
																									objectImmunization.expirationDate = immunization.expirationDate;
																									objectImmunization.site = immunization.site;
																									objectImmunization.route = immunization.route;
																									objectImmunization.doseQuantity = immunization.doseQuantity;
																									objectImmunization.practitioner = immunization.practitioner;
																									objectImmunization.explanation = immunization.explanation;
																									objectImmunization.reaction = immunization.reaction;
																									objectImmunization.vaccinationProtocol = immunizationVaccinationProtocol.data;

																									newImmunization[index] = objectImmunization;
																									
																									if(index == countImmunization -1 ){
																										res.json({"err_code": 0, "data":newImmunization});				
																									}

																								}else{
																									res.json(immunizationVaccinationProtocol);			
																								}
																							})
																						})
																						myEmitter.emit('getImmunizationVaccinationProtocol', objectImmunization, index, newImmunization, countImmunization);
																					}else{
																						res.json(immunizationReaction);			
																					}
																				})
																			})
																			myEmitter.emit('getImmunizationReaction', objectImmunization, index, newImmunization, countImmunization);			
																		}else{
																			res.json(immunizationPractitioner);			
																		}
																	})
																})
																myEmitter.emit('getImmunizationPractitioner', objectImmunization, index, newImmunization, countImmunization);
															}else{
																res.json(identifier);
															}
														})
													})
										myEmitter.emit("getIdentifier", immunization.data[i], i, newImmunization, immunization.data.length);
										//res.json({"err_code": 0, "err_msg": "Organitazion is not empty."});		
									}
									// res.json({"err_code": 0, "data":immunization.data});
								}else{
									res.json({"err_code": 2, "err_msg": "Immunization is empty."});	
								}
							}else{
								res.json(immunization);
							}
						}
					});
				}else{
					result.err_code = 500;
					res.json(result);
				}
			});	
		},
		immunizationPractitioner : function getImmunization(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			var immunizationId = req.params.immunization_id;
			var immunizationPractitionerId = req.params.immunization_practitioner_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationID){
						if(resImmunizationID.err_code > 0){
							if(typeof immunizationPractitionerId !== 'undefined' && !validator.isEmpty(immunizationPractitionerId)){
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + immunizationPractitionerId, 'IMMUNIZATION_PRACTITIONER', function(resImmunizationPractitionerID){
									if(resImmunizationPractitionerID.err_code > 0){
										//get identifier
										qString = {};
										qString.immunization_id = immunizationId;
										qString._id = immunizationPractitionerId;
										seedPhoenixFHIR.path.GET = {
											"ImmunizationPractitioner" : {
												"location": "%(apikey)s/ImmunizationPractitioner",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ImmunizationPractitioner', {"apikey": apikey}, {}, function(error, response, body){
											immunizationPractitioner = JSON.parse(body);
											if(immunizationPractitioner.err_code == 0){
												res.json({"err_code": 0, "data":immunizationPractitioner.data});	
											}else{
												res.json(immunizationPractitioner);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Immunization Contact Id not found"});		
									}
								})
							}else{
								//get identifier
								qString = {};
								qString.immunization_id = immunizationId;
								seedPhoenixFHIR.path.GET = {
									"ImmunizationPractitioner" : {
										"location": "%(apikey)s/ImmunizationPractitioner",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ImmunizationPractitioner', {"apikey": apikey}, {}, function(error, response, body){
									immunizationPractitioner = JSON.parse(body);
									if(immunizationPractitioner.err_code == 0){
										res.json({"err_code": 0, "data":immunizationPractitioner.data});	
									}else{
										res.json(immunizationPractitioner);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Immunization Id not found"});		
						}
					})
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
			var immunizationId = req.params.immunization_id;
			var identifierId = req.params.identifier_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationID){
						if(resImmunizationID.err_code > 0){
							if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
								checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
									if(resIdentifierID.err_code > 0){
										//get identifier
										qString = {};
										qString.immunization_id = immunizationId;
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
								qString.immunization_id = immunizationId;
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
							res.json({"err_code": 501, "err_msg": "Immunization Id not found"});		
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
		immunization: function postImmunization(req, res){
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

			//immunization status
			if(typeof req.body.status !== 'undefined'){
				var immunizationStatus =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(immunizationStatus)){
					err_code = 2;
					err_msg = "Immunization status is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Immunization request.";
			}
			
			//immunization notGiven
			if(typeof req.body.notGiven !== 'undefined'){
				var immunizationNotGiven =  req.body.notGiven.trim().toLowerCase();
				if(immunizationNotGiven !== 'true' || immunizationNotGiven !== 'flase'){
					err_code = 3;
					err_msg = "Immunization not given is't boolean";
				}
				if(validator.isEmpty(immunizationNotGiven)){
					err_code = 2;
					err_msg = "Immunization not given is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'not given' in json Immunization request.";
			}
			
			//immunization vaccineCode
			if(typeof req.body.vaccineCode !== 'undefined'){
				var immunizationVaccineCode =  req.body.vaccineCode.trim().toLowerCase();
				if(validator.isEmpty(immunizationVaccineCode)){
					err_code = 2;
					err_msg = "Immunization vaccine code is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'vaccine code' in json Immunization request.";
			}
			
			//immunization patient
			if(typeof req.body.patient !== 'undefined'){
				var immunizationPatient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(immunizationPatient)){
					immunizationPatient = "";
				}
			}else{
				immunizationPatient = "";
			}
			
			//immunization encounter
			if(typeof req.body.encounter !== 'undefined'){
				var immunizationEncounter =  req.body.encounter.trim().toLowerCase();
				if(validator.isEmpty(immunizationEncounter)){
					immunizationEncounter = "";
				}
			}else{
				immunizationEncounter = "";
			}
			
			//date
			if(typeof req.body.date !== 'undefined'){
				var immunizationDate = req.body.date;
				if(!regex.test(immunizationDate)){
						err_code = 2;
						err_msg = "Immunization date invalid date format.";
					}	
			}else{
				immunizationDate = "";
			}
			
			//immunization notGiven
			if(typeof req.body.primarySource !== 'undefined'){
				var immunizationPrimarySource =  req.body.primarySource.trim().toLowerCase();
				if(immunizationPrimarySource !== 'true' || immunizationPrimarySource !== 'flase'){
					err_code = 3;
					err_msg = "Immunization primary source is't boolean";
				}
				if(validator.isEmpty(immunizationPrimarySource)){
					err_code = 2;
					err_msg = "Immunization primary source is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'primary source' in json Immunization request.";
			}
			
			//immunization reportOrigin
			if(typeof req.body.reportOrigin !== 'undefined'){
				var immunizationReportOrigin =  req.body.reportOrigin.trim().toLowerCase();
				if(validator.isEmpty(immunizationReportOrigin)){
					err_code = 2;
					err_msg = "Immunization report origin is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'report origin' in json Immunization request.";
			}

			//immunization location
			if(typeof req.body.location !== 'undefined'){
				var locationId =  req.body.location.trim().toLowerCase();
				if(validator.isEmpty(locationId)){
					locationId = "";
				}
			}else{
				locationId = "";
			}
			
			if(typeof req.body.manufacturer !== 'undefined'){
				var manufacturerId =  req.body.manufacturer.trim().toLowerCase();
				if(validator.isEmpty(manufacturerId)){
					manufacturerId = "";
				}
			}else{
				manufacturerId = "";
			}
			
			//immunization lotNumber
			if(typeof req.body.lotNumber !== 'undefined'){
				var immunizationLotNumber =  req.body.lotNumber.trim().toLowerCase();
				if(validator.isEmpty(immunizationLotNumber)){
					err_code = 2;
					err_msg = "Immunization lot number is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'lot number' in json Immunization request.";
			}
			
			//date
			if(typeof req.body.expirationDate !== 'undefined'){
				var immunizationExpirationDate = req.body.expirationDate;
				if(!regex.test(immunizationExpirationDate)){
						err_code = 2;
						err_msg = "Immunization expiration date invalid date format.";
					}	
			}else{
				immunizationDate = "";
			}
			
			//immunization site
			if(typeof req.body.site !== 'undefined'){
				var immunizationSite =  req.body.site.trim().toUpperCase();
				if(validator.isEmpty(immunizationSite)){
					err_code = 2;
					err_msg = "Immunization site is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'site' in json Immunization request.";
			}
			
			//immunization route
			if(typeof req.body.route !== 'undefined'){
				var immunizationRoute =  req.body.route.trim().toUpperCase();
				if(validator.isEmpty(immunizationRoute)){
					err_code = 2;
					err_msg = "Immunization route is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'route' in json Immunization request.";
			}
			
			//immunization doseQuantity
			if(typeof req.body.doseQuantity !== 'undefined'){
				var immunizationDoseQuantity =  req.body.doseQuantity.trim().toLowerCase();
				if(validator.isEmpty(immunizationDoseQuantity)){
					err_code = 2;
					err_msg = "Immunization dose quantity is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose quantity' in json Immunization request.";
			}
			
			if(typeof req.body.explanation.reason !== 'undefined'){
				var immunizationExplanationReason =  req.body.explanation.reason.trim().toLowerCase();
				if(validator.isEmpty(immunizationExplanationReason)){
					err_code = 2;
					err_msg = "Immunization Explanation Reason is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'explanation reason' in json Immunization request.";
			}
			
			if(typeof req.body.explanation.reasonNotGiven !== 'undefined'){
				var immunizationExplanationReasonNotGiven =  req.body.explanation.reasonNotGiven.trim().toUpperCase();
				if(validator.isEmpty(immunizationExplanationReasonNotGiven)){
					err_code = 2;
					err_msg = "Immunization Explanation Reason Not Given is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'explanation reason not given' in json Immunization request.";
			}
			
			/*------------------------------------*/
			/* Practitioner */
			/*------------------------------------*/
			
			if(typeof req.body.practitiner.role !== 'undefined'){
				var immunizationPractitionerRole =  req.body.practitiner.role.trim().toLowerCase();
				if(validator.isEmpty(immunizationPractitionerRole)){
					err_code = 2;
					err_msg = "Immunization Practitioner Role is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'role' in json Immunization Practitioner request.";
			}
			
			if(typeof req.body.practitiner.actor !== 'undefined'){
				var immunizationPractitionerActor =  req.body.practitiner.actor.trim().toLowerCase();
				if(validator.isEmpty(immunizationPractitionerActor)){
					immunizationPractitionerActor = "";
				}
			}else{
				immunizationPractitionerActor = "";
			}
			
			/*------------------------------------*/
			/* Reason */
			/*------------------------------------*/
			if(typeof req.body.reaction.date !== 'undefined'){
				var immunizationReactionDate = req.body.reaction.date;
				if(!regex.test(immunizationReactionDate)){
						err_code = 2;
						err_msg = "Immunization reaction date invalid date format.";
					}	
			}else{
				immunizationDate = "";
			}
			
			if(typeof req.body.reaction.detail !== 'undefined'){
				var observationId =  req.body.reaction.detail.trim().toLowerCase();
				if(validator.isEmpty(observationId)){
					observationId = "";
				}
			}else{
				observationId = "";
			}
			
			if(typeof req.body.reaction.reported !== 'undefined'){
				var immunizationReactionReported =  req.body.reason.reaction.trim().toLowerCase();
				if(immunizationReactionReported !== 'true' || immunizationReactionReported !== 'flase'){
					err_code = 3;
					err_msg = "Immunization reaction reported is't boolean";
				}
				if(validator.isEmpty(immunizationReactionReported)){
					err_code = 2;
					err_msg = "Immunization reaction reported is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reported' in json Immunization reaction request.";
			}
			
			/*------------------------------------*/
			/* vaccinationProtocol */
			/*------------------------------------*/
			if(typeof req.body.vaccinationProtocol.authority !== 'undefined'){
				var organizationId =  req.body.vaccinationProtocol.authority.trim().toLowerCase();
				if(validator.isEmpty(organizationId)){
					organizationId = "";
				}
			}else{
				organizationId = "";
			}
			
			if(typeof req.body.vaccinationProtocol.doseSequence !== 'undefined'){
				var immunizationVaccinationProtocolDoseSequence =  req.body.vaccinationProtocol.doseSequence.trim().toLowerCase();
				if(validator.isEmpty(immunizationVaccinationProtocolDoseSequence)){
					err_code = 2;
					err_msg = "Immunization Vaccination Protocol Dose Sequence is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose sequence' in json Immunization Vaccination Protocol request.";
			}
			
			if(typeof req.body.vaccinationProtocol.description !== 'undefined'){
				var immunizationVaccinationProtocolDescription =  req.body.vaccinationProtocol.description.trim().toLowerCase();
				if(validator.isEmpty(immunizationVaccinationProtocolDescription)){
					err_code = 2;
					err_msg = "Immunization Vaccination Protocol Description is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json Immunization Vaccination Protocol request.";
			}
			
			if(typeof req.body.vaccinationProtocol.series !== 'undefined'){
				var immunizationVaccinationProtocolSeries =  req.body.vaccinationProtocol.series.trim().toLowerCase();
				if(validator.isEmpty(immunizationVaccinationProtocolSeries)){
					err_code = 2;
					err_msg = "Immunization Vaccination Protocol Series is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series' in json Immunization Vaccination Protocol request.";
			}
			
			if(typeof req.body.vaccinationProtocol.seriesDoses !== 'undefined'){
				var immunizationVaccinationProtocolSeriesDoses =  req.body.vaccinationProtocol.seriesDoses.trim().toLowerCase();
				if(validator.isEmpty(immunizationVaccinationProtocolSeriesDoses)){
					err_code = 2;
					err_msg = "Immunization Vaccination Protocol Series Doses is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series doses' in json Immunization Vaccination Protocol request.";
			}
			
			if(typeof req.body.vaccinationProtocol.targetDisease !== 'undefined'){
				var immunizationVaccinationProtocolTargetDisease =  req.body.vaccinationProtocol.targetDisease.trim().toLowerCase();
				if(validator.isEmpty(immunizationVaccinationProtocolTargetDisease)){
					err_code = 2;
					err_msg = "Immunization Vaccination Protocol Target Disease is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'target disease' in json Immunization Vaccination Protocol request.";
			}
			
			if(typeof req.body.vaccinationProtocol.doseStatus !== 'undefined'){
				var immunizationVaccinationProtocolDoseStatus =  req.body.vaccinationProtocol.doseStatus.trim().toLowerCase();
				if(validator.isEmpty(immunizationVaccinationProtocolDoseStatus)){
					err_code = 2;
					err_msg = "Immunization Vaccination Protocol Dose Status is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose status' in json Immunization Vaccination Protocol request.";
			}
			
			if(typeof req.body.vaccinationProtocol.doseStatusReason !== 'undefined'){
				var immunizationVaccinationProtocolDoseStatusReason =  req.body.vaccinationProtocol.doseStatusReason.trim().toLowerCase();
				if(validator.isEmpty(immunizationVaccinationProtocolDoseStatusReason)){
					err_code = 2;
					err_msg = "Immunization Vaccination Protocol Dose Status Reason is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose status reason' in json Immunization Vaccination Protocol request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function(resUseCode){
							if(resUseCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
								checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function(resUseTypeCode){
									if(resUseTypeCode.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
										checkCode(apikey, immunizationStatus, 'IMMUNIZATION_STATUS', function(resImmunizationStatus){
											if(resImmunizationStatus.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkCode(apikey, immunizationVaccineCode, 'VACCINE_CODE', function(resImmunizationVaccineCode){
													if(resImmunizationVaccineCode.err_code > 0){
														checkCode(apikey, immunizationReportOrigin, 'IMMUNIZATION_ORIGIN', function(resImmunizationReportOrigin){
															if(resImmunizationReportOrigin.err_code > 0){
																checkCode(apikey, immunizationSite, 'IMMUNIZATION_SITE', function(resImmunizationSite){
																	if(resImmunizationSite.err_code > 0){
																		checkCode(apikey, immunizationRoute, 'IMMUNIZATION_ROUTE', function(resImmunizationRoute){
																			if(resImmunizationRoute.err_code > 0){
																				checkCode(apikey, immunizationRole, 'IMMUNIZATION_ROLE', function(resImmunizationRole){
																					if(resImmunizationRole.err_code > 0){
																						checkCode(apikey, immunizationReason, 'IMMUNIZATION_REASON', function(resImmunizationReason){
																							if(resImmunizationReason.err_code > 0){
																								checkCode(apikey, immunizationExplanationReasonNotGiven, 'NO_IMMUNIZATION_REASON', function(resImmunizationReasonNotGiven){
																									if(resImmunizationReasonNotGiven.err_code > 0){
																										checkCode(apikey, immunizationVaccinationProtocolTargetDisease, 'VACCINATION_PROTOCOL_DOSE_TARGET', function(resImmunizationVaccinationProtocolTargetDisease){
																											if(resImmunizationVaccinationProtocolTargetDisease.err_code > 0){
																												checkCode(apikey, immunizationVaccinationProtocolDoseStatus, 'VACCINATION_PROTOCOL_DOSE_STATUS', function(resImmunizationVaccinationProtocolDoseStatus){
																													if(resImmunizationVaccinationProtocolDoseStatus.err_code > 0){
																														checkCode(apikey, immunizationVaccinationProtocolDoseStatusReason, 'VACCINATION_PROTOCOL_DOSE_STATUS_REASON', function(resImmunizationVaccinationProtocolDoseStatusReason){
																															if(resImmunizationVaccinationProtocolDoseStatusReason.err_code > 0){
														
														
														
														checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resUniqeValue){
															if(resUniqeValue.err_code == 0){ //untuk ini nilai code harus sama dengan 0, menunjukan value tersebut belum ada
																//event emiter
																myEmitter.prependOnceListener('checkImmunizationId', function() {
																	//proses insert
																	//set uniqe id
																	var unicId = uniqid.time();
																	var immunizationId = 'org' + unicId;
																	var immunizationPractitionerId = 'orc' + unicId;
																	var identifierId = 'ide' + unicId;

																	dataImmunization = {
																		"immunization_id" : immunizationId,
																		"status" : immunizationStatus,
																		"not_given" : immunizationNotGiven,
																		"veccine_code" : immunizationVaccineCode,
																		"patient" : immunizationPatient,
																		"encounter" : immunizationEncounter,
																		"date" : immunizationDate,
																		"primary_source" : immunizationPrimarySource,
																		"report_origin" : immunizationReportOrigin,
																		"location" : locationId,
																		"manufacturer" : manufacturerId,
																		"lot_number" : immunizationLotNumber,
																		"expiration_date" : immunizationExpirationDate,
																		"site" : immunizationSite,
																		"route" : immunizationRoute,
																		"dose_quantity" : immunizationDoseQuantity,
																		"explanation_reason" : immunizationExplanationReason,
																		"explanation_reason_not_given" : immunizationExplanationReasonNotGiven
																	}
																	ApiFHIR.post('Immunization', {"apikey": apikey}, {body: dataImmunization, json: true}, function(error, response, body){
																		immunization = body;
																		if(immunization.err_code > 0){
																			res.json(immunization);	
																		}
																	})

																	dataImmunizationPractitioner = {
																		"practitioner_id" : immunizationPractitionerId,
																		"role" : immunizationPractitionerRole,
																		"actor" : immunizationPractitionerActor,
																		"immunization_id" : immunizationId
																	}
																	ApiFHIR.post('ImmunizationPractitioner', {"apikey": apikey}, {body: dataImmunizationPractitioner, json: true}, function(error, response, body){
																		immunizationPractitioner = body;
																		if(immunizationPractitioner.err_code > 0){
																			//console.log(immunizationPractitioner);
																			res.json(immunizationPractitioner);	
																		}
																	})

																	//reason
																	dataReaction = {
																		"reaction_id": immunizationReactionId,
																		"date": immunizationDate,
																		"detail": observationId,
																		"reported": immunizationReactionReported,
																		"immunization_id": immunizationId
																	}

																	ApiFHIR.post('ImmunizationReaction', {"apikey": apikey}, {body: dataReaction, json: true}, function(error, response, body){
																		immunizationReaction = body;
																		if(immunizationReaction.err_code > 0){
																			res.json(immunizationReaction);	
																		}
																	})

																	//human name
																	dataImmunizationVaccinationProtocol = {
																		"vaccination_protocol_id": immunizationVaccinationProtocolId,
																		"dose_sequence": immunizationVaccinationProtocolDoseSequence,
																		"description": immunizationVaccinationProtocolDoseSequence,
																		"authority": organizationId,
																		"series": immunizationVaccinationProtocolSeries,
																		"series_doses": immunizationVaccinationProtocolSeriesDose,
																		"target_disease": immunizationVaccinationProtocolTargerDisease,
																		"dose_status": immunizationVaccinationProtocolDoseStatus,
																		"dose_status_reason": immunizationVaccinationProtocolDoseStatusReason,
																		"immunization_id": immunizationId
																									}

																	ApiFHIR.post('ImmunizationVaccinationProtocol', {"apikey": apikey}, {body: dataImmunizationVaccinationProtocol, json: true}, function(error, response, body){
																		immunizationVaccinationProtocol = body;
																		if(immunizationVaccinationProtocol.err_code > 0){
																			res.json(immunizationVaccinationProtocol);	
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
																		"immunization_id" : immunizationId
																	}

																	ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
																		identifier = body;
																		if(identifier.err_code > 0){
																			res.json(identifier);	
																		}
																	})

																	res.json({"err_code": 0, "err_msg": "Immunization has been add.", "data": [{"_id": immunizationId}]})
																});

																myEmitter.prependOnceListener('checkPatientId', function(){
																	if(validator.isEmpty(immunizationPatient)){
																		myEmitter.emit('checkImmunizationId');
																	}else{
																		checkUniqeValue(apikey, "PATIENT_ID|" + immunizationPatient, 'PATIENT', function(resPatientID){
																			if(resPatientID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																				myEmitter.emit('checkImmunizationId');
																			}else{
																				res.json({"err_code": 503, "err_msg": "Patient id not found."});	
																			}
																		})
																	}
																})
																
																myEmitter.prependOnceListener('checkEncounterId', function(){
																	if(validator.isEmpty(immunizationEncounter)){
																		myEmitter.emit('checkPatientId');
																	}else{
																		checkUniqeValue(apikey, "ENCOUNTER_ID|" + immunizationEncounter, 'ENCOUNTER', function(resEncounterID){
																			if(resEncounterID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																				myEmitter.emit('checkPatientId');
																			}else{
																				res.json({"err_code": 503, "err_msg": "Encounter id not found."});	
																			}
																		})
																	}
																})
																
																myEmitter.prependOnceListener('checkLocationId', function(){
																	if(validator.isEmpty(locationId)){
																		myEmitter.emit('checkEncounterId');
																	}else{
																		checkUniqeValue(apikey, "Location_ID|" + locationId, 'LOCATION', function(resLocationID){
																			if(resLocationID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																				myEmitter.emit('checkEncounterId');
																			}else{
																				res.json({"err_code": 503, "err_msg": "Location id not found."});	
																			}
																		})
																	}
																})
																
																myEmitter.prependOnceListener('checkManufacturerId', function(){
																	if(validator.isEmpty(manufacturerId)){
																		myEmitter.emit('checkLocationId');
																	}else{
																		checkUniqeValue(apikey, "ORGANIZATION_ID|" + manufacturerId, 'ORGANIZATION', function(resManufacturerID){
																			if(resManufacturerID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																				myEmitter.emit('checkLocationId');
																			}else{
																				res.json({"err_code": 503, "err_msg": "Manufacturer id not found."});	
																			}
																		})
																	}
																})
																
																myEmitter.prependOnceListener('checkAuthorityId', function(){
																	if(validator.isEmpty(organizationId)){
																		myEmitter.emit('checkManufacturerId');
																	}else{
																		checkUniqeValue(apikey, "ORGANIZATION_ID|" + organizationId, 'ORGANIZATION', function(resAuthorityID){
																			if(resAuthorityID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																				myEmitter.emit('checkManufacturerId');
																			}else{
																				res.json({"err_code": 503, "err_msg": "Authority id not found."});	
																			}
																		})
																	}
																})
																
																myEmitter.prependOnceListener('checkObservationId', function(){
																	if(validator.isEmpty(observationId)){
																		myEmitter.emit('checkAuthorityId');
																	}else{
																		checkUniqeValue(apikey, "observation_ID|" + observationId, 'observation', function(resObservationID){
																			if(resObservationID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																				myEmitter.emit('checkAuthorityId');
																			}else{
																				res.json({"err_code": 503, "err_msg": "Observation id not found."});	
																			}
																		})
																	}
																})
																
																
																if(validator.isEmpty(immunizationPractitionerActor)){
																	myEmitter.emit('checkObservationId');
																}else{
																	checkUniqeValue(apikey, "PRACTITIONER_ID|" + immunizationPractitionerActor, 'PRACTITIONER', function(resPractitionerActor){
																		if(resPractitionerActor.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
																			myEmitter.emit('checkObservationId');
																		}else{
																			res.json({"err_code": 501, "err_msg": "Immunization Practitioner Actor id is not exist."});
																		}
																	})
																}	
																			
															}else{
																res.json({"err_code": 509, "err_msg": "Identifier value already exist."});
															}
														})																												
													
													
													
																														
																															}else{
																																res.json({"err_code": 509, "err_msg": "Immunization Vaccination Protocol Dose Status Reason Code not found"});
																															}
																														})
																													}else{
																														res.json({"err_code": 509, "err_msg": "Immunization Vaccination Protocol Dose Status Code not found"});
																													}
																												})
																											}else{
																												res.json({"err_code": 509, "err_msg": "Immunization Vaccination Protocol Target Disease not found"});
																											}
																										})
																									}else{
																										res.json({"err_code": 509, "err_msg": "Immunization Reason Not Given Code not found"});
																									}
																								})

																							}else{
																								res.json({"err_code": 509, "err_msg": "Immunization Reason Code not found"});
																							}
																						})
																					}else{
																						res.json({"err_code": 509, "err_msg": "Immunization Role Code not found"});
																					}
																				})
																			}else{
																				res.json({"err_code": 509, "err_msg": "Immunization Route Code not found"});
																			}
																		})
																	}else{
																		res.json({"err_code": 509, "err_msg": "Immunization Site Code not found"});
																	}
																})
															}else{
																res.json({"err_code": 509, "err_msg": "Immunization Report Origin Code not found"});
															}
														})
													}else{
														res.json({"err_code": 509, "err_msg": "Vaccine Code not found"});
													}
												})
											}else{
												res.json({"err_code": 508, "err_msg": "Immunization Status Code not found"});
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
		immunizationPractitioner: function postImmunizationPractitioner(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var immunizationId = req.params.immunization_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof immunizationId !== 'undefined'){
				if(validator.isEmpty(immunizationId)){
					err_code = 2;
					err_msg = "Immunization id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization id is required";
			}
			//console.log(req.body);

			if(typeof req.body.role !== 'undefined'){
				role =  req.body.role.trim().toLowerCase();
				if(validator.isEmpty(role)){
					err_code = 2;
					err_msg = "Role is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'role' in json name request.";
			}
			
			if(typeof req.body.actor !== 'undefined'){
				actor =  req.body.actor.trim().toLowerCase();
				if(validator.isEmpty(role)){
					err_code = 2;
					err_msg = "Actor is required";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'actor' in json name request.";
			}
			
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						checkUniqeValue(apikey, "PRACTITIONER_ID|" + actor, 'PRACTITIONER', function(resActor){
							if(resActor.err_code == 0){
							//event emiter
								myEmitter.prependOnceListener('checkImmunizationId', function() {
									checkUniqeValue(apikey, "CONTACT_POINT_VALUE|" + contactContactPointValue, 'CONTACT_POINT', function(resContactPointValue){
										if(resContactPointValue.err_code == 0){
											//proses insert
											//set uniqe id
											var unicId = uniqid.time();
											var immunizationPractitionerId = 'orc' + unicId;
											var humanNameId = 'hun' + unicId;
											var contactContactPointId = 'ccp' + unicId;
											var contactAddressId = 'adc' + unicId;
											//var endpointId = 'enp' + unicId;

											dataImmunizationPractitioner = {
												"id" : immunizationPractitionerId,
												"purpose" : purposeCode,
												"humanNameId" : humanNameId,
												"addressId" : contactAddressId,
												"ImmunizationId" : immunizationId
											}
											ApiFHIR.post('immunizationPractitioner', {"apikey": apikey}, {body: dataImmunizationPractitioner, json: true}, function(error, response, body){
												immunizationPractitioner = body;
												if(immunizationPractitioner.err_code > 0){
													//console.log(immunizationPractitioner);
													res.json(immunizationPractitioner);	
												}
											})

											//human name
											dataHumanName = {
																				"id": humanNameId,
																				"use": humanNameUseCode,
																				"text": humanNamePrefix + ' ' + humanNameText + ' ' + humanNameSuffix,
																				"family": humanNameFamily,
																				"given": humanNameGiven,
																				"prefix": humanNamePrefix,
																				"suffix": humanNameSuffix,
																				"period_start": humanNamePeriodStart,
																				"period_end": humanNamePeriodEnd
																			}

											ApiFHIR.post('humanName', {"apikey": apikey}, {body: dataHumanName, json: true}, function(error, response, body){
												humanName = body;
												if(humanName.err_code > 0){
													res.json(humanName);	
												}
											})

											//contcat contact_point
											dataContactPoint = {
																					"id": contactContactPointId,
																					"system": contactContactPointSystemCode,
																					"value": contactContactPointValue,
																					"use": contactContactPointUseCode,
																					"rank": contactContactPointRank,
																					"period_start": contactContactPointPeriodStart,
																					"period_end": contactContactPointPeriodEnd,
																					/*"immunization_id": immunizationId,*/
																					"immunization_contact_id": immunizationPractitionerId
																				}

											//post to contact point
											ApiFHIR.post('contactPoint', {"apikey": apikey}, {body: dataContactPoint, json: true}, function(error, response, body){
												contactPoint = body;
												if(contactPoint.err_code > 0){
													res.json(contactPoint);	
												}
											})

											//address Contcat
											dataContactAddress = {
																			"id": contactAddressId,
																			"use": contactAddressUseCode,
																			"type": contactAddressTypeCode,
																			"text": contactAddressText,
																			"line": contactAddressLine,
																			"city": contactAddressCity,
																			"district": contactAddressDistrict,
																			"state": contactAddressState,
																			"postal_code": contactAddressPostalCode,
																			"country": contactAddressCountry,
																			"period_start": contactAddressPeriodStart,
																			"period_end": contactAddressPeriodEnd
																			//"immunization_id": immunizationId
																		}

											//post to contact point
											ApiFHIR.post('address', {"apikey": apikey}, {body: dataContactAddress, json: true}, function(error, response, body){
												address = body;
												if(address.err_code > 0){
													res.json(address);	
												}
											})

											res.json({"err_code": 0, "err_msg": "Immunization Contact has been add.", "data": [{"_id": immunizationId}]});
										}else{
											res.json({"err_code": 509, "err_msg": "Telecom Contact value already exist."});			
										}
									})
								});
								myEmitter.emit('checkImmunizationId');
								}else{
								res.json({"err_code": 513, "err_msg": "Actor Reference Practitioner Id not found"});		
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
			var immunizationId = req.params.immunization_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof immunizationId !== 'undefined'){
				if(validator.isEmpty(immunizationId)){
					err_code = 2;
					err_msg = "Immunization id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization id is required";
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
												checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationID){
													if(resImmunizationID.err_code > 0){
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
																							"immunization_id": immunizationId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this immunization.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Immunization Id not found"});		
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
		}
	},
	put:{
		immunization: function putImmunization(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			
			var immunizationId = req.params.immunization_id;
			var err_code = 0;
			var err_msg = "";

			var dataImmunization = {};
			
			//input check 
			if(typeof immunizationId !== 'undefined'){
				if(validator.isEmpty(immunizationId)){
					err_code = 2;
					err_msg = "Immunization id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization id is required";
			}
			
			if(typeof req.body.active !== 'undefined'){
				active =  req.body.active.trim().toLowerCase();
				if(validator.isEmpty(active)){
					err_code = 2;
					err_msg = "Active is required.";
				}else{
					dataImmunization.active = active;
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
					dataImmunization.type = type;
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
					dataImmunization.name = name;
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
					dataImmunization.alias = alias;
				}
			}else{
				alias = "";
			}			
			
			//Endpoint managingImmunization
			if(typeof req.body.partOf !== 'undefined'){
				parentId =  req.body.partOf.trim().toLowerCase();
				if(validator.isEmpty(parentId)){
					err_code = 2;
					err_msg = "Managing Immunization is required.";
				}else{
					dataImmunization.parentId = parentId;
				}
			}else{
				parentId = "";
			}
			
			//Endpoint managingImmunization
			if(typeof req.body.endpoint !== 'undefined'){
				endpointId =  req.body.endpoint.trim().toLowerCase();
				if(validator.isEmpty(endpointId)){
					err_code = 2;
					err_msg = "Endpoint is required.";
				}else{
					dataImmunization.endpointId = endpointId;
				}
			}else{
				endpointId = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkImmunizationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									//console.log(dataEndpoint);
										ApiFHIR.put('immunization', {"apikey": apikey, "_id": immunizationId}, {body: dataImmunization, json: true}, function(error, response, body){
											immunization = body;
											if(immunization.err_code > 0){
												res.json(immunization);	
											}else{
												res.json({"err_code": 0, "err_msg": "Immunization has been update.", "data": [{"_id": immunizationId}]});
											}
										})
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkType', function(){
							if(validator.isEmpty(type)){
								myEmitter.emit('checkImmunizationID');
							}else{
								checkCode(apikey, type, 'IMMUNIZATION_TYPE', function(resStatusCode){
									if(resStatusCode.err_code > 0){
										myEmitter.emit('checkImmunizationID');				
									}else{
										res.json({"err_code": 503, "err_msg": "Type Code not found."});	
									}
								})
							}
						})

						myEmitter.prependOnceListener('checkManagingImmunization', function(){
							if(validator.isEmpty(parentId)){
								myEmitter.emit('checkType');
							}else{
								checkUniqeValue(apikey, "IMMUNIZATION_ID|" + parentId, 'IMMUNIZATION', function(resImmunizationID){
									if(resImmunizationID.err_code > 0){
										myEmitter.emit('checkType');				
									}else{
										res.json({"err_code": 503, "err_msg": "Parent Id Immunization, immunization id not found."});	
									}
								})
							}
						})

						if(validator.isEmpty(endpointId)){
							myEmitter.emit('checkManagingImmunization');	
						}else{
							checkUniqeValue(apikey, "ENDPOINT_ID|" + endpointId, 'ENDPOINT', function(resEndpointID){
								if(resEndpointID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkManagingImmunization');
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
		},
		immunizationPractitioner: function putImmunizationPractitioner(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

			
			var immunizationId = req.params.immunization_id;
			var immunizationPractitionerId = req.params.immunization_contact_id;
			var err_code = 0;
			var err_msg = "";

			var dataImmunization = {};
			
			//input check 
			if(typeof immunizationId !== 'undefined'){
				if(validator.isEmpty(immunizationId)){
					err_code = 2;
					err_msg = "Immunization id is required";
				}
			}else{
				err_code = 1;
				err_msg = "Immunization id is required";
			}
			
			if(typeof immunizationPractitionerId !== 'undefined'){
				if(validator.isEmpty(immunizationPractitionerId)){
					err_code = 2;
					err_msg = "Immunization Practitioner id is required";
				}
			}else{
				err_code = 1;
				err_msg = "Immunization Practitioner id is required";
			}
			
			if(typeof req.body.role !== 'undefined'){
				role =  req.body.role.trim().toLowerCase();
				if(validator.isEmpty(role)){
					err_code = 2;
					err_msg = "Role is required.";
				}else{
					dataImmunization.role = role;
				}
			}else{
				role = "";
			}
			
			if(typeof req.body.actor !== 'undefined'){
				actor =  req.body.actor.trim().toLowerCase();
				if(validator.isEmpty(actor)){
					err_code = 2;
					err_msg = "Actor is required.";
				}else{
					dataImmunization.actor = actor;
				}
			}else{
				role = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.prependOnceListener('checkImmunizationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_CONTACT_ID|" + immunizationPractitionerId, 'IMMUNIZATION_CONTACT', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){
									//console.log(dataEndpoint);
										ApiFHIR.put('immunizationPractitioner', {"apikey": apikey, "_id": immunizationPractitionerId, "dr": "IMMUNIZATION_ID|"+immunizationId}, {body: dataImmunization, json: true}, function(error, response, body){
											//console.log(body);
											immunization = body;
											if(immunization.err_code > 0){
												res.json(immunization);	
											}else{
												res.json({"err_code": 0, "err_msg": "Immunization Contact has been update.", "data": [{"_id": immunizationPractitionerId}]});
											}
										})
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Contact Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkPurpose', function(){
							if(validator.isEmpty(purpose)){
								myEmitter.emit('checkImmunizationID');
							}else{
								checkCode(apikey, purpose, 'CONTACT_ENTITY_TYPE', function(resStatusCode){
									if(resStatusCode.err_code > 0){
										myEmitter.emit('checkImmunizationID');				
									}else{
										res.json({"err_code": 503, "err_msg": "Purpose Code not found."});	
									}
								})
							}
						})

						if(validator.isEmpty(immunizationId)){
							myEmitter.emit('checkPurpose');	
						}else{
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationID){
								if(resImmunizationID.err_code > 0){ //code harus lebih besar dari nol, ini menunjukan datanya valid
									myEmitter.emit('checkPurpose');
								}else{
									res.json({"err_code": 501, "err_msg": "Immunization id not found"});
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
		identifier: function updateIdentifier(req, res){
				var ipAddres = req.connection.remoteAddress;
				var apikey = req.params.apikey;
				var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
				var immunizationId = req.params.immunization_id;
				var identifierId = req.params.identifier_id;

				var err_code = 0;
				var err_msg = "";
				var dataIdentifier = {};
				//input check 
				if(typeof immunizationId !== 'undefined'){
					if(validator.isEmpty(immunizationId)){
						err_code = 2;
						err_msg = "Immunization id is required";
					}
				}else{
					err_code = 2;
					err_msg = "Immunization id is required";
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
							myEmitter.prependOnceListener('checkImmunizationID', function(){
								checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationId, 'IMMUNIZATION', function(resImmunizationId){
									if(resImmunizationId.err_code > 0){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "IMMUNIZATION_ID|"+immunizationId}, {body: dataIdentifier, json: true}, function(error, response, body){
													identifier = body;
													if(identifier.err_code > 0){
														res.json(identifier);	
													}else{
														res.json({"err_code": 0, "err_msg": "Identifier has been update in this immunization.", "data": identifier.data});
													}
												})
											}else{
												res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
											}
										})
									}else{
										res.json({"err_code": 504, "err_msg": "Immunization Id not found"});		
									}
								})
							})

							myEmitter.prependOnceListener('checkIdentifierValue', function(){
								if(validator.isEmpty(identifierValue)){
									myEmitter.emit('checkImmunizationID');
								}else{
									checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
										if(resIdentifierValue.err_code == 0){
											myEmitter.emit('checkImmunizationID');				
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