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
		imagingStudy: function getImagingStudy(req, res){
			var apikey = req.params.apikey;
			var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
			
			var imagingStudyId = req.query._id;
			var accessionId = req.query.accession;
			var basedOn = req.query.based_on;
			var seriesBodySite = req.query.body_site;
			var context = req.query.context;
			var seriesInstanceSopClass = req.query.dicom_class;
			var endpointId = req.query.endpoint;
			var identifierId = req.query.identifier;
			var seriesModality = req.query.modality;
			var patientId = req.query.patient;
			var performerId = req.query.performer;
			var reason = req.query.reason;
			var seriesUid = req.query.series;
			var started = req.query.started;
			var uid = req.query.study;
			var seriesInstanceUid = req.query.uid;
	
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof imagingStudyId !== 'undefined' && imagingStudyId !== ""){
        condition += "ist.imaging_study_id = '" + imagingStudyId + "' AND ";  
      }
			if((typeof accessionId !== 'undefined' && accessionId !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.imaging_study_id = ist.imaging_study_id ";
        condition += "i.identifier_value = '" + accessionId + "' AND ";
      }
			if((typeof basedOn !== 'undefined' && basedOn !== "")){ 
			 var res = basedOn.substring(0, 3);
			  if(res == 'ref') {
					join += " LEFT JOIN BACIRO_FHIR.REFERRAL_REQUEST ref ON ist.imaging_study_id = ref.imaging_study_id ";
          condition += "ref.REFERRAL_REQUEST_ID = '" + basedOn + "' AND ";       
				}
				if(res == 'cap'){
					join += " LEFT JOIN BACIRO_FHIR.CAREPLAN cap ON ist.imaging_study_id = cap.imaging_study_id ";
          condition += "cap.CAREPLAN_ID = '" + basedOn + "' AND ";       
				} 			
				if(res == 'prr') {
					join += " LEFT JOIN BACIRO_FHIR.PROCEDURE_REQUEST pr ON ist.imaging_study_id = pr.imaging_study_id ";
          condition += "PROCEDURE_REQUEST_id = '" + basedOn + "' AND ";       
				}
      }
			if(typeof seriesBodySite !== 'undefined' && seriesBodySite !== ""){
				join += " LEFT JOIN BACIRO_FHIR.IMAGING_STUDY_SERIES iss ON ist.imaging_study_id = iss.imaging_study_id ";
        condition += "iss.BODY_SITE = '" + seriesBodySite + "' AND ";
      }
			if((typeof context !== 'undefined' && context !== "")){ 
			 var res = context.substring(0, 3);
			  if(res == 'enc') {
					join += " LEFT JOIN BACIRO_FHIR.ENCOUNTER enc ON ist.imaging_study_id = enc.imaging_study_id ";
          condition += "enc.ENCOUNTER_ID = '" + context + "' AND ";       
				}
				if(res == 'eoc'){
					join += " LEFT JOIN BACIRO_FHIR.EPISODE_OF_CARE eoc ON ist.imaging_study_id = eoc.imaging_study_id ";
          condition += "eoc.EPISODE_OF_CARE_ID = '" + context + "' AND ";       
				}
      }
			if((typeof seriesInstanceSopClass !== 'undefined' && seriesInstanceSopClass !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IMAGING_STUDY_SERIES_INSTANCE ins ON ist.imaging_study_id = ins.imaging_study_id ";
        condition += "ins.SOP_CLASS = '" + seriesInstanceSopClass + "' AND ";
      }
			if((typeof endpointId !== 'undefined' && endpointId !== "")){
        join += " LEFT JOIN BACIRO_FHIR.ENDPOINT end ON ist.imaging_study_id = end.imaging_study_id ";
        condition += "end.ENDPOINT_ID = '" + endpointId + "' AND ";
      }
			if((typeof identifierId !== 'undefined' && identifierId !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.imaging_study_id = ist.imaging_study_id ";
        condition += "i.identifier_value = '" + identifierId + "' AND ";
      }
			if(typeof seriesModality !== 'undefined' && seriesModality !== ""){
				join += " LEFT JOIN BACIRO_FHIR.IMAGING_STUDY_SERIES iss ON ist.imaging_study_id = iss.imaging_study_id ";
        condition += "iss.MODALITY = '" + seriesModality + "' AND ";
      }
			if(typeof patientId !== 'undefined' && patientId !== ""){
				join += " LEFT JOIN BACIRO_FHIR.PATIENT pat ON ist.imaging_study_id = pat.imaging_study_id ";
        condition += "pat.PATIENT_ID = '" + patientId + "' AND ";
      }
			if(typeof performerId !== 'undefined' && performerId !== ""){
				join += " LEFT JOIN BACIRO_FHIR.PRACTITIONER pra ON ist.imaging_study_id = pra.imaging_study_id ";
        condition += "pra.PRACTITIONER_ID = '" + performerId + "' AND ";
      }
			if(typeof reason !== 'undefined' && reason !== ""){
				condition += "ist.reason = '" + reason + "' AND ";  
      }
			if(typeof seriesUid !== 'undefined' && seriesUid !== ""){
				join += " LEFT JOIN BACIRO_FHIR.IMAGING_STUDY_SERIES iss ON ist.imaging_study_id = iss.imaging_study_id ";
        condition += "iss.UID = '" + seriesUid + "' AND ";
      }
			if (typeof started !== 'undefined' && started !== "") {
        condition += "iss.STARTED = to_date('" + started + "', 'yyyy-MM-dd') AND ";
      }
			if (typeof uid !== 'undefined' && uid !== "") {
        condition += "iss.UID = '" + uid + "' AND ";
      }
			if((typeof seriesInstanceUid !== 'undefined' && seriesInstanceUid !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IMAGING_STUDY_SERIES_INSTANCE ins ON ist.imaging_study_id = ins.imaging_study_id ";
        condition += "ins.UID = '" + seriesInstanceUid + "' AND ";
      }	
			
			var offset = req.query.offset;
			var limit = req.query.limit;

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " ist.imaging_study_id > '" + offset + "' AND ";       
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
			
			var arrImagingStudy = [];
      var query = "select ist.imaging_study_id as imaging_study_id, ist.uid as uid, ist.accession as accession, ist.availability as availability, ist.modality_list as modality_list, ist.patient as patient, ist.context_encounter as context_encounter, ist.context_episode_of_care as context_episode_of_care, ist.started as started, ist.referrer as referrer, ist.number_of_series as number_of_series, ist.number_of_instances as number_of_instances, ist.procedure_code as procedure_code, ist.reason as reason, ist.description as description from BACIRO_FHIR.imaging_study ist " + fixCondition + limit;
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var ImagingStudy = {};
					var Content = {};
					if(rez[i].context_encounter != 'null'){
						Content.encounter = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].context_encounter;
					} else {
						Content.encounter = "";
					}
					if(rez[i].context_episode_of_care != 'null'){
						Content.episodeOfCare = hostFHIR + ':' + portFHIR + '/' + apikey + '/EpisodeOfCare?_id=' +  rez[i].context_episode_of_care;
					} else {
						Content.episodeOfCare = "";
					}
					
					ImagingStudy.resourceType = "ImagingStudy";
          ImagingStudy.id = rez[i].imaging_study_id;
					ImagingStudy.uid = rez[i].uid;
					ImagingStudy.accession = rez[i].accession;
					ImagingStudy.availability = rez[i].availability;
					ImagingStudy.modalityList = rez[i].modality_list;
					if (rez[i].patient !== 'null') {
						ImagingStudy.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient;
					} else {
						ImagingStudy.patient = "";
					}
					ImagingStudy.context = Content;
					if(rez[i].started == null){
						ImagingStudy.started = formatDate(rez[i].started);
					}else{
						ImagingStudy.started = rez[i].started;
					}
					ImagingStudy.referrer = rez[i].referrer;
					ImagingStudy.numberOfSeries = rez[i].number_of_series;
					ImagingStudy.numberOfInstances = rez[i].number_of_instances;
					ImagingStudy.procedureCode = rez[i].procedure_code;
					ImagingStudy.reason = rez[i].reason;
					ImagingStudy.description = rez[i].description;
					
          arrImagingStudy[i] = ImagingStudy;
        }
        res.json({"err_code":0,"data": arrImagingStudy});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getImagingStudy"});
      });
    },
		imagingStudySeries: function getImagingStudySeries(req, res) {
			var apikey = req.params.apikey;
			
			var imagingStudySeriesId = req.query._id;
			var imagingStudyId = req.query.imaging_study_id;

			//susun query
			var condition = "";

			if (typeof imagingStudySeriesId !== 'undefined' && imagingStudySeriesId !== "") {
				condition += "series_id = '" + imagingStudySeriesId + "' AND ";
			}

			if (typeof imagingStudyId !== 'undefined' && imagingStudyId !== "") {
				condition += "imaging_study_id = '" + imagingStudyId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrImagingStudySeries = [];
			var query = "select series_id, uid, number, modality, description, number_of_instances, availability, body_site, laterality, started from BACIRO_FHIR.imaging_study_series " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ImagingStudySeries = {};
					ImagingStudySeries.id = rez[i].series_id;
					ImagingStudySeries.uid = rez[i].uid;
					ImagingStudySeries.number = rez[i].number;
					ImagingStudySeries.modality = rez[i].modality;
					ImagingStudySeries.description = rez[i].description;
					ImagingStudySeries.numberOfInstances = rez[i].number_of_instances;
					ImagingStudySeries.availability = rez[i].availability;
					ImagingStudySeries.bodySite = rez[i].body_site;
					ImagingStudySeries.laterality = rez[i].laterality;
					if(rez[i].started == null){
						ImagingStudySeries.started = formatDate(rez[i].started);
					}else{
						ImagingStudySeries.started = rez[i].started;
					}
					arrImagingStudySeries[i] = ImagingStudySeries;
				}
				res.json({
					"err_code": 0,
					"data": arrImagingStudySeries
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImagingStudySeries"
				});
			});
		},
		imagingStudySeriesInstance: function getImagingStudySeriesInstance(req, res) {
			var apikey = req.params.apikey;
			
			var imagingStudySeriesInstanceId = req.query._id;
			var imagingStudySeriesId = req.query.series_id;

			//susun query
			var condition = "";

			if (typeof imagingStudySeriesInstanceId !== 'undefined' && imagingStudySeriesInstanceId !== "") {
				condition += "instance_id = '" + imagingStudySeriesInstanceId + "' AND ";
			}

			if (typeof imagingStudySeriesId !== 'undefined' && imagingStudySeriesId !== "") {
				condition += "series_id = '" + imagingStudySeriesId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrImagingStudySeriesInstance = [];
			var query = "select instance_id, uid, number, sop_class, title from BACIRO_FHIR.imaging_study_series_instance " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ImagingStudySeriesInstance = {};
					ImagingStudySeriesInstance.id = rez[i].SeriesInstance_id;
					ImagingStudySeriesInstance.uid = rez[i].uid;
					ImagingStudySeriesInstance.number = rez[i].number;
					ImagingStudySeriesInstance.sopClass = rez[i].sop_class;
					ImagingStudySeriesInstance.title = rez[i].title;
					
					arrImagingStudySeriesInstance[i] = ImagingStudySeriesInstance;
				}
				res.json({
					"err_code": 0,
					"data": arrImagingStudySeriesInstance
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImagingStudySeriesInstance"
				});
			});
		},
		
		imagingStudyBasedOnReferralRequest: function getImagingStudyBasedOnReferralRequest(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var imagingStudyId = req.query.imaging_study_id;

			//susun query
			var condition = '';

			if (typeof imagingStudyId !== 'undefined' && imagingStudyId !== "") {
				condition += "imaging_study_id = '" + imagingStudyId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrImagingStudyBasedOnReferralRequest = [];
			var query = 'select referral_request_id from BACIRO_FHIR.referral_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var imagingStudyBasedOnReferralRequest = {};
					if(rez[i].referral_request_id != "null"){
						imagingStudyBasedOnReferralRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/referralRequest?_id=' +  rez[i].referral_request_id;
					} else {
						imagingStudyBasedOnReferralRequest.id = "";
					}
					
					arrImagingStudyBasedOnReferralRequest[i] = imagingStudyBasedOnReferralRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrImagingStudyBasedOnReferralRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImagingStudyBasedOnReferralRequest"
				});
			});
		},
		imagingStudyBasedOnCarePlan: function getImagingStudyBasedOnCarePlan(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var imagingStudyId = req.query.imaging_study_id;

			//susun query
			var condition = '';

			if (typeof imagingStudyId !== 'undefined' && imagingStudyId !== "") {
				condition += "imaging_study_id = '" + imagingStudyId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrImagingStudyBasedOnCarePlan = [];
			var query = 'select careplan_id from BACIRO_FHIR.careplan ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var imagingStudyBasedOnCarePlan = {};
					if(rez[i].careplan_id != "null"){
						imagingStudyBasedOnCarePlan.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/careplan?_id=' +  rez[i].careplan_id;
					} else {
						imagingStudyBasedOnCarePlan.id = "";
					}
					
					arrImagingStudyBasedOnCarePlan[i] = imagingStudyBasedOnCarePlan;
				}
				res.json({
					"err_code": 0,
					"data": arrImagingStudyBasedOnCarePlan
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImagingStudyBasedOnCarePlan"
				});
			});
		},
		imagingStudyBasedOnProcedureRequest: function getImagingStudyBasedOnProcedureRequest(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var imagingStudyId = req.query.imaging_study_id;

			//susun query
			var condition = '';

			if (typeof imagingStudyId !== 'undefined' && imagingStudyId !== "") {
				condition += "imaging_study_id = '" + imagingStudyId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrImagingStudyBasedOnProcedureRequest = [];
			var query = 'select procedure_request_id from BACIRO_FHIR.procedure_request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var imagingStudyBasedOnProcedureRequest = {};
					if(rez[i].procedure_request_id != "null"){
						imagingStudyBasedOnProcedureRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/procedureRequest?_id=' +  rez[i].procedure_request_id;
					} else {
						imagingStudyBasedOnProcedureRequest.id = "";
					}
					
					arrImagingStudyBasedOnProcedureRequest[i] = imagingStudyBasedOnProcedureRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrImagingStudyBasedOnProcedureRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImagingStudyBasedOnProcedureRequest"
				});
			});
		},
		imagingStudyInterpreter: function getImagingStudyInterpreter(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var imagingStudyId = req.query.imaging_study_id;

			//susun query
			var condition = '';

			if (typeof imagingStudyId !== 'undefined' && imagingStudyId !== "") {
				condition += "imaging_study_id = '" + imagingStudyId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrImagingStudyInterpreter = [];
			var query = 'select practitioner_id from BACIRO_FHIR.practitioner ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var imagingStudyInterpreter = {};
					if(rez[i].practitioner_id != "null"){
						imagingStudyInterpreter.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/practitioner?_id=' +  rez[i].practitioner_id;
					} else {
						imagingStudyInterpreter.id = "";
					}
					
					arrImagingStudyInterpreter[i] = imagingStudyInterpreter;
				}
				res.json({
					"err_code": 0,
					"data": arrImagingStudyInterpreter
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImagingStudyInterpreter"
				});
			});
		},
		imagingStudyEndpoint: function getImagingStudyEndpoint(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var imagingStudyId = req.query.imaging_study_id;

			//susun query
			var condition = '';

			if (typeof imagingStudyId !== 'undefined' && imagingStudyId !== "") {
				condition += "imaging_study_id = '" + imagingStudyId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrImagingStudyEndpoint = [];
			var query = 'select endpoint_id from BACIRO_FHIR.endpoint ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var imagingStudyEndpoint = {};
					if(rez[i].endpoint_id != "null"){
						imagingStudyEndpoint.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/endpoint?_id=' +  rez[i].endpoint_id;
					} else {
						imagingStudyEndpoint.id = "";
					}
					
					arrImagingStudyEndpoint[i] = imagingStudyEndpoint;
				}
				res.json({
					"err_code": 0,
					"data": arrImagingStudyEndpoint
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImagingStudyEndpoint"
				});
			});
		},
		imagingStudyProcedureReference: function getImagingStudyProcedureReference(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var imagingStudyId = req.query.imaging_study_id;

			//susun query
			var condition = '';

			if (typeof imagingStudyId !== 'undefined' && imagingStudyId !== "") {
				condition += "imaging_study_procedure_reference_id = '" + imagingStudyId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrImagingStudyProcedureReference = [];
			var query = 'select procedure_id from BACIRO_FHIR.procedure ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var imagingStudyProcedureReference = {};
					if(rez[i].procedure_id != "null"){
						imagingStudyProcedureReference.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/procedure?_id=' +  rez[i].procedure_id;
					} else {
						imagingStudyProcedureReference.id = "";
					}
					
					arrImagingStudyProcedureReference[i] = imagingStudyProcedureReference;
				}
				res.json({
					"err_code": 0,
					"data": arrImagingStudyProcedureReference
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImagingStudyProcedureReference"
				});
			});
		},
		imagingStudySeriesEndpoint: function getImagingStudySeriesEndpoint(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var imagingStudyId = req.query.imaging_study_series_id;

			//susun query
			var condition = '';

			if (typeof imagingStudyId !== 'undefined' && imagingStudyId !== "") {
				condition += "imaging_study_series_id = '" + imagingStudyId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrImagingStudySeriesEndpoint = [];
			var query = 'select endpoint_id from BACIRO_FHIR.endpoint ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var imagingStudySeriesEndpoint = {};
					if(rez[i].endpoint_id != "null"){
						imagingStudySeriesEndpoint.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/endpoint?_id=' +  rez[i].endpoint_id;
					} else {
						imagingStudySeriesEndpoint.id = "";
					}
					
					arrImagingStudySeriesEndpoint[i] = imagingStudySeriesEndpoint;
				}
				res.json({
					"err_code": 0,
					"data": arrImagingStudySeriesEndpoint
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImagingStudySeriesEndpoint"
				});
			});
		},
		imagingStudySeriesPerformer: function getImagingStudySeriesPerformer(req, res) {
			var apikey = req.params.apikey;
			
			var _id = req.query._id;
			var imagingStudyId = req.query.imaging_study_series_id;

			//susun query
			var condition = '';

			if (typeof imagingStudyId !== 'undefined' && imagingStudyId !== "") {
				condition += "imaging_study_series_id = '" + imagingStudyId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrImagingStudySeriesPerformer = [];
			var query = 'select practitioner_id from BACIRO_FHIR.practitioner ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var imagingStudySeriesPerformer = {};
					if(rez[i].practitioner_id != "null"){
						imagingStudySeriesPerformer.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/practitioner?_id=' +  rez[i].practitioner_id;
					} else {
						imagingStudySeriesPerformer.id = "";
					}
					
					arrImagingStudySeriesPerformer[i] = imagingStudySeriesPerformer;
				}
				res.json({
					"err_code": 0,
					"data": arrImagingStudySeriesPerformer
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImagingStudySeriesPerformer"
				});
			});
		},		
  },
	post: {
		imagingStudy: function addImagingStudy(req, res) {
			console.log(req.body);
			var imaging_study_id  = req.body.imaging_study_id;
			var uid  = req.body.uid;
			var accession  = req.body.accession;
			var availability  = req.body.availability;
			var modality_list  = req.body.modality_list;
			var patient  = req.body.patient;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var referrer  = req.body.referrer;
			var number_of_series  = req.body.number_of_series;
			var number_of_instances  = req.body.number_of_instances;
			var procedure_code  = req.body.procedure_code;
			var reason  = req.body.reason;
			var description  = req.body.description;
			var charge_item_id  = req.body.charge_item_id;
			var clinical_impression_investigation_id  = req.body.clinical_impression_investigation_id;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var imaging_manifest_study_id  = req.body.imaging_manifest_study_id;
			var started  = req.body.started;
				
			var column = "";
      var values = "";
			
			if (typeof uid !== 'undefined' && uid !== "") {
        column += 'uid,';
        values += "'" + uid + "',";
      }
			
			if (typeof accession !== 'undefined' && accession !== "") {
        column += 'accession,';
        values += "'" + accession + "',";
      }	
			
			if (typeof availability !== 'undefined' && availability !== "") {
        column += 'availability,';
        values += "'" + availability + "',";
      }	
			
			if (typeof modality_list !== 'undefined' && modality_list !== "") {
        column += 'modality_list,';
        values += "'" + modality_list + "',";
      }	
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }		
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }	
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }
			
			if (typeof referrer !== 'undefined' && referrer !== "") {
        column += 'referrer,';
        values += "'" + referrer + "',";
      }	
			
			if (typeof reason !== 'undefined' && reason !== "") {
        column += 'reason,';
        values += "'" + reason + "',";
      }		
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }		
			
			if (typeof charge_item_id !== 'undefined' && charge_item_id !== "") {
        column += 'charge_item_id,';
        values += "'" + charge_item_id + "',";
      }		
			
			if (typeof clinical_impression_investigation_id !== 'undefined' && clinical_impression_investigation_id !== "") {
        column += 'clinical_impression_investigation_id,';
        values += "'" + clinical_impression_investigation_id + "',";
      }		
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }		
			
			if (typeof imaging_manifest_study_id !== 'undefined' && imaging_manifest_study_id !== "") {
        column += 'imaging_manifest_study_id,';
        values += "'" + imaging_manifest_study_id + "',";
      }		
			
			if (typeof started !== 'undefined' && started !== "") {
        column += 'started,';
				values += "to_date('"+ started + "', 'yyyy-MM-dd'),";
      }
		
			if (typeof number_of_series !== 'undefined' && number_of_series !== "") {
        column += 'number_of_series,';
        values += " " + number_of_series + ",";
      }		
			
			if (typeof number_of_instances !== 'undefined' && number_of_instances !== "") {
        column += 'number_of_instances,';
        values += " " + number_of_instances + ",";
      }
			
			if (typeof procedure_code !== 'undefined' && procedure_code !== "") {
        column += 'procedure_code,';
        values += " " + procedure_code + ",";
      }		
			
      var query = "UPSERT INTO BACIRO_FHIR.imaging_study(imaging_study_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+imaging_study_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select imaging_study_id from BACIRO_FHIR.imaging_study WHERE imaging_study_id = '" + imaging_study_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImagingStudy"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImagingStudy"});
      });
    },
		imagingStudySeries: function addImagingStudySeries(req, res) {
			console.log(req.body);
			var series_id  = req.body.series_id;
			var uid  = req.body.uid;
			var number  = req.body.number;
			var modality  = req.body.modality;
			var description  = req.body.description;
			var number_of_instances  = req.body.number_of_instances;
			var availability  = req.body.availability;
			var body_site  = req.body.body_site;
			var laterality  = req.body.laterality;
			var started  = req.body.started;
			var imaging_study_id  = req.body.imaging_study_id;
			
			var column = "";
      var values = "";
			
			if (typeof uid !== 'undefined' && uid !== "") {
        column += 'uid,';
        values += "'" + uid + "',";
      }
			
			if (typeof number !== 'undefined' && number !== "") {
        column += 'number,';
        values += " " + number + ",";
      }
			
			if (typeof modality !== 'undefined' && modality !== "") {
        column += 'modality,';
        values += "'" + modality + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof number_of_instances !== 'undefined' && number_of_instances !== "") {
        column += 'number_of_instances,';
        values += " " + number_of_instances + ",";
      }	
			
			if (typeof availability !== 'undefined' && availability !== "") {
        column += 'availability,';
        values += "'" + availability + "',";
      }	
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
      }	
			
			if (typeof laterality !== 'undefined' && laterality !== "") {
        column += 'laterality,';
        values += "'" + laterality + "',";
      }	
			
			if (typeof started !== 'undefined' && started !== "") {
        column += 'started,';
				values += "to_date('"+ started + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof imaging_study_id !== 'undefined' && imaging_study_id !== "") {
        column += 'imaging_study_id,';
        values += "'" + imaging_study_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.imaging_study_series(series_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+series_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select series_id from BACIRO_FHIR.imaging_study_series WHERE series_id = '" + series_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImagingStudySeries"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImagingStudySeries"});
      });
    },
		imagingStudySeriesInstance: function addImagingStudySeriesInstance(req, res) {
			console.log(req.body);
			var instance_id  = req.body.instance_id;
			var uid  = req.body.uid;
			var number  = req.body.number;
			var sop_class  = req.body.sop_class;
			var title  = req.body.title;
			var series_id  = req.body.series_id;
			
			var column = "";
      var values = "";
			
			if (typeof uid !== 'undefined' && uid !== "") {
        column += 'uid,';
        values += "'" + uid + "',";
      }
			
			if (typeof number !== 'undefined' && number !== "") {
        column += 'number,';
        values += " " + number + ",";
      }
			
			if (typeof sop_class !== 'undefined' && sop_class !== "") {
        column += 'sop_class,';
        values += "'" + sop_class + "',";
      }
			
			if (typeof title !== 'undefined' && title !== "") {
        column += 'title,';
        values += "'" + title + "',";
      }	
			
			if (typeof series_id !== 'undefined' && series_id !== "") {
        column += 'series_id,';
        values += "'" + series_id + "',";
      }	
			
      var query = "UPSERT INTO BACIRO_FHIR.imaging_study_series_instance(instance_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+instance_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select instance_id from BACIRO_FHIR.imaging_study_series_instance WHERE instance_id = '" + instance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImagingStudySeriesInstance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImagingStudySeriesInstance"});
      });
    },
	},
	put: {
		imagingStudy: function updateImagingStudy(req, res) {
			console.log(req.body);
			var imaging_study_id  = req.params._id;
			var uid  = req.body.uid;
			var accession  = req.body.accession;
			var availability  = req.body.availability;
			var modality_list  = req.body.modality_list;
			var patient  = req.body.patient;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var referrer  = req.body.referrer;
			var number_of_series  = req.body.number_of_series;
			var number_of_instances  = req.body.number_of_instances;
			var procedure_code  = req.body.procedure_code;
			var reason  = req.body.reason;
			var description  = req.body.description;
			var charge_item_id  = req.body.charge_item_id;
			var clinical_impression_investigation_id  = req.body.clinical_impression_investigation_id;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var imaging_manifest_study_id  = req.body.imaging_manifest_study_id;
			var started  = req.body.started;
			
			var column = "";
      var values = "";
			
			if (typeof uid !== 'undefined' && uid !== "") {
        column += 'uid,';
        values += "'" + uid + "',";
      }
			
			if (typeof accession !== 'undefined' && accession !== "") {
        column += 'accession,';
        values += "'" + accession + "',";
      }	
			
			if (typeof availability !== 'undefined' && availability !== "") {
        column += 'availability,';
        values += "'" + availability + "',";
      }	
			
			if (typeof modality_list !== 'undefined' && modality_list !== "") {
        column += 'modality_list,';
        values += "'" + modality_list + "',";
      }	
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }		
			
			if (typeof context_encounter !== 'undefined' && context_encounter !== "") {
        column += 'context_encounter,';
        values += "'" + context_encounter + "',";
      }	
			
			if (typeof context_episode_of_care !== 'undefined' && context_episode_of_care !== "") {
        column += 'context_episode_of_care,';
        values += "'" + context_episode_of_care + "',";
      }
			
			if (typeof referrer !== 'undefined' && referrer !== "") {
        column += 'referrer,';
        values += "'" + referrer + "',";
      }	
			
			if (typeof reason !== 'undefined' && reason !== "") {
        column += 'reason,';
        values += "'" + reason + "',";
      }		
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }		
			
			if (typeof charge_item_id !== 'undefined' && charge_item_id !== "") {
        column += 'charge_item_id,';
        values += "'" + charge_item_id + "',";
      }		
			
			if (typeof clinical_impression_investigation_id !== 'undefined' && clinical_impression_investigation_id !== "") {
        column += 'clinical_impression_investigation_id,';
        values += "'" + clinical_impression_investigation_id + "',";
      }		
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }		
			
			if (typeof imaging_manifest_study_id !== 'undefined' && imaging_manifest_study_id !== "") {
        column += 'imaging_manifest_study_id,';
        values += "'" + imaging_manifest_study_id + "',";
      }		
			
			if (typeof started !== 'undefined' && started !== "") {
        column += 'started,';
				values += "to_date('"+ started + "', 'yyyy-MM-dd'),";
      }
		
			if (typeof number_of_series !== 'undefined' && number_of_series !== "") {
        column += 'number_of_series,';
        values += " " + number_of_series + ",";
      }		
			
			if (typeof number_of_instances !== 'undefined' && number_of_instances !== "") {
        column += 'number_of_instances,';
        values += " " + number_of_instances + ",";
      }	
			
			if (typeof procedure_code !== 'undefined' && procedure_code !== "") {
        column += 'procedure_code,';
        values += " " + procedure_code + ",";
      }		
							
			var condition = "imaging_study_id = '" + imaging_study_id + "'";

      var query = "UPSERT INTO BACIRO_FHIR.imaging_study(imaging_study_id," + column.slice(0, -1) + ") SELECT imaging_study_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.imaging_study WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select imaging_study_id from BACIRO_FHIR.imaging_study WHERE imaging_study_id = '" + imaging_study_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImagingStudy"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImagingStudy"});
      });
    },
		imagingStudySeries: function updateImagingStudySeries(req, res) {
			console.log(req.body);
			var series_id  = req.params._id;
			var uid  = req.body.uid;
			var number  = req.body.number;
			var modality  = req.body.modality;
			var description  = req.body.description;
			var number_of_instances  = req.body.number_of_instances;
			var availability  = req.body.availability;
			var body_site  = req.body.body_site;
			var laterality  = req.body.laterality;
			var started  = req.body.started;
			var imaging_study_id  = req.body.imaging_study_id;
			
			var column = "";
      var values = "";
			
			if (typeof uid !== 'undefined' && uid !== "") {
        column += 'uid,';
        values += "'" + uid + "',";
      }
			
			if (typeof number !== 'undefined' && number !== "") {
        column += 'number,';
        values += " " + number + ",";
      }
			
			if (typeof modality !== 'undefined' && modality !== "") {
        column += 'modality,';
        values += "'" + modality + "',";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof number_of_instances !== 'undefined' && number_of_instances !== "") {
        column += 'number_of_instances,';
        values += " " + number_of_instances + ",";
      }	
			
			if (typeof availability !== 'undefined' && availability !== "") {
        column += 'availability,';
        values += "'" + availability + "',";
      }	
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
      }	
			
			if (typeof laterality !== 'undefined' && laterality !== "") {
        column += 'laterality,';
        values += "'" + laterality + "',";
      }	
			
			if (typeof started !== 'undefined' && started !== "") {
        column += 'started,';
				values += "to_date('"+ started + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof imaging_study_id !== 'undefined' && imaging_study_id !== "") {
        column += 'imaging_study_id,';
        values += "'" + imaging_study_id + "',";
      }	

      
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "series_id = '" + series_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "series_id = '" + series_id+ "'";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.imaging_study_series(series_id," + column.slice(0, -1) + ") SELECT series_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.imaging_study_series WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select series_id from BACIRO_FHIR.imaging_study_series WHERE series_id = '" + series_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImagingStudySeries"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImagingStudySeries"});
      });
    },
		imagingStudySeriesInstance: function updateImagingStudySeriesInstance(req, res) {
			console.log(req.body);
			var instance_id  = req.params._id;
			var uid  = req.body.uid;
			var number  = req.body.number;
			var sop_class  = req.body.sop_class;
			var title  = req.body.title;
			var series_id  = req.body.series_id;
			
			var column = "";
      var values = "";
			
			if (typeof uid !== 'undefined' && uid !== "") {
        column += 'uid,';
        values += "'" + uid + "',";
      }
			
			if (typeof number !== 'undefined' && number !== "") {
        column += 'number,';
        values += " " + number + ",";
      }
			
			if (typeof sop_class !== 'undefined' && sop_class !== "") {
        column += 'sop_class,';
        values += "'" + sop_class + "',";
      }
			
			if (typeof title !== 'undefined' && title !== "") {
        column += 'title,';
        values += "'" + title + "',";
      }	
			
			if (typeof series_id !== 'undefined' && series_id !== "") {
        column += 'series_id,';
        values += " " + series_id + ",";
      }	
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "instance_id = '" + instance_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "instance_id = '" + instance_id+ "'";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.imaging_study_series_instance(instance_id," + column.slice(0, -1) + ") SELECT instance_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.imaging_study_series_instance WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select instance_id from BACIRO_FHIR.imaging_study_series_instance WHERE instance_id = '" + instance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImagingStudySeriesInstance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImagingStudySeriesInstance"});
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