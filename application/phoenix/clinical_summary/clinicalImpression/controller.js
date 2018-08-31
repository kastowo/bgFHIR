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
//
var controller = {
	get: {
		clinicalImpression: function getClinicalImpression(req, res){
			var apikey = req.params.apikey;
			var clinicalImpressionId = req.query._id;
			var action = req.query.action;
			var assessor = req.query.assessor;
			var context = req.query.context;
			var date = req.query.date
			var finding_code = req.query.finding_code;
			var finding_ref = req.query.finding_ref;
			var identifier = req.query.identifier;
			var investigation = req.query.investigation;
			var patient = req.query.patient;
			var previous = req.query.previous;
			var problem = req.query.problem;
			var status = req.query.status;
			var subject = req.query.subject;
			
			
      //susun query
      var condition = "";
      var join = "";
			
			if(typeof clinicalImpressionId !== 'undefined' && clinicalImpressionId !== ""){
        condition += "ci.CLINICAL_IMPRESSION_ID = '" + clinicalImpressionId + "' AND,";  
      }
			
			//kurang action
			
			if(typeof assessor !== 'undefined' && assessor !== ""){
        condition += "ci.assessor = '" + assessor + "' AND,";  
      }
			
			if(typeof context !== 'undefined' && context !== ""){
				condition += "(ci.CONTEXT_ENCOUNTER = '" + context + "' OR ci.CONTEXT_EPISODE_OF_CARE = '" + context + "') AND,";  
			}
			
			if (typeof date !== 'undefined' && date !== "") {
        condition += "ci.PERIOD_START = to_date('" + date + "', 'yyyy-MM-dd') AND,";
      }
			
			if((typeof finding_code !== 'undefined' && finding_code !== "") || (typeof finding_ref !== 'undefined' && finding_ref !== "")){
				join += " LEFT JOIN BACIRO_FHIR.CLINICAL_IMPRESSION_FINDING cf on ci.CLINICAL_IMPRESSION_ID = cf.CLINICAL_IMPRESSION_ID ";
				if(typeof finding_code !== 'undefined' && finding_code !== ""){
					condition += "cf.ITEM_CODEABLE_CONCEPT = '" + finding_code + "' AND,";   
				}
        
				if(typeof finding_ref !== 'undefined' && finding_ref !== ""){
					 condition += "(cf.ITEM_REFERENCE_CONDITION = '" + finding_ref + "' OR cf.ITEM_REFERENCE_OBSERVATION = '" + finding_ref + "' ) AND,";
				}
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on ci.CLINICAL_IMPRESSION_ID = co.CLINICAL_IMPRESSION_ID ";
        condition += "i.IDENTIFIER_ID = '" + identifier + "' AND,";  
      }
			
			//kurang investigation
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "ci.SUBJECT_PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof previous !== 'undefined' && previous !== ""){
        condition += "ci.PREVIOUS = '" + previous + "' AND,";  
      }
			
			//kurang problem
			
			if(typeof status !== 'undefined' && status !== ""){
        condition += "ci.STATUS = '" + status + "' AND,";  
      }
			
			if(typeof subject !== 'subject' && subject !== ""){
				condition += "(ci.SUBJECT_PATIENT = '" + subject + "' OR ci.SUBJECT_GROUP = '" + subject + "') AND,";  
			}
			
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrClinicalImpression = [];
      var query = "select clinical_impression_id, status, code, description, subject_patient, subject_group, context_encounter, context_episode_of_care, effective_date_time, effective_period_start, effective_period_end, date, assessor, previous, protocol, summary, prognosis_codeable_concept, condition_id from baciro_fhir.clinical_impression ci " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var ClinicalImpression = {};
					ClinicalImpression.resourceType = "ClinicalImpression";
          ClinicalImpression.id = rez[i].clinical_impression_id;
					ClinicalImpression.status = rez[i].status;
					ClinicalImpression.code = rez[i].code;
					ClinicalImpression.description = rez[i].description;
					if (rez[i].subject_group !== 'null') {
						ClinicalImpression.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Group?_id=' +  rez[i].subject_group;
					} else if (rez[i].subject_patient !== 'null') {
						ClinicalImpression.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subject_patient;
					} else {
						ClinicalImpression.subject = "";
					}
					if (rez[i].context_encounter !== 'null') {
						ClinicalImpression.context = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].context_encounter;
					} else if (rez[i].context_episode_of_care !== 'null') {
						ClinicalImpression.context = hostFHIR + ':' + portFHIR + '/' + apikey + '/EpisodeOfCare?_id=' +  rez[i].context_episode_of_care;
					} else {
						ClinicalImpression.context = "";
					}
					ClinicalImpression.effective.date = rez[i].effective_date_time;
					ClinicalImpression.effective.period = rez[i].effective_period_start + ' to ' + rez[i].effective_period_end;
					ClinicalImpression.date = rez[i].date;
					ClinicalImpression.assessor = rez[i].assessor;
					ClinicalImpression.previous = rez[i].previous;
					ClinicalImpression.protocol = rez[i].protocol;
					ClinicalImpression.summary = rez[i].summary;
					ClinicalImpression.prognosisCodeableConcept = rez[i].prognosis_codeable_concept;
					
          arrClinicalImpression[i] = ClinicalImpression;
        }
        res.json({"err_code":0,"data": arrClinicalImpression});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getClinicalImpression"});
      });
    },
		clinicalImpressionInvestigation: function getClinicalImpressionInvestigation(req, res) {
			var apikey = req.params.apikey;
			
			var clinicalImpressionInvestigationId = req.query._id;
			var clinicalImpressionId = req.query.clinical_impression_id;

			//susun query
			var condition = "";

			if (typeof clinicalImpressionInvestigationId !== 'undefined' && clinicalImpressionInvestigationId !== "") {
				condition += "INVESTIGATION_ID = '" + clinicalImpressionInvestigationId + "' AND ";
			}

			if (typeof clinicalImpressionId !== 'undefined' && clinicalImpressionId !== "") {
				condition += "clinical_impression_id = '" + clinicalImpressionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrClinicalImpressionInvestigation = [];
			var query = "select investigation_id, code from baciro_fhir.CLINICAL_IMPRESSION_INVESTIGATION " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClinicalImpressionInvestigation = {};
					ClinicalImpressionInvestigation.id = rez[i].participant_id;
					ClinicalImpressionInvestigation.code = rez[i].code;
					
					arrClinicalImpressionInvestigation[i] = ClinicalImpressionInvestigation;
				}
				res.json({
					"err_code": 0,
					"data": arrClinicalImpressionInvestigation
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClinicalImpressionInvestigation"
				});
			});
		},
		clinicalImpressionFinding: function getClinicalImpressionFinding(req, res) {
			var apikey = req.params.apikey;
			
			var clinicalImpressionFindingId = req.query._id;
			var clinicalImpressionId = req.query.clinical_impression_id;

			//susun query
			var condition = "";

			if (typeof clinicalImpressionFindingId !== 'undefined' && clinicalImpressionFindingId !== "") {
				condition += "FINDING_ID = '" + clinicalImpressionFindingId + "' AND ";
			}

			if (typeof clinicalImpressionId !== 'undefined' && clinicalImpressionId !== "") {
				condition += "clinical_impression_id = '" + clinicalImpressionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrClinicalImpressionFinding = [];
			var query = "select finding_id, item_codeable_concept, item_reference_condition, item_reference_observation, basis from baciro_fhir.clinical_impression_finding " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClinicalImpressionFinding = {};
					ClinicalImpressionFinding.id = rez[i].participant_id;
					ClinicalImpressionFinding.itemCodeableConcept = rez[i].item_codeable_concept;
					if (rez[i].item_reference_condition == null) {
						ClinicalImpressionFinding.itemReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Condition?_id=' + rez[i].item_reference_condition;
					} else if (rez[i].item_reference_observation == null) {
						ClinicalImpressionFinding.itemReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Observation?_id=' + rez[i].item_reference_observation;
					} else {
						ClinicalImpressionFinding.member = "";
					}
					ClinicalImpressionFinding.basis = rez[i].basis;
					
					arrClinicalImpressionFinding[i] = ClinicalImpressionFinding;
				}
				res.json({
					"err_code": 0,
					"data": arrClinicalImpressionFinding
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClinicalImpressionFinding"
				});
			});
		}
		
  },
	post: {
		clinicalImpression: function addClinicalImpression(req, res) {
			console.log(req.body);
			
			var clinical_impression_id = req.body.clinical_impression_id;
			var status = req.body.status;
			var code = req.body.code;
			var description = req.body.description;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var effective_date_time = req.body.effective_date_time;
			var effective_period_start = req.body.effective_period_start;
			var effective_period_end = req.body.effective_period_end;
			var date = req.body.date;
			var assessor = req.body.assessor;
			var previous = req.body.previous;
			var protocol = req.body.protocol;
			var summary = req.body.summary;
			var prognosis_codeable_concept = req.body.prognosis_codeable_concept;
			var condition_id = req.body.condition_id;

			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
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
			
			if (typeof effective_date_time !== 'undefined' && effective_date_time !== "") {
        column += 'effective_date_time,';
        //values += "'" + date + "',";
				values += "to_date('"+ effective_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_start !== 'undefined' && effective_period_start !== "") {
        column += 'effective_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ effective_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_end !== 'undefined' && effective_period_end !== "") {
        column += 'effective_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ effective_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof assessor !== 'undefined' && assessor !== "") {
        column += 'assessor,';
        values += "'" + reasonassessor_code + "',";
      }	
						
			if (typeof previous !== 'undefined' && previous !== "") {
        column += 'previous,';
        values += "'" + previous + "',";
      }	
			
			if (typeof protocol !== 'undefined' && protocol !== "") {
        column += 'protocol,';
        values += "'" + protocol + "',";
      }	
			
			if (typeof summary !== 'undefined' && summary !== "") {
        column += 'summary,';
        values += "'" + summary + "',";
      }	
			
			if (typeof prognosis_codeable_concept !== 'undefined' && prognosis_codeable_concept !== "") {
        column += 'prognosis_codeable_concept,';
        values += "'" + prognosis_codeable_concept + "',";
      }	
			
			if (typeof condition_id !== 'undefined' && condition_id !== "") {
        column += 'condition_id,';
        values += "'" + condition_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.clinical_impression(clinical_impression_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+care_teaclinical_impression_idm_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select clinical_impression_id, status, code, description, subject_patient, subject_group, context_encounter, context_episode_of_care, effective_date_time, effective_period_start, effective_period_end, date, assessor, previous, protocol, summary, prognosis_codeable_concept, condition_id from baciro_fhir.clinical_impression WHERE clinical_impression_id = '" + clinical_impression_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClinicalImpression"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClinicalImpression"});
      });
    },
		clinicalImpressionInvestigation: function addClinicalImpressionInvestigation(req, res) {
			console.log(req.body);
			
			var investigation_id = req.body.investigation_id;
			var code = req.body.code;
			var clinical_impression_id = req.body.clinical_impression_id;

			
			var column = "";
      var values = "";
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.CLINICAL_IMPRESSION_INVESTIGATION(investigation_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+investigation_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select investigation_id, code, clinical_impression_id from baciro_fhir.CLINICAL_IMPRESSION_INVESTIGATION WHERE investigation_id = '" + investigation_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClinicalImpressionInvestigation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClinicalImpressionInvestigation"});
      });
    },
		clinicalImpressionFinding: function addClinicalImpressionFinding(req, res) {
			console.log(req.body);
			
			var finding_id = req.body.finding_id;
			var item_codeable_concept = req.body.item_codeable_concept;
			var item_reference_condition = req.body.item_reference_condition;
			var item_reference_observation = req.body.item_reference_observation;
			var basis = req.body.basis;
			var clinical_impression_id = req.body.clinical_impression_id;

			var column = "";
      var values = "";
			
			if (typeof item_codeable_concept !== 'undefined' && item_codeable_concept !== "") {
        column += 'item_codeable_concept,';
        values += "'" + item_codeable_concept + "',";
      }
			
			if (typeof item_reference_condition !== 'undefined' && item_reference_condition !== "") {
        column += 'item_reference_condition,';
        values += "'" + item_reference_condition + "',";
      }
			
			if (typeof item_reference_observation !== 'undefined' && item_reference_observation !== "") {
        column += 'item_reference_observation,';
        values += "'" + item_reference_observation + "',";
      }
			
			if (typeof basis !== 'undefined' && basis !== "") {
        column += 'basis,';
        values += "'" + basis + "',";
      }
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.clinical_impression_finding(finding_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+finding_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select finding_id, item_codeable_concept, item_reference_condition, item_reference_observation, basis, clinical_impression_id from baciro_fhir.clinical_impression_finding WHERE finding_id = '" + finding_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClinicalImpressionFinding"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClinicalImpressionFinding"});
      });
    }
		
	},
	put: {
		clinicalImpression: function updateClinicalImpression(req, res) {
			console.log(req.body);
			var clinical_impression_id = req.params.clinical_impression_id;
			var status = req.body.status;
			var code = req.body.code;
			var description = req.body.description;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var effective_date_time = req.body.effective_date_time;
			var effective_period_start = req.body.effective_period_start;
			var effective_period_end = req.body.effective_period_end;
			var date = req.body.date;
			var assessor = req.body.assessor;
			var previous = req.body.previous;
			var protocol = req.body.protocol;
			var summary = req.body.summary;
			var prognosis_codeable_concept = req.body.prognosis_codeable_concept;
			var condition_id = req.body.condition_id;

			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
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
			
			if (typeof effective_date_time !== 'undefined' && effective_date_time !== "") {
        column += 'effective_date_time,';
        //values += "'" + date + "',";
				values += "to_date('"+ effective_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_start !== 'undefined' && effective_period_start !== "") {
        column += 'effective_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ effective_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_end !== 'undefined' && effective_period_end !== "") {
        column += 'effective_period_end,';
        //values += "'" + date + "',";
				values += "to_date('"+ effective_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof assessor !== 'undefined' && assessor !== "") {
        column += 'assessor,';
        values += "'" + reasonassessor_code + "',";
      }	
						
			if (typeof previous !== 'undefined' && previous !== "") {
        column += 'previous,';
        values += "'" + previous + "',";
      }	
			
			if (typeof protocol !== 'undefined' && protocol !== "") {
        column += 'protocol,';
        values += "'" + protocol + "',";
      }	
			
			if (typeof summary !== 'undefined' && summary !== "") {
        column += 'summary,';
        values += "'" + summary + "',";
      }	
			
			if (typeof prognosis_codeable_concept !== 'undefined' && prognosis_codeable_concept !== "") {
        column += 'prognosis_codeable_concept,';
        values += "'" + prognosis_codeable_concept + "',";
      }	
			
			if (typeof condition_id !== 'undefined' && condition_id !== "") {
        column += 'condition_id,';
        values += "'" + condition_id + "',";
      }			
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "clinical_impression_id = '" + clinical_impression_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.CLINICAL_IMPRESSION(clinical_impression_id," + column.slice(0, -1) + ") SELECT clinical_impression_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CLINICAL_IMPRESSION WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select clinical_impression_id, status, code, description, subject_patient, subject_group, context_encounter, context_episode_of_care, effective_date_time, effective_period_start, effective_period_end, date, assessor, previous, protocol, summary, prognosis_codeable_concept, condition_id from baciro_fhir.clinical_impression WHERE clinical_impression_id = '" + clinical_impression_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClinicalImpression"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClinicalImpression"});
      });
    },
		clinicalImpressionInvestigation: function updateClinicalImpressionInvestigation(req, res) {
			console.log(req.body);
			var investigation_id = req.body.investigation_id;
			var code = req.body.code;
			var clinical_impression_id = req.body.clinical_impression_id;

			
			var column = "";
      var values = "";
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }

     
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "investigation_id = '" + investigation_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.CLINICAL_IMPRESSION_INVESTIGATION(investigation_id," + column.slice(0, -1) + ") SELECT investigation_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CLINICAL_IMPRESSION_INVESTIGATION WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select investigation_id, code, clinical_impression_id from baciro_fhir.CLINICAL_IMPRESSION_INVESTIGATION WHERE investigation_id = '" + investigation_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateClinicalImpressionInvestigation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateClinicalImpressionInvestigation"});
      });
    },
		clinicalImpressionFinding: function updateClinicalImpressionFinding(req, res) {
			console.log(req.body);
			
			var finding_id = req.params.finding_id;
			var item_codeable_concept = req.body.item_codeable_concept;
			var item_reference_condition = req.body.item_reference_condition;
			var item_reference_observation = req.body.item_reference_observation;
			var basis = req.body.basis;
			var clinical_impression_id = req.body.clinical_impression_id;

			var column = "";
      var values = "";
			
			if (typeof item_codeable_concept !== 'undefined' && item_codeable_concept !== "") {
        column += 'item_codeable_concept,';
        values += "'" + item_codeable_concept + "',";
      }
			
			if (typeof item_reference_condition !== 'undefined' && item_reference_condition !== "") {
        column += 'item_reference_condition,';
        values += "'" + item_reference_condition + "',";
      }
			
			if (typeof item_reference_observation !== 'undefined' && item_reference_observation !== "") {
        column += 'item_reference_observation,';
        values += "'" + item_reference_observation + "',";
      }
			
			if (typeof basis !== 'undefined' && basis !== "") {
        column += 'basis,';
        values += "'" + basis + "',";
      }
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "finding_id = '" + finding_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.clinical_impression_finding(finding_id," + column.slice(0, -1) + ") SELECT finding_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.clinical_impression_finding WHERE " + condition;
			
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select finding_id, item_codeable_concept, item_reference_condition, item_reference_observation, basis, clinical_impression_id from baciro_fhir.clinical_impression_finding WHERE finding_id = '" + finding_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addClinicalImpressionFinding"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addClinicalImpressionFinding"});
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