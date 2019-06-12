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
		claim: function getClaim(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};
			var claimId = req.query._id;
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
			
			if (typeof claimId !== 'undefined') {
        if (!validator.isEmpty(claimId)) {
          qString._id = claimId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Claim ID is required."
          })
        }
      }
			
			/*search*/
			var care_team = req.query.careTeam;
			var created = req.query.created;
			var encounter = req.query.encounter;
			var enterer = req.query.enterer;
			var facility = req.query.facility;
			var identifier = req.query.identifier;
			var insurer = req.query.insurer;
			var organization = req.query.organization;
			var patient = req.query.patient;
			var payee = req.query.payee;
			var priority = req.query.priority;
			var provider = req.query.provider;
			var use = req.query.use;
			
			if(typeof care_team !== 'undefined'){
				if(!validator.isEmpty(care_team)){
					qString.care_team = care_team; 
				}else{
					res.json({"err_code": 1, "err_msg": "Care team is empty."});
				}
			}

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

			if(typeof encounter !== 'undefined'){
				if(!validator.isEmpty(encounter)){
					qString.encounter = encounter; 
				}else{
					res.json({"err_code": 1, "err_msg": "Encounter is empty."});
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

			if(typeof insurer !== 'undefined'){
				if(!validator.isEmpty(insurer)){
					qString.insurer = insurer; 
				}else{
					res.json({"err_code": 1, "err_msg": "Insurer is empty."});
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

			if(typeof payee !== 'undefined'){
				if(!validator.isEmpty(payee)){
					qString.payee = payee; 
				}else{
					res.json({"err_code": 1, "err_msg": "Payee is empty."});
				}
			}

			if(typeof priority !== 'undefined'){
				if(!validator.isEmpty(priority)){
					qString.priority = priority; 
				}else{
					res.json({"err_code": 1, "err_msg": "Priority is empty."});
				}
			}

			if(typeof provider !== 'undefined'){
				if(!validator.isEmpty(provider)){
					qString.provider = provider; 
				}else{
					res.json({"err_code": 1, "err_msg": "Provider is empty."});
				}
			}

			if(typeof use !== 'undefined'){
				if(!validator.isEmpty(use)){
					qString.use = use; 
				}else{
					res.json({"err_code": 1, "err_msg": "Use is empty."});
				}
			}

			
			seedPhoenixFHIR.path.GET = {
        "Claim": {
          "location": "%(apikey)s/Claim",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
			
			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					ApiFHIR.get('Claim', {
            "apikey": apikey
          }, {}, function (error, response, body) {
						if (error) {
              res.json(error);
            } else {
							var claim = JSON.parse(body);
							if (claim.err_code == 0) {
								if (claim.data.length > 0) {
									newClaim = [];
									for (i = 0; i < claim.data.length; i++) {
										myEmitter.prependOnceListener("getIdentifier", function (claim, index, newClaim, countClaim) {
											qString = {};
                      qString.claim_id = claim.id;
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
													var objectClaim = {};
													objectClaim.resourceType = claim.resourceType;
													objectClaim.id = claim.id;
													objectClaim.identifier = identifier.data;
													objectClaim.status = claim.status;
													objectClaim.type = claim.type;
													objectClaim.subtype = claim.subtype;
													objectClaim.uses = claim.uses;
													objectClaim.patient = claim.patient;
													objectClaim.created = claim.created;
													objectClaim.enterer = claim.enterer;
													objectClaim.insurer = claim.insurer;
													objectClaim.provider = claim.provider;
													objectClaim.organization = claim.organization;
													objectClaim.priority = claim.priority;
													objectClaim.fundsReserve = claim.fundsReserve;
													objectClaim.prescription = claim.prescription;
													objectClaim.originalPrescription = claim.originalPrescription;
													objectClaim.payee = claim.payee;
													objectClaim.referral = claim.referral;
													objectClaim.facility = claim.facility;
													objectClaim.employmentImpacted = claim.employmentImpacted;
													objectClaim.hospitalization = claim.hospitalization;
													objectClaim.total = claim.total;
													
													newClaim[index] = objectClaim;
													
													/*if (index == countClaim - 1) {
														res.json({
															"err_code": 0,
															"data": newClaim
														});
													}*/
													myEmitter.prependOnceListener("getClaimRelated", function (claim, index, newClaim, countClaim) {
														qString = {};
														qString.claim_id = claim.id;
														seedPhoenixFHIR.path.GET = {
															"ClaimRelated": {
																"location": "%(apikey)s/ClaimRelated",
																"query": qString
															}
														}
														var ApiFHIR = new Apiclient(seedPhoenixFHIR);
														ApiFHIR.get('ClaimRelated', {
															"apikey": apikey
														}, {}, function (error, response, body) {
															claimRelated = JSON.parse(body);
															if (claimRelated.err_code == 0) {
																var objectClaim = {};
																objectClaim.resourceType = claim.resourceType;
																objectClaim.id = claim.id;
																objectClaim.identifier = claim.identifier;
																objectClaim.status = claim.status;
																objectClaim.type = claim.type;
																objectClaim.subtype = claim.subtype;
																objectClaim.uses = claim.uses;
																objectClaim.patient = claim.patient;
																objectClaim.created = claim.created;
																objectClaim.enterer = claim.enterer;
																objectClaim.insurer = claim.insurer;
																objectClaim.provider = claim.provider;
																objectClaim.organization = claim.organization;
																objectClaim.priority = claim.priority;
																objectClaim.fundsReserve = claim.fundsReserve;
																objectClaim.related = claimRelated.data;
																objectClaim.prescription = claim.prescription;
																objectClaim.originalPrescription = claim.originalPrescription;
																objectClaim.payee = claim.payee;
																objectClaim.referral = claim.referral;
																objectClaim.facility = claim.facility;
																objectClaim.employmentImpacted = claim.employmentImpacted;
																objectClaim.hospitalization = claim.hospitalization;
																objectClaim.total = claim.total;
																newClaim[index] = objectClaim;

																myEmitter.prependOnceListener("getClaimCareTeam", function (claim, index, newClaim, countClaim) {
																	qString = {};
																	qString.claim_id = claim.id;
																	seedPhoenixFHIR.path.GET = {
																		"ClaimCareTeam": {
																			"location": "%(apikey)s/ClaimCareTeam",
																			"query": qString
																		}
																	}
																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																	ApiFHIR.get('ClaimCareTeam', {
																		"apikey": apikey
																	}, {}, function (error, response, body) {
																		claimCareTeam = JSON.parse(body);
																		if (claimCareTeam.err_code == 0) {
																			var objectClaim = {};
																			objectClaim.resourceType = claim.resourceType;
																			objectClaim.id = claim.id;
																			objectClaim.identifier = claim.identifier;
																			objectClaim.status = claim.status;
																			objectClaim.type = claim.type;
																			objectClaim.subtype = claim.subtype;
																			objectClaim.uses = claim.uses;
																			objectClaim.patient = claim.patient;
																			objectClaim.created = claim.created;
																			objectClaim.enterer = claim.enterer;
																			objectClaim.insurer = claim.insurer;
																			objectClaim.provider = claim.provider;
																			objectClaim.organization = claim.organization;
																			objectClaim.priority = claim.priority;
																			objectClaim.fundsReserve = claim.fundsReserve;
																			objectClaim.related = claim.related;
																			objectClaim.prescription = claim.prescription;
																			objectClaim.originalPrescription = claim.originalPrescription;
																			objectClaim.payee = claim.payee;
																			objectClaim.referral = claim.referral;
																			objectClaim.facility = claim.facility;
																			objectClaim.careTeam = claimCareTeam.data;
																			objectClaim.employmentImpacted = claim.employmentImpacted;
																			objectClaim.hospitalization = claim.hospitalization;
																			objectClaim.total = claim.total;
																			newClaim[index] = objectClaim;

																			myEmitter.prependOnceListener("getClaimInformation", function (claim, index, newClaim, countClaim) {
																				qString = {};
																				qString.claim_id = claim.id;
																				seedPhoenixFHIR.path.GET = {
																					"ClaimInformation": {
																						"location": "%(apikey)s/ClaimInformation",
																						"query": qString
																					}
																				}
																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																				ApiFHIR.get('ClaimInformation', {
																					"apikey": apikey
																				}, {}, function (error, response, body) {
																					claimInformation = JSON.parse(body);
																					if (claimInformation.err_code == 0) {
																						var objectClaim = {};
																						objectClaim.resourceType = claim.resourceType;
																						objectClaim.id = claim.id;
																						objectClaim.identifier = claim.identifier;
																						objectClaim.status = claim.status;
																						objectClaim.type = claim.type;
																						objectClaim.subtype = claim.subtype;
																						objectClaim.uses = claim.uses;
																						objectClaim.patient = claim.patient;
																						objectClaim.created = claim.created;
																						objectClaim.enterer = claim.enterer;
																						objectClaim.insurer = claim.insurer;
																						objectClaim.provider = claim.provider;
																						objectClaim.organization = claim.organization;
																						objectClaim.priority = claim.priority;
																						objectClaim.fundsReserve = claim.fundsReserve;
																						objectClaim.related = claim.related;
																						objectClaim.prescription = claim.prescription;
																						objectClaim.originalPrescription = claim.originalPrescription;
																						objectClaim.payee = claim.payee;
																						objectClaim.referral = claim.referral;
																						objectClaim.facility = claim.facility;
																						objectClaim.careTeam = claim.careTeam;
																						objectClaim.information = claimInformation.data;
																						objectClaim.employmentImpacted = claim.employmentImpacted;
																						objectClaim.hospitalization = claim.hospitalization;
																						objectClaim.total = claim.total;
																						newClaim[index] = objectClaim;

																						myEmitter.prependOnceListener("getClaimDiagnosis", function (claim, index, newClaim, countClaim) {
																							qString = {};
																							qString.claim_id = claim.id;
																							seedPhoenixFHIR.path.GET = {
																								"ClaimDiagnosis": {
																									"location": "%(apikey)s/ClaimDiagnosis",
																									"query": qString
																								}
																							}
																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																							ApiFHIR.get('ClaimDiagnosis', {
																								"apikey": apikey
																							}, {}, function (error, response, body) {
																								claimDiagnosis = JSON.parse(body);
																								if (claimDiagnosis.err_code == 0) {
																									var objectClaim = {};
																									objectClaim.resourceType = claim.resourceType;
																									objectClaim.id = claim.id;
																									objectClaim.identifier = claim.identifier;
																									objectClaim.status = claim.status;
																									objectClaim.type = claim.type;
																									objectClaim.subtype = claim.subtype;
																									objectClaim.uses = claim.uses;
																									objectClaim.patient = claim.patient;
																									objectClaim.created = claim.created;
																									objectClaim.enterer = claim.enterer;
																									objectClaim.insurer = claim.insurer;
																									objectClaim.provider = claim.provider;
																									objectClaim.organization = claim.organization;
																									objectClaim.priority = claim.priority;
																									objectClaim.fundsReserve = claim.fundsReserve;
																									objectClaim.related = claim.related;
																									objectClaim.prescription = claim.prescription;
																									objectClaim.originalPrescription = claim.originalPrescription;
																									objectClaim.payee = claim.payee;
																									objectClaim.referral = claim.referral;
																									objectClaim.facility = claim.facility;
																									objectClaim.careTeam = claim.careTeam;
																									objectClaim.information = claim.information;
																									objectClaim.diagnosis = claimDiagnosis.data;
																									objectClaim.employmentImpacted = claim.employmentImpacted;
																									objectClaim.hospitalization = claim.hospitalization;
																									objectClaim.total = claim.total;
																									newClaim[index] = objectClaim;

																									myEmitter.prependOnceListener("getClaimProcedure", function (claim, index, newClaim, countClaim) {
																										qString = {};
																										qString.claim_id = claim.id;
																										seedPhoenixFHIR.path.GET = {
																											"ClaimProcedure": {
																												"location": "%(apikey)s/ClaimProcedure",
																												"query": qString
																											}
																										}
																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																										ApiFHIR.get('ClaimProcedure', {
																											"apikey": apikey
																										}, {}, function (error, response, body) {
																											claimProcedure = JSON.parse(body);
																											if (claimProcedure.err_code == 0) {
																												var objectClaim = {};
																												objectClaim.resourceType = claim.resourceType;
																												objectClaim.id = claim.id;
																												objectClaim.identifier = claim.identifier;
																												objectClaim.status = claim.status;
																												objectClaim.type = claim.type;
																												objectClaim.subtype = claim.subtype;
																												objectClaim.uses = claim.uses;
																												objectClaim.patient = claim.patient;
																												objectClaim.created = claim.created;
																												objectClaim.enterer = claim.enterer;
																												objectClaim.insurer = claim.insurer;
																												objectClaim.provider = claim.provider;
																												objectClaim.organization = claim.organization;
																												objectClaim.priority = claim.priority;
																												objectClaim.fundsReserve = claim.fundsReserve;
																												objectClaim.related = claim.related;
																												objectClaim.prescription = claim.prescription;
																												objectClaim.originalPrescription = claim.originalPrescription;
																												objectClaim.payee = claim.payee;
																												objectClaim.referral = claim.referral;
																												objectClaim.facility = claim.facility;
																												objectClaim.careTeam = claim.careTeam;
																												objectClaim.information = claim.information;
																												objectClaim.diagnosis = claim.diagnosis;
																												objectClaim.procedure = claimProcedure.data;
																												objectClaim.employmentImpacted = claim.employmentImpacted;
																												objectClaim.hospitalization = claim.hospitalization;
																												objectClaim.total = claim.total;
																												newClaim[index] = objectClaim;

																												myEmitter.prependOnceListener("getClaimInsurance", function (claim, index, newClaim, countClaim) {
																													qString = {};
																													qString.claim_id = claim.id;
																													seedPhoenixFHIR.path.GET = {
																														"ClaimInsurance": {
																															"location": "%(apikey)s/ClaimInsurance",
																															"query": qString
																														}
																													}
																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																													ApiFHIR.get('ClaimInsurance', {
																														"apikey": apikey
																													}, {}, function (error, response, body) {
																														claimInsurance = JSON.parse(body);
																														if (claimInsurance.err_code == 0) {
																															var objectClaim = {};
																															objectClaim.resourceType = claim.resourceType;
																															objectClaim.id = claim.id;
																															objectClaim.identifier = claim.identifier;
																															objectClaim.status = claim.status;
																															objectClaim.type = claim.type;
																															objectClaim.subtype = claim.subtype;
																															objectClaim.uses = claim.uses;
																															objectClaim.patient = claim.patient;
																															objectClaim.created = claim.created;
																															objectClaim.enterer = claim.enterer;
																															objectClaim.insurer = claim.insurer;
																															objectClaim.provider = claim.provider;
																															objectClaim.organization = claim.organization;
																															objectClaim.priority = claim.priority;
																															objectClaim.fundsReserve = claim.fundsReserve;
																															objectClaim.related = claim.related;
																															objectClaim.prescription = claim.prescription;
																															objectClaim.originalPrescription = claim.originalPrescription;
																															objectClaim.payee = claim.payee;
																															objectClaim.referral = claim.referral;
																															objectClaim.facility = claim.facility;
																															objectClaim.careTeam = claim.careTeam;
																															objectClaim.information = claim.information;
																															objectClaim.diagnosis = claim.diagnosis;
																															objectClaim.procedure = claim.procedure;
																															objectClaim.insurance = claimInsurance.data;
																															objectClaim.employmentImpacted = claim.employmentImpacted;
																															objectClaim.hospitalization = claim.hospitalization;
																															objectClaim.total = claim.total;
																															newClaim[index] = objectClaim;

																															myEmitter.prependOnceListener("getClaimAccident", function (claim, index, newClaim, countClaim) {
																																qString = {};
																																qString.claim_id = claim.id;
																																seedPhoenixFHIR.path.GET = {
																																	"ClaimAccident": {
																																		"location": "%(apikey)s/ClaimAccident",
																																		"query": qString
																																	}
																																}
																																var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																																ApiFHIR.get('ClaimAccident', {
																																	"apikey": apikey
																																}, {}, function (error, response, body) {
																																	claimAccident = JSON.parse(body);
																																	if (claimAccident.err_code == 0) {
																																		var objectClaim = {};
																																		objectClaim.resourceType = claim.resourceType;
																																		objectClaim.id = claim.id;
																																		objectClaim.identifier = claim.identifier;
																																		objectClaim.status = claim.status;
																																		objectClaim.type = claim.type;
																																		objectClaim.subtype = claim.subtype;
																																		objectClaim.uses = claim.uses;
																																		objectClaim.patient = claim.patient;
																																		objectClaim.created = claim.created;
																																		objectClaim.enterer = claim.enterer;
																																		objectClaim.insurer = claim.insurer;
																																		objectClaim.provider = claim.provider;
																																		objectClaim.organization = claim.organization;
																																		objectClaim.priority = claim.priority;
																																		objectClaim.fundsReserve = claim.fundsReserve;
																																		objectClaim.related = claim.related;
																																		objectClaim.prescription = claim.prescription;
																																		objectClaim.originalPrescription = claim.originalPrescription;
																																		objectClaim.payee = claim.payee;
																																		objectClaim.referral = claim.referral;
																																		objectClaim.facility = claim.facility;
																																		objectClaim.careTeam = claim.careTeam;
																																		objectClaim.information = claim.information;
																																		objectClaim.diagnosis = claim.diagnosis;
																																		objectClaim.procedure = claim.procedure;
																																		objectClaim.insurance = claim.insurance;
																																		objectClaim.accident = claimAccident.data;
																																		objectClaim.employmentImpacted = claim.employmentImpacted;
																																		objectClaim.hospitalization = claim.hospitalization;
																																		objectClaim.item = host + ':' + port + '/' + apikey + '/Claim/' +  claim.id + '/ClaimItem';
																																		objectClaim.total = claim.total;
																																		newClaim[index] = objectClaim;

																																		if (index == countClaim - 1) {
																																			res.json({
																																				"err_code": 0,
																																				"data": newClaim
																																			});
																																		}
																																	} else {
																																		res.json(claimAccident);
																																	}
																																})
																															})
																															myEmitter.emit("getClaimAccident", objectClaim, index, newClaim, countClaim);
																														} else {
																															res.json(claimInsurance);
																														}
																													})
																												})
																												myEmitter.emit("getClaimInsurance", objectClaim, index, newClaim, countClaim);
																											} else {
																												res.json(claimProcedure);
																											}
																										})
																									})
																									myEmitter.emit("getClaimProcedure", objectClaim, index, newClaim, countClaim);
																								} else {
																									res.json(claimDiagnosis);
																								}
																							})
																						})
																						myEmitter.emit("getClaimDiagnosis", objectClaim, index, newClaim, countClaim);																						
																					} else {
																						res.json(claimInformation);
																					}
																				})
																			})
																			myEmitter.emit("getClaimInformation", objectClaim, index, newClaim, countClaim);
																		} else {
																			res.json(claimCareTeam);
																		}
																	})
																})
																myEmitter.emit("getClaimCareTeam", objectClaim, index, newClaim, countClaim);
															} else {
																res.json(claimRelated);
															}
														})
													})
													myEmitter.emit("getClaimRelated", objectClaim, index, newClaim, countClaim);
													
												} else {
                          res.json(identifier);
                        }
											})
										})
										myEmitter.emit("getIdentifier", claim.data[i], i, newClaim, claim.data.length);
									}
								} else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Claim is empty."
                  });
                }
							} else {
                res.json(claim);
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
					var claimId = req.params.claim_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "CLAIM_ID|" + claimId, 'CLAIM', function(resClaimID){
								if(resClaimID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.claim_id = claimId;
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
						  			qString.claim_id = claimId;
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
									res.json({"err_code": 501, "err_msg": "Claim Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		claimItem: function getClaimItem(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimId = req.params.claim_id;
			var claimItemId = req.params.item_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "claim_id|" + claimId, 'claim', function(resClaim){
						if(resClaim.err_code > 0){
							if(typeof claimItemId !== 'undefined' && !validator.isEmpty(claimItemId)){
								checkUniqeValue(apikey, "item_id|" + claimItemId, 'claim_item', function(resClaimItemID){
									if(resClaimItemID.err_code > 0){
										//get claimItem
										qString = {};
										qString.claim_id = claimId;
										qString._id = claimItemId;
										seedPhoenixFHIR.path.GET = {
											"ClaimItem" : {
												"location": "%(apikey)s/ClaimItem",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ClaimItem', {"apikey": apikey}, {}, function(error, response, body){
											claimItem = JSON.parse(body);
											if(claimItem.err_code == 0){
												//res.json({"err_code": 0, "data":claimItem.data});	
												if(claimItem.data.length > 0){
													newClaimItem = [];
													for(i=0; i < claimItem.data.length; i++){
														myEmitter.once('getClaimItemEncounter', function(claimItem, index, newClaimItem, countClaimItem){	
															qString = {};
															qString.claim_id = claimItem.id;
															seedPhoenixFHIR.path.GET = {
																"ClaimItemEncounter": {
																	"location": "%(apikey)s/ClaimItemEncounter",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ClaimItemEncounter', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																claimItemEncounter = JSON.parse(body);
																if (claimItemEncounter.err_code == 0) {
																	var objectClaimItem = {};
																	objectClaimItem.id = claimItem.id;
																	objectClaimItem.sequences = claimItem.sequences;
																	objectClaimItem.careTeamLinkId = claimItem.careTeamLinkId;
																	objectClaimItem.diagnosisLinkId = claimItem.diagnosisLinkId;
																	objectClaimItem.procedureLinkId = claimItem.procedureLinkId;
																	objectClaimItem.informationLinkId = claimItem.informationLinkId;
																	objectClaimItem.revenue = claimItem.revenue;
																	objectClaimItem.category = claimItem.category;
																	objectClaimItem.service = claimItem.service;
																	objectClaimItem.modifier = claimItem.modifier;
																	objectClaimItem.programCode = claimItem.programCode;
																	objectClaimItem.serviced = claimItem.serviced;
																	objectClaimItem.location = claimItem.location;
																	objectClaimItem.quantity = claimItem.quantity;
																	objectClaimItem.unitPrice = claimItem.unitPrice;
																	objectClaimItem.factor = claimItem.factor;
																	objectClaimItem.net = claimItem.net;
																	objectClaimItem.bodySite = claimItem.bodySite;
																	objectClaimItem.subSite = claimItem.subSite;
																	objectClaimItem.encounter = claimItemEncounter.data;
																	objectClaimItem.detail	= host + ':' + port + '/' + apikey + '/ClaimItem/' +  claimItem.id + '/ClaimItemDetail';
																	newClaimItem[index] = objectClaimItem;

																	myEmitter.once('getClaimItemUdi', function(claimItem, index, newClaimItem, countClaimItem){	
																		qString = {};
																		qString.claim_item_id = claimItem.id;
																		seedPhoenixFHIR.path.GET = {
																			"ClaimItemUdi": {
																				"location": "%(apikey)s/ClaimItemUdi",
																				"query": qString
																			}
																		}
																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																		ApiFHIR.get('ClaimItemUdi', {
																			"apikey": apikey
																		}, {}, function (error, response, body) {
																			claimItemUdi = JSON.parse(body);
																			if (claimItemUdi.err_code == 0) {
																				var objectClaimItem = {};
																				objectClaimItem.id = claimItem.id;
																				objectClaimItem.sequences = claimItem.sequences;
																				objectClaimItem.careTeamLinkId = claimItem.careTeamLinkId;
																				objectClaimItem.diagnosisLinkId = claimItem.diagnosisLinkId;
																				objectClaimItem.procedureLinkId = claimItem.procedureLinkId;
																				objectClaimItem.informationLinkId = claimItem.informationLinkId;
																				objectClaimItem.revenue = claimItem.revenue;
																				objectClaimItem.category = claimItem.category;
																				objectClaimItem.service = claimItem.service;
																				objectClaimItem.modifier = claimItem.modifier;
																				objectClaimItem.programCode = claimItem.programCode;
																				objectClaimItem.serviced = claimItem.serviced;
																				objectClaimItem.location = claimItem.location;
																				objectClaimItem.quantity = claimItem.quantity;
																				objectClaimItem.unitPrice = claimItem.unitPrice;
																				objectClaimItem.factor = claimItem.factor;
																				objectClaimItem.net = claimItem.net;
																				objectClaimItem.udi = claimItemUdi.data;
																				objectClaimItem.bodySite = claimItem.bodySite;
																				objectClaimItem.subSite = claimItem.subSite;
																				objectClaimItem.encounter = claimItem.encounter;
																				objectClaimItem.detail	= claimItem.detail;
																				newClaimItem[index] = objectClaimItem;

																				if (index == countClaimItem - 1) {
																					res.json({
																						"err_code": 0,
																						"data": newClaimItem
																					});
																				}
																			} else {
																				res.json(claimItemUdi);
																			}
																		})
																	})
																	myEmitter.emit('getClaimItemUdi', objectClaimItem, index, newClaimItem, countClaimItem);																	
																} else {
																	res.json(claimItemEncounter);
																}
															})
														})
														myEmitter.emit('getClaimItemEncounter', claimItem.data[i], i, newClaimItem, claimItem.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Claim Item is empty."});	
												}
											}else{
												res.json(claimItem);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Claim Item Id not found"});		
									}
								})
							}else{
								//get claimItem
								qString = {};
								qString.claim_id = claimId;
								seedPhoenixFHIR.path.GET = {
									"ClaimItem" : {
										"location": "%(apikey)s/ClaimItem",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ClaimItem', {"apikey": apikey}, {}, function(error, response, body){
									claimItem = JSON.parse(body);
									if(claimItem.err_code == 0){
										//res.json({"err_code": 0, "data":claimItem.data});	
										if(claimItem.data.length > 0){
											newClaimItem = [];
											for(i=0; i < claimItem.data.length; i++){
												myEmitter.once('getClaimItemEncounter', function(claimItem, index, newClaimItem, countClaimItem){	
													qString = {};
													qString.claim_id = claimItem.id;
													seedPhoenixFHIR.path.GET = {
														"ClaimItemEncounter": {
															"location": "%(apikey)s/ClaimItemEncounter",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
													ApiFHIR.get('ClaimItemEncounter', {
														"apikey": apikey
													}, {}, function (error, response, body) {
														claimItemEncounter = JSON.parse(body);
														if (claimItemEncounter.err_code == 0) {
															var objectClaimItem = {};
															objectClaimItem.id = claimItem.id;
															objectClaimItem.sequences = claimItem.sequences;
															objectClaimItem.careTeamLinkId = claimItem.careTeamLinkId;
															objectClaimItem.diagnosisLinkId = claimItem.diagnosisLinkId;
															objectClaimItem.procedureLinkId = claimItem.procedureLinkId;
															objectClaimItem.informationLinkId = claimItem.informationLinkId;
															objectClaimItem.revenue = claimItem.revenue;
															objectClaimItem.category = claimItem.category;
															objectClaimItem.service = claimItem.service;
															objectClaimItem.modifier = claimItem.modifier;
															objectClaimItem.programCode = claimItem.programCode;
															objectClaimItem.serviced = claimItem.serviced;
															objectClaimItem.location = claimItem.location;
															objectClaimItem.quantity = claimItem.quantity;
															objectClaimItem.unitPrice = claimItem.unitPrice;
															objectClaimItem.factor = claimItem.factor;
															objectClaimItem.net = claimItem.net;
															objectClaimItem.bodySite = claimItem.bodySite;
															objectClaimItem.subSite = claimItem.subSite;
															objectClaimItem.encounter = claimItemEncounter.data;
															objectClaimItem.detail	= host + ':' + port + '/' + apikey + '/ClaimItem/' +  claimItem.id + '/ClaimItemDetail';
															newClaimItem[index] = objectClaimItem;

															myEmitter.once('getClaimItemUdi', function(claimItem, index, newClaimItem, countClaimItem){	
																qString = {};
																qString.claim_item_id = claimItem.id;
																seedPhoenixFHIR.path.GET = {
																	"ClaimItemUdi": {
																		"location": "%(apikey)s/ClaimItemUdi",
																		"query": qString
																	}
																}
																var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																ApiFHIR.get('ClaimItemUdi', {
																	"apikey": apikey
																}, {}, function (error, response, body) {
																	claimItemUdi = JSON.parse(body);
																	if (claimItemUdi.err_code == 0) {
																		var objectClaimItem = {};
																		objectClaimItem.id = claimItem.id;
																		objectClaimItem.sequences = claimItem.sequences;
																		objectClaimItem.careTeamLinkId = claimItem.careTeamLinkId;
																		objectClaimItem.diagnosisLinkId = claimItem.diagnosisLinkId;
																		objectClaimItem.procedureLinkId = claimItem.procedureLinkId;
																		objectClaimItem.informationLinkId = claimItem.informationLinkId;
																		objectClaimItem.revenue = claimItem.revenue;
																		objectClaimItem.category = claimItem.category;
																		objectClaimItem.service = claimItem.service;
																		objectClaimItem.modifier = claimItem.modifier;
																		objectClaimItem.programCode = claimItem.programCode;
																		objectClaimItem.serviced = claimItem.serviced;
																		objectClaimItem.location = claimItem.location;
																		objectClaimItem.quantity = claimItem.quantity;
																		objectClaimItem.unitPrice = claimItem.unitPrice;
																		objectClaimItem.factor = claimItem.factor;
																		objectClaimItem.net = claimItem.net;
																		objectClaimItem.udi = claimItemUdi.data;
																		objectClaimItem.bodySite = claimItem.bodySite;
																		objectClaimItem.subSite = claimItem.subSite;
																		objectClaimItem.encounter = claimItem.encounter;
																		objectClaimItem.detail	= claimItem.detail;
																		newClaimItem[index] = objectClaimItem;

																		if (index == countClaimItem - 1) {
																			res.json({
																				"err_code": 0,
																				"data": newClaimItem
																			});
																		}
																	} else {
																		res.json(claimItemUdi);
																	}
																})
															})
															myEmitter.emit('getClaimItemUdi', objectClaimItem, index, newClaimItem, countClaimItem);																	
														} else {
															res.json(claimItemEncounter);
														}
													})
												})
												myEmitter.emit('getClaimItemEncounter', claimItem.data[i], i, newClaimItem, claimItem.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Claim Item is empty."});	
										}
									}else{
										res.json(claimItem);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Claim Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		claimItemDetail: function getClaimItemDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimItemId = req.params.item_id;
			var claimItemDetailId = req.params.detail_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "item_id|" + claimItemId, 'claim_item', function(resClaim){
						if(resClaim.err_code > 0){
							if(typeof claimItemDetailId !== 'undefined' && !validator.isEmpty(claimItemDetailId)){
								checkUniqeValue(apikey, "detail_id|" + claimItemDetailId, 'claim_detail', function(resClaimItemDetailID){
									if(resClaimItemDetailID.err_code > 0){
										//get claimItemDetail
										qString = {};
										qString.item_id = claimItemId;
										qString._id = claimItemDetailId;
										seedPhoenixFHIR.path.GET = {
											"ClaimItemDetail" : {
												"location": "%(apikey)s/ClaimItemDetail",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ClaimItemDetail', {"apikey": apikey}, {}, function(error, response, body){
											claimItemDetail = JSON.parse(body);
											if(claimItemDetail.err_code == 0){
												//res.json({"err_code": 0, "data":claimItemDetail.data});	
												if(claimItemDetail.data.length > 0){
													newClaimItemDetail = [];
													for(i=0; i < claimItemDetail.data.length; i++){
														myEmitter.once('getClaimItemDetailUdi', function(claimItemDetail, index, newClaimItemDetail, countClaimItemDetail){	
															qString = {};
															qString.claim_detail_id = claimItemDetail.id;
															seedPhoenixFHIR.path.GET = {
																"ClaimItemDetailUdi": {
																	"location": "%(apikey)s/ClaimItemDetailUdi",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ClaimItemDetailUdi', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																claimItemDetailUdi = JSON.parse(body);
																if (claimItemDetailUdi.err_code == 0) {
																	var objectClaimItemDetail = {};
																	objectClaimItemDetail.id = claimItemDetail.id;
																	objectClaimItemDetail.sequences = claimItemDetail.sequences;
																	objectClaimItemDetail.revenue = claimItemDetail.revenue;
																	objectClaimItemDetail.category = claimItemDetail.category;
																	objectClaimItemDetail.service = claimItemDetail.service;
																	objectClaimItemDetail.modifier = claimItemDetail.modifier;
																	objectClaimItemDetail.programCode = claimItemDetail.programCode;
																	objectClaimItemDetail.quantity = claimItemDetail.quantity;
																	objectClaimItemDetail.unitPrice = claimItemDetail.unitPrice;
																	objectClaimItemDetail.factor = claimItemDetail.factor;
																	objectClaimItemDetail.net = claimItemDetail.net;
																	objectClaimItemDetail.udi = claimItemDetailUdi.data;
																	objectClaimItemDetail.subDetail	= host + ':' + port + '/' + apikey + '/ClaimItemDetail/' +  claimItemDetail.id + '/ClaimItemSubDetail';
																	newClaimItemDetail[index] = objectClaimItemDetail;

																	if (index == countClaimItemDetail - 1) {
																		res.json({
																			"err_code": 0,
																			"data": newClaimItemDetail
																		});
																	}			
																} else {
																	res.json(claimItemDetailUdi);
																}
															})
														})
														myEmitter.emit('getClaimItemDetailUdi', claimItemDetail.data[i], i, newClaimItemDetail, claimItemDetail.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Claim Item Detail is empty."});	
												}
											}else{
												res.json(claimItemDetail);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Claim Item Detail Id not found"});		
									}
								})
							}else{
								//get claimItemDetail
								qString = {};
								qString.item_id = claimItemId;
								seedPhoenixFHIR.path.GET = {
									"ClaimItemDetail" : {
										"location": "%(apikey)s/ClaimItemDetail",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ClaimItemDetail', {"apikey": apikey}, {}, function(error, response, body){
									claimItemDetail = JSON.parse(body);
									if(claimItemDetail.err_code == 0){
										//res.json({"err_code": 0, "data":claimItemDetail.data});	
										if(claimItemDetail.data.length > 0){
											newClaimItemDetail = [];
											for(i=0; i < claimItemDetail.data.length; i++){
												myEmitter.once('getClaimItemDetailUdi', function(claimItemDetail, index, newClaimItemDetail, countClaimItemDetail){	
													qString = {};
													qString.claim_detail_id = claimItemDetail.id;
													seedPhoenixFHIR.path.GET = {
														"ClaimItemDetailUdi": {
															"location": "%(apikey)s/ClaimItemDetailUdi",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
													ApiFHIR.get('ClaimItemDetailUdi', {
														"apikey": apikey
													}, {}, function (error, response, body) {
														claimItemDetailUdi = JSON.parse(body);
														if (claimItemDetailUdi.err_code == 0) {
															var objectClaimItemDetail = {};
															objectClaimItemDetail.id = claimItemDetail.id;
															objectClaimItemDetail.sequences = claimItemDetail.sequences;
															objectClaimItemDetail.revenue = claimItemDetail.revenue;
															objectClaimItemDetail.category = claimItemDetail.category;
															objectClaimItemDetail.service = claimItemDetail.service;
															objectClaimItemDetail.modifier = claimItemDetail.modifier;
															objectClaimItemDetail.programCode = claimItemDetail.programCode;
															objectClaimItemDetail.quantity = claimItemDetail.quantity;
															objectClaimItemDetail.unitPrice = claimItemDetail.unitPrice;
															objectClaimItemDetail.factor = claimItemDetail.factor;
															objectClaimItemDetail.net = claimItemDetail.net;
															objectClaimItemDetail.udi = claimItemDetailUdi.data;
															objectClaimItemDetail.subDetail	= host + ':' + port + '/' + apikey + '/ClaimItemDetail/' +  claimItemDetail.id + '/ClaimItemSubDetail';
															newClaimItemDetail[index] = objectClaimItemDetail;

															if (index == countClaimItemDetail - 1) {
																res.json({
																	"err_code": 0,
																	"data": newClaimItemDetail
																});
															}			
														} else {
															res.json(claimItemDetailUdi);
														}
													})
												})
												myEmitter.emit('getClaimItemDetailUdi', claimItemDetail.data[i], i, newClaimItemDetail, claimItemDetail.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Claim Item Detail is empty."});	
										}
									}else{
										res.json(claimItemDetail);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Claim Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		claimItemSubDetail: function getClaimItemSubDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimDetailId = req.params.detail_id;
			var claimItemSubDetailId = req.params.sub_detail_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "detail_id|" + claimDetailId, 'claim_detail', function(resClaim){
						if(resClaim.err_code > 0){
							if(typeof claimItemSubDetailId !== 'undefined' && !validator.isEmpty(claimItemSubDetailId)){
								checkUniqeValue(apikey, "sub_detail_id|" + claimItemSubDetailId, 'claim_sub_detail', function(resClaimItemSubDetailID){
									if(resClaimItemSubDetailID.err_code > 0){
										//get claimItemSubDetail
										qString = {};
										qString.detail_id = claimDetailId;
										qString._id = claimItemSubDetailId;
										seedPhoenixFHIR.path.GET = {
											"ClaimItemSubDetail" : {
												"location": "%(apikey)s/ClaimItemSubDetail",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ClaimItemSubDetail', {"apikey": apikey}, {}, function(error, response, body){
											claimItemSubDetail = JSON.parse(body);
											if(claimItemSubDetail.err_code == 0){
												//res.json({"err_code": 0, "data":claimItemSubDetail.data});	
												if(claimItemSubDetail.data.length > 0){
													newClaimItemSubDetail = [];
													for(i=0; i < claimItemSubDetail.data.length; i++){
														myEmitter.once('getClaimItemSubDetailUdi', function(claimItemSubDetail, index, newClaimItemSubDetail, countClaimItemSubDetail){	
															qString = {};
															qString.claim_sub_detail_id = claimItemSubDetail.id;
															seedPhoenixFHIR.path.GET = {
																"ClaimItemSubDetailUdi": {
																	"location": "%(apikey)s/ClaimItemSubDetailUdi",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ClaimItemSubDetailUdi', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																claimItemSubDetailUdi = JSON.parse(body);
																if (claimItemSubDetailUdi.err_code == 0) {
																	var objectClaimItemSubDetail = {};
																	objectClaimItemSubDetail.id = claimItemSubDetail.id;
																	objectClaimItemSubDetail.sequences = claimItemSubDetail.sequences;
																	objectClaimItemSubDetail.revenue = claimItemSubDetail.revenue;
																	objectClaimItemSubDetail.category = claimItemSubDetail.category;
																	objectClaimItemSubDetail.service = claimItemSubDetail.service;
																	objectClaimItemSubDetail.modifier = claimItemSubDetail.modifier;
																	objectClaimItemSubDetail.programCode = claimItemSubDetail.programCode;
																	objectClaimItemSubDetail.quantity = claimItemSubDetail.quantity;
																	objectClaimItemSubDetail.unitPrice = claimItemSubDetail.unitPrice;
																	objectClaimItemSubDetail.factor = claimItemSubDetail.factor;
																	objectClaimItemSubDetail.net = claimItemSubDetail.net;
																	objectClaimItemSubDetail.udi = claimItemSubDetailUdi.data;
																	newClaimItemSubDetail[index] = objectClaimItemSubDetail;

																	if (index == countClaimItemSubDetail - 1) {
																		res.json({
																			"err_code": 0,
																			"data": newClaimItemSubDetail
																		});
																	}			
																} else {
																	res.json(claimItemSubDetailUdi);
																}
															})
														})
														myEmitter.emit('getClaimItemSubDetailUdi', claimItemSubDetail.data[i], i, newClaimItemSubDetail, claimItemSubDetail.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Claim Item Sub Detail is empty."});	
												}
											}else{
												res.json(claimItemSubDetail);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Claim Item Sub Detail Id not found"});		
									}
								})
							}else{
								//get claimItemSubDetail
								qString = {};
								qString.detail_id = claimDetailId;
								seedPhoenixFHIR.path.GET = {
									"ClaimItemSubDetail" : {
										"location": "%(apikey)s/ClaimItemSubDetail",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ClaimItemSubDetail', {"apikey": apikey}, {}, function(error, response, body){
									claimItemSubDetail = JSON.parse(body);
									if(claimItemSubDetail.err_code == 0){
										//res.json({"err_code": 0, "data":claimItemSubDetail.data});	
										if(claimItemSubDetail.data.length > 0){
											newClaimItemSubDetail = [];
											for(i=0; i < claimItemSubDetail.data.length; i++){
												myEmitter.once('getClaimItemSubDetailUdi', function(claimItemSubDetail, index, newClaimItemSubDetail, countClaimItemSubDetail){	
													qString = {};
													qString.claim_sub_detail_id = claimItemSubDetail.id;
													seedPhoenixFHIR.path.GET = {
														"ClaimItemSubDetailUdi": {
															"location": "%(apikey)s/ClaimItemSubDetailUdi",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
													ApiFHIR.get('ClaimItemSubDetailUdi', {
														"apikey": apikey
													}, {}, function (error, response, body) {
														claimItemSubDetailUdi = JSON.parse(body);
														if (claimItemSubDetailUdi.err_code == 0) {
															var objectClaimItemSubDetail = {};
															objectClaimItemSubDetail.id = claimItemSubDetail.id;
															objectClaimItemSubDetail.sequences = claimItemSubDetail.sequences;
															objectClaimItemSubDetail.revenue = claimItemSubDetail.revenue;
															objectClaimItemSubDetail.category = claimItemSubDetail.category;
															objectClaimItemSubDetail.service = claimItemSubDetail.service;
															objectClaimItemSubDetail.modifier = claimItemSubDetail.modifier;
															objectClaimItemSubDetail.programCode = claimItemSubDetail.programCode;
															objectClaimItemSubDetail.quantity = claimItemSubDetail.quantity;
															objectClaimItemSubDetail.unitPrice = claimItemSubDetail.unitPrice;
															objectClaimItemSubDetail.factor = claimItemSubDetail.factor;
															objectClaimItemSubDetail.net = claimItemSubDetail.net;
															objectClaimItemSubDetail.udi = claimItemSubDetailUdi.data;
															newClaimItemSubDetail[index] = objectClaimItemSubDetail;

															if (index == countClaimItemSubDetail - 1) {
																res.json({
																	"err_code": 0,
																	"data": newClaimItemSubDetail
																});
															}			
														} else {
															res.json(claimItemSubDetailUdi);
														}
													})
												})
												myEmitter.emit('getClaimItemSubDetailUdi', claimItemSubDetail.data[i], i, newClaimItemSubDetail, claimItemSubDetail.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Claim Item Sub Detail is empty."});	
										}
									}else{
										res.json(claimItemSubDetail);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Claim Id not found"});		
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
		claim: function addClaim(req, res) {
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
type|type|||
subType|subType|||
use|use|||
patient|patient|||
billablePeriod|billablePeriod|period||
created|created|date||
enterer|enterer|||
insurer|insurer|||
provider|provider|||
organization|organization|||
priority|priority|||
fundsReserve|fundsReserve|||
related.claim|relatedClaim|||
related.relationship|relatedRelationship|||
related.reference|relatedReference|||
prescription.medicationRequest|prescriptionMedicationRequest|||
prescription.visionPrescription|prescriptionVisionPrescription|||
originalPrescription|originalPrescription|||
payee.type|payeeType||n|
payee.resourceType|payeeResourceType|||
payee.party.practitioner|payeePartyPractitioner|||
payee.party.organization|payeePartyOrganization|||
payee.party.patient|payeePartyPatient|||
payee.party.relatedPerson|payeePartyRelatedPerson|||
referral|referral|||
facility|facility|||
careTeam.sequence|careTeamSequence|integer|n|
careTeam.provider.practitioner|careTeamProviderPractitioner|
careTeam.provider.organization|careTeamProviderOrganization|||
careTeam.responsible|careTeamResponsible|boolean||
careTeam.role|careTeamRole|||
careTeam.qualification|careTeamQualification|||
information.sequence|informationSequence|integer|n|
information.category|informationCategory||n|
information.code|informationCode|||
information.timing.timingDate|informationTimingDate|date||
information.timing.timingPeriod|informationTimingPeriod|period||
information.value.valueString|informationValueString|||
information.value.valueQuantity|informationValueQuantity||
information.value.valueAttachment.contentType|informationValueAttachmentContentType|||
information.value.valueAttachment.language|informationValueAttachmentLanguage|||
information.value.valueAttachment.data|informationValueAttachmentData|||
information.value.valueAttachment.size|informationValueAttachmentSize|||
information.value.valueAttachment.title|informationValueAttachmentTitle|||
information.value.valueReference|informationValueReference|||
information.reason|informationReason|||
diagnosis.sequence|diagnosisSequence|integer|n|
diagnosis.diagnosis.diagnosisCodeableConcept|diagnosisDiagnosisCodeableConcept||n|
diagnosis.diagnosis.diagnosisReference|diagnosisDiagnosisReference|||
diagnosis.type|diagnosisType|||
diagnosis.packageCode|diagnosisPackageCode|||
procedure.sequence|procedureSequence|integer|n|
procedure.date|procedureDate|date||
procedure.procedure.procedureCodeableConcept|procedureProcedureCodeableConcept||n|
procedure.procedure.procedureReference|procedureProcedureReference|||
insurance.sequence|insuranceSequence|ineteger|n|
insurance.focal|insuranceFocal|boolean|n|
insurance.coverage|insuranceCoverage|||
insurance.businessArrangement|insuranceBusinessArrangement|||
insurance.preAuthRef|insurancePreAuthRef|||
insurance.claimResponse|insuranceClaimResponse|||
accident.date|accidentDate|date|n|
accident.type|accidentType|||u
accident.location.locationAddress.use|accidentLocationAddressUse|||
accident.location.locationAddress.type|accidentLocationAddressType|||
accident.location.locationAddress.text|accidentLocationAddressText|||
accident.location.locationAddress.line|accidentLocationAddressLine|||
accident.location.locationAddress.city|accidentLocationAddressCity|||
accident.location.locationAddress.district|accidentLocationAddressDistrict|||
accident.location.locationAddress.state|accidentLocationAddressState|||
accident.location.locationAddress.postalCode|accidentLocationAddressPostalCode|||
accident.location.locationAddress.country|accidentLocationAddressCountry|||
accident.location.locationAddress.period|accidentLocationAddressPeriod|period||
accident.location.locationReference|accidentLocationReference|||
employmentImpacted|employmentImpacted|period||
hospitalization|hospitalization|period||
item.sequence|itemSequence|integer|n|
item.careTeamLinkId|itemCareTeamLinkId|integer||
item.diagnosisLinkId|itemDiagnosisLinkId|integer||
item.procedureLinkId|itemProcedureLinkId|integer||
item.informationLinkId|itemInformationLinkId|integer||
item.revenue|itemRevenue|||
item.category|itemCategory|||u
item.service|itemService|||
item.modifier|itemModifier|||
item.programCode|itemProgramCode|||
item.serviced.servicedDate|itemServicedDate|date||
item.serviced.servicedPeriod|itemServicedPeriod|period||
item.location.locationCodeableConcept|itemLocationCodeableConcept|||
item.location.locationAddress.use|itemLocationAddressUse|||
item.location.locationAddress.type|itemLocationAddressType|||
item.location.locationAddress.text|itemLocationAddressText|||
item.location.locationAddress.line|itemLocationAddressLine|||
item.location.locationAddress.city|itemLocationAddressCity|||
item.location.locationAddress.district|itemLocationAddressDistrict|||
item.location.locationAddress.state|itemLocationAddressState|||
item.location.locationAddress.postalCode|itemLocationAddressPostalCode|||
item.location.locationAddress.country|itemLocationAddressCountry|||
item.location.locationAddress.period|itemLocationAddressPeriod|period||
item.location.locationReference|itemLocationReference|||
item.quantity|itemQuantity|integer||
item.unitPrice|itemUnitPrice|||
item.factor|itemFactor|integer||
item.net|itemNet|integer||
item.udi|itemUdi|||
item.bodySite|itemBodySite|||
item.subSite|itemSubSite|||u
item.encounter|itemEncounter|||
item.detail.sequence|itemDetailSequence|integer|n|
item.detail.revenue|itemDetailRevenue|||
item.detail.category|itemDetailCategory|||u
item.detail.service|itemDetailService|||
item.detail.modifier|itemDetailModifier|||
item.detail.programCode|itemDetailProgramCode|||
item.detail.quantity|itemDetailQuantity|integer||
item.detail.unitPrice|itemDetailUnitPrice|||
item.detail.factor|itemDetailFactor|integer||
item.detail.net|itemDetailNet|||
item.detail.udi|itemDetailUdi|||
item.detail.subDetail.sequence|itemSubDetailSequence|integer|n|
item.detail.subDetail.revenue|itemSubDetailRevenue|||
item.detail.subDetail.category|itemSubDetailCategory|||u
item.detail.subDetail.service|itemSubDetailService|||
item.detail.subDetail.modifier|itemSubDetailModifier|||
item.detail.subDetail.programCode|itemSubDetailProgramCode|||
item.detail.subDetail.quantity|itemSubDetailQuantity|integer||
item.detail.subDetail.unitPrice|itemSubDetailUnitPrice|||
item.detail.subDetail.factor|itemSubDetailFactor|integer||
item.detail.subDetail.net|itemSubDetailNet|||
item.detail.subDetail.udi|itemSubDetailUdi|||
total|total|||
*/			
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Claim request.";
			}

			if(typeof req.body.type !== 'undefined'){
				var type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					type = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json Claim request.";
			}

			if(typeof req.body.subType !== 'undefined'){
				var subType =  req.body.subType.trim().toLowerCase();
				if(validator.isEmpty(subType)){
					subType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'sub type' in json Claim request.";
			}

			if(typeof req.body.use !== 'undefined'){
				var use =  req.body.use.trim().toLowerCase();
				if(validator.isEmpty(use)){
					use = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'use' in json Claim request.";
			}

			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					patient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Claim request.";
			}

			if (typeof req.body.billablePeriod !== 'undefined') {
			  var billablePeriod = req.body.billablePeriod;
 				if(validator.isEmpty(billablePeriod)) {
				  var billablePeriodStart = "";
				  var billablePeriodEnd = "";
				} else {
				  if (billablePeriod.indexOf("to") > 0) {
				    arrBillablePeriod = billablePeriod.split("to");
				    var billablePeriodStart = arrBillablePeriod[0];
				    var billablePeriodEnd = arrBillablePeriod[1];
				    if (!regex.test(billablePeriodStart) && !regex.test(billablePeriodEnd)) {
				      err_code = 2;
				      err_msg = "Claim billable period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Claim billable period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'billable period' in json Claim request.";
			}

			if(typeof req.body.created !== 'undefined'){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					created = "";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "Claim created invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'created' in json Claim request.";
			}

			if(typeof req.body.enterer !== 'undefined'){
				var enterer =  req.body.enterer.trim().toLowerCase();
				if(validator.isEmpty(enterer)){
					enterer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'enterer' in json Claim request.";
			}

			if(typeof req.body.insurer !== 'undefined'){
				var insurer =  req.body.insurer.trim().toLowerCase();
				if(validator.isEmpty(insurer)){
					insurer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurer' in json Claim request.";
			}

			if(typeof req.body.provider !== 'undefined'){
				var provider =  req.body.provider.trim().toLowerCase();
				if(validator.isEmpty(provider)){
					provider = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'provider' in json Claim request.";
			}

			if(typeof req.body.organization !== 'undefined'){
				var organization =  req.body.organization.trim().toLowerCase();
				if(validator.isEmpty(organization)){
					organization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'organization' in json Claim request.";
			}

			if(typeof req.body.priority !== 'undefined'){
				var priority =  req.body.priority.trim().toLowerCase();
				if(validator.isEmpty(priority)){
					priority = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'priority' in json Claim request.";
			}

			if(typeof req.body.fundsReserve !== 'undefined'){
				var fundsReserve =  req.body.fundsReserve.trim().toLowerCase();
				if(validator.isEmpty(fundsReserve)){
					fundsReserve = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'funds reserve' in json Claim request.";
			}

			if(typeof req.body.related.claim !== 'undefined'){
				var relatedClaim =  req.body.related.claim.trim().toLowerCase();
				if(validator.isEmpty(relatedClaim)){
					relatedClaim = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'related claim' in json Claim request.";
			}

			if(typeof req.body.related.relationship !== 'undefined'){
				var relatedRelationship =  req.body.related.relationship.trim().toLowerCase();
				if(validator.isEmpty(relatedRelationship)){
					relatedRelationship = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'related relationship' in json Claim request.";
			}

			if(typeof req.body.related.reference !== 'undefined'){
				var relatedReference =  req.body.related.reference.trim().toLowerCase();
				if(validator.isEmpty(relatedReference)){
					relatedReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'related reference' in json Claim request.";
			}

			if(typeof req.body.prescription.medicationRequest !== 'undefined'){
				var prescriptionMedicationRequest =  req.body.prescription.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(prescriptionMedicationRequest)){
					prescriptionMedicationRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prescription medication request' in json Claim request.";
			}

			if(typeof req.body.prescription.visionPrescription !== 'undefined'){
				var prescriptionVisionPrescription =  req.body.prescription.visionPrescription.trim().toLowerCase();
				if(validator.isEmpty(prescriptionVisionPrescription)){
					prescriptionVisionPrescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prescription vision prescription' in json Claim request.";
			}

			if(typeof req.body.originalPrescription !== 'undefined'){
				var originalPrescription =  req.body.originalPrescription.trim().toLowerCase();
				if(validator.isEmpty(originalPrescription)){
					originalPrescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'original prescription' in json Claim request.";
			}

			if(typeof req.body.payee.type !== 'undefined'){
				var payeeType =  req.body.payee.type.trim().toLowerCase();
				if(validator.isEmpty(payeeType)){
					err_code = 2;
					err_msg = "Claim payee type is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payee type' in json Claim request.";
			}

			if(typeof req.body.payee.resourceType !== 'undefined'){
				var payeeResourceType =  req.body.payee.resourceType.trim().toLowerCase();
				if(validator.isEmpty(payeeResourceType)){
					payeeResourceType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payee resource type' in json Claim request.";
			}

			if(typeof req.body.payee.party.practitioner !== 'undefined'){
				var payeePartyPractitioner =  req.body.payee.party.practitioner.trim().toLowerCase();
				if(validator.isEmpty(payeePartyPractitioner)){
					payeePartyPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payee party practitioner' in json Claim request.";
			}

			if(typeof req.body.payee.party.organization !== 'undefined'){
				var payeePartyOrganization =  req.body.payee.party.organization.trim().toLowerCase();
				if(validator.isEmpty(payeePartyOrganization)){
					payeePartyOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payee party organization' in json Claim request.";
			}

			if(typeof req.body.payee.party.patient !== 'undefined'){
				var payeePartyPatient =  req.body.payee.party.patient.trim().toLowerCase();
				if(validator.isEmpty(payeePartyPatient)){
					payeePartyPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payee party patient' in json Claim request.";
			}

			if(typeof req.body.payee.party.relatedPerson !== 'undefined'){
				var payeePartyRelatedPerson =  req.body.payee.party.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(payeePartyRelatedPerson)){
					payeePartyRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payee party related person' in json Claim request.";
			}

			if(typeof req.body.referral !== 'undefined'){
				var referral =  req.body.referral.trim().toLowerCase();
				if(validator.isEmpty(referral)){
					referral = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'referral' in json Claim request.";
			}

			if(typeof req.body.facility !== 'undefined'){
				var facility =  req.body.facility.trim().toLowerCase();
				if(validator.isEmpty(facility)){
					facility = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'facility' in json Claim request.";
			}

			if(typeof req.body.careTeam.sequence !== 'undefined'){
				var careTeamSequence =  req.body.careTeam.sequence.trim();
				if(validator.isEmpty(careTeamSequence)){
					err_code = 2;
					err_msg = "Claim care team sequence is required.";
				}else{
					if(!validator.isInt(careTeamSequence)){
						err_code = 2;
						err_msg = "Claim care team sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'care team sequence' in json Claim request.";
			}

			if(typeof req.body.careTeam.provider.practitioner !== 'undefined'){
				var careTeamProviderPractitioner =  req.body.careTeam.provider.practitioner.trim().toLowerCase();
				if(validator.isEmpty(careTeamProviderPractitioner)){
					careTeamProviderPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'care team provider practitioner' in json Claim request.";
			}

			if(typeof req.body.careTeam.provider.organization !== 'undefined'){
				var careTeamProviderOrganization =  req.body.careTeam.provider.organization.trim().toLowerCase();
				if(validator.isEmpty(careTeamProviderOrganization)){
					careTeamProviderOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'care team provider organization' in json Claim request.";
			}

			if (typeof req.body.careTeam.responsible !== 'undefined') {
				var careTeamResponsible = req.body.careTeam.responsible.trim().toLowerCase();
					if(validator.isEmpty(careTeamResponsible)){
						careTeamResponsible = "false";
					}
				if(careTeamResponsible === "true" || careTeamResponsible === "false"){
					careTeamResponsible = careTeamResponsible;
				} else {
					err_code = 2;
					err_msg = "Claim care team responsible is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'care team responsible' in json Claim request.";
			}

			if(typeof req.body.careTeam.role !== 'undefined'){
				var careTeamRole =  req.body.careTeam.role.trim().toLowerCase();
				if(validator.isEmpty(careTeamRole)){
					careTeamRole = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'care team role' in json Claim request.";
			}

			if(typeof req.body.careTeam.qualification !== 'undefined'){
				var careTeamQualification =  req.body.careTeam.qualification.trim().toLowerCase();
				if(validator.isEmpty(careTeamQualification)){
					careTeamQualification = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'care team qualification' in json Claim request.";
			}

			if(typeof req.body.information.sequence !== 'undefined'){
				var informationSequence =  req.body.information.sequence.trim();
				if(validator.isEmpty(informationSequence)){
					err_code = 2;
					err_msg = "Claim information sequence is required.";
				}else{
					if(!validator.isInt(informationSequence)){
						err_code = 2;
						err_msg = "Claim information sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information sequence' in json Claim request.";
			}

			if(typeof req.body.information.category !== 'undefined'){
				var informationCategory =  req.body.information.category.trim().toLowerCase();
				if(validator.isEmpty(informationCategory)){
					err_code = 2;
					err_msg = "Claim information category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information category' in json Claim request.";
			}

			if(typeof req.body.information.code !== 'undefined'){
				var informationCode =  req.body.information.code.trim().toLowerCase();
				if(validator.isEmpty(informationCode)){
					informationCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information code' in json Claim request.";
			}

			if(typeof req.body.information.timing.timingDate !== 'undefined'){
				var informationTimingDate =  req.body.information.timing.timingDate;
				if(validator.isEmpty(informationTimingDate)){
					informationTimingDate = "";
				}else{
					if(!regex.test(informationTimingDate)){
						err_code = 2;
						err_msg = "Claim information timing timing date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information timing timing date' in json Claim request.";
			}

			if (typeof req.body.information.timing.timingPeriod !== 'undefined') {
			  var informationTimingPeriod = req.body.information.timing.timingPeriod;
 				if(validator.isEmpty(informationTimingPeriod)) {
				  var informationTimingPeriodStart = "";
				  var informationTimingPeriodEnd = "";
				} else {
				  if (informationTimingPeriod.indexOf("to") > 0) {
				    arrInformationTimingPeriod = informationTimingPeriod.split("to");
				    var informationTimingPeriodStart = arrInformationTimingPeriod[0];
				    var informationTimingPeriodEnd = arrInformationTimingPeriod[1];
				    if (!regex.test(informationTimingPeriodStart) && !regex.test(informationTimingPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Claim information timing timing period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Claim information timing timing period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'information timing timing period' in json Claim request.";
			}

			if(typeof req.body.information.value.valueString !== 'undefined'){
				var informationValueString =  req.body.information.value.valueString.trim().toLowerCase();
				if(validator.isEmpty(informationValueString)){
					informationValueString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value string' in json Claim request.";
			}

			if(typeof req.body.information.value.valueQuantity !== 'undefined'){
				var informationValueQuantity =  req.body.information.value.valueQuantity.trim().toLowerCase();
				if(validator.isEmpty(informationValueQuantity)){
					informationValueQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value quantity' in json Claim request.";
			}

			if(typeof req.body.information.value.valueAttachment.contentType !== 'undefined'){
				var informationValueAttachmentContentType =  req.body.information.value.valueAttachment.contentType.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentContentType)){
					informationValueAttachmentContentType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value attachment content type' in json Claim request.";
			}

			if(typeof req.body.information.value.valueAttachment.language !== 'undefined'){
				var informationValueAttachmentLanguage =  req.body.information.value.valueAttachment.language.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentLanguage)){
					informationValueAttachmentLanguage = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value attachment language' in json Claim request.";
			}

			if(typeof req.body.information.value.valueAttachment.data !== 'undefined'){
				var informationValueAttachmentData =  req.body.information.value.valueAttachment.data.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentData)){
					informationValueAttachmentData = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value attachment data' in json Claim request.";
			}

			if(typeof req.body.information.value.valueAttachment.size !== 'undefined'){
				var informationValueAttachmentSize =  req.body.information.value.valueAttachment.size.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentSize)){
					informationValueAttachmentSize = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value attachment size' in json Claim request.";
			}

			if(typeof req.body.information.value.valueAttachment.title !== 'undefined'){
				var informationValueAttachmentTitle =  req.body.information.value.valueAttachment.title.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentTitle)){
					informationValueAttachmentTitle = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value attachment title' in json Claim request.";
			}

			if(typeof req.body.information.value.valueReference !== 'undefined'){
				var informationValueReference =  req.body.information.value.valueReference.trim().toLowerCase();
				if(validator.isEmpty(informationValueReference)){
					informationValueReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value reference' in json Claim request.";
			}

			if(typeof req.body.information.reason !== 'undefined'){
				var informationReason =  req.body.information.reason.trim().toLowerCase();
				if(validator.isEmpty(informationReason)){
					informationReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information reason' in json Claim request.";
			}

			if(typeof req.body.diagnosis.sequence !== 'undefined'){
				var diagnosisSequence =  req.body.diagnosis.sequence.trim();
				if(validator.isEmpty(diagnosisSequence)){
					err_code = 2;
					err_msg = "Claim diagnosis sequence is required.";
				}else{
					if(!validator.isInt(diagnosisSequence)){
						err_code = 2;
						err_msg = "Claim diagnosis sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'diagnosis sequence' in json Claim request.";
			}

			if(typeof req.body.diagnosis.diagnosis.diagnosisCodeableConcept !== 'undefined'){
				var diagnosisDiagnosisCodeableConcept =  req.body.diagnosis.diagnosis.diagnosisCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(diagnosisDiagnosisCodeableConcept)){
					err_code = 2;
					err_msg = "Claim diagnosis diagnosis diagnosis codeable concept is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'diagnosis diagnosis diagnosis codeable concept' in json Claim request.";
			}

			if(typeof req.body.diagnosis.diagnosis.diagnosisReference !== 'undefined'){
				var diagnosisDiagnosisReference =  req.body.diagnosis.diagnosis.diagnosisReference.trim().toLowerCase();
				if(validator.isEmpty(diagnosisDiagnosisReference)){
					diagnosisDiagnosisReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'diagnosis diagnosis diagnosis reference' in json Claim request.";
			}

			if(typeof req.body.diagnosis.type !== 'undefined'){
				var diagnosisType =  req.body.diagnosis.type.trim().toLowerCase();
				if(validator.isEmpty(diagnosisType)){
					diagnosisType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'diagnosis type' in json Claim request.";
			}

			if(typeof req.body.diagnosis.packageCode !== 'undefined'){
				var diagnosisPackageCode =  req.body.diagnosis.packageCode.trim().toLowerCase();
				if(validator.isEmpty(diagnosisPackageCode)){
					diagnosisPackageCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'diagnosis package code' in json Claim request.";
			}

			if(typeof req.body.procedure.sequence !== 'undefined'){
				var procedureSequence =  req.body.procedure.sequence.trim();
				if(validator.isEmpty(procedureSequence)){
					err_code = 2;
					err_msg = "Claim procedure sequence is required.";
				}else{
					if(!validator.isInt(procedureSequence)){
						err_code = 2;
						err_msg = "Claim procedure sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'procedure sequence' in json Claim request.";
			}

			if(typeof req.body.procedure.date !== 'undefined'){
				var procedureDate =  req.body.procedure.date;
				if(validator.isEmpty(procedureDate)){
					procedureDate = "";
				}else{
					if(!regex.test(procedureDate)){
						err_code = 2;
						err_msg = "Claim procedure date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'procedure date' in json Claim request.";
			}

			if(typeof req.body.procedure.procedure.procedureCodeableConcept !== 'undefined'){
				var procedureProcedureCodeableConcept =  req.body.procedure.procedure.procedureCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(procedureProcedureCodeableConcept)){
					err_code = 2;
					err_msg = "Claim procedure procedure procedure codeable concept is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'procedure procedure procedure codeable concept' in json Claim request.";
			}

			if(typeof req.body.procedure.procedure.procedureReference !== 'undefined'){
				var procedureProcedureReference =  req.body.procedure.procedure.procedureReference.trim().toLowerCase();
				if(validator.isEmpty(procedureProcedureReference)){
					procedureProcedureReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'procedure procedure procedure reference' in json Claim request.";
			}

			if(typeof req.body.insurance.sequence !== 'undefined'){
				var insuranceSequence =  req.body.insurance.sequence.trim().toLowerCase();
				if(validator.isEmpty(insuranceSequence)){
					err_code = 2;
					err_msg = "Claim insurance sequence is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance sequence' in json Claim request.";
			}

			if (typeof req.body.insurance.focal !== 'undefined') {
				var insuranceFocal = req.body.insurance.focal.trim().toLowerCase();
				if(insuranceFocal === "true" || insuranceFocal === "false"){
					insuranceFocal = insuranceFocal;
				} else {
					err_code = 2;
					err_msg = "Claim insurance focal is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'insurance focal' in json Claim request.";
			}

			if(typeof req.body.insurance.coverage !== 'undefined'){
				var insuranceCoverage =  req.body.insurance.coverage.trim().toLowerCase();
				if(validator.isEmpty(insuranceCoverage)){
					insuranceCoverage = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance coverage' in json Claim request.";
			}

			if(typeof req.body.insurance.businessArrangement !== 'undefined'){
				var insuranceBusinessArrangement =  req.body.insurance.businessArrangement.trim().toLowerCase();
				if(validator.isEmpty(insuranceBusinessArrangement)){
					insuranceBusinessArrangement = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance business arrangement' in json Claim request.";
			}

			if(typeof req.body.insurance.preAuthRef !== 'undefined'){
				var insurancePreAuthRef =  req.body.insurance.preAuthRef.trim().toLowerCase();
				if(validator.isEmpty(insurancePreAuthRef)){
					insurancePreAuthRef = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance pre auth ref' in json Claim request.";
			}

			if(typeof req.body.insurance.claimResponse !== 'undefined'){
				var insuranceClaimResponse =  req.body.insurance.claimResponse.trim().toLowerCase();
				if(validator.isEmpty(insuranceClaimResponse)){
					insuranceClaimResponse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance claim response' in json Claim request.";
			}

			if(typeof req.body.accident.date !== 'undefined'){
				var accidentDate =  req.body.accident.date;
				if(validator.isEmpty(accidentDate)){
					err_code = 2;
					err_msg = "Claim accident date is required.";
				}else{
					if(!regex.test(accidentDate)){
						err_code = 2;
						err_msg = "Claim accident date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident date' in json Claim request.";
			}

			if(typeof req.body.accident.type !== 'undefined'){
				var accidentType =  req.body.accident.type.trim().toUpperCase();
				if(validator.isEmpty(accidentType)){
					accidentType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident type' in json Claim request.";
			}

			if(typeof req.body.accident.location.locationAddress.use !== 'undefined'){
				var accidentLocationAddressUse =  req.body.accident.location.locationAddress.use.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressUse)){
					accidentLocationAddressUse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address use' in json Claim request.";
			}

			if(typeof req.body.accident.location.locationAddress.type !== 'undefined'){
				var accidentLocationAddressType =  req.body.accident.location.locationAddress.type.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressType)){
					accidentLocationAddressType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address type' in json Claim request.";
			}

			if(typeof req.body.accident.location.locationAddress.text !== 'undefined'){
				var accidentLocationAddressText =  req.body.accident.location.locationAddress.text.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressText)){
					accidentLocationAddressText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address text' in json Claim request.";
			}

			if(typeof req.body.accident.location.locationAddress.line !== 'undefined'){
				var accidentLocationAddressLine =  req.body.accident.location.locationAddress.line.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressLine)){
					accidentLocationAddressLine = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address line' in json Claim request.";
			}

			if(typeof req.body.accident.location.locationAddress.city !== 'undefined'){
				var accidentLocationAddressCity =  req.body.accident.location.locationAddress.city.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressCity)){
					accidentLocationAddressCity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address city' in json Claim request.";
			}

			if(typeof req.body.accident.location.locationAddress.district !== 'undefined'){
				var accidentLocationAddressDistrict =  req.body.accident.location.locationAddress.district.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressDistrict)){
					accidentLocationAddressDistrict = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address district' in json Claim request.";
			}

			if(typeof req.body.accident.location.locationAddress.state !== 'undefined'){
				var accidentLocationAddressState =  req.body.accident.location.locationAddress.state.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressState)){
					accidentLocationAddressState = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address state' in json Claim request.";
			}

			if(typeof req.body.accident.location.locationAddress.postalCode !== 'undefined'){
				var accidentLocationAddressPostalCode =  req.body.accident.location.locationAddress.postalCode.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressPostalCode)){
					accidentLocationAddressPostalCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address postal code' in json Claim request.";
			}

			if(typeof req.body.accident.location.locationAddress.country !== 'undefined'){
				var accidentLocationAddressCountry =  req.body.accident.location.locationAddress.country.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressCountry)){
					accidentLocationAddressCountry = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address country' in json Claim request.";
			}

			if (typeof req.body.accident.location.locationAddress.period !== 'undefined') {
			  var accidentLocationAddressPeriod = req.body.accident.location.locationAddress.period;
 				if(validator.isEmpty(accidentLocationAddressPeriod)) {
				  var accidentLocationAddressPeriodStart = "";
				  var accidentLocationAddressPeriodEnd = "";
				} else {
				  if (accidentLocationAddressPeriod.indexOf("to") > 0) {
				    arrAccidentLocationAddressPeriod = accidentLocationAddressPeriod.split("to");
				    var accidentLocationAddressPeriodStart = arrAccidentLocationAddressPeriod[0];
				    var accidentLocationAddressPeriodEnd = arrAccidentLocationAddressPeriod[1];
				    if (!regex.test(accidentLocationAddressPeriodStart) && !regex.test(accidentLocationAddressPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Claim accident location location address period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Claim accident location location address period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'accident location location address period' in json Claim request.";
			}

			if(typeof req.body.accident.location.locationReference !== 'undefined'){
				var accidentLocationReference =  req.body.accident.location.locationReference.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationReference)){
					accidentLocationReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location reference' in json Claim request.";
			}

			if (typeof req.body.employmentImpacted !== 'undefined') {
			  var employmentImpacted = req.body.employmentImpacted;
 				if(validator.isEmpty(employmentImpacted)) {
				  var employmentImpactedStart = "";
				  var employmentImpactedEnd = "";
				} else {
				  if (employmentImpacted.indexOf("to") > 0) {
				    arrEmploymentImpacted = employmentImpacted.split("to");
				    var employmentImpactedStart = arrEmploymentImpacted[0];
				    var employmentImpactedEnd = arrEmploymentImpacted[1];
				    if (!regex.test(employmentImpactedStart) && !regex.test(employmentImpactedEnd)) {
				      err_code = 2;
				      err_msg = "Claim employment impacted invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Claim employment impacted invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'employment impacted' in json Claim request.";
			}

			if (typeof req.body.hospitalization !== 'undefined') {
			  var hospitalization = req.body.hospitalization;
 				if(validator.isEmpty(hospitalization)) {
				  var hospitalizationStart = "";
				  var hospitalizationEnd = "";
				} else {
				  if (hospitalization.indexOf("to") > 0) {
				    arrHospitalization = hospitalization.split("to");
				    var hospitalizationStart = arrHospitalization[0];
				    var hospitalizationEnd = arrHospitalization[1];
				    if (!regex.test(hospitalizationStart) && !regex.test(hospitalizationEnd)) {
				      err_code = 2;
				      err_msg = "Claim hospitalization invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Claim hospitalization invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'hospitalization' in json Claim request.";
			}

			if(typeof req.body.item.sequence !== 'undefined'){
				var itemSequence =  req.body.item.sequence.trim();
				if(validator.isEmpty(itemSequence)){
					err_code = 2;
					err_msg = "Claim item sequence is required.";
				}else{
					if(!validator.isInt(itemSequence)){
						err_code = 2;
						err_msg = "Claim item sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item sequence' in json Claim request.";
			}

			if(typeof req.body.item.careTeamLinkId !== 'undefined'){
				var itemCareTeamLinkId =  req.body.item.careTeamLinkId.trim();
				if(validator.isEmpty(itemCareTeamLinkId)){
					itemCareTeamLinkId = "";
				}else{
					if(!validator.isInt(itemCareTeamLinkId)){
						err_code = 2;
						err_msg = "Claim item care team link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item care team link id' in json Claim request.";
			}

			if(typeof req.body.item.diagnosisLinkId !== 'undefined'){
				var itemDiagnosisLinkId =  req.body.item.diagnosisLinkId.trim();
				if(validator.isEmpty(itemDiagnosisLinkId)){
					itemDiagnosisLinkId = "";
				}else{
					if(!validator.isInt(itemDiagnosisLinkId)){
						err_code = 2;
						err_msg = "Claim item diagnosis link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item diagnosis link id' in json Claim request.";
			}

			if(typeof req.body.item.procedureLinkId !== 'undefined'){
				var itemProcedureLinkId =  req.body.item.procedureLinkId.trim();
				if(validator.isEmpty(itemProcedureLinkId)){
					itemProcedureLinkId = "";
				}else{
					if(!validator.isInt(itemProcedureLinkId)){
						err_code = 2;
						err_msg = "Claim item procedure link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item procedure link id' in json Claim request.";
			}

			if(typeof req.body.item.informationLinkId !== 'undefined'){
				var itemInformationLinkId =  req.body.item.informationLinkId.trim();
				if(validator.isEmpty(itemInformationLinkId)){
					itemInformationLinkId = "";
				}else{
					if(!validator.isInt(itemInformationLinkId)){
						err_code = 2;
						err_msg = "Claim item information link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item information link id' in json Claim request.";
			}

			if(typeof req.body.item.revenue !== 'undefined'){
				var itemRevenue =  req.body.item.revenue.trim().toLowerCase();
				if(validator.isEmpty(itemRevenue)){
					itemRevenue = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item revenue' in json Claim request.";
			}

			if(typeof req.body.item.category !== 'undefined'){
				var itemCategory =  req.body.item.category.trim().toUpperCase();
				if(validator.isEmpty(itemCategory)){
					itemCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item category' in json Claim request.";
			}

			if(typeof req.body.item.service !== 'undefined'){
				var itemService =  req.body.item.service.trim().toLowerCase();
				if(validator.isEmpty(itemService)){
					itemService = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item service' in json Claim request.";
			}

			if(typeof req.body.item.modifier !== 'undefined'){
				var itemModifier =  req.body.item.modifier.trim().toLowerCase();
				if(validator.isEmpty(itemModifier)){
					itemModifier = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item modifier' in json Claim request.";
			}

			if(typeof req.body.item.programCode !== 'undefined'){
				var itemProgramCode =  req.body.item.programCode.trim().toLowerCase();
				if(validator.isEmpty(itemProgramCode)){
					itemProgramCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item program code' in json Claim request.";
			}

			if(typeof req.body.item.serviced.servicedDate !== 'undefined'){
				var itemServicedDate =  req.body.item.serviced.servicedDate;
				if(validator.isEmpty(itemServicedDate)){
					itemServicedDate = "";
				}else{
					if(!regex.test(itemServicedDate)){
						err_code = 2;
						err_msg = "Claim item serviced serviced date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item serviced serviced date' in json Claim request.";
			}

			if (typeof req.body.item.serviced.servicedPeriod !== 'undefined') {
			  var itemServicedPeriod = req.body.item.serviced.servicedPeriod;
 				if(validator.isEmpty(itemServicedPeriod)) {
				  var itemServicedPeriodStart = "";
				  var itemServicedPeriodEnd = "";
				} else {
				  if (itemServicedPeriod.indexOf("to") > 0) {
				    arrItemServicedPeriod = itemServicedPeriod.split("to");
				    var itemServicedPeriodStart = arrItemServicedPeriod[0];
				    var itemServicedPeriodEnd = arrItemServicedPeriod[1];
				    if (!regex.test(itemServicedPeriodStart) && !regex.test(itemServicedPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Claim item serviced serviced period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Claim item serviced serviced period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'item serviced serviced period' in json Claim request.";
			}

			if(typeof req.body.item.location.locationCodeableConcept !== 'undefined'){
				var itemLocationCodeableConcept =  req.body.item.location.locationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(itemLocationCodeableConcept)){
					itemLocationCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location codeable concept' in json Claim request.";
			}

			if(typeof req.body.item.location.locationAddress.use !== 'undefined'){
				var itemLocationAddressUse =  req.body.item.location.locationAddress.use.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressUse)){
					itemLocationAddressUse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address use' in json Claim request.";
			}

			if(typeof req.body.item.location.locationAddress.type !== 'undefined'){
				var itemLocationAddressType =  req.body.item.location.locationAddress.type.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressType)){
					itemLocationAddressType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address type' in json Claim request.";
			}

			if(typeof req.body.item.location.locationAddress.text !== 'undefined'){
				var itemLocationAddressText =  req.body.item.location.locationAddress.text.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressText)){
					itemLocationAddressText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address text' in json Claim request.";
			}

			if(typeof req.body.item.location.locationAddress.line !== 'undefined'){
				var itemLocationAddressLine =  req.body.item.location.locationAddress.line.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressLine)){
					itemLocationAddressLine = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address line' in json Claim request.";
			}

			if(typeof req.body.item.location.locationAddress.city !== 'undefined'){
				var itemLocationAddressCity =  req.body.item.location.locationAddress.city.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressCity)){
					itemLocationAddressCity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address city' in json Claim request.";
			}

			if(typeof req.body.item.location.locationAddress.district !== 'undefined'){
				var itemLocationAddressDistrict =  req.body.item.location.locationAddress.district.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressDistrict)){
					itemLocationAddressDistrict = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address district' in json Claim request.";
			}

			if(typeof req.body.item.location.locationAddress.state !== 'undefined'){
				var itemLocationAddressState =  req.body.item.location.locationAddress.state.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressState)){
					itemLocationAddressState = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address state' in json Claim request.";
			}

			if(typeof req.body.item.location.locationAddress.postalCode !== 'undefined'){
				var itemLocationAddressPostalCode =  req.body.item.location.locationAddress.postalCode.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressPostalCode)){
					itemLocationAddressPostalCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address postal code' in json Claim request.";
			}

			if(typeof req.body.item.location.locationAddress.country !== 'undefined'){
				var itemLocationAddressCountry =  req.body.item.location.locationAddress.country.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressCountry)){
					itemLocationAddressCountry = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address country' in json Claim request.";
			}

			if (typeof req.body.item.location.locationAddress.period !== 'undefined') {
			  var itemLocationAddressPeriod = req.body.item.location.locationAddress.period;
 				if(validator.isEmpty(itemLocationAddressPeriod)) {
				  var itemLocationAddressPeriodStart = "";
				  var itemLocationAddressPeriodEnd = "";
				} else {
				  if (itemLocationAddressPeriod.indexOf("to") > 0) {
				    arrItemLocationAddressPeriod = itemLocationAddressPeriod.split("to");
				    var itemLocationAddressPeriodStart = arrItemLocationAddressPeriod[0];
				    var itemLocationAddressPeriodEnd = arrItemLocationAddressPeriod[1];
				    if (!regex.test(itemLocationAddressPeriodStart) && !regex.test(itemLocationAddressPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Claim item location location address period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Claim item location location address period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'item location location address period' in json Claim request.";
			}

			if(typeof req.body.item.location.locationReference !== 'undefined'){
				var itemLocationReference =  req.body.item.location.locationReference.trim().toLowerCase();
				if(validator.isEmpty(itemLocationReference)){
					itemLocationReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location reference' in json Claim request.";
			}

			if(typeof req.body.item.quantity !== 'undefined'){
				var itemQuantity =  req.body.item.quantity.trim();
				if(validator.isEmpty(itemQuantity)){
					itemQuantity = "";
				}else{
					if(!validator.isInt(itemQuantity)){
						err_code = 2;
						err_msg = "Claim item quantity is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item quantity' in json Claim request.";
			}

			if(typeof req.body.item.unitPrice !== 'undefined'){
				var itemUnitPrice =  req.body.item.unitPrice.trim().toLowerCase();
				if(validator.isEmpty(itemUnitPrice)){
					itemUnitPrice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item unit price' in json Claim request.";
			}

			if(typeof req.body.item.factor !== 'undefined'){
				var itemFactor =  req.body.item.factor.trim();
				if(validator.isEmpty(itemFactor)){
					itemFactor = "";
				}else{
					if(!validator.isInt(itemFactor)){
						err_code = 2;
						err_msg = "Claim item factor is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item factor' in json Claim request.";
			}

			if(typeof req.body.item.net !== 'undefined'){
				var itemNet =  req.body.item.net.trim();
				if(validator.isEmpty(itemNet)){
					itemNet = "";
				}else{
					if(!validator.isInt(itemNet)){
						err_code = 2;
						err_msg = "Claim item net is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item net' in json Claim request.";
			}

			if(typeof req.body.item.udi !== 'undefined'){
				var itemUdi =  req.body.item.udi.trim().toLowerCase();
				if(validator.isEmpty(itemUdi)){
					itemUdi = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item udi' in json Claim request.";
			}

			if(typeof req.body.item.bodySite !== 'undefined'){
				var itemBodySite =  req.body.item.bodySite.trim().toLowerCase();
				if(validator.isEmpty(itemBodySite)){
					itemBodySite = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item body site' in json Claim request.";
			}

			if(typeof req.body.item.subSite !== 'undefined'){
				var itemSubSite =  req.body.item.subSite.trim().toUpperCase();
				if(validator.isEmpty(itemSubSite)){
					itemSubSite = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item sub site' in json Claim request.";
			}

			if(typeof req.body.item.encounter !== 'undefined'){
				var itemEncounter =  req.body.item.encounter.trim().toLowerCase();
				if(validator.isEmpty(itemEncounter)){
					itemEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item encounter' in json Claim request.";
			}

			if(typeof req.body.item.detail.sequence !== 'undefined'){
				var itemDetailSequence =  req.body.item.detail.sequence.trim();
				if(validator.isEmpty(itemDetailSequence)){
					err_code = 2;
					err_msg = "Claim item detail sequence is required.";
				}else{
					if(!validator.isInt(itemDetailSequence)){
						err_code = 2;
						err_msg = "Claim item detail sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sequence' in json Claim request.";
			}

			if(typeof req.body.item.detail.revenue !== 'undefined'){
				var itemDetailRevenue =  req.body.item.detail.revenue.trim().toLowerCase();
				if(validator.isEmpty(itemDetailRevenue)){
					itemDetailRevenue = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail revenue' in json Claim request.";
			}

			if(typeof req.body.item.detail.category !== 'undefined'){
				var itemDetailCategory =  req.body.item.detail.category.trim().toUpperCase();
				if(validator.isEmpty(itemDetailCategory)){
					itemDetailCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail category' in json Claim request.";
			}

			if(typeof req.body.item.detail.service !== 'undefined'){
				var itemDetailService =  req.body.item.detail.service.trim().toLowerCase();
				if(validator.isEmpty(itemDetailService)){
					itemDetailService = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail service' in json Claim request.";
			}

			if(typeof req.body.item.detail.modifier !== 'undefined'){
				var itemDetailModifier =  req.body.item.detail.modifier.trim().toLowerCase();
				if(validator.isEmpty(itemDetailModifier)){
					itemDetailModifier = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail modifier' in json Claim request.";
			}

			if(typeof req.body.item.detail.programCode !== 'undefined'){
				var itemDetailProgramCode =  req.body.item.detail.programCode.trim().toLowerCase();
				if(validator.isEmpty(itemDetailProgramCode)){
					itemDetailProgramCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail program code' in json Claim request.";
			}

			if(typeof req.body.item.detail.quantity !== 'undefined'){
				var itemDetailQuantity =  req.body.item.detail.quantity.trim();
				if(validator.isEmpty(itemDetailQuantity)){
					itemDetailQuantity = "";
				}else{
					if(!validator.isInt(itemDetailQuantity)){
						err_code = 2;
						err_msg = "Claim item detail quantity is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail quantity' in json Claim request.";
			}

			if(typeof req.body.item.detail.unitPrice !== 'undefined'){
				var itemDetailUnitPrice =  req.body.item.detail.unitPrice.trim().toLowerCase();
				if(validator.isEmpty(itemDetailUnitPrice)){
					itemDetailUnitPrice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail unit price' in json Claim request.";
			}

			if(typeof req.body.item.detail.factor !== 'undefined'){
				var itemDetailFactor =  req.body.item.detail.factor.trim();
				if(validator.isEmpty(itemDetailFactor)){
					itemDetailFactor = "";
				}else{
					if(!validator.isInt(itemDetailFactor)){
						err_code = 2;
						err_msg = "Claim item detail factor is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail factor' in json Claim request.";
			}

			if(typeof req.body.item.detail.net !== 'undefined'){
				var itemDetailNet =  req.body.item.detail.net.trim().toLowerCase();
				if(validator.isEmpty(itemDetailNet)){
					itemDetailNet = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail net' in json Claim request.";
			}

			if(typeof req.body.item.detail.udi !== 'undefined'){
				var itemDetailUdi =  req.body.item.detail.udi.trim().toLowerCase();
				if(validator.isEmpty(itemDetailUdi)){
					itemDetailUdi = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail udi' in json Claim request.";
			}

			if(typeof req.body.item.detail.subDetail.sequence !== 'undefined'){
				var itemSubDetailSequence =  req.body.item.detail.subDetail.sequence.trim();
				if(validator.isEmpty(itemSubDetailSequence)){
					err_code = 2;
					err_msg = "Claim item detail sub detail sequence is required.";
				}else{
					if(!validator.isInt(itemSubDetailSequence)){
						err_code = 2;
						err_msg = "Claim item detail sub detail sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail sequence' in json Claim request.";
			}

			if(typeof req.body.item.detail.subDetail.revenue !== 'undefined'){
				var itemSubDetailRevenue =  req.body.item.detail.subDetail.revenue.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailRevenue)){
					itemSubDetailRevenue = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail revenue' in json Claim request.";
			}

			if(typeof req.body.item.detail.subDetail.category !== 'undefined'){
				var itemSubDetailCategory =  req.body.item.detail.subDetail.category.trim().toUpperCase();
				if(validator.isEmpty(itemSubDetailCategory)){
					itemSubDetailCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail category' in json Claim request.";
			}

			if(typeof req.body.item.detail.subDetail.service !== 'undefined'){
				var itemSubDetailService =  req.body.item.detail.subDetail.service.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailService)){
					itemSubDetailService = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail service' in json Claim request.";
			}

			if(typeof req.body.item.detail.subDetail.modifier !== 'undefined'){
				var itemSubDetailModifier =  req.body.item.detail.subDetail.modifier.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailModifier)){
					itemSubDetailModifier = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail modifier' in json Claim request.";
			}

			if(typeof req.body.item.detail.subDetail.programCode !== 'undefined'){
				var itemSubDetailProgramCode =  req.body.item.detail.subDetail.programCode.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailProgramCode)){
					itemSubDetailProgramCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail program code' in json Claim request.";
			}

			if(typeof req.body.item.detail.subDetail.quantity !== 'undefined'){
				var itemSubDetailQuantity =  req.body.item.detail.subDetail.quantity.trim();
				if(validator.isEmpty(itemSubDetailQuantity)){
					itemSubDetailQuantity = "";
				}else{
					if(!validator.isInt(itemSubDetailQuantity)){
						err_code = 2;
						err_msg = "Claim item detail sub detail quantity is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail quantity' in json Claim request.";
			}

			if(typeof req.body.item.detail.subDetail.unitPrice !== 'undefined'){
				var itemSubDetailUnitPrice =  req.body.item.detail.subDetail.unitPrice.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailUnitPrice)){
					itemSubDetailUnitPrice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail unit price' in json Claim request.";
			}

			if(typeof req.body.item.detail.subDetail.factor !== 'undefined'){
				var itemSubDetailFactor =  req.body.item.detail.subDetail.factor.trim();
				if(validator.isEmpty(itemSubDetailFactor)){
					itemSubDetailFactor = "";
				}else{
					if(!validator.isInt(itemSubDetailFactor)){
						err_code = 2;
						err_msg = "Claim item detail sub detail factor is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail factor' in json Claim request.";
			}

			if(typeof req.body.item.detail.subDetail.net !== 'undefined'){
				var itemSubDetailNet =  req.body.item.detail.subDetail.net.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailNet)){
					itemSubDetailNet = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail net' in json Claim request.";
			}

			if(typeof req.body.item.detail.subDetail.udi !== 'undefined'){
				var itemSubDetailUdi =  req.body.item.detail.subDetail.udi.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailUdi)){
					itemSubDetailUdi = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail udi' in json Claim request.";
			}

			if(typeof req.body.total !== 'undefined'){
				var total =  req.body.total.trim().toLowerCase();
				if(validator.isEmpty(total)){
					total = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'total' in json Claim request.";
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
														var claimId = 'cla' + unicId;
														var claimRelatedId = 'clr' + unicId;
														var claimCareTeamId = 'clc' + unicId;
														var claimInformationId = 'cli' + unicId;
														var claimDiagnosisId = 'cld' + unicId;
														var claimProcedureId = 'clp' + unicId;
														var claimInsuranceId = 'cls' + unicId;
														var claimAccidentId = 'cle' + unicId;
														var claimItemId = 'clm' + unicId;
														var claimDetailId = 'clt' + unicId;
														var claimSubDetailId = 'clb' + unicId;
														var attachmentId = 'atc' + unicId;
													
														dataClaim = {
															"claim_id" : claimId,
															"status" : status,
															"type" : type,
															"subtype" : subType,
															"uses" : uses,
															"patient" : patient,
															"billable_period_start" : billablePeriodStart,
															"billable_period_end" : billablePeriodEnd,
															"created" : created,
															"enterer" : enterer,
															"insurer" : insurer,
															"provider" : provider,
															"organization" : organization,
															"priority" : priority,
															"funds_reserve" : fundsReserve,
															"prescription_medication_request" : prescriptionMedicationRequest,
															"prescription_vision_prescription" : prescriptionVisionPrescription,
															"original_prescription" : originalPrescription,
															"payee_type" : payeeType,
															"payee_resource_type" : payeeResourceType,
															"payee_party_practitioner" : payeePartyPractitioner,
															"payee_party_organization" : payeePartyOrganization,
															"payee_party_patient" : payeePartyPatient,
															"payee_party_related_person" : payeePartyRelatedPerson,
															"referral" : referral,
															"facility" : facility,
															"employment_impacted_start" : employmentImpactedStart,
															"employment_impacted_end" : employmentImpactedEnd,
															"hospitalization_start" : hospitalizationStart,
															"hospitalization_end" : hospitalizationEnd,
															"total" : total
														}
														console.log(dataClaim);
														ApiFHIR.post('claim', {"apikey": apikey}, {body: dataClaim, json: true}, function(error, response, body){
															claim = body;
															if(claim.err_code > 0){
																res.json(claim);	
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
																							"claim_id": claimId
																						}

														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														dataClaimRelated = {
															"related_id" : claimRelatedId,
															"claim" : relatedClaim,
															"relationship" : relatedRelationship,
															"reference" : relatedReference,
															"claim_id" : claimId
														}
														console.log(dataClaimRelated);
														ApiFHIR.post('claimRelated', {"apikey": apikey}, {body: dataClaimRelated, json: true}, function(error, response, body){
															claimRelated = body;
															if(claimRelated.err_code > 0){
																res.json(claimRelated);	
															}
														});
														
														dataClaimCareTeam = {
															"care_team_id" : claimCareTeamId,
															"sequences" : careTeamSequence,
															"provider_practitioner" : careTeamProviderPractitioner,
															"provider_organization" : careTeamProviderOrganization,
															"responsible" : careTeamResponsible,
															"role" : careTeamRole,
															"qualification" : careTeamQualification,
															"claim_id" : claimId
														}
														console.log(dataClaimCareTeam);
														ApiFHIR.post('claimCareTeam', {"apikey": apikey}, {body: dataClaimCareTeam, json: true}, function(error, response, body){
															claimCareTeam = body;
															if(claimCareTeam.err_code > 0){
																res.json(claimCareTeam);
															}
														});
														
														dataClaimInformation = {
															"information_id" : claimInformationId,
															"sequences" : informationSequence,
															"category" : informationCategory,
															"code" : informationCode,
															"timing_date" : informationTimingDate,
															"timing_period_start" : informationTimingPeriodStart,
															"timing_period_end" : informationTimingPeriodEnd,
															"value_string" : informationValueString,
															"value_quantity" : informationValueQuantity,
															"value_attachment" : attachmentId,
															"value_reference" : informationValueReference,
															"reason" : informationReason,
															
															"claim_id" : claimId
														}
														console.log(dataClaimInformation);
														ApiFHIR.post('claimInformation', {"apikey": apikey}, {body: dataClaimInformation, json: true}, function(error, response, body){
															claimInformation = body;
															if(claimInformation.err_code > 0){
																res.json(claimInformation);
															}
														});
														
														var dataAttachment = {
															"id": attachmentId,
															"content_type": informationValueAttachmentContentType,
															"language": informationValueAttachmentLanguage,
															"data": informationValueAttachmentData,
															"size": informationValueAttachmentSize,
															"hash": sha1(informationValueAttachmentData),
															"title": informationValueAttachmentTitle,
															"creation": getFormattedDate(),
															"url": host + ':' + port + '/' + apikey + '/Claim/'+claimId+'/Photo/' + attachmentId,
															"claim_id" : claimInformationId
														}

														//method, endpoint, params, options, callback
														ApiFHIR.post('attachment', {"apikey": apikey}, {body: dataAttachment, json:true}, function(error, response, body){
															//cek apakah ada error atau tidak
															var attachment = body; //object
															//cek apakah ada error atau tidak
															if(attachment.err_code > 0){
																res.json(attachment);
															}
														});		
														
														dataClaimDiagnosis = {
															"diagnosis_id" : claimDiagnosisId,
															"sequences" : diagnosisSequence,
															"diagnosis_codeable_concept" : diagnosisDiagnosisCodeableConcept,
															"diagnosis_reference" : diagnosisDiagnosisReference,
															"type" : diagnosisType,
															"package_code" : diagnosisPackageCode,
															"claim_id" : claimId
														}
														console.log(dataClaimDiagnosis);
														ApiFHIR.post('claimDiagnosis', {"apikey": apikey}, {body: dataClaimDiagnosis, json: true}, function(error, response, body){
															claimDiagnosis = body;
															if(claimDiagnosis.err_code > 0){
																res.json(claimDiagnosis);
															}
														});
														
														dataClaimProcedure = {
															"procedure_id" : claimProcedureId,
															"sequences" : procedureSequence,
															"date" : procedureDate,
															"procedure_codeable_concept" : procedureProcedureCodeableConcept,
															"procedure_reference" : procedureProcedureReference,
															"claim_id" : claimId
														}
														console.log(dataClaimProcedure);
														ApiFHIR.post('claimProcedure', {"apikey": apikey}, {body: dataClaimProcedure, json: true}, function(error, response, body){
															claimProcedure = body;
															if(claimProcedure.err_code > 0){
																res.json(claimProcedure);
															}
														});
														
														dataClaimInsurance = {
															"insurance_id" : claimInsuranceId,
															"sequences" : insuranceSequence,
															"focal" : insuranceFocal,
															"coverage" : insuranceCoverage,
															"business_arrangement" : insuranceBusinessArrangement,
															"pre_auth_ref" : insurancePreAuthRef,
															"claim_response" : insuranceClaimResponse,
															"claim_id" : claimId
														}
														console.log(dataClaimInsurance);
														ApiFHIR.post('claimInsurance', {"apikey": apikey}, {body: dataClaimInsurance, json: true}, function(error, response, body){
															claimInsurance = body;
															if(claimInsurance.err_code > 0){
																res.json(claimInsurance);
															}
														});
														
														dataClaimAccident = {
															"accident_id" : claimAccidentId,
															"date" : accidentDate,
															"type" : accidentType,
															"location_address_use" : accidentLocationAddressUse,
															"location_address_type" : accidentLocationAddressType,
															"location_address_text" : accidentLocationAddressText,
															"location_address_line" : accidentLocationAddressLine,
															"location_address_city" : accidentLocationAddressCity,
															"location_address_district" : accidentLocationAddressDistrict,
															"location_address_state" : accidentLocationAddressState,
															"location_address_postal_code" : accidentLocationAddressPostalCode,
															"location_address_country" : accidentLocationAddressCountry,
															"location_address_period_start" : accidentLocationAddressPeriodStart,
															"location_address_period_end" : accidentLocationAddressPeriodEnd,
															"location_reference" : accidentLocationReference,
															"claim_id" : claimId
														}
														console.log(dataClaimAccident);
														ApiFHIR.post('claimAccident', {"apikey": apikey}, {body: dataClaimAccident, json: true}, function(error, response, body){
															claimAccident = body;
															if(claimAccident.err_code > 0){
																res.json(claimAccident);
															}
														});
														
														dataClaimItem = {
															"item_id" : claimItemId,
															"sequences" : itemSequence,
															"care_team_link_id" : itemCareTeamLinkId,
															"diagnosis_link_id" : itemDiagnosisLinkId,
															"procedure_link_id" : itemProcedureLinkId,
															"information_link_id" : itemInformationLinkId,
															"revenue" : itemRevenue,
															"category" : itemCategory,
															"service" : itemService,
															"modifier" : itemModifier,
															"program_code" : itemProgramCode,
															"serviced_date" : itemServicedDate,
															"serviced_period_start" : itemServicedPeriodStart,
															"serviced_period_end" : itemServicedPeriodEnd,
															"location_codeable_concept" : itemLocationCodeableConcept,
															"location_address_use" : itemLocationAddressUse,
															"location_address_type" : itemLocationAddressType,
															"location_address_text" : itemLocationAddressText,
															"location_address_line" : itemLocationAddressLine,
															"location_address_city" : itemLocationAddressCity,
															"location_address_district" : itemLocationAddressDistrict,
															"location_address_state" : itemLocationAddressState,
															"location_address_postal_code" : itemLocationAddressPostalCode,
															"location_address_country" : itemLocationAddressCountry,
															"location_address_period_start" : itemLocationAddressPeriodStart,
															"location_address_period_end" : itemLocationAddressPeriodEnd,
															"location_reference" : itemLocationReference,
															"quantity" : itemQuantity,
															"unit_price" : itemUnitPrice,
															"factor" : itemFactor,
															"net" : itemNet,
															"body_site" : itemBodySite,
															"sub_site" : itemSubSite,								
															"claim_id" : claimId
														}
														console.log(dataClaimItem);
														ApiFHIR.post('claimItem', {"apikey": apikey}, {body: dataClaimItem, json: true}, function(error, response, body){
															claimItem = body;
															if(claimItem.err_code > 0){
																res.json(claimItem);
															}
														});
														
														dataClaimDetail = {
															"detail_id" : claimDetailId,
															"sequences" : itemDetailSequence,
															"revenue" : itemDetailRevenue,
															"category" : itemDetailCategory,
															"service" : itemDetailService,
															"modifier" : itemDetailModifier,
															"program_code" : itemDetailProgramCode,
															"quantity" : itemDetailQuantity,
															"unit_price" : itemDetailUnitPrice,
															"factor" : itemDetailFactor,
															"net" : itemDetailNet,
															"item_id" : claimItemId,
														}
														console.log(dataClaimDetail);
														ApiFHIR.post('claimDetail', {"apikey": apikey}, {body: dataClaimDetail, json: true}, function(error, response, body){
															claimDetail = body;
															if(claimDetail.err_code > 0){
																res.json(claimDetail);
															}
														});
														
														dataClaimSubDetail = {
															"sub_detail_id" : claimSubDetailId,
															"sequences" : itemSubDetailSequence,
															"revenue" : itemSubDetailRevenue,
															"category" : itemSubDetailCategory,
															"service" : itemSubDetailService,
															"modifier" : itemSubDetailModifier,
															"program_code" : itemSubDetailProgramCode,
															"quantity" : itemSubDetailQuantity,
															"unit_price" : itemSubDetailUnitPrice,
															"factor" : itemSubDetailFactor,
															"net" : itemSubDetailNet,
															"detail_id" : claimDetailId,
														}
														console.log(dataClaimSubDetail);
														ApiFHIR.post('claimSubDetail', {"apikey": apikey}, {body: dataClaimSubDetail, json: true}, function(error, response, body){
															claimSubDetail = body;
															if(claimSubDetail.err_code > 0){
																res.json(claimSubDetail);
															}
														});
														
														
														if(itemUdi !== ""){
															dataItemUdi = {
																"_id" : itemUdi,
																"claim_item_id" : claimItemId
															}
															ApiFHIR.put('device', {"apikey": apikey, "_id": itemUdi}, {body: dataItemUdi, json: true}, function(error, response, body){
																returnItemUdi = body;
																if(returnItemUdi.err_code > 0){
																	res.json(returnItemUdi);	
																	console.log("add reference Item udi : " + itemUdi);
																}
															});
														}
														
														if(itemEncounter !== ""){
															dataItemEncounter = {
																"_id" : itemEncounter,
																"claim_id" : claimId
															}
															ApiFHIR.put('encounter', {"apikey": apikey, "_id": itemEncounter}, {body: dataItemEncounter, json: true}, function(error, response, body){
																returnItemEncounter = body;
																if(returnItemEncounter.err_code > 0){
																	res.json(returnItemEncounter);	
																	console.log("add reference Item encounter : " + itemEncounter);
																}
															});
														}


														if(itemDetailUdi !== ""){
															dataItemDetailUdi = {
																"_id" : itemDetailUdi,
																"claim_detail_id" : claimDetailId
															}
															ApiFHIR.put('device', {"apikey": apikey, "_id": itemDetailUdi}, {body: dataItemDetailUdi, json: true}, function(error, response, body){
																returnItemDetailUdi = body;
																if(returnItemDetailUdi.err_code > 0){
																	res.json(returnItemDetailUdi);	
																	console.log("add reference Item detail udi : " + itemDetailUdi);
																}
															});
														}

														if(itemSubDetailUdi !== ""){
															dataItemSubDetailUdi = {
																"_id" : itemSubDetailUdi,
																"claim_sub_detail_id" : claimDetailId
															}
															ApiFHIR.put('device', {"apikey": apikey, "_id": itemSubDetailUdi}, {body: dataItemSubDetailUdi, json: true}, function(error, response, body){
																returnItemSubDetailUdi = body;
																if(returnItemSubDetailUdi.err_code > 0){
																	res.json(returnItemSubDetailUdi);	
																	console.log("add reference Item sub detail udi : " + itemSubDetailUdi);
																}
															});
														}

														
														
														res.json({"err_code": 0, "err_msg": "Claim has been add.", "data": [{"_id": claimId}]});
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
												checkCode(apikey, type, 'CLAIM_TYPE', function (resTypeCode) {
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

										myEmitter.prependOnceListener('checkSubType', function () {
											if (!validator.isEmpty(subType)) {
												checkCode(apikey, subType, 'CLAIM_SUBTYPE', function (resSubTypeCode) {
													if (resSubTypeCode.err_code > 0) {
														myEmitter.emit('checkType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Sub type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkType');
											}
										})

										myEmitter.prependOnceListener('checkUse', function () {
											if (!validator.isEmpty(use)) {
												checkCode(apikey, use, 'CLAIM_USE', function (resUseCode) {
													if (resUseCode.err_code > 0) {
														myEmitter.emit('checkSubType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Use code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubType');
											}
										})

										myEmitter.prependOnceListener('checkPriority', function () {
											if (!validator.isEmpty(priority)) {
												checkCode(apikey, priority, 'PROCESS_PRIORITY', function (resPriorityCode) {
													if (resPriorityCode.err_code > 0) {
														myEmitter.emit('checkUse');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Priority code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkUse');
											}
										})

										myEmitter.prependOnceListener('checkFundsReserve', function () {
											if (!validator.isEmpty(fundsReserve)) {
												checkCode(apikey, fundsReserve, 'FUNDSRESERVE', function (resFundsReserveCode) {
													if (resFundsReserveCode.err_code > 0) {
														myEmitter.emit('checkPriority');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Funds reserve code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPriority');
											}
										})

										myEmitter.prependOnceListener('checkRelatedRelationship', function () {
											if (!validator.isEmpty(relatedRelationship)) {
												checkCode(apikey, relatedRelationship, 'RELATED_CLAIM_RELATIONSHIP', function (resRelatedRelationshipCode) {
													if (resRelatedRelationshipCode.err_code > 0) {
														myEmitter.emit('checkFundsReserve');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Related relationship code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkFundsReserve');
											}
										})

										myEmitter.prependOnceListener('checkPayeeType', function () {
											if (!validator.isEmpty(payeeType)) {
												checkCode(apikey, payeeType, 'PAYEETYPE', function (resPayeeTypeCode) {
													if (resPayeeTypeCode.err_code > 0) {
														myEmitter.emit('checkRelatedRelationship');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payee type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRelatedRelationship');
											}
										})

										myEmitter.prependOnceListener('checkPayeeResourceType', function () {
											if (!validator.isEmpty(payeeResourceType)) {
												checkCode(apikey, payeeResourceType, 'EX_PAYEE_RESOURCE_TYPE', function (resPayeeResourceTypeCode) {
													if (resPayeeResourceTypeCode.err_code > 0) {
														myEmitter.emit('checkPayeeType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payee resource type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPayeeType');
											}
										})

										myEmitter.prependOnceListener('checkCareTeamRole', function () {
											if (!validator.isEmpty(careTeamRole)) {
												checkCode(apikey, careTeamRole, 'CLAIM_CARETEAMROLE', function (resCareTeamRoleCode) {
													if (resCareTeamRoleCode.err_code > 0) {
														myEmitter.emit('checkPayeeResourceType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Care team role code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPayeeResourceType');
											}
										})

										myEmitter.prependOnceListener('checkCareTeamQualification', function () {
											if (!validator.isEmpty(careTeamQualification)) {
												checkCode(apikey, careTeamQualification, 'PROVIDER_QUALIFICATION', function (resCareTeamQualificationCode) {
													if (resCareTeamQualificationCode.err_code > 0) {
														myEmitter.emit('checkCareTeamRole');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Care team qualification code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCareTeamRole');
											}
										})

										myEmitter.prependOnceListener('checkInformationCategory', function () {
											if (!validator.isEmpty(informationCategory)) {
												checkCode(apikey, informationCategory, 'CLAIM_INFORMATIONCATEGORY', function (resInformationCategoryCode) {
													if (resInformationCategoryCode.err_code > 0) {
														myEmitter.emit('checkCareTeamQualification');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Information category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCareTeamQualification');
											}
										})

										myEmitter.prependOnceListener('checkInformationCode', function () {
											if (!validator.isEmpty(informationCode)) {
												checkCode(apikey, informationCode, 'CLAIM_EXCEPTION', function (resInformationCodeCode) {
													if (resInformationCodeCode.err_code > 0) {
														myEmitter.emit('checkInformationCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Information code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInformationCategory');
											}
										})

										myEmitter.prependOnceListener('checkInformationValueAttachmentLanguage', function () {
											if (!validator.isEmpty(informationValueAttachmentLanguage)) {
												checkCode(apikey, informationValueAttachmentLanguage, 'LANGUAGES', function (resInformationValueAttachmentLanguageCode) {
													if (resInformationValueAttachmentLanguageCode.err_code > 0) {
														myEmitter.emit('checkInformationCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Information value attachment language code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInformationCode');
											}
										})

										myEmitter.prependOnceListener('checkInformationReason', function () {
											if (!validator.isEmpty(informationReason)) {
												checkCode(apikey, informationReason, 'MISSING_TOOTH_REASON', function (resInformationReasonCode) {
													if (resInformationReasonCode.err_code > 0) {
														myEmitter.emit('checkInformationValueAttachmentLanguage');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Information reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInformationValueAttachmentLanguage');
											}
										})

										myEmitter.prependOnceListener('checkDiagnosisDiagnosisCodeableConcept', function () {
											if (!validator.isEmpty(diagnosisDiagnosisCodeableConcept)) {
												checkCode(apikey, diagnosisDiagnosisCodeableConcept, 'ICD_10', function (resDiagnosisDiagnosisCodeableConceptCode) {
													if (resDiagnosisDiagnosisCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkInformationReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Diagnosis diagnosis codeable concept code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInformationReason');
											}
										})

										myEmitter.prependOnceListener('checkDiagnosisType', function () {
											if (!validator.isEmpty(diagnosisType)) {
												checkCode(apikey, diagnosisType, 'EX_DIAGNOSISTYPE', function (resDiagnosisTypeCode) {
													if (resDiagnosisTypeCode.err_code > 0) {
														myEmitter.emit('checkDiagnosisDiagnosisCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Diagnosis type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDiagnosisDiagnosisCodeableConcept');
											}
										})

										myEmitter.prependOnceListener('checkDiagnosisPackageCode', function () {
											if (!validator.isEmpty(diagnosisPackageCode)) {
												checkCode(apikey, diagnosisPackageCode, 'EX_DIAGNOSISRELATEDGROUP', function (resDiagnosisPackageCodeCode) {
													if (resDiagnosisPackageCodeCode.err_code > 0) {
														myEmitter.emit('checkDiagnosisType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Diagnosis package code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDiagnosisType');
											}
										})

										myEmitter.prependOnceListener('checkProcedureProcedureCodeableConcept', function () {
											if (!validator.isEmpty(procedureProcedureCodeableConcept)) {
												checkCode(apikey, procedureProcedureCodeableConcept, 'ICD_10_PROCEDURES', function (resProcedureProcedureCodeableConceptCode) {
													if (resProcedureProcedureCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkDiagnosisPackageCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Procedure procedure codeable concept code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDiagnosisPackageCode');
											}
										})

										myEmitter.prependOnceListener('checkAccidentType', function () {
											if (!validator.isEmpty(accidentType)) {
												checkCode(apikey, accidentType, 'V3_ACTINCIDENTCODE', function (resAccidentTypeCode) {
													if (resAccidentTypeCode.err_code > 0) {
														myEmitter.emit('checkProcedureProcedureCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Accident type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkProcedureProcedureCodeableConcept');
											}
										})

										myEmitter.prependOnceListener('checkItemRevenue', function () {
											if (!validator.isEmpty(itemRevenue)) {
												checkCode(apikey, itemRevenue, 'EX_REVENUE_CENTER', function (resItemRevenueCode) {
													if (resItemRevenueCode.err_code > 0) {
														myEmitter.emit('checkAccidentType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item revenue code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAccidentType');
											}
										})

										myEmitter.prependOnceListener('checkItemCategory', function () {
											if (!validator.isEmpty(itemCategory)) {
												checkCode(apikey, itemCategory, 'BENEFIT_SUBCATEGORY', function (resItemCategoryCode) {
													if (resItemCategoryCode.err_code > 0) {
														myEmitter.emit('checkItemRevenue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemRevenue');
											}
										})

										myEmitter.prependOnceListener('checkItemService', function () {
											if (!validator.isEmpty(itemService)) {
												checkCode(apikey, itemService, 'SERVICE_USCLS', function (resItemServiceCode) {
													if (resItemServiceCode.err_code > 0) {
														myEmitter.emit('checkItemCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item service code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemCategory');
											}
										})

										myEmitter.prependOnceListener('checkItemModifier', function () {
											if (!validator.isEmpty(itemModifier)) {
												checkCode(apikey, itemModifier, 'CLAIM_MODIFIERS', function (resItemModifierCode) {
													if (resItemModifierCode.err_code > 0) {
														myEmitter.emit('checkItemService');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item modifier code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemService');
											}
										})

										myEmitter.prependOnceListener('checkItemProgramCode', function () {
											if (!validator.isEmpty(itemProgramCode)) {
												checkCode(apikey, itemProgramCode, 'EX_PROGRAM_CODE', function (resItemProgramCodeCode) {
													if (resItemProgramCodeCode.err_code > 0) {
														myEmitter.emit('checkItemModifier');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item program code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemModifier');
											}
										})

										myEmitter.prependOnceListener('checkItemLocationCodeableConcept', function () {
											if (!validator.isEmpty(itemLocationCodeableConcept)) {
												checkCode(apikey, itemLocationCodeableConcept, 'SERVICE_PLACE', function (resItemLocationCodeableConceptCode) {
													if (resItemLocationCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkItemProgramCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item location codeable concept code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemProgramCode');
											}
										})

										myEmitter.prependOnceListener('checkItemBodySite', function () {
											if (!validator.isEmpty(itemBodySite)) {
												checkCode(apikey, itemBodySite, 'TOOTH', function (resItemBodySiteCode) {
													if (resItemBodySiteCode.err_code > 0) {
														myEmitter.emit('checkItemLocationCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item body site code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemLocationCodeableConcept');
											}
										})

										myEmitter.prependOnceListener('checkItemSubSite', function () {
											if (!validator.isEmpty(itemSubSite)) {
												checkCode(apikey, itemSubSite, 'SURFACE', function (resItemSubSiteCode) {
													if (resItemSubSiteCode.err_code > 0) {
														myEmitter.emit('checkItemBodySite');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item sub site code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemBodySite');
											}
										})

										myEmitter.prependOnceListener('checkItemDetailRevenue', function () {
											if (!validator.isEmpty(itemDetailRevenue)) {
												checkCode(apikey, itemDetailRevenue, 'EX_REVENUE_CENTER', function (resItemDetailRevenueCode) {
													if (resItemDetailRevenueCode.err_code > 0) {
														myEmitter.emit('checkItemSubSite');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item detail revenue code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemSubSite');
											}
										})

										myEmitter.prependOnceListener('checkItemDetailCategory', function () {
											if (!validator.isEmpty(itemDetailCategory)) {
												checkCode(apikey, itemDetailCategory, 'BENEFIT_SUBCATEGORY', function (resItemDetailCategoryCode) {
													if (resItemDetailCategoryCode.err_code > 0) {
														myEmitter.emit('checkItemDetailRevenue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item detail category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemDetailRevenue');
											}
										})

										myEmitter.prependOnceListener('checkItemDetailService', function () {
											if (!validator.isEmpty(itemDetailService)) {
												checkCode(apikey, itemDetailService, 'SERVICE_USCLS', function (resItemDetailServiceCode) {
													if (resItemDetailServiceCode.err_code > 0) {
														myEmitter.emit('checkItemDetailCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item detail service code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemDetailCategory');
											}
										})

										myEmitter.prependOnceListener('checkItemDetailModifier', function () {
											if (!validator.isEmpty(itemDetailModifier)) {
												checkCode(apikey, itemDetailModifier, 'CLAIM_MODIFIERS', function (resItemDetailModifierCode) {
													if (resItemDetailModifierCode.err_code > 0) {
														myEmitter.emit('checkItemDetailService');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item detail modifier code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemDetailService');
											}
										})

										myEmitter.prependOnceListener('checkItemDetailProgramCode', function () {
											if (!validator.isEmpty(itemDetailProgramCode)) {
												checkCode(apikey, itemDetailProgramCode, 'EX_PROGRAM_CODE', function (resItemDetailProgramCodeCode) {
													if (resItemDetailProgramCodeCode.err_code > 0) {
														myEmitter.emit('checkItemDetailModifier');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item detail program code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemDetailModifier');
											}
										})

										myEmitter.prependOnceListener('checkItemSubDetailRevenue', function () {
											if (!validator.isEmpty(itemSubDetailRevenue)) {
												checkCode(apikey, itemSubDetailRevenue, 'EX_REVENUE_CENTER', function (resItemSubDetailRevenueCode) {
													if (resItemSubDetailRevenueCode.err_code > 0) {
														myEmitter.emit('checkItemDetailProgramCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item sub detail revenue code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemDetailProgramCode');
											}
										})

										myEmitter.prependOnceListener('checkItemSubDetailCategory', function () {
											if (!validator.isEmpty(itemSubDetailCategory)) {
												checkCode(apikey, itemSubDetailCategory, 'BENEFIT_SUBCATEGORY', function (resItemSubDetailCategoryCode) {
													if (resItemSubDetailCategoryCode.err_code > 0) {
														myEmitter.emit('checkItemSubDetailRevenue');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item sub detail category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemSubDetailRevenue');
											}
										})

										myEmitter.prependOnceListener('checkItemSubDetailService', function () {
											if (!validator.isEmpty(itemSubDetailService)) {
												checkCode(apikey, itemSubDetailService, 'SERVICE_USCLS', function (resItemSubDetailServiceCode) {
													if (resItemSubDetailServiceCode.err_code > 0) {
														myEmitter.emit('checkItemSubDetailCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item sub detail service code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemSubDetailCategory');
											}
										})

										myEmitter.prependOnceListener('checkItemSubDetailModifier', function () {
											if (!validator.isEmpty(itemSubDetailModifier)) {
												checkCode(apikey, itemSubDetailModifier, 'CLAIM_MODIFIERS', function (resItemSubDetailModifierCode) {
													if (resItemSubDetailModifierCode.err_code > 0) {
														myEmitter.emit('checkItemSubDetailService');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item sub detail modifier code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemSubDetailService');
											}
										})

										myEmitter.prependOnceListener('checkItemSubDetailProgramCode', function () {
											if (!validator.isEmpty(itemSubDetailProgramCode)) {
												checkCode(apikey, itemSubDetailProgramCode, 'EX_PROGRAM_CODE', function (resItemSubDetailProgramCodeCode) {
													if (resItemSubDetailProgramCodeCode.err_code > 0) {
														myEmitter.emit('checkItemSubDetailModifier');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item sub detail program code code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemSubDetailModifier');
											}
										})

										myEmitter.prependOnceListener('checkPatient', function () {
											if (!validator.isEmpty(patient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
													if (resPatient.err_code > 0) {
														myEmitter.emit('checkItemSubDetailProgramCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemSubDetailProgramCode');
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

										myEmitter.prependOnceListener('checkInsurer', function () {
											if (!validator.isEmpty(insurer)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + insurer, 'ORGANIZATION', function (resInsurer) {
													if (resInsurer.err_code > 0) {
														myEmitter.emit('checkEnterer');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurer id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkEnterer');
											}
										})

										myEmitter.prependOnceListener('checkProvider', function () {
											if (!validator.isEmpty(provider)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + provider, 'PRACTITIONER', function (resProvider) {
													if (resProvider.err_code > 0) {
														myEmitter.emit('checkInsurer');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Provider id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInsurer');
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

										myEmitter.prependOnceListener('checkRelatedClaim', function () {
											if (!validator.isEmpty(relatedClaim)) {
												checkUniqeValue(apikey, "CLAIM_ID|" + relatedClaim, 'CLAIM', function (resRelatedClaim) {
													if (resRelatedClaim.err_code > 0) {
														myEmitter.emit('checkOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Related claim id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOrganization');
											}
										})

										myEmitter.prependOnceListener('checkRelatedReference', function () {
											if (!validator.isEmpty(relatedReference)) {
												checkUniqeValue(apikey, "IDENTIFIER_ID|" + relatedReference, 'IDENTIFIER', function (resRelatedReference) {
													if (resRelatedReference.err_code > 0) {
														myEmitter.emit('checkRelatedClaim');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Related reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRelatedClaim');
											}
										})

										myEmitter.prependOnceListener('checkPrescriptionMedicationRequest', function () {
											if (!validator.isEmpty(prescriptionMedicationRequest)) {
												checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + prescriptionMedicationRequest, 'MEDICATION_REQUEST', function (resPrescriptionMedicationRequest) {
													if (resPrescriptionMedicationRequest.err_code > 0) {
														myEmitter.emit('checkRelatedReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Prescription medication request id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkRelatedReference');
											}
										})

										myEmitter.prependOnceListener('checkPrescriptionVisionPrescription', function () {
											if (!validator.isEmpty(prescriptionVisionPrescription)) {
												checkUniqeValue(apikey, "VISION_PRESCRIPTION_ID|" + prescriptionVisionPrescription, 'VISION_PRESCRIPTION', function (resPrescriptionVisionPrescription) {
													if (resPrescriptionVisionPrescription.err_code > 0) {
														myEmitter.emit('checkPrescriptionMedicationRequest');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Prescription vision prescription id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPrescriptionMedicationRequest');
											}
										})

										myEmitter.prependOnceListener('checkOriginalPrescription', function () {
											if (!validator.isEmpty(originalPrescription)) {
												checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + originalPrescription, 'MEDICATION_REQUEST', function (resOriginalPrescription) {
													if (resOriginalPrescription.err_code > 0) {
														myEmitter.emit('checkPrescriptionVisionPrescription');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Original prescription id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPrescriptionVisionPrescription');
											}
										})

										myEmitter.prependOnceListener('checkPayeePartyPractitioner', function () {
											if (!validator.isEmpty(payeePartyPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + payeePartyPractitioner, 'PRACTITIONER', function (resPayeePartyPractitioner) {
													if (resPayeePartyPractitioner.err_code > 0) {
														myEmitter.emit('checkOriginalPrescription');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payee party practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOriginalPrescription');
											}
										})

										myEmitter.prependOnceListener('checkPayeePartyOrganization', function () {
											if (!validator.isEmpty(payeePartyOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + payeePartyOrganization, 'ORGANIZATION', function (resPayeePartyOrganization) {
													if (resPayeePartyOrganization.err_code > 0) {
														myEmitter.emit('checkPayeePartyPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payee party organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPayeePartyPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkPayeePartyPatient', function () {
											if (!validator.isEmpty(payeePartyPatient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + payeePartyPatient, 'PATIENT', function (resPayeePartyPatient) {
													if (resPayeePartyPatient.err_code > 0) {
														myEmitter.emit('checkPayeePartyOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payee party patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPayeePartyOrganization');
											}
										})

										myEmitter.prependOnceListener('checkPayeePartyRelatedPerson', function () {
											if (!validator.isEmpty(payeePartyRelatedPerson)) {
												checkUniqeValue(apikey, "RELATED_PERSON_ID|" + payeePartyRelatedPerson, 'RELATED_PERSON', function (resPayeePartyRelatedPerson) {
													if (resPayeePartyRelatedPerson.err_code > 0) {
														myEmitter.emit('checkPayeePartyPatient');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payee party related person id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPayeePartyPatient');
											}
										})

										myEmitter.prependOnceListener('checkReferral', function () {
											if (!validator.isEmpty(referral)) {
												checkUniqeValue(apikey, "REFERRAL_REQUEST_ID|" + referral, 'REFERRAL_REQUEST', function (resReferral) {
													if (resReferral.err_code > 0) {
														myEmitter.emit('checkPayeePartyRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Referral id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPayeePartyRelatedPerson');
											}
										})

										myEmitter.prependOnceListener('checkFacility', function () {
											if (!validator.isEmpty(facility)) {
												checkUniqeValue(apikey, "LOCATION_ID|" + facility, 'LOCATION', function (resFacility) {
													if (resFacility.err_code > 0) {
														myEmitter.emit('checkReferral');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Facility id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkReferral');
											}
										})

										myEmitter.prependOnceListener('checkCareTeamProviderPractitioner', function () {
											if (!validator.isEmpty(careTeamProviderPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + careTeamProviderPractitioner, 'PRACTITIONER', function (resCareTeamProviderPractitioner) {
													if (resCareTeamProviderPractitioner.err_code > 0) {
														myEmitter.emit('checkFacility');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Care team provider practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkFacility');
											}
										})

										myEmitter.prependOnceListener('checkCareTeamProviderOrganization', function () {
											if (!validator.isEmpty(careTeamProviderOrganization)) {
												checkUniqeValue(apikey, "ORGANIZATION_ID|" + careTeamProviderOrganization, 'ORGANIZATION', function (resCareTeamProviderOrganization) {
													if (resCareTeamProviderOrganization.err_code > 0) {
														myEmitter.emit('checkCareTeamProviderPractitioner');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Care team provider organization id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCareTeamProviderPractitioner');
											}
										})

										myEmitter.prependOnceListener('checkDiagnosisDiagnosisReference', function () {
											if (!validator.isEmpty(diagnosisDiagnosisReference)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + diagnosisDiagnosisReference, 'CONDITION', function (resDiagnosisDiagnosisReference) {
													if (resDiagnosisDiagnosisReference.err_code > 0) {
														myEmitter.emit('checkCareTeamProviderOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Diagnosis diagnosis reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCareTeamProviderOrganization');
											}
										})

										myEmitter.prependOnceListener('checkProcedureProcedureReference', function () {
											if (!validator.isEmpty(procedureProcedureReference)) {
												checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureProcedureReference, 'PROCEDURE', function (resProcedureProcedureReference) {
													if (resProcedureProcedureReference.err_code > 0) {
														myEmitter.emit('checkDiagnosisDiagnosisReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Procedure procedure reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDiagnosisDiagnosisReference');
											}
										})

										myEmitter.prependOnceListener('checkInsuranceCoverage', function () {
											if (!validator.isEmpty(insuranceCoverage)) {
												checkUniqeValue(apikey, "COVERAGE_ID|" + insuranceCoverage, 'COVERAGE', function (resInsuranceCoverage) {
													if (resInsuranceCoverage.err_code > 0) {
														myEmitter.emit('checkProcedureProcedureReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurance coverage id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkProcedureProcedureReference');
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

										myEmitter.prependOnceListener('checkAccidentLocationReference', function () {
											if (!validator.isEmpty(accidentLocationReference)) {
												checkUniqeValue(apikey, "LOCATION_ID|" + accidentLocationReference, 'LOCATION', function (resAccidentLocationReference) {
													if (resAccidentLocationReference.err_code > 0) {
														myEmitter.emit('checkInsuranceClaimResponse');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Accident location reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInsuranceClaimResponse');
											}
										})

										myEmitter.prependOnceListener('checkItemLocationReference', function () {
											if (!validator.isEmpty(itemLocationReference)) {
												checkUniqeValue(apikey, "LOCATION_ID|" + itemLocationReference, 'LOCATION', function (resItemLocationReference) {
													if (resItemLocationReference.err_code > 0) {
														myEmitter.emit('checkAccidentLocationReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item location reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAccidentLocationReference');
											}
										})

										myEmitter.prependOnceListener('checkItemUdi', function () {
											if (!validator.isEmpty(itemUdi)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + itemUdi, 'DEVICE', function (resItemUdi) {
													if (resItemUdi.err_code > 0) {
														myEmitter.emit('checkItemLocationReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item udi id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemLocationReference');
											}
										})

										myEmitter.prependOnceListener('checkItemEncounter', function () {
											if (!validator.isEmpty(itemEncounter)) {
												checkUniqeValue(apikey, "ENCOUNTER_ID|" + itemEncounter, 'ENCOUNTER', function (resItemEncounter) {
													if (resItemEncounter.err_code > 0) {
														myEmitter.emit('checkItemUdi');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item encounter id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemUdi');
											}
										})

										myEmitter.prependOnceListener('checkItemDetailUdi', function () {
											if (!validator.isEmpty(itemDetailUdi)) {
												checkUniqeValue(apikey, "DEVICE_ID|" + itemDetailUdi, 'DEVICE', function (resItemDetailUdi) {
													if (resItemDetailUdi.err_code > 0) {
														myEmitter.emit('checkItemEncounter');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item detail udi id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemEncounter');
											}
										})

										if (!validator.isEmpty(itemSubDetailUdi)) {
											checkUniqeValue(apikey, "DEVICE_ID|" + itemSubDetailUdi, 'DEVICE', function (resItemSubDetailUdi) {
												if (resItemSubDetailUdi.err_code > 0) {
													myEmitter.emit('checkItemDetailUdi');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Item sub detail udi id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkItemDetailUdi');
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
      var claimId = req.params.claim_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof claimId !== 'undefined') {
        if (validator.isEmpty(claimId)) {
          err_code = 2;
          err_msg = "Claim id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Claim id is required";
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
                        checkUniqeValue(apikey, "CLAIM_ID|" + claimId, 'CLAIM', function (resEncounterID) {
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
                              "claim_id": claimId
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
                                  "err_msg": "Identifier has been add in this Claim.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
                              }
                            })
                          } else {
                            res.json({
                              "err_code": 503,
                              "err_msg": "Claim Id not found"
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
		claim: function updateClaim(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var claimId = req.params.claim_id;
			
			var err_code = 0;
      var err_msg = "";
      var dataClaim = {};
			
			if (typeof claimId !== 'undefined') {
        if (validator.isEmpty(claimId)) {
          err_code = 2;
          err_msg = "Claim Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Claim Id is required.";
      }
			
			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					dataClaim.status = "";
				}else{
					dataClaim.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					dataClaim.type = "";
				}else{
					dataClaim.type = type;
				}
			}else{
			  type = "";
			}

			if(typeof req.body.subType !== 'undefined' && req.body.subType !== ""){
				var subType =  req.body.subType.trim().toLowerCase();
				if(validator.isEmpty(subType)){
					dataClaim.subtype = "";
				}else{
					dataClaim.subtype = subType;
				}
			}else{
			  subType = "";
			}

			if(typeof req.body.use !== 'undefined' && req.body.use !== ""){
				var use =  req.body.use.trim().toLowerCase();
				if(validator.isEmpty(use)){
					dataClaim.use = "";
				}else{
					dataClaim.use = use;
				}
			}else{
			  use = "";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					dataClaim.patient = "";
				}else{
					dataClaim.patient = patient;
				}
			}else{
			  patient = "";
			}

			if (typeof req.body.billablePeriod !== 'undefined' && req.body.billablePeriod !== "") {
			  var billablePeriod = req.body.billablePeriod;
			  if (billablePeriod.indexOf("to") > 0) {
			    arrBillablePeriod = billablePeriod.split("to");
			    dataClaim.billable_period_start = arrBillablePeriod[0];
			    dataClaim.billable_period_end = arrBillablePeriod[1];
			    if (!regex.test(billablePeriodStart) && !regex.test(billablePeriodEnd)) {
			      err_code = 2;
			      err_msg = "claim billable period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "claim billable period invalid date format.";
				}
			} else {
			  billablePeriod = "";
			}

			if(typeof req.body.created !== 'undefined' && req.body.created !== ""){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					err_code = 2;
					err_msg = "claim created is required.";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "claim created invalid date format.";	
					}else{
						dataClaim.created = created;
					}
				}
			}else{
			  created = "";
			}

			if(typeof req.body.enterer !== 'undefined' && req.body.enterer !== ""){
				var enterer =  req.body.enterer.trim().toLowerCase();
				if(validator.isEmpty(enterer)){
					dataClaim.enterer = "";
				}else{
					dataClaim.enterer = enterer;
				}
			}else{
			  enterer = "";
			}

			if(typeof req.body.insurer !== 'undefined' && req.body.insurer !== ""){
				var insurer =  req.body.insurer.trim().toLowerCase();
				if(validator.isEmpty(insurer)){
					dataClaim.insurer = "";
				}else{
					dataClaim.insurer = insurer;
				}
			}else{
			  insurer = "";
			}

			if(typeof req.body.provider !== 'undefined' && req.body.provider !== ""){
				var provider =  req.body.provider.trim().toLowerCase();
				if(validator.isEmpty(provider)){
					dataClaim.provider = "";
				}else{
					dataClaim.provider = provider;
				}
			}else{
			  provider = "";
			}

			if(typeof req.body.organization !== 'undefined' && req.body.organization !== ""){
				var organization =  req.body.organization.trim().toLowerCase();
				if(validator.isEmpty(organization)){
					dataClaim.organization = "";
				}else{
					dataClaim.organization = organization;
				}
			}else{
			  organization = "";
			}

			if(typeof req.body.priority !== 'undefined' && req.body.priority !== ""){
				var priority =  req.body.priority.trim().toLowerCase();
				if(validator.isEmpty(priority)){
					dataClaim.priority = "";
				}else{
					dataClaim.priority = priority;
				}
			}else{
			  priority = "";
			}

			if(typeof req.body.fundsReserve !== 'undefined' && req.body.fundsReserve !== ""){
				var fundsReserve =  req.body.fundsReserve.trim().toLowerCase();
				if(validator.isEmpty(fundsReserve)){
					dataClaim.funds_reserve = "";
				}else{
					dataClaim.funds_reserve = fundsReserve;
				}
			}else{
			  fundsReserve = "";
			}

			if(typeof req.body.prescription.medicationRequest !== 'undefined' && req.body.prescription.medicationRequest !== ""){
				var prescriptionMedicationRequest =  req.body.prescription.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(prescriptionMedicationRequest)){
					dataClaim.prescription_medication_request = "";
				}else{
					dataClaim.prescription_medication_request = prescriptionMedicationRequest;
				}
			}else{
			  prescriptionMedicationRequest = "";
			}

			if(typeof req.body.prescription.visionPrescription !== 'undefined' && req.body.prescription.visionPrescription !== ""){
				var prescriptionVisionPrescription =  req.body.prescription.visionPrescription.trim().toLowerCase();
				if(validator.isEmpty(prescriptionVisionPrescription)){
					dataClaim.prescription_vision_prescription = "";
				}else{
					dataClaim.prescription_vision_prescription = prescriptionVisionPrescription;
				}
			}else{
			  prescriptionVisionPrescription = "";
			}

			if(typeof req.body.originalPrescription !== 'undefined' && req.body.originalPrescription !== ""){
				var originalPrescription =  req.body.originalPrescription.trim().toLowerCase();
				if(validator.isEmpty(originalPrescription)){
					dataClaim.original_prescription = "";
				}else{
					dataClaim.original_prescription = originalPrescription;
				}
			}else{
			  originalPrescription = "";
			}

			if(typeof req.body.payee.type !== 'undefined' && req.body.payee.type !== ""){
				var payeeType =  req.body.payee.type.trim().toLowerCase();
				if(validator.isEmpty(payeeType)){
					err_code = 2;
					err_msg = "claim payee type is required.";
				}else{
					dataClaim.payee_type = payeeType;
				}
			}else{
			  payeeType = "";
			}

			if(typeof req.body.payee.resourceType !== 'undefined' && req.body.payee.resourceType !== ""){
				var payeeResourceType =  req.body.payee.resourceType.trim().toLowerCase();
				if(validator.isEmpty(payeeResourceType)){
					dataClaim.payee_resource_type = "";
				}else{
					dataClaim.payee_resource_type = payeeResourceType;
				}
			}else{
			  payeeResourceType = "";
			}

			if(typeof req.body.payee.party.practitioner !== 'undefined' && req.body.payee.party.practitioner !== ""){
				var payeePartyPractitioner =  req.body.payee.party.practitioner.trim().toLowerCase();
				if(validator.isEmpty(payeePartyPractitioner)){
					dataClaim.payee_party_practitioner = "";
				}else{
					dataClaim.payee_party_practitioner = payeePartyPractitioner;
				}
			}else{
			  payeePartyPractitioner = "";
			}

			if(typeof req.body.payee.party.organization !== 'undefined' && req.body.payee.party.organization !== ""){
				var payeePartyOrganization =  req.body.payee.party.organization.trim().toLowerCase();
				if(validator.isEmpty(payeePartyOrganization)){
					dataClaim.payee_party_organization = "";
				}else{
					dataClaim.payee_party_organization = payeePartyOrganization;
				}
			}else{
			  payeePartyOrganization = "";
			}

			if(typeof req.body.payee.party.patient !== 'undefined' && req.body.payee.party.patient !== ""){
				var payeePartyPatient =  req.body.payee.party.patient.trim().toLowerCase();
				if(validator.isEmpty(payeePartyPatient)){
					dataClaim.payee_party_patient = "";
				}else{
					dataClaim.payee_party_patient = payeePartyPatient;
				}
			}else{
			  payeePartyPatient = "";
			}

			if(typeof req.body.payee.party.relatedPerson !== 'undefined' && req.body.payee.party.relatedPerson !== ""){
				var payeePartyRelatedPerson =  req.body.payee.party.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(payeePartyRelatedPerson)){
					dataClaim.payee_party_related_person = "";
				}else{
					dataClaim.payee_party_related_person = payeePartyRelatedPerson;
				}
			}else{
			  payeePartyRelatedPerson = "";
			}

			if(typeof req.body.referral !== 'undefined' && req.body.referral !== ""){
				var referral =  req.body.referral.trim().toLowerCase();
				if(validator.isEmpty(referral)){
					dataClaim.referral = "";
				}else{
					dataClaim.referral = referral;
				}
			}else{
			  referral = "";
			}

			if(typeof req.body.facility !== 'undefined' && req.body.facility !== ""){
				var facility =  req.body.facility.trim().toLowerCase();
				if(validator.isEmpty(facility)){
					dataClaim.facility = "";
				}else{
					dataClaim.facility = facility;
				}
			}else{
			  facility = "";
			}

			if (typeof req.body.employmentImpacted !== 'undefined' && req.body.employmentImpacted !== "") {
			  var employmentImpacted = req.body.employmentImpacted;
			  if (employmentImpacted.indexOf("to") > 0) {
			    arrEmploymentImpacted = employmentImpacted.split("to");
			    dataClaim.employment_impacted_start = arrEmploymentImpacted[0];
			    dataClaim.employment_impacted_end = arrEmploymentImpacted[1];
			    if (!regex.test(employmentImpactedStart) && !regex.test(employmentImpactedEnd)) {
			      err_code = 2;
			      err_msg = "claim employment impacted invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "claim employment impacted invalid date format.";
				}
			} else {
			  employmentImpacted = "";
			}

			if (typeof req.body.hospitalization !== 'undefined' && req.body.hospitalization !== "") {
			  var hospitalization = req.body.hospitalization;
			  if (hospitalization.indexOf("to") > 0) {
			    arrHospitalization = hospitalization.split("to");
			    dataClaim.hospitalization_start = arrHospitalization[0];
			    dataClaim.hospitalization_end = arrHospitalization[1];
			    if (!regex.test(hospitalizationStart) && !regex.test(hospitalizationEnd)) {
			      err_code = 2;
			      err_msg = "claim hospitalization invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "claim hospitalization invalid date format.";
				}
			} else {
			  hospitalization = "";
			}

			if(typeof req.body.total !== 'undefined' && req.body.total !== ""){
				var total =  req.body.total.trim().toLowerCase();
				if(validator.isEmpty(total)){
					dataClaim.total = "";
				}else{
					dataClaim.total = total;
				}
			}else{
			  total = "";
			}
			

			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "CLAIM_ID|" + claimId, 'CLAIM', function (resClaimId) {
								if (resClaimId.err_code > 0) {
									ApiFHIR.put('claim', {
										"apikey": apikey,
										"_id": claimId
									}, {
										body: dataClaim,
										json: true
									}, function (error, response, body) {
										claim = body;
										if (claim.err_code > 0) {
											res.json(claim);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "Claim has been updated.",
												"data": claim.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 404,
										"err_msg": "Claim Id not found"
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

						myEmitter.prependOnceListener('checkType', function () {
							if (!validator.isEmpty(type)) {
								checkCode(apikey, type, 'CLAIM_TYPE', function (resTypeCode) {
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

						myEmitter.prependOnceListener('checkSubType', function () {
							if (!validator.isEmpty(subType)) {
								checkCode(apikey, subType, 'CLAIM_SUBTYPE', function (resSubTypeCode) {
									if (resSubTypeCode.err_code > 0) {
										myEmitter.emit('checkType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Sub type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkType');
							}
						})

						myEmitter.prependOnceListener('checkUse', function () {
							if (!validator.isEmpty(use)) {
								checkCode(apikey, use, 'CLAIM_USE', function (resUseCode) {
									if (resUseCode.err_code > 0) {
										myEmitter.emit('checkSubType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Use code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubType');
							}
						})

						myEmitter.prependOnceListener('checkPriority', function () {
							if (!validator.isEmpty(priority)) {
								checkCode(apikey, priority, 'PROCESS_PRIORITY', function (resPriorityCode) {
									if (resPriorityCode.err_code > 0) {
										myEmitter.emit('checkUse');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Priority code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkUse');
							}
						})

						myEmitter.prependOnceListener('checkFundsReserve', function () {
							if (!validator.isEmpty(fundsReserve)) {
								checkCode(apikey, fundsReserve, 'FUNDSRESERVE', function (resFundsReserveCode) {
									if (resFundsReserveCode.err_code > 0) {
										myEmitter.emit('checkPriority');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Funds reserve code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPriority');
							}
						})

						myEmitter.prependOnceListener('checkPayeeType', function () {
							if (!validator.isEmpty(payeeType)) {
								checkCode(apikey, payeeType, 'PAYEETYPE', function (resPayeeTypeCode) {
									if (resPayeeTypeCode.err_code > 0) {
										myEmitter.emit('checkFundsReserve');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Payee type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkFundsReserve');
							}
						})

						myEmitter.prependOnceListener('checkPayeeResourceType', function () {
							if (!validator.isEmpty(payeeResourceType)) {
								checkCode(apikey, payeeResourceType, 'EX_PAYEE_RESOURCE_TYPE', function (resPayeeResourceTypeCode) {
									if (resPayeeResourceTypeCode.err_code > 0) {
										myEmitter.emit('checkPayeeType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Payee resource type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPayeeType');
							}
						})

						myEmitter.prependOnceListener('checkPatient', function () {
							if (!validator.isEmpty(patient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
									if (resPatient.err_code > 0) {
										myEmitter.emit('checkPayeeResourceType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPayeeResourceType');
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

						myEmitter.prependOnceListener('checkInsurer', function () {
							if (!validator.isEmpty(insurer)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + insurer, 'ORGANIZATION', function (resInsurer) {
									if (resInsurer.err_code > 0) {
										myEmitter.emit('checkEnterer');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurer id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkEnterer');
							}
						})

						myEmitter.prependOnceListener('checkProvider', function () {
							if (!validator.isEmpty(provider)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + provider, 'PRACTITIONER', function (resProvider) {
									if (resProvider.err_code > 0) {
										myEmitter.emit('checkInsurer');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Provider id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInsurer');
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

						myEmitter.prependOnceListener('checkPrescriptionMedicationRequest', function () {
							if (!validator.isEmpty(prescriptionMedicationRequest)) {
								checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + prescriptionMedicationRequest, 'MEDICATION_REQUEST', function (resPrescriptionMedicationRequest) {
									if (resPrescriptionMedicationRequest.err_code > 0) {
										myEmitter.emit('checkOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Prescription medication request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkOrganization');
							}
						})

						myEmitter.prependOnceListener('checkPrescriptionVisionPrescription', function () {
							if (!validator.isEmpty(prescriptionVisionPrescription)) {
								checkUniqeValue(apikey, "VISION_PRESCRIPTION_ID|" + prescriptionVisionPrescription, 'VISION_PRESCRIPTION', function (resPrescriptionVisionPrescription) {
									if (resPrescriptionVisionPrescription.err_code > 0) {
										myEmitter.emit('checkPrescriptionMedicationRequest');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Prescription vision prescription id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPrescriptionMedicationRequest');
							}
						})

						myEmitter.prependOnceListener('checkOriginalPrescription', function () {
							if (!validator.isEmpty(originalPrescription)) {
								checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + originalPrescription, 'MEDICATION_REQUEST', function (resOriginalPrescription) {
									if (resOriginalPrescription.err_code > 0) {
										myEmitter.emit('checkPrescriptionVisionPrescription');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Original prescription id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPrescriptionVisionPrescription');
							}
						})

						myEmitter.prependOnceListener('checkPayeePartyPractitioner', function () {
							if (!validator.isEmpty(payeePartyPractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + payeePartyPractitioner, 'PRACTITIONER', function (resPayeePartyPractitioner) {
									if (resPayeePartyPractitioner.err_code > 0) {
										myEmitter.emit('checkOriginalPrescription');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Payee party practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkOriginalPrescription');
							}
						})

						myEmitter.prependOnceListener('checkPayeePartyOrganization', function () {
							if (!validator.isEmpty(payeePartyOrganization)) {
								checkUniqeValue(apikey, "ORGANIZATION_ID|" + payeePartyOrganization, 'ORGANIZATION', function (resPayeePartyOrganization) {
									if (resPayeePartyOrganization.err_code > 0) {
										myEmitter.emit('checkPayeePartyPractitioner');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Payee party organization id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPayeePartyPractitioner');
							}
						})

						myEmitter.prependOnceListener('checkPayeePartyPatient', function () {
							if (!validator.isEmpty(payeePartyPatient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + payeePartyPatient, 'PATIENT', function (resPayeePartyPatient) {
									if (resPayeePartyPatient.err_code > 0) {
										myEmitter.emit('checkPayeePartyOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Payee party patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPayeePartyOrganization');
							}
						})

						myEmitter.prependOnceListener('checkPayeePartyRelatedPerson', function () {
							if (!validator.isEmpty(payeePartyRelatedPerson)) {
								checkUniqeValue(apikey, "RELATED_PERSON_ID|" + payeePartyRelatedPerson, 'RELATED_PERSON', function (resPayeePartyRelatedPerson) {
									if (resPayeePartyRelatedPerson.err_code > 0) {
										myEmitter.emit('checkPayeePartyPatient');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Payee party related person id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPayeePartyPatient');
							}
						})

						myEmitter.prependOnceListener('checkReferral', function () {
							if (!validator.isEmpty(referral)) {
								checkUniqeValue(apikey, "REFERRAL_REQUEST_ID|" + referral, 'REFERRAL_REQUEST', function (resReferral) {
									if (resReferral.err_code > 0) {
										myEmitter.emit('checkPayeePartyRelatedPerson');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Referral id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPayeePartyRelatedPerson');
							}
						})

						if (!validator.isEmpty(facility)) {
							checkUniqeValue(apikey, "LOCATION_ID|" + facility, 'LOCATION', function (resFacility) {
								if (resFacility.err_code > 0) {
									myEmitter.emit('checkReferral');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Facility id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkReferral');
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
      var claimId = req.params.claim_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof claimId !== 'undefined') {
        if (validator.isEmpty(claimId)) {
          err_code = 2;
          err_msg = "Claim id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Claim id is required";
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
            myEmitter.once('checkClaimId', function () {
              checkUniqeValue(apikey, "CLAIM_ID|" + claimId, 'CLAIM', function (resClaimId) {
                if (resClaimId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "CLAIM_ID|" + claimId
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
                            "err_msg": "Identifier has been update in this Claim.",
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
                    "err_msg": "Claim Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkClaimId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkClaimId');
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
		claimRelated: function updateClaimRelated(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimId = req.params.claim_id;
			var claimRelatedId = req.params.claim_related_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaim = {};
			//input check 
			if(typeof claimId !== 'undefined'){
				if(validator.isEmpty(claimId)){
					err_code = 2;
					err_msg = "Claim id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim id is required";
			}

			if(typeof claimRelatedId !== 'undefined'){
				if(validator.isEmpty(claimRelatedId)){
					err_code = 2;
					err_msg = "Claim Related id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Related id is required";
			}
			
			if(typeof req.body.claim !== 'undefined' && req.body.claim !== ""){
				var relatedClaim =  req.body.claim.trim().toLowerCase();
				if(validator.isEmpty(relatedClaim)){
					dataClaim.claim = "";
				}else{
					dataClaim.claim = relatedClaim;
				}
			}else{
			  relatedClaim = "";
			}

			if(typeof req.body.relationship !== 'undefined' && req.body.relationship !== ""){
				var relatedRelationship =  req.body.relationship.trim().toLowerCase();
				if(validator.isEmpty(relatedRelationship)){
					dataClaim.relationship = "";
				}else{
					dataClaim.relationship = relatedRelationship;
				}
			}else{
			  relatedRelationship = "";
			}

			if(typeof req.body.reference !== 'undefined' && req.body.reference !== ""){
				var relatedReference =  req.body.reference.trim().toLowerCase();
				if(validator.isEmpty(relatedReference)){
					dataClaim.reference = "";
				}else{
					dataClaim.reference = relatedReference;
				}
			}else{
			  relatedReference = "";
			}

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimID', function(){
							checkUniqeValue(apikey, "claim_id|" + claimId, 'claim', function(resClaimId){
								if(resClaimId.err_code > 0){
									checkUniqeValue(apikey, "related_id|" + claimRelatedId, 'claim_related', function(resClaimRelatedID){
										if(resClaimRelatedID.err_code > 0){
											ApiFHIR.put('claimRelated', {"apikey": apikey, "_id": claimRelatedId, "dr": "claim_id|"+claimId}, {body: dataClaim, json: true}, function(error, response, body){
												claimRelated = body;
												if(claimRelated.err_code > 0){
													res.json(claimRelated);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim related has been update in this Claim.", "data": claimRelated.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim related Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkRelatedClaim', function () {
							if (!validator.isEmpty(relatedClaim)) {
								checkUniqeValue(apikey, "CLAIM_ID|" + relatedClaim, 'CLAIM', function (resRelatedClaim) {
									if (resRelatedClaim.err_code > 0) {
										myEmitter.emit('checkClaimID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Related claim id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimID');
							}
						})

						myEmitter.prependOnceListener('checkRelatedReference', function () {
							if (!validator.isEmpty(relatedReference)) {
								checkUniqeValue(apikey, "IDENTIFIER_ID|" + relatedReference, 'IDENTIFIER', function (resRelatedReference) {
									if (resRelatedReference.err_code > 0) {
										myEmitter.emit('checkRelatedClaim');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Related reference id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkRelatedClaim');
							}
						})
						
						if (!validator.isEmpty(relatedRelationship)) {
							checkCode(apikey, relatedRelationship, 'RELATED_CLAIM_RELATIONSHIP', function (resRelatedRelationshipCode) {
								if (resRelatedRelationshipCode.err_code > 0) {
									myEmitter.emit('checkRelatedReference');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Related relationship code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkRelatedReference');
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
		claimCareTeam: function updateClaimCareTeam(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimId = req.params.claim_id;
			var claimCareTeamId = req.params.claim_care_team_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaim = {};
			//input check 
			if(typeof claimId !== 'undefined'){
				if(validator.isEmpty(claimId)){
					err_code = 2;
					err_msg = "Claim id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim id is required";
			}

			if(typeof claimCareTeamId !== 'undefined'){
				if(validator.isEmpty(claimCareTeamId)){
					err_code = 2;
					err_msg = "Claim CareTeam id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim CareTeam id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var careTeamSequence =  req.body.sequence.trim();
				if(validator.isEmpty(careTeamSequence)){
					err_code = 2;
					err_msg = "claim care team sequence is required.";
				}else{
					if(!validator.isInt(careTeamSequence)){
						err_code = 2;
						err_msg = "claim care team sequence is must be number.";
					}else{
						dataClaim.sequence = careTeamSequence;
					}
				}
			}else{
			  careTeamSequence = "";
			}

			if(typeof req.body.provider.practitioner !== 'undefined' && req.body.provider.practitioner !== ""){
				var careTeamProviderPractitioner =  req.body.provider.practitioner.trim().toLowerCase();
				if(validator.isEmpty(careTeamProviderPractitioner)){
					dataClaim.provider_practitioner = "";
				}else{
					dataClaim.provider_practitioner = careTeamProviderPractitioner;
				}
			}else{
			  careTeamProviderPractitioner = "";
			}

			if(typeof req.body.provider.organization !== 'undefined' && req.body.provider.organization !== ""){
				var careTeamProviderOrganization =  req.body.provider.organization.trim().toLowerCase();
				if(validator.isEmpty(careTeamProviderOrganization)){
					dataClaim.provider_organization = "";
				}else{
					dataClaim.provider_organization = careTeamProviderOrganization;
				}
			}else{
			  careTeamProviderOrganization = "";
			}

			if (typeof req.body.responsible !== 'undefined' && req.body.responsible !== "") {
			  var careTeamResponsible = req.body.responsible.trim().toLowerCase();
					if(validator.isEmpty(careTeamResponsible)){
						careTeamResponsible = "false";
					}
			  if(careTeamResponsible === "true" || careTeamResponsible === "false"){
					dataClaim.responsible = careTeamResponsible;
			  } else {
			    err_code = 2;
			    err_msg = "Claim care team responsible is must be boolean.";
			  }
			} else {
			  careTeamResponsible = "";
			}

			if(typeof req.body.role !== 'undefined' && req.body.role !== ""){
				var careTeamRole =  req.body.role.trim().toLowerCase();
				if(validator.isEmpty(careTeamRole)){
					dataClaim.role = "";
				}else{
					dataClaim.role = careTeamRole;
				}
			}else{
			  careTeamRole = "";
			}

			if(typeof req.body.qualification !== 'undefined' && req.body.qualification !== ""){
				var careTeamQualification =  req.body.qualification.trim().toLowerCase();
				if(validator.isEmpty(careTeamQualification)){
					dataClaim.qualification = "";
				}else{
					dataClaim.qualification = careTeamQualification;
				}
			}else{
			  careTeamQualification = "";
			}

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimID', function(){
							checkUniqeValue(apikey, "claim_id|" + claimId, 'claim', function(resClaimId){
								if(resClaimId.err_code > 0){
									checkUniqeValue(apikey, "care_team_id|" + claimCareTeamId, 'claim_care_team', function(resClaimCareTeamID){
										if(resClaimCareTeamID.err_code > 0){
											ApiFHIR.put('claimCareTeam', {"apikey": apikey, "_id": claimCareTeamId, "dr": "claim_id|"+claimId}, {body: dataClaim, json: true}, function(error, response, body){
												claimCareTeam = body;
												if(claimCareTeam.err_code > 0){
													res.json(claimCareTeam);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim careTeam has been update in this Claim.", "data": claimCareTeam.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim careTeam Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkCareTeamRole', function () {
							if (!validator.isEmpty(careTeamRole)) {
								checkCode(apikey, careTeamRole, 'CLAIM_CARETEAMROLE', function (resCareTeamRoleCode) {
									if (resCareTeamRoleCode.err_code > 0) {
										myEmitter.emit('checkClaimID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Care team role code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimID');
							}
						})

						myEmitter.prependOnceListener('checkCareTeamQualification', function () {
							if (!validator.isEmpty(careTeamQualification)) {
								checkCode(apikey, careTeamQualification, 'PROVIDER_QUALIFICATION', function (resCareTeamQualificationCode) {
									if (resCareTeamQualificationCode.err_code > 0) {
										myEmitter.emit('checkCareTeamRole');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Care team qualification code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCareTeamRole');
							}
						})
						
						myEmitter.prependOnceListener('checkCareTeamProviderPractitioner', function () {
							if (!validator.isEmpty(careTeamProviderPractitioner)) {
								checkUniqeValue(apikey, "PRACTITIONER_ID|" + careTeamProviderPractitioner, 'PRACTITIONER', function (resCareTeamProviderPractitioner) {
									if (resCareTeamProviderPractitioner.err_code > 0) {
										myEmitter.emit('checkCareTeamQualification');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Care team provider practitioner id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkCareTeamQualification');
							}
						})

						if (!validator.isEmpty(careTeamProviderOrganization)) {
							checkUniqeValue(apikey, "ORGANIZATION_ID|" + careTeamProviderOrganization, 'ORGANIZATION', function (resCareTeamProviderOrganization) {
								if (resCareTeamProviderOrganization.err_code > 0) {
									myEmitter.emit('checkCareTeamProviderPractitioner');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Care team provider organization id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCareTeamProviderPractitioner');
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
		claimInformation: function updateClaimInformation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimId = req.params.claim_id;
			var claimInformationId = req.params.claim_information_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaim = {};
			//input check 
			if(typeof claimId !== 'undefined'){
				if(validator.isEmpty(claimId)){
					err_code = 2;
					err_msg = "Claim id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim id is required";
			}

			if(typeof claimInformationId !== 'undefined'){
				if(validator.isEmpty(claimInformationId)){
					err_code = 2;
					err_msg = "Claim Information id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Information id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var informationSequence =  req.body.sequence.trim();
				if(validator.isEmpty(informationSequence)){
					err_code = 2;
					err_msg = "claim information sequence is required.";
				}else{
					if(!validator.isInt(informationSequence)){
						err_code = 2;
						err_msg = "claim information sequence is must be number.";
					}else{
						dataClaim.sequence = informationSequence;
					}
				}
			}else{
			  informationSequence = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var informationCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(informationCategory)){
					err_code = 2;
					err_msg = "claim information category is required.";
				}else{
					dataClaim.category = informationCategory;
				}
			}else{
			  informationCategory = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var informationCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(informationCode)){
					dataClaim.code = "";
				}else{
					dataClaim.code = informationCode;
				}
			}else{
			  informationCode = "";
			}

			if(typeof req.body.timing.timingDate !== 'undefined' && req.body.timing.timingDate !== ""){
				var informationTimingDate =  req.body.timing.timingDate;
				if(validator.isEmpty(informationTimingDate)){
					err_code = 2;
					err_msg = "claim information timing timing date is required.";
				}else{
					if(!regex.test(informationTimingDate)){
						err_code = 2;
						err_msg = "claim information timing timing date invalid date format.";	
					}else{
						dataClaim.timing_date = informationTimingDate;
					}
				}
			}else{
			  informationTimingDate = "";
			}

			if (typeof req.body.timing.timingPeriod !== 'undefined' && req.body.timing.timingPeriod !== "") {
			  var informationTimingPeriod = req.body.timing.timingPeriod;
			  if (informationTimingPeriod.indexOf("to") > 0) {
			    arrInformationTimingPeriod = informationTimingPeriod.split("to");
			    dataClaim.timing_period_start = arrInformationTimingPeriod[0];
			    dataClaim.timing_period_end = arrInformationTimingPeriod[1];
			    if (!regex.test(informationTimingPeriodStart) && !regex.test(informationTimingPeriodEnd)) {
			      err_code = 2;
			      err_msg = "claim information timing timing period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "claim information timing timing period invalid date format.";
				}
			} else {
			  informationTimingPeriod = "";
			}

			if(typeof req.body.value.valueString !== 'undefined' && req.body.value.valueString !== ""){
				var informationValueString =  req.body.value.valueString.trim().toLowerCase();
				if(validator.isEmpty(informationValueString)){
					dataClaim.value_string = "";
				}else{
					dataClaim.value_string = informationValueString;
				}
			}else{
			  informationValueString = "";
			}

			if(typeof req.body.value.valueQuantity !== 'undefined' && req.body.value.valueQuantity !== ""){
				var informationValueQuantity =  req.body.value.valueQuantity.trim().toLowerCase();
				if(validator.isEmpty(informationValueQuantity)){
					dataClaim.value_quantity = "";
				}else{
					dataClaim.value_quantity = informationValueQuantity;
				}
			}else{
			  informationValueQuantity = "";
			}

			/*if(typeof req.body.value.valueAttachment.contentType !== 'undefined' && req.body.value.valueAttachment.contentType !== ""){
				var informationValueAttachmentContentType =  req.body.value.valueAttachment.contentType.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentContentType)){
					dataClaim.content_type = "";
				}else{
					dataClaim.content_type = informationValueAttachmentContentType;
				}
			}else{
			  informationValueAttachmentContentType = "";
			}

			if(typeof req.body.value.valueAttachment.language !== 'undefined' && req.body.value.valueAttachment.language !== ""){
				var informationValueAttachmentLanguage =  req.body.value.valueAttachment.language.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentLanguage)){
					dataClaim.language = "";
				}else{
					dataClaim.language = informationValueAttachmentLanguage;
				}
			}else{
			  informationValueAttachmentLanguage = "";
			}

			if(typeof req.body.value.valueAttachment.data !== 'undefined' && req.body.value.valueAttachment.data !== ""){
				var informationValueAttachmentData =  req.body.value.valueAttachment.data.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentData)){
					dataClaim.data = "";
				}else{
					dataClaim.data = informationValueAttachmentData;
				}
			}else{
			  informationValueAttachmentData = "";
			}

			if(typeof req.body.value.valueAttachment.size !== 'undefined' && req.body.value.valueAttachment.size !== ""){
				var informationValueAttachmentSize =  req.body.value.valueAttachment.size.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentSize)){
					dataClaim.size = "";
				}else{
					dataClaim.size = informationValueAttachmentSize;
				}
			}else{
			  informationValueAttachmentSize = "";
			}

			if(typeof req.body.value.valueAttachment.title !== 'undefined' && req.body.value.valueAttachment.title !== ""){
				var informationValueAttachmentTitle =  req.body.value.valueAttachment.title.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentTitle)){
					dataClaim.title = "";
				}else{
					dataClaim.title = informationValueAttachmentTitle;
				}
			}else{
			  informationValueAttachmentTitle = "";
			}*/

			if(typeof req.body.value.valueReference !== 'undefined' && req.body.value.valueReference !== ""){
				var informationValueReference =  req.body.value.valueReference.trim().toLowerCase();
				if(validator.isEmpty(informationValueReference)){
					dataClaim.value_reference = "";
				}else{
					dataClaim.value_reference = informationValueReference;
				}
			}else{
			  informationValueReference = "";
			}

			if(typeof req.body.reason !== 'undefined' && req.body.reason !== ""){
				var informationReason =  req.body.reason.trim().toLowerCase();
				if(validator.isEmpty(informationReason)){
					dataClaim.reason = "";
				}else{
					dataClaim.reason = informationReason;
				}
			}else{
			  informationReason = "";
			}

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimID', function(){
							checkUniqeValue(apikey, "claim_id|" + claimId, 'claim', function(resClaimId){
								if(resClaimId.err_code > 0){
									checkUniqeValue(apikey, "information_id|" + claimInformationId, 'claim_information', function(resClaimInformationID){
										if(resClaimInformationID.err_code > 0){
											ApiFHIR.put('claimInformation', {"apikey": apikey, "_id": claimInformationId, "dr": "claim_id|"+claimId}, {body: dataClaim, json: true}, function(error, response, body){
												claimInformation = body;
												if(claimInformation.err_code > 0){
													res.json(claimInformation);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim information has been update in this Claim.", "data": claimInformation.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim information Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkInformationCategory', function () {
							if (!validator.isEmpty(informationCategory)) {
								checkCode(apikey, informationCategory, 'CLAIM_INFORMATIONCATEGORY', function (resInformationCategoryCode) {
									if (resInformationCategoryCode.err_code > 0) {
										myEmitter.emit('checkClaimID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Information category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimID');
							}
						})

						myEmitter.prependOnceListener('checkInformationCode', function () {
							if (!validator.isEmpty(informationCode)) {
								checkCode(apikey, informationCode, 'CLAIM_EXCEPTION', function (resInformationCodeCode) {
									if (resInformationCodeCode.err_code > 0) {
										myEmitter.emit('checkInformationCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Information code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInformationCategory');
							}
						})
						
						myEmitter.prependOnceListener('checkInformationValueAttachmentLanguage', function () {
							if (!validator.isEmpty(informationValueAttachmentLanguage)) {
								checkCode(apikey, informationValueAttachmentLanguage, 'LANGUAGES', function (resInformationValueAttachmentLanguageCode) {
									if (resInformationValueAttachmentLanguageCode.err_code > 0) {
										myEmitter.emit('checkInformationCode');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Information value attachment language code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInformationCode');
							}
						})

						myEmitter.prependOnceListener('checkInformationReason', function () {
							if (!validator.isEmpty(informationReason)) {
								checkCode(apikey, informationReason, 'MISSING_TOOTH_REASON', function (resInformationReasonCode) {
									if (resInformationReasonCode.err_code > 0) {
										myEmitter.emit('checkInformationValueAttachmentLanguage');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Information reason code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInformationValueAttachmentLanguage');
							}
						})


						
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
		/*tambah reference attachment information*/
		claimDiagnosis: function updateClaimDiagnosis(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimId = req.params.claim_id;
			var claimDiagnosisId = req.params.claim_diagnosis_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaim = {};
			//input check 
			if(typeof claimId !== 'undefined'){
				if(validator.isEmpty(claimId)){
					err_code = 2;
					err_msg = "Claim id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim id is required";
			}

			if(typeof claimDiagnosisId !== 'undefined'){
				if(validator.isEmpty(claimDiagnosisId)){
					err_code = 2;
					err_msg = "Claim Diagnosis id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Diagnosis id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var diagnosisSequence =  req.body.sequence.trim();
				if(validator.isEmpty(diagnosisSequence)){
					err_code = 2;
					err_msg = "claim diagnosis sequence is required.";
				}else{
					if(!validator.isInt(diagnosisSequence)){
						err_code = 2;
						err_msg = "claim diagnosis sequence is must be number.";
					}else{
						dataClaim.sequence = diagnosisSequence;
					}
				}
			}else{
			  diagnosisSequence = "";
			}

			if(typeof req.diagnosis.diagnosisCodeableConcept !== 'undefined' && req.diagnosis.diagnosisCodeableConcept !== ""){
				var diagnosisDiagnosisCodeableConcept =  req.diagnosis.diagnosisCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(diagnosisDiagnosisCodeableConcept)){
					err_code = 2;
					err_msg = "claim diagnosis diagnosis diagnosis codeable concept is required.";
				}else{
					dataClaim.diagnosis_codeable_concept = diagnosisDiagnosisCodeableConcept;
				}
			}else{
			  diagnosisDiagnosisCodeableConcept = "";
			}

			if(typeof req.diagnosis.diagnosisReference !== 'undefined' && req.diagnosis.diagnosisReference !== ""){
				var diagnosisDiagnosisReference =  req.diagnosis.diagnosisReference.trim().toLowerCase();
				if(validator.isEmpty(diagnosisDiagnosisReference)){
					dataClaim.diagnosis_reference = "";
				}else{
					dataClaim.diagnosis_reference = diagnosisDiagnosisReference;
				}
			}else{
			  diagnosisDiagnosisReference = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var diagnosisType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(diagnosisType)){
					dataClaim.type = "";
				}else{
					dataClaim.type = diagnosisType;
				}
			}else{
			  diagnosisType = "";
			}

			if(typeof req.body.packageCode !== 'undefined' && req.body.packageCode !== ""){
				var diagnosisPackageCode =  req.body.packageCode.trim().toLowerCase();
				if(validator.isEmpty(diagnosisPackageCode)){
					dataClaim.package_code = "";
				}else{
					dataClaim.package_code = diagnosisPackageCode;
				}
			}else{
			  diagnosisPackageCode = "";
			}

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimID', function(){
							checkUniqeValue(apikey, "claim_id|" + claimId, 'claim', function(resClaimId){
								if(resClaimId.err_code > 0){
									checkUniqeValue(apikey, "diagnosis_id|" + claimDiagnosisId, 'claim_diagnosis', function(resClaimDiagnosisID){
										if(resClaimDiagnosisID.err_code > 0){
											ApiFHIR.put('claimDiagnosis', {"apikey": apikey, "_id": claimDiagnosisId, "dr": "claim_id|"+claimId}, {body: dataClaim, json: true}, function(error, response, body){
												claimDiagnosis = body;
												if(claimDiagnosis.err_code > 0){
													res.json(claimDiagnosis);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim diagnosis has been update in this Claim.", "data": claimDiagnosis.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim diagnosis Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkDiagnosisDiagnosisCodeableConcept', function () {
							if (!validator.isEmpty(diagnosisDiagnosisCodeableConcept)) {
								checkCode(apikey, diagnosisDiagnosisCodeableConcept, 'ICD_10', function (resDiagnosisDiagnosisCodeableConceptCode) {
									if (resDiagnosisDiagnosisCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkInformationReason');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Diagnosis diagnosis codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkInformationReason');
							}
						})

						myEmitter.prependOnceListener('checkDiagnosisType', function () {
							if (!validator.isEmpty(diagnosisType)) {
								checkCode(apikey, diagnosisType, 'EX_DIAGNOSISTYPE', function (resDiagnosisTypeCode) {
									if (resDiagnosisTypeCode.err_code > 0) {
										myEmitter.emit('checkDiagnosisDiagnosisCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Diagnosis type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkDiagnosisDiagnosisCodeableConcept');
							}
						})

						myEmitter.prependOnceListener('checkDiagnosisPackageCode', function () {
							if (!validator.isEmpty(diagnosisPackageCode)) {
								checkCode(apikey, diagnosisPackageCode, 'EX_DIAGNOSISRELATEDGROUP', function (resDiagnosisPackageCodeCode) {
									if (resDiagnosisPackageCodeCode.err_code > 0) {
										myEmitter.emit('checkDiagnosisType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Diagnosis package code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkDiagnosisType');
							}
						})

						if (!validator.isEmpty(diagnosisDiagnosisReference)) {
							checkUniqeValue(apikey, "CONDITION_ID|" + diagnosisDiagnosisReference, 'CONDITION', function (resDiagnosisDiagnosisReference) {
								if (resDiagnosisDiagnosisReference.err_code > 0) {
									myEmitter.emit('checkCareTeamProviderOrganization');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Diagnosis diagnosis reference id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkCareTeamProviderOrganization');
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
		claimProcedure: function updateClaimProcedure(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimId = req.params.claim_id;
			var claimProcedureId = req.params.claim_procedure_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaim = {};
			//input check 
			if(typeof claimId !== 'undefined'){
				if(validator.isEmpty(claimId)){
					err_code = 2;
					err_msg = "Claim id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim id is required";
			}

			if(typeof claimProcedureId !== 'undefined'){
				if(validator.isEmpty(claimProcedureId)){
					err_code = 2;
					err_msg = "Claim Procedure id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Procedure id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var procedureSequence =  req.body.sequence.trim();
				if(validator.isEmpty(procedureSequence)){
					err_code = 2;
					err_msg = "claim procedure sequence is required.";
				}else{
					if(!validator.isInt(procedureSequence)){
						err_code = 2;
						err_msg = "claim procedure sequence is must be number.";
					}else{
						dataClaim.sequence = procedureSequence;
					}
				}
			}else{
			  procedureSequence = "";
			}

			if(typeof req.body.date !== 'undefined' && req.body.date !== ""){
				var procedureDate =  req.body.date;
				if(validator.isEmpty(procedureDate)){
					err_code = 2;
					err_msg = "claim procedure date is required.";
				}else{
					if(!regex.test(procedureDate)){
						err_code = 2;
						err_msg = "claim procedure date invalid date format.";	
					}else{
						dataClaim.date = procedureDate;
					}
				}
			}else{
			  procedureDate = "";
			}

			if(typeof req.procedure.procedureCodeableConcept !== 'undefined' && req.procedure.procedureCodeableConcept !== ""){
				var procedureProcedureCodeableConcept =  req.procedure.procedureCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(procedureProcedureCodeableConcept)){
					err_code = 2;
					err_msg = "claim procedure procedure procedure codeable concept is required.";
				}else{
					dataClaim.procedure_codeable_concept = procedureProcedureCodeableConcept;
				}
			}else{
			  procedureProcedureCodeableConcept = "";
			}

			if(typeof req.procedure.procedureReference !== 'undefined' && req.procedure.procedureReference !== ""){
				var procedureProcedureReference =  req.procedure.procedureReference.trim().toLowerCase();
				if(validator.isEmpty(procedureProcedureReference)){
					dataClaim.procedure_reference = "";
				}else{
					dataClaim.procedure_reference = procedureProcedureReference;
				}
			}else{
			  procedureProcedureReference = "";
			}

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimID', function(){
							checkUniqeValue(apikey, "claim_id|" + claimId, 'claim', function(resClaimId){
								if(resClaimId.err_code > 0){
									checkUniqeValue(apikey, "procedure_id|" + claimProcedureId, 'claim_procedure', function(resClaimProcedureID){
										if(resClaimProcedureID.err_code > 0){
											ApiFHIR.put('claimProcedure', {"apikey": apikey, "_id": claimProcedureId, "dr": "claim_id|"+claimId}, {body: dataClaim, json: true}, function(error, response, body){
												claimProcedure = body;
												if(claimProcedure.err_code > 0){
													res.json(claimProcedure);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim procedure has been update in this Claim.", "data": claimProcedure.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim procedure Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkProcedureProcedureCodeableConcept', function () {
							if (!validator.isEmpty(procedureProcedureCodeableConcept)) {
								checkCode(apikey, procedureProcedureCodeableConcept, 'ICD_10_PROCEDURES', function (resProcedureProcedureCodeableConceptCode) {
									if (resProcedureProcedureCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkClaimID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Procedure procedure codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimID');
							}
						})

						if (!validator.isEmpty(procedureProcedureReference)) {
							checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureProcedureReference, 'PROCEDURE', function (resProcedureProcedureReference) {
								if (resProcedureProcedureReference.err_code > 0) {
									myEmitter.emit('checkProcedureProcedureCodeableConcept');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Procedure procedure reference id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkProcedureProcedureCodeableConcept');
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
		claimInsurance: function updateClaimInsurance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimId = req.params.claim_id;
			var claimInsuranceId = req.params.claim_insurance_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaim = {};
			//input check 
			if(typeof claimId !== 'undefined'){
				if(validator.isEmpty(claimId)){
					err_code = 2;
					err_msg = "Claim id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim id is required";
			}

			if(typeof claimInsuranceId !== 'undefined'){
				if(validator.isEmpty(claimInsuranceId)){
					err_code = 2;
					err_msg = "Claim Insurance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Insurance id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var insuranceSequence =  req.body.sequence.trim().toLowerCase();
				if(validator.isEmpty(insuranceSequence)){
					err_code = 2;
					err_msg = "claim insurance sequence is required.";
				}else{
					dataClaim.sequence = insuranceSequence;
				}
			}else{
			  insuranceSequence = "";
			}

			if (typeof req.body.focal !== 'undefined' && req.body.focal !== "") {
			  var insuranceFocal = req.body.focal.trim().toLowerCase();
			  if(insuranceFocal === "true" || insuranceFocal === "false"){
					dataClaim.focal = insuranceFocal;
			  } else {
			    err_code = 2;
			    err_msg = "Claim insurance focal is must be boolean.";
			  }
			} else {
			  insuranceFocal = "";
			}

			if(typeof req.body.coverage !== 'undefined' && req.body.coverage !== ""){
				var insuranceCoverage =  req.body.coverage.trim().toLowerCase();
				if(validator.isEmpty(insuranceCoverage)){
					dataClaim.coverage = "";
				}else{
					dataClaim.coverage = insuranceCoverage;
				}
			}else{
			  insuranceCoverage = "";
			}

			if(typeof req.body.businessArrangement !== 'undefined' && req.body.businessArrangement !== ""){
				var insuranceBusinessArrangement =  req.body.businessArrangement.trim().toLowerCase();
				if(validator.isEmpty(insuranceBusinessArrangement)){
					dataClaim.business_arrangement = "";
				}else{
					dataClaim.business_arrangement = insuranceBusinessArrangement;
				}
			}else{
			  insuranceBusinessArrangement = "";
			}

			if(typeof req.body.preAuthRef !== 'undefined' && req.body.preAuthRef !== ""){
				var insurancePreAuthRef =  req.body.preAuthRef.trim().toLowerCase();
				if(validator.isEmpty(insurancePreAuthRef)){
					dataClaim.pre_auth_ref = "";
				}else{
					dataClaim.pre_auth_ref = insurancePreAuthRef;
				}
			}else{
			  insurancePreAuthRef = "";
			}

			if(typeof req.body.claimResponse !== 'undefined' && req.body.claimResponse !== ""){
				var insuranceClaimResponse =  req.body.claimResponse.trim().toLowerCase();
				if(validator.isEmpty(insuranceClaimResponse)){
					dataClaim.claim_response = "";
				}else{
					dataClaim.claim_response = insuranceClaimResponse;
				}
			}else{
			  insuranceClaimResponse = "";
			}

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimID', function(){
							checkUniqeValue(apikey, "claim_id|" + claimId, 'claim', function(resClaimId){
								if(resClaimId.err_code > 0){
									checkUniqeValue(apikey, "insurance_id|" + claimInsuranceId, 'claim_insurance', function(resClaimInsuranceID){
										if(resClaimInsuranceID.err_code > 0){
											ApiFHIR.put('claimInsurance', {"apikey": apikey, "_id": claimInsuranceId, "dr": "claim_id|"+claimId}, {body: dataClaim, json: true}, function(error, response, body){
												claimInsurance = body;
												if(claimInsurance.err_code > 0){
													res.json(claimInsurance);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim insurance has been update in this Claim.", "data": claimInsurance.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim insurance Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkInsuranceCoverage', function () {
							if (!validator.isEmpty(insuranceCoverage)) {
								checkUniqeValue(apikey, "COVERAGE_ID|" + insuranceCoverage, 'COVERAGE', function (resInsuranceCoverage) {
									if (resInsuranceCoverage.err_code > 0) {
										myEmitter.emit('checkProcedureProcedureReference');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Insurance coverage id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkProcedureProcedureReference');
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
		claimAccident: function updateClaimAccident(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimId = req.params.claim_id;
			var claimAccidentId = req.params.claim_accident_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaim = {};
			//input check 
			if(typeof claimId !== 'undefined'){
				if(validator.isEmpty(claimId)){
					err_code = 2;
					err_msg = "Claim id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim id is required";
			}

			if(typeof claimAccidentId !== 'undefined'){
				if(validator.isEmpty(claimAccidentId)){
					err_code = 2;
					err_msg = "Claim Accident id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Accident id is required";
			}
			
			if(typeof req.body.date !== 'undefined' && req.body.date !== ""){
				var accidentDate =  req.body.date;
				if(validator.isEmpty(accidentDate)){
					err_code = 2;
					err_msg = "claim accident date is required.";
				}else{
					if(!regex.test(accidentDate)){
						err_code = 2;
						err_msg = "claim accident date invalid date format.";	
					}else{
						dataClaim.date = accidentDate;
					}
				}
			}else{
			  accidentDate = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var accidentType =  req.body.type.trim().toUpperCase();
				if(validator.isEmpty(accidentType)){
					dataClaim.type = "";
				}else{
					dataClaim.type = accidentType;
				}
			}else{
			  accidentType = "";
			}

			if(typeof req.body.location.locationAddress.use !== 'undefined' && req.body.location.locationAddress.use !== ""){
				var accidentLocationAddressUse =  req.body.location.locationAddress.use.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressUse)){
					dataClaim.location_address_use = "";
				}else{
					dataClaim.location_address_use = accidentLocationAddressUse;
				}
			}else{
			  accidentLocationAddressUse = "";
			}

			if(typeof req.body.location.locationAddress.type !== 'undefined' && req.body.location.locationAddress.type !== ""){
				var accidentLocationAddressType =  req.body.location.locationAddress.type.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressType)){
					dataClaim.location_address_type = "";
				}else{
					dataClaim.location_address_type = accidentLocationAddressType;
				}
			}else{
			  accidentLocationAddressType = "";
			}

			if(typeof req.body.location.locationAddress.text !== 'undefined' && req.body.location.locationAddress.text !== ""){
				var accidentLocationAddressText =  req.body.location.locationAddress.text.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressText)){
					dataClaim.location_address_text = "";
				}else{
					dataClaim.location_address_text = accidentLocationAddressText;
				}
			}else{
			  accidentLocationAddressText = "";
			}

			if(typeof req.body.location.locationAddress.line !== 'undefined' && req.body.location.locationAddress.line !== ""){
				var accidentLocationAddressLine =  req.body.location.locationAddress.line.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressLine)){
					dataClaim.location_address_line = "";
				}else{
					dataClaim.location_address_line = accidentLocationAddressLine;
				}
			}else{
			  accidentLocationAddressLine = "";
			}

			if(typeof req.body.location.locationAddress.city !== 'undefined' && req.body.location.locationAddress.city !== ""){
				var accidentLocationAddressCity =  req.body.location.locationAddress.city.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressCity)){
					dataClaim.location_address_city = "";
				}else{
					dataClaim.location_address_city = accidentLocationAddressCity;
				}
			}else{
			  accidentLocationAddressCity = "";
			}

			if(typeof req.body.location.locationAddress.district !== 'undefined' && req.body.location.locationAddress.district !== ""){
				var accidentLocationAddressDistrict =  req.body.location.locationAddress.district.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressDistrict)){
					dataClaim.location_address_district = "";
				}else{
					dataClaim.location_address_district = accidentLocationAddressDistrict;
				}
			}else{
			  accidentLocationAddressDistrict = "";
			}

			if(typeof req.body.location.locationAddress.state !== 'undefined' && req.body.location.locationAddress.state !== ""){
				var accidentLocationAddressState =  req.body.location.locationAddress.state.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressState)){
					dataClaim.location_address_state = "";
				}else{
					dataClaim.location_address_state = accidentLocationAddressState;
				}
			}else{
			  accidentLocationAddressState = "";
			}

			if(typeof req.body.location.locationAddress.postalCode !== 'undefined' && req.body.location.locationAddress.postalCode !== ""){
				var accidentLocationAddressPostalCode =  req.body.location.locationAddress.postalCode.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressPostalCode)){
					dataClaim.location_address_postal_code = "";
				}else{
					dataClaim.location_address_postal_code = accidentLocationAddressPostalCode;
				}
			}else{
			  accidentLocationAddressPostalCode = "";
			}

			if(typeof req.body.location.locationAddress.country !== 'undefined' && req.body.location.locationAddress.country !== ""){
				var accidentLocationAddressCountry =  req.body.location.locationAddress.country.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressCountry)){
					dataClaim.location_address_country = "";
				}else{
					dataClaim.location_address_country = accidentLocationAddressCountry;
				}
			}else{
			  accidentLocationAddressCountry = "";
			}

			if (typeof req.body.location.locationAddress.period !== 'undefined' && req.body.location.locationAddress.period !== "") {
			  var accidentLocationAddressPeriod = req.body.location.locationAddress.period;
			  if (accidentLocationAddressPeriod.indexOf("to") > 0) {
			    arrAccidentLocationAddressPeriod = accidentLocationAddressPeriod.split("to");
			    dataClaim.location_address_period_start = arrAccidentLocationAddressPeriod[0];
			    dataClaim.location_address_period_end = arrAccidentLocationAddressPeriod[1];
			    if (!regex.test(accidentLocationAddressPeriodStart) && !regex.test(accidentLocationAddressPeriodEnd)) {
			      err_code = 2;
			      err_msg = "claim accident location location address period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "claim accident location location address period invalid date format.";
				}
			} else {
			  accidentLocationAddressPeriod = "";
			}

			if(typeof req.body.location.locationReference !== 'undefined' && req.body.location.locationReference !== ""){
				var accidentLocationReference =  req.body.location.locationReference.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationReference)){
					dataClaim.location_reference = "";
				}else{
					dataClaim.location_reference = accidentLocationReference;
				}
			}else{
			  accidentLocationReference = "";
			}

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimID', function(){
							checkUniqeValue(apikey, "claim_id|" + claimId, 'claim', function(resClaimId){
								if(resClaimId.err_code > 0){
									checkUniqeValue(apikey, "accident_id|" + claimAccidentId, 'claim_accident', function(resClaimAccidentID){
										if(resClaimAccidentID.err_code > 0){
											ApiFHIR.put('claimAccident', {"apikey": apikey, "_id": claimAccidentId, "dr": "claim_id|"+claimId}, {body: dataClaim, json: true}, function(error, response, body){
												claimAccident = body;
												if(claimAccident.err_code > 0){
													res.json(claimAccident);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim accident has been update in this Claim.", "data": claimAccident.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim accident Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkAccidentType', function () {
							if (!validator.isEmpty(accidentType)) {
								checkCode(apikey, accidentType, 'V3_ACTINCIDENTCODE', function (resAccidentTypeCode) {
									if (resAccidentTypeCode.err_code > 0) {
										myEmitter.emit('checkClaimID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Accident type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimID');
							}
						})
						
						if (!validator.isEmpty(accidentLocationReference)) {
							checkUniqeValue(apikey, "LOCATION_ID|" + accidentLocationReference, 'LOCATION', function (resAccidentLocationReference) {
								if (resAccidentLocationReference.err_code > 0) {
									myEmitter.emit('checkAccidentType');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Accident location reference id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkAccidentType');
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
		claimItem: function updateClaimItem(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimId = req.params.claim_id;
			var claimItemId = req.params.claim_item_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaim = {};
			//input check 
			if(typeof claimId !== 'undefined'){
				if(validator.isEmpty(claimId)){
					err_code = 2;
					err_msg = "Claim id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim id is required";
			}

			if(typeof claimItemId !== 'undefined'){
				if(validator.isEmpty(claimItemId)){
					err_code = 2;
					err_msg = "Claim Item id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Item id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var itemSequence =  req.body.sequence.trim();
				if(validator.isEmpty(itemSequence)){
					err_code = 2;
					err_msg = "claim item sequence is required.";
				}else{
					if(!validator.isInt(itemSequence)){
						err_code = 2;
						err_msg = "claim item sequence is must be number.";
					}else{
						dataClaim.sequence = itemSequence;
					}
				}
			}else{
			  itemSequence = "";
			}

			if(typeof req.body.careTeamLinkId !== 'undefined' && req.body.careTeamLinkId !== ""){
				var itemCareTeamLinkId =  req.body.careTeamLinkId.trim();
				if(validator.isEmpty(itemCareTeamLinkId)){
					dataClaim.care_team_link_id = "";
				}else{
					if(!validator.isInt(itemCareTeamLinkId)){
						err_code = 2;
						err_msg = "claim item care team link id is must be number.";
					}else{
						dataClaim.care_team_link_id = itemCareTeamLinkId;
					}
				}
			}else{
			  itemCareTeamLinkId = "";
			}

			if(typeof req.body.diagnosisLinkId !== 'undefined' && req.body.diagnosisLinkId !== ""){
				var itemDiagnosisLinkId =  req.body.diagnosisLinkId.trim();
				if(validator.isEmpty(itemDiagnosisLinkId)){
					dataClaim.diagnosis_link_id = "";
				}else{
					if(!validator.isInt(itemDiagnosisLinkId)){
						err_code = 2;
						err_msg = "claim item diagnosis link id is must be number.";
					}else{
						dataClaim.diagnosis_link_id = itemDiagnosisLinkId;
					}
				}
			}else{
			  itemDiagnosisLinkId = "";
			}

			if(typeof req.body.procedureLinkId !== 'undefined' && req.body.procedureLinkId !== ""){
				var itemProcedureLinkId =  req.body.procedureLinkId.trim();
				if(validator.isEmpty(itemProcedureLinkId)){
					dataClaim.procedure_link_id = "";
				}else{
					if(!validator.isInt(itemProcedureLinkId)){
						err_code = 2;
						err_msg = "claim item procedure link id is must be number.";
					}else{
						dataClaim.procedure_link_id = itemProcedureLinkId;
					}
				}
			}else{
			  itemProcedureLinkId = "";
			}

			if(typeof req.body.informationLinkId !== 'undefined' && req.body.informationLinkId !== ""){
				var itemInformationLinkId =  req.body.informationLinkId.trim();
				if(validator.isEmpty(itemInformationLinkId)){
					dataClaim.information_link_id = "";
				}else{
					if(!validator.isInt(itemInformationLinkId)){
						err_code = 2;
						err_msg = "claim item information link id is must be number.";
					}else{
						dataClaim.information_link_id = itemInformationLinkId;
					}
				}
			}else{
			  itemInformationLinkId = "";
			}

			if(typeof req.body.revenue !== 'undefined' && req.body.revenue !== ""){
				var itemRevenue =  req.body.revenue.trim().toLowerCase();
				if(validator.isEmpty(itemRevenue)){
					dataClaim.revenue = "";
				}else{
					dataClaim.revenue = itemRevenue;
				}
			}else{
			  itemRevenue = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var itemCategory =  req.body.category.trim().toUpperCase();
				if(validator.isEmpty(itemCategory)){
					dataClaim.category = "";
				}else{
					dataClaim.category = itemCategory;
				}
			}else{
			  itemCategory = "";
			}

			if(typeof req.body.service !== 'undefined' && req.body.service !== ""){
				var itemService =  req.body.service.trim().toLowerCase();
				if(validator.isEmpty(itemService)){
					dataClaim.service = "";
				}else{
					dataClaim.service = itemService;
				}
			}else{
			  itemService = "";
			}

			if(typeof req.body.modifier !== 'undefined' && req.body.modifier !== ""){
				var itemModifier =  req.body.modifier.trim().toLowerCase();
				if(validator.isEmpty(itemModifier)){
					dataClaim.modifier = "";
				}else{
					dataClaim.modifier = itemModifier;
				}
			}else{
			  itemModifier = "";
			}

			if(typeof req.body.programCode !== 'undefined' && req.body.programCode !== ""){
				var itemProgramCode =  req.body.programCode.trim().toLowerCase();
				if(validator.isEmpty(itemProgramCode)){
					dataClaim.program_code = "";
				}else{
					dataClaim.program_code = itemProgramCode;
				}
			}else{
			  itemProgramCode = "";
			}

			if(typeof req.body.serviced.servicedDate !== 'undefined' && req.body.serviced.servicedDate !== ""){
				var itemServicedDate =  req.body.serviced.servicedDate;
				if(validator.isEmpty(itemServicedDate)){
					err_code = 2;
					err_msg = "claim item serviced serviced date is required.";
				}else{
					if(!regex.test(itemServicedDate)){
						err_code = 2;
						err_msg = "claim item serviced serviced date invalid date format.";	
					}else{
						dataClaim.serviced_date = itemServicedDate;
					}
				}
			}else{
			  itemServicedDate = "";
			}

			if (typeof req.body.serviced.servicedPeriod !== 'undefined' && req.body.serviced.servicedPeriod !== "") {
			  var itemServicedPeriod = req.body.serviced.servicedPeriod;
			  if (itemServicedPeriod.indexOf("to") > 0) {
			    arrItemServicedPeriod = itemServicedPeriod.split("to");
			    dataClaim.serviced_period_start = arrItemServicedPeriod[0];
			    dataClaim.serviced_period_end = arrItemServicedPeriod[1];
			    if (!regex.test(itemServicedPeriodStart) && !regex.test(itemServicedPeriodEnd)) {
			      err_code = 2;
			      err_msg = "claim item serviced serviced period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "claim item serviced serviced period invalid date format.";
				}
			} else {
			  itemServicedPeriod = "";
			}

			if(typeof req.body.location.locationCodeableConcept !== 'undefined' && req.body.location.locationCodeableConcept !== ""){
				var itemLocationCodeableConcept =  req.body.location.locationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(itemLocationCodeableConcept)){
					dataClaim.location_codeable_concept = "";
				}else{
					dataClaim.location_codeable_concept = itemLocationCodeableConcept;
				}
			}else{
			  itemLocationCodeableConcept = "";
			}

			if(typeof req.body.location.locationAddress.use !== 'undefined' && req.body.location.locationAddress.use !== ""){
				var itemLocationAddressUse =  req.body.location.locationAddress.use.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressUse)){
					dataClaim.location_address_use = "";
				}else{
					dataClaim.location_address_use = itemLocationAddressUse;
				}
			}else{
			  itemLocationAddressUse = "";
			}

			if(typeof req.body.location.locationAddress.type !== 'undefined' && req.body.location.locationAddress.type !== ""){
				var itemLocationAddressType =  req.body.location.locationAddress.type.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressType)){
					dataClaim.location_address_type = "";
				}else{
					dataClaim.location_address_type = itemLocationAddressType;
				}
			}else{
			  itemLocationAddressType = "";
			}

			if(typeof req.body.location.locationAddress.text !== 'undefined' && req.body.location.locationAddress.text !== ""){
				var itemLocationAddressText =  req.body.location.locationAddress.text.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressText)){
					dataClaim.location_address_text = "";
				}else{
					dataClaim.location_address_text = itemLocationAddressText;
				}
			}else{
			  itemLocationAddressText = "";
			}

			if(typeof req.body.location.locationAddress.line !== 'undefined' && req.body.location.locationAddress.line !== ""){
				var itemLocationAddressLine =  req.body.location.locationAddress.line.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressLine)){
					dataClaim.location_address_line = "";
				}else{
					dataClaim.location_address_line = itemLocationAddressLine;
				}
			}else{
			  itemLocationAddressLine = "";
			}

			if(typeof req.body.location.locationAddress.city !== 'undefined' && req.body.location.locationAddress.city !== ""){
				var itemLocationAddressCity =  req.body.location.locationAddress.city.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressCity)){
					dataClaim.location_address_city = "";
				}else{
					dataClaim.location_address_city = itemLocationAddressCity;
				}
			}else{
			  itemLocationAddressCity = "";
			}

			if(typeof req.body.location.locationAddress.district !== 'undefined' && req.body.location.locationAddress.district !== ""){
				var itemLocationAddressDistrict =  req.body.location.locationAddress.district.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressDistrict)){
					dataClaim.location_address_district = "";
				}else{
					dataClaim.location_address_district = itemLocationAddressDistrict;
				}
			}else{
			  itemLocationAddressDistrict = "";
			}

			if(typeof req.body.location.locationAddress.state !== 'undefined' && req.body.location.locationAddress.state !== ""){
				var itemLocationAddressState =  req.body.location.locationAddress.state.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressState)){
					dataClaim.location_address_state = "";
				}else{
					dataClaim.location_address_state = itemLocationAddressState;
				}
			}else{
			  itemLocationAddressState = "";
			}

			if(typeof req.body.location.locationAddress.postalCode !== 'undefined' && req.body.location.locationAddress.postalCode !== ""){
				var itemLocationAddressPostalCode =  req.body.location.locationAddress.postalCode.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressPostalCode)){
					dataClaim.location_address_postal_code = "";
				}else{
					dataClaim.location_address_postal_code = itemLocationAddressPostalCode;
				}
			}else{
			  itemLocationAddressPostalCode = "";
			}

			if(typeof req.body.location.locationAddress.country !== 'undefined' && req.body.location.locationAddress.country !== ""){
				var itemLocationAddressCountry =  req.body.location.locationAddress.country.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressCountry)){
					dataClaim.location_address_country = "";
				}else{
					dataClaim.location_address_country = itemLocationAddressCountry;
				}
			}else{
			  itemLocationAddressCountry = "";
			}

			if (typeof req.body.location.locationAddress.period !== 'undefined' && req.body.location.locationAddress.period !== "") {
			  var itemLocationAddressPeriod = req.body.location.locationAddress.period;
			  if (itemLocationAddressPeriod.indexOf("to") > 0) {
			    arrItemLocationAddressPeriod = itemLocationAddressPeriod.split("to");
			    dataClaim.location_address_period_start = arrItemLocationAddressPeriod[0];
			    dataClaim.location_address_period_end = arrItemLocationAddressPeriod[1];
			    if (!regex.test(itemLocationAddressPeriodStart) && !regex.test(itemLocationAddressPeriodEnd)) {
			      err_code = 2;
			      err_msg = "claim item location location address period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "claim item location location address period invalid date format.";
				}
			} else {
			  itemLocationAddressPeriod = "";
			}

			if(typeof req.body.location.locationReference !== 'undefined' && req.body.location.locationReference !== ""){
				var itemLocationReference =  req.body.location.locationReference.trim().toLowerCase();
				if(validator.isEmpty(itemLocationReference)){
					dataClaim.location_reference = "";
				}else{
					dataClaim.location_reference = itemLocationReference;
				}
			}else{
			  itemLocationReference = "";
			}

			if(typeof req.body.quantity !== 'undefined' && req.body.quantity !== ""){
				var itemQuantity =  req.body.quantity.trim();
				if(validator.isEmpty(itemQuantity)){
					dataClaim.quantity = "";
				}else{
					if(!validator.isInt(itemQuantity)){
						err_code = 2;
						err_msg = "claim item quantity is must be number.";
					}else{
						dataClaim.quantity = itemQuantity;
					}
				}
			}else{
			  itemQuantity = "";
			}

			if(typeof req.body.unitPrice !== 'undefined' && req.body.unitPrice !== ""){
				var itemUnitPrice =  req.body.unitPrice.trim().toLowerCase();
				if(validator.isEmpty(itemUnitPrice)){
					dataClaim.unit_price = "";
				}else{
					dataClaim.unit_price = itemUnitPrice;
				}
			}else{
			  itemUnitPrice = "";
			}

			if(typeof req.body.factor !== 'undefined' && req.body.factor !== ""){
				var itemFactor =  req.body.factor.trim();
				if(validator.isEmpty(itemFactor)){
					dataClaim.factor = "";
				}else{
					if(!validator.isInt(itemFactor)){
						err_code = 2;
						err_msg = "claim item factor is must be number.";
					}else{
						dataClaim.factor = itemFactor;
					}
				}
			}else{
			  itemFactor = "";
			}

			if(typeof req.body.net !== 'undefined' && req.body.net !== ""){
				var itemNet =  req.body.net.trim();
				if(validator.isEmpty(itemNet)){
					dataClaim.net = "";
				}else{
					if(!validator.isInt(itemNet)){
						err_code = 2;
						err_msg = "claim item net is must be number.";
					}else{
						dataClaim.net = itemNet;
					}
				}
			}else{
			  itemNet = "";
			}

			/*if(typeof req.body.udi !== 'undefined' && req.body.udi !== ""){
				var itemUdi =  req.body.udi.trim().toLowerCase();
				if(validator.isEmpty(itemUdi)){
					dataClaim.udi = "";
				}else{
					dataClaim.udi = itemUdi;
				}
			}else{
			  itemUdi = "";
			}*/

			if(typeof req.body.bodySite !== 'undefined' && req.body.bodySite !== ""){
				var itemBodySite =  req.body.bodySite.trim().toLowerCase();
				if(validator.isEmpty(itemBodySite)){
					dataClaim.body_site = "";
				}else{
					dataClaim.body_site = itemBodySite;
				}
			}else{
			  itemBodySite = "";
			}

			if(typeof req.body.subSite !== 'undefined' && req.body.subSite !== ""){
				var itemSubSite =  req.body.subSite.trim().toUpperCase();
				if(validator.isEmpty(itemSubSite)){
					dataClaim.sub_site = "";
				}else{
					dataClaim.sub_site = itemSubSite;
				}
			}else{
			  itemSubSite = "";
			}

			/*if(typeof req.body.encounter !== 'undefined' && req.body.encounter !== ""){
				var itemEncounter =  req.body.encounter.trim().toLowerCase();
				if(validator.isEmpty(itemEncounter)){
					dataClaim.encounter = "";
				}else{
					dataClaim.encounter = itemEncounter;
				}
			}else{
			  itemEncounter = "";
			}*/

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimID', function(){
							checkUniqeValue(apikey, "claim_id|" + claimId, 'claim', function(resClaimId){
								if(resClaimId.err_code > 0){
									checkUniqeValue(apikey, "item_id|" + claimItemId, 'claim_item', function(resClaimItemID){
										if(resClaimItemID.err_code > 0){
											ApiFHIR.put('claimItem', {"apikey": apikey, "_id": claimItemId, "dr": "claim_id|"+claimId}, {body: dataClaim, json: true}, function(error, response, body){
												claimItem = body;
												if(claimItem.err_code > 0){
													res.json(claimItem);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim item has been update in this Claim.", "data": claimItem.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim item Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Id not found"});		
								}
							})
						})
						
						/*_________*/
						myEmitter.prependOnceListener('checkItemRevenue', function () {
							if (!validator.isEmpty(itemRevenue)) {
								checkCode(apikey, itemRevenue, 'EX_REVENUE_CENTER', function (resItemRevenueCode) {
									if (resItemRevenueCode.err_code > 0) {
										myEmitter.emit('checkClaimID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item revenue code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimID');
							}
						})

						myEmitter.prependOnceListener('checkItemCategory', function () {
							if (!validator.isEmpty(itemCategory)) {
								checkCode(apikey, itemCategory, 'BENEFIT_SUBCATEGORY', function (resItemCategoryCode) {
									if (resItemCategoryCode.err_code > 0) {
										myEmitter.emit('checkItemRevenue');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemRevenue');
							}
						})

						myEmitter.prependOnceListener('checkItemService', function () {
							if (!validator.isEmpty(itemService)) {
								checkCode(apikey, itemService, 'SERVICE_USCLS', function (resItemServiceCode) {
									if (resItemServiceCode.err_code > 0) {
										myEmitter.emit('checkItemCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item service code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemCategory');
							}
						})

						myEmitter.prependOnceListener('checkItemModifier', function () {
							if (!validator.isEmpty(itemModifier)) {
								checkCode(apikey, itemModifier, 'CLAIM_MODIFIERS', function (resItemModifierCode) {
									if (resItemModifierCode.err_code > 0) {
										myEmitter.emit('checkItemService');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item modifier code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemService');
							}
						})

						myEmitter.prependOnceListener('checkItemProgramCode', function () {
							if (!validator.isEmpty(itemProgramCode)) {
								checkCode(apikey, itemProgramCode, 'EX_PROGRAM_CODE', function (resItemProgramCodeCode) {
									if (resItemProgramCodeCode.err_code > 0) {
										myEmitter.emit('checkItemModifier');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item program code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemModifier');
							}
						})

						myEmitter.prependOnceListener('checkItemLocationCodeableConcept', function () {
							if (!validator.isEmpty(itemLocationCodeableConcept)) {
								checkCode(apikey, itemLocationCodeableConcept, 'SERVICE_PLACE', function (resItemLocationCodeableConceptCode) {
									if (resItemLocationCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkItemProgramCode');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item location codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemProgramCode');
							}
						})

						myEmitter.prependOnceListener('checkItemBodySite', function () {
							if (!validator.isEmpty(itemBodySite)) {
								checkCode(apikey, itemBodySite, 'TOOTH', function (resItemBodySiteCode) {
									if (resItemBodySiteCode.err_code > 0) {
										myEmitter.emit('checkItemLocationCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item body site code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemLocationCodeableConcept');
							}
						})

						myEmitter.prependOnceListener('checkItemSubSite', function () {
							if (!validator.isEmpty(itemSubSite)) {
								checkCode(apikey, itemSubSite, 'SURFACE', function (resItemSubSiteCode) {
									if (resItemSubSiteCode.err_code > 0) {
										myEmitter.emit('checkItemBodySite');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item sub site code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemBodySite');
							}
						})

						if (!validator.isEmpty(itemLocationReference)) {
							checkUniqeValue(apikey, "LOCATION_ID|" + itemLocationReference, 'LOCATION', function (resItemLocationReference) {
								if (resItemLocationReference.err_code > 0) {
									myEmitter.emit('checkItemSubSite');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Item location reference id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkItemSubSite');
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
		claimDetail: function updateClaimDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimItemId = req.params.claim_item_id;
			var claimDetailId = req.params.claim_item_detail_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaim = {};
			//input check 
			if(typeof claimItemId !== 'undefined'){
				if(validator.isEmpty(claimItemId)){
					err_code = 2;
					err_msg = "Claim Item id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Item id is required";
			}

			if(typeof claimDetailId !== 'undefined'){
				if(validator.isEmpty(claimDetailId)){
					err_code = 2;
					err_msg = "Claim Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Detail id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var itemDetailSequence =  req.body.sequence.trim();
				if(validator.isEmpty(itemDetailSequence)){
					err_code = 2;
					err_msg = "claim item detail sequence is required.";
				}else{
					if(!validator.isInt(itemDetailSequence)){
						err_code = 2;
						err_msg = "claim item detail sequence is must be number.";
					}else{
						dataClaim.sequence = itemDetailSequence;
					}
				}
			}else{
			  itemDetailSequence = "";
			}

			if(typeof req.body.revenue !== 'undefined' && req.body.revenue !== ""){
				var itemDetailRevenue =  req.body.revenue.trim().toLowerCase();
				if(validator.isEmpty(itemDetailRevenue)){
					dataClaim.revenue = "";
				}else{
					dataClaim.revenue = itemDetailRevenue;
				}
			}else{
			  itemDetailRevenue = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var itemDetailCategory =  req.body.category.trim().toUpperCase();
				if(validator.isEmpty(itemDetailCategory)){
					dataClaim.category = "";
				}else{
					dataClaim.category = itemDetailCategory;
				}
			}else{
			  itemDetailCategory = "";
			}

			if(typeof req.body.service !== 'undefined' && req.body.service !== ""){
				var itemDetailService =  req.body.service.trim().toLowerCase();
				if(validator.isEmpty(itemDetailService)){
					dataClaim.service = "";
				}else{
					dataClaim.service = itemDetailService;
				}
			}else{
			  itemDetailService = "";
			}

			if(typeof req.body.modifier !== 'undefined' && req.body.modifier !== ""){
				var itemDetailModifier =  req.body.modifier.trim().toLowerCase();
				if(validator.isEmpty(itemDetailModifier)){
					dataClaim.modifier = "";
				}else{
					dataClaim.modifier = itemDetailModifier;
				}
			}else{
			  itemDetailModifier = "";
			}

			if(typeof req.body.programCode !== 'undefined' && req.body.programCode !== ""){
				var itemDetailProgramCode =  req.body.programCode.trim().toLowerCase();
				if(validator.isEmpty(itemDetailProgramCode)){
					dataClaim.program_code = "";
				}else{
					dataClaim.program_code = itemDetailProgramCode;
				}
			}else{
			  itemDetailProgramCode = "";
			}

			if(typeof req.body.quantity !== 'undefined' && req.body.quantity !== ""){
				var itemDetailQuantity =  req.body.quantity.trim();
				if(validator.isEmpty(itemDetailQuantity)){
					dataClaim.quantity = "";
				}else{
					if(!validator.isInt(itemDetailQuantity)){
						err_code = 2;
						err_msg = "claim item detail quantity is must be number.";
					}else{
						dataClaim.quantity = itemDetailQuantity;
					}
				}
			}else{
			  itemDetailQuantity = "";
			}

			if(typeof req.body.unitPrice !== 'undefined' && req.body.unitPrice !== ""){
				var itemDetailUnitPrice =  req.body.unitPrice.trim().toLowerCase();
				if(validator.isEmpty(itemDetailUnitPrice)){
					dataClaim.unit_price = "";
				}else{
					dataClaim.unit_price = itemDetailUnitPrice;
				}
			}else{
			  itemDetailUnitPrice = "";
			}

			if(typeof req.body.factor !== 'undefined' && req.body.factor !== ""){
				var itemDetailFactor =  req.body.factor.trim();
				if(validator.isEmpty(itemDetailFactor)){
					dataClaim.factor = "";
				}else{
					if(!validator.isInt(itemDetailFactor)){
						err_code = 2;
						err_msg = "claim item detail factor is must be number.";
					}else{
						dataClaim.factor = itemDetailFactor;
					}
				}
			}else{
			  itemDetailFactor = "";
			}

			if(typeof req.body.net !== 'undefined' && req.body.net !== ""){
				var itemDetailNet =  req.body.net.trim().toLowerCase();
				if(validator.isEmpty(itemDetailNet)){
					dataClaim.net = "";
				}else{
					dataClaim.net = itemDetailNet;
				}
			}else{
			  itemDetailNet = "";
			}

			/*if(typeof req.body.udi !== 'undefined' && req.body.udi !== ""){
				var itemDetailUdi =  req.body.udi.trim().toLowerCase();
				if(validator.isEmpty(itemDetailUdi)){
					dataClaim.udi = "";
				}else{
					dataClaim.udi = itemDetailUdi;
				}
			}else{
			  itemDetailUdi = "";
			}*/

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimID', function(){
							checkUniqeValue(apikey, "item_id|" + claimId, 'claim_item', function(resClaimId){
								if(resClaimId.err_code > 0){
									checkUniqeValue(apikey, "detail_id|" + claimDetailId, 'claim_detail', function(resClaimDetailID){
										if(resClaimDetailID.err_code > 0){
											ApiFHIR.put('claimDetail', {"apikey": apikey, "_id": claimDetailId, "dr": "item_id|"+claimId}, {body: dataClaim, json: true}, function(error, response, body){
												claimDetail = body;
												if(claimDetail.err_code > 0){
													res.json(claimDetail);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim item detail has been update in this Claim.", "data": claimDetail.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim item detail Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Item Id not found"});		
								}
							})
						})
						
						/*---------*/
						myEmitter.prependOnceListener('checkItemDetailRevenue', function () {
							if (!validator.isEmpty(itemDetailRevenue)) {
								checkCode(apikey, itemDetailRevenue, 'EX_REVENUE_CENTER', function (resItemDetailRevenueCode) {
									if (resItemDetailRevenueCode.err_code > 0) {
										myEmitter.emit('checkClaimID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item detail revenue code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimID');
							}
						})

						myEmitter.prependOnceListener('checkItemDetailCategory', function () {
							if (!validator.isEmpty(itemDetailCategory)) {
								checkCode(apikey, itemDetailCategory, 'BENEFIT_SUBCATEGORY', function (resItemDetailCategoryCode) {
									if (resItemDetailCategoryCode.err_code > 0) {
										myEmitter.emit('checkItemDetailRevenue');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item detail category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemDetailRevenue');
							}
						})

						myEmitter.prependOnceListener('checkItemDetailService', function () {
							if (!validator.isEmpty(itemDetailService)) {
								checkCode(apikey, itemDetailService, 'SERVICE_USCLS', function (resItemDetailServiceCode) {
									if (resItemDetailServiceCode.err_code > 0) {
										myEmitter.emit('checkItemDetailCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item detail service code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemDetailCategory');
							}
						})

						myEmitter.prependOnceListener('checkItemDetailModifier', function () {
							if (!validator.isEmpty(itemDetailModifier)) {
								checkCode(apikey, itemDetailModifier, 'CLAIM_MODIFIERS', function (resItemDetailModifierCode) {
									if (resItemDetailModifierCode.err_code > 0) {
										myEmitter.emit('checkItemDetailService');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item detail modifier code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemDetailService');
							}
						})

						myEmitter.prependOnceListener('checkItemDetailProgramCode', function () {
							if (!validator.isEmpty(itemDetailProgramCode)) {
								checkCode(apikey, itemDetailProgramCode, 'EX_PROGRAM_CODE', function (resItemDetailProgramCodeCode) {
									if (resItemDetailProgramCodeCode.err_code > 0) {
										myEmitter.emit('checkItemDetailModifier');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item detail program code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemDetailModifier');
							}
						})

						
						
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
		claimSubDetail: function updateClaimSubDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var claimDetailId = req.params.claim_item_detail_id;
			var claimSubDetailId = req.params.claim_item_sub_detail_id;

			var err_code = 0;
			var err_msg = "";
			var dataClaim = {};
			//input check 
			if(typeof claimDetailId !== 'undefined'){
				if(validator.isEmpty(claimDetailId)){
					err_code = 2;
					err_msg = "Claim Item Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Item Detail id is required";
			}

			if(typeof claimSubDetailId !== 'undefined'){
				if(validator.isEmpty(claimSubDetailId)){
					err_code = 2;
					err_msg = "Claim Item Sub Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Claim Item Sub Detail id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var itemSubDetailSequence =  req.body.sequence.trim();
				if(validator.isEmpty(itemSubDetailSequence)){
					err_code = 2;
					err_msg = "claim item detail sub detail sequence is required.";
				}else{
					if(!validator.isInt(itemSubDetailSequence)){
						err_code = 2;
						err_msg = "claim item detail sub detail sequence is must be number.";
					}else{
						dataClaim.sequence = itemSubDetailSequence;
					}
				}
			}else{
			  itemSubDetailSequence = "";
			}

			if(typeof req.body.revenue !== 'undefined' && req.body.revenue !== ""){
				var itemSubDetailRevenue =  req.body.revenue.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailRevenue)){
					dataClaim.revenue = "";
				}else{
					dataClaim.revenue = itemSubDetailRevenue;
				}
			}else{
			  itemSubDetailRevenue = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var itemSubDetailCategory =  req.body.category.trim().toUpperCase();
				if(validator.isEmpty(itemSubDetailCategory)){
					dataClaim.category = "";
				}else{
					dataClaim.category = itemSubDetailCategory;
				}
			}else{
			  itemSubDetailCategory = "";
			}

			if(typeof req.body.service !== 'undefined' && req.body.service !== ""){
				var itemSubDetailService =  req.body.service.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailService)){
					dataClaim.service = "";
				}else{
					dataClaim.service = itemSubDetailService;
				}
			}else{
			  itemSubDetailService = "";
			}

			if(typeof req.body.modifier !== 'undefined' && req.body.modifier !== ""){
				var itemSubDetailModifier =  req.body.modifier.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailModifier)){
					dataClaim.modifier = "";
				}else{
					dataClaim.modifier = itemSubDetailModifier;
				}
			}else{
			  itemSubDetailModifier = "";
			}

			if(typeof req.body.programCode !== 'undefined' && req.body.programCode !== ""){
				var itemSubDetailProgramCode =  req.body.programCode.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailProgramCode)){
					dataClaim.program_code = "";
				}else{
					dataClaim.program_code = itemSubDetailProgramCode;
				}
			}else{
			  itemSubDetailProgramCode = "";
			}

			if(typeof req.body.quantity !== 'undefined' && req.body.quantity !== ""){
				var itemSubDetailQuantity =  req.body.quantity.trim();
				if(validator.isEmpty(itemSubDetailQuantity)){
					dataClaim.quantity = "";
				}else{
					if(!validator.isInt(itemSubDetailQuantity)){
						err_code = 2;
						err_msg = "claim item detail sub detail quantity is must be number.";
					}else{
						dataClaim.quantity = itemSubDetailQuantity;
					}
				}
			}else{
			  itemSubDetailQuantity = "";
			}

			if(typeof req.body.unitPrice !== 'undefined' && req.body.unitPrice !== ""){
				var itemSubDetailUnitPrice =  req.body.unitPrice.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailUnitPrice)){
					dataClaim.unit_price = "";
				}else{
					dataClaim.unit_price = itemSubDetailUnitPrice;
				}
			}else{
			  itemSubDetailUnitPrice = "";
			}

			if(typeof req.body.factor !== 'undefined' && req.body.factor !== ""){
				var itemSubDetailFactor =  req.body.factor.trim();
				if(validator.isEmpty(itemSubDetailFactor)){
					dataClaim.factor = "";
				}else{
					if(!validator.isInt(itemSubDetailFactor)){
						err_code = 2;
						err_msg = "claim item detail sub detail factor is must be number.";
					}else{
						dataClaim.factor = itemSubDetailFactor;
					}
				}
			}else{
			  itemSubDetailFactor = "";
			}

			if(typeof req.body.net !== 'undefined' && req.body.net !== ""){
				var itemSubDetailNet =  req.body.net.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailNet)){
					dataClaim.net = "";
				}else{
					dataClaim.net = itemSubDetailNet;
				}
			}else{
			  itemSubDetailNet = "";
			}

			/*if(typeof req.body.udi !== 'undefined' && req.body.udi !== ""){
				var itemSubDetailUdi =  req.body.udi.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailUdi)){
					dataClaim.udi = "";
				}else{
					dataClaim.udi = itemSubDetailUdi;
				}
			}else{
			  itemSubDetailUdi = "";
			}*/

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkClaimID', function(){
							checkUniqeValue(apikey, "detail_id|" + claimDetailId, 'claim_detail', function(resClaimId){
								if(resClaimId.err_code > 0){
									checkUniqeValue(apikey, "sub_detail_id|" + claimSubDetailId, 'claim_sub_detail', function(resClaimSubDetailID){
										if(resClaimSubDetailID.err_code > 0){
											ApiFHIR.put('claimSubDetail', {"apikey": apikey, "_id": claimSubDetailId, "dr": "claim_id|"+claimDetailId}, {body: dataClaim, json: true}, function(error, response, body){
												claimSubDetail = body;
												if(claimSubDetail.err_code > 0){
													res.json(claimSubDetail);	
												}else{
													res.json({"err_code": 0, "err_msg": "Claim subDetail has been update in this Claim.", "data": claimSubDetail.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Claim subDetail Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Claim Id not found"});		
								}
							})
						})
						
						/*---------*/
						myEmitter.prependOnceListener('checkItemSubDetailRevenue', function () {
							if (!validator.isEmpty(itemSubDetailRevenue)) {
								checkCode(apikey, itemSubDetailRevenue, 'EX_REVENUE_CENTER', function (resItemSubDetailRevenueCode) {
									if (resItemSubDetailRevenueCode.err_code > 0) {
										myEmitter.emit('checkClaimID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item sub detail revenue code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimID');
							}
						})

						myEmitter.prependOnceListener('checkItemSubDetailCategory', function () {
							if (!validator.isEmpty(itemSubDetailCategory)) {
								checkCode(apikey, itemSubDetailCategory, 'BENEFIT_SUBCATEGORY', function (resItemSubDetailCategoryCode) {
									if (resItemSubDetailCategoryCode.err_code > 0) {
										myEmitter.emit('checkItemSubDetailRevenue');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item sub detail category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemSubDetailRevenue');
							}
						})

						myEmitter.prependOnceListener('checkItemSubDetailService', function () {
							if (!validator.isEmpty(itemSubDetailService)) {
								checkCode(apikey, itemSubDetailService, 'SERVICE_USCLS', function (resItemSubDetailServiceCode) {
									if (resItemSubDetailServiceCode.err_code > 0) {
										myEmitter.emit('checkItemSubDetailCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item sub detail service code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemSubDetailCategory');
							}
						})

						myEmitter.prependOnceListener('checkItemSubDetailModifier', function () {
							if (!validator.isEmpty(itemSubDetailModifier)) {
								checkCode(apikey, itemSubDetailModifier, 'CLAIM_MODIFIERS', function (resItemSubDetailModifierCode) {
									if (resItemSubDetailModifierCode.err_code > 0) {
										myEmitter.emit('checkItemSubDetailService');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item sub detail modifier code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemSubDetailService');
							}
						})

						myEmitter.prependOnceListener('checkItemSubDetailProgramCode', function () {
							if (!validator.isEmpty(itemSubDetailProgramCode)) {
								checkCode(apikey, itemSubDetailProgramCode, 'EX_PROGRAM_CODE', function (resItemSubDetailProgramCodeCode) {
									if (resItemSubDetailProgramCodeCode.err_code > 0) {
										myEmitter.emit('checkItemSubDetailModifier');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item sub detail program code code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemSubDetailModifier');
							}
						})
						
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
