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
		enrollmentRequest: function getEnrollmentRequest(req, res){
			var apikey = req.params.apikey;
			var condition = "";
      var join = "";
			var offset = req.query.offset;
			var limit = req.query.limit;
			var enrollmentRequestId = req.query._id;
			var identifier = req.query.identifier;
			var organization = req.query.organization;
			var patient = req.query.patient;
			var subject = req.query.subject;
			//susun query
			
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.enrollment_request_id = elr.enrollment_request_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
      
			if(typeof organization !== 'undefined' && organization !== ""){
				condition += "elr.organization = '" + organization + "' AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
				condition += "elr.subject = '" + patient + "' AND,";  
      }
			
			if(typeof subject !== 'undefined' && subject !== ""){
				condition += "elr.subject = '" + subject + "' AND,";  
      }

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " elr.enrollment_request_id > '" + offset + "' AND ";       
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

      var arrEnrollmentRequest = [];
      var query = "select elr.enrollment_request_id as enrollment_request_id, elr.status as status, elr.created as created, elr.insurer as insurer, elr.provider as provider, elr.organization as organization, elr.subject as subject, elr.coverage as coverage from BACIRO_FHIR.enrollment_request elr " + fixCondition + limit; 
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var EnrollmentRequest = {};
					EnrollmentRequest.resourceType = "EnrollmentRequest";
          EnrollmentRequest.id = rez[i].enrollment_request_id;
					EnrollmentRequest.status = rez[i].status;
					if(rez[i].created == null){
						EnrollmentRequest.created = formatDate(rez[i].created);  
					}else{
						EnrollmentRequest.created = rez[i].created;  
					}
					if(rez[i].insurer != "null"){
						EnrollmentRequest.insurer = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].insurer;
					} else {
						EnrollmentRequest.insurer = "";
					}
					if(rez[i].provider != "null"){
						EnrollmentRequest.provider = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].provider;
					} else {
						EnrollmentRequest.provider = "";
					}
					if(rez[i].organization != "null"){
						EnrollmentRequest.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].organization;
					} else {
						EnrollmentRequest.organization = "";
					}
					if(rez[i].subject != "null"){
						EnrollmentRequest.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subject;
					} else {
						EnrollmentRequest.subject = "";
					}
					if(rez[i].coverage != "null"){
						EnrollmentRequest.coverage = hostFHIR + ':' + portFHIR + '/' + apikey + '/Coverage?_id=' +  rez[i].coverage;
					} else {
						EnrollmentRequest.coverage = "";
					}
	
          arrEnrollmentRequest[i] = EnrollmentRequest;
        }
        res.json({"err_code":0,"data": arrEnrollmentRequest});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getEnrollmentRequest"});
      });
    }
  },
	post: {
		enrollmentRequest: function addEnrollmentRequest(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var enrollment_request_id  = req.body.enrollment_request_id;
			var status  = req.body.status;
			var created  = req.body.created;
			var insurer  = req.body.insurer;
			var provider  = req.body.provider;
			var organization  = req.body.organization;
			var subject  = req.body.subject;
			var coverage  = req.body.coverage;
			var enrollment_response_id  = req.body.enrollment_response_id;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof insurer !== 'undefined' && insurer !== "") {
				column += 'insurer,';
				values += " '" + insurer +"',";
			}

			if (typeof provider !== 'undefined' && provider !== "") {
				column += 'provider,';
				values += " '" + provider +"',";
			}

			if (typeof organization !== 'undefined' && organization !== "") {
				column += 'organization,';
				values += " '" + organization +"',";
			}

			if (typeof subject !== 'undefined' && subject !== "") {
				column += 'subject,';
				values += " '" + subject +"',";
			}

			if (typeof coverage !== 'undefined' && coverage !== "") {
				column += 'coverage,';
				values += " '" + coverage +"',";
			}

			if (typeof enrollment_response_id !== 'undefined' && enrollment_response_id !== "") {
				column += 'enrollment_response_id,';
				values += " '" + enrollment_response_id +"',";
			}

			
			var query = "UPSERT INTO BACIRO_FHIR.enrollment_request(enrollment_request_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+enrollment_request_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select enrollment_request_id from BACIRO_FHIR.enrollment_request WHERE enrollment_request_id = '" + enrollment_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEnrollmentRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEnrollmentRequest"});
      });
    }
	},
	put: {
		enrollmentRequest: function updateEnrollmentRequest(req, res) {
			console.log(req.body);
			var column = "";
      var values = "";
			var enrollment_request_id  = req.params._id;
			var status  = req.body.status;
			var created  = req.body.created;
			var insurer  = req.body.insurer;
			var provider  = req.body.provider;
			var organization  = req.body.organization;
			var subject  = req.body.subject;
			var coverage  = req.body.coverage;
			var enrollment_response_id  = req.body.enrollment_response_id;
			
			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof  created !== 'undefined' &&  created !== "") {
				column += ' created,';
				values += "to_date('"+  created + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof insurer !== 'undefined' && insurer !== "") {
				column += 'insurer,';
				values += " '" + insurer +"',";
			}

			if (typeof provider !== 'undefined' && provider !== "") {
				column += 'provider,';
				values += " '" + provider +"',";
			}

			if (typeof organization !== 'undefined' && organization !== "") {
				column += 'organization,';
				values += " '" + organization +"',";
			}

			if (typeof subject !== 'undefined' && subject !== "") {
				column += 'subject,';
				values += " '" + subject +"',";
			}

			if (typeof coverage !== 'undefined' && coverage !== "") {
				column += 'coverage,';
				values += " '" + coverage +"',";
			}

			if (typeof enrollment_response_id !== 'undefined' && enrollment_response_id !== "") {
				column += 'enrollment_response_id,';
				values += " '" + enrollment_response_id +"',";
			}

							
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "enrollment_request_id = '" + enrollment_request_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "enrollment_request_id = '" + enrollment_request_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.enrollment_request(enrollment_request_id," + column.slice(0, -1) + ") SELECT enrollment_request_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.enrollment_request WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select enrollment_request_id from BACIRO_FHIR.enrollment_request WHERE enrollment_request_id = '" + enrollment_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateEnrollmentRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateEnrollmentRequest"});
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
