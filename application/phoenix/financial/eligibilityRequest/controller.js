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
		eligibilityRequest: function getEligibilityRequest(req, res){
			var apikey = req.params.apikey;
			var condition = "";
      var join = "";
			var offset = req.query.offset;
			var limit = req.query.limit;
			var eligibilityRequestId = req.query._id;
			var created = req.query.created;
			var enterer = req.query.enterer;
			var facility = req.query.facility;
			var identifier = req.query.identifier;
			var organization = req.query.organization;
			var patient = req.query.patient;
			var provider = req.query.provider;
			//susun query
			
			if (typeof created !== 'undefined' && created !== "") {
        condition += "egr.created = to_date('" + created + "', 'yyyy-MM-dd') AND ";
      }
			
			if(typeof enterer !== 'undefined' && enterer !== ""){
				condition += "egr.enterer = '" + enterer + "' AND,";  
      }
			
			if(typeof facility !== 'undefined' && facility !== ""){
				condition += "egr.facility = '" + facility + "' AND,";  
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.eligibility_request_id = egr.eligibility_request_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
      
			if(typeof organization !== 'undefined' && organization !== ""){
				condition += "egr.organization = '" + organization + "' AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
				condition += "egr.patient = '" + patient + "' AND,";  
      }
			
			if(typeof provider !== 'undefined' && provider !== ""){
				condition += "egr.provider = '" + provider + "' AND,";  
      }

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " egr.eligibility_request_id > '" + offset + "' AND ";       
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

      var arrEligibilityRequest = [];
      var query = "select  egr.eligibility_request_id as eligibility_request_id, egr.status as status, egr.priority as priority, egr.patient as patient, egr.serviced_date as serviced_date, egr.serviced_period_start as serviced_period_start, egr.serviced_period_end as serviced_period_end, egr.created as created, egr.entered as entered, egr.provider as provider, egr.organization as organization, egr.insurer as insurer, egr.facility as facility, egr.coverage as coverage, egr.business_arrangement as business_arrangement, egr.benefit_category as benefit_category, egr.benefit_sub_category as benefit_sub_category from BACIRO_FHIR.eligibility_request egr " + fixCondition + limit; 
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var EligibilityRequest = {};
					EligibilityRequest.resourceType = "EligibilityRequest";
          EligibilityRequest.id = rez[i].eligibility_request_id;
					EligibilityRequest.status = rez[i].status;
					EligibilityRequest.priority = rez[i].priority;
					if(rez[i].patient != "null"){
						EligibilityRequest.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient;
					} else {
						EligibilityRequest.patient = "";
					}
					var Serviced = {};
					if(rez[i].serviced_date == null){
						Serviced.servicedDate = formatDate(rez[i].serviced_date);  
					}else{
						Serviced.servicedDate = rez[i].serviced_date;  
					}
					var periodStart,periodEnd;
					if(rez[i].serviced_period_start == null){
						periodStart = formatDate(rez[i].serviced_period_start);  
					}else{
						periodStart = rez[i].serviced_period_start;  
					}
					if(rez[i].serviced_period_end == null){
						periodEnd = formatDate(rez[i].serviced_period_end);  
					}else{
						periodEnd = rez[i].serviced_period_end;  
					}
					Serviced.servicedPeriod = periodStart + ' to ' + periodEnd;					
					EligibilityRequest.serviced = Serviced;
					if(rez[i].created == null){
						EligibilityRequest.created = formatDate(rez[i].created);  
					}else{
						EligibilityRequest.created = rez[i].created;  
					}
					if(rez[i].entered != "null"){
						EligibilityRequest.entered = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].entered;
					} else {
						EligibilityRequest.entered = "";
					}
					if(rez[i].provider != "null"){
						EligibilityRequest.provider = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].provider;
					} else {
						EligibilityRequest.provider = "";
					}
					if(rez[i].organization != "null"){
						EligibilityRequest.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].organization;
					} else {
						EligibilityRequest.organization = "";
					}
					if(rez[i].insurer != "null"){
						EligibilityRequest.insurer = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].insurer;
					} else {
						EligibilityRequest.insurer = "";
					}
					if(rez[i].facility != "null"){
						EligibilityRequest.facility = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].facility;
					} else {
						EligibilityRequest.facility = "";
					}
					if(rez[i].coverage != "null"){
						EligibilityRequest.coverage = hostFHIR + ':' + portFHIR + '/' + apikey + '/Coverage?_id=' +  rez[i].coverage;
					} else {
						EligibilityRequest.coverage = "";
					}
					EligibilityRequest.businessArrangement = rez[i].business_arrangement;
					EligibilityRequest.benefitCategory = rez[i].benefit_category;
					EligibilityRequest.benefitSubCategory = rez[i].benefit_sub_category;		
	
          arrEligibilityRequest[i] = EligibilityRequest;
        }
        res.json({"err_code":0,"data": arrEligibilityRequest});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getEligibilityRequest"});
      });
    }
  },
	post: {
		eligibilityRequest: function addEligibilityRequest(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var eligibility_request_id = req.body.eligibility_request_id;
			var status  = req.body.status;
			var priority  = req.body.priority;
			var patient  = req.body.patient;
			var serviced_date  = req.body.serviced_date;
			var serviced_period_start  = req.body.serviced_period_start;
			var serviced_period_end  = req.body.serviced_period_end;
			var created  = req.body.created;
			var entered  = req.body.entered;
			var provider  = req.body.provider;
			var organization  = req.body.organization;
			var insurer  = req.body.insurer;
			var facility  = req.body.facility;
			var coverage  = req.body.coverage;
			var business_arrangement  = req.body.business_arrangement;
			var benefit_category  = req.body.benefit_category;
			var benefit_sub_category  = req.body.benefit_sub_category;
			var eligibility_response_id  = req.body.eligibility_response_id;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof priority !== 'undefined' && priority !== "") {
				column += 'priority,';
				values += " '" + priority +"',";
			}

			if (typeof patient !== 'undefined' && patient !== "") {
				column += 'patient,';
				values += " '" + patient +"',";
			}

			if (typeof  serviced_date !== 'undefined' &&  serviced_date !== "") {
				column += ' serviced_date,';
				values += "to_date('"+  serviced_date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  serviced_period_start !== 'undefined' &&  serviced_period_start !== "") {
				column += ' serviced_period_start,';
				values += "to_date('"+  serviced_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  serviced_period_end !== 'undefined' &&  serviced_period_end !== "") {
				column += ' serviced_period_end,';
				values += "to_date('"+  serviced_period_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof entered !== 'undefined' && entered !== "") {
				column += 'entered,';
				values += " '" + entered +"',";
			}

			if (typeof provider !== 'undefined' && provider !== "") {
				column += 'provider,';
				values += " '" + provider +"',";
			}

			if (typeof organization !== 'undefined' && organization !== "") {
				column += 'organization,';
				values += " '" + organization +"',";
			}

			if (typeof insurer !== 'undefined' && insurer !== "") {
				column += 'insurer,';
				values += " '" + insurer +"',";
			}

			if (typeof facility !== 'undefined' && facility !== "") {
				column += 'facility,';
				values += " '" + facility +"',";
			}

			if (typeof coverage !== 'undefined' && coverage !== "") {
				column += 'coverage,';
				values += " '" + coverage +"',";
			}

			if (typeof business_arrangement !== 'undefined' && business_arrangement !== "") {
				column += 'business_arrangement,';
				values += " '" + business_arrangement +"',";
			}

			if (typeof benefit_category !== 'undefined' && benefit_category !== "") {
				column += 'benefit_category,';
				values += " '" + benefit_category +"',";
			}

			if (typeof benefit_sub_category !== 'undefined' && benefit_sub_category !== "") {
				column += 'benefit_sub_category,';
				values += " '" + benefit_sub_category +"',";
			}

			if (typeof eligibility_response_id !== 'undefined' && eligibility_response_id !== "") {
				column += 'eligibility_response_id,';
				values += " '" + eligibility_response_id +"',";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.eligibility_request(eligibility_request_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+eligibility_request_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select eligibility_request_id from BACIRO_FHIR.eligibility_request WHERE eligibility_request_id = '" + eligibility_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEligibilityRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEligibilityRequest"});
      });
    }
	},
	put: {
		eligibilityRequest: function updateEligibilityRequest(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var eligibility_request_id  = req.params._id;
			var status  = req.body.status;
			var priority  = req.body.priority;
			var patient  = req.body.patient;
			var serviced_date  = req.body.serviced_date;
			var serviced_period_start  = req.body.serviced_period_start;
			var serviced_period_end  = req.body.serviced_period_end;
			var created  = req.body.created;
			var entered  = req.body.entered;
			var provider  = req.body.provider;
			var organization  = req.body.organization;
			var insurer  = req.body.insurer;
			var facility  = req.body.facility;
			var coverage  = req.body.coverage;
			var business_arrangement  = req.body.business_arrangement;
			var benefit_category  = req.body.benefit_category;
			var benefit_sub_category  = req.body.benefit_sub_category;
			var eligibility_response_id  = req.body.eligibility_response_id;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof priority !== 'undefined' && priority !== "") {
				column += 'priority,';
				values += " '" + priority +"',";
			}

			if (typeof patient !== 'undefined' && patient !== "") {
				column += 'patient,';
				values += " '" + patient +"',";
			}

			if (typeof  serviced_date !== 'undefined' &&  serviced_date !== "") {
				column += ' serviced_date,';
				values += "to_date('"+  serviced_date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  serviced_period_start !== 'undefined' &&  serviced_period_start !== "") {
				column += ' serviced_period_start,';
				values += "to_date('"+  serviced_period_start + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  serviced_period_end !== 'undefined' &&  serviced_period_end !== "") {
				column += ' serviced_period_end,';
				values += "to_date('"+  serviced_period_end + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof entered !== 'undefined' && entered !== "") {
				column += 'entered,';
				values += " '" + entered +"',";
			}

			if (typeof provider !== 'undefined' && provider !== "") {
				column += 'provider,';
				values += " '" + provider +"',";
			}

			if (typeof organization !== 'undefined' && organization !== "") {
				column += 'organization,';
				values += " '" + organization +"',";
			}

			if (typeof insurer !== 'undefined' && insurer !== "") {
				column += 'insurer,';
				values += " '" + insurer +"',";
			}

			if (typeof facility !== 'undefined' && facility !== "") {
				column += 'facility,';
				values += " '" + facility +"',";
			}

			if (typeof coverage !== 'undefined' && coverage !== "") {
				column += 'coverage,';
				values += " '" + coverage +"',";
			}

			if (typeof business_arrangement !== 'undefined' && business_arrangement !== "") {
				column += 'business_arrangement,';
				values += " '" + business_arrangement +"',";
			}

			if (typeof benefit_category !== 'undefined' && benefit_category !== "") {
				column += 'benefit_category,';
				values += " '" + benefit_category +"',";
			}

			if (typeof benefit_sub_category !== 'undefined' && benefit_sub_category !== "") {
				column += 'benefit_sub_category,';
				values += " '" + benefit_sub_category +"',";
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
				var condition = "eligibility_request_id = '" + eligibility_request_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "eligibility_request_id = '" + eligibility_request_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.eligibility_request(eligibility_request_id," + column.slice(0, -1) + ") SELECT eligibility_request_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.eligibility_request WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select eligibility_request_id from BACIRO_FHIR.eligibility_request WHERE eligibility_request_id = '" + eligibility_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateEligibilityRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateEligibilityRequest"});
      });
    }
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
