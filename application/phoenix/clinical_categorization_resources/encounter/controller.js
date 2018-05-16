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

// var phoenix = require("./phoenix.js");
var phoenix = require(path.resolve("./phoenix.js")); 
var db = new phoenix("jdbc:phoenix:" + host + ":/hbase-unsecure");

var controller = {
	get: {
		encounter: function getEncounter(req, res) {
			var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var encounterId = req.query._id;
			var appointmentId = req.query.appointment;
			var encounterClass = req.query.encounter_class;
			var encounterDate = req.query.date;
			var diagnosisConditionId = req.query.diagnosis_condition; //-> tabel diagnosis
			var diagnosisProcedureId = req.query.diagnosis_procedure; //-> tabel diagnosis
			var episodeOfCareId = req.query.episode_of_care;
			var identfierValue = req.query.identifier;
			var incomingReferral = req.query.incoming_referral;
			var encounterLength = req.query.length;
			var locationId = req.query.location; //-> tabel location
			var locationPeriod = req.query.location_period; //-> tabel location
			var partOf = req.query.part_of;
			var participantPractitionerId = req.query.participant_practitioner; //-> tabel participant
			var participantRelatedPersonId = req.query.participant_related_person; //-> tabel participant
			var participantType = req.query.participant_type; //-> tabel participant
			var patientId = req.query.patient;
			var encounterReason = req.query.reason;
			var organizationId = req.query.service_provider;
			var specialArrangement = req.query.special_arrangement; //-> tabel hospitalization
			var encounterStatus = req.query.status;
			var subjectId = req.query.subject;
			var typeId = req.query.type;
			
			//susun query
      var condition = "";
      var join = "";
			
			if (typeof encounterId !== 'undefined' && encounterId !== "") {
        condition += "enc.encounter_id = '" + encounterId + "' AND ";
      }
			if (typeof appointmentId !== 'undefined' && appointmentId !== "") {
        condition += "enc.appointment_id = '" + appointmentId + "' AND ";
      }
			if (typeof encounterClass !== 'undefined' && encounterClass !== "") {
        condition += "enc.encounter_class = '" + encounterClass + "' AND ";
      }
			if (typeof encounterDate !== 'undefined' && encounterDate !== "") {
        condition += "enc.encounter_period_start <= to_date('" + encounterDate + "', 'yyyy-MM-dd') AND enc.encounter_period_end >= to_date('" + encounterDate + "', 'yyyy-MM-dd') AND";
      }
			if ((typeof diagnosisConditionId !== 'undefined' && diagnosisConditionId !== "") || (typeof diagnosisProcedureId !== 'undefined' && diagnosisProcedureId !== "")) {
				join += " LEFT JOIN BACIRO_FHIR.ENCOUNTER_DIAGNOSIS dia ON dia.encounter_id = enc.encounter_id ";
				if (typeof diagnosisConditionId !== 'undefined' && diagnosisConditionId !== "") {
          condition += "dia.condition_id = '" + diagnosisConditionId + "' AND ";
				}
				if (typeof diagnosisProcedureId !== 'undefined' && diagnosisProcedureId !== "") {
          condition += "dia.procedure_id = '" + diagnosisProcedureId + "' AND ";
				}
      }
			if (typeof episodeOfCareId !== 'undefined' && episodeOfCareId !== "") {
				join += " LEFT JOIN BACIRO_FHIR.EPISODE_OF_CARE eoc ON eoc.encounter_id = enc.encounter_id ";
				if (typeof episodeOfCareId !== 'undefined' && episodeOfCareId !== "") {
          condition += "eoc.episode_of_care_id = '" + episodeOfCareId + "' AND ";
				}
      }
			if (typeof identfierValue !== 'undefined' && identfierValue !== "") {
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.encounter_id = enc.encounter_id ";
				if (typeof identfierValue !== 'undefined' && identfierValue !== "") {
          condition += "i.identifier_value = '" + identfierValue + "' AND ";
				}
      }
			if (typeof incomingReferral !== 'undefined' && incomingReferral !== "") {
				join += " LEFT JOIN BACIRO_FHIR.REFERRAL_REQUEST ref ON ref.encounter_id = enc.encounter_id ";
				if (typeof incomingReferral !== 'undefined' && incomingReferral !== "") {
          condition += "ref.referral_request_id = '" + incomingReferral + "' AND ";
				}
      }
			if (typeof encounterLength !== 'undefined' && encounterLength !== "") {
        condition += "enc.encounter_length = '" + encounterLength + "' AND ";
      }
			if ((typeof locationId !== 'undefined' && locationId !== "") || (typeof locationPeriod !== 'undefined' && locationPeriod !== "")) {
				join += " LEFT JOIN BACIRO_FHIR.ENCOUNTER_LOCATION loc ON loc.encounter_id = enc.encounter_id ";
				if (typeof locationId !== 'undefined' && locationId !== "") {
          condition += "loc.location_id = '" + locationId + "' AND ";
				}
				if (typeof locationPeriod !== 'undefined' && locationPeriod !== "") {
          condition += "loc.encounter_location_period_start <= to_date('" + locationPeriod + "', 'yyyy-MM-dd') AND loc.encounter_location_period_end >= to_date('" + encounterDate + "', 'yyyy-MM-dd') AND";
				}
      }
			if (typeof partOf !== 'undefined' && partOf !== "") {
        condition += "enc.parent_id = '" + partOf + "' AND ";
      }
			if ((typeof participantPractitionerId !== 'undefined' && participantPractitionerId !== "") || (typeof participantRelatedPersonId !== 'undefined' && participantRelatedPersonId !== "") || (typeof participantType !== 'undefined' && participantType !== "")) {
				join += " LEFT JOIN BACIRO_FHIR.ENCOUNTER_PARTICIPANT par ON par.encounter_id = enc.encounter_id ";
				if (typeof participantPractitionerId !== 'undefined' && participantPractitionerId !== "") {
          condition += "par.individual_practitioner_id = '" + participantPractitionerId + "' AND ";
				}
				if (typeof participantRelatedPersonId !== 'undefined' && participantRelatedPersonId !== "") {
          condition += "par.individual_related_person_id = '" + participantRelatedPersonId + "' AND ";
				}
				if (typeof participantType !== 'undefined' && participantType !== "") {
          condition += "par.encounter_participant_type = '" + participantType + "' AND ";
				}
      }
			if (typeof encounterReason !== 'undefined' && encounterReason !== "") {
        condition += "enc.encounter_reason = '" + encounterReason + "' AND ";
      }
			if (typeof organizationId !== 'undefined' && organizationId !== "") {
        condition += "enc.organization_id = '" + organizationId + "' AND ";
      }
			if (typeof specialArrangement !== 'undefined' && specialArrangement !== "") {
				join += " LEFT JOIN BACIRO_FHIR.ENCOUNTER_HOSPITALIZATION hos ON hos.encounter_id = enc.encounter_id ";
				if (typeof specialArrangement !== 'undefined' && specialArrangement !== "") {
          condition += "hos.encounter_hospitalization_special_arrangement = '" + specialArrangement + "' AND ";
				}
      }
			if (typeof encounterStatus !== 'undefined' && encounterStatus !== "") {
        condition += "enc.encounter_status = '" + encounterStatus + "' AND ";
      }
			if (typeof subjectId !== 'undefined' && subjectId !== "") {
        condition += "enc.subject_patient_id = '" + subjectId + "' OR enc.subject_group_id = '" + subjectId + "' AND ";
      }
			if (typeof typeId !== 'undefined' && typeId !== "") {
        condition += "enc.encounter_type = '" + typeId + "' AND ";
      }
			if (condition == "") {
        fixCondition = "";
      } else {
        fixCondition = join + " WHERE  " + condition.slice(0, -4);
      }
			
			var arrEncounter = [];
			var query = "SELECT enc.encounter_id as id, enc.encounter_priority as priority, enc.appointment_id as appointment, enc.encounter_class as encounter_class, enc.encounter_period_start as period_start, enc.encounter_period_end as period_end, enc.parent_id as parent, enc.encounter_reason as reason, enc.organization_id as org_id, enc.encounter_status as encounter_status, enc.subject_patient_id as subject_patient_id, enc.subject_group_id as subject_group_id, enc.encounter_type as type, enc.encounter_length as length FROM BACIRO_FHIR.ENCOUNTER enc " + fixCondition;
			//console.log(query);
			db.query(query, function (dataJson) {
        rez = lowercaseObject(dataJson);
        for (i = 0; i < rez.length; i++) {
          var Encounter = {};
          Encounter.resourceType = "Encounter";
          Encounter.id = rez[i].id;
          Encounter.status = rez[i].encounter_status;
					Encounter.encounter_class = rez[i].encounter_class;
          Encounter.type = rez[i].type;
					Encounter.priority = rez[i].priority;
					if (rez[i].subject_patient_id !== 'null') {
						Encounter.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subject_patient_id;
					} else if (rez[i].subject_group_id !== 'null') {
						Encounter.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Group?_id=' +  rez[i].subject_group_id;
					} else {
						Encounter.subject = "";
					}
					if (rez[i].appointment !== 'null') {
						Encounter.appointment = hostFHIR + ':' + portFHIR + '/' + apikey + '/Appointment?_id=' +  rez[i].appointment;
					} else {
						Encounter.appointment = "";
					}
					Encounter.period = rez[i].period_start + " to " + rez[i].period_end;
					Encounter.length = rez[i].length;
					Encounter.reason = rez[i].reason;
					if (rez[i].org_id !== 'null') {
						Encounter.serviceProvider = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].org_id;
					} else {
						Encounter.serviceProvider = "";
					}
					if (rez[i].parent !== 'null') {
						Encounter.partOf = hostFHIR + ':' + portFHIR + '/' + apikey + '/EpisodeOfCare?_id=' +  rez[i].parent;
					} else {
						Encounter.partOf = "";
					}
					//Encounter.partOf = rez[i].parent;

          arrEncounter[i] = Encounter;
        }
        res.json({
          "err_code": 0,
          "data": arrEncounter
        });
      }, function (e) {
        res.json({
          "err_code": 1,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "getEncounter"
        });
      });
		},
		statusHistory: function getStatusHistory(req, res) {
			var apikey = req.params.apikey;
			
			var statusHistoryId = req.query._id;
			var encounterId = req.query.encounter_id;

			//susun query
			var condition = "";

			if (typeof statusHistoryId !== 'undefined' && statusHistoryId !== "") {
				condition += "encounter_status_history_id = '" + statusHistoryId + "' AND ";
			}

			if (typeof encounterId !== 'undefined' && encounterId !== "") {
				condition += "encounter_id = '" + encounterId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrStatusHistory = [];
			var query = "SELECT encounter_status_history_id, encounter_status_history_status, encounter_status_history_period_start, encounter_status_history_period_end FROM BACIRO_FHIR.ENCOUNTER_STATUS_HISTORY " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var StatusHistory = {};
					StatusHistory.id = rez[i].encounter_status_history_id;
					StatusHistory.status = rez[i].encounter_status_history_status;
					StatusHistory.period = rez[i].encounter_status_history_period_start + " to " + rez[i].encounter_status_history_period_end;
					/*if (rez[i].encounter_status_history_period_start == null) {
						StatusHistory.period_start = formatDate(rez[i].encounter_status_history_period_start);
					} else {
						StatusHistory.period_start = rez[i].encounter_status_history_period_start;
					}

					if (rez[i].encounter_status_history_period_end == null) {
						StatusHistory.period_end = formatDate(rez[i].encounter_status_history_period_end);
					} else {
						StatusHistory.period_end = rez[i].encounter_status_history_period_end;
					}*/

					arrStatusHistory[i] = StatusHistory;
				}
				res.json({
					"err_code": 0,
					"data": arrStatusHistory
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getStatusHistory"
				});
			});
		},
		classHistory: function getClassHistory(req, res) {
			var apikey = req.params.apikey;
			
			var classHistoryId = req.query._id;
			var encounterId = req.query.encounter_id;

			//susun query
			var condition = "";

			if (typeof classHistoryId !== 'undefined' && classHistoryId !== "") {
				condition += "encounter_class_history_id = '" + classHistoryId + "' AND ";
			}

			if (typeof encounterId !== 'undefined' && encounterId !== "") {
				condition += "encounter_id = '" + encounterId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrClassHistory = [];
			var query = "SELECT encounter_class_history_id, encounter_class_history_class, encounter_class_history_period_start, encounter_class_history_period_end FROM BACIRO_FHIR.ENCOUNTER_CLASS_HISTORY " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ClassHistory = {};
					ClassHistory.id = rez[i].encounter_class_history_id;
					ClassHistory.class = rez[i].encounter_class_history_class;
					ClassHistory.period = rez[i].encounter_class_history_period_start + " to " + rez[i].encounter_class_history_period_end;

					/*if (rez[i].encounter_class_history_period_start == null) {
						ClassHistory.period_start = formatDate(rez[i].encounter_class_history_period_start);
					} else {
						ClassHistory.period_start = rez[i].encounter_class_history_period_start;
					}

					if (rez[i].encounter_class_history_period_end == null) {
						ClassHistory.period_end = formatDate(rez[i].encounter_class_history_period_end);
					} else {
						ClassHistory.period_end = rez[i].encounter_class_history_period_end;
					}*/

					arrClassHistory[i] = ClassHistory;
				}
				res.json({
					"err_code": 0,
					"data": arrClassHistory
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getClassHistory"
				});
			});
		},
		participant: function getParticipant(req, res) {
			var apikey = req.params.apikey;
			var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var participantId = req.query._id;
			var participantPractitionerId = req.query.participant_practitioner;
			var participantRelatedPersonId = req.query.participant_related_person;
			var participantType = req.query.participant_type;
			var encounterId = req.query.encounter_id;

			//susun query
			var condition = "";

			if (typeof participantId !== 'undefined' && participantId !== "") {
				condition += "encounter_participant_id = '" + participantId + "' AND ";
			}
			if (typeof participantPractitionerId !== 'undefined' && participantPractitionerId !== "") {
				condition += "individual_practitioner_id = '" + participantPractitionerId + "' AND ";
			}
			if (typeof participantRelatedPersonId !== 'undefined' && participantRelatedPersonId !== "") {
				condition += "individual_related_person_id = '" + participantRelatedPersonId + "' AND ";
			}
			if (typeof participantType !== 'undefined' && participantType !== "") {
				condition += "encounter_participant_type = '" + participantType + "' AND ";
			}
			if (typeof encounterId !== 'undefined' && encounterId !== "") {
				condition += "encounter_id = '" + encounterId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrParticipant = [];
			
			var query = "SELECT encounter_participant_id, encounter_participant_type, individual_practitioner_id, individual_related_person_id, encounter_participant_period_start, encounter_participant_period_end FROM BACIRO_FHIR.ENCOUNTER_PARTICIPANT " + fixCondition;
      console.log(query)
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var Participant = {};
					var arrIndividual = [];
					var Individual = {};
					
					if(rez[i].individual_practitioner_id != "null"){
						Individual.Practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].individual_practitioner_id;
					} else {
						Individual.Practitioner = "";
					}
					if(rez[i].individual_related_person_id != "null"){
						Individual.RelatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].individual_related_person_id;
					} else {
						Individual.RelatedPerson = "";
					}
					arrIndividual[i] = Individual;
					
					Participant.id = rez[i].encounter_participant_id;
					Participant.type = rez[i].encounter_participant_type;
					Participant.period = rez[i].encounter_participant_period_start + " to " + rez[i].encounter_participant_period_end;
					Participant.individual = arrIndividual[i];

					arrParticipant[i] = Participant;
				}
				res.json({
					"err_code": 0,
					"data": arrParticipant
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getParticipant"
				});
			});
		},
		diagnosis: function getDiagnosis(req, res) {
			var apikey = req.params.apikey;
			var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var diagnosisId = req.query._id;
			var encounterId = req.query.encounter_id;
			var conditionId = req.query.diagnosis_condition;
			var procedureId = req.query.diagnosis_procedure;

			//susun query
			var condition = "";

			if (typeof diagnosisId !== 'undefined' && diagnosisId !== "") {
				condition += "encounter_diagnosis_id = '" + diagnosisId + "' AND ";
			}
			if (typeof encounterId !== 'undefined' && encounterId !== "") {
				condition += "encounter_id = '" + encounterId + "' AND ";
			}
			if (typeof conditionId !== 'undefined' && conditionId !== "") {
				condition += "condition_id = '" + conditionId + "' AND ";
			}
			if (typeof procedureId !== 'undefined' && procedureId !== "") {
				condition += "procedure_id = '" + procedureId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrDiagnosis = [];
			var query = "SELECT encounter_diagnosis_id, encounter_diagnosis_role, encounter_diagnosis_rank, condition_id, procedure_id FROM BACIRO_FHIR.ENCOUNTER_DIAGNOSIS " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var Diagnosis = {};
					var arrCondition = [];
					var Condition = {};
					
					Diagnosis.id = rez[i].encounter_diagnosis_id;
					if(rez[i].condition_id != "null"){
						Condition.Condition = hostFHIR + ':' + portFHIR + '/' + apikey + '/Condition?_id=' +  rez[i].condition_id;
					} else {
						Condition.Condition = "";
					}
					if(rez[i].procedure_id != "null"){
						Condition.Procedure = hostFHIR + ':' + portFHIR + '/' + apikey + '/Procedure?_id=' +  rez[i].procedure_id;
					} else {
						Condition.Procedure = "";
					}
					arrCondition[i] =  Condition;
					Diagnosis.condition = arrCondition[i];
					Diagnosis.role = rez[i].encounter_diagnosis_role;
					Diagnosis.rank = rez[i].encounter_diagnosis_rank;

					arrDiagnosis[i] = Diagnosis;
				}
				res.json({
					"err_code": 0,
					"data": arrDiagnosis
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getDiagnosis"
				});
			});
		},
		hospitalization: function getHospitalization(req, res) {
			var apikey = req.params.apikey;
			var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var hospitalizationId = req.query._id;
			var encounterId = req.query.encounter_id;
			var specialArrangement = req.query.special_arrangement;

			//susun query
			var condition = "";

			if (typeof hospitalizationId !== 'undefined' && hospitalizationId !== "") {
				condition += "hos.encounter_hospitalization_id = '" + hospitalizationId + "' AND ";
			}
			if (typeof encounterId !== 'undefined' && encounterId !== "") {
				condition += "hos.encounter_id = '" + encounterId + "' AND ";
			}
			if (typeof specialArrangement !== 'undefined' && specialArrangement !== "") {
				condition += "hos.encounter_hospitalization_special_arrangement = '" + specialArrangement + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrHospitalization = [];
			var arrPreAdmissionIdentifier = [];
			var query = "SELECT hos.encounter_hospitalization_id as id, hos.encounter_hospitalization_origin as origin, hos.encounter_hospitalization_admit_source as admit_source, hos.encounter_hospitalization_re_addmission as re_addmission, hos.encounter_hospitalization_diet_preference as diet_preference, hos.encounter_hospitalization_special_courtesy as special_courtesy, hos.encounter_hospitalization_special_arrangement as special_arrangement, hos.encounter_hospitalization_destination as destination, hos.encounter_hospitalization_discharge_dispotition as discharge_dispotition, i.identifier_id as identifier_id, i.identifier_use as identifier_use, i.identifier_type as identifier_type, i.identifier_value as identifier_value, i.identifier_period_start as period_start, i.identifier_period_end as period_end, i.organization_id as org_id FROM BACIRO_FHIR.ENCOUNTER_HOSPITALIZATION hos LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.identifier_id = hos.identifier_id " + fixCondition;
			//console.log(query)
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				//console.log(rez)
				for (i = 0; i < rez.length; i++) {
					var Hospitalization = {};
					var PreAdmissionIdentifier = {};
					PreAdmissionIdentifier.id = rez[i].identifier_id;
					PreAdmissionIdentifier.use = rez[i].identifier_use;
					PreAdmissionIdentifier.type = rez[i].identifier_type;
					PreAdmissionIdentifier.value = rez[i].identifier_value;
					PreAdmissionIdentifier.period = rez[i].period_start + " to " + rez[i].period_end;
					PreAdmissionIdentifier.assigner = rez[i].org_id;
					
					arrPreAdmissionIdentifier[i] = PreAdmissionIdentifier;
					
					Hospitalization.id = rez[i].id;
					Hospitalization.preAdmissionIdentifier = arrPreAdmissionIdentifier;
					if(rez[i].origin != "null"){
						Hospitalization.origin = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].origin;
					} else {
						Hospitalization.origin = "";
					}
					Hospitalization.admitSource = rez[i].admit_source;
					Hospitalization.reAdmission = rez[i].re_addmission;
					Hospitalization.dietPreference = rez[i].diet_preference;
					Hospitalization.specialCourtesy = rez[i].special_courtesy;
					Hospitalization.specialArrangement = rez[i].special_arrangement;
					if(rez[i].destination != "null"){
						Hospitalization.destination = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].destination;
					} else {
						Hospitalization.destination = "";
					}
					Hospitalization.dischargeDisposition = rez[i].discharge_dispotition;

					arrHospitalization[i] = Hospitalization;
					
				}
				res.json({
					"err_code": 0,
					"data": arrHospitalization
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getHospitalization"
				});
			});
		},
		location: function getLocation(req, res) {
			var apikey = req.params.apikey;
			var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var locationId = req.query._id;
			var encounterId = req.query.encounter_id;
			var locationPeriod = req.query.location_period;

			//susun query
			var condition = "";

			if (typeof locationId !== 'undefined' && locationId !== "") {
				condition += "encounter_location_id = '" + locationId + "' AND ";
			}
			if (typeof encounterId !== 'undefined' && encounterId !== "") {
				condition += "encounter_id = '" + encounterId + "' AND ";
			}
			if (typeof locationPeriod !== 'undefined' && locationPeriod !== "") {
        condition += "encounter_location_period_start <= to_date('" + locationPeriod + "', 'yyyy-MM-dd') AND encounter_location_period_end >= to_date('" + locationPeriod + "', 'yyyy-MM-dd') AND";
      }

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrLocation = [];
			var query = "SELECT encounter_location_id, encounter_location_status, encounter_location_period_start, encounter_location_period_end, location_id FROM BACIRO_FHIR.ENCOUNTER_LOCATION " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var Location = {};
					Location.id = rez[i].encounter_location_id;
					if(rez[i].location_id != "null"){
						Location.location = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].location_id;
					} else {
						Location.location = "";
					}
					Location.status = rez[i].encounter_location_status;
					Location.period = rez[i].encounter_location_period_start + " to " + rez[i].encounter_location_period_end;

					arrLocation[i] = Location;
				}
				res.json({
					"err_code": 0,
					"data": arrLocation
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getLocation"
				});
			});
		},
		episodeOfCare: function getEpisodeOfCare(req, res) {
			var apikey = req.params.apikey;
			var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var episodeOfCareId = req.query._id;
			var encounterId = req.query.encounter_id;
			
			//susun query
			var condition = "";

			if (typeof episodeOfCareId !== 'undefined' && episodeOfCareId !== "") {
				condition += "episode_of_care_id = '" + episodeOfCareId + "' AND ";
			}
			if (typeof encounterId !== 'undefined' && encounterId !== "") {
				condition += "encounter_id = '" + encounterId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrEpisodeOfCare = [];
			var query = "SELECT episode_of_care_id FROM BACIRO_FHIR.EPISODE_OF_CARE " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var EpisodeOfCare = {};
					
					if(rez[i].episode_of_care_id != "null"){
						EpisodeOfCare.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/EpisodeOfCare?_id=' +  rez[i].episode_of_care_id;
					} else {
						EpisodeOfCare.id = "";
					}

					arrEpisodeOfCare[i] = EpisodeOfCare;
				}
				res.json({
					"err_code": 0,
					"data": arrEpisodeOfCare
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getEpisodeOfCare"
				});
			});
		}
	},
  post: {
    encounter: function addEncounter(req, res) {
      var id = req.body.encounter_id;
      var status = req.body.encounter_status;
			var encounter_class = req.body.encounter_class;
			var type = req.body.encounter_type;
			var priority = req.body.encounter_priority;
			var period_start = req.body.encounter_period_start;
			var period_end = req.body.encounter_period_end;
			var length = req.body.encounter_length;
			var reason = req.body.encounter_reason;
			var patient_id = req.body.subject_patient_id;
			var group_id = req.body.subject_group_id;
			var appointment_id = req.body.appointment_id;
			var org_id = req.body.organization_id;
			var parent_id = req.body.parent_id;
			
			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'encounter_status,';
        values += "'" + status + "',";
      }
			if (typeof encounter_class !== 'undefined' && encounter_class !== "") {
        column += 'encounter_class,';
        values += "'" + encounter_class + "',";
      }
			if (typeof type !== 'undefined' && type !== "") {
        column += 'encounter_type,';
        values += "'" + type + "',";
      }
			if (typeof priority !== 'undefined' && priority !== "") {
        column += 'encounter_priority,';
        values += "'" + priority + "',";
      }			
			if (typeof period_start !== 'undefined' && period_start !== "") {
				if (period_start == "") {
					encounter_period_start = null;
				} else {
					encounter_period_start = "to_date('" + period_start + "', 'yyyy-MM-dd')";
				}
				column += 'encounter_period_start,';
				values += encounter_period_start + ",";
			}
			if (typeof period_end !== 'undefined' && period_end !== "") {
				if (period_end == "") {
					encounter_period_end = null;
				} else {
					encounter_period_end = "to_date('" + period_end + "', 'yyyy-MM-dd')";
				}
				column += 'encounter_period_end,';
				values += encounter_period_end + ",";
			}
			if (typeof length !== 'undefined' && length !== "") {
        column += 'encounter_length,';
        values += "'" + length + "',";
      }
			if (typeof reason !== 'undefined' && reason !== "") {
        column += 'encounter_reason,';
        values += "'" + reason + "',";
      }
			if (typeof patient_id !== 'undefined' && patient_id !== "") {
        column += 'subject_patient_id,';
        values += "'" + patient_id + "',";
      }
			if (typeof group_id !== 'undefined' && group_id !== "") {
        column += 'subject_group_id,';
        values += "'" + group_id + "',";
      }
			if (typeof appointment_id !== 'undefined' && appointment_id !== "") {
        column += 'appointment_id,';
        values += "'" + appointment_id + "',";
      }
			if (typeof org_id !== 'undefined' && org_id !== "") {
        column += 'organization_id,';
        values += "'" + org_id + "',";
      }
			if (typeof parent_id !== 'undefined' && parent_id !== "") {
        column += 'parent_id,';
        values += "'" + parent_id + "',";
      }

      //var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER(ENCOUNTER_ID, ENCOUNTER_STATUS, ENCOUNTER_CLASS, ENCOUNTER_TYPE, ENCOUNTER_PRIORITY, ENCOUNTER_PERIOD_START, ENCOUNTER_PERIOD_END, ENCOUNTER_LENGTH, ENCOUNTER_REASON, SUBJECT_PATIENT_ID, SUBJECT_GROUP_ID, APPOINTMENT_ID, ORGANIZATION_ID, PARENT_ID)" + " VALUES ('" + id + "','" + status + "','" + encounter_class + "','" + type + "','" + priority + "',to_date('" + period_start + "','yyyy-MM-dd'),to_date('" + period_end + "','yyyy-MM-dd'), to_time('" + length + "','hh:mm:ss'),'" + reason + "','" + patient_id + "','" + group_id + "','" + appointment_id + "','" + org_id + "','" + parent_id + "')";
			
			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER(encounter_id, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";
			
			//console.log(query)
			db.upsert(query, function (succes) {
				console.log("encounter ok");
        var query = "SELECT ENCOUNTER_ID, ENCOUNTER_STATUS, ENCOUNTER_CLASS, ENCOUNTER_TYPE, ENCOUNTER_PRIORITY, ENCOUNTER_PERIOD_START, ENCOUNTER_PERIOD_END, ENCOUNTER_LENGTH, ENCOUNTER_REASON, SUBJECT_PATIENT_ID, SUBJECT_GROUP_ID, APPOINTMENT_ID, ORGANIZATION_ID, PARENT_ID FROM BACIRO_FHIR.ENCOUNTER WHERE ENCOUNTER_ID = '" + id + "' ";
				//console.log(query);
        db.query(query, function (dataJson) {
          rez = lowercaseObject(dataJson);
          res.json({
            "err_code": 0,
            "data": rez
          });
        }, function (e) {
          res.json({
            "err_code": 1,
            "err_msg": e,
            "application": "Api Phoenix",
            "function": "addEncounter"
          });
        });
      }, function (e) {
				console.log("encounter failed");
        res.json({
          "err_code": 2,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "addEncounter"
        });
      });
    },
		encounterClassHistory: function addEncounterClassHistory(req, res) {
			var id = req.body.class_history_id;
			var history_class = req.body.class_history_class;
			var period_start = req.body.class_history_period_start;
			var period_end = req.body.class_history_period_end;
			var encounter_id = req.body.encounter_id;
			
      var column = "";
      var values = "";
			
			if (typeof history_class !== 'undefined' && history_class !== "") {
        column += 'encounter_class_history_class,';
        values += "'" + history_class + "',";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
				if (period_start == "") {
					class_history_period_start = null;
				} else {
					class_history_period_start = "to_date('" + period_start + "', 'yyyy-MM-dd')";
				}
				column += 'encounter_class_history_period_start,';
				values += class_history_period_start + ",";
			}
			if (typeof period_end !== 'undefined' && period_end !== "") {
				if (period_end == "") {
					class_history_period_end = null;
				} else {
					class_history_period_end = "to_date('" + period_end + "', 'yyyy-MM-dd')";
				}
				column += 'encounter_class_history_period_end,';
				values += class_history_period_end + ",";
			}
			if (typeof encounter_id !== 'undefined' && encounter_id !== "") {
        column += 'encounter_id,';
        values += "'" + encounter_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_CLASS_HISTORY(encounter_class_history_id, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";
			
			//console.log(query)
			
			db.upsert(query, function (succes) {
				//var arrClassHistory = [];
				console.log("class history ok");
				var query = "SELECT encounter_class_history_id, encounter_class_history_class, encounter_class_history_period_start, encounter_class_history_period_end FROM BACIRO_FHIR.ENCOUNTER_CLASS_HISTORY WHERE encounter_class_history_id = '" + id + "' ";
				
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "addClassHistory"
					});
				});
			}, function (e) {
				console.log("class history failed");
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addClassHistory"
				});
			});
		},
		encounterStatusHistory: function addEncounterStatusHistory(req, res) {
			var id = req.body.status_history_id;
			var status = req.body.status_history_status;
			var period_start = req.body.status_history_period_start;
			var period_end = req.body.status_history_period_end;
			var encounter_id = req.body.encounter_id;
			
      var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'encounter_status_history_status,';
        values += "'" + status + "',";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
				if (period_start == "") {
					status_history_period_start = null;
				} else {
					status_history_period_start = "to_date('" + period_start + "', 'yyyy-MM-dd')";
				}
				column += 'encounter_status_history_period_start,';
				values += status_history_period_start + ",";
			}
			if (typeof period_end !== 'undefined' && period_end !== "") {
				if (period_end == "") {
					status_history_period_end = null;
				} else {
					status_history_period_end = "to_date('" + period_start + "', 'yyyy-MM-dd')";
				}
				column += 'encounter_status_history_period_end,';
				values += status_history_period_end + ",";
			}
			if (typeof encounter_id !== 'undefined' && encounter_id !== "") {
        column += 'encounter_id,';
        values += "'" + encounter_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_STATUS_HISTORY(ENCOUNTER_STATUS_HISTORY_ID, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";
			//console.log(query)
			
			db.upsert(query, function (succes) {
				//var arrStatusHistory = [];
				console.log("status history ok");
				var query = "SELECT encounter_status_history_id, encounter_status_history_status, encounter_status_history_period_start, encounter_status_history_period_end FROM BACIRO_FHIR.ENCOUNTER_STATUS_HISTORY WHERE encounter_status_history_id = '" + id + "' ";
				
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "addStatusHistory"
					});
				});
			}, function (e) {
				console.log("status history failed");
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addStatusHistory"
				});
			});
		},
		encounterDiagnosis: function addEncounterDiagnosis(req, res) {
			var id = req.body.diagnosis_id;
			var role = req.body.diagnosis_role;
			var rank = req.body.diagnosis_rank;
			var condition_id = req.body.condition_id;
			var procedure_id = req.body.procedure_id;
			var encounter_id = req.body.encounter_id;
			
			//susun query
      var column = "";
      var values = "";
			
			if (typeof role !== 'undefined' && role !== "") {
        column += 'encounter_diagnosis_role,';
        values += "'" + role + "',";
      }
			if (typeof rank !== 'undefined' && rank !== "") {
        column += 'encounter_diagnosis_rank,';
        values += rank + ",";
      }
			if (typeof condition_id !== 'undefined' && condition_id !== "") {
        column += 'condition_id,';
        values += "'" + condition_id + "',";
      }
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }
			if (typeof encounter_id !== 'undefined' && encounter_id !== "") {
        column += 'encounter_id,';
        values += "'" + encounter_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_DIAGNOSIS(encounter_diagnosis_id, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";
			//console.log(query)
			
			db.upsert(query, function (succes) {
				console.log("encounter diagnosis ok");
				var query = "SELECT encounter_diagnosis_id, encounter_diagnosis_role, encounter_diagnosis_rank, condition_id FROM BACIRO_FHIR.ENCOUNTER_DIAGNOSIS WHERE encounter_diagnosis_id = '" + id + "'";
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "addDiagnosis"
					});
				});
			}, function (e) {
				console.log("encounter diagnosis failed");
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addDiagnosis"
				});
			});
		},
		encounterHospitalization: function addEncounterHospitalization(req, res) {
			var id = req.body.hospitalization_id;
			var origin = req.body.hospitalization_origin;
			var admit_source = req.body.hospitalization_admit_source;
			var re_addmission = req.body.hospitalization_re_addmission;
			var diet_preference = req.body.hospitalization_diet_preference;
			var special_courtesy = req.body.hospitalization_special_courtesy;
			var special_arrangement = req.body.hospitalization_special_arrangement;
			var destination = req.body.hospitalization_destination;
      var discharge_dispotition = req.body.hospitalization_discharge_dispotition;
			var identifier_id = req.body.identifier_id;
			var encounter_id = req.body.encounter_id;
			//susun query
      var column = "";
      var values = "";
			
			if (typeof origin !== 'undefined' && origin !== "") {
        column += 'encounter_hospitalization_origin,';
        values += "'" + origin + "',";
      }
			if (typeof admit_source !== 'undefined' && admit_source !== "") {
        column += 'encounter_hospitalization_admit_source,';
        values += "'" + admit_source + "',";
      }
			if (typeof re_addmission !== 'undefined' && re_addmission !== "") {
        column += 'encounter_hospitalization_re_addmission,';
        values += "'" + re_addmission + "',";
      }
			if (typeof diet_preference !== 'undefined' && diet_preference !== "") {
        column += 'encounter_hospitalization_diet_preference,';
        values += "'" + diet_preference + "',";
      }
			if (typeof special_courtesy !== 'undefined' && special_courtesy !== "") {
        column += 'encounter_hospitalization_special_courtesy,';
        values += "'" + special_courtesy + "',";
      }
			if (typeof special_arrangement !== 'undefined' && special_arrangement !== "") {
        column += 'encounter_hospitalization_special_arrangement,';
        values += "'" + special_arrangement + "',";
      }
			if (typeof destination !== 'undefined' && destination !== "") {
        column += 'encounter_hospitalization_destination,';
        values += "'" + destination + "',";
      }
			if (typeof discharge_dispotitionvar !== 'undefined' && discharge_dispotitionvar !== "") {
        column += 'encounter_hospitalization_discharge_dispotition,';
        values += "'" + discharge_dispotitionvar + "',";
      }
			if (typeof identifier_id !== 'undefined' && identifier_id !== "") {
        column += 'identifier_id,';
        values += "'" + identifier_id + "',";
      }	
			if (typeof encounter_id !== 'undefined' && encounter_id !== "") {
        column += 'encounter_id,';
        values += "'" + encounter_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_HOSPITALIZATION(encounter_hospitalization_id, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";
			
			db.upsert(query, function (succes) {
				//var arrHospitalization = [];
				console.log("encounter hospitalization ok");
				var query = "SELECT encounter_hospitalization_id, encounter_hospitalization_origin, encounter_hospitalization_admit_source, encounter_hospitalization_re_addmission, encounter_hospitalization_diet_preference, encounter_hospitalization_special_courtesy, encounter_hospitalization_special_arrangement, encounter_hospitalization_destination, encounter_hospitalization_discharge_dispotition FROM BACIRO_FHIR.ENCOUNTER_HOSPITALIZATION WHERE encounter_hospitalization_id = '" + id + "' ";
				//console.log(query);
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "addHospitalization"
					});
				});
			}, function (e) {
				console.log("encounter hospitalization failed");
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addHospitalization"
				});
			});
		},
		encounterLocation: function addEncounterLocation(req, res) {
			var id = req.body.encounter_location_id;
			var status = req.body.location_status;
			var period_start = req.body.location_period_start;
			var period_end = req.body.location_period_end;
			var location_id = req.body.location_id;
			var encounter_id = req.body.encounter_id;
			//susun query
      var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'encounter_location_status,';
        values += "'" + status + "',";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
				if (period_start == "") {
					loc_period_start = null;
				} else {
					loc_period_start = "to_date('" + period_start + "', 'yyyy-MM-dd')";
				}
				column += 'encounter_location_period_start,';
				values += loc_period_start + ",";
			}
			if (typeof period_end !== 'undefined' && period_end !== "") {
				if (period_end == "") {
					loc_period_end = null;
				} else {
					loc_period_end = "to_date('" + period_end + "', 'yyyy-MM-dd')";
				}
				column += 'encounter_location_period_end,';
				values += loc_period_end + ",";
			}
			if (typeof location_id !== 'undefined' && location_id !== "") {
        column += 'location_id,';
        values += "'" + location_id + "',";
      }	
			if (typeof encounter_id !== 'undefined' && encounter_id !== "") {
        column += 'encounter_id,';
        values += "'" + encounter_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_LOCATION(encounter_location_id, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";
			
			db.upsert(query, function (succes) {
				//var arrHospitalization = [];
				console.log("encounter location ok");
				var query = "SELECT encounter_location_id, encounter_location_status, encounter_location_period_start, encounter_location_period_end, location_id FROM BACIRO_FHIR.ENCOUNTER_LOCATION WHERE encounter_location_id = '" + id + "' ";
				//console.log(query);
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "addLocation"
					});
				});
			}, function (e) {
				console.log("encounter location failed");
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addLocation"
				});
			});
		},
		encounterParticipant: function addEncounterParticipant(req, res) {
			var id = req.body.participant_id;
			var type = req.body.participant_type;
			var period_start = req.body.participant_period_start;
			var period_end = req.body.participant_period_end;
			var practitioner_id = req.body.individual_practitioner_id;
			var related_person_id = req.body.individual_related_person_id;
			var encounter_id = req.body.encounter_id;
			//susun query
      var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'encounter_participant_type,';
        values += "'" + type + "',";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
				if (period_start == "") {
					part_period_start = null;
				} else {
					part_period_start = "to_date('" + period_start + "', 'yyyy-MM-dd')";
				}
				column += 'encounter_participant_period_start,';
				values += part_period_start + ",";
			}
			if (typeof period_end !== 'undefined' && period_end !== "") {
				if (period_end == "") {
					part_period_end = null;
				} else {
					part_period_end = "to_date('" + period_end + "', 'yyyy-MM-dd')";
				}
				column += 'encounter_participant_period_end,';
				values += part_period_end + ",";
			}
			if (typeof practitioner_id !== 'undefined' && practitioner_id !== "") {
        column += 'individual_practitioner_id,';
        values += "'" + practitioner_id + "',";
      }	
			if (typeof related_person_id !== 'undefined' && related_person_id !== "") {
        column += 'individual_related_person_id,';
        values += "'" + related_person_id + "',";
      }	
			if (typeof encounter_id !== 'undefined' && encounter_id !== "") {
        column += 'encounter_id,';
        values += "'" + encounter_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_PARTICIPANT(encounter_participant_id, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";
			
			db.upsert(query, function (succes) {
				//var arrHospitalization = [];
				console.log("encounter participant ok");
				var query = "SELECT encounter_participant_id, encounter_participant_type, encounter_participant_period_start, encounter_participant_period_end, individual_practitioner_id, individual_related_person_id FROM BACIRO_FHIR.ENCOUNTER_PARTICIPANT WHERE encounter_participant_id = '" + id + "' ";
				//console.log(query);
				db.query(query, function (dataJson) {
					rez = lowercaseObject(dataJson);
					res.json({
						"err_code": 0,
						"data": rez
					});
				}, function (e) {
					res.json({
						"err_code": 1,
						"err_msg": e,
						"application": "Api Phoenix",
						"function": "addParticipant"
					});
				});
			}, function (e) {
				console.log("encounter participant failed");
				res.json({
					"err_code": 2,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "addParticipant"
				});
			});
		}
  },
	put: {
		encounter: function updateEncounter(req, res) {
			var encounter_id = req.params._id;
			
			var encounter_status = req.body.encounter_status;
			var encounter_class = req.body.encounter_class;
			var encounter_type = req.body.encounter_type;
			var encounter_priority = req.body.encounter_priority;
			var encounter_period_start = req.body.encounter_period_start;
			var encounter_period_end = req.body.encounter_period_end;
			var encounter_length = req.body.encounter_length;
			var encounter_reason = req.body.encounter_reason;
			var subject_patient_id = req.body.subject_patient_id;
			var subject_group_id = req.body.subject_group_id;
			var appointment_id = req.body.appointment_id;
			var organization_id = req.body.organization_id;
			var parent_id = req.body.parent_id;
			
			//susun query update
      var column = "";
      var values = "";
			
			if (typeof encounter_status !== 'undefined' && encounter_status !== "") {
        column += 'encounter_status,';
        values += "'" + encounter_status + "',";
      }
			if (typeof encounter_class !== 'undefined' && encounter_class !== "") {
        column += 'encounter_class,';
        values += "'" + encounter_class + "',";
      }
			if (typeof encounter_type !== 'undefined' && encounter_type !== "") {
        column += 'encounter_type,';
        values += "'" + encounter_type + "',";
      }
			if (typeof encounter_priority !== 'undefined' && encounter_priority !== "") {
        column += 'encounter_priority,';
        values += "'" + encounter_priority + "',";
      }
			if (typeof encounter_period_start !== 'undefined' && encounter_period_start !== "") {
        column += 'encounter_period_start,';
        values += "to_date('" + encounter_period_start + "', 'yyyy-MM-dd'),";
      }
			if (typeof encounter_period_end !== 'undefined' && encounter_period_end !== "") {
        column += 'encounter_period_end,';
        values += "to_date('" + encounter_period_end + "', 'yyyy-MM-dd'),";
      }
			if (typeof encounter_length !== 'undefined' && encounter_length !== "") {
        column += 'encounter_length,';
        values += "'" + encounter_length + "',";
      }
			if (typeof encounter_reason !== 'undefined' && encounter_reason !== "") {
        column += 'encounter_reason,';
        values += "'" + encounter_reason + "',";
      }
			if (typeof subject_patient_id !== 'undefined' && subject_patient_id !== "") {
        column += 'subject_patient_id,';
        values += "'" + subject_patient_id + "',";
      }
			if (typeof subject_group_id !== 'undefined' && subject_group_id !== "") {
        column += 'subject_group_id,';
        values += "'" + subject_group_id + "',";
      }
			if (typeof appointment_id !== 'undefined' && appointment_id !== "") {
        column += 'appointment_id,';
        values += "'" + appointment_id + "',";
      }
			if (typeof organization_id !== 'undefined' && organization_id !== "") {
        column += 'organization_id,';
        values += "'" + organization_id + "',";
      }
			if (typeof parent_id !== 'undefined' && parent_id !== "") {
        column += 'parent_id,';
        values += "'" + parent_id + "',";
      }
			
			var condition = "encounter_id = '" + encounter_id + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER(encounter_id," + column.slice(0, -1) + ") SELECT encounter_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER WHERE " + condition;
			
			db.upsert(query, function (succes) {
        res.json({
          "err_code": 0,
          "err_msg": "Success updated."
        });
      }, function (e) {
        res.json({
          "err_code": 1,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "updateEncounter"
        });
      });
		},
		statusHistory: function updateStatusHistory(req, res) {
			var id = req.params._id;
			var domainResource = req.params.dr;
			
			var status_history_status = req.body.encounter_status_history_status;
			var status_history_period_start = req.body.encounter_status_history_period_start;
			var status_history_period_end = req.body.encounter_status_history_period_end;
			
			//susun query update
      var column = "";
      var values = "";
			
			if (typeof status_history_status !== 'undefined' && status_history_status !== "") {
        column += 'encounter_status_history_status,';
        values += "'" + status_history_status + "',";
      }
			if (typeof status_history_period_start !== 'undefined' && status_history_period_start !== "") {
        column += 'encounter_status_history_period_start,';
        values += "to_date('" + status_history_period_start + "', 'yyyy-MM-dd'),";
      }
			if (typeof status_history_period_end !== 'undefined' && status_history_period_end !== "") {
        column += 'encounter_status_history_period_end,';
        values += "to_date('" + status_history_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (domainResource !== "" && typeof domainResource !== 'undefined') {
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "encounter_status_history_id = '" + id + "' AND " + fieldResource + " = '" + valueResource + "'";
			} else {
				var condition = "encounter_status_history_id = '" + id + "'";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_STATUS_HISTORY(encounter_status_history_id," + column.slice(0, -1) + ") SELECT encounter_status_history_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_STATUS_HISTORY WHERE " + condition;
			console.log(query)
			db.upsert(query, function (succes) {
        res.json({
          "err_code": 0,
          "err_msg": "Success updated."
        });
      }, function (e) {
        res.json({
          "err_code": 1,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "updateStatusHistory"
        });
      });
		},
		classHistory: function updateClassHistory(req, res) {
			var id = req.params._id;
			var domainResource = req.params.dr;
			
			var class_history_class = req.body.encounter_class_history_class;
			var class_history_period_start = req.body.encounter_class_history_period_start;
			var class_history_period_end = req.body.encounter_class_history_period_end;
			
			//susun query update
      var column = "";
      var values = "";
			
			if (typeof class_history_class !== 'undefined' && class_history_class !== "") {
        column += 'encounter_class_history_class,';
        values += "'" + class_history_class + "',";
      }
			if (typeof class_history_period_start !== 'undefined' && class_history_period_start !== "") {
        column += 'encounter_class_history_period_start,';
        values += "to_date('" + class_history_period_start + "', 'yyyy-MM-dd'),";
      }
			if (typeof class_history_period_end !== 'undefined' && class_history_period_end !== "") {
        column += 'encounter_class_history_period_end,';
        values += "to_date('" + class_history_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (domainResource !== "" && typeof domainResource !== 'undefined') {
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "encounter_class_history_id = '" + id + "' AND " + fieldResource + " = '" + valueResource + "'";
			} else {
				var condition = "encounter_class_history_id = '" + id + "'";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_CLASS_HISTORY(encounter_class_history_id," + column.slice(0, -1) + ") SELECT encounter_class_history_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_CLASS_HISTORY WHERE " + condition;
			console.log(query)
			db.upsert(query, function (succes) {
        res.json({
          "err_code": 0,
          "err_msg": "Success updated."
        });
      }, function (e) {
        res.json({
          "err_code": 1,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "updateClassHistory"
        });
      });
		},
		diagnosis: function updateDiagnosis(req, res) {
			var id = req.params._id;
			var domainResource = req.params.dr;
			
			var role = req.body.encounter_diagnosis_role;
			var rank = req.body.encounter_diagnosis_rank;
			var condition = req.body.condition_id;
			var procedure = req.body.procedure_id;
			
			//susun query update
      var column = "";
      var values = "";
			
			if (typeof role !== 'undefined' && role !== "") {
        column += 'encounter_diagnosis_role,';
        values += "'" + role + "',";
      }
			if (typeof rank !== 'undefined' && rank !== "") {
        column += 'encounter_diagnosis_rank,';
        values += rank + ",";
      }
			if (typeof condition !== 'undefined' && condition !== "") {
        column += 'condition_id,';
        values += "'" + condition + "',";
      }
			if (typeof procedure !== 'undefined' && procedure !== "") {
        column += 'procedure_id,';
        values += "'" + procedure + "',";
      }
			
			if (domainResource !== "" && typeof domainResource !== 'undefined') {
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "encounter_diagnosis_id = '" + id + "' AND " + fieldResource + " = '" + valueResource + "'";
			} else {
				var condition = "encounter_diagnosis_id = '" + id + "'";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_DIAGNOSIS(encounter_diagnosis_id," + column.slice(0, -1) + ") SELECT encounter_diagnosis_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_DIAGNOSIS WHERE " + condition;
			console.log(query)
			db.upsert(query, function (succes) {
        res.json({
          "err_code": 0,
          "err_msg": "Success updated."
        });
      }, function (e) {
        res.json({
          "err_code": 1,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "updateDiagnosis"
        });
      });
		},
		hospitalization: function updateHospitalization(req, res) {
			var id = req.params._id;
			var domainResource = req.params.dr;
			
			//encounter_hospitalization_id;
			var origin = req.body.encounter_hospitalization_origin;
			var admit_source = req.body.encounter_hospitalization_admit_source;
			var re_addmission = req.body.encounter_hospitalization_re_addmission;
			var diet_preference = req.body.encounter_hospitalization_diet_preference;
			var special_courtesy = req.body.encounter_hospitalization_special_courtesy;
			var special_arrangement = req.body.encounter_hospitalization_special_arrangement;
			var destination = req.body.encounter_hospitalization_destination;
			var discharge_dispotition = req.body.encounter_hospitalization_discharge_dispotition;
			var identifier_id = req.body.identifier_id;
			
			//susun query update
      var column = "";
      var values = "";
			
			if (typeof origin !== 'undefined' && origin !== "") {
        column += 'encounter_hospitalization_origin,';
        values += "'" + origin + "',";
      }
			if (typeof admit_source !== 'undefined' && admit_source !== "") {
        column += 'encounter_hospitalization_admit_source,';
        values += "'" + admit_source + "',";
      }
			if (typeof re_addmission !== 'undefined' && re_addmission !== "") {
        column += 'encounter_hospitalization_re_addmission,';
        values += "'" + re_addmission + "',";
      }
			if (typeof diet_preference !== 'undefined' && diet_preference !== "") {
        column += 'encounter_hospitalization_diet_preference,';
        values += "'" + diet_preference + "',";
      }
			if (typeof special_courtesy !== 'undefined' && special_courtesy !== "") {
        column += 'encounter_hospitalization_special_courtesy,';
        values += "'" + special_courtesy + "',";
      }
			if (typeof special_arrangement !== 'undefined' && special_arrangement !== "") {
        column += 'encounter_hospitalization_special_arrangement,';
        values += "'" + special_arrangement + "',";
      }
			if (typeof destination !== 'undefined' && destination !== "") {
        column += 'encounter_hospitalization_destination,';
        values += "'" + destination + "',";
      }
			if (typeof discharge_dispotition !== 'undefined' && discharge_dispotition !== "") {
        column += 'encounter_hospitalization_discharge_dispotition,';
        values += "'" + discharge_dispotition + "',";
      }
			if (typeof identifier_id !== 'undefined' && identifier_id !== "") {
        column += 'identifier_id,';
        values += "'" + identifier_id + "',";
      }
			
			if (domainResource !== "" && typeof domainResource !== 'undefined') {
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "encounter_hospitalization_id = '" + id + "' AND " + fieldResource + " = '" + valueResource + "'";
			} else {
				var condition = "encounter_hospitalization_id = '" + id + "'";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_HOSPITALIZATION(encounter_hospitalization_id," + column.slice(0, -1) + ") SELECT encounter_hospitalization_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_HOSPITALIZATION WHERE " + condition;
			console.log(query)
			db.upsert(query, function (succes) {
        res.json({
          "err_code": 0,
          "err_msg": "Success updated."
        });
      }, function (e) {
        res.json({
          "err_code": 1,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "updateHospitalization"
        });
      });
		},
		location: function updateLocation(req, res) {
			var id = req.params._id;
			var domainResource = req.params.dr;
			
			var status = req.body.encounter_location_status;
			var period_start = req.body.encounter_location_period_start;
			var period_end = req.body.encounter_location_period_end;
			var location = req.body.location_id;
			
			//susun query update
      var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'encounter_location_status,';
        values += "'" + status + "',";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
        column += 'encounter_location_period_start,';
        values += "to_date('" + period_start + "', 'yyyy-MM-dd'),";
      }
			if (typeof period_end !== 'undefined' && period_end !== "") {
        column += 'encounter_location_period_end,';
        values += "to_date('" + period_end + "', 'yyyy-MM-dd'),";
      }
			if (typeof location !== 'undefined' && location !== "") {
        column += 'location_id,';
        values += "'" + location + "',";
      }
			
			if (domainResource !== "" && typeof domainResource !== 'undefined') {
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "encounter_location_id = '" + id + "' AND " + fieldResource + " = '" + valueResource + "'";
			} else {
				var condition = "encounter_location_id = '" + id + "'";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_LOCATION(encounter_location_id," + column.slice(0, -1) + ") SELECT encounter_location_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_LOCATION WHERE " + condition;
			console.log(query)
			db.upsert(query, function (succes) {
        res.json({
          "err_code": 0,
          "err_msg": "Success updated."
        });
      }, function (e) {
        res.json({
          "err_code": 1,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "updateLocation"
        });
      });
		},
		participant: function updateParticipant(req, res) {
			var id = req.params._id;
			var domainResource = req.params.dr;
			
			//encounter_participant_id varchar(11) NOT NULL PRIMARY KEY,
			var type = req.body.encounter_participant_type;
			var period_start = req.body.encounter_participant_period_start;
			var period_end = req.body.encounter_participant_period_end;
			var practitioner_id = req.body.individual_practitioner_id;
			var related_person_id = req.body.individual_related_person_id;
			
			//susun query update
      var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'encounter_participant_type,';
        values += "'" + type + "',";
      }
			if (typeof period_start !== 'undefined' && period_start !== "") {
        column += 'encounter_participant_period_start,';
        values += "to_date('" + period_start + "', 'yyyy-MM-dd'),";
      }
			if (typeof period_end !== 'undefined' && period_end !== "") {
        column += 'encounter_participant_period_end,';
        values += "to_date('" + period_end + "', 'yyyy-MM-dd'),";
      }
			if (typeof practitioner_id !== 'undefined' && practitioner_id !== "") {
        column += 'individual_practitioner_id,';
        values += "'" + practitioner_id + "',";
      }
			if (typeof related_person_id !== 'undefined' && related_person_id !== "") {
        column += 'individual_related_person_id,';
        values += "'" + related_person_id + "',";
      }
			
			if (domainResource !== "" && typeof domainResource !== 'undefined') {
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "encounter_participant_id = '" + id + "' AND " + fieldResource + " = '" + valueResource + "'";
			} else {
				var condition = "encounter_participant_id = '" + id + "'";
			}
			
			var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER_PARTICIPANT(encounter_participant_id," + column.slice(0, -1) + ") SELECT encounter_participant_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ENCOUNTER_PARTICIPANT WHERE " + condition;
			console.log(query)
			db.upsert(query, function (succes) {
        res.json({
          "err_code": 0,
          "err_msg": "Success updated."
        });
      }, function (e) {
        res.json({
          "err_code": 1,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "updateParticipant"
        });
      });
		}
	}
}

function lowercaseObject(jsonData) {
  var rez = [];
  for (i = 0; i < jsonData.length; i++) {
    json = JSON.stringify(jsonData[i]);
    json2 = json.replace(/"([^"]+)":/g, function ($0, $1) {
        return ('"' + $1.toLowerCase() + '":');
      });
    rez[i] = JSON.parse(json2);
  }
  return rez;
}

function checkApikey(apikey) {
  var query = "SELECT user_id FROM baciro.user WHERE user_apikey = '" + apikey + "' ";

  db.query(query, function (dataJson) {
    rez = lowercaseObject(dataJson);
    return rez;
  }, function (e) {
    return {
      "err_code": 1,
      "err_msg": e,
      "application": "Api Phoenix",
      "function": "checkApikey"
    };
  });
}

function formatDate(date) {
  var d = new Date(date),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

module.exports = controller;