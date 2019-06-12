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
		claimResponse: function getClaimResponse(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};
			var claimResponseId = req.query._id;
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
			
			if (typeof claimResponseId !== 'undefined') {
        if (!validator.isEmpty(claimResponseId)) {
          qString._id = claimResponseId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Claim Response ID is required."
          })
        }
      }
			
			var created = req.query.created;
			var disposition = req.query.disposition;
			var identifier = req.query.identifier;
			var insurer = req.query.insurer;
			var outcome = req.query.outcome;
			var patient = req.query.patient;
			var payment_date = req.query.paymentDate;
			var request = req.query.request;
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

			if(typeof insurer !== 'undefined'){
				if(!validator.isEmpty(insurer)){
					qString.insurer = insurer; 
				}else{
					res.json({"err_code": 1, "err_msg": "Insurer is empty."});
				}
			}

			if(typeof outcome !== 'undefined'){
				if(!validator.isEmpty(outcome)){
					qString.outcome = outcome; 
				}else{
					res.json({"err_code": 1, "err_msg": "Outcome is empty."});
				}
			}

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "Patient is empty."});
				}
			}

			if(typeof payment_date !== 'undefined'){
				if(!validator.isEmpty(payment_date)){
					if(!regex.test(payment_date)){
						res.json({"err_code": 1, "err_msg": "Payment date invalid format."});
					}else{
						qString.payment_date = payment_date; 
					}	
				}else{
					res.json({"err_code": 1, "err_msg": "Payment date is empty."});
				}
			}

			if(typeof request !== 'undefined'){
				if(!validator.isEmpty(request)){
					qString.request = request; 
				}else{
					res.json({"err_code": 1, "err_msg": "Request is empty."});
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
        "ClaimResponse": {
          "location": "%(apikey)s/ClaimResponse",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
			
			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					ApiFHIR.get('ClaimResponse', {
            "apikey": apikey
          }, {}, function (error, response, body) {
						if (error) {
              res.json(error);
            } else {
							var claimResponse = JSON.parse(body);
							if (claimResponse.err_code == 0) {
								if (claimResponse.data.length > 0) {
									newClaimResponse = [];
									for (i = 0; i < claimResponse.data.length; i++) {
										myEmitter.prependOnceListener("getIdentifier", function (claimResponse, index, newClaimResponse, countClaimResponse) {
											qString = {};
                      qString.claim_response_id = claimResponse.id;
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
													var objectClaimResponse = {};
													objectClaimResponse.resourceType = claimResponse.resourceType;
													objectClaimResponse.id = claimResponse.id;
													objectClaimResponse.identifier = identifier.data;
													objectClaimResponse.status = claimResponse.status;
													objectClaimResponse.patient = claimResponse.patient;
													objectClaimResponse.created = claimResponse.created;
													objectClaimResponse.insurer = claimResponse.insurer;
													objectClaimResponse.requestProvider = claimResponse.requestProvider;
													objectClaimResponse.requestOrganization = claimResponse.requestOrganization;
													objectClaimResponse.request = claimResponse.request;
													objectClaimResponse.outcome = claimResponse.outcome;
													objectClaimResponse.disposition = claimResponse.disposition;
													objectClaimResponse.payeeType = claimResponse.payeeType;
													objectClaimResponse.totalCost = claimResponse.totalCost;
													objectClaimResponse.unallocDeductable = claimResponse.unallocDeductable;
													objectClaimResponse.totalBenefit = claimResponse.totalBenefit;
													objectClaimResponse.payment = claimResponse.payment;
													objectClaimResponse.reserved = claimResponse.reserved;
													objectClaimResponse.form = claimResponse.form;
													
													newClaimResponse[index] = objectClaimResponse;
													
													/*if (index == countClaimResponse - 1) {
														res.json({
															"err_code": 0,
															"data": newClaimResponse
														});
													}*/
													myEmitter.prependOnceListener("getClaimResponseError", function (claimResponse, index, newClaimResponse, countClaimResponse) {
														qString = {};
														qString.claim_response_id = claimResponse.id;
														seedPhoenixFHIR.path.GET = {
															"ClaimResponseError": {
																"location": "%(apikey)s/ClaimResponseError",
																"query": qString
															}
														}
														var ApiFHIR = new Apiclient(seedPhoenixFHIR);
														ApiFHIR.get('ClaimResponseError', {
															"apikey": apikey
														}, {}, function (error, response, body) {
															claimResponseError = JSON.parse(body);
															if (claimResponseError.err_code == 0) {
																var objectClaimResponse = {};
																objectClaimResponse.resourceType = claimResponse.resourceType;
																objectClaimResponse.id = claimResponse.id;
																objectClaimResponse.identifier = claimResponse.identifier;
																objectClaimResponse.status = claimResponse.status;
																objectClaimResponse.patient = claimResponse.patient;
																objectClaimResponse.created = claimResponse.created;
																objectClaimResponse.insurer = claimResponse.insurer;
																objectClaimResponse.requestProvider = claimResponse.requestProvider;
																objectClaimResponse.requestOrganization = claimResponse.requestOrganization;
																objectClaimResponse.request = claimResponse.request;
																objectClaimResponse.outcome = claimResponse.outcome;
																objectClaimResponse.disposition = claimResponse.disposition;
																objectClaimResponse.payeeType = claimResponse.payeeType;
																objectClaimResponse.item = host + ':' + port + '/' + apikey + '/ClaimResponse/' +  claim.id + '/ClaimResponseItem';
																objectClaimResponse.addItem = host + ':' + port + '/' + apikey + '/ClaimResponse/' +  claim.id + '/ClaimResponseaddItem';
																objectClaimResponse.error = claimResponseError.data;
																objectClaimResponse.totalCost = claimResponse.totalCost;
																objectClaimResponse.unallocDeductable = claimResponse.unallocDeductable;
																objectClaimResponse.totalBenefit = claimResponse.totalBenefit;
																objectClaimResponse.payment = claimResponse.payment;
																objectClaimResponse.reserved = claimResponse.reserved;
																objectClaimResponse.form = claimResponse.form;

																newClaimResponse[index] = objectClaimResponse;

																myEmitter.prependOnceListener("getClaimResponseProcessNote", function (claimResponse, index, newClaimResponse, countClaimResponse) {
																	qString = {};
																	qString.claim_response_id = claimResponse.id;
																	seedPhoenixFHIR.path.GET = {
																		"ClaimResponseProcessNote": {
																			"location": "%(apikey)s/ClaimResponseProcessNote",
																			"query": qString
																		}
																	}
																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																	ApiFHIR.get('ClaimResponseProcessNote', {
																		"apikey": apikey
																	}, {}, function (error, response, body) {
																		claimResponseProcessNote = JSON.parse(body);
																		if (claimResponseProcessNote.err_code == 0) {
																			var objectClaimResponse = {};
																			objectClaimResponse.resourceType = claimResponse.resourceType;
																			objectClaimResponse.id = claimResponse.id;
																			objectClaimResponse.identifier = claimResponse.identifier;
																			objectClaimResponse.status = claimResponse.status;
																			objectClaimResponse.patient = claimResponse.patient;
																			objectClaimResponse.created = claimResponse.created;
																			objectClaimResponse.insurer = claimResponse.insurer;
																			objectClaimResponse.requestProvider = claimResponse.requestProvider;
																			objectClaimResponse.requestOrganization = claimResponse.requestOrganization;
																			objectClaimResponse.request = claimResponse.request;
																			objectClaimResponse.outcome = claimResponse.outcome;
																			objectClaimResponse.disposition = claimResponse.disposition;
																			objectClaimResponse.payeeType = claimResponse.payeeType;
																			objectClaimResponse.item = claimResponse.ite;
																			objectClaimResponse.addItem = claimResponse.addItem;
																			objectClaimResponse.error = claimResponse.error;
																			objectClaimResponse.totalCost = claimResponse.totalCost;
																			objectClaimResponse.unallocDeductable = claimResponse.unallocDeductable;
																			objectClaimResponse.totalBenefit = claimResponse.totalBenefit;
																			objectClaimResponse.payment = claimResponse.payment;
																			objectClaimResponse.reserved = claimResponse.reserved;
																			objectClaimResponse.form = claimResponse.form;
																			objectClaimResponse.processNote = claimResponseProcessNote.data;

																			newClaimResponse[index] = objectClaimResponse;

																			myEmitter.prependOnceListener("getClaimResponseInsurance", function (claimResponse, index, newClaimResponse, countClaimResponse) {
																				qString = {};
																				qString.claim_response_id = claimResponse.id;
																				seedPhoenixFHIR.path.GET = {
																					"ClaimResponseInsurance": {
																						"location": "%(apikey)s/ClaimResponseInsurance",
																						"query": qString
																					}
																				}
																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																				ApiFHIR.get('ClaimResponseInsurance', {
																					"apikey": apikey
																				}, {}, function (error, response, body) {
																					claimResponseInsurance = JSON.parse(body);
																					if (claimResponseInsurance.err_code == 0) {
																						var objectClaimResponse = {};
																						objectClaimResponse.resourceType = claimResponse.resourceType;
																						objectClaimResponse.id = claimResponse.id;
																						objectClaimResponse.identifier = claimResponse.identifier;
																						objectClaimResponse.status = claimResponse.status;
																						objectClaimResponse.patient = claimResponse.patient;
																						objectClaimResponse.created = claimResponse.created;
																						objectClaimResponse.insurer = claimResponse.insurer;
																						objectClaimResponse.requestProvider = claimResponse.requestProvider;
																						objectClaimResponse.requestOrganization = claimResponse.requestOrganization;
																						objectClaimResponse.request = claimResponse.request;
																						objectClaimResponse.outcome = claimResponse.outcome;
																						objectClaimResponse.disposition = claimResponse.disposition;
																						objectClaimResponse.payeeType = claimResponse.payeeType;
																						objectClaimResponse.item = claimResponse.ite;
																						objectClaimResponse.addItem = claimResponse.addItem;
																						objectClaimResponse.error = claimResponse.error;
																						objectClaimResponse.totalCost = claimResponse.totalCost;
																						objectClaimResponse.unallocDeductable = claimResponse.unallocDeductable;
																						objectClaimResponse.totalBenefit = claimResponse.totalBenefit;
																						objectClaimResponse.payment = claimResponse.payment;
																						objectClaimResponse.reserved = claimResponse.reserved;
																						objectClaimResponse.form = claimResponse.form;
																						objectClaimResponse.processNote = claimResponse.processNote;
																						objectClaimResponse.insurance = claimResponseInsurance.data;

																						newClaimResponse[index] = objectClaimResponse;

																						myEmitter.prependOnceListener("getClaimResponseCommunicationRequest", function (claimResponse, index, newClaimResponse, countClaimResponse) {
																							qString = {};
																							qString.claim_response_id = claimResponse.id;
																							seedPhoenixFHIR.path.GET = {
																								"ClaimResponseCommunicationRequest": {
																									"location": "%(apikey)s/ClaimResponseCommunicationRequest",
																									"query": qString
																								}
																							}
																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																							ApiFHIR.get('ClaimResponseCommunicationRequest', {
																								"apikey": apikey
																							}, {}, function (error, response, body) {
																								claimCommunicationRequest = JSON.parse(body);
																								if (claimCommunicationRequest.err_code == 0) {
																									var objectClaimResponse = {};
																									objectClaimResponse.resourceType = claimResponse.resourceType;
																									objectClaimResponse.id = claimResponse.id;
																									objectClaimResponse.identifier = claimResponse.identifier;
																									objectClaimResponse.status = claimResponse.status;
																									objectClaimResponse.patient = claimResponse.patient;
																									objectClaimResponse.created = claimResponse.created;
																									objectClaimResponse.insurer = claimResponse.insurer;
																									objectClaimResponse.requestProvider = claimResponse.requestProvider;
																									objectClaimResponse.requestOrganization = claimResponse.requestOrganization;
																									objectClaimResponse.request = claimResponse.request;
																									objectClaimResponse.outcome = claimResponse.outcome;
																									objectClaimResponse.disposition = claimResponse.disposition;
																									objectClaimResponse.payeeType = claimResponse.payeeType;
																									objectClaimResponse.item = claimResponse.ite;
																									objectClaimResponse.addItem = claimResponse.addItem;
																									objectClaimResponse.error = claimResponse.error;
																									objectClaimResponse.totalCost = claimResponse.totalCost;
																									objectClaimResponse.unallocDeductable = claimResponse.unallocDeductable;
																									objectClaimResponse.totalBenefit = claimResponse.totalBenefit;
																									objectClaimResponse.payment = claimResponse.payment;
																									objectClaimResponse.reserved = claimResponse.reserved;
																									objectClaimResponse.form = claimResponse.form;
																									objectClaimResponse.processNote = claimResponse.processNote;
																									objectClaimResponse.communicationRequest = claimCommunicationRequest.data;
																									objectClaimResponse.insurance = claimResponse.insurance;

																									newClaimResponse[index] = objectClaimResponse;

																									if (index == countClaimResponse - 1) {
																										res.json({
																											"err_code": 0,
																											"data": newClaimResponse
																										});
																									}

																								} else {
																									res.json(claimCommunicationRequest);
																								}
																							})
																						})
																						myEmitter.emit("getClaimResponseCommunicationRequest", objectClaimResponse, index, newClaimResponse, countClaimResponse);													

																					} else {
																						res.json(claimResponseInsurance);
																					}
																				})
																			})
																			myEmitter.emit("getClaimResponseInsurance", objectClaimResponse, index, newClaimResponse, countClaimResponse);													

																		} else {
																			res.json(claimResponseProcessNote);
																		}
																	})
																})
																myEmitter.emit("getClaimResponseProcessNote", objectClaimResponse, index, newClaimResponse, countClaimResponse);													

															} else {
																res.json(claimResponseError);
															}
														})
													})
													myEmitter.emit("getClaimResponseError", objectClaimResponse, index, newClaimResponse, countClaimResponse);
												} else {
                          res.json(identifier);
                        }
											})
										})
										myEmitter.emit("getIdentifier", claimResponse.data[i], i, newClaimResponse, claimResponse.data.length);
									}
								} else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Claim Response is empty."
                  });
                }
							} else {
                res.json(claimResponse);
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
					var claimResponseId = req.params.claim_response_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "CLAIM_RESPONSE_ID|" + claimResponseId, 'CLAIM_RESPONSE', function(resClaimResponseID){
								if(resClaimResponseID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.claim_response_id = claimResponseId;
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
						  			qString.claim_response_id = claimResponseId;
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
									res.json({"err_code": 501, "err_msg": "Claim Response Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		claimResponseItem: function getClaimResponseItem(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var ClaimResponseId = req.params.claim_response_id;
			var claimResponseItemId = req.params.item_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "claim_response_id|" + ClaimResponseId, 'claim_response', function(resClaim){
						if(resClaim.err_code > 0){
							if(typeof claimResponseItemId !== 'undefined' && !validator.isEmpty(claimResponseItemId)){
								checkUniqeValue(apikey, "item_id|" + claimResponseItemId, 'claim_response_item', function(resClaimResponseItemID){
									if(resClaimResponseItemID.err_code > 0){
										//get claimResponseItem
										qString = {};
										qString.claim_response_id = ClaimResponseId;
										qString._id = claimResponseItemId;
										seedPhoenixFHIR.path.GET = {
											"ClaimResponseItem" : {
												"location": "%(apikey)s/ClaimResponseItem",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ClaimResponseItem', {"apikey": apikey}, {}, function(error, response, body){
											claimResponseItem = JSON.parse(body);
											if(claimResponseItem.err_code == 0){
												//res.json({"err_code": 0, "data":claimResponseItem.data});	
												if(claimResponseItem.data.length > 0){
													newClaimResponseItem = [];
													for(i=0; i < claimResponseItem.data.length; i++){
														myEmitter.once('getClaimResponseAdjudication', function(claimResponseItem, index, newClaimResponseItem, countClaimResponseItem){	
															qString = {};
															qString.item_id = claimResponseItem.id;
															seedPhoenixFHIR.path.GET = {
																"ClaimResponseAdjudication": {
																	"location": "%(apikey)s/ClaimResponseAdjudication",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ClaimResponseAdjudication', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																claimResponseAdjudication = JSON.parse(body);
																if (claimResponseAdjudication.err_code == 0) {
																	var objectClaimResponseItem = {};
																	objectClaimResponseItem.id = claimResponseItem.id;
																	objectClaimResponseItem.sequenceLinkId = claimResponseItem.sequenceLinkId;
																	objectClaimResponseItem.noteNumber = claimResponseItem.noteNumber;
																	objectClaimResponseItem.adjudication = claimResponseAdjudication.data;
																	objectClaimResponseItem.detail	= host + ':' + port + '/' + apikey + '/ClaimResponseItem/' +  claimResponseItem.id + '/ClaimResponseItemDetail';
																	newClaimResponseItem[index] = objectClaimResponseItem;

																	if (index == countClaimResponseItem - 1) {
																		res.json({
																			"err_code": 0,
																			"data": newClaimResponseItem
																		});
																	}
																} else {
																	res.json(claimResponseAdjudication);
																}
															})
														})
														myEmitter.emit('getClaimResponseAdjudication', claimResponseItem.data[i], i, newClaimResponseItem, claimResponseItem.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Claim Response Item is empty."});	
												}
											}else{
												res.json(claimResponseItem);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Claim Response Item Id not found"});		
									}
								})
							}else{
								//get claimResponseItem
								qString = {};
								qString.claim_response_id = ClaimResponseId;
								seedPhoenixFHIR.path.GET = {
									"ClaimResponseItem" : {
										"location": "%(apikey)s/ClaimResponseItem",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ClaimResponseItem', {"apikey": apikey}, {}, function(error, response, body){
									claimResponseItem = JSON.parse(body);
									if(claimResponseItem.err_code == 0){
										//res.json({"err_code": 0, "data":claimResponseItem.data});	
										if(claimResponseItem.data.length > 0){
											newClaimResponseItem = [];
											for(i=0; i < claimResponseItem.data.length; i++){
												myEmitter.once('getClaimResponseAdjudication', function(claimResponseItem, index, newClaimResponseItem, countClaimResponseItem){	
													qString = {};
													qString.item_id = claimResponseItem.id;
													seedPhoenixFHIR.path.GET = {
														"ClaimResponseAdjudication": {
															"location": "%(apikey)s/ClaimResponseAdjudication",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
													ApiFHIR.get('ClaimResponseAdjudication', {
														"apikey": apikey
													}, {}, function (error, response, body) {
														claimResponseAdjudication = JSON.parse(body);
														if (claimResponseAdjudication.err_code == 0) {
															var objectClaimResponseItem = {};
															objectClaimResponseItem.id = claimResponseItem.id;
															objectClaimResponseItem.sequenceLinkId = claimResponseItem.sequenceLinkId;
															objectClaimResponseItem.noteNumber = claimResponseItem.noteNumber;
															objectClaimResponseItem.adjudication = claimResponseAdjudication.data;
															objectClaimResponseItem.detail	= host + ':' + port + '/' + apikey + '/ClaimResponseItem/' +  claimResponseItem.id + '/ClaimResponseItemDetail';
															newClaimResponseItem[index] = objectClaimResponseItem;

															if (index == countClaimResponseItem - 1) {
																res.json({
																	"err_code": 0,
																	"data": newClaimResponseItem
																});
															}
														} else {
															res.json(claimResponseAdjudication);
														}
													})
												})
												myEmitter.emit('getClaimResponseAdjudication', claimResponseItem.data[i], i, newClaimResponseItem, claimResponseItem.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Claim Response Item is empty."});	
										}
									}else{
										res.json(claimResponseItem);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Claim Response Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		claimResponseItemDetail: function getClaimResponseItemDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseItemId = req.params.item_id;
			var claimResponseItemDetailId = req.params.detail_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "item_id|" + claimResponseItemId, 'claim_response_item', function(resClaim){
						if(resClaim.err_code > 0){
							if(typeof claimResponseItemDetailId !== 'undefined' && !validator.isEmpty(claimResponseItemDetailId)){
								checkUniqeValue(apikey, "detail_id|" + claimResponseItemDetailId, 'claim_response_item_detail', function(resClaimResponseItemDetailID){
									if(resClaimResponseItemDetailID.err_code > 0){
										//get claimResponseItemDetail
										qString = {};
										qString.item_id = claimResponseItemId;
										qString._id = claimResponseItemDetailId;
										seedPhoenixFHIR.path.GET = {
											"ClaimResponseItemDetail" : {
												"location": "%(apikey)s/ClaimResponseItemDetail",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ClaimResponseItemDetail', {"apikey": apikey}, {}, function(error, response, body){
											claimResponseItemDetail = JSON.parse(body);
											if(claimResponseItemDetail.err_code == 0){
												//res.json({"err_code": 0, "data":claimResponseItemDetail.data});	
												if(claimResponseItemDetail.data.length > 0){
													newClaimResponseItemDetail = [];
													for(i=0; i < claimResponseItemDetail.data.length; i++){
														myEmitter.once('getClaimResponseAdjudication', function(claimResponseItemDetail, index, newClaimResponseItemDetail, countClaimResponseItemDetail){	
															qString = {};
															qString.detail_id = claimResponseItemDetail.id;
															seedPhoenixFHIR.path.GET = {
																"ClaimResponseAdjudication": {
																	"location": "%(apikey)s/ClaimResponseAdjudication",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ClaimResponseAdjudication', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																claimResponseAdjudication = JSON.parse(body);
																if (claimResponseAdjudication.err_code == 0) {
																	var objectClaimResponseItemDetail = {};
																	objectClaimResponseItemDetail.id = claimResponseItemDetail.id;
																	objectClaimResponseItemDetail.sequenceLinkId = claimResponseItemDetail.sequenceLinkId;
																	objectClaimResponseItemDetail.noteNumber = claimResponseItemDetail.noteNumber;
																	objectClaimResponseItemDetail.adjudication = claimResponseAdjudication.data;
																	objectClaimResponseItemDetail.subDetail	= host + ':' + port + '/' + apikey + '/ClaimResponseItemDetail/' +  claimResponseItemDetail.id + '/ClaimResponseItemSubDetail';
																	newClaimResponseItemDetail[index] = objectClaimResponseItemDetail;

																	if (index == countClaimResponseItemDetail - 1) {
																		res.json({
																			"err_code": 0,
																			"data": newClaimResponseItemDetail
																		});
																	}			
																} else {
																	res.json(claimResponseAdjudication);
																}
															})
														})
														myEmitter.emit('getClaimResponseAdjudication', claimResponseItemDetail.data[i], i, newClaimResponseItemDetail, claimResponseItemDetail.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Claim Response Item Detail is empty."});	
												}
											}else{
												res.json(claimResponseItemDetail);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Claim Response Item Detail Id not found"});		
									}
								})
							}else{
								//get claimResponseItemDetail
								qString = {};
								qString.item_id = claimResponseItemId;
								seedPhoenixFHIR.path.GET = {
									"ClaimResponseItemDetail" : {
										"location": "%(apikey)s/ClaimResponseItemDetail",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ClaimResponseItemDetail', {"apikey": apikey}, {}, function(error, response, body){
									claimResponseItemDetail = JSON.parse(body);
									if(claimResponseItemDetail.err_code == 0){
										//res.json({"err_code": 0, "data":claimResponseItemDetail.data});	
										if(claimResponseItemDetail.data.length > 0){
											newClaimResponseItemDetail = [];
											for(i=0; i < claimResponseItemDetail.data.length; i++){
												myEmitter.once('getClaimResponseAdjudication', function(claimResponseItemDetail, index, newClaimResponseItemDetail, countClaimResponseItemDetail){	
													qString = {};
													qString.detail_id = claimResponseItemDetail.id;
													seedPhoenixFHIR.path.GET = {
														"ClaimResponseAdjudication": {
															"location": "%(apikey)s/ClaimResponseAdjudication",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
													ApiFHIR.get('ClaimResponseAdjudication', {
														"apikey": apikey
													}, {}, function (error, response, body) {
														claimResponseAdjudication = JSON.parse(body);
														if (claimResponseAdjudication.err_code == 0) {
															var objectClaimResponseItemDetail = {};
															objectClaimResponseItemDetail.id = claimResponseItemDetail.id;
															objectClaimResponseItemDetail.sequenceLinkId = claimResponseItemDetail.sequenceLinkId;
															objectClaimResponseItemDetail.noteNumber = claimResponseItemDetail.noteNumber;
															objectClaimResponseItemDetail.adjudication = claimResponseAdjudication.data;
															objectClaimResponseItemDetail.subDetail	= host + ':' + port + '/' + apikey + '/ClaimResponseItemDetail/' +  claimResponseItemDetail.id + '/ClaimResponseItemSubDetail';
															newClaimResponseItemDetail[index] = objectClaimResponseItemDetail;

															if (index == countClaimResponseItemDetail - 1) {
																res.json({
																	"err_code": 0,
																	"data": newClaimResponseItemDetail
																});
															}			
														} else {
															res.json(claimResponseAdjudication);
														}
													})
												})
												myEmitter.emit('getClaimResponseAdjudication', claimResponseItemDetail.data[i], i, newClaimResponseItemDetail, claimResponseItemDetail.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Claim Response Item Detail is empty."});	
										}
									}else{
										res.json(claimResponseItemDetail);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Claim Response Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		claimResponseItemSubDetail: function getClaimResponseItemSubDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseDetailId = req.params.detail_id;
			var claimResponseItemSubDetailId = req.params.sub_detail_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "detail_id|" + claimResponseDetailId, 'claim_response_item_detail', function(resClaim){
						if(resClaim.err_code > 0){
							if(typeof claimResponseItemSubDetailId !== 'undefined' && !validator.isEmpty(claimResponseItemSubDetailId)){
								checkUniqeValue(apikey, "sub_detail_id|" + claimResponseItemSubDetailId, 'claim_response_item_sub_detail', function(resClaimResponseItemSubDetailID){
									if(resClaimResponseItemSubDetailID.err_code > 0){
										//get claimResponseItemSubDetail
										qString = {};
										qString.detail_id = claimResponseDetailId;
										qString._id = claimResponseItemSubDetailId;
										seedPhoenixFHIR.path.GET = {
											"ClaimResponseItemSubDetail" : {
												"location": "%(apikey)s/ClaimResponseItemSubDetail",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ClaimResponseItemSubDetail', {"apikey": apikey}, {}, function(error, response, body){
											claimResponseItemSubDetail = JSON.parse(body);
											if(claimResponseItemSubDetail.err_code == 0){
												//res.json({"err_code": 0, "data":claimResponseItemSubDetail.data});	
												if(claimResponseItemSubDetail.data.length > 0){
													newClaimResponseItemSubDetail = [];
													for(i=0; i < claimResponseItemSubDetail.data.length; i++){
														myEmitter.once('getClaimResponseAdjudication', function(claimResponseItemSubDetail, index, newClaimResponseItemSubDetail, countClaimResponseItemSubDetail){	
															qString = {};
															qString.sub_detail_id = claimResponseItemSubDetail.id;
															seedPhoenixFHIR.path.GET = {
																"ClaimResponseAdjudication": {
																	"location": "%(apikey)s/ClaimResponseAdjudication",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ClaimResponseAdjudication', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																claimResponseAdjudication = JSON.parse(body);
																if (claimResponseAdjudication.err_code == 0) {
																	var objectClaimResponseItemSubDetail = {};
																	objectClaimResponseItemSubDetail.id = claimResponseItemSubDetail.id;
																	objectClaimResponseItemSubDetail.sequenceLinkId = claimResponseItemSubDetail.sequenceLinkId;
																	objectClaimResponseItemSubDetail.noteNumber = claimResponseItemSubDetail.noteNumber;
																	objectClaimResponseItemSubDetail.adjudication = claimResponseAdjudication.data;
																	newClaimResponseItemSubDetail[index] = objectClaimResponseItemSubDetail;

																	if (index == countClaimResponseItemSubDetail - 1) {
																		res.json({
																			"err_code": 0,
																			"data": newClaimResponseItemSubDetail
																		});
																	}			
																} else {
																	res.json(claimResponseItemSubDetailUdi);
																}
															})
														})
														myEmitter.emit('getClaimResponseAdjudication', claimResponseItemSubDetail.data[i], i, newClaimResponseItemSubDetail, claimResponseItemSubDetail.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Claim Response Item Sub Detail is empty."});	
												}
											}else{
												res.json(claimResponseItemSubDetail);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Claim Response Item Sub Detail Id not found"});		
									}
								})
							}else{
								//get claimResponseItemSubDetail
								qString = {};
								qString.detail_id = claimResponseDetailId;
								seedPhoenixFHIR.path.GET = {
									"ClaimResponseItemSubDetail" : {
										"location": "%(apikey)s/ClaimResponseItemSubDetail",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ClaimResponseItemSubDetail', {"apikey": apikey}, {}, function(error, response, body){
									claimResponseItemSubDetail = JSON.parse(body);
									if(claimResponseItemSubDetail.err_code == 0){
										//res.json({"err_code": 0, "data":claimResponseItemSubDetail.data});	
										if(claimResponseItemSubDetail.data.length > 0){
											newClaimResponseItemSubDetail = [];
											for(i=0; i < claimResponseItemSubDetail.data.length; i++){
												myEmitter.once('getClaimResponseAdjudication', function(claimResponseItemSubDetail, index, newClaimResponseItemSubDetail, countClaimResponseItemSubDetail){	
													qString = {};
													qString.sub_detail_id = claimResponseItemSubDetail.id;
													seedPhoenixFHIR.path.GET = {
														"ClaimResponseAdjudication": {
															"location": "%(apikey)s/ClaimResponseAdjudication",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
													ApiFHIR.get('ClaimResponseAdjudication', {
														"apikey": apikey
													}, {}, function (error, response, body) {
														claimResponseAdjudication = JSON.parse(body);
														if (claimResponseAdjudication.err_code == 0) {
															var objectClaimResponseItemSubDetail = {};
															objectClaimResponseItemSubDetail.id = claimResponseItemSubDetail.id;
															objectClaimResponseItemSubDetail.sequenceLinkId = claimResponseItemSubDetail.sequenceLinkId;
															objectClaimResponseItemSubDetail.noteNumber = claimResponseItemSubDetail.noteNumber;
															objectClaimResponseItemSubDetail.adjudication = claimResponseAdjudication.data;
															newClaimResponseItemSubDetail[index] = objectClaimResponseItemSubDetail;

															if (index == countClaimResponseItemSubDetail - 1) {
																res.json({
																	"err_code": 0,
																	"data": newClaimResponseItemSubDetail
																});
															}			
														} else {
															res.json(claimResponseItemSubDetailUdi);
														}
													})
												})
												myEmitter.emit('getClaimResponseAdjudication', claimResponseItemSubDetail.data[i], i, newClaimResponseItemSubDetail, claimResponseItemSubDetail.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Claim Response Item Sub Detail is empty."});	
										}
									}else{
										res.json(claimResponseItemSubDetail);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Claim Response Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		claimResponseAddItem: function getClaimResponseAddItem(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var ClaimResponseId = req.params.claim_response_id;
			var claimResponseAddItemId = req.params.add_item_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "claim_response_id|" + ClaimResponseId, 'claim_response', function(resClaim){
						if(resClaim.err_code > 0){
							if(typeof claimResponseAddItemId !== 'undefined' && !validator.isEmpty(claimResponseAddItemId)){
								checkUniqeValue(apikey, "add_item_id|" + claimResponseAddItemId, 'claim_response_add_item', function(resClaimResponseAddItemID){
									if(resClaimResponseAddItemID.err_code > 0){
										//get claimResponseAddItem
										qString = {};
										qString.claim_response_id = ClaimResponseId;
										qString._id = claimResponseAddItemId;
										seedPhoenixFHIR.path.GET = {
											"ClaimResponseAddItem" : {
												"location": "%(apikey)s/ClaimResponseAddItem",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ClaimResponseAddItem', {"apikey": apikey}, {}, function(error, response, body){
											claimResponseAddItem = JSON.parse(body);
											if(claimResponseAddItem.err_code == 0){
												//res.json({"err_code": 0, "data":claimResponseAddItem.data});	
												if(claimResponseAddItem.data.length > 0){
													newClaimResponseAddItem = [];
													for(i=0; i < claimResponseAddItem.data.length; i++){
														myEmitter.once('getClaimResponseAdjudication', function(claimResponseAddItem, index, newClaimResponseAddItem, countClaimResponseAddItem){	
															qString = {};
															qString.add_item_id = claimResponseAddItem.id;
															seedPhoenixFHIR.path.GET = {
																"ClaimResponseAdjudication": {
																	"location": "%(apikey)s/ClaimResponseAdjudication",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ClaimResponseAdjudication', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																claimResponseAdjudication = JSON.parse(body);
																if (claimResponseAdjudication.err_code == 0) {
																	var objectClaimResponseAddItem = {};
																	objectClaimResponseAddItem.id = claimResponseAddItem.id;
																	objectClaimResponseAddItem.sequenceLinkId = claimResponseAddItem.sequenceLinkId;
																	objectClaimResponseAddItem.revenue = claimResponseAddItem.revenue;
																	objectClaimResponseAddItem.category = claimResponseAddItem.category;
																	objectClaimResponseAddItem.service = claimResponseAddItem.service;
																	objectClaimResponseAddItem.modifier = claimResponseAddItem.modifier;
																	objectClaimResponseAddItem.fee = claimResponseAddItem.fee;
																	objectClaimResponseAddItem.noteNumber = claimResponseAddItem.noteNumber;
																	objectClaimResponseAddItem.adjudication = claimResponseAdjudication.data;
																	objectClaimResponseAddItem.detail	= host + ':' + port + '/' + apikey + '/ClaimResponseAddItem/' +  claimResponseAddItem.id + '/ClaimResponseAddItemDetail';
																	newClaimResponseAddItem[index] = objectClaimResponseAddItem;

																	if (index == countClaimResponseAddItem - 1) {
																		res.json({
																			"err_code": 0,
																			"data": newClaimResponseAddItem
																		});
																	}
																} else {
																	res.json(claimResponseAdjudication);
																}
															})
														})
														myEmitter.emit('getClaimResponseAdjudication', claimResponseAddItem.data[i], i, newClaimResponseAddItem, claimResponseAddItem.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Claim Response AddItem is empty."});	
												}
											}else{
												res.json(claimResponseAddItem);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Claim Response AddItem Id not found"});		
									}
								})
							}else{
								//get claimResponseAddItem
								qString = {};
								qString.claim_response_id = ClaimResponseId;
								seedPhoenixFHIR.path.GET = {
									"ClaimResponseAddItem" : {
										"location": "%(apikey)s/ClaimResponseAddItem",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ClaimResponseAddItem', {"apikey": apikey}, {}, function(error, response, body){
									claimResponseAddItem = JSON.parse(body);
									if(claimResponseAddItem.err_code == 0){
										//res.json({"err_code": 0, "data":claimResponseAddItem.data});	
										if(claimResponseAddItem.data.length > 0){
											newClaimResponseAddItem = [];
											for(i=0; i < claimResponseAddItem.data.length; i++){
												myEmitter.once('getClaimResponseAdjudication', function(claimResponseAddItem, index, newClaimResponseAddItem, countClaimResponseAddItem){	
													qString = {};
													qString.add_item_id = claimResponseAddItem.id;
													seedPhoenixFHIR.path.GET = {
														"ClaimResponseAdjudication": {
															"location": "%(apikey)s/ClaimResponseAdjudication",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
													ApiFHIR.get('ClaimResponseAdjudication', {
														"apikey": apikey
													}, {}, function (error, response, body) {
														claimResponseAdjudication = JSON.parse(body);
														if (claimResponseAdjudication.err_code == 0) {
															var objectClaimResponseAddItem = {};
															objectClaimResponseAddItem.id = claimResponseAddItem.id;
															objectClaimResponseAddItem.sequenceLinkId = claimResponseAddItem.sequenceLinkId;
															objectClaimResponseAddItem.revenue = claimResponseAddItem.revenue;
															objectClaimResponseAddItem.category = claimResponseAddItem.category;
															objectClaimResponseAddItem.service = claimResponseAddItem.service;
															objectClaimResponseAddItem.modifier = claimResponseAddItem.modifier;
															objectClaimResponseAddItem.fee = claimResponseAddItem.fee;
															objectClaimResponseAddItem.noteNumber = claimResponseAddItem.noteNumber;
															objectClaimResponseAddItem.adjudication = claimResponseAdjudication.data;
															objectClaimResponseAddItem.detail	= host + ':' + port + '/' + apikey + '/ClaimResponseAddItem/' +  claimResponseAddItem.id + '/ClaimResponseAddItemDetail';
															newClaimResponseAddItem[index] = objectClaimResponseAddItem;

															if (index == countClaimResponseAddItem - 1) {
																res.json({
																	"err_code": 0,
																	"data": newClaimResponseAddItem
																});
															}
														} else {
															res.json(claimResponseAdjudication);
														}
													})
												})
												myEmitter.emit('getClaimResponseAdjudication', claimResponseAddItem.data[i], i, newClaimResponseAddItem, claimResponseAddItem.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Claim Response AddItem is empty."});	
										}
									}else{
										res.json(claimResponseAddItem);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Claim Response Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		claimResponseAddItemDetail: function getClaimResponseAddItemDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseAddItemId = req.params.add_item_id;
			var claimResponseAddItemDetailId = req.params.add_item_detail_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "add_item_id|" + claimResponseAddItemId, 'claim_response_add_item', function(resClaim){
						if(resClaim.err_code > 0){
							if(typeof claimResponseAddItemDetailId !== 'undefined' && !validator.isEmpty(claimResponseAddItemDetailId)){
								checkUniqeValue(apikey, "add_item_detail_id|" + claimResponseAddItemDetailId, 'claim_response_add_item_detail', function(resClaimResponseAddItemDetailID){
									if(resClaimResponseAddItemDetailID.err_code > 0){
										//get claimResponseAddItemDetail
										qString = {};
										qString.add_item_id = claimResponseAddItemId;
										qString._id = claimResponseAddItemDetailId;
										seedPhoenixFHIR.path.GET = {
											"ClaimResponseAddItemDetail" : {
												"location": "%(apikey)s/ClaimResponseAddItemDetail",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ClaimResponseAddItemDetail', {"apikey": apikey}, {}, function(error, response, body){
											claimResponseAddItemDetail = JSON.parse(body);
											if(claimResponseAddItemDetail.err_code == 0){
												//res.json({"err_code": 0, "data":claimResponseAddItemDetail.data});	
												if(claimResponseAddItemDetail.data.length > 0){
													newClaimResponseAddItemDetail = [];
													for(i=0; i < claimResponseAddItemDetail.data.length; i++){
														myEmitter.once('getClaimResponseAdjudication', function(claimResponseAddItemDetail, index, newClaimResponseAddItemDetail, countClaimResponseAddItemDetail){	
															qString = {};
															qString.add_item_detail_id = claimResponseAddItemDetail.id;
															seedPhoenixFHIR.path.GET = {
																"ClaimResponseAdjudication": {
																	"location": "%(apikey)s/ClaimResponseAdjudication",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ClaimResponseAdjudication', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																claimResponseAdjudication = JSON.parse(body);
																if (claimResponseAdjudication.err_code == 0) {
																	var objectClaimResponseAddItemDetail = {};
																	objectClaimResponseAddItemDetail.id = claimResponseAddItemDetail.id;
																	objectClaimResponseAddItemDetail.revenue = claimResponseAddItemDetail.revenue;
																	objectClaimResponseAddItemDetail.category = claimResponseAddItemDetail.category;
																	objectClaimResponseAddItemDetail.service = claimResponseAddItemDetail.service;
																	objectClaimResponseAddItemDetail.modifier = claimResponseAddItemDetail.modifier;
																	objectClaimResponseAddItemDetail.fee = claimResponseAddItemDetail.fee;
																	objectClaimResponseAddItemDetail.noteNumber = claimResponseAddItemDetail.noteNumber;
																	objectClaimResponseAddItemDetail.adjudication = claimResponseAdjudication.data;
																	newClaimResponseAddItemDetail[index] = objectClaimResponseAddItemDetail;

																	if (index == countClaimResponseAddItemDetail - 1) {
																		res.json({
																			"err_code": 0,
																			"data": newClaimResponseAddItemDetail
																		});
																	}			
																} else {
																	res.json(claimResponseAdjudication);
																}
															})
														})
														myEmitter.emit('getClaimResponseAdjudication', claimResponseAddItemDetail.data[i], i, newClaimResponseAddItemDetail, claimResponseAddItemDetail.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Claim Response AddItem Detail is empty."});	
												}
											}else{
												res.json(claimResponseAddItemDetail);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Claim Response AddItem Detail Id not found"});		
									}
								})
							}else{
								//get claimResponseAddItemDetail
								qString = {};
								qString.add_item_id = claimResponseAddItemId;
								seedPhoenixFHIR.path.GET = {
									"ClaimResponseAddItemDetail" : {
										"location": "%(apikey)s/ClaimResponseAddItemDetail",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ClaimResponseAddItemDetail', {"apikey": apikey}, {}, function(error, response, body){
									claimResponseAddItemDetail = JSON.parse(body);
									if(claimResponseAddItemDetail.err_code == 0){
										//res.json({"err_code": 0, "data":claimResponseAddItemDetail.data});	
										if(claimResponseAddItemDetail.data.length > 0){
											newClaimResponseAddItemDetail = [];
											for(i=0; i < claimResponseAddItemDetail.data.length; i++){
												myEmitter.once('getClaimResponseAdjudication', function(claimResponseAddItemDetail, index, newClaimResponseAddItemDetail, countClaimResponseAddItemDetail){	
													qString = {};
													qString.add_item_detail_id = claimResponseAddItemDetail.id;
													seedPhoenixFHIR.path.GET = {
														"ClaimResponseAdjudication": {
															"location": "%(apikey)s/ClaimResponseAdjudication",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
													ApiFHIR.get('ClaimResponseAdjudication', {
														"apikey": apikey
													}, {}, function (error, response, body) {
														claimResponseAdjudication = JSON.parse(body);
														if (claimResponseAdjudication.err_code == 0) {
															var objectClaimResponseAddItemDetail = {};
															objectClaimResponseAddItemDetail.id = claimResponseAddItemDetail.id;
															objectClaimResponseAddItemDetail.revenue = claimResponseAddItemDetail.revenue;
															objectClaimResponseAddItemDetail.category = claimResponseAddItemDetail.category;
															objectClaimResponseAddItemDetail.service = claimResponseAddItemDetail.service;
															objectClaimResponseAddItemDetail.modifier = claimResponseAddItemDetail.modifier;
															objectClaimResponseAddItemDetail.fee = claimResponseAddItemDetail.fee;
															objectClaimResponseAddItemDetail.noteNumber = claimResponseAddItemDetail.noteNumber;
															objectClaimResponseAddItemDetail.adjudication = claimResponseAdjudication.data;
															newClaimResponseAddItemDetail[index] = objectClaimResponseAddItemDetail;

															if (index == countClaimResponseAddItemDetail - 1) {
																res.json({
																	"err_code": 0,
																	"data": newClaimResponseAddItemDetail
																});
															}			
														} else {
															res.json(claimResponseAdjudication);
														}
													})
												})
												myEmitter.emit('getClaimResponseAdjudication', claimResponseAddItemDetail.data[i], i, newClaimResponseAddItemDetail, claimResponseAddItemDetail.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Claim Response AddItem Detail is empty."});	
										}
									}else{
										res.json(claimResponseAddItemDetail);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Claim Response Id not found"});		
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
		claimResponse: function addClaimResponse(req, res) {
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
patient|patient|||
created|created|date||
insurer|insurer|||
requestProvider|requestProvider|||
requestOrganization|requestOrganization|||
request|request|||
outcome|outcome|||
disposition|disposition|||
payeeType|payeeType|||
item.sequenceLinkId|itemSequenceLinkId|integer|n|
item.noteNumber|itemNoteNumber|integer||
item.adjudication.category|itemAdjudicationCategory||n|
item.adjudication.reason|itemAdjudicationReason|||
item.adjudication.amount|itemAdjudicationAmount|||
item.adjudication.value|itemAdjudicationValue|integer||
item.detail.sequenceLinkId|itemDetailSequenceLinkId|integer|n|
item.detail.noteNumber|itemDetailNoteNumber|integer||
item.detail.adjudication.category|itemDetailAdjudicationCategory||n|
item.detail.adjudication.reason|itemDetailAdjudicationReason|||
item.detail.adjudication.amount|itemDetailAdjudicationAmount|||
item.detail.adjudication.value|itemDetailAdjudicationValue|integer||
item.detail.subDetail.sequenceLinkId|itemDetailSubDetailSequenceLinkId|integer|n|
item.detail.subDetail.noteNumber|itemDetailSubDetailNoteNumber|integer||
item.detail.subDetail.adjudication.category|itemDetailSubDetailAdjudicationCategory||n|
item.detail.subDetail.adjudication.reason|itemDetailSubDetailAdjudicationReason|||
item.detail.subDetail.adjudication.amount|itemDetailSubDetailAdjudicationAmount|||
item.detail.subDetail.adjudication.value|itemDetailSubDetailAdjudicationValue|integer||
addItem.sequenceLinkId|addItemSequenceLinkId|integer||
addItem.revenue|addItemRevenue|||
addItem.category|addItemCategory|||u
addItem.service|addItemService|||
addItem.modifier|addItemModifier|||
addItem.fee|addItemFee|||
addItem.noteNumber|addItemNoteNumber|integer||
addItem.adjudication.category|addItemAdjudicationCategory||n|
addItem.adjudication.reason|addItemAdjudicationReason|||
addItem.adjudication.amount|addItem.adjudication.amount|||
addItem.adjudication.value|addItemAdjudicationValue|integer||
addItem.detail.revenue|addItemDetailRevenue|||
addItem.detail.category|addItemDetailCategory|||u
addItem.detail.service|addItemDetailService|||
addItem.detail.modifier|addItemDetailModifier|||
addItem.detail.fee|addItemDetailFee|||
addItem.detail.noteNumber|addItemDetailNoteNumber|integer||
addItem.detail.adjudication.category|addItemDetailAdjudicationCategory||n|
addItem.detail.adjudication.reason|addItemDetailAdjudicationReason|||
addItem.detail.adjudication.amount|addItemDetailAdjudicationAmount|||
addItem.detail.adjudication.value|addItemDetailAdjudicationValue|integer||
error.sequenceLinkId|errorSequenceLinkId|integer||
error.detailSequenceLinkId|errorDetailSequenceLinkId|integer||
error.subdetailSequenceLinkId|errorSubdetailSequenceLinkId|integer||
error.code|errorCode||n|
totalCost|totalCost|||
unallocDeductable|unallocDeductable|||
totalBenefit|totalBenefit|||
payment.type|paymentType|||
payment.adjustment|paymentAdjustment|||
payment.adjustmentReason|paymentAdjustmentReason|||
payment.date|paymentDate|date||
payment.amount|paymentAmount|||
payment.identifier.use|paymentIdentifierUse||n|
payment.identifier.type|paymentIdentifierType||n|
payment.identifier.value|paymentIdentifierValue||n|
payment.identifier.period|paymentIdentifierPeriod|period|n|
reserved|reserved|||
form|form|||
processNote.number|processNoteNumber|integer||
processNote.type|processNoteType|||
processNote.text|processNoteText|||
processNote.language|processNoteLanguage|||a
communicationRequest|communicationRequest|||
insurance.sequence|insuranceSequence|integer|n|
insurance.focal|insuranceFocal|boolean|n|
insurance.coverage|insuranceCoverage||n|
insurance.businessArrangement|insuranceBusinessArrangement|||
insurance.preAuthRef|insurancePreAuthRef|||
insurance.claimResponse|insuranceClaimResponse|||
*/			
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Claim Response request.";
			}

			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					patient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Claim Response request.";
			}

			if(typeof req.body.created !== 'undefined'){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					created = "";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "Claim Response created invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'created' in json Claim Response request.";
			}

			if(typeof req.body.insurer !== 'undefined'){
				var insurer =  req.body.insurer.trim().toLowerCase();
				if(validator.isEmpty(insurer)){
					insurer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurer' in json Claim Response request.";
			}

			if(typeof req.body.requestProvider !== 'undefined'){
				var requestProvider =  req.body.requestProvider.trim().toLowerCase();
				if(validator.isEmpty(requestProvider)){
					requestProvider = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'request provider' in json Claim Response request.";
			}

			if(typeof req.body.requestOrganization !== 'undefined'){
				var requestOrganization =  req.body.requestOrganization.trim().toLowerCase();
				if(validator.isEmpty(requestOrganization)){
					requestOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'request organization' in json Claim Response request.";
			}

			if(typeof req.body.request !== 'undefined'){
				var request =  req.body.request.trim().toLowerCase();
				if(validator.isEmpty(request)){
					request = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'request' in json Claim Response request.";
			}

			if(typeof req.body.outcome !== 'undefined'){
				var outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					outcome = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'outcome' in json Claim Response request.";
			}

			if(typeof req.body.disposition !== 'undefined'){
				var disposition =  req.body.disposition.trim().toLowerCase();
				if(validator.isEmpty(disposition)){
					disposition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'disposition' in json Claim Response request.";
			}

			if(typeof req.body.payeeType !== 'undefined'){
				var payeeType =  req.body.payeeType.trim().toLowerCase();
				if(validator.isEmpty(payeeType)){
					payeeType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payee type' in json Claim Response request.";
			}

			if(typeof req.body.item.sequenceLinkId !== 'undefined'){
				var itemSequenceLinkId =  req.body.item.sequenceLinkId.trim();
				if(validator.isEmpty(itemSequenceLinkId)){
					err_code = 2;
					err_msg = "Claim Response item sequence link id is required.";
				}else{
					if(!validator.isInt(itemSequenceLinkId)){
						err_code = 2;
						err_msg = "Claim Response item sequence link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item sequence link id' in json Claim Response request.";
			}

			if(typeof req.body.item.noteNumber !== 'undefined'){
				var itemNoteNumber =  req.body.item.noteNumber.trim();
				if(validator.isEmpty(itemNoteNumber)){
					itemNoteNumber = "";
				}else{
					if(!validator.isInt(itemNoteNumber)){
						err_code = 2;
						err_msg = "Claim Response item note number is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item note number' in json Claim Response request.";
			}

			if(typeof req.body.item.adjudication.category !== 'undefined'){
				var itemAdjudicationCategory =  req.body.item.adjudication.category.trim().toLowerCase();
				if(validator.isEmpty(itemAdjudicationCategory)){
					err_code = 2;
					err_msg = "Claim Response item adjudication category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item adjudication category' in json Claim Response request.";
			}

			if(typeof req.body.item.adjudication.reason !== 'undefined'){
				var itemAdjudicationReason =  req.body.item.adjudication.reason.trim().toLowerCase();
				if(validator.isEmpty(itemAdjudicationReason)){
					itemAdjudicationReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item adjudication reason' in json Claim Response request.";
			}

			if(typeof req.body.item.adjudication.amount !== 'undefined'){
				var itemAdjudicationAmount =  req.body.item.adjudication.amount.trim().toLowerCase();
				if(validator.isEmpty(itemAdjudicationAmount)){
					itemAdjudicationAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item adjudication amount' in json Claim Response request.";
			}

			if(typeof req.body.item.adjudication.value !== 'undefined'){
				var itemAdjudicationValue =  req.body.item.adjudication.value.trim();
				if(validator.isEmpty(itemAdjudicationValue)){
					itemAdjudicationValue = "";
				}else{
					if(!validator.isInt(itemAdjudicationValue)){
						err_code = 2;
						err_msg = "Claim Response item adjudication value is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item adjudication value' in json Claim Response request.";
			}

			if(typeof req.body.item.detail.sequenceLinkId !== 'undefined'){
				var itemDetailSequenceLinkId =  req.body.item.detail.sequenceLinkId.trim();
				if(validator.isEmpty(itemDetailSequenceLinkId)){
					err_code = 2;
					err_msg = "Claim Response item detail sequence link id is required.";
				}else{
					if(!validator.isInt(itemDetailSequenceLinkId)){
						err_code = 2;
						err_msg = "Claim Response item detail sequence link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sequence link id' in json Claim Response request.";
			}

			if(typeof req.body.item.detail.noteNumber !== 'undefined'){
				var itemDetailNoteNumber =  req.body.item.detail.noteNumber.trim();
				if(validator.isEmpty(itemDetailNoteNumber)){
					itemDetailNoteNumber = "";
				}else{
					if(!validator.isInt(itemDetailNoteNumber)){
						err_code = 2;
						err_msg = "Claim Response item detail note number is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail note number' in json Claim Response request.";
			}

			if(typeof req.body.item.detail.adjudication.category !== 'undefined'){
				var itemDetailAdjudicationCategory =  req.body.item.detail.adjudication.category.trim().toLowerCase();
				if(validator.isEmpty(itemDetailAdjudicationCategory)){
					err_code = 2;
					err_msg = "Claim Response item detail adjudication category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail adjudication category' in json Claim Response request.";
			}

			if(typeof req.body.item.detail.adjudication.reason !== 'undefined'){
				var itemDetailAdjudicationReason =  req.body.item.detail.adjudication.reason.trim().toLowerCase();
				if(validator.isEmpty(itemDetailAdjudicationReason)){
					itemDetailAdjudicationReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail adjudication reason' in json Claim Response request.";
			}

			if(typeof req.body.item.detail.adjudication.amount !== 'undefined'){
				var itemDetailAdjudicationAmount =  req.body.item.detail.adjudication.amount.trim().toLowerCase();
				if(validator.isEmpty(itemDetailAdjudicationAmount)){
					itemDetailAdjudicationAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail adjudication amount' in json Claim Response request.";
			}

			if(typeof req.body.item.detail.adjudication.value !== 'undefined'){
				var itemDetailAdjudicationValue =  req.body.item.detail.adjudication.value.trim();
				if(validator.isEmpty(itemDetailAdjudicationValue)){
					itemDetailAdjudicationValue = "";
				}else{
					if(!validator.isInt(itemDetailAdjudicationValue)){
						err_code = 2;
						err_msg = "Claim Response item detail adjudication value is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail adjudication value' in json Claim Response request.";
			}

			if(typeof req.body.item.detail.subDetail.sequenceLinkId !== 'undefined'){
				var itemDetailSubDetailSequenceLinkId =  req.body.item.detail.subDetail.sequenceLinkId.trim();
				if(validator.isEmpty(itemDetailSubDetailSequenceLinkId)){
					err_code = 2;
					err_msg = "Claim Response item detail sub detail sequence link id is required.";
				}else{
					if(!validator.isInt(itemDetailSubDetailSequenceLinkId)){
						err_code = 2;
						err_msg = "Claim Response item detail sub detail sequence link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail sequence link id' in json Claim Response request.";
			}

			if(typeof req.body.item.detail.subDetail.noteNumber !== 'undefined'){
				var itemDetailSubDetailNoteNumber =  req.body.item.detail.subDetail.noteNumber.trim();
				if(validator.isEmpty(itemDetailSubDetailNoteNumber)){
					itemDetailSubDetailNoteNumber = "";
				}else{
					if(!validator.isInt(itemDetailSubDetailNoteNumber)){
						err_code = 2;
						err_msg = "Claim Response item detail sub detail note number is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail note number' in json Claim Response request.";
			}

			if(typeof req.body.item.detail.subDetail.adjudication.category !== 'undefined'){
				var itemDetailSubDetailAdjudicationCategory =  req.body.item.detail.subDetail.adjudication.category.trim().toLowerCase();
				if(validator.isEmpty(itemDetailSubDetailAdjudicationCategory)){
					err_code = 2;
					err_msg = "Claim Response item detail sub detail adjudication category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail adjudication category' in json Claim Response request.";
			}

			if(typeof req.body.item.detail.subDetail.adjudication.reason !== 'undefined'){
				var itemDetailSubDetailAdjudicationReason =  req.body.item.detail.subDetail.adjudication.reason.trim().toLowerCase();
				if(validator.isEmpty(itemDetailSubDetailAdjudicationReason)){
					itemDetailSubDetailAdjudicationReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail adjudication reason' in json Claim Response request.";
			}

			if(typeof req.body.item.detail.subDetail.adjudication.amount !== 'undefined'){
				var itemDetailSubDetailAdjudicationAmount =  req.body.item.detail.subDetail.adjudication.amount.trim().toLowerCase();
				if(validator.isEmpty(itemDetailSubDetailAdjudicationAmount)){
					itemDetailSubDetailAdjudicationAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail adjudication amount' in json Claim Response request.";
			}

			if(typeof req.body.item.detail.subDetail.adjudication.value !== 'undefined'){
				var itemDetailSubDetailAdjudicationValue =  req.body.item.detail.subDetail.adjudication.value.trim();
				if(validator.isEmpty(itemDetailSubDetailAdjudicationValue)){
					itemDetailSubDetailAdjudicationValue = "";
				}else{
					if(!validator.isInt(itemDetailSubDetailAdjudicationValue)){
						err_code = 2;
						err_msg = "Claim Response item detail sub detail adjudication value is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail adjudication value' in json Claim Response request.";
			}

			if(typeof req.body.addItem.sequenceLinkId !== 'undefined'){
				var addItemSequenceLinkId =  req.body.addItem.sequenceLinkId.trim();
				if(validator.isEmpty(addItemSequenceLinkId)){
					addItemSequenceLinkId = "";
				}else{
					if(!validator.isInt(addItemSequenceLinkId)){
						err_code = 2;
						err_msg = "Claim Response add item sequence link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item sequence link id' in json Claim Response request.";
			}

			if(typeof req.body.addItem.revenue !== 'undefined'){
				var addItemRevenue =  req.body.addItem.revenue.trim().toLowerCase();
				if(validator.isEmpty(addItemRevenue)){
					addItemRevenue = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item revenue' in json Claim Response request.";
			}

			if(typeof req.body.addItem.category !== 'undefined'){
				var addItemCategory =  req.body.addItem.category.trim().toUpperCase();
				if(validator.isEmpty(addItemCategory)){
					addItemCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item category' in json Claim Response request.";
			}

			if(typeof req.body.addItem.service !== 'undefined'){
				var addItemService =  req.body.addItem.service.trim().toLowerCase();
				if(validator.isEmpty(addItemService)){
					addItemService = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item service' in json Claim Response request.";
			}

			if(typeof req.body.addItem.modifier !== 'undefined'){
				var addItemModifier =  req.body.addItem.modifier.trim().toLowerCase();
				if(validator.isEmpty(addItemModifier)){
					addItemModifier = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item modifier' in json Claim Response request.";
			}

			if(typeof req.body.addItem.fee !== 'undefined'){
				var addItemFee =  req.body.addItem.fee.trim().toLowerCase();
				if(validator.isEmpty(addItemFee)){
					addItemFee = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item fee' in json Claim Response request.";
			}

			if(typeof req.body.addItem.noteNumber !== 'undefined'){
				var addItemNoteNumber =  req.body.addItem.noteNumber.trim();
				if(validator.isEmpty(addItemNoteNumber)){
					addItemNoteNumber = "";
				}else{
					if(!validator.isInt(addItemNoteNumber)){
						err_code = 2;
						err_msg = "Claim Response add item note number is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item note number' in json Claim Response request.";
			}

			if(typeof req.body.addItem.adjudication.category !== 'undefined'){
				var addItemAdjudicationCategory =  req.body.addItem.adjudication.category.trim().toLowerCase();
				if(validator.isEmpty(addItemAdjudicationCategory)){
					err_code = 2;
					err_msg = "Claim Response add item adjudication category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item adjudication category' in json Claim Response request.";
			}

			if(typeof req.body.addItem.adjudication.reason !== 'undefined'){
				var addItemAdjudicationReason =  req.body.addItem.adjudication.reason.trim().toLowerCase();
				if(validator.isEmpty(addItemAdjudicationReason)){
					addItemAdjudicationReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item adjudication reason' in json Claim Response request.";
			}

			if(typeof req.body.addItem.adjudication.amount !== 'undefined'){
				var addItemAdjudicationAmount =  req.body.addItem.adjudication.amount.trim().toLowerCase();
				if(validator.isEmpty(addItemAdjudicationAmount)){
					addItemAdjudicationAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item adjudication amount' in json Claim Response request.";
			}

			if(typeof req.body.addItem.adjudication.value !== 'undefined'){
				var addItemAdjudicationValue =  req.body.addItem.adjudication.value.trim();
				if(validator.isEmpty(addItemAdjudicationValue)){
					addItemAdjudicationValue = "";
				}else{
					if(!validator.isInt(addItemAdjudicationValue)){
						err_code = 2;
						err_msg = "Claim Response add item adjudication value is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item adjudication value' in json Claim Response request.";
			}

			if(typeof req.body.addItem.detail.revenue !== 'undefined'){
				var addItemDetailRevenue =  req.body.addItem.detail.revenue.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailRevenue)){
					addItemDetailRevenue = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail revenue' in json Claim Response request.";
			}

			if(typeof req.body.addItem.detail.category !== 'undefined'){
				var addItemDetailCategory =  req.body.addItem.detail.category.trim().toUpperCase();
				if(validator.isEmpty(addItemDetailCategory)){
					addItemDetailCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail category' in json Claim Response request.";
			}

			if(typeof req.body.addItem.detail.service !== 'undefined'){
				var addItemDetailService =  req.body.addItem.detail.service.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailService)){
					addItemDetailService = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail service' in json Claim Response request.";
			}

			if(typeof req.body.addItem.detail.modifier !== 'undefined'){
				var addItemDetailModifier =  req.body.addItem.detail.modifier.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailModifier)){
					addItemDetailModifier = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail modifier' in json Claim Response request.";
			}

			if(typeof req.body.addItem.detail.fee !== 'undefined'){
				var addItemDetailFee =  req.body.addItem.detail.fee.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailFee)){
					addItemDetailFee = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail fee' in json Claim Response request.";
			}

			if(typeof req.body.addItem.detail.noteNumber !== 'undefined'){
				var addItemDetailNoteNumber =  req.body.addItem.detail.noteNumber.trim();
				if(validator.isEmpty(addItemDetailNoteNumber)){
					addItemDetailNoteNumber = "";
				}else{
					if(!validator.isInt(addItemDetailNoteNumber)){
						err_code = 2;
						err_msg = "Claim Response add item detail note number is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail note number' in json Claim Response request.";
			}

			if(typeof req.body.addItem.detail.adjudication.category !== 'undefined'){
				var addItemDetailAdjudicationCategory =  req.body.addItem.detail.adjudication.category.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailAdjudicationCategory)){
					err_code = 2;
					err_msg = "Claim Response add item detail adjudication category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail adjudication category' in json Claim Response request.";
			}

			if(typeof req.body.addItem.detail.adjudication.reason !== 'undefined'){
				var addItemDetailAdjudicationReason =  req.body.addItem.detail.adjudication.reason.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailAdjudicationReason)){
					addItemDetailAdjudicationReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail adjudication reason' in json Claim Response request.";
			}

			if(typeof req.body.addItem.detail.adjudication.amount !== 'undefined'){
				var addItemDetailAdjudicationAmount =  req.body.addItem.detail.adjudication.amount.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailAdjudicationAmount)){
					addItemDetailAdjudicationAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail adjudication amount' in json Claim Response request.";
			}

			if(typeof req.body.addItem.detail.adjudication.value !== 'undefined'){
				var addItemDetailAdjudicationValue =  req.body.addItem.detail.adjudication.value.trim();
				if(validator.isEmpty(addItemDetailAdjudicationValue)){
					addItemDetailAdjudicationValue = "";
				}else{
					if(!validator.isInt(addItemDetailAdjudicationValue)){
						err_code = 2;
						err_msg = "Claim Response add item detail adjudication value is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail adjudication value' in json Claim Response request.";
			}

			if(typeof req.body.error.sequenceLinkId !== 'undefined'){
				var errorSequenceLinkId =  req.body.error.sequenceLinkId.trim();
				if(validator.isEmpty(errorSequenceLinkId)){
					errorSequenceLinkId = "";
				}else{
					if(!validator.isInt(errorSequenceLinkId)){
						err_code = 2;
						err_msg = "Claim Response error sequence link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'error sequence link id' in json Claim Response request.";
			}

			if(typeof req.body.error.detailSequenceLinkId !== 'undefined'){
				var errorDetailSequenceLinkId =  req.body.error.detailSequenceLinkId.trim();
				if(validator.isEmpty(errorDetailSequenceLinkId)){
					errorDetailSequenceLinkId = "";
				}else{
					if(!validator.isInt(errorDetailSequenceLinkId)){
						err_code = 2;
						err_msg = "Claim Response error detail sequence link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'error detail sequence link id' in json Claim Response request.";
			}

			if(typeof req.body.error.subdetailSequenceLinkId !== 'undefined'){
				var errorSubdetailSequenceLinkId =  req.body.error.subdetailSequenceLinkId.trim();
				if(validator.isEmpty(errorSubdetailSequenceLinkId)){
					errorSubdetailSequenceLinkId = "";
				}else{
					if(!validator.isInt(errorSubdetailSequenceLinkId)){
						err_code = 2;
						err_msg = "Claim Response error subdetail sequence link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'error subdetail sequence link id' in json Claim Response request.";
			}

			if(typeof req.body.error.code !== 'undefined'){
				var errorCode =  req.body.error.code.trim().toLowerCase();
				if(validator.isEmpty(errorCode)){
					err_code = 2;
					err_msg = "Claim Response error code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'error code' in json Claim Response request.";
			}

			if(typeof req.body.totalCost !== 'undefined'){
				var totalCost =  req.body.totalCost.trim().toLowerCase();
				if(validator.isEmpty(totalCost)){
					totalCost = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'total cost' in json Claim Response request.";
			}

			if(typeof req.body.unallocDeductable !== 'undefined'){
				var unallocDeductable =  req.body.unallocDeductable.trim().toLowerCase();
				if(validator.isEmpty(unallocDeductable)){
					unallocDeductable = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'unalloc deductable' in json Claim Response request.";
			}

			if(typeof req.body.totalBenefit !== 'undefined'){
				var totalBenefit =  req.body.totalBenefit.trim().toLowerCase();
				if(validator.isEmpty(totalBenefit)){
					totalBenefit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'total benefit' in json Claim Response request.";
			}

			if(typeof req.body.payment.type !== 'undefined'){
				var paymentType =  req.body.payment.type.trim().toLowerCase();
				if(validator.isEmpty(paymentType)){
					paymentType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment type' in json Claim Response request.";
			}

			if(typeof req.body.payment.adjustment !== 'undefined'){
				var paymentAdjustment =  req.body.payment.adjustment.trim().toLowerCase();
				if(validator.isEmpty(paymentAdjustment)){
					paymentAdjustment = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment adjustment' in json Claim Response request.";
			}

			if(typeof req.body.payment.adjustmentReason !== 'undefined'){
				var paymentAdjustmentReason =  req.body.payment.adjustmentReason.trim().toLowerCase();
				if(validator.isEmpty(paymentAdjustmentReason)){
					paymentAdjustmentReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment adjustment reason' in json Claim Response request.";
			}

			if(typeof req.body.payment.date !== 'undefined'){
				var paymentDate =  req.body.payment.date;
				if(validator.isEmpty(paymentDate)){
					paymentDate = "";
				}else{
					if(!regex.test(paymentDate)){
						err_code = 2;
						err_msg = "Claim Response payment date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment date' in json Claim Response request.";
			}

			if(typeof req.body.payment.amount !== 'undefined'){
				var paymentAmount =  req.body.payment.amount.trim().toLowerCase();
				if(validator.isEmpty(paymentAmount)){
					paymentAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment amount' in json Claim Response request.";
			}

			if(typeof req.body.payment.identifier.use !== 'undefined'){
				var paymentIdentifierUse =  req.body.payment.identifier.use.trim().toLowerCase();
				if(validator.isEmpty(paymentIdentifierUse)){
					err_code = 2;
					err_msg = "Claim Response payment identifier use is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment identifier use' in json Claim Response request.";
			}

			if(typeof req.body.payment.identifier.type !== 'undefined'){
				var paymentIdentifierType =  req.body.payment.identifier.type.trim().toLowerCase();
				if(validator.isEmpty(paymentIdentifierType)){
					err_code = 2;
					err_msg = "Claim Response payment identifier type is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment identifier type' in json Claim Response request.";
			}

			if(typeof req.body.payment.identifier.value !== 'undefined'){
				var paymentIdentifierValue =  req.body.payment.identifier.value.trim().toLowerCase();
				if(validator.isEmpty(paymentIdentifierValue)){
					err_code = 2;
					err_msg = "Claim Response payment identifier value is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment identifier value' in json Claim Response request.";
			}

			if (typeof req.body.payment.identifier.period !== 'undefined') {
			  var paymentIdentifierPeriod = req.body.payment.identifier.period;
			  if (paymentIdentifierPeriod.indexOf("to") > 0) {
			    arrPaymentIdentifierPeriod = paymentIdentifierPeriod.split("to");
			    var paymentIdentifierPeriodStart = arrPaymentIdentifierPeriod[0];
			    var paymentIdentifierPeriodEnd = arrPaymentIdentifierPeriod[1];
			    if (!regex.test(paymentIdentifierPeriodStart) && !regex.test(paymentIdentifierPeriodEnd)) {
			      err_code = 2;
			      err_msg = "Claim Response payment identifier period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "Claim Response payment identifier period invalid date format.";
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'payment identifier period' in json Claim Response request.";
			}

			if(typeof req.body.reserved !== 'undefined'){
				var reserved =  req.body.reserved.trim().toLowerCase();
				if(validator.isEmpty(reserved)){
					reserved = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'reserved' in json Claim Response request.";
			}

			if(typeof req.body.form !== 'undefined'){
				var form =  req.body.form.trim().toLowerCase();
				if(validator.isEmpty(form)){
					form = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'form' in json Claim Response request.";
			}

			if(typeof req.body.processNote.number !== 'undefined'){
				var processNoteNumber =  req.body.processNote.number.trim();
				if(validator.isEmpty(processNoteNumber)){
					processNoteNumber = "";
				}else{
					if(!validator.isInt(processNoteNumber)){
						err_code = 2;
						err_msg = "Claim Response process note number is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'process note number' in json Claim Response request.";
			}

			if(typeof req.body.processNote.type !== 'undefined'){
				var processNoteType =  req.body.processNote.type.trim().toLowerCase();
				if(validator.isEmpty(processNoteType)){
					processNoteType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'process note type' in json Claim Response request.";
			}

			if(typeof req.body.processNote.text !== 'undefined'){
				var processNoteText =  req.body.processNote.text.trim().toLowerCase();
				if(validator.isEmpty(processNoteText)){
					processNoteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'process note text' in json Claim Response request.";
			}

			if(typeof req.body.processNote.language !== 'undefined'){
				var processNoteLanguage =  req.body.processNote.language.trim();
				if(validator.isEmpty(processNoteLanguage)){
					processNoteLanguage = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'process note language' in json Claim Response request.";
			}

			if(typeof req.body.communicationRequest !== 'undefined'){
				var communicationRequest =  req.body.communicationRequest.trim().toLowerCase();
				if(validator.isEmpty(communicationRequest)){
					communicationRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'communication request' in json Claim Response request.";
			}

			if(typeof req.body.insurance.sequence !== 'undefined'){
				var insuranceSequence =  req.body.insurance.sequence.trim();
				if(validator.isEmpty(insuranceSequence)){
					err_code = 2;
					err_msg = "Claim Response insurance sequence is required.";
				}else{
					if(!validator.isInt(insuranceSequence)){
						err_code = 2;
						err_msg = "Claim Response insurance sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance sequence' in json Claim Response request.";
			}

			if (typeof req.body.insurance.focal !== 'undefined') {
				var insuranceFocal = req.body.insurance.focal.trim().toLowerCase();
				if(insuranceFocal === "true" || insuranceFocal === "false"){
					insuranceFocal = insuranceFocal;
				} else {
					err_code = 2;
					err_msg = "Claim Response insurance focal is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'insurance focal' in json Claim Response request.";
			}

			if(typeof req.body.insurance.coverage !== 'undefined'){
				var insuranceCoverage =  req.body.insurance.coverage.trim().toLowerCase();
				if(validator.isEmpty(insuranceCoverage)){
					err_code = 2;
					err_msg = "Claim Response insurance coverage is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance coverage' in json Claim Response request.";
			}

			if(typeof req.body.insurance.businessArrangement !== 'undefined'){
				var insuranceBusinessArrangement =  req.body.insurance.businessArrangement.trim().toLowerCase();
				if(validator.isEmpty(insuranceBusinessArrangement)){
					insuranceBusinessArrangement = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance business arrangement' in json Claim Response request.";
			}

			if(typeof req.body.insurance.preAuthRef !== 'undefined'){
				var insurancePreAuthRef =  req.body.insurance.preAuthRef.trim().toLowerCase();
				if(validator.isEmpty(insurancePreAuthRef)){
					insurancePreAuthRef = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance pre auth ref' in json Claim Response request.";
			}

			if(typeof req.body.insurance.claimResponse !== 'undefined'){
				var insuranceClaimResponse =  req.body.insurance.claimResponse.trim().toLowerCase();
				if(validator.isEmpty(insuranceClaimResponse)){
					insuranceClaimResponse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance claim response' in json Claim Response request.";
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
														var claimResponseId = 'crs' + unicId;
														var claimResponsePaymentidentifierId = 'crp' + unicId;
														var claimResponseItemId = 'cri' + unicId;
														var claimResponseItemDetailId = 'crd' + unicId;
														var claimResponseItemSubDetailId = 'crs' + unicId;
														var claimResponseAddItemId = 'cra' + unicId;
														var claimResponseAddItemDetailId = 'crt' + unicId;
														var claimResponseErrorId = 'cre' + unicId;
														var claimResponseProcessNoteId = 'crc' + unicId;
														var claimResponseInsuranceId = 'crn' + unicId;
														var itemAdjudicationId = 'iaj' + unicId;
														var itemDetailAdjudicationId = 'iad' + unicId;
														var itemDetailSubDetailAdjudicationId = 'ias' + unicId;
														var addItemAdjudicationId = 'aaj' + unicId;
														var addItemDetailAdjudicationId  = 'aad' + unicId;
														
														dataClaimResponse = {
															"claim_response_id" : claimResponseId,
															"status" : status,
															"patient" : patient,
															"created" : created,
															"insurer" : insurer,
															"request_provider" : requestProvider,
															"request_organization" : requestOrganization,
															"request" : request,
															"outcome" : outcome,
															"disposition" : disposition,
															"payee_type" : payeeType,
															"total_cost" : totalCost,
															"unalloc_deductable" : unallocDeductable,
															"total_benefit" : totalBenefit,
															"payment_type" : paymentType,
															"payment_adjustment" : paymentAdjustment,
															"payment_adjustment_reason" : paymentAdjustmentReason,
															"payment_date" : paymentDate,
															"payment_amount" : paymentAmount,
															"payment_identifier" : claimResponsePaymentidentifierId,
															"reserved" : reserved,
															"form" : form
														}
														console.log(dataClaimResponse);
														ApiFHIR.post('claimResponse', {"apikey": apikey}, {body: dataClaimResponse, json: true}, function(error, response, body){
															claimResponse = body;
															if(claimResponse.err_code > 0){
																res.json(claimResponse);	
																console.log("ok");
															}
														});
														
														var paymentIdentifierSystem = claimResponsePaymentidentifierId;
														dataIdentifier = {
																							"id": claimResponsePaymentidentifierId,
																							"use": paymentIdentifierUse,
																							"type": paymentIdentifierType,
																							"system": paymentIdentifierSystem,
																							"value": paymentIdentifierValue,
																							"period_start": paymentIdentifierPeriodStart,
																							"period_end": paymentIdentifierPeriodEnd,
																							"claim_response_payment_id" : claimResponseId
																						}
														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})

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
																							"claim_response_id" : claimResponseId
																						}
														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
													
														dataClaimResponseItem = {
															"item_id": claimResponseItemId,
															"sequence_link_id" : itemSequenceLinkId,
															"note_number" : itemNoteNumber,
															"claim_response_id" : claimResponseId
														}
														ApiFHIR.post('claimResponseItem', {"apikey": apikey}, {body: dataClaimResponseItem, json: true}, function(error, response, body){
															claimResponseItem = body;
															if(claimResponseItem.err_code > 0){
																res.json(claimResponseItem);	
															}
														})
														
														dataClaimResponseAdjudicationItem = {
															"adjudication_id": itemAdjudicationId,
															"category" : itemAdjudicationCategory,
															"reason" : itemAdjudicationReason,
															"amount" : itemAdjudicationAmount,
															"value" : itemAdjudicationValue,
															"item_id" : claimResponseItemId
														}
														ApiFHIR.post('claimResponseAdjudication', {"apikey": apikey}, {body: dataClaimResponseAdjudicationItem, json: true}, function(error, response, body){
															claimResponseAdjudication = body;
															if(claimResponseAdjudication.err_code > 0){
																res.json(claimResponseAdjudication);	
															}
														})
														
														dataClaimResponseItemDetail = {
															"detail_id": claimResponseItemDetailId,
															"sequence_link_id" : itemDetailSequenceLinkId,
															"note_number" : itemDetailNoteNumber,
															"item_id" : claimResponseItemId
														}
														ApiFHIR.post('claimResponseItemDetail', {"apikey": apikey}, {body: dataClaimResponseItemDetail, json: true}, function(error, response, body){
															claimResponseItemDetail = body;
															if(claimResponseItemDetail.err_code > 0){
																res.json(claimResponseItemDetail);	
															}
														})
														
														dataClaimResponseAdjudicationItemDetail = {
															"adjudication_id": itemDetailAdjudicationId,
															"category" : itemDetailAdjudicationCategory,
															"reason" : itemDetailAdjudicationReason,
															"amount" : itemDetailAdjudicationAmount,
															"value" : itemDetailAdjudicationValue,
															"detail_id": claimResponseItemDetailId,
														}
														ApiFHIR.post('claimResponseAdjudication', {"apikey": apikey}, {body: dataClaimResponseAdjudicationItemDetail, json: true}, function(error, response, body){
															claimResponseAdjudication = body;
															if(claimResponseAdjudication.err_code > 0){
																res.json(claimResponseAdjudication);	
															}
														})
														
														dataClaimResponseSubDetail = {
															"sub_detail_id": claimResponseItemSubDetailId,
															"sequence_link_id" : itemDetailSubDetailSequenceLinkId,
															"note_number" : itemDetailSubDetailNoteNumber,
															"detail_id": claimResponseItemDetailId,
														}
														ApiFHIR.post('claimResponseSubDetail', {"apikey": apikey}, {body: dataClaimResponseSubDetail, json: true}, function(error, response, body){
															claimResponseSubDetail = body;
															if(claimResponseSubDetail.err_code > 0){
																res.json(claimResponseSubDetail);	
															}
														})
														
														dataClaimResponseAdjudicationItemSubDetail = {
															"adjudication_id": itemDetailSubDetailAdjudicationId,
															"category" : itemDetailSubDetailAdjudicationCategory,
															"reason" : itemDetailSubDetailAdjudicationReason,
															"amount" : itemDetailSubDetailAdjudicationAmount,
															"value" : itemDetailSubDetailAdjudicationValue,
															"sub_detail_id": claimResponseItemSubDetailId,
														}
														ApiFHIR.post('claimResponseAdjudication', {"apikey": apikey}, {body: dataClaimResponseAdjudicationItemSubDetail, json: true}, function(error, response, body){
															claimResponseAdjudication = body;
															if(claimResponseAdjudication.err_code > 0){
																res.json(claimResponseAdjudication);	
															}
														})
														
														
														dataClaimResponseAddItem = {
															"add_item_id" : claimResponseAddItemId,
															"sequence_link_id" : addItemSequenceLinkId,
															"revenue" : addItemRevenue,
															"category" : addItemCategory,
															"service" : addItemService,
															"modifier" : addItemModifier,
															"fee" : addItemFee,
															"note_number" : addItemNoteNumber,
															"claim_response_id" : claimResponseId
														}
														ApiFHIR.post('claimResponseAddItem', {"apikey": apikey}, {body: dataClaimResponseAddItem, json: true}, function(error, response, body){
															claimResponseAddItem = body;
															if(claimResponseAddItem.err_code > 0){
																res.json(claimResponseAddItem);	
															}
														})
														
														dataClaimResponseAdjudicationAddItem = {
															"adjudication_id": addItemAdjudicationId,
															"category" : addItemAdjudicationCategory,
															"reason" : addItemAdjudicationReason,
															"amount" : addItemAdjudicationAmount,
															"value" : addItemAdjudicationValue,
															"add_item_id": claimResponseAddItemId,
														}
														ApiFHIR.post('claimResponseAdjudication', {"apikey": apikey}, {body: dataClaimResponseAdjudicationAddItem, json: true}, function(error, response, body){
															claimResponseAdjudication = body;
															if(claimResponseAdjudication.err_code > 0){
																res.json(claimResponseAdjudication);	
															}
														})
														
														dataClaimResponseAddItemDetail = {
															"add_item_detail_id" : claimResponseAddItemDetailId,
															"revenue" : addItemDetailRevenue,
															"category" : addItemDetailCategory,
															"service" : addItemDetailService,
															"modifier" : addItemDetailModifier,
															"fee" : addItemDetailFee,
															"note_number" : addItemDetailNoteNumber,
															"add_item_id" : claimResponseAddItemId
														}
														ApiFHIR.post('claimResponseAddItemDetail', {"apikey": apikey}, {body: dataClaimResponseAddItemDetail, json: true}, function(error, response, body){
															claimResponseAddItemDetail = body;
															if(claimResponseAddItemDetail.err_code > 0){
																res.json(claimResponseAddItemDetail);	
															}
														})
														
														dataClaimResponseAdjudicationAddItemDetail = {
															"adjudication_id": addItemDetailAdjudicationId,
															"category" : addItemDetailAdjudicationCategory,
															"reason" : addItemDetailAdjudicationReason,
															"amount" : addItemDetailAdjudicationAmount,
															"value" : addItemDetailAdjudicationValue,
															"add_item_detail_id" : claimResponseAddItemDetailId
														}
														ApiFHIR.post('claimResponseAdjudication', {"apikey": apikey}, {body: dataClaimResponseAdjudicationAddItemDetail, json: true}, function(error, response, body){
															claimResponseAdjudication = body;
															if(claimResponseAdjudication.err_code > 0){
																res.json(claimResponseAdjudication);	
															}
														})

														dataClaimResponseError = {
															"error_id" :claimResponseErrorId,
															"sequence_link_id" : errorSequenceLinkId,
															"detail_sequence_link_id" : errorDetailSequenceLinkId,
															"subdetail_sequence_link_id" : errorSubdetailSequenceLinkId,
															"code" : errorCode,
															"claim_response_id" : claimResponseId
														}
														ApiFHIR.post('claimResponseError', {"apikey": apikey}, {body: dataClaimResponseError, json: true}, function(error, response, body){
															claimResponseError = body;
															if(claimResponseError.err_code > 0){
																res.json(claimResponseError);	
															}
														})
														
														dataClaimResponseProcessNote = {
															"process_note_id" : claimResponseProcessNoteId,
															"number" : processNoteNumber,
															"type" : processNoteType,
															"text" : processNoteText,
															"language" :processNoteLanguage,
															"claim_response_id" : claimResponseId
														}
														ApiFHIR.post('claimResponseProcessNote', {"apikey": apikey}, {body: dataClaimResponseProcessNote, json: true}, function(error, response, body){
															claimResponseProcessNote = body;
															if(claimResponseProcessNote.err_code > 0){
																res.json(claimResponseProcessNote);	
															}
														})
														
														dataClaimResponseInsurance = {
															"insurance_id" : claimResponseInsuranceId,
															"sequences" : insuranceSequence,
															"focal" : insuranceFocal,
															"coverage" : insuranceCoverage,
															"business_arrangement" : insuranceBusinessArrangement,
															"pre_auth_ref" : insurancePreAuthRef,
															"claim_response" : insuranceClaimResponse,
															"claim_response_id" : claimResponseId
														}
														ApiFHIR.post('claimResponseInsurance', {"apikey": apikey}, {body: dataClaimResponseInsurance, json: true}, function(error, response, body){
															claimResponseInsurance = body;
															if(claimResponseInsurance.err_code > 0){
																res.json(claimResponseInsurance);	
															}
														})
														
														if(communicationRequest !== ""){
															dataCommunicationRequest = {
																"_id" : communicationRequest,
																"claim_response_id" : claimResponseId
															}
															ApiFHIR.put('communicationRequest', {"apikey": apikey, "_id": communicationRequest}, {body: dataCommunicationRequest, json: true}, function(error, response, body){
																returnCommunicationRequest = body;
																if(returnCommunicationRequest.err_code > 0){
																	res.json(returnCommunicationRequest);	
																	console.log("add reference Communication request : " + communicationRequest);
																}
															});
														}

														
														res.json({"err_code": 0, "err_msg": "Claim Response has been add.", "data": [{"_id": claimResponseId}]});
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

										myEmitter.prependOnceListener('checkPayeeType', function () {
											if (!validator.isEmpty(payeeType)) {
												checkCode(apikey, payeeType, 'PAYEETYPE', function (resPayeeTypeCode) {
													if (resPayeeTypeCode.err_code > 0) {
														myEmitter.emit('checkOutcome');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payee type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOutcome');
											}
										})

										myEmitter.prependOnceListener('checkItemAdjudicationCategory', function () {
											if (!validator.isEmpty(itemAdjudicationCategory)) {
												checkCode(apikey, itemAdjudicationCategory, 'ADJUDICATION', function (resItemAdjudicationCategoryCode) {
													if (resItemAdjudicationCategoryCode.err_code > 0) {
														myEmitter.emit('checkPayeeType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item adjudication category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPayeeType');
											}
										})

										myEmitter.prependOnceListener('checkItemAdjudicationReason', function () {
											if (!validator.isEmpty(itemAdjudicationReason)) {
												checkCode(apikey, itemAdjudicationReason, 'ADJUDICATION_REASON', function (resItemAdjudicationReasonCode) {
													if (resItemAdjudicationReasonCode.err_code > 0) {
														myEmitter.emit('checkItemAdjudicationCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item adjudication reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemAdjudicationCategory');
											}
										})

										myEmitter.prependOnceListener('checkItemDetailAdjudicationCategory', function () {
											if (!validator.isEmpty(itemDetailAdjudicationCategory)) {
												checkCode(apikey, itemDetailAdjudicationCategory, 'ADJUDICATION', function (resItemDetailAdjudicationCategoryCode) {
													if (resItemDetailAdjudicationCategoryCode.err_code > 0) {
														myEmitter.emit('checkItemAdjudicationReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item detail adjudication category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemAdjudicationReason');
											}
										})

										myEmitter.prependOnceListener('checkItemDetailAdjudicationReason', function () {
											if (!validator.isEmpty(itemDetailAdjudicationReason)) {
												checkCode(apikey, itemDetailAdjudicationReason, 'ADJUDICATION_REASON', function (resItemDetailAdjudicationReasonCode) {
													if (resItemDetailAdjudicationReasonCode.err_code > 0) {
														myEmitter.emit('checkItemDetailAdjudicationCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item detail adjudication reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemDetailAdjudicationCategory');
											}
										})

										myEmitter.prependOnceListener('checkItemDetailSubDetailAdjudicationCategory', function () {
											if (!validator.isEmpty(itemDetailSubDetailAdjudicationCategory)) {
												checkCode(apikey, itemDetailSubDetailAdjudicationCategory, 'ADJUDICATION', function (resItemDetailSubDetailAdjudicationCategoryCode) {
													if (resItemDetailSubDetailAdjudicationCategoryCode.err_code > 0) {
														myEmitter.emit('checkItemDetailAdjudicationReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item detail sub detail adjudication category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemDetailAdjudicationReason');
											}
										})

										myEmitter.prependOnceListener('checkItemDetailSubDetailAdjudicationReason', function () {
											if (!validator.isEmpty(itemDetailSubDetailAdjudicationReason)) {
												checkCode(apikey, itemDetailSubDetailAdjudicationReason, 'ADJUDICATION_REASON', function (resItemDetailSubDetailAdjudicationReasonCode) {
													if (resItemDetailSubDetailAdjudicationReasonCode.err_code > 0) {
														myEmitter.emit('checkItemDetailSubDetailAdjudicationCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item detail sub detail adjudication reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemDetailSubDetailAdjudicationCategory');
											}
										})

										myEmitter.prependOnceListener('checkAddItemRevenue', function () {
											if (!validator.isEmpty(addItemRevenue)) {
												checkCode(apikey, addItemRevenue, 'EX_REVENUE_CENTER', function (resAddItemRevenueCode) {
													if (resAddItemRevenueCode.err_code > 0) {
														myEmitter.emit('checkItemDetailSubDetailAdjudicationReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Add item revenue code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemDetailSubDetailAdjudicationReason');
											}
										})

										myEmitter.prependOnceListener('checkAddItemCategory', function () {
											if (!validator.isEmpty(addItemCategory)) {
												checkCode(apikey, addItemCategory, 'BENEFIT_SUBCATEGORY', function (resAddItemCategoryCode) {
													if (resAddItemCategoryCode.err_code > 0) {
														myEmitter.emit('checkAddItemRevenue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Add item category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddItemRevenue');
											}
										})

										myEmitter.prependOnceListener('checkAddItemService', function () {
											if (!validator.isEmpty(addItemService)) {
												checkCode(apikey, addItemService, 'SERVICE_USCLS', function (resAddItemServiceCode) {
													if (resAddItemServiceCode.err_code > 0) {
														myEmitter.emit('checkAddItemCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Add item service code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddItemCategory');
											}
										})

										myEmitter.prependOnceListener('checkAddItemModifier', function () {
											if (!validator.isEmpty(addItemModifier)) {
												checkCode(apikey, addItemModifier, 'CLAIM_MODIFIERS', function (resAddItemModifierCode) {
													if (resAddItemModifierCode.err_code > 0) {
														myEmitter.emit('checkAddItemService');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Add item modifier code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddItemService');
											}
										})

										myEmitter.prependOnceListener('checkAddItemAdjudicationCategory', function () {
											if (!validator.isEmpty(addItemAdjudicationCategory)) {
												checkCode(apikey, addItemAdjudicationCategory, 'ADJUDICATION', function (resAddItemAdjudicationCategoryCode) {
													if (resAddItemAdjudicationCategoryCode.err_code > 0) {
														myEmitter.emit('checkAddItemModifier');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Add item adjudication category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddItemModifier');
											}
										})

										myEmitter.prependOnceListener('checkAddItemAdjudicationReason', function () {
											if (!validator.isEmpty(addItemAdjudicationReason)) {
												checkCode(apikey, addItemAdjudicationReason, 'ADJUDICATION_REASON', function (resAddItemAdjudicationReasonCode) {
													if (resAddItemAdjudicationReasonCode.err_code > 0) {
														myEmitter.emit('checkAddItemAdjudicationCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Add item adjudication reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddItemAdjudicationCategory');
											}
										})

										myEmitter.prependOnceListener('checkAddItemDetailRevenue', function () {
											if (!validator.isEmpty(addItemDetailRevenue)) {
												checkCode(apikey, addItemDetailRevenue, 'EX_REVENUE_CENTER', function (resAddItemDetailRevenueCode) {
													if (resAddItemDetailRevenueCode.err_code > 0) {
														myEmitter.emit('checkAddItemAdjudicationReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Add item detail revenue code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddItemAdjudicationReason');
											}
										})

										myEmitter.prependOnceListener('checkAddItemDetailCategory', function () {
											if (!validator.isEmpty(addItemDetailCategory)) {
												checkCode(apikey, addItemDetailCategory, 'BENEFIT_SUBCATEGORY', function (resAddItemDetailCategoryCode) {
													if (resAddItemDetailCategoryCode.err_code > 0) {
														myEmitter.emit('checkAddItemDetailRevenue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Add item detail category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddItemDetailRevenue');
											}
										})

										myEmitter.prependOnceListener('checkAddItemDetailService', function () {
											if (!validator.isEmpty(addItemDetailService)) {
												checkCode(apikey, addItemDetailService, 'SERVICE_USCLS', function (resAddItemDetailServiceCode) {
													if (resAddItemDetailServiceCode.err_code > 0) {
														myEmitter.emit('checkAddItemDetailCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Add item detail service code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddItemDetailCategory');
											}
										})

										myEmitter.prependOnceListener('checkAddItemDetailModifier', function () {
											if (!validator.isEmpty(addItemDetailModifier)) {
												checkCode(apikey, addItemDetailModifier, 'CLAIM_MODIFIERS', function (resAddItemDetailModifierCode) {
													if (resAddItemDetailModifierCode.err_code > 0) {
														myEmitter.emit('checkAddItemDetailService');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Add item detail modifier code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddItemDetailService');
											}
										})

										myEmitter.prependOnceListener('checkAddItemDetailAdjudicationCategory', function () {
											if (!validator.isEmpty(addItemDetailAdjudicationCategory)) {
												checkCode(apikey, addItemDetailAdjudicationCategory, 'ADJUDICATION', function (resAddItemDetailAdjudicationCategoryCode) {
													if (resAddItemDetailAdjudicationCategoryCode.err_code > 0) {
														myEmitter.emit('checkAddItemDetailModifier');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Add item detail adjudication category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddItemDetailModifier');
											}
										})

										myEmitter.prependOnceListener('checkAddItemDetailAdjudicationReason', function () {
											if (!validator.isEmpty(addItemDetailAdjudicationReason)) {
												checkCode(apikey, addItemDetailAdjudicationReason, 'ADJUDICATION_REASON', function (resAddItemDetailAdjudicationReasonCode) {
													if (resAddItemDetailAdjudicationReasonCode.err_code > 0) {
														myEmitter.emit('checkAddItemDetailAdjudicationCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Add item detail adjudication reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddItemDetailAdjudicationCategory');
											}
										})

										myEmitter.prependOnceListener('checkErrorCode', function () {
											if (!validator.isEmpty(errorCode)) {
												checkCode(apikey, errorCode, 'ADJUDICATION_ERROR', function (resErrorCodeCode) {
													if (resErrorCodeCode.err_code > 0) {
														myEmitter.emit('checkAddItemDetailAdjudicationReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Error code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddItemDetailAdjudicationReason');
											}
										})

										myEmitter.prependOnceListener('checkPaymentType', function () {
											if (!validator.isEmpty(paymentType)) {
												checkCode(apikey, paymentType, 'EX_PAYMENTTYPE', function (resPaymentTypeCode) {
													if (resPaymentTypeCode.err_code > 0) {
														myEmitter.emit('checkErrorCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payment type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkErrorCode');
											}
										})

										myEmitter.prependOnceListener('checkPaymentAdjustmentReason', function () {
											if (!validator.isEmpty(paymentAdjustmentReason)) {
												checkCode(apikey, paymentAdjustmentReason, 'PAYMENT_ADJUSTMENT_REASON', function (resPaymentAdjustmentReasonCode) {
													if (resPaymentAdjustmentReasonCode.err_code > 0) {
														myEmitter.emit('checkPaymentType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payment adjustment reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPaymentType');
											}
										})

										myEmitter.prependOnceListener('checkPaymentIdentifierUse', function () {
											if (!validator.isEmpty(paymentIdentifierUse)) {
												checkCode(apikey, paymentIdentifierUse, 'IDENTIFIER_USE', function (resPaymentIdentifierUseCode) {
													if (resPaymentIdentifierUseCode.err_code > 0) {
														myEmitter.emit('checkPaymentAdjustmentReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payment identifier use code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPaymentAdjustmentReason');
											}
										})

										myEmitter.prependOnceListener('checkPaymentIdentifierType', function () {
											if (!validator.isEmpty(paymentIdentifierType)) {
												checkCode(apikey, paymentIdentifierType, 'IDENTIFIER_TYPE', function (resPaymentIdentifierTypeCode) {
													if (resPaymentIdentifierTypeCode.err_code > 0) {
														myEmitter.emit('checkPaymentIdentifierUse');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payment identifier type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPaymentIdentifierUse');
											}
										})

										myEmitter.prependOnceListener('checkReserved', function () {
											if (!validator.isEmpty(reserved)) {
												checkCode(apikey, reserved, 'FUNDSRESERVE', function (resReservedCode) {
													if (resReservedCode.err_code > 0) {
														myEmitter.emit('checkPaymentIdentifierType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Reserved code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPaymentIdentifierType');
											}
										})

										myEmitter.prependOnceListener('checkForm', function () {
											if (!validator.isEmpty(form)) {
												checkCode(apikey, form, 'FORMS', function (resFormCode) {
													if (resFormCode.err_code > 0) {
														myEmitter.emit('checkReserved');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Form code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReserved');
											}
										})

										myEmitter.prependOnceListener('checkProcessNoteType', function () {
											if (!validator.isEmpty(processNoteType)) {
												checkCode(apikey, processNoteType, 'NOTE_TYPE', function (resProcessNoteTypeCode) {
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

										myEmitter.prependOnceListener('checkProcessNoteLanguage', function () {
											if (!validator.isEmpty(processNoteLanguage)) {
												checkCode(apikey, processNoteLanguage, 'LANGUAGES', function (resProcessNoteLanguageCode) {
													if (resProcessNoteLanguageCode.err_code > 0) {
														myEmitter.emit('checkProcessNoteType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Process note language code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkProcessNoteType');
											}
										})
										
										/*checkvalue*/
										myEmitter.prependOnceListener('checkPatient', function () {
											if (!validator.isEmpty(patient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
													if (resPatient.err_code > 0) {
														myEmitter.emit('checkProcessNoteLanguage');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkProcessNoteLanguage');
											}
										})

										myEmitter.prependOnceListener('checkInsurer', function () {
											if (!validator.isEmpty(insurer)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + insurer, 'ORGANIZATION', function (resInsurer) {
													if (resInsurer.err_code > 0) {
														myEmitter.emit('checkPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurer id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPatient');
											}
										})

										myEmitter.prependOnceListener('checkRequestProvider', function () {
											if (!validator.isEmpty(requestProvider)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + requestProvider, 'PRACTITIONER', function (resRequestProvider) {
													if (resRequestProvider.err_code > 0) {
														myEmitter.emit('checkInsurer');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Request provider id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInsurer');
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

										myEmitter.prependOnceListener('checkRequest', function () {
											if (!validator.isEmpty(request)) {
												checkUniqeValue(apikey, "CLAIM_ID|" + request, 'CLAIM', function (resRequest) {
													if (resRequest.err_code > 0) {
														myEmitter.emit('checkRequestOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequestOrganization');
											}
										})

										myEmitter.prependOnceListener('checkCommunicationRequest', function () {
											if (!validator.isEmpty(communicationRequest)) {
												checkUniqeValue(apikey, "COMMUNICATION_REQUEST_ID|" + communicationRequest, 'COMMUNICATION_REQUEST', function (resCommunicationRequest) {
													if (resCommunicationRequest.err_code > 0) {
														myEmitter.emit('checkRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Communication request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRequest');
											}
										})

										myEmitter.prependOnceListener('checkInsuranceCoverage', function () {
											if (!validator.isEmpty(insuranceCoverage)) {
												checkUniqeValue(apikey, "COVERAGE_ID|" + insuranceCoverage, 'COVERAGE', function (resInsuranceCoverage) {
													if (resInsuranceCoverage.err_code > 0) {
														myEmitter.emit('checkCommunicationRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurance coverage id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCommunicationRequest');
											}
										})

										myEmitter.prependOnceListener('checkInsuranceClaimResponse', function () {
											if (!validator.isEmpty(insuranceClaimResponse)) {
												checkUniqeValue(apikey, "CLAIM_RESPONSE_ID|" + insuranceClaimResponse, 'CLAIM_RESPONSE', function (resInsuranceClaimResponse) {
													if (resInsuranceClaimResponse.err_code > 0) {
														myEmitter.emit('checkInsuranceCoverage');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurance claim response id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInsuranceCoverage');
											}
										})

										if (!validator.isEmpty(paymentIdentifierValue)) {
											checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + paymentIdentifierValue, 'IDENTIFIER', function (resPaymentIdentifierValue) {
												if (resPaymentIdentifierValue.err_code > 0) {
													myEmitter.emit('checkInsuranceClaimResponse');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Payment identifier value id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkInsuranceClaimResponse');
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
      var claimResponseId = req.params.claim_response_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof claimResponseId !== 'undefined') {
        if (validator.isEmpty(claimResponseId)) {
          err_code = 2;
          err_msg = "Claim Response id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Claim Response id is required";
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
                        checkUniqeValue(apikey, "CLAIM_RESPONSE_ID|" + claimResponseId, 'CLAIM_RESPONSE', function (resEncounterID) {
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
                              "claim_response_id": claimResponseId
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
                                  "err_msg": "Identifier has been add in this Claim Response.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
                              }
                            })
                          } else {
                            res.json({
                              "err_code": 503,
                              "err_msg": "Claim Response Id not found"
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
	},
	put:{
		claimResponse: function updateClaimResponse(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var claimResponseId = req.params.claim_response_id;
			
			var err_code = 0;
      var err_msg = "";
      var dataClaimResponse = {};
			
			if (typeof claimResponseId !== 'undefined') {
        if (validator.isEmpty(claimResponseId)) {
          err_code = 2;
          err_msg = "Claim Response Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Claim Response Id is required.";
      }
			
			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					dataClaimResponse.status = "";
				}else{
					dataClaimResponse.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					dataClaimResponse.patient = "";
				}else{
					dataClaimResponse.patient = patient;
				}
			}else{
			  patient = "";
			}

			if(typeof req.body.created !== 'undefined' && req.body.created !== ""){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					err_code = 2;
					err_msg = "claim response created is required.";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "claim response created invalid date format.";	
					}else{
						dataClaimResponse.created = created;
					}
				}
			}else{
			  created = "";
			}

			if(typeof req.body.insurer !== 'undefined' && req.body.insurer !== ""){
				var insurer =  req.body.insurer.trim().toLowerCase();
				if(validator.isEmpty(insurer)){
					dataClaimResponse.insurer = "";
				}else{
					dataClaimResponse.insurer = insurer;
				}
			}else{
			  insurer = "";
			}

			if(typeof req.body.requestProvider !== 'undefined' && req.body.requestProvider !== ""){
				var requestProvider =  req.body.requestProvider.trim().toLowerCase();
				if(validator.isEmpty(requestProvider)){
					dataClaimResponse.request_provider = "";
				}else{
					dataClaimResponse.request_provider = requestProvider;
				}
			}else{
			  requestProvider = "";
			}

			if(typeof req.body.requestOrganization !== 'undefined' && req.body.requestOrganization !== ""){
				var requestOrganization =  req.body.requestOrganization.trim().toLowerCase();
				if(validator.isEmpty(requestOrganization)){
					dataClaimResponse.request_organization = "";
				}else{
					dataClaimResponse.request_organization = requestOrganization;
				}
			}else{
			  requestOrganization = "";
			}

			if(typeof req.body.request !== 'undefined' && req.body.request !== ""){
				var request =  req.body.request.trim().toLowerCase();
				if(validator.isEmpty(request)){
					dataClaimResponse.request = "";
				}else{
					dataClaimResponse.request = request;
				}
			}else{
			  request = "";
			}

			if(typeof req.body.outcome !== 'undefined' && req.body.outcome !== ""){
				var outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					dataClaimResponse.outcome = "";
				}else{
					dataClaimResponse.outcome = outcome;
				}
			}else{
			  outcome = "";
			}

			if(typeof req.body.disposition !== 'undefined' && req.body.disposition !== ""){
				var disposition =  req.body.disposition.trim().toLowerCase();
				if(validator.isEmpty(disposition)){
					dataClaimResponse.disposition = "";
				}else{
					dataClaimResponse.disposition = disposition;
				}
			}else{
			  disposition = "";
			}

			if(typeof req.body.payeeType !== 'undefined' && req.body.payeeType !== ""){
				var payeeType =  req.body.payeeType.trim().toLowerCase();
				if(validator.isEmpty(payeeType)){
					dataClaimResponse.payee_type = "";
				}else{
					dataClaimResponse.payee_type = payeeType;
				}
			}else{
			  payeeType = "";
			}

			if(typeof req.body.totalCost !== 'undefined' && req.body.totalCost !== ""){
				var totalCost =  req.body.totalCost.trim().toLowerCase();
				if(validator.isEmpty(totalCost)){
					dataClaimResponse.total_cost = "";
				}else{
					dataClaimResponse.total_cost = totalCost;
				}
			}else{
			  totalCost = "";
			}

			if(typeof req.body.unallocDeductable !== 'undefined' && req.body.unallocDeductable !== ""){
				var unallocDeductable =  req.body.unallocDeductable.trim().toLowerCase();
				if(validator.isEmpty(unallocDeductable)){
					dataClaimResponse.unalloc_deductable = "";
				}else{
					dataClaimResponse.unalloc_deductable = unallocDeductable;
				}
			}else{
			  unallocDeductable = "";
			}

			if(typeof req.body.totalBenefit !== 'undefined' && req.body.totalBenefit !== ""){
				var totalBenefit =  req.body.totalBenefit.trim().toLowerCase();
				if(validator.isEmpty(totalBenefit)){
					dataClaimResponse.total_benefit = "";
				}else{
					dataClaimResponse.total_benefit = totalBenefit;
				}
			}else{
			  totalBenefit = "";
			}

			if(typeof req.body.payment.type !== 'undefined' && req.body.payment.type !== ""){
				var paymentType =  req.body.payment.type.trim().toLowerCase();
				if(validator.isEmpty(paymentType)){
					dataClaimResponse.payment_type = "";
				}else{
					dataClaimResponse.payment_type = paymentType;
				}
			}else{
			  payment.type = "";
			}

			if(typeof req.body.payment.adjustment !== 'undefined' && req.body.payment.adjustment !== ""){
				var paymentAdjustment =  req.body.payment.adjustment.trim().toLowerCase();
				if(validator.isEmpty(paymentAdjustment)){
					dataClaimResponse.payment_adjustment = "";
				}else{
					dataClaimResponse.payment_adjustment = paymentAdjustment;
				}
			}else{
			  paymentAdjustment = "";
			}

			if(typeof req.body.payment.adjustmentReason !== 'undefined' && req.body.payment.adjustmentReason !== ""){
				var paymentAdjustmentReason =  req.body.payment.adjustmentReason.trim().toLowerCase();
				if(validator.isEmpty(paymentAdjustmentReason)){
					dataClaimResponse.payment_adjustment_reason = "";
				}else{
					dataClaimResponse.payment_adjustment_reason = paymentAdjustmentReason;
				}
			}else{
			  paymentAdjustmentReason = "";
			}

			if(typeof req.body.payment.date !== 'undefined' && req.body.payment.date !== ""){
				var paymentDate =  req.body.payment.date;
				if(validator.isEmpty(paymentDate)){
					err_code = 2;
					err_msg = "claim response payment date is required.";
				}else{
					if(!regex.test(paymentDate)){
						err_code = 2;
						err_msg = "claim response payment date invalid date format.";	
					}else{
						dataClaimResponse.payment_date = paymentDate;
					}
				}
			}else{
			  paymentDate = "";
			}

			if(typeof req.body.payment.amount !== 'undefined' && req.body.payment.amount !== ""){
				var paymentAmount =  req.body.payment.amount.trim().toLowerCase();
				if(validator.isEmpty(paymentAmount)){
					dataClaimResponse.payment_amount = "";
				}else{
					dataClaimResponse.payment_amount = paymentAmount;
				}
			}else{
			  paymentAmount = "";
			}

			/*if(typeof req.body.payment.identifier.use !== 'undefined' && req.body.payment.identifier.use !== ""){
				var paymentIdentifierUse =  req.body.payment.identifier.use.trim().toLowerCase();
				if(validator.isEmpty(paymentIdentifierUse)){
					err_code = 2;
					err_msg = "claim response payment identifier use is required.";
				}else{
					dataClaimResponse.use = paymentIdentifierUse;
				}
			}else{
			  paymentIdentifierUse = "";
			}

			if(typeof req.body.payment.identifier.type !== 'undefined' && req.body.payment.identifier.type !== ""){
				var paymentIdentifierType =  req.body.payment.identifier.type.trim().toLowerCase();
				if(validator.isEmpty(paymentIdentifierType)){
					err_code = 2;
					err_msg = "claim response payment identifier type is required.";
				}else{
					dataClaimResponse.type = paymentIdentifierType;
				}
			}else{
			  paymentIdentifierType = "";
			}

			if(typeof req.body.payment.identifier.value !== 'undefined' && req.body.payment.identifier.value !== ""){
				var paymentIdentifierValue =  req.body.payment.identifier.value.trim().toLowerCase();
				if(validator.isEmpty(paymentIdentifierValue)){
					err_code = 2;
					err_msg = "claim response payment identifier value is required.";
				}else{
					dataClaimResponse.value = paymentIdentifierValue;
				}
			}else{
			  paymentIdentifierValue = "";
			}

			if (typeof req.body.payment.identifier.period !== 'undefined' && req.body.payment.identifier.period !== "") {
			  var paymentIdentifierPeriod = req.body.payment.identifier.period;
			  if (paymentIdentifierPeriod.indexOf("to") > 0) {
			    arrPaymentIdentifierPeriod = paymentIdentifierPeriod.split("to");
			    dataClaimResponse.period_start = arrPaymentIdentifierPeriod[0];
			    dataClaimResponse.period_end = arrPaymentIdentifierPeriod[1];
			    if (!regex.test(paymentIdentifierPeriodStart) && !regex.test(paymentIdentifierPeriodEnd)) {
			      err_code = 2;
			      err_msg = "claim response payment identifier period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "claim response payment identifier period invalid date format.";
				}
			} else {
			  paymentIdentifierPeriod = "";
			}*/

			if(typeof req.body.reserved !== 'undefined' && req.body.reserved !== ""){
				var reserved =  req.body.reserved.trim().toLowerCase();
				if(validator.isEmpty(reserved)){
					dataClaimResponse.reserved = "";
				}else{
					dataClaimResponse.reserved = reserved;
				}
			}else{
			  reserved = "";
			}

			if(typeof req.body.form !== 'undefined' && req.body.form !== ""){
				var form =  req.body.form.trim().toLowerCase();
				if(validator.isEmpty(form)){
					dataClaimResponse.form = "";
				}else{
					dataClaimResponse.form = form;
				}
			}else{
			  form = "";
			}

			/*if(typeof req.body.communicationRequest !== 'undefined' && req.body.communicationRequest !== ""){
				var communicationRequest =  req.body.communicationRequest.trim().toLowerCase();
				if(validator.isEmpty(communicationRequest)){
					dataClaimResponse.communication_request = "";
				}else{
					dataClaimResponse.communication_request = communicationRequest;
				}
			}else{
			  communicationRequest = "";
			}*/
			
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "CLAIM_RESPONSE_ID|" + claimResponseId, 'CLAIM_RESPONSE', function (resClaimResponseId) {
								if (resClaimResponseId.err_code > 0) {
									ApiFHIR.put('bodysite', {
										"apikey": apikey,
										"_id": claimResponseId
									}, {
										body: dataClaimResponse,
										json: true
									}, function (error, response, body) {
										claimResponse = body;
										if (claimResponse.err_code > 0) {
											res.json(claimResponse);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "Claim Response has been updated.",
												"data": claimResponse.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 404,
										"err_msg": "Claim Response Id not found"
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

						myEmitter.prependOnceListener('checkPayeeType', function () {
							if (!validator.isEmpty(payeeType)) {
								checkCode(apikey, payeeType, 'PAYEETYPE', function (resPayeeTypeCode) {
									if (resPayeeTypeCode.err_code > 0) {
										myEmitter.emit('checkOutcome');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Payee type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkOutcome');
							}
						})

						myEmitter.prependOnceListener('checkPaymentType', function () {
							if (!validator.isEmpty(paymentType)) {
								checkCode(apikey, paymentType, 'EX_PAYMENTTYPE', function (resPaymentTypeCode) {
									if (resPaymentTypeCode.err_code > 0) {
										myEmitter.emit('checkPayeeType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Payment type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPayeeType');
							}
						})

						myEmitter.prependOnceListener('checkPaymentAdjustmentReason', function () {
							if (!validator.isEmpty(paymentAdjustmentReason)) {
								checkCode(apikey, paymentAdjustmentReason, 'PAYMENT_ADJUSTMENT_REASON', function (resPaymentAdjustmentReasonCode) {
									if (resPaymentAdjustmentReasonCode.err_code > 0) {
										myEmitter.emit('checkPaymentType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Payment adjustment reason code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPaymentType');
							}
						})

						myEmitter.prependOnceListener('checkReserved', function () {
							if (!validator.isEmpty(reserved)) {
								checkCode(apikey, reserved, 'FUNDSRESERVE', function (resReservedCode) {
									if (resReservedCode.err_code > 0) {
										myEmitter.emit('checkPaymentAdjustmentReason');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Reserved code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPaymentAdjustmentReason');
							}
						})

						myEmitter.prependOnceListener('checkForm', function () {
							if (!validator.isEmpty(form)) {
								checkCode(apikey, form, 'FORMS', function (resFormCode) {
									if (resFormCode.err_code > 0) {
										myEmitter.emit('checkReserved');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Form code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkReserved');
							}
						})

						/*checkvalue*/
						myEmitter.prependOnceListener('checkPatient', function () {
							if (!validator.isEmpty(patient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
									if (resPatient.err_code > 0) {
										myEmitter.emit('checkProcessNoteLanguage');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkProcessNoteLanguage');
							}
						})

						myEmitter.prependOnceListener('checkInsurer', function () {
							if (!validator.isEmpty(insurer)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + insurer, 'ORGANIZATION', function (resInsurer) {
									if (resInsurer.err_code > 0) {
										myEmitter.emit('checkPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurer id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPatient');
							}
						})

						myEmitter.prependOnceListener('checkRequestProvider', function () {
							if (!validator.isEmpty(requestProvider)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + requestProvider, 'PRACTITIONER', function (resRequestProvider) {
									if (resRequestProvider.err_code > 0) {
										myEmitter.emit('checkInsurer');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Request provider id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInsurer');
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

						if (!validator.isEmpty(request)) {
							checkUniqeValue(apikey, "CLAIM_ID|" + request, 'CLAIM', function (resRequest) {
								if (resRequest.err_code > 0) {
									myEmitter.emit('checkRequestOrganization');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Request id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRequestOrganization');
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
      var claimResponseId = req.params.claim_response_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof claimResponseId !== 'undefined') {
        if (validator.isEmpty(claimResponseId)) {
          err_code = 2;
          err_msg = "Claim Response id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Claim Response id is required";
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
            myEmitter.once('checkClaimResponseId', function () {
              checkUniqeValue(apikey, "CLAIM_RESPONSE_ID|" + claimResponseId, 'CLAIM_RESPONSE', function (resClaimResponseId) {
                if (resClaimResponseId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "CLAIM_RESPONSE_ID|" + claimResponseId
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
                            "err_msg": "Identifier has been update in this Claim Response.",
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
                    "err_msg": "Claim Response Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkClaimResponseId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkClaimResponseId');
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
		identifierPayment: function updateIdentifierPayment(req, res) {
      var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
      var claimResponseId = req.params.claim_response_payment_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof claimResponseId !== 'undefined') {
        if (validator.isEmpty(claimResponseId)) {
          err_code = 2;
          err_msg = "Claim Response id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Claim Response id is required";
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
            myEmitter.once('checkClaimResponseId', function () {
              checkUniqeValue(apikey, "CLAIM_RESPONSE_ID|" + claimResponseId, 'CLAIM_RESPONSE', function (resClaimResponseId) {
                if (resClaimResponseId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "claim_response_payment_id|" + claimResponseId
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
                            "err_msg": "Identifier has been update in this Claim Response.",
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
                    "err_msg": "Claim Response Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkClaimResponseId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkClaimResponseId');
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
		claimResponseItem: function updateClaimResponseItem(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseId = req.params.claim_response_id;
			var claimResponseItemId = req.params.claim_response_item_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaimResponse = {};
			//input check 
			if(typeof claimResponseId !== 'undefined'){
				if(validator.isEmpty(claimResponseId)){
					err_code = 2;
					err_msg = "Claim Response id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response id is required";
			}

			if(typeof claimResponseItemId !== 'undefined'){
				if(validator.isEmpty(claimResponseItemId)){
					err_code = 2;
					err_msg = "Claim Response Item id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Item id is required";
			}
			
			if(typeof req.body.sequenceLinkId !== 'undefined' && req.body.sequenceLinkId !== ""){
				var itemSequenceLinkId =  req.body.sequenceLinkId.trim();
				if(validator.isEmpty(itemSequenceLinkId)){
					err_code = 2;
					err_msg = "claim response item sequence link id is required.";
				}else{
					if(!validator.isInt(itemSequenceLinkId)){
						err_code = 2;
						err_msg = "claim response item sequence link id is must be number.";
					}else{
						dataClaimResponse.sequence_link_id = itemSequenceLinkId;
					}
				}
			}else{
			  itemSequenceLinkId = "";
			}

			if(typeof req.body.noteNumber !== 'undefined' && req.body.noteNumber !== ""){
				var itemNoteNumber =  req.body.noteNumber.trim();
				if(validator.isEmpty(itemNoteNumber)){
					dataClaimResponse.note_number = "";
				}else{
					if(!validator.isInt(itemNoteNumber)){
						err_code = 2;
						err_msg = "claim response item note number is must be number.";
					}else{
						dataClaimResponse.note_number = itemNoteNumber;
					}
				}
			}else{
			  itemNoteNumber = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimResponseID', function(){
							checkUniqeValue(apikey, "CLAIM_RESPONSE_ID|" + claimResponseId, 'CLAIM_RESPONSE', function(resClaimResponseId){
								if(resClaimResponseId.err_code > 0){
									checkUniqeValue(apikey, "ITEM_ID|" + claimResponseItemId, 'CLAIM_RESPONSE_ITEM', function(resClaimResponseItemID){
										if(resClaimResponseItemID.err_code > 0){
											ApiFHIR.put('claimResponseItem', {"apikey": apikey, "_id": claimResponseItemId, "dr": "CLAIM_RESPONSE_ID|"+claimResponseId}, {body: dataClaimResponse, json: true}, function(error, response, body){
												claimResponseItem = body;
												if(claimResponseItem.err_code > 0){
													res.json(claimResponseItem);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim Response item has been update in this Claim Response.", "data": claimResponseItem.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim Response item Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Response Id not found"});		
								}
							})
						})
						
						myEmitter.emit('checkClaimResponseID');
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
		claimResponseAdjudicationItem: function updateClaimResponseAdjudicationItem(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseItemId = req.params.claim_response_item_id;
			var claimResponseAdjudicationId = req.params.claim_response_adjudication_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaimResponse = {};
			//input check 
			if(typeof claimResponseItemId !== 'undefined'){
				if(validator.isEmpty(claimResponseItemId)){
					err_code = 2;
					err_msg = "Claim Response Item id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Item id is required";
			}

			if(typeof claimResponseAdjudicationId !== 'undefined'){
				if(validator.isEmpty(claimResponseAdjudicationId)){
					err_code = 2;
					err_msg = "Claim Response Adjudication id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Adjudication id is required";
			}
			
			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var itemAdjudicationCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(itemAdjudicationCategory)){
					err_code = 2;
					err_msg = "claim response item adjudication category is required.";
				}else{
					dataClaimResponse.category = itemAdjudicationCategory;
				}
			}else{
			  itemAdjudicationCategory = "";
			}

			if(typeof req.body.reason !== 'undefined' && req.body.reason !== ""){
				var itemAdjudicationReason =  req.body.reason.trim().toLowerCase();
				if(validator.isEmpty(itemAdjudicationReason)){
					dataClaimResponse.reason = "";
				}else{
					dataClaimResponse.reason = itemAdjudicationReason;
				}
			}else{
			  itemAdjudicationReason = "";
			}

			if(typeof req.body.amount !== 'undefined' && req.body.amount !== ""){
				var itemAdjudicationAmount =  req.body.amount.trim().toLowerCase();
				if(validator.isEmpty(itemAdjudicationAmount)){
					dataClaimResponse.amount = "";
				}else{
					dataClaimResponse.amount = itemAdjudicationAmount;
				}
			}else{
			  itemAdjudicationAmount = "";
			}

			if(typeof req.body.value !== 'undefined' && req.body.value !== ""){
				var itemAdjudicationValue =  req.body.value.trim();
				if(validator.isEmpty(itemAdjudicationValue)){
					dataClaimResponse.value = "";
				}else{
					if(!validator.isInt(itemAdjudicationValue)){
						err_code = 2;
						err_msg = "claim response item adjudication value is must be number.";
					}else{
						dataClaimResponse.value = itemAdjudicationValue;
					}
				}
			}else{
			  itemAdjudicationValue = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimResponseID', function(){
							checkUniqeValue(apikey, "ITEM_ID|" + claimResponseItemId, 'CLAIM_RESPONSE_ITEM', function(resClaimResponseId){
								if(resClaimResponseId.err_code > 0){
									checkUniqeValue(apikey, "ADJUDICATION_ID|" + claimResponseAdjudicationId, 'CLAIM_RESPONSE_ADJUDICATION', function(resClaimResponseAdjudicationID){
										if(resClaimResponseAdjudicationID.err_code > 0){
											ApiFHIR.put('claimResponseAdjudication', {"apikey": apikey, "_id": claimResponseAdjudicationId, "dr": "ITEM_ID|"+claimResponseItemId}, {body: dataClaimResponse, json: true}, function(error, response, body){
												claimResponseAdjudication = body;
												if(claimResponseAdjudication.err_code > 0){
													res.json(claimResponseAdjudication);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim Response Adjudication Item has been update in this Claim Response.", "data": claimResponseAdjudication.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim Response adjudication Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Response Item Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkItemAdjudicationCategory', function () {
							if (!validator.isEmpty(itemAdjudicationCategory)) {
								checkCode(apikey, itemAdjudicationCategory, 'ADJUDICATION', function (resItemAdjudicationCategoryCode) {
									if (resItemAdjudicationCategoryCode.err_code > 0) {
										myEmitter.emit('checkClaimResponseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item adjudication category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimResponseID');
							}
						})

						if (!validator.isEmpty(itemAdjudicationReason)) {
							checkCode(apikey, itemAdjudicationReason, 'ADJUDICATION_REASON', function (resItemAdjudicationReasonCode) {
								if (resItemAdjudicationReasonCode.err_code > 0) {
									myEmitter.emit('checkItemAdjudicationCategory');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Item adjudication reason code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkItemAdjudicationCategory');
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
		claimResponseItemDetail: function updateClaimResponseItemDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseItemId = req.params.claim_response_item_id;
			var claimResponseItemDetailId = req.params.claim_response_item_detail_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaimResponse = {};
			//input check 
			if(typeof claimResponseItemId !== 'undefined'){
				if(validator.isEmpty(claimResponseItemId)){
					err_code = 2;
					err_msg = "Claim Response Item id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Item id is required";
			}
			
			if(typeof claimResponseItemDetailId !== 'undefined'){
				if(validator.isEmpty(claimResponseItemDetailId)){
					err_code = 2;
					err_msg = "Claim Response Item Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Item Detail id is required";
			}
			
			if(typeof req.body.sequenceLinkId !== 'undefined' && req.body.sequenceLinkId !== ""){
				var itemDetailSequenceLinkId =  req.body.sequenceLinkId.trim();
				if(validator.isEmpty(itemDetailSequenceLinkId)){
					err_code = 2;
					err_msg = "claim response item detail sequence link id is required.";
				}else{
					if(!validator.isInt(itemDetailSequenceLinkId)){
						err_code = 2;
						err_msg = "claim response item detail sequence link id is must be number.";
					}else{
						dataClaimResponse.sequence_link_id = itemDetailSequenceLinkId;
					}
				}
			}else{
			  itemDetailSequenceLinkId = "";
			}

			if(typeof req.body.noteNumber !== 'undefined' && req.body.noteNumber !== ""){
				var itemDetailNoteNumber =  req.body.noteNumber.trim();
				if(validator.isEmpty(itemDetailNoteNumber)){
					dataClaimResponse.note_number = "";
				}else{
					if(!validator.isInt(itemDetailNoteNumber)){
						err_code = 2;
						err_msg = "claim response item detail note number is must be number.";
					}else{
						dataClaimResponse.note_number = itemDetailNoteNumber;
					}
				}
			}else{
			  itemDetailNoteNumber = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimResponseID', function(){
							checkUniqeValue(apikey, "ITEM_ID|" + claimResponseItemId, 'CLAIM_RESPONSE_ITEM', function(resClaimResponseItemID){
								if(resClaimResponseItemID.err_code > 0){
									checkUniqeValue(apikey, "DETAIL_ID|" + claimResponseItemDetailId, 'CLAIM_RESPONSE_ITEM_DETAIL', function(resClaimResponseItemDetailID){
										if(resClaimResponseItemDetailID.err_code > 0){
											ApiFHIR.put('claimResponseItem', {"apikey": apikey, "_id": claimResponseItemDetailId, "dr": "ITEM_ID|"+claimResponseItemId}, {body: dataClaimResponse, json: true}, function(error, response, body){
												claimResponseItemDetail = body;
												if(claimResponseItemDetail.err_code > 0){
													res.json(claimResponseItemDetail);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim Response item detail has been update in this Claim Response.", "data": claimResponseItemDetail.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim Response item detail Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Response Item Id not found"});		
								}
							})
						})
						
						myEmitter.emit('checkClaimResponseID');
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
		claimResponseAdjudicationDetal: function updateClaimResponseAdjudicationDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseItemDetailId = req.params.claim_response_item_detail_id;
			var claimResponseAdjudicationId = req.params.claim_response_adjudication_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaimResponse = {};
			//input check 
			if(typeof claimResponseItemDetailId !== 'undefined'){
				if(validator.isEmpty(claimResponseItemDetailId)){
					err_code = 2;
					err_msg = "Claim Response Item Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Item Detail id is required";
			}

			if(typeof claimResponseAdjudicationId !== 'undefined'){
				if(validator.isEmpty(claimResponseAdjudicationId)){
					err_code = 2;
					err_msg = "Claim Response Adjudication id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Adjudication id is required";
			}
			
			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var itemDetailAdjudicationCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(itemDetailAdjudicationCategory)){
					err_code = 2;
					err_msg = "claim response item detail adjudication category is required.";
				}else{
					dataClaimResponse.category = itemDetailAdjudicationCategory;
				}
			}else{
			  itemDetailAdjudicationCategory = "";
			}

			if(typeof req.body.reason !== 'undefined' && req.body.reason !== ""){
				var itemDetailAdjudicationReason =  req.body.reason.trim().toLowerCase();
				if(validator.isEmpty(itemDetailAdjudicationReason)){
					dataClaimResponse.reason = "";
				}else{
					dataClaimResponse.reason = itemDetailAdjudicationReason;
				}
			}else{
			  itemDetailAdjudicationReason = "";
			}

			if(typeof req.body.amount !== 'undefined' && req.body.amount !== ""){
				var itemDetailAdjudicationAmount =  req.body.amount.trim().toLowerCase();
				if(validator.isEmpty(itemDetailAdjudicationAmount)){
					dataClaimResponse.amount = "";
				}else{
					dataClaimResponse.amount = itemDetailAdjudicationAmount;
				}
			}else{
			  itemDetailAdjudicationAmount = "";
			}

			if(typeof req.body.value !== 'undefined' && req.body.value !== ""){
				var itemDetailAdjudicationValue =  req.body.value.trim();
				if(validator.isEmpty(itemDetailAdjudicationValue)){
					dataClaimResponse.value = "";
				}else{
					if(!validator.isInt(itemDetailAdjudicationValue)){
						err_code = 2;
						err_msg = "claim response item detail adjudication value is must be number.";
					}else{
						dataClaimResponse.value = itemDetailAdjudicationValue;
					}
				}
			}else{
			  itemDetailAdjudicationValue = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimResponseID', function(){
							checkUniqeValue(apikey, "DETAIL_ID|" + claimResponseItemDetailId, 'CLAIM_RESPONSE_ITEM_DETAIL', function(resClaimResponseId){
								if(resClaimResponseId.err_code > 0){
									checkUniqeValue(apikey, "ADJUDICATION_ID|" + claimResponseAdjudicationId, 'CLAIM_RESPONSE_ADJUDICATION', function(resClaimResponseAdjudicationID){
										if(resClaimResponseAdjudicationID.err_code > 0){
											ApiFHIR.put('claimResponseAdjudication', {"apikey": apikey, "_id": claimResponseAdjudicationId, "dr": "DETAIL_ID|"+claimResponseItemDetailId}, {body: dataClaimResponse, json: true}, function(error, response, body){
												claimResponseAdjudication = body;
												if(claimResponseAdjudication.err_code > 0){
													res.json(claimResponseAdjudication);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim Response Adjudication Detail has been update in this Claim Response.", "data": claimResponseAdjudication.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim Response Adjudication Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Response Detail Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkItemDetailAdjudicationCategory', function () {
							if (!validator.isEmpty(itemDetailAdjudicationCategory)) {
								checkCode(apikey, itemDetailAdjudicationCategory, 'ADJUDICATION', function (resItemDetailAdjudicationCategoryCode) {
									if (resItemDetailAdjudicationCategoryCode.err_code > 0) {
										myEmitter.emit('checkClaimResponseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item detail adjudication category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimResponseID');
							}
						})

						if (!validator.isEmpty(itemDetailAdjudicationReason)) {
							checkCode(apikey, itemDetailAdjudicationReason, 'ADJUDICATION_REASON', function (resItemDetailAdjudicationReasonCode) {
								if (resItemDetailAdjudicationReasonCode.err_code > 0) {
									myEmitter.emit('checkItemDetailAdjudicationCategory');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Item detail adjudication reason code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkItemDetailAdjudicationCategory');
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
		claimResponseItemSubDetail: function updateClaimResponseItemSubDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseItemDetailId = req.params.claim_response_item_detail_id;
			var claimResponseItemSubDetailId = req.params.claim_response_item_sub_detail_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaimResponse = {};
			//input check 
			if(typeof claimResponseItemDetailId !== 'undefined'){
				if(validator.isEmpty(claimResponseItemDetailId)){
					err_code = 2;
					err_msg = "Claim Response Item Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Item Detail id is required";
			}
			
			if(typeof claimResponseItemSubDetailId !== 'undefined'){
				if(validator.isEmpty(claimResponseItemSubDetailId)){
					err_code = 2;
					err_msg = "Claim Response Item Sub Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Item Sub Detail id is required";
			}
			
			if(typeof req.body.sequenceLinkId !== 'undefined' && req.body.sequenceLinkId !== ""){
				var itemDetailSubDetailSequenceLinkId =  req.body.sequenceLinkId.trim();
				if(validator.isEmpty(itemDetailSubDetailSequenceLinkId)){
					err_code = 2;
					err_msg = "claim response item detail sub detail sequence link id is required.";
				}else{
					if(!validator.isInt(itemDetailSubDetailSequenceLinkId)){
						err_code = 2;
						err_msg = "claim response item detail sub detail sequence link id is must be number.";
					}else{
						dataClaimResponse.sequence_link_id = itemDetailSubDetailSequenceLinkId;
					}
				}
			}else{
			  itemDetailSubDetailSequenceLinkId = "";
			}

			if(typeof req.body.noteNumber !== 'undefined' && req.body.noteNumber !== ""){
				var itemDetailSubDetailNoteNumber =  req.body.noteNumber.trim();
				if(validator.isEmpty(itemDetailSubDetailNoteNumber)){
					dataClaimResponse.note_number = "";
				}else{
					if(!validator.isInt(itemDetailSubDetailNoteNumber)){
						err_code = 2;
						err_msg = "claim response item detail sub detail note number is must be number.";
					}else{
						dataClaimResponse.note_number = itemDetailSubDetailNoteNumber;
					}
				}
			}else{
			  itemDetailSubDetailNoteNumber = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimResponseID', function(){
							checkUniqeValue(apikey, "DETAIL_ID|" + claimResponseItemDetailId, 'CLAIM_RESPONSE_ITEM_DETAIL', function(resClaimResponseItemID){
								if(resClaimResponseItemID.err_code > 0){
									checkUniqeValue(apikey, "SUB_DETAIL_ID|" + claimResponseItemSubDetailId, 'CLAIM_RESPONSE_ITEM_SUB_DETAIL', function(resClaimResponseItemDetailID){
										if(resClaimResponseItemDetailID.err_code > 0){
											ApiFHIR.put('claimResponseItem', {"apikey": apikey, "_id": claimResponseItemSubDetailId, "dr": "DETAIL_ID|"+claimResponseItemDetailId}, {body: dataClaimResponse, json: true}, function(error, response, body){
												claimResponseItemDetail = body;
												if(claimResponseItemDetail.err_code > 0){
													res.json(claimResponseItemDetail);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim Response item sub detail has been update in this Claim Response.", "data": claimResponseItemDetail.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim Response item sub detail Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Response Item Detail Id not found"});		
								}
							})
						})
						
						myEmitter.emit('checkClaimResponseID');
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
		claimResponseAdjudicationSubDetail: function updateClaimResponseAdjudicationSubDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseItemSubDetailId = req.params.claim_response_item_sub_detail_id;
			var claimResponseAdjudicationId = req.params.claim_response_adjudication_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaimResponse = {};
			//input check 
			if(typeof claimResponseItemSubDetailId !== 'undefined'){
				if(validator.isEmpty(claimResponseItemSubDetailId)){
					err_code = 2;
					err_msg = "Claim Response Item Sub Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Item Sub Detail id is required";
			}

			if(typeof claimResponseAdjudicationId !== 'undefined'){
				if(validator.isEmpty(claimResponseAdjudicationId)){
					err_code = 2;
					err_msg = "Claim Response Adjudication id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Adjudication id is required";
			}
			
			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var itemDetailSubDetailAdjudicationCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(itemDetailSubDetailAdjudicationCategory)){
					err_code = 2;
					err_msg = "claim response item detail sub detail adjudication category is required.";
				}else{
					dataClaimResponse.category = itemDetailSubDetailAdjudicationCategory;
				}
			}else{
			  itemDetailSubDetailAdjudicationCategory = "";
			}

			if(typeof req.body.reason !== 'undefined' && req.body.reason !== ""){
				var itemDetailSubDetailAdjudicationReason =  req.body.reason.trim().toLowerCase();
				if(validator.isEmpty(itemDetailSubDetailAdjudicationReason)){
					dataClaimResponse.reason = "";
				}else{
					dataClaimResponse.reason = itemDetailSubDetailAdjudicationReason;
				}
			}else{
			  itemDetailSubDetailAdjudicationReason = "";
			}

			if(typeof req.body.amount !== 'undefined' && req.body.amount !== ""){
				var itemDetailSubDetailAdjudicationAmount =  req.body.amount.trim().toLowerCase();
				if(validator.isEmpty(itemDetailSubDetailAdjudicationAmount)){
					dataClaimResponse.amount = "";
				}else{
					dataClaimResponse.amount = itemDetailSubDetailAdjudicationAmount;
				}
			}else{
			  itemDetailSubDetailAdjudicationAmount = "";
			}

			if(typeof req.body.value !== 'undefined' && req.body.value !== ""){
				var itemDetailSubDetailAdjudicationValue =  req.body.value.trim();
				if(validator.isEmpty(itemDetailSubDetailAdjudicationValue)){
					dataClaimResponse.value = "";
				}else{
					if(!validator.isInt(itemDetailSubDetailAdjudicationValue)){
						err_code = 2;
						err_msg = "claim response item detail sub detail adjudication value is must be number.";
					}else{
						dataClaimResponse.value = itemDetailSubDetailAdjudicationValue;
					}
				}
			}else{
			  itemDetailSubDetailAdjudicationValue = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimResponseID', function(){
							checkUniqeValue(apikey, "SUB_DETAIL_ID|" + claimResponseItemSubDetailId, 'CLAIM_RESPONSE_ITEM_SUB_DETAIL', function(resClaimResponseId){
								if(resClaimResponseId.err_code > 0){
									checkUniqeValue(apikey, "ADJUDICATION_ID|" + claimResponseAdjudicationId, 'CLAIM_RESPONSE_ADJUDICATION', function(resClaimResponseAdjudicationID){
										if(resClaimResponseAdjudicationID.err_code > 0){
											ApiFHIR.put('claimResponseAdjudication', {"apikey": apikey, "_id": claimResponseAdjudicationId, "dr": "DETAIL_ID|"+claimResponseItemSubDetailId}, {body: dataClaimResponse, json: true}, function(error, response, body){
												claimResponseAdjudication = body;
												if(claimResponseAdjudication.err_code > 0){
													res.json(claimResponseAdjudication);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim Response Adjudication Sub Detail has been update in this Claim Response.", "data": claimResponseAdjudication.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim Response Adjudication Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Response Sub Detail Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkItemDetailSubDetailAdjudicationCategory', function () {
							if (!validator.isEmpty(itemDetailSubDetailAdjudicationCategory)) {
								checkCode(apikey, itemDetailSubDetailAdjudicationCategory, 'ADJUDICATION', function (resItemDetailSubDetailAdjudicationCategoryCode) {
									if (resItemDetailSubDetailAdjudicationCategoryCode.err_code > 0) {
										myEmitter.emit('checkClaimResponseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item detail sub detail adjudication category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimResponseID');
							}
						})

						if (!validator.isEmpty(itemDetailSubDetailAdjudicationReason)) {
							checkCode(apikey, itemDetailSubDetailAdjudicationReason, 'ADJUDICATION_REASON', function (resItemDetailSubDetailAdjudicationReasonCode) {
								if (resItemDetailSubDetailAdjudicationReasonCode.err_code > 0) {
									myEmitter.emit('checkItemDetailSubDetailAdjudicationCategory');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Item detail sub detail adjudication reason code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkItemDetailSubDetailAdjudicationCategory');
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
		claimResponseAddItem: function updateClaimResponseAddItem(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseId = req.params.claim_response_id;
			var claimResponseAddItemId = req.params.claim_response_add_item_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaimResponse = {};
			//input check 
			if(typeof claimResponseId !== 'undefined'){
				if(validator.isEmpty(claimResponseId)){
					err_code = 2;
					err_msg = "Claim Response id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response id is required";
			}

			if(typeof claimResponseAddItemId !== 'undefined'){
				if(validator.isEmpty(claimResponseAddItemId)){
					err_code = 2;
					err_msg = "Claim Response Add Item id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Add Item id is required";
			}
			
			if(typeof req.body.sequenceLinkId !== 'undefined' && req.body.sequenceLinkId !== ""){
				var addItemSequenceLinkId =  req.body.sequenceLinkId.trim();
				if(validator.isEmpty(addItemSequenceLinkId)){
					dataClaimResponse.sequence_link_id = "";
				}else{
					if(!validator.isInt(addItemSequenceLinkId)){
						err_code = 2;
						err_msg = "claim response add item sequence link id is must be number.";
					}else{
						dataClaimResponse.sequence_link_id = addItemSequenceLinkId;
					}
				}
			}else{
			  addItemSequenceLinkId = "";
			}

			if(typeof req.body.revenue !== 'undefined' && req.body.revenue !== ""){
				var addItemRevenue =  req.body.revenue.trim().toLowerCase();
				if(validator.isEmpty(addItemRevenue)){
					dataClaimResponse.revenue = "";
				}else{
					dataClaimResponse.revenue = addItemRevenue;
				}
			}else{
			  addItemRevenue = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var addItemCategory =  req.body.category.trim().toUpperCase();
				if(validator.isEmpty(addItemCategory)){
					dataClaimResponse.category = "";
				}else{
					dataClaimResponse.category = addItemCategory;
				}
			}else{
			  addItemCategory = "";
			}

			if(typeof req.body.service !== 'undefined' && req.body.service !== ""){
				var addItemService =  req.body.service.trim().toLowerCase();
				if(validator.isEmpty(addItemService)){
					dataClaimResponse.service = "";
				}else{
					dataClaimResponse.service = addItemService;
				}
			}else{
			  addItemService = "";
			}

			if(typeof req.body.modifier !== 'undefined' && req.body.modifier !== ""){
				var addItemModifier =  req.body.modifier.trim().toLowerCase();
				if(validator.isEmpty(addItemModifier)){
					dataClaimResponse.modifier = "";
				}else{
					dataClaimResponse.modifier = addItemModifier;
				}
			}else{
			  addItemModifier = "";
			}

			if(typeof req.body.fee !== 'undefined' && req.body.fee !== ""){
				var addItemFee =  req.body.fee.trim().toLowerCase();
				if(validator.isEmpty(addItemFee)){
					dataClaimResponse.fee = "";
				}else{
					dataClaimResponse.fee = addItemFee;
				}
			}else{
			  addItemFee = "";
			}

			if(typeof req.body.noteNumber !== 'undefined' && req.body.noteNumber !== ""){
				var addItemNoteNumber =  req.body.noteNumber.trim();
				if(validator.isEmpty(addItemNoteNumber)){
					dataClaimResponse.note_number = "";
				}else{
					if(!validator.isInt(addItemNoteNumber)){
						err_code = 2;
						err_msg = "claim response add item note number is must be number.";
					}else{
						dataClaimResponse.note_number = addItemNoteNumber;
					}
				}
			}else{
			  addItemNoteNumber = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimResponseID', function(){
							checkUniqeValue(apikey, "CLAIM_RESPONSE_ID|" + claimResponseId, 'CLAIM_RESPONSE', function(resClaimResponseId){
								if(resClaimResponseId.err_code > 0){
									checkUniqeValue(apikey, "ADD_ITEM_ID|" + claimResponseAddItemId, 'CLAIM_RESPONSE_ADD_ITEM', function(resClaimResponseAddItemID){
										if(resClaimResponseAddItemID.err_code > 0){
											ApiFHIR.put('claimResponseAddItem', {"apikey": apikey, "_id": claimResponseAddItemId, "dr": "CLAIM_RESPONSE_ID|"+claimResponseId}, {body: dataClaimResponse, json: true}, function(error, response, body){
												claimResponseAddItem = body;
												if(claimResponseAddItem.err_code > 0){
													res.json(claimResponseAddItem);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim Response Add Item has been update in this Claim Response.", "data": claimResponseAddItem.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim Response Add Item Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Response Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkAddItemRevenue', function () {
							if (!validator.isEmpty(addItemRevenue)) {
								checkCode(apikey, addItemRevenue, 'EX_REVENUE_CENTER', function (resAddItemRevenueCode) {
									if (resAddItemRevenueCode.err_code > 0) {
										myEmitter.emit('checkClaimResponseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Add item revenue code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimResponseID');
							}
						})

						myEmitter.prependOnceListener('checkAddItemCategory', function () {
							if (!validator.isEmpty(addItemCategory)) {
								checkCode(apikey, addItemCategory, 'BENEFIT_SUBCATEGORY', function (resAddItemCategoryCode) {
									if (resAddItemCategoryCode.err_code > 0) {
										myEmitter.emit('checkAddItemRevenue');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Add item category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAddItemRevenue');
							}
						})

						myEmitter.prependOnceListener('checkAddItemService', function () {
							if (!validator.isEmpty(addItemService)) {
								checkCode(apikey, addItemService, 'SERVICE_USCLS', function (resAddItemServiceCode) {
									if (resAddItemServiceCode.err_code > 0) {
										myEmitter.emit('checkAddItemCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Add item service code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAddItemCategory');
							}
						})

						if (!validator.isEmpty(addItemModifier)) {
							checkCode(apikey, addItemModifier, 'CLAIM_MODIFIERS', function (resAddItemModifierCode) {
								if (resAddItemModifierCode.err_code > 0) {
									myEmitter.emit('checkAddItemService');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Add item modifier code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkAddItemService');
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
		claimResponseAdjudicationAddItem: function updateClaimResponseAdjudicationAddItem(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseAddItemId = req.params.claim_response_add_item_id;
			var claimResponseAdjudicationId = req.params.claim_response_adjudication_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaimResponse = {};
			//input check 
			if(typeof claimResponseAddItemId !== 'undefined'){
				if(validator.isEmpty(claimResponseAddItemId)){
					err_code = 2;
					err_msg = "Claim Response Add Item id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Add Item id is required";
			}

			if(typeof claimResponseAdjudicationId !== 'undefined'){
				if(validator.isEmpty(claimResponseAdjudicationId)){
					err_code = 2;
					err_msg = "Claim Response Adjudication id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Adjudication id is required";
			}
			
			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var addItemAdjudicationCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(addItemAdjudicationCategory)){
					err_code = 2;
					err_msg = "claim response add item adjudication category is required.";
				}else{
					dataClaimResponse.category = addItemAdjudicationCategory;
				}
			}else{
			  addItemAdjudicationCategory = "";
			}

			if(typeof req.body.reason !== 'undefined' && req.body.reason !== ""){
				var addItemAdjudicationReason =  req.body.reason.trim().toLowerCase();
				if(validator.isEmpty(addItemAdjudicationReason)){
					dataClaimResponse.reason = "";
				}else{
					dataClaimResponse.reason = addItemAdjudicationReason;
				}
			}else{
			  addItemAdjudicationReason = "";
			}

			if(typeof req.body.amount !== 'undefined' && req.body.amount !== ""){
				var addItemAdjudicationAmount =  req.body.amount.trim().toLowerCase();
				if(validator.isEmpty(addItemAdjudicationAmount)){
					dataClaimResponse.amount = "";
				}else{
					dataClaimResponse.amount = addItemAdjudicationAmount;
				}
			}else{
			  addItemAdjudicationAmount = "";
			}

			if(typeof req.body.value !== 'undefined' && req.body.value !== ""){
				var addItemAdjudicationValue =  req.body.value.trim();
				if(validator.isEmpty(addItemAdjudicationValue)){
					dataClaimResponse.value = "";
				}else{
					if(!validator.isInt(addItemAdjudicationValue)){
						err_code = 2;
						err_msg = "claim response add item adjudication value is must be number.";
					}else{
						dataClaimResponse.value = addItemAdjudicationValue;
					}
				}
			}else{
			  addItemAdjudicationValue = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimResponseID', function(){
							checkUniqeValue(apikey, "ADD_ITEM_ID|" + claimResponseAddItemId, 'CLAIM_RESPONSE_ADD_ITEM', function(resClaimResponseId){
								if(resClaimResponseId.err_code > 0){
									checkUniqeValue(apikey, "ADJUDICATION_ID|" + claimResponseAdjudicationId, 'CLAIM_RESPONSE_ADJUDICATION', function(resClaimResponseAdjudicationID){
										if(resClaimResponseAdjudicationID.err_code > 0){
											ApiFHIR.put('claimResponseAdjudication', {"apikey": apikey, "_id": claimResponseAdjudicationId, "dr": "ADD_ITEM_ID|"+claimResponseAddItemId}, {body: dataClaimResponse, json: true}, function(error, response, body){
												claimResponseAdjudication = body;
												if(claimResponseAdjudication.err_code > 0){
													res.json(claimResponseAdjudication);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim Response Adjudication Add Item has been update in this Claim Response.", "data": claimResponseAdjudication.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim Response Adjudication Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Response Add Item Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkAddItemAdjudicationCategory', function () {
							if (!validator.isEmpty(addItemAdjudicationCategory)) {
								checkCode(apikey, addItemAdjudicationCategory, 'ADJUDICATION', function (resAddItemAdjudicationCategoryCode) {
									if (resAddItemAdjudicationCategoryCode.err_code > 0) {
										myEmitter.emit('checkClaimResponseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Add item adjudication category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimResponseID');
							}
						})

						if (!validator.isEmpty(addItemAdjudicationReason)) {
							checkCode(apikey, addItemAdjudicationReason, 'ADJUDICATION_REASON', function (resAddItemAdjudicationReasonCode) {
								if (resAddItemAdjudicationReasonCode.err_code > 0) {
									myEmitter.emit('checkAddItemAdjudicationCategory');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Add item adjudication reason code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkAddItemAdjudicationCategory');
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
		claimResponseAddItemDetail: function updateClaimResponseAddItemDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseAddItemId = req.params.claim_response_add_item_id;
			var claimResponseAddItemDetailId = req.params.claim_response_add_item_detail_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaimResponse = {};
			//input check 
			if(typeof claimResponseAddItemId !== 'undefined'){
				if(validator.isEmpty(claimResponseAddItemId)){
					err_code = 2;
					err_msg = "Claim Response Add Item id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Add Item id is required";
			}
			
			if(typeof claimResponseAddItemDetailId !== 'undefined'){
				if(validator.isEmpty(claimResponseAddItemDetailId)){
					err_code = 2;
					err_msg = "Claim Response Add Item Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Add Item Detail id is required";
			}
			
			if(typeof req.body.revenue !== 'undefined' && req.body.revenue !== ""){
				var addItemDetailRevenue =  req.body.revenue.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailRevenue)){
					dataClaimResponse.revenue = "";
				}else{
					dataClaimResponse.revenue = addItemDetailRevenue;
				}
			}else{
			  addItemDetailRevenue = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var addItemDetailCategory =  req.body.category.trim().toUpperCase();
				if(validator.isEmpty(addItemDetailCategory)){
					dataClaimResponse.category = "";
				}else{
					dataClaimResponse.category = addItemDetailCategory;
				}
			}else{
			  addItemDetailCategory = "";
			}

			if(typeof req.body.service !== 'undefined' && req.body.service !== ""){
				var addItemDetailService =  req.body.service.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailService)){
					dataClaimResponse.service = "";
				}else{
					dataClaimResponse.service = addItemDetailService;
				}
			}else{
			  addItemDetailService = "";
			}

			if(typeof req.body.modifier !== 'undefined' && req.body.modifier !== ""){
				var addItemDetailModifier =  req.body.modifier.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailModifier)){
					dataClaimResponse.modifier = "";
				}else{
					dataClaimResponse.modifier = addItemDetailModifier;
				}
			}else{
			  addItemDetailModifier = "";
			}

			if(typeof req.body.fee !== 'undefined' && req.body.fee !== ""){
				var addItemDetailFee =  req.body.fee.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailFee)){
					dataClaimResponse.fee = "";
				}else{
					dataClaimResponse.fee = addItemDetailFee;
				}
			}else{
			  addItemDetailFee = "";
			}

			if(typeof req.body.noteNumber !== 'undefined' && req.body.noteNumber !== ""){
				var addItemDetailNoteNumber =  req.body.noteNumber.trim();
				if(validator.isEmpty(addItemDetailNoteNumber)){
					dataClaimResponse.note_number = "";
				}else{
					if(!validator.isInt(addItemDetailNoteNumber)){
						err_code = 2;
						err_msg = "claim response add item detail note number is must be number.";
					}else{
						dataClaimResponse.note_number = addItemDetailNoteNumber;
					}
				}
			}else{
			  addItemDetailNoteNumber = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimResponseID', function(){
							checkUniqeValue(apikey, "ADD_ITEM_ID|" + claimResponseAddItemId, 'CLAIM_RESPONSE_ADD_ITEM', function(resClaimResponseId){
								if(resClaimResponseId.err_code > 0){
									checkUniqeValue(apikey, "ADD_ITEM_DETAIL_ID|" + claimResponseAddItemId, 'CLAIM_RESPONSE_ADD_ITEM_DETAIL', function(resClaimResponseAddItemID){
										if(resClaimResponseAddItemID.err_code > 0){
											ApiFHIR.put('claimResponseAddItem', {"apikey": apikey, "_id": claimResponseAddItemId, "dr": "ADD_ITEM_ID|"+claimResponseAddItemId}, {body: dataClaimResponse, json: true}, function(error, response, body){
												claimResponseAddItem = body;
												if(claimResponseAddItem.err_code > 0){
													res.json(claimResponseAddItem);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim Response Add Item Detail has been update in this Claim Response.", "data": claimResponseAddItem.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim Response Add Item Detail Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Response Add Item Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkAddItemDetailRevenue', function () {
							if (!validator.isEmpty(addItemDetailRevenue)) {
								checkCode(apikey, addItemDetailRevenue, 'EX_REVENUE_CENTER', function (resAddItemDetailRevenueCode) {
									if (resAddItemDetailRevenueCode.err_code > 0) {
										myEmitter.emit('checkClaimResponseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Add item detail revenue code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimResponseID');
							}
						})

						myEmitter.prependOnceListener('checkAddItemDetailCategory', function () {
							if (!validator.isEmpty(addItemDetailCategory)) {
								checkCode(apikey, addItemDetailCategory, 'BENEFIT_SUBCATEGORY', function (resAddItemDetailCategoryCode) {
									if (resAddItemDetailCategoryCode.err_code > 0) {
										myEmitter.emit('checkAddItemDetailRevenue');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Add item detail category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAddItemDetailRevenue');
							}
						})

						myEmitter.prependOnceListener('checkAddItemDetailService', function () {
							if (!validator.isEmpty(addItemDetailService)) {
								checkCode(apikey, addItemDetailService, 'SERVICE_USCLS', function (resAddItemDetailServiceCode) {
									if (resAddItemDetailServiceCode.err_code > 0) {
										myEmitter.emit('checkAddItemDetailCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Add item detail service code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAddItemDetailCategory');
							}
						})

						if (!validator.isEmpty(addItemDetailModifier)) {
							checkCode(apikey, addItemDetailModifier, 'CLAIM_MODIFIERS', function (resAddItemDetailModifierCode) {
								if (resAddItemDetailModifierCode.err_code > 0) {
									myEmitter.emit('checkAddItemDetailService');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Add item detail modifier code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkAddItemDetailService');
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
		claimResponseAdjudicationAddItemDetail: function updateClaimResponseAdjudicationAddItemDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseAddItemDetailId = req.params.claim_response_add_item_detail_id;
			var claimResponseAdjudicationId = req.params.claim_response_adjudication_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaimResponse = {};
			//input check 
			if(typeof claimResponseAddItemDetailId !== 'undefined'){
				if(validator.isEmpty(claimResponseAddItemDetailId)){
					err_code = 2;
					err_msg = "Claim Response Add Item Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Add Item Detail id is required";
			}

			if(typeof claimResponseAdjudicationId !== 'undefined'){
				if(validator.isEmpty(claimResponseAdjudicationId)){
					err_code = 2;
					err_msg = "Claim Response Adjudication id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Adjudication id is required";
			}
			
			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var addItemDetailAdjudicationCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailAdjudicationCategory)){
					err_code = 2;
					err_msg = "claim response add item detail adjudication category is required.";
				}else{
					dataClaimResponse.category = addItemDetailAdjudicationCategory;
				}
			}else{
			  addItemDetailAdjudicationCategory = "";
			}

			if(typeof req.body.reason !== 'undefined' && req.body.reason !== ""){
				var addItemDetailAdjudicationReason =  req.body.reason.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailAdjudicationReason)){
					dataClaimResponse.reason = "";
				}else{
					dataClaimResponse.reason = addItemDetailAdjudicationReason;
				}
			}else{
			  addItemDetailAdjudicationReason = "";
			}

			if(typeof req.body.amount !== 'undefined' && req.body.amount !== ""){
				var addItemDetailAdjudicationAmount =  req.body.amount.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailAdjudicationAmount)){
					dataClaimResponse.amount = "";
				}else{
					dataClaimResponse.amount = addItemDetailAdjudicationAmount;
				}
			}else{
			  addItemDetailAdjudicationAmount = "";
			}

			if(typeof req.body.value !== 'undefined' && req.body.value !== ""){
				var addItemDetailAdjudicationValue =  req.body.value.trim();
				if(validator.isEmpty(addItemDetailAdjudicationValue)){
					dataClaimResponse.value = "";
				}else{
					if(!validator.isInt(addItemDetailAdjudicationValue)){
						err_code = 2;
						err_msg = "claim response add item detail adjudication value is must be number.";
					}else{
						dataClaimResponse.value = addItemDetailAdjudicationValue;
					}
				}
			}else{
			  addItemDetailAdjudicationValue = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimResponseID', function(){
							checkUniqeValue(apikey, "ADD_ITEM_DETAIL_ID|" + claimResponseAddItemId, 'CLAIM_RESPONSE_ADD_ITEM_DETAIL', function(resClaimResponseId){
								if(resClaimResponseId.err_code > 0){
									checkUniqeValue(apikey, "ADJUDICATION_ID|" + claimResponseAdjudicationId, 'CLAIM_RESPONSE_ADJUDICATION', function(resClaimResponseAdjudicationID){
										if(resClaimResponseAdjudicationID.err_code > 0){
											ApiFHIR.put('claimResponseAdjudication', {"apikey": apikey, "_id": claimResponseAdjudicationId, "dr": "ADD_ITEM_DETAIL_ID|"+claimResponseAddItemId}, {body: dataClaimResponse, json: true}, function(error, response, body){
												claimResponseAdjudication = body;
												if(claimResponseAdjudication.err_code > 0){
													res.json(claimResponseAdjudication);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim Response Adjudication Add Item Detail has been update in this Claim Response.", "data": claimResponseAdjudication.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim Response Adjudication Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Response Add Item Detail Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkAddItemDetailAdjudicationCategory', function () {
							if (!validator.isEmpty(addItemDetailAdjudicationCategory)) {
								checkCode(apikey, addItemDetailAdjudicationCategory, 'ADJUDICATION', function (resAddItemDetailAdjudicationCategoryCode) {
									if (resAddItemDetailAdjudicationCategoryCode.err_code > 0) {
										myEmitter.emit('checkClaimResponseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Add item detail adjudication category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimResponseID');
							}
						})

						if (!validator.isEmpty(addItemDetailAdjudicationReason)) {
							checkCode(apikey, addItemDetailAdjudicationReason, 'ADJUDICATION_REASON', function (resAddItemDetailAdjudicationReasonCode) {
								if (resAddItemDetailAdjudicationReasonCode.err_code > 0) {
									myEmitter.emit('checkAddItemDetailAdjudicationCategory');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Add item detail adjudication reason code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkAddItemDetailAdjudicationCategory');
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
		claimResponseError: function updateClaimResponseError(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseId = req.params.claim_response_id;
			var claimResponseErrorId = req.params.claim_response_error_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaimResponse = {};
			//input check 
			if(typeof claimResponseId !== 'undefined'){
				if(validator.isEmpty(claimResponseId)){
					err_code = 2;
					err_msg = "Claim Response id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response id is required";
			}

			if(typeof claimResponseErrorId !== 'undefined'){
				if(validator.isEmpty(claimResponseErrorId)){
					err_code = 2;
					err_msg = "Claim Response Error id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Error id is required";
			}
			
			if(typeof req.body.sequenceLinkId !== 'undefined' && req.body.sequenceLinkId !== ""){
				var errorSequenceLinkId =  req.body.sequenceLinkId.trim();
				if(validator.isEmpty(errorSequenceLinkId)){
					dataClaimResponse.sequence_link_id = "";
				}else{
					if(!validator.isInt(errorSequenceLinkId)){
						err_code = 2;
						err_msg = "claim response error sequence link id is must be number.";
					}else{
						dataClaimResponse.sequence_link_id = errorSequenceLinkId;
					}
				}
			}else{
			  errorSequenceLinkId = "";
			}

			if(typeof req.body.detailSequenceLinkId !== 'undefined' && req.body.detailSequenceLinkId !== ""){
				var errorDetailSequenceLinkId =  req.body.detailSequenceLinkId.trim();
				if(validator.isEmpty(errorDetailSequenceLinkId)){
					dataClaimResponse.detail_sequence_link_id = "";
				}else{
					if(!validator.isInt(errorDetailSequenceLinkId)){
						err_code = 2;
						err_msg = "claim response error detail sequence link id is must be number.";
					}else{
						dataClaimResponse.detail_sequence_link_id = errorDetailSequenceLinkId;
					}
				}
			}else{
			  errorDetailSequenceLinkId = "";
			}

			if(typeof req.body.subdetailSequenceLinkId !== 'undefined' && req.body.subdetailSequenceLinkId !== ""){
				var errorSubdetailSequenceLinkId =  req.body.subdetailSequenceLinkId.trim();
				if(validator.isEmpty(errorSubdetailSequenceLinkId)){
					dataClaimResponse.subdetail_sequence_link_id = "";
				}else{
					if(!validator.isInt(errorSubdetailSequenceLinkId)){
						err_code = 2;
						err_msg = "claim response error subdetail sequence link id is must be number.";
					}else{
						dataClaimResponse.subdetail_sequence_link_id = errorSubdetailSequenceLinkId;
					}
				}
			}else{
			  errorSubdetailSequenceLinkId = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var errorCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(errorCode)){
					err_code = 2;
					err_msg = "claim response error code is required.";
				}else{
					dataClaimResponse.code = errorCode;
				}
			}else{
			  errorCode = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimResponseID', function(){
							checkUniqeValue(apikey, "CLAIM_RESPONSE_ID|" + claimResponseId, 'CLAIM_RESPONSE', function(resClaimResponseId){
								if(resClaimResponseId.err_code > 0){
									checkUniqeValue(apikey, "ERROR_ID|" + claimResponseErrorId, 'CLAIM_RESPONSE_ERROR', function(resClaimResponseErrorID){
										if(resClaimResponseErrorID.err_code > 0){
											ApiFHIR.put('claimResponseError', {"apikey": apikey, "_id": claimResponseErrorId, "dr": "CLAIM_RESPONSE_ID|"+claimResponseId}, {body: dataClaimResponse, json: true}, function(error, response, body){
												claimResponseError = body;
												if(claimResponseError.err_code > 0){
													res.json(claimResponseError);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim Response error has been update in this Claim Response.", "data": claimResponseError.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim Response error Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Response Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(errorCode)) {
							checkCode(apikey, errorCode, 'ADJUDICATION_ERROR', function (resErrorCodeCode) {
								if (resErrorCodeCode.err_code > 0) {
									myEmitter.emit('checkClaimResponseID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Error code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkClaimResponseID');
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
		claimResponseProcessNote: function updateClaimResponseProcessNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseId = req.params.claim_response_id;
			var claimResponseProcessNoteId = req.params.claim_response_process_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaimResponse = {};
			//input check 
			if(typeof claimResponseId !== 'undefined'){
				if(validator.isEmpty(claimResponseId)){
					err_code = 2;
					err_msg = "Claim Response id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response id is required";
			}

			if(typeof claimResponseProcessNoteId !== 'undefined'){
				if(validator.isEmpty(claimResponseProcessNoteId)){
					err_code = 2;
					err_msg = "Claim Response Process Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Process Note id is required";
			}
			
			if(typeof req.body.number !== 'undefined' && req.body.number !== ""){
				var processNoteNumber =  req.body.number.trim();
				if(validator.isEmpty(processNoteNumber)){
					dataClaimResponse.number = "";
				}else{
					if(!validator.isInt(processNoteNumber)){
						err_code = 2;
						err_msg = "claim response process note number is must be number.";
					}else{
						dataClaimResponse.number = processNoteNumber;
					}
				}
			}else{
			  processNoteNumber = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var processNoteType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(processNoteType)){
					dataClaimResponse.type = "";
				}else{
					dataClaimResponse.type = processNoteType;
				}
			}else{
			  processNoteType = "";
			}

			if(typeof req.body.text !== 'undefined' && req.body.text !== ""){
				var processNoteText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(processNoteText)){
					dataClaimResponse.text = "";
				}else{
					dataClaimResponse.text = processNoteText;
				}
			}else{
			  processNoteText = "";
			}

			if(typeof req.body.language !== 'undefined' && req.body.language !== ""){
				var processNoteLanguage =  req.body.language.trim();
				if(validator.isEmpty(processNoteLanguage)){
					dataClaimResponse.language = "";
				}else{
					dataClaimResponse.language = processNoteLanguage;
				}
			}else{
			  processNoteLanguage = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimResponseID', function(){
							checkUniqeValue(apikey, "CLAIM_RESPONSE_ID|" + claimResponseId, 'CLAIM_RESPONSE', function(resClaimResponseId){
								if(resClaimResponseId.err_code > 0){
									checkUniqeValue(apikey, "PROCESS_NOTE_ID|" + claimResponseProcessNoteId, 'CLAIM_RESPONSE_PROCESS_NOTE', function(resClaimResponseProcessNoteID){
										if(resClaimResponseProcessNoteID.err_code > 0){
											ApiFHIR.put('claimResponseProcessNote', {"apikey": apikey, "_id": claimResponseProcessNoteId, "dr": "CLAIM_RESPONSE_ID|"+claimResponseId}, {body: dataClaimResponse, json: true}, function(error, response, body){
												claimResponseProcessNote = body;
												if(claimResponseProcessNote.err_code > 0){
													res.json(claimResponseProcessNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim Response Process Note has been update in this Claim Response.", "data": claimResponseProcessNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim Response Process Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Response Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkProcessNoteType', function () {
							if (!validator.isEmpty(processNoteType)) {
								checkCode(apikey, processNoteType, 'NOTE_TYPE', function (resProcessNoteTypeCode) {
									if (resProcessNoteTypeCode.err_code > 0) {
										myEmitter.emit('checkClaimResponseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Process note type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimResponseID');
							}
						})

						if (!validator.isEmpty(processNoteLanguage)) {
							checkCode(apikey, processNoteLanguage, 'LANGUAGES', function (resProcessNoteLanguageCode) {
								if (resProcessNoteLanguageCode.err_code > 0) {
									myEmitter.emit('checkProcessNoteType');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Process note language code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkProcessNoteType');
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
		claimResponseInsurance: function updateClaimResponseInsurance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimResponseId = req.params.claim_response_id;
			var claimResponseInsuranceId = req.params.claim_response_insurance_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaimResponse = {};
			//input check 
			if(typeof claimResponseId !== 'undefined'){
				if(validator.isEmpty(claimResponseId)){
					err_code = 2;
					err_msg = "Claim Response id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response id is required";
			}

			if(typeof claimResponseInsuranceId !== 'undefined'){
				if(validator.isEmpty(claimResponseInsuranceId)){
					err_code = 2;
					err_msg = "Claim Response Insurance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Response Insurance id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var insuranceSequence =  req.body.sequence.trim();
				if(validator.isEmpty(insuranceSequence)){
					err_code = 2;
					err_msg = "claim response insurance sequence is required.";
				}else{
					if(!validator.isInt(insuranceSequence)){
						err_code = 2;
						err_msg = "claim response insurance sequence is must be number.";
					}else{
						dataClaimResponse.sequence = insuranceSequence;
					}
				}
			}else{
			  insuranceSequence = "";
			}

			if (typeof req.body.focal !== 'undefined' && req.body.focal !== "") {
			  var insuranceFocal = req.body.focal.trim().toLowerCase();
			  if(insuranceFocal === "true" || insuranceFocal === "false"){
					dataClaimResponse.focal = insuranceFocal;
			  } else {
			    err_code = 2;
			    err_msg = "Claim response insurance focal is must be boolean.";
			  }
			} else {
			  insuranceFocal = "";
			}

			if(typeof req.body.coverage !== 'undefined' && req.body.coverage !== ""){
				var insuranceCoverage =  req.body.coverage.trim().toLowerCase();
				if(validator.isEmpty(insuranceCoverage)){
					err_code = 2;
					err_msg = "claim response insurance coverage is required.";
				}else{
					dataClaimResponse.coverage = insuranceCoverage;
				}
			}else{
			  insuranceCoverage = "";
			}

			if(typeof req.body.businessArrangement !== 'undefined' && req.body.businessArrangement !== ""){
				var insuranceBusinessArrangement =  req.body.businessArrangement.trim().toLowerCase();
				if(validator.isEmpty(insuranceBusinessArrangement)){
					dataClaimResponse.business_arrangement = "";
				}else{
					dataClaimResponse.business_arrangement = insuranceBusinessArrangement;
				}
			}else{
			  insuranceBusinessArrangement = "";
			}

			if(typeof req.body.preAuthRef !== 'undefined' && req.body.preAuthRef !== ""){
				var insurancePreAuthRef =  req.body.preAuthRef.trim().toLowerCase();
				if(validator.isEmpty(insurancePreAuthRef)){
					dataClaimResponse.pre_auth_ref = "";
				}else{
					dataClaimResponse.pre_auth_ref = insurancePreAuthRef;
				}
			}else{
			  insurancePreAuthRef = "";
			}

			if(typeof req.body.claimResponse !== 'undefined' && req.body.claimResponse !== ""){
				var insuranceClaimResponse =  req.body.claimResponse.trim().toLowerCase();
				if(validator.isEmpty(insuranceClaimResponse)){
					dataClaimResponse.claim_response = "";
				}else{
					dataClaimResponse.claim_response = insuranceClaimResponse;
				}
			}else{
			  insuranceClaimResponse = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimResponseID', function(){
							checkUniqeValue(apikey, "CLAIM_RESPONSE_ID|" + claimResponseId, 'CLAIM_RESPONSE', function(resClaimResponseId){
								if(resClaimResponseId.err_code > 0){
									checkUniqeValue(apikey, "INSURANCE_ID|" + claimResponseInsuranceId, 'CLAIM_RESPONSE_INSURANCE', function(resClaimResponseInsuranceID){
										if(resClaimResponseInsuranceID.err_code > 0){
											ApiFHIR.put('claimResponseInsurance', {"apikey": apikey, "_id": claimResponseInsuranceId, "dr": "CLAIM_RESPONSE_ID|"+claimResponseId}, {body: dataClaimResponse, json: true}, function(error, response, body){
												claimResponseInsurance = body;
												if(claimResponseInsurance.err_code > 0){
													res.json(claimResponseInsurance);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim Response insurance has been update in this Claim Response.", "data": claimResponseInsurance.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim Response insurance Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Response Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkInsuranceCoverage', function () {
							if (!validator.isEmpty(insuranceCoverage)) {
								checkUniqeValue(apikey, "COVERAGE_ID|" + insuranceCoverage, 'COVERAGE', function (resInsuranceCoverage) {
									if (resInsuranceCoverage.err_code > 0) {
										myEmitter.emit('checkClaimResponseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurance coverage id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimResponseID');
							}
						})

						if (!validator.isEmpty(insuranceClaimResponse)) {
							checkUniqeValue(apikey, "CLAIM_RESPONSE_ID|" + insuranceClaimResponse, 'CLAIM_RESPONSE', function (resInsuranceClaimResponse) {
								if (resInsuranceClaimResponse.err_code > 0) {
									myEmitter.emit('checkInsuranceCoverage');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Insurance claim response id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkInsuranceCoverage');
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
