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
		planDefinition: function getPlanDefinition(req, res){
			var apikey = req.params.apikey;
			var planDefinitionId = req.query._id;
			
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
			
			if(typeof planDefinitionId !== 'undefined' && planDefinitionId !== ""){
        condition += "dr.diagnostic_report_id = '" + planDefinitionId + "' AND,";  
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

			var arrPlanDefinition = [];
      var query = "select pd.plan_definition_id as plan_definition_id, pd.url as url, pd.version as version, pd.name as name, pd.title as title, pd.type as type, pd.status as status, pd.experimental as experimental, pd.date as date, pd.publisher as publisher, pd.description as description, pd.purpose as purpose, pd.usage as usage, pd.approval_date as approval_date, pd.last_review_date as last_review_date, pd.effective_period_start as effective_period_start, pd.effective_period_end as effective_period_end, pd.jurisdiction as jurisdiction, pd.topic as topic, pd.copyright as copyright, pd.library as library from BACIRO_FHIR.plan_definition pd " + fixCondition;
			//console.log(query);			
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var PlanDefinition = {};
					PlanDefinition.resourceType = "PlanDefinition";
					PlanDefinition.id = rez[i].plan_definition_id;
					PlanDefinition.url = rez[i].url;
					PlanDefinition.version = rez[i].version;
					PlanDefinition.name = rez[i].name;
					PlanDefinition.title = rez[i].title;
					PlanDefinition.type = rez[i].type;
					PlanDefinition.status = rez[i].status;
					PlanDefinition.experimental = rez[i].experimental;
					if(rez[i].date == null){
						PlanDefinition.date = formatDate(rez[i].date);
					}else{
						PlanDefinition.date = rez[i].date;
					}
					PlanDefinition.publisher = rez[i].publisher;
					PlanDefinition.description = rez[i].description;
					PlanDefinition.purpose = rez[i].purpose;
					PlanDefinition.usage = rez[i].usage;
					if(rez[i].approval_date == null){
						PlanDefinition.approvalDate = formatDate(rez[i].approval_date);
					}else{
						PlanDefinition.approvalDate = rez[i].approval_date;
					}
					if(rez[i].last_review_date == null){
						PlanDefinition.lastReviewDate = formatDate(rez[i].last_review_date);
					}else{
						PlanDefinition.lastReviewDate = rez[i].last_review_date;
					}
					
					var effectivePeriodStart, effectivePeriodEnd;
					if(rez[i].effective_period_start == null){
						effectivePeriodStart = formatDate(rez[i].effective_period_start);
					}else{
						effectivePeriodStart = rez[i].effective_period_start;
					}
					if(rez[i].effective_period_end == null){
						effectivePeriodEnd = formatDate(rez[i].effective_period_end);
					}else{
						effectivePeriodEnd = rez[i].effective_period_end;
					}
					PlanDefinition.jurisdiction = rez[i].jurisdiction;
					PlanDefinition.topic = rez[i].topic;
					PlanDefinition.copyright = rez[i].copyright;
					PlanDefinition.library = rez[i].library;
					
          arrPlanDefinition[i] = PlanDefinition;
        }
        res.json({"err_code":0,"data": arrPlanDefinition});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPlanDefinition"});
      });
    },
		planDefinitionAction: function getPlanDefinitionAction(req, res) {
			var apikey = req.params.apikey;
			
			var planDefinitionActionId = req.query._id;
			var planDefinitionId = req.query.plan_definition_id;

			//susun query
			var condition = "";

			if (typeof planDefinitionActionId !== 'undefined' && planDefinitionActionId !== "") {
				condition += "action_id = '" + planDefinitionActionId + "' AND ";
			}

			if (typeof planDefinitionId !== 'undefined' && planDefinitionId !== "") {
				condition += "plan_definition_id = '" + planDefinitionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			
			
			var arrPlanDefinitionAction = [];
			var query = "select action_id, label, title, description, text_equivalent, code, reason, timing_date_time, timing_period_start, timing_period_end, timing_duration, timing_range_low, timing_range_high, timing_timing, type, grouping_behavior, selection_behavior, required_behavior, precheck_behavior, cardinality_behavior, definition_activity_definition, definition_plan_definition, transform from BACIRO_FHIR.plan_definition_action " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var PlanDefinitionAction = {};
					PlanDefinitionAction.id = rez[i].action_id;
					PlanDefinitionAction.label = rez[i].label;
					PlanDefinitionAction.title = rez[i].title;
					PlanDefinitionAction.description = rez[i].description;
					PlanDefinitionAction.textEquivalent = rez[i].text_equivalent;
					PlanDefinitionAction.code = rez[i].code;
					PlanDefinitionAction.reason = rez[i].reason;
					if(rez[i].timing_date_time == null){
						PlanDefinitionAction.timing.timingDateTime = formatDate(rez[i].timing_date_time);
					}else{
						PlanDefinitionAction.timing.timingDateTime = rez[i].timing_date_time;
					}
					var timingPeriodStart, timingPeriodEnd;
					if(rez[i].timing_period_start == null){
						timingPeriodStart = formatDate(rez[i].timing_period_start);
					}else{
						timingPeriodStart = rez[i].timing_period_start;
					}
					if(rez[i].timing_period_end == null){
						timingPeriodEnd = formatDate(rez[i].timing_period_end);
					}else{
						timingPeriodEnd = rez[i].timing_period_end;
					}
					
					PlanDefinitionAction.timing.timingPeriod = timingPeriodStart + ' to ' + timingPeriodEnd;
					PlanDefinitionAction.timing.timingDuration = rez[i].timing_duration;
					PlanDefinitionAction.timing.timingRange = rez[i].timing_range_low + ' to ' + rez[i].timing_range_high;
					PlanDefinitionAction.timing.timingTiming = rez[i].timing_timing;
					PlanDefinitionAction.type = rez[i].type;
					PlanDefinitionAction.groupingBehavior = rez[i].grouping_behavior;
					PlanDefinitionAction.selectionBehavior = rez[i].selection_behavior;
					PlanDefinitionAction.requiredBehavior = rez[i].required_behavior;
					PlanDefinitionAction.precheckBehavior = rez[i].precheck_behavior;
					PlanDefinitionAction.cardinalityBehavior = rez[i].cardinality_behavior;
					var arrDefinition = [];
					var Definition = {};
					if(rez[i].definition_activity_definition != "null"){
						Definition.activityDefinition = hostFHIR + ':' + portFHIR + '/' + apikey + '/ActivityDefinition?_id=' +  rez[i].definition_activity_definition;
					} else {
						Definition.activityDefinition = "";
					}
					if(rez[i].definition_plan_definition != "null"){
						Definition.planDefinition = hostFHIR + ':' + portFHIR + '/' + apikey + '/PlanDefinition?_id=' +  rez[i].definition_plan_definition;
					} else {
						Definition.planDefinition = "";
					}
					arrDefinition[i] = Definition;
					planDefinitionAction.definition = arrDefinition;
					PlanDefinitionAction.transform = rez[i].transform;
					
					arrPlanDefinitionAction[i] = PlanDefinitionAction;
				}
				res.json({
					"err_code": 0,
					"data": arrPlanDefinitionAction
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getPlanDefinitionAction"
				});
			});
		},
		planDefinitionGoal: function getPlanDefinitionGoal(req, res) {
			var apikey = req.params.apikey;
			
			var planDefinitionGoalId = req.query._id;
			var planDefinitionId = req.query.plan_definition_id;

			//susun query
			var condition = "";

			if (typeof planDefinitionGoalId !== 'undefined' && planDefinitionGoalId !== "") {
				condition += "goal_id = '" + planDefinitionGoalId + "' AND ";
			}

			if (typeof planDefinitionId !== 'undefined' && planDefinitionId !== "") {
				condition += "plan_definition_id = '" + planDefinitionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrPlanDefinitionGoal = [];
			var query = "select goal_id, category, description, priority, startt, addresses from BACIRO_FHIR.plan_definition_goal " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var PlanDefinitionGoal = {};
					PlanDefinitionGoal.id = rez[i].goal_id;
					PlanDefinitionGoal.category = rez[i].category;
					PlanDefinitionGoal.description = rez[i].description;
					PlanDefinitionGoal.priority = rez[i].priority;
					PlanDefinitionGoal.start = rez[i].startt;
					PlanDefinitionGoal.addresses = rez[i].addresses;
					
					arrPlanDefinitionGoal[i] = PlanDefinitionGoal;
				}
				res.json({
					"err_code": 0,
					"data": arrPlanDefinitionGoal
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getPlanDefinitionGoal"
				});
			});
		},
		planDefinitionGoalTarget: function getPlanDefinitionGoalTarget(req, res) {
			var apikey = req.params.apikey;
			
			var planDefinitionGoalTargetId = req.query._id;
			var planDefinitionGoalId = req.query.goal_id;

			//susun query
			var condition = "";

			if (typeof planDefinitionGoalTargetId !== 'undefined' && planDefinitionGoalTargetId !== "") {
				condition += "target_id = '" + planDefinitionGoalTargetId + "' AND ";
			}

			if (typeof planDefinitionGoalId !== 'undefined' && planDefinitionGoalId !== "") {
				condition += "goal_id = '" + planDefinitionGoalId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrPlanDefinitionGoalTarget = [];
			var query = "select target_id, measure, detail_quantity, detail_range_low, detail_range_high, detail_codeable_concept, due from BACIRO_FHIR.plan_definition_goal_target " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var PlanDefinitionGoalTarget = {};
					PlanDefinitionGoalTarget.id = rez[i].target_id;
					PlanDefinitionGoalTarget.measure = rez[i].measure;
					PlanDefinitionGoalTarget.detail.detailQuantity = rez[i].detail_quantity;
					PlanDefinitionGoalTarget.detail.detailRange = rez[i].detail_range_low + ' to ' +  rez[i].detail_range_high;
					PlanDefinitionGoalTarget.detail.detailCodeableConcept = rez[i].detail_codeable_concept;
					PlanDefinitionGoalTarget.due = rez[i].due;
					
					arrPlanDefinitionGoalTarget[i] = PlanDefinitionGoalTarget;
				}
				res.json({
					"err_code": 0,
					"data": arrPlanDefinitionGoalTarget
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getPlanDefinitionGoalTarget"
				});
			});
		},
		planDefinitionActionCondition: function getPlanDefinitionActionCondition(req, res) {
			var apikey = req.params.apikey;
			
			var planDefinitionActionConditionId = req.query._id;
			var planDefinitionActionId = req.query.action_id;

			//susun query
			var condition = "";

			if (typeof planDefinitionActionConditionId !== 'undefined' && planDefinitionActionConditionId !== "") {
				condition += "condition_id = '" + planDefinitionActionConditionId + "' AND ";
			}

			if (typeof planDefinitionActionId !== 'undefined' && planDefinitionActionId !== "") {
				condition += "action_id = '" + planDefinitionActionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			

			var arrPlanDefinitionActionCondition = [];
			var query = "select condition_id, kind, description, language, expression from BACIRO_FHIR.action_condition " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var PlanDefinitionActionCondition = {};
					PlanDefinitionActionCondition.id = rez[i].condition_id;
					PlanDefinitionActionCondition.kind = rez[i].kind;
					PlanDefinitionActionCondition.description = rez[i].description;
					PlanDefinitionActionCondition.language = rez[i].language;
					PlanDefinitionActionCondition.expression = rez[i].expression;
					
					arrPlanDefinitionActionCondition[i] = PlanDefinitionActionCondition;
				}
				res.json({
					"err_code": 0,
					"data": arrPlanDefinitionActionCondition
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getPlanDefinitionActionCondition"
				});
			});
		},
		planDefinitionActionRelatedAction: function getPlanDefinitionActionRelatedAction(req, res) {
			var apikey = req.params.apikey;
			
			var planDefinitionActionRelatedActionId = req.query._id;
			var planDefinitionActionId = req.query.action_id;

			//susun query
			var condition = "";

			if (typeof planDefinitionActionRelatedActionId !== 'undefined' && planDefinitionActionRelatedActionId !== "") {
				condition += "related_action_id = '" + planDefinitionActionRelatedActionId + "' AND ";
			}

			if (typeof planDefinitionActionId !== 'undefined' && planDefinitionActionId !== "") {
				condition += "action_id = '" + planDefinitionActionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrPlanDefinitionActionRelatedAction = [];
			var query = "select related_action_id, actionid, relationship, offset_duration, offset_range_low, offset_range_high from BACIRO_FHIR.action_related_action " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var PlanDefinitionActionRelatedAction = {};
					PlanDefinitionActionRelatedAction.id = rez[i].related_action_id;
					PlanDefinitionActionRelatedAction.actionId = rez[i].actionid;
					PlanDefinitionActionRelatedAction.relationship = rez[i].relationship;
					PlanDefinitionActionRelatedAction.offset.offsetDuration = rez[i].offset_duration;
					PlanDefinitionActionRelatedAction.offset.offsetRange = rez[i].offset_range_low + ' to ' + rez[i].offset_range_high;
					
					arrPlanDefinitionActionRelatedAction[i] = PlanDefinitionActionRelatedAction;
				}
				res.json({
					"err_code": 0,
					"data": arrPlanDefinitionActionRelatedAction
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getPlanDefinitionActionRelatedAction"
				});
			});
		},
		planDefinitionActionParticipant: function getPlanDefinitionActionParticipant(req, res) {
			var apikey = req.params.apikey;
			
			var planDefinitionActionParticipantId = req.query._id;
			var planDefinitionActionId = req.query.action_id;
			
			//susun query
			var condition = "";

			if (typeof planDefinitionActionParticipantId !== 'undefined' && planDefinitionActionParticipantId !== "") {
				condition += "participant_id = '" + planDefinitionActionParticipantId + "' AND ";
			}

			if (typeof planDefinitionActionId !== 'undefined' && planDefinitionActionId !== "") {
				condition += "action_id = '" + planDefinitionActionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrPlanDefinitionActionParticipant = [];
			var query = "select participant_id, type, role from BACIRO_FHIR.action_participant " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var PlanDefinitionActionParticipant = {};
					PlanDefinitionActionParticipant.id = rez[i].participant_id;
					PlanDefinitionActionParticipant.type = rez[i].type;
					PlanDefinitionActionParticipant.role = rez[i].role;
					
					arrPlanDefinitionActionParticipant[i] = PlanDefinitionActionParticipant;
				}
				res.json({
					"err_code": 0,
					"data": arrPlanDefinitionActionParticipant
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getPlanDefinitionActionParticipant"
				});
			});
		},
		planDefinitionActionDynamicValue: function getPlanDefinitionActionDynamicValue(req, res) {
			var apikey = req.params.apikey;
			
			var planDefinitionActionDynamicValueId = req.query._id;
			var planDefinitionActionId = req.query.action_id;

			//susun query
			var condition = "";

			if (typeof planDefinitionActionDynamicValueId !== 'undefined' && planDefinitionActionDynamicValueId !== "") {
				condition += "dynamic_value_id = '" + planDefinitionActionDynamicValueId + "' AND ";
			}

				if (typeof planDefinitionActionId !== 'undefined' && planDefinitionActionId !== "") {
				condition += "action_id = '" + planDefinitionActionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrPlanDefinitionActionDynamicValue = [];
			var query = "select dynamic_value_id, description, path, language, expression from BACIRO_FHIR.action_dynamic_value " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var PlanDefinitionActionDynamicValue = {};
					PlanDefinitionActionDynamicValue.id = rez[i].dynamic_value_id;
					PlanDefinitionActionDynamicValue.description = rez[i].description;
					PlanDefinitionActionDynamicValue.path = rez[i].path;
					PlanDefinitionActionDynamicValue.language = rez[i].language;
					PlanDefinitionActionDynamicValue.expression = rez[i].expression;
					
					arrPlanDefinitionActionDynamicValue[i] = PlanDefinitionActionDynamicValue;
				}
				res.json({
					"err_code": 0,
					"data": arrPlanDefinitionActionDynamicValue
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getPlanDefinitionActionDynamicValue"
				});
			});
		},
  },
	post: {
		planDefinition: function addPlanDefinition(req, res) {
			console.log(req.body);
			var plan_definition_id  = req.body.plan_definition_id;
			var url  = req.body.url;
			var version  = req.body.version;
			var name  = req.body.name;
			var title  = req.body.title;
			var type  = req.body.type;
			var status  = req.body.status;
			var experimental  = req.body.experimental;
			var date  = req.body.date;
			var publisher  = req.body.publisher;
			var description  = req.body.description;
			var purpose  = req.body.purpose;
			var usage  = req.body.usage;
			var approval_date  = req.body.approval_date;
			var last_review_date  = req.body.last_review_date;
			var effective_period_start  = req.body.effective_period_start;
			var effective_period_end  = req.body.effective_period_end;
			var jurisdiction  = req.body.jurisdiction;
			var topic  = req.body.topic;
			var copyright  = req.body.copyright;
			var library  = req.body.library;
			var care_plan_id  = req.body.care_plan_id;
			var communication_id  = req.body.communication_id;
			var device_request_id  = req.body.device_request_id;
			var family_member_history_id  = req.body.family_member_history_id;
			var medication_administration_id  = req.body.medication_administration_id;
			var medication_request_id  = req.body.medication_request_id;
			var message_definition_id  = req.body.message_definition_id;
			var procedure_id  = req.body.procedure_id;
			var procedure_request_id  = req.body.procedure_request_id;
			var referral_request_id  = req.body.referral_request_id;
			var research_study_id  = req.body.research_study_id;

			var column = "";
      var values = "";
			
			if (typeof url !== 'undefined' && url !== "") {
        column += 'url,';
        values += "'" + url + "',";
      }
			
			if (typeof version !== 'undefined' && version !== "") {
        column += 'version,';
        values += "'" + version + "',";
      }	
			
			if (typeof name !== 'undefined' && name !== "") {
        column += 'name,';
        values += "'" + name + "',";
      }	
			
			if (typeof title !== 'undefined' && title !== "") {
        column += 'title,';
        values += "'" + title + "',";
      }
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }	
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }	
			
			if (typeof experimental !== 'undefined' && experimental !== "") {
        column += 'experimental,';
        values += "'" + experimental + "',";
      }	
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof publisher !== 'undefined' && publisher !== "") {
        column += 'publisher,';
        values += "'" + publisher + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof purpose !== 'undefined' && purpose !== "") {
        column += 'purpose,';
        values += "'" + purpose + "',";
      }		
			
			if (typeof usage !== 'undefined' && usage !== "") {
        column += 'usage,';
        values += "'" + usage + "',";
      }		
			
			if (typeof approval_date !== 'undefined' && approval_date !== "") {
        column += 'approval_date,';
				values += "to_date('"+ approval_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof last_review_date !== 'undefined' && last_review_date !== "") {
        column += 'last_review_date,';
				values += "to_date('"+ last_review_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_start !== 'undefined' && effective_period_start !== "") {
        column += 'effective_period_start,';
				values += "to_date('"+ effective_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_end !== 'undefined' && effective_period_end !== "") {
        column += 'effective_period_end,';
				values += "to_date('"+ effective_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof jurisdiction !== 'undefined' && jurisdiction !== "") {
        column += 'jurisdiction,';
        values += "'" + jurisdiction + "',";
      }		
			
			if (typeof topic !== 'undefined' && topic !== "") {
        column += 'topic,';
        values += "'" + topic + "',";
      }		
			
			if (typeof copyright !== 'undefined' && copyright !== "") {
        column += 'copyright,';
        values += "'" + copyright + "',";
      }		
			
			if (typeof library !== 'undefined' && library !== "") {
        column += 'library,';
        values += "'" + library + "',";
      }		
			
			if (typeof care_plan_id !== 'undefined' && care_plan_id !== "") {
        column += 'care_plan_id,';
        values += "'" + care_plan_id + "',";
      }		
			
			if (typeof communication_id !== 'undefined' && communication_id !== "") {
        column += 'communication_id,';
        values += "'" + communication_id + "',";
      }		
			
			if (typeof device_request_id !== 'undefined' && device_request_id !== "") {
        column += 'device_request_id,';
        values += "'" + device_request_id + "',";
      }		
			
			if (typeof family_member_history_id !== 'undefined' && family_member_history_id !== "") {
        column += 'family_member_history_id,';
        values += "'" + family_member_history_id + "',";
      }		
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }
			
			if (typeof message_definition_id !== 'undefined' && message_definition_id !== "") {
        column += 'message_definition_id,';
        values += "'" + message_definition_id + "',";
      }		
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }		
			
			if (typeof procedure_request_id !== 'undefined' && procedure_request_id !== "") {
        column += 'procedure_request_id,';
        values += "'" + procedure_request_id + "',";
      }
			
			if (typeof referral_request_id !== 'undefined' && referral_request_id !== "") {
        column += 'referral_request_id,';
        values += "'" + referral_request_id + "',";
      }		
			
			if (typeof research_study_id !== 'undefined' && research_study_id !== "") {
        column += 'research_study_id,';
        values += "'" + research_study_id + "',";
      }		
			
			var query = "UPSERT INTO BACIRO_FHIR.plan_definition(plan_definition_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+plan_definition_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select plan_definition_id from BACIRO_FHIR.plan_definition WHERE plan_definition_id = '" + plan_definition_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinition"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinition"});
      });
    },
		planDefinitionAction: function addPlanDefinitionAction(req, res) {
			console.log(req.body);
			var action_id  = req.body.action_id;
			var label  = req.body.label;
			var title  = req.body.title;
			var description  = req.body.description;
			var text_equivalent  = req.body.text_equivalent;
			var code  = req.body.code;
			var reason  = req.body.reason;
			var timing_date_time  = req.body.timing_date_time;
			var timing_period_start  = req.body.timing_period_start;
			var timing_period_end  = req.body.timing_period_end;
			var timing_duration  = req.body.timing_duration;
			var timing_range_low  = req.body.timing_range_low;
			var timing_range_high  = req.body.timing_range_high;
			var timing_timing  = req.body.timing_timing;
			var type  = req.body.type;
			var grouping_behavior  = req.body.grouping_behavior;
			var selection_behavior  = req.body.selection_behavior;
			var required_behavior  = req.body.required_behavior;
			var precheck_behavior  = req.body.precheck_behavior;
			var cardinality_behavior  = req.body.cardinality_behavior;
			var definition_activity_definition  = req.body.definition_activity_definition;
			var definition_plan_definition  = req.body.definition_plan_definition;
			var transform  = req.body.transform;
			var plan_definition_id  = req.body.plan_definition_id;
			var action  = req.body.action;
			
			var column = "";
      var values = "";
			
			if (typeof label !== 'undefined' && label !== "") {
        column += 'label,';
        values += "'" + label + "',";
      }
			
			if (typeof title !== 'undefined' && title !== "") {
        column += 'title,';
        values += "'" + title + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof text_equivalent !== 'undefined' && text_equivalent !== "") {
        column += 'text_equivalent,';
        values += "'" + text_equivalent + "',";
      }
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }
			
			if (typeof reason !== 'undefined' && reason !== "") {
        column += 'reason,';
        values += "'" + reason + "',";
      }	
			
			if (typeof timing_date_time !== 'undefined' && timing_date_time !== "") {
        column += 'timing_date_time,';
				values += "to_date('"+ timing_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof timing_period_start !== 'undefined' && timing_period_start !== "") {
        column += 'timing_period_start,';
				values += "to_date('"+ timing_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof timing_period_end !== 'undefined' && timing_period_end !== "") {
        column += 'timing_period_end,';
				values += "to_date('"+ timing_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof timing_duration !== 'undefined' && timing_duration !== "") {
        column += 'timing_duration,';
        values += "'" + timing_duration + "',";
      }	
			
			if (typeof timing_range_low !== 'undefined' && timing_range_low !== "") {
        column += 'timing_range_low,';
        values += " " + timing_range_low + ",";
      }
			
			if (typeof timing_range_high !== 'undefined' && timing_range_high !== "") {
        column += 'timing_range_high,';
        values += " " + timing_range_high + ",";
      }
			
			if (typeof timing_timing !== 'undefined' && timing_timing !== "") {
        column += 'timing_timing,';
        values += "'" + timing_timing + "',";
      }
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof grouping_behavior !== 'undefined' && grouping_behavior !== "") {
        column += 'grouping_behavior,';
        values += "'" + grouping_behavior + "',";
      }	
			
			if (typeof selection_behavior !== 'undefined' && selection_behavior !== "") {
        column += 'selection_behavior,';
        values += "'" + selection_behavior + "',";
      }
			
			if (typeof required_behavior !== 'undefined' && required_behavior !== "") {
        column += 'required_behavior,';
        values += "'" + required_behavior + "',";
      }
			
			if (typeof precheck_behavior !== 'undefined' && precheck_behavior !== "") {
        column += 'precheck_behavior,';
        values += "'" + precheck_behavior + "',";
      }	
			
			if (typeof cardinality_behavior !== 'undefined' && cardinality_behavior !== "") {
        column += 'cardinality_behavior,';
        values += "'" + cardinality_behavior + "',";
      }	
			
			if (typeof definition_activity_definition !== 'undefined' && definition_activity_definition !== "") {
        column += 'definition_activity_definition,';
        values += "'" + definition_activity_definition + "',";
      }
			
			if (typeof definition_plan_definition !== 'undefined' && definition_plan_definition !== "") {
        column += 'definition_plan_definition,';
        values += "'" + definition_plan_definition + "',";
      }
			
			if (typeof transform !== 'undefined' && transform !== "") {
        column += 'transform,';
        values += "'" + transform + "',";
      }	
			
			if (typeof plan_definition_id !== 'undefined' && plan_definition_id !== "") {
        column += 'plan_definition_id,';
        values += "'" + plan_definition_id + "',";
      }
			
			if (typeof action !== 'undefined' && action !== "") {
        column += 'action,';
        values += "'" + action + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.plan_definition_action(action_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+action_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select action_id from BACIRO_FHIR.plan_definition_action WHERE action_id = '" + action_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinitionAction"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinitionAction"});
      });
    },
		planDefinitionGoal: function addPlanDefinitionGoal(req, res) {
			console.log(req.body);
			var goal_id  = req.body.goal_id;
			var category  = req.body.category;
			var description  = req.body.description;
			var priority  = req.body.priority;
			var startt  = req.body.start;
			var addresses  = req.body.addresses;
			var plan_definition_id  = req.body.plan_definition_id;
			var action_id  = req.body.action_id;
			
			var column = "";
      var values = "";
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += " '" + description + "',";
      }
			
			if (typeof priority !== 'undefined' && priority !== "") {
        column += 'priority,';
        values += "'" + priority + "',";
      }	
			
			if (typeof startt !== 'undefined' && startt !== "") {
        column += 'startt,';
        values += "'" + startt + "',";
      }
			
			if (typeof addresses !== 'undefined' && addresses !== "") {
        column += 'addresses,';
        values += " '" + addresses + "',";
      }
			
			if (typeof plan_definition_id !== 'undefined' && plan_definition_id !== "") {
        column += 'plan_definition_id,';
        values += "'" + plan_definition_id + "',";
      }	
			
			if (typeof action_id !== 'undefined' && action_id !== "") {
        column += 'action_id,';
        values += "'" + action_id + "',";
      }	
			
      var query = "UPSERT INTO BACIRO_FHIR.plan_definition_goal(goal_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+goal_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select goal_id from BACIRO_FHIR.plan_definition_goal WHERE goal_id = '" + goal_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinitionGoal"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinitionGoal"});
      });
    },
		planDefinitionGoalTarget: function addPlanDefinitionGoalTarget(req, res) {
			console.log(req.body);
			var target_id = req.body.target_id;
			var measure = req.body.measure;
			var detail_quantity = req.body.detail_quantity;
			var detail_range_low = req.body.detail_range_low;
			var detail_range_high = req.body.detail_range_high;
			var detail_codeable_concept = req.body.detail_codeable_concept;
			var due = req.body.due;
			var goal_id = req.body.goal_id;
			
			var column = "";
      var values = "";
			
			if (typeof measure !== 'undefined' && measure !== "") {
        column += 'measure,';
        values += "'" + measure + "',";
      }
			
			if (typeof detail_quantity !== 'undefined' && detail_quantity !== "") {
        column += 'detail_quantity,';
        values += " " + detail_quantity + ",";
      }
			
			if (typeof detail_range_low !== 'undefined' && detail_range_low !== "") {
        column += 'detail_range_low,';
        values += " " + detail_range_low + ",";
      }
			
			if (typeof detail_range_high !== 'undefined' && detail_range_high !== "") {
        column += 'detail_range_high,';
        values += " " + detail_range_high + ",";
      }
			
			if (typeof detail_codeable_concept !== 'undefined' && detail_codeable_concept !== "") {
        column += 'detail_codeable_concept,';
        values += "'" + detail_codeable_concept + "',";
      }	
			
			if (typeof due !== 'undefined' && due !== "") {
        column += 'due,';
        values += "'" + due + "',";
      }	
			
			if (typeof goal_id !== 'undefined' && goal_id !== "") {
        column += 'goal_id,';
        values += "'" + goal_id + "',";
      }	
			
      var query = "UPSERT INTO BACIRO_FHIR.plan_definition_goal_target(target_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+target_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select target_id from BACIRO_FHIR.plan_definition_goal_target WHERE target_id = '" + target_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinitionGoalTarget"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinitionGoalTarget"});
      });
    },
		planDefinitionActionCondition: function addPlanDefinitionActionCondition(req, res) {
			console.log(req.body);
			var condition_id  = req.body.condition_id;
			var kind  = req.body.kind;
			var description  = req.body.description;
			var language  = req.body.language;
			var expression  = req.body.expression;
			var action_id   = req.body.action_id;
			
			
			var column = "";
      var values = "";
			
			if (typeof kind !== 'undefined' && kind !== "") {
        column += 'kind,';
        values += "'" + kind + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof language !== 'undefined' && language !== "") {
        column += 'language,';
        values += "'" + language + "',";
      }
			
			if (typeof expression !== 'undefined' && expression !== "") {
        column += 'expression,';
        values += "'" + expression + "',";
      }	
			
			if (typeof action_id !== 'undefined' && action_id !== "") {
        column += 'action_id,';
        values += "'" + action_id + "',";
      }	
			
      var query = "UPSERT INTO BACIRO_FHIR.action_condition(condition_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+condition_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select condition_id from BACIRO_FHIR.action_condition WHERE condition_id = '" + condition_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinitionActionCondition"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinitionActionCondition"});
      });
    },
		planDefinitionActionRelatedAction: function addPlanDefinitionActionRelatedAction(req, res) {
			console.log(req.body);
			var related_action_id  = req.body.related_action_id;
			var actionid  = req.body.actionId;
			var relationship  = req.body.relationship;
			var offset_duration  = req.body.offset_duration;
			var offset_range_low  = req.body.offset_range_low;
			var offset_range_high  = req.body.offset_range_high;
			var action_id  = req.body.action_id;
			
			var column = "";
      var values = "";
			
			if (typeof actionid !== 'undefined' && actionid !== "") {
        column += 'actionid,';
        values += "'" + actionid + "',";
      }
			
			if (typeof relationship !== 'undefined' && relationship !== "") {
        column += 'relationship,';
        values += "'" + relationship + "',";
      }
			
			if (typeof offset_duration !== 'undefined' && offset_duration !== "") {
        column += 'offset_duration,';
        values += "'" + offset_duration + "',";
      }
			
			if (typeof offset_range_low !== 'undefined' && offset_range_low !== "") {
        column += 'offset_range_low,';
        values += " " + offset_range_low + ",";
      }
			
			if (typeof offset_range_high !== 'undefined' && offset_range_high !== "") {
        column += 'offset_range_high,';
        values += " " + offset_range_high + ",";
      }
			
			if (typeof action_id !== 'undefined' && action_id !== "") {
        column += 'action_id,';
        values += "'" + action_id + "',";
      }	
			
      var query = "UPSERT INTO BACIRO_FHIR.action_related_action(related_action_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+related_action_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select related_action_id from BACIRO_FHIR.action_related_action WHERE related_action_id = '" + related_action_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinitionActionRelatedAction"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinitionActionRelatedAction"});
      });
    },
		planDefinitionActionParticipant: function addPlanDefinitionActionParticipant(req, res) {
			console.log(req.body);
			var participant_id  = req.body.participant_id;
			var type  = req.body.type;
			var role  = req.body.role;
			var action_id  = req.body.action_id;
			
			
			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof role !== 'undefined' && role !== "") {
        column += 'role,';
        values += "'" + role + "',";
      }
			
			if (typeof action_id !== 'undefined' && action_id !== "") {
        column += 'action_id,';
        values += "'" + action_id + "',";
      }	
			
      var query = "UPSERT INTO BACIRO_FHIR.action_participant(participant_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+participant_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select participant_id from BACIRO_FHIR.action_participant WHERE participant_id = '" + participant_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinitionActionParticipant"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinitionActionParticipant"});
      });
    },
		planDefinitionActionDynamicValue: function addPlanDefinitionActionDynamicValue(req, res) {
			console.log(req.body);
			var dynamic_value_id  = req.body.dynamic_value_id;
			var description  = req.body.description;
			var path  = req.body.path;
			var language  = req.body.language;
			var expression  = req.body.expression;
			var action_id  = req.body.action_id;
			
			var column = "";
      var values = "";
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }
			
			if (typeof path !== 'undefined' && path !== "") {
        column += 'path,';
        values += "'" + path + "',";
      }
			
			if (typeof language !== 'undefined' && language !== "") {
        column += 'language,';
        values += "'" + language + "',";
      }
			
			if (typeof expression !== 'undefined' && expression !== "") {
        column += 'expression,';
        values += "'" + expression + "',";
      }
			
			if (typeof action_id !== 'undefined' && action_id !== "") {
        column += 'action_id,';
        values += "'" + action_id + "',";
      }	
			
      var query = "UPSERT INTO BACIRO_FHIR.action_dynamic_value(dynamic_value_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+dynamic_value_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select dynamic_value_id from BACIRO_FHIR.action_dynamic_value WHERE dynamic_value_id = '" + dynamic_value_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinitionActionDynamicValue"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPlanDefinitionActionDynamicValue"});
      });
    },
	},
	put: {
		planDefinition: function updatePlanDefinition(req, res) {
			console.log(req.body);
			var plan_definition_id  = req.params.plan_definition_id;
			var url  = req.body.url;
			var version  = req.body.version;
			var name  = req.body.name;
			var title  = req.body.title;
			var type  = req.body.type;
			var status  = req.body.status;
			var experimental  = req.body.experimental;
			var date  = req.body.date;
			var publisher  = req.body.publisher;
			var description  = req.body.description;
			var purpose  = req.body.purpose;
			var usage  = req.body.usage;
			var approval_date  = req.body.approval_date;
			var last_review_date  = req.body.last_review_date;
			var effective_period_start  = req.body.effective_period_start;
			var effective_period_end  = req.body.effective_period_end;
			var jurisdiction  = req.body.jurisdiction;
			var topic  = req.body.topic;
			var copyright  = req.body.copyright;
			var library  = req.body.library;
			var care_plan_id  = req.body.care_plan_id;
			var communication_id  = req.body.communication_id;
			var device_request_id  = req.body.device_request_id;
			var family_member_history_id  = req.body.family_member_history_id;
			var medication_administration_id  = req.body.medication_administration_id;
			var medication_request_id  = req.body.medication_request_id;
			var message_definition_id  = req.body.message_definition_id;
			var procedure_id  = req.body.procedure_id;
			var procedure_request_id  = req.body.procedure_request_id;
			var referral_request_id  = req.body.referral_request_id;
			var research_study_id  = req.body.research_study_id;

			var column = "";
      var values = "";
			
			if (typeof url !== 'undefined' && url !== "") {
        column += 'url,';
        values += "'" + url + "',";
      }
			
			if (typeof version !== 'undefined' && version !== "") {
        column += 'version,';
        values += "'" + version + "',";
      }	
			
			if (typeof name !== 'undefined' && name !== "") {
        column += 'name,';
        values += "'" + name + "',";
      }	
			
			if (typeof title !== 'undefined' && title !== "") {
        column += 'title,';
        values += "'" + title + "',";
      }
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }	
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }	
			
			if (typeof experimental !== 'undefined' && experimental !== "") {
        column += 'experimental,';
        values += "'" + experimental + "',";
      }	
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof publisher !== 'undefined' && publisher !== "") {
        column += 'publisher,';
        values += "'" + publisher + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof purpose !== 'undefined' && purpose !== "") {
        column += 'purpose,';
        values += "'" + purpose + "',";
      }		
			
			if (typeof usage !== 'undefined' && usage !== "") {
        column += 'usage,';
        values += "'" + usage + "',";
      }		
			
			if (typeof approval_date !== 'undefined' && approval_date !== "") {
        column += 'approval_date,';
				values += "to_date('"+ approval_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof last_review_date !== 'undefined' && last_review_date !== "") {
        column += 'last_review_date,';
				values += "to_date('"+ last_review_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_start !== 'undefined' && effective_period_start !== "") {
        column += 'effective_period_start,';
				values += "to_date('"+ effective_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_end !== 'undefined' && effective_period_end !== "") {
        column += 'effective_period_end,';
				values += "to_date('"+ effective_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof jurisdiction !== 'undefined' && jurisdiction !== "") {
        column += 'jurisdiction,';
        values += "'" + jurisdiction + "',";
      }		
			
			if (typeof topic !== 'undefined' && topic !== "") {
        column += 'topic,';
        values += "'" + topic + "',";
      }		
			
			if (typeof copyright !== 'undefined' && copyright !== "") {
        column += 'copyright,';
        values += "'" + copyright + "',";
      }		
			
			if (typeof library !== 'undefined' && library !== "") {
        column += 'library,';
        values += "'" + library + "',";
      }		
			
			if (typeof care_plan_id !== 'undefined' && care_plan_id !== "") {
        column += 'care_plan_id,';
        values += "'" + care_plan_id + "',";
      }		
			
			if (typeof communication_id !== 'undefined' && communication_id !== "") {
        column += 'communication_id,';
        values += "'" + communication_id + "',";
      }		
			
			if (typeof device_request_id !== 'undefined' && device_request_id !== "") {
        column += 'device_request_id,';
        values += "'" + device_request_id + "',";
      }		
			
			if (typeof family_member_history_id !== 'undefined' && family_member_history_id !== "") {
        column += 'family_member_history_id,';
        values += "'" + family_member_history_id + "',";
      }		
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }
			
			if (typeof message_definition_id !== 'undefined' && message_definition_id !== "") {
        column += 'message_definition_id,';
        values += "'" + message_definition_id + "',";
      }		
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }		
			
			if (typeof procedure_request_id !== 'undefined' && procedure_request_id !== "") {
        column += 'procedure_request_id,';
        values += "'" + procedure_request_id + "',";
      }
			
			if (typeof referral_request_id !== 'undefined' && referral_request_id !== "") {
        column += 'referral_request_id,';
        values += "'" + referral_request_id + "',";
      }		
			
			if (typeof research_study_id !== 'undefined' && research_study_id !== "") {
        column += 'research_study_id,';
        values += "'" + research_study_id + "',";
      }		
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "plan_definition_id = '" + plan_definition_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.plan_definition(plan_definition_id," + column.slice(0, -1) + ") SELECT plan_definition_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.plan_definition WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select plan_definition_id from BACIRO_FHIR.plan_definition WHERE plan_definition_id = '" + plan_definition_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinition"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinition"});
      });
    },
		planDefinitionAction: function updatePlanDefinitionAction(req, res) {
			console.log(req.body);
			var action_id  = req.params.action_id;
			var label  = req.body.label;
			var title  = req.body.title;
			var description  = req.body.description;
			var text_equivalent  = req.body.text_equivalent;
			var code  = req.body.code;
			var reason  = req.body.reason;
			var timing_date_time  = req.body.timing_date_time;
			var timing_period_start  = req.body.timing_period_start;
			var timing_period_end  = req.body.timing_period_end;
			var timing_duration  = req.body.timing_duration;
			var timing_range_low  = req.body.timing_range_low;
			var timing_range_high  = req.body.timing_range_high;
			var timing_timing  = req.body.timing_timing;
			var type  = req.body.type;
			var grouping_behavior  = req.body.grouping_behavior;
			var selection_behavior  = req.body.selection_behavior;
			var required_behavior  = req.body.required_behavior;
			var precheck_behavior  = req.body.precheck_behavior;
			var cardinality_behavior  = req.body.cardinality_behavior;
			var definition_activity_definition  = req.body.definition_activity_definition;
			var definition_plan_definition  = req.body.definition_plan_definition;
			var transform  = req.body.transform;
			var plan_definition_id  = req.body.plan_definition_id;
			var action  = req.body.action;
			
			var column = "";
      var values = "";
			
			if (typeof label !== 'undefined' && label !== "") {
        column += 'label,';
        values += "'" + label + "',";
      }
			
			if (typeof title !== 'undefined' && title !== "") {
        column += 'title,';
        values += "'" + title + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof text_equivalent !== 'undefined' && text_equivalent !== "") {
        column += 'text_equivalent,';
        values += "'" + text_equivalent + "',";
      }
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }
			
			if (typeof reason !== 'undefined' && reason !== "") {
        column += 'reason,';
        values += "'" + reason + "',";
      }	
			
			if (typeof timing_date_time !== 'undefined' && timing_date_time !== "") {
        column += 'timing_date_time,';
				values += "to_date('"+ timing_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof timing_period_start !== 'undefined' && timing_period_start !== "") {
        column += 'timing_period_start,';
				values += "to_date('"+ timing_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof timing_period_end !== 'undefined' && timing_period_end !== "") {
        column += 'timing_period_end,';
				values += "to_date('"+ timing_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof timing_duration !== 'undefined' && timing_duration !== "") {
        column += 'timing_duration,';
        values += "'" + timing_duration + "',";
      }	
			
			if (typeof timing_range_low !== 'undefined' && timing_range_low !== "") {
        column += 'timing_range_low,';
        values += " " + timing_range_low + ",";
      }
			
			if (typeof timing_range_high !== 'undefined' && timing_range_high !== "") {
        column += 'timing_range_high,';
        values += " " + timing_range_high + ",";
      }
			
			if (typeof timing_timing !== 'undefined' && timing_timing !== "") {
        column += 'timing_timing,';
        values += "'" + timing_timing + "',";
      }
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof grouping_behavior !== 'undefined' && grouping_behavior !== "") {
        column += 'grouping_behavior,';
        values += "'" + grouping_behavior + "',";
      }	
			
			if (typeof selection_behavior !== 'undefined' && selection_behavior !== "") {
        column += 'selection_behavior,';
        values += "'" + selection_behavior + "',";
      }
			
			if (typeof required_behavior !== 'undefined' && required_behavior !== "") {
        column += 'required_behavior,';
        values += "'" + required_behavior + "',";
      }
			
			if (typeof precheck_behavior !== 'undefined' && precheck_behavior !== "") {
        column += 'precheck_behavior,';
        values += "'" + precheck_behavior + "',";
      }	
			
			if (typeof cardinality_behavior !== 'undefined' && cardinality_behavior !== "") {
        column += 'cardinality_behavior,';
        values += "'" + cardinality_behavior + "',";
      }	
			
			if (typeof definition_activity_definition !== 'undefined' && definition_activity_definition !== "") {
        column += 'definition_activity_definition,';
        values += "'" + definition_activity_definition + "',";
      }
			
			if (typeof definition_plan_definition !== 'undefined' && definition_plan_definition !== "") {
        column += 'definition_plan_definition,';
        values += "'" + definition_plan_definition + "',";
      }
			
			if (typeof transform !== 'undefined' && transform !== "") {
        column += 'transform,';
        values += "'" + transform + "',";
      }	
			
			if (typeof plan_definition_id !== 'undefined' && plan_definition_id !== "") {
        column += 'plan_definition_id,';
        values += "'" + plan_definition_id + "',";
      }
			
			if (typeof action !== 'undefined' && action !== "") {
        column += 'action,';
        values += "'" + action + "',";
      }	
      
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "action_id = '" + action_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.plan_definition_action(action_id," + column.slice(0, -1) + ") SELECT action_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.plan_definition_action WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select action_id from BACIRO_FHIR.plan_definition_action WHERE action_id = '" + action_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinitionAction"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinitionAction"});
      });
    },
		planDefinitionGoal: function updatePlanDefinitionGoal(req, res) {
			console.log(req.body);
			var goal_id  = req.params.goal_id;
			var category  = req.body.category;
			var description  = req.body.description;
			var priority  = req.body.priority;
			var startt  = req.body.start;
			var addresses  = req.body.addresses;
			var plan_definition_id  = req.body.plan_definition_id;
			var action_id  = req.body.action_id;
			
			var column = "";
      var values = "";
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += " '" + description + "',";
      }
			
			if (typeof priority !== 'undefined' && priority !== "") {
        column += 'priority,';
        values += "'" + priority + "',";
      }	
			
			if (typeof startt !== 'undefined' && startt !== "") {
        column += 'startt,';
        values += "'" + startt + "',";
      }
			
			if (typeof addresses !== 'undefined' && addresses !== "") {
        column += 'addresses,';
        values += " '" + addresses + "',";
      }
			
			if (typeof plan_definition_id !== 'undefined' && plan_definition_id !== "") {
        column += 'plan_definition_id,';
        values += "'" + plan_definition_id + "',";
      }	
			
			if (typeof action_id !== 'undefined' && action_id !== "") {
        column += 'action_id,';
        values += "'" + action_id + "',";
      }			
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "goal_id = '" + goal_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.plan_definition_goal(goal_id," + column.slice(0, -1) + ") SELECT goal_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.plan_definition_goal WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select goal_id from BACIRO_FHIR.plan_definition_goal WHERE goal_id = '" + goal_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinitionGoal"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinitionGoal"});
      });
    },
		planDefinitionGoalTarget: function updatePlanDefinitionGoalTarget(req, res) {
			console.log(req.body);
			var target_id = req.params.target_id;
			var measure = req.body.measure;
			var detail_quantity = req.body.detail_quantity;
			var detail_range_low = req.body.detail_range_low;
			var detail_range_high = req.body.detail_range_high;
			var detail_codeable_concept = req.body.detail_codeable_concept;
			var due = req.body.due;
			var goal_id = req.body.goal_id;
			
			var column = "";
      var values = "";
			
			if (typeof measure !== 'undefined' && measure !== "") {
        column += 'measure,';
        values += "'" + measure + "',";
      }
			
			if (typeof detail_quantity !== 'undefined' && detail_quantity !== "") {
        column += 'detail_quantity,';
        values += " " + detail_quantity + ",";
      }
			
			if (typeof detail_range_low !== 'undefined' && detail_range_low !== "") {
        column += 'detail_range_low,';
        values += " " + detail_range_low + ",";
      }
			
			if (typeof detail_range_high !== 'undefined' && detail_range_high !== "") {
        column += 'detail_range_high,';
        values += " " + detail_range_high + ",";
      }
			
			if (typeof detail_codeable_concept !== 'undefined' && detail_codeable_concept !== "") {
        column += 'detail_codeable_concept,';
        values += "'" + detail_codeable_concept + "',";
      }	
			
			if (typeof due !== 'undefined' && due !== "") {
        column += 'due,';
        values += "'" + due + "',";
      }	
			
			if (typeof goal_id !== 'undefined' && goal_id !== "") {
        column += 'goal_id,';
        values += "'" + goal_id + "',";
      }	
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "target_id = '" + target_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.plan_definition_goal_target(target_id," + column.slice(0, -1) + ") SELECT target_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.plan_definition_goal_target WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select target_id from BACIRO_FHIR.plan_definition_goal_target WHERE target_id = '" + target_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinitionGoalTarget"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinitionGoalTarget"});
      });
    },
		planDefinitionActionCondition: function updatePlanDefinitionActionCondition(req, res) {
			console.log(req.body);
			var condition_id  = req.params.condition_id;
			var kind  = req.body.kind;
			var description  = req.body.description;
			var language  = req.body.language;
			var expression  = req.body.expression;
			var action_id   = req.body.action_id;
			
			
			var column = "";
      var values = "";
			
			if (typeof kind !== 'undefined' && kind !== "") {
        column += 'kind,';
        values += "'" + kind + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof language !== 'undefined' && language !== "") {
        column += 'language,';
        values += "'" + language + "',";
      }
			
			if (typeof expression !== 'undefined' && expression !== "") {
        column += 'expression,';
        values += "'" + expression + "',";
      }	
			
			if (typeof action_id !== 'undefined' && action_id !== "") {
        column += 'action_id,';
        values += "'" + action_id + "',";
      }	
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "condition_id = '" + condition_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.action_condition(condition_id," + column.slice(0, -1) + ") SELECT condition_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.action_condition WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select condition_id from BACIRO_FHIR.action_condition WHERE condition_id = '" + condition_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinitionActionCondition"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinitionActionCondition"});
      });
    },
		planDefinitionActionRelatedAction: function updatePlanDefinitionActionRelatedAction(req, res) {
			console.log(req.body);
			var related_action_id  = req.params.related_action_id;
			var actionid  = req.body.actionId;
			var relationship  = req.body.relationship;
			var offset_duration  = req.body.offset_duration;
			var offset_range_low  = req.body.offset_range_low;
			var offset_range_high  = req.body.offset_range_high;
			var action_id  = req.body.action_id;
			
			var column = "";
      var values = "";
			
			if (typeof actionid !== 'undefined' && actionid !== "") {
        column += 'actionid,';
        values += "'" + actionid + "',";
      }
			
			if (typeof relationship !== 'undefined' && relationship !== "") {
        column += 'relationship,';
        values += "'" + relationship + "',";
      }
			
			if (typeof offset_duration !== 'undefined' && offset_duration !== "") {
        column += 'offset_duration,';
        values += "'" + offset_duration + "',";
      }
			
			if (typeof offset_range_low !== 'undefined' && offset_range_low !== "") {
        column += 'offset_range_low,';
        values += " " + offset_range_low + ",";
      }
			
			if (typeof offset_range_high !== 'undefined' && offset_range_high !== "") {
        column += 'offset_range_high,';
        values += " " + offset_range_high + ",";
      }
			
			if (typeof action_id !== 'undefined' && action_id !== "") {
        column += 'action_id,';
        values += "'" + action_id + "',";
      }	
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "related_action_id = '" + related_action_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.action_related_action(related_action_id," + column.slice(0, -1) + ") SELECT related_action_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.action_related_action WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select related_action_id from BACIRO_FHIR.action_related_action WHERE related_action_id = '" + related_action_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinitionActionRelatedAction"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinitionActionRelatedAction"});
      });
    },
		planDefinitionActionParticipant: function updatePlanDefinitionActionParticipant(req, res) {
			console.log(req.body);
			var participant_id  = req.params.participant_id;
			var type  = req.body.type;
			var role  = req.body.role;
			var action_id  = req.body.action_id;
			
			
			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof role !== 'undefined' && role !== "") {
        column += 'role,';
        values += "'" + role + "',";
      }
			
			if (typeof action_id !== 'undefined' && action_id !== "") {
        column += 'action_id,';
        values += "'" + action_id + "',";
      }	
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "participant_id = '" + participant_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.action_participant(participant_id," + column.slice(0, -1) + ") SELECT participant_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.action_participant WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select participant_id from BACIRO_FHIR.action_participant WHERE participant_id = '" + participant_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinitionActionParticipant"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinitionActionParticipant"});
      });
    },
		planDefinitionActionDynamicValue: function updatePlanDefinitionActionDynamicValue(req, res) {
			console.log(req.body);
			var dynamic_value_id  = req.params.dynamic_value_id;
			var description  = req.body.description;
			var path  = req.body.path;
			var language  = req.body.language;
			var expression  = req.body.expression;
			var action_id  = req.body.action_id;
			
			var column = "";
      var values = "";
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }
			
			if (typeof path !== 'undefined' && path !== "") {
        column += 'path,';
        values += "'" + path + "',";
      }
			
			if (typeof language !== 'undefined' && language !== "") {
        column += 'language,';
        values += "'" + language + "',";
      }
			
			if (typeof expression !== 'undefined' && expression !== "") {
        column += 'expression,';
        values += "'" + expression + "',";
      }
			
			if (typeof action_id !== 'undefined' && action_id !== "") {
        column += 'action_id,';
        values += "'" + action_id + "',";
      }	
				
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "dynamic_value_id = '" + dynamic_value_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.action_dynamic_value(dynamic_value_id," + column.slice(0, -1) + ") SELECT dynamic_value_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.action_dynamic_value WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select dynamic_value_id from BACIRO_FHIR.action_dynamic_value WHERE dynamic_value_id = '" + dynamic_value_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinitionActionDynamicValue"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updatePlanDefinitionActionDynamicValue"});
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