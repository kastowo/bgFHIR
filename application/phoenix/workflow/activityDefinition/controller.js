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
		activityDefinition: function getActivityDefinition(req, res){
			var apikey = req.params.apikey;
			var activityDefinitionId = req.query._id;
			
			/*var based_on = req.query.based_on;
			var category = req.query.category;
			var code = req.query.code;
			var context = req.query.context;
			var date = req.query.date;
			var diagnosis = req.query.diagnosis;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var image = req.query.image;
			var issued = req.query.issued;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var result = req.query.result;
			var specimen = req.query.specimen;
			var status = req.query.status;
			var subject = req.query.subject;
			
			
	
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof activityDefinitionId !== 'undefined' && activityDefinitionId !== ""){
        condition += "dr.diagnostic_report_id = '" + activityDefinitionId + "' AND,";  
      }
			
			if((typeof based_on !== 'undefined' && based_on !== "")){ 
			 var res = based_on.substring(0, 3);
				if(res == 'cap'){
					join += " LEFT JOIN BACIRO_FHIR.CAREPLAN cap ON dr.diagnostic_report_id = cap.diagnostic_report_id ";
          condition += "CAREPLAN_ID = '" + based_on + "' AND ";       
				} 
				if(res == 'imr') {
					join += " LEFT JOIN BACIRO_FHIR.immunization_recommendation ir ON dr.diagnostic_report_id = ir.diagnostic_report_id ";
          condition += "immunization_recommendation_id = '" + based_on + "' AND ";       
				}
				
				if(res == 'mer'){
					join += " LEFT JOIN BACIRO_FHIR.MEDICATION_REQUEST mr ON dr.diagnostic_report_id = mr.diagnostic_report_id ";
          condition += "MEDICATION_REQUEST_ID = '" + based_on + "' AND ";       
				}
				
				if(res == 'pre') {
					join += " LEFT JOIN BACIRO_FHIR.PROCEDURE_REQUEST pr ON dr.diagnostic_report_id = pr.diagnostic_report_id ";
          condition += "PROCEDURE_REQUEST_id = '" + based_on + "' AND ";       
				}
				
				if(res == 'cap'){
					join += " LEFT JOIN BACIRO_FHIR.REFERRAL_REQUEST rr ON dr.diagnostic_report_id = rr.diagnostic_report_id ";
          condition += "REFERRAL_REQUEST_ID = '" + based_on + "' AND ";       
				} 
				
				if(res == 'imr') {
					join += " LEFT JOIN BACIRO_FHIR.Nutrition_Order  no ON dr.diagnostic_report_id = no.diagnostic_report_id ";
          condition += "Nutrition_Order_id = '" + based_on + "' AND ";       
				}
      }
			
			if(typeof category !== 'undefined' && category !== ""){
				condition += "dr.category = '" + category + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
				condition += "dr.CODE = '" + code + "' AND,";  
      }
			
			if(typeof context !== 'undefined' && context !== ""){
				condition += "(dr.CONTEXT_ENCOUNTER = '" + context + "' OR dr.CONTEXT_EPISODE_OF_CARE = '" + context + "') AND,";  
			}
			
			if (typeof date !== 'undefined' && date !== "") {
        condition += "dr.effective_period_start <= to_date('" + date + "', 'yyyy-MM-dd') AND dr.effective_period_end >= to_date('" + date + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof diagnosis !== 'undefined' && diagnosis !== ""){
				condition += "dr.coded_diagnosis = '" + diagnosis + "' AND,";  
      }
			
			if(typeof encounter !== 'undefined' && encounter !== ""){
			  condition += "dr.CONTEXT_ENCOUNTER = '" + encounter + "' AND,";  
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if((typeof image !== 'undefined' && image !== "")){
        join += " LEFT JOIN BACIRO_FHIR.Media me ON me.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "me.media_id = '" + image + "' AND ";
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
			  condition += "dr.subject_patient = '" + patient + "' AND,";  
      }
			
			if(typeof issued !== 'undefined' && issued !== ""){
			  condition += "dr.issued == to_date('" + issued + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof performer !== 'undefined' && performer !== ""){
				join += " LEFT JOIN BACIRO_FHIR.diagnostic_report_performer drp ON drp.diagnostic_report_id = dr.diagnostic_report_id ";
				condition += "(drp.actor_practitioner = '" + performer + "' OR drp.actor_organization = '" + performer + "') AND,";  
			}
			
			if((typeof result !== 'undefined' && result !== "")){
        join += " LEFT JOIN BACIRO_FHIR.observation obs ON obs.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "obs.observation_id = '" + result + "' AND ";
      }
			
			if((typeof specimen !== 'undefined' && specimen !== "")){
        join += " LEFT JOIN BACIRO_FHIR.Specimen spe ON spe.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "spe.specimen_id = '" + specimen + "' AND ";
      }
			if(typeof status !== 'undefined' && status !== ""){
				condition += "dr.status = '" + status + "' AND,";  
      }
			
			if(typeof subject !== 'undefined' && subject !== ""){
				condition += "(dr.SUBJECT_PATIENT = '" + subject + "' OR dr.SUBJECT_GROUP = '" + subject + "' OR dr.subject_device = '" + subject + "' OR dr.subject_location = '" + subject + "') AND,";  
			}*/
			
			
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			
			var arrActivityDefinition = [];
      var query = "select ad.activity_definition_id as activity_definition_id, ad.url as url, ad.version as version, ad.name as name, ad.title as title, ad.status as status, ad.experimental as experimental, ad.date as date, ad.publisher as publisher, ad.description as description, ad.purpose as purpose, ad.usage as usage, ad.approval_date as approval_date, ad.last_review_date as last_review_date, ad.effective_period_start as effective_period_start, ad.effective_period_end as effective_period_end, ad.jurisdiction as jurisdiction, ad.topic as topic, ad.copyright as copyright, ad.kind as kind, ad.code as code, ad.timing_timing as timing_timing, ad.timing_date_time as timing_date_time, ad.timing_period_start as timing_period_start, ad.timing_period_end as timing_period_end, ad.timing_range_low as timing_range_low, ad.timing_range_high as timing_range_high, ad.location as location, ad.product_reference_medication as product_reference_medication, ad.product_reference_substance as product_reference_substance, ad.product_codeable_concept as product_codeable_concept, ad.quantity as quantity, ad.body_site as body_site, ad.transform as transform from BACIRO_FHIR.activity_definition ad " + fixCondition;
			//console.log(query);			
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var ActivityDefinition = {};
					ActivityDefinition.resourceType = "ActivityDefinition";
          ActivityDefinition.id = rez[i].activity_definition_id;
					ActivityDefinition.url = rez[i].url;
					ActivityDefinition.version = rez[i].version;
					ActivityDefinition.name = rez[i].name;
					ActivityDefinition.title = rez[i].title;
					ActivityDefinition.status = rez[i].status;
					ActivityDefinition.experimental = rez[i].experimental;
					if(rez[i].date == null){
						ActivityDefinition.date = formatDate(rez[i].date);
					}else{
						ActivityDefinition.date = rez[i].date;
					}
					ActivityDefinition.publisher = rez[i].publisher;
					ActivityDefinition.description = rez[i].description;
					ActivityDefinition.purpose = rez[i].purpose;
					ActivityDefinition.usage = rez[i].usage;
					if(rez[i].approval_date == null){
						ActivityDefinition.approvalDate = formatDate(rez[i].approval_date);
					}else{
						ActivityDefinition.approvalDate = rez[i].approval_date;
					}
					if(rez[i].last_review_date == null){
						ActivityDefinition.lastReviewDate = formatDate(rez[i].last_review_date);
					}else{
						ActivityDefinition.lastReviewDate = rez[i].last_review_date;
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
					ActivityDefinition.effectivePeriod = effectiveperiod_start + ' to ' + effectiveperiod_end;
					ActivityDefinition.jurisdiction = rez[i].jurisdiction;
					ActivityDefinition.topic = rez[i].topic;
					ActivityDefinition.copyright = rez[i].copyright;
					ActivityDefinition.kind = rez[i].kind;
					ActivityDefinition.code = rez[i].code;
					ActivityDefinition.timing.timingTiming = rez[i].timing_timing;
					if(rez[i].timing_date_time == null){
						ActivityDefinition.timing.timingDateTime = formatDate(rez[i].timing_date_time);
					}else{
						ActivityDefinition.timing.timingDateTime = rez[i].timing_date_time;
					}
					var timingperiod_start,timingperiod_end;
					if(rez[i].timing_period_start == null){
						timingperiod_start = formatDate(rez[i].timing_period_start);  
					}else{
						timingperiod_start = rez[i].timing_period_start;  
					}
					if(rez[i].timing_period_end == null){
						timingperiod_end = formatDate(rez[i].timing_period_end);  
					}else{
						timingperiod_end = rez[i].timing_period_end;  
					}
					ActivityDefinition.timing.timingPeriod = timingperiod_start + ' to ' + timingperiod_end;
					ActivityDefinition.timing.timingrange = rez[i].timing_range_low + ' to ' + rez[i].timing_range_high;
					if (rez[i].location !== 'null') {
						ActivityDefinition.location = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].location;
					} else {
						ActivityDefinition.location = "";
					}
					var arrProductReference = [];
					var ProductReference = {};
					if(rez[i].product_reference_medication != "null"){
						ProductReference.medication = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' +  rez[i].product_reference_medication;
					} else {
						ProductReference.medication = "";
					}
					if(rez[i].product_reference_substance != "null"){
						ProductReference.substance = hostFHIR + ':' + portFHIR + '/' + apikey + '/Substance?_id=' +  rez[i].product_reference_substance;
					} else {
						ProductReference.substance = "";
					}
					arrProductReference[i] = ProductReference;
					ActivityDefinition.product.productReference = arrProductReference;
					ActivityDefinition.product.productCodeableConcept = rez[i].product_codeable_concept
					ActivityDefinition.quantity = rez[i].quantity;
					ActivityDefinition.body_site = rez[i].body_site;
					if (rez[i].transform !== 'null') {
						ActivityDefinition.transform = hostFHIR + ':' + portFHIR + '/' + apikey + '/Structuremap?_id=' +  rez[i].transform;
					} else {
						ActivityDefinition.transform = "";
					}
					
          arrActivityDefinition[i] = ActivityDefinition;
        }
        res.json({"err_code":0,"data": arrActivityDefinition});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getActivityDefinition"});
      });
    },
		activityDefinitionParticipant: function getActivityDefinitionParticipant(req, res) {
			var apikey = req.params.apikey;
			
			var activityDefinitionParticipantId = req.query._id;
			var activityDefinitionId = req.query.activity_definition_id;

			//susun query
			var condition = "";

			if (typeof activityDefinitionParticipantId !== 'undefined' && activityDefinitionParticipantId !== "") {
				condition += "participant_id = '" + activityDefinitionParticipantId + "' AND ";
			}

			if (typeof activityDefinitionId !== 'undefined' && activityDefinitionId !== "") {
				condition += "activity_definition_id = '" + activityDefinitionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrActivityDefinitionParticipant = [];
			var query = "select participant_id, type, role from BACIRO_FHIR.activity_definition_participant " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ActivityDefinitionParticipant = {};
					ActivityDefinitionParticipant.id = rez[i].participant_id;
					ActivityDefinitionParticipant.type = rez[i].type;
					ActivityDefinitionParticipant.role = rez[i].role;
					arrActivityDefinitionParticipant[i] = ActivityDefinitionParticipant;
				}
				res.json({
					"err_code": 0,
					"data": arrActivityDefinitionParticipant
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getActivityDefinitionParticipant"
				});
			});
		},
		activityDefinitionDynamicValue: function getActivityDefinitionDynamicValue(req, res) {
			var apikey = req.params.apikey;
			
			var activityDefinitionDynamicValueId = req.query._id;
			var activityDefinitionId = req.query.activity_definition_id;

			//susun query
			var condition = "";

			if (typeof activityDefinitionDynamicValueId !== 'undefined' && activityDefinitionDynamicValueId !== "") {
				condition += "dynamic_value_id = '" + activityDefinitionDynamicValueId + "' AND ";
			}

			if (typeof activityDefinitionId !== 'undefined' && activityDefinitionId !== "") {
				condition += "activity_definition_id = '" + activityDefinitionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrActivityDefinitionDynamicValue = [];
			var query = "select dynamic_value_id, description, path, language, expression from BACIRO_FHIR.activity_definition_dynamic_value " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ActivityDefinitionDynamicValue = {};
					ActivityDefinitionDynamicValue.id = rez[i].dynamic_value_id;
					ActivityDefinitionDynamicValue.description = rez[i].description;
					ActivityDefinitionDynamicValue.path = rez[i].path;
					ActivityDefinitionDynamicValue.language = rez[i].language;
					ActivityDefinitionDynamicValue.expression = rez[i].expression;
					
					arrActivityDefinitionDynamicValue[i] = ActivityDefinitionDynamicValue;
				}
				res.json({
					"err_code": 0,
					"data": arrActivityDefinitionDynamicValue
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getActivityDefinitionDynamicValue"
				});
			});
		},
  },
	post: {
		activityDefinition: function addActivityDefinition(req, res) {
			console.log(req.body);
			var activity_definition_id  = req.body.activity_definition_id;
			var url  = req.body.url;
			var version  = req.body.version;
			var name  = req.body.name;
			var title  = req.body.title;
			var status  = req.body.status;
			var experimental  = req.body.experimental;
			var date  = req.body.date;
			var publisher  = req.body.publisher;
			var description  = req.body.description;
			var purpose  = req.body.purpose;
			var usage  = req.body.usage;
			var approval_date  = req.body.approval_date;
			var last_review_date  = req.body.last_review_date;
			var effective_period_start  = req.body.effective_period_start;
			var effective_period_end  = req.body.effective_period_end;
			var jurisdiction  = req.body.jurisdiction;
			var topic  = req.body.topic;
			var copyright  = req.body.copyright;
			var kind  = req.body.kind;
			var code  = req.body.code;
			var timing_timing  = req.body.timing_timing;
			var timing_date_time  = req.body.timing_date_time;
			var timing_period_start  = req.body.timing_period_start;
			var timing_period_end  = req.body.timing_period_end;
			var timing_range_low  = req.body.timing_range_low;
			var timing_range_high  = req.body.timing_range_high;
			var location  = req.body.location;
			var product_reference_medication  = req.body.product_reference_medication;
			var product_reference_substance  = req.body.product_reference_substance;
			var product_codeable_concept  = req.body.product_codeable_concept;
			var quantity  = req.body.quantity;
			var body_site  = req.body.body_site;
			var transform  = req.body.transform;
			var communication_id  = req.body.communication_id;
			var device_request_id  = req.body.device_request_id;
			var medication_administration_id  = req.body.medication_administration_id;
			var medication_request_id  = req.body.medication_request_id;
			var message_definition_id  = req.body.message_definition_id;
			var procedure_id  = req.body.procedure_id;
			var procedure_request_id  = req.body.procedure_request_id;
			var referral_request_id  = req.body.referral_request_id;
			
			var column = "";
      var values = "";
			
				
			if (typeof url !== 'undefined' && url !== "") {
        column += 'url,';
        values += "'" + url + "',";
      }
			
			if (typeof version !== 'undefined' && version !== "") {
        column += 'version,';
        values += "'" + version + "',";
      }	
			
			if (typeof name !== 'undefined' && name !== "") {
        column += 'name,';
        values += "'" + name + "',";
      }	
			
			if (typeof title !== 'undefined' && title !== "") {
        column += 'title,';
        values += "'" + title + "',";
      }	
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }		
			
			if (typeof experimental !== 'undefined' && experimental !== "") {
        column += 'experimental,';
        values += " " + experimental + ",";
      }	
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof publisher !== 'undefined' && publisher !== "") {
        column += 'publisher,';
        values += "'" + publisher + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof purpose !== 'undefined' && purpose !== "") {
        column += 'purpose,';
        values += "'" + purpose + "',";
      }		
			
			if (typeof usage !== 'undefined' && usage !== "") {
        column += 'usage,';
        values += "'" + usage + "',";
      }		
				
			if (typeof approval_date !== 'undefined' && approval_date !== "") {
        column += 'approval_date,';
				values += "to_date('"+ approval_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof last_review_date !== 'undefined' && last_review_date !== "") {
        column += 'last_review_date,';
				values += "to_date('"+ last_review_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_start !== 'undefined' && effective_period_start !== "") {
        column += 'effective_period_start,';
				values += "to_date('"+ effective_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_end !== 'undefined' && effective_period_end !== "") {
        column += 'effective_period_end,';
				values += "to_date('"+ effective_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof jurisdiction !== 'undefined' && jurisdiction !== "") {
        column += 'jurisdiction,';
        values += "'" + jurisdiction + "',";
      }		
			
			if (typeof topic !== 'undefined' && topic !== "") {
        column += 'topic,';
        values += "'" + topic + "',";
      }		
			
			if (typeof copyright !== 'undefined' && copyright !== "") {
        column += 'copyright,';
        values += "'" + copyright + "',";
      }		
			
			if (typeof kind !== 'undefined' && kind !== "") {
        column += 'kind,';
        values += "'" + kind + "',";
      }		
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }		
			
			if (typeof timing_timing !== 'undefined' && timing_timing !== "") {
        column += 'timing_timing,';
        values += "'" + timing_timing + "',";
      }		
			
			if (typeof timing_date_time !== 'undefined' && timing_date_time !== "") {
        column += 'timing_date_time,';
				values += "to_date('"+ timing_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof timing_period_start !== 'undefined' && timing_period_start !== "") {
        column += 'timing_period_start,';
				values += "to_date('"+ timing_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof timing_period_end !== 'undefined' && timing_period_end !== "") {
        column += 'timing_period_end,';
				values += "to_date('"+ timing_period_end + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof timing_range_low !== 'undefined' && timing_range_low !== "") {
        column += 'timing_range_low,';
        values += " " + timing_range_low + ",";
      }		
			
			if (typeof timing_range_high !== 'undefined' && timing_range_high !== "") {
        column += 'timing_range_high,';
        values += " " + timing_range_high + ",";
      }
			
			if (typeof location !== 'undefined' && location !== "") {
        column += 'location,';
        values += "'" + location + "',";
      }		
			
			if (typeof product_reference_medication !== 'undefined' && product_reference_medication !== "") {
        column += 'product_reference_medication,';
        values += "'" + product_reference_medication + "',";
      }		
			
			if (typeof product_reference_substance !== 'undefined' && product_reference_substance !== "") {
        column += 'product_reference_substance,';
        values += "'" + product_reference_substance + "',";
      }		
			
			if (typeof product_codeable_concept !== 'undefined' && product_codeable_concept !== "") {
        column += 'product_codeable_concept,';
        values += "'" + product_codeable_concept + "',";
      }	
			
			if (typeof quantity !== 'undefined' && quantity !== "") {
        column += 'quantity,';
        values += " " + quantity + ",";
      }
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
      }
			
			if (typeof transform !== 'undefined' && transform !== "") {
        column += 'transform,';
        values += "'" + transform + "',";
      }
			
			if (typeof communication_id !== 'undefined' && communication_id !== "") {
        column += 'communication_id,';
        values += "'" + communication_id + "',";
      }
			
			if (typeof device_request_id !== 'undefined' && device_request_id !== "") {
        column += 'device_request_id,';
        values += "'" + device_request_id + "',";
      }
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }
			
			if (typeof medication_request_id !== 'undefined' && medication_request_id !== "") {
        column += 'medication_request_id,';
        values += "'" + medication_request_id + "',";
      }
			
			if (typeof message_definition_id !== 'undefined' && message_definition_id !== "") {
        column += 'message_definition_id,';
        values += "'" + message_definition_id + "',";
      }
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }
			
			if (typeof procedure_request_id !== 'undefined' && procedure_request_id !== "") {
        column += 'procedure_request_id,';
        values += "'" + procedure_request_id + "',";
      }
			
			if (typeof referral_request_id !== 'undefined' && referral_request_id !== "") {
        column += 'referral_request_id,';
        values += "'" + referral_request_id + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.activity_definition(activity_definition_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+activity_definition_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select activity_definition_id from BACIRO_FHIR.activity_definition WHERE activity_definition_id = '" + activity_definition_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addActivityDefinition"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addActivityDefinition"});
      });
    },
		activityDefinitionParticipant: function addActivityDefinitionParticipant(req, res) {
			console.log(req.body);
			var participant_id  = req.body.participant_id;
			var type  = req.body.type;
			var role  = req.body.role;
			var activity_definition_id  = req.body.activity_definition_id;
			
			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof role !== 'undefined' && role !== "") {
        column += 'role,';
        values += " '" + role + "',";
      }
			
			if (typeof activity_definition_id !== 'undefined' && activity_definition_id !== "") {
        column += 'activity_definition_id,';
        values += "'" + activity_definition_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.activity_definition_participant(participant_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+participant_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select participant_id from BACIRO_FHIR.activity_definition_participant WHERE participant_id = '" + participant_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addActivityDefinitionParticipant"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addActivityDefinitionParticipant"});
      });
    },
		activityDefinitionDynamicValue: function addActivityDefinitionDynamicValue(req, res) {
			console.log(req.body);
			var dynamic_value_id  = req.body.dynamic_value_id;
			var description  = req.body.description;
			var path  = req.body.path;
			var language  = req.body.language;
			var expression  = req.body.expression;
			var activity_definition_id   = req.body.activity_definition_id;
			
			var column = "";
      var values = "";
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }
			
			if (typeof path !== 'undefined' && path !== "") {
        column += 'path,';
        values += " '" + path + "',";
      }
			
			if (typeof language !== 'undefined' && language !== "") {
        column += 'language,';
        values += "'" + language + "',";
      }
			
			if (typeof expression !== 'undefined' && expression !== "") {
        column += 'expression,';
        values += "'" + expression + "',";
      }	
			
			if (typeof activity_definition_id !== 'undefined' && activity_definition_id !== "") {
        column += 'activity_definition_id,';
        values += "'" + activity_definition_id + "',";
      }	
			
      var query = "UPSERT INTO BACIRO_FHIR.activity_definition_dynamic_value(dynamic_value_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+dynamic_value_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select dynamic_value_id from BACIRO_FHIR.activity_definition_dynamic_value WHERE dynamic_value_id = '" + dynamic_value_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addActivityDefinitionDynamicValue"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addActivityDefinitionDynamicValue"});
      });
    },
	},
	put: {
		activityDefinition: function updateActivityDefinition(req, res) {
			console.log(req.body);
			var activity_definition_id  = req.params.activity_definition_id;
			var url  = req.body.url;
			var version  = req.body.version;
			var name  = req.body.name;
			var title  = req.body.title;
			var status  = req.body.status;
			var experimental  = req.body.experimental;
			var date  = req.body.date;
			var publisher  = req.body.publisher;
			var description  = req.body.description;
			var purpose  = req.body.purpose;
			var usage  = req.body.usage;
			var approval_date  = req.body.approval_date;
			var last_review_date  = req.body.last_review_date;
			var effective_period_start  = req.body.effective_period_start;
			var effective_period_end  = req.body.effective_period_end;
			var jurisdiction  = req.body.jurisdiction;
			var topic  = req.body.topic;
			var copyright  = req.body.copyright;
			var kind  = req.body.kind;
			var code  = req.body.code;
			var timing_timing  = req.body.timing_timing;
			var timing_date_time  = req.body.timing_date_time;
			var timing_period_start  = req.body.timing_period_start;
			var timing_period_end  = req.body.timing_period_end;
			var timing_range_low  = req.body.timing_range_low;
			var timing_range_high  = req.body.timing_range_high;
			var location  = req.body.location;
			var product_reference_medication  = req.body.product_reference_medication;
			var product_reference_substance  = req.body.product_reference_substance;
			var product_codeable_concept  = req.body.product_codeable_concept;
			var quantity  = req.body.quantity;
			var body_site  = req.body.body_site;
			var transform  = req.body.transform;
			var communication_id  = req.body.communication_id;
			var device_request_id  = req.body.device_request_id;
			var medication_administration_id  = req.body.medication_administration_id;
			var medication_request_id  = req.body.medication_request_id;
			var message_definition_id  = req.body.message_definition_id;
			var procedure_id  = req.body.procedure_id;
			var procedure_request_id  = req.body.procedure_request_id;
			var referral_request_id  = req.body.referral_request_id;
			
			var column = "";
      var values = "";
			
				
			if (typeof url !== 'undefined' && url !== "") {
        column += 'url,';
        values += "'" + url + "',";
      }
			
			if (typeof version !== 'undefined' && version !== "") {
        column += 'version,';
        values += "'" + version + "',";
      }	
			
			if (typeof name !== 'undefined' && name !== "") {
        column += 'name,';
        values += "'" + name + "',";
      }	
			
			if (typeof title !== 'undefined' && title !== "") {
        column += 'title,';
        values += "'" + title + "',";
      }	
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }		
			
			if (typeof experimental !== 'undefined' && experimental !== "") {
        column += 'experimental,';
        values += " " + experimental + ",";
      }	
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof publisher !== 'undefined' && publisher !== "") {
        column += 'publisher,';
        values += "'" + publisher + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof purpose !== 'undefined' && purpose !== "") {
        column += 'purpose,';
        values += "'" + purpose + "',";
      }		
			
			if (typeof usage !== 'undefined' && usage !== "") {
        column += 'usage,';
        values += "'" + usage + "',";
      }		
				
			if (typeof approval_date !== 'undefined' && approval_date !== "") {
        column += 'approval_date,';
				values += "to_date('"+ approval_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof last_review_date !== 'undefined' && last_review_date !== "") {
        column += 'last_review_date,';
				values += "to_date('"+ last_review_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_start !== 'undefined' && effective_period_start !== "") {
        column += 'effective_period_start,';
				values += "to_date('"+ effective_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof effective_period_end !== 'undefined' && effective_period_end !== "") {
        column += 'effective_period_end,';
				values += "to_date('"+ effective_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof jurisdiction !== 'undefined' && jurisdiction !== "") {
        column += 'jurisdiction,';
        values += "'" + jurisdiction + "',";
      }		
			
			if (typeof topic !== 'undefined' && topic !== "") {
        column += 'topic,';
        values += "'" + topic + "',";
      }		
			
			if (typeof copyright !== 'undefined' && copyright !== "") {
        column += 'copyright,';
        values += "'" + copyright + "',";
      }		
			
			if (typeof kind !== 'undefined' && kind !== "") {
        column += 'kind,';
        values += "'" + kind + "',";
      }		
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }		
			
			if (typeof timing_timing !== 'undefined' && timing_timing !== "") {
        column += 'timing_timing,';
        values += "'" + timing_timing + "',";
      }		
			
			if (typeof timing_date_time !== 'undefined' && timing_date_time !== "") {
        column += 'timing_date_time,';
				values += "to_date('"+ timing_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof timing_period_start !== 'undefined' && timing_period_start !== "") {
        column += 'timing_period_start,';
				values += "to_date('"+ timing_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof timing_period_end !== 'undefined' && timing_period_end !== "") {
        column += 'timing_period_end,';
				values += "to_date('"+ timing_period_end + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof timing_range_low !== 'undefined' && timing_range_low !== "") {
        column += 'timing_range_low,';
        values += " " + timing_range_low + ",";
      }		
			
			if (typeof timing_range_high !== 'undefined' && timing_range_high !== "") {
        column += 'timing_range_high,';
        values += " " + timing_range_high + ",";
      }
			
			if (typeof location !== 'undefined' && location !== "") {
        column += 'location,';
        values += "'" + location + "',";
      }		
			
			if (typeof product_reference_medication !== 'undefined' && product_reference_medication !== "") {
        column += 'product_reference_medication,';
        values += "'" + product_reference_medication + "',";
      }		
			
			if (typeof product_reference_substance !== 'undefined' && product_reference_substance !== "") {
        column += 'product_reference_substance,';
        values += "'" + product_reference_substance + "',";
      }		
			
			if (typeof product_codeable_concept !== 'undefined' && product_codeable_concept !== "") {
        column += 'product_codeable_concept,';
        values += "'" + product_codeable_concept + "',";
      }	
			
			if (typeof quantity !== 'undefined' && quantity !== "") {
        column += 'quantity,';
        values += " " + quantity + ",";
      }
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
      }
			
			if (typeof transform !== 'undefined' && transform !== "") {
        column += 'transform,';
        values += "'" + transform + "',";
      }
			
			if (typeof communication_id !== 'undefined' && communication_id !== "") {
        column += 'communication_id,';
        values += "'" + communication_id + "',";
      }
			
			if (typeof device_request_id !== 'undefined' && device_request_id !== "") {
        column += 'device_request_id,';
        values += "'" + device_request_id + "',";
      }
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }
			
			if (typeof medication_request_id !== 'undefined' && medication_request_id !== "") {
        column += 'medication_request_id,';
        values += "'" + medication_request_id + "',";
      }
			
			if (typeof message_definition_id !== 'undefined' && message_definition_id !== "") {
        column += 'message_definition_id,';
        values += "'" + message_definition_id + "',";
      }
			
			if (typeof procedure_id !== 'undefined' && procedure_id !== "") {
        column += 'procedure_id,';
        values += "'" + procedure_id + "',";
      }
			
			if (typeof procedure_request_id !== 'undefined' && procedure_request_id !== "") {
        column += 'procedure_request_id,';
        values += "'" + procedure_request_id + "',";
      }
			
			if (typeof referral_request_id !== 'undefined' && referral_request_id !== "") {
        column += 'referral_request_id,';
        values += "'" + referral_request_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "activity_definition_id = '" + activity_definition_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.activity_definition(activity_definition_id," + column.slice(0, -1) + ") SELECT activity_definition_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.activity_definition WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select activity_definition_id from BACIRO_FHIR.activity_definition WHERE activity_definition_id = '" + activity_definition_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateActivityDefinition"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateActivityDefinition"});
      });
    },
		activityDefinitionParticipant: function updateActivityDefinitionParticipant(req, res) {
			console.log(req.body);
			var participant_id  = req.params.participant_id;
			var type  = req.body.type;
			var role  = req.body.role;
			var activity_definition_id  = req.body.activity_definition_id;
			
			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof role !== 'undefined' && role !== "") {
        column += 'role,';
        values += " '" + role + "',";
      }
			
			if (typeof activity_definition_id !== 'undefined' && activity_definition_id !== "") {
        column += 'activity_definition_id,';
        values += "'" + activity_definition_id + "',";
      }	
      
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "participant_id = '" + participant_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.activity_definition_participant(participant_id," + column.slice(0, -1) + ") SELECT participant_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.activity_definition_participant WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select participant_id from BACIRO_FHIR.activity_definition_participant WHERE participant_id = '" + participant_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateActivityDefinitionParticipant"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateActivityDefinitionParticipant"});
      });
    },
		activityDefinitionDynamicValue: function updateActivityDefinitionDynamicValue(req, res) {
			console.log(req.body);
			var dynamic_value_id  = req.params.dynamic_value_id;
			var description  = req.body.description;
			var path  = req.body.path;
			var language  = req.body.language;
			var expression  = req.body.expression;
			var activity_definition_id   = req.body.activity_definition_id;
			
			var column = "";
      var values = "";
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }
			
			if (typeof path !== 'undefined' && path !== "") {
        column += 'path,';
        values += " '" + path + "',";
      }
			
			if (typeof language !== 'undefined' && language !== "") {
        column += 'language,';
        values += "'" + language + "',";
      }
			
			if (typeof expression !== 'undefined' && expression !== "") {
        column += 'expression,';
        values += "'" + expression + "',";
      }	
			
			if (typeof activity_definition_id !== 'undefined' && activity_definition_id !== "") {
        column += 'activity_definition_id,';
        values += "'" + activity_definition_id + "',";
      }	
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "dynamic_value_id = '" + dynamic_value_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.activity_definition_dynamic_value(dynamic_value_id," + column.slice(0, -1) + ") SELECT dynamic_value_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.activity_definition_dynamic_value WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select dynamic_value_id from BACIRO_FHIR.activity_definition_dynamic_value WHERE dynamic_value_id = '" + dynamic_value_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateActivityDefinitionDynamicValue"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateActivityDefinitionDynamicValue"});
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