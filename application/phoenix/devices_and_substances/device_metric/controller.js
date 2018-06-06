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
    deviceMetric: function getDeviceMetric(req, res){
      var apikey = req.params.apikey;
      
      var deviceMetricId = req.query._id;
      var deviceMetricCategory = req.query.category;
      var deviceComponentId = req.query.parent;
      var deviceId = req.query.source;
      var deviceMetricType = req.query.type;
         
      //susun query
      var condition = "";
      var join = "";

      if(typeof deviceMetricId !== 'undefined' && deviceMetricId !== ""){
        condition += "device_metric_id = '" + deviceMetricId + "' AND ";  
      }

      if(typeof deviceMetricCategory !== 'undefined' && deviceMetricCategory !== ""){
        condition += "device_metric_category = '" + deviceMetricCategory + "' AND ";  
      }

      if(typeof deviceComponentId !== 'undefined' && deviceComponentId !== ""){
        condition += "device_component_id = '" + deviceComponentId + "' AND ";  
      }

      if(typeof deviceId !== 'undefined' && deviceId !== ""){
        condition += "device_id = '" + deviceId + "' AND ";  
      }

      if(typeof deviceMetricType !== 'undefined' && deviceMetricType !== ""){
        condition += "device_metric_type = '" + deviceMetricType + "' AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

      var arrDeviceMetric = [];
      var query = "SELECT device_metric_id, device_metric_type, device_metric_unit, device_metric_operational_status, device_metric_color, device_metric_category, device_metric_measurement_period, device_id, device_component_id FROM BACIRO_FHIR.DEVICE_METRIC dm " + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var DeviceMetric = {};
          DeviceMetric.resourceType = "DeviceMetric";
          DeviceMetric.id = rez[i].device_metric_id;
          DeviceMetric.type = rez[i].device_metric_type;
          DeviceMetric.unit = rez[i].device_metric_unit;

          if(rez[i].device_id !== 'null'){
            DeviceMetric.source = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +   rez[i].device_id;  
          }else{
            DeviceMetric.source = "";
          }

          if(rez[i].device_component_id !== 'null'){
            DeviceMetric.parent = hostFHIR + ':' + portFHIR + '/' + apikey + '/DeviceComponent?_id=' +   rez[i].device_component_id;
          }else{ 
            DeviceMetric.parent = "";
          }

          DeviceMetric.operationalStatus = rez[i].device_metric_operational_status;
          DeviceMetric.color = rez[i].device_metric_color;
          DeviceMetric.category = rez[i].device_metric_category;
          DeviceMetric.measurementPeriod = rez[i].device_metric_measurement_period;

          arrDeviceMetric[i] = DeviceMetric;
        }
        res.json({"err_code":0,"data":arrDeviceMetric});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceMetric"});
      });
    },
    deviceMetricCalibration: function getDeviceMetricCalibration(req, res){
      var apikey = req.params.apikey;  
      var deviceMetricCalibrationId = req.query._id;
      var deviceMetricId = req.query.device_metric_id;
    
      //susun query
      var condition = "";
      var join = "";

      if(typeof deviceMetricCalibrationId !== 'undefined' && deviceMetricCalibrationId !== ""){
        condition += "device_metric_calibration_id = '" + deviceMetricCalibrationId + "' AND ";  
      }

      if(typeof deviceMetricId !== 'undefined' && deviceMetricId !== ""){
        condition += "device_metric_id = '" + deviceMetricId + "' AND ";  
      }
      
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

      var arrDeviceMetricCalibration = [];
      var query = "SELECT device_metric_calibration_id, device_metric_calibration_type, device_metric_calibration_state, device_metric_calibration_time FROM BACIRO_FHIR.DEVICE_METRIC_CALIBRATION " + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var DeviceMetricCalibration = {};
          DeviceMetricCalibration.id = rez[i].device_metric_calibration_id;
          DeviceMetricCalibration.type = rez[i].device_metric_calibration_type;
          DeviceMetricCalibration.state = rez[i].device_metric_calibration_state;
          DeviceMetricCalibration.time = rez[i].device_metric_calibration_time;

          arrDeviceMetricCalibration[i] = DeviceMetricCalibration;
        }
        res.json({"err_code":0,"data":arrDeviceMetricCalibration});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceMetricCalibration"});
      });
    }
  },
  post: {
    deviceMetric: function addDeviceMetric(req, res){
      var apikey = req.params.apikey;

      var device_metric_id = req.body.id;
      var device_metric_type = req.body.type;
      var device_metric_unit = req.body.unit;
      var device_metric_operational_status = req.body.operational_status;
      var device_metric_color = req.body.color;
      var device_metric_category = req.body.category;
      var device_metric_measurement_period = req.body.measurement_period;
      var device_id = req.body.source;
      var device_component_id = req.body.parent;
      
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof device_metric_id !== 'undefined' && device_metric_id !== ""){
        column += 'device_metric_id,';
        values += "'" + device_metric_id +"',";
      }

      if(typeof device_metric_type !== 'undefined' && device_metric_type !== ""){
        column += 'device_metric_type,';
        values += "'" + device_metric_type +"',";
      }

      if(typeof device_metric_unit !== 'undefined' && device_metric_unit !== ""){
        column += 'device_metric_unit,';
        values += "'" + device_metric_unit +"',";
      }

      if(typeof device_metric_operational_status !== 'undefined' && device_metric_operational_status !== ""){
        column += 'device_metric_operational_status,';
        values += "'" + device_metric_operational_status +"',";
      }
      
      if(typeof device_metric_color !== 'undefined' && device_metric_color !== ""){
        column += 'device_metric_color,';
        values += "'" + device_metric_color +"',";
      }

      if(typeof device_metric_category !== 'undefined' && device_metric_category !== ""){
        column += 'device_metric_category,';
        values += "'" + device_metric_category +"',";
      }

      if(typeof device_metric_measurement_period !== 'undefined' && device_metric_measurement_period !== ""){
        column += 'device_metric_measurement_period,';
        values += "'" + device_metric_measurement_period +"',";
      }

      if(typeof device_id !== 'undefined' && device_id !== ""){
        column += 'device_id,';
        values += "'" + device_id +"',";
      }

      if(typeof device_component_id !== 'undefined' && device_component_id !== ""){
        column += 'device_component_id,';
        values += "'" + device_component_id +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_METRIC(" + column.slice(0, -1) + ")"+
        " VALUES ("+ values.slice(0, -1) +")";
      
      db.upsert(query,function(succes){
        res.json({"err_code":0, "err_msg": "Device Metric has been add."});
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceMetric"});
      });
    },
    deviceMetricCalibration: function addDeviceMetricCalibration(req, res){
      var apikey = req.params.apikey;

      var device_metric_calibration_id = req.body.id;
      var device_metric_calibration_type = req.body.type;
      var device_metric_calibration_state = req.body.state;
      var device_metric_calibration_time = req.body.time;
      var device_metric_id = req.body.device_metric_id;
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof device_metric_calibration_id !== 'undefined' && device_metric_calibration_id !== ""){
        column += 'device_metric_calibration_id,';
        values += "'" + device_metric_calibration_id +"',";
      }

      if(typeof device_metric_calibration_type !== 'undefined' && device_metric_calibration_type !== ""){
        column += 'device_metric_calibration_type,';
        values += "'" + device_metric_calibration_type +"',";
      }

      if(typeof device_metric_calibration_state !== 'undefined' && device_metric_calibration_state !== ""){
        column += 'device_metric_calibration_state,';
        values += "'" + device_metric_calibration_state +"',";
      }

      if(typeof device_metric_calibration_time !== 'undefined' && device_metric_calibration_time !== ""){
        column += 'device_metric_calibration_time,';
        values += "to_date('" + device_metric_calibration_time +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof device_metric_id !== 'undefined' && device_metric_id !== ""){
        column += 'device_metric_id,';
        values += "'" + device_metric_id +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_METRIC_CALIBRATION(" + column.slice(0, -1) + ")"+
        " VALUES ("+ values.slice(0, -1) +")";
      
      db.upsert(query,function(succes){
        res.json({"err_code":0, "err_msg": "Calibration has been add."});
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceMetricCalibration"});
      });
    }
  },
  put: {
    deviceMetric: function updateDeviceMetric(req, res){
      var apikey = req.params.apikey;
      var device_metric_id = req.params.device_metric_id;

      var device_metric_type = req.body.type;
      var device_metric_unit = req.body.unit;
      var device_metric_operational_status = req.body.operational_status;
      var device_metric_color = req.body.color;
      var device_metric_category = req.body.category;
      var device_metric_measurement_period = req.body.measurement_period;
      var device_id = req.body.source;
      var device_component_id = req.body.parent;
      
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof device_metric_type !== 'undefined' && device_metric_type !== ""){
        column += 'device_metric_type,';
        values += "'" + device_metric_type +"',";
      }

      if(typeof device_metric_unit !== 'undefined' && device_metric_unit !== ""){
        column += 'device_metric_unit,';
        values += "'" + device_metric_unit +"',";
      }

      if(typeof device_metric_operational_status !== 'undefined' && device_metric_operational_status !== ""){
        column += 'device_metric_operational_status,';
        values += "'" + device_metric_operational_status +"',";
      }
      
      if(typeof device_metric_color !== 'undefined' && device_metric_color !== ""){
        column += 'device_metric_color,';
        values += "'" + device_metric_color +"',";
      }

      if(typeof device_metric_category !== 'undefined' && device_metric_category !== ""){
        column += 'device_metric_category,';
        values += "'" + device_metric_category +"',";
      }

      if(typeof device_metric_measurement_period !== 'undefined' && device_metric_measurement_period !== ""){
        column += 'device_metric_measurement_period,';
        values += "'" + device_metric_measurement_period +"',";
      }

      if(typeof device_id !== 'undefined' && device_id !== ""){
        column += 'device_id,';
        values += "'" + device_id +"',";
      }

      if(typeof device_component_id !== 'undefined' && device_component_id !== ""){
        column += 'device_component_id,';
        values += "'" + device_component_id +"',";
      }

      var condition = "device_metric_id = '" + device_metric_id + "'";

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_METRIC(device_metric_id," + column.slice(0, -1) + ") SELECT device_metric_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DEVICE_METRIC WHERE " + condition;
      
      db.upsert(query,function(succes){
        res.json({"err_code": 0, "err_msg": "Device Component has been update."});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceMetric"});
      });
    },
    deviceMetricCalibration: function updateDeviceMetricCalibration(req, res){
      var apikey = req.params.apikey;

      var _id = req.params.id;
      var domainResource = req.params.dr;

      var device_metric_calibration_type = req.body.type;
      var device_metric_calibration_state = req.body.state;
      var device_metric_calibration_time = req.body.time;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof device_metric_calibration_type !== 'undefined' && device_metric_calibration_type !== ""){
        column += 'device_metric_calibration_type,';
        values += "'" + device_metric_calibration_type +"',";
      }

      if(typeof device_metric_calibration_type !== 'undefined' && device_metric_calibration_type !== ""){
        column += 'device_metric_calibration_type,';
        values += "'" + device_metric_calibration_type +"',";
      }

      if(typeof device_metric_calibration_time !== 'undefined' && device_metric_calibration_time !== ""){
        column += 'device_metric_calibration_time,';
        values += "to_date('" + device_metric_calibration_time +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(domainResource !== "" && typeof domainResource !== 'undefined'){
        var arrResource = domainResource.split('|');
        var fieldResource = arrResource[0];
        var valueResource = arrResource[1];
        var condition = "device_metric_calibration_id = '" + _id + "' AND " + fieldResource +" = '"+ valueResource +"'";
      }else{
        var condition = "device_metric_calibration_id = '" + _id + "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_METRIC_CALIBRATION(device_metric_calibration_id," + column.slice(0, -1) + ") SELECT device_metric_calibration_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DEVICE_METRIC_CALIBRATION WHERE " + condition;
      
      db.upsert(query,function(succes){
        res.json({"err_code": 0, "err_msg": "Calibration has been update."});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceMetricCalibration"});
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