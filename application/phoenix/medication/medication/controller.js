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
		medication: function getMedication(req, res){
			var apikey = req.params.apikey;
			var medicationId = req.query._id;
			var code = req.query.code;
			var container = req.query.container;
			var form = req.query.form;
			var ingredient = req.query.ingredient;
			var ingredient_code = req.query.ingredient_code;
			var manufacturer = req.query.manufacturer;
			var over_the_counter = req.query.over_the_counter;
			var package_item = req.query.package_item;
			var package_item_code = req.query.package_item_code;
			var status = req.query.status;
			
	
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof medicationId !== 'undefined' && medicationId !== ""){
        condition += "m.MEDICATION_ID = '" + medicationId + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
				condition += "m.CODE = '" + code + "' AND,";  
      }
			
			if(typeof container !== 'undefined' && container !== ""){
				join += " LEFT JOIN BACIRO_FHIR.MEDICATION_PACKAGE mp on m.MEDICATION_ID = mp.MEDICATION_ID ";
        condition += "mp.CONTAINER = '" + container + "' AND,";  
      }
			
			if(typeof form !== 'undefined' && form !== ""){
        condition += "m.form = '" + form + "' AND,";  
      }
			
			if((typeof ingredient !== 'subject' && ingredient !== "") || (typeof ingredient_code !== 'subject' && ingredient_code !== "")){
				join += " LEFT JOIN BACIRO_FHIR.MEDICATION_INGREDIENT mi on m.MEDICATION_ID = mi.MEDICATION_ID ";
				
				if(typeof ingredient_code !== 'undefined' && ingredient_code !== ""){
					condition += "mi.ITEM_CODEABLE_CONCEPT = '" + ingredient_code + "' AND,";  
				}
				
				if(typeof ingredient !== 'undefined' && ingredient !== ""){
				condition += "(mi.ITEM_REFERENCE_SUBSTANCE = '" + ingredient + "' OR mi.ITEM_REFERENCE_MEDICATION = '" + ingredient + "') AND,";  
				}
			}
			
			if(typeof manufacturer !== 'undefined' && manufacturer !== ""){
        condition += "mi.MANUFACTURER = '" + manufacturer + "' AND,";  
      }
			
			if(typeof over_the_counter !== 'undefined' && over_the_counter !== ""){
        condition += "mi.IS_OVER_THE_COUNTER = " + over_the_counter + " AND,";  
      }
			
			if((typeof package_item !== 'subject' && package_item !== "") || (typeof package_item_code !== 'subject' && package_item_code !== "")){
				join += " LEFT JOIN BACIRO_FHIR.MEDICATION_PACKAGE mp on m.MEDICATION_ID = mp.MEDICATION_ID LEFT JOIN BACIRO_FHIR.MEDICATION_PACKAGE_CONTENT mpc on mp.PACKAGE_ID = mpc.PACKAGE_ID ";
				
				if(typeof package_item !== 'undefined' && package_item !== ""){
					condition += "mpc.ITEM_REFERENCE = '" + package_item + "' AND,";  
				}
				
				if(typeof package_item_code !== 'undefined' && package_item_code !== ""){
					condition += "mpc.ITEM_CODEABLE_CONCEPT = '" + package_item_code + "' AND,";  
				}
			}
			
			if(typeof status !== 'undefined' && status !== ""){
        condition += "im.STATUS = '" + status + "' AND,";  
      }
			
			
			
      if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }
			      
      var arrMedication = [];
      var query = "select medication_id, code, status, is_brand, is_over_the_counter, manufacturer, form from BACIRO_FHIR.MEDICATION m " + fixCondition;
			//console.log(query);
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var Medication = {};
					Medication.resourceType = "Medication";
          Medication.id = rez[i].medication_id;
					Medication.code = rez[i].code;
					Medication.status = rez[i].status;
					Medication.isBrand = rez[i].is_brand;
					Medication.isOverTheCounter = rez[i].is_over_the_counter;
					if(rez[i].manufacturer != "null"){
						Medication.manufacturer = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].manufacturer;
					} else {
						Medication.manufacturer = "";
					}
					Medication.form = rez[i].form;
					
          arrMedication[i] = Medication;
        }
        res.json({"err_code":0,"data": arrMedication});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getMedication"});
      });
    },
		medicationIngredient: function getMedicationIngredient(req, res) {
			var apikey = req.params.apikey;
			
			var medicationIngredientId = req.query._id;
			var medicationId = req.query.medication_id;

			//susun query
			var condition = "";

			if (typeof medicationIngredientId !== 'undefined' && medicationIngredientId !== "") {
				condition += "INGREDIENT_ID = '" + medicationIngredientId + "' AND ";
			}

			if (typeof medicationId !== 'undefined' && medicationId !== "") {
				condition += "MEDICATION_ID = '" + medicationId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrMedicationIngredient = [];
			var query = "select ingredient_id, item_codeable_concept, item_reference_substance, item_reference_medication, is_active, amount_numerator, amount_denominator, medication_id from BACIRO_FHIR.MEDICATION_INGREDIENT " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var MedicationIngredient = { id : "", item : {}, isActive : "", amaount : {}};
					MedicationIngredient.id = rez[i].ingredient_id;
					MedicationIngredient.item.itemCodeableConcept = rez[i].item_codeable_concept;
					var arrItemReference = [];
					var ItemReference = {};
					if(rez[i].item_reference_substance != "null"){
						ItemReference.substance = hostFHIR + ':' + portFHIR + '/' + apikey + '/Substance?_id=' +  rez[i].item_reference_substance;
					} else {
						ItemReference.substance = "";
					}
					if(rez[i].item_reference_medication != "null"){
						ItemReference.medication = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' +  rez[i].item_reference_medication;
					} else {
						ItemReference.medication = "";
					}
					arrItemReference[i] = ItemReference;
					MedicationIngredient.item.itemReference  = arrItemReference;
					MedicationIngredient.isActive = rez[i].is_active;
					MedicationIngredient.amount.amountNumerator = rez[i].amount_numerator;
					MedicationIngredient.amount.amountDenominator = rez[i].amount_denominator;
					
					arrMedicationIngredient[i] = MedicationIngredient;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationIngredient
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationIngredient"
				});
			});
		},
		medicationPackage: function getMedicationPackage(req, res) {
			var apikey = req.params.apikey;
			
			var medicationPackageId = req.query._id;
			var medicationId = req.query.medication_id;

			//susun query
			var condition = "";

			if (typeof medicationPackageId !== 'undefined' && medicationPackageId !== "") {
				condition += "PACKAGE_ID = '" + medicationPackageId + "' AND ";
			}

			if (typeof medicationId !== 'undefined' && medicationId !== "") {
				condition += "MEDICATION_ID = '" + medicationId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrMedicationPackage = [];
			var query = "select package_id, container, medication_id from baciro_fhir.MEDICATION_PACKAGE " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var MedicationPackage = {};
					MedicationPackage.id = rez[i].package_id;
					MedicationPackage.container = rez[i].container;
					arrMedicationPackage[i] = MedicationPackage;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationPackage
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationPackage"
				});
			});
		},
		medicationPackageContent: function getMedicationPackageContent(req, res) {
			var apikey = req.params.apikey;
			
			var medicationPackageContentId = req.query._id;
			var package_id = req.query.package_id;

			//susun query
			var condition = "";

			if (typeof medicationPackageContentId !== 'undefined' && medicationPackageContentId !== "") {
				condition += "CONTENT_ID = '" + medicationPackageContentId + "' AND ";
			}

			if (typeof package_id !== 'undefined' && package_id !== "") {
				condition += "package_id = '" + package_id + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrMedicationPackageContent = [];
			var query = "select content_id, item_codeable_concept, item_reference, amount, package_id from BACIRO_FHIR.MEDICATION_PACKAGE_CONTENT " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var MedicationPackageContent = {id : "", item : {}, amount : ""};
					MedicationPackageContent.id = rez[i].content_id;
					MedicationPackageContent.item.itemCodeableConcept = rez[i].item_codeable_concept;
					if(rez[i].item_reference != "null"){
						MedicationPackageContent.item.itemReference = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' +  rez[i].item_reference;
					} else {
						MedicationPackageContent.item.itemReference = "";
					}
					MedicationPackageContent.amount = rez[i].amount;
					arrMedicationPackageContent[i] = MedicationPackageContent;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationPackageContent
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationPackageContent"
				});
			});
		},
		medicationPackageBatch: function getMedicationPackageBatch(req, res) {
			var apikey = req.params.apikey;
			
			var medicationPackageBatchId = req.query._id;
			var package_id = req.query.package_id;

			//susun query
			var condition = "";

			if (typeof medicationPackageBatchId !== 'undefined' && medicationPackageBatchId !== "") {
				condition += "Batch_ID = '" + medicationPackageBatchId + "' AND ";
			}

			if (typeof package_id !== 'undefined' && package_id !== "") {
				condition += "package_id = '" + package_id + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}

			var arrMedicationPackageBatch = [];
			var query = "select batch_id, iot_number, expiration_date, package_id from BACIRO_FHIR.MEDICATION_PACKAGE_BATCH " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var MedicationPackageBatch = {};
					MedicationPackageBatch.id = rez[i].batch_id;
					MedicationPackageBatch.iotNumber = rez[i].iot_number;
					if(rez[i].expiration_date == null){
						MedicationPackageBatch.expirationDate = formatDate(rez[i].expiration_date);
					}else{
						MedicationPackageBatch.expirationDate = rez[i].expiration_date;
					}
					arrMedicationPackageBatch[i] = MedicationPackageBatch;
				}
				res.json({
					"err_code": 0,
					"data": arrMedicationPackageBatch
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getMedicationPackageBatch"
				});
			});
		s},
  },
	post: {
		medication: function addMedication(req, res) {
			console.log(req.body);
			var medication_id = req.body.medication_id;
			var code = req.body.code;
			var status = req.body.status;
			var is_brand = req.body.is_brand;
			var is_over_the_counter = req.body.is_over_the_counter;
			var manufacturer = req.body.manufacturer;
			var form = req.body.form;
			
			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }	
			
			if (typeof is_brand !== 'undefined' && is_brand !== "") {
        column += 'is_brand,';
        values += " " + is_brand + ",";
      }	
			
			if (typeof is_over_the_counter !== 'undefined' && is_over_the_counter !== "") {
        column += 'is_over_the_counter,';
        values += " " + is_over_the_counter + ",";
      }	
			
			if (typeof manufacturer !== 'undefined' && manufacturer !== "") {
        column += 'manufacturer,';
        values += "'" + manufacturer + "',";
      }	
			
			if (typeof form !== 'undefined' && form !== "") {
        column += 'form,';
        values += "'" + form + "',";
      }		
			
      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION(medication_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+medication_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select medication_id, code, status, is_brand, is_over_the_counter, manufacturer, form from BACIRO_FHIR.MEDICATION WHERE medication_id = '" + medication_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedication"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedication"});
      });
    },
		medicationIngredient: function addMedicationIngredient(req, res) {
			console.log(req.body);
			var ingredient_id  = req.body.ingredient_id;
			var item_codeable_concept = req.body.item_codeable_concept;
			var item_reference_substance = req.body.item_reference_substance;
			var item_reference_medication = req.body.item_reference_medication;
			var is_active = req.body.is_active;
			var amount_numerator = req.body.amount_numerator;
			var amount_denominator = req.body.amount_denominator;
			var medication_id  = req.body.medication_id;

			var column = "";
      var values = "";
			
			if (typeof item_codeable_concept !== 'undefined' && item_codeable_concept !== "") {
        column += 'item_codeable_concept,';
        values += "'" + item_codeable_concept + "',";
      }
			
			if (typeof item_reference_substance !== 'undefined' && item_reference_substance !== "") {
        column += 'item_reference_substance,';
        values += "'" + item_reference_substance + "',";
      }
			
			if (typeof item_reference_medication !== 'undefined' && item_reference_medication !== "") {
        column += 'item_reference_medication,';
        values += "'" + item_reference_medication + "',";
      }
			
			if (typeof is_active !== 'undefined' && is_active !== "") {
        column += 'is_active,';
        values += " " + is_active + ",";
      }
			
			if (typeof amount_numerator !== 'undefined' && amount_numerator !== "") {
        column += 'amount_numerator,';
        values += " " + amount_numerator + ",";
      }
			
			if (typeof amount_denominator !== 'undefined' && amount_denominator !== "") {
        column += 'amount_denominator,';
        values += " " + amount_denominator + ",";
      }
			
			if (typeof medication_id !== 'undefined' && medication_id !== "") {
        column += 'medication_id,';
        values += "'" + medication_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_INGREDIENT(ingredient_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+ingredient_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select ingredient_id, item_codeable_concept, item_reference_substance, item_reference_medication, is_active, amount_numerator, amount_denominator, medication_id from BACIRO_FHIR.MEDICATION_INGREDIENT WHERE ingredient_id = '" + ingredient_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationIngredient"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationIngredient"});
      });
    },
		medicationPackage: function addMedicationPackage(req, res) {
			console.log(req.body);
			var package_id  = req.body.package_id;
			var container = req.body.container;
			var medication_id  = req.body.medication_id;

			var column = "";
      var values = "";
			
			if (typeof container !== 'undefined' && container !== "") {
        column += 'container,';
        values += "'" + container + "',";
      }
			
			if (typeof medication_id !== 'undefined' && medication_id !== "") {
        column += 'medication_id,';
        values += "'" + medication_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_PACKAGE(package_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+package_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select package_id, container, medication_id from baciro_fhir.MEDICATION_PACKAGE WHERE package_id = '" + package_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationPackage"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationPackage"});
      });
    },
		medicationPackageContent: function addMedicationPackageContent(req, res) {
			console.log(req.body);
			var content_id  = req.body.content_id;
			var item_codeable_concept = req.body.item_codeable_concept;
			var item_reference = req.body.item_reference;
			var amount = req.body.amount;
			var package_id = req.body.package_id;
			

			var column = "";
      var values = "";
			
			if (typeof item_codeable_concept !== 'undefined' && item_codeable_concept !== "") {
        column += 'item_codeable_concept,';
        values += "'" + item_codeable_concept + "',";
      }
			
			if (typeof item_reference !== 'undefined' && item_reference !== "") {
        column += 'item_reference,';
        values += "'" + item_reference + "',";
      }
			
			if (typeof amount !== 'undefined' && amount !== "") {
        column += 'amount,';
        values += " " + amount + ",";
      }
			
			if (typeof package_id !== 'undefined' && package_id !== "") {
        column += 'package_id,';
        values += "'" + package_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_PACKAGE_CONTENT(content_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+content_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select content_id, item_codeable_concept, item_reference, amount, package_id from BACIRO_FHIR.MEDICATION_PACKAGE_CONTENT WHERE content_id = '" + content_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationPackageContent"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationPackageContent"});
      });
    },
		medicationPackageBatch: function addMedicationPackageBatch(req, res) {
			console.log(req.body);
			var batch_id  = req.body.batch_id;
			var iot_number = req.body.iot_number;
			var expiration_date = req.body.expiration_date;
			var package_id = req.body.package_id;
			

			var column = "";
      var values = "";
			
			if (typeof iot_number !== 'undefined' && iot_number !== "") {
        column += 'iot_number,';
        values += "'" + iot_number + "',";
      }
			
			if (typeof expiration_date !== 'undefined' && expiration_date !== "") {
        column += 'expiration_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ expiration_date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof package_id !== 'undefined' && package_id !== "") {
        column += 'package_id,';
        values += "'" + package_id + "',";
      }

      var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_PACKAGE_BATCH(batch_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+batch_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select batch_id, iot_number, expiration_date, package_id from BACIRO_FHIR.MEDICATION_PACKAGE_BATCH WHERE batch_id = '" + batch_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationPackageBatch"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addMedicationPackageBatch"});
      });
    },
	},
	put: {
		medication: function updateMedication(req, res) {
			console.log(req.body);
			var medication_id = req.params.medication_id;
			var code = req.body.medication_id;
			var status = req.body.medication_id;
			var is_brand = req.body.medication_id;
			var is_over_the_counter = req.body.medication_id;
			var manufacturer = req.body.medication_id;
			var form = req.body.medication_id;
			
			var column = "";
      var values = "";
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof code !== 'undefined' && code !== "") {
        column += 'code,';
        values += "'" + code + "',";
      }	
			
			if (typeof is_brand !== 'undefined' && is_brand !== "") {
        column += 'is_brand,';
        values += " " + is_brand + ",";
      }	
			
			if (typeof is_over_the_counter !== 'undefined' && is_over_the_counter !== "") {
        column += 'is_over_the_counter,';
        values += " " + is_over_the_counter + ",";
      }	
			
			if (typeof manufacturer !== 'undefined' && manufacturer !== "") {
        column += 'manufacturer,';
        values += "'" + manufacturer + "',";
      }	
			
			if (typeof form !== 'undefined' && form !== "") {
        column += 'form,';
        values += "'" + form + "',";
      }			
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "medication_id = '" + medication_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.IMMUNIZATION(medication_id," + column.slice(0, -1) + ") SELECT medication_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.IMMUNIZATION WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select medication_id, code, status, is_brand, is_over_the_counter, manufacturer, form from BACIRO_FHIR.MEDICATION WHERE medication_id = '" + medication_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedication"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedication"});
      });
    },
		medicationIngredient: function updateMedicationIngredient(req, res) {
			console.log(req.body);
			var ingredient_id  = req.params.ingredient_id;
			var item_codeable_concept = req.body.item_codeable_concept;
			var item_reference_substance = req.body.item_reference_substance;
			var item_reference_medication = req.body.item_reference_medication;
			var is_active = req.body.is_active;
			var amount_numerator = req.body.amount_numerator;
			var amount_denominator = req.body.amount_denominator;
			var medication_id  = req.body.medication_id;

			var column = "";
      var values = "";
			
			if (typeof item_codeable_concept !== 'undefined' && item_codeable_concept !== "") {
        column += 'item_codeable_concept,';
        values += "'" + item_codeable_concept + "',";
      }
			
			if (typeof item_reference_substance !== 'undefined' && item_reference_substance !== "") {
        column += 'item_reference_substance,';
        values += "'" + item_reference_substance + "',";
      }
			
			if (typeof item_reference_medication !== 'undefined' && item_reference_medication !== "") {
        column += 'item_reference_medication,';
        values += "'" + item_reference_medication + "',";
      }
			
			if (typeof is_active !== 'undefined' && is_active !== "") {
        column += 'is_active,';
        values += " " + is_active + ",";
      }
			
			if (typeof amount_numerator !== 'undefined' && amount_numerator !== "") {
        column += 'amount_numerator,';
        values += " " + amount_numerator + ",";
      }
			
			if (typeof amount_denominator !== 'undefined' && amount_denominator !== "") {
        column += 'amount_denominator,';
        values += " " + amount_denominator + ",";
      }
			
			if (typeof medication_id !== 'undefined' && medication_id !== "") {
        column += 'medication_id,';
        values += "'" + medication_id + "',";
      }	
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "ingredient_id = '" + ingredient_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_INGREDIENT(ingredient_id," + column.slice(0, -1) + ") SELECT ingredient_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_INGREDIENT WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select ingredient_id, item_codeable_concept, item_reference_substance, item_reference_medication, is_active, amount_numerator, amount_denominator, medication_id from BACIRO_FHIR.MEDICATION_INGREDIENT WHERE ingredient_id = '" + ingredient_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationIngredient"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationIngredient"});
      });
    },
		medicationPackage: function updateMedicationPackage(req, res) {
			console.log(req.body);
			var package_id  = req.params.package_id;
			var container = req.body.container;
			var medication_id  = req.body.medication_id;

			var column = "";
      var values = "";
			
			if (typeof container !== 'undefined' && container !== "") {
        column += 'container,';
        values += "'" + container + "',";
      }
			
			if (typeof medication_id !== 'undefined' && medication_id !== "") {
        column += 'medication_id,';
        values += "'" + medication_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "package_id = '" + package_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_PACKAGE(package_id," + column.slice(0, -1) + ") SELECT package_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_PACKAGE WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select package_id, container, medication_id from baciro_fhir.MEDICATION_PACKAGE WHERE package_id = '" + package_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationPackage"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationPackage"});
      });
    },
		medicationPackageContent: function updateMedicationPackageContent(req, res) {
			console.log(req.body);
			var content_id  = req.params.content_id;
			var item_codeable_concept = req.body.item_codeable_concept;
			var item_reference = req.body.item_reference;
			var amount = req.body.amount;
			var package_id = req.body.package_id;
			

			var column = "";
      var values = "";
			
			if (typeof item_codeable_concept !== 'undefined' && item_codeable_concept !== "") {
        column += 'item_codeable_concept,';
        values += "'" + item_codeable_concept + "',";
      }
			
			if (typeof item_reference !== 'undefined' && item_reference !== "") {
        column += 'item_reference,';
        values += "'" + item_reference + "',";
      }
			
			if (typeof amount !== 'undefined' && amount !== "") {
        column += 'amount,';
        values += " " + amount + ",";
      }
			
			if (typeof package_id !== 'undefined' && package_id !== "") {
        column += 'package_id,';
        values += "'" + package_id + "',";
      }

			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "content_id = '" + content_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_PACKAGE_CONTENT(content_id," + column.slice(0, -1) + ") SELECT content_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_PACKAGE_CONTENT WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select content_id, item_codeable_concept, item_reference, amount, package_id from BACIRO_FHIR.MEDICATION_PACKAGE_CONTENT WHERE content_id = '" + content_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationPackageContent"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationPackageContent"});
      });
    },
		medicationPackageBatch: function updateMedicationPackageBatch(req, res) {
			console.log(req.body);
			var batch_id  = req.body.batch_id;
			var iot_number = req.body.iot_number;
			var expiration_date = req.body.expiration_date;
			var package_id = req.body.package_id;
			

			var column = "";
      var values = "";
			
			if (typeof iot_number !== 'undefined' && iot_number !== "") {
        column += 'iot_number,';
        values += "'" + iot_number + "',";
      }
			
			if (typeof expiration_date !== 'undefined' && expiration_date !== "") {
        column += 'expiration_date,';
        //values += "'" + date + "',";
				values += "to_date('"+ expiration_date + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof package_id !== 'undefined' && package_id !== "") {
        column += 'package_id,';
        values += "'" + package_id + "',";
      }

			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "batch_id = '" + batch_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.MEDICATION_PACKAGE_Batch(batch_id," + column.slice(0, -1) + ") SELECT batch_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.MEDICATION_PACKAGE_BATCH WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select batch_id, iot_number, expiration_date, package_id from BACIRO_FHIR.MEDICATION_PACKAGE_BATCH WHERE batch_id = '" + batch_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationPackageBatch"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateMedicationPackageBatch"});
      });
    },
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