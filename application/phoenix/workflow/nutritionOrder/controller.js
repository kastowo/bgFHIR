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
		nutritionOrder: function getNutritionOrder(req, res){
			var apikey = req.params.apikey;
			var nutritionOrderId = req.query._id;
			
			/*var based_on = req.query.based_on;
			var category = req.query.category;
			var code = req.query.code;
			var context = req.query.context;
			var date = req.query.date;
			var diagnosis = req.query.diagnosis;
			var encounter = req.query.encounter;
			var identifier = req.query.identifier;
			var image = req.query.image;
			var issued = req.query.issued;
			var patient = req.query.patient;
			var performer = req.query.performer;
			var result = req.query.result;
			var specimen = req.query.specimen;
			var status = req.query.status;
			var subject = req.query.subject;
			
			
	
			//susun query
      var condition = "";
      var join = "";
			
			if(typeof nutritionOrderId !== 'undefined' && nutritionOrderId !== ""){
        condition += "dr.diagnostic_report_id = '" + nutritionOrderId + "' AND,";  
      }
			
			if((typeof based_on !== 'undefined' && based_on !== "")){ 
			 var res = based_on.substring(0, 3);
				if(res == 'cap'){
					join += " LEFT JOIN BACIRO_FHIR.CAREPLAN cap ON dr.diagnostic_report_id = cap.diagnostic_report_id ";
          condition += "CAREPLAN_ID = '" + based_on + "' AND ";       
				} 
				if(res == 'imr') {
					join += " LEFT JOIN BACIRO_FHIR.immunization_recommendation ir ON dr.diagnostic_report_id = ir.diagnostic_report_id ";
          condition += "immunization_recommendation_id = '" + based_on + "' AND ";       
				}
				
				if(res == 'mer'){
					join += " LEFT JOIN BACIRO_FHIR.MEDICATION_REQUEST mr ON dr.diagnostic_report_id = mr.diagnostic_report_id ";
          condition += "MEDICATION_REQUEST_ID = '" + based_on + "' AND ";       
				}
				
				if(res == 'pre') {
					join += " LEFT JOIN BACIRO_FHIR.PROCEDURE_REQUEST pr ON dr.diagnostic_report_id = pr.diagnostic_report_id ";
          condition += "PROCEDURE_REQUEST_id = '" + based_on + "' AND ";       
				}
				
				if(res == 'cap'){
					join += " LEFT JOIN BACIRO_FHIR.REFERRAL_REQUEST rr ON dr.diagnostic_report_id = rr.diagnostic_report_id ";
          condition += "REFERRAL_REQUEST_ID = '" + based_on + "' AND ";       
				} 
				
				if(res == 'imr') {
					join += " LEFT JOIN BACIRO_FHIR.Nutrition_Order  no ON dr.diagnostic_report_id = no.diagnostic_report_id ";
          condition += "Nutrition_Order_id = '" + based_on + "' AND ";       
				}
      }
			
			if(typeof category !== 'undefined' && category !== ""){
				condition += "dr.category = '" + category + "' AND,";  
      }
			
			if(typeof code !== 'undefined' && code !== ""){
				condition += "dr.CODE = '" + code + "' AND,";  
      }
			
			if(typeof context !== 'undefined' && context !== ""){
				condition += "(dr.CONTEXT_ENCOUNTER = '" + context + "' OR dr.CONTEXT_EPISODE_OF_CARE = '" + context + "') AND,";  
			}
			
			if (typeof date !== 'undefined' && date !== "") {
        condition += "dr.effective_period_start <= to_date('" + date + "', 'yyyy-MM-dd') AND dr.effective_period_end >= to_date('" + date + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof diagnosis !== 'undefined' && diagnosis !== ""){
				condition += "dr.coded_diagnosis = '" + diagnosis + "' AND,";  
      }
			
			if(typeof encounter !== 'undefined' && encounter !== ""){
			  condition += "dr.CONTEXT_ENCOUNTER = '" + encounter + "' AND,";  
      }
			
			if((typeof identifier !== 'undefined' && identifier !== "")){
        join += " LEFT JOIN BACIRO_FHIR.IDENTIFIER i ON i.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "i.identifier_value = '" + identifier + "' AND ";
      }
			
			if((typeof image !== 'undefined' && image !== "")){
        join += " LEFT JOIN BACIRO_FHIR.Media me ON me.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "me.media_id = '" + image + "' AND ";
      }
			
			if(typeof patient !== 'undefined' && patient !== ""){
			  condition += "dr.subject_patient = '" + patient + "' AND,";  
      }
			
			if(typeof issued !== 'undefined' && issued !== ""){
			  condition += "dr.issued == to_date('" + issued + "', 'yyyy-MM-dd') AND,";
      }
			
			if(typeof performer !== 'undefined' && performer !== ""){
				join += " LEFT JOIN BACIRO_FHIR.diagnostic_report_performer drp ON drp.diagnostic_report_id = dr.diagnostic_report_id ";
				condition += "(drp.actor_practitioner = '" + performer + "' OR drp.actor_organization = '" + performer + "') AND,";  
			}
			
			if((typeof result !== 'undefined' && result !== "")){
        join += " LEFT JOIN BACIRO_FHIR.observation obs ON obs.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "obs.observation_id = '" + result + "' AND ";
      }
			
			if((typeof specimen !== 'undefined' && specimen !== "")){
        join += " LEFT JOIN BACIRO_FHIR.Specimen spe ON spe.diagnostic_report_id = dr.diagnostic_report_id ";
        condition += "spe.specimen_id = '" + specimen + "' AND ";
      }
			if(typeof status !== 'undefined' && status !== ""){
				condition += "dr.status = '" + status + "' AND,";  
      }
			
			if(typeof subject !== 'undefined' && subject !== ""){
				condition += "(dr.SUBJECT_PATIENT = '" + subject + "' OR dr.SUBJECT_GROUP = '" + subject + "' OR dr.subject_device = '" + subject + "' OR dr.subject_location = '" + subject + "') AND,";  
			}*/
			
			if(condition == ""){
        fixCondition = "";
      }else{
        fixCondition = join +" WHERE  "+ condition.slice(0, -4);
      }

			var arrNutritionOrder = [];
      var query = "select nuo.nutrition_order_id as nutrition_order_id, nuo.status as status, nuo.patient as patient, nuo.encounter as encounter, nuo.date_time as date_time, nuo.orderer as orderer, nuo.food_preference_modifier as food_preference_modifier, nuo.exclude_food_modifier as exclude_food_modifier, nuo.oral_diet_type as oral_diet_type, nuo.oral_diet_schedule as oral_diet_schedule, nuo.fluid_consistency_type as fluid_consistency_type, nuo.instruction as instruction, nuo.enter_formula_base_formula_type as enter_formula_base_formula_type, nuo.enter_formula_base_formula_product_name as enter_formula_base_formula_product_name, nuo.enter_formula_additive_type as enter_formula_additive_type, nuo.enter_formula_additive_product_name as enter_formula_additive_product_name, nuo.enter_formula_caloric_density as enter_formula_caloric_density, nuo.enter_formula_route_of_administration as enter_formula_route_of_administration, nuo.enter_formula_max_volume_to_deliver as enter_formula_max_volume_to_deliver, nuo.enter_formula_administration_instruction as enter_formula_administration_instruction from BACIRO_FHIR.nutrition_order nuo " + fixCondition;
			//console.log(query);			
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var NutritionOrder = {};
					NutritionOrder.resourceType = "NutritionOrder";
          NutritionOrder.id = rez[i].nutrition_order_id;
					NutritionOrder.status = rez[i].status;
					if (rez[i].patient !== 'null') {
						NutritionOrder.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient;
					} else {
						NutritionOrder.patient = "";
					}
					if (rez[i].encounter !== 'null') {
						NutritionOrder.encounter = hostFHIR + ':' + portFHIR + '/' + apikey + '/Encounter?_id=' +  rez[i].encounter;
					} else {
						NutritionOrder.encounter = "";
					}
					if(rez[i].date_time == null){
						NutritionOrder.dateTime = formatDate(rez[i].date_time);
					}else{
						NutritionOrder.dateTime = rez[i].date_time;
					}
					if (rez[i].orderer !== 'null') {
						NutritionOrder.orderer = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].orderer;
					} else {
						NutritionOrder.orderer = "";
					}
					NutritionOrder.foodPreferenceModifier = rez[i].food_preference_modifier;
					NutritionOrder.excludeFoodModifier = rez[i].exclude_food_modifier;
					NutritionOrder.oralDiet.type = rez[i].oral_diet_type;
					NutritionOrder.oralDiet.schedule = rez[i].oral_diet_schedule;
					NutritionOrder.oralDiet.fluidConsistencyType = rez[i].fluid_consistency_type;
					NutritionOrder.oralDiet.instruction = rez[i].instruction;
					NutritionOrder.enteralFormula.baseFormulaType = rez[i].enter_formula_base_formula_type;
					NutritionOrder.enteralFormula.baseFormulaProductName	 = rez[i].enter_formula_base_formula_product_name;
					NutritionOrder.enteralFormula.additiveType = rez[i].enter_formula_additive_type;
					NutritionOrder.enteralFormula.additiveProductName = rez[i].enter_formula_additive_product_name;
					NutritionOrder.enteralFormula.caloricDensity = rez[i].enter_formula_caloric_density;
					NutritionOrder.enteralFormula.routeofAdministration = rez[i].enter_formula_route_of_administration;
					NutritionOrder.enteralFormula.maxVolumeToDeliver = rez[i].enter_formula_max_volume_to_deliver;
					NutritionOrder.enteralFormula.administrationInstruction	 = rez[i].enter_formula_administration_instruction;
					
					
          arrNutritionOrder[i] = NutritionOrder;
        }
        res.json({"err_code":0,"data": arrNutritionOrder});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getNutritionOrder"});
      });
    },
		nutritionOrderNutrient: function getNutritionOrderNutrient(req, res) {
			var apikey = req.params.apikey;
			
			var nutritionOrderNutrientId = req.query._id;
			var nutritionOrderId = req.query.nutrition_order_id;

			//susun query
			var condition = "";

			if (typeof nutritionOrderNutrientId !== 'undefined' && nutritionOrderNutrientId !== "") {
				condition += "nutrient_id = '" + nutritionOrderNutrientId + "' AND ";
			}

			if (typeof nutritionOrderId !== 'undefined' && nutritionOrderId !== "") {
				condition += "nutrition_order_id = '" + nutritionOrderId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrNutritionOrderNutrient = [];
			var query = "select nutrient_id, modifier, amount from BACIRO_FHIR.nutrient " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var NutritionOrderNutrient = {};
					NutritionOrderNutrient.id = rez[i].nutrient_id;
					NutritionOrderNutrient.modifier = rez[i].modifier;
					NutritionOrderNutrient.amount = rez[i].amount;
					arrNutritionOrderNutrient[i] = NutritionOrderNutrient;
				}
				res.json({
					"err_code": 0,
					"data": arrNutritionOrderNutrient
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getNutritionOrderNutrient"
				});
			});
		},
		nutritionOrderTexture: function getNutritionOrderTexture(req, res) {
			var apikey = req.params.apikey;
			
			var nutritionOrderTextureId = req.query._id;
			var nutritionOrderId = req.query.nutrition_order_id;

			//susun query
			var condition = "";

			if (typeof nutritionOrderTextureId !== 'undefined' && nutritionOrderTextureId !== "") {
				condition += "texture_id = '" + nutritionOrderTextureId + "' AND ";
			}

			if (typeof nutritionOrderId !== 'undefined' && nutritionOrderId !== "") {
				condition += "nutrition_order_id = '" + nutritionOrderId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrNutritionOrderTexture = [];
			var query = "select texture_id, modifier, food_type from BACIRO_FHIR.texture " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var NutritionOrderTexture = {};
					NutritionOrderTexture.id = rez[i].texture_id;
					NutritionOrderTexture.modifier = rez[i].modifier;
					NutritionOrderTexture.foodType = rez[i].food_type;
					
					arrNutritionOrderTexture[i] = NutritionOrderTexture;
				}
				res.json({
					"err_code": 0,
					"data": arrNutritionOrderTexture
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getNutritionOrderTexture"
				});
			});
		},
		nutritionOrderSupplement: function getNutritionOrderSupplement(req, res) {
			var apikey = req.params.apikey;
			
			var nutritionOrderSupplementId = req.query._id;
			var nutritionOrderId = req.query.nutrition_order_id;

			//susun query
			var condition = "";

			if (typeof nutritionOrderSupplementId !== 'undefined' && nutritionOrderSupplementId !== "") {
				condition += "supplement_id = '" + nutritionOrderSupplementId + "' AND ";
			}

			if (typeof nutritionOrderId !== 'undefined' && nutritionOrderId !== "") {
				condition += "nutrition_order_id = '" + nutritionOrderId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			

			var arrNutritionOrderSupplement = [];
			var query = "select supplement_id, type, product_name, quantity, instruction from BACIRO_FHIR.supplement " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var NutritionOrderSupplement = {};
					NutritionOrderSupplement.id = rez[i].supplement_id;
					NutritionOrderSupplement.type = rez[i].type;
					NutritionOrderSupplement.productName = rez[i].product_name;
					NutritionOrderSupplement.quantity = rez[i].quantity;
					NutritionOrderSupplement.instruction = rez[i].instruction;
					
					arrNutritionOrderSupplement[i] = NutritionOrderSupplement;
				}
				res.json({
					"err_code": 0,
					"data": arrNutritionOrderSupplement
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getNutritionOrderSupplement"
				});
			});
		},
		nutritionOrderEnternalFormulaAdmin: function getNutritionOrderEnternalFormulaAdmin(req, res) {
			var apikey = req.params.apikey;
			
			var nutritionOrderEnternalFormulaAdminId = req.query._id;
			var nutritionOrderId = req.query.nutrition_order_id;

			//susun query
			var condition = "";

			if (typeof nutritionOrderEnternalFormulaAdminId !== 'undefined' && nutritionOrderEnternalFormulaAdminId !== "") {
				condition += "administration_id = '" + nutritionOrderEnternalFormulaAdminId + "' AND ";
			}

			if (typeof nutritionOrderId !== 'undefined' && nutritionOrderId !== "") {
				condition += "nutrition_order_id = '" + nutritionOrderId + "' AND ";
			}

			if (condition == "") {
				fixCondition = "";
			} else {
				fixCondition = " WHERE " + condition.slice(0, -4);
			}
			
			var arrNutritionOrderEnternalFormulaAdmin = [];
			var query = "select administration_id, schedule, quantity, rate_quantity, rate_ratio_numerator, rate_ratio_denominator from BACIRO_FHIR.enternal_formula_admin " + fixCondition;

			db.query(query, function (dataJson) {
				rez = lowercaseObject(dataJson);
				for (i = 0; i < rez.length; i++) {
					var NutritionOrderEnternalFormulaAdmin = {};
					NutritionOrderEnternalFormulaAdmin.id = rez[i].administration_id;
					NutritionOrderEnternalFormulaAdmin.schedule = rez[i].schedule;
					NutritionOrderEnternalFormulaAdmin.quantity = rez[i].quantity;
					NutritionOrderEnternalFormulaAdmin.rate.rateQuantity = rez[i].rate_quantity;
					NutritionOrderEnternalFormulaAdmin.rate.rateRatio = rez[i].rate_ratio_numerator + ' to ' + rez[i].rate_ratio_denominator;
					
					arrNutritionOrderEnternalFormulaAdmin[i] = NutritionOrderEnternalFormulaAdmin;
				}
				res.json({
					"err_code": 0,
					"data": arrNutritionOrderEnternalFormulaAdmin
				});
			}, function (e) {
				res.json({
					"err_code": 1,
					"err_msg": e,
					"application": "Api Phoenix",
					"function": "getNutritionOrderEnternalFormulaAdmin"
				});
			});
		},
  },
	post: {
		nutritionOrder: function addNutritionOrder(req, res) {
			console.log(req.body);
			var nutrition_order_id  = req.body.nutrition_order_id;
			var status  = req.body.status;
			var patient  = req.body.patient;
			var encounter  = req.body.encounter;
			var date_time  = req.body.date_time;
			var orderer  = req.body.orderer;
			var food_preference_modifier  = req.body.food_preference_modifier;
			var exclude_food_modifier  = req.body.exclude_food_modifier;
			var oral_diet_type  = req.body.oral_diet_type;
			var oral_diet_schedule  = req.body.oral_diet_schedule;
			var fluid_consistency_type  = req.body.fluid_consistency_type;
			var instruction  = req.body.instruction;
			var enter_formula_base_formula_type  = req.body.enter_formula_base_formula_type;
			var enter_formula_base_formula_product_name  = req.body.enter_formula_base_formula_product_name;
			var enter_formula_additive_type  = req.body.enter_formula_additive_type;
			var enter_formula_additive_product_name  = req.body.enter_formula_additive_product_name;
			var enter_formula_caloric_density  = req.body.enter_formula_caloric_density; integer NULL,
			var enter_formula_route_of_administration  = req.body.enter_formula_route_of_administration;
			var enter_formula_max_volume_to_deliver  = req.body.enter_formula_max_volume_to_deliver; integer NULL,
			var enter_formula_administration_instruction  = req.body.enter_formula_administration_instruction;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var goal_id  = req.body.goal_id;
			var observation_id  = req.body.observation_id;

			var column = "";
      var values = "";
			
				
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof encounter !== 'undefined' && encounter !== "") {
        column += 'encounter,';
        values += "'" + encounter + "',";
      }	
			
			if (typeof date_time !== 'undefined' && date_time !== "") {
        column += 'date_time,';
				values += "to_date('"+ date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof orderer !== 'undefined' && orderer !== "") {
        column += 'orderer,';
        values += "'" + orderer + "',";
      }
			
			if (typeof food_preference_modifier !== 'undefined' && food_preference_modifier !== "") {
        column += 'food_preference_modifier,';
        values += "'" + food_preference_modifier + "',";
      }	
			
			if (typeof exclude_food_modifier !== 'undefined' && exclude_food_modifier !== "") {
        column += 'exclude_food_modifier,';
        values += "'" + exclude_food_modifier + "',";
      }		
			
			if (typeof oral_diet_type !== 'undefined' && oral_diet_type !== "") {
        column += 'oral_diet_type,';
        values += "'" + oral_diet_type + "',";
      }		
				
			if (typeof oral_diet_schedule !== 'undefined' && oral_diet_schedule !== "") {
        column += 'oral_diet_schedule,';
        values += "'" + oral_diet_schedule + "',";
      }		
			
			if (typeof fluid_consistency_type !== 'undefined' && fluid_consistency_type !== "") {
        column += 'fluid_consistency_type,';
        values += "'" + fluid_consistency_type + "',";
      }		
			
			if (typeof instruction !== 'undefined' && instruction !== "") {
        column += 'instruction,';
        values += "'" + instruction + "',";
      }		
			
			if (typeof enter_formula_base_formula_type !== 'undefined' && enter_formula_base_formula_type !== "") {
        column += 'enter_formula_base_formula_type,';
        values += "'" + enter_formula_base_formula_type + "',";
      }		
			
			if (typeof enter_formula_base_formula_product_name !== 'undefined' && enter_formula_base_formula_product_name !== "") {
        column += 'enter_formula_base_formula_product_name,';
        values += "'" + enter_formula_base_formula_product_name + "',";
      }		
			
			if (typeof enter_formula_additive_type !== 'undefined' && enter_formula_additive_type !== "") {
        column += 'enter_formula_additive_type,';
        values += "'" + enter_formula_additive_type + "',";
      }		
			
			if (typeof enter_formula_additive_product_name !== 'undefined' && enter_formula_additive_product_name !== "") {
        column += 'enter_formula_additive_product_name,';
        values += "'" + enter_formula_additive_product_name + "',";
      }		
			
			if (typeof enter_formula_caloric_density !== 'undefined' && enter_formula_caloric_density !== "") {
        column += 'enter_formula_caloric_density,';
        values += " " + enter_formula_caloric_density + ",";
      }
			
			if (typeof enter_formula_route_of_administration !== 'undefined' && enter_formula_route_of_administration !== "") {
        column += 'enter_formula_route_of_administration,';
        values += "'" + enter_formula_route_of_administration + "',";
      }		
			
			if (typeof enter_formula_max_volume_to_deliver !== 'undefined' && enter_formula_max_volume_to_deliver !== "") {
        column += 'enter_formula_max_volume_to_deliver,';
        values += " " + enter_formula_max_volume_to_deliver + ",";
      }
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }		
			
			if (typeof goal_id !== 'undefined' && goal_id !== "") {
        column += 'goal_id,';
        values += "'" + goal_id + "',";
      }		
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }		
			
			var query = "UPSERT INTO BACIRO_FHIR.nutrition_order(nutrition_order_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+nutrition_order_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select nutrition_order_id from BACIRO_FHIR.nutrition_order WHERE nutrition_order_id = '" + nutrition_order_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addNutritionOrder"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addNutritionOrder"});
      });
    },
		nutritionOrderNutrient: function addNutritionOrderNutrient(req, res) {
			console.log(req.body);
			var nutrient_id  = req.body.nutrient_id;
			var modifier  = req.body.modifier;
			var amount  = req.body.amount;
			var nutrition_order_id  = req.body.nutrition_order_id;
			
			var column = "";
      var values = "";
			
			if (typeof modifier !== 'undefined' && modifier !== "") {
        column += 'modifier,';
        values += "'" + modifier + "',";
      }
			
			if (typeof amount !== 'undefined' && amount !== "") {
        column += 'amount,';
        values += " " + amount + ",";
      }
			
			if (typeof nutrition_order_id !== 'undefined' && nutrition_order_id !== "") {
        column += 'nutrition_order_id,';
        values += "'" + nutrition_order_id + "',";
      }	

      var query = "UPSERT INTO BACIRO_FHIR.nutrient(nutrient_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+nutrient_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select nutrient_id from BACIRO_FHIR.nutrient WHERE nutrient_id = '" + nutrient_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addNutritionOrderNutrient"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addNutritionOrderNutrient"});
      });
    },
		nutritionOrderTexture: function addNutritionOrderTexture(req, res) {
			console.log(req.body);
			var texture_id  = req.body.texture_id;
			var modifier  = req.body.modifier;
			var food_type  = req.body.food_type;
			var nutrition_order_id  = req.body.nutrition_order_id;
			
			var column = "";
      var values = "";
			
			if (typeof modifier !== 'undefined' && modifier !== "") {
        column += 'modifier,';
        values += "'" + modifier + "',";
      }
			
			if (typeof food_type !== 'undefined' && food_type !== "") {
        column += 'food_type,';
        values += " '" + food_type + "',";
      }
			
			if (typeof nutrition_order_id !== 'undefined' && nutrition_order_id !== "") {
        column += 'nutrition_order_id,';
        values += "'" + nutrition_order_id + "',";
      }	
			
      var query = "UPSERT INTO BACIRO_FHIR.texture(texture_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+texture_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select texture_id from BACIRO_FHIR.texture WHERE texture_id = '" + texture_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addNutritionOrderTexture"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addNutritionOrderTexture"});
      });
    },
		nutritionOrderSupplement: function addNutritionOrderSupplement(req, res) {
			console.log(req.body);
			var supplement_id  = req.body.supplement_id;
			var type  = req.body.type;
			var product_name  = req.body.product_name;
			var quantity  = req.body.quantity;
			var instruction  = req.body.instruction;
			var nutrition_order_id  = req.body.nutrition_order_id;
			
			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof product_name !== 'undefined' && product_name !== "") {
        column += 'product_name,';
        values += " '" + product_name + "',";
      }
			
			if (typeof quantity !== 'undefined' && quantity !== "") {
        column += 'quantity,';
        values += " " + quantity + ",";
      }
			
			if (typeof instruction !== 'undefined' && instruction !== "") {
        column += 'instruction,';
        values += "'" + instruction + "',";
      }	
			
			if (typeof nutrition_order_id !== 'undefined' && nutrition_order_id !== "") {
        column += 'nutrition_order_id,';
        values += "'" + nutrition_order_id + "',";
      }	
			
      var query = "UPSERT INTO BACIRO_FHIR.supplement(supplement_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+supplement_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select supplement_id from BACIRO_FHIR.supplement WHERE supplement_id = '" + supplement_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addNutritionOrderSupplement"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addNutritionOrderSupplement"});
      });
    },
		nutritionOrderEnternalFormulaAdmin: function addNutritionOrderEnternalFormulaAdmin(req, res) {
			console.log(req.body);
			var administration_id  = req.body.administration_id;
			var schedule  = req.body.schedule;
			var quantity  = req.body.quantity;
			var rate_quantity  = req.body.rate_quantity;
			var rate_ratio_numerator  = req.body.rate_ratio_numerator;
			var rate_ratio_denominator  = req.body.rate_ratio_denominator;
			var nutrition_order_id  = req.body.nutrition_order_id;
			
			var column = "";
      var values = "";
			
			if (typeof schedule !== 'undefined' && schedule !== "") {
        column += 'schedule,';
        values += "'" + schedule + "',";
      }
			
			if (typeof quantity !== 'undefined' && quantity !== "") {
        column += 'quantity,';
        values += " " + quantity + ",";
      }
			
			if (typeof rate_quantity !== 'undefined' && rate_quantity !== "") {
        column += 'rate_quantity,';
        values += " " + rate_quantity + ",";
      }
			
			if (typeof rate_ratio_numerator !== 'undefined' && rate_ratio_numerator !== "") {
        column += 'rate_ratio_numerator,';
        values += " " + rate_ratio_numerator + ",";
      }
			
			if (typeof rate_ratio_denominator !== 'undefined' && rate_ratio_denominator !== "") {
        column += 'rate_ratio_denominator,';
        values += " " + rate_ratio_denominator + ",";
      }
			
			if (typeof nutrition_order_id !== 'undefined' && nutrition_order_id !== "") {
        column += 'nutrition_order_id,';
        values += "'" + nutrition_order_id + "',";
      }	
			
      var query = "UPSERT INTO BACIRO_FHIR.enternal_formula_admin(administration_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+administration_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select administration_id from BACIRO_FHIR.enternal_formula_admin WHERE administration_id = '" + administration_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addNutritionOrderEnternalFormulaAdmin"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addNutritionOrderEnternalFormulaAdmin"});
      });
    },
	},
	put: {
		nutritionOrder: function updateNutritionOrder(req, res) {
			console.log(req.body);
			var nutrition_order_id  = req.params.nutrition_order_id;
			var status  = req.body.status;
			var patient  = req.body.patient;
			var encounter  = req.body.encounter;
			var date_time  = req.body.date_time;
			var orderer  = req.body.orderer;
			var food_preference_modifier  = req.body.food_preference_modifier;
			var exclude_food_modifier  = req.body.exclude_food_modifier;
			var oral_diet_type  = req.body.oral_diet_type;
			var oral_diet_schedule  = req.body.oral_diet_schedule;
			var fluid_consistency_type  = req.body.fluid_consistency_type;
			var instruction  = req.body.instruction;
			var enter_formula_base_formula_type  = req.body.enter_formula_base_formula_type;
			var enter_formula_base_formula_product_name  = req.body.enter_formula_base_formula_product_name;
			var enter_formula_additive_type  = req.body.enter_formula_additive_type;
			var enter_formula_additive_product_name  = req.body.enter_formula_additive_product_name;
			var enter_formula_caloric_density  = req.body.enter_formula_caloric_density;
			var enter_formula_route_of_administration  = req.body.enter_formula_route_of_administration;
			var enter_formula_max_volume_to_deliver  = req.body.enter_formula_max_volume_to_deliver;
			var enter_formula_administration_instruction  = req.body.enter_formula_administration_instruction;
			var diagnostic_report_id  = req.body.diagnostic_report_id;
			var goal_id  = req.body.goal_id;
			var observation_id  = req.body.observation_id;

			var column = "";
      var values = "";
			
				
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof encounter !== 'undefined' && encounter !== "") {
        column += 'encounter,';
        values += "'" + encounter + "',";
      }	
			
			if (typeof date_time !== 'undefined' && date_time !== "") {
        column += 'date_time,';
				values += "to_date('"+ date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof orderer !== 'undefined' && orderer !== "") {
        column += 'orderer,';
        values += "'" + orderer + "',";
      }
			
			if (typeof food_preference_modifier !== 'undefined' && food_preference_modifier !== "") {
        column += 'food_preference_modifier,';
        values += "'" + food_preference_modifier + "',";
      }	
			
			if (typeof exclude_food_modifier !== 'undefined' && exclude_food_modifier !== "") {
        column += 'exclude_food_modifier,';
        values += "'" + exclude_food_modifier + "',";
      }		
			
			if (typeof oral_diet_type !== 'undefined' && oral_diet_type !== "") {
        column += 'oral_diet_type,';
        values += "'" + oral_diet_type + "',";
      }		
				
			if (typeof oral_diet_schedule !== 'undefined' && oral_diet_schedule !== "") {
        column += 'oral_diet_schedule,';
        values += "'" + oral_diet_schedule + "',";
      }		
			
			if (typeof fluid_consistency_type !== 'undefined' && fluid_consistency_type !== "") {
        column += 'fluid_consistency_type,';
        values += "'" + fluid_consistency_type + "',";
      }		
			
			if (typeof instruction !== 'undefined' && instruction !== "") {
        column += 'instruction,';
        values += "'" + instruction + "',";
      }		
			
			if (typeof enter_formula_base_formula_type !== 'undefined' && enter_formula_base_formula_type !== "") {
        column += 'enter_formula_base_formula_type,';
        values += "'" + enter_formula_base_formula_type + "',";
      }		
			
			if (typeof enter_formula_base_formula_product_name !== 'undefined' && enter_formula_base_formula_product_name !== "") {
        column += 'enter_formula_base_formula_product_name,';
        values += "'" + enter_formula_base_formula_product_name + "',";
      }		
			
			if (typeof enter_formula_additive_type !== 'undefined' && enter_formula_additive_type !== "") {
        column += 'enter_formula_additive_type,';
        values += "'" + enter_formula_additive_type + "',";
      }		
			
			if (typeof enter_formula_additive_product_name !== 'undefined' && enter_formula_additive_product_name !== "") {
        column += 'enter_formula_additive_product_name,';
        values += "'" + enter_formula_additive_product_name + "',";
      }		
			
			if (typeof enter_formula_caloric_density !== 'undefined' && enter_formula_caloric_density !== "") {
        column += 'enter_formula_caloric_density,';
        values += " " + enter_formula_caloric_density + ",";
      }
			
			if (typeof enter_formula_route_of_administration !== 'undefined' && enter_formula_route_of_administration !== "") {
        column += 'enter_formula_route_of_administration,';
        values += "'" + enter_formula_route_of_administration + "',";
      }		
			
			if (typeof enter_formula_max_volume_to_deliver !== 'undefined' && enter_formula_max_volume_to_deliver !== "") {
        column += 'enter_formula_max_volume_to_deliver,';
        values += " " + enter_formula_max_volume_to_deliver + ",";
      }
			
			if (typeof diagnostic_report_id !== 'undefined' && diagnostic_report_id !== "") {
        column += 'diagnostic_report_id,';
        values += "'" + diagnostic_report_id + "',";
      }		
			
			if (typeof goal_id !== 'undefined' && goal_id !== "") {
        column += 'goal_id,';
        values += "'" + goal_id + "',";
      }		
			
			if (typeof observation_id !== 'undefined' && observation_id !== "") {
        column += 'observation_id,';
        values += "'" + observation_id + "',";
      }		
			
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "nutrition_order_id = '" + nutrition_order_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.nutrition_order(nutrition_order_id," + column.slice(0, -1) + ") SELECT nutrition_order_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.nutrition_order WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select nutrition_order_id from BACIRO_FHIR.nutrition_order WHERE nutrition_order_id = '" + nutrition_order_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateNutritionOrder"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateNutritionOrder"});
      });
    },
		nutritionOrderNutrient: function updateNutritionOrderNutrient(req, res) {
			console.log(req.body);
			var nutrient_id  = req.params.nutrient_id;
			var modifier  = req.body.modifier;
			var amount  = req.body.amount;
			var nutrition_order_id  = req.body.nutrition_order_id;
			
			var column = "";
      var values = "";
			
			if (typeof modifier !== 'undefined' && modifier !== "") {
        column += 'modifier,';
        values += "'" + modifier + "',";
      }
			
			if (typeof amount !== 'undefined' && amount !== "") {
        column += 'amount,';
        values += " " + amount + ",";
      }
			
			if (typeof nutrition_order_id !== 'undefined' && nutrition_order_id !== "") {
        column += 'nutrition_order_id,';
        values += "'" + nutrition_order_id + "',";
      }	
      
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "nutrient_id = '" + nutrient_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.nutrient(nutrient_id," + column.slice(0, -1) + ") SELECT nutrient_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.nutrient WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select nutrient_id from BACIRO_FHIR.nutrient WHERE nutrient_id = '" + nutrient_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateNutritionOrderNutrient"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateNutritionOrderNutrient"});
      });
    },
		nutritionOrderTexture: function updateNutritionOrderTexture(req, res) {
			console.log(req.body);
			var texture_id  = req.params.texture_id;
			var modifier  = req.body.modifier;
			var food_type  = req.body.food_type;
			var nutrition_order_id  = req.body.nutrition_order_id;
			
			var column = "";
      var values = "";
			
			if (typeof modifier !== 'undefined' && modifier !== "") {
        column += 'modifier,';
        values += "'" + modifier + "',";
      }
			
			if (typeof food_type !== 'undefined' && food_type !== "") {
        column += 'food_type,';
        values += " '" + food_type + "',";
      }
			
			if (typeof nutrition_order_id !== 'undefined' && nutrition_order_id !== "") {
        column += 'nutrition_order_id,';
        values += "'" + nutrition_order_id + "',";
      }		
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "texture_id = '" + texture_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.texture(texture_id," + column.slice(0, -1) + ") SELECT texture_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.texture WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select texture_id from BACIRO_FHIR.texture WHERE texture_id = '" + texture_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateNutritionOrderTexture"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateNutritionOrderTexture"});
      });
    },
		nutritionOrderSupplement: function updateNutritionOrderSupplement(req, res) {
			console.log(req.body);
			var supplement_id  = req.params.supplement_id;
			var type  = req.body.type;
			var product_name  = req.body.product_name;
			var quantity  = req.body.quantity;
			var instruction  = req.body.instruction;
			var nutrition_order_id  = req.body.nutrition_order_id;
			
			var column = "";
      var values = "";
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }
			
			if (typeof product_name !== 'undefined' && product_name !== "") {
        column += 'product_name,';
        values += " '" + product_name + "',";
      }
			
			if (typeof quantity !== 'undefined' && quantity !== "") {
        column += 'quantity,';
        values += " " + quantity + ",";
      }
			
			if (typeof instruction !== 'undefined' && instruction !== "") {
        column += 'instruction,';
        values += "'" + instruction + "',";
      }	
			
			if (typeof nutrition_order_id !== 'undefined' && nutrition_order_id !== "") {
        column += 'nutrition_order_id,';
        values += "'" + nutrition_order_id + "',";
      }	
				
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "supplement_id = '" + supplement_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.supplement(supplement_id," + column.slice(0, -1) + ") SELECT supplement_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.supplement WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select supplement_id from BACIRO_FHIR.supplement WHERE supplement_id = '" + supplement_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateNutritionOrderSupplement"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateNutritionOrderSupplement"});
      });
    },
		nutritionOrderEnternalFormulaAdmin: function updateNutritionOrderEnternalFormulaAdmin(req, res) {
			console.log(req.body);
			var administration_id  = req.params.administration_id;
			var schedule  = req.body.schedule;
			var quantity  = req.body.quantity;
			var rate_quantity  = req.body.rate_quantity;
			var rate_ratio_numerator  = req.body.rate_ratio_numerator;
			var rate_ratio_denominator  = req.body.rate_ratio_denominator;
			var nutrition_order_id  = req.body.nutrition_order_id;
			
			var column = "";
      var values = "";
			
			if (typeof schedule !== 'undefined' && schedule !== "") {
        column += 'schedule,';
        values += "'" + schedule + "',";
      }
			
			if (typeof quantity !== 'undefined' && quantity !== "") {
        column += 'quantity,';
        values += " " + quantity + ",";
      }
			
			if (typeof rate_quantity !== 'undefined' && rate_quantity !== "") {
        column += 'rate_quantity,';
        values += " " + rate_quantity + ",";
      }
			
			if (typeof rate_ratio_numerator !== 'undefined' && rate_ratio_numerator !== "") {
        column += 'rate_ratio_numerator,';
        values += " " + rate_ratio_numerator + ",";
      }
			
			if (typeof rate_ratio_denominator !== 'undefined' && rate_ratio_denominator !== "") {
        column += 'rate_ratio_denominator,';
        values += " " + rate_ratio_denominator + ",";
      }
			
			if (typeof nutrition_order_id !== 'undefined' && nutrition_order_id !== "") {
        column += 'nutrition_order_id,';
        values += "'" + nutrition_order_id + "',";
      }	
				
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "administration_id = '" + administration_id + "' AND " + fieldResource + " = '" + valueResource + "'";
			
			var query = "UPSERT INTO BACIRO_FHIR.enternal_formula_admin(administration_id," + column.slice(0, -1) + ") SELECT administration_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.enternal_formula_admin WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select administration_id from BACIRO_FHIR.enternal_formula_admin WHERE administration_id = '" + administration_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateNutritionOrderEnternalFormulaAdmin"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateNutritionOrderEnternalFormulaAdmin"});
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