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
	get:{
		enrollmentResponse: function getEnrollmentResponse(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};
			var enrollmentResponseId = req.query._id;
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
			
			if (typeof enrollmentResponseId !== 'undefined') {
        if (!validator.isEmpty(enrollmentResponseId)) {
          qString._id = enrollmentResponseId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Enrollment Response ID is required."
          })
        }
      }
			
			var identifier = req.query.identifier;
			var organization = req.query.organization;
			var request = req.query.request;
			
			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "Identifier is empty."});
				}
			}

			if(typeof organization !== 'undefined'){
				if(!validator.isEmpty(organization)){
					qString.organization = organization; 
				}else{
					res.json({"err_code": 1, "err_msg": "Organization is empty."});
				}
			}

			if(typeof request !== 'undefined'){
				if(!validator.isEmpty(request)){
					qString.request = request; 
				}else{
					res.json({"err_code": 1, "err_msg": "Request is empty."});
				}
			}

			
			seedPhoenixFHIR.path.GET = {
        "EnrollmentResponse": {
          "location": "%(apikey)s/EnrollmentResponse",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
			
			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					ApiFHIR.get('EnrollmentResponse', {
            "apikey": apikey
          }, {}, function (error, response, body) {
						if (error) {
              res.json(error);
            } else {
							var enrollmentResponse = JSON.parse(body);
							if (enrollmentResponse.err_code == 0) {
								if (enrollmentResponse.data.length > 0) {
									newEnrollmentResponse = [];
									for (i = 0; i < enrollmentResponse.data.length; i++) {
										myEmitter.prependOnceListener("getIdentifier", function (enrollmentResponse, index, newEnrollmentResponse, countEnrollmentResponse) {
											qString = {};
                      qString.enrollment_response_id = enrollmentResponse.id;
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
												identifier = JSON.parse(body);
												if (identifier.err_code == 0) {
													var objectEnrollmentResponse = {};
													objectEnrollmentResponse.resourceType = enrollmentResponse.resourceType;
													objectEnrollmentResponse.id = enrollmentResponse.id;
													objectEnrollmentResponse.identifier = identifier.data;
													objectEnrollmentResponse.status = enrollmentResponse.status;
													objectEnrollmentResponse.request = enrollmentResponse.request;
													objectEnrollmentResponse.outcome = enrollmentResponse.outcome;
													objectEnrollmentResponse.disposition = enrollmentResponse.disposition;
													objectEnrollmentResponse.created = enrollmentResponse.created;
													objectEnrollmentResponse.organization = enrollmentResponse.organization;
													objectEnrollmentResponse.requestProvider = enrollmentResponse.requestProvider;
													objectEnrollmentResponse.requestOrganization = enrollmentResponse.requestOrganization;
													
													newEnrollmentResponse[index] = objectEnrollmentResponse;
													
													if (index == countEnrollmentResponse - 1) {
														res.json({
															"err_code": 0,
															"data": newEnrollmentResponse
														});
													}
													
												} else {
                          res.json(identifier);
                        }
											})
										})
										myEmitter.emit("getIdentifier", enrollmentResponse.data[i], i, newEnrollmentResponse, enrollmentResponse.data.length);
									}
								} else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Enrollment Response is empty."
                  });
                }
							} else {
                res.json(enrollmentResponse);
              }
						}
					});
				} else {
          result.err_code = 500;
          res.json(result);
        }
			});
		},
		identifier: function getIdentifier(req, res){
					var ipAddres = req.connection.remoteAddress;
					var apikey = req.params.apikey;
					var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
					var enrollmentResponseId = req.params.enrollment_response_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "ENROLLMENT_RESPONSE_ID|" + enrollmentResponseId, 'ENROLLMENT_RESPONSE', function(resEnrollmentResponseID){
								if(resEnrollmentResponseID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.enrollment_response_id = enrollmentResponseId;
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
						  			qString.enrollment_response_id = enrollmentResponseId;
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
									res.json({"err_code": 501, "err_msg": "EnrollmentResponse Id not found"});		
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
		enrollmentResponse: function addEnrollmentResponse(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var err_code = 0;
      var err_msg = "";
			
			//input check
      if (typeof req.body.identifier.use !== 'undefined') {
        var identifierUseCode = req.body.identifier.use.trim().toLowerCase();
        if (validator.isEmpty(identifierUseCode)) {
          err_code = 2;
          err_msg = "Identifier Use is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'use' in json identifier response.";
      }
      if (typeof req.body.identifier.type !== 'undefined') {
        var identifierTypeCode = req.body.identifier.type.trim().toUpperCase();
        if (validator.isEmpty(identifierTypeCode)) {
          err_code = 2;
          err_msg = "Identifier Type is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'type' in json identifier response.";
      }
      if (typeof req.body.identifier.value !== 'undefined') {
        var identifierValue = req.body.identifier.value.trim().toLowerCase();
        if (validator.isEmpty(identifierValue)) {
          err_code = 2;
          err_msg = "Identifier Value is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add sub-key 'value' in json identifier response.";
      }
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
        err_msg = "Please add key 'identifierPeriod' in json identifier response.";
      }
			
/*
status|status|||
request|request|||
outcome|outcome|||
disposition|disposition|||
created|created|date||
organization|organization|||
requestProvider|requestProvider|||
requestOrganization|requestOrganization|||
*/			
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Enrollment Response request.";
			}

			if(typeof req.body.request !== 'undefined'){
				var request =  req.body.request.trim().toLowerCase();
				if(validator.isEmpty(request)){
					request = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'request' in json Enrollment Response request.";
			}

			if(typeof req.body.outcome !== 'undefined'){
				var outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					outcome = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'outcome' in json Enrollment Response request.";
			}

			if(typeof req.body.disposition !== 'undefined'){
				var disposition =  req.body.disposition.trim().toLowerCase();
				if(validator.isEmpty(disposition)){
					disposition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'disposition' in json Enrollment Response request.";
			}

			if(typeof req.body.created !== 'undefined'){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					created = "";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "Enrollment Response created invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'created' in json Enrollment Response request.";
			}

			if(typeof req.body.organization !== 'undefined'){
				var organization =  req.body.organization.trim().toLowerCase();
				if(validator.isEmpty(organization)){
					organization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'organization' in json Enrollment Response request.";
			}

			if(typeof req.body.requestProvider !== 'undefined'){
				var requestProvider =  req.body.requestProvider.trim().toLowerCase();
				if(validator.isEmpty(requestProvider)){
					requestProvider = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'request provider' in json Enrollment Response request.";
			}

			if(typeof req.body.requestOrganization !== 'undefined'){
				var requestOrganization =  req.body.requestOrganization.trim().toLowerCase();
				if(validator.isEmpty(requestOrganization)){
					requestOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'request organization' in json Enrollment Response request.";
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
														var enrollmentResponseId = 'erp' + unicId;
														
														dataEnrollmentResponse = {
															"enrollment_response_id" : enrollmentResponseId,
															"status" : status,
															"request" : request,
															"outcome" : outcome,
															"disposition" : disposition,
															"created" : created,
															"organization" : organization,
															"request_provider" : requestProvider,
															"request_organization" : requestOrganization
														}
														console.log(dataEnrollmentResponse);
														ApiFHIR.post('enrollmentResponse', {"apikey": apikey}, {body: dataEnrollmentResponse, json: true}, function(error, response, body){
															enrollmentResponse = body;
															if(enrollmentResponse.err_code > 0){
																res.json(enrollmentResponse);	
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
																							"enrollment_response_id" : enrollmentResponseId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														
														res.json({"err_code": 0, "err_msg": "Enrollment Response has been add.", "data": [{"_id": enrollmentResponseId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										/*check code dan reference*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'FM_STATUS', function (resStatusCode) {
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

										myEmitter.prependOnceListener('checkOutcome', function () {
											if (!validator.isEmpty(outcome)) {
												checkCode(apikey, outcome, 'REMITTANCE_OUTCOME', function (resOutcomeCode) {
													if (resOutcomeCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Outcome code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})
										
										myEmitter.prependOnceListener('checkRequest', function () {
											if (!validator.isEmpty(request)) {
												checkUniqeValue(apikey, "ENROLLMENT_REQUEST_ID|" + request, 'ENROLLMENT_REQUEST', function (resRequest) {
													if (resRequest.err_code > 0) {
														myEmitter.emit('checkOutcome');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOutcome');
											}
										})

										myEmitter.prependOnceListener('checkOrganization', function () {
											if (!validator.isEmpty(organization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + organization, 'ORGANIZATION', function (resOrganization) {
													if (resOrganization.err_code > 0) {
														myEmitter.emit('checkRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequest');
											}
										})

										myEmitter.prependOnceListener('checkRequestProvider', function () {
											if (!validator.isEmpty(requestProvider)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + requestProvider, 'PRACTITIONER', function (resRequestProvider) {
													if (resRequestProvider.err_code > 0) {
														myEmitter.emit('checkOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Request provider id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOrganization');
											}
										})

										if (!validator.isEmpty(requestOrganization)) {
											checkUniqeValue(apikey, "ORGANIZATION_ID|" + requestOrganization, 'ORGANIZATION', function (resRequestOrganization) {
												if (resRequestOrganization.err_code > 0) {
													myEmitter.emit('checkRequestProvider');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Request organization id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkRequestProvider');
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
		identifier: function addIdentifier(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var enrollmentResponseId = req.params.enrollment_response_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof enrollmentResponseId !== 'undefined') {
        if (validator.isEmpty(enrollmentResponseId)) {
          err_code = 2;
          err_msg = "Enrollment Response id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Enrollment Response id is required";
      }
      //identifier
      if (typeof req.body.use !== 'undefined') {
        identifierUseCode = req.body.use.trim().toLowerCase();
        if (validator.isEmpty(identifierUseCode)) {
          err_code = 2;
          err_msg = "Identifier Use is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'use' in json response.";
      }
      //type code
      if (typeof req.body.type !== 'undefined') {
        identifierTypeCode = req.body.type.trim().toUpperCase();
        if (validator.isEmpty(identifierTypeCode)) {
          err_code = 2;
          err_msg = "Identifier Type is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'type' in json response.";
      }
			//identifier uniqe value
      if (typeof req.body.value !== 'undefined') {
        identifierValue = req.body.value.trim();
        if (validator.isEmpty(identifierValue)) {
          err_code = 2;
          err_msg = "Identifier Value is required";
        }
      } else {
        err_code = 1;
        err_msg = "Please add key 'value' in json response.";
      }
      //identifier period start
      if (typeof req.body.period !== 'undefined') {
        period = req.body.period;
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
        err_msg = "Please add key 'period' in json identifier response.";
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
                        checkUniqeValue(apikey, "ENROLLMENT_RESPONSE_ID|" + enrollmentResponseId, 'ENROLLMENT_RESPONSE', function (resEncounterID) {
                          if (resEncounterID.err_code > 0) {
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
                              "enrollment_response_id": enrollmentResponseId
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
                                  "err_msg": "Identifier has been add in this EnrollmentResponse.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
                              }
                            })
                          } else {
                            res.json({
                              "err_code": 503,
                              "err_msg": "EnrollmentResponse Id not found"
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
	put:{
		enrollmentResponse: function updateEnrollmentResponse(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var enrollmentResponseId = req.params.enrollment_response_id;
			
			var err_code = 0;
      var err_msg = "";
      var dataEnrollmentResponse = {};
			
			if (typeof enrollmentResponseId !== 'undefined') {
        if (validator.isEmpty(enrollmentResponseId)) {
          err_code = 2;
          err_msg = "Enrollment Response Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Enrollment Response Id is required.";
      }
			
			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					dataEnrollmentResponse.status = "";
				}else{
					dataEnrollmentResponse.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.request !== 'undefined' && req.body.request !== ""){
				var request =  req.body.request.trim().toLowerCase();
				if(validator.isEmpty(request)){
					dataEnrollmentResponse.request = "";
				}else{
					dataEnrollmentResponse.request = request;
				}
			}else{
			  request = "";
			}

			if(typeof req.body.outcome !== 'undefined' && req.body.outcome !== ""){
				var outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					dataEnrollmentResponse.outcome = "";
				}else{
					dataEnrollmentResponse.outcome = outcome;
				}
			}else{
			  outcome = "";
			}

			if(typeof req.body.disposition !== 'undefined' && req.body.disposition !== ""){
				var disposition =  req.body.disposition.trim().toLowerCase();
				if(validator.isEmpty(disposition)){
					dataEnrollmentResponse.disposition = "";
				}else{
					dataEnrollmentResponse.disposition = disposition;
				}
			}else{
			  disposition = "";
			}

			if(typeof req.body.created !== 'undefined' && req.body.created !== ""){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					err_code = 2;
					err_msg = "enrollment response created is required.";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "enrollment response created invalid date format.";	
					}else{
						dataEnrollmentResponse.created = created;
					}
				}
			}else{
			  created = "";
			}

			if(typeof req.body.organization !== 'undefined' && req.body.organization !== ""){
				var organization =  req.body.organization.trim().toLowerCase();
				if(validator.isEmpty(organization)){
					dataEnrollmentResponse.organization = "";
				}else{
					dataEnrollmentResponse.organization = organization;
				}
			}else{
			  organization = "";
			}

			if(typeof req.body.requestProvider !== 'undefined' && req.body.requestProvider !== ""){
				var requestProvider =  req.body.requestProvider.trim().toLowerCase();
				if(validator.isEmpty(requestProvider)){
					dataEnrollmentResponse.request_provider = "";
				}else{
					dataEnrollmentResponse.request_provider = requestProvider;
				}
			}else{
			  requestProvider = "";
			}

			if(typeof req.body.requestOrganization !== 'undefined' && req.body.requestOrganization !== ""){
				var requestOrganization =  req.body.requestOrganization.trim().toLowerCase();
				if(validator.isEmpty(requestOrganization)){
					dataEnrollmentResponse.request_organization = "";
				}else{
					dataEnrollmentResponse.request_organization = requestOrganization;
				}
			}else{
			  requestOrganization = "";
			}
			
			
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "ENROLLMENT_RESPONSE_ID|" + enrollmentResponseId, 'ENROLLMENT_RESPONSE', function (resEnrollmentResponseId) {
								if (resEnrollmentResponseId.err_code > 0) {
									ApiFHIR.put('enrollmentResponse', {
										"apikey": apikey,
										"_id": enrollmentResponseId
									}, {
										body: dataEnrollmentResponse,
										json: true
									}, function (error, response, body) {
										enrollmentResponse = body;
										if (enrollmentResponse.err_code > 0) {
											res.json(enrollmentResponse);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "Enrollment Response has been updated.",
												"data": enrollmentResponse.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 404,
										"err_msg": "Enrollment Response Id not found"
									});
								}
							})
						})
						
						/*buat reference */
						myEmitter.prependOnceListener('checkStatus', function () {
							if (!validator.isEmpty(status)) {
								checkCode(apikey, status, 'FM_STATUS', function (resStatusCode) {
									if (resStatusCode.err_code > 0) {
										myEmitter.emit('checkId');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkId');
							}
						})

						myEmitter.prependOnceListener('checkOutcome', function () {
							if (!validator.isEmpty(outcome)) {
								checkCode(apikey, outcome, 'REMITTANCE_OUTCOME', function (resOutcomeCode) {
									if (resOutcomeCode.err_code > 0) {
										myEmitter.emit('checkStatus');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Outcome code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkStatus');
							}
						})

						myEmitter.prependOnceListener('checkRequest', function () {
							if (!validator.isEmpty(request)) {
								checkUniqeValue(apikey, "ENROLLMENT_REQUEST_ID|" + request, 'ENROLLMENT_REQUEST', function (resRequest) {
									if (resRequest.err_code > 0) {
										myEmitter.emit('checkOutcome');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkOutcome');
							}
						})

						myEmitter.prependOnceListener('checkOrganization', function () {
							if (!validator.isEmpty(organization)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + organization, 'ORGANIZATION', function (resOrganization) {
									if (resOrganization.err_code > 0) {
										myEmitter.emit('checkRequest');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRequest');
							}
						})

						myEmitter.prependOnceListener('checkRequestProvider', function () {
							if (!validator.isEmpty(requestProvider)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + requestProvider, 'PRACTITIONER', function (resRequestProvider) {
									if (resRequestProvider.err_code > 0) {
										myEmitter.emit('checkOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Request provider id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkOrganization');
							}
						})

						if (!validator.isEmpty(requestOrganization)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + requestOrganization, 'ORGANIZATION', function (resRequestOrganization) {
								if (resRequestOrganization.err_code > 0) {
									myEmitter.emit('checkRequestProvider');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Request organization id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRequestProvider');
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
      var enrollmentResponseId = req.params.enrollment_response_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof enrollmentResponseId !== 'undefined') {
        if (validator.isEmpty(enrollmentResponseId)) {
          err_code = 2;
          err_msg = "Enrollment Response id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Enrollment Response id is required";
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
          err_msg = "Period response format is wrong, `ex: start to end` ";
        }
      } else {
        identifierPeriodStart = "";
        identifierPeriodEnd = "";
      }

      if (err_code == 0) {
        //check apikey
        checkApikey(apikey, ipAddres, function (result) {
          if (result.err_code == 0) {
            myEmitter.once('checkEnrollmentResponseId', function () {
              checkUniqeValue(apikey, "ENROLLMENT_RESPONSE_ID|" + enrollmentResponseId, 'ENROLLMENT_RESPONSE', function (resEnrollmentResponseId) {
                if (resEnrollmentResponseId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "ENROLLMENT_RESPONSE_ID|" + enrollmentResponseId
                      }, {
                        body: dataIdentifier,
                        json: true
                      }, function (error, response, body) {
                        identifier = body;
                        if (identifier.err_code > 0) {
                          res.json(identifier);
                        } else {
                          res.json({
                            "err_code": 0,
                            "err_msg": "Identifier has been update in this EnrollmentResponse.",
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
                    "err_msg": "EnrollmentResponse Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkEnrollmentResponseId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkEnrollmentResponseId');
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

function checkMultiCode(apikey, code_array, tableName, callback) {
	var code_array = str.split(',');
	for(var i = 0; i < code_array.length; i++) {
		code_array[i] = code_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
		ApiFHIR.get('checkMultiCode', {
			"apikey": apikey,
			"code": code_array[i],
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
	}
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