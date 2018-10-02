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
		riskAssessment: function getRiskAssessment(req, res){
			var apikey = req.params.apikey;
			var riskAssessmentId = req.query._id;
			var condition = req.query.condition;
			var date = req.query.date;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var method = req.query.method;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var probability = req.query.probability;
			var risk = req.query.risk;
			var subject = req.query.subject;
			
      //susun query
      var condition = "";
      var join = "";
			
			if(typeof riskAssessmentId !== 'undefined' && riskAssessmentId !== ""){
        condition += "ra.RISK_ASSESSMENT_ID = '" + riskAssessmentId + "' AND,";  
      }
			
			if(typeof condition !== 'undefined' && condition !== ""){
        condition += "ra.CONDITION = '" + condition + "' AND,";  
      }
			
			if (typeof date !== 'undefined' && date !== "") {
        condition += "ra.OCCURRENCE_DATE_TIME == to_date('" + date + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof encounter !== 'undefined' && encounter !== ""){
				condition += "ra.CONTEXT_ENCOUNTER = '" + encounter + "' AND,";  
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on ra.RISK_ASSESSMENT_ID = i.RISK_ASSESSMENT_ID ";
        condition += "i.IDENTIFIER_ID = '" + identifier + "' AND,";  
      }
			
			if(typeof method !== 'undefined' && method !== ""){
				condition += "ra.METHOD = '" + method + "' AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "ra.SUBJECT_PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof performer !== 'undefined' && performer !== ""){
			  condition += "(ra.PERFORMER_PRACTITIONER = '" + performer + "' OR ra.PERFORMER_DEVICE = '" + performer + "') AND,"; 
      }
			
			if((typeof probability !== 'undefined' && probability !== "") || (typeof risk !== 'undefined' && risk !== "")){
				join += " LEFT JOIN BACIRO_FHIR.RISK_ASSESSMENT_PREDICTION rap on ra.RISK_ASSESSMENT_ID = rap.RISK_ASSESSMENT_ID ";
        if(typeof probability !== 'undefined' && probability !== ""){
					condition += "rap.PROBABILITY_DECIMAL = " + probability + " AND,";  
				}
				
				if(typeof risk !== 'undefined' && risk !== ""){
					condition += "rap.QUALITATIVE_RISK = '" + risk + "' AND,";  
				}
      }
			
			if(typeof subject !== 'subject' && subject !== ""){
				condition += "(ra.SUBJECT_PATIENT = '" + subject + "' OR ra.SUBJECT_GROUP = '" + subject + "') AND,";  
			}
			
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrRiskAssessment = [];
      var query = "select risk_assessment_id, based_on, parent, status, method, code, subject_patient, subject_group, context_encounter, context_episode_of_care, occurrence_date_time, occurrence_period_start, occurrence_period_end, condition, performer_practitioner, performer_device, reason_codeable_concept, reason_reference, basis, mitigation, comment from baciro_fhir.risk_assessment ra " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var RiskAssessment = {};
					RiskAssessment.resourceType = "RiskAssessment";
          RiskAssessment.id = rez[i].riskAssessment_id;
					RiskAssessment.based_on = rez[i].based_on;
					RiskAssessment.parent = rez[i].parent;
					RiskAssessment.status = rez[i].status;
					RiskAssessment.method = rez[i].method;
					RiskAssessment.code = rez[i].code;
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
					RiskAssessment.subject = arrContext;
					RiskAssessment.context = arrContext;
					if(rez[i].occurrence_date_time == null){
						RiskAssessment.occurrence.occurrenceDateTime = formatDate(rez[i].occurrence_date_time);
					}else{
						RiskAssessment.occurrence.occurrenceDateTime = rez[i].occurrence_date_time;
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
					RiskAssessment.occurrence.occurrencePeriod = occurrenceperiod_start + ' to ' + occurrenceperiod_end;
					if(rez[i].condition != "null"){
						Performer.condition = hostFHIR + ':' + portFHIR + '/' + apikey + '/Condition?_id=' +  rez[i].condition;
					} else {
						RiskAssessment.condition = "";
					}
					
					var arrPerformer = [];
					var Performer = {};
					if(rez[i].performer_practitioner != "null"){
						Performer.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].performer_practitioner;
					} else {
						Performer.practitioner = "";
					}
					if(rez[i].performer_device != "null"){
						Performer.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].performer_device;
					} else {
						Performer.device = "";
					}
					arrPerformer[i] = Performer;
					RiskAssessment.performer = arrPerformer;
					RiskAssessment.reason.reasonCodeableConcept = rez[i].reason_codeable_concept;
					RiskAssessment.reason.reasonReference = rez[i].reason_reference;
					RiskAssessment.basis = rez[i].basis;
					RiskAssessment.mitigation = rez[i].mitigation;
					RiskAssessment.comment = rez[i].comment;
          arrRiskAssessment[i] = RiskAssessment;
        }
        res.json({"err_code":0,"data": arrRiskAssessment});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getRiskAssessment"});
      });
    },
		riskAssessmentPrediction: function getRiskAssessmentPrediction(req, res) {
			var apikey = req.params.apikey;
			
			var riskAssessmentPredictionId = req.query._id;
			var riskAssessmentId = req.query.riskAssessment_id;

			//susun query
			var condition = "";

			if (typeof riskAssessmentPredictionId !== 'undefined' && riskAssessmentPredictionId !== "") {
				condition += "risk_assessment_id = '" + riskAssessmentPredictionId + "' AND ";
			}

			if (typeof riskAssessmentId !== 'undefined' && riskAssessmentId !== "") {
				condition += "prediction_id = '" + riskAssessmentId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrRiskAssessmentPrediction = [];
			var query = "select prediction_id, outcome, probability_decimal, probability_range_low, probability_range_high, qualitative_risk, relative_risk, when_period_start, when_period_end, when_range_low, when_range_high, rationale, risk_assessment_id from baciro_fhir.risk_assessment_prediction " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var RiskAssessmentPrediction = {};
					RiskAssessmentPrediction.id = rez[i].prediction_id;
					RiskAssessmentPrediction.outcome = rez[i].outcome;
					
					RiskAssessmentPrediction.probability.probabilityDecimal = rez[i].probability_decimal;
					RiskAssessmentPrediction.probability.probabilityRange = rez[i].probability_range_low + ' to ' + rez[i].probability_range_high;
					RiskAssessmentPrediction.qualitative_risk = rez[i].qualitative_risk;
					RiskAssessmentPrediction.relative_risk = rez[i].relative_risk;
					var whenperiod_start,whenperiod_end;
					if(rez[i].when_period_start == null){
						whenperiod_start = formatDate(rez[i].when_period_start);  
					}else{
						whenperiod_start = rez[i].when_period_start;  
					}
					if(rez[i].when_period_end == null){
						whenperiod_end = formatDate(rez[i].when_period_end);  
					}else{
						whenperiod_end = rez[i].when_period_end;  
					}
					RiskAssessmentPrediction.when.whenPeriod = whenperiod_start + ' to ' + whenperiod_end;
					RiskAssessmentPrediction.when.whenRange = rez[i].when_range_low + ' to ' + rez[i].when_range_high;
					RiskAssessmentPrediction.rationale = rez[i].rationale;
					
					arrRiskAssessmentPrediction[i] = RiskAssessmentPrediction;
				}
				res.json({
					"err_code": 0,
					"data": arrRiskAssessmentPrediction
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getRiskAssessmentPrediction"
				});
			});
		}
		
  },
	post: {
		riskAssessment: function addRiskAssessment(req, res) {
			console.log(req.body);
			
			var risk_assessment_id = req.body.risk_assessment_id;
			var based_on = req.body.based_on;
			var parent = req.body.parent;
			var status = req.body.status;
			var method = req.body.method;
			var code = req.body.code;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var occurrence_date_time = req.body.occurrence_date_time;
			var occurrence_period_start = req.body.occurrence_period_start;
			var occurrence_period_end = req.body.occurrence_period_end;
			var condition = req.body.condition;
			var performer_practitioner = req.body.performer_practitioner;
			var performer_device = req.body.performer_device;
			var reason_codeable_concept = req.body.reason_codeable_concept;
			var reason_reference = req.body.reason_reference;
			var basis = req.body.basis;
			var mitigation = req.body.mitigation;
			var comment = req.body.comment;
			
			var column = "";
      var values = "";
			
			if (typeof based_on !== 'undefined' && based_on !== "") {
        column += 'based_on,';
        values += "'" + based_on + "',";
      }
			
			if (typeof parent !== 'undefined' && parent !== "") {
        column += 'parent,';
        values += "'" + parent + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += " " + status + ",";
      }
			
			if (typeof method !== 'undefined' && method !== "") {
        column += 'method,';
        values += "'" + method + "',";
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
			
			if (typeof occurrence_date_time !== 'undefined' && occurrence_date_time !== "") {
        column += 'occurrence_date_time,';
        //values += "'" + date + "',";
				values += "to_date('"+ occurrence_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof occurrence_period_start !== 'undefined' && occurrence_period_start !== "") {
        column += 'occurrence_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ occurrence_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof occurrence_period_end !== 'undefined' && occurrence_period_end !== "") {
        column += 'occurrence_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ occurrence_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof condition !== 'undefined' && condition !== "") {
        column += 'condition,';
        values += "'" + condition + "',";
      }	
			
			if (typeof performer_practitioner !== 'undefined' && performer_practitioner !== "") {
        column += 'performer_practitioner,';
        values += "'" + performer_practitioner + "',";
      }	
			
			if (typeof performer_device !== 'undefined' && performer_device !== "") {
        column += 'performer_device,';
        values += "'" + performer_device + "',";
      }	
			
			if (typeof reason_codeable_concept !== 'undefined' && reason_codeable_concept !== "") {
        column += 'reason_codeable_concept,';
        values += "'" + reason_codeable_concept + "',";
      }	
			
			if (typeof reason_reference !== 'undefined' && reason_reference !== "") {
        column += 'reason_reference,';
        values += "'" + reason_reference + "',";
      }	
			
			if (typeof basis !== 'undefined' && basis !== "") {
        column += 'basis,';
        values += "'" + basis + "',";
      }	
			
			if (typeof mitigation !== 'undefined' && mitigation !== "") {
        column += 'mitigation,';
        values += "'" + mitigation + "',";
      }	
			
			if (typeof comment !== 'undefined' && comment !== "") {
        column += 'comment,';
        values += "'" + comment + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.risk_assessment(risk_assessment_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+risk_assessment_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select risk_assessment_id, based_on, parent, status, method, code, subject_patient, subject_group, context_encounter, context_episode_of_care, occurrence_date_time, occurrence_period_start, occurrence_period_end, condition, performer_practitioner, performer_device, reason_codeable_concept, reason_reference, basis, mitigation, comment from baciro_fhir.risk_assessment WHERE risk_assessment_id = '" + risk_assessment_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addRiskAssessment"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addRiskAssessment"});
      });
    },
		riskAssessmentPrediction: function addRiskAssessmentPrediction(req, res) {
			console.log(req.body);
			var prediction_id = req.body.prediction_id;
			var outcome = req.body.outcome;
			var probability_decimal = req.body.probability_decimal;
			var probability_range_low = req.body.probability_range_low;
			var probability_range_high = req.body.probability_range_high;
			var qualitative_risk = req.body.qualitative_risk;
			var relative_risk = req.body.relative_risk;
			var when_period_start = req.body.when_period_start;
			var when_period_end = req.body.when_period_end;
			var when_range_low = req.body.when_range_low;
			var when_range_high = req.body.when_range_high;
			var rationale = req.body.rationale;
			var risk_assessment_id = req.body.risk_assessment_id;
			
			var column = "";
      var values = "";
			
			if (typeof outcome !== 'undefined' && outcome !== "") {
        column += 'outcome,';
        values += "'" + outcome + "',";
      }
			
			if (typeof probability_decimal !== 'undefined' && probability_decimal !== "") {
        column += 'probability_decimal,';
        values += " " + probability_decimal + ",";
      }
			
			if (typeof probability_range_low !== 'undefined' && probability_range_low !== "") {
        column += 'probability_range_low,';
        values += " " + probability_range_low + ",";
      }
			
			if (typeof probability_range_high !== 'undefined' && probability_range_high !== "") {
        column += 'probability_range_high,';
        values += " " + probability_range_high + ",";
      }
			
			if (typeof qualitative_risk !== 'undefined' && qualitative_risk !== "") {
        column += 'qualitative_risk,';
        values += "'" + qualitative_risk + "',";
      }
			
			if (typeof relative_risk !== 'undefined' && relative_risk !== "") {
        column += 'relative_risk,';
        values += " " + relative_risk + ",";
      }	
			
			if (typeof when_period_start !== 'undefined' && when_period_start !== "") {
        column += 'when_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ when_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof when_period_end !== 'undefined' && when_period_end !== "") {
        column += 'when_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ when_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof when_range_low !== 'undefined' && when_range_low !== "") {
        column += 'when_range_low,';
        values += " " + when_range_low + ",";
      }	
			
			if (typeof when_range_high !== 'undefined' && when_range_high !== "") {
        column += 'when_range_high,';
        values += " " + when_range_high + ",";
      }	
			
			if (typeof rationale !== 'undefined' && rationale !== "") {
        column += 'rationale,';
        values += "'" + rationale + "',";
      }	
			
			if (typeof risk_assessment_id !== 'undefined' && risk_assessment_id !== "") {
        column += 'risk_assessment_id,';
        values += "'" + risk_assessment_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.risk_assessment_prediction(prediction_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+prediction_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select prediction_id, outcome, probability_decimal, probability_range_low, probability_range_high, qualitative_risk, relative_risk, when_period_start, when_period_end, when_range_low, when_range_high, rationale, risk_assessment_id from baciro_fhir.risk_assessment_prediction WHERE prediction_id = '" + prediction_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addRiskAssessmentPrediction"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addRiskAssessmentPrediction"});
      });
    }
		
	},
	put: {
		riskAssessment: function updateRiskAssessment(req, res) {
			console.log(req.body);
			var risk_assessment_id = req.params.risk_assessment_id;
			var based_on = req.body.based_on;
			var parent = req.body.parent;
			var status = req.body.status;
			var method = req.body.method;
			var code = req.body.code;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var occurrence_date_time = req.body.occurrence_date_time;
			var occurrence_period_start = req.body.occurrence_period_start;
			var occurrence_period_end = req.body.occurrence_period_end;
			var condition = req.body.condition;
			var performer_practitioner = req.body.performer_practitioner;
			var performer_device = req.body.performer_device;
			var reason_codeable_concept = req.body.reason_codeable_concept;
			var reason_reference = req.body.reason_reference;
			var basis = req.body.basis;
			var mitigation = req.body.mitigation;
			var comment = req.body.comment;
			
			var column = "";
      var values = "";
			
			if (typeof based_on !== 'undefined' && based_on !== "") {
        column += 'based_on,';
        values += "'" + based_on + "',";
      }
			
			if (typeof parent !== 'undefined' && parent !== "") {
        column += 'parent,';
        values += "'" + parent + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += " " + status + ",";
      }
			
			if (typeof method !== 'undefined' && method !== "") {
        column += 'method,';
        values += "'" + method + "',";
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
			
			if (typeof occurrence_date_time !== 'undefined' && occurrence_date_time !== "") {
        column += 'occurrence_date_time,';
        //values += "'" + date + "',";
				values += "to_date('"+ occurrence_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof occurrence_period_start !== 'undefined' && occurrence_period_start !== "") {
        column += 'occurrence_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ occurrence_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof occurrence_period_end !== 'undefined' && occurrence_period_end !== "") {
        column += 'occurrence_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ occurrence_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof condition !== 'undefined' && condition !== "") {
        column += 'condition,';
        values += "'" + condition + "',";
      }	
			
			if (typeof performer_practitioner !== 'undefined' && performer_practitioner !== "") {
        column += 'performer_practitioner,';
        values += "'" + performer_practitioner + "',";
      }	
			
			if (typeof performer_device !== 'undefined' && performer_device !== "") {
        column += 'performer_device,';
        values += "'" + performer_device + "',";
      }	
			
			if (typeof reason_codeable_concept !== 'undefined' && reason_codeable_concept !== "") {
        column += 'reason_codeable_concept,';
        values += "'" + reason_codeable_concept + "',";
      }	
			
			if (typeof reason_reference !== 'undefined' && reason_reference !== "") {
        column += 'reason_reference,';
        values += "'" + reason_reference + "',";
      }	
			
			if (typeof basis !== 'undefined' && basis !== "") {
        column += 'basis,';
        values += "'" + basis + "',";
      }	
			
			if (typeof mitigation !== 'undefined' && mitigation !== "") {
        column += 'mitigation,';
        values += "'" + mitigation + "',";
      }	
			
			if (typeof comment !== 'undefined' && comment !== "") {
        column += 'comment,';
        values += "'" + comment + "',";
      }			
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "risk_assessment_id = '" + risk_assessment_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.risk_assessment(risk_assessment_id," + column.slice(0, -1) + ") SELECT risk_assessment_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.risk_assessment WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select risk_assessment_id, based_on, parent, status, method, code, subject_patient, subject_group, context_encounter, context_episode_of_care, occurrence_date_time, occurrence_period_start, occurrence_period_end, condition, performer_practitioner, performer_device, reason_codeable_concept, reason_reference, basis, mitigation, comment from baciro_fhir.risk_assessment WHERE risk_assessment_id = '" + risk_assessment_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateRiskAssessment"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateRiskAssessment"});
      });
    },
		riskAssessmentPrediction: function updateRiskAssessmentPrediction(req, res) {
			console.log(req.body);
			
			var prediction_id = req.params.prediction_id;
			var outcome = req.body.outcome;
			var probability_decimal = req.body.probability_decimal;
			var probability_range_low = req.body.probability_range_low;
			var probability_range_high = req.body.probability_range_high;
			var qualitative_risk = req.body.qualitative_risk;
			var relative_risk = req.body.relative_risk;
			var when_period_start = req.body.when_period_start;
			var when_period_end = req.body.when_period_end;
			var when_range_low = req.body.when_range_low;
			var when_range_high = req.body.when_range_high;
			var rationale = req.body.rationale;
			var risk_assessment_id = req.body.risk_assessment_id;
			
			var column = "";
      var values = "";
			
			if (typeof outcome !== 'undefined' && outcome !== "") {
        column += 'outcome,';
        values += "'" + outcome + "',";
      }
			
			if (typeof probability_decimal !== 'undefined' && probability_decimal !== "") {
        column += 'probability_decimal,';
        values += " " + probability_decimal + ",";
      }
			
			if (typeof probability_range_low !== 'undefined' && probability_range_low !== "") {
        column += 'probability_range_low,';
        values += " " + probability_range_low + ",";
      }
			
			if (typeof probability_range_high !== 'undefined' && probability_range_high !== "") {
        column += 'probability_range_high,';
        values += " " + probability_range_high + ",";
      }
			
			if (typeof qualitative_risk !== 'undefined' && qualitative_risk !== "") {
        column += 'qualitative_risk,';
        values += "'" + qualitative_risk + "',";
      }
			
			if (typeof relative_risk !== 'undefined' && relative_risk !== "") {
        column += 'relative_risk,';
        values += " " + relative_risk + ",";
      }	
			
			if (typeof when_period_start !== 'undefined' && when_period_start !== "") {
        column += 'when_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ when_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof when_period_end !== 'undefined' && when_period_end !== "") {
        column += 'when_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ when_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof when_range_low !== 'undefined' && when_range_low !== "") {
        column += 'when_range_low,';
        values += " " + when_range_low + ",";
      }	
			
			if (typeof when_range_high !== 'undefined' && when_range_high !== "") {
        column += 'when_range_high,';
        values += " " + when_range_high + ",";
      }	
			
			if (typeof rationale !== 'undefined' && rationale !== "") {
        column += 'rationale,';
        values += "'" + rationale + "',";
      }	
			
			if (typeof risk_assessment_id !== 'undefined' && risk_assessment_id !== "") {
        column += 'risk_assessment_id,';
        values += "'" + risk_assessment_id + "',";
      }
     
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "prediction_id = '" + prediction_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.risk_assessment_prediction(prediction_id," + column.slice(0, -1) + ") SELECT prediction_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.risk_assessment_prediction WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select prediction_id, outcome, probability_decimal, probability_range_low, probability_range_high, qualitative_risk, relative_risk, when_period_start, when_period_end, when_range_low, when_range_high, rationale, risk_assessment_id from baciro_fhir.risk_assessment_prediction WHERE prediction_id = '" + prediction_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateRiskAssessmentPrediction"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateRiskAssessmentPrediction"});
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