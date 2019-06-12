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
		enrollmentResponse: function getEnrollmentResponse(req, res){
			var apikey = req.params.apikey;
			var condition = "";
      var join = "";
			var offset = req.query.offset;
			var limit = req.query.limit;
			var enrollmentResponseId = req.query._id;
			var identifier = req.query.identifier;
			var organization = req.query.organization;
			var request = req.query.request;
			//susun query
			
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.enrollment_response_id = erp.enrollment_response_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
      
			if(typeof organization !== 'undefined' && organization !== ""){
				condition += "erp.organization = '" + organization + "' AND,";  
      }
			
			if(typeof request !== 'undefined' && request !== ""){
				condition += "erp.request = '" + request + "' AND,";  
      }
			

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " erp.enrollment_response_id > '" + offset + "' AND ";       
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

      var arrEnrollmentResponse = [];
      var query = "select erp.enrollment_response_id as enrollment_response_id, erp.status as status, erp.request as request, erp.outcome as outcome, erp.disposition as disposition, erp.created as created, erp.organization as organization, erp.request_provider as request_provider, erp.request_organization as request_organization  from BACIRO_FHIR.enrollment_response erp " + fixCondition + limit; 
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var EnrollmentResponse = {};
					EnrollmentResponse.resourceType = "EnrollmentResponse";
          EnrollmentResponse.id = rez[i].enrollment_response_id;
					EnrollmentResponse.status = rez[i].status;
					if(rez[i].request != "null"){
						EnrollmentResponse.request = hostFHIR + ':' + portFHIR + '/' + apikey + '/EnrollmentRequest?_id=' +  rez[i].request;
					} else {
						EnrollmentResponse.request = "";
					}
					EnrollmentResponse.outcome = rez[i].outcome;
					EnrollmentResponse.disposition = rez[i].disposition;
					if(rez[i].created == null){
						EnrollmentResponse.created = formatDate(rez[i].created);  
					}else{
						EnrollmentResponse.created = rez[i].created;  
					}
					if(rez[i].organization != "null"){
						EnrollmentResponse.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].organization;
					} else {
						EnrollmentResponse.organization = "";
					}
					if(rez[i].request_provider != "null"){
						EnrollmentResponse.requestProvider = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].request_provider;
					} else {
						EnrollmentResponse.requestProvider = "";
					}
					if(rez[i].request_organization != "null"){
						EnrollmentResponse.requestOrganization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].request_organization;
					} else {
						EnrollmentResponse.requestOrganization = "";
					}
	
          arrEnrollmentResponse[i] = EnrollmentResponse;
        }
        res.json({"err_code":0,"data": arrEnrollmentResponse});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getEnrollmentResponse"});
      });
    }
  },
	post: {
		enrollmentResponse: function addEnrollmentResponse(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var enrollment_response_id  = req.body.enrollment_response_id;
			var status  = req.body.status;
			var request  = req.body.request;
			var outcome  = req.body.outcome;
			var disposition  = req.body.disposition;
			var created  = req.body.created;
			var organization  = req.body.organization;
			var request_provider  = req.body.request_provider;
			var request_organization  = req.body.request_organization;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
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

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof organization !== 'undefined' && organization !== "") {
				column += 'organization,';
				values += " '" + organization +"',";
			}

			if (typeof request_provider !== 'undefined' && request_provider !== "") {
				column += 'request_provider,';
				values += " '" + request_provider +"',";
			}

			if (typeof request_organization !== 'undefined' && request_organization !== "") {
				column += 'request_organization,';
				values += " '" + request_organization +"',";
			}
			

			
			var query = "UPSERT INTO BACIRO_FHIR.enrollment_response(enrollment_response_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+enrollment_response_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select enrollment_response_id from BACIRO_FHIR.enrollment_response WHERE enrollment_response_id = '" + enrollment_response_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEnrollmentResponse"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEnrollmentResponse"});
      });
    }
	},
	put: {
		enrollmentResponse: function updateEnrollmentResponse(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var enrollment_response_id  = req.params._id;
			var status  = req.body.status;
			var request  = req.body.request;
			var outcome  = req.body.outcome;
			var disposition  = req.body.disposition;
			var created  = req.body.created;
			var organization  = req.body.organization;
			var request_provider  = req.body.request_provider;
			var request_organization  = req.body.request_organization;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
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

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof organization !== 'undefined' && organization !== "") {
				column += 'organization,';
				values += " '" + organization +"',";
			}

			if (typeof request_provider !== 'undefined' && request_provider !== "") {
				column += 'request_provider,';
				values += " '" + request_provider +"',";
			}

			if (typeof request_organization !== 'undefined' && request_organization !== "") {
				column += 'request_organization,';
				values += " '" + request_organization +"',";
			}
							
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "enrollment_response_id = '" + enrollment_response_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "enrollment_response_id = '" + enrollment_response_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.enrollment_response(enrollment_response_id," + column.slice(0, -1) + ") SELECT enrollment_response_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.enrollment_response WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select enrollment_response_id from BACIRO_FHIR.enrollment_response WHERE enrollment_response_id = '" + enrollment_response_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateEnrollmentResponse"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateEnrollmentResponse"});
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
