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
		eligibilityResponse: function getEligibilityResponse(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};
			var eligibilityResponseId = req.query._id;
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
			
			if (typeof eligibilityResponseId !== 'undefined') {
        if (!validator.isEmpty(eligibilityResponseId)) {
          qString._id = eligibilityResponseId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Eligibility Request ID is required."
          })
        }
      }
			
			var created = req.query.created;
			var disposition = req.query.disposition;
			var identifier = req.query.identifier;
			var insurer = req.query.insurer;
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
        "EligibilityResponse": {
          "location": "%(apikey)s/EligibilityResponse",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
			
			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					ApiFHIR.get('EligibilityResponse', {
            "apikey": apikey
          }, {}, function (error, response, body) {
						if (error) {
              res.json(error);
            } else {
							var eligibilityResponse = JSON.parse(body);
							if (eligibilityResponse.err_code == 0) {
								if (eligibilityResponse.data.length > 0) {
									newEligibilityResponse = [];
									for (i = 0; i < eligibilityResponse.data.length; i++) {
										myEmitter.prependOnceListener("getIdentifier", function (eligibilityResponse, index, newEligibilityResponse, countEligibilityResponse) {
											qString = {};
                      qString.eligibility_response_id = eligibilityResponse.id;
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
													var objectEligibilityResponse = {};
													objectEligibilityResponse.resourceType = eligibilityResponse.resourceType;
													objectEligibilityResponse.id = eligibilityResponse.id;
													objectEligibilityResponse.identifier = identifier.data;
													objectEligibilityResponse.status = eligibilityResponse.status;
													objectEligibilityResponse.created = eligibilityResponse.created;
													objectEligibilityResponse.requestProvider = eligibilityResponse.requestProvider;
													objectEligibilityResponse.requestOrganization = eligibilityResponse.requestOrganization;
													objectEligibilityResponse.request = eligibilityResponse.request;
													objectEligibilityResponse.outcome = eligibilityResponse.outcome;
													objectEligibilityResponse.disposition = eligibilityResponse.disposition;
													objectEligibilityResponse.insurer = eligibilityResponse.insurer;
													objectEligibilityResponse.inforce = eligibilityResponse.inforce;
													objectEligibilityResponse.form = eligibilityResponse.form;
													
													newEligibilityResponse[index] = objectEligibilityResponse;
													
													myEmitter.prependOnceListener("getEligibilityResponseError", function (eligibilityResponse, index, newEligibilityResponse, countEligibilityResponse) {
														qString = {};
														qString.eligibility_response_id = eligibilityResponse.id;
														seedPhoenixFHIR.path.GET = {
															"EligibilityResponseError": {
																"location": "%(apikey)s/EligibilityResponseError",
																"query": qString
															}
														}
														var ApiFHIR = new Apiclient(seedPhoenixFHIR);
														ApiFHIR.get('EligibilityResponseError', {
															"apikey": apikey
														}, {}, function (error, response, body) {
															eligibilityResponseError = JSON.parse(body);
															if (eligibilityResponseError.err_code == 0) {
																var objectEligibilityResponse = {};
																objectEligibilityResponse.resourceType = eligibilityResponse.resourceType;
																objectEligibilityResponse.id = eligibilityResponse.id;
																objectEligibilityResponse.identifier = eligibilityResponse.identifier;
																objectEligibilityResponse.status = eligibilityResponse.status;
																objectEligibilityResponse.created = eligibilityResponse.created;
																objectEligibilityResponse.requestProvider = eligibilityResponse.requestProvider;
																objectEligibilityResponse.requestOrganization = eligibilityResponse.requestOrganization;
																objectEligibilityResponse.request = eligibilityResponse.request;
																objectEligibilityResponse.outcome = eligibilityResponse.outcome;
																objectEligibilityResponse.disposition = eligibilityResponse.disposition;
																objectEligibilityResponse.insurer = eligibilityResponse.insurer;
																objectEligibilityResponse.inforce = eligibilityResponse.inforce;
																objectEligibilityResponse.insurance = host + ':' + port + '/' + apikey + '/EligibilityResponse/' +  eligibilityResponse.id + '/EligibilityResponseInsurance';
																objectEligibilityResponse.form = eligibilityResponse.form;
																objectEligibilityResponse.error = eligibilityResponseError.data;

																newEligibilityResponse[index] = objectEligibilityResponse;

																if (index == countEligibilityResponse - 1) {
																	res.json({
																		"err_code": 0,
																		"data": newEligibilityResponse
																	});
																}

															} else {
																res.json(identifier);
															}
														})
													})
													myEmitter.emit("getEligibilityResponseError", objectEligibilityResponse, index, newEligibilityResponse, countEligibilityResponse);
													
												} else {
                          res.json(identifier);
                        }
											})
										})
										myEmitter.emit("getIdentifier", eligibilityResponse.data[i], i, newEligibilityResponse, eligibilityResponse.data.length);
									}
								} else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Eligibility Request is empty."
                  });
                }
							} else {
                res.json(eligibilityResponse);
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
			var eligibilityResponseId = req.params.eligibility_response_id;
			var identifierId = req.params.identifier_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "ELIGIBILITY_REQUEST_ID|" + eligibilityResponseId, 'ELIGIBILITY_REQUEST', function(resEligibilityResponseID){
						if(resEligibilityResponseID.err_code > 0){
							if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
								checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
									if(resIdentifierID.err_code > 0){
										//get identifier
										qString = {};
										qString.eligibility_response_id = eligibilityResponseId;
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
								qString.eligibility_response_id = eligibilityResponseId;
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
							res.json({"err_code": 501, "err_msg": "EligibilityResponse Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		eligibilityResponseInsurance: function getEligibilityResponseInsurance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var eligibilityResponseId = req.params.eligibility_response_id;
			var eligibilityResponseInsuranceId = req.params.insurance_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "eligibility_response_id|" + eligibilityResponseId, 'eligibility_response', function(resEligibilityResponse){
						if(resEligibilityResponse.err_code > 0){
							if(typeof eligibilityResponseInsuranceId !== 'undefined' && !validator.isEmpty(eligibilityResponseInsuranceId)){
								checkUniqeValue(apikey, "insurance_id|" + eligibilityResponseInsuranceId, 'eligibility_response_insurance', function(resEligibilityResponseInsuranceID){
									if(resEligibilityResponseInsuranceID.err_code > 0){
										//get eligibilityResponseInsurance
										qString = {};
										qString.eligibility_response_id = eligibilityResponseId;
										qString._id = eligibilityResponseInsuranceId;
										seedPhoenixFHIR.path.GET = {
											"EligibilityResponseInsurance" : {
												"location": "%(apikey)s/EligibilityResponseInsurance",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('EligibilityResponseInsurance', {"apikey": apikey}, {}, function(error, response, body){
											eligibilityResponseInsurance = JSON.parse(body);
											if(eligibilityResponseInsurance.err_code == 0){
												//res.json({"err_code": 0, "data":eligibilityResponseInsurance.data});	
												if(eligibilityResponseInsurance.data.length > 0){
													newEligibilityResponseInsurance = [];
													for(i=0; i < eligibilityResponseInsurance.data.length; i++){
														myEmitter.once('getEligibilityResponseBenefitBalance', function(eligibilityResponseInsurance, index, newEligibilityResponseInsurance, countEligibilityResponseInsurance){	
														var objectEligibilityResponseInsurance = {};
														objectEligibilityResponseInsurance.id = eligibilityResponseInsurance.id;
														objectEligibilityResponseInsurance.coverage = eligibilityResponseInsurance.coverage;
														objectEligibilityResponseInsurance.contract = eligibilityResponseInsurance.contract;
														objectEligibilityResponseInsurance.benefitBalance	= host + ':' + port + '/' + apikey + '/EligibilityResponseInsurance/' +  eligibilityResponseInsurance.id + '/EligibilityResponseBenefitBalance';
														newEligibilityResponseInsurance[index] = objectEligibilityResponseInsurance;

														if(index == countEligibilityResponseInsurance -1 ){
															res.json({"err_code": 0, "data":newEligibilityResponseInsurance});	
														}
														})
														myEmitter.emit('getEligibilityResponseBenefitBalance', eligibilityResponseInsurance.data[i], i, newEligibilityResponseInsurance, eligibilityResponseInsurance.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Eligibility Response Insurance is empty."});	
												}
											}else{
												res.json(eligibilityResponseInsurance);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Eligibility Response Insurance Id not found"});		
									}
								})
							}else{
								//get eligibilityResponseInsurance
								qString = {};
								qString.eligibility_response_id = eligibilityResponseId;
								seedPhoenixFHIR.path.GET = {
									"EligibilityResponseInsurance" : {
										"location": "%(apikey)s/EligibilityResponseInsurance",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('EligibilityResponseInsurance', {"apikey": apikey}, {}, function(error, response, body){
									eligibilityResponseInsurance = JSON.parse(body);
									if(eligibilityResponseInsurance.err_code == 0){
										//res.json({"err_code": 0, "data":eligibilityResponseInsurance.data});	
										if(eligibilityResponseInsurance.data.length > 0){
											newEligibilityResponseInsurance = [];
											for(i=0; i < eligibilityResponseInsurance.data.length; i++){
												myEmitter.once('getEligibilityResponseBenefitBalance', function(eligibilityResponseInsurance, index, newEligibilityResponseInsurance, countEligibilityResponseInsurance){	
												var objectEligibilityResponseInsurance = {};
												objectEligibilityResponseInsurance.id = eligibilityResponseInsurance.id;
												objectEligibilityResponseInsurance.coverage = eligibilityResponseInsurance.coverage;
												objectEligibilityResponseInsurance.contract = eligibilityResponseInsurance.contract;
												objectEligibilityResponseInsurance.benefitBalance	= host + ':' + port + '/' + apikey + '/EligibilityResponseInsurance/' +  eligibilityResponseInsurance.id + '/EligibilityResponseBenefitBalance';
												newEligibilityResponseInsurance[index] = objectEligibilityResponseInsurance;

												if(index == countEligibilityResponseInsurance -1 ){
													res.json({"err_code": 0, "data":newEligibilityResponseInsurance});	
												}
												})
												myEmitter.emit('getEligibilityResponseBenefitBalance', eligibilityResponseInsurance.data[i], i, newEligibilityResponseInsurance, eligibilityResponseInsurance.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Eligibility Response Insurance is empty."});	
										}
									}else{
										res.json(eligibilityResponseInsurance);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Eligibility Response Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		eligibilityResponseBenefitBalance: function getEligibilityResponseBenefitBalance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var eligibilityResponseId = req.params.insurance_id;
			var eligibilityResponseBenefitBalanceId = req.params.benefit_balance_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "eligibility_response_insurance_id|" + eligibilityResponseId, 'eligibility_response_insurance', function(resEligibilityResponse){
						if(resEligibilityResponse.err_code > 0){
							if(typeof eligibilityResponseBenefitBalanceId !== 'undefined' && !validator.isEmpty(eligibilityResponseBenefitBalanceId)){
								checkUniqeValue(apikey, "benefit_balance_id|" + eligibilityResponseBenefitBalanceId, 'eligibility_response_benefit_balance', function(resEligibilityResponseBenefitBalanceID){
									if(resEligibilityResponseBenefitBalanceID.err_code > 0){
										//get eligibilityResponseBenefitBalance
										qString = {};
										qString.eligibility_response_insure_id = eligibilityResponseId;
										qString._id = eligibilityResponseBenefitBalanceId;
										seedPhoenixFHIR.path.GET = {
											"EligibilityResponseBenefitBalance" : {
												"location": "%(apikey)s/EligibilityResponseBenefitBalance",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('EligibilityResponseBenefitBalance', {"apikey": apikey}, {}, function(error, response, body){
											eligibilityResponseBenefitBalance = JSON.parse(body);
											if(eligibilityResponseBenefitBalance.err_code == 0){
												//res.json({"err_code": 0, "data":eligibilityResponseBenefitBalance.data});	
												if(eligibilityResponseBenefitBalance.data.length > 0){
													newEligibilityResponseBenefitBalance = [];
													for(i=0; i < eligibilityResponseBenefitBalance.data.length; i++){
														myEmitter.once('getEligibilityResponseFinancial', function(eligibilityResponseBenefitBalance, index, newEligibilityResponseBenefitBalance, countEligibilityResponseBenefitBalance){
															qString = {};
															qString.eligibility_response_benefit_balance_id = eligibilityResponseBenefitBalance.id;
															seedPhoenixFHIR.path.GET = {
																"EligibilityResponseFinancial" : {
																	"location": "%(apikey)s/EligibilityResponseFinancial",
																	"query": qString
																}
															}

															var ApiFHIR = new Apiclient(seedPhoenixFHIR);

															ApiFHIR.get('EligibilityResponseFinancial', {"apikey": apikey}, {}, function(error, response, body){
																eligibilityResponseFinancial = JSON.parse(body);
																if(eligibilityResponseFinancial.err_code == 0){
																	var objectEligibilityResponseBenefitBalance = {};
																	objectEligibilityResponseBenefitBalance.id = eligibilityResponseBenefitBalance.id;
																	objectEligibilityResponseBenefitBalance.category = eligibilityResponseBenefitBalance.category;
																	objectEligibilityResponseBenefitBalance.subCategory = eligibilityResponseBenefitBalance.subCategory;
																	objectEligibilityResponseBenefitBalance.excluded = eligibilityResponseBenefitBalance.excluded;
																	objectEligibilityResponseBenefitBalance.name = eligibilityResponseBenefitBalance.name;
																	objectEligibilityResponseBenefitBalance.description = eligibilityResponseBenefitBalance.description;
																	objectEligibilityResponseBenefitBalance.network = eligibilityResponseBenefitBalance.network;
																	objectEligibilityResponseBenefitBalance.unit = eligibilityResponseBenefitBalance.unit;
																	objectEligibilityResponseBenefitBalance.term = eligibilityResponseBenefitBalance.term;
																	objectEligibilityResponseBenefitBalance.financial = eligibilityResponseFinancial.data;
																	newEligibilityResponseBenefitBalance[index] = objectEligibilityResponseBenefitBalance;

																	if(index == countEligibilityResponseBenefitBalance -1 ){
																		res.json({"err_code": 0, "data":newEligibilityResponseBenefitBalance});	
																	}
																}else{
																	res.json(eligibilityResponseFinancial);			
																}
															})
														})
														myEmitter.emit('getEligibilityResponseFinancial', eligibilityResponseBenefitBalance.data[i], i, newEligibilityResponseBenefitBalance, eligibilityResponseBenefitBalance.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Eligibility Response Benefit Balance is empty."});	
												}
											}else{
												res.json(eligibilityResponseBenefitBalance);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Eligibility Response Benefit Balance Id not found"});		
									}
								})
							}else{
								//get eligibilityResponseBenefitBalance
								qString = {};
								qString.eligibility_response_insure_id = eligibilityResponseId;
								seedPhoenixFHIR.path.GET = {
									"EligibilityResponseBenefitBalance" : {
										"location": "%(apikey)s/EligibilityResponseBenefitBalance",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('EligibilityResponseBenefitBalance', {"apikey": apikey}, {}, function(error, response, body){
									eligibilityResponseBenefitBalance = JSON.parse(body);
									if(eligibilityResponseBenefitBalance.err_code == 0){
										//res.json({"err_code": 0, "data":eligibilityResponseBenefitBalance.data});	
										if(eligibilityResponseBenefitBalance.data.length > 0){
											newEligibilityResponseBenefitBalance = [];
											for(i=0; i < eligibilityResponseBenefitBalance.data.length; i++){
												myEmitter.once('getEligibilityResponseFinancial', function(eligibilityResponseBenefitBalance, index, newEligibilityResponseBenefitBalance, countEligibilityResponseBenefitBalance){
													qString = {};
													qString.eligibility_response_benefit_balance_id = eligibilityResponseBenefitBalance.id;
													seedPhoenixFHIR.path.GET = {
														"EligibilityResponseFinancial" : {
															"location": "%(apikey)s/EligibilityResponseFinancial",
															"query": qString
														}
													}

													var ApiFHIR = new Apiclient(seedPhoenixFHIR);

													ApiFHIR.get('EligibilityResponseFinancial', {"apikey": apikey}, {}, function(error, response, body){
														eligibilityResponseFinancial = JSON.parse(body);
														if(eligibilityResponseFinancial.err_code == 0){
															var objectEligibilityResponseBenefitBalance = {};
															objectEligibilityResponseBenefitBalance.id = eligibilityResponseBenefitBalance.id;
															objectEligibilityResponseBenefitBalance.category = eligibilityResponseBenefitBalance.category;
															objectEligibilityResponseBenefitBalance.subCategory = eligibilityResponseBenefitBalance.subCategory;
															objectEligibilityResponseBenefitBalance.excluded = eligibilityResponseBenefitBalance.excluded;
															objectEligibilityResponseBenefitBalance.name = eligibilityResponseBenefitBalance.name;
															objectEligibilityResponseBenefitBalance.description = eligibilityResponseBenefitBalance.description;
															objectEligibilityResponseBenefitBalance.network = eligibilityResponseBenefitBalance.network;
															objectEligibilityResponseBenefitBalance.unit = eligibilityResponseBenefitBalance.unit;
															objectEligibilityResponseBenefitBalance.term = eligibilityResponseBenefitBalance.term;
															objectEligibilityResponseBenefitBalance.financial = eligibilityResponseFinancial.data;
															newEligibilityResponseBenefitBalance[index] = objectEligibilityResponseBenefitBalance;

															if(index == countEligibilityResponseBenefitBalance -1 ){
																res.json({"err_code": 0, "data":newEligibilityResponseBenefitBalance});	
															}
														}else{
															res.json(eligibilityResponseFinancial);			
														}
													})
												})
												myEmitter.emit('getEligibilityResponseFinancial', eligibilityResponseBenefitBalance.data[i], i, newEligibilityResponseBenefitBalance, eligibilityResponseBenefitBalance.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Eligibility Response Benefit Balance is empty."});	
										}
									}else{
										res.json(eligibilityResponseBenefitBalance);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Eligibility Response Id not found"});		
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
		eligibilityResponse: function addEligibilityResponse(req, res) {
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
        err_msg = "Please add sub-key 'use' in json identifier request.";
      }
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
			
/*
status|status|||
created|created|date||
requestProvider|requestProvider|||
requestOrganization|requestOrganization|||
request|request|||
outcome|outcome|||
disposition|disposition|||
insurer|insurer|||
inforce|inforce|boolean||
insurance.coverage|insuranceCoverage|||
insurance.contract|insuranceContract|||
insurance.benefitBalance.category|insuranceBenefitBalanceCategory||n|
insurance.benefitBalance.subCategory|insuranceBenefitBalanceSubCategory|||u
insurance.benefitBalance.excluded|insuranceBenefitBalanceExcluded|||
insurance.benefitBalance.name|insuranceBenefitBalanceName|||
insurance.benefitBalance.description|insuranceBenefitBalanceDescription|||
insurance.benefitBalance.network|insuranceBenefitBalanceNetwork|||
insurance.benefitBalance.unit|insuranceBenefitBalanceUnit|||
insurance.benefitBalance.term|insuranceBenefitBalanceTerm|||
insurance.benefitBalance.financial.type|insuranceBenefitBalanceFinancialType||n|
insurance.benefitBalance.financial.allowed.allowedUnsignedInt|insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt|integer||
insurance.benefitBalance.financial.allowed.allowedString|insuranceBenefitBalanceFinancialAllowedAllowedString|||
insurance.benefitBalance.financial.allowed.allowedMoney|insuranceBenefitBalanceFinancialAllowedAllowedMoney|||
insurance.benefitBalance.financial.used.usedUnsignedInt|insuranceBenefitBalanceFinancialUsedUsedUnsignedInt|integer||
insurance.benefitBalance.financial.used.usedMoney|insuranceBenefitBalanceFinancialUsedUsedMoney|||
form|form|||
error.code|errorCode||n|

*/			
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Eligibility Response request.";
			}

			if(typeof req.body.created !== 'undefined'){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					created = "";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "Eligibility Response created invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'created' in json Eligibility Response request.";
			}

			if(typeof req.body.requestProvider !== 'undefined'){
				var requestProvider =  req.body.requestProvider.trim().toLowerCase();
				if(validator.isEmpty(requestProvider)){
					requestProvider = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'request provider' in json Eligibility Response request.";
			}

			if(typeof req.body.requestOrganization !== 'undefined'){
				var requestOrganization =  req.body.requestOrganization.trim().toLowerCase();
				if(validator.isEmpty(requestOrganization)){
					requestOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'request organization' in json Eligibility Response request.";
			}

			if(typeof req.body.request !== 'undefined'){
				var request =  req.body.request.trim().toLowerCase();
				if(validator.isEmpty(request)){
					request = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'request' in json Eligibility Response request.";
			}

			if(typeof req.body.outcome !== 'undefined'){
				var outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					outcome = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'outcome' in json Eligibility Response request.";
			}

			if(typeof req.body.disposition !== 'undefined'){
				var disposition =  req.body.disposition.trim().toLowerCase();
				if(validator.isEmpty(disposition)){
					disposition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'disposition' in json Eligibility Response request.";
			}

			if(typeof req.body.insurer !== 'undefined'){
				var insurer =  req.body.insurer.trim().toLowerCase();
				if(validator.isEmpty(insurer)){
					insurer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurer' in json Eligibility Response request.";
			}

			if (typeof req.body.inforce !== 'undefined') {
				var inforce = req.body.inforce.trim().toLowerCase();
					if(validator.isEmpty(inforce)){
						inforce = "false";
					}
				if(inforce === "true" || inforce === "false"){
					inforce = inforce;
				} else {
					err_code = 2;
					err_msg = "Eligibility Response inforce is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'inforce' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.coverage !== 'undefined'){
				var insuranceCoverage =  req.body.insurance.coverage.trim().toLowerCase();
				if(validator.isEmpty(insuranceCoverage)){
					insuranceCoverage = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance coverage' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.contract !== 'undefined'){
				var insuranceContract =  req.body.insurance.contract.trim().toLowerCase();
				if(validator.isEmpty(insuranceContract)){
					insuranceContract = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance contract' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.benefitBalance.category !== 'undefined'){
				var insuranceBenefitBalanceCategory =  req.body.insurance.benefitBalance.category.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceCategory)){
					err_code = 2;
					err_msg = "Eligibility Response insurance benefit balance category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance category' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.benefitBalance.subCategory !== 'undefined'){
				var insuranceBenefitBalanceSubCategory =  req.body.insurance.benefitBalance.subCategory.trim().toUpperCase();
				if(validator.isEmpty(insuranceBenefitBalanceSubCategory)){
					insuranceBenefitBalanceSubCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance sub category' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.benefitBalance.excluded !== 'undefined'){
				var insuranceBenefitBalanceExcluded =  req.body.insurance.benefitBalance.excluded.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceExcluded)){
					insuranceBenefitBalanceExcluded = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance excluded' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.benefitBalance.name !== 'undefined'){
				var insuranceBenefitBalanceName =  req.body.insurance.benefitBalance.name.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceName)){
					insuranceBenefitBalanceName = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance name' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.benefitBalance.description !== 'undefined'){
				var insuranceBenefitBalanceDescription =  req.body.insurance.benefitBalance.description.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceDescription)){
					insuranceBenefitBalanceDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance description' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.benefitBalance.network !== 'undefined'){
				var insuranceBenefitBalanceNetwork =  req.body.insurance.benefitBalance.network.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceNetwork)){
					insuranceBenefitBalanceNetwork = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance network' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.benefitBalance.unit !== 'undefined'){
				var insuranceBenefitBalanceUnit =  req.body.insurance.benefitBalance.unit.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceUnit)){
					insuranceBenefitBalanceUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance unit' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.benefitBalance.term !== 'undefined'){
				var insuranceBenefitBalanceTerm =  req.body.insurance.benefitBalance.term.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceTerm)){
					insuranceBenefitBalanceTerm = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance term' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.benefitBalance.financial.type !== 'undefined'){
				var insuranceBenefitBalanceFinancialType =  req.body.insurance.benefitBalance.financial.type.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialType)){
					err_code = 2;
					err_msg = "Eligibility Response insurance benefit balance financial type is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance financial type' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.benefitBalance.financial.allowed.allowedUnsignedInt !== 'undefined'){
				var insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt =  req.body.insurance.benefitBalance.financial.allowed.allowedUnsignedInt.trim();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt)){
					insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt = "";
				}else{
					if(!validator.isInt(insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt)){
						err_code = 2;
						err_msg = "Eligibility Response insurance benefit balance financial allowed allowed unsigned int is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance financial allowed allowed unsigned int' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.benefitBalance.financial.allowed.allowedString !== 'undefined'){
				var insuranceBenefitBalanceFinancialAllowedAllowedString =  req.body.insurance.benefitBalance.financial.allowed.allowedString.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialAllowedAllowedString)){
					insuranceBenefitBalanceFinancialAllowedAllowedString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance financial allowed allowed string' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.benefitBalance.financial.allowed.allowedMoney !== 'undefined'){
				var insuranceBenefitBalanceFinancialAllowedAllowedMoney =  req.body.insurance.benefitBalance.financial.allowed.allowedMoney.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialAllowedAllowedMoney)){
					insuranceBenefitBalanceFinancialAllowedAllowedMoney = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance financial allowed allowed money' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.benefitBalance.financial.used.usedUnsignedInt !== 'undefined'){
				var insuranceBenefitBalanceFinancialUsedUsedUnsignedInt =  req.body.insurance.benefitBalance.financial.used.usedUnsignedInt.trim();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialUsedUsedUnsignedInt)){
					insuranceBenefitBalanceFinancialUsedUsedUnsignedInt = "";
				}else{
					if(!validator.isInt(insuranceBenefitBalanceFinancialUsedUsedUnsignedInt)){
						err_code = 2;
						err_msg = "Eligibility Response insurance benefit balance financial used used unsigned int is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance financial used used unsigned int' in json Eligibility Response request.";
			}

			if(typeof req.body.insurance.benefitBalance.financial.used.usedMoney !== 'undefined'){
				var insuranceBenefitBalanceFinancialUsedUsedMoney =  req.body.insurance.benefitBalance.financial.used.usedMoney.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialUsedUsedMoney)){
					insuranceBenefitBalanceFinancialUsedUsedMoney = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance financial used used money' in json Eligibility Response request.";
			}

			if(typeof req.body.form !== 'undefined'){
				var form =  req.body.form.trim().toLowerCase();
				if(validator.isEmpty(form)){
					form = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'form' in json Eligibility Response request.";
			}

			if(typeof req.body.error.code !== 'undefined'){
				var errorCode =  req.body.error.code.trim().toLowerCase();
				if(validator.isEmpty(errorCode)){
					err_code = 2;
					err_msg = "Eligibility Response error code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'error code' in json Eligibility Response request.";
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
														var eligibilityResponseId = 'ers' + unicId;
														var insuranceId = 'eri' + unicId;
														var benefitBalanceId = 'erb' + unicId;
														var financialId = 'erf' + unicId;
														var errorId = 'ere' + unicId;
														
														dataEligibilityResponse = {
															"eligibility_response_id" : eligibilityResponseId,
															"status" : status,
															"created" : created,
															"request_provider" : requestProvider,
															"request_organization" : requestOrganization,
															"request" : request,
															"outcome" : outcome,
															"disposition" : disposition,
															"insurer" : insurer,
															"inforce" : inforce,
															"form" : form
														}
														console.log(dataEligibilityResponse);
														ApiFHIR.post('eligibilityResponse', {"apikey": apikey}, {body: dataEligibilityResponse, json: true}, function(error, response, body){
															eligibilityResponse = body;
															if(eligibilityResponse.err_code > 0){
																res.json(eligibilityResponse);
															}
														});
														
														dataEligibilityResponseInsurance = {
															"insurance_id" : insuranceId,
															"coverage" : insuranceCoverage,
															"contract" : insuranceContract,
															"eligibility_response_id" : eligibilityResponseId
														}
														ApiFHIR.post('eligibilityResponseInsurance', {"apikey": apikey}, {body: dataEligibilityResponseInsurance, json: true}, function(error, response, body){
															eligibilityResponseInsurance = body;
															if(eligibilityResponseInsurance.err_code > 0){
																res.json(eligibilityResponseInsurance);	
															}
														});
														
														dataEligibilityResponseError = {
															"error_id" : errorId,
															"code" : errorCode,
															"eligibility_response_id" : eligibilityResponseId
														}
														ApiFHIR.post('eligibilityResponseError', {"apikey": apikey}, {body: dataEligibilityResponseError, json: true}, function(error, response, body){
															eligibilityResponseError = body;
															if(eligibilityResponseError.err_code > 0){
																res.json(eligibilityResponseError);	
															}
														});

														dataEligibilityResponseBenefitBalance = {
															"benefit_balance_id" : benefitBalanceId,
															"category" : insuranceBenefitBalanceCategory,
															"sub_category" : insuranceBenefitBalanceSubCategory,
															"excluded" : insuranceBenefitBalanceExcluded,
															"name" : insuranceBenefitBalanceName,
															"description" : insuranceBenefitBalanceDescription,
															"network" : insuranceBenefitBalanceNetwork,
															"unit" : insuranceBenefitBalanceUnit,
															"term" : insuranceBenefitBalanceTerm,
															"insurance_id" : insuranceId
														}
														ApiFHIR.post('eligibilityResponseBenefitBalance', {"apikey": apikey}, {body: dataEligibilityResponseBenefitBalance, json: true}, function(error, response, body){
															eligibilityResponseBenefitBalance = body;
															if(eligibilityResponseBenefitBalance.err_code > 0){
																res.json(eligibilityResponseBenefitBalance);	
															}
														});

														dataEligibilityResponseFinancial = {
															"financial_id" : financialId,
															"type" : insuranceBenefitBalanceFinancialType,
															"allowed_unsigned_int" : insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt,
															"allowed_string" : insuranceBenefitBalanceFinancialAllowedAllowedString,
															"allowed_money" : insuranceBenefitBalanceFinancialAllowedAllowedMoney,
															"used_unsigned_int" : insuranceBenefitBalanceFinancialUsedUsedUnsignedInt,
															"used_money" : insuranceBenefitBalanceFinancialUsedUsedMoney,
															"benefit_balance_id" : benefitBalanceId
														}
														ApiFHIR.post('eligibilityResponseFinancial', {"apikey": apikey}, {body: dataEligibilityResponseFinancial, json: true}, function(error, response, body){
															eligibilityResponseFinancial = body;
															if(eligibilityResponseFinancial.err_code > 0){
																res.json(eligibilityResponseFinancial);	
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
																							"eligibility_response_id" : eligibilityResponseId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														
														res.json({"err_code": 0, "err_msg": "EligibilityResponse has been add.", "data": [{"_id": eligibilityResponseId}]});
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

										myEmitter.prependOnceListener('checkInsuranceBenefitBalanceCategory', function () {
											if (!validator.isEmpty(insuranceBenefitBalanceCategory)) {
												checkCode(apikey, insuranceBenefitBalanceCategory, 'BENEFIT_CATEGORY', function (resInsuranceBenefitBalanceCategoryCode) {
													if (resInsuranceBenefitBalanceCategoryCode.err_code > 0) {
														myEmitter.emit('checkOutcome');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurance benefit balance category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOutcome');
											}
										})

										myEmitter.prependOnceListener('checkInsuranceBenefitBalanceSubCategory', function () {
											if (!validator.isEmpty(insuranceBenefitBalanceSubCategory)) {
												checkCode(apikey, insuranceBenefitBalanceSubCategory, 'BENEFIT_SUBCATEGORY', function (resInsuranceBenefitBalanceSubCategoryCode) {
													if (resInsuranceBenefitBalanceSubCategoryCode.err_code > 0) {
														myEmitter.emit('checkInsuranceBenefitBalanceCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurance benefit balance sub category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInsuranceBenefitBalanceCategory');
											}
										})

										myEmitter.prependOnceListener('checkInsuranceBenefitBalanceNetwork', function () {
											if (!validator.isEmpty(insuranceBenefitBalanceNetwork)) {
												checkCode(apikey, insuranceBenefitBalanceNetwork, 'BENEFIT_NETWORK', function (resInsuranceBenefitBalanceNetworkCode) {
													if (resInsuranceBenefitBalanceNetworkCode.err_code > 0) {
														myEmitter.emit('checkInsuranceBenefitBalanceSubCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurance benefit balance network code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInsuranceBenefitBalanceSubCategory');
											}
										})

										myEmitter.prependOnceListener('checkInsuranceBenefitBalanceUnit', function () {
											if (!validator.isEmpty(insuranceBenefitBalanceUnit)) {
												checkCode(apikey, insuranceBenefitBalanceUnit, 'BENEFIT_UNIT', function (resInsuranceBenefitBalanceUnitCode) {
													if (resInsuranceBenefitBalanceUnitCode.err_code > 0) {
														myEmitter.emit('checkInsuranceBenefitBalanceNetwork');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurance benefit balance unit code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInsuranceBenefitBalanceNetwork');
											}
										})

										myEmitter.prependOnceListener('checkInsuranceBenefitBalanceTerm', function () {
											if (!validator.isEmpty(insuranceBenefitBalanceTerm)) {
												checkCode(apikey, insuranceBenefitBalanceTerm, 'BENEFIT_TERM', function (resInsuranceBenefitBalanceTermCode) {
													if (resInsuranceBenefitBalanceTermCode.err_code > 0) {
														myEmitter.emit('checkInsuranceBenefitBalanceUnit');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurance benefit balance term code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInsuranceBenefitBalanceUnit');
											}
										})

										myEmitter.prependOnceListener('checkInsuranceBenefitBalanceFinancialType', function () {
											if (!validator.isEmpty(insuranceBenefitBalanceFinancialType)) {
												checkCode(apikey, insuranceBenefitBalanceFinancialType, 'BENEFIT_TYPE', function (resInsuranceBenefitBalanceFinancialTypeCode) {
													if (resInsuranceBenefitBalanceFinancialTypeCode.err_code > 0) {
														myEmitter.emit('checkInsuranceBenefitBalanceTerm');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurance benefit balance financial type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInsuranceBenefitBalanceTerm');
											}
										})

										myEmitter.prependOnceListener('checkForm', function () {
											if (!validator.isEmpty(form)) {
												checkCode(apikey, form, 'FORMS', function (resFormCode) {
													if (resFormCode.err_code > 0) {
														myEmitter.emit('checkInsuranceBenefitBalanceFinancialType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Form code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInsuranceBenefitBalanceFinancialType');
											}
										})

										myEmitter.prependOnceListener('checkErrorCode', function () {
											if (!validator.isEmpty(errorCode)) {
												checkCode(apikey, errorCode, 'ADJUDICATION_ERROR', function (resErrorCodeCode) {
													if (resErrorCodeCode.err_code > 0) {
														myEmitter.emit('checkForm');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Error code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkForm');
											}
										})
										
										myEmitter.prependOnceListener('checkRequestProvider', function () {
											if (!validator.isEmpty(requestProvider)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + requestProvider, 'PRACTITIONER', function (resRequestProvider) {
													if (resRequestProvider.err_code > 0) {
														myEmitter.emit('checkErrorCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Request provider id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkErrorCode');
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
												checkUniqeValue(apikey, "ELIGIBILITY_REQUEST_ID|" + request, 'ELIGIBILITY_REQUEST', function (resRequest) {
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

										myEmitter.prependOnceListener('checkInsurer', function () {
											if (!validator.isEmpty(insurer)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + insurer, 'ORGANIZATION', function (resInsurer) {
													if (resInsurer.err_code > 0) {
														myEmitter.emit('checkRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurer id not found"
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
														myEmitter.emit('checkInsurer');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurance coverage id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInsurer');
											}
										})

										if (!validator.isEmpty(insuranceContract)) {
											checkUniqeValue(apikey, "CONTRACT_ID|" + insuranceContract, 'CONTRACT', function (resInsuranceContract) {
												if (resInsuranceContract.err_code > 0) {
													myEmitter.emit('checkInsuranceCoverage');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Insurance contract id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkInsuranceCoverage');
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
      var eligibilityResponseId = req.params.eligibility_response_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof eligibilityResponseId !== 'undefined') {
        if (validator.isEmpty(eligibilityResponseId)) {
          err_code = 2;
          err_msg = "Eligibility Request id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Eligibility Request id is required";
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
        err_msg = "Please add key 'use' in json request.";
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
        err_msg = "Please add key 'type' in json request.";
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
        err_msg = "Please add key 'value' in json request.";
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
                        checkUniqeValue(apikey, "ELIGIBILITY_REQUEST_ID|" + eligibilityResponseId, 'ELIGIBILITY_REQUEST', function (resEncounterID) {
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
                              "eligibility_response_id": eligibilityResponseId
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
                                  "err_msg": "Identifier has been add in this EligibilityResponse.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
                              }
                            })
                          } else {
                            res.json({
                              "err_code": 503,
                              "err_msg": "EligibilityResponse Id not found"
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
		eligibilityResponseInsurance: function addEligibilityResponseInsurance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var eligibilityResponseId = req.params.eligibility_response_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof eligibilityResponseId !== 'undefined'){
				if(validator.isEmpty(eligibilityResponseId)){
					err_code = 2;
					err_msg = "Eligibility Response id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Eligibility Response id is required";
			}
			
			if(typeof req.body.coverage !== 'undefined'){
				var insuranceCoverage =  req.body.coverage.trim().toLowerCase();
				if(validator.isEmpty(insuranceCoverage)){
					insuranceCoverage = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance coverage' in json Eligibility Response request.";
			}

			if(typeof req.body.contract !== 'undefined'){
				var insuranceContract =  req.body.contract.trim().toLowerCase();
				if(validator.isEmpty(insuranceContract)){
					insuranceContract = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance contract' in json Eligibility Response request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkEligibilityResponseID', function(){
							checkUniqeValue(apikey, "ELIGIBILITY_RESPONSE_ID|" + eligibilityResponseId, 'ELIGIBILITY_RESPONSE', function(resEligibilityResponseID){
								if(resEligibilityResponseID.err_code > 0){
									var unicId = uniqid.time();
									var eligibilityResponseInsuranceId = 'eri' + unicId;
									//EligibilityResponseInsurance
									dataEligibilityResponseInsurance = {
										"insurance_id" : eligibilityResponseInsuranceId,
										"coverage" : insuranceCoverage,
										"contract" : insuranceContract,
										"eligibility_response_id" : eligibilityResponseId
									}
									ApiFHIR.post('eligibilityResponseInsurance', {"apikey": apikey}, {body: dataEligibilityResponseInsurance, json: true}, function(error, response, body){
										eligibilityResponseInsurance = body;
										if(eligibilityResponseInsurance.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Eligibility Response Insurance has been add in this Eligibility Response.", "data": eligibilityResponseInsurance.data});
										}else{
											res.json(eligibilityResponseInsurance);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Eligibility Response Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkInsuranceCoverage', function () {
							if (!validator.isEmpty(insuranceCoverage)) {
								checkUniqeValue(apikey, "COVERAGE_ID|" + insuranceCoverage, 'COVERAGE', function (resInsuranceCoverage) {
									if (resInsuranceCoverage.err_code > 0) {
										myEmitter.emit('checkEligibilityResponseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurance coverage id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkEligibilityResponseID');
							}
						})

						if (!validator.isEmpty(insuranceContract)) {
							checkUniqeValue(apikey, "CONTRACT_ID|" + insuranceContract, 'CONTRACT', function (resInsuranceContract) {
								if (resInsuranceContract.err_code > 0) {
									myEmitter.emit('checkInsuranceCoverage');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Insurance contract id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkInsuranceCoverage');
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
		eligibilityResponseBenefitBalance: function addEligibilityResponseBenefitBalance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var insuranceId = req.params.eligibility_response_insure_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof insuranceId !== 'undefined'){
				if(validator.isEmpty(insuranceId)){
					err_code = 2;
					err_msg = "Eligibility Response insurance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Eligibility Response insurance id is required";
			}
			
			if(typeof req.body.category !== 'undefined'){
				var insuranceBenefitBalanceCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceCategory)){
					err_code = 2;
					err_msg = "Eligibility Response insurance benefit balance category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance category' in json Eligibility Response request.";
			}

			if(typeof req.body.subCategory !== 'undefined'){
				var insuranceBenefitBalanceSubCategory =  req.body.subCategory.trim().toUpperCase();
				if(validator.isEmpty(insuranceBenefitBalanceSubCategory)){
					insuranceBenefitBalanceSubCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance sub category' in json Eligibility Response request.";
			}

			if(typeof req.body.excluded !== 'undefined'){
				var insuranceBenefitBalanceExcluded =  req.body.excluded.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceExcluded)){
					insuranceBenefitBalanceExcluded = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance excluded' in json Eligibility Response request.";
			}

			if(typeof req.body.name !== 'undefined'){
				var insuranceBenefitBalanceName =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceName)){
					insuranceBenefitBalanceName = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance name' in json Eligibility Response request.";
			}

			if(typeof req.body.description !== 'undefined'){
				var insuranceBenefitBalanceDescription =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceDescription)){
					insuranceBenefitBalanceDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance description' in json Eligibility Response request.";
			}

			if(typeof req.body.network !== 'undefined'){
				var insuranceBenefitBalanceNetwork =  req.body.network.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceNetwork)){
					insuranceBenefitBalanceNetwork = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance network' in json Eligibility Response request.";
			}

			if(typeof req.body.unit !== 'undefined'){
				var insuranceBenefitBalanceUnit =  req.body.unit.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceUnit)){
					insuranceBenefitBalanceUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance unit' in json Eligibility Response request.";
			}

			if(typeof req.body.term !== 'undefined'){
				var insuranceBenefitBalanceTerm =  req.body.term.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceTerm)){
					insuranceBenefitBalanceTerm = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance term' in json Eligibility Response request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkEligibilityResponseID', function(){
							checkUniqeValue(apikey, "INSURANCE_ID|" + insuranceId, 'ELIGIBILITY_RESPONSE_INSURANCE', function(resEligibilityResponseID){
								if(resEligibilityResponseID.err_code > 0){
									var unicId = uniqid.time();
									var eligibilityResponseBenefitBalanceId = 'erb' + unicId;
									//EligibilityResponseBenefitBalance
									dataEligibilityResponseBenefitBalance = {
										"benefit_balance_id" : eligibilityResponseBenefitBalanceId,
										"category" : insuranceBenefitBalanceCategory,
										"sub_category" : insuranceBenefitBalanceSubCategory,
										"excluded" : insuranceBenefitBalanceExcluded,
										"name" : insuranceBenefitBalanceName,
										"description" : insuranceBenefitBalanceDescription,
										"network" : insuranceBenefitBalanceNetwork,
										"unit" : insuranceBenefitBalanceUnit,
										"term" : insuranceBenefitBalanceTerm,
										"insurance_id" : insuranceId
									}
									ApiFHIR.post('eligibilityResponseBenefitBalance', {"apikey": apikey}, {body: dataEligibilityResponseBenefitBalance, json: true}, function(error, response, body){
										eligibilityResponseBenefitBalance = body;
										if(eligibilityResponseBenefitBalance.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Eligibility Response Benefit Balance has been add in this Eligibility Response.", "data": eligibilityResponseBenefitBalance.data});
										}else{
											res.json(eligibilityResponseBenefitBalance);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Eligibility Response Iinsurance id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkInsuranceBenefitBalanceCategory', function () {
							if (!validator.isEmpty(insuranceBenefitBalanceCategory)) {
								checkCode(apikey, insuranceBenefitBalanceCategory, 'BENEFIT_CATEGORY', function (resInsuranceBenefitBalanceCategoryCode) {
									if (resInsuranceBenefitBalanceCategoryCode.err_code > 0) {
										myEmitter.emit('checkEligibilityResponseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurance benefit balance category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkEligibilityResponseID');
							}
						})

						myEmitter.prependOnceListener('checkInsuranceBenefitBalanceSubCategory', function () {
							if (!validator.isEmpty(insuranceBenefitBalanceSubCategory)) {
								checkCode(apikey, insuranceBenefitBalanceSubCategory, 'BENEFIT_SUBCATEGORY', function (resInsuranceBenefitBalanceSubCategoryCode) {
									if (resInsuranceBenefitBalanceSubCategoryCode.err_code > 0) {
										myEmitter.emit('checkInsuranceBenefitBalanceCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurance benefit balance sub category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInsuranceBenefitBalanceCategory');
							}
						})

						myEmitter.prependOnceListener('checkInsuranceBenefitBalanceNetwork', function () {
							if (!validator.isEmpty(insuranceBenefitBalanceNetwork)) {
								checkCode(apikey, insuranceBenefitBalanceNetwork, 'BENEFIT_NETWORK', function (resInsuranceBenefitBalanceNetworkCode) {
									if (resInsuranceBenefitBalanceNetworkCode.err_code > 0) {
										myEmitter.emit('checkInsuranceBenefitBalanceSubCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurance benefit balance network code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInsuranceBenefitBalanceSubCategory');
							}
						})

						myEmitter.prependOnceListener('checkInsuranceBenefitBalanceUnit', function () {
							if (!validator.isEmpty(insuranceBenefitBalanceUnit)) {
								checkCode(apikey, insuranceBenefitBalanceUnit, 'BENEFIT_UNIT', function (resInsuranceBenefitBalanceUnitCode) {
									if (resInsuranceBenefitBalanceUnitCode.err_code > 0) {
										myEmitter.emit('checkInsuranceBenefitBalanceNetwork');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurance benefit balance unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInsuranceBenefitBalanceNetwork');
							}
						})

						if (!validator.isEmpty(insuranceBenefitBalanceTerm)) {
							checkCode(apikey, insuranceBenefitBalanceTerm, 'BENEFIT_TERM', function (resInsuranceBenefitBalanceTermCode) {
								if (resInsuranceBenefitBalanceTermCode.err_code > 0) {
									myEmitter.emit('checkInsuranceBenefitBalanceUnit');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Insurance benefit balance term code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkInsuranceBenefitBalanceUnit');
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
		eligibilityResponseFinancial: function addEligibilityResponseFinancial(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var eligibilityResponseBenefitBalanceId = req.params.eligibility_response_benefit_balance_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof eligibilityResponseBenefitBalanceId !== 'undefined'){
				if(validator.isEmpty(eligibilityResponseBenefitBalanceId)){
					err_code = 2;
					err_msg = "Eligibility Response Benefit Balance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Eligibility Response Benefit Balance id is required";
			}
			
			if(typeof req.body.type !== 'undefined'){
				var insuranceBenefitBalanceFinancialType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialType)){
					err_code = 2;
					err_msg = "Eligibility Response insurance benefit balance financial type is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance financial type' in json Eligibility Response request.";
			}

			if(typeof req.body.allowed.allowedUnsignedInt !== 'undefined'){
				var insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt =  req.body.allowed.allowedUnsignedInt.trim();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt)){
					insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt = "";
				}else{
					if(!validator.isInt(insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt)){
						err_code = 2;
						err_msg = "Eligibility Response insurance benefit balance financial allowed allowed unsigned int is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance financial allowed allowed unsigned int' in json Eligibility Response request.";
			}

			if(typeof req.body.allowed.allowedString !== 'undefined'){
				var insuranceBenefitBalanceFinancialAllowedAllowedString =  req.body.allowed.allowedString.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialAllowedAllowedString)){
					insuranceBenefitBalanceFinancialAllowedAllowedString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance financial allowed allowed string' in json Eligibility Response request.";
			}

			if(typeof req.body.allowed.allowedMoney !== 'undefined'){
				var insuranceBenefitBalanceFinancialAllowedAllowedMoney =  req.body.allowed.allowedMoney.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialAllowedAllowedMoney)){
					insuranceBenefitBalanceFinancialAllowedAllowedMoney = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance financial allowed allowed money' in json Eligibility Response request.";
			}

			if(typeof req.body.used.usedUnsignedInt !== 'undefined'){
				var insuranceBenefitBalanceFinancialUsedUsedUnsignedInt =  req.body.used.usedUnsignedInt.trim();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialUsedUsedUnsignedInt)){
					insuranceBenefitBalanceFinancialUsedUsedUnsignedInt = "";
				}else{
					if(!validator.isInt(insuranceBenefitBalanceFinancialUsedUsedUnsignedInt)){
						err_code = 2;
						err_msg = "Eligibility Response insurance benefit balance financial used used unsigned int is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance financial used used unsigned int' in json Eligibility Response request.";
			}

			if(typeof req.body.used.usedMoney !== 'undefined'){
				var insuranceBenefitBalanceFinancialUsedUsedMoney =  req.body.used.usedMoney.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialUsedUsedMoney)){
					insuranceBenefitBalanceFinancialUsedUsedMoney = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance benefit balance financial used used money' in json Eligibility Response request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkEligibilityResponseID', function(){
							checkUniqeValue(apikey, "BENEFIT_BALANCE_ID|" + eligibilityResponseBenefitBalanceId, 'ELIGIBILITY_RESPONSE_BENEFIT_BALANCE', function(resEligibilityResponseID){
								if(resEligibilityResponseID.err_code > 0){
									var unicId = uniqid.time();
									var eligibilityResponseFinancialId = 'erf' + unicId;
									//EligibilityResponseFinancial
									dataEligibilityResponseFinancial = {
										"financial_id" : eligibilityResponseFinancialId,
										"type" : insuranceBenefitBalanceFinancialType,
										"allowed_unsigned_int" : insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt,
										"allowed_string" : insuranceBenefitBalanceFinancialAllowedAllowedString,
										"allowed_money" : insuranceBenefitBalanceFinancialAllowedAllowedMoney,
										"used_unsigned_int" : insuranceBenefitBalanceFinancialUsedUsedUnsignedInt,
										"used_money" : insuranceBenefitBalanceFinancialUsedUsedMoney,
										"benefit_balance_id" : eligibilityResponseBenefitBalanceId
									}
									ApiFHIR.post('eligibilityResponseFinancial', {"apikey": apikey}, {body: dataEligibilityResponseFinancial, json: true}, function(error, response, body){
										eligibilityResponseFinancial = body;
										if(eligibilityResponseFinancial.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Eligibility Response Financial has been add in this Eligibility Response.", "data": eligibilityResponseFinancial.data});
										}else{
											res.json(eligibilityResponseFinancial);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Eligibility Response Benefit Balance Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(insuranceBenefitBalanceFinancialType)) {
							checkCode(apikey, insuranceBenefitBalanceFinancialType, 'BENEFIT_TYPE', function (resInsuranceBenefitBalanceFinancialTypeCode) {
								if (resInsuranceBenefitBalanceFinancialTypeCode.err_code > 0) {
									myEmitter.emit('checkEligibilityResponseID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Insurance benefit balance financial type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkEligibilityResponseID');
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
		eligibilityResponseError: function addEligibilityResponseError(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var eligibilityResponseId = req.params.eligibility_response_id;

			var err_code = 0;
			var err_msg = "";

			//input check 
			if(typeof eligibilityResponseId !== 'undefined'){
				if(validator.isEmpty(eligibilityResponseId)){
					err_code = 2;
					err_msg = "Eligibility Response id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Eligibility Response id is required";
			}
			
			if(typeof req.body.code !== 'undefined'){
				var errorCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(errorCode)){
					err_code = 2;
					err_msg = "Eligibility Response error code is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'error code' in json Eligibility Response request.";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkEligibilityResponseID', function(){
							checkUniqeValue(apikey, "ELIGIBILITY_RESPONSE_ID|" + eligibilityResponseId, 'ELIGIBILITY_RESPONSE', function(resEligibilityResponseID){
								if(resEligibilityResponseID.err_code > 0){
									var unicId = uniqid.time();
									var eligibilityResponseErrorId = 'ere' + unicId;
									//EligibilityResponseError
									dataEligibilityResponseError = {
										"error_id" : errorId,
										"code" : errorCode,
										"eligibility_response_id" : eligibilityResponseId
									}
									ApiFHIR.post('eligibilityResponseError', {"apikey": apikey}, {body: dataEligibilityResponseError, json: true}, function(error, response, body){
										eligibilityResponseError = body;
										if(eligibilityResponseError.err_code == 0){
											res.json({"err_code": 0, "err_msg": "Eligibility Response Error has been add in this Eligibility Response.", "data": eligibilityResponseError.data});
										}else{
											res.json(eligibilityResponseError);	
										}
									});
								}else{
									res.json({"err_code": 504, "err_msg": "Eligibility Response Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(errorCode)) {
							checkCode(apikey, errorCode, 'ADJUDICATION_ERROR', function (resErrorCodeCode) {
								if (resErrorCodeCode.err_code > 0) {
									myEmitter.emit('checkEligibilityResponseID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Error code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkEligibilityResponseID');
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
	},
	put:{
		eligibilityResponse: function updateEligibilityResponse(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var eligibilityResponseId = req.params.eligibility_response_id;
			
			var err_code = 0;
      var err_msg = "";
      var dataEligibilityResponse = {};
			
			if (typeof eligibilityResponseId !== 'undefined') {
        if (validator.isEmpty(eligibilityResponseId)) {
          err_code = 2;
          err_msg = "Eligibility Request Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Eligibility Request Id is required.";
      }
			
			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					dataEligibilityResponse.status = "";
				}else{
					dataEligibilityResponse.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.created !== 'undefined' && req.body.created !== ""){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					err_code = 2;
					err_msg = "eligibility response created is required.";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "eligibility response created invalid date format.";	
					}else{
						dataEligibilityResponse.created = created;
					}
				}
			}else{
			  created = "";
			}

			if(typeof req.body.requestProvider !== 'undefined' && req.body.requestProvider !== ""){
				var requestProvider =  req.body.requestProvider.trim().toLowerCase();
				if(validator.isEmpty(requestProvider)){
					dataEligibilityResponse.request_provider = "";
				}else{
					dataEligibilityResponse.request_provider = requestProvider;
				}
			}else{
			  requestProvider = "";
			}

			if(typeof req.body.requestOrganization !== 'undefined' && req.body.requestOrganization !== ""){
				var requestOrganization =  req.body.requestOrganization.trim().toLowerCase();
				if(validator.isEmpty(requestOrganization)){
					dataEligibilityResponse.request_organization = "";
				}else{
					dataEligibilityResponse.request_organization = requestOrganization;
				}
			}else{
			  requestOrganization = "";
			}

			if(typeof req.body.request !== 'undefined' && req.body.request !== ""){
				var request =  req.body.request.trim().toLowerCase();
				if(validator.isEmpty(request)){
					dataEligibilityResponse.request = "";
				}else{
					dataEligibilityResponse.request = request;
				}
			}else{
			  request = "";
			}

			if(typeof req.body.outcome !== 'undefined' && req.body.outcome !== ""){
				var outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					dataEligibilityResponse.outcome = "";
				}else{
					dataEligibilityResponse.outcome = outcome;
				}
			}else{
			  outcome = "";
			}

			if(typeof req.body.disposition !== 'undefined' && req.body.disposition !== ""){
				var disposition =  req.body.disposition.trim().toLowerCase();
				if(validator.isEmpty(disposition)){
					dataEligibilityResponse.disposition = "";
				}else{
					dataEligibilityResponse.disposition = disposition;
				}
			}else{
			  disposition = "";
			}

			if(typeof req.body.insurer !== 'undefined' && req.body.insurer !== ""){
				var insurer =  req.body.insurer.trim().toLowerCase();
				if(validator.isEmpty(insurer)){
					dataEligibilityResponse.insurer = "";
				}else{
					dataEligibilityResponse.insurer = insurer;
				}
			}else{
			  insurer = "";
			}

			if (typeof req.body.inforce !== 'undefined' && req.body.inforce !== "") {
			  var inforce = req.body.inforce.trim().toLowerCase();
					if(validator.isEmpty(inforce)){
						inforce = "false";
					}
			  if(inforce === "true" || inforce === "false"){
					dataEligibilityResponse.inforce = inforce;
			  } else {
			    err_code = 2;
			    err_msg = "Eligibility response inforce is must be boolean.";
			  }
			} else {
			  inforce = "";
			}

			if(typeof req.body.form !== 'undefined' && req.body.form !== ""){
				var form =  req.body.form.trim().toLowerCase();
				if(validator.isEmpty(form)){
					dataEligibilityResponse.form = "";
				}else{
					dataEligibilityResponse.form = form;
				}
			}else{
			  form = "";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "ELIGIBILITY_REQUEST_ID|" + eligibilityResponseId, 'ELIGIBILITY_REQUEST', function (resEligibilityResponseId) {
								if (resEligibilityResponseId.err_code > 0) {
									ApiFHIR.put('eligibilityResponse', {
										"apikey": apikey,
										"_id": eligibilityResponseId
									}, {
										body: dataEligibilityResponse,
										json: true
									}, function (error, response, body) {
										eligibilityResponse = body;
										if (eligibilityResponse.err_code > 0) {
											res.json(eligibilityResponse);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "Eligibility Response has been updated.",
												"data": eligibilityResponse.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 404,
										"err_msg": "Eligibility Response Id not found"
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
						
						myEmitter.prependOnceListener('checkRequestProvider', function () {
							if (!validator.isEmpty(requestProvider)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + requestProvider, 'PRACTITIONER', function (resRequestProvider) {
									if (resRequestProvider.err_code > 0) {
										myEmitter.emit('checkForm');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Request provider id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkForm');
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
								checkUniqeValue(apikey, "ELIGIBILITY_REQUEST_ID|" + request, 'ELIGIBILITY_REQUEST', function (resRequest) {
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

						if (!validator.isEmpty(insurer)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + insurer, 'ORGANIZATION', function (resInsurer) {
								if (resInsurer.err_code > 0) {
									myEmitter.emit('checkRequest');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Insurer id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRequest');
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
      var eligibilityResponseId = req.params.eligibility_response_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof eligibilityResponseId !== 'undefined') {
        if (validator.isEmpty(eligibilityResponseId)) {
          err_code = 2;
          err_msg = "Eligibility Request id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Eligibility Request id is required";
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
            myEmitter.once('checkEligibilityResponseId', function () {
              checkUniqeValue(apikey, "ELIGIBILITY_REQUEST_ID|" + eligibilityResponseId, 'ELIGIBILITY_REQUEST', function (resEligibilityResponseId) {
                if (resEligibilityResponseId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "ELIGIBILITY_REQUEST_ID|" + eligibilityResponseId
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
                            "err_msg": "Identifier has been update in this EligibilityResponse.",
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
                    "err_msg": "EligibilityResponse Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkEligibilityResponseId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkEligibilityResponseId');
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
		eligibilityResponseInsurance: function updateEligibilityResponseInsurance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var eligibilityResponseId = req.params.eligibility_response_id;
			var eligibilityResponseInsuranceId = req.params.eligibility_response_insurance_id;

			var err_code = 0;
			var err_msg = "";
			var dataEligibilityResponse = {};
			//input check 
			if(typeof eligibilityResponseId !== 'undefined'){
				if(validator.isEmpty(eligibilityResponseId)){
					err_code = 2;
					err_msg = "Eligibility Response id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Eligibility Response id is required";
			}

			if(typeof eligibilityResponseInsuranceId !== 'undefined'){
				if(validator.isEmpty(eligibilityResponseInsuranceId)){
					err_code = 2;
					err_msg = "Eligibility Response Insurance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Eligibility Response Insurance id is required";
			}
			
			if(typeof req.body.coverage !== 'undefined' && req.body.coverage !== ""){
				var insuranceCoverage =  req.body.coverage.trim().toLowerCase();
				if(validator.isEmpty(insuranceCoverage)){
					dataEligibilityResponse.coverage = "";
				}else{
					dataEligibilityResponse.coverage = insuranceCoverage;
				}
			}else{
			  insuranceCoverage = "";
			}

			if(typeof req.body.contract !== 'undefined' && req.body.contract !== ""){
				var insuranceContract =  req.body.contract.trim().toLowerCase();
				if(validator.isEmpty(insuranceContract)){
					dataEligibilityResponse.contract = "";
				}else{
					dataEligibilityResponse.contract = insuranceContract;
				}
			}else{
			  insuranceContract = "";
			}

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkEligibilityResponseID', function(){
							checkUniqeValue(apikey, "ELIGIBILITY_RESPONSE_ID|" + eligibilityResponseId, 'ELIGIBILITY_RESPONSE', function(resEligibilityResponseId){
								if(resEligibilityResponseId.err_code > 0){
									checkUniqeValue(apikey, "INSURANCE_ID|" + eligibilityResponseInsuranceId, 'ELIGIBILITY_RESPONSE_INSURANCE', function(resEligibilityResponseInsuranceID){
										if(resEligibilityResponseInsuranceID.err_code > 0){
											ApiFHIR.put('eligibilityResponseInsurance', {"apikey": apikey, "_id": eligibilityResponseInsuranceId, "dr": "ELIGIBILITY_RESPONSE_ID|"+eligibilityResponseId}, {body: dataEligibilityResponse, json: true}, function(error, response, body){
												eligibilityResponseInsurance = body;
												if(eligibilityResponseInsurance.err_code > 0){
													res.json(eligibilityResponseInsurance);	
												}else{
													res.json({"err_code": 0, "err_msg": "Eligibility Response insurance has been update in this Eligibility Response.", "data": eligibilityResponseInsurance.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Eligibility Response insurance Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Eligibility Response Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkInsuranceCoverage', function () {
							if (!validator.isEmpty(insuranceCoverage)) {
								checkUniqeValue(apikey, "COVERAGE_ID|" + insuranceCoverage, 'COVERAGE', function (resInsuranceCoverage) {
									if (resInsuranceCoverage.err_code > 0) {
										myEmitter.emit('checkEligibilityResponseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurance coverage id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkEligibilityResponseID');
							}
						})

						if (!validator.isEmpty(insuranceContract)) {
							checkUniqeValue(apikey, "CONTRACT_ID|" + insuranceContract, 'CONTRACT', function (resInsuranceContract) {
								if (resInsuranceContract.err_code > 0) {
									myEmitter.emit('checkInsuranceCoverage');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Insurance contract id not found"
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
		eligibilityResponseBenefitBalance: function updateEligibilityResponseBenefitBalance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var eligibilityResponseId = req.params.eligibility_response_insurance_id;
			var eligibilityResponseBenefitBalanceId = req.params.eligibility_response_benefit_balance_id;

			var err_code = 0;
			var err_msg = "";
			var dataEligibilityResponse = {};
			//input check 
			if(typeof eligibilityResponseId !== 'undefined'){
				if(validator.isEmpty(eligibilityResponseId)){
					err_code = 2;
					err_msg = "Eligibility Response insurance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Eligibility Response insurance id is required";
			}

			if(typeof eligibilityResponseBenefitBalanceId !== 'undefined'){
				if(validator.isEmpty(eligibilityResponseBenefitBalanceId)){
					err_code = 2;
					err_msg = "Eligibility Response BenefitBalance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Eligibility Response BenefitBalance id is required";
			}
			
			/*
			var category  = req.body.category;
			var sub_category  = req.body.sub_category;
			var excluded  = req.body.excluded;
			var name  = req.body.name;
			var description  = req.body.description;
			var network  = req.body.network;
			var unit  = req.body.unit;
			var term  = req.body.term;
			*/
			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var insuranceBenefitBalanceCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceCategory)){
					err_code = 2;
					err_msg = "eligibility response insurance benefit balance category is required.";
				}else{
					dataEligibilityResponse.category = insuranceBenefitBalanceCategory;
				}
			}else{
			  insuranceBenefitBalanceCategory = "";
			}

			if(typeof req.body.subCategory !== 'undefined' && req.body.subCategory !== ""){
				var insuranceBenefitBalanceSubCategory =  req.body.subCategory.trim().toUpperCase();
				if(validator.isEmpty(insuranceBenefitBalanceSubCategory)){
					dataEligibilityResponse.sub_category = "";
				}else{
					dataEligibilityResponse.sub_category = insuranceBenefitBalanceSubCategory;
				}
			}else{
			  insuranceBenefitBalanceSubCategory = "";
			}

			if(typeof req.body.excluded !== 'undefined' && req.body.excluded !== ""){
				var insuranceBenefitBalanceExcluded =  req.body.excluded.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceExcluded)){
					dataEligibilityResponse.excluded = "";
				}else{
					dataEligibilityResponse.excluded = insuranceBenefitBalanceExcluded;
				}
			}else{
			  insuranceBenefitBalanceExcluded = "";
			}

			if(typeof req.body.name !== 'undefined' && req.body.name !== ""){
				var insuranceBenefitBalanceName =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceName)){
					dataEligibilityResponse.name = "";
				}else{
					dataEligibilityResponse.name = insuranceBenefitBalanceName;
				}
			}else{
			  insuranceBenefitBalanceName = "";
			}

			if(typeof req.body.description !== 'undefined' && req.body.description !== ""){
				var insuranceBenefitBalanceDescription =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceDescription)){
					dataEligibilityResponse.description = "";
				}else{
					dataEligibilityResponse.description = insuranceBenefitBalanceDescription;
				}
			}else{
			  insuranceBenefitBalanceDescription = "";
			}

			if(typeof req.body.network !== 'undefined' && req.body.network !== ""){
				var insuranceBenefitBalanceNetwork =  req.body.network.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceNetwork)){
					dataEligibilityResponse.network = "";
				}else{
					dataEligibilityResponse.network = insuranceBenefitBalanceNetwork;
				}
			}else{
			  insuranceBenefitBalanceNetwork = "";
			}

			if(typeof req.body.unit !== 'undefined' && req.body.unit !== ""){
				var insuranceBenefitBalanceUnit =  req.body.unit.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceUnit)){
					dataEligibilityResponse.unit = "";
				}else{
					dataEligibilityResponse.unit = insuranceBenefitBalanceUnit;
				}
			}else{
			  insuranceBenefitBalanceUnit = "";
			}

			if(typeof req.body.term !== 'undefined' && req.body.term !== ""){
				var insuranceBenefitBalanceTerm =  req.body.term.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceTerm)){
					dataEligibilityResponse.term = "";
				}else{
					dataEligibilityResponse.term = insuranceBenefitBalanceTerm;
				}
			}else{
			  insuranceBenefitBalanceTerm = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkEligibilityResponseID', function(){
							checkUniqeValue(apikey, "INSURANCE_ID|" + eligibilityResponseId, 'ELIGIBILITY_RESPONSE_INSURANCE', function(resEligibilityResponseId){
								if(resEligibilityResponseId.err_code > 0){
									checkUniqeValue(apikey, "BENEFIT_BALANCE_ID|" + eligibilityResponseBenefitBalanceId, 'ELIGIBILITY_RESPONSE_BENEFIT_BALANCE', function(resEligibilityResponseBenefitBalanceID){
										if(resEligibilityResponseBenefitBalanceID.err_code > 0){
											ApiFHIR.put('eligibilityResponseBenefitBalance', {"apikey": apikey, "_id": eligibilityResponseBenefitBalanceId, "dr": "INSURANCE_ID|"+eligibilityResponseId}, {body: dataEligibilityResponse, json: true}, function(error, response, body){
												eligibilityResponseBenefitBalance = body;
												if(eligibilityResponseBenefitBalance.err_code > 0){
													res.json(eligibilityResponseBenefitBalance);	
												}else{
													res.json({"err_code": 0, "err_msg": "Eligibility Response benefit balance has been update in this Eligibility Response.", "data": eligibilityResponseBenefitBalance.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Eligibility Response benefit balance Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Eligibility Response Insurance id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkInsuranceBenefitBalanceCategory', function () {
							if (!validator.isEmpty(insuranceBenefitBalanceCategory)) {
								checkCode(apikey, insuranceBenefitBalanceCategory, 'BENEFIT_CATEGORY', function (resInsuranceBenefitBalanceCategoryCode) {
									if (resInsuranceBenefitBalanceCategoryCode.err_code > 0) {
										myEmitter.emit('checkEligibilityResponseID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurance benefit balance category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkEligibilityResponseID');
							}
						})

						myEmitter.prependOnceListener('checkInsuranceBenefitBalanceSubCategory', function () {
							if (!validator.isEmpty(insuranceBenefitBalanceSubCategory)) {
								checkCode(apikey, insuranceBenefitBalanceSubCategory, 'BENEFIT_SUBCATEGORY', function (resInsuranceBenefitBalanceSubCategoryCode) {
									if (resInsuranceBenefitBalanceSubCategoryCode.err_code > 0) {
										myEmitter.emit('checkInsuranceBenefitBalanceCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurance benefit balance sub category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInsuranceBenefitBalanceCategory');
							}
						})

						myEmitter.prependOnceListener('checkInsuranceBenefitBalanceNetwork', function () {
							if (!validator.isEmpty(insuranceBenefitBalanceNetwork)) {
								checkCode(apikey, insuranceBenefitBalanceNetwork, 'BENEFIT_NETWORK', function (resInsuranceBenefitBalanceNetworkCode) {
									if (resInsuranceBenefitBalanceNetworkCode.err_code > 0) {
										myEmitter.emit('checkInsuranceBenefitBalanceSubCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurance benefit balance network code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInsuranceBenefitBalanceSubCategory');
							}
						})

						myEmitter.prependOnceListener('checkInsuranceBenefitBalanceUnit', function () {
							if (!validator.isEmpty(insuranceBenefitBalanceUnit)) {
								checkCode(apikey, insuranceBenefitBalanceUnit, 'BENEFIT_UNIT', function (resInsuranceBenefitBalanceUnitCode) {
									if (resInsuranceBenefitBalanceUnitCode.err_code > 0) {
										myEmitter.emit('checkInsuranceBenefitBalanceNetwork');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurance benefit balance unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInsuranceBenefitBalanceNetwork');
							}
						})

						if (!validator.isEmpty(insuranceBenefitBalanceTerm)) {
							checkCode(apikey, insuranceBenefitBalanceTerm, 'BENEFIT_TERM', function (resInsuranceBenefitBalanceTermCode) {
								if (resInsuranceBenefitBalanceTermCode.err_code > 0) {
									myEmitter.emit('checkInsuranceBenefitBalanceUnit');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Insurance benefit balance term code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkInsuranceBenefitBalanceUnit');
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
		eligibilityResponseFinancial: function updateEligibilityResponseFinancial(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var eligibilityResponseId = req.params.eligibility_response_benefit_balance_id;
			var eligibilityResponseFinancialId = req.params.eligibility_response_financial_id;

			var err_code = 0;
			var err_msg = "";
			var dataEligibilityResponse = {};
			//input check 
			if(typeof eligibilityResponseId !== 'undefined'){
				if(validator.isEmpty(eligibilityResponseId)){
					err_code = 2;
					err_msg = "Eligibility Response benefit balance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Eligibility Response benefit balance id is required";
			}

			if(typeof eligibilityResponseFinancialId !== 'undefined'){
				if(validator.isEmpty(eligibilityResponseFinancialId)){
					err_code = 2;
					err_msg = "Eligibility Response Financial id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Eligibility Response Financial id is required";
			}
			
			/*
			var financial_id  = req.params._id;
			var type  = req.body.type;
			var allowed_unsigned_int  = req.body.allowed_unsigned_int;
			var allowed_string  = req.body.allowed_string;
			var allowed_money  = req.body.allowed_money;
			var used_unsigned_int  = req.body.used_unsigned_int;
			var used_money  = req.body.used_money;
			*/
			
			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var insuranceBenefitBalanceFinancialType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialType)){
					err_code = 2;
					err_msg = "eligibility response insurance benefit balance financial type is required.";
				}else{
					dataEligibilityResponse.type = insuranceBenefitBalanceFinancialType;
				}
			}else{
			  insuranceBenefitBalanceFinancialType = "";
			}

			if(typeof req.body.allowed.allowedUnsignedInt !== 'undefined' && req.body.allowed.allowedUnsignedInt !== ""){
				var insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt =  req.body.allowed.allowedUnsignedInt.trim();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt)){
					dataEligibilityResponse.allowed_unsigned_int = "";
				}else{
					if(!validator.isInt(insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt)){
						err_code = 2;
						err_msg = "eligibility response insurance benefit balance financial allowed allowed unsigned int is must be number.";
					}else{
						dataEligibilityResponse.allowed_unsigned_int = insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt;
					}
				}
			}else{
			  insuranceBenefitBalanceFinancialAllowedAllowedUnsignedInt = "";
			}

			if(typeof req.body.allowed.allowedString !== 'undefined' && req.body.allowed.allowedString !== ""){
				var insuranceBenefitBalanceFinancialAllowedAllowedString =  req.body.allowed.allowedString.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialAllowedAllowedString)){
					dataEligibilityResponse.allowed_string = "";
				}else{
					dataEligibilityResponse.allowed_string = insuranceBenefitBalanceFinancialAllowedAllowedString;
				}
			}else{
			  insuranceBenefitBalanceFinancialAllowedAllowedString = "";
			}

			if(typeof req.body.allowed.allowedMoney !== 'undefined' && req.body.allowed.allowedMoney !== ""){
				var insuranceBenefitBalanceFinancialAllowedAllowedMoney =  req.body.allowed.allowedMoney.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialAllowedAllowedMoney)){
					dataEligibilityResponse.allowed_money = "";
				}else{
					dataEligibilityResponse.allowed_money = insuranceBenefitBalanceFinancialAllowedAllowedMoney;
				}
			}else{
			  insuranceBenefitBalanceFinancialAllowedAllowedMoney = "";
			}

			if(typeof req.body.used.usedUnsignedInt !== 'undefined' && req.body.used.usedUnsignedInt !== ""){
				var insuranceBenefitBalanceFinancialUsedUsedUnsignedInt =  req.body.used.usedUnsignedInt.trim();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialUsedUsedUnsignedInt)){
					dataEligibilityResponse.used_unsigned_int = "";
				}else{
					if(!validator.isInt(insuranceBenefitBalanceFinancialUsedUsedUnsignedInt)){
						err_code = 2;
						err_msg = "eligibility response insurance benefit balance financial used used unsigned int is must be number.";
					}else{
						dataEligibilityResponse.used_unsigned_int = insuranceBenefitBalanceFinancialUsedUsedUnsignedInt;
					}
				}
			}else{
			  insuranceBenefitBalanceFinancialUsedUsedUnsignedInt = "";
			}

			if(typeof req.body.used.usedMoney !== 'undefined' && req.body.used.usedMoney !== ""){
				var insuranceBenefitBalanceFinancialUsedUsedMoney =  req.body.used.usedMoney.trim().toLowerCase();
				if(validator.isEmpty(insuranceBenefitBalanceFinancialUsedUsedMoney)){
					dataEligibilityResponse.used_money = "";
				}else{
					dataEligibilityResponse.used_money = insuranceBenefitBalanceFinancialUsedUsedMoney;
				}
			}else{
			  insuranceBenefitBalanceFinancialUsedUsedMoney = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkEligibilityResponseID', function(){
							checkUniqeValue(apikey, "BENEFIT_BALANCE_ID|" + eligibilityResponseId, 'ELIGIBILITY_RESPONSE_BENEFIT_BALANCE', function(resEligibilityResponseId){
								if(resEligibilityResponseId.err_code > 0){
									checkUniqeValue(apikey, "FINANCIAL_ID|" + eligibilityResponseFinancialId, 'ELIGIBILITY_RESPONSE_FINANCIAL', function(resEligibilityResponseFinancialID){
										if(resEligibilityResponseFinancialID.err_code > 0){
											ApiFHIR.put('eligibilityResponseFinancial', {"apikey": apikey, "_id": eligibilityResponseFinancialId, "dr": "BENEFIT_BALANCE_ID|"+eligibilityResponseId}, {body: dataEligibilityResponse, json: true}, function(financial, response, body){
												eligibilityResponseFinancial = body;
												if(eligibilityResponseFinancial.err_code > 0){
													res.json(eligibilityResponseFinancial);	
												}else{
													res.json({"err_code": 0, "err_msg": "Eligibility Response financial has been update in this Eligibility Response.", "data": eligibilityResponseFinancial.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Eligibility Response financial Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Eligibility Response benefit balance Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(insuranceBenefitBalanceFinancialType)) {
							checkCode(apikey, insuranceBenefitBalanceFinancialType, 'BENEFIT_TYPE', function (resInsuranceBenefitBalanceFinancialTypeCode) {
								if (resInsuranceBenefitBalanceFinancialTypeCode.err_code > 0) {
									myEmitter.emit('checkEligibilityResponseID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Insurance benefit balance financial type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkEligibilityResponseID');
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
		eligibilityResponseError: function updateEligibilityResponseError(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var eligibilityResponseId = req.params.eligibility_response_id;
			var eligibilityResponseErrorId = req.params.eligibility_response_error_id;

			var err_code = 0;
			var err_msg = "";
			var dataEligibilityResponse = {};
			//input check 
			if(typeof eligibilityResponseId !== 'undefined'){
				if(validator.isEmpty(eligibilityResponseId)){
					err_code = 2;
					err_msg = "Eligibility Response id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Eligibility Response id is required";
			}

			if(typeof eligibilityResponseErrorId !== 'undefined'){
				if(validator.isEmpty(eligibilityResponseErrorId)){
					err_code = 2;
					err_msg = "Eligibility Response Error id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Eligibility Response Error id is required";
			}
			
			if(typeof req.body.error.code !== 'undefined' && req.body.error.code !== ""){
				var errorCode =  req.body.error.code.trim().toLowerCase();
				if(validator.isEmpty(errorCode)){
					err_code = 2;
					err_msg = "eligibility response error code is required.";
				}else{
					dataEligibilityResponse.code = errorCode;
				}
			}else{
			  errorCode = "";
			}
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkEligibilityResponseID', function(){
							checkUniqeValue(apikey, "ELIGIBILITY_RESPONSE_ID|" + eligibilityResponseId, 'ELIGIBILITY_RESPONSE', function(resEligibilityResponseId){
								if(resEligibilityResponseId.err_code > 0){
									checkUniqeValue(apikey, "ERROR_ID|" + eligibilityResponseErrorId, 'ELIGIBILITY_RESPONSE_ERROR', function(resEligibilityResponseErrorID){
										if(resEligibilityResponseErrorID.err_code > 0){
											ApiFHIR.put('eligibilityResponseError', {"apikey": apikey, "_id": eligibilityResponseErrorId, "dr": "ELIGIBILITY_RESPONSE_ID|"+eligibilityResponseId}, {body: dataEligibilityResponse, json: true}, function(error, response, body){
												eligibilityResponseError = body;
												if(eligibilityResponseError.err_code > 0){
													res.json(eligibilityResponseError);	
												}else{
													res.json({"err_code": 0, "err_msg": "Eligibility Response error has been update in this Eligibility Response.", "data": eligibilityResponseError.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Eligibility Response error Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Eligibility Response Id not found"});		
								}
							})
						})
						
						if (!validator.isEmpty(errorCode)) {
							checkCode(apikey, errorCode, 'ADJUDICATION_ERROR', function (resErrorCodeCode) {
								if (resErrorCodeCode.err_code > 0) {
									myEmitter.emit('checkEligibilityResponseID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Error code code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkEligibilityResponseID');
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