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
			var imagingStudyId = req.query._id;
			
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
			
			if(typeof imagingStudyId !== 'undefined' && imagingStudyId !== ""){
        condition += "dr.diagnostic_report_id = '" + imagingStudyId + "' AND,";  
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
			
			var arrImagingStudy = [];
      var query = "select is.imaging_study_id as imaging_study_id, is.uid as uid, is.accession as accession, is.availability as availability, is.modality_list as modality_list, is.patient as patient, is.context_encounter as context_encounter, is.context_episode_of_care as context_episode_of_care, is.started as started, is.referrer as referrer, is.number_of_series as number_of_series, is.number_of_instances as number_of_instances, is.reason as reason, is.description as description from BACIRO_FHIR.imaging_study is " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var ImagingStudy = {};
					var arrContent = [];
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
					arrContent[i] = Content;
					
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
					ImagingStudy.context = arrContent;
					if(rez[i].started == null){
						ImagingStudy.started = formatDate(rez[i].started);
					}else{
						ImagingStudy.started = rez[i].started;
					}
					ImagingStudy.referrer = rez[i].referrer;
					ImagingStudy.numberOfSeries = rez[i].number_of_series;
					ImagingStudy.numberOfInstances = rez[i].number_of_instances;
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
					ImagingStudySeries.body_site = rez[i].body_site;
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
			var reason  = req.body.reason;
			var description  = req.body.description;
			var charge_item_id  = req.body.charge_item_id;
			var clinical_impression_investigation_id  = req.body.clinical_impression_investigation_id;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var imaging_manifest_study_id  = req.body.imaging_manifest_study_id;
			var started  = req.body.started;
			var number_of_series  = req.body.number_of_series;
			var number_of_instances  = req.body.number_of_instances;
				
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
        values += " " + series_id + ",";
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
			var imaging_study_id  = req.params.imaging_study_id;
			var uid  = req.body.uid;
			var accession  = req.body.accession;
			var availability  = req.body.availability;
			var modality_list  = req.body.modality_list;
			var patient  = req.body.patient;
			var context_encounter  = req.body.context_encounter;
			var context_episode_of_care  = req.body.context_episode_of_care;
			var referrer  = req.body.referrer;
			var reason  = req.body.reason;
			var description  = req.body.description;
			var charge_item_id  = req.body.charge_item_id;
			var clinical_impression_investigation_id  = req.body.clinical_impression_investigation_id;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var imaging_manifest_study_id  = req.body.imaging_manifest_study_id;
			var started  = req.body.started;
			var number_of_series  = req.body.number_of_series;
			var number_of_instances  = req.body.number_of_instances;
				
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
							
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "imaging_study_id = '" + imaging_study_id + "' AND " + fieldResource + " = '" + valueResource + "'";

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
			var series_id  = req.params.series_id;
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
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "series_id = '" + series_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
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
			var instance_id  = req.params.instance_id;
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
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "instance_id = '" + instance_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
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