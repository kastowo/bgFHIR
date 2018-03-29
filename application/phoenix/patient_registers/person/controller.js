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
    person: function getPerson(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;
      
      var personId = req.query._id;
      var personAddress = req.query.address;
      var personAddressCity = req.query.city;
      var personAddressCountry = req.query.country;
      var personAddressPostalCode = req.query.postalcode;
      var personAddressState = req.query.state; //space encodeURI masih ada bug untuk sprintf
      var personAddressUse = req.query.addressuse; 
      var personBirthdate = req.query.birthdate; 
      var personEmail = req.query.email; 
      var personGender = req.query.gender; 
      var personIdentifier = req.query.identifier;
      var personLink = req.query.link;
      var personName = req.query.name; 
      var personOrganization = req.query.organization; 
      var personPatient = req.query.patient; 
      var personPhone = req.query.phone; 
      var personPractitioner = req.query.practitioner;
      var personRelatedPerson = req.query.relatedperson;
      var personPhonetic = req.query.phonetic; 
      var personTelecom = req.query.telecom;

      //susun query
      var condition = "";
      var join = "";

      if(typeof personId !== 'undefined' && personId !== ""){
        condition += "p.person_id = '" + personId + "' AND ";  
      }

      if(typeof personBirthdate !== 'undefined' && personBirthdate !== ""){
        condition += "person_birthdate = to_date('" + personBirthdate + "', 'yyyy-MM-dd') AND ";  
      }

      if(typeof personGender !== 'undefined' && personGender !== ""){
        condition += "UPPER(person_gender) = '" + personGender.toUpperCase() + "' AND ";  
      }

      if(typeof personOrganization !== 'undefined' && personOrganization !== ""){
        condition += "p.organization_id = '" + personOrganization + "' AND ";  
      }

      if((typeof personAddress !== 'undefined' && personAddress !== "")||(typeof personAddressCity !== 'undefined' && personAddressCity !== "")|| (typeof personAddressCountry !== 'undefined' && personAddressCountry !== "")|| (typeof personAddressPostalCode !== 'undefined' && personAddressPostalCode !== "")||(typeof personAddressState !== 'undefined' && personAddressState !== "")||(typeof personAddressUse !== 'undefined' && personAddressUse !== "")){
         //set join 
        join = " LEFT JOIN BACIRO_FHIR.ADDRESS addr ON addr.person_id = p.person_id ";
        
        if(typeof personAddress !== 'undefined' && personAddress !== ""){
          if(personAddress.indexOf('nonbreaking_space') > 0){
            personAddress = personAddress.replace(/nonbreaking_space/g, " ");
          } 
          condition += "UPPER(address_text) LIKE '%" + personAddress.toUpperCase() + "%' AND ";     
        }

        if(typeof personAddressCity !== 'undefined' && personAddressCity !== ""){
          if(personAddressCity.indexOf('nonbreaking_space') > 0){
            personAddressCity = personAddressCity.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_city) = '" + personAddressCity.toUpperCase() + "' AND ";  
        }

        if(typeof personAddressCountry !== 'undefined' && personAddressCountry !== ""){
          if(personAddressCountry.indexOf('nonbreaking_space') > 0){
            personAddressCountry = personAddressCountry.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_country) = '" + personAddressCountry.toUpperCase() + "' AND "; 
        }

        if(typeof personAddressPostalCode !== 'undefined' && personAddressPostalCode !== ""){
          condition += "address_postal_code = '" + personAddressPostalCode + "' AND ";     
        }

        if(typeof personAddressState !== 'undefined' && personAddressState !== ""){
          if(personAddressState.indexOf('nonbreaking_space') > 0){
            personAddressState = personAddressState.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_state) = '" + personAddressState.toUpperCase() + "' AND "; 
        }

        if(typeof personAddressUse !== 'undefined' && personAddressUse !== ""){
          condition += "UPPER(address_use) = '" + personAddressUse.toUpperCase() + "' AND ";     
        }
      }


      if((typeof personEmail !== 'undefined' && personEmail !== "") || (typeof personTelecom !== 'undefined' && personTelecom !== "") || (typeof personPhone !== 'undefined' && personPhone !== "")){
        join += " LEFT JOIN BACIRO_FHIR.CONTACT_POINT cp ON cp.person_id = p.person_id ";
        
        if(typeof personEmail !== 'undefined' && personEmail !== ""){
          personEmail = personEmail.replace('at_sign', '@');
          condition += "UPPER(contact_point_value) = '" + personEmail.toUpperCase() + "' AND contact_point_system = 'email' AND ";
        }

        if(typeof personTelecom !== 'undefined' && personTelecom !== ""){
          if(personTelecom.indexOf('at_sign') > 0){
            personTelecom = personTelecom.replace('at_sign', '@');  
          }
          condition += "(UPPER(contact_point_system) = '" + personTelecom.toUpperCase() + "' OR UPPER(contact_point_value) = '" + personTelecom.toUpperCase() + "' OR UPPER(contact_point_use) = '" + personTelecom.toUpperCase() + "') AND ";       
        }

        if(typeof personPhone !== 'undefined' && personPhone !== ""){
          condition += "UPPER(contact_point_value) = '" + personPhone.toUpperCase() + "' AND contact_point_system = 'phone' AND ";
        }
      }

      if((typeof personName !== 'undefined' && personName !== "") || (typeof personPhonetic !== 'undefined' && personPhonetic !== "")){
        join += " LEFT JOIN BACIRO_FHIR.HUMAN_NAME hn ON hn.person_id = p.person_id ";

        if(typeof personName !== 'undefined' && personName !== ""){
          if(personName.indexOf('nonbreaking_space') > 0){
            personName = personName.replace(/nonbreaking_space/g, " ");
          }

          condition += "(UPPER(human_name_text) LIKE '%" + personName.toUpperCase() + "%' OR UPPER(human_name_prefix) LIKE '%" + personName.toUpperCase() + "%' OR UPPER(human_name_suffix) LIKE '%" + personName.toUpperCase() + "%') AND ";       
        }

        // if(typeof personPhonetic !== 'undefined' && personPhonetic !== ""){
        //   condition += "(UPPER(human_name_given) = '" + patientPhonetic.toUpperCase() + "' OR UPPER(human_name_family) = '" + patientPhonetic.toUpperCase() + "') AND ";       
        // }
      }

      if((typeof personIdentifier !== 'undefined' && personIdentifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.person_id = p.person_id ";
        
        if(typeof personIdentifier !== 'undefined' && personIdentifier !== ""){
          condition += "identifier_value = '" + personIdentifier + "' AND ";       
        }
      }

      if((typeof personLink !== 'undefined' && personLink !== "") || (typeof personPatient !== 'undefined' && personPatient !== "") || (typeof personPractitioner !== 'undefined' && personPractitioner !== "") || (typeof personRelatedPerson !== 'undefined' && personRelatedPerson !== "")){
        join += " LEFT JOIN BACIRO_FHIR.PERSON_LINK pl ON pl.person_id = p.person_id ";
        
        if(typeof personLink !== 'undefined' && personLink !== ""){
          condition += "(person_link_target_patient = '" + personLink + "' OR person_link_target_practitioner = '" + personLink + "' OR person_link_target_related_person = '" + personLink + "' OR person_link_target_person = '" + personLink + "' ) AND ";       
        }

        if(typeof personPatient !== 'undefined' && personPatient !== ""){
          condition += "person_link_target_patient = '" + personPatient + "' AND ";  
        }

        if(typeof personPractitioner !== 'undefined' && personPractitioner !== ""){
          condition += "person_link_target_practitioner = '" + personPractitioner + "' AND ";  
        }

        if(typeof personRelatedPerson !== 'undefined' && personRelatedPerson !== ""){
          condition += "person_link_target_related_person = '" + personRelatedPerson + "' AND ";  
        }
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
      
      var arrPerson = [];
      var query = "SELECT p.person_id as person_id, person_gender, person_birthdate, person_active, org.organization_id, attachment_id FROM BACIRO_FHIR.PERSON p LEFT JOIN BACIRO_FHIR.ORGANIZATION org on p.organization_id = org.organization_id " + fixCondition; //join ke organization

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Person = {};
          Person.resourceType = "Person";
          Person.id = rez[i].person_id;
          Person.gender = rez[i].person_gender;
          Person.birthdate = formatDate(rez[i].person_birthdate);

          if(rez[i].organization_id != "null"){
            Person.managingOrganization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].organization_id;
          }else{
            Person.managingOrganization = "";
          }
          
          Person.active = rez[i].person_active;
          Person.attachment_id = rez[i].attachment_id;
          
          arrPerson[i] = Person;
        }
        res.json({"err_code":0,"data": arrPerson});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPerson"});
      });
    },
    personLink: function getPersonLink(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      var personId = req.query.person_id;
      var personLinkId = req.query._id;
      //susun query
      var condition = "";

      if(typeof personId !== 'undefined' && personId !== ""){
        condition += "person_id = '" + personId + "' AND ";  
      }

      if(typeof personLinkId !== 'undefined' && personLinkId !== ""){
        condition += "person_link_id = '" + personLinkId + "' AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var arrPersonLink = [];
      var query = "SELECT person_link_id, person_link_target_patient, person_link_target_practitioner, person_link_target_related_person, person_link_target_person, person_link_assurance FROM BACIRO_FHIR.PERSON_LINK " + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var PersonLink = {};
          PersonLink.id = rez[i].person_link_id;

          if(rez[i].person_link_target_patient !== 'null'){
            PersonLink.target = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].person_link_target_patient;
          }else if(rez[i].person_link_target_practitioner !== 'null'){
            PersonLink.target = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].person_link_target_practitioner;
          }else if(rez[i].person_link_target_related_person !== 'null'){
            PersonLink.target = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].person_link_target_related_person;
          }else{
            PersonLink.target = hostFHIR + ':' + portFHIR + '/' + apikey + '/Person?_id=' +  rez[i].person_link_target_person;
          }
           
           PersonLink.assurance = rez[i].person_link_assurance;

          arrPersonLink[i] = PersonLink;
        }
        res.json({"err_code":0,"data": arrPersonLink});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPersonLink"});
      });
    }
  },
  post: {
    person: function addPerson(req, res){
      var person_id = req.body.id;
      var person_gender = req.body.gender;
      var person_birthdate = req.body.birthdate;
      var person_active = req.body.active;
      var attachment_id = req.body.attachment_id;
      var organization_id = req.body.organization_id;
     
      if(organization_id == ""){
        organization_id = null;
      }

      var query = "UPSERT INTO BACIRO_FHIR.PERSON(person_id, person_gender, person_birthdate, person_active, attachment_id, organization_id)"+
        " VALUES ('"+person_id+"','"+person_gender+"', to_date('" + person_birthdate + "', 'yyyy-MM-dd'),"+person_active+", '"+attachment_id+"', '"+organization_id+"')";
      
      db.upsert(query,function(succes){
        var query = "SELECT person_id, person_gender, person_birthdate, person_active, attachment_id, organization_id FROM BACIRO_FHIR.PERSON WHERE person_id = '" + person_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPerson"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPerson"});
      });
    },
    personLink: function addPersonLink(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      var person_link_id = req.body.id;
      var patientId = req.body.patient_id;
      var practitionerId = req.body.practitioner_id;
      var relatedPersonId = req.body.related_person_id;
      var personId = req.body.person_id;
      var personId2 = req.body.person_id2;
      var assurance= req.body.assurance;

      //susun query
      var column = "";
      var values = "";

      if(typeof patientId !== 'undefined' && patientId !== ""){
        column += 'person_link_target_patient,';
        values += "'"+ patientId +"',";
      }

      if(typeof practitionerId !== 'undefined' && practitionerId !== ""){
        column += 'person_link_target_practitioner,';
        values += "'"+ practitionerId +"',";
      }

      if(typeof relatedPersonId !== 'undefined' && relatedPersonId !== ""){
        column += 'person_link_target_related_person,';
        values += "'"+ relatedPersonId +"',";
      }

      if(typeof personId2 !== 'undefined' && personId2 !== "" ){
        column += 'person_link_target_person,';
        values += "'" + personId2 + "',";
      }

      if(typeof assurance !== 'undefined' && assurance !== "" ){
        column += 'person_link_assurance,';
        values += "'" + assurance + "',";
      }

      if(typeof personId !== 'undefined' && personId !== "" ){
        column += 'person_id,';
        values += "'"+ personId + "',";
      }

      
      var query = "UPSERT INTO BACIRO_FHIR.PERSON_LINK(person_link_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+ person_link_id +"', " + values.slice(0, -1) + ")";
      
      db.upsert(query,function(succes){
        var arrPersonLink = [];
        var query = "SELECT person_link_id, person_link_target_patient, person_link_target_practitioner, person_link_target_related_person, person_link_target_person, person_link_assurance FROM BACIRO_FHIR.PERSON_LINK WHERE person_link_id = '" + person_link_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var PersonLink = {};
            PersonLink.id = rez[i].person_link_id;

            if(rez[i].person_link_target_patient !== 'null'){
              PersonLink.target = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].person_link_target_patient;
            }else if(rez[i].person_link_target_practitioner !== 'null'){
              PersonLink.target = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].person_link_target_practitioner;
            }else if(rez[i].person_link_target_related_person !== 'null'){
              PersonLink.target = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].person_link_target_related_person;
            }else{
              PersonLink.target = hostFHIR + ':' + portFHIR + '/' + apikey + '/Person?_id=' +  rez[i].person_link_target_person;
            }
             
             PersonLink.assurance = rez[i].person_link_assurance;

            arrPersonLink[i] = PersonLink;
          }
          res.json({"err_code":0,"data": arrPersonLink});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPersonLink"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPersonLink"});
      });
    }
  },
  put: {
    person: function updatePerson(req, res){
      var person_id = req.params.person_id;

      var person_gender = req.body.gender;
      var person_birthdate = req.body.birthdate;
      var person_active = req.body.active;
      var organization_id = req.body.organization;


      //susun query update
      var column = "";
      var values = "";
      
      if(typeof person_gender !== 'undefined' && person_gender !== ""){
        column += 'person_gender,';
        values += "'" +person_gender +"',";
      }

      if(typeof person_active !== 'undefined' && person_active !== ""){
        column += 'person_active,';
        values += person_active +",";
      }
      
      if(typeof person_birthdate !== 'undefined' && person_birthdate !== ""){
        column += 'person_birthdate,';
        values += "to_date('" + person_birthdate +"', 'yyyy-MM-dd'),";
      }

      if(typeof organization_id !== 'undefined' && organization_id !== ""){
        column += 'organization_id,';
        values += "'" +organization_id +"',";
      }

      var condition = "person_id = '" + person_id + "'";

      var query = "UPSERT INTO BACIRO_FHIR.PERSON(person_id," + column.slice(0, -1) + ") SELECT person_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PERSON WHERE " + condition;
      
      db.upsert(query,function(succes){
        res.json({"err_code":0, "err_msg": "Success updated."});          
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePerson"});
      });
    },
    personLink: function updatePersonLink(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      var _id = req.params.person_link_id;
      var domainResource = req.params.dr;

      var person_link_target_patient = req.body.link_target_patient_id;
      var person_link_target_practitioner = req.body.link_target_practitioner_id;
      var person_link_target_related_person = req.body.link_target_related_person_id;
      var person_link_target_person = req.body.link_target_person_id;
      var person_link_assurance = req.body.assurance;
      
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof person_link_target_patient !== 'undefined' && person_link_target_patient !== "" ){
        column += 'person_link_target_patient,';
        values += "'" +person_link_target_patient +"',";
      }

      if(typeof person_link_target_practitioner !== 'undefined' && person_link_target_practitioner !== ""){
        column += 'person_link_target_practitioner,';
        values += "'" +person_link_target_practitioner +"',";
      }

      if(typeof person_link_target_related_person !== 'undefined' && person_link_target_related_person !== ""){
        column += 'person_link_target_related_person,';
        values += "'" +person_link_target_related_person +"',";
      }

      if(typeof person_link_target_person !== 'undefined' && person_link_target_person !== ""){
        column += 'person_link_target_person,';
        values += "" +person_link_target_person +",";
      }

      if(typeof person_link_assurance !== 'undefined' && person_link_assurance !== ""){
        column += 'person_link_assurance,';
        values += "'" +person_link_assurance +"',";
      }

      
      if(domainResource !== "" && typeof domainResource !== 'undefined'){
        var arrResource = domainResource.split('|');
        var fieldResource = arrResource[0];
        var valueResource = arrResource[1];
        var condition = "person_link_id = '" + _id + "' AND " + fieldResource +" = '"+ valueResource +"'";
      }else{
        var condition = "person_link_id = '" + _id + "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.PERSON_LINK(person_link_id," + column.slice(0, -1) + ") SELECT person_link_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PERSON_LINK WHERE " + condition;
      
      db.upsert(query,function(succes){
        var arrPersonLink = [];
        var query = "SELECT person_link_id, person_link_target_patient, person_link_target_practitioner, person_link_target_related_person, person_link_target_person, person_link_assurance FROM BACIRO_FHIR.PERSON_LINK WHERE " + condition;
        db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var PersonLink = {};
          PersonLink.id = rez[i].person_link_id;

          if(rez[i].person_link_target_patient !== 'null'){
            PersonLink.target = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].person_link_target_patient;
          }else if(rez[i].person_link_target_practitioner !== 'null'){
            PersonLink.target = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].person_link_target_practitioner;
          }else if(rez[i].person_link_target_related_person !== 'null'){
            PersonLink.target = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].person_link_target_related_person;
          }else{
            PersonLink.target = hostFHIR + ':' + portFHIR + '/' + apikey + '/Person?_id=' +  rez[i].person_link_target_person;
          }
           
           PersonLink.assurance = rez[i].person_link_assurance;

          arrPersonLink[i] = PersonLink;
        }
        res.json({"err_code":0,"data": arrPersonLink});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePersonLink"});
      });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePersonLink"});
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