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
		coverage: function getCoverage(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};
			var coverageId = req.query._id;
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
			
			if (typeof coverageId !== 'undefined') {
        if (!validator.isEmpty(coverageId)) {
          qString._id = coverageId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Coverage ID is required."
          })
        }
      }
			
			var beneficiary = req.query.beneficiary;
			var clases = req.query.class;
			var dependent = req.query.dependent;
			var group = req.query.group;
			var identifier = req.query.identifier;
			var payor = req.query.payor;
			var plan = req.query.plan;
			var policy_holder = req.query.policyHolder;
			var sequence = req.query.sequence;
			var subclass = req.query.subclass;
			var subgroup = req.query.subgroup;
			var subplan = req.query.subplan;
			var subscriber = req.query.subscriber;
			var type = req.query.type;
			
			if(typeof beneficiary !== 'undefined'){
				if(!validator.isEmpty(beneficiary)){
					qString.beneficiary = beneficiary; 
				}else{
					res.json({"err_code": 1, "err_msg": "Beneficiary is empty."});
				}
			}

			if(typeof clases !== 'undefined'){
				if(!validator.isEmpty(clases)){
					qString.class = clases; 
				}else{
					res.json({"err_code": 1, "err_msg": "Class is empty."});
				}
			}

			if(typeof dependent !== 'undefined'){
				if(!validator.isEmpty(dependent)){
					qString.dependent = dependent; 
				}else{
					res.json({"err_code": 1, "err_msg": "Dependent is empty."});
				}
			}

			if(typeof group !== 'undefined'){
				if(!validator.isEmpty(group)){
					qString.group = group; 
				}else{
					res.json({"err_code": 1, "err_msg": "Group is empty."});
				}
			}

			if(typeof identifier !== 'undefined'){
				if(!validator.isEmpty(identifier)){
					qString.identifier = identifier; 
				}else{
					res.json({"err_code": 1, "err_msg": "Identifier is empty."});
				}
			}

			if(typeof payor !== 'undefined'){
				if(!validator.isEmpty(payor)){
					qString.payor = payor; 
				}else{
					res.json({"err_code": 1, "err_msg": "Payor is empty."});
				}
			}

			if(typeof plan !== 'undefined'){
				if(!validator.isEmpty(plan)){
					qString.plan = plan; 
				}else{
					res.json({"err_code": 1, "err_msg": "Plan is empty."});
				}
			}

			if(typeof policy_holder !== 'undefined'){
				if(!validator.isEmpty(policy_holder)){
					qString.policy_holder = policy_holder; 
				}else{
					res.json({"err_code": 1, "err_msg": "Policy holder is empty."});
				}
			}

			if(typeof sequence !== 'undefined'){
				if(!validator.isEmpty(sequence)){
					qString.sequence = sequence; 
				}else{
					res.json({"err_code": 1, "err_msg": "Sequence is empty."});
				}
			}

			if(typeof subclass !== 'undefined'){
				if(!validator.isEmpty(subclass)){
					qString.subclass = subclass; 
				}else{
					res.json({"err_code": 1, "err_msg": "Subclass is empty."});
				}
			}

			if(typeof subgroup !== 'undefined'){
				if(!validator.isEmpty(subgroup)){
					qString.subgroup = subgroup; 
				}else{
					res.json({"err_code": 1, "err_msg": "Subgroup is empty."});
				}
			}

			if(typeof subplan !== 'undefined'){
				if(!validator.isEmpty(subplan)){
					qString.subplan = subplan; 
				}else{
					res.json({"err_code": 1, "err_msg": "Subplan is empty."});
				}
			}

			if(typeof subscriber !== 'undefined'){
				if(!validator.isEmpty(subscriber)){
					qString.subscriber = subscriber; 
				}else{
					res.json({"err_code": 1, "err_msg": "Subscriber is empty."});
				}
			}

			if(typeof type !== 'undefined'){
				if(!validator.isEmpty(type)){
					qString.type = type; 
				}else{
					res.json({"err_code": 1, "err_msg": "Type is empty."});
				}
			}			
			
			seedPhoenixFHIR.path.GET = {
        "Coverage": {
          "location": "%(apikey)s/Coverage",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
			
			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					ApiFHIR.get('Coverage', {
            "apikey": apikey
          }, {}, function (error, response, body) {
						if (error) {
              res.json(error);
            } else {
							var coverage = JSON.parse(body);
							if (coverage.err_code == 0) {
								if (coverage.data.length > 0) {
									newCoverage = [];
									for (i = 0; i < coverage.data.length; i++) {
										myEmitter.prependOnceListener("getIdentifier", function (coverage, index, newCoverage, countCoverage) {
											qString = {};
                      qString.coverage_id = coverage.id;
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
													var objectCoverage = {};
													objectCoverage.resourceType = coverage.resourceType;
													objectCoverage.id = coverage.id;
													objectCoverage.identifier = identifier.data;
													objectCoverage.status = coverage.status;
													objectCoverage.type = coverage.type;
													objectCoverage.policyHolder = coverage.policyHolder;
													objectCoverage.subscriber = coverage.subscriber;
													objectCoverage.subscriberId = coverage.subscriberId;
													objectCoverage.beneficiary = coverage.beneficiary;
													objectCoverage.relationship = coverage.relationship;
													objectCoverage.period = coverage.period;
													objectCoverage.group = coverage.group;
													objectCoverage.dependent = coverage.dependent;
													objectCoverage.sequence = coverage.sequence;
													objectCoverage.order = coverage.order;
													objectCoverage.network = coverage.network;
													
													newCoverage[index] = objectCoverage;
													
													/*if (index == countCoverage - 1) {
														res.json({
															"err_code": 0,
															"data": newCoverage
														});
													}*/
													myEmitter.prependOnceListener("getCoveragePayorOrganization", function (coverage, index, newCoverage, countCoverage) {
														qString = {};
														qString.coverage_id = coverage.id;
														seedPhoenixFHIR.path.GET = {
															"CoveragePayorOrganization": {
																"location": "%(apikey)s/CoveragePayorOrganization",
																"query": qString
															}
														}
														var ApiFHIR = new Apiclient(seedPhoenixFHIR);
														ApiFHIR.get('CoveragePayorOrganization', {
															"apikey": apikey
														}, {}, function (error, response, body) {
															coveragePayorOrganization = JSON.parse(body);
															if (coveragePayorOrganization.err_code == 0) {
																var objectCoverage = {};
																objectCoverage.resourceType = coverage.resourceType;
																objectCoverage.id = coverage.id;
																objectCoverage.identifier = coverage.identifier;
																objectCoverage.status = coverage.status;
																objectCoverage.type = coverage.type;
																objectCoverage.policyHolder = coverage.policyHolder;
																objectCoverage.subscriber = coverage.subscriber;
																objectCoverage.subscriberId = coverage.subscriberId;
																objectCoverage.beneficiary = coverage.beneficiary;
																objectCoverage.relationship = coverage.relationship;
																objectCoverage.period = coverage.period;
																var Payor = {};
																Payor.organization = coveragePayorOrganization.data;
																objectCoverage.payor = Payor;
																objectCoverage.group = coverage.group;
																objectCoverage.dependent = coverage.dependent;
																objectCoverage.sequence = coverage.sequence;
																objectCoverage.order = coverage.order;
																objectCoverage.network = coverage.network;
																newCoverage[index] = objectCoverage;

																myEmitter.prependOnceListener("getCoveragePayorPatient", function (coverage, index, newCoverage, countCoverage) {
																	qString = {};
																	qString.coverage_id = coverage.id;
																	seedPhoenixFHIR.path.GET = {
																		"CoveragePayorPatient": {
																			"location": "%(apikey)s/CoveragePayorPatient",
																			"query": qString
																		}
																	}
																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																	ApiFHIR.get('CoveragePayorPatient', {
																		"apikey": apikey
																	}, {}, function (error, response, body) {
																		coveragePayorPatient = JSON.parse(body);
																		if (coveragePayorPatient.err_code == 0) {
																			var objectCoverage = {};
																			objectCoverage.resourceType = coverage.resourceType;
																			objectCoverage.id = coverage.id;
																			objectCoverage.identifier = coverage.identifier;
																			objectCoverage.status = coverage.status;
																			objectCoverage.type = coverage.type;
																			objectCoverage.policyHolder = coverage.policyHolder;
																			objectCoverage.subscriber = coverage.subscriber;
																			objectCoverage.subscriberId = coverage.subscriberId;
																			objectCoverage.beneficiary = coverage.beneficiary;
																			objectCoverage.relationship = coverage.relationship;
																			objectCoverage.period = coverage.period;
																			var Payor = {};
																			Payor.organization = coverage.payor.organization;
																			Payor.patient = coveragePayorPatient.data;
																			objectCoverage.payor = Payor;
																			objectCoverage.group = coverage.group;
																			objectCoverage.dependent = coverage.dependent;
																			objectCoverage.sequence = coverage.sequence;
																			objectCoverage.order = coverage.order;
																			objectCoverage.network = coverage.network;
																			newCoverage[index] = objectCoverage;

																			myEmitter.prependOnceListener("getCoveragePayorRelatedPerson", function (coverage, index, newCoverage, countCoverage) {
																				qString = {};
																				qString.coverage_id = coverage.id;
																				seedPhoenixFHIR.path.GET = {
																					"CoveragePayorRelatedPerson": {
																						"location": "%(apikey)s/CoveragePayorRelatedPerson",
																						"query": qString
																					}
																				}
																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																				ApiFHIR.get('CoveragePayorRelatedPerson', {
																					"apikey": apikey
																				}, {}, function (error, response, body) {
																					coveragePayorRelatedPerson = JSON.parse(body);
																					if (coveragePayorRelatedPerson.err_code == 0) {
																						var objectCoverage = {};
																						objectCoverage.resourceType = coverage.resourceType;
																						objectCoverage.id = coverage.id;
																						objectCoverage.identifier = coverage.identifier;
																						objectCoverage.status = coverage.status;
																						objectCoverage.type = coverage.type;
																						objectCoverage.policyHolder = coverage.policyHolder;
																						objectCoverage.subscriber = coverage.subscriber;
																						objectCoverage.subscriberId = coverage.subscriberId;
																						objectCoverage.beneficiary = coverage.beneficiary;
																						objectCoverage.relationship = coverage.relationship;
																						objectCoverage.period = coverage.period;
																						var Payor = {};
																						Payor.organization = coverage.payor.organization;
																						Payor.patient = coverage.payor.patient;
																						Payor.relatedPerson = coveragePayorRelatedPerson.data;
																						objectCoverage.payor = Payor;
																						objectCoverage.group = coverage.group;
																						objectCoverage.dependent = coverage.dependent;
																						objectCoverage.sequence = coverage.sequence;
																						objectCoverage.order = coverage.order;
																						objectCoverage.network = coverage.network;
																						newCoverage[index] = objectCoverage;

																						if (index == countCoverage - 1) {
																							res.json({
																								"err_code": 0,
																								"data": newCoverage
																							});
																						}
																					} else {
																						res.json(coveragePayorRelatedPerson);
																					}
																				})
																			})
																			myEmitter.emit("getCoveragePayorRelatedPerson", objectCoverage, index, newCoverage, countCoverage);
																		} else {
																			res.json(coveragePayorPatient);
																		}
																	})
																})
																myEmitter.emit("getCoveragePayorPatient", objectCoverage, index, newCoverage, countCoverage);
															} else {
																res.json(coveragePayorOrganization);
															}
														})
													})
													myEmitter.emit("getCoveragePayorOrganization", objectCoverage, index, newCoverage, countCoverage);
													
												} else {
                          res.json(identifier);
                        }
											})
										})
										myEmitter.emit("getIdentifier", coverage.data[i], i, newCoverage, coverage.data.length);
									}
								} else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Coverage is empty."
                  });
                }
							} else {
                res.json(coverage);
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
					var coverageId = req.params.coverage_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "COVERAGE_ID|" + coverageId, 'COVERAGE', function(resCoverageID){
								if(resCoverageID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.coverage_id = coverageId;
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
						  			qString.coverage_id = coverageId;
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
									res.json({"err_code": 501, "err_msg": "Coverage Id not found"});		
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
		coverage: function addCoverage(req, res) {
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
type|type|||a
policyHolder.patient|policyHolderPatient|||
policyHolder.relatedPerson|policyHolderRelatedPerson|||
policyHolder.organization|policyHolderOrganization|||
subscriber.patient|subscriberPatient|||
subscriber.relatedPerson|subscriberRelatedPerson|||
subscriberId|subscriberId|||
beneficiary|beneficiary|||
relationship|relationship|||
period|period|period||
payor.organization|payorOrganization|||
payor.patient|payorPatient|||
payor.relatedPerson|payorRelatedPerson|||
grouping.group|groupingGroup|||
grouping.groupDisplay|groupingGroupDisplay|||
grouping.subGroup|groupingSubGroup|||
grouping.subGroupDisplay|groupingSubGroupDisplay|||
grouping.plan|groupingPlan|||
grouping.planDisplay|groupingPlanDisplay|||
grouping.subPlan|groupingSubPlan|||
grouping.subPlanDisplay|groupingSubPlanDisplay|||
grouping.class|groupingClass|||
grouping.classDisplay|groupingClassDisplay|||
grouping.subClass|groupingSubClass|||
grouping.subClassDisplay|groupingSubClassDisplay|||
dependent|dependent|||
sequence|sequence|||
order|order|integer||
network|network||
*/			
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json coverage request.";
			}

			if(typeof req.body.type !== 'undefined'){
				var type =  req.body.type.trim();
				if(validator.isEmpty(type)){
					type = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json coverage request.";
			}

			if(typeof req.body.policyHolder.patient !== 'undefined'){
				var policyHolderPatient =  req.body.policyHolder.patient.trim().toLowerCase();
				if(validator.isEmpty(policyHolderPatient)){
					policyHolderPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'policy holder patient' in json coverage request.";
			}

			if(typeof req.body.policyHolder.relatedPerson !== 'undefined'){
				var policyHolderRelatedPerson =  req.body.policyHolder.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(policyHolderRelatedPerson)){
					policyHolderRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'policy holder related person' in json coverage request.";
			}

			if(typeof req.body.policyHolder.organization !== 'undefined'){
				var policyHolderOrganization =  req.body.policyHolder.organization.trim().toLowerCase();
				if(validator.isEmpty(policyHolderOrganization)){
					policyHolderOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'policy holder organization' in json coverage request.";
			}

			if(typeof req.body.subscriber.patient !== 'undefined'){
				var subscriberPatient =  req.body.subscriber.patient.trim().toLowerCase();
				if(validator.isEmpty(subscriberPatient)){
					subscriberPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subscriber patient' in json Coverage request.";
			}

			if(typeof req.body.subscriber.relatedPerson !== 'undefined'){
				var subscriberRelatedPerson =  req.body.subscriber.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(subscriberRelatedPerson)){
					subscriberRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subscriber related person' in json Coverage request.";
			}

			if(typeof req.body.subscriberId !== 'undefined'){
				var subscriberId =  req.body.subscriberId.trim().toLowerCase();
				if(validator.isEmpty(subscriberId)){
					subscriberId = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'subscriber id' in json coverage request.";
			}

			if(typeof req.body.beneficiary !== 'undefined'){
				var beneficiary =  req.body.beneficiary.trim().toLowerCase();
				if(validator.isEmpty(beneficiary)){
					beneficiary = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'beneficiary' in json coverage request.";
			}

			if(typeof req.body.relationship !== 'undefined'){
				var relationship =  req.body.relationship.trim().toLowerCase();
				if(validator.isEmpty(relationship)){
					relationship = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'relationship' in json coverage request.";
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
				      err_msg = "coverage period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "coverage period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'period' in json coverage request.";
			}

			if(typeof req.body.payor.organization !== 'undefined'){
				var payorOrganization =  req.body.payor.organization.trim().toLowerCase();
				if(validator.isEmpty(payorOrganization)){
					payorOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payor organization' in json coverage request.";
			}

			if(typeof req.body.payor.patient !== 'undefined'){
				var payorPatient =  req.body.payor.patient.trim().toLowerCase();
				if(validator.isEmpty(payorPatient)){
					payorPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payor patient' in json coverage request.";
			}

			if(typeof req.body.payor.relatedPerson !== 'undefined'){
				var payorRelatedPerson =  req.body.payor.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(payorRelatedPerson)){
					payorRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payor related person' in json coverage request.";
			}

			if(typeof req.body.grouping.group !== 'undefined'){
				var groupingGroup =  req.body.grouping.group.trim().toLowerCase();
				if(validator.isEmpty(groupingGroup)){
					groupingGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'grouping group' in json coverage request.";
			}

			if(typeof req.body.grouping.groupDisplay !== 'undefined'){
				var groupingGroupDisplay =  req.body.grouping.groupDisplay.trim().toLowerCase();
				if(validator.isEmpty(groupingGroupDisplay)){
					groupingGroupDisplay = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'grouping group display' in json coverage request.";
			}

			if(typeof req.body.grouping.subGroup !== 'undefined'){
				var groupingSubGroup =  req.body.grouping.subGroup.trim().toLowerCase();
				if(validator.isEmpty(groupingSubGroup)){
					groupingSubGroup = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'grouping sub group' in json coverage request.";
			}

			if(typeof req.body.grouping.subGroupDisplay !== 'undefined'){
				var groupingSubGroupDisplay =  req.body.grouping.subGroupDisplay.trim().toLowerCase();
				if(validator.isEmpty(groupingSubGroupDisplay)){
					groupingSubGroupDisplay = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'grouping sub group display' in json coverage request.";
			}

			if(typeof req.body.grouping.plan !== 'undefined'){
				var groupingPlan =  req.body.grouping.plan.trim().toLowerCase();
				if(validator.isEmpty(groupingPlan)){
					groupingPlan = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'grouping plan' in json coverage request.";
			}

			if(typeof req.body.grouping.planDisplay !== 'undefined'){
				var groupingPlanDisplay =  req.body.grouping.planDisplay.trim().toLowerCase();
				if(validator.isEmpty(groupingPlanDisplay)){
					groupingPlanDisplay = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'grouping plan display' in json coverage request.";
			}

			if(typeof req.body.grouping.subPlan !== 'undefined'){
				var groupingSubPlan =  req.body.grouping.subPlan.trim().toLowerCase();
				if(validator.isEmpty(groupingSubPlan)){
					groupingSubPlan = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'grouping sub plan' in json coverage request.";
			}

			if(typeof req.body.grouping.subPlanDisplay !== 'undefined'){
				var groupingSubPlanDisplay =  req.body.grouping.subPlanDisplay.trim().toLowerCase();
				if(validator.isEmpty(groupingSubPlanDisplay)){
					groupingSubPlanDisplay = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'grouping sub plan display' in json coverage request.";
			}

			if(typeof req.body.grouping.class !== 'undefined'){
				var groupingClass =  req.body.grouping.class.trim().toLowerCase();
				if(validator.isEmpty(groupingClass)){
					groupingClass = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'grouping class' in json coverage request.";
			}

			if(typeof req.body.grouping.classDisplay !== 'undefined'){
				var groupingClassDisplay =  req.body.grouping.classDisplay.trim().toLowerCase();
				if(validator.isEmpty(groupingClassDisplay)){
					groupingClassDisplay = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'grouping class display' in json coverage request.";
			}

			if(typeof req.body.grouping.subClass !== 'undefined'){
				var groupingSubClass =  req.body.grouping.subClass.trim().toLowerCase();
				if(validator.isEmpty(groupingSubClass)){
					groupingSubClass = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'grouping sub class' in json coverage request.";
			}

			if(typeof req.body.grouping.subClassDisplay !== 'undefined'){
				var groupingSubClassDisplay =  req.body.grouping.subClassDisplay.trim().toLowerCase();
				if(validator.isEmpty(groupingSubClassDisplay)){
					groupingSubClassDisplay = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'grouping sub class display' in json coverage request.";
			}

			if(typeof req.body.dependent !== 'undefined'){
				var dependent =  req.body.dependent.trim().toLowerCase();
				if(validator.isEmpty(dependent)){
					dependent = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'dependent' in json coverage request.";
			}

			if(typeof req.body.sequence !== 'undefined'){
				var sequence =  req.body.sequence.trim().toLowerCase();
				if(validator.isEmpty(sequence)){
					sequence = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'sequence' in json coverage request.";
			}

			if(typeof req.body.order !== 'undefined'){
				var order =  req.body.order.trim();
				if(validator.isEmpty(order)){
					order = "";
				}else{
					if(!validator.isInt(order)){
						err_code = 2;
						err_msg = "coverage order is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'order' in json coverage request.";
			}

			if(typeof req.body.network !== 'undefined'){
				var network =  req.body.network.trim().toLowerCase();
				if(validator.isEmpty(network)){
					network = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'network' in json coverage request.";
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
														var coverageId = 'cov' + unicId;
														
/*status|status|||
type|type|||a
policyHolder.patient|policyHolderPatient|||
policyHolder.relatedPerson|policyHolderRelatedPerson|||
policyHolder.organization|policyHolderOrganization|||
subscriber.patient|subscriberPatient|||
subscriber.relatedPerson|subscriberRelatedPerson|||
subscriberId|subscriberId|||
beneficiary|beneficiary|||
relationship|relationship|||
period|period|period||
grouping.group|groupingGroup|||
grouping.groupDisplay|groupingGroupDisplay|||
grouping.subGroup|groupingSubGroup|||
grouping.subGroupDisplay|groupingSubGroupDisplay|||
grouping.plan|groupingPlan|||
grouping.planDisplay|groupingPlanDisplay|||
grouping.subPlan|groupingSubPlan|||
grouping.subPlanDisplay|groupingSubPlanDisplay|||
grouping.class|groupingClass|||
grouping.classDisplay|groupingClassDisplay|||
grouping.subClass|groupingSubClass|||
grouping.subClassDisplay|groupingSubClassDisplay|||
dependent|dependent|||
sequence|sequence|||
order|order|integer||
network|network||*/														
														dataCoverage = {
															"coverage_id" : coverageId,
															"coverage_status" : status,
															"coverage_type" : type,
															"policy_holder_patient" : policyHolderPatient,
															"policy_holder_related_person" : policyHolderRelatedPerson,
															"policy_holder_organization" : policyHolderOrganization,
															"subscriber_patient" : subscriberPatient,
															"subscriber_related_person" : subscriberRelatedPerson,
															"subscriber_id" : subscriberId,
															"coverage_beneficiary" : beneficiary,
															"coverage_relationship" : relationship,
															"coverage_period_start" : periodStart,
															"coverage_perido_end" : periodEnd,
															"grouping_group" : groupingGroup,
															"grouping_group_display" : groupingGroupDisplay,
															"grouping_sub_group" : groupingSubGroup,
															"grouping_sub_group_display" : groupingSubGroupDisplay,
															"grouping_plan" : groupingPlan,
															"grouping_plan_display" : groupingPlanDisplay,
															"grouping_sub_plan" : groupingSubPlan,
															"grouping_sub_plan_display" : groupingSubPlanDisplay,
															"grouping_class" : groupingClass,
															"grouping_class_display" : groupingClassDisplay,
															"grouping_sub_class" : groupingSubClass,
															"grouping_sub_class_display" : groupingSubClassDisplay,
															"coverage_dependent" : dependent,
															"coverage_sequence" : sequence,
															"coverage_order" : order,
															"coverage_network" : network
														}
														console.log(dataCoverage);
														ApiFHIR.post('coverage', {"apikey": apikey}, {body: dataCoverage, json: true}, function(error, response, body){
															coverage = body;
															if(coverage.err_code > 0){
																res.json(coverage);	
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
																							"coverage_id": coverageId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														if(payorOrganization !== ""){
															dataPayorOrganization = {
																"_id" : payorOrganization,
																"coverage_id" : coverageId
															}
															ApiFHIR.put('organization', {"apikey": apikey, "_id": payorOrganization}, {body: dataPayorOrganization, json: true}, function(error, response, body){
																returnPayorOrganization = body;
																if(returnPayorOrganization.err_code > 0){
																	res.json(returnPayorOrganization);	
																	console.log("add reference Payor organization : " + payorOrganization);
																}
															});
														}

														if(payorPatient !== ""){
															dataPayorPatient = {
																"_id" : payorPatient,
																"coverage_id" : coverageId
															}
															ApiFHIR.put('patient', {"apikey": apikey, "_id": payorPatient}, {body: dataPayorPatient, json: true}, function(error, response, body){
																returnPayorPatient = body;
																if(returnPayorPatient.err_code > 0){
																	res.json(returnPayorPatient);	
																	console.log("add reference Payor patient : " + payorPatient);
																}
															});
														}

														if(payorRelatedPerson !== ""){
															dataPayorRelatedPerson = {
																"_id" : payorRelatedPerson,
																"coverage_id" : coverageId
															}
															ApiFHIR.put('relatedPerson', {"apikey": apikey, "_id": payorRelatedPerson}, {body: dataPayorRelatedPerson, json: true}, function(error, response, body){
																returnPayorRelatedPerson = body;
																if(returnPayorRelatedPerson.err_code > 0){
																	res.json(returnPayorRelatedPerson);	
																	console.log("add reference Payor related person : " + payorRelatedPerson);
																}
															});
														}

										
														res.json({"err_code": 0, "err_msg": "Coverage has been add.", "data": [{"_id": coverageId}]});
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

										myEmitter.prependOnceListener('checkType', function () {
											if (!validator.isEmpty(type)) {
												checkCode(apikey, type, 'COVERAGE_TYPE', function (resTypeCode) {
													if (resTypeCode.err_code > 0) {
														myEmitter.emit('checkStatus');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkStatus');
											}
										})

										myEmitter.prependOnceListener('checkRelationship', function () {
											if (!validator.isEmpty(relationship)) {
												checkCode(apikey, relationship, 'POLICYHOLDER_RELATIONSHIP', function (resRelationshipCode) {
													if (resRelationshipCode.err_code > 0) {
														myEmitter.emit('checkType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Relationship code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkType');
											}
										})

										myEmitter.prependOnceListener('checkPolicyHolderPatient', function () {
											if (!validator.isEmpty(policyHolderPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + policyHolderPatient, 'PATIENT', function (resPolicyHolderPatient) {
													if (resPolicyHolderPatient.err_code > 0) {
														myEmitter.emit('checkRelationship');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Policy holder patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRelationship');
											}
										})

										myEmitter.prependOnceListener('checkPolicyHolderRelatedPerson', function () {
											if (!validator.isEmpty(policyHolderRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + policyHolderRelatedPerson, 'RELATED_PERSON', function (resPolicyHolderRelatedPerson) {
													if (resPolicyHolderRelatedPerson.err_code > 0) {
														myEmitter.emit('checkPolicyHolderPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Policy holder related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPolicyHolderPatient');
											}
										})

										myEmitter.prependOnceListener('checkPolicyHolderOrganization', function () {
											if (!validator.isEmpty(policyHolderOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + policyHolderOrganization, 'ORGANIZATION', function (resPolicyHolderOrganization) {
													if (resPolicyHolderOrganization.err_code > 0) {
														myEmitter.emit('checkPolicyHolderRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Policy holder organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPolicyHolderRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkSubscriberPatient', function () {
											if (!validator.isEmpty(subscriberPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + subscriberPatient, 'PATIENT', function (resSubscriberPatient) {
													if (resSubscriberPatient.err_code > 0) {
														myEmitter.emit('checkPolicyHolderOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subscriber patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPolicyHolderOrganization');
											}
										})

										myEmitter.prependOnceListener('checkSubscriberRelatedPerson', function () {
											if (!validator.isEmpty(subscriberRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + subscriberRelatedPerson, 'RELATED_PERSON', function (resSubscriberRelatedPerson) {
													if (resSubscriberRelatedPerson.err_code > 0) {
														myEmitter.emit('checkSubscriberPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Subscriber related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubscriberPatient');
											}
										})

										myEmitter.prependOnceListener('checkBeneficiary', function () {
											if (!validator.isEmpty(beneficiary)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + beneficiary, 'PATIENT', function (resBeneficiary) {
													if (resBeneficiary.err_code > 0) {
														myEmitter.emit('checkSubscriberRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Beneficiary id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubscriberRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkPayorOrganization', function () {
											if (!validator.isEmpty(payorOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + payorOrganization, 'ORGANIZATION', function (resPayorOrganization) {
													if (resPayorOrganization.err_code > 0) {
														myEmitter.emit('checkBeneficiary');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payor organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBeneficiary');
											}
										})

										myEmitter.prependOnceListener('checkPayorPatient', function () {
											if (!validator.isEmpty(payorPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + payorPatient, 'PATIENT', function (resPayorPatient) {
													if (resPayorPatient.err_code > 0) {
														myEmitter.emit('checkPayorOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payor patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPayorOrganization');
											}
										})

										if (!validator.isEmpty(payorRelatedPerson)) {
											checkUniqeValue(apikey, "RELATED_PERSON_ID|" + payorRelatedPerson, 'RELATED_PERSON', function (resPayorRelatedPerson) {
												if (resPayorRelatedPerson.err_code > 0) {
													myEmitter.emit('checkPayorPatient');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Payor related person id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkPayorPatient');
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
      var coverageId = req.params.coverage_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof coverageId !== 'undefined') {
        if (validator.isEmpty(coverageId)) {
          err_code = 2;
          err_msg = "Coverage id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Coverage id is required";
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
                        checkUniqeValue(apikey, "COVERAGE_ID|" + coverageId, 'COVERAGE', function (resEncounterID) {
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
                              "coverage_id": coverageId
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
                                  "err_msg": "Identifier has been add in this Coverage.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
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
		coverage: function updateCoverage(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var coverageId = req.params.coverage_id;
			
			var err_code = 0;
      var err_msg = "";
      var dataCoverage = {};
			
			if (typeof coverageId !== 'undefined') {
        if (validator.isEmpty(coverageId)) {
          err_code = 2;
          err_msg = "Coverage Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Coverage Id is required.";
      }
			
			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					dataCoverage.coverage_status = "";
				}else{
					dataCoverage.coverage_status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var type =  req.body.type.trim();
				if(validator.isEmpty(type)){
					dataCoverage.coverage_type = "";
				}else{
					dataCoverage.coverage_type = type;
				}
			}else{
			  type = "";
			}

			if(typeof req.body.policyHolder.patient !== 'undefined' && req.body.policyHolder.patient !== ""){
				var policyHolderPatient =  req.body.policyHolder.patient.trim().toLowerCase();
				if(validator.isEmpty(policyHolderPatient)){
					dataCoverage.policy_holder_patient = "";
				}else{
					dataCoverage.policy_holder_patient = policyHolderPatient;
				}
			}else{
			  policyHolderPatient = "";
			}

			if(typeof req.body.policyHolder.relatedPerson !== 'undefined' && req.body.policyHolder.relatedPerson !== ""){
				var policyHolderRelatedPerson =  req.body.policyHolder.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(policyHolderRelatedPerson)){
					dataCoverage.policy_holder_related_person = "";
				}else{
					dataCoverage.policy_holder_related_person = policyHolderRelatedPerson;
				}
			}else{
			  policyHolderRelatedPerson = "";
			}

			if(typeof req.body.policyHolder.organization !== 'undefined' && req.body.policyHolder.organization !== ""){
				var policyHolderOrganization =  req.body.policyHolder.organization.trim().toLowerCase();
				if(validator.isEmpty(policyHolderOrganization)){
					dataCoverage.policy_holder_organization = "";
				}else{
					dataCoverage.policy_holder_organization = policyHolderOrganization;
				}
			}else{
			  policyHolderOrganization = "";
			}
			
			if(typeof req.body.subscriber.patient !== 'undefined' && req.body.subscriber.patient !== ""){
				var subscriberPatient =  req.body.subscriber.patient.trim().toLowerCase();
				if(validator.isEmpty(subscriberPatient)){
					dataCoverage.subscriber_patient = "";
				}else{
					dataCoverage.subscriber_patient = subscriberPatient;
				}
			}else{
			  subscriberPatient = "";
			}

			if(typeof req.body.subscriber.relatedPerson !== 'undefined' && req.body.subscriber.relatedPerson !== ""){
				var subscriberRelatedPerson =  req.body.subscriber.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(subscriberRelatedPerson)){
					dataCoverage.subscriber_related_person = "";
				}else{
					dataCoverage.subscriber_related_person = subscriberRelatedPerson;
				}
			}else{
			  subscriberRelatedPerson = "";
			}

			if(typeof req.body.subscriberId !== 'undefined' && req.body.subscriberId !== ""){
				var subscriberId =  req.body.subscriberId.trim().toLowerCase();
				if(validator.isEmpty(subscriberId)){
					dataCoverage.subscriber_id = "";
				}else{
					dataCoverage.subscriber_id = subscriberId;
				}
			}else{
			  subscriberId = "";
			}

			if(typeof req.body.beneficiary !== 'undefined' && req.body.beneficiary !== ""){
				var beneficiary =  req.body.beneficiary.trim().toLowerCase();
				if(validator.isEmpty(beneficiary)){
					dataCoverage.coverage_beneficiary = "";
				}else{
					dataCoverage.coverage_beneficiary = beneficiary;
				}
			}else{
			  beneficiary = "";
			}

			if(typeof req.body.relationship !== 'undefined' && req.body.relationship !== ""){
				var relationship =  req.body.relationship.trim().toLowerCase();
				if(validator.isEmpty(relationship)){
					dataCoverage.coverage_relationship = "";
				}else{
					dataCoverage.coverage_relationship = relationship;
				}
			}else{
			  relationship = "";
			}

			if (typeof req.body.period !== 'undefined' && req.body.period !== "") {
			  var period = req.body.period;
			  if (period.indexOf("to") > 0) {
			    arrPeriod = period.split("to");
			    dataCoverage.coverage_period_start = arrPeriod[0];
			    dataCoverage.coverage_period_end = arrPeriod[1];
			    if (!regex.test(periodStart) && !regex.test(periodEnd)) {
			      err_code = 2;
			      err_msg = "coverage period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "coverage period invalid date format.";
				}
			} else {
			  period = "";
			}

			/* reference many
			if(typeof req.body.payor.organization !== 'undefined' && req.body.payor.organization !== ""){
				var payorOrganization =  req.body.payor.organization.trim().toLowerCase();
				if(validator.isEmpty(payorOrganization)){
					dataCoverage.organization = "";
				}else{
					dataCoverage.organization = payorOrganization;
				}
			}else{
			  payorOrganization = "";
			}

			if(typeof req.body.payor.patient !== 'undefined' && req.body.payor.patient !== ""){
				var payorPatient =  req.body.payor.patient.trim().toLowerCase();
				if(validator.isEmpty(payorPatient)){
					dataCoverage.patient = "";
				}else{
					dataCoverage.patient = payorPatient;
				}
			}else{
			  payorPatient = "";
			}

			if(typeof req.body.payor.relatedPerson !== 'undefined' && req.body.payor.relatedPerson !== ""){
				var payorRelatedPerson =  req.body.payor.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(payorRelatedPerson)){
					dataCoverage.related_person = "";
				}else{
					dataCoverage.related_person = payorRelatedPerson;
				}
			}else{
			  payorRelatedPerson = "";
			}*/

			if(typeof req.body.grouping.group !== 'undefined' && req.body.grouping.group !== ""){
				var groupingGroup =  req.body.grouping.group.trim().toLowerCase();
				if(validator.isEmpty(groupingGroup)){
					dataCoverage.grouping_group = "";
				}else{
					dataCoverage.grouping_group = groupingGroup;
				}
			}else{
			  groupingGroup = "";
			}

			if(typeof req.body.grouping.groupDisplay !== 'undefined' && req.body.grouping.groupDisplay !== ""){
				var groupingGroupDisplay =  req.body.grouping.groupDisplay.trim().toLowerCase();
				if(validator.isEmpty(groupingGroupDisplay)){
					dataCoverage.grouping_group_display = "";
				}else{
					dataCoverage.grouping_group_display = groupingGroupDisplay;
				}
			}else{
			  groupingGroupDisplay = "";
			}

			if(typeof req.body.grouping.subGroup !== 'undefined' && req.body.grouping.subGroup !== ""){
				var groupingSubGroup =  req.body.grouping.subGroup.trim().toLowerCase();
				if(validator.isEmpty(groupingSubGroup)){
					dataCoverage.grouping_sub_group = "";
				}else{
					dataCoverage.grouping_sub_group = groupingSubGroup;
				}
			}else{
			  groupingSubGroup = "";
			}

			if(typeof req.body.grouping.subGroupDisplay !== 'undefined' && req.body.grouping.subGroupDisplay !== ""){
				var groupingSubGroupDisplay =  req.body.grouping.subGroupDisplay.trim().toLowerCase();
				if(validator.isEmpty(groupingSubGroupDisplay)){
					dataCoverage.grouping_sub_group_display = "";
				}else{
					dataCoverage.grouping_sub_group_display = groupingSubGroupDisplay;
				}
			}else{
			  groupingSubGroupDisplay = "";
			}

			if(typeof req.body.grouping.plan !== 'undefined' && req.body.grouping.plan !== ""){
				var groupingPlan =  req.body.grouping.plan.trim().toLowerCase();
				if(validator.isEmpty(groupingPlan)){
					dataCoverage.grouping_plan = "";
				}else{
					dataCoverage.grouping_plan = groupingPlan;
				}
			}else{
			  groupingPlan = "";
			}

			if(typeof req.body.grouping.planDisplay !== 'undefined' && req.body.grouping.planDisplay !== ""){
				var groupingPlanDisplay =  req.body.grouping.planDisplay.trim().toLowerCase();
				if(validator.isEmpty(groupingPlanDisplay)){
					dataCoverage.grouping_plan_display = "";
				}else{
					dataCoverage.grouping_plan_display = groupingPlanDisplay;
				}
			}else{
			  groupingPlanDisplay = "";
			}

			if(typeof req.body.grouping.subPlan !== 'undefined' && req.body.grouping.subPlan !== ""){
				var groupingSubPlan =  req.body.grouping.subPlan.trim().toLowerCase();
				if(validator.isEmpty(groupingSubPlan)){
					dataCoverage.grouping_sub_plan = "";
				}else{
					dataCoverage.grouping_sub_plan = groupingSubPlan;
				}
			}else{
			  groupingSubPlan = "";
			}

			if(typeof req.body.grouping.subPlanDisplay !== 'undefined' && req.body.grouping.subPlanDisplay !== ""){
				var groupingSubPlanDisplay =  req.body.grouping.subPlanDisplay.trim().toLowerCase();
				if(validator.isEmpty(groupingSubPlanDisplay)){
					dataCoverage.grouping_sub_plan_display = "";
				}else{
					dataCoverage.grouping_sub_plan_display = groupingSubPlanDisplay;
				}
			}else{
			  groupingSubPlanDisplay = "";
			}

			if(typeof req.body.grouping.class !== 'undefined' && req.body.grouping.class !== ""){
				var groupingClass =  req.body.grouping.class.trim().toLowerCase();
				if(validator.isEmpty(groupingClass)){
					dataCoverage.grouping_class = "";
				}else{
					dataCoverage.grouping_class = groupingClass;
				}
			}else{
			  groupingClass = "";
			}

			if(typeof req.body.grouping.classDisplay !== 'undefined' && req.body.grouping.classDisplay !== ""){
				var groupingClassDisplay =  req.body.grouping.classDisplay.trim().toLowerCase();
				if(validator.isEmpty(groupingClassDisplay)){
					dataCoverage.grouping_class_display = "";
				}else{
					dataCoverage.grouping_class_display = groupingClassDisplay;
				}
			}else{
			  groupingClassDisplay = "";
			}

			if(typeof req.body.grouping.subClass !== 'undefined' && req.body.grouping.subClass !== ""){
				var groupingSubClass =  req.body.grouping.subClass.trim().toLowerCase();
				if(validator.isEmpty(groupingSubClass)){
					dataCoverage.grouping_sub_class = "";
				}else{
					dataCoverage.grouping_sub_class = groupingSubClass;
				}
			}else{
			  groupingSubClass = "";
			}

			if(typeof req.body.grouping.subClassDisplay !== 'undefined' && req.body.grouping.subClassDisplay !== ""){
				var groupingSubClassDisplay =  req.body.grouping.subClassDisplay.trim().toLowerCase();
				if(validator.isEmpty(groupingSubClassDisplay)){
					dataCoverage.grouping_sub_class_display = "";
				}else{
					dataCoverage.grouping_sub_class_display = groupingSubClassDisplay;
				}
			}else{
			  groupingSubClassDisplay = "";
			}

			if(typeof req.body.dependent !== 'undefined' && req.body.dependent !== ""){
				var dependent =  req.body.dependent.trim().toLowerCase();
				if(validator.isEmpty(dependent)){
					dataCoverage.coverage_dependent = "";
				}else{
					dataCoverage.coverage_dependent = dependent;
				}
			}else{
			  dependent = "";
			}

			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var sequence =  req.body.sequence.trim().toLowerCase();
				if(validator.isEmpty(sequence)){
					dataCoverage.coverage_sequence = "";
				}else{
					dataCoverage.coverage_sequence = sequence;
				}
			}else{
			  sequence = "";
			}

			if(typeof req.body.order !== 'undefined' && req.body.order !== ""){
				var order =  req.body.order.trim();
				if(validator.isEmpty(order)){
					dataCoverage.coverage_order = "";
				}else{
					if(!validator.isInt(order)){
						err_code = 2;
						err_msg = "coverage order is must be number.";
					}else{
						dataCoverage.coverage_order = order;
					}
				}
			}else{
			  order = "";
			}

			if(typeof req.body.network !== 'undefined' && req.body.network !== ""){
				var network =  req.body.network.trim().toLowerCase();
				if(validator.isEmpty(network)){
					dataCoverage.coverage_network = "";
				}else{
					dataCoverage.coverage_network = network;
				}
			}else{
			  network = "";
			}

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "COVERAGE_ID|" + coverageId, 'COVERAGE', function (resCoverageId) {
								if (resCoverageId.err_code > 0) {
									ApiFHIR.put('coverage', {
										"apikey": apikey,
										"_id": coverageId
									}, {
										body: dataCoverage,
										json: true
									}, function (error, response, body) {
										coverage = body;
										if (coverage.err_code > 0) {
											res.json(coverage);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "Coverage has been updated.",
												"data": coverage.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 404,
										"err_msg": "Coverage Id not found"
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

						myEmitter.prependOnceListener('checkType', function () {
							if (!validator.isEmpty(type)) {
								checkCode(apikey, type, 'COVERAGE_TYPE', function (resTypeCode) {
									if (resTypeCode.err_code > 0) {
										myEmitter.emit('checkStatus');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkStatus');
							}
						})

						myEmitter.prependOnceListener('checkRelationship', function () {
							if (!validator.isEmpty(relationship)) {
								checkCode(apikey, relationship, 'POLICYHOLDER_RELATIONSHIP', function (resRelationshipCode) {
									if (resRelationshipCode.err_code > 0) {
										myEmitter.emit('checkType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Relationship code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkType');
							}
						})

						myEmitter.prependOnceListener('checkPolicyHolderPatient', function () {
							if (!validator.isEmpty(policyHolderPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + policyHolderPatient, 'PATIENT', function (resPolicyHolderPatient) {
									if (resPolicyHolderPatient.err_code > 0) {
										myEmitter.emit('checkRelationship');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Policy holder patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRelationship');
							}
						})

						myEmitter.prependOnceListener('checkPolicyHolderRelatedPerson', function () {
							if (!validator.isEmpty(policyHolderRelatedPerson)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + policyHolderRelatedPerson, 'RELATED_PERSON', function (resPolicyHolderRelatedPerson) {
									if (resPolicyHolderRelatedPerson.err_code > 0) {
										myEmitter.emit('checkPolicyHolderPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Policy holder related person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPolicyHolderPatient');
							}
						})

						myEmitter.prependOnceListener('checkPolicyHolderOrganization', function () {
							if (!validator.isEmpty(policyHolderOrganization)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + policyHolderOrganization, 'ORGANIZATION', function (resPolicyHolderOrganization) {
									if (resPolicyHolderOrganization.err_code > 0) {
										myEmitter.emit('checkPolicyHolderRelatedPerson');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Policy holder organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPolicyHolderRelatedPerson');
							}
						})

						myEmitter.prependOnceListener('checkSubscriberPatient', function () {
							if (!validator.isEmpty(subscriberPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + subscriberPatient, 'PATIENT', function (resSubscriberPatient) {
									if (resSubscriberPatient.err_code > 0) {
										myEmitter.emit('checkPolicyHolderOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Subscriber patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPolicyHolderOrganization');
							}
						})

						myEmitter.prependOnceListener('checkSubscriberRelatedPerson', function () {
							if (!validator.isEmpty(subscriberRelatedPerson)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + subscriberRelatedPerson, 'RELATED_PERSON', function (resSubscriberRelatedPerson) {
									if (resSubscriberRelatedPerson.err_code > 0) {
										myEmitter.emit('checkSubscriberPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Subscriber related person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubscriberPatient');
							}
						})

						if (!validator.isEmpty(beneficiary)) {
							checkUniqeValue(apikey, "PATIENT_ID|" + beneficiary, 'PATIENT', function (resBeneficiary) {
								if (resBeneficiary.err_code > 0) {
									myEmitter.emit('checkSubscriberRelatedPerson');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Beneficiary id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkSubscriberRelatedPerson');
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
      var coverageId = req.params.coverage_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof coverageId !== 'undefined') {
        if (validator.isEmpty(coverageId)) {
          err_code = 2;
          err_msg = "Coverage id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Coverage id is required";
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
            myEmitter.once('checkCoverageId', function () {
              checkUniqeValue(apikey, "COVERAGE_ID|" + coverageId, 'COVERAGE', function (resCoverageId) {
                if (resCoverageId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "COVERAGE_ID|" + coverageId
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
                            "err_msg": "Identifier has been update in this Coverage.",
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
                    "err_msg": "Coverage Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkCoverageId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkCoverageId');
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