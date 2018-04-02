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

// var phoenix = require("./phoenix.js");
var phoenix = require(path.resolve("./phoenix.js"));
// var db = new phoenix("jdbc:phoenix:" + host + ":/hbase-unsecure");
var db = new phoenix("jdbc:phoenix:" + "192.168.1.231" + ":/hbase-unsecure");

var controller = {
	get: {
    Location: function getLocation(req, res){
			console.log(req.query);
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      //params from query string
			var locationId = req.query._id;
			var locationName = req.query.name; 
			var locationAlias = req.query.alias; 
			var locationOperationalStatus = req.query.operationalStatus;
			var locationPartOf = req.query.Part_of;
			var locationStatus = req.query.status;
			var locationType = req.query.type; 
			var organizationId = req.query.organizationId;
			var locationPosition = req.query.locationPosition
			var locationAddress = req.query.address;
			var locationAddressCity = req.query.city;
			var locationAddressCountry = req.query.country;
			var locationAddressPostalCode = req.query.postal_code;
			var locationAddressState = req.query.state; //space encodeURI masih ada bug untuk sprintf
			var locationAddressUse = req.query.address_use; 
			var endpoint = req.query.endpoint;
			var identifier = req.query.identifier;
			
      //susun query
			var column= "";
      var condition = "";
      var join = "";

      if(typeof organizationId !== 'undefined' && organizationId !== ""){
        condition += "l.ORGANIZATION_ID = '" + organizationId + "' AND ";  
      }

      if(typeof locationId !== 'undefined' && locationId !== ""){
        condition += "l.location_id = '" + locationId + "' AND ";  
      }
			
			if(typeof locationName !== 'undefined' && locationName !== ""){
        condition += "location_name = '" + locationName + "' AND ";  
      }
			
			if(typeof locationAlias !== 'undefined' && locationAlias !== ""){
        condition += "location_alias = '" + locationAlias + "' AND ";  
      }
			
			if(typeof locationOperationalStatus !== 'undefined' && locationOperationalStatus !== ""){
        condition += "location_operational_status = '" + locationOperationalStatus + "' AND ";  
      }
			
			if(typeof locationPartOf !== 'undefined' && locationPartOf !== ""){
        condition += "parent_id = '" + locationPartOf + "' AND ";  
      }
			
			if(typeof locationStatus !== 'undefined' && locationStatus !== ""){
        condition += "location_status = '" + locationStatus + "' AND ";  
      }
			
			if(typeof locationType !== 'undefined' && locationType !== ""){
        condition += "location_type = '" + locationType + "' AND ";  
      }

      if((typeof locationAddress !== 'undefined' && locationAddress !== "")||(typeof locationAddressCity !== 'undefined' && locationAddressCity !== "")|| (typeof locationAddressCountry !== 'undefined' && locationAddressCountry !== "")|| (typeof locationAddressPostalCode !== 'undefined' && locationAddressPostalCode !== "")||(typeof locationAddressState !== 'undefined' && locationAddressState !== "")||(typeof locationAddressUseCode !== 'undefined' && locationAddressUseCode !== "")){
         //set join 
        join = " LEFT JOIN BACIRO_FHIR.ADDRESS addr ON addr.location_id = l.location_id ";
        
        if(typeof locationAddress !== 'undefined' && locationAddress !== ""){
          if(locationAddress.indexOf('nonbreaking_space') > 0){
            locationAddress = locationAddress.replace(/nonbreaking_space/g, " ");
          } 
          condition += "UPPER(address_text) LIKE '%" + locationAddress.toUpperCase() + "%' AND ";     
        }

        if(typeof locationAddressCity !== 'undefined' && locationAddressCity !== ""){
          if(locationAddressCity.indexOf('nonbreaking_space') > 0){
            locationAddressCity = locationAddressCity.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_city) = '" + locationAddressCity.toUpperCase() + "' AND ";  
        }

        if(typeof locationAddressCountry !== 'undefined' && locationAddressCountry !== ""){
          if(locationAddressCountry.indexOf('nonbreaking_space') > 0){
            locationAddressCountry = locationAddressCountry.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_country) = '" + locationAddressCountry.toUpperCase() + "' AND "; 
        }

        if(typeof locationAddressPostalCode !== 'undefined' && locationAddressPostalCode !== ""){
          condition += "address_postal_code = '" + locationAddressPostalCode + "' AND ";     
        }

        if(typeof locationAddressState !== 'undefined' && locationAddressState !== ""){
          if(locationAddressState.indexOf('nonbreaking_space') > 0){
            locationAddressState = locationAddressState.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_state) = '" + locationAddressState.toUpperCase() + "' AND "; 
        }

        if(typeof locationAddressUseCode !== 'undefined' && locationAddressUseCode !== ""){
          condition += "UPPER(address_use) = '" + locationAddressUseCode.toUpperCase() + "' AND ";     
        }
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
        condition += "i.identifier_id = '" + identifier + "' AND ";  
      }
			
			if(typeof endpoint !== 'undefined' && endpoint !== ""){
        condition += "ep.enpoint_id = '" + endpoint + "' AND ";  
      }
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
      
      var arrOrganization = [];
			
      var query = "select l.location_id as location_id, location_status, location_operational_status, location_name, location_alias, location_description, location_mode, location_type, address_id, location_physical_type, l.organization_id as organization_id, parent_id, location_position_id, i.identifier_id as identifier_id, ep.endpoint_id as endpoint_id from baciro_fhir.location l LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.organization_id = l.organization_id LEFT JOIN BACIRO_FHIR.ENDPOINT ep ON ep.location_id = l.location_id " + fixCondition;
			console.log(query);
			var arrLocation = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Location = {};
								
          Location.resourceType = "Location";
          Location.id = rez[i].location_id;
          Location.status = rez[i].location_status;
          Location.operationalStatus = rez[i].location_operational_status;
					Location.name = rez[i].location_name;
					Location.alias = rez[i].location_alias;
					Location.description = rez[i].location_description;
					Location.mode = rez[i].location_mode;
					Location.type = rez[i].location_type;
					Location.addressId = rez[i].address_id;
					Location.physicalType = rez[i].location_physical_type;
					Location.managingOrganization = rez[i].organization_id;
					Location.parent_id = rez[i].parent_id;
					Location.locationPosition = rez[i].location_position_id;
					Location.identifierId = rez[i].identifier_id;
					Location.endpointId = rez[i].endpoint_id;
					//Location.endpoint_id = rez[i].endpoint_id;
					
          arrLocation[i] = Location;
        }
        res.json({"err_code":0,"data": arrLocation});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getLocation"});
      });
    },
		LocationPosition: function getLocationPosition(req, res){
      var locationPositionId = req.query.locationPosition;
			
      //susun query
      var condition = "";
			
			if(typeof locationPositionId !== 'undefined' && locationPositionId !== ""){
        condition += "location_position_id = '" + locationPositionId + "' AND,";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
            
			var query = "select location_position_id,location_position_longitude,location_position_latitude,location_position_altitude from  baciro_fhir.location_position " + fixCondition;
      var arrLocation = [];
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Location = {};
								
          Location.id = rez[i].location_position_id;
          Location.longitude = rez[i].location_position_longitude;
          Location.latitude = rez[i].location_position_latitude;
					Location.altitude = rez[i].location_position_altitude;
					
					arrLocation[i] = Location;
        }
        res.json({"err_code":0,"data": arrLocation});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getLocationPosition"});
      });
    }
  },
  post: {
    location: function addLocation(req, res){
			var location_id = req.body.id;
			var location_status = req.body.status;
			var location_operational_status = req.body.operationalStatus;
      var location_name = req.body.name;
      var location_alias = req.body.alias;
			var location_description = req.body.description;
			var location_mode = req.body.mode;
      var location_type = req.body.type;
      var location_physicalType = req.body.physicalType;
			var location_organizationId = req.body.managingOrganization;
      var location_parentId = req.body.	parent_id;
			var addressId = req.body.addressId;
			var locationPositionId = req.body.locationPositionId;
			var locationEndpointId = req.body.locationEndpointId;
			
     
      var column= "";
			var values= "";
						
			if(typeof location_status !== 'undefined'){
        column += 'location_status,';
        values += "'" + location_status +"',";
      }
			
			if(typeof location_operational_status !== 'undefined'){
        column += 'location_operational_status,';
        values += "'" + location_operational_status +"',";
      }
			
			if(typeof location_name !== 'undefined'){
        column += 'location_name,';
        values += "'" + location_name +"',";
      }
			
			if(typeof location_alias !== 'undefined'){
        column += 'location_alias,';
        values += "'" + location_alias +"',";
      }
			
			if(typeof location_description !== 'undefined'){
        column += 'location_description,';
        values += "'" + location_description +"',";
      }
			
			if(typeof location_mode !== 'undefined'){
        column += 'location_mode,';
        values += "'" + location_mode +"',";
      }
			
			if(typeof location_type !== 'undefined'){
        column += 'location_type,';
        values += "'" + location_type +"',";
      }
			
			if(typeof location_physicalType !== 'undefined'){
        column += 'location_physical_type,';
        values += "'" + location_physicalType +"',";
      }
			
			if(typeof location_organizationId !== 'undefined'){
        column += 'ORGANIZATION_ID,';
        values += "'" + location_organizationId +"',";
      }
			
			if(typeof location_parentId !== 'undefined'){
        column += 'PARENT_ID,';
        values += "'" + location_parentId +"',";
      }
			
			if(typeof addressId !== 'undefined'){
        column += 'ADDRESS_ID,';
        values += "'" + addressId +"',";
      }
			
			if(typeof locationPositionId !== 'undefined'){
        column += 'LOCATION_POSITION_ID,';
        values += "'" + locationPositionId +"',";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.LOCATION(LOCATION_ID, " + column.slice(0, -1) + ")"+ " VALUES ('"+location_id+"', " + values.slice(0, -1) + ")";
			db.upsert(query,function(succes){
        var query2 = "UPSERT INTO BACIRO_FHIR.ENDPOINT(ENDPOINT_ID, LOCATION_ID) SELECT ENDPOINT_ID, '" + location_id + "' FROM BACIRO_FHIR.ENDPOINT WHERE ENDPOINT_ID = '" + locationEndpointId + "'";
        db.upsert(query2,function(dataJson){
					var query3 = "SELECT LOCATION_ID,LOCATION_STATUS,LOCATION_OPERATIONAL_STATUS,LOCATION_NAME,LOCATION_ALIAS,LOCATION_DESCRIPTION,LOCATION_MODE,LOCATION_TYPE,ADDRESS_ID,LOCATION_PHYSICAL_TYPE,ORGANIZATION_ID,PARENT_ID,LOCATION_POSITION_ID FROM BACIRO_FHIR.LOCATION WHERE LOCATION_ID = '" + location_id + "' ";
					db.query(query3,function(dataJson){
						rez = lowercaseObject(dataJson);
						res.json({"err_code":0,"data":rez});
					},function(e){
						res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addLocation"});
					});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addLocation"});
        });
      },function(e){
          res.json({"err_code": 3, "err_msg":e, "application": "Api Phoenix", "function": "addLocation"});
      });
    },
		locationPosition: function addLocationPosition(req, res){
      var locationPositionId = req.body.id;
      var longitude = req.body.longitude;
      var latitude = req.body.latitude;
      var altitude = req.body.altitude;
      var column= "";
			var values= "";
						
			if(typeof longitude !== 'undefined'){
        column += 'LOCATION_POSITION_LONGITUDE,';
        values += "" + longitude +",";
      }
			
			if(typeof latitude !== 'undefined'){
        column += 'LOCATION_POSITION_LATITUDE,';
        values += "" + latitude +",";
      }
			
			if(typeof altitude !== 'undefined'){
        column += 'LOCATION_POSITION_ALTITUDE,';
        values += "" + altitude +",";
      }
			
      var query = "UPSERT INTO BACIRO_FHIR.LOCATION_POSITION(LOCATION_POSITION_ID, " + column.slice(0, -1) + ")"+ " VALUES ('"+locationPositionId+"', " + values.slice(0, -1) + ")";
			db.upsert(query,function(succes){
        var query2 = "SELECT LOCATION_POSITION_ID,LOCATION_POSITION_LONGITUDE,LOCATION_POSITION_LATITUDE,LOCATION_POSITION_ALTITUDE FROM BACIRO_FHIR.LOCATION_POSITION WHERE LOCATION_POSITION_ID = '" + locationPositionId + "' ";
        db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
					res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addLocationPosition"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addLocationPosition"});
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