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
		paymentNotice: function getPaymentNotice(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};
			var paymentNoticeId = req.query._id;
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
			
			if (typeof paymentNoticeId !== 'undefined') {
        if (!validator.isEmpty(paymentNoticeId)) {
          qString._id = paymentNoticeId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Payment Notice ID is required."
          })
        }
      }
			
			var created = req.query.created;
			var identifier = req.query.identifier;
			var organization = req.query.organization;
			var payment_status = req.query.paymentStatus;
			var provider = req.query.provider;
			var request = req.query.request;
			var response = req.query.response;
			var statusdate = req.query.statusdate;
			
			if(typeof created !== 'undefined'){
				if(!validator.isEmpty(created)){
					if(!regex.test(created)){
						res.json({"err_code": 1, "err_msg": "Created invalid format."});
					}else{
						qString.created = created; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Created is empty."});
				}
			}

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

			if(typeof payment_status !== 'undefined'){
				if(!validator.isEmpty(payment_status)){
					qString.payment_status = payment_status; 
				}else{
					res.json({"err_code": 1, "err_msg": "Payment status is empty."});
				}
			}

			if(typeof provider !== 'undefined'){
				if(!validator.isEmpty(provider)){
					qString.provider = provider; 
				}else{
					res.json({"err_code": 1, "err_msg": "Provider is empty."});
				}
			}

			if(typeof request !== 'undefined'){
				if(!validator.isEmpty(request)){
					qString.request = request; 
				}else{
					res.json({"err_code": 1, "err_msg": "Request is empty."});
				}
			}

			if(typeof response !== 'undefined'){
				if(!validator.isEmpty(response)){
					qString.response = response; 
				}else{
					res.json({"err_code": 1, "err_msg": "Response is empty."});
				}
			}

			if(typeof statusdate !== 'undefined'){
				if(!validator.isEmpty(statusdate)){
					if(!regex.test(statusdate)){
						res.json({"err_code": 1, "err_msg": "Statusdate invalid format."});
					}else{
						qString.statusdate = statusdate; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Statusdate is empty."});
				}
			}
			
			seedPhoenixFHIR.path.GET = {
        "PaymentNotice": {
          "location": "%(apikey)s/PaymentNotice",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
			
			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					ApiFHIR.get('PaymentNotice', {
            "apikey": apikey
          }, {}, function (error, response, body) {
						if (error) {
              res.json(error);
            } else {
							var paymentNotice = JSON.parse(body);
							if (paymentNotice.err_code == 0) {
								if (paymentNotice.data.length > 0) {
									newPaymentNotice = [];
									for (i = 0; i < paymentNotice.data.length; i++) {
										myEmitter.prependOnceListener("getIdentifier", function (paymentNotice, index, newPaymentNotice, countPaymentNotice) {
											qString = {};
                      qString.payment_notice_id = paymentNotice.id;
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
													var objectPaymentNotice = {};
													objectPaymentNotice.resourceType = paymentNotice.resourceType;
													objectPaymentNotice.id = paymentNotice.id;
													objectPaymentNotice.identifier = identifier.data;
													objectPaymentNotice.status = paymentNotice.status;
													objectPaymentNotice.request = paymentNotice.request;
													objectPaymentNotice.response = paymentNotice.response;
													objectPaymentNotice.statusDate = paymentNotice.statusDate;
													objectPaymentNotice.created = paymentNotice.created;
													objectPaymentNotice.target = paymentNotice.target;
													objectPaymentNotice.provider = paymentNotice.provider;
													objectPaymentNotice.organization = paymentNotice.organization;
													objectPaymentNotice.paymentStatus = paymentNotice.paymentStatus;
													
													newPaymentNotice[index] = objectPaymentNotice;
													
													if (index == countPaymentNotice - 1) {
														res.json({
															"err_code": 0,
															"data": newPaymentNotice
														});
													}
													
												} else {
                          res.json(identifier);
                        }
											})
										})
										myEmitter.emit("getIdentifier", paymentNotice.data[i], i, newPaymentNotice, paymentNotice.data.length);
									}
								} else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Payment Notice is empty."
                  });
                }
							} else {
                res.json(paymentNotice);
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
			var paymentNoticeId = req.params.payment_notice_id;
			var identifierId = req.params.identifier_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "PAYMENT_NOTICE_ID|" + paymentNoticeId, 'PAYMENT_NOTICE', function(resPaymentNoticeID){
						if(resPaymentNoticeID.err_code > 0){
							if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
								checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
									if(resIdentifierID.err_code > 0){
										//get identifier
										qString = {};
										qString.payment_notice_id = paymentNoticeId;
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
								qString.payment_notice_id = paymentNoticeId;
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
							res.json({"err_code": 501, "err_msg": "PaymentNotice Id not found"});		
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
		paymentNotice: function addPaymentNotice(req, res) {
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
response|response|||
statusDate|statusDate|date||
created|created|date||
target|target|||
provider|provider|||
organization|organization|||
paymentStatus|paymentStatus|||
*/			
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Payment Notice request.";
			}

			if(typeof req.body.request !== 'undefined'){
				var request =  req.body.request.trim().toLowerCase();
				if(validator.isEmpty(request)){
					request = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'request' in json Payment Notice request.";
			}

			if(typeof req.body.response !== 'undefined'){
				var response =  req.body.response.trim().toLowerCase();
				if(validator.isEmpty(response)){
					response = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'response' in json Payment Notice request.";
			}

			if(typeof req.body.statusDate !== 'undefined'){
				var statusDate =  req.body.statusDate;
				if(validator.isEmpty(statusDate)){
					statusDate = "";
				}else{
					if(!regex.test(statusDate)){
						err_code = 2;
						err_msg = "Payment Notice status date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status date' in json Payment Notice request.";
			}

			if(typeof req.body.created !== 'undefined'){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					created = "";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "Payment Notice created invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'created' in json Payment Notice request.";
			}

			if(typeof req.body.target !== 'undefined'){
				var target =  req.body.target.trim().toLowerCase();
				if(validator.isEmpty(target)){
					target = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'target' in json Payment Notice request.";
			}

			if(typeof req.body.provider !== 'undefined'){
				var provider =  req.body.provider.trim().toLowerCase();
				if(validator.isEmpty(provider)){
					provider = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'provider' in json Payment Notice request.";
			}

			if(typeof req.body.organization !== 'undefined'){
				var organization =  req.body.organization.trim().toLowerCase();
				if(validator.isEmpty(organization)){
					organization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'organization' in json Payment Notice request.";
			}

			if(typeof req.body.paymentStatus !== 'undefined'){
				var paymentStatus =  req.body.paymentStatus.trim().toLowerCase();
				if(validator.isEmpty(paymentStatus)){
					paymentStatus = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment status' in json Payment Notice request.";
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
														var paymentNoticeId = 'pan' + unicId;
														
														dataPaymentNotice = {
															"payment_notice_id" : paymentNoticeId,
															"status" : status,
															"request" : request,
															"response" : response,
															"status_date" : statusDate,
															"created" : created,
															"target" : target,
															"provider" : provider,
															"organization" : organization,
															"payment_status" : paymentStatus
														}
														console.log(dataPaymentNotice);
														ApiFHIR.post('paymentNotice', {"apikey": apikey}, {body: dataPaymentNotice, json: true}, function(error, response, body){
															paymentNotice = body;
															if(paymentNotice.err_code > 0){
																res.json(paymentNotice);	
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
															"payment_notice_id" : paymentNoticeId
														}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														
														res.json({"err_code": 0, "err_msg": "Payment Notice has been add.", "data": [{"_id": paymentNoticeId}]});
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

										myEmitter.prependOnceListener('checkPaymentStatus', function () {
											if (!validator.isEmpty(paymentStatus)) {
												checkCode(apikey, paymentStatus, 'PAYMENT_STATUS', function (resPaymentStatusCode) {
													if (resPaymentStatusCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payment status code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})

										myEmitter.prependOnceListener('checkTarget', function () {
											if (!validator.isEmpty(target)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + target, 'ORGANIZATION', function (resTarget) {
													if (resTarget.err_code > 0) {
														myEmitter.emit('checkPaymentStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Target id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPaymentStatus');
											}
										})

										myEmitter.prependOnceListener('checkProvider', function () {
											if (!validator.isEmpty(provider)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + provider, 'PRACTITIONER', function (resProvider) {
													if (resProvider.err_code > 0) {
														myEmitter.emit('checkTarget');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Provider id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkTarget');
											}
										})

										if (!validator.isEmpty(organization)) {
											checkUniqeValue(apikey, "ORGANIZATION_ID|" + organization, 'ORGANIZATION', function (resOrganization) {
												if (resOrganization.err_code > 0) {
													myEmitter.emit('checkProvider');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Organization id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkProvider');
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
      var paymentNoticeId = req.params.payment_notice_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof paymentNoticeId !== 'undefined') {
        if (validator.isEmpty(paymentNoticeId)) {
          err_code = 2;
          err_msg = "Payment Notice id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Payment Notice id is required";
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
                        checkUniqeValue(apikey, "PAYMENT_NOTICE_ID|" + paymentNoticeId, 'PAYMENT_NOTICE', function (resEncounterID) {
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
                              "payment_notice_id": paymentNoticeId
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
                                  "err_msg": "Identifier has been add in this PaymentNotice.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
                              }
                            })
                          } else {
                            res.json({
                              "err_code": 503,
                              "err_msg": "PaymentNotice Id not found"
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
		paymentNotice: function updatePaymentNotice(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var paymentNoticeId = req.params.payment_notice_id;
			
			var err_code = 0;
      var err_msg = "";
      var dataPaymentNotice = {};
			
			if (typeof paymentNoticeId !== 'undefined') {
        if (validator.isEmpty(paymentNoticeId)) {
          err_code = 2;
          err_msg = "Payment Notice Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Payment Notice Id is required.";
      }
			
						if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					dataPaymentNotice.status = "";
				}else{
					dataPaymentNotice.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.request !== 'undefined' && req.body.request !== ""){
				var request =  req.body.request.trim().toLowerCase();
				if(validator.isEmpty(request)){
					dataPaymentNotice.request = "";
				}else{
					dataPaymentNotice.request = request;
				}
			}else{
			  request = "";
			}

			if(typeof req.body.response !== 'undefined' && req.body.response !== ""){
				var response =  req.body.response.trim().toLowerCase();
				if(validator.isEmpty(response)){
					dataPaymentNotice.response = "";
				}else{
					dataPaymentNotice.response = response;
				}
			}else{
			  response = "";
			}

			if(typeof req.body.statusDate !== 'undefined' && req.body.statusDate !== ""){
				var statusDate =  req.body.statusDate;
				if(validator.isEmpty(statusDate)){
					err_code = 2;
					err_msg = "payment notice status date is required.";
				}else{
					if(!regex.test(statusDate)){
						err_code = 2;
						err_msg = "payment notice status date invalid date format.";	
					}else{
						dataPaymentNotice.status_date = statusDate;
					}
				}
			}else{
			  statusDate = "";
			}

			if(typeof req.body.created !== 'undefined' && req.body.created !== ""){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					err_code = 2;
					err_msg = "payment notice created is required.";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "payment notice created invalid date format.";	
					}else{
						dataPaymentNotice.created = created;
					}
				}
			}else{
			  created = "";
			}

			if(typeof req.body.target !== 'undefined' && req.body.target !== ""){
				var target =  req.body.target.trim().toLowerCase();
				if(validator.isEmpty(target)){
					dataPaymentNotice.target = "";
				}else{
					dataPaymentNotice.target = target;
				}
			}else{
			  target = "";
			}

			if(typeof req.body.provider !== 'undefined' && req.body.provider !== ""){
				var provider =  req.body.provider.trim().toLowerCase();
				if(validator.isEmpty(provider)){
					dataPaymentNotice.provider = "";
				}else{
					dataPaymentNotice.provider = provider;
				}
			}else{
			  provider = "";
			}

			if(typeof req.body.organization !== 'undefined' && req.body.organization !== ""){
				var organization =  req.body.organization.trim().toLowerCase();
				if(validator.isEmpty(organization)){
					dataPaymentNotice.organization = "";
				}else{
					dataPaymentNotice.organization = organization;
				}
			}else{
			  organization = "";
			}

			if(typeof req.body.paymentStatus !== 'undefined' && req.body.paymentStatus !== ""){
				var paymentStatus =  req.body.paymentStatus.trim().toLowerCase();
				if(validator.isEmpty(paymentStatus)){
					dataPaymentNotice.payment_status = "";
				}else{
					dataPaymentNotice.payment_status = paymentStatus;
				}
			}else{
			  paymentStatus = "";
			}

			
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "PAYMENT_NOTICE_ID|" + paymentNoticeId, 'PAYMENT_NOTICE', function (resPaymentNoticeId) {
								if (resPaymentNoticeId.err_code > 0) {
									ApiFHIR.put('paymentNotice', {
										"apikey": apikey,
										"_id": paymentNoticeId
									}, {
										body: dataPaymentNotice,
										json: true
									}, function (error, response, body) {
										paymentNotice = body;
										if (paymentNotice.err_code > 0) {
											res.json(paymentNotice);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "Payment Notice has been updated.",
												"data": paymentNotice.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 404,
										"err_msg": "Payment Notice Id not found"
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

						myEmitter.prependOnceListener('checkPaymentStatus', function () {
							if (!validator.isEmpty(paymentStatus)) {
								checkCode(apikey, paymentStatus, 'PAYMENT_STATUS', function (resPaymentStatusCode) {
									if (resPaymentStatusCode.err_code > 0) {
										myEmitter.emit('checkStatus');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Payment status code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkStatus');
							}
						})

						myEmitter.prependOnceListener('checkTarget', function () {
							if (!validator.isEmpty(target)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + target, 'ORGANIZATION', function (resTarget) {
									if (resTarget.err_code > 0) {
										myEmitter.emit('checkPaymentStatus');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Target id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPaymentStatus');
							}
						})

						myEmitter.prependOnceListener('checkProvider', function () {
							if (!validator.isEmpty(provider)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + provider, 'PRACTITIONER', function (resProvider) {
									if (resProvider.err_code > 0) {
										myEmitter.emit('checkTarget');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Provider id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkTarget');
							}
						})

						if (!validator.isEmpty(organization)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + organization, 'ORGANIZATION', function (resOrganization) {
								if (resOrganization.err_code > 0) {
									myEmitter.emit('checkProvider');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Organization id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkProvider');
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
      var paymentNoticeId = req.params.payment_notice_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof paymentNoticeId !== 'undefined') {
        if (validator.isEmpty(paymentNoticeId)) {
          err_code = 2;
          err_msg = "Payment Notice id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Payment Notice id is required";
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
            myEmitter.once('checkPaymentNoticeId', function () {
              checkUniqeValue(apikey, "PAYMENT_NOTICE_ID|" + paymentNoticeId, 'PAYMENT_NOTICE', function (resPaymentNoticeId) {
                if (resPaymentNoticeId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "PAYMENT_NOTICE_ID|" + paymentNoticeId
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
                            "err_msg": "Identifier has been update in this PaymentNotice.",
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
                    "err_msg": "PaymentNotice Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkPaymentNoticeId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkPaymentNoticeId');
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