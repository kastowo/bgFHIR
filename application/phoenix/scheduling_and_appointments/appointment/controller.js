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

<<<<<<< HEAD
// var phoenix = require("./phoenix.js");
var phoenix = require(path.resolve("./phoenix.js"));
var db = new phoenix("jdbc:phoenix:" + host + ":/hbase-unsecure");
=======
var hostHbase = configYaml.hbase.host;

// var phoenix = require("./phoenix.js");
var phoenix = require(path.resolve("./phoenix.js"));
var db = new phoenix("jdbc:phoenix:" + hostHbase + ":/hbase-unsecure");
>>>>>>> hcs

var controller = {
	get: {
    appointment: function getAppointment(req, res){
      var apikey = req.params.apikey;
      
      var appointmentId = req.query._id;
      var appointmentActor = req.query.actor;
      var appointmentType = req.query.appointment_type;
      var appointmentStart = req.query.date;
      var referralRequestId = req.query.referral_request;
      var appointmentActorLocation = req.query.location;
      var appointmentActorPatient = req.query.patient;
      var appointmentActorPractitioner = req.query.practitioner;
      var appointmentParticipantStatus = req.query.participant_status;
      var appointmentServiceType = req.query.service_type;
      var appointmentStatus = req.query.status;

      //susun query
      var condition = "";
      var join = "";

      if(typeof appointmentId !== 'undefined' && appointmentId !== ""){
        condition += "app.appointment_id = '" + appointmentId + "' AND ";  
      }

      if((typeof appointmentActor !== 'undefined' && appointmentActor !== "") || (typeof appointmentActorLocation !== 'undefined' && appointmentActorLocation !== "") || (typeof appointmentActorPatient !== 'undefined' && appointmentActorPatient !== "") || (typeof appointmentActorPractitioner !== 'undefined' && appointmentActorPractitioner !== "") || (typeof appointmentParticipantStatus !== 'undefined' && appointmentParticipantStatus !== "")){
         //set join 
        join = " LEFT JOIN BACIRO_FHIR.APPOINTMENT_PARTICIPANT ap ON ap.appointment_id = app.appointment_id ";

        if(typeof appointmentActor !== 'undefined' && appointmentActor !== ""){
          condition += "(appointment_participant_actor_patient_id = '" + appointmentActor + "' OR appointment_participant_actor_practitioner_id = '" + appointmentActor + "' OR appointment_participant_actor_related_person_id = '" + appointmentActor + "' OR appointment_participant_actor_device_id = '" + appointmentActor + "' OR appointment_participant_actor_healthcare_service_id = '" + appointmentActor + "' OR appointment_participant_actor_location_id = '" + appointmentActor + "' ) AND ";    
        }

        if(typeof appointmentActorLocation !== 'undefined' && appointmentActorLocation !== ""){
          condition += "appointment_participant_actor_location_id = '" + appointmentActorLocation + "' AND ";    
        }

        if(typeof appointmentActorPatient !== 'undefined' && appointmentActorPatient !== ""){
          condition += "appointment_participant_actor_patient_id = '" + appointmentActorPatient + "' AND ";    
        }

        if(typeof appointmentActorPractitioner !== 'undefined' && appointmentActorPractitioner !== ""){
          condition += "appointment_participant_actor_practitioner_id = '" + appointmentActorPractitioner + "' AND ";    
        }

        if(typeof appointmentParticipantStatus !== 'undefined' && appointmentParticipantStatus !== ""){
          condition += "appointment_participant_status = '" + appointmentParticipantStatus + "' AND ";    
        }
      }

      if(typeof appointmentServiceType !== 'undefined' && appointmentServiceType !== ""){
        condition += "appointment_service_type = '" + appointmentServiceType + "' AND ";  
      }

      if(typeof appointmentStatus !== 'undefined' && appointmentStatus !== ""){
        condition += "appointment_status = '" + appointmentStatus + "' AND ";  
      }

      if(typeof referralRequestId !== 'undefined' && referralRequestId !== ""){
        join = " LEFT JOIN BACIRO_FHIR.REFERRAL_REQUEST rr ON rr.appointment_id = app.appointment_id ";
        if(typeof referralRequestId !== 'undefined' && referralRequestId !== ""){
          condition += "ref.referral_request_id = '" + referralRequestId + "' AND ";    
        }
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
      
      var arrAppointment = [];
      var query = "SELECT app.appointment_id as appointment_id, appointment_status, appointment_service_category, appointment_service_type, appointment_specialty, appointment_type, appointment_reason, appointment_priority, appointment_description, appointment_supporting_information, appointment_start, appointment_end, appointment_minutes_duration, appointment_created, appointment_comment, appointment_period_start, appointment_period_end FROM BACIRO_FHIR.APPOINTMENT app " + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Appointment = {};
          Appointment.resourceType = "Appointment";
          Appointment.id = rez[i].appointment_id;
          Appointment.status = rez[i].appointment_status;
          Appointment.serviceCategory = rez[i].appointment_service_category;
          Appointment.serviceType = rez[i].appointment_service_type;
          Appointment.specialty = rez[i].appointment_specialty;
          Appointment.appointmentType = rez[i].appointment_type;
          Appointment.reason = rez[i].appointment_reason;
          Appointment.indication = "Akan di-update saat module (condition dan procedure) dikerjakan";
          Appointment.priority = rez[i].appointment_priority;
          Appointment.description = rez[i].appointment_description;
          Appointment.supportingInformation = "Skip untuk sementara";
          Appointment.start = rez[i].appointment_start;
          Appointment.end = rez[i].appointment_end;
          Appointment.minutesDuration = rez[i].appointment_minutes_duration;
          Appointment.slot = "SLOT DR";
          Appointment.created = rez[i].appointment_created;
          Appointment.comment = rez[i].appointment_comment;
          Appointment.incomingReferral = "Akan di-update saat module (condition dan procedure) dikerjakan";
          Appointment.participant = "Akan di-update saat module (condition dan procedure) dikerjakan";
          Appointment.requestedPeriod = rez[i].appointment_period_start + ' to ' + rez[i].appointment_period_end;  
          
          arrAppointment[i] = Appointment;
        }
        res.json({"err_code":0,"data":arrAppointment});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getAppointment"});
      });
    },
    appointmentParticipant: function getAppointmentParticipant(req, res){
      var apikey = req.params.apikey;
      
      var appointmentParticipantId = req.query._id;
      var appointmentId = req.query.appointment_id;

      //susun query
      var condition = "";
      var join = "";

      if(typeof appointmentParticipantId !== 'undefined' && appointmentParticipantId !== ""){
        condition += "appointment_participant_id = '" + appointmentParticipantId + "' AND ";  
      }

      if(typeof appointmentId !== 'undefined' && appointmentId !== ""){
        condition += "appointment_id = '" + appointmentId + "' AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
      
      var arrAppointmentParticipant = [];
      var query = "SELECT appointment_participant_id, appointment_participant_type, appointment_participant_actor_patient_id, appointment_participant_actor_practitioner_id, appointment_participant_actor_related_person_id, appointment_participant_actor_device_id, appointment_participant_actor_healthcare_service_id, appointment_participant_actor_location_id, appointment_participant_required, appointment_participant_status FROM BACIRO_FHIR.APPOINTMENT_PARTICIPANT " + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var AppointmentParticipant = {};
          AppointmentParticipant.id = rez[i].appointment_participant_id;
          AppointmentParticipant.type = rez[i].appointment_participant_type;

          if(rez[i].appointment_participant_actor_patient_id !== 'null'){
            AppointmentParticipant.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' + rez[i].appointment_participant_actor_patient_id;  
          }else if (rez[i].appointment_participant_actor_practitioner_id !== 'null'){
            AppointmentParticipant.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' + rez[i].appointment_participant_actor_practitioner_id; 
          }else if (rez[i].appointment_participant_actor_related_person_id !== 'null'){
            AppointmentParticipant.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' + rez[i].appointment_participant_actor_related_person_id; 
          }else if (rez[i].appointment_participant_actor_device_id !== 'null'){
            AppointmentParticipant.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' + rez[i].appointment_participant_actor_device_id; 
          }else if (rez[i].appointment_participant_actor_healthcare_service_id !== 'null'){
            AppointmentParticipant.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/HealthcareService?_id=' + rez[i].appointment_participant_actor_healthcare_service_id; 
          }else if (rez[i].appointment_participant_actor_location_id !== 'null'){
            AppointmentParticipant.actor = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' + rez[i].appointment_participant_actor_location_id; 
          }else{
            AppointmentParticipant.actor = ""; 
          }
          
          AppointmentParticipant.required = rez[i].appointment_participant_required;
          AppointmentParticipant.status = rez[i].appointment_participant_status;

          arrAppointmentParticipant[i] = AppointmentParticipant;
        }
        res.json({"err_code":0,"data":arrAppointmentParticipant});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getAppointmentParticipant"});
      });
    }
  },
  post: {
    appointment: function addAppointment(req, res){
      var appointment_id = req.body.id;
      var appointment_status = req.body.status;
      var appointment_service_category = req.body.service_category;
      var appointment_service_type = req.body.service_type;
      var appointment_specialty = req.body.specialty;
      var appointment_type = req.body.appointment_type;
      var appointment_reason = req.body.appointment_reason;
      var appointment_priority = req.body.priority;
      var appointment_description = req.body.description;
      var appointment_start = req.body.start;
      var appointment_end = req.body.end;
      var appointment_minutes_duration = req.body.minutes_duration;
      var appointment_created = req.body.created;
      var appointment_comment = req.body.comment;
      var appointment_period_start = req.body.requested_period_start;
      var appointment_period_end = req.body.requested_period_end;
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof appointment_id !== 'undefined' && appointment_id !== ""){
        column += 'appointment_id,';
        values += "'" + appointment_id +"',";
      }

      if(typeof appointment_status !== 'undefined' && appointment_status !== ""){
        column += 'appointment_status,';
        values += "'" + appointment_status +"',";
      }

      if(typeof appointment_service_category !== 'undefined' && appointment_service_category !== ""){
        column += 'appointment_service_category,';
        values += "'" + appointment_service_category +"',";
      }

      if(typeof appointment_service_type !== 'undefined' && appointment_service_type !== ""){
        column += 'appointment_service_type,';
        values += "'" + appointment_service_type +"',";
      }

      if(typeof appointment_specialty !== 'undefined' && appointment_specialty !== ""){
        column += 'appointment_specialty,';
        values += "'" + appointment_specialty +"',";
      }

      if(typeof appointment_type !== 'undefined' && appointment_type !== ""){
        column += 'appointment_type,';
        values += "'" + appointment_type +"',";
      }

      if(typeof appointment_reason !== 'undefined' && appointment_reason !== ""){
        column += 'appointment_reason,';
        values += "'" + appointment_reason +"',";
      }

      if(typeof appointment_priority !== 'undefined' && appointment_priority !== ""){
        column += 'appointment_priority,';
        values +=  appointment_priority +",";
      }

      if(typeof appointment_description !== 'undefined' && appointment_description !== ""){
        column += 'appointment_description,';
        values += "'" + appointment_description +"',";
      }

      if(typeof appointment_start !== 'undefined' && appointment_start !== ""){
        column += 'appointment_start,';
        values += "to_date('" + appointment_start +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof appointment_end !== 'undefined' && appointment_end !== ""){
        column += 'appointment_end,';
        values += "to_date('" + appointment_end +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof schedule_period_end !== 'undefined' && schedule_period_end !== ""){
        column += 'schedule_period_end,';
        values += "to_date('" + schedule_period_end +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof appointment_minutes_duration !== 'undefined' && appointment_minutes_duration !== ""){
        column += 'appointment_minutes_duration,';
        values += appointment_minutes_duration + ",";
      }

      if(typeof appointment_created !== 'undefined' && appointment_created !== ""){
        column += 'appointment_created,';
        values += "to_date('" + appointment_created +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof appointment_comment !== 'undefined' && appointment_comment !== ""){
        column += 'appointment_comment,';
        values += "'" + appointment_comment +"',";
      }

      if(typeof appointment_period_start !== 'undefined' && appointment_period_start !== ""){
        column += 'appointment_period_start,';
        values += "to_date('" + appointment_period_start +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof appointment_period_end !== 'undefined' && appointment_period_end !== ""){
        column += 'appointment_period_end,';
        values += "to_date('" + appointment_period_end +"', 'yyyy-MM-dd HH:mm'),";
      }

      var query = "UPSERT INTO BACIRO_FHIR.APPOINTMENT(" + column.slice(0, -1) + ")"+
        " VALUES ("+ values.slice(0, -1) +")";
<<<<<<< HEAD
      
=======
      console.log(query);
>>>>>>> hcs
      db.upsert(query,function(succes){
        res.json({"err_code": 0, "err_msg": "Appointment has been add."});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAppointment"});
      });
    },
    appointmentParticipant: function addAppointmentParticipant(req, res){
      var appointment_participant_id = req.body.id;
      var appointment_participant_type = req.body.type;
      var appointment_participant_actor_patient_id = req.body.actor_patient_id;
      var appointment_participant_actor_practitioner_id = req.body.actor_practitioner_id;
      var appointment_participant_actor_related_person_id = req.body.actor_related_person_id;
      var appointment_participant_actor_device_id = req.body.actor_device_id;
      var appointment_participant_actor_healthcare_service_id = req.body.actor_healthcare_service_id;
      var appointment_participant_actor_location_id = req.body.actor_location_id;
      var appointment_participant_required = req.body.required;
      var appointment_participant_status = req.body.status;
      var appointment_id = req.body.appointment_id;

      //susun query update
      var column = "";
      var values = "";
      
      if(typeof appointment_participant_id !== 'undefined' && appointment_participant_id !== ""){
        column += 'appointment_participant_id,';
        values += "'" + appointment_participant_id +"',";
      }

      if(typeof appointment_participant_type !== 'undefined' && appointment_participant_type !== ""){
        column += 'appointment_participant_type,';
        values += "'" + appointment_participant_type +"',";
      }

      if(typeof appointment_participant_actor_patient_id !== 'undefined' && appointment_participant_actor_patient_id !== ""){
        column += 'appointment_participant_actor_patient_id,';
        values += "'" + appointment_participant_actor_patient_id +"',";
      }

      if(typeof appointment_participant_actor_practitioner_id !== 'undefined' && appointment_participant_actor_practitioner_id !== ""){
        column += 'appointment_participant_actor_practitioner_id,';
        values += "'" + appointment_participant_actor_practitioner_id +"',";
      }

      if(typeof appointment_participant_actor_related_person_id !== 'undefined' && appointment_participant_actor_related_person_id !== ""){
        column += 'appointment_participant_actor_related_person_id,';
        values += "'" + appointment_participant_actor_related_person_id +"',";
      }

      if(typeof appointment_participant_actor_device_id !== 'undefined' && appointment_participant_actor_device_id !== ""){
        column += 'appointment_participant_actor_device_id,';
        values += "'" + appointment_participant_actor_device_id +"',";
      }

      if(typeof appointment_participant_actor_healthcare_service_id !== 'undefined' && appointment_participant_actor_healthcare_service_id !== ""){
        column += 'appointment_participant_actor_healthcare_service_id,';
        values += "'" + appointment_participant_actor_healthcare_service_id +"',";
      }

      if(typeof appointment_participant_actor_location_id !== 'undefined' && appointment_participant_actor_location_id !== ""){
        column += 'appointment_participant_actor_location_id,';
        values += "'" + appointment_participant_actor_location_id +"',";
      }

      if(typeof appointment_participant_required !== 'undefined' && appointment_participant_required !== ""){
        column += 'appointment_participant_required,';
        values += "'" + appointment_participant_required +"',";
      }

      if(typeof appointment_participant_status !== 'undefined' && appointment_participant_status !== ""){
        column += 'appointment_participant_status,';
        values += "'" + appointment_participant_status +"',";
      }

      if(typeof appointment_id !== 'undefined' && appointment_id !== ""){
        column += 'appointment_id,';
        values += "'" + appointment_id +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.APPOINTMENT_PARTICIPANT(" + column.slice(0, -1) + ")"+
        " VALUES ("+ values.slice(0, -1) +")";
      
      db.upsert(query,function(succes){
        res.json({"err_code": 0, "err_msg": "Appointment Participant has been add."});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAppointmentParticipant"});
      });
    }
  },
  put: {
    appointment: function updateApointment(req, res){
      var appointmentId = req.params.appointment_id;

      var appointment_status = req.body.status;
      var appointment_service_category = req.body.service_category;
      var appointment_service_type = req.body.service_type;
      var appointment_specialty = req.body.specialty;
      var appointment_type = req.body.appointment_type;
      var appointment_reason = req.body.appointment_reason;
      var appointment_priority = req.body.priority;
      var appointment_description = req.body.description;
      var appointment_start = req.body.start;
      var appointment_end = req.body.end;
      var appointment_minutes_duration = req.body.minutes_duration;
      var appointment_created = req.body.created;
      var appointment_comment = req.body.comment;
      var appointment_period_start = req.body.requested_period_start;
      var appointment_period_end = req.body.requested_period_end;
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof appointment_id !== 'undefined' && appointment_id !== ""){
        column += 'appointment_id,';
        values += "'" + appointment_id +"',";
      }

      if(typeof appointment_status !== 'undefined' && appointment_status !== ""){
        column += 'appointment_status,';
        values += "'" + appointment_status +"',";
      }

      if(typeof appointment_service_category !== 'undefined' && appointment_service_category !== ""){
        column += 'appointment_service_category,';
        values += "'" + appointment_service_category +"',";
      }

      if(typeof appointment_service_type !== 'undefined' && appointment_service_type !== ""){
        column += 'appointment_service_type,';
        values += "'" + appointment_service_type +"',";
      }

      if(typeof appointment_specialty !== 'undefined' && appointment_specialty !== ""){
        column += 'appointment_specialty,';
        values += "'" + appointment_specialty +"',";
      }

      if(typeof appointment_type !== 'undefined' && appointment_type !== ""){
        column += 'appointment_type,';
        values += "'" + appointment_type +"',";
      }

      if(typeof appointment_reason !== 'undefined' && appointment_reason !== ""){
        column += 'appointment_reason,';
        values += "'" + appointment_reason +"',";
      }

      if(typeof appointment_priority !== 'undefined' && appointment_priority !== ""){
        column += 'appointment_priority,';
        values +=  appointment_priority +",";
      }

      if(typeof appointment_description !== 'undefined' && appointment_description !== ""){
        column += 'appointment_description,';
        values += "'" + appointment_description +"',";
      }

      if(typeof appointment_start !== 'undefined' && appointment_start !== ""){
        column += 'appointment_start,';
        values += "to_date('" + appointment_start +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof appointment_end !== 'undefined' && appointment_end !== ""){
        column += 'appointment_end,';
        values += "to_date('" + appointment_end +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof schedule_period_end !== 'undefined' && schedule_period_end !== ""){
        column += 'schedule_period_end,';
        values += "to_date('" + schedule_period_end +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof appointment_minutes_duration !== 'undefined' && appointment_minutes_duration !== ""){
        column += 'appointment_minutes_duration,';
        values += appointment_minutes_duration + ",";
      }

      if(typeof appointment_created !== 'undefined' && appointment_created !== ""){
        column += 'appointment_created,';
        values += "to_date('" + appointment_created +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof appointment_comment !== 'undefined' && appointment_comment !== ""){
        column += 'appointment_comment,';
        values += "'" + appointment_comment +"',";
      }

      if(typeof appointment_period_start !== 'undefined' && appointment_period_start !== ""){
        column += 'appointment_period_start,';
        values += "to_date('" + appointment_period_start +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof appointment_period_end !== 'undefined' && appointment_period_end !== ""){
        column += 'appointment_period_end,';
        values += "to_date('" + appointment_period_end +"', 'yyyy-MM-dd HH:mm'),";
      }

      var condition = "appointment_id = '" + appointmentId + "'";

      var query = "UPSERT INTO BACIRO_FHIR.APPOINTMENT(appointment_id," + column.slice(0, -1) + ") SELECT appointment_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.APPOINTMENT WHERE " + condition;
      
      db.upsert(query,function(succes){
        res.json({"err_code": 0, "err_msg": "Appointment has been update"});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSchedule"});
      });
    },
    appointmentParticipant: function updateApointmentParticipant(req, res){
      var _id = req.params.participant_id;
      var domainResource = req.params.dr;

      var appointment_participant_type = req.body.type;
      var appointment_participant_actor_patient_id = req.body.actor_patient_id;
      var appointment_participant_actor_practitioner_id = req.body.actor_practitioner_id;
      var appointment_participant_actor_related_person_id = req.body.actor_related_person_id;
      var appointment_participant_actor_device_id = req.body.actor_device_id;
      var appointment_participant_actor_healthcare_service_id = req.body.actor_healthcare_service_id;
      var appointment_participant_actor_location_id = req.body.actor_location_id;
      var appointment_participant_required = req.body.required;
      var appointment_participant_status = req.body.status;

      //susun query update
      var column = "";
      var values = "";
      
      if(typeof appointment_participant_id !== 'undefined' && appointment_participant_id !== ""){
        column += 'appointment_participant_id,';
        values += "'" + appointment_participant_id +"',";
      }

      if(typeof appointment_participant_type !== 'undefined' && appointment_participant_type !== ""){
        column += 'appointment_participant_type,';
        values += "'" + appointment_participant_type +"',";
      }

      if(typeof appointment_participant_actor_patient_id !== 'undefined' && appointment_participant_actor_patient_id !== ""){
        column += 'appointment_participant_actor_patient_id,';
        values += "'" + appointment_participant_actor_patient_id +"',";

        //kosongkan yang lainnya
        column += 'appointment_participant_actor_practitioner_id,';
        values += "null,";

        column += 'appointment_participant_actor_related_person_id,';
        values += "null,";

        column += 'appointment_participant_actor_device_id,';
        values += "null,";

        column += 'appointment_participant_actor_healthcare_service_id,';
        values += "null,";

        column += 'appointment_participant_actor_location_id,';
        values += "null,";
      }else if(typeof appointment_participant_actor_practitioner_id !== 'undefined' && appointment_participant_actor_practitioner_id !== ""){
        column += 'appointment_participant_actor_practitioner_id,';
        values += "'" + appointment_participant_actor_practitioner_id +"',";

        //kosongkan yang lainnya
        column += 'appointment_participant_actor_patient_id,';
        values += "null,";

        column += 'appointment_participant_actor_related_person_id,';
        values += "null,";

        column += 'appointment_participant_actor_device_id,';
        values += "null,";

        column += 'appointment_participant_actor_healthcare_service_id,';
        values += "null,";

        column += 'appointment_participant_actor_location_id,';
        values += "null,";
      }else if(typeof appointment_participant_actor_related_person_id !== 'undefined' && appointment_participant_actor_related_person_id !== ""){
        column += 'appointment_participant_actor_related_person_id,';
        values += "'" + appointment_participant_actor_related_person_id +"',";

        //kosongkan yang lainnya
        column += 'appointment_participant_actor_patient_id,';
        values += "null,";

        column += 'appointment_participant_actor_practitioner_id,';
        values += "null,";

        column += 'appointment_participant_actor_device_id,';
        values += "null,";

        column += 'appointment_participant_actor_healthcare_service_id,';
        values += "null,";

        column += 'appointment_participant_actor_location_id,';
        values += "null,";
      }else if(typeof appointment_participant_actor_device_id !== 'undefined' && appointment_participant_actor_device_id !== ""){
        column += 'appointment_participant_actor_device_id,';
        values += "'" + appointment_participant_actor_device_id +"',";

        //kosongkan yang lainnya
        column += 'appointment_participant_actor_patient_id,';
        values += "null,";

        column += 'appointment_participant_actor_practitioner_id,';
        values += "null,";

        column += 'appointment_participant_actor_related_person_id,';
        values += "null,";

        column += 'appointment_participant_actor_healthcare_service_id,';
        values += "null,";

        column += 'appointment_participant_actor_location_id,';
        values += "null,";
      }else if(typeof appointment_participant_actor_healthcare_service_id !== 'undefined' && appointment_participant_actor_healthcare_service_id !== ""){
        column += 'appointment_participant_actor_healthcare_service_id,';
        values += "'" + appointment_participant_actor_healthcare_service_id +"',";

         //kosongkan yang lainnya
        column += 'appointment_participant_actor_patient_id,';
        values += "null,";

        column += 'appointment_participant_actor_practitioner_id,';
        values += "null,";

        column += 'appointment_participant_actor_related_person_id,';
        values += "null,";

        column += 'appointment_participant_actor_device_id,';
        values += "null,";

        column += 'appointment_participant_actor_location_id,';
        values += "null,";
      }else if(typeof appointment_participant_actor_location_id !== 'undefined' && appointment_participant_actor_location_id !== ""){
        column += 'appointment_participant_actor_location_id,';
        values += "'" + appointment_participant_actor_location_id +"',";

        //kosongkan yang lainnya
        column += 'appointment_participant_actor_patient_id,';
        values += "null,";

        column += 'appointment_participant_actor_practitioner_id,';
        values += "null,";

        column += 'appointment_participant_actor_related_person_id,';
        values += "null,";

        column += 'appointment_participant_actor_device_id,';
        values += "null,";

        column += 'appointment_participant_actor_healthcare_service_id,';
        values += "null,";
      }

      if(typeof appointment_participant_required !== 'undefined' && appointment_participant_required !== ""){
        column += 'appointment_participant_required,';
        values += "'" + appointment_participant_required +"',";
      }

      if(typeof appointment_participant_status !== 'undefined' && appointment_participant_status !== ""){
        column += 'appointment_participant_status,';
        values += "'" + appointment_participant_status +"',";
      }

      if(domainResource !== "" && typeof domainResource !== 'undefined'){
        var arrResource = domainResource.split('|');
        var fieldResource = arrResource[0];
        var valueResource = arrResource[1];
        var condition = "appointment_participant_id = '" + _id + "' AND " + fieldResource +" = '"+ valueResource +"'";
      }else{
        var condition = "appointment_participant_id = '" + _id + "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.APPOINTMENT_PARTICIPANT(appointment_participant_id," + column.slice(0, -1) + ") SELECT appointment_participant_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.APPOINTMENT_PARTICIPANT WHERE " + condition;
      
      console.log(query)
      db.upsert(query,function(succes){
        res.json({"err_code": 0, "err_msg": "Participant has been update"});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateApointmentParticipant"});
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