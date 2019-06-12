var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var path = require('path');

var configYaml = yamlconfig.readConfig(path.resolve('../../application/config/config.yml'));

//event emitter
var host = configYaml.phoenix.host;
var port = configYaml.phoenix.port;
var hostFHIR = configYaml.fhir.host;
var portFHIR = configYaml.fhir.port;
var hostHbase = configYaml.hbase.host;

// var phoenix = require("./phoenix.js");
var phoenix = require(path.resolve("./phoenix.js"));
var db = new phoenix("jdbc:phoenix:" + hostHbase + ":/hbase-unsecure");

var controller = {
	get: {
		eligibilityResponse: function getEligibilityResponse(req, res){
			var apikey = req.params.apikey;
			var condition = "";
      var join = "";
			var offset = req.query.offset;
			var limit = req.query.limit;
			var eligibilityResponseId = req.query._id;
			var created = req.query.created;
			var disposition = req.query.disposition;
			var identifier = req.query.identifier;
			var insurer = req.query.insurer;
			var outcome = req.query.outcome;
			var request = req.query.request;
			var request_organization = req.query.request_organization;
			var request_provider = req.query.request_provider;
			
			//susun query
			
			if (typeof created !== 'undefined' && created !== "") {
        condition += "ers.created = to_date('" + created + "', 'yyyy-MM-dd') AND ";
      }
			
			if(typeof disposition !== 'undefined' && disposition !== ""){
				condition += "ers.disposition = '" + disposition + "' AND,";  
      }
			
			if(typeof insurer !== 'undefined' && insurer !== ""){
				condition += "ers.insurer = '" + insurer + "' AND,";  
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.eligibility_response_id = ers.eligibility_response_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
      
			if(typeof outcome !== 'undefined' && outcome !== ""){
				condition += "ers.outcome = '" + outcome + "' AND,";  
      }
			
			if(typeof request !== 'undefined' && request !== ""){
				condition += "ers.request = '" + request + "' AND,";  
      }
			
			if(typeof request_organization !== 'undefined' && request_organization !== ""){
				condition += "ers.request_organization = '" + request_organization + "' AND,";  
      }
			
			if(typeof request_provider !== 'undefined' && request_provider !== ""){
				condition += "ers.request_provider = '" + request_provider + "' AND,";  
      }

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " ers.eligibility_response_id > '" + offset + "' AND ";       
			}
			
			if((typeof limit !== 'undefined' && limit !== '')){
				limit = " limit " + limit + " ";
			} else {
				limit = " ";
			}
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

      var arrEligibilityResponse = [];
      var query = "select ers.eligibility_response_id as eligibility_response_id, ers.status as status,ers.created as created,ers.request_provider as request_provider,ers.request_organization as request_organization,ers.request as request,ers.outcome as outcome,ers.disposition as disposition,ers.insurer as insurer,ers.inforce as inforce,ers.form as form from BACIRO_FHIR.eligibility_response ers " + fixCondition + limit; 
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var EligibilityResponse = {};
					EligibilityResponse.resourceType = "EligibilityResponse";
          EligibilityResponse.id = rez[i].eligibility_response_id;
					EligibilityResponse.status = rez[i].status;
					if(rez[i].created == null){
						EligibilityResponse.created = formatDate(rez[i].created);  
					}else{
						EligibilityResponse.created = rez[i].created;  
					}
					if(rez[i].request_provider != "null"){
						EligibilityResponse.requestProvider = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].request_provider;
					} else {
						EligibilityResponse.requestProvider = "";
					}
					if(rez[i].request_organization != "null"){
						EligibilityResponse.requestOrganization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].request_organization;
					} else {
						EligibilityResponse.requestOrganization = "";
					}
					if(rez[i].request != "null"){
						EligibilityResponse.request = hostFHIR + ':' + portFHIR + '/' + apikey + '/EligibilityRequest?_id=' +  rez[i].request;
					} else {
						EligibilityResponse.request = "";
					}
					EligibilityResponse.outcome = rez[i].outcome;		
					EligibilityResponse.disposition = rez[i].disposition;	
					if(rez[i].insurer != "null"){
						EligibilityResponse.insurer = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].insurer;
					} else {
						EligibilityResponse.insurer = "";
					}
					EligibilityResponse.inforce = rez[i].inforce;		
					EligibilityResponse.form = rez[i].form;		
	
          arrEligibilityResponse[i] = EligibilityResponse;
        }
        res.json({"err_code":0,"data": arrEligibilityResponse});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getEligibilityResponse"});
      });
    },
		eligibilityResponseInsurance: function getEligibilityResponseInsurance(req, res) {
			var apikey = req.params.apikey;
			
			var eligibilityResponseInsuranceId = req.query._id;
			var eligibilityResponseId = req.query.eligibility_response_id;

			//susun query
			var condition = "";

			if (typeof eligibilityResponseInsuranceId !== 'undefined' && eligibilityResponseInsuranceId !== "") {
				condition += "insurance_id = '" + eligibilityResponseInsuranceId + "' AND ";
			}

			if (typeof eligibilityResponseId !== 'undefined' && eligibilityResponseId !== "") {
				condition += "eligibility_response_id = '" + eligibilityResponseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrEligibilityResponseInsurance = [];
			var query = "select  insurance_id, coverage, contract from BACIRO_FHIR.eligibility_response_insurance " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var EligibilityResponseInsurance = {};
					EligibilityResponseInsurance.id = rez[i].insurance_id;
					if(rez[i].coverage != "null"){
						EligibilityResponseInsurance.coverage = hostFHIR + ':' + portFHIR + '/' + apikey + '/Coverage?_id=' +  rez[i].coverage;
					} else {
						EligibilityResponseInsurance.coverage = "";
					}
					if(rez[i].contract != "null"){
						EligibilityResponseInsurance.contract = hostFHIR + ':' + portFHIR + '/' + apikey + '/Contract?_id=' +  rez[i].contract;
					} else {
						EligibilityResponseInsurance.contract = "";
					}
					arrEligibilityResponseInsurance[i] = EligibilityResponseInsurance;
				}
				res.json({
					"err_code": 0,
					"data": arrEligibilityResponseInsurance
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEligibilityResponseInsurance"
				});
			});
		},
		eligibilityResponseBenefitBalance: function getEligibilityResponseBenefitBalance(req, res) {
			var apikey = req.params.apikey;
			
			var eligibilityResponseBenefitBalanceId = req.query._id;
			var eligibilityResponseId = req.query.eligibility_response_insure_id;

			//susun query
			var condition = "";

			if (typeof eligibilityResponseBenefitBalanceId !== 'undefined' && eligibilityResponseBenefitBalanceId !== "") {
				condition += "benefit_balance_id = '" + eligibilityResponseBenefitBalanceId + "' AND ";
			}

			if (typeof eligibilityResponseId !== 'undefined' && eligibilityResponseId !== "") {
				condition += "insurance_id = '" + eligibilityResponseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrEligibilityResponseBenefitBalance = [];
			var query = "select  benefit_balance_id, category, sub_category, excluded, name, description, network, unit, term from BACIRO_FHIR.eligibility_response_benefit_balance " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var EligibilityResponseBenefitBalance = {};
					EligibilityResponseBenefitBalance.id = rez[i].benefit_balance_id;
					EligibilityResponseBenefitBalance.category = rez[i].category;
					EligibilityResponseBenefitBalance.subCategory = rez[i].sub_category;
					EligibilityResponseBenefitBalance.excluded = rez[i].excluded;
					EligibilityResponseBenefitBalance.name = rez[i].name;
					EligibilityResponseBenefitBalance.description = rez[i].description;
					EligibilityResponseBenefitBalance.network = rez[i].network;
					EligibilityResponseBenefitBalance.unit = rez[i].unit;
					EligibilityResponseBenefitBalance.term = rez[i].term;
					arrEligibilityResponseBenefitBalance[i] = EligibilityResponseBenefitBalance;
				}
				res.json({
					"err_code": 0,
					"data": arrEligibilityResponseBenefitBalance
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEligibilityResponseBenefitBalance"
				});
			});
		},
		eligibilityResponseFinancial: function getEligibilityResponseFinancial(req, res) {
			var apikey = req.params.apikey;
			
			var eligibilityResponseFinancialId = req.query._id;
			var eligibilityResponseId = req.query.eligibility_response_benefit_balance_id;

			//susun query
			var condition = "";

			if (typeof eligibilityResponseFinancialId !== 'undefined' && eligibilityResponseFinancialId !== "") {
				condition += "financial_id = '" + eligibilityResponseFinancialId + "' AND ";
			}

			if (typeof eligibilityResponseId !== 'undefined' && eligibilityResponseId !== "") {
				condition += "benefit_balance_id = '" + eligibilityResponseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrEligibilityResponseFinancial = [];
			var query = "select financial_id, type, allowed_unsigned_int, allowed_string, allowed_money, used_unsigned_int, used_money from BACIRO_FHIR.eligibility_response_financial " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var EligibilityResponseFinancial = {};
					EligibilityResponseFinancial.id = rez[i].financial_id;
					EligibilityResponseFinancial.type = rez[i].type;
					var Allowed = {};					
					Allowed.allowedUnsignedInt = rez[i].allowed_unsigned_int;
					Allowed.allowedString = rez[i].allowed_string;
					Allowed.allowedMoney = rez[i].allowed_money;
					EligibilityResponseFinancial.allowed = Allowed;
					var Used = {};					
					Used.usedUnsignedInt = rez[i].used_unsigned_int;
					Used.usedMoney = rez[i].used_money;	
					EligibilityResponseFinancial.used = Used;
					arrEligibilityResponseFinancial[i] = EligibilityResponseFinancial;
				}
				res.json({
					"err_code": 0,
					"data": arrEligibilityResponseFinancial
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEligibilityResponseFinancial"
				});
			});
		},
		eligibilityResponseError: function getEligibilityResponseError(req, res) {
			var apikey = req.params.apikey;
			
			var eligibilityResponseErrorId = req.query._id;
			var eligibilityResponseId = req.query.eligibility_response_id;

			//susun query
			var condition = "";

			if (typeof eligibilityResponseErrorId !== 'undefined' && eligibilityResponseErrorId !== "") {
				condition += "error_id = '" + eligibilityResponseErrorId + "' AND ";
			}

			if (typeof eligibilityResponseId !== 'undefined' && eligibilityResponseId !== "") {
				condition += "eligibility_response_id = '" + eligibilityResponseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrEligibilityResponseError = [];
			var query = "select error_id, code from BACIRO_FHIR.eligibility_response_error " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var EligibilityResponseError = {};
					EligibilityResponseError.id = rez[i].error_id;
					EligibilityResponseError.code = rez[i].code;
					arrEligibilityResponseError[i] = EligibilityResponseError;
				}
				res.json({
					"err_code": 0,
					"data": arrEligibilityResponseError
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEligibilityResponseError"
				});
			});
		},
  },
	post: {
		eligibilityResponse: function addEligibilityResponse(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var eligibility_response_id = req.body.eligibility_response_id;
			var status  = req.body.status;
			var created  = req.body.created;
			var request_provider  = req.body.request_provider;
			var request_organization  = req.body.request_organization;
			var request  = req.body.request;
			var outcome  = req.body.outcome;
			var disposition  = req.body.disposition;
			var insurer  = req.body.insurer;
			var inforce  = req.body.inforce;
			var form  = req.body.form;

			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof request_provider !== 'undefined' && request_provider !== "") {
				column += 'request_provider,';
				values += " '" + request_provider +"',";
			}

			if (typeof request_organization !== 'undefined' && request_organization !== "") {
				column += 'request_organization,';
				values += " '" + request_organization +"',";
			}

			if (typeof request !== 'undefined' && request !== "") {
				column += 'request,';
				values += " '" + request +"',";
			}

			if (typeof outcome !== 'undefined' && outcome !== "") {
				column += 'outcome,';
				values += " '" + outcome +"',";
			}

			if (typeof disposition !== 'undefined' && disposition !== "") {
				column += 'disposition,';
				values += " '" + disposition +"',";
			}

			if (typeof insurer !== 'undefined' && insurer !== "") {
				column += 'insurer,';
				values += " '" + insurer +"',";
			}

			if (typeof  inforce !== 'undefined' && inforce !== "") {
				column += ' inforce,';
				values += " " + inforce +",";
			}

			if (typeof form !== 'undefined' && form !== "") {
				column += 'form,';
				values += " '" + form +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.eligibility_response(eligibility_response_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+eligibility_response_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select eligibility_response_id from BACIRO_FHIR.eligibility_response WHERE eligibility_response_id = '" + eligibility_response_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEligibilityResponse"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEligibilityResponse"});
      });
    },
		eligibilityResponseInsurance: function addEligibilityResponseInsurance(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var insurance_id = req.body.insurance_id;
			var coverage  = req.body.coverage;
			var contract  = req.body.contract;
			var eligibility_response_id  = req.body.eligibility_response_id;
			
			if (typeof coverage !== 'undefined' && coverage !== "") {
				column += 'coverage,';
				values += " '" + coverage +"',";
			}

			if (typeof contract !== 'undefined' && contract !== "") {
				column += 'contract,';
				values += " '" + contract +"',";
			}

			if (typeof eligibility_response_id !== 'undefined' && eligibility_response_id !== "") {
				column += 'eligibility_response_id,';
				values += " '" + eligibility_response_id +"',";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.eligibility_response_insurance(insurance_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+insurance_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select insurance_id from BACIRO_FHIR.eligibility_response_insurance WHERE insurance_id = '" + insurance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEligibilityResponseInsurance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEligibilityResponseInsurance"});
      });
    },
		eligibilityResponseBenefitBalance: function addEligibilityResponseBenefitBalance(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var benefit_balance_id = req.body.benefit_balance_id;
			var category  = req.body.category;
			var sub_category  = req.body.sub_category;
			var excluded  = req.body.excluded;
			var name  = req.body.name;
			var description  = req.body.description;
			var network  = req.body.network;
			var unit  = req.body.unit;
			var term  = req.body.term;
			var insurance_id  = req.body.insurance_id;
			
			if (typeof category !== 'undefined' && category !== "") {
				column += 'category,';
				values += " '" + category +"',";
			}

			if (typeof sub_category !== 'undefined' && sub_category !== "") {
				column += 'sub_category,';
				values += " '" + sub_category +"',";
			}

			if (typeof  excluded !== 'undefined' && excluded !== "") {
				column += ' excluded,';
				values += " " + excluded +",";
			}

			if (typeof name !== 'undefined' && name !== "") {
				column += 'name,';
				values += " '" + name +"',";
			}

			if (typeof description !== 'undefined' && description !== "") {
				column += 'description,';
				values += " '" + description +"',";
			}

			if (typeof network !== 'undefined' && network !== "") {
				column += 'network,';
				values += " '" + network +"',";
			}

			if (typeof unit !== 'undefined' && unit !== "") {
				column += 'unit,';
				values += " '" + unit +"',";
			}

			if (typeof term !== 'undefined' && term !== "") {
				column += 'term,';
				values += " '" + term +"',";
			}

			if (typeof insurance_id !== 'undefined' && insurance_id !== "") {
				column += 'insurance_id,';
				values += " '" + insurance_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.eligibility_response_benefit_balance(benefit_balance_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+benefit_balance_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select benefit_balance_id from BACIRO_FHIR.eligibility_response_benefit_balance WHERE benefit_balance_id = '" + benefit_balance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEligibilityResponseBenefitBalance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEligibilityResponseBenefitBalance"});
      });
    },
		eligibilityResponseFinancial: function addEligibilityResponseFinancial(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var financial_id = req.body.financial_id;
			var type  = req.body.type;
			var allowed_unsigned_int  = req.body.allowed_unsigned_int;
			var allowed_string  = req.body.allowed_string;
			var allowed_money  = req.body.allowed_money;
			var used_unsigned_int  = req.body.used_unsigned_int;
			var used_money  = req.body.used_money;
			var benefit_balance_id  = req.body.benefit_balance_id;
			
			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof allowed_unsigned_int !== 'undefined' && allowed_unsigned_int !== "") {
				column += ' allowed_unsigned_int,';
				values += " " + allowed_unsigned_int +",";
			}

			if (typeof allowed_string !== 'undefined' && allowed_string !== "") {
				column += 'allowed_string,';
				values += " '" + allowed_string +"',";
			}

			if (typeof allowed_money !== 'undefined' && allowed_money !== "") {
				column += 'allowed_money,';
				values += " '" + allowed_money +"',";
			}

			if (typeof used_unsigned_int !== 'undefined' && used_unsigned_int !== "") {
				column += ' used_unsigned_int,';
				values += " " + used_unsigned_int +",";
			}

			if (typeof used_money !== 'undefined' && used_money !== "") {
				column += 'used_money,';
				values += " '" + used_money +"',";
			}

			if (typeof benefit_balance_id !== 'undefined' && benefit_balance_id !== "") {
				column += 'benefit_balance_id,';
				values += " '" + benefit_balance_id +"',";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.eligibility_response_financial(financial_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+financial_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select financial_id from BACIRO_FHIR.eligibility_response_financial WHERE financial_id = '" + financial_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEligibilityResponseFinancial"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEligibilityResponseFinancial"});
      });
    },
		eligibilityResponseError: function addEligibilityResponseError(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var error_id = req.body.error_id;
			var code  = req.body.code;
			var eligibility_response_id  = req.body.eligibility_response_id;
			
			if (typeof code !== 'undefined' && code !== "") {
				column += 'code,';
				values += " '" + code +"',";
			}

			if (typeof eligibility_response_id !== 'undefined' && eligibility_response_id !== "") {
				column += 'eligibility_response_id,';
				values += " '" + eligibility_response_id +"',";
			}
			
			
			var query = "UPSERT INTO BACIRO_FHIR.eligibility_response_error(error_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+error_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select error_id from BACIRO_FHIR.eligibility_response_error WHERE error_id = '" + error_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEligibilityResponseError"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEligibilityResponseError"});
      });
    }
	},
	put: {
		eligibilityResponse: function updateEligibilityResponse(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var eligibility_response_id  = req.params._id;
			var status  = req.body.status;
			var created  = req.body.created;
			var request_provider  = req.body.request_provider;
			var request_organization  = req.body.request_organization;
			var request  = req.body.request;
			var outcome  = req.body.outcome;
			var disposition  = req.body.disposition;
			var insurer  = req.body.insurer;
			var inforce  = req.body.inforce;
			var form  = req.body.form;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof request_provider !== 'undefined' && request_provider !== "") {
				column += 'request_provider,';
				values += " '" + request_provider +"',";
			}

			if (typeof request_organization !== 'undefined' && request_organization !== "") {
				column += 'request_organization,';
				values += " '" + request_organization +"',";
			}

			if (typeof request !== 'undefined' && request !== "") {
				column += 'request,';
				values += " '" + request +"',";
			}

			if (typeof outcome !== 'undefined' && outcome !== "") {
				column += 'outcome,';
				values += " '" + outcome +"',";
			}

			if (typeof disposition !== 'undefined' && disposition !== "") {
				column += 'disposition,';
				values += " '" + disposition +"',";
			}

			if (typeof insurer !== 'undefined' && insurer !== "") {
				column += 'insurer,';
				values += " '" + insurer +"',";
			}

			if (typeof  inforce !== 'undefined' && inforce !== "") {
				column += ' inforce,';
				values += " " + inforce +",";
			}

			if (typeof form !== 'undefined' && form !== "") {
				column += 'form,';
				values += " '" + form +"',";
			}

			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "eligibility_response_id = '" + eligibility_response_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "eligibility_response_id = '" + eligibility_response_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.eligibility_response(eligibility_response_id," + column.slice(0, -1) + ") SELECT eligibility_response_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.eligibility_response WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select eligibility_response_id from BACIRO_FHIR.eligibility_response WHERE eligibility_response_id = '" + eligibility_response_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateEligibilityResponse"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateEligibilityResponse"});
      });
    },
		eligibilityResponseInsurance: function updateEligibilityResponseInsurance(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var insurance_id  = req.params._id;
			var coverage  = req.body.coverage;
			var contract  = req.body.contract;
			var eligibility_response_id  = req.body.eligibility_response_id;
			
			if (typeof coverage !== 'undefined' && coverage !== "") {
				column += 'coverage,';
				values += " '" + coverage +"',";
			}

			if (typeof contract !== 'undefined' && contract !== "") {
				column += 'contract,';
				values += " '" + contract +"',";
			}

			if (typeof eligibility_response_id !== 'undefined' && eligibility_response_id !== "") {
				column += 'eligibility_response_id,';
				values += " '" + eligibility_response_id +"',";
			}

							
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "insurance_id = '" + insurance_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "insurance_id = '" + insurance_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.eligibility_response_insurance(insurance_id," + column.slice(0, -1) + ") SELECT insurance_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.eligibility_response_insurance WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select insurance_id from BACIRO_FHIR.eligibility_response_insurance WHERE insurance_id = '" + insurance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateEligibilityResponseInsurance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateEligibilityResponseInsurance"});
      });
    },
		eligibilityResponseBenefitBalance: function updateEligibilityResponseBenefitBalance(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var benefit_balance_id  = req.params._id;
			var category  = req.body.category;
			var sub_category  = req.body.sub_category;
			var excluded  = req.body.excluded;
			var name  = req.body.name;
			var description  = req.body.description;
			var network  = req.body.network;
			var unit  = req.body.unit;
			var term  = req.body.term;
			var insurance_id  = req.body.insurance_id;
			
			if (typeof category !== 'undefined' && category !== "") {
				column += 'category,';
				values += " '" + category +"',";
			}

			if (typeof sub_category !== 'undefined' && sub_category !== "") {
				column += 'sub_category,';
				values += " '" + sub_category +"',";
			}

			if (typeof  excluded !== 'undefined' && excluded !== "") {
				column += ' excluded,';
				values += " " + excluded +",";
			}

			if (typeof name !== 'undefined' && name !== "") {
				column += 'name,';
				values += " '" + name +"',";
			}

			if (typeof description !== 'undefined' && description !== "") {
				column += 'description,';
				values += " '" + description +"',";
			}

			if (typeof network !== 'undefined' && network !== "") {
				column += 'network,';
				values += " '" + network +"',";
			}

			if (typeof unit !== 'undefined' && unit !== "") {
				column += 'unit,';
				values += " '" + unit +"',";
			}

			if (typeof term !== 'undefined' && term !== "") {
				column += 'term,';
				values += " '" + term +"',";
			}

			if (typeof insurance_id !== 'undefined' && insurance_id !== "") {
				column += 'insurance_id,';
				values += " '" + insurance_id +"',";
			}
							
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "benefit_balance_id = '" + benefit_balance_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "benefit_balance_id = '" + benefit_balance_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.eligibility_response_benefit_balance(benefit_balance_id," + column.slice(0, -1) + ") SELECT benefit_balance_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.eligibility_response_benefit_balance WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select benefit_balance_id from BACIRO_FHIR.eligibility_response_benefit_balance WHERE benefit_balance_id = '" + benefit_balance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateEligibilityResponseBenefitBalance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateEligibilityResponseBenefitBalance"});
      });
    },
		eligibilityResponseFinancial: function updateEligibilityResponseFinancial(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var financial_id  = req.params._id;
			var type  = req.body.type;
			var allowed_unsigned_int  = req.body.allowed_unsigned_int;
			var allowed_string  = req.body.allowed_string;
			var allowed_money  = req.body.allowed_money;
			var used_unsigned_int  = req.body.used_unsigned_int;
			var used_money  = req.body.used_money;
			var benefit_balance_id  = req.body.benefit_balance_id;
			
			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof allowed_unsigned_int !== 'undefined' && allowed_unsigned_int !== "") {
				column += ' allowed_unsigned_int,';
				values += " " + allowed_unsigned_int +",";
			}

			if (typeof allowed_string !== 'undefined' && allowed_string !== "") {
				column += 'allowed_string,';
				values += " '" + allowed_string +"',";
			}

			if (typeof allowed_money !== 'undefined' && allowed_money !== "") {
				column += 'allowed_money,';
				values += " '" + allowed_money +"',";
			}

			if (typeof used_unsigned_int !== 'undefined' && used_unsigned_int !== "") {
				column += ' used_unsigned_int,';
				values += " " + used_unsigned_int +",";
			}

			if (typeof used_money !== 'undefined' && used_money !== "") {
				column += 'used_money,';
				values += " '" + used_money +"',";
			}

			if (typeof benefit_balance_id !== 'undefined' && benefit_balance_id !== "") {
				column += 'benefit_balance_id,';
				values += " '" + benefit_balance_id +"',";
			}
							
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "financial_id = '" + financial_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "financial_id = '" + financial_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.eligibility_response_financial(financial_id," + column.slice(0, -1) + ") SELECT financial_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.eligibility_response_financial WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select financial_id from BACIRO_FHIR.eligibility_response_financial WHERE financial_id = '" + financial_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateEligibilityResponseFinancial"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateEligibilityResponseFinancial"});
      });
    },
		eligibilityResponseError: function updateEligibilityResponseError(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var error_id  = req.params._id;
			var code  = req.body.code;
			var eligibility_response_id  = req.body.eligibility_response_id;
			
			if (typeof code !== 'undefined' && code !== "") {
				column += 'code,';
				values += " '" + code +"',";
			}

			if (typeof eligibility_response_id !== 'undefined' && eligibility_response_id !== "") {
				column += 'eligibility_response_id,';
				values += " '" + eligibility_response_id +"',";
			}
							
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "error_id = '" + error_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "error_id = '" + error_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.eligibility_response_error(error_id," + column.slice(0, -1) + ") SELECT error_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.eligibility_response_error WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select error_id from BACIRO_FHIR.eligibility_response_error WHERE error_id = '" + error_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateEligibilityResponseError"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateEligibilityResponseError"});
      });
    },
	}
}
function lowercaseObject(jsonData){
  var rez = [];
  for(i=0; i < jsonData.length; i++){
    json = JSON.stringify(jsonData[i]);
    json2 = json.replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');});
    rez[i] = JSON.parse(json2);
  }
  return rez;
}

function checkApikey(apikey){
  var query = "SELECT user_id FROM baciro.user WHERE user_apikey = '"+ apikey +"' ";

  db.query(query,function(dataJson){
    rez = lowercaseObject(dataJson);
    return rez;
  },function(e){
    return {"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "checkApikey"};
  });
}

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

module.exports = controller;
