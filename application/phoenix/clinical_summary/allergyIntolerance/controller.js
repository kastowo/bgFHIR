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
		allergyIntolerance: function getAllergyIntolerance(req, res){
			var apikey = req.params.apikey;
			
			var allergyIntoleranceId = req.query._id;
			var asserter = req.query.asserter;
			var category = req.query.category;
			var clinical_status = req.query.clinical_status;
			var code = req.query.code;
			var criticality = req.query.criticality;
			var date = req.query.date;
			var identifier = req.query.identifier;
			var last_date = req.query.last_date;
			var manifestation = req.query.manifestation;
			var onset = req.query.onset;
			var patient = req.query.patient;
			var recorder = req.query.recorder;
			var route = req.query.route;
			var severity = req.query.severity;
			var type = req.query.type;
			var verification_status = req.query.verification_status;
			
      //susun query
      var condition = "";
      var join = "";
			
			if(typeof allergyIntoleranceId !== 'undefined' && allergyIntoleranceId !== ""){
        condition += "ai.allergy_Intolerance_ID = '" + allergyIntoleranceId + "' AND,";  
      }
			
			if(typeof asserter !== 'undefined' && asserter !== ""){
        condition += "(ai.asserter_patient = '" + asserter + "' OR ai.asserter_related_person = '" + asserter + "' OR ai.asserter_practitioner = '" + asserter + "') AND,";  
      }
						
			if(typeof category !== 'undefined' && category !== ""){
        condition += "ai.category = '" + category + "' AND,";  
      }
			
			if(typeof clinical_status !== 'undefined' && clinical_status !== ""){
        condition += "ai.clinical_status = '" + clinical_status + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
        condition += "(ai.code = '" + code + "' OR ai.substance = '" + code + "') AND,";  
      }
			
			if(typeof criticality !== 'undefined' && criticality !== ""){
        criticality += "ai.code = '" + criticality + "' AND,";  
      }
			
			if(typeof date !== 'undefined' && date !== ""){
        //condition += "ad.ASSERTED_DATE = '" + date + "' AND,";  
				condition += "ai.ASSERTED_DATE = to_date('" + date + "', 'yyyy-MM-dd') AND,"
      }
			
			if(typeof last_date !== 'undefined' && last_date !== ""){
        //condition += "ad.LAST_OCCURRENCE = '" + last_date + "' AND,";  
				condition += "ai.LAST_OCCURRENCE = to_date('" + date + "', 'yyyy-MM-dd') AND,"
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.allergy_Intolerance_ID = ai.allergy_Intolerance_ID ";
        
        if(typeof identifier !== 'undefined' && identifier !== ""){
          condition += "i.identifier_value = '" + identifier + "' AND ";       
        }
      }
			
			if(typeof manifestation !== 'undefined' && manifestation !== ""){
        join += " LEFT JOIN BACIRO_FHIR.ALLERGY_INTOLERANCE_REACTION ar ON i.allergy_Intolerance_ID = ai.allergy_Intolerance_ID ";
        
        if(typeof manifestation !== 'undefined' && manifestation !== ""){
          condition += "ar.manifestation = '" + manifestation + "' AND ";       
        }
      }
			
			if(typeof onset !== 'undefined' && onset !== ""){
        join += " LEFT JOIN BACIRO_FHIR.ALLERGY_INTOLERANCE_REACTION ar ON ar.allergy_Intolerance_ID = ai.allergy_Intolerance_ID ";
        
        if(typeof onset !== 'undefined' && onset !== ""){
          //condition += "ai.onset = '" + onset + "' AND ";       
					condition += "ar.LAST_OCCURRENCE = to_date('" + onset + "', 'yyyy-MM-dd') AND,"
        }
      }
			
			if(typeof route !== 'undefined' && route !== ""){
        join += " LEFT JOIN BACIRO_FHIR.ALLERGY_INTOLERANCE_REACTION ar ON ar.allergy_Intolerance_ID = ai.allergy_Intolerance_ID ";
        
        if(typeof route !== 'undefined' && route !== ""){
          condition += "ar.EXPOSUREROUTE = '" + route + "' AND ";       
        }
      }
			
			if(typeof severity !== 'undefined' && severity !== ""){
        join += " LEFT JOIN BACIRO_FHIR.ALLERGY_INTOLERANCE_REACTION ar ON ar.allergy_Intolerance_ID = ai.allergy_Intolerance_ID ";
        
        if(typeof severity !== 'undefined' && severity !== ""){
          condition += "ar.SEVERITY = '" + severity + "' AND ";       
        }
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
        patient += "ai.patient = '" + patient + "' AND,";  
      }
			
			if(typeof type !== 'undefined' && type !== ""){
        condition += "(ai.type = '" + type + "') AND,";  
      }
			
			if(typeof verification_status !== 'undefined' && verification_status !== ""){
        condition += "(ai.VERIFICATION_STATUS = '" + verification_status + "') AND,";  
      }
			
			if(typeof recorder !== 'undefined' && recorder !== ""){
        condition += "(ai.RECORDER_PRACTITIONER = '" + recorder + "' OR ai.RECORDER_PATIENT = '" + recorder + "') AND,";  
      }
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrAllergyIntolerance = [];
      var query = "select allergy_intolerance_id, clinical_status, verification_status, type,category, criticality, code, patient, onset_date_time, onset_age, onset_period_start, onset_period_end, onset_range_low,  onset_range_high,  onset_string,  asserted_date,  recorder_practitioner,  recorder_patient,  asserter_patient, asserter_related_person, asserter_practitioner, last_occurrence, family_member_history_id, clinical_impression_id, adverse_event_id from baciro_fhir.allergy_intolerance ai " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var AllergyIntolerance = {};
					var arrRecorder = [];
					var Recorder = {};
					if(rez[i].recorder_practitioner != "null"){
						Recorder.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].recorder_practitioner;
					} else {
						Recorder.practitioner = "";
					}
					if(rez[i].recorder_patient != "null"){
						Recorder.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].recorder_patient;
					} else {
						Recorder.patient = "";
					}
					arrRecorder[i] = Recorder;
					
					var arrAsserter = [];
					var Asserter = {};
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
					if(rez[i].asserter_practitioner != "null"){
						Asserter.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].asserter_practitioner;
					} else {
						Asserter.practitioner = "";
					}
					arrAsserter[i] = Asserter;

					AllergyIntolerance.resourceType = "Allergy Intolerance";
          AllergyIntolerance.id = rez[i].allergy_intolerance_id;
					AllergyIntolerance.clinicalStatus = rez[i].clinical_status;
					AllergyIntolerance.verificationStatus = rez[i].verification_status;
					AllergyIntolerance.type = rez[i].type;
					AllergyIntolerance.category = rez[i].category;
					AllergyIntolerance.criticality = rez[i].criticality;
					AllergyIntolerance.code = rez[i].code;
					if(rez[i].patient != "null"){
						AllergyIntolerance.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient;
					} else {
						AllergyIntolerance.patient = "";
					}
					if(rez[i].onset_date_time == null){
						AllergyIntolerance.onset.onsetDateTime = formatDate(rez[i].onset_date_time);
					}else{
						AllergyIntolerance.onset.onsetDateTime = rez[i].onset_date_time;
					}
					AllergyIntolerance.onset.onsetAge = rez[i].onset_age;
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
					AllergyIntolerance.onset.onsetPeriod = onsetperiod_start + ' to ' + onset_period_end;
					AllergyIntolerance.onset.onsetRange = rez[i].onset_range_low + ' to ' + rez[i].onset_range_high;
					AllergyIntolerance.onset.onsetString = rez[i].onset_string;
					if(rez[i].asserted_date == null){
						AllergyIntolerance.assertedDate = formatDate(rez[i].asserted_date);
					}else{
						AllergyIntolerance.assertedDate = rez[i].asserted_date;
					}
					AllergyIntolerance.recorder = arrRecorder;
					AllergyIntolerance.asserter = arrAsserter;
					AllergyIntolerance.onset.onsetString = rez[i].onset_string;
					if(rez[i].last_occurrence == null){
						AllergyIntolerance.lastOccurrence = formatDate(rez[i].last_occurrence);
					}else{
						AllergyIntolerance.lastOccurrence = rez[i].last_occurrence;
					}
					AllergyIntolerance.note = rez[i].location;
					
          arrAllergyIntolerance[i] = AllergyIntolerance;
        }
        res.json({"err_code":0,"data": arrAllergyIntolerance});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getAllergyIntolerance"});
      });
    },
		allergyIntoleranceReaction: function getAllergyIntoleranceReaction(req, res){
			var apikey = req.params.apikey;
			var allergy_intolerance_id = req.query.allergy_intolerance_id;
			var allergy_intolerance_reaction_id = req.query._id;
			
      //susun query
      var condition = "";
			
			if(typeof allergy_intolerance_id !== 'undefined' && allergy_intolerance_id !== ""){
        condition += "air.allergy_intolerance_id = '" + allergy_intolerance_id + "' AND ";  
      }
			
			if(typeof allergy_intolerance_reaction_id !== 'undefined' && allergy_intolerance_reaction_id !== ""){
        condition += "air.reaction_id = '" + allergy_intolerance_reaction_id + "' AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      
			var query = "select reaction_id, substance, manifestation, description, onset, severity, exposureroute, allergy_intolerance_id from baciro_fhir.allergy_intolerance_reaction air " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				var arrReaction = [];
        for(i = 0; i < rez.length; i++){
          index = i;
          var reaction = {};
          // var 
          reaction.id = rez[i].organization_contact_id;
          reaction.substance = rez[i].substance;
					reaction.manifestation = rez[i].manifestation;
					reaction.description = rez[i].description;
					if(rez[i].onset == null){
						reaction.onset = formatDate(rez[i].onset);
					}else{
						reaction.onset = rez[i].onset;
					}
					reaction.severity = rez[i].severity;
					reaction.exposureRoute = rez[i].exposureroute;
          arrReaction[i] = reaction;
        }
        res.json({"err_code":0,"data": arrReaction});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getReaction"});
      });
    }
  },
	post: {
		allergyIntolerance: function addAllergyIntolerance(req, res) {
			console.log(req.body);
      
			var allergy_intolerance_id = req.body.allergy_intolerance_id;
			var clinical_status = req.body.clinical_status;
			var verification_status = req.body.verification_status;
			var type = req.body.type;
			var category = req.body.category;
			var criticality = req.body.criticality;
			var code = req.body.code;
			var patient = req.body.patient;
			var onset_date_time = req.body.onset_date_time;
			var onset_age = req.body.onset_age;
			var onset_period_start = req.body.onset_period_start;
			var onset_period_end = req.body.onset_period_end;
			var onset_range_low = req.body.onset_range_low;
			var onset_range_high = req.body.onset_range_high;
			var onset_string = req.body.onset_string;
			var asserted_date = req.body.asserted_date;
			var recorder_practitioner = req.body.recorder_practitioner;
			var recorder_patient = req.body.recorder_patient;
			var asserter_patient = req.body.asserter_patient;
			var asserter_related_person = req.body.asserter_related_person;
			var asserter_practitioner = req.body.asserter_practitioner;
			var last_occurrence = req.body.last_occurrence;
			var family_member_history_id = req.body.family_member_history_id;
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
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }
			
			if (typeof criticality !== 'undefined' && criticality !== "") {
        column += 'criticality,';
        values += "'" + criticality + "',";
      }	
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }	
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof onset_date_time !== 'undefined' && onset_date_time !== "") {
        column += 'onset_date_time,';
        //values += "'" + date + "',";
				values += "to_date('"+ onset_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof onset_age !== 'undefined' && onset_age !== "") {
        column += 'onset_age,';
        values += "'" + onset_age + "',";
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
			
			if (typeof asserted_date !== 'undefined' && asserted_date !== "") {
        column += 'asserted_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ asserted_date + "', 'yyyy-MM-dd  HH:mm'),";
      }
			
			if (typeof recorder_practitioner !== 'undefined' && recorder_practitioner !== "") {
        column += 'recorder_practitioner,';
        values += "'" + recorder_practitioner + "',";
      }	
			
			if (typeof recorder_patient !== 'undefined' && recorder_patient !== "") {
        column += 'recorder_patient,';
        values += "'" + recorder_patient + "',";
      }	
			
			if (typeof asserter_patient !== 'undefined' && asserter_patient !== "") {
        column += 'asserter_patient,';
        values += "'" + asserter_patient + "',";
      }	
			
			if (typeof asserter_related_person !== 'undefined' && asserter_related_person !== "") {
        column += 'asserter_related_person,';
        values += "'" + asserter_related_person + "',";
      }	
			
			if (typeof asserter_practitioner !== 'undefined' && asserter_practitioner !== "") {
        column += 'asserter_practitioner,';
        values += "'" + asserter_practitioner + "',";
      }	
			
			if (typeof last_occurrence !== 'undefined' && last_occurrence !== "") {
        column += 'last_occurrence,';
        //values += "'" + date + "',";
				values += "to_date('"+ last_occurrence + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof family_member_history_id !== 'undefined' && family_member_history_id !== "") {
        column += 'family_member_history_id,';
        values += "'" + family_member_history_id + "',";
      }	
			
			if (typeof clinical_impression_id !== 'undefined' && clinical_impression_id !== "") {
        column += 'clinical_impression_id,';
        values += "'" + clinical_impression_id + "',";
      }	
			
			if (typeof adverse_event_id !== 'undefined' && adverse_event_id !== "") {
        column += 'adverse_event_id,';
        values += "'" + adverse_event_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.allergy_intolerance(allergy_intolerance_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+allergy_intolerance_id+"', " + values.slice(0, -1) + ")";
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select allergy_intolerance_id, clinical_status, verification_status, type,category, criticality, code, patient, onset_date_time, onset_age, onset_period_start, onset_period_end, onset_range_low,  onset_range_high,  onset_string,  asserted_date,  recorder_practitioner,  recorder_patient,  asserter_patient, asserter_related_person, asserter_practitioner, last_occurrence, family_member_history_id, clinical_impression_id, adverse_event_id from baciro_fhir.allergy_intolerance WHERE allergy_intolerance_id = '" + allergy_intolerance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyIntolerance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyIntolerance"});
      });
    },
		allergyIntoleranceReaction: function addAllergyIntoleranceReaction(req, res){
			////console.log(req.body);
      
			var reaction_id = req.body.id;
			var substance = req.body.substance;
			var manifestation = req.body.manifestation;
			var description = req.body.description;
			var onset = req.body.onset;
			var severity = req.body.severity;
			var exposureroute = req.body.exposureroute;
			var allergy_intolerance_id = req.body.allergy_intolerance_id;
			
			var column= "";
			var values= "";
						
			if (typeof substance !== 'undefined' && substance !== "") {
        column += 'substance,';
        values += "'" + substance + "',";
      }
			
			if (typeof manifestation !== 'undefined' && manifestation !== "") {
        column += 'manifestation,';
        values += "'" + manifestation + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }
			
			if (typeof onset !== 'undefined' && onset !== "") {
        column += 'onset,';
        //values += "'" + date + "',";
				values += "to_date('"+ onset + "', 'yyyy-MM-dd  HH:mm'),";
      }
			
			if (typeof severity !== 'undefined' && severity !== "") {
        column += 'severity,';
        values += "'" + severity + "',";
      }
			
			if (typeof exposureroute !== 'undefined' && exposureroute !== "") {
        column += 'exposureroute,';
        values += "'" + exposureroute + "',";
      }
			
			if (typeof allergy_intolerance_id !== 'undefined' && allergy_intolerance_id !== "") {
        column += 'allergy_intolerance_id,';
        values += "'" + allergy_intolerance_id + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.allergy_intolerance_reaction(reaction_id, " + column.slice(0, -1) + ")"+ " VALUES ('"+reaction_id+"', " + values.slice(0, -1) + ")";
			////console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select reaction_id, substance, manifestation, description, onset, severity, exposureroute, allergy_intolerance_id from baciro_fhir.allergy_intolerance_reaction WHERE reaction_id = '" + reaction_id + "' ";
				
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
					////console.log(rez);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyIntoleranceReaction"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAllergyIntoleranceReaction"});
      });
			
			
    }
	},
	put: {
		allergyIntolerance: function updateAllergyIntolerance(req, res) {
			console.log(req.body);
      
			var allergy_intolerance_id = req.params.allergy_intolerance_id;
			var clinical_status = req.body.clinical_status;
			var verification_status = req.body.verification_status;
			var type = req.body.type;
			var category = req.body.category;
			var criticality = req.body.criticality;
			var code = req.body.code;
			var patient = req.body.patient;
			var onset_date_time = req.body.onset_date_time;
			var onset_age = req.body.onset_age;
			var onset_period_start = req.body.onset_period_start;
			var onset_period_end = req.body.onset_period_end;
			var onset_range_low = req.body.onset_range_low;
			var onset_range_high = req.body.onset_range_high;
			var onset_string = req.body.onset_string;
			var asserted_date = req.body.asserted_date;
			var recorder_practitioner = req.body.recorder_practitioner;
			var recorder_patient = req.body.recorder_patient;
			var asserter_patient = req.body.asserter_patient;
			var asserter_related_person = req.body.asserter_related_person;
			var asserter_practitioner = req.body.asserter_practitioner;
			var last_occurrence = req.body.last_occurrence;
			var family_member_history_id = req.body.family_member_history_id;
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
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }
			
			if (typeof criticality !== 'undefined' && criticality !== "") {
        column += 'criticality,';
        values += "'" + criticality + "',";
      }	
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }	
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof onset_date_time !== 'undefined' && onset_date_time !== "") {
        column += 'onset_date_time,';
        //values += "'" + date + "',";
				values += "to_date('"+ onset_date_time + "', 'yyyy-MM-dd  HH:mm'),";
      }
			
			if (typeof onset_age !== 'undefined' && onset_age !== "") {
        column += 'onset_age,';
        values += "'" + onset_age + "',";
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
			
			if (typeof asserted_date !== 'undefined' && asserted_date !== "") {
        column += 'asserted_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ asserted_date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof recorder_practitioner !== 'undefined' && recorder_practitioner !== "") {
        column += 'recorder_practitioner,';
        values += "'" + recorder_practitioner + "',";
      }	
			
			if (typeof recorder_patient !== 'undefined' && recorder_patient !== "") {
        column += 'recorder_patient,';
        values += "'" + recorder_patient + "',";
      }	
			
			if (typeof asserter_patient !== 'undefined' && asserter_patient !== "") {
        column += 'asserter_patient,';
        values += "'" + asserter_patient + "',";
      }	
			
			if (typeof asserter_related_person !== 'undefined' && asserter_related_person !== "") {
        column += 'asserter_related_person,';
        values += "'" + asserter_related_person + "',";
      }	
			
			if (typeof asserter_practitioner !== 'undefined' && asserter_practitioner !== "") {
        column += 'asserter_practitioner,';
        values += "'" + asserter_practitioner + "',";
      }	
			
			if (typeof last_occurrence !== 'undefined' && last_occurrence !== "") {
        column += 'last_occurrence,';
        //values += "'" + date + "',";
				values += "to_date('"+ last_occurrence + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof family_member_history_id !== 'undefined' && family_member_history_id !== "") {
        column += 'family_member_history_id,';
        values += "'" + family_member_history_id + "',";
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
			var condition = "allergy_intolerance_id = '" + allergy_intolerance_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.allergy_intolerance(allergy_intolerance_id," + column.slice(0, -1) + ") SELECT allergy_intolerance_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.allergy_intolerance WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select allergy_intolerance_id, clinical_status, verification_status, type,category, criticality, code, patient, onset_date_time, onset_age, onset_period_start, onset_period_end, onset_range_low,  onset_range_high,  onset_string,  asserted_date,  recorder_practitioner,  recorder_patient,  asserter_patient, asserter_related_person, asserter_practitioner, last_occurrence, family_member_history_id, clinical_impression_id, adverse_event_id from baciro_fhir.allergy_intolerance WHERE allergy_intolerance_id = '" + allergy_intolerance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyIntolerance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyIntolerance"});
      });
    },
		allergyIntoleranceReaction: function updateAllergyIntoleranceReaction(req, res){
			////console.log(req.body);
      
			var reaction_id = req.params.id;
			var substance = req.body.substance;
			var manifestation = req.body.manifestation;
			var description = req.body.description;
			var onset = req.body.onset;
			var severity = req.body.severity;
			var exposureroute = req.body.exposureroute;
			var allergy_intolerance_id = req.body.allergy_intolerance_id;
			
			var column= "";
			var values= "";
						
			if (typeof substance !== 'undefined' && substance !== "") {
        column += 'substance,';
        values += "'" + substance + "',";
      }
			
			if (typeof manifestation !== 'undefined' && manifestation !== "") {
        column += 'manifestation,';
        values += "'" + manifestation + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }
			
			if (typeof onset !== 'undefined' && onset !== "") {
        column += 'onset,';
        //values += "'" + date + "',";
				values += "to_date('"+ onset + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof severity !== 'undefined' && severity !== "") {
        column += 'severity,';
        values += "'" + severity + "',";
      }
			
			if (typeof exposureroute !== 'undefined' && exposureroute !== "") {
        column += 'exposureroute,';
        values += "'" + exposureroute + "',";
      }
			
			if (typeof allergy_intolerance_id !== 'undefined' && allergy_intolerance_id !== "") {
        column += 'allergy_intolerance_id,';
        values += "'" + allergy_intolerance_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "reaction_id = '" + reaction_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			var query = "UPSERT INTO BACIRO_FHIR.allergy_intolerance_reaction(reaction_id," + column.slice(0, -1) + ") SELECT reaction_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.allergy_intolerance_reaction WHERE " + condition;
			
			////console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select reaction_id, substance, manifestation, description, onset, severity, exposureroute, allergy_intolerance_id from baciro_fhir.allergy_intolerance_reaction WHERE reaction_id = '" + reaction_id + "' ";
				
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
					////console.log(rez);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyIntoleranceReaction"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAllergyIntoleranceReaction"});
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