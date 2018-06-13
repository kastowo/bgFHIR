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
    appointmentResponse: function getAppointmentResponse(req, res){
      var apikey = req.params.apikey;
      
      var appointmentResponseId = req.query._id;
      var appointmentResponseActor = req.query.actor;
      var appointmentId = req.query.appointment_id;
      var appointmentResponseActorLocation = req.query.location;
      var appointmentResponseActorPatient = req.query.patient;
      var appointmentResponseActorPractitioner = req.query.practitioner;
      var appointmentResponseParticipantStatus = req.query.part_status;
      
      //susun query
      var condition = "";
      var join = "";

      if(typeof appointmentResponseId !== 'undefined' && appointmentResponseId !== ""){
        condition += "appointment_response_id = '" + appointmentResponseId + "' AND ";  
      }

      if(typeof appointmentResponseActor !== 'undefined' && appointmentResponseActor !== ""){
        condition += "(appointment_response_actor_patient_id = '" + appointmentResponseActor + "' OR appointment_response_actor_practitioner_id = '" + appointmentResponseActor + "' OR appointment_response_actor_related_person_id = '" + appointmentResponseActor + "' OR appointment_response_actor_device_id = '" + appointmentResponseActor + "' OR appointment_response_actor_healthcare_service_id = '" + appointmentResponseActor + "' OR appointment_response_actor_location_id = '" + appointmentResponseActor + "' OR ) AND ";  
      }

      if(typeof appointmentId !== 'undefined' && appointmentId !== ""){
        condition += "appointment_id = '" + appointmentId + "' AND ";  
      }

      if(typeof appointmentResponseActorLocation !== 'undefined' && appointmentResponseActorLocation !== ""){
        condition += "appointment_response_actor_location_id = '" + appointmentResponseActorLocation + "' AND ";  
      }

      if(typeof appointmentResponseActorPatient !== 'undefined' && appointmentResponseActorPatient !== ""){
        condition += "appointment_response_actor_patient_id = '" + appointmentResponseActorPatient + "' AND ";  
      }

      if(typeof appointmentResponseActorPractitioner !== 'undefined' && appointmentResponseActorPractitioner !== ""){
        condition += "appointment_response_actor_practitioner_id = '" + appointmentResponseActorPractitioner + "' AND ";  
      }

      if(typeof appointmentResponseParticipantStatus !== 'undefined' && appointmentResponseParticipantStatus !== ""){
        condition += "appointment_response_participant_status = '" + appointmentResponseParticipantStatus + "' AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
      
      var arrAppointmentResponse = [];
      var query = "SELECT appointment_response_id, appointment_response_start, appointment_response_end, appointment_response_participant_type, appointment_response_actor_patient_id, appointment_response_actor_practitioner_id, appointment_response_actor_related_person_id, appointment_response_actor_device_id, appointment_response_actor_healthcare_service_id, appointment_response_actor_location_id, appointment_response_participant_status, appointment_response_comment, appointment_id FROM BACIRO_FHIR.APPOINTMENT_RESPONSE " + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var AppointmentResponse = {};
          AppointmentResponse.resourceType = "AppointmentResponse";
          AppointmentResponse.id = rez[i].appointment_response_id;
          AppointmentResponse.appointment = hostFHIR + ':' + portFHIR + '/' + apikey + '/Appointment?_id=' + rez[i].appointment_id;
          AppointmentResponse.start = rez[i].appointment_response_start;
          AppointmentResponse.end = rez[i].appointment_response_end;
          AppointmentResponse.participantType = rez[i].appointment_response_participant_type;
          
          if(rez[i].appointment_response_actor_patient_id !== 'null'){
            AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' + rez[i].appointment_response_actor_patient_id;  
          }else if(rez[i].appointment_response_actor_practitioner_id !== 'null'){
            AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' + rez[i].appointment_response_actor_practitioner_id;  
          }else if(rez[i].appointment_response_actor_related_person_id !== 'null'){
            AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' + rez[i].appointment_response_actor_related_person_id;  
          }else if(rez[i].appointment_response_actor_device_id !== 'null'){
            AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' + rez[i].appointment_response_actor_device_id;  
          }else if(rez[i].appointment_response_actor_healthcare_service_id !== 'null'){
            AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/HealthcareService?_id=' + rez[i].appointment_response_actor_healthcare_service_id;  
          }else if(rez[i].appointment_response_actor_location_id !== 'null'){
            AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' + rez[i].appointment_response_actor_location_id;  
          }else{
            AppointmentResponse.actor = "";
          }

          AppointmentResponse.participantStatus = rez[i].appointment_response_participant_status;
          AppointmentResponse.comment = rez[i].appointment_response_comment;
         
          arrAppointmentResponse[i] = AppointmentResponse;
        }
        res.json({"err_code":0,"data":arrAppointmentResponse});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getAppointmentResponse"});
      });
    }
  },
  post: {
    appointmentResponse: function addAppointmentResponse(req, res){
      var apikey = req.params.apikey;

      var appointment_response_id = req.body.id;
      var appointment_id = req.body.appointment_id;
      var appointment_response_start = req.body.start;
      var appointment_response_end = req.body.end;
      var appointment_response_participant_type = req.body.participant_type;
      var appointment_response_actor_patient_id = req.body.actor_patient_id;
      var appointment_response_actor_practitioner_id = req.body.actor_practitioner_id;
      var appointment_response_actor_related_person_id = req.body.actor_related_person_id;
      var appointment_response_actor_device_id = req.body.actor_device_id;
      var appointment_response_actor_healthcare_service_id = req.body.actor_healthcare_service_id;
      var appointment_response_actor_location_id = req.body.actor_location_id;
      var appointment_response_participant_status = req.body.participant_status;
      var appointment_response_comment = req.body.comment;
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof appointment_response_id !== 'undefined' && appointment_response_id !== ""){
        column += 'appointment_response_id,';
        values += "'" + appointment_response_id +"',";
      }

      if(typeof appointment_id !== 'undefined' && appointment_id !== ""){
        column += 'appointment_id,';
        values += "'"+ appointment_id +"',";
      }

      if(typeof appointment_response_start !== 'undefined' && appointment_response_start !== ""){
        column += 'appointment_response_start,';
        values += "to_date('" + appointment_response_start +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof appointment_response_end !== 'undefined' && appointment_response_end !== ""){
        column += 'appointment_response_end,';
        values += "to_date('" + appointment_response_end +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof appointment_response_participant_type !== 'undefined' && appointment_response_participant_type !== ""){
        column += 'appointment_response_participant_type,';
        values += "'" + appointment_response_participant_type +"',";
      }

      if(typeof appointment_response_actor_patient_id !== 'undefined' && appointment_response_actor_patient_id !== ""){
        column += 'appointment_response_actor_patient_id,';
        values += "'" + appointment_response_actor_patient_id +"',";
      }

      if(typeof appointment_response_actor_practitioner_id !== 'undefined' && appointment_response_actor_practitioner_id !== ""){
        column += 'appointment_response_actor_practitioner_id,';
        values += "'" + appointment_response_actor_practitioner_id +"',";
      }

      if(typeof appointment_response_actor_related_person_id !== 'undefined' && appointment_response_actor_related_person_id !== ""){
        column += 'appointment_response_actor_related_person_id,';
        values += "'" + appointment_response_actor_related_person_id +"',";
      }

      if(typeof appointment_response_actor_device_id !== 'undefined' && appointment_response_actor_device_id !== ""){
        column += 'appointment_response_actor_device_id,';
        values += "'" + appointment_response_actor_device_id +"',";
      }

      if(typeof appointment_response_actor_healthcare_service_id !== 'undefined' && appointment_response_actor_healthcare_service_id !== ""){
        column += 'appointment_response_actor_healthcare_service_id,';
        values += "'" + appointment_response_actor_healthcare_service_id +"',";
      }

      if(typeof appointment_response_actor_location_id !== 'undefined' && appointment_response_actor_location_id !== ""){
        column += 'appointment_response_actor_location_id,';
        values += "'" + appointment_response_actor_location_id +"',";
      }

      if(typeof appointment_response_participant_status !== 'undefined' && appointment_response_participant_status !== ""){
        column += 'appointment_response_participant_status,';
        values += "'" + appointment_response_participant_status +"',";
      }

      if(typeof appointment_response_comment !== 'undefined' && appointment_response_comment !== ""){
        column += 'appointment_response_comment,';
        values += "'" + appointment_response_comment +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.APPOINTMENT_RESPONSE(" + column.slice(0, -1) + ")"+
        " VALUES ("+ values.slice(0, -1) +")";
      
      db.upsert(query,function(succes){
        var arrAppointmentResponse = [];
        var query = "SELECT appointment_response_id, appointment_response_start, appointment_response_end, appointment_response_participant_type, appointment_response_actor_patient_id, appointment_response_actor_practitioner_id, appointment_response_actor_related_person_id, appointment_response_actor_device_id, appointment_response_actor_healthcare_service_id, appointment_response_actor_location_id, appointment_response_participant_status, appointment_response_comment, appointment_id FROM BACIRO_FHIR.APPOINTMENT_RESPONSE WHERE appointment_response_id = '" + appointment_response_id + "'";

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var AppointmentResponse = {};
            AppointmentResponse.resourceType = "AppointmentResponse";
            AppointmentResponse.id = rez[i].appointment_response_id;
            AppointmentResponse.appointment = hostFHIR + ':' + portFHIR + '/' + apikey + '/Appointment?_id=' + rez[i].appointment_id;
            AppointmentResponse.start = rez[i].appointment_response_start;
            AppointmentResponse.end = rez[i].appointment_response_end;
            AppointmentResponse.participantType = rez[i].appointment_response_participant_type;
            
            if(rez[i].appointment_response_actor_patient_id !== 'null'){
              AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' + rez[i].appointment_response_actor_patient_id;  
            }else if(rez[i].appointment_response_actor_practitioner_id !== 'null'){
              AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' + rez[i].appointment_response_actor_practitioner_id;  
            }else if(rez[i].appointment_response_actor_related_person_id !== 'null'){
              AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' + rez[i].appointment_response_actor_related_person_id;  
            }else if(rez[i].appointment_response_actor_device_id !== 'null'){
              AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' + rez[i].appointment_response_actor_device_id;  
            }else if(rez[i].appointment_response_actor_healthcare_service_id !== 'null'){
              AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/HealthcareService?_id=' + rez[i].appointment_response_actor_healthcare_service_id;  
            }else if(rez[i].appointment_response_actor_location_id !== 'null'){
              AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' + rez[i].appointment_response_actor_location_id;  
            }else{
              AppointmentResponse.actor = "";
            }

            AppointmentResponse.participantStatus = rez[i].appointment_response_participant_status;
            AppointmentResponse.comment = rez[i].appointment_response_comment;
           
            arrAppointmentResponse[i] = AppointmentResponse;
          }
          res.json({"err_code":0,"data":arrAppointmentResponse});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getAppointmentResponse"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAppointmentResponse"});
      });
    }
  },
  put: {
    appointmentResponse: function updateAppointmentResponse(req, res){
      var apikey = req.params.apikey;
      var appointment_response_id = req.params.appointment_response_id;

      var appointment_id = req.body.appointment_id;
      var appointment_response_start = req.body.start;
      var appointment_response_end = req.body.end;
      var appointment_response_participant_type = req.body.participant_type;
      var appointment_response_actor_patient_id = req.body.actor_patient_id;
      var appointment_response_actor_practitioner_id = req.body.actor_practitioner_id;
      var appointment_response_actor_related_person_id = req.body.actor_related_person_id;
      var appointment_response_actor_device_id = req.body.actor_device_id;
      var appointment_response_actor_healthcare_service_id = req.body.actor_healthcare_service_id;
      var appointment_response_actor_location_id = req.body.actor_location_id;
      var appointment_response_participant_status = req.body.participant_status;
      var appointment_response_comment = req.body.comment;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof appointment_id !== 'undefined' && appointment_id !== ""){
        column += 'appointment_id,';
        values += "'"+ appointment_id +"',";
      }

      if(typeof appointment_response_start !== 'undefined' && appointment_response_start !== ""){
        column += 'appointment_response_start,';
        values += "to_date('" + appointment_response_start +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof appointment_response_end !== 'undefined' && appointment_response_end !== ""){
        column += 'appointment_response_end,';
        values += "to_date('" + appointment_response_end +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof appointment_response_participant_type !== 'undefined' && appointment_response_participant_type !== ""){
        column += 'appointment_response_participant_type,';
        values += "'" + appointment_response_participant_type +"',";
      }

      if(typeof appointment_response_actor_patient_id !== 'undefined' && appointment_response_actor_patient_id !== ""){
        column += 'appointment_response_actor_patient_id,';
        values += "'" + appointment_response_actor_patient_id +"',";

        //kosongkan yang lainnya
        column += 'appointment_response_actor_practitioner_id,';
        values += "null,";

        column += 'appointment_response_actor_related_person_id,';
        values += "null,";

        column += 'appointment_response_actor_device_id,';
        values += "null,";

        column += 'appointment_response_actor_healthcare_service_id,';
        values += "null,";

        column += 'appointment_response_actor_location_id,';
        values += "null,";
      }else if(typeof appointment_response_actor_practitioner_id !== 'undefined' && appointment_response_actor_practitioner_id !== ""){
        column += 'appointment_response_actor_practitioner_id,';
        values += "'" + appointment_response_actor_practitioner_id +"',";

        //kosongkan yang lainnya
        column += 'appointment_response_actor_patient_id,';
        values += "null,";

        column += 'appointment_response_actor_related_person_id,';
        values += "null,";

        column += 'appointment_response_actor_device_id,';
        values += "null,";

        column += 'appointment_response_actor_healthcare_service_id,';
        values += "null,";

        column += 'appointment_response_actor_location_id,';
        values += "null,";
      }else if(typeof appointment_response_actor_related_person_id !== 'undefined' && appointment_response_actor_related_person_id !== ""){
        column += 'appointment_response_actor_related_person_id,';
        values += "'" + appointment_response_actor_related_person_id +"',";

        //kosongkan yang lainnya
        column += 'appointment_response_actor_patient_id,';
        values += "null,";

        column += 'appointment_response_actor_practitioner_id,';
        values += "null,";

        column += 'appointment_response_actor_device_id,';
        values += "null,";

        column += 'appointment_response_actor_healthcare_service_id,';
        values += "null,";

        column += 'appointment_response_actor_location_id,';
        values += "null,";
      }else if(typeof appointment_response_actor_device_id !== 'undefined' && appointment_response_actor_device_id !== ""){
        column += 'appointment_response_actor_device_id,';
        values += "'" + appointment_response_actor_device_id +"',";

        //kosongkan yang lainnya
        column += 'appointment_response_actor_patient_id,';
        values += "null,";

        column += 'appointment_response_actor_practitioner_id,';
        values += "null,";

        column += 'appointment_response_actor_related_person_id,';
        values += "null,";

        column += 'appointment_response_actor_healthcare_service_id,';
        values += "null,";

        column += 'appointment_response_actor_location_id,';
        values += "null,";
      }else if(typeof appointment_response_actor_healthcare_service_id !== 'undefined' && appointment_response_actor_healthcare_service_id !== ""){
        column += 'appointment_response_actor_healthcare_service_id,';
        values += "'" + appointment_response_actor_healthcare_service_id +"',";

         //kosongkan yang lainnya
        column += 'appointment_response_actor_patient_id,';
        values += "null,";

        column += 'appointment_response_actor_practitioner_id,';
        values += "null,";

        column += 'appointment_response_actor_related_person_id,';
        values += "null,";

        column += 'appointment_response_actor_device_id,';
        values += "null,";

        column += 'appointment_response_actor_location_id,';
        values += "null,";
      }else if(typeof appointment_response_actor_location_id !== 'undefined' && appointment_response_actor_location_id !== ""){
        column += 'appointment_response_actor_location_id,';
        values += "'" + appointment_response_actor_location_id +"',";

        //kosongkan yang lainnya
        column += 'appointment_response_actor_patient_id,';
        values += "null,";

        column += 'appointment_response_actor_practitioner_id,';
        values += "null,";

        column += 'appointment_response_actor_related_person_id,';
        values += "null,";

        column += 'appointment_response_actor_device_id,';
        values += "null,";

        column += 'appointment_response_actor_healthcare_service_id,';
        values += "null,";
      }

      if(typeof appointment_response_comment !== 'undefined' && appointment_response_comment !== ""){
        column += 'appointment_response_comment,';
        values += "'" + appointment_response_comment +"',";
      }

      var condition = "appointment_response_id = '" + appointment_response_id + "'";

      var query = "UPSERT INTO BACIRO_FHIR.APPOINTMENT_RESPONSE(appointment_response_id," + column.slice(0, -1) + ") SELECT appointment_response_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.APPOINTMENT_RESPONSE WHERE " + condition;
      
      db.upsert(query,function(succes){
        var arrAppointmentResponse = [];
        var query = "SELECT appointment_response_id, appointment_response_start, appointment_response_end, appointment_response_participant_type, appointment_response_actor_patient_id, appointment_response_actor_practitioner_id, appointment_response_actor_related_person_id, appointment_response_actor_device_id, appointment_response_actor_healthcare_service_id, appointment_response_actor_location_id, appointment_response_participant_status, appointment_response_comment, appointment_id FROM BACIRO_FHIR.APPOINTMENT_RESPONSE WHERE " + condition;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var AppointmentResponse = {};
            AppointmentResponse.resourceType = "AppointmentResponse";
            AppointmentResponse.id = rez[i].appointment_response_id;
            AppointmentResponse.appointment = hostFHIR + ':' + portFHIR + '/' + apikey + '/Appointment?_id=' + rez[i].appointment_id;
            AppointmentResponse.start = rez[i].appointment_response_start;
            AppointmentResponse.end = rez[i].appointment_response_end;
            AppointmentResponse.participantType = rez[i].appointment_response_participant_type;
            
            if(rez[i].appointment_response_actor_patient_id !== 'null'){
              AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' + rez[i].appointment_response_actor_patient_id;  
            }else if(rez[i].appointment_response_actor_practitioner_id !== 'null'){
              AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' + rez[i].appointment_response_actor_practitioner_id;  
            }else if(rez[i].appointment_response_actor_related_person_id !== 'null'){
              AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' + rez[i].appointment_response_actor_related_person_id;  
            }else if(rez[i].appointment_response_actor_device_id !== 'null'){
              AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' + rez[i].appointment_response_actor_device_id;  
            }else if(rez[i].appointment_response_actor_healthcare_service_id !== 'null'){
              AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/HealthcareService?_id=' + rez[i].appointment_response_actor_healthcare_service_id;  
            }else if(rez[i].appointment_response_actor_location_id !== 'null'){
              AppointmentResponse.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' + rez[i].appointment_response_actor_location_id;  
            }else{
              AppointmentResponse.actor = "";
            }

            AppointmentResponse.participantStatus = rez[i].appointment_response_participant_status;
            AppointmentResponse.comment = rez[i].appointment_response_comment;
           
            arrAppointmentResponse[i] = AppointmentResponse;
          }
          res.json({"err_code":0,"data":arrAppointmentResponse});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAppointmentResponse"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAppointmentResponse"});
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