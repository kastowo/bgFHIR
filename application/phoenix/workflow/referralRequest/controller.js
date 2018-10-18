var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var path = require('path');

var configYaml = yamlconfig.readConfig(path.resolve('../../application/config/config.yml'));

//referralRequest emitter
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
		referralRequest: function getReferralRequest(req, res){
			var apikey = req.params.apikey;
			var referralRequestId = req.query._id;
			
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
			
			if(typeof referralRequestId !== 'undefined' && referralRequestId !== ""){
        condition += "dr.diagnostic_report_id = '" + referralRequestId + "' AND,";  
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
			
			var arrReferralRequest = [];
      var query = "select rr.referral_request_id as referral_request_id, rr.based_on as based_on, rr.replaces as replaces, rr.group_identifier as group_identifier, rr.status as status, rr.intent as intent, rr.type as type, rr.priority as priority, rr.service_requested as service_requested, rr.subject_patient as subject_patient, rr.subject_group as subject_group, rr.context_encounter as context_encounter, rr.context_episode_of_care as context_episode_of_care, rr.occurrence_date_time as occurrence_date_time, rr.occurrence_period_start as occurrence_period_start, rr.occurrence_period_end as occurrence_period_end, rr.authored_on as authored_on, rr.requester_agent_practitioner as requester_agent_practitioner, rr.requester_agent_organization as requester_agent_organization, rr.requester_agent_patient as requester_agent_patient, rr.requester_agent_related_person as requester_agent_related_person, rr.requester_agent_device as requester_agent_device, rr.requester_on_behalf_of as requester_on_behalf_of, rr.specialty as specialty, rr.reason_code as reason_code, rr.description as description, rr.supporting_info as supporting_info from BACIRO_FHIR.referral_request rr " + fixCondition;
			//console.log(query);			
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var ReferralRequest = {};
					

					
					ReferralRequest.resourceType = "ReferralRequest";
          ReferralRequest.id = rez[i].referral_request_id;
					ReferralRequest.groupIdentifier = rez[i].group_identifier;
					ReferralRequest.status = rez[i].status;
					ReferralRequest.intent = rez[i].intent;
					ReferralRequest.type = rez[i].type;
					ReferralRequest.priority = rez[i].priority;
					ReferralRequest.serviceRequested = rez[i].service_requested;
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
					ReferralRequest.subject = arrSubject;
					
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
					ReferralRequest.context = arrContext;
					var Occurrence = {};
					if(rez[i].occurrence_date_time == null){
						Occurrence.occurrenceDateTime = formatDate(rez[i].occurrence_date_time);
					}else{
						Occurrence.occurrenceDateTime = rez[i].occurrence_date_time;
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
					Occurrence.occurrencePeriod = occurrenceperiod_start + ' to ' + occurrenceperiod_end;
					ReferralRequest.occurrence = Occurrence;
					if(rez[i].authored_on == null){
						ReferralRequest.authoredOn = formatDate(rez[i].authored_on);
					}else{
						ReferralRequest.authoredOn = rez[i].authored_on;
					}
					var Requester = {};
					var Agent = {};
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
					if(rez[i].requester_agent_patient != "null"){
						Agent.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].requester_agent_patient;
					} else {
						Agent.patient = "";
					}
					if(rez[i].requester_agent_related_person != "null"){
						Agent.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].requester_agent_related_person;
					} else {
						Agent.relatedPerson = "";
					}
					if(rez[i].requester_agent_device != "null"){
						Agent.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].requester_agent_device;
					} else {
						Agent.device = "";
					}
					Requester.agent = Agent;
					if(rez[i].requester_on_behalf_of != "null"){
						Requester.onBehalfOf = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].requester_on_behalf_of;
					} else {
						Requester.onBehalfOf = "";
					}
					ReferralRequest.requester = Requester;
					ReferralRequest.specialty = rez[i].specialty;
					ReferralRequest.reason_code = rez[i].reason_code;
					ReferralRequest.description = rez[i].description;
					ReferralRequest.supporting_info = rez[i].supporting_info;
					
          arrReferralRequest[i] = ReferralRequest;
        }
        res.json({"err_code":0,"data": arrReferralRequest});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getReferralRequest"});
      });
    }
  },
	post: {
		referralRequest: function addReferralRequest(req, res) {
			console.log(req.body);
			var referral_request_id  = req.body.referral_request_id;
			var based_on  = req.body.based_on;
			var replaces  = req.body.replaces;
			var group_identifier  = req.body.group_identifier;
			var status  = req.body.status;
			var intent  = req.body.intent;
			var type  = req.body.type;
			var priority  = req.body.priority;
			var service_requested  = req.body.service_requested;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var occurrence_date_time  = req.body.occurrence_date_time;
			var occurrence_period_start  = req.body.occurrence_period_start;
			var occurrence_period_end  = req.body.occurrence_period_end;
			var authored_on  = req.body.authored_on;
			var requester_agent_practitioner  = req.body.requester_agent_practitioner;
			var requester_agent_organization  = req.body.requester_agent_organization;
			var requester_agent_patient  = req.body.requester_agent_patient;
			var requester_agent_related_person  = req.body.requester_agent_related_person;
			var requester_agent_device  = req.body.requester_agent_device;
			var requester_on_behalf_of  = req.body.requester_on_behalf_of;
			var specialty  = req.body.specialty;
			var reason_code  = req.body.reason_code;
			var description  = req.body.description;
			var supporting_info  = req.body.supporting_info;
			var appointment_id  = req.body.appointment_id;
			var clinical_impression_id  = req.body.clinical_impression_id;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var encounter_id  = req.body.encounter_id;
			var episode_of_care_id  = req.body.episode_of_care_id;
			var imaging_study_id  = req.body.imaging_study_id;
			var medication_request_id  = req.body.medication_request_id;
			var medication_statement_id  = req.body.medication_statement_id;
			var observation_id  = req.body.observation_id;
			var procedure_id  = req.body.procedure_id;
			var questionnaire_response_id  = req.body.questionnaire_response_id;
			
			var column = "";
      var values = "";
			
				
			if (typeof referral_request_id !== 'undefined' && referral_request_id !== "") {
				column += 'referral_request_id,';
				values += " '" + referral_request_id +"',";
			}

			if (typeof based_on !== 'undefined' && based_on !== "") {
				column += 'based_on,';
				values += " '" + based_on +"',";
			}

			if (typeof replaces !== 'undefined' && replaces !== "") {
				column += 'replaces,';
				values += " '" + replaces +"',";
			}

			if (typeof group_identifier !== 'undefined' && group_identifier !== "") {
				column += 'group_identifier,';
				values += " '" + group_identifier +"',";
			}

			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof intent !== 'undefined' && intent !== "") {
				column += 'intent,';
				values += " '" + intent +"',";
			}

			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof priority !== 'undefined' && priority !== "") {
				column += 'priority,';
				values += " '" + priority +"',";
			}

			if (typeof service_requested !== 'undefined' && service_requested !== "") {
				column += 'service_requested,';
				values += " '" + service_requested +"',";
			}

			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
				column += 'subject_patient,';
				values += " '" + subject_patient +"',";
			}

			if (typeof subject_group !== 'undefined' && subject_group !== "") {
				column += 'subject_group,';
				values += " '" + subject_group +"',";
			}

			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
				column += 'context_encounter,';
				values += " '" + context_encounter +"',";
			}

			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
				column += 'context_episode_of_care,';
				values += " '" + context_episode_of_care +"',";
			}

			if (typeof  occurrence_date_time !== 'undefined' &&  occurrence_date_time !== "") {
				column += ' occurrence_date_time,';
				values += "to_date('"+  occurrence_date_time + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  occurrence_period_start !== 'undefined' &&  occurrence_period_start !== "") {
				column += ' occurrence_period_start,';
				values += "to_date('"+  occurrence_period_start + "', 'yyyy-MM-dd'),";
			}

			if (typeof  occurrence_period_end !== 'undefined' &&  occurrence_period_end !== "") {
				column += ' occurrence_period_end,';
				values += "to_date('"+  occurrence_period_end + "', 'yyyy-MM-dd'),";
			}

			if (typeof  authored_on !== 'undefined' &&  authored_on !== "") {
				column += ' authored_on,';
				values += "to_date('"+  authored_on + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof requester_agent_practitioner !== 'undefined' && requester_agent_practitioner !== "") {
				column += 'requester_agent_practitioner,';
				values += " '" + requester_agent_practitioner +"',";
			}

			if (typeof requester_agent_organization !== 'undefined' && requester_agent_organization !== "") {
				column += 'requester_agent_organization,';
				values += " '" + requester_agent_organization +"',";
			}

			if (typeof requester_agent_patient !== 'undefined' && requester_agent_patient !== "") {
				column += 'requester_agent_patient,';
				values += " '" + requester_agent_patient +"',";
			}

			if (typeof requester_agent_related_person !== 'undefined' && requester_agent_related_person !== "") {
				column += 'requester_agent_related_person,';
				values += " '" + requester_agent_related_person +"',";
			}

			if (typeof requester_agent_device !== 'undefined' && requester_agent_device !== "") {
				column += 'requester_agent_device,';
				values += " '" + requester_agent_device +"',";
			}

			if (typeof requester_on_behalf_of !== 'undefined' && requester_on_behalf_of !== "") {
				column += 'requester_on_behalf_of,';
				values += " '" + requester_on_behalf_of +"',";
			}

			if (typeof specialty !== 'undefined' && specialty !== "") {
				column += 'specialty,';
				values += " '" + specialty +"',";
			}

			if (typeof reason_code !== 'undefined' && reason_code !== "") {
				column += 'reason_code,';
				values += " '" + reason_code +"',";
			}

			if (typeof description !== 'undefined' && description !== "") {
				column += 'description,';
				values += " '" + description +"',";
			}

			if (typeof supporting_info !== 'undefined' && supporting_info !== "") {
				column += 'supporting_info,';
				values += " '" + supporting_info +"',";
			}

			if (typeof appointment_id !== 'undefined' && appointment_id !== "") {
				column += 'appointment_id,';
				values += " '" + appointment_id +"',";
			}

			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
				column += 'clinical_impression_id,';
				values += " '" + clinical_impression_id +"',";
			}

			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
				column += 'diagnostic_report_id,';
				values += " '" + diagnostic_report_id +"',";
			}

			if (typeof encounter_id !== 'undefined' && encounter_id !== "") {
				column += 'encounter_id,';
				values += " '" + encounter_id +"',";
			}

			if (typeof episode_of_care_id !== 'undefined' && episode_of_care_id !== "") {
				column += 'episode_of_care_id,';
				values += " '" + episode_of_care_id +"',";
			}

			if (typeof imaging_study_id !== 'undefined' && imaging_study_id !== "") {
				column += 'imaging_study_id,';
				values += " '" + imaging_study_id +"',";
			}

			if (typeof medication_request_id !== 'undefined' && medication_request_id !== "") {
				column += 'medication_request_id,';
				values += " '" + medication_request_id +"',";
			}

			if (typeof medication_statement_id !== 'undefined' && medication_statement_id !== "") {
				column += 'medication_statement_id,';
				values += " '" + medication_statement_id +"',";
			}

			if (typeof observation_id !== 'undefined' && observation_id !== "") {
				column += 'observation_id,';
				values += " '" + observation_id +"',";
			}

			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
				column += 'procedure_id,';
				values += " '" + procedure_id +"',";
			}

			if (typeof questionnaire_response_id !== 'undefined' && questionnaire_response_id !== "") {
				column += 'questionnaire_response_id,';
				values += " '" + questionnaire_response_id +"',";
			}

			
			var query = "UPSERT INTO BACIRO_FHIR.referral_request(referral_request_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+referral_request_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select referral_request_id from BACIRO_FHIR.referral_request WHERE referral_request_id = '" + referral_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addReferralRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addReferralRequest"});
      });
    }
	},
	put: {
		referralRequest: function updateReferralRequest(req, res) {
			console.log(req.body);
			var referral_request_id  = req.params.referral_request_id;
			var based_on  = req.body.based_on;
			var replaces  = req.body.replaces;
			var group_identifier  = req.body.group_identifier;
			var status  = req.body.status;
			var intent  = req.body.intent;
			var type  = req.body.type;
			var priority  = req.body.priority;
			var service_requested  = req.body.service_requested;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var occurrence_date_time  = req.body.occurrence_date_time;
			var occurrence_period_start  = req.body.occurrence_period_start;
			var occurrence_period_end  = req.body.occurrence_period_end;
			var authored_on  = req.body.authored_on;
			var requester_agent_practitioner  = req.body.requester_agent_practitioner;
			var requester_agent_organization  = req.body.requester_agent_organization;
			var requester_agent_patient  = req.body.requester_agent_patient;
			var requester_agent_related_person  = req.body.requester_agent_related_person;
			var requester_agent_device  = req.body.requester_agent_device;
			var requester_on_behalf_of  = req.body.requester_on_behalf_of;
			var specialty  = req.body.specialty;
			var reason_code  = req.body.reason_code;
			var description  = req.body.description;
			var supporting_info  = req.body.supporting_info;
			var appointment_id  = req.body.appointment_id;
			var clinical_impression_id  = req.body.clinical_impression_id;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var encounter_id  = req.body.encounter_id;
			var episode_of_care_id  = req.body.episode_of_care_id;
			var imaging_study_id  = req.body.imaging_study_id;
			var medication_request_id  = req.body.medication_request_id;
			var medication_statement_id  = req.body.medication_statement_id;
			var observation_id  = req.body.observation_id;
			var procedure_id  = req.body.procedure_id;
			var questionnaire_response_id  = req.body.questionnaire_response_id;
			
			var column = "";
      var values = "";
			
				
			if (typeof referral_request_id !== 'undefined' && referral_request_id !== "") {
				column += 'referral_request_id,';
				values += " '" + referral_request_id +"',";
			}

			if (typeof based_on !== 'undefined' && based_on !== "") {
				column += 'based_on,';
				values += " '" + based_on +"',";
			}

			if (typeof replaces !== 'undefined' && replaces !== "") {
				column += 'replaces,';
				values += " '" + replaces +"',";
			}

			if (typeof group_identifier !== 'undefined' && group_identifier !== "") {
				column += 'group_identifier,';
				values += " '" + group_identifier +"',";
			}

			if (typeof status !== 'undefined' && status !== "") {
				column += 'status,';
				values += " '" + status +"',";
			}

			if (typeof intent !== 'undefined' && intent !== "") {
				column += 'intent,';
				values += " '" + intent +"',";
			}

			if (typeof type !== 'undefined' && type !== "") {
				column += 'type,';
				values += " '" + type +"',";
			}

			if (typeof priority !== 'undefined' && priority !== "") {
				column += 'priority,';
				values += " '" + priority +"',";
			}

			if (typeof service_requested !== 'undefined' && service_requested !== "") {
				column += 'service_requested,';
				values += " '" + service_requested +"',";
			}

			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
				column += 'subject_patient,';
				values += " '" + subject_patient +"',";
			}

			if (typeof subject_group !== 'undefined' && subject_group !== "") {
				column += 'subject_group,';
				values += " '" + subject_group +"',";
			}

			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
				column += 'context_encounter,';
				values += " '" + context_encounter +"',";
			}

			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
				column += 'context_episode_of_care,';
				values += " '" + context_episode_of_care +"',";
			}

			if (typeof  occurrence_date_time !== 'undefined' &&  occurrence_date_time !== "") {
				column += ' occurrence_date_time,';
				values += "to_date('"+  occurrence_date_time + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof  occurrence_period_start !== 'undefined' &&  occurrence_period_start !== "") {
				column += ' occurrence_period_start,';
				values += "to_date('"+  occurrence_period_start + "', 'yyyy-MM-dd'),";
			}

			if (typeof  occurrence_period_end !== 'undefined' &&  occurrence_period_end !== "") {
				column += ' occurrence_period_end,';
				values += "to_date('"+  occurrence_period_end + "', 'yyyy-MM-dd'),";
			}

			if (typeof  authored_on !== 'undefined' &&  authored_on !== "") {
				column += ' authored_on,';
				values += "to_date('"+  authored_on + "', 'yyyy-MM-dd HH:mm'),";
			}

			if (typeof requester_agent_practitioner !== 'undefined' && requester_agent_practitioner !== "") {
				column += 'requester_agent_practitioner,';
				values += " '" + requester_agent_practitioner +"',";
			}

			if (typeof requester_agent_organization !== 'undefined' && requester_agent_organization !== "") {
				column += 'requester_agent_organization,';
				values += " '" + requester_agent_organization +"',";
			}

			if (typeof requester_agent_patient !== 'undefined' && requester_agent_patient !== "") {
				column += 'requester_agent_patient,';
				values += " '" + requester_agent_patient +"',";
			}

			if (typeof requester_agent_related_person !== 'undefined' && requester_agent_related_person !== "") {
				column += 'requester_agent_related_person,';
				values += " '" + requester_agent_related_person +"',";
			}

			if (typeof requester_agent_device !== 'undefined' && requester_agent_device !== "") {
				column += 'requester_agent_device,';
				values += " '" + requester_agent_device +"',";
			}

			if (typeof requester_on_behalf_of !== 'undefined' && requester_on_behalf_of !== "") {
				column += 'requester_on_behalf_of,';
				values += " '" + requester_on_behalf_of +"',";
			}

			if (typeof specialty !== 'undefined' && specialty !== "") {
				column += 'specialty,';
				values += " '" + specialty +"',";
			}

			if (typeof reason_code !== 'undefined' && reason_code !== "") {
				column += 'reason_code,';
				values += " '" + reason_code +"',";
			}

			if (typeof description !== 'undefined' && description !== "") {
				column += 'description,';
				values += " '" + description +"',";
			}

			if (typeof supporting_info !== 'undefined' && supporting_info !== "") {
				column += 'supporting_info,';
				values += " '" + supporting_info +"',";
			}

			if (typeof appointment_id !== 'undefined' && appointment_id !== "") {
				column += 'appointment_id,';
				values += " '" + appointment_id +"',";
			}

			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
				column += 'clinical_impression_id,';
				values += " '" + clinical_impression_id +"',";
			}

			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
				column += 'diagnostic_report_id,';
				values += " '" + diagnostic_report_id +"',";
			}

			if (typeof encounter_id !== 'undefined' && encounter_id !== "") {
				column += 'encounter_id,';
				values += " '" + encounter_id +"',";
			}

			if (typeof episode_of_care_id !== 'undefined' && episode_of_care_id !== "") {
				column += 'episode_of_care_id,';
				values += " '" + episode_of_care_id +"',";
			}

			if (typeof imaging_study_id !== 'undefined' && imaging_study_id !== "") {
				column += 'imaging_study_id,';
				values += " '" + imaging_study_id +"',";
			}

			if (typeof medication_request_id !== 'undefined' && medication_request_id !== "") {
				column += 'medication_request_id,';
				values += " '" + medication_request_id +"',";
			}

			if (typeof medication_statement_id !== 'undefined' && medication_statement_id !== "") {
				column += 'medication_statement_id,';
				values += " '" + medication_statement_id +"',";
			}

			if (typeof observation_id !== 'undefined' && observation_id !== "") {
				column += 'observation_id,';
				values += " '" + observation_id +"',";
			}

			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
				column += 'procedure_id,';
				values += " '" + procedure_id +"',";
			}

			if (typeof questionnaire_response_id !== 'undefined' && questionnaire_response_id !== "") {
				column += 'questionnaire_response_id,';
				values += " '" + questionnaire_response_id +"',";
			}
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "referral_request_id = '" + referral_request_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.referral_request(referral_request_id," + column.slice(0, -1) + ") SELECT referral_request_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.referral_request WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select referral_request_id from BACIRO_FHIR.referral_request WHERE referral_request_id = '" + referral_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateReferralRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateReferralRequest"});
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