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
    substance: function getSubstance(req, res){
      var apikey = req.params.apikey;
      
      var substanceId = req.query._id;
      var substanceCategory = req.query.category;
      var substanceCode = req.query.code;
      var instanceId = req.query.instance;
      var instanceExpiry = req.query.expiry;
      var instanceQuantity = req.query.quantity;
      var substanceStatus = req.query.status;
      
         
      //susun query
      var condition = "";
      var join = "";

      if(typeof substanceId !== 'undefined' && substanceId !== ""){
        condition += "s.substance_id = '" + substanceId + "' AND ";  
      }

      if(typeof substanceCategory !== 'undefined' && substanceCategory !== ""){
        condition += "substance_category = '" + substanceCategory + "' AND ";  
      }

      if(typeof substanceCode !== 'undefined' && substanceCode !== ""){
        condition += "substance_code = '" + substanceCode + "' AND ";  
      }

      if(typeof substanceStatus !== 'undefined' && substanceStatus !== ""){
        condition += "substance_status = '" + substanceStatus + "' AND ";  
      }

      if((typeof instanceId !== 'undefined' && instanceId !== "") || (typeof instanceExpiry !== 'undefined' && instanceExpiry !== "") || (typeof instanceQuantity !== 'undefined' && instanceQuantity !== "")){
        join += " LEFT JOIN BACIRO_FHIR.SUBSTANCE_INSTANCE si ON si.substance_id = s.substance_id "; 

        if(typeof instanceId !== 'undefined' && instanceId !== ""){
          condition += "substance_instance_id = '" + instanceId + "' AND ";    
        }
        
        if(typeof instanceExpiry !== 'undefined' && instanceExpiry !== ""){
          condition += "substance_instance_expiry = '" + instanceExpiry + "' AND ";    
        }

        if(typeof instanceQuantity !== 'undefined' && instanceQuantity !== ""){
          condition += "substance_instance_quantity_low >= " + instanceQuantity + " AND substance_instance_quantity_high <= " + instanceQuantity + " AND ";    
        }  
      }

      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

      var arrSubstance = [];
      var query = "SELECT s.substance_id, substance_status, substance_category, substance_code, substance_description FROM BACIRO_FHIR.SUBSTANCE s " + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var Substance = {};
          Substance.resourceType = "Substance";
          Substance.id = rez[i].substance_id;
          Substance.status = rez[i].substance_status;
          Substance.category = rez[i].substance_category;
          Substance.code = rez[i].substance_code;
          Substance.description = rez[i].substance_description;

          arrSubstance[i] = Substance;
        }
        res.json({"err_code":0,"data":arrSubstance});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getSubstance"});
      });
    },
    substanceInstance: function getSubstanceInstance(req, res){
      var apikey = req.params.apikey;  
      var instanceId = req.query._id;
      var substanceId = req.query.substance_id;
    
      //susun query
      var condition = "";
      var join = "";

      if(typeof instanceId !== 'undefined' && instanceId !== ""){
        condition += "substance_instance_id = '" + instanceId + "' AND ";  
      }

      if(typeof substanceId !== 'undefined' && substanceId !== ""){
        condition += "substance_id = '" + substanceId + "' AND ";  
      }
      
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

      var arrSubstanceInstance = [];
      var query = "SELECT substance_instance_id, substance_instance_expiry, substance_instance_quantity_low, substance_instance_quantity_high FROM BACIRO_FHIR.SUBSTANCE_INSTANCE " + fixCondition;

      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var SubstanceInstance = {};
          SubstanceInstance.id = rez[i].substance_instance_id;
          if(rez[i].substance_instance_expiry !== 'null'){
            SubstanceInstance.expiry = formatDate(rez[i].substance_instance_expiry);  
          }else{
            SubstanceInstance.expiry = "";
          }
          
          SubstanceInstance.quantity = rez[i].substance_instance_quantity_high - rez[i].substance_instance_quantity_low;
          // SubstanceInstance.quantityHigh = rez[i].substance_instance_quantity_high;

          arrSubstanceInstance[i] = SubstanceInstance;
        }
        res.json({"err_code":0,"data":arrSubstanceInstance});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getSubstanceInstance"});
      });
    },
    substanceIngredient: function getSubstanceIngredient(req, res){
      var apikey = req.params.apikey;  
      var ingredientId = req.query._id;
      var substanceId = req.query.substance_id;
    
      //susun query
      var condition = "";
      var join = "";

      if(typeof ingredientId !== 'undefined' && ingredientId !== ""){
        condition += "substance_ingredient_id = '" + ingredientId + "' AND ";  
      }

      if(typeof substanceId !== 'undefined' && substanceId !== ""){
        condition += "substance_id = '" + substanceId + "' AND ";  
      }
      
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

      var arrSubstanceIngredient = [];
      var query = "SELECT substance_ingredient_id, substance_ingredient_quantity_numerator, substance_ingredient_quantity_denominator, substance_ingredient_substance_code FROM BACIRO_FHIR.SUBSTANCE_INGREDIENT " + fixCondition;
      
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
        for(i = 0; i < rez.length; i++){
          var SubstanceIngredient = {};
          SubstanceIngredient.id = rez[i].substance_ingredient_id;
          SubstanceIngredient.quantity = rez[i].substance_ingredient_quantity_numerator / rez[i].substance_ingredient_quantity_denominator;
          SubstanceIngredient.code = rez[i].substance_ingredient_substance_code;

          arrSubstanceIngredient[i] = SubstanceIngredient;
        }
        res.json({"err_code":0,"data":arrSubstanceIngredient});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getSubstanceIngredient"});
      });
    }
  },
  post: {
    substance: function addSubstance(req, res){
      var apikey = req.params.apikey;

      var substance_id = req.body.id;
      var substance_status = req.body.status;
      var substance_category = req.body.category;
      var substance_code = req.body.code;
      var substance_description = req.body.description;
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof substance_id !== 'undefined' && substance_id !== ""){
        column += 'substance_id,';
        values += "'" + substance_id +"',";
      }

      if(typeof substance_status !== 'undefined' && substance_status !== ""){
        column += 'substance_status,';
        values += "'" + substance_status +"',";
      }

      if(typeof substance_category !== 'undefined' && substance_category !== ""){
        column += 'substance_category,';
        values += "'" + substance_category +"',";
      }

      if(typeof substance_code !== 'undefined' && substance_code !== ""){
        column += 'substance_code,';
        values += "'" + substance_code +"',";
      }

      if(typeof substance_description !== 'undefined' && substance_description !== ""){
        column += 'substance_description,';
        values += "'" + substance_description +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE(" + column.slice(0, -1) + ")"+
        " VALUES ("+ values.slice(0, -1) +")";
      
      db.upsert(query,function(succes){
        res.json({"err_code":0, "err_msg": "Substance has been add."});
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSubstance"});
      });
    },
    substanceInstance: function addSubstanceInstance(req, res){
      var apikey = req.params.apikey;

      var substance_instance_id = req.body.id;
      var substance_instance_expiry = req.body.expiry;
      var substance_instance_quantity_low = req.body.low;
      var substance_instance_quantity_high = req.body.high;
      var substance_id = req.body.substance_id;
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof substance_instance_id !== 'undefined' && substance_instance_id !== ""){
        column += 'substance_instance_id,';
        values += "'" + substance_instance_id +"',";
      }

      if(typeof substance_instance_expiry !== 'undefined' && substance_instance_expiry !== ""){
        column += 'substance_instance_expiry,';
        values += "to_date('" + substance_instance_expiry +"', 'yyyy-MM-dd'),";
      }

      if(typeof substance_instance_quantity_low !== 'undefined' && substance_instance_quantity_low !== ""){
        column += 'substance_instance_quantity_low,';
        values +=  substance_instance_quantity_low +",";
      }

      if(typeof substance_instance_quantity_high !== 'undefined' && substance_instance_quantity_high !== ""){
        column += 'substance_instance_quantity_high,';
        values +=  substance_instance_quantity_high +",";
      }

      if(typeof substance_id !== 'undefined' && substance_id !== ""){
        column += 'substance_id,';
        values += "'" + substance_id +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE_INSTANCE(" + column.slice(0, -1) + ")"+
        " VALUES ("+ values.slice(0, -1) +")";
      
      db.upsert(query,function(succes){
        res.json({"err_code":0, "err_msg": "Instance has been add."});
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSubstanceInstance"});
      });
    },
    substanceIngredient: function addSubstanceIngredient(req, res){
      var apikey = req.params.apikey;

      var substance_ingredient_id = req.body.id;
      var substance_ingredient_quantity_numerator = req.body.numerator;
      var substance_ingredient_quantity_denominator = req.body.denominator;
      var substance_ingredient_substance_code = req.body.code;
      var substance_id = req.body.substance_id;
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof substance_ingredient_id !== 'undefined' && substance_ingredient_id !== ""){
        column += 'substance_ingredient_id,';
        values += "'" + substance_ingredient_id +"',";
      }

      if(typeof substance_ingredient_substance_code !== 'undefined' && substance_ingredient_substance_code !== ""){
        column += 'substance_ingredient_substance_code,';
        values += "'" + substance_ingredient_substance_code +"',";
      }

      if(typeof substance_ingredient_quantity_numerator !== 'undefined' && substance_ingredient_quantity_numerator !== ""){
        column += 'substance_ingredient_quantity_numerator,';
        values +=  substance_ingredient_quantity_numerator +",";
      }

      if(typeof substance_ingredient_quantity_denominator !== 'undefined' && substance_ingredient_quantity_denominator !== ""){
        column += 'substance_ingredient_quantity_denominator,';
        values +=  substance_ingredient_quantity_denominator +",";
      }

      if(typeof substance_id !== 'undefined' && substance_id !== ""){
        column += 'substance_id,';
        values += "'" + substance_id +"',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE_INGREDIENT(" + column.slice(0, -1) + ")"+
        " VALUES ("+ values.slice(0, -1) +")";
      
      db.upsert(query,function(succes){
        res.json({"err_code":0, "err_msg": "Ingredient has been add."});
      },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSubstanceIngredient"});
      });
    }
  },
  put: {
    substance: function updateSubstance(req, res){
      var apikey = req.params.apikey;
      var substance_id = req.params.substance_id;

      var substance_status = req.body.status;
      var substance_category = req.body.category;
      var substance_code = req.body.code;
      var substance_description = req.body.description;
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof substance_status !== 'undefined' && substance_status !== ""){
        column += 'substance_status,';
        values += "'" + substance_status +"',";
      }

      if(typeof substance_category !== 'undefined' && substance_category !== ""){
        column += 'substance_category,';
        values += "'" + substance_category +"',";
      }

      if(typeof substance_code !== 'undefined' && substance_code !== ""){
        column += 'substance_code,';
        values += "'" + substance_code +"',";
      }

      if(typeof substance_description !== 'undefined' && substance_description !== ""){
        column += 'substance_description,';
        values += "'" + substance_description +"',";
      }

      var condition = "substance_id = '" + substance_id + "'";

      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE(substance_id," + column.slice(0, -1) + ") SELECT substance_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SUBSTANCE WHERE " + condition;
    
      db.upsert(query,function(succes){
        res.json({"err_code": 0, "err_msg": "Substance has been update."});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSubstance"});
      });
    },
    substanceInstance: function updateSubstanceInstance(req, res){
      var apikey = req.params.apikey;

      var _id = req.params.id;
      var domainResource = req.params.dr;

      var substance_instance_quantity_low = req.body.low;
      var substance_instance_quantity_high = req.body.high;
      var substance_instance_expiry = req.body.expiry;
      
      //susun query update
      var column = "";
      var values = "";

      if(typeof substance_instance_quantity_low !== 'undefined' && substance_instance_quantity_low !== ""){
        column += 'substance_instance_quantity_low,';
        values += substance_instance_quantity_low +",";
      }

      if(typeof substance_instance_quantity_high !== 'undefined' && substance_instance_quantity_high !== ""){
        column += 'substance_instance_quantity_high,';
        values += substance_instance_quantity_high +",";
      }

      if(typeof substance_instance_expiry !== 'undefined' && substance_instance_expiry !== ""){
        column += 'substance_instance_expiry,';
        values += "to_date('" + substance_instance_expiry +"', 'yyyy-MM-dd'),";
      }

      if(domainResource !== "" && typeof domainResource !== 'undefined'){
        var arrResource = domainResource.split('|');
        var fieldResource = arrResource[0];
        var valueResource = arrResource[1];
        var condition = "substance_instance_id = '" + _id + "' AND " + fieldResource +" = '"+ valueResource +"'";
      }else{
        var condition = "substance_instance_id = '" + _id + "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE_INSTANCE(substance_instance_id," + column.slice(0, -1) + ") SELECT substance_instance_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SUBSTANCE_INSTANCE WHERE " + condition;
      
      db.upsert(query,function(succes){
        res.json({"err_code": 0, "err_msg": "Instance has been update."});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSubstanceInstance"});
      });
    },
    substanceIngredient: function updateSubstanceIngredient(req, res){
      var apikey = req.params.apikey;

      var _id = req.params.id;
      var domainResource = req.params.dr;

      var substance_ingredient_quantity_numerator = req.body.numerator;
      var substance_ingredient_quantity_denominator = req.body.denominator;
      var substance_ingredient_substance_code = req.body.code;
      
      
      //susun query update
      var column = "";
      var values = "";
      
      if(typeof substance_ingredient_substance_code !== 'undefined' && substance_ingredient_substance_code !== ""){
        column += 'substance_ingredient_substance_code,';
        values += "'" + substance_ingredient_substance_code +"',";
      }

      if(typeof substance_ingredient_quantity_numerator !== 'undefined' && substance_ingredient_quantity_numerator !== ""){
        column += 'substance_ingredient_quantity_numerator,';
        values +=  substance_ingredient_quantity_numerator +",";
      }

      if(typeof substance_ingredient_quantity_denominator !== 'undefined' && substance_ingredient_quantity_denominator !== ""){
        column += 'substance_ingredient_quantity_denominator,';
        values +=  substance_ingredient_quantity_denominator +",";
      }

      if(domainResource !== "" && typeof domainResource !== 'undefined'){
        var arrResource = domainResource.split('|');
        var fieldResource = arrResource[0];
        var valueResource = arrResource[1];
        var condition = "substance_ingredient_id = '" + _id + "' AND " + fieldResource +" = '"+ valueResource +"'";
      }else{
        var condition = "substance_ingredient_id = '" + _id + "'";
      }

      var query = "UPSERT INTO BACIRO_FHIR.SUBSTANCE_INGREDIENT(substance_ingredient_id," + column.slice(0, -1) + ") SELECT substance_ingredient_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.SUBSTANCE_INGREDIENT WHERE " + condition;
      
      db.upsert(query,function(succes){
        res.json({"err_code": 0, "err_msg": "Ingredient has been update."});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSubstanceIngredient"});
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