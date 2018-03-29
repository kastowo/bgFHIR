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
    patient: function getPatient(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      var patientId = req.query._id;
      var patientActive = req.query.active;
      var patientAddress = req.query.address;
      var patientAddressCity = req.query.city;
      var patientAddressCountry = req.query.country;
      var patientAddressPostalCode = req.query.postalcode;
      var patientAddressState = req.query.state;
      var patientAddressUseCode = req.query.addressuse;
      var patientAnimalBreed = req.query.animalbreed;
      var patientAnimalSpecies = req.query.animalspecies;
      var patientBirthdate = req.query.birthdate;
      var patientDeathdate = req.query.deathdate;
      var patientDeceased = req.query.deceased;
      var patientEmail = req.query.email;
      var patientFamily = req.query.family;
      var patientGender = req.query.gender;
      var patientGiven = req.query.given;
      var patientIdentifier = req.query.identifier;
      var patientLanguage = req.query.language;
      var patientLink = req.query.link;
      var patientName = req.query.name;
      var patientOrganization = req.query.organization;
      var patientPhoneContact = req.query.phone;
      var patientPhonetic = req.query.phonetic;
      var patientTelecom = req.query.telecom;

      //susun query
      var condition = "";
      var join = "";

      if(typeof patientId !== 'undefined' && patientId !== ""){
        condition += "p.patient_id = '" + patientId + "' AND ";  
      }

      if(typeof patientActive !== 'undefined' && patientActive !== ""){
        condition += "patient_active = " + patientActive + " AND ";  
      }

      if(typeof patientBirthdate !== 'undefined' && patientBirthdate !== ""){
        condition += "patient_birthdate = to_date('" + patientBirthdate + "', 'yyyy-MM-dd') AND ";  
      }

      if(typeof patientDeathdate !== 'undefined' && patientDeathdate !== ""){
        condition += "patient_deceased_date = to_date('" + patientDeathdate + "', 'yyyy-MM-dd') AND ";  
      }

      if(typeof patientDeceased !== 'undefined' && patientDeceased !== ""){
        condition += "patient_deceased = " + patientDeceased + " AND ";  
      }

      if(typeof patientGender !== 'undefined' && patientGender !== ""){
        condition += "UPPER(patient_gender) = '" + patientGender.toUpperCase() + "' AND ";  
      }

      if(typeof patientOrganization !== 'undefined' && patientOrganization !== ""){
        condition += "p.organization_id = '" + patientOrganization + "' AND ";  
      }

      if((typeof patientAddress !== 'undefined' && patientAddress !== "")||(typeof patientAddressCity !== 'undefined' && patientAddressCity !== "")|| (typeof patientAddressCountry !== 'undefined' && patientAddressCountry !== "")|| (typeof patientAddressPostalCode !== 'undefined' && patientAddressPostalCode !== "")||(typeof patientAddressState !== 'undefined' && patientAddressState !== "")||(typeof patientAddressUseCode !== 'undefined' && patientAddressUseCode !== "")){
         //set join 
        join = " LEFT JOIN BACIRO_FHIR.ADDRESS addr ON addr.patient_id = p.patient_id ";
        
        if(typeof patientAddress !== 'undefined' && patientAddress !== ""){
          if(patientAddress.indexOf('nonbreaking_space') > 0){
            patientAddress = patientAddress.replace(/nonbreaking_space/g, " ");
          } 
          condition += "UPPER(address_text) LIKE '%" + patientAddress.toUpperCase() + "%' AND ";     
        }

        if(typeof patientAddressCity !== 'undefined' && patientAddressCity !== ""){
          if(patientAddressCity.indexOf('nonbreaking_space') > 0){
            patientAddressCity = patientAddressCity.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_city) = '" + patientAddressCity.toUpperCase() + "' AND ";  
        }

        if(typeof patientAddressCountry !== 'undefined' && patientAddressCountry !== ""){
          if(patientAddressCountry.indexOf('nonbreaking_space') > 0){
            patientAddressCountry = patientAddressCountry.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_country) = '" + patientAddressCountry.toUpperCase() + "' AND "; 
        }

        if(typeof patientAddressPostalCode !== 'undefined' && patientAddressPostalCode !== ""){
          condition += "address_postal_code = '" + patientAddressPostalCode + "' AND ";     
        }

        if(typeof patientAddressState !== 'undefined' && patientAddressState !== ""){
          if(patientAddressState.indexOf('nonbreaking_space') > 0){
            patientAddressState = patientAddressState.replace(/nonbreaking_space/g, " ");
          }
          condition += "UPPER(address_state) = '" + patientAddressState.toUpperCase() + "' AND "; 
        }

        if(typeof patientAddressUseCode !== 'undefined' && patientAddressUseCode !== ""){
          condition += "UPPER(address_use) = '" + patientAddressUseCode.toUpperCase() + "' AND ";     
        }
      }

      if((typeof patientAnimalBreed !== 'undefined' && patientAnimalBreed !== "") || (typeof patientAnimalSpecies !== 'undefined' && patientAnimalSpecies !== "")){
        join += " LEFT JOIN BACIRO_FHIR.PATIENT_ANIMAL pa ON pa.patient_animal_id = p.patient_animal_id ";
        
        if(typeof patientAnimalBreed !== 'undefined' && patientAnimalBreed !== ""){
          condition += "patient_animal_breed = " + patientAnimalBreed + " AND ";       
        }

        if(typeof patientAnimalSpecies !== 'undefined' && patientAnimalSpecies !== ""){
          condition += "patient_animal_species = " + patientAnimalSpecies + " AND ";       
        }
        
      }

      if((typeof patientEmail !== 'undefined' && patientEmail !== "") || (typeof patientTelecom !== 'undefined' && patientTelecom !== "")){
        join += " LEFT JOIN BACIRO_FHIR.CONTACT_POINT cp ON cp.patient_id = p.patient_id ";
        
        if(typeof patientEmail !== 'undefined' && patientEmail !== ""){
          patientEmail = patientEmail.replace('at_sign', '@');
          condition += "UPPER(contact_point_value) = '" + patientEmail.toUpperCase() + "' AND contact_point_system = 'email' AND ";       
        }

        if(typeof patientTelecom !== 'undefined' && patientTelecom !== ""){
          if(patientTelecom.indexOf('at_sign') > 0){
            patientTelecom = patientTelecom.replace('at_sign', '@');  
          }
          
          condition += "(UPPER(contact_point_system) = '" + patientTelecom.toUpperCase() + "' OR UPPER(contact_point_value) = '" + patientTelecom.toUpperCase() + "' OR UPPER(contact_point_use) = '" + patientTelecom.toUpperCase() + "') AND ";       
        }
      }

      if((typeof patientFamily !== 'undefined' && patientFamily !== "") || (typeof patientGiven !== 'undefined' && patientGiven !== "") || (typeof patientName !== 'undefined' && patientName !== "") || (typeof patientPhonetic !== 'undefined' && patientPhonetic !== "")){
        join += " LEFT JOIN BACIRO_FHIR.HUMAN_NAME hn ON hn.patient_id = p.patient_id ";
        
        if(typeof patientFamily !== 'undefined' && patientFamily !== ""){
          condition += "UPPER(human_name_family) = '" + patientFamily.toUpperCase() + "' AND ";       
        }

        if(typeof patientGiven !== 'undefined' && patientGiven !== ""){
          condition += "UPPER(human_name_given) = '" + patientGiven.toUpperCase() + "' AND ";       
        }

        if(typeof patientName !== 'undefined' && patientName !== ""){
          if(patientName.indexOf('nonbreaking_space') > 0){
            patientName = patientName.replace(/nonbreaking_space/g, " ");
          }

          condition += "(UPPER(human_name_text) LIKE '%" + patientName.toUpperCase() + "%' OR UPPER(human_name_family) LIKE '%" + patientName.toUpperCase() + "%' OR UPPER(human_name_given) LIKE '%" + patientName.toUpperCase() + "%' OR UPPER(human_name_prefix) LIKE '%" + patientName.toUpperCase() + "%' OR UPPER(human_name_suffix) LIKE '%" + patientName.toUpperCase() + "%') AND ";       
        }

        if(typeof patientPhonetic !== 'undefined' && patientPhonetic !== ""){
          condition += "(UPPER(human_name_given) = '" + patientPhonetic.toUpperCase() + "' OR UPPER(human_name_family) = '" + patientPhonetic.toUpperCase() + "') AND ";       
        }
      }

      if((typeof patientIdentifier !== 'undefined' && patientIdentifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.patient_id = p.patient_id ";
        
        if(typeof patientIdentifier !== 'undefined' && patientIdentifier !== ""){
          condition += "identifier_value = '" + patientIdentifier + "' AND ";       
        }
      }

      if((typeof patientLanguage !== 'undefined' && patientLanguage !== "")){
        join += " LEFT JOIN BACIRO_FHIR.PATIENT_COMMUNICATION pc ON pc.patient_id = p.patient_id ";
        
        if(typeof patientLanguage !== 'undefined' && patientLanguage !== ""){
          condition += "patient_communication_language = '" + patientLanguage + "' AND ";       
        }
      }

      if((typeof patientLink !== 'undefined' && patientLink !== "")){
        join += " LEFT JOIN BACIRO_FHIR.PATIENT_LINK pl ON pl.patient_id = p.patient_id ";
        
        if(typeof patientLink !== 'undefined' && patientLink !== ""){
          condition += "(patient_link_other_patient_id = '" + patientLink + "' OR patient_link_other_related_person_id = '" + patientLink + "') AND ";       
        }
      }

      if((typeof patientPhoneContact !== 'undefined' && patientPhoneContact !== "")){
        join += " LEFT JOIN BACIRO_FHIR.PATIENT_CONTACT pc ON pc.patient_id = p.patient_id ";
        join += " LEFT JOIN BACIRO_FHIR.CONTACT_POINT cp ON pc.patient_contact_id = cp.patient_contact_id ";
        
        if(typeof patientPhoneContact !== 'undefined' && patientPhoneContact !== ""){
          condition += "contact_point_value = '" + patientPhoneContact + "' AND contact_point_system = 'phone' AND ";       
        }
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
      
      var arrPatient = [];
      var query = "SELECT p.patient_id as patient_id, patient_active, patient_gender, patient_birthdate, patient_deceased, patient_deceased_date, patient_marital_status, patient_multiple_birth, patient_multiple_number, p.patient_animal_id as patient_animal_id, p.organization_id as organization_id FROM BACIRO_FHIR.PATIENT p" + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Patient = {};
          Patient.resourceType = "Patient";
          Patient.id = rez[i].patient_id;
          Patient.active = rez[i].patient_active;
          Patient.gender = rez[i].patient_gender;
          Patient.birthdate = formatDate(rez[i].patient_birthdate);
          Patient.deceasedBoolean = rez[i].patient_deceased;
          //deceased
          if(rez[i].patient_deceased == "true"){
            Patient.deceasedDateTime = formatDate(rez[i].patient_deceased_date)
          }else{
            Patient.deceasedDateTime = "";
          }
          Patient.maritalStatus = rez[i].patient_marital_status;
          Patient.multipleBirth = rez[i].patient_multiple_birth;
          Patient.multipleInteger = rez[i].patient_multiple_number;
          Patient.patient_animal_id = rez[i].patient_animal_id;

          if(rez[i].organization_id != "null"){
            Patient.managingOrganization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].organization_id;
          }else{
            Patient.managingOrganization = "";
          }

          arrPatient[i] = Patient;
        }
        res.json({"err_code":0,"data": arrPatient});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPatient"});
      });
    },
    patientAnimal: function getPatientAnimal(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      var patientAnimalId = req.query._id;
      //susun query
      var condition = "";

      if(typeof patientAnimalId !== 'undefined' && patientAnimalId !== ""){
        condition += "patient_animal_id = '" + patientAnimalId + "' AND,";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var arrPatientAnimal = [];
      var query = "SELECT patient_animal_id, patient_animal_species, patient_animal_breed, patient_animal_gender_status FROM BACIRO_FHIR.PATIENT_ANIMAL " + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var PatientAnimal = {};
          PatientAnimal.id = rez[i].patient_animal_id;
          PatientAnimal.species = rez[i].patient_animal_species;
          PatientAnimal.breed = rez[i].patient_animal_breed;
          PatientAnimal.genderStatus = rez[i].patient_animal_gender_status;

          arrPatientAnimal[i] = PatientAnimal;
        }
        res.json({"err_code":0,"data": arrPatientAnimal});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPatientAnimal"});
      });
    },
    patientContact: function getPatientContact(req, res){
      var patientId = req.query.patient_id;
      var patientContactId = req.query._id;
      //susun query
      var condition = "";

      if(typeof patientId !== 'undefined' && patientId !== ""){
        condition += "pc.patient_id = '" + patientId + "' AND ";  
      }

      if(typeof patientContactId !== 'undefined' && patientContactId !== ""){
        condition += "pc.patient_contact_id = '" + patientContactId + "' AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var query = "SELECT pc.patient_contact_id as patient_contact_id, patient_contact_relationship, patient_contact_gender, patient_contact_period_start, patient_contact_period_end, hn.human_name_id as human_name_id, human_name_use, human_name_text, human_name_family, human_name_given, human_name_prefix, human_name_suffix, human_name_period_start, human_name_period_end, addr.address_id as address_id, address_use, address_type, address_text, address_line, address_city, address_district, address_state, address_postal_code, address_country, address_period_start, address_period_end, cp.contact_point_id as contact_point_id, contact_point_system, contact_point_value, contact_point_use, contact_point_rank, contact_point_period_start, contact_point_period_end FROM BACIRO_FHIR.PATIENT_CONTACT pc LEFT JOIN BACIRO_FHIR.HUMAN_NAME hn ON hn.human_name_id = pc.human_name_id LEFT JOIN BACIRO_FHIR.ADDRESS addr ON pc.address_id = addr.address_id LEFT JOIN BACIRO_FHIR.CONTACT_POINT cp ON pc.patient_contact_id = cp.patient_contact_id " + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        var arrPatientContact = [];
        var newPatientContact = [];
        
        for(i = 0; i < rez.length; i++){
          index = i;
          countPatientContact = rez.length;
          var PatientContact = {id: "", relationship: "", name:{}, address: {}, telecom: []};
          // var 
          PatientContact.id = rez[i].patient_contact_id;
          PatientContact.relationship = rez[i].patient_contact_relationship;
          PatientContact.name.id = rez[i].human_name_id;
          PatientContact.name.use = rez[i].human_name_use;
          PatientContact.name.text = rez[i].human_name_text;
          PatientContact.name.family = rez[i].human_name_family;
          PatientContact.name.given = rez[i].human_name_given;
          PatientContact.name.prefix = rez[i].human_name_prefix;
          PatientContact.name.suffix = rez[i].human_name_suffix;

          if(rez[i].human_name_period_start == null){
            PatientContact.name.period_start = formatDate(rez[i].human_name_period_start);  
          }else{
            PatientContact.name.period_start = rez[i].human_name_period_start;  
          }

          if(rez[i].human_name_period_end == null){
            PatientContact.name.period_end = formatDate(rez[i].human_name_period_end);  
          }else{
            PatientContact.name.period_end = rez[i].human_name_period_end;  
          }

          PatientContact.address.id = rez[i].address_id;
          PatientContact.address.use = rez[i].address_use;
          PatientContact.address.type = rez[i].address_type;
          PatientContact.address.text = rez[i].address_text;
          PatientContact.address.line = rez[i].address_line;
          PatientContact.address.city = rez[i].address_city;
          PatientContact.address.district = rez[i].address_district;
          PatientContact.address.state = rez[i].address_state;
          PatientContact.address.postalCode = rez[i].address_postal_code;
          PatientContact.address.country = rez[i].address_country;

          if(rez[i].address_period_start == null){
            PatientContact.address.period_start = formatDate(rez[i].address_period_start);  
          }else{
            PatientContact.address.period_start = rez[i].address_period_start;  
          }

          if(rez[i].address_period_end == null){
            PatientContact.address.period_end = formatDate(rez[i].address_period_end);  
          }else{
            PatientContact.address.period_end = rez[i].address_period_end;  
          }
          if(rez[i].contact_point_period_start == null){
            contactPeriodStart = formatDate(rez[i].contact_point_period_start);
          }else{
            contactPeriodStart = rez[i].contact_point_period_start;
          }

          if(rez[i].contact_point_period_end == null){
            contactPeriodEnd = formatDate(rez[i].contact_point_period_end);
          }else{
            contactPeriodEnd = rez[i].contact_point_period_end;
          }

          PatientContact.telecom.push({
                                        id: rez[i].contact_point_id, 
                                        system: rez[i].contact_point_system, 
                                        value: rez[i].contact_point_value, 
                                        use: rez[i].contact_point_use, 
                                        rank: rez[i].contact_point_rank,
                                        period_start: contactPeriodStart,
                                        period_end: contactPeriodEnd
                                      });   

          PatientContact.gender = rez[i].patient_contact_gender;
          
          arrPatientContact[i] = PatientContact;
        }
        
        res.json({"err_code": 0, "data": arrPatientContact});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPatientContact"});
      });
    },
    patientLink: function getPatientLink(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      var patientId = req.query.patient_id;
      //susun query
      var condition = "";

      if(typeof patientId !== 'undefined' && patientId !== ""){
        condition += "patient_id = '" + patientId + "' AND,";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var query = "SELECT patient_link_id, patient_link_other_patient_id, patient_link_other_related_person_id, patient_link_type FROM BACIRO_FHIR.PATIENT_LINK" + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        var arrPatientLink = [];

        for(i = 0; i < rez.length; i++){
          var PatientLink = {};
          // var 
          PatientLink.id = rez[i].patient_link_id;
          if(rez[i].patient_link_other_patient_id !== "" || rez[i].patient_link_other_patient_id !== "null"){
            PatientLink.other = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient_link_other_patient_id;
          }else if(rez[i].patient_link_other_related_person_id !== "" || rez[i].patient_link_other_related_person_id !== "null"){
            PatientLink.other = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].patient_link_other_related_person_id;
          }else{
            PatientLink.other = "";
          }
          PatientLink.type = rez[i].patient_link_type;
          
          arrPatientLink[i] = PatientLink;
        }
        
        res.json({"err_code": 0, "data": arrPatientLink});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPatientLink"});
      });
    },
    generalPractitioner: function getGeneralPractitioner(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      var patientId = req.query.patient_id;
      //susun query
      var condition = "";

      if(typeof patientId !== 'undefined' && patientId !== ""){
        condition += "patient_id = '" + patientId + "' AND,";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var query = "SELECT general_practitioner_id, practitioner_id, organization_id FROM BACIRO_FHIR.GENERAL_PRACTITIONER" + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        var arrGeneralPractitioner = [];

        for(i = 0; i < rez.length; i++){
          if(rez[i].practitioner_id !== "" || rez[i].practitioner_id !== "null"){
            arrGeneralPractitioner.push({
                                        id: rez[i].general_practitioner_id, 
                                        url: hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' + rez[i].practitioner_id
                                      }); 
          }else if(rez[i].organization_id !== "" || rez[i].organization_id !== "null"){
            arrGeneralPractitioner.push({
                                        id: rez[i].organization_id, 
                                        url: hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' + rez[i].organization_id
                                      }); 
          }
        }
        res.json({"err_code": 0, "data": arrGeneralPractitioner});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getGeneralPractitioner"});
      });
    },
    patientCommunication: function getPatientCommunication(req, res){
      var patientId = req.query.patient_id;
      //susun query
      var condition = "";

      if(typeof patientId !== 'undefined' && patientId !== ""){
        condition += "patient_id = '" + patientId + "' AND,";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var query = "SELECT patient_communication_id, patient_communication_language, patient_communication_preferred FROM BACIRO_FHIR.PATIENT_COMMUNICATION" + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        var arrPatientCommunication = [];
        for(i = 0; i < rez.length; i++){
          var PatientCommunication = {};
          // var 
          PatientCommunication.id = rez[i].patient_communication_id;
          PatientCommunication.language = rez[i].patient_communication_language;
          PatientCommunication.preferred = rez[i].patient_communication_preferred;
          
          arrPatientCommunication[i] = PatientCommunication;
        }
        res.json({"err_code": 0, "data": arrPatientCommunication});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getPatientCommunication"});
      });
    }
  },
  post: {
    patient: function addPatient(req, res){
      var patient_id = req.body.id;
      var patient_active = req.body.active;
      var patient_birthdate = req.body.birthdate;
      var patient_gender = req.body.gender;
      var patient_deceased = req.body.deceased;
      var patient_deceased_date = req.body.deceased_date;

      if(req.body.deceased_date == ""){
        patient_deceased_date = null;
      }else{
        patient_deceased_date = "to_date('"+req.body.deceased_date+ "', 'yyyy-MM-dd')";
      }

      var patient_marital_status = req.body.marital_status;
      var patient_multiple_birth = req.body.multiple_birth;
      var patient_multiple_number = req.body.multiple_number;
      var patient_animal_id = req.body.animal_id;
      var organization_id = req.body.organization_id;
     
      if(organization_id == ""){
        organization_id = null;
      }

      var query = "UPSERT INTO BACIRO_FHIR.PATIENT(patient_id, patient_gender, patient_birthdate, patient_active, patient_animal_id, organization_id, patient_deceased, patient_deceased_date, patient_marital_status, patient_multiple_birth, patient_multiple_number)"+
        " VALUES ('"+patient_id+"', '"+patient_gender+"', to_date('" + patient_birthdate + "', 'yyyy-MM-dd'), "+patient_active+", '"+patient_animal_id+"' , '"+organization_id+"', "+patient_deceased+", " + patient_deceased_date + ", '"+ patient_marital_status +"', "+ patient_multiple_birth +", "+ patient_multiple_number +")";
      
      db.upsert(query,function(succes){
        var query = "SELECT patient_id, patient_gender, patient_birthdate, patient_active, patient_animal_id, organization_id, patient_deceased, patient_deceased_date, patient_marital_status, patient_multiple_birth, patient_multiple_number FROM BACIRO_FHIR.PATIENT WHERE patient_id = '" + patient_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPatient"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPatient"});
      });
    },
    patientAnimal: function addPatientAnimal(req, res){
      var patient_animal_id = req.body.id;
      var patient_animal_species = req.body.species;
      var patient_animal_breed = req.body.breed;
      var patient_animal_gender_status = req.body.gender_status;
      //susun query
      var column = "";
      var values = "";

      if(typeof patient_animal_species !== 'undefined' && patient_animal_species !== ""){
        column += 'patient_animal_species,';
        values += patient_animal_species +",";
      }

      if(typeof patient_animal_breed !== 'undefined' && patient_animal_breed !== ""){
        column += 'patient_animal_breed,';
        values += patient_animal_breed +",";
      }

      if(typeof patient_animal_gender_status !== 'undefined' && patient_animal_gender_status !== ""){
        column += 'patient_animal_gender_status,';
        values += "'"+ patient_animal_gender_status +"',";
      }
      
      var query = "UPSERT INTO BACIRO_FHIR.PATIENT_ANIMAL(patient_animal_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+patient_animal_id+"', " + values.slice(0, -1) + ")";
      
      db.upsert(query,function(succes){
        var query = "SELECT patient_animal_id, patient_animal_species, patient_animal_breed, patient_animal_gender_status FROM BACIRO_FHIR.PATIENT_ANIMAL WHERE patient_animal_id = '" + patient_animal_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPatientAnimal"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPatientAnimal"});
      });
    },
    patientLink: function addPatientLink(req, res){
      var patient_link_id = req.body.id;
      var patient_link_other_patient_id = req.body.link_other_patient_id;
      var patient_link_related_person_id = req.body.link_other_related_person_id;
      var patient_link_type = req.body.type;
      var patient_id = req.body.patient_id;
      //susun query
      var column = "";
      var values = "";

      if(typeof patient_link_other_patient_id !== 'undefined' && patient_link_other_patient_id !== ""){
        column += 'patient_link_other_patient_id,';
        values += "'"+ patient_link_other_patient_id +"',";
      }

      if(typeof patient_link_related_person_id !== 'undefined' && patient_link_related_person_id !== ""){
        column += 'patient_link_related_person_id,';
        values += "'"+ patient_link_related_person_id +"',";
      }

      if(typeof patient_link_type !== 'undefined' && patient_link_type !== ""){
        column += 'patient_link_type,';
        values += "'"+ patient_link_type +"',";
      }

      if(typeof patient_id !== 'undefined' && patient_id !== ""){
        column += 'patient_id,';
        values += "'"+ patient_id +"',";
      }
      
      var query = "UPSERT INTO BACIRO_FHIR.PATIENT_LINK(patient_link_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+patient_link_id+"', " + values.slice(0, -1) + ")";
      
      db.upsert(query,function(succes){
        var query = "SELECT patient_link_id, patient_link_other_patient_id, patient_link_related_person_id, patient_link_type, patient_id FROM BACIRO_FHIR.PATIENT_LINK WHERE patient_link_id = '" + patient_link_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPatientLink"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPatientLink"});
      });
    },
    patientCommunication: function addPatientCommunication(req, res){
      var patient_communication_id = req.body.id;
      var patient_communication_language = req.body.language;
      var patient_communication_preferred = req.body.preferred;
      var patient_id = req.body.patient_id;
      //susun query
      var column = "";
      var values = "";

      if(typeof patient_communication_language !== 'undefined' && patient_communication_language !== ""){
        column += 'patient_communication_language,';
        values += "'"+ patient_communication_language +"',";
      }

      if(typeof patient_communication_preferred !== 'undefined' && patient_communication_preferred !== ""){
        column += 'patient_communication_preferred,';
        values +=  patient_communication_preferred +",";
      }

      if(typeof patient_id !== 'undefined' && patient_id !== ""){
        column += 'patient_id,';
        values += "'"+ patient_id +"',";
      }
      
      var query = "UPSERT INTO BACIRO_FHIR.PATIENT_COMMUNICATION(patient_communication_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+patient_communication_id+"', " + values.slice(0, -1) + ")";
      
      db.upsert(query,function(succes){
        var query = "SELECT patient_communication_id, patient_communication_language, patient_communication_preferred, patient_id FROM BACIRO_FHIR.PATIENT_COMMUNICATION WHERE patient_communication_id = '" + patient_communication_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPatientCommunication"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPatientCommunication"});
      });
    },
    patientContact: function addPatientContact(req, res){
      var patient_contact_id = req.body.id;
      var patient_contact_relationship = req.body.relationship;
      var patient_contact_gender = req.body.gender;
      var human_name_id = req.body.human_name_id;
      var address_id = req.body.address_id;
      var organization_id = req.body.organization_id;
      var patient_id = req.body.patient_id;
      //susun query
      var column = "";
      var values = "";

      if(typeof patient_contact_relationship !== 'undefined' && patient_contact_relationship !== ""){
        column += 'patient_contact_relationship,';
        values += "'"+ patient_contact_relationship +"',";
      }

      if(typeof patient_contact_gender !== 'undefined' && patient_contact_gender !== ""){
        column += 'patient_contact_gender,';
        values += "'"+ patient_contact_gender +"',";
      }

      if(typeof req.body.period_start !== 'undefined'){
        if(req.body.period_start == ""){
          patient_contact_period_start = null;
        }else{
          patient_contact_period_start = "to_date('"+req.body.period_start+ "', 'yyyy-MM-dd')";
        }

        column += 'patient_contact_period_start,';
        values += patient_contact_period_start + ",";
      }

      if(typeof req.body.period_end !== 'undefined'){
        if(req.body.period_end == ""){
          patient_contact_period_end = null;
        }else{
          patient_contact_period_end = "to_date('"+req.body.period_end+ "', 'yyyy-MM-dd')";
        }

        column += 'patient_contact_period_end,';
        values += patient_contact_period_end + ",";
      }

      if(typeof human_name_id !== 'undefined' && human_name_id !== ""){
        column += 'human_name_id,';
        values += "'"+ human_name_id +"',";
      }

      if(typeof address_id !== 'undefined' && address_id !== ""){
        column += 'address_id,';
        values += "'"+ address_id +"',";
      }

      if(typeof organization_id !== 'undefined' && organization_id !== ""){
        column += 'organization_id,';
        values += "'"+ organization_id +"',";
      }

      if(typeof patient_id !== 'undefined' && patient_id !== ""){
        column += 'patient_id,';
        values += "'"+ patient_id +"',";
      }
      
      var query = "UPSERT INTO BACIRO_FHIR.PATIENT_CONTACT(patient_contact_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+patient_contact_id+"', " + values.slice(0, -1) + ")";
      
      db.upsert(query,function(succes){
        var query = "SELECT patient_contact_id, patient_contact_relationship, patient_contact_gender, patient_contact_period_start, patient_contact_period_end, human_name_id, address_id, organization_id, patient_id FROM BACIRO_FHIR.PATIENT_CONTACT WHERE patient_contact_id = '" + patient_contact_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addPatientContact"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addPatientContact"});
      });
    },
    generalPractitioner: function addGeneralPractitioner(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      var general_practitioner_id = req.body.id;
      var organization_id = req.body.organization_id;
      var practitioner_id = req.body.practitioner_id;
      var patient_id = req.body.patient_id;
      //susun query
      var column = "";
      var values = "";

      if(typeof organization_id !== 'undefined' && organization_id !== ""){
        column += 'organization_id,';
        values += "'"+ organization_id +"',";
      }

      if(typeof practitioner_id !== 'undefined' && practitioner_id !== ""){
        column += 'practitioner_id,';
        values += "'"+ practitioner_id +"',";
      }

      if(typeof patient_id !== 'undefined' && patient_id !== ""){
        column += 'patient_id,';
        values += "'"+ patient_id +"',";
      }
      
      var query = "UPSERT INTO BACIRO_FHIR.GENERAL_PRACTITIONER(general_practitioner_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+general_practitioner_id+"', " + values.slice(0, -1) + ")";
      
      db.upsert(query,function(succes){
        var arrGeneralPractitioner = [];
        var query = "SELECT general_practitioner_id, patient_id, practitioner_id, organization_id FROM BACIRO_FHIR.GENERAL_PRACTITIONER WHERE general_practitioner_id = '" + general_practitioner_id + "' AND patient_id = '"+ patient_id +"' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var GeneralPractitioner = {};
            GeneralPractitioner.id = rez[i].general_practitioner_id;
            if(rez[i].practitioner_id !== "" || rez[i].practitioner_id !== null){
              GeneralPractitioner.generalPractitioner = host + ':' + port + '/' + apikey + '/Practitioner?_id=' + rez[i].practitioner_id;
            }else if (rez[i].organization_id !== "" || rez[i].organization_id !== null){
              GeneralPractitioner.generalPractitioner = host + ':' + port + '/' + apikey + '/Organization?_id=' + rez[i].organization_id;
            }else{
              GeneralPractitioner.generalPractitioner = "";
            }

            arrGeneralPractitioner[i] = GeneralPractitioner;
          }
          res.json({"err_code":0,"data": arrGeneralPractitioner});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addGeneralPractitioner"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addGeneralPractitioner"});
      });
    }
  },
  put:{
    patient: function updatePatient(req, res){
      var patient_id = req.params.patient_id;

      var patient_gender = req.body.gender;
      var patient_birthdate = req.body.birthdate;
      var patient_deceased = req.body.deceased;
      var patient_deceased_date = req.body.deceased_date;
      var patient_marital_status = req.body.marital_status;
      var patient_multiple_birth = req.body.multiple_birth;
      var patient_multiple_number = req.body.multiple_number;
      var organization_id = req.body.managing_organization;

      //patient_animal
      var patient_animal_species = req.body.species;
      var patient_animal_breed = req.body.breed;
      var patient_animal_gender_status = req.body.gender_status;
      var patient_animal_id = req.body.animal_id;

      //patient_communication
      var patient_communication_language = req.body.communication;      
      var patient_communication_preferred = req.body.preferred;
      var patient_communication_id = req.body.communication_id;

      //general_practitioner
      var general_practitioner_practitioner_id = req.body.general_practitioner_practitioner_id;
      var general_practitioner_organization_id = req.body.general_practitioner_organization_id;
      var general_practitioner_id = req.body.general_practitioner_id;

      //patient_link
      var patient_link_other_patient_id = req.body.link_other_patient_id;
      var patient_link_other_related_person_id = req.body.link_other_related_person_id;
      var patient_link_type = req.body.link_type;
      var patient_link_id = req.body.link_other_id;

      //susun query update
      var column = "";
      var values = "";

      var columnAnimal = "";
      var valuesAnimal = "";

      var columnCommunication = "";
      var valuesCommunication = "";

      var columnGeneralPractitioner = "";
      var valuesGeneralPractitioner = "";

      var columnPatientLink = "";
      var valuesPatientLink = "";

      if(typeof patient_animal_id !== 'undefined' && patient_animal_id !== ""){
        if(typeof patient_animal_species !== 'undefined'){
          columnAnimal += 'patient_animal_species,';
          valuesAnimal += "'" +patient_animal_species +"',";  
        }

        if(typeof patient_animal_breed !== 'undefined'){
          columnAnimal += 'patient_animal_breed,';
          valuesAnimal += "'" +patient_animal_breed +"',";  
        }

        if(typeof patient_animal_gender_status !== 'undefined'){
          columnAnimal += 'patient_animal_gender_status,';
          valuesAnimal += "'" +patient_animal_gender_status +"',";  
        }

        var conditionAnimal = "patient_animal_id = '" + patient_animal_id + "'";
        var query = "UPSERT INTO BACIRO_FHIR.PATIENT_ANIMAL(patient_animal_id," + columnAnimal.slice(0, -1) + ") SELECT patient_animal_id, " + valuesAnimal.slice(0, -1) + " FROM BACIRO_FHIR.PATIENT_ANIMAL WHERE " + conditionAnimal;

        db.upsert(query,function(succes){
          console.log("Patient Animal has been update.");
        },function(e){
          console.log("Error updating patient animal.");
        })
      }

      if(typeof patient_communication_id !== 'undefined' && patient_communication_id !== ""){
        if(typeof patient_communication_language !== 'undefined'){
          columnCommunication += 'patient_communication_language,';
          valuesCommunication += "'" +patient_communication_language +"',";  
        }

        if(typeof patient_communication_preferred !== 'undefined'){
          columnCommunication += 'patient_communication_preferred,';
          valuesCommunication += "'" +patient_communication_preferred +"',";  
        }

        var conditionCommunication = "patient_communication_id = '" + patient_communication_id + "' AND patient_id = '" + patient_id + "' ";
        var query = "UPSERT INTO BACIRO_FHIR.PATIENT_COMMUNICATION(patient_communication_id," + columnCommunication.slice(0, -1) + ") SELECT patient_communication_id, " + valuesCommunication.slice(0, -1) + " FROM BACIRO_FHIR.PATIENT_COMMUNICATION WHERE " + conditionCommunication;

        db.upsert(query,function(succes){
          console.log("Patient communication has been update.");
        },function(e){
          console.log("Error updating patient communication.");
        })
      }

      if(typeof general_practitioner_id !== 'undefined' && general_practitioner_id !== ""){
        if(typeof general_practitioner_organization_id !== 'undefined'){
          columnGeneralPractitioner += 'organization_id,';
          valuesGeneralPractitioner += "'" +general_practitioner_organization_id +"',";  
        }

        if(typeof general_practitioner_practitioner_id !== 'undefined'){
          columnGeneralPractitioner += 'practitioner_id,';
          valuesGeneralPractitioner += "'" +general_practitioner_practitioner_id +"',";  
        }

        var conditionGeneralPractitioner = "general_practitioner_id = '" + general_practitioner_id + "' AND patient_id = '" + patient_id + "' ";
        var query = "UPSERT INTO BACIRO_FHIR.GENERAL_PRACTITIONER(general_practitioner_id," + columnGeneralPractitioner.slice(0, -1) + ") SELECT general_practitioner_id, " + valuesGeneralPractitioner.slice(0, -1) + " FROM BACIRO_FHIR.GENERAL_PRACTITIONER WHERE " + conditionGeneralPractitioner;

        db.upsert(query,function(succes){
          console.log("General Practitioner has been update.");
        },function(e){
          console.log("Error updating general practitioner.");
        })
      }

      if(typeof patient_link_id !== 'undefined' && patient_link_id !== ""){
        if(typeof patient_link_other_patient_id !== 'undefined'){
          columnPatientLink += 'patient_link_other_patient_id,';
          valuesPatientLink += "'" +patient_link_other_patient_id +"',";  
        }

        if(typeof patient_link_other_related_person_id !== 'undefined'){
          columnPatientLink += 'patient_link_other_related_person_id,';
          valuesPatientLink += "'" +patient_link_other_related_person_id +"',";  
        }

        if(typeof patient_link_type !== 'undefined'){
          columnPatientLink += 'patient_link_type,';
          valuesPatientLink += "'" +patient_link_type +"',";  
        }

        var conditionPatientLink = "patient_link_id = '" + patient_link_id + "' AND patient_id = '" + patient_id + "' ";
        var query = "UPSERT INTO BACIRO_FHIR.PATIENT_LINK(patient_link_id," + columnPatientLink.slice(0, -1) + ") SELECT patient_link_id, " + valuesPatientLink.slice(0, -1) + " FROM BACIRO_FHIR.PATIENT_LINK WHERE " + conditionPatientLink;

        db.upsert(query,function(succes){
          console.log("Patient Link has been update.");
        },function(e){
          console.log("Error updating patient link.");
        })
      }


      if(typeof patient_gender !== 'undefined' && patient_gender !== ""){
        column += 'patient_gender,';
        values += "'" +patient_gender +"',";
      }

      if(typeof patient_birthdate !== 'undefined' && patient_birthdate !== ""){
        column += 'patient_birthdate,';
        values += "to_date('" + patient_birthdate +"', 'yyyy-MM-dd'),";
      }

      if(typeof patient_deceased !== 'undefined' && patient_deceased !== ""){
        column += 'patient_deceased,';
        values += patient_deceased +",";
      }

      if(typeof patient_deceased_date !== 'undefined' && patient_deceased_date !== ""){
        column += 'patient_deceased_date,';
        values += "to_date('" + patient_deceased_date +"', 'yyyy-MM-dd'),";
      }

      if(typeof patient_marital_status !== 'undefined' && patient_marital_status !== ""){
        column += 'patient_marital_status,';
        values += "'" +patient_marital_status +"',";
      }

      if(typeof patient_multiple_birth !== 'undefined' && patient_multiple_birth !== ""){
        column += 'patient_multiple_birth,';
        values += patient_multiple_birth +",";
      }

      if(typeof patient_multiple_number !== 'undefined' && patient_multiple_number !== ""){
        column += 'patient_multiple_number,';
        values += patient_multiple_number +",";
      }

      if(typeof organization_id !== 'undefined' && organization_id !== ""){
        column += 'organization_id,';
        values += "'" +organization_id +"',";
      }

      if(column == ""){
        res.json({"err_code":0, "err_msg": "Success updated."});
      }else{
        var condition = "patient_id = '" + patient_id + "'";

        var query = "UPSERT INTO BACIRO_FHIR.PATIENT(patient_id," + column.slice(0, -1) + ") SELECT patient_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PATIENT WHERE " + condition;
        
        db.upsert(query,function(succes){
          res.json({"err_code":0, "err_msg": "Success updated."});          
        },function(e){
            res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePatient"});
        });
      }
    },
    patientContact: function updatePatientContact(req, res){
      var patient_contact_id = req.params.patient_contact_id;

      var patient_contact_gender = req.body.gender;
      var patient_contact_relationship = req.body.relationship;
      var patient_contact_period_start = req.body.period_start;
      var patient_contact_period_end = req.body.period_end;
      var organization_id = req.body.organization;

      var domainResource = req.params.dr;

      //susun query update
      var column = "";
      var values = "";
      
      if(typeof patient_contact_gender !== 'undefined' && patient_contact_gender !== ""){
        column += 'patient_contact_gender,';
        values += "'" +patient_contact_gender +"',";
      }

      if(typeof patient_contact_relationship !== 'undefined' && patient_contact_relationship !== ""){
        column += 'patient_contact_relationship,';
        values += "'" +patient_contact_relationship +"',";
      }
      
      if(typeof patient_contact_period_start !== 'undefined' && patient_contact_period_start !== ""){
        column += 'patient_contact_period_start,';
        values += "to_date('" + patient_contact_period_start +"', 'yyyy-MM-dd'),";
      }

      if(typeof patient_contact_period_end !== 'undefined' && patient_contact_period_end !== ""){
        column += 'patient_contact_period_end,';
        values += "to_date('" + patient_contact_period_end +"', 'yyyy-MM-dd'),";
      }

      if(typeof organization_id !== 'undefined' && organization_id !== ""){
        column += 'organization_id,';
        values += "'" +organization_id +"',";
      }

      var arrResource = domainResource.split('|');
      var fieldResource = arrResource[0];
      var valueResource = arrResource[1];
      var condition = "patient_contact_id = '" + patient_contact_id + "' AND " + fieldResource +" = '"+ valueResource +"'";

      var query = "UPSERT INTO BACIRO_FHIR.PATIENT_CONTACT(patient_contact_id," + column.slice(0, -1) + ") SELECT patient_contact_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PATIENT_CONTACT WHERE " + condition;
      
      db.upsert(query,function(succes){
        res.json({"err_code":0, "err_msg": "Success updated."});          
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updatePatientContact"});
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