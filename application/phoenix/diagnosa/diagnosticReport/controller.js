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
		diagnosticReport: function getDiagnosticReport(req, res){
			var apikey = req.params.apikey;
			var diagnosticReportId = req.query._id;
			
			var based_on = req.query.based_on;
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
			
			if(typeof diagnosticReportId !== 'undefined' && diagnosticReportId !== ""){
        condition += "dr.diagnostic_report_id = '" + diagnosticReportId + "' AND,";  
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
			}
			
			
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrDiagnosticReport = [];
      var query = "select dr.diagnostic_report_id as diagnostic_report_id, dr.status as status, dr.category as category, dr.code as code, dr.subject_patient as subject_patient, dr.subject_group as subject_group, dr.subject_device as subject_device, dr.subject_location as subject_location, dr.context_encounter as context_encounter, dr.context_episode_of_care as context_episode_of_care, dr.effective_date_time as effective_date_time, dr.effective_period_start as effective_period_start, dr.effective_period_end as effective_period_end, dr.issued as issued, dr.conclusion as conclusion, dr.coded_diagnosis as coded_diagnosis from BACIRO_FHIR.DIAGNOSTIC_REPORT dr " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var DiagnosticReport = {};
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
					if(rez[i].subject_device != "null"){
						Subject.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].subject_device;
					} else {
						Subject.device = "";
					}
					if(rez[i].subject_location != "null"){
						Subject.location = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].subject_location;
					} else {
						Subject.location = "";
					}
					arrSubject[i] = Subject;
					
					var arrContent = [];
					var Content = {};
					if(rez[i].context_encounter != "null"){
						Content.encounter = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].context_encounter;
					} else {
						Content.encounter = "";
					}
					if(rez[i].context_episode_of_care != "null"){
						Content.episodeOfCare = hostFHIR + ':' + portFHIR + '/' + apikey + '/EpisodeOfCare?_id=' +  rez[i].context_episode_of_care;
					} else {
						Content.episodeOfCare = "";
					}
					arrContent[i] = Content;
					
					DiagnosticReport.resourceType = "DiagnosticReport";
          DiagnosticReport.id = rez[i].diagnostic_report_id;
					DiagnosticReport.status = rez[i].status;
					DiagnosticReport.category = rez[i].category;
					DiagnosticReport.code = rez[i].code;
					DiagnosticReport.subject = arrSubject;
					DiagnosticReport.content = arrContent;
					if(rez[i].effective_date_time == null){
						DiagnosticReport.effective.date = formatDate(rez[i].effective_date_time);
					}else{
						DiagnosticReport.effective.date = rez[i].effective_date_time;
					}
					var effectiveperiod_start,effectiveperiod_end;
					if(rez[i].effective_period_start == null){
						effectiveperiod_start = formatDate(rez[i].effective_period_start);  
					}else{
						effectiveperiod_start = rez[i].effective_period_start;  
					}
					if(rez[i].effective_period_end == null){
						effectiveperiod_end = formatDate(rez[i].effective_period_end);  
					}else{
						effectiveperiod_end = rez[i].effective_period_end;  
					}
					DiagnosticReport.effective.period = effectiveperiod_start + ' to ' + effectiveperiod_end;
					DiagnosticReport.issued = rez[i].issued;
					DiagnosticReport.conclusion = rez[i].conclusion;
					DiagnosticReport.codedDiagnosis = rez[i].coded_diagnosis;
					
          arrDiagnosticReport[i] = DiagnosticReport;
        }
        res.json({"err_code":0,"data": arrDiagnosticReport});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getDiagnosticReport"});
      });
    },
		diagnosticReportPerformer: function getDiagnosticReportPerformer(req, res) {
			var apikey = req.params.apikey;
			
			var diagnosticReportPerformerId = req.query._id;
			var diagnosticReportId = req.query.diagnostic_report_id;

			//susun query
			var condition = "";

			if (typeof diagnosticReportPerformerId !== 'undefined' && diagnosticReportPerformerId !== "") {
				condition += "PERFORMER_ID = '" + diagnosticReportPerformerId + "' AND ";
			}

			if (typeof diagnosticReportId !== 'undefined' && diagnosticReportId !== "") {
				condition += "DIAGNOSTIC_REPORT_ID = '" + diagnosticReportId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrDiagnosticReportPerformer = [];
			var query = "select performer_id, role, actor_practitioner, actor_organization from BACIRO_FHIR.DIAGNOSTIC_REPORT_PERFORMER " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var DiagnosticReportPerformer = {};
					
					var arrActor = [];
					var Actor = {};
					if(rez[i].actor_practitioner != "null"){
						Actor.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].actor_practitioner;
					} else {
						Actor.practitioner = "";
					}
					if(rez[i].actor_organization != "null"){
						Actor.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].actor_organization;
					} else {
						Actor.organization = "";
					}
					arrActor[i] = Actor;
					
					DiagnosticReportPerformer.id = rez[i].performer_id;
					DiagnosticReportPerformer.role = rez[i].role;
					DiagnosticReportPerformer.actor = arrActor;
					
					
					arrDiagnosticReportPerformer[i] = DiagnosticReportPerformer;
				}
				res.json({
					"err_code": 0,
					"data": arrDiagnosticReportPerformer
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getDiagnosticReportPerformer"
				});
			});
		},
		diagnosticReportReportImage: function getDiagnosticReportReportImage(req, res) {
			var apikey = req.params.apikey;
			
			var diagnosticReportReportImageId = req.query._id;
			var diagnosticReportId = req.query.diagnostic_report_id;

			//susun query
			var condition = "";

			if (typeof diagnosticReportReportImageId !== 'undefined' && diagnosticReportReportImageId !== "") {
				condition += 'IMAGE_ID = "' + diagnosticReportReportImageId + '" AND ';
			}

			if (typeof diagnosticReportId !== 'undefined' && diagnosticReportId !== "") {
				condition += 'DIAGNOSTIC_REPORT_ID = "' + diagnosticReportId + '" AND ';
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrDiagnosticReportReportImage = [];
			var query = 'select image_id, "comment" as comment, link,  from baciro_fhir.DIAGNOSTIC_REPORT_IMAGE ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var DiagnosticReportReportImage = {};
					DiagnosticReportReportImage.id = rez[i].image_id;
					DiagnosticReportReportImage.comment = rez[i].comment;
					if (rez[i].link !== 'null') {
						DiagnosticReportReportImage.link  = hostFHIR + ':' + portFHIR + '/' + apikey + '/Media?_id=' +  rez[i].link;
					} else {
						DiagnosticReportReportImage.link  = "";
					}
					
					arrDiagnosticReportReportImage[i] = DiagnosticReportReportImage;
				}
				res.json({
					"err_code": 0,
					"data": arrDiagnosticReportReportImage
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getDiagnosticReportReportImage"
				});
			});
		}
  },
	post: {
		diagnosticReport: function addDiagnosticReport(req, res) {
			console.log(req.body);
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var status  = req.body.status;
			var category  = req.body.category;
			var code  = req.body.code;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var subject_device  = req.body.subject_device;
			var subject_location  = req.body.subject_location;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var effective_date_time  = req.body.effective_date_time;
			var effective_period_start  = req.body.effective_period_start;
			var effective_period_end  = req.body.effective_period_end;
			var issued  = req.body.issued;
			var conclusion  = req.body.conclusion;
			var coded_diagnosis  = req.body.coded_diagnosis;
			var charge_item_id  = req.body.charge_item_id;
			var clinical_impression_investigation_id  = req.body.clinical_impression_investigation_id;
			var condition_stage_id  = req.body.condition_stage_id;
			var procedure_id  = req.body.procedure_id;
			
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
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }	
			
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }	
			
			if (typeof subject_group !== 'undefined' && subject_group !== "") {
        column += 'subject_group,';
        values += "'" + subject_group + "',";
      }		
			
			if (typeof subject_device !== 'undefined' && subject_device !== "") {
        column += 'subject_device,';
        values += "'" + subject_device + "',";
      }	
			
			if (typeof subject_location !== 'undefined' && subject_location !== "") {
        column += 'subject_location,';
        values += "'" + subject_location + "',";
      }		
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }	
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }
			
			if (typeof effective_date_time !== 'undefined' && effective_date_time !== "") {
        column += 'effective_date_time,';
				values += "to_date('"+ effective_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_start !== 'undefined' && effective_period_start !== "") {
        column += 'effective_period_start,';
				values += "to_date('"+ effective_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_end !== 'undefined' && effective_period_end !== "") {
        column += 'effective_period_end,';
				values += "to_date('"+ effective_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof issued !== 'undefined' && issued !== "") {
        column += 'issued,';
				values += "to_date('"+ issued + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof conclusion !== 'undefined' && conclusion !== "") {
        column += 'conclusion,';
        values += "'" + conclusion + "',";
      }		
			
			if (typeof coded_diagnosis !== 'undefined' && coded_diagnosis !== "") {
        column += 'coded_diagnosis,';
        values += "'" + coded_diagnosis + "',";
      }		
			
			if (typeof charge_item_id !== 'undefined' && charge_item_id !== "") {
        column += 'charge_item_id,';
        values += "'" + charge_item_id + "',";
      }		
			
			if (typeof clinical_impression_investigation_id !== 'undefined' && clinical_impression_investigation_id !== "") {
        column += 'clinical_impression_investigation_id,';
        values += "'" + clinical_impression_investigation_id + "',";
      }		
			
			if (typeof condition_stage_id !== 'undefined' && condition_stage_id !== "") {
        column += 'condition_stage_id,';
        values += "'" + condition_stage_id + "',";
      }		
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }		
			
      var query = "UPSERT INTO BACIRO_FHIR.DIAGNOSTIC_REPORT(diagnostic_report_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+diagnosticReport_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select diagnostic_report_id from BACIRO_FHIR.DIAGNOSTIC_REPORT WHERE diagnostic_report_id = '" + diagnosticReport_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDiagnosticReport"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDiagnosticReport"});
      });
    },
		diagnosticReportPerformer: function addDiagnosticReportPerformer(req, res) {
			console.log(req.body);
			var performer_id  = req.body.performer_id;
			var role  = req.body.role;
			var actor_practitioner  = req.body.actor_practitioner;
			var actor_organization  = req.body.actor_organization;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			
			var column = "";
      var values = "";
			
			if (typeof role !== 'undefined' && role !== "") {
        column += 'role,';
        values += "'" + role + "',";
      }
			
			if (typeof actor_practitioner !== 'undefined' && actor_practitioner !== "") {
        column += 'actor_practitioner,';
        values += "'" + actor_practitioner + "',";
      }
			
			if (typeof actor_organization !== 'undefined' && actor_organization !== "") {
        column += 'actor_organization,';
        values += "'" + actor_organization + "',";
      }
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.DIAGNOSTIC_REPORT_PERFORMER(performer_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+performer_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select performer_id from BACIRO_FHIR.DIAGNOSTIC_REPORT_PERFORMER WHERE performer_id = '" + performer_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDiagnosticReportPerformer"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDiagnosticReportPerformer"});
      });
    },
		diagnosticReportReportImage: function addDiagnosticReportReportImage(req, res) {
			console.log(req.body);
			var image_id   = req.body.image_id;
			var comment  = req.body.comment;
			var link  = req.body.link;
			var diagnostic_report_id   = req.body.diagnostic_report_id;

			var column = "";
      var values = "";
			
			if (typeof comment !== 'undefined' && comment !== "") {
        column += '"comment",';
        values += '"' + comment + '",';
      }
			
			if (typeof link !== 'undefined' && link !== "") {
        column += 'link,';
        values += '"' + link + '",';
      }
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += '"' + diagnostic_report_id + '",';
      }

      var query = 'UPSERT INTO BACIRO_FHIR.DIAGNOSTIC_REPORT_IMAGE(image_id, ' + column.slice(0, -1) + ')'+
        ' VALUES ("'+image_id+'", ' + values.slice(0, -1) + ')';
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select image_id from baciro_fhir.DIAGNOSTIC_REPORT_IMAGE WHERE image_id = '" + image_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDiagnosticReportReportImage"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDiagnosticReportReportImage"});
      });
    }
	},
	put: {
		diagnosticReport: function updateDiagnosticReport(req, res) {
			console.log(req.body);
			var diagnostic_report_id  = req.params.diagnostic_report_id;
			var status  = req.body.status;
			var category  = req.body.category;
			var code  = req.body.code;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var subject_device  = req.body.subject_device;
			var subject_location  = req.body.subject_location;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var effective_date_time  = req.body.effective_date_time;
			var effective_period_start  = req.body.effective_period_start;
			var effective_period_end  = req.body.effective_period_end;
			var issued  = req.body.issued;
			var conclusion  = req.body.conclusion;
			var coded_diagnosis  = req.body.coded_diagnosis;
			var charge_item_id  = req.body.charge_item_id;
			var clinical_impression_investigation_id  = req.body.clinical_impression_investigation_id;
			var condition_stage_id  = req.body.condition_stage_id;
			var procedure_id  = req.body.procedure_id;
			
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
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }	
			
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }	
			
			if (typeof subject_group !== 'undefined' && subject_group !== "") {
        column += 'subject_group,';
        values += "'" + subject_group + "',";
      }		
			
			if (typeof subject_device !== 'undefined' && subject_device !== "") {
        column += 'subject_device,';
        values += "'" + subject_device + "',";
      }	
			
			if (typeof subject_location !== 'undefined' && subject_location !== "") {
        column += 'subject_location,';
        values += "'" + subject_location + "',";
      }		
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }	
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }
			
			if (typeof effective_date_time !== 'undefined' && effective_date_time !== "") {
        column += 'effective_date_time,';
				values += "to_date('"+ effective_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_start !== 'undefined' && effective_period_start !== "") {
        column += 'effective_period_start,';
				values += "to_date('"+ effective_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_end !== 'undefined' && effective_period_end !== "") {
        column += 'effective_period_end,';
				values += "to_date('"+ effective_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof issued !== 'undefined' && issued !== "") {
        column += 'issued,';
				values += "to_date('"+ issued + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof conclusion !== 'undefined' && conclusion !== "") {
        column += 'conclusion,';
        values += "'" + conclusion + "',";
      }		
			
			if (typeof coded_diagnosis !== 'undefined' && coded_diagnosis !== "") {
        column += 'coded_diagnosis,';
        values += "'" + coded_diagnosis + "',";
      }		
			
			if (typeof charge_item_id !== 'undefined' && charge_item_id !== "") {
        column += 'charge_item_id,';
        values += "'" + charge_item_id + "',";
      }		
			
			if (typeof clinical_impression_investigation_id !== 'undefined' && clinical_impression_investigation_id !== "") {
        column += 'clinical_impression_investigation_id,';
        values += "'" + clinical_impression_investigation_id + "',";
      }		
			
			if (typeof condition_stage_id !== 'undefined' && condition_stage_id !== "") {
        column += 'condition_stage_id,';
        values += "'" + condition_stage_id + "',";
      }		
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }				
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "diagnostic_report_id = '" + diagnostic_report_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.DIAGNOSTIC_REPORT(diagnostic_report_id," + column.slice(0, -1) + ") SELECT diagnostic_report_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DIAGNOSTIC_REPORT WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select diagnostic_report_id from BACIRO_FHIR.DIAGNOSTIC_REPORT WHERE diagnostic_report_id = '" + diagnostic_report_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDiagnosticReport"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDiagnosticReport"});
      });
    },
		diagnosticReportPerformer: function updateDiagnosticReportPerformer(req, res) {
			console.log(req.body);
			var performer_id  = req.params.performer_id;
			var role  = req.body.role;
			var actor_practitioner  = req.body.actor_practitioner;
			var actor_organization  = req.body.actor_organization;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			
			var column = "";
      var values = "";
			
			if (typeof role !== 'undefined' && role !== "") {
        column += 'role,';
        values += "'" + role + "',";
      }
			
			if (typeof actor_practitioner !== 'undefined' && actor_practitioner !== "") {
        column += 'actor_practitioner,';
        values += "'" + actor_practitioner + "',";
      }
			
			if (typeof actor_organization !== 'undefined' && actor_organization !== "") {
        column += 'actor_organization,';
        values += "'" + actor_organization + "',";
      }
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }	
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "performer_id = '" + performer_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.DIAGNOSTIC_REPORT_PERFORMER(performer_id," + column.slice(0, -1) + ") SELECT performer_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DIAGNOSTIC_REPORT_PERFORMER WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select performer_id from BACIRO_FHIR.DIAGNOSTIC_REPORT_PERFORMER WHERE performer_id = '" + performer_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDiagnosticReportPerformer"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDiagnosticReportPerformer"});
      });
    },
		diagnosticReportReportImage: function updateDiagnosticReportReportImage(req, res) {
			console.log(req.body);
			var image_id   = req.params.image_id;
			var comment  = req.body.comment;
			var link  = req.body.link;
			var diagnostic_report_id   = req.body.diagnostic_report_id;

			var column = "";
      var values = "";
			
			if (typeof comment !== 'undefined' && comment !== "") {
        column += '"comment",';
        values += '"' + comment + '",';
      }
			
			if (typeof link !== 'undefined' && link !== "") {
        column += 'link,';
        values += '"' + link + '",';
      }
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += '"' + diagnostic_report_id + '",';
      }

			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "image_id = '" + image_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.DIAGNOSTIC_REPORT_IMAGE(image_id," + column.slice(0, -1) + ") SELECT image_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DIAGNOSTIC_REPORT_IMAGE WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select image_id from baciro_fhir.DIAGNOSTIC_REPORT_IMAGE WHERE image_id = '" + image_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDiagnosticReportReportImage"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDiagnosticReportReportImage"});
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