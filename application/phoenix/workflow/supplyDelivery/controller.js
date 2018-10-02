var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var path = require('path');

var configYaml = yamlconfig.readConfig(path.resolve('../../application/config/config.yml'));

//supplyDelivery emitter
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
		supplyDelivery: function getSupplyDelivery(req, res){
			var apikey = req.params.apikey;
			var supplyDeliveryId = req.query._id;
			
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
			
			if(typeof supplyDeliveryId !== 'undefined' && supplyDeliveryId !== ""){
        condition += "dr.diagnostic_report_id = '" + supplyDeliveryId + "' AND,";  
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

			
			var arrSupplyDelivery = [];
      var query = "select sd.supply_delivery_id as supply_delivery_id, sd.identifier as identifier, sd.part_of as part_of, sd.status as status, sd.patient as patient, sd.type as type, sd.supplied_item_qty as supplied_item_qty, sd.item_codeable_concept as item_codeable_concept, sd.item_ref_medication as item_ref_medication, sd.item_ref_substance as item_ref_substance, sd.item_ref_device as item_ref_device, sd.occurrence_date_time as occurrence_date_time, sd.occurrence_period_start as occurrence_period_start, sd.occurrence_period_end as occurrence_period_end, sd.occurrence_timing as occurrence_timing, sd.supplier_practitioner as supplier_practitioner, sd.supplier_org as supplier_org, sd.destination as destination from BACIRO_FHIR.supply_delivery sd " + fixCondition;
			//console.log(query);			
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var SupplyDelivery = {};
					SupplyDelivery.resourceType = "SupplyDelivery";
					SupplyDelivery.id = rez[i].supply_delivery_id;
					SupplyDelivery.identifier = rez[i].identifier;
					SupplyDelivery.partOf = rez[i].part_of;
					SupplyDelivery.status = rez[i].status;
					if(rez[i].patient != "null"){
						SupplyDelivery.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].patient;
					} else {
						SupplyDelivery.patient = "";
					}
					SupplyDelivery.type = rez[i].type;
					SupplyDelivery.suppliedItem.quantity = rez[i].supplied_item_qty;
					SupplyDelivery.suppliedItem.item.itemCodeableConcept = rez[i].item_codeable_concept;
					if(rez[i].item_ref_medication != "null"){
						SupplyDelivery.suppliedItem.item.itemReference.medication = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' +  rez[i].item_ref_medication;
					} else {
						SupplyDelivery.suppliedItem.item.itemReference.medication = "";
					}
					if(rez[i].item_ref_substance != "null"){
						SupplyDelivery.suppliedItem.item.itemReference.substance = hostFHIR + ':' + portFHIR + '/' + apikey + '/Substance?_id=' +  rez[i].item_ref_substance;
					} else {
						SupplyDelivery.suppliedItem.item.itemReference.substance = "";
					}
					if(rez[i].item_ref_device != "null"){
						SupplyDelivery.suppliedItem.item.itemReference.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].item_ref_device;
					} else {
						SupplyDelivery.suppliedItem.item.itemReference.device = "";
					}
					if(rez[i].occurrence_date_time == null){
						SupplyDelivery.occurrence.occurrenceDateTime = formatDate(rez[i].occurrence_date_time);
					}else{
						SupplyDelivery.occurrence.occurrenceDateTime = rez[i].occurrence_date_time;
					}
					var occurrenceperiod_start,occurrenceperiod_end;
					if(rez[i].occurrence_period_start == null){
						occurrenceperiod_start = formatDate(rez[i].occurrence_period_start);  
					}else{
						occurrenceperiod_start = rez[i].occurrence_period_start;  
					}
					if(rez[i].occurrence_period_end == null){
						occurrenceperiod_end = formatDate(rez[i].occurrence_period_end);  
					}else{
						occurrenceperiod_end = rez[i].occurrence_period_end;  
					}
					SupplyDelivery.occurrence.occurrencePeriod = occurrenceperiod_start + ' to ' + occurrenceperiod_end;
					SupplyDelivery.occurrence.occurrenceTiming = rez[i].occurrence_timing;
					if(rez[i].supplier_practitioner != "null"){
						SupplyDelivery.supplier.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].supplier_practitioner;
					} else {
						SupplyDelivery.supplier.practitioner = "";
					}
					if(rez[i].supplier_org != "null"){
						SupplyDelivery.supplier.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].supplier_org;
					} else {
						SupplyDelivery.supplier.organization = "";
					}
					SupplyDelivery.destination = rez[i].destination;
					
          arrSupplyDelivery[i] = SupplyDelivery;
        }
        res.json({"err_code":0,"data": arrSupplyDelivery});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getSupplyDelivery"});
      });
    }
  },
	post: {
		supplyDelivery: function addSupplyDelivery(req, res) {
			console.log(req.body);
			var supply_delivery_id  = req.body.supply_delivery_id;
			var identifier  = req.body.identifier;
			var part_of  = req.body.part_of;
			var status  = req.body.status;
			var patient  = req.body.patient;
			var type  = req.body.type;
			var supplied_item_qty  = req.body.supplied_item_qty;
			var item_codeable_concept  = req.body.item_codeable_concept;
			var item_ref_medication  = req.body.item_ref_medication;
			var item_ref_substance  = req.body.item_ref_substance;
			var item_ref_device  = req.body.item_ref_device;
			var occurrence_date_time  = req.body.occurrence_date_time;
			var occurrence_period_start  = req.body.occurrence_period_start;
			var occurrence_period_end  = req.body.occurrence_period_end;
			var occurrence_timing  = req.body.occurrence_timing;
			var supplier_practitioner  = req.body.supplier_practitioner;
			var supplier_org  = req.body.supplier_org;
			var destination  = req.body.destination;
			var charge_item_id  = req.body.charge_item_id;
			
			var column = "";
      var values = "";
			
				
			if (typeof identifier !== 'undefined' && identifier !== "") {
        column += 'identifier,';
        values += "'" + identifier + "',";
      }
			
			if (typeof part_of !== 'undefined' && part_of !== "") {
        column += 'part_of,';
        values += "'" + part_of + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }	
			
			if (typeof supplied_item_qty !== 'undefined' && supplied_item_qty !== "") {
        column += 'supplied_item_qty,';
        values += " " + supplied_item_qty + ",";
      }	
			
			if (typeof item_codeable_concept !== 'undefined' && item_codeable_concept !== "") {
        column += 'item_codeable_concept,';
        values += "'" + item_codeable_concept + "',";
      }	
			
			if (typeof item_ref_medication !== 'undefined' && item_ref_medication !== "") {
        column += 'item_ref_medication,';
        values += "'" + item_ref_medication + "',";
      }	
			
			if (typeof item_ref_substance !== 'undefined' && item_ref_substance !== "") {
        column += 'item_ref_substance,';
        values += "'" + item_ref_substance + "',";
      }		
			
			if (typeof item_ref_device !== 'undefined' && item_ref_device !== "") {
        column += 'item_ref_device,';
        values += "'" + item_ref_device + "',";
      }		
			
			if (typeof occurrence_date_time !== 'undefined' && occurrence_date_time !== "") {
        column += 'occurrence_date_time,';
				values += "to_date('"+ occurrence_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof occurrence_period_start !== 'undefined' && occurrence_period_start !== "") {
        column += 'occurrence_period_start,';
				values += "to_date('"+ occurrence_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof occurrence_period_end !== 'undefined' && occurrence_period_end !== "") {
        column += 'occurrence_period_end,';
				values += "to_date('"+ occurrence_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof occurrence_timing !== 'undefined' && occurrence_timing !== "") {
        column += 'occurrence_timing,';
        values += "'" + occurrence_timing + "',";
      }		
			
			if (typeof supplier_practitioner !== 'undefined' && supplier_practitioner !== "") {
        column += 'supplier_practitioner,';
        values += "'" + supplier_practitioner + "',";
      }
			
			if (typeof supplier_org !== 'undefined' && supplier_org !== "") {
        column += 'supplier_org,';
        values += "'" + supplier_org + "',";
      }
			
			if (typeof destination !== 'undefined' && destination !== "") {
        column += 'destination,';
        values += "'" + destination + "',";
      }
			
			if (typeof charge_item_id !== 'undefined' && charge_item_id !== "") {
        column += 'charge_item_id,';
        values += "'" + charge_item_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.supply_delivery(supply_delivery_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+supply_delivery_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select supply_delivery_id from BACIRO_FHIR.supply_delivery WHERE supply_delivery_id = '" + supply_delivery_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSupplyDelivery"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSupplyDelivery"});
      });
    }
	},
	put: {
		supplyDelivery: function updateSupplyDelivery(req, res) {
			console.log(req.body);
			var supply_delivery_id  = req.params.supply_delivery_id;
			var identifier  = req.body.identifier;
			var part_of  = req.body.part_of;
			var status  = req.body.status;
			var patient  = req.body.patient;
			var type  = req.body.type;
			var supplied_item_qty  = req.body.supplied_item_qty;
			var item_codeable_concept  = req.body.item_codeable_concept;
			var item_ref_medication  = req.body.item_ref_medication;
			var item_ref_substance  = req.body.item_ref_substance;
			var item_ref_device  = req.body.item_ref_device;
			var occurrence_date_time  = req.body.occurrence_date_time;
			var occurrence_period_start  = req.body.occurrence_period_start;
			var occurrence_period_end  = req.body.occurrence_period_end;
			var occurrence_timing  = req.body.occurrence_timing;
			var supplier_practitioner  = req.body.supplier_practitioner;
			var supplier_org  = req.body.supplier_org;
			var destination  = req.body.destination;
			var charge_item_id  = req.body.charge_item_id;
			
			var column = "";
      var values = "";
			
				
			if (typeof identifier !== 'undefined' && identifier !== "") {
        column += 'identifier,';
        values += "'" + identifier + "',";
      }
			
			if (typeof part_of !== 'undefined' && part_of !== "") {
        column += 'part_of,';
        values += "'" + part_of + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof patient !== 'undefined' && patient !== "") {
        column += 'patient,';
        values += "'" + patient + "',";
      }	
			
			if (typeof type !== 'undefined' && type !== "") {
        column += 'type,';
        values += "'" + type + "',";
      }	
			
			if (typeof supplied_item_qty !== 'undefined' && supplied_item_qty !== "") {
        column += 'supplied_item_qty,';
        values += " " + supplied_item_qty + ",";
      }	
			
			if (typeof item_codeable_concept !== 'undefined' && item_codeable_concept !== "") {
        column += 'item_codeable_concept,';
        values += "'" + item_codeable_concept + "',";
      }	
			
			if (typeof item_ref_medication !== 'undefined' && item_ref_medication !== "") {
        column += 'item_ref_medication,';
        values += "'" + item_ref_medication + "',";
      }	
			
			if (typeof item_ref_substance !== 'undefined' && item_ref_substance !== "") {
        column += 'item_ref_substance,';
        values += "'" + item_ref_substance + "',";
      }		
			
			if (typeof item_ref_device !== 'undefined' && item_ref_device !== "") {
        column += 'item_ref_device,';
        values += "'" + item_ref_device + "',";
      }		
			
			if (typeof occurrence_date_time !== 'undefined' && occurrence_date_time !== "") {
        column += 'occurrence_date_time,';
				values += "to_date('"+ occurrence_date_time + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof occurrence_period_start !== 'undefined' && occurrence_period_start !== "") {
        column += 'occurrence_period_start,';
				values += "to_date('"+ occurrence_period_start + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof occurrence_period_end !== 'undefined' && occurrence_period_end !== "") {
        column += 'occurrence_period_end,';
				values += "to_date('"+ occurrence_period_end + "', 'yyyy-MM-dd'),";
      }
			
			if (typeof occurrence_timing !== 'undefined' && occurrence_timing !== "") {
        column += 'occurrence_timing,';
        values += "'" + occurrence_timing + "',";
      }		
			
			if (typeof supplier_practitioner !== 'undefined' && supplier_practitioner !== "") {
        column += 'supplier_practitioner,';
        values += "'" + supplier_practitioner + "',";
      }
			
			if (typeof supplier_org !== 'undefined' && supplier_org !== "") {
        column += 'supplier_org,';
        values += "'" + supplier_org + "',";
      }
			
			if (typeof destination !== 'undefined' && destination !== "") {
        column += 'destination,';
        values += "'" + destination + "',";
      }
			
			if (typeof charge_item_id !== 'undefined' && charge_item_id !== "") {
        column += 'charge_item_id,';
        values += "'" + charge_item_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "supply_delivery_id = '" + supply_delivery_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.supply_delivery(supply_delivery_id," + column.slice(0, -1) + ") SELECT supply_delivery_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.supply_delivery WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select supply_delivery_id from BACIRO_FHIR.supply_delivery WHERE supply_delivery_id = '" + supply_delivery_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSupplyDelivery"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSupplyDelivery"});
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