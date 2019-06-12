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
seedPhoenix.base.port = configYaml.phoenix.port;

var Api = new Apiclient(seedPhoenix);

seedPhoenixFHIR = require(path.resolve('../../application/config/seed_phoenix_fhir.json'));
seedPhoenixFHIR.base.hostname = configYaml.phoenix.host;
seedPhoenixFHIR.base.port = configYaml.phoenix.port;

var ApiFHIR = new Apiclient(seedPhoenixFHIR);

var controller = {
  get: {
    flag: function getFlag(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var flagId = req.query._id;
			var author = req.query.author;
			var date = req.query.date;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var patient = req.query.patient;
			var subject = req.query.subject;
			var offset = req.query.offset;
			var limit = req.query.limit;


      var qString = {};

      if (typeof flagId !== 'undefined') {
        if (!validator.isEmpty(flagId)) {
          qString._id = flagId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Flag Id is required."
          })
        }
      }
      if (typeof author !== 'undefined') {
        if (!validator.isEmpty(author)) {
          qString.author = author;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Author is empty."
          });
        }
      }
			if (typeof date !== 'undefined') {
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
      if (typeof encounter !== 'undefined') {
        if (!validator.isEmpty(encounter)) {
          qString.encounter = encounter;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Encounter is empty."
          });
        }
      }
			if (typeof identifier !== 'undefined') {
        if (!validator.isEmpty(identifier)) {
          qString.identifier = identifier;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Identifier is empty."
          });
        }
      }
			if (typeof patient !== 'undefined') {
        if (!validator.isEmpty(patient)) {
          qString.patient = patient;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Patient is empty."
          });
        }
      }
			if (typeof subject !== 'undefined') {
        if (!validator.isEmpty(subject)) {
          qString.subject = subject;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Subject is empty."
          });
        }
      }
			
			
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
			
      seedPhoenixFHIR.path.GET = {
        "Flag": {
          "location": "%(apikey)s/Flag",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);

      checkApikey(apikey, ipAddres, function (result) {
        if (result.err_code == 0) {
          ApiFHIR.get('Flag', {
            "apikey": apikey
          }, {}, function (error, response, body) {
            if (error) {
              res.json(error);
            } else {
              var flag = JSON.parse(body); //object
              //cek apakah ada error atau tidak
              if (flag.err_code == 0) {
                if (flag.data.length > 0) {
                  newFlag = [];
                  for (i = 0; i < flag.data.length; i++) {
                    myEmitter.prependOnceListener("getIdentifier", function (flag, index, newFlag, countFlag) {
                      //get identifier
											console.log(flag.id)
                      qString = {};
                      qString.flag_id = flag.id;
                      qString.identifier_value = identifier;
                      seedPhoenixFHIR.path.GET = {
                        "Identifier": {
                          "location": "%(apikey)s/Identifier",
                          "query": qString
                        }
                      }
                      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
                      ApiFHIR.get('Identifier', {
                        "apikey": apikey
                      }, {}, function (error, response, body) {
                        var identifier = JSON.parse(body);
                        if (identifier.err_code == 0) {
                          var objectFlag = {};
                          objectFlag.resourceType = flag.resourceType;
                          objectFlag.id = flag.id;
                          objectFlag.identifier = identifier.data;
                          objectFlag.status = flag.status;
                          objectFlag.category = flag.category;
                          objectFlag.code = flag.code;
                          objectFlag.subject = flag.subject;
                          objectFlag.period = flag.period;
                          objectFlag.encounter = flag.encounter;
                          objectFlag.author = flag.author;

                          newFlag[index] = objectFlag
													
													if (index == countFlag - 1) {
														res.json({
															"err_code": 0,
															"data": newFlag
														});
													}
                        } else {
                          res.json(identifier);
                        }
                      })
                    })
                    myEmitter.emit("getIdentifier", flag.data[i], i, newFlag, flag.data.length);
                  }
                } else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Flag is empty."
                  });
                }
              } else {
                res.json(flag);
              }
            }
          });
        } else {
          result.err_code = 500;
          res.json(result);
        }
      });
    }
  },
  post: {
    flag: function addFlag(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");

      var err_code = 0;
      var err_msg = "";

      //input check
      //identifier use
      if (typeof req.body.identifier.use !== 'undefined') {
        var identifierUseCode = req.body.identifier.use.trim().toLowerCase();
        if (validator.isEmpty(identifierUseCode)) {
          err_code = 2;
          err_msg = "Identifier Use is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'use' in json identifier request.";
      }
      //identifier type
      if (typeof req.body.identifier.type !== 'undefined') {
        var identifierTypeCode = req.body.identifier.type.trim().toUpperCase();
        if (validator.isEmpty(identifierTypeCode)) {
          err_code = 2;
          err_msg = "Identifier Type is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'type' in json identifier request.";
      }
      //identifier value
      if (typeof req.body.identifier.value !== 'undefined') {
        var identifierValue = req.body.identifier.value.trim().toLowerCase();
        if (validator.isEmpty(identifierValue)) {
          err_code = 2;
          err_msg = "Identifier Value is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'value' in json identifier request.";
      }
      //identifier period
      if (typeof req.body.identifier.period !== 'undefined') {
        var identifierPeriod = req.body.identifier.period;
        if (identifierPeriod.indexOf("to") > 0) {
          arrIdentifierPeriod = identifierPeriod.split("to");
          identifierPeriodStart = arrIdentifierPeriod[0];
          identifierPeriodEnd = arrIdentifierPeriod[1];
          if (!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)) {
            err_code = 2;
            err_msg = "Identifier Period invalid date format.";
          }
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'identifierPeriod' in json identifier request.";
      }
      //status
      if (typeof req.body.status !== 'undefined') {
        var statusCode = req.body.status.trim().toLowerCase();
        if (validator.isEmpty(statusCode)) {
          err_code = 2;
          err_msg = "Status is empty";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'flag status' in json request.";
      }
			//category
      if (typeof req.body.category !== 'undefined') {
        var categoryCode = req.body.category.trim().toLowerCase();
        if (validator.isEmpty(categoryCode)) {
          categoryCode = "";
        }
      } else {
        categoryCode = "";
      }
      //name
      if (typeof req.body.code !== 'undefined' && req.body.code !== "") {
        var codeCode = req.body.code.trim().toLowerCase();
        if (!validator.isInt(codeCode)) {
          err_code = 2;
          err_msg = "Code must be int";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'flag code' in json request.";
      }    
			//subject patient
      if (typeof req.body.subject.Patient !== 'undefined') {
        var subPatientId = req.body.subject.Patient.trim().toLowerCase();
        if (validator.isEmpty(subPatientId)) {
          err_code = 2;
          err_msg = "Subject Patient is empty";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'subject patient id' in json request.";
      }
			//subject Location
      if (typeof req.body.subject.Location !== 'undefined') {
        var subLocationId = req.body.subject.Location.trim().toLowerCase();
        if (validator.isEmpty(subLocationId)) {
          err_code = 2;
          err_msg = "Subject Location is empty";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'subject location id' in json request.";
      }
			//subject Group
      if (typeof req.body.subject.Group !== 'undefined') {
        var subGroupId = req.body.subject.Group.trim().toLowerCase();
        if (validator.isEmpty(subGroupId)) {
          err_code = 2;
          err_msg = "Subject Group is empty";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'subject group id' in json request.";
      }
			//subject Organization
      if (typeof req.body.subject.Organization !== 'undefined') {
        var subOrganizationId = req.body.subject.Organization.trim().toLowerCase();
        if (validator.isEmpty(subOrganizationId)) {
          err_code = 2;
          err_msg = "Subject Organization is empty";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'subject organization id' in json request.";
      }
			//subject Practitioner
      if (typeof req.body.subject.Practitioner !== 'undefined') {
        var subPractitionerId = req.body.subject.Practitioner.trim().toLowerCase();
        if (validator.isEmpty(subPractitionerId)) {
          err_code = 2;
          err_msg = "Subject Practitioner is empty";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'subject practitioner id' in json request.";
      }
			//subject PlanDefinition
      if (typeof req.body.subject.PlanDefinition !== 'undefined') {
        var subPlanDefinitionId = req.body.subject.PlanDefinition.trim().toLowerCase();
        if (validator.isEmpty(subPlanDefinitionId)) {
          err_code = 2;
          err_msg = "Subject PlanDefinition is empty";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'subject PlanDefinition id' in json request.";
      }
			//subject Medication
      if (typeof req.body.subject.Medication !== 'undefined') {
        var subMedicationId = req.body.subject.Medication.trim().toLowerCase();
        if (validator.isEmpty(subMedicationId)) {
          err_code = 2;
          err_msg = "Subject Medication is empty";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'subject Medication id' in json request.";
      }
			//subject Procedure
      if (typeof req.body.subject.Procedure !== 'undefined') {
        var subProcedureId = req.body.subject.Procedure.trim().toLowerCase();
        if (validator.isEmpty(subProcedureId)) {
          err_code = 2;
          err_msg = "Subject Procedure is empty";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'subject Procedure id' in json request.";
      }
      //period
      if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var flagPeriod = req.body.period;
        if (flagPeriod.indexOf("to") > 0) {
          arrFlagPeriod = flagPeriod.split("to");
          flagPeriodStart = arrFlagPeriod[0];
          flagPeriodEnd = arrFlagPeriod[1];
          if (!regex.test(flagPeriodStart) && !regex.test(flagPeriodEnd)) {
            err_code = 2;
            err_msg = "Flag Period invalid date format.";
          }
        }
      } else {
        flagPeriodStart = "";
        flagPeriodEnd = "";
      }
			//encounter
      if (typeof req.body.encounter !== 'undefined') {
        var encounterId = req.body.encounter.trim().toLowerCase();
        if (validator.isEmpty(encounterId)) {
          encounterId = "";
        }
      } else {
        encounterId = "";
      }
			//author Device
      if (typeof req.body.author.Device !== 'undefined') {
        var authorDeviceId = req.body.author.Device.trim().toLowerCase();
        if (validator.isEmpty(authorDeviceId)) {
          authorDeviceId = "";
        }
      } else {
        authorDeviceId = "";
      }
			//author Organization
      if (typeof req.body.author.Organization !== 'undefined') {
        var authorOrganizationId = req.body.author.Organization.trim().toLowerCase();
        if (validator.isEmpty(authorOrganizationId)) {
          authorOrganizationId = "";
        }
      } else {
        authorOrganizationId = "";
      }
			//author Patient
      if (typeof req.body.author.Patient !== 'undefined') {
        var authorPatientId = req.body.author.Patient.trim().toLowerCase();
        if (validator.isEmpty(authorPatientId)) {
          authorPatientId = "";
        }
      } else {
        authorPatientId = "";
      }
			//author Practitioner
      if (typeof req.body.author.Practitioner !== 'undefined') {
        var authorPractitionerId = req.body.author.Practitioner.trim().toLowerCase();
        if (validator.isEmpty(authorPractitionerId)) {
          authorPractitionerId = "";
        }
      } else {
        authorPractitionerId = "";
      }
			
      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
            checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function (resUseCode) {
              if (resUseCode.err_code > 0) { //code > 0 => data valid
                checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function (resUseTypeCode) {
                  if (resUseTypeCode.err_code > 0) { //code > 0 => data valid
                    checkCode(apikey, statusCode, 'FLAG_STATUS', function (resStatusCode) {
                      if (resStatusCode.err_code > 0) { //code > 0 => data valid*/
                        checkCode(apikey, codeCode, 'FLAG_CODE', function (resCodeCode) {
                          if (resCodeCode.err_code > 0) { //code > 0 => data valid
                            checkUniqeValue(apikey, "PATIENT_ID|" + subPatientId, 'PATIENT', function (resSubPatientId) {
                              if (resSubPatientId.err_code > 0) { //code > 0 => data valid
                                checkUniqeValue(apikey, "LOCATION_ID|" + subLocationId, 'LOCATION', function (resSubLocationId) {
                                  if (resSubLocationId.err_code > 0) { //code > 0 => data valid
																		/*checkUniqeValue(apikey, "GROUP_ID|" + subGroupId, 'GROUP', function (resSubGroupId) {
																			if (resSubGroupId.err_code > 0) { //code > 0 => data valid*/
																				checkUniqeValue(apikey, "ORGANIZATION_ID|" + subOrganizationId, 'ORGANIZATION', function (resSubOrganizationId) {
																					if (resSubOrganizationId.err_code > 0) { //code > 0 => data valid
																						checkUniqeValue(apikey, "PRACTITIONER_ID|" + subPractitionerId, 'PRACTITIONER', function (resSubPractitionerId) {
																							if (resSubPractitionerId.err_code > 0) { //code > 0 => data valid
																								/*checkUniqeValue(apikey, "PLAN_DEFINITION_ID|" + subPlanDefinitionId, 'PLAN_DEFINITION', function (resSubPlanDefinitionId) {
																									if (resSubPlanDefinitionId.err_code > 0) { //code > 0 => data valid
																										checkUniqeValue(apikey, "MEDICATION_ID|" + subMedicationId, 'MEDICATION', function (resSubMedicationId) {
																											if (resSubMedicationId.err_code > 0) { //code > 0 => data valid
																												checkUniqeValue(apikey, "PROCEDURE_ID|" + subProcedureId, 'PROCEDURE', function (resSubProcedureId) {
																													if (resSubProcedureId.err_code > 0) { //code > 0 => data valid*/
																														myEmitter.once('checkIdentifierValue', function () {
																															checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resUniqeValue) {
																																if (resUniqeValue.err_code == 0) { //code = 0 => data bisa dipakai
																																	//set uniqe id
																																	var identifierId = 'ide' + uniqid.time();
																																	var flagId = 'fla' + uniqid.time();

																																	//identifier
																																	dataIdentifier = {
																																		"id": identifierId,
																																		"use": identifierUseCode,
																																		"type": identifierTypeCode,
																																		"system": identifierId,
																																		"value": identifierValue,
																																		"period_start": identifierPeriodStart,
																																		"period_end": identifierPeriodEnd,
																																		"flag_id": flagId
																																	}

																																	ApiFHIR.post('identifier', {
																																		"apikey": apikey
																																	}, {
																																		body: dataIdentifier,
																																		json: true
																																	}, function (error, response, body) {
																																		identifier = body;
																																		console.log(identifier)
																																		if (identifier.err_code > 0) {
																																			res.json(identifier);
																																		}
																																	})
																																	//data flag
																																	dataFlag = {
																																		"flag_id": flagId,
																																		"flag_status": statusCode,
																																		"flag_category": categoryCode,
																																		"flag_code": codeCode,
																																		"subject_patient_id": subPatientId,
																																		"subject_location_id": subLocationId,
																																		"subject_group_id": subGroupId,
																																		"subject_organization_id": subOrganizationId,
																																		"subject_practitioner_id": subPractitionerId,
																																		"subject_plan_definition_id": subPlanDefinitionId,
																																		"subject_medication_id": subMedicationId,
																																		"subject_procedure_id": subProcedureId,
																																		"flag_period_start": flagPeriodStart,
																																		"flag_period_end": flagPeriodEnd,
																																		"encounter_id": encounterId,
																																		"author_device_id": authorDeviceId,
																																		"author_organization_id": authorOrganizationId,
																																		"author_patient_id": authorPatientId,
																																		"author_practitioner_id": authorPractitionerId
																																	}
																																	
																																	ApiFHIR.post('flag', {
																																		"apikey": apikey
																																	}, {
																																		body: dataFlag,
																																		json: true
																																	}, function (error, response, body) {
																																		var flag = body;
																																		if (flag.err_code > 0) {
																																			res.json(flag);
																																		}
																																	})
																																	console.log(dataFlag);
																																	res.json({
																																		"err_code": 0,
																																		"err_msg": "Flag has been add.",
																																		"data": [{
																																				"id": flagId
																																			}
																																		]
																																	})
																																} else {
																																	res.json({
																																		"err_code": "517",
																																		"err_msg": "Identifier value already exist."
																																	});
																																}
																															})
																														})
																														//authorPractitionerId
																														myEmitter.prependOnceListener('checkAuthorPractitioner', function () {
																															if (!validator.isEmpty(authorPractitionerId)) {
																																checkUniqeValue(apikey, "PRACTITIONER_ID|" + authorPractitionerId, 'PRACTITIONER', function (resAuthorPractitionerId) {
																																	if (resAuthorPractitionerId.err_code > 0) {
																																		myEmitter.emit('checkIdentifierValue');
																																	} else {
																																		res.json({
																																			"err_code": "516",
																																			"err_msg": "Author Practitioner Id not found"
																																		});
																																	}
																																})
																															} else {
																																myEmitter.emit('checkIdentifierValue');
																															}
																														})
																														//authorPatientId
																														myEmitter.prependOnceListener('checkAuthorPatient', function () {
																															if (!validator.isEmpty(authorPatientId)) {
																																checkUniqeValue(apikey, "PATIENT_ID|" + authorPatientId, 'PATIENT', function (resAuthorPatientId) {
																																	if (resAuthorPatientId.err_code > 0) {
																																		myEmitter.emit('checkAuthorPractitioner');
																																	} else {
																																		res.json({
																																			"err_code": "515",
																																			"err_msg": "Author Patient Id not found"
																																		});
																																	}
																																})
																															} else {
																																myEmitter.emit('checkAuthorPractitioner');
																															}
																														})
																														//authorOrganizationId
																														myEmitter.prependOnceListener('checkAuthorOrg', function () {
																															if (!validator.isEmpty(authorOrganizationId)) {
																																checkUniqeValue(apikey, "ORGANIZATION_ID|" + authorOrganizationId, 'ORGANIZATION', function (resAuthorOrganizationId) {
																																	if (resAuthorOrganizationId.err_code > 0) {
																																		myEmitter.emit('checkAuthorPatient');
																																	} else {
																																		res.json({
																																			"err_code": "514",
																																			"err_msg": "Author Organization Id not found"
																																		});
																																	}
																																})
																															} else {
																																myEmitter.emit('checkAuthorPatient');
																															}
																														})
																														//authorDeviceId
																														myEmitter.prependOnceListener('checkAuthorDevice', function () {
																															if (!validator.isEmpty(authorDeviceId)) {
																																checkUniqeValue(apikey, "DEVICE_ID|" + authorDeviceId, 'DEVICE', function (resAuthorDeviceId) {
																																	if (resAuthorDeviceId.err_code > 0) {
																																		myEmitter.emit('checkAuthorOrg');
																																	} else {
																																		res.json({
																																			"err_code": "513",
																																			"err_msg": "Author Device Id not found"
																																		});
																																	}
																																})
																															} else {
																																myEmitter.emit('checkAuthorOrg');
																															}
																														})
																														//encounterId
																														myEmitter.prependOnceListener('checkEncounter', function () {
																															if (!validator.isEmpty(encounterId)) {
																																checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterId) {
																																	if (resEncounterId.err_code > 0) {
																																		myEmitter.emit('checkAuthorDevice');
																																	} else {
																																		res.json({
																																			"err_code": "512",
																																			"err_msg": "Encounter id not found"
																																		});
																																	}
																																})
																															} else {
																																myEmitter.emit('checkAuthorDevice');
																															}
																														})
																														//categoryCode
																														if (!validator.isEmpty(categoryCode)) {
																															checkCode(apikey, categoryCode, 'FLAG_CATEGORY', function (resCategoryCode) {
																																if (resCategoryCode.err_code > 0) {
																																	myEmitter.emit('checkEncounter');
																																} else {
																																	res.json({
																																		"err_code": "512",
																																		"err_msg": "Category Code not found"
																																	});
																																}
																															})
																														} else {
																															myEmitter.emit('checkEncounter');
																														}
																													/*} else {
																														res.json({
																															"err_code": "511",
																															"err_msg": "Subject Procedure id not found"
																														});
																													}
																												})
																											} else {
																												res.json({
																													"err_code": "511",
																													"err_msg": "Subject Medication id not found"
																												});
																											}
																										})
																									} else {
																										res.json({
																											"err_code": "510",
																											"err_msg": "Subject PlanDefinition id not found"
																										});
																									}
																								})*/
																							} else {
																								res.json({
																									"err_code": "509",
																									"err_msg": "Subject Practitioner id not found"
																								});
																							}
																						})
																					} else {
																						res.json({
																							"err_code": "508",
																							"err_msg": "Subject Organization id not found"
																						});
																					}
																				})
																			/*} else {
																				res.json({
																					"err_code": "507",
																					"err_msg": "Subject Group id not found"
																				});
																			}
																		})*/
																	} else {
                                    res.json({
                                      "err_code": "506",
                                      "err_msg": "Subject Loaction id not found"
                                    });
                                  }
                                })
                              } else {
                                res.json({
                                  "err_code": "505",
                                  "err_msg": "Subjet Patient id not found"
                                });
                              }
                            })
                          } else {
                            res.json({
                              "err_code": "504",
                              "err_msg": "Flag Code not found"
                            });
                          }
                        })
                      } else {
                        res.json({
                          "err_code": "503",
                          "err_msg": "Flag status code not found"
                        });
                      }
                    })
                  } else {
                    res.json({
                      "err_code": "502",
                      "err_msg": "Identifier type code not found"
                    });
                  }
                })
              } else {
                res.json({
                  "err_code": "501",
                  "err_msg": "Identifier use code not found"
                });
              }
            })
          } else {
            result.err_code = "500";
            res.json(result);
          }
        });
      } else {
        res.json({
          "err_code": err_code,
          "err_msg": err_msg
        });
      }
    },
    identifier: function addIdentifier(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var flagId = req.params.flag_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof flagId !== 'undefined') {
        if (validator.isEmpty(flagId)) {
          err_code = 2;
          err_msg = "Flag id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Flag id is required";
      }
      //identifier
      if (typeof req.body.use !== 'undefined') {
        var identifierUseCode = req.body.use.trim().toLowerCase();
        if (validator.isEmpty(identifierUseCode)) {
          err_code = 2;
          err_msg = "Identifier Use is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'use' in json request.";
      }
      //type code
      if (typeof req.body.type !== 'undefined') {
        var identifierTypeCode = req.body.type.trim().toUpperCase();
        if (validator.isEmpty(identifierTypeCode)) {
          err_code = 2;
          err_msg = "Identifier Type is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'type' in json request.";
      }
      //identifier uniqe value
      if (typeof req.body.value !== 'undefined') {
        var identifierValue = req.body.value.trim();
        if (validator.isEmpty(identifierValue)) {
          err_code = 2;
          err_msg = "Identifier Value is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'value' in json request.";
      }
      //identifier period start
      if (typeof req.body.period !== 'undefined') {
        var period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrPeriod = period.split("to");
          identifierPeriodStart = arrPeriod[0];
          identifierPeriodEnd = arrPeriod[1];

          if (!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)) {
            err_code = 2;
            err_msg = "Identifier Period invalid date format.";
          }
        } else {
          err_code = 1;
          err_msg = "Identifier Period format is wrong, `ex: start to end` ";
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'period' in json identifier request.";
      }

      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
            checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function (resUseCode) {
              if (resUseCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function (resUseTypeCode) {
                  if (resUseTypeCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                    checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resUniqeValue) {
                      if (resUniqeValue.err_code == 0) {
                        checkUniqeValue(apikey, "FLAG_ID|" + flagId, 'FLAG', function (resFlagId) {
                          if (resFlagId.err_code > 0) {
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
                              "flag_id": flagId
                            }

                            ApiFHIR.post('identifier', {
                              "apikey": apikey
                            }, {
                              body: dataIdentifier,
                              json: true
                            }, function (error, response, body) {
                              identifier = body;
                              if (identifier.err_code == 0) {
                                res.json({
                                  "err_code": 0,
                                  "err_msg": "Identifier has been add in this flag.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
                              }
                            })
                          } else {
                            res.json({
                              "err_code": 505,
                              "err_msg": "Flag Id not found"
                            });
                          }
                        })
                      } else {
                        res.json({
                          "err_code": 504,
                          "err_msg": "Identifier value already exist."
                        });
                      }
                    })

                  } else {
                    res.json({
                      "err_code": 502,
                      "err_msg": "Identifier type code not found"
                    });
                  }
                })
              } else {
                res.json({
                  "err_code": 501,
                  "err_msg": "Identifier use code not found"
                });
              }
            })
          } else {
            result.err_code = 500;
            res.json(result);
          }
        });
      } else {
        res.json({
          "err_code": err_code,
          "err_msg": err_msg
        });
      }
    }
  },
  put: {
    flag: function updateFlag(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var flagId = req.params.flag_id;

      var err_code = 0;
      var err_msg = "";
      var dataFlag = {};

      if (typeof flagId !== 'undefined') {
        if (validator.isEmpty(flagId)) {
          err_code = 2;
          err_msg = "Flag Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Flag Id is required.";
      }
			//status
      if (typeof req.body.status !== 'undefined') {
        var statusCode = req.body.status.trim().toLowerCase();
        if (validator.isEmpty(statusCode)) {
          statusCode = "";
        }
				dataFlag.flag_status = statusCode;
      } else {
        statusCode = "";
      }
			//category
      if (typeof req.body.category !== 'undefined') {
        var categoryCode = req.body.category.trim().toLowerCase();
        if (validator.isEmpty(categoryCode)) {
          categoryCode = "";
        }
				dataFlag.flag_category = categoryCode;
      } else {
        categoryCode = "";
      }
      //name
      if (typeof req.body.code !== 'undefined' && req.body.code !== "") {
        var codeCode = req.body.code.trim().toLowerCase();
        if (!validator.isInt(codeCode)) {
          err_code = 2;
          err_msg = "Code must be int";
        } else {
					dataFlag.flag_code = codeCode;
				}
      } else {
       codeCode = "";
      }    
			//subject patient
      if (typeof req.body.subject !== 'undefined') {
				if (typeof req.body.subject.Patient !== 'undefined') {
					var subPatientId = req.body.subject.Patient.trim().toLowerCase();
					if (validator.isEmpty(subPatientId)) {
						subPatientId = "";
					}
					dataFlag.subject_patient_id = subPatientId;
				} else {
					subPatientId = "";
				}
				//subject Location
				if (typeof req.body.subject.Location !== 'undefined') {
					var subLocationId = req.body.subject.Location.trim().toLowerCase();
					if (validator.isEmpty(subLocationId)) {
						subLocationId = "";
					}
					dataFlag.subject_location_id = subLocationId;
				} else {
					subLocationId = "";
				}
				//subject Group
				if (typeof req.body.subject.Group !== 'undefined') {
					var subGroupId = req.body.subject.Group.trim().toLowerCase();
					if (validator.isEmpty(subGroupId)) {
						subGroupId = "";
					}
					dataFlag.subject_group_id = subGroupId;
				} else {
					subGroupId = "";
				}
				//subject Organization
				if (typeof req.body.subject.Organization !== 'undefined') {
					var subOrganizationId = req.body.subject.Organization.trim().toLowerCase();
					if (validator.isEmpty(subOrganizationId)) {
						subOrganizationId = "";
					}
					dataFlag.subject_organization_id = subOrganizationId;
				} else {
					subOrganizationId = "";
				}
				//subject Practitioner
				if (typeof req.body.subject.Practitioner !== 'undefined') {
					var subPractitionerId = req.body.subject.Practitioner.trim().toLowerCase();
					if (validator.isEmpty(subPractitionerId)) {
						subPractitionerId = "";
					}
					dataFlag.subject_practitioner_id = subPractitionerId;
				} else {
					subPractitionerId = "";
				}
				//subject PlanDefinition
				if (typeof req.body.subject.PlanDefinition !== 'undefined') {
					var subPlanDefinitionId = req.body.subject.PlanDefinition.trim().toLowerCase();
					if (validator.isEmpty(subPlanDefinitionId)) {
						subPlanDefinitionId = "";
					}
					dataFlag.subject_plan_definition_id = subPlanDefinitionId;
				} else {
					subPlanDefinitionId = "";
				}
				//subject Medication
				if (typeof req.body.subject.Medication !== 'undefined') {
					var subMedicationId = req.body.subject.Medication.trim().toLowerCase();
					if (validator.isEmpty(subMedicationId)) {
						subMedicationId = "";
					}
					dataFlag.subject_medication_id = subMedicationId;
				} else {
					subMedicationId = "";
				}
				//subject Procedure
				if (typeof req.body.subject.Procedure !== 'undefined') {
					var subProcedureId = req.body.subject.Procedure.trim().toLowerCase();
					if (validator.isEmpty(subProcedureId)) {
						subProcedureId = "";
					}
					dataFlag.subject_procedure_id = subProcedureId;
				} else {
					subProcedureId = "";
				}
			} else {
				subPatientId = "";
				subLocationId = "";
				subGroupId = "";
				subOrganizationId = "";
				subPractitionerId = "";
				subPlanDefinitionId = "";
				subMedicationId = "";
				subProcedureId = "";
			}
      //period
      if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var flagPeriod = req.body.period;
        if (flagPeriod.indexOf("to") > 0) {
          arrFlagPeriod = flagPeriod.split("to");
          flagPeriodStart = arrFlagPeriod[0];
          flagPeriodEnd = arrFlagPeriod[1];
          if (!regex.test(flagPeriodStart) && !regex.test(flagPeriodEnd)) {
            err_code = 2;
            err_msg = "Flag Period invalid date format.";
          } else {
						dataFlag.flag_period_start = flagPeriodStart;
						dataFlag.flag_period_end = flagPeriodEnd;
					}
        }
      } else {
        flagPeriodStart = "";
        flagPeriodEnd = "";
      }
			//encounter
      if (typeof req.body.encounter !== 'undefined') {
        var encounterId = req.body.encounter.trim().toLowerCase();
        if (validator.isEmpty(encounterId)) {
          encounterId = "";
        }
				dataFlag.encounter_id = encounterId;
      } else {
        encounterId = "";
      }
			//author Device
      if (typeof req.body.author !== 'undefined') {
				if (typeof req.body.author.Device !== 'undefined') {
					var authorDeviceId = req.body.author.Device.trim().toLowerCase();
					if (validator.isEmpty(authorDeviceId)) {
						authorDeviceId = "";
					}
					dataFlag.author_device_id = authorDeviceId;
				} else {
					authorDeviceId = "";
				}
				//author Organization
				if (typeof req.body.author.Organization !== 'undefined') {
					var authorOrganizationId = req.body.author.Organization.trim().toLowerCase();
					if (validator.isEmpty(authorOrganizationId)) {
						authorOrganizationId = "";
					}
					dataFlag.author_organization_id = authorOrganizationId;
				} else {
					authorOrganizationId = "";
				}
				//author Patient
				if (typeof req.body.author.Patient !== 'undefined') {
					var authorPatientId = req.body.author.Patient.trim().toLowerCase();
					if (validator.isEmpty(authorPatientId)) {
						authorPatientId = "";
					}
					dataFlag.author_patient_id = authorPatientId;
				} else {
					authorPatientId = "";
				}
				//author Practitioner
				if (typeof req.body.author.Practitioner !== 'undefined') {
					var authorPractitionerId = req.body.author.Practitioner.trim().toLowerCase();
					if (validator.isEmpty(authorPractitionerId)) {
						authorPractitionerId = "";
					}
					dataFlag.author_practitioner_id = authorPractitionerId;
				} else {
					authorPractitionerId = "";
				}
			} else {
				authorDeviceId = "";
				authorOrganizationId = "";
				authorPatientId = "";
				authorPractitionerId = "";
			}
			
      if (err_code == 0) {
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "FLAG_ID|" + flagId, 'FLAG', function (resFlagId) {
								if (resFlagId.err_code > 0) {
									ApiFHIR.put('flag', {
										"apikey": apikey,
										"_id": flagId
									}, {
										body: dataFlag,
										json: true
									}, function (error, response, body) {
										var flag = body;
										if (flag.err_code > 0) {
											res.json(flag);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "Flag has been updated.",
												"data": flag.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 506,
										"err_msg": "Flag Id not found"
									});
								}
							})
						})
						//authorPractitionerId
						myEmitter.prependOnceListener('checkAuthorPractitioner', function () {
							if (!validator.isEmpty(authorPractitionerId)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + authorPractitionerId, 'PRACTITIONER', function (resAuthorPractitionerId) {
									if (resAuthorPractitionerId.err_code > 0) {
										myEmitter.emit('checkId');
									} else {
										res.json({
											"err_code": "516",
											"err_msg": "Author Practitioner Id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkId');
							}
						})
						//authorPatientId
						myEmitter.prependOnceListener('checkAuthorPatient', function () {
							if (!validator.isEmpty(authorPatientId)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + authorPatientId, 'PATIENT', function (resAuthorPatientId) {
									if (resAuthorPatientId.err_code > 0) {
										myEmitter.emit('checkAuthorPractitioner');
									} else {
										res.json({
											"err_code": "515",
											"err_msg": "Author Patient Id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAuthorPractitioner');
							}
						})
						//authorOrganizationId
						myEmitter.prependOnceListener('checkAuthorOrg', function () {
							if (!validator.isEmpty(authorOrganizationId)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + authorOrganizationId, 'ORGANIZATION', function (resAuthorOrganizationId) {
									if (resAuthorOrganizationId.err_code > 0) {
										myEmitter.emit('checkAuthorPatient');
									} else {
										res.json({
											"err_code": "514",
											"err_msg": "Author Organization Id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAuthorPatient');
							}
						})
						//authorDeviceId
						myEmitter.prependOnceListener('checkAuthorDevice', function () {
							if (!validator.isEmpty(authorDeviceId)) {
								checkUniqeValue(apikey, "DEVICE_ID|" + authorDeviceId, 'DEVICE', function (resAuthorDeviceId) {
									if (resAuthorDeviceId.err_code > 0) {
										myEmitter.emit('checkAuthorOrg');
									} else {
										res.json({
											"err_code": "513",
											"err_msg": "Author Device Id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAuthorOrg');
							}
						})
						//encounterId
						myEmitter.prependOnceListener('checkEncounter', function () {
							if (!validator.isEmpty(encounterId)) {
								checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterId) {
									if (resEncounterId.err_code > 0) {
										myEmitter.emit('checkAuthorDevice');
									} else {
										res.json({
											"err_code": "512",
											"err_msg": "Encounter id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAuthorDevice');
							}
						})
						//Subject Procedure
						myEmitter.prependOnceListener('checkProcedure', function () {
							if (!validator.isEmpty(subProcedureId)) {
								checkUniqeValue(apikey, "PROCEDURE_ID|" + subProcedureId, 'PROCEDURE', function (resSubProcedureId) {
									if (resSubProcedureId.err_code > 0) {
										myEmitter.emit('checkEncounter');
									} else {
										res.json({
											"err_code": "511",
											"err_msg": "Epiosde of care id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkEncounter');
							}
						})
						//Subject Medication
						myEmitter.prependOnceListener('checkSubjMedication', function () {
							if (!validator.isEmpty(subMedicationId)) {
								checkUniqeValue(apikey, "MEDICATION_ID|" + subMedicationId, 'MEDICATION', function (resSubMedicationId) {
									if (resSubMedicationId.err_code > 0) {
										myEmitter.emit('checkProcedure');
									} else {
										res.json({
											"err_code": "510",
											"err_msg": "Subject Medication id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkProcedure');
							}
						})
						//Subject PlanDefinition
						myEmitter.prependOnceListener('checkSubjPlanDefinition', function () {
							if (!validator.isEmpty(subPlanDefinitionId)) {
								checkUniqeValue(apikey, "PLAN_DEFINITION_ID|" + subPlanDefinitionId, 'PLAN_DEFINITION', function (resSubPlanDefinitionId) {
									if (resSubPlanDefinitionId.err_code > 0) {
										myEmitter.emit('checkSubjMedication');
									} else {
										res.json({
											"err_code": "509",
											"err_msg": "Subject PlanDefinition id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjMedication');
							}
						})
						//Subject Practitioner
						myEmitter.prependOnceListener('checkSubjPractitioner', function () {
							if (!validator.isEmpty(subPractitionerId)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + subPractitionerId, 'PRACTITIONER', function (resSubPractitionerId) {
									if (resSubPractitionerId.err_code > 0) {
										myEmitter.emit('checkSubjPlanDefinition');
									} else {
										res.json({
											"err_code": "508",
											"err_msg": "Subject Practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjPlanDefinition');
							}
						})
						//Subject Organization
						myEmitter.prependOnceListener('checkSubjOrganization', function () {
							if (!validator.isEmpty(subOrganizationId)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + subOrganizationId, 'ORGANIZATION', function (resSubOrganizationId) {
									if (resSubOrganizationId.err_code > 0) {
										myEmitter.emit('checkSubjPractitioner');
									} else {
										res.json({
											"err_code": "507",
											"err_msg": "Subject Organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjPractitioner');
							}
						})
						//Subject Group
						myEmitter.prependOnceListener('checkSubjGroup', function () {
							if (!validator.isEmpty(subGroupId)) {
								checkUniqeValue(apikey, "GROUP_ID|" + subGroupId, 'GROUP', function (resSubGroupId) {
									if (resSubGroupId.err_code > 0) {
										myEmitter.emit('checkSubjOrganization');
									} else {
										res.json({
											"err_code": "506",
											"err_msg": "Subject Group id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjOrganization');
							}
						})
						//Subject Location
						myEmitter.prependOnceListener('checkSubjLocation', function () {
							if (!validator.isEmpty(subLocationId)) {
								checkUniqeValue(apikey, "LOCATION_ID|" + subLocationId, 'LOCATION', function (resSubLocationId) {
									if (resSubLocationId.err_code > 0) {
										myEmitter.emit('checkSubjGroup');
									} else {
										res.json({
											"err_code": "505",
											"err_msg": "Subject Location id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjGroup');
							}
						})
						//Subject Patient
						myEmitter.prependOnceListener('checkSubjPatient', function () {
							if (!validator.isEmpty(subPatientId)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + subPatientId, 'PATIENT', function (resSubPatientId) {
									if (resSubPatientId.err_code > 0) {
										myEmitter.emit('checkSubjLocation');
									} else {
										res.json({
											"err_code": "504",
											"err_msg": "Subject Patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjLocation');
							}
						})
						//codeCode
						myEmitter.prependOnceListener('checkCodeCode', function () {
							if (!validator.isEmpty(codeCode)) {
								checkCode(apikey, codeCode, 'FLAG_CODE', function (resCodeCode) {
									if (resCodeCode.err_code > 0) {
										myEmitter.emit('checkSubjPatient');
									} else {
										res.json({
											"err_code": "503",
											"err_msg": "Code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjPatient');
							}
						})
						//categoryCode
						myEmitter.prependOnceListener('checkCategory', function () {
							if (!validator.isEmpty(categoryCode)) {
								checkCode(apikey, categoryCode, 'FLAG_CATEGORY', function (resCategoryCode) {
									if (resCategoryCode.err_code > 0) {
										myEmitter.emit('checkCodeCode');
									} else {
										res.json({
											"err_code": "502",
											"err_msg": "Category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCodeCode');
							}
						})
						//statusCode
						if (!validator.isEmpty(statusCode)) {
							checkCode(apikey, statusCode, 'FLAG_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) {
									myEmitter.emit('checkCategory');
								} else {
									res.json({
										"err_code": "501",
										"err_msg": "Status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCategory');
						}
          } else {
            result.err_code = "500";
            res.json(result);
          }
        });
      } else {
        res.json({
          "err_code": err_code,
          "err_msg": err_msg
        });
      }
    },
    identifier: function updateIdentifier(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var flagId = req.params.flag_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof flagId !== 'undefined') {
        if (validator.isEmpty(flagId)) {
          err_code = 2;
          err_msg = "Flag id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Flag id is required";
      }
      if (typeof identifierId !== 'undefined') {
        if (validator.isEmpty(identifierId)) {
          err_code = 2;
          err_msg = "Identifier id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Identifier id is required";
      }
      //identifier
      if (typeof req.body.use !== 'undefined') {
        var identifierUseCode = req.body.use.trim().toLowerCase();
        if (validator.isEmpty(identifierUseCode)) {
          err_code = 2;
          err_msg = "Identifier Use is empty";
        } else {
          dataIdentifier.use = identifierUseCode;
        }
      } else {
        identifierUseCode = "";
      }
      //type code
      if (typeof req.body.type !== 'undefined') {
        var identifierTypeCode = req.body.type.trim().toUpperCase();
        if (validator.isEmpty(identifierTypeCode)) {
          err_code = 2;
          err_msg = "Identifier Type is empty";
        } else {
          dataIdentifier.type = identifierTypeCode;
        }
      } else {
        identifierTypeCode = "";
      }
      //identifier uniqe value
      if (typeof req.body.value !== 'undefined') {
        var identifierValue = req.body.value.trim();
        if (validator.isEmpty(identifierValue)) {
          err_code = 2;
          err_msg = "Identifier Value is empty";
        } else {
          dataIdentifier.value = identifierValue;
          dataIdentifier.system = identifierId;
        }
      } else {
        identifierValue = "";
      }
      //identifier period start
      if (typeof req.body.period !== 'undefined') {
        var period = req.body.period;
        if (period.indexOf("to") > 0) {
          arrPeriod = period.split("to");
          identifierPeriodStart = arrPeriod[0];
          identifierPeriodEnd = arrPeriod[1];

          if (!regex.test(identifierPeriodStart) && !regex.test(identifierPeriodEnd)) {
            err_code = 2;
            err_msg = "Identifier Period invalid date format.";
          } else {
            dataIdentifier.period_start = identifierPeriodStart;
            dataIdentifier.period_end = identifierPeriodEnd;
          }
        } else {
          err_code = 1;
          err_msg = "Period request format is wrong, `ex: start to end` ";
        }
      } else {
        identifierPeriodStart = "";
        identifierPeriodEnd = "";
      }

      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
            myEmitter.prependOnceListener('checkFlagId', function () {
              checkUniqeValue(apikey, "FLAG_ID|" + flagId, 'FLAG', function (resFlagId) {
                if (resFlagId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "FLAG_ID|" + flagId
                      }, {
                        body: dataIdentifier,
                        json: true
                      }, function (error, response, body) {
                        var identifier = body;
                        if (identifier.err_code > 0) {
                          res.json(identifier);
                        } else {
                          res.json({
                            "err_code": 0,
                            "err_msg": "Identifier has been update in this flag.",
                            "data": identifier.data
                          });
                        }
                      })
                    } else {
                      res.json({
                        "err_code": 505,
                        "err_msg": "Identifier Id not found"
                      });
                    }
                  })
                } else {
                  res.json({
                    "err_code": 504,
                    "err_msg": "Flag Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkFlagId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkFlagId');
                  } else {
                    res.json({
                      "err_code": 503,
                      "err_msg": "Identifier value already exist."
                    });
                  }
                })
              }
            })
            myEmitter.prependOnceListener('checkIdentifierType', function () {
              if (validator.isEmpty(identifierTypeCode)) {
                myEmitter.emit('checkIdentifierValue');
              } else {
                checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function (resUseTypeCode) {
                  if (resUseTypeCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                    myEmitter.emit('checkIdentifierValue');
                  } else {
                    res.json({
                      "err_code": 502,
                      "err_msg": "Identifier type code not found"
                    });
                  }
                })
              }
            })
            if (validator.isEmpty(identifierUseCode)) {
              myEmitter.emit('checkIdentifierType');
            } else {
              checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function (resUseCode) {
                if (resUseCode.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                  myEmitter.emit('checkIdentifierType');
                } else {
                  res.json({
                    "err_code": 501,
                    "err_msg": "Identifier use code not found"
                  });
                }
              })
            }
          } else {
            result.err_code = 500;
            res.json(result);
          }
        });
      } else {
        res.json({
          "err_code": err_code,
          "err_msg": err_msg
        });
      }
    }
  }
}

function checkApikey(apikey, ipAddress, callback) {
  //method, endpoint, params, options, callback
  Api.get('check_apikey', {
    "apikey": apikey
  }, {}, function (error, response, body) {
    if (error) {
      x(error);
    } else {
      user = JSON.parse(body);
      //cek apakah ada error atau tidak
      if (user.err_code == 0) {
        //cek jumdata dulu
        if (user.data.length > 0) {
          //check user_role_id == 1 <-- admin/root
          if (user.data[0].user_role_id == 1) {
            x({
              "err_code": 0,
              "status": "root",
              "user_role_id": user.data[0].user_role_id,
              "user_id": user.data[0].user_id
            });
          } else {
            //cek apikey
            if (apikey == user.data[0].user_apikey) {
              //ipaddress
              dataIpAddress = user.data[0].user_ip_address;
              if (dataIpAddress.indexOf(ipAddress) >= 0) {
                //user is active
                if (user.data[0].user_is_active) {
                  //cek data user terpenuhi
                  x({
                    "err_code": 0,
                    "status": "active",
                    "user_role_id": user.data[0].user_role_id,
                    "user_id": user.data[0].user_id
                  });
                } else {
                  x({
                    "err_code": 5,
                    "err_msg": "User is not active"
                  });
                }
              } else {
                x({
                  "err_code": 4,
                  "err_msg": "Ip Address not registered"
                });
              }
            } else {
              x({
                "err_code": 3,
                "err_msg": "Wrong apikey"
              });
            }
          }

        } else {
          x({
            "err_code": 2,
            "err_msg": "Wrong apikey"
          });
        }
      } else {
        x({
          "err_code": 1,
          "err_msg": user.error,
          "application": "Api User Management",
          "function": "checkApikey"
        });
      }
    }
  });

  function x(result) {
    callback(result)
  }
}

function checkId(apikey, tableId, tableName, callback) {
  ApiFHIR.get('checkId', {
    "apikey": apikey,
    "id": tableId,
    "name": tableName
  }, {}, function (error, response, body) {
    if (error) {
      x(error);
    } else {
      dataId = JSON.parse(body);
      //cek apakah ada error atau tidak
      if (dataId.err_code == 0) {
        //cek jumdata dulu
        if (dataId.data.length > 0) {
          x({
            "err_code": 0,
            "err_msg": "Id is valid."
          })
        } else {
          x({
            "err_code": 2,
            "err_msg": "Id is not found."
          });
        }
      } else {
        x({
          "err_code": 1,
          "err_msg": dataId.error,
          "application": "API FHIR",
          "function": "checkId"
        });
      }
    }
  });

  function x(result) {
    callback(result)
  }
}

function checkCode(apikey, code, tableName, callback) {
  ApiFHIR.get('checkCode', {
    "apikey": apikey,
    "code": code,
    "name": tableName
  }, {}, function (error, response, body) {
    if (error) {
      x(error);
    } else {
      dataId = JSON.parse(body);
      //cek apakah ada error atau tidak
      if (dataId.err_code == 0) {
        //cek jumdata dulu
        if (dataId.data.length > 0) {
          x({
            "err_code": 2,
            "err_msg": "Code is already exist."
          })
        } else {
          x({
            "err_code": 0,
            "err_msg": "Code is available to used."
          });
        }
      } else {
        x({
          "err_code": 1,
          "err_msg": dataId.error,
          "application": "API FHIR",
          "function": "checkCode"
        });
      }
    }
  });

  function x(result) {
    callback(result)
  }
}

function checkUniqeValue(apikey, fdValue, tableName, callback) {
  ApiFHIR.get('checkUniqeValue', {
    "apikey": apikey,
    "fdvalue": fdValue,
    "tbname": tableName
  }, {}, function (error, response, body) {
    if (error) {
      x(error);
    } else {
      dataId = JSON.parse(body);
      //cek apakah ada error atau tidak
      if (dataId.err_code == 0) {
        //cek jumdata dulu
        if (dataId.data.length > 0) {
          x({
            "err_code": 2,
            "err_msg": "The value is already exist."
          })
        } else {
          x({
            "err_code": 0,
            "err_msg": "The value is available to insert."
          });
        }
      } else {
        x({
          "err_code": 1,
          "err_msg": dataId.error,
          "application": "API FHIR",
          "function": "checkCode"
        });
      }
    }
  });

  function x(result) {
    callback(result)
  }
}

function checkGroupQouta(apikey, groupId, callback) {
  ApiFHIR.get('checkGroupQouta', {
    "apikey": apikey,
    "group_id": groupId
  }, {}, function (error, response, body) {
    if (error) {
      x(error);
    } else {
      quota = JSON.parse(body);
      //cek apakah ada error atau tidak
      if (quota.err_code == 0) {
        //cek jumdata dulu
        if (quota.data.length > 0) {
          groupQuota = parseInt(quota.data[0].quantity);
          memberCount = parseInt(quota.data[0].total_member);

          if (memberCount <= groupQuota) {
            x({
              "err_code": 0,
              "err_msg": "Group quota is ready"
            });
          } else {
            x({
              "err_code": 1,
              "err_msg": "Group quota is full, total member " + groupQuota
            });
          }
        } else {
          x({
            "err_code": 0,
            "err_msg": "Group quota is ready"
          });
        }
      } else {
        x({
          "err_code": 1,
          "err_msg": quota,
          "application": "API FHIR",
          "function": "checkGroupQouta"
        });
      }
    }
  });

  function x(result) {
    callback(result)
  }
}

function checkMemberEntityGroup(apikey, entityId, groupId, callback) {
  ApiFHIR.get('checkMemberEntityGroup', {
    "apikey": apikey,
    "entity_id": entityId,
    "group_id": groupId
  }, {}, function (error, response, body) {
    if (error) {
      x(error);
    } else {
      entity = JSON.parse(body);
      //cek apakah ada error atau tidak
      if (entity.err_code == 0) {
        if (parseInt(entity.data.length) > 0) {
          x({
            "err_code": 2,
            "err_msg": "Member entity already exist in this group."
          });
        } else {
          x({
            "err_code": 0,
            "err_msg": "Member not found in this group."
          });
        }
      } else {
        x({
          "err_code": 1,
          "err_msg": entity,
          "application": "API FHIR",
          "function": "checkMemberEntityGroup"
        });
      }
    }
  });

  function x(result) {
    callback(result)
  }
}

function getFormattedDate() {
  var date = new Date();
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  return str;
}

function formatDate(date) {
  var d = new Date(date),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

module.exports = controller;