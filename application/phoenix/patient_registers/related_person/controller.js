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
var db = new phoenix("jdbc:phoenix:" + host + ":/hbase-unsecure");

var controller = {
	get: {
    relatedPerson: function getRelatedPerson(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      //params from query string
      var relatedPersonId = req.query._id;
      var relatedPersonActive = req.query.active;
      var relatedPersonAddress = req.query.address;
      var relatedPersonAddressCity = req.query.city;
      var relatedPersonAddressCountry = req.query.country;
      var relatedPersonAddressPostalCode = req.query.postalcode;
      var relatedPersonAddressState = req.query.state; //space encodeURI masih ada bug untuk sprintf
      var relatedPersonAddressUse = req.query.addressuse; 
      var relatedPersonBirthdate = req.query.birthdate; 
      var relatedPersonEmail = req.query.email; 
      var relatedPersonGender = req.query.gender; 
      var relatedPersonIdentifier = req.query.identifier;
      var relatedPersonName = req.query.name; 
      var relatedPersonPatient = req.query.patient; 
      var relatedPersonPhone = req.query.phone; 
      var relatedPersonPhonetic = req.query.phonetic; 
      var relatedPersonTelecom = req.query.telecom;

      //susun query
      var condition = "";
      var join = "";

      if(typeof relatedPersonId !== 'undefined' && relatedPersonId !== ""){
        condition += "rp.related_person_id = '" + relatedPersonId + "' AND ";  
      }

      if(typeof relatedPersonActive !== 'undefined' && relatedPersonActive !== ""){
        condition += "related_person_active = " + relatedPersonActive + " AND ";  
      }

      if(typeof relatedPersonBirthdate !== 'undefined' && relatedPersonBirthdate !== ""){
        condition += "related_person_birthdate = to_date('" + relatedPersonBirthdate + "', 'yyyy-MM-dd') AND ";  
      }

      if(typeof relatedPersonGender !== 'undefined' && relatedPersonGender !== ""){
        condition += "UPPER(related_person_gender) = '" + relatedPersonGender.toUpperCase() + "' AND ";  
      }

      if(typeof relatedPersonPatient !== 'undefined' && relatedPersonPatient !== ""){
        condition += "rp.patient_id = '" + relatedPersonPatient + "' AND ";  
      }

      if((typeof relatedPersonAddress !== 'undefined' && relatedPersonAddress !== "")||(typeof relatedPersonAddressCity !== 'undefined' && relatedPersonAddressCity !== "")|| (typeof relatedPersonAddressCountry !== 'undefined' && relatedPersonAddressCountry !== "")|| (typeof relatedPersonAddressPostalCode !== 'undefined' && relatedPersonAddressPostalCode !== "")||(typeof relatedPersonAddressState !== 'undefined' && relatedPersonAddressState !== "")||(typeof relatedPersonAddressUse !== 'undefined' && relatedPersonAddressUse !== "")){
         //set join 
        join = " LEFT JOIN BACIRO_FHIR.ADDRESS addr ON addr.related_person_id = rp.related_person_id ";
        
        if(typeof relatedPersonAddress !== 'undefined' && relatedPersonAddress !== ""){
          if(relatedPersonAddress.indexOf('nonbreaking_space') > 0){
            relatedPersonAddress = relatedPersonAddress.replace(/nonbreaking_space/g, " ");
          } 
          condition += "UPPER(address_text) LIKE '%" + relatedPersonAddress.toUpperCase() + "%' AND ";     
        }

        if(typeof relatedPersonAddressCity !== 'undefined' && relatedPersonAddressCity !== ""){
          if(relatedPersonAddressCity.indexOf('nonbreaking_space') > 0){
            relatedPersonAddressCity = relatedPersonAddressCity.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_city) = '" + relatedPersonAddressCity.toUpperCase() + "' AND ";  
        }

        if(typeof relatedPersonAddressCountry !== 'undefined' && relatedPersonAddressCountry !== ""){
          if(relatedPersonAddressCountry.indexOf('nonbreaking_space') > 0){
            relatedPersonAddressCountry = relatedPersonAddressCountry.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_country) = '" + relatedPersonAddressCountry.toUpperCase() + "' AND "; 
        }

        if(typeof relatedPersonAddressPostalCode !== 'undefined' && relatedPersonAddressPostalCode !== ""){
          condition += "address_postal_code = '" + relatedPersonAddressPostalCode + "' AND ";     
        }

        if(typeof relatedPersonAddressState !== 'undefined' && relatedPersonAddressState !== ""){
          if(relatedPersonAddressState.indexOf('nonbreaking_space') > 0){
            relatedPersonAddressState = relatedPersonAddressState.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_state) = '" + relatedPersonAddressState.toUpperCase() + "' AND "; 
        }

        if(typeof relatedPersonAddressUse !== 'undefined' && relatedPersonAddressUse !== ""){
          condition += "UPPER(address_use) = '" + relatedPersonAddressUse.toUpperCase() + "' AND ";     
        }
      }


      if((typeof relatedPersonEmail !== 'undefined' && relatedPersonEmail !== "") || (typeof relatedPersonTelecom !== 'undefined' && relatedPersonTelecom !== "") || (typeof relatedPersonPhone !== 'undefined' && relatedPersonPhone !== "")){
        join += " LEFT JOIN BACIRO_FHIR.CONTACT_POINT cp ON cp.related_person_id = rp.related_person_id ";
        
        if(typeof relatedPersonEmail !== 'undefined' && relatedPersonEmail !== ""){
          relatedPersonEmail = relatedPersonEmail.replace('at_sign', '@');
          condition += "UPPER(contact_point_value) = '" + relatedPersonEmail.toUpperCase() + "' AND contact_point_system = 'email' AND ";
        }

        if(typeof relatedPersonTelecom !== 'undefined' && relatedPersonTelecom !== ""){
          if(relatedPersonTelecom.indexOf('at_sign') > 0){
            relatedPersonTelecom = relatedPersonTelecom.replace('at_sign', '@');  
          }
          condition += "(UPPER(contact_point_system) = '" + relatedPersonTelecom.toUpperCase() + "' OR UPPER(contact_point_value) = '" + relatedPersonTelecom.toUpperCase() + "' OR UPPER(contact_point_use) = '" + relatedPersonTelecom.toUpperCase() + "') AND ";       
        }

        if(typeof relatedPersonPhone !== 'undefined' && relatedPersonPhone !== ""){
          condition += "UPPER(contact_point_value) = '" + relatedPersonPhone.toUpperCase() + "' AND contact_point_system = 'phone' AND ";
        }
      }

      if((typeof relatedPersonName !== 'undefined' && relatedPersonName !== "") || (typeof relatedPersonPhonetic !== 'undefined' && relatedPersonPhonetic !== "")){
        join += " LEFT JOIN BACIRO_FHIR.HUMAN_NAME hn ON hn.related_person_id = rp.related_person_id ";

        if(typeof relatedPersonName !== 'undefined' && relatedPersonName !== ""){
          if(relatedPersonName.indexOf('nonbreaking_space') > 0){
            relatedPersonName = relatedPersonName.replace(/nonbreaking_space/g, " ");
          }

          condition += "(UPPER(human_name_text) LIKE '%" + relatedPersonName.toUpperCase() + "%' OR UPPER(human_name_prefix) LIKE '%" + relatedPersonName.toUpperCase() + "%' OR UPPER(human_name_suffix) LIKE '%" + relatedPersonName.toUpperCase() + "%') AND ";       
        }

        // if(typeof relatedPersonPhonetic !== 'undefined' && relatedPersonPhonetic !== ""){
        //   condition += "(UPPER(human_name_given) = '" + patientPhonetic.toUpperCase() + "' OR UPPER(human_name_family) = '" + patientPhonetic.toUpperCase() + "') AND ";       
        // }
      }

      if((typeof relatedPersonIdentifier !== 'undefined' && relatedPersonIdentifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.related_person_id = rp.related_person_id ";
        
        if(typeof relatedPersonIdentifier !== 'undefined' && relatedPersonIdentifier !== ""){
          condition += "identifier_value = '" + relatedPersonIdentifier + "' AND ";       
        }
      }

      

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
      
      var arrRelatedPerson = [];
      var query = "SELECT rp.related_person_id as related_person_id, related_person_active, related_person_relationship, related_person_gender, related_person_birthdate, related_person_period_start, related_person_period_end, rp.patient_id as patient_id FROM BACIRO_FHIR.RELATED_PERSON rp " + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var RelatedPerson = {};
          RelatedPerson.resourceType = "RelatedPerson";
          RelatedPerson.id = rez[i].related_person_id;
          RelatedPerson.active = rez[i].related_person_active;
          RelatedPerson.relationship = rez[i].related_person_relationship;
          RelatedPerson.gender = rez[i].related_person_gender;
          RelatedPerson.birthdate = formatDate(rez[i].related_person_birthdate);
          
          if(rez[i].related_person_period_start == "" || rez[i].related_person_period_start == "null"){
            RelatedPerson.period_start = "";
          }else{
            RelatedPerson.period_start = formatDate(rez[i].related_person_period_start)
            
          }
         
          if(rez[i].related_person_period_end == "" || rez[i].related_person_period_end == "null"){
            RelatedPerson.period_end = "";
          }else{
            RelatedPerson.period_end = formatDate(rez[i].related_person_period_end)
          }
         

          if(rez[i].patient_id != "null"){
            RelatedPerson.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient_id;
          }else{
            RelatedPerson.patient = "";
          }

          arrRelatedPerson[i] = RelatedPerson;
        }
        res.json({"err_code":0,"data": arrRelatedPerson});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getRelatedPerson"});
      });
    }
  },
  post: {
    relatedPerson: function addRelatedPerson(req, res){
      var related_person_id = req.body.id;
      var related_person_active = req.body.active;
      var related_person_relationship = req.body.relationship;
      var related_person_gender = req.body.gender;
      var related_person_birthdate = req.body.birthdate;
      var related_person_period_start = req.body.period_start;
      var related_person_period_end = req.body.period_end;
      var patient_id = req.body.patient_id;
      //susun query
      var column = "";
      var values = "";

      if(typeof related_person_active !== 'undefined' && related_person_active !== ""){
        column += 'related_person_active,';
        values += related_person_active +",";
      }

      if(typeof related_person_relationship !== 'undefined' && related_person_relationship !== ""){
        column += 'related_person_relationship,';
        values += "'"+ related_person_relationship +"',";
      }

      if(typeof related_person_gender !== 'undefined' && related_person_gender !== ""){
        column += 'related_person_gender,';
        values += "'"+ related_person_gender +"',";
      }

      if(typeof req.body.birthdate !== 'undefined' && related_person_birthdate !== ""){
        column += 'related_person_birthdate,';
        values += "to_date('"+related_person_birthdate+ "', 'yyyy-MM-dd')" + ",";
      }

      if(typeof req.body.period_start !== 'undefined'){
        if(req.body.period_start == ""){
          related_person_period_start = null;
        }else{
          related_person_period_start = "to_date('"+req.body.period_start+ "', 'yyyy-MM-dd')";
        }

        column += 'related_person_period_start,';
        values += related_person_period_start + ",";
      }

      if(typeof req.body.period_end !== 'undefined'){
        if(req.body.period_end == ""){
          related_person_period_end = null;
        }else{
          related_person_period_end = "to_date('"+req.body.period_end+ "', 'yyyy-MM-dd')";
        }

        column += 'related_person_period_end,';
        values += related_person_period_end + ",";
      }

      if(typeof patient_id !== 'undefined' && patient_id !== ""){
        column += 'patient_id,';
        values += "'"+ patient_id +"',";
      }
      
      var query = "UPSERT INTO BACIRO_FHIR.RELATED_PERSON(related_person_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+related_person_id+"', " + values.slice(0, -1) + ")";
      
      db.upsert(query,function(succes){
        var query = "SELECT related_person_id, related_person_active, related_person_relationship, related_person_gender, related_person_birthdate, related_person_period_start, related_person_period_end, patient_id FROM BACIRO_FHIR.RELATED_PERSON WHERE related_person_id = '" + related_person_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addRelatedPerson"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addRelatedPerson"});
      });
    }
  },
  put: {
    relatedPerson: function updateRelatedPerson(req, res){
      var related_person_id = req.params.related_person_id;

      var related_person_active = req.body.active;
      var related_person_relationship = req.body.relationship;
      var related_person_gender = req.body.gender;
      var related_person_birthdate = req.body.birthdate;
      var related_person_period_start = req.body.period_start;
      var related_person_period_end = req.body.period_end;
      var patient_id = req.body.patient_id;
      //susun query
      var column = "";
      var values = "";

      if(typeof related_person_active !== 'undefined' && related_person_active !== ""){
        column += 'related_person_active,';
        values += related_person_active +",";
      }

      if(typeof related_person_relationship !== 'undefined' && related_person_relationship !== ""){
        column += 'related_person_relationship,';
        values += "'"+ related_person_relationship +"',";
      }

      if(typeof related_person_gender !== 'undefined' && related_person_gender !== ""){
        column += 'related_person_gender,';
        values += "'"+ related_person_gender +"',";
      }

      if(typeof req.body.birthdate !== 'undefined' && related_person_birthdate !== ""){
        column += 'related_person_birthdate,';
        values += "to_date('"+related_person_birthdate+ "', 'yyyy-MM-dd')" + ",";
      }

      if(typeof req.body.period_start !== 'undefined'){
        if(req.body.period_start == ""){
          related_person_period_start = null;
        }else{
          related_person_period_start = "to_date('"+req.body.period_start+ "', 'yyyy-MM-dd')";
        }

        column += 'related_person_period_start,';
        values += related_person_period_start + ",";
      }

      if(typeof req.body.period_end !== 'undefined'){
        if(req.body.period_end == ""){
          related_person_period_end = null;
        }else{
          related_person_period_end = "to_date('"+req.body.period_end+ "', 'yyyy-MM-dd')";
        }

        column += 'related_person_period_end,';
        values += related_person_period_end + ",";
      }

      if(typeof patient_id !== 'undefined' && patient_id !== ""){
        column += 'patient_id,';
        values += "'"+ patient_id +"',";
      }

      var condition = "related_person_id = '" + related_person_id + "'";
      
      var query = "UPSERT INTO BACIRO_FHIR.RELATED_PERSON(related_person_id," + column.slice(0, -1) + ") SELECT related_person_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.RELATED_PERSON WHERE " + condition;
      
      db.upsert(query,function(succes){
        var query = "SELECT related_person_id, related_person_active, related_person_relationship, related_person_gender, related_person_birthdate, related_person_period_start, related_person_period_end, patient_id FROM BACIRO_FHIR.RELATED_PERSON WHERE " + condition;
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateRelatedPerson"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateRelatedPerson"});
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