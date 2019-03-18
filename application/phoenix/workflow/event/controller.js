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
		event: function getEvent(req, res){
			var apikey = req.params.apikey;
			var eventId = req.query._id;
			
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
			
			if(typeof eventId !== 'undefined' && eventId !== ""){
        condition += "dr.diagnostic_report_id = '" + eventId + "' AND,";  
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


			
			var arrEvent = [];
      var query = "select ev.event_id as event_id, ev.status as status, ev.not_done as not_done, ev.not_done_reason as not_done_reason, ev.code as code, ev.subject_patient as subject_patient, ev.subject_group as subject_group, ev.context_encounter as context_encounter, ev.context_episode_of_care as context_episode_of_care, ev.occurrence_date_time as occurrence_date_time, ev.occurrence_period_start as occurrence_period_start, ev.occurrence_period_end as occurrence_period_end, ev.occurrence_timing as occurrence_timing, ev.reason_code as reason_code from BACIRO_FHIR.event ev " + fixCondition;
			//console.log(query);			
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Event = {};
					Event.resourceType = "Event";
          Event.id = rez[i].event_id;
					Event.status = rez[i].status;
					Event.notDone = rez[i].not_done;
					Event.notDoneReason = rez[i].not_done_reason;
					Event.code = rez[i].code;
					var arrSubject = [];
					var Subject = {};
					if(rez[i].subject_patient != "null"){
						Subject.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subject_patient;
					} else {
						Subject.patient = "";
					}
					if(rez[i].subject_group != "null"){
						Subject.group = hostFHIR + ':' + portFHIR + '/' + apikey + '/Group?_id=' +  rez[i].subject_group;
					} else {
						Subject.group = "";
					}
					arrSubject[i] = Subject;
					Event.subject = arrSubject;
					var arrContext = [];
					var Context = {};
					if(rez[i].context_encounter != "null"){
						Context.encounter = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].context_encounter;
					} else {
						Context.encounter = "";
					}
					if(rez[i].context_episode_of_care != "null"){
						Context.episodeOfCare = hostFHIR + ':' + portFHIR + '/' + apikey + '/Group?_id=' +  rez[i].context_episode_of_care;
					} else {
						Context.episodeOfCare = "";
					}
					arrContext[i] = Context;
					Event.context = arrContext;
					if(rez[i].occurrence_date_time == null){
						Event.occurrence.occurrenceDateTime = formatDate(rez[i].occurrence_date_time);
					}else{
						Event.occurrence.occurrenceDateTime = rez[i].occurrence_date_time;
					}
					var occurrenceperiod_start,occurrenceperiod_end;
					if(rez[i].occurrence_period_start == null){
						occurrenceperiod_start = formatDate(rez[i].occurrence_period_start);  
					}else{
						occurrenceperiod_start = rez[i].occurrence_period_start;  
					}
					if(rez[i].occurrence_period_end == null){
						occurrenceperiod_end = formatDate(rez[i].occurrence_period_end);  
					}else{
						occurrenceperiod_end = rez[i].occurrence_period_end;  
					}
					Event.occurrence.occurrencePeriod = occurrenceperiod_start + ' to ' + occurrenceperiod_end;
					Event.occurrence.occurrenceTiming = rez[i].occurrence_timing;
					Event.reasonCode = rez[i].reason_code;
					
          arrEvent[i] = Event;
        }
        res.json({"err_code":0,"data": arrEvent});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getEvent"});
      });
    },
		eventPerformer: function getEventPerformer(req, res) {
			var apikey = req.params.apikey;
			
			var eventPerformerId = req.query._id;
			var eventId = req.query.event_id;

			//susun query
			var condition = "";

			if (typeof eventPerformerId !== 'undefined' && eventPerformerId !== "") {
				condition += "performer_id = '" + eventPerformerId + "' AND ";
			}

			if (typeof eventId !== 'undefined' && eventId !== "") {
				condition += "event_id = '" + eventId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrEventPerformer = [];
			var query = "select performer_id, role, actor_practitioner, actor_organization, actor_patient, actor_device, actor_related_person, on_behalf_of from BACIRO_FHIR.event_performer " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var EventPerformer = {};
					EventPerformer.id = rez[i].performer_id;
					EventPerformer.role = rez[i].role;
					var arrActor = [];
					var Actor = {};
					if(rez[i].actor_practitioner != "null"){
						Subject.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].actor_practitioner;
					} else {
						Subject.practitioner = "";
					}
					if(rez[i].actor_organization != "null"){
						Subject.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].actor_organization;
					} else {
						Subject.organization = "";
					}
					if(rez[i].actor_patient != "null"){
						Subject.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].actor_patient;
					} else {
						Subject.patient = "";
					}
					if(rez[i].actor_device != "null"){
						Subject.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].actor_device;
					} else {
						Subject.device = "";
					}
					if(rez[i].actor_related_person != "null"){
						Subject.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].actor_related_person;
					} else {
						Subject.relatedPerson = "";
					}
					arrActor[i] = Actor;
					EventPerformer.actor = arrActor;
					if(rez[i].on_behalf_of != "null"){
						EventPerformer.onBehalfOf = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].on_behalf_of;
					} else {
						EventPerformer.onBehalfOf = "";
					}
					
					arrEventPerformer[i] = EventPerformer;
				}
				res.json({
					"err_code": 0,
					"data": arrEventPerformer
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEventPerformer"
				});
			});
		}
  },
	post: {
		event: function addEvent(req, res) {
			console.log(req.body);
			var event_id  = req.body.event_id;
			var part_of  = req.body.part_of;
			var status  = req.body.status;
			var not_done  = req.body.not_done;
			var not_done_reason  = req.body.not_done_reason;
			var code  = req.body.code;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var occurrence_date_time  = req.body.occurrence_date_time;
			var occurrence_period_start  = req.body.occurrence_period_start;
			var occurrence_period_end  = req.body.occurrence_period_end;
			var occurrence_timing  = req.body.occurrence_timing;
			var reason_code  = req.body.reason_code;
			
			var column = "";
      var values = "";
			
				
			if (typeof part_of !== 'undefined' && part_of !== "") {
        column += 'part_of,';
        values += "'" + part_of + "',";
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
			
			if (typeof occurrence_date_time !== 'undefined' && occurrence_date_time !== "") {
        column += 'occurrence_date_time,';
				values += "to_date('"+ occurrence_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof occurrence_period_start !== 'undefined' && occurrence_period_start !== "") {
        column += 'occurrence_period_start,';
				values += "to_date('"+ occurrence_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof occurrence_period_end !== 'undefined' && occurrence_period_end !== "") {
        column += 'occurrence_period_end,';
				values += "to_date('"+ occurrence_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof occurrence_timing !== 'undefined' && occurrence_timing !== "") {
        column += 'occurrence_timing,';
        values += "'" + occurrence_timing + "',";
      }		
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.event(event_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+event_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select event_id from BACIRO_FHIR.event WHERE event_id = '" + event_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEvent"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEvent"});
      });
    },
		eventPerformer: function addEventPerformer(req, res) {
			console.log(req.body);
			var performer_id  = req.body.performer_id;
			var role  = req.body.role;
			var actor_practitioner  = req.body.actor_practitioner;
			var actor_organization  = req.body.actor_organization;
			var actor_patient  = req.body.actor_patient;
			var actor_device  = req.body.actor_device;
			var actor_related_person  = req.body.actor_related_person;
			var on_behalf_of  = req.body.on_behalf_of;
			var event_id  = req.body.event_id;
			
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
			
			if (typeof actor_device !== 'undefined' && actor_device !== "") {
        column += 'actor_device,';
        values += "'" + actor_device + "',";
      }
			
			if (typeof actor_related_person !== 'undefined' && actor_related_person !== "") {
        column += 'actor_related_person,';
        values += "'" + actor_related_person + "',";
      }
			
			if (typeof on_behalf_of !== 'undefined' && on_behalf_of !== "") {
        column += 'on_behalf_of,';
        values += "'" + on_behalf_of + "',";
      }
			
			if (typeof event_id !== 'undefined' && event_id !== "") {
        column += 'event_id,';
        values += "'" + event_id + "',";
      }		

      var query = "UPSERT INTO BACIRO_FHIR.event_performer(performer_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+performer_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select performer_id from BACIRO_FHIR.event_performer WHERE performer_id = '" + performer_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEventPerformer"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEventPerformer"});
      });
    }
	},
	put: {
		event: function updateEvent(req, res) {
			console.log(req.body);
			var event_id  = req.params.event_id;
			var part_of  = req.body.part_of;
			var status  = req.body.status;
			var not_done  = req.body.not_done;
			var not_done_reason  = req.body.not_done_reason;
			var code  = req.body.code;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var occurrence_date_time  = req.body.occurrence_date_time;
			var occurrence_period_start  = req.body.occurrence_period_start;
			var occurrence_period_end  = req.body.occurrence_period_end;
			var occurrence_timing  = req.body.occurrence_timing;
			var reason_code  = req.body.reason_code;
			
			var column = "";
      var values = "";
			
				
			if (typeof part_of !== 'undefined' && part_of !== "") {
        column += 'part_of,';
        values += "'" + part_of + "',";
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
			
			if (typeof occurrence_date_time !== 'undefined' && occurrence_date_time !== "") {
        column += 'occurrence_date_time,';
				values += "to_date('"+ occurrence_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof occurrence_period_start !== 'undefined' && occurrence_period_start !== "") {
        column += 'occurrence_period_start,';
				values += "to_date('"+ occurrence_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof occurrence_period_end !== 'undefined' && occurrence_period_end !== "") {
        column += 'occurrence_period_end,';
				values += "to_date('"+ occurrence_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof occurrence_timing !== 'undefined' && occurrence_timing !== "") {
        column += 'occurrence_timing,';
        values += "'" + occurrence_timing + "',";
      }		
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }
			
			
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "event_id = '" + event_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.event(event_id," + column.slice(0, -1) + ") SELECT event_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.event WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select event_id from BACIRO_FHIR.event WHERE event_id = '" + event_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateEvent"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateEvent"});
      });
    },
		eventPerformer: function updateEventPerformer(req, res) {
			console.log(req.body);
			var performer_id  = req.params.performer_id;
			var role  = req.body.role;
			var actor_practitioner  = req.body.actor_practitioner;
			var actor_organization  = req.body.actor_organization;
			var actor_patient  = req.body.actor_patient;
			var actor_device  = req.body.actor_device;
			var actor_related_person  = req.body.actor_related_person;
			var on_behalf_of  = req.body.on_behalf_of;
			var event_id  = req.body.event_id;
			
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
			
			if (typeof actor_device !== 'undefined' && actor_device !== "") {
        column += 'actor_device,';
        values += "'" + actor_device + "',";
      }
			
			if (typeof actor_related_person !== 'undefined' && actor_related_person !== "") {
        column += 'actor_related_person,';
        values += "'" + actor_related_person + "',";
      }
			
			if (typeof on_behalf_of !== 'undefined' && on_behalf_of !== "") {
        column += 'on_behalf_of,';
        values += "'" + on_behalf_of + "',";
      }
			
			if (typeof event_id !== 'undefined' && event_id !== "") {
        column += 'event_id,';
        values += "'" + event_id + "',";
      }	
      
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "performer_id = '" + performer_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.event_performer(performer_id," + column.slice(0, -1) + ") SELECT performer_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.event_performer WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select performer_id from BACIRO_FHIR.event_performer WHERE performer_id = '" + performer_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateEventPerformer"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateEventPerformer"});
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