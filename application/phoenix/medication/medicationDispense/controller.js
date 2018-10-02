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
		medicationDispense: function getMedicationDispense(req, res){
			var apikey = req.params.apikey;
			
			var medication_dispense_id = req.query._id;
			var code = req.query.code;
			var context = req.query.context;
			var device = req.query.device;
			var effective_time = req.query.effective_time;
			var identifier = req.query.identifier;
			var medication = req.query.medication;
			var not_given = req.query.not_given;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var prescription = req.query.prescription;
			var reason_given = req.query.reason_given;
			var reason_not_given = req.query.reason_not_given;
			var status = req.query.status;
			var subject = req.query.subject;
	
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof medication_dispense_id !== 'undefined' && medication_dispense_id !== ""){
        condition += "md.medication_dispense_id = '" + medication_dispense_id + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
				condition += "ma.CODE = " + code + " AND,";  
      }
			
			if(typeof context !== 'undefined' && context !== ""){
				condition += "(ma.CONTEXT_ENCOUNTER = '" + context + "' OR ma.CONTEXT_EPISODE_OF_CARE = '" + context + "') AND,";  
			}
			
			if(typeof device !== 'undefined' && device !== ""){
				join += " LEFT JOIN BACIRO_FHIR.DEVICE de on ma.medication_administration_id = de.medication_administration_id ";
        condition += "de.device_id = '" + device + "' AND,";  
      }
			
			if (typeof effective_time !== 'undefined' && effective_time !== "") {
				condition += "ma.EFFECTIVE_DATE_TIME == to_date('" + effective_time + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on ma.medication_administration_id = i.medication_administration_id ";
        condition += "i.identifier_value = '" + identifier + "' AND,";  
      }
			
			if(typeof medication !== 'undefined' && medication !== ""){
				join += " LEFT JOIN BACIRO_FHIR.medication m on ma.medication_administration_id = m.medication_administration_id ";
        condition += "i.medication_id = '" + medication + "' AND,";  
      }
			
			if(typeof not_given !== 'undefined' && not_given !== ""){
        condition += "m.form = " + not_given + " AND,";  
      }
			
			if(typeof subject !== 'subject' && subject !== ""){
				condition += "(ma.SUBJECT_PATIENT = '" + subject + "' OR ma.SUBJECT_GROUP = '" + subject + "') AND,";  
			}
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "ma.SUBJECT_PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof performer !== 'undefined' && performer !== ""){
				join += " LEFT JOIN BACIRO_FHIR.MEDICATION_ADMINISTRATION_PERFORMER map on ma.medication_administration_id = map.medication_administration_id ";
        condition += "(map.ACTOR_PRACTITIONER = '" + performer + "' OR map.ACTOR_PATIENT = '" + performer + "' OR map.ACTOR_RELATED_PERSON = '" + performer + "' OR map.ACTOR_DEVICE = '" + performer + "') AND,"; 
      }
			
			if(typeof prescription !== 'undefined' && prescription !== ""){
        condition += "ma.prescription = '" + prescription + "' AND,";  
      }
			
			if(typeof reason_given !== 'undefined' && reason_given !== ""){
        condition += "ma.REASON_CODE = '" + reason_given + "' AND,";  
      }
			
			if(typeof reason_not_given !== 'undefined' && reason_not_given !== ""){
        condition += "ma.REASON_NOT_GIVEN = '" + reason_not_given + "' AND,";  
      }
			
			if(typeof status !== 'undefined' && status !== ""){
        condition += "ma.STATUS = '" + status + "' AND,";  
      }
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrMedicationDispense = [];
      var query = 'select medication_dispense_id, status, category, medication_codeable_concept, medication_reference, subject_patient, subject_group, context_encounter, context_episode_of_care, supporting_information,  "type" as value_type,  quantity, days_supply, when_prepared, when_handed_over, destination, not_done, not_done_reason_codeable_concept, not_done_reason_reference from BACIRO_FHIR.MEDICATION_DISPENSE md ' + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var MedicationDispense = {};
					MedicationDispense.resourceType = "MedicationDispense";
          MedicationDispense.id = rez[i].medication_dispense_id;
					MedicationDispense.status = rez[i].status;
					MedicationDispense.category = rez[i].category;
					MedicationDispense.medication.medicationCodeableConcept = rez[i].medication_codeable_concept;
					MedicationDispense.medication.medicationReference = rez[i].medication_reference;
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
					MedicationDispense.subject = arrSubject;
					MedicationDispense.context = arrContext;
					MedicationDispense.supportingInformation = rez[i].supporting_information;
					MedicationDispense.type = rez[i].value_type;
					MedicationDispense.quantity = rez[i].quantity;
					MedicationDispense.daysSupply = rez[i].days_supply;
					if(rez[i].when_prepared == null){
						MedicationDispense.whenPrepared = formatDate(rez[i].when_prepared);
					}else{
						MedicationDispense.whenPrepared = rez[i].when_prepared;
					}
					if(rez[i].when_handed_over == null){
						MedicationDispense.whenHandedOver = formatDate(rez[i].when_handed_over);
					}else{
						MedicationDispense.whenHandedOver = rez[i].when_handed_over;
					}
					if(rez[i].destination != "null"){
						MedicationDispense.destination = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].destination;
					} else {
						MedicationDispense.destination = "";
					}
					MedicationDispense.notDone = rez[i].not_done;
					MedicationDispense.notDoneReason.notDoneReasonCodeableConcept = rez[i].not_done_reason_codeable_concept;
					MedicationDispense.notDoneReason.notDoneReasonReference = rez[i].not_done_reason_reference;
          arrMedicationDispense[i] = MedicationDispense;
        }
        res.json({"err_code":0,"data": arrMedicationDispense});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationDispense"});
      });
    },
		medicationDispensePerformer: function getMedicationDispensePerformer(req, res) {
			var apikey = req.params.apikey;
			
			var medicationDispensePerformerId = req.query._id;
			var medicationDispenseId = req.query.medication_dispense_id;

			//susun query
			var condition = "";

			if (typeof medicationDispensePerformerId !== 'undefined' && medicationDispensePerformerId !== "") {
				condition += "PERFORMER_ID = '" + medicationDispensePerformerId + "' AND ";
			}

			if (typeof medicationDispenseId !== 'undefined' && medicationDispenseId !== "") {
				condition += "MEDICATION_DISPENSE_ID = '" + medicationDispenseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrMedicationDispensePerformer = [];
			var query = "select performer_id, actor_practitioner, actor_patient, actor_related_person, actor_device, on_behalf_of, medication_dispense_id from BACIRO_FHIR.MEDICATION_DISPENCE_PERFORMER " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var MedicationDispensePerformer = {};
					MedicationDispensePerformer.id = rez[i].performer_id;
					var arrActor = [];
					var Actor = {};
					if(rez[i].actor_practitioner != "null"){
						Actor.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].actor_practitioner;
					} else {
						Actor.practitioner = "";
					}
					if(rez[i].actor_patient != "null"){
						Actor.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].actor_patient;
					} else {
						Actor.patient = "";
					}
					if(rez[i].actor_related_person != "null"){
						Actor.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].actor_related_person;
					} else {
						Actor.relatedPerson = "";
					}
					if(rez[i].actor_device != "null"){
						Actor.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].actor_device;
					} else {
						Actor.device = "";
					}
					arrActor[i] = Actor;
					MedicationDispensePerformer.actor  = arrActor;
					if(rez[i].on_behalf_of != "null"){
						MedicationDispensePerformer.onBehalfOf = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].on_behalf_of;
					} else {
						MedicationDispensePerformer.onBehalfOf = "";
					}
					arrMedicationDispensePerformer[i] = MedicationDispensePerformer;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationDispensePerformer
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationDispensePerformer"
				});
			});
		},
		medicationDispenseSubstitution: function getMedicationDispenseSubstitution(req, res) {
			var apikey = req.params.apikey;
			
			var medicationDispenseSubstitutionId = req.query._id;
			var medicationDispenseId = req.query.medication_dispense_id;

			//susun query
			var condition = "";

			if (typeof medicationDispenseSubstitutionId !== 'undefined' && medicationDispenseSubstitutionId !== "") {
				condition += "SUBSTITUTION_ID = '" + medicationDispenseSubstitutionId + "' AND ";
			}

			if (typeof medicationDispenseId !== 'undefined' && medicationDispenseId !== "") {
				condition += "MEDICATION_DISPENSE_ID = '" + medicationDispenseId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrMedicationDispenseSubstitution = [];
			var query = 'select substitution_id, was_substituted, "type" as val_type, reason, medication_dispense_id from BACIRO_FHIR.MEDICATION_DISPENSE_SUBSTITUTION ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var MedicationDispenseSubstitution = {};
					MedicationDispenseSubstitution.id = rez[i].substitution_id;
					MedicationDispenseSubstitution.wasSubstituted = rez[i].was_substituted;
					MedicationDispenseSubstitution.type = rez[i].val_type;
					MedicationDispenseSubstitution.reason = rez[i].reason;
					arrMedicationDispenseSubstitution[i] = MedicationDispenseSubstitution;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationDispenseSubstitution
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationDispenseSubstitution"
				});
			});
		},
		
  },
	post: {
		medicationDispense: function addMedicationDispense(req, res) {
			console.log(req.body);
			var medication_dispense_id = req.body.medication_dispense_id;
			var status = req.body.status;
			var category = req.body.category;
			var medication_codeable_concept = req.body.medication_codeable_concept;
			var medication_reference = req.body.medication_reference;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var supporting_information = req.body.supporting_information;
			var type = req.body.type;
			var quantity = req.body.quantity;
			var days_supply = req.body.days_supply;
			var when_prepared = req.body.when_prepared;
			var when_handed_over = req.body.when_handed_over;
			var destination = req.body.destination;
			var not_done = req.body.not_done;
			var not_done_reason_codeable_concept = req.body.not_done_reason_codeable_concept;
			var not_done_reason_reference = req.body.not_done_reason_reference;
			
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
			
			if (typeof type !== 'undefined' && type !== "") {
        column += '"type",';
        values += "'" + type + "',";
      }		
			
			if (typeof quantity !== 'undefined' && quantity !== "") {
        column += 'quantity,';
        values += " " + quantity + ",";
      }		
			
			if (typeof days_supply !== 'undefined' && days_supply !== "") {
        column += 'days_supply,';
        values += " " + days_supply + ",";
      }		
			
			if (typeof when_prepared !== 'undefined' && when_prepared !== "") {
        column += 'when_prepared,';
				values += "to_date('"+ when_prepared + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof when_handed_over !== 'undefined' && when_handed_over !== "") {
        column += 'when_handed_over,';
        //values += "'" + date + "',";
				values += "to_date('"+ when_handed_over + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof not_done !== 'undefined' && not_done !== "") {
        column += 'not_done,';
        values += " " + not_done + ",";
      }
			
			if (typeof destination !== 'undefined' && destination !== "") {
        column += 'destination,';
        values += "'" + destination + "',";
      }
			
			if (typeof not_done_reason_codeable_concept !== 'undefined' && not_done_reason_codeable_concept !== "") {
        column += 'not_done_reason_codeable_concept,';
        values += "'" + not_done_reason_codeable_concept + "',";
      }
			
			if (typeof not_done_reason_reference !== 'undefined' && not_done_reason_reference !== "") {
        column += 'not_done_reason_reference,';
        values += "'" + not_done_reason_reference + "',";
      }
			
      var query = 'UPSERT INTO BACIRO_FHIR.MEDICATION_DISPENSE(medication_dispense_id, ' + column.slice(0, -1) + ')'+
        ' VALUES ("'+medication_dispense_id+'", ' + values.slice(0, -1) + ')';
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = 'select medication_dispense_id, status, category, medication_codeable_concept, medication_reference, subject_patient, subject_group, context_encounter, context_episode_of_care, supporting_information,  "type",  quantity, days_supply, when_prepared, when_handed_over, destination, not_done, not_done_reason_codeable_concept, not_done_reason_reference from BACIRO_FHIR.MEDICATION_DISPENSE WHERE medication_dispense_id = "' + medication_dispense_id + '" ';
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationDispense"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationDispense"});
      });
    },
		medicationDispensePerformer: function addMedicationDispensePerformer(req, res) {
			console.log(req.body);
			var performer_id  = req.body.performer_id;
			var actor_practitioner = req.body.actor_practitioner;
			var actor_patient = req.body.actor_patient;
			var actor_related_person = req.body.actor_related_person;
			var actor_device = req.body.actor_device;
			var on_behalf_of = req.body.on_behalf_of;
			var medication_dispense_id = req.body.medication_dispense_id;

			var column = "";
      var values = "";
			
			if (typeof actor_practitioner !== 'undefined' && actor_practitioner !== "") {
        column += 'actor_practitioner,';
        values += "'" + actor_practitioner + "',";
      }
			
			if (typeof actor_patient !== 'undefined' && actor_patient !== "") {
        column += 'actor_patient,';
        values += "'" + actor_patient + "',";
      }
			
			if (typeof actor_related_person !== 'undefined' && actor_related_person !== "") {
        column += 'actor_related_person,';
        values += "'" + actor_related_person + "',";
      }
			
			if (typeof actor_device !== 'undefined' && actor_device !== "") {
        column += 'actor_device,';
        values += "'" + actor_device + "',";
      }
			
			if (typeof on_behalf_of !== 'undefined' && on_behalf_of !== "") {
        column += 'on_behalf_of,';
        values += "'" + on_behalf_of + "',";
      }
			
			if (typeof medication_dispense_id !== 'undefined' && medication_dispense_id !== "") {
        column += 'medication_dispense_id,';
        values += "'" + medication_dispense_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_DISPENCE_PERFORMER(performer_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+performer_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select performer_id, actor_practitioner, actor_patient, actor_related_person, actor_device, on_behalf_of, medication_dispense_id from BACIRO_FHIR.MEDICATION_DISPENCE_PERFORMER WHERE ingredient_id = '" + ingredient_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationDispensePerformer"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationDispensePerformer"});
      });
    },
		medicationDispenseSubstitution: function addMedicationDispenseSubstitution(req, res) {
			console.log(req.body);
			var substitution_id  = req.body.substitution_id;
			var was_substituted  = req.body.was_substituted;
			var type  = req.body.type;
			var reason  = req.body.reason;
			var medication_dispense_id  = req.body.medication_dispense_id;

			var column = "";
      var values = "";
			
			if (typeof was_substituted !== 'undefined' && was_substituted !== "") {
        column += 'was_substituted,';
        values += " " + was_substituted + ",";
      }
			
			if (typeof type !== 'undefined' && type !== "") {
        column += '"type",';
        values += "'" + type + "',";
      }
			
			if (typeof route !== 'undefined' && route !== "") {
        column += 'route,';
        values += "'" + route + "',";
      }
			
			if (typeof method !== 'undefined' && method !== "") {
        column += 'method,';
        values += "'" + method + "',";
      }
			
			if (typeof dose !== 'undefined' && dose !== "") {
        column += 'dose,';
        values += " " + dose + ",";
      }
			
			if (typeof rate_ratio !== 'undefined' && rate_ratio !== "") {
        column += 'rate_ratio,';
        values += " " + rate_ratio + ",";
      }
			
			if (typeof rate_quality !== 'undefined' && rate_quality !== "") {
        column += 'rate_quality,';
        values += " " + rate_quality + ",";
      }
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_DISPENSE_SUBSTITUTION(substitution_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+substitution_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = 'select substitution_id, was_substituted, "type", reason, medication_dispense_id from BACIRO_FHIR.MEDICATION_DISPENSE_SUBSTITUTION WHERE substitution_id = "' + substitution_id + '" ';
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationDispenseSubstitution"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationDispenseSubstitution"});
      });
    },
	},
	put: {
		medicationDispense: function updateMedicationDispense(req, res) {
			console.log(req.body);
			var medication_dispense_id = req.params.medication_dispense_id;
			var status = req.body.status;
			var category = req.body.category;
			var medication_codeable_concept = req.body.medication_codeable_concept;
			var medication_reference = req.body.medication_reference;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var supporting_information = req.body.supporting_information;
			var type = req.body.type;
			var quantity = req.body.quantity;
			var days_supply = req.body.days_supply;
			var when_prepared = req.body.when_prepared;
			var when_handed_over = req.body.when_handed_over;
			var destination = req.body.destination;
			var not_done = req.body.not_done;
			var not_done_reason_codeable_concept = req.body.not_done_reason_codeable_concept;
			var not_done_reason_reference = req.body.not_done_reason_reference;
			
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
			
			if (typeof type !== 'undefined' && type !== "") {
        column += '"type",';
        values += "'" + type + "',";
      }		
			
			if (typeof quantity !== 'undefined' && quantity !== "") {
        column += 'quantity,';
        values += " " + quantity + ",";
      }		
			
			if (typeof days_supply !== 'undefined' && days_supply !== "") {
        column += 'days_supply,';
        values += " " + days_supply + ",";
      }		
			
			if (typeof when_prepared !== 'undefined' && when_prepared !== "") {
        column += 'when_prepared,';
				values += "to_date('"+ when_prepared + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof when_handed_over !== 'undefined' && when_handed_over !== "") {
        column += 'when_handed_over,';
        //values += "'" + date + "',";
				values += "to_date('"+ when_handed_over + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof not_done !== 'undefined' && not_done !== "") {
        column += 'not_done,';
        values += " " + not_done + ",";
      }
			
			if (typeof destination !== 'undefined' && destination !== "") {
        column += 'destination,';
        values += "'" + destination + "',";
      }
			
			if (typeof not_done_reason_codeable_concept !== 'undefined' && not_done_reason_codeable_concept !== "") {
        column += 'not_done_reason_codeable_concept,';
        values += "'" + not_done_reason_codeable_concept + "',";
      }
			
			if (typeof not_done_reason_reference !== 'undefined' && not_done_reason_reference !== "") {
        column += 'not_done_reason_reference,';
        values += "'" + not_done_reason_reference + "',";
      }
			
			
      var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = 'medication_dispense_id = "' + medication_dispense_id + '" AND ' + fieldResource + ' = "' + valueResource + '"';

      var query = 'UPSERT INTO BACIRO_FHIR.MEDICATION_DISPENSE(medication_dispense_id,' + column.slice(0, -1) + ') SELECT medication_dispense_id, ' + values.slice(0, -1) + ' FROM BACIRO_FHIR.MEDICATION_ADMINISTRATION MEDICATION_DISPENSE ' + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = 'select medication_dispense_id, status, category, medication_codeable_concept, medication_reference, subject_patient, subject_group, context_encounter, context_episode_of_care, supporting_information,  "type" as value_types,  quantity, days_supply, when_prepared, when_handed_over, destination, not_done, not_done_reason_codeable_concept, not_done_reason_reference from BACIRO_FHIR.MEDICATION_DISPENSE WHERE medication_dispense_id = "' + medication_dispense_id + '" ';
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationDispense"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationDispense"});
      });
    },
		medicationDispensePerformer: function updateMedicationDispensePerformer(req, res) {
			console.log(req.body);
			var performer_id  = req.params.performer_id;
			var actor_practitioner = req.body.actor_practitioner;
			var actor_patient = req.body.actor_patient;
			var actor_related_person = req.body.actor_related_person;
			var actor_device = req.body.actor_device;
			var on_behalf_of = req.body.on_behalf_of;
			var medication_dispense_id = req.body.medication_dispense_id;

			var column = "";
      var values = "";
			
			if (typeof actor_practitioner !== 'undefined' && actor_practitioner !== "") {
        column += 'actor_practitioner,';
        values += "'" + actor_practitioner + "',";
      }
			
			if (typeof actor_patient !== 'undefined' && actor_patient !== "") {
        column += 'actor_patient,';
        values += "'" + actor_patient + "',";
      }
			
			if (typeof actor_related_person !== 'undefined' && actor_related_person !== "") {
        column += 'actor_related_person,';
        values += "'" + actor_related_person + "',";
      }
			
			if (typeof actor_device !== 'undefined' && actor_device !== "") {
        column += 'actor_device,';
        values += "'" + actor_device + "',";
      }
			
			if (typeof on_behalf_of !== 'undefined' && on_behalf_of !== "") {
        column += 'on_behalf_of,';
        values += "'" + on_behalf_of + "',";
      }
			
			if (typeof medication_dispense_id !== 'undefined' && medication_dispense_id !== "") {
        column += 'medication_dispense_id,';
        values += "'" + medication_dispense_id + "',";
      }	

			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "performer_id = '" + performer_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_DISPENCE_PERFORMER(performer_id," + column.slice(0, -1) + ") SELECT performer_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_DISPENCE_PERFORMER WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select performer_id, actor_practitioner, actor_patient, actor_related_person, actor_device, on_behalf_of, medication_dispense_id from BACIRO_FHIR.MEDICATION_DISPENCE_PERFORMER WHERE performer_id = '" + performer_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationDispensePerformer"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationDispensePerformer"});
      });
    },
		medicationDispenseSubstitution: function updateMedicationDispenseSubstitution(req, res) {
			console.log(req.body);
			var substitution_id  = req.params.substitution_id;
			var was_substituted  = req.body.was_substituted;
			var type  = req.body.type;
			var reason  = req.body.reason;
			var medication_dispense_id  = req.body.medication_dispense_id;

			var column = "";
      var values = "";
			
			if (typeof was_substituted !== 'undefined' && was_substituted !== "") {
        column += 'was_substituted,';
        values += " " + was_substituted + ",";
      }
			
			if (typeof type !== 'undefined' && type !== "") {
        column += '"type",';
        values += "'" + type + "',";
      }
			
			if (typeof route !== 'undefined' && route !== "") {
        column += 'route,';
        values += "'" + route + "',";
      }
			
			if (typeof method !== 'undefined' && method !== "") {
        column += 'method,';
        values += "'" + method + "',";
      }
			
			if (typeof dose !== 'undefined' && dose !== "") {
        column += 'dose,';
        values += " " + dose + ",";
      }
			
			if (typeof rate_ratio !== 'undefined' && rate_ratio !== "") {
        column += 'rate_ratio,';
        values += " " + rate_ratio + ",";
      }
			
			if (typeof rate_quality !== 'undefined' && rate_quality !== "") {
        column += 'rate_quality,';
        values += " " + rate_quality + ",";
      }
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }

      var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "substitution_id = '" + substitution_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_DISPENSE_SUBSTITUTION(substitution_id," + column.slice(0, -1) + ") SELECT substitution_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_DISPENSE_SUBSTITUTION WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = 'select substitution_id, was_substituted, "type", reason, medication_dispense_id from BACIRO_FHIR.MEDICATION_DISPENSE_SUBSTITUTION WHERE substitution_id = "' + substitution_id + '" ';
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationDispenseSubstitution"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationDispenseSubstitution"});
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