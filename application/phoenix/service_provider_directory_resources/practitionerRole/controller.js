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
var db = new phoenix("jdbc:phoenix:" + host + ":/hbase-unsecure");

var controller = {
	get: {
		practitionerRole: function getPractitionerRole(req, res){
			
			var practitionerRoleId = req.query._id;
			var practitionerRoleActive = req.query.active;
			var practitionerRoleCode = req.query.code;
			var practitionerRolePeriodStart = req.query.periodStart;
			var practitionerRolePeriodEnd = req.query.periodEnd;
			var practitionerRoleSpecialty = req.query.specialty;
			var endpointId = req.query.endpoint_id;
			var identifier = req.query.identifier_value;
			var location = req.query.location_id;
			var organization = req.query.organization_id;
			var practitionerId = req.query.practitioner_id;
			var healthcareService = req.query.healthcare_service_id;
			var contactPointPhone = req.query.contact_point_phone;
			var contactPointEmail = req.query.contact_point_email;
      var contactPointValue = req.query.contact_point_value;
			
      //susun query
      var condition = "";
			var join = "";
			
			if(typeof practitionerRoleId !== 'undefined' && practitionerRoleId !== ""){
        condition += "pr.practitioner_role_id = '" + practitionerRoleId + "' AND ";  
      }
			
			if(typeof practitionerRoleActive !== 'undefined' && practitionerRoleActive !== ""){
        condition += "pr.PRACTITIONER_ROLE_ACTIVE = '" + practitionerRoleActive + "' AND,";  
      }
			
			if(typeof practitionerRoleCode !== 'undefined' && practitionerRoleCode !== ""){
        condition += "pr.PRACTITIONER_ROLE_CODE = '" + practitionerRoleCode + "' AND,";  
      }
			
			if((typeof practitionerRolePeriodStart !== 'undefined' && practitionerRolePeriodStart !== "") && (typeof practitionerRolePeriodEnd !== 'undefined' && practitionerRolePeriodEnd !== "")){
        condition += "pr.PRACTITIONER_ROLE_PERIOD_START >= to_date('" + practitionerRolePeriodStart + "') AND pr.PRACTITIONER_ROLE_PERIOD_END >= to_date('" +  practitionerRolePeriodEnd + "') AND,";  
      }
			
			if(typeof practitionerRoleSpecialty !== 'undefined' && practitionerRoleSpecialty !== ""){
        condition += "pr.PRACTITIONER_ROLE_SPECIALTY = '" + practitionerRoleSpecialty + "' AND,";  
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
          condition += "id.identifier_value = '" + identifier + "' AND ";
          join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER id ON id.PRACTITIONER_ROLE_ID = pr.PRACTITIONER_ROLE_ID ";
        }
			
			if(typeof location !== 'undefined' && location !== ""){
          condition += "l.LOCATION_ID = '" + location + "' AND ";
				  join += " JOIN BACIRO_FHIR.location l ON l.PRACTITIONER_ROLE_ID = pr.PRACTITIONER_ROLE_ID ";
        }
						
			if(typeof organization !== 'undefined' && organization !== ""){
        condition += "pr.ORGANIZATION_ID = '" + organization + "' AND,";  
      }
			
			if(typeof practitionerId !== 'undefined' && practitionerId !== ""){
        condition += "pr.PRACTITIONER_ID = '" + practitionerId + "' AND,";  
      }
			
			if(typeof healthcareService !== 'undefined' && healthcareService !== ""){
          condition += "l.oragnization_id = '" + healthcareService + "' AND ";
				  join += " LEFT JOIN BACIRO_FHIR.HEALTHCARE_SERVICE hs ON hs.PRACTITIONER_ROLE_ID = pr.PRACTITIONER_ROLE_ID ";
        }
			
			if(typeof endpointId !== 'undefined' && endpointId !== ""){
          condition += "ep.endpoint_id = '" + endpointId + "' AND ";
				  join += " LEFT JOIN BACIRO_FHIR.ENDPOINT ep ON ep.PRACTITIONER_ROLE_ID = pr.PRACTITIONER_ROLE_ID ";
        }
			  
			if(typeof contactPointPhone !== 'undefined' && contactPointPhone !== ""){
				condition += "cp.CONTACT_POINT_SYSTEM = 'phone' AND cp.CONTACT_POINT_VALUE = '" + contactPointPhone + "' AND "; 
				join += " LEFT JOIN BACIRO_FHIR.CONTACT_POINT cp ON cp.PRACTITIONER_ROLE_ID = pr.PRACTITIONER_ROLE_ID ";
			}

			if(typeof contactPointEmail !== 'undefined' && contactPointEmail !== ""){
				condition += "cp.CONTACT_POINT_SYSTEM = 'email' AND cp.CONTACT_POINT_VALUE = '" + contactPointEmail + "' AND ";
				join += " LEFT JOIN BACIRO_FHIR.CONTACT_POINT cp ON cp.PRACTITIONER_ROLE_ID = pr.PRACTITIONER_ROLE_ID ";
			}

			if(typeof contactPointValue !== 'undefined' && contactPointValue !== ""){
				condition += "cp.CONTACT_POINT_VALUE = '" + contactPointValue + "' AND ";
				join += " LEFT JOIN BACIRO_FHIR.CONTACT_POINT cp ON cp.PRACTITIONER_ROLE_ID = pr.PRACTITIONER_ROLE_ID ";
			}

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      
			var query = "select pr.practitioner_role_id as practitioner_role_id, practitioner_role_active, practitioner_role_period_start, practitioner_role_period_end, pr.practitioner_id as practitioner_id, pr.organization_id as organization_id, practitioner_role_code, practitioner_role_specialty, practitioner_role_availability_exceptions from BACIRO_FHIR.PRACTITIONER_ROLE pr  " + fixCondition;
			
      //console.log(query);
			var arrPractitionerRole = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var PractitionerRole = {};
					PractitionerRole.resourceType = "PractitionerRole";
          PractitionerRole.id = rez[i].practitioner_role_id;
          PractitionerRole.active = rez[i].practitioner_role_active;
					var practitioner_role_period_start,practitioner_role_period_end;
          if(rez[i].practitioner_role_period_start == null){
            period_start = formatDate(rez[i].practitioner_role_period_start);  
          }else{
            period_start = rez[i].practitioner_role_period_start;  
          }
          if(rez[i].practitioner_role_period_end == null){
            period_end = formatDate(rez[i].practitioner_role_period_end);  
          }else{
            period_end = rez[i].practitioner_role_period_end;  
          }
					PractitionerRole.period = period_start + ' to ' + period_end;
					PractitionerRole.practitioner = rez[i].practitioner_id;
					PractitionerRole.organization = rez[i].organization_id;
					PractitionerRole.code = rez[i].practitioner_role_code;
					PractitionerRole.specialty = rez[i].practitioner_role_specialty;
					PractitionerRole.practitioner_role_availability_exceptions = rez[i].practitioner_role_availability_exceptions;
					//PractitionerRole.location = rez[i].location_id;
					//PractitionerRole.healthcareService = rez[i].healthcare_service_id;
					//PractitionerRole.endpoint = rez[i].endpoint_id;
					
          arrPractitionerRole[i] = PractitionerRole;
        }
        res.json({"err_code":0,"data": arrPractitionerRole});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPractitionerRole"});
      });
    },
		endpoint: function getEndpoint(req, res){
			var apikey = req.params.apikey;
			var endpointId = req.query._id;
			var practitionerRoleId = req.query.practitioner_role_id;
			//var healthcareServiceId = req.query.healthcare_service_id;
			
			var condition = "";
			var join = "";
			
			if(typeof endpointId !== 'undefined' && endpointId !== ""){
        condition += "endpoint_id = '" + endpointId + "' AND ";  
      }
			
			if(typeof practitionerRoleId !== 'undefined' && practitionerRoleId !== ""){
        condition += "practitioner_role_id = '" + practitionerRoleId + "' AND ";  
      }
			
			/*if(typeof healthcareServiceId !== 'undefined' && healthcareServiceId !== ""){
        condition += "healthcare_service_id = '" + healthcareServiceId + "' AND ";  
      }*/
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
      
			var query = "select endpoint_id from baciro_fhir.endpoint " + fixCondition;
			//console.log(query);
      
			var arrEndpoint = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
					//console.log(hostfhir + ":" + portfhir + "/" + apikey + "/endpoint?_id=" + rez[i].endpoint_id);
          var Endpoint = {};
					Endpoint.id = hostfhir + ":" + portfhir + "/" + apikey + "/endpoint?_id=" + rez[i].endpoint_id;
          //console.log(Endpoint);
          arrEndpoint[i] = Endpoint;
        }
        res.json({"err_code":0,"data": arrEndpoint});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getEndpoint"});
      });
    },
		location: function getLocation(req, res){
			var apikey = req.params.apikey;
			var locationId = req.query._id;
			var practitionerRoleId = req.query.practitioner_role_id;
			//var healthcareServiceId = req.query.healthcare_service_id;
			
			var condition = "";
			var join = "";
			
			if(typeof locationId !== 'undefined' && locationId !== ""){
        condition += "location_id = '" + locationId + "' AND ";  
      }
			
			if(typeof practitionerRoleId !== 'undefined' && practitionerRoleId !== ""){
        condition += "practitioner_role_id = '" + practitionerRoleId + "' AND ";  
      }
			
			/*if(typeof healthcareServiceId !== 'undefined' && healthcareServiceId !== ""){
        condition += "healthcare_service_id = '" + healthcareServiceId + "' AND ";  
      }*/
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
      
			var query = "select location_id from baciro_fhir.Location " + fixCondition;
			//console.log(query);
      
			var arrLocation = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
					//console.log(hostfhir + ":" + portfhir + "/" + apikey + "/location?_id=" + rez[i].endpoint_id);
          var Location = {};
					Location.id = hostfhir + ":" + portfhir + "/" + apikey + "/location?_id=" + rez[i].location_id;
          //console.log(Endpoint);
          arrLocation[i] = Location;
        }
        res.json({"err_code":0,"data": arrLocation});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getLocation"});
      });
    },
		healthcareService: function getHealthcareService(req, res){
			var apikey = req.params.apikey;
			var healthcareServiceId = req.query._id;
			var practitionerRoleId = req.query.practitioner_role_id;
			//var healthcareServiceId = req.query.healthcare_service_id;
			
			var condition = "";
			var join = "";
			
			if(typeof healthcareServiceId !== 'undefined' && healthcareServiceId !== ""){
        condition += "healthcare_service_id = '" + healthcareServiceId + "' AND ";  
      }
			
			if(typeof practitionerRoleId !== 'undefined' && practitionerRoleId !== ""){
        condition += "practitioner_role_id = '" + practitionerRoleId + "' AND ";  
      }
			
			/*if(typeof healthcareServiceId !== 'undefined' && healthcareServiceId !== ""){
        condition += "healthcare_service_id = '" + healthcareServiceId + "' AND ";  
      }*/
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
      
			var query = "select healthcare_service_id from baciro_fhir.healthcare_service " + fixCondition;
			//console.log(query);
      
			var arrHS = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
					//console.log(hostfhir + ":" + portfhir + "/" + apikey + "/location?_id=" + rez[i].endpoint_id);
          var hs = {};
					hs.id = hostfhir + ":" + portfhir + "/" + apikey + "/healthcareservice?_id=" + rez[i].healthcare_service_id;
          //console.log(Endpoint);
          arrHS[i] = hs;
        }
        res.json({"err_code":0,"data": arrHS});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getHealthcareService"});
      });
    }
		/*,
		availableTime: function getAvailableTime(req, res){
			console.log(req.query);
			var practitionerRoleId = req.query.practitioner_role_id;			    
			
			var condition = "";
			var join = "";
			
			if(typeof practitionerRoleId !== 'undefined' && practitionerRoleId !== ""){
        condition += "practitioner_role_id = '" + practitionerRoleId + "' AND ";  
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
			
			var practitionerRoleId = req.query.practitioner_role_id;			      
      
			var condition = "";
			var join = "";
			
			if(typeof practitionerRoleId !== 'undefined' && practitionerRoleId !== ""){
        condition += "practitioner_role_id = '" + practitionerRoleId + "' AND ";  
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
    }*/
  },
  post: {
    practitionerRole: function addPractitionerRole(req, res){
			//console.log(req.body);
			var practitioner_role_id = req.body.id;
			var practitioner_role_active = req.body.active;
			var practitioner_role_period_start = req.body.period_start;
			var practitioner_role_period_end = req.body.period_end;
			var practitioner_role_code = req.body.code;
			var practitioner_role_specialty = req.body.specialty;
			var practitioner_role_availability_exceptions = req.body.availabilityExceptions;
			var practitioner_id = req.body.practitioner;
			var organization_id = req.body.organization;
			var location_id = req.body.location;
			var healthcare_service_id = req.body.healthcareService;
			var endpoint_id = req.body.endpoint;
			
			var column = "";
      var values = "";
			
			if(typeof practitioner_role_active !== 'undefined'){
        column += 'practitioner_role_active,';
        values += " " + practitioner_role_active +",";
      }
			
			if(typeof practitioner_role_code !== 'undefined'){
        column += 'practitioner_role_code,';
        values += "'" + practitioner_role_code +"',";
      }
			
			if(typeof practitioner_role_specialty !== 'undefined'){
        column += 'practitioner_role_specialty,';
        values += "'" + practitioner_role_specialty +"',";
      }
			
			if(typeof practitioner_role_availability_exceptions !== 'undefined'){
        column += 'practitioner_role_availability_exceptions,';
        values += "'" + practitioner_role_availability_exceptions +"',";
      }
			
			if(typeof practitioner_role_period_start !== 'undefined'){
        column += 'practitioner_role_period_start,';
        values += "to_date('"+ practitioner_role_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if(typeof practitioner_role_period_end !== 'undefined'){
        column += 'practitioner_role_period_end,';
        values += "to_date('"+ practitioner_role_period_end + "', 'yyyy-MM-dd'),";
      }			
			
			if(typeof practitioner_id !== 'undefined'){
        column += 'practitioner_id,';
        values += "'" + practitioner_id +"',";
      }
			
			if(typeof organization_id !== 'undefined'){
        column += 'organization_id,';
        values += "'" + organization_id +"',";
      }
			
			/*if(typeof location_id !== 'undefined'){
        column += 'location_id,';
        values += "'" + location_id +"',";
      }
			
			if(typeof healthcare_service_id !== 'undefined'){
        column += 'healthcare_service_id,';
        values += "'" + healthcare_service_id +"',";
      }
			
			if(typeof endpoint_id !== 'undefined'){
        column += 'endpoint_id,';
        values += "'" + endpoint_id +"',";
      }*/

      var query = "UPSERT INTO BACIRO_FHIR.PRACTITIONER_ROLE(practitioner_role_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+practitioner_role_id+"', " + values.slice(0, -1) + ")";
			//console.log(query);
      db.upsert(query,function(succes){
				var query2 = "UPSERT INTO BACIRO_FHIR.ENDPOINT(ENDPOINT_ID, PRACTITIONER_ROLE_ID) SELECT ENDPOINT_ID, '" + practitioner_role_id + "' FROM BACIRO_FHIR.ENDPOINT WHERE ENDPOINT_ID = '" + endpoint_id + "'";
        db.upsert(query2,function(dataJson){
					var query3 = "UPSERT INTO BACIRO_FHIR.HEALTHCARE_SERVICE(HEALTHCARE_SERVICE_ID, PRACTITIONER_ROLE_ID) SELECT HEALTHCARE_SERVICE_ID, '" + practitioner_role_id + "' FROM BACIRO_FHIR.HEALTHCARE_SERVICE WHERE HEALTHCARE_SERVICE_ID = '" + healthcare_service_id + "'";
        	db.upsert(query3,function(dataJson){
						var query4 = "UPSERT INTO BACIRO_FHIR.LOCATION(LOCATION_ID, PRACTITIONER_ROLE_ID) SELECT LOCATION_ID, '" + practitioner_role_id + "' FROM BACIRO_FHIR.LOCATION WHERE LOCATION_ID = '" + location_id + "'";
        		db.upsert(query4,function(dataJson){
				
							var query5 = "SELECT practitioner_id, practitioner_role_active, practitioner_role_code, practitioner_role_specialty, practitioner_role_availability_exceptions, practitioner_role_period_start, practitioner_role_period_end, practitioner_id, organization_id FROM BACIRO_FHIR.PRACTITIONER_ROLE  WHERE practitioner_role_id = '" + practitioner_role_id + "' ";
							db.query(query5,function(dataJson){
								rez = lowercaseObject(dataJson);
								res.json({"err_code":0,"data":rez});
							},function(e){
								res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRole"});
							});							
						},function(e){
							res.json({"err_code": 4, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleLocationReference"});
						});		
					},function(e){
						res.json({"err_code": 3, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleHealthcareServiceReference"});
					});	
				},function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleEndpointRefence"});
        });				
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRole"});
      });
    },
		endpoint: function addEndpoint(req, res){
			var endpoint_id = req.body.id;
			var practitioner_role_id = req.body.practitionerRoleid;
			var healthcare_service_id = req.body.healthcareServiceId;
			
			var column = "";
      var values = "";
			
			if(typeof practitioner_role_id !== 'undefined'){
        column += 'practitioner_role_id,';
        values += "'" + practitioner_role_id +"',";
      }
			
			if(typeof healthcare_service_id !== 'undefined'){
        column += 'healthcare_service_id,';
        values += "'" + healthcare_service_id +"',";
      }
						
      var query = "UPSERT INTO BACIRO_FHIR.ENDPOINT(endpoint_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+endpoint_id+"', " + values.slice(0, -1) + ")";
			//console.log(query);
      db.upsert(query,function(succes){
        var query = "SELECT endpoint_id, practitioner_role_id FROM BACIRO_FHIR.ENDPOINT  WHERE endpoint_id = '" + endpoint_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleEnpoint"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleEnpoint"});
      });
    },
		location: function addLocation(req, res){
			var location_id = req.body.id;
			var practitioner_role_id = req.body.practitionerRoleid;
			var healthcare_service_id = req.body.healthcareServiceId;
			
			var column = "";
      var values = "";
			
			if(typeof practitioner_role_id !== 'undefined'){
        column += 'practitioner_role_id,';
        values += "'" + practitioner_role_id +"',";
      }
			
			if(typeof healthcare_service_id !== 'undefined'){
        column += 'healthcare_service_id,';
        values += "'" + healthcare_service_id +"',";
      }
						
      var query = "UPSERT INTO BACIRO_FHIR.location(location_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+location_id+"', " + values.slice(0, -1) + ")";
			//console.log(query);
      db.upsert(query,function(succes){
        var query = "SELECT location_id, practitioner_role_id FROM BACIRO_FHIR.location  WHERE location_id = '" + location_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleLocation"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleLocation"});
      });
    },
		healthcareService: function addHealthcareService(req, res){
			var healthcare_service_id = req.body.id;
			var practitioner_role_id = req.body.practitionerRoleid;
			
			var column = "";
      var values = "";
			
			if(typeof practitioner_role_id !== 'undefined'){
        column += 'practitioner_role_id,';
        values += "'" + practitioner_role_id +"',";
      }
						
      var query = "UPSERT INTO BACIRO_FHIR.healthcare_service(healthcare_service_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+healthcare_service_id+"', " + values.slice(0, -1) + ")";
			//console.log(query);
      db.upsert(query,function(succes){
        var query = "SELECT healthcare_service_id, practitioner_role_id FROM BACIRO_FHIR.healthcare_service  WHERE healthcare_service_id = '" + healthcare_service_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleHealthcareService"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleHealthcareService"});
      });
    }
		/*,
		availableTime: function addAvailableTime(req, res){
			//console.log(req);
			
			var practitioner_role_id = req.body.practitionerRoleid;
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
			
			if(typeof practitioner_role_id !== 'undefined'){
        column += 'practitioner_role_id,';
        values += "'" + practitioner_role_id +"',";
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
        var query = "SELECT available_time_id, available_time_day_of_week, available_time_all_day, available_time_start, available_time_end, practitioner_role_id FROM BACIRO_FHIR.AVAILABLE_TIME  WHERE practitioner_role_id = '" + practitioner_role_id + "' ";
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
			var practitioner_role_id = req.body.practitionerRoleid;
			var not_available_id = req.body.id;
			var not_available_description = req.body.description;
			var not_available_during = req.body.during;
			
			var column = "";
      var values = "";
			
			if(typeof not_available_description !== 'undefined'){
        column += 'not_available_description,';
        values += "'" + not_available_description +"',";
      }
			
			if(typeof practitioner_role_id !== 'undefined'){
        column += 'practitioner_role_id,';
        values += "'" + practitioner_role_id +"',";
      }
			
			if(typeof not_available_during !== 'undefined'){
        column += 'not_available_during,';
        values += "to_date('"+ not_available_during + "', 'yyyy-MM-dd'),";
      }

      var query = "UPSERT INTO BACIRO_FHIR.NOT_AVAILABLE(not_available_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+not_available_id+"', " + values.slice(0, -1) + ")";
			console.log(query);
      db.upsert(query,function(succes){
        var query = "SELECT not_available_id, not_available_description, not_available_during, not_available_during FROM BACIRO_FHIR.NOT_AVAILABLE  WHERE practitioner_role_id = '" + practitioner_role_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addNotAvailable"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addNotAvailable"});
      });
    }*/
	},
	put:{
		practitionerRole: function addPractitionerRole(req, res){
			//console.log(req.body);
			var practitioner_role_id = req.params.practitioner_role_id;
			var practitioner_role_active = req.body.active;
			var practitioner_role_period_start = req.body.period_start;
			var practitioner_role_period_end = req.body.period_end;
			var practitioner_role_code = req.body.code;
			var practitioner_role_specialty = req.body.specialty;
			var practitioner_role_availability_exceptions = req.body.availabilityExceptions;
			var practitioner_id = req.body.practitioner;
			var organization_id = req.body.organization;
			var location_id = req.body.location;
			var healthcare_service_id = req.body.healthcareService;
			var endpoint_id = req.body.endpoint;
			
			var column = "";
      var values = "";
			
			if(typeof practitioner_role_active !== 'undefined'){
        column += 'practitioner_role_active,';
        values += " " + practitioner_role_active +",";
      }
			
			if(typeof practitioner_role_code !== 'undefined'){
        column += 'practitioner_role_code,';
        values += "'" + practitioner_role_code +"',";
      }
			
			if(typeof practitioner_role_specialty !== 'undefined'){
        column += 'practitioner_role_specialty,';
        values += "'" + practitioner_role_specialty +"',";
      }
			
			if(typeof practitioner_role_availability_exceptions !== 'undefined'){
        column += 'practitioner_role_availability_exceptions,';
        values += "'" + practitioner_role_availability_exceptions +"',";
      }
			
			if(typeof practitioner_role_period_start !== 'undefined'){
        column += 'practitioner_role_period_start,';
        values += "to_date('"+ practitioner_role_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if(typeof practitioner_role_period_end !== 'undefined'){
        column += 'practitioner_role_period_end,';
        values += "to_date('"+ practitioner_role_period_end + "', 'yyyy-MM-dd'),";
      }			
			
			if(typeof practitioner_id !== 'undefined'){
        column += 'practitioner_id,';
        values += "'" + practitioner_id +"',";
      }
			
			if(typeof organization_id !== 'undefined'){
        column += 'organization_id,';
        values += "'" + organization_id +"',";
      }
			
			/*if(typeof location_id !== 'undefined'){
        column += 'location_id,';
        values += "'" + location_id +"',";
      }
			
			if(typeof healthcare_service_id !== 'undefined'){
        column += 'healthcare_service_id,';
        values += "'" + healthcare_service_id +"',";
      }
			
			if(typeof endpoint_id !== 'undefined'){
        column += 'endpoint_id,';
        values += "'" + endpoint_id +"',";
      }*/
			
			var condition = "practitioner_role_id = '" + practitioner_role_id + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.PRACTITIONER_ROLE(practitioner_role_id," + column.slice(0, -1) + ") SELECT practitioner_role_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PRACTITIONER_ROLE WHERE " + condition;
			//console.log(query);
			
      db.upsert(query,function(succes){
				var query5 = "SELECT practitioner_id, practitioner_role_active, practitioner_role_code, practitioner_role_specialty, practitioner_role_availability_exceptions, practitioner_role_period_start, practitioner_role_period_end, practitioner_id, organization_id FROM BACIRO_FHIR.PRACTITIONER_ROLE  WHERE practitioner_role_id = '" + practitioner_role_id + "' ";
				db.query(query5,function(dataJson){
					rez = lowercaseObject(dataJson);
					res.json({"err_code":0,"data":rez});
				},function(e){
					res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRole"});
				});	
				/*var query2 = "UPSERT INTO BACIRO_FHIR.ENDPOINT(ENDPOINT_ID, PRACTITIONER_ROLE_ID) SELECT ENDPOINT_ID, '" + practitioner_role_id + "' FROM BACIRO_FHIR.ENDPOINT WHERE ENDPOINT_ID = '" + endpoint_id + "'";
        db.upsert(query2,function(dataJson){
					var query3 = "UPSERT INTO BACIRO_FHIR.HEALTHCARE_SERVICE(HEALTHCARE_SERVICE_ID, PRACTITIONER_ROLE_ID) SELECT HEALTHCARE_SERVICE_ID, '" + practitioner_role_id + "' FROM BACIRO_FHIR.HEALTHCARE_SERVICE WHERE HEALTHCARE_SERVICE_ID = '" + healthcare_service_id + "'";
        	db.upsert(query3,function(dataJson){
						var query4 = "UPSERT INTO BACIRO_FHIR.LOCATION(LOCATION_ID, PRACTITIONER_ROLE_ID) SELECT LOCATION_ID, '" + practitioner_role_id + "' FROM BACIRO_FHIR.LOCATION WHERE LOCATION_ID = '" + location_id + "'";
        		db.upsert(query4,function(dataJson){
				
							var query5 = "SELECT practitioner_id, practitioner_role_active, practitioner_role_code, practitioner_role_specialty, practitioner_role_availability_exceptions, practitioner_role_period_start, practitioner_role_period_end, practitioner_id, organization_id FROM BACIRO_FHIR.PRACTITIONER_ROLE  WHERE practitioner_role_id = '" + practitioner_role_id + "' ";
							db.query(query5,function(dataJson){
								rez = lowercaseObject(dataJson);
								res.json({"err_code":0,"data":rez});
							},function(e){
								res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRole"});
							});							
						},function(e){
							res.json({"err_code": 4, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleLocationReference"});
						});		
					},function(e){
						res.json({"err_code": 3, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleHealthcareServiceReference"});
					});	
				},function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerRoleEndpointRefence"});
        });	*/			
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePractitionerRole"});
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