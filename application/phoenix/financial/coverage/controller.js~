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
		bodysite: function getBodysite(req, res){
			var apikey = req.params.apikey;
			var bodysiteId = req.query._id;
			var code = req.query.code;
			var identifier = req.query.identifier;
			var patient = req.query.patient;
			
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof bodysiteId !== 'undefined' && bodysiteId !== ""){
        condition += "bd.body_site_id = '" + bodysiteId + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
				condition += "bd.code = '" + code + "' AND,";  
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.body_site_id = bd.body_site_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
			  condition += "bd.patient_id = '" + patient + "' AND,";  
      }
			
			var offset = req.query.offset;
			var limit = req.query.limit;

			if((typeof offset !== 'undefined' && offset !== '')){
				condition = " bd.body_site_id > '" + offset + "' AND ";       
			}
			
			if((typeof limit !== 'undefined' && limit !== '')){
				limit = " limit " + limit + " ";
			} else {
				limit = " ";
			}
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

      var arrBodysite = [];
      var query = "select bd.body_site_id as body_site_id, bd.bodysite_active as bodysite_active, bd.code as code, bd.qualifier as qualifier, bd.description as description, bd.patient_id as patient_id from BACIRO_FHIR.bodysite bd " + fixCondition + limit;
			console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Bodysite = {};
					Bodysite.resourceType = "Bodysite";
          Bodysite.id = rez[i].body_site_id;
					Bodysite.bodysite_active = rez[i].bodysite_active;
					Bodysite.code = rez[i].code;
					Bodysite.qualifier = rez[i].qualifier;
					Bodysite.issued = rez[i].issued;
					Bodysite.description = rez[i].description;
					if(rez[i].patient_id != "null"){
						Bodysite.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient_id;
					} else {
						Bodysite.patient = "";
					}
					
          arrBodysite[i] = Bodysite;
        }
        res.json({"err_code":0,"data": arrBodysite});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getBodysite"});
      });
    }
  },
	post: {
		bodysite: function addBodysite(req, res) {
			console.log(req.body);
			var body_site_id  = req.body.bodysite_id;
			var bodysite_active  = req.body.bodysite_active;
			var code  = req.body.code;
			var qualifier  = req.body.qualifier;
			var description  = req.body.description;
			var patient_id  = req.body.patient_id;
			
			var column = "";
      var values = "";
			
			if (typeof bodysite_active !== 'undefined' && bodysite_active !== "") {
        column += 'bodysite_active,';
        values += " " + bodysite_active + ",";
      }
			
			if (typeof qualifier !== 'undefined' && qualifier !== "") {
        column += 'qualifier,';
        values += "'" + qualifier + "',";
      }	
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }	
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof patient_id !== 'undefined' && patient_id !== "") {
        column += 'patient_id,';
        values += "'" + patient_id + "',";
      }		
			
			
      var query = "UPSERT INTO BACIRO_FHIR.bodysite(body_site_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+body_site_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select body_site_id from BACIRO_FHIR.bodysite WHERE body_site_id = '" + body_site_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addBodysite"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addBodysite"});
      });
    }
	},
	put: {
		bodysite: function updateBodysite(req, res) {
			console.log(req.body);
			var body_site_id  = req.params._id;
			var bodysite_active  = req.body.bodysite_active;
			var code  = req.body.code;
			var qualifier  = req.body.qualifier;
			var description  = req.body.description;
			var patient_id  = req.body.patient_id;
			
			var column = "";
      var values = "";
			
			if (typeof bodysite_active !== 'undefined' && bodysite_active !== "") {
        column += 'bodysite_active,';
        values += " " + bodysite_active + ",";
      }
			
			if (typeof qualifier !== 'undefined' && qualifier !== "") {
        column += 'qualifier,';
        values += "'" + qualifier + "',";
      }	
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }	
			
			if (typeof description !== 'undefined' && description !== "") {
        column += 'description,';
        values += "'" + description + "',";
      }	
			
			if (typeof patient_id !== 'undefined' && patient_id !== "") {
        column += 'patient_id,';
        values += "'" + patient_id + "',";
      }		
							
			 var domainResource = req.params.dr;
			if(domainResource !== "" && typeof domainResource !== 'undefined'){
				var arrResource = domainResource.split('|');
				var fieldResource = arrResource[0];
				var valueResource = arrResource[1];
				var condition = "body_site_id = '" + body_site_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			}else{
        var condition = "body_site_id = '" + body_site_id + "'";
      }
			

      var query = "UPSERT INTO BACIRO_FHIR.bodysite(body_site_id," + column.slice(0, -1) + ") SELECT body_site_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.bodysite WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select body_site_id from BACIRO_FHIR.bodysite WHERE body_site_id = '" + body_site_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateBodysite"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateBodysite"});
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