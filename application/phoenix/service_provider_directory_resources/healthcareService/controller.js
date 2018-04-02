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
var hostfhir = configYaml.fhir.host;
var portfhir = configYaml.fhir.port;

// var phoenix = require("./phoenix.js");
var phoenix = require(path.resolve("./phoenix.js"));
// var db = new phoenix("jdbc:phoenix:" + host + ":/hbase-unsecure");
var db = new phoenix("jdbc:phoenix:" + "192.168.1.231" + ":/hbase-unsecure");

var controller = {
	get: {
		healthcareService: function getHealthcareService(req, res){
			
			var healthcareServiceId = req.query._id;
			var healthcareServiceActive = req.query.active;
			var healthcareServiceCategory = req.query.category;
			var healthcareServiceCharacteristic = req.query.characteristic;
			var healthcareServiceName = req.query.name;
			var healthcareServiceProgramName = req.query.program_name;
			var healthcareServiceType = req.query.type;
			var organization = req.query.organization_id;
			var endpoint = req.query.endpoint_id;
			var identifier = req.query.identifier_value;
			var location = req.query.location_id;
			
			//susun query
      var condition = "";
			var join = "";
			
			if(typeof healthcareServiceId !== 'undefined' && healthcareServiceId !== ""){
        condition += "hs.healthcare_service_id = '" + healthcareServiceId + "' AND ";  
      }
			
			if(typeof healthcareServiceActive !== 'undefined' && healthcareServiceActive !== ""){
        condition += "hs.healthcare_service_active = '" + healthcareServiceActive + "' AND,";  
      }
			
			if(typeof healthcareServiceCategory !== 'undefined' && healthcareServiceCategory !== ""){
        condition += "hs.healthcare_service_category = '" + healthcareServiceCategory + "' AND,";  
      }
			
			if(typeof healthcareServiceCharacteristic !== 'undefined' && healthcareServiceCharacteristic !== ""){
        condition += "hs.healthcare_service_characteristic = '" + healthcareServiceCharacteristic + "' AND,";  
      }
			
			if(typeof healthcareServiceName !== 'undefined' && healthcareServiceName !== ""){
        condition += "hs.healthcare_service_name = '" + healthcareServiceName + "' AND,";  
      }
			
			if(typeof healthcareServiceProgramName !== 'undefined' && healthcareServiceProgramName !== ""){
        condition += "hs.healthcare_service_program_name = '" + healthcareServiceProgramName + "' AND,";  
      }
			
			if(typeof healthcareServiceType !== 'undefined' && healthcareServiceType !== ""){
        condition += "hs.healthcare_service_type = '" + healthcareServiceType + "' AND,";  
      }
			
			if(typeof organization !== 'undefined' && organization !== ""){
        condition += "hs.ORGANIZATION_ID = '" + organization + "' AND,";  
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
				condition += "id.identifier_value = '" + identifier + "' AND ";       
      }
			
			if(typeof location !== 'undefined' && location !== ""){
				condition += "l.LOCATION_ID = '" + location + "' AND ";       
      }
			
			if(typeof endpoint !== 'undefined' && endpoint !== ""){
        condition += "ep.endpoint_id = '" + endpoint + "' AND,";  
      }
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
			      
      
			var query = "select hs.healthcare_service_id as healthcare_service_id, healthcare_service_active, hs.organization_id as providedBy, healthcare_service_category, healthcare_service_type, healthcare_service_specialty, l.location_id as location_id, ca.location_id as coverage_area, healthcare_service_name, healthcare_service_comment, healthcare_service_extra_details, hs.attachment_id as attachment_id, healthcare_service_service_provision_code,healthcare_service_eligibility, healthcare_service_eligibility_note, healthcare_service_program_name, healthcare_service_characteristic, healthcare_service_referral_method, healthcare_service_appointegerment_required, pr.practitioner_role_availability_exceptions as practitioner_role_availability_exceptions, ep.endpoint_id as endpoint_id from BACIRO_FHIR.HEALTHCARE_SERVICE hs LEFT JOIN BACIRO_FHIR.location l ON l.LOCATION_HEALTHCARE_SERVICE_LOCATION = hs.healthcare_service_id LEFT JOIN BACIRO_FHIR.location ca ON ca.LOCATION_HEALTHCARE_SERVICE_COVERAGE_AREA = hs.healthcare_service_id LEFT JOIN BACIRO_FHIR.practitioner_role pr ON pr.PRACTITIONER_ROLE_ID = hs.PRACTITIONER_ROLE_ID LEFT JOIN BACIRO_FHIR.endpoint ep ON ep.healthcare_service_id = hs.healthcare_service_id " + fixCondition;
			
      console.log(query);
			var arrHealthcareService = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var HealthcareService = {};
					HealthcareService.resourceType = "HealthcareService";
          HealthcareService.id = rez[i].healthcare_service_id;
          HealthcareService.active = rez[i].practitioner_role_active;
					HealthcareService.providedBy = rez[i].providedBy;
					HealthcareService.category = rez[i].healthcare_service_category;
					HealthcareService.type = rez[i].healthcare_service_type;
					HealthcareService.specialty = rez[i].healthcare_service_specialty;
					HealthcareService.location = rez[i].location_id;
					HealthcareService.name = rez[i].healthcare_service_name;
					HealthcareService.comment = rez[i].healthcare_service_comment;
					HealthcareService.extraDetails = rez[i].healthcare_service_extra_details;
					HealthcareService.attachment_id = rez[i].attachment_id;
					HealthcareService.coverageArea = rez[i].coverage_area;
					HealthcareService.serviceProvisionCode = rez[i].healthcare_service_service_provision_code;
					HealthcareService.eligibility = rez[i].healthcare_service_eligibility;
					HealthcareService.eligibilityNote = rez[i].healthcare_service_eligibility_note;
					HealthcareService.programName = rez[i].healthcare_service_program_name;
					HealthcareService.characteristic = rez[i].healthcare_service_characteristic;
					HealthcareService.appointmentRequired = rez[i].healthcare_service_referral_method;
					HealthcareService.endpoint = rez[i].endpoint_id;
					
          arrHealthcareService[i] = HealthcareService;
        }
        res.json({"err_code":0,"data": arrHealthcareService});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPractitionerRole"});
      });
    },
		availableTime: function getAvailableTime(req, res){
			console.log(req.query);
			var healthcare_service_id = req.query.healthcare_service_id;			    
			
			var condition = "";
			var join = "";
			
			if(typeof healthcare_service_id !== 'undefined' && healthcare_service_id !== ""){
        condition += "healthcare_service_id = '" + healthcare_service_id + "' AND ";  
      }
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
      
			var query = "select available_time_id, available_time_day_of_week, available_time_all_day, available_time_start, available_time_end from baciro_fhir.AVAILABLE_TIME " + fixCondition;
			
      console.log(query);
			var arrAvailableTime = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var AvailableTime = {};
					AvailableTime.id = rez[i].available_time_id;
          AvailableTime.daysOfWeek = rez[i].available_time_day_of_week;
					AvailableTime.allDay = rez[i].available_time_all_day;
					AvailableTime.availableTimeStart = rez[i].available_time_start;
					AvailableTime.availableTimeEnd = rez[i].available_time_end;
					
          arrAvailableTime[i] = AvailableTime;
        }
        res.json({"err_code":0,"data": arrAvailableTime});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getAvailableTime"});
      });
    },
		notAvailable: function getNotAvailable(req, res){
			
			var healthcare_service_id = req.query.healthcare_service_id;			      
      
			var condition = "";
			var join = "";
			
			if(typeof healthcare_service_id !== 'undefined' && healthcare_service_id !== ""){
        condition += "healthcare_service_id = '" + healthcare_service_id + "' AND ";  
      }
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
			
			var query = "select not_available_id, not_available_description, not_available_during from baciro_fhir.NOT_AVAILABLE " + fixCondition;
			
      console.log(query);
			var arrAvailableTime = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var AvailableTime = {};
					AvailableTime.id = rez[i].not_available_id;
          AvailableTime.description = rez[i].not_available_description;
					AvailableTime.during = rez[i].not_available_during;
					
          arrAvailableTime[i] = AvailableTime;
        }
        res.json({"err_code":0,"data": arrAvailableTime});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getNotAvailable"});
      });
    }
  },
  post: {
    healthcareService: function addHealthcareService(req, res){
			
			console.log(req.body);
			var healthcare_service_id = req.body.id;
			var healthcare_service_active = req.body.active;
			var healthcare_service_category = req.body.category;
			var healthcare_service_type = req.body.type;
			var healthcare_service_specialty = req.body.specialty;
			var healthcare_service_name = req.body.name;
			var healthcare_service_comment = req.body.comment;
			var healthcare_service_extra_details = req.body.extraDetails;
			var healthcare_service_service_provision_code = req.body.serviceProvisionCode;
			var healthcare_service_eligibility = req.body.eligibility;
			var healthcare_service_eligibility_note = req.body.eligibilityNote;
			var healthcare_service_program_name = req.body.programName;
			var healthcare_service_characteristic = req.body.characteristic;
			var healthcare_service_referral_method = req.body.referralMethod;
			var healthcare_service_appointegerment_required = req.body.appointmentRequired;
			var healthcare_service_availability_exceptions = req.body.availabilityExceptions;
			var organization_id = req.body.providedBy;
			var attachment_id = req.body.attachmentId;
			var location_id = req.body.location;
			var location_coverageArea = req.body.coverageArea;
			var endpoint_id = req.body.endpoint;
			
			var column = "";
      var values = "";
			
			if(typeof healthcare_service_active !== 'undefined'){
        column += 'healthcare_service_active,';
        values += " " + healthcare_service_active +",";
      }
			
			if(typeof healthcare_service_category !== 'undefined'){
        column += 'healthcare_service_category,';
        values += "'" + healthcare_service_category +"',";
      }
			
			if(typeof healthcare_service_type !== 'undefined'){
        column += 'healthcare_service_type,';
        values += "'" + healthcare_service_type +"',";
      }
			
			if(typeof healthcare_service_specialty !== 'undefined'){
        column += 'healthcare_service_specialty,';
        values += "'" + healthcare_service_specialty +"',";
      }
			
			if(typeof healthcare_service_name !== 'undefined'){
        column += 'healthcare_service_name,';
        values += "'" + healthcare_service_name +"',";
      }
			
			if(typeof healthcare_service_comment !== 'undefined'){
        column += 'healthcare_service_comment,';
        values += "'" + healthcare_service_comment +"',";
      }
			
			if(typeof healthcare_service_extra_details !== 'undefined'){
        column += 'healthcare_service_extra_details,';
        values += "'" + healthcare_service_extra_details +"',";
      }
			
			if(typeof healthcare_service_service_provision_code !== 'undefined'){
        column += 'healthcare_service_service_provision_code,';
        values += "'" + healthcare_service_service_provision_code +"',";
      }
			
			if(typeof healthcare_service_eligibility !== 'undefined'){
        column += 'healthcare_service_eligibility,';
        values += "'" + healthcare_service_eligibility +"',";
      }
			
			if(typeof healthcare_service_eligibility_note !== 'undefined'){
        column += 'healthcare_service_eligibility_note,';
        values += "'" + healthcare_service_eligibility_note +"',";
      }
			
			if(typeof healthcare_service_program_name !== 'undefined'){
        column += 'healthcare_service_program_name,';
        values += "'" + healthcare_service_program_name +"',";
      }
			
			if(typeof healthcare_service_characteristic !== 'undefined'){
        column += 'healthcare_service_characteristic,';
        values += "'" + healthcare_service_characteristic +"',";
      }
			
			if(typeof healthcare_service_referral_method !== 'undefined'){
        column += 'healthcare_service_referral_method,';
        values += "'" + healthcare_service_referral_method +"',";
      }
			
			if(typeof healthcare_service_appointegerment_required !== 'undefined'){
        column += 'healthcare_service_appointegerment_required,';
        values += "" + healthcare_service_appointegerment_required +",";
      }
			
			if(typeof healthcare_service_availability_exceptions !== 'undefined'){
        column += 'healthcare_service_availability_exceptions,';
        values += "'" + healthcare_service_availability_exceptions +"',";
      }
			
			if(typeof organization_id !== 'undefined'){
        column += 'organization_id,';
        values += "'" + organization_id +"',";
      }
			
			if(typeof attachment_id !== 'undefined'){
        column += 'attachment_id,';
        values += "'" + attachment_id +"',";
      }
			
			/*if(typeof location_id !== 'undefined'){
        column += 'location_id,';
        values += "'" + location_id +"',";
      }
			
			if(typeof location_coverageArea !== 'undefined'){
        column += 'location_id,';
        values += "'" + location_coverageArea +"',";
      }
			
			if(typeof endpoint_id !== 'undefined'){
        column += 'endpoint_id,';
        values += "'" + endpoint_id +"',";
      }*/

      var query = "UPSERT INTO BACIRO_FHIR.HEALTHCARE_SERVICE(healthcare_service_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+healthcare_service_id+"', " + values.slice(0, -1) + ")";
			console.log(query);
			
      db.upsert(query,function(succes){
				
				var query2 = "UPSERT INTO BACIRO_FHIR.ENDPOINT(ENDPOINT_ID, HEALTHCARE_SERVICE_ID) SELECT ENDPOINT_ID, '" + healthcare_service_id + "' FROM BACIRO_FHIR.ENDPOINT WHERE ENDPOINT_ID = '" + endpoint_id + "'";
        db.upsert(query2,function(dataJson){
					var query3 = "UPSERT INTO BACIRO_FHIR.LOCATION(LOCATION_ID, LOCATION_HEALTHCARE_SERVICE_LOCATION) SELECT LOCATION_ID, '" + healthcare_service_id + "' FROM BACIRO_FHIR.LOCATION WHERE LOCATION_ID = '" + location_id + "'";
					console.log(query3);
					db.upsert(query3,function(dataJson){
						var query4 = "UPSERT INTO BACIRO_FHIR.LOCATION(LOCATION_ID, LOCATION_HEALTHCARE_SERVICE_COVERAGE_AREA) SELECT LOCATION_ID, '" + healthcare_service_id + "' FROM BACIRO_FHIR.LOCATION WHERE LOCATION_ID = '" + location_coverageArea + "'";
						console.log(query4);
						db.upsert(query4,function(dataJson){
				
							var query = "SELECT healthcare_service_id, healthcare_service_active, healthcare_service_category, healthcare_service_type, healthcare_service_specialty, healthcare_service_name, healthcare_service_comment, healthcare_service_extra_details, healthcare_service_service_provision_code, healthcare_service_eligibility, healthcare_service_eligibility_note,healthcare_service_program_name,healthcare_service_characteristic,  healthcare_service_referral_method, healthcare_service_appointegerment_required, healthcare_service_availability_exceptions, organization_id FROM BACIRO_FHIR.HEALTHCARE_SERVICE  WHERE healthcare_service_id = '" + healthcare_service_id + "' ";
							db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addHealthcareService"});
        });				
						},function(e){
							res.json({"err_code": 4, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleLocationCoverageAreaReference"});
						});
					},function(e){
						res.json({"err_code": 4, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleLocationReference"});
					});
				},function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleEndpointRefence"});
        });
				
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addHealthcareService"});
      });
    },
		availableTime: function addAvailableTime(req, res){
			//console.log(req);
			
			var healthcare_service_id = req.body.healthcare_service_id;
			var available_time_id = req.body.id;
			var available_time_day_of_week = req.body.daysOfWeek;
			var available_time_all_day = req.body.allDay;
			var available_time_start = req.body.availableEndTime;
			var available_time_end = req.body.availableEndTime;
			
			var column = "";
      var values = "";
			
			if(typeof available_time_day_of_week !== 'undefined'){
        column += 'available_time_day_of_week,';
        values += " '" + available_time_day_of_week +"',";
      }
			
			if(typeof available_time_all_day !== 'undefined'){
        column += 'available_time_all_day,';
        values += " " + available_time_all_day +",";
      }
			
			if(typeof healthcare_service_id !== 'undefined'){
        column += 'healthcare_service_id,';
        values += "'" + healthcare_service_id +"',";
      }
			
			if(typeof available_time_start !== 'undefined'){
        column += 'available_time_start,';
        values += "to_date('"+ available_time_start + "', 'yyyy-MM-dd'),";
      }
			
			if(typeof available_time_end !== 'undefined'){
        column += 'available_time_end,';
        values += "to_date('"+ available_time_end + "', 'yyyy-MM-dd'),";
      }
			
			

      var query = "UPSERT INTO BACIRO_FHIR.AVAILABLE_TIME(available_time_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+available_time_id+"', " + values.slice(0, -1) + ")";
			console.log(query);
      db.upsert(query,function(succes){
        var query = "SELECT available_time_id, available_time_day_of_week, available_time_all_day, available_time_start, available_time_end, healthcare_service_id FROM BACIRO_FHIR.AVAILABLE_TIME  WHERE healthcare_service_id = '" + healthcare_service_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAvailableTime"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAvailableTime"});
      });
    },
		notAvailable: function addNotAvailable(req, res){
			//console.log(req);
			var healthcare_service_id = req.body.healthcareServiceId;
			var not_available_id = req.body.id;
			var not_available_description = req.body.description;
			var not_available_during = req.body.during;
			
			var column = "";
      var values = "";
			
			if(typeof not_available_description !== 'undefined'){
        column += 'not_available_description,';
        values += "'" + not_available_description +"',";
      }
			
			if(typeof healthcare_service_id !== 'undefined'){
        column += 'healthcare_service_id,';
        values += "'" + healthcare_service_id +"',";
      }
			
			if(typeof not_available_during !== 'undefined'){
        column += 'not_available_during,';
        values += "to_date('"+ not_available_during + "', 'yyyy-MM-dd'),";
      }

      var query = "UPSERT INTO BACIRO_FHIR.NOT_AVAILABLE(not_available_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+not_available_id+"', " + values.slice(0, -1) + ")";
			console.log(query);
      db.upsert(query,function(succes){
        var query = "SELECT not_available_id, not_available_description, not_available_during, not_available_during FROM BACIRO_FHIR.NOT_AVAILABLE  WHERE healthcare_service_id = '" + healthcare_service_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addNotAvailable"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addNotAvailable"});
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