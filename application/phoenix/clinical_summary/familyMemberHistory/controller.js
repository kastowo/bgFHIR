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
		familyMemberHistory: function getFamilyMemberHistory(req, res){
			var apikey = req.params.apikey;
			var familyMemberHistoryId = req.query._id;
			
			var code = req.query.code;
			var date = req.query.date;
			var definition = req.query.definition;
			var gender = req.query.gender;
			var identifier = req.query.identifier;
			var patient = req.query.patient;
			var relationship = req.query.relationship;
			var status = req.query.status;
			
      //susun query
      var condition = "";
      var join = "";
			
			if(typeof familyMemberHistoryId !== 'undefined' && familyMemberHistoryId !== ""){
        condition += "fmh.FAMILY_MEMBER_HISTORY_ID = '" + familyMemberHistoryId + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
				join += " LEFT JOIN BACIRO_FHIR.FAMILY_MEMBER_HISTORY_CONDITION fmhc on fmh.FAMILY_MEMBER_HISTORY_ID = fmhc.FAMILY_MEMBER_HISTORY_ID ";
        condition += "fmhc.CODE = '" + code + "' AND,";  
      }
			
			if (typeof date !== 'undefined' && date !== "") {
        condition += "fmh.DATE <= to_date('" + date + "', 'yyyy-MM-dd') AND,";
      }
			
			// kurang definition, join ke tabel (PlanDefinition | Questionnaire)
			
			if(typeof gender !== 'undefined' && gender !== ""){
        condition += "fmh.GENDER = '" + gender + "' AND,";  
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on fmh.FAMILY_MEMBER_HISTORY_ID = i.FAMILY_MEMBER_HISTORY_ID ";
        condition += "i.IDENTIFIER_ID = '" + identifier + "' AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "fmh.PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof relationship !== 'undefined' && relationship !== ""){
        condition += "fmh.RELATIONSHIP = '" + relationship + "' AND,";  
      }
			
			if(typeof status !== 'undefined' && status !== ""){
        condition += "fmh.status = '" + status + "' AND,";  
      }
			
			
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrFamilyMemberHistory = [];
      var query = "select family_member_history_id, status, not_done, not_done_reason, patient, date, name, relationship, gender, born_period_start, born_period_end, born_date, born_string, age_age, age_range_low, age_range_high, age_string, estimated_age, deceased_boolean, deceased_age, deceased_range_low, deceased_range_high, deceased_date, deceased_string, reason_code from baciro_fhir.family_member_history fmh " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var FamilyMemberHistory = {};
					FamilyMemberHistory.resourceType = "FamilyMemberHistory";
          FamilyMemberHistory.id = rez[i].care_team_id;
					FamilyMemberHistory.notDone = rez[i].not_done;
					FamilyMemberHistory.notDoneReason = rez[i].not_done_reason;
					if(rez[i].patient != "null"){
						FamilyMemberHistory.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient;
					} else {
						FamilyMemberHistory.patient = "";
					}
					if(rez[i].date == null){
						FamilyMemberHistory.date = formatDate(rez[i].date);
					}else{
						FamilyMemberHistory.date = rez[i].date;
					}
					FamilyMemberHistory.name = rez[i].name;
					FamilyMemberHistory.relationship = rez[i].relationship;
					FamilyMemberHistory.gender = rez[i].patientgender;
					
					FamilyMemberHistory.born.bornPeriod = rez[i].born_period_start + ' to ' + rez[i].born_period_end;
					FamilyMemberHistory.born.bornDate = rez[i].born_date;
					FamilyMemberHistory.born.bornString = rez[i].born_string;
					FamilyMemberHistory.age.ageAge = rez[i].age_age;
					FamilyMemberHistory.age.ageRange = rez[i].age_range_low + ' to ' + rez[i].age_range_high;
					FamilyMemberHistory.age.ageString = rez[i].age_string;
					
					FamilyMemberHistory.estimatedAge = rez[i].estimated_age;
					
					FamilyMemberHistory.deceased_boolean = rez[i].deceased_boolean;
					FamilyMemberHistory.deceased_age = rez[i].deceased_age;
					FamilyMemberHistory.deceased_range = rez[i].deceased_range_low + ' to ' + rez[i].deceased_range_high;
					FamilyMemberHistory.deceased_date = rez[i].deceased_date;
					FamilyMemberHistory.deceased_string = rez[i].deceased_string;
					
					FamilyMemberHistory.reasonCode = rez[i].reason_code;
					
          arrFamilyMemberHistory[i] = FamilyMemberHistory;
        }
        res.json({"err_code":0,"data": arrFamilyMemberHistory});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getFamilyMemberHistory"});
      });
    },
		familyMemberHistoryCondition: function getFamilyMemberHistoryCondition(req, res) {
			var apikey = req.params.apikey;
			
			var familyMemberHistoryConditionId = req.query._id;
			var familyMemberHistoryId = req.query.family_member_history_id;

			//susun query
			var condition = "";

			if (typeof familyMemberHistoryConditionId !== 'undefined' && familyMemberHistoryConditionId !== "") {
				condition += "CONDITION_ID = " + familyMemberHistoryConditionId + " AND ";
			}

			if (typeof familyMemberHistoryId !== 'undefined' && familyMemberHistoryId !== "") {
				condition += "FAMILY_MEMBER_HISTORY_ID = '" + familyMemberHistoryId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrFamilyMemberHistoryCondition = [];
			var query = "select condition_id, code, outcome, onset_age, onset_range_low, onset_range_high, onset_period_start, onset_period_end, onset_string from baciro_fhir.family_member_history_condition " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var FamilyMemberHistoryCondition = {};
					FamilyMemberHistoryCondition.id = rez[i].condition_id;
					FamilyMemberHistoryCondition.code = rez[i].code;
					FamilyMemberHistoryCondition.outcome = rez[i].outcome;
					FamilyMemberHistoryCondition.onset.onsetAge = rez[i].onset_age;
					FamilyMemberHistoryCondition.onset.onsetRange = rez[i].onset_range_low + ' to ' + rez[i].onset_range_high;
					FamilyMemberHistoryCondition.onset.onsetPeriod = rez[i].onset_period_start + ' to ' + rez[i].onset_period_end;
					FamilyMemberHistoryCondition.onset.onsetString = rez[i].onset_string;
				
					arrFamilyMemberHistoryCondition[i] = FamilyMemberHistoryCondition;
				}
				res.json({
					"err_code": 0,
					"data": arrFamilyMemberHistoryCondition
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getFamilyMemberHistoryCondition"
				});
			});
		}
  },
	post: {
		familyMemberHistory: function addFamilyMemberHistory(req, res) {
			console.log(req.body);
			
			var family_member_history_id = req.body.family_member_history_id;
			var status = req.body.status;
			var not_done = req.body.not_done;
			var not_done_reason = req.body.not_done_reason;
			var patient = req.body.patient;
			var date = req.body.date;
			var name = req.body.name;
			var relationship = req.body.relationship;
			var gender = req.body.gender;
			var born_period_start = req.body.born_period_start;
			var born_period_end = req.body.born_period_end;
			var born_date = req.body.born_date;
			var born_string = req.body.born_string;
			var age_age = req.body.age_age;
			var age_range_low = req.body.age_range_low;
			var age_range_high = req.body.age_range_high;
			var age_string = req.body.age_string;
			var estimated_age = req.body.estimated_age;
			var deceased_boolean = req.body.deceased_boolean;
			var deceased_age = req.body.deceased_age;
			var deceased_range_low = req.body.deceased_range_low;
			var deceased_range_high = req.body.deceased_range_high;
			var deceased_date = req.body.deceased_date;
			var deceased_string = req.body.deceased_string;
			var reason_code = req.body.reason_code;
			var adverse_event_id = req.body.adverse_event_id;
			var clinical_impression_id = req.body.clinical_impression_id;

			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof not_done !== 'undefined' && not_done !== "") {
        column += 'not_done,';
        values += "'" + not_done + "',";
      }	
			
			if (typeof not_done_reason !== 'undefined' && not_done_reason !== "") {
        column += 'not_done_reason,';
        values += "'" + not_done_reason + "',";
      }	
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof name !== 'undefined' && name !== "") {
        column += 'name,';
        values += "'" + name + "',";
      }	
			
			if (typeof relationship !== 'undefined' && relationship !== "") {
        column += 'relationship,';
        values += "'" + relationship + "',";
      }	
			
			if (typeof gender !== 'undefined' && gender !== "") {
        column += 'gender,';
        values += "'" + gender + "',";
      }	
			
			if (typeof born_period_start !== 'undefined' && born_period_start !== "") {
        column += 'born_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ born_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof born_period_end !== 'undefined' && born_period_end !== "") {
        column += 'born_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ born_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof born_date !== 'undefined' && born_date !== "") {
        column += 'born_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ born_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof born_string !== 'undefined' && born_string !== "") {
        column += 'born_string,';
        values += "'" + born_string + "',";
      }	
			
			if (typeof age_age !== 'undefined' && age_age !== "") {
        column += 'age_age,';
        values += " " + age_age + ",";
      }
			
			if (typeof age_range_low !== 'undefined' && age_range_low !== "") {
        column += 'age_range_low,';
        values += " " + age_range_low + ",";
      }
			
			if (typeof age_range_high !== 'undefined' && age_range_high !== "") {
        column += 'age_range_high,';
        values += " " + age_range_high + ",";
      }
			
			if (typeof age_string !== 'undefined' && age_string !== "") {
        column += 'age_string,';
        values += "'" + age_string + "',";
      }
			
			if (typeof estimated_age !== 'undefined' && estimated_age !== "") {
        column += 'estimated_age,';
        values += " " + estimated_age + ",";
      }
			
			if (typeof deceased_boolean !== 'undefined' && deceased_boolean !== "") {
        column += 'deceased_boolean,';
        values += " " + deceased_boolean + ",";
      }
			
			if (typeof deceased_range_low !== 'undefined' && deceased_range_low !== "") {
        column += 'deceased_range_low,';
        values += " " + deceased_range_low + ",";
      }
			
			if (typeof deceased_range_high !== 'undefined' && deceased_range_high !== "") {
        column += 'deceased_range_high,';
        values += " " + deceased_range_high + ",";
      }
			
			if (typeof deceased_date !== 'undefined' && deceased_date !== "") {
        column += 'deceased_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ deceased_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof deceased_string !== 'undefined' && deceased_string !== "") {
        column += 'deceased_string,';
        values += "'" + deceased_string + "',";
      }
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }
			
			if (typeof adverse_event_id !== 'undefined' && adverse_event_id !== "") {
        column += 'adverse_event_id,';
        values += "'" + adverse_event_id + "',";
      }
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.family_member_history(care_team_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+family_member_history_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select family_member_history_id, status, not_done, not_done_reason, patient, date, name, relationship, gender, born_period_start, born_period_end, born_date, born_string, age_age, age_range_low, age_range_high, age_string, estimated_age, deceased_boolean, deceased_age, deceased_range_low, deceased_range_high, deceased_date, deceased_string, reason_code from baciro_fhir.family_member_history WHERE family_member_history_id = '" + family_member_history_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addFamilyMemberHistory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addFamilyMemberHistory"});
      });
    },
		familyMemberHistoryCondition: function addFamilyMemberHistoryCondition(req, res) {
			console.log(req.body);
			
			var condition_id = req.body.condition_id;
			var code = req.body.code;
			var outcome = req.body.outcome;
			var onset_age = req.body.onset_age;
			var onset_range_low = req.body.onset_range_low;
			var onset_range_high = req.body.onset_range_high;
			var onset_period_start = req.body.onset_period_start;
			var onset_period_end = req.body.onset_period_end;
			var onset_string = req.body.onset_string;
			var family_member_history_id = req.body.family_member_history_id;
			
			var column = "";
      var values = "";
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }
			
			if (typeof outcome !== 'undefined' && outcome !== "") {
        column += 'outcome,';
        values += "'" + outcome + "',";
      }
			
			if (typeof onset_age !== 'undefined' && onset_age !== "") {
        column += 'onset_age,';
        values += " " + onset_age + ",";
      }
			
			if (typeof onset_range_low !== 'undefined' && onset_range_low !== "") {
        column += 'onset_range_low,';
        values += " " + onset_range_low + ",";
      }
			
			if (typeof onset_range_high !== 'undefined' && onset_range_high !== "") {
        column += 'onset_range_high,';
        values += " " + onset_range_high + ",";
      }	
			
			if (typeof onset_period_start !== 'undefined' && onset_period_start !== "") {
        column += 'onset_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ onset_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof onset_period_end !== 'undefined' && onset_period_end !== "") {
        column += 'onset_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ onset_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof onset_string !== 'undefined' && onset_string !== "") {
        column += 'onset_string,';
        values += "'" + onset_string + "',";
      }	
			
			if (typeof family_member_history_id !== 'undefined' && family_member_history_id !== "") {
        column += 'family_member_history_id,';
        values += "'" + family_member_history_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.family_member_history_condition(condition_id, " + column.slice(0, -1) + ")"+
        " VALUES ("+condition_id+", " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select condition_id, code, outcome, onset_age, onset_range_low, onset_range_high, onset_period_start, onset_period_end, onset_string, family_member_history_id from baciro_fhir.family_member_history_condition WHERE condition_id = " + condition_id + " ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addFamilyMemberHistoryCondition"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addFamilyMemberHistoryCondition"});
      });
    }
	},
	put: {
		familyMemberHistory: function updateFamilyMemberHistory(req, res) {
			console.log(req.body);
			var family_member_history_id = req.params.family_member_history_id;
			var status = req.body.status;
			var not_done = req.body.not_done;
			var not_done_reason = req.body.not_done_reason;
			var patient = req.body.patient;
			var date = req.body.date;
			var name = req.body.name;
			var relationship = req.body.relationship;
			var gender = req.body.gender;
			var born_period_start = req.body.born_period_start;
			var born_period_end = req.body.born_period_end;
			var born_date = req.body.born_date;
			var born_string = req.body.born_string;
			var age_age = req.body.age_age;
			var age_range_low = req.body.age_range_low;
			var age_range_high = req.body.age_range_high;
			var age_string = req.body.age_string;
			var estimated_age = req.body.estimated_age;
			var deceased_boolean = req.body.deceased_boolean;
			var deceased_age = req.body.deceased_age;
			var deceased_range_low = req.body.deceased_range_low;
			var deceased_range_high = req.body.deceased_range_high;
			var deceased_date = req.body.deceased_date;
			var deceased_string = req.body.deceased_string;
			var reason_code = req.body.reason_code;
			var adverse_event_id = req.body.adverse_event_id;
			var clinical_impression_id = req.body.clinical_impression_id;
			
			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof not_done !== 'undefined' && not_done !== "") {
        column += 'not_done,';
        values += "'" + not_done + "',";
      }	
			
			if (typeof not_done_reason !== 'undefined' && not_done_reason !== "") {
        column += 'not_done_reason,';
        values += "'" + not_done_reason + "',";
      }	
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof name !== 'undefined' && name !== "") {
        column += 'name,';
        values += "'" + name + "',";
      }	
			
			if (typeof relationship !== 'undefined' && relationship !== "") {
        column += 'relationship,';
        values += "'" + relationship + "',";
      }	
			
			if (typeof gender !== 'undefined' && gender !== "") {
        column += 'gender,';
        values += "'" + gender + "',";
      }	
			
			if (typeof born_period_start !== 'undefined' && born_period_start !== "") {
        column += 'born_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ born_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof born_period_end !== 'undefined' && born_period_end !== "") {
        column += 'born_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ born_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof born_date !== 'undefined' && born_date !== "") {
        column += 'born_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ born_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof born_string !== 'undefined' && born_string !== "") {
        column += 'born_string,';
        values += "'" + born_string + "',";
      }	
			
			if (typeof age_age !== 'undefined' && age_age !== "") {
        column += 'age_age,';
        values += " " + age_age + ",";
      }
			
			if (typeof age_range_low !== 'undefined' && age_range_low !== "") {
        column += 'age_range_low,';
        values += " " + age_range_low + ",";
      }
			
			if (typeof age_range_high !== 'undefined' && age_range_high !== "") {
        column += 'age_range_high,';
        values += " " + age_range_high + ",";
      }
			
			if (typeof age_string !== 'undefined' && age_string !== "") {
        column += 'age_string,';
        values += "'" + age_string + "',";
      }
			
			if (typeof estimated_age !== 'undefined' && estimated_age !== "") {
        column += 'estimated_age,';
        values += " " + estimated_age + ",";
      }
			
			if (typeof deceased_boolean !== 'undefined' && deceased_boolean !== "") {
        column += 'deceased_boolean,';
        values += " " + deceased_boolean + ",";
      }
			
			if (typeof deceased_range_low !== 'undefined' && deceased_range_low !== "") {
        column += 'deceased_range_low,';
        values += " " + deceased_range_low + ",";
      }
			
			if (typeof deceased_range_high !== 'undefined' && deceased_range_high !== "") {
        column += 'deceased_range_high,';
        values += " " + deceased_range_high + ",";
      }
			
			if (typeof deceased_date !== 'undefined' && deceased_date !== "") {
        column += 'deceased_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ deceased_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof deceased_string !== 'undefined' && deceased_string !== "") {
        column += 'deceased_string,';
        values += "'" + deceased_string + "',";
      }
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }
			
			if (typeof adverse_event_id !== 'undefined' && adverse_event_id !== "") {
        column += 'adverse_event_id,';
        values += "'" + adverse_event_id + "',";
      }
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "family_member_history_id = '" + family_member_history_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.family_member_history(family_member_history_id," + column.slice(0, -1) + ") SELECT family_member_history_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.family_member_history WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select family_member_history_id, status, not_done, not_done_reason, patient, date, name, relationship, gender, born_period_start, born_period_end, born_date, born_string, age_age, age_range_low, age_range_high, age_string, estimated_age, deceased_boolean, deceased_age, deceased_range_low, deceased_range_high, deceased_date, deceased_string, reason_code from baciro_fhir.family_member_history WHERE family_member_history_id = '" + family_member_history_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateFamilyMemberHistory"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateFamilyMemberHistory"});
      });
    },
		familyMemberHistoryCondition: function updateFamilyMemberHistoryCondition(req, res) {
			console.log(req.body);
			var condition_id = req.params.condition_id;
			var code = req.body.code;
			var outcome = req.body.outcome;
			var onset_age = req.body.onset_age;
			var onset_range_low = req.body.onset_range_low;
			var onset_range_high = req.body.onset_range_high;
			var onset_period_start = req.body.onset_period_start;
			var onset_period_end = req.body.onset_period_end;
			var onset_string = req.body.onset_string;
			var family_member_history_id = req.body.family_member_history_id;
			
			var column = "";
      var values = "";
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }
			
			if (typeof outcome !== 'undefined' && outcome !== "") {
        column += 'outcome,';
        values += "'" + outcome + "',";
      }
			
			if (typeof onset_age !== 'undefined' && onset_age !== "") {
        column += 'onset_age,';
        values += " " + onset_age + ",";
      }
			
			if (typeof onset_range_low !== 'undefined' && onset_range_low !== "") {
        column += 'onset_range_low,';
        values += " " + onset_range_low + ",";
      }
			
			if (typeof onset_range_high !== 'undefined' && onset_range_high !== "") {
        column += 'onset_range_high,';
        values += " " + onset_range_high + ",";
      }	
			
			if (typeof onset_period_start !== 'undefined' && onset_period_start !== "") {
        column += 'onset_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ onset_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof onset_period_end !== 'undefined' && onset_period_end !== "") {
        column += 'onset_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ onset_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof onset_string !== 'undefined' && onset_string !== "") {
        column += 'onset_string,';
        values += "'" + onset_string + "',";
      }	
			
			if (typeof family_member_history_id !== 'undefined' && family_member_history_id !== "") {
        column += 'family_member_history_id,';
        values += "'" + family_member_history_id + "',";
      }	


     
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "condition_id = " + condition_id + " AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.family_member_history_condition(condition_id," + column.slice(0, -1) + ") SELECT condition_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.family_member_history_condition WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select condition_id, code, outcome, onset_age, onset_range_low, onset_range_high, onset_period_start, onset_period_end, onset_string, family_member_history_id from baciro_fhir.family_member_history_condition WHERE condition_id = " + condition_id + " ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateFamilyMemberHistoryCondition"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateFamilyMemberHistoryCondition"});
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