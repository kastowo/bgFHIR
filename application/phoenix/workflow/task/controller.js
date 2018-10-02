var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var path = require('path');

var configYaml = yamlconfig.readConfig(path.resolve('../../application/config/config.yml'));

//task emitter
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
		task: function getTask(req, res){
			var apikey = req.params.apikey;
			var taskId = req.query._id;
			
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
			
			if(typeof taskId !== 'undefined' && taskId !== ""){
        condition += "dr.diagnostic_report_id = '" + taskId + "' AND,";  
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

			var arrTask = [];
      var query = "select ta.task_id as task_id, ta.definition_uri as definition_uri, ta.definition_reference as definition_reference, ta.based_on as based_on, ta.group_identifier as group_identifier, ta.part_of as part_of, ta.status as status, ta.status_reason as status_reason, ta.business_status as business_status, ta.intent as intent, ta.priority as priority, ta.code as code, ta.description as description, ta.focus as focus, ta.fors as fors, ta.context_encounter as context_encounter, ta.context_episode_of_care as context_episode_of_care, ta.execution_period_start as execution_period_start, ta.execution_period_end as execution_period_end, ta.authored_on as authored_on, ta.last_modified as last_modified, ta.requester_agent_device as requester_agent_device, ta.requester_agent_organization as requester_agent_organization, ta.requester_agent_patient as requester_agent_patient, ta.requester_agent_practitioner as requester_agent_practitioner, ta.requester_agent_related_person as requester_agent_related_person, ta.requester_on_behalf_of as requester_on_behalf_of, ta.performer_type as performer_type, ta.owner_device as owner_device, ta.owner_organization as owner_organization, ta.owner_patient as owner_patient, ta.owner_practitioner as owner_practitioner, ta.owner_related_person as owner_related_person, ta.reason as reason, ta.restriction_repetitions as restriction_repetitions, ta.restriction_period_start as restriction_period_start, ta.restriction_period_end as restriction_period_end from BACIRO_FHIR.task ta " + fixCondition;
			//console.log(query);			
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Task = {};
					Task.resourceType = "Task";
					Task.id = rez[i].task_id;
					Task.definition.definitionUri = rez[i].definition_uri;
					if(rez[i].definition_reference != "null"){
						Task.definition.definitionReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/ActivityDefinition?_id=' +  rez[i].definition_reference;
					} else {
						Task.definition.definitionReference = "";
					}
					Task.basedOn = rez[i].based_on;
					Task.groupIdentifier = rez[i].group_identifier;
					if(rez[i].part_of != "null"){
						Task.partOf = hostFHIR + ':' + portFHIR + '/' + apikey + '/Task?_id=' +  rez[i].part_of;
					} else {
						Task.partOf = "";
					}
					Task.status = rez[i].status;
					Task.statusReason = rez[i].status_reason;
					Task.business_status = rez[i].business_status;
					Task.intent = rez[i].intent;
					Task.priority = rez[i].priority;
					Task.code = rez[i].code;
					Task.description = rez[i].description;
					Task.focus = rez[i].focus;
					Task.fors = rez[i].fors;
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
					Task.context = arrContext;
					var executionperiod_start,executionperiod_end;
					if(rez[i].execution_period_start == null){
						executionperiod_start = formatDate(rez[i].execution_period_start);  
					}else{
						executionperiod_start = rez[i].execution_period_start;  
					}
					if(rez[i].execution_period_end == null){
						executionperiod_end = formatDate(rez[i].execution_period_end);  
					}else{
						executionperiod_end = rez[i].execution_period_end;  
					}
					Task.executionPeriod = executionperiod_start + ' to ' + executionperiod_end;
					if(rez[i].authored_on == null){
						Task.authoredOn  = formatDate(rez[i].authored_on);  
					}else{
						Task.authoredOn  = rez[i].authored_on;  
					}
					if(rez[i].last_modified == null){
						Task.lastModified  = formatDate(rez[i].last_modified);  
					}else{
						Task.lastModified  = rez[i].last_modified;  
					}
					var arrAgent = [];
					var Agent = {};
					if(rez[i].requester_agent_device != "null"){
						Agent.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].requester_agent_device;
					} else {
						Agent.device = "";
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
					if(rez[i].requester_agent_practitioner != "null"){
						Agent.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].requester_agent_practitioner;
					} else {
						Agent.practitioner = "";
					}
					if(rez[i].requester_agent_related_person != "null"){
						Agent.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].requester_agent_related_person;
					} else {
						Agent.relatedPerson = "";
					}
					arrAgent[i] = Agent;
					Task.requester.agent = arrAgent;
					Task.requester.onBehalfOf = rez[i].requester_on_behalf_of;
					Task.performerType = rez[i].performer_type;
					var arrOwner = [];
					var Owner = {};
					if(rez[i].owner_device != "null"){
						Owner.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].owner_device;
					} else {
						Owner.device = "";
					}
					if(rez[i].owner_organization != "null"){
						Owner.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].owner_organization;
					} else {
						Owner.organization = "";
					}
					if(rez[i].owner_patient != "null"){
						Owner.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].owner_patient;
					} else {
						Owner.patient = "";
					}
					if(rez[i].owner_practitioner != "null"){
						Owner.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].owner_practitioner;
					} else {
						Owner.practitioner = "";
					}
					if(rez[i].owner_related_person != "null"){
						Owner.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].owner_related_person;
					} else {
						Owner.relatedPerson = "";
					}
					arrOwner[i] = Owner;
					Task.owner = arrOwner;
					Task.reason = rez[i].reason;
					Task.restriction.restrictionRepetitions = rez[i].restriction_repetitions;
					var restrictionperiod_start, restrictionperiod_end;
					if(rez[i].restriction_period_start == null){
						restrictionperiod_start = formatDate(rez[i].restriction_period_start);  
					}else{
						restrictionperiod_start = rez[i].restriction_period_start;  
					}
					if(rez[i].restriction_period_end == null){
						restrictionperiod_end = formatDate(rez[i].restriction_period_end);  
					}else{
						restrictionperiod_end = rez[i].restriction_period_end;  
					}
					Task.restriction.restrictionPeriod = restrictionperiod_start + ' to ' + restrictionperiod_end;
					
          arrTask[i] = Task;
        }
        res.json({"err_code":0,"data": arrTask});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getTask"});
      });
    },
		taskInput: function getTaskInput(req, res) {
			var apikey = req.params.apikey;
			
			var taskInputId = req.query._id;
			var taskId = req.query.task_id;

			//susun query
			var condition = "";

			if (typeof taskInputId !== 'undefined' && taskInputId !== "") {
				condition += "input_id = '" + taskInputId + "' AND ";
			}

			if (typeof taskId !== 'undefined' && taskId !== "") {
				condition += "task_id = '" + taskId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrTaskInput = [];
			var query = "select input_id, type, valuees from BACIRO_FHIR.task_input " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var TaskInput = {};
					TaskInput.id = rez[i].input_id;
					TaskInput.type = rez[i].type;
					TaskInput.value = rez[i].valuees;
					
					arrTaskInput[i] = TaskInput;
				}
				res.json({
					"err_code": 0,
					"data": arrTaskInput
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getTaskInput"
				});
			});
		},
		taskOutput: function getTaskOutput(req, res) {
			var apikey = req.params.apikey;
			
			var taskOutputId = req.query._id;
			var taskId = req.query.task_id;

			//susun query
			var condition = "";

			if (typeof taskOutputId !== 'undefined' && taskOutputId !== "") {
				condition += "output_id = '" + taskOutputId + "' AND ";
			}

			if (typeof taskId !== 'undefined' && taskId !== "") {
				condition += "task_id = '" + taskId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrTaskOutput = [];
			var query = "select output_id, type, valuees from BACIRO_FHIR.task_output " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var TaskOutput = {};
					TaskOutput.id = rez[i].output_id;
					TaskOutput.type = rez[i].type;
					TaskOutput.value = rez[i].valuees;
					
					arrTaskOutput[i] = TaskOutput;
				}
				res.json({
					"err_code": 0,
					"data": arrTaskOutput
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getTaskOutput"
				});
			});
		},
  },
	post: {
		task: function addTask(req, res) {
			console.log(req.body);
			var task_id  = req.body.task_id;
			var definition_uri  = req.body.definition_reference;
			var definition_reference  = req.body.task_id;
			var based_on  = req.body.based_on;
			var group_identifier  = req.body.group_identifier;
			var part_of  = req.body.part_of;
			var status  = req.body.status;
			var status_reason  = req.body.status_reason;
			var business_status  = req.body.business_status;
			var intent  = req.body.intent;
			var priority  = req.body.priority;
			var code  = req.body.code;
			var description  = req.body.description;
			var focus  = req.body.focus;
			var fors  = req.body.fors;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var execution_period_start  = req.body.execution_period_start;
			var execution_period_end  = req.body.execution_period_end;
			var authored_on  = req.body.authored_on;
			var last_modified  = req.body.last_modified;
			var requester_agent_device  = req.body.requester_agent_device;
			var requester_agent_organization  = req.body.requester_agent_organization;
			var requester_agent_patient  = req.body.requester_agent_patient;
			var requester_agent_practitioner  = req.body.requester_agent_practitioner;
			var requester_agent_related_person  = req.body.requester_agent_related_person;
			var requester_on_behalf_of  = req.body.requester_on_behalf_of;
			var performer_type  = req.body.performer_type;
			var owner_device  = req.body.owner_device;
			var owner_organization  = req.body.owner_organization;
			var owner_patient  = req.body.owner_patient;
			var owner_practitioner  = req.body.owner_practitioner;
			var owner_related_person  = req.body.owner_related_person;
			var reason  = req.body.reason;
			var restriction_repetitions  = req.body.restriction_repetitions;
			var restriction_period_start  = req.body.restriction_period_start;
			var restriction_period_end  = req.body.restriction_period_end;
			
			var column = "";
      var values = "";
			
			if (typeof definition_uri !== 'undefined' && definition_uri !== "") {
        column += 'definition_uri,';
        values += "'" + definition_uri + "',";
      }
			
			if (typeof definition_reference !== 'undefined' && definition_reference !== "") {
        column += 'definition_reference,';
        values += "'" + definition_reference + "',";
      }
			
			if (typeof based_on !== 'undefined' && based_on !== "") {
        column += 'based_on,';
        values += "'" + based_on + "',";
      }	
			
			if (typeof group_identifier !== 'undefined' && group_identifier !== "") {
        column += 'group_identifier,';
        values += "'" + group_identifier + "',";
      }	
			
			if (typeof part_of !== 'undefined' && part_of !== "") {
        column += 'part_of,';
        values += "'" + part_of + "',";
      }	
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }	
			
			if (typeof status_reason !== 'undefined' && status_reason !== "") {
        column += 'status_reason,';
        values += "'" + status_reason + "',";
      }
			
			if (typeof business_status !== 'undefined' && business_status !== "") {
        column += 'business_status,';
        values += "'" + business_status + "',";
      }
			
			if (typeof intent !== 'undefined' && intent !== "") {
        column += 'intent,';
        values += "'" + intent + "',";
      }	
			
			if (typeof priority !== 'undefined' && priority !== "") {
        column += 'priority,';
        values += "'" + priority + "',";
      }	
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }
			
			if (typeof focus !== 'undefined' && focus !== "") {
        column += 'focus,';
        values += "'" + focus + "',";
      }	
			
			if (typeof fors !== 'undefined' && fors !== "") {
        column += 'fors,';
        values += "'" + fors + "',";
      }
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }		
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }		
			
			if (typeof execution_period_start !== 'undefined' && execution_period_start !== "") {
        column += 'execution_period_start,';
				values += "to_date('"+ execution_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof execution_period_end !== 'undefined' && execution_period_end !== "") {
        column += 'execution_period_end,';
				values += "to_date('"+ execution_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof authored_on !== 'undefined' && authored_on !== "") {
        column += 'authored_on,';
				values += "to_date('"+ authored_on + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof last_modified !== 'undefined' && last_modified !== "") {
        column += 'last_modified,';
				values += "to_date('"+ last_modified + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof requester_agent_device !== 'undefined' && requester_agent_device !== "") {
        column += 'requester_agent_device,';
        values += "'" + requester_agent_device + "',";
      }		
			
			if (typeof requester_agent_organization !== 'undefined' && requester_agent_organization !== "") {
        column += 'requester_agent_organization,';
        values += "'" + requester_agent_organization + "',";
      }
			
			if (typeof requester_agent_patient !== 'undefined' && requester_agent_patient !== "") {
        column += 'requester_agent_patient,';
        values += "'" + requester_agent_patient + "',";
      }		
			
			if (typeof requester_agent_practitioner !== 'undefined' && requester_agent_practitioner !== "") {
        column += 'requester_agent_practitioner,';
        values += "'" + requester_agent_practitioner + "',";
      }
			
			if (typeof requester_agent_related_person !== 'undefined' && requester_agent_related_person !== "") {
        column += 'requester_agent_related_person,';
        values += "'" + requester_agent_related_person + "',";
      }		
			
			if (typeof requester_on_behalf_of !== 'undefined' && requester_on_behalf_of !== "") {
        column += 'requester_on_behalf_of,';
        values += "'" + requester_on_behalf_of + "',";
      }
			
			if (typeof performer_type !== 'undefined' && performer_type !== "") {
        column += 'performer_type,';
        values += "'" + performer_type + "',";
      }		
			
			if (typeof owner_device !== 'undefined' && owner_device !== "") {
        column += 'owner_device,';
        values += "'" + owner_device + "',";
      }
			
			if (typeof owner_organization !== 'undefined' && owner_organization !== "") {
        column += 'owner_organization,';
        values += "'" + owner_organization + "',";
      }		
			
			if (typeof owner_patient !== 'undefined' && owner_patient !== "") {
        column += 'owner_patient,';
        values += "'" + owner_patient + "',";
      }
			
			if (typeof owner_practitioner !== 'undefined' && owner_practitioner !== "") {
        column += 'owner_practitioner,';
        values += "'" + owner_practitioner + "',";
      }		
			
			if (typeof owner_related_person !== 'undefined' && owner_related_person !== "") {
        column += 'owner_related_person,';
        values += "'" + owner_related_person + "',";
      }
			
			if (typeof reason !== 'undefined' && reason !== "") {
        column += 'reason,';
        values += "'" + reason + "',";
      }		
			
			if (typeof restriction_repetitions !== 'undefined' && restriction_repetitions !== "") {
        column += 'restriction_repetitions,';
        values += " " + restriction_repetitions + ",";
      }
			
			if (typeof restriction_period_start !== 'undefined' && restriction_period_start !== "") {
        column += 'restriction_period_start,';
				values += "to_date('"+ restriction_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof restriction_period_end !== 'undefined' && restriction_period_end !== "") {
        column += 'restriction_period_end,';
				values += "to_date('"+ restriction_period_end + "', 'yyyy-MM-dd'),";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.task(task_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+task_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select task_id from BACIRO_FHIR.task WHERE task_id = '" + task_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addTask"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addTask"});
      });
    },
		taskInput: function addTaskInput(req, res) {
			console.log(req.body);
			var input_id  = req.body.input_id;
			var type  = req.body.type;
			var valuees  = req.body.value;
			var task_id  = req.body.task_id;

			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof valuees !== 'undefined' && valuees !== "") {
        column += 'valuees,';
        values += "'" + valuees + "',";
      }
			
			if (typeof task_id !== 'undefined' && task_id !== "") {
        column += 'task_id,';
        values += "'" + task_id + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.task_input(input_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+input_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select input_id from BACIRO_FHIR.task_input WHERE input_id = '" + input_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addTaskInput"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addTaskInput"});
      });
    },
		taskOutput: function addTaskOutput(req, res) {
			console.log(req.body);
			var output_id  = req.body.output_id;
			var type  = req.body.type;
			var valuees  = req.body.value;
			var task_id  = req.body.task_id;

			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof valuees !== 'undefined' && valuees !== "") {
        column += 'valuees,';
        values += "'" + valuees + "',";
      }
			
			if (typeof task_id !== 'undefined' && task_id !== "") {
        column += 'task_id,';
        values += "'" + task_id + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.task_output(output_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+output_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select output_id from BACIRO_FHIR.task_output WHERE output_id = '" + output_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addTaskOutput"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addTaskOutput"});
      });
    },
	},
	put: {
		task: function updateTask(req, res) {
			console.log(req.body);
			var task_id  = req.params.task_id;
			var definition_uri  = req.body.definition_reference;
			var definition_reference  = req.body.task_id;
			var based_on  = req.body.based_on;
			var group_identifier  = req.body.group_identifier;
			var part_of  = req.body.part_of;
			var status  = req.body.status;
			var status_reason  = req.body.status_reason;
			var business_status  = req.body.business_status;
			var intent  = req.body.intent;
			var priority  = req.body.priority;
			var code  = req.body.code;
			var description  = req.body.description;
			var focus  = req.body.focus;
			var fors  = req.body.fors;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var execution_period_start  = req.body.execution_period_start;
			var execution_period_end  = req.body.execution_period_end;
			var authored_on  = req.body.authored_on;
			var last_modified  = req.body.last_modified;
			var requester_agent_device  = req.body.requester_agent_device;
			var requester_agent_organization  = req.body.requester_agent_organization;
			var requester_agent_patient  = req.body.requester_agent_patient;
			var requester_agent_practitioner  = req.body.requester_agent_practitioner;
			var requester_agent_related_person  = req.body.requester_agent_related_person;
			var requester_on_behalf_of  = req.body.requester_on_behalf_of;
			var performer_type  = req.body.performer_type;
			var owner_device  = req.body.owner_device;
			var owner_organization  = req.body.owner_organization;
			var owner_patient  = req.body.owner_patient;
			var owner_practitioner  = req.body.owner_practitioner;
			var owner_related_person  = req.body.owner_related_person;
			var reason  = req.body.reason;
			var restriction_repetitions  = req.body.restriction_repetitions;
			var restriction_period_start  = req.body.restriction_period_start;
			var restriction_period_end  = req.body.restriction_period_end;
			
			var column = "";
      var values = "";
			
			if (typeof definition_uri !== 'undefined' && definition_uri !== "") {
        column += 'definition_uri,';
        values += "'" + definition_uri + "',";
      }
			
			if (typeof definition_reference !== 'undefined' && definition_reference !== "") {
        column += 'definition_reference,';
        values += "'" + definition_reference + "',";
      }
			
			if (typeof based_on !== 'undefined' && based_on !== "") {
        column += 'based_on,';
        values += "'" + based_on + "',";
      }	
			
			if (typeof group_identifier !== 'undefined' && group_identifier !== "") {
        column += 'group_identifier,';
        values += "'" + group_identifier + "',";
      }	
			
			if (typeof part_of !== 'undefined' && part_of !== "") {
        column += 'part_of,';
        values += "'" + part_of + "',";
      }	
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }	
			
			if (typeof status_reason !== 'undefined' && status_reason !== "") {
        column += 'status_reason,';
        values += "'" + status_reason + "',";
      }
			
			if (typeof business_status !== 'undefined' && business_status !== "") {
        column += 'business_status,';
        values += "'" + business_status + "',";
      }
			
			if (typeof intent !== 'undefined' && intent !== "") {
        column += 'intent,';
        values += "'" + intent + "',";
      }	
			
			if (typeof priority !== 'undefined' && priority !== "") {
        column += 'priority,';
        values += "'" + priority + "',";
      }	
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }
			
			if (typeof focus !== 'undefined' && focus !== "") {
        column += 'focus,';
        values += "'" + focus + "',";
      }	
			
			if (typeof fors !== 'undefined' && fors !== "") {
        column += 'fors,';
        values += "'" + fors + "',";
      }
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }		
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }		
			
			if (typeof execution_period_start !== 'undefined' && execution_period_start !== "") {
        column += 'execution_period_start,';
				values += "to_date('"+ execution_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof execution_period_end !== 'undefined' && execution_period_end !== "") {
        column += 'execution_period_end,';
				values += "to_date('"+ execution_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof authored_on !== 'undefined' && authored_on !== "") {
        column += 'authored_on,';
				values += "to_date('"+ authored_on + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof last_modified !== 'undefined' && last_modified !== "") {
        column += 'last_modified,';
				values += "to_date('"+ last_modified + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof requester_agent_device !== 'undefined' && requester_agent_device !== "") {
        column += 'requester_agent_device,';
        values += "'" + requester_agent_device + "',";
      }		
			
			if (typeof requester_agent_organization !== 'undefined' && requester_agent_organization !== "") {
        column += 'requester_agent_organization,';
        values += "'" + requester_agent_organization + "',";
      }
			
			if (typeof requester_agent_patient !== 'undefined' && requester_agent_patient !== "") {
        column += 'requester_agent_patient,';
        values += "'" + requester_agent_patient + "',";
      }		
			
			if (typeof requester_agent_practitioner !== 'undefined' && requester_agent_practitioner !== "") {
        column += 'requester_agent_practitioner,';
        values += "'" + requester_agent_practitioner + "',";
      }
			
			if (typeof requester_agent_related_person !== 'undefined' && requester_agent_related_person !== "") {
        column += 'requester_agent_related_person,';
        values += "'" + requester_agent_related_person + "',";
      }		
			
			if (typeof requester_on_behalf_of !== 'undefined' && requester_on_behalf_of !== "") {
        column += 'requester_on_behalf_of,';
        values += "'" + requester_on_behalf_of + "',";
      }
			
			if (typeof performer_type !== 'undefined' && performer_type !== "") {
        column += 'performer_type,';
        values += "'" + performer_type + "',";
      }		
			
			if (typeof owner_device !== 'undefined' && owner_device !== "") {
        column += 'owner_device,';
        values += "'" + owner_device + "',";
      }
			
			if (typeof owner_organization !== 'undefined' && owner_organization !== "") {
        column += 'owner_organization,';
        values += "'" + owner_organization + "',";
      }		
			
			if (typeof owner_patient !== 'undefined' && owner_patient !== "") {
        column += 'owner_patient,';
        values += "'" + owner_patient + "',";
      }
			
			if (typeof owner_practitioner !== 'undefined' && owner_practitioner !== "") {
        column += 'owner_practitioner,';
        values += "'" + owner_practitioner + "',";
      }		
			
			if (typeof owner_related_person !== 'undefined' && owner_related_person !== "") {
        column += 'owner_related_person,';
        values += "'" + owner_related_person + "',";
      }
			
			if (typeof reason !== 'undefined' && reason !== "") {
        column += 'reason,';
        values += "'" + reason + "',";
      }		
			
			if (typeof restriction_repetitions !== 'undefined' && restriction_repetitions !== "") {
        column += 'restriction_repetitions,';
        values += " " + restriction_repetitions + ",";
      }
			
			if (typeof restriction_period_start !== 'undefined' && restriction_period_start !== "") {
        column += 'restriction_period_start,';
				values += "to_date('"+ restriction_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof restriction_period_end !== 'undefined' && restriction_period_end !== "") {
        column += 'restriction_period_end,';
				values += "to_date('"+ restriction_period_end + "', 'yyyy-MM-dd'),";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "task_id = '" + task_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.task(task_id," + column.slice(0, -1) + ") SELECT task_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.task WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select task_id from BACIRO_FHIR.task WHERE task_id = '" + task_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateTask"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateTask"});
      });
    },
		taskInput: function updateTaskInput(req, res) {
			console.log(req.body);
			var input_id  = req.params.input_id;
			var type  = req.body.type;
			var valuees  = req.body.value;
			var task_id  = req.body.task_id;

			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof valuees !== 'undefined' && valuees !== "") {
        column += 'valuees,';
        values += "'" + valuees + "',";
      }
			
			if (typeof task_id !== 'undefined' && task_id !== "") {
        column += 'task_id,';
        values += "'" + task_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "input_id = '" + input_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.task_input(input_id," + column.slice(0, -1) + ") SELECT input_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.task_input WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select input_id from BACIRO_FHIR.task_input WHERE input_id = '" + input_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateTaskInput"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateTaskInput"});
      });
    },
		taskOutput: function updateTaskOutput(req, res) {
			console.log(req.body);
			var output_id  = req.params.output_id;
			var type  = req.body.type;
			var valuees  = req.body.value;
			var task_id  = req.body.task_id;

			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof valuees !== 'undefined' && valuees !== "") {
        column += 'valuees,';
        values += "'" + valuees + "',";
      }
			
			if (typeof task_id !== 'undefined' && task_id !== "") {
        column += 'task_id,';
        values += "'" + task_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "output_id = '" + output_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.task_output(output_id," + column.slice(0, -1) + ") SELECT output_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.task_output WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select output_id from BACIRO_FHIR.task_output WHERE output_id = '" + output_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateTaskOutput"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateTaskOutput"});
      });
    },
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