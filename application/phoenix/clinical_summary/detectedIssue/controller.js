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
		detectedIssue: function getDetectedIssue(req, res){
			var apikey = req.params.apikey;
			var detectedIssueId = req.query._id;
			var author = req.params.author;
			var category = req.params.category;
			var date = req.params.date;
			var identifier = req.params.identifier;
			var implicated = req.params.implicated;
			var patient = req.params.patient;
			
      //susun query
      var condition = "";
      var join = "";
			
			if(typeof detectedIssueId !== 'undefined' && detectedIssueId !== ""){
        condition += "di.DETECTED_ISSUE_ID = '" + detectedIssueId + "' AND,";  
      }
			
			if(typeof author !== 'undefined' && author !== ""){
				condition += "(di.AUTHOR_PRACTITIONER = '" + author + "' OR di.AUTHOR_DEVICE = '" + author + "') AND,";  
			}
			
			if(typeof category !== 'undefined' && category !== ""){
        condition += "di.category = '" + category + "' AND,";  
      }
			
			if(typeof date !== 'undefined' && date !== ""){
        condition += "di.DATE <= to_date('" + date + "', 'yyyy-MM-dd') AND,";  
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on di.DETECTED_ISSUE_ID = i.DETECTED_ISSUE_ID ";
        condition += "i.IDENTIFIER_ID = '" + identifier + "' AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "di.PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof implicated !== 'undefined' && implicated !== ""){
        condition += "di.IMPLICATED = '" + implicated + "' AND,";  
      }
			
			var offset = req.query.offset;
			var limit = req.query.limit;

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " di.detected_issue_id > '" + offset + "' AND ";       
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
			      
      var arrDetectedIssue = [];
      var query = "select di.detected_issue_id as detected_issue_id, di.status as status, di.category as category, di.severity as severity, di.patient as patient, di.date as date, di.author_practitioner as author_practitioner, di.author_device as author_device, di.implicated as implicated, di.detail as detail, di.reference as reference from baciro_fhir.detected_issue di " + fixCondition + limit;
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var DetectedIssue = {};
					DetectedIssue.resourceType = "DetectedIssue";
          DetectedIssue.id = rez[i].detected_issue_id;
					DetectedIssue.status = rez[i].status;
					DetectedIssue.category = rez[i].category;
					DetectedIssue.severity = rez[i].severity;
					if(rez[i].patient != "null"){
						DetectedIssue.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient;
					} else {
						DetectedIssue.patient = "";
					}
					if(rez[i].date == null){
						DetectedIssue.date = formatDate(rez[i].date);
					}else{
						DetectedIssue.date = rez[i].date;
					}
					var Author = {};
					if(rez[i].author_practitioner != "null"){
						Author.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].author_practitioner;
					} else {
						Author.practitioner = "";
					}
					if(rez[i].author_device != "null"){
						Author.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].author_device;
					} else {
						Author.device = "";
					}
					DetectedIssue.author = Author;
					DetectedIssue.implicated = rez[i].implicated;
					DetectedIssue.detail = rez[i].detail;
					DetectedIssue.reference = rez[i].reference;
          arrDetectedIssue[i] = DetectedIssue;
        }
        res.json({"err_code":0,"data": arrDetectedIssue});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getDetectedIssue"});
      });
    },
		detectedIssueMitigation: function getDetectedIssueMitigation(req, res) {
			var apikey = req.params.apikey;
			
			var detectedIssueMitigationId = req.query._id;
			var detectedIssueId = req.query.detected_issue_id;

			//susun query
			var condition = "";

			if (typeof detectedIssueMitigationId !== 'undefined' && detectedIssueMitigationId !== "") {
				condition += "MITIGATION_ID = '" + detectedIssueMitigationId + "' AND ";
			}

			if (typeof detectedIssueId !== 'undefined' && detectedIssueId !== "") {
				condition += "DETECTED_ISSUE_ID = '" + detectedIssueId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrDetectedIssueMitigation = [];
			var query = "select  mitigation_id, action, date, author, detected_issue_id from baciro_fhir.detected_issue_mitigation " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var DetectedIssueMitigation = {};
					DetectedIssueMitigation.id = rez[i].mitigation_id;
					DetectedIssueMitigation.action = rez[i].action;
					if(rez[i].date == null){
						DetectedIssueMitigation.date = formatDate(rez[i].date);
					}else{
						DetectedIssueMitigation.date = rez[i].date;
					}
					if(rez[i].author != "null"){
						DetectedIssueMitigation.author = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].author;
					} else {
						DetectedIssueMitigation.author = "";
					}
					arrDetectedIssueMitigation[i] = DetectedIssueMitigation;
				}
				res.json({
					"err_code": 0,
					"data": arrDetectedIssueMitigation
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getDetectedIssueMitigation"
				});
			});
		}
		
  },
	post: {
		detectedIssue: function addDetectedIssue(req, res) {
			console.log(req.body);
			var detected_issue_id = req.body.detected_issue_id;
			var status = req.body.status;
			var category = req.body.category;
			var severity = req.body.severity;
			var patient = req.body.patient;
			var date = req.body.date;
			var author_practitioner = req.body.author_practitioner;
			var author_device = req.body.author_device;
			var implicated = req.body.implicated;
			var detail = req.body.detail;
			var reference = req.body.reference;
			
			var medication_dispense_id = req.body.medication_dispense_id;
			var medication_request_id = req.body.medication_request_id;
			
			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }	
			
			if (typeof severity !== 'undefined' && severity !== "") {
        column += 'severity,';
        values += "'" + severity + "',";
      }	
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof author_practitioner !== 'undefined' && author_practitioner !== "") {
        column += 'author_practitioner,';
        values += "'" + author_practitioner + "',";
      }	
			
			if (typeof author_device !== 'undefined' && author_device !== "") {
        column += 'author_device,';
        values += "'" + author_device + "',";
      }	
			
			if (typeof implicated !== 'undefined' && implicated !== "") {
        column += 'implicated,';
        values += "'" + implicated + "',";
      }	
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof detail !== 'undefined' && detail !== "") {
        column += 'detail,';
        values += "'" + detail + "',";
      }	
			
			if (typeof reference !== 'undefined' && reference !== "") {
        column += 'reference,';
        values += "'" + reference + "',";
      }
			
			if (typeof medication_dispense_id !== 'undefined' && medication_dispense_id !== "") {
        column += 'medication_dispense_id,';
        values += "'" + medication_dispense_id + "',";
      }
			
			if (typeof medication_request_id !== 'undefined' && medication_request_id !== "") {
        column += 'medication_request_id,';
        values += "'" + medication_request_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.detected_issue(detected_issue_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+detected_issue_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select detected_issue_id, status, category, severity, patient, date, author_practitioner, author_device, implicated, detail, reference from baciro_fhir.detected_issue WHERE detected_issue_id = '" + detected_issue_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDetectedIssue"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDetectedIssue"});
      });
    },
		detectedIssueMitigation: function addDetectedIssueMitigation(req, res) {
			console.log(req.body);
			var mitigation_id  = req.body.mitigation_id;
			var action  = req.body.action;
			var date  = req.body.date;
			var author  = req.body.author;
			var detected_issue_id  = req.body.detected_issue_id;

			var column = "";
      var values = "";
			
			if (typeof action !== 'undefined' && action !== "") {
        column += 'action,';
        values += "'" + action + "',";
      }
			
			if (typeof author !== 'undefined' && author !== "") {
        column += 'author,';
        values += "'" + author + "',";
      }
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof detected_issue_id !== 'undefined' && detected_issue_id !== "") {
        column += 'detected_issue_id,';
        values += "'" + detected_issue_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.detected_issue_mitigation(mitigation_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+mitigation_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select  mitigation_id, action, date, author, detected_issue_id from baciro_fhir.detected_issue_mitigation WHERE mitigation_id = '" + mitigation_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDetectedIssueMitigation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDetectedIssueMitigation"});
      });
    }
		
	},
	put: {
		detectedIssue: function updateDetectedIssue(req, res) {
			console.log(req.body);
			var detected_issue_id = req.params._id;
			var status = req.body.status;
			var category = req.body.category;
			var severity = req.body.severity;
			var patient = req.body.patient;
			var date = req.body.date;
			var author_practitioner = req.body.author_practitioner;
			var author_device = req.body.author_device;
			var implicated = req.body.implicated;
			var detail = req.body.detail;
			var reference = req.body.reference;
			var medication_dispense_id = req.body.medication_dispense_id;
			var medication_request_id = req.body.medication_request_id;
      
			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }	
			
			if (typeof severity !== 'undefined' && severity !== "") {
        column += 'severity,';
        values += "'" + severity + "',";
      }	
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof author_practitioner !== 'undefined' && author_practitioner !== "") {
        column += 'author_practitioner,';
        values += "'" + author_practitioner + "',";
      }	
			
			if (typeof author_device !== 'undefined' && author_device !== "") {
        column += 'author_device,';
        values += "'" + author_device + "',";
      }	
			
			if (typeof implicated !== 'undefined' && implicated !== "") {
        column += 'implicated,';
        values += "'" + implicated + "',";
      }	
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof detail !== 'undefined' && detail !== "") {
        column += 'detail,';
        values += "'" + detail + "',";
      }	
			
			if (typeof reference !== 'undefined' && reference !== "") {
        column += 'reference,';
        values += "'" + reference + "',";
      }	
			
			if (typeof medication_dispense_id !== 'undefined' && medication_dispense_id !== "") {
        column += 'medication_dispense_id,';
        values += "'" + medication_dispense_id + "',";
      }
			
			if (typeof medication_request_id !== 'undefined' && medication_request_id !== "") {
        column += 'medication_request_id,';
        values += "'" + medication_request_id + "',";
      }
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "detected_issue_id = '" + detected_issue_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "detected_issue_id = '" + detected_issue_id+ "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.detected_issue(detected_issue_id," + column.slice(0, -1) + ") SELECT detected_issue_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.detected_issue WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select detected_issue_id, status, category, severity, patient, date, author_practitioner, author_device, implicated, detail, reference from baciro_fhir.detected_issue WHERE detected_issue_id = '" + detected_issue_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDetectedIssue"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDetectedIssue"});
      });
    },
		detectedIssueMitigation: function updateDetectedIssueMitigation(req, res) {
			console.log(req.body);
			var mitigation_id  = req.params._id;
			var action  = req.body.action;
			var date  = req.body.date;
			var author  = req.body.author;
			var detected_issue_id  = req.body.detected_issue_id;

			var column = "";
      var values = "";
			
			if (typeof action !== 'undefined' && action !== "") {
        column += 'action,';
        values += "'" + action + "',";
      }
			
			if (typeof author !== 'undefined' && author !== "") {
        column += 'author,';
        values += "'" + author + "',";
      }
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof detected_issue_id !== 'undefined' && detected_issue_id !== "") {
        column += 'detected_issue_id,';
        values += "'" + detected_issue_id + "',";
      }	

     
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "mitigation_id = '" + mitigation_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "mitigation_id = '" + mitigation_id+ "'";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.detected_issue_mitigation(mitigation_id," + column.slice(0, -1) + ") SELECT mitigation_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.detected_issue_mitigation WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select  mitigation_id, action, date, author, detected_issue_id from baciro_fhir.detected_issue_mitigation WHERE mitigation_id = '" + mitigation_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDetectedIssueMitigation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDetectedIssueMitigation"});
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