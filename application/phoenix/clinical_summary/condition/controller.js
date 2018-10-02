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
		condition: function getCondition(req, res){
			var apikey = req.params.apikey;
			var conditionId = req.query._id;
			var abatement_age = req.query.abatement_age;
			var abatement_boolean = req.query.abatement_boolean;
			var abatement_date = req.query.abatement_date;
			var abatement_string = req.query.abatement_string;
			var asserted_date = req.query.asserted_date;
			var asserter = req.query.asserter;
			var body_site = req.query.body_site;
			var category = req.query.category;
			var clinical_status = req.query.clinical_status;
			var code = req.query.code;
			var context = req.query.context;
			var encounter = req.query.encounter;
			var evidence = req.query.evidence;
			var evidence_detail = req.query.evidence_detail;
			var identifier = req.query.identifier;
			var onset_age = req.query.onset_age;
			var onset_date = req.query.onset_date;
			var onset_info = req.query.onset_info;
			var patient = req.query.patient;
			var severity = req.query.severity;
			var stage = req.query.stage;
			var subject = req.query.subject;
			var verification_status = req.query.verification_status;
			
      //susun query
      var condition = "";
      var join = "";
			
			if(typeof conditionId !== 'undefined' && conditionId !== ""){
        condition += "cd.CONDITION_ID = '" + conditionId + "' AND,";  
      }
			
			if(typeof abatement_age !== 'undefined' && abatement_age !== ""){
        condition += "cd.ABATEMENT_AGE = " + abatement_age + " AND,";  
      }
			
			if(typeof abatement_boolean !== 'undefined' && abatement_boolean !== ""){
        condition += "cd.ABATEMENT_BOOLEAN = " + abatement_boolean + " AND,";  
      }
			
			if (typeof abatement_date !== 'undefined' && abatement_date !== "") {
        condition += "cd.ABATEMENT_PERIOD_START <= to_date('" + abatement_date + "', 'yyyy-MM-dd') AND cd.ABATEMENT_PERIOD_END >= to_date('" + abatement_date + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof abatement_string !== 'undefined' && abatement_string !== ""){
        condition += "cd.ABATEMENT_STRING = '" + abatement_string + "' AND,";  
      }
			
			if (typeof asserted_date !== 'undefined' && asserted_date !== "") {
        condition += "cd.ASSERTED_DATE = to_date('" + asserted_date + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof asserter !== 'undefined' && asserter !== ""){
				condition += "(cd.ASSERTER_PRACTITIONER = '" + asserter + "' OR cd.ASSERTER_PATIENT = '" + asserter + "' OR cd.ASSERTER_RELATED_PERSON = '" + asserter + "') AND,";  
			}
			
			if(typeof body_site !== 'undefined' && body_site !== ""){
        condition += "cd.BODY_SITE = '" + body_site + "' AND,";  
      }
			
			if(typeof category !== 'undefined' && category !== ""){
        condition += "cd.category = '" + category + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
        condition += "cd.code = '" + code + "' AND,";  
      }
			
			if(typeof clinical_status !== 'undefined' && clinical_status !== ""){
        condition += "cd.clinical_status = '" + clinical_status + "' AND,";  
      }
			
			if(typeof context !== 'undefined' && context !== ""){
				condition += "(cd.CONTEXT_ENCOUNTER = '" + context + "' OR cd.CONTEXT_EPISODE_OF_CARE = '" + context + "') AND,";  
			}
			
			if(typeof encounter !== 'undefined' && encounter !== ""){
        condition += "ct.CONTEXT_ENCOUNTER = '" + encounter + "' AND,";  
      }
			
			if((typeof evidence !== 'undefined' && evidence !== "") || (typeof evidence_detail !== 'undefined' && evidence_detail !== "")){
				join += " LEFT JOIN BACIRO_FHIR.CONDITION_EVIDENCE ce on cd.CONDITION_ID = ce.CONDITION_ID ";
        if(typeof evidence !== 'undefined' && evidence !== ""){
					condition += "ce.code = '" + evidence + "' AND,";  	
				}
				
				if(typeof evidence_detail !== 'undefined' && evidence_detail !== ""){
					condition += "ce.detail = '" + evidence_detail + "' AND,";  	
				}
				
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on cd.CONDITION_ID = i.CONDITION_ID ";
        condition += "i.IDENTIFIER_ID = '" + identifier + "' AND,";  
      }
			
			if(typeof onset_age !== 'undefined' && onset_age !== ""){
        condition += "cd.ONSET_AGE = " + onset_age + " AND,";  
      }
			
			if (typeof onset_date !== 'undefined' && onset_date !== "") {
        condition += "cd.ONSET_PERIOD_START <= to_date('" + onset_date + "', 'yyyy-MM-dd') AND cd.ONSET_PERIOD_END >= to_date('" + onset_date + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof onset_info !== 'undefined' && onset_info !== ""){
        condition += "cd.ONSET_STRING = '" + onset_info + "' AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "cd.SUBJECT_PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof severity !== 'undefined' && severity !== ""){
        condition += "cd.SEVERITY = '" + severity + "' AND,";  
      }
			
			if(typeof stage !== 'undefined' && stage !== ""){
				join += " LEFT JOIN BACIRO_FHIR.CONDITION_STAGES cs on cd.CONDITION_ID = cs.CONDITION_ID ";
        condition += "cs.SUMMARY = '" + stage + "' AND,";  
      }
			
			if(typeof verification_status !== 'undefined' && verification_status !== ""){
				condition += "cd.VERIFICATION_STATUS = '" + verification_status + "' AND,";  
      }
			
			if(typeof subject !== 'subject' && subject !== ""){
				condition += "(cd.SUBJECT_PATIENT = '" + subject + "' OR cd.SUBJECT_GROUP = '" + subject + "') AND,";  
			}
			
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrCondition = [];
      var query = "select  condition_id, clinical_status, verification_status, category, severity, code, body_site, subject_patient, subject_group, context_encounter, context_episode_of_care, onset_date_time, onset_age, onset_period_start, onset_period_end, onset_range_low, onset_range_high, onset_string, abatement_date_time, abatement_age, abatement_boolean, abatement_period_start, abatement_period_end, abatement_range_low, abatement_range_high, abatement_string, asserted_date, asserter_practitioner, asserter_patient, asserter_related_person from baciro_fhir.condition cd " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Condition = {};
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
					
					Condition.resourceType = "Condition";
          Condition.id = rez[i].condition_id;
					Condition.clinicalStatus = rez[i].clinical_status;
					Condition.verificationStatus = rez[i].verification_status;
					Condition.category = rez[i].category;
					Condition.severity = rez[i].severity;
					Condition.code = rez[i].code;
					Condition.body_site = rez[i].body_site;
					
					Condition.subject = arrSubject;
					Condition.context = arrContext;
					if(rez[i].onset_date_time == null){
						Condition.onset.onsetDateTime = formatDate(rez[i].onset_date_time);
					}else{
						Condition.onset.onsetDateTime = rez[i].onset_date_time;
					}
					
					Condition.onset.onsetAge = rez[i].onset_age;
					var onsetperiod_start,onsetperiod_end;
					if(rez[i].onset_period_start == null){
						onsetperiod_start = formatDate(rez[i].onset_period_start);  
					}else{
						onsetperiod_start = rez[i].onset_period_start;  
					}
					if(rez[i].onset_period_end == null){
						onsetperiod_end = formatDate(rez[i].onset_period_end);  
					}else{
						onsetperiod_end = rez[i].onset_period_end;  
					}
					Condition.onset.onsetPeriod = onsetperiod_start + ' to ' + onsetperiod_end;
					Condition.onset.onsetRange = rez[i].onset_range_low + ' to ' + rez[i].onset_range_high;
					Condition.onset.onsetString = rez[i].onset_string;
					if(rez[i].abatement_date_time == null){
						Condition.abatement.abatementDateTime = formatDate(rez[i].abatement_date_time);
					}else{
						Condition.abatement.abatementDateTime = rez[i].abatement_date_time;
					}
					
					Condition.abatement.abatementAge = rez[i].abatement_age;
					Condition.abatement.abatementBoolean = rez[i].abatement_boolean;
					var abatementperiod_start,abatementperiod_end;
					if(rez[i].abatement_period_start == null){
						abatementperiod_start = formatDate(rez[i].abatement_period_start);  
					}else{
						abatementperiod_start = rez[i].abatement_period_start;  
					}
					if(rez[i].abatement_period_end == null){
						abatementperiod_end = formatDate(rez[i].abatement_period_end);  
					}else{
						abatementperiod_end = rez[i].abatement_period_end;  
					}
					Condition.abatement.abatementPeriod = abatementperiod_start + ' to ' + abatementperiod_end;
					Condition.abatement.abatementRange = rez[i].abatement_range_low + ' to ' + rez[i].abatement_range_high;
					Condition.abatement.abatementString = rez[i].abatement_string;
					if(rez[i].asserted_date == null){
						Condition.assertedDate = formatDate(rez[i].asserted_date);
					}else{
						Condition.assertedDate = rez[i].asserted_date;
					}
					var arrAsserter = [];
					var Asserter = {};
					if(rez[i].asserter_practitioner != "null"){
						Asserter.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].asserter_practitioner;
					} else {
						Asserter.practitioner = "";
					}
					if(rez[i].asserter_patient != "null"){
						Asserter.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].asserter_patient;
					} else {
						Asserter.patient = "";
					}
					if(rez[i].asserter_related_person != "null"){
						Asserter.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].asserter_related_person;
					} else {
						Asserter.relatedPerson = "";
					}
					arrAsserter[i] = Asserter;
					Condition.asserter = arrAsserter;
          arrCondition[i] = Condition;
        }
        res.json({"err_code":0,"data": arrCondition});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getCondition"});
      });
    },
		conditionStages: function getConditionStages(req, res) {
			var apikey = req.params.apikey;
			
			var conditionStagesId = req.query._id;
			var conditionId = req.query.condition_id;

			//susun query
			var condition = "";

			if (typeof conditionStagesId !== 'undefined' && conditionStagesId !== "") {
				condition += "STAGE_ID = '" + conditionStagesId + "' AND ";
			}

			if (typeof conditionId !== 'undefined' && conditionId !== "") {
				condition += "CONDITION_ID = '" + conditionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrConditionStages = [];
			var query = "select stage_id, summary from baciro_fhir.condition_stages " + fixCondition;
			/*var query = "select stage_id, summary from baciro_fhir.condition_stages cs left join baciro_fhir.CLINICAL_IMPRESSION ci on cs.CONDITION_ID = ci.CONDITION_ID left join baciro_fhir.DIAGNOSTIC_REPORT dr on cs.CONDITION_ID = dr.CONDITION_ID  " + fixCondition;*/

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ConditionStages = {};
					ConditionStages.id = rez[i].stage_id;
					ConditionStages.summary = rez[i].summary;
					/*if (rez[i].member_practitioner == null) {
						ConditionStages.member = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].member_practitioner;
					} else if (rez[i].member_related_person == null) {
						ConditionStages.member = hostFHIR + ':' + portFHIR + '/' + apikey + '/Person?_id=' + rez[i].member_related_person;
					} else if (rez[i].member_patient == null) {
						ConditionStages.member =  hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +rez[i].member_patient;
					} else if (rez[i].member_organization == null) {
						ConditionStages.member =  hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' + rez[i].member_organization;
					} else if (rez[i].member_care_team == null) {
						ConditionStages.member =  hostFHIR + ':' + portFHIR + '/' + apikey + '/Condition?_id=' + rez[i].member_care_team;
					} else {
						ConditionStages.member = "";
					}*/
					
					
					arrConditionStages[i] = ConditionStages;
				}
				res.json({
					"err_code": 0,
					"data": arrConditionStages
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getConditionStages"
				});
			});
		},
		conditionStagesAssessment: function getConditionStagesAssessment(req, res) {
			var apikey = req.params.apikey;
			
			var conditionStagesId = req.query._id;
			var conditionId = req.query.condition_id;

			//susun query
			var condition = "";

			if (typeof conditionStagesId !== 'undefined' && conditionStagesId !== "") {
				condition += "STAGE_ID = '" + conditionStagesId + "' AND ";
			}

			if (typeof conditionId !== 'undefined' && conditionId !== "") {
				condition += "CONDITION_ID = '" + conditionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrConditionStages = [];
			/*var query = "select stage_id, cs.CONDITION_ID from baciro_fhir.condition_stages " + fixCondition;*/
			var query = "select stage_id, cs.condition_id as condition_id, ci.clinical_impression_id as clinical_impression_id, dr.diagnostic_report_id as diagnostic_report_id, ob.observation_id as observation_id  from baciro_fhir.condition_stages cs left join baciro_fhir.clinical_impression ci on cs.condition_id = ci.condition_id left join baciro_fhir.diagnostic_report dr on cs.condition_id = dr.condition_id left join baciro_fhir.observation ob dr on cs.condition_id = ob.condition_id  " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ConditionStages = {};
					ConditionStages.id = rez[i].stage_id;
					if (rez[i].clinical_impression_id == null) {
						ConditionStages.assessment = hostFHIR + ':' + portFHIR + '/' + apikey + '/ClinicalImpression?_id=' +  rez[i].clinical_impression_id;
					} else if (rez[i].diagnostic_report_id == null) {
						ConditionStages.assessment = hostFHIR + ':' + portFHIR + '/' + apikey + '/DiagnosticReport?_id=' + rez[i].diagnostic_report_id;
					} else if (rez[i].observation_id == null) {
						ConditionStages.assessment =  hostFHIR + ':' + portFHIR + '/' + apikey + '/Observation?_id=' +rez[i].observation_id;
					} else {
						ConditionStages.assessment = "";
					}
					
					
					arrConditionStages[i] = ConditionStages;
				}
				res.json({
					"err_code": 0,
					"data": arrConditionStages
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getConditionStages"
				});
			});
		},
		conditionEvidence: function getConditionEvidence(req, res) {
			var apikey = req.params.apikey;
			
			var conditionEvidenceId = req.query._id;
			var conditionId = req.query.condition_id;

			//susun query
			var condition = "";

			if (typeof conditionEvidenceId !== 'undefined' && conditionEvidenceId !== "") {
				condition += "evidence_id = '" + conditionEvidenceId + "' AND ";
			}

			if (typeof conditionId !== 'undefined' && conditionId !== "") {
				condition += "CONDITION_ID = '" + conditionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrConditionEvidence = [];
			var query = "select evidence_id, code, detail from baciro_fhir.condition_evidence " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ConditionEvidence = {};
					ConditionEvidence.id = rez[i].evidence_id;
					ConditionEvidence.code = rez[i].code;
					ConditionEvidence.detail = rez[i].detail;
					
					arrConditionEvidence[i] = ConditionEvidence;
				}
				res.json({
					"err_code": 0,
					"data": arrConditionEvidence
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getConditionEvidence"
				});
			});
		}
		
  },
	post: {
		condition: function addCondition(req, res) {
			console.log(req.body);
			var condition_id = req.body.condition_id;
			var clinical_status = req.body.clinical_status;
			var verification_status = req.body.verification_status;
			var category = req.body.category;
			var severity = req.body.severity;
			var code = req.body.code;
			var body_site = req.body.body_site;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var onset_date_time = req.body.onset_date_time;
			var onset_age = req.body.onset_age;
			var onset_period_start = req.body.onset_period_start;
			var onset_period_end = req.body.onset_period_end;
			var onset_range_low = req.body.onset_range_low;
			var onset_range_high = req.body.onset_range_high;
			var onset_string = req.body.onset_string;
			var abatement_date_time = req.body.abatement_date_time;
			var abatement_age = req.body.abatement_age;
			var abatement_boolean = req.body.abatement_boolean;
			var abatement_period_start = req.body.abatement_period_start;
			var abatement_period_end = req.body.abatement_period_end;
			var abatement_range_low = req.body.abatement_range_low;
			var abatement_range_high = req.body.abatement_range_high;
			var abatement_string = req.body.abatement_string;
			var asserted_date = req.body.asserted_date;
			var asserter_practitioner = req.body.asserter_practitioner;
			var asserter_patient = req.body.asserter_patient;
			var asserter_related_person = req.body.asserter_related_person;
			var procedure_id = req.body.procedure_id;
			var family_member_history_id = req.body.family_member_history_id;
			var care_plan_id = req.body.care_plan_id;
			var care_plan_activity_id = req.body.care_plan_activity_id;
			var goal_id = req.body.goal_id;
			var care_team_id = req.body.care_team_id;
			var clinical_impression_id = req.body.clinical_impression_id;
			var adverse_event_id = req.body.adverse_event_id;
			
			var column = "";
      var values = "";
			
			if (typeof clinical_status !== 'undefined' && clinical_status !== "") {
        column += 'clinical_status,';
        values += "'" + clinical_status + "',";
      }
			
			if (typeof verification_status !== 'undefined' && verification_status !== "") {
        column += 'verification_status,';
        values += "'" + verification_status + "',";
      }
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }	
			
			if (typeof severity !== 'undefined' && severity !== "") {
        column += 'severity,';
        values += "'" + severity + "',";
      }	
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }	
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
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
			
			if (typeof onset_date_time !== 'undefined' && onset_date_time !== "") {
        column += 'onset_date_time,';
        //values += "'" + date + "',";
				values += "to_date('"+ onset_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof onset_age !== 'undefined' && onset_age !== "") {
        column += 'onset_age,';
        values += " " + onset_age + ",";
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
			
			if (typeof onset_range_low !== 'undefined' && onset_range_low !== "") {
        column += 'onset_range_low,';
        values += " " + onset_range_low + ",";
      }	
			
			if (typeof onset_range_high !== 'undefined' && onset_range_high !== "") {
        column += 'onset_range_high,';
        values += " " + onset_range_high + ",";
      }	
			
			if (typeof onset_string !== 'undefined' && onset_string !== "") {
        column += 'onset_string,';
        values += "'" + onset_string + "',";
      }	
			
			if (typeof abatement_date_time !== 'undefined' && abatement_date_time !== "") {
        column += 'abatement_date_time,';
        //values += "'" + date + "',";
				values += "to_date('"+ abatement_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof abatement_age !== 'undefined' && abatement_age !== "") {
        column += 'abatement_age,';
        values += " " + abatement_age + ",";
      }	
			
			if (typeof abatement_boolean !== 'undefined' && abatement_boolean !== "") {
        column += 'abatement_boolean,';
        values += " " + abatement_boolean + ",";
      }	
			
			if (typeof abatement_period_start !== 'undefined' && abatement_period_start !== "") {
        column += 'abatement_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ abatement_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof abatement_period_end !== 'undefined' && abatement_period_end !== "") {
        column += 'abatement_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ abatement_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof abatement_range_low !== 'undefined' && abatement_range_low !== "") {
        column += 'abatement_range_low,';
        values += " " + abatement_range_low + ",";
      }	
			
			if (typeof abatement_range_high !== 'undefined' && abatement_range_high !== "") {
        column += 'abatement_range_high,';
        values += " " + abatement_range_high + ",";
      }	
			
			if (typeof abatement_string !== 'undefined' && abatement_string !== "") {
        column += 'abatement_string,';
        values += "'" + abatement_string + "',";
      }	
			
			if (typeof asserted_date !== 'undefined' && asserted_date !== "") {
        column += 'asserted_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ asserted_date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof asserter_practitioner !== 'undefined' && asserter_practitioner !== "") {
        column += 'asserter_practitioner,';
        values += "'" + asserter_practitioner + "',";
      }	
			
			if (typeof asserter_patient !== 'undefined' && asserter_patient !== "") {
        column += 'asserter_patient,';
        values += "'" + asserter_patient + "',";
      }	
			
			if (typeof asserter_related_person !== 'undefined' && asserter_related_person !== "") {
        column += 'asserter_related_person,';
        values += "'" + asserter_related_person + "',";
      }	
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }	
			
			if (typeof family_member_history_id !== 'undefined' && family_member_history_id !== "") {
        column += 'family_member_history_id,';
        values += "'" + family_member_history_id + "',";
      }	
			
			if (typeof care_plan_id !== 'undefined' && care_plan_id !== "") {
        column += 'care_plan_id,';
        values += "'" + care_plan_id + "',";
      }	
			
			if (typeof care_plan_activity_id !== 'undefined' && care_plan_activity_id !== "") {
        column += 'care_plan_activity_id,';
        values += "'" + care_plan_activity_id + "',";
      }	
			
			if (typeof goal_id !== 'undefined' && goal_id !== "") {
        column += 'goal_id,';
        values += "'" + goal_id + "',";
      }	
			
			if (typeof care_team_id !== 'undefined' && care_team_id !== "") {
        column += 'care_team_id,';
        values += "'" + care_team_id + "',";
      }	
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }	
			
			if (typeof adverse_event_id !== 'undefined' && adverse_event_id !== "") {
        column += 'adverse_event_id,';
        values += "'" + adverse_event_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.condition(condition_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+condition_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select  condition_id, clinical_status, verification_status, category, severity, code, body_site, subject_patient, subject_group, context_encounter, context_episode_of_care, onset_date_time, onset_age, onset_period_start, onset_period_end, onset_range_low, onset_range_high, onset_string, abatement_date_time, abatement_age, abatement_boolean, abatement_period_start, abatement_period_end, abatement_range_low, abatement_range_high abatement_string, asserted_date, asserter_practitioner, asserter_patient, asserter_related_person, procedure_id, family_member_history_id, care_plan_id, care_plan_activity_id, goal_id, care_team_id, clinical_impression_id, adverse_event_id from baciro_fhir.condition WHERE condition_id = '" + condition_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addCondition"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addCondition"});
      });
    },
		conditionStages: function addConditionStages(req, res) {
			console.log(req.body);
			var stage_id = req.body.stage_id;
			var summary  = req.body.summary;
			var condition_id = req.body.condition_id;

			var column = "";
      var values = "";
			
			if (typeof stage_id !== 'undefined' && stage_id !== "") {
        column += 'stage_id,';
        values += "'" + stage_id + "',";
      }
			
			if (typeof summary !== 'undefined' && summary !== "") {
        column += 'summary,';
        values += "'" + summary + "',";
      }
			
			if (typeof condition_id !== 'undefined' && condition_id !== "") {
        column += 'condition_id,';
        values += "'" + condition_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.condition_stages(stage_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+stage_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select stage_id, summary from baciro_fhir.condition_stages WHERE stage_id = '" + stage_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addConditionStages"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addConditionStages"});
      });
    },
		conditionEvidence: function addConditionEvidence(req, res) {
			console.log(req.body);
			var evidence_id = req.body.evidence_id;
			var code  = req.body.code;
			var detail = req.body.detail;
			var condition_id = req.body.condition_id;

			var column = "";
      var values = "";
			
			if (typeof evidence_id !== 'undefined' && evidence_id !== "") {
        column += 'evidence_id,';
        values += "'" + evidence_id + "',";
      }
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }
			
			if (typeof detail !== 'undefined' && detail !== "") {
        column += 'detail,';
        values += "'" + detail + "',";
      }
			
			if (typeof condition_id !== 'undefined' && condition_id !== "") {
        column += 'condition_id,';
        values += "'" + condition_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.condition_evidence(evidence_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+evidence_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select evidence_id, code, detail from baciro_fhir.condition_evidence WHERE evidence_id = '" + evidence_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addConditionEvidence"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addConditionEvidence"});
      });
    }
		
	},
	put: {
		condition: function updateCondition(req, res) {
			console.log(req.body);
			var condition_id = req.params.condition_id;
			var clinical_status = req.body.clinical_status;
			var verification_status = req.body.verification_status;
			var category = req.body.category;
			var severity = req.body.severity;
			var code = req.body.code;
			var body_site = req.body.body_site;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var onset_date_time = req.body.onset_date_time;
			var onset_age = req.body.onset_age;
			var onset_period_start = req.body.onset_period_start;
			var onset_period_end = req.body.onset_period_end;
			var onset_range_low = req.body.onset_range_low;
			var onset_range_high = req.body.onset_range_high;
			var onset_string = req.body.onset_string;
			var abatement_date_time = req.body.abatement_date_time;
			var abatement_age = req.body.abatement_age;
			var abatement_boolean = req.body.abatement_boolean;
			var abatement_period_start = req.body.abatement_period_start;
			var abatement_period_end = req.body.abatement_period_end;
			var abatement_range_low = req.body.abatement_range_low;
			var abatement_range_high = req.body.abatement_range_high;
			var abatement_string = req.body.abatement_string;
			var asserted_date = req.body.asserted_date;
			var asserter_practitioner = req.body.asserter_practitioner;
			var asserter_patient = req.body.asserter_patient;
			var asserter_related_person = req.body.asserter_related_person;
			var procedure_id = req.body.procedure_id;
			var family_member_history_id = req.body.family_member_history_id;
			var care_plan_id = req.body.care_plan_id;
			var care_plan_activity_id = req.body.care_plan_activity_id;
			var goal_id = req.body.goal_id;
			var care_team_id = req.body.care_team_id;
			var clinical_impression_id = req.body.clinical_impression_id;
			var adverse_event_id = req.body.adverse_event_id;
			
			var column = "";
      var values = "";
			
			if (typeof clinical_status !== 'undefined' && clinical_status !== "") {
        column += 'clinical_status,';
        values += "'" + clinical_status + "',";
      }
			
			if (typeof verification_status !== 'undefined' && verification_status !== "") {
        column += 'verification_status,';
        values += "'" + verification_status + "',";
      }
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }	
			
			if (typeof severity !== 'undefined' && severity !== "") {
        column += 'severity,';
        values += "'" + severity + "',";
      }	
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }	
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
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
			
			if (typeof onset_date_time !== 'undefined' && onset_date_time !== "") {
        column += 'onset_date_time,';
        //values += "'" + date + "',";
				values += "to_date('"+ onset_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof onset_age !== 'undefined' && onset_age !== "") {
        column += 'onset_age,';
        values += " " + onset_age + ",";
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
			
			if (typeof onset_range_low !== 'undefined' && onset_range_low !== "") {
        column += 'onset_range_low,';
        values += " " + onset_range_low + ",";
      }	
			
			if (typeof onset_range_high !== 'undefined' && onset_range_high !== "") {
        column += 'onset_range_high,';
        values += " " + onset_range_high + ",";
      }	
			
			if (typeof onset_string !== 'undefined' && onset_string !== "") {
        column += 'onset_string,';
        values += "'" + onset_string + "',";
      }	
			
			if (typeof abatement_date_time !== 'undefined' && abatement_date_time !== "") {
        column += 'abatement_date_time,';
        //values += "'" + date + "',";
				values += "to_date('"+ abatement_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof abatement_age !== 'undefined' && abatement_age !== "") {
        column += 'abatement_age,';
        values += " " + abatement_age + ",";
      }	
			
			if (typeof abatement_boolean !== 'undefined' && abatement_boolean !== "") {
        column += 'abatement_boolean,';
        values += " " + abatement_boolean + ",";
      }	
			
			if (typeof abatement_period_start !== 'undefined' && abatement_period_start !== "") {
        column += 'abatement_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ abatement_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof abatement_period_end !== 'undefined' && abatement_period_end !== "") {
        column += 'abatement_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ abatement_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof abatement_range_low !== 'undefined' && abatement_range_low !== "") {
        column += 'abatement_range_low,';
        values += " " + abatement_range_low + ",";
      }	
			
			if (typeof abatement_range_high !== 'undefined' && abatement_range_high !== "") {
        column += 'abatement_range_high,';
        values += " " + abatement_range_high + ",";
      }	
			
			if (typeof abatement_string !== 'undefined' && abatement_string !== "") {
        column += 'abatement_string,';
        values += "'" + abatement_string + "',";
      }	
			
			if (typeof asserted_date !== 'undefined' && asserted_date !== "") {
        column += 'asserted_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ asserted_date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof asserter_practitioner !== 'undefined' && asserter_practitioner !== "") {
        column += 'asserter_practitioner,';
        values += "'" + asserter_practitioner + "',";
      }	
			
			if (typeof asserter_patient !== 'undefined' && asserter_patient !== "") {
        column += 'asserter_patient,';
        values += "'" + asserter_patient + "',";
      }	
			
			if (typeof asserter_related_person !== 'undefined' && asserter_related_person !== "") {
        column += 'asserter_related_person,';
        values += "'" + asserter_related_person + "',";
      }	
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }	
			
			if (typeof family_member_history_id !== 'undefined' && family_member_history_id !== "") {
        column += 'family_member_history_id,';
        values += "'" + family_member_history_id + "',";
      }	
			
			if (typeof care_plan_id !== 'undefined' && care_plan_id !== "") {
        column += 'care_plan_id,';
        values += "'" + care_plan_id + "',";
      }	
			
			if (typeof care_plan_activity_id !== 'undefined' && care_plan_activity_id !== "") {
        column += 'care_plan_activity_id,';
        values += "'" + care_plan_activity_id + "',";
      }	
			
			if (typeof goal_id !== 'undefined' && goal_id !== "") {
        column += 'goal_id,';
        values += "'" + goal_id + "',";
      }	
			
			if (typeof care_team_id !== 'undefined' && care_team_id !== "") {
        column += 'care_team_id,';
        values += "'" + care_team_id + "',";
      }	
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }	
			
			if (typeof adverse_event_id !== 'undefined' && adverse_event_id !== "") {
        column += 'adverse_event_id,';
        values += "'" + adverse_event_id + "',";
      }	
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "condition_id = '" + condition_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.condition(condition_id," + column.slice(0, -1) + ") SELECT condition_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.condition WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select  condition_id, clinical_status, verification_status, category, severity, code, body_site, subject_patient, subject_group, context_encounter, context_episode_of_care, onset_date_time, onset_age, onset_period_start, onset_period_end, onset_range_low, onset_range_high, onset_string, abatement_date_time, abatement_age, abatement_boolean, abatement_period_start, abatement_period_end, abatement_range_low, abatement_range_high abatement_string, asserted_date, asserter_practitioner, asserter_patient, asserter_related_person, procedure_id, family_member_history_id, care_plan_id, care_plan_activity_id, goal_id, care_team_id, clinical_impression_id, adverse_event_id from baciro_fhir.condition WHERE condition_id = '" + condition_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateCondition"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateCondition"});
      });
    },
		conditionStages: function updateConditionStages(req, res) {
			console.log(req.body);
			var stage_id = req.params.stage_id;
			var summary  = req.body.summary;
			var condition_id = req.body.condition_id;

			var column = "";
      var values = "";
			
			if (typeof stage_id !== 'undefined' && stage_id !== "") {
        column += 'stage_id,';
        values += "'" + stage_id + "',";
      }
			
			if (typeof summary !== 'undefined' && summary !== "") {
        column += 'summary,';
        values += "'" + summary + "',";
      }
			
			if (typeof condition_id !== 'undefined' && condition_id !== "") {
        column += 'condition_id,';
        values += "'" + condition_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "stage_id = '" + stage_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.condition_stages(stage_id," + column.slice(0, -1) + ") SELECT stage_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.condition_stages WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select stage_id, summary from baciro_fhir.condition_stages WHERE participant_id = '" + participant_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionStages"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionStages"});
      });
    },
		conditionEvidence: function updateConditionEvidence(req, res) {
			console.log(req.body);
			var evidence_id = req.params.evidence_id;
			var code  = req.body.code;
			var detail = req.body.detail;
			var condition_id = req.body.condition_id;

			var column = "";
      var values = "";
			
			if (typeof evidence_id !== 'undefined' && evidence_id !== "") {
        column += 'evidence_id,';
        values += "'" + evidence_id + "',";
      }
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }
			
			if (typeof detail !== 'undefined' && detail !== "") {
        column += 'detail,';
        values += "'" + detail + "',";
      }
			
			if (typeof condition_id !== 'undefined' && condition_id !== "") {
        column += 'condition_id,';
        values += "'" + condition_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "evidence_id = '" + evidence_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.condition_evidence(stage_id," + column.slice(0, -1) + ") SELECT stage_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.condition_evidence WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select evidence_id, code, detail from baciro_fhir.condition_evidence WHERE evidence_id = '" + evidence_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionEvidence"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateConditionEvidence"});
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