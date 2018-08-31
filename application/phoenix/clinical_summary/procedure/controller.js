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
		procedure: function getProcedure(req, res){
			var apikey = req.params.apikey;
			var procedureId = req.query._id;
			
			var based_on = req.query.based_on;
			var category = req.query.category;
			var code = req.query.code;
			var context = req.query.context;
			var date = req.query.date;
			var definition = req.query.definition;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var location = req.query.location;
			var part_of = req.query.part_of;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var status = req.query.status;
			var subject = req.query.subject;
			
      //susun query
      var condition = "";
      var join = "";
			
			if(typeof procedureId !== 'undefined' && procedureId !== ""){
        condition += "pr.PROCEDURE_ID = '" + procedureId + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
        condition += "pr.code = '" + code + "' AND,";  
      }
			
			if(typeof category !== 'undefined' && category !== ""){
        condition += "pr.category = '" + category + "' AND,";  
      }
			
			if(typeof context !== 'undefined' && context !== ""){
				condition += "(pr.CONTEXT_ENCOUNTER = '" + context + "' OR pr.CONTEXT_EPISODE_OF_CARE = '" + context + "') AND,";  
			}
			
			if (typeof date !== 'undefined' && date !== "") {
        condition += "pr.PERFORMED_PERIOD_START <= to_date('" + date + "', 'yyyy-MM-dd') AND pr.PERFORMED_PERIOD_END >= to_date('" + date + "', 'yyyy-MM-dd') AND,";
      }
			
			/*if(typeof definition !== 'undefined' && definition !== ""){
			
			var res = definition.substring(0, 3);
					if(res == 'pat'){
						join += " LEFT JOIN BACIRO_FHIR.PlanDefinition ctp on ct.PROCEDURE_ID = ctp.PROCEDURE_ID ";
        		condition += "(ctp.MEMBER_PRACTITIONER = '" + participant + "') AND,";
					} else if (res == 'dev'){
						subjectPatient = '';
						subjectResearchSubject  = '';
						subjectMedication = '';
						subjectDevice = subject;
					} else if (res == 'med'){
						subjectPatient = '';
						subjectResearchSubject  = '';
						subjectMedication = subject;
						subjectDevice = '';
					} else {
						subjectPatient = '';
						subjectResearchSubject  = subject;
						subjectMedication = '';
						subjectDevice = '';
					}
					
				join += " LEFT JOIN BACIRO_FHIR.CARE_TEAM_PARTICIPANT ctp on ct.CARE_TEAM_ID = ctp.CARE_TEAM_ID ";
        condition += "(ctp.MEMBER_PRACTITIONER = '" + participant + "' OR ctp.MEMBER_RELATED_PERSON = '" + participant + "' OR ctp.MEMBER_PATIENT = '" + participant + "' OR ctp.MEMBER_ORGANIZATION = '" + participant + "' OR ctp.MEMBER_CARE_TEAM = '" + participant + "') AND,";
      }*/
			
			if(typeof encounter !== 'undefined' && encounter !== ""){
				condition += "pr.CONTEXT_ENCOUNTER = '" + encounter + "' AND,";  
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on pr.PROCEDURE_ID = i.PROCEDURE_ID ";
        condition += "i.IDENTIFIER_ID = '" + identifier + "' AND,";  
      }
			
			if(typeof location !== 'undefined' && location !== ""){
				condition += "pr.LOCATION_ID = '" + location + "' AND,";  
      }
			
			if(typeof part_of !== 'undefined' && part_of !== ""){
				condition += "pr.PART_OF_PROCEDURE = '" + part_of + "' AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "pr.SUBJECT_PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof performer !== 'undefined' && performer !== ""){
				join += " LEFT JOIN BACIRO_FHIR.PROCEDURE_PERFORMER pp on pr.PROCEDURE_ID = pp.PROCEDURE_ID ";
        condition += "(pp.ACTOR_PRACTITIONER = '" + performer + "' OR pp.ACTOR_ORGANIZATION = '" + performer + "' OR pp.ACTOR_PATIENT = '" + performer + "' OR pp.ACTOR_RELATED_PERSON = '" + performer + "' OR pp.ACTOR_DEVICE = '" + performer + "') AND,"; 
      }
			
			if(typeof status !== 'undefined' && status !== ""){
        condition += "ct.STATUS = '" + status + "' AND,";  
      }
			
			if(typeof subject !== 'subject' && subject !== ""){
				condition += "(ct.SUBJECT_PATIENT = '" + subject + "' OR ct.SUBJECT_GROUP = '" + subject + "') AND,";  
			}
			
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrProcedure = [];
      var query = "select procedure_id, part_of_procedure, status, not_done, not_done_reason, category, code, subject_patient, subject_group, context_encounter, context_episode_of_care, performed_date_time, performed_period_start, performed_period_end, location, reason_code, body_site, outcome, complication, follow_up, used_code from baciro_fhir.procedure pr " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Procedure = {};
					Procedure.resourceType = "Procedure";
          Procedure.id = rez[i].procedure_id;
					Procedure.partOf = rez[i].part_of_procedure;
					Procedure.status = rez[i].status;
					Procedure.not_done = rez[i].not_done;
					Procedure.not_done_reason = rez[i].not_done_reason;
					Procedure.category = rez[i].category;
					Procedure.code = rez[i].code;
					if (rez[i].subject_group !== 'null') {
						Procedure.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Group?_id=' +  rez[i].subject_group;
					} else if (rez[i].subject_patient !== 'null') {
						Procedure.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subject_patient;
					} else {
						Procedure.subject = "";
					}
					if (rez[i].context_encounter !== 'null') {
						Procedure.context = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].context_encounter;
					} else if (rez[i].context_episode_of_care !== 'null') {
						Procedure.context = hostFHIR + ':' + portFHIR + '/' + apikey + '/EpisodeOfCare?_id=' +  rez[i].context_episode_of_care;
					} else {
						Procedure.context = "";
					}
					Procedure.performed.performedDateTime = rez[i].performed_date_time;
					Procedure.performed.performedPeriod = rez[i].performed_period_start + ' to ' + rez[i].performed_period_end;
					Procedure.location = rez[i].location;
					Procedure.reasonCode = rez[i].reason_code;
					
					Procedure.bodySite = rez[i].body_site;
					Procedure.outcome = rez[i].outcome;
					Procedure.complication = rez[i].complication;
					Procedure.follow_up = rez[i].follow_up;
					Procedure.used_code = rez[i].used_code;
					
          arrProcedure[i] = Procedure;
        }
        res.json({"err_code":0,"data": arrProcedure});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getProcedure"});
      });
    },
		procedurePerformer: function getProcedurePerformer(req, res) {
			var apikey = req.params.apikey;
			
			var procedurePerformerId = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = "";

			if (typeof procedurePerformerId !== 'undefined' && procedurePerformerId !== "") {
				condition += "PERFORMER_ID = '" + procedurePerformerId + "' AND ";
			}

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "PROCEDURE_ID = '" + procedureId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrProcedurePerformer = [];
			var query = "sselect performer_id, role, actor_practitioner, actor_organization, actor_patient, actor_related_person, actor_device, on_behalf_of, procedure_id from baciro_fhir.procedure_performer " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ProcedurePerformer = {};
					ProcedurePerformer.id = rez[i].participant_id;
					ProcedurePerformer.role = rez[i].role;
					if (rez[i].actor_practitioner == null) {
						ProcedurePerformer.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].actor_practitioner;
					} else if (rez[i].actor_organization == null) {
						ProcedurePerformer.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' + rez[i].actor_organization;
					} else if (rez[i].actor_patient == null) {
						ProcedurePerformer.actor =  hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +rez[i].actor_patient;
					} else if (rez[i].actor_related_person == null) {
						ProcedurePerformer.actor =  hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' + rez[i].actor_related_person;
					} else if (rez[i].actor_device == null) {
						ProcedurePerformer.actor =  hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' + rez[i].actor_device;
					} else {
						ProcedurePerformer.actor = "";
					}
					ProcedurePerformer.onBehalfOf = rez[i].on_behalf_of;
					
					arrProcedurePerformer[i] = ProcedurePerformer;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedurePerformer
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedurePerformer"
				});
			});
		}
		
  },
	post: {
		procedure: function addProcedure(req, res) {
			console.log(req.body);
			
			var procedure_id = req.body.procedure_id;
			var part_of_procedure = req.body.part_of_procedure;
			var status = req.body.status;
			var not_done = req.body.not_done;
			var not_done_reason = req.body.not_done_reason;
			var category = req.body.category;
			var code = req.body.code;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var performed_date_time = req.body.performed_date_time;
			var performed_period_start = req.body.performed_period_start;
			var performed_period_end = req.body.performed_period_end;
			var location = req.body.location;
			var reason_code = req.body.reason_code;
			var body_site = req.body.body_site;
			var outcome = req.body.outcome;
			var complication = req.body.complication;
			var follow_up = req.body.follow_up;
			var used_code = req.body.used_code;
			var clinical_impression_id = req.body.clinical_impression_id;
			
			var column = "";
      var values = "";
			
			if (typeof part_of_procedure !== 'undefined' && part_of_procedure !== "") {
        column += 'part_of_procedure,';
        values += "'" + part_of_procedure + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof not_done !== 'undefined' && not_done !== "") {
        column += 'not_done,';
        values += " " + not_done + ",";
      }
			
			if (typeof not_done_reason !== 'undefined' && not_done_reason !== "") {
        column += 'not_done_reason,';
        values += "'" + not_done_reason + "',";
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
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }	
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }	
			
			if (typeof performed_date_time !== 'undefined' && performed_date_time !== "") {
        column += 'performed_date_time,';
        //values += "'" + date + "',";
				values += "to_date('"+ performed_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof performed_period_start !== 'undefined' && performed_period_start !== "") {
        column += 'performed_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ performed_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof performed_period_end !== 'undefined' && performed_period_end !== "") {
        column += 'performed_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ performed_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof location !== 'undefined' && location !== "") {
        column += 'location,';
        values += "'" + location + "',";
      }	
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }	
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
      }	
			
			if (typeof outcome !== 'undefined' && outcome !== "") {
        column += 'outcome,';
        values += "'" + outcome + "',";
      }	
			
			if (typeof complication !== 'undefined' && complication !== "") {
        column += 'complication,';
        values += "'" + complication + "',";
      }	
			
			if (typeof follow_up !== 'undefined' && follow_up !== "") {
        column += 'follow_up,';
        values += "'" + follow_up + "',";
      }	
			
			if (typeof used_code !== 'undefined' && used_code !== "") {
        column += 'used_code,';
        values += "'" + used_code + "',";
      }	
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.PROCEDURE(procedure_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+procedure_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select procedure_id, part_of_procedure, status, not_done, not_done_reason, category, code, subject_patient, subject_group, context_encounter, context_episode_of_care, performed_date_time, performed_period_start, performed_period_end, location, reason_code, body_site, outcome, complication, follow_up, used_code, clinical_impression_id from baciro_fhir.procedure WHERE procedure_id = '" + procedure_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProcedure"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addProcedure"});
      });
    },
		procedurePerformer: function addProcedurePerformer(req, res) {
			console.log(req.body);
			var performer_id = req.body.performer_id;
			var role = req.body.role;
			var actor_practitioner = req.body.actor_practitioner;
			var actor_organization = req.body.actor_organization;
			var actor_patient = req.body.actor_patient;
			var actor_related_person = req.body.actor_related_person;
			var actor_device = req.body.actor_device;
			var on_behalf_of = req.body.on_behalf_of;
			var procedure_id = req.body.procedure_id;
			
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
			
			if (typeof actor_patient !== 'undefined' && actor_patient !== "") {
        column += 'actor_patient,';
        values += "'" + actor_patient + "',";
      }
			
			if (typeof actor_related_person !== 'undefined' && actor_related_person !== "") {
        column += 'actor_related_person,';
        values += "'" + actor_related_person + "',";
      }	
			
			if (typeof actor_device !== 'undefined' && actor_device !== "") {
        column += 'actor_device,';
        values += "'" + actor_device + "',";
      }	
			
			if (typeof on_behalf_of !== 'undefined' && on_behalf_of !== "") {
        column += 'on_behalf_of,';
        values += "'" + on_behalf_of + "',";
      }	
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.procedure_performer(performer_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+performer_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select performer_id, role, actor_practitioner, actor_organization, actor_patient, actor_related_person, actor_device, on_behalf_of, procedure_id from baciro_fhir.procedure_performer WHERE performer_id = '" + performer_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProcedurePerformer"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addProcedurePerformer"});
      });
    }
		
	},
	put: {
		procedure: function updateProcedure(req, res) {
			console.log(req.body);
			var procedure_id = req.params.procedure_id;
			var part_of_procedure = req.body.part_of_procedure;
			var status = req.body.status;
			var not_done = req.body.not_done;
			var not_done_reason = req.body.not_done_reason;
			var category = req.body.category;
			var code = req.body.code;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var performed_date_time = req.body.performed_date_time;
			var performed_period_start = req.body.performed_period_start;
			var performed_period_end = req.body.performed_period_end;
			var location = req.body.location;
			var reason_code = req.body.reason_code;
			var body_site = req.body.body_site;
			var outcome = req.body.outcome;
			var complication = req.body.complication;
			var follow_up = req.body.follow_up;
			var used_code = req.body.used_code;
			var clinical_impression_id = req.body.clinical_impression_id;
			
			var column = "";
      var values = "";
			
			if (typeof part_of_procedure !== 'undefined' && part_of_procedure !== "") {
        column += 'part_of_procedure,';
        values += "'" + part_of_procedure + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof not_done !== 'undefined' && not_done !== "") {
        column += 'not_done,';
        values += " " + not_done + ",";
      }
			
			if (typeof not_done_reason !== 'undefined' && not_done_reason !== "") {
        column += 'not_done_reason,';
        values += "'" + not_done_reason + "',";
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
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }	
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }	
			
			if (typeof performed_date_time !== 'undefined' && performed_date_time !== "") {
        column += 'performed_date_time,';
        //values += "'" + date + "',";
				values += "to_date('"+ performed_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof performed_period_start !== 'undefined' && performed_period_start !== "") {
        column += 'performed_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ performed_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof performed_period_end !== 'undefined' && performed_period_end !== "") {
        column += 'performed_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ performed_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof location !== 'undefined' && location !== "") {
        column += 'location,';
        values += "'" + location + "',";
      }	
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }	
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
      }	
			
			if (typeof outcome !== 'undefined' && outcome !== "") {
        column += 'outcome,';
        values += "'" + outcome + "',";
      }	
			
			if (typeof complication !== 'undefined' && complication !== "") {
        column += 'complication,';
        values += "'" + complication + "',";
      }	
			
			if (typeof follow_up !== 'undefined' && follow_up !== "") {
        column += 'follow_up,';
        values += "'" + follow_up + "',";
      }	
			
			if (typeof used_code !== 'undefined' && used_code !== "") {
        column += 'used_code,';
        values += "'" + used_code + "',";
      }	
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }		
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "procedure_id = '" + procedure_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.procedure(procedure_id," + column.slice(0, -1) + ") SELECT procedure_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.procedure WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select procedure_id, part_of_procedure, status, not_done, not_done_reason, category, code, subject_patient, subject_group, context_encounter, context_episode_of_care, performed_date_time, performed_period_start, performed_period_end, location, reason_code, body_site, outcome, complication, follow_up, used_code, clinical_impression_id from baciro_fhir.procedure WHERE procedure_id = '" + procedure_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedure"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedure"});
      });
    },
		procedurePerformer: function updateProcedurePerformer(req, res) {
			console.log(req.body);
			
			var performer_id = req.params.performer_id;
			var role = req.body.role;
			var actor_practitioner = req.body.actor_practitioner;
			var actor_organization = req.body.actor_organization;
			var actor_patient = req.body.actor_patient;
			var actor_related_person = req.body.actor_related_person;
			var actor_device = req.body.actor_device;
			var on_behalf_of = req.body.on_behalf_of;
			var procedure_id = req.body.procedure_id;
			
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
			
			if (typeof actor_patient !== 'undefined' && actor_patient !== "") {
        column += 'actor_patient,';
        values += "'" + actor_patient + "',";
      }
			
			if (typeof actor_related_person !== 'undefined' && actor_related_person !== "") {
        column += 'actor_related_person,';
        values += "'" + actor_related_person + "',";
      }	
			
			if (typeof actor_device !== 'undefined' && actor_device !== "") {
        column += 'actor_device,';
        values += "'" + actor_device + "',";
      }	
			
			if (typeof on_behalf_of !== 'undefined' && on_behalf_of !== "") {
        column += 'on_behalf_of,';
        values += "'" + on_behalf_of + "',";
      }	
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }	

     
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "performer_id = '" + performer_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.procedure_performer(performer_id," + column.slice(0, -1) + ") SELECT performer_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.procedure_performer WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select performer_id, role, actor_practitioner, actor_organization, actor_patient, actor_related_person, actor_device, on_behalf_of, procedure_id from baciro_fhir.procedure_performer WHERE performer_id = '" + performer_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedurePerformer"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedurePerformer"});
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