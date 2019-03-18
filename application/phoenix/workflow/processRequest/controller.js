var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var path = require('path');

var configYaml = yamlconfig.readConfig(path.resolve('../../application/config/config.yml'));

//processRequest emitter
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
		processRequest: function getProcessRequest(req, res){
			var apikey = req.params.apikey;
			var processRequestId = req.query._id;
			
			/*var based_on = req.query.based_on;
			var category = req.query.category;
			var code = req.query.code;
			var context = req.query.context;
			var date = req.query.date;
			var diagnosis = req.query.diagnosis;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var image = req.query.image;
			var issued = req.query.issued;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var result = req.query.result;
			var specimen = req.query.specimen;
			var status = req.query.status;
			var subject = req.query.subject;
			
			
	
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof processRequestId !== 'undefined' && processRequestId !== ""){
        condition += "dr.diagnostic_report_id = '" + processRequestId + "' AND,";  
      }
			
			if((typeof based_on !== 'undefined' && based_on !== "")){ 
			 var res = based_on.substring(0, 3);
				if(res == 'cap'){
					join += " LEFT JOIN BACIRO_FHIR.CAREPLAN cap ON dr.diagnostic_report_id = cap.diagnostic_report_id ";
          condition += "CAREPLAN_ID = '" + based_on + "' AND ";       
				} 
				if(res == 'imr') {
					join += " LEFT JOIN BACIRO_FHIR.immunization_recommendation ir ON dr.diagnostic_report_id = ir.diagnostic_report_id ";
          condition += "immunization_recommendation_id = '" + based_on + "' AND ";       
				}
				
				if(res == 'mer'){
					join += " LEFT JOIN BACIRO_FHIR.MEDICATION_REQUEST mr ON dr.diagnostic_report_id = mr.diagnostic_report_id ";
          condition += "MEDICATION_REQUEST_ID = '" + based_on + "' AND ";       
				}
				
				if(res == 'pre') {
					join += " LEFT JOIN BACIRO_FHIR.PROCEDURE_REQUEST pr ON dr.diagnostic_report_id = pr.diagnostic_report_id ";
          condition += "PROCEDURE_REQUEST_id = '" + based_on + "' AND ";       
				}
				
				if(res == 'cap'){
					join += " LEFT JOIN BACIRO_FHIR.REFERRAL_REQUEST rr ON dr.diagnostic_report_id = rr.diagnostic_report_id ";
          condition += "REFERRAL_REQUEST_ID = '" + based_on + "' AND ";       
				} 
				
				if(res == 'imr') {
					join += " LEFT JOIN BACIRO_FHIR.Nutrition_Order  no ON dr.diagnostic_report_id = no.diagnostic_report_id ";
          condition += "Nutrition_Order_id = '" + based_on + "' AND ";       
				}
      }
			
			if(typeof category !== 'undefined' && category !== ""){
				condition += "dr.category = '" + category + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
				condition += "dr.CODE = '" + code + "' AND,";  
      }
			
			if(typeof context !== 'undefined' && context !== ""){
				condition += "(dr.CONTEXT_ENCOUNTER = '" + context + "' OR dr.CONTEXT_EPISODE_OF_CARE = '" + context + "') AND,";  
			}
			
			if (typeof date !== 'undefined' && date !== "") {
        condition += "dr.effective_period_start <= to_date('" + date + "', 'yyyy-MM-dd') AND dr.effective_period_end >= to_date('" + date + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof diagnosis !== 'undefined' && diagnosis !== ""){
				condition += "dr.coded_diagnosis = '" + diagnosis + "' AND,";  
      }
			
			if(typeof encounter !== 'undefined' && encounter !== ""){
			  condition += "dr.CONTEXT_ENCOUNTER = '" + encounter + "' AND,";  
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if((typeof image !== 'undefined' && image !== "")){
        join += " LEFT JOIN BACIRO_FHIR.Media me ON me.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "me.media_id = '" + image + "' AND ";
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
			  condition += "dr.subject_patient = '" + patient + "' AND,";  
      }
			
			if(typeof issued !== 'undefined' && issued !== ""){
			  condition += "dr.issued == to_date('" + issued + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof performer !== 'undefined' && performer !== ""){
				join += " LEFT JOIN BACIRO_FHIR.diagnostic_report_performer drp ON drp.diagnostic_report_id = dr.diagnostic_report_id ";
				condition += "(drp.actor_practitioner = '" + performer + "' OR drp.actor_organization = '" + performer + "') AND,";  
			}
			
			if((typeof result !== 'undefined' && result !== "")){
        join += " LEFT JOIN BACIRO_FHIR.observation obs ON obs.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "obs.observation_id = '" + result + "' AND ";
      }
			
			if((typeof specimen !== 'undefined' && specimen !== "")){
        join += " LEFT JOIN BACIRO_FHIR.Specimen spe ON spe.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "spe.specimen_id = '" + specimen + "' AND ";
      }
			if(typeof status !== 'undefined' && status !== ""){
				condition += "dr.status = '" + status + "' AND,";  
      }
			
			if(typeof subject !== 'undefined' && subject !== ""){
				condition += "(dr.SUBJECT_PATIENT = '" + subject + "' OR dr.SUBJECT_GROUP = '" + subject + "' OR dr.subject_device = '" + subject + "' OR dr.subject_location = '" + subject + "') AND,";  
			}*/
			
			
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

			var arrProcessRequest = [];
      var query = "select pr.process_request_id as process_request_id, pr.status as status, pr.action as action, pr.target as target, pr.created as created, pr.provider as provider, pr.organization as organization, pr.request as request, pr.response as response, pr.nullify as nullify, pr.reference as reference, pr.included as included, pr.excluded as excluded, pr.period_start as period_start, pr.period_end as period_end from BACIRO_FHIR.process_request pr " + fixCondition;
			//console.log(query);			
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var ProcessRequest = {};
					ProcessRequest.resourceType = "ProcessRequest";
          ProcessRequest.id = rez[i].process_request_id;
					ProcessRequest.status = rez[i].status;
					ProcessRequest.action = rez[i].action;
					if(rez[i].target != "null"){
						ProcessRequest.target = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].target;
					} else {
						ProcessRequest.target = "";
					}
					if(rez[i].created == null){
						ProcessRequest.created = formatDate(rez[i].created);
					}else{
						ProcessRequest.created = rez[i].created;
					}
					if(rez[i].provider != "null"){
						ProcessRequest.provider = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].provider;
					} else {
						ProcessRequest.provider = "";
					}
					if(rez[i].organization != "null"){
						ProcessRequest.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].organization;
					} else {
						ProcessRequest.organization = "";
					}
					ProcessRequest.request = rez[i].request;
					ProcessRequest.response = rez[i].response;
					ProcessRequest.nullify = rez[i].nullify;
					ProcessRequest.reference = rez[i].reference;
					ProcessRequest.include = rez[i].included;
					ProcessRequest.exclude = rez[i].excluded;
					var period_start,period_end;
					if(rez[i].period_start == null){
						period_start = formatDate(rez[i].period_start);  
					}else{
						period_start = rez[i].period_start;  
					}
					if(rez[i].period_end == null){
						period_end = formatDate(rez[i].period_end);  
					}else{
						period_end = rez[i].period_end;  
					}
					ProcessRequest.period = period_start + ' to ' + period_end;
					
					
          arrProcessRequest[i] = ProcessRequest;
        }
        res.json({"err_code":0,"data": arrProcessRequest});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getProcessRequest"});
      });
    },
		processRequestItem: function getProcessRequestItem(req, res) {
			var apikey = req.params.apikey;
			
			var processRequestItemId = req.query._id;
			var processRequestId = req.query.processRequest_id;

			//susun query
			var condition = "";

			if (typeof processRequestItemId !== 'undefined' && processRequestItemId !== "") {
				condition += "item_id = '" + processRequestItemId + "' AND ";
			}

			if (typeof processRequestId !== 'undefined' && processRequestId !== "") {
				condition += "process_request_id = '" + processRequestId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrProcessRequestItem = [];
			var query = "select item_id, sequence_link_id from BACIRO_FHIR.process_request_item " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ProcessRequestItem = {};
					ProcessRequestItem.id = rez[i].item_id;
					ProcessRequestItem.sequence_link_id = rez[i].sequence_link_id;
					
					arrProcessRequestItem[i] = ProcessRequestItem;
				}
				res.json({
					"err_code": 0,
					"data": arrProcessRequestItem
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcessRequestItem"
				});
			});
		}
  },
	post: {
		processRequest: function addProcessRequest(req, res) {
			console.log(req.body);
			var process_request_id  = req.body.process_request_id;
			var status  = req.body.status;
			var action  = req.body.action;
			var target  = req.body.target;
			var created  = req.body.created;
			var provider  = req.body.provider;
			var organization  = req.body.organization;
			var request  = req.body.request;
			var response  = req.body.response;
			var nullify  = req.body.nullify;
			var reference  = req.body.reference;
			var included  = req.body.include;
			var excluded  = req.body.exclude;
			var period_start  = req.body.period_start;
			var period_end  = req.body.period_end;
			
			var column = "";
      var values = "";
			
				
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof action !== 'undefined' && action !== "") {
        column += 'action,';
        values += "'" + action + "',";
      }
			
			if (typeof target !== 'undefined' && target !== "") {
        column += 'target,';
        values += "'" + target + "',";
      }	
			
			if (typeof provider !== 'undefined' && provider !== "") {
        column += 'provider,';
        values += "'" + provider + "',";
      }	
			
			if (typeof organization !== 'undefined' && organization !== "") {
        column += 'organization,';
        values += "'" + organization + "',";
      }	
			
			if (typeof request !== 'undefined' && request !== "") {
        column += 'request,';
        values += "'" + request + "',";
      }	
			
			if (typeof response !== 'undefined' && response !== "") {
        column += 'response,';
        values += "'" + response + "',";
      }		
			
			if (typeof nullify !== 'undefined' && nullify !== "") {
        column += 'nullify,';
        values += " " + nullify + ",";
      }		
			
			if (typeof created !== 'undefined' && created !== "") {
        column += 'created,';
				values += "to_date('"+ created + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof period_start !== 'undefined' && period_start !== "") {
        column += 'period_start,';
				values += "to_date('"+ period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof period_end !== 'undefined' && period_end !== "") {
        column += 'period_end,';
				values += "to_date('"+ period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof reference !== 'undefined' && reference !== "") {
        column += 'reference,';
        values += "'" + reference + "',";
      }		
			
			if (typeof included !== 'undefined' && included !== "") {
        column += 'included,';
        values += "'" + included + "',";
      }
			
			if (typeof excluded !== 'undefined' && excluded !== "") {
        column += 'excluded,';
        values += "'" + excluded + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.process_request(process_request_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+process_request_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select process_request_id from BACIRO_FHIR.process_request WHERE process_request_id = '" + process_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProcessRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addProcessRequest"});
      });
    },
		processRequestItem: function addProcessRequestItem(req, res) {
			console.log(req.body);
			var item_id  = req.body.item_id;
			var sequence_link_id  = req.body.sequence_link_id;
			var process_request_id  = req.body.process_request_id;
			
			var column = "";
      var values = "";
			
			if (typeof sequence_link_id !== 'undefined' && sequence_link_id !== "") {
        column += 'sequence_link_id,';
        values += " " + sequence_link_id + ",";
      }
			
			if (typeof process_request_id !== 'undefined' && process_request_id !== "") {
        column += 'process_request_id,';
        values += "'" + process_request_id + "',";
      }
			
			
      var query = "UPSERT INTO BACIRO_FHIR.process_request_item(item_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+item_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select item_id from BACIRO_FHIR.process_request_item WHERE item_id = '" + item_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProcessRequestItem"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addProcessRequestItem"});
      });
    }
	},
	put: {
		processRequest: function updateProcessRequest(req, res) {
			console.log(req.body);
			var process_request_id  = req.params.process_request_id;
			var status  = req.body.status;
			var action  = req.body.action;
			var target  = req.body.target;
			var created  = req.body.created;
			var provider  = req.body.provider;
			var organization  = req.body.organization;
			var request  = req.body.request;
			var response  = req.body.response;
			var nullify  = req.body.nullify;
			var reference  = req.body.reference;
			var included  = req.body.include;
			var excluded  = req.body.exclude;
			var period_start  = req.body.period_start;
			var period_end  = req.body.period_end;
			
			var column = "";
      var values = "";
			
				
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof action !== 'undefined' && action !== "") {
        column += 'action,';
        values += "'" + action + "',";
      }
			
			if (typeof target !== 'undefined' && target !== "") {
        column += 'target,';
        values += "'" + target + "',";
      }	
			
			if (typeof provider !== 'undefined' && provider !== "") {
        column += 'provider,';
        values += "'" + provider + "',";
      }	
			
			if (typeof organization !== 'undefined' && organization !== "") {
        column += 'organization,';
        values += "'" + organization + "',";
      }	
			
			if (typeof request !== 'undefined' && request !== "") {
        column += 'request,';
        values += "'" + request + "',";
      }	
			
			if (typeof response !== 'undefined' && response !== "") {
        column += 'response,';
        values += "'" + response + "',";
      }		
			
			if (typeof nullify !== 'undefined' && nullify !== "") {
        column += 'nullify,';
        values += " " + nullify + ",";
      }		
			
			if (typeof created !== 'undefined' && created !== "") {
        column += 'created,';
				values += "to_date('"+ created + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof period_start !== 'undefined' && period_start !== "") {
        column += 'period_start,';
				values += "to_date('"+ period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof period_end !== 'undefined' && period_end !== "") {
        column += 'period_end,';
				values += "to_date('"+ period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof reference !== 'undefined' && reference !== "") {
        column += 'reference,';
        values += "'" + reference + "',";
      }		
			
			if (typeof included !== 'undefined' && included !== "") {
        column += 'included,';
        values += "'" + included + "',";
      }
			
			if (typeof excluded !== 'undefined' && excluded !== "") {
        column += 'excluded,';
        values += "'" + excluded + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "process_request_id = '" + process_request_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.process_request(process_request_id," + column.slice(0, -1) + ") SELECT process_request_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.process_request WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select process_request_id from BACIRO_FHIR.process_request WHERE process_request_id = '" + process_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateProcessRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateProcessRequest"});
      });
    },
		processRequestItem: function updateProcessRequestItem(req, res) {
			console.log(req.body);
			var item_id  = req.body.item_id;
			var sequence_link_id  = req.body.sequence_link_id;
			var process_request_id  = req.body.process_request_id;
			
			var column = "";
      var values = "";
			
			if (typeof sequence_link_id !== 'undefined' && sequence_link_id !== "") {
        column += 'sequence_link_id,';
        values += " " + sequence_link_id + ",";
      }
			
			if (typeof process_request_id !== 'undefined' && process_request_id !== "") {
        column += 'process_request_id,';
        values += "'" + process_request_id + "',";
      }
      
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "item_id = '" + item_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.process_request_item(item_id," + column.slice(0, -1) + ") SELECT item_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.process_request_item WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select item_id from BACIRO_FHIR.process_request_item WHERE item_id = '" + item_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateProcessRequestItem"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateProcessRequestItem"});
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