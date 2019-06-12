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
		observation: function getObservation(req, res){
			var apikey = req.params.apikey;
			var observationId = req.query._id;
			
			var based_on  = req.body.based_on;
			var category  = req.body.category;
			var code  = req.body.code;
			/*var code_value_concept  = req.body.code_value_concept;
			var code_value_date  = req.body.code_value_date;
			var code_value_quantity  = req.body.code_value_quantity;
			var code_value_string  = req.body.code_value_string;*/
			var combo_code  = req.body.combo_code;
			var combo_code_value_concept  = req.body.combo_code_value_concept;
			var combo_code_value_quantity  = req.body.combo_code_value_quantity;
			var combo_data_absent_reason  = req.body.combo_data_absent_reason;
			var combo_value_concept  = req.body.combo_value_concept;
			var combo_value_quantity  = req.body.combo_value_quantity;
			var component_code  = req.body.component_code;
			var component_code_value_concept  = req.body.component_code_value_concept;
			var component_code_value_quantity  = req.body.component_code_value_quantity;
			var component_data_absent_reason  = req.body.component_data_absent_reason;
			var component_value_concept  = req.body.component_value_concept;
			var component_value_quantity  = req.body.component_value_quantity;
			var context  = req.body.context;
			var data_absent_reason  = req.body.data_absent_reason;
			var date  = req.body.date;
			var device  = req.body.device;
			var encounter  = req.body.encounter;
			var identifier  = req.body.identifier;
			var method  = req.body.method;
			var patient  = req.body.patient;
			var performer  = req.body.performer;
			var related  = req.body.related;
			var related_target  = req.body.related_target;
			var related_type  = req.body.related_type;
			var specimen  = req.body.specimen;
			var status  = req.body.status;
			var subject  = req.body.subject;
			var value_concept  = req.body.value_concept;
			var value_date  = req.body.value_date;
			var value_quantity  = req.body.value_quantity;
			var value_string  = req.body.value_string;
			
			
	
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof observationId !== 'undefined' && observationId !== ""){
        condition += "obs.observation_id = '" + observationId + "' AND,";  
      }
			
			if(typeof based_on !== 'undefined' && based_on !== ""){ 
			 var res = based_on.substring(0, 3);
				if(res == 'cap'){
					join += " LEFT JOIN BACIRO_FHIR.CAREPLAN cap ON obs.observation_id = cap.observation_id ";
          condition += "cap.CAREPLAN_ID = '" + based_on + "' AND ";       
				} 
				if(res == 'rre') {
					join += " LEFT JOIN BACIRO_FHIR.REFERRAL_REQUEST rre ON obs.observation_id = rr.observation_id ";
          condition += "rre.REFERRAL_REQUEST_ID = '" + based_on + "' AND ";       
				}
				if(res == 'mre'){
					join += " LEFT JOIN BACIRO_FHIR.MEDICATION_REQUEST mre ON obs.observation_id = cap.observation_id ";
          condition += "mre.MEDICATION_REQUEST_ID = '" + based_on + "' AND ";       
				}
				if(res == 'nor') {
					join += " LEFT JOIN BACIRO_FHIR.NUTRITION_ORDER nor ON obs.observation_id = nor.observation_id ";
          condition += "nor.NUTRITION_ORDER_ID = '" + based_on + "' AND ";       
				}
				if(res == 'pre'){
					join += " LEFT JOIN BACIRO_FHIR.PROCEDURE_REQUEST pre ON obs.observation_id = pre.observation_id ";
          condition += "pre.PROCEDURE_REQUEST_ID = '" + based_on + "' AND ";       
				} 
				if(res == 'dre') {
					join += " LEFT JOIN BACIRO_FHIR.DEVICE_REQUEST dre ON obs.observation_id = dre.observation_id ";
          condition += "dre.DEVICE_REQUEST_ID = '" + based_on + "' AND ";       
				}
				if(res == 'ire') {
					join += " LEFT JOIN BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION ire ON obs.observation_id = ire.observation_id ";
          condition += "ire.IMMUNIZATION_RECOMMENDATION_ID = '" + based_on + "' AND ";       
				}
      }
			
			if(typeof category !== 'undefined' && category !== ""){
				condition += "obs.category = '" + category + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
				condition += "obs.CODE = '" + code + "' AND,";  
      }
			
			if((typeof combo_code !== 'undefined' && combo_code !== "") || 
				(typeof combo_code_value_concept !== 'undefined' && combo_code_value_concept !== "") || (typeof combo_code_value_quantity !== 'undefined' && combo_code_value_quantity !== "") || (typeof combo_data_absent_reason !== 'undefined' && combo_data_absent_reason !== "") || (typeof combo_value_concept !== 'undefined' && combo_value_concept !== "") || (typeof combo_value_quantity !== 'undefined' && combo_value_quantity !== "") || (typeof component_code !== 'undefined' && component_code !== "") || (typeof component_code_value_concept !== 'undefined' && component_code_value_concept !== "") || (typeof component_code_value_quantity !== 'undefined' && component_code_value_quantity !== "") || (typeof component_data_absent_reason !== 'undefined' && component_data_absent_reason !== "") || (typeof component_value_concept !== 'undefined' && component_value_concept !== "") || (typeof component_value_quantity !== 'undefined' && component_value_quantity !== "")){
				
        join += " LEFT JOIN BACIRO_FHIR.OBSERVATION_COMPONENT obc ON obs.observation_id = obc.observation_id ";
				
        
				if(typeof combo_code !== 'undefined' && combo_code !== ""){
					condition += "(obs.code = '" + combo_code + "' OR obc.code = '" + combo_code + "') AND,";
				}

				if(typeof combo_code_value_concept !== 'undefined' && combo_code_value_concept !== ""){
					condition += "(obs.code = '" + combo_code_value_concept + "' OR obc.code = '" + combo_code_value_concept + "' OR obs.VALUE_CODEABLE_CONCEPT = '" + combo_code_value_concept + "' OR obc.VALUE_CODEABLE_CONCEPT = '" + combo_code_value_concept + "') AND,";
				}

				if(typeof combo_code_value_quantity !== 'undefined' && combo_code_value_quantity !== ""){
					condition += "(obs.code = '" + combo_code_value_quantity + "' OR obc.code = '" + combo_code_value_quantity + "' OR obs.VALUE_QUANTITY = " + combo_code_value_quantity + " OR obc.VALUE_QUANTITY = " + combo_code_value_quantity + ") AND,";
				}

				if(typeof combo_data_absent_reason !== 'undefined' && combo_data_absent_reason !== ""){
					condition += "(obs.DATA_ABSENT_REASON = '" + combo_data_absent_reason + "' OR obc.DATA_ABSENT_REASON = '" + combo_data_absent_reason + "') AND,";
				}

				if(typeof combo_value_concept !== 'undefined' && combo_value_concept !== ""){
					condition += "(obs.VALUE_CODEABLE_CONCEPT = '" + combo_value_concept + "' OR obc.VALUE_CODEABLE_CONCEPT = '" + combo_value_concept + "') AND,";
				}

				if(typeof combo_value_quantity !== 'undefined' && combo_value_quantity !== ""){
					condition += "(obs.VALUE_QUANTITY = " + combo_value_quantity + " OR obc.VALUE_QUANTITY = " + combo_value_quantity + ") AND,";
				}

				if(typeof component_code !== 'undefined' && component_code !== ""){
					condition += "obc.CODE = '" + component_code + "' AND,";  
				}

				if(typeof component_code_value_concept !== 'undefined' && component_code_value_concept !== ""){
					condition += "(obc.code = '" + component_code_value_concept + "' OR obc.VALUE_CODEABLE_CONCEPT = '" + component_code_value_concept + "') AND,";
				}

				if(typeof component_code_value_quantity !== 'undefined' && component_code_value_quantity !== ""){
					condition += "(obc.code = '" + component_code_value_quantity + "' OR obc.VALUE_QUANTITY = " + component_code_value_quantity + ") AND,";
				}

				if(typeof component_data_absent_reason !== 'undefined' && component_data_absent_reason !== ""){
					condition += "obc.DATA_ABSENT_REASON = '" + component_data_absent_reason + "' AND,";
				}

				if(typeof component_value_concept !== 'undefined' && component_value_concept !== ""){
					condition += "obc.VALUE_CODEABLE_CONCEPT = '" + component_value_concept + "' AND,";
				}

				if(typeof component_value_quantity !== 'undefined' && component_value_quantity !== ""){
					condition += "obc.VALUE_QUANTITY = " + component_value_quantity + " AND,";
				}				
      }
			
			
			if(typeof context !== 'undefined' && context !== ""){
				condition += "(obs.CONTEXT_ENCOUNTER = '" + context + "' OR obs.CONTEXT_EPISODE_OF_CARE = '" + context + "') AND,";  
			}
			
			if(typeof data_absent_reason !== 'undefined' && data_absent_reason !== ""){
				condition += "obs.DATA_ABSENT_REASON = '" + data_absent_reason + "' AND,";
			}
			
			if (typeof date !== 'undefined' && date !== "") {
        condition += "obs.effective_period_start <= to_date('" + date + "', 'yyyy-MM-dd') AND obs.effective_period_end >= to_date('" + date + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof device !== 'undefined' && device !== ""){
				condition += "(obs.DEVICE_DEVICE = '" + device + "' OR obs.DEVICE_DEVICE_METRIC = '" + device + "') AND,";
      }
			
			if(typeof encounter !== 'undefined' && encounter !== ""){
			  condition += "obs.CONTEXT_ENCOUNTER = '" + encounter + "' AND,";  
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.observation_id = obs.observation_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if((typeof method !== 'undefined' && method !== "")){
        condition += "obs.METHOD = '" + method + "' AND ";
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
			  condition += "obs.subject_patient = '" + patient + "' AND,";  
      }
			
			if(typeof performer !== 'undefined' && performer !== ""){ 
			 var res = performer.substring(0, 3);
				if(res == 'pra'){
					join += " LEFT JOIN BACIRO_FHIR.Practitioner pra ON obs.observation_id = pra.observation_id ";
          condition += "pra.Practitioner_ID = '" + performer + "' AND ";       
				}
				
				if(res == 'org'){
					join += " LEFT JOIN BACIRO_FHIR.Organization org ON obs.observation_id = org.observation_id ";
          condition += "org.Organization_ID = '" + performer + "' AND ";       
				}
				
				if(res == 'pat'){
					join += " LEFT JOIN BACIRO_FHIR.Patient pat ON obs.observation_id = pat.observation_id ";
          condition += "pat.Patient_ID = '" + performer + "' AND ";       
				}
				
				if(res == 'pra'){
					join += " LEFT JOIN BACIRO_FHIR.Related_Person pra ON obs.observation_id = pra.observation_id ";
          condition += "pra.Related_Person_ID = '" + performer + "' AND ";       
				}
				
      }
			
			if((typeof related !== 'undefined' && related !== "") || (typeof related_target !== 'undefined' && related_target !== "") || (typeof related_type !== 'undefined' && related_type !== "")){
        join += " LEFT JOIN BACIRO_FHIR.OBSERVATION_RELATED obr ON obs.observation_id = obr.observation_id ";
				
				if(typeof related !== 'undefined' && related !== ""){
					condition += "(obr.TYPE = '" + related + "' OR obr.TARGET_OBSERVATION = '" + related + "' OR obr.TARGET_QUESTIONNAIRE_RESPONSE = '" + related + "' OR obr.TARGET_SEQUENCE = '" + related + "') AND ";
				}
				
				if(typeof related_target !== 'undefined' && related_target !== ""){
					condition += "(obr.TARGET_OBSERVATION = '" + related_target + "' OR obr.TARGET_QUESTIONNAIRE_RESPONSE = '" + related_target + "' OR obr.TARGET_SEQUENCE = '" + related_target + "') AND ";
				}
				
				if(typeof related_type !== 'undefined' && related_type !== ""){
					condition += "obr.TYPE = '" + related_type + "' AND ";
				}
      }
			
			if((typeof specimen !== 'undefined' && specimen !== "")){
        join += " LEFT JOIN BACIRO_FHIR.Specimen spe ON spe.observation_id = obs.observation_id ";
        condition += "spe.specimen_id = '" + specimen + "' AND ";
      }
			
			if(typeof status !== 'undefined' && status !== ""){
				condition += "obs.status = '" + status + "' AND,";  
      }
			
			if(typeof subject !== 'undefined' && subject !== ""){
				condition += "(obs.SUBJECT_PATIENT = '" + subject + "' OR obs.SUBJECT_GROUP = '" + subject + "' OR obs.subject_device = '" + subject + "' OR obs.subject_location = '" + subject + "') AND,";  
			}
			
			if(typeof value_concept !== 'undefined' && value_concept !== ""){
				condition += "obs.VALUE_CODEABLE_CONCEPT = '" + value_concept + "' AND,";  
      }
			
			if(typeof value_date !== 'undefined' && value_date !== ""){
				condition += "(obs.VALUE_DATE_TIME == to_date('" + value_date + "', 'yyyy-MM-dd') OR (obs.VALUE_PERIOD_START <= to_date('" + value_date + "', 'yyyy-MM-dd') AND obs.VALUE_PERIOD_END >= to_date('" + value_date + "', 'yyyy-MM-dd')))AND,";
      }
			
			if(typeof value_quantity !== 'undefined' && value_quantity !== ""){
				condition += "obs.VALUE_QUANTITY = '" + value_quantity + "' AND,";  
      }
			
			if(typeof value_string !== 'undefined' && value_string !== ""){
				condition += "obs.VALUE_STRING = '" + value_string + "' AND,";  
      }
			
			var offset = req.query.offset;
			var limit = req.query.limit;

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " obs.observation_id > '" + offset + "' AND ";       
			}
			
			if((typeof limit !== 'undefined' && limit !== '')){
				limit = " limit " + limit + " ";
			} else {
				limit = " ";
			}
			
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			
      var arrObservation = [];
      var query = 'select obs.observation_id as observation_id, obs.status as status, obs.category as category, obs.code as code, obs.subject_patient as subject_patient, obs.subject_group as subject_group, obs.subject_device as subject_device, obs.subject_location as subject_location, obs.context_encounter as context_encounter, obs.context_episode_of_care as context_episode_of_care, obs.effective_date_time as effective_date_time, obs.effective_period_start as effective_period_start, obs.effective_period_end as effective_period_end, obs.issued as issued, obs.value_quantity as value_quantity, obs.value_codeable_concept as value_codeable_concept, obs.value_string as value_string, obs.value_boolean as value_boolean, obs.value_range_low as value_range_low, obs.value_range_high as value_range_high, obs.value_ratio_numerator as value_ratio_numerator, obs.value_ratio_denominator as value_ratio_denominator, obs.value_sampled_data as value_sampled_data, obs.value_attachment as value_attachment, obs.value_time as value_time, obs.value_date_time as value_date_time, obs.value_period_start as value_period_start, obs.value_period_end as value_period_end, obs.data_absent_reason as data_absent_reason, obs.interpretation as interpretation, obs."comment"  as comment, obs.body_site as body_site, obs.method as method, obs.specimen as specimen, obs.device_device as device_device, obs.device_device_metric as device_device_metric , sd.origin as origin, sd.period as period, sd.factor as factor, sd.lower_limit as lower_limit, sd.upper_limit as upper_limit, sd.dimensions as dimensions, sd.data as data from BACIRO_FHIR.observation obs  left join BACIRO_FHIR.sampled_data sd on obs.observation_id = sd.sampled_data_id ' + fixCondition + limit;
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Observation = {};
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
					if(rez[i].subject_device != "null"){
						Subject.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].subject_device;
					} else {
						Subject.device = "";
					}
					if(rez[i].subject_location != "null"){
						Subject.location = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].subject_location;
					} else {
						Subject.location = "";
					}
					var Content = {};
					if(rez[i].context_encounter != "null"){
						Content.encounter = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].context_encounter;
					} else {
						Content.encounter = "";
					}
					if(rez[i].context_episode_of_care != "null"){
						Content.episodeOfCare = hostFHIR + ':' + portFHIR + '/' + apikey + '/EpisodeOfCare?_id=' +  rez[i].context_episode_of_care;
					} else {
						Content.episodeOfCare = "";
					}
					var Device = {};
					if(rez[i].device_device != "null"){
						Device.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].device_device;
					} else {
						Device.device = "";
					}
					if(rez[i].device_device_metric != "null"){
						Device.deviceMetric = hostFHIR + ':' + portFHIR + '/' + apikey + '/DeviceMetric?_id=' +  rez[i].device_device_metric;
					} else {
						Device.deviceMetric = "";
					}
												
					Observation.resourceType = "Observation";
          Observation.id = rez[i].observation_id;
					Observation.status = rez[i].status;
					Observation.category = rez[i].category;
					Observation.code = rez[i].code;
					Observation.subject = Subject;
					Observation.context = Content;
					var Effective = {};
					if(rez[i].effective_date_time == null){
						Effective.effectiveDateTime = formatDate(rez[i].effective_date_time);
					}else{
						Effective.effectiveDateTime = rez[i].effective_date_time;
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
					Effective.effectivePeriod = effectiveperiod_start + ' to ' + effectiveperiod_end;
					Observation.effective = Effective;
					if(rez[i].issued == null){
						Observation.issued = formatDate(rez[i].issued);
					}else{
						Observation.issued = rez[i].issued;
					}
					var Value = {};
					Value.valueQuantity = rez[i].value_quantity;
					Value.valueCodeableConcept = rez[i].value_codeable_concept;
					Value.valueString = rez[i].value_string;
					Value.valueBoolean = rez[i].value_boolean;
					Value.valueRange = rez[i].value_range_low + ' to ' + rez[i].value_range_high;
					Value.valueRatio = rez[i].value_ratio_numerator + ' to ' + rez[i].value_ratio_denominator;
					var ObservationSampledData = {};
					ObservationSampledData.origin = rez[i].origin;
					ObservationSampledData.period = rez[i].period;
					ObservationSampledData.factor = rez[i].factor;
					ObservationSampledData.lower_limit = rez[i].lower_limit;
					ObservationSampledData.upper_limit = rez[i].upper_limit;
					ObservationSampledData.dimensions = rez[i].dimensions;
					ObservationSampledData.data = rez[i].data;
					Value.valueSampledData = ObservationSampledData;
					if(rez[i].value_attachment != "null"){
						Value.valueAttachment = hostFHIR + ':' + portFHIR + '/' + apikey + '/Attachment?_id=' +  rez[i].value_attachment;
					} else {
						Value.valueAttachment = "";
					}
					if(rez[i].value_time == null){
						Value.valueTime = formatDate(rez[i].value_time);
					}else{
						Value.valueTime = rez[i].value_time;
					}
					if(rez[i].value_date_time == null){
						Value.valueDateTime = formatDate(rez[i].value_date_time);
					}else{
						Value.valueDateTime = rez[i].value_date_time;
					}
					var valueperiod_start,valueperiod_end;
					if(rez[i].value_period_start == null){
						valueperiod_start = formatDate(rez[i].value_period_start);  
					}else{
						valueperiod_start = rez[i].value_period_start;  
					}
					if(rez[i].value_period_end == null){
						valueperiod_end = formatDate(rez[i].value_period_end);  
					}else{
						valueperiod_end = rez[i].value_period_end;  
					}
					Value.valuePeriod = valueperiod_start + ' to ' + valueperiod_end;
					Observation.value = Value;
					Observation.dataAbsentReason = rez[i].data_absent_reason;
					Observation.interpretation = rez[i].interpretation;
					Observation.comment = rez[i].comment;
					Observation.bodySite = rez[i].body_site;
					Observation.method = rez[i].method;
					Observation.specimen = rez[i].specimen;
					Observation.device = Device;
          arrObservation[i] = Observation;
        }
        res.json({"err_code":0,"data": arrObservation});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getObservation"});
      });
    },
		observationRelated: function getObservationRelated(req, res) {
			var apikey = req.params.apikey;
			
			var observationRelatedId = req.query._id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = "";

			if (typeof observationRelatedId !== 'undefined' && observationRelatedId !== "") {
				condition += "related_id = '" + observationRelatedId + "' AND ";
			}

			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrObservationRelated = [];
			var query = "select related_id, type, target_observation, target_questionnaire_response, target_sequence from BACIRO_FHIR.observation_related " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ObservationRelated = {};
					var arrTarget = [];
					var Target = {};
					if(rez[i].target_observation != "null"){
						Target.observation = hostFHIR + ':' + portFHIR + '/' + apikey + '/Observation?_id=' +  rez[i].target_observation;
					} else {
						Target.observation = "";
					}
					if(rez[i].target_questionnaire_response != "null"){
						Target.questionnaireResponse = hostFHIR + ':' + portFHIR + '/' + apikey + '/QuestionnaireResponse?_id=' +  rez[i].target_questionnaire_response;
					} else {
						Target.questionnaireResponse = "";
					}
					if(rez[i].target_sequence != "null"){
						Target.sequence = hostFHIR + ':' + portFHIR + '/' + apikey + '/Sequence?_id=' +  rez[i].target_sequence;
					} else {
						Target.sequence = "";
					}
					arrTarget[i] = Target;
												
					ObservationRelated.id = rez[i].related_id;
					ObservationRelated.type = rez[i].type;
					ObservationRelated.target = arrTarget;
					
					arrObservationRelated[i] = ObservationRelated;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationRelated
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationRelated"
				});
			});
		},
		observationComponent: function getObservationComponent(req, res) {
			var apikey = req.params.apikey;
			
			var observationComponentId = req.query._id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = "";

			if (typeof observationComponentId !== 'undefined' && observationComponentId !== "") {
				condition += "component_id = '" + observationComponentId + "' AND ";
			}

			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrObservationComponent = [];
			var query = "select obc.component_id as component_id, obc.code as code, obc.value_quantity as value_quantity, obc.value_codeable_concept as value_codeable_concept, obc.value_string as value_string, obc.value_range_low as value_range_low, obc.value_range_high as value_range_high, obc.value_ratio_numerator as value_ratio_numerator, obc.value_ratio_denominator as value_ratio_denominator, obc.value_sampled_data as value_sampled_data, obc.value_attachment as value_attachment, obc.value_time as value_time, obc.value_date_time as value_date_time, obc.value_period_start as value_period_start, obc.value_period_end as value_period_end, obc.data_absent_reason as data_absent_reason, obc.interpretation as interpretation, sd.origin as origin, sd.period as period, sd.factor as factor, sd.lower_limit as lower_limit, sd.upper_limit as upper_limit, sd.dimensions as dimensions, sd.data as data from BACIRO_FHIR.observation_component obc left join BACIRO_FHIR.sampled_data sd on obc.component_id = sd.sampled_data_id " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ObservationComponent = {};
					ObservationComponent.id = rez[i].component_id;
					ObservationComponent.code = rez[i].code;
					var Value= {};
					Value.valueQuantity = rez[i].value_quantity;
					Value.valueCodeableConcept = rez[i].value_codeable_concept;
					Value.valueString = rez[i].value_string;
					Value.valueBoolean = rez[i].value_boolean;
					Value.valueRange = rez[i].value_range_low + ' to ' + rez[i].value_range_high;
					Value.valueRatio = rez[i].value_ratio_numerator + ' to ' + rez[i].value_ratio_denominator;
					var ObservationSampledData = {};
					ObservationSampledData.origin = rez[i].origin;
					ObservationSampledData.period = rez[i].period;
					ObservationSampledData.factor = rez[i].factor;
					ObservationSampledData.lower_limit = rez[i].lower_limit;
					ObservationSampledData.upper_limit = rez[i].upper_limit;
					ObservationSampledData.dimensions = rez[i].dimensions;
					ObservationSampledData.data = rez[i].data;
					Value.valueSampledData = ObservationSampledData;
					if(rez[i].value_attachment != "null"){
						Value.valueAttachment = hostFHIR + ':' + portFHIR + '/' + apikey + '/Attachment?_id=' +  rez[i].value_attachment;
					} else {
						Value.valueAttachment = "";
					}
					if(rez[i].value_time == null){
						Value.valueTime = formatDate(rez[i].value_time);
					}else{
						Value.valueTime = rez[i].value_time;
					}
					if(rez[i].value_date_time == null){
						Value.valueDateTime = formatDate(rez[i].value_date_time);
					}else{
						Value.valueDateTime = rez[i].value_date_time;
					}
					var valueperiod_start,valueperiod_end;
					if(rez[i].value_period_start == null){
						valueperiod_start = formatDate(rez[i].value_period_start);  
					}else{
						valueperiod_start = rez[i].value_period_start;  
					}
					if(rez[i].value_period_end == null){
						valueperiod_end = formatDate(rez[i].value_period_end);  
					}else{
						valueperiod_end = rez[i].value_period_end;  
					}
					Value.valuePeriod = valueperiod_start + ' to ' + valueperiod_end;
					ObservationComponent.value = Value;
					ObservationComponent.dataAbsentReason = rez[i].data_absent_reason;
					ObservationComponent.interpretation = rez[i].interpretation;
					
					arrObservationComponent[i] = ObservationComponent;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationComponent
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationComponent"
				});
			});
		},
		observationReferenceRange: function getObservationReferenceRange(req, res) {
			var apikey = req.params.apikey;
			
			var observationReferenceRangeId = req.query._id;
			var observationComponentId = req.query.component_id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = "";

			if (typeof observationReferenceRangeId !== 'undefined' && observationReferenceRangeId !== "") {
				condition += "reference_range_id = '" + observationReferenceRangeId + "' AND ";
			}

			if (typeof observationComponentId !== 'undefined' && observationComponentId !== "") {
				condition += "component_id = '" + observationComponentId + "' AND ";
			}
			
			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrObservationReferenceRange = [];
			var query = "select reference_range_id, low, high, type, applies_to, age_low, age_high, text from BACIRO_FHIR.observation_reference_range " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ObservationReferenceRange = {};
					
					ObservationReferenceRange.id = rez[i].reference_range_id;
					ObservationReferenceRange.low = rez[i].low;
					ObservationReferenceRange.high = rez[i].high;
					ObservationReferenceRange.type = rez[i].type;
					ObservationReferenceRange.appliesTo = rez[i].applies_to;
					ObservationReferenceRange.age = rez[i].age_low + ' to ' + rez[i].age_high;
					ObservationReferenceRange.text = rez[i].text;
					
					arrObservationReferenceRange[i] = ObservationReferenceRange;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationReferenceRange
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationReferenceRange"
				});
			});
		},
		observationSampledData: function getObservationSampledData(req, res) {
			var apikey = req.params.apikey;
			
			var observationSampledDataId = req.query._id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = "";

			if (typeof observationSampledDataId !== 'undefined' && observationSampledDataId !== "") {
				condition += "sampled_data_id = '" + observationSampledDataId + "' AND ";
			}

			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrObservationSampledData = [];
			var query = "select sampled_data_id, origin, period, factor, lower_limit, upper_limit, dimensions, data from BACIRO_FHIR.sampled_data " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ObservationSampledData = {};
					ObservationSampledData.id = rez[i].sampled_data_id;
					ObservationSampledData.origin = rez[i].origin;
					ObservationSampledData.period = rez[i].period;
					ObservationSampledData.factor = rez[i].factor;
					ObservationSampledData.lower_limit = rez[i].lower_limit;
					ObservationSampledData.upper_limit = rez[i].upper_limit;
					ObservationSampledData.dimensions = rez[i].dimensions;
					ObservationSampledData.data = rez[i].data;
					
					arrObservationSampledData[i] = ObservationSampledData;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationSampledData
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationSampledData"
				});
			});
		},
		
		observationBasedOnCarePlan: function getObservationBasedOnCarePlan(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = '';

			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrObservationBasedOnCarePlan = [];
			var query = 'select careplan_id from BACIRO_FHIR.careplan ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var observationBasedOnCarePlan = {};
					if(rez[i].careplan_id != "null"){
						observationBasedOnCarePlan.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Careplan?_id=' +  rez[i].careplan_id;
					} else {
						observationBasedOnCarePlan.id = "";
					}
					
					arrObservationBasedOnCarePlan[i] = observationBasedOnCarePlan;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationBasedOnCarePlan
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationBasedOnCarePlan"
				});
			});
		},
		observationBasedOnDeviceRequest: function getObservationBasedOnDeviceRequest(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = '';

			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrObservationBasedOnDeviceRequest = [];
			var query = 'select device_request_id from BACIRO_FHIR.device_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var observationBasedOnDeviceRequest = {};
					if(rez[i].device_request_id != "null"){
						observationBasedOnDeviceRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/DeviceRequest?_id=' +  rez[i].device_request_id;
					} else {
						observationBasedOnDeviceRequest.id = "";
					}
					
					arrObservationBasedOnDeviceRequest[i] = observationBasedOnDeviceRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationBasedOnDeviceRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationBasedOnDeviceRequest"
				});
			});
		},
		observationBasedOnImmunizationRecommendation: function getObservationBasedOnImmunizationRecommendation(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = '';

			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrObservationBasedOnImmunizationRecommendation = [];
			var query = 'select immunization_recommendation_id from BACIRO_FHIR.immunization_recommendation ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var observationBasedOnImmunizationRecommendation = {};
					if(rez[i].immunization_recommendation_id != "null"){
						observationBasedOnImmunizationRecommendation.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/ImmunizationRecommendation?_id=' +  rez[i].immunization_recommendation_id;
					} else {
						observationBasedOnImmunizationRecommendation.id = "";
					}
					
					arrObservationBasedOnImmunizationRecommendation[i] = observationBasedOnImmunizationRecommendation;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationBasedOnImmunizationRecommendation
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationBasedOnImmunizationRecommendation"
				});
			});
		},
		observationBasedOnMedicationRequest: function getObservationBasedOnMedicationRequest(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = '';

			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrObservationBasedOnMedicationRequest = [];
			var query = 'select medication_request_id from BACIRO_FHIR.medication_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var observationBasedOnMedicationRequest = {};
					if(rez[i].medication_request_id != "null"){
						observationBasedOnMedicationRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/MedicationRequest?_id=' +  rez[i].medication_request_id;
					} else {
						observationBasedOnMedicationRequest.id = "";
					}
					
					arrObservationBasedOnMedicationRequest[i] = observationBasedOnMedicationRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationBasedOnMedicationRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationBasedOnMedicationRequest"
				});
			});
		},
		observationBasedOnNutritionOrder: function getObservationBasedOnNutritionOrder(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = '';

			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrObservationBasedOnNutritionOrder = [];
			var query = 'select nutrition_order_id from BACIRO_FHIR.nutrition_order ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var observationBasedOnNutritionOrder = {};
					if(rez[i].nutrition_order_id != "null"){
						observationBasedOnNutritionOrder.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/NutritionOrder?_id=' +  rez[i].nutrition_order_id;
					} else {
						observationBasedOnNutritionOrder.id = "";
					}
					
					arrObservationBasedOnNutritionOrder[i] = observationBasedOnNutritionOrder;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationBasedOnNutritionOrder
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationBasedOnNutritionOrder"
				});
			});
		},
		observationBasedOnProcedureRequest: function getObservationBasedOnProcedureRequest(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = '';

			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrObservationBasedOnProcedureRequest = [];
			var query = 'select procedure_request_id from BACIRO_FHIR.procedure_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var observationBasedOnProcedureRequest = {};
					if(rez[i].procedure_request_id != "null"){
						observationBasedOnProcedureRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/ProcedureRequest?_id=' +  rez[i].procedure_request_id;
					} else {
						observationBasedOnProcedureRequest.id = "";
					}
					
					arrObservationBasedOnProcedureRequest[i] = observationBasedOnProcedureRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationBasedOnProcedureRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationBasedOnProcedureRequest"
				});
			});
		},
		observationBasedOnReferralRequest: function getObservationBasedOnReferralRequest(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = '';

			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrObservationBasedOnReferralRequest = [];
			var query = 'select referral_request_id from BACIRO_FHIR.referral_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var observationBasedOnReferralRequest = {};
					if(rez[i].referral_request_id != "null"){
						observationBasedOnReferralRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/ReferralRequest?_id=' +  rez[i].referral_request_id;
					} else {
						observationBasedOnReferralRequest.id = "";
					}
					
					arrObservationBasedOnReferralRequest[i] = observationBasedOnReferralRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationBasedOnReferralRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationBasedOnReferralRequest"
				});
			});
		},
		observationPerformerPractitioner: function getObservationPerformerPractitioner(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = '';

			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrObservationPerformerPractitioner = [];
			var query = 'select practitioner_id from BACIRO_FHIR.practitioner ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var observationPerformerPractitioner = {};
					if(rez[i].practitioner_id != "null"){
						observationPerformerPractitioner.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].practitioner_id;
					} else {
						observationPerformerPractitioner.id = "";
					}
					
					arrObservationPerformerPractitioner[i] = observationPerformerPractitioner;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationPerformerPractitioner
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationPerformerPractitioner"
				});
			});
		},
		observationPerformerOrganization: function getObservationPerformerOrganization(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = '';

			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrObservationPerformerOrganization = [];
			var query = 'select organization_id from BACIRO_FHIR.organization ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var observationPerformerOrganization = {};
					if(rez[i].organization_id != "null"){
						observationPerformerOrganization.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].organization_id;
					} else {
						observationPerformerOrganization.id = "";
					}
					
					arrObservationPerformerOrganization[i] = observationPerformerOrganization;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationPerformerOrganization
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationPerformerOrganization"
				});
			});
		},
		observationPerformerPatient: function getObservationPerformerPatient(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = '';

			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrObservationPerformerPatient = [];
			var query = 'select patient_id from BACIRO_FHIR.patient ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var observationPerformerPatient = {};
					if(rez[i].patient_id != "null"){
						observationPerformerPatient.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient_id;
					} else {
						observationPerformerPatient.id = "";
					}
					
					arrObservationPerformerPatient[i] = observationPerformerPatient;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationPerformerPatient
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationPerformerPatient"
				});
			});
		},
		observationPerformerRelatedPerson: function getObservationPerformerRelatedPerson(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var observationId = req.query.observation_id;

			//susun query
			var condition = '';

			if (typeof observationId !== 'undefined' && observationId !== "") {
				condition += "observation_id = '" + observationId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrObservationPerformerRelatedPerson = [];
			var query = 'select related_person_id from BACIRO_FHIR.related_person ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var observationPerformerRelatedPerson = {};
					if(rez[i].related_person_id != "null"){
						observationPerformerRelatedPerson.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].related_person_id;
					} else {
						observationPerformerRelatedPerson.id = "";
					}
					
					arrObservationPerformerRelatedPerson[i] = observationPerformerRelatedPerson;
				}
				res.json({
					"err_code": 0,
					"data": arrObservationPerformerRelatedPerson
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getObservationPerformerRelatedPerson"
				});
			});
		},
  },
	post: {
		observation: function addObservation(req, res) {
			console.log(req.body);
			var observation_id  = req.body.observation_id;
			var status  = req.body.status;
			var category  = req.body.category;
			var code  = req.body.code;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var subject_device  = req.body.subject_device;
			var subject_location  = req.body.subject_location;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var effective_date_time  = req.body.effective_date_time;
			var effective_period_start  = req.body.effective_period_start;
			var effective_period_end  = req.body.effective_period_end;
			var issued  = req.body.issued;
			var value_quantity  = req.body.value_quantity;
			var value_codeable_concept  = req.body.value_codeable_concept;
			var value_string  = req.body.value_string;
			var value_boolean  = req.body.value_boolean;
			var value_range_low  = req.body.value_range_low;
			var value_range_high  = req.body.value_range_high;
			var value_ratio_numerator  = req.body.value_ratio_numerator;
			var value_ratio_denominator  = req.body.value_ratio_denominator;
			var value_sampled_data  = req.body.value_sampled_data;
			var value_attachment  = req.body.value_attachment;
			var value_time  = req.body.value_time;
			var value_date_time  = req.body.value_date_time;
			var value_period_start  = req.body.value_period_start;
			var value_period_end  = req.body.value_period_end;
			var data_absent_reason  = req.body.data_absent_reason;
			var interpretation  = req.body.interpretation;
			var comment  = req.body.comment;
			var body_site  = req.body.body_site;
			var method  = req.body.method;
			var specimen  = req.body.specimen;
			var device_device  = req.body.device_device;
			var device_device_metric  = req.body.device_device_metric;
			var adverse_event_id  = req.body.adverse_event_id;
			var charge_item_id  = req.body.charge_item_id;
			var clinical_impression_investigation_id  = req.body.clinical_impression_investigation_id;
			var communication_id  = req.body.communication_id;
			var communication_request_id  = req.body.communication_request_id;
			var condition_stage_id  = req.body.condition_stage_id;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var family_member_history_id  = req.body.family_member_history_id;
			var immunization_recommendation_id  = req.body.immunization_recommendation_id;
			var medication_administration_id  = req.body.medication_administration_id;
			var medication_request_id  = req.body.medication_request_id;
			var procedure_request_id  = req.body.procedure_request_id;
			var questionnaire_response_id  = req.body.questionnaire_response_id;
			var referral_request_id  = req.body.referral_request_id;
			
			var goal_addresses_id  = req.body.referral_request_id;
			var goal_outcome_reference_id  = req.body.referral_request_id;
			var medication_statement_part_of_id  = req.body.referral_request_id;
			var medication_statement_reason_reference_id  = req.body.referral_request_id;
			var procedure_part_of_id  = req.body.referral_request_id;
			var procedure_part_reason_reference_id  = req.body.referral_request_id;


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
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }	
			
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }	
			
			if (typeof subject_group !== 'undefined' && subject_group !== "") {
        column += 'subject_group,';
        values += "'" + subject_group + "',";
      }		
			
			if (typeof subject_device !== 'undefined' && subject_device !== "") {
        column += 'subject_device,';
        values += "'" + subject_device + "',";
      }	
			
			if (typeof subject_location !== 'undefined' && subject_location !== "") {
        column += 'subject_location,';
        values += "'" + subject_location + "',";
      }		
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }	
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }
			
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
			
			if (typeof issued !== 'undefined' && issued !== "") {
        column += 'issued,';
				values += "to_date('"+ issued + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof value_quantity !== 'undefined' && value_quantity !== "") {
        column += 'value_quantity,';
        values += "" + value_quantity + ",";
      }		
			
			if (typeof value_codeable_concept !== 'undefined' && value_codeable_concept !== "") {
        column += 'value_codeable_concept,';
        values += "'" + value_codeable_concept + "',";
      }
			
			if (typeof value_string !== 'undefined' && value_string !== "") {
        column += 'value_string,';
        values += "'" + value_string + "',";
      }		
			
			if (typeof value_boolean !== 'undefined' && value_boolean !== "") {
        column += 'value_boolean,';
        values += " " + value_boolean + ",";
      }
			
			if (typeof value_range_low !== 'undefined' && value_range_low !== "") {
        column += 'value_range_low,';
        values += " " + value_range_low + ",";
      }
			
			if (typeof value_range_high !== 'undefined' && value_range_high !== "") {
        column += 'value_range_high,';
        values += " " + value_range_high + ",";
      }
			
			if (typeof value_ratio_numerator !== 'undefined' && value_ratio_numerator !== "") {
        column += 'value_ratio_numerator,';
        values += " " + value_ratio_numerator + ",";
      }
			
			if (typeof value_ratio_denominator !== 'undefined' && value_ratio_denominator !== "") {
        column += 'value_ratio_denominator,';
        values += " " + value_ratio_denominator + ",";
      }
			
			if (typeof value_sampled_data !== 'undefined' && value_sampled_data !== "") {
        column += 'value_sampled_data,';
        values += "'" + value_sampled_data + "',";
      }		
			
			if (typeof value_attachment !== 'undefined' && value_attachment !== "") {
        column += 'value_attachment,';
        values += "'" + value_attachment + "',";
      }		
	
			if (typeof value_time !== 'undefined' && value_time !== "") {
        column += 'value_time,';
				values += "to_date('"+ value_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof value_date_time !== 'undefined' && value_date_time !== "") {
        column += 'value_date_time,';
				values += "to_date('"+ value_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof value_period_start !== 'undefined' && value_period_start !== "") {
        column += 'value_period_start,';
				values += "to_date('"+ value_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof value_period_end !== 'undefined' && value_period_end !== "") {
        column += 'value_period_end,';
				values += "to_date('"+ value_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof data_absent_reason !== 'undefined' && data_absent_reason !== "") {
        column += 'data_absent_reason,';
        values += "'" + data_absent_reason + "',";
      }		
			
			if (typeof interpretation !== 'undefined' && interpretation !== "") {
        column += 'interpretation,';
        values += "'" + interpretation + "',";
      }
			
			if (typeof comment !== 'undefined' && comment !== "") {
        column += '"comment",';
        values += "'" + comment + "',";
      }		
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
      }		
			
			if (typeof method !== 'undefined' && method !== "") {
        column += 'method,';
        values += "'" + method + "',";
      }
			
			if (typeof specimen !== 'undefined' && specimen !== "") {
        column += 'specimen,';
        values += "'" + specimen + "',";
      }		
			
			if (typeof device_device !== 'undefined' && device_device !== "") {
        column += 'device_device,';
        values += "'" + device_device + "',";
      }		
			
			if (typeof device_device_metric !== 'undefined' && device_device_metric !== "") {
        column += 'device_device_metric,';
        values += "'" + device_device_metric + "',";
      }
			
			if (typeof adverse_event_id !== 'undefined' && adverse_event_id !== "") {
        column += 'adverse_event_id,';
        values += "'" + adverse_event_id + "',";
      }		

			if (typeof charge_item_id !== 'undefined' && charge_item_id !== "") {
        column += 'charge_item_id,';
        values += "'" + charge_item_id + "',";
      }		
			
			if (typeof clinical_impression_investigation_id !== 'undefined' && clinical_impression_investigation_id !== "") {
        column += 'clinical_impression_investigation_id,';
        values += "'" + clinical_impression_investigation_id + "',";
      }		
			
			if (typeof condition_stage_id !== 'undefined' && condition_stage_id !== "") {
        column += 'condition_stage_id,';
        values += "'" + condition_stage_id + "',";
      }		
			
			if (typeof communication_id !== 'undefined' && communication_id !== "") {
        column += 'communication_id,';
        values += "'" + communication_id + "',";
      }
			
			if (typeof communication_request_id !== 'undefined' && communication_request_id !== "") {
        column += 'communication_request_id,';
        values += "'" + communication_request_id + "',";
      }

			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }		
			
			if (typeof family_member_history_id !== 'undefined' && family_member_history_id !== "") {
        column += 'family_member_history_id,';
        values += "'" + family_member_history_id + "',";
      }
			
			if (typeof immunization_recommendation_id !== 'undefined' && immunization_recommendation_id !== "") {
        column += 'immunization_recommendation_id,';
        values += "'" + immunization_recommendation_id + "',";
      }		
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }
			
			if (typeof medication_request_id !== 'undefined' && medication_request_id !== "") {
        column += 'medication_request_id,';
        values += "'" + medication_request_id + "',";
      }		

			if (typeof procedure_request_id !== 'undefined' && procedure_request_id !== "") {
        column += 'procedure_request_id,';
        values += "'" + procedure_request_id + "',";
      }		
			
			if (typeof questionnaire_response_id !== 'undefined' && questionnaire_response_id !== "") {
        column += 'questionnaire_response_id,';
        values += "'" + questionnaire_response_id + "',";
      }
			
			if (typeof referral_request_id !== 'undefined' && referral_request_id !== "") {
        column += 'referral_request_id,';
        values += "'" + referral_request_id + "',";
      }		
			
			if (typeof goal_addresses_id !== 'undefined' && goal_addresses_id !== "") {
        column += 'goal_addresses_id,';
        values += "'" + goal_addresses_id + "',";
      }		
			
			if (typeof goal_outcome_reference_id !== 'undefined' && goal_outcome_reference_id !== "") {
        column += 'goal_outcome_reference_id,';
        values += "'" + goal_outcome_reference_id + "',";
      }		
			
			if (typeof medication_statement_part_of_id !== 'undefined' && medication_statement_part_of_id !== "") {
        column += 'medication_statement_part_of_id,';
        values += "'" + medication_statement_part_of_id + "',";
      }		
			
			if (typeof medication_statement_reason_reference_id !== 'undefined' && medication_statement_reason_reference_id !== "") {
        column += 'medication_statement_reason_reference_id,';
        values += "'" + medication_statement_reason_reference_id + "',";
      }		
			
			if (typeof procedure_part_of_id !== 'undefined' && procedure_part_of_id !== "") {
        column += 'procedure_part_of_id,';
        values += "'" + procedure_part_of_id + "',";
      }		
			
			if (typeof procedure_part_reason_reference_id !== 'undefined' && procedure_part_reason_reference_id !== "") {
        column += 'procedure_part_reason_reference_id,';
        values += "'" + procedure_part_reason_reference_id + "',";
      }		
			
			var query = "UPSERT INTO BACIRO_FHIR.observation(observation_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+observation_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select observation_id from BACIRO_FHIR.observation WHERE observation_id = '" + observation_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addObservation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addObservation"});
      });
    },
		observationRelated: function addObservationRelated(req, res) {
			console.log(req.body);
			var related_id  = req.body.related_id;
			var type  = req.body.type;
			var target_observation  = req.body.target_observation;
			var target_questionnaire_response  = req.body.target_questionnaire_response;
			var target_sequence  = req.body.target_sequence;
			var observation_id  = req.body.observation_id;
			
			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof target_observation !== 'undefined' && target_observation !== "") {
        column += 'target_observation,';
        values += "'" + target_observation + "',";
      }
			
			if (typeof target_questionnaire_response !== 'undefined' && target_questionnaire_response !== "") {
        column += 'target_questionnaire_response,';
        values += "'" + target_questionnaire_response + "',";
      }
			
			if (typeof target_sequence !== 'undefined' && target_sequence !== "") {
        column += 'target_sequence,';
        values += "'" + target_sequence + "',";
      }	
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.observation_related(related_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+related_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select related_id from BACIRO_FHIR.observation_related WHERE related_id = '" + related_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addObservationRelated"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addObservationRelated"});
      });
    },
		observationComponent: function addObservationComponent(req, res) {
			console.log(req.body);
			var component_id  = req.body.component_id;
			var code  = req.body.code;
			var value_quantity  = req.body.value_quantity;
			var value_codeable_concept  = req.body.value_codeable_concept;
			var value_string  = req.body.value_string;
			var value_range_low  = req.body.value_range_low;
			var value_range_high  = req.body.value_range_high;
			var value_ratio_numerator  = req.body.value_ratio_numerator;
			var value_ratio_denominator  = req.body.value_ratio_denominator;
			var value_sampled_data  = req.body.value_sampled_data;
			var value_attachment  = req.body.value_attachment;
			var value_time  = req.body.value_time;
			var value_date_time  = req.body.value_date_time;
			var value_period_start  = req.body.value_period_start;
			var value_period_end  = req.body.value_period_end;
			var data_absent_reason  = req.body.data_absent_reason;
			var interpretation  = req.body.interpretation;
			var observation_id  = req.body.observation_id;

			var column = "";
      var values = "";
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }
			
			if (typeof value_quantity !== 'undefined' && value_quantity !== "") {
        column += 'value_quantity,';
        values += "'" + value_quantity + "',";
      }		
			
			if (typeof value_codeable_concept !== 'undefined' && value_codeable_concept !== "") {
        column += 'value_codeable_concept,';
        values += "'" + value_codeable_concept + "',";
      }
			
			if (typeof value_string !== 'undefined' && value_string !== "") {
        column += 'value_string,';
        values += "'" + value_string + "',";
      }		
			
			if (typeof value_range_low !== 'undefined' && value_range_low !== "") {
        column += 'value_range_low,';
        values += " " + value_range_low + ",";
      }
			
			if (typeof value_range_high !== 'undefined' && value_range_high !== "") {
        column += 'value_range_high,';
        values += " " + value_range_high + ",";
      }
			
			if (typeof value_ratio_numerator !== 'undefined' && value_ratio_numerator !== "") {
        column += 'value_ratio_numerator,';
        values += " " + value_ratio_numerator + ",";
      }
			
			if (typeof value_ratio_denominator !== 'undefined' && value_ratio_denominator !== "") {
        column += 'value_ratio_denominator,';
        values += " " + value_ratio_denominator + ",";
      }
			
			if (typeof value_sampled_data !== 'undefined' && value_sampled_data !== "") {
        column += 'value_sampled_data,';
        values += "'" + value_sampled_data + "',";
      }		
			
			if (typeof value_attachment !== 'undefined' && value_attachment !== "") {
        column += 'value_attachment,';
        values += "'" + value_attachment + "',";
      }		
	
			if (typeof value_time !== 'undefined' && value_time !== "") {
        column += 'value_time,';
				values += "to_date('"+ value_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof value_date_time !== 'undefined' && value_date_time !== "") {
        column += 'value_date_time,';
				values += "to_date('"+ value_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof value_period_start !== 'undefined' && value_period_start !== "") {
        column += 'value_period_start,';
				values += "to_date('"+ value_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof value_period_end !== 'undefined' && value_period_end !== "") {
        column += 'value_period_end,';
				values += "to_date('"+ value_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof data_absent_reason !== 'undefined' && data_absent_reason !== "") {
        column += 'data_absent_reason,';
        values += "'" + data_absent_reason + "',";
      }
			
			if (typeof interpretation !== 'undefined' && interpretation !== "") {
        column += 'interpretation,';
        values += "'" + interpretation + "',";
      }
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }	
	

      var query = "UPSERT INTO BACIRO_FHIR.observation_component(component_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+component_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select component_id from BACIRO_FHIR.observation_component WHERE component_id = '" + component_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addObservationComponent"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addObservationComponent"});
      });
    },
		observationReferenceRange: function addObservationReferenceRange(req, res) {
			console.log(req.body);
			var reference_range_id  = req.body.reference_range_id;
			var low  = req.body.low; 
			var high  = req.body.high;
			var type  = req.body.type;
			var applies_to  = req.body.applies_to;
			var age_low  = req.body.age_low;
			var age_high  = req.body.age_high;
			var text  = req.body.text;
			var observation_id  = req.body.observation_id;
			var component_id  = req.body.component_id;
			
			var column = "";
      var values = "";
			
			if (typeof low !== 'undefined' && low !== "") {
        column += 'low,';
        values += " " + low + ",";
      }
			
			if (typeof high !== 'undefined' && high !== "") {
        column += 'high,';
        values += " " + high + ",";
      }
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof applies_to !== 'undefined' && applies_to !== "") {
        column += 'applies_to,';
        values += "'" + applies_to + "',";
      }
			
			if (typeof age_low !== 'undefined' && age_low !== "") {
        column += 'age_low,';
        values += " " + age_low + ",";
      }
			
			if (typeof age_high !== 'undefined' && age_high !== "") {
        column += 'age_high,';
        values += " " + age_high + ",";
      }
			
			if (typeof text !== 'undefined' && text !== "") {
        column += 'text,';
        values += "'" + text + "',";
      }
			
			if (typeof component_id !== 'undefined' && component_id !== "") {
        column += 'component_id,';
        values += "'" + component_id + "',";
      }	
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }	
	

      var query = "UPSERT INTO BACIRO_FHIR.observation_reference_range(reference_range_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+reference_range_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select reference_range_id from BACIRO_FHIR.observation_reference_range WHERE reference_range_id = '" + reference_range_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addObservationReferenceRange"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addObservationReferenceRange"});
      });
    },
		observationSampledData: function addObservationSampledData(req, res) {
			console.log(req.body);
			var sampled_data_id  = req.body.sampled_data_id;
			var origin  = req.body.origin;
			var period  = req.body.period;
			var factor  = req.body.factor;
			var lower_limit   = req.body.lower_limit;
			var upper_limit  = req.body.upper_limit;
			var dimensions  = req.body.dimensions;
			var data  = req.body.data;
			var observation_id  = req.body.observation_id;
			var component_id  = req.body.component_id;

			var column = "";
      var values = "";
			
			if (typeof origin !== 'undefined' && origin !== "") {
        column += 'origin,';
        values += " " + origin + ",";
      }
			
			if (typeof period !== 'undefined' && period !== "") {
        column += 'period,';
        values += " " + period + ",";
      }
			
			if (typeof factor !== 'undefined' && factor !== "") {
        column += 'factor,';
        values += " " + factor + ",";
      }
			
			if (typeof lower_limit !== 'undefined' && lower_limit !== "") {
        column += 'lower_limit,';
        values += " " + lower_limit + ",";
      }
			
			if (typeof upper_limit !== 'undefined' && upper_limit !== "") {
        column += 'upper_limit,';
        values += " " + upper_limit + ",";
      }
			
			if (typeof dimensions !== 'undefined' && dimensions !== "") {
        column += 'dimensions,';
        values += " " + dimensions + ",";
      }
			
			if (typeof data !== 'undefined' && data !== "") {
        column += 'data,';
        values += " " + data + ",";
      }
			
			if (typeof component_id !== 'undefined' && component_id !== "") {
        column += 'component_id,';
        values += "'" + component_id + "',";
      }	
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }	
	
      var query = "UPSERT INTO BACIRO_FHIR.sampled_data(sampled_data_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+sampled_data_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select sampled_data_id from BACIRO_FHIR.sampled_data WHERE sampled_data_id = '" + sampled_data_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addObservationSampledData"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addObservationSampledData"});
      });
    },
	},
	put: {
		observation: function updateObservation(req, res) {
			console.log(req.body);
			var observation_id  = req.params._id;
			var status  = req.body.status;
			var category  = req.body.category;
			var code  = req.body.code;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var subject_device  = req.body.subject_device;
			var subject_location  = req.body.subject_location;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var effective_date_time  = req.body.effective_date_time;
			var effective_period_start  = req.body.effective_period_start;
			var effective_period_end  = req.body.effective_period_end;
			var issued  = req.body.issued;
			var value_quantity  = req.body.value_quantity;
			var value_codeable_concept  = req.body.value_codeable_concept;
			var value_string  = req.body.value_string;
			var value_boolean  = req.body.value_boolean;
			var value_range_low  = req.body.value_range_low;
			var value_range_high  = req.body.value_range_high;
			var value_ratio_numerator  = req.body.value_ratio_numerator;
			var value_ratio_denominator  = req.body.value_ratio_denominator;
			var value_sampled_data  = req.body.value_sampled_data;
			var value_attachment  = req.body.value_attachment;
			var value_time  = req.body.value_time;
			var value_date_time  = req.body.value_date_time;
			var value_period_start  = req.body.value_period_start;
			var value_period_end  = req.body.value_period_end;
			var data_absent_reason  = req.body.data_absent_reason;
			var interpretation  = req.body.interpretation;
			var comment  = req.body.comment;
			var body_site  = req.body.body_site;
			var method  = req.body.method;
			var specimen  = req.body.specimen;
			var device_device  = req.body.device_device;
			var device_device_metric  = req.body.device_device_metric;
			var adverse_event_id  = req.body.adverse_event_id;
			var charge_item_id  = req.body.charge_item_id;
			var clinical_impression_investigation_id  = req.body.clinical_impression_investigation_id;
			var communication_id  = req.body.communication_id;
			var communication_request_id  = req.body.communication_request_id;
			var condition_stage_id  = req.body.condition_stage_id;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var family_member_history_id  = req.body.family_member_history_id;
			var immunization_recommendation_id  = req.body.immunization_recommendation_id;
			var medication_administration_id  = req.body.medication_administration_id;
			var medication_request_id  = req.body.medication_request_id;
			var procedure_request_id  = req.body.procedure_request_id;
			var questionnaire_response_id  = req.body.questionnaire_response_id;
			var referral_request_id  = req.body.referral_request_id;
			
			var goal_addresses_id  = req.body.referral_request_id;
			var goal_outcome_reference_id  = req.body.referral_request_id;
			var medication_statement_part_of_id  = req.body.referral_request_id;
			var medication_statement_reason_reference_id  = req.body.referral_request_id;
			var procedure_part_of_id  = req.body.referral_request_id;
			var procedure_part_reason_reference_id  = req.body.referral_request_id;
			var recommendation_id = req.body.recommendation_id;
			
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
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }	
			
			if (typeof subject_patient !== 'undefined' && subject_patient !== "") {
        column += 'subject_patient,';
        values += "'" + subject_patient + "',";
      }	
			
			if (typeof subject_group !== 'undefined' && subject_group !== "") {
        column += 'subject_group,';
        values += "'" + subject_group + "',";
      }		
			
			if (typeof subject_device !== 'undefined' && subject_device !== "") {
        column += 'subject_device,';
        values += "'" + subject_device + "',";
      }	
			
			if (typeof subject_location !== 'undefined' && subject_location !== "") {
        column += 'subject_location,';
        values += "'" + subject_location + "',";
      }		
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }	
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }
			
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
			
			if (typeof issued !== 'undefined' && issued !== "") {
        column += 'issued,';
				values += "to_date('"+ issued + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof value_quantity !== 'undefined' && value_quantity !== "") {
        column += 'value_quantity,';
        values += " " + value_quantity + ",";
      }		
			
			if (typeof value_codeable_concept !== 'undefined' && value_codeable_concept !== "") {
        column += 'value_codeable_concept,';
        values += "'" + value_codeable_concept + "',";
      }
			
			if (typeof value_string !== 'undefined' && value_string !== "") {
        column += 'value_string,';
        values += "'" + value_string + "',";
      }		
			
			if (typeof value_boolean !== 'undefined' && value_boolean !== "") {
        column += 'value_boolean,';
        values += " " + value_boolean + ",";
      }
			
			if (typeof value_range_low !== 'undefined' && value_range_low !== "") {
        column += 'value_range_low,';
        values += " " + value_range_low + ",";
      }
			
			if (typeof value_range_high !== 'undefined' && value_range_high !== "") {
        column += 'value_range_high,';
        values += " " + value_range_high + ",";
      }
			
			if (typeof value_ratio_numerator !== 'undefined' && value_ratio_numerator !== "") {
        column += 'value_ratio_numerator,';
        values += " " + value_ratio_numerator + ",";
      }
			
			if (typeof value_ratio_denominator !== 'undefined' && value_ratio_denominator !== "") {
        column += 'value_ratio_denominator,';
        values += " " + value_ratio_denominator + ",";
      }
			
			if (typeof value_sampled_data !== 'undefined' && value_sampled_data !== "") {
        column += 'value_sampled_data,';
        values += "'" + value_sampled_data + "',";
      }		
			
			if (typeof value_attachment !== 'undefined' && value_attachment !== "") {
        column += 'value_attachment,';
        values += "'" + value_attachment + "',";
      }		
	
			if (typeof value_time !== 'undefined' && value_time !== "") {
        column += 'value_time,';
				values += "to_date('"+ value_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof value_date_time !== 'undefined' && value_date_time !== "") {
        column += 'value_date_time,';
				values += "to_date('"+ value_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof value_period_start !== 'undefined' && value_period_start !== "") {
        column += 'value_period_start,';
				values += "to_date('"+ value_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof value_period_end !== 'undefined' && value_period_end !== "") {
        column += 'value_period_end,';
				values += "to_date('"+ value_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof data_absent_reason !== 'undefined' && data_absent_reason !== "") {
        column += 'data_absent_reason,';
        values += "'" + data_absent_reason + "',";
      }		
			
			if (typeof interpretation !== 'undefined' && interpretation !== "") {
        column += 'interpretation,';
        values += "'" + interpretation + "',";
      }
			
			if (typeof comment !== 'undefined' && comment !== "") {
        column += '"comment",';
        values += "'" + comment + "',";
      }		
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
      }		
			
			if (typeof method !== 'undefined' && method !== "") {
        column += 'method,';
        values += "'" + method + "',";
      }
			
			if (typeof specimen !== 'undefined' && specimen !== "") {
        column += 'specimen,';
        values += "'" + specimen + "',";
      }		
			
			if (typeof device_device !== 'undefined' && device_device !== "") {
        column += 'device_device,';
        values += "'" + device_device + "',";
      }		
			
			if (typeof device_device_metric !== 'undefined' && device_device_metric !== "") {
        column += 'device_device_metric,';
        values += "'" + device_device_metric + "',";
      }
			
			if (typeof adverse_event_id !== 'undefined' && adverse_event_id !== "") {
        column += 'adverse_event_id,';
        values += "'" + adverse_event_id + "',";
      }		

			if (typeof charge_item_id !== 'undefined' && charge_item_id !== "") {
        column += 'charge_item_id,';
        values += "'" + charge_item_id + "',";
      }		
			
			if (typeof clinical_impression_investigation_id !== 'undefined' && clinical_impression_investigation_id !== "") {
        column += 'clinical_impression_investigation_id,';
        values += "'" + clinical_impression_investigation_id + "',";
      }		
			
			if (typeof condition_stage_id !== 'undefined' && condition_stage_id !== "") {
        column += 'condition_stage_id,';
        values += "'" + condition_stage_id + "',";
      }		
			
			if (typeof communication_id !== 'undefined' && communication_id !== "") {
        column += 'communication_id,';
        values += "'" + communication_id + "',";
      }
			
			if (typeof communication_request_id !== 'undefined' && communication_request_id !== "") {
        column += 'communication_request_id,';
        values += "'" + communication_request_id + "',";
      }

			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }		
			
			if (typeof family_member_history_id !== 'undefined' && family_member_history_id !== "") {
        column += 'family_member_history_id,';
        values += "'" + family_member_history_id + "',";
      }
			
			if (typeof immunization_recommendation_id !== 'undefined' && immunization_recommendation_id !== "") {
        column += 'immunization_recommendation_id,';
        values += "'" + immunization_recommendation_id + "',";
      }		
			
			if (typeof medication_administration_id !== 'undefined' && medication_administration_id !== "") {
        column += 'medication_administration_id,';
        values += "'" + medication_administration_id + "',";
      }
			
			if (typeof medication_request_id !== 'undefined' && medication_request_id !== "") {
        column += 'medication_request_id,';
        values += "'" + medication_request_id + "',";
      }		

			if (typeof procedure_request_id !== 'undefined' && procedure_request_id !== "") {
        column += 'procedure_request_id,';
        values += "'" + procedure_request_id + "',";
      }		
			
			if (typeof questionnaire_response_id !== 'undefined' && questionnaire_response_id !== "") {
        column += 'questionnaire_response_id,';
        values += "'" + questionnaire_response_id + "',";
      }
			
			if (typeof referral_request_id !== 'undefined' && referral_request_id !== "") {
        column += 'referral_request_id,';
        values += "'" + referral_request_id + "',";
      }		
			
			if (typeof goal_addresses_id !== 'undefined' && goal_addresses_id !== "") {
        column += 'goal_addresses_id,';
        values += "'" + goal_addresses_id + "',";
      }		
			
			if (typeof goal_outcome_reference_id !== 'undefined' && goal_outcome_reference_id !== "") {
        column += 'goal_outcome_reference_id,';
        values += "'" + goal_outcome_reference_id + "',";
      }		
			
			if (typeof medication_statement_part_of_id !== 'undefined' && medication_statement_part_of_id !== "") {
        column += 'medication_statement_part_of_id,';
        values += "'" + medication_statement_part_of_id + "',";
      }		
			
			if (typeof medication_statement_reason_reference_id !== 'undefined' && medication_statement_reason_reference_id !== "") {
        column += 'medication_statement_reason_reference_id,';
        values += "'" + medication_statement_reason_reference_id + "',";
      }		
			
			if (typeof procedure_part_of_id !== 'undefined' && procedure_part_of_id !== "") {
        column += 'procedure_part_of_id,';
        values += "'" + procedure_part_of_id + "',";
      }		
			
			if (typeof procedure_part_reason_reference_id !== 'undefined' && procedure_part_reason_reference_id !== "") {
        column += 'procedure_part_reason_reference_id,';
        values += "'" + procedure_part_reason_reference_id + "',";
      }
			
			if (typeof recommendation_id !== 'undefined' && recommendation_id !== "") {
        column += 'recommendation_id,';
        values += "'" + recommendation_id + "',";
      }
			
			var condition = "observation_id = '" + observation_id + "'";

      var query = "UPSERT INTO BACIRO_FHIR.observation(observation_id," + column.slice(0, -1) + ") SELECT observation_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.observation WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select observation_id from BACIRO_FHIR.observation WHERE observation_id = '" + observation_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateObservation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateObservation"});
      });
    },
		observationRelated: function updateObservationRelated(req, res) {
			console.log(req.body);
			var related_id  = req.params._id;
			var type  = req.body.type;
			var target_observation  = req.body.target_observation;
			var target_questionnaire_response  = req.body.target_questionnaire_response;
			var target_sequence  = req.body.target_sequence;
			var observation_id  = req.body.observation_id;
			
			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof target_observation !== 'undefined' && target_observation !== "") {
        column += 'target_observation,';
        values += "'" + target_observation + "',";
      }
			
			if (typeof target_questionnaire_response !== 'undefined' && target_questionnaire_response !== "") {
        column += 'target_questionnaire_response,';
        values += "'" + target_questionnaire_response + "',";
      }
			
			if (typeof target_sequence !== 'undefined' && target_sequence !== "") {
        column += 'target_sequence,';
        values += "'" + target_sequence + "',";
      }	
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }	
	
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "related_id = '" + related_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "related_id = '" + related_id+ "'";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.observation_related(related_id," + column.slice(0, -1) + ") SELECT related_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.observation_related WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select related_id from BACIRO_FHIR.observation_related WHERE related_id = '" + related_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationRelated"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationRelated"});
      });
    },
		observationComponent: function updateObservationComponent(req, res) {
			console.log(req.body);
			var component_id  = req.params._id;
			var code  = req.body.code;
			var value_quantity  = req.body.value_quantity;
			var value_codeable_concept  = req.body.value_codeable_concept;
			var value_string  = req.body.value_string;
			var value_range_low  = req.body.value_range_low;
			var value_range_high  = req.body.value_range_high;
			var value_ratio_numerator  = req.body.value_ratio_numerator;
			var value_ratio_denominator  = req.body.value_ratio_denominator;
			var value_sampled_data  = req.body.value_sampled_data;
			var value_attachment  = req.body.value_attachment;
			var value_time  = req.body.value_time;
			var value_date_time  = req.body.value_date_time;
			var value_period_start  = req.body.value_period_start;
			var value_period_end  = req.body.value_period_end;
			var data_absent_reason  = req.body.data_absent_reason;
			var interpretation  = req.body.interpretation;
			var observation_id  = req.body.observation_id;

			var column = "";
      var values = "";
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }
			
			if (typeof value_quantity !== 'undefined' && value_quantity !== "") {
        column += 'value_quantity,';
        values += "'" + value_quantity + "',";
      }		
			
			if (typeof value_codeable_concept !== 'undefined' && value_codeable_concept !== "") {
        column += 'value_codeable_concept,';
        values += "'" + value_codeable_concept + "',";
      }
			
			if (typeof value_string !== 'undefined' && value_string !== "") {
        column += 'value_string,';
        values += "'" + value_string + "',";
      }		
			
			if (typeof value_range_low !== 'undefined' && value_range_low !== "") {
        column += 'value_range_low,';
        values += " " + value_range_low + ",";
      }
			
			if (typeof value_range_high !== 'undefined' && value_range_high !== "") {
        column += 'value_range_high,';
        values += " " + value_range_high + ",";
      }
			
			if (typeof value_ratio_numerator !== 'undefined' && value_ratio_numerator !== "") {
        column += 'value_ratio_numerator,';
        values += " " + value_ratio_numerator + ",";
      }
			
			if (typeof value_ratio_denominator !== 'undefined' && value_ratio_denominator !== "") {
        column += 'value_ratio_denominator,';
        values += " " + value_ratio_denominator + ",";
      }
			
			if (typeof value_sampled_data !== 'undefined' && value_sampled_data !== "") {
        column += 'value_sampled_data,';
        values += "'" + value_sampled_data + "',";
      }		
			
			if (typeof value_attachment !== 'undefined' && value_attachment !== "") {
        column += 'value_attachment,';
        values += "'" + value_attachment + "',";
      }		
	
			if (typeof value_time !== 'undefined' && value_time !== "") {
        column += 'value_time,';
				values += "to_date('"+ value_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof value_date_time !== 'undefined' && value_date_time !== "") {
        column += 'value_date_time,';
				values += "to_date('"+ value_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof value_period_start !== 'undefined' && value_period_start !== "") {
        column += 'value_period_start,';
				values += "to_date('"+ value_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof value_period_end !== 'undefined' && value_period_end !== "") {
        column += 'value_period_end,';
				values += "to_date('"+ value_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof data_absent_reason !== 'undefined' && data_absent_reason !== "") {
        column += 'data_absent_reason,';
        values += "'" + data_absent_reason + "',";
      }
			
			if (typeof interpretation !== 'undefined' && interpretation !== "") {
        column += 'interpretation,';
        values += "'" + interpretation + "',";
      }
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }		
	
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "component_id = '" + component_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "component_id = '" + component_id+ "'";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.observation_component(component_id," + column.slice(0, -1) + ") SELECT component_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.observation_component WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select component_id from BACIRO_FHIR.observation_component WHERE component_id = '" + Component_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationComponent"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationComponent"});
      });
    },
		observationReferenceRange: function updateObservationReferenceRange(req, res) {
			console.log(req.body);
			var reference_range_id  = req.params._id;
			var low  = req.body.low; 
			var high  = req.body.high;
			var type  = req.body.type;
			var applies_to  = req.body.applies_to;
			var age_low  = req.body.age_low;
			var age_high  = req.body.age_high;
			var text  = req.body.text;
			var observation_id  = req.body.observation_id;
			var component_id  = req.body.component_id;
			
			var column = "";
      var values = "";
			
			if (typeof low !== 'undefined' && low !== "") {
        column += 'low,';
        values += " " + low + ",";
      }
			
			if (typeof high !== 'undefined' && high !== "") {
        column += 'high,';
        values += " " + high + ",";
      }
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof applies_to !== 'undefined' && applies_to !== "") {
        column += 'applies_to,';
        values += "'" + applies_to + "',";
      }
			
			if (typeof age_low !== 'undefined' && age_low !== "") {
        column += 'age_low,';
        values += " " + age_low + ",";
      }
			
			if (typeof age_high !== 'undefined' && age_high !== "") {
        column += 'age_high,';
        values += " " + age_high + ",";
      }
			
			if (typeof text !== 'undefined' && text !== "") {
        column += 'text,';
        values += "'" + text + "',";
      }
			
			if (typeof component_id !== 'undefined' && component_id !== "") {
        column += 'component_id,';
        values += "'" + component_id + "',";
      }	
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }	
	
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "reference_range_id = '" + reference_range_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "reference_range_id = '" + reference_range_id+ "'";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.observation_reference_range(reference_range_id," + column.slice(0, -1) + ") SELECT reference_range_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.observation_reference_range WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select reference_range_id from BACIRO_FHIR.observation_reference_range WHERE reference_range_id = '" + reference_range_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationReferenceRange"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationReferenceRange"});
      });
    },
		observationSampledData: function updateObservationSampledData(req, res) {
			console.log(req.body);
			var sampled_data_id  = req.params._id;
			var origin  = req.body.origin;
			var period  = req.body.period;
			var factor  = req.body.factor;
			var lower_limit   = req.body.lower_limit;
			var upper_limit  = req.body.upper_limit;
			var dimensions  = req.body.dimensions;
			var data  = req.body.data;
			var observation_id  = req.body.observation_id;
			var component_id  = req.body.component_id;

			var column = "";
      var values = "";
			
			if (typeof origin !== 'undefined' && origin !== "") {
        column += 'origin,';
        values += " " + origin + ",";
      }
			
			if (typeof period !== 'undefined' && period !== "") {
        column += 'period,';
        values += " " + period + ",";
      }
			
			if (typeof factor !== 'undefined' && factor !== "") {
        column += 'factor,';
        values += " " + factor + ",";
      }
			
			if (typeof lower_limit !== 'undefined' && lower_limit !== "") {
        column += 'lower_limit,';
        values += " " + lower_limit + ",";
      }
			
			if (typeof upper_limit !== 'undefined' && upper_limit !== "") {
        column += 'upper_limit,';
        values += " " + upper_limit + ",";
      }
			
			if (typeof dimensions !== 'undefined' && dimensions !== "") {
        column += 'dimensions,';
        values += " " + dimensions + ",";
      }
			
			if (typeof data !== 'undefined' && data !== "") {
        column += 'data,';
        values += " " + data + ",";
      }
			
			if (typeof component_id !== 'undefined' && component_id !== "") {
        column += 'component_id,';
        values += "'" + component_id + "',";
      }	
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }	
	
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "sampled_data_id = '" + sampled_data_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "sampled_data_id = '" + sampled_data_id+ "'";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.sampled_data(sampled_data_id," + column.slice(0, -1) + ") SELECT sampled_data_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.sampled_data WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select sampled_data_id from BACIRO_FHIR.sampled_data WHERE sampled_data_id = '" + sampled_data_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationSampledData"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateObservationSampledData"});
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