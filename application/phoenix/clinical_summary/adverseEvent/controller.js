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
			var adverseEvent = req.query.adverseEvent;
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
			
			if(typeof adverseEvent !== 'undefined' && adverseEvent !== ""){
        condition += "ad.adverseEvent = '" + adverseEvent + "' AND,";  
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
      var query = "SELECT ad.adverse_event_id as adverse_event_id, ad.identifier_id as identifier_id, ad.category as category, ad.type as type, ad.subject_patient as subject_patient, ad.subject_research_subject as subject_research_subject, ad.subject_medication as subject_medication, ad.subject_device as subject_device, ad.date as date, ad.location as location, ad.seriousness as seriousness, ad.outcome as outcome, ad.recorder_patient as recorder_patient, ad.recorder_practitioner as recorder_practitioner, ad.recorder_related_person as recorder_related_person, ad.event_participant_practitioner as event_participant_practitioner, ad.event_participant_device as event_participant_device, ad.description as description FROM BACIRO_FHIR.ADVERSE_EVENT ad " + fixCondition;
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var AdverseEvent = {};
					
					var arrSubject = [];
					var Subject = {};
					if(rez[i].subject_medication != "null"){
						Subject.medication = hostFHIR + ':' + portFHIR + '/' + apikey + '/Dedication?_id=' +  rez[i].subject_medication;
					} else {
						Subject.medication = "";
					}
					if(rez[i].subject_patient != "null"){
						Subject.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].subject_patient;
					} else {
						Subject.patient = "";
					}
					if(rez[i].subject_device != "null"){
						Subject.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].subject_device;
					} else {
						Subject.device = "";
					}
					if(rez[i].subject_research_subject != "null"){
						Subject.researchSubject = hostFHIR + ':' + portFHIR + '/' + apikey + '/ResearchSubject?_id=' +  rez[i].subject_research_subject;
					} else {
						Subject.researchSubject = "";
					}
					arrSubject = Subject;
					
					var arrRecorder = [];
					var Recorder = {};
					if(rez[i].recorder_patient != "null"){
						Recorder.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].recorder_patient;
					} else {
						Recorder.patient = "";
					}
					if(rez[i].recorder_practitioner != "null"){
						Recorder.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].recorder_practitioner;
					} else {
						Recorder.practitioner = "";
					}
					if(rez[i].recorder_related_person != "null"){
						Recorder.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].recorder_related_person;
					} else {
						Recorder.relatedPerson = "";
					}
					arrRecorder = Recorder;
					
					if (rez[i].event_participant_practitioner !== 'null') {
						AdverseEvent.eventParticipant = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].event_participant_practitioner;
					} else if (rez[i].event_participant_device !== 'null') {
						AdverseEvent.eventParticipant = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].event_participant_device;
					} else {
						AdverseEvent.eventParticipant = "";
					}
					
					var arrEventParticipant = [];
					var EventParticipant = {};
					if(rez[i].event_participant_practitioner != "null"){
						EventParticipant.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].event_participant_practitioner;
					} else {
						EventParticipant.practitioner = "";
					}
					if(rez[i].event_participant_device != "null"){
						EventParticipant.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].event_participant_device;
					} else {
						EventParticipant.device = "";
					}
					arrEventParticipant = EventParticipant;
					
					AdverseEvent.resourceType = "Adverse Event";
          AdverseEvent.id = rez[i].adverse_event_id;
          AdverseEvent.identifierId = rez[i].identifier_id;
					AdverseEvent.category = rez[i].category;
					AdverseEvent.type = rez[i].type;
					AdverseEvent.subject = arrSubject;
					if(rez[i].date == null){
						AdverseEvent.date = formatDate(rez[i].date);
					}else{
						AdverseEvent.date = rez[i].date;
					}
					if(rez[i].adverseEvent != "null"){
						AdverseEvent.adverseEvent = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].adverseEvent;
					} else {
						AdverseEvent.adverseEvent = "";
					}
					AdverseEvent.seriousness = rez[i].seriousness;
					AdverseEvent.outcome = rez[i].outcome;
					AdverseEvent.recorder = arrRecorder;
					AdverseEvent.eventParticipant = arrEventParticipant;
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
					
					var arrInstance = [];
					var Instance = {};
					if(rez[i].instance_substance != "null"){
						Instance.substance = hostFHIR + ':' + portFHIR + '/' + apikey + '/Substance?_id=' +  rez[i].instance_substance;
					} else {
						Instance.substance = "";
					}
					if(rez[i].instance_medication != "null"){
						Instance.medication = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' +  rez[i].instance_medication;
					} else {
						Instance.medication = "";
					}
					if(rez[i].instance_medication_administration != "null"){
						Instance.medicationAdministration = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationAdministration?_id=' +  rez[i].instance_medication_administration;
					} else {
						Instance.medicationAdministration = "";
					}
					if(rez[i].instance_medication_statement != "null"){
						Instance.medicationStatement = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationStatement?_id=' +  rez[i].instance_medication_statement;
					} else {
						Instance.medicationStatement = "";
					}
					if(rez[i].instance_device != "null"){
						Instance.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].instance_device;
					} else {
						Instance.device = "";
					}
					arrInstance = Instance;
					
					var arrCausalityAuthor = [];
					var CausalityAuthor = {};
					if(rez[i].causality_author_practitioner != "null"){
						CausalityAuthor.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].causality_author_practitioner;
					} else {
						CausalityAuthor.practitioner = "";
					}
					if(rez[i].causality_author_practitioner_role != "null"){
						CausalityAuthor.practitionerRole = hostFHIR + ':' + portFHIR + '/' + apikey + '/PractitionerRole?_id=' +  rez[i].causality_author_practitioner_role;
					} else {
						CausalityAuthor.practitionerRole = "";
					}
					arrCausalityAuthor = CausalityAuthor;
					
          // var 
          suspectEntity.id = rez[i].organization_contact_id;
					suspectEntity.instance = arrInstance;
          suspectEntity.causality = rez[i].causality;
					suspectEntity.causalityAssessment = rez[i].causality_assessment;
					suspectEntity.causalityProductRelatedness = rez[i].causality_product_relatedness;
					suspectEntity.causalityMethod = rez[i].causality_method;
					suspectEntity.causalityAuthor = arrCausalityAuthor;
					suspectEntity.causalityResult = rez[i].causality_result;

          arrSuspectEntity[i] = suspectEntity;
        }
        res.json({"err_code":0,"data": arrSuspectEntity});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getSuspectEntity"});
      });
    },
		condition: function getCondition(req, res){
			var apikey = req.params.apikey;
			var conditionId = req.query._id;
			var adverseEventId = req.query.adverse_event_reaction_id;
			
			var condition = "";
			var join = "";
			
			if(typeof conditionId !== 'undefined' && conditionId !== ""){
        condition += "condition_id = '" + conditionId + "' AND ";  
      }
						
			if(typeof adverseEventId !== 'undefined' && adverseEventId !== ""){
        condition += "adverse_event_reaction_id = '" + adverseEventId + "' AND ";  
      }
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
      
			var query = "select condition_id from baciro_fhir.condition " + fixCondition;
			//console.log(query);
      
			var arrCondition = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				//console.log(rez);
        for(i = 0; i < rez.length; i++){
					var Condition = {};
					if(rez[i].condition_id != "null"){
						Condition.id = hostfhir + ":" + portfhir + "/" + apikey + "/Condition?_id=" + rez[i].condition_id;
					} else {
						Condition.id = "";
					}
          //console.log(Condition);
          arrCondition[i] = Condition;
        }
        res.json({"err_code":0,"data": arrCondition});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getCondition"});
      });
    },
		conditionSubjectMedicalHistory: function getConditionSubjectMedicalHistory(req, res){
			var apikey = req.params.apikey;
			var conditionId = req.query._id;
			var adverseEventId = req.query.adverse_event_subject_medical_history_id;
			
			var condition = "";
			var join = "";
			
			if(typeof conditionId !== 'undefined' && conditionId !== ""){
        condition += "condition_id = '" + conditionId + "' AND ";  
      }
						
			if(typeof adverseEventId !== 'undefined' && adverseEventId !== ""){
        condition += "ADVERSE_EVENT_SUBJECT_MEDICAL_HISTORY_ID = '" + adverseEventId + "' AND ";  
      }
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
      
			var query = "select condition_id from baciro_fhir.condition " + fixCondition;
			//console.log(query);
      
			var arrCondition = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				//console.log(rez);
        for(i = 0; i < rez.length; i++){
					var Condition = {};
					if(rez[i].condition_id != "null"){
						Condition.id = hostfhir + ":" + portfhir + "/" + apikey + "/Condition?_id=" + rez[i].condition_id;
					} else {
						Condition.id = "";
					}
          //console.log(Condition);
          arrCondition[i] = Condition;
        }
        res.json({"err_code":0,"data": arrCondition});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getConditionSubjectMedicalHistory"});
      });
    },
		observationSubjectMedicalHistory: function getObservationSubjectMedicalHistory(req, res){
			var apikey = req.params.apikey;
			var observationId = req.query._id;
			var adverseEventId = req.query.adverse_event_subject_medical_history_id;
			
			var condition = "";
			var join = "";
			
			if(typeof observationId !== 'undefined' && observationId !== ""){
        condition += "observation_id = '" + observationId + "' AND ";  
      }
						
			if(typeof adverseEventId !== 'undefined' && adverseEventId !== ""){
        condition += "ADVERSE_EVENT_ID = '" + adverseEventId + "' AND ";  
      }
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
      
			var query = "select observation_id from baciro_fhir.Observation " + fixCondition;
			//console.log(query);
      
			var arrObservation = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				//console.log(rez);
        for(i = 0; i < rez.length; i++){
					var Observation = {};
					if(rez[i].observation_id != "null"){
						Observation.id = hostfhir + ":" + portfhir + "/" + apikey + "/Observation?_id=" + rez[i].observation_id;
					} else {
						Observation.id = "";
					}
					//console.log(Condition);
          arrObservation[i] = Observation;
        }
        res.json({"err_code":0,"data": arrObservation});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getObservationSubjectMedicalHistory"});
      });
    },
		allergyIntoleranceSubjectMedicalHistory: function getAllergyIntoleranceSubjectMedicalHistory(req, res){
			var apikey = req.params.apikey;
			var allergyIntoleranceId = req.query._id;
			var adverseEventId = req.query.adverse_event_subject_medical_history_id;
			
			var condition = "";
			var join = "";
			
			if(typeof allergyIntoleranceId !== 'undefined' && allergyIntoleranceId !== ""){
        condition += "allergy_intolerance_id = '" + allergyIntoleranceId + "' AND ";  
      }
						
			if(typeof adverseEventId !== 'undefined' && adverseEventId !== ""){
        condition += "ADVERSE_EVENT_ID = '" + adverseEventId + "' AND ";  
      }
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
      
			var query = "select allergy_intolerance_id from baciro_fhir.ALLERGY_INTOLERANCE " + fixCondition;
			//console.log(query);
      
			var arrAllergyIntolerance = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				//console.log(rez);
        for(i = 0; i < rez.length; i++){
					var AllergyIntolerance = {};
					if(rez[i].allergy_intolerance_id != "null"){
						AllergyIntolerance.id = hostfhir + ":" + portfhir + "/" + apikey + "/AllergyIntolerance?_id=" + rez[i].allergy_intolerance_id;
					} else {
						AllergyIntolerance.id = "";
					}
          //console.log(Condition);
          arrAllergyIntolerance[i] = AllergyIntolerance;
        }
        res.json({"err_code":0,"data": arrAllergyIntolerance});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getAllergyIntoleranceSubjectMedicalHistory"});
      });
    },
		familyMemberHistorySubjectMedicalHistory: function getFamilyMemberHistorySubjectMedicalHistory(req, res){
			var apikey = req.params.apikey;
			var familyMemberHistoryId = req.query._id;
			var adverseEventId = req.query.adverse_event_subject_medical_history_id;
			
			var condition = "";
			var join = "";
			
			if(typeof familyMemberHistoryId !== 'undefined' && familyMemberHistoryId !== ""){
        condition += "family_member_history_id = '" + familyMemberHistoryId + "' AND ";  
      }
						
			if(typeof adverseEventId !== 'undefined' && adverseEventId !== ""){
        condition += "ADVERSE_EVENT_ID = '" + adverseEventId + "' AND ";  
      }
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
      
			var query = "select family_member_history_id from baciro_fhir.FAMILY_MEMBER_HISTORY " + fixCondition;
			//console.log(query);
      
			var arrFamilyMemberHistory = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				//console.log(rez);
        for(i = 0; i < rez.length; i++){
					var FamilyMemberHistory = {};
					if(rez[i].family_member_history_id != "null"){
						FamilyMemberHistory.id = hostfhir + ":" + portfhir + "/" + apikey + "/FamilyMemberHistory?_id=" + rez[i].family_member_history_id;
					} else {
						FamilyMemberHistory.id = "";
					}
					
          arrFamilyMemberHistory[i] = FamilyMemberHistory;
        }
        res.json({"err_code":0,"data": arrFamilyMemberHistory});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getFamilyMemberHistorySubjectMedicalHistory"});
      });
    },
		immunizationSubjectMedicalHistory: function getImmunizationSubjectMedicalHistory(req, res){
			var apikey = req.params.apikey;
			var immunizationId = req.query._id;
			var adverseEventId = req.query.adverse_event_subject_medical_history_id;
			
			var condition = "";
			var join = "";
			
			if(typeof immunizationId !== 'undefined' && immunizationId !== ""){
        condition += "immunization_id = '" + immunizationId + "' AND ";  
      }
						
			if(typeof adverseEventId !== 'undefined' && adverseEventId !== ""){
        condition += "ADVERSE_EVENT_ID = '" + adverseEventId + "' AND ";  
      }
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
      
			var query = "select immunization_id from baciro_fhir.IMMUNIZATION " + fixCondition;
			//console.log(query);
      
			var arrImmunization = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				//console.log(rez);
        for(i = 0; i < rez.length; i++){
					var Immunization = {};
					if(rez[i].immunization_id != "null"){
						Immunization.id = hostfhir + ":" + portfhir + "/" + apikey + "/Immunization?_id=" + rez[i].immunization_id;
					} else {
						Immunization.id = "";
					}
					
          arrImmunization[i] = Immunization;
        }
        res.json({"err_code":0,"data": arrImmunization});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationSubjectMedicalHistory"});
      });
    },
		procedureSubjectMedicalHistory: function getProcedureSubjectMedicalHistory(req, res){
			var apikey = req.params.apikey;
			var procedureId = req.query._id;
			var adverseEventId = req.query.adverse_event_subject_medical_history_id;
			
			var condition = "";
			var join = "";
			
			if(typeof procedureId !== 'undefined' && procedureId !== ""){
        condition += "procedure_id = '" + procedureId + "' AND ";  
      }
						
			if(typeof adverseEventId !== 'undefined' && adverseEventId !== ""){
        condition += "ADVERSE_EVENT_ID = '" + adverseEventId + "' AND ";  
      }
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
      
			var query = "select procedure_id from baciro_fhir.PROCEDURE " + fixCondition;
			//console.log(query);
      
			var arrProcedure = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				//console.log(rez);
        for(i = 0; i < rez.length; i++){
					var Procedure = {};
					if(rez[i].procedure_id != "null"){
						Procedure.id = hostfhir + ":" + portfhir + "/" + apikey + "/Procedure?_id=" + rez[i].procedure_id;
					} else {
						Procedure.id = "";
					}
					
          arrProcedure[i] = Procedure;
        }
        res.json({"err_code":0,"data": arrProcedure});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getProcedureSubjectMedicalHistory"});
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
			var adverseEvent = req.body.adverseEvent;
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
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			if (typeof adverseEvent !== 'undefined' && adverseEvent !== "") {
        column += 'adverseEvent,';
        values += "'" + adverseEvent + "',";
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
			var adverseEvent = req.body.adverseEvent;
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
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			if (typeof adverseEvent !== 'undefined' && adverseEvent !== "") {
        column += 'adverseEvent,';
        values += "'" + adverseEvent + "',";
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