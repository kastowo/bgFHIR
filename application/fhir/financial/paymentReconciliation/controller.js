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
		paymentReconciliation: function getPaymentReconciliation(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};
			var paymentReconciliationId = req.query._id;
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
			
			if (typeof paymentReconciliationId !== 'undefined') {
        if (!validator.isEmpty(paymentReconciliationId)) {
          qString._id = paymentReconciliationId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Payment Reconciliation ID is required."
          })
        }
      }
			
			var created = req.query.created;
			var disposition = req.query.disposition;
			var identifier = req.query.identifier;
			var organization = req.query.organization;
			var outcome = req.query.outcome;
			var request = req.query.request;
			var request_organization = req.query.requestOrganization;
			var request_provider = req.query.requestProvider;
			
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

			if(typeof disposition !== 'undefined'){
				if(!validator.isEmpty(disposition)){
					qString.disposition = disposition; 
				}else{
					res.json({"err_code": 1, "err_msg": "Disposition is empty."});
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

			if(typeof outcome !== 'undefined'){
				if(!validator.isEmpty(outcome)){
					qString.outcome = outcome; 
				}else{
					res.json({"err_code": 1, "err_msg": "Outcome is empty."});
				}
			}

			if(typeof request !== 'undefined'){
				if(!validator.isEmpty(request)){
					qString.request = request; 
				}else{
					res.json({"err_code": 1, "err_msg": "Request is empty."});
				}
			}

			if(typeof request_organization !== 'undefined'){
				if(!validator.isEmpty(request_organization)){
					qString.request_organization = request_organization; 
				}else{
					res.json({"err_code": 1, "err_msg": "Request organization is empty."});
				}
			}

			if(typeof request_provider !== 'undefined'){
				if(!validator.isEmpty(request_provider)){
					qString.request_provider = request_provider; 
				}else{
					res.json({"err_code": 1, "err_msg": "Request provider is empty."});
				}
			}
			
			
			seedPhoenixFHIR.path.GET = {
        "PaymentReconciliation": {
          "location": "%(apikey)s/PaymentReconciliation",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
			
			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					ApiFHIR.get('PaymentReconciliation', {
            "apikey": apikey
          }, {}, function (error, response, body) {
						if (error) {
              res.json(error);
            } else {
							var paymentReconciliation = JSON.parse(body);
							if (paymentReconciliation.err_code == 0) {
								if (paymentReconciliation.data.length > 0) {
									newPaymentReconciliation = [];
									for (i = 0; i < paymentReconciliation.data.length; i++) {
										myEmitter.prependOnceListener("getIdentifier", function (paymentReconciliation, index, newPaymentReconciliation, countPaymentReconciliation) {
											qString = {};
                      qString.payment_reconciliation_id = paymentReconciliation.id;
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
													var objectPaymentReconciliation = {};
													objectPaymentReconciliation.resourceType = paymentReconciliation.resourceType;
													objectPaymentReconciliation.id = paymentReconciliation.id;
													objectPaymentReconciliation.identifier = identifier.data;
													objectPaymentReconciliation.status = paymentReconciliation.status;
													objectPaymentReconciliation.period = paymentReconciliation.period;
													objectPaymentReconciliation.created = paymentReconciliation.created;
													objectPaymentReconciliation.organization = paymentReconciliation.organization;
													objectPaymentReconciliation.request = paymentReconciliation.request;
													objectPaymentReconciliation.outcome = paymentReconciliation.outcome;
													objectPaymentReconciliation.disposition = paymentReconciliation.disposition;
													objectPaymentReconciliation.requestProvider = paymentReconciliation.requestProvider;
													objectPaymentReconciliation.requestOrganization = paymentReconciliation.requestOrganization;
													objectPaymentReconciliation.form = paymentReconciliation.form;
													objectPaymentReconciliation.total = paymentReconciliation.total;													
													newPaymentReconciliation[index] = objectPaymentReconciliation
													
													myEmitter.prependOnceListener("getPaymentReconciliationDetail", function (paymentReconciliation, index, newPaymentReconciliation, countPaymentReconciliation) {
														qString = {};
														qString.payment_reconciliation_id = paymentReconciliation.id;
														seedPhoenixFHIR.path.GET = {
															"PaymentReconciliationDetail": {
																"location": "%(apikey)s/PaymentReconciliationDetail",
																"query": qString
															}
														}
														var ApiFHIR = new Apiclient(seedPhoenixFHIR);
														ApiFHIR.get('PaymentReconciliationDetail', {
															"apikey": apikey
														}, {}, function (error, response, body) {
															paymentReconciliationDetail = JSON.parse(body);
															if (paymentReconciliationDetail.err_code == 0) {
																var objectPaymentReconciliation = {};
																objectPaymentReconciliation.resourceType = paymentReconciliation.resourceType;
																objectPaymentReconciliation.id = paymentReconciliation.id;
																objectPaymentReconciliation.identifier = paymentReconciliation.identifier;
																objectPaymentReconciliation.status = paymentReconciliation.status;
																objectPaymentReconciliation.period = paymentReconciliation.period;
																objectPaymentReconciliation.created = paymentReconciliation.created;
																objectPaymentReconciliation.organization = paymentReconciliation.organization;
																objectPaymentReconciliation.request = paymentReconciliation.request;
																objectPaymentReconciliation.outcome = paymentReconciliation.outcome;
																objectPaymentReconciliation.disposition = paymentReconciliation.disposition;
																objectPaymentReconciliation.requestProvider = paymentReconciliation.requestProvider;
																objectPaymentReconciliation.requestOrganization = paymentReconciliation.requestOrganization;
																objectPaymentReconciliation.detail = paymentReconciliationDetail.data;
																objectPaymentReconciliation.form = paymentReconciliation.form;
																objectPaymentReconciliation.total = paymentReconciliation.total;													
																newPaymentReconciliation[index] = objectPaymentReconciliation;

																myEmitter.prependOnceListener("getPaymentReconciliationProcessNote", function (paymentReconciliation, index, newPaymentReconciliation, countPaymentReconciliation) {
																	qString = {};
																	qString.payment_reconciliation_id = paymentReconciliation.id;
																	seedPhoenixFHIR.path.GET = {
																		"PaymentReconciliationProcessNote": {
																			"location": "%(apikey)s/PaymentReconciliationProcessNote",
																			"query": qString
																		}
																	}
																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																	ApiFHIR.get('PaymentReconciliationProcessNote', {
																		"apikey": apikey
																	}, {}, function (error, response, body) {
																		paymentReconciliationProcessNote = JSON.parse(body);
																		if (paymentReconciliationProcessNote.err_code == 0) {
																			var objectPaymentReconciliation = {};
																			objectPaymentReconciliation.resourceType = paymentReconciliation.resourceType;
																			objectPaymentReconciliation.id = paymentReconciliation.id;
																			objectPaymentReconciliation.identifier = paymentReconciliation.identifier;
																			objectPaymentReconciliation.status = paymentReconciliation.status;
																			objectPaymentReconciliation.period = paymentReconciliation.period;
																			objectPaymentReconciliation.created = paymentReconciliation.created;
																			objectPaymentReconciliation.organization = paymentReconciliation.organization;
																			objectPaymentReconciliation.request = paymentReconciliation.request;
																			objectPaymentReconciliation.outcome = paymentReconciliation.outcome;
																			objectPaymentReconciliation.disposition = paymentReconciliation.disposition;
																			objectPaymentReconciliation.requestProvider = paymentReconciliation.requestProvider;
																			objectPaymentReconciliation.requestOrganization = paymentReconciliation.requestOrganization;
																			objectPaymentReconciliation.detail = paymentReconciliation.detail;
																			objectPaymentReconciliation.form = paymentReconciliation.form;
																			objectPaymentReconciliation.total = paymentReconciliation.total;
																			objectPaymentReconciliation.processNote = paymentReconciliationProcessNote.data;
																			newPaymentReconciliation[index] = objectPaymentReconciliation;

																			if (index == countPaymentReconciliation - 1) {
																				res.json({
																					"err_code": 0,
																					"data": newPaymentReconciliation
																				});
																			}

																		} else {
																			res.json(paymentReconciliationProcessNote);
																		}
																	})
																})
																myEmitter.emit("getPaymentReconciliationProcessNote", objectPaymentReconciliation, index, newPaymentReconciliation, countPaymentReconciliation);

															} else {
																res.json(paymentReconciliationDetail);
															}
														})
													})
													myEmitter.emit("getPaymentReconciliationDetail", objectPaymentReconciliation, index, newPaymentReconciliation, countPaymentReconciliation);
													
												} else {
                          res.json(identifier);
                        }
											})
										})
										myEmitter.emit("getIdentifier", paymentReconciliation.data[i], i, newPaymentReconciliation, paymentReconciliation.data.length);
									}
								} else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Payment Reconciliation is empty."
                  });
                }
							} else {
                res.json(paymentReconciliation);
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
			var paymentReconciliationId = req.params.payment_reconciliation_id;
			var identifierId = req.params.identifier_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "PAYMENT_RECONCILIATION_ID|" + paymentReconciliationId, 'PAYMENT_RECONCILIATION', function(resPaymentReconciliationID){
						if(resPaymentReconciliationID.err_code > 0){
							if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
								checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
									if(resIdentifierID.err_code > 0){
										//get identifier
										qString = {};
										qString.payment_reconciliation_id = paymentReconciliationId;
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
								qString.payment_reconciliation_id = paymentReconciliationId;
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
							res.json({"err_code": 501, "err_msg": "PaymentReconciliation Id not found"});		
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
		paymentReconciliation: function addPaymentReconciliation(req, res) {
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
period|period|period||
created|created|date||
organization|organization|||
request|request|||
outcome|outcome|||
disposition|disposition|||
requestProvider|requestProvider|||
requestOrganization|requestOrganization|||
detail.type|detailType||n|
detail.request|detailRequest|||
detail.response|detailResponse|||
detail.submitter|detailSubmitter|||
detail.payee|detailPayee|||
detail.date|detailDate|date||
detail.amount|detailAmount|||
form|form|||
total|total|||
processNote.type|processNoteType|||
processNote.text|processNoteText|||
*/			
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Payment Reconciliation request.";
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
				      err_msg = "Payment Reconciliation period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Payment Reconciliation period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'period' in json Payment Reconciliation request.";
			}

			if(typeof req.body.created !== 'undefined'){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					created = "";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "Payment Reconciliation created invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'created' in json Payment Reconciliation request.";
			}

			if(typeof req.body.organization !== 'undefined'){
				var organization =  req.body.organization.trim().toLowerCase();
				if(validator.isEmpty(organization)){
					organization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'organization' in json Payment Reconciliation request.";
			}

			if(typeof req.body.request !== 'undefined'){
				var request =  req.body.request.trim().toLowerCase();
				if(validator.isEmpty(request)){
					request = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'request' in json Payment Reconciliation request.";
			}

			if(typeof req.body.outcome !== 'undefined'){
				var outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					outcome = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'outcome' in json Payment Reconciliation request.";
			}

			if(typeof req.body.disposition !== 'undefined'){
				var disposition =  req.body.disposition.trim().toLowerCase();
				if(validator.isEmpty(disposition)){
					disposition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'disposition' in json Payment Reconciliation request.";
			}

			if(typeof req.body.requestProvider !== 'undefined'){
				var requestProvider =  req.body.requestProvider.trim().toLowerCase();
				if(validator.isEmpty(requestProvider)){
					requestProvider = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'request provider' in json Payment Reconciliation request.";
			}

			if(typeof req.body.requestOrganization !== 'undefined'){
				var requestOrganization =  req.body.requestOrganization.trim().toLowerCase();
				if(validator.isEmpty(requestOrganization)){
					requestOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'request organization' in json Payment Reconciliation request.";
			}

			if(typeof req.body.detail.type !== 'undefined'){
				var detailType =  req.body.detail.type.trim().toLowerCase();
				if(validator.isEmpty(detailType)){
					err_code = 2;
					err_msg = "Payment Reconciliation detail type is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detail type' in json Payment Reconciliation request.";
			}

			if(typeof req.body.detail.request !== 'undefined'){
				var detailRequest =  req.body.detail.request.trim().toLowerCase();
				if(validator.isEmpty(detailRequest)){
					detailRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detail request' in json Payment Reconciliation request.";
			}

			if(typeof req.body.detail.response !== 'undefined'){
				var detailResponse =  req.body.detail.response.trim().toLowerCase();
				if(validator.isEmpty(detailResponse)){
					detailResponse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detail response' in json Payment Reconciliation request.";
			}

			if(typeof req.body.detail.submitter !== 'undefined'){
				var detailSubmitter =  req.body.detail.submitter.trim().toLowerCase();
				if(validator.isEmpty(detailSubmitter)){
					detailSubmitter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detail submitter' in json Payment Reconciliation request.";
			}

			if(typeof req.body.detail.payee !== 'undefined'){
				var detailPayee =  req.body.detail.payee.trim().toLowerCase();
				if(validator.isEmpty(detailPayee)){
					detailPayee = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detail payee' in json Payment Reconciliation request.";
			}

			if(typeof req.body.detail.date !== 'undefined'){
				var detailDate =  req.body.detail.date;
				if(validator.isEmpty(detailDate)){
					detailDate = "";
				}else{
					if(!regex.test(detailDate)){
						err_code = 2;
						err_msg = "Payment Reconciliation detail date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detail date' in json Payment Reconciliation request.";
			}

			if(typeof req.body.detail.amount !== 'undefined'){
				var detailAmount =  req.body.detail.amount.trim().toLowerCase();
				if(validator.isEmpty(detailAmount)){
					detailAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detail amount' in json Payment Reconciliation request.";
			}

			if(typeof req.body.form !== 'undefined'){
				var form =  req.body.form.trim().toLowerCase();
				if(validator.isEmpty(form)){
					form = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'form' in json Payment Reconciliation request.";
			}

			if(typeof req.body.total !== 'undefined'){
				var total =  req.body.total.trim().toLowerCase();
				if(validator.isEmpty(total)){
					total = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'total' in json Payment Reconciliation request.";
			}

			if(typeof req.body.processNote.type !== 'undefined'){
				var processNoteType =  req.body.processNote.type.trim().toLowerCase();
				if(validator.isEmpty(processNoteType)){
					processNoteType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'process note type' in json Payment Reconciliation request.";
			}

			if(typeof req.body.processNote.text !== 'undefined'){
				var processNoteText =  req.body.processNote.text.trim().toLowerCase();
				if(validator.isEmpty(processNoteText)){
					processNoteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'process note text' in json Payment Reconciliation request.";
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
														var paymentReconciliationId = 'par' + unicId;
														var detailId = 'pad' + unicId;
														var processNoteId = 'pap' + unicId;
														
														dataPaymentReconciliation = {
															"payment_reconciliation_id" : paymentReconciliationId,
															"status" : status,
															"period_start" : periodStart,
															"period_end" : periodEnd,
															"created" : created,
															"organization" : organization,
															"request" : request,
															"outcome" : outcome,
															"disposition" : disposition,
															"request_provider" : requestProvider,
															"request_organization" : requestOrganization,
															"form" : form,
															"total" : total
														}
														console.log(dataPaymentReconciliation);
														ApiFHIR.post('paymentReconciliation', {"apikey": apikey}, {body: dataPaymentReconciliation, json: true}, function(error, response, body){
															paymentReconciliation = body;
															if(paymentReconciliation.err_code > 0){
																res.json(paymentReconciliation);	
																console.log("ok");
															}
														});
														
														dataPaymentReconciliationDetail = {
															"detail_id" : detailId,
															"type" : detailType,
															"request" : detailRequest,
															"response" : detailResponse,
															"submitter" : detailSubmitter,
															"payee" : detailPayee,
															"date" : detailDate,
															"amount" : detailAmount,
															"payment_reconciliation_id" : paymentReconciliationId
														}
														console.log(dataPaymentReconciliationDetail);
														ApiFHIR.post('paymentReconciliationDetail', {"apikey": apikey}, {body: dataPaymentReconciliationDetail, json: true}, function(error, response, body){
															paymentReconciliationDetail = body;
															if(paymentReconciliationDetail.err_code > 0){
																res.json(paymentReconciliationDetail);	
																console.log("ok");
															}
														});
														
														dataPaymentReconciliationProcessNote = {
															"process_note_id" : processNoteId,
															"type" : processNoteType,
															"text" : processNoteText,
															"payment_reconciliation_id" : paymentReconciliationId
														}
														console.log(dataPaymentReconciliationProcessNote);
														ApiFHIR.post('paymentReconciliationProcessNote', {"apikey": apikey}, {body: dataPaymentReconciliationProcessNote, json: true}, function(error, response, body){
															paymentReconciliationProcessNote = body;
															if(paymentReconciliationProcessNote.err_code > 0){
																res.json(paymentReconciliationProcessNote);	
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
															"payment_reconciliation_id" : paymentReconciliationId
														}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														
														res.json({"err_code": 0, "err_msg": "Payment Reconciliation has been add.", "data": [{"_id": paymentReconciliationId}]});
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
												checkCode(apikey, outcome, 'remittance_outcome', function (resOutcomeCode) {
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

										myEmitter.prependOnceListener('checkDetailType', function () {
											if (!validator.isEmpty(detailType)) {
												checkCode(apikey, detailType, 'payment_type', function (resDetailTypeCode) {
													if (resDetailTypeCode.err_code > 0) {
														myEmitter.emit('checkOutcome');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Detail type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOutcome');
											}
										})

										myEmitter.prependOnceListener('checkForm', function () {
											if (!validator.isEmpty(form)) {
												checkCode(apikey, form, 'forms', function (resFormCode) {
													if (resFormCode.err_code > 0) {
														myEmitter.emit('checkDetailType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Form code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDetailType');
											}
										})

										myEmitter.prependOnceListener('checkProcessNoteType', function () {
											if (!validator.isEmpty(processNoteType)) {
												checkCode(apikey, processNoteType, 'note_type', function (resProcessNoteTypeCode) {
													if (resProcessNoteTypeCode.err_code > 0) {
														myEmitter.emit('checkForm');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Process note type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkForm');
											}
										})

										myEmitter.prependOnceListener('checkOrganization', function () {
											if (!validator.isEmpty(organization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + organization, 'ORGANIZATION', function (resOrganization) {
													if (resOrganization.err_code > 0) {
														myEmitter.emit('checkProcessNoteType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkProcessNoteType');
											}
										})

										myEmitter.prependOnceListener('checkRequest', function () {
											if (!validator.isEmpty(request)) {
												checkUniqeValue(apikey, "PROCESS_REQUEST_ID|" + request, 'PROCESS_REQUEST', function (resRequest) {
													if (resRequest.err_code > 0) {
														myEmitter.emit('checkOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOrganization');
											}
										})

										myEmitter.prependOnceListener('checkRequestProvider', function () {
											if (!validator.isEmpty(requestProvider)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + requestProvider, 'PRACTITIONER', function (resRequestProvider) {
													if (resRequestProvider.err_code > 0) {
														myEmitter.emit('checkRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Request provider id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequest');
											}
										})

										myEmitter.prependOnceListener('checkRequestOrganization', function () {
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
										})

										myEmitter.prependOnceListener('checkDetailSubmitter', function () {
											if (!validator.isEmpty(detailSubmitter)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + detailSubmitter, 'ORGANIZATION', function (resDetailSubmitter) {
													if (resDetailSubmitter.err_code > 0) {
														myEmitter.emit('checkRequestOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Detail submitter id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequestOrganization');
											}
										})

										if (!validator.isEmpty(detailPayee)) {
											checkUniqeValue(apikey, "ORGANIZATION_ID|" + detailPayee, 'ORGANIZATION', function (resDetailPayee) {
												if (resDetailPayee.err_code > 0) {
													myEmitter.emit('checkDetailSubmitter');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Detail payee id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkDetailSubmitter');
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
      var paymentReconciliationId = req.params.payment_reconciliation_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof paymentReconciliationId !== 'undefined') {
        if (validator.isEmpty(paymentReconciliationId)) {
          err_code = 2;
          err_msg = "Payment Reconciliation id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Payment Reconciliation id is required";
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
                        checkUniqeValue(apikey, "PAYMENT_RECONCILIATION_ID|" + paymentReconciliationId, 'PAYMENT_RECONCILIATION', function (resEncounterID) {
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
                              "payment_reconciliation_id": paymentReconciliationId
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
                                  "err_msg": "Identifier has been add in this PaymentReconciliation.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
                              }
                            })
                          } else {
                            res.json({
                              "err_code": 503,
                              "err_msg": "PaymentReconciliation Id not found"
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
		paymentReconciliationDetail: function addPaymentReconciliationDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var paymentReconciliationId = req.params.payment_reconciliation_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof paymentReconciliationId !== 'undefined'){
				if(validator.isEmpty(paymentReconciliationId)){
					err_code = 2;
					err_msg = "Payment Reconciliation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Payment Reconciliation id is required";
			}
			
			if(typeof req.body.request !== 'undefined'){
				var detailRequest =  req.body.request.trim().toLowerCase();
				if(validator.isEmpty(detailRequest)){
					detailRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detail request' in json Payment Reconciliation request.";
			}

			if(typeof req.body.response !== 'undefined'){
				var detailResponse =  req.body.response.trim().toLowerCase();
				if(validator.isEmpty(detailResponse)){
					detailResponse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detail response' in json Payment Reconciliation request.";
			}

			if(typeof req.body.submitter !== 'undefined'){
				var detailSubmitter =  req.body.submitter.trim().toLowerCase();
				if(validator.isEmpty(detailSubmitter)){
					detailSubmitter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detail submitter' in json Payment Reconciliation request.";
			}

			if(typeof req.body.payee !== 'undefined'){
				var detailPayee =  req.body.payee.trim().toLowerCase();
				if(validator.isEmpty(detailPayee)){
					detailPayee = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detail payee' in json Payment Reconciliation request.";
			}

			if(typeof req.body.date !== 'undefined'){
				var detailDate =  req.body.date;
				if(validator.isEmpty(detailDate)){
					detailDate = "";
				}else{
					if(!regex.test(detailDate)){
						err_code = 2;
						err_msg = "Payment Reconciliation detail date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detail date' in json Payment Reconciliation request.";
			}

			if(typeof req.body.amount !== 'undefined'){
				var detailAmount =  req.body.amount.trim().toLowerCase();
				if(validator.isEmpty(detailAmount)){
					detailAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'detail amount' in json Payment Reconciliation request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkPaymentReconciliationID', function(){
							checkUniqeValue(apikey, "PAYMENT_RECONCILIATION_ID|" + paymentReconciliationId, 'PAYMENT_RECONCILIATION', function(resPaymentReconciliationID){
								if(resPaymentReconciliationID.err_code > 0){
									var unicId = uniqid.time();
									var detailId = 'eri' + unicId;
									//PaymentReconciliationDetail
									dataPaymentReconciliationDetail = {
										"detail_id" : detailId,
										"type" : detailType,
										"request" : detailRequest,
										"response" : detailResponse,
										"submitter" : detailSubmitter,
										"payee" : detailPayee,
										"date" : detailDate,
										"amount" : detailAmount,
										"payment_reconciliation_id" : paymentReconciliationId
									}
									ApiFHIR.post('paymentReconciliationDetail', {"apikey": apikey}, {body: dataPaymentReconciliationDetail, json: true}, function(error, response, body){
										paymentReconciliationDetail = body;
										if(paymentReconciliationDetail.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Payment Reconciliation Detail has been add in this Payment Reconciliation.", "data": paymentReconciliationDetail.data});
										}else{
											res.json(paymentReconciliationDetail);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Payment Reconciliation Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkDetailType', function () {
							if (!validator.isEmpty(detailType)) {
								checkCode(apikey, detailType, 'payment_type', function (resDetailTypeCode) {
									if (resDetailTypeCode.err_code > 0) {
										myEmitter.emit('checkPaymentReconciliationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Detail type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPaymentReconciliationID');
							}
						})
						
						myEmitter.prependOnceListener('checkDetailSubmitter', function () {
							if (!validator.isEmpty(detailSubmitter)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + detailSubmitter, 'ORGANIZATION', function (resDetailSubmitter) {
									if (resDetailSubmitter.err_code > 0) {
										myEmitter.emit('checkDetailType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Detail submitter id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkDetailType');
							}
						})

						if (!validator.isEmpty(detailPayee)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + detailPayee, 'ORGANIZATION', function (resDetailPayee) {
								if (resDetailPayee.err_code > 0) {
									myEmitter.emit('checkDetailSubmitter');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Detail payee id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkDetailSubmitter');
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
		paymentReconciliationProcessNote: function addPaymentReconciliationProcessNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var paymentReconciliationId = req.params.payment_reconciliation_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof paymentReconciliationId !== 'undefined'){
				if(validator.isEmpty(paymentReconciliationId)){
					err_code = 2;
					err_msg = "Payment Reconciliation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Payment Reconciliation id is required";
			}
			
			if(typeof req.body.type !== 'undefined'){
				var processNoteType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(processNoteType)){
					processNoteType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'process note type' in json Payment Reconciliation request.";
			}

			if(typeof req.body.text !== 'undefined'){
				var processNoteText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(processNoteText)){
					processNoteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'process note text' in json Payment Reconciliation request.";
			}
			

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkPaymentReconciliationID', function(){
							checkUniqeValue(apikey, "PAYMENT_RECONCILIATION_ID|" + paymentReconciliationId, 'PAYMENT_RECONCILIATION', function(resPaymentReconciliationID){
								if(resPaymentReconciliationID.err_code > 0){
									var unicId = uniqid.time();
									var paymentReconciliationProcessNoteId = 'eri' + unicId;
									//PaymentReconciliationProcessNote
									dataPaymentReconciliationProcessNote = {
										"process_note_id" : processNoteId,
										"type" : processNoteType,
										"text" : processNoteText,
										"payment_reconciliation_id" : paymentReconciliationId
									}
									ApiFHIR.post('paymentReconciliationProcessNote', {"apikey": apikey}, {body: dataPaymentReconciliationProcessNote, json: true}, function(error, response, body){
										paymentReconciliationProcessNote = body;
										if(paymentReconciliationProcessNote.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Payment Reconciliation ProcessNote has been add in this Payment Reconciliation.", "data": paymentReconciliationProcessNote.data});
										}else{
											res.json(paymentReconciliationProcessNote);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Payment Reconciliation Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(processNoteType)) {
							checkCode(apikey, processNoteType, 'note_type', function (resProcessNoteTypeCode) {
								if (resProcessNoteTypeCode.err_code > 0) {
									myEmitter.emit('checkPaymentReconciliationID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Process note type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPaymentReconciliationID');
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
	put:{
		paymentReconciliation: function updatePaymentReconciliation(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var paymentReconciliationId = req.params.payment_reconciliation_id;
			
			var err_code = 0;
      var err_msg = "";
      var dataPaymentReconciliation = {};
			
			if (typeof paymentReconciliationId !== 'undefined') {
        if (validator.isEmpty(paymentReconciliationId)) {
          err_code = 2;
          err_msg = "Payment Reconciliation Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Payment Reconciliation Id is required.";
      }
			
			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					dataPaymentReconciliation.status = "";
				}else{
					dataPaymentReconciliation.status = status;
				}
			}else{
			  status = "";
			}

			if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
			  var period = req.body.period;
			  if (period.indexOf("to") > 0) {
			    arrPeriod = period.split("to");
			    dataPaymentReconciliation.period_start = arrPeriod[0];
			    dataPaymentReconciliation.period_end = arrPeriod[1];
			    if (!regex.test(periodStart) && !regex.test(periodEnd)) {
			      err_code = 2;
			      err_msg = "payment reconciliation period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "payment reconciliation period invalid date format.";
				}
			} else {
			  period = "";
			}

			if(typeof req.body.created !== 'undefined' && req.body.created !== ""){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					err_code = 2;
					err_msg = "payment reconciliation created is required.";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "payment reconciliation created invalid date format.";	
					}else{
						dataPaymentReconciliation.created = created;
					}
				}
			}else{
			  created = "";
			}

			if(typeof req.body.organization !== 'undefined' && req.body.organization !== ""){
				var organization =  req.body.organization.trim().toLowerCase();
				if(validator.isEmpty(organization)){
					dataPaymentReconciliation.organization = "";
				}else{
					dataPaymentReconciliation.organization = organization;
				}
			}else{
			  organization = "";
			}

			if(typeof req.body.request !== 'undefined' && req.body.request !== ""){
				var request =  req.body.request.trim().toLowerCase();
				if(validator.isEmpty(request)){
					dataPaymentReconciliation.request = "";
				}else{
					dataPaymentReconciliation.request = request;
				}
			}else{
			  request = "";
			}

			if(typeof req.body.outcome !== 'undefined' && req.body.outcome !== ""){
				var outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					dataPaymentReconciliation.outcome = "";
				}else{
					dataPaymentReconciliation.outcome = outcome;
				}
			}else{
			  outcome = "";
			}

			if(typeof req.body.disposition !== 'undefined' && req.body.disposition !== ""){
				var disposition =  req.body.disposition.trim().toLowerCase();
				if(validator.isEmpty(disposition)){
					dataPaymentReconciliation.disposition = "";
				}else{
					dataPaymentReconciliation.disposition = disposition;
				}
			}else{
			  disposition = "";
			}

			if(typeof req.body.requestProvider !== 'undefined' && req.body.requestProvider !== ""){
				var requestProvider =  req.body.requestProvider.trim().toLowerCase();
				if(validator.isEmpty(requestProvider)){
					dataPaymentReconciliation.request_provider = "";
				}else{
					dataPaymentReconciliation.request_provider = requestProvider;
				}
			}else{
			  requestProvider = "";
			}

			if(typeof req.body.requestOrganization !== 'undefined' && req.body.requestOrganization !== ""){
				var requestOrganization =  req.body.requestOrganization.trim().toLowerCase();
				if(validator.isEmpty(requestOrganization)){
					dataPaymentReconciliation.request_organization = "";
				}else{
					dataPaymentReconciliation.request_organization = requestOrganization;
				}
			}else{
			  requestOrganization = "";
			}

			if(typeof req.body.form !== 'undefined' && req.body.form !== ""){
				var form =  req.body.form.trim().toLowerCase();
				if(validator.isEmpty(form)){
					dataPaymentReconciliation.form = "";
				}else{
					dataPaymentReconciliation.form = form;
				}
			}else{
			  form = "";
			}

			if(typeof req.body.total !== 'undefined' && req.body.total !== ""){
				var total =  req.body.total.trim().toLowerCase();
				if(validator.isEmpty(total)){
					dataPaymentReconciliation.total = "";
				}else{
					dataPaymentReconciliation.total = total;
				}
			}else{
			  total = "";
			}

			
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "PAYMENT_RECONCILIATION_ID|" + paymentReconciliationId, 'PAYMENT_RECONCILIATION', function (resPaymentReconciliationId) {
								if (resPaymentReconciliationId.err_code > 0) {
									ApiFHIR.put('paymentReconciliation', {
										"apikey": apikey,
										"_id": paymentReconciliationId
									}, {
										body: dataPaymentReconciliation,
										json: true
									}, function (error, response, body) {
										paymentReconciliation = body;
										if (paymentReconciliation.err_code > 0) {
											res.json(paymentReconciliation);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "Payment Reconciliation has been updated.",
												"data": paymentReconciliation.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 404,
										"err_msg": "Payment Reconciliation Id not found"
									});
								}
							})
						})
						
						/*buat reference */
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
								checkCode(apikey, outcome, 'remittance_outcome', function (resOutcomeCode) {
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

						myEmitter.prependOnceListener('checkForm', function () {
							if (!validator.isEmpty(form)) {
								checkCode(apikey, form, 'FORMS', function (resFormCode) {
									if (resFormCode.err_code > 0) {
										myEmitter.emit('checkOutcome');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Form code not found"
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
										myEmitter.emit('checkForm');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkForm');
							}
						})

						myEmitter.prependOnceListener('checkRequest', function () {
							if (!validator.isEmpty(request)) {
								checkUniqeValue(apikey, "PROCESS_REQUEST_ID|" + request, 'PROCESS_REQUEST', function (resRequest) {
									if (resRequest.err_code > 0) {
										myEmitter.emit('checkOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkOrganization');
							}
						})

						myEmitter.prependOnceListener('checkRequestProvider', function () {
							if (!validator.isEmpty(requestProvider)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + requestProvider, 'PRACTITIONER', function (resRequestProvider) {
									if (resRequestProvider.err_code > 0) {
										myEmitter.emit('checkRequest');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Request provider id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRequest');
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
      var paymentReconciliationId = req.params.payment_reconciliation_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof paymentReconciliationId !== 'undefined') {
        if (validator.isEmpty(paymentReconciliationId)) {
          err_code = 2;
          err_msg = "Payment Reconciliation id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Payment Reconciliation id is required";
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
            myEmitter.once('checkPaymentReconciliationId', function () {
              checkUniqeValue(apikey, "PAYMENT_RECONCILIATION_ID|" + paymentReconciliationId, 'PAYMENT_RECONCILIATION', function (resPaymentReconciliationId) {
                if (resPaymentReconciliationId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "PAYMENT_RECONCILIATION_ID|" + paymentReconciliationId
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
                            "err_msg": "Identifier has been update in this PaymentReconciliation.",
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
                    "err_msg": "PaymentReconciliation Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkPaymentReconciliationId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkPaymentReconciliationId');
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
		paymentReconciliationDetail: function updatePaymentReconciliationDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var paymentReconciliationId = req.params.payment_reconciliation_id;
			var paymentReconciliationDetailId = req.params.payment_reconciliation_detail_id;

			var err_code = 0;
			var err_msg = "";
			var dataPaymentReconciliation = {};
			//input check 
			if(typeof paymentReconciliationId !== 'undefined'){
				if(validator.isEmpty(paymentReconciliationId)){
					err_code = 2;
					err_msg = "Payment Reconciliation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Payment Reconciliation id is required";
			}

			if(typeof paymentReconciliationDetailId !== 'undefined'){
				if(validator.isEmpty(paymentReconciliationDetailId)){
					err_code = 2;
					err_msg = "Payment Reconciliation Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Payment Reconciliation Detail id is required";
			}
			
			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var detailType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(detailType)){
					err_code = 2;
					err_msg = "payment reconciliation detail type is required.";
				}else{
					dataPaymentReconciliation.type = detailType;
				}
			}else{
			  detailType = "";
			}

			if(typeof req.body.request !== 'undefined' && req.body.request !== ""){
				var detailRequest =  req.body.request.trim().toLowerCase();
				if(validator.isEmpty(detailRequest)){
					dataPaymentReconciliation.request = "";
				}else{
					dataPaymentReconciliation.request = detailRequest;
				}
			}else{
			  detailRequest = "";
			}

			if(typeof req.body.response !== 'undefined' && req.body.response !== ""){
				var detailResponse =  req.body.response.trim().toLowerCase();
				if(validator.isEmpty(detailResponse)){
					dataPaymentReconciliation.response = "";
				}else{
					dataPaymentReconciliation.response = detailResponse;
				}
			}else{
			  detailResponse = "";
			}

			if(typeof req.body.submitter !== 'undefined' && req.body.submitter !== ""){
				var detailSubmitter =  req.body.submitter.trim().toLowerCase();
				if(validator.isEmpty(detailSubmitter)){
					dataPaymentReconciliation.submitter = "";
				}else{
					dataPaymentReconciliation.submitter = detailSubmitter;
				}
			}else{
			  detailSubmitter = "";
			}

			if(typeof req.body.payee !== 'undefined' && req.body.payee !== ""){
				var detailPayee =  req.body.payee.trim().toLowerCase();
				if(validator.isEmpty(detailPayee)){
					dataPaymentReconciliation.payee = "";
				}else{
					dataPaymentReconciliation.payee = detailPayee;
				}
			}else{
			  detailPayee = "";
			}

			if(typeof req.body.date !== 'undefined' && req.body.date !== ""){
				var detailDate =  req.body.date;
				if(validator.isEmpty(detailDate)){
					err_code = 2;
					err_msg = "payment reconciliation detail date is required.";
				}else{
					if(!regex.test(detailDate)){
						err_code = 2;
						err_msg = "payment reconciliation detail date invalid date format.";	
					}else{
						dataPaymentReconciliation.date = detailDate;
					}
				}
			}else{
			  detailDate = "";
			}

			if(typeof req.body.amount !== 'undefined' && req.body.amount !== ""){
				var detailAmount =  req.body.amount.trim().toLowerCase();
				if(validator.isEmpty(detailAmount)){
					dataPaymentReconciliation.amount = "";
				}else{
					dataPaymentReconciliation.amount = detailAmount;
				}
			}else{
			  detailAmount = "";
			}

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkPaymentReconciliationID', function(){
							checkUniqeValue(apikey, "PAYMENT_RECONCILIATION_ID|" + paymentReconciliationId, 'PAYMENT_RECONCILIATION', function(resPaymentReconciliationId){
								if(resPaymentReconciliationId.err_code > 0){
									checkUniqeValue(apikey, "DETAIL_ID|" + paymentReconciliationDetailId, 'PAYMENT_RECONCILIATION_DETAIL', function(resPaymentReconciliationDetailID){
										if(resPaymentReconciliationDetailID.err_code > 0){
											ApiFHIR.put('paymentReconciliationDetail', {"apikey": apikey, "_id": paymentReconciliationDetailId, "dr": "PAYMENT_RECONCILIATION_ID|"+paymentReconciliationId}, {body: dataPaymentReconciliation, json: true}, function(error, response, body){
												paymentReconciliationDetail = body;
												if(paymentReconciliationDetail.err_code > 0){
													res.json(paymentReconciliationDetail);	
												}else{
													res.json({"err_code": 0, "err_msg": "Payment Reconciliation detail has been update in this Payment Reconciliation.", "data": paymentReconciliationDetail.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Payment Reconciliation detail Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Payment Reconciliation Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkDetailType', function () {
							if (!validator.isEmpty(detailType)) {
								checkCode(apikey, detailType, 'payment_type', function (resDetailTypeCode) {
									if (resDetailTypeCode.err_code > 0) {
										myEmitter.emit('checkPaymentReconciliationID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Detail type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPaymentReconciliationID');
							}
						})
						
						myEmitter.prependOnceListener('checkDetailSubmitter', function () {
							if (!validator.isEmpty(detailSubmitter)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + detailSubmitter, 'ORGANIZATION', function (resDetailSubmitter) {
									if (resDetailSubmitter.err_code > 0) {
										myEmitter.emit('checkDetailType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Detail submitter id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkDetailType');
							}
						})

						if (!validator.isEmpty(detailPayee)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + detailPayee, 'ORGANIZATION', function (resDetailPayee) {
								if (resDetailPayee.err_code > 0) {
									myEmitter.emit('checkDetailSubmitter');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Detail payee id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkDetailSubmitter');
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
		paymentReconciliationProcessNote: function updatePaymentReconciliationProcessNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var paymentReconciliationId = req.params.payment_reconciliation_id;
			var paymentReconciliationProcessNoteId = req.params.payment_reconciliation_process_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataPaymentReconciliation = {};
			//input check 
			if(typeof paymentReconciliationId !== 'undefined'){
				if(validator.isEmpty(paymentReconciliationId)){
					err_code = 2;
					err_msg = "Payment Reconciliation id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Payment Reconciliation id is required";
			}

			if(typeof paymentReconciliationProcessNoteId !== 'undefined'){
				if(validator.isEmpty(paymentReconciliationProcessNoteId)){
					err_code = 2;
					err_msg = "Payment Reconciliation Process Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Payment Reconciliation Process Note id is required";
			}
			
			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var processNoteType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(processNoteType)){
					dataPaymentReconciliation.type = "";
				}else{
					dataPaymentReconciliation.type = processNoteType;
				}
			}else{
			  processNoteType = "";
			}

			if(typeof req.body.text !== 'undefined' && req.body.text !== ""){
				var processNoteText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(processNoteText)){
					dataPaymentReconciliation.text = "";
				}else{
					dataPaymentReconciliation.text = processNoteText;
				}
			}else{
			  processNoteText = "";
			}

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkPaymentReconciliationID', function(){
							checkUniqeValue(apikey, "PAYMENT_RECONCILIATION_ID|" + paymentReconciliationId, 'PAYMENT_RECONCILIATION', function(resPaymentReconciliationId){
								if(resPaymentReconciliationId.err_code > 0){
									checkUniqeValue(apikey, "PROCESS_NOTE_ID|" + paymentReconciliationProcessNoteId, 'PAYMENT_RECONCILIATION_PROCESS_NOTE', function(resPaymentReconciliationProcessNoteID){
										if(resPaymentReconciliationProcessNoteID.err_code > 0){
											ApiFHIR.put('paymentReconciliationProcessNote', {"apikey": apikey, "_id": paymentReconciliationProcessNoteId, "dr": "PAYMENT_RECONCILIATION_ID|"+paymentReconciliationId}, {body: dataPaymentReconciliation, json: true}, function(error, response, body){
												paymentReconciliationProcessNote = body;
												if(paymentReconciliationProcessNote.err_code > 0){
													res.json(paymentReconciliationProcessNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Payment Reconciliation Process Note has been update in this Payment Reconciliation.", "data": paymentReconciliationProcessNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Payment Reconciliation Process Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Payment Reconciliation Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(processNoteType)) {
							checkCode(apikey, processNoteType, 'note_type', function (resProcessNoteTypeCode) {
								if (resProcessNoteTypeCode.err_code > 0) {
									myEmitter.emit('checkPaymentReconciliationID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Process note type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPaymentReconciliationID');
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
