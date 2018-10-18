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
		goal: function getGoal(req, res){
			var apikey = req.params.apikey;
			var goalId = req.query._id;
			var category = req.query.category;
			var identifier = req.query.identifier;
			var patient = req.query.patient;
			var start_date = req.query.start_date;
			var status = req.query.status;
			var subject = req.query.subject;
			var target_date = req.query.target_date;
			
      //susun query
      var condition = "";
      var join = "";
			
			if(typeof goalId !== 'undefined' && goalId !== ""){
        condition += "go.GOAL_ID = '" + goalId + "' AND,";  
      }
			
			if(typeof category !== 'undefined' && category !== ""){
        condition += "go.category = '" + category + "' AND,";  
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on go.GOAL_ID = i.GOAL_ID ";
        condition += "i.IDENTIFIER_ID = '" + identifier + "' AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "go.SUBJECT_PATIENT = '" + patient + "' AND,";  
      }
			
			if (typeof start_date !== 'undefined' && start_date !== "") {
        condition += "go.START_DATE <= to_date('" + start_date + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof status !== 'undefined' && status !== ""){
        condition += "ct.STATUS = '" + status + "' AND,";  
      }
			
			if(typeof subject !== 'subject' && subject !== ""){
				condition += "(go.SUBJECT_PATIENT = '" + subject + "' OR go.SUBJECT_GROUP = '" + subject + "' OR go.SUBJECT_ORGANIZATION = '" + subject + "') AND,";  
			}
			
			if (typeof target_date !== 'undefined' && target_date !== "") {
				join += " LEFT JOIN BACIRO_FHIR.GOAL_TARGET gt on go.GOAL_ID = gt.GOAL_ID ";
        condition += "gt.DUE_DATE <= to_date('" + target_date + "', 'yyyy-MM-dd') AND,";
      }
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrGoal = [];
      var query = "select goal_id, status, category, priority, description, subject_patient, subject_group, subject_organization, start_date, start_codeable_concept, status_date, status_reason, expressed_by_patient, expressed_by_practitioner, expressed_by_related_person, outcome_code from baciro_fhir.goal go " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Goal = {};
					Goal.resourceType = "Goal";
          Goal.id = rez[i].care_team_id;
					Goal.status = rez[i].status;
					Goal.category = rez[i].category;
					Goal.priority = rez[i].priority;
					Goal.description = rez[i].description;
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
					if(rez[i].subject_organization != "null"){
						Subject.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].subject_organization;
					} else {
						Subject.organization = "";
					}
					arrSubject[i] = Subject;
					Goal.subject = arrSubject;
					if(rez[i].start_date == null){
						Goal.start.startDate = formatDate(rez[i].start_date);
					}else{
						Goal.start.startDate = rez[i].start_date;
					}
					Goal.start.startCodeableConcept = rez[i].start_codeable_concept;
					if(rez[i].status_date == null){
						Goal.statusDate = formatDate(rez[i].status_date);
					}else{
						Goal.statusDate = rez[i].status_date;
					}
					Goal.statusReason = rez[i].status_reason;var arrSubject = [];
					var arrExpressedBy = [];
					var ExpressedBy = {};
					if(rez[i].expressed_by_practitioner != "null"){
						ExpressedBy.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].expressed_by_practitioner;
					} else {
						ExpressedBy.practitioner = "";
					}
					if(rez[i].expressed_by_patient != "null"){
						ExpressedBy.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].expressed_by_patient;
					} else {
						ExpressedBy.patient = "";
					}
					if(rez[i].expressed_by_related_person != "null"){
						ExpressedBy.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].expressed_by_related_person;
					} else {
						ExpressedBy.relatedPerson = "";
					}
					arrExpressedBy[i] = ExpressedBy;
					Goal.expressedBy = arrExpressedBy;
					Goal.outcomeCode = rez[i].outcome_code;
					
					
					
          arrGoal[i] = Goal;
        }
        res.json({"err_code":0,"data": arrGoal});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getGoal"});
      });
    },
		goalTarget: function getGoalTarget(req, res) {
			var apikey = req.params.apikey;
			
			var goalTargetId = req.query._id;
			var goalId = req.query.goal_id;

			//susun query
			var condition = "";

			if (typeof goalTargetId !== 'undefined' && goalTargetId !== "") {
				condition += "TARGET_ID = '" + goalTargetId + "' AND ";
			}

			if (typeof goalId !== 'undefined' && goalId !== "") {
				condition += "GOAL_ID = '" + goalId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrGoalTarget = [];
			var query = "select target_id, measure, detail_quantity, detail_range_low, detail_range_high, detail_codeable_concept, due_date, due_duration, goal_id from baciro_fhir.goal_target " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var GoalTarget = {};
					GoalTarget.id = rez[i].participant_id;
					GoalTarget.measure = rez[i].measure;
					GoalTarget.detail.detailQuantity = rez[i].quantity;
					GoalTarget.detail.detailRange = rez[i].detail_range_low + " to " + rez[i].detail_range_high;
					GoalTarget.detail.detailCodeableConcept = rez[i].detail_codeable_concept;
					if(rez[i].due_date == null){
						GoalTarget.due.dueDate = formatDate(rez[i].due_date);
					}else{
						GoalTarget.due.dueDate = rez[i].due_date;
					}
					GoalTarget.due.dueDuration = rez[i].due_duration;
					arrGoalTarget[i] = GoalTarget;
				}
				res.json({
					"err_code": 0,
					"data": arrGoalTarget
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getGoalTarget"
				});
			});
		}
		
  },
	post: {
		goal: function addGoal(req, res) {
			console.log(req.body);
			
			var goal_id = req.body.goal_id;
			var status = req.body.status;
			var category = req.body.category;
			var priority = req.body.priority;
			var description = req.body.description;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var subject_organization = req.body.subject_organization;
			var start_date = req.body.start_date;
			var start_codeable_concept = req.body.start_codeable_concept;
			var status_date = req.body.status_date;
			var status_reason = req.body.status_reason;
			var expressed_by_patient = req.body.expressed_by_patient;
			var expressed_by_practitioner = req.body.expressed_by_practitioner;
			var expressed_by_related_person = req.body.expressed_by_related_person;
			var outcome_code = req.body.outcome_code;
			var care_plan_id = req.body.care_plan_id;
			var care_plan_activity_detail_id = req.body.care_plan_activity_detail_id;

			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }	
			
			if (typeof priority !== 'undefined' && priority !== "") {
        column += 'priority,';
        values += "'" + priority + "',";
      }	
			
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }	
			
			if (typeof subject_group !== 'undefined' && subject_group !== "") {
        column += 'subject_group,';
        values += "'" + subject_group + "',";
      }	
			
			if (typeof subject_organization !== 'undefined' && subject_organization !== "") {
        column += 'subject_organization,';
        values += "'" + subject_organization + "',";
      }	
			
			if (typeof start_codeable_concept !== 'undefined' && start_codeable_concept !== "") {
        column += 'start_codeable_concept,';
        values += "'" + start_codeable_concept + "',";
      }	
			
			if (typeof status_reason !== 'undefined' && status_reason !== "") {
        column += 'status_reason,';
        values += "'" + status_reason + "',";
      }	
			
			if (typeof start_date !== 'undefined' && start_date !== "") {
        column += 'start_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ start_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof status_date !== 'undefined' && status_date !== "") {
        column += 'status_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ status_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof expressed_by_patient !== 'undefined' && expressed_by_patient !== "") {
        column += 'expressed_by_patient,';
        values += "'" + expressed_by_patient + "',";
      }	
			
			if (typeof expressed_by_practitioner !== 'undefined' && expressed_by_practitioner !== "") {
        column += 'expressed_by_practitioner,';
        values += "'" + expressed_by_practitioner + "',";
      }	
			
			if (typeof expressed_by_related_person !== 'undefined' && expressed_by_related_person !== "") {
        column += 'expressed_by_related_person,';
        values += "'" + expressed_by_related_person + "',";
      }	
			
			if (typeof outcome_code !== 'undefined' && outcome_code !== "") {
        column += 'outcome_code,';
        values += "'" + outcome_code + "',";
      }	
			
			if (typeof care_plan_id !== 'undefined' && care_plan_id !== "") {
        column += 'care_plan_id,';
        values += "'" + care_plan_id + "',";
      }	
			
			if (typeof care_plan_activity_detail_id !== 'undefined' && care_plan_activity_detail_id !== "") {
        column += 'care_plan_activity_detail_id,';
        values += "'" + care_plan_activity_detail_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.GOAL(goal_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+goal_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select goal_id, status, category, priority, description, subject_patient, subject_group, subject_organization, start_date, start_codeable_concept, status_date, status_reason, expressed_by_patient, expressed_by_practitioner, expressed_by_related_person, outcome_code from baciro_fhir.goal WHERE goal_id = '" + goal_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addGoal"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addGoal"});
      });
    },
		goalTarget: function addGoalTarget(req, res) {
			console.log(req.body);
			var target_id  = req.body.target_id;
			var measure = req.body.measure;
			var detail_quantity = req.body.detail_quantity;
			var detail_range_low = req.body.detail_range_low;
			var detail_range_high = req.body.detail_range_high;
			var detail_codeable_concept = req.body.detail_codeable_concept;
			var due_date = req.body.due_date;
			var due_duration = req.body.due_duration;
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
			
			if (typeof due_date !== 'undefined' && due_date !== "") {
        column += 'due_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ due_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof due_duration !== 'undefined' && due_duration !== "") {
        column += 'due_duration,';
        values += "'" + due_duration + "',";
      }	
			
			if (typeof goal_id !== 'undefined' && goal_id !== "") {
        column += 'goal_id,';
        values += "'" + goal_id + "',";
      }	

     
      var query = "UPSERT INTO BACIRO_FHIR.goal_target(target_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+target_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select target_id, measure, detail_range_low, detail_range_high, detail_codeable_concept, due_date, due_duration, goal_id from baciro_fhir.goal_target WHERE target_id = '" + target_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addGoalTarget"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addGoalTarget"});
      });
    }
		
	},
	put: {
		goal: function updateGoal(req, res) {
			console.log(req.body);
			var goal_id = req.params.goal_id;
			var status = req.body.status;
			var category = req.body.category;
			var priority = req.body.priority;
			var description = req.body.description;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var subject_organization = req.body.subject_organization;
			var start_date = req.body.start_date;
			var start_codeable_concept = req.body.start_codeable_concept;
			var status_date = req.body.status_date;
			var status_reason = req.body.status_reason;
			var expressed_by_patient = req.body.expressed_by_patient;
			var expressed_by_practitioner = req.body.expressed_by_practitioner;
			var expressed_by_related_person = req.body.expressed_by_related_person;
			var outcome_code = req.body.outcome_code;
			var care_plan_id = req.body.care_plan_id;
			var care_plan_activity_detail_id = req.body.care_plan_activity_detail_id;
			
			
			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }	
			
			if (typeof priority !== 'undefined' && priority !== "") {
        column += 'priority,';
        values += "'" + priority + "',";
      }	
			
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }	
			
			if (typeof subject_group !== 'undefined' && subject_group !== "") {
        column += 'subject_group,';
        values += "'" + subject_group + "',";
      }	
			
			if (typeof subject_organization !== 'undefined' && subject_organization !== "") {
        column += 'subject_organization,';
        values += "'" + subject_organization + "',";
      }	
			
			if (typeof start_codeable_concept !== 'undefined' && start_codeable_concept !== "") {
        column += 'start_codeable_concept,';
        values += "'" + start_codeable_concept + "',";
      }	
			
			if (typeof status_reason !== 'undefined' && status_reason !== "") {
        column += 'status_reason,';
        values += "'" + status_reason + "',";
      }	
			
			if (typeof start_date !== 'undefined' && start_date !== "") {
        column += 'start_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ start_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof status_date !== 'undefined' && status_date !== "") {
        column += 'status_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ status_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof expressed_by_patient !== 'undefined' && expressed_by_patient !== "") {
        column += 'expressed_by_patient,';
        values += "'" + expressed_by_patient + "',";
      }	
			
			if (typeof expressed_by_practitioner !== 'undefined' && expressed_by_practitioner !== "") {
        column += 'expressed_by_practitioner,';
        values += "'" + expressed_by_practitioner + "',";
      }	
			
			if (typeof expressed_by_related_person !== 'undefined' && expressed_by_related_person !== "") {
        column += 'expressed_by_related_person,';
        values += "'" + expressed_by_related_person + "',";
      }	
			
			if (typeof outcome_code !== 'undefined' && outcome_code !== "") {
        column += 'outcome_code,';
        values += "'" + outcome_code + "',";
      }	
			
			if (typeof care_plan_id !== 'undefined' && care_plan_id !== "") {
        column += 'care_plan_id,';
        values += "'" + care_plan_id + "',";
      }	
			
			if (typeof care_plan_activity_detail_id !== 'undefined' && care_plan_activity_detail_id !== "") {
        column += 'care_plan_activity_detail_id,';
        values += "'" + care_plan_activity_detail_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.GOAL(goal_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+goal_id+"', " + values.slice(0, -1) + ")";
				
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "goal_id = '" + goal_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.goal(goal_id," + column.slice(0, -1) + ") SELECT goal_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.goal WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select goal_id, status, category, priority, description, subject_patient, subject_group, subject_organization, start_date, start_codeable_concept, status_date, status_reason, expressed_by_patient, expressed_by_practitioner, expressed_by_related_person, outcome_code from baciro_fhir.goal WHERE goal_id = '" + goal_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateGoal"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateGoal"});
      });
    },
		goalTarget: function updateGoalTarget(req, res) {
			console.log(req.body);
			
			var target_id  = req.params.target_id;
			var measure = req.body.measure;
			var detail_quantity= req.body.detail_quantity;
			var detail_range_low = req.body.detail_range_low;
			var detail_range_high = req.body.detail_range_high;
			var detail_codeable_concept = req.body.detail_codeable_concept;
			var due_date = req.body.due_date;
			var due_duration = req.body.due_duration;
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
			
			if (typeof due_date !== 'undefined' && due_date !== "") {
        column += 'due_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ due_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof due_duration !== 'undefined' && due_duration !== "") {
        column += 'due_duration,';
        values += "'" + due_duration + "',";
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
			
			var query = "UPSERT INTO BACIRO_FHIR.goal_target(target_id," + column.slice(0, -1) + ") SELECT target_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.goal_target WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select target_id, measure, detail_range_low, detail_range_high, detail_codeable_concept, due_date, due_duration, goal_id from baciro_fhir.goal_target WHERE target_id = '" + target_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateGoalTarget"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateGoalTarget"});
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