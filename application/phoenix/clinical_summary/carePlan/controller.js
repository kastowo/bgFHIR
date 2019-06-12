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
		carePlan: function getCarePlan(req, res){
			var apikey = req.params.apikey;
			
			var carePlanId = req.query._id;
			var activity_code = req.query.activity_code;
			var activity_date = req.query.activity_date;
			var activity_reference = req.query.activity_reference;
			var based_on = req.query.based_on;
			var care_team = req.query.care_team;
			var category = req.query.category;
			var condition = req.query.condition;
			var context = req.query.context;
			var date = req.query.date;
			var definition = req.query.definition;
			var encounter = req.query.encounter;
			var goal = req.query.goal;
			var identifier = req.query.identifier;
			var intent = req.query.intent;
			var part_of = req.query.part_of;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var replaces = req.query.replaces;
			var status = req.query.status;
			var subject = req.query.subject;
			
      //susun query
      var condition = "";
      var join = "";
			
			if(typeof carePlanId !== 'undefined' && carePlanId !== ""){
        condition += "cp.CAREPLAN_ID = '" + carePlanId + "' AND,";  
      }
			
			if((typeof activity_code !== 'undefined' && activity_code !== "") || (typeof activity_date !== 'undefined' && activity_date !== "") || (typeof activity_reference !== 'undefined' && activity_reference !== "") || (typeof performer !== 'undefined' && performer !== "")){
        join += " LEFT JOIN BACIRO_FHIR.CAREPLAN_ACTIVITY ca on cp.CAREPLAN_ID = ca.CAREPLAN_ID left join BACIRO_FHIR.CAREPLAN_ACTIVITY_DETAIL cd on ca.CARE_PLAN_ACTIVITY_ID = cd.ACTIVITY_ID ";
        
        if(typeof activity_code !== 'undefined' && activity_code !== ""){
          condition += "cd.code = '" + activity_code + "' AND ";       
        }
				
				if (typeof activity_date !== 'undefined' && activity_date !== "") {
					column += 'SCHEDULED_TIMING,';
					values += "to_date('"+ activity_date + "', 'yyyy-MM-dd'),";
				}
				
				if(typeof activity_reference !== 'undefined' && activity_reference !== ""){
					condition += "(ca.REFERENCE_APPOINTMENT = '" + activity_reference + "' OR ca.REFERENCE_COMMUNICATION_REQUEST = '" + activity_reference + "' OR ca.REFERENCE_DEVICE_REQUEST = '" + activity_reference + "' OR ca.REFERENCE_MEDICATION_REQUEST = '" + activity_reference + "' OR ca.REFERENCE_NUTRITION_ORDER = '" + activity_reference + "' OR ca.REFERENCE_TASK = '" + activity_reference + "' OR ca.REFERENCE_PROCEDURE_REQUEST = '" + activity_reference + "' OR ca.REFERENCE_REFERRAL_REQUEST = '" + activity_reference + "' OR ca.REFERENCE_VISION_PRESCRIPTION = '" + activity_reference + "' OR ca.REFERENCE_REQUEST_GROUP = '" + activity_reference + "') AND,";  
				}
				
				//kurang performer
				/*if(typeof performer !== 'undefined' && performer !== ""){
					condition += "(ca.REFERENCE_APPOINTMENT = '" + activity_reference + "' OR ca.REFERENCE_COMMUNICATION_REQUEST = '" + activity_reference + "' OR ca.REFERENCE_DEVICE_REQUEST = '" + activity_reference + "' OR ca.REFERENCE_MEDICATION_REQUEST = '" + activity_reference + "' OR ca.REFERENCE_NUTRITION_ORDER = '" + activity_reference + "' OR ca.REFERENCE_TASK = '" + activity_reference + "' OR ca.REFERENCE_PROCEDURE_REQUEST = '" + activity_reference + "' OR ca.REFERENCE_REFERRAL_REQUEST = '" + activity_reference + "' OR ca.REFERENCE_VISION_PRESCRIPTION = '" + activity_reference + "' OR ca.REFERENCE_REQUEST_GROUP = '" + activity_reference + "') AND,";
				}*/
				
				
      }
			
			if(typeof based_on !== 'undefined' && based_on !== ""){
        condition += "cp.BASED_ON = '" + based_on + "' AND,";  
      }
			
			if(typeof care_team !== 'undefined' && care_team !== ""){
				join += " LEFT JOIN BACIRO_FHIR.CARE_TEAM ct on cp.CAREPLAN_ID = ct.CAREPLAN_ID ";
        condition += "ct.CARE_TEAM_ID = '" + care_team + "' AND,";  
      }
			
			if(typeof category !== 'undefined' && category !== ""){
        condition += "cp.category = '" + category + "' AND,";  
      }
			
			if(typeof condition !== 'undefined' && condition !== ""){
				join += " LEFT JOIN BACIRO_FHIR.CONDITION co on cp.CAREPLAN_ID = co.CAREPLAN_ID ";
        condition += "co.CONDITION_ID = '" + condition + "' AND,";  
      }
			
			if(typeof context !== 'undefined' && context !== ""){
				condition += "(cp.CONTEXT_ENCOUNTER = '" + context + "' OR cp.CONTEXT_EPISODE_OF_CARE = '" + context + "') AND,";  
			}
			
			if (typeof date !== 'undefined' && date !== "") {
        condition += "cp.PERIOD_START <= to_date('" + date + "', 'yyyy-MM-dd') AND cp.PERIOD_END >= to_date('" + date + "', 'yyyy-MM-dd') AND,";
      }
			
			
			//kurang definition
			
			if(typeof encounter !== 'undefined' && encounter !== ""){
        condition += "cp.CONTEXT_ENCOUNTER = '" + encounter + "' AND,";  
      }
			
			if(typeof goal !== 'undefined' && goal !== ""){
				join += " LEFT JOIN BACIRO_FHIR.GOAL gl on cp.CAREPLAN_ID = gl.CAREPLAN_ID ";
        condition += "gl.GOAL_ID = '" + goal + "' AND,";  
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i on cp.CAREPLAN_ID = i.CAREPLAN_ID ";
        condition += "i.IDENTIFIER_ID = '" + identifier + "' AND,";  
      }
			
			if(typeof intent !== 'undefined' && intent !== ""){
        condition += "cp.intent = '" + intent + "' AND,";  
      }
			
			if(typeof part_of !== 'undefined' && part_of !== ""){
        condition += "cp.part_of = '" + part_of + "' AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "cp.SUBJECT_PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "cp.SUBJECT_PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof replaces !== 'undefined' && replaces !== ""){
        condition += "cp.replaces = '" + replaces + "' AND,";  
      }
			
			if(typeof status !== 'undefined' && status !== ""){
        condition += "cp.status = '" + status + "' AND,";  
      }
			
			if(typeof subject !== 'undefined' && subject !== ""){
				condition += "(cp.SUBJECT_PATIENT = '" + subject + "' OR cp.SUBJECT_GROUP = '" + subject + "') AND,";  
			}
			
			var offset = req.query.offset;
			var limit = req.query.limit;

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " cp.careplan_id > '" + offset + "' AND ";       
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
			      
      var arrCarePlan = [];
      var query = "select cp.careplan_id as careplan_id, cp.based_on as based_on, cp.replaces as replaces, cp.part_of as part_of, cp.status as status, cp.intent as intent, cp.category as category, cp.title as title, cp.description as description, cp.subject_patient as subject_patient, cp.subject_group as subject_group, cp.context_encounter as context_encounter, cp.context_episode_of_care as context_episode_of_care, cp.period_start as period_start, cp.period_end as period_end, cp.supporting_info as supporting_info from baciro_fhir.CAREPLAN cp " + fixCondition + limit;			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var CarePlan = {};
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
					
					CarePlan.resourceType = "CarePlan";
          CarePlan.id = rez[i].careplan_id;
					CarePlan.based_on = rez[i].based_on;
					CarePlan.replaces = rez[i].replaces;
					CarePlan.part_of = rez[i].part_of;
					CarePlan.status = rez[i].status;
					CarePlan.intent = rez[i].intent;
					CarePlan.category = rez[i].category;
					CarePlan.title = rez[i].title;
					CarePlan.subject = Subject;
					CarePlan.context = Context;
					var period_start,period_end;
					if(rez[i].period_start == null){
						period_start = formatDate(rez[i].period_start);  
					}else{
						period_start = rez[i].period_start;  
					}
					if(rez[i].period_end == null){
						period_end = formatDate(rez[i].period_end);  
					}else{
						period_end = rez[i].period_end;  
					}
					CarePlan.period = period_start + ' to ' + period_end;
					CarePlan.supportingInfo = rez[i].supporting_info;
					
          arrCarePlan[i] = CarePlan;
        }
        res.json({"err_code":0,"data": arrCarePlan});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getCarePlan"});
      });
    },
		carePlanActivity: function getCarePlanActivity(req, res) {
			var apikey = req.params.apikey;
			
			var carePlanActivityId = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = "";

			if (typeof carePlanActivityId !== 'undefined' && carePlanActivityId !== "") {
				condition += "ca.CAREPLAN_ACTIVITY_ID = '" + carePlanActivityId + "' AND ";
			}

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "ca.CAREPLAN_ID = '" + carePlanId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrCarePlanActivity = [];
			var query = "select care_plan_activity_id as careplan_activity_id, outcome_codeable_concept, outcome_reference, progress, reference_appointment, reference_communication_request, reference_device_request, reference_medication_request, reference_nutrition_order, reference_task, reference_procedure_request, reference_referral_request, reference_vision_prescription, reference_request_group, activity_detail_id, category, definition_plan_definition, definition_activity_definition, definition_questionnaire, code, reason_code, status, status_reason, prohibited, scheduled_timing, scheduled_period_start, scheduled_period_end, scheduled_string, location, product_codeable_concept, product_reference_medication, product_reference_substance, daily_amount, quantity, description, tim.timing_id alias timtiming_id, tim.event alias timevent, tim.repeat_bounds_duration alias timrepeat_bounds_duration, tim.repeat_bounds_range_low alias timrepeat_bounds_range_low, tim.repeat_bounds_range_high alias timrepeat_bounds_range_high, tim.repeat_bounds_period_start alias timrepeat_bounds_period_start, tim.repeat_bounds_period_end alias timrepeat_bounds_period_end, tim.count alias timcount, tim.count_max alias timcount_max, tim.duration alias timduration, tim.duration_max alias timduration_max, tim.duration_unit alias timduration_unit, tim.frequency alias timfrequency, tim.frequency_max alias timfrequency_max, tim.period alias timperiod, tim.period_max alias timperiod_max, tim.period_unit alias timperiod_unit, tim.day_of_week alias timday_of_week, tim.time_of_day alias timtime_of_day, tim.whenn alias timwhenn, tim.offsett alias timoffsett, tim.code alias timcode from baciro_fhir.careplan_activity ca left join baciro_fhir.careplan_activity_detail cd on ca.care_plan_activity_id  = cd.activity_id left join baciro_fhir.timing tim on cd.scheduled_timing = tim.timing_id" + fixCondition;	
	
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var CarePlanActivity = { id : "", outcomeCodeableConcept : "", outcomeReference : "", progress : "", reference : "", detail : {} };
					
					var Reference = {};
					if(rez[i].reference_appointment !== "null"){
						Reference.appointment = hostFHIR + ':' + portFHIR + '/' + apikey + '/Appointment?_id=' +  rez[i].reference_appointment;
					} else {
						Reference.appointment = "";
					}
					if(rez[i].reference_communication_request !== "null"){
						Reference.communicationRequest = hostFHIR + ':' + portFHIR + '/' + apikey + '/CommunicationRequest?_id=' +  rez[i].reference_communication_request;
					} else {
						Reference.communicationRequest = "";
					}
					if(rez[i].reference_device_request !== "null"){
						Reference.deviceRequest = hostFHIR + ':' + portFHIR + '/' + apikey + '/DeviceRequest?_id=' +  rez[i].reference_device_request;
					} else {
						Reference.deviceRequest = "";
					}
					if(rez[i].reference_medication_request !== "null"){
						Reference.medicationRequest = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationRequest?_id=' +  rez[i].reference_medication_request;
					} else {
						Reference.medicationRequest = "";
					}
					if(rez[i].reference_nutrition_order !== "null"){
						Reference.nutritionOrder = hostFHIR + ':' + portFHIR + '/' + apikey + '/NutritionOrder?_id=' +  rez[i].reference_nutrition_order;
					} else {
						Reference.nutritionOrder = "";
					}
					if(rez[i].reference_task !== "null"){
						Reference.task = hostFHIR + ':' + portFHIR + '/' + apikey + '/Task?_id=' +  rez[i].reference_task;
					} else {
						Reference.task = "";
					}
					if(rez[i].reference_procedure_request !== "null"){
						Reference.procedureRequest = hostFHIR + ':' + portFHIR + '/' + apikey + '/ProcedureRequest?_id=' +  rez[i].reference_procedure_request;
					} else {
						Reference.procedureRequest = "";
					}
					if(rez[i].reference_referral_request !== "null"){
						Reference.referralRequest = hostFHIR + ':' + portFHIR + '/' + apikey + '/ReferralRequest?_id=' +  rez[i].reference_referral_request;
					} else {
						Reference.referralRequest = "";
					}
					if(rez[i].reference_vision_prescription !== "null"){
						Reference.visionPrescription = hostFHIR + ':' + portFHIR + '/' + apikey + '/VisionPrescription?_id=' +  rez[i].reference_vision_prescription;
					} else {
						Reference.visionPrescription = "";
					}
					if(rez[i].reference_request_group !== "null"){
						Reference.requestGroup = hostFHIR + ':' + portFHIR + '/' + apikey + '/RequestGroup?_id=' +  rez[i].reference_request_group;
					} else {
						Reference.requestGroup = "";
					}
					
					var Definition = {};
					if(rez[i].definition_plan_definition !== "null"){
						Definition.planDefinition = hostFHIR + ':' + portFHIR + '/' + apikey + '/PlanDefinition?_id=' +  rez[i].definition_plan_definition;
					} else {
						Definition.planDefinition = "";
					}
					if(rez[i].definition_activity_definition !== "null"){
						Definition.activityDefinition = hostFHIR + ':' + portFHIR + '/' + apikey + '/ActivityDefinition?_id=' +  rez[i].definition_activity_definition;
					} else {
						Definition.activityDefinition = "";
					}
					if(rez[i].definition_questionnaire !== "null"){
						Definition.questionnaire = hostFHIR + ':' + portFHIR + '/' + apikey + '/Questionnaire?_id=' +  rez[i].definition_questionnaire;
					} else {
						Definition.questionnaire = "";
					}
					
					var ProductReference = {};
					if(rez[i].product_reference_medication !== "null"){
						ProductReference.medication = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' +  rez[i].product_reference_medication;
					} else {
						ProductReference.medication = "";
					}
					if(rez[i].product_reference_substance !== "null"){
						ProductReference.substance = hostFHIR + ':' + portFHIR + '/' + apikey + '/Substance?_id=' +  rez[i].product_reference_substance;
					} else {
						ProductReference.substance = "";
					}
					
					var Timing = {};
					Timing.id = rez[i].timtiming_id;
					if(rez[i].timevent == null){
						Timing.event = formatDate(rez[i].timevent);  
					}else{
						Timing.event = rez[i].timevent;
					}
					var Repeat = {};
					var Bounds = {};
					Bounds.boundsDuration = rez[i].timrepeat_bounds_duration;
					Bounds.boundsRange = rez[i].timrepeat_bounds_range_low + ' to ' + rez[i].timrepeat_bounds_range_high;
					var repeatperiod_start,repeatperiod_end;
          if(rez[i].timrepeat_bounds_period_start == null){
            repeatperiod_start = formatDate(rez[i].timrepeat_bounds_period_start);  
          }else{
            repeatperiod_start = rez[i].timrepeat_bounds_period_start;  
          }
          if(rez[i].timonset_period_end == null){
            repeatperiod_end = formatDate(rez[i].timonset_period_end);  
          }else{
            repeatperiod_end = rez[i].timonset_period_end;  
          }
					Bounds.boundsPeriod = repeatperiod_start + ' to ' + repeatperiod_end;
					Repeat.bounds = Bounds;
					Repeat.count = rez[i].timcount;
					Repeat.countMax = rez[i].timcount_max;
					Repeat.duration = rez[i].timduration;
					Repeat.durationMax = rez[i].timduration_max;
					Repeat.durationUnit = rez[i].timduration_unit;
					Repeat.frequency = rez[i].timfrequency;
					Repeat.frequencyMax = rez[i].timfrequency_max;
					Repeat.period = rez[i].timperiod;
					Repeat.periodMax = rez[i].timperiod_max;
					Repeat.periodUnit = rez[i].timperiod_unit;
					Repeat.dayOfWeek = rez[i].timday_of_week;
					if(rez[i].timtime_of_day == null){
						Repeat.timeOfDay = formatDate(rez[i].timtime_of_day);  
					}else{
						Repeat.timeOfDay = rez[i].timtime_of_day;
					}
					Repeat.when = rez[i].timwhenn;
					Repeat.offset = rez[i].timoffsett;
					Timing.repeat = Repeat;
					Timing.code = rez[i].timcode;
					
					var Scheduled = {};
					//Scheduled.scheduledTiming = rez[i].scheduled_timing;
					Scheduled.scheduledTiming = Timing;
					var scheduledperiod_start,scheduledperiod_end;
					if(rez[i].scheduled_period_start !== "null"){
						scheduledperiod_start = rez[i].scheduled_period_start;  
					}else{
						scheduledperiod_start = formatDate(rez[i].scheduled_period_start);  
					}
					if(rez[i].scheduled_period_end !== "null"){
						scheduledperiod_end = rez[i].scheduled_period_end;  
					}else{
						scheduledperiod_end = formatDate(rez[i].scheduled_period_end);  
					}
					Scheduled.scheduledPeriod = scheduledperiod_start + " to " + scheduledperiod_end;
					Scheduled.scheduledString = rez[i].scheduled_string;
					
					var Product = {};
					Product.productCodeableConcept = rez[i].product_codeable_concept;
					Product.productReference = ProductReference;
					
					/*-------------------*/
					
					CarePlanActivity.id = rez[i].careplan_activity_id;
					CarePlanActivity.outcomeCodeableConcept = rez[i].outcome_codeable_concept;
					CarePlanActivity.outcomeReference = rez[i].outcome_reference;
					//CarePlanActivity.progress = rez[i].progress;
					CarePlanActivity.reference = Reference;
					CarePlanActivity.detail.id = rez[i].activity_detail_id;
					CarePlanActivity.detail.category = rez[i].category;
					CarePlanActivity.detail.definition = Definition;
					CarePlanActivity.detail.code = rez[i].code;
					CarePlanActivity.detail.reasonCode = rez[i].reason_code;
					CarePlanActivity.detail.status = rez[i].status;
					CarePlanActivity.detail.statusReason = rez[i].status_reason;
					CarePlanActivity.detail.prohibited = rez[i].prohibited;
					CarePlanActivity.detail.scheduled = Scheduled;
					if(rez[i].location !== "null"){
						CarePlanActivity.detail.location = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].location;
					} else {
						CarePlanActivity.detail.location = "";
					}
					CarePlanActivity.detail.product = Product;
					CarePlanActivity.detail.dailyAmount = rez[i].daily_amount;
					CarePlanActivity.detail.quantity = rez[i].quantity;
					CarePlanActivity.detail.description = rez[i].description;
					
					arrCarePlanActivity[i] = CarePlanActivity;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanActivity
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanActivity"
				});
			});
		},
		
		carePlanDefinitionPlanDefinition: function getCarePlanDefinitionPlanDefinition(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanDefinitionPlanDefinition = [];
			var query = 'select plan_definition_id from BACIRO_FHIR.plan_definition ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanDefinitionPlanDefinition = {};
					if(rez[i].plan_definition_id != "null"){
						carePlanDefinitionPlanDefinition.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/PlanDefinition?_id=' +  rez[i].plan_definition_id;
					} else {
						carePlanDefinitionPlanDefinition.id = "";
					}
					
					arrCarePlanDefinitionPlanDefinition[i] = carePlanDefinitionPlanDefinition;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanDefinitionPlanDefinition
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanDefinitionPlanDefinition"
				});
			});
		},
		carePlanDefinitionQuestionnaire: function getCarePlanDefinitionQuestionnaire(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "careplan_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanDefinitionQuestionnaire = [];
			var query = 'select questionnaire_id from BACIRO_FHIR.questionnaire ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanDefinitionQuestionnaire = {};
					if(rez[i].questionnaire_id != "null"){
						carePlanDefinitionQuestionnaire.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Questionnaire?_id=' +  rez[i].questionnaire_id;
					} else {
						carePlanDefinitionQuestionnaire.id = "";
					}
					
					arrCarePlanDefinitionQuestionnaire[i] = carePlanDefinitionQuestionnaire;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanDefinitionQuestionnaire
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanDefinitionQuestionnaire"
				});
			});
		},
		carePlanBasedOn: function getCarePlanBasedOn(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "based_on = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanBasedOn = [];
			var query = 'select careplan_id from BACIRO_FHIR.careplan ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanBasedOn = {};
					if(rez[i].careplan_id != "null"){
						carePlanBasedOn.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Careplan?_id=' +  rez[i].careplan_id;
					} else {
						carePlanBasedOn.id = "";
					}
					
					arrCarePlanBasedOn[i] = carePlanBasedOn;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanBasedOn
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanBasedOn"
				});
			});
		},
		carePlanReplaces: function getCarePlanReplaces(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "replaces = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanReplaces = [];
			var query = 'select careplan_id from BACIRO_FHIR.careplan ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanReplaces = {};
					if(rez[i].careplan_id != "null"){
						carePlanReplaces.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Careplan?_id=' +  rez[i].careplan_id;
					} else {
						carePlanReplaces.id = "";
					}
					
					arrCarePlanReplaces[i] = carePlanReplaces;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanReplaces
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanReplaces"
				});
			});
		},
		carePlanPartOf: function getCarePlanPartOf(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "part_of = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanPartOf = [];
			var query = 'select careplan_id from BACIRO_FHIR.careplan ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanPartOf = {};
					if(rez[i].careplan_id != "null"){
						carePlanPartOf.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Careplan?_id=' +  rez[i].careplan_id;
					} else {
						carePlanPartOf.id = "";
					}
					
					arrCarePlanPartOf[i] = carePlanPartOf;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanPartOf
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanPartOf"
				});
			});
		},
		carePlanAuthorPatient: function getCarePlanAuthorPatient(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanAuthorPatient = [];
			var query = 'select patient_id from BACIRO_FHIR.patient ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanAuthorPatient = {};
					if(rez[i].patient_id != "null"){
						carePlanAuthorPatient.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient_id;
					} else {
						carePlanAuthorPatient.id = "";
					}
					
					arrCarePlanAuthorPatient[i] = carePlanAuthorPatient;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanAuthorPatient
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanAuthorPatient"
				});
			});
		},
		carePlanAuthorPractitioner: function getCarePlanAuthorPractitioner(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanAuthorPractitioner = [];
			var query = 'select practitioner_id from BACIRO_FHIR.practitioner ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanAuthorPractitioner = {};
					if(rez[i].practitioner_id != "null"){
						carePlanAuthorPractitioner.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].practitioner_id;
					} else {
						carePlanAuthorPractitioner.id = "";
					}
					
					arrCarePlanAuthorPractitioner[i] = carePlanAuthorPractitioner;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanAuthorPractitioner
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanAuthorPractitioner"
				});
			});
		},
		carePlanAuthorRelatedPerson: function getCarePlanAuthorRelatedPerson(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanAuthorRelatedPerson = [];
			var query = 'select related_person_id from BACIRO_FHIR.related_person ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanAuthorRelatedPerson = {};
					if(rez[i].related_person_id != "null"){
						carePlanAuthorRelatedPerson.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].related_person_id;
					} else {
						carePlanAuthorRelatedPerson.id = "";
					}
					
					arrCarePlanAuthorRelatedPerson[i] = carePlanAuthorRelatedPerson;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanAuthorRelatedPerson
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanAuthorRelatedPerson"
				});
			});
		},
		carePlanAuthorOrganization: function getCarePlanAuthorOrganization(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanAuthorOrganization = [];
			var query = 'select organization_id from BACIRO_FHIR.organization ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanAuthorOrganization = {};
					if(rez[i].organization_id != "null"){
						carePlanAuthorOrganization.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].organization_id;
					} else {
						carePlanAuthorOrganization.id = "";
					}
					
					arrCarePlanAuthorOrganization[i] = carePlanAuthorOrganization;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanAuthorOrganization
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanAuthorOrganization"
				});
			});
		},
		carePlanAuthorCareTeam: function getCarePlanAuthorCareTeam(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_author_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanAuthorCareTeam = [];
			var query = 'select care_team_id from BACIRO_FHIR.care_team ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanAuthorCareTeam = {};
					if(rez[i].care_team_id != "null"){
						carePlanAuthorCareTeam.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/CareTeam?_id=' +  rez[i].care_team_id;
					} else {
						carePlanAuthorCareTeam.id = "";
					}
					
					arrCarePlanAuthorCareTeam[i] = carePlanAuthorCareTeam;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanAuthorCareTeam
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanAuthorCareTeam"
				});
			});
		},
		carePlanCareTeam: function getCarePlanCareTeam(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_team_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanCareTeam = [];
			var query = 'select care_team_id from BACIRO_FHIR.care_team ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanCareTeam = {};
					if(rez[i].care_team_id != "null"){
						carePlanCareTeam.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/careTeam?_id=' +  rez[i].care_team_id;
					} else {
						carePlanCareTeam.id = "";
					}
					
					arrCarePlanCareTeam[i] = carePlanCareTeam;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanCareTeam
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanCareTeam"
				});
			});
		},
		carePlanAddresses: function getCarePlanAddresses(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanAddresses = [];
			var query = 'select condition_id from BACIRO_FHIR.condition ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanAddresses = {};
					if(rez[i].condition_id != "null"){
						carePlanAddresses.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Condition?_id=' +  rez[i].condition_id;
					} else {
						carePlanAddresses.id = "";
					}
					
					arrCarePlanAddresses[i] = carePlanAddresses;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanAddresses
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanAddresses"
				});
			});
		},
		carePlanGoal: function getCarePlanGoal(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanGoal = [];
			var query = 'select goal_id from BACIRO_FHIR.goal ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanGoal = {};
					if(rez[i].goal_id != "null"){
						carePlanGoal.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Goal?_id=' +  rez[i].goal_id;
					} else {
						carePlanGoal.id = "";
					}
					
					arrCarePlanGoal[i] = carePlanGoal;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanGoal
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanGoal"
				});
			});
		},
		carePlanActivityProgress: function getCarePlanActivityProgress(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_activity_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_activity_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanActivityProgress = [];
			var query = 'select note_id from BACIRO_FHIR.note ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanActivityProgress = {};
					if(rez[i].note_id != "null"){
						carePlanActivityProgress.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Note?_id=' +  rez[i].note_id;
					} else {
						carePlanActivityProgress.id = "";
					}
					
					arrCarePlanActivityProgress[i] = carePlanActivityProgress;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanActivityProgress
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanActivityProgress"
				});
			});
		},
		carePlanActivityDetailReasonReference: function getCarePlanActivityDetailReasonReference(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_activity_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanActivityDetailReasonReference = [];
			var query = 'select condition_id from BACIRO_FHIR.condition ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanActivityDetailReasonReference = {};
					if(rez[i].condition_id != "null"){
						carePlanActivityDetailReasonReference.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Condition?_id=' +  rez[i].condition_id;
					} else {
						carePlanActivityDetailReasonReference.id = "";
					}
					
					arrCarePlanActivityDetailReasonReference[i] = carePlanActivityDetailReasonReference;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanActivityDetailReasonReference
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanActivityDetailReasonReference"
				});
			});
		},
		carePlanActivityDetailGoal: function getCarePlanActivityDetailGoal(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_activity_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_activity_detail_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanActivityDetailGoal = [];
			var query = 'select goal_id from BACIRO_FHIR.goal ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanActivityDetailGoal = {};
					if(rez[i].goal_id != "null"){
						carePlanActivityDetailGoal.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Goal?_id=' +  rez[i].goal_id;
					} else {
						carePlanActivityDetailGoal.id = "";
					}
					
					arrCarePlanActivityDetailGoal[i] = carePlanActivityDetailGoal;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanActivityDetailGoal
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanActivityDetailGoal"
				});
			});
		},
		carePlanActivityDetailPerformerPractitioner: function getCarePlanActivityDetailPerformerPractitioner(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_activity_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_activity_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanActivityDetailPerformerPractitioner = [];
			var query = 'select practitioner_id from BACIRO_FHIR.practitioner ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanActivityDetailPerformerPractitioner = {};
					if(rez[i].practitioner_id != "null"){
						carePlanActivityDetailPerformerPractitioner.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].practitioner_id;
					} else {
						carePlanActivityDetailPerformerPractitioner.id = "";
					}
					
					arrCarePlanActivityDetailPerformerPractitioner[i] = carePlanActivityDetailPerformerPractitioner;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanActivityDetailPerformerPractitioner
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanActivityDetailPerformerPractitioner"
				});
			});
		},
		carePlanActivityDetailPerformerOrganization: function getCarePlanActivityDetailPerformerOrganization(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_activity_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_activity_detail_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanActivityDetailPerformerOrganization = [];
			var query = 'select organization_id from BACIRO_FHIR.organization ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanActivityDetailPerformerOrganization = {};
					if(rez[i].organization_id != "null"){
						carePlanActivityDetailPerformerOrganization.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].organization_id;
					} else {
						carePlanActivityDetailPerformerOrganization.id = "";
					}
					
					arrCarePlanActivityDetailPerformerOrganization[i] = carePlanActivityDetailPerformerOrganization;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanActivityDetailPerformerOrganization
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanActivityDetailPerformerOrganization"
				});
			});
		},
		carePlanActivityDetailPerformerRelatedPerson: function getCarePlanActivityDetailPerformerRelatedPerson(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_activity_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_activity_detail_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanActivityDetailPerformerRelatedPerson = [];
			var query = 'select related_person_id from BACIRO_FHIR.related_person ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanActivityDetailPerformerRelatedPerson = {};
					if(rez[i].related_person_id != "null"){
						carePlanActivityDetailPerformerRelatedPerson.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].related_person_id;
					} else {
						carePlanActivityDetailPerformerRelatedPerson.id = "";
					}
					
					arrCarePlanActivityDetailPerformerRelatedPerson[i] = carePlanActivityDetailPerformerRelatedPerson;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanActivityDetailPerformerRelatedPerson
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanActivityDetailPerformerRelatedPerson"
				});
			});
		},
		carePlanActivityDetailPerformerPatient: function getCarePlanActivityDetailPerformerPatient(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_activity_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_detail_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanActivityDetailPerformerPatient = [];
			var query = 'select patient_id from BACIRO_FHIR.patient ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanActivityDetailPerformerPatient = {};
					if(rez[i].patient_id != "null"){
						carePlanActivityDetailPerformerPatient.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient_id;
					} else {
						carePlanActivityDetailPerformerPatient.id = "";
					}
					
					arrCarePlanActivityDetailPerformerPatient[i] = carePlanActivityDetailPerformerPatient;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanActivityDetailPerformerPatient
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanActivityDetailPerformerPatient"
				});
			});
		},
		carePlanActivityDetailPerformerCareTeam: function getCarePlanActivityDetailPerformerCareTeam(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_activity_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_activity_detail_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanActivityDetailPerformerCareTeam = [];
			var query = 'select care_team_id from BACIRO_FHIR.care_team ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanActivityDetailPerformerCareTeam = {};
					if(rez[i].care_team_id != "null"){
						carePlanActivityDetailPerformerCareTeam.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/CareTeam?_id=' +  rez[i].care_team_id;
					} else {
						carePlanActivityDetailPerformerCareTeam.id = "";
					}
					
					arrCarePlanActivityDetailPerformerCareTeam[i] = carePlanActivityDetailPerformerCareTeam;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanActivityDetailPerformerCareTeam
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanActivityDetailPerformerCareTeam"
				});
			});
		},
		carePlanNote: function getCarePlanNote(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var carePlanId = req.query.care_plan_id;

			//susun query
			var condition = '';

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "care_plan_id = '" + carePlanId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrCarePlanNote = [];
			var query = 'select note_id from BACIRO_FHIR.note ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var carePlanNote = {};
					if(rez[i].note_id != "null"){
						carePlanNote.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/note?_id=' +  rez[i].note_id;
					} else {
						carePlanNote.id = "";
					}
					
					arrCarePlanNote[i] = carePlanNote;
				}
				res.json({
					"err_code": 0,
					"data": arrCarePlanNote
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getCarePlanNote"
				});
			});
		},		
  },
	post: {
		carePlan: function addCarePlan(req, res) {
			console.log(req.body);
			var careplan_id  = req.body.careplan_id;
			var based_on = req.body.based_on;
			var replaces = req.body.replaces;
			var part_of = req.body.part_of;
			var status = req.body.status;
			var intent = req.body.intent;
			var category = req.body.category;
			var title = req.body.title;
			var description = req.body.description;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var period_start = req.body.period_start;
			var period_end = req.body.period_end;
			var supporting_info = req.body.supporting_info;
			var procedure_id = req.body.procedure_id;			
			var diagnostic_report_id = req.body.diagnostic_report_id;
			var imaging_study_id = req.body.imaging_study_id;
			var medication_request_id = req.body.medication_request_id;
			var medication_statement_id = req.body.medication_statement_id;
			var observation_id = req.body.observation_id;
			var questionnaire_response_id = req.body.questionnaire_response_id;
			var referral_request_id = req.body.referral_request_id;
			
			
			
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
			
			if (typeof part_of !== 'undefined' && part_of !== "") {
        column += 'part_of,';
        values += "'" + part_of + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof intent !== 'undefined' && intent !== "") {
        column += 'intent,';
        values += "'" + intent + "',";
      }	
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }	
			
			if (typeof title !== 'undefined' && title !== "") {
        column += 'title,';
        values += "'" + title + "',";
      }	
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
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
			
			if (typeof period_start !== 'undefined' && period_start !== "") {
        column += 'period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof period_end !== 'undefined' && period_end !== "") {
        column += 'period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof supporting_info !== 'undefined' && supporting_info !== "") {
        column += 'supporting_info,';
        values += "'" + supporting_info + "',";
      }	
			
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }	
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }
			
			if (typeof imaging_study_id !== 'undefined' && imaging_study_id !== "") {
        column += 'imaging_study_id,';
        values += "'" + imaging_study_id + "',";
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
			
			if (typeof questionnaire_response_id !== 'undefined' && questionnaire_response_id !== "") {
        column += 'questionnaire_response_id,';
        values += "'" + questionnaire_response_id + "',";
      }
			
			if (typeof referral_request_id !== 'undefined' && referral_request_id !== "") {
        column += 'referral_request_id,';
        values += "'" + referral_request_id + "',";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.CAREPLAN(careplan_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+careplan_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select careplan_id, based_on, replaces, part_of, status, intent, category, title, description, subject_patient, subject_group, context_encounter, context_episode_of_care, period_start, period_end, supporting_info from baciro_fhir.CAREPLAN WHERE careplan_id = '" + careplan_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlan"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlan"});
      });
    },
		carePlanActivity: function addCarePlanActivity(req, res) {
			console.log(req.body);
			var careplan_activity_id  = req.body.careplan_activity_id;
			var outcome_codeable_concept  = req.body.outcome_codeable_concept;
			var outcome_reference  = req.body.outcome_reference;
			var progress  = req.body.progress;
			var reference_appointment  = req.body.reference_appointment;
			var reference_communication_request  = req.body.reference_communication_request;
			var reference_device_request  = req.body.reference_device_request;
			var reference_medication_request  = req.body.reference_medication_request;
			var reference_nutrition_order  = req.body.reference_nutrition_order;
			var reference_task  = req.body.reference_task;
			var reference_procedure_request  = req.body.reference_procedure_request;
			var reference_referral_request  = req.body.reference_referral_request;
			var reference_vision_prescription  = req.body.reference_vision_prescription;
			var reference_request_group  = req.body.reference_request_group;
			var careplan_id  = req.body.careplan_id;

			var column = "";
      var values = "";
			
			if (typeof outcome_codeable_concept !== 'undefined' && outcome_codeable_concept !== "") {
        column += 'outcome_codeable_concept,';
        values += "'" + outcome_codeable_concept + "',";
      }
			
			if (typeof outcome_reference !== 'undefined' && outcome_reference !== "") {
        column += 'outcome_reference,';
        values += "'" + outcome_reference + "',";
      }
			
			if (typeof progress !== 'undefined' && progress !== "") {
        column += 'progress,';
        values += "'" + progress + "',";
      }
			
			if (typeof reference_appointment !== 'undefined' && reference_appointment !== "") {
        column += 'reference_appointment,';
        values += "'" + reference_appointment + "',";
      }
			
			if (typeof reference_communication_request !== 'undefined' && reference_communication_request !== "") {
        column += 'reference_communication_request,';
        values += "'" + reference_communication_request + "',";
      }	
			
			if (typeof reference_device_request !== 'undefined' && reference_device_request !== "") {
        column += 'reference_device_request,';
        values += "'" + reference_device_request + "',";
      }	
			
			if (typeof reference_medication_request !== 'undefined' && reference_medication_request !== "") {
        column += 'reference_medication_request,';
        values += "'" + reference_medication_request + "',";
      }	
			
			if (typeof reference_nutrition_order !== 'undefined' && reference_nutrition_order !== "") {
        column += 'reference_nutrition_order,';
        values += "'" + reference_nutrition_order + "',";
      }	
			
			if (typeof reference_task !== 'undefined' && reference_task !== "") {
        column += 'reference_task,';
        values += "'" + reference_task + "',";
      }	
			
			if (typeof reference_procedure_request !== 'undefined' && reference_procedure_request !== "") {
        column += 'reference_procedure_request,';
        values += "'" + reference_procedure_request + "',";
      }	
			
			if (typeof reference_referral_request !== 'undefined' && reference_referral_request !== "") {
        column += 'reference_referral_request,';
        values += "'" + reference_referral_request + "',";
      }	
			
			if (typeof reference_vision_prescription !== 'undefined' && reference_vision_prescription !== "") {
        column += 'reference_vision_prescription,';
        values += "'" + reference_vision_prescription + "',";
      }	
			
			if (typeof reference_request_group !== 'undefined' && reference_request_group !== "") {
        column += 'reference_request_group,';
        values += "'" + reference_request_group + "',";
      }	
			
			if (typeof careplan_id !== 'undefined' && careplan_id !== "") {
        column += 'careplan_id,';
        values += "'" + careplan_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.CAREPLAN_ACTIVITY(careplan_activity_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+careplan_activity_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select careplan_activity_id, outcome_codeable_concept, outcome_reference, progress, reference_appointment, reference_communication_request, reference_device_request, reference_medication_request, reference_nutrition_order, reference_task, reference_procedure_request, reference_referral_request, reference_vision_prescription, reference_request_group from baciro_fhir.CAREPLAN_ACTIVITY WHERE careplan_activity_id = '" + careplan_activity_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanActivity"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCarePlanActivity"});
      });
    },
		carePlanActivityDetail: function updateCarePlanActivityDetail(req, res) {
			console.log(req.body);
			var activity_detail_id  = req.body.activity_detail_id;
			var category  = req.body.category;
			var definition_plan_definition  = req.body.definition_plan_definition;
			var definition_activity_definition  = req.body.definition_activity_definition;
			var definition_questionnaire  = req.body.definition_questionnaire;
			var code  = req.body.code;
			var reason_code  = req.body.reason_code;
			var status  = req.body.status;
			var status_reason  = req.body.status_reason;
			var prohibited  = req.body.prohibited;
			var scheduled_timing  = req.body.scheduled_timing;
			var scheduled_period_start  = req.body.scheduled_period_start;
			var scheduled_period_end  = req.body.scheduled_period_end;
			var scheduled_string  = req.body.scheduled_string;
			var location  = req.body.location;
			var product_codeable_concept  = req.body.product_codeable_concept;
			var product_reference_medication  = req.body.product_reference_medication;
			var product_reference_substance  = req.body.product_reference_substance;
			var daily_amount  = req.body.daily_amount;
			var quantity  = req.body.quantity;
			var description  = req.body.description;
			var activity_id  = req.body.activity_id;

			var column = "";
      var values = "";
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }
			
			if (typeof definition_plan_definition !== 'undefined' && definition_plan_definition !== "") {
        column += 'definition_plan_definition,';
        values += "'" + definition_plan_definition + "',";
      }
			
			if (typeof definition_activity_definition !== 'undefined' && definition_activity_definition !== "") {
        column += 'definition_activity_definition,';
        values += "'" + definition_activity_definition + "',";
      }
			
			if (typeof definition_questionnaire !== 'undefined' && definition_questionnaire !== "") {
        column += 'definition_questionnaire,';
        values += "'" + definition_questionnaire + "',";
      }
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }	
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }	
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }	
			
			if (typeof status_reason !== 'undefined' && status_reason !== "") {
        column += 'status_reason,';
        values += "'" + status_reason + "',";
      }	
			
			if (typeof prohibited !== 'undefined' && prohibited !== "") {
        column += 'prohibited,';
        values += " " + prohibited + ",";
      }	
			
			/*if (typeof scheduled_timing !== 'undefined' && scheduled_timing !== "") {
        column += 'scheduled_timing,';
        //values += "'" + date + "',";
				values += "to_date('"+ scheduled_timing + "', 'yyyy-MM-dd'),";
      }*/
			
			if (typeof scheduled_timing !== 'undefined' && scheduled_timing !== "") {
        column += 'scheduled_timing,';
        values += "'" + scheduled_timing + "',";
      }	
			
			if (typeof scheduled_period_start !== 'undefined' && scheduled_period_start !== "") {
        column += 'scheduled_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ scheduled_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof scheduled_period_end !== 'undefined' && scheduled_period_end !== "") {
        column += 'scheduled_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ scheduled_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof scheduled_string !== 'undefined' && scheduled_string !== "") {
        column += 'scheduled_string,';
        values += "'" + scheduled_string + "',";
      }	
			
			if (typeof location !== 'undefined' && location !== "") {
        column += 'location,';
        values += "'" + location + "',";
      }	
			
			if (typeof product_codeable_concept !== 'undefined' && product_codeable_concept !== "") {
        column += 'product_codeable_concept,';
        values += "'" + product_codeable_concept + "',";
      }	
			
			if (typeof product_reference_medication !== 'undefined' && product_reference_medication !== "") {
        column += 'product_reference_medication,';
        values += "'" + product_reference_medication + "',";
      }	
			if (typeof product_reference_substance !== 'undefined' && product_reference_substance !== "") {
        column += 'product_reference_substance,';
        values += "'" + product_reference_substance + "',";
      }	
			
			if (typeof daily_amount !== 'undefined' && daily_amount !== "") {
        column += 'daily_amount,';
        values += " " + daily_amount + ",";
      }	
			
			if (typeof quantity !== 'undefined' && quantity !== "") {
        column += 'quantity,';
        values += " " + quantity + ",";
      }	
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof activity_id !== 'undefined' && activity_id !== "") {
        column += 'activity_id,';
        values += "'" + activity_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.CAREPLAN_ACTIVITY_DETAIL(activity_detail_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+activity_detail_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select activity_detail_id, category, definition_plan_definition, definition_activity_definition, definition_questionnaire,  code, reason_code, status, status_reason, prohibited, scheduled_timing, scheduled_period_start, scheduled_period_end, scheduled_string, location, product_codeable_concept, product_reference_medication, product_reference_substance, daily_amount, quantity, description, activity_id from baciro_fhir.CAREPLAN_ACTIVITY_DETAIL WHERE activity_detail_id = '" + activity_detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanActivityDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanActivityDetail"});
      });
    }
	},
	put: {
		carePlan: function updateCarePlan(req, res) {
			console.log(req.body);
			var careplan_id  = req.params._id;
			var based_on = req.body.based_on;
			var replaces = req.body.replaces;
			var part_of = req.body.part_of;
			var status = req.body.status;
			var intent = req.body.intent;
			var category = req.body.category;
			var title = req.body.title;
			var description = req.body.description;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var period_start = req.body.period_start;
			var period_end = req.body.period_end;
			var supporting_info = req.body.supporting_info;
			var procedure_id = req.body.procedure_id;
			var diagnostic_report_id = req.body.diagnostic_report_id;
			var imaging_study_id = req.body.imaging_study_id;
			var medication_request_id = req.body.medication_request_id;
			var medication_statement_id = req.body.medication_statement_id;
			var observation_id = req.body.observation_id;
			var questionnaire_response_id = req.body.questionnaire_response_id;
			var referral_request_id = req.body.referral_request_id;
			
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
			
			if (typeof part_of !== 'undefined' && part_of !== "") {
        column += 'part_of,';
        values += "'" + part_of + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof intent !== 'undefined' && intent !== "") {
        column += 'intent,';
        values += "'" + intent + "',";
      }	
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }	
			
			if (typeof title !== 'undefined' && title !== "") {
        column += 'title,';
        values += "'" + title + "',";
      }	
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
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
			
			if (typeof period_start !== 'undefined' && period_start !== "") {
        column += 'period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof period_end !== 'undefined' && period_end !== "") {
        column += 'period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof supporting_info !== 'undefined' && supporting_info !== "") {
        column += 'supporting_info,';
        values += "'" + supporting_info + "',";
      }	
			
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }	
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }
			
			if (typeof imaging_study_id !== 'undefined' && imaging_study_id !== "") {
        column += 'imaging_study_id,';
        values += "'" + imaging_study_id + "',";
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
			
			if (typeof questionnaire_response_id !== 'undefined' && questionnaire_response_id !== "") {
        column += 'questionnaire_response_id,';
        values += "'" + questionnaire_response_id + "',";
      }
			
			if (typeof referral_request_id !== 'undefined' && referral_request_id !== "") {
        column += 'referral_request_id,';
        values += "'" + referral_request_id + "',";
      }
			
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "careplan_id = '" + careplan_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "careplan_id = '" + careplan_id + "'";
      }
			
			

      var query = "UPSERT INTO BACIRO_FHIR.CAREPLAN(careplan_id," + column.slice(0, -1) + ") SELECT careplan_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CAREPLAN WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select careplan_id, based_on, replaces, part_of, status, intent, category, title, description, subject_patient, subject_group, context_encounter, context_episode_of_care, period_start, period_end, supporting_info from baciro_fhir.CAREPLAN WHERE careplan_id = '" + careplan_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlan"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlan"});
      });
    },
		carePlanActivity: function updateCarePlanActivity(req, res) {
			console.log(req.body);
			var careplan_activity_id  = req.params._id;
			var outcome_codeable_concept  = req.body.outcome_codeable_concept;
			var outcome_reference  = req.body.outcome_reference;
			var progress  = req.body.progress;
			var reference_appointment  = req.body.reference_appointment;
			var reference_communication_request  = req.body.reference_communication_request;
			var reference_device_request  = req.body.reference_device_request;
			var reference_medication_request  = req.body.reference_medication_request;
			var reference_nutrition_order  = req.body.reference_nutrition_order;
			var reference_task  = req.body.reference_task;
			var reference_procedure_request  = req.body.reference_procedure_request;
			var reference_referral_request  = req.body.reference_referral_request;
			var reference_vision_prescription  = req.body.reference_vision_prescription;
			var reference_request_group  = req.body.reference_request_group;
			var careplan_id  = req.body.careplan_id;

			var column = "";
      var values = "";
			
			if (typeof outcome_codeable_concept !== 'undefined' && baoutcome_codeable_conceptsed_on !== "") {
        column += 'outcome_codeable_concept,';
        values += "'" + outcome_codeable_concept + "',";
      }
			
			if (typeof outcome_reference !== 'undefined' && outcome_reference !== "") {
        column += 'outcome_reference,';
        values += "'" + outcome_reference + "',";
      }
			
			if (typeof progress !== 'undefined' && progress !== "") {
        column += 'progress,';
        values += "'" + progress + "',";
      }
			
			if (typeof reference_appointment !== 'undefined' && reference_appointment !== "") {
        column += 'reference_appointment,';
        values += "'" + reference_appointment + "',";
      }
			
			if (typeof reference_communication_request !== 'undefined' && reference_communication_request !== "") {
        column += 'reference_communication_request,';
        values += "'" + reference_communication_request + "',";
      }	
			
			if (typeof reference_device_request !== 'undefined' && reference_device_request !== "") {
        column += 'reference_device_request,';
        values += "'" + reference_device_request + "',";
      }	
			
			if (typeof reference_medication_request !== 'undefined' && reference_medication_request !== "") {
        column += 'reference_medication_request,';
        values += "'" + reference_medication_request + "',";
      }	
			
			if (typeof reference_nutrition_order !== 'undefined' && reference_nutrition_order !== "") {
        column += 'reference_nutrition_order,';
        values += "'" + reference_nutrition_order + "',";
      }	
			
			if (typeof reference_task !== 'undefined' && reference_task !== "") {
        column += 'reference_task,';
        values += "'" + reference_task + "',";
      }	
			
			if (typeof reference_procedure_request !== 'undefined' && reference_procedure_request !== "") {
        column += 'reference_procedure_request,';
        values += "'" + reference_procedure_request + "',";
      }	
			
			if (typeof reference_referral_request !== 'undefined' && reference_referral_request !== "") {
        column += 'reference_referral_request,';
        values += "'" + reference_referral_request + "',";
      }	
			
			if (typeof reference_vision_prescription !== 'undefined' && reference_vision_prescription !== "") {
        column += 'reference_vision_prescription,';
        values += "'" + reference_vision_prescription + "',";
      }	
			
			if (typeof reference_request_group !== 'undefined' && reference_request_group !== "") {
        column += 'reference_request_group,';
        values += "'" + reference_request_group + "',";
      }	
			
			if (typeof careplan_id !== 'undefined' && careplan_id !== "") {
        column += 'careplan_id,';
        values += "'" + careplan_id + "',";
      }	

     
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "careplan_activity_id = '" + careplan_activity_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "careplan_activity_id = '" + careplan_activity_id + "'";
      }
			
			
			var query = "UPSERT INTO BACIRO_FHIR.CAREPLAN_ACTIVITY(careplan_activity_id," + column.slice(0, -1) + ") SELECT careplan_activity_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CAREPLAN_ACTIVITY WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select careplan_activity_id, outcome_codeable_concept, outcome_reference, progress, reference_appointment, reference_communication_request, reference_device_request, reference_medication_request, reference_nutrition_order, reference_task, reference_procedure_request, reference_referral_request, reference_vision_prescription, reference_request_group from baciro_fhir.CAREPLAN_ACTIVITY WHERE careplan_activity_id = '" + careplan_activity_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanActivity"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanActivity"});
      });
    },
		carePlanActivityDetail: function updateCarePlanActivityDetail(req, res) {
			console.log(req.body);
			var activity_detail_id  = req.params._id;
			var category  = req.body.category;
			var definition_plan_definition  = req.body.definition_plan_definition;
			var definition_activity_definition  = req.body.definition_activity_definition;
			var definition_questionnaire  = req.body.definition_questionnaire;
			var code  = req.body.code;
			var reason_code  = req.body.reason_code;
			var status  = req.body.status;
			var status_reason  = req.body.status_reason;
			var prohibited  = req.body.prohibited;
			var scheduled_timing  = req.body.scheduled_timing;
			var scheduled_period_start  = req.body.scheduled_period_start;
			var scheduled_period_end  = req.body.scheduled_period_end;
			var scheduled_string  = req.body.scheduled_string;
			var location  = req.body.location;
			var product_codeable_concept  = req.body.product_codeable_concept;
			var product_reference_medication  = req.body.product_reference_medication;
			var product_reference_substance  = req.body.product_reference_substance;
			var daily_amount  = req.body.daily_amount;
			var quantity  = req.body.quantity;
			var description  = req.body.description;
			var activity_id  = req.body.activity_id;

			var column = "";
      var values = "";
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }
			
			if (typeof definition_plan_definition !== 'undefined' && definition_plan_definition !== "") {
        column += 'definition_plan_definition,';
        values += "'" + definition_plan_definition + "',";
      }
			
			if (typeof definition_activity_definition !== 'undefined' && definition_activity_definition !== "") {
        column += 'definition_activity_definition,';
        values += "'" + definition_activity_definition + "',";
      }
			
			if (typeof definition_questionnaire !== 'undefined' && definition_questionnaire !== "") {
        column += 'definition_questionnaire,';
        values += "'" + definition_questionnaire + "',";
      }
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }	
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }	
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }	
			
			if (typeof status_reason !== 'undefined' && status_reason !== "") {
        column += 'status_reason,';
        values += "'" + status_reason + "',";
      }	
			
			if (typeof prohibited !== 'undefined' && prohibited !== "") {
        column += 'prohibited,';
        values += "'" + prohibited + "',";
      }	
			
			/*if (typeof scheduled_timing !== 'undefined' && scheduled_timing !== "") {
        column += 'scheduled_timing,';
        //values += "'" + date + "',";
				values += "to_date('"+ scheduled_timing + "', 'yyyy-MM-dd'),";
      }*/
			if (typeof scheduled_timing !== 'undefined' && scheduled_timing !== "") {
        column += 'scheduled_timing,';
        values += "'" + scheduled_timing + "',";
      }	
			
			if (typeof scheduled_period_start !== 'undefined' && scheduled_period_start !== "") {
        column += 'scheduled_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ scheduled_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof scheduled_period_end !== 'undefined' && scheduled_period_end !== "") {
        column += 'scheduled_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ scheduled_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof scheduled_string !== 'undefined' && scheduled_string !== "") {
        column += 'scheduled_string,';
        values += "'" + scheduled_string + "',";
      }	
			
			if (typeof location !== 'undefined' && location !== "") {
        column += 'location,';
        values += "'" + location + "',";
      }	
			
			if (typeof product_codeable_concept !== 'undefined' && product_codeable_concept !== "") {
        column += 'product_codeable_concept,';
        values += "'" + product_codeable_concept + "',";
      }	
			
			if (typeof product_reference_medication !== 'undefined' && product_reference_medication !== "") {
        column += 'product_reference_medication,';
        values += "'" + product_reference_medication + "',";
      }	
			if (typeof product_reference_substance !== 'undefined' && product_reference_substance !== "") {
        column += 'product_reference_substance,';
        values += "'" + product_reference_substance + "',";
      }	
			
			if (typeof daily_amount !== 'undefined' && daily_amount !== "") {
        column += 'daily_amount,';
        values += " " + daily_amount + ",";
      }	
			
			if (typeof quantity !== 'undefined' && quantity !== "") {
        column += 'quantity,';
        values += " " + quantity + ",";
      }	
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof activity_id !== 'undefined' && activity_id !== "") {
        column += 'activity_id,';
        values += "'" + activity_id + "',";
      }	
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "activity_detail_id = '" + activity_detail_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "activity_detail_id = '" + activity_detail_id + "'";
      }
			
			
			var query = "UPSERT INTO BACIRO_FHIR.CAREPLAN_ACTIVITY_DETAIL(activity_detail_id," + column.slice(0, -1) + ") SELECT activity_detail_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CAREPLAN_ACTIVITY_DETAIL WHERE " + condition;

      var query = "UPSERT INTO BACIRO_FHIR.CAREPLAN_ACTIVITY_DETAIL(activity_detail_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+activity_detail_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select activity_detail_id, category, definition_plan_definition, definition_activity_definition, definition_questionnaire,  code, reason_code, status, status_reason, prohibited, scheduled_timing, scheduled_period_start, scheduled_period_end, scheduled_string, location, product_codeable_concept, product_reference_medication, product_reference_substance, daily_amount, quantity, description, activity_id from baciro_fhir.CAREPLAN_ACTIVITY_DETAIL WHERE activity_detail_id = '" + activity_detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanActivityDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCarePlanActivityDetail"});
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