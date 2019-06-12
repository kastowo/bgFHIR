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
		explanationOfBenefit: function getExplanationOfBenefit(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var qString = {};
			var explanationOfBenefitId = req.query._id;
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
			
			if (typeof explanationOfBenefitId !== 'undefined') {
        if (!validator.isEmpty(explanationOfBenefitId)) {
          qString._id = explanationOfBenefitId;
        } else {
          res.json({
            "err_code": 1,
            "err_msg": "Explanation Of Benefit ID is required."
          })
        }
      }
			
			var claim = req.query.claim;
			var coverage = req.query.coverage;
			var created = req.query.created;
			var disposition = req.query.disposition;
			var encounter = req.query.encounter;
			var enterer = req.query.enterer;
			var facility = req.query.facility;
			var identifier = req.query.identifier;
			var organization = req.query.organization;
			var patient = req.query.patient;
			var payee = req.query.payee;
			var provider = req.query.provider;

			if(typeof care_team !== 'undefined'){
				if(!validator.isEmpty(care_team)){
					qString.care_team = care_team; 
				}else{
					res.json({"err_code": 1, "err_msg": "Care team is empty."});
				}
			}

			if(typeof claim !== 'undefined'){
				if(!validator.isEmpty(claim)){
					qString.claim = claim; 
				}else{
					res.json({"err_code": 1, "err_msg": "Claim is empty."});
				}
			}

			if(typeof coverage !== 'undefined'){
				if(!validator.isEmpty(coverage)){
					qString.coverage = coverage; 
				}else{
					res.json({"err_code": 1, "err_msg": "Coverage is empty."});
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

			if(typeof disposition !== 'undefined'){
				if(!validator.isEmpty(disposition)){
					qString.disposition = disposition; 
				}else{
					res.json({"err_code": 1, "err_msg": "Disposition is empty."});
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

			if(typeof provider !== 'undefined'){
				if(!validator.isEmpty(provider)){
					qString.provider = provider; 
				}else{
					res.json({"err_code": 1, "err_msg": "Provider is empty."});
				}
			}
			
			seedPhoenixFHIR.path.GET = {
        "ExplanationOfBenefit": {
          "location": "%(apikey)s/ExplanationOfBenefit",
          "query": qString
        }
      }
      var ApiFHIR = new Apiclient(seedPhoenixFHIR);
			
			checkApikey(apikey, ipAddres, function (result) {
				if (result.err_code == 0) {
					ApiFHIR.get('ExplanationOfBenefit', {
            "apikey": apikey
          }, {}, function (error, response, body) {
						if (error) {
              res.json(error);
            } else {
							var explanationOfBenefit = JSON.parse(body);
							if (explanationOfBenefit.err_code == 0) {
								if (explanationOfBenefit.data.length > 0) {
									newExplanationOfBenefit = [];
									for (i = 0; i < explanationOfBenefit.data.length; i++) {
										myEmitter.prependOnceListener("getIdentifier", function (explanationOfBenefit, index, newExplanationOfBenefit, countExplanationOfBenefit) {
											qString = {};
                      qString.explanation_of_benefit_id = explanationOfBenefit.id;
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
													var objectExplanationOfBenefit = {};
													objectExplanationOfBenefit.resourceType = explanationOfBenefit.resourceType;
													objectExplanationOfBenefit.id = explanationOfBenefit.id;
													objectExplanationOfBenefit.identifier = identifier.data;
													objectExplanationOfBenefit.status = explanationOfBenefit.status;
													objectExplanationOfBenefit.type = explanationOfBenefit.type;
													objectExplanationOfBenefit.subtype = explanationOfBenefit.subtype;
													objectExplanationOfBenefit.patient = explanationOfBenefit.patient;
													objectExplanationOfBenefit.billablePeriod = explanationOfBenefit.billablePeriod;
													objectExplanationOfBenefit.created = explanationOfBenefit.created;
													objectExplanationOfBenefit.enterer = explanationOfBenefit.enterer;
													objectExplanationOfBenefit.insurer = explanationOfBenefit.insurer;
													objectExplanationOfBenefit.provider = explanationOfBenefit.provider;
													objectExplanationOfBenefit.organization = explanationOfBenefit.organization;
													objectExplanationOfBenefit.referral = explanationOfBenefit.referral;
													objectExplanationOfBenefit.facility = explanationOfBenefit.facility;
													objectExplanationOfBenefit.claim = explanationOfBenefit.claim;
													objectExplanationOfBenefit.claimResponse = explanationOfBenefit.claimResponse;
													objectExplanationOfBenefit.outcome = explanationOfBenefit.outcome;
													objectExplanationOfBenefit.disposition = explanationOfBenefit.disposition;
													objectExplanationOfBenefit.prescription = explanationOfBenefit.prescription;
													objectExplanationOfBenefit.originalPrescription = explanationOfBenefit.originalPrescription;
													objectExplanationOfBenefit.payee = explanationOfBenefit.payee;
													objectExplanationOfBenefit.precedence = explanationOfBenefit.precedence;
													objectExplanationOfBenefit.insurance = explanationOfBenefit.insurance;
													objectExplanationOfBenefit.accident = explanationOfBenefit.accident;
													objectExplanationOfBenefit.employmentImpacted = explanationOfBenefit.employmentImpacted;
													objectExplanationOfBenefit.hospitalization = explanationOfBenefit.hospitalization;
													objectExplanationOfBenefit.item = host + ':' + port + '/' + apikey + '/ExplanationOfBenefit/' +  explanationOfBenefit.id + '/ExplanationOfBenefitItem';
													objectExplanationOfBenefit.addItem = host + ':' + port + '/' + apikey + '/ExplanationOfBenefit/' +  explanationOfBenefit.id + '/ExplanationOfBenefitaddItem';
													objectExplanationOfBenefit.totalCost = explanationOfBenefit.totalCost;
													objectExplanationOfBenefit.unallocDeductable = explanationOfBenefit.unallocDeductable;
													objectExplanationOfBenefit.totalBenefit = explanationOfBenefit.totalBenefit;
													objectExplanationOfBenefit.payment = explanationOfBenefit.payment;
													objectExplanationOfBenefit.form = explanationOfBenefit.form;
													objectExplanationOfBenefit.benefitBalance = host + ':' + port + '/' + apikey + '/ExplanationOfBenefit/' +  explanationOfBenefit.id + '/ExplanationOfBenefitBalance';
													
													newExplanationOfBenefit[index] = objectExplanationOfBenefit;
													
													/*if (index == countExplanationOfBenefit - 1) {
														res.json({
															"err_code": 0,
															"data": newExplanationOfBenefit
														});
													}*/
													myEmitter.prependOnceListener("getExplanationOfBenefitRelated", function (explanationOfBenefit, index, newExplanationOfBenefit, countExplanationOfBenefit) {
														qString = {};
														qString.explanation_of_benefit_id = explanationOfBenefit.id;
														seedPhoenixFHIR.path.GET = {
															"ExplanationOfBenefitRelated": {
																"location": "%(apikey)s/ExplanationOfBenefitRelated",
																"query": qString
															}
														}
														var ApiFHIR = new Apiclient(seedPhoenixFHIR);
														ApiFHIR.get('ExplanationOfBenefitRelated', {
															"apikey": apikey
														}, {}, function (error, response, body) {
															explanationOfBenefitRelated = JSON.parse(body);
															if (explanationOfBenefitRelated.err_code == 0) {
																var objectExplanationOfBenefit = {};
																objectExplanationOfBenefit.resourceType = explanationOfBenefit.resourceType;
																objectExplanationOfBenefit.id = explanationOfBenefit.id;
																objectExplanationOfBenefit.identifier = explanationOfBenefit.identifier;
																objectExplanationOfBenefit.status = explanationOfBenefit.status;
																objectExplanationOfBenefit.type = explanationOfBenefit.type;
																objectExplanationOfBenefit.subtype = explanationOfBenefit.subtype;
																objectExplanationOfBenefit.patient = explanationOfBenefit.patient;
																objectExplanationOfBenefit.billablePeriod = explanationOfBenefit.billablePeriod;
																objectExplanationOfBenefit.created = explanationOfBenefit.created;
																objectExplanationOfBenefit.enterer = explanationOfBenefit.enterer;
																objectExplanationOfBenefit.insurer = explanationOfBenefit.insurer;
																objectExplanationOfBenefit.provider = explanationOfBenefit.provider;
																objectExplanationOfBenefit.organization = explanationOfBenefit.organization;
																objectExplanationOfBenefit.referral = explanationOfBenefit.referral;
																objectExplanationOfBenefit.facility = explanationOfBenefit.facility;
																objectExplanationOfBenefit.claim = explanationOfBenefit.claim;
																objectExplanationOfBenefit.claimResponse = explanationOfBenefit.claimResponse;
																objectExplanationOfBenefit.outcome = explanationOfBenefit.outcome;
																objectExplanationOfBenefit.disposition = explanationOfBenefit.disposition;
																objectExplanationOfBenefit.related = explanationOfBenefitRelated.data;
																objectExplanationOfBenefit.prescription = explanationOfBenefit.prescription;
																objectExplanationOfBenefit.originalPrescription = explanationOfBenefit.originalPrescription;
																objectExplanationOfBenefit.payee = explanationOfBenefit.payee;
																objectExplanationOfBenefit.precedence = explanationOfBenefit.precedence;
																objectExplanationOfBenefit.insurance = explanationOfBenefit.insurance;
																objectExplanationOfBenefit.accident = explanationOfBenefit.accident;
																objectExplanationOfBenefit.employmentImpacted = explanationOfBenefit.employmentImpacted;
																objectExplanationOfBenefit.hospitalization = explanationOfBenefit.hospitalization;
																objectExplanationOfBenefit.item = explanationOfBenefit.item;
																objectExplanationOfBenefit.addItem = explanationOfBenefit.addItem;
																objectExplanationOfBenefit.totalCost = explanationOfBenefit.totalCost;
																objectExplanationOfBenefit.unallocDeductable = explanationOfBenefit.unallocDeductable;
																objectExplanationOfBenefit.totalBenefit = explanationOfBenefit.totalBenefit;
																objectExplanationOfBenefit.payment = explanationOfBenefit.payment;
																objectExplanationOfBenefit.form = explanationOfBenefit.form;
																objectExplanationOfBenefit.benefitBalance = explanationOfBenefit.benefitBalance;

																newExplanationOfBenefit[index] = objectExplanationOfBenefit;

																myEmitter.prependOnceListener("getExplanationOfBenefitProcessNote", function (explanationOfBenefit, index, newExplanationOfBenefit, countExplanationOfBenefit) {
																	qString = {};
																	qString.explanation_of_benefit_id = explanationOfBenefit.id;
																	seedPhoenixFHIR.path.GET = {
																		"ExplanationOfBenefitProcessNote": {
																			"location": "%(apikey)s/ExplanationOfBenefitProcessNote",
																			"query": qString
																		}
																	}
																	var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																	ApiFHIR.get('ExplanationOfBenefitProcessNote', {
																		"apikey": apikey
																	}, {}, function (error, response, body) {
																		explanationOfBenefitProcessNote = JSON.parse(body);
																		if (explanationOfBenefitProcessNote.err_code == 0) {
																			var objectExplanationOfBenefit = {};
																			objectExplanationOfBenefit.resourceType = explanationOfBenefit.resourceType;
																			objectExplanationOfBenefit.id = explanationOfBenefit.id;
																			objectExplanationOfBenefit.identifier = explanationOfBenefit.identifier;
																			objectExplanationOfBenefit.status = explanationOfBenefit.status;
																			objectExplanationOfBenefit.type = explanationOfBenefit.type;
																			objectExplanationOfBenefit.subtype = explanationOfBenefit.subtype;
																			objectExplanationOfBenefit.patient = explanationOfBenefit.patient;
																			objectExplanationOfBenefit.billablePeriod = explanationOfBenefit.billablePeriod;
																			objectExplanationOfBenefit.created = explanationOfBenefit.created;
																			objectExplanationOfBenefit.enterer = explanationOfBenefit.enterer;
																			objectExplanationOfBenefit.insurer = explanationOfBenefit.insurer;
																			objectExplanationOfBenefit.provider = explanationOfBenefit.provider;
																			objectExplanationOfBenefit.organization = explanationOfBenefit.organization;
																			objectExplanationOfBenefit.referral = explanationOfBenefit.referral;
																			objectExplanationOfBenefit.facility = explanationOfBenefit.facility;
																			objectExplanationOfBenefit.claim = explanationOfBenefit.claim;
																			objectExplanationOfBenefit.claimResponse = explanationOfBenefit.claimResponse;
																			objectExplanationOfBenefit.outcome = explanationOfBenefit.outcome;
																			objectExplanationOfBenefit.disposition = explanationOfBenefit.disposition;
																			objectExplanationOfBenefit.related = explanationOfBenefit.related;
																			objectExplanationOfBenefit.prescription = explanationOfBenefit.prescription;
																			objectExplanationOfBenefit.originalPrescription = explanationOfBenefit.originalPrescription;
																			objectExplanationOfBenefit.payee = explanationOfBenefit.payee;
																			objectExplanationOfBenefit.precedence = explanationOfBenefit.precedence;
																			objectExplanationOfBenefit.insurance = explanationOfBenefit.insurance;
																			objectExplanationOfBenefit.accident = explanationOfBenefit.accident;
																			objectExplanationOfBenefit.employmentImpacted = explanationOfBenefit.employmentImpacted;
																			objectExplanationOfBenefit.hospitalization = explanationOfBenefit.hospitalization;
																			objectExplanationOfBenefit.item = explanationOfBenefit.item;
																			objectExplanationOfBenefit.addItem = explanationOfBenefit.addItem;
																			objectExplanationOfBenefit.totalCost = explanationOfBenefit.totalCost;
																			objectExplanationOfBenefit.unallocDeductable = explanationOfBenefit.unallocDeductable;
																			objectExplanationOfBenefit.totalBenefit = explanationOfBenefit.totalBenefit;
																			objectExplanationOfBenefit.payment = explanationOfBenefit.payment;
																			objectExplanationOfBenefit.processNote = explanationOfBenefitProcessNote.data;
																			objectExplanationOfBenefit.form = explanationOfBenefit.form;
																			objectExplanationOfBenefit.benefitBalance = explanationOfBenefit.benefitBalance;

																			newExplanationOfBenefit[index] = objectExplanationOfBenefit;

																			myEmitter.prependOnceListener("getExplanationOfBenefitInformation", function (explanationOfBenefit, index, newExplanationOfBenefit, countExplanationOfBenefit) {
																				qString = {};
																				qString.explanation_of_benefit_id = explanationOfBenefit.id;
																				seedPhoenixFHIR.path.GET = {
																					"ExplanationOfBenefitInformation": {
																						"location": "%(apikey)s/ExplanationOfBenefitInformation",
																						"query": qString
																					}
																				}
																				var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																				ApiFHIR.get('ExplanationOfBenefitInformation', {
																					"apikey": apikey
																				}, {}, function (error, response, body) {
																					explanationOfBenefitInformation = JSON.parse(body);
																					if (explanationOfBenefitInformation.err_code == 0) {
																						var objectExplanationOfBenefit = {};
																						objectExplanationOfBenefit.resourceType = explanationOfBenefit.resourceType;
																						objectExplanationOfBenefit.id = explanationOfBenefit.id;
																						objectExplanationOfBenefit.identifier = explanationOfBenefit.identifier;
																						objectExplanationOfBenefit.status = explanationOfBenefit.status;
																						objectExplanationOfBenefit.type = explanationOfBenefit.type;
																						objectExplanationOfBenefit.subtype = explanationOfBenefit.subtype;
																						objectExplanationOfBenefit.patient = explanationOfBenefit.patient;
																						objectExplanationOfBenefit.billablePeriod = explanationOfBenefit.billablePeriod;
																						objectExplanationOfBenefit.created = explanationOfBenefit.created;
																						objectExplanationOfBenefit.enterer = explanationOfBenefit.enterer;
																						objectExplanationOfBenefit.insurer = explanationOfBenefit.insurer;
																						objectExplanationOfBenefit.provider = explanationOfBenefit.provider;
																						objectExplanationOfBenefit.organization = explanationOfBenefit.organization;
																						objectExplanationOfBenefit.referral = explanationOfBenefit.referral;
																						objectExplanationOfBenefit.facility = explanationOfBenefit.facility;
																						objectExplanationOfBenefit.claim = explanationOfBenefit.claim;
																						objectExplanationOfBenefit.claimResponse = explanationOfBenefit.claimResponse;
																						objectExplanationOfBenefit.outcome = explanationOfBenefit.outcome;
																						objectExplanationOfBenefit.disposition = explanationOfBenefit.disposition;
																						objectExplanationOfBenefit.related = explanationOfBenefit.related;
																						objectExplanationOfBenefit.prescription = explanationOfBenefit.prescription;
																						objectExplanationOfBenefit.originalPrescription = explanationOfBenefit.originalPrescription;
																						objectExplanationOfBenefit.payee = explanationOfBenefit.payee;
																						objectExplanationOfBenefit.information = explanationOfBenefitInformation.data;
																						objectExplanationOfBenefit.precedence = explanationOfBenefit.precedence;
																						objectExplanationOfBenefit.insurance = explanationOfBenefit.insurance;
																						objectExplanationOfBenefit.accident = explanationOfBenefit.accident;
																						objectExplanationOfBenefit.employmentImpacted = explanationOfBenefit.employmentImpacted;
																						objectExplanationOfBenefit.hospitalization = explanationOfBenefit.hospitalization;
																						objectExplanationOfBenefit.item = explanationOfBenefit.item;
																						objectExplanationOfBenefit.addItem = explanationOfBenefit.addItem;
																						objectExplanationOfBenefit.totalCost = explanationOfBenefit.totalCost;
																						objectExplanationOfBenefit.unallocDeductable = explanationOfBenefit.unallocDeductable;
																						objectExplanationOfBenefit.totalBenefit = explanationOfBenefit.totalBenefit;
																						objectExplanationOfBenefit.payment = explanationOfBenefit.payment;
																						objectExplanationOfBenefit.processNote = explanationOfBenefit.processNote;
																						objectExplanationOfBenefit.form = explanationOfBenefit.form;
																						objectExplanationOfBenefit.benefitBalance = explanationOfBenefit.benefitBalance;

																						newExplanationOfBenefit[index] = objectExplanationOfBenefit;

																						myEmitter.prependOnceListener("getExplanationOfBenefitCareTeam", function (explanationOfBenefit, index, newExplanationOfBenefit, countExplanationOfBenefit) {
																							qString = {};
																							qString.explanation_of_benefit_id = explanationOfBenefit.id;
																							seedPhoenixFHIR.path.GET = {
																								"ExplanationOfBenefitCareTeam": {
																									"location": "%(apikey)s/ExplanationOfBenefitCareTeam",
																									"query": qString
																								}
																							}
																							var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																							ApiFHIR.get('ExplanationOfBenefitCareTeam', {
																								"apikey": apikey
																							}, {}, function (error, response, body) {
																								explanationOfBenefitCareTeam = JSON.parse(body);
																								if (explanationOfBenefitCareTeam.err_code == 0) {
																									var objectExplanationOfBenefit = {};
																									objectExplanationOfBenefit.resourceType = explanationOfBenefit.resourceType;
																									objectExplanationOfBenefit.id = explanationOfBenefit.id;
																									objectExplanationOfBenefit.identifier = explanationOfBenefit.identifier;
																									objectExplanationOfBenefit.status = explanationOfBenefit.status;
																									objectExplanationOfBenefit.type = explanationOfBenefit.type;
																									objectExplanationOfBenefit.subtype = explanationOfBenefit.subtype;
																									objectExplanationOfBenefit.patient = explanationOfBenefit.patient;
																									objectExplanationOfBenefit.billablePeriod = explanationOfBenefit.billablePeriod;
																									objectExplanationOfBenefit.created = explanationOfBenefit.created;
																									objectExplanationOfBenefit.enterer = explanationOfBenefit.enterer;
																									objectExplanationOfBenefit.insurer = explanationOfBenefit.insurer;
																									objectExplanationOfBenefit.provider = explanationOfBenefit.provider;
																									objectExplanationOfBenefit.organization = explanationOfBenefit.organization;
																									objectExplanationOfBenefit.referral = explanationOfBenefit.referral;
																									objectExplanationOfBenefit.facility = explanationOfBenefit.facility;
																									objectExplanationOfBenefit.claim = explanationOfBenefit.claim;
																									objectExplanationOfBenefit.claimResponse = explanationOfBenefit.claimResponse;
																									objectExplanationOfBenefit.outcome = explanationOfBenefit.outcome;
																									objectExplanationOfBenefit.disposition = explanationOfBenefit.disposition;
																									objectExplanationOfBenefit.related = explanationOfBenefit.related;
																									objectExplanationOfBenefit.prescription = explanationOfBenefit.prescription;
																									objectExplanationOfBenefit.originalPrescription = explanationOfBenefit.originalPrescription;
																									objectExplanationOfBenefit.payee = explanationOfBenefit.payee;
																									objectExplanationOfBenefit.information = explanationOfBenefit.information;
																									objectExplanationOfBenefit.careTeam = explanationOfBenefitCareTeam.data;
																									objectExplanationOfBenefit.precedence = explanationOfBenefit.precedence;
																									objectExplanationOfBenefit.insurance = explanationOfBenefit.insurance;
																									objectExplanationOfBenefit.accident = explanationOfBenefit.accident;
																									objectExplanationOfBenefit.employmentImpacted = explanationOfBenefit.employmentImpacted;
																									objectExplanationOfBenefit.hospitalization = explanationOfBenefit.hospitalization;
																									objectExplanationOfBenefit.item = explanationOfBenefit.item;
																									objectExplanationOfBenefit.addItem = explanationOfBenefit.addItem;
																									objectExplanationOfBenefit.totalCost = explanationOfBenefit.totalCost;
																									objectExplanationOfBenefit.unallocDeductable = explanationOfBenefit.unallocDeductable;
																									objectExplanationOfBenefit.totalBenefit = explanationOfBenefit.totalBenefit;
																									objectExplanationOfBenefit.payment = explanationOfBenefit.payment;
																									objectExplanationOfBenefit.processNote = explanationOfBenefit.processNote;
																									objectExplanationOfBenefit.form = explanationOfBenefit.form;
																									objectExplanationOfBenefit.benefitBalance = explanationOfBenefit.benefitBalance;

																									newExplanationOfBenefit[index] = objectExplanationOfBenefit;

																									myEmitter.prependOnceListener("getExplanationOfBenefitDiagnosis", function (explanationOfBenefit, index, newExplanationOfBenefit, countExplanationOfBenefit) {
																										qString = {};
																										qString.explanation_of_benefit_id = explanationOfBenefit.id;
																										seedPhoenixFHIR.path.GET = {
																											"ExplanationOfBenefitDiagnosis": {
																												"location": "%(apikey)s/ExplanationOfBenefitDiagnosis",
																												"query": qString
																											}
																										}
																										var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																										ApiFHIR.get('ExplanationOfBenefitDiagnosis', {
																											"apikey": apikey
																										}, {}, function (error, response, body) {
																											explanationOfBenefitDiagnosis = JSON.parse(body);
																											if (explanationOfBenefitDiagnosis.err_code == 0) {
																												var objectExplanationOfBenefit = {};
																												objectExplanationOfBenefit.resourceType = explanationOfBenefit.resourceType;
																												objectExplanationOfBenefit.id = explanationOfBenefit.id;
																												objectExplanationOfBenefit.identifier = explanationOfBenefit.identifier;
																												objectExplanationOfBenefit.status = explanationOfBenefit.status;
																												objectExplanationOfBenefit.type = explanationOfBenefit.type;
																												objectExplanationOfBenefit.subtype = explanationOfBenefit.subtype;
																												objectExplanationOfBenefit.patient = explanationOfBenefit.patient;
																												objectExplanationOfBenefit.billablePeriod = explanationOfBenefit.billablePeriod;
																												objectExplanationOfBenefit.created = explanationOfBenefit.created;
																												objectExplanationOfBenefit.enterer = explanationOfBenefit.enterer;
																												objectExplanationOfBenefit.insurer = explanationOfBenefit.insurer;
																												objectExplanationOfBenefit.provider = explanationOfBenefit.provider;
																												objectExplanationOfBenefit.organization = explanationOfBenefit.organization;
																												objectExplanationOfBenefit.referral = explanationOfBenefit.referral;
																												objectExplanationOfBenefit.facility = explanationOfBenefit.facility;
																												objectExplanationOfBenefit.claim = explanationOfBenefit.claim;
																												objectExplanationOfBenefit.claimResponse = explanationOfBenefit.claimResponse;
																												objectExplanationOfBenefit.outcome = explanationOfBenefit.outcome;
																												objectExplanationOfBenefit.disposition = explanationOfBenefit.disposition;
																												objectExplanationOfBenefit.related = explanationOfBenefit.related;
																												objectExplanationOfBenefit.prescription = explanationOfBenefit.prescription;
																												objectExplanationOfBenefit.originalPrescription = explanationOfBenefit.originalPrescription;
																												objectExplanationOfBenefit.payee = explanationOfBenefit.payee;
																												objectExplanationOfBenefit.information = explanationOfBenefit.information;
																												objectExplanationOfBenefit.careTeam = explanationOfBenefit.careTeam;
																												objectExplanationOfBenefit.diagnosis = explanationOfBenefitDiagnosis.data;
																												objectExplanationOfBenefit.precedence = explanationOfBenefit.precedence;
																												objectExplanationOfBenefit.insurance = explanationOfBenefit.insurance;
																												objectExplanationOfBenefit.accident = explanationOfBenefit.accident;
																												objectExplanationOfBenefit.employmentImpacted = explanationOfBenefit.employmentImpacted;
																												objectExplanationOfBenefit.hospitalization = explanationOfBenefit.hospitalization;
																												objectExplanationOfBenefit.item = explanationOfBenefit.item;
																												objectExplanationOfBenefit.addItem = explanationOfBenefit.addItem;
																												objectExplanationOfBenefit.totalCost = explanationOfBenefit.totalCost;
																												objectExplanationOfBenefit.unallocDeductable = explanationOfBenefit.unallocDeductable;
																												objectExplanationOfBenefit.totalBenefit = explanationOfBenefit.totalBenefit;
																												objectExplanationOfBenefit.payment = explanationOfBenefit.payment;
																												objectExplanationOfBenefit.processNote = explanationOfBenefit.processNote;
																												objectExplanationOfBenefit.form = explanationOfBenefit.form;
																												objectExplanationOfBenefit.benefitBalance = explanationOfBenefit.benefitBalance;

																												newExplanationOfBenefit[index] = objectExplanationOfBenefit;

																												myEmitter.prependOnceListener("getExplanationOfBenefitProcedure", function (explanationOfBenefit, index, newExplanationOfBenefit, countExplanationOfBenefit) {
																													qString = {};
																													qString.explanation_of_benefit_id = explanationOfBenefit.id;
																													seedPhoenixFHIR.path.GET = {
																														"ExplanationOfBenefitProcedure": {
																															"location": "%(apikey)s/ExplanationOfBenefitProcedure",
																															"query": qString
																														}
																													}
																													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																													ApiFHIR.get('ExplanationOfBenefitProcedure', {
																														"apikey": apikey
																													}, {}, function (error, response, body) {
																														explanationOfBenefitProcedure = JSON.parse(body);
																														if (explanationOfBenefitProcedure.err_code == 0) {
																															var objectExplanationOfBenefit = {};
																															objectExplanationOfBenefit.resourceType = explanationOfBenefit.resourceType;
																															objectExplanationOfBenefit.id = explanationOfBenefit.id;
																															objectExplanationOfBenefit.identifier = explanationOfBenefit.identifier;
																															objectExplanationOfBenefit.status = explanationOfBenefit.status;
																															objectExplanationOfBenefit.type = explanationOfBenefit.type;
																															objectExplanationOfBenefit.subtype = explanationOfBenefit.subtype;
																															objectExplanationOfBenefit.patient = explanationOfBenefit.patient;
																															objectExplanationOfBenefit.billablePeriod = explanationOfBenefit.billablePeriod;
																															objectExplanationOfBenefit.created = explanationOfBenefit.created;
																															objectExplanationOfBenefit.enterer = explanationOfBenefit.enterer;
																															objectExplanationOfBenefit.insurer = explanationOfBenefit.insurer;
																															objectExplanationOfBenefit.provider = explanationOfBenefit.provider;
																															objectExplanationOfBenefit.organization = explanationOfBenefit.organization;
																															objectExplanationOfBenefit.referral = explanationOfBenefit.referral;
																															objectExplanationOfBenefit.facility = explanationOfBenefit.facility;
																															objectExplanationOfBenefit.claim = explanationOfBenefit.claim;
																															objectExplanationOfBenefit.claimResponse = explanationOfBenefit.claimResponse;
																															objectExplanationOfBenefit.outcome = explanationOfBenefit.outcome;
																															objectExplanationOfBenefit.disposition = explanationOfBenefit.disposition;
																															objectExplanationOfBenefit.related = explanationOfBenefit.related;
																															objectExplanationOfBenefit.prescription = explanationOfBenefit.prescription;
																															objectExplanationOfBenefit.originalPrescription = explanationOfBenefit.originalPrescription;
																															objectExplanationOfBenefit.payee = explanationOfBenefit.payee;
																															objectExplanationOfBenefit.information = explanationOfBenefit.information;
																															objectExplanationOfBenefit.careTeam = explanationOfBenefit.careTeam;
																															objectExplanationOfBenefit.diagnosis = explanationOfBenefit.diagnosis;
																															objectExplanationOfBenefit.procedure = explanationOfBenefitProcedure.data;
																															objectExplanationOfBenefit.precedence = explanationOfBenefit.precedence;
																															objectExplanationOfBenefit.insurance = explanationOfBenefit.insurance;
																															objectExplanationOfBenefit.accident = explanationOfBenefit.accident;
																															objectExplanationOfBenefit.employmentImpacted = explanationOfBenefit.employmentImpacted;
																															objectExplanationOfBenefit.hospitalization = explanationOfBenefit.hospitalization;
																															objectExplanationOfBenefit.item = explanationOfBenefit.item;
																															objectExplanationOfBenefit.addItem = explanationOfBenefit.addItem;
																															objectExplanationOfBenefit.totalCost = explanationOfBenefit.totalCost;
																															objectExplanationOfBenefit.unallocDeductable = explanationOfBenefit.unallocDeductable;
																															objectExplanationOfBenefit.totalBenefit = explanationOfBenefit.totalBenefit;
																															objectExplanationOfBenefit.payment = explanationOfBenefit.payment;
																															objectExplanationOfBenefit.processNote = explanationOfBenefit.processNote;
																															objectExplanationOfBenefit.form = explanationOfBenefit.form;
																															objectExplanationOfBenefit.benefitBalance = explanationOfBenefit.benefitBalance;

																															newExplanationOfBenefit[index] = objectExplanationOfBenefit;

																															if (index == countExplanationOfBenefit - 1) {
																																res.json({
																																	"err_code": 0,
																																	"data": newExplanationOfBenefit
																																});
																															}

																														} else {
																															res.json(explanationOfBenefitProcedure);
																														}
																													})
																												})
																												myEmitter.emit("getExplanationOfBenefitProcedure", objectExplanationOfBenefit, index, newExplanationOfBenefit, countExplanationOfBenefit);													

																											} else {
																												res.json(explanationOfBenefitDiagnosis);
																											}
																										})
																									})
																									myEmitter.emit("getExplanationOfBenefitDiagnosis", objectExplanationOfBenefit, index, newExplanationOfBenefit, countExplanationOfBenefit);													

																								} else {
																									res.json(explanationOfBenefitCareTeam);
																								}
																							})
																						})
																						myEmitter.emit("getExplanationOfBenefitCareTeam", objectExplanationOfBenefit, index, newExplanationOfBenefit, countExplanationOfBenefit);													

																					} else {
																						res.json(explanationOfBenefitInformation);
																					}
																				})
																			})
																			myEmitter.emit("getExplanationOfBenefitInformation", objectExplanationOfBenefit, index, newExplanationOfBenefit, countExplanationOfBenefit);													

																		} else {
																			res.json(explanationOfBenefitProcessNote);
																		}
																	})
																})
																myEmitter.emit("getExplanationOfBenefitProcessNote", objectExplanationOfBenefit, index, newExplanationOfBenefit, countExplanationOfBenefit);													

															} else {
																res.json(explanationOfBenefitRelated);
															}
														})
													})
													myEmitter.emit("getExplanationOfBenefitRelated", objectExplanationOfBenefit, index, newExplanationOfBenefit, countExplanationOfBenefit);
												} else {
                          res.json(identifier);
                        }
											})
										})
										myEmitter.emit("getIdentifier", explanationOfBenefit.data[i], i, newExplanationOfBenefit, explanationOfBenefit.data.length);
									}
								} else {
                  res.json({
                    "err_code": 2,
                    "err_msg": "Explanation Of Benefit is empty."
                  });
                }
							} else {
                res.json(explanationOfBenefit);
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
					var explanationOfBenefitId = req.params.explanation_of_benefit_id;
					var identifierId = req.params.identifier_id;
					
					checkApikey(apikey, ipAddres, function(result){
						if(result.err_code == 0){	
							checkUniqeValue(apikey, "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId, 'EXPLANATION_OF_BENEFIT', function(resExplanationOfBenefitID){
								if(resExplanationOfBenefitID.err_code > 0){
									if(typeof identifierId !== 'undefined' && !validator.isEmpty(identifierId)){
										checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function(resIdentifierID){
											if(resIdentifierID.err_code > 0){
												//get identifier
								  			qString = {};
								  			qString.explanation_of_benefit_id = explanationOfBenefitId;
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
						  			qString.explanation_of_benefit_id = explanationOfBenefitId;
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
									res.json({"err_code": 501, "err_msg": "Explanation Of Benefit Id not found"});		
								}
							})
						}else{
							result.err_code = 500;
							res.json(result);
						}	
					});
				},
		explanationOfBenefitItem: function getExplanationOfBenefitItem(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var ExplanationOfBenefitId = req.params.explanation_of_benefit_id;
			var explanationOfBenefitItemId = req.params.item_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "explanation_of_benefit_id|" + ExplanationOfBenefitId, 'explanation_of_benefit', function(resClaim){
						if(resClaim.err_code > 0){
							if(typeof explanationOfBenefitItemId !== 'undefined' && !validator.isEmpty(explanationOfBenefitItemId)){
								checkUniqeValue(apikey, "item_id|" + explanationOfBenefitItemId, 'explanation_of_benefit_item', function(resExplanationOfBenefitItemID){
									if(resExplanationOfBenefitItemID.err_code > 0){
										//get explanationOfBenefitItem
										qString = {};
										qString.explanation_of_benefit_id = ExplanationOfBenefitId;
										qString._id = explanationOfBenefitItemId;
										seedPhoenixFHIR.path.GET = {
											"ExplanationOfBenefitItem" : {
												"location": "%(apikey)s/ExplanationOfBenefitItem",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ExplanationOfBenefitItem', {"apikey": apikey}, {}, function(error, response, body){
											explanationOfBenefitItem = JSON.parse(body);
											if(explanationOfBenefitItem.err_code == 0){
												//res.json({"err_code": 0, "data":explanationOfBenefitItem.data});	
												if(explanationOfBenefitItem.data.length > 0){
													newExplanationOfBenefitItem = [];
													for(i=0; i < explanationOfBenefitItem.data.length; i++){
														myEmitter.once('getExplanationOfBenefitAdjudication', function(explanationOfBenefitItem, index, newExplanationOfBenefitItem, countExplanationOfBenefitItem){	
															qString = {};
															qString.item_id = explanationOfBenefitItem.id;
															seedPhoenixFHIR.path.GET = {
																"ExplanationOfBenefitAdjudication": {
																	"location": "%(apikey)s/ExplanationOfBenefitAdjudication",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ExplanationOfBenefitAdjudication', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																explanationOfBenefitAdjudication = JSON.parse(body);
																if (explanationOfBenefitAdjudication.err_code == 0) {
																	var objectExplanationOfBenefitItem = {};
																	objectExplanationOfBenefitItem.id = explanationOfBenefitItem.id;
																	objectExplanationOfBenefitItem.sequences = explanationOfBenefitItem.sequences;
																	objectExplanationOfBenefitItem.careTeamLinkId = explanationOfBenefitItem.careTeamLinkId;
																	objectExplanationOfBenefitItem.diagnosisLinkId = explanationOfBenefitItem.diagnosisLinkId;
																	objectExplanationOfBenefitItem.procedureLinkId = explanationOfBenefitItem.procedureLinkId;
																	objectExplanationOfBenefitItem.informationLinkId = explanationOfBenefitItem.informationLinkId;
																	objectExplanationOfBenefitItem.revenue = explanationOfBenefitItem.revenue;
																	objectExplanationOfBenefitItem.category = explanationOfBenefitItem.category;
																	objectExplanationOfBenefitItem.service = explanationOfBenefitItem.service;
																	objectExplanationOfBenefitItem.modifier = explanationOfBenefitItem.modifier;
																	objectExplanationOfBenefitItem.programCode = explanationOfBenefitItem.programCode;
																	objectExplanationOfBenefitItem.serviced = explanationOfBenefitItem.serviced;
																	objectExplanationOfBenefitItem.location = explanationOfBenefitItem.location;
																	objectExplanationOfBenefitItem.quantity = explanationOfBenefitItem.quantity;
																	objectExplanationOfBenefitItem.unitPrice = explanationOfBenefitItem.unitPrice;
																	objectExplanationOfBenefitItem.factor = explanationOfBenefitItem.factor;
																	objectExplanationOfBenefitItem.net = explanationOfBenefitItem.net;
																	objectExplanationOfBenefitItem.bodySite = explanationOfBenefitItem.bodySite;
																	objectExplanationOfBenefitItem.subSite = explanationOfBenefitItem.subSite;
																	objectExplanationOfBenefitItem.noteNumber = explanationOfBenefitItem.noteNumber;
																	objectExplanationOfBenefitItem.adjudication = explanationOfBenefitAdjudication.data;
																	objectExplanationOfBenefitItem.detail	= host + ':' + port + '/' + apikey + '/ExplanationOfBenefitItem/' +  explanationOfBenefitItem.id + '/ExplanationOfBenefitItemDetail';
																	newExplanationOfBenefitItem[index] = objectExplanationOfBenefitItem;

																	myEmitter.once('getExplanationOfBenefitItemUdi', function(explanationOfBenefitItem, index, newExplanationOfBenefitItem, countExplanationOfBenefitItem){	
																		qString = {};
																		qString.item_id = explanationOfBenefitItem.id;
																		seedPhoenixFHIR.path.GET = {
																			"ExplanationOfBenefitItemUdi": {
																				"location": "%(apikey)s/ExplanationOfBenefitItemUdi",
																				"query": qString
																			}
																		}
																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																		ApiFHIR.get('ExplanationOfBenefitItemUdi', {
																			"apikey": apikey
																		}, {}, function (error, response, body) {
																			explanationOfBenefitItemUdi = JSON.parse(body);
																			if (explanationOfBenefitItemUdi.err_code == 0) {
																				var objectExplanationOfBenefitItem = {};
																				objectExplanationOfBenefitItem.id = explanationOfBenefitItem.id;
																				objectExplanationOfBenefitItem.sequences = explanationOfBenefitItem.sequences;
																				objectExplanationOfBenefitItem.careTeamLinkId = explanationOfBenefitItem.careTeamLinkId;
																				objectExplanationOfBenefitItem.diagnosisLinkId = explanationOfBenefitItem.diagnosisLinkId;
																				objectExplanationOfBenefitItem.procedureLinkId = explanationOfBenefitItem.procedureLinkId;
																				objectExplanationOfBenefitItem.informationLinkId = explanationOfBenefitItem.informationLinkId;
																				objectExplanationOfBenefitItem.revenue = explanationOfBenefitItem.revenue;
																				objectExplanationOfBenefitItem.category = explanationOfBenefitItem.category;
																				objectExplanationOfBenefitItem.service = explanationOfBenefitItem.service;
																				objectExplanationOfBenefitItem.modifier = explanationOfBenefitItem.modifier;
																				objectExplanationOfBenefitItem.programCode = explanationOfBenefitItem.programCode;
																				objectExplanationOfBenefitItem.serviced = explanationOfBenefitItem.serviced;
																				objectExplanationOfBenefitItem.location = explanationOfBenefitItem.location;
																				objectExplanationOfBenefitItem.quantity = explanationOfBenefitItem.quantity;
																				objectExplanationOfBenefitItem.unitPrice = explanationOfBenefitItem.unitPrice;
																				objectExplanationOfBenefitItem.factor = explanationOfBenefitItem.factor;
																				objectExplanationOfBenefitItem.net = explanationOfBenefitItem.net;
																				objectExplanationOfBenefitItem.udi = explanationOfBenefitItemUdi.data;
																				objectExplanationOfBenefitItem.bodySite = explanationOfBenefitItem.bodySite;
																				objectExplanationOfBenefitItem.subSite = explanationOfBenefitItem.subSite;
																				objectExplanationOfBenefitItem.noteNumber = explanationOfBenefitItem.noteNumber;
																				objectExplanationOfBenefitItem.adjudication = explanationOfBenefitItem.adjudication;
																				objectExplanationOfBenefitItem.detail	= explanationOfBenefitItem.detail;
																				newExplanationOfBenefitItem[index] = objectExplanationOfBenefitItem;

																				myEmitter.once('getExplanationOfBenefitItemEncounter', function(explanationOfBenefitItem, index, newExplanationOfBenefitItem, countExplanationOfBenefitItem){	
																					qString = {};
																					qString.item_id = explanationOfBenefitItem.id;
																					seedPhoenixFHIR.path.GET = {
																						"ExplanationOfBenefitItemEncounter": {
																							"location": "%(apikey)s/ExplanationOfBenefitItemEncounter",
																							"query": qString
																						}
																					}
																					var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																					ApiFHIR.get('ExplanationOfBenefitItemEncounter', {
																						"apikey": apikey
																					}, {}, function (error, response, body) {
																						explanationOfBenefitItemEncounter = JSON.parse(body);
																						if (explanationOfBenefitItemEncounter.err_code == 0) {
																							var objectExplanationOfBenefitItem = {};
																							objectExplanationOfBenefitItem.id = explanationOfBenefitItem.id;
																							objectExplanationOfBenefitItem.sequences = explanationOfBenefitItem.sequences;
																							objectExplanationOfBenefitItem.careTeamLinkId = explanationOfBenefitItem.careTeamLinkId;
																							objectExplanationOfBenefitItem.diagnosisLinkId = explanationOfBenefitItem.diagnosisLinkId;
																							objectExplanationOfBenefitItem.procedureLinkId = explanationOfBenefitItem.procedureLinkId;
																							objectExplanationOfBenefitItem.informationLinkId = explanationOfBenefitItem.informationLinkId;
																							objectExplanationOfBenefitItem.revenue = explanationOfBenefitItem.revenue;
																							objectExplanationOfBenefitItem.category = explanationOfBenefitItem.category;
																							objectExplanationOfBenefitItem.service = explanationOfBenefitItem.service;
																							objectExplanationOfBenefitItem.modifier = explanationOfBenefitItem.modifier;
																							objectExplanationOfBenefitItem.programCode = explanationOfBenefitItem.programCode;
																							objectExplanationOfBenefitItem.serviced = explanationOfBenefitItem.serviced;
																							objectExplanationOfBenefitItem.location = explanationOfBenefitItem.location;
																							objectExplanationOfBenefitItem.quantity = explanationOfBenefitItem.quantity;
																							objectExplanationOfBenefitItem.unitPrice = explanationOfBenefitItem.unitPrice;
																							objectExplanationOfBenefitItem.factor = explanationOfBenefitItem.factor;
																							objectExplanationOfBenefitItem.net = explanationOfBenefitItem.net;
																							objectExplanationOfBenefitItem.udi = explanationOfBenefitItem.udi;
																							objectExplanationOfBenefitItem.bodySite = explanationOfBenefitItem.bodySite;
																							objectExplanationOfBenefitItem.subSite = explanationOfBenefitItem.subSite;
																							objectExplanationOfBenefitItem.ncounter = explanationOfBenefitItemEncounter.data;
																							objectExplanationOfBenefitItem.noteNumber = explanationOfBenefitItem.noteNumber;
																							objectExplanationOfBenefitItem.adjudication = explanationOfBenefitItem.adjudication;
																							objectExplanationOfBenefitItem.detail	= explanationOfBenefitItem.detail;
																							newExplanationOfBenefitItem[index] = objectExplanationOfBenefitItem;

																							if (index == countExplanationOfBenefitItem - 1) {
																								res.json({
																									"err_code": 0,
																									"data": newExplanationOfBenefitItem
																								});
																							}
																						} else {
																							res.json(explanationOfBenefitItemEncounter);
																						}
																					})
																				})
																				myEmitter.emit('getExplanationOfBenefitItemEncounter', objectExplanationOfBenefitItem, index, newExplanationOfBenefitItem, countExplanationOfBenefitItem);
																			} else {
																				res.json(explanationOfBenefitItemUdi);
																			}
																		})
																	})
																	myEmitter.emit('getExplanationOfBenefitItemUdi', objectExplanationOfBenefitItem, index, newExplanationOfBenefitItem, countExplanationOfBenefitItem);
																} else {
																	res.json(explanationOfBenefitAdjudication);
																}
															})
														})
														myEmitter.emit('getExplanationOfBenefitAdjudication', explanationOfBenefitItem.data[i], i, newExplanationOfBenefitItem, explanationOfBenefitItem.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Explanation Of Benefit Item is empty."});	
												}
											}else{
												res.json(explanationOfBenefitItem);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Explanation Of Benefit Item Id not found"});		
									}
								})
							}else{
								//get explanationOfBenefitItem
								qString = {};
								qString.explanation_of_benefit_id = ExplanationOfBenefitId;
								seedPhoenixFHIR.path.GET = {
									"ExplanationOfBenefitItem" : {
										"location": "%(apikey)s/ExplanationOfBenefitItem",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ExplanationOfBenefitItem', {"apikey": apikey}, {}, function(error, response, body){
									explanationOfBenefitItem = JSON.parse(body);
									if(explanationOfBenefitItem.err_code == 0){
										//res.json({"err_code": 0, "data":explanationOfBenefitItem.data});	
										if(explanationOfBenefitItem.data.length > 0){
											newExplanationOfBenefitItem = [];
											for(i=0; i < explanationOfBenefitItem.data.length; i++){
												myEmitter.once('getExplanationOfBenefitAdjudication', function(explanationOfBenefitItem, index, newExplanationOfBenefitItem, countExplanationOfBenefitItem){	
													qString = {};
													qString.item_id = explanationOfBenefitItem.id;
													seedPhoenixFHIR.path.GET = {
														"ExplanationOfBenefitAdjudication": {
															"location": "%(apikey)s/ExplanationOfBenefitAdjudication",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
													ApiFHIR.get('ExplanationOfBenefitAdjudication', {
														"apikey": apikey
													}, {}, function (error, response, body) {
														explanationOfBenefitAdjudication = JSON.parse(body);
														if (explanationOfBenefitAdjudication.err_code == 0) {
															var objectExplanationOfBenefitItem = {};
															objectExplanationOfBenefitItem.id = explanationOfBenefitItem.id;
															objectExplanationOfBenefitItem.sequences = explanationOfBenefitItem.sequences;
															objectExplanationOfBenefitItem.careTeamLinkId = explanationOfBenefitItem.careTeamLinkId;
															objectExplanationOfBenefitItem.diagnosisLinkId = explanationOfBenefitItem.diagnosisLinkId;
															objectExplanationOfBenefitItem.procedureLinkId = explanationOfBenefitItem.procedureLinkId;
															objectExplanationOfBenefitItem.informationLinkId = explanationOfBenefitItem.informationLinkId;
															objectExplanationOfBenefitItem.revenue = explanationOfBenefitItem.revenue;
															objectExplanationOfBenefitItem.category = explanationOfBenefitItem.category;
															objectExplanationOfBenefitItem.service = explanationOfBenefitItem.service;
															objectExplanationOfBenefitItem.modifier = explanationOfBenefitItem.modifier;
															objectExplanationOfBenefitItem.programCode = explanationOfBenefitItem.programCode;
															objectExplanationOfBenefitItem.serviced = explanationOfBenefitItem.serviced;
															objectExplanationOfBenefitItem.location = explanationOfBenefitItem.location;
															objectExplanationOfBenefitItem.quantity = explanationOfBenefitItem.quantity;
															objectExplanationOfBenefitItem.unitPrice = explanationOfBenefitItem.unitPrice;
															objectExplanationOfBenefitItem.factor = explanationOfBenefitItem.factor;
															objectExplanationOfBenefitItem.net = explanationOfBenefitItem.net;
															objectExplanationOfBenefitItem.bodySite = explanationOfBenefitItem.bodySite;
															objectExplanationOfBenefitItem.subSite = explanationOfBenefitItem.subSite;
															objectExplanationOfBenefitItem.noteNumber = explanationOfBenefitItem.noteNumber;
															objectExplanationOfBenefitItem.adjudication = explanationOfBenefitAdjudication.data;
															objectExplanationOfBenefitItem.detail	= host + ':' + port + '/' + apikey + '/ExplanationOfBenefitItem/' +  explanationOfBenefitItem.id + '/ExplanationOfBenefitItemDetail';
															newExplanationOfBenefitItem[index] = objectExplanationOfBenefitItem;

															myEmitter.once('getExplanationOfBenefitItemUdi', function(explanationOfBenefitItem, index, newExplanationOfBenefitItem, countExplanationOfBenefitItem){	
																qString = {};
																qString.item_id = explanationOfBenefitItem.id;
																seedPhoenixFHIR.path.GET = {
																	"ExplanationOfBenefitItemUdi": {
																		"location": "%(apikey)s/ExplanationOfBenefitItemUdi",
																		"query": qString
																	}
																}
																var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																ApiFHIR.get('ExplanationOfBenefitItemUdi', {
																	"apikey": apikey
																}, {}, function (error, response, body) {
																	explanationOfBenefitItemUdi = JSON.parse(body);
																	if (explanationOfBenefitItemUdi.err_code == 0) {
																		var objectExplanationOfBenefitItem = {};
																		objectExplanationOfBenefitItem.id = explanationOfBenefitItem.id;
																		objectExplanationOfBenefitItem.sequences = explanationOfBenefitItem.sequences;
																		objectExplanationOfBenefitItem.careTeamLinkId = explanationOfBenefitItem.careTeamLinkId;
																		objectExplanationOfBenefitItem.diagnosisLinkId = explanationOfBenefitItem.diagnosisLinkId;
																		objectExplanationOfBenefitItem.procedureLinkId = explanationOfBenefitItem.procedureLinkId;
																		objectExplanationOfBenefitItem.informationLinkId = explanationOfBenefitItem.informationLinkId;
																		objectExplanationOfBenefitItem.revenue = explanationOfBenefitItem.revenue;
																		objectExplanationOfBenefitItem.category = explanationOfBenefitItem.category;
																		objectExplanationOfBenefitItem.service = explanationOfBenefitItem.service;
																		objectExplanationOfBenefitItem.modifier = explanationOfBenefitItem.modifier;
																		objectExplanationOfBenefitItem.programCode = explanationOfBenefitItem.programCode;
																		objectExplanationOfBenefitItem.serviced = explanationOfBenefitItem.serviced;
																		objectExplanationOfBenefitItem.location = explanationOfBenefitItem.location;
																		objectExplanationOfBenefitItem.quantity = explanationOfBenefitItem.quantity;
																		objectExplanationOfBenefitItem.unitPrice = explanationOfBenefitItem.unitPrice;
																		objectExplanationOfBenefitItem.factor = explanationOfBenefitItem.factor;
																		objectExplanationOfBenefitItem.net = explanationOfBenefitItem.net;
																		objectExplanationOfBenefitItem.udi = explanationOfBenefitItemUdi.data;
																		objectExplanationOfBenefitItem.bodySite = explanationOfBenefitItem.bodySite;
																		objectExplanationOfBenefitItem.subSite = explanationOfBenefitItem.subSite;
																		objectExplanationOfBenefitItem.noteNumber = explanationOfBenefitItem.noteNumber;
																		objectExplanationOfBenefitItem.adjudication = explanationOfBenefitItem.adjudication;
																		objectExplanationOfBenefitItem.detail	= explanationOfBenefitItem.detail;
																		newExplanationOfBenefitItem[index] = objectExplanationOfBenefitItem;

																		myEmitter.once('getExplanationOfBenefitItemEncounter', function(explanationOfBenefitItem, index, newExplanationOfBenefitItem, countExplanationOfBenefitItem){	
																			qString = {};
																			qString.item_id = explanationOfBenefitItem.id;
																			seedPhoenixFHIR.path.GET = {
																				"ExplanationOfBenefitItemEncounter": {
																					"location": "%(apikey)s/ExplanationOfBenefitItemEncounter",
																					"query": qString
																				}
																			}
																			var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																			ApiFHIR.get('ExplanationOfBenefitItemEncounter', {
																				"apikey": apikey
																			}, {}, function (error, response, body) {
																				explanationOfBenefitItemEncounter = JSON.parse(body);
																				if (explanationOfBenefitItemEncounter.err_code == 0) {
																					var objectExplanationOfBenefitItem = {};
																					objectExplanationOfBenefitItem.id = explanationOfBenefitItem.id;
																					objectExplanationOfBenefitItem.sequences = explanationOfBenefitItem.sequences;
																					objectExplanationOfBenefitItem.careTeamLinkId = explanationOfBenefitItem.careTeamLinkId;
																					objectExplanationOfBenefitItem.diagnosisLinkId = explanationOfBenefitItem.diagnosisLinkId;
																					objectExplanationOfBenefitItem.procedureLinkId = explanationOfBenefitItem.procedureLinkId;
																					objectExplanationOfBenefitItem.informationLinkId = explanationOfBenefitItem.informationLinkId;
																					objectExplanationOfBenefitItem.revenue = explanationOfBenefitItem.revenue;
																					objectExplanationOfBenefitItem.category = explanationOfBenefitItem.category;
																					objectExplanationOfBenefitItem.service = explanationOfBenefitItem.service;
																					objectExplanationOfBenefitItem.modifier = explanationOfBenefitItem.modifier;
																					objectExplanationOfBenefitItem.programCode = explanationOfBenefitItem.programCode;
																					objectExplanationOfBenefitItem.serviced = explanationOfBenefitItem.serviced;
																					objectExplanationOfBenefitItem.location = explanationOfBenefitItem.location;
																					objectExplanationOfBenefitItem.quantity = explanationOfBenefitItem.quantity;
																					objectExplanationOfBenefitItem.unitPrice = explanationOfBenefitItem.unitPrice;
																					objectExplanationOfBenefitItem.factor = explanationOfBenefitItem.factor;
																					objectExplanationOfBenefitItem.net = explanationOfBenefitItem.net;
																					objectExplanationOfBenefitItem.udi = explanationOfBenefitItem.udi;
																					objectExplanationOfBenefitItem.bodySite = explanationOfBenefitItem.bodySite;
																					objectExplanationOfBenefitItem.subSite = explanationOfBenefitItem.subSite;
																					objectExplanationOfBenefitItem.ncounter = explanationOfBenefitItemEncounter.data;
																					objectExplanationOfBenefitItem.noteNumber = explanationOfBenefitItem.noteNumber;
																					objectExplanationOfBenefitItem.adjudication = explanationOfBenefitItem.adjudication;
																					objectExplanationOfBenefitItem.detail	= explanationOfBenefitItem.detail;
																					newExplanationOfBenefitItem[index] = objectExplanationOfBenefitItem;

																					if (index == countExplanationOfBenefitItem - 1) {
																						res.json({
																							"err_code": 0,
																							"data": newExplanationOfBenefitItem
																						});
																					}
																				} else {
																					res.json(explanationOfBenefitItemEncounter);
																				}
																			})
																		})
																		myEmitter.emit('getExplanationOfBenefitItemEncounter', objectExplanationOfBenefitItem, index, newExplanationOfBenefitItem, countExplanationOfBenefitItem);
																	} else {
																		res.json(explanationOfBenefitItemUdi);
																	}
																})
															})
															myEmitter.emit('getExplanationOfBenefitItemUdi', objectExplanationOfBenefitItem, index, newExplanationOfBenefitItem, countExplanationOfBenefitItem);
														} else {
															res.json(explanationOfBenefitAdjudication);
														}
													})
												})
												myEmitter.emit('getExplanationOfBenefitAdjudication', explanationOfBenefitItem.data[i], i, newExplanationOfBenefitItem, explanationOfBenefitItem.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Explanation Of Benefit Item is empty."});	
										}
									}else{
										res.json(explanationOfBenefitItem);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Explanation Of Benefit Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		explanationOfBenefitItemDetail: function getExplanationOfBenefitItemDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitItemId = req.params.item_id;
			var explanationOfBenefitItemDetailId = req.params.detail_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "item_id|" + explanationOfBenefitItemId, 'explanation_of_benefit_item', function(resClaim){
						if(resClaim.err_code > 0){
							if(typeof explanationOfBenefitItemDetailId !== 'undefined' && !validator.isEmpty(explanationOfBenefitItemDetailId)){
								checkUniqeValue(apikey, "detail_id|" + explanationOfBenefitItemDetailId, 'explanation_of_benefit_item_detail', function(resExplanationOfBenefitItemDetailID){
									if(resExplanationOfBenefitItemDetailID.err_code > 0){
										//get explanationOfBenefitItemDetail
										qString = {};
										qString.item_id = explanationOfBenefitItemId;
										qString._id = explanationOfBenefitItemDetailId;
										seedPhoenixFHIR.path.GET = {
											"ExplanationOfBenefitItemDetail" : {
												"location": "%(apikey)s/ExplanationOfBenefitItemDetail",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ExplanationOfBenefitItemDetail', {"apikey": apikey}, {}, function(error, response, body){
											explanationOfBenefitItemDetail = JSON.parse(body);
											if(explanationOfBenefitItemDetail.err_code == 0){
												//res.json({"err_code": 0, "data":explanationOfBenefitItemDetail.data});	
												if(explanationOfBenefitItemDetail.data.length > 0){
													newExplanationOfBenefitItemDetail = [];
													for(i=0; i < explanationOfBenefitItemDetail.data.length; i++){
														myEmitter.once('getExplanationOfBenefitAdjudication', function(explanationOfBenefitItemDetail, index, newExplanationOfBenefitItemDetail, countExplanationOfBenefitItemDetail){	
															qString = {};
															qString.detail_id = explanationOfBenefitItemDetail.id;
															seedPhoenixFHIR.path.GET = {
																"ExplanationOfBenefitAdjudication": {
																	"location": "%(apikey)s/ExplanationOfBenefitAdjudication",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ExplanationOfBenefitAdjudication', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																explanationOfBenefitAdjudication = JSON.parse(body);
																if (explanationOfBenefitAdjudication.err_code == 0) {
																	var objectExplanationOfBenefitItemDetail = {};
																	objectExplanationOfBenefitItemDetail.id = explanationOfBenefitItemDetail.id;
																	objectExplanationOfBenefitItemDetail.sequences = explanationOfBenefitItemDetail.sequences;
																	objectExplanationOfBenefitItemDetail.type = explanationOfBenefitItemDetail.type;
																	objectExplanationOfBenefitItemDetail.revenue = explanationOfBenefitItemDetail.revenue;
																	objectExplanationOfBenefitItemDetail.category = explanationOfBenefitItemDetail.category;
																	objectExplanationOfBenefitItemDetail.service = explanationOfBenefitItemDetail.service;
																	objectExplanationOfBenefitItemDetail.modifier = explanationOfBenefitItemDetail.modifier;
																	objectExplanationOfBenefitItemDetail.programCode = explanationOfBenefitItemDetail.programCode;
																	objectExplanationOfBenefitItemDetail.quantity = explanationOfBenefitItemDetail.quantity;
																	objectExplanationOfBenefitItemDetail.unitPrice = explanationOfBenefitItemDetail.unitPrice;
																	objectExplanationOfBenefitItemDetail.factor = explanationOfBenefitItemDetail.factor;
																	objectExplanationOfBenefitItemDetail.net = explanationOfBenefitItemDetail.net;
																	objectExplanationOfBenefitItemDetail.noteNumber = explanationOfBenefitItemDetail.noteNumber;
																	objectExplanationOfBenefitItemDetail.adjudication = explanationOfBenefitAdjudication.data;
																	objectExplanationOfBenefitItemDetail.subDetail	= host + ':' + port + '/' + apikey + '/ExplanationOfBenefitItemDetail/' +  explanationOfBenefitItemDetail.id + '/ExplanationOfBenefitItemSubDetail';
																	newExplanationOfBenefitItemDetail[index] = objectExplanationOfBenefitItemDetail;

																	myEmitter.once('getExplanationOfBenefitItemDetailUdi', function(explanationOfBenefitItemDetail, index, newExplanationOfBenefitItemDetail, countExplanationOfBenefitItemDetail){	
																		qString = {};
																		qString.detail_id = explanationOfBenefitItemDetail.id;
																		seedPhoenixFHIR.path.GET = {
																			"ExplanationOfBenefitItemDetailUdi": {
																				"location": "%(apikey)s/ExplanationOfBenefitItemDetailUdi",
																				"query": qString
																			}
																		}
																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																		ApiFHIR.get('ExplanationOfBenefitItemDetailUdi', {
																			"apikey": apikey
																		}, {}, function (error, response, body) {
																			explanationOfBenefitItemDetailUdi = JSON.parse(body);
																			if (explanationOfBenefitItemDetailUdi.err_code == 0) {
																				var objectExplanationOfBenefitItemDetail = {};
																				objectExplanationOfBenefitItemDetail.id = explanationOfBenefitItemDetail.id;
																				objectExplanationOfBenefitItemDetail.sequences = explanationOfBenefitItemDetail.sequences;
																				objectExplanationOfBenefitItemDetail.type = explanationOfBenefitItemDetail.type;
																				objectExplanationOfBenefitItemDetail.revenue = explanationOfBenefitItemDetail.revenue;
																				objectExplanationOfBenefitItemDetail.category = explanationOfBenefitItemDetail.category;
																				objectExplanationOfBenefitItemDetail.service = explanationOfBenefitItemDetail.service;
																				objectExplanationOfBenefitItemDetail.modifier = explanationOfBenefitItemDetail.modifier;
																				objectExplanationOfBenefitItemDetail.programCode = explanationOfBenefitItemDetail.programCode;
																				objectExplanationOfBenefitItemDetail.quantity = explanationOfBenefitItemDetail.quantity;
																				objectExplanationOfBenefitItemDetail.unitPrice = explanationOfBenefitItemDetail.unitPrice;
																				objectExplanationOfBenefitItemDetail.factor = explanationOfBenefitItemDetail.factor;
																				objectExplanationOfBenefitItemDetail.net = explanationOfBenefitItemDetail.net;
																				objectExplanationOfBenefitItemDetail.udi = explanationOfBenefitItemDetailUdi.data;
																				objectExplanationOfBenefitItemDetail.noteNumber = explanationOfBenefitItemDetail.noteNumber;
																				objectExplanationOfBenefitItemDetail.adjudication = explanationOfBenefitItemDetail.adjudication;
																				objectExplanationOfBenefitItemDetail.subDetail	= explanationOfBenefitItemDetail.subDetail;
																				newExplanationOfBenefitItemDetail[index] = objectExplanationOfBenefitItemDetail;

																				if (index == countExplanationOfBenefitItemDetail - 1) {
																					res.json({
																						"err_code": 0,
																						"data": newExplanationOfBenefitItemDetail
																					});
																				}			
																			} else {
																				res.json(explanationOfBenefitItemDetailUdi);
																			}
																		})
																	})
																	myEmitter.emit('getExplanationOfBenefitItemDetailUdi', objectExplanationOfBenefitItemDetail, index, newExplanationOfBenefitItemDetail, countExplanationOfBenefitItemDetail);	
																} else {
																	res.json(explanationOfBenefitAdjudication);
																}
															})
														})
														myEmitter.emit('getExplanationOfBenefitAdjudication', explanationOfBenefitItemDetail.data[i], i, newExplanationOfBenefitItemDetail, explanationOfBenefitItemDetail.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Explanation Of Benefit Item Detail is empty."});	
												}
											}else{
												res.json(explanationOfBenefitItemDetail);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Explanation Of Benefit Item Detail Id not found"});		
									}
								})
							}else{
								//get explanationOfBenefitItemDetail
								qString = {};
								qString.item_id = explanationOfBenefitItemId;
								seedPhoenixFHIR.path.GET = {
									"ExplanationOfBenefitItemDetail" : {
										"location": "%(apikey)s/ExplanationOfBenefitItemDetail",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ExplanationOfBenefitItemDetail', {"apikey": apikey}, {}, function(error, response, body){
									explanationOfBenefitItemDetail = JSON.parse(body);
									if(explanationOfBenefitItemDetail.err_code == 0){
										//res.json({"err_code": 0, "data":explanationOfBenefitItemDetail.data});	
										if(explanationOfBenefitItemDetail.data.length > 0){
											newExplanationOfBenefitItemDetail = [];
											for(i=0; i < explanationOfBenefitItemDetail.data.length; i++){
												myEmitter.once('getExplanationOfBenefitAdjudication', function(explanationOfBenefitItemDetail, index, newExplanationOfBenefitItemDetail, countExplanationOfBenefitItemDetail){	
													qString = {};
													qString.detail_id = explanationOfBenefitItemDetail.id;
													seedPhoenixFHIR.path.GET = {
														"ExplanationOfBenefitAdjudication": {
															"location": "%(apikey)s/ExplanationOfBenefitAdjudication",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
													ApiFHIR.get('ExplanationOfBenefitAdjudication', {
														"apikey": apikey
													}, {}, function (error, response, body) {
														explanationOfBenefitAdjudication = JSON.parse(body);
														if (explanationOfBenefitAdjudication.err_code == 0) {
															var objectExplanationOfBenefitItemDetail = {};
															objectExplanationOfBenefitItemDetail.id = explanationOfBenefitItemDetail.id;
															objectExplanationOfBenefitItemDetail.sequences = explanationOfBenefitItemDetail.sequences;
															objectExplanationOfBenefitItemDetail.type = explanationOfBenefitItemDetail.type;
															objectExplanationOfBenefitItemDetail.revenue = explanationOfBenefitItemDetail.revenue;
															objectExplanationOfBenefitItemDetail.category = explanationOfBenefitItemDetail.category;
															objectExplanationOfBenefitItemDetail.service = explanationOfBenefitItemDetail.service;
															objectExplanationOfBenefitItemDetail.modifier = explanationOfBenefitItemDetail.modifier;
															objectExplanationOfBenefitItemDetail.programCode = explanationOfBenefitItemDetail.programCode;
															objectExplanationOfBenefitItemDetail.quantity = explanationOfBenefitItemDetail.quantity;
															objectExplanationOfBenefitItemDetail.unitPrice = explanationOfBenefitItemDetail.unitPrice;
															objectExplanationOfBenefitItemDetail.factor = explanationOfBenefitItemDetail.factor;
															objectExplanationOfBenefitItemDetail.net = explanationOfBenefitItemDetail.net;
															objectExplanationOfBenefitItemDetail.noteNumber = explanationOfBenefitItemDetail.noteNumber;
															objectExplanationOfBenefitItemDetail.adjudication = explanationOfBenefitAdjudication.data;
															objectExplanationOfBenefitItemDetail.subDetail	= host + ':' + port + '/' + apikey + '/ExplanationOfBenefitItemDetail/' +  explanationOfBenefitItemDetail.id + '/ExplanationOfBenefitItemSubDetail';
															newExplanationOfBenefitItemDetail[index] = objectExplanationOfBenefitItemDetail;

															myEmitter.once('getExplanationOfBenefitItemDetailUdi', function(explanationOfBenefitItemDetail, index, newExplanationOfBenefitItemDetail, countExplanationOfBenefitItemDetail){	
																qString = {};
																qString.detail_id = explanationOfBenefitItemDetail.id;
																seedPhoenixFHIR.path.GET = {
																	"ExplanationOfBenefitItemDetailUdi": {
																		"location": "%(apikey)s/ExplanationOfBenefitItemDetailUdi",
																		"query": qString
																	}
																}
																var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																ApiFHIR.get('ExplanationOfBenefitItemDetailUdi', {
																	"apikey": apikey
																}, {}, function (error, response, body) {
																	explanationOfBenefitItemDetailUdi = JSON.parse(body);
																	if (explanationOfBenefitItemDetailUdi.err_code == 0) {
																		var objectExplanationOfBenefitItemDetail = {};
																		objectExplanationOfBenefitItemDetail.id = explanationOfBenefitItemDetail.id;
																		objectExplanationOfBenefitItemDetail.sequences = explanationOfBenefitItemDetail.sequences;
																		objectExplanationOfBenefitItemDetail.type = explanationOfBenefitItemDetail.type;
																		objectExplanationOfBenefitItemDetail.revenue = explanationOfBenefitItemDetail.revenue;
																		objectExplanationOfBenefitItemDetail.category = explanationOfBenefitItemDetail.category;
																		objectExplanationOfBenefitItemDetail.service = explanationOfBenefitItemDetail.service;
																		objectExplanationOfBenefitItemDetail.modifier = explanationOfBenefitItemDetail.modifier;
																		objectExplanationOfBenefitItemDetail.programCode = explanationOfBenefitItemDetail.programCode;
																		objectExplanationOfBenefitItemDetail.quantity = explanationOfBenefitItemDetail.quantity;
																		objectExplanationOfBenefitItemDetail.unitPrice = explanationOfBenefitItemDetail.unitPrice;
																		objectExplanationOfBenefitItemDetail.factor = explanationOfBenefitItemDetail.factor;
																		objectExplanationOfBenefitItemDetail.net = explanationOfBenefitItemDetail.net;
																		objectExplanationOfBenefitItemDetail.udi = explanationOfBenefitItemDetailUdi.data;
																		objectExplanationOfBenefitItemDetail.noteNumber = explanationOfBenefitItemDetail.noteNumber;
																		objectExplanationOfBenefitItemDetail.adjudication = explanationOfBenefitItemDetail.adjudication;
																		objectExplanationOfBenefitItemDetail.subDetail	= explanationOfBenefitItemDetail.subDetail;
																		newExplanationOfBenefitItemDetail[index] = objectExplanationOfBenefitItemDetail;

																		if (index == countExplanationOfBenefitItemDetail - 1) {
																			res.json({
																				"err_code": 0,
																				"data": newExplanationOfBenefitItemDetail
																			});
																		}			
																	} else {
																		res.json(explanationOfBenefitItemDetailUdi);
																	}
																})
															})
															myEmitter.emit('getExplanationOfBenefitItemDetailUdi', objectExplanationOfBenefitItemDetail, index, newExplanationOfBenefitItemDetail, countExplanationOfBenefitItemDetail);	
														} else {
															res.json(explanationOfBenefitAdjudication);
														}
													})
												})
												myEmitter.emit('getExplanationOfBenefitAdjudication', explanationOfBenefitItemDetail.data[i], i, newExplanationOfBenefitItemDetail, explanationOfBenefitItemDetail.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Explanation Of Benefit Item Detail is empty."});	
										}
									}else{
										res.json(explanationOfBenefitItemDetail);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Explanation Of Benefit Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		explanationOfBenefitItemSubDetail: function getExplanationOfBenefitItemSubDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitDetailId = req.params.detail_id;
			var explanationOfBenefitItemSubDetailId = req.params.sub_detail_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "detail_id|" + explanationOfBenefitDetailId, 'explanation_of_benefit_item_detail', function(resClaim){
						if(resClaim.err_code > 0){
							if(typeof explanationOfBenefitItemSubDetailId !== 'undefined' && !validator.isEmpty(explanationOfBenefitItemSubDetailId)){
								checkUniqeValue(apikey, "sub_detail_id|" + explanationOfBenefitItemSubDetailId, 'explanation_of_benefit_item_sub_detail', function(resExplanationOfBenefitItemSubDetailID){
									if(resExplanationOfBenefitItemSubDetailID.err_code > 0){
										//get explanationOfBenefitItemSubDetail
										qString = {};
										qString.detail_id = explanationOfBenefitDetailId;
										qString._id = explanationOfBenefitItemSubDetailId;
										seedPhoenixFHIR.path.GET = {
											"ExplanationOfBenefitItemSubDetail" : {
												"location": "%(apikey)s/ExplanationOfBenefitItemSubDetail",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ExplanationOfBenefitItemSubDetail', {"apikey": apikey}, {}, function(error, response, body){
											explanationOfBenefitItemSubDetail = JSON.parse(body);
											if(explanationOfBenefitItemSubDetail.err_code == 0){
												//res.json({"err_code": 0, "data":explanationOfBenefitItemSubDetail.data});	
												if(explanationOfBenefitItemSubDetail.data.length > 0){
													newExplanationOfBenefitItemSubDetail = [];
													for(i=0; i < explanationOfBenefitItemSubDetail.data.length; i++){
														myEmitter.once('getExplanationOfBenefitAdjudication', function(explanationOfBenefitItemSubDetail, index, newExplanationOfBenefitItemSubDetail, countExplanationOfBenefitItemSubDetail){	
															qString = {};
															qString.sub_detail_id = explanationOfBenefitItemSubDetail.id;
															seedPhoenixFHIR.path.GET = {
																"ExplanationOfBenefitAdjudication": {
																	"location": "%(apikey)s/ExplanationOfBenefitAdjudication",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ExplanationOfBenefitAdjudication', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																explanationOfBenefitAdjudication = JSON.parse(body);
																if (explanationOfBenefitAdjudication.err_code == 0) {
																	var objectExplanationOfBenefitItemSubDetail = {};
																	objectExplanationOfBenefitItemSubDetail.id = explanationOfBenefitItemSubDetail.id;
																	objectExplanationOfBenefitItemSubDetail.sequences = explanationOfBenefitItemSubDetail.sequences;
																	objectExplanationOfBenefitItemSubDetail.type = explanationOfBenefitItemSubDetail.type;
																	objectExplanationOfBenefitItemSubDetail.revenue = explanationOfBenefitItemSubDetail.revenue;
																	objectExplanationOfBenefitItemSubDetail.category = explanationOfBenefitItemSubDetail.category;
																	objectExplanationOfBenefitItemSubDetail.service = explanationOfBenefitItemSubDetail.service;
																	objectExplanationOfBenefitItemSubDetail.modifier = explanationOfBenefitItemSubDetail.modifier;
																	objectExplanationOfBenefitItemSubDetail.programCode = explanationOfBenefitItemSubDetail.programCode;
																	objectExplanationOfBenefitItemSubDetail.quantity = explanationOfBenefitItemSubDetail.quantity;
																	objectExplanationOfBenefitItemSubDetail.unitPrice = explanationOfBenefitItemSubDetail.unitPrice;
																	objectExplanationOfBenefitItemSubDetail.factor = explanationOfBenefitItemSubDetail.factor;
																	objectExplanationOfBenefitItemSubDetail.net = explanationOfBenefitItemSubDetail.net;
																	objectExplanationOfBenefitItemSubDetail.noteNumber = explanationOfBenefitItemSubDetail.noteNumber;
																	objectExplanationOfBenefitItemSubDetail.adjudication = explanationOfBenefitAdjudication.data;
																	newExplanationOfBenefitItemSubDetail[index] = objectExplanationOfBenefitItemSubDetail;

																	myEmitter.once('getExplanationOfBenefitItemSubDetailUdi', function(explanationOfBenefitItemSubDetail, index, newExplanationOfBenefitItemSubDetail, countExplanationOfBenefitItemSubDetail){	
																		qString = {};
																		qString.sub_detail_id = explanationOfBenefitItemSubDetail.id;
																		seedPhoenixFHIR.path.GET = {
																			"ExplanationOfBenefitItemSubDetailUdi": {
																				"location": "%(apikey)s/ExplanationOfBenefitItemSubDetailUdi",
																				"query": qString
																			}
																		}
																		var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																		ApiFHIR.get('ExplanationOfBenefitItemSubDetailUdi', {
																			"apikey": apikey
																		}, {}, function (error, response, body) {
																			explanationOfBenefitItemSubDetailUdi = JSON.parse(body);
																			if (explanationOfBenefitItemSubDetailUdi.err_code == 0) {
																				var objectExplanationOfBenefitItemSubDetail = {};
																				objectExplanationOfBenefitItemSubDetail.id = explanationOfBenefitItemSubDetail.id;
																				objectExplanationOfBenefitItemSubDetail.sequences = explanationOfBenefitItemSubDetail.sequences;
																				objectExplanationOfBenefitItemSubDetail.type = explanationOfBenefitItemSubDetail.type;
																				objectExplanationOfBenefitItemSubDetail.revenue = explanationOfBenefitItemSubDetail.revenue;
																				objectExplanationOfBenefitItemSubDetail.category = explanationOfBenefitItemSubDetail.category;
																				objectExplanationOfBenefitItemSubDetail.service = explanationOfBenefitItemSubDetail.service;
																				objectExplanationOfBenefitItemSubDetail.modifier = explanationOfBenefitItemSubDetail.modifier;
																				objectExplanationOfBenefitItemSubDetail.programCode = explanationOfBenefitItemSubDetail.programCode;
																				objectExplanationOfBenefitItemSubDetail.quantity = explanationOfBenefitItemSubDetail.quantity;
																				objectExplanationOfBenefitItemSubDetail.unitPrice = explanationOfBenefitItemSubDetail.unitPrice;
																				objectExplanationOfBenefitItemSubDetail.factor = explanationOfBenefitItemSubDetail.factor;
																				objectExplanationOfBenefitItemSubDetail.net = explanationOfBenefitItemSubDetail.net;
																				objectExplanationOfBenefitItemSubDetail.udi = explanationOfBenefitItemSubDetailUdi.data;
																				objectExplanationOfBenefitItemSubDetail.noteNumber = explanationOfBenefitItemSubDetail.noteNumber;
																				objectExplanationOfBenefitItemSubDetail.adjudication = explanationOfBenefitItemSubDetail.adjudication;
																				newExplanationOfBenefitItemSubDetail[index] = objectExplanationOfBenefitItemSubDetail;

																				if (index == countExplanationOfBenefitItemSubDetail - 1) {
																					res.json({
																						"err_code": 0,
																						"data": newExplanationOfBenefitItemSubDetail
																					});
																				}			
																			} else {
																				res.json(explanationOfBenefitItemSubDetailUdi);
																			}
																		})
																	})
																	myEmitter.emit('getExplanationOfBenefitItemSubDetailUdi', objectExplanationOfBenefitItemSubDetail, index, newExplanationOfBenefitItemSubDetail, countExplanationOfBenefitItemSubDetail);		
																} else {
																	res.json(explanationOfBenefitItemSubDetailUdi);
																}
															})
														})
														myEmitter.emit('getExplanationOfBenefitAdjudication', explanationOfBenefitItemSubDetail.data[i], i, newExplanationOfBenefitItemSubDetail, explanationOfBenefitItemSubDetail.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Explanation Of Benefit Item Sub Detail is empty."});	
												}
											}else{
												res.json(explanationOfBenefitItemSubDetail);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Explanation Of Benefit Item Sub Detail Id not found"});		
									}
								})
							}else{
								//get explanationOfBenefitItemSubDetail
								qString = {};
								qString.detail_id = explanationOfBenefitDetailId;
								seedPhoenixFHIR.path.GET = {
									"ExplanationOfBenefitItemSubDetail" : {
										"location": "%(apikey)s/ExplanationOfBenefitItemSubDetail",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ExplanationOfBenefitItemSubDetail', {"apikey": apikey}, {}, function(error, response, body){
									explanationOfBenefitItemSubDetail = JSON.parse(body);
									if(explanationOfBenefitItemSubDetail.err_code == 0){
										//res.json({"err_code": 0, "data":explanationOfBenefitItemSubDetail.data});	
										if(explanationOfBenefitItemSubDetail.data.length > 0){
											newExplanationOfBenefitItemSubDetail = [];
											for(i=0; i < explanationOfBenefitItemSubDetail.data.length; i++){
												myEmitter.once('getExplanationOfBenefitAdjudication', function(explanationOfBenefitItemSubDetail, index, newExplanationOfBenefitItemSubDetail, countExplanationOfBenefitItemSubDetail){	
													qString = {};
													qString.sub_detail_id = explanationOfBenefitItemSubDetail.id;
													seedPhoenixFHIR.path.GET = {
														"ExplanationOfBenefitAdjudication": {
															"location": "%(apikey)s/ExplanationOfBenefitAdjudication",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
													ApiFHIR.get('ExplanationOfBenefitAdjudication', {
														"apikey": apikey
													}, {}, function (error, response, body) {
														explanationOfBenefitAdjudication = JSON.parse(body);
														if (explanationOfBenefitAdjudication.err_code == 0) {
															var objectExplanationOfBenefitItemSubDetail = {};
															objectExplanationOfBenefitItemSubDetail.id = explanationOfBenefitItemSubDetail.id;
															objectExplanationOfBenefitItemSubDetail.sequences = explanationOfBenefitItemSubDetail.sequences;
															objectExplanationOfBenefitItemSubDetail.type = explanationOfBenefitItemSubDetail.type;
															objectExplanationOfBenefitItemSubDetail.revenue = explanationOfBenefitItemSubDetail.revenue;
															objectExplanationOfBenefitItemSubDetail.category = explanationOfBenefitItemSubDetail.category;
															objectExplanationOfBenefitItemSubDetail.service = explanationOfBenefitItemSubDetail.service;
															objectExplanationOfBenefitItemSubDetail.modifier = explanationOfBenefitItemSubDetail.modifier;
															objectExplanationOfBenefitItemSubDetail.programCode = explanationOfBenefitItemSubDetail.programCode;
															objectExplanationOfBenefitItemSubDetail.quantity = explanationOfBenefitItemSubDetail.quantity;
															objectExplanationOfBenefitItemSubDetail.unitPrice = explanationOfBenefitItemSubDetail.unitPrice;
															objectExplanationOfBenefitItemSubDetail.factor = explanationOfBenefitItemSubDetail.factor;
															objectExplanationOfBenefitItemSubDetail.net = explanationOfBenefitItemSubDetail.net;
															objectExplanationOfBenefitItemSubDetail.noteNumber = explanationOfBenefitItemSubDetail.noteNumber;
															objectExplanationOfBenefitItemSubDetail.adjudication = explanationOfBenefitAdjudication.data;
															newExplanationOfBenefitItemSubDetail[index] = objectExplanationOfBenefitItemSubDetail;

															myEmitter.once('getExplanationOfBenefitItemSubDetailUdi', function(explanationOfBenefitItemSubDetail, index, newExplanationOfBenefitItemSubDetail, countExplanationOfBenefitItemSubDetail){	
																qString = {};
																qString.sub_detail_id = explanationOfBenefitItemSubDetail.id;
																seedPhoenixFHIR.path.GET = {
																	"ExplanationOfBenefitItemSubDetailUdi": {
																		"location": "%(apikey)s/ExplanationOfBenefitItemSubDetailUdi",
																		"query": qString
																	}
																}
																var ApiFHIR = new Apiclient(seedPhoenixFHIR);
																ApiFHIR.get('ExplanationOfBenefitItemSubDetailUdi', {
																	"apikey": apikey
																}, {}, function (error, response, body) {
																	explanationOfBenefitItemSubDetailUdi = JSON.parse(body);
																	if (explanationOfBenefitItemSubDetailUdi.err_code == 0) {
																		var objectExplanationOfBenefitItemSubDetail = {};
																		objectExplanationOfBenefitItemSubDetail.id = explanationOfBenefitItemSubDetail.id;
																		objectExplanationOfBenefitItemSubDetail.sequences = explanationOfBenefitItemSubDetail.sequences;
																		objectExplanationOfBenefitItemSubDetail.type = explanationOfBenefitItemSubDetail.type;
																		objectExplanationOfBenefitItemSubDetail.revenue = explanationOfBenefitItemSubDetail.revenue;
																		objectExplanationOfBenefitItemSubDetail.category = explanationOfBenefitItemSubDetail.category;
																		objectExplanationOfBenefitItemSubDetail.service = explanationOfBenefitItemSubDetail.service;
																		objectExplanationOfBenefitItemSubDetail.modifier = explanationOfBenefitItemSubDetail.modifier;
																		objectExplanationOfBenefitItemSubDetail.programCode = explanationOfBenefitItemSubDetail.programCode;
																		objectExplanationOfBenefitItemSubDetail.quantity = explanationOfBenefitItemSubDetail.quantity;
																		objectExplanationOfBenefitItemSubDetail.unitPrice = explanationOfBenefitItemSubDetail.unitPrice;
																		objectExplanationOfBenefitItemSubDetail.factor = explanationOfBenefitItemSubDetail.factor;
																		objectExplanationOfBenefitItemSubDetail.net = explanationOfBenefitItemSubDetail.net;
																		objectExplanationOfBenefitItemSubDetail.udi = explanationOfBenefitItemSubDetailUdi.data;
																		objectExplanationOfBenefitItemSubDetail.noteNumber = explanationOfBenefitItemSubDetail.noteNumber;
																		objectExplanationOfBenefitItemSubDetail.adjudication = explanationOfBenefitItemSubDetail.adjudication;
																		newExplanationOfBenefitItemSubDetail[index] = objectExplanationOfBenefitItemSubDetail;

																		if (index == countExplanationOfBenefitItemSubDetail - 1) {
																			res.json({
																				"err_code": 0,
																				"data": newExplanationOfBenefitItemSubDetail
																			});
																		}			
																	} else {
																		res.json(explanationOfBenefitItemSubDetailUdi);
																	}
																})
															})
															myEmitter.emit('getExplanationOfBenefitItemSubDetailUdi', objectExplanationOfBenefitItemSubDetail, index, newExplanationOfBenefitItemSubDetail, countExplanationOfBenefitItemSubDetail);		
														} else {
															res.json(explanationOfBenefitItemSubDetailUdi);
														}
													})
												})
												myEmitter.emit('getExplanationOfBenefitAdjudication', explanationOfBenefitItemSubDetail.data[i], i, newExplanationOfBenefitItemSubDetail, explanationOfBenefitItemSubDetail.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Explanation Of Benefit Item Sub Detail is empty."});	
										}
									}else{
										res.json(explanationOfBenefitItemSubDetail);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Explanation Of Benefit Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		explanationOfBenefitAddItem: function getExplanationOfBenefitAddItem(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var ExplanationOfBenefitId = req.params.explanation_of_benefit_id;
			var explanationOfBenefitAddItemId = req.params.add_item_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "explanation_of_benefit_id|" + ExplanationOfBenefitId, 'explanation_of_benefit', function(resClaim){
						if(resClaim.err_code > 0){
							if(typeof explanationOfBenefitAddItemId !== 'undefined' && !validator.isEmpty(explanationOfBenefitAddItemId)){
								checkUniqeValue(apikey, "add_item_id|" + explanationOfBenefitAddItemId, 'explanation_of_benefit_add_item', function(resExplanationOfBenefitAddItemID){
									if(resExplanationOfBenefitAddItemID.err_code > 0){
										//get explanationOfBenefitAddItem
										qString = {};
										qString.explanation_of_benefit_id = ExplanationOfBenefitId;
										qString._id = explanationOfBenefitAddItemId;
										seedPhoenixFHIR.path.GET = {
											"ExplanationOfBenefitAddItem" : {
												"location": "%(apikey)s/ExplanationOfBenefitAddItem",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ExplanationOfBenefitAddItem', {"apikey": apikey}, {}, function(error, response, body){
											explanationOfBenefitAddItem = JSON.parse(body);
											if(explanationOfBenefitAddItem.err_code == 0){
												//res.json({"err_code": 0, "data":explanationOfBenefitAddItem.data});	
												if(explanationOfBenefitAddItem.data.length > 0){
													newExplanationOfBenefitAddItem = [];
													for(i=0; i < explanationOfBenefitAddItem.data.length; i++){
														myEmitter.once('getExplanationOfBenefitAdjudication', function(explanationOfBenefitAddItem, index, newExplanationOfBenefitAddItem, countExplanationOfBenefitAddItem){	
															qString = {};
															qString.add_item_id = explanationOfBenefitAddItem.id;
															seedPhoenixFHIR.path.GET = {
																"ExplanationOfBenefitAdjudication": {
																	"location": "%(apikey)s/ExplanationOfBenefitAdjudication",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ExplanationOfBenefitAdjudication', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																explanationOfBenefitAdjudication = JSON.parse(body);
																if (explanationOfBenefitAdjudication.err_code == 0) {
																	var objectExplanationOfBenefitAddItem = {};
																	objectExplanationOfBenefitAddItem.id = explanationOfBenefitAddItem.id;
																	objectExplanationOfBenefitAddItem.sequenceLinkId = explanationOfBenefitAddItem.sequenceLinkId;
																	objectExplanationOfBenefitAddItem.revenue = explanationOfBenefitAddItem.revenue;
																	objectExplanationOfBenefitAddItem.category = explanationOfBenefitAddItem.category;
																	objectExplanationOfBenefitAddItem.service = explanationOfBenefitAddItem.service;
																	objectExplanationOfBenefitAddItem.modifier = explanationOfBenefitAddItem.modifier;
																	objectExplanationOfBenefitAddItem.fee = explanationOfBenefitAddItem.fee;
																	objectExplanationOfBenefitAddItem.noteNumber = explanationOfBenefitAddItem.noteNumber;
																	objectExplanationOfBenefitAddItem.adjudication = explanationOfBenefitAdjudication.data;
																	objectExplanationOfBenefitAddItem.detail	= host + ':' + port + '/' + apikey + '/ExplanationOfBenefitAddItem/' +  explanationOfBenefitAddItem.id + '/ExplanationOfBenefitAddItemDetail';
																	newExplanationOfBenefitAddItem[index] = objectExplanationOfBenefitAddItem;

																	if (index == countExplanationOfBenefitAddItem - 1) {
																		res.json({
																			"err_code": 0,
																			"data": newExplanationOfBenefitAddItem
																		});
																	}
																} else {
																	res.json(explanationOfBenefitAdjudication);
																}
															})
														})
														myEmitter.emit('getExplanationOfBenefitAdjudication', explanationOfBenefitAddItem.data[i], i, newExplanationOfBenefitAddItem, explanationOfBenefitAddItem.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Explanation Of Benefit AddItem is empty."});	
												}
											}else{
												res.json(explanationOfBenefitAddItem);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Explanation Of Benefit AddItem Id not found"});		
									}
								})
							}else{
								//get explanationOfBenefitAddItem
								qString = {};
								qString.explanation_of_benefit_id = ExplanationOfBenefitId;
								seedPhoenixFHIR.path.GET = {
									"ExplanationOfBenefitAddItem" : {
										"location": "%(apikey)s/ExplanationOfBenefitAddItem",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ExplanationOfBenefitAddItem', {"apikey": apikey}, {}, function(error, response, body){
									explanationOfBenefitAddItem = JSON.parse(body);
									if(explanationOfBenefitAddItem.err_code == 0){
										//res.json({"err_code": 0, "data":explanationOfBenefitAddItem.data});	
										if(explanationOfBenefitAddItem.data.length > 0){
											newExplanationOfBenefitAddItem = [];
											for(i=0; i < explanationOfBenefitAddItem.data.length; i++){
												myEmitter.once('getExplanationOfBenefitAdjudication', function(explanationOfBenefitAddItem, index, newExplanationOfBenefitAddItem, countExplanationOfBenefitAddItem){	
													qString = {};
													qString.add_item_id = explanationOfBenefitAddItem.id;
													seedPhoenixFHIR.path.GET = {
														"ExplanationOfBenefitAdjudication": {
															"location": "%(apikey)s/ExplanationOfBenefitAdjudication",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
													ApiFHIR.get('ExplanationOfBenefitAdjudication', {
														"apikey": apikey
													}, {}, function (error, response, body) {
														explanationOfBenefitAdjudication = JSON.parse(body);
														if (explanationOfBenefitAdjudication.err_code == 0) {
															var objectExplanationOfBenefitAddItem = {};
															objectExplanationOfBenefitAddItem.id = explanationOfBenefitAddItem.id;
															objectExplanationOfBenefitAddItem.sequenceLinkId = explanationOfBenefitAddItem.sequenceLinkId;
															objectExplanationOfBenefitAddItem.revenue = explanationOfBenefitAddItem.revenue;
															objectExplanationOfBenefitAddItem.category = explanationOfBenefitAddItem.category;
															objectExplanationOfBenefitAddItem.service = explanationOfBenefitAddItem.service;
															objectExplanationOfBenefitAddItem.modifier = explanationOfBenefitAddItem.modifier;
															objectExplanationOfBenefitAddItem.fee = explanationOfBenefitAddItem.fee;
															objectExplanationOfBenefitAddItem.noteNumber = explanationOfBenefitAddItem.noteNumber;
															objectExplanationOfBenefitAddItem.adjudication = explanationOfBenefitAdjudication.data;
															objectExplanationOfBenefitAddItem.detail	= host + ':' + port + '/' + apikey + '/ExplanationOfBenefitAddItem/' +  explanationOfBenefitAddItem.id + '/ExplanationOfBenefitAddItemDetail';
															newExplanationOfBenefitAddItem[index] = objectExplanationOfBenefitAddItem;

															if (index == countExplanationOfBenefitAddItem - 1) {
																res.json({
																	"err_code": 0,
																	"data": newExplanationOfBenefitAddItem
																});
															}
														} else {
															res.json(explanationOfBenefitAdjudication);
														}
													})
												})
												myEmitter.emit('getExplanationOfBenefitAdjudication', explanationOfBenefitAddItem.data[i], i, newExplanationOfBenefitAddItem, explanationOfBenefitAddItem.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Explanation Of Benefit AddItem is empty."});	
										}
									}else{
										res.json(explanationOfBenefitAddItem);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Explanation Of Benefit Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		explanationOfBenefitAddItemDetail: function getExplanationOfBenefitAddItemDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitAddItemId = req.params.add_item_id;
			var explanationOfBenefitAddItemDetailId = req.params.add_item_detail_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "add_item_id|" + explanationOfBenefitAddItemId, 'explanation_of_benefit_add_item', function(resClaim){
						if(resClaim.err_code > 0){
							if(typeof explanationOfBenefitAddItemDetailId !== 'undefined' && !validator.isEmpty(explanationOfBenefitAddItemDetailId)){
								checkUniqeValue(apikey, "add_item_detail_id|" + explanationOfBenefitAddItemDetailId, 'explanation_of_benefit_add_item_detail', function(resExplanationOfBenefitAddItemDetailID){
									if(resExplanationOfBenefitAddItemDetailID.err_code > 0){
										//get explanationOfBenefitAddItemDetail
										qString = {};
										qString.add_item_id = explanationOfBenefitAddItemId;
										qString._id = explanationOfBenefitAddItemDetailId;
										seedPhoenixFHIR.path.GET = {
											"ExplanationOfBenefitAddItemDetail" : {
												"location": "%(apikey)s/ExplanationOfBenefitAddItemDetail",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ExplanationOfBenefitAddItemDetail', {"apikey": apikey}, {}, function(error, response, body){
											explanationOfBenefitAddItemDetail = JSON.parse(body);
											if(explanationOfBenefitAddItemDetail.err_code == 0){
												//res.json({"err_code": 0, "data":explanationOfBenefitAddItemDetail.data});	
												if(explanationOfBenefitAddItemDetail.data.length > 0){
													newExplanationOfBenefitAddItemDetail = [];
													for(i=0; i < explanationOfBenefitAddItemDetail.data.length; i++){
														myEmitter.once('getExplanationOfBenefitAdjudication', function(explanationOfBenefitAddItemDetail, index, newExplanationOfBenefitAddItemDetail, countExplanationOfBenefitAddItemDetail){	
															qString = {};
															qString.add_item_detail_id = explanationOfBenefitAddItemDetail.id;
															seedPhoenixFHIR.path.GET = {
																"ExplanationOfBenefitAdjudication": {
																	"location": "%(apikey)s/ExplanationOfBenefitAdjudication",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ExplanationOfBenefitAdjudication', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																explanationOfBenefitAdjudication = JSON.parse(body);
																if (explanationOfBenefitAdjudication.err_code == 0) {
																	var objectExplanationOfBenefitAddItemDetail = {};
																	objectExplanationOfBenefitAddItemDetail.id = explanationOfBenefitAddItemDetail.id;
																	objectExplanationOfBenefitAddItemDetail.revenue = explanationOfBenefitAddItemDetail.revenue;
																	objectExplanationOfBenefitAddItemDetail.category = explanationOfBenefitAddItemDetail.category;
																	objectExplanationOfBenefitAddItemDetail.service = explanationOfBenefitAddItemDetail.service;
																	objectExplanationOfBenefitAddItemDetail.modifier = explanationOfBenefitAddItemDetail.modifier;
																	objectExplanationOfBenefitAddItemDetail.fee = explanationOfBenefitAddItemDetail.fee;
																	objectExplanationOfBenefitAddItemDetail.noteNumber = explanationOfBenefitAddItemDetail.noteNumber;
																	objectExplanationOfBenefitAddItemDetail.adjudication = explanationOfBenefitAdjudication.data;
																	newExplanationOfBenefitAddItemDetail[index] = objectExplanationOfBenefitAddItemDetail;

																	if (index == countExplanationOfBenefitAddItemDetail - 1) {
																		res.json({
																			"err_code": 0,
																			"data": newExplanationOfBenefitAddItemDetail
																		});
																	}			
																} else {
																	res.json(explanationOfBenefitAdjudication);
																}
															})
														})
														myEmitter.emit('getExplanationOfBenefitAdjudication', explanationOfBenefitAddItemDetail.data[i], i, newExplanationOfBenefitAddItemDetail, explanationOfBenefitAddItemDetail.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Explanation Of Benefit AddItem Detail is empty."});	
												}
											}else{
												res.json(explanationOfBenefitAddItemDetail);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Explanation Of Benefit AddItem Detail Id not found"});		
									}
								})
							}else{
								//get explanationOfBenefitAddItemDetail
								qString = {};
								qString.add_item_id = explanationOfBenefitAddItemId;
								seedPhoenixFHIR.path.GET = {
									"ExplanationOfBenefitAddItemDetail" : {
										"location": "%(apikey)s/ExplanationOfBenefitAddItemDetail",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ExplanationOfBenefitAddItemDetail', {"apikey": apikey}, {}, function(error, response, body){
									explanationOfBenefitAddItemDetail = JSON.parse(body);
									if(explanationOfBenefitAddItemDetail.err_code == 0){
										//res.json({"err_code": 0, "data":explanationOfBenefitAddItemDetail.data});	
										if(explanationOfBenefitAddItemDetail.data.length > 0){
											newExplanationOfBenefitAddItemDetail = [];
											for(i=0; i < explanationOfBenefitAddItemDetail.data.length; i++){
												myEmitter.once('getExplanationOfBenefitAdjudication', function(explanationOfBenefitAddItemDetail, index, newExplanationOfBenefitAddItemDetail, countExplanationOfBenefitAddItemDetail){	
													qString = {};
													qString.add_item_detail_id = explanationOfBenefitAddItemDetail.id;
													seedPhoenixFHIR.path.GET = {
														"ExplanationOfBenefitAdjudication": {
															"location": "%(apikey)s/ExplanationOfBenefitAdjudication",
															"query": qString
														}
													}
													var ApiFHIR = new Apiclient(seedPhoenixFHIR);
													ApiFHIR.get('ExplanationOfBenefitAdjudication', {
														"apikey": apikey
													}, {}, function (error, response, body) {
														explanationOfBenefitAdjudication = JSON.parse(body);
														if (explanationOfBenefitAdjudication.err_code == 0) {
															var objectExplanationOfBenefitAddItemDetail = {};
															objectExplanationOfBenefitAddItemDetail.id = explanationOfBenefitAddItemDetail.id;
															objectExplanationOfBenefitAddItemDetail.revenue = explanationOfBenefitAddItemDetail.revenue;
															objectExplanationOfBenefitAddItemDetail.category = explanationOfBenefitAddItemDetail.category;
															objectExplanationOfBenefitAddItemDetail.service = explanationOfBenefitAddItemDetail.service;
															objectExplanationOfBenefitAddItemDetail.modifier = explanationOfBenefitAddItemDetail.modifier;
															objectExplanationOfBenefitAddItemDetail.fee = explanationOfBenefitAddItemDetail.fee;
															objectExplanationOfBenefitAddItemDetail.noteNumber = explanationOfBenefitAddItemDetail.noteNumber;
															objectExplanationOfBenefitAddItemDetail.adjudication = explanationOfBenefitAdjudication.data;
															newExplanationOfBenefitAddItemDetail[index] = objectExplanationOfBenefitAddItemDetail;

															if (index == countExplanationOfBenefitAddItemDetail - 1) {
																res.json({
																	"err_code": 0,
																	"data": newExplanationOfBenefitAddItemDetail
																});
															}			
														} else {
															res.json(explanationOfBenefitAdjudication);
														}
													})
												})
												myEmitter.emit('getExplanationOfBenefitAdjudication', explanationOfBenefitAddItemDetail.data[i], i, newExplanationOfBenefitAddItemDetail, explanationOfBenefitAddItemDetail.data.length);
											}
										}else{
											res.json({"err_code": 2, "err_msg": "Explanation Of Benefit AddItem Detail is empty."});	
										}
									}else{
										res.json(explanationOfBenefitAddItemDetail);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Explanation Of Benefit Id not found"});		
						}
					})
				}else{
					result.err_code = 500;
					res.json(result);
				}	
			});
		},
		explanationOfBenefitBalance: function getExplanationOfBenefitBalance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var ExplanationOfBenefitId = req.params.explanation_of_benefit_id;
			var explanationOfBenefitBalanceId = req.params.balance_id;

			checkApikey(apikey, ipAddres, function(result){
				if(result.err_code == 0){	
					checkUniqeValue(apikey, "explanation_of_benefit_id|" + ExplanationOfBenefitId, 'explanation_of_benefit', function(resClaim){
						if(resClaim.err_code > 0){
							if(typeof explanationOfBenefitBalanceId !== 'undefined' && !validator.isEmpty(explanationOfBenefitBalanceId)){
								checkUniqeValue(apikey, "balance_id|" + explanationOfBenefitBalanceId, 'explanation_of_benefit_balance', function(resExplanationOfBenefitBalanceID){
									if(resExplanationOfBenefitBalanceID.err_code > 0){
										//get explanationOfBenefitBalance
										qString = {};
										qString.explanation_of_benefit_id = ExplanationOfBenefitId;
										qString._id = explanationOfBenefitBalanceId;
										seedPhoenixFHIR.path.GET = {
											"ExplanationOfBenefitBalance" : {
												"location": "%(apikey)s/ExplanationOfBenefitBalance",
												"query": qString
											}
										}
										var ApiFHIR = new Apiclient(seedPhoenixFHIR);

										ApiFHIR.get('ExplanationOfBenefitBalance', {"apikey": apikey}, {}, function(error, response, body){
											explanationOfBenefitBalance = JSON.parse(body);
											if(explanationOfBenefitBalance.err_code == 0){
												//res.json({"err_code": 0, "data":explanationOfBenefitBalance.data});	
												if(explanationOfBenefitBalance.data.length > 0){
													newExplanationOfBenefitBalance = [];
													for(i=0; i < explanationOfBenefitBalance.data.length; i++){
														myEmitter.once('getExplanationOfBenefitBalanceFinancial', function(explanationOfBenefitBalance, index, newExplanationOfBenefitBalance, countExplanationOfBenefitBalance){	
															qString = {};
															qString.balance_id = explanationOfBenefitBalance.id;
															seedPhoenixFHIR.path.GET = {
																"ExplanationOfBenefitBalanceFinancial": {
																	"location": "%(apikey)s/ExplanationOfBenefitBalanceFinancial",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ExplanationOfBenefitBalanceFinancial', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																explanationOfBenefitBalanceFinancial = JSON.parse(body);
																if (explanationOfBenefitBalanceFinancial.err_code == 0) {
																	var objectExplanationOfBenefitBalance = {};
																	objectExplanationOfBenefitBalance.id = explanationOfBenefitBalance.id;
																	objectExplanationOfBenefitBalance.sequenceLinkId = explanationOfBenefitBalance.sequenceLinkId;
																	objectExplanationOfBenefitBalance.category = explanationOfBenefitBalance.category;
																	objectExplanationOfBenefitBalance.subCategory = explanationOfBenefitBalance.subCategory;
																	objectExplanationOfBenefitBalance.excluded = explanationOfBenefitBalance.excluded;
																	objectExplanationOfBenefitBalance.name = explanationOfBenefitBalance.name;
																	objectExplanationOfBenefitBalance.desciption = explanationOfBenefitBalance.desciption;
																	objectExplanationOfBenefitBalance.network = explanationOfBenefitBalance.network;
																	objectExplanationOfBenefitBalance.unit = explanationOfBenefitBalance.unit;
																	objectExplanationOfBenefitBalance.term = explanationOfBenefitBalance.term;
																	newExplanationOfBenefitBalance[index] = objectExplanationOfBenefitBalance;

																	if (index == countExplanationOfBenefitBalance - 1) {
																		res.json({
																			"err_code": 0,
																			"data": newExplanationOfBenefitBalance
																		});
																	}
																} else {
																	res.json(explanationOfBenefitBalanceFinancial);
																}
															})
														})
														myEmitter.emit('getExplanationOfBenefitBalanceFinancial', explanationOfBenefitBalance.data[i], i, newExplanationOfBenefitBalance, explanationOfBenefitBalance.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Explanation Of Benefit Balance is empty."});	
												}
											}else{
												res.json(explanationOfBenefitBalance);
											}
										})
									}else{
										res.json({"err_code": 502, "err_msg": "Explanation Of Benefit Balance Id not found"});		
									}
								})
							}else{
								//get explanationOfBenefitBalance
								qString = {};
								qString.explanation_of_benefit_id = ExplanationOfBenefitId;
								seedPhoenixFHIR.path.GET = {
									"ExplanationOfBenefitBalance" : {
										"location": "%(apikey)s/ExplanationOfBenefitBalance",
										"query": qString
									}
								}
								var ApiFHIR = new Apiclient(seedPhoenixFHIR);

								ApiFHIR.get('ExplanationOfBenefitBalance', {"apikey": apikey}, {}, function(error, response, body){
									explanationOfBenefitBalance = JSON.parse(body);
									if(explanationOfBenefitBalance.err_code == 0){
										//res.json({"err_code": 0, "data":explanationOfBenefitBalance.data});	
										if(explanationOfBenefitBalance.data.length > 0){
													newExplanationOfBenefitBalance = [];
													for(i=0; i < explanationOfBenefitBalance.data.length; i++){
														myEmitter.once('getExplanationOfBenefitBalanceFinancial', function(explanationOfBenefitBalance, index, newExplanationOfBenefitBalance, countExplanationOfBenefitBalance){	
															qString = {};
															qString.balance_id = explanationOfBenefitBalance.id;
															seedPhoenixFHIR.path.GET = {
																"ExplanationOfBenefitBalanceFinancial": {
																	"location": "%(apikey)s/ExplanationOfBenefitBalanceFinancial",
																	"query": qString
																}
															}
															var ApiFHIR = new Apiclient(seedPhoenixFHIR);
															ApiFHIR.get('ExplanationOfBenefitBalanceFinancial', {
																"apikey": apikey
															}, {}, function (error, response, body) {
																explanationOfBenefitBalanceFinancial = JSON.parse(body);
																if (explanationOfBenefitBalanceFinancial.err_code == 0) {
																	var objectExplanationOfBenefitBalance = {};
																	objectExplanationOfBenefitBalance.id = explanationOfBenefitBalance.id;
																	objectExplanationOfBenefitBalance.sequenceLinkId = explanationOfBenefitBalance.sequenceLinkId;
																	objectExplanationOfBenefitBalance.category = explanationOfBenefitBalance.category;
																	objectExplanationOfBenefitBalance.subCategory = explanationOfBenefitBalance.subCategory;
																	objectExplanationOfBenefitBalance.excluded = explanationOfBenefitBalance.excluded;
																	objectExplanationOfBenefitBalance.name = explanationOfBenefitBalance.name;
																	objectExplanationOfBenefitBalance.desciption = explanationOfBenefitBalance.desciption;
																	objectExplanationOfBenefitBalance.network = explanationOfBenefitBalance.network;
																	objectExplanationOfBenefitBalance.unit = explanationOfBenefitBalance.unit;
																	objectExplanationOfBenefitBalance.term = explanationOfBenefitBalance.term;
																	newExplanationOfBenefitBalance[index] = objectExplanationOfBenefitBalance;

																	if (index == countExplanationOfBenefitBalance - 1) {
																		res.json({
																			"err_code": 0,
																			"data": newExplanationOfBenefitBalance
																		});
																	}
																} else {
																	res.json(explanationOfBenefitBalanceFinancial);
																}
															})
														})
														myEmitter.emit('getExplanationOfBenefitBalanceFinancial', explanationOfBenefitBalance.data[i], i, newExplanationOfBenefitBalance, explanationOfBenefitBalance.data.length);
													}
												}else{
													res.json({"err_code": 2, "err_msg": "Explanation Of Benefit Balance is empty."});	
												}
									}else{
										res.json(explanationOfBenefitBalance);
									}
								})
							}
						}else{
							res.json({"err_code": 501, "err_msg": "Explanation Of Benefit Id not found"});		
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
		explanationOfBenefit: function addExplanationOfBenefit(req, res) {
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
type|type|||
subType|subType|||
patient|patient|||
billablePeriod|billablePeriod|period||
created|created|date||
enterer|enterer|||
insurer|insurer|||
provider|provider|||
organization|organization|||
referral|referral|||
facility|facility|||
claim|claim|||
claimResponse|claimResponse|||
outcome|outcome|||
disposition|disposition|||
related.claim|relatedClaim|||
related.relationship|relatedRelationship|||
related.reference|relatedReference|||
prescription.medicationRequest|prescriptionMedicationRequest|||
prescription.visionPrescription|prescriptionVisionPrescription|||
originalPrescription|originalPrescription|||
payee.type|payeeType|||
payee.resourceType|payeeResourceType|||
payee.party.practitioner|payeePartyPractitioner|||
payee.party.organization|payeePartyOrganization|||
payee.party.patient|payeePartyPatient|||
payee.party.relatedPerson|payeePartyRelatedPerson|||
information.sequence|informationSequence|integer|n|
information.category|informationCategory||n|
information.code|informationCode|||
information.timing.timingDate|informationTimingTimingDate|date||
information.timing.timingPeriod|informationTimingTimingPeriod|period||
information.value.valueString|informationValueString|||
information.value.valueQuantity|informationValueQuantity||
information.value.valueAttachment.contentType|informationValueAttachmentContentType|||
information.value.valueAttachment.language|informationValueAttachmentLanguage|||
information.value.valueAttachment.data|informationValueAttachmentData|||
information.value.valueAttachment.size|informationValueAttachmentSize|||
information.value.valueAttachment.title|informationValueAttachmentTitle|||
information.value.valueReference|informationValueReference|||
information.reason|informationReason|||
careTeam.sequence|careTeamSequence|integer|n|
careTeam.provider.practitioner|careTeamProviderPractitioner|||
careTeam.provider.organization|careTeamProviderOrganization|||
careTeam.responsible|careTeamResponsible|boolean||
careTeam.role|careTeamRole|||
careTeam.qualification|careTeamQualification|||
diagnosis.sequence|diagnosisSequence|integer|n|
diagnosis.diagnosis.diagnosisCodeableConcept|diagnosisCodeableConcept||n|
diagnosis.diagnosis.diagnosisReference|diagnosisReference|||
diagnosis.type|diagnosisType|||
diagnosis.packageCode|diagnosisPackageCode|||
procedure.sequence|procedureSequence|integer|n|
procedure.date|procedureDate|date||
procedure.procedure.procedureCodeableConcept|procedureCodeableConcept||n|
procedure.procedure.procedureReference|procedureReference|||
precedence|precedence|integer||
insurance.coverage|insuranceCoverage|||
insurance.preAuthRef|insurancePreAuthRef|||
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
item.noteNumber|itemNoteNumber|integer||
item.adjudication.category|itemAdjudicationCategory||n|
item.adjudication.reason|itemAdjudicationReason|||
item.adjudication.amount|itemAdjudicationAmount|||
item.adjudication.value|itemAdjudicationValue|integer||
item.detail.sequence|itemDetailSequence|integer|n|
item.detail.type|itemDetailType||n|u
item.detail.revenue|itemDetailRevenue|||
item.detail.category|itemDetailCategory|||u
item.detail.service|itemDetailService|||
item.detail.modifier|itemDetailModifier|||
item.detail.programCode|itemDetailProgramCode|||
item.detail.quantity|itemDetailQuantity|||
item.detail.unitPrice|itemDetailUnitPrice|||
item.detail.factor|itemDetailFactor|||
item.detail.net|itemDetailNet|||
item.detail.udi|itemDetailUdi|||
item.detail.noteNumber|itemDetailNoteNumber|||
item.detail.adjudication.category|itemDetailAdjudicationCategory||n|
item.detail.adjudication.reason|itemDetailAdjudicationReason|||
item.detail.adjudication.amount|itemDetailAdjudicationAmount|||
item.detail.adjudication.value|itemDetailAdjudicationValue|integer||
item.detail.subDetail.sequence|itemSubDetailSequence|integer|n|
item.detail.subDetail.type|itemSubDetailType||n|u
item.detail.subDetail.revenue|itemSubDetailRevenue|||
item.detail.subDetail.category|itemSubDetailCategory|||u
item.detail.subDetail.service|itemSubDetailService|||
item.detail.subDetail.modifier|itemSubDetailModifier|||
item.detail.subDetail.programCode|itemSubDetailProgramCode|||
item.detail.subDetail.quantity|itemSubDetailQuantity|||
item.detail.subDetail.unitPrice|itemSubDetailUnitPrice|||
item.detail.subDetail.factor|itemSubDetailFactor|||
item.detail.subDetail.net|itemSubDetailNet|||
item.detail.subDetail.udi|itemSubDetailUdi|||
item.detail.subDetail.noteNumber|itemSubDetailNoteNumber|||
item.detail.subDetail.adjudication.category|itemSubDetailAdjudicationCategory||n|
item.detail.subDetail.adjudication.reason|itemSubDetailAdjudicationReason|||
item.detail.subDetail.adjudication.amount|itemSubDetailAdjudicationAmount|||
item.detail.subDetail.adjudication.value|itemSubDetailAdjudicationValue|integer||
addItem.sequenceLinkId|addItemSequenceLinkId|integer||
addItem.revenue|addItemRevenue|||
addItem.category|addItemCategory|||u
addItem.service|addItemService|||
addItem.modifier|addItemModifier|||
addItem.fee|addItemFee|integer||
addItem.noteNumber|addItemNoteNumber|||
addItem.adjudication.category|addItemAdjudicationCategory||n|
addItem.adjudication.reason|addItemAdjudicationReason|||
addItem.adjudication.amount|addItemAdjudicationAmount|||
addItem.adjudication.value|addItemAdjudicationValue|integer||
addItem.detail.revenue|addItemDetailRevenue|||
addItem.detail.category|addItemDetailCategory|||u
addItem.detail.service|addItemDetailService|||
addItem.detail.modifier|addItemDetailModifier|||
addItem.detail.fee|addItemDetailFee|integer||
addItem.detail.noteNumber|addItemDetailNoteNumber|||
addItem.detail.adjudication.category|addItemDetailAdjudicationCategory||n|
addItem.detail.adjudication.reason|addItemDetailAdjudicationReason|||
addItem.detail.adjudication.amount|addItemDetailAdjudicationAmount|||
addItem.detail.adjudication.value|addItemDetailAdjudicationValue|integer||
totalCost|totalCost|||
unallocDeductable|unallocDeductable|||
totalBenefit|totalBenefit|||
payment.type|paymentType|||
payment.adjustment|paymentAdjustment|||
payment.adjustmentReason|paymentAdjustmentReason|||
payment.date|paymentDate|date||
payment.amount|paymentAmount|||
payment.identifier.use|paymentIdentifierUse|||
payment.identifier.type|paymentIdentifierType|||
payment.identifier.value|paymentIdentifierValue|||
payment.identifier.period|paymentIdentifierPeriod|period||
form|form|||
processNote.number|processNoteNumber|integer||
processNote.type|processNoteType|||
processNote.text|processNoteText|||
processNote.language|processNoteLanguage|||a
benefitBalance.category|benefitBalanceCategory||n|
benefitBalance.subCategory|benefitBalanceSubCategory|||u
benefitBalance.excluded|benefitBalanceExcluded|boolean||
benefitBalance.name|benefitBalanceName|||
benefitBalance.description|benefitBalanceDescription|||
benefitBalance.network|benefitBalanceNetwork|||
benefitBalance.unit|benefitBalanceUnit|||
benefitBalance.term|benefitBalanceTerm|||
benefitBalance.financial.type|benefitBalanceFinancialType||n|
benefitBalance.financial.allowed.allowedUnsignedInt|benefitBalanceFinancialAllowedUnsignedInt|integer||
benefitBalance.financial.allowed.allowedString|benefitBalanceFinancialAllowedString|||
benefitBalance.financial.allowed.allowedMoney|benefitBalanceFinancialAllowedMoney|||
benefitBalance.financial.used.usedUnsignedInt|benefitBalanceFinancialUsedUnsignedInt|integer||
benefitBalance.financial.used.usedMoney|benefitBalanceFinancialUsedMoney|||
*/			
			if(typeof req.body.status !== 'undefined'){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					status = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'status' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.type !== 'undefined'){
				var type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					type = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.subType !== 'undefined'){
				var subType =  req.body.subType.trim().toLowerCase();
				if(validator.isEmpty(subType)){
					subType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'sub type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.patient !== 'undefined'){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					patient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'patient' in json Explanation Of Benefit request.";
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
				      err_msg = "Explanation Of Benefit billable period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Explanation Of Benefit billable period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'billable period' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.created !== 'undefined'){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					created = "";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "Explanation Of Benefit created invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'created' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.enterer !== 'undefined'){
				var enterer =  req.body.enterer.trim().toLowerCase();
				if(validator.isEmpty(enterer)){
					enterer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'enterer' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.insurer !== 'undefined'){
				var insurer =  req.body.insurer.trim().toLowerCase();
				if(validator.isEmpty(insurer)){
					insurer = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurer' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.provider !== 'undefined'){
				var provider =  req.body.provider.trim().toLowerCase();
				if(validator.isEmpty(provider)){
					provider = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'provider' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.organization !== 'undefined'){
				var organization =  req.body.organization.trim().toLowerCase();
				if(validator.isEmpty(organization)){
					organization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'organization' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.referral !== 'undefined'){
				var referral =  req.body.referral.trim().toLowerCase();
				if(validator.isEmpty(referral)){
					referral = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'referral' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.facility !== 'undefined'){
				var facility =  req.body.facility.trim().toLowerCase();
				if(validator.isEmpty(facility)){
					facility = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'facility' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.claim !== 'undefined'){
				var claim =  req.body.claim.trim().toLowerCase();
				if(validator.isEmpty(claim)){
					claim = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'claim' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.claimResponse !== 'undefined'){
				var claimResponse =  req.body.claimResponse.trim().toLowerCase();
				if(validator.isEmpty(claimResponse)){
					claimResponse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'claim response' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.outcome !== 'undefined'){
				var outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					outcome = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'outcome' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.disposition !== 'undefined'){
				var disposition =  req.body.disposition.trim().toLowerCase();
				if(validator.isEmpty(disposition)){
					disposition = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'disposition' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.related.claim !== 'undefined'){
				var relatedClaim =  req.body.related.claim.trim().toLowerCase();
				if(validator.isEmpty(relatedClaim)){
					relatedClaim = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'related claim' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.related.relationship !== 'undefined'){
				var relatedRelationship =  req.body.related.relationship.trim().toLowerCase();
				if(validator.isEmpty(relatedRelationship)){
					relatedRelationship = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'related relationship' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.related.reference !== 'undefined'){
				var relatedReference =  req.body.related.reference.trim().toLowerCase();
				if(validator.isEmpty(relatedReference)){
					relatedReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'related reference' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.prescription.medicationRequest !== 'undefined'){
				var prescriptionMedicationRequest =  req.body.prescription.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(prescriptionMedicationRequest)){
					prescriptionMedicationRequest = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prescription medication request' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.prescription.visionPrescription !== 'undefined'){
				var prescriptionVisionPrescription =  req.body.prescription.visionPrescription.trim().toLowerCase();
				if(validator.isEmpty(prescriptionVisionPrescription)){
					prescriptionVisionPrescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'prescription vision prescription' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.originalPrescription !== 'undefined'){
				var originalPrescription =  req.body.originalPrescription.trim().toLowerCase();
				if(validator.isEmpty(originalPrescription)){
					originalPrescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'original prescription' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.payee.type !== 'undefined'){
				var payeeType =  req.body.payee.type.trim().toLowerCase();
				if(validator.isEmpty(payeeType)){
					payeeType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payee type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.payee.resourceType !== 'undefined'){
				var payeeResourceType =  req.body.payee.resourceType.trim().toLowerCase();
				if(validator.isEmpty(payeeResourceType)){
					payeeResourceType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payee resource type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.payee.party.practitioner !== 'undefined'){
				var payeePartyPractitioner =  req.body.payee.party.practitioner.trim().toLowerCase();
				if(validator.isEmpty(payeePartyPractitioner)){
					payeePartyPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payee party practitioner' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.payee.party.organization !== 'undefined'){
				var payeePartyOrganization =  req.body.payee.party.organization.trim().toLowerCase();
				if(validator.isEmpty(payeePartyOrganization)){
					payeePartyOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payee party organization' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.payee.party.patient !== 'undefined'){
				var payeePartyPatient =  req.body.payee.party.patient.trim().toLowerCase();
				if(validator.isEmpty(payeePartyPatient)){
					payeePartyPatient = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payee party patient' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.payee.party.relatedPerson !== 'undefined'){
				var payeePartyRelatedPerson =  req.body.payee.party.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(payeePartyRelatedPerson)){
					payeePartyRelatedPerson = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payee party related person' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.information.sequence !== 'undefined'){
				var informationSequence =  req.body.information.sequence.trim();
				if(validator.isEmpty(informationSequence)){
					err_code = 2;
					err_msg = "Explanation Of Benefit information sequence is required.";
				}else{
					if(!validator.isInt(informationSequence)){
						err_code = 2;
						err_msg = "Explanation Of Benefit information sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information sequence' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.information.category !== 'undefined'){
				var informationCategory =  req.body.information.category.trim().toLowerCase();
				if(validator.isEmpty(informationCategory)){
					err_code = 2;
					err_msg = "Explanation Of Benefit information category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information category' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.information.code !== 'undefined'){
				var informationCode =  req.body.information.code.trim().toLowerCase();
				if(validator.isEmpty(informationCode)){
					informationCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information code' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.information.timing.timingDate !== 'undefined'){
				var informationTimingTimingDate =  req.body.information.timing.timingDate;
				if(validator.isEmpty(informationTimingTimingDate)){
					informationTimingTimingDate = "";
				}else{
					if(!regex.test(informationTimingTimingDate)){
						err_code = 2;
						err_msg = "Explanation Of Benefit information timing timing date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information timing timing date' in json Explanation Of Benefit request.";
			}

			if (typeof req.body.information.timing.timingPeriod !== 'undefined') {
			  var informationTimingTimingPeriod = req.body.information.timing.timingPeriod;
 				if(validator.isEmpty(informationTimingTimingPeriod)) {
				  var informationTimingTimingPeriodStart = "";
				  var informationTimingTimingPeriodEnd = "";
				} else {
				  if (informationTimingTimingPeriod.indexOf("to") > 0) {
				    arrInformationTimingTimingPeriod = informationTimingTimingPeriod.split("to");
				    var informationTimingTimingPeriodStart = arrInformationTimingTimingPeriod[0];
				    var informationTimingTimingPeriodEnd = arrInformationTimingTimingPeriod[1];
				    if (!regex.test(informationTimingTimingPeriodStart) && !regex.test(informationTimingTimingPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Explanation Of Benefit information timing timing period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Explanation Of Benefit information timing timing period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'information timing timing period' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.information.value.valueString !== 'undefined'){
				var informationValueString =  req.body.information.value.valueString.trim().toLowerCase();
				if(validator.isEmpty(informationValueString)){
					informationValueString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value string' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.information.value.valueQuantity !== 'undefined'){
				var informationValueQuantity =  req.body.information.value.valueQuantity.trim().toLowerCase();
				if(validator.isEmpty(informationValueQuantity)){
					informationValueQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value quantity' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.information.value.valueAttachment.contentType !== 'undefined'){
				var informationValueAttachmentContentType =  req.body.information.value.valueAttachment.contentType.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentContentType)){
					informationValueAttachmentContentType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value attachment content type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.information.value.valueAttachment.language !== 'undefined'){
				var informationValueAttachmentLanguage =  req.body.information.value.valueAttachment.language.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentLanguage)){
					informationValueAttachmentLanguage = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value attachment language' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.information.value.valueAttachment.data !== 'undefined'){
				var informationValueAttachmentData =  req.body.information.value.valueAttachment.data.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentData)){
					informationValueAttachmentData = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value attachment data' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.information.value.valueAttachment.size !== 'undefined'){
				var informationValueAttachmentSize =  req.body.information.value.valueAttachment.size.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentSize)){
					informationValueAttachmentSize = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value attachment size' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.information.value.valueAttachment.title !== 'undefined'){
				var informationValueAttachmentTitle =  req.body.information.value.valueAttachment.title.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentTitle)){
					informationValueAttachmentTitle = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value attachment title' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.information.value.valueReference !== 'undefined'){
				var informationValueReference =  req.body.information.value.valueReference.trim().toLowerCase();
				if(validator.isEmpty(informationValueReference)){
					informationValueReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information value value reference' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.information.reason !== 'undefined'){
				var informationReason =  req.body.information.reason.trim().toLowerCase();
				if(validator.isEmpty(informationReason)){
					informationReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'information reason' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.careTeam.sequence !== 'undefined'){
				var careTeamSequence =  req.body.careTeam.sequence.trim();
				if(validator.isEmpty(careTeamSequence)){
					err_code = 2;
					err_msg = "Explanation Of Benefit care team sequence is required.";
				}else{
					if(!validator.isInt(careTeamSequence)){
						err_code = 2;
						err_msg = "Explanation Of Benefit care team sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'care team sequence' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.careTeam.provider.practitioner !== 'undefined'){
				var careTeamProviderPractitioner =  req.body.careTeam.provider.practitioner.trim().toLowerCase();
				if(validator.isEmpty(careTeamProviderPractitioner)){
					careTeamProviderPractitioner = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'care team provider practitioner' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.careTeam.provider.organization !== 'undefined'){
				var careTeamProviderOrganization =  req.body.careTeam.provider.organization.trim().toLowerCase();
				if(validator.isEmpty(careTeamProviderOrganization)){
					careTeamProviderOrganization = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'care team provider organization' in json Explanation Of Benefit request.";
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
					err_msg = "Explanation Of Benefit care team responsible is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'care team responsible' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.careTeam.role !== 'undefined'){
				var careTeamRole =  req.body.careTeam.role.trim().toLowerCase();
				if(validator.isEmpty(careTeamRole)){
					careTeamRole = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'care team role' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.careTeam.qualification !== 'undefined'){
				var careTeamQualification =  req.body.careTeam.qualification.trim().toLowerCase();
				if(validator.isEmpty(careTeamQualification)){
					careTeamQualification = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'care team qualification' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.diagnosis.sequence !== 'undefined'){
				var diagnosisSequence =  req.body.diagnosis.sequence.trim();
				if(validator.isEmpty(diagnosisSequence)){
					err_code = 2;
					err_msg = "Explanation Of Benefit diagnosis sequence is required.";
				}else{
					if(!validator.isInt(diagnosisSequence)){
						err_code = 2;
						err_msg = "Explanation Of Benefit diagnosis sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'diagnosis sequence' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.diagnosis.diagnosis.diagnosisCodeableConcept !== 'undefined'){
				var diagnosisCodeableConcept =  req.body.diagnosis.diagnosis.diagnosisCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(diagnosisCodeableConcept)){
					err_code = 2;
					err_msg = "Explanation Of Benefit diagnosis diagnosis diagnosis codeable concept is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'diagnosis diagnosis diagnosis codeable concept' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.diagnosis.diagnosis.diagnosisReference !== 'undefined'){
				var diagnosisReference =  req.body.diagnosis.diagnosis.diagnosisReference.trim().toLowerCase();
				if(validator.isEmpty(diagnosisReference)){
					diagnosisReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'diagnosis diagnosis diagnosis reference' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.diagnosis.type !== 'undefined'){
				var diagnosisType =  req.body.diagnosis.type.trim().toLowerCase();
				if(validator.isEmpty(diagnosisType)){
					diagnosisType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'diagnosis type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.diagnosis.packageCode !== 'undefined'){
				var diagnosisPackageCode =  req.body.diagnosis.packageCode.trim().toLowerCase();
				if(validator.isEmpty(diagnosisPackageCode)){
					diagnosisPackageCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'diagnosis package code' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.procedure.sequence !== 'undefined'){
				var procedureSequence =  req.body.procedure.sequence.trim();
				if(validator.isEmpty(procedureSequence)){
					err_code = 2;
					err_msg = "Explanation Of Benefit procedure sequence is required.";
				}else{
					if(!validator.isInt(procedureSequence)){
						err_code = 2;
						err_msg = "Explanation Of Benefit procedure sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'procedure sequence' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.procedure.date !== 'undefined'){
				var procedureDate =  req.body.procedure.date;
				if(validator.isEmpty(procedureDate)){
					procedureDate = "";
				}else{
					if(!regex.test(procedureDate)){
						err_code = 2;
						err_msg = "Explanation Of Benefit procedure date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'procedure date' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.procedure.procedure.procedureCodeableConcept !== 'undefined'){
				var procedureCodeableConcept =  req.body.procedure.procedure.procedureCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(procedureCodeableConcept)){
					err_code = 2;
					err_msg = "Explanation Of Benefit procedure procedure procedure codeable concept is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'procedure procedure procedure codeable concept' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.procedure.procedure.procedureReference !== 'undefined'){
				var procedureReference =  req.body.procedure.procedure.procedureReference.trim().toLowerCase();
				if(validator.isEmpty(procedureReference)){
					procedureReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'procedure procedure procedure reference' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.precedence !== 'undefined'){
				var precedence =  req.body.precedence.trim();
				if(validator.isEmpty(precedence)){
					precedence = "";
				}else{
					if(!validator.isInt(precedence)){
						err_code = 2;
						err_msg = "Explanation Of Benefit precedence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'precedence' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.insurance.coverage !== 'undefined'){
				var insuranceCoverage =  req.body.insurance.coverage.trim().toLowerCase();
				if(validator.isEmpty(insuranceCoverage)){
					insuranceCoverage = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance coverage' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.insurance.preAuthRef !== 'undefined'){
				var insurancePreAuthRef =  req.body.insurance.preAuthRef.trim().toLowerCase();
				if(validator.isEmpty(insurancePreAuthRef)){
					insurancePreAuthRef = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'insurance pre auth ref' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.accident.date !== 'undefined'){
				var accidentDate =  req.body.accident.date;
				if(validator.isEmpty(accidentDate)){
					err_code = 2;
					err_msg = "Explanation Of Benefit accident date is required.";
				}else{
					if(!regex.test(accidentDate)){
						err_code = 2;
						err_msg = "Explanation Of Benefit accident date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident date' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.accident.type !== 'undefined'){
				var accidentType =  req.body.accident.type.trim().toUpperCase();
				if(validator.isEmpty(accidentType)){
					accidentType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.accident.location.locationAddress.use !== 'undefined'){
				var accidentLocationAddressUse =  req.body.accident.location.locationAddress.use.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressUse)){
					accidentLocationAddressUse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address use' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.accident.location.locationAddress.type !== 'undefined'){
				var accidentLocationAddressType =  req.body.accident.location.locationAddress.type.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressType)){
					accidentLocationAddressType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.accident.location.locationAddress.text !== 'undefined'){
				var accidentLocationAddressText =  req.body.accident.location.locationAddress.text.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressText)){
					accidentLocationAddressText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address text' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.accident.location.locationAddress.line !== 'undefined'){
				var accidentLocationAddressLine =  req.body.accident.location.locationAddress.line.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressLine)){
					accidentLocationAddressLine = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address line' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.accident.location.locationAddress.city !== 'undefined'){
				var accidentLocationAddressCity =  req.body.accident.location.locationAddress.city.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressCity)){
					accidentLocationAddressCity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address city' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.accident.location.locationAddress.district !== 'undefined'){
				var accidentLocationAddressDistrict =  req.body.accident.location.locationAddress.district.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressDistrict)){
					accidentLocationAddressDistrict = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address district' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.accident.location.locationAddress.state !== 'undefined'){
				var accidentLocationAddressState =  req.body.accident.location.locationAddress.state.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressState)){
					accidentLocationAddressState = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address state' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.accident.location.locationAddress.postalCode !== 'undefined'){
				var accidentLocationAddressPostalCode =  req.body.accident.location.locationAddress.postalCode.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressPostalCode)){
					accidentLocationAddressPostalCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address postal code' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.accident.location.locationAddress.country !== 'undefined'){
				var accidentLocationAddressCountry =  req.body.accident.location.locationAddress.country.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressCountry)){
					accidentLocationAddressCountry = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location address country' in json Explanation Of Benefit request.";
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
				      err_msg = "Explanation Of Benefit accident location location address period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Explanation Of Benefit accident location location address period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'accident location location address period' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.accident.location.locationReference !== 'undefined'){
				var accidentLocationReference =  req.body.accident.location.locationReference.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationReference)){
					accidentLocationReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'accident location location reference' in json Explanation Of Benefit request.";
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
				      err_msg = "Explanation Of Benefit employment impacted invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Explanation Of Benefit employment impacted invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'employment impacted' in json Explanation Of Benefit request.";
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
				      err_msg = "Explanation Of Benefit hospitalization invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Explanation Of Benefit hospitalization invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'hospitalization' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.sequence !== 'undefined'){
				var itemSequence =  req.body.item.sequence.trim();
				if(validator.isEmpty(itemSequence)){
					err_code = 2;
					err_msg = "Explanation Of Benefit item sequence is required.";
				}else{
					if(!validator.isInt(itemSequence)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item sequence' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.careTeamLinkId !== 'undefined'){
				var itemCareTeamLinkId =  req.body.item.careTeamLinkId.trim();
				if(validator.isEmpty(itemCareTeamLinkId)){
					itemCareTeamLinkId = "";
				}else{
					if(!validator.isInt(itemCareTeamLinkId)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item care team link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item care team link id' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.diagnosisLinkId !== 'undefined'){
				var itemDiagnosisLinkId =  req.body.item.diagnosisLinkId.trim();
				if(validator.isEmpty(itemDiagnosisLinkId)){
					itemDiagnosisLinkId = "";
				}else{
					if(!validator.isInt(itemDiagnosisLinkId)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item diagnosis link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item diagnosis link id' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.procedureLinkId !== 'undefined'){
				var itemProcedureLinkId =  req.body.item.procedureLinkId.trim();
				if(validator.isEmpty(itemProcedureLinkId)){
					itemProcedureLinkId = "";
				}else{
					if(!validator.isInt(itemProcedureLinkId)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item procedure link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item procedure link id' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.informationLinkId !== 'undefined'){
				var itemInformationLinkId =  req.body.item.informationLinkId.trim();
				if(validator.isEmpty(itemInformationLinkId)){
					itemInformationLinkId = "";
				}else{
					if(!validator.isInt(itemInformationLinkId)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item information link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item information link id' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.revenue !== 'undefined'){
				var itemRevenue =  req.body.item.revenue.trim().toLowerCase();
				if(validator.isEmpty(itemRevenue)){
					itemRevenue = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item revenue' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.category !== 'undefined'){
				var itemCategory =  req.body.item.category.trim().toUpperCase();
				if(validator.isEmpty(itemCategory)){
					itemCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item category' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.service !== 'undefined'){
				var itemService =  req.body.item.service.trim().toLowerCase();
				if(validator.isEmpty(itemService)){
					itemService = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item service' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.modifier !== 'undefined'){
				var itemModifier =  req.body.item.modifier.trim().toLowerCase();
				if(validator.isEmpty(itemModifier)){
					itemModifier = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item modifier' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.programCode !== 'undefined'){
				var itemProgramCode =  req.body.item.programCode.trim().toLowerCase();
				if(validator.isEmpty(itemProgramCode)){
					itemProgramCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item program code' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.serviced.servicedDate !== 'undefined'){
				var itemServicedDate =  req.body.item.serviced.servicedDate;
				if(validator.isEmpty(itemServicedDate)){
					itemServicedDate = "";
				}else{
					if(!regex.test(itemServicedDate)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item serviced serviced date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item serviced serviced date' in json Explanation Of Benefit request.";
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
				      err_msg = "Explanation Of Benefit item serviced serviced period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Explanation Of Benefit item serviced serviced period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'item serviced serviced period' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.location.locationCodeableConcept !== 'undefined'){
				var itemLocationCodeableConcept =  req.body.item.location.locationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(itemLocationCodeableConcept)){
					itemLocationCodeableConcept = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location codeable concept' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.location.locationAddress.use !== 'undefined'){
				var itemLocationAddressUse =  req.body.item.location.locationAddress.use.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressUse)){
					itemLocationAddressUse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address use' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.location.locationAddress.type !== 'undefined'){
				var itemLocationAddressType =  req.body.item.location.locationAddress.type.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressType)){
					itemLocationAddressType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.location.locationAddress.text !== 'undefined'){
				var itemLocationAddressText =  req.body.item.location.locationAddress.text.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressText)){
					itemLocationAddressText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address text' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.location.locationAddress.line !== 'undefined'){
				var itemLocationAddressLine =  req.body.item.location.locationAddress.line.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressLine)){
					itemLocationAddressLine = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address line' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.location.locationAddress.city !== 'undefined'){
				var itemLocationAddressCity =  req.body.item.location.locationAddress.city.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressCity)){
					itemLocationAddressCity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address city' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.location.locationAddress.district !== 'undefined'){
				var itemLocationAddressDistrict =  req.body.item.location.locationAddress.district.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressDistrict)){
					itemLocationAddressDistrict = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address district' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.location.locationAddress.state !== 'undefined'){
				var itemLocationAddressState =  req.body.item.location.locationAddress.state.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressState)){
					itemLocationAddressState = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address state' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.location.locationAddress.postalCode !== 'undefined'){
				var itemLocationAddressPostalCode =  req.body.item.location.locationAddress.postalCode.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressPostalCode)){
					itemLocationAddressPostalCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address postal code' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.location.locationAddress.country !== 'undefined'){
				var itemLocationAddressCountry =  req.body.item.location.locationAddress.country.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressCountry)){
					itemLocationAddressCountry = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location address country' in json Explanation Of Benefit request.";
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
				      err_msg = "Explanation Of Benefit item location location address period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Explanation Of Benefit item location location address period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'item location location address period' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.location.locationReference !== 'undefined'){
				var itemLocationReference =  req.body.item.location.locationReference.trim().toLowerCase();
				if(validator.isEmpty(itemLocationReference)){
					itemLocationReference = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item location location reference' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.quantity !== 'undefined'){
				var itemQuantity =  req.body.item.quantity.trim();
				if(validator.isEmpty(itemQuantity)){
					itemQuantity = "";
				}else{
					if(!validator.isInt(itemQuantity)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item quantity is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item quantity' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.unitPrice !== 'undefined'){
				var itemUnitPrice =  req.body.item.unitPrice.trim().toLowerCase();
				if(validator.isEmpty(itemUnitPrice)){
					itemUnitPrice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item unit price' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.factor !== 'undefined'){
				var itemFactor =  req.body.item.factor.trim();
				if(validator.isEmpty(itemFactor)){
					itemFactor = "";
				}else{
					if(!validator.isInt(itemFactor)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item factor is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item factor' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.net !== 'undefined'){
				var itemNet =  req.body.item.net.trim();
				if(validator.isEmpty(itemNet)){
					itemNet = "";
				}else{
					if(!validator.isInt(itemNet)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item net is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item net' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.udi !== 'undefined'){
				var itemUdi =  req.body.item.udi.trim().toLowerCase();
				if(validator.isEmpty(itemUdi)){
					itemUdi = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item udi' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.bodySite !== 'undefined'){
				var itemBodySite =  req.body.item.bodySite.trim().toLowerCase();
				if(validator.isEmpty(itemBodySite)){
					itemBodySite = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item body site' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.subSite !== 'undefined'){
				var itemSubSite =  req.body.item.subSite.trim().toUpperCase();
				if(validator.isEmpty(itemSubSite)){
					itemSubSite = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item sub site' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.encounter !== 'undefined'){
				var itemEncounter =  req.body.item.encounter.trim().toLowerCase();
				if(validator.isEmpty(itemEncounter)){
					itemEncounter = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item encounter' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.noteNumber !== 'undefined'){
				var itemNoteNumber =  req.body.item.noteNumber.trim();
				if(validator.isEmpty(itemNoteNumber)){
					itemNoteNumber = "";
				}else{
					if(!validator.isInt(itemNoteNumber)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item note number is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item note number' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.adjudication.category !== 'undefined'){
				var itemAdjudicationCategory =  req.body.item.adjudication.category.trim().toLowerCase();
				if(validator.isEmpty(itemAdjudicationCategory)){
					err_code = 2;
					err_msg = "Explanation Of Benefit item adjudication category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item adjudication category' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.adjudication.reason !== 'undefined'){
				var itemAdjudicationReason =  req.body.item.adjudication.reason.trim().toLowerCase();
				if(validator.isEmpty(itemAdjudicationReason)){
					itemAdjudicationReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item adjudication reason' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.adjudication.amount !== 'undefined'){
				var itemAdjudicationAmount =  req.body.item.adjudication.amount.trim().toLowerCase();
				if(validator.isEmpty(itemAdjudicationAmount)){
					itemAdjudicationAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item adjudication amount' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.adjudication.value !== 'undefined'){
				var itemAdjudicationValue =  req.body.item.adjudication.value.trim();
				if(validator.isEmpty(itemAdjudicationValue)){
					itemAdjudicationValue = "";
				}else{
					if(!validator.isInt(itemAdjudicationValue)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item adjudication value is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item adjudication value' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.sequence !== 'undefined'){
				var itemDetailSequence =  req.body.item.detail.sequence.trim();
				if(validator.isEmpty(itemDetailSequence)){
					err_code = 2;
					err_msg = "Explanation Of Benefit item detail sequence is required.";
				}else{
					if(!validator.isInt(itemDetailSequence)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item detail sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sequence' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.type !== 'undefined'){
				var itemDetailType =  req.body.item.detail.type.trim().toUpperCase();
				if(validator.isEmpty(itemDetailType)){
					err_code = 2;
					err_msg = "Explanation Of Benefit item detail type is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.revenue !== 'undefined'){
				var itemDetailRevenue =  req.body.item.detail.revenue.trim().toLowerCase();
				if(validator.isEmpty(itemDetailRevenue)){
					itemDetailRevenue = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail revenue' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.category !== 'undefined'){
				var itemDetailCategory =  req.body.item.detail.category.trim().toUpperCase();
				if(validator.isEmpty(itemDetailCategory)){
					itemDetailCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail category' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.service !== 'undefined'){
				var itemDetailService =  req.body.item.detail.service.trim().toLowerCase();
				if(validator.isEmpty(itemDetailService)){
					itemDetailService = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail service' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.modifier !== 'undefined'){
				var itemDetailModifier =  req.body.item.detail.modifier.trim().toLowerCase();
				if(validator.isEmpty(itemDetailModifier)){
					itemDetailModifier = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail modifier' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.programCode !== 'undefined'){
				var itemDetailProgramCode =  req.body.item.detail.programCode.trim().toLowerCase();
				if(validator.isEmpty(itemDetailProgramCode)){
					itemDetailProgramCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail program code' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.quantity !== 'undefined'){
				var itemDetailQuantity =  req.body.item.detail.quantity.trim().toLowerCase();
				if(validator.isEmpty(itemDetailQuantity)){
					itemDetailQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail quantity' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.unitPrice !== 'undefined'){
				var itemDetailUnitPrice =  req.body.item.detail.unitPrice.trim().toLowerCase();
				if(validator.isEmpty(itemDetailUnitPrice)){
					itemDetailUnitPrice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail unit price' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.factor !== 'undefined'){
				var itemDetailFactor =  req.body.item.detail.factor.trim().toLowerCase();
				if(validator.isEmpty(itemDetailFactor)){
					itemDetailFactor = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail factor' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.net !== 'undefined'){
				var itemDetailNet =  req.body.item.detail.net.trim().toLowerCase();
				if(validator.isEmpty(itemDetailNet)){
					itemDetailNet = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail net' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.udi !== 'undefined'){
				var itemDetailUdi =  req.body.item.detail.udi.trim().toLowerCase();
				if(validator.isEmpty(itemDetailUdi)){
					itemDetailUdi = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail udi' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.noteNumber !== 'undefined'){
				var itemDetailNoteNumber =  req.body.item.detail.noteNumber.trim().toLowerCase();
				if(validator.isEmpty(itemDetailNoteNumber)){
					itemDetailNoteNumber = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail note number' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.adjudication.category !== 'undefined'){
				var itemDetailAdjudicationCategory =  req.body.item.detail.adjudication.category.trim().toLowerCase();
				if(validator.isEmpty(itemDetailAdjudicationCategory)){
					err_code = 2;
					err_msg = "Explanation Of Benefit item detail adjudication category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail adjudication category' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.adjudication.reason !== 'undefined'){
				var itemDetailAdjudicationReason =  req.body.item.detail.adjudication.reason.trim().toLowerCase();
				if(validator.isEmpty(itemDetailAdjudicationReason)){
					itemDetailAdjudicationReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail adjudication reason' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.adjudication.amount !== 'undefined'){
				var itemDetailAdjudicationAmount =  req.body.item.detail.adjudication.amount.trim().toLowerCase();
				if(validator.isEmpty(itemDetailAdjudicationAmount)){
					itemDetailAdjudicationAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail adjudication amount' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.adjudication.value !== 'undefined'){
				var itemDetailAdjudicationValue =  req.body.item.detail.adjudication.value.trim();
				if(validator.isEmpty(itemDetailAdjudicationValue)){
					itemDetailAdjudicationValue = "";
				}else{
					if(!validator.isInt(itemDetailAdjudicationValue)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item detail adjudication value is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail adjudication value' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.sequence !== 'undefined'){
				var itemSubDetailSequence =  req.body.item.detail.subDetail.sequence.trim();
				if(validator.isEmpty(itemSubDetailSequence)){
					err_code = 2;
					err_msg = "Explanation Of Benefit item detail sub detail sequence is required.";
				}else{
					if(!validator.isInt(itemSubDetailSequence)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item detail sub detail sequence is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail sequence' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.type !== 'undefined'){
				var itemSubDetailType =  req.body.item.detail.subDetail.type.trim().toUpperCase();
				if(validator.isEmpty(itemSubDetailType)){
					err_code = 2;
					err_msg = "Explanation Of Benefit item detail sub detail type is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.revenue !== 'undefined'){
				var itemSubDetailRevenue =  req.body.item.detail.subDetail.revenue.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailRevenue)){
					itemSubDetailRevenue = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail revenue' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.category !== 'undefined'){
				var itemSubDetailCategory =  req.body.item.detail.subDetail.category.trim().toUpperCase();
				if(validator.isEmpty(itemSubDetailCategory)){
					itemSubDetailCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail category' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.service !== 'undefined'){
				var itemSubDetailService =  req.body.item.detail.subDetail.service.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailService)){
					itemSubDetailService = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail service' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.modifier !== 'undefined'){
				var itemSubDetailModifier =  req.body.item.detail.subDetail.modifier.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailModifier)){
					itemSubDetailModifier = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail modifier' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.programCode !== 'undefined'){
				var itemSubDetailProgramCode =  req.body.item.detail.subDetail.programCode.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailProgramCode)){
					itemSubDetailProgramCode = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail program code' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.quantity !== 'undefined'){
				var itemSubDetailQuantity =  req.body.item.detail.subDetail.quantity.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailQuantity)){
					itemSubDetailQuantity = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail quantity' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.unitPrice !== 'undefined'){
				var itemSubDetailUnitPrice =  req.body.item.detail.subDetail.unitPrice.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailUnitPrice)){
					itemSubDetailUnitPrice = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail unit price' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.factor !== 'undefined'){
				var itemSubDetailFactor =  req.body.item.detail.subDetail.factor.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailFactor)){
					itemSubDetailFactor = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail factor' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.net !== 'undefined'){
				var itemSubDetailNet =  req.body.item.detail.subDetail.net.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailNet)){
					itemSubDetailNet = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail net' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.udi !== 'undefined'){
				var itemSubDetailUdi =  req.body.item.detail.subDetail.udi.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailUdi)){
					itemSubDetailUdi = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail udi' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.noteNumber !== 'undefined'){
				var itemSubDetailNoteNumber =  req.body.item.detail.subDetail.noteNumber.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailNoteNumber)){
					itemSubDetailNoteNumber = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail note number' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.adjudication.category !== 'undefined'){
				var itemSubDetailAdjudicationCategory =  req.body.item.detail.subDetail.adjudication.category.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailAdjudicationCategory)){
					err_code = 2;
					err_msg = "Explanation Of Benefit item detail sub detail adjudication category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail adjudication category' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.adjudication.reason !== 'undefined'){
				var itemSubDetailAdjudicationReason =  req.body.item.detail.subDetail.adjudication.reason.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailAdjudicationReason)){
					itemSubDetailAdjudicationReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail adjudication reason' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.adjudication.amount !== 'undefined'){
				var itemSubDetailAdjudicationAmount =  req.body.item.detail.subDetail.adjudication.amount.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailAdjudicationAmount)){
					itemSubDetailAdjudicationAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail adjudication amount' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.item.detail.subDetail.adjudication.value !== 'undefined'){
				var itemSubDetailAdjudicationValue =  req.body.item.detail.subDetail.adjudication.value.trim();
				if(validator.isEmpty(itemSubDetailAdjudicationValue)){
					itemSubDetailAdjudicationValue = "";
				}else{
					if(!validator.isInt(itemSubDetailAdjudicationValue)){
						err_code = 2;
						err_msg = "Explanation Of Benefit item detail sub detail adjudication value is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'item detail sub detail adjudication value' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.sequenceLinkId !== 'undefined'){
				var addItemSequenceLinkId =  req.body.addItem.sequenceLinkId.trim();
				if(validator.isEmpty(addItemSequenceLinkId)){
					addItemSequenceLinkId = "";
				}else{
					if(!validator.isInt(addItemSequenceLinkId)){
						err_code = 2;
						err_msg = "Explanation Of Benefit add item sequence link id is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item sequence link id' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.revenue !== 'undefined'){
				var addItemRevenue =  req.body.addItem.revenue.trim().toLowerCase();
				if(validator.isEmpty(addItemRevenue)){
					addItemRevenue = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item revenue' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.category !== 'undefined'){
				var addItemCategory =  req.body.addItem.category.trim().toUpperCase();
				if(validator.isEmpty(addItemCategory)){
					addItemCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item category' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.service !== 'undefined'){
				var addItemService =  req.body.addItem.service.trim().toLowerCase();
				if(validator.isEmpty(addItemService)){
					addItemService = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item service' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.modifier !== 'undefined'){
				var addItemModifier =  req.body.addItem.modifier.trim().toLowerCase();
				if(validator.isEmpty(addItemModifier)){
					addItemModifier = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item modifier' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.fee !== 'undefined'){
				var addItemFee =  req.body.addItem.fee.trim();
				if(validator.isEmpty(addItemFee)){
					addItemFee = "";
				}else{
					if(!validator.isInt(addItemFee)){
						err_code = 2;
						err_msg = "Explanation Of Benefit add item fee is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item fee' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.noteNumber !== 'undefined'){
				var addItemNoteNumber =  req.body.addItem.noteNumber.trim().toLowerCase();
				if(validator.isEmpty(addItemNoteNumber)){
					addItemNoteNumber = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item note number' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.adjudication.category !== 'undefined'){
				var addItemAdjudicationCategory =  req.body.addItem.adjudication.category.trim().toLowerCase();
				if(validator.isEmpty(addItemAdjudicationCategory)){
					err_code = 2;
					err_msg = "Explanation Of Benefit add item adjudication category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item adjudication category' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.adjudication.reason !== 'undefined'){
				var addItemAdjudicationReason =  req.body.addItem.adjudication.reason.trim().toLowerCase();
				if(validator.isEmpty(addItemAdjudicationReason)){
					addItemAdjudicationReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item adjudication reason' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.adjudication.amount !== 'undefined'){
				var addItemAdjudicationAmount =  req.body.addItem.adjudication.amount.trim().toLowerCase();
				if(validator.isEmpty(addItemAdjudicationAmount)){
					addItemAdjudicationAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item adjudication amount' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.adjudication.value !== 'undefined'){
				var addItemAdjudicationValue =  req.body.addItem.adjudication.value.trim();
				if(validator.isEmpty(addItemAdjudicationValue)){
					addItemAdjudicationValue = "";
				}else{
					if(!validator.isInt(addItemAdjudicationValue)){
						err_code = 2;
						err_msg = "Explanation Of Benefit add item adjudication value is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item adjudication value' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.detail.revenue !== 'undefined'){
				var addItemDetailRevenue =  req.body.addItem.detail.revenue.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailRevenue)){
					addItemDetailRevenue = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail revenue' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.detail.category !== 'undefined'){
				var addItemDetailCategory =  req.body.addItem.detail.category.trim().toUpperCase();
				if(validator.isEmpty(addItemDetailCategory)){
					addItemDetailCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail category' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.detail.service !== 'undefined'){
				var addItemDetailService =  req.body.addItem.detail.service.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailService)){
					addItemDetailService = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail service' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.detail.modifier !== 'undefined'){
				var addItemDetailModifier =  req.body.addItem.detail.modifier.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailModifier)){
					addItemDetailModifier = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail modifier' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.detail.fee !== 'undefined'){
				var addItemDetailFee =  req.body.addItem.detail.fee.trim();
				if(validator.isEmpty(addItemDetailFee)){
					addItemDetailFee = "";
				}else{
					if(!validator.isInt(addItemDetailFee)){
						err_code = 2;
						err_msg = "Explanation Of Benefit add item detail fee is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail fee' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.detail.noteNumber !== 'undefined'){
				var addItemDetailNoteNumber =  req.body.addItem.detail.noteNumber.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailNoteNumber)){
					addItemDetailNoteNumber = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail note number' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.detail.adjudication.category !== 'undefined'){
				var addItemDetailAdjudicationCategory =  req.body.addItem.detail.adjudication.category.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailAdjudicationCategory)){
					err_code = 2;
					err_msg = "Explanation Of Benefit add item detail adjudication category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail adjudication category' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.detail.adjudication.reason !== 'undefined'){
				var addItemDetailAdjudicationReason =  req.body.addItem.detail.adjudication.reason.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailAdjudicationReason)){
					addItemDetailAdjudicationReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail adjudication reason' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.detail.adjudication.amount !== 'undefined'){
				var addItemDetailAdjudicationAmount =  req.body.addItem.detail.adjudication.amount.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailAdjudicationAmount)){
					addItemDetailAdjudicationAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail adjudication amount' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.addItem.detail.adjudication.value !== 'undefined'){
				var addItemDetailAdjudicationValue =  req.body.addItem.detail.adjudication.value.trim();
				if(validator.isEmpty(addItemDetailAdjudicationValue)){
					addItemDetailAdjudicationValue = "";
				}else{
					if(!validator.isInt(addItemDetailAdjudicationValue)){
						err_code = 2;
						err_msg = "Explanation Of Benefit add item detail adjudication value is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'add item detail adjudication value' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.totalCost !== 'undefined'){
				var totalCost =  req.body.totalCost.trim().toLowerCase();
				if(validator.isEmpty(totalCost)){
					totalCost = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'total cost' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.unallocDeductable !== 'undefined'){
				var unallocDeductable =  req.body.unallocDeductable.trim().toLowerCase();
				if(validator.isEmpty(unallocDeductable)){
					unallocDeductable = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'unalloc deductable' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.totalBenefit !== 'undefined'){
				var totalBenefit =  req.body.totalBenefit.trim().toLowerCase();
				if(validator.isEmpty(totalBenefit)){
					totalBenefit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'total benefit' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.payment.type !== 'undefined'){
				var paymentType =  req.body.payment.type.trim().toLowerCase();
				if(validator.isEmpty(paymentType)){
					paymentType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.payment.adjustment !== 'undefined'){
				var paymentAdjustment =  req.body.payment.adjustment.trim().toLowerCase();
				if(validator.isEmpty(paymentAdjustment)){
					paymentAdjustment = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment adjustment' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.payment.adjustmentReason !== 'undefined'){
				var paymentAdjustmentReason =  req.body.payment.adjustmentReason.trim().toLowerCase();
				if(validator.isEmpty(paymentAdjustmentReason)){
					paymentAdjustmentReason = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment adjustment reason' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.payment.date !== 'undefined'){
				var paymentDate =  req.body.payment.date;
				if(validator.isEmpty(paymentDate)){
					paymentDate = "";
				}else{
					if(!regex.test(paymentDate)){
						err_code = 2;
						err_msg = "Explanation Of Benefit payment date invalid date format.";	
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment date' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.payment.amount !== 'undefined'){
				var paymentAmount =  req.body.payment.amount.trim().toLowerCase();
				if(validator.isEmpty(paymentAmount)){
					paymentAmount = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment amount' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.payment.identifier.use !== 'undefined'){
				var paymentIdentifierUse =  req.body.payment.identifier.use.trim().toLowerCase();
				if(validator.isEmpty(paymentIdentifierUse)){
					paymentIdentifierUse = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment identifier use' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.payment.identifier.type !== 'undefined'){
				var paymentIdentifierType =  req.body.payment.identifier.type.trim().toLowerCase();
				if(validator.isEmpty(paymentIdentifierType)){
					paymentIdentifierType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment identifier type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.payment.identifier.value !== 'undefined'){
				var paymentIdentifierValue =  req.body.payment.identifier.value.trim().toLowerCase();
				if(validator.isEmpty(paymentIdentifierValue)){
					paymentIdentifierValue = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'payment identifier value' in json Explanation Of Benefit request.";
			}

			if (typeof req.body.payment.identifier.period !== 'undefined') {
			  var paymentIdentifierPeriod = req.body.payment.identifier.period;
 				if(validator.isEmpty(paymentIdentifierPeriod)) {
				  var paymentIdentifierPeriodStart = "";
				  var paymentIdentifierPeriodEnd = "";
				} else {
				  if (paymentIdentifierPeriod.indexOf("to") > 0) {
				    arrPaymentIdentifierPeriod = paymentIdentifierPeriod.split("to");
				    var paymentIdentifierPeriodStart = arrPaymentIdentifierPeriod[0];
				    var paymentIdentifierPeriodEnd = arrPaymentIdentifierPeriod[1];
				    if (!regex.test(paymentIdentifierPeriodStart) && !regex.test(paymentIdentifierPeriodEnd)) {
				      err_code = 2;
				      err_msg = "Explanation Of Benefit payment identifier period invalid date format.";
				    }
					} else {
				  	err_code = 2;
				  	err_msg = "Explanation Of Benefit payment identifier period invalid date format.";
					}
				}
			} else {
			  err_code = 1;
			  err_msg = "Please add key 'payment identifier period' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.form !== 'undefined'){
				var form =  req.body.form.trim().toLowerCase();
				if(validator.isEmpty(form)){
					form = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'form' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.processNote.number !== 'undefined'){
				var processNoteNumber =  req.body.processNote.number.trim();
				if(validator.isEmpty(processNoteNumber)){
					processNoteNumber = "";
				}else{
					if(!validator.isInt(processNoteNumber)){
						err_code = 2;
						err_msg = "Explanation Of Benefit process note number is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'process note number' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.processNote.type !== 'undefined'){
				var processNoteType =  req.body.processNote.type.trim().toLowerCase();
				if(validator.isEmpty(processNoteType)){
					processNoteType = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'process note type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.processNote.text !== 'undefined'){
				var processNoteText =  req.body.processNote.text.trim().toLowerCase();
				if(validator.isEmpty(processNoteText)){
					processNoteText = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'process note text' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.processNote.language !== 'undefined'){
				var processNoteLanguage =  req.body.processNote.language.trim();
				if(validator.isEmpty(processNoteLanguage)){
					processNoteLanguage = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'process note language' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.benefitBalance.category !== 'undefined'){
				var benefitBalanceCategory =  req.body.benefitBalance.category.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceCategory)){
					err_code = 2;
					err_msg = "Explanation Of Benefit benefit balance category is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit balance category' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.benefitBalance.subCategory !== 'undefined'){
				var benefitBalanceSubCategory =  req.body.benefitBalance.subCategory.trim().toUpperCase();
				if(validator.isEmpty(benefitBalanceSubCategory)){
					benefitBalanceSubCategory = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit balance sub category' in json Explanation Of Benefit request.";
			}

			if (typeof req.body.benefitBalance.excluded !== 'undefined') {
				var benefitBalanceExcluded = req.body.benefitBalance.excluded.trim().toLowerCase();
					if(validator.isEmpty(benefitBalanceExcluded)){
						benefitBalanceExcluded = "false";
					}
				if(benefitBalanceExcluded === "true" || benefitBalanceExcluded === "false"){
					benefitBalanceExcluded = benefitBalanceExcluded;
				} else {
					err_code = 2;
					err_msg = "Explanation Of Benefit benefit balance excluded is must be boolean.";
				}
			} else {
				err_code = 1;
				err_msg = "Please add sub-key 'benefit balance excluded' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.benefitBalance.name !== 'undefined'){
				var benefitBalanceName =  req.body.benefitBalance.name.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceName)){
					benefitBalanceName = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit balance name' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.benefitBalance.description !== 'undefined'){
				var benefitBalanceDescription =  req.body.benefitBalance.description.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceDescription)){
					benefitBalanceDescription = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit balance description' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.benefitBalance.network !== 'undefined'){
				var benefitBalanceNetwork =  req.body.benefitBalance.network.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceNetwork)){
					benefitBalanceNetwork = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit balance network' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.benefitBalance.unit !== 'undefined'){
				var benefitBalanceUnit =  req.body.benefitBalance.unit.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceUnit)){
					benefitBalanceUnit = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit balance unit' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.benefitBalance.term !== 'undefined'){
				var benefitBalanceTerm =  req.body.benefitBalance.term.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceTerm)){
					benefitBalanceTerm = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit balance term' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.benefitBalance.financial.type !== 'undefined'){
				var benefitBalanceFinancialType =  req.body.benefitBalance.financial.type.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceFinancialType)){
					err_code = 2;
					err_msg = "Explanation Of Benefit benefit balance financial type is required.";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit balance financial type' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.benefitBalance.financial.allowed.allowedUnsignedInt !== 'undefined'){
				var benefitBalanceFinancialAllowedUnsignedInt =  req.body.benefitBalance.financial.allowed.allowedUnsignedInt.trim();
				if(validator.isEmpty(benefitBalanceFinancialAllowedUnsignedInt)){
					benefitBalanceFinancialAllowedUnsignedInt = "";
				}else{
					if(!validator.isInt(benefitBalanceFinancialAllowedUnsignedInt)){
						err_code = 2;
						err_msg = "Explanation Of Benefit benefit balance financial allowed allowed unsigned int is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit balance financial allowed allowed unsigned int' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.benefitBalance.financial.allowed.allowedString !== 'undefined'){
				var benefitBalanceFinancialAllowedString =  req.body.benefitBalance.financial.allowed.allowedString.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceFinancialAllowedString)){
					benefitBalanceFinancialAllowedString = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit balance financial allowed allowed string' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.benefitBalance.financial.allowed.allowedMoney !== 'undefined'){
				var benefitBalanceFinancialAllowedMoney =  req.body.benefitBalance.financial.allowed.allowedMoney.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceFinancialAllowedMoney)){
					benefitBalanceFinancialAllowedMoney = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit balance financial allowed allowed money' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.benefitBalance.financial.used.usedUnsignedInt !== 'undefined'){
				var benefitBalanceFinancialUsedUnsignedInt =  req.body.benefitBalance.financial.used.usedUnsignedInt.trim();
				if(validator.isEmpty(benefitBalanceFinancialUsedUnsignedInt)){
					benefitBalanceFinancialUsedUnsignedInt = "";
				}else{
					if(!validator.isInt(benefitBalanceFinancialUsedUnsignedInt)){
						err_code = 2;
						err_msg = "Explanation Of Benefit benefit balance financial used used unsigned int is must be number.";
					}
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit balance financial used used unsigned int' in json Explanation Of Benefit request.";
			}

			if(typeof req.body.benefitBalance.financial.used.usedMoney !== 'undefined'){
				var benefitBalanceFinancialUsedMoney =  req.body.benefitBalance.financial.used.usedMoney.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceFinancialUsedMoney)){
					benefitBalanceFinancialUsedMoney = "";
				}
			}else{
				err_code = 1;
				err_msg = "Please add sub-key 'benefit balance financial used used money' in json Explanation Of Benefit request.";
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
														var explanationOfBenefitId = 'eob' + unicId;
														var explanationOfBenefitRelatedId = 'ebr' + unicId;
														var explanationOfBenefitInformationId = 'ebi' + unicId;
														var explanationOfBenefitCareTeamId = 'ebc' + unicId;
														var explanationOfBenefitDiagnosisId = 'ebd' + unicId;
														var explanationOfBenefitProcedureId = 'ebp' + unicId;
														var explanationOfBenefitPaymentidentifierId = 'iep' + unicId;
														var explanationOfBenefitItemId = 'eit' + unicId;
														var explanationOfBenefitItemDetailId = 'eid' + unicId;
														var explanationOfBenefitItemSubDetailId = 'eis' + unicId;
														var explanationOfBenefitAddItemId = 'ead' + unicId;
														var explanationOfBenefitAddItemDetailId = 'eai' + unicId;
														var explanationOfBenefitProcessNoteId = 'epn' + unicId;
														var explanationOfBenefitBalanceId = 'eba' + unicId;
														var explanationOfBenefitBalanceFinancialId = 'ebf' + unicId;
														var itemAdjudicationId = 'iaj' + unicId;
														var itemDetailAdjudicationId = 'iad' + unicId;
														var itemDetailSubDetailAdjudicationId = 'ias' + unicId;
														var addItemAdjudicationId = 'aaj' + unicId;
														var addItemDetailAdjudicationId  = 'aad' + unicId;
														var attachmentId = 'atc' + unicId;
														
														dataExplanationOfBenefit = {
															"explanation_of_benefit_id" : explanationOfBenefitId,
															"status" : status,
															"type" : type,
															"subtype" : subtype,
															"patient" : patient,
															"billable_period_start" : billablePeriodStart,
															"billable_period_end" : billablePeriodEnd,
															"created" : created,
															"enterer" : enterer,
															"insurer" : insurer,
															"provider" : provider,
															"organization" : organization,
															"referral" : referral,
															"facility" : facility,
															"claim" : claim,
															"claim_response" : claimResponse,
															"outcome" : outcome,
															"disposition" : disposition,
															"prescription_medication_request" : prescriptionMedicationRequest,
															"prescription_vision_prescription" : prescriptionVisionPrescription,
															"original_prescription" : originalPrescription,
															"payee_type" : payeeType,
															"payee_resource_type" : payeeResourceType,
															"payee_party_practitioner" : payeePartyPractitioner,
															"payee_party_organization" : payeePartyOrganization,
															"payee_party_patient" : payeePartyPatient,
															"payee_party_related_person" : payeePartyRelatedPerson,
															"precedence" : precedence,
															"insurance_coverage" : insuranceCoverage,
															"insurance_pre_auth_ref" : insurancePreAuthRef,
															"accident_date" : accidentDate,
															"accident_type" : accidentType,
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
															"accident_location_reference" : accidentLocationReference,
															"employment_impacted_start" : employmentImpactedStart,
															"employment_impacted_end" : employmentImpactedEnd,
															"hospitalization_start" : hospitalizationStart,
															"hospitalization_end" : hospitalizationEnd,
															"total_cost" : totalCost,
															"unalloc_deductable" : unallocDeductable,
															"total_benefit" : totalBenefit,
															"payment_type" : paymentType,
															"payment_adjustment" : paymentAdjustment,
															"payment_adjustment_reason" : paymentAdjustmentReason,
															"payment_date" : paymentDate,
															"payment_amount" : paymentAmount,
															"payment_identifier" : explanationOfBenefitPaymentidentifierId,
															"form" : form
														}
														console.log(dataExplanationOfBenefit);
														ApiFHIR.post('explanationOfBenefit', {"apikey": apikey}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
															explanationOfBenefit = body;
															if(explanationOfBenefit.err_code > 0){
																res.json(explanationOfBenefit);	
																console.log("ok");
															}
														});
														
														var paymentIdentifierSystem = explanationOfBenefitPaymentidentifierId;
														dataIdentifier = {
																							"id": explanationOfBenefitPaymentidentifierId,
																							"use": paymentIdentifierUse,
																							"type": paymentIdentifierType,
																							"system": paymentIdentifierSystem,
																							"value": paymentIdentifierValue,
																							"period_start": paymentIdentifierPeriodStart,
																							"period_end": paymentIdentifierPeriodEnd,
																							"explanation_of_benefit_payment_id" : explanationOfBenefitId
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
																							"explanation_of_benefit_id" : explanationOfBenefitId
																						}
														ApiFHIR.post('identifier', {"apikey": apikey}, {body: dataIdentifier, json: true}, function(error, response, body){
															identifier = body;
															if(identifier.err_code > 0){
																res.json(identifier);	
															}
														})
														
														dataExplanationOfBenefitRelated = {
															"related_id" :explanationOfBenefitRelatedId,
															"claim" : relatedClaim,
															"relationship" : relatedRelationship,
															"reference" : relatedReference,
															"explanation_of_benefit_id" : explanationOfBenefitId
														}
														ApiFHIR.post('explanationOfBenefitRelated', {"apikey": apikey}, {body: dataExplanationOfBenefitRelated, json: true}, function(error, response, body){
															explanationOfBenefitRelated = body;
															if(explanationOfBenefitRelated.err_code > 0){
																res.json(explanationOfBenefitRelated);	
															}
														})
														
														dataExplanationOfBenefitInformation = {
															"information_id" :explanationOfBenefitInformationId,
															"sequences" : informationSequence,
															"category" : informationCategory,
															"code" : informationCode,
															"timing_date" : informationTimingTimingDate,
															"timing_period_start" : informationTimingTimingPeriodStart,
															"timing_period_end" : informationTimingTimingPeriodEnd,
															"value_string" : informationValueString,
															"value_quantity" : informationValueQuantity,
															"value_attachment" : attachmentId,
															"value_reference" : informationValueReference,
															"reason" : informationReason,
															"explanation_of_benefit_id" : explanationOfBenefitId
														}
														ApiFHIR.post('explanationOfBenefitInformation', {"apikey": apikey}, {body: dataExplanationOfBenefitInformation, json: true}, function(error, response, body){
															explanationOfBenefitInformation = body;
															if(explanationOfBenefitInformation.err_code > 0){
																res.json(explanationOfBenefitInformation);	
															}
														})
														
														var dataAttachment = {
															"id": attachmentId,
															"content_type": informationValueAttachmentContentType,
															"language": informationValueAttachmentLanguage,
															"data": informationValueAttachmentData,
															"size": informationValueAttachmentSize,
															"hash": sha1(informationValueAttachmentData),
															"title": informationValueAttachmentTitle,
															"creation": getFormattedDate(),
															"url": host + ':' + port + '/' + apikey + '/ExplanationOfBenefit/'+claimId+'/Photo/' + attachmentId,
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
														
														dataExplanationOfBenefitCareTeam = {
															"care_team_id" : explanationOfBenefitCareTeamId,
															"sequences" : careTeamSequence,
															"provider_practitioner" : careTeamProviderPractitioner,
															"provider_organization" : careTeamProviderOrganization,
															"responsible" : careTeamResponsible,
															"role" : careTeamRole,
															"qualification" : careTeamQualification,
															"explanation_of_benefit_id" : explanationOfBenefitId
														}
														ApiFHIR.post('explanationOfBenefitCareTeam', {"apikey": apikey}, {body: dataExplanationOfBenefitCareTeam, json: true}, function(error, response, body){
															explanationOfBenefitCareTeam = body;
															if(explanationOfBenefitCareTeam.err_code > 0){
																res.json(explanationOfBenefitCareTeam);	
															}
														})
														
														dataExplanationOfBenefitDiagnosis = {
															"diagnosis_id" :explanationOfBenefitDiagnosisId,
															"sequences" : diagnosisSequence,
															"diagnosis_codeable_concept" : diagnosisCodeableConcept,
															"diagnosis_reference" : diagnosisReference,
															"type" : diagnosisType,
															"package_code" : diagnosisPackageCode,
															"explanation_of_benefit_id" : explanationOfBenefitId
														}
														ApiFHIR.post('explanationOfBenefitDiagnosis', {"apikey": apikey}, {body: dataExplanationOfBenefitDiagnosis, json: true}, function(error, response, body){
															explanationOfBenefitDiagnosis = body;
															if(explanationOfBenefitDiagnosis.err_code > 0){
																res.json(explanationOfBenefitDiagnosis);	
															}
														})
														
														dataExplanationOfBenefitProcedure = {
															"procedure_id" :explanationOfBenefitProcedureId,
															"sequences" : procedureSequence,
															"date" : procedureDate,
															"procedure_codeable_concept" : procedureCodeableConcept,
															"procedure_reference" : procedureReference,
															"explanation_of_benefit_id" : explanationOfBenefitId
														}
														ApiFHIR.post('explanationOfBenefitProcedure', {"apikey": apikey}, {body: dataExplanationOfBenefitProcedure, json: true}, function(error, response, body){
															explanationOfBenefitProcedure = body;
															if(explanationOfBenefitProcedure.err_code > 0){
																res.json(explanationOfBenefitProcedure);	
															}
														})
													
														dataExplanationOfBenefitItem = {
															"item_id": explanationOfBenefitItemId,
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
															"service_period_start" : itemServicedPeriodStart,
															"service_period_end" : itemServicedPeriodEnd,
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
															"note_number" : itemNoteNumber,
															"explanation_of_benefit_id" : explanationOfBenefitId
														}
														ApiFHIR.post('explanationOfBenefitItem', {"apikey": apikey}, {body: dataExplanationOfBenefitItem, json: true}, function(error, response, body){
															explanationOfBenefitItem = body;
															if(explanationOfBenefitItem.err_code > 0){
																res.json(explanationOfBenefitItem);	
															}
														})
														
														dataExplanationOfBenefitAdjudicationItem = {
															"adjudication_id": itemAdjudicationId,
															"category" : itemAdjudicationCategory,
															"reason" : itemAdjudicationReason,
															"amount" : itemAdjudicationAmount,
															"value" : itemAdjudicationValue,
															"item_id" : explanationOfBenefitItemId
														}
														ApiFHIR.post('explanationOfBenefitAdjudication', {"apikey": apikey}, {body: dataExplanationOfBenefitAdjudicationItem, json: true}, function(error, response, body){
															explanationOfBenefitAdjudication = body;
															if(explanationOfBenefitAdjudication.err_code > 0){
																res.json(explanationOfBenefitAdjudication);	
															}
														})
														
														dataExplanationOfBenefitItemDetail = {
															"detail_id": explanationOfBenefitItemDetailId,
															"sequences" : itemDetailSequence,
															"type" : itemDetailType,
															"revenue" : itemDetailRevenue,
															"category" : itemDetailCategory,
															"service" : itemDetailService,
															"modifier" : itemDetailModifier,
															"program_code" : itemDetailProgramCode,
															"quantity" : itemDetailQuantity,
															"unit_price" : itemDetailUnitPrice,
															"factor" : itemDetailFactor,
															"net" : itemDetailNet,
															"note_number" : itemDetailNoteNumber,
															"item_id" : explanationOfBenefitItemId
														}
														ApiFHIR.post('explanationOfBenefitItemDetail', {"apikey": apikey}, {body: dataExplanationOfBenefitItemDetail, json: true}, function(error, response, body){
															explanationOfBenefitItemDetail = body;
															if(explanationOfBenefitItemDetail.err_code > 0){
																res.json(explanationOfBenefitItemDetail);	
															}
														})
														
														dataExplanationOfBenefitAdjudicationItemDetail = {
															"adjudication_id": itemDetailAdjudicationId,
															"category" : itemDetailAdjudicationCategory,
															"reason" : itemDetailAdjudicationReason,
															"amount" : itemDetailAdjudicationAmount,
															"value" : itemDetailAdjudicationValue,
															"detail_id": explanationOfBenefitItemDetailId,
														}
														ApiFHIR.post('explanationOfBenefitAdjudication', {"apikey": apikey}, {body: dataExplanationOfBenefitAdjudicationItemDetail, json: true}, function(error, response, body){
															explanationOfBenefitAdjudication = body;
															if(explanationOfBenefitAdjudication.err_code > 0){
																res.json(explanationOfBenefitAdjudication);	
															}
														})
														
														dataExplanationOfBenefitSubDetail = {
															"sub_detail_id": explanationOfBenefitItemSubDetailId,
															"sequences" : itemSubDetailSequence,
															"type" : itemSubDetailType,
															"revenue" : itemSubDetailRevenue,
															"category" : itemSubDetailCategory,
															"service" : itemSubDetailService,
															"modifier" : itemSubDetailModifier,
															"program_code" : itemSubDetailProgramCode,
															"quantity" : itemSubDetailQuantity,
															"unit_price" : itemSubDetailUnitPrice,
															"factor" : itemSubDetailFactor,
															"net" : itemSubDetailNet,
															"note_number" : itemSubDetailNoteNumber,
															"detail_id": explanationOfBenefitItemDetailId,
														}
														ApiFHIR.post('explanationOfBenefitSubDetail', {"apikey": apikey}, {body: dataExplanationOfBenefitSubDetail, json: true}, function(error, response, body){
															explanationOfBenefitSubDetail = body;
															if(explanationOfBenefitSubDetail.err_code > 0){
																res.json(explanationOfBenefitSubDetail);	
															}
														})
														
														dataExplanationOfBenefitAdjudicationItemSubDetail = {
															"adjudication_id": itemDetailSubDetailAdjudicationId,
															"category" : itemDetailSubDetailAdjudicationCategory,
															"reason" : itemDetailSubDetailAdjudicationReason,
															"amount" : itemDetailSubDetailAdjudicationAmount,
															"value" : itemDetailSubDetailAdjudicationValue,
															"sub_detail_id": explanationOfBenefitItemSubDetailId,
														}
														ApiFHIR.post('explanationOfBenefitAdjudication', {"apikey": apikey}, {body: dataExplanationOfBenefitAdjudicationItemSubDetail, json: true}, function(error, response, body){
															explanationOfBenefitAdjudication = body;
															if(explanationOfBenefitAdjudication.err_code > 0){
																res.json(explanationOfBenefitAdjudication);	
															}
														})
														
														dataExplanationOfBenefitAddItem = {
															"add_item_id" : explanationOfBenefitAddItemId,
															"sequence_link_id" : addItemSequenceLinkId,
															"revenue" : addItemRevenue,
															"category" : addItemCategory,
															"service" : addItemService,
															"modifier" : addItemModifier,
															"fee" : addItemFee,
															"note_number" : addItemNoteNumber,
															"explanation_of_benefit_id" : explanationOfBenefitId
														}
														ApiFHIR.post('explanationOfBenefitAddItem', {"apikey": apikey}, {body: dataExplanationOfBenefitAddItem, json: true}, function(error, response, body){
															explanationOfBenefitAddItem = body;
															if(explanationOfBenefitAddItem.err_code > 0){
																res.json(explanationOfBenefitAddItem);	
															}
														})
														
														dataExplanationOfBenefitAdjudicationAddItem = {
															"adjudication_id": addItemAdjudicationId,
															"category" : addItemAdjudicationCategory,
															"reason" : addItemAdjudicationReason,
															"amount" : addItemAdjudicationAmount,
															"value" : addItemAdjudicationValue,
															"add_item_id": explanationOfBenefitAddItemId,
														}
														ApiFHIR.post('explanationOfBenefitAdjudication', {"apikey": apikey}, {body: dataExplanationOfBenefitAdjudicationAddItem, json: true}, function(error, response, body){
															explanationOfBenefitAdjudication = body;
															if(explanationOfBenefitAdjudication.err_code > 0){
																res.json(explanationOfBenefitAdjudication);	
															}
														})
														
														dataExplanationOfBenefitAddItemDetail = {
															"add_item_detail_id" : explanationOfBenefitAddItemDetailId,
															"revenue" : addItemDetailRevenue,
															"category" : addItemDetailCategory,
															"service" : addItemDetailService,
															"modifier" : addItemDetailModifier,
															"fee" : addItemDetailFee,
															"note_number" : addItemDetailNoteNumber,
															"add_item_id" : explanationOfBenefitAddItemId
														}
														ApiFHIR.post('explanationOfBenefitAddItemDetail', {"apikey": apikey}, {body: dataExplanationOfBenefitAddItemDetail, json: true}, function(error, response, body){
															explanationOfBenefitAddItemDetail = body;
															if(explanationOfBenefitAddItemDetail.err_code > 0){
																res.json(explanationOfBenefitAddItemDetail);	
															}
														})
														
														dataExplanationOfBenefitAdjudicationAddItemDetail = {
															"adjudication_id": addItemDetailAdjudicationId,
															"category" : addItemDetailAdjudicationCategory,
															"reason" : addItemDetailAdjudicationReason,
															"amount" : addItemDetailAdjudicationAmount,
															"value" : addItemDetailAdjudicationValue,
															"add_item_detail_id" : explanationOfBenefitAddItemDetailId
														}
														ApiFHIR.post('explanationOfBenefitAdjudication', {"apikey": apikey}, {body: dataExplanationOfBenefitAdjudicationAddItemDetail, json: true}, function(error, response, body){
															explanationOfBenefitAdjudication = body;
															if(explanationOfBenefitAdjudication.err_code > 0){
																res.json(explanationOfBenefitAdjudication);	
															}
														})
														
														dataExplanationOfBenefitProcessNote = {
															"process_note_id" : explanationOfBenefitProcessNoteId,
															"number" : processNoteNumber,
															"type" : processNoteType,
															"text" : processNoteText,
															"language" :processNoteLanguage,
															"explanation_of_benefit_id" : explanationOfBenefitId
														}
														ApiFHIR.post('explanationOfBenefitProcessNote', {"apikey": apikey}, {body: dataExplanationOfBenefitProcessNote, json: true}, function(error, response, body){
															explanationOfBenefitProcessNote = body;
															if(explanationOfBenefitProcessNote.err_code > 0){
																res.json(explanationOfBenefitProcessNote);	
															}
														})
														
														dataExplanationOfBenefitBalance = {
															"balance_id" :explanationOfBenefitBalanceId,
															"category" : benefitBalanceCategory,
															"sub_category" : benefitBalanceSubCategory,
															"excluded" : benefitBalanceExcluded,
															"name" : benefitBalanceName,
															"desciption" : benefitBalanceDescription,
															"network" : benefitBalanceNetwork,
															"unit" : benefitBalanceUnit,
															"term" : benefitBalanceTerm,
															"explanation_of_benefit_id" : explanationOfBenefitId
														}
														ApiFHIR.post('explanationOfBenefitBalance', {"apikey": apikey}, {body: dataExplanationOfBenefitBalance, json: true}, function(error, response, body){
															explanationOfBenefitBalance = body;
															if(explanationOfBenefitBalance.err_code > 0){
																res.json(explanationOfBenefitBalance);	
															}
														})
														
														dataExplanationOfBenefitBalanceFinancial = {
															"balance_financial_id" : explanationOfBenefitBalanceFinancialId,
															"type" : benefitBalanceFinancialType,
															"allowed_unsigned_int" : benefitBalanceFinancialAllowedString,
															"allowed_string" : benefitBalanceFinancialAllowedString,
															"allowed_money" : benefitBalanceFinancialAllowedMoney,
															"used_unsigned_int" : benefitBalanceFinancialUsedUnsignedInt,
															"used_money" : benefitBalanceFinancialUsedMoney,
															"balance_id" :explanationOfBenefitBalanceId
														}
														ApiFHIR.post('explanationOfBenefitBalanceFinancial', {"apikey": apikey}, {body: dataExplanationOfBenefitBalanceFinancial, json: true}, function(error, response, body){
															explanationOfBenefitBalanceFinancial = body;
															if(explanationOfBenefitBalanceFinancial.err_code > 0){
																res.json(explanationOfBenefitBalanceFinancial);	
															}
														})
														/*-------*/
														
														/*post reference*/
														if(itemUdi !== ""){
															dataItemUdi = {
																"_id" : itemUdi,
																"explanation_of_benefit_item_id" : explanationOfBenefitId
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
																"explanation_of_benefit_id" : explanationOfBenefitId
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
																"explanation_of_benefit_detail_id" : explanationOfBenefitId
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
																"explanation_of_benefit_sub_detail_id" : explanationOfBenefitId
															}
															ApiFHIR.put('device', {"apikey": apikey, "_id": itemSubDetailUdi}, {body: dataItemSubDetailUdi, json: true}, function(error, response, body){
																returnItemSubDetailUdi = body;
																if(returnItemSubDetailUdi.err_code > 0){
																	res.json(returnItemSubDetailUdi);	
																	console.log("add reference Item sub detail udi : " + itemSubDetailUdi);
																}
															});
														}

														
														res.json({"err_code": 0, "err_msg": "Explanation Of Benefit has been add.", "data": [{"_id": explanationOfBenefitId}]});
													}else{
														res.json({"err_code": 528, "err_msg": "Identifier value already exist."});		
													}
												})
										});

										/*check code dan reference*/
										myEmitter.prependOnceListener('checkStatus', function () {
											if (!validator.isEmpty(status)) {
												checkCode(apikey, status, 'EXPLANATIONOFBENEFIT_STATUS', function (resStatusCode) {
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

										myEmitter.prependOnceListener('checkOutcome', function () {
											if (!validator.isEmpty(outcome)) {
												checkCode(apikey, outcome, 'REMITTANCE_OUTCOME', function (resOutcomeCode) {
													if (resOutcomeCode.err_code > 0) {
														myEmitter.emit('checkSubType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Outcome code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkSubType');
											}
										})

										myEmitter.prependOnceListener('checkRelatedRelationship', function () {
											if (!validator.isEmpty(relatedRelationship)) {
												checkCode(apikey, relatedRelationship, 'RELATED_CLAIM_RELATIONSHIP', function (resRelatedRelationshipCode) {
													if (resRelatedRelationshipCode.err_code > 0) {
														myEmitter.emit('checkOutcome');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Related relationship code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkOutcome');
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
												checkCode(apikey, payeeResourceType, 'RESOURCE_TYPE_LINK', function (resPayeeResourceTypeCode) {
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

										myEmitter.prependOnceListener('checkInformationCategory', function () {
											if (!validator.isEmpty(informationCategory)) {
												checkCode(apikey, informationCategory, 'CLAIM_INFORMATIONCATEGORY', function (resInformationCategoryCode) {
													if (resInformationCategoryCode.err_code > 0) {
														myEmitter.emit('checkPayeeResourceType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Information category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPayeeResourceType');
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
												checkCode(apikey, informationValueAttachmentLanguage, 'LANGUAGE', function (resInformationValueAttachmentLanguageCode) {
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

										myEmitter.prependOnceListener('checkCareTeamRole', function () {
											if (!validator.isEmpty(careTeamRole)) {
												checkCode(apikey, careTeamRole, 'CLAIM_CARETEAMROLE', function (resCareTeamRoleCode) {
													if (resCareTeamRoleCode.err_code > 0) {
														myEmitter.emit('checkInformationReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Care team role code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInformationReason');
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

										myEmitter.prependOnceListener('checkDiagnosisCodeableConcept', function () {
											if (!validator.isEmpty(diagnosisCodeableConcept)) {
												checkCode(apikey, diagnosisCodeableConcept, 'ICD_10', function (resDiagnosisCodeableConceptCode) {
													if (resDiagnosisCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkCareTeamQualification');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Diagnosis codeable concept code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCareTeamQualification');
											}
										})

										myEmitter.prependOnceListener('checkDiagnosisType', function () {
											if (!validator.isEmpty(diagnosisType)) {
												checkCode(apikey, diagnosisType, 'EX_DIAGNOSISTYPE', function (resDiagnosisTypeCode) {
													if (resDiagnosisTypeCode.err_code > 0) {
														myEmitter.emit('checkDiagnosisCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Diagnosis type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDiagnosisCodeableConcept');
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

										myEmitter.prependOnceListener('checkProcedureCodeableConcept', function () {
											if (!validator.isEmpty(procedureCodeableConcept)) {
												checkCode(apikey, procedureCodeableConcept, 'ICD_10_PROCEDURES', function (resProcedureCodeableConceptCode) {
													if (resProcedureCodeableConceptCode.err_code > 0) {
														myEmitter.emit('checkDiagnosisPackageCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Procedure codeable concept code not found"
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
														myEmitter.emit('checkProcedureCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Accident type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkProcedureCodeableConcept');
											}
										})

										myEmitter.prependOnceListener('checkAccidentLocationAddressUse', function () {
											if (!validator.isEmpty(accidentLocationAddressUse)) {
												checkCode(apikey, accidentLocationAddressUse, 'ADDRESS_USE', function (resAccidentLocationAddressUseCode) {
													if (resAccidentLocationAddressUseCode.err_code > 0) {
														myEmitter.emit('checkAccidentType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Accident location address use code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAccidentType');
											}
										})

										myEmitter.prependOnceListener('checkAccidentLocationAddressType', function () {
											if (!validator.isEmpty(accidentLocationAddressType)) {
												checkCode(apikey, accidentLocationAddressType, 'ADDRESS_TYPE', function (resAccidentLocationAddressTypeCode) {
													if (resAccidentLocationAddressTypeCode.err_code > 0) {
														myEmitter.emit('checkAccidentLocationAddressUse');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Accident location address type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAccidentLocationAddressUse');
											}
										})

										myEmitter.prependOnceListener('checkItemRevenue', function () {
											if (!validator.isEmpty(itemRevenue)) {
												checkCode(apikey, itemRevenue, 'EX_REVENUE_CENTER', function (resItemRevenueCode) {
													if (resItemRevenueCode.err_code > 0) {
														myEmitter.emit('checkAccidentLocationAddressType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item revenue code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAccidentLocationAddressType');
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

										myEmitter.prependOnceListener('checkItemLocationAddressUse', function () {
											if (!validator.isEmpty(itemLocationAddressUse)) {
												checkCode(apikey, itemLocationAddressUse, 'ADDRESS_USE', function (resItemLocationAddressUseCode) {
													if (resItemLocationAddressUseCode.err_code > 0) {
														myEmitter.emit('checkItemLocationCodeableConcept');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item location address use code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemLocationCodeableConcept');
											}
										})

										myEmitter.prependOnceListener('checkItemLocationAddressType', function () {
											if (!validator.isEmpty(itemLocationAddressType)) {
												checkCode(apikey, itemLocationAddressType, 'ADDRESS_TYPE', function (resItemLocationAddressTypeCode) {
													if (resItemLocationAddressTypeCode.err_code > 0) {
														myEmitter.emit('checkItemLocationAddressUse');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item location address type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemLocationAddressUse');
											}
										})

										myEmitter.prependOnceListener('checkItemBodySite', function () {
											if (!validator.isEmpty(itemBodySite)) {
												checkCode(apikey, itemBodySite, 'TOOTH', function (resItemBodySiteCode) {
													if (resItemBodySiteCode.err_code > 0) {
														myEmitter.emit('checkItemLocationAddressType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item body site code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemLocationAddressType');
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

										myEmitter.prependOnceListener('checkItemAdjudicationCategory', function () {
											if (!validator.isEmpty(itemAdjudicationCategory)) {
												checkCode(apikey, itemAdjudicationCategory, 'ADJUDICATION', function (resItemAdjudicationCategoryCode) {
													if (resItemAdjudicationCategoryCode.err_code > 0) {
														myEmitter.emit('checkItemSubSite');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item adjudication category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemSubSite');
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

										myEmitter.prependOnceListener('checkItemDetailType', function () {
											if (!validator.isEmpty(itemDetailType)) {
												checkCode(apikey, itemDetailType, 'V3_ACTINVOICEGROUPCODE', function (resItemDetailTypeCode) {
													if (resItemDetailTypeCode.err_code > 0) {
														myEmitter.emit('checkItemAdjudicationReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item detail type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemAdjudicationReason');
											}
										})

										myEmitter.prependOnceListener('checkItemDetailRevenue', function () {
											if (!validator.isEmpty(itemDetailRevenue)) {
												checkCode(apikey, itemDetailRevenue, 'EX_REVENUE_CENTER', function (resItemDetailRevenueCode) {
													if (resItemDetailRevenueCode.err_code > 0) {
														myEmitter.emit('checkItemDetailType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item detail revenue code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemDetailType');
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

										myEmitter.prependOnceListener('checkItemDetailAdjudicationCategory', function () {
											if (!validator.isEmpty(itemDetailAdjudicationCategory)) {
												checkCode(apikey, itemDetailAdjudicationCategory, 'ADJUDICATION', function (resItemDetailAdjudicationCategoryCode) {
													if (resItemDetailAdjudicationCategoryCode.err_code > 0) {
														myEmitter.emit('checkItemDetailProgramCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item detail adjudication category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemDetailProgramCode');
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

										myEmitter.prependOnceListener('checkItemSubDetailType', function () {
											if (!validator.isEmpty(itemSubDetailType)) {
												checkCode(apikey, itemSubDetailType, 'V3_ACTINVOICEGROUPCODE', function (resItemSubDetailTypeCode) {
													if (resItemSubDetailTypeCode.err_code > 0) {
														myEmitter.emit('checkItemDetailAdjudicationReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item sub detail type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemDetailAdjudicationReason');
											}
										})

										myEmitter.prependOnceListener('checkItemSubDetailRevenue', function () {
											if (!validator.isEmpty(itemSubDetailRevenue)) {
												checkCode(apikey, itemSubDetailRevenue, 'EX_REVENUE_CENTER', function (resItemSubDetailRevenueCode) {
													if (resItemSubDetailRevenueCode.err_code > 0) {
														myEmitter.emit('checkItemSubDetailType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item sub detail revenue code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemSubDetailType');
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

										myEmitter.prependOnceListener('checkItemSubDetailAdjudicationCategory', function () {
											if (!validator.isEmpty(itemSubDetailAdjudicationCategory)) {
												checkCode(apikey, itemSubDetailAdjudicationCategory, 'ADJUDICATION', function (resItemSubDetailAdjudicationCategoryCode) {
													if (resItemSubDetailAdjudicationCategoryCode.err_code > 0) {
														myEmitter.emit('checkItemSubDetailProgramCode');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item sub detail adjudication category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemSubDetailProgramCode');
											}
										})

										myEmitter.prependOnceListener('checkItemSubDetailAdjudicationReason', function () {
											if (!validator.isEmpty(itemSubDetailAdjudicationReason)) {
												checkCode(apikey, itemSubDetailAdjudicationReason, 'ADJUDICATION_REASON', function (resItemSubDetailAdjudicationReasonCode) {
													if (resItemSubDetailAdjudicationReasonCode.err_code > 0) {
														myEmitter.emit('checkItemSubDetailAdjudicationCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Item sub detail adjudication reason code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemSubDetailAdjudicationCategory');
											}
										})

										myEmitter.prependOnceListener('checkAddItemRevenue', function () {
											if (!validator.isEmpty(addItemRevenue)) {
												checkCode(apikey, addItemRevenue, 'EX_REVENUE_CENTER', function (resAddItemRevenueCode) {
													if (resAddItemRevenueCode.err_code > 0) {
														myEmitter.emit('checkItemSubDetailAdjudicationReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Add item revenue code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkItemSubDetailAdjudicationReason');
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

										myEmitter.prependOnceListener('checkPaymentType', function () {
											if (!validator.isEmpty(paymentType)) {
												checkCode(apikey, paymentType, 'EX_PAYMENTTYPE', function (resPaymentTypeCode) {
													if (resPaymentTypeCode.err_code > 0) {
														myEmitter.emit('checkAddItemDetailAdjudicationReason');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Payment type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkAddItemDetailAdjudicationReason');
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

										myEmitter.prependOnceListener('checkForm', function () {
											if (!validator.isEmpty(form)) {
												checkCode(apikey, form, 'FORMS', function (resFormCode) {
													if (resFormCode.err_code > 0) {
														myEmitter.emit('checkPaymentIdentifierType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Form code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPaymentIdentifierType');
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

										myEmitter.prependOnceListener('checkBenefitBalanceCategory', function () {
											if (!validator.isEmpty(benefitBalanceCategory)) {
												checkCode(apikey, benefitBalanceCategory, 'BENEFIT_CATEGORY', function (resBenefitBalanceCategoryCode) {
													if (resBenefitBalanceCategoryCode.err_code > 0) {
														myEmitter.emit('checkProcessNoteLanguage');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Benefit balance category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkProcessNoteLanguage');
											}
										})

										myEmitter.prependOnceListener('checkBenefitBalanceSubCategory', function () {
											if (!validator.isEmpty(benefitBalanceSubCategory)) {
												checkCode(apikey, benefitBalanceSubCategory, 'BENEFIT_SUBCATEGORY', function (resBenefitBalanceSubCategoryCode) {
													if (resBenefitBalanceSubCategoryCode.err_code > 0) {
														myEmitter.emit('checkBenefitBalanceCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Benefit balance sub category code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBenefitBalanceCategory');
											}
										})

										myEmitter.prependOnceListener('checkBenefitBalanceNetwork', function () {
											if (!validator.isEmpty(benefitBalanceNetwork)) {
												checkCode(apikey, benefitBalanceNetwork, 'BENEFIT_NETWORK', function (resBenefitBalanceNetworkCode) {
													if (resBenefitBalanceNetworkCode.err_code > 0) {
														myEmitter.emit('checkBenefitBalanceSubCategory');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Benefit balance network code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBenefitBalanceSubCategory');
											}
										})

										myEmitter.prependOnceListener('checkBenefitBalanceUnit', function () {
											if (!validator.isEmpty(benefitBalanceUnit)) {
												checkCode(apikey, benefitBalanceUnit, 'BENEFIT_UNIT', function (resBenefitBalanceUnitCode) {
													if (resBenefitBalanceUnitCode.err_code > 0) {
														myEmitter.emit('checkBenefitBalanceNetwork');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Benefit balance unit code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBenefitBalanceNetwork');
											}
										})

										myEmitter.prependOnceListener('checkBenefitBalanceTerm', function () {
											if (!validator.isEmpty(benefitBalanceTerm)) {
												checkCode(apikey, benefitBalanceTerm, 'BENEFIT_TERM', function (resBenefitBalanceTermCode) {
													if (resBenefitBalanceTermCode.err_code > 0) {
														myEmitter.emit('checkBenefitBalanceUnit');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Benefit balance term code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBenefitBalanceUnit');
											}
										})

										myEmitter.prependOnceListener('checkBenefitBalanceFinancialType', function () {
											if (!validator.isEmpty(benefitBalanceFinancialType)) {
												checkCode(apikey, benefitBalanceFinancialType, 'BENEFIT_TYPE', function (resBenefitBalanceFinancialTypeCode) {
													if (resBenefitBalanceFinancialTypeCode.err_code > 0) {
														myEmitter.emit('checkBenefitBalanceTerm');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Benefit balance financial type code not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBenefitBalanceTerm');
											}
										})
										
										myEmitter.prependOnceListener('checkPatient', function () {
											if (!validator.isEmpty(patient)) {
												checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
													if (resPatient.err_code > 0) {
														myEmitter.emit('checkBenefitBalanceFinancialType');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Patient id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkBenefitBalanceFinancialType');
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

										myEmitter.prependOnceListener('checkReferral', function () {
											if (!validator.isEmpty(referral)) {
												checkUniqeValue(apikey, "REFERRAL_REQUEST_ID|" + referral, 'REFERRAL_REQUEST', function (resReferral) {
													if (resReferral.err_code > 0) {
														myEmitter.emit('checkOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Referral id not found"
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

										myEmitter.prependOnceListener('checkClaim', function () {
											if (!validator.isEmpty(claim)) {
												checkUniqeValue(apikey, "CLAIM_ID|" + claim, 'CLAIM', function (resClaim) {
													if (resClaim.err_code > 0) {
														myEmitter.emit('checkFacility');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Claim id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkFacility');
											}
										})

										myEmitter.prependOnceListener('checkClaimResponse', function () {
											if (!validator.isEmpty(claimResponse)) {
												checkUniqeValue(apikey, "CLAIM_RESPONSE_ID|" + claimResponse, 'CLAIM_RESPONSE', function (resClaimResponse) {
													if (resClaimResponse.err_code > 0) {
														myEmitter.emit('checkClaim');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Claim response id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkClaim');
											}
										})

										myEmitter.prependOnceListener('checkRelatedClaim', function () {
											if (!validator.isEmpty(relatedClaim)) {
												checkUniqeValue(apikey, "CLAIM_ID|" + relatedClaim, 'CLAIM', function (resRelatedClaim) {
													if (resRelatedClaim.err_code > 0) {
														myEmitter.emit('checkClaimResponse');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Related claim id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkClaimResponse');
											}
										})

										myEmitter.prependOnceListener('checkRelatedReference', function () {
											if (!validator.isEmpty(relatedReference)) {
												checkUniqeValue(apikey, "IDENTIFIER_ID|" + relatedReference, '', function (resRelatedReference) {
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

										myEmitter.prependOnceListener('checkCareTeamProviderPractitioner', function () {
											if (!validator.isEmpty(careTeamProviderPractitioner)) {
												checkUniqeValue(apikey, "PRACTITIONER_ID|" + careTeamProviderPractitioner, 'PRACTITIONER', function (resCareTeamProviderPractitioner) {
													if (resCareTeamProviderPractitioner.err_code > 0) {
														myEmitter.emit('checkPayeePartyRelatedPerson');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Care team provider practitioner id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkPayeePartyRelatedPerson');
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

										myEmitter.prependOnceListener('checkDiagnosisReference', function () {
											if (!validator.isEmpty(diagnosisReference)) {
												checkUniqeValue(apikey, "CONDITION_ID|" + diagnosisReference, 'CONDITION', function (resDiagnosisReference) {
													if (resDiagnosisReference.err_code > 0) {
														myEmitter.emit('checkCareTeamProviderOrganization');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Diagnosis reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkCareTeamProviderOrganization');
											}
										})

										myEmitter.prependOnceListener('checkProcedureReference', function () {
											if (!validator.isEmpty(procedureReference)) {
												checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureReference, 'PROCEDURE', function (resProcedureReference) {
													if (resProcedureReference.err_code > 0) {
														myEmitter.emit('checkDiagnosisReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Procedure reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkDiagnosisReference');
											}
										})

										myEmitter.prependOnceListener('checkInsuranceCoverage', function () {
											if (!validator.isEmpty(insuranceCoverage)) {
												checkUniqeValue(apikey, "COVERAGE_ID|" + insuranceCoverage, 'COVERAGE', function (resInsuranceCoverage) {
													if (resInsuranceCoverage.err_code > 0) {
														myEmitter.emit('checkProcedureReference');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Insurance coverage id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkProcedureReference');
											}
										})

										myEmitter.prependOnceListener('checkAccidentLocationReference', function () {
											if (!validator.isEmpty(accidentLocationReference)) {
												checkUniqeValue(apikey, "LOCATION_ID|" + accidentLocationReference, 'LOCATION', function (resAccidentLocationReference) {
													if (resAccidentLocationReference.err_code > 0) {
														myEmitter.emit('checkInsuranceCoverage');
													} else {
														res.json({
															"err_code": "500",
															"err_msg": "Accident location reference id not found"
														});
													}
												})
											} else {
												myEmitter.emit('checkInsuranceCoverage');
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

										myEmitter.prependOnceListener('checkItemSubDetailUdi', function () {
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
										})

										if (!validator.isEmpty(paymentIdentifierValue)) {
											checkUniqeValue(apikey, "IDENTIFIER_ID|" + paymentIdentifierValue, 'IDENTIFIER', function (resPaymentIdentifierValue) {
												if (resPaymentIdentifierValue.err_code > 0) {
													myEmitter.emit('checkItemSubDetailUdi');
												} else {
													res.json({
														"err_code": "500",
														"err_msg": "Payment identifier value id not found"
													});
												}
											})
										} else {
											myEmitter.emit('checkItemSubDetailUdi');
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
      var explanationOfBenefitId = req.params.explanation_of_benefit_id;

      var err_code = 0;
      var err_msg = "";

      //input check
      if (typeof explanationOfBenefitId !== 'undefined') {
        if (validator.isEmpty(explanationOfBenefitId)) {
          err_code = 2;
          err_msg = "Explanation Of Benefit id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Explanation Of Benefit id is required";
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
                        checkUniqeValue(apikey, "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId, 'EXPLANATION_OF_BENEFIT', function (resEncounterID) {
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
                              "explanation_of_benefit_id": explanationOfBenefitId
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
                                  "err_msg": "Identifier has been add in this Explanation Of Benefit.",
                                  "data": identifier.data
                                });
                              } else {
                                res.json(identifier);
                              }
                            })
                          } else {
                            res.json({
                              "err_code": 503,
                              "err_msg": "Explanation Of Benefit Id not found"
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
		explanationOfBenefit: function updateExplanationOfBenefit(req, res) {
			var ipAddres = req.connection.remoteAddress;
      var apikey = req.params.apikey;
      var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			
			var explanationOfBenefitId = req.params.explanation_of_benefit_id;
			
			var err_code = 0;
      var err_msg = "";
      var dataExplanationOfBenefit = {};
			
			if (typeof explanationOfBenefitId !== 'undefined') {
        if (validator.isEmpty(explanationOfBenefitId)) {
          err_code = 2;
          err_msg = "Explanation Of Benefit Id is required.";
        }
      } else {
        err_code = 1;
        err_msg = "Explanation Of Benefit Id is required.";
      }
			
			if(typeof req.body.status !== 'undefined' && req.body.status !== ""){
				var status =  req.body.status.trim().toLowerCase();
				if(validator.isEmpty(status)){
					dataExplanationOfBenefit.status = "";
				}else{
					dataExplanationOfBenefit.status = status;
				}
			}else{
			  status = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var type =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(type)){
					dataExplanationOfBenefit.type = "";
				}else{
					dataExplanationOfBenefit.type = type;
				}
			}else{
			  type = "";
			}

			if(typeof req.body.subType !== 'undefined' && req.body.subType !== ""){
				var subType =  req.body.subType.trim().toLowerCase();
				if(validator.isEmpty(subType)){
					dataExplanationOfBenefit.sub_type = "";
				}else{
					dataExplanationOfBenefit.sub_type = subType;
				}
			}else{
			  subType = "";
			}

			if(typeof req.body.patient !== 'undefined' && req.body.patient !== ""){
				var patient =  req.body.patient.trim().toLowerCase();
				if(validator.isEmpty(patient)){
					dataExplanationOfBenefit.patient = "";
				}else{
					dataExplanationOfBenefit.patient = patient;
				}
			}else{
			  patient = "";
			}

			if (typeof req.body.billablePeriod !== 'undefined' && req.body.billablePeriod !== "") {
			  var billablePeriod = req.body.billablePeriod;
			  if (billablePeriod.indexOf("to") > 0) {
			    arrBillablePeriod = billablePeriod.split("to");
			    dataExplanationOfBenefit.billable_period_start = arrBillablePeriod[0];
			    dataExplanationOfBenefit.billable_period_end = arrBillablePeriod[1];
			    if (!regex.test(billablePeriodStart) && !regex.test(billablePeriodEnd)) {
			      err_code = 2;
			      err_msg = "explanation of benefit billable period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "explanation of benefit billable period invalid date format.";
				}
			} else {
			  billablePeriod = "";
			}

			if(typeof req.body.created !== 'undefined' && req.body.created !== ""){
				var created =  req.body.created;
				if(validator.isEmpty(created)){
					err_code = 2;
					err_msg = "explanation of benefit created is required.";
				}else{
					if(!regex.test(created)){
						err_code = 2;
						err_msg = "explanation of benefit created invalid date format.";	
					}else{
						dataExplanationOfBenefit.created = created;
					}
				}
			}else{
			  created = "";
			}

			if(typeof req.body.enterer !== 'undefined' && req.body.enterer !== ""){
				var enterer =  req.body.enterer.trim().toLowerCase();
				if(validator.isEmpty(enterer)){
					dataExplanationOfBenefit.enterer = "";
				}else{
					dataExplanationOfBenefit.enterer = enterer;
				}
			}else{
			  enterer = "";
			}

			if(typeof req.body.insurer !== 'undefined' && req.body.insurer !== ""){
				var insurer =  req.body.insurer.trim().toLowerCase();
				if(validator.isEmpty(insurer)){
					dataExplanationOfBenefit.insurer = "";
				}else{
					dataExplanationOfBenefit.insurer = insurer;
				}
			}else{
			  insurer = "";
			}

			if(typeof req.body.provider !== 'undefined' && req.body.provider !== ""){
				var provider =  req.body.provider.trim().toLowerCase();
				if(validator.isEmpty(provider)){
					dataExplanationOfBenefit.provider = "";
				}else{
					dataExplanationOfBenefit.provider = provider;
				}
			}else{
			  provider = "";
			}

			if(typeof req.body.organization !== 'undefined' && req.body.organization !== ""){
				var organization =  req.body.organization.trim().toLowerCase();
				if(validator.isEmpty(organization)){
					dataExplanationOfBenefit.organization = "";
				}else{
					dataExplanationOfBenefit.organization = organization;
				}
			}else{
			  organization = "";
			}

			if(typeof req.body.referral !== 'undefined' && req.body.referral !== ""){
				var referral =  req.body.referral.trim().toLowerCase();
				if(validator.isEmpty(referral)){
					dataExplanationOfBenefit.referral = "";
				}else{
					dataExplanationOfBenefit.referral = referral;
				}
			}else{
			  referral = "";
			}

			if(typeof req.body.facility !== 'undefined' && req.body.facility !== ""){
				var facility =  req.body.facility.trim().toLowerCase();
				if(validator.isEmpty(facility)){
					dataExplanationOfBenefit.facility = "";
				}else{
					dataExplanationOfBenefit.facility = facility;
				}
			}else{
			  facility = "";
			}

			if(typeof req.body.claim !== 'undefined' && req.body.claim !== ""){
				var claim =  req.body.claim.trim().toLowerCase();
				if(validator.isEmpty(claim)){
					dataExplanationOfBenefit.claim = "";
				}else{
					dataExplanationOfBenefit.claim = claim;
				}
			}else{
			  claim = "";
			}

			if(typeof req.body.claimResponse !== 'undefined' && req.body.claimResponse !== ""){
				var claimResponse =  req.body.claimResponse.trim().toLowerCase();
				if(validator.isEmpty(claimResponse)){
					dataExplanationOfBenefit.claim_response = "";
				}else{
					dataExplanationOfBenefit.claim_response = claimResponse;
				}
			}else{
			  claimResponse = "";
			}

			if(typeof req.body.outcome !== 'undefined' && req.body.outcome !== ""){
				var outcome =  req.body.outcome.trim().toLowerCase();
				if(validator.isEmpty(outcome)){
					dataExplanationOfBenefit.outcome = "";
				}else{
					dataExplanationOfBenefit.outcome = outcome;
				}
			}else{
			  outcome = "";
			}

			if(typeof req.body.disposition !== 'undefined' && req.body.disposition !== ""){
				var disposition =  req.body.disposition.trim().toLowerCase();
				if(validator.isEmpty(disposition)){
					dataExplanationOfBenefit.disposition = "";
				}else{
					dataExplanationOfBenefit.disposition = disposition;
				}
			}else{
			  disposition = "";
			}
			
			if(typeof req.body.prescription.medicationRequest !== 'undefined' && req.body.prescription.medicationRequest !== ""){
				var prescriptionMedicationRequest =  req.body.prescription.medicationRequest.trim().toLowerCase();
				if(validator.isEmpty(prescriptionMedicationRequest)){
					dataExplanationOfBenefit.prescription_medication_request = "";
				}else{
					dataExplanationOfBenefit.prescription_medication_request = prescriptionMedicationRequest;
				}
			}else{
			  prescriptionMedicationRequest = "";
			}

			if(typeof req.body.prescription.visionPrescription !== 'undefined' && req.body.prescription.visionPrescription !== ""){
				var prescriptionVisionPrescription =  req.body.prescription.visionPrescription.trim().toLowerCase();
				if(validator.isEmpty(prescriptionVisionPrescription)){
					dataExplanationOfBenefit.prescription_vision_prescription = "";
				}else{
					dataExplanationOfBenefit.prescription_vision_prescription = prescriptionVisionPrescription;
				}
			}else{
			  prescriptionVisionPrescription = "";
			}

			if(typeof req.body.originalPrescription !== 'undefined' && req.body.originalPrescription !== ""){
				var originalPrescription =  req.body.originalPrescription.trim().toLowerCase();
				if(validator.isEmpty(originalPrescription)){
					dataExplanationOfBenefit.original_prescription = "";
				}else{
					dataExplanationOfBenefit.original_prescription = originalPrescription;
				}
			}else{
			  originalPrescription = "";
			}

			if(typeof req.body.payee.type !== 'undefined' && req.body.payee.type !== ""){
				var payeeType =  req.body.payee.type.trim().toLowerCase();
				if(validator.isEmpty(payeeType)){
					dataExplanationOfBenefit.payee_type = "";
				}else{
					dataExplanationOfBenefit.payee_type = payeeType;
				}
			}else{
			  payeeType = "";
			}

			if(typeof req.body.payee.resourceType !== 'undefined' && req.body.payee.resourceType !== ""){
				var payeeResourceType =  req.body.payee.resourceType.trim().toLowerCase();
				if(validator.isEmpty(payeeResourceType)){
					dataExplanationOfBenefit.payee_resource_type = "";
				}else{
					dataExplanationOfBenefit.payee_resource_type = payeeResourceType;
				}
			}else{
			  payeeResourceType = "";
			}

			if(typeof req.body.payee.party.practitioner !== 'undefined' && req.body.payee.party.practitioner !== ""){
				var payeePartyPractitioner =  req.body.payee.party.practitioner.trim().toLowerCase();
				if(validator.isEmpty(payeePartyPractitioner)){
					dataExplanationOfBenefit.payee_party_practitioner = "";
				}else{
					dataExplanationOfBenefit.payee_party_practitioner = payeePartyPractitioner;
				}
			}else{
			  payeePartyPractitioner = "";
			}

			if(typeof req.body.payee.party.organization !== 'undefined' && req.body.payee.party.organization !== ""){
				var payeePartyOrganization =  req.body.payee.party.organization.trim().toLowerCase();
				if(validator.isEmpty(payeePartyOrganization)){
					dataExplanationOfBenefit.payee_party_organization = "";
				}else{
					dataExplanationOfBenefit.payee_party_organization = payeePartyOrganization;
				}
			}else{
			  payeePartyOrganization = "";
			}

			if(typeof req.body.payee.party.patient !== 'undefined' && req.body.payee.party.patient !== ""){
				var payeePartyPatient =  req.body.payee.party.patient.trim().toLowerCase();
				if(validator.isEmpty(payeePartyPatient)){
					dataExplanationOfBenefit.payee_party_patient = "";
				}else{
					dataExplanationOfBenefit.payee_party_patient = payeePartyPatient;
				}
			}else{
			  payeePartyPatient = "";
			}

			if(typeof req.body.payee.party.relatedPerson !== 'undefined' && req.body.payee.party.relatedPerson !== ""){
				var payeePartyRelatedPerson =  req.body.payee.party.relatedPerson.trim().toLowerCase();
				if(validator.isEmpty(payeePartyRelatedPerson)){
					dataExplanationOfBenefit.payee_party_related_person = "";
				}else{
					dataExplanationOfBenefit.payee_party_related_person = payeePartyRelatedPerson;
				}
			}else{
			  payeePartyRelatedPerson = "";
			}
			/*
			var precedence  = req.body.precedence;
			var insurance_coverage  = req.body.insurance_coverage;
			var insurance_pre_auth_ref  = req.body.insurance_pre_auth_ref;
			var accident_date  = req.body.accident_date;
			var accident_type  = req.body.accident_type;
			var location_address_use  = req.body.location_address_use;
			var location_address_type  = req.body.location_address_type;
			var location_address_text  = req.body.location_address_text;
			var location_address_line  = req.body.location_address_line;
			var location_address_city  = req.body.location_address_city;
			var location_address_district  = req.body.location_address_district;
			var location_address_state  = req.body.location_address_state;
			var location_address_postal_code  = req.body.location_address_postal_code;
			var location_address_country  = req.body.location_address_country;
			var location_address_period_start  = req.body.location_address_period_start;
			var location_address_period_end  = req.body.location_address_period_end;
			var accident_location_reference  = req.body.accident_location_reference;
			var employment_impacted_start  = req.body.employment_impacted_start;
			var employment_impacted_end  = req.body.employment_impacted_end;
			var hospitalization_start  = req.body.hospitalization_start;
			var hospitalization_end  = req.body.hospitalization_end;
			var total_cost  = req.body.total_cost;
			var unalloc_deductable  = req.body.unalloc_deductable;
			var total_benefit  = req.body.total_benefit;
			var payment_type  = req.body.payment_type;
			var payment_adjustment  = req.body.payment_adjustment;
			var payment_adjustment_reason  = req.body.payment_adjustment_reason;
			var payment_date  = req.body.payment_date;
			var payment_amount  = req.body.payment_amount;
			var payment_identifier  = req.body.payment_identifier;
			var form  = req.body.form;
			*/
			if(typeof req.body.precedence !== 'undefined' && req.body.precedence !== ""){
				var precedence =  req.body.precedence.trim();
				if(validator.isEmpty(precedence)){
					dataExplanationOfBenefit.precedence = "";
				}else{
					if(!validator.isInt(precedence)){
						err_code = 2;
						err_msg = "explanation of benefit precedence is must be number.";
					}else{
						dataExplanationOfBenefit.precedence = precedence;
					}
				}
			}else{
			  precedence = "";
			}

			if(typeof req.body.insurance.coverage !== 'undefined' && req.body.insurance.coverage !== ""){
				var insuranceCoverage =  req.body.insurance.coverage.trim().toLowerCase();
				if(validator.isEmpty(insuranceCoverage)){
					dataExplanationOfBenefit.insurance_coverage = "";
				}else{
					dataExplanationOfBenefit.insurance_coverage = insuranceCoverage;
				}
			}else{
			  insuranceCoverage = "";
			}

			if(typeof req.body.insurance.preAuthRef !== 'undefined' && req.body.insurance.preAuthRef !== ""){
				var insurancePreAuthRef =  req.body.insurance.preAuthRef.trim().toLowerCase();
				if(validator.isEmpty(insurancePreAuthRef)){
					dataExplanationOfBenefit.insurance_pre_auth_ref = "";
				}else{
					dataExplanationOfBenefit.insurance_pre_auth_ref = insurancePreAuthRef;
				}
			}else{
			  insurancePreAuthRef = "";
			}

			if(typeof req.body.accident.date !== 'undefined' && req.body.accident.date !== ""){
				var accidentDate =  req.body.accident.date;
				if(validator.isEmpty(accidentDate)){
					err_code = 2;
					err_msg = "explanation of benefit accident date is required.";
				}else{
					if(!regex.test(accidentDate)){
						err_code = 2;
						err_msg = "explanation of benefit accident date invalid date format.";	
					}else{
						dataExplanationOfBenefit.accident_date = accidentDate;
					}
				}
			}else{
			  accidentDate = "";
			}

			if(typeof req.body.accident.type !== 'undefined' && req.body.accident.type !== ""){
				var accidentType =  req.body.accident.type.trim().toUpperCase();
				if(validator.isEmpty(accidentType)){
					dataExplanationOfBenefit.accident_type = "";
				}else{
					dataExplanationOfBenefit.accident_type = accidentType;
				}
			}else{
			  accidentType = "";
			}

			if(typeof req.body.accident.location.locationAddress.use !== 'undefined' && req.body.accident.location.locationAddress.use !== ""){
				var accidentLocationAddressUse =  req.body.accident.location.locationAddress.use.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressUse)){
					dataExplanationOfBenefit.location_address_use = "";
				}else{
					dataExplanationOfBenefit.location_address_use = accidentLocationAddressUse;
				}
			}else{
			  accidentLocationAddressUse = "";
			}

			if(typeof req.body.accident.location.locationAddress.type !== 'undefined' && req.body.accident.location.locationAddress.type !== ""){
				var accidentLocationAddressType =  req.body.accident.location.locationAddress.type.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressType)){
					dataExplanationOfBenefit.location_address_type = "";
				}else{
					dataExplanationOfBenefit.location_address_type = accidentLocationAddressType;
				}
			}else{
			  accidentLocationAddressType = "";
			}

			if(typeof req.body.accident.location.locationAddress.text !== 'undefined' && req.body.accident.location.locationAddress.text !== ""){
				var accidentLocationAddressText =  req.body.accident.location.locationAddress.text.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressText)){
					dataExplanationOfBenefit.location_address_text = "";
				}else{
					dataExplanationOfBenefit.location_address_text = accidentLocationAddressText;
				}
			}else{
			  accidentLocationAddressText = "";
			}

			if(typeof req.body.accident.location.locationAddress.line !== 'undefined' && req.body.accident.location.locationAddress.line !== ""){
				var accidentLocationAddressLine =  req.body.accident.location.locationAddress.line.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressLine)){
					dataExplanationOfBenefit.location_address_line = "";
				}else{
					dataExplanationOfBenefit.location_address_line = accidentLocationAddressLine;
				}
			}else{
			  accidentLocationAddressLine = "";
			}

			if(typeof req.body.accident.location.locationAddress.city !== 'undefined' && req.body.accident.location.locationAddress.city !== ""){
				var accidentLocationAddressCity =  req.body.accident.location.locationAddress.city.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressCity)){
					dataExplanationOfBenefit.location_address_city = "";
				}else{
					dataExplanationOfBenefit.location_address_city = accidentLocationAddressCity;
				}
			}else{
			  accidentLocationAddressCity = "";
			}

			if(typeof req.body.accident.location.locationAddress.district !== 'undefined' && req.body.accident.location.locationAddress.district !== ""){
				var accidentLocationAddressDistrict =  req.body.accident.location.locationAddress.district.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressDistrict)){
					dataExplanationOfBenefit.location_address_district = "";
				}else{
					dataExplanationOfBenefit.location_address_district = accidentLocationAddressDistrict;
				}
			}else{
			  accidentLocationAddressDistrict = "";
			}

			if(typeof req.body.accident.location.locationAddress.state !== 'undefined' && req.body.accident.location.locationAddress.state !== ""){
				var accidentLocationAddressState =  req.body.accident.location.locationAddress.state.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressState)){
					dataExplanationOfBenefit.location_address_state = "";
				}else{
					dataExplanationOfBenefit.location_address_state = accidentLocationAddressState;
				}
			}else{
			  accidentLocationAddressState = "";
			}

			if(typeof req.body.accident.location.locationAddress.postalCode !== 'undefined' && req.body.accident.location.locationAddress.postalCode !== ""){
				var accidentLocationAddressPostalCode =  req.body.accident.location.locationAddress.postalCode.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressPostalCode)){
					dataExplanationOfBenefit.location_address_postal_code = "";
				}else{
					dataExplanationOfBenefit.location_address_postal_code = accidentLocationAddressPostalCode;
				}
			}else{
			  accidentLocationAddressPostalCode = "";
			}

			if(typeof req.body.accident.location.locationAddress.country !== 'undefined' && req.body.accident.location.locationAddress.country !== ""){
				var accidentLocationAddressCountry =  req.body.accident.location.locationAddress.country.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationAddressCountry)){
					dataExplanationOfBenefit.location_address_country = "";
				}else{
					dataExplanationOfBenefit.location_address_country = accidentLocationAddressCountry;
				}
			}else{
			  accidentLocationAddressCountry = "";
			}

			if(typeof req.body.accident.location.locationAddress.period !== 'undefined' && req.body.accident.location.locationAddress.period !== "") {
			  var accidentLocationAddressPeriod = req.body.accident.location.locationAddress.period;
			  if (accidentLocationAddressPeriod.indexOf("to") > 0) {
			    arrAccidentLocationAddressPeriod = accidentLocationAddressPeriod.split("to");
			    dataExplanationOfBenefit.location_address_period_start = arrAccidentLocationAddressPeriod[0];
			    dataExplanationOfBenefit.location_address_period_end = arrAccidentLocationAddressPeriod[1];
			    if (!regex.test(accidentLocationAddressPeriodStart) && !regex.test(accidentLocationAddressPeriodEnd)) {
			      err_code = 2;
			      err_msg = "explanation of benefit accident location location address period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "explanation of benefit accident location location address period invalid date format.";
				}
			} else {
			  accidentLocationAddressPeriod = "";
			}

			if(typeof req.body.accident.location.locationReference !== 'undefined' && req.body.accident.location.locationReference !== ""){
				var accidentLocationReference =  req.body.accident.location.locationReference.trim().toLowerCase();
				if(validator.isEmpty(accidentLocationReference)){
					dataExplanationOfBenefit.accident_location_reference = "";
				}else{
					dataExplanationOfBenefit.accident_location_reference = accidentLocationReference;
				}
			}else{
			  accidentLocationReference = "";
			}

			if (typeof req.body.employmentImpacted !== 'undefined' && req.body.employmentImpacted !== "") {
			  var employmentImpacted = req.body.employmentImpacted;
			  if (employmentImpacted.indexOf("to") > 0) {
			    arrEmploymentImpacted = employmentImpacted.split("to");
			    dataExplanationOfBenefit.employment_impacted_start = arrEmploymentImpacted[0];
			    dataExplanationOfBenefit.employment_impacted_end = arrEmploymentImpacted[1];
			    if (!regex.test(employmentImpactedStart) && !regex.test(employmentImpactedEnd)) {
			      err_code = 2;
			      err_msg = "explanation of benefit employment impacted invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "explanation of benefit employment impacted invalid date format.";
				}
			} else {
			  employmentImpacted = "";
			}

			if (typeof req.body.hospitalization !== 'undefined' && req.body.hospitalization !== "") {
			  var hospitalization = req.body.hospitalization;
			  if (hospitalization.indexOf("to") > 0) {
			    arrHospitalization = hospitalization.split("to");
			    dataExplanationOfBenefit.hospitalization_start = arrHospitalization[0];
			    dataExplanationOfBenefit.hospitalization_end = arrHospitalization[1];
			    if (!regex.test(hospitalizationStart) && !regex.test(hospitalizationEnd)) {
			      err_code = 2;
			      err_msg = "explanation of benefit hospitalization invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "explanation of benefit hospitalization invalid date format.";
				}
			} else {
			  hospitalization = "";
			}

			if(typeof req.body.totalCost !== 'undefined' && req.body.totalCost !== ""){
				var totalCost =  req.body.totalCost.trim().toLowerCase();
				if(validator.isEmpty(totalCost)){
					dataExplanationOfBenefit.total_cost = "";
				}else{
					dataExplanationOfBenefit.total_cost = totalCost;
				}
			}else{
			  totalCost = "";
			}

			if(typeof req.body.unallocDeductable !== 'undefined' && req.body.unallocDeductable !== ""){
				var unallocDeductable =  req.body.unallocDeductable.trim().toLowerCase();
				if(validator.isEmpty(unallocDeductable)){
					dataExplanationOfBenefit.unalloc_deductable = "";
				}else{
					dataExplanationOfBenefit.unalloc_deductable = unallocDeductable;
				}
			}else{
			  unallocDeductable = "";
			}

			if(typeof req.body.totalBenefit !== 'undefined' && req.body.totalBenefit !== ""){
				var totalBenefit =  req.body.totalBenefit.trim().toLowerCase();
				if(validator.isEmpty(totalBenefit)){
					dataExplanationOfBenefit.total_benefit = "";
				}else{
					dataExplanationOfBenefit.total_benefit = totalBenefit;
				}
			}else{
			  totalBenefit = "";
			}

			if(typeof req.body.payment.type !== 'undefined' && req.body.payment.type !== ""){
				var paymentType =  req.body.payment.type.trim().toLowerCase();
				if(validator.isEmpty(paymentType)){
					dataExplanationOfBenefit.payment_type = "";
				}else{
					dataExplanationOfBenefit.payment_type = paymentType;
				}
			}else{
			  paymentType = "";
			}

			if(typeof req.body.payment.adjustment !== 'undefined' && req.body.payment.adjustment !== ""){
				var paymentAdjustment =  req.body.payment.adjustment.trim().toLowerCase();
				if(validator.isEmpty(paymentAdjustment)){
					dataExplanationOfBenefit.payment_adjustment = "";
				}else{
					dataExplanationOfBenefit.payment_adjustment = paymentAdjustment;
				}
			}else{
			  paymentAdjustment = "";
			}

			if(typeof req.body.payment.adjustmentReason !== 'undefined' && req.body.payment.adjustmentReason !== ""){
				var paymentAdjustmentReason =  req.body.payment.adjustmentReason.trim().toLowerCase();
				if(validator.isEmpty(paymentAdjustmentReason)){
					dataExplanationOfBenefit.payment_adjustment_reason = "";
				}else{
					dataExplanationOfBenefit.payment_adjustment_reason = paymentAdjustmentReason;
				}
			}else{
			  paymentAdjustmentReason = "";
			}

			if(typeof req.body.payment.date !== 'undefined' && req.body.payment.date !== ""){
				var paymentDate =  req.body.payment.date;
				if(validator.isEmpty(paymentDate)){
					err_code = 2;
					err_msg = "explanation of benefit payment date is required.";
				}else{
					if(!regex.test(paymentDate)){
						err_code = 2;
						err_msg = "explanation of benefit payment date invalid date format.";	
					}else{
						dataExplanationOfBenefit.payment_date = paymentDate;
					}
				}
			}else{
			  paymentDate = "";
			}

			if(typeof req.body.payment.amount !== 'undefined' && req.body.payment.amount !== ""){
				var paymentAmount =  req.body.payment.amount.trim().toLowerCase();
				if(validator.isEmpty(paymentAmount)){
					dataExplanationOfBenefit.payment_amount = "";
				}else{
					dataExplanationOfBenefit.payment_amount = paymentAmount;
				}
			}else{
			  paymentAmount = "";
			}

			/*if(typeof req.body.payment.identifier.use !== 'undefined' && req.body.payment.identifier.use !== ""){
				var paymentIdentifierUse =  req.body.payment.identifier.use.trim().toLowerCase();
				if(validator.isEmpty(paymentIdentifierUse)){
					dataExplanationOfBenefit.use = "";
				}else{
					dataExplanationOfBenefit.use = paymentIdentifierUse;
				}
			}else{
			  paymentIdentifierUse = "";
			}

			if(typeof req.body.payment.identifier.type !== 'undefined' && req.body.payment.identifier.type !== ""){
				var paymentIdentifierType =  req.body.payment.identifier.type.trim().toLowerCase();
				if(validator.isEmpty(paymentIdentifierType)){
					dataExplanationOfBenefit.type = "";
				}else{
					dataExplanationOfBenefit.type = paymentIdentifierType;
				}
			}else{
			  paymentIdentifierType = "";
			}

			if(typeof req.body.payment.identifier.value !== 'undefined' && req.body.payment.identifier.value !== ""){
				var paymentIdentifierValue =  req.body.payment.identifier.value.trim().toLowerCase();
				if(validator.isEmpty(paymentIdentifierValue)){
					dataExplanationOfBenefit.value = "";
				}else{
					dataExplanationOfBenefit.value = paymentIdentifierValue;
				}
			}else{
			  paymentIdentifierValue = "";
			}

			if (typeof req.body.payment.identifier.period !== 'undefined' && req.body.payment.identifier.period !== "") {
			  var paymentIdentifierPeriod = req.body.payment.identifier.period;
			  if (paymentIdentifierPeriod.indexOf("to") > 0) {
			    arrPaymentIdentifierPeriod = paymentIdentifierPeriod.split("to");
			    dataExplanationOfBenefit.period_start = arrPaymentIdentifierPeriod[0];
			    dataExplanationOfBenefit.period_end = arrPaymentIdentifierPeriod[1];
			    if (!regex.test(paymentIdentifierPeriodStart) && !regex.test(paymentIdentifierPeriodEnd)) {
			      err_code = 2;
			      err_msg = "explanation of benefit payment identifier period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "explanation of benefit payment identifier period invalid date format.";
				}
			} else {
			  paymentIdentifierPeriod = "";
			}*/

			if(typeof req.body.form !== 'undefined' && req.body.form !== ""){
				var form =  req.body.form.trim().toLowerCase();
				if(validator.isEmpty(form)){
					dataExplanationOfBenefit.form = "";
				}else{
					dataExplanationOfBenefit.form = form;
				}
			}else{
			  form = "";
			}
			
			if (err_code == 0) {
				checkApikey(apikey, ipAddres, function (result) {
					if (result.err_code == 0) {
						myEmitter.once('checkId', function () {
							checkUniqeValue(apikey, "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId, 'EXPLANATION_OF_BENEFIT', function (resExplanationOfBenefitId) {
								if (resExplanationOfBenefitId.err_code > 0) {
									ApiFHIR.put('bodysite', {
										"apikey": apikey,
										"_id": explanationOfBenefitId
									}, {
										body: dataExplanationOfBenefit,
										json: true
									}, function (error, response, body) {
										explanationOfBenefit = body;
										if (explanationOfBenefit.err_code > 0) {
											res.json(explanationOfBenefit);
										} else {
											res.json({
												"err_code": 0,
												"err_msg": "Explanation Of Benefit has been updated.",
												"data": explanationOfBenefit.data
											});
										}
									})
								} else {
									res.json({
										"err_code": 404,
										"err_msg": "Explanation Of Benefit Id not found"
									});
								}
							})
						})
						
						/*buat reference */
						myEmitter.prependOnceListener('checkStatus', function () {
							if (!validator.isEmpty(status)) {
								checkCode(apikey, status, 'EXPLANATIONOFBENEFIT_STATUS', function (resStatusCode) {
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

						myEmitter.prependOnceListener('checkOutcome', function () {
							if (!validator.isEmpty(outcome)) {
								checkCode(apikey, outcome, 'REMITTANCE_OUTCOME', function (resOutcomeCode) {
									if (resOutcomeCode.err_code > 0) {
										myEmitter.emit('checkSubType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Outcome code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkSubType');
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

						myEmitter.prependOnceListener('checkPayeeResourceType', function () {
							if (!validator.isEmpty(payeeResourceType)) {
								checkCode(apikey, payeeResourceType, 'RESOURCE_TYPE_LINK', function (resPayeeResourceTypeCode) {
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

						myEmitter.prependOnceListener('checkAccidentType', function () {
							if (!validator.isEmpty(accidentType)) {
								checkCode(apikey, accidentType, 'V3_ACTINCIDENTCODE', function (resAccidentTypeCode) {
									if (resAccidentTypeCode.err_code > 0) {
										myEmitter.emit('checkPayeeResourceType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Accident type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPayeeResourceType');
							}
						})

						myEmitter.prependOnceListener('checkAccidentLocationAddressUse', function () {
							if (!validator.isEmpty(accidentLocationAddressUse)) {
								checkCode(apikey, accidentLocationAddressUse, 'ADDRESS_USE', function (resAccidentLocationAddressUseCode) {
									if (resAccidentLocationAddressUseCode.err_code > 0) {
										myEmitter.emit('checkAccidentType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Accident location address use code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAccidentType');
							}
						})

						myEmitter.prependOnceListener('checkAccidentLocationAddressType', function () {
							if (!validator.isEmpty(accidentLocationAddressType)) {
								checkCode(apikey, accidentLocationAddressType, 'ADDRESS_TYPE', function (resAccidentLocationAddressTypeCode) {
									if (resAccidentLocationAddressTypeCode.err_code > 0) {
										myEmitter.emit('checkAccidentLocationAddressUse');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Accident location address type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAccidentLocationAddressUse');
							}
						})

						myEmitter.prependOnceListener('checkPaymentType', function () {
							if (!validator.isEmpty(paymentType)) {
								checkCode(apikey, paymentType, 'EX_PAYMENTTYPE', function (resPaymentTypeCode) {
									if (resPaymentTypeCode.err_code > 0) {
										myEmitter.emit('checkAccidentLocationAddressType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Payment type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAccidentLocationAddressType');
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

						myEmitter.prependOnceListener('checkForm', function () {
							if (!validator.isEmpty(form)) {
								checkCode(apikey, form, 'FORMS', function (resFormCode) {
									if (resFormCode.err_code > 0) {
										myEmitter.emit('checkPaymentAdjustmentReason');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Form code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkPaymentAdjustmentReason');
							}
						})

						myEmitter.prependOnceListener('checkPatient', function () {
							if (!validator.isEmpty(patient)) {
								checkUniqeValue(apikey, "PATIENT_ID|" + patient, 'PATIENT', function (resPatient) {
									if (resPatient.err_code > 0) {
										myEmitter.emit('checkForm');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Patient id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkForm');
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

						myEmitter.prependOnceListener('checkReferral', function () {
							if (!validator.isEmpty(referral)) {
								checkUniqeValue(apikey, "REFERRAL_REQUEST_ID|" + referral, 'REFERRAL_REQUEST', function (resReferral) {
									if (resReferral.err_code > 0) {
										myEmitter.emit('checkOrganization');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Referral id not found"
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

						myEmitter.prependOnceListener('checkClaim', function () {
							if (!validator.isEmpty(claim)) {
								checkUniqeValue(apikey, "CLAIM_ID|" + claim, 'CLAIM', function (resClaim) {
									if (resClaim.err_code > 0) {
										myEmitter.emit('checkFacility');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Claim id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkFacility');
							}
						})

						myEmitter.prependOnceListener('checkClaimResponse', function () {
							if (!validator.isEmpty(claimResponse)) {
								checkUniqeValue(apikey, "CLAIM_RESPONSE_ID|" + claimResponse, 'CLAIM_RESPONSE', function (resClaimResponse) {
									if (resClaimResponse.err_code > 0) {
										myEmitter.emit('checkClaim');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Claim response id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaim');
							}
						})

						myEmitter.prependOnceListener('checkPrescriptionMedicationRequest', function () {
							if (!validator.isEmpty(prescriptionMedicationRequest)) {
								checkUniqeValue(apikey, "MEDICATION_REQUEST_ID|" + prescriptionMedicationRequest, 'MEDICATION_REQUEST', function (resPrescriptionMedicationRequest) {
									if (resPrescriptionMedicationRequest.err_code > 0) {
										myEmitter.emit('checkClaimResponse');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Prescription medication request id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimResponse');
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

						if (!validator.isEmpty(accidentLocationReference)) {
							checkUniqeValue(apikey, "LOCATION_ID|" + accidentLocationReference, 'LOCATION', function (resAccidentLocationReference) {
								if (resAccidentLocationReference.err_code > 0) {
									myEmitter.emit('checkPayeePartyRelatedPerson');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Accident location reference id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkPayeePartyRelatedPerson');
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
      var explanationOfBenefitId = req.params.explanation_of_benefit_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof explanationOfBenefitId !== 'undefined') {
        if (validator.isEmpty(explanationOfBenefitId)) {
          err_code = 2;
          err_msg = "Explanation Of Benefit id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Explanation Of Benefit id is required";
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
            myEmitter.once('checkExplanationOfBenefitId', function () {
              checkUniqeValue(apikey, "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId, 'EXPLANATION_OF_BENEFIT', function (resExplanationOfBenefitId) {
                if (resExplanationOfBenefitId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId
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
                            "err_msg": "Identifier has been update in this Explanation Of Benefit.",
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
                    "err_msg": "Explanation Of Benefit Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkExplanationOfBenefitId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkExplanationOfBenefitId');
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
      var explanationOfBenefitId = req.params.explanation_of_benefit_payment_id;
      var identifierId = req.params.identifier_id;

      var err_code = 0;
      var err_msg = "";
      var dataIdentifier = {};

      //input check
      if (typeof explanationOfBenefitId !== 'undefined') {
        if (validator.isEmpty(explanationOfBenefitId)) {
          err_code = 2;
          err_msg = "Explanation Of Benefit id is required";
        }
      } else {
        err_code = 2;
        err_msg = "Explanation Of Benefit id is required";
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
            myEmitter.once('checkExplanationOfBenefitId', function () {
              checkUniqeValue(apikey, "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId, 'EXPLANATION_OF_BENEFIT', function (resExplanationOfBenefitId) {
                if (resExplanationOfBenefitId.err_code > 0) {
                  checkUniqeValue(apikey, "IDENTIFIER_ID|" + identifierId, 'IDENTIFIER', function (resIdentifierID) {
                    if (resIdentifierID.err_code > 0) {
                      ApiFHIR.put('identifier', {
                        "apikey": apikey,
                        "_id": identifierId,
                        "dr": "explanation_of_benefit_payment_id|" + explanationOfBenefitId
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
                            "err_msg": "Identifier has been update in this Explanation Of Benefit.",
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
                    "err_msg": "Explanation Of Benefit Id not found"
                  });
                }
              })
            })
            myEmitter.prependOnceListener('checkIdentifierValue', function () {
              if (validator.isEmpty(identifierValue)) {
                myEmitter.emit('checkExplanationOfBenefitId');
              } else {
                checkUniqeValue(apikey, "IDENTIFIER_VALUE|" + identifierValue, 'IDENTIFIER', function (resIdentifierValue) {
                  if (resIdentifierValue.err_code == 0) {
                    myEmitter.emit('checkExplanationOfBenefitId');
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
		explanationOfBenefitRelated: function updateExplanationOfBenefitRelated(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitId = req.params.explanation_of_benefit_id;
			var explanationOfBenefitRelatedId = req.params.explanation_of_benefit_related_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit id is required";
			}

			if(typeof explanationOfBenefitRelatedId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitRelatedId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Related id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Related id is required";
			}
			
			if(typeof req.body.claim !== 'undefined' && req.body.claim !== ""){
				var relatedClaim =  req.body.claim.trim().toLowerCase();
				if(validator.isEmpty(relatedClaim)){
					dataExplanationOfBenefit.claim = "";
				}else{
					dataExplanationOfBenefit.claim = relatedClaim;
				}
			}else{
			  relatedClaim = "";
			}

			if(typeof req.body.relationship !== 'undefined' && req.body.relationship !== ""){
				var relatedRelationship =  req.body.relationship.trim().toLowerCase();
				if(validator.isEmpty(relatedRelationship)){
					dataExplanationOfBenefit.relationship = "";
				}else{
					dataExplanationOfBenefit.relationship = relatedRelationship;
				}
			}else{
			  relatedRelationship = "";
			}

			if(typeof req.body.reference !== 'undefined' && req.body.reference !== ""){
				var relatedReference =  req.body.reference.trim().toLowerCase();
				if(validator.isEmpty(relatedReference)){
					dataExplanationOfBenefit.reference = "";
				}else{
					dataExplanationOfBenefit.reference = relatedReference;
				}
			}else{
			  relatedReference = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId, 'EXPLANATION_OF_BENEFIT', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "RELATED_ID|" + explanationOfBenefitRelatedId, 'EXPLANATION_OF_BENEFIT_RELATED', function(resExplanationOfBenefitRelatedID){
										if(resExplanationOfBenefitRelatedID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitRelated', {"apikey": apikey, "_id": explanationOfBenefitRelatedId, "dr": "EXPLANATION_OF_BENEFIT_ID|"+explanationOfBenefitId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitRelated = body;
												if(explanationOfBenefitRelated.err_code > 0){
													res.json(explanationOfBenefitRelated);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit related has been update in this Explanation Of Benefit.", "data": explanationOfBenefitRelated.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit related Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Id not found"});		
								}
							})
						})
						
						/*check code dan value*/
						myEmitter.prependOnceListener('checkRelatedRelationship', function () {
							if (!validator.isEmpty(relatedRelationship)) {
								checkCode(apikey, relatedRelationship, 'RELATED_CLAIM_RELATIONSHIP', function (resRelatedRelationshipCode) {
									if (resRelatedRelationshipCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Related relationship code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
							}
						})
						
						myEmitter.prependOnceListener('checkRelatedClaim', function () {
							if (!validator.isEmpty(relatedClaim)) {
								checkUniqeValue(apikey, "CLAIM_ID|" + relatedClaim, 'CLAIM', function (resRelatedClaim) {
									if (resRelatedClaim.err_code > 0) {
										myEmitter.emit('checkClaimResponse');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Related claim id not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkClaimResponse');
							}
						})

						if (!validator.isEmpty(relatedReference)) {
							checkUniqeValue(apikey, "IDENTIFIER_ID|" + relatedReference, '', function (resRelatedReference) {
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
		explanationOfBenefitInformation: function updateExplanationOfBenefitInformation(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitId = req.params.explanation_of_benefit_id;
			var explanationOfBenefitInformationId = req.params.explanation_of_benefit_information_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit id is required";
			}

			if(typeof explanationOfBenefitInformationId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitInformationId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Information id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Information id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var informationSequence =  req.body.sequence.trim();
				if(validator.isEmpty(informationSequence)){
					err_code = 2;
					err_msg = "explanation of benefit information sequence is required.";
				}else{
					if(!validator.isInt(informationSequence)){
						err_code = 2;
						err_msg = "explanation of benefit information sequence is must be number.";
					}else{
						dataExplanationOfBenefit.sequence = informationSequence;
					}
				}
			}else{
			  informationSequence = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var informationCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(informationCategory)){
					err_code = 2;
					err_msg = "explanation of benefit information category is required.";
				}else{
					dataExplanationOfBenefit.category = informationCategory;
				}
			}else{
			  informationCategory = "";
			}

			if(typeof req.body.code !== 'undefined' && req.body.code !== ""){
				var informationCode =  req.body.code.trim().toLowerCase();
				if(validator.isEmpty(informationCode)){
					dataExplanationOfBenefit.code = "";
				}else{
					dataExplanationOfBenefit.code = informationCode;
				}
			}else{
			  informationCode = "";
			}

			if(typeof req.body.timing.timingDate !== 'undefined' && req.body.timing.timingDate !== ""){
				var informationTimingTimingDate =  req.body.timing.timingDate;
				if(validator.isEmpty(informationTimingTimingDate)){
					err_code = 2;
					err_msg = "explanation of benefit information timing timing date is required.";
				}else{
					if(!regex.test(informationTimingTimingDate)){
						err_code = 2;
						err_msg = "explanation of benefit information timing timing date invalid date format.";	
					}else{
						dataExplanationOfBenefit.timing_date = informationTimingTimingDate;
					}
				}
			}else{
			  informationTimingTimingDate = "";
			}

			if (typeof req.body.timing.timingPeriod !== 'undefined' && req.body.timing.timingPeriod !== "") {
			  var informationTimingTimingPeriod = req.body.timing.timingPeriod;
			  if (informationTimingTimingPeriod.indexOf("to") > 0) {
			    arrInformationTimingTimingPeriod = informationTimingTimingPeriod.split("to");
			    dataExplanationOfBenefit.timing_period_start = arrInformationTimingTimingPeriod[0];
			    dataExplanationOfBenefit.timing_period_end = arrInformationTimingTimingPeriod[1];
			    if (!regex.test(informationTimingTimingPeriodStart) && !regex.test(informationTimingTimingPeriodEnd)) {
			      err_code = 2;
			      err_msg = "explanation of benefit information timing timing period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "explanation of benefit information timing timing period invalid date format.";
				}
			} else {
			  informationTimingTimingPeriod = "";
			}

			if(typeof req.body.value.valueString !== 'undefined' && req.body.value.valueString !== ""){
				var informationValueString =  req.body.value.valueString.trim().toLowerCase();
				if(validator.isEmpty(informationValueString)){
					dataExplanationOfBenefit.value_string = "";
				}else{
					dataExplanationOfBenefit.value_string = informationValueString;
				}
			}else{
			  informationValueString = "";
			}

			if(typeof req.body.value.valueQuantity !== 'undefined' && req.body.value.valueQuantity !== ""){
				var informationValueQuantity =  req.body.value.valueQuantity.trim().toLowerCase();
				if(validator.isEmpty(informationValueQuantity)){
					dataExplanationOfBenefit.value_quantity = "";
				}else{
					dataExplanationOfBenefit.value_quantity = informationValueQuantity;
				}
			}else{
			  informationValueQuantity = "";
			}

			/*if(typeof req.body.value.valueAttachment.contentType !== 'undefined' && req.body.value.valueAttachment.contentType !== ""){
				var informationValueAttachmentContentType =  req.body.value.valueAttachment.contentType.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentContentType)){
					dataExplanationOfBenefit.content_type = "";
				}else{
					dataExplanationOfBenefit.content_type = informationValueAttachmentContentType;
				}
			}else{
			  informationValueAttachmentContentType = "";
			}

			if(typeof req.body.value.valueAttachment.language !== 'undefined' && req.body.value.valueAttachment.language !== ""){
				var informationValueAttachmentLanguage =  req.body.value.valueAttachment.language.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentLanguage)){
					dataExplanationOfBenefit.language = "";
				}else{
					dataExplanationOfBenefit.language = informationValueAttachmentLanguage;
				}
			}else{
			  informationValueAttachmentLanguage = "";
			}

			if(typeof req.body.value.valueAttachment.data !== 'undefined' && req.body.value.valueAttachment.data !== ""){
				var informationValueAttachmentData =  req.body.value.valueAttachment.data.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentData)){
					dataExplanationOfBenefit.data = "";
				}else{
					dataExplanationOfBenefit.data = informationValueAttachmentData;
				}
			}else{
			  informationValueAttachmentData = "";
			}

			if(typeof req.body.value.valueAttachment.size !== 'undefined' && req.body.value.valueAttachment.size !== ""){
				var informationValueAttachmentSize =  req.body.value.valueAttachment.size.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentSize)){
					dataExplanationOfBenefit.size = "";
				}else{
					dataExplanationOfBenefit.size = informationValueAttachmentSize;
				}
			}else{
			  informationValueAttachmentSize = "";
			}

			if(typeof req.body.value.valueAttachment.title !== 'undefined' && req.body.value.valueAttachment.title !== ""){
				var informationValueAttachmentTitle =  req.body.value.valueAttachment.title.trim().toLowerCase();
				if(validator.isEmpty(informationValueAttachmentTitle)){
					dataExplanationOfBenefit.title = "";
				}else{
					dataExplanationOfBenefit.title = informationValueAttachmentTitle;
				}
			}else{
			  informationValueAttachmentTitle = "";
			}*/

			if(typeof req.body.value.valueReference !== 'undefined' && req.body.value.valueReference !== ""){
				var informationValueReference =  req.body.value.valueReference.trim().toLowerCase();
				if(validator.isEmpty(informationValueReference)){
					dataExplanationOfBenefit.value_reference = "";
				}else{
					dataExplanationOfBenefit.value_reference = informationValueReference;
				}
			}else{
			  informationValueReference = "";
			}

			if(typeof req.body.reason !== 'undefined' && req.body.reason !== ""){
				var informationReason =  req.body.reason.trim().toLowerCase();
				if(validator.isEmpty(informationReason)){
					dataExplanationOfBenefit.reason = "";
				}else{
					dataExplanationOfBenefit.reason = informationReason;
				}
			}else{
			  informationReason = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId, 'EXPLANATION_OF_BENEFIT', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "INFORMATION_ID|" + explanationOfBenefitInformationId, 'EXPLANATION_OF_BENEFIT_INFORMATION', function(resExplanationOfBenefitInformationID){
										if(resExplanationOfBenefitInformationID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitInformation', {"apikey": apikey, "_id": explanationOfBenefitInformationId, "dr": "EXPLANATION_OF_BENEFIT_ID|"+explanationOfBenefitId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitInformation = body;
												if(explanationOfBenefitInformation.err_code > 0){
													res.json(explanationOfBenefitInformation);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit information has been update in this Explanation Of Benefit.", "data": explanationOfBenefitInformation.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit information Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Id not found"});		
								}
							})
						})
						
						/*check code dan value*/
						myEmitter.prependOnceListener('checkInformationCategory', function () {
							if (!validator.isEmpty(informationCategory)) {
								checkCode(apikey, informationCategory, 'CLAIM_INFORMATIONCATEGORY', function (resInformationCategoryCode) {
									if (resInformationCategoryCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Information category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
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

						/*myEmitter.prependOnceListener('checkInformationValueAttachmentLanguage', function () {
							if (!validator.isEmpty(informationValueAttachmentLanguage)) {
								checkCode(apikey, informationValueAttachmentLanguage, 'LANGUAGE', function (resInformationValueAttachmentLanguageCode) {
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
						})*/

						if (!validator.isEmpty(informationReason)) {
							checkCode(apikey, informationReason, 'MISSING_TOOTH_REASON', function (resInformationReasonCode) {
								if (resInformationReasonCode.err_code > 0) {
									myEmitter.emit('checkInformationCode');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Information reason code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkInformationCode');
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
		/*attacjment infomation*/
		explanationOfBenefitCareTeam: function updateExplanationOfBenefitCareTeam(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitId = req.params.explanation_of_benefit_id;
			var explanationOfBenefitCareTeamId = req.params.explanation_of_benefit_care_team_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit id is required";
			}

			if(typeof explanationOfBenefitCareTeamId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitCareTeamId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Care Team id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Care Team id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var careTeamSequence =  req.body.sequence.trim();
				if(validator.isEmpty(careTeamSequence)){
					err_code = 2;
					err_msg = "explanation of benefit care team sequence is required.";
				}else{
					if(!validator.isInt(careTeamSequence)){
						err_code = 2;
						err_msg = "explanation of benefit care team sequence is must be number.";
					}else{
						dataExplanationOfBenefit.sequence = careTeamSequence;
					}
				}
			}else{
			  careTeamSequence = "";
			}

			if(typeof req.body.provider.practitioner !== 'undefined' && req.body.provider.practitioner !== ""){
				var careTeamProviderPractitioner =  req.body.provider.practitioner.trim().toLowerCase();
				if(validator.isEmpty(careTeamProviderPractitioner)){
					dataExplanationOfBenefit.provider_practitioner = "";
				}else{
					dataExplanationOfBenefit.provider_practitioner = careTeamProviderPractitioner;
				}
			}else{
			  careTeamProviderPractitioner = "";
			}

			if(typeof req.body.provider.organization !== 'undefined' && req.body.provider.organization !== ""){
				var careTeamProviderOrganization =  req.body.provider.organization.trim().toLowerCase();
				if(validator.isEmpty(careTeamProviderOrganization)){
					dataExplanationOfBenefit.provider_organization = "";
				}else{
					dataExplanationOfBenefit.provider_organization = careTeamProviderOrganization;
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
					dataExplanationOfBenefit.responsible = careTeamResponsible;
			  } else {
			    err_code = 2;
			    err_msg = "Explanation of benefit care team responsible is must be boolean.";
			  }
			} else {
			  careTeamResponsible = "";
			}

			if(typeof req.body.role !== 'undefined' && req.body.role !== ""){
				var careTeamRole =  req.body.role.trim().toLowerCase();
				if(validator.isEmpty(careTeamRole)){
					dataExplanationOfBenefit.role = "";
				}else{
					dataExplanationOfBenefit.role = careTeamRole;
				}
			}else{
			  careTeamRole = "";
			}

			if(typeof req.body.qualification !== 'undefined' && req.body.qualification !== ""){
				var careTeamQualification =  req.body.qualification.trim().toLowerCase();
				if(validator.isEmpty(careTeamQualification)){
					dataExplanationOfBenefit.qualification = "";
				}else{
					dataExplanationOfBenefit.qualification = careTeamQualification;
				}
			}else{
			  careTeamQualification = "";
			}

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId, 'EXPLANATION_OF_BENEFIT', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "CARE_TEAM_ID|" + explanationOfBenefitCareTeamId, 'EXPLANATION_OF_BENEFIT_CARE_TEAM', function(resExplanationOfBenefitCareTeamID){
										if(resExplanationOfBenefitCareTeamID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitCareTeam', {"apikey": apikey, "_id": explanationOfBenefitCareTeamId, "dr": "EXPLANATION_OF_BENEFIT_ID|"+explanationOfBenefitId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitCareTeam = body;
												if(explanationOfBenefitCareTeam.err_code > 0){
													res.json(explanationOfBenefitCareTeam);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit Care Team has been update in this Explanation Of Benefit.", "data": explanationOfBenefitCareTeam.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit Care Team Id not found"});		
										} 
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Id not found"});		
								}
							})
						})
						
						/*check code dan value*/
						myEmitter.prependOnceListener('checkCareTeamRole', function () {
							if (!validator.isEmpty(careTeamRole)) {
								checkCode(apikey, careTeamRole, 'CLAIM_CARETEAMROLE', function (resCareTeamRoleCode) {
									if (resCareTeamRoleCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Care team role code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
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
		explanationOfBenefitDiagnosis: function updateExplanationOfBenefitDiagnosis(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitId = req.params.explanation_of_benefit_id;
			var explanationOfBenefitDiagnosisId = req.params.explanation_of_benefit_diagnosis_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit id is required";
			}

			if(typeof explanationOfBenefitDiagnosisId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitDiagnosisId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Diagnosis id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Diagnosis id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var diagnosisSequence =  req.body.sequence.trim();
				if(validator.isEmpty(diagnosisSequence)){
					err_code = 2;
					err_msg = "explanation of benefit diagnosis sequence is required.";
				}else{
					if(!validator.isInt(diagnosisSequence)){
						err_code = 2;
						err_msg = "explanation of benefit diagnosis sequence is must be number.";
					}else{
						dataExplanationOfBenefit.sequence = diagnosisSequence;
					}
				}
			}else{
			  diagnosisSequence = "";
			}

			if(typeof req.body.diagnosis.diagnosisCodeableConcept !== 'undefined' && req.body.diagnosis.diagnosisCodeableConcept !== ""){
				var diagnosisCodeableConcept =  req.body.diagnosis.diagnosisCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(diagnosisCodeableConcept)){
					err_code = 2;
					err_msg = "explanation of benefit diagnosis diagnosis diagnosis codeable concept is required.";
				}else{
					dataExplanationOfBenefit.diagnosis_codeable_concept = diagnosisCodeableConcept;
				}
			}else{
			  diagnosisCodeableConcept = "";
			}

			if(typeof req.body.diagnosis.diagnosisReference !== 'undefined' && req.body.diagnosis.diagnosisReference !== ""){
				var diagnosisReference =  req.body.diagnosis.diagnosisReference.trim().toLowerCase();
				if(validator.isEmpty(diagnosisReference)){
					dataExplanationOfBenefit.diagnosis_reference = "";
				}else{
					dataExplanationOfBenefit.diagnosis_reference = diagnosisReference;
				}
			}else{
			  diagnosisReference = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var diagnosisType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(diagnosisType)){
					dataExplanationOfBenefit.type = "";
				}else{
					dataExplanationOfBenefit.type = diagnosisType;
				}
			}else{
			  diagnosisType = "";
			}

			if(typeof req.body.packageCode !== 'undefined' && req.body.packageCode !== ""){
				var diagnosisPackageCode =  req.body.packageCode.trim().toLowerCase();
				if(validator.isEmpty(diagnosisPackageCode)){
					dataExplanationOfBenefit.package_code = "";
				}else{
					dataExplanationOfBenefit.package_code = diagnosisPackageCode;
				}
			}else{
			  diagnosisPackageCode = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId, 'EXPLANATION_OF_BENEFIT', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "DIAGNOSIS_ID|" + explanationOfBenefitDiagnosisId, 'EXPLANATION_OF_BENEFIT_DIAGNOSIS', function(resExplanationOfBenefitDiagnosisID){
										if(resExplanationOfBenefitDiagnosisID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitDiagnosis', {"apikey": apikey, "_id": explanationOfBenefitDiagnosisId, "dr": "EXPLANATION_OF_BENEFIT_ID|"+explanationOfBenefitId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitDiagnosis = body;
												if(explanationOfBenefitDiagnosis.err_code > 0){
													res.json(explanationOfBenefitDiagnosis);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit diagnosis has been update in this Explanation Of Benefit.", "data": explanationOfBenefitDiagnosis.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit diagnosis Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Id not found"});		
								}
							})
						})
						
						/*check code dan value*/
						myEmitter.prependOnceListener('checkDiagnosisCodeableConcept', function () {
							if (!validator.isEmpty(diagnosisCodeableConcept)) {
								checkCode(apikey, diagnosisCodeableConcept, 'ICD_10', function (resDiagnosisCodeableConceptCode) {
									if (resDiagnosisCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Diagnosis codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
							}
						})

						myEmitter.prependOnceListener('checkDiagnosisType', function () {
							if (!validator.isEmpty(diagnosisType)) {
								checkCode(apikey, diagnosisType, 'EX_DIAGNOSISTYPE', function (resDiagnosisTypeCode) {
									if (resDiagnosisTypeCode.err_code > 0) {
										myEmitter.emit('checkDiagnosisCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Diagnosis type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkDiagnosisCodeableConcept');
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
						
						if (!validator.isEmpty(diagnosisReference)) {
							checkUniqeValue(apikey, "CONDITION_ID|" + diagnosisReference, 'CONDITION', function (resDiagnosisReference) {
								if (resDiagnosisReference.err_code > 0) {
									myEmitter.emit('checkDiagnosisPackageCode');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Diagnosis reference id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkDiagnosisPackageCode');
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
		explanationOfBenefitProcedure: function updateExplanationOfBenefitProcedure(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitId = req.params.explanation_of_benefit_id;
			var explanationOfBenefitProcedureId = req.params.explanation_of_benefit_diagnosis_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit id is required";
			}

			if(typeof explanationOfBenefitProcedureId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitProcedureId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Procedure id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Procedure id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var procedureSequence =  req.body.sequence.trim();
				if(validator.isEmpty(procedureSequence)){
					err_code = 2;
					err_msg = "explanation of benefit procedure sequence is required.";
				}else{
					if(!validator.isInt(procedureSequence)){
						err_code = 2;
						err_msg = "explanation of benefit procedure sequence is must be number.";
					}else{
						dataExplanationOfBenefit.sequence = procedureSequence;
					}
				}
			}else{
			  procedureSequence = "";
			}

			if(typeof req.body.date !== 'undefined' && req.body.date !== ""){
				var procedureDate =  req.body.date;
				if(validator.isEmpty(procedureDate)){
					err_code = 2;
					err_msg = "explanation of benefit procedure date is required.";
				}else{
					if(!regex.test(procedureDate)){
						err_code = 2;
						err_msg = "explanation of benefit procedure date invalid date format.";	
					}else{
						dataExplanationOfBenefit.date = procedureDate;
					}
				}
			}else{
			  procedureDate = "";
			}

			if(typeof req.body.procedure.procedureCodeableConcept !== 'undefined' && req.body.procedure.procedureCodeableConcept !== ""){
				var procedureCodeableConcept =  req.body.procedure.procedureCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(procedureCodeableConcept)){
					err_code = 2;
					err_msg = "explanation of benefit procedure procedure procedure codeable concept is required.";
				}else{
					dataExplanationOfBenefit.procedure_codeable_concept = procedureCodeableConcept;
				}
			}else{
			  procedureCodeableConcept = "";
			}

			if(typeof req.body.procedure.procedureReference !== 'undefined' && req.body.procedure.procedureReference !== ""){
				var procedureReference =  req.body.procedure.procedureReference.trim().toLowerCase();
				if(validator.isEmpty(procedureReference)){
					dataExplanationOfBenefit.procedure_reference = "";
				}else{
					dataExplanationOfBenefit.procedure_reference = procedureReference;
				}
			}else{
			  procedureReference = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId, 'EXPLANATION_OF_BENEFIT', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "PROCEDURE_ID|" + explanationOfBenefitProcedureId, 'EXPLANATION_OF_BENEFIT_PROCEDURE', function(resExplanationOfBenefitProcedureID){
										if(resExplanationOfBenefitProcedureID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitProcedure', {"apikey": apikey, "_id": explanationOfBenefitProcedureId, "dr": "EXPLANATION_OF_BENEFIT_ID|"+explanationOfBenefitId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitProcedure = body;
												if(explanationOfBenefitProcedure.err_code > 0){
													res.json(explanationOfBenefitProcedure);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit diagnosis has been update in this Explanation Of Benefit.", "data": explanationOfBenefitProcedure.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit diagnosis Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Id not found"});		
								}
							})
						})
						
						/*check code dan value*/
						myEmitter.prependOnceListener('checkProcedureCodeableConcept', function () {
							if (!validator.isEmpty(procedureCodeableConcept)) {
								checkCode(apikey, procedureCodeableConcept, 'ICD_10_PROCEDURES', function (resProcedureCodeableConceptCode) {
									if (resProcedureCodeableConceptCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Procedure codeable concept code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
							}
						})
						
						if (!validator.isEmpty(procedureReference)) {
							checkUniqeValue(apikey, "PROCEDURE_ID|" + procedureReference, 'PROCEDURE', function (resProcedureReference) {
								if (resProcedureReference.err_code > 0) {
									myEmitter.emit('checkProcedureCodeableConcept');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Procedure reference id not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkProcedureCodeableConcept');
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
		explanationOfBenefitItem: function updateExplanationOfBenefitItem(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitId = req.params.explanation_of_benefit_id;
			var explanationOfBenefitItemId = req.params.explanation_of_benefit_item_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit id is required";
			}

			if(typeof explanationOfBenefitItemId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitItemId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Item id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Item id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var itemSequence =  req.body.sequence.trim();
				if(validator.isEmpty(itemSequence)){
					err_code = 2;
					err_msg = "explanation of benefit item sequence is required.";
				}else{
					if(!validator.isInt(itemSequence)){
						err_code = 2;
						err_msg = "explanation of benefit item sequence is must be number.";
					}else{
						dataExplanationOfBenefit.sequence = itemSequence;
					}
				}
			}else{
			  itemSequence = "";
			}

			if(typeof req.body.careTeamLinkId !== 'undefined' && req.body.careTeamLinkId !== ""){
				var itemCareTeamLinkId =  req.body.careTeamLinkId.trim();
				if(validator.isEmpty(itemCareTeamLinkId)){
					dataExplanationOfBenefit.care_team_link_id = "";
				}else{
					if(!validator.isInt(itemCareTeamLinkId)){
						err_code = 2;
						err_msg = "explanation of benefit item care team link id is must be number.";
					}else{
						dataExplanationOfBenefit.care_team_link_id = itemCareTeamLinkId;
					}
				}
			}else{
			  itemCareTeamLinkId = "";
			}

			if(typeof req.body.diagnosisLinkId !== 'undefined' && req.body.diagnosisLinkId !== ""){
				var itemDiagnosisLinkId =  req.body.diagnosisLinkId.trim();
				if(validator.isEmpty(itemDiagnosisLinkId)){
					dataExplanationOfBenefit.diagnosis_link_id = "";
				}else{
					if(!validator.isInt(itemDiagnosisLinkId)){
						err_code = 2;
						err_msg = "explanation of benefit item diagnosis link id is must be number.";
					}else{
						dataExplanationOfBenefit.diagnosis_link_id = itemDiagnosisLinkId;
					}
				}
			}else{
			  itemDiagnosisLinkId = "";
			}

			if(typeof req.body.procedureLinkId !== 'undefined' && req.body.procedureLinkId !== ""){
				var itemProcedureLinkId =  req.body.procedureLinkId.trim();
				if(validator.isEmpty(itemProcedureLinkId)){
					dataExplanationOfBenefit.procedure_link_id = "";
				}else{
					if(!validator.isInt(itemProcedureLinkId)){
						err_code = 2;
						err_msg = "explanation of benefit item procedure link id is must be number.";
					}else{
						dataExplanationOfBenefit.procedure_link_id = itemProcedureLinkId;
					}
				}
			}else{
			  itemProcedureLinkId = "";
			}

			if(typeof req.body.informationLinkId !== 'undefined' && req.body.informationLinkId !== ""){
				var itemInformationLinkId =  req.body.informationLinkId.trim();
				if(validator.isEmpty(itemInformationLinkId)){
					dataExplanationOfBenefit.information_link_id = "";
				}else{
					if(!validator.isInt(itemInformationLinkId)){
						err_code = 2;
						err_msg = "explanation of benefit item information link id is must be number.";
					}else{
						dataExplanationOfBenefit.information_link_id = itemInformationLinkId;
					}
				}
			}else{
			  itemInformationLinkId = "";
			}

			if(typeof req.body.revenue !== 'undefined' && req.body.revenue !== ""){
				var itemRevenue =  req.body.revenue.trim().toLowerCase();
				if(validator.isEmpty(itemRevenue)){
					dataExplanationOfBenefit.revenue = "";
				}else{
					dataExplanationOfBenefit.revenue = itemRevenue;
				}
			}else{
			  itemRevenue = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var itemCategory =  req.body.category.trim().toUpperCase();
				if(validator.isEmpty(itemCategory)){
					dataExplanationOfBenefit.category = "";
				}else{
					dataExplanationOfBenefit.category = itemCategory;
				}
			}else{
			  itemCategory = "";
			}

			if(typeof req.body.service !== 'undefined' && req.body.service !== ""){
				var itemService =  req.body.service.trim().toLowerCase();
				if(validator.isEmpty(itemService)){
					dataExplanationOfBenefit.service = "";
				}else{
					dataExplanationOfBenefit.service = itemService;
				}
			}else{
			  itemService = "";
			}

			if(typeof req.body.modifier !== 'undefined' && req.body.modifier !== ""){
				var itemModifier =  req.body.modifier.trim().toLowerCase();
				if(validator.isEmpty(itemModifier)){
					dataExplanationOfBenefit.modifier = "";
				}else{
					dataExplanationOfBenefit.modifier = itemModifier;
				}
			}else{
			  itemModifier = "";
			}

			if(typeof req.body.programCode !== 'undefined' && req.body.programCode !== ""){
				var itemProgramCode =  req.body.programCode.trim().toLowerCase();
				if(validator.isEmpty(itemProgramCode)){
					dataExplanationOfBenefit.program_code = "";
				}else{
					dataExplanationOfBenefit.program_code = itemProgramCode;
				}
			}else{
			  itemProgramCode = "";
			}

			if(typeof req.body.serviced.servicedDate !== 'undefined' && req.body.serviced.servicedDate !== ""){
				var itemServicedDate =  req.body.serviced.servicedDate;
				if(validator.isEmpty(itemServicedDate)){
					err_code = 2;
					err_msg = "explanation of benefit item serviced serviced date is required.";
				}else{
					if(!regex.test(itemServicedDate)){
						err_code = 2;
						err_msg = "explanation of benefit item serviced serviced date invalid date format.";	
					}else{
						dataExplanationOfBenefit.serviced_date = itemServicedDate;
					}
				}
			}else{
			  itemServicedDate = "";
			}

			if (typeof req.body.serviced.servicedPeriod !== 'undefined' && req.body.serviced.servicedPeriod !== "") {
			  var itemServicedPeriod = req.body.serviced.servicedPeriod;
			  if (itemServicedPeriod.indexOf("to") > 0) {
			    arrItemServicedPeriod = itemServicedPeriod.split("to");
			    dataExplanationOfBenefit.serviced_period_start = arrItemServicedPeriod[0];
			    dataExplanationOfBenefit.serviced_period_end = arrItemServicedPeriod[1];
			    if (!regex.test(itemServicedPeriodStart) && !regex.test(itemServicedPeriodEnd)) {
			      err_code = 2;
			      err_msg = "explanation of benefit item serviced serviced period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "explanation of benefit item serviced serviced period invalid date format.";
				}
			} else {
			  itemServicedPeriod = "";
			}

			if(typeof req.body.location.locationCodeableConcept !== 'undefined' && req.body.location.locationCodeableConcept !== ""){
				var itemLocationCodeableConcept =  req.body.location.locationCodeableConcept.trim().toLowerCase();
				if(validator.isEmpty(itemLocationCodeableConcept)){
					dataExplanationOfBenefit.location_codeable_concept = "";
				}else{
					dataExplanationOfBenefit.location_codeable_concept = itemLocationCodeableConcept;
				}
			}else{
			  itemLocationCodeableConcept = "";
			}

			if(typeof req.body.location.locationAddress.use !== 'undefined' && req.body.location.locationAddress.use !== ""){
				var itemLocationAddressUse =  req.body.location.locationAddress.use.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressUse)){
					dataExplanationOfBenefit.location_address_use = "";
				}else{
					dataExplanationOfBenefit.location_address_use = itemLocationAddressUse;
				}
			}else{
			  itemLocationAddressUse = "";
			}

			if(typeof req.body.location.locationAddress.type !== 'undefined' && req.body.location.locationAddress.type !== ""){
				var itemLocationAddressType =  req.body.location.locationAddress.type.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressType)){
					dataExplanationOfBenefit.location_address_type = "";
				}else{
					dataExplanationOfBenefit.location_address_type = itemLocationAddressType;
				}
			}else{
			  itemLocationAddressType = "";
			}

			if(typeof req.body.location.locationAddress.text !== 'undefined' && req.body.location.locationAddress.text !== ""){
				var itemLocationAddressText =  req.body.location.locationAddress.text.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressText)){
					dataExplanationOfBenefit.location_address_text = "";
				}else{
					dataExplanationOfBenefit.location_address_text = itemLocationAddressText;
				}
			}else{
			  itemLocationAddressText = "";
			}

			if(typeof req.body.location.locationAddress.line !== 'undefined' && req.body.location.locationAddress.line !== ""){
				var itemLocationAddressLine =  req.body.location.locationAddress.line.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressLine)){
					dataExplanationOfBenefit.location_address_line = "";
				}else{
					dataExplanationOfBenefit.location_address_line = itemLocationAddressLine;
				}
			}else{
			  itemLocationAddressLine = "";
			}

			if(typeof req.body.location.locationAddress.city !== 'undefined' && req.body.location.locationAddress.city !== ""){
				var itemLocationAddressCity =  req.body.location.locationAddress.city.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressCity)){
					dataExplanationOfBenefit.location_address_city = "";
				}else{
					dataExplanationOfBenefit.location_address_city = itemLocationAddressCity;
				}
			}else{
			  itemLocationAddressCity = "";
			}

			if(typeof req.body.location.locationAddress.district !== 'undefined' && req.body.location.locationAddress.district !== ""){
				var itemLocationAddressDistrict =  req.body.location.locationAddress.district.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressDistrict)){
					dataExplanationOfBenefit.location_address_district = "";
				}else{
					dataExplanationOfBenefit.location_address_district = itemLocationAddressDistrict;
				}
			}else{
			  itemLocationAddressDistrict = "";
			}

			if(typeof req.body.location.locationAddress.state !== 'undefined' && req.body.location.locationAddress.state !== ""){
				var itemLocationAddressState =  req.body.location.locationAddress.state.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressState)){
					dataExplanationOfBenefit.location_address_state = "";
				}else{
					dataExplanationOfBenefit.location_address_state = itemLocationAddressState;
				}
			}else{
			  itemLocationAddressState = "";
			}

			if(typeof req.body.location.locationAddress.postalCode !== 'undefined' && req.body.location.locationAddress.postalCode !== ""){
				var itemLocationAddressPostalCode =  req.body.location.locationAddress.postalCode.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressPostalCode)){
					dataExplanationOfBenefit.location_address_postal_code = "";
				}else{
					dataExplanationOfBenefit.location_address_postal_code = itemLocationAddressPostalCode;
				}
			}else{
			  itemLocationAddressPostalCode = "";
			}

			if(typeof req.body.location.locationAddress.country !== 'undefined' && req.body.location.locationAddress.country !== ""){
				var itemLocationAddressCountry =  req.body.location.locationAddress.country.trim().toLowerCase();
				if(validator.isEmpty(itemLocationAddressCountry)){
					dataExplanationOfBenefit.location_address_country = "";
				}else{
					dataExplanationOfBenefit.location_address_country = itemLocationAddressCountry;
				}
			}else{
			  itemLocationAddressCountry = "";
			}

			if (typeof req.body.location.locationAddress.period !== 'undefined' && req.body.location.locationAddress.period !== "") {
			  var itemLocationAddressPeriod = req.body.location.locationAddress.period;
			  if (itemLocationAddressPeriod.indexOf("to") > 0) {
			    arrItemLocationAddressPeriod = itemLocationAddressPeriod.split("to");
			    dataExplanationOfBenefit.location_address_period_start = arrItemLocationAddressPeriod[0];
			    dataExplanationOfBenefit.location_address_period_end = arrItemLocationAddressPeriod[1];
			    if (!regex.test(itemLocationAddressPeriodStart) && !regex.test(itemLocationAddressPeriodEnd)) {
			      err_code = 2;
			      err_msg = "explanation of benefit item location location address period invalid date format.";
			    }
				} else {
			  	err_code = 2;
			  	err_msg = "explanation of benefit item location location address period invalid date format.";
				}
			} else {
			  itemLocationAddressPeriod = "";
			}

			if(typeof req.body.location.locationReference !== 'undefined' && req.body.location.locationReference !== ""){
				var itemLocationReference =  req.body.location.locationReference.trim().toLowerCase();
				if(validator.isEmpty(itemLocationReference)){
					dataExplanationOfBenefit.location_reference = "";
				}else{
					dataExplanationOfBenefit.location_reference = itemLocationReference;
				}
			}else{
			  itemLocationReference = "";
			}

			if(typeof req.body.quantity !== 'undefined' && req.body.quantity !== ""){
				var itemQuantity =  req.body.quantity.trim();
				if(validator.isEmpty(itemQuantity)){
					dataExplanationOfBenefit.quantity = "";
				}else{
					if(!validator.isInt(itemQuantity)){
						err_code = 2;
						err_msg = "explanation of benefit item quantity is must be number.";
					}else{
						dataExplanationOfBenefit.quantity = itemQuantity;
					}
				}
			}else{
			  itemQuantity = "";
			}

			if(typeof req.body.unitPrice !== 'undefined' && req.body.unitPrice !== ""){
				var itemUnitPrice =  req.body.unitPrice.trim().toLowerCase();
				if(validator.isEmpty(itemUnitPrice)){
					dataExplanationOfBenefit.unit_price = "";
				}else{
					dataExplanationOfBenefit.unit_price = itemUnitPrice;
				}
			}else{
			  itemUnitPrice = "";
			}

			if(typeof req.body.factor !== 'undefined' && req.body.factor !== ""){
				var itemFactor =  req.body.factor.trim();
				if(validator.isEmpty(itemFactor)){
					dataExplanationOfBenefit.factor = "";
				}else{
					if(!validator.isInt(itemFactor)){
						err_code = 2;
						err_msg = "explanation of benefit item factor is must be number.";
					}else{
						dataExplanationOfBenefit.factor = itemFactor;
					}
				}
			}else{
			  itemFactor = "";
			}

			if(typeof req.body.net !== 'undefined' && req.body.net !== ""){
				var itemNet =  req.body.net.trim();
				if(validator.isEmpty(itemNet)){
					dataExplanationOfBenefit.net = "";
				}else{
					if(!validator.isInt(itemNet)){
						err_code = 2;
						err_msg = "explanation of benefit item net is must be number.";
					}else{
						dataExplanationOfBenefit.net = itemNet;
					}
				}
			}else{
			  itemNet = "";
			}

			/*if(typeof req.body.udi !== 'undefined' && req.body.udi !== ""){
				var itemUdi =  req.body.udi.trim().toLowerCase();
				if(validator.isEmpty(itemUdi)){
					dataExplanationOfBenefit.udi = "";
				}else{
					dataExplanationOfBenefit.udi = itemUdi;
				}
			}else{
			  itemUdi = "";
			}*/

			if(typeof req.body.bodySite !== 'undefined' && req.body.bodySite !== ""){
				var itemBodySite =  req.body.bodySite.trim().toLowerCase();
				if(validator.isEmpty(itemBodySite)){
					dataExplanationOfBenefit.body_site = "";
				}else{
					dataExplanationOfBenefit.body_site = itemBodySite;
				}
			}else{
			  itemBodySite = "";
			}

			if(typeof req.body.subSite !== 'undefined' && req.body.subSite !== ""){
				var itemSubSite =  req.body.subSite.trim().toUpperCase();
				if(validator.isEmpty(itemSubSite)){
					dataExplanationOfBenefit.sub_site = "";
				}else{
					dataExplanationOfBenefit.sub_site = itemSubSite;
				}
			}else{
			  itemSubSite = "";
			}

			/*if(typeof req.body.encounter !== 'undefined' && req.body.encounter !== ""){
				var itemEncounter =  req.body.encounter.trim().toLowerCase();
				if(validator.isEmpty(itemEncounter)){
					dataExplanationOfBenefit.encounter = "";
				}else{
					dataExplanationOfBenefit.encounter = itemEncounter;
				}
			}else{
			  itemEncounter = "";
			}*/

			if(typeof req.body.noteNumber !== 'undefined' && req.body.noteNumber !== ""){
				var itemNoteNumber =  req.body.noteNumber.trim();
				if(validator.isEmpty(itemNoteNumber)){
					dataExplanationOfBenefit.note_number = "";
				}else{
					if(!validator.isInt(itemNoteNumber)){
						err_code = 2;
						err_msg = "explanation of benefit item note number is must be number.";
					}else{
						dataExplanationOfBenefit.note_number = itemNoteNumber;
					}
				}
			}else{
			  itemNoteNumber = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId, 'EXPLANATION_OF_BENEFIT', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "ITEM_ID|" + explanationOfBenefitItemId, 'EXPLANATION_OF_BENEFIT_ITEM', function(resExplanationOfBenefitItemID){
										if(resExplanationOfBenefitItemID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitItem', {"apikey": apikey, "_id": explanationOfBenefitItemId, "dr": "EXPLANATION_OF_BENEFIT_ID|"+explanationOfBenefitId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitItem = body;
												if(explanationOfBenefitItem.err_code > 0){
													res.json(explanationOfBenefitItem);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit item has been update in this Explanation Of Benefit.", "data": explanationOfBenefitItem.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit item Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkItemRevenue', function () {
							if (!validator.isEmpty(itemRevenue)) {
								checkCode(apikey, itemRevenue, 'EX_REVENUE_CENTER', function (resItemRevenueCode) {
									if (resItemRevenueCode.err_code > 0) {
										myEmitter.emit('checkAccidentLocationAddressType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item revenue code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkAccidentLocationAddressType');
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

						myEmitter.prependOnceListener('checkItemLocationAddressUse', function () {
							if (!validator.isEmpty(itemLocationAddressUse)) {
								checkCode(apikey, itemLocationAddressUse, 'ADDRESS_USE', function (resItemLocationAddressUseCode) {
									if (resItemLocationAddressUseCode.err_code > 0) {
										myEmitter.emit('checkItemLocationCodeableConcept');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item location address use code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemLocationCodeableConcept');
							}
						})

						myEmitter.prependOnceListener('checkItemLocationAddressType', function () {
							if (!validator.isEmpty(itemLocationAddressType)) {
								checkCode(apikey, itemLocationAddressType, 'ADDRESS_TYPE', function (resItemLocationAddressTypeCode) {
									if (resItemLocationAddressTypeCode.err_code > 0) {
										myEmitter.emit('checkItemLocationAddressUse');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item location address type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemLocationAddressUse');
							}
						})

						myEmitter.prependOnceListener('checkItemBodySite', function () {
							if (!validator.isEmpty(itemBodySite)) {
								checkCode(apikey, itemBodySite, 'TOOTH', function (resItemBodySiteCode) {
									if (resItemBodySiteCode.err_code > 0) {
										myEmitter.emit('checkItemLocationAddressType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item body site code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemLocationAddressType');
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
		explanationOfBenefitAdjudicationItem: function updateExplanationOfBenefitAdjudicationItem(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitItemId = req.params.explanation_of_benefit_item_id;
			var explanationOfBenefitAdjudicationId = req.params.explanation_of_benefit_adjudication_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitItemId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitItemId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Item id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Item id is required";
			}

			if(typeof explanationOfBenefitAdjudicationId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitAdjudicationId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Adjudication id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Adjudication id is required";
			}
			
			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var itemAdjudicationCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(itemAdjudicationCategory)){
					err_code = 2;
					err_msg = "explanation of benefit item adjudication category is required.";
				}else{
					dataExplanationOfBenefit.category = itemAdjudicationCategory;
				}
			}else{
			  itemAdjudicationCategory = "";
			}

			if(typeof req.body.reason !== 'undefined' && req.body.reason !== ""){
				var itemAdjudicationReason =  req.body.reason.trim().toLowerCase();
				if(validator.isEmpty(itemAdjudicationReason)){
					dataExplanationOfBenefit.reason = "";
				}else{
					dataExplanationOfBenefit.reason = itemAdjudicationReason;
				}
			}else{
			  itemAdjudicationReason = "";
			}

			if(typeof req.body.amount !== 'undefined' && req.body.amount !== ""){
				var itemAdjudicationAmount =  req.body.amount.trim().toLowerCase();
				if(validator.isEmpty(itemAdjudicationAmount)){
					dataExplanationOfBenefit.amount = "";
				}else{
					dataExplanationOfBenefit.amount = itemAdjudicationAmount;
				}
			}else{
			  itemAdjudicationAmount = "";
			}

			if(typeof req.body.value !== 'undefined' && req.body.value !== ""){
				var itemAdjudicationValue =  req.body.value.trim();
				if(validator.isEmpty(itemAdjudicationValue)){
					dataExplanationOfBenefit.value = "";
				}else{
					if(!validator.isInt(itemAdjudicationValue)){
						err_code = 2;
						err_msg = "explanation of benefit item adjudication value is must be number.";
					}else{
						dataExplanationOfBenefit.value = itemAdjudicationValue;
					}
				}
			}else{
			  itemAdjudicationValue = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "ITEM_ID|" + explanationOfBenefitItemId, 'EXPLANATION_OF_BENEFIT_ITEM', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "ADJUDICATION_ID|" + explanationOfBenefitAdjudicationId, 'EXPLANATION_OF_BENEFIT_ADJUDICATION', function(resExplanationOfBenefitAdjudicationID){
										if(resExplanationOfBenefitAdjudicationID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitAdjudication', {"apikey": apikey, "_id": explanationOfBenefitAdjudicationId, "dr": "ITEM_ID|"+explanationOfBenefitItemId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitAdjudication = body;
												if(explanationOfBenefitAdjudication.err_code > 0){
													res.json(explanationOfBenefitAdjudication);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit Adjudication Item has been update in this Explanation Of Benefit.", "data": explanationOfBenefitAdjudication.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit adjudication Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Item Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkItemAdjudicationCategory', function () {
							if (!validator.isEmpty(itemAdjudicationCategory)) {
								checkCode(apikey, itemAdjudicationCategory, 'ADJUDICATION', function (resItemAdjudicationCategoryCode) {
									if (resItemAdjudicationCategoryCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item adjudication category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
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
		explanationOfBenefitItemDetail: function updateExplanationOfBenefitItemDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitItemId = req.params.explanation_of_benefit_item_id;
			var explanationOfBenefitItemDetailId = req.params.explanation_of_benefit_item_detail_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitItemId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitItemId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Item id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Item id is required";
			}
			
			if(typeof explanationOfBenefitItemDetailId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitItemDetailId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Item Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Item Detail id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var itemDetailequence =  req.body.sequence.trim();
				if(validator.isEmpty(itemDetailequence)){
					err_code = 2;
					err_msg = "explanation of benefit item detail sequence is required.";
				}else{
					if(!validator.isInt(itemDetailequence)){
						err_code = 2;
						err_msg = "explanation of benefit item detail sequence is must be number.";
					}else{
						dataExplanationOfBenefit.sequence = itemDetailequence;
					}
				}
			}else{
			  itemDetailequence = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var itemDetailType =  req.body.type.trim().toUpperCase();
				if(validator.isEmpty(itemDetailType)){
					err_code = 2;
					err_msg = "explanation of benefit item detail type is required.";
				}else{
					dataExplanationOfBenefit.type = itemDetailType;
				}
			}else{
			  itemDetailType = "";
			}

			if(typeof req.body.revenue !== 'undefined' && req.body.revenue !== ""){
				var itemDetailRevenue =  req.body.revenue.trim().toLowerCase();
				if(validator.isEmpty(itemDetailRevenue)){
					dataExplanationOfBenefit.revenue = "";
				}else{
					dataExplanationOfBenefit.revenue = itemDetailRevenue;
				}
			}else{
			  itemDetailRevenue = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var itemDetailCategory =  req.body.category.trim().toUpperCase();
				if(validator.isEmpty(itemDetailCategory)){
					dataExplanationOfBenefit.category = "";
				}else{
					dataExplanationOfBenefit.category = itemDetailCategory;
				}
			}else{
			  itemDetailCategory = "";
			}

			if(typeof req.body.service !== 'undefined' && req.body.service !== ""){
				var itemDetailService =  req.body.service.trim().toLowerCase();
				if(validator.isEmpty(itemDetailService)){
					dataExplanationOfBenefit.service = "";
				}else{
					dataExplanationOfBenefit.service = itemDetailService;
				}
			}else{
			  itemDetailService = "";
			}

			if(typeof req.body.modifier !== 'undefined' && req.body.modifier !== ""){
				var itemDetailModifier =  req.body.modifier.trim().toLowerCase();
				if(validator.isEmpty(itemDetailModifier)){
					dataExplanationOfBenefit.modifier = "";
				}else{
					dataExplanationOfBenefit.modifier = itemDetailModifier;
				}
			}else{
			  itemDetailModifier = "";
			}

			if(typeof req.body.programCode !== 'undefined' && req.body.programCode !== ""){
				var itemDetailProgramCode =  req.body.programCode.trim().toLowerCase();
				if(validator.isEmpty(itemDetailProgramCode)){
					dataExplanationOfBenefit.program_code = "";
				}else{
					dataExplanationOfBenefit.program_code = itemDetailProgramCode;
				}
			}else{
			  itemDetailProgramCode = "";
			}

			if(typeof req.body.quantity !== 'undefined' && req.body.quantity !== ""){
				var itemDetailQuantity =  req.body.quantity.trim().toLowerCase();
				if(validator.isEmpty(itemDetailQuantity)){
					dataExplanationOfBenefit.quantity = "";
				}else{
					dataExplanationOfBenefit.quantity = itemDetailQuantity;
				}
			}else{
			  itemDetailQuantity = "";
			}

			if(typeof req.body.unitPrice !== 'undefined' && req.body.unitPrice !== ""){
				var itemDetailUnitPrice =  req.body.unitPrice.trim().toLowerCase();
				if(validator.isEmpty(itemDetailUnitPrice)){
					dataExplanationOfBenefit.unit_price = "";
				}else{
					dataExplanationOfBenefit.unit_price = itemDetailUnitPrice;
				}
			}else{
			  itemDetailUnitPrice = "";
			}

			if(typeof req.body.factor !== 'undefined' && req.body.factor !== ""){
				var itemDetailFactor =  req.body.factor.trim().toLowerCase();
				if(validator.isEmpty(itemDetailFactor)){
					dataExplanationOfBenefit.factor = "";
				}else{
					dataExplanationOfBenefit.factor = itemDetailFactor;
				}
			}else{
			  itemDetailFactor = "";
			}

			if(typeof req.body.net !== 'undefined' && req.body.net !== ""){
				var itemDetailNet =  req.body.net.trim().toLowerCase();
				if(validator.isEmpty(itemDetailNet)){
					dataExplanationOfBenefit.net = "";
				}else{
					dataExplanationOfBenefit.net = itemDetailNet;
				}
			}else{
			  itemDetailNet = "";
			}

			if(typeof req.body.udi !== 'undefined' && req.body.udi !== ""){
				var itemDetailUdi =  req.body.udi.trim().toLowerCase();
				if(validator.isEmpty(itemDetailUdi)){
					dataExplanationOfBenefit.udi = "";
				}else{
					dataExplanationOfBenefit.udi = itemDetailUdi;
				}
			}else{
			  itemDetailUdi = "";
			}

			if(typeof req.body.noteNumber !== 'undefined' && req.body.noteNumber !== ""){
				var itemDetailNoteNumber =  req.body.noteNumber.trim().toLowerCase();
				if(validator.isEmpty(itemDetailNoteNumber)){
					dataExplanationOfBenefit.note_number = "";
				}else{
					dataExplanationOfBenefit.note_number = itemDetailNoteNumber;
				}
			}else{
			  itemDetailNoteNumber = "";
			}

			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "ITEM_ID|" + explanationOfBenefitItemId, 'EXPLANATION_OF_BENEFIT_ITEM', function(resExplanationOfBenefitItemID){
								if(resExplanationOfBenefitItemID.err_code > 0){
									checkUniqeValue(apikey, "DETAIL_ID|" + explanationOfBenefitItemDetailId, 'EXPLANATION_OF_BENEFIT_ITEM_DETAIL', function(resExplanationOfBenefitItemDetailID){
										if(resExplanationOfBenefitItemDetailID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitItem', {"apikey": apikey, "_id": explanationOfBenefitItemDetailId, "dr": "ITEM_ID|"+explanationOfBenefitItemId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitItemDetail = body;
												if(explanationOfBenefitItemDetail.err_code > 0){
													res.json(explanationOfBenefitItemDetail);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit item detail has been update in this Explanation Of Benefit.", "data": explanationOfBenefitItemDetail.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit item detail Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Item Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkItemDetailType', function () {
							if (!validator.isEmpty(itemDetailType)) {
								checkCode(apikey, itemDetailType, 'V3_ACTINVOICEGROUPCODE', function (resItemDetailTypeCode) {
									if (resItemDetailTypeCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item detail type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
							}
						})

						myEmitter.prependOnceListener('checkItemDetailRevenue', function () {
							if (!validator.isEmpty(itemDetailRevenue)) {
								checkCode(apikey, itemDetailRevenue, 'EX_REVENUE_CENTER', function (resItemDetailRevenueCode) {
									if (resItemDetailRevenueCode.err_code > 0) {
										myEmitter.emit('checkItemDetailType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item detail revenue code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemDetailType');
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
		explanationOfBenefitAdjudicationDetal: function updateExplanationOfBenefitAdjudicationDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitItemDetailId = req.params.explanation_of_benefit_item_detail_id;
			var explanationOfBenefitAdjudicationId = req.params.explanation_of_benefit_adjudication_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitItemDetailId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitItemDetailId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Item Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Item Detail id is required";
			}

			if(typeof explanationOfBenefitAdjudicationId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitAdjudicationId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Adjudication id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Adjudication id is required";
			}
			
			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var itemDetailAdjudicationCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(itemDetailAdjudicationCategory)){
					err_code = 2;
					err_msg = "explanation of benefit item detail adjudication category is required.";
				}else{
					dataExplanationOfBenefit.category = itemDetailAdjudicationCategory;
				}
			}else{
			  itemDetailAdjudicationCategory = "";
			}

			if(typeof req.body.reason !== 'undefined' && req.body.reason !== ""){
				var itemDetailAdjudicationReason =  req.body.reason.trim().toLowerCase();
				if(validator.isEmpty(itemDetailAdjudicationReason)){
					dataExplanationOfBenefit.reason = "";
				}else{
					dataExplanationOfBenefit.reason = itemDetailAdjudicationReason;
				}
			}else{
			  itemDetailAdjudicationReason = "";
			}

			if(typeof req.body.amount !== 'undefined' && req.body.amount !== ""){
				var itemDetailAdjudicationAmount =  req.body.amount.trim().toLowerCase();
				if(validator.isEmpty(itemDetailAdjudicationAmount)){
					dataExplanationOfBenefit.amount = "";
				}else{
					dataExplanationOfBenefit.amount = itemDetailAdjudicationAmount;
				}
			}else{
			  itemDetailAdjudicationAmount = "";
			}

			if(typeof req.body.value !== 'undefined' && req.body.value !== ""){
				var itemDetailAdjudicationValue =  req.body.value.trim();
				if(validator.isEmpty(itemDetailAdjudicationValue)){
					dataExplanationOfBenefit.value = "";
				}else{
					if(!validator.isInt(itemDetailAdjudicationValue)){
						err_code = 2;
						err_msg = "explanation of benefit item detail adjudication value is must be number.";
					}else{
						dataExplanationOfBenefit.value = itemDetailAdjudicationValue;
					}
				}
			}else{
			  itemDetailAdjudicationValue = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "DETAIL_ID|" + explanationOfBenefitItemDetailId, 'EXPLANATION_OF_BENEFIT_ITEM_DETAIL', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "ADJUDICATION_ID|" + explanationOfBenefitAdjudicationId, 'EXPLANATION_OF_BENEFIT_ADJUDICATION', function(resExplanationOfBenefitAdjudicationID){
										if(resExplanationOfBenefitAdjudicationID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitAdjudication', {"apikey": apikey, "_id": explanationOfBenefitAdjudicationId, "dr": "DETAIL_ID|"+explanationOfBenefitItemDetailId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitAdjudication = body;
												if(explanationOfBenefitAdjudication.err_code > 0){
													res.json(explanationOfBenefitAdjudication);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit Adjudication Detail has been update in this Explanation Of Benefit.", "data": explanationOfBenefitAdjudication.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit Adjudication Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Detail Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkItemDetailAdjudicationCategory', function () {
							if (!validator.isEmpty(itemDetailAdjudicationCategory)) {
								checkCode(apikey, itemDetailAdjudicationCategory, 'ADJUDICATION', function (resItemDetailAdjudicationCategoryCode) {
									if (resItemDetailAdjudicationCategoryCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item detail adjudication category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
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
		explanationOfBenefitItemSubDetail: function updateExplanationOfBenefitItemSubDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitItemDetailId = req.params.explanation_of_benefit_item_detail_id;
			var explanationOfBenefitItemSubDetailId = req.params.explanation_of_benefit_item_sub_detail_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitItemDetailId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitItemDetailId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Item Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Item Detail id is required";
			}
			
			if(typeof explanationOfBenefitItemSubDetailId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitItemSubDetailId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Item Sub Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Item Sub Detail id is required";
			}
			
			if(typeof req.body.sequence !== 'undefined' && req.body.sequence !== ""){
				var itemSubDetailequence =  req.body.sequence.trim();
				if(validator.isEmpty(itemSubDetailequence)){
					err_code = 2;
					err_msg = "explanation of benefit item detail sub detail sequence is required.";
				}else{
					if(!validator.isInt(itemSubDetailequence)){
						err_code = 2;
						err_msg = "explanation of benefit item detail sub detail sequence is must be number.";
					}else{
						dataExplanationOfBenefit.sequence = itemSubDetailequence;
					}
				}
			}else{
			  itemSubDetailequence = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var itemSubDetailType =  req.body.type.trim().toUpperCase();
				if(validator.isEmpty(itemSubDetailType)){
					err_code = 2;
					err_msg = "explanation of benefit item detail sub detail type is required.";
				}else{
					dataExplanationOfBenefit.type = itemSubDetailType;
				}
			}else{
			  itemSubDetailType = "";
			}

			if(typeof req.body.revenue !== 'undefined' && req.body.revenue !== ""){
				var itemSubDetailRevenue =  req.body.revenue.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailRevenue)){
					dataExplanationOfBenefit.revenue = "";
				}else{
					dataExplanationOfBenefit.revenue = itemSubDetailRevenue;
				}
			}else{
			  itemSubDetailRevenue = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var itemSubDetailCategory =  req.body.category.trim().toUpperCase();
				if(validator.isEmpty(itemSubDetailCategory)){
					dataExplanationOfBenefit.category = "";
				}else{
					dataExplanationOfBenefit.category = itemSubDetailCategory;
				}
			}else{
			  itemSubDetailCategory = "";
			}

			if(typeof req.body.service !== 'undefined' && req.body.service !== ""){
				var itemSubDetailService =  req.body.service.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailService)){
					dataExplanationOfBenefit.service = "";
				}else{
					dataExplanationOfBenefit.service = itemSubDetailService;
				}
			}else{
			  itemSubDetailService = "";
			}

			if(typeof req.body.modifier !== 'undefined' && req.body.modifier !== ""){
				var itemSubDetailModifier =  req.body.modifier.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailModifier)){
					dataExplanationOfBenefit.modifier = "";
				}else{
					dataExplanationOfBenefit.modifier = itemSubDetailModifier;
				}
			}else{
			  itemSubDetailModifier = "";
			}

			if(typeof req.body.programCode !== 'undefined' && req.body.programCode !== ""){
				var itemSubDetailProgramCode =  req.body.programCode.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailProgramCode)){
					dataExplanationOfBenefit.program_code = "";
				}else{
					dataExplanationOfBenefit.program_code = itemSubDetailProgramCode;
				}
			}else{
			  itemSubDetailProgramCode = "";
			}

			if(typeof req.body.quantity !== 'undefined' && req.body.quantity !== ""){
				var itemSubDetailQuantity =  req.body.quantity.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailQuantity)){
					dataExplanationOfBenefit.quantity = "";
				}else{
					dataExplanationOfBenefit.quantity = itemSubDetailQuantity;
				}
			}else{
			  itemSubDetailQuantity = "";
			}

			if(typeof req.body.unitPrice !== 'undefined' && req.body.unitPrice !== ""){
				var itemSubDetailUnitPrice =  req.body.unitPrice.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailUnitPrice)){
					dataExplanationOfBenefit.unit_price = "";
				}else{
					dataExplanationOfBenefit.unit_price = itemSubDetailUnitPrice;
				}
			}else{
			  itemSubDetailUnitPrice = "";
			}

			if(typeof req.body.factor !== 'undefined' && req.body.factor !== ""){
				var itemSubDetailFactor =  req.body.factor.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailFactor)){
					dataExplanationOfBenefit.factor = "";
				}else{
					dataExplanationOfBenefit.factor = itemSubDetailFactor;
				}
			}else{
			  itemSubDetailFactor = "";
			}

			if(typeof req.body.net !== 'undefined' && req.body.net !== ""){
				var itemSubDetailNet =  req.body.net.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailNet)){
					dataExplanationOfBenefit.net = "";
				}else{
					dataExplanationOfBenefit.net = itemSubDetailNet;
				}
			}else{
			  itemSubDetailNet = "";
			}

			if(typeof req.body.udi !== 'undefined' && req.body.udi !== ""){
				var itemSubDetailUdi =  req.body.udi.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailUdi)){
					dataExplanationOfBenefit.udi = "";
				}else{
					dataExplanationOfBenefit.udi = itemSubDetailUdi;
				}
			}else{
			  itemSubDetailUdi = "";
			}

			if(typeof req.body.noteNumber !== 'undefined' && req.body.noteNumber !== ""){
				var itemSubDetailNoteNumber =  req.body.noteNumber.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailNoteNumber)){
					dataExplanationOfBenefit.note_number = "";
				}else{
					dataExplanationOfBenefit.note_number = itemSubDetailNoteNumber;
				}
			}else{
			  itemSubDetailNoteNumber = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "DETAIL_ID|" + explanationOfBenefitItemDetailId, 'EXPLANATION_OF_BENEFIT_ITEM_DETAIL', function(resExplanationOfBenefitItemID){
								if(resExplanationOfBenefitItemID.err_code > 0){
									checkUniqeValue(apikey, "SUB_DETAIL_ID|" + explanationOfBenefitItemSubDetailId, 'EXPLANATION_OF_BENEFIT_ITEM_SUB_DETAIL', function(resExplanationOfBenefitItemDetailID){
										if(resExplanationOfBenefitItemDetailID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitItem', {"apikey": apikey, "_id": explanationOfBenefitItemSubDetailId, "dr": "DETAIL_ID|"+explanationOfBenefitItemDetailId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitItemDetail = body;
												if(explanationOfBenefitItemDetail.err_code > 0){
													res.json(explanationOfBenefitItemDetail);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit item sub detail has been update in this Explanation Of Benefit.", "data": explanationOfBenefitItemDetail.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit item sub detail Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Item Detail Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkItemSubDetailType', function () {
							if (!validator.isEmpty(itemSubDetailType)) {
								checkCode(apikey, itemSubDetailType, 'V3_ACTINVOICEGROUPCODE', function (resItemSubDetailTypeCode) {
									if (resItemSubDetailTypeCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item sub detail type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
							}
						})

						myEmitter.prependOnceListener('checkItemSubDetailRevenue', function () {
							if (!validator.isEmpty(itemSubDetailRevenue)) {
								checkCode(apikey, itemSubDetailRevenue, 'EX_REVENUE_CENTER', function (resItemSubDetailRevenueCode) {
									if (resItemSubDetailRevenueCode.err_code > 0) {
										myEmitter.emit('checkItemSubDetailType');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item sub detail revenue code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkItemSubDetailType');
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
		explanationOfBenefitAdjudicationSubDetail: function updateExplanationOfBenefitAdjudicationSubDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitItemSubDetailId = req.params.explanation_of_benefit_item_sub_detail_id;
			var explanationOfBenefitAdjudicationId = req.params.explanation_of_benefit_adjudication_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitItemSubDetailId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitItemSubDetailId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Item Sub Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Item Sub Detail id is required";
			}

			if(typeof explanationOfBenefitAdjudicationId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitAdjudicationId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Adjudication id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Adjudication id is required";
			}
			
			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var itemSubDetailAdjudicationCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailAdjudicationCategory)){
					err_code = 2;
					err_msg = "explanation of benefit item detail sub detail adjudication category is required.";
				}else{
					dataExplanationOfBenefit.category = itemSubDetailAdjudicationCategory;
				}
			}else{
			  itemSubDetailAdjudicationCategory = "";
			}

			if(typeof req.body.reason !== 'undefined' && req.body.reason !== ""){
				var itemSubDetailAdjudicationReason =  req.body.reason.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailAdjudicationReason)){
					dataExplanationOfBenefit.reason = "";
				}else{
					dataExplanationOfBenefit.reason = itemSubDetailAdjudicationReason;
				}
			}else{
			  itemSubDetailAdjudicationReason = "";
			}

			if(typeof req.body.amount !== 'undefined' && req.body.amount !== ""){
				var itemSubDetailAdjudicationAmount =  req.body.amount.trim().toLowerCase();
				if(validator.isEmpty(itemSubDetailAdjudicationAmount)){
					dataExplanationOfBenefit.amount = "";
				}else{
					dataExplanationOfBenefit.amount = itemSubDetailAdjudicationAmount;
				}
			}else{
			  itemSubDetailAdjudicationAmount = "";
			}

			if(typeof req.body.value !== 'undefined' && req.body.value !== ""){
				var itemSubDetailAdjudicationValue =  req.body.value.trim();
				if(validator.isEmpty(itemSubDetailAdjudicationValue)){
					dataExplanationOfBenefit.value = "";
				}else{
					if(!validator.isInt(itemSubDetailAdjudicationValue)){
						err_code = 2;
						err_msg = "explanation of benefit item detail sub detail adjudication value is must be number.";
					}else{
						dataExplanationOfBenefit.value = itemSubDetailAdjudicationValue;
					}
				}
			}else{
			  itemSubDetailAdjudicationValue = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "SUB_DETAIL_ID|" + explanationOfBenefitItemSubDetailId, 'EXPLANATION_OF_BENEFIT_ITEM_SUB_DETAIL', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "ADJUDICATION_ID|" + explanationOfBenefitAdjudicationId, 'EXPLANATION_OF_BENEFIT_ADJUDICATION', function(resExplanationOfBenefitAdjudicationID){
										if(resExplanationOfBenefitAdjudicationID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitAdjudication', {"apikey": apikey, "_id": explanationOfBenefitAdjudicationId, "dr": "DETAIL_ID|"+explanationOfBenefitItemSubDetailId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitAdjudication = body;
												if(explanationOfBenefitAdjudication.err_code > 0){
													res.json(explanationOfBenefitAdjudication);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit Adjudication Sub Detail has been update in this Explanation Of Benefit.", "data": explanationOfBenefitAdjudication.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit Adjudication Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Sub Detail Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkItemSubDetailAdjudicationCategory', function () {
							if (!validator.isEmpty(itemSubDetailAdjudicationCategory)) {
								checkCode(apikey, itemSubDetailAdjudicationCategory, 'ADJUDICATION', function (resItemSubDetailAdjudicationCategoryCode) {
									if (resItemSubDetailAdjudicationCategoryCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Item sub detail adjudication category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
							}
						})

						if (!validator.isEmpty(itemSubDetailAdjudicationReason)) {
							checkCode(apikey, itemSubDetailAdjudicationReason, 'ADJUDICATION_REASON', function (resItemSubDetailAdjudicationReasonCode) {
								if (resItemSubDetailAdjudicationReasonCode.err_code > 0) {
									myEmitter.emit('checkItemSubDetailAdjudicationCategory');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Item sub detail adjudication reason code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkItemSubDetailAdjudicationCategory');
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
		explanationOfBenefitAddItem: function updateExplanationOfBenefitAddItem(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitId = req.params.explanation_of_benefit_id;
			var explanationOfBenefitAddItemId = req.params.explanation_of_benefit_add_item_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit id is required";
			}

			if(typeof explanationOfBenefitAddItemId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitAddItemId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Add Item id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Add Item id is required";
			}
			
			if(typeof req.body.sequenceLinkId !== 'undefined' && req.body.sequenceLinkId !== ""){
				var addItemSequenceLinkId =  req.body.sequenceLinkId.trim();
				if(validator.isEmpty(addItemSequenceLinkId)){
					dataExplanationOfBenefit.sequence_link_id = "";
				}else{
					if(!validator.isInt(addItemSequenceLinkId)){
						err_code = 2;
						err_msg = "explanation of benefit add item sequence link id is must be number.";
					}else{
						dataExplanationOfBenefit.sequence_link_id = addItemSequenceLinkId;
					}
				}
			}else{
			  addItemSequenceLinkId = "";
			}

			if(typeof req.body.revenue !== 'undefined' && req.body.revenue !== ""){
				var addItemRevenue =  req.body.revenue.trim().toLowerCase();
				if(validator.isEmpty(addItemRevenue)){
					dataExplanationOfBenefit.revenue = "";
				}else{
					dataExplanationOfBenefit.revenue = addItemRevenue;
				}
			}else{
			  addItemRevenue = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var addItemCategory =  req.body.category.trim().toUpperCase();
				if(validator.isEmpty(addItemCategory)){
					dataExplanationOfBenefit.category = "";
				}else{
					dataExplanationOfBenefit.category = addItemCategory;
				}
			}else{
			  addItemCategory = "";
			}

			if(typeof req.body.service !== 'undefined' && req.body.service !== ""){
				var addItemService =  req.body.service.trim().toLowerCase();
				if(validator.isEmpty(addItemService)){
					dataExplanationOfBenefit.service = "";
				}else{
					dataExplanationOfBenefit.service = addItemService;
				}
			}else{
			  addItemService = "";
			}

			if(typeof req.body.modifier !== 'undefined' && req.body.modifier !== ""){
				var addItemModifier =  req.body.modifier.trim().toLowerCase();
				if(validator.isEmpty(addItemModifier)){
					dataExplanationOfBenefit.modifier = "";
				}else{
					dataExplanationOfBenefit.modifier = addItemModifier;
				}
			}else{
			  addItemModifier = "";
			}

			if(typeof req.body.fee !== 'undefined' && req.body.fee !== ""){
				var addItemFee =  req.body.fee.trim();
				if(validator.isEmpty(addItemFee)){
					dataExplanationOfBenefit.fee = "";
				}else{
					if(!validator.isInt(addItemFee)){
						err_code = 2;
						err_msg = "explanation of benefit add item fee is must be number.";
					}else{
						dataExplanationOfBenefit.fee = addItemFee;
					}
				}
			}else{
			  addItemFee = "";
			}

			if(typeof req.body.noteNumber !== 'undefined' && req.body.noteNumber !== ""){
				var addItemNoteNumber =  req.body.noteNumber.trim().toLowerCase();
				if(validator.isEmpty(addItemNoteNumber)){
					dataExplanationOfBenefit.note_number = "";
				}else{
					dataExplanationOfBenefit.note_number = addItemNoteNumber;
				}
			}else{
			  addItemNoteNumber = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId, 'EXPLANATION_OF_BENEFIT', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "ADD_ITEM_ID|" + explanationOfBenefitAddItemId, 'EXPLANATION_OF_BENEFIT_ADD_ITEM', function(resExplanationOfBenefitAddItemID){
										if(resExplanationOfBenefitAddItemID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitAddItem', {"apikey": apikey, "_id": explanationOfBenefitAddItemId, "dr": "EXPLANATION_OF_BENEFIT_ID|"+explanationOfBenefitId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitAddItem = body;
												if(explanationOfBenefitAddItem.err_code > 0){
													res.json(explanationOfBenefitAddItem);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit Add Item has been update in this Explanation Of Benefit.", "data": explanationOfBenefitAddItem.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit Add Item Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkAddItemRevenue', function () {
							if (!validator.isEmpty(addItemRevenue)) {
								checkCode(apikey, addItemRevenue, 'EX_REVENUE_CENTER', function (resAddItemRevenueCode) {
									if (resAddItemRevenueCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Add item revenue code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
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
		explanationOfBenefitAdjudicationAddItem: function updateExplanationOfBenefitAdjudicationAddItem(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitAddItemId = req.params.explanation_of_benefit_add_item_id;
			var explanationOfBenefitAdjudicationId = req.params.explanation_of_benefit_adjudication_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitAddItemId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitAddItemId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Add Item id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Add Item id is required";
			}

			if(typeof explanationOfBenefitAdjudicationId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitAdjudicationId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Adjudication id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Adjudication id is required";
			}
			
			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var addItemAdjudicationCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(addItemAdjudicationCategory)){
					err_code = 2;
					err_msg = "explanation of benefit add item adjudication category is required.";
				}else{
					dataExplanationOfBenefit.category = addItemAdjudicationCategory;
				}
			}else{
			  addItemAdjudicationCategory = "";
			}

			if(typeof req.body.reason !== 'undefined' && req.body.reason !== ""){
				var addItemAdjudicationReason =  req.body.reason.trim().toLowerCase();
				if(validator.isEmpty(addItemAdjudicationReason)){
					dataExplanationOfBenefit.reason = "";
				}else{
					dataExplanationOfBenefit.reason = addItemAdjudicationReason;
				}
			}else{
			  addItemAdjudicationReason = "";
			}

			if(typeof req.body.amount !== 'undefined' && req.body.amount !== ""){
				var addItemAdjudicationAmount =  req.body.amount.trim().toLowerCase();
				if(validator.isEmpty(addItemAdjudicationAmount)){
					dataExplanationOfBenefit.amount = "";
				}else{
					dataExplanationOfBenefit.amount = addItemAdjudicationAmount;
				}
			}else{
			  addItemAdjudicationAmount = "";
			}

			if(typeof req.body.value !== 'undefined' && req.body.value !== ""){
				var addItemAdjudicationValue =  req.body.value.trim();
				if(validator.isEmpty(addItemAdjudicationValue)){
					dataExplanationOfBenefit.value = "";
				}else{
					if(!validator.isInt(addItemAdjudicationValue)){
						err_code = 2;
						err_msg = "explanation of benefit add item adjudication value is must be number.";
					}else{
						dataExplanationOfBenefit.value = addItemAdjudicationValue;
					}
				}
			}else{
			  addItemAdjudicationValue = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "ADD_ITEM_ID|" + explanationOfBenefitAddItemId, 'EXPLANATION_OF_BENEFIT_ADD_ITEM', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "ADJUDICATION_ID|" + explanationOfBenefitAdjudicationId, 'EXPLANATION_OF_BENEFIT_ADJUDICATION', function(resExplanationOfBenefitAdjudicationID){
										if(resExplanationOfBenefitAdjudicationID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitAdjudication', {"apikey": apikey, "_id": explanationOfBenefitAdjudicationId, "dr": "ADD_ITEM_ID|"+explanationOfBenefitAddItemId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitAdjudication = body;
												if(explanationOfBenefitAdjudication.err_code > 0){
													res.json(explanationOfBenefitAdjudication);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit Adjudication Add Item has been update in this Explanation Of Benefit.", "data": explanationOfBenefitAdjudication.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit Adjudication Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Add Item Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkAddItemAdjudicationCategory', function () {
							if (!validator.isEmpty(addItemAdjudicationCategory)) {
								checkCode(apikey, addItemAdjudicationCategory, 'ADJUDICATION', function (resAddItemAdjudicationCategoryCode) {
									if (resAddItemAdjudicationCategoryCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Add item adjudication category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
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
		explanationOfBenefitAddItemDetail: function updateExplanationOfBenefitAddItemDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitAddItemId = req.params.explanation_of_benefit_add_item_id;
			var explanationOfBenefitAddItemDetailId = req.params.explanation_of_benefit_add_item_detail_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitAddItemId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitAddItemId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Add Item id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Add Item id is required";
			}
			
			if(typeof explanationOfBenefitAddItemDetailId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitAddItemDetailId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Add Item Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Add Item Detail id is required";
			}
			
			if(typeof req.body.revenue !== 'undefined' && req.body.revenue !== ""){
				var addItemDetailRevenue =  req.body.revenue.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailRevenue)){
					dataExplanationOfBenefit.revenue = "";
				}else{
					dataExplanationOfBenefit.revenue = addItemDetailRevenue;
				}
			}else{
			  addItemDetailRevenue = "";
			}

			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var addItemDetailCategory =  req.body.category.trim().toUpperCase();
				if(validator.isEmpty(addItemDetailCategory)){
					dataExplanationOfBenefit.category = "";
				}else{
					dataExplanationOfBenefit.category = addItemDetailCategory;
				}
			}else{
			  addItemDetailCategory = "";
			}

			if(typeof req.body.service !== 'undefined' && req.body.service !== ""){
				var addItemDetailService =  req.body.service.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailService)){
					dataExplanationOfBenefit.service = "";
				}else{
					dataExplanationOfBenefit.service = addItemDetailService;
				}
			}else{
			  addItemDetailService = "";
			}

			if(typeof req.body.modifier !== 'undefined' && req.body.modifier !== ""){
				var addItemDetailModifier =  req.body.modifier.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailModifier)){
					dataExplanationOfBenefit.modifier = "";
				}else{
					dataExplanationOfBenefit.modifier = addItemDetailModifier;
				}
			}else{
			  addItemDetailModifier = "";
			}

			if(typeof req.body.fee !== 'undefined' && req.body.fee !== ""){
				var addItemDetailFee =  req.body.fee.trim();
				if(validator.isEmpty(addItemDetailFee)){
					dataExplanationOfBenefit.fee = "";
				}else{
					if(!validator.isInt(addItemDetailFee)){
						err_code = 2;
						err_msg = "explanation of benefit add item detail fee is must be number.";
					}else{
						dataExplanationOfBenefit.fee = addItemDetailFee;
					}
				}
			}else{
			  addItemDetailFee = "";
			}

			if(typeof req.body.noteNumber !== 'undefined' && req.body.noteNumber !== ""){
				var addItemDetailNoteNumber =  req.body.noteNumber.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailNoteNumber)){
					dataExplanationOfBenefit.note_number = "";
				}else{
					dataExplanationOfBenefit.note_number = addItemDetailNoteNumber;
				}
			}else{
			  addItemDetailNoteNumber = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "ADD_ITEM_ID|" + explanationOfBenefitAddItemId, 'EXPLANATION_OF_BENEFIT_ADD_ITEM', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "ADD_ITEM_DETAIL_ID|" + explanationOfBenefitAddItemId, 'EXPLANATION_OF_BENEFIT_ADD_ITEM_DETAIL', function(resExplanationOfBenefitAddItemID){
										if(resExplanationOfBenefitAddItemID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitAddItem', {"apikey": apikey, "_id": explanationOfBenefitAddItemId, "dr": "ADD_ITEM_ID|"+explanationOfBenefitAddItemId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitAddItem = body;
												if(explanationOfBenefitAddItem.err_code > 0){
													res.json(explanationOfBenefitAddItem);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit Add Item Detail has been update in this Explanation Of Benefit.", "data": explanationOfBenefitAddItem.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit Add Item Detail Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Add Item Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkAddItemDetailRevenue', function () {
							if (!validator.isEmpty(addItemDetailRevenue)) {
								checkCode(apikey, addItemDetailRevenue, 'EX_REVENUE_CENTER', function (resAddItemDetailRevenueCode) {
									if (resAddItemDetailRevenueCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Add item detail revenue code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
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
		explanationOfBenefitAdjudicationAddItemDetail: function updateExplanationOfBenefitAdjudicationAddItemDetail(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitAddItemDetailId = req.params.explanation_of_benefit_add_item_detail_id;
			var explanationOfBenefitAdjudicationId = req.params.explanation_of_benefit_adjudication_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitAddItemDetailId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitAddItemDetailId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Add Item Detail id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Add Item Detail id is required";
			}

			if(typeof explanationOfBenefitAdjudicationId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitAdjudicationId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Adjudication id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Adjudication id is required";
			}
			
			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var addItemDetailAdjudicationCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailAdjudicationCategory)){
					err_code = 2;
					err_msg = "explanation of benefit add item detail adjudication category is required.";
				}else{
					dataExplanationOfBenefit.category = addItemDetailAdjudicationCategory;
				}
			}else{
			  addItemDetailAdjudicationCategory = "";
			}

			if(typeof req.body.reason !== 'undefined' && req.body.reason !== ""){
				var addItemDetailAdjudicationReason =  req.body.reason.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailAdjudicationReason)){
					dataExplanationOfBenefit.reason = "";
				}else{
					dataExplanationOfBenefit.reason = addItemDetailAdjudicationReason;
				}
			}else{
			  addItemDetailAdjudicationReason = "";
			}

			if(typeof req.body.amount !== 'undefined' && req.body.amount !== ""){
				var addItemDetailAdjudicationAmount =  req.body.amount.trim().toLowerCase();
				if(validator.isEmpty(addItemDetailAdjudicationAmount)){
					dataExplanationOfBenefit.amount = "";
				}else{
					dataExplanationOfBenefit.amount = addItemDetailAdjudicationAmount;
				}
			}else{
			  addItemDetailAdjudicationAmount = "";
			}

			if(typeof req.body.value !== 'undefined' && req.body.value !== ""){
				var addItemDetailAdjudicationValue =  req.body.value.trim();
				if(validator.isEmpty(addItemDetailAdjudicationValue)){
					dataExplanationOfBenefit.value = "";
				}else{
					if(!validator.isInt(addItemDetailAdjudicationValue)){
						err_code = 2;
						err_msg = "explanation of benefit add item detail adjudication value is must be number.";
					}else{
						dataExplanationOfBenefit.value = addItemDetailAdjudicationValue;
					}
				}
			}else{
			  addItemDetailAdjudicationValue = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "ADD_ITEM_DETAIL_ID|" + explanationOfBenefitAddItemId, 'EXPLANATION_OF_BENEFIT_ADD_ITEM_DETAIL', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "ADJUDICATION_ID|" + explanationOfBenefitAdjudicationId, 'EXPLANATION_OF_BENEFIT_ADJUDICATION', function(resExplanationOfBenefitAdjudicationID){
										if(resExplanationOfBenefitAdjudicationID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitAdjudication', {"apikey": apikey, "_id": explanationOfBenefitAdjudicationId, "dr": "ADD_ITEM_DETAIL_ID|"+explanationOfBenefitAddItemId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitAdjudication = body;
												if(explanationOfBenefitAdjudication.err_code > 0){
													res.json(explanationOfBenefitAdjudication);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit Adjudication Add Item Detail has been update in this Explanation Of Benefit.", "data": explanationOfBenefitAdjudication.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit Adjudication Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Add Item Detail Id not found"});		
								}
							})
						})

						myEmitter.prependOnceListener('checkAddItemDetailAdjudicationCategory', function () {
							if (!validator.isEmpty(addItemDetailAdjudicationCategory)) {
								checkCode(apikey, addItemDetailAdjudicationCategory, 'ADJUDICATION', function (resAddItemDetailAdjudicationCategoryCode) {
									if (resAddItemDetailAdjudicationCategoryCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Add item detail adjudication category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
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
		explanationOfBenefitProcessNote: function updateExplanationOfBenefitProcessNote(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitId = req.params.explanation_of_benefit_id;
			var explanationOfBenefitProcessNoteId = req.params.explanation_of_benefit_process_note_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit id is required";
			}

			if(typeof explanationOfBenefitProcessNoteId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitProcessNoteId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Process Note id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Process Note id is required";
			}
			
			if(typeof req.body.number !== 'undefined' && req.body.number !== ""){
				var processNoteNumber =  req.body.number.trim();
				if(validator.isEmpty(processNoteNumber)){
					dataExplanationOfBenefit.number = "";
				}else{
					if(!validator.isInt(processNoteNumber)){
						err_code = 2;
						err_msg = "explanation of benefit process note number is must be number.";
					}else{
						dataExplanationOfBenefit.number = processNoteNumber;
					}
				}
			}else{
			  processNoteNumber = "";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var processNoteType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(processNoteType)){
					dataExplanationOfBenefit.type = "";
				}else{
					dataExplanationOfBenefit.type = processNoteType;
				}
			}else{
			  processNoteType = "";
			}

			if(typeof req.body.text !== 'undefined' && req.body.text !== ""){
				var processNoteText =  req.body.text.trim().toLowerCase();
				if(validator.isEmpty(processNoteText)){
					dataExplanationOfBenefit.text = "";
				}else{
					dataExplanationOfBenefit.text = processNoteText;
				}
			}else{
			  processNoteText = "";
			}

			if(typeof req.body.language !== 'undefined' && req.body.language !== ""){
				var processNoteLanguage =  req.body.language.trim();
				if(validator.isEmpty(processNoteLanguage)){
					dataExplanationOfBenefit.language = "";
				}else{
					dataExplanationOfBenefit.language = processNoteLanguage;
				}
			}else{
			  processNoteLanguage = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId, 'EXPLANATION_OF_BENEFIT', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "PROCESS_NOTE_ID|" + explanationOfBenefitProcessNoteId, 'EXPLANATION_OF_BENEFIT_PROCESS_NOTE', function(resExplanationOfBenefitProcessNoteID){
										if(resExplanationOfBenefitProcessNoteID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitProcessNote', {"apikey": apikey, "_id": explanationOfBenefitProcessNoteId, "dr": "EXPLANATION_OF_BENEFIT_ID|"+explanationOfBenefitId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitProcessNote = body;
												if(explanationOfBenefitProcessNote.err_code > 0){
													res.json(explanationOfBenefitProcessNote);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit Process Note has been update in this Explanation Of Benefit.", "data": explanationOfBenefitProcessNote.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit Process Note Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Id not found"});		
								}
							})
						})
						
						myEmitter.prependOnceListener('checkProcessNoteType', function () {
							if (!validator.isEmpty(processNoteType)) {
								checkCode(apikey, processNoteType, 'NOTE_TYPE', function (resProcessNoteTypeCode) {
									if (resProcessNoteTypeCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Process note type code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
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
		explanationOfBenefitBalance: function updateExplanationOfBenefitBalance(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitId = req.params.explanation_of_benefit_id;
			var explanationOfBenefitBalanceId = req.params.explanation_of_benefit_balance_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit id is required";
			}

			if(typeof explanationOfBenefitBalanceId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitBalanceId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Balance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Balance id is required";
			}
			
			if(typeof req.body.category !== 'undefined' && req.body.category !== ""){
				var benefitBalanceCategory =  req.body.category.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceCategory)){
					err_code = 2;
					err_msg = "explanation of benefit benefit balance category is required.";
				}else{
					dataExplanationOfBenefit.category = benefitBalanceCategory;
				}
			}else{
			  benefitBalanceCategory = "";
			}

			if(typeof req.body.subCategory !== 'undefined' && req.body.subCategory !== ""){
				var benefitBalanceSubCategory =  req.body.subCategory.trim().toUpperCase();
				if(validator.isEmpty(benefitBalanceSubCategory)){
					dataExplanationOfBenefit.sub_category = "";
				}else{
					dataExplanationOfBenefit.sub_category = benefitBalanceSubCategory;
				}
			}else{
			  benefitBalanceSubCategory = "";
			}

			if (typeof req.body.excluded !== 'undefined' && req.body.excluded !== "") {
			  var benefitBalanceExcluded = req.body.excluded.trim().toLowerCase();
					if(validator.isEmpty(benefitBalanceExcluded)){
						benefitBalanceExcluded = "false";
					}
			  if(benefitBalanceExcluded === "true" || benefitBalanceExcluded === "false"){
					dataExplanationOfBenefit.excluded = benefitBalanceExcluded;
			  } else {
			    err_code = 2;
			    err_msg = "Explanation of benefit benefit balance excluded is must be boolean.";
			  }
			} else {
			  benefitBalanceExcluded = "";
			}

			if(typeof req.body.name !== 'undefined' && req.body.name !== ""){
				var benefitBalanceName =  req.body.name.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceName)){
					dataExplanationOfBenefit.name = "";
				}else{
					dataExplanationOfBenefit.name = benefitBalanceName;
				}
			}else{
			  benefitBalanceName = "";
			}

			if(typeof req.body.description !== 'undefined' && req.body.description !== ""){
				var benefitBalanceDescription =  req.body.description.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceDescription)){
					dataExplanationOfBenefit.description = "";
				}else{
					dataExplanationOfBenefit.description = benefitBalanceDescription;
				}
			}else{
			  benefitBalanceDescription = "";
			}

			if(typeof req.body.network !== 'undefined' && req.body.network !== ""){
				var benefitBalanceNetwork =  req.body.network.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceNetwork)){
					dataExplanationOfBenefit.network = "";
				}else{
					dataExplanationOfBenefit.network = benefitBalanceNetwork;
				}
			}else{
			  benefitBalanceNetwork = "";
			}

			if(typeof req.body.unit !== 'undefined' && req.body.unit !== ""){
				var benefitBalanceUnit =  req.body.unit.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceUnit)){
					dataExplanationOfBenefit.unit = "";
				}else{
					dataExplanationOfBenefit.unit = benefitBalanceUnit;
				}
			}else{
			  benefitBalanceUnit = "";
			}

			if(typeof req.body.term !== 'undefined' && req.body.term !== ""){
				var benefitBalanceTerm =  req.body.term.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceTerm)){
					dataExplanationOfBenefit.term = "";
				}else{
					dataExplanationOfBenefit.term = benefitBalanceTerm;
				}
			}else{
			  benefitBalanceTerm = "";
			}
			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "EXPLANATION_OF_BENEFIT_ID|" + explanationOfBenefitId, 'EXPLANATION_OF_BENEFIT', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "BALANCE_ID|" + explanationOfBenefitBalanceId, 'EXPLANATION_OF_BENEFIT_BALANCE', function(resExplanationOfBenefitBalanceID){
										if(resExplanationOfBenefitBalanceID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitBalance', {"apikey": apikey, "_id": explanationOfBenefitBalanceId, "dr": "EXPLANATION_OF_BENEFIT_ID|"+explanationOfBenefitId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitBalance = body;
												if(explanationOfBenefitBalance.err_code > 0){
													res.json(explanationOfBenefitBalance);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit balance has been update in this Explanation Of Benefit.", "data": explanationOfBenefitBalance.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit balance Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit Id not found"});		
								}
							})
						})
						
						/*check code dan value*/
						myEmitter.prependOnceListener('checkBenefitBalanceCategory', function () {
							if (!validator.isEmpty(benefitBalanceCategory)) {
								checkCode(apikey, benefitBalanceCategory, 'BENEFIT_CATEGORY', function (resBenefitBalanceCategoryCode) {
									if (resBenefitBalanceCategoryCode.err_code > 0) {
										myEmitter.emit('checkExplanationOfBenefitID');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Benefit balance category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkExplanationOfBenefitID');
							}
						})

						myEmitter.prependOnceListener('checkBenefitBalanceSubCategory', function () {
							if (!validator.isEmpty(benefitBalanceSubCategory)) {
								checkCode(apikey, benefitBalanceSubCategory, 'BENEFIT_SUBCATEGORY', function (resBenefitBalanceSubCategoryCode) {
									if (resBenefitBalanceSubCategoryCode.err_code > 0) {
										myEmitter.emit('checkBenefitBalanceCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Benefit balance sub category code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkBenefitBalanceCategory');
							}
						})

						myEmitter.prependOnceListener('checkBenefitBalanceNetwork', function () {
							if (!validator.isEmpty(benefitBalanceNetwork)) {
								checkCode(apikey, benefitBalanceNetwork, 'BENEFIT_NETWORK', function (resBenefitBalanceNetworkCode) {
									if (resBenefitBalanceNetworkCode.err_code > 0) {
										myEmitter.emit('checkBenefitBalanceSubCategory');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Benefit balance network code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkBenefitBalanceSubCategory');
							}
						})

						myEmitter.prependOnceListener('checkBenefitBalanceUnit', function () {
							if (!validator.isEmpty(benefitBalanceUnit)) {
								checkCode(apikey, benefitBalanceUnit, 'BENEFIT_UNIT', function (resBenefitBalanceUnitCode) {
									if (resBenefitBalanceUnitCode.err_code > 0) {
										myEmitter.emit('checkBenefitBalanceNetwork');
									} else {
										res.json({
											"err_code": "500",
											"err_msg": "Benefit balance unit code not found"
										});
									}
								})
							} else {
								myEmitter.emit('checkBenefitBalanceNetwork');
							}
						})

						if (!validator.isEmpty(benefitBalanceTerm)) {
							checkCode(apikey, benefitBalanceTerm, 'BENEFIT_TERM', function (resBenefitBalanceTermCode) {
								if (resBenefitBalanceTermCode.err_code > 0) {
									myEmitter.emit('checkBenefitBalanceUnit');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Benefit balance term code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkBenefitBalanceUnit');
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
		explanationOfBenefitBalanceFinancial: function updateExplanationOfBenefitBalanceFinancial(req, res){
			var ipAddres = req.connection.remoteAddress;
			var apikey = req.params.apikey;
			var regex = new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})");
			var explanationOfBenefitBalanceId = req.params.explanation_of_benefit_balance_id;
			var explanationOfBenefitBalanceFinancialId = req.params.explanation_of_benefit_balance_financial_id;

			var err_code = 0;
			var err_msg = "";
			var dataExplanationOfBenefit = {};
			//input check 
			if(typeof explanationOfBenefitBalanceId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitBalanceId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Balance id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Balance id is required";
			}


			if(typeof explanationOfBenefitBalanceFinancialId !== 'undefined'){
				if(validator.isEmpty(explanationOfBenefitBalanceFinancialId)){
					err_code = 2;
					err_msg = "Explanation Of Benefit Balance Financial id is required";
				}
			}else{
				err_code = 2;
				err_msg = "Explanation Of Benefit Balance Financial id is required";
			}

			if(typeof req.body.type !== 'undefined' && req.body.type !== ""){
				var benefitBalanceFinancialType =  req.body.type.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceFinancialType)){
					err_code = 2;
					err_msg = "explanation of benefit benefit balance financial type is required.";
				}else{
					dataExplanationOfBenefit.type = benefitBalanceFinancialType;
				}
			}else{
			  benefitBalanceFinancialType = "";
			}

			if(typeof req.body.allowed.allowedUnsignedInt !== 'undefined' && req.body.allowed.allowedUnsignedInt !== ""){
				var benefitBalanceFinancialAllowedUnsignedInt =  req.body.allowed.allowedUnsignedInt.trim();
				if(validator.isEmpty(benefitBalanceFinancialAllowedUnsignedInt)){
					dataExplanationOfBenefit.allowed_unsigned_int = "";
				}else{
					if(!validator.isInt(benefitBalanceFinancialAllowedUnsignedInt)){
						err_code = 2;
						err_msg = "explanation of benefit benefit balance financial allowed allowed unsigned int is must be number.";
					}else{
						dataExplanationOfBenefit.allowed_unsigned_int = benefitBalanceFinancialAllowedUnsignedInt;
					}
				}
			}else{
			  benefitBalanceFinancialAllowedUnsignedInt = "";
			}

			if(typeof req.body.allowed.allowedString !== 'undefined' && req.body.allowed.allowedString !== ""){
				var benefitBalanceFinancialAllowedString =  req.body.allowed.allowedString.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceFinancialAllowedString)){
					dataExplanationOfBenefit.allowed_string = "";
				}else{
					dataExplanationOfBenefit.allowed_string = benefitBalanceFinancialAllowedString;
				}
			}else{
			  benefitBalanceFinancialAllowedString = "";
			}

			if(typeof req.body.allowed.allowedMoney !== 'undefined' && req.body.allowed.allowedMoney !== ""){
				var benefitBalanceFinancialAllowedMoney =  req.body.allowed.allowedMoney.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceFinancialAllowedMoney)){
					dataExplanationOfBenefit.allowed_money = "";
				}else{
					dataExplanationOfBenefit.allowed_money = benefitBalanceFinancialAllowedMoney;
				}
			}else{
			  benefitBalanceFinancialAllowedMoney = "";
			}

			if(typeof req.body.used.usedUnsignedInt !== 'undefined' && req.body.used.usedUnsignedInt !== ""){
				var benefitBalanceFinancialUsedUnsignedInt =  req.body.used.usedUnsignedInt.trim();
				if(validator.isEmpty(benefitBalanceFinancialUsedUnsignedInt)){
					dataExplanationOfBenefit.used_unsigned_int = "";
				}else{
					if(!validator.isInt(benefitBalanceFinancialUsedUnsignedInt)){
						err_code = 2;
						err_msg = "explanation of benefit benefit balance financial used used unsigned int is must be number.";
					}else{
						dataExplanationOfBenefit.used_unsigned_int = benefitBalanceFinancialUsedUnsignedInt;
					}
				}
			}else{
			  benefitBalanceFinancialUsedUnsignedInt = "";
			}

			if(typeof req.body.used.usedMoney !== 'undefined' && req.body.used.usedMoney !== ""){
				var benefitBalanceFinancialUsedMoney =  req.body.used.usedMoney.trim().toLowerCase();
				if(validator.isEmpty(benefitBalanceFinancialUsedMoney)){
					dataExplanationOfBenefit.used_money = "";
				}else{
					dataExplanationOfBenefit.used_money = benefitBalanceFinancialUsedMoney;
				}
			}else{
			  benefitBalanceFinancialUsedMoney = "";
			}

			
			if(err_code == 0){
				//check apikey
				checkApikey(apikey, ipAddres, function(result){
					if(result.err_code == 0){
						myEmitter.once('checkExplanationOfBenefitID', function(){
							checkUniqeValue(apikey, "BALANCE_ID|" + explanationOfBenefitBalanceId, 'EXPLANATION_OF_BENEFIT_BALANCE', function(resExplanationOfBenefitId){
								if(resExplanationOfBenefitId.err_code > 0){
									checkUniqeValue(apikey, "BALANCE_FINANCIAL_ID|" + explanationOfBenefitBalanceFinancialId, 'EXPLANATION_OF_BENEFIT_BALANCE_FINANCIAL', function(resExplanationOfBenefitBalanceID){
										if(resExplanationOfBenefitBalanceID.err_code > 0){
											ApiFHIR.put('explanationOfBenefitBalance', {"apikey": apikey, "_id": explanationOfBenefitBalanceFinancialId, "dr": "BALANCE_ID|"+explanationOfBenefitBalanceId}, {body: dataExplanationOfBenefit, json: true}, function(error, response, body){
												explanationOfBenefitBalance = body;
												if(explanationOfBenefitBalance.err_code > 0){
													res.json(explanationOfBenefitBalance);	
												}else{
													res.json({"err_code": 0, "err_msg": "Explanation Of Benefit balance financial has been update in this Explanation Of Benefit.", "data": explanationOfBenefitBalance.data});
												}
											})
										}else{
											res.json({"err_code": 505, "err_msg": "Explanation Of Benefit balance financial  Id not found"});		
										}
									})
								}else{
									res.json({"err_code": 504, "err_msg": "Explanation Of Benefit balance Id not found"});		
								}
							})
						})
						
						/*check code dan value*/
						if (!validator.isEmpty(benefitBalanceFinancialType)) {
							checkCode(apikey, benefitBalanceFinancialType, 'BENEFIT_TYPE', function (resBenefitBalanceFinancialTypeCode) {
								if (resBenefitBalanceFinancialTypeCode.err_code > 0) {
									myEmitter.emit('checkExplanationOfBenefitID');
								} else {
									res.json({
										"err_code": "500",
										"err_msg": "Benefit balance financial type code not found"
									});
								}
							})
						} else {
							myEmitter.emit('checkExplanationOfBenefitID');
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
