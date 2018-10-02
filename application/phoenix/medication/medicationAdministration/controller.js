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
		medicationAdministration: function getMedicationAdministration(req, res){
			var apikey = req.params.apikey;
			
			var medication_administration_id = req.query._id;
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
			
			if(typeof medication_administration_id !== 'undefined' && medication_administration_id !== ""){
        condition += "ma.medication_administration_id = '" + medication_administration_id + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
				condition += "ma.MEDICATION_CODEABLE_CONCEPT = '" + code + "' AND,";  
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
				condition += "ma.MEDICATION_REFERENCE = '" + medication + "' AND,";  
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
			      
      var arrMedicationAdministration = [];
      var query = "select medication_administration_id, status, category, medication_codeable_concept, medication_reference, subject_patient, subject_group, context_encounter, context_episode_of_care, supporting_information, effective_date_time, effective_period_start, effective_period_end, not_given, reason_not_given, reason_code, prescription  from BACIRO_FHIR.MEDICATION_ADMINISTRATION ma " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var MedicationAdministration = {};
					MedicationAdministration.resourceType = "MedicationAdministration";
          MedicationAdministration.id = rez[i].medication_administration_id;
					MedicationAdministration.status = rez[i].status;
					MedicationAdministration.category = rez[i].category;
					MedicationAdministration.medication.medicationCodeableConcept = rez[i].medication_codeable_concept;
					if(rez[i].medication_reference != "null"){
						MedicationAdministration.medication.medicationReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' +  rez[i].medication_reference;
					} else {
						MedicationAdministration.medication.medicationReference = "";
					}
					
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
					MedicationAdministration.subject = arrSubject;
					MedicationAdministration.context = arrContext;
					MedicationAdministration.supportingInformation = rez[i].supporting_information;
					if(rez[i].effective_date_time == null){
						MedicationAdministration.effective.effectiveDateTime = formatDate(rez[i].effective_date_time);
					}else{
						MedicationAdministration.effective.effectiveDateTime = rez[i].effective_date_time;
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
					
					MedicationAdministration.effective.effectivePeriod = effectiveperiod_start + ' to ' + effectiveperiod_end;
					MedicationAdministration.notGiven = rez[i].not_given;
					MedicationAdministration.reasonNotGiven = rez[i].reason_not_given;
					MedicationAdministration.reasonCode = rez[i].reason_code;
					if(rez[i].prescription != "null"){
						MedicationAdministration.prescription = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationRequest?_id=' +  rez[i].prescription;
					} else {
						MedicationAdministration.prescription = "";
					}
					
          arrMedicationAdministration[i] = MedicationAdministration;
        }
        res.json({"err_code":0,"data": arrMedicationAdministration});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getMedicationAdministration"});
      });
    },
		medicationAdministrationPerformer: function getMedicationAdministrationPerformer(req, res) {
			var apikey = req.params.apikey;
			
			var medicationAdministrationPerformerId = req.query._id;
			var medicationAdministrationId = req.query.medication_administration_id;

			//susun query
			var condition = "";

			if (typeof medicationAdministrationPerformerId !== 'undefined' && medicationAdministrationPerformerId !== "") {
				condition += "PERFORMER_ID = '" + medicationAdministrationPerformerId + "' AND ";
			}

			if (typeof medicationAdministrationId !== 'undefined' && medicationAdministrationId !== "") {
				condition += "MEDICATION_ADMINISTRATION_ID = '" + medicationAdministrationId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrMedicationAdministrationPerformer = [];
			var query = "select performer_id, actor_practitioner, actor_patient, actor_related_person, actor_device, on_behalf_of, medication_administration_id from BACIRO_FHIR.MEDICATION_ADMINISTRATION_PERFORMER " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var MedicationAdministrationPerformer = {};
					MedicationAdministrationPerformer.id = rez[i].performer_id;
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
					MedicationAdministrationPerformer.actor  = arrActor;
					if(rez[i].on_behalf_of != "null"){
						MedicationAdministrationPerformer.onBehalfOf = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].on_behalf_of;
					} else {
						MedicationAdministrationPerformer.onBehalfOf = "";
					}
					arrMedicationAdministrationPerformer[i] = MedicationAdministrationPerformer;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationAdministrationPerformer
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationAdministrationPerformer"
				});
			});
		},
		medicationAdministrationDosage: function getMedicationAdministrationDosage(req, res) {
			var apikey = req.params.apikey;
			
			var medicationAdministrationDosageId = req.query._id;
			var medicationAdministrationId = req.query.medication_administration_id;

			//susun query
			var condition = "";

			if (typeof medicationAdministrationDosageId !== 'undefined' && medicationAdministrationDosageId !== "") {
				condition += "DOSAGE_ID = '" + medicationAdministrationDosageId + "' AND ";
			}

			if (typeof medicationAdministrationId !== 'undefined' && medicationAdministrationId !== "") {
				condition += "MEDICATION_ADMINISTRATION_ID = '" + medicationAdministrationId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrMedicationAdministrationDosage = [];
			var query = "select dosage_id, text, site, route, method, dose, rate_ratio, rate_quality, medication_administration_id from BACIRO_FHIR.MEDICATION_ADMINISTRATION_DOSAGE " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var MedicationAdministrationDosage = {};
					MedicationAdministrationDosage.id = rez[i].dosage_id;
					MedicationAdministrationDosage.text = rez[i].text;
					MedicationAdministrationDosage.site = rez[i].site;
					MedicationAdministrationDosage.route = rez[i].route;
					MedicationAdministrationDosage.method = rez[i].method;
					MedicationAdministrationDosage.dose = rez[i].dose;
					MedicationAdministrationDosage.rate.rateRatio = rez[i].rate_ratio;
					MedicationAdministrationDosage.rate.rateQuality = rez[i].rate_quality;
					arrMedicationAdministrationDosage[i] = MedicationAdministrationDosage;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationAdministrationDosage
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationAdministrationDosage"
				});
			});
		},
		
  },
	post: {
		medicationAdministration: function addMedicationAdministration(req, res) {
			console.log(req.body);
			var medication_administration_id = req.body.medication_administration_id;
			var status = req.body.status;
			var category = req.body.category;
			var medication_codeable_concept = req.body.medication_codeable_concept;
			var medication_reference = req.body.medication_reference;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var supporting_information = req.body.supporting_information;
			var effective_date_time = req.body.effective_date_time;
			var effective_period_start = req.body.effective_period_start;
			var effective_period_end = req.body.effective_period_end;
			var not_given = req.body.not_given;
			var reason_not_given = req.body.reason_not_given;
			var reason_code = req.body.reason_code;
			var prescription = req.body.prescription;
			
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
			
			if (typeof effective_date_time !== 'undefined' && effective_date_time !== "") {
        column += 'effective_date_time,';
				values += "to_date('"+ effective_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof effective_period_start !== 'undefined' && effective_period_start !== "") {
        column += 'effective_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ effective_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_end !== 'undefined' && effective_period_end !== "") {
        column += 'effective_period_end,';
				values += "to_date('"+ effective_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof not_given !== 'undefined' && not_given !== "") {
        column += 'not_given,';
        values += " " + not_given + ",";
      }
			
			if (typeof reason_not_given !== 'undefined' && reason_not_given !== "") {
        column += 'reason_not_given,';
        values += "'" + reason_not_given + "',";
      }
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }
			
			if (typeof prescription !== 'undefined' && prescription !== "") {
        column += 'prescription,';
        values += "'" + prescription + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_ADMINISTRATION(medication_administration_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+medication_administration_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select medication_administration_id, status, category, medication_codeable_concept, medication_reference, subject_patient, subject_group, context_encounter, context_episode_of_care, supporting_information, effective_date_time, effective_period_start, effective_period_end, not_given, reason_not_given, reason_code, prescription  from BACIRO_FHIR.MEDICATION_ADMINISTRATION WHERE medication_administration_id = '" + medication_administration_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationAdministration"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationAdministration"});
      });
    },
		medicationAdministrationPerformer: function addMedicationAdministrationPerformer(req, res) {
			console.log(req.body);
			var performer_id  = req.body.performer_id;
			var actor_practitioner = req.body.actor_practitioner;
			var actor_patient = req.body.actor_patient;
			var actor_related_person = req.body.actor_related_person;
			var actor_device = req.body.actor_device;
			var on_behalf_of = req.body.on_behalf_of;
			var medication_administration_id = req.body.medication_administration_id;

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
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_ADMINISTRATION_PERFORMER(performer_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+performer_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select performer_id, actor_practitioner, actor_patient, actor_related_person, actor_device, on_behalf_of, medication_administration_id from BACIRO_FHIR.MEDICATION_ADMINISTRATION_PERFORMER WHERE ingredient_id = '" + ingredient_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationAdministrationPerformer"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationAdministrationPerformer"});
      });
    },
		medicationAdministrationDosage: function addMedicationAdministrationDosage(req, res) {
			console.log(req.body);
			var dosage_id  = req.body.dosage_id;
			var text  = req.body.text;
			var site  = req.body.site;
			var route  = req.body.route;
			var method  = req.body.method;
			var dose  = req.body.dose;
			var rate_ratio  = req.body.rate_ratio;
			var rate_quality  = req.body.rate_quality;
			var medication_administration_id  = req.body.medication_administration_id;

			var column = "";
      var values = "";
			
			if (typeof text !== 'undefined' && text !== "") {
        column += 'text,';
        values += "'" + text + "',";
      }
			
			if (typeof site !== 'undefined' && site !== "") {
        column += 'site,';
        values += "'" + site + "',";
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

      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_ADMINISTRATION_DOSAGE(dosage_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+dosage_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select dosage_id, text, site, route, method, dose, rate_ratio, rate_quality, medication_administration_id from BACIRO_FHIR.MEDICATION_ADMINISTRATION_DOSAGE WHERE package_id = '" + package_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationAdministrationDosage"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationAdministrationDosage"});
      });
    },
	},
	put: {
		medicationAdministration: function updateMedicationAdministration(req, res) {
			console.log(req.body);
			var medication_administration_id = req.params.medication_administration_id;
			var status = req.body.status;
			var category = req.body.category;
			var medication_codeable_concept = req.body.medication_codeable_concept;
			var medication_reference = req.body.medication_reference;
			var subject_patient = req.body.subject_patient;
			var subject_group = req.body.subject_group;
			var context_encounter = req.body.context_encounter;
			var context_episode_of_care = req.body.context_episode_of_care;
			var supporting_information = req.body.supporting_information;
			var effective_date_time = req.body.effective_date_time;
			var effective_period_start = req.body.effective_period_start;
			var effective_period_end = req.body.effective_period_end;
			var not_given = req.body.not_given;
			var reason_not_given = req.body.reason_not_given;
			var reason_code = req.body.reason_code;
			var prescription = req.body.prescription;
			
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
			
			if (typeof effective_date_time !== 'undefined' && effective_date_time !== "") {
        column += 'effective_date_time,';
				values += "to_date('"+ effective_date_time + "', 'yyyy-MM-dd  HH:mm'),";
      }
			
			if (typeof effective_period_start !== 'undefined' && effective_period_start !== "") {
        column += 'effective_period_start,';
        //values += "'" + date + "',";
				values += "to_date('"+ effective_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_end !== 'undefined' && effective_period_end !== "") {
        column += 'effective_period_end,';
				values += "to_date('"+ effective_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof not_given !== 'undefined' && not_given !== "") {
        column += 'not_given,';
        values += " " + not_given + ",";
      }
			
			if (typeof reason_not_given !== 'undefined' && reason_not_given !== "") {
        column += 'reason_not_given,';
        values += "'" + reason_not_given + "',";
      }
			
			if (typeof reason_code !== 'undefined' && reason_code !== "") {
        column += 'reason_code,';
        values += "'" + reason_code + "',";
      }
			
			if (typeof prescription !== 'undefined' && prescription !== "") {
        column += 'prescription,';
        values += "'" + prescription + "',";
      }
			
      var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "medication_administration_id = '" + medication_administration_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_ADMINISTRATION(medication_administration_id," + column.slice(0, -1) + ") SELECT medication_administration_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_ADMINISTRATION WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select medication_administration_id, status, category, medication_codeable_concept, medication_reference, subject_patient, subject_group, context_encounter, context_episode_of_care, supporting_information, effective_date_time, effective_period_start, effective_period_end, not_given, reason_not_given, reason_code, prescription  from BACIRO_FHIR.MEDICATION_ADMINISTRATION WHERE medication_administration_id = '" + medication_administration_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationAdministration"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationAdministration"});
      });
    },
		medicationAdministrationPerformer: function updateMedicationAdministrationPerformer(req, res) {
			console.log(req.body);
			var performer_id  = req.params.performer_id;
			var actor_practitioner = req.body.actor_practitioner;
			var actor_patient = req.body.actor_patient;
			var actor_related_person = req.body.actor_related_person;
			var actor_device = req.body.actor_device;
			var on_behalf_of = req.body.on_behalf_of;
			var medication_administration_id = req.body.medication_administration_id;

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
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }	

			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "performer_id = '" + performer_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_ADMINISTRATION_PERFORMER(performer_id," + column.slice(0, -1) + ") SELECT performer_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_ADMINISTRATION_PERFORMER WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select performer_id, actor_practitioner, actor_patient, actor_related_person, actor_device, on_behalf_of, medication_administration_id from BACIRO_FHIR.MEDICATION_ADMINISTRATION_PERFORMER WHERE performer_id = '" + performer_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationAdministrationPerformer"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationAdministrationPerformer"});
      });
    },
		medicationAdministrationDosage: function updateMedicationAdministrationDosage(req, res) {
			console.log(req.body);
			var dosage_id  = req.params.dosage_id;
			var text  = req.body.text;
			var site  = req.body.site;
			var route  = req.body.route;
			var method  = req.body.method;
			var dose  = req.body.dose;
			var rate_ratio  = req.body.rate_ratio;
			var rate_quality  = req.body.rate_quality;
			var medication_administration_id  = req.body.medication_administration_id;

			var column = "";
      var values = "";
			
			if (typeof text !== 'undefined' && text !== "") {
        column += 'text,';
        values += "'" + text + "',";
      }
			
			if (typeof site !== 'undefined' && site !== "") {
        column += 'site,';
        values += "'" + site + "',";
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
			var condition = "dosage_id = '" + dosage_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_ADMINISTRATION_DOSAGE(dosage_id," + column.slice(0, -1) + ") SELECT dosage_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_ADMINISTRATION_DOSAGE WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select dosage_id, text, site, route, method, dose, rate_ratio, rate_quality, medication_administration_id from BACIRO_FHIR.MEDICATION_ADMINISTRATION_DOSAGE WHERE dosage_id = '" + dosage_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationAdministrationDosage"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationAdministrationDosage"});
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