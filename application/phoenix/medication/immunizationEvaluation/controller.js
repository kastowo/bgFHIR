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
		immunizationEvaluation: function getImmunizationEvaluation(req, res){
			var apikey = req.params.apikey;
			var immunizationEvaluationId = req.query.immunizationEvaluationId;
			var date = req.query.date;
			var doseStatus = req.query.doseStatus;
			var identifier = req.query.identifier;
			var immunizationEvent = req.query.immunizationEvent;
			var patient = req.query.patient;
			var status = req.query.status;
			var targetDisease = req.query.targetDisease;
			
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof immunizationEvaluationId !== 'undefined' && immunizationEvaluationId !== ""){
        condition += "ie.IMMUNIZATION_EVALUATION_ID = '" + immunizationEvaluationId + "' AND,";  
      }
			
			if (typeof date !== 'undefined' && date !== "") {
        condition += "ie.DATE == to_date('" + date + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof doseStatus !== 'undefined' && doseStatus !== ""){
        condition += "ie.doseStatus = '" + doseStatus + "' AND,";  
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on ie.IMMUNIZATION_EVALUATION_ID = i.IMMUNIZATION_EVALUATION_ID ";
        condition += "i.identifier_value = '" + identifier + "' AND,";  
      }
			
			if(typeof immunizationEvent !== 'undefined' && immunizationEvent !== ""){
        condition += "ie.immunizationEvent = '" + immunizationEvent + "' AND,";  
      }
			
			if(typeof status !== 'undefined' && status !== ""){
        condition += "ie.status = " + status + " AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "im.PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof targetDisease !== 'undefined' && targetDisease !== ""){
        condition += "ie.targetDisease = '" + targetDisease + "' AND,";  
      }
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrImmunizationEvaluation = [];
      var query = "select ie.immunization_evaluation_id as immunization_evaluation_id, ie.status as status, ie.patient as patient, ie.date as date, ie.authority as authority, ie.targetDisease as targetDisease, ie.immunizationEvent as immunizationEvent, ie.doseStatus as doseStatus, ie.doseStatusReason as doseStatusReason, ie.description as description, ie.series as series, ie.doseNumberPositiveInt as doseNumberPositiveInt, ie.doseNumberString as doseNumberString, ie.seriesDosesPositiveInt as seriesDosesPositiveInt, ie.seriesDosesString as seriesDosesString from BACIRO_FHIR.IMMUNIZATION_EVALUATION ie " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var ImmunizationEvaluation = {};
					ImmunizationEvaluation.resourceType = "ImmunizationEvaluation";
          ImmunizationEvaluation.id = rez[i].immunization_evaluation_id;
					if (rez[i].patient !== 'null') {
						ImmunizationEvaluation.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' + rez[i].patient;
					} else {
						ImmunizationEvaluation.patient = "";
					}
					if(rez[i].date == null){
						ImmunizationEvaluation.date = formatDate(rez[i].date);
					}else{
						ImmunizationEvaluation.date = rez[i].date;
					}
					if (rez[i].authority !== 'null') {
						ImmunizationEvaluation.authority = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' + rez[i].authority;
					} else {
						ImmunizationEvaluation.authority = "";
					}
					ImmunizationEvaluation.targetDisease = rez[i].targetDisease;
					if (rez[i].immunizationEvent !== 'null') {
						ImmunizationEvaluation.immunizationEvent = hostFHIR + ':' + portFHIR + '/' + apikey + '/Immunization?_id=' + rez[i].immunizationEvent;
					} else {
						ImmunizationEvaluation.immunizationEvent = "";
					}
					ImmunizationEvaluation.doseStatus = rez[i].doseStatus;
					ImmunizationEvaluation.doseStatusReason = rez[i].doseStatusReason;
					ImmunizationEvaluation.description = rez[i].description;
					ImmunizationEvaluation.series = rez[i].series;
					var arrDoseNumber = [];
					var DoseNumber = {};
					DoseNumber.doseNumberPositiveInt = rez[i].doseNumberPositiveInt;
					DoseNumber.doseNumberString = rez[i].doseNumberString;
					arrDoseNumber = DoseNumber;
					ImmunizationEvaluation.doseNumber = DoseNumber;
					var arrSeriesDoses = [];
					var SeriesDoses = {};
					SeriesDoses.seriesDosesPositiveInt = rez[i].seriesDosesPositiveInt;
					SeriesDoses.seriesDosesString = rez[i].seriesDosesString;
					arrSeriesDoses = SeriesDoses;
					ImmunizationEvaluation.seriesDoses = SeriesDoses;
					
          arrImmunizationEvaluation[i] = ImmunizationEvaluation;
        }
        res.json({"err_code":0,"data": arrImmunizationEvaluation});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationEvaluation"});
      });
    }
  },
	post: {
		immunizationEvaluation: function addImmunizationEvaluation(req, res) {
			console.log(req.body);
			var immunization_evaluation_id  = req.body.immunization_evaluation_id;
			var status  = req.body.status;
			var patient  = req.body.patient;
			var date  = req.body.date;
			var authority  = req.body.authority;
			var targetDisease  = req.body.targetDisease;
			var immunizationEvent  = req.body.immunizationEvent;
			var doseStatus  = req.body.doseStatus;
			var doseStatusReason  = req.body.doseStatusReason;
			var description  = req.body.description;
			var series  = req.body.series;
			var doseNumberPositiveInt  = req.body.doseNumberPositiveInt;
			var doseNumberString  = req.body.doseNumberString;
			var seriesDosesPositiveInt  = req.body.seriesDosesPositiveInt;
			var seriesDosesString  = req.body.seriesDosesString;
			var immunization_recommendation_id  = req.body.immunization_recommendation_id;
			
			var column = "";
      var values = "";
			
			if (typeof immunization_evaluation_id !== 'undefined' && immunization_evaluation_id !== "") {
				column += 'immunization_evaluation_id,';
				values += " '" + immunization_evaluation_id +"',";
			}

			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof patient !== 'undefined' && patient !== "") {
				column += 'patient,';
				values += " '" + patient +"',";
			}

			if (typeof  date !== 'undefined' &&  date !== "") {
				column += ' date,';
				values += "to_date('"+  date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof authority !== 'undefined' && authority !== "") {
				column += 'authority,';
				values += " '" + authority +"',";
			}

			if (typeof targetDisease !== 'undefined' && targetDisease !== "") {
				column += 'targetDisease,';
				values += " '" + targetDisease +"',";
			}

			if (typeof immunizationEvent !== 'undefined' && immunizationEvent !== "") {
				column += 'immunizationEvent,';
				values += " '" + immunizationEvent +"',";
			}

			if (typeof doseStatus !== 'undefined' && doseStatus !== "") {
				column += 'doseStatus,';
				values += " '" + doseStatus +"',";
			}

			if (typeof doseStatusReason !== 'undefined' && doseStatusReason !== "") {
				column += 'doseStatusReason,';
				values += " '" + doseStatusReason +"',";
			}

			if (typeof description !== 'undefined' && description !== "") {
				column += 'description,';
				values += " '" + description +"',";
			}

			if (typeof series !== 'undefined' && series !== "") {
				column += 'series,';
				values += " '" + series +"',";
			}

			if (typeof doseNumberPositiveInt !== 'undefined' && doseNumberPositiveInt !== "") {
				column += 'doseNumberPositiveInt,';
				values += " " + doseNumberPositiveInt +",";
			}

			if (typeof doseNumberString !== 'undefined' && doseNumberString !== "") {
				column += 'doseNumberString,';
				values += " '" + doseNumberString +"',";
			}

			if (typeof seriesDosesPositiveInt !== 'undefined' && seriesDosesPositiveInt !== "") {
				column += 'seriesDosesPositiveInt,';
				values += " " + seriesDosesPositiveInt +",";
			}

			if (typeof seriesDosesString !== 'undefined' && seriesDosesString !== "") {
				column += 'seriesDosesString,';
				values += " '" + seriesDosesString +"',";
			}

			if (typeof immunization_recommendation_id !== 'undefined' && immunization_recommendation_id !== "") {
				column += 'immunization_recommendation_id,';
				values += " '" + immunization_recommendation_id +"',";
			}			
			

      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION(immunization_evaluation_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+immunization_evaluation_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select immunization_evaluation_id, status, patient, date, authority, targetDisease, immunizationEvent, doseStatus, doseStatusReason, description, series, doseNumberPositiveInt, doseNumberString, seriesDosesPositiveInt, seriesDosesString, immunization_recommendation_id from BACIRO_FHIR.IMMUNIZATION_EVALUATION WHERE immunization_evaluation_id = '" + immunization_evaluation_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationEvaluation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationEvaluation"});
      });
    }
	},
	put: {
		immunizationEvaluation: function updateImmunizationEvaluation(req, res) {
			console.log(req.body);
			
			var immunization_evaluation_id  = req.body._id;
			var status  = req.body.status;
			var patient  = req.body.patient;
			var date  = req.body.date;
			var authority  = req.body.authority;
			var targetDisease  = req.body.targetDisease;
			var immunizationEvent  = req.body.immunizationEvent;
			var doseStatus  = req.body.doseStatus;
			var doseStatusReason  = req.body.doseStatusReason;
			var description  = req.body.description;
			var series  = req.body.series;
			var doseNumberPositiveInt  = req.body.doseNumberPositiveInt;
			var doseNumberString  = req.body.doseNumberString;
			var seriesDosesPositiveInt  = req.body.seriesDosesPositiveInt;
			var seriesDosesString  = req.body.seriesDosesString;
			var immunization_recommendation_id  = req.body.immunization_recommendation_id;
			
			var column = "";
      var values = "";
			
			if (typeof immunization_evaluation_id !== 'undefined' && immunization_evaluation_id !== "") {
				column += 'immunization_evaluation_id,';
				values += " '" + immunization_evaluation_id +"',";
			}

			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof patient !== 'undefined' && patient !== "") {
				column += 'patient,';
				values += " '" + patient +"',";
			}

			if (typeof  date !== 'undefined' &&  date !== "") {
				column += ' date,';
				values += "to_date('"+  date + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof authority !== 'undefined' && authority !== "") {
				column += 'authority,';
				values += " '" + authority +"',";
			}

			if (typeof targetDisease !== 'undefined' && targetDisease !== "") {
				column += 'targetDisease,';
				values += " '" + targetDisease +"',";
			}

			if (typeof immunizationEvent !== 'undefined' && immunizationEvent !== "") {
				column += 'immunizationEvent,';
				values += " '" + immunizationEvent +"',";
			}

			if (typeof doseStatus !== 'undefined' && doseStatus !== "") {
				column += 'doseStatus,';
				values += " '" + doseStatus +"',";
			}

			if (typeof doseStatusReason !== 'undefined' && doseStatusReason !== "") {
				column += 'doseStatusReason,';
				values += " '" + doseStatusReason +"',";
			}

			if (typeof description !== 'undefined' && description !== "") {
				column += 'description,';
				values += " '" + description +"',";
			}

			if (typeof series !== 'undefined' && series !== "") {
				column += 'series,';
				values += " '" + series +"',";
			}

			if (typeof doseNumberPositiveInt !== 'undefined' && doseNumberPositiveInt !== "") {
				column += 'doseNumberPositiveInt,';
				values += " " + doseNumberPositiveInt +",";
			}

			if (typeof doseNumberString !== 'undefined' && doseNumberString !== "") {
				column += 'doseNumberString,';
				values += " '" + doseNumberString +"',";
			}

			if (typeof seriesDosesPositiveInt !== 'undefined' && seriesDosesPositiveInt !== "") {
				column += 'seriesDosesPositiveInt,';
				values += " " + seriesDosesPositiveInt +",";
			}

			if (typeof seriesDosesString !== 'undefined' && seriesDosesString !== "") {
				column += 'seriesDosesString,';
				values += " '" + seriesDosesString +"',";
			}

			if (typeof immunization_recommendation_id !== 'undefined' && immunization_recommendation_id !== "") {
				column += 'immunization_recommendation_id,';
				values += " '" + immunization_recommendation_id +"',";
			}
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "immunization_evaluation_id = '" + immunization_evaluation_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "immunization_evaluation_id = '" + immunization_evaluation_id + "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_EVALUATION(immunization_evaluation_id," + column.slice(0, -1) + ") SELECT immunization_evaluation_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_EVALUATION WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select immunization_evaluation_id, status, patient, date, authority, targetDisease, immunizationEvent, doseStatus, doseStatusReason, description, series, doseNumberPositiveInt, doseNumberString, seriesDosesPositiveInt, seriesDosesString, immunization_recommendation_id from BACIRO_FHIR.IMMUNIZATION_EVALUATION WHERE immunization_evaluation_id = '" + immunization_evaluation_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationEvaluation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationEvaluation"});
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