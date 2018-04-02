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
var hostfhir = configYaml.fhir.host;
var portfhir = configYaml.fhir.port;

// var phoenix = require("./phoenix.js");
var phoenix = require(path.resolve("./phoenix.js"));
// var db = new phoenix("jdbc:phoenix:" + host + ":/hbase-unsecure");
var db = new phoenix("jdbc:phoenix:" + "192.168.1.231" + ":/hbase-unsecure");

var controller = {
	get: {
		practitioner: function getPractitioner(req, res){
			var practitionerId = req.query._id;
      var practitioner_active = req.query.active;
			var practitioner_gender = req.query.gender;
			var addressId = req.query.address;
			var addressCity = req.query.city;
			var addressCountry = req.query.country;
			var addressPostalcode = req.query.postalcode;
			var addressState = req.query.state;
			var addressUse = req.query.addressUse;
			var practitioner_communication = req.query.practitioner_communication;
			var human_name_family = req.query.human_name_family;
			var human_name_given = req.query.human_name_given;
			var human_name = req.query.human_name;
			var identifier = req.query.identifier_value;
			var contactPointValue = req.query.contact_point_value;
			
			
      //susun query
      var condition = "";
			var join = "";
			
			if(typeof practitionerId !== 'undefined' && practitionerId !== ""){
        condition += "p.practitioner_id = '" + practitionerId + "' AND,";  
      }
			
			if(typeof practitioner_active !== 'undefined' && practitioner_active !== ""){
        condition += "p.practitioner_active = '" + practitioner_active + "' AND,";  
      }
			
			if(typeof practitioner_gender !== 'undefined' && practitioner_gender !== ""){
        condition += "p.practitioner_gender = '" + practitioner_gender + "' AND,";  
      }
			
			if((typeof practitionerAddress !== 'undefined' && practitionerAddress !== "")||(typeof practitionerAddressCity !== 'undefined' && practitionerAddressCity !== "")|| (typeof practitionerAddressCountry !== 'undefined' && practitionerAddressCountry !== "")|| (typeof practitionerAddressPostalCode !== 'undefined' && practitionerAddressPostalCode !== "")||(typeof practitionerAddressState !== 'undefined' && practitionerAddressState !== "")||(typeof practitionerAddressUseCode !== 'undefined' && practitionerAddressUseCode !== "")){
         //set join 
        join = " LEFT JOIN BACIRO_FHIR.ADDRESS addr ON addr.practitioner_id = p.practitioner_id ";
        
        if(typeof practitionerAddress !== 'undefined' && practitionerAddress !== ""){
          if(practitionerAddress.indexOf('nonbreaking_space') > 0){
            practitionerAddress = practitionerAddress.replace(/nonbreaking_space/g, " ");
          } 
          condition += "UPPER(address_text) LIKE '%" + practitionerAddress.toUpperCase() + "%' AND ";     
        }

        if(typeof practitionerAddressCity !== 'undefined' && practitionerAddressCity !== ""){
          if(practitionerAddressCity.indexOf('nonbreaking_space') > 0){
            practitionerAddressCity = practitionerAddressCity.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_city) = '" + practitionerAddressCity.toUpperCase() + "' AND ";  
        }

        if(typeof practitionerAddressCountry !== 'undefined' && practitionerAddressCountry !== ""){
          if(practitionerAddressCountry.indexOf('nonbreaking_space') > 0){
            practitionerAddressCountry = practitionerAddressCountry.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_country) = '" + practitionerAddressCountry.toUpperCase() + "' AND "; 
        }

        if(typeof practitionerAddressPostalCode !== 'undefined' && practitionerAddressPostalCode !== ""){
          condition += "address_postal_code = '" + practitionerAddressPostalCode + "' AND ";     
        }

        if(typeof practitionerAddressState !== 'undefined' && practitionerAddressState !== ""){
          if(practitionerAddressState.indexOf('nonbreaking_space') > 0){
            practitionerAddressState = practitionerAddressState.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_state) = '" + practitionerAddressState.toUpperCase() + "' AND "; 
        }

        if(typeof practitionerAddressUseCode !== 'undefined' && practitionerAddressUseCode !== ""){
          condition += "UPPER(address_use) = '" + practitionerAddressUseCode.toUpperCase() + "' AND ";     
        }
      }
			
			if(typeof identifier !== 'undefined' && identifier !== ""){
        join += "LEFT JOIN BACIRO_FHIR.IDENTIFIER id ON id.PRACTITIONER_ID = p.PRACTITIONER_ID ";  
				if(typeof identifier !== 'undefined' && identifier !== ""){
          condition += "identifier_value = '" + identifier + "' AND ";       
        }
      }
			
			if(typeof practitioner_communication !== 'undefined' && practitioner_communication !== ""){
        condition += "pc.practitioner_communication_id = '" + practitioner_communication + "' AND,";  
      }
			
			if(typeof human_name_family !== 'undefined' && human_name_family !== ""){
        condition += "hn.human_name_family = '" + human_name_family + "' AND,";  
      }
			
			if(typeof human_name_given !== 'undefined' && human_name_given !== ""){
        condition += "hn.human_name_given = '" + human_name_given + "' AND,";  
      }
			
			if(typeof human_name !== 'undefined' && human_name !== ""){
        condition += "hn.human_name_id = '" + human_name + "' AND,";  
      }
			
			if(typeof contactPointValue !== 'undefined' && contactPointValue !== ""){
        condition += "cp.contact_point_value = '" + contactPointValue + "' AND,";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE  " + condition.slice(0, -4);
      }
			      
      var arrPractitioner = [];
			var query = "SELECT p.practitioner_id as practitioner_id, p.practitioner_active as practitioner_active, p.practitioner_gender as practitioner_gender, p.practitioner_birthdate as practitioner_birthdate, hn.human_name_id as human_name_id, addr.address_id as address_id, cp.contact_point_id as contact_point_id, id.identifier_id , pc.practitioner_communication_id FROM BACIRO_FHIR.PRACTITIONER p LEFT JOIN BACIRO_FHIR.HUMAN_NAME hn ON p.practitioner_id = hn.practitioner_id LEFT JOIN BACIRO_FHIR.ADDRESS addr ON p.practitioner_id = addr.practitioner_id LEFT JOIN BACIRO_FHIR.CONTACT_POINT cp ON p.practitioner_id = cp.practitioner_id LEFT JOIN BACIRO_FHIR.IDENTIFIER id ON p.practitioner_id = id.practitioner_id LEFT JOIN BACIRO_FHIR.PRACTITIONER_COMMUNICATION pc ON p.practitioner_id = pc.practitioner_id " + fixCondition;
			
      //console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Practitioner = {};
					Practitioner.resourceType = "Practitioner";
          Practitioner.id = rez[i].practitioner_id;
          Practitioner.active = rez[i].practitioner_gender;
					Practitioner.gender = rez[i].practitioner_gender;
					Practitioner.birthdate = rez[i].practitioner_birthdate;
          arrPractitioner[i] = Practitioner;
        }
        res.json({"err_code":0,"data": arrPractitioner});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPractitioner"});
      });
    },
		practitionerCommunication: function getPractitionerCommunication(req, res){
			var practitionerId = req.query._id;
			var arrPractitionerCommunication = [];
			var query = "SELECT practitioner_communication_id, practitioner_communication_language, practitioner_communication_preferred FROM BACIRO_FHIR.practitioner_communication where practitioner_id = '" + practitionerId + "'";
			
      //console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var PractitionerCommunication = {};
          PractitionerCommunication.id = rez[i].practitioner_communication_id;
          PractitionerCommunication.language = rez[i].practitioner_communication_language;
					PractitionerCommunication.preferred = rez[i].practitioner_communication_preferred;
					arrPractitionerCommunication[i] = PractitionerCommunication;
        }
        res.json({"err_code":0,"data": arrPractitionerCommunication});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPractitioner"});
      });
		},
		qualification: function getQualification(req, res){
			var apikey = req.params.apikey;
      var practitionerId = req.query._id;
			
      //susun query
      var condition = "";
			
			if(typeof practitionerId !== 'undefined' && practitionerId !== ""){
        condition += "q.practitioner_id = '" + practitionerId + "' AND,";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var query = "SELECT q.qualification_id as qualification_id, q.qualification_code as qualification_code, q.qualification_period_start as qualification_period_start, q.qualification_period_end as qualification_period_end, i.identifier_id as identifier_id, i.identifier_use as identifier_use, i.identifier_type as identifier_type, i.identifier_value as identifier_value, i.identifier_period_start as identifier_period_start, i.identifier_period_end as identifier_period_end,  i.organization_id as organization_id FROM BACIRO_FHIR.QUALIFICATION q LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON q.qualification_id = i.qualification_id  " + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				var arrQualification = [];
        for(i = 0; i < rez.length; i++){
          index = i;
          countQualification = rez.length;
          var Qualification = {id: "", identifier: [], code:{}, period: {}, issuer: []};
          // var 
          Qualification.id = rez[i].qualification_id;
          Qualification.code = rez[i].qualification_code;
					
																	
					if(rez[i].organization_id !== 'null') {
						Qualification.issuer = hostfhir + ":" + portfhir + "/" + apikey + "/Organization?_id=" + rez[i].organization_id;
					} else {
						Qualification.issuer = rez[i].organization_id;
					}	
					
          //Qualification.issuer = rez[i].organization_id;
					
					var nameperiod_start,nameperiod_end;
          if(rez[i].qualification_period_start == null){
            nameperiod_start = formatDate(rez[i].qualification_period_start);  
          }else{
            nameperiod_start = rez[i].qualification_period_start;  
          }

          if(rez[i].qualification_period_end == null){
            nameperiod_end = formatDate(rez[i].qualification_period_end);  
          }else{
            nameperiod_end = rez[i].qualification_period_end;  
          }
					
					Qualification.period = nameperiod_start + ' to ' + nameperiod_end;

          Qualification.identifier.push({
						id : rez[i].identifier_id,
						use : rez[i].identifier_use,
						type : rez[i].identifier_type,
						value : rez[i].identifier_value,
						period : formatDate(rez[i].identifier_period_start) + ' to ' + formatDate(rez[i].identifier_period_end)
					});   

          arrQualification[i] = Qualification;
        }
        res.json({"err_code":0,"data": arrQualification});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getQualification"});
      });
    }
  },
  post: {
    practitioner: function addPractitioner(req, res){
			console.log(req);
			var practitioner_id = req.body.id;
			var practitioner_active = req.body.active;
			var practitioner_gender = req.body.gender;
			var practitioner_birthDate = req.body.birthDate;
			
			var column = "";
      var values = "";
			
			if(typeof practitioner_active !== 'undefined'){
        column += 'practitioner_active,';
        values += " " + practitioner_active +",";
      }
			
			if(typeof practitioner_gender !== 'undefined'){
        column += 'practitioner_gender,';
        values += "'" + practitioner_gender +"',";
      }
			
			if(typeof practitioner_birthDate !== 'undefined'){
        column += 'practitioner_birthDate,';
        values += "to_date('"+ practitioner_birthDate + "', 'yyyy-MM-dd'),";
      }			
			

      var query = "UPSERT INTO BACIRO_FHIR.PRACTITIONER(practitioner_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+practitioner_id+"', " + values.slice(0, -1) + ")";
			console.log(query);
      db.upsert(query,function(succes){
        var query = "SELECT p.practitioner_id as practitioner_id, p.practitioner_active as practitioner_active, p.practitioner_gender as practitioner_gender, p.practitioner_birthdate as practitioner_birthdate FROM BACIRO_FHIR.PRACTITIONER p WHERE practitioner_id = '" + practitioner_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPractitioner"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPractitioner"});
      });
    },
		qualification: function addQualification(req, res){
			var qualification_id = req.body.id;
			var qualification_code = req.body.code;
			var organization_id = req.body.issuer;
			var qualification_period_start = req.body.period_start;
			var qualification_period_end = req.body.period_end;
			var practitioner_id = req.body.practitioner_id;
			
			var column = "";
      var values = "";
			
			if(typeof qualification_code !== 'undefined'){
        column += 'qualification_code,';
        values += "'" + qualification_code +"',";
      }
			
			if(typeof qualification_period_end !== 'undefined'){
        column += 'qualification_period_end,';
        values += "to_date('"+ qualification_period_end + "', 'yyyy-MM-dd'),";
      }

      if(typeof qualification_period_start !== 'undefined'){
        column += 'qualification_period_start,';
        values += "to_date('"+ qualification_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if(typeof practitioner_id !== 'undefined'){
        column += 'practitioner_id,';
        values += "'" + practitioner_id +"',";
      }
			
			

      var query = "UPSERT INTO BACIRO_FHIR.QUALIFICATION(qualification_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+qualification_id+"', " + values.slice(0, -1) + ")";
			console.log(query);
      db.upsert(query,function(succes){
        var query = "SELECT q.qualification_id as qualification_id, q.qualification_code as qualification_code, q.qualification_period_start as qualification_period_start, q.qualification_period_end as qualification_period_end, q.practitioner_id as practitioner_id FROM BACIRO_FHIR.QUALIFICATION q WHERE practitioner_id = '" + practitioner_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addQualification"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addQualification"});
      });
    },
		practitionerCommunication: function addPractitionerCommunication(req, res){
			var practitioner_communication_id = req.body.id;
			var practitioner_communication_language = req.body.communication_language;
			var practitioner_communication_preferred = req.body.communication_preferred;
			var practitioner_id = req.body.practitioner_id;
			
			var column = "";
      var values = "";
			
			if(typeof practitioner_communication_language !== 'undefined'){
        column += 'practitioner_communication_language,';
        values += "'" + practitioner_communication_language +"',";
      }
			
			if(typeof practitioner_communication_preferred !== 'undefined'){
        column += 'practitioner_communication_preferred,';
        values += "" + practitioner_communication_preferred +",";
      }
			
			if(typeof practitioner_id !== 'undefined'){
        column += 'practitioner_id,';
        values += "'" + practitioner_id +"',";
      }
			
			

      var query = "UPSERT INTO BACIRO_FHIR.PRACTITIONER_COMMUNICATION(practitioner_communication_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+practitioner_communication_id+"', " + values.slice(0, -1) + ")";
			console.log(query);
      db.upsert(query,function(succes){
        var query = "SELECT practitioner_communication_id, practitioner_communication_language, practitioner_communication_preferred, practitioner_id FROM BACIRO_FHIR.PRACTITIONER_COMMUNICATION WHERE practitioner_id = '" + practitioner_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerCommunication"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPractitionerCommunication"});
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