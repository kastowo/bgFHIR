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
    checkId: function getCheckId(req, res){
      var id = req.params.id;
      var name = req.params.name;
      var condition = '';

      var query = "SELECT id FROM BACIRO_FHIR." + name + " WHERE id = " + id;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getCheckId"});
      });
    },
    checkCode: function getCheckCode(req, res){
      var code = req.params.code;
      var name = req.params.name;
      var condition = '';

      var query = "SELECT id FROM BACIRO_FHIR." + name + " WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getCheckCode"});
      });
    },
    checkUniqeValue: function getCheckUniqeValue(req, res){
      var fdvalue = req.params.fdvalue;
      var tbname = req.params.tbname;
      var condition = '';

      arrValue = fdvalue.split('|');
      field = arrValue[0];
      values = arrValue[1];

      var query = "SELECT " + field + " FROM BACIRO_FHIR." + tbname + " WHERE " + field + " = '" + values + "'" ;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getCheckUniqeValue"});
      });
    },
    checkGroupQuota: function getCheckGroupQuota(req, res){
      var group_id = req.params.group_id;

      var query = "SELECT COUNT(*) total_member, g.group_quantity quantity from BACIRO_FHIR.GROUP_MEMBER gm left join BACIRO_FHIR.GROUP_ g ON g.group_id = gm.group_id WHERE gm.group_id = '"+ group_id +"' GROUP BY g.group_quantity";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getCheckGroupQuota"});
      });
    },
    checkMemberEntityGroup: function getCheckMemberEntityGroup(req, res){
      var group_id = req.params.group_id;
      var entity = req.params.entity_id;
      
      arrEntity = entity.split('|');
      field = arrEntity[0];
      value = arrEntity[1];
      condition = field + " = '" + value + "'";

      var query = "SELECT group_member_id from BACIRO_FHIR.GROUP_MEMBER WHERE " + condition + " AND group_id = '"+ group_id +"' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getCheckGroupQuota"});
      });
    },
    Identifier: function getIdentifier(req, res){
      var apikey = req.params.apikey;

      var identifierId = req.query._id;
      var personId = req.query.person_id;
      var patientId = req.query.patient_id;
      var relatedPersonId = req.query.related_person_id;
      
      //susun query
      var condition = "";
      var systemURI = "";

      if(typeof identifierId !== 'undefined' && identifierId !== ""){
        condition += "identifier_id = '" + identifierId + "' AND ";  
      }

      if(typeof personId !== 'undefined' && personId !== ""){
        condition += "person_id = '" + personId + "' AND ";  
        systemURI = hostFHIR + ':' + portFHIR + '/' + apikey + '/Person/' + personId + '/Identifier/';
      }

      if(typeof patientId !== 'undefined' && patientId !== ""){
        condition += "i.patient_id = '" + patientId + "' AND ";  
        systemURI = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient/' + patientId + '/Identifier/';
      }

      if(typeof relatedPersonId !== 'undefined' && relatedPersonId !== ""){
        condition += "i.related_person_id = '" + relatedPersonId + "' AND ";  
        systemURI = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson/' + relatedPersonId + '/Identifier/';
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var arrIdentifier = [];
      var query = "SELECT identifier_id, identifier_use, identifier_type, identifier_system, identifier_value, identifier_period_start, identifier_period_end, org.organization_id as organization_id FROM BACIRO_FHIR.IDENTIFIER i LEFT JOIN BACIRO_FHIR.ORGANIZATION org on i.organization_id = org.organization_id " + fixCondition; //join ke organization
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Identifier = {};
          Identifier.id = rez[i].identifier_id;
          Identifier.use = rez[i].identifier_use;
          Identifier.type = rez[i].identifier_type;
          Identifier.system = systemURI + rez[i].identifier_system;
          Identifier.value = rez[i].identifier_value;
          Identifier.period = formatDate(rez[i].identifier_period_start)+' to '+ formatDate(rez[i].identifier_period_end);
          Identifier.assigner = rez[i].organization_id;
          
          arrIdentifier[i] = Identifier;
        }
        res.json({"err_code":0,"data": arrIdentifier});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getIdentifier"});
      });
    },
    HumanName: function getHumanName(req, res){
      var humanNameId = req.query._id;
      var personId = req.query.person_id;
      var patientId = req.query.patient_id;
      var relatedPersonId = req.query.related_person_id;

      //susun query
      var condition = "";

      if(typeof humanNameId !== 'undefined' && humanNameId !== ""){
        condition += "human_name_id = '" + humanNameId + "' AND ";  
      }

      if(typeof personId !== 'undefined' && personId !== ""){
        condition += "person_id = '" + personId + "' AND ";  
      }

      if(typeof patientId !== 'undefined' && patientId !== ""){
        condition += "patient_id = '" + patientId + "' AND ";  
      }

      if(typeof relatedPersonId !== 'undefined' && relatedPersonId !== ""){
        condition += "related_person_id = '" + relatedPersonId + "' AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var arrHumanName = [];
      var query = "SELECT human_name_id, human_name_use, human_name_text, human_name_family, human_name_given, human_name_prefix, human_name_suffix, human_name_period_start, human_name_period_end  FROM BACIRO_FHIR.HUMAN_NAME " + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var HumanName = {};
          HumanName.id = rez[i].human_name_id;
          HumanName.use = rez[i].human_name_use;
          HumanName.text = rez[i].human_name_text;
          HumanName.family = rez[i].human_name_family;
          HumanName.given = rez[i].human_name_given;
          HumanName.prefix = rez[i].human_name_prefix;
          HumanName.suffix = rez[i].human_name_suffix;

          if(rez[i].human_name_period_start == null){
            HumanName.period_start = formatDate(rez[i].human_name_period_start);  
          }else{
            HumanName.period_start = rez[i].human_name_period_start;  
          }

          if(rez[i].human_name_period_end == null){
            HumanName.period_end = formatDate(rez[i].human_name_period_end);  
          }else{
            HumanName.period_end = rez[i].human_name_period_end;  
          }
               
          arrHumanName[i] = HumanName;
        }
        res.json({"err_code":0,"data": arrHumanName});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getHumanName"});
      });
    },
    ContactPoint: function getContactPoint(req, res){
      var contactPointId = req.query._id;
      var personId = req.query.person_id;
      var patientId = req.query.patient_id;
      var patientContactId = req.query.patient_contact_id;
      var relatedPersonId = req.query.related_person_id;

      //susun query
      var condition = "";

      if(typeof contactPointId !== 'undefined' && contactPointId !== ""){
        condition += "contact_point_id = '" + contactPointId + "' AND ";  
      }

      if(typeof personId !== 'undefined' && personId !== ""){
        condition += "person_id = '" + personId + "' AND ";  
      }

      if(typeof patientId !== 'undefined' && patientId !== ""){
        condition += "patient_id = '" + patientId + "' AND ";  
      }

      if(typeof patientContactId !== 'undefined' && patientContactId !== ""){
        condition += "patient_contact_id = '" + patientContactId + "' AND ";  
      }

      if(typeof relatedPersonId !== 'undefined' && relatedPersonId !== ""){
        condition += "related_person_id = '" + relatedPersonId + "' AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var arrContactPoint = [];
      var query = "SELECT contact_point_id, contact_point_system, contact_point_value, contact_point_use, contact_point_rank, contact_point_period_start, contact_point_period_end FROM BACIRO_FHIR.CONTACT_POINT " + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var ContactPoint = {};
          ContactPoint.id = rez[i].contact_point_id;
          ContactPoint.system = rez[i].contact_point_system;
          ContactPoint.value = rez[i].contact_point_value;
          ContactPoint.use = rez[i].contact_point_use;
          ContactPoint.rank = rez[i].contact_point_rank;

          if(rez[i].contact_point_period_start == null){
            ContactPoint.period_start = formatDate(rez[i].contact_point_period_start);  
          }else{
            ContactPoint.period_start = rez[i].contact_point_period_start;  
          }

          if(rez[i].contact_point_period_end == null){
            ContactPoint.period_end = formatDate(rez[i].contact_point_period_end);  
          }else{
            ContactPoint.period_end = rez[i].contact_point_period_end;  
          }
               
          arrContactPoint[i] = ContactPoint;
        }
        res.json({"err_code":0,"data": arrContactPoint});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getContactPoint"});
      });
    },
    Address: function getAddress(req, res){
      var addressId = req.query._id;
      var personId = req.query.person_id;
      var patientId = req.query.patient_id;
      var relatedPersonId = req.query.related_person_id;

      //susun query
      var condition = "";

      if(typeof addressId !== 'undefined' && addressId !== ""){
        condition += "address_id = '" + addressId + "' AND ";  
      }

      if(typeof personId !== 'undefined' && personId !== ""){
        condition += "person_id = '" + personId + "' AND ";  
      }

      if(typeof patientId !== 'undefined' && patientId !== ""){
        condition += "patient_id = '" + patientId + "' AND ";  
      }

      if(typeof relatedPersonId !== 'undefined' && relatedPersonId !== ""){
        condition += "related_person_id = '" + relatedPersonId + "' AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var arrAddress = [];
      var query = "SELECT address_id, address_use, address_type, address_text, address_line, address_city, address_district, address_state, address_postal_code, address_country, address_period_start, address_period_end FROM BACIRO_FHIR.ADDRESS " + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Address = {};
          Address.id = rez[i].address_id;
          Address.use = rez[i].address_use;
          Address.type = rez[i].address_type;
          Address.text = rez[i].address_text;
          Address.line = rez[i].address_line;
          Address.city = rez[i].address_city;
          Address.district = rez[i].address_district;
          Address.state = rez[i].address_state;
          Address.postal_code = rez[i].address_postal_code;
          Address.country = rez[i].address_country;

          if(rez[i].address_period_start == null){
            Address.period_start = formatDate(rez[i].address_period_start);  
          }else{
            Address.period_start = rez[i].address_period_start;  
          }

          if(rez[i].address_period_end == null){
            Address.period_end = formatDate(rez[i].address_period_end);  
          }else{
            Address.period_end = rez[i].address_period_end;  
          }
               
          arrAddress[i] = Address;
        }
        res.json({"err_code":0,"data": arrAddress});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getAddress"});
      });
    },
    Attachment: function getAttachment(req, res){
      var apikey = req.params.apikey;
      var attachmentId = req.query._id;
      var patientId = req.query.patient_id;
      var relatedPersonId = req.query.related_person_id;
      var personId = req.query.person_id;

      //susun query
      var condition = "";
      var systemURI = "";

      if(typeof patientId !== 'undefined' && patientId !== ""){
        condition += "patient_id = '" + patientId + "' AND ";  
        systemURI = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient/'+patientId+'/Photo/';
      }

      if(typeof attachmentId !== 'undefined' && attachmentId !== ""){
        condition += "attachment_id = '" + attachmentId + "' AND ";  
      }

      if(typeof relatedPersonId !== 'undefined' && relatedPersonId !== ""){
        condition += "related_person_id = '" + relatedPersonId + "' AND ";  
        systemURI = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson/'+relatedPersonId+'/Photo/';
      }

      if(typeof personId !== 'undefined' && personId !== ""){
        systemURI = hostFHIR + ':' + portFHIR + '/' + apikey + '/Person/'+personId+'/Photo/';
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var arrAttachment = [];
      var query = "SELECT attachment_id, attachment_content_type, attachment_language, attachment_url, attachment_size, attachment_hash, attachment_title, attachment_creation, attachment_data FROM BACIRO_FHIR.ATTACHMENT " + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Attachment = {};
          Attachment.id = rez[i].attachment_id;
          Attachment.type = rez[i].attachment_content_type;
          Attachment.language = rez[i].attachment_language;
          Attachment.url = systemURI + rez[i].attachment_url;
          Attachment.size = rez[i].attachment_size; //attachmentSize = bytes(attachmentSize);
          Attachment.hash = rez[i].attachment_hash;
          Attachment.title = rez[i].attachment_title;
          Attachment.data = rez[i].attachment_data;
          

          if(rez[i].attachment_creation == null){
            Attachment.creation = formatDate(rez[i].attachment_creation);  
          }else{
            Attachment.creation = rez[i].attachment_creation;  
          }
               
          arrAttachment[i] = Attachment;
        }
        res.json({"err_code":0,"data": arrAttachment});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getAttachment"});
      });
    },
    identityAssuranceLevel: function getIdentityAssuranceLevel(req, res){
      id = req.params._id;
      if(id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ id;
      }
      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL " + condition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getIdentityAssuranceLevel"});
      });
    },
    identityAssuranceLevelCode: function getIdentityAssuranceLevelCode(req, res){
      code = req.params.code;
      
      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getIdentityAssuranceLevelCode"});
      });
    },
    administrativeGender: function getAdministrativeGender(req, res){
      id = req.params._id;
      if(id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ id;
      }
      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADMINISTRATIVE_GENDER " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdministrativeGender"});
      });
    },
    administrativeGenderCode: function getAdministrativeGenderCode(req, res){
      code = req.params.code;
      
      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADMINISTRATIVE_GENDER WHERE code = '" + code + "' " ;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAdministrativeGenderCode"});
      });
    },
    maritalStatus: function getMaritalStatus(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.MARITAL_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMaritalStatus"});
      });
    },
    maritalStatusCode: function getMaritalStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.MARITAL_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getMaritalStatus"});
      });
    },
    contactRole: function getContactRole(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, description FROM BACIRO_FHIR.CONTACT_ROLE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getContactRole"});
      });
    },
    contactRoleCode: function getContactRoleCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, description FROM BACIRO_FHIR.CONTACT_ROLE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getContactRoleCode"});
      });
    },
    animalSpecies: function getAnimalSpecies(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_SPECIES " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAnimalSpecies"});
      });
    },
    animalSpeciesCode: function getAnimalSpeciesCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_SPECIES WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAnimalSpeciesCode"});
      });
    },
    animalBreeds: function getAnimalBreeds(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_BREEDS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAnimalBreeds"});
      });
    },
    animalBreedsCode: function getAnimalBreedsCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_BREEDS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAnimalBreedsCode"});
      });
    },
    animalGenderStatus: function getAnimalGenderStatus(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ANIMAL_GENDER_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAnimalGenderStatus"});
      });
    },
    animalGenderStatusCode: function getAnimalGenderStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ANIMAL_GENDER_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAnimalGenderStatusCode"});
      });
    },
    languages: function getLanguages(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM BACIRO_FHIR.LANGUAGES " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getLanguages"});
      });
    },
    languagesCode: function getLanguagesCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.LANGUAGES WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getLanguagesCode"});
      });
    },
    linkType: function getLinkType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LINK_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getLinkType"});
      });
    },
    linkTypeCode: function getLinkTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LINK_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getLinkTypeCode"});
      });
    },
    relatedPersonRelationshipType: function getRelatedPersonRelationshipType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRelatedPersonRelationshipType"});
      });
    },
    relatedPersonRelationshipTypeCode: function getRelatedPersonRelationshipTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getRelatedPersonRelationshipTypeCode"});
      });
    },
    groupType: function getGroupType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GROUP_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getGroupType"});
      });
    },
    groupTypeCode: function getGroupTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GROUP_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getGroupTypeCode"});
      });
    },
    identifierUse: function getIdentifierUse(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTIFIER_USE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getIdentifierUse"});
      });
    },
    identifierUseCode: function getIdentifierUseCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTIFIER_USE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getIdentifierUseCode"});
      });
    },
    identifierType: function getIdentifierType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display FROM BACIRO_FHIR.IDENTIFIER_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getIdentifierType"});
      });
    },
    identifierTypeCode: function getIdentifierTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display FROM BACIRO_FHIR.IDENTIFIER_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getIdentifierTypeCode"});
      });
    },
    nameUse: function getNameUse(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.NAME_USE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getNameUse"});
      });
    },
    nameUseCode: function getNameUseCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.NAME_USE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getNameUseCode"});
      });
    },
    contactPointSystem: function getContactPointSystem(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_SYSTEM " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getContactPointSystem"});
      });
    },
    contactPointSystemCode: function getContactPointSystemCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_SYSTEM WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getContactPointSystemCode"});
      });
    },
    contactPointUse: function getContactPointUse(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_USE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getContactPointUse"});
      });
    },
    contactPointUseCode: function getContactPointUseCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_USE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getContactPointUseCode"});
      });
    },
    addressUse: function getAddressUse(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_USE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAddressUse"});
      });
    },
    addressUseCode: function getAddressUseCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_USE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAddressUseCode"});
      });
    },
    addressType: function getAddressType(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_TYPE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAddressType"});
      });
    },
    addressTypeCode: function getAddressTypeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_TYPE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAddressTypeCode"});
      });
    },
    appointmentReasonCode: function getAppointmentReasonCode(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, description FROM BACIRO_FHIR.APPOINTMENT_REASON_CODE " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAppointmentReasonCode"});
      });
    },
    appointmentReasonCodeCode: function getAppointmentReasonCodeCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, description FROM BACIRO_FHIR.APPOINTMENT_REASON_CODE WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAppointmentReasonCodeCode"});
      });
    },
    slotStatus: function getSlotStatus(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SLOT_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSlotStatus"});
      });
    },
    slotStatusCode: function getSlotStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SLOT_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getSlotStatusCode"});
      });
    },
    appointmentStatus: function getAppointmentStatus(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.APPOINTMENT_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAppointmentStatus"});
      });
    },
    appointmentStatusCode: function getAppointmentStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.APPOINTMENT_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getAppointmentStatusCode"});
      });
    },
    participantRequired: function getParticipantRequired(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPANT_REQUIRED " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getParticipantRequired"});
      });
    },
    participantRequiredCode: function getParticipantRequiredCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPANT_REQUIRED WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getParticipantRequiredCode"});
      });
    },
    participationStatus: function getparticipationStatus(req, res){
      _id = req.params._id;

      if(_id == 0){
        condition = "";
      }else{
        condition = "WHERE id = "+ _id;
      }

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPATION_STATUS " + condition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getparticipationStatus"});
      });
    },
    participationStatusCode: function getparticipationStatusCode(req, res){
      code = req.params.code;

      var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPATION_STATUS WHERE code = '" + code + "' ";
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        res.json({"err_code":0,"data":rez});
      },function(e){
        res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "getparticipationStatusCode"});
      });
    }
  },
  post: {
    identityAssuranceLevel: function addIdentityAssuranceLevel(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL_AUTO_ID,'"+code+"','"+display+"', '"+definition+"')";

      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addIdentityAssuranceLevel"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addIdentityAssuranceLevel"});
      });
    },
    administrativeGender: function addAdministrativeGender(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ADMINISTRATIVE_GENDER(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ADMINISTRATIVE_GENDER_AUTO_ID,'"+code+"','"+display+"', '"+definition+"')";

      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADMINISTRATIVE_GENDER WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAdministrativeGender"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAdministrativeGender"});
      });
    },
    maritalStatus: function addMaritalStatus(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      var system = req.body.system;
     
      var query = "UPSERT INTO BACIRO_FHIR.MARITAL_STATUS(id, code, display, definition, system)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.MARITAL_STATUS_AUTO_ID,'"+code+"','"+display+"', '"+definition+"', '"+system+"')";

      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition, system FROM BACIRO_FHIR.MARITAL_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMaritalStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMaritalStatus"});
      });
    },
    contactRole: function addContactRole(req, res){
      var code = req.body.code;
      var description = req.body.description;
     
      var query = "UPSERT INTO BACIRO_FHIR.CONTACT_ROLE(id, code, description)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CONTACT_ROLE_AUTO_ID,'"+code+"','"+description+"')";

      db.upsert(query,function(succes){
        var query = "SELECT id, code, description FROM BACIRO_FHIR.CONTACT_ROLE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addContactRole"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addContactRole"});
      });
    },
    animalSpecies: function addAnimalSpecies(req, res){
      var code = req.body.code;
      var display = req.body.display;
     
      var query = "UPSERT INTO BACIRO_FHIR.ANIMAL_SPECIES(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ANIMAL_SPECIES_AUTO_ID,'"+code+"','"+display+"')";

      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_SPECIES WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAnimalSpecies"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAnimalSpecies"});
      });
    },
    animalBreeds: function addAnimalBreeds(req, res){
      var code = req.body.code;
      var display = req.body.display;
     
      var query = "UPSERT INTO BACIRO_FHIR.ANIMAL_BREEDS(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ANIMAL_BREEDS_AUTO_ID,'"+code+"','"+display+"')";

      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_BREEDS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAnimalBreeds"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAnimalBreeds"});
      });
    },
    animalGenderStatus: function addAnimalGenderStatus(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ANIMAL_GENDER_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ANIMAL_GENDER_STATUS_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";

      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ANIMAL_GENDER_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAnimalGenderStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAnimalGenderStatus"});
      });
    },
    languages: function addLanguages(req, res){
      var code = req.body.code;
      var display = req.body.display;
     
      var query = "UPSERT INTO BACIRO_FHIR.LANGUAGES(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.LANGUAGES_AUTO_ID,'"+code+"','"+display+"')";

      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.LANGUAGES WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addLanguages"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addLanguages"});
      });
    },
    linkType: function addLinkType(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.LINK_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.LINK_TYPE_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";

      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LINK_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addLinkType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addLinkType"});
      });
    },
    relatedPersonRelationshipType: function addRelatedPersonRelationshipType(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var system = req.body.system;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE(id, code, system, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE_AUTO_ID,'"+code+"','"+system+"','"+display+"','"+definition+"')";

      db.upsert(query,function(succes){
        var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addRelatedPersonRelationshipType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addRelatedPersonRelationshipType"});
      });
    },
    groupType: function addGroupType(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.GROUP_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.GROUP_TYPE_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";

      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GROUP_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addGroupType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addGroupType"});
      });
    },
    identifierUse: function addIdentifierUse(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.IDENTIFIER_USE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.IDENTIFIER_USE_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";

      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTIFIER_USE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addIdentifierUse"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addIdentifierUse"});
      });
    },
    identifierType: function addIdentifierType(req, res){
      var code = req.body.code;
      var display = req.body.display;
     
      var query = "UPSERT INTO BACIRO_FHIR.IDENTIFIER_TYPE(id, code, display)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.IDENTIFIER_TYPE_AUTO_ID,'"+code+"','"+display+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.IDENTIFIER_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addIdentifierType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addIdentifierType"});
      });
    },
    nameUse: function addNameUse(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.NAME_USE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.NAME_USE_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.NAME_USE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addNameUse"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addNameUse"});
      });
    },
    contactPointSystem: function addContactPointSystem(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CONTACT_POINT_SYSTEM(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CONTACT_POINT_SYSTEM_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_SYSTEM WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addContactPointSystem"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addContactPointSystem"});
      });
    },
    contactPointUse: function addContactPointUse(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.CONTACT_POINT_USE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.CONTACT_POINT_USE_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_USE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addContactPointUse"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addContactPointUse"});
      });
    },
    addressUse: function addAddressUse(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ADDRESS_USE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ADDRESS_USE_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_USE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAddressUse"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAddressUse"});
      });
    },
    addressType: function addAddressType(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.ADDRESS_TYPE(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.ADDRESS_TYPE_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_TYPE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAddressType"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAddressType"});
      });
    },
    attachment: function addAttachment(req, res){
      var attachment_id = req.body.id;
      var attachment_content_type = req.body.content_type;
      var attachment_language = req.body.language;
      var attachment_data = req.body.data;
      var attachment_url = req.body.url;
      var attachment_size = req.body.size;
      var attachment_hash = req.body.hash;
      var attachment_title = req.body.title;
      var attachment_creation = req.body.creation;
      var patient_id = req.body.patient_id;
      var related_person_id = req.body.related_person_id;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof attachment_content_type !== 'undefined'){
        column += 'attachment_content_type,';
        values += "'" +attachment_content_type +"',";
      }

      if(typeof attachment_language !== 'undefined'){
        column += 'attachment_language,';
        values += "'" +attachment_language +"',";
      }

      if(typeof attachment_data !== 'undefined'){
        column += 'attachment_data,';
        values += "'" + attachment_data +"',";
      }

      if(typeof attachment_url !== 'undefined'){
        column += 'attachment_url,';
        values += "'" + attachment_url +"',";
      }

      if(typeof attachment_size !== 'undefined'){
        column += 'attachment_size,';
        values += attachment_size + ",";
      }

      if(typeof attachment_hash !== 'undefined'){
        column += 'attachment_hash,';
        values += "'" + attachment_hash + "',";
      }

      if(typeof attachment_title !== 'undefined'){
        column += 'attachment_title,';
        values += "'" + attachment_title + "',";
      }

      if(typeof attachment_creation !== 'undefined'){
        column += 'attachment_creation,';
        values += "to_date('"+ attachment_creation + "'),";
      }

      if(typeof patient_id !== 'undefined'){
        column += 'patient_id,';
        values += "'"+ patient_id + "',";
      }

      if(typeof related_person_id !== 'undefined'){
        column += 'related_person_id,';
        values += "'"+ related_person_id + "',";
      }
     
      var query = "UPSERT INTO BACIRO_FHIR.ATTACHMENT(attachment_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+attachment_id+"', " + values.slice(0, -1) + ")";
      
      db.upsert(query,function(succes){
        var arrAttachment = [];
        var query = "SELECT attachment_id, attachment_url, attachment_content_type, attachment_language, attachment_data, attachment_size, attachment_hash, attachment_title, attachment_creation FROM BACIRO_FHIR.ATTACHMENT WHERE attachment_id = '" + attachment_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var Attachment = {};
            Attachment.id = rez[i].attachment_id;
            Attachment.url = rez[i].attachment_url;
            Attachment.contentType = rez[i].attachment_content_type;
            Attachment.language = rez[i].attachment_language;
            Attachment.data = rez[i].attachment_data;
            Attachment.size = rez[i].attachment_size;
            Attachment.hash = rez[i].attachment_hash;
            Attachment.title = rez[i].attachment_title;
            Attachment.creation = rez[i].attachment_creation;

            arrAttachment[i] = Attachment;
          }
          res.json({"err_code":0,"data": arrAttachment});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAttachment"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAttachment"});
      });
    },
    identifier: function addIdentifier(req, res){
      var identifier_id = req.body.id;
      var identifier_use = req.body.use;
      var identifier_type = req.body.type;
      var identifier_system = req.body.system;
      var identifier_value = req.body.value;
      var identifier_period_start = req.body.period_start;
      var identifier_period_end = req.body.period_end;
      var person_id = req.body.person_id;
      var patient_id = req.body.patient_id;
      var related_person_id = req.body.related_person_id;
      
      //susun query
      var column = "";
      var values = "";

      if(typeof identifier_use !== 'undefined'){
        column += 'identifier_use,';
        values += "'" + identifier_use +"',";
      }

      if(typeof identifier_type !== 'undefined'){
        column += 'identifier_type,';
        values += "'" + identifier_type +"',";
      }

      if(typeof identifier_system !== 'undefined'){
        column += 'identifier_system,';
        values += "'" + identifier_system +"',";
      }

      if(typeof identifier_value !== 'undefined'){
        column += 'identifier_value,';
        values += "'" + identifier_value + "',";
      }

      if(typeof identifier_period_start !== 'undefined'){
        column += 'identifier_period_start,';
        values += "to_date('"+ identifier_period_start + "', 'yyyy-MM-dd'),";
      }

      if(typeof identifier_period_end !== 'undefined'){
        column += 'identifier_period_end,';
        values += "to_date('"+ identifier_period_end + "', 'yyyy-MM-dd'),";
      }

      if(typeof person_id !== 'undefined'){
        column += 'person_id,';
        values += "'"+ person_id + "',";
      }

      if(typeof patient_id !== 'undefined'){
        column += 'patient_id,';
        values += "'"+ patient_id + "',";
      }

      if(typeof related_person_id !== 'undefined'){
        column += 'related_person_id,';
        values += "'"+ related_person_id + "',";
      }
     
      var query = "UPSERT INTO BACIRO_FHIR.IDENTIFIER(identifier_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+ identifier_id +"', " + values.slice(0, -1) + ")";
      db.upsert(query,function(succes){
        var arrIdentifier = [];
        var query = "SELECT identifier_id, identifier_use, identifier_type, identifier_system, identifier_value, identifier_period_start, identifier_period_end FROM BACIRO_FHIR.IDENTIFIER WHERE identifier_id = '" + identifier_id + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var Identifier = {};
            Identifier.id = rez[i].identifier_id;
            Identifier.use = rez[i].identifier_use;
            Identifier.type = rez[i].identifier_type;
            Identifier.system = rez[i].identifier_system;
            Identifier.value = rez[i].identifier_value;
            Identifier.period = formatDate(rez[i].identifier_period_start) +' to '+ formatDate(rez[i].identifier_period_end);

            arrIdentifier[i] = Identifier;
          }
          res.json({"err_code":0,"data": arrIdentifier});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addIdentifier"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addIdentifier"});
      });
    },
    humanName: function addHumanName(req, res){
      var human_name_id = req.body.id;
      var human_name_use = req.body.use;
      var human_name_text = req.body.text;
      var human_name_family = req.body.family;
      var human_name_given = req.body.given;
      var human_name_prefix = req.body.prefix;
      var human_name_suffix = req.body.suffix;
      var person_id = req.body.person_id;
      var patient_id = req.body.patient_id;
      var related_person_id = req.body.related_person_id;
     
      //susun query
      var column = "";
      var values = "";

      if(typeof human_name_use !== 'undefined'){
        column += 'human_name_use,';
        values += "'" + human_name_use +"',";
      }

      if(typeof human_name_text !== 'undefined'){
        column += 'human_name_text,';
        values += "'" + human_name_text +"',";
      }

      if(typeof human_name_family !== 'undefined'){
        column += 'human_name_family,';
        values += "'" + human_name_family +"',";
      }

      if(typeof human_name_given !== 'undefined'){
        column += 'human_name_given,';
        values += "'" + human_name_given + "',";
      }

      if(typeof human_name_prefix !== 'undefined'){
        column += 'human_name_prefix,';
        values += "'"+ human_name_prefix + "',";
      }

      if(typeof human_name_suffix !== 'undefined'){
        column += 'human_name_suffix,';
        values += "'"+ human_name_suffix + "',";
      }

      if(typeof req.body.period_start !== 'undefined'){
        if(req.body.period_start == ""){
          human_name_period_start = null;
        }else{
          human_name_period_start = "to_date('"+req.body.period_start+ "', 'yyyy-MM-dd')";
        }

        column += 'human_name_period_start,';
        values += human_name_period_start + ",";
      }

      if(typeof req.body.period_end !== 'undefined'){
        if(req.body.period_end == ""){
          human_name_period_end = null;
        }else{
          human_name_period_end = "to_date('"+req.body.period_end+ "', 'yyyy-MM-dd')";
        }

        column += 'human_name_period_end,';
        values += human_name_period_end + ",";
      }

      if(typeof person_id !== 'undefined'){
        column += 'person_id,';
        values += "'"+ person_id + "',";
      }

      if(typeof patient_id !== 'undefined'){
        column += 'patient_id,';
        values += "'"+ patient_id + "',";
      }

      if(typeof related_person_id !== 'undefined'){
        column += 'related_person_id,';
        values += "'"+ related_person_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.HUMAN_NAME(human_name_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+human_name_id+"', " + values.slice(0, -1) + ")";
      
      db.upsert(query,function(succes){
        var arrHumanName = [];
        var query = "SELECT human_name_id, human_name_use, human_name_text, human_name_family, human_name_given, human_name_prefix, human_name_suffix, human_name_period_start, human_name_period_end FROM BACIRO_FHIR.HUMAN_NAME WHERE human_name_id = '" + human_name_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var HumanName = {};
            HumanName.id = rez[i].human_name_id;
            HumanName.use = rez[i].human_name_use;
            HumanName.text = rez[i].human_name_text;
            HumanName.family = rez[i].human_name_family;
            HumanName.given = rez[i].human_name_given;
            HumanName.prefix = rez[i].human_name_prefix;
            HumanName.prefix = rez[i].human_name_suffix;
            if(rez[i].human_name_period_start == null){
              HumanName.period = formatDate(rez[i].human_name_period_start) +' to '+ formatDate(rez[i].human_name_period_end);
            }else{
              HumanName.period = "";
            }
            arrHumanName[i] = HumanName;
          }
          res.json({"err_code":0,"data": arrHumanName});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addHumanName"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addHumanName"});
      });
    },
    contactPoint: function addContactPoint(req, res){
      var contact_point_id = req.body.id;
      var contact_point_system = req.body.system;
      var contact_point_value = req.body.value;
      var contact_point_use = req.body.use;
      var contact_point_rank = req.body.rank;
      var person_id = req.body.person_id;
      var patient_id = req.body.patient_id;
      var patient_contact_id = req.body.patient_contact_id;
      var related_person_id = req.body.related_person_id;


      //susun query
      var column = "";
      var values = "";

      if(typeof contact_point_system !== 'undefined'){
        column += 'contact_point_system,';
        values += "'" + contact_point_system +"',";
      }

      if(typeof contact_point_value !== 'undefined'){
        column += 'contact_point_value,';
        values += "'" + contact_point_value +"',";
      }

      if(typeof contact_point_use !== 'undefined'){
        column += 'contact_point_use,';
        values += "'" + contact_point_use +"',";
      }

      if(typeof contact_point_rank !== 'undefined'){
        column += 'contact_point_rank,';
        values +=  contact_point_rank + ",";
      }

      if(typeof req.body.period_start !== 'undefined'){
        if(req.body.period_start == ""){
          contact_point_period_start = null;
        }else{
          contact_point_period_start = "to_date('"+req.body.period_start+ "', 'yyyy-MM-dd')";
        }

        column += 'contact_point_period_start,';
        values += contact_point_period_start + ",";
      }

      if(typeof req.body.period_end !== 'undefined'){
        if(req.body.period_end == ""){
          contact_point_period_end = null;
        }else{
          contact_point_period_end = "to_date('"+req.body.period_end+ "', 'yyyy-MM-dd')";
        }

        column += 'contact_point_period_end,';
        values += contact_point_period_end + ",";
      }

      if(typeof person_id !== 'undefined'){
        column += 'person_id,';
        values += "'"+ person_id + "',";
      }

      if(typeof patient_id !== 'undefined'){
        column += 'patient_id,';
        values += "'"+ patient_id + "',";
      }

      if(typeof patient_contact_id !== 'undefined'){
        column += 'patient_contact_id,';
        values += "'"+ patient_contact_id + "',";
      }

      if(typeof related_person_id !== 'undefined'){
        column += 'related_person_id,';
        values += "'"+ related_person_id + "',";
      }

      
      var query = "UPSERT INTO BACIRO_FHIR.CONTACT_POINT(contact_point_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+contact_point_id+"', " + values.slice(0, -1) + ")";
      
      db.upsert(query,function(succes){
        var arrContactPoint = [];
        var query = "SELECT contact_point_id, contact_point_system, contact_point_value, contact_point_use, contact_point_rank, contact_point_period_start, contact_point_period_end FROM BACIRO_FHIR.CONTACT_POINT WHERE contact_point_id = '" + contact_point_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var ContactPoint = {};
            ContactPoint.id = rez[i].contact_point_id;
            ContactPoint.system = rez[i].contact_point_system;
            ContactPoint.value = rez[i].contact_point_value;
            ContactPoint.use = rez[i].contact_point_use;
            ContactPoint.rank = rez[i].contact_point_rank;
            
            if(rez[i].contact_point_period_start == null){
              ContactPoint.period = formatDate(rez[i].contact_point_period_start) +' to '+ formatDate(rez[i].contact_point_period_end);
            }else{
              ContactPoint.period = "";
            }
            arrContactPoint[i] = ContactPoint;
          }
          res.json({"err_code":0,"data": arrContactPoint});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addContactPoint"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addContactPoint"});
      });
    },
    address: function addAddress(req, res){
      var address_id = req.body.id;
      var address_use = req.body.use;
      var address_type = req.body.type;
      var address_text = req.body.text;
      var address_line = req.body.line;
      var address_city = req.body.city;
      var address_district = req.body.district;
      var address_state = req.body.state;
      var address_postal_code = req.body.postal_code;
      var address_country = req.body.country;
      var person_id = req.body.person_id;
      var patient_id = req.body.patient_id;
      var related_person_id = req.body.related_person_id;


      //susun query
      var column = "";
      var values = "";

      if(typeof address_use !== 'undefined'){
        column += 'address_use,';
        values += "'" + address_use +"',";
      }

      if(typeof address_type !== 'undefined'){
        column += 'address_type,';
        values += "'" + address_type +"',";
      }

      if(typeof address_text !== 'undefined'){
        column += 'address_text,';
        values += "'" + address_text +"',";
      }

      if(typeof address_line !== 'undefined'){
        column += 'address_line,';
        values += "'" + address_line + "',";
      }

      if(typeof address_city !== 'undefined'){
        column += 'address_city,';
        values +=  "'" + address_city + "',";
      }

      if(typeof address_district !== 'undefined'){
        column += 'address_district,';
        values +=  "'" + address_district + "',";
      }

      if(typeof address_state !== 'undefined'){
        column += 'address_state,';
        values += "'" + address_state + "',";
      }

      if(typeof address_postal_code !== 'undefined'){
        column += 'address_postal_code,';
        values +=  "'" + address_postal_code + "',";
      }

      if(typeof address_country !== 'undefined'){
        column += 'address_country,';
        values +=  "'" + address_country + "',";
      }

      if(typeof req.body.period_start !== 'undefined'){
        if(req.body.period_start == ""){
          address_period_start = null;
        }else{
          address_period_start = "to_date('"+req.body.period_start+ "', 'yyyy-MM-dd')";
        }

        column += 'address_period_start,';
        values += address_period_start + ",";
      }

      if(typeof req.body.period_end !== 'undefined'){
        if(req.body.period_end == ""){
          address_period_end = null;
        }else{
          address_period_end = "to_date('"+req.body.period_end+ "', 'yyyy-MM-dd')";
        }

        column += 'address_period_end,';
        values += address_period_end + ",";
      }

      if(typeof person_id !== 'undefined'){
        column += 'person_id,';
        values += "'"+ person_id + "',";
      }

      if(typeof patient_id !== 'undefined'){
        column += 'patient_id,';
        values += "'"+ patient_id + "',";
      }

      if(typeof related_person_id !== 'undefined'){
        column += 'related_person_id,';
        values += "'"+ related_person_id + "',";
      }

      
      var query = "UPSERT INTO BACIRO_FHIR.ADDRESS(address_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+ address_id +"', " + values.slice(0, -1) + ")";
      
      db.upsert(query,function(succes){
        var arrAddress = [];
        var query = "SELECT address_id, address_use, address_type, address_text, address_line, address_city, address_district, address_state, address_postal_code, address_country, address_period_start, address_period_end FROM BACIRO_FHIR.ADDRESS WHERE address_id = '" + address_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var Address = {};
            Address.id = rez[i].address_id;
            Address.use = rez[i].address_use;
            Address.type = rez[i].address_type;
            Address.text = rez[i].address_text;
            Address.line = rez[i].address_line;
            Address.city = rez[i].address_city;
            Address.district = rez[i].address_district;
            Address.state = rez[i].address_state;
            Address.postalCode = rez[i].address_postal_code;
            Address.addressCountry = rez[i].address_country;
            
            
            if(rez[i].address_period_start == null){
              Address.period = formatDate(rez[i].address_period_start) +' to '+ formatDate(rez[i].address_period_end);
            }else{
              Address.period = "";
            }
            arrAddress[i] = Address;
          }
          res.json({"err_code":0,"data": arrAddress});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAddress"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAddress"});
      });
    },
    appointmentReasonCode: function addAppointmentReasonCode(req, res){
      var code = req.body.code;
      var description = req.body.description;
     
      var query = "UPSERT INTO BACIRO_FHIR.APPOINTMENT_REASON_CODE(id, code, description)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.APPOINTMENT_REASON_CODE_AUTO_ID,'"+code+"','"+description+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, description FROM BACIRO_FHIR.APPOINTMENT_REASON_CODE WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAppointmentReasonCode"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAppointmentReasonCode"});
      });
    },
    slotStatus: function addSlotStatus(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.SLOT_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.SLOT_STATUS_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SLOT_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSlotStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSlotStatus"});
      });
    },
    appointmentStatus: function addAppointmentStatus(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.APPOINTMENT_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.APPOINTMENT_STATUS_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.APPOINTMENT_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addAppointmentStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addAppointmentStatus"});
      });
    },
    participantRequired: function addParticipantRequired(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.PARTICIPANT_REQUIRED(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.PARTICIPANT_REQUIRED_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPANT_REQUIRED WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addParticipantRequired"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addParticipantRequired"});
      });
    },
    participationStatus: function addparticipationStatus(req, res){
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
     
      var query = "UPSERT INTO BACIRO_FHIR.PARTICIPATION_STATUS(id, code, display, definition)"+
        " VALUES (NEXT VALUE FOR BACIRO_FHIR.PARTICIPATION_STATUS_AUTO_ID,'"+code+"','"+display+"','"+definition+"')";
        
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPATION_STATUS WHERE code = '" + code + "' ";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addparticipationStatus"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addparticipationStatus"});
      });
    }
  },
  put: {
    identityAssuranceLevel: function updateIdentityAssuranceLevel(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTITY_ASSURANCE_LEVEL WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateIdentityAssuranceLevel"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateIdentityAssuranceLevel"});
      });
    },
    administrativeGender: function updateAdministrativeGender(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ADMINISTRATIVE_GENDER(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADMINISTRATIVE_GENDER WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADMINISTRATIVE_GENDER WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAdministrativeGender"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAdministrativeGender"});
      });
    },
    maritalStatus: function updateMaritalStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      var system = req.body.system;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof system !== 'undefined'){
        column += 'system,';
        values += "'" +system +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.MARITAL_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MARITAL_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition, system FROM BACIRO_FHIR.MARITAL_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMaritalStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMaritalStatus"});
      });
    },
    contactRole: function updateContactRole(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var description = req.body.description;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof description !== 'undefined'){
        column += 'description,';
        values += "'" +description +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.CONTACT_ROLE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONTACT_ROLE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, description FROM BACIRO_FHIR.CONTACT_ROLE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateContactRole"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateContactRole"});
      });
    },
    animalSpecies: function updateAnimalSpecies(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ANIMAL_SPECIES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ANIMAL_SPECIES WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_SPECIES WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAnimalSpecies"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAnimalSpecies"});
      });
    },
    animalBreeds: function updateAnimalBreeds(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ANIMAL_BREEDS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ANIMAL_BREEDS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.ANIMAL_BREEDS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAnimalBreeds"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAnimalBreeds"});
      });
    },
    animalGenderStatus: function updateAnimalGenderStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }


      var query = "UPSERT INTO BACIRO_FHIR.ANIMAL_GENDER_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ANIMAL_GENDER_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ANIMAL_GENDER_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAnimalGenderStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAnimalGenderStatus"});
      });
    },
    languages: function updateLanguages(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.LANGUAGES(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.LANGUAGES WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.LANGUAGES WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateLanguages"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateLanguages"});
      });
    },
    linkType: function updateLinkType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.LINK_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.LINK_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.LINK_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateLinkType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateLinkType"});
      });
    },
    relatedPersonRelationshipType: function updateRelatedPersonRelationshipType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var system = req.body.system;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof system !== 'undefined'){
        column += 'system,';
        values += "'" +system +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, system, display, definition FROM BACIRO_FHIR.RELATEDPERSON_RELATIONSHIPTYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateRelatedPersonRelationshipType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateRelatedPersonRelationshipType"});
      });
    },
    groupType: function updateGroupType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.GROUP_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.GROUP_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.GROUP_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateGroupType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateGroupType"});
      });
    },
    identifierUse: function updateIdentifierUse(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.IDENTIFIER_USE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IDENTIFIER_USE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.IDENTIFIER_USE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateIdentifierUse"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateIdentifierUse"});
      });
    },
    identifierType: function updateIdentifierType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.IDENTIFIER_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IDENTIFIER_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display FROM BACIRO_FHIR.IDENTIFIER_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateIdentifierType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateIdentifierType"});
      });
    },
    nameUse: function updateNameUse(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.NAME_USE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.NAME_USE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.NAME_USE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateNameUse"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateNameUse"});
      });
    },
    contactPointSystem: function updateContactPointSystem(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.CONTACT_POINT_SYSTEM(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONTACT_POINT_SYSTEM WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_SYSTEM WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateContactPointSystem"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateContactPointSystem"});
      });
    },
    contactPointUse: function updateContactPointUse(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.CONTACT_POINT_USE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONTACT_POINT_USE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.CONTACT_POINT_USE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateContactPointUse"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateContactPointUse"});
      });
    },
    addressUse: function updateAddressUse(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.ADDRESS_USE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADDRESS_USE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_USE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAddressUse"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAddressUse"});
      });
    },
    addressType: function updateAddressType(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.ADDRESS_TYPE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADDRESS_TYPE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.ADDRESS_TYPE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAddressType"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAddressType"});
      });
    },
    identifier: function updateIdentifier(req, res){
      var _id = req.params._id;
      var domainResource = req.params.dr;

      var identifier_use = req.body.use;
      var identifier_type = req.body.type;
      var identifier_system = req.body.system;
      var identifier_value = req.body.value;
      var identifier_period_start = req.body.period_start;
      var identifier_period_end = req.body.period_end;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof identifier_use !== 'undefined'){
        column += 'identifier_use,';
        values += "'" +identifier_use +"',";
      }

      if(typeof identifier_type !== 'undefined'){
        column += 'identifier_type,';
        values += "'" +identifier_type +"',";
      }

      if(typeof identifier_value !== 'undefined'){
        column += 'identifier_value,';
        values += "'" +identifier_value +"',";
      }

      if(typeof identifier_system !== 'undefined'){
        column += 'identifier_system,';
        values += "'" +identifier_system +"',";
      }

      if(typeof identifier_period_start !== 'undefined'){
        column += 'identifier_period_start,';
        values += "to_date('" + identifier_period_start +"', 'yyyy-MM-dd'),";
      }

      if(typeof identifier_period_end !== 'undefined'){
        column += 'identifier_period_end,';
        values += "to_date('" + identifier_period_end +"', 'yyyy-MM-dd'),";
      }

      var arrResource = domainResource.split('|');
      var fieldResource = arrResource[0];
      var valueResource = arrResource[1];
      var condition = "identifier_id = '" + _id + "' AND " + fieldResource +" = '"+ valueResource +"'";

      var query = "UPSERT INTO BACIRO_FHIR.IDENTIFIER(identifier_id," + column.slice(0, -1) + ") SELECT identifier_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IDENTIFIER WHERE " + condition;
      
      db.upsert(query,function(succes){
        var arrIdentifier = [];
        var query = "SELECT identifier_id, identifier_use, identifier_type, identifier_system, identifier_value, identifier_period_start, identifier_period_end FROM BACIRO_FHIR.IDENTIFIER WHERE "+ condition;
        
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var Identifier = {};
            Identifier.id = rez[i].identifier_id;
            Identifier.use = rez[i].identifier_use;
            Identifier.type = rez[i].identifier_type;
            Identifier.system = rez[i].identifier_system;
            Identifier.value = rez[i].identifier_value;
            Identifier.period = formatDate(rez[i].identifier_period_start) +' to '+ formatDate(rez[i].identifier_period_end);

            arrIdentifier[i] = Identifier;
          }
          res.json({"err_code":0,"data": arrIdentifier});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateIdentifier"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateIdentifier"});
      });
    },
    humanName: function updateHumanName(req, res){
      var _id = req.params._id;
      var domainResource = req.params.dr;

      var human_name_use = req.body.use;
      var human_name_text = req.body.text;
      var human_name_family = req.body.family;
      var human_name_given = req.body.given;
      var human_name_prefix = req.body.prefix;
      var human_name_suffix = req.body.suffix;
      var human_name_period_start = req.body.period_start;
      var human_name_period_end = req.body.period_end;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof human_name_use !== 'undefined'){
        column += 'human_name_use,';
        values += "'" +human_name_use +"',";
      }

      if(typeof human_name_text !== 'undefined'){
        column += 'human_name_text,';
        values += "'" +human_name_text +"',";
      }

      if(typeof human_name_family !== 'undefined'){
        column += 'human_name_family,';
        values += "'" +human_name_family +"',";
      }

      if(typeof human_name_given !== 'undefined'){
        column += 'human_name_given,';
        values += "'" +human_name_given +"',";
      }

      if(typeof human_name_prefix !== 'undefined'){
        column += 'human_name_prefix,';
        values += "'" +human_name_prefix +"',";
      }

      if(typeof human_name_suffix !== 'undefined'){
        column += 'human_name_suffix,';
        values += "'" +human_name_suffix +"',";
      }

      if(typeof human_name_period_start !== 'undefined'){
        column += 'human_name_period_start,';
        values += "to_date('" + human_name_period_start +"', 'yyyy-MM-dd'),";
      }

      if(typeof human_name_period_end !== 'undefined'){
        column += 'human_name_period_end,';
        values += "to_date('" + human_name_period_end +"', 'yyyy-MM-dd'),";
      }

      if(domainResource !== "" && typeof domainResource !== 'undefined'){
        var arrResource = domainResource.split('|');
        var fieldResource = arrResource[0];
        var valueResource = arrResource[1];
        var condition = "human_name_id = '" + _id + "' AND " + fieldResource +" = '"+ valueResource +"'";  
      }else{
        var condition = "human_name_id = '" + _id + "'";  
      }

      var query = "UPSERT INTO BACIRO_FHIR.HUMAN_NAME(human_name_id," + column.slice(0, -1) + ") SELECT human_name_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.HUMAN_NAME WHERE " + condition;
      
      db.upsert(query,function(succes){
        var arrHumanName = [];
        var query = "SELECT human_name_id, human_name_use, human_name_text, human_name_family, human_name_given, human_name_prefix, human_name_suffix, human_name_period_start, human_name_period_end FROM BACIRO_FHIR.HUMAN_NAME WHERE "+ condition;
        
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var HumanName = {};
            HumanName.id = rez[i].human_name_id;
            HumanName.use = rez[i].human_name_use;
            HumanName.text = rez[i].human_name_text;
            HumanName.family = rez[i].human_name_family;
            HumanName.given = rez[i].human_name_given;
            HumanName.prefix = rez[i].human_name_prefix;
            HumanName.prefix = rez[i].human_name_suffix;
            if(rez[i].human_name_period_start == null){
              HumanName.period = formatDate(rez[i].human_name_period_start) +' to '+ formatDate(rez[i].human_name_period_end);
            }else{
              HumanName.period = "";
            }
            arrHumanName[i] = HumanName;
          }
          res.json({"err_code":0,"data": arrHumanName});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateHumanName"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateHumanName"});
      });
    },
    contactPoint: function updateContactPoint(req, res){
      var _id = req.params._id;
      var domainResource = req.params.dr;

      var contact_point_system = req.body.system;
      var contact_point_value = req.body.value;
      var contact_point_use = req.body.use;
      var contact_point_rank = req.body.rank;
      var person_id = req.body.person_id;
      var patient_id = req.body.patient_id;
      var patient_contact_id = req.body.patient_contact_id;
      var related_person_id = req.body.related_person_id;


      //susun query
      var column = "";
      var values = "";

      if(typeof contact_point_system !== 'undefined'){
        column += 'contact_point_system,';
        values += "'" + contact_point_system +"',";
      }

      if(typeof contact_point_value !== 'undefined'){
        column += 'contact_point_value,';
        values += "'" + contact_point_value +"',";
      }

      if(typeof contact_point_use !== 'undefined'){
        column += 'contact_point_use,';
        values += "'" + contact_point_use +"',";
      }

      if(typeof contact_point_rank !== 'undefined'){
        column += 'contact_point_rank,';
        values +=  contact_point_rank + ",";
      }

      if(typeof req.body.period_start !== 'undefined'){
        if(req.body.period_start == ""){
          contact_point_period_start = null;
        }else{
          contact_point_period_start = "to_date('"+req.body.period_start+ "', 'yyyy-MM-dd')";
        }

        column += 'contact_point_period_start,';
        values += contact_point_period_start + ",";
      }

      if(typeof req.body.period_end !== 'undefined'){
        if(req.body.period_end == ""){
          contact_point_period_end = null;
        }else{
          contact_point_period_end = "to_date('"+req.body.period_end+ "', 'yyyy-MM-dd')";
        }

        column += 'contact_point_period_end,';
        values += contact_point_period_end + ",";
      }

      if(typeof person_id !== 'undefined'){
        column += 'person_id,';
        values += "'"+ person_id + "',";
      }

      if(typeof patient_id !== 'undefined'){
        column += 'patient_id,';
        values += "'"+ patient_id + "',";
      }

      if(typeof patient_contact_id !== 'undefined'){
        column += 'patient_contact_id,';
        values += "'"+ patient_contact_id + "',";
      }

      if(typeof related_person_id !== 'undefined'){
        column += 'related_person_id,';
        values += "'"+ related_person_id + "',";
      }

      if(domainResource !== "" && typeof domainResource !== 'undefined'){
        var arrResource = domainResource.split('|');
        var fieldResource = arrResource[0];
        var valueResource = arrResource[1];
        var condition = "contact_point_id = '" + _id + "' AND " + fieldResource +" = '"+ valueResource +"'";
      }else{
        var condition = "contact_point_id = '" + _id + "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.CONTACT_POINT(contact_point_id," + column.slice(0, -1) + ") SELECT contact_point_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.CONTACT_POINT WHERE " + condition;
      
      db.upsert(query,function(succes){
        var arrContactPoint = [];
        var query = "SELECT contact_point_id, contact_point_system, contact_point_value, contact_point_use, contact_point_rank, contact_point_period_start, contact_point_period_end FROM BACIRO_FHIR.CONTACT_POINT WHERE " + condition;
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var ContactPoint = {};
            ContactPoint.id = rez[i].contact_point_id;
            ContactPoint.system = rez[i].contact_point_system;
            ContactPoint.value = rez[i].contact_point_value;
            ContactPoint.use = rez[i].contact_point_use;
            ContactPoint.rank = rez[i].contact_point_rank;
            
            if(rez[i].contact_point_period_start == null){
              ContactPoint.period = formatDate(rez[i].contact_point_period_start) +' to '+ formatDate(rez[i].contact_point_period_end);
            }else{
              ContactPoint.period = "";
            }
            arrContactPoint[i] = ContactPoint;
          }
          res.json({"err_code":0,"data": arrContactPoint});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateContactPoint"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateContactPoint"});
      });
    },
    address: function updateAddress(req, res){
      var _id = req.params._id;
      var domainResource = req.params.dr;

      var address_use = req.body.use;
      var address_type = req.body.type;
      var address_text = req.body.text;
      var address_line = req.body.line;
      var address_city = req.body.city;
      var address_district = req.body.district;
      var address_state = req.body.state;
      var address_postal_code = req.body.postal_code;
      var address_country = req.body.country;
      var person_id = req.body.person_id;
      var patient_id = req.body.patient_id;
      var related_person_id = req.body.related_person_id;


      //susun query
      var column = "";
      var values = "";

      if(typeof address_use !== 'undefined'){
        column += 'address_use,';
        values += "'" + address_use +"',";
      }

      if(typeof address_type !== 'undefined'){
        column += 'address_type,';
        values += "'" + address_type +"',";
      }

      if(typeof address_text !== 'undefined'){
        column += 'address_text,';
        values += "'" + address_text +"',";
      }

      if(typeof address_line !== 'undefined'){
        column += 'address_line,';
        values += "'" + address_line + "',";
      }

      if(typeof address_city !== 'undefined'){
        column += 'address_city,';
        values +=  "'" + address_city + "',";
      }

      if(typeof address_district !== 'undefined'){
        column += 'address_district,';
        values +=  "'" + address_district + "',";
      }

      if(typeof address_state !== 'undefined'){
        column += 'address_state,';
        values += "'" + address_state + "',";
      }

      if(typeof address_postal_code !== 'undefined'){
        column += 'address_postal_code,';
        values +=  "'" + address_postal_code + "',";
      }

      if(typeof address_country !== 'undefined'){
        column += 'address_country,';
        values +=  "'" + address_country + "',";
      }

      if(typeof req.body.period_start !== 'undefined'){
        if(req.body.period_start == ""){
          address_period_start = null;
        }else{
          address_period_start = "to_date('"+req.body.period_start+ "', 'yyyy-MM-dd')";
        }

        column += 'address_period_start,';
        values += address_period_start + ",";
      }

      if(typeof req.body.period_end !== 'undefined'){
        if(req.body.period_end == ""){
          address_period_end = null;
        }else{
          address_period_end = "to_date('"+req.body.period_end+ "', 'yyyy-MM-dd')";
        }

        column += 'address_period_end,';
        values += address_period_end + ",";
      }

      if(typeof person_id !== 'undefined'){
        column += 'person_id,';
        values += "'"+ person_id + "',";
      }

      if(typeof patient_id !== 'undefined'){
        column += 'patient_id,';
        values += "'"+ patient_id + "',";
      }

      if(typeof related_person_id !== 'undefined'){
        column += 'related_person_id,';
        values += "'"+ related_person_id + "',";
      }

      if(domainResource !== "" && typeof domainResource !== 'undefined'){
        var arrResource = domainResource.split('|');
        var fieldResource = arrResource[0];
        var valueResource = arrResource[1];
        var condition = "address_id = '" + _id + "' AND " + fieldResource +" = '"+ valueResource +"'";
      }else{
        var condition = "address_id = '" + _id + "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.ADDRESS(address_id," + column.slice(0, -1) + ") SELECT address_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ADDRESS WHERE " + condition;
      
      db.upsert(query,function(succes){
        var arrAddress = [];
        var query = "SELECT address_id, address_use, address_type, address_text, address_line, address_city, address_district, address_state, address_postal_code, address_country, address_period_start, address_period_end FROM BACIRO_FHIR.ADDRESS WHERE " + condition;
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var Address = {};
            Address.id = rez[i].address_id;
            Address.use = rez[i].address_use;
            Address.type = rez[i].address_type;
            Address.text = rez[i].address_text;
            Address.line = rez[i].address_line;
            Address.city = rez[i].address_city;
            Address.district = rez[i].address_district;
            Address.state = rez[i].address_state;
            Address.postalCode = rez[i].address_postal_code;
            Address.addressCountry = rez[i].address_country;
            
            if(rez[i].address_period_start == null){
              Address.period = formatDate(rez[i].address_period_start) +' to '+ formatDate(rez[i].address_period_end);
            }else{
              Address.period = "";
            }
            arrAddress[i] = Address;
          }
          res.json({"err_code":0,"data": arrAddress});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAddress"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAddress"});
      });
    },
    attachment: function updateAttachment(req, res){
      var _id = req.params._id;
      var domainResource = req.params.dr;

      var attachment_content_type = req.body.content_type;
      var attachment_language = req.body.language;
      var attachment_url = req.body.url;
      var attachment_size = req.body.size;
      var attachment_data = req.body.data;
      var attachment_hash = req.body.hash;
      var attachment_title = req.body.title;
      var attachment_creation = req.body.creation;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof attachment_content_type !== 'undefined'){
        column += 'attachment_content_type,';
        values += "'" +attachment_content_type +"',";
      }

      if(typeof attachment_language !== 'undefined'){
        column += 'attachment_language,';
        values += "'" +attachment_language +"',";
      }

      if(typeof attachment_url !== 'undefined'){
        column += 'attachment_url,';
        values += "'" +attachment_url +"',";
      }

      if(typeof attachment_size !== 'undefined'){
        column += 'attachment_size,';
        values += "" +attachment_size +",";
      }

      if(typeof attachment_data !== 'undefined'){
        column += 'attachment_data,';
        values += "'" +attachment_data +"',";
      }

      if(typeof attachment_hash !== 'undefined'){
        column += 'attachment_hash,';
        values += "'" +attachment_hash +"',";
      }

      if(typeof attachment_title !== 'undefined'){
        column += 'attachment_title,';
        values += "'" +attachment_title +"',";
      }

      if(typeof attachment_creation !== 'undefined'){
        column += 'attachment_creation,';
        values += "to_date('" + attachment_creation +"', 'yyyy-MM-dd'),";
      }
      if(domainResource !== "" && typeof domainResource !== 'undefined'){
        var arrResource = domainResource.split('|');
        var fieldResource = arrResource[0];
        var valueResource = arrResource[1];
        var condition = "attachment_id = '" + _id + "' AND " + fieldResource +" = '"+ valueResource +"'";
      }else{
        var condition = "attachment_id = '" + _id + "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.ATTACHMENT(attachment_id," + column.slice(0, -1) + ") SELECT attachment_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.ATTACHMENT WHERE " + condition;
      
      db.upsert(query,function(succes){
        var arrAttachment = [];
        var query = "SELECT attachment_id, attachment_url, attachment_content_type, attachment_language, attachment_data, attachment_size, attachment_hash, attachment_title, attachment_creation FROM BACIRO_FHIR.ATTACHMENT WHERE " + condition;
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var Attachment = {};
            Attachment.id = rez[i].attachment_id;
            Attachment.url = rez[i].attachment_url;
            Attachment.contentType = rez[i].attachment_content_type;
            Attachment.language = rez[i].attachment_language;
            Attachment.data = rez[i].attachment_data;
            Attachment.size = rez[i].attachment_size;
            Attachment.hash = rez[i].attachment_hash;
            Attachment.title = rez[i].attachment_title;
            Attachment.creation = rez[i].attachment_creation;

            arrAttachment[i] = Attachment;
          }
          res.json({"err_code":0,"data": arrAttachment});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAttachment"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAddress"});
      });
    },
    appointmentReasonCode: function updateAppointmentReasonCode(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var description = req.body.description;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof description !== 'undefined'){
        column += 'description,';
        values += "'" +description +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.APPOINTMENT_REASON_CODE(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.APPOINTMENT_REASON_CODE WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, description FROM BACIRO_FHIR.APPOINTMENT_REASON_CODE WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAppointmentReasonCode"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAppointmentReasonCode"});
      });
    },
    slotStatus: function updateSlotStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.SLOT_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SLOT_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.SLOT_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSlotStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSlotStatus"});
      });
    },
    appointmentStatus: function updateAppointmentStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.APPOINTMENT_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.APPOINTMENT_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.APPOINTMENT_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateAppointmentStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateAppointmentStatus"});
      });
    },
    participantRequired: function updateParticipantRequired(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.PARTICIPANT_REQUIRED(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PARTICIPANT_REQUIRED WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPANT_REQUIRED WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateParticipantRequired"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateParticipantRequired"});
      });
    },
    participationStatus: function updateparticipationStatus(req, res){
      var _id = req.params._id;
      var code = req.body.code;
      var display = req.body.display;
      var definition = req.body.definition;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof code !== 'undefined'){
        column += 'code,';
        values += "'" +code +"',";
      }

      if(typeof display !== 'undefined'){
        column += 'display,';
        values += "'" +display +"',";
      }

      if(typeof definition !== 'undefined'){
        column += 'definition,';
        values += "'" +definition +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.PARTICIPATION_STATUS(id," + column.slice(0, -1) + ") SELECT id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.PARTICIPATION_STATUS WHERE id = " + _id;
      
      db.upsert(query,function(succes){
        var query = "SELECT id, code, display, definition FROM BACIRO_FHIR.PARTICIPATION_STATUS WHERE id = "+ _id;

        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateparticipationStatus"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateparticipationStatus"});
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