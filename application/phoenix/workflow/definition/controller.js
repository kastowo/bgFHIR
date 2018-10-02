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
		definition: function getDefinition(req, res){
			var apikey = req.params.apikey;
			var definitionId = req.query._id;
			
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
			
			if(typeof definitionId !== 'undefined' && definitionId !== ""){
        condition += "dr.diagnostic_report_id = '" + definitionId + "' AND,";  
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

			var arrDefinition = [];
      var query = "select def.definition_id as definition_id, def.url as url, def.identifier as identifier, def.version as version, def.title as title, def.definition as definition, def.part_of as part_of, def.replaces as replaces, def.status as status, def.experimental as experimental, def.subject_codeable_concept as subject_codeable_concept, def.subject_reference as subject_reference, def.date as date, def.publisher_practitioner as publisher_practitioner, def.publisher_organization as publisher_organization, def.jurisdiction as jurisdiction, def.description as description, def.purpose as purpose, def.copyright as copyright, def.approve_date as approve_date, def.last_review_date as last_review_date, def.effective_period_start as effective_period_start, def.effective_period_end as effective_period_end, def.performer_type as performer_type from BACIRO_FHIR.definition def " + fixCondition;
			//console.log(query);			
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Definition = {};
					Definition.resourceType = "Definition";
          Definition.id = rez[i].definition_id;
					Definition.url = rez[i].url;
					Definition.identifier = rez[i].identifier;
					Definition.version = rez[i].version;
					Definition.title = rez[i].title;
					if (rez[i].definition !== 'null') {
						Definition.definition = hostFHIR + ':' + portFHIR + '/' + apikey + '/Definition?_id=' +  rez[i].definition;
					} else {
						Definition.definition = "";
					}
					if (rez[i].part_of !== 'null') {
						Definition.partOf = hostFHIR + ':' + portFHIR + '/' + apikey + '/Definition?_id=' +  rez[i].part_of;
					} else {
						Definition.partOf = "";
					}
					if (rez[i].replaces !== 'null') {
						Definition.replaces = hostFHIR + ':' + portFHIR + '/' + apikey + '/Definition?_id=' +  rez[i].replaces;
					} else {
						Definition.replaces = "";
					}
					Definition.status = rez[i].status;
					Definition.experimental = rez[i].experimental;
					Definition.subject.subjectCodeableConcept = rez[i].subject_codeable_concept;
					if (rez[i].subject_reference !== 'null') {
						Definition.subject.subjectReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Group?_id=' +  rez[i].subject_reference;
					} else {
						Definition.subject.subjectReference = "";
					}
					if(rez[i].date == null){
						Definition.date = formatDate(rez[i].date);
					}else{
						Definition.date = rez[i].date;
					}
					var arrPublisher = [];
					var Publisher = {};
					if(rez[i].publisher_practitioner != "null"){
						Publisher.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].publisher_practitioner;
					} else {
						Publisher.practitioner = "";
					}
					if(rez[i].publisher_organization != "null"){
						Publisher.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].publisher_organization;
					} else {
						Publisher.organization = "";
					}
					arrPublisher[i] = Publisher;
					Definition.publisher = arrPublisher;
					Definition.jurisdiction = rez[i].jurisdiction;
					Definition.description = rez[i].description;
					Definition.purpose = rez[i].purpose;
					Definition.copyright = rez[i].copyright;
					if(rez[i].approval_date == null){
						Definition.approvalDate = formatDate(rez[i].approval_date);
					}else{
						Definition.approvalDate = rez[i].approval_date;
					}
					if(rez[i].last_review_date == null){
						Definition.lastReviewDate = formatDate(rez[i].last_review_date);
					}else{
						Definition.lastReviewDate = rez[i].last_review_date;
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
					Definition.effectivePeriod = effectiveperiod_start + ' to ' + effectiveperiod_end;
					Definition.performer_type = rez[i].performer_type;
					
          arrDefinition[i] = Definition;
        }
        res.json({"err_code":0,"data": arrDefinition});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getDefinition"});
      });
    },
		definitionContactDetail: function getDefinitionContactDetail(req, res) {
			var apikey = req.params.apikey;
			
			var definitionContactDetailId = req.query._id;
			var definitionId = req.query.definition_id;

			//susun query
			var condition = "";

			if (typeof definitionContactDetailId !== 'undefined' && definitionContactDetailId !== "") {
				condition += "contact_detail_id = '" + definitionContactDetailId + "' AND ";
			}

			if (typeof definitionId !== 'undefined' && definitionId !== "") {
				condition += "definition_id = '" + definitionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrDefinitionContactDetail = [];
			var query = "select contact_detail_id, name from BACIRO_FHIR.contact_detail " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var DefinitionContactDetail = {};
					DefinitionContactDetail.id = rez[i].participant_id;
					DefinitionContactDetail.name = rez[i].name;
					arrDefinitionContactDetail[i] = DefinitionContactDetail;
				}
				res.json({
					"err_code": 0,
					"data": arrDefinitionContactDetail
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getDefinitionContactDetail"
				});
			});
		},
		definitionUsageContext: function getDefinitionUsageContext(req, res) {
			var apikey = req.params.apikey;
			
			var definitionUsageContextId = req.query._id;
			var definitionId = req.query.definition_id;

			//susun query
			var condition = "";

			if (typeof definitionUsageContextId !== 'undefined' && definitionUsageContextId !== "") {
				condition += "usage_context_id = '" + definitionUsageContextId + "' AND ";
			}

			if (typeof definitionId !== 'undefined' && definitionId !== "") {
				condition += "definition_id = '" + definitionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrDefinitionUsageContext = [];
			var query = "select usage_context_id, code, value_codeable_concept, value_quantity_value, value_quantity_comparator, value_quantity_unit, value_quantity_system, value_quantity_code, value_range_low, value_range_high from BACIRO_FHIR.usage_context " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var DefinitionUsageContext = {};
					DefinitionUsageContext.id = rez[i].usage_context_id;
					DefinitionUsageContext.code = rez[i].code;
					DefinitionUsageContext.value.valueCodeableConcept = rez[i].value_codeable_concept;
					DefinitionUsageContext.value.valueQuantity.value = rez[i].value_quantity_value;
					DefinitionUsageContext.value.valueQuantity.comparator = rez[i].value_quantity_comparator;
					DefinitionUsageContext.value.valueQuantity.unit = rez[i].value_quantity_unit;
					DefinitionUsageContext.value.valueQuantity.system = rez[i].value_quantity_system;
					DefinitionUsageContext.value.valueQuantity.code = rez[i].value_quantity_code;
					DefinitionUsageContext.value.valueRange = rez[i].value_range_low + ' to ' +  rez[i].value_range_high;
					
					arrDefinitionUsageContext[i] = DefinitionUsageContext;
				}
				res.json({
					"err_code": 0,
					"data": arrDefinitionUsageContext
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getDefinitionUsageContext"
				});
			});
		},
  },
	post: {
		definition: function addDefinition(req, res) {
			console.log(req.body);
			var definition_id  = req.body.activity_definition_id;
			var url  = req.body.activity_definition_id;
			var identifier  = req.body.activity_definition_id;
			var version  = req.body.activity_definition_id;
			var title  = req.body.activity_definition_id;
			var definition  = req.body.activity_definition_id;
			var part_of  = req.body.activity_definition_id;
			var replaces  = req.body.activity_definition_id;
			var status  = req.body.activity_definition_id;
			var experimental  = req.body.activity_definition_id;
			var subject_codeable_concept  = req.body.activity_definition_id;
			var subject_reference  = req.body.activity_definition_id;
			var date  = req.body.activity_definition_id;
			var publisher_practitioner  = req.body.activity_definition_id;
			var publisher_organization  = req.body.activity_definition_id;
			var jurisdiction  = req.body.activity_definition_id;
			var description  = req.body.activity_definition_id;
			var purpose  = req.body.activity_definition_id;
			var copyright  = req.body.activity_definition_id;
			var approve_date  = req.body.activity_definition_id;
			var last_review_date  = req.body.activity_definition_id;
			var effective_period_start  = req.body.activity_definition_id;
			var effective_period_end  = req.body.activity_definition_id;
			var performer_type  = req.body.activity_definition_id;
			var request_id  = req.body.activity_definition_id;
			var event_id  = req.body.activity_definition_id;
			
			var column = "";
      var values = "";
			
				
			if (typeof url !== 'undefined' && url !== "") {
        column += 'url,';
        values += "'" + url + "',";
      }
			
			if (typeof identifier !== 'undefined' && identifier !== "") {
        column += 'identifier,';
        values += "'" + identifier + "',";
      }
			
			if (typeof version !== 'undefined' && version !== "") {
        column += 'version,';
        values += "'" + version + "',";
      }	
			
			if (typeof title !== 'undefined' && title !== "") {
        column += 'title,';
        values += "'" + title + "',";
      }	
			
			if (typeof definition !== 'undefined' && definition !== "") {
        column += 'definition,';
        values += "'" + definition + "',";
      }	
			
			if (typeof part_of !== 'undefined' && part_of !== "") {
        column += 'part_of,';
        values += "'" + part_of + "',";
      }	
			
			if (typeof replaces !== 'undefined' && replaces !== "") {
        column += 'replaces,';
        values += "'" + replaces + "',";
      }	
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }		
			
			if (typeof experimental !== 'undefined' && experimental !== "") {
        column += 'experimental,';
        values += " " + experimental + ",";
      }	
			
			if (typeof subject_codeable_concept !== 'undefined' && subject_codeable_concept !== "") {
        column += 'subject_codeable_concept,';
        values += "'" + subject_codeable_concept + "',";
      }		
			
			if (typeof subject_reference !== 'undefined' && subject_reference !== "") {
        column += 'subject_reference,';
        values += "'" + subject_reference + "',";
      }		
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof publisher_practitioner !== 'undefined' && publisher_practitioner !== "") {
        column += 'publisher_practitioner,';
        values += "'" + publisher_practitioner + "',";
      }
			
			if (typeof publisher_organization !== 'undefined' && publisher_organization !== "") {
        column += 'publisher_organization,';
        values += "'" + publisher_organization + "',";
      }
			
			if (typeof jurisdiction !== 'undefined' && jurisdiction !== "") {
        column += 'jurisdiction,';
        values += "'" + jurisdiction + "',";
      }		
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof purpose !== 'undefined' && purpose !== "") {
        column += 'purpose,';
        values += "'" + purpose + "',";
      }	
			
			if (typeof copyright !== 'undefined' && copyright !== "") {
        column += 'copyright,';
        values += "'" + copyright + "',";
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
			
			if (typeof performer_type !== 'undefined' && performer_type !== "") {
        column += 'performer_type,';
        values += "'" + performer_type + "',";
      }		
			
			if (typeof request_id !== 'undefined' && request_id !== "") {
        column += 'request_id,';
        values += "'" + request_id + "',";
      }
			
			if (typeof event_id !== 'undefined' && event_id !== "") {
        column += 'event_id,';
        values += "'" + event_id + "',";
      }
			
			
      var query = "UPSERT INTO BACIRO_FHIR.definition(definition_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+definition_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select definition_id from BACIRO_FHIR.definition WHERE definition_id = '" + definition_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDefinition"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDefinition"});
      });
    },
		definitionContactDetail: function addDefinitionContactDetail(req, res) {
			console.log(req.body);
			var contact_detail_id  = req.params.contact_detail_id;
			var name  = req.body.name;
			var definition_id  = req.body.definition_id;
			
			var column = "";
      var values = "";
			
			if (typeof name !== 'undefined' && name !== "") {
        column += 'name,';
        values += "'" + name + "',";
      }
			if (typeof definition_id !== 'undefined' && definition_id !== "") {
        column += 'definition_id,';
        values += "'" + definition_id + "',";
      }		

      var query = "UPSERT INTO BACIRO_FHIR.contact_detail(contact_detail_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+contact_detail_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select contact_detail_id from BACIRO_FHIR.contact_detail WHERE contact_detail_id = '" + contact_detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDefinitionContactDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDefinitionContactDetail"});
      });
    },
		definitionUsageContext: function addDefinitionUsageContext(req, res) {
			console.log(req.body);
			var usage_context_id  = req.body.usage_context_id;
			var code  = req.body.code;
			var value_codeable_concept  = req.body.value_codeable_concept;
			var value_quantity_value  = req.body.value_quantity_value;
			var value_quantity_comparator  = req.body.value_quantity_comparator;
			var value_quantity_unit  = req.body.value_quantity_unit;
			var value_quantity_system  = req.body.value_quantity_system;
			var value_quantity_code  = req.body.value_quantity_code;
			var value_range_low  = req.body.value_range_low;
			var value_range_high  = req.body.value_range_high;
			var definition_id  = req.body.definition_id;
			
			var column = "";
      var values = "";
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }
			
			if (typeof value_codeable_concept !== 'undefined' && value_codeable_concept !== "") {
        column += 'value_codeable_concept,';
        values += " '" + value_codeable_concept + "',";
      }
			
			if (typeof value_quantity_value !== 'undefined' && value_quantity_value !== "") {
        column += 'value_quantity_value,';
        values += " " + value_quantity_value + ",";
      }
			
			if (typeof value_quantity_comparator !== 'undefined' && value_quantity_comparator !== "") {
        column += 'value_quantity_comparator,';
        values += "'" + value_quantity_comparator + "',";
      }
			
			if (typeof value_quantity_unit !== 'undefined' && value_quantity_unit !== "") {
        column += 'value_quantity_unit,';
        values += "'" + value_quantity_unit + "',";
      }	
			
			if (typeof value_quantity_system !== 'undefined' && value_quantity_system !== "") {
        column += 'value_quantity_system,';
        values += "'" + value_quantity_system + "',";
      }	
			
			if (typeof value_quantity_code !== 'undefined' && value_quantity_code !== "") {
        column += 'value_quantity_code,';
        values += "'" + value_quantity_code + "',";
      }	
			
			if (typeof value_range_low !== 'undefined' && value_range_low !== "") {
        column += 'value_range_low,';
        values += " " + value_range_low + ",";
      }	
			
			if (typeof value_range_high !== 'undefined' && value_range_high !== "") {
        column += 'value_range_high,';
        values += " " + value_range_high + ",";
      }	
			
			if (typeof definition_id !== 'undefined' && definition_id !== "") {
        column += 'definition_id,';
        values += "'" + definition_id + "',";
      }	
			
			
      var query = "UPSERT INTO BACIRO_FHIR.usage_context(usage_context_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+usage_context_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select usage_context_id from BACIRO_FHIR.usage_context WHERE usage_context_id = '" + usage_context_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDefinitionUsageContext"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addDefinitionUsageContext"});
      });
    },
	},
	put: {
		definition: function updateDefinition(req, res) {
			console.log(req.body);
			var definition_id  = req.params.definition_id;
			var url  = req.body.url;
			var identifier  = req.body.identifier;
			var version  = req.body.version;
			var title  = req.body.title;
			var definition  = req.body.definition;
			var part_of  = req.body.part_of;
			var replaces  = req.body.replaces;
			var status  = req.body.status;
			var experimental  = req.body.experimental;
			var subject_codeable_concept  = req.body.subject_codeable_concept;
			var subject_reference  = req.body.subject_reference;
			var date  = req.body.date;
			var publisher_practitioner  = req.body.publisher_practitioner;
			var publisher_organization  = req.body.publisher_organization;
			var jurisdiction  = req.body.jurisdiction;
			var description  = req.body.description;
			var purpose  = req.body.purpose;
			var copyright  = req.body.copyright;
			var approve_date  = req.body.approve_date;
			var last_review_date  = req.body.last_review_date;
			var effective_period_start  = req.body.effective_period_start;
			var effective_period_end  = req.body.effective_period_end;
			var performer_type  = req.body.performer_type;
			var request_id  = req.body.request_id;
			var event_id  = req.body.event_id;
			
			var column = "";
      var values = "";
			
				
			if (typeof url !== 'undefined' && url !== "") {
        column += 'url,';
        values += "'" + url + "',";
      }
			
			if (typeof identifier !== 'undefined' && identifier !== "") {
        column += 'identifier,';
        values += "'" + identifier + "',";
      }
			
			if (typeof version !== 'undefined' && version !== "") {
        column += 'version,';
        values += "'" + version + "',";
      }	
			
			if (typeof title !== 'undefined' && title !== "") {
        column += 'title,';
        values += "'" + title + "',";
      }	
			
			if (typeof definition !== 'undefined' && definition !== "") {
        column += 'definition,';
        values += "'" + definition + "',";
      }	
			
			if (typeof part_of !== 'undefined' && part_of !== "") {
        column += 'part_of,';
        values += "'" + part_of + "',";
      }	
			
			if (typeof replaces !== 'undefined' && replaces !== "") {
        column += 'replaces,';
        values += "'" + replaces + "',";
      }	
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }		
			
			if (typeof experimental !== 'undefined' && experimental !== "") {
        column += 'experimental,';
        values += " " + experimental + ",";
      }	
			
			if (typeof subject_codeable_concept !== 'undefined' && subject_codeable_concept !== "") {
        column += 'subject_codeable_concept,';
        values += "'" + subject_codeable_concept + "',";
      }		
			
			if (typeof subject_reference !== 'undefined' && subject_reference !== "") {
        column += 'subject_reference,';
        values += "'" + subject_reference + "',";
      }		
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof publisher_practitioner !== 'undefined' && publisher_practitioner !== "") {
        column += 'publisher_practitioner,';
        values += "'" + publisher_practitioner + "',";
      }
			
			if (typeof publisher_organization !== 'undefined' && publisher_organization !== "") {
        column += 'publisher_organization,';
        values += "'" + publisher_organization + "',";
      }
			
			if (typeof jurisdiction !== 'undefined' && jurisdiction !== "") {
        column += 'jurisdiction,';
        values += "'" + jurisdiction + "',";
      }		
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof purpose !== 'undefined' && purpose !== "") {
        column += 'purpose,';
        values += "'" + purpose + "',";
      }	
			
			if (typeof copyright !== 'undefined' && copyright !== "") {
        column += 'copyright,';
        values += "'" + copyright + "',";
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
			
			if (typeof performer_type !== 'undefined' && performer_type !== "") {
        column += 'performer_type,';
        values += "'" + performer_type + "',";
      }		
			
			if (typeof request_id !== 'undefined' && request_id !== "") {
        column += 'request_id,';
        values += "'" + request_id + "',";
      }
			
			if (typeof event_id !== 'undefined' && event_id !== "") {
        column += 'event_id,';
        values += "'" + event_id + "',";
      }
			
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "definition_id = '" + definition_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.definition(definition_id," + column.slice(0, -1) + ") SELECT definition_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.definition WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select definition_id from BACIRO_FHIR.definition WHERE definition_id = '" + definition_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDefinition"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDefinition"});
      });
    },
		definitionContactDetail: function updateDefinitionContactDetail(req, res) {
			console.log(req.body);
			var contact_detail_id  = req.params.contact_detail_id;
			var name  = req.body.name;
			var definition_id  = req.body.definition_id;
			
			var column = "";
      var values = "";
			
			if (typeof name !== 'undefined' && name !== "") {
        column += 'name,';
        values += "'" + name + "',";
      }
			if (typeof definition_id !== 'undefined' && definition_id !== "") {
        column += 'definition_id,';
        values += "'" + definition_id + "',";
      }	
      
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "contact_detail_id = '" + contact_detail_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.contact_detail(contact_detail_id," + column.slice(0, -1) + ") SELECT contact_detail_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.contact_detail WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select contact_detail_id from BACIRO_FHIR.contact_detail WHERE contact_detail_id = '" + contact_detail_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDefinitionContactDetail"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDefinitionContactDetail"});
      });
    },
		definitionUsageContext: function updateDefinitionUsageContext(req, res) {
			console.log(req.body);
			var usage_context_id  = req.params.usage_context_id;
			var code  = req.body.code;
			var value_codeable_concept  = req.body.value_codeable_concept;
			var value_quantity_value  = req.body.value_quantity_value;
			var value_quantity_comparator  = req.body.value_quantity_comparator;
			var value_quantity_unit  = req.body.value_quantity_unit;
			var value_quantity_system  = req.body.value_quantity_system;
			var value_quantity_code  = req.body.value_quantity_code;
			var value_range_low  = req.body.value_range_low;
			var value_range_high  = req.body.value_range_high;
			var definition_id  = req.body.definition_id;
			
			var column = "";
      var values = "";
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }
			
			if (typeof value_codeable_concept !== 'undefined' && value_codeable_concept !== "") {
        column += 'value_codeable_concept,';
        values += " '" + value_codeable_concept + "',";
      }
			
			if (typeof value_quantity_value !== 'undefined' && value_quantity_value !== "") {
        column += 'value_quantity_value,';
        values += " " + value_quantity_value + ",";
      }
			
			if (typeof value_quantity_comparator !== 'undefined' && value_quantity_comparator !== "") {
        column += 'value_quantity_comparator,';
        values += "'" + value_quantity_comparator + "',";
      }
			
			if (typeof value_quantity_unit !== 'undefined' && value_quantity_unit !== "") {
        column += 'value_quantity_unit,';
        values += "'" + value_quantity_unit + "',";
      }	
			
			if (typeof value_quantity_system !== 'undefined' && value_quantity_system !== "") {
        column += 'value_quantity_system,';
        values += "'" + value_quantity_system + "',";
      }	
			
			if (typeof value_quantity_code !== 'undefined' && value_quantity_code !== "") {
        column += 'value_quantity_code,';
        values += "'" + value_quantity_code + "',";
      }	
			
			if (typeof value_range_low !== 'undefined' && value_range_low !== "") {
        column += 'value_range_low,';
        values += " " + value_range_low + ",";
      }	
			
			if (typeof value_range_high !== 'undefined' && value_range_high !== "") {
        column += 'value_range_high,';
        values += " " + value_range_high + ",";
      }	
			
			if (typeof definition_id !== 'undefined' && definition_id !== "") {
        column += 'definition_id,';
        values += "'" + definition_id + "',";
      }	
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "usage_context_id = '" + usage_context_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.usage_context(usage_context_id," + column.slice(0, -1) + ") SELECT usage_context_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.usage_context WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select usage_context_id from BACIRO_FHIR.usage_context WHERE usage_context_id = '" + usage_context_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDefinitionUsageContext"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateDefinitionUsageContext"});
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