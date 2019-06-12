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
		immunizationEvaluation : function getImmunizationEvaluation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};

			//params from query string
			var immunizationEvaluationId = req.query._id;
			var date = req.query.date;
			var doseStatus = req.query.doseStatus;
			var identifier = req.query.identifier;
			var immunization_event = req.query.immunizationEvent;
			var patient = req.query.patient;
			var status = req.query.status;
			var target_disease = req.query.targetDisease;

			if(typeof immunizationEvaluationId !== 'undefined'){
				if(!validator.isEmpty(immunizationEvaluationId)){
					qString.immunizationEvaluationId = immunizationEvaluationId; 
				}else{
					res.json({"err_code": 1, "err_msg": "Immunization Evaluation id is required."});
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

			if(typeof dose_status !== 'undefined'){
				if(!validator.isEmpty(dose_status)){
					qString.doseStatus = dose_status; 
				}else{
					res.json({"err_code": 1, "err_msg": "Dose status is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "Identifier is empty."});
				}
			}

			if(typeof immunization_event !== 'undefined'){
				if(!validator.isEmpty(immunization_event)){
					qString.immunizationEvent = immunization_event; 
				}else{
					res.json({"err_code": 1, "err_msg": "Immunization event is empty."});
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

			if(typeof target_disease !== 'undefined'){
				if(!validator.isEmpty(target_disease)){
					qString.targetDisease = target_disease; 
				}else{
					res.json({"err_code": 1, "err_msg": "Target disease is empty."});
				}
			}


			seedPhoenixFHIR.path.GET = {
				"ImmunizationEvaluation" : {
					"location": "%(apikey)s/ImmunizationEvaluation",
					"query": qString
				}
			}
			var ApiFHIR = new Apiclient(seedPhoenixFHIR);

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){
					ApiFHIR.get('ImmunizationEvaluation', {"apikey": apikey}, {}, function (error, response, body) {
						if(error){
							res.json(error);
						}else{
							var immunizationEvaluation = JSON.parse(body); //object
							//cek apakah ada error atau tidak
							if(immunizationEvaluation.err_code == 0){
								//cek jumdata dulu
								if(immunizationEvaluation.data.length > 0){
									newImmunizationEvaluation = [];
									for(i=0; i < immunizationEvaluation.data.length; i++){
										myEmitter.once("getIdentifier", function(immunizationEvaluation, index, newImmunizationEvaluation, countImmunizationEvaluation){
											/*console.log(immunizationEvaluation);*/
														//get identifier
														qString = {};
														qString.immunization_evaluation_id = immunization_evaluation.id;
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
																var objectImmunizationEvaluation = {};
																objectImmunizationEvaluation.resourceType = immunizationEvaluation.resourceType;
																objectImmunizationEvaluation.id = immunizationEvaluation.id;
																objectImmunizationEvaluation.identifier = identifier.data;
																objectImmunizationEvaluation.patient = immunizationEvaluation.patient;
																objectImmunizationEvaluation.date = immunizationEvaluation.date;
																objectImmunizationEvaluation.authority = immunizationEvaluation.authority;
																objectImmunizationEvaluation.targetDisease = immunizationEvaluation.targetDisease;
																objectImmunizationEvaluation.immunizationEvent = immunizationEvaluation.immunizationEvent;
																objectImmunizationEvaluation.doseStatus = immunizationEvaluation.doseStatus;
																objectImmunizationEvaluation.doseStatusReason = immunizationEvaluation.doseStatusReason;
																objectImmunizationEvaluation.description = immunizationEvaluation.description;
																objectImmunizationEvaluation.series = immunizationEvaluation.series;
																objectImmunizationEvaluation.doseNumber = immunizationEvaluation.doseNumber;
																objectImmunizationEvaluation.seriesDoses = immunizationEvaluation.seriesDoses;
																newImmunizationEvaluation[index] = objectImmunizationEvaluation;
																
																if(index == countImmunizationEvaluation -1 ){
																	res.json({"err_code": 0, "data":newImmunizationEvaluation});				
																}
															}else{
																res.json(identifier);
															}
														})
													})
										myEmitter.emit("getIdentifier", immunizationEvaluation.data[i], i, newImmunizationEvaluation, immunizationEvaluation.data.length);
									}
								}else{
									res.json({"err_code": 2, "err_msg": "Immunization Evaluation is empty."});	
								}
							}else{
								res.json(immunizationEvaluation);
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
					var immunizationEvaluationId = req.params.immunization_evaluation_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "IMMUNIZATION_EVALUATION_ID|" + immunizationEvaluationId, 'IMMUNIZATION_EVALUATION', function(resImmunizationEvaluationID){
								if(resImmunizationEvaluationID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.immunization_evaluation_id = immunizationEvaluationId;
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
						  			qString.immunization_evaluation_id = immunizationEvaluationId;
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
									res.json({"err_code": 501, "err_msg": "Immunization Evaluation Id not found"});		
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
		immunizationEvaluation : function addImmunizationEvaluation(req, res){
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
status|status||nn
patient|patient|
date|date
authority|authority|
targetDisease|targetDisease||nn
immunizationEvent|immunizationEvent|
doseStatus|doseStatus||nn
doseStatusReason|doseStatusReason|
description|description|
series|series|
doseNumber.doseNumberPositiveInt|doseNumberDoseNumberPositiveInt|integer
doseNumber.doseNumberString|doseNumberDoseNumberString|
seriesDoses.seriesDosesPositiveInt|seriesDosesSeriesDosesPositiveInt|integer
seriesDoses.seriesDosesString|seriesDosesSeriesDosesString|
*/
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "Immunization Evaluation status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Immunization Evaluation request.";
			}

			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					patient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Immunization Evaluation request.";
			}

			if(typeof req.body.date !== 'undefined'){
				var date =  req.body.date.trim().toLowerCase();
				if(validator.isEmpty(date)){
					date = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'date' in json Immunization Evaluation request.";
			}

			if(typeof req.body.authority !== 'undefined'){
				var authority =  req.body.authority.trim().toLowerCase();
				if(validator.isEmpty(authority)){
					authority = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'authority' in json Immunization Evaluation request.";
			}

			if(typeof req.body.targetDisease !== 'undefined'){
				var targetDisease =  req.body.targetDisease.trim().toLowerCase();
				if(validator.isEmpty(targetDisease)){
					err_code = 2;
					err_msg = "Immunization Evaluation target disease is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'target disease' in json Immunization Evaluation request.";
			}

			if(typeof req.body.immunizationEvent !== 'undefined'){
				var immunizationEvent =  req.body.immunizationEvent.trim().toLowerCase();
				if(validator.isEmpty(immunizationEvent)){
					immunizationEvent = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'immunization event' in json Immunization Evaluation request.";
			}

			if(typeof req.body.doseStatus !== 'undefined'){
				var doseStatus =  req.body.doseStatus.trim().toLowerCase();
				if(validator.isEmpty(doseStatus)){
					err_code = 2;
					err_msg = "Immunization Evaluation dose status is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose status' in json Immunization Evaluation request.";
			}

			if(typeof req.body.doseStatusReason !== 'undefined'){
				var doseStatusReason =  req.body.doseStatusReason.trim().toLowerCase();
				if(validator.isEmpty(doseStatusReason)){
					doseStatusReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose status reason' in json Immunization Evaluation request.";
			}

			if(typeof req.body.description !== 'undefined'){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					description = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'description' in json Immunization Evaluation request.";
			}

			if(typeof req.body.series !== 'undefined'){
				var series =  req.body.series.trim().toLowerCase();
				if(validator.isEmpty(series)){
					series = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series' in json Immunization Evaluation request.";
			}

			if(typeof req.body.doseNumber.doseNumberPositiveInt !== 'undefined'){
				var doseNumberDoseNumberPositiveInt =  req.body.doseNumber.doseNumberPositiveInt;
				if(validator.isEmpty(doseNumberDoseNumberPositiveInt)){
					doseNumberDoseNumberPositiveInt = "";
				}else{
					if(validator.isInt(doseNumberDoseNumberPositiveInt)){
						err_code = 2;
						err_msg = "Immunization Evaluation dose number dose number positive int is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose number dose number positive int' in json Immunization Evaluation request.";
			}

			if(typeof req.body.doseNumber.doseNumberString !== 'undefined'){
				var doseNumberDoseNumberString =  req.body.doseNumber.doseNumberString.trim().toLowerCase();
				if(validator.isEmpty(doseNumberDoseNumberString)){
					doseNumberDoseNumberString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dose number dose number string' in json Immunization Evaluation request.";
			}

			if(typeof req.body.seriesDoses.seriesDosesPositiveInt !== 'undefined'){
				var seriesDosesSeriesDosesPositiveInt =  req.body.seriesDoses.seriesDosesPositiveInt;
				if(validator.isEmpty(seriesDosesSeriesDosesPositiveInt)){
					seriesDosesSeriesDosesPositiveInt = "";
				}else{
					if(validator.isInt(seriesDosesSeriesDosesPositiveInt)){
						err_code = 2;
						err_msg = "Immunization Evaluation series doses series doses positive int is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series doses series doses positive int' in json Immunization Evaluation request.";
			}

			if(typeof req.body.seriesDoses.seriesDosesString !== 'undefined'){
				var seriesDosesSeriesDosesString =  req.body.seriesDoses.seriesDosesString.trim().toLowerCase();
				if(validator.isEmpty(seriesDosesSeriesDosesString)){
					seriesDosesSeriesDosesString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'series doses series doses string' in json Immunization Evaluation request.";
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
													var immunizationEvaluationId = 'ime' + unicId;

													dataImmunizationEvaluation = {
														"immunization_evaluation_id" : immunizationEvaluationId,
														"status" : status,
														"patient" : patient,
														"date" : date,
														"authority" : authority,
														"targetDisease" : targetDisease,
														"immunizationEvent" : immunizationEvent,
														"doseStatus" : doseStatus,
														"doseStatusReason" : doseStatusReason,
														"description" : description,
														"series" : series,
														"doseNumberPositiveInt" : doseNumberDoseNumberPositiveInt,
														"doseNumberString" : doseNumberDoseNumberString,
														"seriesDosesPositiveInt" : seriesDosesSeriesDosesPositiveInt,
														"seriesDosesString" : seriesDosesSeriesDosesString
													};
													console.log(dataImmunizationEvaluation);
													ApiFHIR.post('immunizationEvaluation', {"apikey": apikey}, {body: dataImmunizationEvaluation, json: true}, function(error, response, body){
														immunizationEvaluation = body;
														if(immunizationEvaluation.err_code > 0){
															res.json(immunizationEvaluation);	
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
																						"immunization_evaluation_id": immunizationEvaluationId
																					}

													ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
														identifier = body;
														if(identifier.err_code > 0){
															res.json(identifier);	
														}
													})

													res.json({"err_code": 0, "err_msg": "Immunization Evaluation has been add.", "data": [{"_id": immunizationEvaluationId}]});
												}else{
													res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
												}
											})
										});

										//cek code
										/*
										status|immunization-evaluation-status
										targetDisease|immunization-evaluation-target-disease
										doseStatus|immunization-evaluation-dose-status
										doseStatusReason|immunization-evaluation-dose-status-reason
										*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'IMMUNIZATION_EVALUATION_STATUS', function (resStatusCode) {
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

										myEmitter.prependOnceListener('checkTargetDisease', function () {
											if (!validator.isEmpty(targetDisease)) {
												checkCode(apikey, targetDisease, 'IMMUNIZATION_EVALUATION_TARGET_DISEASE', function (resTargetDiseaseCode) {
													if (resTargetDiseaseCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Target disease code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})

										myEmitter.prependOnceListener('checkDoseStatus', function () {
											if (!validator.isEmpty(doseStatus)) {
												checkCode(apikey, doseStatus, 'IMMUNIZATION_EVALUATION_DOSE_STATUS', function (resDoseStatusCode) {
													if (resDoseStatusCode.err_code > 0) {
														myEmitter.emit('checkTargetDisease');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Dose status code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkTargetDisease');
											}
										})

										myEmitter.prependOnceListener('checkDoseStatusReason', function () {
											if (!validator.isEmpty(doseStatusReason)) {
												checkCode(apikey, doseStatusReason, 'IMMUNIZATION_EVALUATION_DOSE_STATUS_REASON', function (resDoseStatusReasonCode) {
													if (resDoseStatusReasonCode.err_code > 0) {
														myEmitter.emit('checkDoseStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Dose status reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDoseStatus');
											}
										})

										//cek value
										/*
										patient|Patient
										authority|Organization
										immunizationEvent|Immunization
										*/
										
										myEmitter.prependOnceListener('checkPatient', function () {
											if (!validator.isEmpty(patient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
													if (resPatient.err_code > 0) {
														myEmitter.emit('checkDoseStatusReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDoseStatusReason');
											}
										})

										myEmitter.prependOnceListener('checkAuthority', function () {
											if (!validator.isEmpty(authority)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + authority, 'ORGANIZATION', function (resAuthority) {
													if (resAuthority.err_code > 0) {
														myEmitter.emit('checkPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Authority id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPatient');
											}
										})

										if (!validator.isEmpty(immunizationEvent)) {
											checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationEvent, 'IMMUNIZATION', function (resImmunizationEvent) {
												if (resImmunizationEvent.err_code > 0) {
													myEmitter.emit('checkAuthority');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Immunization event id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkAuthority');
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
			var immunizationEvaluationId = req.params.immunization_evaluation_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof immunizationEvaluationId !== 'undefined'){
				if(validator.isEmpty(immunizationEvaluationId)){
					err_code = 2;
					err_msg = "Immunization Evaluation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Evaluation id is required";
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
												checkUniqeValue(apikey, "IMMUNIZATION_EVALUATION_ID|" + immunizationEvaluationId, 'IMMUNIZATION_EVALUATION', function(resImmunizationEvaluationID){
													if(resImmunizationEvaluationID.err_code > 0){
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
																							"immunization_evaluation_id": immunizationEvaluationId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code == 0){
																res.json({"err_code": 0, "err_msg": "Identifier has been add in this immunization Evaluation.", "data": identifier.data});
															}else{
																res.json(identifier);	
															}
														})
													}else{
														res.json({"err_code": 503, "err_msg": "Immunization Evaluation Id not found"});		
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
	},
	put: {
		immunizationEvaluation : function putImmunizationEvaluation(req, res){
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			//var isValid = new RegExp("^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$");
			var immunizationEvaluationId = req.params.adverse_event_id;

      var err_code = 0;
      var err_msg = "";
      var dataImmunizationEvaluation = {};

			if(typeof immunizationEvaluationId !== 'undefined'){
				if(validator.isEmpty(immunizationEvaluationId)){
					err_code = 2;
					err_msg = "immunizationEvaluation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "ImmunizationEvaluation id is required";
			}
			
			/*
			var status  = req.body.status;
			var patient  = req.body.patient;
			var date  = req.body.date;
			var authority  = req.body.authority;
			var targetDisease  = req.body.targetDisease;
			var immunizationEvent  = req.body.immunizationEvent;
			var doseStatus  = req.body.doseStatus;
			var doseStatusReason  = req.body.doseStatusReason;
			var description  = req.body.description;
			var series  = req.body.series;
			var doseNumberPositiveInt  = req.body.doseNumberPositiveInt;
			var doseNumberString  = req.body.doseNumberString;
			var seriesDosesPositiveInt  = req.body.seriesDosesPositiveInt;
			var seriesDosesString  = req.body.seriesDosesString;
			*/

			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					err_code = 2;
					err_msg = "immunization evaluation status is required.";
				}else{
					dataImmunizationEvaluation.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					dataImmunizationEvaluation.patient = "";
				}else{
					dataImmunizationEvaluation.patient = patient;
				}
			}else{
			  patient = "";
			}

			if(typeof req.body.date !== 'undefined' && req.body.date !== ""){
				var date =  req.body.date.trim().toLowerCase();
				if(validator.isEmpty(date)){
					dataImmunizationEvaluation.date = "";
				}else{
					dataImmunizationEvaluation.date = date;
				}
			}else{
			  date = "";
			}

			if(typeof req.body.authority !== 'undefined' && req.body.authority !== ""){
				var authority =  req.body.authority.trim().toLowerCase();
				if(validator.isEmpty(authority)){
					dataImmunizationEvaluation.authority = "";
				}else{
					dataImmunizationEvaluation.authority = authority;
				}
			}else{
			  authority = "";
			}

			if(typeof req.body.targetDisease !== 'undefined' && req.body.targetDisease !== ""){
				var targetDisease =  req.body.targetDisease.trim().toLowerCase();
				if(validator.isEmpty(targetDisease)){
					err_code = 2;
					err_msg = "immunization evaluation target disease is required.";
				}else{
					dataImmunizationEvaluation.targetDisease = targetDisease;
				}
			}else{
			  targetDisease = "";
			}

			if(typeof req.body.immunizationEvent !== 'undefined' && req.body.immunizationEvent !== ""){
				var immunizationEvent =  req.body.immunizationEvent.trim().toLowerCase();
				if(validator.isEmpty(immunizationEvent)){
					dataImmunizationEvaluation.immunizationEvent = "";
				}else{
					dataImmunizationEvaluation.immunizationEvent = immunizationEvent;
				}
			}else{
			  immunizationEvent = "";
			}

			if(typeof req.body.doseStatus !== 'undefined' && req.body.doseStatus !== ""){
				var doseStatus =  req.body.doseStatus.trim().toLowerCase();
				if(validator.isEmpty(doseStatus)){
					err_code = 2;
					err_msg = "immunization evaluation dose status is required.";
				}else{
					dataImmunizationEvaluation.doseStatus = doseStatus;
				}
			}else{
			  doseStatus = "";
			}

			if(typeof req.body.doseStatusReason !== 'undefined' && req.body.doseStatusReason !== ""){
				var doseStatusReason =  req.body.doseStatusReason.trim().toLowerCase();
				if(validator.isEmpty(doseStatusReason)){
					dataImmunizationEvaluation.doseStatusReason = "";
				}else{
					dataImmunizationEvaluation.doseStatusReason = doseStatusReason;
				}
			}else{
			  doseStatusReason = "";
			}

			if(typeof req.body.description !== 'undefined' && req.body.description !== ""){
				var description =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(description)){
					dataImmunizationEvaluation.description = "";
				}else{
					dataImmunizationEvaluation.description = description;
				}
			}else{
			  description = "";
			}

			if(typeof req.body.series !== 'undefined' && req.body.series !== ""){
				var series =  req.body.series.trim().toLowerCase();
				if(validator.isEmpty(series)){
					dataImmunizationEvaluation.series = "";
				}else{
					dataImmunizationEvaluation.series = series;
				}
			}else{
			  series = "";
			}

			if(typeof req.body.doseNumber.doseNumberPositiveInt !== 'undefined' && req.body.doseNumber.doseNumberPositiveInt !== ""){
				var doseNumberDoseNumberPositiveInt =  req.body.doseNumber.doseNumberPositiveInt;
				if(validator.isEmpty(doseNumberDoseNumberPositiveInt)){
					dataImmunizationEvaluation.doseNumberPositiveInt = "";
				}else{
					if(validator.isInt(doseNumberDoseNumberPositiveInt)){
						err_code = 2;
						err_msg = "immunization evaluation dose number dose number positive int is must be number.";
					}else{
						dataImmunizationEvaluation.doseNumberPositiveInt = doseNumberDoseNumberPositiveInt;
					}
				}
			}else{
			  doseNumberDoseNumberPositiveInt = "";
			}

			if(typeof req.body.doseNumber.doseNumberString !== 'undefined' && req.body.doseNumber.doseNumberString !== ""){
				var doseNumberDoseNumberString =  req.body.doseNumber.doseNumberString.trim().toLowerCase();
				if(validator.isEmpty(doseNumberDoseNumberString)){
					dataImmunizationEvaluation.doseNumberString = "";
				}else{
					dataImmunizationEvaluation.doseNumberString = doseNumberDoseNumberString;
				}
			}else{
			  doseNumberDoseNumberString = "";
			}

			if(typeof req.body.seriesDoses.seriesDosesPositiveInt !== 'undefined' && req.body.seriesDoses.seriesDosesPositiveInt !== ""){
				var seriesDosesSeriesDosesPositiveInt =  req.body.seriesDoses.seriesDosesPositiveInt;
				if(validator.isEmpty(seriesDosesSeriesDosesPositiveInt)){
					dataImmunizationEvaluation.seriesDosesPositiveInt = "";
				}else{
					if(validator.isInt(seriesDosesSeriesDosesPositiveInt)){
						err_code = 2;
						err_msg = "immunization evaluation series doses series doses positive int is must be number.";
					}else{
						dataImmunizationEvaluation.seriesDosesPositiveInt = seriesDosesSeriesDosesPositiveInt;
					}
				}
			}else{
			  seriesDosesSeriesDosesPositiveInt = "";
			}

			if(typeof req.body.seriesDoses.seriesDosesString !== 'undefined' && req.body.seriesDoses.seriesDosesString !== ""){
				var seriesDosesSeriesDosesString =  req.body.seriesDoses.seriesDosesString.trim().toLowerCase();
				if(validator.isEmpty(seriesDosesSeriesDosesString)){
					dataImmunizationEvaluation.seriesDosesString = "";
				}else{
					dataImmunizationEvaluation.seriesDosesString = seriesDosesSeriesDosesString;
				}
			}else{
			  seriesDosesSeriesDosesString = "";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){	
						myEmitter.prependOnceListener('checkImmunizationEvaluationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_EVALUATION_ID|" + immunizationEvaluationId, 'IMMUNIZATION_EVALUATION', function(resImmunizationEvaluationID){
								if(resImmunizationEvaluationID.err_code > 0){
									//console.log(dataImmunizationEvaluation);
										ApiFHIR.put('immunizationEvaluation', {"apikey": apikey, "_id": immunizationEvaluationId}, {body: dataImmunizationEvaluation, json: true}, function(error, response, body){
											immunizationEvaluation = body;
											if(immunizationEvaluation.err_code > 0){
												res.json(immunizationEvaluation);	
											}else{
												res.json({"err_code": 0, "err_msg": "Immunization Evaluation has been update.", "data": [{"_id": immunizationEvaluationId}]});
											}
										})
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Evaluation Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkStatus', function () {
							if (!validator.isEmpty(status)) {
								checkCode(apikey, status, 'IMMUNIZATION_EVALUATION_STATUS', function (resStatusCode) {
									if (resStatusCode.err_code > 0) {
										myEmitter.emit('checkImmunizationEvaluationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkImmunizationEvaluationID');
							}
						})

						myEmitter.prependOnceListener('checkTargetDisease', function () {
							if (!validator.isEmpty(targetDisease)) {
								checkCode(apikey, targetDisease, 'IMMUNIZATION_EVALUATION_TARGET_DISEASE', function (resTargetDiseaseCode) {
									if (resTargetDiseaseCode.err_code > 0) {
										myEmitter.emit('checkStatus');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Target disease code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkStatus');
							}
						})

						myEmitter.prependOnceListener('checkDoseStatus', function () {
							if (!validator.isEmpty(doseStatus)) {
								checkCode(apikey, doseStatus, 'IMMUNIZATION_EVALUATION_DOSE_STATUS', function (resDoseStatusCode) {
									if (resDoseStatusCode.err_code > 0) {
										myEmitter.emit('checkTargetDisease');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Dose status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkTargetDisease');
							}
						})

						myEmitter.prependOnceListener('checkDoseStatusReason', function () {
							if (!validator.isEmpty(doseStatusReason)) {
								checkCode(apikey, doseStatusReason, 'IMMUNIZATION_EVALUATION_DOSE_STATUS_REASON', function (resDoseStatusReasonCode) {
									if (resDoseStatusReasonCode.err_code > 0) {
										myEmitter.emit('checkDoseStatus');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Dose status reason code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkDoseStatus');
							}
						})

						myEmitter.prependOnceListener('checkPatient', function () {
							if (!validator.isEmpty(patient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
									if (resPatient.err_code > 0) {
										myEmitter.emit('checkDoseStatusReason');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkDoseStatusReason');
							}
						})

						myEmitter.prependOnceListener('checkAuthority', function () {
							if (!validator.isEmpty(authority)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + authority, 'ORGANIZATION', function (resAuthority) {
									if (resAuthority.err_code > 0) {
										myEmitter.emit('checkPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Authority id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPatient');
							}
						})

						if (!validator.isEmpty(immunizationEvent)) {
							checkUniqeValue(apikey, "IMMUNIZATION_ID|" + immunizationEvent, 'IMMUNIZATION', function (resImmunizationEvent) {
								if (resImmunizationEvent.err_code > 0) {
									myEmitter.emit('checkAuthority');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Immunization event id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkAuthority');
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
			var immunizationEvaluationId = req.params.immunization_evaluation_id;
			var identifierId = req.params.identifier_id;

			var err_code = 0;
			var err_msg = "";
			var dataIdentifier = {};
			//input check 
			if(typeof immunizationEvaluationId !== 'undefined'){
				if(validator.isEmpty(immunizationEvaluationId)){
					err_code = 2;
					err_msg = "Immunization Evaluation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Immunization Evaluation id is required";
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
						myEmitter.prependOnceListener('checkImmunizationEvaluationID', function(){
							checkUniqeValue(apikey, "IMMUNIZATION_EVALUATION_ID|" + immunizationEvaluationId, 'IMMUNIZATION_EVALUATION', function(resImmunizationEvaluationID){
								if(resImmunizationEvaluationID.err_code > 0){
									checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
										if(resIdentifierID.err_code > 0){
											ApiFHIR.put('identifier', {"apikey": apikey, "_id": identifierId, "dr": "IMMUNIZATION_EVALUATION_ID|"+immunizationEvaluationId}, {body: dataIdentifier, json: true}, function(error, response, body){
												identifier = body;
												if(identifier.err_code > 0){
													res.json(identifier);	
												}else{
													res.json({"err_code": 0, "err_msg": "Identifier has been update in this immunization Evaluation.", "data": identifier.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Identifier Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Immunization Evaluation Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkIdentifierValue', function(){
							if(validator.isEmpty(identifierValue)){
								myEmitter.emit('checkImmunizationEvaluationID');
							}else{
								checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function(resIdentifierValue){
									if(resIdentifierValue.err_code == 0){
										myEmitter.emit('checkImmunizationEvaluationID');				
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