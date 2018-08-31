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
			
			var medication_statement_id = req.query._id;
			var category = req.query.category;
			var code = req.query.code;
			var context = req.query.context;
			var effective = req.query.effective;
			var identifier = req.query.identifier;
			var medication = req.query.medication;
			var part_of = req.query.part_of;
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
			
			/*if (typeof authoredon !== 'undefined' && authoredon !== "") {
				condition += "mr.AUTHORED_ON == to_date('" + authoredon + "', 'yyyy-MM-dd') AND,";
      }*/
			
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
        condition += "i.IDENTIFIER_ID = '" + identifier + "' AND,";  
      }
			
			if(typeof medication !== 'undefined' && medication !== ""){
				condition += "ms.MEDICATION_REFERENCE = '" + medication + "' AND,";  
      }
			
			//kurang part_of
			
			if(typeof subject !== 'subject' && subject !== ""){
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
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrMedicationStatement = [];
      var query = "select medication_statement_id, part_of, context_encounter, context_episode_of_care, status, category, medication_codeable_concept, medication_reference, effective_date_time, effective_period_start, effective_period_end, date_asserted, information_source_patient, information_source_practitioner, information_source_related_person, information_source_organization, subject_patient, subject_group, derived_from, taken, reason_not_taken, reason_code from BACIRO_FHIR.MEDICATION_STATEMENT ms " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var MedicationStatement = {};
					MedicationStatement.resourceType = "MedicationStatement";
          MedicationStatement.id = rez[i].medication_statement_id;
					MedicationStatement.partOf = rez[i].part_of;
					if (rez[i].context_encounter !== 'null') {
						MedicationStatement.context = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].context_encounter;
					} else if (rez[i].context_episode_of_care !== 'null') {
						MedicationStatement.context = hostFHIR + ':' + portFHIR + '/' + apikey + '/EpisodeOfCare?_id=' +  rez[i].context_episode_of_care;
					} else {
						MedicationStatement.context = "";
					}
					MedicationStatement.status = rez[i].status;
					MedicationStatement.category = rez[i].category;
					MedicationStatement.medication.medicationCodeableConcept = rez[i].medication_codeable_concept;
					MedicationStatement.medication.medicationReference = rez[i].medication_reference;
					MedicationStatement.effective.effectiveDateTime = rez[i].effective_date_time;
					MedicationStatement.effective.effectivePeriod = rez[i].effective_period_start + ' to ' + rez[i].effective_period_end;
					MedicationStatement.dateAsserted = rez[i].date_asserted;
					if (rez[i].information_source_patient !== 'null') {
						MedicationStatement.informationSource = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].information_source_patient;
					} else if (rez[i].information_source_practitioner !== 'null') {
						MedicationStatement.informationSource = hostFHIR + ':' + portFHIR + '/' + apikey + '/Pratitioner?_id=' +  rez[i].information_source_practitioner;
					} else if (rez[i].information_source_related_person !== 'null') {
						MedicationStatement.informationSource = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].information_source_related_person;
					} else if (rez[i].information_source_organization !== 'null') {
						MedicationStatement.informationSource = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].information_source_organization;
					} else {
						MedicationStatement.informationSource = "";
					}
					if (rez[i].subject_group !== 'null') {
						MedicationStatement.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Group?_id=' +  rez[i].subject_group;
					} else if (rez[i].subject_patient !== 'null') {
						MedicationStatement.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subject_patient;
					} else {
						MedicationStatement.subject = "";
					}
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
		medicationStatementDosage: function getMedicationStatementDosage(req, res) {
			var apikey = req.params.apikey;
			
			var medicationStatementDosageId = req.query._id;
			var medicationStatementId = req.query.medicationStatement_id;

			//susun query
			var condition = "";

			if (typeof medicationStatementDosageId !== 'undefined' && medicationStatementDosageId !== "") {
				condition += 'DOSAGE_ID = "' + medicationStatementDosageId + '" AND ';
			}

			if (typeof medicationStatementId !== 'undefined' && medicationStatementId !== "") {
				condition += 'MEDICATION_STATEMENT_ID = "' + medicationStatementId + '" AND ';
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrMedicationStatementDosage = [];
			var query = 'select dosage_id, "sequence" as val_sequence, text, additional_instruction, patient_instruction, timing_id, as_needed_boolean, as_needed_codeable_concept, site, route, method, dose_range_low, dose_range_high, dose_quantity, max_dose_per_period_numerator, max_dose_per_period_denominator, max_dose_per_administration, max_dose_per_lifetime, rate_ratio_numerator, rate_ratio_denominator, rate_range_low, rate_range_high, rate_quantity, medication_statement_id from BACIRO_FHIR.DOSAGE' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var MedicationStatementDosage = {};
					MedicationStatementDosage.id = rez[i].dosage_id;
					MedicationStatementDosage.sequence = rez[i].val_sequence;
					MedicationStatementDosage.text = rez[i].text;
					MedicationStatementDosage.additionalInstruction = rez[i].additional_instruction;
					MedicationStatementDosage.patientInstruction = rez[i].patient_instruction;
					MedicationStatementDosage.timing = rez[i].timing_id;
					MedicationStatementDosage.asNeeded.asNeededBoolean = rez[i].as_needed_boolean;
					MedicationStatementDosage.asNeeded.asNeededCodeableConcept = rez[i].as_needed_codeable_concept;
					MedicationStatementDosage.site = rez[i].site;
					MedicationStatementDosage.route = rez[i].route;
					MedicationStatementDosage.method = rez[i].method;
					MedicationStatementDosage.dose.dose_range = rez[i].dose_range_low + ' to ' + rez[i].dose_range_high
					MedicationStatementDosage.dose.doseQuantity = rez[i].dose_quantity;
					MedicationStatementDosage.max_dose_per_period = rez[i].max_dose_per_period_numerator + ' to ' + rez[i].max_dose_per_period_denominator;
					MedicationStatementDosage.max_dose_per_administration = rez[i].max_dose_per_administration;
					MedicationStatementDosage.max_dose_per_lifetime = rez[i].max_dose_per_lifetime;
					MedicationStatementDosage.rate.rateRatio = rez[i].rate_ratio_numerator + ' to ' + rez[i].rate_ratio_denominator;
					MedicationStatementDosage.rate.rateRange = rez[i].rate_range_low + ' to ' + rez[i].rate_range_high;
					MedicationStatementDosage.rate.rateQuantity = rez[i].rate_quantity;
					arrMedicationStatementDosage[i] = MedicationStatementDosage;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationStatementDosage
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationStatementDosage"
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
    },
		medicationStatementDosage: function addMedicationStatementDosage(req, res) {
			console.log(req.body);
			var dosage_id = req.body.dosage_id;
			var sequence = req.body.sequence;
			var text = req.body.text;
			var additional_instruction = req.body.additional_instruction;
			var patient_instruction = req.body.patient_instruction;
			var timing_id = req.body.timing_id;
			var as_needed_boolean = req.body.as_needed_boolean;
			var as_needed_codeable_concept = req.body.as_needed_codeable_concept;
			var site = req.body.site;
			var route = req.body.route;
			var method = req.body.method;
			var dose_range_low = req.body.dose_range_low;
			var dose_range_high = req.body.dose_range_high;
			var dose_quantity = req.body.dose_quantity;
			var max_dose_per_period_numerator = req.body.max_dose_per_period_numerator;
			var max_dose_per_period_denominator = req.body.max_dose_per_period_denominator;
			var max_dose_per_administration = req.body.max_dose_per_administration;
			var max_dose_per_lifetime = req.body.max_dose_per_lifetime;
			var rate_ratio_numerator = req.body.rate_ratio_numerator;
			var rate_ratio_denominator = req.body.rate_ratio_denominator;
			var rate_range_low = req.body.rate_range_low;
			var rate_range_high = req.body.rate_range_high;
			var rate_quantity = req.body.rate_quantity;
			var medication_statement_id = req.body.medication_statement_id;
			
			
			var column = "";
      var values = "";
			
			if (typeof sequence !== 'undefined' && sequence !== "") {
        column += '"sequence",';
        values += ' '  + sequence + ',';
      }
			
			if (typeof text !== 'undefined' && text !== "") {
        column += 'text,';
        values += '"'  + text + '",';
      }
			
			if (typeof additional_instruction !== 'undefined' && additional_instruction !== "") {
        column += 'additional_instruction,';
        values += '"'  + additional_instruction + '",';
      }
			
			if (typeof patient_instruction !== 'undefined' && patient_instruction !== "") {
        column += 'patient_instruction,';
        values += '"'  + patient_instruction + '",';
      }
			
			if (typeof timing_id !== 'undefined' && timing_id !== "") {
        column += 'timing_id,';
        values += '"'  + timing_id + '",';
      }
			
			if (typeof as_needed_boolean !== 'undefined' && as_needed_boolean !== "") {
        column += 'as_needed_boolean,';
        values += '"'  + as_needed_boolean + '",';
      }
			
			if (typeof as_needed_codeable_concept !== 'undefined' && as_needed_codeable_concept !== "") {
        column += 'as_needed_codeable_concept,';
        values += '"'  + as_needed_codeable_concept + '",';
      }
			
			if (typeof site !== 'undefined' && site !== "") {
        column += 'site,';
        values += '"'  + site + '",';
      }
			
			if (typeof route !== 'undefined' && route !== "") {
        column += 'route,';
        values += '"'  + route + '",';
      }
			
			if (typeof method !== 'undefined' && method !== "") {
        column += 'method,';
        values += '"'  + method + '",';
      }
			
			if (typeof medication_statement_id !== 'undefined' && medication_statement_id !== "") {
        column += 'medication_statement_id,';
        values += '"'  + medication_statement_id + '",';
      }
			
			if (typeof dose_range_low !== 'undefined' && dose_range_low !== "") {
        column += 'dose_range_low,';
        values += ' '  + dose_range_low + ',';
      }
			
			if (typeof dose_range_higdose_range_highh !== 'undefined' && dose_range_higdose_range_highh !== "") {
        column += 'dose_range_higdose_range_highh,';
        values += ' '  + dose_range_higdose_range_highh + ',';
      }
			
			if (typeof dose_quantity !== 'undefined' && dose_quantity !== "") {
        column += 'dose_quantity,';
        values += ' '  + dose_quantity + ',';
      }
			
			if (typeof max_dose_per_period_numerator !== 'undefined' && max_dose_per_period_numerator !== "") {
        column += 'max_dose_per_period_numerator,';
        values += ' '  + max_dose_per_period_numerator + ',';
      }
			
			if (typeof max_dose_per_period_denominator !== 'undefined' && max_dose_per_period_denominator !== "") {
        column += 'max_dose_per_period_denominator,';
        values += ' '  + max_dose_per_period_denominator + ',';
      }
			
			if (typeof max_dose_per_administration !== 'undefined' && max_dose_per_administration !== "") {
        column += 'max_dose_per_administration,';
        values += ' '  + max_dose_per_administration + ',';
      }
			
			if (typeof max_dose_per_lifetime !== 'undefined' && max_dose_per_lifetime !== "") {
        column += 'max_dose_per_lifetime,';
        values += ' '  + max_dose_per_lifetime + ',';
      }
			
			if (typeof rate_ratio_numerator !== 'undefined' && rate_ratio_numerator !== "") {
        column += 'rate_ratio_numerator,';
        values += ' '  + rate_ratio_numerator + ',';
      }
			
			if (typeof rate_ratio_denominator !== 'undefined' && rate_ratio_denominator !== "") {
        column += 'rate_ratio_denominator,';
        values += ' '  + rate_ratio_denominator + ',';
      }
			
			if (typeof rate_range_low !== 'undefined' && rate_range_low !== "") {
        column += 'rate_range_low,';
        values += ' '  + rate_range_low + ',';
      }
			
			if (typeof rate_range_high !== 'undefined' && rate_range_high !== "") {
        column += 'rate_range_high,';
        values += ' '  + rate_range_high + ',';
      }
			
			if (typeof rate_quantity !== 'undefined' && rate_quantity !== "") {
        column += 'rate_quantity,';
        values += ' '  + rate_quantity + ',';
      }

      var query = 'UPSERT INTO BACIRO_FHIR.DOSAGE(dosage_id, ' + column.slice(0, -1) + ')'+
        ' VALUES ("'+dosage_id+'", ' + values.slice(0, -1) + ')';
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = 'select dosage_id, "sequence", text, additional_instruction, patient_instruction, timing_id, as_needed_boolean, as_needed_codeable_concept, site, route, method, dose_range_low, dose_range_high, dose_quantity, max_dose_per_period_numerator, max_dose_per_period_denominator, max_dose_per_administration, max_dose_per_lifetime, rate_ratio_numerator, rate_ratio_denominator, rate_range_low, rate_range_high, rate_quantity, medication_statement_id from BACIRO_FHIR.DOSAGE  WHERE dosage_id = "' + requester_id + '"';
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationStatementDosage"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationStatementDosage"});
      });
    },
		
	},
	put: {
		medicationStatement: function updateMedicationStatement(req, res) {
			console.log(req.body);
			var medication_statement_id = req.params.medication_statement_id;
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
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "medication_statement_id = '" + medication_statement_id + "' AND " + fieldResource + " = '" + valueResource + "'";

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
    },
		medicationStatementDosage: function updateMedicationStatementDosage(req, res) {
			console.log(req.body);
			var dosage_id = req.body.dosage_id;
			var sequence = req.body.sequence;
			var text = req.body.text;
			var additional_instruction = req.body.additional_instruction;
			var patient_instruction = req.body.patient_instruction;
			var timing_id = req.body.timing_id;
			var as_needed_boolean = req.body.as_needed_boolean;
			var as_needed_codeable_concept = req.body.as_needed_codeable_concept;
			var site = req.body.site;
			var route = req.body.route;
			var method = req.body.method;
			var dose_range_low = req.body.dose_range_low;
			var dose_range_higdose_range_highh = req.body.dose_range_high;
			var dose_quantity = req.body.dose_quantity;
			var max_dose_per_period_numerator = req.body.max_dose_per_period_numerator;
			var max_dose_per_period_denominator = req.body.max_dose_per_period_denominator;
			var max_dose_per_administration = req.body.max_dose_per_administration;
			var max_dose_per_lifetime = req.body.max_dose_per_lifetime;
			var rate_ratio_numerator = req.body.rate_ratio_numerator;
			var rate_ratio_denominator = req.body.rate_ratio_denominator;
			var rate_range_low = req.body.rate_range_low;
			var rate_range_high = req.body.rate_range_high;
			var rate_quantity = req.body.rate_quantity;
			var medication_statement_id = req.body.medication_statement_id;
			
			
			var column = "";
      var values = "";
			
			if (typeof sequence !== 'undefined' && sequence !== "") {
        column += '"sequence",';
        values += ' '  + sequence + ',';
      }
			
			if (typeof text !== 'undefined' && text !== "") {
        column += 'text,';
        values += '"'  + text + '",';
      }
			
			if (typeof additional_instruction !== 'undefined' && additional_instruction !== "") {
        column += 'additional_instruction,';
        values += '"'  + additional_instruction + '",';
      }
			
			if (typeof patient_instruction !== 'undefined' && patient_instruction !== "") {
        column += 'patient_instruction,';
        values += '"'  + patient_instruction + '",';
      }
			
			if (typeof timing_id !== 'undefined' && timing_id !== "") {
        column += 'timing_id,';
        values += '"'  + timing_id + '",';
      }
			
			if (typeof as_needed_boolean !== 'undefined' && as_needed_boolean !== "") {
        column += 'as_needed_boolean,';
        values += '"'  + as_needed_boolean + '",';
      }
			
			if (typeof as_needed_codeable_concept !== 'undefined' && as_needed_codeable_concept !== "") {
        column += 'as_needed_codeable_concept,';
        values += '"'  + as_needed_codeable_concept + '",';
      }
			
			if (typeof site !== 'undefined' && site !== "") {
        column += 'site,';
        values += '"'  + site + '",';
      }
			
			if (typeof route !== 'undefined' && route !== "") {
        column += 'route,';
        values += '"'  + route + '",';
      }
			
			if (typeof method !== 'undefined' && method !== "") {
        column += 'method,';
        values += '"'  + method + '",';
      }
			
			if (typeof medication_statement_id !== 'undefined' && medication_statement_id !== "") {
        column += 'medication_statement_id,';
        values += '"'  + medication_statement_id + '",';
      }
			
			if (typeof dose_range_low !== 'undefined' && dose_range_low !== "") {
        column += 'dose_range_low,';
        values += ' '  + dose_range_low + ',';
      }
			
			if (typeof dose_range_higdose_range_highh !== 'undefined' && dose_range_higdose_range_highh !== "") {
        column += 'dose_range_higdose_range_highh,';
        values += ' '  + dose_range_higdose_range_highh + ',';
      }
			
			if (typeof dose_quantity !== 'undefined' && dose_quantity !== "") {
        column += 'dose_quantity,';
        values += ' '  + dose_quantity + ',';
      }
			
			if (typeof max_dose_per_period_numerator !== 'undefined' && max_dose_per_period_numerator !== "") {
        column += 'max_dose_per_period_numerator,';
        values += ' '  + max_dose_per_period_numerator + ',';
      }
			
			if (typeof max_dose_per_period_denominator !== 'undefined' && max_dose_per_period_denominator !== "") {
        column += 'max_dose_per_period_denominator,';
        values += ' '  + max_dose_per_period_denominator + ',';
      }
			
			if (typeof max_dose_per_administration !== 'undefined' && max_dose_per_administration !== "") {
        column += 'max_dose_per_administration,';
        values += ' '  + max_dose_per_administration + ',';
      }
			
			if (typeof max_dose_per_lifetime !== 'undefined' && max_dose_per_lifetime !== "") {
        column += 'max_dose_per_lifetime,';
        values += ' '  + max_dose_per_lifetime + ',';
      }
			
			if (typeof rate_ratio_numerator !== 'undefined' && rate_ratio_numerator !== "") {
        column += 'rate_ratio_numerator,';
        values += ' '  + rate_ratio_numerator + ',';
      }
			
			if (typeof rate_ratio_denominator !== 'undefined' && rate_ratio_denominator !== "") {
        column += 'rate_ratio_denominator,';
        values += ' '  + rate_ratio_denominator + ',';
      }
			
			if (typeof rate_range_low !== 'undefined' && rate_range_low !== "") {
        column += 'rate_range_low,';
        values += ' '  + rate_range_low + ',';
      }
			
			if (typeof rate_range_high !== 'undefined' && rate_range_high !== "") {
        column += 'rate_range_high,';
        values += ' '  + rate_range_high + ',';
      }
			
			if (typeof rate_quantity !== 'undefined' && rate_quantity !== "") {
        column += 'rate_quantity,';
        values += ' '  + rate_quantity + ',';
      }

      var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = 'dosage_id = "' + dosage_id + '" AND ' + fieldResource + ' = "' + valueResource + '"';
			
			var query = 'UPSERT INTO BACIRO_FHIR.DOSAGE(dosage_id,' + column.slice(0, -1) + ') SELECT dosage_id, ' + values.slice(0, -1) + ' FROM BACIRO_FHIR.DOSAGE WHERE ' + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = 'select dosage_id, "sequence", text, additional_instruction, patient_instruction, timing_id, as_needed_boolean, as_needed_codeable_concept, site, route, method, dose_range_low, dose_range_high, dose_quantity, max_dose_per_period_numerator, max_dose_per_period_denominator, max_dose_per_administration, max_dose_per_lifetime, rate_ratio_numerator, rate_ratio_denominator, rate_range_low, rate_range_high, rate_quantity, medication_statement_id from BACIRO_FHIR.DOSAGE WHERE dosage_id = "' + dosage_id + '"';
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationStatementDosage"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationStatementDosage"});
      });
    },
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