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
			
			if(typeof status !== 'undefined' && status !== ""){
        condition += "cp.status = '" + status + "' AND,";  
      }
			
			if(typeof subject !== 'undefined' && subject !== ""){
				condition += "(cp.SUBJECT_PATIENT = '" + subject + "' OR cp.SUBJECT_GROUP = '" + subject + "') AND,";  
			}
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrCarePlan = [];
      var query = "select careplan_id, based_on, replaces, part_of, status, intent, category, title, description, subject_patient, subject_group, context_encounter, context_episode_of_care, period_start, period_end, supporting_info from baciro_fhir.CAREPLAN cp " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var CarePlan = {};
					CarePlan.resourceType = "CarePlan";
          CarePlan.id = rez[i].careplan_id;
					CarePlan.based_on = rez[i].based_on;
					CarePlan.replaces = rez[i].replaces;
					CarePlan.part_of = rez[i].part_of;
					CarePlan.status = rez[i].status;
					CarePlan.intent = rez[i].intent;
					CarePlan.category = rez[i].category;
					CarePlan.title = rez[i].title;
					CarePlan.description = rez[i].description;
					if (rez[i].subject_group !== 'null') {
						CarePlan.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Group?_id=' +  rez[i].subject_group;
					} else if (rez[i].subject_patient !== 'null') {
						CarePlan.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subject_patient;
					} else {
						CarePlan.subject = "";
					}
					if (rez[i].context_encounter !== 'null') {
						CarePlan.context = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].context_encounter;
					} else if (rez[i].context_episode_of_care !== 'null') {
						CarePlan.context = hostFHIR + ':' + portFHIR + '/' + apikey + '/EpisodeOfCare?_id=' +  rez[i].context_episode_of_care;
					} else {
						CarePlan.context = "";
					}
					CarePlan.period = rez[i].period_start + ' to ' + rez[i].period_end;
					//kurang careTeam (ID careplan belum ada di tabel careTeam)
					//kurang address (ID careplan belum ada di tabel address)
					CarePlan.supportingInfo = rez[i].supporting_info;
					//kurang goal (ID careplan belum ada di tabel goal)
					//kurang note
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
				condition += "CAREPLAN_ACTIVITY_ID = '" + carePlanActivityId + "' AND ";
			}

			if (typeof carePlanId !== 'undefined' && carePlanId !== "") {
				condition += "CAREPLAN_ID = '" + carePlanId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrCarePlanActivity = [];
			var query = "select careplan_activity_id, outcome_codeable_concept, outcome_reference, progress, reference_appointment, reference_communication_request, reference_device_request, reference_medication_request, reference_nutrition_order, reference_task, reference_procedure_request, reference_referral_request, reference_vision_prescription, reference_request_group, activity_detail_id, category, definition_plan_definition, definition_activity_definition, definition_questionnaire, code, reason_code, status, status_reason, prohibited, scheduled_timing, scheduled_period_start, scheduled_period_end, scheduled_string, location, product_codeable_concept, product_reference_medication, product_reference_substance, daily_amount, quantity, description from baciro_fhir.careplan_activity ca left join baciro_fhir.careplan_activity_detail cd on ca.careplan_activity_id  = cd.activity_id " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var CarePlanActivity = {};
					CarePlanActivity.id = rez[i].careplan_activity_id;
					CarePlanActivity.outcomeCodeableConcept = rez[i].outcome_codeable_concept;
					CarePlanActivity.outcomeReference = rez[i].outcome_reference;
					CarePlanActivity.progress = rez[i].progress;
					if (rez[i].reference_appointment == null) {
						CarePlanActivity.reference =  hostFHIR + ':' + portFHIR + '/' + apikey + '/Appointment?_id=' + rez[i].reference_appointment;
					} else if (rez[i].reference_communication_request == null) {
						CarePlanActivity.reference = hostFHIR + ':' + portFHIR + '/' + apikey + '/CommunicationRequest?_id=' + rez[i].reference_communication_request;
					} else if (rez[i].reference_device_request == null) {
						CarePlanActivity.reference = hostFHIR + ':' + portFHIR + '/' + apikey + '/DeviceRequest?_id=' + rez[i].reference_device_request;
					} else if (rez[i].reference_medication_request == null) {
						CarePlanActivity.reference = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationRequest?_id=' + rez[i].reference_medication_request;
					} else if (rez[i].reference_nutrition_order == null) {
						CarePlanActivity.reference = hostFHIR + ':' + portFHIR + '/' + apikey + '/NutritionOrder?_id=' + rez[i].reference_nutrition_order;
					} else if (rez[i].reference_task == null) {
						CarePlanActivity.reference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Task?_id=' + rez[i].reference_task;
					} else if (rez[i].reference_procedure_request == null) {
						CarePlanActivity.reference = hostFHIR + ':' + portFHIR + '/' + apikey + '/ProcedureRequest?_id=' + rez[i].reference_procedure_request;
					} else if (rez[i].reference_referral_request == null) {
						CarePlanActivity.reference = hostFHIR + ':' + portFHIR + '/' + apikey + '/ReferralRequest?_id=' + rez[i].reference_referral_request;
					} else if (rez[i].reference_vision_prescription == null) {
						CarePlanActivity.reference = hostFHIR + ':' + portFHIR + '/' + apikey + '/VisionPrescription?_id=' + rez[i].reference_vision_prescription;
					} else if (rez[i].reference_request_group == null) {
						CarePlanActivity.reference = hostFHIR + ':' + portFHIR + '/' + apikey + '/RequestGroup?_id=' + rez[i].reference_request_group;
					} else {
						CarePlanActivity.reference = "";
					}
					CarePlanActivity.detail.id = rez[i].activity_detail_id;
					CarePlanActivity.detail.category = rez[i].category;
					if (rez[i].definition_plan_definition == null) {
						CarePlanActivity.detail.definition = hostFHIR + ':' + portFHIR + '/' + apikey + '/PlanDefinition?_id=' + rez[i].definition_plan_definition;
					} else if (rez[i].definition_activity_definition == null) {
						CarePlanActivity.detail.definition = hostFHIR + ':' + portFHIR + '/' + apikey + '/ActivityDefinition?_id=' + rez[i].definition_activity_definition;
					} else if (rez[i].definition_questionnaire == null) {
						CarePlanActivity.detail.definition = hostFHIR + ':' + portFHIR + '/' + apikey + '/Questionnaire?_id=' + rez[i].definition_questionnaire;
					} else {
						CarePlanActivity.detail.definition = "";
					}
					CarePlanActivity.detail.code = rez[i].code;
					CarePlanActivity.detail.reasonCode = rez[i].reason_code;
					CarePlanActivity.detail.status = rez[i].status;
					CarePlanActivity.detail.statusReason = rez[i].status_reason;
					CarePlanActivity.detail.prohibited = rez[i].prohibited;
					CarePlanActivity.detail.scheduled.scheduledTiming = rez[i].scheduled_timing;
					CarePlanActivity.detail.scheduled.scheduledPeriod = formatDate(rez[i].scheduled_period_start) + " to " + formatDate(rez[i].scheduled_period_end);
					CarePlanActivity.detail.scheduled.scheduledString = rez[i].scheduled_string;
					CarePlanActivity.detail.location = rez[i].location;
					// kurang performer, carePlanActivityDetail belum ada di tabel reference
					CarePlanActivity.detail.product.productCodeableConcept = rez[i].product_codeable_concept;
					if (rez[i].product_reference_medication == null) {
						CarePlanActivity.detail.product.productReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' + rez[i].product_reference_medication;
					} else if (rez[i].product_reference_substance == null) {
						CarePlanActivity.detail.product.productReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Substance?_id=' + rez[i].product_reference_substance;
					} else {
						CarePlanActivity.detail.product.productReference = "";
					}
					
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
		}
		
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
        values += "'" + prohibited + "',";
      }	
			
			if (typeof scheduled_timing !== 'undefined' && scheduled_timing !== "") {
        column += 'scheduled_timing,';
        //values += "'" + date + "',";
				values += "to_date('"+ scheduled_timing + "', 'yyyy-MM-dd'),";
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
			var careplan_id  = req.params.careplan_id;
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
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "careplan_id = '" + careplan_id + "' AND " + fieldResource + " = '" + valueResource + "'";

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
			var careplan_activity_id  = req.params.careplan_activity_id;
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
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "careplan_activity_id = '" + careplan_activity_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
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
			var activity_detail_id  = req.params.activity_detail_id;
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
			
			if (typeof scheduled_timing !== 'undefined' && scheduled_timing !== "") {
        column += 'scheduled_timing,';
        //values += "'" + date + "',";
				values += "to_date('"+ scheduled_timing + "', 'yyyy-MM-dd'),";
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
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "careplan_activity_id = '" + careplan_activity_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
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