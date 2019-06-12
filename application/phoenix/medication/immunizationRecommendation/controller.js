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
		immunizationRecommendation: function getImmunizationRecommendation(req, res){
			var apikey = req.params.apikey;
			var immunizationRecommendationId = req.query.immunizationRecommendationId;
			var date = req.query.date;
			var dose_number = req.query.doseNumber;
			var dose_sequence = req.query.doseSequence;
			var identifier = req.query.identifier;
			var information = req.query.information;
			var patient = req.query.patient;
			var status = req.query.status;
			var support = req.query.support;
			var target_disease = req.query.targetDisease;
			var vaccine_type = req.query.vaccineType;
			var offset = req.query.offset;
			var limit = req.query.limit;
			
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof immunizationRecommendationId !== 'undefined' && immunizationRecommendationId !== ""){
        condition += "ir.IMMUNIZATION_RECOMMENDATION_ID = '" + immunizationRecommendationId + "' AND,";  
      }
			
			if ((typeof date !== 'undefined' && date !== "") || (typeof dose_number !== 'undefined' && dose_number !== "") || (typeof dose_sequence !== 'undefined' && dose_sequence !== "") || (typeof status !== 'undefined' && status !== "") || (typeof target_disease !== 'undefined' && target_disease !== "") || (typeof vaccine_type !== 'undefined' && vaccine_type !== "")) {
				join += " LEFT JOIN BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_RECOMMENDATION irr on ir.IMMUNIZATION_RECOMMENDATION_ID = irr.IMMUNIZATION_RECOMMENDATION_ID ";
				
				if(typeof date !== 'undefined' && date !==  ""){
					condition += "irr.DATE <= to_date('" + date + "', 'yyyy-MM-dd') AND,";
				}
        
				if(typeof dose_number !== 'undefined' && dose_number !== ""){
					condition += "irr.DOSE_NUMBER = " + dose_sequence + " AND,";  
				}
				
				if(typeof dose_sequence !== 'undefined' && dose_sequence !== ""){
					condition += "irr.PROTOCOL_DOSE_SEQUENCE = " + dose_sequence + " AND,";  
				}
				
				if(typeof status !== 'undefined' && status !== ""){
					condition += "irr.FORECAST_STATUS = '" + status + "' AND,";  
				}
				
							
				if(typeof target_disease !== 'undefined' && target_disease !== ""){
					condition += "irr.TARGET_DISEASE = '" + target_disease + "' AND,";  
				}

				if(typeof vaccine_type !== 'undefined' && vaccine_type !== ""){
					condition += "irr.VACCINE_CODE = '" + vaccine_type + "' AND,";  
				}
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				join += " LEFT JOIN BACIRO_FHIR.identifier i on ir.IMMUNIZATION_RECOMMENDATION_ID = i.IMMUNIZATION_RECOMMENDATION_ID ";
        condition += "i.identifier_value = '" + identifier + "' AND,";  
      }
			
			if((typeof information !== 'undefined' && information !== "")){ 
			 var res = information.substring(0, 3);
				if(res == 'ali'){
					join += " LEFT JOIN BACIRO_FHIR.ALLERGY_INTOLERANCE ai ON ir.IMMUNIZATION_RECOMMENDATION_ID = ai.IMMUNIZATION_RECOMMENDATION_ID ";
          condition += "ALLERGY_INTOLERANCE_ID = '" + information + "' AND ";       
				} 
				if(res == 'obs') {
					join += " LEFT JOIN BACIRO_FHIR.OBSERVATION o ON ir.IMMUNIZATION_RECOMMENDATION_ID = o.IMMUNIZATION_RECOMMENDATION_ID ";
          condition += "OBSERVATION_ID = '" + information + "' AND ";       
				}
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
        condition += "ir.PATIENT = '" + patient + "' AND,";  
      }
			
			if(typeof support !== 'undefined' && support !== ""){
				join += " LEFT JOIN BACIRO_FHIR.IMMUNIZATION im on ir.IMMUNIZATION_RECOMMENDATION_ID = im.RECOMMENDATION_ID ";
        condition += "im.RECOMMENDATION_ID = '" + support + "' AND,";  
      }
			
			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " ir.immunization_recommendation_id > '" + offset + "' AND ";       
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
			      
      var arrImmunizationRecommendation = [];
      var query = "select ir.immunization_recommendation_id as immunization_recommendation_id, ir.patient as patient from BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION ir " + fixCondition + limit;
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var ImmunizationRecommendation = {};
					ImmunizationRecommendation.resourceType = "immunizationRecommendation";
          ImmunizationRecommendation.id = rez[i].immunization_recommendation_id;
					if(rez[i].patient != "null"){
						ImmunizationRecommendation.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient;
					} else {
						ImmunizationRecommendation.patient = "";
					}
          arrImmunizationRecommendation[i] = ImmunizationRecommendation;
        }
        res.json({"err_code":0,"data": arrImmunizationRecommendation});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getImmunizationRecommendation"});
      });
    },
		immunizationRecommendationRecommendation: function getImmunizationRecommendationRecommendation(req, res) {
			var apikey = req.params.apikey;
			
			var immunizationRecommendationRecommendationId = req.query._id;
			var immunizationRecommendationId = req.query.immunization_recommendation_id;

			//susun query
			var condition = "";

			if (typeof immunizationRecommendationRecommendationId !== 'undefined' && immunizationRecommendationRecommendationId !== "") {
				condition += "RECOMMENDATION__ID = '" + immunizationRecommendationRecommendationId + "' AND ";
			}

			if (typeof immunizationRecommendationId !== 'undefined' && immunizationRecommendationId !== "") {
				condition += "IMMUNIZATION_RECOMMENDATION_ID = '" + immunizationRecommendationId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrImmunizationRecommendationRecommendation = [];
			var query = "select recommendation__id, date, vaccine_code, target_disease, dose_number, forecast_status, protocol_dose_sequence, protocol_description, protocol_authority, protocol_series, immunization_recommendation_id from BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_RECOMMENDATION " + fixCondition;
console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ImmunizationRecommendationRecommendation = {};
					ImmunizationRecommendationRecommendation.id = rez[i].recommendation__id;
					if(rez[i].date == null){
						ImmunizationRecommendationRecommendation.date = formatDate(rez[i].date);
					}else{
						ImmunizationRecommendationRecommendation.date = rez[i].date;
					}
					ImmunizationRecommendationRecommendation.vaccineCode = rez[i].vaccine_code;
					ImmunizationRecommendationRecommendation.targetDisease = rez[i].target_disease;
					ImmunizationRecommendationRecommendation.doseNumber = rez[i].dose_number;
					ImmunizationRecommendationRecommendation.forecastStatus = rez[i].forecast_status;
					
					/*ImmunizationRecommendationRecommendation.protocol.doseSequence = rez[i].protocol_dose_sequence;
					ImmunizationRecommendationRecommendation.protocol.description = rez[i].protocol_description;
					if(rez[i].protocol_authority != "null"){
						ImmunizationRecommendationRecommendation.protocol.authority = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].protocol_authority;
					} else {
						ImmunizationRecommendationRecommendation.protocol.authority = "";
					}
					ImmunizationRecommendationRecommendation.protocol.series = rez[i].protocol_series;*/
					var Protocol = {};
					Protocol.doseSequence = rez[i].protocol_dose_sequence;
					Protocol.description = rez[i].protocol_description;
					if(rez[i].protocol_authority != "null"){
						Protocol.authority = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].protocol_authority;
					} else {
						Protocol.authority = "";
					}
					Protocol.series = rez[i].protocol_series;
					
					ImmunizationRecommendationRecommendation.protocol = Protocol;
					arrImmunizationRecommendationRecommendation[i] = ImmunizationRecommendationRecommendation;
				}
				res.json({
					"err_code": 0,
					"data": arrImmunizationRecommendationRecommendation
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImmunizationRecommendationRecommendation"
				});
			});
		},
		immunizationRecommendationDateCriterion: function getImmunizationRecommendationDateCriterion(req, res) {
			var apikey = req.params.apikey;
			
			var immunizationRecommendationDateCriterionId = req.query._id;
			var immunizationRecommendationId = req.query.recommendation_id;

			//susun query
			var condition = '';

			if (typeof immunizationRecommendationDateCriterionId !== 'undefined' && immunizationRecommendationDateCriterionId !== "") {
				condition += "DATE_CREATION_ID = '" + immunizationRecommendationDateCriterionId + "' AND ";
			}

			if (typeof immunizationRecommendationId !== 'undefined' && immunizationRecommendationId !== "") {
				condition += "RECOMMENDATION_ID = '" + immunizationRecommendationId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrImmunizationRecommendationDateCriterion = [];
			var query = 'select date_creation_id, code, "value" as col_value, recommendation_id from BACIRO_FHIR.RECOMMENDATION_DATE_CREATION ' + fixCondition;
console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var ImmunizationRecommendationDateCriterion = {};
					ImmunizationRecommendationDateCriterion.id = rez[i].date_creation_id;
					ImmunizationRecommendationDateCriterion.code = rez[i].code;
					ImmunizationRecommendationDateCriterion.value = rez[i].col_value;
					arrImmunizationRecommendationDateCriterion[i] = ImmunizationRecommendationDateCriterion;
				}
				res.json({
					"err_code": 0,
					"data": arrImmunizationRecommendationDateCriterion
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImmunizationRecommendationDateCriterion"
				});
			});
		},
		immunizationRecommendationSupportingImmunization: function getImmunizationRecommendationSupportingImmunization(req, res) {
			var apikey = req.params.apikey;
			
			var ImmunizationId = req.query._id;
			var immunizationRecommendationId = req.query.recommendation_id;

			//susun query
			var condition = '';

			if (typeof ImmunizationId !== 'undefined' && ImmunizationId !== "") {
				condition += "immunization_id = '" + ImmunizationId + "' AND ";
			}

			if (typeof immunizationRecommendationId !== 'undefined' && immunizationRecommendationId !== "") {
				condition += "recommendation_id = '" + immunizationRecommendationId + "' AND ";
			}
			
			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrImmunizationRecommendationSupportingImmunization = [];
			var query = 'select immunization_id from BACIRO_FHIR.immunization ' + fixCondition;
			console.log(query);
			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var immunizationRecommendationSupportingImmunization = {};
					if(rez[i].immunization_id != "null"){
						immunizationRecommendationSupportingImmunization.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Immunization?_id=' +  rez[i].immunization_id;
					} else {
						immunizationRecommendationSupportingImmunization.id = "";
					}
					
					arrImmunizationRecommendationSupportingImmunization[i] = immunizationRecommendationSupportingImmunization;
				}
				res.json({
					"err_code": 0,
					"data": arrImmunizationRecommendationSupportingImmunization
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImmunizationRecommendationSupportingImmunization"
				});
			});
		},
		immunizationRecommendationSupportingPatientInformationObservation: function getImmunizationRecommendationSupportingPatientInformationObservation(req, res) {
			var apikey = req.params.apikey;
			
			var ObservationId = req.query._id;
			var immunizationRecommendationId = req.query.recommendation_id;

			//susun query
			var condition = '';

			if (typeof ObservationId !== 'undefined' && ObservationId !== "") {
				condition += "observation_id = '" + ObservationId + "' AND ";
			}
			
			if (typeof immunizationRecommendationId !== 'undefined' && immunizationRecommendationId !== "") {
				condition += "recommendation_id = '" + immunizationRecommendationId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrImmunizationRecommendationSupportingPatientInformationObservation = [];
			var query = 'select observation_id from BACIRO_FHIR.Observation ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var immunizationRecommendationSupportingPatientInformationObservation = {};
					if(rez[i].observation_id != "null"){
						immunizationRecommendationSupportingPatientInformationObservation.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/Observation?_id=' +  rez[i].observation_id;
					} else {
						immunizationRecommendationSupportingPatientInformationObservation.id = "";
					}
					
					arrImmunizationRecommendationSupportingPatientInformationObservation[i] = immunizationRecommendationSupportingPatientInformationObservation;
				}
				res.json({
					"err_code": 0,
					"data": arrImmunizationRecommendationSupportingPatientInformationObservation
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImmunizationRecommendationSupportingPatientInformationObservation"
				});
			});
		},
		immunizationRecommendationSupportingPatientInformationAllergyIntolerance: function getImmunizationRecommendationSupportingPatientInformationAllergyIntolerance(req, res) {
			var apikey = req.params.apikey;
			
			var AllergyIntoleranceId = req.query._id;
			var immunizationRecommendationId = req.query.recommendation_id;

			//susun query
			var condition = '';

			if (typeof AllergyIntoleranceId !== 'undefined' && AllergyIntoleranceId !== "") {
				condition += "allergy_intolerance_id = '" + AllergyIntoleranceId + "' AND ";
			}

			if (typeof immunizationRecommendationId !== 'undefined' && immunizationRecommendationId !== "") {
				condition += "recommendation_id = '" + immunizationRecommendationId + "' AND ";
			}

			if (condition == '') {
				fixCondition = '';
			} else {
				fixCondition = ' WHERE ' + condition.slice(0, -4);
			}

			var arrImmunizationRecommendationSupportingPatientInformationAllergyIntolerance = [];
			var query = 'select allergy_intolerance_id from BACIRO_FHIR.Allergy_Intolerance ' + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var immunizationRecommendationSupportingPatientInformationAllergyIntolerance = {};
					if(rez[i].allergy_intolerance_id != "null"){
						immunizationRecommendationSupportingPatientInformationAllergyIntolerance.id = hostFHIR + ':' + portFHIR + '/' + apikey + '/AllergyIntolerance?_id=' +  rez[i].allergy_intolerance_id;
					} else {
						immunizationRecommendationSupportingPatientInformationAllergyIntolerance.id = "";
					}
					
					arrImmunizationRecommendationSupportingPatientInformationAllergyIntolerance[i] = immunizationRecommendationSupportingPatientInformationAllergyIntolerance;
				}
				res.json({
					"err_code": 0,
					"data": arrImmunizationRecommendationSupportingPatientInformationAllergyIntolerance
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getImmunizationRecommendationSupportingPatientInformationAllergyIntolerance"
				});
			});
		}
		
  },
	post: {
		immunizationRecommendation: function addImmunizationRecommendation(req, res) {
			console.log(req.body);
			var immunization_recommendation_id = req.body.immunization_recommendation_id;
			var patient = req.body.patient;
			
			var column = "";
      var values = "";
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += ", '" + patient + "',";
      }	
			
			var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION(immunization_recommendation_id " + column.slice(0, -1) + ")"+
        " VALUES ('"+immunization_recommendation_id+"'" + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select immunization_recommendation_id, patient from BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION WHERE immunization_recommendation_id = '" + immunization_recommendation_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRecommendation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRecommendation"});
      });
    },
		immunizationRecommendationRecommendation: function addImmunizationRecommendationRecommendation(req, res) {
			console.log(req.body);
			var recommendation__id = req.body.recommendation_id;
			var date = req.body.date;
			var vaccine_code = req.body.vaccine_code;
			var target_disease = req.body.target_disease;
			var dose_number = req.body.dose_number;
			var forecast_status = req.body.forecast_status;
			var protocol_dose_sequence = req.body.protocol_dose_sequence;
			var protocol_description = req.body.protocol_description;
			var protocol_authority = req.body.protocol_authority;
			var protocol_series = req.body.protocol_series;
			var immunization_recommendation_id = req.body.immunization_recommendation_id;
			
			var column = "";
      var values = "";
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof vaccine_code !== 'undefined' && vaccine_code !== "") {
        column += 'vaccine_code,';
        values += "'" + vaccine_code + "',";
      }
			
			if (typeof target_disease !== 'undefined' && target_disease !== "") {
        column += 'target_disease,';
        values += "'" + target_disease + "',";
      }
			
			if (typeof dose_number !== 'undefined' && dose_number !== "") {
        column += 'dose_number,';
        values += " " + dose_number + ",";
      }	
			
			if (typeof forecast_status !== 'undefined' && forecast_status !== "") {
        column += 'forecast_status,';
        values += "'" + forecast_status + "',";
      }	
			
			if (typeof protocol_dose_sequence !== 'undefined' && protocol_dose_sequence !== "") {
        column += 'protocol_dose_sequence,';
        values += " " + protocol_dose_sequence + ",";
      }	
			
			if (typeof protocol_description !== 'undefined' && protocol_description !== "") {
        column += 'protocol_description,';
        values += "'" + protocol_description + "',";
      }	
			
			if (typeof protocol_authority !== 'undefined' && protocol_authority !== "") {
        column += 'protocol_authority,';
        values += "'" + protocol_authority + "',";
      }	
			
			if (typeof protocol_series !== 'undefined' && protocol_series !== "") {
        column += 'protocol_series,';
        values += "'" + protocol_series + "',";
      }	
			
			if (typeof immunization_recommendation_id !== 'undefined' && immunization_recommendation_id !== "") {
        column += 'immunization_recommendation_id,';
        values += "'" + immunization_recommendation_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_RECOMMENDATION(recommendation__id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+recommendation__id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select recommendation__id, date, vaccine_code, target_disease, dose_number, forecast_status, protocol_dose_sequence, protocol_description, protocol_authority, protocol_series, immunization_recommendation_id from BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_RECOMMENDATION WHERE recommendation__id = '" + recommendation__id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRecommendationRecommendation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRecommendationRecommendation"});
      });
    },
		immunizationRecommendationDateCriterion: function addImmunizationRecommendationDateCriterion(req, res) {
			console.log(req.body);
			console.log("678");
			var date_creation_id  = req.body.date_creation_id;
			var code = req.body.code;
			var value = req.body.value;
			var recommendation_id = req.body.recommendation_id;
			

			var column = '';
      var values = '';
			
			if (typeof value !== 'undefined' && value !== "") {
        column += '"value",';
        //values += "'" + date + "',";
				values += "to_date('"+ value + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'"  + code + "',";
      }
			
			if (typeof recommendation_id !== 'undefined' && recommendation_id !== "") {
        column += 'recommendation_id,';
        values += "'" + recommendation_id + "',";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.RECOMMENDATION_DATE_CREATION(date_creation_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+date_creation_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = 'select date_creation_id, code, "value" as col_value, recommendation_id from BACIRO_FHIR.RECOMMENDATION_DATE_CREATION WHERE date_creation_id = ' +  "'" + date_creation_id + "'";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRecommendationDateCriterion"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addImmunizationRecommendationDateCriterion"});
      });
    },
	},
	put: {
		immunizationRecommendation: function updateImmunizationRecommendation(req, res) {
			console.log(req.body);
			
			var immunization_recommendation_id = req.params._id;
			var patient = req.body.patient;
			
			var column = "";
      var values = "";
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += ", '" + patient + "',";
      }	
			
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "immunization_recommendation_id = '" + immunization_recommendation_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "immunization_recommendation_id = '" + immunization_recommendation_id + "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION(immunization_recommendation_id" + column.slice(0, -1) + ") SELECT immunization_recommendation_id " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select immunization_recommendation_id, patient from BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION WHERE immunization_recommendation_id = '" + immunization_recommendation_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRecommendation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRecommendation"});
      });
    },
		immunizationRecommendationRecommendation: function updateImmunizationRecommendationRecommendation(req, res) {
			console.log(req.body);
			var recommendation__id = req.params._id;
			var date = req.body.date;
			var vaccine_code = req.body.vaccine_code;
			var target_disease = req.body.target_disease;
			var dose_number = req.body.dose_number;
			var forecast_status = req.body.forecast_status;
			var protocol_dose_sequence = req.body.protocol_dose_sequence;
			var protocol_description = req.body.protocol_description;
			var protocol_authority = req.body.protocol_authority;
			var protocol_series = req.body.protocol_series;
			var immunization_recommendation_id = req.body.immunization_recommendation_id;
			
			var column = "";
      var values = "";
			
			if (typeof date !== 'undefined' && date !== "") {
        column += 'date,';
        //values += "'" + date + "',";
				values += "to_date('"+ date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof vaccine_code !== 'undefined' && vaccine_code !== "") {
        column += 'vaccine_code,';
        values += "'" + vaccine_code + "',";
      }
			
			if (typeof target_disease !== 'undefined' && target_disease !== "") {
        column += 'target_disease,';
        values += "'" + target_disease + "',";
      }
			
			if (typeof dose_number !== 'undefined' && dose_number !== "") {
        column += 'dose_number,';
        values += " " + dose_number + ",";
      }	
			
			if (typeof forecast_status !== 'undefined' && forecast_status !== "") {
        column += 'forecast_status,';
        values += "'" + forecast_status + "',";
      }	
			
			if (typeof protocol_dose_sequence !== 'undefined' && protocol_dose_sequence !== "") {
        column += 'protocol_dose_sequence,';
        values += " " + protocol_dose_sequence + ",";
      }	
			
			if (typeof protocol_description !== 'undefined' && protocol_description !== "") {
        column += 'protocol_description,';
        values += "'" + protocol_description + "',";
      }	
			
			if (typeof protocol_authority !== 'undefined' && protocol_authority !== "") {
        column += 'protocol_authority,';
        values += "'" + protocol_authority + "',";
      }	
			
			if (typeof protocol_series !== 'undefined' && protocol_series !== "") {
        column += 'protocol_series,';
        values += "'" + protocol_series + "',";
      }	
			
			if (typeof immunization_recommendation_id !== 'undefined' && immunization_recommendation_id !== "") {
        column += 'immunization_recommendation_id,';
        values += "'" + immunization_recommendation_id + "',";
      }		
			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "recommendation__id = '" + recommendation__id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "recommendation__id = '" + recommendation__id + "'";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_RECOMMENDATION(recommendation__id," + column.slice(0, -1) + ") SELECT recommendation__id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_RECOMMENDATION WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select recommendation__id, date, vaccine_code, target_disease, dose_number, forecast_status, protocol_dose_sequence, protocol_description, protocol_authority, protocol_series, immunization_recommendation_id from BACIRO_FHIR.IMMUNIZATION_RECOMMENDATION_RECOMMENDATION WHERE recommendation__id = '" + recommendation__id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRecommendationRecommendation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRecommendationRecommendation"});
      });
    },
		immunizationRecommendationDateCriterion: function updateImmunizationRecommendationDateCriterion(req, res) {
			console.log(req.body);
			var date_creation_id  = req.params._id;
			var code = req.body.code;
			var value = req.body.value;
			var recommendation_id = req.body.recommendation_id;
			

			var column = '';
      var values = '';
			
			if (typeof value !== 'undefined' && value !== "") {
        column += '"value",';
        //values += "'" + date + "',";
				values += "to_date('"+ value + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'"  + code + "',";
      }
			
			if (typeof recommendation_id !== 'undefined' && recommendation_id !== "") {
        column += 'recommendation_id,';
        values += "'" + recommendation_id + "',";
      }

			
			var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "date_creation_id = '" + date_creation_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "recommendation__id = '" + recommendation__id + "'";
      }
			
			var query = 'UPSERT INTO BACIRO_FHIR.RECOMMENDATION_DATE_CREATION(date_creation_id,' + column.slice(0, -1) + ') SELECT date_creation_id, ' + values.slice(0, -1) + ' FROM BACIRO_FHIR.RECOMMENDATION_DATE_CREATION WHERE ' + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = 'select date_creation_id, code, "value" as col_value, recommendation_id from BACIRO_FHIR.RECOMMENDATION_DATE_CREATION WHERE date_creation_id = "' + date_creation_id + '"'
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRecommendationDateCriterion"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateImmunizationRecommendationDateCriterion"});
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