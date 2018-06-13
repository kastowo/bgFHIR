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
    slot: function getSlot(req, res){
      var apikey = req.params.apikey;
      
      var slotId = req.query._id;
      var scheduleId = req.query.schedule_id;
      var slotServiceType = req.query.service_type;
      var slotStart = req.query.start;
      var slotStatus = req.query.status;
      
      //susun query
      var condition = "";
      var join = "";

      if(typeof slotId !== 'undefined' && slotId !== ""){
        condition += "slot_id = '" + slotId + "' AND ";  
      }

      if(typeof scheduleId !== 'undefined' && scheduleId !== ""){
        condition += "schedule_id = '" + scheduleId + "' AND ";  
      }

      if(typeof slotServiceType !== 'undefined' && slotServiceType !== ""){
        condition += "slot_service_type = '" + slotServiceType + "' AND ";  
      }

      if(typeof slotStart !== 'undefined' && slotStart !== ""){
        condition += "slot_start = to_date('" + slotStart + "', 'yyyy-MM-dd HH:mm') AND ";  
      }

      if(typeof slotStatus !== 'undefined' && slotStatus !== ""){
        condition += "slot_status = '" + slotStatus + "' AND ";  
      }
      
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

      var arrSlot = [];
      var query = "SELECT slot_id, slot_service_category, slot_service_type, slot_specialty, slot_appointment_type, slot_status, slot_start, slot_end, slot_overbooked, slot_comment, schedule_id FROM BACIRO_FHIR.SLOT " + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Slot = {};
          Slot.resourceType = "Slot";
          Slot.id = rez[i].slot_id;
          Slot.serviceCategory = rez[i].slot_service_category;
          Slot.serviceType = rez[i].slot_service_type;
          Slot.specialty = rez[i].slot_specialty;
          Slot.appointmentType = rez[i].slot_appointment_type;
          Slot.schedule = hostFHIR + ':' + portFHIR +'/'+ apikey + '/Schedule?_id=' + rez[i].schedule_id;
          Slot.status = rez[i].slot_status;
          Slot.start = rez[i].slot_start;
          Slot.end = rez[i].slot_end;
          Slot.overbooked = rez[i].slot_overbooked;
          Slot.comment = rez[i].slot_comment;

          arrSlot[i] = Slot;
        }
        res.json({"err_code":0,"data":arrSlot});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getSlot"});
      });
    }
  },
  post: {
    slot: function addSlot(req, res){
      var apikey = req.params.apikey;

      var slot_id = req.body.id;
      var slot_service_category = req.body.service_category;
      var slot_service_type = req.body.service_type;
      var slot_specialty = req.body.specialty;
      var slot_appointment_type = req.body.appointment_type;
      var schedule_id = req.body.schedule_id;
      var slot_status = req.body.status;
      var slot_overbooked = req.body.overbooked;
      var slot_start = req.body.start;
      var slot_end = req.body.end;
      var slot_comment = req.body.comment;
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof slot_id !== 'undefined' && slot_id !== ""){
        column += 'slot_id,';
        values += "'" + slot_id +"',";
      }

      if(typeof slot_service_category !== 'undefined' && slot_service_category !== ""){
        column += 'slot_service_category,';
        values += "'" + slot_service_category +"',";
      }

      if(typeof slot_service_type !== 'undefined' && slot_service_type !== ""){
        column += 'slot_service_type,';
        values += "'" + slot_service_type +"',";
      }

      if(typeof slot_specialty !== 'undefined' && slot_specialty !== ""){
        column += 'slot_specialty,';
        values += "'" + slot_specialty +"',";
      }

      if(typeof slot_appointment_type !== 'undefined' && slot_appointment_type !== ""){
        column += 'slot_appointment_type,';
        values += "'" + slot_appointment_type +"',";
      }

      if(typeof schedule_id !== 'undefined' && schedule_id !== ""){
        column += 'schedule_id,';
        values += "'" + schedule_id +"',";
      }

      if(typeof slot_status !== 'undefined' && slot_status !== ""){
        column += 'slot_status,';
        values += "'" + slot_status +"',";
      }

      if(typeof slot_overbooked !== 'undefined' && slot_overbooked !== ""){
        column += 'slot_overbooked,';
        values += slot_overbooked +",";
      }

      if(typeof slot_start !== 'undefined' && slot_start !== ""){
        column += 'slot_start,';
        values += "to_date('" + slot_start +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof slot_end !== 'undefined' && slot_end !== ""){
        column += 'slot_end,';
        values += "to_date('" + slot_end +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof slot_comment !== 'undefined' && slot_comment !== ""){
        column += 'slot_comment,';
        values += "'" + slot_comment +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.SLOT(" + column.slice(0, -1) + ")"+
        " VALUES ("+ values.slice(0, -1) +")";
      
      db.upsert(query,function(succes){
        var arrSlot = [];
        var query = "SELECT slot_id, slot_service_category, slot_service_type, slot_specialty, slot_appointment_type, slot_status, slot_start, slot_end, slot_overbooked, slot_comment, schedule_id FROM BACIRO_FHIR.SLOT WHERE slot_id = '" + slot_id + "'"; 

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var Slot = {};
            Slot.resourceType = "Slot";
            Slot.id = rez[i].slot_id;
            Slot.serviceCategory = rez[i].slot_service_category;
            Slot.serviceType = rez[i].slot_service_type;
            Slot.specialty = rez[i].slot_specialty;
            Slot.appointmentType = rez[i].slot_appointment_type;
            Slot.schedule = hostFHIR + ':' + portFHIR +'/'+ apikey + '/Schedule?_id=' + rez[i].schedule_id;
            Slot.status = rez[i].slot_status;
            Slot.start = rez[i].slot_start;
            Slot.end = rez[i].slot_end;
            Slot.overbooked = rez[i].slot_overbooked;
            Slot.comment = rez[i].slot_comment;

            arrSlot[i] = Slot;
          }
          res.json({"err_code":0,"data":arrSlot});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSlot"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSlot"});
      });
    }
  },
  put: {
    slot: function updateSlot(req, res){
      var apikey = req.params.apikey;

      var slot_id = req.params.slot_id;

      var slot_service_category = req.body.service_category;
      var slot_service_type = req.body.service_type;
      var slot_specialty = req.body.specialty;
      var slot_appointment_type = req.body.appointment_type;
      var schedule_id = req.body.schedule_id;
      var slot_status = req.body.status;
      var slot_overbooked = req.body.overbooked;
      var slot_start = req.body.start;
      var slot_end = req.body.end;
      var slot_comment = req.body.comment;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof slot_service_category !== 'undefined' && slot_service_category !== ""){
        column += 'slot_service_category,';
        values += "'" + slot_service_category +"',";
      }

      if(typeof slot_service_type !== 'undefined' && slot_service_type !== ""){
        column += 'slot_service_type,';
        values += "'" + slot_service_type +"',";
      }

      if(typeof slot_specialty !== 'undefined' && slot_specialty !== ""){
        column += 'slot_specialty,';
        values += "'" + slot_specialty +"',";
      }

      if(typeof slot_appointment_type !== 'undefined' && slot_appointment_type !== ""){
        column += 'slot_appointment_type,';
        values += "'" + slot_appointment_type +"',";
      }

      if(typeof schedule_id !== 'undefined' && schedule_id !== ""){
        column += 'schedule_id,';
        values += "'" + schedule_id +"',";
      }

      if(typeof slot_status !== 'undefined' && slot_status !== ""){
        column += 'slot_status,';
        values += "'" + slot_status +"',";
      }

      if(typeof slot_overbooked !== 'undefined' && slot_overbooked !== ""){
        column += 'slot_overbooked,';
        values += slot_overbooked +",";
      }

      if(typeof slot_start !== 'undefined' && slot_start !== ""){
        column += 'slot_start,';
        values += "to_date('" + slot_start +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof slot_end !== 'undefined' && slot_end !== ""){
        column += 'slot_end,';
        values += "to_date('" + slot_end +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof slot_comment !== 'undefined' && slot_comment !== ""){
        column += 'slot_comment,';
        values += "'" + slot_comment +"',";
      }

      var condition = "slot_id = '" + slot_id + "'";

      var query = "UPSERT INTO BACIRO_FHIR.SLOT(slot_id," + column.slice(0, -1) + ") SELECT slot_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SLOT WHERE " + condition;
      
      db.upsert(query,function(succes){
        var arrSlot = [];
        var query = "SELECT slot_id, slot_service_category, slot_service_type, slot_specialty, slot_appointment_type, slot_status, slot_start, slot_end, slot_overbooked, slot_comment, schedule_id FROM BACIRO_FHIR.SLOT WHERE slot_id = '" + slot_id + "'"; 

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var Slot = {};
            Slot.resourceType = "Slot";
            Slot.id = rez[i].slot_id;
            Slot.serviceCategory = rez[i].slot_service_category;
            Slot.serviceType = rez[i].slot_service_type;
            Slot.specialty = rez[i].slot_specialty;
            Slot.appointmentType = rez[i].slot_appointment_type;
            Slot.schedule = hostFHIR + ':' + portFHIR +'/'+ apikey + '/Schedule?_id=' + rez[i].schedule_id;
            Slot.status = rez[i].slot_status;
            Slot.start = rez[i].slot_start;
            Slot.end = rez[i].slot_end;
            Slot.overbooked = rez[i].slot_overbooked;
            Slot.comment = rez[i].slot_comment;

            arrSlot[i] = Slot;
          }
          res.json({"err_code":0,"data":arrSlot});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSlot"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSlot"});
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