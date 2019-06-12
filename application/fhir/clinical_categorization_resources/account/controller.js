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
    account: function getAccount(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var accountId = req.query._id;
			var balance = req.query.balance;
			var identifier = req.query.identifier;
			var name = req.query.name;
			var owner = req.query.owner; //_organization_id;
			var patient = req.query.patient;
			var period = req.query.period;
			var status = req.query.status;
			var subject = req.query.subject;
			var type = req.query.type;
			var offset = req.query.offset;
			var limit = req.query.limit;


      var qString = {};

      if (typeof accountId !== 'undefined') {
        if (!validator.isEmpty(accountId)) {
          qString._id = accountId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Account Id is required."
          })
        }
      }
      if (typeof balance !== 'undefined') {
        if (!validator.isEmpty(balance)) {
          qString.balance = balance;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Balance is empty."
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
			if (typeof name !== 'undefined') {
        if (!validator.isEmpty(name)) {
          qString.name = name;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Name is empty."
          });
        }
      }
			if (typeof owner !== 'undefined') {
        if (!validator.isEmpty(owner)) {
          qString.owner = owner;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Owner is empty."
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
      if (typeof period !== 'undefined') {
        if (!validator.isEmpty(period)) {
          if (!regex.test(period)) {
            res.json({
              "err_code": 1,
              "err_msg": "Date invalid format."
            });
          } else {
            qString.date = period;
          }
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Date is empty."
          });
        }
      }
      if (typeof status !== 'undefined') {
        if (!validator.isEmpty(status)) {
          qString.status = status;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Status is empty."
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
      if (typeof type !== 'undefined') {
        if (!validator.isEmpty(type)) {
          qString.type = type;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Type is empty."
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
        "Account": {
          "location": "%(apikey)s/Account",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);

      checkApikey(apikey, ipAddres, function (result) {
        if (result.err_code == 0) {
          ApiFHIR.get('Account', {
            "apikey": apikey
          }, {}, function (error, response, body) {
            if (error) {
              res.json(error);
            } else {
              var account = JSON.parse(body); //object
              //cek apakah ada error atau tidak
              if (account.err_code == 0) {
                if (account.data.length > 0) {
                  newAccount = [];
                  for (i = 0; i < account.data.length; i++) {
                    myEmitter.prependOnceListener("getIdentifier", function (account, index, newAccount, countAccount) {
                      //get identifier
                      qString = {};
                      qString.account_id = account.id;
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
                          var objectAccount = {};
                          objectAccount.resourceType = account.resourceType;
                          objectAccount.id = account.id;
                          objectAccount.identifier = identifier.data;
                          objectAccount.status = account.status;
                          objectAccount.type = account.type;
                          objectAccount.name = account.name;
                          objectAccount.subject = account.subject;
                          objectAccount.period = account.period;
                          objectAccount.active = account.active;
                          objectAccount.balance = account.balance;
                          objectAccount.owner = account.owner;
                          objectAccount.description = account.description;

                          newAccount[index] = objectAccount

                            myEmitter.prependOnceListener("getCoverage", function (account, index, newAccount, countAccount) {
                              qString = {};
                              qString.account_id = account.id;
                              seedPhoenixFHIR.path.GET = {
                                "accountCoverage": {
                                  "location": "%(apikey)s/accountCoverage",
                                  "query": qString
                                }
                              }
                              var ApiFHIR = new Apiclient(seedPhoenixFHIR);
                              ApiFHIR.get('accountCoverage', {
                                "apikey": apikey
                              }, {}, function (error, response, body) {
                                var accountCoverage = JSON.parse(body);
                                if (accountCoverage.err_code == 0) {
                                  var objectAccount = {};
																	objectAccount.resourceType = account.resourceType;
																	objectAccount.id = account.id;
																	objectAccount.identifier = identifier.data;
																	objectAccount.status = account.status;
																	objectAccount.type = account.type;
																	objectAccount.name = account.name;
																	objectAccount.subject = account.subject;
																	objectAccount.period = account.period;
																	objectAccount.active = account.active;
																	objectAccount.coverage = accountCoverage.data;
																	objectAccount.balance = account.balance;
																	objectAccount.owner = account.owner;
																	objectAccount.description = account.description;

																	newAccount[index] = objectAccount

                                    myEmitter.prependOnceListener("getGuarantor", function (account, index, newAccount, countAccount) {
                                      qString = {};
                                      qString.account_id = account.id;
                                      seedPhoenixFHIR.path.GET = {
                                        "accountGuarantor": {
                                          "location": "%(apikey)s/accountGuarantor",
                                          "query": qString
                                        }
                                      }
                                      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
                                      ApiFHIR.get('accountGuarantor', {
                                        "apikey": apikey
                                      }, {}, function (error, response, body) {
                                        var accountGuarantor = JSON.parse(body);
                                        if (accountGuarantor.err_code == 0) {
                                          var objectAccount = {};
																					objectAccount.resourceType = account.resourceType;
																					objectAccount.id = account.id;
																					objectAccount.identifier = identifier.data;
																					objectAccount.status = account.status;
																					objectAccount.type = account.type;
																					objectAccount.name = account.name;
																					objectAccount.subject = account.subject;
																					objectAccount.period = account.period;
																					objectAccount.active = account.active;
																					objectAccount.coverage = accountCoverage.data;
																					objectAccount.balance = account.balance;
																					objectAccount.owner = account.owner;
																					objectAccount.description = account.description;
																					objectAccount.guarantor = accountGuarantor.data;

																					newAccount[index] = objectAccount

																					if (index == countAccount - 1) {
																						res.json({
																							"err_code": 0,
																							"data": newAccount
																						});
																					}
                                        } else {
                                          res.json(accountGuarantor);
                                        }
                                      })
                                    })
                                    myEmitter.emit('getGuarantor', objectAccount, index, newAccount, countAccount);
                                } else {
                                  res.json(accountCoverage);
                                }
                              })
                            })
                            myEmitter.emit('getCoverage', objectAccount, index, newAccount, countAccount);
                        } else {
                          res.json(identifier);
                        }
                      })
                    })
                    myEmitter.emit("getIdentifier", account.data[i], i, newAccount, account.data.length);
                  }
                } else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Account is empty."
                  });
                }
              } else {
                res.json(account);
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
    account: function addAccount(req, res) {
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
          statusCode = "";
        }
      } else {
        statusCode = "";
      }
			//type
      if (typeof req.body.type !== 'undefined') {
        var typeCode = req.body.type.trim().toLowerCase();
        if (validator.isEmpty(typeCode)) {
          typeCode = "";
        }
      } else {
        typeCode = "";
      }
      //name
      if (typeof req.body.name !== 'undefined') {
        var name = req.body.name;
        if (validator.isEmpty(name)) {
          name = "";
        }
      } else {
        name = "";
      }    
			//subject patient
      if (typeof req.body.subject.Patient !== 'undefined') {
        var subPatientId = req.body.subject.Patient.trim().toLowerCase();
        if (validator.isEmpty(subPatientId)) {
          subPatientId = "";
        }
      } else {
        subPatientId = "";
      }
			//subject Device
      if (typeof req.body.subject.Device !== 'undefined') {
        var subDeviceId = req.body.subject.Device.trim().toLowerCase();
        if (validator.isEmpty(subDeviceId)) {
          subDeviceId = "";
        }
      } else {
        subDeviceId = "";
      }
			//subject Practitioner
      if (typeof req.body.subject.Practitioner !== 'undefined') {
        var subPractitionerId = req.body.subject.Practitioner.trim().toLowerCase();
        if (validator.isEmpty(subPractitionerId)) {
          subPractitionerId = "";
        }
      } else {
        subPractitionerId = "";
      }
			//subject Location
      if (typeof req.body.subject.Location !== 'undefined') {
        var subLocationId = req.body.subject.Location.trim().toLowerCase();
        if (validator.isEmpty(subLocationId)) {
          subLocationId = "";
        }
      } else {
        subLocationId = "";
      }
			//subject HealthcareService
      if (typeof req.body.subject.HealthcareService !== 'undefined') {
        var subHealthcareServiceId = req.body.subject.HealthcareService.trim().toLowerCase();
        if (validator.isEmpty(subHealthcareServiceId)) {
          subHealthcareServiceId = "";
        }
      } else {
        subHealthcareServiceId = "";
      }
			//subject Organization
      if (typeof req.body.subject.Organization !== 'undefined') {
        var subOrganizationId = req.body.subject.Organization.trim().toLowerCase();
        if (validator.isEmpty(subOrganizationId)) {
          subOrganizationId = "";
        }
      } else {
        subOrganizationId = "";
      }
      //period
      if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var accountPeriod = req.body.period;
        if (accountPeriod.indexOf("to") > 0) {
          arrAccountPeriod = accountPeriod.split("to");
          accountPeriodStart = arrAccountPeriod[0];
          accountPeriodEnd = arrAccountPeriod[1];
          if (!regex.test(accountPeriodStart) && !regex.test(accountPeriodEnd)) {
            err_code = 2;
            err_msg = "account Period invalid date format.";
          }
        }
      } else {
        accountPeriodStart = "";
        accountPeriodEnd = "";
      }
			//active
      if (typeof req.body.active !== 'undefined' && req.body.active !== "") {
        var activePeriod = req.body.active;
        if (activePeriod.indexOf("to") > 0) {
          arrActivePeriod = activePeriod.split("to");
          activePeriodStart = arrActivePeriod[0];
          activePeriodEnd = arrActivePeriod[1];
          if (!regex.test(activePeriodStart) && !regex.test(activePeriodEnd)) {
            err_code = 2;
            err_msg = "account Period invalid date format.";
          }
        }
      } else {
        activePeriodStart = "";
        activePeriodEnd = "";
      }
      //balance
      if (typeof req.body.balance !== 'undefined') {
        var accountBalance = req.body.balance.trim();
        if (validator.isEmpty(accountBalance)) {
          accountBalance = "";
        }
      } else {
        accountBalance = "";
      }
      //coverage coverage
      if (typeof req.body.coverage.coverage !== 'undefined') {
        var coverageId = req.body.coverage.coverage.trim().toLowerCase();
        if (validator.isEmpty(coverageId)) {
          err_code = 2;
          err_msg = "Coverage id is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'role code' in json identifier request.";
      }
      //coverage priority
      if (typeof req.body.coverage.priority !== 'undefined' && req.body.coverage.priority !== "") {
        var coveragePriority = req.body.coverage.priority.trim().toLowerCase();
        if (!validator.isInt(coveragePriority)) {
          err_code = 2;
          err_msg = "coverage priority is must be number.";
        }
      } else {
        coveragePriority = "";
      }
      //owner
      if (typeof req.body.owner !== 'undefined') {
        var ownerId = req.body.owner.trim().toLowerCase();
        if (validator.isEmpty(ownerId)) {
          ownerId = "";
        }
      } else {
        ownerId = "";
      }
      //description
      if (typeof req.body.description !== 'undefined') {
        var accountDescription = req.body.description;
        if (validator.isEmpty(accountDescription)) {
          accountDescription = "";
        }
      } else {
        accountDescription = "";
      }
      //guarantor party patient
      if (typeof req.body.guarantor.party.Patient !== 'undefined') {
        var partyPatientId = req.body.guarantor.party.Patient.trim().toLowerCase();
        if (validator.isEmpty(partyPatientId)) {
          err_code = 2;
          err_msg = "Party Patient Id is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add 'Party Patient Id' in json request.";
      }
			//guarantor party RelatedPerson
      if (typeof req.body.guarantor.party.RelatedPerson !== 'undefined') {
        var partyRelatedPersonId = req.body.guarantor.party.RelatedPerson.trim().toLowerCase();
        if (validator.isEmpty(partyRelatedPersonId)) {
          err_code = 2;
          err_msg = "Party related person Id is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add 'Related Person Id' in json request.";
      }
			//guarantor party Organization
      if (typeof req.body.guarantor.party.Organization !== 'undefined') {
        var partyOrganizationId = req.body.guarantor.party.Organization.trim().toLowerCase();
        if (validator.isEmpty(partyOrganizationId)) {
          err_code = 2;
          err_msg = "Party Organization Id is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add 'Organization Id' in json request.";
      }
			//guarantor onHold
      if (typeof req.body.guarantor.onHold !== 'undefined' && req.body.guarantor.onHold !== "") {
        var guarantorOnHoldz = req.body.guarantor.onHold.trim().toLowerCase();
        //if(typeof(guarantorOnHold) !== typeof(true) || typeof(guarantorOnHold) !== typeof(false)){
        if(guarantorOnHoldz === "true" || guarantorOnHoldz === "false"){
					guarantorOnHold = guarantorOnHoldz
				} else {
          err_code = 2;
          err_msg = "guarantor onHold is must be boolean.";
        }
      } else {
        guarantorOnHold = "";
      }
			//guarantor period
			if (typeof req.body.guarantor.period !== 'undefined' && req.body.guarantor.period !== "") {
        var guarantorPeriod = req.body.guarantor.period;
        if (guarantorPeriod.indexOf("to") > 0) {
          arrGuarantorPeriod = guarantorPeriod.split("to");
          guarantorPeriodStart = arrGuarantorPeriod[0];
          guarantorPeriodEnd = arrGuarantorPeriod[1];
          if (!regex.test(guarantorPeriodStart) && !regex.test(guarantorPeriodEnd)) {
            err_code = 2;
            err_msg = "account Period invalid date format.";
          }
        }
      } else {
        guarantorPeriodStart = "";
        guarantorPeriodEnd = "";
      }
			//episode of care
      if (typeof req.body.episodeOfCare !== 'undefined') {
        var episodeOfCareId = req.body.episodeOfCare.trim().toLowerCase();
        if (validator.isEmpty(episodeOfCareId)) {
          episodeOfCareId = "";
        }
      } else {
        episodeOfCareId = "";
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
			
      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
            checkCode(apikey, identifierUseCode, 'IDENTIFIER_USE', function (resUseCode) {
              if (resUseCode.err_code > 0) { //code > 0 => data valid
                checkCode(apikey, identifierTypeCode, 'IDENTIFIER_TYPE', function (resUseTypeCode) {
                  if (resUseTypeCode.err_code > 0) { //code > 0 => data valid
                    /*checkUniqeValue(apikey, "COVERAGE_ID|" + coverageId, 'COVERAGE', function (resCoverageId) {
                      if (resCoverageId.err_code > 0) { //code > 0 => data valid*/
                        checkUniqeValue(apikey, "PATIENT_ID|" + partyPatientId, 'PATIENT', function (resPartyPatientId) {
                          if (resPartyPatientId.err_code > 0) { //code > 0 => data valid
                            checkUniqeValue(apikey, "RELATED_PERSON_ID|" + partyRelatedPersonId, 'RELATED_PERSON', function (resPartyRelatedPersonId) {
                              if (resPartyRelatedPersonId.err_code > 0) { //code > 0 => data valid
                                checkUniqeValue(apikey, "ORGANIZATION_ID|" + partyOrganizationId, 'ORGANIZATION', function (resPartyOrganizationId) {
                                  if (resPartyOrganizationId.err_code > 0) { //code > 0 => data valid
																		myEmitter.once('checkIdentifierValue', function () {
																			checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resUniqeValue) {
																				if (resUniqeValue.err_code == 0) { //code = 0 => data bisa dipakai
																					//set uniqe id
																					var identifierId = 'ide' + uniqid.time();
																					var accountId = 'acc' + uniqid.time();
																					var accCoverageId = 'cov' + uniqid.time();
																					var guarantorId = 'gua' + uniqid.time();

																					//identifier
																					dataIdentifier = {
																						"id": identifierId,
																						"use": identifierUseCode,
																						"type": identifierTypeCode,
																						"system": identifierId,
																						"value": identifierValue,
																						"period_start": identifierPeriodStart,
																						"period_end": identifierPeriodEnd,
																						"account_id": accountId
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
																					//data account
																					dataAccount = {
																						"account_id": accountId,
																						"account_status": statusCode,
																						"account_type": typeCode,
																						"account_name": name,
																						"subject_patient_id": subPatientId,
																						"subject_device_id": subDeviceId,
																						"subject_practitioner_id": subPractitionerId,
																						"subject_location_id": subLocationId,
																						"subject_healthcare_service_id": subHealthcareServiceId,
																						"subject_organization_id": subOrganizationId,
																						"account_period_start": accountPeriodStart,
																						"account_period_end": accountPeriodEnd,
																						"account_active_start": activePeriodStart,
																						"account_active_end": activePeriodEnd,
																						"account_balance": accountBalance,
																						"owner_organization_id": ownerId,
																						"account_description": accountDescription,
																						"episode_of_care_id": episodeOfCareId,
																						"encounter_id": encounterId
																					}
																					ApiFHIR.post('account', {
																						"apikey": apikey
																					}, {
																						body: dataAccount,
																						json: true
																					}, function (error, response, body) {
																						var account = body;
																						if (account.err_code > 0) {
																							res.json(account);
																						}
																					})
																					//data coverage
																					dataCoverage = {
																						"account_coverage_id": accCoverageId,
																						"coverage_id": coverageId,
																						"account_coverage_priority": coveragePriority,
																						"account_id": accountId
																					}
																					ApiFHIR.post('accountCoverage', {
																						"apikey": apikey
																					}, {
																						body: dataCoverage,
																						json: true
																					}, function (error, response, body) {
																						var coverage = body;
																						if (coverage.err_code > 0) {
																							res.json(coverage);
																						}
																					})
																					//data guarantor
																					dataGuarantor = {
																						"account_guarantor_id": guarantorId,
																						"party_patient_id": partyPatientId,
																						"party_related_person_id": partyRelatedPersonId,
																						"party_organization_id": partyOrganizationId,
																						"account_guarantor_on_hold": guarantorOnHold,
																						"account_guarantor_period_start": guarantorPeriodStart,
																						"account_guarantor_period_end": guarantorPeriodEnd,
																						"account_id": accountId
																					}
																					ApiFHIR.post('accountGuarantor', {
																						"apikey": apikey
																					}, {
																						body: dataGuarantor,
																						json: true
																					}, function (error, response, body) {
																						var guarantor = body;
																						if (guarantor.err_code > 0) {
																							res.json(guarantor);
																						}
																					})
																					res.json({
																						"err_code": 0,
																						"err_msg": "Account has been add.",
																						"data": [{
																								"id": accountId
																							}
																						]
																					})
																				} else {
																					res.json({
																						"err_code": "514",
																						"err_msg": "Identifier value already exist."
																					});
																				}
																			})
																		})
																		//Encounter
																		myEmitter.prependOnceListener('checkEncounter', function () {
																			if (!validator.isEmpty(encounterId)) {
																				checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterId) {
																					if (resEncounterId.err_code > 0) {
																						myEmitter.emit('checkIdentifierValue');
																					} else {
																						res.json({
																							"err_code": "516",
																							"err_msg": "Encounter id not found"
																						});
																					}
																				})
																			} else {
																				myEmitter.emit('checkIdentifierValue');
																			}
																		})
																		//Epiosde of care
																		myEmitter.prependOnceListener('checkEpisodeOfCare', function () {
																			if (!validator.isEmpty(episodeOfCareId)) {
																				checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + episodeOfCareId, 'EPISODE_OF_CARE', function (resEpisodeOfCareId) {
																					if (resEpisodeOfCareId.err_code > 0) {
																						myEmitter.emit('checkEncounter');
																					} else {
																						res.json({
																							"err_code": "515",
																							"err_msg": "Epiosde of care id not found"
																						});
																					}
																				})
																			} else {
																				myEmitter.emit('checkEncounter');
																			}
																		})
																		//Subject Owner
																		myEmitter.prependOnceListener('checkOwner', function () {
																			if (!validator.isEmpty(ownerId)) {
																				checkUniqeValue(apikey, "ORGANIZATION_ID|" + ownerId, 'ORGANIZATION', function (resOwnerId) {
																					if (resOwnerId.err_code > 0) {
																						myEmitter.emit('checkEpisodeOfCare');
																					} else {
																						res.json({
																							"err_code": "514",
																							"err_msg": "Owner id not found"
																						});
																					}
																				})
																			} else {
																				myEmitter.emit('checkEpisodeOfCare');
																			}
																		})
																		//Subject Organization
																		myEmitter.prependOnceListener('checkSubjOrganization', function () {
																			if (!validator.isEmpty(subOrganizationId)) {
																				checkUniqeValue(apikey, "ORGANIZATION_ID|" + subOrganizationId, 'ORGANIZATION', function (resSubOrganizationId) {
																					if (resSubOrganizationId.err_code > 0) {
																						myEmitter.emit('checkOwner');
																					} else {
																						res.json({
																							"err_code": "513",
																							"err_msg": "Subject Organization id not found"
																						});
																					}
																				})
																			} else {
																				myEmitter.emit('checkOwner');
																			}
																		})
																		//Subject HealthcareService
																		myEmitter.prependOnceListener('checkSubjHealthcareService', function () {
																			if (!validator.isEmpty(subHealthcareServiceId)) {
																				checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + subHealthcareServiceId, 'HEALTHCARE_SERVICE', function (resSubHealthcareServiceId) {
																					if (resSubHealthcareServiceId.err_code > 0) {
																						myEmitter.emit('checkSubjOrganization');
																					} else {
																						res.json({
																							"err_code": "512",
																							"err_msg": "Subject HealthcareService id not found"
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
																						myEmitter.emit('checkSubjHealthcareService');
																					} else {
																						res.json({
																							"err_code": "511",
																							"err_msg": "Subject Location id not found"
																						});
																					}
																				})
																			} else {
																				myEmitter.emit('checkSubjHealthcareService');
																			}
																		})
																		//Subject Practitioner
																		myEmitter.prependOnceListener('checkSubjPractitioner', function () {
																			if (!validator.isEmpty(subPractitionerId)) {
																				checkUniqeValue(apikey, "PRACTITIONER_ID|" + subPractitionerId, 'PRACTITIONER', function (resSubPractitionerId) {
																					if (resSubPractitionerId.err_code > 0) {
																						myEmitter.emit('checkSubjLocation');
																					} else {
																						res.json({
																							"err_code": "510",
																							"err_msg": "Subject Practitioner id not found"
																						});
																					}
																				})
																			} else {
																				myEmitter.emit('checkSubjLocation');
																			}
																		})
																		//Subject Device
																		myEmitter.prependOnceListener('checkSubjDevice', function () {
																			if (!validator.isEmpty(subDeviceId)) {
																				checkUniqeValue(apikey, "DEVICE_ID|" + subDeviceId, 'DEVICE', function (resSubDeviceId) {
																					if (resSubDeviceId.err_code > 0) {
																						myEmitter.emit('checkSubjPractitioner');
																					} else {
																						res.json({
																							"err_code": "509",
																							"err_msg": "Subject Device id not found"
																						});
																					}
																				})
																			} else {
																				myEmitter.emit('checkSubjPractitioner');
																			}
																		})
																		//Subject Patient
																		myEmitter.prependOnceListener('checkSubjPatient', function () {
																			if (!validator.isEmpty(subPatientId)) {
																				checkUniqeValue(apikey, "PATIENT_ID|" + subPatientId, 'PATIENT', function (resSubPatientId) {
																					if (resSubPatientId.err_code > 0) {
																						myEmitter.emit('checkSubjDevice');
																					} else {
																						res.json({
																							"err_code": "508",
																							"err_msg": "Subject Patient id not found"
																						});
																					}
																				})
																			} else {
																				myEmitter.emit('checkSubjDevice');
																			}
																		})
																		//typeCode
																		myEmitter.prependOnceListener('checkType', function () {
																			if (!validator.isEmpty(typeCode)) {
																				checkCode(apikey, typeCode, 'ACCOUNT_TYPE', function (resTypeCode) {
																					if (resTypeCode.err_code > 0) {
																						myEmitter.emit('checkSubjPatient');
																					} else {
																						res.json({
																							"err_code": "508",
																							"err_msg": "Type code not found"
																						});
																					}
																				})
																			} else {
																				myEmitter.emit('checkSubjPatient');
																			}
																		})
																		//statusCode
																		if (!validator.isEmpty(statusCode)) {
																			checkCode(apikey, statusCode, 'ACCOUNT_STATUS', function (resStatusCode) {
																				if (resStatusCode.err_code > 0) {
																					myEmitter.emit('checkType');
																				} else {
																					res.json({
																						"err_code": "507",
																						"err_msg": "Status code not found"
																					});
																				}
																			})
																		} else {
																			myEmitter.emit('checkType');
																		}
                                  } else {
                                    res.json({
                                      "err_code": "506",
                                      "err_msg": "Party Organization id not found"
                                    });
                                  }
                                })
                              } else {
                                res.json({
                                  "err_code": "505",
                                  "err_msg": "Party RelatedPerson id not found"
                                });
                              }
                            })
                          } else {
                            res.json({
                              "err_code": "504",
                              "err_msg": "Party Patient id not found"
                            });
                          }
                        })
                      /*} else {
                        res.json({
                          "err_code": "503",
                          "err_msg": "Coverage Id not found"
                        });
                      }
                    })*/
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
      var accountId = req.params.account_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof accountId !== 'undefined') {
        if (validator.isEmpty(accountId)) {
          err_code = 2;
          err_msg = "Account id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Account id is required";
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
                        checkUniqeValue(apikey, "ACCOUNT_ID|" + accountId, 'ACCOUNT', function (resAccountId) {
                          if (resAccountId.err_code > 0) {
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
                              "account_id": accountId
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
                                  "err_msg": "Identifier has been add in this account.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
                              }
                            })
                          } else {
                            res.json({
                              "err_code": 505,
                              "err_msg": "Account Id not found"
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
    },
    guarantor: function addGuarantor(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var accountId = req.params.account_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof accountId !== 'undefined') {
        if (validator.isEmpty(accountId)) {
          err_code = 2;
          err_msg = "Account id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Account id is required";
      }
			//guarantor party patient
      if (typeof req.body.party.Patient !== 'undefined') {
        var partyPatientId = req.body.party.Patient.trim().toLowerCase();
        if (validator.isEmpty(partyPatientId)) {
          err_code = 2;
          err_msg = "Party Patient Id is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add 'Party Patient Id' in json request.";
      }
			//guarantor party RelatedPerson
      if (typeof req.body.party.RelatedPerson !== 'undefined') {
        var partyRelatedPersonId = req.body.party.RelatedPerson.trim().toLowerCase();
        if (validator.isEmpty(partyRelatedPersonId)) {
          err_code = 2;
          err_msg = "Party related person Id is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add 'Related Person Id' in json request.";
      }
			//guarantor party Organization
      if (typeof req.body.party.Organization !== 'undefined') {
        var partyOrganizationId = req.body.party.Organization.trim().toLowerCase();
        if (validator.isEmpty(partyOrganizationId)) {
          err_code = 2;
          err_msg = "Party Organization Id is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add 'Organization Id' in json request.";
      }
			//guarantor onHold
      if (typeof req.body.onHold !== 'undefined' && req.body.onHold !== "") {
        var guarantorOnHoldz = req.body.onHold.trim().toLowerCase();
        if(guarantorOnHoldz === "true" || guarantorOnHoldz === "false"){
          guarantorOnHold = guarantorOnHoldz
				} else {
          err_code = 2;
          err_msg = "guarantor onHold is must be boolean.";
        }
      } else {
        guarantorOnHold = "";
      }
			//guarantor period
			if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var guarantorPeriod = req.body.period;
        if (guarantorPeriod.indexOf("to") > 0) {
          arrGuarantorPeriod = guarantorPeriod.split("to");
          guarantorPeriodStart = arrGuarantorPeriod[0];
          guarantorPeriodEnd = arrGuarantorPeriod[1];
          if (!regex.test(guarantorPeriodStart) && !regex.test(guarantorPeriodEnd)) {
            err_code = 2;
            err_msg = "account Period invalid date format.";
          }
        }
      } else {
        guarantorPeriodStart = "";
        guarantorPeriodEnd = "";
      }

      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
            checkUniqeValue(apikey, "PATIENT_ID|" + partyPatientId, 'PATIENT', function (resPartyPatientId) {
							if (resPartyPatientId.err_code > 0) { //code > 0 => data valid
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + partyRelatedPersonId, 'RELATED_PERSON', function (resPartyRelatedPersonId) {
									if (resPartyRelatedPersonId.err_code > 0) { //code > 0 => data valid
										checkUniqeValue(apikey, "ORGANIZATION_ID|" + partyOrganizationId, 'ORGANIZATION', function (resPartyOrganizationId) {
											if (resPartyOrganizationId.err_code > 0) {  //code harus lebih besar dari nol, ini menunjukan datanya valid
												checkUniqeValue(apikey, "ACCOUNT_ID|" + accountId, 'ACCOUNT', function (resAccountId) {
													if (resAccountId.err_code > 0) {

														var guarantorId = 'gua' + uniqid.time();
														
														//data guarantor
														dataGuarantor = {
															"account_guarantor_id": guarantorId,
															"party_patient_id": partyPatientId,
															"party_related_person_id": partyRelatedPersonId,
															"party_organization_id": partyOrganizationId,
															"account_guarantor_on_hold": guarantorOnHold,
															"account_guarantor_period_start": guarantorPeriodStart,
															"account_guarantor_period_end": guarantorPeriodEnd,
															"account_id": accountId
														}
														ApiFHIR.post('accountGuarantor', {
															"apikey": apikey
														}, {
															body: dataGuarantor,
															json: true
														}, function (error, response, body) {
															var guarantor = body;
															if (guarantor.err_code == 0) {
																res.json({
																	"err_code": 0,
																	"err_msg": "Guarantor has been add in this account.",
																	"data": guarantor.data
																});
															} else {
																res.json(guarantor);
															}
														})
													} else {
														res.json({
															"err_code": 504,
															"err_msg": "Account Id not found"
														});
													}
												})
											} else {
												res.json({
													"err_code": 503,
													"err_msg": "Party Organization id not found"
												});
											}
										})
									} else {
										res.json({
											"err_code": 502,
											"err_msg": "Party RelatedPerson id not found"
										});
									}
								})
							} else {
								res.json({
									"err_code": 501,
									"err_msg": "Party Patient id not found"
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
    },
    coverage: function addCoverage(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      //var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var accountId = req.params.account_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof accountId !== 'undefined') {
        if (validator.isEmpty(accountId)) {
          err_code = 2;
          err_msg = "Account id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Account id is required";
      }
			//coverage coverage
      if (typeof req.body.coverage !== 'undefined') {
        var coverageId = req.body.coverage.trim().toLowerCase();
        if (validator.isEmpty(coverageId)) {
          err_code = 2;
          err_msg = "Coverage id is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'role code' in json identifier request.";
      }
      //coverage priority
      if (typeof req.body.priority !== 'undefined' && req.body.priority !== "") {
        var coveragePriority = req.body.priority.trim().toLowerCase();
        if (!validator.isInt(coveragePriority)) {
          err_code = 2;
          err_msg = "coverage priority is must be number.";
        }
      } else {
        coveragePriority = "";
      }

      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
            /*checkUniqeValue(apikey, "COVERAGE_ID|" + coverageId, 'COVERAGE', function (resCoverageId) {
              if (resCoverageId.err_code > 0) { //code > 0 => data valid*/
                checkUniqeValue(apikey, "ACCOUNT_ID|" + accountId, 'ACCOUNT', function (resAccountId) {
                  if (resAccountId.err_code > 0) {

                    var accCoverageId = 'cov' + uniqid.time();
										//data coverage
										dataCoverage = {
											"account_coverage_id": accCoverageId,
											"coverage_id": coverageId,
											"account_coverage_priority": coveragePriority,
											"account_id": accountId
										}
										ApiFHIR.post('accountCoverage', {
											"apikey": apikey
										}, {
											body: dataCoverage,
											json: true
										}, function (error, response, body) {
											var coverage = body;
											if (coverage.err_code == 0) {
                        res.json({
                          "err_code": 0,
                          "err_msg": "coverage has been add in this account.",
                          "data": coverage.data
                        });
                      } else {
                        res.json(coverage);
                      }
										})
                  } else {
                    res.json({
                      "err_code": 502,
                      "err_msg": "Account Id not found"
                    });
                  }
                })
              /*} else {
                res.json({
                  "err_code": 501,
                  "err_msg": "Coverage id not found"
                });
              }
            })*/
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
    account: function updateAccount(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var accountId = req.params.account_id;

      var err_code = 0;
      var err_msg = "";
      var dataAccount = {};

      if (typeof accountId !== 'undefined') {
        if (validator.isEmpty(accountId)) {
          err_code = 2;
          err_msg = "Account Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Account Id is required.";
      }
			//status
      if (typeof req.body.status !== 'undefined') {
        var statusCode = req.body.status.trim().toLowerCase();
        if (validator.isEmpty(statusCode)) {
          statusCode = "";
        }
			  dataAccount.account_status = statusCode;
      } else {
        statusCode = "";
      }
			//type
      if (typeof req.body.type !== 'undefined') {
        var typeCode = req.body.type.trim().toLowerCase();
        if (validator.isEmpty(typeCode)) {
          typeCode = "";
        }
				dataAccount.account_type = typeCode;
      } else {
        typeCode = "";
      }
      //name
      if (typeof req.body.name !== 'undefined') {
        var name = req.body.name;
        if (validator.isEmpty(name)) {
          name = "";
        }
				dataAccount.account_name = name;
      } else {
        name = "";
      }
			//subject patient
      if (typeof req.body.subject !== 'undefined') {
				if (typeof req.body.subject.Patient !== 'undefined') {
					var subPatientId = req.body.subject.Patient.trim().toLowerCase();
					if (validator.isEmpty(subPatientId)) {
						subPatientId = "";
					}
					dataAccount.subject_patient_id = subPatientId;
				} else {
					subPatientId = "";
				}
				//subject Device
				if (typeof req.body.subject.Device !== 'undefined') {
					var subDeviceId = req.body.subject.Device.trim().toLowerCase();
					if (validator.isEmpty(subDeviceId)) {
						subDeviceId = "";
					}
					dataAccount.subject_device_id = subDeviceId;
				} else {
					subDeviceId = "";
				}
				//subject Practitioner
				if (typeof req.body.subject.Practitioner !== 'undefined') {
					var subPractitionerId = req.body.subject.Practitioner.trim().toLowerCase();
					if (validator.isEmpty(subPractitionerId)) {
						subPractitionerId = "";
					}
					dataAccount.subject_practitioner_id = subPractitionerId;
				} else {
					subPractitionerId = "";
				}
				//subject Location
				if (typeof req.body.subject.Location !== 'undefined') {
					var subLocationId = req.body.subject.Location.trim().toLowerCase();
					if (validator.isEmpty(subLocationId)) {
						subLocationId = "";
					}
					dataAccount.subject_location_id = subLocationId;
				} else {
					subLocationId = "";
				}
				//subject HealthcareService
				if (typeof req.body.subject.HealthcareService !== 'undefined') {
					var subHealthcareServiceId = req.body.subject.HealthcareService.trim().toLowerCase();
					if (validator.isEmpty(subHealthcareServiceId)) {
						subHealthcareServiceId = "";
					}
					dataAccount.subject_healthcare_service_id = subHealthcareServiceId;
				} else {
					subHealthcareServiceId = "";
				}
				//subject Organization
				if (typeof req.body.subject.Organization !== 'undefined') {
					var subOrganizationId = req.body.subject.Organization.trim().toLowerCase();
					if (validator.isEmpty(subOrganizationId)) {
						subOrganizationId = "";
					}
					dataAccount.subject_organization_id = subOrganizationId;
				} else {
					subOrganizationId = "";
				}
			} else {
				subPatientId = "";
				subDeviceId = "";
				subPractitionerId = "";
				subLocationId = "";
				subHealthcareServiceId = "";
				subOrganizationId = "";
			}
			//period
      if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var accountPeriod = req.body.period;
        if (accountPeriod.indexOf("to") > 0) {
          arrAccountPeriod = accountPeriod.split("to");
          accountPeriodStart = arrAccountPeriod[0];
          accountPeriodEnd = arrAccountPeriod[1];
          if (!regex.test(accountPeriodStart) && !regex.test(accountPeriodEnd)) {
            err_code = 2;
            err_msg = "account Period invalid date format.";
          } else {
						dataAccount.account_period_start = accountPeriodStart;
						dataAccount.account_period_end = accountPeriodEnd;
					}
        }
      } else {
        accountPeriodStart = "";
        accountPeriodEnd = "";
      }
			//active
      if (typeof req.body.active !== 'undefined' && req.body.active !== "") {
        var activePeriod = req.body.active;
        if (activePeriod.indexOf("to") > 0) {
          arrActivePeriod = activePeriod.split("to");
          activePeriodStart = arrActivePeriod[0];
          activePeriodEnd = arrActivePeriod[1];
          if (!regex.test(activePeriodStart) && !regex.test(activePeriodEnd)) {
            err_code = 2;
            err_msg = "account Period invalid date format.";
          } else {
						dataAccount.account_active_start = activePeriodStart;
						dataAccount.account_active_end = activePeriodEnd;
					}
        }
      } else {
        activePeriodStart = "";
        activePeriodEnd = "";
      }
      //balance
      if (typeof req.body.balance !== 'undefined') {
        var accountBalance = req.body.balance.trim();
        if (validator.isEmpty(accountBalance)) {
          accountBalance = "";
        }
				dataAccount.account_balance = accountBalance;
      } else {
        accountBalance = "";
      }
			//owner
      if (typeof req.body.owner !== 'undefined') {
        var ownerId = req.body.owner.trim().toLowerCase();
        if (validator.isEmpty(ownerId)) {
          ownerId = "";
        }
				dataAccount.owner_organization_id = ownerId;
      } else {
        ownerId = "";
      }
      //description
      if (typeof req.body.description !== 'undefined') {
        var accountDescription = req.body.description;
        if (validator.isEmpty(accountDescription)) {
          accountDescription = "";
        }
				dataAccount.account_description = accountDescription;
      } else {
        accountDescription = "";
      }
      //episode of care
      if (typeof req.body.episodeOfCare !== 'undefined') {
        var episodeOfCareId = req.body.episodeOfCare.trim().toLowerCase();
        if (validator.isEmpty(episodeOfCareId)) {
          episodeOfCareId = "";
        }
				dataAccount.episode_of_care_id = episodeOfCareId;
      } else {
        episodeOfCareId = "";
      }
			//encounter
      if (typeof req.body.encounter !== 'undefined') {
        var encounterId = req.body.encounter.trim().toLowerCase();
        if (validator.isEmpty(encounterId)) {
          encounterId = "";
        }
				dataAccount.encounter_id = encounterId;
      } else {
        encounterId = "";
      }
			
      if (err_code == 0) {
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "ACCOUNT_ID|" + accountId, 'ACCOUNT', function (resAccountId) {
								if (resAccountId.err_code > 0) {
									ApiFHIR.put('account', {
										"apikey": apikey,
										"_id": accountId
									}, {
										body: dataAccount,
										json: true
									}, function (error, response, body) {
										var account = body;
										if (account.err_code > 0) {
											res.json(account);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "Account has been updated.",
												"data": account.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 506,
										"err_msg": "Account Id not found"
									});
								}
							})
						})
						//Encounter
						myEmitter.prependOnceListener('checkEncounter', function () {
							if (!validator.isEmpty(encounterId)) {
								checkUniqeValue(apikey, "ENCOUNTER_ID|" + encounterId, 'ENCOUNTER', function (resEncounterId) {
									if (resEncounterId.err_code > 0) {
										myEmitter.emit('checkId');
									} else {
										res.json({
											"err_code": "511",
											"err_msg": "Encounter id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkId');
							}
						})
						//Epiosde of care
						myEmitter.prependOnceListener('checkEpisodeOfCare', function () {
							if (!validator.isEmpty(episodeOfCareId)) {
								checkUniqeValue(apikey, "EPISODE_OF_CARE_ID|" + episodeOfCareId, 'EPISODE_OF_CARE', function (resEpisodeOfCareId) {
									if (resEpisodeOfCareId.err_code > 0) {
										myEmitter.emit('checkEncounter');
									} else {
										res.json({
											"err_code": "510",
											"err_msg": "Epiosde of care id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkEncounter');
							}
						})
						//Subject Owner
						myEmitter.prependOnceListener('checkOwner', function () {
							if (!validator.isEmpty(ownerId)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + ownerId, 'ORGANIZATION', function (resOwnerId) {
									if (resOwnerId.err_code > 0) {
										myEmitter.emit('checkEpisodeOfCare');
									} else {
										res.json({
											"err_code": "509",
											"err_msg": "Owner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkEpisodeOfCare');
							}
						})
						//Subject Organization
						myEmitter.prependOnceListener('checkSubjOrganization', function () {
							if (!validator.isEmpty(subOrganizationId)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + subOrganizationId, 'ORGANIZATION', function (resSubOrganizationId) {
									if (resSubOrganizationId.err_code > 0) {
										myEmitter.emit('checkOwner');
									} else {
										res.json({
											"err_code": "508",
											"err_msg": "Subject Organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkOwner');
							}
						})
						//Subject HealthcareService
						myEmitter.prependOnceListener('checkSubjHealthcareService', function () {
							if (!validator.isEmpty(subHealthcareServiceId)) {
								checkUniqeValue(apikey, "HEALTHCARE_SERVICE_ID|" + subHealthcareServiceId, 'HEALTHCARE_SERVICE', function (resSubHealthcareServiceId) {
									if (resSubHealthcareServiceId.err_code > 0) {
										myEmitter.emit('checkSubjOrganization');
									} else {
										res.json({
											"err_code": "507",
											"err_msg": "Subject HealthcareService id not found"
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
										myEmitter.emit('checkSubjHealthcareService');
									} else {
										res.json({
											"err_code": "506",
											"err_msg": "Subject Location id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjHealthcareService');
							}
						})
						//Subject Practitioner
						myEmitter.prependOnceListener('checkSubjPractitioner', function () {
							if (!validator.isEmpty(subPractitionerId)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + subPractitionerId, 'PRACTITIONER', function (resSubPractitionerId) {
									if (resSubPractitionerId.err_code > 0) {
										myEmitter.emit('checkSubjLocation');
									} else {
										res.json({
											"err_code": "505",
											"err_msg": "Subject Practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjLocation');
							}
						})
						//Subject Device
						myEmitter.prependOnceListener('checkSubjDevice', function () {
							if (!validator.isEmpty(subDeviceId)) {
								checkUniqeValue(apikey, "DEVICE_ID|" + subDeviceId, 'DEVICE', function (resSubDeviceId) {
									if (resSubDeviceId.err_code > 0) {
										myEmitter.emit('checkSubjPractitioner');
									} else {
										res.json({
											"err_code": "504",
											"err_msg": "Subject Device id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjPractitioner');
							}
						})
						//Subject Patient
						myEmitter.prependOnceListener('checkSubjPatient', function () {
							if (!validator.isEmpty(subPatientId)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + subPatientId, 'PATIENT', function (resSubPatientId) {
									if (resSubPatientId.err_code > 0) {
										myEmitter.emit('checkSubjDevice');
									} else {
										res.json({
											"err_code": "503",
											"err_msg": "Subject Patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjDevice');
							}
						})
						//typeCode
						myEmitter.prependOnceListener('checkType', function () {
							if (!validator.isEmpty(typeCode)) {
								checkCode(apikey, typeCode, 'ACCOUNT_TYPE', function (resTypeCode) {
									if (resTypeCode.err_code > 0) {
										myEmitter.emit('checkSubjPatient');
									} else {
										res.json({
											"err_code": "502",
											"err_msg": "Type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubjPatient');
							}
						})
						//statusCode
						if (!validator.isEmpty(statusCode)) {
							checkCode(apikey, statusCode, 'ACCOUNT_STATUS', function (resStatusCode) {
								if (resStatusCode.err_code > 0) {
									myEmitter.emit('checkType');
								} else {
									res.json({
										"err_code": "501",
										"err_msg": "Status code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkType');
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
      var accountId = req.params.account_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof accountId !== 'undefined') {
        if (validator.isEmpty(accountId)) {
          err_code = 2;
          err_msg = "Account id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Account id is required";
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
          identifierUseCode = "";
        }
        dataIdentifier.use = identifierUseCode;
      } else {
        identifierUseCode = "";
      }
      //type code
      if (typeof req.body.type !== 'undefined') {
        var identifierTypeCode = req.body.type.trim().toUpperCase();
        if (validator.isEmpty(identifierTypeCode)) {
          identifierTypeCode = "";
        }
        dataIdentifier.type = identifierTypeCode;
      } else {
        identifierTypeCode = "";
      }
      //identifier uniqe value
      if (typeof req.body.value !== 'undefined') {
        var identifierValue = req.body.value.trim();
        if (validator.isEmpty(identifierValue)) {
          identifierValue = "";
        }
        dataIdentifier.value = identifierValue;
        dataIdentifier.system = identifierId;
      } else {
        identifierValue = "";
      }
      //identifier period start
      if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
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
            myEmitter.once('checkAccountId', function () {
              checkUniqeValue(apikey, "ACCOUNT_ID|" + accountId, 'ACCOUNT', function (resAccountId) {
                if (resAccountId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "ACCOUNT_ID|" + accountId
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
                            "err_msg": "Identifier has been update in this account.",
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
                    "err_msg": "Account Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkAccountId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkAccountId');
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
    },
    guarantor: function updateGuarantor(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var accountId = req.params.account_id;
			var guarantorId = req.params.account_guarantor_id;

      var err_code = 0;
      var err_msg = "";
      var dataGuarantor = {};
			
			if (typeof accountId !== 'undefined') {
        if (validator.isEmpty(accountId)) {
          err_code = 2;
          err_msg = "Account Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Account Id is required.";
      }
			//guarantor party patient
      if (typeof req.body.party !== 'undefined') {
				if (typeof req.body.party.Patient !== 'undefined') {
					var partyPatientId = req.body.party.Patient.trim().toLowerCase();
					if (validator.isEmpty(partyPatientId)) {
						partyPatientId = "";
					}
					dataGuarantor.party_patient_id = partyPatientId;
				} else {
					partyPatientId = "";
				}
				//guarantor party RelatedPerson
				if (typeof req.body.party.RelatedPerson !== 'undefined') {
					var partyRelatedPersonId = req.body.party.RelatedPerson.trim().toLowerCase();
					if (validator.isEmpty(partyRelatedPersonId)) {
						partyRelatedPersonId = "";
					}
					dataGuarantor.party_related_person_id = partyRelatedPersonId;
				} else {
					partyRelatedPersonId = "";
				}
				//guarantor party Organization
				if (typeof req.body.party.Organization !== 'undefined') {
					var partyOrganizationId = req.body.party.Organization.trim().toLowerCase();
					if (validator.isEmpty(partyOrganizationId)) {
						partyOrganizationId = "";
					}
					dataGuarantor.party_organization_id = partyOrganizationId;
				} else {
					partyOrganizationId = "";
				}
			} else {
				partyPatientId = "";
				partyRelatedPersonId = "";
				partyOrganizationId = "";
			}
			//guarantor onHold
      if (typeof req.body.onHold !== 'undefined' && req.body.onHold !== "") {
        var guarantorOnHold = req.body.onHold.trim().toLowerCase();
        if(guarantorOnHold === "true" || guarantorOnHold === "false"){
					dataGuarantor.account_guarantor_on_hold = guarantorOnHold;
        } else {
          err_code = 2;
          err_msg = "guarantor onHold is must be boolean.";
        }
      } else {
        guarantorOnHold = "";
      }
			//guarantor period
			if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
        var guarantorPeriod = req.body.period;
        if (guarantorPeriod.indexOf("to") > 0) {
          arrGuarantorPeriod = guarantorPeriod.split("to");
          guarantorPeriodStart = arrGuarantorPeriod[0];
          guarantorPeriodEnd = arrGuarantorPeriod[1];
          if (!regex.test(guarantorPeriodStart) && !regex.test(guarantorPeriodEnd)) {
            err_code = 2;
            err_msg = "account Period invalid date format.";
          } else {
						dataGuarantor.account_guarantor_period_start = guarantorPeriodStart;
						dataGuarantor.account_guarantor_period_end = guarantorPeriodEnd;
					}
        }
      } else {
        guarantorPeriodStart = "";
        guarantorPeriodEnd = "";
      }
			
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
						myEmitter.once('checkAccount', function () {
							checkUniqeValue(apikey, "ACCOUNT_ID|" + accountId, 'ACCOUNT', function (resAccountId) {
                if (resAccountId.err_code > 0) {
                  checkUniqeValue(apikey, "ACCOUNT_GUARANTOR_ID|" + guarantorId, 'ACCOUNT_GUARANTOR', function (resGuarantorId) {
                    if (resGuarantorId.err_code > 0) {
                      ApiFHIR.put('accountGuarantor', {
                        "apikey": apikey,
                        "_id": guarantorId,
                        "dr": "ACCOUNT_ID|" + accountId
                      }, {
                        body: dataGuarantor,
                        json: true
                      }, function (error, response, body) {
                        var guarantor = body;
                        if (guarantor.err_code > 0) {
                          res.json(guarantor);
                        } else {
                          res.json({
                            "err_code": 0,
                            "err_msg": "Guarantor has been update in this account.",
                            "data": guarantor.data
                          });
                        }
                      })
                    } else {
                      res.json({
                        "err_code": 503,
                        "err_msg": "Guarantor Id not found"
                      });
                    }
                  })
                } else {
                  res.json({
                    "err_code": 502,
                    "err_msg": "Account Id not found"
                  });
                }
              })
						})
						myEmitter.prependOnceListener('checkOrganization', function () {
              if (validator.isEmpty(partyOrganizationId)) {
								myEmitter.emit('checkAccount');
							} else {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + partyOrganizationId, 'ORGANIZATION', function (resPartyOrganizationId) {
									if (resPartyOrganizationId.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkAccount');
									} else {
										res.json({
											"err_code": 503,
											"err_msg": "Party Organization Id not found"
										});
									}
								})
							}
            })
						myEmitter.prependOnceListener('checkRelatedPerson', function () {
              if (validator.isEmpty(partyRelatedPersonId)) {
								myEmitter.emit('checkOrganization');
							} else {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + partyRelatedPersonId, 'RELATED_PERSON', function (resPartyRelatedPersonId) {
									if (resPartyRelatedPersonId.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
										myEmitter.emit('checkOrganization');
									} else {
										res.json({
											"err_code": 502,
											"err_msg": "Party RelatedPerson Id not found"
										});
									}
								})
							}
            })
						if (validator.isEmpty(partyPatientId)) {
              myEmitter.emit('checkRelatedPerson');
            } else {
              checkUniqeValue(apikey, "PATIENT_ID|" + partyPatientId, 'PATIENT', function (resPartyPatientId) {
                if (resPartyPatientId.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                  myEmitter.emit('checkRelatedPerson');
                } else {
                  res.json({
                    "err_code": 501,
                    "err_msg": "Party Patient Id not found"
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
		},
    coverage: function updateCoverage(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var accountId = req.params.account_id;
      var accCoverageId = req.params.account_coverage_id;

      var err_code = 0;
      var err_msg = "";
      var dataCoverage = {};
			
			if (typeof accountId !== 'undefined') {
        if (validator.isEmpty(accountId)) {
          err_code = 2;
          err_msg = "Account Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Account Id is required.";
      }
			if (typeof accCoverageId !== 'undefined') {
        if (validator.isEmpty(accCoverageId)) {
          err_code = 2;
          err_msg = "Coverage id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Coverage id is required";
      }
			//coverage coverage
      if (typeof req.body.coverage !== 'undefined') {
        var coverageId = req.body.coverage.trim().toLowerCase();
        if (validator.isEmpty(coverageId)) {
          coverageId = "";
        }
        dataCoverage.coverage_id = coverageId;
      } else {
        coverageId = "";
      }
			//coverage priority
      if (typeof req.body.priority !== 'undefined' && req.body.priority !== "") {
        var coveragePriority = req.body.priority.trim().toLowerCase();
        if (!validator.isInt(coveragePriority)) {
          err_code = 2;
          err_msg = "coverage priority is must be number.";
        } else {
          dataCoverage.account_coverage_priority = coveragePriority;
        }
      } else {
        coveragePriority = "";
      }
			
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkAccount', function () {
							checkUniqeValue(apikey, "ACCOUNT_ID|" + accountId, 'ACCOUNT', function (resAccountId) {
                if (resAccountId.err_code > 0) {
                  checkUniqeValue(apikey, "ACCOUNT_COVERAGE_ID|" + accCoverageId, 'ACCOUNT_COVERAGE', function (resCoverageId) {
                    if (resCoverageId.err_code > 0) {
                      ApiFHIR.put('accountCoverage', {
                        "apikey": apikey,
                        "_id": accCoverageId,
                        "dr": "ACCOUNT_ID|" + accountId
                      }, {
                        body: dataCoverage,
                        json: true
                      }, function (error, response, body) {
                        var coverage = body;
                        if (coverage.err_code > 0) {
                          res.json(coverage);
                        } else {
                          res.json({
                            "err_code": 0,
                            "err_msg": "Coverage has been update in this account.",
                            "data": coverage.data
                          });
                        }
                      })
                    } else {
                      res.json({
                        "err_code": 503,
                        "err_msg": "Coverage Id not found"
                      });
                    }
                  })
                } else {
                  res.json({
                    "err_code": 502,
                    "err_msg": "Account Id not found"
                  });
                }
              })
						})
						if (validator.isEmpty(coverageId)) {
              myEmitter.emit('checkAccount');
            } else {
              checkUniqeValue(apikey, "COVERAGE_ID|" + coverageId, 'COVERAGE', function (resCoverageId) {
                if (resCoverageId.err_code > 0) { //code harus lebih besar dari nol, ini menunjukan datanya valid
                  myEmitter.emit('checkAccount');
                } else {
                  res.json({
                    "err_code": 501,
                    "err_msg": "Coverage id not found"
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