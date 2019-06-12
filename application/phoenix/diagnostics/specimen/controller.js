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
		specimen: function getSpecimen(req, res){
			var apikey = req.params.apikey;
			var specimenId = req.query._id;
			var accession = req.query.accession;
			var bodysite = req.query.bodysite;
			var collected = req.query.collected;
			var collector = req.query.collector;
			var container = req.query.container;
			var container_id = req.query.container_id;
			var identifier = req.query.identifier;
			var parent = req.query.parent;
			var patient = req.query.patient;
			var status = req.query.status;
			var subject = req.query.subject;
			var type = req.query.type;
			
			
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof specimenId !== 'undefined' && specimenId !== ""){
        condition += "spe.specimen_id = '" + specimenId + "' AND,";  
      }
			
			if((typeof accession !== 'undefined' && accession !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER ia ON ia.identifier_id = spe.accession_identifier ";
				condition += "ia.identifier_value = '" + accession + "' AND ";
      }
			
			if(typeof bodysite !== 'undefined' && bodysite !== ""){
        condition += "spe.body_site = '" + bodysite + "' AND,";  
      }
			
			if(typeof collected !== 'undefined' && collected !== ""){
			  condition += "spe.collected_date_time == to_date('" + collected + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof collector !== 'undefined' && collector !== ""){
        condition += "spe.collector = '" + collector + "' AND,";  
      }
			
			if((typeof container !== 'undefined' && container !== "") || (typeof container_id !== 'undefined' && container_id !== "")){
        join += " LEFT JOIN BACIRO_FHIR.SPECIMEN_CONTAINER spc ON spc.specimen_id = spe.specimen_id ";
				if((typeof container !== 'undefined' && container !== "")){
        	condition += "spc.type = '" + container + "' AND ";
				}
				if((typeof container_id !== 'undefined' && container_id !== "")){
					join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER isc ON isc.specimen_container = spc.container_id ";
					condition += "isc.identifier_value = '" + container_id + "' AND ";
				}
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.specimen_id = spe.specimen_id ";
				condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if(typeof parent !== 'undefined' && parent !== ""){
			  condition += "spe.parent = '" + parent + "' AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
			  condition += "spe.subject_patient = '" + patient + "' AND,";  
      }
			
			if(typeof status !== 'undefined' && status !== ""){
				condition += "spe.status = '" + status + "' AND,";  
      }
			
			if(typeof subject !== 'undefined' && subject !== ""){
				condition += "(spe.SUBJECT_PATIENT = '" + subject + "' OR spe.SUBJECT_GROUP = '" + subject + "' OR spe.subject_device = '" + subject + "' OR spe.subject_substance = '" + subject + "') AND,";  
			}
			
			if(typeof type !== 'undefined' && type !== ""){
				condition += "spe.type = '" + type + "' AND,";  
      }
			
			var offset = req.query.offset;
			var limit = req.query.limit;

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " spe.specimen_id > '" + offset + "' AND ";       
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
			      
      var arrSpecimen = [];
			var query = "select spe.specimen_id as specimen_id, spe.accession_identifier as accession_identifier, spe.status as status, spe.type as type, spe.subject_patient as subject_patient, spe.subject_group as subject_group, spe.subject_device as subject_device, spe.subject_substance as subject_substance, spe.received_time as received_time, spe.collector as collector, spe.collected_date_time as collected_date_time, spe.collected_period_start as collected_period_start, spe.collected_period_end as collected_period_end, spe.quantity_low as quantity_low, spe.quantity_high as quantity_high, spe.method as method, spe.body_site as body_site from BACIRO_FHIR.specimen spe " + fixCondition + limit;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Specimen = {};
					
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
					if(rez[i].subject_substance != "null"){
						Subject.substance = hostFHIR + ':' + portFHIR + '/' + apikey + '/Substance?_id=' +  rez[i].subject_substance;
					} else {
						Subject.substance = "";
					}
					
					Specimen.resourceType = "Specimen";
          Specimen.id = rez[i].specimen_id;
					Specimen.accessionIdentifier = rez[i].accession_identifier;
					Specimen.status = rez[i].status;
					Specimen.type = rez[i].type;
					Specimen.subject =Subject;
					if(rez[i].received_time == null){
						Specimen.receivedTime = formatDate(rez[i].received_time);
					} else {
						Specimen.receivedTime = rez[i].received_time;
					}
					var Collection = {};
					Collection.collector = rez[i].collector;
					var Collected = {};
					if(rez[i].collected_date_time == null){
						Collected.collectedDateTime = formatDate(rez[i].collected_date_time);
          }else{
						Collected.collectedDateTime = rez[i].collected_date_time;
          }
					var collectedperiod_start,collectedperiod_end;
          if(rez[i].collected_period_start == null){
            collectedperiod_start = formatDate(rez[i].collected_period_start);  
          }else{
            collectedperiod_start = rez[i].collected_period_start;  
          }
          if(rez[i].collected_period_end == null){
            collectedperiod_end = formatDate(rez[i].collected_period_end);  
          }else{
            collectedperiod_end = rez[i].collected_period_end;  
          }
					Collected.collectedPeriod = collectedperiod_start + ' to ' + collectedperiod_end;
					Collection.collected = Collected;
					Collection.quantity = rez[i].quantity_low + ' to ' + rez[i].quantity_high;
					Collection.method = rez[i].method;
					Collection.bodySite = rez[i].body_site; 
					Specimen.collection = Collection;
					arrSpecimen[i] = Specimen;
        }
        res.json({"err_code":0,"data": arrSpecimen});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getSpecimen"});
      });
    },
		specimenProcessing: function getSpecimenProcessing(req, res) {
			var apikey = req.params.apikey;
			
			var specimenProcessingId = req.query._id;
			var specimenId = req.query.diagnostic_report_id;

			//susun query
			var condition = "";

			if (typeof specimenProcessingId !== 'undefined' && specimenProcessingId !== "") {
				condition += "processing_id = '" + specimenProcessingId + "' AND ";
			}

			if (typeof specimenId !== 'undefined' && specimenId !== "") {
				condition += "specimen_id = '" + specimenId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrSpecimenProcessing = [];
			var query = "select processing_id, description, procedure, time_date_time, time_period_start, time_period_end from BACIRO_FHIR.specimen_processing " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var SpecimenProcessing = {};
					SpecimenProcessing.id = rez[i].processing_id;
					SpecimenProcessing.description = rez[i].description;
					SpecimenProcessing.procedure = rez[i].procedure;
					var Time = {};
					if(rez[i].time_period_start == null){
						Time.timeDateTime = formatDate(rez[i].time_date_time);
          }else{
            Time.timeDateTime = rez[i].time_date_time;
          }
					var timeperiod_start,timeperiod_end;
          if(rez[i].time_period_start == null){
            timeperiod_start = formatDate(rez[i].time_period_start);  
          }else{
            timeperiod_start = rez[i].time_period_start;  
          }

          if(rez[i].time_period_end == null){
            timeperiod_end = formatDate(rez[i].time_period_end);  
          }else{
            timeperiod_end = rez[i].time_period_end;  
          }
					Time.timePeriod = timeperiod_start + ' to ' + timeperiod_end;
					SpecimenProcessing.time = Time;
					arrSpecimenProcessing[i] = SpecimenProcessing;
				}
				res.json({
					"err_code": 0,
					"data": arrSpecimenProcessing
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getSpecimenProcessing"
				});
			});
		},
		specimenContainer: function getSpecimenContainer(req, res) {
			var apikey = req.params.apikey;
			
			var specimenContainerId = req.query._id;
			var specimenId = req.query.diagnostic_report_id;

			//susun query
			var condition = "";

			if (typeof specimenContainerId !== 'undefined' && specimenContainerId !== "") {
				condition += "container_id = '" + specimenContainerId + "' AND ";
			}

			if (typeof specimenId !== 'undefined' && specimenId !== "") {
				condition += "specimen_id = '" + specimenId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrSpecimenContainer = [];
			var query = "select container_id, description, type, capacity, specimen_quantity, additive_codeable_concept, additive_reference from BACIRO_FHIR.specimen_container " + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var SpecimenContainer = {};
					SpecimenContainer.id = rez[i].container_id;
					SpecimenContainer.description = rez[i].description;
					SpecimenContainer.type = rez[i].type;
					SpecimenContainer.capacity = rez[i].capacity;
					SpecimenContainer.specimenQuantity = rez[i].specimen_quantity;
					var Additive = {};
					Additive.additiveCodeableConcept = rez[i].additive_codeable_concept;
					Additive.additiveReference = rez[i].additive_reference;
					SpecimenContainer.additive = Additive;
					
					arrSpecimenContainer[i] = SpecimenContainer;
				}
				res.json({
					"err_code": 0,
					"data": arrSpecimenContainer
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getSpecimenContainer"
				});
			});
		},
		
		specimenParent: function getSpecimenParent(req, res) {
			var apikey = req.params.apikey;
			
			var specimenId = req.query._id;
			var ParentId = req.query.specimen_id;

			//susun query
			var condition = '';

			if (typeof ParentId !== 'undefined' && ParentId !== "") {
				condition += "parent = '" + ParentId + "' AND ";
			}

			if (typeof specimenId !== 'undefined' && specimenId !== "") {
				condition += "specimen_id = '" + specimenId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrSpecimenParent = [];
			var query = 'select specimen_id from BACIRO_FHIR.specimen ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var specimenParent = {};
					if(rez[i].specimen_id != "null"){
						specimenParent.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/specimen?_id=' +  rez[i].specimen_id;
					} else {
						specimenParent.id = "";
					}
					
					arrSpecimenParent[i] = specimenParent;
				}
				res.json({
					"err_code": 0,
					"data": arrSpecimenParent
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getSpecimenParent"
				});
			});
		},
		specimenRequest: function getSpecimenRequest(req, res) {
			var apikey = req.params.apikey;
			
			var RequestId = req.query._id;
			var specimenId = req.query.specimen_id;

			//susun query
			var condition = '';

			if (typeof RequestId !== 'undefined' && RequestId !== "") {
				condition += "procedure_Request_id = '" + RequestId + "' AND ";
			}

			if (typeof specimenId !== 'undefined' && specimenId !== "") {
				condition += "specimen_id = '" + specimenId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrSpecimenRequest = [];
			var query = 'select procedure_Request_id from BACIRO_FHIR.procedure_Request ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var specimenRequest = {};
					if(rez[i].procedure_Request_id != "null"){
						specimenRequest.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/ProcedureRequest?_id=' +  rez[i].procedure_Request_id;
					} else {
						specimenRequest.id = "";
					}
					
					arrSpecimenRequest[i] = specimenRequest;
				}
				res.json({
					"err_code": 0,
					"data": arrSpecimenRequest
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getSpecimenRequest"
				});
			});
		},
		specimenProcessingAdditive: function getSpecimenProcessingAdditive(req, res) {
			var apikey = req.params.apikey;
			
			var ProcessingAdditiveId = req.query._id;
			var specimenId = req.query.specimen_id;

			//susun query
			var condition = '';

			if (typeof ProcessingAdditiveId !== 'undefined' && ProcessingAdditiveId !== "") {
				condition += "substance_id = '" + ProcessingAdditiveId + "' AND ";
			}

			if (typeof specimenId !== 'undefined' && specimenId !== "") {
				condition += "specimen_processing_id = '" + specimenId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrSpecimenProcessingAdditive = [];
			var query = 'select substance_id from BACIRO_FHIR.substance ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var specimenProcessingAdditive = {};
					if(rez[i].substance_id != "null"){
						specimenProcessingAdditive.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/substance?_id=' +  rez[i].substance_id;
					} else {
						specimenProcessingAdditive.id = "";
					}
					
					arrSpecimenProcessingAdditive[i] = specimenProcessingAdditive;
				}
				res.json({
					"err_code": 0,
					"data": arrSpecimenProcessingAdditive
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getSpecimenProcessingAdditive"
				});
			});
		},
  },
	post: {
		specimen: function addSpecimen(req, res) {
			console.log(req.body);
			var specimen_id  = req.body.specimen_id;
			var accession_identifier  = req.body.accession_identifier;
			var status  = req.body.status;
			var type  = req.body.type;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var subject_device  = req.body.subject_device;
			var subject_substance  = req.subject_substance;
			var received_time  = req.body.received_time;
			var collector  = req.body.collector;
			var collected_date_time  = req.body.collected_date_time;
			var collected_period_start  = req.body.collected_period_start;
			var collected_period_end  = req.body.collected_period_end;
			var quantity_low  = req.body.quantity_low;
			var quantity_high  = req.body.quantity_high;
			var method  = req.body.method;
			var body_site  = req.body.body_site;
			var parent  = req.body.parent;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var procedure_request_id  = req.body.procedure_request_id;
			var observation_id  = req.body.observation_id;
			var sequence_id  = req.body.sequence_id;
			var media_id  = req.body.media_id;
			
			var column = "";
      var values = "";
			
			if (typeof accession_identifier !== 'undefined' && accession_identifier !== "") {
        column += 'accession_identifier,';
        values += "'" + accession_identifier + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
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
			
			if (typeof subject_substance !== 'undefined' && subject_substance !== "") {
        column += 'subject_substance,';
        values += "'" + subject_substance + "',";
      }		
			
			if (typeof collector !== 'undefined' && collector !== "") {
        column += 'collector,';
        values += "'" + collector + "',";
      }	
			
			if (typeof method !== 'undefined' && method !== "") {
        column += 'method,';
        values += "'" + method + "',";
      }
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
      }
			
			if (typeof parent !== 'undefined' && parent !== "") {
        column += 'parent,';
        values += "'" + parent + "',";
      }
			
			if (typeof received_time !== 'undefined' && received_time !== "") {
        column += 'received_time,';
				values += "to_date('"+ received_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof collected_date_time !== 'undefined' && collected_date_time !== "") {
        column += 'collected_date_time,';
				values += "to_date('"+ collected_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof collected_period_start !== 'undefined' && collected_period_start !== "") {
        column += 'collected_period_start,';
				values += "to_date('"+ collected_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof collected_period_end !== 'undefined' && collected_period_end !== "") {
        column += 'collected_period_end,';
				values += "to_date('"+ collected_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof quantity_low !== 'undefined' && quantity_low !== "") {
        column += 'quantity_low,';
        values += " " + quantity_low + ",";
      }		
			
			if (typeof quantity_high !== 'undefined' && quantity_high !== "") {
        column += 'quantity_high,';
        values += " " + quantity_high + ",";
      }		
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }		
			
			if (typeof procedure_request_id !== 'undefined' && procedure_request_id !== "") {
        column += 'procedure_request_id,';
        values += "'" + procedure_request_id + "',";
      }		
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }		
			
			if (typeof sequence_id !== 'undefined' && sequence_id !== "") {
        column += 'sequence_id,';
        values += "'" + sequence_id + "',";
      }	
			
			if (typeof media_id !== 'undefined' && media_id !== "") {
        column += 'media_id,';
        values += "'" + media_id + "',";
      }	
			
      var query = "UPSERT INTO BACIRO_FHIR.specimen(specimen_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+specimen_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select specimen_id from BACIRO_FHIR.specimen WHERE specimen_id = '" + specimen_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimen"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimen"});
      });
    },
		specimenProcessing: function addSpecimenProcessing(req, res) {
			console.log(req.body);
			var processing_id  = req.body.processing_id;
			var desciption  = req.body.desciption;
			var procedur  = req.body.procedur;
			var time_date_time  = req.body.time_date_time;
			var time_period_start  = req.body.time_period_start;
			var time_period_end  = req.body.time_period_end;
			var specimen_id  = req.body.specimen_id;
			
			var column = "";
      var values = "";
			
			if (typeof desciption !== 'undefined' && desciption !== "") {
        column += 'desciption,';
        values += "'" + desciption + "',";
      }
			
			if (typeof procedur !== 'undefined' && procedur !== "") {
        column += 'procedur,';
        values += "'" + procedur + "',";
      }
			
			if (typeof time_date_time !== 'undefined' && time_date_time !== "") {
        column += 'time_date_time,';
				values += "to_date('"+ time_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof time_period_start !== 'undefined' && time_period_start !== "") {
        column += 'time_period_start,';
				values += "to_date('"+ time_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof time_period_end !== 'undefined' && time_period_end !== "") {
        column += 'time_period_end,';
				values += "to_date('"+ time_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof specimen_id !== 'undefined' && specimen_id !== "") {
        column += 'specimen_id,';
        values += "'" + specimen_id + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.specimen_processing(processing_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+processing_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select processing_id from BACIRO_FHIR.specimen_processing WHERE processing_id = '" + processing_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimenProcessing"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimenProcessing"});
      });
    },
		specimenContainer: function addSpecimenContainer(req, res) {
			console.log(req.body);
			var container_id  = req.params.container_id;
			var desciption  = req.body.desciption;
			var type  = req.body.type;
			var capacity  = req.body.capacity;
			var specimen_quantity  = req.body.specimen_quantity;
			var additive_codeable_concept  = req.body.additive_codeable_concept;
			var additive_reference  = req.body.additive_reference;
			var specimen_id  = req.body.specimen_id;
			
			var column = "";
      var values = "";
			
			if (typeof desciption !== 'undefined' && desciption !== "") {
        column += 'desciption,';
        values += "'" + desciption + "',";
      }
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof capacity !== 'undefined' && capacity !== "") {
        column += 'capacity,';
        values += "'" + capacity + "',";
      }
			
			if (typeof specimen_quantity !== 'undefined' && specimen_quantity !== "") {
        column += 'specimen_quantity,';
        values += "'" + specimen_quantity + "',";
      }
			
			if (typeof additive_codeable_concept !== 'undefined' && additive_codeable_concept !== "") {
        column += 'additive_codeable_concept,';
        values += "'" + additive_codeable_concept + "',";
      }
			
			if (typeof additive_reference !== 'undefined' && additive_reference !== "") {
        column += 'additive_reference,';
        values += "'" + additive_reference + "',";
      }
			
			if (typeof specimen_id !== 'undefined' && specimen_id !== "") {
        column += 'specimen_id,';
        values += "'" + specimen_id + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.specimen_container(container_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+container_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select container_id from BACIRO_FHIR.specimen_container WHERE container_id = '" + container_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimenContainer"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSpecimenContainer"});
      });
    }
	},
	put: {
		specimen: function updateSpecimen(req, res) {
			console.log(req.body);
			var specimen_id  = req.params._id;
			var accession_identifier  = req.body.accession_identifier;
			var status  = req.body.status;
			var type  = req.body.type;
			var subject_patient  = req.body.subject_patient;
			var subject_group  = req.body.subject_group;
			var subject_device  = req.body.subject_device;
			var subject_substance  = req.subject_substance;
			var received_time  = req.body.received_time;
			var collector  = req.body.collector;
			var collected_date_time  = req.body.collected_date_time;
			var collected_period_start  = req.body.collected_period_start;
			var collected_period_end  = req.body.collected_period_end;
			var quantity_low  = req.body.quantity_low;
			var quantity_high  = req.body.quantity_high;
			var method  = req.body.method;
			var body_site  = req.body.body_site;
			var parent = req.body.parent;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var procedure_request_id  = req.body.procedure_request_id;
			var observation_id  = req.body.observation_id;
			var sequence_id  = req.body.sequence_id;
			var media_id  = req.body.media_id;
			
			var column = "";
      var values = "";
			
			if (typeof accession_identifier !== 'undefined' && accession_identifier !== "") {
        column += 'accession_identifier,';
        values += "'" + accession_identifier + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
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
			
			if (typeof subject_substance !== 'undefined' && subject_substance !== "") {
        column += 'subject_substance,';
        values += "'" + subject_substance + "',";
      }		
			
			if (typeof collector !== 'undefined' && collector !== "") {
        column += 'collector,';
        values += "'" + collector + "',";
      }	
			
			if (typeof method !== 'undefined' && method !== "") {
        column += 'method,';
        values += "'" + method + "',";
      }
			
			if (typeof body_site !== 'undefined' && body_site !== "") {
        column += 'body_site,';
        values += "'" + body_site + "',";
      }
			
			if (typeof parent !== 'undefined' && parent !== "") {
        column += 'parent,';
        values += "'" + parent + "',";
      }
			
			if (typeof received_time !== 'undefined' && received_time !== "") {
        column += 'received_time,';
				values += "to_date('"+ received_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof collected_date_time !== 'undefined' && collected_date_time !== "") {
        column += 'collected_date_time,';
				values += "to_date('"+ collected_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof collected_period_start !== 'undefined' && collected_period_start !== "") {
        column += 'collected_period_start,';
				values += "to_date('"+ collected_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof collected_period_end !== 'undefined' && collected_period_end !== "") {
        column += 'collected_period_end,';
				values += "to_date('"+ collected_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof quantity_low !== 'undefined' && quantity_low !== "") {
        column += 'quantity_low,';
        values += " " + quantity_low + ",";
      }		
			
			if (typeof quantity_high !== 'undefined' && quantity_high !== "") {
        column += 'quantity_high,';
        values += " " + quantity_high + ",";
      }		
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }		
			
			if (typeof procedure_request_id !== 'undefined' && procedure_request_id !== "") {
        column += 'procedure_request_id,';
        values += "'" + procedure_request_id + "',";
      }		
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }		
			
			if (typeof sequence_id !== 'undefined' && sequence_id !== "") {
        column += 'sequence_id,';
        values += "'" + sequence_id + "',";
      }	
			
			if (typeof media_id !== 'undefined' && media_id !== "") {
        column += 'media_id,';
        values += "'" + media_id + "',";
      }	
							
			var condition = "specimen_id = '" + specimen_id + "'";

      var query = "UPSERT INTO BACIRO_FHIR.specimen(specimen_id," + column.slice(0, -1) + ") SELECT specimen_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.specimen WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select specimen_id from BACIRO_FHIR.specimen WHERE specimen_id = '" + specimen_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimen"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimen"});
      });
    },
		specimenProcessing: function updateSpecimenProcessing(req, res) {
			console.log(req.body);
			var processing_id  = req.params._id;
			var desciption  = req.body.desciption;
			var procedur  = req.body.procedur;
			var time_date_time  = req.body.time_date_time;
			var time_period_start  = req.body.time_period_start;
			var time_period_end  = req.body.time_period_end;
			var specimen_id  = req.body.specimen_id;
			
			var column = "";
      var values = "";
			
			if (typeof desciption !== 'undefined' && desciption !== "") {
        column += 'desciption,';
        values += "'" + desciption + "',";
      }
			
			if (typeof procedur !== 'undefined' && procedur !== "") {
        column += 'procedur,';
        values += "'" + procedur + "',";
      }
			
			if (typeof time_date_time !== 'undefined' && time_date_time !== "") {
        column += 'time_date_time,';
				values += "to_date('"+ time_date_time + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof time_period_start !== 'undefined' && time_period_start !== "") {
        column += 'time_period_start,';
				values += "to_date('"+ time_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof time_period_end !== 'undefined' && time_period_end !== "") {
        column += 'time_period_end,';
				values += "to_date('"+ time_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof specimen_id !== 'undefined' && specimen_id !== "") {
        column += 'specimen_id,';
        values += "'" + specimen_id + "',";
      }
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "processing_id = '" + processing_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "processing_id = '" + processing_id + "'";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.specimen_processing(processing_id," + column.slice(0, -1) + ") SELECT processing_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.specimen_processing WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select processing_id from BACIRO_FHIR.specimen_processing WHERE processing_id = '" + processing_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimenProcessing"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimenProcessing"});
      });
    },
		specimenContainer: function updateSpecimenContainer(req, res) {
			console.log(req.body);
			var container_id  = req.params._id;
			var desciption  = req.body.desciption;
			var type  = req.body.type;
			var capacity  = req.body.capacity;
			var specimen_quantity  = req.body.specimen_quantity;
			var additive_codeable_concept  = req.body.additive_codeable_concept;
			var additive_reference  = req.body.additive_reference;
			var specimen_id  = req.body.specimen_id;
			
			var column = "";
      var values = "";
			
			if (typeof desciption !== 'undefined' && desciption !== "") {
        column += 'desciption,';
        values += "'" + desciption + "',";
      }
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof capacity !== 'undefined' && capacity !== "") {
        column += 'capacity,';
        values += "'" + capacity + "',";
      }
			
			if (typeof specimen_quantity !== 'undefined' && specimen_quantity !== "") {
        column += 'specimen_quantity,';
        values += "'" + specimen_quantity + "',";
      }
			
			if (typeof additive_codeable_concept !== 'undefined' && additive_codeable_concept !== "") {
        column += 'additive_codeable_concept,';
        values += "'" + additive_codeable_concept + "',";
      }
			
			if (typeof additive_reference !== 'undefined' && additive_reference !== "") {
        column += 'additive_reference,';
        values += "'" + additive_reference + "',";
      }
			
			if (typeof specimen_id !== 'undefined' && specimen_id !== "") {
        column += 'specimen_id,';
        values += "'" + specimen_id + "',";
      }
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "container_id = '" + container_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "container_id = '" + container_id + "'";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.specimen_container(container_id," + column.slice(0, -1) + ") SELECT container_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.specimen_container WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select container_id from BACIRO_FHIR.specimen_container WHERE container_id = '" + container_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimenContainer"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSpecimenContainer"});
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