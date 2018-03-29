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
    group: function getGroup(req, res){
      var groupId = req.query._id;
      var groupActual = req.query.actual;
      var groupCharacteristic = req.query.characteristic;
      var groupCharacteristicValue = req.query.characteristicvalue;
      var groupCode = req.query.code;
      var groupExclude = req.query.exclude;
      var groupMember = req.query.member;
      var groupType = req.query.type;
      var groupValue = req.query.value;

      //susun query
      var condition = "";
      var join = "";

      if(typeof groupId !== 'undefined' && groupId !== ""){
        condition += "g.group_id = '" + groupId + "' AND,";  
      }

      if(typeof groupActual !== 'undefined' && groupActual !== ""){
        condition += "group_actual = " + groupActual + " AND,";  
      }

      if(typeof groupCode !== 'undefined' && groupCode !== ""){
        condition += "upper(group_code) = '" + groupCode.toUpperCase() + "' AND,";  
      }

      if(typeof groupType !== 'undefined' && groupType !== ""){
        condition += "upper(group_type) = '" + groupType.toUpperCase() + "' AND,";  
      }

      if((typeof groupCharacteristic !== 'undefined' && groupCharacteristic !== "") || (typeof groupCharacteristicValue !== 'undefined' && groupCharacteristicValue !== "") || (typeof groupExclude !== 'undefined' && groupExclude !== "") || (typeof groupValue !== 'undefined' && groupValue !== "")){
        join += " LEFT JOIN BACIRO_FHIR.GROUP_CHARACTERISTIC gc ON gc.group_id = g.group_id ";
        
        if(typeof groupCharacteristic !== 'undefined' && groupCharacteristic !== ""){
          condition += "upper(group_characteristic_code) = '" + groupCharacteristic.toUpperCase() + "' AND ";       
        }

        if(typeof groupValue !== 'undefined' && groupValue !== ""){
          if(groupValue.indexOf('nonbreaking_space') > 0){
            groupValue = groupValue.replace(/nonbreaking_space/g, " ");
          }
          condition += "upper(group_characteristic_value) = '" + groupValue.toUpperCase() + "' AND ";       
        }

        if(typeof groupCharacteristicValue !== 'undefined' && groupCharacteristicValue !== ""){
          if(groupCharacteristicValue.indexOf('nonbreaking_space') > 0){
            groupCharacteristicValue = groupCharacteristicValue.replace(/nonbreaking_space/g, " ");
          }
          condition += "(upper(group_characteristic_code) = '" + groupCharacteristicValue.toUpperCase() + "' OR upper(group_characteristic_value) = '" + groupCharacteristicValue.toUpperCase() + "') AND ";
        }

        if(typeof groupExclude !== 'undefined' && groupExclude !== ""){
          condition += "group_characteristic_exclude = " + groupExclude + " AND ";
        }
      }

      if((typeof groupMember !== 'undefined' && groupMember !== "")){
        join += " LEFT JOIN BACIRO_FHIR.GROUP_MEMBER gm ON gm.group_id = g.group_id ";
        
        if(typeof groupMember !== 'undefined' && groupMember !== ""){
          condition += "(group_member_entity_patient_id = '" + groupMember + "' OR group_member_entity_practitioner_id = '" + groupMember + "' OR group_member_entity_device_id = '" + groupMember + "' OR group_member_entity_medication_id = '" + groupMember + "' OR group_member_entity_substance_id = '" + groupMember + "' ) AND ";       
        }
      }

      // if((typeof personIdentifier !== 'undefined' && personIdentifier !== "")){
      //   join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.person_id = p.person_id ";
        
      //   if(typeof personIdentifier !== 'undefined' && personIdentifier !== ""){
      //     condition += "identifier_value = '" + personIdentifier + "' AND ";       
      //   }
      // }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
      
      var arrGroup = [];
      var query = "SELECT g.group_id as group_id, group_active, group_type, group_actual, group_code, group_name, group_quantity FROM BACIRO_FHIR.GROUP_ g" + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Group = {};
          Group.resourceType = "Group";
          Group.identifier = rez[i].group_id;
          Group.active = rez[i].group_active;
          Group.type = rez[i].group_type;
          Group.actual = rez[i].group_actual;
          Group.code = rez[i].group_code;
          Group.name = rez[i].group_name;
          Group.quantity = rez[i].group_quantity;
          
          arrGroup[i] = Group;
        }
        res.json({"err_code":0,"data": arrGroup});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getGroup_"});
      });
    },
    groupCharacteristic: function getGroupCharacteristic(req, res){
      var groupId = req.query.group_id;
      var groupCharacteristicId = req.query._id;
      //susun query
      var condition = "";

      if(typeof groupId !== 'undefined' && groupId !== ""){
        condition += "group_id = '" + groupId + "' AND ";  
      }

      if(typeof groupCharacteristicId !== 'undefined' && groupCharacteristicId !== ""){
        condition += "group_characteristic_id = '" + groupCharacteristicId + "' AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var arrGroupCharacteristic = [];
      var query = "SELECT group_characteristic_id, group_characteristic_code, group_characteristic_value, group_characteristic_exclude, group_characteristic_period_start, group_characteristic_period_end FROM BACIRO_FHIR.GROUP_CHARACTERISTIC " + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var GroupCharacteristic = {};
          
          GroupCharacteristic.id = rez[i].group_characteristic_id;
          GroupCharacteristic.code = rez[i].group_characteristic_code;
          GroupCharacteristic.value = rez[i].group_characteristic_value;
          GroupCharacteristic.exclude = rez[i].group_characteristic_exclude;
          
          if(rez[i].group_characteristic_period_start == "" || rez[i].group_characteristic_period_start == "null"){
            GroupCharacteristic.period_start = "";
          }else{
            GroupCharacteristic.period_start = formatDate(rez[i].group_characteristic_period_start);
            
          }

          if(rez[i].group_characteristic_period_end == "" || rez[i].group_characteristic_period_end == "null"){
            GroupCharacteristic.period_end = "";
          }else{
            GroupCharacteristic.period_end = formatDate(rez[i].group_characteristic_period_end);
          }
          
          arrGroupCharacteristic[i] = GroupCharacteristic;
        }
        res.json({"err_code":0,"data": arrGroupCharacteristic});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getGroupCharacteristic"});
      });
    },
    groupMember: function getGroupMember(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      var groupId = req.query.group_id;
      var groupMemberId = req.query._id;
      //susun query
      var condition = "";

      if(typeof groupId !== 'undefined' && groupId !== ""){
        condition += "group_id = '" + groupId + "' AND ";  
      }

      if(typeof groupMemberId !== 'undefined' && groupMemberId !== ""){
        condition += "group_member_id = '" + groupMemberId + "' AND ";  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = " WHERE " + condition.slice(0, -4);
      }
      
      var arrGroupMember = [];
      var query = "SELECT group_member_id, group_member_entity_patient_id, group_member_entity_practitioner_id, group_member_entity_device_id, group_member_entity_medication_id, group_member_entity_substance_id, group_member_period_start, group_member_period_end, group_member_inactive FROM BACIRO_FHIR.GROUP_MEMBER " + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var GroupMember = {};
          
          GroupMember.id = rez[i].group_member_id;
          if(rez[i].group_member_entity_patient_id != '' || rez[i].group_member_entity_patient_id != 'null'){
            GroupMember.entity = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].group_member_entity_patient_id;
          }else if(rez[i].group_member_entity_practitioner_id != '' || rez[i].group_member_entity_practitioner_id != 'null'){
            GroupMember.entity = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].group_member_entity_practitioner_id;
          }else if(rez[i].group_member_entity_device_id != '' || rez[i].group_member_entity_device_id != 'null'){
            GroupMember.entity = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].group_member_entity_device_id;
          }else if(rez[i].group_member_entity_medication_id != '' || rez[i].group_member_entity_medication_id != 'null'){
            GroupMember.entity = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' +  rez[i].group_member_entity_medication_id;
          }else if(rez[i].group_member_entity_substance_id != '' || rez[i].group_member_entity_substance_id != 'null'){
            GroupMember.entity = hostFHIR + ':' + portFHIR + '/' + apikey + '/Substance?_id=' +  rez[i].group_member_entity_substance_id;
          }else{
            GroupMember.entity = "";
          }


          if(rez[i].group_member_period_start == "" || rez[i].group_member_period_start == "null"){
            GroupMember.period_start = "";
          }else{
            GroupMember.period_start = formatDate(rez[i].group_member_period_start);
          }

          if(rez[i].group_member_period_end == "" || rez[i].group_member_period_end == "null"){
            GroupMember.period_end = "";
          }else{
            GroupMember.period_end = formatDate(rez[i].group_member_period_end);
          }

          GroupMember.inactive = rez[i].group_member_inactive;
         
          arrGroupMember[i] = GroupMember;
        }
        res.json({"err_code":0,"data": arrGroupMember});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getGroupCharacteristic"});
      });
    }
  },
  post: {
    group: function addGroup(req, res){
      var group_id = req.body.id;
      var group_active = req.body.active;
      var group_type = req.body.type;
      var group_actual = req.body.actual;
      var group_code = req.body.code;
      var group_name = req.body.name;
      var group_quantity = req.body.quantity;

      //susun query
      var column = "";
      var values = "";

      if(typeof group_active !== 'undefined' && group_active !== ""){
        column += 'group_active,';
        values += group_active +",";
      }

      if(typeof group_type !== 'undefined' && group_type !== ""){
        column += 'group_type,';
        values += "'"+ group_type +"',";
      }

      if(typeof group_actual !== 'undefined' && group_actual !== ""){
        column += 'group_actual,';
        values += group_actual +",";
      }

      if(typeof group_code !== 'undefined' && group_code !== ""){
        column += 'group_code,';
        values += "'" + group_code +"',";
      }

      if(typeof group_name !== 'undefined' && group_name !== ""){
        column += 'group_name,';
        values += "'" + group_name +"',";
      }

      if(typeof group_quantity !== 'undefined' && group_quantity !== ""){
        column += 'group_quantity,';
        values += group_quantity +",";
      }
      
      var query = "UPSERT INTO BACIRO_FHIR.GROUP_(group_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+group_id+"', " + values.slice(0, -1) + ")";
      
      db.upsert(query,function(succes){
        var query = "SELECT group_id, group_active, group_type, group_actual, group_code, group_name, group_quantity FROM BACIRO_FHIR.GROUP_ WHERE group_id = '" + group_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addGroup"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addGroup"});
      });
    },
    groupCharacteristic: function addGroupCharacteristic(req, res){
      var group_characteristic_id = req.body.id;
      var group_characteristic_code = req.body.code;
      var group_characteristic_value = req.body.value;
      var group_characteristic_exclude = req.body.exclude;
      var group_characteristic_period_start = req.body.period_start;
      var group_characteristic_period_end = req.body.period_end;
      var group_id = req.body.group_id;
      
      //susun query
      var column = "";
      var values = "";

      if(typeof group_characteristic_code !== 'undefined' && group_characteristic_code !== ""){
        column += 'group_characteristic_code,';
        values += "'" + group_characteristic_code +"',";
      }

      if(typeof group_characteristic_value !== 'undefined' && group_characteristic_value !== ""){
        column += 'group_characteristic_value,';
        values += "'"+ group_characteristic_value +"',";
      }

      if(typeof group_characteristic_exclude !== 'undefined' && group_characteristic_exclude !== ""){
        column += 'group_characteristic_exclude,';
        values += group_characteristic_exclude +",";
      }

      if(typeof req.body.period_start !== 'undefined'){
        if(req.body.period_start == ""){
          group_characteristic_period_start = null;
        }else{
          group_characteristic_period_start = "to_date('"+req.body.period_start+ "', 'yyyy-MM-dd')";
        }

        column += 'group_characteristic_period_start,';
        values += group_characteristic_period_start + ",";
      }

      if(typeof req.body.period_end !== 'undefined'){
        if(req.body.period_end == ""){
          group_characteristic_period_end = null;
        }else{
          group_characteristic_period_end = "to_date('"+req.body.period_end+ "', 'yyyy-MM-dd')";
        }

        column += 'group_characteristic_period_end,';
        values += group_characteristic_period_end + ",";
      }
      
      if(typeof group_id !== 'undefined' && group_id !== ""){
        column += 'group_id,';
        values += "'"+ group_id +"',";
      }
      
      var query = "UPSERT INTO BACIRO_FHIR.GROUP_CHARACTERISTIC(group_characteristic_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+group_characteristic_id+"', " + values.slice(0, -1) + ")";
      
      db.upsert(query,function(succes){
        var arrGroupCharacteristic = [];
        var query = "SELECT group_characteristic_id, group_characteristic_code, group_characteristic_value, group_characteristic_exclude, group_characteristic_period_start, group_characteristic_period_end FROM BACIRO_FHIR.GROUP_CHARACTERISTIC WHERE group_characteristic_id = '" + group_characteristic_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          for(i = 0; i < rez.length; i++){
            var GroupCharacteristic = {};
            
            GroupCharacteristic.id = rez[i].group_characteristic_id;
            GroupCharacteristic.code = rez[i].group_characteristic_code;
            GroupCharacteristic.value = rez[i].group_characteristic_value;
            GroupCharacteristic.exclude = rez[i].group_characteristic_exclude;
            
            if(rez[i].group_characteristic_period_start == "" || rez[i].group_characteristic_period_start == "null"){
              GroupCharacteristic.period_start = "";
            }else{
              GroupCharacteristic.period_start = formatDate(rez[i].group_characteristic_period_start);
              
            }

            if(rez[i].group_characteristic_period_end == "" || rez[i].group_characteristic_period_end == "null"){
              GroupCharacteristic.period_end = "";
            }else{
              GroupCharacteristic.period_end = formatDate(rez[i].group_characteristic_period_end);
            }
            
            arrGroupCharacteristic[i] = GroupCharacteristic;
          }
          res.json({"err_code":0,"data": arrGroupCharacteristic});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addGroupCharacteristic"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addGroupCharacteristic"});
      });
    },
    groupMember: function addGroupMember(req, res){
      var group_member_id = req.body.id;
      var group_member_entity_patient_id = req.body.patient_id;
      var group_member_entity_practitioner_id = req.body.practitioner_id;
      var group_member_entity_device_id = req.body.device_id;
      var group_member_entity_medication_id = req.body.medication_id;
      var group_member_entity_substance_id = req.body.substance_id;
      var group_member_inactive = req.body.inactive;
      
      var group_id = req.params.group_id;
      
      //susun query
      var column = "";
      var values = "";

      if(typeof group_member_entity_patient_id !== 'undefined' && group_member_entity_patient_id !== ""){
        column += 'group_member_entity_patient_id,';
        values += "'" + group_member_entity_patient_id +"',";
      }

      if(typeof group_member_entity_practitioner_id !== 'undefined' && group_member_entity_practitioner_id !== ""){
        column += 'group_member_entity_practitioner_id,';
        values += "'"+ group_member_entity_practitioner_id +"',";
      }

      if(typeof group_member_entity_device_id !== 'undefined' && group_member_entity_device_id !== ""){
        column += 'group_member_entity_device_id,';
        values += "'"+ group_member_entity_device_id +"',";
      }

      if(typeof group_member_entity_medication_id !== 'undefined' && group_member_entity_medication_id !== ""){
        column += 'group_member_entity_medication_id,';
        values += "'"+ group_member_entity_medication_id +"',";
      }

      if(typeof group_member_entity_substance_id !== 'undefined' && group_member_entity_substance_id !== ""){
        column += 'group_member_entity_substance_id,';
        values += "'"+ group_member_entity_substance_id +"',";
      }

      if(typeof req.body.period_start !== 'undefined'){
        if(req.body.period_start == ""){
          group_member_period_start = null;
        }else{
          group_member_period_start = "to_date('"+req.body.period_start+ "', 'yyyy-MM-dd')";
        }

        column += 'group_member_period_start,';
        values += group_member_period_start + ",";
      }

      if(typeof req.body.period_end !== 'undefined'){
        if(req.body.period_end == ""){
          group_member_period_end = null;
        }else{
          group_member_period_end = "to_date('"+req.body.period_end+ "', 'yyyy-MM-dd')";
        }

        column += 'group_member_period_end,';
        values += group_member_period_end + ",";
      }
      
      if(typeof group_member_inactive !== 'undefined' && group_member_inactive !== ""){
        column += 'group_member_inactive,';
        values += group_member_inactive +",";
      }

      if(typeof group_id !== 'undefined' && group_id !== ""){
        column += 'group_id,';
        values += "'"+ group_id +"',";
      }
      
      var query = "UPSERT INTO BACIRO_FHIR.GROUP_MEMBER(group_member_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+group_member_id+"', " + values.slice(0, -1) + ")";
      
      db.upsert(query,function(succes){
        var query = "SELECT group_member_id, group_member_entity_patient_id, group_member_entity_practitioner_id, group_member_entity_device_id, group_member_entity_medication_id, group_member_entity_substance_id, group_member_period_start, group_member_period_end FROM BACIRO_FHIR.GROUP_MEMBER WHERE group_member_id = '" + group_member_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addGroupMember"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addGroupMember"});
      });
    }
  },
  put: {
    group: function updateGroup(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      var group_id = req.params.group_id;
      var group_active = req.body.active;
      var group_type = req.body.type;
      var group_actual = req.body.actual;
      var group_code = req.body.code;
      var group_name = req.body.name;
      var group_quantity = req.body.quantity;
      
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof group_active !== 'undefined' && group_active !== "" ){
        column += 'group_active,';
        values += group_active +",";
      }

      if(typeof group_type !== 'undefined' && group_type !== ""){
        column += 'group_type,';
        values += "'" +group_type +"',";
      }

      if(typeof group_actual !== 'undefined' && group_actual !== ""){
        column += 'group_actual,';
        values += group_actual +",";
      }

      if(typeof group_code !== 'undefined' && group_code !== ""){
        column += 'group_code,';
        values += "'" +group_code +"',";
      }

      if(typeof group_name !== 'undefined' && group_name !== ""){
        column += 'group_name,';
        values += "'" +group_name +"',";
      }

      if(typeof group_quantity !== 'undefined' && group_quantity !== ""){
        column += 'group_quantity,';
        values +=  group_quantity +",";
      }
  
      var condition = "group_id = '" + group_id + "'";
     
      var query = "UPSERT INTO BACIRO_FHIR.GROUP_ (group_id," + column.slice(0, -1) + ") SELECT group_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.GROUP_ WHERE " + condition;
      
      db.upsert(query,function(succes){
        var query = "SELECT group_id, group_active, group_type, group_actual, group_code, group_name, group_quantity FROM BACIRO_FHIR.GROUP_ WHERE group_id = '" + group_id + "'";
        db.query(query,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateGroupMember"});
        });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateGroupMember"});
      });
    },
    groupMember: function updateGroupMember(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      var _id = req.params.group_member_id;
      var domainResource = req.params.dr;

      var group_member_entity_patient_id = req.body.patient_id;
      var group_member_entity_practitioner_id = req.body.practitioner_id;
      var group_member_entity_device_id = req.body.device_id;
      var group_member_entity_medication_id = req.body.medication_id;
      var group_member_entity_substance_id = req.body.substance_id;
      var group_member_inactive = req.body.inactive;
      
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof group_member_entity_patient_id !== 'undefined' && group_member_entity_patient_id !== "" ){
        column += 'group_member_entity_patient_id,';
        values += "'" +group_member_entity_patient_id +"',";
      }

      if(typeof group_member_entity_practitioner_id !== 'undefined' && group_member_entity_practitioner_id !== ""){
        column += 'group_member_entity_practitioner_id,';
        values += "'" +group_member_entity_practitioner_id +"',";
      }

      if(typeof group_member_entity_device_id !== 'undefined' && group_member_entity_device_id !== ""){
        column += 'group_member_entity_device_id,';
        values += "'" +group_member_entity_device_id +"',";
      }

      if(typeof group_member_entity_medication_id !== 'undefined' && group_member_entity_medication_id !== ""){
        column += 'group_member_entity_medication_id,';
        values += "" +group_member_entity_medication_id +",";
      }

      if(typeof group_member_entity_substance_id !== 'undefined' && group_member_entity_substance_id !== ""){
        column += 'group_member_entity_substance_id,';
        values += "" +group_member_entity_substance_id +",";
      }

      if(typeof group_member_inactive !== 'undefined' && group_member_inactive !== ""){
        column += 'group_member_inactive,';
        values +=  group_member_inactive +",";
      }

      
      if(domainResource !== "" && typeof domainResource !== 'undefined'){
        var arrResource = domainResource.split('|');
        var fieldResource = arrResource[0];
        var valueResource = arrResource[1];
        var condition = "group_member_id = '" + _id + "' AND " + fieldResource +" = '"+ valueResource +"'";
      }else{
        var condition = "group_member_id = '" + _id + "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.GROUP_MEMBER(group_member_id," + column.slice(0, -1) + ") SELECT group_member_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.GROUP_MEMBER WHERE " + condition;
      
      db.upsert(query,function(succes){
        var arrGroupMember = [];
        var query = "SELECT group_member_id, group_member_entity_patient_id, group_member_entity_practitioner_id, group_member_entity_device_id, group_member_entity_medication_id, group_member_entity_substance_id, group_member_inactive FROM BACIRO_FHIR.GROUP_MEMBER WHERE " + condition;

        db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var GroupMember = {};
          GroupMember.id = rez[i].group_member_id;

          if(rez[i].group_member_entity_patient_id != null){
            GroupMember.entity = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].group_member_entity_patient_id;
          }else if(rez[i].group_member_entity_practitioner_id != null){
            GroupMember.entity = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].group_member_entity_practitioner_id;
          }else if(rez[i].group_member_entity_device_id != null){
            GroupMember.entity = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].group_member_entity_device_id;
          }else if(rez[i].group_member_entity_medication_id != null){
            GroupMember.entity = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' +  rez[i].group_member_entity_medication_id;
          }else if(rez[i].group_member_entity_substance_id != null){
            GroupMember.entity = hostFHIR + ':' + portFHIR + '/' + apikey + '/Substance?_id=' +  rez[i].group_member_entity_substance_id;
          }else{
            GroupMember.entity = "";
          }
           
           GroupMember.inactive = rez[i].group_member_inactive;

          arrGroupMember[i] = GroupMember;
        }
        res.json({"err_code":0,"data": arrGroupMember});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateGroupMember"});
      });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateGroupMember"});
      });
    },
    groupCharacteristic: function updateGroupCharacteristic(req, res){
      var apikey = req.params.apikey;
      var hostFHIR = configYaml.fhir.host;
      var portFHIR = configYaml.fhir.port;

      var _id = req.params.group_characteristic_id;
      var domainResource = req.params.dr;

      var group_characteristic_code = req.body.code;
      var group_characteristic_value = req.body.value;
      var group_characteristic_exclude = req.body.exclude;
      var group_characteristic_period_start = req.body.period_start;
      var group_characteristic_period_end = req.body.period_end;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof group_characteristic_code !== 'undefined' && group_characteristic_code !== "" ){
        column += 'group_characteristic_code,';
        values += "'" +group_characteristic_code +"',";
      }

      if(typeof group_characteristic_value !== 'undefined' && group_characteristic_value !== ""){
        column += 'group_characteristic_value,';
        values += "'" +group_characteristic_value +"',";
      }

      if(typeof group_characteristic_exclude !== 'undefined' && group_characteristic_exclude !== ""){
        column += 'group_characteristic_exclude,';
        values += group_characteristic_exclude +",";
      }

      if(typeof group_characteristic_period_start !== 'undefined' && group_characteristic_period_start !== ""){
        column += 'group_characteristic_period_start,';
        values += "to_date('" + group_characteristic_period_start +"', 'yyyy-MM-dd'),";
      }

      if(typeof group_characteristic_period_end !== 'undefined' && group_characteristic_period_end !== ""){
        column += 'group_characteristic_period_end,';
        values += "to_date('" + group_characteristic_period_end +"', 'yyyy-MM-dd'),";
      }

      
      if(domainResource !== "" && typeof domainResource !== 'undefined'){
        var arrResource = domainResource.split('|');
        var fieldResource = arrResource[0];
        var valueResource = arrResource[1];
        var condition = "group_characteristic_id = '" + _id + "' AND " + fieldResource +" = '"+ valueResource +"'";
      }else{
        var condition = "group_characteristic_id = '" + _id + "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.GROUP_CHARACTERISTIC(group_characteristic_id," + column.slice(0, -1) + ") SELECT group_characteristic_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.GROUP_CHARACTERISTIC WHERE " + condition;
      
      db.upsert(query,function(succes){
        var arrGroupCharacteristic = [];
        var query = "SELECT group_characteristic_id, group_characteristic_code, group_characteristic_value, group_characteristic_exclude, group_characteristic_period_start, group_characteristic_period_end FROM BACIRO_FHIR.GROUP_CHARACTERISTIC WHERE " + condition;
      
        db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
         for(i = 0; i < rez.length; i++){
          var GroupCharacteristic = {};
          
          GroupCharacteristic.id = rez[i].group_characteristic_id;
          GroupCharacteristic.code = rez[i].group_characteristic_code;
          GroupCharacteristic.value = rez[i].group_characteristic_value;
          GroupCharacteristic.exclude = rez[i].group_characteristic_exclude;
          
          if(rez[i].group_characteristic_period_start == "" || rez[i].group_characteristic_period_start == "null"){
            GroupCharacteristic.period_start = "";
          }else{
            GroupCharacteristic.period_start = formatDate(rez[i].group_characteristic_period_start);
            
          }

          if(rez[i].group_characteristic_period_end == "" || rez[i].group_characteristic_period_end == "null"){
            GroupCharacteristic.period_end = "";
          }else{
            GroupCharacteristic.period_end = formatDate(rez[i].group_characteristic_period_end);
          }
          
          arrGroupCharacteristic[i] = GroupCharacteristic;
        }
        res.json({"err_code":0,"data": arrGroupCharacteristic});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateGroupCharacteristic"});
      });
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateGroupCharacteristic"});
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