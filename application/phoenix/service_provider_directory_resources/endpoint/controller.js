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
		endpoint: function getEndpoint(req, res){
			var endpointId = req.query._id;
      var organizationId = req.query.organizationId;
			var endpoint_connection_type = req.query.endpoint_connection_type;
			var identifier = req.query.identifier;
			var name = req.query.name;
			var endpoint_payload_type = req.query.endpoint_payload_type;
			var status = req.query.status;
			var LocationId = req.query.location_id;
      //susun query
      var condition = "";
			
			if(typeof endpointId !== 'undefined' && endpointId !== ""){
        condition += "ep.endpoint_id = '" + endpointId + "' AND,";  
      }
			
			if(typeof endpoint_connection_type !== 'undefined' && endpoint_connection_type !== ""){
        condition += "ep.endpoint_connection_type = '" + endpoint_connection_type + "' AND,";  
      }
			
			if(typeof organizationId !== 'undefined' && organizationId !== ""){
        condition += "ep.organization_id = '" + organizationId + "' AND,";  
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
        join += "LEFT JOIN BACIRO_FHIR.IDENTIFIER id ON id.endpoint_id = ep.endpoint_id ";  
				if(typeof identifier !== 'undefined' && identifier !== ""){
          condition += "identifier_value = '" + identifier + "' AND ";       
        }
      }
			
			if(typeof name !== 'undefined' && name !== ""){
        condition += "ep.endpoint_name = '" + name + "' AND,";  
      }
			
			if(typeof endpoint_payload_type !== 'undefined' && endpoint_payload_type !== ""){
        condition += "ep.endpoint_payload_type = '" + endpoint_payload_type + "' AND,";  
      }
			
			if(typeof status !== 'undefined' && status !== ""){
        condition += "ep.endpoint_status = '" + status + "' AND,";  
      }
			
			if(typeof LocationId !== 'undefined' && LocationId !== ""){
        condition += "ep.location_id = '" + LocationId + "' AND,";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrEndpoint = [];
      var query = "SELECT ep.endpoint_id as endpoint_id, endpoint_status, endpoint_connection_type, endpoint_name, endpoint_managing_organization, endpoint_period_start, endpoint_period_end, endpoint_payload_type, endpoint_payload_mime_type, endpoint_address, endpoint_header, ep.organization_id as organization_id, ep.location_id as location_id, ep.practitioner_role_id as practitioner_role_id, ep.healthcare_service_id as healthcare_service_id FROM BACIRO_FHIR.ENDPOINT ep LEFT JOIN BACIRO_FHIR.IDENTIFIER id ON id.endpoint_id = ep.endpoint_id " + fixCondition;
      console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Endpoint = {};
					Endpoint.resourceType = "Endpoint";
          Endpoint.id = rez[i].endpoint_id;
          Endpoint.status = rez[i].endpoint_status;
					Endpoint.connectionType = rez[i].endpoint_connection_type;
					Endpoint.name = rez[i].endpoint_name;
					//Endpoint.managingOrganization = rez[i].endpoint_managing_organization;
					Endpoint.managingOrganization = rez[i].organization_id;
					Endpoint.perito = rez[i].endpoint_period_start + " to " + rez[i].endpoint_period_end;
					Endpoint.payloadType = rez[i].endpoint_payload_type;
					Endpoint.payloadMimeType = rez[i].endpoint_payload_mime_type;
					Endpoint.address = rez[i].endpoint_address;
					Endpoint.header = rez[i].endpoint_header;	
          arrEndpoint[i] = Endpoint;
        }
        res.json({"err_code":0,"data": arrEndpoint});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getEndpoint"});
      });
    }
  },
  post: {
    endpoint: function addEndpoint(req, res){
			console.log(req);
			var endpoint_id = req.body.id;
			var endpoint_status = req.body.status;
			var endpoint_connection_type = req.body.connectionType;
			var endpoint_name = req.body.name;
			var endpoint_managing_organization = req.body.managingOrganization;
			var endpoint_period_start = req.body.period_start;
			var endpoint_period_end = req.body.period_end;
			var endpoint_payload_type = req.body.payloadType;
			var endpoint_payload_mime_type = req.body.payloadMimeType;
			var endpoint_address = req.body.address;
			var endpoint_header = req.body.header;
			var organization_id = req.body.managingOrganization;
			var column = "";
      var values = "";
			
			if(typeof endpoint_status !== 'undefined'){
        column += 'endpoint_status,';
        values += "'" + endpoint_status +"',";
      }
			
			if(typeof endpoint_connection_type !== 'undefined'){
        column += 'endpoint_connection_type,';
        values += "'" + endpoint_connection_type +"',";
      }
			
			if(typeof endpoint_name !== 'undefined'){
        column += 'endpoint_name,';
        values += "'" + endpoint_name +"',";
      }
			
			if(typeof endpoint_managing_organization !== 'undefined'){
        column += 'endpoint_managing_organization,';
        values += "'" + endpoint_managing_organization +"',";
      }
     
      if(typeof endpoint_period_start !== 'undefined'){
        if(endpoint_period_start == ""){
          endpoint_period_start = null;
        }else{
          endpoint_period_start = "to_date('"+endpoint_period_start+ "', 'yyyy-MM-dd')";
        }

        column += 'endpoint_period_start,';
        values += endpoint_period_start + ",";
      }

      if(typeof endpoint_period_end !== 'undefined'){
        if(endpoint_period_end == ""){
          endpoint_period_end = null;
        }else{
          endpoint_period_end = "to_date('"+endpoint_period_end+ "', 'yyyy-MM-dd')";
        }

        column += 'endpoint_period_end,';
        values += endpoint_period_end + ",";
      }
			
			if(typeof endpoint_payload_type !== 'undefined'){
        column += 'endpoint_payload_type,';
        values += "'" + endpoint_payload_type +"',";
      }
			
			if(typeof endpoint_payload_mime_type !== 'undefined'){
        column += 'endpoint_payload_mime_type,';
        values += "'" + endpoint_payload_mime_type +"',";
      }
			
			if(typeof endpoint_address !== 'undefined'){
        column += 'endpoint_address,';
        values += "'" + endpoint_address +"',";
      }
			
			if(typeof endpoint_header !== 'undefined'){
        column += 'endpoint_header,';
        values += "'" + endpoint_header +"',";
      }
			
			if(typeof organization_id !== 'undefined'){
        column += 'organization_id,';
        values += "'" + organization_id +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.ENDPOINT(ENDPOINT_ID, " + column.slice(0, -1) + ")"+
        " VALUES ('"+endpoint_id+"', " + values.slice(0, -1) + ")";
			console.log(query);
      db.upsert(query,function(succes){
        var query = "SELECT ep.endpoint_id as endpoint_id, endpoint_status, endpoint_connection_type, endpoint_name, endpoint_managing_organization, endpoint_period_start, endpoint_period_end, endpoint_payload_type, endpoint_payload_mime_type, endpoint_address, endpoint_header, ep.organization_id as organization_id, ep.location_id as location_id, ep.practitioner_role_id as practitioner_role_id, ep.healthcare_service_id as healthcare_service_id FROM BACIRO_FHIR.ENDPOINT ep WHERE endpoint_id = '" + endpoint_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addEndpoint"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addEndpoint"});
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