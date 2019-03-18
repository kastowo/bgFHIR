var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var path = require('path');

var configYaml = yamlconfig.readConfig(path.resolve('../../application/config/config.yml'));

//visionPrescription emitter
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
		visionPrescription: function getVisionPrescription(req, res){
			var apikey = req.params.apikey;
			var visionPrescriptionId = req.query._id;
			
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
			
			if(typeof visionPrescriptionId !== 'undefined' && visionPrescriptionId !== ""){
        condition += "dr.diagnostic_report_id = '" + visionPrescriptionId + "' AND,";  
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

			

			
			var arrVisionPrescription = [];
      var query = "select vp.vision_prescription_id as vision_prescription_id, vp.status as status, vp.patient as patient, vp.encounter as encounter, vp.date_written as date_written, vp.prescriber as prescriber, vp.reason_codeable_concept as reason_codeable_concept, vp.reason_reference as reason_reference from BACIRO_FHIR.vision_prescription vp " + fixCondition;
			//console.log(query);			
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var VisionPrescription = {};
					VisionPrescription.resourceType = "VisionPrescription";
          VisionPrescription.id = rez[i].vision_prescription_id;
					VisionPrescription.status = rez[i].status;
					VisionPrescription.notDone = rez[i].not_done;
					VisionPrescription.notDoneReason = rez[i].not_done_reason;
					VisionPrescription.code = rez[i].code;
					if(rez[i].patient != "null"){
						VisionPrescription.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient;
					} else {
						VisionPrescription.patient = "";
					}
					if(rez[i].encounter != "null"){
						VisionPrescription.encounter = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].encounter;
					} else {
						VisionPrescription.encounter = "";
					}
					if(rez[i].date_written == null){
						VisionPrescription.dateWritten = formatDate(rez[i].date_written);
					}else{
						VisionPrescription.dateWritten = rez[i].date_written;
					}
					if(rez[i].prescriber != "null"){
						VisionPrescription.prescriber = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].prescriber;
					} else {
						VisionPrescription.prescriber = "";
					}
					VisionPrescription.reason.reasonCodeableConcept = rez[i].reason_codeable_concept;
					if(rez[i].reason_reference != "null"){
						VisionPrescription.reason.reasonReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Condition?_id=' +  rez[i].reason_reference;
					} else {
						VisionPrescription.reason.reasonReference = "";
					}
					
          arrVisionPrescription[i] = VisionPrescription;
        }
        res.json({"err_code":0,"data": arrVisionPrescription});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getVisionPrescription"});
      });
    },
		visionPrescriptionDispense: function getVisionPrescriptionDispense(req, res) {
			var apikey = req.params.apikey;
			
			var visionPrescriptionDispenseId = req.query._id;
			var visionPrescriptionId = req.query.visionPrescription_id;

			//susun query
			var condition = "";

			if (typeof visionPrescriptionDispenseId !== 'undefined' && visionPrescriptionDispenseId !== "") {
				condition += "dispense_id = '" + visionPrescriptionDispenseId + "' AND ";
			}

			if (typeof visionPrescriptionId !== 'undefined' && visionPrescriptionId !== "") {
				condition += "vision_prescription_id = '" + visionPrescriptionId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrVisionPrescriptionDispense = [];
			var query = "select dispense_id, product, eye, sphere, cylinder, axis, prism, base, adds, power, back_curve, diameter, duration, color, brand from BACIRO_FHIR.dispense " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var VisionPrescriptionDispense = {};
					VisionPrescriptionDispense.id = rez[i].dispense_id;
					VisionPrescriptionDispense.product = rez[i].product;
					VisionPrescriptionDispense.eye = rez[i].eye;
					VisionPrescriptionDispense.sphere = rez[i].sphere;
					VisionPrescriptionDispense.cylinder = rez[i].cylinder;
					VisionPrescriptionDispense.axis = rez[i].axis;
					VisionPrescriptionDispense.prism = rez[i].prism;
					VisionPrescriptionDispense.base = rez[i].base;
					VisionPrescriptionDispense.add = rez[i].adds;
					VisionPrescriptionDispense.power = rez[i].power;
					VisionPrescriptionDispense.back_curve = rez[i].back_curve;
					VisionPrescriptionDispense.diameter = rez[i].diameter;
					VisionPrescriptionDispense.duration = rez[i].duration;
					VisionPrescriptionDispense.color = rez[i].color;
					VisionPrescriptionDispense.brand = rez[i].brand;
					arrVisionPrescriptionDispense[i] = VisionPrescriptionDispense;
				}
				res.json({
					"err_code": 0,
					"data": arrVisionPrescriptionDispense
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getVisionPrescriptionDispense"
				});
			});
		}
  },
	post: {
		visionPrescription: function addVisionPrescription(req, res) {
			console.log(req.body);
			var vision_prescription_id  = req.body.vision_prescription_id;
			var status  = req.body.status;
			var patient  = req.body.patient;
			var encounter  = req.body.encounter;
			var date_written  = req.body.date_written;
			var prescriber  = req.body.prescriber;
			var reason_codeable_concept  = req.body.reason_codeable_concept;
			var reason_reference  = req.body.reason_reference;

			var column = "";
      var values = "";
			
				
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof encounter !== 'undefined' && encounter !== "") {
        column += 'encounter,';
        values += "'" + encounter + "',";
      }	
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof date_written !== 'undefined' && date_written !== "") {
        column += 'date_written,';
				values += "to_date('"+ date_written + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof prescriber !== 'undefined' && prescriber !== "") {
        column += 'prescriber,';
        values += "'" + prescriber + "',";
      }
			
			if (typeof reason_codeable_concept !== 'undefined' && reason_codeable_concept !== "") {
        column += 'reason_codeable_concept,';
        values += "'" + reason_codeable_concept + "',";
      }
			
			if (typeof reason_reference !== 'undefined' && reason_reference !== "") {
        column += 'reason_reference,';
        values += "'" + reason_reference + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.vision_prescription(vision_prescription_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+vision_prescription_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select vision_prescription_id from BACIRO_FHIR.vision_prescription WHERE vision_prescription_id = '" + vision_prescription_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addVisionPrescription"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addVisionPrescription"});
      });
    },
		visionPrescriptionDispense: function addVisionPrescriptionDispense(req, res) {
			console.log(req.body);
			var dispense_id  = req.body.dispense_id;
			var product  = req.body.product;
			var eye  = req.body.eye;
			var sphere  = req.body.sphere;
			var cylinder  = req.body.cylinder;
			var axis  = req.body.axis;
			var prism  = req.body.prism;
			var base  = req.body.base;
			var adds  = req.body.add;
			var power  = req.body.power;
			var back_curve  = req.body.back_curve;
			var diameter  = req.body.diameter;
			var duration  = req.body.duration;
			var color  = req.body.color;
			var brand  = req.body.brand;
			var vision_prescription_id  = req.body.vision_prescription_id;
			
			var column = "";
      var values = "";
			
			if (typeof product !== 'undefined' && product !== "") {
        column += 'product,';
        values += "'" + product + "',";
      }
			
			if (typeof eye !== 'undefined' && eye !== "") {
        column += 'eye,';
        values += "'" + eye + "',";
      }
			
			if (typeof sphere !== 'undefined' && sphere !== "") {
        column += 'sphere,';
        values += " " + sphere + ",";
      }
			
			if (typeof cylinder !== 'undefined' && cylinder !== "") {
        column += 'cylinder,';
        values += " " + cylinder + ",";
      }
			
			if (typeof axis !== 'undefined' && axis !== "") {
        column += 'axis,';
        values += " " + axis + ",";
      }
			
			if (typeof prism !== 'undefined' && prism !== "") {
        column += 'prism,';
        values += " " + prism + ",";
      }
			
			if (typeof base !== 'undefined' && base !== "") {
        column += 'base,';
        values += "'" + base + "',";
      }
			
			if (typeof adds !== 'undefined' && adds !== "") {
        column += 'adds,';
        values += " " + adds + ",";
      }
			
			if (typeof power !== 'undefined' && power !== "") {
        column += 'power,';
        values += " " + power + ",";
      }
			
			if (typeof back_curve !== 'undefined' && back_curve !== "") {
        column += 'back_curve,';
        values += " " + back_curve + ",";
      }
			
			if (typeof diameter !== 'undefined' && diameter !== "") {
        column += 'diameter,';
        values += " " + diameter + ",";
      }
			
			if (typeof duration !== 'undefined' && duration !== "") {
        column += 'duration,';
        values += " " + duration + ",";
      }
			
			if (typeof color !== 'undefined' && color !== "") {
        column += 'color,';
        values += "'" + color + "',";
      }
			
			if (typeof brand !== 'undefined' && brand !== "") {
        column += 'brand,';
        values += "'" + brand + "',";
      }
			
			if (typeof vision_prescription_id !== 'undefined' && vision_prescription_id !== "") {
        column += 'vision_prescription_id,';
        values += "'" + vision_prescription_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.dispense(dispense_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+dispense_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select dispense_id from BACIRO_FHIR.dispense WHERE dispense_id = '" + dispense_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addVisionPrescriptionDispense"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addVisionPrescriptionDispense"});
      });
    }
	},
	put: {
		visionPrescription: function updateVisionPrescription(req, res) {
			console.log(req.body);
			var vision_prescription_id  = req.params.vision_prescription_id;
			var status  = req.body.status;
			var patient  = req.body.patient;
			var encounter  = req.body.encounter;
			var date_written  = req.body.date_written;
			var prescriber  = req.body.prescriber;
			var reason_codeable_concept  = req.body.reason_codeable_concept;
			var reason_reference  = req.body.reason_reference;

			var column = "";
      var values = "";
			
				
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof encounter !== 'undefined' && encounter !== "") {
        column += 'encounter,';
        values += "'" + encounter + "',";
      }	
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof date_written !== 'undefined' && date_written !== "") {
        column += 'date_written,';
				values += "to_date('"+ date_written + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof prescriber !== 'undefined' && prescriber !== "") {
        column += 'prescriber,';
        values += "'" + prescriber + "',";
      }
			
			if (typeof reason_codeable_concept !== 'undefined' && reason_codeable_concept !== "") {
        column += 'reason_codeable_concept,';
        values += "'" + reason_codeable_concept + "',";
      }
			
			if (typeof reason_reference !== 'undefined' && reason_reference !== "") {
        column += 'reason_reference,';
        values += "'" + reason_reference + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "visionPrescription_id = '" + visionPrescription_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.visionPrescription(visionPrescription_id," + column.slice(0, -1) + ") SELECT visionPrescription_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.visionPrescription WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select visionPrescription_id from BACIRO_FHIR.visionPrescription WHERE visionPrescription_id = '" + visionPrescription_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateVisionPrescription"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateVisionPrescription"});
      });
    },
		visionPrescriptionDispense: function updateVisionPrescriptionDispense(req, res) {
			console.log(req.body);
			var dispense_id  = req.params.dispense_id;
			var product  = req.body.product;
			var eye  = req.body.eye;
			var sphere  = req.body.sphere;
			var cylinder  = req.body.cylinder;
			var axis  = req.body.axis;
			var prism  = req.body.prism;
			var base  = req.body.base;
			var adds  = req.body.add;
			var power  = req.body.power;
			var back_curve  = req.body.back_curve;
			var diameter  = req.body.diameter;
			var duration  = req.body.duration;
			var color  = req.body.color;
			var brand  = req.body.brand;
			var vision_prescription_id  = req.body.vision_prescription_id;
			
			var column = "";
      var values = "";
			
			if (typeof product !== 'undefined' && product !== "") {
        column += 'product,';
        values += "'" + product + "',";
      }
			
			if (typeof eye !== 'undefined' && eye !== "") {
        column += 'eye,';
        values += "'" + eye + "',";
      }
			
			if (typeof sphere !== 'undefined' && sphere !== "") {
        column += 'sphere,';
        values += " " + sphere + ",";
      }
			
			if (typeof cylinder !== 'undefined' && cylinder !== "") {
        column += 'cylinder,';
        values += " " + cylinder + ",";
      }
			
			if (typeof axis !== 'undefined' && axis !== "") {
        column += 'axis,';
        values += " " + axis + ",";
      }
			
			if (typeof prism !== 'undefined' && prism !== "") {
        column += 'prism,';
        values += " " + prism + ",";
      }
			
			if (typeof base !== 'undefined' && base !== "") {
        column += 'base,';
        values += "'" + base + "',";
      }
			
			if (typeof adds !== 'undefined' && adds !== "") {
        column += 'adds,';
        values += " " + adds + ",";
      }
			
			if (typeof power !== 'undefined' && power !== "") {
        column += 'power,';
        values += " " + power + ",";
      }
			
			if (typeof back_curve !== 'undefined' && back_curve !== "") {
        column += 'back_curve,';
        values += " " + back_curve + ",";
      }
			
			if (typeof diameter !== 'undefined' && diameter !== "") {
        column += 'diameter,';
        values += " " + diameter + ",";
      }
			
			if (typeof duration !== 'undefined' && duration !== "") {
        column += 'duration,';
        values += " " + duration + ",";
      }
			
			if (typeof color !== 'undefined' && color !== "") {
        column += 'color,';
        values += "'" + color + "',";
      }
			
			if (typeof brand !== 'undefined' && brand !== "") {
        column += 'brand,';
        values += "'" + brand + "',";
      }
			
			if (typeof vision_prescription_id !== 'undefined' && vision_prescription_id !== "") {
        column += 'vision_prescription_id,';
        values += "'" + vision_prescription_id + "',";
      }

			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "dispense_id = '" + dispense_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.dispense(dispense_id," + column.slice(0, -1) + ") SELECT dispense_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.dispense WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select dispense_id from BACIRO_FHIR.dispense WHERE dispense_id = '" + dispense_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateVisionPrescriptionDispense"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateVisionPrescriptionDispense"});
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