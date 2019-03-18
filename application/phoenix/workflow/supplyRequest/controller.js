var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var yamlconfig = require('yaml-config');
var path = require('path');

var configYaml = yamlconfig.readConfig(path.resolve('../../application/config/config.yml'));

//supplyRequest emitter
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
		supplyRequest: function getSupplyRequest(req, res){
			var apikey = req.params.apikey;
			var supplyRequestId = req.query._id;
			
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
			
			if(typeof supplyRequestId !== 'undefined' && supplyRequestId !== ""){
        condition += "dr.diagnostic_report_id = '" + supplyRequestId + "' AND,";  
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
			
			var arrSupplyRequest = [];
      var query = "select sr.supply_request_id as supply_request_id, sr.identfiier as identfiier, sr.status as status, sr.category as category, sr.priority as priority, sr.ordered_item_qty as ordered_item_qty, sr.orderes_item_codeable_concept as orderes_item_codeable_concept, sr.item_ref_medication as item_ref_medication, sr.item_ref_substance as item_ref_substance, sr.item_ref_device as item_ref_device, sr.occurrence_date_time as occurrence_date_time, sr.occurrence_period_start as occurrence_period_start, sr.occurrence_period_end as occurrence_period_end, sr.occurrence_timing as occurrence_timing, sr.authored_on as authored_on, sr.req_agent_practitioner as req_agent_practitioner, sr.req_agent_org as req_agent_org, sr.req_agent_patient as req_agent_patient, sr.req_agent_related_person as req_agent_related_person, sr.req_agent_device as req_agent_device, sr.req_on_behalf_of as req_on_behalf_of, sr.reason_codeable_concept as reason_codeable_concept, sr.reason_reference as reason_reference, sr.deliver_from_org as deliver_from_org, sr.deliver_from_location as deliver_from_location, sr.deliver_to_org as deliver_to_org, sr.deliver_to_location as deliver_to_location, sr.deliver_to_patient as deliver_to_patient from BACIRO_FHIR.supply_request sr " + fixCondition;
			//console.log(query);			
      db.query(query,function(dataJson){
        rez = lowercaseObject(dataJson);
				for(i = 0; i < rez.length; i++){
          var SupplyRequest = {};
					SupplyRequest.resourceType = "SupplyRequest";
          SupplyRequest.id = rez[i].supply_request_id;
					SupplyRequest.identfiier = rez[i].identfiier;
					SupplyRequest.status = rez[i].status;
					SupplyRequest.category = rez[i].category;
					SupplyRequest.priority = rez[i].priority;
					SupplyRequest.orderedItem.quantity = rez[i].ordered_item_qty;
					SupplyRequest.orderedItem.item.itemCodeableConcept = rez[i].orderes_item_codeable_concept;
					var arrItemReference = [];
					var ItemReference = {};
					if(rez[i].item_ref_medication != "null"){
						ItemReference.medication = hostFHIR + ':' + portFHIR + '/' + apikey + '/Medication?_id=' +  rez[i].item_ref_medication;
					} else {
						ItemReference.medication = "";
					}
					if(rez[i].item_ref_substance != "null"){
						ItemReference.substance = hostFHIR + ':' + portFHIR + '/' + apikey + '/Substance?_id=' +  rez[i].item_ref_substance;
					} else {
						ItemReference.substance = "";
					}
					if(rez[i].item_ref_device != "null"){
						ItemReference.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].item_ref_device;
					} else {
						ItemReference.device = "";
					}
					arrItemReference[i] = ItemReference;
					SupplyRequest.orderedItem.item.itemReference = arrItemReference;
					
					if(rez[i].occurrence_date_time == null){
						SupplyRequest.occurrence.occurrenceDateTime = formatDate(rez[i].occurrence_date_time);
					}else{
						SupplyRequest.occurrence.occurrenceDateTime = rez[i].occurrence_date_time;
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
					SupplyRequest.occurrence.occurrencePeriod = occurrenceperiod_start + ' to ' + occurrenceperiod_end;
					SupplyRequest.occurrence.occurrenceTiming = rez[i].occurrence_timing;
					
					if(rez[i].authored_on == null){
						SupplyRequest.authoredOn = formatDate(rez[i].authored_on);
					}else{
						SupplyRequest.authoredOn = rez[i].authored_on;
					}
					var arrAgent = [];
					var Agent = {};
					if(rez[i].req_agent_practitioner != "null"){
						Agent.practitioner = hostFHIR + ':' + portFHIR + '/' + apikey + '/Practitioner?_id=' +  rez[i].req_agent_practitioner;
					} else {
						Agent.practitioner = "";
					}
					if(rez[i].req_agent_org != "null"){
						Agent.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].req_agent_org;
					} else {
						Agent.organization = "";
					}
					if(rez[i].req_agent_patient != "null"){
						Agent.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].req_agent_patient;
					} else {
						Agent.patient = "";
					}
					if(rez[i].req_agent_related_person != "null"){
						Agent.relatedPerson = hostFHIR + ':' + portFHIR + '/' + apikey + '/RelatedPerson?_id=' +  rez[i].req_agent_related_person;
					} else {
						Agent.relatedPerson = "";
					}
					if(rez[i].req_agent_device != "null"){
						Agent.device = hostFHIR + ':' + portFHIR + '/' + apikey + '/Device?_id=' +  rez[i].req_agent_device;
					} else {
						Agent.device = "";
					}
					arrAgent[i] = Agent;
					SupplyRequest.requester.agent = arrAgent;
					if(rez[i].req_on_behalf_of != "null"){
						SupplyRequest.requester.onBehalfOf = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].req_on_behalf_of;
					} else {
						SupplyRequest.requester.onBehalfOf = "";
					}
					SupplyRequest.reason.reasonCodeableConcept = rez[i].reason_codeable_concept;
					SupplyRequest.reason.reasonReference = rez[i].reason_reference;
					var arrDeliverFrom = [];
					var DeliverFrom = {};
					if(rez[i].deliver_from_location != "null"){
						DeliverFrom.location = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].deliver_from_location;
					} else {
						DeliverFrom.location = "";
					}
					if(rez[i].deliver_from_org != "null"){
						DeliverFrom.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].deliver_from_org;
					} else {
						DeliverFrom.organization = "";
					}
					arrDeliverFrom[i] = DeliverFrom;
					SupplyRequest.deliverFrom = arrDeliverFrom;
					var arrDeliverTo = [];
					var DeliverTo = {};
					if(rez[i].deliver_to_location != "null"){
						DeliverTo.location = hostFHIR + ':' + portFHIR + '/' + apikey + '/Location?_id=' +  rez[i].deliver_to_location;
					} else {
						DeliverTo.location = "";
					}
					if(rez[i].deliver_to_org != "null"){
						DeliverTo.organization = hostFHIR + ':' + portFHIR + '/' + apikey + '/Organization?_id=' +  rez[i].deliver_to_org;
					} else {
						DeliverTo.organization = "";
					}
					if(rez[i].deliver_to_patient != "null"){
						DeliverTo.patient = hostFHIR + ':' + portFHIR + '/' + apikey + '/Patient?_id=' +  rez[i].deliver_to_patient;
					} else {
						DeliverTo.patient = "";
					}
					arrDeliverTo[i] = DeliverTo;
					SupplyRequest.deliverTo = arrDeliverTo;
					
          arrSupplyRequest[i] = SupplyRequest;
        }
        res.json({"err_code":0,"data": arrSupplyRequest});
      },function(e){
        res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "getSupplyRequest"});
      });
    }
  },
	post: {
		supplyRequest: function addSupplyRequest(req, res) {
			console.log(req.body);
			var supply_request_id  = req.body.supply_request_id;
			var identfiier  = req.body.identfiier;
			var status  = req.body.status;
			var category  = req.body.category;
			var priority  = req.body.priority;
			var ordered_item_qty  = req.body.ordered_item_qty;
			var orderes_item_codeable_concept  = req.body.orderes_item_codeable_concept;
			var item_ref_medication  = req.body.item_ref_medication;
			var item_ref_substance  = req.body.item_ref_substance;
			var item_ref_device  = req.body.item_ref_device;
			var occurrence_date_time  = req.body.occurrence_date_time;
			var occurrence_period_start  = req.body.occurrence_period_start;
			var occurrence_period_end  = req.body.occurrence_period_end;
			var occurrence_timing  = req.body.occurrence_timing;
			var authored_on  = req.body.authored_on;
			var req_agent_practitioner  = req.body.req_agent_practitioner;
			var req_agent_org  = req.body.req_agent_org;
			var req_agent_patient  = req.body.req_agent_patient;
			var req_agent_related_person  = req.body.req_agent_related_person;
			var req_agent_device  = req.body.req_agent_device;
			var req_on_behalf_of  = req.body.req_on_behalf_of;
			var reason_codeable_concept  = req.body.reason_codeable_concept;
			var reason_reference  = req.body.reason_reference;
			var deliver_from_org  = req.body.deliver_from_org;
			var deliver_from_location  = req.body.deliver_from_location;
			var deliver_to_org  = req.body.deliver_to_org;
			var deliver_to_location  = req.body.deliver_to_location;
			var deliver_to_patient  = req.body.deliver_to_patient;
			var supply_delivery_id  = req.body.supply_delivery_id;
			
			var column = "";
      var values = "";
			
				
			if (typeof identfiier !== 'undefined' && identfiier !== "") {
        column += 'identfiier,';
        values += "'" + identfiier + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }	
			
			if (typeof priority !== 'undefined' && priority !== "") {
        column += 'priority,';
        values += "'" + priority + "',";
      }	
			
			if (typeof ordered_item_qty !== 'undefined' && ordered_item_qty !== "") {
        column += 'ordered_item_qty,';
        values += " " + ordered_item_qty + ",";
      }	
			
			if (typeof orderes_item_codeable_concept !== 'undefined' && orderes_item_codeable_concept !== "") {
        column += 'orderes_item_codeable_concept,';
        values += "'" + orderes_item_codeable_concept + "',";
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
			
			if (typeof authored_on !== 'undefined' && authored_on !== "") {
        column += 'authored_on,';
				values += "to_date('"+ authored_on + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof req_agent_practitioner !== 'undefined' && req_agent_practitioner !== "") {
        column += 'req_agent_practitioner,';
        values += "'" + req_agent_practitioner + "',";
      }
			
			if (typeof req_agent_org !== 'undefined' && req_agent_org !== "") {
        column += 'req_agent_org,';
        values += "'" + req_agent_org + "',";
      }
			
			if (typeof req_agent_patient !== 'undefined' && req_agent_patient !== "") {
        column += 'req_agent_patient,';
        values += "'" + req_agent_patient + "',";
      }
			
			if (typeof req_agent_related_person !== 'undefined' && req_agent_related_person !== "") {
        column += 'req_agent_related_person,';
        values += "'" + req_agent_related_person + "',";
      }
			
			if (typeof req_agent_device !== 'undefined' && req_agent_device !== "") {
        column += 'req_agent_device,';
        values += "'" + req_agent_device + "',";
      }
			
			if (typeof req_on_behalf_of !== 'undefined' && req_on_behalf_of !== "") {
        column += 'req_on_behalf_of,';
        values += "'" + req_on_behalf_of + "',";
      }
			
			if (typeof reason_codeable_concept !== 'undefined' && reason_codeable_concept !== "") {
        column += 'reason_codeable_concept,';
        values += "'" + reason_codeable_concept + "',";
      }
			
			if (typeof reason_reference !== 'undefined' && reason_reference !== "") {
        column += 'reason_reference,';
        values += "'" + reason_reference + "',";
      }
			
			if (typeof deliver_from_org !== 'undefined' && deliver_from_org !== "") {
        column += 'deliver_from_org,';
        values += "'" + deliver_from_org + "',";
      }
			
			if (typeof deliver_from_location !== 'undefined' && deliver_from_location !== "") {
        column += 'deliver_from_location,';
        values += "'" + deliver_from_location + "',";
      }
			
			if (typeof deliver_to_org !== 'undefined' && deliver_to_org !== "") {
        column += 'deliver_to_org,';
        values += "'" + deliver_to_org + "',";
      }
			
			if (typeof deliver_to_location !== 'undefined' && deliver_to_location !== "") {
        column += 'deliver_to_location,';
        values += "'" + deliver_to_location + "',";
      }
			
			if (typeof deliver_to_patient !== 'undefined' && deliver_to_patient !== "") {
        column += 'deliver_to_patient,';
        values += "'" + deliver_to_patient + "',";
      }
			
			if (typeof supply_delivery_id !== 'undefined' && supply_delivery_id !== "") {
        column += 'supply_delivery_id,';
        values += "'" + supply_delivery_id + "',";
      }
			
			var query = "UPSERT INTO BACIRO_FHIR.supply_request(supply_request_id, " + column.slice(0, -1) + ")"+
        " VALUES ('"+supply_request_id+"', " + values.slice(0, -1) + ")";
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select supply_request_id from BACIRO_FHIR.supply_request WHERE supply_request_id = '" + supply_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "addSupplyRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "addSupplyRequest"});
      });
    }
	},
	put: {
		supplyRequest: function updateSupplyRequest(req, res) {
			console.log(req.body);
			var supply_request_id  = req.params.supply_request_id;
			var identfiier  = req.body.identfiier;
			var status  = req.body.status;
			var category  = req.body.category;
			var priority  = req.body.priority;
			var ordered_item_qty  = req.body.ordered_item_qty;
			var orderes_item_codeable_concept  = req.body.orderes_item_codeable_concept;
			var item_ref_medication  = req.body.item_ref_medication;
			var item_ref_substance  = req.body.item_ref_substance;
			var item_ref_device  = req.body.item_ref_device;
			var occurrence_date_time  = req.body.occurrence_date_time;
			var occurrence_period_start  = req.body.occurrence_period_start;
			var occurrence_period_end  = req.body.occurrence_period_end;
			var occurrence_timing  = req.body.occurrence_timing;
			var authored_on  = req.body.authored_on;
			var req_agent_practitioner  = req.body.req_agent_practitioner;
			var req_agent_org  = req.body.req_agent_org;
			var req_agent_patient  = req.body.req_agent_patient;
			var req_agent_related_person  = req.body.req_agent_related_person;
			var req_agent_device  = req.body.req_agent_device;
			var req_on_behalf_of  = req.body.req_on_behalf_of;
			var reason_codeable_concept  = req.body.reason_codeable_concept;
			var reason_reference  = req.body.reason_reference;
			var deliver_from_org  = req.body.deliver_from_org;
			var deliver_from_location  = req.body.deliver_from_location;
			var deliver_to_org  = req.body.deliver_to_org;
			var deliver_to_location  = req.body.deliver_to_location;
			var deliver_to_patient  = req.body.deliver_to_patient;
			var supply_delivery_id  = req.body.supply_delivery_id;
			
			var column = "";
      var values = "";
			
				
			if (typeof identfiier !== 'undefined' && identfiier !== "") {
        column += 'identfiier,';
        values += "'" + identfiier + "',";
      }
			
			if (typeof status !== 'undefined' && status !== "") {
        column += 'status,';
        values += "'" + status + "',";
      }
			
			if (typeof category !== 'undefined' && category !== "") {
        column += 'category,';
        values += "'" + category + "',";
      }	
			
			if (typeof priority !== 'undefined' && priority !== "") {
        column += 'priority,';
        values += "'" + priority + "',";
      }	
			
			if (typeof ordered_item_qty !== 'undefined' && ordered_item_qty !== "") {
        column += 'ordered_item_qty,';
        values += " " + ordered_item_qty + ",";
      }	
			
			if (typeof orderes_item_codeable_concept !== 'undefined' && orderes_item_codeable_concept !== "") {
        column += 'orderes_item_codeable_concept,';
        values += "'" + orderes_item_codeable_concept + "',";
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
			
			if (typeof authored_on !== 'undefined' && authored_on !== "") {
        column += 'authored_on,';
				values += "to_date('"+ authored_on + "', 'yyyy-MM-dd HH:mm'),";
      }
			
			if (typeof req_agent_practitioner !== 'undefined' && req_agent_practitioner !== "") {
        column += 'req_agent_practitioner,';
        values += "'" + req_agent_practitioner + "',";
      }
			
			if (typeof req_agent_org !== 'undefined' && req_agent_org !== "") {
        column += 'req_agent_org,';
        values += "'" + req_agent_org + "',";
      }
			
			if (typeof req_agent_patient !== 'undefined' && req_agent_patient !== "") {
        column += 'req_agent_patient,';
        values += "'" + req_agent_patient + "',";
      }
			
			if (typeof req_agent_related_person !== 'undefined' && req_agent_related_person !== "") {
        column += 'req_agent_related_person,';
        values += "'" + req_agent_related_person + "',";
      }
			
			if (typeof req_agent_device !== 'undefined' && req_agent_device !== "") {
        column += 'req_agent_device,';
        values += "'" + req_agent_device + "',";
      }
			
			if (typeof req_on_behalf_of !== 'undefined' && req_on_behalf_of !== "") {
        column += 'req_on_behalf_of,';
        values += "'" + req_on_behalf_of + "',";
      }
			
			if (typeof reason_codeable_concept !== 'undefined' && reason_codeable_concept !== "") {
        column += 'reason_codeable_concept,';
        values += "'" + reason_codeable_concept + "',";
      }
			
			if (typeof reason_reference !== 'undefined' && reason_reference !== "") {
        column += 'reason_reference,';
        values += "'" + reason_reference + "',";
      }
			
			if (typeof deliver_from_org !== 'undefined' && deliver_from_org !== "") {
        column += 'deliver_from_org,';
        values += "'" + deliver_from_org + "',";
      }
			
			if (typeof deliver_from_location !== 'undefined' && deliver_from_location !== "") {
        column += 'deliver_from_location,';
        values += "'" + deliver_from_location + "',";
      }
			
			if (typeof deliver_to_org !== 'undefined' && deliver_to_org !== "") {
        column += 'deliver_to_org,';
        values += "'" + deliver_to_org + "',";
      }
			
			if (typeof deliver_to_location !== 'undefined' && deliver_to_location !== "") {
        column += 'deliver_to_location,';
        values += "'" + deliver_to_location + "',";
      }
			
			if (typeof deliver_to_patient !== 'undefined' && deliver_to_patient !== "") {
        column += 'deliver_to_patient,';
        values += "'" + deliver_to_patient + "',";
      }
			
			if (typeof supply_delivery_id !== 'undefined' && supply_delivery_id !== "") {
        column += 'supply_delivery_id,';
        values += "'" + supply_delivery_id + "',";
      }
			
			var domainResource = req.params.dr;
			var arrResource = domainResource.split('|');
			var fieldResource = arrResource[0];
			var valueResource = arrResource[1];
			var condition = "supply_request_id = '" + supply_request_id + "' AND " + fieldResource + " = '" + valueResource + "'";

      var query = "UPSERT INTO BACIRO_FHIR.supply_request(supply_request_id," + column.slice(0, -1) + ") SELECT supply_request_id, " + values.slice(0, -1) + " FROM BACIRO_FHIR.supply_request WHERE " + condition;
			
			console.log(query);
      db.upsert(query,function(succes){
        var query2 = "select supply_request_id from BACIRO_FHIR.supply_request WHERE supply_request_id = '" + supply_request_id + "' ";
				console.log(query2);
				db.query(query2,function(dataJson){
          rez = lowercaseObject(dataJson);
          res.json({"err_code":0,"data":rez});
        },function(e){
          res.json({"err_code": 1, "err_msg":e, "application": "Api Phoenix", "function": "updateSupplyRequest"});
        });
      },function(e){
          res.json({"err_code": 2, "err_msg":e, "application": "Api Phoenix", "function": "updateSupplyRequest"});
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