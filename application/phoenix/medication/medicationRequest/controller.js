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
			
			var medication_request_id = req.query._id;
			var authoredon = req.query.authoredon;
			var category = req.query.category;
			var code = req.query.code;
			var context = req.query.context;
			var date = req.query.date;
			var identifier = req.query.identifier;
			var intended_dispenser = req.query.intended_dispenser;
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
			
			if ((typeof date !== 'undefined' && date !== "") || (typeof intended_dispenser !== 'undefined' && intended_dispenser !== "")) {
				join += " LEFT JOIN BACIRO_FHIR.MEDICATION_REQUEST_DISPENSE_REQUEST mrd on mr.MEDICATION_REQUEST_ID = mrd.MEDICATION_REQUEST_ID ";
				if(typeof intended_dispenser !== 'undefined' && intended_dispenser !== ""){
					condition += "de.PERFORMER = '" + intended_dispenser + "' AND,";  
				}
				
				if (typeof date !== 'undefined' && date !== "") {
					condition += "mrd.VALIDITY_PERIOD_START <= to_date('" + date + "', 'yyyy-MM-dd') AND mrd.VALIDITY_PERIOD_END >= to_date('" + date + "', 'yyyy-MM-dd') AND,";
				}
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on mr.MEDICATION_REQUEST_ID = i.MEDICATION_REQUEST_ID ";
        condition += "i.IDENTIFIER_ID = '" + identifier + "' AND,";  
      }
			
			if(typeof intent !== 'undefined' && intent !== ""){
        condition += "mr.intent = " + intent + " AND,";  
      }
			
			if(typeof subject !== 'subject' && subject !== ""){
				condition += "(mr.SUBJECT_PATIENT = '" + subject + "' OR mr.SUBJECT_GROUP = '" + subject + "') AND,";  
			}
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "mr.SUBJECT_PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof requester !== 'undefined' && requester !== ""){
				join += " LEFT JOIN BACIRO_FHIR.MEDICATION_REQUEST_REQUESTER mrr on mr.medication_administration_id = mrr.medication_administration_id ";
        condition += "(mrr.AGENT_PRACTITIONER = '" + requester + "' OR mrr.AGENT_ORGANIZATION = '" + requester + "' OR mrr.AGENT_PATIENT = '" + requester + "' OR mrr.AGENT_RELATED_PERSON = '" + requester + "' OR mrr.AGENT_DEVICE = '" + requester + "') AND,"; 
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
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrMedicationRequest = [];
      var query = "select medication_request_id, based_on, group_identifier, status, intent, category, priority, medication_codeable_concept, medication_reference, subject_patient, subject_group, context_encounter, context_episode_of_care, supporting_information, authored_on, recorder, reason_code, prior_prescription from BACIRO_FHIR.MEDICATION_REQUEST mr " + fixCondition;
			//console.log(query);
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
					MedicationRequest.medication.medicationCodeableConcept = rez[i].medication_codeable_concept;
					MedicationRequest.medication.medicationReference = rez[i].medication_reference;
					if (rez[i].subject_group !== 'null') {
						MedicationRequest.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Group?_id=' +  rez[i].subject_group;
					} else if (rez[i].subject_patient !== 'null') {
						MedicationRequest.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subject_patient;
					} else {
						MedicationRequest.subject = "";
					}
					if (rez[i].context_encounter !== 'null') {
						MedicationRequest.context = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].context_encounter;
					} else if (rez[i].context_episode_of_care !== 'null') {
						MedicationRequest.context = hostFHIR + ':' + portFHIR + '/' + apikey + '/EpisodeOfCare?_id=' +  rez[i].context_episode_of_care;
					} else {
						MedicationRequest.context = "";
					}
					MedicationRequest.supportingInformation = rez[i].supporting_information;
					MedicationRequest.authoredOn = rez[i].authored_on;
					MedicationRequest.recorder = rez[i].recorder;
					MedicationRequest.reasonCode = rez[i].reason_code;
					MedicationRequest.priorPrescription = rez[i].prior_prescription;
					
          arrMedicationRequest[i] = MedicationRequest;
        }
        res.json({"err_code":0,"data": arrMedicationRequest});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationRequest"});
      });
    },
		medicationRequestRequester: function getMedicationRequestRequester(req, res) {
			var apikey = req.params.apikey;
			
			var medicationRequestRequesterId = req.query._id;
			var medicationRequestId = req.query.medicationRequest_id;

			//susun query
			var condition = "";

			if (typeof medicationRequestRequesterId !== 'undefined' && medicationRequestRequesterId !== "") {
				condition += "REQUESTER_ID = '" + medicationRequestRequesterId + "' AND ";
			}

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "MEDICATION_REQUEST_ID = '" + medicationRequestId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrMedicationRequestRequester = [];
			var query = "select requester_id, agent_practitioner, agent_organization, agent_patient, agent_related_person, agent_device, on_behalf_of, medication_request_id from BACIRO_FHIR.MEDICATION_REQUEST_REQUESTER " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var MedicationRequestRequester = {};
					MedicationRequestRequester.id = rez[i].requester_id;
					if (rez[i].agent_practitioner !== 'null') {
						MedicationRequestRequester.agent = hostFHIR + ':' + portFHIR + '/' + apikey + '/Partitioner?_id=' +  rez[i].agent_practitioner;
					} else if (rez[i].agent_organization !== 'null') {
						MedicationRequestRequester.agent  = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].agent_organization;
					} else if (rez[i].agent_patient !== 'null') {
						MedicationRequestRequester.agent  = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].agent_patient;
					} else if (rez[i].agent_related_person !== 'null') {
						MedicationRequestRequester.agent  = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].agent_related_person;
					} else if (rez[i].agent_device !== 'null') {
						MedicationRequestRequester.agent  = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].agent_device;
					} else {
						MedicationRequestRequester.agent  = "";
					}
					MedicationRequestRequester.onBehalfOf = rez[i].on_behalf_of;
					
					arrMedicationRequestRequester[i] = MedicationRequestRequester;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestRequester
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestRequester"
				});
			});
		},
		medicationRequestSubtitution: function getMedicationRequestSubtitution(req, res) {
			var apikey = req.params.apikey;
			
			var medicationRequestSubtitutionId = req.query._id;
			var medicationRequestId = req.query.medicationRequest_id;

			//susun query
			var condition = "";

			if (typeof medicationRequestSubtitutionId !== 'undefined' && medicationRequestSubtitutionId !== "") {
				condition += "SUBTITUTION_ID = '" + medicationRequestSubtitutionId + "' AND ";
			}

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "MEDICATION_REQUEST_ID = '" + medicationRequestId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrMedicationRequestSubtitution = [];
			var query = "select subtitution_id, allowed, reason, medication_request_id from BACIRO_FHIR.MEDICATION_REQUEST_SUBTITUTION " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var MedicationRequestSubtitution = {};
					MedicationRequestSubtitution.id = rez[i].subtitution_id;
					MedicationRequestSubtitution.allowed = rez[i].allowed;
					MedicationRequestSubtitution.reason = rez[i].reason;
					arrMedicationRequestSubtitution[i] = MedicationRequestSubtitution;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestSubtitution
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestSubtitution"
				});
			});
		},
		medicationRequestDispenseRequest: function getMedicationRequestDispenseRequest(req, res) {
			var apikey = req.params.apikey;
			
			var medicationRequestDispenseRequestId = req.query._id;
			var medicationRequestId = req.query.medicationRequest_id;

			//susun query
			var condition = "";

			if (typeof medicationRequestDispenseRequestId !== 'undefined' && medicationRequestDispenseRequestId !== "") {
				condition += "DISPENCE_REQUEST_ID = '" + medicationRequestDispenseRequestId + "' AND ";
			}

			if (typeof medicationRequestId !== 'undefined' && medicationRequestId !== "") {
				condition += "MEDICATION_REQUEST_ID = '" + medicationRequestId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrMedicationRequestDispenseRequest = [];
			var query = "select dispence_request_id, validity_period_start, validity_period_end, number_of_repeats_allowed, quantity, expected_supply_duration, performer, medication_request_id from BACIRO_FHIR.MEDICATION_REQUEST_DISPENSE_REQUEST " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var MedicationRequestDispenseRequest = {};
					MedicationRequestDispenseRequest.id = rez[i].dispenseRequest_id;
					MedicationRequestDispenseRequest.text = rez[i].text;
					MedicationRequestDispenseRequest.site = rez[i].site;
					MedicationRequestDispenseRequest.route = rez[i].route;
					MedicationRequestDispenseRequest.method = rez[i].method;
					MedicationRequestDispenseRequest.dose = rez[i].dose;
					MedicationRequestDispenseRequest.rate.rateRatio = rez[i].rate_ratio;
					MedicationRequestDispenseRequest.rate.rateQuality = rez[i].rate_quality;
					arrMedicationRequestDispenseRequest[i] = MedicationRequestDispenseRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationRequestDispenseRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationRequestDispenseRequest"
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
				values += "to_date('"+ authored_on + "', 'yyyy-MM-dd'),";
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
    },
		medicationRequestRequester: function addMedicationRequestRequester(req, res) {
			console.log(req.body);
			var requester_id = req.body.requester_id;
			var agent_practitioner = req.body.agent_practitioner;
			var agent_organization = req.body.agent_organization;
			var agent_patient = req.body.agent_patient;
			var agent_related_person = req.body.agent_related_person;
			var agent_device = req.body.agent_device;
			var on_behalf_of = req.body.on_behalf_of;
			var medication_request_id = req.body.medication_request_id;
			
			var column = "";
      var values = "";
			
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
			
			if (typeof medication_request_id !== 'undefined' && medication_request_id !== "") {
        column += 'medication_request_id,';
        values += "'" + medication_request_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST_REQUESTER(requester_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+requester_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select requester_id, agent_practitioner, agent_organization, agent_patient, agent_related_person, agent_device, on_behalf_of, medication_request_id from BACIRO_FHIR.MEDICATION_REQUEST_REQUESTER WHERE requester_id = '" + requester_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequestRequester"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequestRequester"});
      });
    },
		medicationRequestSubtitution: function addMedicationRequestSubtitution(req, res) {
			console.log(req.body);
			var subtitution_id = req.body.requester_id;
			var allowed = req.body.agent_practitioner;
			var reason = req.body.agent_practitioner;
			var medication_request_id = req.body.agent_practitioner;
			
			var column = "";
      var values = "";
			
			if (typeof allowed !== 'undefined' && allowed !== "") {
        column += 'allowed,';
        values += " " + allowed + ",";
      }
			
			if (typeof reason !== 'undefined' && reason !== "") {
        column += 'reason,';
        values += "'" + reason + "',";
      }
			
			if (typeof medication_request_id !== 'undefined' && medication_request_id !== "") {
        column += 'medication_request_id,';
        values += "'" + medication_request_id + "',";
      }	
			
			var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST_SUBTITUTION(subtitution_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+subtitution_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select subtitution_id, allowed, reason, medication_request_id from BACIRO_FHIR.MEDICATION_REQUEST_SUBTITUTION WHERE subtitution_id = '" + subtitution_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequestSubtitution"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequestSubtitution"});
      });
    },
		medicationRequestDispenseRequest: function addMedicationRequestDispenseRequest(req, res) {
			console.log(req.body);
			var dispence_request_id  = req.body.dispence_request_id;
			var validity_period_start = req.body.validity_period_start;
			var validity_period_end = req.body.validity_period_end;
			var number_of_repeats_allowed = req.body.number_of_repeats_allowed;
			var quantity = req.body.quantity;
			var expected_supply_duration = req.body.expected_supply_duration;
			var performer = req.body.performer;
			var medication_request_id = req.body.medication_request_id;
			
			var column = "";
      var values = "";
			
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
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_ADMINISTRATION_DOSAGE(dispenseRequest_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+dispenseRequest_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select dispence_request_id, validity_period_start, validity_period_end, number_of_repeats_allowed, quantity, expected_supply_duration, performer, medication_request_id from BACIRO_FHIR.MEDICATION_REQUEST_DISPENSE_REQUEST WHERE package_id = '" + package_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequestDispenseRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationRequestDispenseRequest"});
      });
    },
	},
	put: {
		medicationRequest: function updateMedicationRequest(req, res) {
			console.log(req.body);
			var medication_request_id = req.params.medication_request_id;
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
				values += "to_date('"+ authored_on + "', 'yyyy-MM-dd'),";
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
			
      var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "medication_request_id = '" + medication_request_id + "' AND " + fieldResource + " = '" + valueResource + "'";

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
    },
		medicationRequestRequester: function updateMedicationRequestRequester(req, res) {
			console.log(req.body);
			var requester_id = req.params.requester_id;
			var agent_practitioner = req.body.agent_practitioner;
			var agent_organization = req.body.agent_organization;
			var agent_patient = req.body.agent_patient;
			var agent_related_person = req.body.agent_related_person;
			var agent_device = req.body.agent_device;
			var on_behalf_of = req.body.on_behalf_of;
			var medication_request_id = req.body.medication_request_id;
			
			var column = "";
      var values = "";
			
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
			
			if (typeof medication_request_id !== 'undefined' && medication_request_id !== "") {
        column += 'medication_request_id,';
        values += "'" + medication_request_id + "',";
      }	

      var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "requester_id = '" + requester_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST_REQUESTER(requester_id," + column.slice(0, -1) + ") SELECT requester_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_REQUEST_REQUESTER WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select requester_id, agent_practitioner, agent_organization, agent_patient, agent_related_person, agent_device, on_behalf_of, medication_request_id from BACIRO_FHIR.MEDICATION_REQUEST_REQUESTER WHERE requester_id = '" + requester_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequestRequester"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequestRequester"});
      });
    },
		medicationRequestSubtitution: function updateMedicationRequestSubtitution(req, res) {
			console.log(req.body);
			
			var subtitution_id = req.params.subtitution_id;
			var allowed = req.body.allowed;
			var reason = req.body.reason;
			var medication_request_id = req.body.medication_request_id;
			
			var column = "";
      var values = "";
			
			if (typeof allowed !== 'undefined' && allowed !== "") {
        column += 'allowed,';
        values += " " + allowed + ",";
      }
			
			if (typeof reason !== 'undefined' && reason !== "") {
        column += 'reason,';
        values += "'" + reason + "',";
      }
			
			if (typeof medication_request_id !== 'undefined' && medication_request_id !== "") {
        column += 'medication_request_id,';
        values += "'" + medication_request_id + "',";
      }	

      var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "subtitution_id = '" + subtitution_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST_SUBTITUTION(subtitution_id," + column.slice(0, -1) + ") SELECT subtitution_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_REQUEST_SUBTITUTION WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select subtitution_id, allowed, reason, medication_request_id from BACIRO_FHIR.MEDICATION_REQUEST_SUBTITUTION WHERE subtitution_id = '" + subtitution_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequestSubtitution"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequestSubtitution"});
      });
    },
		medicationRequestDispenseRequest: function updateMedicationRequestDispenseRequest(req, res) {
			console.log(req.body);
			
			var dispence_request_id  = req.params.dispence_request_id;
			var validity_period_start = req.body.validity_period_start;
			var validity_period_end = req.body.validity_period_end;
			var number_of_repeats_allowed = req.body.number_of_repeats_allowed;
			var quantity = req.body.quantity;
			var expected_supply_duration = req.body.expected_supply_duration;
			var performer = req.body.performer;
			var medication_request_id = req.body.medication_request_id;
			
			var column = "";
      var values = "";
			
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
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }

      var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "dispence_request_id = '" + dispence_request_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_REQUEST_DISPENSE_REQUEST(dispence_request_id," + column.slice(0, -1) + ") SELECT dispence_request_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_REQUEST_DISPENSE_REQUEST WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select dispence_request_id, validity_period_start, validity_period_end, number_of_repeats_allowed, quantity, expected_supply_duration, performer, medication_request_id from BACIRO_FHIR.MEDICATION_REQUEST_DISPENSE_REQUEST WHERE dispence_request_id = '" + dispence_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequestDispenseRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationRequestDispenseRequest"});
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