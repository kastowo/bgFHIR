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
			var authored = req.query.authored;
			var based_on = req.query.based_on;
			var body_site = req.query.body_site;
			var code = req.query.code;
			var context = req.query.context;
			var definition = req.query.definition;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var intent = req.query.intent;
			var occurrence = req.query.occurrence;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var performer_type = req.query.performer_type;
			var priority = req.query.priority;
			var replaces = req.query.replaces;
			var requester = req.query.requester;
			var requisition = req.query.requisition;
			var specimen = req.query.specimen;
			var status = req.query.status;
			var subject = req.query.subject;
			
			
	
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof procedureRequestId !== 'undefined' && procedureRequestId !== ""){
        condition += "pr.PROCEDURE_REQUEST_ID = '" + procedureRequestId + "' AND,";  
      }
			
			if(typeof authored !== 'undefined' && authored !== ""){
			  condition += "pr.AUTHORED_ON == to_date('" + authored + "', 'yyyy-MM-dd') AND,";
      }
			
			if((typeof based_on !== 'undefined' && based_on !== "")){ 
				condition += "pr.BASED_ON = '" + based_on + "' AND ";
      }
			
			if(typeof body_site !== 'undefined' && body_site !== ""){
				condition += "pr.body_site = '" + body_site + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
				condition += "pr.CODE = '" + code + "' AND,";  
      }
			
			if(typeof context !== 'undefined' && context !== ""){
				condition += "(pr.CONTEXT_ENCOUNTER = '" + context + "' OR pr.CONTEXT_EPISODE_OF_CARE = '" + context + "') AND,";  
			}
			
			if(typeof definition !== 'undefined' && definition !== ""){ 
			 var res = definition.substring(0, 3);
				if(res == 'pde'){
					join += " LEFT JOIN BACIRO_FHIR.PLAN_DEFINITION pde ON pde.PROCEDURE_REQUEST_ID = pr.PROCEDURE_REQUEST_ID ";
          condition += "pde.CAREPLAN_ID = '" + definition + "' AND ";       
				} 
				if(res == 'ade') {
					join += " LEFT JOIN BACIRO_FHIR.ACTIVITY_DEFINITION ade ON ade.PROCEDURE_REQUEST_ID = pr.PROCEDURE_REQUEST_ID ";
          condition += "ade.REFERRAL_REQUEST_ID = '" + definition + "' AND ";       
				}
			}
			
			if(typeof encounter !== 'undefined' && encounter !== ""){
			  condition += "pr.CONTEXT_ENCOUNTER = '" + encounter + "' AND,";  
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.PROCEDURE_REQUEST_ID = pr.PROCEDURE_REQUEST_ID ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if(typeof intent !== 'undefined' && intent !== ""){
			  condition += "pr.INTENT = '" + intent + "' AND,";  
      }
			
			if(typeof occurrence !== 'undefined' && occurrence !== ""){
			  condition += "pr.OCCURRENCE_DATE_TIME == to_date('" + occurrence + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
			  condition += "pr.subject_patient = '" + patient + "' AND,";  
      }
			
			if(typeof performer !== 'undefined' && performer !== ""){ 
			 var res = performer.substring(0, 3);
				if(res == 'pra'){
					join += " LEFT JOIN BACIRO_FHIR.Practitioner pra ON pra.PROCEDURE_REQUEST_ID = pr.PROCEDURE_REQUEST_ID ";
          condition += "pra.CAREPLAN_ID = '" + performer + "' AND ";       
				} 
				if(res == 'org') {
					join += " LEFT JOIN BACIRO_FHIR.Organization org ON org.PROCEDURE_REQUEST_ID = pr.PROCEDURE_REQUEST_ID ";
          condition += "org.REFERRAL_REQUEST_ID = '" + performer + "' AND ";       
				}
				if(res == 'dev'){
					join += " LEFT JOIN BACIRO_FHIR.Device dev ON dev.PROCEDURE_REQUEST_ID = pr.PROCEDURE_REQUEST_ID ";
          condition += "dev.CAREPLAN_ID = '" + performer + "' AND ";       
				} 
				if(res == 'pat') {
					join += " LEFT JOIN BACIRO_FHIR.Patient pat ON pat.PROCEDURE_REQUEST_ID = pr.PROCEDURE_REQUEST_ID ";
          condition += "pat.REFERRAL_REQUEST_ID = '" + performer + "' AND ";       
				}
				if(res == 'hse'){
					join += " LEFT JOIN BACIRO_FHIR.Healthcare_Service hse ON hse.PROCEDURE_REQUEST_ID = pr.PROCEDURE_REQUEST_ID ";
          condition += "hse.CAREPLAN_ID = '" + performer + "' AND ";       
				} 
				if(res == 'rpe') {
					join += " LEFT JOIN BACIRO_FHIR.Related_Person rpe ON rpe.PROCEDURE_REQUEST_ID = pr.PROCEDURE_REQUEST_ID ";
          condition += "rpe.REFERRAL_REQUEST_ID = '" + performer + "' AND ";       
				}
			}
			
			if(typeof performer_type !== 'undefined' && performer_type !== ""){
			  condition += "pr.PERFORMER_TYPE = '" + performer_type + "' AND,";  
      }
			
			if(typeof priority !== 'undefined' && priority !== ""){
			  condition += "pr.priority = '" + priority + "' AND,";  
      }
			
			if(typeof replaces !== 'undefined' && replaces !== ""){
			  condition += "pr.replaces = '" + replaces + "' AND,";  
      }
			
			if(typeof requester !== 'undefined' && requester !== ""){
				condition += "(pr.REQUESTER_AGENT_DEVICE = '" + requester + "' OR pr.REQUESTER_AGENT_PRACTITIONER = '" + requester + "' OR pr.REQUESTER_AGENT_ORGANIZATION = '" + requester + "') AND,";  
			}
			
			if(typeof requisition !== 'undefined' && requisition !== ""){
			  condition += "pr.REQUISITION = '" + requisition + "' AND,";  
      }
			
			if((typeof specimen !== 'undefined' && specimen !== "")){
        join += " LEFT JOIN BACIRO_FHIR.Specimen spe ON spe.PROCEDURE_REQUEST_ID = pr.PROCEDURE_REQUEST_ID ";
        condition += "spe.specimen_id = '" + specimen + "' AND ";
      }
			
			if(typeof status !== 'undefined' && status !== ""){
				condition += "pr.status = '" + status + "' AND,";  
      }
			
			if(typeof subject !== 'undefined' && subject !== ""){
				condition += "(pr.SUBJECT_PATIENT = '" + subject + "' OR pr.SUBJECT_GROUP = '" + subject + "' OR pr.subject_device = '" + subject + "' OR pr.subject_location = '" + subject + "') AND,";  
			}
			
			var offset = req.query.offset;
			var limit = req.query.limit;

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " pr.procedure_request_id > '" + offset + "' AND ";       
			}
			
			if((typeof limit !== 'undefined' && limit !== '')){
				limit = " limit " + limit + " ";
			} else {
				limit = " ";
			}
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			
			var arrProcedureRequest = [];
      var query = "select pr.procedure_request_id as procedure_request_id, pr.based_on as based_on, pr.replaces as replaces, pr.requisition as requisition, pr.status as status, pr.intent as intent, pr.priority as priority, pr.do_not_perform as do_not_perform, pr.category as category, pr.code as code, pr.subject_patient as subject_patient, pr.subject_group as subject_group, pr.subject_location as subject_location, pr.subject_device as subject_device, pr.context_encounter as context_encounter, pr.context_episode_of_care as context_episode_of_care, pr.occurrence_date_time as occurrence_date_time, pr.occurrence_period_start as occurrence_period_start, pr.occurrence_period_end as occurrence_period_end, pr.occurrence_timing as occurrence_timing, pr.as_needed_boolean as as_needed_boolean, pr.as_needed_codeable_concept as as_needed_codeable_concept, pr.authored_on as authored_on, pr.requester_agent_device as requester_agent_device, pr.requester_agent_practitioner as requester_agent_practitioner, pr.requester_agent_organization as requester_agent_organization, pr.requester_on_behalf_of as requester_on_behalf_of, pr.performer_type as performer_type, pr.performer_practitioner as performer_practitioner, pr.performer_organization as performer_organization, pr.performer_patient as performer_patient, pr.performer_device as performer_device, pr.performer_related_person as performer_related_person, pr.performer_healthcare_service as performer_healthcare_service, pr.reason_code as reason_code, pr.supporting_info as supporting_info, pr.body_site as body_site from BACIRO_FHIR.procedure_request pr " + fixCondition + limit;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var ProcedureRequest = {};
					
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
						
					var Performer = {};
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
						
					ProcedureRequest.resourceType = "ProcedureRequest";
          ProcedureRequest.id = rez[i].procedure_request_id;
					ProcedureRequest.basedOn = rez[i].based_on;
					ProcedureRequest.replaces = rez[i].replaces;
					ProcedureRequest.requisition = rez[i].requisition;
					ProcedureRequest.status = rez[i].status;
					ProcedureRequest.intent = rez[i].intent;
					ProcedureRequest.priority = rez[i].priority;
					ProcedureRequest.doNotPerform = rez[i].do_not_perform;
					ProcedureRequest.category = rez[i].category;
					ProcedureRequest.code = rez[i].code;
					ProcedureRequest.subject = Subject;
					ProcedureRequest.context = Content;
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
					Occurrence.occurrenceTiming = rez[i].occurrence_timing;
					ProcedureRequest.occurrence = Occurrence;
					var AsNeeded = {};
					AsNeeded.asNeededBoolean = rez[i].as_needed_boolean;
					AsNeeded.asNeededCodeableConcept = rez[i].as_needed_codeable_concept;
					ProcedureRequest.asNeeded = AsNeeded;
					if(rez[i].authored_on == null){
						ProcedureRequest.authoredOn = formatDate(rez[i].authored_on);
					}else{
						ProcedureRequest.authoredOn = rez[i].authored_on;
					}
					var Requester = {};
					Requester.agent = Agent;
					Requester.onBehalfOf = rez[i].requester_on_behalf_of;
					ProcedureRequest.requester = Requester;
					ProcedureRequest.performerType = rez[i].performer_type;
					ProcedureRequest.performer = Performer;
					ProcedureRequest.reasonCode = rez[i].reason_code;
					ProcedureRequest.supportingInfo = rez[i].supporting_info;
					ProcedureRequest.bodySite = rez[i].body_site;
					
          arrProcedureRequest[i] = ProcedureRequest;
        }
        res.json({"err_code":0,"data": arrProcedureRequest});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureRequest"});
      });
    },
		procedureRequestDefinitionPlanDefinition: function getMedicationRequestDefinitionPlanDefinition(req, res) {
			var apikey = req.params.apikey;
			
			var PlanDefinitionId = req.query._id;
			var procedureRequestId = req.query.procedure_request_id;

			//susun query
			var condition = '';

			if (typeof PlanDefinitionId !== 'undefined' && PlanDefinitionId !== "") {
				condition += "plan_definition_id = '" + PlanDefinitionId + "' AND ";
			}

			if (typeof procedureRequestId !== 'undefined' && procedureRequestId !== "") {
				condition += "procedure_request_id = '" + procedureRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestDefinitionPlanDefinition = [];
			var query = 'select plan_definition_id from BACIRO_FHIR.Plan_Definition ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureRequestDefinitionPlanDefinition = {};
					if(rez[i].plan_definition_id != "null"){
						procedureRequestDefinitionPlanDefinition.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/PlanDefinition?_id=' +  rez[i].plan_definition_id;
					} else {
						procedureRequestDefinitionPlanDefinition.id = "";
					}
					
					arrMedicationRequestDefinitionPlanDefinition[i] = procedureRequestDefinitionPlanDefinition;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestDefinitionPlanDefinition
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestDefinitionPlanDefinition"
				});
			});
		},
		procedureRequestDefinitionActivityDefinition: function getMedicationRequestDefinitionActivityDefinition(req, res) {
			var apikey = req.params.apikey;
			
			var ActivityDefinitionId = req.query._id;
			var procedureRequestId = req.query.procedure_request_id;

			//susun query
			var condition = '';

			if (typeof ActivityDefinitionId !== 'undefined' && ActivityDefinitionId !== "") {
				condition += "activity_definition_id = '" + ActivityDefinitionId + "' AND ";
			}

			if (typeof procedureRequestId !== 'undefined' && procedureRequestId !== "") {
				condition += "procedure_request_id = '" + procedureRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestDefinitionActivityDefinition = [];
			var query = 'select activity_definition_id from BACIRO_FHIR.activity_definition ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureRequestDefinitionActivityDefinition = {};
					if(rez[i].activity_definition_id != "null"){
						procedureRequestDefinitionActivityDefinition.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/ActivityDefinition?_id=' +  rez[i].activity_definition_id;
					} else {
						procedureRequestDefinitionActivityDefinition.id = "";
					}
					
					arrMedicationRequestDefinitionActivityDefinition[i] = procedureRequestDefinitionActivityDefinition;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestDefinitionActivityDefinition
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestDefinitionActivityDefinition"
				});
			});
		},
		
		procedureRequestReasonReferenceCondition: function getMedicationRequestReasonReferenceCondition(req, res) {
			var apikey = req.params.apikey;
			
			var ConditionId = req.query._id;
			var procedureRequestId = req.query.procedure_request_id;

			//susun query
			var condition = '';

			if (typeof ConditionId !== 'undefined' && ConditionId !== "") {
				condition += "condition_id = '" + ConditionId + "' AND ";
			}

			if (typeof procedureRequestId !== 'undefined' && procedureRequestId !== "") {
				condition += "procedure_request_id = '" + procedureRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestReasonReferenceCondition = [];
			var query = 'select condition_id from BACIRO_FHIR.condition ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureRequestReasonReferenceCondition = {};
					if(rez[i].condition_id != "null"){
						procedureRequestReasonReferenceCondition.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Condition?_id=' +  rez[i].condition_id;
					} else {
						procedureRequestReasonReferenceCondition.id = "";
					}
					
					arrMedicationRequestReasonReferenceCondition[i] = procedureRequestReasonReferenceCondition;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestReasonReferenceCondition
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestReasonReferenceCondition"
				});
			});
		},
		procedureRequestReasonReferenceObservation: function getMedicationRequestReasonReferenceObservation(req, res) {
			var apikey = req.params.apikey;
			
			var ObservationId = req.query._id;
			var procedureRequestId = req.query.procedure_request_id;

			//susun query
			var condition = '';

			if (typeof ObservationId !== 'undefined' && ObservationId !== "") {
				condition += "observation_id = '" + ObservationId + "' AND ";
			}

			if (typeof procedureRequestId !== 'undefined' && procedureRequestId !== "") {
				condition += "procedure_request_id = '" + procedureRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestReasonReferenceObservation = [];
			var query = 'select observation_id from BACIRO_FHIR.observation ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureRequestReasonReferenceObservation = {};
					if(rez[i].observation_id != "null"){
						procedureRequestReasonReferenceObservation.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Observation?_id=' +  rez[i].observation_id;
					} else {
						procedureRequestReasonReferenceObservation.id = "";
					}
					
					arrMedicationRequestReasonReferenceObservation[i] = procedureRequestReasonReferenceObservation;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestReasonReferenceObservation
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestReasonReferenceObservation"
				});
			});
		},
		procedureRequestSpecimen: function getMedicationRequestSpecimen(req, res) {
			var apikey = req.params.apikey;
			
			var SpecimenId = req.query._id;
			var procedureRequestId = req.query.procedure_request_id;

			//susun query
			var condition = '';

			if (typeof SpecimenId !== 'undefined' && SpecimenId !== "") {
				condition += "specimen_id = '" + SpecimenId + "' AND ";
			}

			if (typeof procedureRequestId !== 'undefined' && procedureRequestId !== "") {
				condition += "procedure_request_id = '" + procedureRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestSpecimen = [];
			var query = 'select specimen_id from BACIRO_FHIR.specimen ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureRequestSpecimen = {};
					if(rez[i].specimen_id != "null"){
						procedureRequestSpecimen.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Specimen?_id=' +  rez[i].specimen_id;
					} else {
						procedureRequestSpecimen.id = "";
					}
					
					arrMedicationRequestSpecimen[i] = procedureRequestSpecimen;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestSpecimen
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestSpecimen"
				});
			});
		},
		procedureRequestProvenance: function getMedicationRequestProvenance(req, res) {
			var apikey = req.params.apikey;
			
			var ProvenanceId = req.query._id;
			var procedureRequestId = req.query.procedure_request_id;

			//susun query
			var condition = '';

			if (typeof ProvenanceId !== 'undefined' && ProvenanceId !== "") {
				condition += "provenance_id = '" + ProvenanceId + "' AND ";
			}

			if (typeof procedureRequestId !== 'undefined' && procedureRequestId !== "") {
				condition += "procedure_request_id = '" + procedureRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestProvenance = [];
			var query = 'select provenance_id from BACIRO_FHIR.provenance ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureRequestProvenance = {};
					if(rez[i].provenance_id != "null"){
						procedureRequestProvenance.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Provenance?_id=' +  rez[i].provenance_id;
					} else {
						procedureRequestProvenance.id = "";
					}
					
					arrMedicationRequestProvenance[i] = procedureRequestProvenance;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestProvenance
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestProvenance"
				});
			});
		},
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
			var procedure_request_id  = req.params._id;
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
			
			var condition = "procedure_request_id = '" + procedure_request_id + valueResource + "'";

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