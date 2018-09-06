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
		adverseEvent: function getAdverseEvent(req, res){
			var apikey = req.params.apikey;
			var adverseEventId = req.query._id;
			var category = req.query.category;
			var date = req.query.date;
			var location = req.query.location;
			var recorder = req.query.recorder;
			var seriousness = req.query.seriousness;
			//var study = req.query.study;
			var subject = req.query.subject;
			var substance = req.query.substance;
			var type = req.query.type;
      //susun query
      var condition = "";
      var join = "";
			
			if(typeof adverseEventId !== 'undefined' && adverseEventId !== ""){
        condition += "ad.ADVERSE_EVENT_ID = '" + adverseEventId + "' AND,";  
      }
			
			if(typeof category !== 'undefined' && category !== ""){
        condition += "ad.category = '" + category + "' AND,";  
      }
			
			if(typeof date !== 'undefined' && date !== ""){
        //condition += "ad.date = '" + date + "' AND,";  
				condition += "ad.date = to_date('" + date + "', 'yyyy-MM-dd') AND,"
      }
			
			if(typeof location !== 'undefined' && location !== ""){
        condition += "ad.location = '" + location + "' AND,";  
      }
			
			if(typeof recorder !== 'undefined' && recorder !== ""){
        condition += "(ad.RECORDER_PATIENT = '" + recorder + "' OR ad.RECORDER_PRACTITIONER = '" + recorder + "' OR ad.RECORDER_RELATED_PERSON = '" + recorder + "') AND,";  
      }
			
			if(typeof seriousness !== 'undefined' && seriousness !== ""){
        condition += "ad.seriousness = '" + seriousness + "' AND,";  
      }
			
			/*if((typeof study !== 'undefined' && study !== "")){
				condition += "rs.research_study_id = '" + study + "' AND ";       
        join += " LEFT JOIN BACIRO_FHIR.RESEARCH_STUDY ep ON rs.ADVERSE_EVENT_ID = ad.ADVERSE_EVENT_ID ";
      }*/
			
			if(typeof subject !== 'undefined' && subject !== ""){
        condition += "(ad.SUBJECT_PATIENT = '" + subject + "' OR ad.SUBJECT_RESEARCH_SUBJECT = '" + subject + "' OR ad.SUBJECT_MEDICATION  = '" + subject + "' OR ad.SUBJECT_DEVICE = '" + subject + "') AND,";  
      }
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrAdverseEvent = [];
      var query = "SELECT ad.adverse_event_id as adverse_event_id, identifier_id, category, type, subject_patient, subject_research_subject,  subject_medication, subject_device, date, location, seriousness, outcome, recorder_patient, recorder_practitioner, recorder_related_person, event_participant_practitioner, event_participant_device, description  FROM BACIRO_FHIR.ADVERSE_EVENT ad " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var AdverseEvent = {};
					AdverseEvent.resourceType = "Adverse Event";
          AdverseEvent.id = rez[i].adverse_event_id;
          AdverseEvent.identifier_id = rez[i].identifier_id;
					AdverseEvent.category = rez[i].category;
					AdverseEvent.type = rez[i].type;
					if (rez[i].subject_patient !== 'null') {
						AdverseEvent.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subject_patient;
					} else if (rez[i].subject_research_subject !== 'null') {
						AdverseEvent.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/ResearchSubject?_id=' +  rez[i].subject_research_subject;
					} else if (rez[i].subject_medication !== 'null') {
						AdverseEvent.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' +  rez[i].subject_medication;
					} else if (rez[i].subject_device !== 'null') {
						AdverseEvent.subject = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].subject_device;
					} else {
						AdverseEvent.subject = "";
					}
					AdverseEvent.date = rez[i].date;
					AdverseEvent.location = rez[i].location;
					AdverseEvent.seriousness = rez[i].seriousness;
					AdverseEvent.outcome = rez[i].outcome;
					if (rez[i].recorder_patient !== 'null') {
						AdverseEvent.recorder = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].recorder_patient;
					} else if (rez[i].recorder_practitioner !== 'null') {
						AdverseEvent.recorder = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].recorder_practitioner;
					} else if (rez[i].recorder_related_person !== 'null') {
						AdverseEvent.recorder = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].recorder_related_person;
					} else {
						AdverseEvent.recorder = "";
					}
					if (rez[i].event_participant_practitioner !== 'null') {
						AdverseEvent.eventParticipant = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].event_participant_practitioner;
					} else if (rez[i].event_participant_device !== 'null') {
						AdverseEvent.eventParticipant = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].event_participant_device;
					} else {
						AdverseEvent.eventParticipant = "";
					}
					AdverseEvent.description = rez[i].description;
          arrAdverseEvent[i] = AdverseEvent;
        }
        res.json({"err_code":0,"data": arrAdverseEvent});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getAdverseEvent"});
      });
    },
		suspectEntity: function getSuspectEntityId(req, res){
			var apikey = req.params.apikey;
			var adverseEventId = req.query.adverse_event_id;
			var suspectEntityId = req.query._id;
			
      //susun query
      var condition = "";
			
			if(typeof adverseEventId !== 'undefined' && adverseEventId !== ""){
        condition += "se.adverse_event_id = '" + adverseEventId + "' AND ";  
      }
			
			if(typeof suspectEntityId !== 'undefined' && suspectEntityId !== ""){
        condition += "se.suspect_entity_id = '" + suspectEntityId + "' AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      
			var query = "SELECT suspect_entity_id, instance_substance, instance_medication, instance_medication_administration, instance_medication_statement, instance_device, causality, causality_assessment, causality_product_relatedness, causality_method, causality_author_practitioner, causality_author_practitioner_role, causality_result, adverse_event_id from baciro_fhir.adverse_event_suspect_entity se " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				var arrSuspectEntity = [];
        for(i = 0; i < rez.length; i++){
          index = i;
          countSuspectEntity = rez.length;
          var suspectEntity = {};
          // var 
          suspectEntity.id = rez[i].organization_contact_id;
          if (rez[i].instance_substance !== 'null') {
						suspectEntity.instance = rez[i].instance_substance;
					} else if (rez[i].instance_medication !== 'null') {
						suspectEntity.instance = rez[i].instance_medication;
					} else if (rez[i].instance_medication_administration !== 'null') {
						suspectEntity.instance = rez[i].instance_medication_administration;
					} else if (rez[i].instance_medication_statement !== 'null') {
						suspectEntity.instance = rez[i].instance_medication_statement;
					} else if (rez[i].instance_device !== 'null') {
						suspectEntity.instance = rez[i].instance_device;
					} else {
						suspectEntity.instance = "";
					}
          suspectEntity.causality = rez[i].causality;
					suspectEntity.causality_assessment = rez[i].causality_assessment;
					suspectEntity.causality_product_relatedness = rez[i].causality_product_relatedness;
					suspectEntity.causality_method = rez[i].causality_method;
					if (rez[i].causality_author_practitioner !== 'null') {
						suspectEntity.causalityAuthor = rez[i].causality_author_practitioner;
					} else if (rez[i].causality_author_practitioner_role !== 'null') {
						suspectEntity.causalityAuthor = rez[i].causality_author_practitioner_role;
					} else {
						suspectEntity.causalityAuthor = "";
					}
					suspectEntity.causality_result = rez[i].causality_result;

          arrSuspectEntity[i] = suspectEntity;
        }
        res.json({"err_code":0,"data": arrSuspectEntity});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getSuspectEntity"});
      });
    }
  },
	post: {
		adverseEvent: function addAdverseEvent(req, res) {
			console.log(req.body);
      var adverse_event_id = req.body.adverse_event_id;
      var identifier_id = req.body.identifier_id;
			var category = req.body.category;
			var type = req.body.type;
			var subject_patient = req.body.subject_patient;
			var subject_research_subject = req.body.subject_research_subject;
			var subject_medication = req.body.subject_medication;
			var subject_device = req.body.subject_device;
			var date = req.body.date;
			var location = req.body.location;
			var seriousness = req.body.seriousness;
			var outcome = req.body.outcome;
			var recorder_patient = req.body.recorder_patient;
			var recorder_practitioner = req.body.recorder_practitioner;
			var recorder_related_person = req.body.recorder_related_person;
			var event_participant_practitioner = req.body.event_participant_practitioner;
			var event_participant_device = req.body.event_participant_device;
			var description = req.body.description;
			
			var column = "";
      var values = "";
			
			if (typeof identifier_id !== 'undefined' && identifier_id !== "") {
        column += 'identifier_id,';
        values += "'" + identifier_id + "',";
      }
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }			
			if (typeof subject_research_subject !== 'undefined' && subject_research_subject !== "") {
        column += 'subject_research_subject,';
        values += "'" + subject_research_subject + "',";
      }
			if (typeof subject_medication !== 'undefined' && subject_medication !== "") {
        column += 'subject_medication,';
        values += "'" + subject_medication + "',";
      }
			if (typeof subject_device !== 'undefined' && subject_device !== "") {
        column += 'subject_device,';
        values += "'" + subject_device + "',";
      }
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd'),";
      }
			if (typeof location !== 'undefined' && location !== "") {
        column += 'location,';
        values += "'" + location + "',";
      }
			if (typeof seriousness !== 'undefined' && seriousness !== "") {
        column += 'seriousness,';
        values += "'" + seriousness + "',";
      }
			if (typeof outcome !== 'undefined' && outcome !== "") {
        column += 'outcome,';
        values += "'" + outcome + "',";
      }
			if (typeof recorder_patient !== 'undefined' && recorder_patient !== "") {
        column += 'recorder_patient,';
        values += "'" + recorder_patient + "',";
      }
			if (typeof recorder_practitioner !== 'undefined' && recorder_practitioner !== "") {
        column += 'recorder_practitioner,';
        values += "'" + recorder_practitioner + "',";
      }
			if (typeof recorder_related_person !== 'undefined' && recorder_related_person !== "") {
        column += 'recorder_related_person,';
        values += "'" + recorder_related_person + "',";
      }
			if (typeof event_participant_practitioner !== 'undefined' && event_participant_practitioner !== "") {
        column += 'event_participant_practitioner,';
        values += "'" + event_participant_practitioner + "',";
      }
			if (typeof event_participant_device !== 'undefined' && event_participant_device !== "") {
        column += 'event_participant_device,';
        values += "'" + event_participant_device + "',";
      }
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT(ADVERSE_EVENT_ID, " + column.slice(0, -1) + ")"+
        " VALUES ('"+adverse_event_id+"', " + values.slice(0, -1) + ")";
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "SELECT adverse_event_id, identifier_id, category, type, subject_patient, subject_research_subject,  subject_medication, subject_device, date, location, seriousness, outcome, recorder_patient, recorder_practitioner, recorder_related_person, event_participant_practitioner, event_participant_device, description  FROM BACIRO_FHIR.ADVERSE_EVENT WHERE adverse_event_id = '" + adverse_event_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAdverseEvent"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAdverseEvent"});
      });
    },
		suspectEntity: function addSuspectEntity(req, res) {
      var id = req.body.suspect_entity_id; 
			var instance_substance = req.body.instance_substance; 
			var instance_medication = req.body.instance_medication; 
			var instance_medication_administration = req.body.instance_medication_administration;  
			var instance_medication_statement = req.body.instance_medication_statement; 
			var instance_device = req.body.instance_device; 
			var causality = req.body.causality; 
			var causality_assessment = req.body.causality_assessment; 
			var causality_product_relatedness = req.body.causality_product_relatedness; 
			var causality_method = req.body.causality_method; 
			var causality_author_practitioner = req.body.causality_author_practitioner; 
			var causality_author_practitioner_role = req.body.causality_author_practitioner_role; 
			var causality_result = req.body.causality_result; 
			var adverse_event_id = req.body.adverse_event_id; 
						
			var column = "";
      var values = "";
			
			if (typeof instance_substance !== 'undefined' && instance_substance !== "") {
        column += 'instance_substance,';
        values += "'" + instance_substance + "',";
      }
			if (typeof instance_medication !== 'undefined' && instance_medication !== "") {
        column += 'instance_medication,';
        values += "'" + instance_medication + "',";
      }
			if (typeof instance_medication_administration !== 'undefined' && instance_medication_administration !== "") {
        column += 'instance_medication_administration,';
        values += "'" + instance_medication_administration + "',";
      }
			if (typeof instance_medication_statement !== 'undefined' && instance_medication_statement !== "") {
        column += 'instance_medication_statement,';
        values += "'" + instance_medication_statement + "',";
      }			
			if (typeof instance_device !== 'undefined' && instance_device !== "") {
        column += 'instance_device,';
        values += "'" + instance_device + "',";
      }
			if (typeof causality !== 'undefined' && causality !== "") {
        column += 'causality,';
        values += "'" + causality + "',";
      }
			if (typeof causality_assessment !== 'undefined' && causality_assessment !== "") {
        column += 'causality_assessment,';
        values += "'" + causality_assessment + "',";
      }
			if (typeof causality_product_relatedness !== 'undefined' && causality_product_relatedness !== "") {
        column += 'causality_product_relatedness,';
        values += "'" + causality_product_relatedness + "',";
      }
			if (typeof causality_method !== 'undefined' && causality_method !== "") {
        column += 'causality_method,';
        values += "'" + causality_method + "',";
      }
			if (typeof causality_author_practitioner !== 'undefined' && causality_author_practitioner !== "") {
        column += 'causality_author_practitioner,';
        values += "'" + causality_author_practitioner + "',";
      }
			if (typeof causality_author_practitioner_role !== 'undefined' && causality_author_practitioner_role !== "") {
        column += 'causality_author_practitioner_role,';
        values += "'" + causality_author_practitioner_role + "',";
      }
			if (typeof causality_result !== 'undefined' && causality_result !== "") {
        column += 'causality_result,';
        values += "'" + causality_result + "',";
      }
			if (typeof adverse_event_id !== 'undefined' && adverse_event_id !== "") {
        column += 'adverse_event_id,';
        values += "'" + adverse_event_id + "',";
      }
			

      //var query = "UPSERT INTO BACIRO_FHIR.ENCOUNTER(ENCOUNTER_ID, ENCOUNTER_STATUS, ENCOUNTER_CLASS, ENCOUNTER_TYPE, ENCOUNTER_PRIORITY, ENCOUNTER_PERIOD_START, ENCOUNTER_PERIOD_END, ENCOUNTER_LENGTH, ENCOUNTER_REASON, SUBJECT_PATIENT_ID, SUBJECT_GROUP_ID, APPOINTMENT_ID, ORGANIZATION_ID, PARENT_ID)" + " VALUES ('" + id + "','" + status + "','" + encounter_class + "','" + type + "','" + priority + "',to_date('" + period_start + "','yyyy-MM-dd'),to_date('" + period_end + "','yyyy-MM-dd'), to_time('" + length + "','hh:mm:ss'),'" + reason + "','" + patient_id + "','" + group_id + "','" + appointment_id + "','" + org_id + "','" + parent_id + "')";
			
			var query = "UPSERT INTO BACIRO_FHIR.adverse_event_suspect_entity(suspect_entity_id, " + column.slice(0, -1) + ")" + " VALUES ('" + id + "', " + values.slice(0, -1) + ")";
			
			//console.log(query)
			db.upsert(query, function (succes) {
				console.log("add suspectEntity ok");
        var query = "SELECT suspect_entity_id, instance_substance, instance_medication, instance_medication_administration, instance_medication_statement, instance_device, causality, causality_assessment, causality_product_relatedness, causality_method, causality_author_practitioner, causality_author_practitioner_role, causality_result, adverse_event_id from baciro_fhir.adverse_event_suspect_entity se WHERE suspect_entity_id = '" + id + "' ";
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
            "function": "addSuspectEntity"
          });
        });
      }, function (e) {
				console.log("encounter failed");
        res.json({
          "err_code": 2,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "addSuspectEntity"
        });
      });
    }
	},
	put: {
		adverseEvent: function putAdverseEvent(req, res) {
			console.log(req.body);
      var adverse_event_id = req.params.adverse_event_id;
      var identifier_id = req.body.identifier_id;
			var category = req.body.category;
			var type = req.body.type;
			var subject_patient = req.body.subject_patient;
			var subject_research_subject = req.body.subject_research_subject;
			var subject_medication = req.body.subject_medication;
			var subject_device = req.body.subject_device;
			var date = req.body.date;
			var location = req.body.location;
			var seriousness = req.body.seriousness;
			var outcome = req.body.outcome;
			var recorder_patient = req.body.recorder_patient;
			var recorder_practitioner = req.body.recorder_practitioner;
			var recorder_related_person = req.body.recorder_related_person;
			var event_participant_practitioner = req.body.event_participant_practitioner;
			var event_participant_device = req.body.event_participant_device;
			var description = req.body.description;
			
			var column = "";
      var values = "";
			
			if (typeof identifier_id !== 'undefined' && identifier_id !== "") {
        column += 'identifier_id,';
        values += "'" + identifier_id + "',";
      }
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }			
			if (typeof subject_research_subject !== 'undefined' && subject_research_subject !== "") {
        column += 'subject_research_subject,';
        values += "'" + subject_research_subject + "',";
      }
			if (typeof subject_medication !== 'undefined' && subject_medication !== "") {
        column += 'subject_medication,';
        values += "'" + subject_medication + "',";
      }
			if (typeof subject_device !== 'undefined' && subject_device !== "") {
        column += 'subject_device,';
        values += "'" + subject_device + "',";
      }
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd'),";
      }
			if (typeof location !== 'undefined' && location !== "") {
        column += 'location,';
        values += "'" + location + "',";
      }
			if (typeof seriousness !== 'undefined' && seriousness !== "") {
        column += 'seriousness,';
        values += "'" + seriousness + "',";
      }
			if (typeof outcome !== 'undefined' && outcome !== "") {
        column += 'outcome,';
        values += "'" + outcome + "',";
      }
			if (typeof recorder_patient !== 'undefined' && recorder_patient !== "") {
        column += 'recorder_patient,';
        values += "'" + recorder_patient + "',";
      }
			if (typeof recorder_practitioner !== 'undefined' && recorder_practitioner !== "") {
        column += 'recorder_practitioner,';
        values += "'" + recorder_practitioner + "',";
      }
			if (typeof recorder_related_person !== 'undefined' && recorder_related_person !== "") {
        column += 'recorder_related_person,';
        values += "'" + recorder_related_person + "',";
      }
			if (typeof event_participant_practitioner !== 'undefined' && event_participant_practitioner !== "") {
        column += 'event_participant_practitioner,';
        values += "'" + event_participant_practitioner + "',";
      }
			if (typeof event_participant_device !== 'undefined' && event_participant_device !== "") {
        column += 'event_participant_device,';
        values += "'" + event_participant_device + "',";
      }
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }

      var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "ADVERSE_EVENT_ID = '" + adverse_event_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.ADVERSE_EVENT(ADVERSE_EVENT_ID," + column.slice(0, -1) + ") SELECT ADVERSE_EVENT_ID, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADVERSE_EVENT WHERE " + condition;
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "SELECT adverse_event_id, identifier_id, category, type, subject_patient, subject_research_subject,  subject_medication, subject_device, date, location, seriousness, outcome, recorder_patient, recorder_practitioner, recorder_related_person, event_participant_practitioner, event_participant_device, description  FROM BACIRO_FHIR.ADVERSE_EVENT WHERE adverse_event_id = '" + adverse_event_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "putAdverseEvent"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "putAdverseEvent"});
      });
    },
		suspectEntity: function addSuspectEntity(req, res) {
      var suspect_entity_id = req.params.suspect_entity_id; 
			var instance_substance = req.body.instance_substance; 
			var instance_medication = req.body.instance_medication; 
			var instance_medication_administration = req.body.instance_medication_administration;  
			var instance_medication_statement = req.body.instance_medication_statement; 
			var instance_device = req.body.instance_device; 
			var causality = req.body.causality; 
			var causality_assessment = req.body.causality_assessment; 
			var causality_product_relatedness = req.body.causality_product_relatedness; 
			var causality_method = req.body.causality_method; 
			var causality_author_practitioner = req.body.causality_author_practitioner; 
			var causality_author_practitioner_role = req.body.causality_author_practitioner_role; 
			var causality_result = req.body.causality_result; 
			var adverse_event_id = req.body.adverse_event_id; 
						
			var column = "";
      var values = "";
			
			if (typeof instance_substance !== 'undefined' && instance_substance !== "") {
        column += 'instance_substance,';
        values += "'" + instance_substance + "',";
      }
			if (typeof instance_medication !== 'undefined' && instance_medication !== "") {
        column += 'instance_medication,';
        values += "'" + instance_medication + "',";
      }
			if (typeof instance_medication_administration !== 'undefined' && instance_medication_administration !== "") {
        column += 'instance_medication_administration,';
        values += "'" + instance_medication_administration + "',";
      }
			if (typeof instance_medication_statement !== 'undefined' && instance_medication_statement !== "") {
        column += 'instance_medication_statement,';
        values += "'" + instance_medication_statement + "',";
      }			
			if (typeof instance_device !== 'undefined' && instance_device !== "") {
        column += 'instance_device,';
        values += "'" + instance_device + "',";
      }
			if (typeof causality !== 'undefined' && causality !== "") {
        column += 'causality,';
        values += "'" + causality + "',";
      }
			if (typeof causality_assessment !== 'undefined' && causality_assessment !== "") {
        column += 'causality_assessment,';
        values += "'" + causality_assessment + "',";
      }
			if (typeof causality_product_relatedness !== 'undefined' && causality_product_relatedness !== "") {
        column += 'causality_product_relatedness,';
        values += "'" + causality_product_relatedness + "',";
      }
			if (typeof causality_method !== 'undefined' && causality_method !== "") {
        column += 'causality_method,';
        values += "'" + causality_method + "',";
      }
			if (typeof causality_author_practitioner !== 'undefined' && causality_author_practitioner !== "") {
        column += 'causality_author_practitioner,';
        values += "'" + causality_author_practitioner + "',";
      }
			if (typeof causality_author_practitioner_role !== 'undefined' && causality_author_practitioner_role !== "") {
        column += 'causality_author_practitioner_role,';
        values += "'" + causality_author_practitioner_role + "',";
      }
			if (typeof causality_result !== 'undefined' && causality_result !== "") {
        column += 'causality_result,';
        values += "'" + causality_result + "',";
      }
			if (typeof adverse_event_id !== 'undefined' && adverse_event_id !== "") {
        column += 'adverse_event_id,';
        values += "'" + adverse_event_id + "',";
      }
			
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "suspect_entity_id = '" + suspect_entity_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			var query = "UPSERT INTO BACIRO_FHIR.adverse_event_suspect_entity(suspect_entity_id," + column.slice(0, -1) + ") SELECT suspect_entity_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.adverse_event_suspect_entity WHERE " + condition;
			
			
			//console.log(query)
			db.upsert(query, function (succes) {
				console.log("add suspectEntity ok");
        var query = "SELECT suspect_entity_id, instance_substance, instance_medication, instance_medication_administration, instance_medication_statement, instance_device, causality, causality_assessment, causality_product_relatedness, causality_method, causality_author_practitioner, causality_author_practitioner_role, causality_result, adverse_event_id from baciro_fhir.adverse_event_suspect_entity se WHERE suspect_entity_id = '" + id + "' ";
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
            "function": "addSuspectEntity"
          });
        });
      }, function (e) {
				console.log("encounter failed");
        res.json({
          "err_code": 2,
          "err_msg": e,
          "application": "Api Phoenix",
          "function": "addSuspectEntity"
        });
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