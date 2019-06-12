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
		medicationStatement: function getMedicationStatement(req, res){
			var apikey = req.params.apikey;
			
			var medication_statement_id = req.query.medicationStatementId;
			var category = req.query.category;
			var code = req.query.code;
			var context = req.query.context;
			var effective = req.query.effective;
			var identifier = req.query.identifier;
			var medication = req.query.medication;
			var part_of = req.query.partOf;
			var patient = req.query.patient;
			var source = req.query.source;
			var status = req.query.status;
			var subject = req.query.subject;
			
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof medication_statement_id !== 'undefined' && medication_statement_id !== ""){
        condition += "ms.medication_statement_id = '" + medication_statement_id + "' AND,";  
      }
			
			if(typeof category !== 'undefined' && category !== ""){
        condition += "ms.CATEGORY = '" + category + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
				condition += "ms.MEDICATION_CODEABLE_CONCEPT = '" + code + "' AND,";  
      }
			
			if(typeof context !== 'undefined' && context !== ""){
				condition += "(ms.CONTEXT_ENCOUNTER = '" + context + "' OR ms.CONTEXT_EPISODE_OF_CARE = '" + context + "') AND,";  
			}
			
			if (typeof effective_time !== 'undefined' && effective_time !== "") {
				condition += "ms.EFFECTIVE_DATE_TIME == to_date('" + effective_time + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on ms.MEDICATION_STATEMENT_ID = i.MEDICATION_STATEMENT_ID ";
        condition += "i.identifier_value = '" + identifier + "' AND,";  
      }
			
			if(typeof medication !== 'undefined' && medication !== ""){
				condition += "ms.MEDICATION_REFERENCE = '" + medication + "' AND,";  
      }
			
			//kurang part_of
			/*(MedicationDispense, Observation, MedicationAdministration, Procedure, MedicationStatement)*/
			
			if((typeof part_of !== 'undefined' && part_of !== "")){ 
			 var res = part_of.substring(0, 3);
				if(res == 'mdi'){
					join += " LEFT JOIN BACIRO_FHIR.Medication_Dispense md ON ms.MEDICATION_STATEMENT_ID = md.MEDICATION_STATEMENT_ID ";
          condition += "md.Medication_Dispense_id = '" + part_of + "' AND ";       
				} 			
				if(res == 'mad') {
					join += " LEFT JOIN BACIRO_FHIR.Medication_Administration ma ON ms.MEDICATION_STATEMENT_ID = ms.MEDICATION_STATEMENT_ID ";
          condition += "ma.Medication_Administration_id = '" + part_of + "' AND ";       
				}
				if(res == 'obs'){
					join += " LEFT JOIN BACIRO_FHIR.Observation obs ON ms.MEDICATION_STATEMENT_ID = obs.MEDICATION_STATEMENT_PART_OF_ID ";
          condition += "obs.Observation_id = '" + part_of + "' AND ";       
				} 			
				if(res == 'pro') {
					join += " LEFT JOIN BACIRO_FHIR.Procedure pro ON ms.MEDICATION_STATEMENT_ID = pro.MEDICATION_STATEMENT_ID ";
          condition += "pro.Procedure_id = '" + part_of + "' AND ";       
				}
				
				if(res == 'mes') {
          condition += "ms.part_of = '" + part_of + "' AND ";       
				}
      }
			
			if(typeof subject !== 'undefined' && subject !== ""){
				condition += "(ms.SUBJECT_PATIENT = '" + subject + "' OR ms.SUBJECT_GROUP = '" + subject + "') AND,";  
			}
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "ms.SUBJECT_PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof source !== 'undefined' && source !== ""){
				condition += "(ms.INFORMATION_SOURCE_PATIENT = '" + source + "' OR ms.INFORMATION_SOURCE_PRACTITIONER = '" + source + "' OR ms.INFORMATION_SOURCE_RELATED_PERSON = '" + source + "' OR ms.INFORMATION_SOURCE_ORGANIZATION = '" + source + "') AND,"; 
      }
			
			if(typeof status !== 'undefined' && status !== ""){
        condition += "ms.STATUS = '" + status + "' AND,";  
      }
			
			var offset = req.query.offset;
			var limit = req.query.limit;

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " ms.medication_statement_id > '" + offset + "' AND ";       
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
			      
      var arrMedicationStatement = [];
      var query = "select ms.medication_statement_id as medication_statement_id, ms.part_of as part_of, ms.context_encounter as context_encounter, ms.context_episode_of_care as context_episode_of_care, ms.status as status, ms.category as category, ms.medication_codeable_concept as medication_codeable_concept, ms.medication_reference as medication_reference, ms.effective_date_time as effective_date_time, ms.effective_period_start as effective_period_start, ms.effective_period_end as effective_period_end, ms.date_asserted as date_asserted, ms.information_source_patient as information_source_patient, ms.information_source_practitioner as information_source_practitioner, ms.information_source_related_person as information_source_related_person, ms.information_source_organization as information_source_organization, ms.subject_patient as subject_patient, ms.subject_group as subject_group, ms.derived_from as derived_from, ms.taken as taken, ms.reason_not_taken as reason_not_taken, ms.reason_code as reason_code from BACIRO_FHIR.MEDICATION_STATEMENT ms " + fixCondition + limit;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var MedicationStatement = {};
					MedicationStatement.resourceType = "MedicationStatement";
          MedicationStatement.id = rez[i].medication_statement_id;
					MedicationStatement.partOf = rez[i].part_of;
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
					MedicationStatement.context = Context;
					MedicationStatement.status = rez[i].status;
					MedicationStatement.category = rez[i].category;
					var Medication = {};
					Medication.medicationCodeableConcept = rez[i].medication_codeable_concept;
					if(rez[i].medication_reference != "null"){
						Medication.medicationReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' +  rez[i].medication_reference;
					} else {
						Medication.medicationReference = "";
					}
					MedicationStatement.medication = Medication;
					var Effective = {};
					if(rez[i].effective_date_time == null){
						Effective.effectiveDateTime = formatDate(rez[i].effective_date_time);
					}else{
						Effective.effectiveDateTime = rez[i].effective_date_time;
					}
					
					var effectiveperiod_start,effectiveperiod_end;
					if(rez[i].effective_period_start == null){
						effectiveperiod_start = formatDate(rez[i].effective_period_start);  
					}else{
						effectiveperiod_start = rez[i].effective_period_start;  
					}
					if(rez[i].effective_period_end == null){
						effectiveperiod_end = formatDate(rez[i].effective_period_end);  
					}else{
						effectiveperiod_end = rez[i].effective_period_end;  
					}
					Effective.effectivePeriod = effectiveperiod_start + ' to ' + effectiveperiod_end;
					MedicationStatement.effective = Effective;
					
					
					if(rez[i].date_asserted == null){
						MedicationStatement.dateAsserted = formatDate(rez[i].date_asserted);
					}else{
						MedicationStatement.dateAsserted = rez[i].date_asserted;
					}
					var InformationSource = {};
					if(rez[i].information_source_patient != "null"){
						InformationSource.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].information_source_patient;
					} else {
						InformationSource.patient = "";
					}
					if(rez[i].information_source_practitioner != "null"){
						InformationSource.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/practitioner?_id=' +  rez[i].information_source_practitioner;
					} else {
						InformationSource.practitioner = "";
					}
					if(rez[i].information_source_related_person != "null"){
						InformationSource.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].information_source_related_person;
					} else {
						InformationSource.relatedPerson = "";
					}
					if(rez[i].information_source_organization != "null"){
						InformationSource.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].information_source_organization;
					} else {
						InformationSource.organization = "";
					}
					MedicationStatement.informationSource = InformationSource;
					
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
					MedicationStatement.subject = Subject;
					
					MedicationStatement.derivedFrom = rez[i].derived_from;
					MedicationStatement.taken = rez[i].taken;
					MedicationStatement.reasonNotTaken = rez[i].reason_not_taken;
					MedicationStatement.reasonCode = rez[i].reason_code;
					
          arrMedicationStatement[i] = MedicationStatement;
        }
        res.json({"err_code":0,"data": arrMedicationStatement});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationStatement"});
      });
    },
		
		medicationStatementBasedOnCarePlan: function getMedicationStatementBasedOnCarePlan(req, res) {
			var apikey = req.params.apikey;
			
			var CarePlanId = req.query._id;
			var medicationStatementId = req.query.medication_statement_id;

			//susun query
			var condition = '';

			if (typeof CarePlanId !== 'undefined' && CarePlanId !== "") {
				condition += "careplan_id = '" + CarePlanId + "' AND ";
			}

			if (typeof medicationStatementId !== 'undefined' && medicationStatementId !== "") {
				condition += "medication_statement_id = '" + medicationStatementId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationStatementBasedOnCarePlan = [];
			var query = 'select careplan_id from BACIRO_FHIR.careplan ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationStatementBasedOnCarePlan = {};
					if(rez[i].careplan_id != "null"){
						medicationStatementBasedOnCarePlan.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/CarePlan?_id=' +  rez[i].careplan_id;
					} else {
						medicationStatementBasedOnCarePlan.id = "";
					}
					
					arrMedicationStatementBasedOnCarePlan[i] = medicationStatementBasedOnCarePlan;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationStatementBasedOnCarePlan
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationStatementBasedOnCarePlan"
				});
			});
		},
		medicationStatementBasedOnProcedureRequest: function getMedicationStatementBasedOnProcedureRequest(req, res) {
			var apikey = req.params.apikey;
			
			var ProcedureRequestId = req.query._id;
			var medicationStatementId = req.query.medication_statement_id;

			//susun query
			var condition = '';

			if (typeof ProcedureRequestId !== 'undefined' && ProcedureRequestId !== "") {
				condition += "procedure_request_id = '" + ProcedureRequestId + "' AND ";
			}

			if (typeof medicationStatementId !== 'undefined' && medicationStatementId !== "") {
				condition += "medication_statement_id = '" + medicationStatementId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationStatementBasedOnProcedureRequest = [];
			var query = 'select procedure_request_id from BACIRO_FHIR.procedure_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationStatementBasedOnProcedureRequest = {};
					if(rez[i].procedure_request_id != "null"){
						medicationStatementBasedOnProcedureRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/ProcedureRequest?_id=' +  rez[i].procedure_request_id;
					} else {
						medicationStatementBasedOnProcedureRequest.id = "";
					}
					
					arrMedicationStatementBasedOnProcedureRequest[i] = medicationStatementBasedOnProcedureRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationStatementBasedOnProcedureRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationStatementBasedOnProcedureRequest"
				});
			});
		},
		medicationStatementBasedOnReferralRequest: function getMedicationStatementBasedOnReferralRequest(req, res) {
			var apikey = req.params.apikey;
			
			var ReferralRequestId = req.query._id;
			var medicationStatementId = req.query.medication_statement_id;

			//susun query
			var condition = '';

			if (typeof ReferralRequestId !== 'undefined' && ReferralRequestId !== "") {
				condition += "referral_request_id = '" + ReferralRequestId + "' AND ";
			}

			if (typeof medicationStatementId !== 'undefined' && medicationStatementId !== "") {
				condition += "medication_statement_id = '" + medicationStatementId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationStatementBasedOnReferralRequest = [];
			var query = 'select referral_request_id from BACIRO_FHIR.referral_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationStatementBasedOnReferralRequest = {};
					if(rez[i].referral_request_id != "null"){
						medicationStatementBasedOnReferralRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/ReferralRequest?_id=' +  rez[i].referral_request_id;
					} else {
						medicationStatementBasedOnReferralRequest.id = "";
					}
					
					arrMedicationStatementBasedOnReferralRequest[i] = medicationStatementBasedOnReferralRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationStatementBasedOnReferralRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationStatementBasedOnReferralRequest"
				});
			});
		},
		medicationStatementBasedOnMedicationRequest: function getMedicationStatementBasedOnMedicationRequest(req, res) {
			var apikey = req.params.apikey;
			
			var medicationRequestId = req.query._id;
			var medicationStatementId = req.query.medication_statement_id;

			//susun query
			var condition = '';

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "medication_request_id = '" + medicationRequestId + "' AND ";
			}

			if (typeof medicationStatementId !== 'undefined' && medicationStatementId !== "") {
				condition += "medication_statement_id = '" + medicationStatementId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationStatementBasedOnMedicationRequest = [];
			var query = 'select medication_request_id from BACIRO_FHIR.medication_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationStatementBasedOnMedicationRequest = {};
					if(rez[i].medication_request_id != "null"){
						medicationStatementBasedOnMedicationRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationRequest?_id=' +  rez[i].medication_request_id;
					} else {
						medicationStatementBasedOnMedicationRequest.id = "";
					}
					
					arrMedicationStatementBasedOnMedicationRequest[i] = medicationStatementBasedOnMedicationRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationStatementBasedOnMedicationRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationStatementBasedOnMedicationRequest"
				});
			});
		},
		
		medicationStatementPartOfMedicationAdministration: function getMedicationStatementPartOfMedicationAdministration(req, res) {
			var apikey = req.params.apikey;
			
			var MedicationAdministrationId = req.query._id;
			var medicationStatementId = req.query.medication_statement_id;

			//susun query
			var condition = '';

			if (typeof MedicationAdministrationId !== 'undefined' && MedicationAdministrationId !== "") {
				condition += "medication_administration_id = '" + MedicationAdministrationId + "' AND ";
			}

			if (typeof medicationStatementId !== 'undefined' && medicationStatementId !== "") {
				condition += "medication_statement_id = '" + medicationStatementId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationStatementPartOfMedicationAdministration = [];
			var query = 'select medication_administration_id from BACIRO_FHIR.medication_administration ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationStatementPartOfMedicationAdministration = {};
					if(rez[i].medication_administration_id != "null"){
						medicationStatementPartOfMedicationAdministration.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationAdministration?_id=' +  rez[i].medication_administration_id;
					} else {
						medicationStatementPartOfMedicationAdministration.id = "";
					}
					
					arrMedicationStatementPartOfMedicationAdministration[i] = medicationStatementPartOfMedicationAdministration;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationStatementPartOfMedicationAdministration
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationStatementPartOfMedicationAdministration"
				});
			});
		},
		medicationStatementPartOfMedicationDispense: function getMedicationStatementPartOfMedicationDispense(req, res) {
			var apikey = req.params.apikey;
			
			var MedicationDispenseId = req.query._id;
			var medicationStatementId = req.query.medication_statement_id;

			//susun query
			var condition = '';

			if (typeof MedicationDispenseId !== 'undefined' && MedicationDispenseId !== "") {
				condition += "medication_dispense_id = '" + MedicationDispenseId + "' AND ";
			}

			if (typeof medicationStatementId !== 'undefined' && medicationStatementId !== "") {
				condition += "medication_statement_id = '" + medicationStatementId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationStatementPartOfMedicationDispense = [];
			var query = 'select medication_dispense_id from BACIRO_FHIR.medication_dispense ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationStatementPartOfMedicationDispense = {};
					if(rez[i].medication_dispense_id != "null"){
						medicationStatementPartOfMedicationDispense.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationDispense?_id=' +  rez[i].medication_dispense_id;
					} else {
						medicationStatementPartOfMedicationDispense.id = "";
					}
					
					arrMedicationStatementPartOfMedicationDispense[i] = medicationStatementPartOfMedicationDispense;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationStatementPartOfMedicationDispense
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationStatementPartOfMedicationDispense"
				});
			});
		},
		medicationStatementPartOfMedicationStatement: function getMedicationStatementPartOfMedicationStatement(req, res) {
			var apikey = req.params.apikey;
			
			var MedicationStatementId = req.query._id;
			var partOfId = req.query.medication_statement_id;

			//susun query
			var condition = '';

			if (typeof MedicationStatementId !== 'undefined' && MedicationStatementId !== "") {
				condition += "medication_statement_id = '" + MedicationStatementId + "' AND ";
			}

			if (typeof partOfId !== 'undefined' && partOfId !== "") {
				condition += "part_of = '" + partOfId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationStatementPartOfMedicationStatement = [];
			var query = 'select medication_statement_id from BACIRO_FHIR.medication_statement ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationStatementPartOfMedicationStatement = {};
					if(rez[i].medication_statement_id != "null"){
						medicationStatementPartOfMedicationStatement.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationStatement?_id=' +  rez[i].medication_statement_id;
					} else {
						medicationStatementPartOfMedicationStatement.id = "";
					}
					
					arrMedicationStatementPartOfMedicationStatement[i] = medicationStatementPartOfMedicationStatement;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationStatementPartOfMedicationStatement
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationStatementPartOfMedicationStatement"
				});
			});
		},
		medicationStatementPartOfProcedure: function getMedicationStatementPartOfProcedure(req, res) {
			var apikey = req.params.apikey;
			
			var ProcedureId = req.query._id;
			var medicationStatementId = req.query.medication_statement_id;

			//susun query
			var condition = '';

			if (typeof ProcedureId !== 'undefined' && ProcedureId !== "") {
				condition += "procedure_id = '" + ProcedureId + "' AND ";
			}

			if (typeof medicationStatementId !== 'undefined' && medicationStatementId !== "") {
				condition += "medication_statement_id = '" + medicationStatementId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationStatementPartOfProcedure = [];
			var query = 'select procedure_id from BACIRO_FHIR.procedure ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationStatementPartOfProcedure = {};
					if(rez[i].procedure_id != "null"){
						medicationStatementPartOfProcedure.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Procedure?_id=' +  rez[i].procedure_id;
					} else {
						medicationStatementPartOfProcedure.id = "";
					}
					
					arrMedicationStatementPartOfProcedure[i] = medicationStatementPartOfProcedure;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationStatementPartOfProcedure
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationStatementPartOfProcedure"
				});
			});
		},
		medicationStatementPartOfObservation: function getMedicationStatementPartOfObservation(req, res) {
			var apikey = req.params.apikey;
			
			var ObservationId = req.query._id;
			var medicationStatementId = req.query.medication_statement_id;

			//susun query
			var condition = '';

			if (typeof ObservationId !== 'undefined' && ObservationId !== "") {
				condition += "observation_id = '" + ObservationId + "' AND ";
			}

			if (typeof medicationStatementId !== 'undefined' && medicationStatementId !== "") {
				condition += "MEDICATION_STATEMENT_PART_OF_ID = '" + medicationStatementId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationStatementPartOfObservation = [];
			var query = 'select observation_id from BACIRO_FHIR.observation ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationStatementPartOfObservation = {};
					if(rez[i].observation_id != "null"){
						medicationStatementPartOfObservation.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Observation?_id=' +  rez[i].observation_id;
					} else {
						medicationStatementPartOfObservation.id = "";
					}
					
					arrMedicationStatementPartOfObservation[i] = medicationStatementPartOfObservation;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationStatementPartOfObservation
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationStatementPartOfObservation"
				});
			});
		},
		
		medicationStatementReasonReferenceCondition: function getMedicationStatementReasonReferenceCondition(req, res) {
			var apikey = req.params.apikey;
			
			var ConditionId = req.query._id;
			var medicationStatementId = req.query.medication_statement_id;

			//susun query
			var condition = '';

			if (typeof ConditionId !== 'undefined' && ConditionId !== "") {
				condition += "condition_id = '" + ConditionId + "' AND ";
			}

			if (typeof medicationStatementId !== 'undefined' && medicationStatementId !== "") {
				condition += "medication_statement_id = '" + medicationStatementId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationStatementReasonReferenceCondition = [];
			var query = 'select condition_id from BACIRO_FHIR.condition ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationStatementReasonReferenceCondition = {};
					if(rez[i].condition_id != "null"){
						medicationStatementReasonReferenceCondition.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Condition?_id=' +  rez[i].condition_id;
					} else {
						medicationStatementReasonReferenceCondition.id = "";
					}
					
					arrMedicationStatementReasonReferenceCondition[i] = medicationStatementReasonReferenceCondition;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationStatementReasonReferenceCondition
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationStatementReasonReferenceCondition"
				});
			});
		},
		medicationStatementReasonReferenceObservation: function getMedicationStatementReasonReferenceObservation(req, res) {
			var apikey = req.params.apikey;
			
			var ObservationId = req.query._id;
			var medicationStatementId = req.query.medication_statement_id;

			//susun query
			var condition = '';

			if (typeof ObservationId !== 'undefined' && ObservationId !== "") {
				condition += "observation_id = '" + ObservationId + "' AND ";
			}

			if (typeof medicationStatementId !== 'undefined' && medicationStatementId !== "") {
				condition += "MEDICATION_STATEMENT_REASON_REFERENCE_ID = '" + medicationStatementId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationStatementReasonReferenceObservation = [];
			var query = 'select observation_id from BACIRO_FHIR.observation ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationStatementReasonReferenceObservation = {};
					if(rez[i].observation_id != "null"){
						medicationStatementReasonReferenceObservation.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Observation?_id=' +  rez[i].observation_id;
					} else {
						medicationStatementReasonReferenceObservation.id = "";
					}
					
					arrMedicationStatementReasonReferenceObservation[i] = medicationStatementReasonReferenceObservation;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationStatementReasonReferenceObservation
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationStatementReasonReferenceObservation"
				});
			});
		},
  },
	post: {
		medicationStatement: function addMedicationStatement(req, res) {
			console.log(req.body);
			var medication_statement_id = req.body.medication_statement_id;
			var part_of = req.body.part_of;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var status = req.body.status;
			var category = req.body.category;
			var medication_codeable_concept = req.body.medication_codeable_concept;
			var medication_reference = req.body.medication_reference;
			var effective_date_time = req.body.effective_date_time;
			var effective_period_start = req.body.effective_period_start;
			var effective_period_end = req.body.effective_period_end;
			var date_asserted = req.body.date_asserted;
			var information_source_patient = req.body.information_source_patient;
			var information_source_practitioner = req.body.information_source_practitioner;
			var information_source_related_person = req.body.information_source_related_person;
			var information_source_organization = req.body.information_source_organization;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var derived_from = req.body.derived_from;
			var taken = req.body.taken;
			var reason_not_taken = req.body.reason_not_taken;
			var reason_code = req.body.reason_code;
			
			var column = "";
      var values = "";
			
			
			if (typeof effective_date_time !== 'undefined' && effective_date_time !== "") {
        column += 'effective_date_time,';
				values += "to_date('"+ effective_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_start !== 'undefined' && effective_period_start !== "") {
        column += 'effective_period_start,';
				values += "to_date('"+ effective_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_end !== 'undefined' && effective_period_end !== "") {
        column += 'effective_period_end,';
				values += "to_date('"+ effective_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof date_asserted !== 'undefined' && date_asserted !== "") {
        column += 'date_asserted,';
				values += "to_date('"+ date_asserted + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof part_of !== 'undefined' && part_of !== "") {
        column += 'part_of,';
        values += "'" + part_of + "',";
      }
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }		
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }	
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }	
			
			if (typeof medication_codeable_concept !== 'undefined' && medication_codeable_concept !== "") {
        column += 'medication_codeable_concept,';
        values += "'" + medication_codeable_concept + "',";
      }
			
			if (typeof medication_reference !== 'undefined' && medication_reference !== "") {
        column += 'medication_reference,';
        values += "'" + medication_reference + "',";
      }		
			
			if (typeof information_source_patient !== 'undefined' && information_source_patient !== "") {
        column += 'information_source_patient,';
        values += "'" + information_source_patient + "',";
      }		
			
			if (typeof information_source_practitioner !== 'undefined' && information_source_practitioner !== "") {
        column += 'information_source_practitioner,';
        values += "'" + information_source_practitioner + "',";
      }		
			
			if (typeof information_source_related_person !== 'undefined' && information_source_related_person !== "") {
        column += 'information_source_related_person,';
        values += "'" + information_source_related_person + "',";
      }		
			
			if (typeof information_source_organization !== 'undefined' && information_source_organization !== "") {
        column += 'information_source_organization,';
        values += "'" + information_source_organization + "',";
      }	
			
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }		
			
			if (typeof subject_group !== 'undefined' && subject_group !== "") {
        column += 'subject_group,';
        values += "'" + subject_group + "',";
      }		
			
			if (typeof derived_from !== 'undefined' && derived_from !== "") {
        column += 'derived_from,';
        values += "'" + derived_from + "',";
      }		
			
			if (typeof taken !== 'undefined' && taken !== "") {
        column += 'taken,';
        values += "'" + taken + "',";
      }
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }
			
			if (typeof reason_not_taken !== 'undefined' && reason_not_taken !== "") {
        column += 'reason_not_taken,';
        values += "'" + reason_not_taken + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_STATEMENT(medication_statement_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+medication_statement_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select medication_statement_id, part_of, context_encounter, context_episode_of_care, status, category, medication_codeable_concept, medication_reference, effective_date_time, effective_period_start, effective_period_end, date_asserted, information_source_patient, information_source_practitioner, information_source_related_person, information_source_organization, subject_patient, subject_group, derived_from, taken, reason_not_taken, reason_code from BACIRO_FHIR.MEDICATION_STATEMENT WHERE medication_statement_id = '" + medication_statement_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationStatement"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationStatement"});
      });
    }
	},
	put: {
		medicationStatement: function updateMedicationStatement(req, res) {
			console.log(req.body);
			var medication_statement_id = req.params._id;
			var part_of = req.body.part_of;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var status = req.body.status;
			var category = req.body.category;
			var medication_codeable_concept = req.body.medication_codeable_concept;
			var medication_reference = req.body.medication_reference;
			var effective_date_time = req.body.effective_date_time;
			var effective_period_start = req.body.effective_period_start;
			var effective_period_end = req.body.effective_period_end;
			var date_asserted = req.body.date_asserted;
			var information_source_patient = req.body.information_source_patient;
			var information_source_practitioner = req.body.information_source_practitioner;
			var information_source_related_person = req.body.information_source_related_person;
			var information_source_organization = req.body.information_source_organization;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var derived_from = req.body.derived_from;
			var taken = req.body.taken;
			var reason_not_taken = req.body.reason_not_taken;
			var reason_code = req.body.reason_code;
			
			var column = "";
      var values = "";
			
			
			if (typeof effective_date_time !== 'undefined' && effective_date_time !== "") {
        column += 'effective_date_time,';
				values += "to_date('"+ effective_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_start !== 'undefined' && effective_period_start !== "") {
        column += 'effective_period_start,';
				values += "to_date('"+ effective_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_end !== 'undefined' && effective_period_end !== "") {
        column += 'effective_period_end,';
				values += "to_date('"+ effective_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof date_asserted !== 'undefined' && date_asserted !== "") {
        column += 'date_asserted,';
				values += "to_date('"+ date_asserted + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof part_of !== 'undefined' && part_of !== "") {
        column += 'part_of,';
        values += "'" + part_of + "',";
      }
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }		
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }	
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }	
			
			if (typeof medication_codeable_concept !== 'undefined' && medication_codeable_concept !== "") {
        column += 'medication_codeable_concept,';
        values += "'" + medication_codeable_concept + "',";
      }
			
			if (typeof medication_reference !== 'undefined' && medication_reference !== "") {
        column += 'medication_reference,';
        values += "'" + medication_reference + "',";
      }		
			
			if (typeof information_source_patient !== 'undefined' && information_source_patient !== "") {
        column += 'information_source_patient,';
        values += "'" + information_source_patient + "',";
      }		
			
			if (typeof information_source_practitioner !== 'undefined' && information_source_practitioner !== "") {
        column += 'information_source_practitioner,';
        values += "'" + information_source_practitioner + "',";
      }		
			
			if (typeof information_source_related_person !== 'undefined' && information_source_related_person !== "") {
        column += 'information_source_related_person,';
        values += "'" + information_source_related_person + "',";
      }		
			
			if (typeof information_source_organization !== 'undefined' && information_source_organization !== "") {
        column += 'information_source_organization,';
        values += "'" + information_source_organization + "',";
      }	
			
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }		
			
			if (typeof subject_group !== 'undefined' && subject_group !== "") {
        column += 'subject_group,';
        values += "'" + subject_group + "',";
      }		
			
			if (typeof derived_from !== 'undefined' && derived_from !== "") {
        column += 'derived_from,';
        values += "'" + derived_from + "',";
      }		
			
			if (typeof taken !== 'undefined' && taken !== "") {
        column += 'taken,';
        values += "'" + taken + "',";
      }
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }
			
			if (typeof reason_not_taken !== 'undefined' && reason_not_taken !== "") {
        column += 'reason_not_taken,';
        values += "'" + reason_not_taken + "',";
      }
			
			
      var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "medication_statement_id = '" + medication_statement_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "medication_statement_id = '" + medication_statement_id + "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_STATEMENT(medication_statement_id," + column.slice(0, -1) + ") SELECT medication_statement_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_STATEMENT WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select medication_statement_id, part_of, context_encounter, context_episode_of_care, status, category, medication_codeable_concept, medication_reference, effective_date_time, effective_period_start, effective_period_end, date_asserted, information_source_patient, information_source_practitioner, information_source_related_person, information_source_organization, subject_patient, subject_group, derived_from, taken, reason_not_taken, reason_code from BACIRO_FHIR.MEDICATION_STATEMENT WHERE medication_statement_id = '" + medication_statement_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationStatement"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationStatement"});
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