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
		immunization: function getImmunization(req, res){
			var apikey = req.params.apikey;
			var immunizationId = req.query._id;
			var date = req.query.date;
			var dose_sequence = req.query.dose_sequence;
			var identifier = req.query.identifier;
			var location = req.query.location;
			var iot_number = req.query.lot_number;
			var manufacturer = req.query.manufacturer;
			var notgiven = req.query.notgiven;
			var patient = req.query.patient;
			var practitioner = req.query.practitioner;
			var reaction = req.query.reaction;
			var reaction_date = req.query.reaction_date;
			var reason = req.query.reason;
			var reason_not_given = req.query.reason_not_given;
			var status = req.query.status;
			var vaccine_code = req.query.vaccine_code;
	
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof immunizationId !== 'undefined' && immunizationId !== ""){
        condition += "im.IMMUNIZATION_ID = '" + immunizationId + "' AND,";  
      }
			
			if (typeof date !== 'undefined' && date !== "") {
        condition += "im.DATE <= to_date('" + date + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof dose_sequence !== 'undefined' && dose_sequence !== ""){
				join += " LEFT JOIN BACIRO_FHIR.IMMUNIZATION_VACCINATION_PROTOCOL ivp on im.IMMUNIZATION_ID = ivp.IMMUNIZATION_ID ";
        condition += "ivp.DOSE_SEQUENCE = " + dose_sequence + " AND,";  
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on im.IMMUNIZATION_ID = i.IMMUNIZATION_ID ";
        condition += "i.identifier_value = '" + identifier + "' AND,";  
      }
			
			if(typeof location !== 'undefined' && location !== ""){
        condition += "im.location = '" + location + "' AND,";  
      }
			
			if(typeof iot_number !== 'undefined' && iot_number !== ""){
        condition += "im.IOT_NUMBER = '" + lot_number + "' AND,";  
      }
			
			if(typeof manufacturer !== 'undefined' && manufacturer !== ""){
        condition += "im.MANUFACTURER = '" + manufacturer + "' AND,";  
      }
			
			if(typeof notgiven !== 'undefined' && notgiven !== ""){
        condition += "im.NOT_GIVEN = " + notgiven + " AND,";  
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "im.PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof practitioner !== 'undefined' && practitioner !== ""){
				join += " LEFT JOIN BACIRO_FHIR.IMMUNIZATION_PRACTITIONER ip on im.IMMUNIZATION_ID = ip.IMMUNIZATION_ID ";
        condition += "ip.ACTOR = " + practitioner + " AND,";  
      }
			
			if((typeof reaction !== 'undefined' && reaction !== "") || (typeof reaction_date !== 'undefined' && reaction_date !== "")){
				join += " LEFT JOIN BACIRO_FHIR.IMMUNIZATION_REACTION ir on im.IMMUNIZATION_ID = ir.IMMUNIZATION_ID ";
        if(typeof reaction !== 'undefined' && reaction !== ""){
					condition += "ip.DETAIL = " + reaction + " AND,";  
				}
				
				if(typeof reaction_date !== 'undefined' && reaction_date !== ""){
					condition += "ip.DATE <= to_date('" + reaction_date + "', 'yyyy-MM-dd') AND,";  
				}
      }
			
			if(typeof reason !== 'undefined' && reason !== ""){
        condition += "im.EXPLANATION_REASON = '" + reason + "' AND,";  
      }
			
			if(typeof reason_not_given !== 'undefined' && reason_not_given !== ""){
        condition += "im.EXPLANATION_REASON_NOT_GIVEN = '" + reason_not_given + "' AND,";  
      }
			
			if(typeof status !== 'undefined' && status !== ""){
        condition += "im.STATUS = '" + status + "' AND,";  
      }
			
			if(typeof vaccine_code !== 'undefined' && vaccine_code !== ""){
        condition += "im.VECCINE_CODE = '" + vaccine_code + "' AND,";  
      }
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrImmunization = [];
      var query = "select im.immunization_id as immunization_id, im.status as status, im.not_given as not_given, im.veccine_code as veccine_code, im.patient as patient, im.encounter as encounter, im.date as date, im.primary_source as primary_source, im.report_origin as report_origin, im.location as location, im.manufacturer as manufacturer, im.iot_number as iot_number, im.expiration_date as expiration_date, im.site as site, im.route as route, im.dose_quantity as dose_quantity, im.explanation_reason as explanation_reason, im.explanation_reason_not_given as explanation_reason_not_given from BACIRO_FHIR.IMMUNIZATION im " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Immunization = {};
					Immunization.resourceType = "Immunization";
          Immunization.id = rez[i].immunization_id;
					Immunization.status = rez[i].status;
					Immunization.notGiven = rez[i].not_given;
					Immunization.veccineCode = rez[i].veccine_code;
					
					if (rez[i].patient !== 'null') {
						Immunization.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' + rez[i].patient;
					} else {
						Immunization.patient = "";
					}
					if (rez[i].encounter !== 'null') {
						Immunization.encounter = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' + rez[i].encounter;
					} else {
						Immunization.encounter = "";
					}
					if(rez[i].date == null){
						Immunization.date = formatDate(rez[i].date);
					}else{
						Immunization.date = rez[i].date;
					}
					
					Immunization.primarySource = rez[i].primary_source;
					Immunization.reportOrigin = rez[i].report_origin;
					if (rez[i].location !== 'null') {
						Immunization.location = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' + rez[i].location;
					} else {
						Immunization.location = "";
					}	
					if (rez[i].manufacturer !== 'null') {
						Immunization.manufacturer = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' + rez[i].manufacturer;
					} else {
						Immunization.manufacturer = "";
					}
					Immunization.iotNumber = rez[i].iot_number;
					if(rez[i].expiration_date == null){
						Immunization.expirationDate = formatDate(rez[i].expiration_date);
					}else{
						Immunization.expirationDate = rez[i].expiration_date;
					}
					
					Immunization.site = rez[i].site;
					Immunization.route = rez[i].route;
					Immunization.doseQuantity = rez[i].dose_quantity;
					
					/*------------------*/
					var arrExplanation = [];
					var Explanation = {};
					Explanation.reason = rez[i].explanation_reason;
					Explanation.reasonNotGiven = rez[i].explanation_reason_not_given;
					arrExplanation = Explanation;
					
					/*Immunization.explanation.reason = rez[i].explanation_reason;
					Immunization.explanation.reasonNotGiven = rez[i].explanation_reason_not_given;*/
					Immunization.explanation = Explanation;
					
          arrImmunization[i] = Immunization;
        }
        res.json({"err_code":0,"data": arrImmunization});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getImmunization"});
      });
    },
		immunizationPractitioner: function getImmunizationPractitioner(req, res) {
			var apikey = req.params.apikey;
			
			var immunizationPractitionerId = req.query._id;
			var immunizationId = req.query.immunization_id;

			//susun query
			var condition = "";

			if (typeof immunizationPractitionerId !== 'undefined' && immunizationPractitionerId !== "") {
				condition += "PRACTITIONER_ID = '" + immunizationPractitionerId + "' AND ";
			}

			if (typeof immunizationId !== 'undefined' && immunizationId !== "") {
				condition += "IMMUNIZATION_ID = '" + immunizationId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrImmunizationPractitioner = [];
			var query = "select practitioner_id, role, actor  from baciro_fhir.IMMUNIZATION_PRACTITIONER " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ImmunizationPractitioner = {};
					ImmunizationPractitioner.id = rez[i].practitioner_id;
					ImmunizationPractitioner.role = rez[i].role;
					if (rez[i].actor !== 'null') {
						ImmunizationPractitioner.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' + rez[i].actor;
					} else {
						ImmunizationPractitioner.actor = "";
					}
					arrImmunizationPractitioner[i] = ImmunizationPractitioner;
				}
				res.json({
					"err_code": 0,
					"data": arrImmunizationPractitioner
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImmunizationPractitioner"
				});
			});
		},
		immunizationReaction: function getImmunizationReaction(req, res) {
			var apikey = req.params.apikey;
			
			var immunizationReactionId = req.query._id;
			var immunizationId = req.query.immunization_id;

			//susun query
			var condition = "";

			if (typeof immunizationReactionId !== 'undefined' && immunizationReactionId !== "") {
				condition += "Reaction_ID = '" + immunizationReactionId + "' AND ";
			}

			if (typeof immunizationId !== 'undefined' && immunizationId !== "") {
				condition += "IMMUNIZATION_ID = '" + immunizationId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrImmunizationReaction = [];
			var query = "select reaction_id, date, detail, reported, immunization_id from baciro_fhir.IMMUNIZATION_REACTION " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ImmunizationReaction = {};
					ImmunizationReaction.id = rez[i].reaction_id;
					if(rez[i].date == null){
						ImmunizationReaction.date = formatDate(rez[i].date);
					}else{
						ImmunizationReaction.date = rez[i].date;
					}
					if (rez[i].detail !== 'null') {
						ImmunizationReaction.detail = hostFHIR + ':' + portFHIR + '/' + apikey + '/Observation?_id=' + rez[i].detail;
					} else {
						ImmunizationReaction.detail = "";
					}	
					ImmunizationReaction.reported = rez[i].reported;
					arrImmunizationReaction[i] = ImmunizationReaction;
				}
				res.json({
					"err_code": 0,
					"data": arrImmunizationReaction
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImmunizationReaction"
				});
			});
		},
		immunizationVaccinationProtocol: function getImmunizationVaccinationProtocol(req, res) {
			var apikey = req.params.apikey;
			
			var immunizationVaccinationProtocolId = req.query._id;
			var immunizationId = req.query.immunization_id;

			//susun query
			var condition = "";

			if (typeof immunizationVaccinationProtocolId !== 'undefined' && immunizationVaccinationProtocolId !== "") {
				condition += "vaccination_protocol_id = '" + immunizationVaccinationProtocolId + "' AND ";
			}

			if (typeof immunizationId !== 'undefined' && immunizationId !== "") {
				condition += "immunization_id = '" + immunizationId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrImmunizationVaccinationProtocol = [];
			var query = "select vaccination_protocol_id, dose_sequence, description, authority, series, series_doses, target_disease, dose_status, dose_status_reason, immunization_id from BACIRO_FHIR.IMMUNIZATION_VACCINATION_PROTOCOL " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ImmunizationVaccinationProtocol = {};
					ImmunizationVaccinationProtocol.id = rez[i].vaccination_protocol_id;
					ImmunizationVaccinationProtocol.doseSequence = rez[i].dose_sequence;
					ImmunizationVaccinationProtocol.description = rez[i].description;
					if(rez[i].authority != "null"){
						ImmunizationVaccinationProtocol.authority = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].authority;
					} else {
						ImmunizationVaccinationProtocol.authority = "";
					}
					ImmunizationVaccinationProtocol.series = rez[i].series;
					ImmunizationVaccinationProtocol.seriesDoses = rez[i].series_doses;
					ImmunizationVaccinationProtocol.targetDisease = rez[i].target_disease;
					ImmunizationVaccinationProtocol.doseStatus = rez[i].dose_status;
					ImmunizationVaccinationProtocol.doseStatusReason = rez[i].dose_status_reason;
					
					arrImmunizationVaccinationProtocol[i] = ImmunizationVaccinationProtocol;
				}
				res.json({
					"err_code": 0,
					"data": arrImmunizationVaccinationProtocol
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImmunizationVaccinationProtocol"
				});
			});
		}
  },
	post: {
		immunization: function addImmunization(req, res) {
			console.log(req.body);
			var immunization_id = req.body.immunization_id;
			var status = req.body.status;
			var not_given = req.body.not_given;
			var veccine_code = req.body.veccine_code;
			var patient = req.body.patient;
			var encounter = req.body.encounter;
			var date = req.body.date;
			var primary_source = req.body.primary_source;
			var report_origin = req.body.report_origin;
			var location = req.body.location;
			var manufacturer = req.body.manufacturer;
			var iot_number = req.body.lot_number;
			var expiration_date = req.body.expiration_date;
			var site = req.body.site;
			var route = req.body.route;
			var dose_quantity = req.body.dose_quantity;
			var explanation_reason = req.body.explanation_reason;
			var explanation_reason_not_given = req.body.explanation_reason_not_given;
			var adverse_event_id = req.body.adverse_event_id;
			
			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof not_given !== 'undefined' && not_given !== "") {
        column += 'not_given,';
        values += " " + not_given + ",";
      }	
			
			if (typeof veccine_code !== 'undefined' && veccine_code !== "") {
        column += 'veccine_code,';
        values += "'" + veccine_code + "',";
      }	
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof encounter !== 'undefined' && encounter !== "") {
        column += 'encounter,';
        values += "'" + encounter + "',";
      }	
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof primary_source !== 'undefined' && primary_source !== "") {
        column += 'primary_source,';
        values += " " + primary_source + ",";
      }	
			
			if (typeof report_origin !== 'undefined' && report_origin !== "") {
        column += 'report_origin,';
        values += "'" + report_origin + "',";
      }		
			
			if (typeof location !== 'undefined' && location !== "") {
        column += 'location,';
        values += "'" + location + "',";
      }		
			
			if (typeof manufacturer !== 'undefined' && manufacturer !== "") {
        column += 'manufacturer,';
        values += "'" + manufacturer + "',";
      }		
			
			if (typeof iot_number !== 'undefined' && iot_number !== "") {
        column += 'iot_number,';
        values += "'" + iot_number + "',";
      }		
			
			if (typeof expiration_date !== 'undefined' && expiration_date !== "") {
        column += 'expiration_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ expiration_date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof site !== 'undefined' && site !== "") {
        column += 'site,';
        values += "'" + site + "',";
      }		
			
			if (typeof route !== 'undefined' && route !== "") {
        column += 'route,';
        values += "'" + route + "',";
      }		
			
			if (typeof dose_quantity !== 'undefined' && dose_quantity !== "") {
        column += 'dose_quantity,';
        values += " " + dose_quantity + ",";
      }		
			
			if (typeof explanation_reason !== 'undefined' && explanation_reason !== "") {
        column += 'explanation_reason,';
        values += "'" + explanation_reason + "',";
      }		
			
			if (typeof explanation_reason_not_given !== 'undefined' && explanation_reason_not_given !== "") {
        column += 'explanation_reason_not_given,';
        values += "'" + explanation_reason_not_given + "',";
      }
			
			if (typeof adverse_event_id !== 'undefined' && adverse_event_id !== "") {
        column += 'adverse_event_id,';
        values += "'" + adverse_event_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION(immunization_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+immunization_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select immunization_id, status, not_given, veccine_code, patient, encounter, date, primary_source, report_origin, location, manufacturer, iot_number, expiration_date, site, route, dose_quantity, explanation_reason, explanation_reason_not_given from BACIRO_FHIR.IMMUNIZATION WHERE immunization_id = '" + immunization_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunization"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunization"});
      });
    },
		immunizationPractitioner: function addImmunizationPractitioner(req, res) {
			console.log(req.body);
			var practitioner_id  = req.body.practitioner_id;
			var role  = req.body.role;
			var actor  = req.body.actor;
			var immunization_id  = req.body.immunization_id;

			var column = "";
      var values = "";
			
			if (typeof role !== 'undefined' && role !== "") {
        column += 'role,';
        values += "'" + role + "',";
      }
			
			if (typeof actor !== 'undefined' && actor !== "") {
        column += 'actor,';
        values += "'" + actor + "',";
      }
			
			if (typeof immunization_id !== 'undefined' && immunization_id !== "") {
        column += 'immunization_id,';
        values += "'" + immunization_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_PRACTITIONER(practitioner_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+practitioner_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select  practitioner_id, role, actor from baciro_fhir.IMMUNIZATION_PRACTITIONER WHERE practitioner_id = '" + practitioner_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationPractitioner"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationPractitioner"});
      });
    },
		immunizationReaction: function addImmunizationReaction(req, res) {
			console.log(req.body);
			var reaction_id  = req.body.reaction_id;
			var date = req.body.date;
			var detail = req.body.detail;
			var reported = req.body.reported;
			var immunization_id  = req.body.immunization_id;

			var column = "";
      var values = "";
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof detail !== 'undefined' && detail !== "") {
        column += 'detail,';
        values += "'" + detail + "',";
      }
			
			if (typeof reported !== 'undefined' && reported !== "") {
        column += 'reported,';
        values += " " + reported + ",";
      }
			
			if (typeof immunization_id !== 'undefined' && immunization_id !== "") {
        column += 'immunization_id,';
        values += "'" + immunization_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_REACTION(reaction_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+reaction_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select reaction_id, date, detail, reported, immunization_id from baciro_fhir.IMMUNIZATION_REACTION WHERE reaction_id = '" + reaction_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationReaction"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationReaction"});
      });
    },
		immunizationVaccinationProtocol: function addImmunizationVaccinationProtocol(req, res) {
			console.log(req.body);
			var vaccination_protocol_id  = req.body.vaccination_protocol_id;
			var dose_sequence = req.body.dose_sequence;
			var description = req.body.description;
			var authority = req.body.authority;
			var series = req.body.series;
			var series_doses = req.body.series_doses;
			var target_disease = req.body.target_disease;
			var dose_status = req.body.dose_status;
			var dose_status_reason = req.body.dose_status_reason;
			var immunization_id  = req.body.immunization_id;

			var column = "";
      var values = "";
			
			if (typeof dose_sequence !== 'undefined' && dose_sequence !== "") {
        column += 'dose_sequence,';
        values += " " + dose_sequence + ",";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }
			
			if (typeof authority !== 'undefined' && authority !== "") {
        column += 'authority,';
        values += "'" + authority + "',";
      }
			
			if (typeof series !== 'undefined' && series !== "") {
        column += 'series,';
        values += "'" + series + "',";
      }
			
			if (typeof series_doses !== 'undefined' && series_doses !== "") {
        column += 'series_doses,';
        values += "'" + series_doses + "',";
      }
			
			if (typeof target_disease !== 'undefined' && target_disease !== "") {
        column += 'target_disease,';
        values += "'" + target_disease + "',";
      }
			
			if (typeof dose_status !== 'undefined' && dose_status !== "") {
        column += 'dose_status,';
        values += "'" + dose_status + "',";
      }
			
			if (typeof dose_status_reason !== 'undefined' && dose_status_reason !== "") {
        column += 'dose_status_reason,';
        values += "'" + dose_status_reason + "',";
      }
			
			if (typeof immunization_id !== 'undefined' && immunization_id !== "") {
        column += 'immunization_id,';
        values += "'" + immunization_id + "',";
      }		

      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_VACCINATION_PROTOCOL(vaccination_protocol_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+vaccination_protocol_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select vaccination_protocol_id, dose_sequence, description, authority, series, series_doses, target_disease, dose_status, dose_status_reason, immunization_id from BACIRO_FHIR.IMMUNIZATION_VACCINATION_PROTOCOL WHERE vaccination_protocol_id = '" + VaccinationProtocol_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationVaccinationProtocol"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationVaccinationProtocol"});
      });
    }
		
	},
	put: {
		immunization: function updateImmunization(req, res) {
			console.log(req.body);
			
			var immunization_id = req.params.immunization_id;
			var status = req.body.status;
			var not_given = req.body.not_given;
			var veccine_code = req.body.veccine_code;
			var patient = req.body.patient;
			var encounter = req.body.encounter;
			var date = req.body.date;
			var primary_source = req.body.primary_source;
			var report_origin = req.body.report_origin;
			var location = req.body.location;
			var manufacturer = req.body.manufacturer;
			var iot_number = req.body.lot_number;
			var expiration_date = req.body.expiration_date;
			var site = req.body.site;
			var route = req.body.route;
			var dose_quantity = req.body.dose_quantity;
			var explanation_reason = req.body.explanation_reason;
			var explanation_reason_not_given = req.body.explanation_reason_not_given;
			var adverse_event_id = req.body.adverse_event_id;
			var recommendation_id = req.body.recommendation_id;
			
			
			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof not_given !== 'undefined' && not_given !== "") {
        column += 'not_given,';
        values += " " + not_given + ",";
      }	
			
			if (typeof veccine_code !== 'undefined' && veccine_code !== "") {
        column += 'veccine_code,';
        values += "'" + veccine_code + "',";
      }	
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof encounter !== 'undefined' && encounter !== "") {
        column += 'encounter,';
        values += "'" + encounter + "',";
      }	
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof primary_source !== 'undefined' && primary_source !== "") {
        column += 'primary_source,';
        values += " " + primary_source + ",";
      }	
			
			if (typeof report_origin !== 'undefined' && report_origin !== "") {
        column += 'report_origin,';
        values += "'" + report_origin + "',";
      }		
			
			if (typeof location !== 'undefined' && location !== "") {
        column += 'location,';
        values += "'" + location + "',";
      }		
			
			if (typeof manufacturer !== 'undefined' && manufacturer !== "") {
        column += 'manufacturer,';
        values += "'" + manufacturer + "',";
      }		
			
			if (typeof iot_number !== 'undefined' && iot_number !== "") {
        column += 'iot_number,';
        values += "'" + iot_number + "',";
      }		
			
			if (typeof expiration_date !== 'undefined' && expiration_date !== "") {
        column += 'expiration_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ expiration_date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof site !== 'undefined' && site !== "") {
        column += 'site,';
        values += "'" + site + "',";
      }		
			
			if (typeof route !== 'undefined' && route !== "") {
        column += 'route,';
        values += "'" + route + "',";
      }		
			
			if (typeof dose_quantity !== 'undefined' && dose_quantity !== "") {
        column += 'dose_quantity,';
        values += " " + dose_quantity + ",";
      }		
			
			if (typeof explanation_reason !== 'undefined' && explanation_reason !== "") {
        column += 'explanation_reason,';
        values += "'" + explanation_reason + "',";
      }		
			
			if (typeof explanation_reason_not_given !== 'undefined' && explanation_reason_not_given !== "") {
        column += 'explanation_reason_not_given,';
        values += "'" + explanation_reason_not_given + "',";
      }
			
			if (typeof adverse_event_id !== 'undefined' && adverse_event_id !== "") {
        column += 'adverse_event_id,';
        values += "'" + adverse_event_id + "',";
      }
			
			if (typeof recommendation_id !== 'undefined' && recommendation_id !== "") {
        column += 'recommendation_id,';
        values += "'" + recommendation_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "immunization_id = '" + immunization_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION(immunization_id," + column.slice(0, -1) + ") SELECT immunization_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select immunization_id, status, not_given, veccine_code, patient, encounter, date, primary_source, report_origin, location, manufacturer, iot_number, expiration_date, site, route, dose_quantity, explanation_reason, explanation_reason_not_given from BACIRO_FHIR.IMMUNIZATION WHERE immunization_id = '" + immunization_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunization"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunization"});
      });
    },
		immunizationPractitioner: function updateImmunizationPractitioner(req, res) {
			console.log(req.body);
			var practitioner_id  = req.params.practitioner_id;
			var role  = req.body.role;
			var actor  = req.body.actor;
			var immunization_id  = req.body.immunization_id;

			var column = "";
      var values = "";
			
			if (typeof role !== 'undefined' && role !== "") {
        column += 'role,';
        values += "'" + role + "',";
      }
			
			if (typeof actor !== 'undefined' && actor !== "") {
        column += 'actor,';
        values += "'" + actor + "',";
      }
			
			if (typeof immunization_id !== 'undefined' && immunization_id !== "") {
        column += 'immunization_id,';
        values += "'" + immunization_id + "',";
      }	
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "practitioner_id = '" + practitioner_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_PRACTITIONER(practitioner_id," + column.slice(0, -1) + ") SELECT practitioner_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_PRACTITIONER WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select  practitioner_id, role, actor from baciro_fhir.IMMUNIZATION_PRACTITIONER WHERE practitioner_id = '" + practitioner_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationPractitioner"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationPractitioner"});
      });
    },
		immunizationReaction: function updateImmunizationReaction(req, res) {
			console.log(req.body);
			var reaction_id  = req.params.reaction_id;
			var date = req.body.date;
			var detail = req.body.detail;
			var reported = req.body.reported;
			var immunization_id  = req.body.immunization_id;

			var column = "";
      var values = "";
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof detail !== 'undefined' && detail !== "") {
        column += 'detail,';
        values += "'" + detail + "',";
      }
			
			if (typeof reported !== 'undefined' && reported !== "") {
        column += 'reported,';
        values += " " + reported + ",";
      }
			
			if (typeof immunization_id !== 'undefined' && immunization_id !== "") {
        column += 'immunization_id,';
        values += "'" + immunization_id + "',";
      }	
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "reaction_id = '" + reaction_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_REACTION(reaction_id," + column.slice(0, -1) + ") SELECT reaction_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_REACTION WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select reaction_id, date, detail, reported, immunization_id from baciro_fhir.IMMUNIZATION_REACTION WHERE reaction_id = '" + reaction_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationReaction"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationReaction"});
      });
    },
		immunizationVaccinationProtocol: function updateImmunizationVaccinationProtocol(req, res) {
			console.log(req.body);
			var vaccination_protocol_id  = req.params.vaccination_protocol_id;
			var dose_sequence = req.body.dose_sequence;
			var description = req.body.description;
			var authority = req.body.authority;
			var series = req.body.series;
			var series_doses = req.body.series_doses;
			var target_disease = req.body.target_disease;
			var dose_status = req.body.dose_status;
			var dose_status_reason = req.body.dose_status_reason;
			var immunization_id  = req.body.immunization_id;

			var column = "";
      var values = "";
			
			if (typeof dose_sequence !== 'undefined' && dose_sequence !== "") {
        column += 'dose_sequence,';
        values += " " + dose_sequence + ",";
      }
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }
			
			if (typeof authority !== 'undefined' && authority !== "") {
        column += 'authority,';
        values += "'" + authority + "',";
      }
			
			if (typeof series !== 'undefined' && series !== "") {
        column += 'series,';
        values += "'" + series + "',";
      }
			
			if (typeof series_doses !== 'undefined' && series_doses !== "") {
        column += 'series_doses,';
        values += "'" + series_doses + "',";
      }
			
			if (typeof target_disease !== 'undefined' && target_disease !== "") {
        column += 'target_disease,';
        values += "'" + target_disease + "',";
      }
			
			if (typeof dose_status !== 'undefined' && dose_status !== "") {
        column += 'dose_status,';
        values += "'" + dose_status + "',";
      }
			
			if (typeof dose_status_reason !== 'undefined' && dose_status_reason !== "") {
        column += 'dose_status_reason,';
        values += "'" + dose_status_reason + "',";
      }
			
			if (typeof immunization_id !== 'undefined' && immunization_id !== "") {
        column += 'immunization_id,';
        values += "'" + immunization_id + "',";
      }	
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "vaccination_protocol_id = '" + vaccination_protocol_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_VACCINATION_PROTOCOL(vaccination_protocol_id," + column.slice(0, -1) + ") SELECT vaccination_protocol_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_VACCINATION_PROTOCOL WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = " select vaccination_protocol_id, dose_sequence, description, authority, series, series_doses, target_disease, dose_status, dose_status_reason, immunization_id from BACIRO_FHIR.IMMUNIZATION_VACCINATION_PROTOCOL WHERE vaccination_protocol_id = '" + vaccination_protocol_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationVaccinationProtocol"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationVaccinationProtocol"});
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