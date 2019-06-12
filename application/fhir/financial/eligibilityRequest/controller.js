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
		eligibilityRequest: function getEligibilityRequest(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};
			var eligibilityRequestId = req.query._id;
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
			
			if (typeof eligibilityRequestId !== 'undefined') {
        if (!validator.isEmpty(eligibilityRequestId)) {
          qString._id = eligibilityRequestId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Eligibility Request ID is required."
          })
        }
      }
			
			var created = req.query.created;
			var enterer = req.query.enterer;
			var facility = req.query.facility;
			var identifier = req.query.identifier;
			var organization = req.query.organization;
			var patient = req.query.patient;
			var provider = req.query.provider;
			
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

			if(typeof enterer !== 'undefined'){
				if(!validator.isEmpty(enterer)){
					qString.enterer = enterer; 
				}else{
					res.json({"err_code": 1, "err_msg": "Enterer is empty."});
				}
			}

			if(typeof facility !== 'undefined'){
				if(!validator.isEmpty(facility)){
					qString.facility = facility; 
				}else{
					res.json({"err_code": 1, "err_msg": "Facility is empty."});
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

			if(typeof patient !== 'undefined'){
				if(!validator.isEmpty(patient)){
					qString.patient = patient; 
				}else{
					res.json({"err_code": 1, "err_msg": "Patient is empty."});
				}
			}

			if(typeof provider !== 'undefined'){
				if(!validator.isEmpty(provider)){
					qString.provider = provider; 
				}else{
					res.json({"err_code": 1, "err_msg": "Provider is empty."});
				}
			}
			
			seedPhoenixFHIR.path.GET = {
        "EligibilityRequest": {
          "location": "%(apikey)s/EligibilityRequest",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
			
			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					ApiFHIR.get('EligibilityRequest', {
            "apikey": apikey
          }, {}, function (error, response, body) {
						if (error) {
              res.json(error);
            } else {
							var eligibilityRequest = JSON.parse(body);
							if (eligibilityRequest.err_code == 0) {
								if (eligibilityRequest.data.length > 0) {
									newEligibilityRequest = [];
									for (i = 0; i < eligibilityRequest.data.length; i++) {
										myEmitter.prependOnceListener("getIdentifier", function (eligibilityRequest, index, newEligibilityRequest, countEligibilityRequest) {
											qString = {};
                      qString.eligibility_request_id = eligibilityRequest.id;
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
													var objectEligibilityRequest = {};
													objectEligibilityRequest.resourceType = eligibilityRequest.resourceType;
													objectEligibilityRequest.id = eligibilityRequest.id;
													objectEligibilityRequest.identifier = identifier.data;
													objectEligibilityRequest.status = eligibilityRequest.status;
													objectEligibilityRequest.priority = eligibilityRequest.priority;
													objectEligibilityRequest.patient = eligibilityRequest.patient;
													objectEligibilityRequest.serviced = eligibilityRequest.serviced;
													objectEligibilityRequest.created = eligibilityRequest.created;
													objectEligibilityRequest.entered = eligibilityRequest.entered;
													objectEligibilityRequest.provider = eligibilityRequest.provider;
													objectEligibilityRequest.organization = eligibilityRequest.organization;
													objectEligibilityRequest.insurer = eligibilityRequest.insurer;
													objectEligibilityRequest.facility = eligibilityRequest.facility;
													objectEligibilityRequest.coverage = eligibilityRequest.coverage;
													objectEligibilityRequest.businessArrangement = eligibilityRequest.businessArrangement;
													objectEligibilityRequest.benefitCategory = eligibilityRequest.benefitCategory;
													objectEligibilityRequest.benefitSubCategory = eligibilityRequest.benefitSubCategory;
													
													newEligibilityRequest[index] = objectEligibilityRequest;
													
													if (index == countEligibilityRequest - 1) {
														res.json({
															"err_code": 0,
															"data": newEligibilityRequest
														});
													}
													
												} else {
                          res.json(identifier);
                        }
											})
										})
										myEmitter.emit("getIdentifier", eligibilityRequest.data[i], i, newEligibilityRequest, eligibilityRequest.data.length);
									}
								} else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Eligibility Request is empty."
                  });
                }
							} else {
                res.json(eligibilityRequest);
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
					var eligibilityRequestId = req.params.eligibility_request_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "ELIGIBILITY_REQUEST_ID|" + eligibilityRequestId, 'ELIGIBILITY_REQUEST', function(resEligibilityRequestID){
								if(resEligibilityRequestID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.eligibility_request_id = eligibilityRequestId;
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
						  			qString.eligibility_request_id = eligibilityRequestId;
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
									res.json({"err_code": 501, "err_msg": "EligibilityRequest Id not found"});		
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
		eligibilityRequest: function addEligibilityRequest(req, res) {
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
priority|priority|||
patient|patient|||
serviced.servicedDate|servicedServicedDate|date||
serviced.servicedPeriod|servicedServicedPeriod|period||
created|created|date||
enterer|enterer|||
provider|provider|||
organization|organization|||
insurer|insurer|||
facility|facility|||
coverage|coverage|||
businessArrangement|businessArrangement|||
benefitCategory|benefitCategory|||
benefitSubCategory|benefitSubCategory|||u
*/			
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Eligibility Request request.";
			}

			if(typeof req.body.priority !== 'undefined'){
				var priority =  req.body.priority.trim().toLowerCase();
				if(validator.isEmpty(priority)){
					priority = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'priority' in json Eligibility Request request.";
			}

			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					patient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Eligibility Request request.";
			}

			if(typeof req.body.serviced.servicedDate !== 'undefined'){
				var servicedServicedDate =  req.body.serviced.servicedDate;
				if(validator.isEmpty(servicedServicedDate)){
					servicedServicedDate = "";
				}else{
					if(!regex.test(servicedServicedDate)){
						err_code = 2;
						err_msg = "Eligibility Request serviced serviced date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'serviced serviced date' in json Eligibility Request request.";
			}

			if (typeof req.body.serviced.servicedPeriod !== 'undefined') {
			  var servicedServicedPeriod = req.body.serviced.servicedPeriod;
 				if(validator.isEmpty(servicedServicedPeriod)) {
				  var servicedServicedPeriodStart = "";
				  var servicedServicedPeriodEnd = "";
				} else {
				  if (servicedServicedPeriod.indexOf("to") > 0) {
				    arrServicedServicedPeriod = servicedServicedPeriod.split("to");
				    var servicedServicedPeriodStart = arrServicedServicedPeriod[0];
				    var servicedServicedPeriodEnd = arrServicedServicedPeriod[1];
				    if (!regex.test(servicedServicedPeriodStart) && !regex.test(servicedServicedPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Eligibility Request serviced serviced period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Eligibility Request serviced serviced period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'serviced serviced period' in json Eligibility Request request.";
			}

			if(typeof req.body.created !== 'undefined'){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					created = "";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "Eligibility Request created invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'created' in json Eligibility Request request.";
			}

			if(typeof req.body.enterer !== 'undefined'){
				var enterer =  req.body.enterer.trim().toLowerCase();
				if(validator.isEmpty(enterer)){
					enterer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'enterer' in json Eligibility Request request.";
			}

			if(typeof req.body.provider !== 'undefined'){
				var provider =  req.body.provider.trim().toLowerCase();
				if(validator.isEmpty(provider)){
					provider = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'provider' in json Eligibility Request request.";
			}

			if(typeof req.body.organization !== 'undefined'){
				var organization =  req.body.organization.trim().toLowerCase();
				if(validator.isEmpty(organization)){
					organization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'organization' in json Eligibility Request request.";
			}

			if(typeof req.body.insurer !== 'undefined'){
				var insurer =  req.body.insurer.trim().toLowerCase();
				if(validator.isEmpty(insurer)){
					insurer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurer' in json Eligibility Request request.";
			}

			if(typeof req.body.facility !== 'undefined'){
				var facility =  req.body.facility.trim().toLowerCase();
				if(validator.isEmpty(facility)){
					facility = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'facility' in json Eligibility Request request.";
			}

			if(typeof req.body.coverage !== 'undefined'){
				var coverage =  req.body.coverage.trim().toLowerCase();
				if(validator.isEmpty(coverage)){
					coverage = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'coverage' in json Eligibility Request request.";
			}

			if(typeof req.body.businessArrangement !== 'undefined'){
				var businessArrangement =  req.body.businessArrangement.trim().toLowerCase();
				if(validator.isEmpty(businessArrangement)){
					businessArrangement = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'business arrangement' in json Eligibility Request request.";
			}

			if(typeof req.body.benefitCategory !== 'undefined'){
				var benefitCategory =  req.body.benefitCategory.trim().toLowerCase();
				if(validator.isEmpty(benefitCategory)){
					benefitCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit category' in json Eligibility Request request.";
			}

			if(typeof req.body.benefitSubCategory !== 'undefined'){
				var benefitSubCategory =  req.body.benefitSubCategory.trim().toUpperCase();
				if(validator.isEmpty(benefitSubCategory)){
					benefitSubCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit sub category' in json Eligibility Request request.";
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
														var eligibilityRequestId = 'egr' + unicId;
														
/*|status|||
|priority|||
|patient|||
serviced.servicedDate||date||
serviced.servicedPeriod||period||
created||date||
enterer||||
provider||||
organization||||
insurer|insurer|||
facility|facility|||
coverage|coverage|||
businessArrangement||||
benefitCategory||||
benefitSubCategory||||u*/														
														dataEligibilityRequest = {
															"eligibility_request_id" : eligibilityRequestId,
															"status" : status,
															"priority" : priority,
															"patient" : patient,
															"serviced_date" : servicedServicedDate,
															"serviced_period_start" : servicedServicedPeriodStart,
															"serviced_period_end" : servicedServicedPeriodEnd,
															"created" : created,
															"entered" : enterer,
															"provider" : provider,
															"organization" : organization,
															"insurer" : insurer,
															"facility" : facility,
															"coverage" : coverage,
															"business_arrangement" : businessArrangement,
															"benefit_category" : benefitCategory,
															"benefit_sub_category" : benefitSubCategory
														}
														console.log(dataEligibilityRequest);
														ApiFHIR.post('eligibilityRequest', {"apikey": apikey}, {body: dataEligibilityRequest, json: true}, function(error, response, body){
															eligibilityRequest = body;
															if(eligibilityRequest.err_code > 0){
																res.json(eligibilityRequest);	
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
																							"eligibility_request_id" : eligibilityRequestId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														
														res.json({"err_code": 0, "err_msg": "EligibilityRequest has been add.", "data": [{"_id": eligibilityRequestId}]});
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

										myEmitter.prependOnceListener('checkPriority', function () {
											if (!validator.isEmpty(priority)) {
												checkCode(apikey, priority, 'PROCESS_PRIORITY', function (resPriorityCode) {
													if (resPriorityCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Priority code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})

										myEmitter.prependOnceListener('checkBenefitCategory', function () {
											if (!validator.isEmpty(benefitCategory)) {
												checkCode(apikey, benefitCategory, 'BENEFIT_CATEGORY', function (resBenefitCategoryCode) {
													if (resBenefitCategoryCode.err_code > 0) {
														myEmitter.emit('checkPriority');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Benefit category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPriority');
											}
										})

										myEmitter.prependOnceListener('checkBenefitSubCategory', function () {
											if (!validator.isEmpty(benefitSubCategory)) {
												checkCode(apikey, benefitSubCategory, 'BENEFIT_SUBCATEGORY', function (resBenefitSubCategoryCode) {
													if (resBenefitSubCategoryCode.err_code > 0) {
														myEmitter.emit('checkBenefitCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Benefit sub category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBenefitCategory');
											}
										})

										myEmitter.prependOnceListener('checkPatient', function () {
											if (!validator.isEmpty(patient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
													if (resPatient.err_code > 0) {
														myEmitter.emit('checkBenefitSubCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBenefitSubCategory');
											}
										})

										myEmitter.prependOnceListener('checkEnterer', function () {
											if (!validator.isEmpty(enterer)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + enterer, 'PRACTITIONER', function (resEnterer) {
													if (resEnterer.err_code > 0) {
														myEmitter.emit('checkPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Enterer id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPatient');
											}
										})

										myEmitter.prependOnceListener('checkProvider', function () {
											if (!validator.isEmpty(provider)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + provider, 'PRACTITIONER', function (resProvider) {
													if (resProvider.err_code > 0) {
														myEmitter.emit('checkEnterer');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Provider id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkEnterer');
											}
										})

										myEmitter.prependOnceListener('checkOrganization', function () {
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
										})

										myEmitter.prependOnceListener('checkInsurer', function () {
											if (!validator.isEmpty(insurer)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + insurer, 'ORGANIZATION', function (resInsurer) {
													if (resInsurer.err_code > 0) {
														myEmitter.emit('checkOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurer id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOrganization');
											}
										})

										myEmitter.prependOnceListener('checkFacility', function () {
											if (!validator.isEmpty(facility)) {
												checkUniqeValue(apikey, "LOCATION_ID|" + facility, 'LOCATION', function (resFacility) {
													if (resFacility.err_code > 0) {
														myEmitter.emit('checkInsurer');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Facility id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInsurer');
											}
										})

										if (!validator.isEmpty(coverage)) {
											checkUniqeValue(apikey, "COVERAGE_ID|" + coverage, 'COVERAGE', function (resCoverage) {
												if (resCoverage.err_code > 0) {
													myEmitter.emit('checkFacility');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Coverage id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkFacility');
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
      var eligibilityRequestId = req.params.eligibility_request_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof eligibilityRequestId !== 'undefined') {
        if (validator.isEmpty(eligibilityRequestId)) {
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
                        checkUniqeValue(apikey, "ELIGIBILITY_REQUEST_ID|" + eligibilityRequestId, 'ELIGIBILITY_REQUEST', function (resEncounterID) {
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
                              "eligibility_request_id": eligibilityRequestId
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
                                  "err_msg": "Identifier has been add in this EligibilityRequest.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
                              }
                            })
                          } else {
                            res.json({
                              "err_code": 503,
                              "err_msg": "EligibilityRequest Id not found"
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
		eligibilityRequest: function updateEligibilityRequest(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var eligibilityRequestId = req.params.eligibility_request_id;
			
			var err_code = 0;
      var err_msg = "";
      var dataEligibilityRequest = {};
			
			if (typeof eligibilityRequestId !== 'undefined') {
        if (validator.isEmpty(eligibilityRequestId)) {
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
					dataEligibilityRequest.status = "";
				}else{
					dataEligibilityRequest.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.priority !== 'undefined' && req.body.priority !== ""){
				var priority =  req.body.priority.trim().toLowerCase();
				if(validator.isEmpty(priority)){
					dataEligibilityRequest.priority = "";
				}else{
					dataEligibilityRequest.priority = priority;
				}
			}else{
			  priority = "";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					dataEligibilityRequest.patient = "";
				}else{
					dataEligibilityRequest.patient = patient;
				}
			}else{
			  patient = "";
			}

			if(typeof req.body.serviced.servicedDate !== 'undefined' && req.body.serviced.servicedDate !== ""){
				var servicedServicedDate =  req.body.serviced.servicedDate;
				if(validator.isEmpty(servicedServicedDate)){
					err_code = 2;
					err_msg = "eligibility request serviced serviced date is required.";
				}else{
					if(!regex.test(servicedServicedDate)){
						err_code = 2;
						err_msg = "eligibility request serviced serviced date invalid date format.";	
					}else{
						dataEligibilityRequest.serviced_date = servicedServicedDate;
					}
				}
			}else{
			  servicedServicedDate = "";
			}

			if (typeof req.body.serviced.servicedPeriod !== 'undefined' && req.body.serviced.servicedPeriod !== "") {
			  var servicedServicedPeriod = req.body.serviced.servicedPeriod;
			  if (servicedServicedPeriod.indexOf("to") > 0) {
			    arrServicedServicedPeriod = servicedServicedPeriod.split("to");
			    dataEligibilityRequest.serviced_period_start = arrServicedServicedPeriod[0];
			    dataEligibilityRequest.serviced_period_end = arrServicedServicedPeriod[1];
			    if (!regex.test(servicedServicedPeriodStart) && !regex.test(servicedServicedPeriodEnd)) {
			      err_code = 2;
			      err_msg = "eligibility request serviced serviced period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "eligibility request serviced serviced period invalid date format.";
				}
			} else {
			  servicedServicedPeriod = "";
			}

			if(typeof req.body.created !== 'undefined' && req.body.created !== ""){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					err_code = 2;
					err_msg = "eligibility request created is required.";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "eligibility request created invalid date format.";	
					}else{
						dataEligibilityRequest.created = created;
					}
				}
			}else{
			  created = "";
			}

			if(typeof req.body.enterer !== 'undefined' && req.body.enterer !== ""){
				var enterer =  req.body.enterer.trim().toLowerCase();
				if(validator.isEmpty(enterer)){
					dataEligibilityRequest.enterer = "";
				}else{
					dataEligibilityRequest.enterer = enterer;
				}
			}else{
			  enterer = "";
			}

			if(typeof req.body.provider !== 'undefined' && req.body.provider !== ""){
				var provider =  req.body.provider.trim().toLowerCase();
				if(validator.isEmpty(provider)){
					dataEligibilityRequest.provider = "";
				}else{
					dataEligibilityRequest.provider = provider;
				}
			}else{
			  provider = "";
			}

			if(typeof req.body.organization !== 'undefined' && req.body.organization !== ""){
				var organization =  req.body.organization.trim().toLowerCase();
				if(validator.isEmpty(organization)){
					dataEligibilityRequest.organization = "";
				}else{
					dataEligibilityRequest.organization = organization;
				}
			}else{
			  organization = "";
			}

			if(typeof req.body.insurer !== 'undefined' && req.body.insurer !== ""){
				var insurer =  req.body.insurer.trim().toLowerCase();
				if(validator.isEmpty(insurer)){
					dataEligibilityRequest.insurer = "";
				}else{
					dataEligibilityRequest.insurer = insurer;
				}
			}else{
			  insurer = "";
			}

			if(typeof req.body.facility !== 'undefined' && req.body.facility !== ""){
				var facility =  req.body.facility.trim().toLowerCase();
				if(validator.isEmpty(facility)){
					dataEligibilityRequest.facility = "";
				}else{
					dataEligibilityRequest.facility = facility;
				}
			}else{
			  facility = "";
			}

			if(typeof req.body.coverage !== 'undefined' && req.body.coverage !== ""){
				var coverage =  req.body.coverage.trim().toLowerCase();
				if(validator.isEmpty(coverage)){
					dataEligibilityRequest.coverage = "";
				}else{
					dataEligibilityRequest.coverage = coverage;
				}
			}else{
			  coverage = "";
			}

			if(typeof req.body.businessArrangement !== 'undefined' && req.body.businessArrangement !== ""){
				var businessArrangement =  req.body.businessArrangement.trim().toLowerCase();
				if(validator.isEmpty(businessArrangement)){
					dataEligibilityRequest.business_arrangement = "";
				}else{
					dataEligibilityRequest.business_arrangement = businessArrangement;
				}
			}else{
			  businessArrangement = "";
			}

			if(typeof req.body.benefitCategory !== 'undefined' && req.body.benefitCategory !== ""){
				var benefitCategory =  req.body.benefitCategory.trim().toLowerCase();
				if(validator.isEmpty(benefitCategory)){
					dataEligibilityRequest.benefit_category = "";
				}else{
					dataEligibilityRequest.benefit_category = benefitCategory;
				}
			}else{
			  benefitCategory = "";
			}

			if(typeof req.body.benefitSubCategory !== 'undefined' && req.body.benefitSubCategory !== ""){
				var benefitSubCategory =  req.body.benefitSubCategory.trim().toUpperCase();
				if(validator.isEmpty(benefitSubCategory)){
					dataEligibilityRequest.benefit_sub_category = "";
				}else{
					dataEligibilityRequest.benefit_sub_category = benefitSubCategory;
				}
			}else{
			  benefitSubCategory = "";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "ELIGIBILITY_REQUEST_ID|" + eligibilityRequestId, 'ELIGIBILITY_REQUEST', function (resEligibilityRequestId) {
								if (resEligibilityRequestId.err_code > 0) {
									ApiFHIR.put('eligibilityRequest', {
										"apikey": apikey,
										"_id": eligibilityRequestId
									}, {
										body: dataEligibilityRequest,
										json: true
									}, function (error, response, body) {
										eligibilityRequest = body;
										if (eligibilityRequest.err_code > 0) {
											res.json(eligibilityRequest);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "EligibilityRequest has been updated.",
												"data": eligibilityRequest.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 404,
										"err_msg": "EligibilityRequest Id not found"
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

						myEmitter.prependOnceListener('checkPriority', function () {
							if (!validator.isEmpty(priority)) {
								checkCode(apikey, priority, 'PROCESS_PRIORITY', function (resPriorityCode) {
									if (resPriorityCode.err_code > 0) {
										myEmitter.emit('checkStatus');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Priority code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkStatus');
							}
						})

						myEmitter.prependOnceListener('checkBenefitCategory', function () {
							if (!validator.isEmpty(benefitCategory)) {
								checkCode(apikey, benefitCategory, 'BENEFIT_CATEGORY', function (resBenefitCategoryCode) {
									if (resBenefitCategoryCode.err_code > 0) {
										myEmitter.emit('checkPriority');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Benefit category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPriority');
							}
						})

						myEmitter.prependOnceListener('checkBenefitSubCategory', function () {
							if (!validator.isEmpty(benefitSubCategory)) {
								checkCode(apikey, benefitSubCategory, 'BENEFIT_SUBCATEGORY', function (resBenefitSubCategoryCode) {
									if (resBenefitSubCategoryCode.err_code > 0) {
										myEmitter.emit('checkBenefitCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Benefit sub category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkBenefitCategory');
							}
						})

						myEmitter.prependOnceListener('checkPatient', function () {
							if (!validator.isEmpty(patient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
									if (resPatient.err_code > 0) {
										myEmitter.emit('checkBenefitSubCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkBenefitSubCategory');
							}
						})

						myEmitter.prependOnceListener('checkEnterer', function () {
							if (!validator.isEmpty(enterer)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + enterer, 'PRACTITIONER', function (resEnterer) {
									if (resEnterer.err_code > 0) {
										myEmitter.emit('checkPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Enterer id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPatient');
							}
						})

						myEmitter.prependOnceListener('checkProvider', function () {
							if (!validator.isEmpty(provider)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + provider, 'PRACTITIONER', function (resProvider) {
									if (resProvider.err_code > 0) {
										myEmitter.emit('checkEnterer');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Provider id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkEnterer');
							}
						})

						myEmitter.prependOnceListener('checkOrganization', function () {
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
						})

						myEmitter.prependOnceListener('checkInsurer', function () {
							if (!validator.isEmpty(insurer)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + insurer, 'ORGANIZATION', function (resInsurer) {
									if (resInsurer.err_code > 0) {
										myEmitter.emit('checkOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurer id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkOrganization');
							}
						})

						myEmitter.prependOnceListener('checkFacility', function () {
							if (!validator.isEmpty(facility)) {
								checkUniqeValue(apikey, "LOCATION_ID|" + facility, 'LOCATION', function (resFacility) {
									if (resFacility.err_code > 0) {
										myEmitter.emit('checkInsurer');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Facility id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInsurer');
							}
						})

						if (!validator.isEmpty(coverage)) {
							checkUniqeValue(apikey, "COVERAGE_ID|" + coverage, 'COVERAGE', function (resCoverage) {
								if (resCoverage.err_code > 0) {
									myEmitter.emit('checkFacility');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Coverage id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkFacility');
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
      var eligibilityRequestId = req.params.eligibility_request_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof eligibilityRequestId !== 'undefined') {
        if (validator.isEmpty(eligibilityRequestId)) {
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
            myEmitter.once('checkEligibilityRequestId', function () {
              checkUniqeValue(apikey, "ELIGIBILITY_REQUEST_ID|" + eligibilityRequestId, 'ELIGIBILITY_REQUEST', function (resEligibilityRequestId) {
                if (resEligibilityRequestId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "ELIGIBILITY_REQUEST_ID|" + eligibilityRequestId
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
                            "err_msg": "Identifier has been update in this EligibilityRequest.",
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
                    "err_msg": "EligibilityRequest Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkEligibilityRequestId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkEligibilityRequestId');
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