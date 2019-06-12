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
			
			if(typeof subject !== 'undefined' && subject !== ""){
				condition += "(ct.SUBJECT_PATIENT = '" + subject + "' OR ct.SUBJECT_GROUP = '" + subject + "') AND,";  
			}
			
			var offset = req.query.offset;
			var limit = req.query.limit;

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " pr.procedure_id > '" + offset + "' AND ";       
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
			      
      var arrProcedure = [];
      var query = "select pr.procedure_id as procedure_id, pr.part_of_procedure as part_of_procedure, pr.status as status, pr.not_done as not_done, pr.not_done_reason as not_done_reason, pr.category as category, pr.code as code, pr.subject_patient as subject_patient, pr.subject_group as subject_group, pr.context_encounter as context_encounter, pr.context_episode_of_care as context_episode_of_care, pr.performed_date_time as performed_date_time, pr.performed_period_start as performed_period_start, pr.performed_period_end as performed_period_end, pr.location as location, pr.reason_code as reason_code, pr.body_site as body_site, pr.outcome as outcome, pr.complication as complication, pr.follow_up as follow_up, pr.used_code as used_code from baciro_fhir.procedure pr " + fixCondition + limit;
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Procedure = {};
					Procedure.resourceType = "Procedure";
          Procedure.id = rez[i].procedure_id;
					Procedure.partOf = rez[i].part_of_procedure;
					Procedure.status = rez[i].status;
					Procedure.notDone = rez[i].not_done;
					Procedure.notDoneReason = rez[i].not_done_reason;
					Procedure.category = rez[i].category;
					Procedure.code = rez[i].code;
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
					Procedure.subject = Subject;
					Procedure.context = Context;
					var Performed = {};
					if(rez[i].performed_date_time == null){
						Performed.performedDateTime = formatDate(rez[i].performed_date_time);
					}else{
						Performed.performedDateTime = rez[i].performed_date_time;
					}
					var performedperiod_start,performedperiod_end;
					if(rez[i].performed_period_start == null){
						performedperiod_start = formatDate(rez[i].performed_period_start);  
					}else{
						performedperiod_start = rez[i].performed_period_start;  
					}
					if(rez[i].performed_period_end == null){
						performedperiod_end = formatDate(rez[i].performed_period_end);  
					}else{
						performedperiod_end = rez[i].performed_period_end;  
					}
					Performed.performedPeriod = performedperiod_start + ' to ' + performedperiod_end;
					Procedure.performed = Performed;
					
					if(rez[i].location != "null"){
						Procedure.location = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].location;
					} else {
						Procedure.location = "";
					}
					Procedure.reasonCode = rez[i].reason_code;
					Procedure.bodySite = rez[i].body_site;
					Procedure.outcome = rez[i].outcome;
					Procedure.complication = rez[i].complication;
					Procedure.followUp = rez[i].follow_up;
					Procedure.usedCode = rez[i].used_code;
					
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
			var query = "select performer_id, role, actor_practitioner, actor_organization, actor_patient, actor_related_person, actor_device, on_behalf_of, procedure_id from baciro_fhir.procedure_performer " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ProcedurePerformer = {};
					ProcedurePerformer.id = rez[i].participant_id;
					ProcedurePerformer.role = rez[i].role;
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
					if(rez[i].actor_patient != "null"){
						Actor.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].actor_patient;
					} else {
						Actor.patient = "";
					}
					if(rez[i].actor_related_person != "null"){
						Actor.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].actor_related_person;
					} else {
						Actor.relatedPerson = "";
					}
					if(rez[i].actor_device != "null"){
						Actor.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].actor_device;
					} else {
						Actor.device = "";
					}
					ProcedurePerformer.actor = Actor;
					if(rez[i].on_behalf_of != "null"){
						ProcedurePerformer.onBehalfOf = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].on_behalf_of;
					} else {
						ProcedurePerformer.onBehalfOf = "";
					}
					
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
		},
		procedureFocalDevice: function getProcedureFocalDevice(req, res) {
			var apikey = req.params.apikey;
			
			var procedureFocalDeviceId = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = "";

			if (typeof procedureFocalDeviceId !== 'undefined' && procedureFocalDeviceId !== "") {
				condition += "FOCAL_DEVICE_ID = '" + procedureFocalDeviceId + "' AND ";
			}

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "PROCEDURE_ID = '" + procedureId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrProcedureFocalDevice = [];
			var query = "select focal_device_id, action, manipulated, procedure_id from baciro_fhir.PROCEDURE_FOCAL_DEVICE " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ProcedureFocalDevice = {};
					ProcedureFocalDevice.id = rez[i].focal_device_id;
					ProcedureFocalDevice.action = rez[i].action;
					ProcedureFocalDevice.manipulated = rez[i].manipulated;
					
					arrProcedureFocalDevice[i] = ProcedureFocalDevice;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedureFocalDevice
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedureFocalDevice"
				});
			});
		},
		
		procedureDefinitionPlanDefinition: function getProcedureDefinitionPlanDefinition(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedureDefinitionPlanDefinition = [];
			var query = 'select plan_definition_id from BACIRO_FHIR.plan_definition ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureDefinitionPlanDefinition = {};
					if(rez[i].plan_definition_id != "null"){
						procedureDefinitionPlanDefinition.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/PlanDefinition?_id=' +  rez[i].plan_definition_id;
					} else {
						procedureDefinitionPlanDefinition.id = "";
					}
					
					arrProcedureDefinitionPlanDefinition[i] = procedureDefinitionPlanDefinition;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedureDefinitionPlanDefinition
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedureDefinitionPlanDefinition"
				});
			});
		},
		procedureDefinitionActivityDefinition: function getProcedureDefinitionActivityDefinition(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedureDefinitionActivityDefinition = [];
			var query = 'select activity_definition_id from BACIRO_FHIR.activity_definition ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureDefinitionActivityDefinition = {};
					if(rez[i].activity_definition_id != "null"){
						procedureDefinitionActivityDefinition.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/ActivityDefinition?_id=' +  rez[i].activity_definition_id;
					} else {
						procedureDefinitionActivityDefinition.id = "";
					}
					
					arrProcedureDefinitionActivityDefinition[i] = procedureDefinitionActivityDefinition;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedureDefinitionActivityDefinition
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedureDefinitionActivityDefinition"
				});
			});
		},
		procedureDefinitionHealthcareService: function getProcedureDefinitionHealthcareService(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedureDefinitionHealthcareService = [];
			var query = 'select healthcare_service_id from BACIRO_FHIR.healthcare_service ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureDefinitionHealthcareService = {};
					if(rez[i].healthcare_service_id != "null"){
						procedureDefinitionHealthcareService.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/HealthcareService?_id=' +  rez[i].healthcare_service_id;
					} else {
						procedureDefinitionHealthcareService.id = "";
					}
					
					arrProcedureDefinitionHealthcareService[i] = procedureDefinitionHealthcareService;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedureDefinitionHealthcareService
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedureDefinitionHealthcareService"
				});
			});
		},
		procedureBasedOnCarePlan: function getProcedureBasedOnCarePlan(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedureBasedOnCarePlan = [];
			var query = 'select careplan_id from BACIRO_FHIR.careplan ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureBasedOnCarePlan = {};
					if(rez[i].care_plan_id != "null"){
						procedureBasedOnCarePlan.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/CarePlan?_id=' +  rez[i].care_plan_id;
					} else {
						procedureBasedOnCarePlan.id = "";
					}
					
					arrProcedureBasedOnCarePlan[i] = procedureBasedOnCarePlan;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedureBasedOnCarePlan
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedureBasedOnCarePlan"
				});
			});
		},
		procedureBasedOnProcedureRequest: function getProcedureBasedOnProcedureRequest(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedureBasedOnProcedureRequest = [];
			var query = 'select procedure_request_id from BACIRO_FHIR.procedure_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureBasedOnProcedureRequest = {};
					if(rez[i].procedure_request_id != "null"){
						procedureBasedOnProcedureRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/ProcedureRequest?_id=' +  rez[i].procedure_request_id;
					} else {
						procedureBasedOnProcedureRequest.id = "";
					}
					
					arrProcedureBasedOnProcedureRequest[i] = procedureBasedOnProcedureRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedureBasedOnProcedureRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedureBasedOnProcedureRequest"
				});
			});
		},
		procedureBasedOnReferralRequest: function getProcedureBasedOnReferralRequest(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedureBasedOnReferralRequest = [];
			var query = 'select referral_request_id from BACIRO_FHIR.referral_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureBasedOnReferralRequest = {};
					if(rez[i].referral_request_id != "null"){
						procedureBasedOnReferralRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/ReferralRequest?_id=' +  rez[i].referral_request_id;
					} else {
						procedureBasedOnReferralRequest.id = "";
					}
					
					arrProcedureBasedOnReferralRequest[i] = procedureBasedOnReferralRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedureBasedOnReferralRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedureBasedOnReferralRequest"
				});
			});
		},
		procedurePartOfProcedure: function getProcedurePartOfProcedure(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "part_of_procedure = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedurePartOfProcedure = [];
			var query = 'select procedure_id from BACIRO_FHIR.procedure ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedurePartOfProcedure = {};
					if(rez[i].procedure_id != "null"){
						procedurePartOfProcedure.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Procedure?_id=' +  rez[i].procedure_id;
					} else {
						procedurePartOfProcedure.id = "";
					}
					
					arrProcedurePartOfProcedure[i] = procedurePartOfProcedure;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedurePartOfProcedure
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedurePartOfProcedure"
				});
			});
		},
		procedurePartOfObservation: function getProcedurePartOfObservation(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_part_of_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedurePartOfObservation = [];
			var query = 'select observation_id from BACIRO_FHIR.observation ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedurePartOfObservation = {};
					if(rez[i].observation_id != "null"){
						procedurePartOfObservation.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Observation?_id=' +  rez[i].observation_id;
					} else {
						procedurePartOfObservation.id = "";
					}
					
					arrProcedurePartOfObservation[i] = procedurePartOfObservation;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedurePartOfObservation
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedurePartOfObservation"
				});
			});
		},
		procedurePartOfMedicationAdministration: function getProcedurePartOfMedicationAdministration(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedurePartOfMedicationAdministration = [];
			var query = 'select medication_administration_id from BACIRO_FHIR.medication_administration ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedurePartOfMedicationAdministration = {};
					if(rez[i].medication_administration_id != "null"){
						procedurePartOfMedicationAdministration.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationAdministration?_id=' +  rez[i].medication_administration_id;
					} else {
						procedurePartOfMedicationAdministration.id = "";
					}
					
					arrProcedurePartOfMedicationAdministration[i] = procedurePartOfMedicationAdministration;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedurePartOfMedicationAdministration
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedurePartOfMedicationAdministration"
				});
			});
		},
		procedureReasonReferenceCondition: function getProcedureReasonReferenceCondition(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_reason_reference_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedureReasonReferenceCondition = [];
			var query = 'select condition_id from BACIRO_FHIR.condition ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureReasonReferenceCondition = {};
					if(rez[i].condition_id != "null"){
						procedureReasonReferenceCondition.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Condition?_id=' +  rez[i].condition_id;
					} else {
						procedureReasonReferenceCondition.id = "";
					}
					
					arrProcedureReasonReferenceCondition[i] = procedureReasonReferenceCondition;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedureReasonReferenceCondition
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedureReasonReferenceCondition"
				});
			});
		},
		procedureReasonReferenceObservation: function getProcedureReasonReferenceObservation(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_part_reason_reference_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedureReasonReferenceObservation = [];
			var query = 'select observation_id from BACIRO_FHIR.observation ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureReasonReferenceObservation = {};
					if(rez[i].observation_id != "null"){
						procedureReasonReferenceObservation.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Observation?_id=' +  rez[i].observation_id;
					} else {
						procedureReasonReferenceObservation.id = "";
					}
					
					arrProcedureReasonReferenceObservation[i] = procedureReasonReferenceObservation;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedureReasonReferenceObservation
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedureReasonReferenceObservation"
				});
			});
		},
		procedureReport: function getProcedureReport(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedureReport = [];
			var query = 'select diagnostic_report_id from BACIRO_FHIR.diagnostic_report ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureReport = {};
					if(rez[i].diagnostic_report_id != "null"){
						procedureReport.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/DiagnosticReport?_id=' +  rez[i].diagnostic_report_id;
					} else {
						procedureReport.id = "";
					}
					
					arrProcedureReport[i] = procedureReport;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedureReport
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedureReport"
				});
			});
		},
		procedureComplicationDetail: function getProcedureComplicationDetail(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_complication_detail_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedureComplicationDetail = [];
			var query = 'select condition_id from BACIRO_FHIR.condition ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureComplicationDetail = {};
					if(rez[i].condition_id != "null"){
						procedureComplicationDetail.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Condition?_id=' +  rez[i].condition_id;
					} else {
						procedureComplicationDetail.id = "";
					}
					
					arrProcedureComplicationDetail[i] = procedureComplicationDetail;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedureComplicationDetail
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedureComplicationDetail"
				});
			});
		},
		procedureUsedReferenceDevice: function getProcedureUsedReferenceDevice(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedureUsedReferenceDevice = [];
			var query = 'select device_id from BACIRO_FHIR.device ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureUsedReferenceDevice = {};
					if(rez[i].device_id != "null"){
						procedureUsedReferenceDevice.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].device_id;
					} else {
						procedureUsedReferenceDevice.id = "";
					}
					
					arrProcedureUsedReferenceDevice[i] = procedureUsedReferenceDevice;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedureUsedReferenceDevice
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedureUsedReferenceDevice"
				});
			});
		},
		procedureUsedReferenceMedication: function getProcedureUsedReferenceMedication(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedureUsedReferenceMedication = [];
			var query = 'select medication_id from BACIRO_FHIR.medication ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureUsedReferenceMedication = {};
					if(rez[i].medication_id != "null"){
						procedureUsedReferenceMedication.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' +  rez[i].medication_id;
					} else {
						procedureUsedReferenceMedication.id = "";
					}
					
					arrProcedureUsedReferenceMedication[i] = procedureUsedReferenceMedication;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedureUsedReferenceMedication
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedureUsedReferenceMedication"
				});
			});
		},
		procedureUsedReferenceSubstance: function getProcedureUsedReferenceSubstance(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var procedureId = req.query.procedure_id;

			//susun query
			var condition = '';

			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_id = '" + procedureId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrProcedureUsedReferenceSubstance = [];
			var query = 'select substance_id from BACIRO_FHIR.substance ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var procedureUsedReferenceSubstance = {};
					if(rez[i].substance_id != "null"){
						procedureUsedReferenceSubstance.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Substance?_id=' +  rez[i].substance_id;
					} else {
						procedureUsedReferenceSubstance.id = "";
					}
					
					arrProcedureUsedReferenceSubstance[i] = procedureUsedReferenceSubstance;
				}
				res.json({
					"err_code": 0,
					"data": arrProcedureUsedReferenceSubstance
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getProcedureUsedReferenceSubstance"
				});
			});
		},
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
			
			var adverse_event_id = req.body.adverse_event_id;
			var appointment_id = req.body.appointment_id;
			var charge_item_id = req.body.charge_item_id;
			var clinical_impression_id = req.body.clinical_impression_id;
			var imaging_study_based_on_id = req.body.imaging_study_based_on_id;
			var imaging_study_procedure_reference_id = req.body.imaging_study_procedure_reference_id;
			var medication_administration_id = req.body.medication_administration_id;
			var medication_dispense_id = req.body.medication_dispense_id;
			var medication_statement_id = req.body.medication_statement_id;
			var questionnaire_response_id = req.body.questionnaire_response_id;
			
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
				values += "to_date('"+ performed_date_time + "', 'yyyy-MM-dd HH:mm'),";
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
			
			if (typeof adverse_event_id !== 'undefined' && adverse_event_id !== "") {
        column += 'adverse_event_id,';
        values += "'" + adverse_event_id + "',";
      }
			
			if (typeof appointment_id !== 'undefined' && appointment_id !== "") {
        column += 'appointment_id,';
        values += "'" + appointment_id + "',";
      }
			
			if (typeof charge_item_id !== 'undefined' && charge_item_id !== "") {
        column += 'charge_item_id,';
        values += "'" + charge_item_id + "',";
      }
			
			if (typeof imaging_study_based_on_id !== 'undefined' && imaging_study_based_on_id !== "") {
        column += 'imaging_study_based_on_id,';
        values += "'" + imaging_study_based_on_id + "',";
      }
			
			if (typeof imaging_study_procedure_reference_id !== 'undefined' && imaging_study_procedure_reference_id !== "") {
        column += 'imaging_study_procedure_reference_id,';
        values += "'" + imaging_study_procedure_reference_id + "',";
      }
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }
			
			if (typeof medication_dispense_id !== 'undefined' && medication_dispense_id !== "") {
        column += 'medication_dispense_id,';
        values += "'" + medication_dispense_id + "',";
      }
			
			if (typeof medication_statement_id !== 'undefined' && medication_statement_id !== "") {
        column += 'medication_statement_id,';
        values += "'" + medication_statement_id + "',";
      }
			
			if (typeof questionnaire_response_id !== 'undefined' && questionnaire_response_id !== "") {
        column += 'questionnaire_response_id,';
        values += "'" + questionnaire_response_id + "',";
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
    },
		procedureFocalDevice: function addProcedureFocalDevice(req, res) {
			console.log(req.body);
			var focal_device_id = req.body.focal_device_id;
			var action = req.body.action;
			var manipulated = req.body.manipulated;
			var procedure_id = req.body.procedure_id;
			
			var column = "";
      var values = "";
			
			if (typeof action !== 'undefined' && action !== "") {
        column += 'action,';
        values += "'" + action + "',";
      }
			
			if (typeof manipulated !== 'undefined' && manipulated !== "") {
        column += 'manipulated,';
        values += "'" + manipulated + "',";
      }
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.PROCEDURE_FOCAL_DEVICE(focal_device_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+focal_device_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select focal_device_id, action, manipulated, procedure_id from baciro_fhir.PROCEDURE_FOCAL_DEVICE WHERE focal_device_id = '" + focal_device_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureFocalDevice"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addProcedureFocalDevice"});
      });
    }
	},
	put: {
		procedure: function updateProcedure(req, res) {
			console.log(req.body);
			var procedure_id = req.params._id;
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
			var adverse_event_id = req.body.adverse_event_id;
			var appointment_id = req.body.appointment_id;
			var charge_item_id = req.body.charge_item_id;
			var imaging_study_based_on_id = req.body.imaging_study_based_on_id;
			var imaging_study_procedure_reference_id = req.body.imaging_study_procedure_reference_id;
			var medication_administration_id = req.body.medication_administration_id;
			var medication_dispense_id = req.body.medication_dispense_id;
			var medication_statement_id = req.body.medication_statement_id;
			var questionnaire_response_id = req.body.questionnaire_response_id;
			
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
				values += "to_date('"+ performed_date_time + "', 'yyyy-MM-dd HH:mm'),";
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
			
			if (typeof adverse_event_id !== 'undefined' && adverse_event_id !== "") {
        column += 'adverse_event_id,';
        values += "'" + adverse_event_id + "',";
      }
			
			if (typeof appointment_id !== 'undefined' && appointment_id !== "") {
        column += 'appointment_id,';
        values += "'" + appointment_id + "',";
      }
			
			if (typeof charge_item_id !== 'undefined' && charge_item_id !== "") {
        column += 'charge_item_id,';
        values += "'" + charge_item_id + "',";
      }
			
			if (typeof imaging_study_based_on_id !== 'undefined' && imaging_study_based_on_id !== "") {
        column += 'imaging_study_based_on_id,';
        values += "'" + imaging_study_based_on_id + "',";
      }
			
			if (typeof imaging_study_procedure_reference_id !== 'undefined' && imaging_study_procedure_reference_id !== "") {
        column += 'imaging_study_procedure_reference_id,';
        values += "'" + imaging_study_procedure_reference_id + "',";
      }
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }
			
			if (typeof medication_dispense_id !== 'undefined' && medication_dispense_id !== "") {
        column += 'medication_dispense_id,';
        values += "'" + medication_dispense_id + "',";
      }
			
			if (typeof medication_statement_id !== 'undefined' && medication_statement_id !== "") {
        column += 'medication_statement_id,';
        values += "'" + medication_statement_id + "',";
      }
			
			if (typeof questionnaire_response_id !== 'undefined' && questionnaire_response_id !== "") {
        column += 'questionnaire_response_id,';
        values += "'" + questionnaire_response_id + "',";
      }
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "procedure_id = '" + procedure_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "procedure_id = '" + procedure_id+ "'";
      }

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
			
			var performer_id = req.params._id;
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
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "performer_id = '" + performer_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "performer_id = '" + performer_id+ "'";
      }
			
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
    },
		procedureFocalDevice: function updateProcedureFocalDevice(req, res) {
			console.log(req.body);
			
			var focal_device_id = req.body._id;
			var action = req.body.action;
			var manipulated = req.body.manipulated;
			var procedure_id = req.body.procedure_id;
			
			var column = "";
      var values = "";
			
			if (typeof action !== 'undefined' && action !== "") {
        column += 'action,';
        values += "'" + action + "',";
      }
			
			if (typeof manipulated !== 'undefined' && manipulated !== "") {
        column += 'manipulated,';
        values += "'" + manipulated + "',";
      }
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "focal_device_id = '" + focal_device_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "focal_device_id = '" + focal_device_id+ "'";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.procedure_performer(focal_device_id," + column.slice(0, -1) + ") SELECT focal_device_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.procedure_performer WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select focal_device_id, action, manipulated, procedure_id from baciro_fhir.PROCEDURE_FOCAL_DEVICE WHERE focal_device_id = '" + focal_device_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureFocalDevice"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateProcedureFocalDevice"});
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