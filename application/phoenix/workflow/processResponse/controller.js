var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var path = require('path');

var configYaml = yamlconfig.readConfig(path.resolve('../../application/config/config.yml'));

//processResponse emitter
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
		processResponse: function getProcessResponse(req, res){
			var apikey = req.params.apikey;
			var processResponseId = req.query._id;
			
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
			
			if(typeof processResponseId !== 'undefined' && processResponseId !== ""){
        condition += "dr.diagnostic_report_id = '" + processResponseId + "' AND,";  
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


			var arrProcessResponse = [];
      var query = "select prp.process_response_id as process_response_id, prp.status as status, prp.created as created, prp.organization as organization, prp.request as request, prp.outcome as outcome, prp.disposition as disposition, prp.request_provider as request_provider, prp.request_organization as request_organization, prp.form as form, prp.error as error from BACIRO_FHIR.process_response prp " + fixCondition;
			//console.log(query);			
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var ProcessResponse = {};
					ProcessResponse.resourceType = "ProcessResponse";
          ProcessResponse.id = rez[i].process_response_id;
					ProcessResponse.status = rez[i].status;
					if(rez[i].created == null){
						ProcessResponse.created = formatDate(rez[i].created);
					}else{
						ProcessResponse.created = rez[i].created;
					}
					if(rez[i].organization != "null"){
						ProcessResponse.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].organization;
					} else {
						ProcessResponse.organization = "";
					}
					ProcessResponse.request = rez[i].request;
					ProcessResponse.outcome = rez[i].outcome;
					ProcessResponse.disposition = rez[i].disposition;
					if(rez[i].request_provider != "null"){
						ProcessResponse.requestProvider = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].request_provider;
					} else {
						ProcessResponse.requestProvider = "";
					}
					if(rez[i].request_organization != "null"){
						ProcessResponse.requestOrganization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].request_organization;
					} else {
						ProcessResponse.requestOrganization = "";
					}
					ProcessResponse.form = rez[i].form;
					ProcessResponse.error = rez[i].error;
					
          arrProcessResponse[i] = ProcessResponse;
        }
        res.json({"err_code":0,"data": arrProcessResponse});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getProcessResponse"});
      });
    },
		processNote: function getProcessNote(req, res) {
			var apikey = req.params.apikey;
			
			var processNoteId = req.query._id;
			var processResponseId = req.query.processResponse_id;

			//susun query
			var condition = "";

			if (typeof processNoteId !== 'undefined' && processNoteId !== "") {
				condition += "process_note_id = '" + processNoteId + "' AND ";
			}

			if (typeof processResponseId !== 'undefined' && processResponseId !== "") {
				condition += "process_response_id = '" + processResponseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrProcessNote = [];
			var query = "select process_note_id, type, text from BACIRO_FHIR.process_note " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ProcessNote = {};
					ProcessNote.id = rez[i].process_note_id;
					ProcessNote.type = rez[i].type;
					ProcessNote.text = rez[i].text;
					
					arrProcessNote[i] = ProcessNote;
				}
				res.json({
					"err_code": 0,
					"data": arrProcessNote
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcessNote"
				});
			});
		}
  },
	post: {
		processResponse: function addProcessResponse(req, res) {
			console.log(req.body);
			var process_response_id  = req.body.process_response_id;
			var status  = req.body.status;
			var created  = req.body.created;
			var organization  = req.body.organization;
			var request  = req.body.request;
			var outcome  = req.body.outcome;
			var disposition  = req.body.disposition;
			var request_provider  = req.body.request_provider;
			var request_organization  = req.body.request_organization;
			var form  = req.body.form;
			var error  = req.body.error;
			
			var column = "";
      var values = "";
			
				
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof created !== 'undefined' && created !== "") {
        column += 'created,';
				values += "to_date('"+ created + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof organization !== 'undefined' && organization !== "") {
        column += 'organization,';
        values += "'" + organization + "',";
      }
			
			if (typeof request !== 'undefined' && request !== "") {
        column += 'request,';
        values += "'" + request + "',";
      }	
			
			if (typeof outcome !== 'undefined' && outcome !== "") {
        column += 'outcome,';
        values += "'" + outcome + "',";
      }	
			
			if (typeof disposition !== 'undefined' && disposition !== "") {
        column += 'disposition,';
        values += "'" + disposition + "',";
      }	
			
			if (typeof request_provider !== 'undefined' && request_provider !== "") {
        column += 'request_provider,';
        values += "'" + request_provider + "',";
      }	
			
			if (typeof request_organization !== 'undefined' && request_organization !== "") {
        column += 'request_organization,';
        values += "'" + request_organization + "',";
      }	
			
			if (typeof form !== 'undefined' && form !== "") {
        column += 'form,';
        values += "'" + form + "',";
      }		
			
			if (typeof error !== 'undefined' && error !== "") {
        column += 'error,';
        values += "'" + error + "',";
      }		
			
			var query = "UPSERT INTO BACIRO_FHIR.process_response(process_response_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+process_response_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select process_response_id from BACIRO_FHIR.process_response WHERE process_response_id = '" + process_response_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProcessResponse"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addProcessResponse"});
      });
    },
		processNote: function addProcessNote(req, res) {
			console.log(req.body);
			var process_note_id  = req.body.process_note_id;
			var type  = req.body.type;
			var text  = req.body.text;
			var process_response_id  = req.body.process_response_id;
			
			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof text !== 'undefined' && text !== "") {
        column += 'text,';
        values += "'" + text + "',";
      }
			
			if (typeof process_response_id !== 'undefined' && process_response_id !== "") {
        column += 'process_response_id,';
        values += "'" + process_response_id + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.process_note(process_note_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+process_note_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select process_note_id from BACIRO_FHIR.process_note WHERE process_note_id = '" + process_note_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProcessNote"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addProcessNote"});
      });
    }
	},
	put: {
		processResponse: function updateProcessResponse(req, res) {
			console.log(req.body);
			var process_response_id  = req.params.process_response_id;
			var status  = req.body.status;
			var created  = req.body.created;
			var organization  = req.body.organization;
			var request  = req.body.request;
			var outcome  = req.body.outcome;
			var disposition  = req.body.disposition;
			var request_provider  = req.body.request_provider;
			var request_organization  = req.body.request_organization;
			var form  = req.body.form;
			var error  = req.body.error;
			
			var column = "";
      var values = "";
			
				
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof created !== 'undefined' && created !== "") {
        column += 'created,';
				values += "to_date('"+ created + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof organization !== 'undefined' && organization !== "") {
        column += 'organization,';
        values += "'" + organization + "',";
      }
			
			if (typeof request !== 'undefined' && request !== "") {
        column += 'request,';
        values += "'" + request + "',";
      }	
			
			if (typeof outcome !== 'undefined' && outcome !== "") {
        column += 'outcome,';
        values += "'" + outcome + "',";
      }	
			
			if (typeof disposition !== 'undefined' && disposition !== "") {
        column += 'disposition,';
        values += "'" + disposition + "',";
      }	
			
			if (typeof request_provider !== 'undefined' && request_provider !== "") {
        column += 'request_provider,';
        values += "'" + request_provider + "',";
      }	
			
			if (typeof request_organization !== 'undefined' && request_organization !== "") {
        column += 'request_organization,';
        values += "'" + request_organization + "',";
      }	
			
			if (typeof form !== 'undefined' && form !== "") {
        column += 'form,';
        values += "'" + form + "',";
      }		
			
			if (typeof error !== 'undefined' && error !== "") {
        column += 'error,';
        values += "'" + error + "',";
      }		
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "process_response_id = '" + process_response_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.process_response(process_response_id," + column.slice(0, -1) + ") SELECT process_response_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.process_response WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select process_response_id from BACIRO_FHIR.process_response WHERE process_response_id = '" + process_response_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateProcessResponse"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateProcessResponse"});
      });
    },
		processNote: function updateProcessNote(req, res) {
			console.log(req.body);
			var process_note_id  = req.params.process_note_id;
			var type  = req.body.type;
			var text  = req.body.text;
			var process_response_id  = req.body.process_response_id;
			
			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof text !== 'undefined' && text !== "") {
        column += 'text,';
        values += "'" + text + "',";
      }
			
			if (typeof process_response_id !== 'undefined' && process_response_id !== "") {
        column += 'process_response_id,';
        values += "'" + process_response_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "process_note_id = '" + process_note_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.process_note(process_note_id," + column.slice(0, -1) + ") SELECT process_note_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.process_note WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select process_note_id from BACIRO_FHIR.process_note WHERE process_note_id = '" + process_note_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateProcessNote"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateProcessNote"});
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