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
    device: function getDevice(req, res){
      var apikey = req.params.apikey;
      
      var deviceId = req.query._id;
      var deviceName = req.query.device_name;
      var deviceLocation = req.query.location;
      var deviceManufacturer = req.query.manufacturer;
      var deviceModel = req.query.model;
      var deviceOwner = req.query.organization;
      var devicePatient = req.query.patient;
      var deviceStatus = req.query.status;
      var deviceType = req.query.type;
      var deviceUdiCarrier = req.query.udi_carrier;
      var deviceUdiIdentifier = req.query.udi_di;
         
      //susun query
      var condition = "";
      var join = "";

      if(typeof deviceId !== 'undefined' && deviceId !== ""){
        condition += "d.device_id = '" + deviceId + "' AND ";  
      }

      if(typeof deviceName !== 'undefined' && deviceName !== "" || typeof deviceUdiCarrier !== 'undefined' && deviceUdiCarrier !== "" || typeof deviceUdiIdentifier !== 'undefined' && deviceUdiIdentifier !== ""){
        join = " LEFT JOIN BACIRO_FHIR.DEVICE_UDI du ON d.device_udi_id = du.device_udi_id ";

        if(typeof deviceName !== 'undefined' && deviceName !== ""){
          if(deviceName.indexOf('nonbreaking_space') > 0){
            deviceName = deviceName.replace(/nonbreaking_space/g, " ");
          }
          condition += "(du.device_udi_name = '" + deviceName + "' OR d.device_type = '" + deviceName +  "') AND ";    
        }

        if(typeof deviceUdiCarrier !== 'undefined' && deviceUdiCarrier !== ""){
          if(deviceUdiCarrier.indexOf('nonbreaking_space') > 0){
            deviceUdiCarrier = deviceUdiCarrier.replace(/nonbreaking_space/g, " ");
          }
          condition += "(du.device_udi_carrier_hrf = '" + deviceUdiCarrier + "' OR du.device_udi_carrier_aidc = '" + deviceUdiCarrier +  "') AND ";    
        }

        if(typeof deviceUdiIdentifier !== 'undefined' && deviceUdiIdentifier !== ""){
          condition += "du.device_udi_id = '" + deviceUdiIdentifier + "' AND ";    
        }
      }

      if(typeof deviceLocation !== 'undefined' && deviceLocation !== ""){
        condition += "d.location_id = '" + deviceLocation + "' AND ";  
      }

      if(typeof deviceManufacturer !== 'undefined' && deviceManufacturer !== ""){
        if(deviceManufacturer.indexOf('nonbreaking_space') > 0){
            deviceManufacturer = deviceManufacturer.replace(/nonbreaking_space/g, " ");
          }
        condition += "d.device_manufacturer = '" + deviceManufacturer + "' AND ";  
      }

      if(typeof deviceModel !== 'undefined' && deviceModel !== ""){
        if(deviceModel.indexOf('nonbreaking_space') > 0){
            deviceModel = deviceModel.replace(/nonbreaking_space/g, " ");
          }
        condition += "d.device_model = '" + deviceModel + "' AND ";  
      }

      if(typeof deviceOwner !== 'undefined' && deviceOwner !== ""){
        condition += "d.organization_id = '" + deviceOwner + "' AND ";  
      }

      if(typeof devicePatient !== 'undefined' && devicePatient !== ""){
        condition += "d.patient_id = '" + devicePatient + "' AND ";  
      }

      if(typeof deviceStatus !== 'undefined' && deviceStatus !== ""){
        condition += "d.device_status = '" + deviceStatus + "' AND ";  
      }

      if(typeof deviceType !== 'undefined' && deviceType !== ""){
        condition += "d.device_type = '" + deviceType + "' AND ";  
      }
      
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

      var arrDevice = [];
      var query = "SELECT device_id, device_status, device_type, device_lot_number, device_manufacturer, device_manufacture_date, device_expiration_date, device_model, device_version, device_url, device_note, device_safety, patient_id, organization_id, location_id, d.device_udi_id as device_udi_id FROM BACIRO_FHIR.DEVICE d " + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Device = {};
          Device.resourceType = "Device";
          Device.id = rez[i].device_id;
          Device.status = rez[i].device_status;
          Device.type = rez[i].device_type;
          Device.lotNumber = rez[i].device_lot_number;
          Device.manufacturer = rez[i].device_manufacturer;
          Device.manufacturerDate = rez[i].device_manufacture_date;
          Device.expirationDate = rez[i].device_expiration_date;
          Device.model = rez[i].device_model;
          Device.version = rez[i].device_version;
          Device.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +   rez[i].patient_id;
          Device.owner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +   rez[i].organization_id;
          Device.location = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +   rez[i].location_id;
          Device.url = rez[i].device_url;
          Device.note = rez[i].device_note;
          Device.safety = rez[i].device_safety;
          Device.udiId = rez[i].device_udi_id;

          arrDevice[i] = Device;
        }
        res.json({"err_code":0,"data":arrDevice});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getDevice"});
      });
    },
    deviceUdi: function getDevice(req, res){
      var apikey = req.params.apikey;  
      var deviceUdiId = req.query._id;
    
      //susun query
      var condition = "";
      var join = "";

      if(typeof deviceUdiId !== 'undefined' && deviceUdiId !== ""){
        condition += "device_udi_id = '" + deviceUdiId + "' AND ";  
      }
      
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

      var arrDeviceUdi = [];
      var query = "SELECT device_udi_id, device_udi_name, device_udi_jurisdiction, device_udi_carrier_hrf, device_udi_carrier_aidc, device_udi_issuer, device_udi_entry_type FROM BACIRO_FHIR.DEVICE_UDI " + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var DeviceUdi = {};
          DeviceUdi.id = rez[i].device_udi_id;
          DeviceUdi.name = rez[i].device_udi_name;
          DeviceUdi.jurisdiction = rez[i].device_udi_jurisdiction;
          DeviceUdi.carrierHRF = rez[i].device_udi_carrier_hrf;
          DeviceUdi.carrierAIDC = rez[i].device_udi_carrier_aidc;
          DeviceUdi.issuer = rez[i].device_udi_issuer;
          DeviceUdi.entryType = rez[i].device_udi_entry_type;

          arrDeviceUdi[i] = DeviceUdi;
        }
        res.json({"err_code":0,"data":arrDeviceUdi});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getDeviceUdi"});
      });
    }
  },
  post: {
    device: function addDevice(req, res){
      var apikey = req.params.apikey;

      var device_id = req.body.id;
      var device_status = req.body.status;
      var device_type = req.body.type;
      var device_lot_number = req.body.lot_number;
      var device_manufacturer = req.body.manufacturer;
      var device_manufacture_date = req.body.manufacture_date;
      var device_expiration_date = req.body.expiration_date;
      var device_model = req.body.model;
      var device_version = req.body.version;
      var device_url = req.body.url;
      var device_note = req.body.note;
      var device_safety = req.body.safety;
      var patient_id = req.body.patient_id;
      var organization_id = req.body.organization_id;
      var location_id = req.body.location_id;
      var device_udi_id = req.body.udi_id;
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof device_id !== 'undefined' && device_id !== ""){
        column += 'device_id,';
        values += "'" + device_id +"',";
      }

      if(typeof device_status !== 'undefined' && device_status !== ""){
        column += 'device_status,';
        values += "'" + device_status +"',";
      }

      if(typeof device_type !== 'undefined' && device_type !== ""){
        column += 'device_type,';
        values += "'" + device_type +"',";
      }

      if(typeof device_lot_number !== 'undefined' && device_lot_number !== ""){
        column += 'device_lot_number,';
        values += "'" + device_lot_number +"',";
      }

      if(typeof device_manufacturer !== 'undefined' && device_manufacturer !== ""){
        column += 'device_manufacturer,';
        values += "'" + device_manufacturer +"',";
      }

      if(typeof device_manufacture_date !== 'undefined' && device_manufacture_date !== ""){
        column += 'device_manufacture_date,';
        values += "to_date('" + device_manufacture_date +"', 'yyyy-MM-dd'),";
      }

      if(typeof device_expiration_date !== 'undefined' && device_expiration_date !== ""){
        column += 'device_expiration_date,';
        values += "to_date('" + device_expiration_date +"', 'yyyy-MM-dd'),";
      }

      if(typeof device_model !== 'undefined' && device_model !== ""){
        column += 'device_model,';
        values += "'" + device_model +"',";
      }
      
      if(typeof device_version !== 'undefined' && device_version !== ""){
        column += 'device_version,';
        values += "'" + device_version +"',";
      }

      if(typeof device_url !== 'undefined' && device_url !== ""){
        column += 'device_url,';
        values += "'" + device_url +"',";
      }

      if(typeof device_note !== 'undefined' && device_note !== ""){
        column += 'device_note,';
        values += "'" + device_note +"',";
      }

      if(typeof device_safety !== 'undefined' && device_safety !== ""){
        column += 'device_safety,';
        values += "'" + device_safety +"',";
      }

      if(typeof patient_id !== 'undefined' && patient_id !== ""){
        column += 'patient_id,';
        values += "'" + patient_id +"',";
      }

      if(typeof organization_id !== 'undefined' && organization_id !== ""){
        column += 'organization_id,';
        values += "'" + organization_id +"',";
      }

      if(typeof location_id !== 'undefined' && location_id !== ""){
        column += 'location_id,';
        values += "'" + location_id +"',";
      }

      if(typeof device_udi_id !== 'undefined' && device_udi_id !== ""){
        column += 'device_udi_id,';
        values += "'" + device_udi_id +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.DEVICE(" + column.slice(0, -1) + ")"+
        " VALUES ("+ values.slice(0, -1) +")";
      
      db.upsert(query,function(succes){
        res.json({"err_code":0, "err_msg": "Device has been add."});
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDevice"});
      });
    },
    deviceUdi: function addDeviceUdi(req, res){
      var apikey = req.params.apikey;

      var device_udi_id = req.body.id;
      var device_udi_name = req.body.name;
      var device_udi_jurisdiction = req.body.jurisdiction;
      var device_udi_carrier_hrf = req.body.carrier_hrf;
      var device_udi_carrier_aidc = req.body.carrier_aidc;
      var device_udi_issuer = req.body.issuer;
      var device_udi_entry_type = req.body.entry_type;
      
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof device_udi_id !== 'undefined' && device_udi_id !== ""){
        column += 'device_udi_id,';
        values += "'" + device_udi_id +"',";
      }

      if(typeof device_udi_name !== 'undefined' && device_udi_name !== ""){
        column += 'device_udi_name,';
        values += "'" + device_udi_name +"',";
      }

      if(typeof device_udi_jurisdiction !== 'undefined' && device_udi_jurisdiction !== ""){
        column += 'device_udi_jurisdiction,';
        values += "'" + device_udi_jurisdiction +"',";
      }

      if(typeof device_udi_carrier_hrf !== 'undefined' && device_udi_carrier_hrf !== ""){
        column += 'device_udi_carrier_hrf,';
        values += "'" + device_udi_carrier_hrf +"',";
      }

      if(typeof device_udi_carrier_aidc !== 'undefined' && device_udi_carrier_aidc !== ""){
        column += 'device_udi_carrier_aidc,';
        values += "'" + device_udi_carrier_aidc +"',";
      }

      if(typeof device_udi_issuer !== 'undefined' && device_udi_issuer !== ""){
        column += 'device_udi_issuer,';
        values += "'" + device_udi_issuer +"',";
      }
      
      if(typeof device_udi_entry_type !== 'undefined' && device_udi_entry_type !== ""){
        column += 'device_udi_entry_type,';
        values += "'" + device_udi_entry_type +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_UDI(" + column.slice(0, -1) + ")"+
        " VALUES ("+ values.slice(0, -1) +")";
      
      db.upsert(query,function(succes){
        res.json({"err_code":0, "err_msg": "Device Udi has been add."});
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addDeviceUdi"});
      });
    }
  },
  put: {
    device: function updateDevice(req, res){
      var apikey = req.params.apikey;

      var device_id = req.params.device_id;

      var device_status = req.body.status;
      var device_type = req.body.type;
      var device_lot_number = req.body.lot_number;
      var device_manufacturer = req.body.manufacturer;
      var device_manufacture_date = req.body.manufacture_date;
      var device_expiration_date = req.body.expiration_date;
      var device_model = req.body.model;
      var device_version = req.body.version;
      var device_url = req.body.url;
      var device_note = req.body.note;
      var device_safety = req.body.safety;
      var patient_id = req.body.patient_id;
      var organization_id = req.body.organization_id;
      var location_id = req.body.location_id;
      var device_udi_id = req.body.udi_id;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof device_status !== 'undefined' && device_status !== ""){
        column += 'device_status,';
        values += "'" + device_status +"',";
      }

      if(typeof device_type !== 'undefined' && device_type !== ""){
        column += 'device_type,';
        values += "'" + device_type +"',";
      }

      if(typeof device_lot_number !== 'undefined' && device_lot_number !== ""){
        column += 'device_lot_number,';
        values += "'" + device_lot_number +"',";
      }

      if(typeof device_manufacturer !== 'undefined' && device_manufacturer !== ""){
        column += 'device_manufacturer,';
        values += "'" + device_manufacturer +"',";
      }

      if(typeof device_manufacture_date !== 'undefined' && device_manufacture_date !== ""){
        column += 'device_manufacture_date,';
        values += "to_date('" + device_manufacture_date +"', 'yyyy-MM-dd'),";
      }

      if(typeof device_expiration_date !== 'undefined' && device_expiration_date !== ""){
        column += 'device_expiration_date,';
        values += "to_date('" + device_expiration_date +"', 'yyyy-MM-dd'),";
      }

      if(typeof device_model !== 'undefined' && device_model !== ""){
        column += 'device_model,';
        values += "'" + device_model +"',";
      }
      
      if(typeof device_version !== 'undefined' && device_version !== ""){
        column += 'device_version,';
        values += "'" + device_version +"',";
      }

      if(typeof device_url !== 'undefined' && device_url !== ""){
        column += 'device_url,';
        values += "'" + device_url +"',";
      }

      if(typeof device_note !== 'undefined' && device_note !== ""){
        column += 'device_note,';
        values += "'" + device_note +"',";
      }

      if(typeof device_safety !== 'undefined' && device_safety !== ""){
        column += 'device_safety,';
        values += "'" + device_safety +"',";
      }

      if(typeof patient_id !== 'undefined' && patient_id !== ""){
        column += 'patient_id,';
        values += "'" + patient_id +"',";
      }

      if(typeof organization_id !== 'undefined' && organization_id !== ""){
        column += 'organization_id,';
        values += "'" + organization_id +"',";
      }

      if(typeof location_id !== 'undefined' && location_id !== ""){
        column += 'location_id,';
        values += "'" + location_id +"',";
      }

      var condition = "device_id = '" + device_id + "'";

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE(device_id," + column.slice(0, -1) + ") SELECT device_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DEVICE WHERE " + condition;
      
      db.upsert(query,function(succes){
        res.json({"err_code": 0, "err_msg": "Device has been update."});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDevice"});
      });
    },
    deviceUdi: function updateDeviceUdi(req, res){
      var apikey = req.params.apikey;

      var device_udi_id = req.params.udi_id;

      var device_udi_name = req.body.name;
      var device_udi_jurisdiction = req.body.jurisdiction;
      var device_udi_carrier_hrf = req.body.carrier_hrf;
      var device_udi_carrier_aidc = req.body.carrier_aidc;
      var device_udi_issuer = req.body.issuer;
      var device_udi_entry_type = req.body.entry_type;
      
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof device_udi_name !== 'undefined' && device_udi_name !== ""){
        column += 'device_udi_name,';
        values += "'" + device_udi_name +"',";
      }

      if(typeof device_udi_jurisdiction !== 'undefined' && device_udi_jurisdiction !== ""){
        column += 'device_udi_jurisdiction,';
        values += "'" + device_udi_jurisdiction +"',";
      }

      if(typeof device_udi_carrier_hrf !== 'undefined' && device_udi_carrier_hrf !== ""){
        column += 'device_udi_carrier_hrf,';
        values += "'" + device_udi_carrier_hrf +"',";
      }

      if(typeof device_udi_carrier_aidc !== 'undefined' && device_udi_carrier_aidc !== ""){
        column += 'device_udi_carrier_aidc,';
        values += "'" + device_udi_carrier_aidc +"',";
      }

      if(typeof device_udi_issuer !== 'undefined' && device_udi_issuer !== ""){
        column += 'device_udi_issuer,';
        values += "'" + device_udi_issuer +"',";
      }
      
      if(typeof device_udi_entry_type !== 'undefined' && device_udi_entry_type !== ""){
        column += 'device_udi_entry_type,';
        values += "'" + device_udi_entry_type +"',";
      }

      var condition = "device_udi_id = '" + device_udi_id + "'";

      var query = "UPSERT INTO BACIRO_FHIR.DEVICE_UDI(device_udi_id," + column.slice(0, -1) + ") SELECT device_udi_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.DEVICE_UDI WHERE " + condition;
      
      db.upsert(query,function(succes){
        res.json({"err_code": 0, "err_msg": "Device Udi has been update."});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateDeviceUdi"});
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