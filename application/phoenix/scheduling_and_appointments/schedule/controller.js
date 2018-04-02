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

// var phoenix = require("./phoenix.js");
var phoenix = require(path.resolve("./phoenix.js"));
var db = new phoenix("jdbc:phoenix:" + host + ":/hbase-unsecure");

var controller = {
	get: {
    schedule: function getSchedule(req, res){
      var apikey = req.params.apikey;
      
      var scheduleId = req.query._id;
      var scheduleActive = req.query.active;
      var scheduleActor = req.query.actor;
      var scheduleDate = req.query.date;
      var scheduleType = req.query.type;
      

      //susun query
      var condition = "";
      var join = "";

      if(typeof scheduleId !== 'undefined' && scheduleId !== ""){
        condition += "schedule_id = '" + scheduleId + "' AND ";  
      }

      // if(typeof scheduleDate !== 'undefined' && scheduleDate !== ""){
      //   condition += "person_birthdate = to_date('" + personBirthdate + "', 'yyyy-MM-dd') AND ";  
      // }

      if(typeof scheduleActive !== 'undefined' && scheduleActive !== ""){
        condition += "schedule_active = " + scheduleActive + " AND ";  
      }

      if(typeof scheduleType !== 'undefined' && scheduleType !== ""){
        condition += "schedule_service_type = '" + scheduleType + "' AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
      
      var arrSchedule = [];
      var query = "SELECT schedule_id, schedule_active, schedule_service_category, schedule_service_type, schedule_specialty, schedule_actor_patient_id, schedule_actor_practitioner_id, schedule_actor_practitioner_role_id, schedule_actor_related_person_id, schedule_actor_device_id, schedule_actor_healthcare_service_id, schedule_actor_location_id, schedule_period_start, schedule_period_end, schedule_comment FROM BACIRO_FHIR.SCHEDULE " + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Schedule = {resourceType: "", id: "", active: "", serviceCategory: "", serviceType: "", specialty: "", period: "",  actor: [], comment: ""};
          Schedule.resourceType = "Schedule";
          Schedule.id = rez[i].schedule_id;
          Schedule.active = rez[i].schedule_active;
          Schedule.serviceCategory = rez[i].schedule_service_category;
          Schedule.serviceType = rez[i].schedule_service_type;
          Schedule.specialty = rez[i].schedule_specialty;

          if(rez[i].schedule_actor_patient_id !== 'null'){
            Schedule.actor.push(hostFHIR + ':' + portFHIR + '/Patient?_id=' + rez[i].schedule_actor_patient_id);  
          }

          if(rez[i].schedule_actor_practitioner_id !== 'null'){
            Schedule.actor.push(hostFHIR + ':' + portFHIR + '/Practitioner?_id=' + rez[i].schedule_actor_practitioner_id);  
          }
          
          if(rez[i].schedule_actor_practitioner_role_id !== 'null'){
            Schedule.actor.push(hostFHIR + ':' + portFHIR + '/PractitionerRole?_id=' + rez[i].schedule_actor_practitioner_role_id);  
          }
          
          if(rez[i].schedule_actor_related_person_id !== 'null'){
            Schedule.actor.push(hostFHIR + ':' + portFHIR + '/RelatedPerson?_id=' + rez[i].schedule_actor_related_person_id);  
          }

          if(rez[i].schedule_actor_device_id !== 'null'){
            Schedule.actor.push(hostFHIR + ':' + portFHIR + '/Device?_id=' + rez[i].schedule_actor_device_id);  
          }
         
          if(rez[i].schedule_actor_healthcare_service_id !== 'null'){
            Schedule.actor.push(hostFHIR + ':' + portFHIR + '/HealthcareService?_id=' + rez[i].schedule_actor_healthcare_service_id);  
          }
          
          if(rez[i].schedule_actor_location_id !== 'null'){
            Schedule.actor.push(hostFHIR + ':' + portFHIR + '/Location?_id=' + rez[i].schedule_actor_location_id);  
          }
          
          Schedule.period = rez[i].schedule_period_start + ' to ' + rez[i].schedule_period_end;  
          Schedule.comment = rez[i].schedule_comment;  
         
          arrSchedule[i] = Schedule;
        }
        res.json({"err_code":0,"data":arrSchedule});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getSchedule"});
      });
    }
  },
  post: {
    schedule: function addSchedule(req, res){
      var schedule_id = req.body.id;
      var schedule_active = req.body.active;
      var schedule_service_category = req.body.service_category;
      var schedule_service_type = req.body.service_type;
      var schedule_specialty = req.body.specialty;
      var schedule_actor_patient_id = req.body.actor_patient_id;
      var schedule_actor_practitioner_id = req.body.actor_practitioner_id;
      var schedule_actor_practitioner_role_id = req.body.actor_practitioner_role_id;
      var schedule_actor_related_person_id = req.body.actor_related_person_id;
      var schedule_actor_device_id = req.body.actor_device_id;
      var schedule_actor_healthcare_service_id = req.body.actor_healthcare_service_id;
      var schedule_actor_location_id = req.body.actor_location_id;
      var schedule_period_start = req.body.period_start;
      var schedule_period_end = req.body.period_end;
      var schedule_comment = req.body.comment;
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof schedule_id !== 'undefined' && schedule_id !== ""){
        column += 'schedule_id,';
        values += "'" + schedule_id +"',";
      }

      if(typeof schedule_active !== 'undefined' && schedule_active !== ""){
        column += 'schedule_active,';
        values += schedule_active +",";
      }

      if(typeof schedule_service_category !== 'undefined' && schedule_service_category !== ""){
        column += 'schedule_service_category,';
        values += "'" + schedule_service_category +"',";
      }

      if(typeof schedule_service_type !== 'undefined' && schedule_service_type !== ""){
        column += 'schedule_service_type,';
        values += "'" + schedule_service_type +"',";
      }

      if(typeof schedule_specialty !== 'undefined' && schedule_specialty !== ""){
        column += 'schedule_specialty,';
        values += "'" + schedule_specialty +"',";
      }

      if(typeof schedule_actor_patient_id !== 'undefined' && schedule_actor_patient_id !== ""){
        column += 'schedule_actor_patient_id,';
        values += "'" + schedule_actor_patient_id +"',";
      }

      if(typeof schedule_actor_practitioner_id !== 'undefined' && schedule_actor_practitioner_id !== ""){
        column += 'schedule_actor_practitioner_id,';
        values += "'" + schedule_actor_practitioner_id +"',";
      }

      if(typeof schedule_actor_practitioner_role_id !== 'undefined' && schedule_actor_practitioner_role_id !== ""){
        column += 'schedule_actor_practitioner_role_id,';
        values += "'" + schedule_actor_practitioner_role_id +"',";
      }

      if(typeof schedule_actor_related_person_id !== 'undefined' && schedule_actor_related_person_id !== ""){
        column += 'schedule_actor_related_person_id,';
        values += "'" + schedule_actor_related_person_id +"',";
      }

      if(typeof schedule_actor_device_id !== 'undefined' && schedule_actor_device_id !== ""){
        column += 'schedule_actor_device_id,';
        values += "'" + schedule_actor_device_id +"',";
      }

      if(typeof schedule_actor_healthcare_service_id !== 'undefined' && schedule_actor_healthcare_service_id !== ""){
        column += 'schedule_actor_healthcare_service_id,';
        values += "'" + schedule_actor_healthcare_service_id +"',";
      }

      if(typeof schedule_actor_location_id !== 'undefined' && schedule_actor_location_id !== ""){
        column += 'schedule_actor_location_id,';
        values += "'" + schedule_actor_location_id +"',";
      }

      if(typeof schedule_period_start !== 'undefined' && schedule_period_start !== ""){
        column += 'schedule_period_start,';
        values += "to_date('" + schedule_period_start +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof schedule_period_end !== 'undefined' && schedule_period_end !== ""){
        column += 'schedule_period_end,';
        values += "to_date('" + schedule_period_end +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof schedule_comment !== 'undefined' && schedule_comment !== ""){
        column += 'schedule_comment,';
        values += "'" + schedule_comment +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SCHEDULE(" + column.slice(0, -1) + ")"+
        " VALUES ("+ values.slice(0, -1) +")";
      
      db.upsert(query,function(succes){
        var arrSchedule = [];
        var query = "SELECT schedule_id, schedule_active, schedule_service_category, schedule_service_type, schedule_specialty, schedule_actor_patient_id, schedule_actor_practitioner_id, schedule_actor_practitioner_role_id, schedule_actor_related_person_id, schedule_actor_device_id, schedule_actor_healthcare_service_id, schedule_actor_location_id, schedule_period_start, schedule_period_end, schedule_comment  FROM BACIRO_FHIR.SCHEDULE WHERE schedule_id = '" + schedule_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var Schedule = {resourceType: "", id: "", active: "", serviceCategory: "", serviceType: "", specialty: "", period: "",  actor: [], comment: ""};
            Schedule.resourceType = "Schedule";
            Schedule.id = rez[i].schedule_id;
            Schedule.active = rez[i].schedule_active;
            Schedule.serviceCategory = rez[i].schedule_service_category;
            Schedule.serviceType = rez[i].schedule_service_type;
            Schedule.specialty = rez[i].schedule_specialty;

            if(rez[i].schedule_actor_patient_id !== 'null'){
              Schedule.actor.push(hostFHIR + ':' + portFHIR + '/Patient?_id=' + rez[i].schedule_actor_patient_id);  
            }

            if(rez[i].schedule_actor_practitioner_id !== 'null'){
              Schedule.actor.push(hostFHIR + ':' + portFHIR + '/Practitioner?_id=' + rez[i].schedule_actor_practitioner_id);  
            }
            
            if(rez[i].schedule_actor_practitioner_role_id !== 'null'){
              Schedule.actor.push(hostFHIR + ':' + portFHIR + '/PractitionerRole?_id=' + rez[i].schedule_actor_practitioner_role_id);  
            }
            
            if(rez[i].schedule_actor_related_person_id !== 'null'){
              Schedule.actor.push(hostFHIR + ':' + portFHIR + '/RelatedPerson?_id=' + rez[i].schedule_actor_related_person_id);  
            }

            if(rez[i].schedule_actor_device_id !== 'null'){
              Schedule.actor.push(hostFHIR + ':' + portFHIR + '/Device?_id=' + rez[i].schedule_actor_device_id);  
            }
           
            if(rez[i].schedule_actor_healthcare_service_id !== 'null'){
              Schedule.actor.push(hostFHIR + ':' + portFHIR + '/HealthcareService?_id=' + rez[i].schedule_actor_healthcare_service_id);  
            }
            
            if(rez[i].schedule_actor_location_id !== 'null'){
              Schedule.actor.push(hostFHIR + ':' + portFHIR + '/Location?_id=' + rez[i].schedule_actor_location_id);  
            }
            
            Schedule.period = rez[i].schedule_period_start + ' to ' + rez[i].schedule_period_end;  
            Schedule.comment = rez[i].schedule_comment;  
           
            arrSchedule[i] = Schedule;
          }
          res.json({"err_code":0,"data":arrSchedule});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSchedule"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSchedule"});
      });
    }
  },
  put: {
    schedule: function updateSchedule(req, res){
      var schedule_id = req.params.schedule_id;
      var schedule_active = req.body.active;
      var schedule_service_category = req.body.service_category;
      var schedule_service_type = req.body.service_type;
      var schedule_specialty = req.body.specialty;
      var schedule_actor_patient_id = req.body.actor_patient_id;
      var schedule_actor_practitioner_id = req.body.actor_practitioner_id;
      var schedule_actor_practitioner_role_id = req.body.actor_practitioner_role_id;
      var schedule_actor_related_person_id = req.body.actor_related_person_id;
      var schedule_actor_device_id = req.body.actor_device_id;
      var schedule_actor_healthcare_service_id = req.body.actor_healthcare_service_id;
      var schedule_actor_location_id = req.body.actor_location_id;
      var schedule_period_start = req.body.period_start;
      var schedule_period_end = req.body.period_end;
      var schedule_comment = req.body.comment;
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof schedule_id !== 'undefined' && schedule_id !== ""){
        column += 'schedule_id,';
        values += "'" + schedule_id +"',";
      }

      if(typeof schedule_active !== 'undefined' && schedule_active !== ""){
        column += 'schedule_active,';
        values += schedule_active +",";
      }

      if(typeof schedule_service_category !== 'undefined' && schedule_service_category !== ""){
        column += 'schedule_service_category,';
        values += "'" + schedule_service_category +"',";
      }

      if(typeof schedule_service_type !== 'undefined' && schedule_service_type !== ""){
        column += 'schedule_service_type,';
        values += "'" + schedule_service_type +"',";
      }

      if(typeof schedule_specialty !== 'undefined' && schedule_specialty !== ""){
        column += 'schedule_specialty,';
        values += "'" + schedule_specialty +"',";
      }

      if(typeof schedule_actor_patient_id !== 'undefined' && schedule_actor_patient_id !== ""){
        column += 'schedule_actor_patient_id,';
        values += "'" + schedule_actor_patient_id +"',";
      }

      if(typeof schedule_actor_practitioner_id !== 'undefined' && schedule_actor_practitioner_id !== ""){
        column += 'schedule_actor_practitioner_id,';
        values += "'" + schedule_actor_practitioner_id +"',";
      }

      if(typeof schedule_actor_practitioner_role_id !== 'undefined' && schedule_actor_practitioner_role_id !== ""){
        column += 'schedule_actor_practitioner_role_id,';
        values += "'" + schedule_actor_practitioner_role_id +"',";
      }

      if(typeof schedule_actor_related_person_id !== 'undefined' && schedule_actor_related_person_id !== ""){
        column += 'schedule_actor_related_person_id,';
        values += "'" + schedule_actor_related_person_id +"',";
      }

      if(typeof schedule_actor_device_id !== 'undefined' && schedule_actor_device_id !== ""){
        column += 'schedule_actor_device_id,';
        values += "'" + schedule_actor_device_id +"',";
      }

      if(typeof schedule_actor_healthcare_service_id !== 'undefined' && schedule_actor_healthcare_service_id !== ""){
        column += 'schedule_actor_healthcare_service_id,';
        values += "'" + schedule_actor_healthcare_service_id +"',";
      }

      if(typeof schedule_actor_location_id !== 'undefined' && schedule_actor_location_id !== ""){
        column += 'schedule_actor_location_id,';
        values += "'" + schedule_actor_location_id +"',";
      }

      if(typeof schedule_period_start !== 'undefined' && schedule_period_start !== ""){
        column += 'schedule_period_start,';
        values += "to_date('" + schedule_period_start +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof schedule_period_end !== 'undefined' && schedule_period_end !== ""){
        column += 'schedule_period_end,';
        values += "to_date('" + schedule_period_end +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof schedule_comment !== 'undefined' && schedule_comment !== ""){
        column += 'schedule_comment,';
        values += "'" + schedule_comment +"',";
      }

      var condition = "schedule_id = '" + schedule_id + "'";

      var query = "UPSERT INTO BACIRO_FHIR.SCHEDULE(schedule_id," + column.slice(0, -1) + ") SELECT schedule_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SCHEDULE WHERE " + condition;
      
      db.upsert(query,function(succes){
        var arrSchedule = [];
        var query = "SELECT schedule_id, schedule_active, schedule_service_category, schedule_service_type, schedule_specialty, schedule_actor_patient_id, schedule_actor_practitioner_id, schedule_actor_practitioner_role_id, schedule_actor_related_person_id, schedule_actor_device_id, schedule_actor_healthcare_service_id, schedule_actor_location_id, schedule_period_start, schedule_period_end, schedule_comment  FROM BACIRO_FHIR.SCHEDULE WHERE schedule_id = '" + schedule_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var Schedule = {resourceType: "", id: "", active: "", serviceCategory: "", serviceType: "", specialty: "", period: "",  actor: [], comment: ""};
            Schedule.resourceType = "Schedule";
            Schedule.id = rez[i].schedule_id;
            Schedule.active = rez[i].schedule_active;
            Schedule.serviceCategory = rez[i].schedule_service_category;
            Schedule.serviceType = rez[i].schedule_service_type;
            Schedule.specialty = rez[i].schedule_specialty;

            if(rez[i].schedule_actor_patient_id !== 'null'){
              Schedule.actor.push(hostFHIR + ':' + portFHIR + '/Patient?_id=' + rez[i].schedule_actor_patient_id);  
            }

            if(rez[i].schedule_actor_practitioner_id !== 'null'){
              Schedule.actor.push(hostFHIR + ':' + portFHIR + '/Practitioner?_id=' + rez[i].schedule_actor_practitioner_id);  
            }
            
            if(rez[i].schedule_actor_practitioner_role_id !== 'null'){
              Schedule.actor.push(hostFHIR + ':' + portFHIR + '/PractitionerRole?_id=' + rez[i].schedule_actor_practitioner_role_id);  
            }
            
            if(rez[i].schedule_actor_related_person_id !== 'null'){
              Schedule.actor.push(hostFHIR + ':' + portFHIR + '/RelatedPerson?_id=' + rez[i].schedule_actor_related_person_id);  
            }

            if(rez[i].schedule_actor_device_id !== 'null'){
              Schedule.actor.push(hostFHIR + ':' + portFHIR + '/Device?_id=' + rez[i].schedule_actor_device_id);  
            }
           
            if(rez[i].schedule_actor_healthcare_service_id !== 'null'){
              Schedule.actor.push(hostFHIR + ':' + portFHIR + '/HealthcareService?_id=' + rez[i].schedule_actor_healthcare_service_id);  
            }
            
            if(rez[i].schedule_actor_location_id !== 'null'){
              Schedule.actor.push(hostFHIR + ':' + portFHIR + '/Location?_id=' + rez[i].schedule_actor_location_id);  
            }
            
            Schedule.period = rez[i].schedule_period_start + ' to ' + rez[i].schedule_period_end;  
            Schedule.comment = rez[i].schedule_comment;  
           
            arrSchedule[i] = Schedule;
          }
          res.json({"err_code":0,"data":arrSchedule});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSchedule"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSchedule"});
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