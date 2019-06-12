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
		medicationRequest: function getMedicationRequest(req, res){
			var apikey = req.params.apikey;
			
			var medication_request_id = req.query.medicationRequestId;
			var authoredon = req.query.authoredon;
			var category = req.query.category;
			var code = req.query.code;
			var context = req.query.context;
			var date = req.query.date;
			var identifier = req.query.identifier;
			var intended_dispenser = req.query.intendedDispenser;
			var intent = req.query.intent;
			var medication = req.query.medication;
			var patient = req.query.patient;
			var priority = req.query.priority;
			var requester = req.query.requester;
			var status = req.query.status;
			var subject = req.query.subject;
			
			
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof medication_request_id !== 'undefined' && medication_request_id !== ""){
        condition += "mr.medication_request_id = '" + medication_request_id + "' AND,";  
      }
			
			if (typeof authoredon !== 'undefined' && authoredon !== "") {
				condition += "mr.AUTHORED_ON == to_date('" + authoredon + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof category !== 'undefined' && category !== ""){
        condition += "mr.CATEGORY = '" + category + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
				condition += "mr.MEDICATION_CODEABLE_CONCEPT = '" + code + "' AND,";  
      }
			
			if(typeof context !== 'undefined' && context !== ""){
				condition += "(mr.CONTEXT_ENCOUNTER = '" + context + "' OR mr.CONTEXT_EPISODE_OF_CARE = '" + context + "') AND,";  
			}
			
			if (typeof date !== 'undefined' && date !== "") {
				//left join ke dosage lalu ke timing field event
				join += " LEFT JOIN BACIRO_FHIR.DOSAGE dos on mr.MEDICATION_REQUEST_ID = dos.MEDICATION_REQUEST_ID LEFT JOIN BACIRO_FHIR.TIMING tim on dos.dosage_id = tim.dosage_id ";
				condition += "tim.EVENT <= to_date('" + date + "', 'yyyy-MM-dd') AND tim.EVENT >= to_date('" + date + "', 'yyyy-MM-dd') AND,";
			}
			
			if (typeof intended_dispenser !== 'undefined' && intended_dispenser !== "") {
				condition += "mr.PERFORMER = '" + intended_dispenser + "' AND,";  
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on mr.MEDICATION_REQUEST_ID = i.MEDICATION_REQUEST_ID ";
        condition += "i.identifier_value = '" + identifier + "' AND,";  
      }
			
			if(typeof intent !== 'undefined' && intent !== ""){
        condition += "mr.intent = " + intent + " AND,";  
      }
			
			if(typeof subject !== 'undefined' && subject !== ""){
				condition += "(mr.SUBJECT_PATIENT = '" + subject + "' OR mr.SUBJECT_GROUP = '" + subject + "') AND,";  
			}
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "mr.SUBJECT_PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof requester !== 'undefined' && requester !== ""){
				condition += "(mr.AGENT_PRACTITIONER = '" + requester + "' OR mr.AGENT_ORGANIZATION = '" + requester + "' OR mr.AGENT_PATIENT = '" + requester + "' OR mr.AGENT_RELATED_PERSON = '" + requester + "' OR mr.AGENT_DEVICE = '" + requester + "') AND,"; 
      }
			
			if(typeof medication !== 'undefined' && medication !== ""){
        condition += "mr.MEDICATION_REFERENCE = '" + medication + "' AND,";  
      }
			
			if(typeof priority !== 'undefined' && priority !== ""){
        condition += "mr.PRIORITY = '" + priority + "' AND,";  
      }
			
			if(typeof status !== 'undefined' && status !== ""){
        condition += "mr.STATUS = '" + status + "' AND,";  
      }
			
			var offset = req.query.offset;
			var limit = req.query.limit;

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " mr.medication_request_id > '" + offset + "' AND ";       
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
			      
      var arrMedicationRequest = [];
      var query = "select mr.medication_request_id as medication_request_id, mr.based_on as based_on, mr.group_identifier as group_identifier, mr.status as status, mr.intent as intent, mr.category as category, mr.priority as priority, mr.medication_codeable_concept as medication_codeable_concept, mr.medication_reference as medication_reference, mr.subject_patient as subject_patient, mr.subject_group as subject_group, mr.context_encounter as context_encounter, mr.context_episode_of_care as context_episode_of_care, mr.supporting_information as supporting_information, mr.authored_on as authored_on, mr.recorder as recorder, mr.reason_code as reason_code, mr.prior_prescription as prior_prescription, mr.agent_practitioner as agent_practitioner, mr.agent_organization as agent_organization, mr.agent_patient as agent_patient, mr.agent_related_person as agent_related_person, mr.agent_device as agent_device, mr.on_behalf_of as on_behalf_of, mr.allowed as allowed, mr.reason as reason, mr.validity_period_start as validity_period_start, mr.validity_period_end as validity_period_end, mr.number_of_repeats_allowed as number_of_repeats_allowed, mr.quantity as quantity, mr.expected_supply_duration as expected_supply_duration, mr.performer as performer from BACIRO_FHIR.MEDICATION_REQUEST mr " + fixCondition + limit;
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var MedicationRequest = {};
					MedicationRequest.resourceType = "MedicationRequest";
          MedicationRequest.id = rez[i].medication_request_id;
					MedicationRequest.basedOn = rez[i].based_on;
					MedicationRequest.groupIdentifier = rez[i].group_identifier;
					MedicationRequest.status = rez[i].status;
					MedicationRequest.intent = rez[i].intent;
					MedicationRequest.category = rez[i].category;
					MedicationRequest.priority = rez[i].priority;
					var Medication = {};
					Medication.medicationCodeableConcept = rez[i].medication_codeable_concept;
					Medication.medicationReference = rez[i].medication_reference;
					MedicationRequest.medication = Medication;
					
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
					MedicationRequest.subject = Subject;
					MedicationRequest.context = Context;
					MedicationRequest.supportingInformation = rez[i].supporting_information;
					if(rez[i].authored_on == null){
						MedicationRequest.authoredOn = formatDate(rez[i].authored_on);
					}else{
						MedicationRequest.authoredOn = rez[i].authored_on;
					}
					if(rez[i].recorder != "null"){
						MedicationRequest.recorder = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].recorder;
					} else {
						MedicationRequest.recorder = "";
					}
					MedicationRequest.reasonCode = rez[i].reason_code;
					if(rez[i].prior_prescription != "null"){
						MedicationRequest.priorPrescription = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationRequest?_id=' +  rez[i].prior_prescription;
					} else {
						MedicationRequest.priorPrescription = "";
					}
					
					var MedicationRequestRequester = {};
					var Agent = {};
					if(rez[i].agent_practitioner != "null"){
						Agent.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].agent_practitioner;
					} else {
						Agent.practitioner = "";
					}
					if(rez[i].agent_organization != "null"){
						Agent.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].agent_organization;
					} else {
						Agent.organization = "";
					}
					if(rez[i].agent_patient != "null"){
						Agent.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].agent_patient;
					} else {
						Agent.patient = "";
					}
					if(rez[i].agent_related_person != "null"){
						Agent.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].agent_related_person;
					} else {
						Agent.relatedPerson = "";
					}
					if(rez[i].agent_device != "null"){
						Agent.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].agent_device;
					} else {
						Agent.device = "";
					}
					MedicationRequestRequester.agent  = Agent;
					
					if (rez[i].on_behalf_of !== 'null') {
						MedicationRequestRequester.onBehalfOf  = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].on_behalf_of;
					} else {
						MedicationRequestRequester.onBehalfOf  = "";
					}
					MedicationRequest.requester = MedicationRequestRequester;
					
					var MedicationRequestSubtitution = {};
					MedicationRequestSubtitution.allowed = rez[i].allowed;
					MedicationRequestSubtitution.reason = rez[i].reason;
					MedicationRequest.substitution = MedicationRequestSubtitution;
					
					var MedicationRequestDispenseRequest = {};
					var validityperiod_start,validityperiod_end;
					if(rez[i].validity_period_start == null){
						validityperiod_start = formatDate(rez[i].validity_period_start);  
					}else{
						validityperiod_start = rez[i].validity_period_start;  
					}
					if(rez[i].validity_period_end == null){
						validityperiod_end = formatDate(rez[i].validity_period_end);  
					}else{
						validityperiod_end = rez[i].validity_period_end;  
					}
					MedicationRequestDispenseRequest.validityPeriod = validityperiod_start + ' to ' + validityperiod_end;
					MedicationRequestDispenseRequest.numberOfRepeatsAllowed = rez[i].number_of_repeats_allowed;
					MedicationRequestDispenseRequest.quantity = rez[i].quantity;
					MedicationRequestDispenseRequest.expectedSupplyDuration = rez[i].expected_supply_duration;
					if(rez[i].performer != "null"){
						MedicationRequestDispenseRequest.performer = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].performer;
					} else {
						MedicationRequestDispenseRequest.performer = "";
					}
					MedicationRequest.dispenseRequest = MedicationRequestDispenseRequest;
          arrMedicationRequest[i] = MedicationRequest;
        }
        res.json({"err_code":0,"data": arrMedicationRequest});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationRequest"});
      });
    },
		
		medicationRequestDefinitionPlanDefinition: function getMedicationRequestDefinitionPlanDefinition(req, res) {
			var apikey = req.params.apikey;
			
			var PlanDefinitionId = req.query._id;
			var medicationRequestId = req.query.medication_request_id;

			//susun query
			var condition = '';

			if (typeof PlanDefinitionId !== 'undefined' && PlanDefinitionId !== "") {
				condition += "plan_definition_id = '" + PlanDefinitionId + "' AND ";
			}

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "medication_request_id = '" + medicationRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestDefinitionPlanDefinition = [];
			var query = 'select plan_definition_id from BACIRO_FHIR.Plan_Definition ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationRequestDefinitionPlanDefinition = {};
					if(rez[i].plan_definition_id != "null"){
						medicationRequestDefinitionPlanDefinition.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/PlanDefinition?_id=' +  rez[i].plan_definition_id;
					} else {
						medicationRequestDefinitionPlanDefinition.id = "";
					}
					
					arrMedicationRequestDefinitionPlanDefinition[i] = medicationRequestDefinitionPlanDefinition;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestDefinitionPlanDefinition
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestDefinitionPlanDefinition"
				});
			});
		},
		medicationRequestDefinitionActivityDefinition: function getMedicationRequestDefinitionActivityDefinition(req, res) {
			var apikey = req.params.apikey;
			
			var ActivityDefinitionId = req.query._id;
			var medicationRequestId = req.query.medication_request_id;

			//susun query
			var condition = '';

			if (typeof ActivityDefinitionId !== 'undefined' && ActivityDefinitionId !== "") {
				condition += "activity_definition_id = '" + ActivityDefinitionId + "' AND ";
			}

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "medication_request_id = '" + medicationRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestDefinitionActivityDefinition = [];
			var query = 'select activity_definition_id from BACIRO_FHIR.activity_definition ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationRequestDefinitionActivityDefinition = {};
					if(rez[i].activity_definition_id != "null"){
						medicationRequestDefinitionActivityDefinition.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/ActivityDefinition?_id=' +  rez[i].activity_definition_id;
					} else {
						medicationRequestDefinitionActivityDefinition.id = "";
					}
					
					arrMedicationRequestDefinitionActivityDefinition[i] = medicationRequestDefinitionActivityDefinition;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestDefinitionActivityDefinition
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestDefinitionActivityDefinition"
				});
			});
		},
		
		medicationRequestBasedOnCarePlan: function getMedicationRequestBasedOnCarePlan(req, res) {
			var apikey = req.params.apikey;
			
			var CarePlanId = req.query._id;
			var medicationRequestId = req.query.medication_request_id;

			//susun query
			var condition = '';

			if (typeof CarePlanId !== 'undefined' && CarePlanId !== "") {
				condition += "careplan_id = '" + CarePlanId + "' AND ";
			}

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "medication_request_id = '" + medicationRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestBasedOnCarePlan = [];
			var query = 'select careplan_id from BACIRO_FHIR.careplan ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationRequestBasedOnCarePlan = {};
					if(rez[i].careplan_id != "null"){
						medicationRequestBasedOnCarePlan.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/CarePlan?_id=' +  rez[i].careplan_id;
					} else {
						medicationRequestBasedOnCarePlan.id = "";
					}
					
					arrMedicationRequestBasedOnCarePlan[i] = medicationRequestBasedOnCarePlan;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestBasedOnCarePlan
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestBasedOnCarePlan"
				});
			});
		},
		medicationRequestBasedOnProcedureRequest: function getMedicationRequestBasedOnProcedureRequest(req, res) {
			var apikey = req.params.apikey;
			
			var ProcedureRequestId = req.query._id;
			var medicationRequestId = req.query.medication_request_id;

			//susun query
			var condition = '';

			if (typeof ProcedureRequestId !== 'undefined' && ProcedureRequestId !== "") {
				condition += "procedure_request_id = '" + ProcedureRequestId + "' AND ";
			}

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "medication_request_id = '" + medicationRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestBasedOnProcedureRequest = [];
			var query = 'select procedure_request_id from BACIRO_FHIR.procedure_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationRequestBasedOnProcedureRequest = {};
					if(rez[i].procedure_request_id != "null"){
						medicationRequestBasedOnProcedureRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/ProcedureRequest?_id=' +  rez[i].procedure_request_id;
					} else {
						medicationRequestBasedOnProcedureRequest.id = "";
					}
					
					arrMedicationRequestBasedOnProcedureRequest[i] = medicationRequestBasedOnProcedureRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestBasedOnProcedureRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestBasedOnProcedureRequest"
				});
			});
		},
		medicationRequestBasedOnReferralRequest: function getMedicationRequestBasedOnReferralRequest(req, res) {
			var apikey = req.params.apikey;
			
			var ReferralRequestId = req.query._id;
			var medicationRequestId = req.query.medication_request_id;

			//susun query
			var condition = '';

			if (typeof ReferralRequestId !== 'undefined' && ReferralRequestId !== "") {
				condition += "referral_request_id = '" + ReferralRequestId + "' AND ";
			}

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "medication_request_id = '" + medicationRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestBasedOnReferralRequest = [];
			var query = 'select referral_request_id from BACIRO_FHIR.referral_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationRequestBasedOnReferralRequest = {};
					if(rez[i].referral_request_id != "null"){
						medicationRequestBasedOnReferralRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/ReferralRequest?_id=' +  rez[i].referral_request_id;
					} else {
						medicationRequestBasedOnReferralRequest.id = "";
					}
					
					arrMedicationRequestBasedOnReferralRequest[i] = medicationRequestBasedOnReferralRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestBasedOnReferralRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestBasedOnReferralRequest"
				});
			});
		},
		medicationRequestBasedOnMedicationRequest: function getMedicationRequestBasedOnMedicationRequest(req, res) {
			var apikey = req.params.apikey;
			
			var medicationRequestId = req.query._id;
			var BasedOnId = req.query.medication_request_id;

			//susun query
			var condition = '';

			if (typeof BasedOnId !== 'undefined' && BasedOnId !== "") {
				condition += "based_on = '" + BasedOnId + "' AND ";
			}

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "medication_request_id = '" + medicationRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestBasedOnMedicationRequest = [];
			var query = 'select medication_request_id from BACIRO_FHIR.medication_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationRequestBasedOnMedicationRequest = {};
					if(rez[i].medication_request_id != "null"){
						medicationRequestBasedOnMedicationRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationRequest?_id=' +  rez[i].medication_request_id;
					} else {
						medicationRequestBasedOnMedicationRequest.id = "";
					}
					
					arrMedicationRequestBasedOnMedicationRequest[i] = medicationRequestBasedOnMedicationRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestBasedOnMedicationRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestBasedOnMedicationRequest"
				});
			});
		},
		
		medicationRequestReasonReferenceCondition: function getMedicationRequestReasonReferenceCondition(req, res) {
			var apikey = req.params.apikey;
			
			var ConditionId = req.query._id;
			var medicationRequestId = req.query.medication_request_id;

			//susun query
			var condition = '';

			if (typeof ConditionId !== 'undefined' && ConditionId !== "") {
				condition += "condition_id = '" + ConditionId + "' AND ";
			}

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "medication_request_id = '" + medicationRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestReasonReferenceCondition = [];
			var query = 'select condition_id from BACIRO_FHIR.condition ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationRequestReasonReferenceCondition = {};
					if(rez[i].condition_id != "null"){
						medicationRequestReasonReferenceCondition.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Condition?_id=' +  rez[i].condition_id;
					} else {
						medicationRequestReasonReferenceCondition.id = "";
					}
					
					arrMedicationRequestReasonReferenceCondition[i] = medicationRequestReasonReferenceCondition;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestReasonReferenceCondition
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestReasonReferenceCondition"
				});
			});
		},
		medicationRequestReasonReferenceObservation: function getMedicationRequestReasonReferenceObservation(req, res) {
			var apikey = req.params.apikey;
			
			var ObservationId = req.query._id;
			var medicationRequestId = req.query.medication_request_id;

			//susun query
			var condition = '';

			if (typeof ObservationId !== 'undefined' && ObservationId !== "") {
				condition += "observation_id = '" + ObservationId + "' AND ";
			}

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "medication_request_id = '" + medicationRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestReasonReferenceObservation = [];
			var query = 'select observation_id from BACIRO_FHIR.observation ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationRequestReasonReferenceObservation = {};
					if(rez[i].observation_id != "null"){
						medicationRequestReasonReferenceObservation.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Observation?_id=' +  rez[i].observation_id;
					} else {
						medicationRequestReasonReferenceObservation.id = "";
					}
					
					arrMedicationRequestReasonReferenceObservation[i] = medicationRequestReasonReferenceObservation;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestReasonReferenceObservation
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestReasonReferenceObservation"
				});
			});
		},
		medicationRequestDosage: function getMedicationRequestDosage(req, res) {
			var apikey = req.params.apikey;
			
			var DosageId = req.query._id;
			var medicationRequestId = req.query.medication_request_id;

			//susun query
			var condition = '';

			if (typeof DosageId !== 'undefined' && DosageId !== "") {
				condition += "dosage_id = '" + DosageId + "' AND ";
			}

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "medication_request_id = '" + medicationRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestDosage = [];
			var query = 'select dosage_id from BACIRO_FHIR.dosage ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationRequestDosage = {};
					if(rez[i].dosage_id != "null"){
						medicationRequestDosage.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Dosage?_id=' +  rez[i].dosage_id;
					} else {
						medicationRequestDosage.id = "";
					}
					
					arrMedicationRequestDosage[i] = medicationRequestDosage;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestDosage
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestDosage"
				});
			});
		},
		medicationRequestDetectedIssue: function getMedicationRequestDetectedIssue(req, res) {
			var apikey = req.params.apikey;
			
			var DetectedIssueId = req.query._id;
			var medicationRequestId = req.query.medication_request_id;

			//susun query
			var condition = '';

			if (typeof DetectedIssueId !== 'undefined' && DetectedIssueId !== "") {
				condition += "detected_issue_id = '" + DetectedIssueId + "' AND ";
			}

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "medication_request_id = '" + medicationRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestDetectedIssue = [];
			var query = 'select detected_issue_id from BACIRO_FHIR.detected_issue ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationRequestDetectedIssue = {};
					if(rez[i].detectedIssue_id != "null"){
						medicationRequestDetectedIssue.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/DetectedIssue?_id=' +  rez[i].detected_issue_id;
					} else {
						medicationRequestDetectedIssue.id = "";
					}
					
					arrMedicationRequestDetectedIssue[i] = medicationRequestDetectedIssue;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestDetectedIssue
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestDetectedIssue"
				});
			});
		},
		medicationRequestProvenance: function getMedicationRequestProvenance(req, res) {
			var apikey = req.params.apikey;
			
			var ProvenanceId = req.query._id;
			var medicationRequestId = req.query.medication_request_id;

			//susun query
			var condition = '';

			if (typeof ProvenanceId !== 'undefined' && ProvenanceId !== "") {
				condition += "provenance_id = '" + ProvenanceId + "' AND ";
			}

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "medication_request_id = '" + medicationRequestId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationRequestProvenance = [];
			var query = 'select provenance_id from BACIRO_FHIR.provenance ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var medicationRequestProvenance = {};
					if(rez[i].provenance_id != "null"){
						medicationRequestProvenance.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Provenance?_id=' +  rez[i].provenance_id;
					} else {
						medicationRequestProvenance.id = "";
					}
					
					arrMedicationRequestProvenance[i] = medicationRequestProvenance;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestProvenance
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestProvenance"
				});
			});
		},
  },
	post: {
		medicationRequest: function addMedicationRequest(req, res) {
			console.log(req.body);
			
			var medication_request_id = req.body.medication_request_id;
			var based_on = req.body.based_on;
			var group_identifier = req.body.group_identifier;
			var status = req.body.status;
			var intent = req.body.intent;
			var category = req.body.category;
			var priority = req.body.priority;
			var medication_codeable_concept = req.body.medication_codeable_concept;
			var medication_reference = req.body.medication_reference;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var supporting_information = req.body.supporting_information;
			var authored_on = req.body.authored_on;
			var recorder = req.body.recorder;
			var reason_code = req.body.reason_code;
			var prior_prescription = req.body.prior_prescription;
			var agent_practitioner = req.body.agent_practitioner;
			var agent_organization = req.body.agent_organization;
			var agent_patient = req.body.agent_patient;
			var agent_related_person = req.body.agent_related_person;
			var agent_device = req.body.agent_device;
			var on_behalf_of = req.body.on_behalf_of;
			var allowed = req.body.allowed;
			var reason = req.body.reason;
			var validity_period_start = req.body.validity_period_start;
			var validity_period_end = req.body.validity_period_end;
			var number_of_repeats_allowed = req.body.number_of_repeats_allowed;
			var quantity = req.body.quantity;
			var expected_supply_duration = req.body.expected_supply_duration;
			var performer = req.body.performer;
			var diagnostic_report_id = req.body.diagnostic_report_id;
			var medication_dispense_id = req.body.medication_dispense_id;
			var careplan_id = req.body.careplan_id;
			var claim_id = req.body.claim_id;
			var clinical_impression_id = req.body.clinical_impression_id;
			var explanation_of_benefit_id = req.body.explanation_of_benefit_id;
			var medication_administration_id = req.body.medication_administration_id;
			var medication_statement_id = req.body.medication_statement_id;
			var observation_id = req.body.observation_id;
			
			var column = "";
      var values = "";
			
			if (typeof based_on !== 'undefined' && based_on !== "") {
        column += 'based_on,';
        values += "'" + based_on + "',";
      }
			
			if (typeof group_identifier !== 'undefined' && group_identifier !== "") {
        column += 'group_identifier,';
        values += "'" + group_identifier + "',";
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
			
			if (typeof priority !== 'undefined' && priority !== "") {
        column += 'priority,';
        values += "'" + priority + "',";
      }		
			
			if (typeof medication_codeable_concept !== 'undefined' && medication_codeable_concept !== "") {
        column += 'medication_codeable_concept,';
        values += "'" + medication_codeable_concept + "',";
      }		
			
			if (typeof medication_reference !== 'undefined' && medication_reference !== "") {
        column += 'medication_reference,';
        values += "'" + medication_reference + "',";
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
			
			if (typeof supporting_information !== 'undefined' && supporting_information !== "") {
        column += 'supporting_information,';
        values += "'" + supporting_information + "',";
      }		
			
			if (typeof authored_on !== 'undefined' && authored_on !== "") {
        column += 'authored_on,';
				values += "to_date('"+ authored_on + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof recorder !== 'undefined' && recorder !== "") {
        column += 'recorder,';
        values += "'" + recorder + "',";
      }
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }
			
			if (typeof prior_prescription !== 'undefined' && prior_prescription !== "") {
        column += 'prior_prescription,';
        values += "'" + prior_prescription + "',";
      }
			
			if (typeof agent_practitioner !== 'undefined' && agent_practitioner !== "") {
        column += 'agent_practitioner,';
        values += "'" + agent_practitioner + "',";
      }
			
			if (typeof agent_organization !== 'undefined' && agent_organization !== "") {
        column += 'agent_organization,';
        values += "'" + agent_organization + "',";
      }
			
			if (typeof agent_patient !== 'undefined' && agent_patient !== "") {
        column += 'agent_patient,';
        values += "'" + agent_patient + "',";
      }
			
			if (typeof agent_related_person !== 'undefined' && agent_related_person !== "") {
        column += 'agent_related_person,';
        values += "'" + agent_related_person + "',";
      }
			
			if (typeof agent_device !== 'undefined' && agent_device !== "") {
        column += 'agent_device,';
        values += "'" + agent_device + "',";
      }
			
			if (typeof on_behalf_of !== 'undefined' && on_behalf_of !== "") {
        column += 'on_behalf_of,';
        values += "'" + on_behalf_of + "',";
      }
			
			if (typeof allowed !== 'undefined' && allowed !== "") {
        column += 'allowed,';
        values += " " + allowed + ",";
      }
			
			if (typeof reason !== 'undefined' && reason !== "") {
        column += 'reason,';
        values += "'" + reason + "',";
      }
			
			if (typeof validity_period_start !== 'undefined' && validity_period_start !== "") {
        column += 'validity_period_start,';
				values += "to_date('"+ validity_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof validity_period_end !== 'undefined' && validity_period_end !== "") {
        column += 'validity_period_end,';
				values += "to_date('"+ validity_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof number_of_repeats_allowed !== 'undefined' && number_of_repeats_allowed !== "") {
        column += 'number_of_repeats_allowed,';
        values += " " + number_of_repeats_allowed + ",";
      }
			
			if (typeof quantity !== 'undefined' && quantity !== "") {
        column += 'quantity,';
        values += " " + quantity + ",";
      }
			
			if (typeof performer !== 'undefined' && performer !== "") {
        column += 'performer,';
        values += "'" + performer + "',";
      }
			
			if (typeof expected_supply_duration !== 'undefined' && expected_supply_duration !== "") {
        column += 'expected_supply_duration,';
        values += "'" + expected_supply_duration + "',";
      }
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }
			
			if (typeof medication_dispense_id !== 'undefined' && medication_dispense_id !== "") {
        column += 'medication_dispense_id,';
        values += "'" + medication_dispense_id + "',";
      }
			
			if (typeof careplan_id !== 'undefined' && careplan_id !== "") {
        column += 'careplan_id,';
        values += "'" + careplan_id + "',";
      }
			
			if (typeof claim_id !== 'undefined' && claim_id !== "") {
        column += 'claim_id,';
        values += "'" + claim_id + "',";
      }
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }
			
			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
        column += 'explanation_of_benefit_id,';
        values += "'" + explanation_of_benefit_id + "',";
      }
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }
			
			if (typeof medication_statement_id !== 'undefined' && medication_statement_id !== "") {
        column += 'medication_statement_id,';
        values += "'" + medication_statement_id + "',";
      }
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST(medication_request_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+medication_request_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select medication_request_id, based_on, group_identifier, status, intent, category, priority, medication_codeable_concept, medication_reference, subject_patient, subject_group, context_encounter, context_episode_of_care, supporting_information, authored_on, recorder, reason_code, prior_prescription from BACIRO_FHIR.MEDICATION_REQUEST WHERE medication_request_id = '" + medication_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequest"});
      });
    }
	},
	put: {
		medicationRequest: function updateMedicationRequest(req, res) {
			console.log(req.body);
			var medication_request_id = req.params._id;
			var based_on = req.body.based_on;
			var group_identifier = req.body.group_identifier;
			var status = req.body.status;
			var intent = req.body.intent;
			var category = req.body.category;
			var priority = req.body.priority;
			var medication_codeable_concept = req.body.medication_codeable_concept;
			var medication_reference = req.body.medication_reference;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var supporting_information = req.body.supporting_information;
			var authored_on = req.body.authored_on;
			var recorder = req.body.recorder;
			var reason_code = req.body.reason_code;
			var prior_prescription = req.body.prior_prescription;
			var agent_practitioner = req.body.agent_practitioner;
			var agent_organization = req.body.agent_organization;
			var agent_patient = req.body.agent_patient;
			var agent_related_person = req.body.agent_related_person;
			var agent_device = req.body.agent_device;
			var on_behalf_of = req.body.on_behalf_of;
			var allowed = req.body.allowed;
			var reason = req.body.reason;
			var validity_period_start = req.body.validity_period_start;
			var validity_period_end = req.body.validity_period_end;
			var number_of_repeats_allowed = req.body.number_of_repeats_allowed;
			var quantity = req.body.quantity;
			var expected_supply_duration = req.body.expected_supply_duration;
			var performer = req.body.performer;
			var diagnostic_report_id = req.body.diagnostic_report_id;
			var medication_dispense_id = req.body.medication_dispense_id;
			var careplan_id = req.body.careplan_id;
			var claim_id = req.body.claim_id;
			var clinical_impression_id = req.body.clinical_impression_id;
			var explanation_of_benefit_id = req.body.explanation_of_benefit_id;
			var medication_administration_id = req.body.medication_administration_id;
			var medication_statement_id = req.body.medication_statement_id;
			var observation_id = req.body.observation_id;

			
			var column = "";
      var values = "";
			
			if (typeof based_on !== 'undefined' && based_on !== "") {
        column += 'based_on,';
        values += "'" + based_on + "',";
      }
			
			if (typeof group_identifier !== 'undefined' && group_identifier !== "") {
        column += 'group_identifier,';
        values += "'" + group_identifier + "',";
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
			
			if (typeof priority !== 'undefined' && priority !== "") {
        column += 'priority,';
        values += "'" + priority + "',";
      }		
			
			if (typeof medication_codeable_concept !== 'undefined' && medication_codeable_concept !== "") {
        column += 'medication_codeable_concept,';
        values += "'" + medication_codeable_concept + "',";
      }		
			if (typeof medication_reference !== 'undefined' && medication_reference !== "") {
        column += 'medication_reference,';
        values += "'" + medication_reference + "',";
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
			
			if (typeof supporting_information !== 'undefined' && supporting_information !== "") {
        column += 'supporting_information,';
        values += "'" + supporting_information + "',";
      }		
			
			if (typeof authored_on !== 'undefined' && authored_on !== "") {
        column += 'authored_on,';
				values += "to_date('"+ authored_on + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof recorder !== 'undefined' && recorder !== "") {
        column += 'recorder,';
        values += "'" + recorder + "',";
      }
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }
			
			if (typeof prior_prescription !== 'undefined' && prior_prescription !== "") {
        column += 'prior_prescription,';
        values += "'" + prior_prescription + "',";
      }
			
			if (typeof agent_practitioner !== 'undefined' && agent_practitioner !== "") {
        column += 'agent_practitioner,';
        values += "'" + agent_practitioner + "',";
      }
			
			if (typeof agent_organization !== 'undefined' && agent_organization !== "") {
        column += 'agent_organization,';
        values += "'" + agent_organization + "',";
      }
			
			if (typeof agent_patient !== 'undefined' && agent_patient !== "") {
        column += 'agent_patient,';
        values += "'" + agent_patient + "',";
      }
			
			if (typeof agent_related_person !== 'undefined' && agent_related_person !== "") {
        column += 'agent_related_person,';
        values += "'" + agent_related_person + "',";
      }
			
			if (typeof agent_device !== 'undefined' && agent_device !== "") {
        column += 'agent_device,';
        values += "'" + agent_device + "',";
      }
			
			if (typeof on_behalf_of !== 'undefined' && on_behalf_of !== "") {
        column += 'on_behalf_of,';
        values += "'" + on_behalf_of + "',";
      }
			
			if (typeof allowed !== 'undefined' && allowed !== "") {
        column += 'allowed,';
        values += " " + allowed + ",";
      }
			
			if (typeof reason !== 'undefined' && reason !== "") {
        column += 'reason,';
        values += "'" + reason + "',";
      }
			
			if (typeof validity_period_start !== 'undefined' && validity_period_start !== "") {
        column += 'validity_period_start,';
				values += "to_date('"+ validity_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof validity_period_end !== 'undefined' && validity_period_end !== "") {
        column += 'validity_period_end,';
				values += "to_date('"+ validity_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof number_of_repeats_allowed !== 'undefined' && number_of_repeats_allowed !== "") {
        column += 'number_of_repeats_allowed,';
        values += " " + number_of_repeats_allowed + ",";
      }
			
			if (typeof quantity !== 'undefined' && quantity !== "") {
        column += 'quantity,';
        values += " " + quantity + ",";
      }
			
			if (typeof performer !== 'undefined' && performer !== "") {
        column += 'performer,';
        values += "'" + performer + "',";
      }
			
			if (typeof expected_supply_duration !== 'undefined' && expected_supply_duration !== "") {
        column += 'expected_supply_duration,';
        values += "'" + expected_supply_duration + "',";
      }
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }
			
			if (typeof medication_dispense_id !== 'undefined' && medication_dispense_id !== "") {
        column += 'medication_dispense_id,';
        values += "'" + medication_dispense_id + "',";
      }
			
			if (typeof careplan_id !== 'undefined' && careplan_id !== "") {
        column += 'careplan_id,';
        values += "'" + careplan_id + "',";
      }
			
			if (typeof claim_id !== 'undefined' && claim_id !== "") {
        column += 'claim_id,';
        values += "'" + claim_id + "',";
      }
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }
			
			if (typeof explanation_of_benefit_id !== 'undefined' && explanation_of_benefit_id !== "") {
        column += 'explanation_of_benefit_id,';
        values += "'" + explanation_of_benefit_id + "',";
      }
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }
			
			if (typeof medication_statement_id !== 'undefined' && medication_statement_id !== "") {
        column += 'medication_statement_id,';
        values += "'" + medication_statement_id + "',";
      }
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }
			
			
      var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "medication_request_id = '" + medication_request_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "medication_request_id = '" + medication_request_id + "'";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST(medication_request_id," + column.slice(0, -1) + ") SELECT medication_request_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_REQUEST WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select medication_request_id, based_on, group_identifier, status, intent, category, priority, medication_codeable_concept, medication_reference, subject_patient, subject_group, context_encounter, context_episode_of_care, supporting_information, authored_on, recorder, reason_code, prior_prescription from BACIRO_FHIR.MEDICATION_REQUEST WHERE medication_request_id = '" + medication_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequest"});
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