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
		deviceUseStatement: function getDeviceUseStatement(req, res){
			var apikey = req.params.apikey;
			var deviceUseStatementId = req.query._id;
			
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
			
			if(typeof deviceUseStatementId !== 'undefined' && deviceUseStatementId !== ""){
        condition += "dr.diagnostic_report_id = '" + deviceUseStatementId + "' AND,";  
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


			var arrDeviceUseStatement = [];
      var query = "select dus.device_use_statement_id as device_use_statement_id, dus.status as status, dus.subject_patient as subject_patient, dus.subject_group as subject_group, dus.when_used_start as when_used_start, dus.when_used_end as when_used_end, dus.timing_timing as timing_timing, dus.timing_period_start as timing_period_start, dus.timing_period_end as timing_period_end, dus.timing_date_time as timing_date_time, dus.recorded_on as recorded_on, dus.source_patient as source_patient, dus.source_practitioner as source_practitioner, dus.source_related_person as source_related_person, dus.device as device, dus.indication as indication, dus.body_site as body_site from BACIRO_FHIR.device_use_statement dus " + fixCondition;
			//console.log(query);			
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var DeviceUseStatement = {};
					DeviceUseStatement.resourceType = "DeviceUseStatement";
          DeviceUseStatement.id = rez[i].device_use_statement_id;
					DeviceUseStatement.status = rez[i].status;
					var arrSubject = [];
					var Subject = {};
					if(rez[i].subject_group != "null"){
						Subject.group = hostFHIR + ':' + portFHIR + '/' + apikey + '/Group?_id=' +  rez[i].subject_group;
					} else {
						Subject.group = "";
					}
					if(rez[i].subject_patient != "null"){
						Subject.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subject_patient;
					} else {
						Subject.patient = "";
					}
					arrSubject[i] = Subject;
					DeviceUseStatement.subject = arrSubject;
					
					var whenUsedperiod_start,whenUsedperiod_end;
					if(rez[i].when_used_start == null){
						whenUsedperiod_start = formatDate(rez[i].when_used_start);  
					}else{
						whenUsedperiod_start = rez[i].when_used_start;  
					}
					if(rez[i].when_used_end == null){
						whenUsedperiod_end = formatDate(rez[i].when_used_end);  
					}else{
						whenUsedperiod_end = rez[i].when_used_end;  
					}
					DeviceUseStatement.whenUsed = whenUsedperiod_start + ' to ' + whenUsedperiod_end;
					DeviceUseStatement.timing.timingTiming = rez[i].timing_timing;
					var timingperiod_start,timingperiod_end;
					if(rez[i].timing_period_start == null){
						timingperiod_start = formatDate(rez[i].timing_period_start);  
					}else{
						timingperiod_start = rez[i].timing_period_start;  
					}
					if(rez[i].timing_period_end == null){
						timingperiod_end = formatDate(rez[i].timing_period_end);  
					}else{
						timingperiod_end = rez[i].timing_period_end;  
					}
					DeviceUseStatement.timing.timingPeriod = timingperiod_start + ' to ' + timingperiod_end;
					if(rez[i].timing_date_time == null){
						DeviceUseStatement.timing.timingDateTime = formatDate(rez[i].timing_date_time);
					}else{
						DeviceUseStatement.timing.timingDateTime = rez[i].timing_date_time;
					}
					if(rez[i].recorded_on == null){
						DeviceUseStatement.recordedOn = formatDate(rez[i].recorded_on);
					}else{
						DeviceUseStatement.recordedOn = rez[i].recorded_on;
					}
					var arrSource = [];
					var Source {};
					if(rez[i].source_practitioner != "null"){
						Source.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].source_practitioner;
					} else {
						Source.practitioner = "";
					}
					if(rez[i].subject_patient != "null"){
						Source.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subject_patient;
					} else {
						Source.patient = "";
					}
					if(rez[i].source_related_person != "null"){
						Source.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].source_related_person;
					} else {
						Source.relatedPerson = "";
					}
					arrSource[i] = Source;
					DeviceUseStatement.source = arrSource;
					 if(rez[i].device != "null"){
						DeviceUseStatement.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].device;
					} else {
						DeviceUseStatement.device = "";
					}
					DeviceUseStatement.indication = rez[i].indication;
					DeviceUseStatement.body_site = rez[i].body_site;
					
          arrDeviceUseStatement[i] = DeviceUseStatement;
        }
        res.json({"err_code":0,"data": arrDeviceUseStatement});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceUseStatement"});
      });
    }
  },
	post: {
		deviceUseStatement: function addDeviceUseStatement(req, res) {
			console.log(req.body);
			var device_use_statement_id  = req.body.device_use_statement_id;
			var status  = req.body.status;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var when_used_start  = req.body.when_used_start;
			var when_used_end  = req.body.when_used_end;
			var timing_timing  = req.body.timing_timing;
			var timing_period_start  = req.body.timing_period_start;
			var timing_period_end  = req.body.timing_period_end;
			var timing_date_time  = req.body.timing_date_time;
			var recorded_on  = req.body.recorded_on;
			var source_patient  = req.body.source_patient;
			var source_practitioner  = req.body.source_practitioner;
			var source_related_person  = req.body.source_related_person;
			var device  = req.body.device;
			var indication  = req.body.indication;
			var body_site  = req.body.body_site;
			
			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }	
			
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }
			
			if (typeof subject_group !== 'undefined' && subject_group !== "") {
        column += 'subject_group,';
        values += "'" + subject_group + "',";
      }	
			
			if (typeof when_used_start !== 'undefined' && when_used_start !== "") {
        column += 'when_used_start,';
				values += "to_date('"+ when_used_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof when_used_end !== 'undefined' && when_used_end !== "") {
        column += 'when_used_end,';
				values += "to_date('"+ when_used_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof timing_timing !== 'undefined' && timing_timing !== "") {
        column += 'timing_timing,';
        values += "'" + timing_timing + "',";
      }	
			
			if (typeof timing_period_start !== 'undefined' && timing_period_start !== "") {
        column += 'timing_period_start,';
				values += "to_date('"+ timing_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof timing_period_end !== 'undefined' && timing_period_end !== "") {
        column += 'timing_period_end,';
				values += "to_date('"+ timing_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof timing_date_time !== 'undefined' && timing_date_time !== "") {
        column += 'timing_date_time,';
				values += "to_date('"+ timing_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof recorded_on !== 'undefined' && recorded_on !== "") {
        column += 'recorded_on,';
				values += "to_date('"+ recorded_on + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof source_patient !== 'undefined' && source_patient !== "") {
        column += 'source_patient,';
        values += "'" + source_patient + "',";
      }	
			
			if (typeof source_practitioner !== 'undefined' && source_practitioner !== "") {
        column += 'source_practitioner,';
        values += "'" + source_practitioner + "',";
      }	
			
			if (typeof source_related_person !== 'undefined' && source_related_person !== "") {
        column += 'source_related_person,';
        values += "'" + source_related_person + "',";
      }
				
			if (typeof device !== 'undefined' && device !== "") {
        column += 'device,';
        values += "'" + device + "',";
      }		
			
			if (typeof indication !== 'undefined' && indication !== "") {
        column += 'indication,';
        values += "'" + indication + "',";
      }		
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
      }		
			
      var query = "UPSERT INTO BACIRO_FHIR.device_use_statement(device_use_statement_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+device_use_statement_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select device_use_statement_id from BACIRO_FHIR.device_use_statement WHERE device_use_statement_id = '" + device_use_statement_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceUseStatement"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceUseStatement"});
      });
    }
	},
	put: {
		deviceUseStatement: function updateDeviceUseStatement(req, res) {
			console.log(req.body);
			var device_use_statement_id  = req.params.device_use_statement_id;
			var status  = req.body.status;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var when_used_start  = req.body.when_used_start;
			var when_used_end  = req.body.when_used_end;
			var timing_timing  = req.body.timing_timing;
			var timing_period_start  = req.body.timing_period_start;
			var timing_period_end  = req.body.timing_period_end;
			var timing_date_time  = req.body.timing_date_time;
			var recorded_on  = req.body.recorded_on;
			var source_patient  = req.body.source_patient;
			var source_practitioner  = req.body.source_practitioner;
			var source_related_person  = req.body.source_related_person;
			var device  = req.body.device;
			var indication  = req.body.indication;
			var body_site  = req.body.body_site;
			
			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }	
			
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }
			
			if (typeof subject_group !== 'undefined' && subject_group !== "") {
        column += 'subject_group,';
        values += "'" + subject_group + "',";
      }	
			
			if (typeof when_used_start !== 'undefined' && when_used_start !== "") {
        column += 'when_used_start,';
				values += "to_date('"+ when_used_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof when_used_end !== 'undefined' && when_used_end !== "") {
        column += 'when_used_end,';
				values += "to_date('"+ when_used_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof timing_timing !== 'undefined' && timing_timing !== "") {
        column += 'timing_timing,';
        values += "'" + timing_timing + "',";
      }	
			
			if (typeof timing_period_start !== 'undefined' && timing_period_start !== "") {
        column += 'timing_period_start,';
				values += "to_date('"+ timing_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof timing_period_end !== 'undefined' && timing_period_end !== "") {
        column += 'timing_period_end,';
				values += "to_date('"+ timing_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof timing_date_time !== 'undefined' && timing_date_time !== "") {
        column += 'timing_date_time,';
				values += "to_date('"+ timing_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof recorded_on !== 'undefined' && recorded_on !== "") {
        column += 'recorded_on,';
				values += "to_date('"+ recorded_on + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof source_patient !== 'undefined' && source_patient !== "") {
        column += 'source_patient,';
        values += "'" + source_patient + "',";
      }	
			
			if (typeof source_practitioner !== 'undefined' && source_practitioner !== "") {
        column += 'source_practitioner,';
        values += "'" + source_practitioner + "',";
      }	
			
			if (typeof source_related_person !== 'undefined' && source_related_person !== "") {
        column += 'source_related_person,';
        values += "'" + source_related_person + "',";
      }
				
			if (typeof device !== 'undefined' && device !== "") {
        column += 'device,';
        values += "'" + device + "',";
      }		
			
			if (typeof indication !== 'undefined' && indication !== "") {
        column += 'indication,';
        values += "'" + indication + "',";
      }		
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
      }	
			
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "device_use_statement_id = '" + device_use_statement_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.device_use_statement(device_use_statement_id," + column.slice(0, -1) + ") SELECT device_use_statement_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.device_use_statement WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select device_use_statement_id from BACIRO_FHIR.device_use_statement WHERE device_use_statement_id = '" + device_use_statement_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceUseStatement"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceUseStatement"});
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