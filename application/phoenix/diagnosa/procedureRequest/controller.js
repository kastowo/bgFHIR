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
		procedureRequest: function getProcedureRequest(req, res){
			var apikey = req.params.apikey;
			var procedureRequestId = req.query._id;
			
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
			
			if(typeof procedureRequestId !== 'undefined' && procedureRequestId !== ""){
        condition += "dr.diagnostic_report_id = '" + procedureRequestId + "' AND,";  
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
			
			var arrProcedureRequest = [];
      var query = "select pr.procedure_request_id as procedure_request_id, pr.based_on as based_on, pr.replaces as replaces, pr.requisition as requisition, pr.status as status, pr.intent as intent, pr.priority as priority, pr.do_not_perform as do_not_perform, pr.category as category, pr.code as code, pr.subject_patient as subject_patient, pr.subject_group as subject_group, pr.subject_location as subject_location, pr.subject_device as subject_device, pr.context_encounter as context_encounter, pr.context_episode_of_care as context_episode_of_care, pr.occurrence_date_time as occurrence_date_time, pr.occurrence_period_start as occurrence_period_start, pr.occurrence_period_end as occurrence_period_end, pr.occurrence_timing as occurrence_timing, pr.as_needed_boolean as as_needed_boolean, pr.as_needed_codeable_concept as as_needed_codeable_concept, pr.authored_on as authored_on, pr.requester_agent_device as requester_agent_device, pr.requester_agent_practitioner as requester_agent_practitioner, pr.requester_agent_organization as requester_agent_organization, pr.requester_on_behalf_of as requester_on_behalf_of, pr.performer_type as performer_type, pr.performer_practitioner as performer_practitioner, pr.performer_organization as performer_organization, pr.performer_patient as performer_patient, pr.performer_device as performer_device, pr.performer_related_person as performer_related_person, pr.performer_healthcare_service as performer_healthcare_service, pr.reason_code as reason_code, pr.supporting_info as supporting_info, pr.body_site as body_site from BACIRO_FHIR.procedure_request pr " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var ProcedureRequest = {};
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
					
					var arrAgent = [];
					var Agent = {};
					if(rez[i].requester_agent_device != "null"){
						Agent.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].requester_agent_device;
					} else {
						Agent.device = "";
					}
					if(rez[i].requester_agent_practitioner != "null"){
						Agent.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].requester_agent_practitioner;
					} else {
						Agent.practitioner = "";
					}
					if(rez[i].requester_agent_organization != "null"){
						Agent.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].requester_agent_organization;
					} else {
						Agent.organization = "";
					}
					arrAgent[i] = Agent;
						
					var Performer = {};
					var arrPerformer = [];
					if(rez[i].performer_practitioner != "null"){
						Performer.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].performer_practitioner;
					} else {
						Performer.practitioner = "";
					}
					if(rez[i].performer_organization != "null"){
						Performer.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].performer_organization;
					} else {
						Performer.organization = "";
					}
					if(rez[i].performer_patient != "null"){
						Performer.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].performer_patient;
					} else {
						Performer.patient = "";
					}
					if(rez[i].performer_device != "null"){
						Performer.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].performer_device;
					} else {
						Performer.device = "";
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
						
					ProcedureRequest.resourceType = "ProcedureRequest";
          ProcedureRequest.id = rez[i].diagnostic_report_id;
					ProcedureRequest.based_on = rez[i].based_on;
					ProcedureRequest.replaces = rez[i].replaces;
					ProcedureRequest.requisition = rez[i].requisition;
					ProcedureRequest.status = rez[i].status;
					ProcedureRequest.intent = rez[i].intent;
					ProcedureRequest.priority = rez[i].priority;
					ProcedureRequest.do_not_perform = rez[i].do_not_perform;
					ProcedureRequest.category = rez[i].category;
					ProcedureRequest.code = rez[i].code;
					ProcedureRequest.subject = arrSubject;
					ProcedureRequest.context = arrContent;
					if(rez[i].occurrence_date_time == null){
						ProcedureRequest.occurrence.occurrenceDateTime = formatDate(rez[i].occurrence_date_time);
					}else{
						ProcedureRequest.occurrence.occurrenceDateTime = rez[i].occurrence_date_time;
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
					ProcedureRequest.occurrence.occurrencePeriod = occurrenceperiod_start + ' to ' + occurrenceperiod_end;
					ProcedureRequest.occurrence.occurrenceTiming = rez[i].occurrence_timing;
					ProcedureRequest.asNeeded.asNeededBoolean = rez[i].as_needed_boolean;
					ProcedureRequest.asNeeded.asNeededCodeableConcept = rez[i].as_needed_codeable_concept;
					if(rez[i].authored_on == null){
						ProcedureRequest.authoredOn = formatDate(rez[i].authored_on);
					}else{
						ProcedureRequest.authoredOn = rez[i].authored_on;
					}
					
					ProcedureRequest.requester.agent = arrAgent;
					ProcedureRequest.requester.onBehalfOf = rez[i].requester_on_behalf_of;
					ProcedureRequest.performerType = rez[i].performer_type;
					ProcedureRequest.performer = arrPerformer;
					ProcedureRequest.reasonCode = rez[i].reason_code;
					ProcedureRequest.supportingInfo = rez[i].supporting_info;
					ProcedureRequest.bodySite = rez[i].body_site;
					
          arrProcedureRequest[i] = ProcedureRequest;
        }
        res.json({"err_code":0,"data": arrProcedureRequest});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureRequest"});
      });
    }
  },
	post: {
		procedureRequest: function addProcedureRequest(req, res) {
			console.log(req.body);
			var procedure_request_id  = req.body.procedure_request_id;
			var based_on  = req.body.based_on;
			var replaces  = req.body.replaces;
			var requisition  = req.body.requisition;
			var status  = req.body.status;
			var intent  = req.body.intent;
			var priority  = req.body.priority;
			var do_not_perform  = req.body.do_not_perform;
			var category  = req.body.category;
			var code  = req.body.code;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var subject_location  = req.body.subject_location;
			var subject_device  = req.body.subject_device;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var occurrence_date_time  = req.body.occurrence_date_time;
			var occurrence_period_start  = req.body.occurrence_period_start;
			var occurrence_period_end  = req.body.occurrence_period_end;
			var occurrence_timing  = req.body.occurrence_timing;
			var as_needed_boolean  = req.body.as_needed_boolean;
			var as_needed_codeable_concept  = req.body.as_needed_codeable_concept;
			var authored_on  = req.body.authored_on;
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
			var supporting_info  = req.body.supporting_info;
			var body_site  = req.body.body_site;
			
			var clinical_impression_id  = req.body.clinical_impression_id;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var goal_id  = req.body.goal_id;
			var imaging_study_id  = req.body.imaging_study_id;
			var media_id  = req.body.media_id;
			var medication_request_id  = req.body.medication_request_id;
			var medication_statement_id  = req.body.medication_statement_id;
			var observation_id  = req.body.observation_id;
			var procedure_id  = req.body.procedure_id;
			var questionnaire_response_id  = req.body.questionnaire_response_id;
			var referral_request_id  = req.body.referral_request_id;
			var specimen_id  = req.body.specimen_id;
	
			var column = "";
      var values = "";
			
			if (typeof based_on !== 'undefined' && based_on !== "") {
        column += 'based_on,';
        values += "'" + based_on + "',";
      }
			
			if (typeof replaces !== 'undefined' && replaces !== "") {
        column += 'replaces,';
        values += "'" + replaces + "',";
      }	
			
			if (typeof requisition !== 'undefined' && requisition !== "") {
        column += 'requisition,';
        values += "'" + requisition + "',";
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
			
			if (typeof do_not_perform !== 'undefined' && do_not_perform !== "") {
        column += 'do_not_perform,';
        values += " " + do_not_perform + ",";
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
			
			if (typeof occurrence_date_time !== 'undefined' && occurrence_date_time !== "") {
        column += 'occurrence_date_time,';
				values += "to_date('"+ occurrence_date_time + "', 'yyyy-MM-dd'),";
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
			
			if (typeof as_needed_boolean !== 'undefined' && as_needed_boolean !== "") {
        column += 'as_needed_boolean,';
        values += " " + as_needed_boolean + " ,";
      }		
			
			if (typeof as_needed_codeable_concept !== 'undefined' && as_needed_codeable_concept !== "") {
        column += 'as_needed_codeable_concept,';
        values += "'" + as_needed_codeable_concept + "',";
      }		
			
			if (typeof authored_on !== 'undefined' && authored_on !== "") {
        column += 'authored_on,';
				values += "to_date('"+ authored_on + "', 'yyyy-MM-dd'),";
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
			
			if (typeof supporting_info !== 'undefined' && supporting_info !== "") {
        column += 'supporting_info,';
        values += "'" + supporting_info + "',";
      }		
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
      }		
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }		
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }		
			
			if (typeof goal_id !== 'undefined' && goal_id !== "") {
        column += 'goal_id,';
        values += "'" + goal_id + "',";
      }		
			
			if (typeof imaging_study_id !== 'undefined' && imaging_study_id !== "") {
        column += 'imaging_study_id,';
        values += "'" + imaging_study_id + "',";
      }		
			
			if (typeof media_id !== 'undefined' && media_id !== "") {
        column += 'media_id,';
        values += "'" + media_id + "',";
      }		
			
			if (typeof medication_request_id !== 'undefined' && medication_request_id !== "") {
        column += 'medication_request_id,';
        values += "'" + medication_request_id + "',";
      }		
			
			if (typeof medication_statement_id !== 'undefined' && medication_statement_id !== "") {
        column += 'medication_statement_id,';
        values += "'" + medication_statement_id + "',";
      }		
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }		
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }		
			
			if (typeof questionnaire_response_id !== 'undefined' && questionnaire_response_id !== "") {
        column += 'questionnaire_response_id,';
        values += "'" + questionnaire_response_id + "',";
      }		
			
			if (typeof referral_request_id !== 'undefined' && referral_request_id !== "") {
        column += 'referral_request_id,';
        values += "'" + referral_request_id + "',";
      }		
			
			if (typeof specimen_id !== 'undefined' && specimen_id !== "") {
        column += 'specimen_id,';
        values += "'" + specimen_id + "',";
      }		
			
      var query = "UPSERT INTO BACIRO_FHIR.procedure_request(procedure_request_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+procedure_request_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select procedure_request_id from BACIRO_FHIR.procedure_request WHERE procedure_request_id = '" + procedure_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureRequest"});
      });
    }
	},
	put: {
		procedureRequest: function updateProcedureRequest(req, res) {
			console.log(req.body);
			var procedure_request_id  = req.params.procedure_request_id;
			var based_on  = req.body.based_on;
			var replaces  = req.body.replaces;
			var requisition  = req.body.requisition;
			var status  = req.body.status;
			var intent  = req.body.intent;
			var priority  = req.body.priority;
			var do_not_perform  = req.body.do_not_perform;
			var category  = req.body.category;
			var code  = req.body.code;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var subject_location  = req.body.subject_location;
			var subject_device  = req.body.subject_device;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var occurrence_date_time  = req.body.occurrence_date_time;
			var occurrence_period_start  = req.body.occurrence_period_start;
			var occurrence_period_end  = req.body.occurrence_period_end;
			var occurrence_timing  = req.body.occurrence_timing;
			var as_needed_boolean  = req.body.as_needed_boolean;
			var as_needed_codeable_concept  = req.body.as_needed_codeable_concept;
			var authored_on  = req.body.authored_on;
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
			var supporting_info  = req.body.supporting_info;
			var body_site  = req.body.body_site;
			var clinical_impression_id  = req.body.clinical_impression_id;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var goal_id  = req.body.goal_id;
			var imaging_study_id  = req.body.imaging_study_id;
			var media_id  = req.body.media_id;
			var medication_request_id  = req.body.medication_request_id;
			var medication_statement_id  = req.body.medication_statement_id;
			var observation_id  = req.body.observation_id;
			var procedure_id  = req.body.procedure_id;
			var questionnaire_response_id  = req.body.questionnaire_response_id;
			var referral_request_id  = req.body.referral_request_id;
			var specimen_id  = req.body.specimen_id;
			
			var column = "";
      var values = "";
			
			if (typeof based_on !== 'undefined' && based_on !== "") {
        column += 'based_on,';
        values += "'" + based_on + "',";
      }
			
			if (typeof replaces !== 'undefined' && replaces !== "") {
        column += 'replaces,';
        values += "'" + replaces + "',";
      }	
			
			if (typeof requisition !== 'undefined' && requisition !== "") {
        column += 'requisition,';
        values += "'" + requisition + "',";
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
			
			if (typeof do_not_perform !== 'undefined' && do_not_perform !== "") {
        column += 'do_not_perform,';
        values += " " + do_not_perform + ",";
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
			
			if (typeof occurrence_date_time !== 'undefined' && occurrence_date_time !== "") {
        column += 'occurrence_date_time,';
				values += "to_date('"+ occurrence_date_time + "', 'yyyy-MM-dd'),";
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
			
			if (typeof as_needed_boolean !== 'undefined' && as_needed_boolean !== "") {
        column += 'as_needed_boolean,';
        values += " " + as_needed_boolean + " ,";
      }		
			
			if (typeof as_needed_codeable_concept !== 'undefined' && as_needed_codeable_concept !== "") {
        column += 'as_needed_codeable_concept,';
        values += "'" + as_needed_codeable_concept + "',";
      }		
			
			if (typeof authored_on !== 'undefined' && authored_on !== "") {
        column += 'authored_on,';
				values += "to_date('"+ authored_on + "', 'yyyy-MM-dd'),";
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
			
			if (typeof supporting_info !== 'undefined' && supporting_info !== "") {
        column += 'supporting_info,';
        values += "'" + supporting_info + "',";
      }		
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
      }	
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }		
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }		
			
			if (typeof goal_id !== 'undefined' && goal_id !== "") {
        column += 'goal_id,';
        values += "'" + goal_id + "',";
      }		
			
			if (typeof imaging_study_id !== 'undefined' && imaging_study_id !== "") {
        column += 'imaging_study_id,';
        values += "'" + imaging_study_id + "',";
      }		
			
			if (typeof media_id !== 'undefined' && media_id !== "") {
        column += 'media_id,';
        values += "'" + media_id + "',";
      }		
			
			if (typeof medication_request_id !== 'undefined' && medication_request_id !== "") {
        column += 'medication_request_id,';
        values += "'" + medication_request_id + "',";
      }		
			
			if (typeof medication_statement_id !== 'undefined' && medication_statement_id !== "") {
        column += 'medication_statement_id,';
        values += "'" + medication_statement_id + "',";
      }		
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }		
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }		
			
			if (typeof questionnaire_response_id !== 'undefined' && questionnaire_response_id !== "") {
        column += 'questionnaire_response_id,';
        values += "'" + questionnaire_response_id + "',";
      }		
			
			if (typeof referral_request_id !== 'undefined' && referral_request_id !== "") {
        column += 'referral_request_id,';
        values += "'" + referral_request_id + "',";
      }		
			
			if (typeof specimen_id !== 'undefined' && specimen_id !== "") {
        column += 'specimen_id,';
        values += "'" + specimen_id + "',";
      }		
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "procedure_request_id = '" + procedure_request_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.procedure_request(procedure_request_id," + column.slice(0, -1) + ") SELECT procedure_request_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.procedure_request WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select procedure_request_id from BACIRO_FHIR.procedure_request WHERE procedure_request_id = '" + procedure_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureRequest"});
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