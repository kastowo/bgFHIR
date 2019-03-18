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
		deviceRequest: function getDeviceRequest(req, res){
			var apikey = req.params.apikey;
			var deviceRequestId = req.query._id;
			
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
			
			if(typeof deviceRequestId !== 'undefined' && deviceRequestId !== ""){
        condition += "dr.diagnostic_report_id = '" + deviceRequestId + "' AND,";  
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
			
			var arrDeviceRequest = [];
      var query = "select dr.device_request_id as device_request_id, dr.group_identifier as group_identifier, dr.status as status, dr.intent as intent, dr.priority as priority, dr.code_reference as code_reference, dr.code_codeable_concept as code_codeable_concept, dr.subject_patient as subject_patient, dr.subject_group as subject_group, dr.subject_location as subject_location, dr.subject_device as subject_device, dr.context_encounter as context_encounter, dr.context_episode_of_care as context_episode_of_care, dr.occurence_date_time as occurence_date_time, dr.occurence_period_start as occurence_period_start, dr.occurence_period_end as occurence_period_end, dr.occurence_timing as occurence_timing, dr.authored_on as authored_on, dr.requester_agent_device as requester_agent_device, dr.requester_agent_practitioner as requester_agent_practitioner, dr.requester_agent_organization as requester_agent_organization, dr.requester_on_behalf_of as requester_on_behalf_of, dr.performer_type as performer_type, dr.performer_practitioner as performer_practitioner, dr.performer_organization as performer_organization, dr.performer_patient as performer_patient, dr.performer_device as performer_device, dr.performer_related_person as performer_related_person, dr.performer_healthcare_service as performer_healthcare_service, dr.reason_code as reason_code, dr.reason_reference as reason_reference, dr.supporting_info as supporting_info from BACIRO_FHIR.device_request dr " + fixCondition;
			//console.log(query);			
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var DeviceRequest = {};
					DeviceRequest.resourceType = "DeviceRequest";
          DeviceRequest.id = rez[i].device_request_id;
					DeviceRequest.groupIdentifier = rez[i].group_identifier;
					DeviceRequest.status = rez[i].status;
					DeviceRequest.intent = rez[i].intent;
					DeviceRequest.priority = rez[i].priority;
					if (rez[i].code_reference !== 'null') {
						DeviceRequest.code.codeReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].code_reference;
					} else {
						DeviceRequest.code.codeReference = "";
					}
					DeviceRequest.code.codeCodeableConcept = rez[i].code_codeable_concept;
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
					if(rez[i].subject_location != "null"){
						Subject.location = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].subject_location;
					} else {
						Subject.location = "";
					}
					if(rez[i].subject_device != "null"){
						Subject.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].subject_device;
					} else {
						Subject.device = "";
					}
					arrSubject[i] = Subject;
					
					var arrContext = [];
					var Context = {};
					if(rez[i].context_encounter != "null"){
						Context.encounter = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].context_encounter;
					} else {
						Context.encounter = "";
					}
					if(rez[i].context_episode_of_care != "null"){
						Context.episodeOfCare = hostFHIR + ':' + portFHIR + '/' + apikey + '/EpisodeOfCare?_id=' +  rez[i].context_episode_of_care;
					} else {
						Context.episodeOfCare = "";
					}
					arrContext[i] = Context;
					DeviceRequest.subject = arrSubject;
					DeviceRequest.context = arrContext;
					if(rez[i].occurence_date_time == null){
						DeviceRequest.occurrence.occurrenceDateTime = formatDate(rez[i].occurence_date_time);
					}else{
						DeviceRequest.occurrence.occurrenceDateTime = rez[i].date;
					}
					var occurrenceperiod_start,occurrenceperiod_end;
					if(rez[i].occurence_period_start == null){
						occurrenceperiod_start = formatDate(rez[i].occurence_period_start);  
					}else{
						occurrenceperiod_start = rez[i].occurence_period_start;  
					}
					if(rez[i].occurence_period_end == null){
						occurrenceperiod_end = formatDate(rez[i].occurence_period_end);  
					}else{
						occurrenceperiod_end = rez[i].occurence_period_end;  
					}
					DeviceRequest.occurrence.occurrencePeriod = occurrenceperiod_start + ' to ' + occurrenceperiod_end;
					DeviceRequest.occurrence.occurenceTiming = rez[i].occurence_timing;
					if(rez[i].authored_on == null){
						DeviceRequest.authoredOn = formatDate(rez[i].authored_on);
					}else{
						DeviceRequest.authoredOn = rez[i].authored_on;
					}
					var arrRequester = [];
					var Requester = {};
					if(rez[i].requester_agent_device != "null"){
						Requester.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].requester_agent_device;
					} else {
						Requester.device = "";
					}
					if(rez[i].requester_agent_practitioner != "null"){
						Requester.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].requester_agent_practitioner;
					} else {
						Requester.practitioner = "";
					}
					if(rez[i].requester_agent_organization != "null"){
						Requester.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].requester_agent_organization;
					} else {
						Requester.organization = "";
					}
					arrRequester[i] = Requester;
					DeviceRequest.requester.agent = arrRequester;
					if(rez[i].requester_on_behalf_of != "null"){
						DeviceRequest.requester.onBehalfOf = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].requester_on_behalf_of;
					} else {
						DeviceRequest.requester.onBehalfOf = "";
					}
					DeviceRequest.performerType = rez[i].performer_type;
					var arrPerformer = [];
					var Performer = {};
					if(rez[i].requester_agent_device != "null"){
						Performer.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].requester_agent_device;
					} else {
						Performer.device = "";
					}
					if(rez[i].requester_agent_practitioner != "null"){
						Performer.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].requester_agent_practitioner;
					} else {
						Performer.practitioner = "";
					}
					if(rez[i].requester_agent_organization != "null"){
						Performer.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].requester_agent_organization;
					} else {
						Performer.organization = "";
					}
					if(rez[i].performer_patient != "null"){
						Performer.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].performer_patient;
					} else {
						Performer.patient = "";
					}
					if(rez[i].performer_related_person != "null"){
						Performer.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].performer_related_person;
					} else {
						Performer.relatedPerson = "";
					}
					if(rez[i].performer_healthcare_service != "null"){
						Performer.healthcareService = hostFHIR + ':' + portFHIR + '/' + apikey + '/HealthcareService?_id=' +  rez[i].performer_healthcare_service;
					} else {
						Performer.healthcareService = "";
					}
					arrPerformer[i] = Performer;
					DeviceRequest.performer = arrPerformer;
					DeviceRequest.reasonCode = rez[i].reason_code;
					DeviceRequest.reasonReference = rez[i].reason_reference;
					DeviceRequest.supportingInfo = rez[i].supporting_info;
					
          arrDeviceRequest[i] = DeviceRequest;
        }
        res.json({"err_code":0,"data": arrDeviceRequest});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceRequest"});
      });
    }
  },
	post: {
		deviceRequest: function addDeviceRequest(req, res) {
			console.log(req.body);
			var device_request_id  = req.body.device_request_id;
			var group_identifier  = req.body.group_identifier;
			var status  = req.body.status;
			var intent  = req.body.intent;
			var priority  = req.body.priority;
			var code_reference  = req.body.code_reference;
			var code_codeable_concept  = req.body.code_codeable_concept;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var subject_location  = req.body.subject_location;
			var subject_device  = req.body.subject_device;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var occurence_date_time  = req.body.occurence_date_time;
			var occurence_period_start  = req.body.occurence_period_start;
			var occurence_period_end  = req.body.occurence_period_end;
			var occurence_timing  = req.body.occurence_timing;
			var authored_on  = req.body.authored_on;
			var requester  = req.body.requester;
			var requester_agent_device  = req.body.requester_agent_device;
			var requester_agent_practitioner  = req.body.requester_agent_practitioner;
			var requester_agent_organization  = req.body.requester_agent_organization;
			var requester_on_behalf_of  = req.body.requester_on_behalf_of;
			var performer_type  = req.body.performer_type;
			var performer_practitioner  = req.body.performer_practitioner;
			var performer_organization  = req.body.performer_organization;
			var performer_patient  = req.body.performer_patient;
			var performer_device  = req.body.performer_device;
			var performer_related_person  = req.body.performer_related_person;
			var performer_healthcare_service  = req.body.performer_healthcare_service;
			var reason_code  = req.body.reason_code;
			var reason_reference  = req.body.reason_reference;
			var supporting_info  = req.body.supporting_info;
			var observation_id  = req.body.observation_id;
			
			var column = "";
      var values = "";
			
			if (typeof group_identifier !== 'undefined' && group_identifier !== "") {
        column += 'group_identifier,';
        values += "'" + group_identifier + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }	
			
			if (typeof intent !== 'undefined' && intent !== "") {
        column += 'intent,';
        values += "'" + intent + "',";
      }	
			
			if (typeof priority !== 'undefined' && priority !== "") {
        column += 'priority,';
        values += "'" + priority + "',";
      }	
			
			if (typeof code_reference !== 'undefined' && code_reference !== "") {
        column += 'code_reference,';
        values += "'" + code_reference + "',";
      }		
			
			if (typeof code_codeable_concept !== 'undefined' && code_codeable_concept !== "") {
        column += 'code_codeable_concept,';
        values += "'" + code_codeable_concept + "',";
      }	
			
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }
			
			if (typeof subject_group !== 'undefined' && subject_group !== "") {
        column += 'subject_group,';
        values += "'" + subject_group + "',";
      }	
			
			if (typeof subject_location !== 'undefined' && subject_location !== "") {
        column += 'subject_location,';
        values += "'" + subject_location + "',";
      }	
			
			if (typeof subject_device !== 'undefined' && subject_device !== "") {
        column += 'subject_device,';
        values += "'" + subject_device + "',";
      }	
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }		
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }	
			
			if (typeof occurence_date_time !== 'undefined' && occurence_date_time !== "") {
        column += 'occurence_date_time,';
				values += "to_date('"+ occurence_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof occurence_period_start !== 'undefined' && occurence_period_start !== "") {
        column += 'occurence_period_start,';
				values += "to_date('"+ occurence_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof occurence_period_end !== 'undefined' && occurence_period_end !== "") {
        column += 'occurence_period_end,';
				values += "to_date('"+ occurence_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof occurence_timing !== 'undefined' && occurence_timing !== "") {
        column += 'occurence_timing,';
        values += "'" + occurence_timing + "',";
      }
			
			if (typeof authored_on !== 'undefined' && authored_on !== "") {
        column += 'authored_on,';
				values += "to_date('"+ authored_on + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof requester_agent_device !== 'undefined' && requester_agent_device !== "") {
        column += 'requester_agent_device,';
        values += "'" + requester_agent_device + "',";
      }	
			
			if (typeof requester_agent_practitioner !== 'undefined' && requester_agent_practitioner !== "") {
        column += 'requester_agent_practitioner,';
        values += "'" + requester_agent_practitioner + "',";
      }	
			
			if (typeof requester_agent_organization !== 'undefined' && requester_agent_organization !== "") {
        column += 'requester_agent_organization,';
        values += "'" + requester_agent_organization + "',";
      }
				
			if (typeof requester_on_behalf_of !== 'undefined' && requester_on_behalf_of !== "") {
        column += 'requester_on_behalf_of,';
        values += "'" + requester_on_behalf_of + "',";
      }		
			
			if (typeof performer_type !== 'undefined' && performer_type !== "") {
        column += 'performer_type,';
        values += "'" + performer_type + "',";
      }		
			
			if (typeof performer_practitioner !== 'undefined' && performer_practitioner !== "") {
        column += 'performer_practitioner,';
        values += "'" + performer_practitioner + "',";
      }		
			
			if (typeof performer_organization !== 'undefined' && performer_organization !== "") {
        column += 'performer_organization,';
        values += "'" + performer_organization + "',";
      }		
			
			if (typeof performer_patient !== 'undefined' && performer_patient !== "") {
        column += 'performer_patient,';
        values += "'" + performer_patient + "',";
      }		
			
			if (typeof performer_device !== 'undefined' && performer_device !== "") {
        column += 'performer_device,';
        values += "'" + performer_device + "',";
      }		
			
			if (typeof performer_related_person !== 'undefined' && performer_related_person !== "") {
        column += 'performer_related_person,';
        values += "'" + performer_related_person + "',";
      }		
			
			if (typeof performer_healthcare_service !== 'undefined' && performer_healthcare_service !== "") {
        column += 'performer_healthcare_service,';
        values += "'" + performer_healthcare_service + "',";
      }
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }		
			
			if (typeof reason_reference !== 'undefined' && reason_reference !== "") {
        column += 'reason_reference,';
        values += "'" + reason_reference + "',";
      }	
			
			if (typeof supporting_info !== 'undefined' && supporting_info !== "") {
        column += 'supporting_info,';
        values += "'" + supporting_info + "',";
      }
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.device_request(device_request_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+device_request_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select device_request_id from BACIRO_FHIR.device_request WHERE device_request_id = '" + device_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceRequest"});
      });
    }
	},
	put: {
		deviceRequest: function updateDeviceRequest(req, res) {
			console.log(req.body);
			var device_request_id  = req.params.device_request_id;
			var group_identifier  = req.body.group_identifier;
			var status  = req.body.status;
			var intent  = req.body.intent;
			var priority  = req.body.priority;
			var code_reference  = req.body.code_reference;
			var code_codeable_concept  = req.body.code_codeable_concept;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var subject_location  = req.body.subject_location;
			var subject_device  = req.body.subject_device;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var occurence_date_time  = req.body.occurence_date_time;
			var occurence_period_start  = req.body.occurence_period_start;
			var occurence_period_end  = req.body.occurence_period_end;
			var occurence_timing  = req.body.occurence_timing;
			var authored_on  = req.body.authored_on;
			var requester  = req.body.requester;
			var requester_agent_device  = req.body.requester_agent_device;
			var requester_agent_practitioner  = req.body.requester_agent_practitioner;
			var requester_agent_organization  = req.body.requester_agent_organization;
			var requester_on_behalf_of  = req.body.requester_on_behalf_of;
			var performer_type  = req.body.performer_type;
			var performer_practitioner  = req.body.performer_practitioner;
			var performer_organization  = req.body.performer_organization;
			var performer_patient  = req.body.performer_patient;
			var performer_device  = req.body.performer_device;
			var performer_related_person  = req.body.performer_related_person;
			var performer_healthcare_service  = req.body.performer_healthcare_service;
			var reason_code  = req.body.reason_code;
			var reason_reference  = req.body.reason_reference;
			var supporting_info  = req.body.supporting_info;
			var observation_id  = req.body.observation_id;
			
			var column = "";
      var values = "";
			
			if (typeof group_identifier !== 'undefined' && group_identifier !== "") {
        column += 'group_identifier,';
        values += "'" + group_identifier + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }	
			
			if (typeof intent !== 'undefined' && intent !== "") {
        column += 'intent,';
        values += "'" + intent + "',";
      }	
			
			if (typeof priority !== 'undefined' && priority !== "") {
        column += 'priority,';
        values += "'" + priority + "',";
      }	
			
			if (typeof code_reference !== 'undefined' && code_reference !== "") {
        column += 'code_reference,';
        values += "'" + code_reference + "',";
      }		
			
			if (typeof code_codeable_concept !== 'undefined' && code_codeable_concept !== "") {
        column += 'code_codeable_concept,';
        values += "'" + code_codeable_concept + "',";
      }	
			
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }
			
			if (typeof subject_group !== 'undefined' && subject_group !== "") {
        column += 'subject_group,';
        values += "'" + subject_group + "',";
      }	
			
			if (typeof subject_location !== 'undefined' && subject_location !== "") {
        column += 'subject_location,';
        values += "'" + subject_location + "',";
      }	
			
			if (typeof subject_device !== 'undefined' && subject_device !== "") {
        column += 'subject_device,';
        values += "'" + subject_device + "',";
      }	
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }		
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }	
			
			if (typeof occurence_date_time !== 'undefined' && occurence_date_time !== "") {
        column += 'occurence_date_time,';
				values += "to_date('"+ occurence_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof occurence_period_start !== 'undefined' && occurence_period_start !== "") {
        column += 'occurence_period_start,';
				values += "to_date('"+ occurence_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof occurence_period_end !== 'undefined' && occurence_period_end !== "") {
        column += 'occurence_period_end,';
				values += "to_date('"+ occurence_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof occurence_timing !== 'undefined' && occurence_timing !== "") {
        column += 'occurence_timing,';
        values += "'" + occurence_timing + "',";
      }
			
			if (typeof authored_on !== 'undefined' && authored_on !== "") {
        column += 'authored_on,';
				values += "to_date('"+ authored_on + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof requester_agent_device !== 'undefined' && requester_agent_device !== "") {
        column += 'requester_agent_device,';
        values += "'" + requester_agent_device + "',";
      }	
			
			if (typeof requester_agent_practitioner !== 'undefined' && requester_agent_practitioner !== "") {
        column += 'requester_agent_practitioner,';
        values += "'" + requester_agent_practitioner + "',";
      }	
			
			if (typeof requester_agent_organization !== 'undefined' && requester_agent_organization !== "") {
        column += 'requester_agent_organization,';
        values += "'" + requester_agent_organization + "',";
      }
				
			if (typeof requester_on_behalf_of !== 'undefined' && requester_on_behalf_of !== "") {
        column += 'requester_on_behalf_of,';
        values += "'" + requester_on_behalf_of + "',";
      }		
			
			if (typeof performer_type !== 'undefined' && performer_type !== "") {
        column += 'performer_type,';
        values += "'" + performer_type + "',";
      }		
			
			if (typeof performer_practitioner !== 'undefined' && performer_practitioner !== "") {
        column += 'performer_practitioner,';
        values += "'" + performer_practitioner + "',";
      }		
			
			if (typeof performer_organization !== 'undefined' && performer_organization !== "") {
        column += 'performer_organization,';
        values += "'" + performer_organization + "',";
      }		
			
			if (typeof performer_patient !== 'undefined' && performer_patient !== "") {
        column += 'performer_patient,';
        values += "'" + performer_patient + "',";
      }		
			
			if (typeof performer_device !== 'undefined' && performer_device !== "") {
        column += 'performer_device,';
        values += "'" + performer_device + "',";
      }		
			
			if (typeof performer_related_person !== 'undefined' && performer_related_person !== "") {
        column += 'performer_related_person,';
        values += "'" + performer_related_person + "',";
      }		
			
			if (typeof performer_healthcare_service !== 'undefined' && performer_healthcare_service !== "") {
        column += 'performer_healthcare_service,';
        values += "'" + performer_healthcare_service + "',";
      }
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }		
			
			if (typeof reason_reference !== 'undefined' && reason_reference !== "") {
        column += 'reason_reference,';
        values += "'" + reason_reference + "',";
      }	
			
			if (typeof supporting_info !== 'undefined' && supporting_info !== "") {
        column += 'supporting_info,';
        values += "'" + supporting_info + "',";
      }
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }
			
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "device_request_id = '" + device_request_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.device_request(device_request_id," + column.slice(0, -1) + ") SELECT device_request_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.device_request WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select device_request_id from BACIRO_FHIR.device_request WHERE device_request_id = '" + device_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceRequest"});
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