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
    deviceComponent: function getDeviceComponent(req, res){
      var apikey = req.params.apikey;
      
      var deviceComponentId = req.query._id;
      var parentId = req.query.parent;
      var deviceId = req.query.device_id;
      var deviceComponentType = req.query.type;
         
      //susun query
      var condition = "";
      var join = "";

      if(typeof deviceComponentId !== 'undefined' && deviceComponentId !== ""){
        condition += "device_component_id = '" + deviceComponentId + "' AND ";  
      }

      if(typeof parentId !== 'undefined' && parentId !== ""){
        condition += "parent_id = '" + parentId + "' AND ";  
      }

      if(typeof deviceId !== 'undefined' && deviceId !== ""){
        condition += "device_id = '" + deviceId + "' AND ";  
      }

      if(typeof deviceComponentType !== 'undefined' && deviceComponentType !== ""){
        condition += "device_component_type = '" + deviceComponentType + "' AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

      var arrDeviceComponent = [];
      var query = "SELECT device_component_id, device_component_type, device_component_last_system_change, device_component_operational_status, device_component_parameter_group, device_component_measurement_principle, device_component_language_code, device_id, parent_id FROM BACIRO_FHIR.DEVICE_COMPONENT dc " + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var DeviceComponent = {};
          DeviceComponent.resourceType = "DeviceComponent";
          DeviceComponent.id = rez[i].device_component_id;
          DeviceComponent.type = rez[i].device_component_type;
          DeviceComponent.lastSystemChange = rez[i].device_component_last_system_change;

          if(rez[i].device_id !== 'null'){
            DeviceComponent.source = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +   rez[i].device_id;  
          }else{
            DeviceComponent.source = "";
          }

          if(rez[i].parent_id !== 'null'){
            DeviceComponent.parent = hostFHIR + ':' + portFHIR + '/' + apikey + '/DeviceComponent?_id=' +   rez[i].parent_id;
          }else{ 
            DeviceComponent.parent = "";
          }

          DeviceComponent.operationalStatus = rez[i].device_component_operational_status;
          DeviceComponent.parameterGroup = rez[i].device_component_parameter_group;
          DeviceComponent.measurementPrinciple = rez[i].device_component_measurement_principle;
          DeviceComponent.languageCode = rez[i].device_component_language_code;

          arrDeviceComponent[i] = DeviceComponent;
        }
        res.json({"err_code":0,"data":arrDeviceComponent});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceComponent"});
      });
    },
    deviceComponentProductionSpecification: function getDeviceComponentProductionSpecification(req, res){
      var apikey = req.params.apikey;  
      var deviceComponentProductionSpecificationId = req.query._id;
      var deviceComponentId = req.query.device_component_id;
    
      //susun query
      var condition = "";
      var join = "";

      if(typeof deviceComponentProductionSpecificationId !== 'undefined' && deviceComponentProductionSpecificationId !== ""){
        condition += "device_component_production_specification_id = '" + deviceComponentProductionSpecificationId + "' AND ";  
      }

      if(typeof deviceComponentId !== 'undefined' && deviceComponentId !== ""){
        condition += "device_component_id = '" + deviceComponentId + "' AND ";  
      }
      
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

      var arrDeviceComponentProductionSpecification = [];
      var query = "SELECT device_component_production_specification_id, device_component_production_specification_spec_type, device_component_production_specification_component_id, device_component_production_specification_production_spec FROM BACIRO_FHIR.DEVICE_COMPONENT_PRODUCTION_SPECIFICATION " + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var DeviceComponentProductionSpecification = {};
          DeviceComponentProductionSpecification.id = rez[i].device_component_production_specification_id;
          DeviceComponentProductionSpecification.specType = rez[i].device_component_production_specification_spec_type;
          DeviceComponentProductionSpecification.componentId = rez[i].device_component_production_specification_component_id;
          DeviceComponentProductionSpecification.productionSpec = rez[i].device_component_production_specification_production_spec;

          arrDeviceComponentProductionSpecification[i] = DeviceComponentProductionSpecification;
        }
        res.json({"err_code":0,"data":arrDeviceComponentProductionSpecification});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceComponentProductionSpecification"});
      });
    }
  },
  post: {
    deviceComponent: function addDeviceComponent(req, res){
      var apikey = req.params.apikey;

      var device_component_id = req.body.id;
      var device_component_type = req.body.type;
      var device_component_last_system_change = req.body.last_system_change;
      var device_component_operational_status = req.body.operational_status;
      var device_component_parameter_group = req.body.parameter_group;
      var device_component_measurement_principle = req.body.measurement_principle;
      var device_component_language_code = req.body.language_code;
      var device_id = req.body.device_id;
      var parent_id = req.body.parent_id;
      
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof device_component_id !== 'undefined' && device_component_id !== ""){
        column += 'device_component_id,';
        values += "'" + device_component_id +"',";
      }

      if(typeof device_component_type !== 'undefined' && device_component_type !== ""){
        column += 'device_component_type,';
        values += "'" + device_component_type +"',";
      }

      if(typeof device_component_last_system_change !== 'undefined' && device_component_last_system_change !== ""){
        column += 'device_component_last_system_change,';
        values += "to_date('" + device_component_last_system_change +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof device_component_operational_status !== 'undefined' && device_component_operational_status !== ""){
        column += 'device_component_operational_status,';
        values += "'" + device_component_operational_status +"',";
      }
      
      if(typeof device_component_parameter_group !== 'undefined' && device_component_parameter_group !== ""){
        column += 'device_component_parameter_group,';
        values += "'" + device_component_parameter_group +"',";
      }

      if(typeof device_component_measurement_principle !== 'undefined' && device_component_measurement_principle !== ""){
        column += 'device_component_measurement_principle,';
        values += "'" + device_component_measurement_principle +"',";
      }

      if(typeof device_component_language_code !== 'undefined' && device_component_language_code !== ""){
        column += 'device_component_language_code,';
        values += "'" + device_component_language_code +"',";
      }

      if(typeof device_id !== 'undefined' && device_id !== ""){
        column += 'device_id,';
        values += "'" + device_id +"',";
      }

      if(typeof parent_id !== 'undefined' && parent_id !== ""){
        column += 'parent_id,';
        values += "'" + parent_id +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_COMPONENT(" + column.slice(0, -1) + ")"+
        " VALUES ("+ values.slice(0, -1) +")";
      
      db.upsert(query,function(succes){
        res.json({"err_code":0, "err_msg": "Device Component has been add."});
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceComponent"});
      });
    },
    deviceComponentProductionSpecification: function addDeviceComponentProductionSpecification(req, res){
      var apikey = req.params.apikey;

      var device_component_production_specification_id = req.body.id;
      var device_component_production_specification_spec_type = req.body.spec_type;
      var device_component_production_specification_component_id = req.body.component_id;
      var device_component_production_specification_production_spec = req.body.production_spec;
      var device_component_id = req.body.device_component_id;
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof device_component_production_specification_id !== 'undefined' && device_component_production_specification_id !== ""){
        column += 'device_component_production_specification_id,';
        values += "'" + device_component_production_specification_id +"',";
      }

      if(typeof device_component_production_specification_spec_type !== 'undefined' && device_component_production_specification_spec_type !== ""){
        column += 'device_component_production_specification_spec_type,';
        values += "'" + device_component_production_specification_spec_type +"',";
      }

      if(typeof device_component_production_specification_component_id !== 'undefined' && device_component_production_specification_component_id !== ""){
        column += 'device_component_production_specification_component_id,';
        values += "'" + device_component_production_specification_component_id +"',";
      }

      if(typeof device_component_production_specification_production_spec !== 'undefined' && device_component_production_specification_production_spec !== ""){
        column += 'device_component_production_specification_production_spec,';
        values += "'" + device_component_production_specification_production_spec +"',";
      }

      if(typeof device_component_id !== 'undefined' && device_component_id !== ""){
        column += 'device_component_id,';
        values += "'" + device_component_id +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_COMPONENT_PRODUCTION_SPECIFICATION(" + column.slice(0, -1) + ")"+
        " VALUES ("+ values.slice(0, -1) +")";
      
      db.upsert(query,function(succes){
        res.json({"err_code":0, "err_msg": "Production specification has been add."});
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceComponentProductionSpecification"});
      });
    }
  },
  put: {
    deviceComponent: function updateDeviceComponent(req, res){
      var apikey = req.params.apikey;

      var device_component_id = req.params.device_component_id;

      var device_component_type = req.body.type;
      var device_component_last_system_change = req.body.last_system_change;
      var device_component_operational_status = req.body.operational_status;
      var device_component_parameter_group = req.body.parameter_group;
      var device_component_measurement_principle = req.body.measurement_principle;
      var device_component_language_code = req.body.language_code;
      var device_id = req.body.device_id;
      var parent_id = req.body.parent_id;
      
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof device_component_type !== 'undefined' && device_component_type !== ""){
        column += 'device_component_type,';
        values += "'" + device_component_type +"',";
      }

      if(typeof device_component_last_system_change !== 'undefined' && device_component_last_system_change !== ""){
        column += 'device_component_last_system_change,';
        values += "to_date('" + device_component_last_system_change +"', 'yyyy-MM-dd HH:mm'),";
      }

      if(typeof device_component_operational_status !== 'undefined' && device_component_operational_status !== ""){
        column += 'device_component_operational_status,';
        values += "'" + device_component_operational_status +"',";
      }
      
      if(typeof device_component_parameter_group !== 'undefined' && device_component_parameter_group !== ""){
        column += 'device_component_parameter_group,';
        values += "'" + device_component_parameter_group +"',";
      }

      if(typeof device_component_measurement_principle !== 'undefined' && device_component_measurement_principle !== ""){
        column += 'device_component_measurement_principle,';
        values += "'" + device_component_measurement_principle +"',";
      }

      if(typeof device_component_language_code !== 'undefined' && device_component_language_code !== ""){
        column += 'device_component_language_code,';
        values += "'" + device_component_language_code +"',";
      }

      if(typeof device_id !== 'undefined' && device_id !== ""){
        column += 'device_id,';
        values += "'" + device_id +"',";
      }

      if(typeof parent_id !== 'undefined' && parent_id !== ""){
        column += 'parent_id,';
        values += "'" + parent_id +"',";
      }

      var condition = "device_component_id = '" + device_component_id + "'";

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_COMPONENT(device_component_id," + column.slice(0, -1) + ") SELECT device_component_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DEVICE_COMPONENT WHERE " + condition;
      
      db.upsert(query,function(succes){
        res.json({"err_code": 0, "err_msg": "Device Component has been update."});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceComponent"});
      });
    },
    deviceComponentProductionSpecification: function updateDeviceComponentProductionSpecification(req, res){
      var apikey = req.params.apikey;

      var _id = req.params.id;
      var domainResource = req.params.dr;

      var device_component_production_specification_spec_type = req.body.spec_type;
      var device_component_production_specification_production_spec = req.body.production_spec;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof device_component_production_specification_spec_type !== 'undefined' && device_component_production_specification_spec_type !== ""){
        column += 'device_component_production_specification_spec_type,';
        values += "'" + device_component_production_specification_spec_type +"',";
      }

      if(typeof device_component_production_specification_production_spec !== 'undefined' && device_component_production_specification_production_spec !== ""){
        column += 'device_component_production_specification_production_spec,';
        values += "'" + device_component_production_specification_production_spec +"',";
      }

      if(domainResource !== "" && typeof domainResource !== 'undefined'){
        var arrResource = domainResource.split('|');
        var fieldResource = arrResource[0];
        var valueResource = arrResource[1];
        var condition = "device_component_production_specification_id = '" + _id + "' AND " + fieldResource +" = '"+ valueResource +"'";
      }else{
        var condition = "device_component_production_specification_id = '" + _id + "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_COMPONENT_PRODUCTION_SPECIFICATION(device_component_production_specification_id," + column.slice(0, -1) + ") SELECT device_component_production_specification_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DEVICE_COMPONENT_PRODUCTION_SPECIFICATION WHERE " + condition;
      
      db.upsert(query,function(succes){
        res.json({"err_code": 0, "err_msg": "Production specification has been update."});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceComponentProductionSpecification"});
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