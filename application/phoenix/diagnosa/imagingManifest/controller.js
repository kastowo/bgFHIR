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
		imagingManifest: function getImagingManifest(req, res){
			var apikey = req.params.apikey;
			var imagingManifestId = req.query._id;
			var author = req.query.based_on;
			var authoring_time = req.query.based_on;
			var endpoint = req.query.based_on;
			var identifier = req.query.based_on;
			var imaging_study = req.query.based_on;
			var patient = req.query.based_on;
			var selected_study = req.query.based_on;
			
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof imagingManifestId !== 'undefined' && imagingManifestId !== ""){
        condition += "im.imaging_manifest_id = '" + imagingManifestId + "' AND,";  
      }
			
			if((typeof author !== 'undefined' && author !== "")){ 
			 var res = author.substring(0, 3);
				if(res == 'pra'){
					join += " LEFT JOIN BACIRO_FHIR.Practitioner pra ON im.imaging_manifest_id = pra.imaging_manifest_id ";
          condition += "Practitioner_ID = '" + author + "' AND ";       
				} 
				if(res == 'imr') {
					join += " LEFT JOIN BACIRO_FHIR.Organization org ON im.imaging_manifest_id = org.imaging_manifest_id ";
          condition += "Organization_id = '" + author + "' AND ";       
				}
				
				if(res == 'dev'){
					join += " LEFT JOIN BACIRO_FHIR.Device dev ON im.imaging_manifest_id = dev.imaging_manifest_id ";
          condition += "Device_ID = '" + author + "' AND ";       
				}
				
				if(res == 'pat') {
					join += " LEFT JOIN BACIRO_FHIR.Patient pat ON im.imaging_manifest_id = pat.imaging_manifest_id ";
          condition += "Patient_id = '" + author + "' AND ";       
				}
				
				if(res == 'cap'){
					join += " LEFT JOIN BACIRO_FHIR.RELATED_PERSON rep ON im.imaging_manifest_id = rep.imaging_manifest_id ";
          condition += "RELATED_PERSON_ID = '" + author + "' AND ";       
				} 
				
				if(res == 'imr') {
					join += " LEFT JOIN BACIRO_FHIR.Nutrition_Order  no ON dr.diagnostic_report_id = no.diagnostic_report_id ";
          condition += "Nutrition_Order_id = '" + author + "' AND ";       
				}
      }
			
			if (typeof authoring_time !== 'undefined' && authoring_time !== "") {
        condition += "im.authoring_time <= to_date('" + authoring_time + "', 'yyyy-MM-dd') AND,";
      }
			
			if((typeof endpoint !== 'undefined' && endpoint !== "")){
        join += " LEFT JOIN BACIRO_FHIR.imaging_manifest_study ims ON ims.imaging_manifest_id = im.imaging_manifest_id LEFT JOIN BACIRO_FHIR.endpoint enp ON enp.endpoint_id = ims.study_id LEFT JOIN BACIRO_FHIR.imaging_manifest_series ise ON ise.series_id = enp.series_id  ";
        condition += "enp.endpoint_id = '" + endpoint + "' AND ";
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.imaging_manifest_id = im.imaging_manifest_id  ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if((typeof imaging_study !== 'undefined' && imaging_study !== "")){
        join += " LEFT JOIN BACIRO_FHIR.imaging_study ist ON ist.imaging_manifest_id = im.imaging_manifest_id  ";
        condition += "ist.imaging_study_id = '" + imaging_study + "' AND ";
      }
			
			if((typeof patient !== 'undefined' && patient !== "")){
        join += " LEFT JOIN BACIRO_FHIR.patient pat ON pat.imaging_manifest_id = im.imaging_manifest_id  ";
        condition += "pat.patient_id = '" + patient + "' AND ";
      }
			
			if((typeof selected_study !== 'undefined' && selected_study !== "")){
        join += " LEFT JOIN BACIRO_FHIR.imaging_manifest_study ims ON ims.imaging_manifest_id = im.imaging_manifest_id ";
        condition += "ims.uid = '" + selected_study + "' AND ";
      }
			
			

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrImagingManifest = [];
      var query = "select im.imaging_manifest_id as imaging_manifest_id, im.identifier as identifier, im.patient as patient, im.authoring_time as authoring_time, im.author_practitioner as author_practitioner, im.author_device as author_device, im.author_organization as author_organization, im.author_patient as author_patient, im.author_related_person as author_related_person, im.description as description from BACIRO_FHIR.IMAGING_MANIFEST im " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var ImagingManifest = {};
					var arrAuthor = [];
					var Author = {};
					if(rez[i].author_practitioner != "null"){
						Author.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].author_practitioner;
					} else {
						Author.practitioner = "";
					}
					if(rez[i].author_device != "null"){
						Author.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].author_device;
					} else {
						Author.device = "";
					}
					if(rez[i].author_organization != "null"){
						Author.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].author_organization;
					} else {
						Author.organization = "";
					}
					if(rez[i].author_patient != "null"){
						Author.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].author_patient;
					} else {
						Author.patient = "";
					}
					if(rez[i].author_related_person != "null"){
						Author.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].author_related_person;
					} else {
						Author.relatedPerson = "";
					}
					arrAuthor[i] = Author;
					
					ImagingManifest.resourceType = "ImagingManifest";
          ImagingManifest.id = rez[i].imaging_manifest_id;
					if (rez[i].patient !== 'null') {
						ImagingManifest.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient;
					} else {
						ImagingManifest.patient = "";
					}
					if(rez[i].authoring_time == null){
						ImagingManifest.authoringTime = formatDate(rez[i].authoring_time);
					}else{
						ImagingManifest.authoringTime = rez[i].authoring_time;
					}
					
					ImagingManifest.author = rez[i].arrAuthor;
					ImagingManifest.description = rez[i].description;
					
          arrImagingManifest[i] = ImagingManifest;
        }
        res.json({"err_code":0,"data": arrImagingManifest});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getImagingManifest"});
      });
    },
		imagingManifestStudy: function getImagingManifestStudy(req, res) {
			var apikey = req.params.apikey;
			
			var imagingManifestStudyId = req.query._id;
			var imagingManifestId = req.query.imaging_manifest_id;

			//susun query
			var condition = "";

			if (typeof imagingManifestStudyId !== 'undefined' && imagingManifestStudyId !== "") {
				condition += "study_id = '" + imagingManifestStudyId + "' AND ";
			}

			if (typeof imagingManifestId !== 'undefined' && imagingManifestId !== "") {
				condition += "imaging_manifest_id = '" + imagingManifestId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrImagingManifestStudy = [];
			var query = "select study_id, uid, imaging_study from BACIRO_FHIR.imaging_manifest_study " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ImagingManifestStudy = {};
					ImagingManifestStudy.id = rez[i].study_id;
					ImagingManifestStudy.uid = rez[i].uid;
					ImagingManifestStudy.imagingStudy = rez[i].imaging_study;
					
					arrImagingManifestStudy[i] = ImagingManifestStudy;
				}
				res.json({
					"err_code": 0,
					"data": arrImagingManifestStudy
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImagingManifestStudy"
				});
			});
		},
		imagingManifestSeries: function getImagingManifestSeries(req, res) {
			var apikey = req.params.apikey;
			
			var imagingManifestSeriesId = req.query._id;
			var imagingManifestStudyId = req.query.diagnostic_report_id;

			//susun query
			var condition = "";

			if (typeof imagingManifestSeriesId !== 'undefined' && imagingManifestSeriesId !== "") {
				condition += "series_id = '" + imagingManifestSeriesId + "' AND ";
			}

			if (typeof imagingManifestStudyId !== 'undefined' && imagingManifestStudyId !== "") {
				condition += "study_id = '" + imagingManifestStudyId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrImagingManifestSeries = [];
			var query = "select Series_id, uid from BACIRO_FHIR.imaging_manifest_series " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ImagingManifestSeries = {};
					ImagingManifestSeries.id = rez[i].Series_id;
					ImagingManifestSeries.uid = rez[i].uid;
					
					arrImagingManifestSeries[i] = ImagingManifestSeries;
				}
				res.json({
					"err_code": 0,
					"data": arrImagingManifestSeries
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImagingManifestSeries"
				});
			});
		},
		imagingManifestInstance: function getImagingManifestInstance(req, res) {
			var apikey = req.params.apikey;
			
			var imagingManifestInstanceId = req.query._id;
			var imagingManifestSeriesId = req.query.diagnostic_report_id;

			//susun query
			var condition = "";

			if (typeof imagingManifestInstanceId !== 'undefined' && imagingManifestInstanceId !== "") {
				condition += "instance_id = '" + imagingManifestInstanceId + "' AND ";
			}

			if (typeof imagingManifestSeriesId !== 'undefined' && imagingManifestSeriesId !== "") {
				condition += "series_id = '" + imagingManifestSeriesId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			
	
			var arrImagingManifestInstance = [];
			var query = "select instance_id, sop_class, uid from BACIRO_FHIR.imaging_manifest_instance " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ImagingManifestInstance = {};
					ImagingManifestInstance.id = rez[i].instance_id;
					ImagingManifestInstance.sopClass = rez[i].sop_class;
					ImagingManifestInstance.uid = rez[i].uid;
					
					arrImagingManifestInstance[i] = ImagingManifestInstance;
				}
				res.json({
					"err_code": 0,
					"data": arrImagingManifestInstance
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImagingManifestInstance"
				});
			});
		}
  },
	post: {
		imagingManifest: function addImagingManifest(req, res) {
			console.log(req.body);
			
			var imaging_manifest_id  = req.body.imaging_manifest_id;
			var identifier  = req.body.identifier;
			var patient  = req.body.patient;
			var authoring_time  = req.body.authoring_time;
			var author_practitioner  = req.body.author_practitioner;
			var author_device  = req.body.author_device;
			var author_organization  = req.body.author_organization;
			var author_patient  = req.body.author_patient;
			var author_related_person  = req.body.author_related_person;
			var description  = req.body.description;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			
			var column = "";
      var values = "";
			
			if (typeof identifier !== 'undefined' && identifier !== "") {
        column += 'identifier,';
        values += "'" + identifier + "',";
      }
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof author_practitioner !== 'undefined' && author_practitioner !== "") {
        column += 'author_practitioner,';
        values += "'" + author_practitioner + "',";
      }	
			
			if (typeof author_device !== 'undefined' && author_device !== "") {
        column += 'author_device,';
        values += "'" + author_device + "',";
      }	
			
			if (typeof author_organization !== 'undefined' && author_organization !== "") {
        column += 'author_organization,';
        values += "'" + author_organization + "',";
      }		
			
			if (typeof author_patient !== 'undefined' && author_patient !== "") {
        column += 'author_patient,';
        values += "'" + author_patient + "',";
      }	
			
			if (typeof author_related_person !== 'undefined' && author_related_person !== "") {
        column += 'author_related_person,';
        values += "'" + author_related_person + "',";
      }		
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }
			
			if (typeof authoring_time !== 'undefined' && authoring_time !== "") {
        column += 'authoring_time,';
				values += "to_date('"+ authoring_time + "', 'yyyy-MM-dd'),";
      }
			
			
      var query = "UPSERT INTO BACIRO_FHIR.imaging_manifest(imaging_manifest_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+imaging_manifest_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select imaging_manifest_id from BACIRO_FHIR.imaging_manifest WHERE imaging_manifest_id = '" + imaging_manifest_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImagingManifest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImagingManifest"});
      });
    },
		imagingManifestStudy: function addImagingManifestStudy(req, res) {
			console.log(req.body);
			var study_id  = req.body.study_id;
			var uid  = req.body.uid;
			var imaging_study  = req.body.imaging_study;
			var imaging_manifest_id  = req.body.imaging_manifest_id;
			
			var column = "";
      var values = "";
			
			if (typeof uid !== 'undefined' && uid !== "") {
        column += 'uid,';
        values += "'" + uid + "',";
      }
			
			if (typeof imaging_study !== 'undefined' && imaging_study !== "") {
        column += 'imaging_study,';
        values += "'" + imaging_study + "',";
      }
			
			if (typeof imaging_manifest_id !== 'undefined' && imaging_manifest_id !== "") {
        column += 'imaging_manifest_id,';
        values += "'" + imaging_manifest_id + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.imaging_manifest_study(study_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+study_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select study_id from BACIRO_FHIR.imaging_manifest_study WHERE study_id = '" + study_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImagingManifestStudy"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImagingManifestStudy"});
      });
    },
		imagingManifestSeries: function addImagingManifestSeries(req, res) {
			console.log(req.body);
			var series_id  = req.body.series_id;
			var uid  = req.body.uid;
			var study_id  = req.body.study_id;

			var column = "";
      var values = "";
			
			if (typeof uid !== 'undefined' && uid !== "") {
        column += 'uid,';
        values += "'" + uid + "',";
      }
			
			if (typeof study_id !== 'undefined' && study_id !== "") {
        column += 'study_id,';
        values += "'" + study_id + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.imaging_manifest_series(series_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+series_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select series_id from BACIRO_FHIR.imaging_manifest_series WHERE series_id = '" + series_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImagingManifestSeries"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImagingManifestSeries"});
      });
    },
		imagingManifestInstance: function addImagingManifestInstance(req, res) {
			console.log(req.body);
			var instance_id  = req.body.instance_id;
			var sop_class  = req.body.sop_class;
			var uid  = req.body.uid;
			var series_id  = req.body.series_id;
			
			var column = "";
      var values = "";
			
			if (typeof uid !== 'undefined' && uid !== "") {
        column += 'uid,';
        values += "'" + uid + "',";
      }
			
			if (typeof sop_class !== 'undefined' && sop_class !== "") {
        column += 'sop_class,';
        values += "'" + sop_class + "',";
      }
			
			if (typeof series_id !== 'undefined' && series_id !== "") {
        column += 'series_id,';
        values += "'" + series_id + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.imaging_manifest_instance(instance_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+instance_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select instance_id from BACIRO_FHIR.imaging_manifest_instance WHERE instance_id = '" + instance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImagingManifestInstance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImagingManifestInstance"});
      });
    }
		
	},
	put: {
		imagingManifest: function updateImagingManifest(req, res) {
			console.log(req.body);
			var imaging_manifest_id  = req.params.imaging_manifest_id;
			var identifier  = req.body.identifier;
			var patient  = req.body.patient;
			var authoring_time  = req.body.authoring_time;
			var author_practitioner  = req.body.author_practitioner;
			var author_device  = req.body.author_device;
			var author_organization  = req.body.author_organization;
			var author_patient  = req.body.author_patient;
			var author_related_person  = req.body.author_related_person;
			var description  = req.body.description;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			
			var column = "";
      var values = "";
			
			if (typeof identifier !== 'undefined' && identifier !== "") {
        column += 'identifier,';
        values += "'" + identifier + "',";
      }
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof author_practitioner !== 'undefined' && author_practitioner !== "") {
        column += 'author_practitioner,';
        values += "'" + author_practitioner + "',";
      }	
			
			if (typeof author_device !== 'undefined' && author_device !== "") {
        column += 'author_device,';
        values += "'" + author_device + "',";
      }	
			
			if (typeof author_organization !== 'undefined' && author_organization !== "") {
        column += 'author_organization,';
        values += "'" + author_organization + "',";
      }		
			
			if (typeof author_patient !== 'undefined' && author_patient !== "") {
        column += 'author_patient,';
        values += "'" + author_patient + "',";
      }	
			
			if (typeof author_related_person !== 'undefined' && author_related_person !== "") {
        column += 'author_related_person,';
        values += "'" + author_related_person + "',";
      }		
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }
			
			if (typeof authoring_time !== 'undefined' && authoring_time !== "") {
        column += 'authoring_time,';
				values += "to_date('"+ authoring_time + "', 'yyyy-MM-dd'),";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "imaging_manifest_id = '" + imaging_manifest_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.imaging_manifest(imaging_manifest_id," + column.slice(0, -1) + ") SELECT imaging_manifest_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.imaging_manifest WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select imaging_manifest_id from BACIRO_FHIR.imaging_manifest WHERE imaging_manifest_id = '" + imaging_manifest_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImagingManifest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImagingManifest"});
      });
    },
		imagingManifestStudy: function updateImagingManifestStudy(req, res) {
			console.log(req.body);
			var study_id  = req.params.study_id;
			var uid  = req.body.uid;
			var imaging_study  = req.body.imaging_study;
			var imaging_manifest_id  = req.body.imaging_manifest_id;
			
			var column = "";
      var values = "";
			
			if (typeof uid !== 'undefined' && uid !== "") {
        column += 'uid,';
        values += "'" + uid + "',";
      }
			
			if (typeof imaging_study !== 'undefined' && imaging_study !== "") {
        column += 'imaging_study,';
        values += "'" + imaging_study + "',";
      }
			
			if (typeof imaging_manifest_id !== 'undefined' && imaging_manifest_id !== "") {
        column += 'imaging_manifest_id,';
        values += "'" + imaging_manifest_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "study_id = '" + study_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.imaging_manifest_study(study_id," + column.slice(0, -1) + ") SELECT study_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.imaging_manifest_study WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select study_id from BACIRO_FHIR.imaging_manifest_study WHERE study_id = '" + study_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImagingManifestStudy"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImagingManifestStudy"});
      });
    },
		imagingManifestSeries: function updateImagingManifestSeries(req, res) {
			console.log(req.body);
			var series_id  = req.params.series_id;
			var uid  = req.body.uid;
			var study_id  = req.body.study_id;

			var column = "";
      var values = "";
			
			if (typeof uid !== 'undefined' && uid !== "") {
        column += 'uid,';
        values += "'" + uid + "',";
      }
			
			if (typeof study_id !== 'undefined' && study_id !== "") {
        column += 'study_id,';
        values += "'" + study_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "series_id = '" + series_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.imaging_manifest_series(series_id," + column.slice(0, -1) + ") SELECT series_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.imaging_manifest_series WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select series_id from BACIRO_FHIR.imaging_manifest_series WHERE series_id = '" + series_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImagingManifestSeries"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImagingManifestSeries"});
      });
    },
		imagingManifestInstance: function updateImagingManifestInstance(req, res) {
			console.log(req.body);
			var instance_id  = req.body.instance_id;
			var sop_class  = req.body.sop_class;
			var uid  = req.body.uid;
			var series_id  = req.body.series_id;
			
			var column = "";
      var values = "";
			
			if (typeof uid !== 'undefined' && uid !== "") {
        column += 'uid,';
        values += "'" + uid + "',";
      }
			
			if (typeof sop_class !== 'undefined' && sop_class !== "") {
        column += 'sop_class,';
        values += "'" + sop_class + "',";
      }
			
			if (typeof series_id !== 'undefined' && series_id !== "") {
        column += 'series_id,';
        values += "'" + series_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "instance_id = '" + instance_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.imaging_manifest_instance(instance_id," + column.slice(0, -1) + ") SELECT instance_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.imaging_manifest_instance WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select instance_id from BACIRO_FHIR.imaging_manifest_instance WHERE instance_id = '" + instance_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImagingManifestInstance"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImagingManifestInstance"});
      });
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